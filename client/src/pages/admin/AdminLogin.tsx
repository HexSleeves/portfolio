import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Lock } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      setError(null);
      await utils.auth.me.invalidate();
      navigate("/admin");
    },
    onError: (err) => setError(err.message || "Invalid email or password"),
  });

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    login.mutate({ email, password });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.085 0.012 265)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border p-6 space-y-5"
        style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}
      >
        <div className="space-y-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.82 0.15 200 / 12%)", color: "oklch(0.82 0.15 200)" }}
          >
            <Lock size={18} />
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: "oklch(0.94 0.005 240)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Admin Login
          </h1>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm" style={{ color: "oklch(0.65 0.01 240)", fontFamily: "'Inter', sans-serif" }}>
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none"
            style={{
              background: "oklch(0.085 0.012 265)",
              borderColor: "oklch(1 0 0 / 10%)",
              color: "oklch(0.94 0.005 240)",
              fontFamily: "'Inter', sans-serif",
            }}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm" style={{ color: "oklch(0.65 0.01 240)", fontFamily: "'Inter', sans-serif" }}>
            Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none"
            style={{
              background: "oklch(0.085 0.012 265)",
              borderColor: "oklch(1 0 0 / 10%)",
              color: "oklch(0.94 0.005 240)",
              fontFamily: "'Inter', sans-serif",
            }}
            required
          />
        </label>

        {error && (
          <p className="text-sm" style={{ color: "oklch(0.70 0.18 25)", fontFamily: "'Inter', sans-serif" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md px-4 py-2 text-sm font-medium"
          style={{
            background: "oklch(0.82 0.15 200)",
            color: "oklch(0.085 0.012 265)",
            fontFamily: "'Inter', sans-serif",
            opacity: login.isPending ? 0.7 : 1,
          }}
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
