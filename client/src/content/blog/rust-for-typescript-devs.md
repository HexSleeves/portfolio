---
title: "Rust for TypeScript Developers: What Transfers and What Doesn't"
slug: "rust-for-typescript-devs"
date: "2024-12-05"
summary: "After building RuneForge in Rust as a TypeScript developer, here's an honest take on what concepts transfer directly and where you'll need to rewire your thinking."
category: "Engineering"
tags: ["Rust", "TypeScript", "Systems Programming", "Learning"]
readTime: "9 min read"
published: true
---

I came to Rust as a TypeScript developer. I'd been writing TypeScript professionally for years, and I wanted to understand systems programming. Building [RuneForge](https://github.com/HexSleeves/runeforge) — a Rust library for roguelike games — was my vehicle. Here's what I learned.

## What Transfers Directly

**Type systems.** TypeScript's type system is genuinely sophisticated, and a lot of that thinking transfers. Rust's generics feel similar to TypeScript's, and the idea of making invalid states unrepresentable is something TypeScript developers already practice.

```rust
// This feels familiar if you've written discriminated unions in TypeScript
enum TileKind {
    Floor,
    Wall,
    Door { locked: bool },
    Stairs { direction: Direction },
}
```

**Enums as data.** TypeScript developers who use discriminated unions will feel right at home with Rust enums. They're more powerful in Rust (you can implement methods on them), but the mental model is the same.

**Error handling philosophy.** TypeScript developers who use `Result`-style error handling (returning errors instead of throwing) will find Rust's `Result<T, E>` natural. The `?` operator is like an automatic early return on error.

```rust
fn read_map(path: &str) -> Result<GameMap, MapError> {
    let content = std::fs::read_to_string(path)?; // returns early if error
    let map = parse_map(&content)?;
    Ok(map)
}
```

## What Requires New Thinking

**Ownership and borrowing.** This is the big one. There's no equivalent in TypeScript. The borrow checker enforces that you can't have a mutable reference and any other reference to the same data at the same time. This feels restrictive at first, but it's what gives Rust memory safety without a garbage collector.

The mental model that helped me: think of ownership as a linear type system. Each value has exactly one owner. When the owner goes out of scope, the value is dropped. Borrowing is a temporary loan.

```rust
let mut v = vec![1, 2, 3];
let first = &v[0];     // immutable borrow
// v.push(4);          // ❌ can't mutate while borrowed
println!("{}", first); // borrow ends here
v.push(4);             // ✅ now we can mutate
```

**Lifetimes.** Lifetimes are Rust's way of ensuring references don't outlive the data they point to. They're often inferred, but when they're not, the syntax is unfamiliar. Don't try to understand lifetimes abstractly — learn them through concrete examples.

**No null, no undefined.** Rust has `Option<T>` instead of `null`. This is actually better than TypeScript's `T | null | undefined` because the compiler forces you to handle the `None` case.

## The Roguelike Use Case

Roguelikes are a great Rust learning project because they're computationally intensive (pathfinding, field-of-view calculations, procedural generation) but don't require a web server or complex I/O. The [bracket-lib](https://github.com/amethyst/bracket-lib) crate is the standard starting point.

RuneForge started as a learning project and evolved into a reusable library for common roguelike primitives: map generation, FOV calculation, pathfinding, and entity component systems.

## Predictable Memory Usage

One thing that surprised me: Rust programs have predictable memory usage in a way that TypeScript/Node.js programs don't. No garbage collector means no GC pauses, no memory spikes. For game development, this matters. For deployment orchestration tools that need to run in constrained environments, it matters even more.

## Prompt Engineering in Rust

One of the more interesting use cases: building reusable prompt patterns and agent templates in Rust. The type system is excellent for encoding prompt structure — you can make invalid prompt configurations unrepresentable at compile time.

## When to Stick with TypeScript

Rust isn't always the right tool. For web APIs, LLM integrations, and anything that needs to move fast, TypeScript with NestJS is still my default. Rust is for when you need predictable performance, zero-cost abstractions, or single-binary distribution.
