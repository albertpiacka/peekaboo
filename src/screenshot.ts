import { chromium, type Browser } from "playwright";
import type { ScreenshotOptions, ScreenshotResult } from "./types.js";
import { ensureServerRunning } from "./dev-server.js";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function takeScreenshot(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  const viewport = options.viewport ?? { width: 1280, height: 720 };

  // Auto-start dev server if projectDir is provided
  if (options.projectDir) {
    const url = new URL(options.url);
    const port = parseInt(url.port) || (url.protocol === "https:" ? 443 : 80);
    await ensureServerRunning(port, options.projectDir);
  }

  const instance = await getBrowser();
  const context = await instance.newContext({ viewport });

  try {
    const page = await context.newPage();
    await page.goto(options.url, { waitUntil: "networkidle" });

    if (options.selector) {
      await page.waitForSelector(options.selector, { timeout: 10_000 });
    }

    const buffer = await page.screenshot({
      fullPage: options.fullPage ?? false,
      type: "png",
    });

    const pageTitle = await page.title();

    return {
      base64: buffer.toString("base64"),
      metadata: {
        url: options.url,
        pageTitle,
        viewport,
        timestamp: new Date().toISOString(),
      },
    };
  } finally {
    await context.close();
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
