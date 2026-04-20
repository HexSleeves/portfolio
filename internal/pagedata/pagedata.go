// Package pagedata defines shared page data structures used by both the
// live HTTP server (srv) and the static site generator (cmd/build).
package pagedata

import (
	"time"

	"srv.exe.dev/internal/blog"
	"srv.exe.dev/internal/githubapi"
)

// PageData holds template variables common to every page.
type PageData struct {
	// Runtime / routing
	Hostname    string
	CurrentPage string
	BasePath    string

	// GitHub projects (showcase page)
	Projects []githubapi.Project

	// User-facing status messages
	Info  string
	Error string

	// SEO & Open Graph
	MetaDescription string
	OGTitle         string
	OGType          string // "website" | "article"
	OGPath          string // page-specific path suffix for og:url

	// Footer
	CopyrightYear int
}

// BlogPageData extends PageData with blog-specific fields.
type BlogPageData struct {
	PageData
	Posts []blog.Post
	Post  *blog.Post
}

// NewPageData returns a PageData with sensible defaults applied.
func NewPageData(currentPage, basePath string) PageData {
	return PageData{
		CurrentPage:   currentPage,
		BasePath:      basePath,
		CopyrightYear: time.Now().Year(),
	}
}
