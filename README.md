<p align="center">
  <img src="assets/logo.png" width="120" alt="AstroFabric" />
</p>

# AstroFabric MCP Server

<p>
  <a href="https://glama.ai/mcp/servers/sam1siam/astrofabric-mcp"><img src="https://glama.ai/mcp/servers/sam1siam/astrofabric-mcp/badges/score.svg" alt="AstroFabric MCP server score on Glama" /></a>
  <a href="https://mcpservers.org/servers/www-astrofabric-ai-docs"><img src="https://mcpservers.org/badge.svg" alt="Listed on mcpservers.org" /></a>
  <a href="https://lobehub.com/mcp/sam1siam-astrofabric-mcp"><img src="https://lobehub.com/badge/mcp/sam1siam-astrofabric-mcp" alt="AstroFabric on LobeHub" /></a>
  <a href="https://www.npmjs.com/package/astrofabric"><img src="https://img.shields.io/npm/v/astrofabric?label=CLI%20on%20npm&color=2a78d6" alt="AstroFabric CLI on npm" /></a>
  <a href="https://www.astrofabric.ai/docs"><img src="https://img.shields.io/badge/docs-astrofabric.ai-2a78d6" alt="Docs" /></a>
</p>

**AstroFabric** is an agentic AI platform: autonomous agents that carry work across growth, revenue and digital operations from objective to outcome. This MCP server puts the whole platform behind your editor - give it an open-ended objective in plain language and it plans and executes the mission: market and competitive intelligence, site and technical audits, verified prospect lists from live buying signals, outbound, content and demand plans, finished creative from images and video to designed pages, and delivery into 100+ connected apps - returning the finished result with the evidence behind it.

This repository is both the connector for the **hosted** AstroFabric MCP endpoint (add the remote URL with your API key and start working) and a runnable **stdio server** for clients that prefer a local process - see [Run it locally](#run-it-locally-stdio).

- Website: https://www.astrofabric.ai
- Endpoint: `https://www.astrofabric.ai/api/mcp` (Streamable HTTP)
- Docs: https://www.astrofabric.ai/docs

## Prerequisites

1. An AstroFabric workspace on a paid plan - sign up at https://www.astrofabric.ai
2. An API key: in the AstroFabric console, open **API keys** → **Create key**, and copy the `ek_live_...` token (it is shown once).

## Setup

Every client uses the same endpoint (`https://www.astrofabric.ai/api/mcp`) and the same key. Pick yours:

<details>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add --transport http astrofabric https://www.astrofabric.ai/api/mcp --header "Authorization: Bearer ek_live_YOUR_KEY_HERE"
```

</details>

<details>
<summary><b>claude.ai / Claude Desktop</b> (OAuth - no key needed)</summary>

Add a custom connector with the bare URL and sign in when prompted - the server walks you through AstroFabric sign-in and hands the client a scoped key you can revoke from the console:

```
https://www.astrofabric.ai/api/mcp
```

</details>

<details>
<summary><b>Cursor</b></summary>

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "astrofabric": {
      "url": "https://www.astrofabric.ai/api/mcp",
      "headers": { "Authorization": "Bearer ek_live_YOUR_KEY_HERE" }
    }
  }
}
```

</details>

<details>
<summary><b>Cline</b></summary>

Add to `cline_mcp_settings.json` (Cline → MCP Servers → Configure, or *Remote Servers* → add by URL):

```json
{
  "mcpServers": {
    "astrofabric": {
      "type": "streamableHttp",
      "url": "https://www.astrofabric.ai/api/mcp",
      "headers": {
        "Authorization": "Bearer ek_live_YOUR_KEY_HERE"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

</details>

<details>
<summary><b>VS Code (Copilot agent mode)</b></summary>

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "astrofabric": {
      "type": "http",
      "url": "https://www.astrofabric.ai/api/mcp",
      "headers": { "Authorization": "Bearer ek_live_YOUR_KEY_HERE" }
    }
  }
}
```

</details>

<details>
<summary><b>Codex</b></summary>

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.astrofabric]
url = "https://www.astrofabric.ai/api/mcp"
http_headers = { "Authorization" = "Bearer ek_live_YOUR_KEY_HERE" }
```

</details>

<details>
<summary><b>Gemini CLI</b></summary>

Add to `~/.gemini/settings.json` under `mcpServers`:

```json
{
  "astrofabric": {
    "httpUrl": "https://www.astrofabric.ai/api/mcp",
    "headers": { "Authorization": "Bearer ek_live_YOUR_KEY_HERE" }
  }
}
```

</details>

<details>
<summary><b>Windsurf</b></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "astrofabric": {
      "serverUrl": "https://www.astrofabric.ai/api/mcp",
      "headers": { "Authorization": "Bearer ek_live_YOUR_KEY_HERE" }
    }
  }
}
```

</details>

Shortcut: with the [CLI](#prefer-a-terminal-the-cli) installed, `astrofabric connect <client>` prints your client's config with your key already filled in.

If your client cannot send headers, the key can ride the URL instead: `https://www.astrofabric.ai/api/mcp?key=ek_live_YOUR_KEY_HERE` - treat that whole URL as a secret.

### Two tool surfaces

- **Default** (the URL above): one tool, `mission_agent` - the autonomous mission runner. Best for editors: one entry in your tool list, the whole platform behind it.
- **Full catalog**: append `?tools=all` to the URL to also expose every individual data and execution tool (SEO and keyword intelligence, ad libraries, buyer-intent search, email finding and verification, creative generation, and more), plus any MCP servers your workspace has connected.

## Using it

Ask for outcomes, not steps:

> "Build a list of 40 companies showing buying intent on warehouse robotics, verify emails, and draft a first touch for each."

> "Tear down competitor.com - ads, keywords, hiring, positioning - and give me the three plays to take ground."

Results start with a `[thread:<id>]` line. Pass that id as `thread_id` on follow-ups ("verify those emails", "format them for LinkedIn Ads") and the agent continues with full memory of everything already asked and delivered. It may reply with a clarifying question; answer it the same way.

## Run it locally (stdio)

This repository is also a runnable stdio MCP server - the same `mission_agent` tool, executing missions through the AstroFabric platform with your key. For clients that prefer a local process over a remote URL:

```json
{
  "mcpServers": {
    "astrofabric": {
      "command": "npx",
      "args": ["-y", "github:sam1siam/astrofabric-mcp"],
      "env": { "ASTROFABRIC_API_KEY": "ek_live_YOUR_KEY_HERE" }
    }
  }
}
```

Or with Docker: `docker build -t astrofabric-mcp . && docker run -i --rm -e ASTROFABRIC_API_KEY=ek_live_... astrofabric-mcp`

## Prefer a terminal? The CLI

The same platform ships as a zero-dependency CLI ([`astrofabric` on npm](https://www.npmjs.com/package/astrofabric)):

```bash
npm install -g astrofabric

astrofabric login --key ek_live_...
astrofabric run "Audit example.com and list the top 5 fixes"
```

In a coding agent (Claude Code, Codex, Gemini CLI), the whole setup is one prompt: *"Install the AstroFabric CLI for me, then run `astrofabric docs` to learn it."* And `astrofabric connect cursor` (or `claude-code`, `codex`, `gemini`, `vscode`, `windsurf`) prints ready-to-paste MCP config per client.

## Notes

- Missions bill against your workspace's credits; the console's Usage page shows every run.
- Writes to connected systems honor your workspace's approval settings - autonomous writes can be gated to a human approval queue.
- OAuth 2.1 (dynamic client registration + PKCE) is also supported via standard discovery, for clients that prefer sign-in over keys.

## License

The contents of this connector repository are MIT licensed. The AstroFabric platform is a commercial service.
