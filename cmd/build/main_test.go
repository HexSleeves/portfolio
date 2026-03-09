package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestCopyDirCopiesNestedFiles(t *testing.T) {
	srcDir := filepath.Join(t.TempDir(), "src")
	dstDir := filepath.Join(t.TempDir(), "dst")

	nestedDir := filepath.Join(srcDir, "images")
	if err := os.MkdirAll(nestedDir, 0o750); err != nil {
		t.Fatalf("mkdir nested dir: %v", err)
	}

	srcFile := filepath.Join(nestedDir, "profile.jpg")
	if err := os.WriteFile(srcFile, []byte("image-bytes"), 0o600); err != nil {
		t.Fatalf("write src file: %v", err)
	}

	if err := copyDir(srcDir, dstDir); err != nil {
		t.Fatalf("copyDir returned error: %v", err)
	}

	copiedFile := filepath.Join(dstDir, "images", "profile.jpg")
	data, err := os.ReadFile(copiedFile)
	if err != nil {
		t.Fatalf("read copied file: %v", err)
	}
	if string(data) != "image-bytes" {
		t.Fatalf("expected copied file contents to match source")
	}
}
