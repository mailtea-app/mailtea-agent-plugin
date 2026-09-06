# Mailtea for Codex

Send your first email. Design your next newsletter. Just ask.

Mailtea connects your email workspace to Codex so you can send and schedule
email, check delivery, manage contacts, design newsletters, and build your
publication website from a conversation.

![Get started with Mailtea: connect your account, check your setup, and send your first email.](./assets/get-started.png)

## Get started

You need a **Mailtea account** and **Codex with plugin support**. A verified
sending domain is required to send email. The hosted connection needs no API
key, Node.js installation, or coding.

1. **Install the preview.** Run these commands in your terminal:

   ```bash
   codex plugin marketplace add mailtea-app/mailtea-agent-plugin --ref codex/mailtea-codex-plugin
   codex plugin add mailtea@mailtea
   ```

   This installs from Mailtea's repository marketplace. The plugin is a preview;
   it is not yet listed in OpenAI's public directory.

2. **Open a new Codex task and connect Mailtea.** Follow the browser sign-in
   prompt. Choose your publication—the workspace for your emails, audience, and
   website—and the access you want to grant. Choose sending access to send email;
   read-only access cannot send. Available choices depend on your account role.

3. **Paste this first message:**

   > Help me send my first email with Mailtea. Check my setup and guide me through anything missing.

   Codex checks the publications, senders, and domain verification available to
   your account. If something is missing, it explains the next step. You do not
   need to know tool names or choose a skill.

4. **Provide the email details when asked.** Choose your verified sender, exact
   recipient, subject, and message. Ask Codex to send when those details are ready.
   It returns an email ID; you can then ask whether that email was delivered.

Need an account? [Start with Mailtea](https://mailtea.app).
Need a sending domain? [Domain setup](https://docs.mailtea.app/docs/documentation/domains).

## Three skills, ready when you need them

Codex selects the relevant skill from your request. You can also invoke a skill
by its name if you want to be explicit.

| Included skill | What it helps you do | Try saying |
| --- | --- | --- |
| **Mailtea email** (`mailtea-email`) | Send or schedule email, check delivery, draft newsletters, and manage contacts | “Help me send my first email.” |
| **Mailtea email design** (`mailtea-email-design`) | Design welcome emails, newsletters, and reusable templates for real inboxes | “Draft a welcome email with one clear call to action. Do not send it yet.” |
| **Mailtea website design** (`mailtea-site-design`) | Build or restyle your publication's website, with changes saved as drafts | “Draft an About page for my publication. Do not publish it yet.” |

![Mailtea includes email, email design, and website design skills.](./assets/included-skills.png)

## Copy a prompt

**Send one email** — replace the bracketed details with your own:

> Send an email from [my verified sender] to [recipient]. Subject: [subject]. Message: [body].

**Schedule a send:**

> Schedule this email for [date and time, including time zone]. Use [verified sender] and send only to [recipient].

**Check delivery:**

> Check my recent Mailtea emails and explain any failed deliveries.

**Create a newsletter draft:**

> Draft a newsletter for [publication] about [topic]. Give it a clear subject and one call to action. Do not send it yet.

**Design your website:**

> Draft a home page for [publication] using its brand and existing content. Do not publish it yet.

## What happens when you ask

- **Draft means draft.** Draft requests do not send email or publish a website.
- **You choose who receives an email.** Codex asks for missing details and uses
  the sender, recipients, and content you supply or approve.
- **An email ID means accepted, not delivered.** Ask for delivery status to check
  the result. Do not repeat a send after a timeout until its status is known.
- **Your permissions apply.** The connection only accesses what your Mailtea
  account and the permissions you grant allow.

## If you get stuck

| What you see | What to do |
| --- | --- |
| No Mailtea tools after installing | Open a new Codex task, check that the plugin is enabled, and connect Mailtea. |
| No browser sign-in prompt | In the terminal, run `codex mcp login mailtea` and open the authorization link it prints. |
| No publication available | Create one in Mailtea or reconnect with access to an existing publication. |
| No sender or domain is not verified | Follow [domain setup](https://docs.mailtea.app/docs/documentation/domains), complete the required DNS verification, and choose a sender on that domain. |
| Permission denied | Reconnect and select access that permits the requested action. Ask a publication owner if that option is unavailable. |
| A send timed out | Ask Codex to check recent emails before trying again, to avoid duplicates. |
| You want to disconnect | Revoke the connection in Mailtea's API keys / connected agents screen and disable the plugin in Codex. |

To update an existing preview installation:

```bash
codex plugin marketplace upgrade mailtea
codex plugin add mailtea@mailtea
```

Then open a new Codex task. For self-hosting and clients that use stdio, see the
repository's [portable package](https://github.com/mailtea-app/mailtea-agent-plugin/blob/codex/mailtea-codex-plugin/README.md#install--load-in-other-clients).

[Mailtea documentation](https://docs.mailtea.app/docs/documentation/agent-plugin) ·
[Source](https://github.com/mailtea-app/mailtea-agent-plugin) · [MIT](./LICENSE)
