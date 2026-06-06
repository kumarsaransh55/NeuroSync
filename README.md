# NeuroSync (Frontend)

**Work, in sync with how you think.**

NeuroSync is an inclusive work companion that turns the chaos of workplace
communication (emails, chat threads, tickets) into clarity and momentum —
**adapted to how each person's brain works**. It is designed for employees with
**ADHD and dyslexia**, who pay a disproportionate "cognitive tax" turning dense,
unstructured text into *started, finished* work.

> This repo is the **React frontend**. It talks to the **NeuroSync API**
> (ASP.NET Core + Google Gemini) — see the API repo's README. Strategy,
> pitch, demo and Q&A material live in [`/docs`](docs).

---

## What it does (core features)

| Feature | What it does | Status |
| --- | --- | --- |
| **Smart Task Planner** | Breaks a messy task / pasted email into ordered **micro-steps with time estimates** via the AI backend. Focus Mode strips everything but the next step. | ✅ Wired to real AI |
| **Plain-Language Summarizer** | Turns a long email/document into a summary, action items, deadlines, tone, hidden tasks, key highlights, and a **dyslexia-friendly rewrite**. | ✅ Wired to real AI |
| **Overwhelmed Support** | One-tap guided breathing reset for moments of overload (a "human edge" feature). | ✅ Client-side |
| **Accessibility settings** | Dyslexia font (OpenDyslexic), text-size scaling, high-contrast, theme. | ✅ Persisted locally |

### The 3 USPs (vs Copilot / ChatGPT / Outlook)
1. **Adaptive output** — the *same* message rendered for *your* brain (ADHD → time-boxed steps; dyslexia → short sentences + OpenDyslexic).
2. **Understanding → doing** — we attack task *initiation* and *overwhelm*, not just comprehension.
3. **Inclusion-first & enterprise-native** — calm by default; built to run on enterprise data behind governance.

---

## Accessibility

NeuroSync treats accessibility as a default, not an add-on:
- **OpenDyslexic** font toggle (loaded in `index.html`).
- **Text-size** scaling (small / medium / large) and **high-contrast** mode.
- Reduced-stimulation, calm visual design; gentle (not jarring) reminders.
- Guided breathing modal with `role="dialog"` / `aria-modal`.

> Ongoing work to deepen ARIA coverage, focus management, and keyboard support
> is tracked in `/docs` (accessibility pass).

---

## Tech stack
- **React 19** + **React Router 7**
- **Vite 5** (dev server + build)
- **Tailwind CSS 4**
- **lucide-react** icons
- A small central **API client** (`src/api/client.js`)

---

## Project structure
```
src/
├── api/client.js              # Central API client (base URL, auth, error handling)
├── context/SettingsContext.jsx# Global accessibility/preferences (persisted)
├── components/
│   ├── auth/                  # Login / Register (uses api.login / api.register)
│   ├── tasks/TaskBuilder.jsx  # Smart Task Planner (uses api.createTask)
│   ├── summarizer/            # Summarizer + result cards (uses api.analyzeDocument)
│   └── layout/                # Header, Sidebar, Overwhelmed modal
└── index.css                  # Theme tokens + accessibility utilities
docs/                          # Strategy, pitch, demo script, Q&A, user research
```

---

## Getting started

### Prerequisites
- **Node.js 18+** and npm

### Install & run
```bash
npm install
npm run dev        # starts the Vite dev server (default http://localhost:5173)
```
Other scripts:
```bash
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run lint       # eslint
```

### Connecting to the backend
The API base URL is read from `VITE_API_BASE` (see [`.env.example`](.env.example)).
If unset, it defaults to the deployed Azure API:
```
https://neurosync.azurewebsites.net/api
```
To point at a backend running on your machine, create a `.env` file:
```
VITE_API_BASE=http://localhost:5219/api   # use your backend's actual port
```

All network calls go through `src/api/client.js`, which:
- prefixes `VITE_API_BASE`,
- attaches `Authorization: Bearer <token>` from `localStorage` (`neurosync_jwt`),
- parses JSON/text responses and throws a friendly `ApiError` on failure,
- clears the session and signals re-login on `401`.

### ⚠️ Important: the backend must be redeployed for the AI features to work
The AI features (task breakdown + summarizer) call **authenticated** endpoints
from the browser. For that to work cross-origin, the **NeuroSync API** needed
three fixes (already applied in the API repo, **pending a redeploy to Azure**):
1. **CORS** enabled for the frontend origin.
2. Login now **returns the JWT in the response body** (so this SPA can store it).
3. JWT auth **falls back to the `Authorization: Bearer` header** (not only the cookie).

Until the API is redeployed with those changes, login + AI calls from the
browser will be blocked by CORS / auth. See the API README → *Deploying to Azure*.

---

## Auth flow
1. `POST /Auth/login` → returns `{ userName, token }`; the client stores `token` in `localStorage`.
2. Protected calls (`/Tasks/create-task`, `/Summarizer/analyze`) send `Authorization: Bearer <token>`.
3. `AuthRoute` gates `/dashboard` on the stored auth flag; a `401` clears it.

> Note: storing the JWT in `localStorage` is a pragmatic choice for a cross-origin
> SPA demo. For production, prefer a same-site HttpOnly cookie.

---

## Security & data handling (hackathon note)
- **Do not** commit secrets or upload Accenture artifacts to **public** repos (DLP). Use a private repo / Azure DevOps.
- No secrets live in the frontend. The Gemini key and JWT signing key are configured on the **backend** only.
- NeuroSync does **not** diagnose or store any "condition" — accessibility options are user-chosen preferences.

## Known limitations / roadmap
- Outlook "Inbox" is a demo connector with representative emails — selecting one runs the **real** AI breakdown. Production would use the Microsoft Graph API (`GET /me/messages`); see `docs/SECURITY-AND-AI.md`.
- Dashboard "Analytics"/"Team" routes are placeholders.
- Settings persist locally (not yet synced to the backend `UserSettings` model).
