// Terminal Noir — Skills Section
// Categorized skill tags with hover glow effect

import { useEffect, useRef, useState } from "react";
import { skillCategories } from "@/lib/data";

function useInView(threshold = 0.1) {
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

export default function SkillsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="skills" className="py-24 relative">
      {/* Subtle section divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />

      <div className="container">
        <div ref={ref}>
          {/* Header */}
          <div className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="section-tag mb-4">// skills & tools</div>
            <h2
              className="font-display font-bold text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
            >
              The stack I ship with
            </h2>
          </div>

          {/* Skill categories */}
          <div className="space-y-8">
            {skillCategories.map((category, catIndex) => (
              <div
                key={category.name}
                className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${catIndex * 80}ms` }}
              >
                <div className="flex items-start gap-6">
                  {/* Category label */}
                  <div className="w-36 flex-shrink-0 pt-1">
                    <span
                      className="text-xs font-medium uppercase tracking-widest"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                    >
                      {category.name}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                {catIndex < skillCategories.length - 1 && (
                  <div className="mt-8 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
