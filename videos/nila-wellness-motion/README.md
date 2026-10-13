# Nila HyperFrames ornaments

The editable HTML/SVG compositions produce the website's silent decorative loops. They contain no user data. User-specific water, sleep, mood, stress, goals and charts stay in React and respond to authenticated JSON updates.

## Edit together

From this directory, run `npm run dev` to open HyperFrames Studio. The default `index.html` previews the Aurora ornament. Each source is in `compositions/`; `generate.mjs` is the shared deterministic authoring source. Regenerating overwrites the generated composition HTML, so apply reusable changes to that source.

The project pins HyperFrames 0.8.153. The CLI was upgraded from 0.8.152 and the full check passed on 0.8.153. Windows rendering uses the installed FFmpeg and Chromium; no Rive runtime or desktop editor is involved.

## Website files

Assets are in `apps/web/public/animations/hyperframes` relative to the repository root. Each pair uses the same basename:

| Basename | Decoration | Canvas |
|---|---|---|
| sunday | Coral sphere | 192×192 |
| monday | Blue sphere | 192×192 |
| tuesday | Violet sphere | 192×192 |
| wednesday | Lilac sphere | 192×192 |
| thursday | Sky-blue sphere | 192×192 |
| friday | Orange sphere | 192×192 |
| saturday | Mint sphere | 192×192 |
| aurora | Iridescent sphere and orbit | 256×256 |
| sleep | Crescent, cloud and stars | 192×192 |
| water-wave | Decorative surface motion | 192×64 |

WebM exports use VP9 with transparency, four seconds at 24 fps, no audio. PNG posters preserve alpha and work when animation is disabled or decoding is unavailable. The water-wave ornament does not carry a fill amount; website code controls actual reported hydration independently.

## Regenerate and verify

Run `node generate.mjs`, then `npm run check`. Preview the motion and inspect proof snapshots before exporting. A sample export is:

```powershell
npx --yes hyperframes@0.8.153 render . --composition compositions/sunday.html --format webm --fps 24 --low-memory-mode -q high -o ../../apps/web/public/animations/hyperframes/sunday.webm
ffmpeg -c:v libvpx-vp9 -i ../../apps/web/public/animations/hyperframes/sunday.webm -frames:v 1 ../../apps/web/public/animations/hyperframes/sunday.png
```

The low-memory profile uses one capture worker to avoid memory pressure. Final loops have been decoded with FFmpeg, durations checked with FFprobe and transparent posters visually inspected. Aurora, sleep and water-wave received separate runtime/layout checks and sampled proof frames. No text exists in the ornament clips; dashboard contrast and accessible descriptions are checked separately.

## Provenance

Shapes and palettes are original vector work based on the user-supplied Nila dashboard screenshot. The HyperFrames catalog was searched before authoring. Its Shimmer Sweep reflected-light pattern informed the customized sphere highlight; its Cosmic Orb GPU effect was evaluated but not shipped for these small icons. `compositions/components/shimmer-sweep.html` records that registry reference. `assets/gsap.min.js` is the original GSAP 3.14.2 browser distribution with its upstream license notice preserved. See [GSAP licensing](https://gsap.com/community/standard-license/) and [HyperFrames](https://github.com/heygen-com/hyperframes).
