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
      "An AI-powered resume builder that generates tailored, ATS-optimized resumes from a structured profile.",
    problem:
      "Job seekers waste hours reformatting resumes for each application. ResumeForge automates tailoring by matching a candidate's experience to job descriptions using LLM-driven content generation.",
    role: "Sole author — full-stack design, LLM integration, PDF generation pipeline, and deployment.",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "LLM APIs",
      "PDF generation",
    ],
    features: [
      "Structured profile input with experience, skills, and accomplishments",
      "AI-driven tailoring to match job descriptions",
      "Multiple resume templates with clean PDF export",
      "ATS-friendly formatting",
    ],
    results:
      "Private project used personally and shared with colleagues. Reduced resume tailoring time from hours to minutes.",
    isPrivate: true,
    isFeatured: true,
    category: "personal",
  },
  {
    slug: "family-events",
    title: "Family Events Platform",
    summary:
      "A full-stack family event coordination platform with shared calendars, RSVP management, and real-time notifications.",
    problem:
      "Coordinating family events across multiple households required juggling group chats, emails, and spreadsheets. A dedicated platform was needed to centralize planning and RSVPs.",
    role: "Sole author — designed the data model, built the full-stack application, and deployed to production.",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Real-time notifications",
    ],
    features: [
      "Shared family calendar with event creation and management",
      "RSVP tracking with attendance counts",
      "Real-time notifications for event updates",
      "Mobile-responsive design for on-the-go access",
    ],
    results:
      "Private project actively used by family. Eliminated coordination friction and centralized all event planning.",
    isPrivate: true,
    isFeatured: false,
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
    slug: "bayer-ai-platform",
    title: "Bayer AI Agent Platform",
    summary:
      "Internal AI tooling and agent workflows built on Bayer's enterprise AI platform, automating ticket triage, code generation, and knowledge retrieval.",
    problem:
      "Engineering teams at Bayer spent significant time on repetitive tasks — ticket triage, boilerplate code generation, and searching internal documentation — that could be automated with AI agents.",
    role: "Lead engineer — designed the agent architecture, built prompt patterns and agent templates in Rust and JavaScript, and integrated agents into JIRA, repositories, and documentation systems.",
    technologies: [
      "TypeScript",
      "Rust",
      "JavaScript",
      "LLM APIs",
      "JIRA API",
      "NestJS",
      "Nx",
    ],
    features: [
      "Natural-language ticket triage and routing via AI agents",
      "Code generation agents integrated into PR workflows",
      "Knowledge retrieval from internal documentation",
      "Reusable prompt patterns and agent templates",
      "Safe AI usage standards adopted across teams",
    ],
    results:
      "Reduced manual engineering time by roughly 50%. Accelerated AI feature adoption across multiple teams. Standardized AI usage patterns company-wide.",
    isPrivate: true,
    isFeatured: true,
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
      "Cluster optimization and pricing-model changes",
      "Spot Instance orchestration for customer workloads",
      "Secure cross-account AWS patterns using IAM, KMS, and Secrets Manager",
      "BYOA (Bring Your Own Account) workload support",
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
    skills: ["TypeScript", "JavaScript", "Go", "Rust", "Python", "Java", "C++", "SQL"],
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
