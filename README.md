# agent-peekaboo

MCP screenshot server for AI agent workflows. Lets agents visually inspect running web apps — take screenshots, verify UI, and keep the build loop going.

## What it does

- Takes screenshots of web pages and returns base64 PNG + metadata
- Auto-detects and starts a local dev server if none is running
- Works as an MCP tool (for Claude Code, etc.) or as a standalone CLI
- Zero config — point it at a URL and go

## Install

```bash
npm install -g agent-peekaboo
```

## Usage

### CLI

```bash
# Screenshot a running site
peekaboo --url http://localhost:3000

# Wait for a specific element
peekaboo --url http://localhost:3000 --wait-for-selector "#app"

# Custom viewport
peekaboo --url http://localhost:3000 --viewport 1920x1080

# Full page capture
peekaboo --url http://localhost:3000 --full-page

# Auto-start dev server if not running
peekaboo --url http://localhost:3000 --project-dir /path/to/project
```

Output is JSON with `base64` (the image) and `metadata` (URL, page title, viewport, timestamp).

### MCP server

Register in your MCP config (e.g. `claude_desktop_config.json` or `.claude/settings`):

```json
{
  "mcpServers": {
    "screenshot": {
      "command": "npx",
      "args": ["agent-peekaboo", "--mcp"]
    }
  }
}
```

This exposes a `screenshot` tool that agents can call with:

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | URL to screenshot (required) |
| `selector` | string | CSS selector to wait for before capture |
| `viewport` | object | `{ width, height }` — default 1280×720 |
| `fullPage` | boolean | Capture full scrollable page |
| `projectDir` | string | Path to project — auto-starts `npm run dev` if port is not listening |

## The problem this solves

Playwright can already take screenshots, but there's no zero-config, agent-optimized tool that handles the full "start server → wait → screenshot → return image to agent" loop as a proper MCP tool. Agents shouldn't need to wrangle bash scripts to see what they built.

## Development

```bash
pnpm install
pnpm run build
pnpm test
```

## License

MIT
