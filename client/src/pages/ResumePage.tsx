// Terminal Noir — Resume Page
// Full experience timeline, skills, education

import PageLayout from "@/components/PageLayout";
import { experience, skillCategories } from "@/lib/data";
import { Briefcase, MapPin, Download } from "lucide-react";

function ExperienceTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px"
        style={{ background: "oklch(1 0 0 / 8%)" }}
      />
      <div className="space-y-8">
        {experience.map((job, i) => (
          <div key={i} className="relative pl-12">
            {/* Dot */}
            <div
              className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: job.current
                  ? "oklch(0.82 0.15 200 / 15%)"
                  : "oklch(0.16 0.012 265)",
                border: `1px solid ${job.current ? "oklch(0.82 0.15 200 / 50%)" : "oklch(1 0 0 / 10%)"}`,
              }}
            >
              <Briefcase
                size={13}
                style={{
                  color: job.current
                    ? "oklch(0.82 0.15 200)"
                    : "oklch(0.52 0.015 250)",
                }}
              />
            </div>

            <div className="gradient-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="font-display font-bold text-base"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.94 0.005 240)",
                      }}
                    >
                      {job.role}
                    </h3>
                    {job.current && (
                      <span
                        className="text-xs"
                        style={{
                          color: "oklch(0.82 0.15 200)",
                          fontFamily: "'JetBrains Mono', monospace",
                          userSelect: "none",
                        }}
                      >
                        · present
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "oklch(0.82 0.15 200)",
                      }}
                    >
                      {job.company}
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs flex-shrink-0"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  {job.period}
                </span>
              </div>

              <ul className="space-y-1.5">
                {job.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "oklch(0.65 0.01 240)",
                    }}
                  >
                    <span
                      className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full"
                      style={{ background: "oklch(0.82 0.15 200 / 60%)" }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsGrid() {
  return (
    <div className="space-y-5">
      {skillCategories.map(cat => (
        <div key={cat.name} className="gradient-border rounded-xl p-5">
          <h3
            className="text-xs uppercase tracking-widest mb-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "oklch(0.82 0.15 200)",
            }}
          >
            {cat.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map(skill => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Education() {
  return (
    <div className="gradient-border rounded-xl p-6">
      <h3
        className="font-display font-bold text-base mb-1"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: "oklch(0.94 0.005 240)",
        }}
      >
        B.S. Computer Science
      </h3>
      <p
        className="text-sm font-medium mb-1"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "oklch(0.82 0.15 200)",
        }}
      >
        University of Louisiana at Lafayette
      </p>
      <div className="flex items-center gap-1.5">
        <MapPin size={11} style={{ color: "oklch(0.52 0.015 250)" }} />
        <span
          className="text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "oklch(0.52 0.015 250)",
          }}
        >
          Lafayette, LA · 2016
        </span>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <PageLayout>
      <div className="container py-12">
        {/* Page header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-tag mb-3">// resume</div>
            <h1
              className="font-display font-bold text-4xl lg:text-5xl"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Experience &amp; Skills
            </h1>
            <p
              className="mt-3 text-base max-w-xl"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              Senior Software Engineer specializing in platform engineering,
              full-stack systems, AWS infrastructure, and AI developer
              workflows. Leads modernization across large TypeScript ecosystems,
              including NestJS APIs, Nx React applications, Terraform-managed
              cloud services, ETL pipelines, and reusable CI/CD automation.
            </p>
          </div>
          <a
            href="/assets/Jacob-LeCoq-Resume.pdf"
            download="Jacob-LeCoq-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "oklch(0.82 0.15 200)",
              color: "oklch(0.085 0.012 265)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.72 0.15 200)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.82 0.15 200)";
            }}
          >
            <Download size={14} /> Download PDF
          </a>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left — Experience */}
          <div>
            <h2
              className="font-display font-semibold text-xl mb-6"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Work Experience
            </h2>
            <ExperienceTimeline />
          </div>

          {/* Right — Skills + Education */}
          <div className="space-y-8">
            <div>
              <h2
                className="font-display font-semibold text-xl mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                Skills
              </h2>
              <SkillsGrid />
            </div>
            <div>
              <h2
                className="font-display font-semibold text-xl mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                Education
              </h2>
              <Education />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
