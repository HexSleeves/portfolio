// Terminal Noir — Availability Banner
// Fixed-position top banner that sits above the nav bar

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const STORAGE_KEY = "banner-dismissed-v2";

// Export banner height so Navigation can offset itself
export const BANNER_HEIGHT = 40; // px

export default function AvailabilityBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] flex items-center justify-center gap-3 px-4 text-sm"
      style={{
        top: 0,
        height: `${BANNER_HEIGHT}px`,
        background: "linear-gradient(90deg, oklch(0.12 0.02 200) 0%, oklch(0.10 0.015 220) 50%, oklch(0.12 0.02 200) 100%)",
        borderBottom: "1px solid oklch(0.82 0.15 200 / 25%)",
        animation: "bannerSlideDown 0.4s ease-out",
      }}
    >
      {/* Glow line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, oklch(0.82 0.15 200 / 50%) 50%, transparent 100%)",
        }}
      />

      <Sparkles size={13} style={{ color: "oklch(0.82 0.15 200)", flexShrink: 0 }} />

      <span style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.72 0.01 240)", fontSize: "0.8125rem" }}>
        <span className="font-semibold" style={{ color: "oklch(0.82 0.15 200)" }}>
          Open to new opportunities
        </span>
        {" — "}
        Available for full-time roles &amp; consulting.{" "}
        <a
          href="/about"
          className="underline underline-offset-2 transition-colors hover:opacity-80"
          style={{ color: "oklch(0.72 0.01 240)" }}
        >
          Learn more
        </a>
      </span>

      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="ml-2 p-1 rounded transition-colors hover:bg-white/10 flex-shrink-0"
        style={{ color: "oklch(0.45 0.01 250)" }}
      >
        <X size={13} />
      </button>

      <style>{`
        @keyframes bannerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
