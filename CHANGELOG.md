# Changelog

All notable changes to the Mailtea Agent Plugin are documented here.

The plugin ships as a git tag on
[mailtea-agent-plugin](https://github.com/mailtea-app/mailtea-agent-plugin) —
there is no npm or PyPI package — so `v<version>` here is what a client pins.

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
