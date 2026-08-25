/* Offline smoke: start the stdio server, initialize, list tools, and call
 * the tool without a key (expects the friendly no-key error). No network,
 * no credentials. */

import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const child = spawn(process.execPath, [path.join(root, 'server.mjs')], {
  env: { ...process.env, ASTROFABRIC_API_KEY: '' },
  stdio: ['pipe', 'pipe', 'pipe'],
});

const pending = new Map();
let buffer = '';
child.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});

let nextId = 1;
function rpc(method, params) {
  const id = nextId++;
  const req = { jsonrpc: '2.0', id, method, ...(params ? { params } : {}) };
  child.stdin.write(JSON.stringify(req) + '\n');
  return new Promise((resolve, reject) => {
    pending.set(id, resolve);
    setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 10_000);
  });
}

const init = await rpc('initialize', {
  protocolVersion: '2025-03-26',
  capabilities: {},
  clientInfo: { name: 'smoke', version: '0.0.0' },
});
assert.equal(init.result.serverInfo.name, 'astrofabric');
console.log('ok - initialize');

child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

const tools = await rpc('tools/list');
const names = tools.result.tools.map((t) => t.name);
assert.deepEqual(names, ['mission_agent']);
const tool = tools.result.tools[0];
assert.ok(tool.description.includes('thread_id'), 'description explains thread continuation');
assert.ok(tool.inputSchema.properties.objective, 'objective in schema');
console.log('ok - tools/list exposes mission_agent with schema');

const call = await rpc('tools/call', { name: 'mission_agent', arguments: { objective: 'Say hello to the smoke test.' } });
assert.equal(call.result.isError, true);
assert.match(call.result.content[0].text, /ASTROFABRIC_API_KEY/);
console.log('ok - keyless call returns the setup hint');

child.kill();
console.log('\nall stdio smoke checks passed');
