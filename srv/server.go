package srv

import (
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
	"time"

	"srv.exe.dev/db"
	"srv.exe.dev/internal/githubapi"
)

type Server struct {
	DB            *sql.DB
	Hostname      string
	TemplatesDir  string
	StaticDir     string
	PostsDir      string
	templates     *template.Template
	logHandler    *BrowserLogHandler
	fetchProjects func(context.Context, string) ([]githubapi.Project, error)
	githubUser    string
}

type PageData struct {
	Hostname    string
	CurrentPage string
	BasePath    string
	Projects    []githubapi.Project
}

func New(dbPath, hostname string) (*Server, error) {
	_, thisFile, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(thisFile)

	// Set up browser log handler
	logHandler := NewBrowserLogHandler(slog.NewTextHandler(os.Stderr, nil))
	slog.SetDefault(slog.New(logHandler))

	httpClient := &http.Client{Timeout: 10 * time.Second}

	srv := &Server{
		Hostname:     hostname,
		TemplatesDir: filepath.Join(baseDir, "templates"),
		StaticDir:    filepath.Join(baseDir, "static"),
		PostsDir:     filepath.Join(baseDir, "posts"),
		logHandler:   logHandler,
		githubUser:   "HexSleeves",
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
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, name, data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "template", name, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) HandleHome(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "home",
	}
	s.renderTemplate(w, r, "home.html", data)
}

func (s *Server) HandleResume(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "resume",
	}
	s.renderTemplate(w, r, "resume.html", data)
}

func (s *Server) HandleShowcase(w http.ResponseWriter, r *http.Request) {
	projects, err := s.fetchProjects(r.Context(), s.githubUser)
	if err != nil {
		slog.Warn("fetch github repos", "user", s.githubUser, "error", err)
	}
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "showcase",
		Projects:    projects,
	}
	s.renderTemplate(w, r, "showcase.html", data)
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
		slog.Warn("fetch github repos", "user", username, "error", err)
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

func (s *Server) Serve(addr string) error {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.HandleHome)
	mux.HandleFunc("GET /resume", s.HandleResume)
	mux.HandleFunc("GET /projects", s.HandleShowcase)
	mux.HandleFunc("GET /blog", s.HandleBlogList)
	mux.HandleFunc("GET /blog/{slug}", s.HandleBlogPost)
	mux.HandleFunc("GET /api/projects", s.HandleAPIProjects)
	mux.Handle("GET /dev/logs", s.logHandler)
	mux.HandleFunc("GET /dev", s.HandleDevLogs)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(s.StaticDir))))

	server := &http.Server{
		Addr:         addr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	slog.Info("starting server", "addr", addr)
	return server.ListenAndServe()
}
