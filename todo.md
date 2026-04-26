# Jacob Portfolio — TODO

## Admin Dashboard

- [x] Upgrade project to full-stack (web-db-user)
- [x] Add blog_posts, projects, and site_settings tables to drizzle/schema.ts
- [x] Run pnpm db:push / direct SQL to create tables
- [x] Add DB query helpers in server/db.ts
- [x] Add tRPC routers for blog CRUD (list, get, create, update, delete, publish toggle)
- [x] Add tRPC routers for projects CRUD (list, get, create, update, delete)
- [x] Add tRPC router for settings (getAll, set, setBatch)
- [x] Seed database with existing blog posts and projects
- [x] Build /admin route protected by owner-only auth
- [x] Build Admin Dashboard layout with sidebar (Blog, Projects, Settings)
- [x] Build Blog Manager page — list with publish/draft badges, search, delete
- [x] Build Blog Editor page — markdown editor with preview, frontmatter fields, publish toggle
- [x] Build Projects Manager page — list with featured/private badges, delete
- [x] Build Project Editor page — all project fields, featured toggle, visibility
- [x] Build Settings page — availability banner toggle, message, link
- [x] Wire public BlogPage to read from DB instead of static .md files
- [x] Wire public BlogPost to read from DB
- [x] Wire public ProjectsPage to read from DB instead of static data.ts
- [x] Wire public ProjectDetail to read from DB
- [x] Wire public Home featured projects and latest blog post to read from DB
- [ ] Write vitest tests for blog and project routers
- [x] Checkpoint and deliver
