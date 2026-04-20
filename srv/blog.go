package srv

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"srv.exe.dev/internal/blog"
	"srv.exe.dev/internal/pagedata"
)

func (s *Server) loadBlogPosts() ([]blog.Post, error) {
	posts, err := blog.LoadPosts(s.PostsDir)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func (s *Server) loadBlogPost(filename string) (*blog.Post, error) {
	post, err := blog.LoadPost(s.PostsDir, filename)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (s *Server) HandleBlogList(w http.ResponseWriter, r *http.Request) {
	posts, err := s.loadBlogPosts()
	status := http.StatusOK
	errMsg := ""
	if err != nil {
		slog.Warn("load blog posts", "error", err)
		status = http.StatusServiceUnavailable
		errMsg = "Blog posts are temporarily unavailable. Please try again shortly."
	}

	pd := s.newPage("blog")
	pd.Error = errMsg
	pd.OGTitle = "Blog — Jacob LeCoq"
	pd.MetaDescription = "Writing on software engineering, systems programming, Go, Rust, and developer tooling."
	pd.OGPath = "/blog"

	data := pagedata.BlogPageData{
		PageData: pd,
		Posts:    posts,
	}

	s.renderTemplateWithStatus(w, r, "blog.html", status, data)
}

func (s *Server) HandleBlogPost(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" || strings.Contains(slug, ".") {
		http.NotFound(w, r)
		return
	}

	post, err := s.loadBlogPost(slug + ".md")
	if err != nil {
		slog.Warn("load blog post", "error", err)
		http.NotFound(w, r)
		return
	}
	if !post.Published {
		http.NotFound(w, r)
		return
	}

	pd := s.newPage("blog")
	pd.OGTitle = fmt.Sprintf("%s — Jacob LeCoq", post.Title)
	pd.OGType = "article"
	pd.OGPath = fmt.Sprintf("/blog/%s", slug)
	if post.Description != "" {
		pd.MetaDescription = post.Description
	}

	data := pagedata.BlogPageData{
		PageData: pd,
		Post:     post,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "blog_post.html", data); err != nil {
		slog.Warn("render template", "template", "blog_post.html", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
