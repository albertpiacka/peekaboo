const isMcpMode = process.argv.includes("--mcp");

if (isMcpMode) {
  const { startMcpServer } = await import("./mcp-server.js");
  await startMcpServer();
} else {
  const { runCli } = await import("./cli.js");
  await runCli();
}
