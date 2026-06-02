import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  BookOpen,
  ChevronRight,
  FolderOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface SidebarContentProps {
  isActive: (href: string, exact?: boolean) => boolean;
  setMobileOpen: (open: boolean) => void;
  logout: () => void;
}

function SidebarContent({
  isActive,
  setMobileOpen,
  logout,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "oklch(1 0 0 / 6%)" }}
      >
        <Link href="/admin" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-2.5">
            <div
              className="size-7 rounded-md flex items-center justify-center"
              style={{ background: "oklch(0.82 0.15 200 / 15%)" }}
            >
              <span
                style={{
                  color: "oklch(0.82 0.15 200)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                JL
              </span>
            </div>
            <div>
              <div
                className="text-sm font-semibold"
                style={{
                  color: "oklch(0.94 0.005 240)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Admin
              </div>
              <div
                className="text-xs"
                style={{
                  color: "oklch(0.52 0.015 250)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                jacob-portfolio
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer group"
                style={{
                  background: active
                    ? "oklch(0.82 0.15 200 / 10%)"
                    : "transparent",
                  color: active
                    ? "oklch(0.82 0.15 200)"
                    : "oklch(0.52 0.015 250)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => {
                  if (!active)
                    e.currentTarget.style.background = "oklch(1 0 0 / 4%)";
                  if (!active)
                    e.currentTarget.style.color = "oklch(0.75 0.01 240)";
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = "transparent";
                  if (!active)
                    e.currentTarget.style.color = "oklch(0.52 0.015 250)";
                }}
              >
                <item.icon size={15} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={12} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4 border-t space-y-1"
        style={{ borderColor: "oklch(1 0 0 / 6%)" }}
      >
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "oklch(0.75 0.01 240)";
              e.currentTarget.style.background = "oklch(1 0 0 / 4%)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "oklch(0.52 0.015 250)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Home size={15} />
            <span>View Portfolio</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          style={{
            color: "oklch(0.52 0.015 250)",
            fontFamily: "'Inter', sans-serif",
            background: "transparent",
            border: "none",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "oklch(0.65 0.15 25)";
            e.currentTarget.style.background = "oklch(0.65 0.15 25 / 8%)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "oklch(0.52 0.015 250)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span
            className="text-sm"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Loading…
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user?.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <div className="text-center">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{
              color: "oklch(0.94 0.005 240)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Access Denied
          </h1>
          <p
            className="text-sm mb-4"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            You don't have admin access to this area.
          </p>
          <Link href="/">
            <span className="text-sm" style={{ color: "oklch(0.82 0.15 200)" }}>
              ← Back to portfolio
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.085 0.012 265)" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: "oklch(0.10 0.012 265)",
          borderRight: "1px solid oklch(1 0 0 / 6%)",
        }}
      >
        <SidebarContent
          isActive={isActive}
          setMobileOpen={setMobileOpen}
          logout={logout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setMobileOpen(false);
            }}
          />
          <aside
            className="relative flex flex-col w-56 h-full z-10"
            style={{
              background: "oklch(0.10 0.012 265)",
              borderRight: "1px solid oklch(1 0 0 / 6%)",
            }}
          >
            <button
              type="button"
              className="absolute top-3 right-3 p-1.5 rounded-md"
              style={{ color: "oklch(0.52 0.015 250)" }}
              onClick={() => setMobileOpen(false)}
            >
              <X size={16} />
            </button>
            <SidebarContent
              isActive={isActive}
              setMobileOpen={setMobileOpen}
              logout={logout}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-5 py-3 border-b"
          style={{
            background: "oklch(0.085 0.012 265)",
            borderColor: "oklch(1 0 0 / 6%)",
          }}
        >
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-md"
            style={{ color: "oklch(0.52 0.015 250)" }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex-1">
            {title && (
              <h1
                className="text-base font-semibold"
                style={{
                  color: "oklch(0.94 0.005 240)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="size-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "oklch(0.82 0.15 200 / 15%)",
                color: "oklch(0.82 0.15 200)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "J"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
