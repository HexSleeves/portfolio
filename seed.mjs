// Database seed script — populates projects and blog posts from static data
// Run with: node seed.mjs

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// ─── Parse frontmatter ────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };
  const lines = match[1].split("\n");
  const fm = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else if (val === "true") val = true;
    else if (val === "false") val = false;
    else val = val.replace(/^["']|["']$/g, "");
    fm[key] = val;
  }
  return { frontmatter: fm, content: match[2].trim() };
}

// ─── Blog posts ───────────────────────────────────────────────
const blogDir = join(__dirname, "client/src/content/blog");
const mdFiles = readdirSync(blogDir).filter((f) => f.endsWith(".md"));

console.log(`\nSeeding ${mdFiles.length} blog posts...`);
for (const file of mdFiles) {
  const raw = readFileSync(join(blogDir, file), "utf-8");
  const { frontmatter: fm, content } = parseFrontmatter(raw);
  const slug = file.replace(".md", "");
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const published = fm.published === true || fm.published === "true";

  await connection.execute(
    `INSERT INTO blog_posts (slug, title, summary, content, category, tags, published, readTime, publishedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title), summary=VALUES(summary), content=VALUES(content),
       category=VALUES(category), tags=VALUES(tags), published=VALUES(published),
       readTime=VALUES(readTime), publishedAt=VALUES(publishedAt)`,
    [
      slug,
      fm.title || slug,
      fm.summary || fm.description || "",
      content,
      fm.category || "Engineering",
      JSON.stringify(tags),
      published ? 1 : 0,
      fm.readTime || fm.read_time || "5 min read",
      published && fm.date ? new Date(fm.date) : null,
    ]
  );
  console.log(`  ✓ ${slug} (published: ${published})`);
}

// ─── Projects ─────────────────────────────────────────────────
const projectsData = [
  {
    slug: "tailscale-mcp",
    title: "tailscale-mcp",
    summary: "A Model Context Protocol (MCP) server that exposes Tailscale network management operations as AI-callable tools.",
    description: "Enables AI assistants like Claude to manage Tailscale networks — listing devices, checking status, managing ACLs, and performing network operations — all through natural language. Built as a first-class MCP server with full TypeScript types and comprehensive tooling.",
    category: "open-source",
    technologies: ["TypeScript", "MCP", "Tailscale API", "Node.js", "Claude"],
    githubUrl: "https://github.com/HexSleeves/tailscale-mcp",
    liveUrl: null,
    isFeatured: true,
    isPrivate: false,
    stars: 87,
    sortOrder: 1,
  },
  {
    slug: "waggle",
    title: "Waggle",
    summary: "A multi-agent orchestration framework written in Go for building and coordinating AI agent swarms.",
    description: "Waggle provides a clean, composable API for defining agent roles, communication channels, and task delegation. Designed for production use with built-in observability, retry logic, and support for multiple LLM backends. Inspired by the waggle dance of honeybees — distributed coordination through simple local signals.",
    category: "open-source",
    technologies: ["Go", "LLM", "Multi-agent", "gRPC", "OpenAI API"],
    githubUrl: "https://github.com/HexSleeves/waggle",
    liveUrl: null,
    isFeatured: true,
    isPrivate: false,
    stars: 12,
    sortOrder: 2,
  },
  {
    slug: "resume-forge",
    title: "ResumeForge",
    summary: "AI-powered resume builder that tailors your resume to specific job descriptions using LLM analysis.",
    description: "ResumeForge analyzes job postings and your existing resume to generate tailored, ATS-optimized versions. Features a markdown-based resume format, real-time preview, PDF export, and a diff view showing what changed between versions. Built with Next.js, tRPC, and OpenAI.",
    category: "personal",
    technologies: ["Next.js", "TypeScript", "tRPC", "OpenAI", "Tailwind CSS", "PDF generation"],
    githubUrl: "https://github.com/HexSleeves/resume-forge",
    liveUrl: null,
    isFeatured: true,
    isPrivate: true,
    stars: 0,
    sortOrder: 3,
  },
  {
    slug: "family-events-v2",
    title: "Family Events v2",
    summary: "A private family event coordination platform with shared calendars, RSVP management, and photo sharing.",
    description: "A full-stack web application built for coordinating family events — birthdays, reunions, holidays. Features shared event calendars, RSVP tracking, photo albums, and push notifications. Built with React, Express, and PostgreSQL with OAuth authentication.",
    category: "personal",
    technologies: ["React", "TypeScript", "Express", "PostgreSQL", "OAuth", "Tailwind CSS"],
    githubUrl: "https://github.com/HexSleeves/family-events-v2",
    liveUrl: null,
    isFeatured: false,
    isPrivate: true,
    stars: 0,
    sortOrder: 4,
  },
  {
    slug: "runeforge",
    title: "RuneForge",
    summary: "A Rust library for building roguelike games — procedural generation, ECS integration, and terminal rendering.",
    description: "RuneForge provides reusable building blocks for roguelike games in Rust: procedural dungeon generation, field-of-view algorithms, pathfinding, and a terminal renderer built on crossterm. Designed to work seamlessly with the Bevy ECS framework.",
    category: "open-source",
    technologies: ["Rust", "Bevy ECS", "crossterm", "Procedural Generation", "Game Dev"],
    githubUrl: "https://github.com/HexSleeves/runeforge",
    liveUrl: null,
    isFeatured: false,
    isPrivate: false,
    stars: 8,
    sortOrder: 5,
  },
  {
    slug: "bayer-genomics-platform",
    title: "Bayer Genomics Platform",
    summary: "Cloud-scale genomics data processing platform handling petabyte-scale datasets for agricultural research.",
    description: "Led architecture and development of a cloud-native genomics platform at Bayer, processing petabyte-scale agricultural genomics data. Reduced pipeline execution time by 40% through parallelization and caching strategies. Built on AWS with Kubernetes orchestration and custom workflow engines.",
    category: "professional",
    technologies: ["AWS", "Kubernetes", "Python", "TypeScript", "Genomics", "Terraform", "Docker"],
    githubUrl: null,
    liveUrl: null,
    isFeatured: true,
    isPrivate: true,
    stars: 0,
    sortOrder: 6,
  },
  {
    slug: "dnanexus-ai-platform",
    title: "DNAnexus AI Platform",
    summary: "AI-assisted bioinformatics tooling and workflow automation for a leading genomics cloud platform.",
    description: "Built AI-assisted tooling for DNAnexus's genomics cloud platform — including LLM-powered workflow generation, automated QC pipelines, and a developer SDK that reduced integration time by 50%. Shipped features used by hundreds of research institutions worldwide.",
    category: "professional",
    technologies: ["Python", "TypeScript", "LLM", "Bioinformatics", "REST APIs", "AWS", "CI/CD"],
    githubUrl: null,
    liveUrl: null,
    isFeatured: false,
    isPrivate: true,
    stars: 0,
    sortOrder: 7,
  },
];

console.log(`\nSeeding ${projectsData.length} projects...`);
for (const p of projectsData) {
  await connection.execute(
    `INSERT INTO projects (slug, title, summary, description, category, technologies, githubUrl, liveUrl, isFeatured, isPrivate, stars, sortOrder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title), summary=VALUES(summary), description=VALUES(description),
       category=VALUES(category), technologies=VALUES(technologies),
       githubUrl=VALUES(githubUrl), liveUrl=VALUES(liveUrl),
       isFeatured=VALUES(isFeatured), isPrivate=VALUES(isPrivate),
       stars=VALUES(stars), sortOrder=VALUES(sortOrder)`,
    [
      p.slug, p.title, p.summary, p.description, p.category,
      JSON.stringify(p.technologies), p.githubUrl, p.liveUrl,
      p.isFeatured ? 1 : 0, p.isPrivate ? 1 : 0, p.stars, p.sortOrder,
    ]
  );
  console.log(`  ✓ ${p.slug}`);
}

// ─── Site settings ────────────────────────────────────────────
const settings = [
  { key: "availability_banner_visible", value: "true" },
  { key: "availability_banner_message", value: "Open to new opportunities" },
  { key: "availability_banner_link", value: "#contact" },
];

console.log(`\nSeeding ${settings.length} site settings...`);
for (const s of settings) {
  await connection.execute(
    `INSERT INTO site_settings (\`key\`, value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE value=VALUES(value)`,
    [s.key, s.value]
  );
  console.log(`  ✓ ${s.key}`);
}

await connection.end();
console.log("\n✅ Seed complete!\n");
