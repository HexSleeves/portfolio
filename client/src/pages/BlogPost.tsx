// Terminal Noir — Blog Post Detail Page
// Renders markdown content from .md files using react-markdown + rehype-highlight.
// Only published posts are accessible; drafts (published: false) return a 404.

import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import "highlight.js/styles/github-dark.css";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: post,
    isLoading,
    error,
  } = trpc.blog.bySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <Navigation />
        <div className="size-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mt-20" />
      </div>
    );
  }

  if (!post || error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <Navigation />
        <p
          className="text-5xl font-bold mt-20"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "oklch(0.82 0.15 200)",
          }}
        >
          404
        </p>
        <p
          className="text-sm"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "oklch(0.52 0.015 250)",
          }}
        >
          Post not found or not yet published.
        </p>
        <Link href="/blog">
          <span
            className="text-sm transition-colors cursor-pointer"
            style={{
              color: "oklch(0.82 0.15 200)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ← Back to blog
          </span>
        </Link>
      </div>
    );
  }

  const tags = Array.isArray(post.tags) ? (post.tags as string[]) : [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.085 0.012 265)" }}
    >
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container max-w-3xl">
          {/* Back */}
          <Link href="/blog">
            <span
              className="inline-flex items-center gap-2 text-sm mb-10 transition-colors cursor-pointer"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.82 0.15 200)")
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.52 0.015 250)")
              }
            >
              <ArrowLeft size={14} />
              Back to writing
            </span>
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs"
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
            </div>

            <h1
              className="font-display font-semibold text-3xl lg:text-4xl leading-tight mb-4"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              {post.title}
            </h1>

            <p
              className="text-base leading-relaxed mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.65 0.01 240)",
              }}
            >
              {post.summary}
            </p>

            <div
              className="flex flex-wrap items-center gap-5 pb-6 border-b"
              style={{ borderColor: "oklch(1 0 0 / 8%)" }}
            >
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={13}
                  style={{ color: "oklch(0.52 0.015 250)" }}
                />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} style={{ color: "oklch(0.52 0.015 250)" }} />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  {post.readTime}
                </span>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
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
            </div>
          </header>

          {/* Markdown body */}
          <article className="blog-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                rehypeHighlight,
              ]}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Footer */}
          <div
            className="mt-16 pt-8 border-t"
            style={{ borderColor: "oklch(1 0 0 / 8%)" }}
          >
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              Enjoyed this article? Let's connect.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:lecoqjacob@gmail.com"
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: "oklch(0.82 0.15 200)",
                  color: "oklch(0.085 0.012 265)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Get in touch
              </a>
              <Link href="/blog">
                <span
                  className="px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 cursor-pointer"
                  style={{
                    background: "transparent",
                    borderColor: "oklch(1 0 0 / 8%)",
                    color: "oklch(0.52 0.015 250)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  More articles
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
