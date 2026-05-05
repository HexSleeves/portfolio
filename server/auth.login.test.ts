import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createPublicContext(): { ctx: TrpcContext; cookies: CookieCall[] } {
  const cookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: () => undefined,
    } as unknown as TrpcContext["res"],
  };

  return { ctx, cookies };
}

describe("auth.login", () => {
  beforeEach(() => {
    ENV.adminEmail = "admin@example.com";
    ENV.adminPasswordHash = "secret-password";
  });

  it("sets a session cookie for valid admin credentials", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: "admin@example.com",
      password: "secret-password",
    });

    expect(result).toEqual({ success: true });
    expect(cookies).toHaveLength(1);
    expect(cookies[0]?.name).toBe(COOKIE_NAME);
    expect(cookies[0]?.value).toEqual(expect.any(String));
    expect(cookies[0]?.options).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  });

  it("rejects an unknown email", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "other@example.com",
        password: "secret-password",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("rejects an invalid password", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "admin@example.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid email or password");
  });
});
