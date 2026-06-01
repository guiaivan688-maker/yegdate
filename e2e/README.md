# yeg-date E2E tests (Playwright)

Smoke + critical-funnel tests to catch regressions before they hit prod.

## Run locally

```bash
npm run test:e2e        # headless, CI-style output
npm run test:e2e:ui     # interactive UI (recommended while debugging)
```

The config auto-starts `npm run dev` on `:3000` if no server is running.

## Coverage

- **navbar.spec.ts** — Mega-menu opens each bucket, links navigate, language toggles.
- **reserver-funnel.spec.ts** — `/reserver` shows offers or friendly empty state; selecting an offer reveals the form; required fields enforced; min-date blocks past dates.
- **picnic-builder.spec.ts** — `/pique-nique` occasion + park + options happy path; submit reaches "done" state.
- **segment-pages.spec.ts** — `/couples`, `/famille`, `/amis`, `/business` all render hero + cards + guest counter responds.

## Conventions

- Use `page.getByRole`, `page.getByText` (resilient to refactors).
- No external network dependence (Stripe redirect is asserted as "starts navigation" not "completes").
- Don't depend on specific JSON data counts — they change.

## CI

Suggested GitHub Actions workflow (not yet wired):

```yaml
name: e2e
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
```
