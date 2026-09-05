#!/usr/bin/env node
/* AstroFabric MCP server (stdio).
 *
 * A first-party local server for clients that prefer stdio over the hosted
 * Streamable HTTP endpoint. It exposes the same single tool as the hosted
 * default surface - mission_agent - and executes missions through the
 * AstroFabric API with your key.
 *
 * Auth: set ASTROFABRIC_API_KEY (an ek_live_... key from the console's API
 * keys page). The server starts and lists its tool without a key; running a
 * mission requires one.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE_URL = (process.env.ASTROFABRIC_BASE_URL ?? 'https://www.astrofabric.ai').replace(/\/+$/, '');
const MISSION_TIMEOUT_MS = 720_000; // sync missions can legitimately run for minutes

const server = new McpServer({ name: 'astrofabric', version: '1.1.1' });

const errText = (text) => ({ content: [{ type: 'text', text }], isError: true });

server.registerTool(
  'mission_agent',
  {
    title: 'Mission Agent (autonomous missions)',
    annotations: {
      title: 'Mission Agent (autonomous missions)',
      readOnlyHint: false,
      // Missions can write to connected systems under workspace approval settings.
      destructiveHint: true,
      openWorldHint: true,
    },
    description:
      "Give AstroFabric a business intelligence objective in plain language. It plans and executes a data mission: discover companies and contacts, verify emails, enrich records, research business signals, score account fit, build lists and audiences, and deliver results into connected systems under workspace budgets and approval settings. The result starts with a [thread:<id>] line; pass that id as thread_id on follow-ups to continue the mission. It may reply with a clarifying question; answer it the same way.",
    inputSchema: {
      objective: z
        .string()
        .min(5)
        .max(4000)
        .describe('What to accomplish, e.g. "Build a list of 100 companies showing high interest in building insulation"'),
      thread_id: z
        .string()
        .max(40)
        .optional()
        .describe('The thread id from a previous result, to continue that mission with full memory'),
    },
  },
  async ({ objective, thread_id }) => {
    const key = process.env.ASTROFABRIC_API_KEY;
    if (!key) {
      return errText(
        'ASTROFABRIC_API_KEY is not set. Mint a key in the AstroFabric console (your workspace > API keys) and set it in this server\'s environment.',
      );
    }
    let res;
    try {
      res = await fetch(`${BASE_URL}/api/v1/agent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objective, ...(thread_id ? { thread_id } : {}) }),
        signal: AbortSignal.timeout(MISSION_TIMEOUT_MS),
      });
    } catch (e) {
      if (e?.name === 'TimeoutError') {
        return errText('The mission is taking unusually long. Its reply lands on the thread - retry with the same thread_id in a minute.');
      }
      return errText(`Could not reach the AstroFabric API: ${e?.message ?? e}`);
    }
    let body = null;
    try {
      body = await res.json();
    } catch {
      /* fall through to the status-based message */
    }
    if (!res.ok || body?.ok === false) {
      const detail = body?.error ?? `HTTP ${res.status}`;
      if (res.status === 401) return errText(`The API key was rejected (${detail}). Mint a fresh key in the console's API keys page.`);
      if (res.status === 402) return errText(`Workspace credits are exhausted: ${detail}`);
      return errText(`Mission failed: ${detail}`);
    }
    const prefix = body.thread_id ? `[thread:${body.thread_id}]\n\n` : '';
    return { content: [{ type: 'text', text: `${prefix}${body.reply ?? ''}` }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
if (!process.env.ASTROFABRIC_API_KEY) {
  console.error('[astrofabric-mcp] running without ASTROFABRIC_API_KEY - tools list fine, missions will ask for a key');
}
