// Terminal Noir — Project Detail Page
// Reads from database via tRPC

import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  ArrowLeft,
  CheckCircle,
  Code2 as Github,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: project,
    isLoading,
    error,
  } = trpc.projects.bySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <Navigation />
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mt-20" />
      </div>
    );
  }

  if (!project || error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <Navigation />
        <div className="text-center mt-20">
          <p
            className="font-mono text-cyan-400 mb-4 text-5xl font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            404
          </p>
          <Link href="/projects">
            <span className="text-slate-400 hover:text-slate-100 transition-colors text-sm cursor-pointer">
              ← Back to projects
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const technologies = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.085 0.012 265)" }}
    >
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container max-w-3xl">
          {/* Back */}
          <Link href="/projects">
            <span
              className="inline-flex items-center gap-2 text-sm mb-8 transition-colors cursor-pointer"
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
              Back to projects
            </span>
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
                  userSelect: "none",
                  cursor: "default",
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
                    userSelect: "none",
                    cursor: "default",
                  }}
                >
                  <Lock size={10} /> private project
                </span>
              )}
            </div>

            <h1
              className="font-display font-bold text-3xl lg:text-4xl mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              {project.title}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
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
                  <Github size={14} /> View on GitHub
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
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{ background: "oklch(1 0 0 / 8%)" }}
          />

          {/* Content sections */}
          <div className="space-y-8">
            {project.description && (
              <div>
                <div className="section-tag mb-3">// about this project</div>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.75 0.01 240)",
                  }}
                >
                  {project.description}
                </p>
              </div>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div>
                <div className="section-tag mb-3">// technologies</div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map(tech => (
                    <span key={tech} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stars */}
            {project.stars != null && project.stars > 0 && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.82 0.15 200)",
                }}
              >
                <CheckCircle size={14} />
                {project.stars} GitHub stars
              </div>
            )}

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
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "oklch(0.94 0.005 240)",
                    }}
                  >
                    Private Project
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  This project is not publicly available. Code and demos can be
                  discussed during an interview or consultation. Feel free to{" "}
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
