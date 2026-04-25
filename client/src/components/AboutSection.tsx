// Terminal Noir — About Section
// Left-aligned editorial layout with personal bio and values

import { useEffect, useRef, useState } from "react";
import { MapPin, Mail, ExternalLink } from "lucide-react";

function useInView(threshold = 0.15) {
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

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-24 relative">
      <div className="container">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Text */}
          <div
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="section-tag mb-4">// about me</div>
            <h2
              className="font-display font-bold text-4xl lg:text-5xl mb-6 leading-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Building systems that{" "}
              <span style={{ color: "oklch(0.82 0.15 200)" }}>
                scale and last
              </span>
            </h2>

            <div
              className="space-y-4 text-base leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              <p>
                I'm a Senior Software Engineer based in Youngsville, LA with 8+
                years of experience building full-stack systems, cloud
                infrastructure, and AI-powered tooling for enterprise platforms.
                My work spans everything from React frontends and NestJS APIs to
                AWS infrastructure automation and multi-agent AI orchestration.
              </p>
              <p>
                Currently at Dexian (Bayer), I lead full-stack delivery across
                commerce platforms, define CI/CD standards with GitHub Actions
                and Docker, and build AI agent workflows that cut manual
                engineering time by roughly half. Previously at DNAnexus, I
                reduced AWS spend by $30K annually through cluster optimization
                and Spot Instance orchestration.
              </p>
              <p>
                Outside of work, I build open-source tools — including{" "}
                <a
                  href="https://github.com/HexSleeves/tailscale-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "oklch(0.82 0.15 200)" }}
                >
                  tailscale-mcp
                </a>{" "}
                (87 GitHub stars) and{" "}
                <a
                  href="https://github.com/HexSleeves/waggle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "oklch(0.82 0.15 200)" }}
                >
                  Waggle
                </a>
                , a multi-agent orchestration framework in Go. I'm drawn to
                problems at the intersection of developer experience, AI
                tooling, and platform reliability.
              </p>
            </div>

            {/* Contact info */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <MapPin size={15} style={{ color: "oklch(0.82 0.15 200)" }} />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  Youngsville, LA (Open to remote)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} style={{ color: "oklch(0.82 0.15 200)" }} />
                <a
                  href="mailto:lecoqjacob@gmail.com"
                  className="text-sm transition-colors hover:text-slate-100"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  lecoqjacob@gmail.com
                </a>
              </div>
            </div>

            {/* Education */}
            <div
              className="mt-8 p-4 rounded-lg border"
              style={{
                background: "oklch(0.11 0.012 265)",
                borderColor: "oklch(1 0 0 / 8%)",
              }}
            >
              <div className="section-tag mb-2">// education</div>
              <p
                className="font-display font-semibold text-sm"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.94 0.005 240)",
                }}
              >
                B.S. Computer Science
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "oklch(0.52 0.015 250)",
                }}
              >
                University of Louisiana at Lafayette · 2016
              </p>
            </div>
          </div>

          {/* Right — Values / What I bring */}
          <div
            className={`transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Visual accent */}
            <div className="mb-6 rounded-xl overflow-hidden border" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663074844816/D7Scsbof2ga2vbCvASFLcE/about-visual-7umMgkAnJhwmEB7mS6sqSR.webp"
                alt="Abstract tech visual"
                className="w-full h-40 object-cover opacity-60"
              />
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Platform Thinking",
                  desc: "I don't just build features — I build systems that other engineers can build on top of. Reusable CI/CD workflows, shared component libraries, and standardized API patterns are how I multiply team velocity.",
                },
                {
                  title: "AI-Native Development",
                  desc: "I've been building with LLMs since before it was mainstream. From prompt engineering and agent templates to full multi-agent orchestration frameworks, I understand how to make AI tooling production-ready.",
                },
                {
                  title: "Cloud Cost Discipline",
                  desc: "Good infrastructure isn't just reliable — it's efficient. I've reduced AWS spend by $30K annually through careful architecture choices, Spot Instance orchestration, and right-sizing compute resources.",
                },
                {
                  title: "Developer Experience",
                  desc: "The best code is code that other engineers can understand, extend, and trust. I invest in documentation, type safety, linting standards, and local setup tooling because DX is a force multiplier.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="gradient-border rounded-lg p-5"
                  style={{
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <h3
                    className="font-display font-semibold text-base mb-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "oklch(0.94 0.005 240)",
                    }}
                  >
                    <span style={{ color: "oklch(0.82 0.15 200)" }}>→ </span>
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "oklch(0.52 0.015 250)",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
