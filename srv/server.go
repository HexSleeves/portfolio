package srv

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"path/filepath"
	"runtime"
	"time"

	"srv.exe.dev/db"
)

type Server struct {
	DB           *sql.DB
	Hostname     string
	TemplatesDir string
	StaticDir    string
	PostsDir     string
	templates    *template.Template
	logHandler   *BrowserLogHandler
}

type PageData struct {
	Hostname    string
	CurrentPage string
	BasePath    string
	Projects    []Project
}

type Project struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	URL         string `json:"html_url"`
	Language    string `json:"language"`
	Stars       int    `json:"stargazers_count"`
	Forks       int    `json:"forks_count"`
	UpdatedAt   string `json:"updated_at"`
}

func New(dbPath, hostname string) (*Server, error) {
	_, thisFile, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(thisFile)

	// Set up browser log handler
	logHandler := NewBrowserLogHandler(slog.Default().Handler())
	slog.SetDefault(slog.New(logHandler))

	srv := &Server{
		Hostname:     hostname,
		TemplatesDir: filepath.Join(baseDir, "templates"),
		StaticDir:    filepath.Join(baseDir, "static"),
		PostsDir:     filepath.Join(baseDir, "posts"),
		logHandler:   logHandler,
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

func (s *Server) HandleHome(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "home",
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "home.html", data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) HandleResume(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "resume",
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "resume.html", data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) HandleShowcase(w http.ResponseWriter, r *http.Request) {
	projects := s.fetchGitHubProjects()
	data := PageData{
		Hostname:    s.Hostname,
		CurrentPage: "showcase",
		Projects:    projects,
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "showcase.html", data); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) fetchGitHubProjects() []Project {
	// Fetch projects from GitHub for HexSleeves
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get("https://api.github.com/users/HexSleeves/repos?sort=updated&per_page=12")
	if err != nil {
		slog.Warn("fetch github repos", "error", err)
		return nil
	}
	defer func() {
		if closeErr := resp.Body.Close(); closeErr != nil {
			slog.Warn("error closing response body", "error", closeErr)
		}
	}()

	var projects []Project
	if err := json.NewDecoder(resp.Body).Decode(&projects); err != nil {
		slog.Warn("decode github repos", "error", err)
		return nil
	}
	return projects
}

func (s *Server) HandleDevLogs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.templates.ExecuteTemplate(w, "devlogs.html", nil); err != nil {
		slog.Warn("render template", "url", r.URL.Path, "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) HandleAPIProjects(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "username required", http.StatusBadRequest)
		return
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(fmt.Sprintf("https://api.github.com/users/%s/repos?sort=updated&per_page=12", username))
	if err != nil {
		slog.Warn("fetch github repos", "error", err)
		http.Error(w, "Failed to fetch repos", http.StatusInternalServerError)
		return
	}
	defer func() {
		if closeErr := resp.Body.Close(); closeErr != nil {
			slog.Warn("error closing response body", "error", closeErr)
		}
	}()

	var projects []Project
	if err := json.NewDecoder(resp.Body).Decode(&projects); err != nil {
		slog.Warn("decode github repos", "error", err)
		http.Error(w, "Failed to parse repos", http.StatusInternalServerError)
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
