# NILA launch reel

HyperFrames source for the 30-second portrait film. The user supplied the exact storyboard and authorized rendering; no additional render approval was needed. Assets originate from the actual Nila public preview and existing Nila project. No customer data is used.

The film is a demonstration of an illustrative approved full call. The short audio conversation is edited and does not account for every JSON value. Water and sleep goals are illustrative references. The original product shows a mood score, not a clinical wellness score.

Local reproducible audio setup: `uv run --no-project --with kokoro-onnx --with soundfile --with faster-whisper python scripts/audio.py`. It downloads public Kokoro stock model assets to the user's cache and synthesizes original audio. The connected ElevenLabs free plan was deliberately not used for commercial speech.

To rebuild visuals: `node scripts/build.mjs`. This also writes the companion homepage source in ../nila-homepage. After rebuilding, rerun the voiceover carve: `node C:/Users/erohi/.agents/skills/hyperframes-audio/scripts/carve.mjs --comp ./index.html`. Check before rendering with `npm run check`. The reel renders with `npx hyperframes@0.8.155 render --quality delivery --fps 30 --output renders/nila-launch-reel.mp4`.

Final verification and limitations are recorded in ../../docs/nila/product-launch-video.md. Website media uses only the silent companion loop. The full reel remains a separate promotional asset.
