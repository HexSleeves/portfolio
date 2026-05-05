// Terminal Noir — Contact Section + Footer
// Contact form with EmailJS + email CTA + social links

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Code2 as Github,
  Copy,
  BriefcaseBusiness as Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
  X as Twitter,
} from "lucide-react";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ────────────────────────────────────────────
// Replace these with your real EmailJS credentials after setup
// Or set them as VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
// in a .env file at the project root
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

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

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const { ref, inView } = useInView();
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const copyEmail = () => {
    navigator.clipboard.writeText("lecoqjacob@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "sending") return;

    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      setFormState("error");
      return;
    }

    setFormState("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setFormState("success");
      setFormData({ from_name: "", from_email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.13 0.012 265)",
    border: "1px solid oklch(1 0 0 / 10%)",
    borderRadius: "0.5rem",
    color: "oklch(0.94 0.005 240)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    padding: "0.625rem 0.875rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <>
      <section id="contact" className="py-24 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "oklch(1 0 0 / 5%)" }}
        />

        {/* Background glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.82 0.15 200)" }}
        />

        <div className="container relative z-10">
          <div
            ref={ref}
            className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start"
          >
            {/* ── Left column: header + email CTA + socials ── */}
            <div>
              <div
                className={`mb-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="section-tag mb-4">// contact</div>
                <h2
                  className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "oklch(0.94 0.005 240)",
                  }}
                >
                  Let's build something{" "}
                  <span style={{ color: "oklch(0.82 0.15 200)" }}>
                    together
                  </span>
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  I'm open to senior engineering roles, technical consulting,
                  and interesting open-source collaborations. If you're working
                  on something ambitious — cloud platforms, AI tooling,
                  developer experience — I'd love to hear about it.
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
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "oklch(0.94 0.005 240)",
                      }}
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
                  {
                    icon: Github,
                    label: "GitHub",
                    href: "https://github.com/HexSleeves",
                    handle: "@HexSleeves",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    href: "https://linkedin.com/in/jacob-lecoq",
                    handle: "in/jacob-lecoq",
                  },
                  {
                    icon: Twitter,
                    label: "Twitter / X",
                    href: "https://x.com/jacob_lecoq",
                    handle: "@jacob_lecoq",
                  },
                ].map(({ icon: Icon, label, href, handle }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all duration-200"
                    style={{
                      background: "oklch(0.11 0.012 265)",
                      borderColor: "oklch(1 0 0 / 8%)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.82 0.15 200 / 40%)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(1 0 0 / 8%)";
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: "oklch(0.52 0.015 250)" }}
                    />
                    <div>
                      <div
                        className="text-xs font-medium"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "oklch(0.94 0.005 240)",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "oklch(0.52 0.015 250)",
                        }}
                      >
                        {handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right column: contact form ── */}
            <div
              className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: "oklch(0.11 0.012 265)",
                  borderColor: "oklch(1 0 0 / 8%)",
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-1"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "oklch(0.94 0.005 240)",
                  }}
                >
                  Send a message
                </h3>
                <p
                  className="text-xs mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "oklch(0.52 0.015 250)",
                  }}
                >
                  I typically respond within 24 hours.
                </p>

                {formState === "success" ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "oklch(0.82 0.15 200 / 15%)" }}
                    >
                      <Check
                        size={22}
                        style={{ color: "oklch(0.82 0.15 200)" }}
                      />
                    </div>
                    <p
                      className="font-semibold"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.94 0.005 240)",
                      }}
                    >
                      Message sent!
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "oklch(0.52 0.015 250)",
                      }}
                    >
                      Thanks for reaching out. I'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="mt-2 text-xs underline underline-offset-2"
                      style={{
                        color: "oklch(0.82 0.15 200)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="from_name"
                          className="block text-xs mb-1.5"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "oklch(0.65 0.01 240)",
                          }}
                        >
                          Name
                        </label>
                        <input
                          id="from_name"
                          name="from_name"
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={formData.from_name}
                          onChange={handleChange}
                          style={inputStyle}
                          onFocus={e => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.82 0.15 200 / 50%)";
                          }}
                          onBlur={e => {
                            e.currentTarget.style.borderColor =
                              "oklch(1 0 0 / 10%)";
                          }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="from_email"
                          className="block text-xs mb-1.5"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "oklch(0.65 0.01 240)",
                          }}
                        >
                          Email
                        </label>
                        <input
                          id="from_email"
                          name="from_email"
                          type="email"
                          required
                          placeholder="jane@company.com"
                          value={formData.from_email}
                          onChange={handleChange}
                          style={inputStyle}
                          onFocus={e => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.82 0.15 200 / 50%)";
                          }}
                          onBlur={e => {
                            e.currentTarget.style.borderColor =
                              "oklch(1 0 0 / 10%)";
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs mb-1.5"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "oklch(0.65 0.01 240)",
                        }}
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        placeholder="Opportunity / Collaboration / Question"
                        value={formData.subject}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.82 0.15 200 / 50%)";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor =
                            "oklch(1 0 0 / 10%)";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs mb-1.5"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "oklch(0.65 0.01 240)",
                        }}
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell me about your project, role, or what you'd like to discuss..."
                        value={formData.message}
                        onChange={handleChange}
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.82 0.15 200 / 50%)";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor =
                            "oklch(1 0 0 / 10%)";
                        }}
                      />
                    </div>

                    {formState === "error" && (
                      <p
                        className="text-xs px-3 py-2 rounded-md"
                        style={{
                          background: "oklch(0.577 0.245 27.325 / 10%)",
                          color: "oklch(0.75 0.18 27)",
                          fontFamily: "'Inter', sans-serif",
                          border: "1px solid oklch(0.577 0.245 27.325 / 20%)",
                        }}
                      >
                        {EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID"
                          ? "EmailJS is not yet configured. See the setup instructions to connect your account."
                          : "Something went wrong. Please try emailing me directly at lecoqjacob@gmail.com."}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                      style={{
                        background:
                          formState === "sending"
                            ? "oklch(0.62 0.12 200)"
                            : "oklch(0.82 0.15 200)",
                        color: "oklch(0.085 0.012 265)",
                        fontFamily: "'Inter', sans-serif",
                        cursor:
                          formState === "sending" ? "not-allowed" : "pointer",
                      }}
                    >
                      {formState === "sending" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />{" "}
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "oklch(1 0 0 / 5%)" }}
      >
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs opacity-40"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              ~/
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              Jacob LeCoq
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: "oklch(0.52 0.015 250)" }} />
            <span
              className="text-xs"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "oklch(0.52 0.015 250)",
              }}
            >
              Youngsville, LA · {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
