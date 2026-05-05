---
title: "Building MCP Servers with TypeScript: A Practical Guide"
slug: "mcp-servers-typescript"
date: "2025-03-15"
summary: "How I built a production-ready MCP server for Tailscale network management, and what I learned about the Model Context Protocol along the way."
category: "AI & Tooling"
tags: ["TypeScript", "MCP", "AI", "Tailscale", "Node.js"]
readTime: "8 min read"
published: true
---

The Model Context Protocol (MCP) is quickly becoming the standard way to give AI assistants structured access to external systems. After building [tailscale-mcp](https://github.com/HexSleeves/tailscale-mcp) — a production MCP server that lets AI agents manage Tailscale networks — here's what I learned.

## What is MCP?

MCP is an open protocol developed by Anthropic that standardizes how AI models interact with external tools and data sources. Instead of every AI integration being a custom one-off, MCP gives you a consistent interface: tools (actions the AI can take), resources (data it can read), and prompts (reusable templates).

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "tailscale-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);
```

## Structuring Your Tools

The key insight is that MCP tools map directly to your domain's operations. For Tailscale, that means device management, ACL configuration, and network status. Each tool needs a clear name, a JSON Schema input definition, and a handler.

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_devices",
      description: "List all devices in the Tailscale network",
      inputSchema: {
        type: "object",
        properties: {
          filter: {
            type: "string",
            description: "Optional filter by hostname or tag",
          },
        },
      },
    },
  ],
}));
```

## Error Handling Matters More Than You Think

AI agents will call your tools in unexpected ways. Robust error handling isn't optional — it's what separates a toy MCP server from a production one. Always return structured errors that the AI can reason about:

```typescript
try {
  const devices = await tailscaleClient.getDevices(input.filter);
  return {
    content: [{ type: "text", text: JSON.stringify(devices, null, 2) }],
  };
} catch (err) {
  return {
    content: [{ type: "text", text: `Error: ${err.message}` }],
    isError: true,
  };
}
```

## Authentication and Security

Never hardcode credentials. Use environment variables and validate them at startup — fail fast if the required config isn't present. For Tailscale, this means validating the API key and tailnet name before the server starts accepting connections.

## Testing Your MCP Server

The MCP Inspector (`npx @modelcontextprotocol/inspector`) is invaluable for testing. It gives you a web UI to call your tools interactively before wiring them into Claude or another AI client.

## What's Next

The tailscale-mcp server has grown to 87+ GitHub stars and continues to receive contributions. Next up: adding support for Tailscale's ACL policy management and DNS configuration tools. If you're building your own MCP server, the [official SDK](https://github.com/modelcontextprotocol/typescript-sdk) is well-documented and the community is active.
