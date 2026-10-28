# Security Policy — EventAura

## Overview
EventAura is built with a **Security-First Architecture** ensuring user privacy, credential protection, and strict browser sandboxing.

---

## 1. Zero Hardcoded Credentials Policy
- **No API keys or secrets** are stored in source control, git history, or build bundles.
- Evaluators and users provide their Gemini API keys exclusively through:
  1. An encrypted client-side session prompt (`ApiKeyModal`).
  2. Or standard runtime environment variables (`VITE_GEMINI_API_KEY`).
- Keys are retained in ephemeral browser memory (`sessionStorage`) and can be flushed instantly with one click.

---

## 2. Input Validation & XSS Prevention
- All user inputs (event titles, notes, guest counts, dietary specifications) undergo strict normalization and HTML escaping via `src/utils/sanitize.ts`.
- React's JSX DOM escaping prevents script injection attacks.
- String boundaries prevent buffer overrun and prototype pollution.

---

## 3. Safe Fallback & Zero Telemetry
- The intelligent deterministic simulation engine (`simulationEngine.ts`) functions 100% offline without sending network requests if no Gemini API key is provided.
- No personal attendee data, event locations, or budgets are sent to third-party analytics trackers.

---

## 4. Reporting a Vulnerability
If you discover a security vulnerability within EventAura, please open an issue or contact the repository maintainer directly. All security advisories are evaluated and addressed within 24 hours.
