// Terminal Noir — Blog Post Detail Page

import { useParams, Link } from "wouter";
import { blogPosts } from "@/lib/data";
import Navigation from "@/components/Navigation";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { Streamdown } from "streamdown";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.085 0.012 265)" }}>
        <div className="text-center">
          <p className="font-mono text-cyan-400 mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>404</p>
          <Link href="/" className="text-slate-400 hover:text-slate-100 transition-colors text-sm">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.085 0.012 265)" }}>
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container max-w-2xl">
          {/* Back */}
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}
          >
            <ArrowLeft size={14} />
            Back to writing
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "oklch(0.82 0.15 200 / 10%)",
                  color: "oklch(0.82 0.15 200)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {post.category}
              </span>
            </div>

            <h1
              className="font-display font-bold text-3xl lg:text-4xl mb-4 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
            >
              {post.title}
            </h1>

            <p
              className="text-lg leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
            >
              {post.summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} style={{ color: "oklch(0.52 0.015 250)" }} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                >
                  {formatDate(post.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} style={{ color: "oklch(0.52 0.015 250)" }} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                >
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="skill-tag text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-8" style={{ background: "oklch(1 0 0 / 8%)" }} />

          {/* Content */}
          <div
            className="prose prose-invert max-w-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "oklch(0.75 0.01 240)",
              lineHeight: "1.8",
            }}
          >
            <Streamdown
              className="blog-content"
            >
              {post.content}
            </Streamdown>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
            <p
              className="text-sm mb-4"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
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
              <Link
                href="/#blog"
                className="px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200"
                style={{
                  background: "transparent",
                  borderColor: "oklch(1 0 0 / 8%)",
                  color: "oklch(0.52 0.015 250)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                More articles
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
