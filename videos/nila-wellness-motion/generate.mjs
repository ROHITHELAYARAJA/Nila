import { mkdir, writeFile } from 'node:fs/promises';

const colors = {
  sunday: ['#ffebeb', '#ff777f', '#ee405b', '#ffc3cd'],
  monday: ['#e6f9ff', '#65b8ff', '#237cf5', '#b9d9ff'],
  tuesday: ['#f1deff', '#9653ff', '#5929e9', '#cba5ff'],
  wednesday: ['#ffe6ff', '#df8cff', '#b742ef', '#f0b5ff'],
  thursday: ['#e3fbff', '#6cbdff', '#208bf9', '#b7e0ff'],
  friday: ['#fff3de', '#ffb66d', '#ff7730', '#ffd7a9'],
  saturday: ['#dffff0', '#59ddb1', '#0ba677', '#acf8d8'],
};

await mkdir('compositions', { recursive: true });
await mkdir('assets', { recursive: true });

function orb(name, palette, aurora = false) {
  const extra = aurora ? '<radialGradient id="peach"><stop stop-color="#ffce82"/><stop offset="1" stop-color="#ffb284" stop-opacity="0"/></radialGradient><radialGradient id="cyan"><stop stop-color="#25ccfa"/><stop offset="1" stop-color="#79afff" stop-opacity="0"/></radialGradient><radialGradient id="pink"><stop stop-color="#ff83d6"/><stop offset="1" stop-color="#dd7cff" stop-opacity="0"/></radialGradient>' : '';
  const blends = aurora ? '<circle cx="122" cy="52" r="49" fill="url(#peach)"/><circle cx="65" cy="132" r="51" fill="url(#cyan)"/><circle cx="74" cy="50" r="43" fill="url(#pink)"/>' : '';
  const orbit = aurora ? '<ellipse id="orbit" cx="96" cy="96" rx="85" ry="28" fill="none" stroke="#fff5ea" stroke-width="1.6" opacity=".75" transform="rotate(-20 96 96)"/><path class="star" d="M166 23l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#b45cff"/><path class="star" d="M23 123l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="#ffbd63"/>' : '';
  return `<svg viewBox="0 0 192 192" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glass" cx="31%" cy="22%" r="86%"><stop stop-color="${palette[0]}"/><stop offset=".24" stop-color="${palette[1]}"/><stop offset=".68" stop-color="${palette[2]}"/><stop offset="1" stop-color="${palette[3]}"/></radialGradient><radialGradient id="spec"><stop stop-color="white" stop-opacity=".98"/><stop offset=".4" stop-color="white" stop-opacity=".4"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient><radialGradient id="rim" cx=".5" cy=".5"><stop offset=".7" stop-color="white" stop-opacity="0"/><stop offset=".9" stop-color="white" stop-opacity=".12"/><stop offset="1" stop-color="white" stop-opacity=".8"/></radialGradient><clipPath id="sphere-clip"><circle cx="96" cy="91" r="63"/></clipPath><filter id="soft" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>${extra}</defs><ellipse id="shadow" cx="96" cy="167" rx="43" ry="5" fill="${palette[2]}" opacity=".15" filter="url(#soft)"/><g id="floating" data-layout-allow-overflow><circle cx="96" cy="91" r="66" fill="${palette[1]}" opacity=".08"/><g clip-path="url(#sphere-clip)"><circle cx="96" cy="91" r="63" fill="url(#glass)"/>${blends}<ellipse cx="63" cy="58" rx="21" ry="27" fill="url(#spec)" transform="rotate(31 63 58)"/><ellipse id="reflection" cx="123" cy="108" rx="19" ry="31" fill="url(#spec)" opacity=".3"/><circle cx="96" cy="91" r="63" fill="url(#rim)"/><path d="M44 79c-3 25 15 57 48 63" fill="none" stroke="white" stroke-opacity=".42" stroke-width="2"/><circle cx="69" cy="60" r="3" fill="white" opacity=".95"/></g>${orbit}</g></svg>`;
}

function sleep() {
  return `<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="moon" x2="1" y2="1"><stop stop-color="#ba83ff"/><stop offset="1" stop-color="#6630f0"/></linearGradient><linearGradient id="cloud" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e1daff"/></linearGradient><filter id="shade" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs><ellipse cx="99" cy="161" rx="47" ry="6" fill="#9972ea" opacity=".1" filter="url(#shade)"/><g id="floating" data-layout-allow-overflow><path d="M122 39a57 57 0 1 0 29 87c-34 8-72-24-61-61 5-13 18-23 32-26z" fill="url(#moon)"/><path d="M63 71c-16 23-6 61 19 73" fill="none" stroke="#d4bbff" stroke-width="3" opacity=".8"/><path class="star" d="M148 35l3 10 10 3-10 3-3 10-3-10-10-3 10-3z" fill="#a978ef"/><circle class="star" cx="51" cy="38" r="3" fill="#c0a3f7"/></g><g id="cloud" fill="url(#cloud)"><path d="M80 133c-20-1-21-27-3-31 6-22 37-24 48-4 22-5 40 10 33 27-1 5-7 9-14 9H80z"/><path d="M88 112c8-18 30-15 34-6" fill="none" stroke="white" stroke-width="3" opacity=".9"/></g></svg>`;
}

function wave() {
  return `<svg viewBox="0 0 192 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#47b7ff" stop-opacity=".55"/><stop offset="1" stop-color="#008cff" stop-opacity=".12"/></linearGradient></defs><g id="wave"><path d="M-192 26q24-14 48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0V70H-192z" fill="url(#sea)"/><path d="M-192 26q24-14 48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0" fill="none" stroke="#83d9ff" stroke-width="2"/></g></svg>`;
}

function document(name, graphic, width = 192, height = 192) {
  const main = name === 'water-wave' ? 'tl.fromTo("#wave", {x:0}, {x:96,duration:4,ease:"none"},0);' : 'tl.to("#floating", {y:-7,duration:2,ease:"sine.inOut",yoyo:true,repeat:1},0);';
  const highlight = name === 'sleep' ? 'tl.to("#cloud",{x:6,duration:2,ease:"power1.inOut",yoyo:true,repeat:1},0);tl.to(".star",{opacity:.4,duration:1,ease:"sine.inOut",yoyo:true,repeat:3},0);' : name === 'water-wave' ? '' : 'tl.to("#reflection",{x:-9,opacity:.45,duration:2,ease:"power2.inOut",yoyo:true,repeat:1},0);tl.to("#shadow",{scaleX:.86,opacity:.1,svgOrigin:"96 167",duration:2,ease:"sine.inOut",yoyo:true,repeat:1},0);';
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}, height=${height}"><title>Nila ${name} decorative loop</title><script src="../assets/gsap.min.js"></script><style>*{box-sizing:border-box}html,body{margin:0;background:transparent;overflow:hidden}#stage{position:relative;width:100%;height:100%;overflow:hidden}.clip{position:absolute;inset:0;display:grid;place-items:center}svg{display:block;width:100%;height:100%}</style></head><body><div id="stage" data-composition-id="${name}" data-start="0" data-duration="4" data-fps="24" data-width="${width}" data-height="${height}">${graphic.replace('<svg ', `<svg id="${name}-decoration" class="clip" data-start="0" data-duration="4" data-track-index="0" `)}</div><script>const tl=gsap.timeline({paused:true});${main}${highlight}window.__timelines["${name}"]=tl;tl.seek(0);</script></body></html>`;
}

for (const [name, palette] of Object.entries(colors)) await writeFile(`compositions/${name}.html`, document(name, orb(name, palette)));
await writeFile('compositions/aurora.html', document('aurora', orb('aurora', colors.tuesday, true), 256, 256));
await writeFile('compositions/sleep.html', document('sleep', sleep()));
await writeFile('compositions/water-wave.html', document('water-wave', wave(), 192, 64));
await writeFile('index.html', document('aurora', orb('aurora', colors.tuesday, true), 256, 256).replace('../assets/gsap.min.js', './assets/gsap.min.js'));
await writeFile('shot-plan.json', JSON.stringify({ category: 'logo-reveal', duration_s: 4, fps: 24, canvas: { w: 256, h: 256, aspect: '1:1' }, style: 'Pastel glass wellness ornament, original SVG', palette: colors.tuesday, export: 'alpha-overlay', asset_needs: [], content: { logo: 'original inline SVG', tagline: '', customize: 'Gentle rise and reflected light' }, evaluated_blocks: ['cosmic-orb', 'shimmer-sweep'], notes: 'Small SVG assets avoid full-frame GPU shaders and carry no user data.' }, null, 2));
