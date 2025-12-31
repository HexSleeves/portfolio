package srv

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"sync"
)

// BrowserLogHandler is a slog handler that broadcasts to SSE clients
type BrowserLogHandler struct {
	slog.Handler
	mu      sync.RWMutex
	clients map[chan string]struct{}
}

func NewBrowserLogHandler(base slog.Handler) *BrowserLogHandler {
	return &BrowserLogHandler{
		Handler: base,
		clients: make(map[chan string]struct{}),
	}
}

func (h *BrowserLogHandler) Handle(ctx context.Context, r slog.Record) error {
	// Format the log message
	msg := fmt.Sprintf("%s [%s] %s", r.Time.Format("15:04:05"), r.Level, r.Message)
	r.Attrs(func(a slog.Attr) bool {
		msg += fmt.Sprintf(" %s=%v", a.Key, a.Value)
		return true
	})

	// Broadcast to all connected clients
	h.mu.RLock()
	for ch := range h.clients {
		select {
		case ch <- msg:
		default:
			// Drop if client is slow
		}
	}
	h.mu.RUnlock()

	// Also log to the base handler (console)
	return h.Handler.Handle(ctx, r)
}

func (h *BrowserLogHandler) subscribe() chan string {
	ch := make(chan string, 100)
	h.mu.Lock()
	h.clients[ch] = struct{}{}
	h.mu.Unlock()
	return ch
}

func (h *BrowserLogHandler) unsubscribe(ch chan string) {
	h.mu.Lock()
	delete(h.clients, ch)
	h.mu.Unlock()
	close(ch)
}

// SSE endpoint for browser logs
func (h *BrowserLogHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	ch := h.subscribe()
	defer h.unsubscribe(ch)

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "SSE not supported", http.StatusInternalServerError)
		return
	}

	// Send initial connection message
	fmt.Fprintf(w, "data: [connected to log stream]\n\n")
	flusher.Flush()

	for {
		select {
		case msg := <-ch:
			fmt.Fprintf(w, "data: %s\n\n", msg)
			flusher.Flush()
		case <-r.Context().Done():
			return
		}
	}
}
