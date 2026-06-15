# NeuroSync — Strategy & Positioning

> The keystone document: the problem, the audience, the differentiation, and the proof.
> Problem-first, business-framed. Everything (pitch, demo, Q&A) builds on this.

---

## 0. North star
**NeuroSync is an inclusive work companion that turns the chaos of workplace communication into clarity and momentum — adapted to how each person's brain works.**
Tagline: **"Work, in sync with how you think."**
Not a "productivity tool" (implies users are *less* productive). We **remove friction** and **level the playing field** — never "fix" people.

---

## 1. The problem (problem-first)
> At work, the tasks that matter arrive buried inside long emails, chats, tickets and docs — and for employees with **ADHD and dyslexia**, turning that dense text into *started, finished* work carries a hidden **"cognitive tax"** that drains energy, causes things to slip, and forces constant masking. Not because the talent isn't there — because the tools were never designed for how they think.

**Why it matters to the business:** missed deadlines, burnout/absence, masking, and wasted talent + avoidable attrition.

**Why the cluster is one problem, not two:** ADHD and dyslexia **co-occur ~1 in 2**, and share the same mechanism — the cost of converting text into action. We solve that one mechanism. Evidence-based focus, not scope creep.

---

## 2. Who it's for
- **Primary user:** Accenture employees with **ADHD and/or dyslexia** in knowledge/desk roles.
- **Buyer/sponsor:** Accenture I&D + HR (internal inclusion tool — also our biggest differentiator).
- **Persona — "Aanya":** a sharp analyst with ADHD + dyslexia. Monday 9am: 38 emails, 4 chat threads, 6 tickets; one email hides 3 tasks + a Thursday deadline in paragraph 3. She re-reads it four times and still hasn't *started*. Not about ability — about a workday built for a brain that isn't hers.

---

## 3. The solution (what's built today)
A working MVP — not slideware:
- **Smart Task Planner** — turns messy text into ordered **micro-steps with time estimates**; Focus Mode; per-task due dates; **Projects** to group work; persisted to the DB.
- **Plain-Language Summarizer** — paste **or upload PDF/DOCX** → summary, real action items, hidden deadlines, tone, and a **dyslexia-friendly rewrite**; one click turns it into a task.
- **Personalization** — an opt-in profile that **adapts every AI output** to the user (see USP 1).
- **Outlook** — real Microsoft Graph sign-in → inbox → "break into task".
- **Human edge** — "feeling overwhelmed?" reset, gentle reminders, calm/accessible UI.
- Runs on **Azure OpenAI in-tenant** (Gemini fallback).

---

## 4. The 3 USPs (vs Copilot / ChatGPT / Outlook)

### USP 1 — Adaptive output, per person *(now real, not aspirational)*
**"Same message, rendered for your brain."** A one-time, opt-in questionnaire builds a per-user **profile** (saved in the DB). That profile is **injected into every AI prompt**, so the *same* email/task comes out differently: dyslexia-leaning → short sentences, plain words, bullets; ADHD-leaning → small time-boxed steps, one action at a time. Copilot gives everyone the identical answer. **This is the moat — and it's implemented end-to-end.**

### USP 2 — We close the gap from *understanding* → *doing*
**"From 'I get it' to 'I started.'"** Micro-steps with time estimates, Focus Mode, gentle reminders, and a one-tap overwhelm reset target task *initiation* and *regulation* — not just comprehension.

### USP 3 — Inclusion-first & enterprise-native
**"Built for your brain AND your firewall."** Calm/sensory-aware by default; runs on **Azure OpenAI inside the enterprise tenant** and on the company's own **Outlook** (Teams/Jira next) behind governance — not a public chatbot.

**Cross-cutting:** the human edge — NeuroSync supports the *person*, not just the task.

---

## 5. The name
**Neuro** (neurodivergent cognition) + **Sync** (syncs work *to how your brain works*, and your tools into one calm view). Tagline: *"Work, in sync with how you think."*

---

## 6. The proof — cited stats
> Lead with Accenture's own research to an Accenture jury.
- Inclusion leaders saw **28% higher revenue, 2× net income, 30% higher profit margins** — *Accenture, "Getting to Equal: The Disability Inclusion Advantage" (2018).*
- 2023 follow-up: **1.6× revenue, 2.6× net income** — *Accenture / Disability:IN / AAPD (2023).*
- **~15–20%** of people are neurodivergent; **~1 in 2** with ADHD also have dyslexia (→ one connected problem); **51%** of neurodivergent employees have taken time off due to their condition.
- India: RPwD Act 2016 recognises ASD, dyslexia, ADHD; nasscom "Neurodiversity and the Future of Work in India".
> Full source list with clickable links is on the **Sources** slide of the deck. Verify exact figures against primary sources before final.

**One line:** *"The issue isn't a lack of qualifications — it's that the system isn't designed with them in mind."*

---

## 7. Answering the reviewers' objections
| Objection | Answer |
|---|---|
| No problem statement | §1 — one-sentence problem, mechanism, business impact, before any feature. |
| Audience too vague | §2 — Accenture employees with ADHD/dyslexia + named persona. |
| Different disabilities = different needs | §1 — one mechanism; ADHD+dyslexia co-occur ~50%. |
| "Productivity" implies less productive | §0 — reframed to inclusive companion / remove friction. |
| Overlaps with Copilot/ChatGPT | §4 — 3 USPs they don't combine, led by **real personalization**. |
| Why not just a call? | A call helps once, doesn't scale, and forces disclosure/masking. NeuroSync gives private, on-demand clarity every day without asking. |
| Non-English / other disabilities | Conscious depth-first scope; the adaptive-output engine extends to more profiles/languages. |
| No validation | Interview kit + cited research (`USER-RESEARCH.md`). |
| Data security | **Azure OpenAI in-tenant** — data stays in our boundary (`SECURITY-AND-AI.md`). |

---

## 8. Ethics & responsible AI
- **No diagnosis, no labels.** The personalization profile is **opt-in preferences** the user sets and can change anytime — never an inferred condition.
- **Human-in-the-loop** — AI suggests; the person approves. Nothing auto-acts.
- **Sourced nudges** (recognised techniques), **privacy by design** (Azure OpenAI in-tenant), **inclusive by default**.

---

## 9. Narrative spine (7-min pitch — full script in `PITCH.md`)
1. Hook — Aanya's Monday (45s).
2. Problem + why it exists (60s).
3. Who + how big — cluster + Accenture's inclusion-pays data (45s).
4. Solution + 3 USPs (60s).
5. **LIVE DEMO** (~2.5 min): set a profile → same email renders for *that* brain → micro-steps → Focus Mode → overwhelmed reset → (optional) pull straight from Outlook.
6. Why us, not Copilot (30s).
7. Ethics, feasibility (Azure OpenAI in-tenant), roadmap (Teams/Jira), ask (30s).
