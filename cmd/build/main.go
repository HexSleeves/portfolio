package main

import (
	"encoding/json"
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
)

type Project struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	URL         string `json:"html_url"`
	Language    string `json:"language"`
	Stars       int    `json:"stargazers_count"`
	Forks       int    `json:"forks_count"`
}

type PageData struct {
	BasePath string
	Projects []Project
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

	// Create output directory first
	if err := os.MkdirAll(*outDir, 0o750); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output dir: %v\n", err)
		os.Exit(1)
	}

	// Create output directory root for secure file operations
	outRoot, err := os.OpenRoot(*outDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output root: %v\n", err)
		os.Exit(1)
	}

	// Create source directory roots for secure file operations
	templatesRoot, err := os.OpenRoot(templatesDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating templates root: %v\n", err)
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
		outPath := page.output

		// Create subdirectory if needed
		fullOutPath := filepath.Join(*outDir, page.output)
		if err := os.MkdirAll(filepath.Dir(fullOutPath), 0o750); err != nil {
			fmt.Fprintf(os.Stderr, "Error creating dir for %s: %v\n", page.output, err)
			os.Exit(1)
		}

		// Parse and render template using root
		tmplFile, err := templatesRoot.Open(page.template)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error opening template %s: %v\n", page.template, err)
			os.Exit(1)
		}

		tmpl, err := template.ParseFiles(tmplFile.Name())
		_ = tmplFile.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing %s: %v\n", page.template, err)
			os.Exit(1)
		}

		f, err := outRoot.Create(outPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error creating %s: %v\n", page.output, err)
			os.Exit(1)
		}

		if err := tmpl.Execute(f, data); err != nil {
			_ = f.Close() // ignore error since we're already failing
			fmt.Fprintf(os.Stderr, "Error rendering %s: %v\n", page.template, err)
			os.Exit(1)
		}
		if err := f.Close(); err != nil {
			fmt.Fprintf(os.Stderr, "Error closing %s: %v\n", page.output, err)
			os.Exit(1)
		}

		fmt.Printf("Generated %s\n", outPath)
	}

	// Copy static files
	staticDir := filepath.Join(baseDir, "..", "srv", "static")
	staticRoot, err := os.OpenRoot(staticDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating static root: %v\n", err)
		os.Exit(1)
	}
	outStaticDir := "static"
	if err := copyDir(staticRoot, outRoot, staticDir, outStaticDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error copying static files: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Copied static files to %s\n", outStaticDir)

	if base != "" {
		fmt.Printf("\nBuilt with base path: %s\n", base)
	}
	fmt.Println("Build complete!")
}

func fetchGitHubProjects(username string) []Project {
	client := &http.Client{Timeout: 10 * time.Second}
	url := fmt.Sprintf("https://api.github.com/users/%s/repos?sort=updated&per_page=12", username)

	resp, err := client.Get(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Could not fetch GitHub repos: %v\n", err)
		return nil
	}
	defer func() {
		if closeErr := resp.Body.Close(); closeErr != nil {
			fmt.Fprintf(os.Stderr, "Warning: Error closing response body: %v\n", closeErr)
		}
	}()

	var projects []Project
	if err := json.NewDecoder(resp.Body).Decode(&projects); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Could not parse GitHub repos: %v\n", err)
		return nil
	}

	fmt.Printf("Fetched %d projects from GitHub\n", len(projects))
	return projects
}

func copyDir(srcRoot, dstRoot *os.Root, srcDir, dstBase string) error {
	// Create destination directory
	if err := dstRoot.MkdirAll(dstBase, 0o750); err != nil {
		return err
	}

	entries, err := os.ReadDir(srcDir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := entry.Name()
		dstPath := filepath.Join(dstBase, entry.Name())

		if entry.IsDir() {
			srcSubDir := filepath.Join(srcDir, srcPath)
			if err := copyDir(srcRoot, dstRoot, srcSubDir, dstPath); err != nil {
				return err
			}
		} else {
			srcFile, err := srcRoot.Open(srcPath)
			if err != nil {
				return err
			}
			data, err := io.ReadAll(srcFile)
			_ = srcFile.Close()
			if err != nil {
				return err
			}

			dstFile, err := dstRoot.Create(dstPath)
			if err != nil {
				return err
			}
			_, err = dstFile.Write(data)
			_ = dstFile.Close()
			if err != nil {
				return err
			}
		}
	}
	return nil
}
