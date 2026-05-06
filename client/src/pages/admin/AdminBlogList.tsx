import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminBlogList() {
  const search = useUiStore(state => state.adminBlogSearch);
  const setSearch = useUiStore(state => state.setAdminBlogSearch);
  const utils = trpc.useUtils();

  const { data: allPosts = [], isLoading } = trpc.blog.adminList.useQuery();
  const posts = allPosts.filter(
    p => !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.adminList.invalidate();
      toast.success("Post updated");
    },
    onError: () => toast.error("Failed to update post"),
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      utils.blog.adminList.invalidate();
      toast.success("Post deleted");
    },
    onError: () => toast.error("Failed to delete post"),
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deletePost.mutate({ id });
  };

  return (
    <AdminLayout title="Blog Posts">
      <div className="max-w-4xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "oklch(0.52 0.015 250)" }}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none border"
              style={{
                background: "oklch(0.10 0.012 265)",
                borderColor: "oklch(1 0 0 / 10%)",
                color: "oklch(0.88 0.005 240)",
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <Link href="/admin/blog/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "oklch(0.82 0.15 200)",
                color: "oklch(0.085 0.012 265)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Plus size={14} /> New Post
            </button>
          </Link>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl border"
            style={{
              borderColor: "oklch(1 0 0 / 8%)",
              background: "oklch(0.10 0.012 265)",
            }}
          >
            <BookOpenIcon />
            <p
              className="text-sm mt-3 mb-4"
              style={{
                color: "oklch(0.52 0.015 250)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {search ? "No posts match your search." : "No blog posts yet."}
            </p>
            {!search && (
              <Link href="/admin/blog/new">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: "oklch(0.82 0.15 200 / 15%)",
                    color: "oklch(0.82 0.15 200)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Write your first post
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                style={{
                  background: "oklch(0.10 0.012 265)",
                  borderColor: "oklch(1 0 0 / 8%)",
                }}
              >
                {/* Status badge */}
                <span
                  className="px-2 py-0.5 rounded text-xs flex-shrink-0"
                  style={{
                    background: post.published
                      ? "oklch(0.75 0.18 145 / 12%)"
                      : "oklch(0.75 0.15 60 / 12%)",
                    color: post.published
                      ? "oklch(0.75 0.18 145)"
                      : "oklch(0.75 0.15 60)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {post.published ? "live" : "draft"}
                </span>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium truncate"
                    style={{
                      color: "oklch(0.88 0.005 240)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {post.title}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className="text-xs"
                      style={{
                        color: "oklch(0.52 0.015 250)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{
                        color: "oklch(0.52 0.015 250)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      <Calendar size={10} />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Toggle publish */}
                  <button
                    onClick={() =>
                      togglePublish.mutate({
                        id: post.id,
                        published: !post.published,
                      })
                    }
                    disabled={togglePublish.isPending}
                    className="p-2 rounded-lg transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}
                    style={{ color: "oklch(0.52 0.015 250)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "oklch(0.82 0.15 200)";
                      e.currentTarget.style.background =
                        "oklch(0.82 0.15 200 / 8%)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "oklch(0.52 0.015 250)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Edit */}
                  <Link href={`/admin/blog/${post.id}`}>
                    <button
                      className="p-2 rounded-lg transition-colors"
                      title="Edit"
                      style={{ color: "oklch(0.52 0.015 250)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "oklch(0.82 0.15 200)";
                        e.currentTarget.style.background =
                          "oklch(0.82 0.15 200 / 8%)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "oklch(0.52 0.015 250)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Edit size={14} />
                    </button>
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletePost.isPending}
                    className="p-2 rounded-lg transition-colors"
                    title="Delete"
                    style={{ color: "oklch(0.52 0.015 250)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "oklch(0.65 0.15 25)";
                      e.currentTarget.style.background =
                        "oklch(0.65 0.15 25 / 8%)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "oklch(0.52 0.015 250)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function BookOpenIcon() {
  return (
    <div
      className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center"
      style={{ background: "oklch(0.82 0.15 200 / 10%)" }}
    >
      <Eye size={18} style={{ color: "oklch(0.82 0.15 200)" }} />
    </div>
  );
}
