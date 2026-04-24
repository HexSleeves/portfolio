// Terminal Noir — Contact Section + Footer
// Clean CTA with email, social links, and footer

import { useEffect, useRef, useState } from "react";
import { Mail, Github, Linkedin, Twitter, MapPin, Copy, Check } from "lucide-react";

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

export default function ContactSection() {
  const { ref, inView } = useInView();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("lecoqjacob@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section id="contact" className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "oklch(1 0 0 / 5%)" }} />

        {/* Background glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.82 0.15 200)" }}
        />

        <div className="container relative z-10">
          <div ref={ref} className="max-w-2xl">
            {/* Header */}
            <div className={`mb-10 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="section-tag mb-4">// contact</div>
              <h2
                className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.94 0.005 240)" }}
              >
                Let's build something{" "}
                <span style={{ color: "oklch(0.82 0.15 200)" }}>together</span>
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
              >
                I'm open to senior engineering roles, technical consulting, and
                interesting open-source collaborations. If you're working on
                something ambitious — cloud platforms, AI tooling, developer
                experience — I'd love to hear about it.
              </p>
            </div>

            {/* Email CTA */}
            <div
              className={`mb-8 transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div
                className="flex items-center justify-between gap-4 p-4 rounded-xl border"
                style={{
                  background: "oklch(0.11 0.012 265)",
                  borderColor: "oklch(0.82 0.15 200 / 20%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} style={{ color: "oklch(0.82 0.15 200)" }} />
                  <span
                    className="font-mono text-sm"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.94 0.005 240)" }}
                  >
                    lecoqjacob@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                    style={{
                      background: "oklch(0.16 0.012 265)",
                      color: "oklch(0.52 0.015 250)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href="mailto:lecoqjacob@gmail.com"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                    style={{
                      background: "oklch(0.82 0.15 200)",
                      color: "oklch(0.085 0.012 265)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {[
                { icon: Github, label: "GitHub", href: "https://github.com/HexSleeves", handle: "@HexSleeves" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/jacob-lecoq", handle: "in/jacob-lecoq" },
                { icon: Twitter, label: "Twitter / X", href: "https://x.com/jacob_lecoq", handle: "@jacob_lecoq" },
              ].map(({ icon: Icon, label, href, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all duration-200 group"
                  style={{
                    background: "oklch(0.11 0.012 265)",
                    borderColor: "oklch(1 0 0 / 8%)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.82 0.15 200 / 40%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 8%)";
                  }}
                >
                  <Icon size={16} style={{ color: "oklch(0.52 0.015 250)" }} />
                  <div>
                    <div
                      className="text-xs font-medium"
                      style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.94 0.005 240)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-xs"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.52 0.015 250)" }}
                    >
                      {handle}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: "oklch(1 0 0 / 5%)" }}>
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs opacity-40"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.94 0.005 240)" }}
            >
              ~/
            </span>
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.52 0.015 250)" }}
            >
              Jacob LeCoq
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: "oklch(0.52 0.015 250)" }} />
            <span
              className="text-xs"
              style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.52 0.015 250)" }}
            >
              Lafayette, LA · {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
