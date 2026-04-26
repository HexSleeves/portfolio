import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

interface BlogFormState {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string;
  readTime: string;
  published: boolean;
  content: string;
}

const DEFAULT_FORM: BlogFormState = {
  title: "",
  slug: "",
  summary: "",
  category: "Engineering",
  tags: "",
  readTime: "5 min read",
  published: false,
  content: `# Your Post Title

Write your post content here using **Markdown**.

## Section Heading

Paragraph text goes here.

\`\`\`typescript
// Code blocks are fully supported
const hello = "world";
\`\`\`

> Blockquotes look great too.
`,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminBlogEditor() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === "new";
  const postId = isNew ? null : parseInt(params.id!, 10);

  const [form, setForm] = useState<BlogFormState>(DEFAULT_FORM);
  const [preview, setPreview] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  const utils = trpc.useUtils();

  // Load existing post
  const { data: existingPost, isLoading } = trpc.blog.adminById.useQuery(
    { id: postId! },
    { enabled: !isNew && !!postId }
  );

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title,
        slug: existingPost.slug,
        summary: existingPost.summary ?? "",
        category: existingPost.category ?? "Engineering",
        tags: Array.isArray(existingPost.tags) ? (existingPost.tags as string[]).join(", ") : "",
        readTime: existingPost.readTime ?? "5 min read",
        published: existingPost.published ?? false,
        content: existingPost.content,
      });
      setSlugManual(true);
    }
  }, [existingPost]);

  const createPost = trpc.blog.create.useMutation({
    onSuccess: (post) => {
      toast.success("Post created!");
      utils.blog.adminList.invalidate();
      if (post) navigate(`/admin/blog/${post.id}`);
    },
    onError: (err) => toast.error(err.message || "Failed to create post"),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Post saved!");
      utils.blog.adminList.invalidate();
      utils.blog.adminById.invalidate({ id: postId! });
    },
    onError: (err) => toast.error(err.message || "Failed to save post"),
  });

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugManual ? f.slug : slugify(title) }));
  };

  const handleSave = (publish?: boolean) => {
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const data = { ...form, tags, published: publish !== undefined ? publish : form.published };
    if (isNew) {
      createPost.mutate(data);
    } else {
      updatePost.mutate({ id: postId!, ...data });
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  if (!isNew && isLoading) {
    return (
      <AdminLayout title="Edit Post">
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "New Blog Post" : "Edit Post"}>
      <div className="max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all"
              style={{
                borderColor: "oklch(1 0 0 / 10%)",
                color: preview ? "oklch(0.82 0.15 200)" : "oklch(0.52 0.015 250)",
                background: preview ? "oklch(0.82 0.15 200 / 8%)" : "transparent",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {preview ? <EyeOff size={13} /> : <Eye size={13} />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm border transition-all"
              style={{
                borderColor: "oklch(1 0 0 / 12%)",
                color: "oklch(0.75 0.01 240)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Save size={13} /> Save Draft
            </button>
            <button
              onClick={() => handleSave(!form.published)}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: form.published ? "oklch(0.75 0.15 60 / 15%)" : "oklch(0.82 0.15 200)",
                color: form.published ? "oklch(0.75 0.15 60)" : "oklch(0.085 0.012 265)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {isPending ? (
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : form.published ? (
                <EyeOff size={13} />
              ) : (
                <Eye size={13} />
              )}
              {form.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Editor / Preview */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <input
              type="text"
              placeholder="Post title..."
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-xl font-bold outline-none"
              style={{
                background: "oklch(0.10 0.012 265)",
                borderColor: "oklch(1 0 0 / 10%)",
                color: "oklch(0.94 0.005 240)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />

            {/* Content */}
            {preview ? (
              <div
                className="blog-prose rounded-xl border p-6 min-h-[500px]"
                style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 10%)" }}
                dangerouslySetInnerHTML={{ __html: "<em style='color:oklch(0.52 0.015 250)'>Preview renders on the public blog page.</em><br/><br/>" + form.content.replace(/\n/g, "<br/>") }}
              />
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your post in Markdown..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none font-mono"
                rows={28}
                style={{
                  background: "oklch(0.10 0.012 265)",
                  borderColor: "oklch(1 0 0 / 10%)",
                  color: "oklch(0.82 0.005 240)",
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: "1.7",
                }}
              />
            )}
          </div>

          {/* Sidebar: metadata */}
          <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-4" style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                Metadata
              </h3>

              {/* Slug */}
              <div>
                <label className="block text-xs mb-1" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none font-mono"
                  style={{ background: "oklch(0.085 0.012 265)", borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.82 0.15 200)", fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs mb-1" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none resize-none"
                  style={{ background: "oklch(0.085 0.012 265)", borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs mb-1" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none"
                  style={{ background: "oklch(0.085 0.012 265)", borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs mb-1" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="TypeScript, React, DevOps"
                  className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none"
                  style={{ background: "oklch(0.085 0.012 265)", borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Read time */}
              <div>
                <label className="block text-xs mb-1" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                  placeholder="5 min read"
                  className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none"
                  style={{ background: "oklch(0.085 0.012 265)", borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Status */}
              <div className="pt-2 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>Status</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      background: form.published ? "oklch(0.75 0.18 145 / 12%)" : "oklch(0.75 0.15 60 / 12%)",
                      color: form.published ? "oklch(0.75 0.18 145)" : "oklch(0.75 0.15 60)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
