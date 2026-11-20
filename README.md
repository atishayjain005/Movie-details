# Movie-details

React movie-browsing demo originally built as a GeekSynergy assignment. The home page and `/dashboard` show Kannada movies from the external Hoblist provider. No account is required.

The interface handles loading, empty data, malformed responses, request failures, a ten-second timeout and retry. Movie votes are read-only. The provider does not supply a usable trailer link in the supported contract, so cards explicitly say trailers are unavailable.

## Run and verify

Use Node.js 22 and npm:

```sh
npm ci
npm start
npm test -- --watchAll=false --runInBand
CI=true npm run build
npx playwright install chromium
npm run test:browser
```

The production build runs Create React App's ESLint checks. Browser tests serve `build/` and use synthetic test-only provider fixtures. They cover 320, 768 and 1280px layouts, keyboard access, storage preservation and failure recovery. Fixture tests do not prove the external service is working. There is no TypeScript checker.

## Current release blockers

- On November 21, 2026 IST, POST `https://hoblist.com/api/movieList` redirected and returned an HTML page instead of movie JSON. The UI reports the failure, but live movie browsing is not verified. A provider replacement needs a separately scoped proposal; no paid API is configured.
- `npm audit` on the legacy dependency tree reports 84 findings (7 critical, 41 high, 22 moderate, 14 low). A framework/dependency migration needs separate assessment before production readiness. Do not use `npm audit fix --force` blindly.
- Old signup/login source remains disabled and is not production authentication. It stores plaintext credentials under `localStorage.data`; do not enable it or enter real credentials. This change does not delete existing browser data.

## Existing deployment

Repository homepage: https://geek-synergy.vercel.app. The existing site returned HTTP 200 during inspection; that does not prove it contains this branch. No new hosting, paid service or account was provisioned.

For release, resolve the provider and dependency blockers, review/merge the PR, verify the existing Vercel build/runtime settings, and test the actual served site. Configure an SPA fallback to `index.html` if direct `/dashboard` navigation is not already supported. Verify home/deep links, keyboard navigation, mobile layout, real provider access, retry and missing data. A successful local build or PR is not a deployment.

Ideas, scope and decisions: [improvement register](docs/improvement-log.md).
