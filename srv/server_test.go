package srv

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestServerSetupAndHandlers(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_server.sqlite3")
	t.Cleanup(func() { os.Remove(tempDB) })

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
	})
}

func TestAPIProjects(t *testing.T) {
	tempDB := filepath.Join(t.TempDir(), "test_api.sqlite3")
	t.Cleanup(func() { os.Remove(tempDB) })

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
	})
}
