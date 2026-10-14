import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
for(const folder of ['assets','assets/audio','scripts','compositions/frames','renders','proof'])fs.mkdirSync(folder,{recursive:true});
const site=path.resolve(root,'../../apps/web');
for(const name of ['tuesday','aurora','water-wave','sleep'])for(const ext of ['png','webm'])fs.copyFileSync(path.join(site,'public/animations/hyperframes',`${name}.${ext}`),`assets/${name}.${ext}`);
for(const weight of [400,500,600,700])fs.copyFileSync(path.join(site,'src/fonts',`manrope-latin-${weight}-normal.woff2`),`assets/manrope-${weight}.woff2`);
fs.copyFileSync(path.join(site,'src/fonts/OFL.txt'),'assets/FONT-LICENSE.txt');
const svgs=fs.readdirSync('capture/assets/svgs');
const mark=svgs.find(name=>fs.readFileSync(`capture/assets/svgs/${name}`,'utf8').includes('M128,24'));
fs.writeFileSync('assets/brand-candidates.json',JSON.stringify(svgs));
const scenes=[
['hook',3,'What if your daily tracker called YOU?','Immediate kinetic type. First second: What if, daily tracker. YOU lands at 0.9 with a phone-ring line. NILA lotus lockup resolves at 2.2. No footage or characters.'],
['call',4,'Meet NILA. Your nightly AI companion.','At 0 reveal 8:00 PM and incoming NILA phone UI. At 1.1 accept control depresses, call status changes and the ring becomes an active waveform. Hold active call through 4.'],
['conversation',5,'How was your day? Seven hours of sleep. 1.8 liters of water. Three goals done. Got it!','Two distinct, measured audio-driven waveforms. Speaker bubbles follow actual audio timing supplied in assets/audio/timing.json. Keep active utterance text in the central panel, captions in the lower safe band.'],
['data',4,'VOICE → ANSWERS → JSON → SYNCED','Voice line resolves into an approved-data panel. Reveal JSON fields in groups across the shot. Eight explicit demonstration values and checkmarks. Mark Illustrative full-call data. No endpoints, keys or customer IDs.'],
['dashboard',8,'Your dashboard updates from approved answers.','Focused original Nila metric cards. Water 0 to 1.8 L, 72% of demo goal 2.5 L; sleep 7/8 h at 88%; seven energy bars; stress 3/10; goals 3/5 circles at 60%; original tuesday mood orb at 6/10. Stagger reveals over 7 seconds, hold last second.'],
['overview',3,'One conversation. Your whole day, organized.','Actual captured dashboard cropped to exclude the header containing the illustrative profile name. Zoom out smoothly to show mood score, weekly mood history, chart, movement, meals, reflection, daily win, report and consistency. Brief focus highlight on previous days.'],
['close',3,'NILA. One call. A clearer day.','Approved lotus logo with nila wordmark. One call. A clearer day. Your nightly AI companion. Meet NILA. Settle and hold a strong poster frame through end.']
];
const storyboard=`---\nformat: 1080x1920\nduration: 30s\nmessage: "Your daily wellness tracker updates simply by talking."\narc: Hook → Call → Conversation → Approved data → Dashboard → History → Brand\naudience: Adults who prefer talking to daily forms\nmode: autonomous\nmusic: none\n---\n\n`+scenes.map(([name,duration,copy,direction],i)=>`## Frame ${i+1} — ${name}\n\n- status: outline\n- src: compositions/frames/0${i+1}-${name}.html\n- duration: ${duration}s\n- transition_in: cut\n- scene: ${copy}\n- blueprint: compose\n- asset_candidates: assets/logo.svg, assets/dashboard.png, assets/tuesday.png\n- poster: ${duration-0.5}s\n\n${direction}\n`).join('\n');
fs.writeFileSync('STORYBOARD.md',storyboard);
fs.writeFileSync('SCRIPT.md',`# SCRIPT — NILA\n\n**Voice:** Local Kokoro af_heart (NILA/narrator), am_adam (sample user).\n**Voice direction:** Warm, clear, conversational.\n\n## Line 1 — Intro (Frame 2)\n\n    Meet NILA. Your nightly AI companion.\n\n## Line 2 — Question (Frame 3)\n\n    How was your day?\n\n## Line 3 — Answer (Frame 3)\n\n    Seven hours of sleep. 1.8 liters of water. Three goals done.\n\n## Line 4 — Acknowledgement (Frame 3)\n\n    Got it!\n`);
fs.writeFileSync('.gitignore','renders/\nproof/\n.hyperframes/\nnode_modules/\ncapture/\n');
fs.writeFileSync('assets/PROVENANCE.md',`# Provenance\n\nDashboard captured from https://nilavoiceai.vercel.app/preview on 2026-10-14. It contains demonstration data. Only the dashboard region is used; profile identity is excluded. Logo and type are extracted from existing Nila code/capture. Existing orb art is reused unchanged.\n\nSpeech: Kokoro-82M stock voices, Apache-2.0, https://huggingface.co/hexgrad/Kokoro-82M. Runtime: kokoro-onnx MIT. Original music and SFX synthesized mathematically for this production; no samples or commercial catalog music.\n`);
console.log('Prepared locked brief, seven-scene storyboard and existing brand assets.');
