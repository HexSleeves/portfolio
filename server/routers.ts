import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createBlogPost, createProject, deleteBlogPost, deleteProject,
  getAllBlogPosts, getAllProjects, getAllSettings,
  getBlogPostById, getBlogPostBySlug, getProjectById, getProjectBySlug,
  setSetting, updateBlogPost, updateProject,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

const blogRouter = router({
  list: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => getAllBlogPosts({ publishedOnly: true, search: input?.search })),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || !post.published) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),
  adminList: adminProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => getAllBlogPosts({ search: input?.search })),
  adminById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),
  create: adminProcedure
    .input(z.object({
      slug: z.string().min(1), title: z.string().min(1), summary: z.string().min(1),
      content: z.string().min(1), category: z.string().default("Engineering"),
      tags: z.array(z.string()).optional(), published: z.boolean().default(false),
      readTime: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const existing = await getBlogPostBySlug(input.slug);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
      return createBlogPost({ ...input, tags: input.tags ?? null, publishedAt: input.published ? new Date() : null });
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(), slug: z.string().min(1).optional(), title: z.string().min(1).optional(),
      summary: z.string().optional(), content: z.string().optional(), category: z.string().optional(),
      tags: z.array(z.string()).optional(), published: z.boolean().optional(), readTime: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const post = await getBlogPostById(id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return updateBlogPost(id, { ...data, tags: data.tags ?? undefined });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => { await deleteBlogPost(input.id); return { success: true }; }),
});

const projectsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => getAllProjects({ category: input?.category })),
  featured: publicProcedure.query(() => getAllProjects({ featuredOnly: true })),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),
  adminList: adminProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => getAllProjects({ category: input?.category })),
  adminById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const project = await getProjectById(input.id);
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),
  create: adminProcedure
    .input(z.object({
      slug: z.string().min(1), title: z.string().min(1), summary: z.string().min(1),
      description: z.string().optional(), category: z.enum(["open-source", "professional", "personal"]).default("personal"),
      technologies: z.array(z.string()).optional(), githubUrl: z.string().optional(),
      liveUrl: z.string().optional(), isFeatured: z.boolean().default(false),
      isPrivate: z.boolean().default(false), stars: z.number().default(0), sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const existing = await getProjectBySlug(input.slug);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
      return createProject({ ...input, technologies: input.technologies ?? null });
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(), slug: z.string().min(1).optional(), title: z.string().min(1).optional(),
      summary: z.string().optional(), description: z.string().optional(),
      category: z.enum(["open-source", "professional", "personal"]).optional(),
      technologies: z.array(z.string()).optional(), githubUrl: z.string().optional().nullable(),
      liveUrl: z.string().optional().nullable(), isFeatured: z.boolean().optional(),
      isPrivate: z.boolean().optional(), stars: z.number().optional(), sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const project = await getProjectById(id);
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return updateProject(id, { ...data, technologies: data.technologies ?? undefined });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => { await deleteProject(input.id); return { success: true }; }),
});

const settingsRouter = router({
  getAll: publicProcedure.query(() => getAllSettings()),
  set: adminProcedure
    .input(z.object({ key: z.string().min(1), value: z.string() }))
    .mutation(async ({ input }) => { await setSetting(input.key, input.value); return { success: true }; }),
  setBatch: adminProcedure
    .input(z.array(z.object({ key: z.string().min(1), value: z.string() })))
    .mutation(async ({ input }) => { await Promise.all(input.map(({ key, value }) => setSetting(key, value))); return { success: true }; }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  blog: blogRouter,
  projects: projectsRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
