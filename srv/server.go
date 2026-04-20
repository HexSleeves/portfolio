package srv

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"

	"srv.exe.dev/db"
	"srv.exe.dev/internal/githubapi"
	"srv.exe.dev/internal/pagedata"
)

// PageData is a convenience alias so existing code in this package compiles.
type PageData = pagedata.PageData

// BlogPageData is a convenience alias for the blog handler.
type BlogPageData = pagedata.BlogPageData

type Server struct {
	DB            *sql.DB
	Hostname      string
	TemplatesDir  string
	StaticDir     string
	PostsDir      string
	EnableDevLogs bool
	templates     *template.Template
	logHandler    *BrowserLogHandler
	fetchProjects func(context.Context, string) ([]githubapi.Project, error)
	githubUser    string
	projectsCache projectCache
}

const projectsCacheTTL = 15 * time.Minute

type projectCache struct {
	mu        sync.RWMutex
	projects  []githubapi.Project
	fetchedAt time.Time
}

type showcaseProjectsResult struct {
	projects   []githubapi.Project
	fetchedAt  time.Time
	usedCache  bool
	cacheStale bool
}

func New(dbPath, hostname string) (*Server, error) {
	_, thisFile, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(thisFile)

	// Set up browser log handler
	logHandler := NewBrowserLogHandler(slog.NewTextHandler(os.Stderr, nil))
	slog.SetDefault(slog.New(logHandler))

	httpClient := &http.Client{Timeout: 10 * time.Second}

	srv := &Server{
		Hostname:      hostname,
		TemplatesDir:  filepath.Join(baseDir, "templates"),
		StaticDir:     filepath.Join(baseDir, "static"),
		PostsDir:      filepath.Join(baseDir, "posts"),
		EnableDevLogs: envEnabled("ENABLE_DEV_LOGS"),
		logHandler:    logHandler,
		githubUser:    "HexSleeves",
	}
	srv.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return githubapi.FetchProjects(ctx, httpClient, username, os.Getenv("GITHUB_TOKEN"))
	}
	if err := srv.loadTemplates(); err != nil {
		return nil, err
	}
	if err := srv.setUpDatabase(dbPath); err != nil {
		return nil, err
	}
	return srv, nil
}

func (s *Server) loadTemplates() error {
	pattern := filepath.Join(s.TemplatesDir, "*.html")
	tmpl, err := template.ParseGlob(pattern)
	if err != nil {
		return fmt.Errorf("parse templates: %w", err)
	}
	s.templates = tmpl
	return nil
}

func (s *Server) renderTemplate(w http.ResponseWriter, r *http.Request, name string, data any) {
	s.renderTemplateWithStatus(w, r, name, http.StatusOK, data)
}

func (s *Server) renderTemplateWithStatus(w http.ResponseWriter, r *http.Request, name string, status int, data any) {
	var buf bytes.Buffer
	if err := s.templates.ExecuteTemplate(&buf, name, data); err != nil {
		slog.Warn("render template", "template", name, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)
	_, _ = w.Write(buf.Bytes())
}

func (s *Server) newPage(currentPage string) PageData {
	pd := pagedata.NewPageData(currentPage, "")
	pd.Hostname = s.Hostname
	return pd
}

func (s *Server) HandleHome(w http.ResponseWriter, r *http.Request) {
	data := s.newPage("home")
	data.OGTitle = "Jacob LeCoq — Senior Software Engineer"
	data.MetaDescription = "Senior Software Engineer with 8 years of full-stack experience building scalable web applications and high-throughput backend services. Expert in Node.js, TypeScript, Go, and AWS."
	s.renderTemplate(w, r, "home.html", data)
}

func (s *Server) HandleResume(w http.ResponseWriter, r *http.Request) {
	data := s.newPage("resume")
	data.OGTitle = "Resume — Jacob LeCoq"
	data.MetaDescription = "Resume of Jacob LeCoq, Senior Software Engineer with 8 years of full-stack experience."
	data.OGPath = "/resume"
	s.renderTemplate(w, r, "resume.html", data)
}

func (s *Server) HandleShowcase(w http.ResponseWriter, r *http.Request) {
	result, err := s.loadShowcaseProjects(r.Context())
	status := http.StatusOK
	infoMsg := ""
	errMsg := ""
	if !result.fetchedAt.IsZero() {
		infoMsg = fmt.Sprintf("Last synced %s.", describeTimeSince(result.fetchedAt))
	}
	if err != nil {
		slog.Warn("fetch github repos", "user", s.githubUser, "error", err)
		switch {
		case result.usedCache:
			errMsg = fmt.Sprintf(
				"GitHub is unavailable right now. Showing cached repository data from %s.",
				describeTimeSince(result.fetchedAt),
			)
		case result.cacheStale:
			status = http.StatusServiceUnavailable
			errMsg = fmt.Sprintf(
				"Projects are temporarily unavailable. The last successful GitHub sync was %s, which is older than the %s cache window.",
				describeTimeSince(result.fetchedAt),
				describeDuration(projectsCacheTTL),
			)
		default:
			status = http.StatusServiceUnavailable
			errMsg = "Projects are temporarily unavailable. Please try again shortly."
		}
	}
	data := s.newPage("showcase")
	data.Projects = result.projects
	data.Info = infoMsg
	data.Error = errMsg
	data.OGTitle = "Projects — Jacob LeCoq"
	data.MetaDescription = "Open-source projects and repositories by Jacob LeCoq, including tailscale-mcp, runeforge, and more."
	data.OGPath = "/projects"
	s.renderTemplateWithStatus(w, r, "showcase.html", status, data)
}

func (s *Server) HandleDevLogs(w http.ResponseWriter, r *http.Request) {
	s.renderTemplate(w, r, "devlogs.html", nil)
}

func (s *Server) HandleAPIProjects(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "username required", http.StatusBadRequest)
		return
	}

	projects, err := s.fetchProjects(r.Context(), username)
	if err != nil {
		slog.Warn("fetch github repos", "error", err)
		http.Error(w, "Failed to fetch repos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(projects); err != nil {
		slog.Warn("encode projects to json", "error", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *Server) setUpDatabase(dbPath string) error {
	wdb, err := db.Open(dbPath)
	if err != nil {
		return fmt.Errorf("failed to open db: %w", err)
	}
	s.DB = wdb
	if err := db.RunMigrations(wdb); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}
	return nil
}

func (s *Server) routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.HandleHome)
	mux.HandleFunc("GET /resume", s.HandleResume)
	mux.HandleFunc("GET /projects", s.HandleShowcase)
	mux.HandleFunc("GET /blog", s.HandleBlogList)
	mux.HandleFunc("GET /blog/{slug}", s.HandleBlogPost)
	mux.HandleFunc("GET /api/projects", s.HandleAPIProjects)
	if s.EnableDevLogs {
		mux.Handle("GET /dev/logs", s.logHandler)
		mux.HandleFunc("GET /dev", s.HandleDevLogs)
	}
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(s.StaticDir))))
	return mux
}

func (s *Server) Serve(addr string) error {
	server := &http.Server{
		Addr:         addr,
		Handler:      s.routes(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	slog.Info("starting server", "addr", addr)
	return server.ListenAndServe()
}

func (s *Server) loadShowcaseProjects(ctx context.Context) (showcaseProjectsResult, error) {
	projects, err := s.fetchProjects(ctx, s.githubUser)
	if err == nil {
		fetchedAt := s.projectsCache.set(projects)
		return showcaseProjectsResult{projects: projects, fetchedAt: fetchedAt}, nil
	}

	cached, fetchedAt, ok := s.projectsCache.getFresh(projectsCacheTTL)
	if ok {
		return showcaseProjectsResult{
			projects:  cached,
			fetchedAt: fetchedAt,
			usedCache: true,
		}, err
	}

	_, staleFetchedAt := s.projectsCache.snapshot()
	if !staleFetchedAt.IsZero() {
		return showcaseProjectsResult{
			fetchedAt:  staleFetchedAt,
			cacheStale: true,
		}, err
	}

	return showcaseProjectsResult{}, err
}

func (c *projectCache) snapshot() ([]githubapi.Project, time.Time) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return append([]githubapi.Project(nil), c.projects...), c.fetchedAt
}

func (c *projectCache) getFresh(maxAge time.Duration) ([]githubapi.Project, time.Time, bool) {
	projects, fetchedAt := c.snapshot()
	if len(projects) == 0 || fetchedAt.IsZero() {
		return nil, time.Time{}, false
	}
	if time.Since(fetchedAt) > maxAge {
		return nil, fetchedAt, false
	}
	return projects, fetchedAt, true
}

func (c *projectCache) set(projects []githubapi.Project) time.Time {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.projects = append([]githubapi.Project(nil), projects...)
	c.fetchedAt = time.Now()
	return c.fetchedAt
}

func envEnabled(name string) bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv(name))) {
	case "1", "true", "yes", "on":
		return true
	default:
		return false
	}
}

func describeTimeSince(t time.Time) string {
	if t.IsZero() {
		return "an unknown time ago"
	}
	return describeDuration(time.Since(t)) + " ago"
}

func describeDuration(d time.Duration) string {
	if d < 0 {
		d = 0
	}
	switch {
	case d < time.Minute:
		return "less than a minute"
	case d < time.Hour:
		return pluralizeDuration(int(d/time.Minute), "minute")
	case d < 24*time.Hour:
		return pluralizeDuration(int(d/time.Hour), "hour")
	default:
		return pluralizeDuration(int(d/(24*time.Hour)), "day")
	}
}

func pluralizeDuration(value int, unit string) string {
	if value == 1 {
		return fmt.Sprintf("1 %s", unit)
	}
	return fmt.Sprintf("%d %ss", value, unit)
}
