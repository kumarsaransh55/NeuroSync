# NeuroSync — AI, Security & Data Privacy

> Answers: *"We send real work text to an AI — how is that secure?"* Also a
> **pitch/Q&A asset** — data security is something the jury cares about, and it's
> core to our "enterprise-native" USP.

---

## The concern
NeuroSync sends real workplace text (emails, tickets, documents) to an LLM. For an
*internal* tool that may touch **client-confidential** information, the data must
stay inside the enterprise's trust boundary.

## What we actually do now
NeuroSync's AI sits behind an interface (`IAiAssistantService`) with **two
implementations**, selected automatically by config:

1. **Azure OpenAI (GPT-5.5) — production.** (`AzureOpenAiAssistantService`.)
   - The latest GPT-5.5 model, hosted **in your Azure tenant/region**; prompts are **not used to train** the models; supports private networking + enterprise compliance.
   - Enabled by setting `AzureOpenAI:Endpoint` / `ApiKey` / `Deployment`. The app switches to it automatically — no code change.
2. **A pluggable fallback implementation** for local development when Azure isn't configured. (`AiAssistantService`.)

> This is no longer just a recommendation — **Azure OpenAI is implemented** and goes
> live the moment the three config values are set.

## The spectrum (most control → most convenient)
- **Self-hosted open models** (Llama / Phi / Mistral via Ollama / vLLM) — data never leaves your infra; needs GPU.
- **Azure OpenAI in-tenant** — the pragmatic enterprise default (what we use).
- **Public model APIs** — convenient, but data leaves the tenant → avoid for sensitive data.

## Defence-in-depth (regardless of model)
- **No training on your data**; short/zero retention.
- **Encryption** in transit + at rest; **audit logging**; **data residency**.
- **Human-in-the-loop** — the AI suggests; the person edits/approves. Nothing auto-acts.
- **No diagnosis / no profiling** stored about the user — the personalization profile is **opt-in preferences the user sets and can change** (see `STRATEGY.md` §8).
- Outlook Graph tokens stay in the browser MSAL cache; production would use a backend on-behalf-of flow.

## Switching providers is a config change, not a rewrite
```csharp
// Program.cs auto-selects:
if (!string.IsNullOrWhiteSpace(builder.Configuration["AzureOpenAI:Endpoint"]))
    builder.Services.AddScoped<IAiAssistantService, AzureOpenAiAssistantService>();
else
    builder.Services.AddScoped<IAiAssistantService, AiAssistantService>(); // local-dev fallback
```
Frontend, controllers, prompts, and database are untouched.

## Q&A-ready line
> *"We run on **Azure OpenAI inside our own tenant**, so client data never leaves
> Accenture's compliance boundary — and for the most sensitive cases we can
> self-host an open model. The AI is behind an interface, so switching is a config
> change. We also never diagnose or label anyone — the personalization is opt-in
> preferences the user controls."*
