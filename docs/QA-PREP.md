# NeuroSync — Q&A Prep (the 3 minutes that decide it)

> ~3 minutes. Answer in **one plain line first**, then one sentence more if needed.
> Be confident, not defensive. Assign an owner per theme. 🔴 = most likely.

---

## 🔴 How is this different from Copilot / ChatGPT?
**Copilot gives everyone the same answer. NeuroSync adapts the answer to *you*.** A one-time profile (set by the user) makes the same email come out as short, plain bullets for one person and small time-boxed steps for another — and it helps you *start*, not just understand.

## 🔴 How exactly do you personalise it?
**A short, opt-in questionnaire at sign-up builds a profile we save per user.** We inject that profile into every AI prompt, so the output changes. It's editable any time in Settings. No diagnosis, no labels — just preferences the user controls.

## 🔴 Did you talk to real neurodivergent users?
**Yes — we spoke with a few colleagues, and our choices match published research.** Their themes were consistent: long text is exhausting, *starting* is the hardest part, loud alerts make it worse. We're scaling interviews via HR.

## 🔴 Pasting client emails into an AI — is that safe?
**It runs on Azure OpenAI inside our own tenant — the data never leaves Accenture's boundary.** It's not a public chatbot. The AI is behind an interface, so we can even self-host a model for the most sensitive cases.

## 🔴 Are you diagnosing or labelling people?
**Never.** We don't infer or store any condition. The profile is opt-in preferences the user sets and can change. The AI suggests; the human always approves.

## Why not just call the person and explain?
**A call helps once; it doesn't scale and forces you to disclose.** NeuroSync gives private, on-demand clarity for every message, every day, without having to ask.

## One tool can't fit autism, low vision, non-English…
**Agreed — we went deep on one connected problem first** (ADHD + dyslexia, which co-occur ~half the time). The adaptive-output engine is built to add more profiles and languages next.

## What if the AI gets a deadline wrong?
**AI assists; the human stays in control.** Every step and date is shown for review and is editable. We surface the summary + original text so it's easy to sanity-check.

## What's actually built vs mocked? *(answer honestly)*
**The AI, the database, tasks, projects, personalization and the summarizer are real.** Real Outlook sign-in works too. The only thing that needs your tenant is the Outlook app registration; without it we show demo emails.

## Can't Microsoft just add this to Copilot?
**They can add a feature; they won't own the posture.** Inclusion-first design, the personalization profile, and the trust that comes with it are hard to bolt on to a tool built for the median user.

## Is it feasible / will it scale?
**It's running today on Azure** — React + ASP.NET Core + SQL + Azure OpenAI. Stateless API, scales horizontally. Connectors (Teams, Jira) are the next step.

## What's the business case?
**It's an inclusion investment with a proven return** — Accenture's own research links disability inclusion to higher revenue and margins, plus better retention of skilled people.

## How would you measure impact?
**Opt-in, privacy-safe signals** — time-to-start, completion, voluntary "this helped" feedback, adoption — never surveillance. Piloted with an ERG.

## Why "NeuroSync"?
**Neuro** (neurodivergent cognition) + **Sync** (syncs work to how your brain works). Tagline: *Work, in sync with how you think.*

## What's next in 3 months?
**A validated ERG pilot, Teams + Jira connectors, and more accessibility profiles** (languages, low-vision).

---

## Delivery tactics
- Bridge: "Great question — short answer is…"
- Don't know? "We haven't tested that yet — our hypothesis is X, here's how we'd validate it." (Honesty scores; bluffing loses.)
- Answer in ~20–30s, then stop.
- Owners: Competition/tech → ___ · Inclusion/ethics → ___ · Demo/feasibility → ___
- Land every answer back on the mission: **level the playing field for talent that's already here.**
