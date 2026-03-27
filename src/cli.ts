import { takeScreenshot, closeBrowser } from "./screenshot.js";
import { cleanupDevServer } from "./dev-server.js";
import type { ScreenshotOptions } from "./types.js";

function parseArgs(argv: string[]): ScreenshotOptions {
  const args = argv.slice(2).filter((a) => a !== "--mcp");
  const options: ScreenshotOptions = { url: "http://localhost:3000" };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--url":
        options.url = args[++i];
        break;
      case "--wait-for-selector":
        options.selector = args[++i];
        break;
      case "--viewport": {
        const [w, h] = args[++i].split("x").map(Number);
        options.viewport = { width: w, height: h };
        break;
      }
      case "--full-page":
        options.fullPage = true;
        break;
      case "--project-dir":
        options.projectDir = args[++i];
        break;
    }
  }

  return options;
}

export async function runCli(): Promise<void> {
  const options = parseArgs(process.argv);

  try {
    const result = await takeScreenshot(options);
    // Output JSON with base64 image and metadata
    console.log(JSON.stringify(result, null, 2));
  } finally {
    cleanupDevServer();
    await closeBrowser();
  }
}
