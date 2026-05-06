// Terminal Noir — Projects Page
// Full filterable project grid — reads from database via tRPC

import { Link } from "wouter";
import { Code2 as Github, ExternalLink, Lock, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { useUiStore } from "@/stores/uiStore";
import type { Project } from "../../../drizzle/schema";

const filters = [
  { label: "All", value: "all" },
  { label: "Open Source", value: "open-source" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
];

function ProjectCard({ project }: { project: Project }) {
  const technologies = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];
  return (
    <div className="gradient-border rounded-xl p-6 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.isFeatured && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "oklch(0.82 0.15 200 / 10%)",
                color: "oklch(0.82 0.15 200)",
                fontFamily: "'JetBrains Mono', monospace",
                userSelect: "none",
                cursor: "default",
              }}
            >
              <Star size={9} fill="currentColor" /> featured
            </span>
          )}
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
              <Lock size={9} /> private
            </span>
          )}
          <span
            className="px-2 py-0.5 rounded-full text-xs capitalize"
            style={{
              background: "oklch(1 0 0 / 5%)",
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
              userSelect: "none",
              cursor: "default",
            }}
          >
            {project.category}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = "oklch(0.94 0.005 240)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
              }
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = "oklch(0.94 0.005 240)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
              }
              aria-label="Live demo"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      <h3
        className="font-display font-bold text-lg leading-tight"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: "oklch(0.94 0.005 240)",
        }}
      >
        {project.title}
      </h3>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "oklch(0.52 0.015 250)",
        }}
      >
        {project.summary}
      </p>

      {/* Description */}
      {project.description && (
        <div
          className="text-xs leading-relaxed p-3 rounded-md"
          style={{
            background: "oklch(0.82 0.15 200 / 5%)",
            borderLeft: "2px solid oklch(0.82 0.15 200 / 40%)",
            fontFamily: "'Inter', sans-serif",
            color: "oklch(0.75 0.02 240)",
          }}
        >
          {project.description}
        </div>
      )}

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {technologies.slice(0, 5).map(tech => (
          <span key={tech} className="skill-tag text-xs">
            {tech}
          </span>
        ))}
        {technologies.length > 5 && (
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
            +{technologies.length - 5}
          </span>
        )}
      </div>

      <Link href={`/projects/${project.slug}`}>
        <span
          className="text-xs font-medium transition-colors mt-1 self-start cursor-pointer"
          style={{
            color: "oklch(0.82 0.15 200)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          View case study →
        </span>
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
  const activeFilter = useUiStore(state => state.projectFilter);
  const setActiveFilter = useUiStore(state => state.setProjectFilter);
  const { data: filtered = [], isLoading } = trpc.projects.list.useQuery(
    activeFilter === "all"
      ? {}
      : {
          category: activeFilter as "open-source" | "professional" | "personal",
        }
  );

  return (
    <PageLayout>
      <div className="container py-12">
        {/* Page header */}
        <div className="mb-10">
          <div className="section-tag mb-3">// projects</div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1
              className="font-display font-bold text-4xl lg:text-5xl"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Things I've built
            </h1>
            <a
              href="https://github.com/HexSleeves"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = "oklch(0.82 0.15 200)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
              }
            >
              <Github size={14} /> View all on GitHub
            </a>
          </div>
          <p
            className="mt-3 text-base max-w-xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "oklch(0.52 0.015 250)",
            }}
          >
            Open source tools, professional platform work, and personal projects
            — spanning AI agents, cloud infrastructure, and full-stack
            applications.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                background:
                  activeFilter === f.value
                    ? "oklch(0.82 0.15 200)"
                    : "oklch(0.16 0.012 265)",
                color:
                  activeFilter === f.value
                    ? "oklch(0.085 0.012 265)"
                    : "oklch(0.52 0.015 250)",
                border: `1px solid ${activeFilter === f.value ? "oklch(0.82 0.15 200)" : "oklch(1 0 0 / 8%)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!isLoading && (
          <>
            {filtered.length === 0 && (
              <div
                className="text-center py-20"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.52 0.015 250)",
                }}
              >
                No projects in this category yet.
              </div>
            )}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
