// Terminal Noir — Hero Section
// Left-weighted layout with typewriter tagline and dot-grid background

import { useState, useEffect } from "react";
import { ArrowRight, Download, Github } from "lucide-react";
import { stats } from "@/lib/data";

const taglines = [
  "Full-Stack Engineer",
  "AI Platform Builder",
  "DevOps Architect",
  "Open Source Author",
];

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((w) => (w + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

export default function HeroSection() {
  const tagline = useTypewriter(taglines);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Hero background image */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663074844816/D7Scsbof2ga2vbCvASFLcE/hero-bg-Rhiwk8BwfqiAMSinatKnvV.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      />
      {/* Dot-grid background */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      {/* Gradient overlay — left fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.085_0.012_265)] via-transparent to-[oklch(0.085_0.012_265/0.3)]" />

      {/* Cyan ambient glow */}
      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.82 0.15 200)" }}
      />

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Pre-heading decorator */}
          <div
            className={`section-tag mb-6 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            // hello, world
          </div>

          {/* Name */}
          <h1
            className={`font-display font-bold leading-none tracking-tight mb-4 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: "oklch(0.94 0.005 240)",
            }}
          >
            Jacob{" "}
            <span style={{ color: "oklch(0.82 0.15 200)" }}>LeCoq</span>
          </h1>

          {/* Typewriter tagline */}
          <div
            className={`flex items-center gap-0 mb-6 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="font-display font-semibold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              Senior&nbsp;
            </span>
            <span
              className="font-display font-semibold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                color: "oklch(0.82 0.15 200)",
              }}
            >
              {tagline}
            </span>
            <span className="typewriter-cursor" />
          </div>

          {/* Bio */}
          <p
            className={`text-base leading-relaxed mb-10 max-w-xl transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "oklch(0.52 0.015 250)",
            }}
          >
            Senior Software Engineer with 8+ years shipping production software across enterprise commerce, genomics infrastructure, and AI tooling. Currently at Dexian (Bayer) driving CI/CD standards, AI agent workflows, and platform modernization.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 mb-16 transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => {
                const el = document.getElementById("projects");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 hover:gap-3"
              style={{
                background: "oklch(0.82 0.15 200)",
                color: "oklch(0.085 0.012 265)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              View My Work
              <ArrowRight size={16} />
            </button>
            <a
              href="/about"
              className="flex items-center gap-2 px-6 py-3 rounded-md font-medium text-sm border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-all duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              About Me
            </a>
            <a
              href="/assets/Jacob-LeCoq-Resume.pdf"
              download="Jacob-LeCoq-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-md text-sm text-slate-400 hover:text-slate-100 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Download size={16} />
              Resume
            </a>
            <a
              href="https://github.com/HexSleeves"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-md text-sm text-slate-400 hover:text-slate-100 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Github size={16} />
              HexSleeves
            </a>
          </div>

          {/* Stats row */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-6 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span
                  className="font-display font-bold text-2xl"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "oklch(0.82 0.15 200)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "oklch(0.52 0.015 250)",
          }}
        >
          scroll
        </span>
        <div
          className="w-px h-8 animate-pulse"
          style={{ background: "oklch(0.82 0.15 200)" }}
        />
      </div>
    </section>
  );
}
