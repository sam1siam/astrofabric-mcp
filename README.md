<p align="center">
  <img src="assets/logo.png" width="120" alt="AstroFabric" />
</p>

# AstroFabric MCP Server

**AstroFabric** is an agentic AI platform: autonomous agents that carry work across growth, revenue and digital operations from objective to outcome. This MCP server puts the whole platform behind your editor - give it an open-ended objective in plain language and it plans and executes the mission: market and competitive intelligence, site and technical audits, verified prospect lists from live buying signals, outbound, content and demand plans, finished creative from images and video to designed pages, and delivery into 100+ connected apps - returning the finished result with the evidence behind it.

This repository is the connector for the **hosted** AstroFabric MCP endpoint. There is nothing to build or run locally: you add the remote server URL with your API key and start working.

- Website: https://www.astrofabric.ai
- Endpoint: `https://www.astrofabric.ai/api/mcp` (Streamable HTTP)
- Docs: https://www.astrofabric.ai/docs

## Prerequisites

1. An AstroFabric workspace on a paid plan - sign up at https://www.astrofabric.ai
2. An API key: in the AstroFabric console, open **API keys** → **Create key**, and copy the `ek_live_...` token (it is shown once).

## Setup for Cline

Add the server to your `cline_mcp_settings.json` (Cline → MCP Servers → Configure, or *Remote Servers* → add by URL):

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

If your client cannot send headers, the key can ride the URL instead: `https://www.astrofabric.ai/api/mcp?key=ek_live_YOUR_KEY_HERE` - treat that whole URL as a secret.

### Two tool surfaces

- **Default** (the URL above): one tool, `marketing_agent` - the autonomous mission runner. Best for editors: one entry in your tool list, the whole platform behind it.
- **Full catalog**: append `?tools=all` to the URL to also expose every individual data and execution tool (SEO and keyword intelligence, ad libraries, buyer-intent search, email finding and verification, creative generation, and more), plus any MCP servers your workspace has connected.

## Using it

Ask for outcomes, not steps:

> "Build a list of 40 companies showing buying intent on warehouse robotics, verify emails, and draft a first touch for each."

> "Tear down competitor.com - ads, keywords, hiring, positioning - and give me the three plays to take ground."

Results start with a `[thread:<id>]` line. Pass that id as `thread_id` on follow-ups ("verify those emails", "format them for LinkedIn Ads") and the agent continues with full memory of everything already asked and delivered. It may reply with a clarifying question; answer it the same way.

## Notes

- Missions bill against your workspace's credits; the console's Usage page shows every run.
- Writes to connected systems honor your workspace's approval settings - autonomous writes can be gated to a human approval queue.
- OAuth 2.1 (dynamic client registration + PKCE) is also supported via standard discovery, for clients that prefer sign-in over keys.

## License

The contents of this connector repository are MIT licensed. The AstroFabric platform is a commercial service.
