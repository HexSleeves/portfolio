package main

import (
	"bytes"
	"context"
	"encoding/xml"
	"errors"
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
	"srv.exe.dev/internal/pagedata"
)

func main() {
	outDir := flag.String("out", "dist", "output directory")
	githubUser := flag.String("github", "HexSleeves", "GitHub username for projects")
	basePath := flag.String("base", "", "base path for URLs (e.g., /portfolio for GitHub Pages)")
	flag.Parse()

	// Normalize base path
	base := strings.TrimSuffix(*basePath, "/")
	siteURL := "https://hexsleeves.github.io" + base

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

	// Fetch GitHub projects (with retry)
	projects := fetchGitHubProjects(*githubUser)
	tmpl, err := loadTemplates(templatesDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading templates: %v\n", err)
		os.Exit(1)
	}

	// Pages to render
	pages := []struct {
		template    string
		output      string
		page        string
		ogTitle     string
		description string
		ogPath      string
	}{
		{
			"home.html", "index.html", "home",
			"Jacob LeCoq — Senior Software Engineer",
			"Senior Software Engineer with 8 years of full-stack experience building scalable web applications and high-throughput backend services. Expert in Node.js, TypeScript, Go, and AWS.",
			"",
		},
		{
			"resume.html", "resume/index.html", "resume",
			"Resume — Jacob LeCoq",
			"Resume of Jacob LeCoq, Senior Software Engineer with 8 years of full-stack experience.",
			"/resume",
		},
		{
			"showcase.html", "projects/index.html", "showcase",
			"Projects — Jacob LeCoq",
			"Open-source projects and repositories by Jacob LeCoq, including tailscale-mcp, runeforge, and more.",
			"/projects",
		},
	}

	var sitemapURLs []sitemapURL
	sitemapURLs = append(sitemapURLs,
		sitemapURL{Loc: siteURL + "/", ChangeFreq: "monthly", Priority: "1.0"},
		sitemapURL{Loc: siteURL + "/resume", ChangeFreq: "monthly", Priority: "0.8"},
		sitemapURL{Loc: siteURL + "/projects", ChangeFreq: "weekly", Priority: "0.8"},
		sitemapURL{Loc: siteURL + "/blog", ChangeFreq: "weekly", Priority: "0.7"},
	)

	for _, page := range pages {
		data := pagedata.NewPageData(page.page, base)
		data.Projects = projects
		data.OGTitle = page.ogTitle
		data.MetaDescription = page.description
		data.OGPath = page.ogPath
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

	blogPD := pagedata.NewPageData("blog", base)
	blogPD.OGTitle = "Blog — Jacob LeCoq"
	blogPD.MetaDescription = "Writing on software engineering, systems programming, Go, Rust, and developer tooling."
	blogPD.OGPath = "/blog"
	blogData := pagedata.BlogPageData{
		PageData: blogPD,
		Posts:    posts,
	}
	if err := renderTemplate(tmpl, *outDir, "blog.html", "blog/index.html", blogData); err != nil {
		fmt.Fprintf(os.Stderr, "Error rendering blog index: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Generated blog/index.html")

	for _, post := range posts {
		post := post
		postPD := pagedata.NewPageData("blog", base)
		postPD.OGTitle = fmt.Sprintf("%s — Jacob LeCoq", post.Title)
		postPD.OGType = "article"
		postPD.OGPath = fmt.Sprintf("/blog/%s", post.Slug)
		if post.Description != "" {
			postPD.MetaDescription = post.Description
		}
		postData := pagedata.BlogPageData{
			PageData: postPD,
			Post:     &post,
		}
		outPath := filepath.Join("blog", post.Slug, "index.html")
		if err := renderTemplate(tmpl, *outDir, "blog_post.html", outPath, postData); err != nil {
			fmt.Fprintf(os.Stderr, "Error rendering blog post %s: %v\n", post.Slug, err)
			os.Exit(1)
		}
		fmt.Printf("Generated %s\n", outPath)

		sitemapURLs = append(sitemapURLs, sitemapURL{
			Loc:        siteURL + "/blog/" + post.Slug,
			LastMod:    post.Date,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// Generate sitemap.xml
	if err := writeSitemap(*outDir, sitemapURLs); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing sitemap: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Generated sitemap.xml")

	// Generate RSS feed
	if err := writeRSSFeed(*outDir, base, siteURL, posts); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing RSS feed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Generated blog/feed.xml")

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

// fetchGitHubProjects fetches GitHub repos with exponential backoff retry.
func fetchGitHubProjects(username string) []githubapi.Project {
	client := &http.Client{Timeout: 10 * time.Second}
	maxRetries := 3
	backoff := 2 * time.Second

	for attempt := 1; attempt <= maxRetries; attempt++ {
		projects, err := githubapi.FetchProjects(context.Background(), client, username, os.Getenv("GITHUB_TOKEN"))
		if err == nil {
			fmt.Printf("Fetched %d projects from GitHub\n", len(projects))
			return projects
		}
		if attempt < maxRetries {
			fmt.Fprintf(os.Stderr, "Warning: GitHub fetch attempt %d/%d failed: %v — retrying in %s\n",
				attempt, maxRetries, err, backoff)
			time.Sleep(backoff)
			backoff *= 2
		} else {
			fmt.Fprintf(os.Stderr, "Warning: Could not fetch GitHub repos after %d attempts: %v\n", maxRetries, err)
		}
	}
	return nil
}

func loadTemplates(templatesDir string) (*template.Template, error) {
	return template.ParseGlob(filepath.Join(templatesDir, "*.html"))
}

func renderTemplate(tmpl *template.Template, outDir, templateName, outputPath string, data any) (err error) {
	outRoot, err := os.OpenRoot(outDir)
	if err != nil {
		return err
	}
	defer closeAndJoin(&err, outRoot)

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
	defer closeAndJoin(&err, f)

	return tmpl.ExecuteTemplate(f, templateName, data)
}

// --- Sitemap ---

type sitemapURL struct {
	Loc        string `xml:"loc"`
	LastMod    string `xml:"lastmod,omitempty"`
	ChangeFreq string `xml:"changefreq,omitempty"`
	Priority   string `xml:"priority,omitempty"`
}

type sitemapIndex struct {
	XMLName xml.Name     `xml:"urlset"`
	XMLNS   string       `xml:"xmlns,attr"`
	URLs    []sitemapURL `xml:"url"`
}

func writeSitemap(outDir string, urls []sitemapURL) error {
	index := sitemapIndex{
		XMLNS: "http://www.sitemaps.org/schemas/sitemap/0.9",
		URLs:  urls,
	}
	var buf bytes.Buffer
	buf.WriteString(xml.Header)
	enc := xml.NewEncoder(&buf)
	enc.Indent("", "  ")
	if err := enc.Encode(index); err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(outDir, "sitemap.xml"), buf.Bytes(), 0o644)
}

// --- RSS Feed ---

type rssItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate,omitempty"`
	GUID        string `xml:"guid"`
}

type rssChannel struct {
	Title       string    `xml:"title"`
	Link        string    `xml:"link"`
	Description string    `xml:"description"`
	Language    string    `xml:"language"`
	Items       []rssItem `xml:"item"`
}

type rssFeed struct {
	XMLName xml.Name   `xml:"rss"`
	Version string     `xml:"version,attr"`
	Channel rssChannel `xml:"channel"`
}

func writeRSSFeed(outDir, base, siteURL string, posts []blog.Post) error {
	var items []rssItem
	for _, p := range posts {
		link := siteURL + "/blog/" + p.Slug
		desc := p.Description
		if desc == "" {
			desc = p.Title
		}
		items = append(items, rssItem{
			Title:       p.Title,
			Link:        link,
			Description: desc,
			PubDate:     p.Date,
			GUID:        link,
		})
	}

	feed := rssFeed{
		Version: "2.0",
		Channel: rssChannel{
			Title:       "Jacob LeCoq — Blog",
			Link:        siteURL + "/blog",
			Description: "Writing on software engineering, systems programming, Go, Rust, and developer tooling.",
			Language:    "en-us",
			Items:       items,
		},
	}

	var buf bytes.Buffer
	buf.WriteString(xml.Header)
	enc := xml.NewEncoder(&buf)
	enc.Indent("", "  ")
	if err := enc.Encode(feed); err != nil {
		return err
	}

	feedDir := filepath.Join(outDir, "blog")
	if err := os.MkdirAll(feedDir, 0o750); err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(feedDir, "feed.xml"), buf.Bytes(), 0o644)
}

// --- File helpers ---

func copyDir(srcDir, dstDir string) (err error) {
	if err := os.MkdirAll(dstDir, 0o750); err != nil {
		return err
	}

	srcRoot, err := os.OpenRoot(srcDir)
	if err != nil {
		return err
	}
	defer closeAndJoin(&err, srcRoot)

	dstRoot, err := os.OpenRoot(dstDir)
	if err != nil {
		return err
	}
	defer closeAndJoin(&err, dstRoot)

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

		dstFile, err := dstRoot.Create(path)
		if err != nil {
			return errors.Join(err, srcFile.Close())
		}

		_, copyErr := io.Copy(dstFile, srcFile)
		srcCloseErr := srcFile.Close()
		dstCloseErr := dstFile.Close()
		return errors.Join(copyErr, srcCloseErr, dstCloseErr)
	})
}

func closeAndJoin(dst *error, closer io.Closer) {
	if closeErr := closer.Close(); closeErr != nil {
		*dst = errors.Join(*dst, closeErr)
	}
}
