// Terminal Noir — Availability Banner
// Dismissible top banner signaling open-to-work status

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const STORAGE_KEY = "banner-dismissed-v1";

export default function AvailabilityBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed in this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Small delay so it slides in after page load
      const t = setTimeout(() => setVisible(true), 600);
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
      className="relative z-50 w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm"
      style={{
        background: "linear-gradient(90deg, oklch(0.12 0.02 200) 0%, oklch(0.10 0.015 220) 50%, oklch(0.12 0.02 200) 100%)",
        borderBottom: "1px solid oklch(0.82 0.15 200 / 20%)",
        animation: "slideDown 0.4s ease-out",
      }}
    >
      {/* Subtle animated glow line at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, oklch(0.82 0.15 200 / 60%) 50%, transparent 100%)",
        }}
      />

      <Sparkles
        size={14}
        style={{ color: "oklch(0.82 0.15 200)", flexShrink: 0 }}
      />

      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "oklch(0.75 0.01 240)",
        }}
      >
        <span
          className="font-semibold"
          style={{ color: "oklch(0.82 0.15 200)" }}
        >
          Open to new opportunities
        </span>
        {" — "}
        <span>
          Available for full-time roles and consulting engagements.{" "}
        </span>
        <a
          href="/about"
          className="underline underline-offset-2 transition-colors hover:text-white"
          style={{
            color: "oklch(0.75 0.01 240)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Learn more
        </a>
      </span>

      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="ml-2 p-1 rounded transition-colors hover:bg-white/10 flex-shrink-0"
        style={{ color: "oklch(0.52 0.015 250)" }}
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
