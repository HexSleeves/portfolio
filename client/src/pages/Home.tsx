// Terminal Noir — Home Page (Showcase)
// Hero + featured projects snapshot + skills preview + latest blog post + contact CTA

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Github, Star, Lock, ExternalLink, Calendar, Clock } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { skillCategories, stats } from "@/lib/data";
import { trpc } from "@/lib/trpc";

// ─── Typewriter hook ─────────────────────────────────────────
const taglines = ["Full-Stack Engineer", "AI Platform Builder", "DevOps Architect", "Open Source Author"];

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((w) => (w + 1) % words.length);
    }
    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

// ─── Hero ─────────────────────────────────────────────────────
function HeroSection() {
  const tagline = useTypewriter(taglines);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663074844816/D7Scsbof2ga2vbCvASFLcE/hero-bg-Rhiwk8BwfqiAMSinatKnvV.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.085_0.012_265)] via-[oklch(0.085_0.012_265/0.7)] to-transparent" />
      <div
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.82 0.15 200)" }}
      />

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <div className={`section-tag mb-5 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            // hello, world
          </div>

          <h1
            className={`font-display font-bold leading-none tracking-tight mb-4 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              color: "oklch(0.94 0.005 240)",
            }}
          >
            Jacob{" "}
            <span style={{ color: "oklch(0.82 0.15 200)" }}>LeCoq</span>
          </h1>

          <div className={`flex items-center mb-6 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "oklch(0.52 0.015 250)" }}>
              Senior&nbsp;
            </span>
            <span className="font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "oklch(0.82 0.15 200)" }}>
              {tagline}
            </span>
            <span className="typewriter-cursor" />
          </div>

          <p className={`text-base leading-relaxed mb-10 max-w-lg transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}>
            I build cloud-scale platforms, AI agent systems, and developer tooling that teams actually want to use. 8+ years shipping production software at Bayer, DNAnexus, and beyond.
          </p>

          <div className={`flex flex-wrap items-center gap-3 mb-14 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link href="/projects">
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm transition-all duration-200 hover:gap-3"
                style={{ background: "oklch(0.82 0.15 200)", color: "oklch(0.085 0.012 265)", fontFamily: "'Inter', sans-serif" }}>
                View My Work <ArrowRight size={15} />
              </span>
            </Link>
            <Link href="/about">
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm border transition-all duration-200"
                style={{ borderColor: "oklch(1 0 0 / 12%)", color: "oklch(0.75 0.01 240)", fontFamily: "'Inter', sans-serif" }}>
                About Me
              </span>
            </Link>
            <a href="https://github.com/HexSleeves" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm transition-colors"
              style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>
              <Github size={15} />
              HexSleeves
            </a>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display font-bold text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.82 0.15 200)" }}>
                  {stat.value}
                </span>
                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Projects ────────────────────────────────────────
function FeaturedProjects() {
  const { data: featured = [] } = trpc.projects.featured.useQuery();

  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-tag mb-3">// featured work</div>
            <h2 className="font-display font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
              Selected Projects
            </h2>
          </div>
          <Link href="/projects">
            <span className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}>
              View all <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <div className="gradient-border rounded-xl p-5 h-full flex flex-col gap-3 cursor-pointer group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{ background: "oklch(0.82 0.15 200 / 10%)", color: "oklch(0.82 0.15 200)", fontFamily: "'JetBrains Mono', monospace" }}>
                        <Star size={9} fill="currentColor" /> featured
                      </span>
                    )}
                    {project.isPrivate && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{ background: "oklch(1 0 0 / 5%)", color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                        <Lock size={9} /> private
                      </span>
                    )}
                  </div>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: "oklch(0.52 0.015 250)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.94 0.005 240)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}>
                      <Github size={15} />
                    </a>
                  )}
                </div>

                <h3 className="font-display font-bold text-base group-hover:text-cyan-400 transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
                  {project.title}
                </h3>

                <p className="text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}>
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {(Array.isArray(project.technologies) ? (project.technologies as string[]) : []).slice(0, 4).map((tech) => (
                    <span key={tech} className="skill-tag text-xs">{tech}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills Snapshot ──────────────────────────────────────────
function SkillsSnapshot() {
  const topCategories = skillCategories.slice(0, 4);

  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-tag mb-3">// skills</div>
            <h2 className="font-display font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
              The stack I ship with
            </h2>
          </div>
          <Link href="/resume">
            <span className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}>
              Full resume <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        <div className="space-y-5">
          {topCategories.map((cat) => (
            <div key={cat.name} className="flex items-start gap-6">
              <div className="w-28 flex-shrink-0 pt-0.5">
                <span className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}>
                  {cat.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Latest Blog Post ─────────────────────────────────────────
function LatestPost() {
  const { data: posts = [] } = trpc.blog.list.useQuery();
  const post = posts[0];

  if (!post) return null;

  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-tag mb-3">// latest writing</div>
            <h2 className="font-display font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
              From the blog
            </h2>
          </div>
          <Link href="/blog">
            <span className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}>
              All articles <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <div className="gradient-border rounded-xl p-7 cursor-pointer group" style={{ borderColor: "oklch(0.82 0.15 200 / 15%)" }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: "oklch(0.82 0.15 200 / 10%)", color: "oklch(0.82 0.15 200)", fontFamily: "'JetBrains Mono', monospace" }}>
                {post.category}
              </span>
            </div>
            <h3 className="font-display font-bold text-xl lg:text-2xl mb-3 group-hover:text-cyan-400 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
              {post.title}
            </h3>
            <p className="text-sm leading-relaxed mb-5 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}>
              {post.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} style={{ color: "oklch(0.52 0.015 250)" }} />
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recent"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: "oklch(0.52 0.015 250)" }} />
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}>
                    {post.readTime}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all"
                style={{ color: "oklch(0.82 0.15 200)", fontFamily: "'Inter', sans-serif" }}>
                Read article <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

// ─── Contact CTA ──────────────────────────────────────────────
function ContactCTA() {
  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.82 0.15 200)" }}
      />
      <div className="container relative z-10">
        <div className="max-w-xl">
          <div className="section-tag mb-4">// contact</div>
          <h2 className="font-display font-bold text-3xl lg:text-4xl mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}>
            Let's build something{" "}
            <span style={{ color: "oklch(0.82 0.15 200)" }}>together</span>
          </h2>
          <p className="text-base leading-relaxed mb-8"
            style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}>
            Open to senior engineering roles, technical consulting, and interesting open-source collaborations.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:lecoqjacob@gmail.com"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
              style={{ background: "oklch(0.82 0.15 200)", color: "oklch(0.085 0.012 265)", fontFamily: "'Inter', sans-serif" }}>
              lecoqjacob@gmail.com
            </a>
            <a href="https://github.com/HexSleeves" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border transition-all duration-200"
              style={{ borderColor: "oklch(1 0 0 / 12%)", color: "oklch(0.75 0.01 240)", fontFamily: "'Inter', sans-serif" }}>
              <Github size={15} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-8" style={{ borderColor: "oklch(1 0 0 / 5%)" }}>
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.52 0.015 250)" }}>
          Jacob LeCoq · Lafayette, LA · {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-4">
          {[
            { href: "/projects", label: "Projects" },
            { href: "/resume", label: "Resume" },
            { href: "/blog", label: "Blog" },
            { href: "/about", label: "About" },
          ].map((l) => (
            <Link key={l.href} href={l.href}>
              <span className="text-xs transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}>
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturedProjects />
      <SkillsSnapshot />
      <LatestPost />
      <ContactSection />
    </PageLayout>
  );
}
