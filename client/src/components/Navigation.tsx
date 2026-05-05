// Terminal Noir — Navigation
// Route-based tab navigation with active highlighting

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  BriefcaseBusiness as Linkedin,
  Code2 as Github,
  Menu,
  X,
} from "lucide-react";
import { BANNER_HEIGHT } from "./AvailabilityBanner";

const STORAGE_KEY = "banner-dismissed-v2";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/projects", label: "Projects", exact: false },
  { href: "/resume", label: "Resume", exact: false },
  { href: "/blog", label: "Blog", exact: false },
  { href: "/about", label: "About", exact: false },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mirror banner visibility for nav offset
  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setBannerVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // Poll for banner dismissal to remove the offset
  useEffect(() => {
    if (!bannerVisible) return;
    const interval = setInterval(() => {
      if (sessionStorage.getItem(STORAGE_KEY)) setBannerVisible(false);
    }, 200);
    return () => clearInterval(interval);
  }, [bannerVisible]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.085_0.012_265/0.96)] backdrop-blur-md border-b border-white/5"
          : "bg-[oklch(0.085_0.012_265/0.85)] backdrop-blur-sm border-b border-white/5"
      }`}
      style={{
        top: bannerVisible ? `${BANNER_HEIGHT}px` : "0px",
        transition: "top 0.3s ease",
      }}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <span
              className="font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "oklch(0.82 0.15 200)",
              }}
            >
              ~/
            </span>
            <span
              className="font-display font-bold text-base tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              Jacob LeCoq
            </span>
          </Link>

          {/* Desktop Tab Nav */}
          <div className="hidden md:flex items-center">
            {/* Tab container */}
            <div
              className="flex items-center rounded-lg p-1"
              style={{
                background: "oklch(0.11 0.012 265)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              {navLinks.map(link => {
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background: active
                        ? "oklch(0.16 0.012 265)"
                        : "transparent",
                      color: active
                        ? "oklch(0.94 0.005 240)"
                        : "oklch(0.52 0.015 250)",
                      boxShadow: active
                        ? "0 0 0 1px oklch(0.82 0.15 200 / 20%)"
                        : "none",
                    }}
                    onMouseEnter={e => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.color =
                          "oklch(0.85 0.005 240)";
                    }}
                    onMouseLeave={e => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.color =
                          "oklch(0.52 0.015 250)";
                    }}
                  >
                    {active && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                        style={{ background: "oklch(0.82 0.15 200)" }}
                      />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/HexSleeves"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = "oklch(0.94 0.005 240)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
              }
              aria-label="GitHub"
            >
              <Github size={17} />
            </a>
            <a
              href="https://linkedin.com/in/jacob-lecoq"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "oklch(0.52 0.015 250)" }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = "oklch(0.94 0.005 240)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
              }
              aria-label="LinkedIn"
            >
              <Linkedin size={17} />
            </a>
            <a
              href="mailto:lecoqjacob@gmail.com"
              className="ml-1 px-4 py-1.5 rounded-md text-sm font-medium border transition-all duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                borderColor: "oklch(0.82 0.15 200 / 40%)",
                color: "oklch(0.82 0.15 200)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.82 0.15 200 / 10%)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 200 / 70%)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 200 / 40%)";
              }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden transition-colors"
            style={{ color: "oklch(0.52 0.015 250)" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            onMouseEnter={e =>
              (e.currentTarget.style.color = "oklch(0.94 0.005 240)")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.color = "oklch(0.52 0.015 250)")
            }
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "oklch(0.11 0.012 265 / 0.98)",
            backdropFilter: "blur(12px)",
            borderColor: "oklch(1 0 0 / 5%)",
          }}
        >
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map(link => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: active
                      ? "oklch(0.16 0.012 265)"
                      : "transparent",
                    color: active
                      ? "oklch(0.82 0.15 200)"
                      : "oklch(0.65 0.01 240)",
                  }}
                >
                  {active && (
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.82 0.15 200)" }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            <div
              className="flex items-center gap-4 pt-3 mt-1 border-t"
              style={{ borderColor: "oklch(1 0 0 / 5%)" }}
            >
              <a
                href="https://github.com/HexSleeves"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(0.52 0.015 250)" }}
              >
                <Github size={17} />
              </a>
              <a
                href="https://linkedin.com/in/jacob-lecoq"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(0.52 0.015 250)" }}
              >
                <Linkedin size={17} />
              </a>
              <a
                href="mailto:lecoqjacob@gmail.com"
                className="ml-auto px-4 py-1.5 rounded-md text-sm font-medium border"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  borderColor: "oklch(0.82 0.15 200 / 40%)",
                  color: "oklch(0.82 0.15 200)",
                }}
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
