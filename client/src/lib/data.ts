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

export const experience: Experience[] = [
  {
    company: "Dexian (Bayer)",
    role: "Senior Software Engineer",
    period: "Aug 2024 - Present",
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
    period: "Oct 2023 - Aug 2024",
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
    period: "Feb 2020 - Oct 2023",
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
    period: "May 2019 - Jan 2020",
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
    period: "Feb 2018 - May 2019",
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
    period: "May 2017 - Jan 2018",
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
    period: "Jun 2016 - May 2017",
    current: false,
    highlights: [
      "Implemented AngularJS and Java features for government clients, enhancing release cadence and application stability",
      "Supported Jenkins deployments and established Git branching strategies, resulting in smoother release pipelines",
      "Managed server compliance tasks and clarified requirements with clients and internal teams, reducing compliance issues",
    ],
  },
];

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
