# Nila: approved interface and voice-data fixes

The user approved this bounded repair on October 13, 2026. Keep the existing Next.js website, Python voice service, authenticated API and owner-bound Supabase records.

## Interface

- Adult confirmation appears above signup providers. Google and GitHub enable after confirmation. Existing-account sign-in does not request it again.
- Confirmed permission writes release the save button immediately; the dashboard reload runs separately. Authentication and network waits have deadlines, with visible errors and no automatic repeat writes. Success requires the server to return saved: true.
- Remove the 32-connections grid and all metric detail popups. Keep profile, privacy and nightly scheduling controls.
- Strengthen the existing lavender, blue, sage, peach and cream card colors. Add landing scroll reveals, account entrance and loading motion, with HyperFrames orb playback and animated poster fallbacks. Pause controls and reduced-motion remain available.

## Voice data

One question at a time, concise acknowledgement, one clarification if needed. Read back the draft, accept corrections and obtain explicit approval before saving. Keep the existing terminal Gather path. This repair does not migrate Gather into the deployed SaaS voice service.

Example approved observation:

```json
{
  "topic": "water",
  "value": 5,
  "unit": "L",
  "quote": "Today, I have drunk 5 L of water."
}
```

The voice validator and API validator accept L or liters. Store 5, show 5 L. Chart fill is decorative and never modifies the stored amount. Planned, uncertain and negative quantities require clarification. Unreported topics show a dash. No additional summarization model or API key is required.

The voice service sends approved JSON to the authenticated internal reflection endpoint. The API derives user_id from the call session, never trusts a supplied owner ID, and saves within a transaction. Private realtime events cause that user's dashboard to reload.

## Skills

Use the approved brainstorming repair design, frontend-ui-engineering and restrained scroll-craft principles. Reuse verified HyperFrames motion-graphics assets. HeroUI Native targets React Native and is unsuitable for this Next.js repair. Visualize is for explanatory artifacts and is unnecessary here. Matt Pocock repository setup needs separate tooling choices; no global installation or repository instruction rewrite was made.

## Verification and release

Targeted Python and API checks verify spoken approval, units, planned-data rejection and owner-bound JSON storage. Browser checks cover desktop/mobile, adult confirmation before Google routing, successful mutation completion during a pending reload, missing data, period switching, motion pause and reduced motion. Google routing is mocked; a fresh real Google login and real permission write still need user verification.

Backend wellness columns require the pending voice-wellness migration and Render API/voice release before production capture can be claimed. No real call or database migration was performed for this repair.

Local verification: 18 desktop/mobile browser checks passed; 39 Python checks passed across voice wellness, phone, Gather and bridge; 20 targeted API/schema checks passed; production compilation and TypeScript passed. Tested landing/dashboard light and dark states had no Axe violations. Desktop and mobile screenshots were inspected.

Published website commit 0823149a34bde3cb3d13693b55419742310f1eae. Vercel deployment dpl_GQupsEuxo2ibAuHwpLMEdGcYhK18 reports Ready and owns https://nilavoiceai.vercel.app. Backend fix: https://github.com/ROHITHELAYARAJA/Voice-Agent/pull/3, commit 78c6619783ba2c305b7a84be91248919c72163fc.

Read-only production checks confirmed the journal_entries.wellness column and voice_memories table are absent. Supabase migration history lists only nila_initial_tenant_schema and supabase_cron_scheduler. The prepared 202610130001_voice_wellness.sql adds those fields and restricts manual wellness writes; it does not delete historical records. Its ten tenant-isolation checks passed locally. Production database changes and Render release remain an explicit approval step from the original build brief.
