package main

import (
	"context"
	"flag"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"srv.exe.dev/internal/blog"
	"srv.exe.dev/internal/githubapi"
)

type PageData struct {
	BasePath    string
	CurrentPage string
	Projects    []githubapi.Project
	Info        string
	Error       string
}

type BlogPageData struct {
	PageData
	Posts []blog.Post
	Post  *blog.Post
}

func main() {
	outDir := flag.String("out", "dist", "output directory")
	githubUser := flag.String("github", "HexSleeves", "GitHub username for projects")
	basePath := flag.String("base", "", "base path for URLs (e.g., /portfolio for GitHub Pages)")
	flag.Parse()

	// Normalize base path
	base := strings.TrimSuffix(*basePath, "/")

	// Get templates directory
	_, thisFile, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(filepath.Dir(thisFile))
	templatesDir := filepath.Join(baseDir, "..", "srv", "templates")
	postsDir := filepath.Join(baseDir, "..", "srv", "posts")
	staticDir := filepath.Join(baseDir, "..", "srv", "static")

	// Create output directory first
	if err := os.MkdirAll(*outDir, 0o750); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output dir: %v\n", err)
		os.Exit(1)
	}

	// Fetch GitHub projects
	projects := fetchGitHubProjects(*githubUser)
	tmpl, err := loadTemplates(templatesDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading templates: %v\n", err)
		os.Exit(1)
	}

	// Pages to render
	pages := []struct {
		template string
		output   string
		page     string
	}{
		{"home.html", "index.html", "home"},
		{"resume.html", "resume/index.html", "resume"},
		{"showcase.html", "projects/index.html", "showcase"},
	}

	for _, page := range pages {
		data := PageData{
			BasePath:    base,
			CurrentPage: page.page,
			Projects:    projects,
		}
		if err := renderTemplate(tmpl, *outDir, page.template, page.output, data); err != nil {
			fmt.Fprintf(os.Stderr, "Error rendering %s: %v\n", page.template, err)
			os.Exit(1)
		}
		fmt.Printf("Generated %s\n", page.output)
	}

	posts, err := blog.LoadPosts(postsDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading blog posts: %v\n", err)
		os.Exit(1)
	}

	blogData := BlogPageData{
		PageData: PageData{
			BasePath:    base,
			CurrentPage: "blog",
			Projects:    projects,
		},
		Posts: posts,
	}
	if err := renderTemplate(tmpl, *outDir, "blog.html", "blog/index.html", blogData); err != nil {
		fmt.Fprintf(os.Stderr, "Error rendering blog index: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Generated blog/index.html")

	for _, post := range posts {
		post := post
		postData := BlogPageData{
			PageData: PageData{
				BasePath:    base,
				CurrentPage: "blog",
				Projects:    projects,
			},
			Post: &post,
		}
		outPath := filepath.Join("blog", post.Slug, "index.html")
		if err := renderTemplate(tmpl, *outDir, "blog_post.html", outPath, postData); err != nil {
			fmt.Fprintf(os.Stderr, "Error rendering blog post %s: %v\n", post.Slug, err)
			os.Exit(1)
		}
		fmt.Printf("Generated %s\n", outPath)
	}

	outStaticDir := filepath.Join(*outDir, "static")
	if err := copyDir(staticDir, outStaticDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error copying static files: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Copied static files to %s\n", outStaticDir)

	if base != "" {
		fmt.Printf("\nBuilt with base path: %s\n", base)
	}
	fmt.Println("Build complete!")
}

func fetchGitHubProjects(username string) []githubapi.Project {
	client := &http.Client{Timeout: 10 * time.Second}
	projects, err := githubapi.FetchProjects(context.Background(), client, username, os.Getenv("GITHUB_TOKEN"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Could not fetch GitHub repos: %v\n", err)
		return nil
	}
	fmt.Printf("Fetched %d projects from GitHub\n", len(projects))
	return projects
}

func loadTemplates(templatesDir string) (*template.Template, error) {
	return template.ParseGlob(filepath.Join(templatesDir, "*.html"))
}

func renderTemplate(tmpl *template.Template, outDir, templateName, outputPath string, data any) error {
	outRoot, err := os.OpenRoot(outDir)
	if err != nil {
		return err
	}
	defer outRoot.Close()

	parentDir := filepath.Dir(outputPath)
	if parentDir != "." {
		if err := outRoot.MkdirAll(parentDir, 0o750); err != nil {
			return err
		}
	}

	f, err := outRoot.Create(outputPath)
	if err != nil {
		return err
	}
	defer f.Close()

	return tmpl.ExecuteTemplate(f, templateName, data)
}

func copyDir(srcDir, dstDir string) error {
	if err := os.MkdirAll(dstDir, 0o750); err != nil {
		return err
	}

	srcRoot, err := os.OpenRoot(srcDir)
	if err != nil {
		return err
	}
	defer srcRoot.Close()

	dstRoot, err := os.OpenRoot(dstDir)
	if err != nil {
		return err
	}
	defer dstRoot.Close()

	return fs.WalkDir(srcRoot.FS(), ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path == "." {
			return nil
		}
		if d.IsDir() {
			return dstRoot.MkdirAll(path, 0o750)
		}

		parentDir := filepath.Dir(path)
		if parentDir != "." {
			if err := dstRoot.MkdirAll(parentDir, 0o750); err != nil {
				return err
			}
		}

		srcFile, err := srcRoot.Open(path)
		if err != nil {
			return err
		}
		defer srcFile.Close()

		dstFile, err := dstRoot.Create(path)
		if err != nil {
			return err
		}
		defer dstFile.Close()

		_, err = io.Copy(dstFile, srcFile)
		return err
	})
}
