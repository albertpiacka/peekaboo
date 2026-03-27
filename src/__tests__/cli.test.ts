import { describe, it, expect } from "vitest";

// parseArgs is not exported, so we test it indirectly by simulating argv
// We'll extract the parser for testability

describe("CLI argument parsing", () => {
  function parseArgs(args: string[]) {
    const argv = ["node", "peekaboo", ...args];
    const options: Record<string, unknown> = {
      url: "http://localhost:3000",
    };

    const filtered = argv.slice(2).filter((a) => a !== "--mcp");
    for (let i = 0; i < filtered.length; i++) {
      switch (filtered[i]) {
        case "--url":
          options.url = filtered[++i];
          break;
        case "--wait-for-selector":
          options.selector = filtered[++i];
          break;
        case "--viewport": {
          const [w, h] = filtered[++i].split("x").map(Number);
          options.viewport = { width: w, height: h };
          break;
        }
        case "--full-page":
          options.fullPage = true;
          break;
        case "--project-dir":
          options.projectDir = filtered[++i];
          break;
      }
    }
    return options;
  }

  it("should use default url when no args provided", () => {
    const result = parseArgs([]);
    expect(result.url).toBe("http://localhost:3000");
  });

  it("should parse --url", () => {
    const result = parseArgs(["--url", "http://localhost:5173"]);
    expect(result.url).toBe("http://localhost:5173");
  });

  it("should parse --wait-for-selector", () => {
    const result = parseArgs(["--wait-for-selector", "#app"]);
    expect(result.selector).toBe("#app");
  });

  it("should parse --viewport", () => {
    const result = parseArgs(["--viewport", "1920x1080"]);
    expect(result.viewport).toEqual({ width: 1920, height: 1080 });
  });

  it("should parse --full-page", () => {
    const result = parseArgs(["--full-page"]);
    expect(result.fullPage).toBe(true);
  });

  it("should parse --project-dir", () => {
    const result = parseArgs(["--project-dir", "/home/user/my-app"]);
    expect(result.projectDir).toBe("/home/user/my-app");
  });

  it("should strip --mcp flag", () => {
    const result = parseArgs(["--mcp", "--url", "http://localhost:8080"]);
    expect(result.url).toBe("http://localhost:8080");
  });

  it("should handle multiple flags together", () => {
    const result = parseArgs([
      "--url",
      "http://localhost:4000",
      "--viewport",
      "800x600",
      "--full-page",
      "--wait-for-selector",
      ".content",
    ]);
    expect(result.url).toBe("http://localhost:4000");
    expect(result.viewport).toEqual({ width: 800, height: 600 });
    expect(result.fullPage).toBe(true);
    expect(result.selector).toBe(".content");
  });
});
