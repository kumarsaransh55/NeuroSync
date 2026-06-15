# NeuroSync — Outlook Integration (Microsoft Graph)

NeuroSync pulls real email from **Outlook / Microsoft 365** via the **Microsoft
Graph API** and turns any message into an AI-broken-down task.

The integration is real (`src/services/outlook.js` + `OutlookInboxModal`). It signs
in with **MSAL using the redirect flow** and calls `GET /me/messages`. The only
thing it needs from you is an **Azure AD (Entra) app registration** — that lives in
your tenant, so it's a one-time setup on your side.

> Until a client ID is configured, the inbox shows representative demo emails so the
> email→task flow still demos. No code change is needed to switch to real mode.

---

## Why redirect flow (not popup)
Microsoft's login pages now send a `Cross-Origin-Opener-Policy` header that severs
the link between the app window and a popup, so popup auth **times out**. NeuroSync
uses the **redirect flow**: the whole tab goes to Microsoft and returns to the app,
where `main.jsx` processes the auth code **before** the router mounts.

---

## One-time setup (≈5 minutes)
1. **Azure Portal → Microsoft Entra ID → App registrations → New registration.**
2. **Supported account types:** to allow personal Microsoft accounts (e.g. `@outlook.com`), choose **"Accounts in any organizational directory and personal Microsoft accounts"** — or set `"signInAudience": "AzureADandPersonalMicrosoftAccount"` in the **Manifest**. (For an Accenture-only internal tool, single-tenant is fine.)
3. **Authentication → Add a platform → Single-page application (SPA)** → redirect URI **`http://localhost:5173`** (add your deployed frontend origin later). Must be **SPA**, not "Web".
4. **Register**, then copy the **Application (client) ID** and **Directory (tenant) ID**.
5. **API permissions → Microsoft Graph → Delegated → `Mail.Read`** (and `User.Read`). Personal accounts consent at sign-in; managed tenants may need admin consent.

## Configure NeuroSync
Create `.env` in the frontend:
```
VITE_MS_CLIENT_ID=<Application (client) ID>
VITE_MS_TENANT=common          # "common" = personal + work accounts; or your tenant ID
```
Restart `npm run dev`. Open **Tasks → Inbox → Connect Outlook** → sign in → your real
inbox loads. Click **Break into task** on any email to run the AI breakdown on it.
Use **Disconnect** to sign out and connect a different account.

---

## How it works
- `src/services/outlook.js` — MSAL **redirect** sign-in (`loginRedirect`), silent token
  with redirect fallback, `disconnectOutlook()`, and `GET /me/messages` mapped to `{ sender, subject, body, time }`.
- `main.jsx` — calls `initOutlook()` to process the redirect response on return (only blocks render when returning from auth).
- `OutlookInboxModal.jsx` — **Connect / Refresh / Disconnect**; auto-loads when already signed in; demo emails when unconfigured.
- `TaskBuilder.handleAddEmailAsTask` — sends the email to the backend, which AI-breaks it into a task with micro-steps.

## Troubleshooting
- **`unauthorized_client … not enabled for consumers`** → the app's account types exclude personal accounts. Set `signInAudience` to `AzureADandPersonalMicrosoftAccount` (Manifest), use `VITE_MS_TENANT=common`.
- **`redirect_uri mismatch`** → the registered SPA redirect URI must exactly match `http://localhost:5173`.
- **Sign-in "times out" the next day** → the cached token expired; NeuroSync now falls back to a fresh redirect sign-in. Use **Disconnect** to reset.
- **Restart `npm run dev`** after editing `.env` (Vite reads it at startup).

## Security
Graph tokens stay in the browser (MSAL cache). For production prefer the on-behalf-of
flow through the backend; see `docs/SECURITY-AND-AI.md`.

## Teams & Jira (next)
Both follow this pattern: **Teams** uses the same Microsoft Graph app registration
(add `Chat.Read` / `ChannelMessage.Read.All`); **Jira** uses Atlassian OAuth 2.0 (3LO)
+ the Jira REST API. The inbox is built to generalise into a connector interface.
