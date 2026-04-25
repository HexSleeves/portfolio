/**
 * Terminal Noir — Blog Content Loader
 *
 * Uses Vite's import.meta.glob to discover all .md files in content/blog/.
 * Parses frontmatter with a lightweight browser-native parser (no Node.js deps).
 * Only posts with `published: true` in frontmatter are exposed publicly.
 *
 * ─── Frontmatter schema ───────────────────────────────────────────────────────
 *   title:     string   — Post title
 *   slug:      string   — URL slug (must be unique)
 *   date:      string   — ISO date string (YYYY-MM-DD)
 *   summary:   string   — Short description shown in listings
 *   category:  string   — Category label
 *   tags:      string[] — Array of tag strings  (e.g. ["TypeScript", "Go"])
 *   readTime:  string   — e.g. "8 min read"
 *   published: boolean  — Set to `true` to make the post visible publicly
 *                         Anything else (false, missing) keeps it as a draft
 *
 * ─── Adding a new post ────────────────────────────────────────────────────────
 *   1. Create client/src/content/blog/your-post-slug.md
 *   2. Add the frontmatter block at the top (between --- delimiters)
 *   3. Write your post in Markdown below the closing ---
 *   4. Set `published: true` when ready to go live
 */

export interface BlogPostMeta {
  title: string;
  slug: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  readTime: string;
  published: boolean;
}

export interface BlogPost extends BlogPostMeta {
  /** Raw markdown body (frontmatter stripped) */
  content: string;
}

// ─── Lightweight browser-safe frontmatter parser ──────────────────────────────

/**
 * Parses a YAML-ish value string into a JS primitive.
 * Handles: strings (quoted or bare), booleans, numbers, and simple arrays.
 */
function parseValue(raw: string): unknown {
  const v = raw.trim();

  // Quoted string
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }

  // Boolean
  if (v === "true") return true;
  if (v === "false") return false;

  // Inline array: ["a", "b"] or [a, b]
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((item) => {
        const t = item.trim();
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
          return t.slice(1, -1);
        }
        return t;
      })
      .filter(Boolean);
  }

  // Number
  if (!isNaN(Number(v)) && v !== "") return Number(v);

  // Bare string
  return v;
}

/**
 * Splits a raw .md file into { attributes, body }.
 * Expects frontmatter between the first pair of `---` lines.
 */
function parseFrontmatter(raw: string): { attributes: Record<string, unknown>; body: string } {
  const lines = raw.split("\n");
  const attributes: Record<string, unknown> = {};

  // Must start with ---
  if (lines[0]?.trim() !== "---") {
    return { attributes, body: raw };
  }

  let closingIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      closingIndex = i;
      break;
    }
  }

  if (closingIndex === -1) {
    return { attributes, body: raw };
  }

  // Parse key: value lines
  for (let i = 1; i < closingIndex; i++) {
    const line = lines[i];
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) {
      attributes[key] = parseValue(value);
    }
  }

  const body = lines.slice(closingIndex + 1).join("\n").trimStart();
  return { attributes, body };
}

// ─── Vite glob import ─────────────────────────────────────────────────────────

// All .md files in content/blog/ imported as raw strings at build time
const rawFiles = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ─── Post parsing ─────────────────────────────────────────────────────────────

function parsePost(raw: string): BlogPost {
  const { attributes: d, body } = parseFrontmatter(raw);

  return {
    title: typeof d.title === "string" ? d.title : "Untitled",
    slug: typeof d.slug === "string" ? d.slug : "",
    date: typeof d.date === "string" ? d.date : "",
    summary: typeof d.summary === "string" ? d.summary : "",
    category: typeof d.category === "string" ? d.category : "General",
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    readTime: typeof d.readTime === "string" ? d.readTime : "5 min read",
    published: d.published === true,
    content: body,
  };
}

const allPosts: BlogPost[] = Object.values(rawFiles).map(parsePost);

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * All PUBLISHED posts, sorted newest-first.
 * Drafts (published: false or missing) are excluded.
 */
export const publishedPosts: BlogPost[] = allPosts
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * Get a single published post by slug.
 * Returns undefined if the post doesn't exist or is a draft.
 */
export function getPublishedPost(slug: string): BlogPost | undefined {
  return publishedPosts.find((p) => p.slug === slug);
}

/**
 * All unique categories derived from published posts.
 * Always starts with "All".
 */
export const publishedCategories: string[] = [
  "All",
  ...Array.from(new Set(publishedPosts.map((p) => p.category))),
];
