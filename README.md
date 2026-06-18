# NeuroSync (Frontend)

**Work, in sync with how you think.**

NeuroSync is an inclusive work companion that turns the chaos of workplace
communication (emails, chat threads, tickets, documents) into clarity and
momentum — **adapted to how each person's brain works**. It is designed for
employees with **ADHD and dyslexia**, who pay a disproportionate "cognitive tax"
turning dense, unstructured text into *started, finished* work.

> This repo is the **React frontend**. It talks to the **NeuroSync API**
> (ASP.NET Core + Azure OpenAI, GPT-5.5) — see that repo's README. Strategy, pitch,
> demo, Q&A, security and Outlook docs live in [`/docs`](docs).

---

## What it does

| Feature | What it does | Status |
| --- | --- | --- |
| **Smart Task Planner** | Create tasks (manually or via AI), break them into **micro-steps with time estimates**, reorder by drag, set per-task **due dates**, delete. Focus Mode strips everything but the next step. | ✅ Real AI + DB |
| **Projects** | Group tasks into projects — create / rename / delete, assign tasks, switch/filter. | ✅ DB-backed |
| **Plain-Language Summarizer** | Paste **or upload (PDF / DOCX / TXT)** → AI summary, action items, deadlines, tone, hidden tasks, key points, and a **dyslexia-friendly rewrite** (rendered Markdown). | ✅ Real AI |
| **Convert to tasks** | Turn a summary's action items into **one task** whose subtasks keep the action-item names and get AI-written, context-aware descriptions. | ✅ Real AI |
| **Personalization (the USP)** | A one-time opt-in questionnaire builds a per-user profile (saved in the DB) that **adapts every AI output** + the UI. | ✅ |
| **Outlook integration** | Real **Microsoft Graph** sign-in (MSAL) → your inbox → "break into task". Connect/disconnect. | ✅ (needs app reg) |
| **Overwhelmed support** | Guided breathing reset, focus mode, a 5-minute reset timer. | ✅ |
| **Reminders** | Schedules a gentle/standard/persistent nudge — a guaranteed **in-app toast** + browser notification. | ✅ |
| **Accessibility** | OpenDyslexic font, text scaling, high contrast, dark mode, reduced motion, skip link, keyboard focus ring. | ✅ |

### The 3 USPs (vs Copilot / ChatGPT / Outlook)
1. **Adaptive output, per person** — the *same* email/task is rendered for *your* profile (dyslexia → short, plain, bulleted; ADHD → small time-boxed steps). Driven by the personalization profile, injected into every AI prompt.
2. **Understanding → doing** — we attack task *initiation* + *overwhelm* (micro-steps, focus mode, reset timer), not just comprehension.
3. **Inclusion-first & enterprise-native** — calm by default; runs on **Azure OpenAI in your tenant** + your Outlook, behind enterprise governance.

---

## Personalization
On first sign-in, an opt-in questionnaire (**no diagnosis, no labels**) asks a few
questions ("Does long text tire you?", "Fewer/bigger steps?", "Do reminders help
or stress you?"). The answers form a profile that is **saved per-user in the DB**
and is editable any time under **Settings → Personalization**. The profile is sent
to the backend, which **injects it into every AI prompt** so output adapts. See the
backend README for the prompt-injection details.

---

## Tech stack
- **React 19** + **React Router 7**, **Vite 5**, **Tailwind CSS 4**, **lucide-react**
- **@azure/msal-browser** — Outlook (Microsoft Graph) sign-in
- **pdfjs-dist** + **mammoth** — PDF/DOCX text extraction
- **react-markdown** — renders the AI's simplified text
- Central API client `src/api/client.js`; app state via React Context

## Project structure
```
src/
├── api/client.js                 # API base URL, auth header, error handling, all endpoints
├── context/
│   ├── SettingsContext.jsx       # accessibility + personalization profile (localStorage + DB sync)
│   ├── TasksContext.jsx          # tasks + projects (localStorage + DB sync)
│   └── FocusContext.jsx          # shared focus mode + reset timer
├── lib/
│   ├── extractText.js            # PDF/DOCX/TXT → text
│   └── reminders.js              # schedule reminders (toast + notification)
├── services/outlook.js           # MSAL + Microsoft Graph
├── components/
│   ├── auth/                     # login / register
│   ├── tasks/                    # TaskBuilder, OutlookInboxModal
│   ├── summarizer/               # input + result cards (markdown, empty-states)
│   ├── settings/                 # accessibility + personalization
│   └── layout/                   # Header, Sidebar, Overwhelmed modal, OnboardingModal, toasts
docs/                             # strategy, pitch, demo, Q&A, security, Outlook, deck generator
```

---

## Getting started
### Prerequisites
- **Node.js 18+** and npm

### Install & run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

### Environment ([`.env.example`](.env.example) → copy to `.env`)
```
# API base URL (defaults to the deployed Azure API if unset)
VITE_API_BASE=https://neurosync.azurewebsites.net/api

# Outlook (optional — see docs/OUTLOOK-INTEGRATION.md). Without these the inbox shows demo emails.
VITE_MS_CLIENT_ID=<Azure AD app (client) ID>
VITE_MS_TENANT=common      # "common" for personal + work accounts
```
> Vite only reads `.env` (not `.env.example`) **at startup** — restart `npm run dev` after changes. `.env` is gitignored.

All network calls go through `src/api/client.js`, which attaches
`Authorization: Bearer <token>`, parses responses, and signals re-login on `401`.

---

## Backend dependency
The AI + persistence features require the **NeuroSync API** to be deployed with its
latest changes (CORS, token-in-body, Bearer auth, the Tasks/Projects/UserSettings
endpoints, the EF migrations, and the Azure OpenAI switch). Until then, the app
still works on **localStorage** (tasks/projects/settings persist locally) and the
Outlook inbox falls back to demo emails. See the API README → *Deploying to Azure*.

## Security & data handling (hackathon note)
- **Do not** push to a **public** repo (DLP). Use a private repo / Azure DevOps.
- No secrets in the frontend; the Outlook client ID is not a secret (public SPA flow).
- NeuroSync **never diagnoses or labels** anyone — the profile is opt-in preferences the user controls.

## Known limitations / roadmap
- File extraction supports modern **.docx** (not legacy **.doc**).
- Teams & Jira connectors are the next integrations (same connector shape as Outlook).
- Reminders/reset-timer are client-side (fire while the tab is open); production would use a service worker / server push.
