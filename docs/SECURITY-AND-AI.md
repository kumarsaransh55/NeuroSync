# NeuroSync — AI, Security & Data Privacy

> Answers the question: *"We're using Google Gemini. If we need it to be secure,
> do we have to use a local AI? How?"* This is also a **pitch/Q&A asset** — data
> security is something the jury explicitly cares about, and it's core to our
> "enterprise-native" USP.

---

## The concern (state it plainly)
NeuroSync sends real workplace text — emails, tickets, documents — to an AI model
to summarise and break it down. Today that model is **Google Gemini via Google's
public API**, which means **enterprise data leaves the Accenture tenant** and goes
to a third-party service. For an *internal* tool that may touch **client-confidential**
information, that's a data-governance / DLP issue, not just a technical detail.

> Good news: the fix is **not** "you must run a local AI." It's "host the AI inside
> your own trust boundary." There's a spectrum — pick the point that matches the
> sensitivity of the data.

---

## The spectrum of options (least effort → most control)

### 1. Azure OpenAI Service — ✅ recommended for NeuroSync
The same class of models (GPT-4o etc.), but hosted **in your own Azure tenant**:
- Your prompts/data are **not used to train** the models.
- Data stays within **your Azure subscription, region, and compliance boundary**; supports private networking (VNet / Private Endpoint).
- Enterprise SLAs, RBAC, logging, content filtering built in.
- **You're already on Azure** (the API + SQL run there) — so this is the natural, low-friction move and the cleanest enterprise story.

### 2. Azure AI Foundry — open models, your tenant
Host open-source models (Llama, Phi, Mistral) as managed endpoints in Azure with the
same governance. Useful if you want open models without running infrastructure yourself.

### 3. Self-hosted open-source models — max control
Run open models (e.g. **Llama 3.x, Phi-4, Mistral, Qwen**) on your own GPU VM /
container via **Ollama** or **vLLM**. Data **never leaves your infrastructure**.
Trade-offs: needs GPU + MLOps effort; top open models are excellent for
summarisation and task-breakdown (our use cases), though slightly behind frontier
models on the hardest reasoning.

### 4. On-device / fully local — max privacy
Small models on the user's machine (Ollama) or in-browser (WebLLM). **No data leaves
the laptop.** Trade-offs: limited by device power, larger app footprint. Great for a
"nothing ever leaves your device" narrative; heavier for a broad rollout.

---

## Defence-in-depth (do this regardless of which model)
- **Redact before send:** strip secrets/PII the AI doesn't need.
- **No-training guarantee** + short/zero data retention with the provider.
- **Encryption** in transit and at rest; **audit logging** of AI calls.
- **Data residency** (keep processing in-region).
- **RBAC** + least-privilege access to the AI endpoint.
- **Human-in-the-loop:** the AI suggests; the person approves. (NeuroSync already does this.)
- **No diagnosis / no profiling** stored about the user (already a NeuroSync principle — see `STRATEGY.md` §8).

---

## Recommendation for NeuroSync
- **For the hackathon demo:** Gemini is fine — it's fast and already working. Just be
  explicit it's a demo choice (and don't paste real client data into it).
- **For production inside Accenture:** default to **Azure OpenAI** (in-tenant,
  governed). For the most sensitive workloads, offer a **self-hosted open-model**
  deployment. This matches the hackathon's own guidance: keep data in approved
  enterprise services, don't use public repos/tools for Accenture artifacts, and ask
  before relying on external paid LLMs.

---

## Why this is cheap to do (good architecture already)
The backend calls the model **behind an interface** (`IAiAssistantService`), and the
controllers never touch the model SDK directly. So switching providers is a
**localised change**, not a rewrite:

1. Add a new implementation, e.g. `AzureOpenAiAssistantService : IAiAssistantService`,
   that calls the Azure OpenAI endpoint with the *same* prompts.
2. Move the endpoint/key/deployment name into config (as `Gemini:ApiKey` is today).
3. Swap the DI registration in `Program.cs`:
   ```csharp
   // builder.Services.AddScoped<IAiAssistantService, AiAssistantService>();        // Gemini (demo)
   builder.Services.AddScoped<IAiAssistantService, AzureOpenAiAssistantService>();   // Azure OpenAI (prod)
   ```
The frontend, controllers, prompts, and database don't change.

---

## What to SAY to the jury (Q&A-ready)
> *"For the demo we use Gemini because it's fast to show. In production this runs on
> **Azure OpenAI inside our own tenant**, so client data never leaves Accenture's
> compliance boundary — and for the most sensitive cases we can self-host an open
> model so nothing leaves our infrastructure at all. Our code already abstracts the
> AI behind an interface, so switching is a config change, not a rewrite."*

That single answer covers privacy, feasibility, and responsible AI — three of the
scored criteria — in 20 seconds.
