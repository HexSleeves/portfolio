// Terminal Noir — Projects Section
// Filterable project cards with featured highlighting

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/data";
import { Code2 as Github, ExternalLink, Lock, Star } from "lucide-react";
import { Link } from "wouter";

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const filters = [
  { label: "All", value: "all" },
  { label: "Open Source", value: "open-source" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
];

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: Project;
  index: number;
  inView: boolean;
}) {
  return (
    <div
      className={`gradient-border rounded-xl p-6 flex flex-col gap-4 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${project.isFeatured ? "border-cyan-400/20" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {project.isFeatured && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "oklch(0.82 0.15 200 / 10%)",
                  color: "oklch(0.82 0.15 200)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <Star size={10} fill="currentColor" />
                featured
              </span>
            )}
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
                private
              </span>
            )}
            <span
              className="px-2 py-0.5 rounded-full text-xs capitalize"
              style={{
                background: "oklch(1 0 0 / 5%)",
                color: "oklch(0.52 0.015 250)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {project.category}
            </span>
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
        </div>

        {/* Links */}
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
              <Github size={16} />
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
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "oklch(0.52 0.015 250)",
        }}
      >
        {project.summary}
      </p>

      {/* Results highlight */}
      <div
        className="text-xs leading-relaxed p-3 rounded-md"
        style={{
          background: "oklch(0.82 0.15 200 / 5%)",
          borderLeft: "2px solid oklch(0.82 0.15 200 / 40%)",
          fontFamily: "'Inter', sans-serif",
          color: "oklch(0.75 0.02 240)",
        }}
      >
        {project.results}
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 5).map(tech => (
          <span key={tech} className="skill-tag text-xs">
            {tech}
          </span>
        ))}
        {project.technologies.length > 5 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "oklch(0.16 0.012 265)",
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            +{project.technologies.length - 5}
          </span>
        )}
      </div>

      {/* View details */}
      <Link
        href={`/projects/${project.slug}`}
        className="text-xs font-medium transition-colors mt-1 self-start"
        style={{
          color: "oklch(0.82 0.15 200)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        View case study →
      </Link>
    </div>
  );
}

export default function ProjectsSection() {
  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "oklch(1 0 0 / 5%)" }}
      />

      <div className="container">
        <div ref={ref}>
          {/* Header */}
          <div
            className={`mb-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="section-tag mb-4">// projects</div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                className="font-display font-bold text-4xl lg:text-5xl leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                Things I've built
              </h2>
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
                <Github size={14} />
                View all on GitHub
              </a>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`flex flex-wrap gap-2 mb-10 transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
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

          {/* Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
