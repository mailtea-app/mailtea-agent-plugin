# Changelog

All notable changes to the Mailtea Agent Plugin are documented here.

The plugin ships as a git tag on
[mailtea-agent-plugin](https://github.com/mailtea-app/mailtea-agent-plugin) —
there is no npm or PyPI package — so `v<version>` here is what a client pins.

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
