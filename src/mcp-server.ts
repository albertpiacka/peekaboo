import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { takeScreenshot, closeBrowser } from "./screenshot.js";
import { cleanupDevServer } from "./dev-server.js";

export async function startMcpServer(): Promise<void> {
  const server = new McpServer({
    name: "agent-peekaboo",
    version: "0.1.0",
  });

  server.tool(
    "screenshot",
    "Take a screenshot of a web page. Returns the image and metadata (URL, viewport, timestamp, page title).",
    {
      url: z
        .string()
        .describe("Full URL to screenshot, e.g. http://localhost:3000"),
      selector: z
        .string()
        .optional()
        .describe("CSS selector to wait for before capturing"),
      viewport: z
        .object({
          width: z.number().default(1280),
          height: z.number().default(720),
        })
        .optional()
        .describe("Viewport dimensions"),
      projectDir: z
        .string()
        .optional()
        .describe(
          "Absolute path to project directory. If the URL port has no server running, peekaboo will run npm run dev here."
        ),
      fullPage: z
        .boolean()
        .default(false)
        .optional()
        .describe("Capture full scrollable page, not just viewport"),
    },
    async (params) => {
      const result = await takeScreenshot({
        url: params.url,
        selector: params.selector,
        viewport: params.viewport,
        fullPage: params.fullPage ?? false,
        projectDir: params.projectDir,
      });

      return {
        content: [
          {
            type: "image" as const,
            data: result.base64,
            mimeType: "image/png" as const,
          },
          {
            type: "text" as const,
            text: JSON.stringify(result.metadata, null, 2),
          },
        ],
      };
    }
  );

  // Cleanup on exit
  const cleanup = () => {
    cleanupDevServer();
    closeBrowser().catch(() => {});
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
