import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  ExternalLink,
  FolderOpen,
  Plus,
  Settings,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: posts = [] } = trpc.blog.adminList.useQuery();
  const { data: projects = [] } = trpc.projects.adminList.useQuery();

  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = posts.filter(p => !p.published).length;
  const featuredProjects = projects.filter(p => p.isFeatured).length;

  const stats = [
    {
      label: "Published Posts",
      value: publishedPosts,
      sub: `${draftPosts} draft${draftPosts !== 1 ? "s" : ""}`,
      href: "/admin/blog",
      color: "oklch(0.82 0.15 200)",
    },
    {
      label: "Total Projects",
      value: projects.length,
      sub: `${featuredProjects} featured`,
      href: "/admin/projects",
      color: "oklch(0.75 0.18 145)",
    },
  ];

  const quickActions = [
    {
      label: "New Blog Post",
      href: "/admin/blog/new",
      icon: Plus,
      desc: "Write a new article",
    },
    {
      label: "New Project",
      href: "/admin/projects/new",
      icon: Plus,
      desc: "Add a project",
    },
    {
      label: "Manage Blog",
      href: "/admin/blog",
      icon: BookOpen,
      desc: "Edit or delete posts",
    },
    {
      label: "Manage Projects",
      href: "/admin/projects",
      icon: FolderOpen,
      desc: "Edit or delete projects",
    },
    {
      label: "Site Settings",
      href: "/admin/settings",
      icon: Settings,
      desc: "Update bio, banner, etc.",
    },
    {
      label: "View Portfolio",
      href: "/",
      icon: ExternalLink,
      desc: "See the live site",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-4xl space-y-8">
        {/* Welcome */}
        <div>
          <h2
            className="text-2xl font-semibold mb-1"
            style={{
              color: "oklch(0.94 0.005 240)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Welcome back, Jacob
          </h2>
          <p
            className="text-sm"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Manage your portfolio content from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map(stat => (
            <Link key={stat.label} href={stat.href}>
              <div
                className="rounded-xl p-5 border cursor-pointer transition-all duration-150 group"
                style={{
                  background: "oklch(0.10 0.012 265)",
                  borderColor: "oklch(1 0 0 / 8%)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor =
                    "oklch(0.82 0.15 200 / 25%)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "oklch(1 0 0 / 8%)";
                }}
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: stat.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium mb-0.5"
                  style={{
                    color: "oklch(0.75 0.01 240)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: "oklch(0.52 0.015 250)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {stat.sub}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3
            className="text-sm font-semibold mb-3 uppercase tracking-widest"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map(action => (
              <Link key={action.href} href={action.href}>
                <div
                  className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150"
                  style={{
                    background: "oklch(0.10 0.012 265)",
                    borderColor: "oklch(1 0 0 / 8%)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor =
                      "oklch(0.82 0.15 200 / 20%)";
                    e.currentTarget.style.background = "oklch(0.12 0.014 265)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "oklch(1 0 0 / 8%)";
                    e.currentTarget.style.background = "oklch(0.10 0.012 265)";
                  }}
                >
                  <div
                    className="size-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.82 0.15 200 / 10%)" }}
                  >
                    <action.icon
                      size={14}
                      style={{ color: "oklch(0.82 0.15 200)" }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium"
                      style={{
                        color: "oklch(0.88 0.005 240)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {action.label}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "oklch(0.52 0.015 250)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {action.desc}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        {posts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold uppercase tracking-widest"
                style={{
                  color: "oklch(0.52 0.015 250)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Recent Blog Posts
              </h3>
              <Link href="/admin/blog">
                <span
                  className="text-xs"
                  style={{
                    color: "oklch(0.82 0.15 200)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  View all →
                </span>
              </Link>
            </div>
            <div className="space-y-2">
              {posts.slice(0, 5).map(post => (
                <Link key={post.id} href={`/admin/blog/${post.id}`}>
                  <div
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      background: "oklch(0.10 0.012 265)",
                      borderColor: "oklch(1 0 0 / 6%)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.82 0.15 200 / 15%)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "oklch(1 0 0 / 6%)";
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs flex-shrink-0"
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
                      <span
                        className="text-sm truncate"
                        style={{
                          color: "oklch(0.82 0.005 240)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {post.title}
                      </span>
                    </div>
                    <span
                      className="text-xs flex-shrink-0 ml-3"
                      style={{
                        color: "oklch(0.52 0.015 250)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
