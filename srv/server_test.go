package srv

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"srv.exe.dev/internal/githubapi"
)

func TestServerSetupAndHandlers(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_server.sqlite3")
	t.Cleanup(func() { _ = os.Remove(tempDB) })

	server, err := New(tempDB, "test-hostname")
	if err != nil {
		t.Fatalf("failed to create server: %v", err)
	}

	t.Run("home page", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		w := httptest.NewRecorder()

		server.HandleHome(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200, got %d", w.Code)
		}

		body := w.Body.String()
		if !strings.Contains(body, "Jacob LeCoq") {
			t.Errorf("expected page to contain name, got body: %s", body[:200])
		}
	})

	t.Run("resume page", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/resume", nil)
		w := httptest.NewRecorder()

		server.HandleResume(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200, got %d", w.Code)
		}

		body := w.Body.String()
		if !strings.Contains(body, "Resume") {
			t.Errorf("expected page to contain Resume, got body: %s", body[:200])
		}
		if !strings.Contains(body, "Experience") {
			t.Errorf("expected page to contain Experience section")
		}
	})

	t.Run("showcase page", func(t *testing.T) {
		server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
			return []githubapi.Project{
				{Name: "tailscale-mcp", URL: "https://github.com/HexSleeves/tailscale-mcp"},
			}, nil
		}

		req := httptest.NewRequest(http.MethodGet, "/showcase", nil)
		w := httptest.NewRecorder()

		server.HandleShowcase(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200, got %d", w.Code)
		}

		body := w.Body.String()
		if !strings.Contains(body, "Projects") {
			t.Errorf("expected page to contain Projects, got body: %s", body[:200])
		}
		if !strings.Contains(body, "tailscale-mcp") {
			t.Errorf("expected page to contain stubbed project")
		}
	})
}

func TestAPIProjects(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_api.sqlite3")
	t.Cleanup(func() { _ = os.Remove(tempDB) })

	server, err := New(tempDB, "test-hostname")
	if err != nil {
		t.Fatalf("failed to create server: %v", err)
	}

	t.Run("missing username", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/projects", nil)
		w := httptest.NewRecorder()

		server.HandleAPIProjects(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})

	t.Run("with username", func(t *testing.T) {
		server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
			if username != "HexSleeves" {
				t.Fatalf("expected username HexSleeves, got %s", username)
			}
			return []githubapi.Project{
				{Name: "runeforge", URL: "https://github.com/HexSleeves/runeforge"},
			}, nil
		}

		req := httptest.NewRequest(http.MethodGet, "/api/projects?username=HexSleeves", nil)
		w := httptest.NewRecorder()

		server.HandleAPIProjects(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200, got %d", w.Code)
		}

		contentType := w.Header().Get("Content-Type")
		if !strings.Contains(contentType, "application/json") {
			t.Errorf("expected JSON content type, got %s", contentType)
		}
		if !strings.Contains(w.Body.String(), "runeforge") {
			t.Errorf("expected JSON response to include stubbed repository")
		}
	})
}

func TestDraftBlogPostNotServed(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_blog.sqlite3")

	server, err := New(tempDB, "test-hostname")
	if err != nil {
		t.Fatalf("failed to create server: %v", err)
	}

	postsDir := t.TempDir()
	server.PostsDir = postsDir

	draftPost := `---
title: Draft Post
date: 2026-01-01
published: false
---
This should not be public.
`
	if err := os.WriteFile(filepath.Join(postsDir, "draft-post.md"), []byte(draftPost), 0o600); err != nil {
		t.Fatalf("write draft post: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/blog/draft-post", nil)
	req.SetPathValue("slug", "draft-post")
	w := httptest.NewRecorder()

	server.HandleBlogPost(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected draft blog post to return 404, got %d", w.Code)
	}
}
