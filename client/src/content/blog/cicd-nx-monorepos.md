---
title: "CI/CD for Nx Monorepos: What Actually Works at Scale"
slug: "cicd-nx-monorepos"
date: "2025-01-10"
summary: "After leading CI/CD for a large Nx monorepo at Bayer, here are the patterns that cut build times and the mistakes that cost us weeks."
category: "DevOps"
tags: ["Nx", "CI/CD", "GitHub Actions", "Monorepo", "DevOps"]
readTime: "12 min read"
published: true
---

Running CI/CD for a large Nx monorepo is a different beast from a standard single-project pipeline. When you have 50+ apps and libraries sharing code, naive approaches will either run every test on every commit (slow) or miss affected tests entirely (dangerous). Here's what we learned at Bayer.

## The Core Principle: Affected-Only Builds

Nx's killer feature is `nx affected` — it uses your dependency graph to determine which projects are actually impacted by a change. A commit that only touches a utility library shouldn't rebuild your entire frontend.

```yaml
# .github/workflows/ci.yml
- name: Run affected tests
  run: npx nx affected --target=test --base=origin/main --head=HEAD

- name: Build affected apps
  run: npx nx affected --target=build --base=origin/main --head=HEAD
```

The `--base` and `--head` flags are critical. On pull requests, compare against `main`. On `main` itself, compare against the previous commit (`HEAD~1`).

## Distributed Task Execution

For large monorepos, even affected-only builds can be slow if they run sequentially. Nx Cloud's distributed task execution (DTE) splits work across multiple agents. But if you don't want to pay for Nx Cloud, you can approximate it with GitHub Actions matrix builds:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - name: Run tests (shard ${{ matrix.shard }}/4)
    run: npx nx affected --target=test --parallel=3
    env:
      NX_PARALLEL: 3
```

## Caching That Actually Works

Nx has a built-in computation cache. The key is making sure your CI environment can read from and write to it. We use GitHub Actions cache with a composite key:

```yaml
- uses: actions/cache@v4
  with:
    path: .nx/cache
    key: nx-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-${{ github.sha }}
    restore-keys: |
      nx-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-
      nx-${{ runner.os }}-
```

With proper caching, we cut our average CI time from 18 minutes to under 6 minutes.

## The TypeScript Project References Trap

One mistake that cost us two weeks: mixing Nx's project graph with TypeScript project references. They can conflict in subtle ways, especially with `paths` aliases. Our fix: use Nx's `@nx/js` plugin to manage TypeScript configuration, and never manually edit `tsconfig.json` paths in a way that diverges from Nx's expectations.

## Enforcing Module Boundaries

Nx's `@nx/enforce-module-boundaries` ESLint rule is worth the configuration time. It prevents circular dependencies and enforces that shared libraries don't import from app-specific code:

```json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "scope:shared",
            "onlyDependOnLibsWithTags": ["scope:shared"]
          },
          {
            "sourceTag": "scope:app",
            "onlyDependOnLibsWithTags": ["scope:shared", "scope:app"]
          }
        ]
      }
    ]
  }
}
```

## Deployment Orchestration

For deployments, we use a Go CLI tool that reads the Nx project graph and deploys only the apps that changed. This avoids the complexity of trying to do conditional deployments in YAML, which gets unmaintainable fast.

The key insight: treat your deployment pipeline as code, not configuration. A 50-line Go program is easier to reason about than 200 lines of GitHub Actions YAML with nested conditionals.
