# Mailtea Agent Plugin

Portable [Agent Plugins](https://agent-plugins.org/) package for Mailtea — one directory that any compatible client can load for **skills** and the **Mailtea MCP server**.

Spec target: **Agent Plugins 1.0.0**.

## Layout

```text
mailtea/                         # this package (mirrored as mailtea-agent-plugin)
├── plugin.json                  # required portable manifest
├── mcp.json                     # portable MCP server config
├── skills/
│   ├── mailtea/SKILL.md         # send / schedule / manage email & newsletters
│   ├── mailtea-email-design/    # email-safe design (ops + HTML)
│   └── mailtea-site-design/     # publication website builder
├── README.md
└── LICENSE
```

## What this plugin gives an agent

| Component | Role |
|-----------|------|
| **MCP (`mailtea-mcp`)** | Tool catalog over stdio — `email.*`, `issue.*`, `contact.*`, `template.*`, `automation.*`, `site.*`, analytics, domains, webhooks, … |
| **`mailtea` skill** | When and how to send transactional email, batches, newsletters, contacts, segments |
| **`mailtea-email-design` skill** | How the email should look — structured ops (preferred) or hand-written email-safe HTML |
| **`mailtea-site-design` skill** | Public publication site: pages, presets, theme, draft → publish |

Auth is **client-managed** (Agent Plugins does not put secrets in `mcp.json`). Create a personal access token (`mt_pat_…`) in **Settings → API keys**, then inject `MAILTEA_API_TOKEN` (and optionally `MAILTEA_PUBLICATION_ID` / `MAILTEA_API_BASE_URL`) into the MCP process via your client’s env/UI.

## Install / load

Compatible Agent Plugins clients (at 1.0.0 launch): **Cursor**, **ChatGPT / Codex**, **GitHub Copilot**, **VS Code**, **Kiro**. Each client owns installation UX — point it at this directory (or the published `mailtea-agent-plugin` mirror) the same way you install any other Agent Plugin.

Until your client’s marketplace lists Mailtea, clone or copy this folder and enable it locally:

```bash
git clone https://github.com/mailtea-app/mailtea-agent-plugin.git
# Then add the cloned directory in your client’s Plugins / Agent Plugins UI.
```

Set the MCP env your client asks for:

| Variable | Required | Purpose |
|----------|:--------:|---------|
| `MAILTEA_API_TOKEN` | yes | PAT (`mt_pat_…`) or session token |
| `MAILTEA_PUBLICATION_ID` | no | Default publication scope |
| `MAILTEA_API_BASE_URL` | no | Defaults to Mailtea cloud; use `http://localhost:7787` for local API |

### Without Agent Plugins (still works)

Skills-only and MCP-only paths remain supported:

```bash
# MCP (Claude Code example)
claude mcp add mailtea -e MAILTEA_API_TOKEN=mt_pat_xxx -- npx -y mailtea-mcp

# Skills only — copy from https://github.com/mailtea-app/mailtea-agent-skills
```

### Remote MCP (client-configured)

`mcp.json` ships the **stdio** transport (`npx -y mailtea-mcp`). For remote Streamable HTTP, configure your client separately (do not put Bearer tokens in portable package files):

```text
https://api.mailtea.app/mcp
Authorization: Bearer mt_pat_…
```

## Which Mailtea areas this covers

The reusable plugin is the agent-facing surface for these product areas:

1. **Transactional email** — send, batch, schedule, cancel, resend, delivery/open/click status  
2. **Newsletters / issues** — draft, ops edits, preview, schedule, send, web publish  
3. **Email design & templates** — structured blocks, lint, reusable templates + versions  
4. **Audience** — contacts, properties, segments, tags, suppressions, CSV import  
5. **Automations & events** — multi-step journeys, custom event ingest  
6. **Publication website** — pages, section presets, theme, draft/publish  
7. **Infrastructure** — sending domains, DNS verify, API keys, webhooks, analytics  

It does **not** replace Mailtea Studio (the human dashboard) or the typed SDKs/CLI for application code — those stay first-class for operators and developers. Use the plugin when an **AI agent client** should operate the same control plane.

## Authoring notes (monorepo)

Canonical skill sources live under `skills/` in the Mailtea monorepo. Refresh the copies here with:

```bash
bash scripts/sync-agent-plugin-skills.sh
```

Do not add client-only hooks, commands, or marketplace metadata to the top level of `plugin.json`. Put those under a reverse-domain `extensions` key or a client-owned directory per [client extensions](https://agent-plugins.org/plugin-authors/client-extensions).

## Related

- Spec: [agent-plugins.org](https://agent-plugins.org/) · [Build a plugin](https://agent-plugins.org/plugin-authors)
- MCP package: [`mailtea-mcp`](https://www.npmjs.com/package/mailtea-mcp)
- Skills-only mirror: [mailtea-agent-skills](https://github.com/mailtea-app/mailtea-agent-skills)
- Docs: [`docs/agent-plugin.md`](../docs/agent-plugin.md) (in the monorepo)

## License

[MIT](./LICENSE)
