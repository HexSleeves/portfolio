package main

import (
	"bytes"
	"errors"
	"strings"
	"testing"
)

func TestRunMainReturnsExitCodes(t *testing.T) {
	prevRunFn := runFn
	t.Cleanup(func() {
		runFn = prevRunFn
	})

	t.Run("success", func(t *testing.T) {
		runFn = func() error { return nil }

		var stderr bytes.Buffer
		if code := runMain(&stderr); code != 0 {
			t.Fatalf("expected exit code 0, got %d", code)
		}
		if stderr.Len() != 0 {
			t.Fatalf("expected no stderr output, got %q", stderr.String())
		}
	})

	t.Run("failure", func(t *testing.T) {
		runFn = func() error { return errors.New("boom") }

		var stderr bytes.Buffer
		if code := runMain(&stderr); code != 1 {
			t.Fatalf("expected exit code 1, got %d", code)
		}
		if !strings.Contains(stderr.String(), "boom") {
			t.Fatalf("expected stderr to include error, got %q", stderr.String())
		}
	})
}
