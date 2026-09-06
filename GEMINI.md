# Mailtea

Mailtea is an email platform: transactional sends, newsletters, contacts,
templates, automations, and a public website per publication. This extension
connects the hosted Mailtea MCP server at `https://api.mailtea.app/mcp` and
bundles three skills under `skills/`.

- `mailtea` — send and schedule email, check delivery, manage contacts and
  segments, draft and send newsletters.
- `mailtea-email-design` — how an email should look and survive real inboxes;
  the structured ops path, the email-safe HTML contract, and the render/QA loop.
- `mailtea-site-design` — the publication's public website: pages, section
  presets, theme, draft then publish.

Connect Mailtea through your agent client's browser sign-in. Never ask the user
to paste a token or password into the conversation.

Before sending, call `auth.me` and `publication.list`, then confirm the sender,
recipients, subject, and body with the user. A draft request stays a draft. An
email ID means the send was accepted, not that it reached an inbox — check
`email.get` for delivery status.
