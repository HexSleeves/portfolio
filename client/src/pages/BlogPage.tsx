// Terminal Noir — Blog Page
// Reads published posts from the database via tRPC.

import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { useUiStore } from "@/stores/uiStore";
import type { BlogPost } from "../../../drizzle/schema";

function PostCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  const tags = Array.isArray(post.tags) ? (post.tags as string[]) : [];
  return (
    <Link href={`/blog/${post.slug}`}>
      <div
        className="gradient-border rounded-xl p-6 cursor-pointer group h-full flex flex-col gap-4 transition-all duration-200"
        style={featured ? { borderColor: "oklch(0.82 0.15 200 / 25%)" } : {}}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background =
            "oklch(0.13 0.012 265)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "";
        }}
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "oklch(0.82 0.15 200 / 10%)",
              color: "oklch(0.82 0.15 200)",
              fontFamily: "'JetBrains Mono', monospace",
              userSelect: "none",
              cursor: "default",
            }}
          >
            {post.category}
          </span>
          {featured && (
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "oklch(0.16 0.012 265)",
                color: "oklch(0.52 0.015 250)",
                fontFamily: "'JetBrains Mono', monospace",
                userSelect: "none",
                cursor: "default",
              }}
            >
              latest
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className={`font-display font-bold leading-tight transition-colors group-hover:text-cyan-400 ${featured ? "text-xl lg:text-2xl" : "text-lg"}`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "oklch(0.94 0.005 240)",
          }}
        >
          {post.title}
        </h2>

        {/* Summary */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "oklch(0.52 0.015 250)",
          }}
        >
          {post.summary}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "oklch(0.16 0.012 265)",
                  color: "oklch(0.52 0.015 250)",
                  fontFamily: "'JetBrains Mono', monospace",
                  userSelect: "none",
                  cursor: "default",
                }}
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-2 border-t"
          style={{ borderColor: "oklch(1 0 0 / 6%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} style={{ color: "oklch(0.52 0.015 250)" }} />
              <span
                className="text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.52 0.015 250)",
                }}
              >
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} style={{ color: "oklch(0.52 0.015 250)" }} />
              <span
                className="text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.52 0.015 250)",
                }}
              >
                {post.readTime}
              </span>
            </div>
          </div>
          <span
            className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
            style={{
              color: "oklch(0.82 0.15 200)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const activeCategory = useUiStore(state => state.blogCategory);
  const setActiveCategory = useUiStore(state => state.setBlogCategory);
  const { data: allPosts = [], isLoading } = trpc.blog.list.useQuery();

  const publishedCategories = [
    "All",
    ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean))),
  ] as string[];
  const filtered =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter(p => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  return (
    <PageLayout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="section-tag mb-3">// blog</div>
          <h1
            className="font-display font-bold text-4xl lg:text-5xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.94 0.005 240)",
            }}
          >
            Writing
          </h1>
          <p
            className="mt-3 text-base max-w-xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "oklch(0.52 0.015 250)",
            }}
          >
            Thoughts on full-stack engineering, AI systems, DevOps patterns, and
            the craft of building software that lasts.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {publishedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background:
                      activeCategory === cat
                        ? "oklch(0.82 0.15 200)"
                        : "oklch(0.16 0.012 265)",
                    color:
                      activeCategory === cat
                        ? "oklch(0.085 0.012 265)"
                        : "oklch(0.52 0.015 250)",
                    border: `1px solid ${activeCategory === cat ? "oklch(0.82 0.15 200)" : "oklch(1 0 0 / 8%)"}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                className="text-center py-20"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.52 0.015 250)",
                }}
              >
                No published posts in this category yet.
              </div>
            )}

            {/* Featured post */}
            {featured && (
              <div className="mb-6">
                <PostCard post={featured} featured={true} />
              </div>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(post => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
