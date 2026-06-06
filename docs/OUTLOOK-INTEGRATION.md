# NeuroSync — Outlook Integration (Microsoft Graph)

NeuroSync can pull real email from **Outlook / Microsoft 365** via the
**Microsoft Graph API**, and turn any message into an AI-broken-down task.

The integration code is real (`src/services/outlook.js` + `OutlookInboxModal`).
It signs in with **MSAL** and calls `GET /me/messages`. The only thing it needs
from you is an **Azure AD (Entra ID) app registration** — that can only be
created inside your tenant, so it's a one-time setup step on your side.

> Until a client ID is configured, the inbox shows representative demo emails so
> the email→task flow still demos end-to-end. No code change is needed to switch
> to real mode — just set the env vars and reload.

---

## One-time setup (≈5 minutes)
1. Go to **Azure Portal → Microsoft Entra ID → App registrations → New registration**.
2. Name it e.g. `NeuroSync (dev)`.
3. **Supported account types:** "Accounts in this organizational directory only" (single tenant) is fine for an Accenture-internal tool.
4. **Redirect URI:** platform **Single-page application (SPA)** → `http://localhost:5173` (add your deployed frontend URL later too).
5. Click **Register**, then copy the **Application (client) ID** and **Directory (tenant) ID**.
6. **API permissions → Add a permission → Microsoft Graph → Delegated → `Mail.Read`.** Click **Grant admin consent** (may require an admin in the Accenture tenant).

## Configure NeuroSync
Create a `.env` (or `.env.local`) in the frontend with:
```
VITE_MS_CLIENT_ID=<your Application (client) ID>
VITE_MS_TENANT=<your Directory (tenant) ID>     # or "organizations"
```
Restart `npm run dev`. Open **Tasks → Inbox** and click **Connect Outlook** — you'll
get a Microsoft sign-in popup, then your real inbox loads. Click **Break into task**
on any email and NeuroSync runs the AI breakdown on it.

---

## How it works
- `src/services/outlook.js` — MSAL sign-in (`loginPopup`, silent token refresh) + `GET /me/messages`, mapped to `{ sender, subject, body, time }`.
- `OutlookInboxModal.jsx` — shows a **Connect Outlook** button when configured; otherwise demo emails.
- `TaskBuilder.handleAddEmailAsTask` — sends the chosen email to the backend, which uses Gemini to break it into micro-steps.

## Notes & gotchas
- **Admin consent:** in a managed tenant (like Accenture's), `Mail.Read` usually needs an administrator to grant consent once. If sign-in says "needs admin approval," that's expected — request it via your Azure AD admin.
- **Redirect URI must match exactly** (scheme, host, port) or sign-in fails.
- **Security:** Graph tokens stay in the browser (MSAL cache). For production, prefer the on-behalf-of flow through the backend; see `docs/SECURITY-AND-AI.md`.
- **Teams/Jira** would follow the same pattern (Graph for Teams; Jira REST for tickets) — the inbox is built to generalise.
