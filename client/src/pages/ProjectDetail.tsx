// Terminal Noir — Project Detail Page

import { useParams, Link } from "wouter";
import { projects } from "@/lib/data";
import Navigation from "@/components/Navigation";
import { Github, ExternalLink, Lock, ArrowLeft, CheckCircle } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
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
        <div className="container max-w-3xl">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.15 200)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.015 250)")}
          >
            <ArrowLeft size={14} />
            Back to projects
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="px-2 py-0.5 rounded-full text-xs capitalize"
                style={{
                  background: "oklch(0.82 0.15 200 / 10%)",
                  color: "oklch(0.82 0.15 200)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {project.category}
              </span>
              {project.isPrivate && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: "oklch(1 0 0 / 5%)",
                    color: "oklch(0.52 0.015 250)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <Lock size={10} />
                  private project
                </span>
              )}
            </div>

            <h1
              className="font-display font-bold text-3xl lg:text-4xl mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
            >
              {project.title}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
            >
              {project.summary}
            </p>

            {/* Links */}
            <div className="flex items-center gap-3 mt-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200"
                  style={{
                    background: "oklch(0.16 0.012 265)",
                    borderColor: "oklch(1 0 0 / 8%)",
                    color: "oklch(0.94 0.005 240)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Github size={14} />
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    background: "oklch(0.82 0.15 200)",
                    color: "oklch(0.085 0.012 265)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-8" style={{ background: "oklch(1 0 0 / 8%)" }} />

          {/* Content sections */}
          <div className="space-y-8">
            {[
              { label: "// the problem", content: project.problem },
              { label: "// my role", content: project.role },
              { label: "// results & impact", content: project.results },
            ].map(({ label, content }) => (
              <div key={label}>
                <div className="section-tag mb-3">{label}</div>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.75 0.01 240)" }}
                >
                  {content}
                </p>
              </div>
            ))}

            {/* Features */}
            <div>
              <div className="section-tag mb-3">// key features</div>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.75 0.01 240)" }}
                  >
                    <CheckCircle size={14} style={{ color: "oklch(0.82 0.15 200)", flexShrink: 0, marginTop: "2px" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <div className="section-tag mb-3">// technologies</div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="skill-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Private note */}
            {project.isPrivate && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  background: "oklch(0.11 0.012 265)",
                  borderColor: "oklch(1 0 0 / 8%)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={14} style={{ color: "oklch(0.52 0.015 250)" }} />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.94 0.005 240)" }}
                  >
                    Private Project
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
                >
                  This project is not publicly available. Code and demos can be discussed during an interview or consultation. Feel free to{" "}
                  <a
                    href="mailto:lecoqjacob@gmail.com"
                    style={{ color: "oklch(0.82 0.15 200)" }}
                  >
                    reach out
                  </a>{" "}
                  for more details.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
