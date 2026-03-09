package srv

import (
	"log/slog"
	"net/http"
	"strings"

	"srv.exe.dev/internal/blog"
)

type BlogPageData struct {
	PageData
	Posts []blog.Post
	Post  *blog.Post
}

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

	data := BlogPageData{
		PageData: PageData{
			Hostname:    s.Hostname,
			CurrentPage: "blog",
			Error:       errMsg,
		},
		Posts: posts,
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

	data := BlogPageData{
		PageData: PageData{
			Hostname:    s.Hostname,
			CurrentPage: "blog",
		},
		Post: post,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "blog_post.html", data); err != nil {
		slog.Warn("render template", "template", "blog_post.html", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
