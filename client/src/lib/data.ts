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
      "Led platform and full-stack delivery for Bayer Global Commerce across a production NestJS middleware API, a 22-app Nx React frontend monorepo, shared UI packages, ETL services, and reusable CI/CD automation",
      "Created AI-assisted developer workflows and agent templates for ticket triage, code generation, repository and documentation retrieval, and workflow automation across active product teams",
      "Built Terraform-managed AWS infrastructure for middleware and ETL services across Aurora PostgreSQL, ElastiCache Redis, DynamoDB, S3, Lambda, API Gateway, Datadog, and S3-backed remote state",
      "Delivered AWS Lambda and Nx ETL pipelines integrating SAP ERP, SAP Commerce Cloud, DynamoDB, Kafka, SQS, EventBridge, Azure hot-folder uploads, CloudWatch, Datadog, and Teams notifications",
      "Integrated a deterministic workflow engine into the reporting platform with NestJS workflow endpoints, provider-based task execution, runtime validation, OpenAPI coverage, execution tracing, caching, and tests for packaging-material and downstream treatment reports",
      "Modernized large TypeScript workspaces and published @gc-agency/gc-ui using Node 24, TypeScript 6, Storybook 10, Vite, Vitest, Playwright, Biome, Element Design, LaunchDarkly, and React Hook Form",
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
    skills: ["TypeScript", "JavaScript", "Go", "Python", "C++", "SQL"],
  },
  {
    name: "Frontend",
    skills: [
      "React",
      "Nx",
      "Redux",
      "Zustand",
      "Vite",
      "Storybook",
      "React Hook Form",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "NestJS",
      "tRPC",
      "GraphQL",
      "REST APIs",
      "Spring Boot",
    ],
  },
  {
    name: "Cloud & Data",
    skills: [
      "AWS",
      "Terraform",
      "DynamoDB",
      "Aurora PostgreSQL",
      "Kafka",
      "SQS",
      "EventBridge",
      "Lambda",
      "S3",
    ],
  },
  {
    name: "DevOps",
    skills: [
      "GitHub Actions",
      "Docker",
      "Datadog",
      "CloudWatch",
      "SonarQube",
      "CI/CD",
      "Vitest",
      "Playwright",
    ],
  },
  {
    name: "AI Workflows",
    skills: [
      "AI Developer Workflows",
      "Agent Templates",
      "Code Generation Workflows",
      "Repository Retrieval",
      "Ticket Triage Automation",
      "Workflow Automation",
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
