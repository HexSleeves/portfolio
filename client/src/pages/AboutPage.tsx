// Terminal Noir — About Page
// Full bio, values, and contact info

import { Link } from "wouter";
import {
  ArrowRight,
  BriefcaseBusiness as Linkedin,
  Code2 as Github,
  Mail,
  MapPin,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { skillCategories } from "@/lib/data";

const values = [
  {
    title: "Platform Thinking",
    desc: "I don't just build features — I build systems that other engineers can build on top of. Reusable CI/CD workflows, shared component libraries, and standardized API patterns are how I multiply team velocity.",
  },
  {
    title: "Bias Toward Delivery",
    desc: "Shipping working software beats perfect architecture every time. I balance pragmatic delivery with long-term maintainability, and I'm not afraid to make a call when the team needs direction.",
  },
  {
    title: "Security & Reliability First",
    desc: "Every system I build is designed with observability, failure modes, and security boundaries in mind from day one — not bolted on afterward.",
  },
  {
    title: "Open Source Citizenship",
    desc: "I actively contribute to and maintain open source projects. The tailscale-mcp server, Waggle orchestration framework, and RuneForge Rust library are all public and actively maintained.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="section-tag mb-3">// about</div>
          <h1
            className="font-display font-bold text-4xl lg:text-5xl mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.94 0.005 240)",
            }}
          >
            About Me
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Left — Bio + Values */}
          <div className="space-y-10">
            {/* Bio */}
            <div>
              <div
                className="rounded-xl overflow-hidden mb-6"
                style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663074844816/D7Scsbof2ga2vbCvASFLcE/about-visual-7umMgkAnJhwmEB7mS6sqSR.webp"
                  alt="Abstract tech visual"
                  className="w-full h-48 object-cover opacity-50"
                />
              </div>
              <div className="space-y-4">
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.75 0.01 240)",
                  }}
                >
                  I'm a Senior Software Engineer based in Lafayette, Louisiana,
                  with 8+ years of experience building production systems across
                  genomics, agriculture, food delivery, and federal contracting.
                  I specialize in full-stack TypeScript, cloud infrastructure,
                  and AI-powered developer tooling.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.75 0.01 240)",
                  }}
                >
                  My current work at Bayer involves leading full-stack delivery
                  across a large Nx monorepo, designing AI agent workflows that
                  reduce engineering time by ~50%, and acting as DevOps lead for
                  CI/CD standards across multiple teams.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.75 0.01 240)",
                  }}
                >
                  Outside of work, I maintain several open source projects
                  including{" "}
                  <a
                    href="https://github.com/HexSleeves/tailscale-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "oklch(0.82 0.15 200)" }}
                  >
                    tailscale-mcp
                  </a>{" "}
                  (87+ GitHub stars), the Waggle multi-agent orchestration
                  framework for Go, and RuneForge — a Rust library for building
                  roguelike games.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h2
                className="font-display font-bold text-2xl mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                How I work
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {values.map(v => (
                  <div key={v.title} className="gradient-border rounded-xl p-5">
                    <h3
                      className="font-display font-semibold text-sm mb-2"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.82 0.15 200)",
                      }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "oklch(0.52 0.015 250)",
                      }}
                    >
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact card + Skills summary */}
          <div className="space-y-6">
            {/* Contact card */}
            <div
              className="gradient-border rounded-xl p-6 space-y-4"
              style={{ borderColor: "oklch(0.82 0.15 200 / 20%)" }}
            >
              <h3
                className="font-display font-semibold text-base"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                Get in touch
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:lecoqjacob@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors group"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.65 0.01 240)",
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = "oklch(0.82 0.15 200)")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = "oklch(0.65 0.01 240)")
                  }
                >
                  <Mail size={14} className="flex-shrink-0" />
                  lecoqjacob@gmail.com
                </a>
                <a
                  href="https://github.com/HexSleeves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.65 0.01 240)",
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = "oklch(0.82 0.15 200)")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = "oklch(0.65 0.01 240)")
                  }
                >
                  <Github size={14} className="flex-shrink-0" />
                  github.com/HexSleeves
                </a>
                <a
                  href="https://linkedin.com/in/jacob-lecoq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.65 0.01 240)",
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = "oklch(0.82 0.15 200)")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = "oklch(0.65 0.01 240)")
                  }
                >
                  <Linkedin size={14} className="flex-shrink-0" />
                  linkedin.com/in/jacob-lecoq
                </a>
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.65 0.01 240)",
                  }}
                >
                  <MapPin size={14} className="flex-shrink-0" />
                  Lafayette, Louisiana
                </div>
              </div>
              <a
                href="mailto:lecoqjacob@gmail.com"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md text-sm font-medium transition-all duration-200 mt-2"
                style={{
                  background: "oklch(0.82 0.15 200)",
                  color: "oklch(0.085 0.012 265)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Send a message
              </a>
            </div>

            {/* Quick skills */}
            <div className="gradient-border rounded-xl p-6">
              <h3
                className="font-display font-semibold text-base mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                Core skills
              </h3>
              <div className="space-y-3">
                {skillCategories.slice(0, 4).map(cat => (
                  <div key={cat.name}>
                    <div
                      className="text-xs uppercase tracking-widest mb-1.5"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "oklch(0.82 0.15 200)",
                      }}
                    >
                      {cat.name}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="skill-tag text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/resume">
                <span
                  className="flex items-center gap-1.5 text-xs mt-4 transition-colors cursor-pointer"
                  style={{
                    color: "oklch(0.52 0.015 250)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = "oklch(0.82 0.15 200)")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
                  }
                >
                  Full resume <ArrowRight size={11} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
