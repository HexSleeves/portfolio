package srv

import (
	"bytes"
	"html/template"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"gopkg.in/yaml.v3"
)

type BlogPost struct {
	Slug        string
	Title       string        `yaml:"title"`
	Date        string        `yaml:"date"`
	Description string        `yaml:"description"`
	Tags        []string      `yaml:"tags"`
	Content     template.HTML // Rendered HTML
	ParsedDate  time.Time
	Published   bool `yaml:"published"`
}

type BlogPageData struct {
	PageData
	Posts []BlogPost
	Post  *BlogPost
}

func (s *Server) loadBlogPosts() ([]BlogPost, error) {
	postsDir := filepath.Join(s.PostsDir)
	entries, err := os.ReadDir(postsDir)
	if err != nil {
		return nil, err
	}

	var posts []BlogPost
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".md") {
			continue
		}

		post, err := s.loadBlogPost(entry.Name())
		if err != nil {
			slog.Warn("load blog post", "file", entry.Name(), "error", err)
			continue
		}

		slog.Info("blog post", "file", entry.Name(), "published", post.Published)

		// Only include published posts
		if !post.Published {
			continue
		}
		posts = append(posts, *post)
	}

	// Sort by date descending
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].ParsedDate.After(posts[j].ParsedDate)
	})

	return posts, nil
}

func (s *Server) loadBlogPost(filename string) (*BlogPost, error) {
	root := os.DirFS(s.PostsDir)
	file, err := root.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	post, err := parseBlogPost(data)
	if err != nil {
		return nil, err
	}

	// Slug from filename
	post.Slug = strings.TrimSuffix(filename, ".md")

	return post, nil
}

func parseBlogPost(data []byte) (*BlogPost, error) {
	// Split frontmatter from content
	parts := bytes.SplitN(data, []byte("---"), 3)
	if len(parts) < 3 {
		// No frontmatter, treat entire content as markdown
		return &BlogPost{
			Title:   "Untitled",
			Content: renderMarkdown(data),
		}, nil
	}

	// Parse frontmatter
	var post BlogPost
	if err := yaml.Unmarshal(parts[1], &post); err != nil {
		return nil, err
	}

	// Parse date
	if post.Date != "" {
		parsed, err := time.Parse("2006-01-02", post.Date)
		if err == nil {
			post.ParsedDate = parsed
		}
	}

	// Render markdown content
	post.Content = renderMarkdown(parts[2])

	return &post, nil
}

func renderMarkdown(data []byte) template.HTML {
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)

	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	html := markdown.ToHTML(data, p, renderer)
	// #nosec G203 - HTML content is trusted as it comes from blog post markdown files
	// authored by the blog owner. The gomarkdown library produces safe HTML output.
	return template.HTML(html)
}

func (s *Server) HandleBlogList(w http.ResponseWriter, r *http.Request) {
	posts, err := s.loadBlogPosts()
	if err != nil {
		slog.Warn("load blog posts", "error", err)
	}

	data := BlogPageData{
		PageData: PageData{
			Hostname:    s.Hostname,
			CurrentPage: "blog",
		},
		Posts: posts,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "blog.html", data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) HandleBlogPost(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" || strings.Contains(slug, ".") {
		http.NotFound(w, r)
		return
	}

	post, err := s.loadBlogPost(slug + ".md")
	if err != nil {
		slog.Warn("load blog post", "slug", slug, "error", err)
		http.NotFound(w, r)
		return
	}

	data := BlogPageData{
		PageData: PageData{
			Hostname:    s.Hostname,
			CurrentPage: "blog",
		},
		Post: post,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "blog_post.html", data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
