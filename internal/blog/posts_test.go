package blog

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRenderMarkdownSkipsRawHTMLAndHardensExternalLinks(t *testing.T) {
	rendered := string(RenderMarkdown([]byte(`
<script>alert("owned")</script>
<div>raw html</div>

[safe](https://example.com)
[bad](javascript:alert(1))
[relative](/blog/hello-world)
`)))

	for _, blocked := range []string{"<script>", "<div>", `href="javascript:alert(1)"`} {
		if strings.Contains(rendered, blocked) {
			t.Fatalf("expected rendered markdown to skip raw HTML, found %q in %q", blocked, rendered)
		}
	}

	if !strings.Contains(rendered, `href="https://example.com"`) {
		t.Fatalf("expected rendered markdown to include external link: %q", rendered)
	}
	if !strings.Contains(rendered, `target="_blank"`) {
		t.Fatalf("expected rendered markdown to open external links in a new tab: %q", rendered)
	}
	if !strings.Contains(rendered, `rel="noreferrer noopener"`) {
		t.Fatalf("expected rendered markdown to include rel hardening on external links: %q", rendered)
	}
	if strings.Contains(rendered, `href="/blog/hello-world" target="_blank"`) {
		t.Fatalf("expected relative links to avoid blank-target hardening meant for external links: %q", rendered)
	}
	if strings.Contains(rendered, `href="/blog/hello-world" rel=`) {
		t.Fatalf("expected relative links to avoid external-link rel attributes: %q", rendered)
	}
}

func TestLoadPostsFiltersDraftsAndSortsPublishedPosts(t *testing.T) {
	postsDir := t.TempDir()

	files := map[string]string{
		"published-newer.md": `---
title: Newer
date: 2026-01-02
published: true
---
Newer post.
`,
		"published-older.md": `---
title: Older
date: 2026-01-01
published: true
---
Older post.
`,
		"draft.md": `---
title: Draft
date: 2026-01-03
published: false
---
Should stay hidden.
`,
		"notes.txt": "not a markdown post",
	}

	for name, contents := range files {
		if err := os.WriteFile(filepath.Join(postsDir, name), []byte(contents), 0o600); err != nil {
			t.Fatalf("write %s: %v", name, err)
		}
	}

	posts, err := LoadPosts(postsDir)
	if err != nil {
		t.Fatalf("LoadPosts returned error: %v", err)
	}

	if len(posts) != 2 {
		t.Fatalf("expected 2 published posts, got %d", len(posts))
	}

	if posts[0].Slug != "published-newer" {
		t.Fatalf("expected newest post first, got %q", posts[0].Slug)
	}
	if posts[1].Slug != "published-older" {
		t.Fatalf("expected older post second, got %q", posts[1].Slug)
	}

	for _, post := range posts {
		if post.Slug == "draft" {
			t.Fatalf("expected draft post to be filtered out")
		}
	}
}
