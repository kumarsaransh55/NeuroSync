# NeuroSync — Live Demo Runbook

> The jury weights **"seeing it work."** This is the exact, rehearsable path.
> Target **~2.5 min**. Pairs with Slide 6 of `PITCH.md`. The AI is real (Azure
> OpenAI, GPT-5.5) — treat the network as a risk; keep the backup recording ready.

---

## Pre-flight checklist
- [ ] **Backend deployed** with the latest build (Azure OpenAI configured, all endpoints + migrations live).
- [ ] Frontend running (`npm run dev`, `http://localhost:5173`), **already logged in**.
- [ ] **A personalization profile pre-set** (Settings → Personalization): e.g. *simpler language ON, small steps, show time estimates* — so adaptive output shows instantly.
- [ ] **Sample email copied to clipboard** (below). Optional: a sample **PDF** to upload.
- [ ] Browser zoom ~125%; notifications/other tabs closed.
- [ ] **Backup**: a 60–90s screen recording of this exact flow + a few screenshots.
- [ ] (Optional) Outlook connected, or leave it on the demo inbox.

---

## Demo asset — the messy email (paste this)
```
Subject: Re: Q3 client deck + a couple of things

Hi Aanya, thanks for jumping on the TechCorp account. Following the call,
a few things need to move. We should get the revised pricing into the deck —
finance flagged that the old numbers are out of date. It would also be good to
loop in Priya on the implementation timeline before we share anything
externally, and someone needs to confirm whether legal has signed off on the
new contract terms. The client wants to see something by end of week, so
let's aim to have the deck ready for review on Thursday.

— Rahul
```

---

## The flow (narrate as you click)

### Beat 1 — "NeuroSync knows Aanya" (15s)
- Open **Settings → Personalization** (or just say it was set at sign-up).
- **Say:** "Aanya told us, once, that long text tires her and she likes small steps. NeuroSync remembers — and it shapes everything the AI gives her."

### Beat 2 — Real AI, rendered for her (45s)
- Go to **Summarizer**, paste the email, click **Analyze**.
- **While it loads:** "This is a live AI call — reading the message the way a busy colleague *wishes* they could."
- Point out: **Summary** (plain), **Action items** (the 3 real tasks), **Deadline** (the hidden **Thursday**), and the **Simplified rewrite** — short sentences + bullets *because of her profile* (and it renders proper headings/lists, not raw markdown). Toggle **Dyslexia Mode** for the font.

### Beat 3 — Understanding → doing (40s)
- Click **Convert all to tasks**.
- **Say:** "This becomes **one task** — the AI names it and writes a clear description for each step, but keeps the step names recognisable from the summary."
- Open the task → ordered **micro-steps with time estimates** (small, because of her profile).

### Beat 4 — Focus + the human edge (25s)
- Expand the task → **Start Task** (Focus Mode) → "everything fades but the next step."
- Header → **Feeling overwhelmed?** → calm breathing reset → close.

### Beat 5 — (Optional wow) the USP punch (20s)
- Change the profile to *bigger steps / standard language*, re-run the same email.
- **Say:** "Same email — different output. That's the difference between us and a generic chatbot."

### Beat 6 — (Optional) straight from Outlook
- **Inbox → Connect Outlook** (or demo inbox) → **Break into task** on Rahul's email.

**Land it:** "Same email — understood, broken down, started, and rendered the way *her* brain works."

---

## Timing
| Beat | Target |
|---|---|
| 1 Personalization | 0:15 |
| 2 Summarize (personalised) | 0:45 |
| 3 Convert → task | 0:40 |
| 4 Focus + overwhelmed | 0:25 |
| 5 USP punch (optional) | 0:20 |
| **Total** | **~2:25** |

---

## Fallback (rehearse it)
1. Stay calm: "Live AI over conference Wi-Fi — here's the run we recorded this morning." Play the 60–90s recording.
2. If needed, walk the 3 screenshots.
3. Safety net: run the backend locally and point `VITE_API_BASE` at it.

## Reset between rehearsals
- Tasks persist (DB + localStorage). Use a throwaway demo account, or delete the demo task (trash icon) between runs.
- Refresh to clear summarizer output.
