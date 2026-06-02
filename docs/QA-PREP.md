# NeuroSync — Q&A Prep (the 3 minutes that decide it)

> The jury gets ~3 minutes. Teams lose here by getting **defensive** or **vague**.
> For each question: a **one-line answer first**, then 1–2 supporting sentences.
> Acknowledge real limits *confidently* and pivot to a strength. Say "great
> question," breathe, answer. **Assign an owner per theme** so you don't talk over
> each other.

Legend: 🔴 = most likely / hardest — drill these.

---

## 🔴 1. "How is this different from Microsoft Copilot / ChatGPT?"
**One-liner:** "Copilot summarises the same way for everyone. NeuroSync adapts the *output* to how your brain works, and it helps you *start*, not just understand."
**Support:** "Three things they don't do together: adaptive output per cognitive profile, task-*initiation* and in-the-moment regulation support, and inclusion-first design running on enterprise data. Generic AI is a tool for everyone; NeuroSync is a tool *designed with* neurodivergent cognition as the default."
**Pivot:** "Honestly, Copilot in the workflow is a tailwind for us — it proves enterprises want AI assistance. We're the *inclusive* layer on top."

## 🔴 2. "Did you talk to real neurodivergent users? Where's the validation?"
**One-liner:** "Yes — we've spoken with [N] neurodivergent colleagues, and our design choices map directly to peer-reviewed research."
**Support:** "Their themes were consistent: long emails are exhausting, *starting* is the hardest part, and loud alerts make it worse — which is why we built adaptive output, micro-steps, and gentle nudges. We're continuing structured interviews via HR." *(See `USER-RESEARCH.md`.)*
**If you've done few:** "We've run a first round of [N] and have a structured interview kit to scale it — we deliberately validated direction before over-building."

## 🔴 3. "Why not just call the person and explain the task?"
**One-liner:** "A call helps once; it doesn't scale, isn't always available, and forces disclosure."
**Support:** "Asking every time creates a dependency and a *masking* burden — many neurodivergent employees don't want to flag a difference repeatedly. NeuroSync gives **private, on-demand** clarity for every email, every day, without having to ask anyone."

## 🔴 4. "One solution can't fit all disabilities. What about autism, low vision, hearing, non-English?"
**One-liner:** "Agreed — that's why we deliberately scoped to one connected problem first."
**Support:** "ADHD and dyslexia co-occur about half the time and share the same bottleneck: turning text into action. We went deep there rather than shallow everywhere. The adaptive-output engine is built to add profiles — languages, screen-reader/low-vision modes — as the next layer. It's a roadmap, not a blind spot."

## 🔴 5. "Are you diagnosing or labelling people? Isn't that sensitive?"
**One-liner:** "We never diagnose, infer, or store any condition. Support is a user *choice*."
**Support:** "The user picks their preferences — dyslexia font, step size, nudge style. No labels, no profiling. The AI suggests; the human always edits and approves. Nudges are tied to recognised techniques, not invented advice."

## 6. "What if the AI gets it wrong — misses a deadline or hallucinates a task?"
**One-liner:** "AI assists; the human stays in control — nothing is auto-actioned."
**Support:** "Every step and deadline is shown for review and is editable; we surface the *source* understanding (summary + original text) so the user can sanity-check. We'd rather be a reliable co-pilot than an unaccountable autopilot."

## 🔴 7. "Pasting client emails into an AI — what about data security / DLP?"
**One-liner:** "That's exactly why this is enterprise-native, not a public chatbot."
**Support:** "It's designed to run inside enterprise boundaries and governance — not 'copy your client's email into a consumer tool.' In production we'd use the enterprise-approved model endpoint, with the usual data-handling controls. We're keeping our own repo private per the hackathon's DLP guidance."

## 8. "Is this technically feasible / will it scale?"
**One-liner:** "What you saw is real and running on Azure today."
**Support:** "ASP.NET Core API + Google Gemini + SQL on Azure, with a React frontend. It's a stateless API that scales horizontally; the heavy lifting is the model call. Connectors to Outlook/Teams/Jira are the next integration step."

## 9. "What's actually built vs. mocked?" (answer this honestly)
**One-liner:** "The AI is real; some enterprise connectors are mocked for the demo."
**Support:** "Task breakdown and the summarizer are live AI calls — not canned. Auth, the API and database are real. The Outlook/Teams/Jira *inbox* is a UI mock that shows the intended aggregation — that's our next build, not a claim we've finished it." **Never claim a mock is real.**

## 10. "Can't Microsoft just add this to Copilot tomorrow?"
**One-liner:** "They could add a feature; they won't own the *posture*."
**Support:** "Our moat is design philosophy + focus: inclusion-first, regulation-aware, validated with this community. Big platforms optimise for the median user. A purpose-built inclusive layer — and the trust that comes with it — is hard to bolt on."

## 11. "Why the name 'NeuroSync'?"
**One-liner:** "Neuro — for neurodivergent cognition; Sync — it brings work *into sync with how your brain works*."
**Support:** "The tool adapts to you, and it syncs your scattered tools into one calm view. Tagline: *Work, in sync with how you think.*"

## 12. "What's the business case? Who pays, and what's the ROI?"
**One-liner:** "It's an internal inclusion investment with a proven return."
**Support:** "Accenture's own research links disability inclusion to materially higher revenue and margins. Reduced burnout/attrition and better retention of skilled people pay for a lightweight internal tool many times over."

## 13. "How would you measure impact?"
**One-liner:** "Opt-in, privacy-safe signals plus self-reported wellbeing."
**Support:** "Time-to-start a task, task completion rates, voluntary 'this helped' feedback, and adoption — never surveillance. We'd partner with HR/I&D on a small pilot cohort."

## 14. "What's next if you win / in 3 months?"
**One-liner:** "Outlook/Teams/Jira connectors, a validated pilot, and more accessibility profiles."
**Support:** "Turn the mocked inbox into a real connector, run a structured pilot with an ERG, and add language + low-vision profiles to the adaptive engine."

---

## Delivery tactics
- **Bridge phrases:** "Great question — the short answer is…", "Two parts to that…", "We thought hard about this…"
- **When you don't know:** "We haven't tested that yet — our hypothesis is X, and here's how we'd validate it." (Honesty scores; bluffing loses.)
- **Don't over-talk.** Answer, stop, let them follow up. Aim ~20–30s per answer.
- **Owners (fill in):** Competition/tech → ___ · Inclusion/ethics/research → ___ · Demo/feasibility → ___
- **Land every answer back on the mission:** *level the playing field for talent that's already here.*
