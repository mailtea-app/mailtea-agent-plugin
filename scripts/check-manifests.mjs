#!/usr/bin/env node
/**
 * Cross-client manifest checks for the Mailtea Agent Plugin.
 *
 * agent-plugin/ is ONE plugin root shared by every client: the portable Agent
 * Plugins manifest (plugin.json + mcp.json) plus a per-client manifest
 * directory beside it (.codex-plugin, .claude-plugin, .cursor-plugin,
 * .grok-plugin) and two single-file manifests (gemini-extension.json for the
 * Gemini CLI, server.json for the MCP Registry). Nothing here may drift: a
 * client that reads a stale name, version, description, path, or MCP URL ships
 * a plugin that does not match what the others install.
 *
 * No dependencies, no network. Run: node agent-plugin/scripts/check-manifests.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..");

let failed = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failed += 1;
};
const ok = (msg) => console.log(`ok: ${msg}`);

const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const exists = (path) => {
  try {
    statSync(join(root, path));
    return true;
  } catch {
    return false;
  }
};

const MCP_URL = "https://api.mailtea.app/mcp";

// ---------------------------------------------------------------- identity --

const portable = readJson("plugin.json");
const { name, version, description } = portable;

if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) fail(`plugin.json version is not semver: ${version}`);
else ok(`portable manifest ${name}@${version}`);

// Every client manifest that carries identity fields must carry the SAME ones.
// The Codex listing keeps its long marketing copy under interface.longDescription.
const identity = [
  { file: ".codex-plugin/plugin.json", fields: ["name", "version", "description"] },
  { file: ".claude-plugin/plugin.json", fields: ["name", "version", "description"] },
  { file: ".cursor-plugin/plugin.json", fields: ["name", "version", "description"] },
  { file: ".grok-plugin/plugin.json", fields: ["name", "version", "description"] },
  { file: "gemini-extension.json", fields: ["name", "version", "description"] },
  { file: "server.json", fields: ["version", "description"] },
];

for (const { file, fields } of identity) {
  if (!exists(file)) {
    fail(`missing manifest: ${file}`);
    continue;
  }
  const manifest = readJson(file);
  for (const field of fields) {
    const expected = portable[field];
    if (manifest[field] !== expected) {
      fail(`${file}: ${field} is ${JSON.stringify(manifest[field])}, expected ${JSON.stringify(expected)}`);
    }
  }
  ok(`${file} shares name/version/description`);
}

// The MCP Registry namespaces a server in reverse DNS under a domain Mailtea
// controls. mailtea.app -> app.mailtea, NOT com.mailtea (unverifiable).
const server = readJson("server.json");
if (server.name !== "app.mailtea/mailtea") fail(`server.json name must be app.mailtea/mailtea, got ${server.name}`);
else ok("server.json registry namespace");

// ------------------------------------------------------------------- paths --

// Every path a manifest points at must exist, or the client silently loads a
// plugin with no skills, no icon, or no MCP server.
const referencedPaths = [
  ["plugin.json (fixed location)", "skills"],
  ["plugin.json (fixed location)", "mcp.json"],
  [".codex-plugin/plugin.json skills", readJson(".codex-plugin/plugin.json").skills],
  [".codex-plugin/plugin.json mcpServers", readJson(".codex-plugin/plugin.json").mcpServers],
  [".cursor-plugin/plugin.json skills", readJson(".cursor-plugin/plugin.json").skills],
  [".cursor-plugin/plugin.json mcpServers", readJson(".cursor-plugin/plugin.json").mcpServers],
  [".claude-plugin/plugin.json logo", readJson(".claude-plugin/plugin.json").logo],
  [".cursor-plugin/plugin.json logo", readJson(".cursor-plugin/plugin.json").logo],
  [".grok-plugin/plugin.json logo", readJson(".grok-plugin/plugin.json").logo],
];

const codexInterface = readJson(".codex-plugin/plugin.json").interface ?? {};
for (const key of ["composerIcon", "logo"]) {
  referencedPaths.push([`.codex-plugin/plugin.json interface.${key}`, codexInterface[key]]);
}
for (const shot of codexInterface.screenshots ?? []) {
  referencedPaths.push([".codex-plugin/plugin.json interface.screenshots", shot]);
}
if (readJson("gemini-extension.json").contextFileName) {
  referencedPaths.push(["gemini-extension.json contextFileName", readJson("gemini-extension.json").contextFileName]);
}

for (const [label, path] of referencedPaths) {
  if (typeof path !== "string" || path === "") {
    fail(`${label}: not a path (${JSON.stringify(path)})`);
    continue;
  }
  if (path.includes("..")) fail(`${label}: path escapes the plugin root (${path})`);
  if (!exists(path)) fail(`${label}: ${path} does not exist`);
  else ok(`${label} -> ${path}`);
}

// ------------------------------------------------------------- marketplaces --

// One package at the plugin root means every marketplace entry resolves to ".".
const marketplaces = [
  [".agents/plugins/marketplace.json", (m) => m.plugins?.[0]?.source?.path, ["."]],
  [".claude-plugin/marketplace.json", (m) => m.plugins?.[0]?.source, ["./", "."]],
  [".cursor-plugin/marketplace.json", (m) => m.plugins?.[0]?.source, ["./", "."]],
  [".grok-plugin/marketplace.json", (m) => m.plugins?.[0]?.source?.path, ["."]],
];

for (const [file, pick, allowed] of marketplaces) {
  if (!exists(file)) {
    fail(`missing marketplace: ${file}`);
    continue;
  }
  const manifest = readJson(file);
  const entry = manifest.plugins?.[0];
  if (entry?.name !== name) fail(`${file}: plugin name is ${entry?.name}, expected ${name}`);
  // A marketplace entry MAY carry its own version — Cursor's does — and that
  // is the version the listing shows. A stale one advertises a release nobody
  // can install, which is the same drift the identity block above catches for
  // the client manifests. Optional, so checked only when present.
  if (entry?.version !== undefined && entry.version !== version) {
    fail(
      `${file}: plugin version is ${JSON.stringify(entry.version)}, expected ${JSON.stringify(version)}`
    );
  }
  const source = pick(manifest);
  if (!allowed.includes(source)) {
    fail(`${file}: plugin source is ${JSON.stringify(source)}, expected one of ${allowed.join(" / ")}`);
  } else ok(`${file} resolves the package root`);
}

// -------------------------------------------------------------------- skills --

// Agent Plugins 1.0.0 §6.1: skills are discovered at skills/, one directory
// deep, each with a SKILL.md. Agent Skills requires name + description
// frontmatter — a skill missing either is skipped by the client, silently.
const skillsDir = join(root, "skills");
let skillNames = [];
try {
  skillNames = readdirSync(skillsDir).filter((entry) => statSync(join(skillsDir, entry)).isDirectory());
} catch {
  fail("skills/ is not a directory");
}
if (skillNames.length === 0) fail("no skills found under skills/");

for (const skill of skillNames) {
  const relative = join("skills", skill, "SKILL.md");
  if (!exists(relative)) {
    fail(`${relative} is missing`);
    continue;
  }
  const body = readFileSync(join(root, relative), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(body);
  if (!match) {
    fail(`${relative}: no YAML frontmatter`);
    continue;
  }
  const frontmatter = match[1];
  const missing = ["name", "description"].filter((key) => !new RegExp(`^${key}:\\s*\\S`, "m").test(frontmatter));
  if (missing.length > 0) fail(`${relative}: frontmatter missing ${missing.join(", ")}`);
  else ok(`skill ${skill} (frontmatter name + description)`);
}

// The skills are client-neutral: the package installs into many clients, so no
// SKILL.md may instruct the user in terms of one of them.
for (const skill of skillNames) {
  const body = readFileSync(join(root, "skills", skill, "SKILL.md"), "utf8");
  for (const line of body.split("\n")) {
    if (/\bin Codex\b/i.test(line)) fail(`skills/${skill}/SKILL.md: Codex-only instruction: ${line.trim()}`);
  }
}

// ---------------------------------------------------------------- MCP URLs --

// Four files declare the same endpoint in four dialects. They must agree, and
// none of them may carry a credential: the hosted server negotiates OAuth.
const endpoints = [
  ["mcp.json", readJson("mcp.json").mcpServers?.mailtea, "streamable-http", (s) => s?.url],
  [".mcp.json", readJson(".mcp.json").mcpServers?.mailtea, "http", (s) => s?.url],
  [".claude-plugin/plugin.json", readJson(".claude-plugin/plugin.json").mcpServers?.mailtea, "http", (s) => s?.url],
  ["gemini-extension.json", readJson("gemini-extension.json").mcpServers?.mailtea, undefined, (s) => s?.httpUrl],
  ["server.json", server.remotes?.[0], "streamable-http", (s) => s?.url],
];

for (const [file, entry, type, pickUrl] of endpoints) {
  if (!entry) {
    fail(`${file}: no mailtea MCP server entry`);
    continue;
  }
  const before = failed;
  if (type !== undefined && entry.type !== type) fail(`${file}: transport is ${entry.type}, expected ${type}`);
  const url = pickUrl(entry);
  if (url !== MCP_URL) fail(`${file}: MCP url is ${url}, expected ${MCP_URL}`);
  for (const [header, value] of Object.entries(entry.headers ?? {})) {
    if (/authorization|api[_-]?key|token|secret|password/i.test(header) || /mt_pat_|Bearer\s+\S+/i.test(String(value))) {
      fail(`${file}: credential in MCP headers (${header})`);
    }
  }
  if (failed === before) ok(`${file} -> ${MCP_URL}`);
}

// The portable mcp.json must declare the Agent Plugins schema; §7.2.2 disables
// MCP for the whole plugin when it targets a different version than plugin.json.
if (readJson("mcp.json").$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
  fail("mcp.json $schema must be the Agent Plugins 1.0.0 MCP schema");
}
if (portable.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
  fail("plugin.json $schema must be the Agent Plugins 1.0.0 plugin schema");
}

// -------------------------------------------------------------- changelog --

// The mirror's git tag IS the release and its notes come from this file, so a
// version with no section releases with an empty body.
try {
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
  if (!new RegExp(`^## ${version.replace(/\./g, "\\.")}\\b`, "m").test(changelog)) {
    fail(`CHANGELOG.md has no "## ${version}" section`);
  } else ok(`CHANGELOG.md covers ${version}`);
} catch {
  fail("missing CHANGELOG.md (release notes come from it)");
}

if (failed > 0) {
  console.error(`\n${failed} manifest check(s) failed`);
  process.exit(1);
}
console.log("\nagent-plugin manifest checks passed");
