---
title: "Multi-Agent Orchestration in Go: Lessons from Building Waggle"
slug: "multi-agent-go"
date: "2025-02-20"
summary: "Go's concurrency model turns out to be a natural fit for multi-agent AI systems. Here's the architecture behind Waggle and why I chose Go over TypeScript."
category: "AI & Tooling"
tags: ["Go", "AI Agents", "Concurrency", "Architecture"]
readTime: "10 min read"
published: true
---

When I started building [Waggle](https://github.com/HexSleeves/waggle), a multi-agent orchestration framework, the first question was: which language? TypeScript was the obvious choice — it's what most AI tooling is built in. But I chose Go, and after shipping the first version, I'm convinced it was the right call.

## Why Go for AI Agents?

Multi-agent systems are fundamentally concurrent. You have agents running in parallel, passing messages, waiting on external APIs, and coordinating on shared state. Go's goroutines and channels are purpose-built for exactly this pattern.

In TypeScript, you'd reach for `Promise.all`, worker threads, or a message queue library. In Go, it's idiomatic:

```go
type Agent struct {
    ID       string
    Inbox    chan Message
    Outbox   chan Message
    handler  HandlerFunc
}

func (a *Agent) Run(ctx context.Context) {
    for {
        select {
        case msg := <-a.Inbox:
            response, err := a.handler(ctx, msg)
            if err != nil {
                // handle error
                continue
            }
            a.Outbox <- response
        case <-ctx.Done():
            return
        }
    }
}
```

## The Orchestrator Pattern

Waggle uses a central orchestrator that routes messages between agents based on capability declarations. Each agent registers what it can do, and the orchestrator decides which agent handles each task.

```go
type Orchestrator struct {
    agents   map[string]*Agent
    router   Router
    mu       sync.RWMutex
}

func (o *Orchestrator) Dispatch(ctx context.Context, task Task) (Result, error) {
    o.mu.RLock()
    agent, err := o.router.Route(task, o.agents)
    o.mu.RUnlock()
    if err != nil {
        return Result{}, fmt.Errorf("routing failed: %w", err)
    }
    return agent.Execute(ctx, task)
}
```

## Handling Agent Failures

The hardest part of multi-agent systems isn't the happy path — it's failure handling. What happens when an agent times out? When it returns a malformed response? When the LLM it's calling is rate-limited?

Waggle uses a circuit breaker pattern per agent, with configurable retry policies and fallback agents. This keeps the system resilient without requiring every caller to implement their own retry logic.

## Observability

Go's structured logging (via `slog`) and the `expvar` package make it straightforward to expose agent metrics: messages processed, error rates, latency percentiles. For a production deployment, these feed directly into Datadog or Prometheus.

## What I'd Do Differently

If I were starting over, I'd invest earlier in a proper event sourcing model for agent state. The current approach uses in-memory state with periodic snapshots, which works but makes replay and debugging harder than it should be.

## Try It

Waggle is open source and actively maintained. If you're building multi-agent systems and want a lightweight Go framework that doesn't require a PhD to understand, give it a look.
