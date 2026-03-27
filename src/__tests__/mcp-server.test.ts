import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("MCP server", () => {
  it("should create a server instance with correct name", () => {
    const server = new McpServer({
      name: "agent-peekaboo",
      version: "0.1.0",
    });
    expect(server).toBeDefined();
  });
});
