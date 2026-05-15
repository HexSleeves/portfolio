// ============================================================
// Terminal Noir — Jacob LeCoq Portfolio Data
// All content sourced from resume + GitHub profile
// ============================================================

export interface Project {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  technologies: string[];
  features: string[];
  results: string;
  githubUrl?: string;
  liveUrl?: string;
  isPrivate: boolean;
  isFeatured: boolean;
  category: "open-source" | "professional" | "personal";
  image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  content: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  current: boolean;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

// ─── Projects ────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "tailscale-mcp",
    title: "Tailscale MCP Server",
    summary:
      "A Model Context Protocol server enabling AI agents to manage Tailscale networks programmatically.",
    problem:
      "AI coding assistants lacked the ability to interact with private network infrastructure, requiring manual context-switching and slowing down AI-assisted DevOps workflows.",
    role: "Sole author — designed the architecture, implemented all tool modules, set up CI/CD, and published to NPM and Docker Hub.",
    technologies: [
      "TypeScript",
      "Node.js",
      "Bun",
      "Docker",
      "GitHub Actions",
      "Zod",
      "MCP SDK",
    ],
    features: [
      "Device management: list, authorize, deauthorize Tailscale nodes",
      "Network operations: connect/disconnect, route management, status monitoring",
      "Security controls: ACL management, device tags, network lock",
      "Published to NPM, Docker Hub, and GitHub Container Registry",
      "OAuth authentication support",
      "Full CI/CD pipeline with multi-registry publishing script",
    ],
    results:
      "87 GitHub stars, 19 forks. Adopted by developers integrating AI agents into private network workflows. Published across three package registries.",
    githubUrl: "https://github.com/HexSleeves/tailscale-mcp",
    isPrivate: false,
    isFeatured: true,
    category: "open-source",
  },
  {
    slug: "waggle",
    title: "Waggle — Multi-Agent Orchestration",
    summary:
      "A Go-based multi-agent orchestration framework where a Queen LLM agent decomposes objectives and delegates to Worker Bee sub-agents.",
    problem:
      "Complex software tasks require coordinating multiple AI coding agents (Claude Code, Codex, Gemini) in parallel, but no lightweight Go-native framework existed for this workflow.",
    role: "Sole author — designed the agent architecture, Queen/Worker model, TUI dashboard, and GoReleaser-based distribution pipeline.",
    technologies: [
      "Go",
      "LLM APIs",
      "Anthropic Claude",
      "SQLite",
      "Bubble Tea (TUI)",
      "GoReleaser",
      "GitHub Actions",
    ],
    features: [
      "Queen agent (tool-using LLM) decomposes objectives into task dependency graphs",
      "Worker Bee adapters for Claude Code, Codex, Kimi, Gemini, and plain shell",
      "Parallel task execution with dependency resolution",
      "Interactive TUI dashboard with Queen reasoning panel and task progress",
      "SQLite-backed hive state for session persistence and resumption",
      "GoReleaser-based cross-platform binary distribution",
    ],
    results:
      "Fully functional v1.0.0 release. Enables complex multi-step engineering tasks to be orchestrated autonomously across multiple AI backends.",
    githubUrl: "https://github.com/HexSleeves/waggle",
    isPrivate: false,
    isFeatured: true,
    category: "open-source",
  },
  {
    slug: "resume-forge",
    title: "ResumeForge",
    summary:
      "AI-powered resume builder that tailors your resume to specific job descriptions using LLM analysis.",
    problem:
      "Job seekers waste hours manually reformatting resumes for each application. ResumeForge automates tailoring by analyzing the job posting and generating an ATS-optimized version with a diff view showing exactly what changed.",
    role: "Sole author — full-stack design, LLM integration, PDF generation pipeline, and deployment.",
    technologies: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "OpenAI",
      "Tailwind CSS",
      "PostgreSQL",
    ],
    features: [
      "Analyzes job postings against your existing resume to generate tailored, ATS-optimized versions",
      "Markdown-based resume format with real-time preview",
      "Diff view showing exactly what changed between the original and tailored version",
      "PDF export with clean, recruiter-friendly formatting",
      "tRPC for end-to-end type-safe API between Next.js frontend and backend",
    ],
    results:
      "Private project used personally and shared with colleagues. Reduced resume tailoring time from hours to minutes.",
    isPrivate: true,
    isFeatured: true,
    category: "personal",
  },
  {
    slug: "family-events",
    title: "Family Events v2",
    summary:
      "A private family event coordination platform with shared calendars, RSVP management, and photo sharing.",
    problem:
      "Coordinating family events across multiple households required juggling group chats, emails, and spreadsheets. A dedicated platform was needed to centralize planning, RSVPs, and memories in one place.",
    role: "Sole author — designed the data model, built the full-stack application, and deployed to production.",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Real-time notifications",
    ],
    features: [
      "Shared family calendar for birthdays, reunions, and holidays",
      "RSVP tracking with attendance counts",
      "Photo sharing tied to specific events",
      "Real-time notifications for event updates",
      "Mobile-responsive design for on-the-go access",
    ],
    results:
      "Private project actively used by family. Eliminated coordination friction and centralized all event planning and photo memories.",
    isPrivate: true,
    isFeatured: true,
    category: "personal",
  },
  {
    slug: "runeforge",
    title: "RuneForge — Rust Roguelike Library",
    summary:
      "A modern, modular roguelike game library for Rust with a clean API for grid-based game development.",
    problem:
      "Existing Rust game libraries for roguelikes were either too opinionated or too low-level, making it hard to build maintainable grid-based games.",
    role: "Sole author — designed the library API, implemented core systems, and published as an open-source crate.",
    technologies: ["Rust", "Game Development", "Grid Systems", "ECS patterns"],
    features: [
      "Modular architecture — use only what you need",
      "Clean grid-based rendering abstraction",
      "FOV (field of view) and pathfinding utilities",
      "BSD 3-Clause licensed for maximum flexibility",
    ],
    results:
      "Open-source library available on GitHub. Demonstrates deep Rust expertise and systems programming capability.",
    githubUrl: "https://github.com/HexSleeves/runeforge",
    isPrivate: false,
    isFeatured: false,
    category: "open-source",
  },
  {
    slug: "gc-ui",
    title: "@gc-agency/gc-ui — Component Library",
    summary:
      "A standalone TypeScript component library standardizing shared UI patterns across Bayer's 22-app Global Commerce frontend monorepo.",
    problem:
      "Each app in Bayer's large Nx monorepo was re-implementing common UI patterns independently — forms, feature-flagged components, design tokens — leading to inconsistency and duplicated maintenance burden across teams.",
    role: "Lead engineer — designed the library architecture, built the component catalog and Storybook, configured the build pipeline, and drove adoption across application teams.",
    technologies: [
      "TypeScript",
      "React",
      "Vite",
      "Storybook 10",
      "Vitest",
      "Playwright",
      "Biome",
      "Element Design",
      "LaunchDarkly",
      "React Hook Form",
      "Nx",
    ],
    features: [
      "Shared design-token-driven components aligned to Element Design system",
      "LaunchDarkly feature-flag integration baked into component variants",
      "React Hook Form wrappers enforcing consistent form validation patterns",
      "Storybook 10 catalog with interactive docs and accessibility checks",
      "Vitest unit tests and Playwright component tests in CI",
      "Biome for zero-config linting and formatting across the library",
      "Published as a versioned npm package consumed by all Bayer Commerce apps",
    ],
    results:
      "Eliminated duplicated UI code across 22 applications. Reduced onboarding time for new component patterns from days to hours. Standardized feature-flag usage and form handling company-wide.",
    isPrivate: true,
    isFeatured: true,
    category: "professional",
  },
  {
    slug: "bayer-terraform",
    title: "Bayer Commerce — Terraform AWS Infrastructure",
    summary:
      "Modular Terraform stacks automating the full AWS infrastructure for Bayer's Global Commerce middleware platform across non-production and production environments.",
    problem:
      "Bayer's middleware infrastructure was provisioned manually and inconsistently across environments, creating configuration drift, slow provisioning, and risky production changes.",
    role: "Lead infrastructure engineer — designed modular stack architecture, implemented all service modules, configured remote state, and integrated infrastructure pipelines into GitHub Actions CI/CD.",
    technologies: [
      "Terraform",
      "AWS",
      "Aurora PostgreSQL",
      "ElastiCache Redis",
      "DynamoDB",
      "Lambda",
      "API Gateway",
      "S3",
      "Datadog",
      "GitHub Actions",
    ],
    features: [
      "Modular stacks for Aurora PostgreSQL, ElastiCache Redis, DynamoDB, S3, Lambda, and API Gateway",
      "Remote S3-backed state with DynamoDB locking for safe concurrent applies",
      "Datadog integration for infrastructure-level monitoring and alerting",
      "Reusable GitHub Actions composite action for Terraform plan/apply across all repositories",
      "Vault-backed secret retrieval for zero-plaintext credential handling",
      "Consistent environment parity between non-production and production",
    ],
    results:
      "Reduced environment provisioning time from days to under an hour. Eliminated configuration drift between environments. Enabled safe, automated infrastructure promotion through CI/CD.",
    isPrivate: true,
    isFeatured: true,
    category: "professional",
  },
  {
    slug: "bayer-etl",
    title: "Bayer Commerce — ETL Pipelines & Workflow Engine",
    summary:
      "AWS Lambda and Nx ETL pipelines integrating SAP ERP data into Bayer's commerce platform, plus a deterministic workflow engine powering the reporting platform.",
    problem:
      "Bayer's commerce platform needed reliable, observable data flows from SAP ERP and SAP Commerce Cloud into DynamoDB and downstream systems, and a reporting layer that could execute multi-step workflows accurately and traceably.",
    role: "Lead engineer — designed the Lambda pipeline architecture, built the SAP integration adapters, and integrated the workflow engine into the NestJS reporting API.",
    technologies: [
      "TypeScript",
      "AWS Lambda",
      "NestJS",
      "DynamoDB",
      "Kafka",
      "SQS",
      "EventBridge",
      "SAP ERP",
      "SAP Commerce Cloud",
      "CloudWatch",
      "Datadog",
      "Nx",
    ],
    features: [
      "Lambda pipelines consuming SAP ERP warehouse, location, stock, and packaging-material data",
      "Kafka and SQS event-driven ingestion with EventBridge routing",
      "Azure hot-folder upload integration for SAP Commerce Cloud",
      "NestJS workflow engine endpoints with provider-based task execution and runtime validation",
      "OpenAPI coverage and execution tracing for all workflow steps",
      "CloudWatch and Datadog observability with Teams notifications on pipeline failures",
      "Deterministic workflow caching to prevent redundant report generation",
    ],
    results:
      "Reliable, observable SAP data flows supporting warehouse operations and packaging-material reporting. Workflow engine enabled faster, more accurate report generation with full execution traceability.",
    isPrivate: true,
    isFeatured: false,
    category: "professional",
  },
  {
    slug: "bayer-ai-platform",
    title: "Bayer AI Developer Workflows",
    summary:
      "Internal AI agent workflows and prompt engineering templates automating ticket triage, code generation, and documentation retrieval across Bayer engineering teams.",
    problem:
      "Engineering teams spent significant time on repetitive tasks — ticket triage, boilerplate code generation, and searching internal documentation — that were ripe for AI automation but lacked safe, standardized patterns.",
    role: "Lead engineer — designed the agent architecture, built prompt patterns and agent templates, integrated agents into JIRA and repository workflows, and drove team adoption.",
    technologies: ["TypeScript", "LLM APIs", "JIRA API", "NestJS", "Nx"],
    features: [
      "Natural-language ticket triage and routing via AI agents",
      "Code generation agents integrated into PR review workflows",
      "Repository and documentation retrieval for context-aware suggestions",
      "Reusable prompt patterns and agent templates shared across teams",
      "Standardized safe AI usage guidelines adopted company-wide",
    ],
    results:
      "Reduced manual engineering time by ~50%. Accelerated AI feature adoption across multiple teams. Prompt patterns and agent templates became the standard approach for new AI integrations at Bayer.",
    isPrivate: true,
    isFeatured: false,
    category: "professional",
  },
  {
    slug: "dnanexus-aws",
    title: "DNAnexus AWS Cost Optimization",
    summary:
      "Designed and implemented AWS infrastructure optimizations for a genomics cloud platform, reducing annual compute spend by $30K.",
    problem:
      "DNAnexus's production Node.js services were running on suboptimal AWS compute configurations, leading to unnecessary spend and throughput bottlenecks for customer workloads.",
    role: "Senior Software Engineer — led backend delivery, designed cross-account AWS patterns, and implemented Spot Instance orchestration.",
    technologies: [
      "AWS",
      "Node.js",
      "TypeScript",
      "IAM",
      "KMS",
      "Secrets Manager",
      "Spot Instances",
    ],
    features: [
      "Cluster optimization and pricing-model adjustments",
      "Spot Instance orchestration for customer genomics workloads",
      "Secure cross-account AWS patterns using IAM, KMS, and Secrets Manager",
      "BYOA (Bring Your Own Account) workload support for compliant customer data processing",
      "Service boundary enforcement reducing production incidents",
    ],
    results:
      "$30K annual AWS cost reduction. Improved compute throughput for customer genomics workloads. Enabled compliant cross-account data processing.",
    isPrivate: true,
    isFeatured: false,
    category: "professional",
  },
];

// ─── Blog Posts ───────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    slug: "building-mcp-servers-typescript",
    title: "Building Production MCP Servers with TypeScript",
    summary:
      "A deep dive into the Model Context Protocol — how to design, build, and publish a production-grade MCP server that AI agents can actually rely on.",
    date: "2026-03-15",
    readTime: "12 min read",
    tags: ["MCP", "TypeScript", "AI", "Open Source"],
    category: "Engineering",
    content: `The Model Context Protocol (MCP) is rapidly becoming the standard interface for connecting AI agents to external tools and services. After building and publishing \`tailscale-mcp\` — a production MCP server with 87 GitHub stars — here's what I learned about building MCP servers that developers actually trust.

## Why MCP Matters

AI coding assistants are only as powerful as the context they can access. MCP standardizes how agents discover and call tools, replacing ad-hoc integrations with a consistent, typed interface. If you're building developer tooling in 2026, MCP support is table stakes.

## Architecture Decisions

The key insight in designing \`tailscale-mcp\` was treating each Tailscale operation as a discrete, well-typed tool module rather than a monolithic handler. This made the codebase easy to extend and test independently.

\`\`\`typescript
const MyToolSchema = z.object({
  param: z.string().describe("Description of parameter"),
});

export const myTools: ToolModule = {
  tools: [{
    name: "my_tool",
    description: "What this tool does",
    inputSchema: MyToolSchema,
    handler: myTool,
  }],
};
\`\`\`

## Publishing to Multiple Registries

One underrated aspect of open-source MCP servers is distribution. I wrote an interactive publishing script that handles NPM, Docker Hub, and GHCR in a single flow — reducing the friction of keeping all three registries in sync.

## Lessons Learned

The biggest lesson: **error messages are your API**. When an agent calls your tool and something goes wrong, the error message is what the LLM sees and reasons about. Invest in clear, actionable error messages.`,
  },
  {
    slug: "multi-agent-orchestration-go",
    title: "Multi-Agent Orchestration in Go: Lessons from Building Waggle",
    summary:
      "What I learned designing a Queen/Worker multi-agent framework in Go — from task dependency graphs to TUI dashboards and the surprisingly hard problem of agent state management.",
    date: "2026-02-20",
    readTime: "15 min read",
    tags: ["Go", "AI Agents", "Architecture", "Open Source"],
    category: "Engineering",
    content: `Building Waggle — a multi-agent orchestration framework in Go — taught me that the hardest part of multi-agent systems isn't the AI. It's state management, failure recovery, and making the system observable.

## The Queen/Worker Model

The core insight behind Waggle is that complex engineering tasks decompose naturally into a hierarchy: one orchestrating agent (the Queen) that reasons about the overall objective, and multiple worker agents that execute discrete subtasks in parallel.

The Queen is a tool-using LLM. She doesn't write code directly — she calls tools like \`create_tasks\`, \`assign_task\`, and \`approve_task\`. The Go runtime executes these tools and feeds results back. This separation of concerns keeps the orchestration logic clean and the worker adapters swappable.

## Why Go?

Go's goroutine model maps naturally to parallel agent execution. Spawning 8 worker bees is just spawning 8 goroutines with a shared SQLite state store. The binary distribution story is also excellent — GoReleaser produces cross-platform binaries with a single command.

## The TUI Problem

Making a multi-agent system observable is genuinely hard. I used Bubble Tea to build a TUI dashboard showing the Queen's reasoning, task progress, and worker status in real time. The challenge was keeping the TUI responsive while goroutines were writing to shared state.

## What's Next

The next frontier is persistent memory — giving the Queen access to a vector store of past sessions so she can learn from previous runs. This is where multi-agent systems start to feel genuinely autonomous.`,
  },
  {
    slug: "ci-cd-standards-nx-monorepo",
    title: "CI/CD Standards for Nx Monorepos at Scale",
    summary:
      "How we defined CI/CD standards across a large Nx-based frontend monorepo at Bayer — from GitHub Actions workflows to release guardrails and SonarQube integration.",
    date: "2026-01-10",
    readTime: "10 min read",
    tags: ["CI/CD", "Nx", "GitHub Actions", "DevOps"],
    category: "DevOps",
    content: `When you're the DevOps lead for a large Nx-based frontend monorepo, the challenge isn't writing CI pipelines — it's writing CI pipelines that other teams will actually follow and maintain.

## The Problem with Ad-Hoc CI

Before we standardized, each team had their own GitHub Actions workflows with different linting configs, test runners, and Docker build strategies. Onboarding a new engineer meant learning five different CI systems.

## Shared Workflow Strategy

The solution was a library of reusable GitHub Actions workflows that teams could compose rather than copy-paste. Each workflow had a single responsibility: lint, test, build, scan, or release.

\`\`\`yaml
jobs:
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      node-version: '24'
      run-sonarqube: true
\`\`\`

## Release Guardrails

The most impactful change was adding PR and deployment guardrails — automated checks that prevented merging without passing tests, blocked deploys to production without a release tag, and required SonarQube quality gates.

## Results

Build times dropped. Integration errors decreased. And most importantly, engineers stopped asking "how do I set up CI for my new service?" — the answer was always "use the shared workflow."`,
  },
  {
    slug: "building-component-library-vite-storybook",
    title:
      "Building a Production Component Library with Vite, Storybook 10, and Biome",
    summary:
      "How we designed and shipped @gc-agency/gc-ui — a standalone TypeScript component library used across 22 Bayer applications — and the tooling decisions that made it maintainable at scale.",
    date: "2026-04-28",
    readTime: "14 min read",
    tags: ["React", "TypeScript", "Storybook", "Vite", "Component Libraries"],
    category: "Engineering",
    content: `When you're building UI components that need to run consistently across 22 separate applications in an enterprise monorepo, the stakes for your library tooling are higher than a typical side project. Here's what we learned building @gc-agency/gc-ui — a standalone TypeScript component library for Bayer's Global Commerce platform.

## The Problem with Distributed UI Code

Before gc-ui, each app team was solving the same problems independently: form validation wrappers, feature-flagged component variants, shared design tokens, and LaunchDarkly integration. The result was a slow drift toward inconsistency — the same input component implemented five different ways, with five different validation patterns.

A shared component library sounds like an obvious fix. The hard part is making it something teams actually want to use rather than just another mandate from the platform team.

## Why Vite for Library Builds

The standard advice for library builds used to be Rollup directly. Vite's library mode wraps Rollup with sane defaults and makes it easy to emit both ESM and CJS outputs, generate declaration files, and externalize peer dependencies — all in a clean \`vite.config.ts\`:

\`\`\`typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  plugins: [react(), dts()],
});
\`\`\`

Build times are fast enough that we run the full library build on every PR without it becoming a bottleneck.

## Storybook 10 as the Living Contract

Storybook 10 dropped the \`.stories.tsx\` format overhead and made autodocs genuinely useful. For a shared library, Storybook isn't just docs — it's the contract between the library team and the consumers. We treated every component's story as a spec: if you can't write a story for a variant, the variant isn't ready to ship.

The accessibility addon caught real issues before they reached production. Running \`storybook build\` as part of CI meant the catalog was always fresh.

## LaunchDarkly Integration at the Component Level

This was the trickiest design decision. Feature flags in enterprise apps often end up scattered across business logic — a flag check here, a conditional render there. We pushed flag evaluation down into the component layer for a subset of UI changes, providing flag-aware variants:

\`\`\`typescript
export function FeatureButton({ featureKey, children, ...props }) {
  const flags = useFlags();
  if (!flags[featureKey]) return null;
  return <Button {...props}>{children}</Button>;
}
\`\`\`

This meant app teams got flag-gated components without having to wire up the LaunchDarkly SDK themselves — it was already initialized in the library's provider.

## Biome over ESLint + Prettier

We replaced the ESLint + Prettier combination with Biome and haven't looked back. A single \`biome.json\` covers linting and formatting, runs in milliseconds on CI, and eliminated the endless configuration drift that plagues large JavaScript projects. For a shared library where every contributor needs a consistent baseline, the zero-config nature of Biome is a genuine quality-of-life improvement.

## Testing Strategy: Vitest + Playwright

Unit tests with Vitest covered pure logic — form validation schemas, utility functions, flag evaluation helpers. Component tests with Playwright covered visual regressions and interaction patterns that Vitest can't catch: focus management, keyboard navigation, and scroll behavior.

The key insight: don't test component implementation details. Test behavior and output. This made refactoring internals without breaking tests practical.

## What Made Adoption Stick

The library succeeded because we made consumption frictionless. One \`npm install\`, one provider wrap, and teams had access to the full component catalog with TypeScript autocomplete. The Storybook deployment gave teams a reference they could bookmark. And when teams found gaps, we had a clear contribution path — open a PR against the library, get a review from the platform team, and ship.

The hard part of a shared component library isn't the components. It's making the feedback loop fast enough that teams reach for it instead of rolling their own.`,
  },
  {
    slug: "rust-for-typescript-developers",
    title: "Rust for TypeScript Developers: A Practical Guide",
    summary:
      "Coming from TypeScript, Rust's ownership model feels alien at first. Here's the mental model shift that made it click — and why I now reach for Rust for performance-critical tooling.",
    date: "2025-12-05",
    readTime: "18 min read",
    tags: ["Rust", "TypeScript", "Systems Programming"],
    category: "Engineering",
    content: `I've been writing TypeScript professionally for years, and I picked up Rust for building performance-critical CLI tools and agent templates. The ownership model is genuinely different from anything in the JavaScript ecosystem — here's the mental model that made it click.

## The Ownership Mental Model

In TypeScript, you think about values. In Rust, you think about *who owns* values and *how long they live*. Once this clicked, the borrow checker stopped feeling like an obstacle and started feeling like a collaborator.

The key insight: Rust's ownership rules are just making explicit what you already do implicitly in TypeScript — you just don't get a runtime error when you get it wrong.

## Where Rust Shines for CLI Tools

For the Go CLI tool I built at Bayer, I initially considered Rust. The single-binary distribution, zero-runtime overhead, and predictable memory usage make Rust ideal for deployment orchestration tools that need to run in constrained environments.

## Prompt Engineering in Rust

One of the more interesting use cases: building reusable prompt patterns and agent templates in Rust. The type system is excellent for encoding prompt structure — you can make invalid prompt configurations unrepresentable at compile time.

## When to Stick with TypeScript

Rust isn't always the right tool. For web APIs, LLM integrations, and anything that needs to move fast, TypeScript with NestJS is still my default. Rust is for when you need predictable performance, zero-cost abstractions, or single-binary distribution.`,
  },
];

// ─── Experience ───────────────────────────────────────────────

export const experience: Experience[] = [
  {
    company: "Dexian (Bayer)",
    role: "Senior Software Engineer",
    period: "Aug 2024 – Present",
    current: true,
    highlights: [
      "Led platform and full-stack delivery for Bayer Global Commerce, managing a production NestJS middleware API, a 22-app Nx React frontend monorepo, shared UI packages, ETL services, and reusable CI/CD automation",
      "Developed internal AI developer workflows and agent templates for ticket triage, code generation, repository and documentation retrieval, and workflow automation, reducing repetitive engineering effort",
      "Automated Terraform-based AWS infrastructure for middleware services with modular stacks for Aurora PostgreSQL, ElastiCache Redis, DynamoDB, S3, Lambda, API Gateway, Datadog, and remote S3-backed state",
      "Delivered AWS Lambda and Nx ETL pipelines integrating SAP ERP, SAP Commerce Cloud, DynamoDB, Kafka, SQS, EventBridge, Azure hot-folder uploads, CloudWatch, and Datadog",
      "Integrated a deterministic workflow engine into the reporting platform with NestJS endpoints, provider-based task execution, runtime validation, OpenAPI coverage, execution tracing, and caching",
      "Enhanced the React reporting platform with config-driven report templates, RTK Query adapters, Redux/Zustand state management, progressive pagination, and reusable transformer/fetch-hook registries",
      "Developed reusable GitHub Actions and composite actions for Terraform plan/apply, Docker build/publish, SonarQube scanning, npm package release, AWS authentication, and Vault-backed secret retrieval",
      "Published @gc-agency/gc-ui, a standalone TypeScript component library using Vite, Storybook, Vitest, Playwright, Biome, Element Design, LaunchDarkly, and React Hook Form",
      "Modernized large TypeScript workspaces by upgrading to Node 24, TypeScript 6, Storybook 10, and React ecosystem dependencies",
    ],
  },
  {
    company: "DNAnexus",
    role: "Senior Software Engineer",
    period: "Oct 2023 – Aug 2024",
    current: false,
    highlights: [
      "Led backend development for production Node.js and TypeScript services, delivering three major features on schedule",
      "Reduced AWS costs by $30K annually through cluster optimization, pricing model adjustments, and more efficient compute orchestration",
      "Designed secure cross-account AWS patterns for BYOA workloads using IAM, KMS, and Secrets Manager",
      "Implemented Spot Instance orchestration to reduce compute costs and enhance throughput for customer workloads",
      "Enhanced backend quality by enforcing service boundaries, code review standards, and clearer contracts across modular services",
    ],
  },
  {
    company: "Bayer",
    role: "Senior Software Engineer",
    period: "Feb 2020 – Oct 2023",
    current: false,
    highlights: [
      "Led full-stack engineering of Bayer digital platforms, developing reusable React and Node.js systems adopted across multiple programs",
      "Designed DynamoDB data models and indexes to enhance query performance, accuracy, and long-term maintainability",
      "Enhanced production reliability by implementing Datadog and CloudWatch monitoring, reducing defects, and refactoring services for improved performance",
      "Coordinated releases of a critical DMP application to enhance deployment reliability and enable zero-downtime delivery",
      "Automated AWS infrastructure using CloudFormation and Lambda, enhancing consistency and reducing manual operational tasks",
      "Led the migration of legacy REST endpoints to GraphQL APIs, improving data fetching efficiency and developer experience",
    ],
  },
  {
    company: "Waitr",
    role: "Software Engineer",
    period: "May 2019 – Jan 2020",
    current: false,
    highlights: [
      "Led AngularJS frontend development for internal applications, enhancing partner and support workflows",
      "Optimized Grunt builds and CircleCI pipelines to reduce deployment friction and resolved production defects through targeted hot fixes",
      "Transformed Zeplin designs into reusable Angular components and directives, enhancing UI consistency and accelerating feature development",
    ],
  },
  {
    company: "CGI Federal",
    role: "Technical Consultant",
    period: "Feb 2018 – May 2019",
    current: false,
    highlights: [
      "Collaborated with EPA stakeholders using IaC and Datadog to implement compliance-focused solutions, delivering all mandated features on schedule",
      "Developed full-stack EPA features using Knockout.js and Spring Boot, delivering iterative releases on a consistent two-week schedule",
      "Resolved cross-stack defects and redesigned service boundaries to enhance stability and long-term maintainability",
    ],
  },
  {
    company: "ASV Global",
    role: "Autonomous Systems Software Developer",
    period: "May 2017 – Jan 2018",
    current: false,
    highlights: [
      "Developed C++ core systems and Qt interfaces for autonomous marine software, reducing operator steps by 33%",
      "Implemented winch-control logic, configured headless embedded systems, and calibrated instruments using Go and MATLAB, enabling reliable field deployments without downtime",
      "Reduced regressions and accelerated defect isolation by applying code review, static analysis, QA testing, and Splunk-based log analysis",
    ],
  },
  {
    company: "Perficient",
    role: "Associate Technical Consultant",
    period: "Jun 2016 – May 2017",
    current: false,
    highlights: [
      "Implemented AngularJS and Java features for government clients, enhancing release cadence and application stability",
      "Supported Jenkins deployments and established Git branching strategies, resulting in smoother release pipelines",
      "Managed server compliance tasks and clarified requirements with clients and internal teams, reducing compliance issues",
    ],
  },
];

// ─── Skills ───────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      "TypeScript",
      "JavaScript",
      "Go",
      "Rust",
      "Python",
      "Java",
      "C++",
      "SQL",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React",
      "Next.js",
      "AngularJS",
      "Tailwind CSS",
      "Vite",
      "Storybook",
      "Redux",
      "Zustand",
      "React Hook Form",
    ],
  },
  {
    name: "Backend",
    skills: ["Node.js", "NestJS", "GraphQL", "REST APIs", "Spring Boot"],
  },
  {
    name: "Cloud & Data",
    skills: [
      "AWS",
      "DynamoDB",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "SQS",
      "EventBridge",
      "Lambda",
      "CloudFormation",
      "Terraform",
    ],
  },
  {
    name: "AI & Platform",
    skills: [
      "AI Agents",
      "Prompt Engineering",
      "LLM Integration",
      "MCP",
      "Workflow Automation",
    ],
  },
  {
    name: "DevOps & Tooling",
    skills: [
      "CI/CD Architecture",
      "GitHub Actions",
      "Docker",
      "Nx",
      "SonarQube",
      "Datadog",
      "Vitest",
      "Playwright",
    ],
  },
  {
    name: "Leadership",
    skills: [
      "Platform Engineering",
      "Architecture",
      "Cross-functional Collaboration",
      "Mentoring",
      "Code Review",
      "Operational Reliability",
    ],
  },
];

// ─── Stats ────────────────────────────────────────────────────

export const stats = [
  { label: "Years of Experience", value: "8+" },
  { label: "AWS Cost Saved", value: "$30K" },
  { label: "GitHub Stars", value: "87+" },
  { label: "Engineering Time Saved", value: "50%" },
];
