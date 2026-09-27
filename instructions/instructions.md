```markdown
# Instructions for AI Agent Builder: LiquiShock AI

## Step 1: Define the Project First
Before writing any code, you must:
1. Create a file called `project_specs.md`.
2. Clearly define:
   - What the user can send as input (stress parameters, scenario presets, manual wire hold/release actions, API keys).
   - What workflows exist (real-time intraday liquidity calculation, stress testing simulation, dynamic currency conversion, AI executive briefing generation, payment throttling).
   - What tools and libraries are being used (Vite, React, TypeScript, Tailwind CSS, Lucide React, Recharts, Frankfurter FX API, `@google/genai` or OpenAI SDK, gh-pages).
   - What outputs are expected (minute-by-minute liquidity trajectory curves, breach warning indicators, BCBS 248 metrics, AI remediation plans).
   - Where data is stored (local in-memory state, structured mock JSON, browser local storage, and optional persistent PostgreSQL/Supabase layer).
   - Where the system will be deployed (GitHub Pages for client-side prototype, Vercel/Node environment for server routes).
   - What “done” looks like (fully functional, responsive cockpit that dynamically responds to stress sliders and generates actionable treasury remediation recommendations without runtime errors).
3. Show the file to the user.
4. **Wait for approval.**
No code should be written before `project_specs.md` is approved.

---

## Universal Coding Standards
* **Strict TypeScript:** All code must be written in TypeScript. Avoid using the `any` type under any circumstance. Define strict interfaces/types for all API responses, component props, and calculation states.
* **Modularity:** Keep components small, decoupled, and modular. Extract calculation engines, live market data hooks, and LLM integrations into custom hooks or utility services, keeping UI components purely focused on presentation.
* **Environment Security:** Never hardcode API keys, secrets, or institutional tokens. Always use a `.env` file for local development and provide a comprehensive `.env.example` file.
* **Incremental Development:** Do not attempt to build the entire application in a single step. Build the foundational structure first, verify it works locally, then add features incrementally across defined maturity tiers.
* **Graceful Error Handling:** Always implement proper loading states, shimmer skeletons, and React Error Boundaries. If an external API (like an FX feed or LLM gateway) fails, provide clean fallback deterministic values without crashing the UI.
* **Package Manager:** **ALWAYS use `pnpm`** (instead of `npm` or `yarn`) for all package installations, project creations (e.g., `pnpm create vite`), and script executions (`pnpm run dev`, `pnpm run build`) to save disk space and ensure reproducible dependency lockfiles. Never use `npm`.

---

## Deployment Standards (GitHub Pages)
To ensure consistency across projects, follow these standard steps for deploying Vite-based applications to GitHub Pages:

### 1. Environment Configuration
* **Base Path:** In `vite.config.ts`, you MUST set the `base` property to match the GitHub repository name. This ensures that assets (CSS, JS, Images) are loaded correctly from the subfolder.
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPOSITORY-NAME/',
});

```

### 2. Deployment Tooling

* **Package:** Install `gh-pages` as a development dependency using `pnpm`:

```bash
pnpm add -D gh-pages

```

* **Scripts:** Add the following deployment scripts to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "predeploy": "pnpm run build",
  "deploy": "gh-pages -d dist"
}

```

### 3. Launch Workflow

Follow this 3-step sequence for every deployment, **but before moving to GitHub get explicit confirmation first**:

1. **Source Sync:** Commit and push all source code changes to the `main` branch.
2. **Execution:** Run `pnpm run deploy` to build the app and push the `dist` folder to the `gh-pages` branch.
3. **Activation:** In GitHub Settings > Pages, ensure the source is configured to deploy from the `gh-pages` branch.

### 4. Troubleshooting Checklist

* **Clean Build:** If the build fails, check for unused imports, dead variables, or missing type definitions. The `tsc` (TypeScript Compiler) will fail the build if strict rules are violated.
* **Asset Errors:** If the live site shows a blank page or 404s for chunk assets, verify the `base` path in `vite.config.ts` matches the repository name exactly (including leading and trailing slashes).

---

## Change Confirmation & Git Governance

* **Before moving any code change to GitHub, always ask first for explicit confirmation.** Testing must occur locally first (`pnpm run dev` and `pnpm run build`).
* **Do not move any code change to production or push commits without explicit user confirmation.** Remember to request confirmation every single time there is a functional modification, refactor, or deployment step.

---

## Living Documentation Requirements

* **`explainer.md`:** Maintain a living documentation file explaining:
* Key financial concepts implemented (BCBS 248, RTGS, Nostro/Vostro accounts, Daylight Overdraft limits, CLS settlement windows).
* The mathematical stress simulation logic and formulas.
* System architecture diagrams and state-flow explanations.


* **`prompts.md`:** Continuously record and update the exact prompts, instructions, and engineering context used throughout development. Whenever a major new feature or architectural change is introduced, append the updated prompt specifications and rationale to `prompts.md`.

```

```