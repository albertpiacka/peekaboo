import { describe, it, expect } from "vitest";
import net from "node:net";

// Test the port-checking logic directly
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

describe("dev-server", () => {
  describe("isPortListening", () => {
    it("should return false for a port with nothing running", async () => {
      // Use a random high port unlikely to be in use
      const result = await isPortListening(59123);
      expect(result).toBe(false);
    });

    it("should return true for an active port", async () => {
      const server = net.createServer();
      await new Promise<void>((resolve) => server.listen(0, resolve));
      const port = (server.address() as net.AddressInfo).port;

      const result = await isPortListening(port);
      expect(result).toBe(true);

      await new Promise<void>((resolve) => server.close(() => resolve()));
    });
  });
});
