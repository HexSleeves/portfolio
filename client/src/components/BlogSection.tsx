// Terminal Noir — Blog Section
// Editorial 2-col layout with featured post and article cards

import { useEffect, useRef, useState } from "react";
import { blogPosts } from "@/lib/data";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogSection() {
  const { ref, inView } = useInView();
  const [featured, ...rest] = blogPosts;

  return (
    <section id="blog" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />

      <div className="container">
        <div ref={ref}>
          {/* Header */}
          <div className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="section-tag mb-4">// writing</div>
            <h2
              className="font-display font-bold text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
            >
              Thoughts on engineering
            </h2>
          </div>

          {/* Featured post */}
          <div
            className={`mb-8 transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link href={`/blog/${featured.slug}`}>
              <div
                className="gradient-border rounded-xl p-8 cursor-pointer group"
                style={{ borderColor: "oklch(0.82 0.15 200 / 20%)" }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: "oklch(0.82 0.15 200 / 10%)",
                      color: "oklch(0.82 0.15 200)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    featured
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: "oklch(1 0 0 / 5%)",
                      color: "oklch(0.52 0.015 250)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {featured.category}
                  </span>
                </div>

                <h3
                  className="font-display font-bold text-2xl lg:text-3xl mb-3 leading-tight group-hover:text-cyan-400 transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
                >
                  {featured.title}
                </h3>

                <p
                  className="text-base leading-relaxed mb-6 max-w-2xl"
                  style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
                >
                  {featured.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} style={{ color: "oklch(0.52 0.015 250)" }} />
                      <span
                        className="text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                      >
                        {formatDate(featured.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} style={{ color: "oklch(0.52 0.015 250)" }} />
                      <span
                        className="text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                      >
                        {featured.readTime}
                      </span>
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all"
                    style={{ color: "oklch(0.82 0.15 200)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Read article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Other posts grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <div
                key={post.slug}
                className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${(i + 2) * 80}ms` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="gradient-border rounded-xl p-5 h-full flex flex-col gap-3 cursor-pointer group">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: "oklch(1 0 0 / 5%)",
                          color: "oklch(0.52 0.015 250)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h3
                      className="font-display font-semibold text-base leading-snug group-hover:text-cyan-400 transition-colors flex-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
                    >
                      {post.summary}
                    </p>

                    <div className="flex items-center gap-3 mt-auto pt-2">
                      <span
                        className="text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                      >
                        {formatDate(post.date)}
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                      >
                        · {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
