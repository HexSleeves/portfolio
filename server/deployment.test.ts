import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const dockerfile = readFileSync(resolve("Dockerfile"), "utf8");

function stage(named: string) {
  const match = dockerfile.match(
    new RegExp(`FROM [^\\n]+ AS ${named}\\n(?<body>[\\s\\S]*?)(?=\\nFROM |$)`)
  );

  if (!match?.groups?.body) {
    throw new Error(`Dockerfile stage "${named}" not found`);
  }

  return match.groups.body;
}

describe("Dockerfile deployment image", () => {
  test("copies pnpm workspace policy into the runner stage", () => {
    expect(stage("runner")).toContain("pnpm-workspace.yaml");
  });
});
