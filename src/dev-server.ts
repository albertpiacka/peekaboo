import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import fs from "node:fs";
import path from "node:path";

let managedProcess: ChildProcess | null = null;

function isPortListening(port: number, host = "127.0.0.1"): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host, timeout: 1000 });
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForPort(
  port: number,
  timeoutMs = 30_000,
  intervalMs = 500
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortListening(port)) return;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(
    `Timed out waiting for port ${port} after ${timeoutMs / 1000}s`
  );
}

export async function ensureServerRunning(
  port: number,
  projectDir: string
): Promise<void> {
  if (await isPortListening(port)) return;

  const pkgPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`No package.json found in ${projectDir}`);
  }

  console.error(`[peekaboo] Starting dev server in ${projectDir}...`);

  managedProcess = spawn("npm", ["run", "dev"], {
    cwd: projectDir,
    stdio: "pipe",
    detached: false,
  });

  managedProcess.stderr?.on("data", (data: Buffer) => {
    console.error(`[dev-server] ${data.toString().trimEnd()}`);
  });

  managedProcess.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`[peekaboo] Dev server exited with code ${code}`);
    }
    managedProcess = null;
  });

  await waitForPort(port);
  console.error(`[peekaboo] Dev server ready on port ${port}`);
}

export function cleanupDevServer(): void {
  if (managedProcess) {
    managedProcess.kill("SIGTERM");
    managedProcess = null;
  }
}
