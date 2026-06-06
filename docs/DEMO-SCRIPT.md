# NeuroSync — Live Demo Runbook

> The jury weights **"seeing the solution in action."** This is the exact,
> rehearsable path. Target: **~2.5 minutes**. Pairs with Slide 6 of `PITCH.md`.
> **The AI is real** (Google Gemini via the Azure API) — so treat the network as
> a risk and keep the backup recording ready (see *Fallback*).

---

## Pre-flight checklist (do BEFORE you present)
- [ ] **Backend redeployed to Azure** with the CORS + token-in-body + Bearer-fallback changes (see API README → *Deploying to Azure*). Without this, the AI calls fail.
- [ ] Frontend running: `npm run dev`, browser at `http://localhost:5173`.
- [ ] **Already logged in** (don't spend demo time on the login screen). Confirm a token is in `localStorage` (`neurosync_jwt`).
- [ ] **Sample email copied to clipboard** (the text in *Demo Asset* below).
- [ ] Browser zoom ~125% so the jury can read; close other tabs/notifications.
- [ ] **Do one full live rehearsal run 10 min before** to wake the Azure app + DB (first call can be slow due to cold start / EF retry).
- [ ] **Backup ready**: a 60–90s screen recording of this exact flow + 3 screenshots, on the desktop. (See *Fallback*.)
- [ ] Dyslexia mode OFF to start (so you can toggle it ON as a "wow").

---

## Demo Asset — the messy email (paste this)
> Realistic: it hides **three tasks** and a **Thursday deadline** inside the prose.

```
Subject: Re: Q3 client deck + a couple of things

Hi Aanya, thanks for jumping on the TechCorp account. Following the call,
a few things need to move. We should get the revised pricing into the deck —
finance flagged that the old numbers are out of date. It would also be good to
loop in Priya on the implementation timeline before we share anything
externally, and someone needs to confirm whether legal has signed off on the
new contract terms. The client wants to see something by end of week, so
let's aim to have the deck ready for review on Thursday. Appreciate it!

— Rahul
```

---

## The flow (narrate as you click)

### Beat 1 — The chaos (10s)
- Be on **Summarizer** (`/dashboard/summarizer`).
- **Say:** "This is the email from Aanya's manager. Three tasks and a deadline are buried in here. Watch what NeuroSync does with it."
- Paste the email into the input box.

### Beat 2 — Real AI translates it (45s)
- Click **Generate Summary**.
- **While it loads (fill the silence):** "This is a live call to our AI on Azure — it's reading the message the way a busy colleague *wishes* they could."
- When cards appear, point to each briefly:
  - **Summary** — "Plain-language, 2–3 sentences."
  - **Action Items** — "It pulled out the three real tasks: update pricing, loop in Priya, confirm legal."
  - **Deadline** — "And it caught the hidden one — **Thursday**."
  - **Tone** — "It even reads the tone, so Aanya knows how urgent this is."
- Toggle **Dyslexia Mode** (top-right): **Say:** "And the same content, re-rendered for a dyslexic reader — short sentences, plain words, OpenDyslexic font. *Same message, rendered for your brain.*"

### Beat 3 — From understanding to doing (45s)
- Go to **Task Planner** (`/dashboard/tasks`).
- *(Optional, stronger):* click **Inbox → Outlook**, hover Rahul's email, and hit **Break into task** — pulls it straight from email, same AI breakdown, zero copy-paste.
- Paste the email (or type "Prepare the TechCorp Q3 deck for Thursday review") into the task box.
- Click **AI Break Into Steps**.
- **While it loads:** "Understanding isn't the hard part for Aanya — *starting* is. So we turn it into action."
- When steps appear: "Ordered micro-steps, each with a realistic time estimate. The mountain becomes a staircase."

### Beat 4 — Focus, and the human edge (30s)
- Expand the task; click **Start Task** (Focus Mode).
- **Say:** "Focus Mode fades everything except the *next* step — no overwhelm, no decisions."
- Click **"Feeling overwhelmed?"** in the header.
- **Say:** "And if it still gets too much — one tap, a calm reset based on recognised breathing techniques. This is the human edge: we support the *person*, not just the task."
- Close the modal.

### Beat 5 — Land it (10s)
- **Say:** "Same email. Now it's understood, broken down, started — and Aanya never had to mask or ask for help."
- Switch back to slides (Slide 7).

---

## Timing
| Beat | Target |
| --- | --- |
| 1 Chaos | 0:10 |
| 2 Summarize + dyslexia | 0:45 |
| 3 Break into steps | 0:45 |
| 4 Focus + overwhelmed | 0:30 |
| 5 Land it | 0:10 |
| **Total** | **~2:20** (buffer to 2:30) |

---

## Fallback (if the network or AI fails) — REHEARSE THIS TOO
1. **Stay calm, keep talking.** "Live AI over conference Wi-Fi — let me show you the run we recorded this morning." Don't apologise repeatedly.
2. Play the **60–90s screen recording** of this exact flow.
3. If even that fails, walk through the **3 screenshots** (summary cards, micro-steps, focus mode).
4. Optional safety net: run the **backend locally** (`dotnet run`) and point the frontend at it via `VITE_API_BASE=http://localhost:<port>/api` so the demo doesn't depend on Azure cold-start.

> Capture the backup recording from a **successful live run**, so it's honest and identical to what you're describing.

---

## Reset between rehearsals
- Tasks created during the demo are saved to the backend (per user). Either log in with a throwaway demo account, or just create a fresh task each run — the list shows the newest first.
- Refresh the page to clear summarizer output.
