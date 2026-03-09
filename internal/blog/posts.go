package blog

import (
	"bytes"
	"html/template"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/gomarkdown/markdown"
	mdhtml "github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"gopkg.in/yaml.v3"
)

type Post struct {
	Slug        string
	Title       string   `yaml:"title"`
	Date        string   `yaml:"date"`
	Description string   `yaml:"description"`
	Tags        []string `yaml:"tags"`
	Content     template.HTML
	ParsedDate  time.Time
	Published   bool `yaml:"published"`
}

func LoadPosts(postsDir string) ([]Post, error) {
	entries, err := os.ReadDir(postsDir)
	if err != nil {
		return nil, err
	}

	var posts []Post
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".md") {
			continue
		}

		post, err := LoadPost(postsDir, entry.Name())
		if err != nil {
			return nil, err
		}
		if !post.Published {
			continue
		}
		posts = append(posts, *post)
	}

	sort.Slice(posts, func(i, j int) bool {
		return posts[i].ParsedDate.After(posts[j].ParsedDate)
	})

	return posts, nil
}

func LoadPost(postsDir, filename string) (*Post, error) {
	root := os.DirFS(postsDir)
	file, err := root.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	post, err := ParsePost(data)
	if err != nil {
		return nil, err
	}
	post.Slug = strings.TrimSuffix(filepath.Base(filename), ".md")

	return post, nil
}

func LoadPostFS(root fs.FS, filename string) (*Post, error) {
	file, err := root.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	post, err := ParsePost(data)
	if err != nil {
		return nil, err
	}
	post.Slug = strings.TrimSuffix(filepath.Base(filename), ".md")

	return post, nil
}

func ParsePost(data []byte) (*Post, error) {
	parts := bytes.SplitN(data, []byte("---"), 3)
	if len(parts) < 3 {
		return &Post{
			Title:   "Untitled",
			Content: RenderMarkdown(data),
		}, nil
	}

	var post Post
	if err := yaml.Unmarshal(parts[1], &post); err != nil {
		return nil, err
	}

	if post.Date != "" {
		parsed, err := time.Parse("2006-01-02", post.Date)
		if err == nil {
			post.ParsedDate = parsed
		}
	}

	post.Content = RenderMarkdown(parts[2])
	return &post, nil
}

func RenderMarkdown(data []byte) template.HTML {
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)

	htmlFlags := mdhtml.CommonFlags |
		mdhtml.SkipHTML |
		mdhtml.Safelink |
		mdhtml.NoreferrerLinks |
		mdhtml.NoopenerLinks |
		mdhtml.HrefTargetBlank
	renderer := mdhtml.NewRenderer(mdhtml.RendererOptions{Flags: htmlFlags})
	rendered := markdown.ToHTML(data, p, renderer)

	// #nosec G203 -- raw HTML is skipped and unsafe links are stripped before marking the rendered output trusted.
	return template.HTML(rendered)
}
