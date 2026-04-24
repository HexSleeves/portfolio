// Terminal Noir — Navigation Component
// Fixed top nav with active section tracking and mobile menu

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section tracking
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (isHome) {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.085_0.012_265/0.95)] backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-mono text-xs text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
              ~/
            </span>
            <span
              className="font-display font-bold text-base tracking-tight text-slate-100"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Jacob LeCoq
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`nav-link text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-cyan-400 active"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Social + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/HexSleeves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-100 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/jacob-lecoq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-100 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://x.com/jacob_lecoq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-100 transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="ml-2 px-4 py-1.5 rounded-md text-sm font-medium border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Hire Me
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[oklch(0.11_0.012_265/0.98)] backdrop-blur-md border-b border-white/5">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-slate-300 hover:text-cyan-400 transition-colors py-2 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <a href="https://github.com/HexSleeves" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-100 transition-colors">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/in/jacob-lecoq" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-100 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
