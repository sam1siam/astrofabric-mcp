# AstroFabric MCP - AI installation instructions

You are installing the **hosted** AstroFabric MCP server. There is nothing to clone, build, or run: it is a remote Streamable HTTP endpoint. Follow these steps exactly.

## Step 1 - ask the user for their API key

AstroFabric authenticates with a workspace API key. Ask the user:

> "Please paste your AstroFabric API key (it starts with `ek_live_`). You can create one in the AstroFabric console under **API keys → Create key** at https://www.astrofabric.ai"

Do not proceed without it. Never invent a key.

## Step 2 - add the server to the MCP settings

Add this entry to the MCP configuration file (for Cline: `cline_mcp_settings.json`), replacing `ek_live_YOUR_KEY_HERE` with the user's key:

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

Important details:

- `type` must be exactly `streamableHttp`. Omitting it can fall back to a legacy transport and fail.
- If this client cannot send custom headers, use the URL form instead and omit `headers`: `"url": "https://www.astrofabric.ai/api/mcp?key=ek_live_YOUR_KEY_HERE"`. Warn the user that this URL now contains their secret.
- Optional: append `?tools=all` to the URL to expose the full individual-tool catalog in addition to the mission agent.

## Step 3 - verify

Reload the MCP servers. The server `astrofabric` should connect and list one tool: `mission_agent` (or the full catalog when `?tools=all` was used).

If it fails to connect:

- `401` / "Invalid or revoked API key": the key is wrong, revoked, or has leading/trailing whitespace - ask the user to re-paste or mint a fresh one.
- `Rate limit exceeded`: wait a minute; the key's per-minute limit was hit.
- Any other connection error: confirm the URL is exactly `https://www.astrofabric.ai/api/mcp` and that `type` is `streamableHttp`.

## Step 4 - confirm success to the user

Tell the user the server is connected and give one example of what to try:

> "AstroFabric is connected. Try: 'Build a list of 20 companies showing buying intent on [their topic], with verified emails.' Results start with a [thread:<id>] line - keep passing that thread_id to continue the mission with full memory."
