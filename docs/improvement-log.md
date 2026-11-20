# Movie-details improvement register — 2026-11-21 IST

Baseline: July 2022; no existing PR/issues or dedicated Project. Project: https://github.com/users/atishayjain005/projects/18

| Problem | Proposed improvement and reason | Expected impact | Complexity | Risk | Recommendation | Deployment |
| --- | --- | --- | --- | --- | --- | --- |
| Blank home route; brand clears all storage | Restore browsing at / and safe client navigation; unknown-route recovery | Usable entry and preserved browser data | Small | Low | Implement | Existing Vercel build |
| Silent failed requests | HTTP/schema checks, cancellation, timeout, loading/empty/error and retry | Recoverable browsing failures | Medium | Low | Implement | Existing Vercel build; verify provider CORS |
| Partial movie data crashes; runtime/date mistakes | Normalize records and safe media URLs; accurate optional metadata | Resilient readable cards | Medium | Low | Implement | Existing Vercel build |
| Layout and disclosure inaccessible | Landmarks, heading order, responsive cards, keyboard disclosure, honest unavailable trailer | Keyboard/mobile access and clear limitations | Small | Low | Implement | Existing Vercel build |
| No regression/release workflow | Automated test/build CI, documented release gates | Reproducible review | Small | Low | Implement | CI then served verification |
| Disabled auth persists plaintext passwords | Keep routes disabled; separately scope real auth or removal with approval | Avoid implying secure accounts | Large | High | Backlog; no change proposed for approval yet | Requires separate security/design review |

No approval requests, deadlines, or auto-approvals in this run. Existing public homepage is https://geek-synergy.vercel.app; deployment is separate from commit/push/PR.

## Validation

Each implementation commit runs the growing React regression suite, production build (including ESLint), and git diff check. No TypeScript in this project. Initial CI build found a deprecated color-adjust rule in Bootstrap 5.1; compatible Bootstrap 5.2.3 resolves that build blocker.

Final checks: 12 React/unit tests and five Chromium tests pass, with 320/768/1280px layout checks and visually inspected mobile screenshot. Production build and diff checks pass. GitHub CI added on Ubuntu 24.04 / Node 22. npm audit: 84 findings (7 critical, 41 high, 22 moderate, 14 low); separate dependency migration remains Backlog.

Provider check: POST redirected to HTML rather than movie JSON. Existing Vercel homepage returned HTTP 200, but branch runtime is not deployed or verified. Do not claim production readiness. Implementation moves to Review / Testing; dependency/provider/served-release work remains Backlog. No approvals or auto-approvals.
