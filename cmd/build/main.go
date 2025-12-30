package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
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
	Projects []Project
}

func main() {
	outDir := flag.String("out", "dist", "output directory")
	githubUser := flag.String("github", "HexSleeves", "GitHub username for projects")
	flag.Parse()

	// Get templates directory
	_, thisFile, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(filepath.Dir(thisFile))
	templatesDir := filepath.Join(baseDir, "..", "srv", "templates")

	// Create output directory
	if err := os.MkdirAll(*outDir, 0o755); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output dir: %v\n", err)
		os.Exit(1)
	}

	// Fetch GitHub projects
	projects := fetchGitHubProjects(*githubUser)
	data := PageData{Projects: projects}

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
		tmplPath := filepath.Join(templatesDir, page.template)
		outPath := filepath.Join(*outDir, page.output)

		// Create subdirectory if needed
		if err := os.MkdirAll(filepath.Dir(outPath), 0o755); err != nil {
			fmt.Fprintf(os.Stderr, "Error creating dir for %s: %v\n", page.output, err)
			os.Exit(1)
		}

		// Parse and render template
		tmpl, err := template.ParseFiles(tmplPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing %s: %v\n", page.template, err)
			os.Exit(1)
		}

		f, err := os.Create(outPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error creating %s: %v\n", page.output, err)
			os.Exit(1)
		}

		if err := tmpl.Execute(f, data); err != nil {
			f.Close()
			fmt.Fprintf(os.Stderr, "Error rendering %s: %v\n", page.template, err)
			os.Exit(1)
		}
		f.Close()

		fmt.Printf("Generated %s\n", outPath)
	}

	// Copy static files
	staticDir := filepath.Join(baseDir, "..", "srv", "static")
	outStaticDir := filepath.Join(*outDir, "static")
	if err := copyDir(staticDir, outStaticDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error copying static files: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Copied static files to %s\n", outStaticDir)

	fmt.Println("\nBuild complete!")
}

func fetchGitHubProjects(username string) []Project {
	client := &http.Client{Timeout: 10 * time.Second}
	url := fmt.Sprintf("https://api.github.com/users/%s/repos?sort=updated&per_page=12", username)

	resp, err := client.Get(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Could not fetch GitHub repos: %v\n", err)
		return nil
	}
	defer resp.Body.Close()

	var projects []Project
	if err := json.NewDecoder(resp.Body).Decode(&projects); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Could not parse GitHub repos: %v\n", err)
		return nil
	}

	fmt.Printf("Fetched %d projects from GitHub\n", len(projects))
	return projects
}

func copyDir(src, dst string) error {
	if err := os.MkdirAll(dst, 0o755); err != nil {
		return err
	}

	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		if entry.IsDir() {
			if err := copyDir(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			data, err := os.ReadFile(srcPath)
			if err != nil {
				return err
			}
			if err := os.WriteFile(dstPath, data, 0o644); err != nil {
				return err
			}
		}
	}
	return nil
}
