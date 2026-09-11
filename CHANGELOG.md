# Changelog

All notable changes to the Mailtea Agent Plugin are documented here.

The plugin ships as a git tag on
[mailtea-agent-plugin](https://github.com/mailtea-app/mailtea-agent-plugin) —
there is no npm or PyPI package — so `v<version>` here is what a client pins.

## 0.3.1 (2026-09-11)

- The `mailtea-email` and `mailtea-site-design` skills no longer tell agents to
  supply a publication id. Every MCP tool now defaults it to the publication the
  connection is for, so the skills say to omit it and to ask which publication to
  use only when the connection actually reaches more than one.

## 0.3.0 (2026-09-06)

- Packaged Mailtea for every plugin client from a single package root. The
  repository root is the plugin root, and each client reads its own manifest
  beside the portable one: `.codex-plugin/` (Codex), `.claude-plugin/` (Claude
  Code), `.cursor-plugin/` (Cursor), `.grok-plugin/` (Grok Build),
  `gemini-extension.json` (Gemini CLI), and `server.json` (MCP Registry).
- Added a repository marketplace for Claude Code, Cursor, and Grok Build
  alongside the existing Codex one, so `<client> plugin marketplace add
  mailtea-app/mailtea-agent-plugin` works in each.
- Moved the Codex package from `plugins/mailtea/` to the repository root. There
  is now exactly one copy of each skill and one copy of the assets, instead of
  two.
- Switched the portable `mcp.json` to the hosted Streamable HTTP endpoint at
  `https://api.mailtea.app/mcp`, which signs in through the client's browser
  flow. The stdio `npx -y mailtea-mcp` transport stays documented for
  self-hosting and local development.
- Made the three skills client-neutral and added a per-client reconnect table,
  so the same text is correct in Codex, Claude Code, Cursor, VS Code, Kiro, and
  Grok Build.
- Added `scripts/check-manifests.mjs`, which fails the build when the manifests
  disagree on name, version, description, a referenced path, or the MCP URL.

## 0.2.1 (2026-09-06)

- Added a guided first-email starter, clearer skill names and descriptions, and two getting-started visuals.
- Added copyable example prompts, setup and permission guidance, and troubleshooting for first-time users.
- Made the Codex preview installation command explicit.

## 0.2.0 (2026-09-05)

- Added a Codex plugin at `plugins/mailtea/` with a native manifest, official Mailtea icon, three bundled skills, and hosted OAuth MCP at `https://api.mailtea.app/mcp`.
- Added a repository marketplace at `.agents/plugins/marketplace.json` for installation with `codex plugin marketplace add mailtea-app/mailtea-agent-plugin` and `codex plugin add mailtea@mailtea`.
- Kept the portable Agent Plugins manifest and stdio configuration available for other clients and self-hosted installations.
- Added Codex setup and email workflow guidance.

## 0.1.0 (2026-08-07)

- Added: the first portable [Agent Plugins](https://agent-plugins.org/) 1.0.0
  package for Mailtea. One directory a compatible client loads to get the
  Mailtea MCP server (`plugin.json` + `mcp.json`, stdio via `npx -y mailtea-mcp`)
  and three skills: `mailtea` (send, schedule, manage email and newsletters),
  `mailtea-email-design` (the structured ops path, the email-safe HTML contract,
  and the render/QA loop), and `mailtea-site-design` (pages, presets, theme,
  draft → publish for the publication website).
- Auth stays client-managed. `mcp.json` carries no credentials by design; the
  client injects `MAILTEA_API_TOKEN` (and optionally `MAILTEA_PUBLICATION_ID` /
  `MAILTEA_API_BASE_URL`) into the MCP process.
