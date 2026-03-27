export interface ScreenshotOptions {
  url: string;
  selector?: string;
  viewport?: { width: number; height: number };
  fullPage?: boolean;
  projectDir?: string;
}

export interface ScreenshotResult {
  base64: string;
  metadata: {
    url: string;
    pageTitle: string;
    viewport: { width: number; height: number };
    timestamp: string;
  };
}
