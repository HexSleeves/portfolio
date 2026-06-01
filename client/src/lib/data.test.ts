import { describe, expect, test } from "vitest";
import { experience, skillCategories } from "./data";

describe("resume data", () => {
  test("reflects the latest portfolio resume content", () => {
    const currentRole = experience.find(
      job => job.company === "Dexian (Bayer)"
    );
    const currentHighlights = currentRole?.highlights.join(" ") ?? "";
    const allSkills = skillCategories.flatMap(category => category.skills);

    expect(currentRole?.highlights).toHaveLength(6);
    expect(currentHighlights).toContain("Teams notifications");
    expect(currentHighlights).toContain("downstream treatment reports");
    expect(currentHighlights).toContain("Storybook 10");
    expect(allSkills).toContain("AI Developer Workflows");
  });
});
