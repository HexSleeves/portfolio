import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock the DB helpers ────────────────────────────────────────────────────
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getAllBlogPosts: vi.fn(),
    getBlogPostBySlug: vi.fn(),
    getBlogPostById: vi.fn(),
    createBlogPost: vi.fn(),
    updateBlogPost: vi.fn(),
    deleteBlogPost: vi.fn(),
    toggleBlogPostPublished: vi.fn(),
    getAllProjects: vi.fn(),
    getProjectBySlug: vi.fn(),
    getProjectById: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  };
});

import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getAllProjects,
} from "./db";

// ─── Context helpers ────────────────────────────────────────────────────────
function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-open-id",
      email: "lecoqjacob@gmail.com",
      name: "Jacob LeCoq",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Blog router tests ──────────────────────────────────────────────────────
describe("blog.list (public)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns published posts only", async () => {
    const mockPosts = [
      { id: 1, slug: "post-one", title: "Post One", published: true, tags: "[]", technologies: "[]" },
    ];
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts as any);

    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.blog.list();

    expect(getAllBlogPosts).toHaveBeenCalledWith({ publishedOnly: true, search: undefined });
    expect(result).toEqual(mockPosts);
  });

  it("passes search parameter through", async () => {
    vi.mocked(getAllBlogPosts).mockResolvedValue([]);

    const caller = appRouter.createCaller(makePublicCtx());
    await caller.blog.list({ search: "typescript" });

    expect(getAllBlogPosts).toHaveBeenCalledWith({ publishedOnly: true, search: "typescript" });
  });
});

describe("blog.bySlug (public)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a published post by slug", async () => {
    const mockPost = { id: 1, slug: "my-post", title: "My Post", published: true };
    vi.mocked(getBlogPostBySlug).mockResolvedValue(mockPost as any);

    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.blog.bySlug({ slug: "my-post" });

    expect(result).toEqual(mockPost);
  });

  it("throws NOT_FOUND for unpublished post", async () => {
    vi.mocked(getBlogPostBySlug).mockResolvedValue({ id: 2, slug: "draft", published: false } as any);

    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.blog.bySlug({ slug: "draft" })).rejects.toThrow();
  });

  it("throws NOT_FOUND when post does not exist", async () => {
    vi.mocked(getBlogPostBySlug).mockResolvedValue(null as any);

    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.blog.bySlug({ slug: "nonexistent" })).rejects.toThrow();
  });
});

describe("blog.adminList (admin only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all posts including drafts for admin", async () => {
    const mockPosts = [
      { id: 1, slug: "published", published: true },
      { id: 2, slug: "draft", published: false },
    ];
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts as any);

    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.blog.adminList();

    expect(getAllBlogPosts).toHaveBeenCalledWith({ publishedOnly: false });
    expect(result).toHaveLength(2);
  });

  it("throws FORBIDDEN for non-admin user", async () => {
    const userCtx: TrpcContext = {
      ...makeAdminCtx(),
      user: { ...makeAdminCtx().user!, role: "user" },
    };

    const caller = appRouter.createCaller(userCtx);
    await expect(caller.blog.adminList()).rejects.toThrow();
  });

  it("throws UNAUTHORIZED for unauthenticated request", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.blog.adminList()).rejects.toThrow();
  });
});

// ─── Projects router tests ──────────────────────────────────────────────────
describe("projects.list (public)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all visible projects", async () => {
    const mockProjects = [
      { id: 1, slug: "tailscale-mcp", title: "tailscale-mcp", isPrivate: false, isFeatured: true },
    ];
    vi.mocked(getAllProjects).mockResolvedValue(mockProjects as any);

    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.projects.list();

    expect(getAllProjects).toHaveBeenCalledWith({ category: undefined });
    expect(result).toEqual(mockProjects);
  });

  it("passes category filter through", async () => {
    vi.mocked(getAllProjects).mockResolvedValue([]);

    const caller = appRouter.createCaller(makePublicCtx());
    await caller.projects.list({ category: "Open Source" });

    expect(getAllProjects).toHaveBeenCalledWith({ category: "Open Source" });
  });
});

describe("projects.featured (public)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns only featured projects", async () => {
    const mockFeatured = [
      { id: 1, slug: "tailscale-mcp", isFeatured: true },
    ];
    vi.mocked(getAllProjects).mockResolvedValue(mockFeatured as any);

    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.projects.featured();

    expect(getAllProjects).toHaveBeenCalledWith({ featuredOnly: true });
    expect(result).toEqual(mockFeatured);
  });
});
