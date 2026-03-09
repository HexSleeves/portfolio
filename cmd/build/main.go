package main

import (
	"context"
	"flag"
	"fmt"
	"html/template"
	"io"
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
	BasePath string
	Projects []githubapi.Project
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
	data := PageData{
		BasePath: base,
		Projects: projects,
	}

	// Pages to render
	pages := []struct {
		template string
		output   string
	}{
		{"home.html", "index.html"},
		{"resume.html", "resume/index.html"},
		{"showcase.html", "projects/index.html"},
	}

	for _, page := range pages {
		if err := renderTemplate(templatesDir, *outDir, page.template, page.output, data); err != nil {
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
		PageData: data,
		Posts:    posts,
	}
	if err := renderTemplate(templatesDir, *outDir, "blog.html", "blog/index.html", blogData); err != nil {
		fmt.Fprintf(os.Stderr, "Error rendering blog index: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Generated blog/index.html")

	for _, post := range posts {
		post := post
		postData := BlogPageData{
			PageData: data,
			Post:     &post,
		}
		outPath := filepath.Join("blog", post.Slug, "index.html")
		if err := renderTemplate(templatesDir, *outDir, "blog_post.html", outPath, postData); err != nil {
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

func renderTemplate(templatesDir, outDir, templateName, outputPath string, data any) error {
	tmpl, err := template.ParseFiles(filepath.Join(templatesDir, templateName))
	if err != nil {
		return err
	}

	fullOutPath := filepath.Join(outDir, outputPath)
	if err := os.MkdirAll(filepath.Dir(fullOutPath), 0o750); err != nil {
		return err
	}

	f, err := os.Create(fullOutPath)
	if err != nil {
		return err
	}
	defer f.Close()

	return tmpl.Execute(f, data)
}

func copyDir(srcDir, dstDir string) error {
	if err := os.MkdirAll(dstDir, 0o750); err != nil {
		return err
	}

	return filepath.WalkDir(srcDir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(srcDir, path)
		if err != nil {
			return err
		}
		if relPath == "." {
			return nil
		}

		dstPath := filepath.Join(dstDir, relPath)
		if d.IsDir() {
			return os.MkdirAll(dstPath, 0o750)
		}

		srcFile, err := os.Open(path)
		if err != nil {
			return err
		}
		defer srcFile.Close()

		dstFile, err := os.Create(dstPath)
		if err != nil {
			return err
		}
		defer dstFile.Close()

		_, err = io.Copy(dstFile, srcFile)
		return err
	})
}
