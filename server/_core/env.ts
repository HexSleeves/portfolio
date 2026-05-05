import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

export const ENV = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  databaseUrl: parsed.DATABASE_URL ?? "",
  cookieSecret: parsed.JWT_SECRET ?? "development-only-session-secret",
  adminEmail: parsed.ADMIN_EMAIL ?? "admin@example.com",
  adminPasswordHash: parsed.ADMIN_PASSWORD_HASH ?? "",
  isProduction: parsed.NODE_ENV === "production",
};

export function assertProductionEnv() {
  if (!ENV.isProduction) return;

  const missing = [
    ["DATABASE_URL", ENV.databaseUrl],
    ["JWT_SECRET", process.env.JWT_SECRET],
    ["ADMIN_EMAIL", process.env.ADMIN_EMAIL],
    ["ADMIN_PASSWORD_HASH", process.env.ADMIN_PASSWORD_HASH],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }

  if (ENV.cookieSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
}
