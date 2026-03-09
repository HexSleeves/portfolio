package srv

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"srv.exe.dev/internal/githubapi"
)

func TestServerSetupAndHandlers(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_server.sqlite3")
	t.Cleanup(func() { _ = os.Remove(tempDB) })

	t.Setenv("ENABLE_DEV_LOGS", "")
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

	t.Setenv("ENABLE_DEV_LOGS", "")
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

	t.Setenv("ENABLE_DEV_LOGS", "")
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

func TestDevRoutesDisabledByDefault(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/dev", nil)
	w := httptest.NewRecorder()

	server.routes().ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected /dev to be hidden by default, got %d", w.Code)
	}
}

func TestDevRoutesEnabledViaEnv(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "true")
	server := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/dev", nil)
	w := httptest.NewRecorder()

	server.routes().ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected /dev to be available when enabled, got %d", w.Code)
	}
}

func TestShowcaseReturnsCachedProjectsWhenGitHubFails(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)

	server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return []githubapi.Project{{Name: "cached-project", URL: "https://example.com/cached"}}, nil
	}

	firstReq := httptest.NewRequest(http.MethodGet, "/projects", nil)
	firstW := httptest.NewRecorder()
	server.HandleShowcase(firstW, firstReq)
	if firstW.Code != http.StatusOK {
		t.Fatalf("expected initial showcase request to succeed, got %d", firstW.Code)
	}

	server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return nil, errors.New("github down")
	}
	setProjectsCacheAge(server, 4*time.Minute)

	req := httptest.NewRequest(http.MethodGet, "/projects", nil)
	w := httptest.NewRecorder()
	server.HandleShowcase(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected cached showcase response to return 200, got %d", w.Code)
	}
	body := w.Body.String()
	if !strings.Contains(body, "cached-project") {
		t.Fatalf("expected cached project to be rendered")
	}
	if !strings.Contains(body, "Last synced 4 minutes ago.") {
		t.Fatalf("expected last sync info message, got %q", body)
	}
	if !strings.Contains(body, "Showing cached repository data from 4 minutes ago") {
		t.Fatalf("expected cached fallback message, got %q", body)
	}
}

func TestShowcaseDisplaysLastSyncWhenGitHubSucceeds(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)
	server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return []githubapi.Project{{Name: "fresh-project", URL: "https://example.com/fresh"}}, nil
	}

	req := httptest.NewRequest(http.MethodGet, "/projects", nil)
	w := httptest.NewRecorder()
	server.HandleShowcase(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected successful showcase response to return 200, got %d", w.Code)
	}
	body := w.Body.String()
	if !strings.Contains(body, "fresh-project") {
		t.Fatalf("expected fresh project to be rendered")
	}
	if !strings.Contains(body, "Last synced less than a minute ago.") {
		t.Fatalf("expected last sync info on healthy response, got %q", body)
	}
}

func TestShowcaseRejectsExpiredCacheAfterTTL(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)

	server.projectsCache.set([]githubapi.Project{{Name: "stale-project", URL: "https://example.com/stale"}})
	setProjectsCacheAge(server, projectsCacheTTL+time.Minute)
	server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return nil, errors.New("github down")
	}

	req := httptest.NewRequest(http.MethodGet, "/projects", nil)
	w := httptest.NewRecorder()
	server.HandleShowcase(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected showcase with expired cache to return 503, got %d", w.Code)
	}
	body := w.Body.String()
	if strings.Contains(body, "stale-project") {
		t.Fatalf("expected expired cached project to be withheld")
	}
	if !strings.Contains(body, "older than the 15 minutes cache window") {
		t.Fatalf("expected expired cache message in response body, got %q", body)
	}
}

func TestShowcaseReturnsServiceUnavailableWithoutCache(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)
	server.fetchProjects = func(ctx context.Context, username string) ([]githubapi.Project, error) {
		return nil, errors.New("github down")
	}

	req := httptest.NewRequest(http.MethodGet, "/projects", nil)
	w := httptest.NewRecorder()
	server.HandleShowcase(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected showcase without cache to return 503, got %d", w.Code)
	}
	if !strings.Contains(w.Body.String(), "Projects are temporarily unavailable. Please try again shortly.") {
		t.Fatalf("expected outage message in response body")
	}
}

func TestDescribeDuration(t *testing.T) {
	testCases := []struct {
		name string
		in   time.Duration
		want string
	}{
		{name: "sub minute", in: 30 * time.Second, want: "less than a minute"},
		{name: "single minute", in: time.Minute, want: "1 minute"},
		{name: "plural minutes", in: 4 * time.Minute, want: "4 minutes"},
		{name: "single hour", in: time.Hour, want: "1 hour"},
		{name: "plural hours", in: 2 * time.Hour, want: "2 hours"},
		{name: "single day", in: 24 * time.Hour, want: "1 day"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if got := describeDuration(tc.in); got != tc.want {
				t.Fatalf("describeDuration(%s) = %q, want %q", tc.in, got, tc.want)
			}
		})
	}
}

func TestBlogListReturnsServiceUnavailableOnLoadFailure(t *testing.T) {
	t.Setenv("ENABLE_DEV_LOGS", "")
	server := newTestServer(t)
	server.PostsDir = filepath.Join(t.TempDir(), "missing")

	req := httptest.NewRequest(http.MethodGet, "/blog", nil)
	w := httptest.NewRecorder()
	server.HandleBlogList(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected blog list to return 503 on load failure, got %d", w.Code)
	}
	if !strings.Contains(w.Body.String(), "Blog posts are temporarily unavailable") {
		t.Fatalf("expected outage message in response body")
	}
}

func newTestServer(t *testing.T) *Server {
	t.Helper()

	tempDB := filepath.Join(t.TempDir(), "test.sqlite3")
	server, err := New(tempDB, "test-hostname")
	if err != nil {
		t.Fatalf("failed to create server: %v", err)
	}
	return server
}

func setProjectsCacheAge(server *Server, age time.Duration) {
	server.projectsCache.mu.Lock()
	defer server.projectsCache.mu.Unlock()
	server.projectsCache.fetchedAt = time.Now().Add(-age)
}
