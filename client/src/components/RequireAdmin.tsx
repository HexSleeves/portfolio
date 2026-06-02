// RequireAdmin — wraps admin routes, redirects non-owners to /404
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user && user.role !== "admin") {
      setLocation("/404");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.085 0.012 265)" }}
      >
        <div className="size-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
