import { describe, it, expect, expectTypeOf } from "vitest";
import type { ScreenshotOptions, ScreenshotResult } from "../types.js";

describe("types", () => {
  it("ScreenshotOptions should have required url field", () => {
    expectTypeOf<ScreenshotOptions>().toHaveProperty("url");
  });

  it("ScreenshotOptions should have optional fields", () => {
    const opts: ScreenshotOptions = { url: "http://localhost:3000" };
    expectTypeOf(opts).toMatchTypeOf<ScreenshotOptions>();
  });

  it("ScreenshotResult should have base64 and metadata", () => {
    expectTypeOf<ScreenshotResult>().toHaveProperty("base64");
    expectTypeOf<ScreenshotResult>().toHaveProperty("metadata");
  });

  it("metadata should contain expected fields", () => {
    const result: ScreenshotResult = {
      base64: "abc",
      metadata: {
        url: "http://localhost:3000",
        pageTitle: "Test",
        viewport: { width: 1280, height: 720 },
        timestamp: new Date().toISOString(),
      },
    };
    expect(result.metadata.url).toBe("http://localhost:3000");
    expect(result.metadata.pageTitle).toBe("Test");
    expect(result.metadata.viewport).toEqual({ width: 1280, height: 720 });
  });
});
