# Mailtea for Codex

Send and schedule email, inspect delivery status, draft newsletters, manage
contacts, and design email and publication websites with Mailtea.

## Install

Requires a Codex version with `codex plugin` support, a Mailtea account, and a
verified sending domain to send email.

```bash
codex plugin marketplace add mailtea-app/mailtea-agent-plugin
codex plugin add mailtea@mailtea
```

Open a new Codex task after installing. Connect the Mailtea MCP server when Codex
requests authentication, sign in to Mailtea, and choose the publication and
permissions on the consent screen. The hosted server uses OAuth; no Node.js,
API key, or local mail server is needed for this Codex package.

The repository marketplace is maintained by Mailtea. Installing it does not mean
Mailtea has been accepted into OpenAI's public plugin directory.

## Send your first email

Start with: “Show my Mailtea publications and available senders.” Then use your
actual verified sender and recipient in a request such as:

> Send an email from my verified sender to the recipient I provided. Subject:
> Hello from Mailtea. Body: This email was sent from Codex using Mailtea.

The agent resolves missing sender, recipient, and content details before sending.
A request to draft does not send anything. After sending, it reports the email
ID; ask for delivery status to distinguish acceptance from delivery.

The plugin bundles `mailtea-email`, `mailtea-email-design`, and
`mailtea-site-design`. Its MCP tools include `auth.me`, `publication.list`,
`sender.list`, `email.send`, `email.get`, and newsletter, contact, template,
and site tools. Available actions depend on the permissions you grant.

## Connection help

- Sign in through the client's connection flow, never by pasting a token into chat.
- If OAuth or tool access fails, reconnect and check the publication/permissions.
- A sending domain must be verified before sending from it.
- If a send times out, inspect recent emails before retrying to avoid duplicates.
- Manage or revoke the connection under Mailtea's API keys / connected agents.

For self-hosting or clients that use stdio, the repository's portable `mcp.json`
starts `npx -y mailtea-mcp` with client-managed `MAILTEA_API_TOKEN` and optional
`MAILTEA_API_BASE_URL`. Install one transport for the account to avoid duplicate tools.

[Documentation](https://docs.mailtea.app/docs/documentation/agent-plugin) ·
[Source](https://github.com/mailtea-app/mailtea-agent-plugin) · [MIT](./LICENSE)
