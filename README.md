# Nila

A private AI self-care companion: optional voice check-ins, user-reported moods, journals and a 30-day self-care challenge.

This repository contains the Next.js website and shared browser-safe packages. The Node API, durable scheduler, Supabase migrations and Python voice engine remain in [Voice-Agent](https://github.com/ROHITHELAYARAJA/Voice-Agent).

Run `npm ci` and `npm run dev`, then open <http://localhost:3000>. Explore <http://localhost:3000/preview> for an explicitly labelled interactive sample. Private customer data requires the configured product API.

Use `apps/web` as the Vercel root with access to outside workspace files. Set browser-safe Supabase and product API variables from `apps/web/.env.example`. Google OAuth secrets and backend keys belong only in server settings. Both the repository-root and app-root Vercel configuration disable Git deployment until explicit approval, including projects initially connected with the repository root selected.

Read [setup and deployment](docs/nila/setup-and-deployment.md), [design system](docs/nila/design-system.md), [verification results](docs/nila/verification-results.md), and [launch gates](docs/nila/launch-gates.md).

## Verification

`npm run typecheck`, `npm run build`, and `npm run test:browser`.

The installed taste skill is in `.agents/skills/design-taste-frontend`. Marketing uses variance 6, motion 3 and density 3; customer workflows follow accessibility and privacy requirements.
