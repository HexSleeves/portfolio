// Terminal Noir — Experience Section
// Vertical timeline with company, role, period, and highlights

import { useEffect, useRef, useState } from "react";
import { experience } from "@/lib/data";
import { Briefcase } from "lucide-react";

function useInView(threshold = 0.1) {
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

export default function ExperienceSection() {
  const { ref, inView } = useInView();

  return (
    <section id="experience" className="py-24 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "oklch(1 0 0 / 5%)" }}
      />

      <div className="container">
        <div ref={ref}>
          {/* Header */}
          <div
            className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="section-tag mb-4">// experience</div>
            <h2
              className="font-display font-bold text-4xl lg:text-5xl leading-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Where I've shipped
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-2 bottom-2 w-px hidden md:block"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.15 200), oklch(0.82 0.15 200 / 0%))",
              }}
            />

            <div className="space-y-10">
              {experience.map((job, i) => (
                <div
                  key={job.company}
                  className={`md:pl-10 relative transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-[3px] hidden md:block"
                    style={{
                      background: job.current
                        ? "oklch(0.82 0.15 200)"
                        : "oklch(0.35 0.01 265)",
                    }}
                  />

                  <div className="gradient-border rounded-lg p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="font-display font-bold text-lg"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: "oklch(0.94 0.005 240)",
                            }}
                          >
                            {job.company}
                          </h3>
                          {job.current && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background: "oklch(0.82 0.15 200 / 15%)",
                                color: "oklch(0.82 0.15 200)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              current
                            </span>
                          )}
                        </div>
                        <p
                          className="text-sm"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "oklch(0.82 0.15 200)",
                          }}
                        >
                          {job.role}
                        </p>
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "oklch(0.52 0.015 250)",
                        }}
                      >
                        {job.period}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {job.highlights.map((h, hi) => (
                        <li
                          key={hi}
                          className="flex items-start gap-2 text-sm leading-relaxed"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "oklch(0.52 0.015 250)",
                          }}
                        >
                          <span
                            style={{
                              color: "oklch(0.82 0.15 200)",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          >
                            ›
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
