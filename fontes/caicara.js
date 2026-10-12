/* ================= JOGO: Caiçaras, entre a serra e o mar ================= */
function jogoCaicara(palco, api){
  semente = 311;
  let vivo = true, fase = 'ler', dia = 0, ocupado = false, remadas = 0, puxadas = 0, escolhas = 0, guardados = 0, lixos = 0, notas = 0, selec = -1;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k), k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const P = v => (+v).toFixed(1), PI = Math.PI;
  const HZ = 205;
  const SOL0 = { x:700, y:64 };
  const PRAIA = { x:282, y:452 }, LARGA = { x:548, y:462 }, ATRACA = { x:604, y:400, k:.92 };
  const CERCO = { x:680, y:304, rx:100, ry:40 }, SALA = { x:572, y:304, rx:36, ry:24 };
  const BALAIO = { x:608, y:384 };
  const SACO = { x:128, y:378 };
  const PEIXES = [
    { t:'filhote', x:618, y:291 }, { t:'grande', x:642, y:290 }, { t:'grande', x:694, y:288 }, { t:'filhote', x:744, y:292 },
    { t:'grande', x:620, y:316 }, { t:'tartaruga', x:674, y:316 }, { t:'grande', x:724, y:316 }, { t:'filhote', x:762, y:308 }
  ];
  const LIXO = [{ id:'rede', x:298, y:306 }, { id:'garrafa', x:336, y:326 }, { id:'sacola', x:252, y:352 }, { id:'lata', x:196, y:404 }, { id:'chinelo', x:438, y:476 }];
  /* ---------- formas ---------- */
  const blob = (cx, cy, rx, ry, n, amp) => {
    const pts = []; for (let i = 0; i < n; i++) { const a = i / n * PI * 2, k = 1 + R(-amp, amp); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    const m = (a, b) => `${P((a[0] + b[0]) / 2)} ${P((a[1] + b[1]) / 2)}`;
    let d = `M${m(pts[n - 1], pts[0])}`; for (let i = 0; i < n; i++) d += ` Q${P(pts[i][0])} ${P(pts[i][1])} ${m(pts[i], pts[(i + 1) % n])}`; return d + 'Z';
  };
  /* ---------- gente ---------- */
  const cabeca = o => { const r = o.r || 11, pe = o.pele, pk = o.peleE, cb = o.cabelo || '#1E140E', ck = o.cabeloE || '#0E0806', q = v => P(v * r);
    let s = '';
    if (o.estilo === 'cacho') s += `<g fill="${cb}" stroke="${ck}" stroke-width=".8">${[[-1.05, -.15, .42], [-.95, -.7, .48], [-.5, -1.08, .5], [.05, -1.2, .54], [.58, -1.06, .5], [1, -.66, .46], [1.08, -.15, .4], [-1.12, .32, .32], [1.12, .3, .3]].map(([a, b, k]) => `<circle cx="${q(a)}" cy="${q(b)}" r="${q(k)}"/>`).join('')}</g><g fill="none" stroke="#fff" stroke-width=".7" opacity=".28">${[[-.8, -.95], [-.1, -1.45], [.62, -1.32]].map(([a, b]) => `<path d="M${q(a)} ${q(b)} a${q(.22)} ${q(.22)} 0 0 1 ${q(.34)} 0"/>`).join('')}</g>`;
    if (o.estilo === 'coque') s += `<circle cx="${q(-.15)}" cy="${q(-1.08)}" r="${q(.46)}" fill="${cb}" stroke="${ck}" stroke-width=".8"/><path d="M${q(-.45)} ${q(-1.22)} q${q(.3)} ${q(-.28)} ${q(.6)} 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".45"/>`;
    if (o.estilo === 'rabo') s += `<path d="M${q(.62)} ${q(-.62)} C${q(1.6)} ${q(-.72)} ${q(1.75)} ${q(.42)} ${q(1.3)} ${q(1.15)} C${q(1.22)} ${q(.42)} ${q(1)} ${q(-.08)} ${q(.55)} ${q(-.18)}Z" fill="${cb}" stroke="${ck}" stroke-width=".8"/><circle cx="${q(.86)} " cy="${q(-.56)}" r="${q(.17)}" fill="${o.laco || '#FF5A8A'}" stroke="#A8204E" stroke-width=".5"/>`;
    if (o.estilo === 'longo') s += `<path d="M${q(-1)} ${q(-.3)} C${q(-1.3)} ${q(.6)} ${q(-1.2)} ${q(1.3)} ${q(-.9)} ${q(1.6)} H${q(.9)} C${q(1.2)} ${q(1.3)} ${q(1.3)} ${q(.6)} ${q(1)} ${q(-.3)}Z" fill="${cb}" stroke="${ck}" stroke-width=".8"/>`;
    s += [-1, 1].map(l => `<ellipse cx="${q(l * .98)}" cy="${q(.12)}" rx="${q(.2)}" ry="${q(.27)}" fill="${pe}" stroke="${pk}" stroke-width=".8"/><path d="M${q(l * .98)} ${q(0)} q${q(l * .08)} ${q(.1)} 0 ${q(.22)}" stroke="${pk}" stroke-width=".6" fill="none" opacity=".6"/>`).join('');
    s += `<ellipse cx="0" cy="0" rx="${r}" ry="${q(1.06)}" fill="${pe}" stroke="${pk}" stroke-width="1"/>`;
    s += `<path d="M${q(-.86)} ${q(.3)} Q0 ${q(1.3)} ${q(.86)} ${q(.3)} Q0 ${q(.98)} ${q(-.86)} ${q(.3)}Z" fill="${pk}" opacity=".16"/>`;
    s += `<ellipse cx="${q(-.3)}" cy="${q(-.35)}" rx="${q(.55)}" ry="${q(.45)}" fill="url(#ccLuz)"/>`;
    const cap = `M${q(-1.03)} ${q(.05)} C${q(-1.12)} ${q(-1.25)} ${q(1.12)} ${q(-1.25)} ${q(1.03)} ${q(.05)} C${q(.86)} ${q(-.5)} ${q(.4)} ${q(-.52)} ${q(.05)} ${q(-.66)} C${q(-.3)} ${q(-.5)} ${q(-.8)} ${q(-.55)} ${q(-1.03)} ${q(.05)}Z`;
    if (o.estilo === 'cacho') s += `<g fill="${cb}" stroke="${ck}" stroke-width=".7">${[[-.82, -.52], [-.46, -.76], [-.05, -.82], [.36, -.76], [.74, -.56]].map(([a, b]) => `<circle cx="${q(a)}" cy="${q(b)}" r="${q(.3)}"/>`).join('')}</g>`;
    else if (!o.chapeu || o.estilo === 'longo') s += `<path d="${cap}" fill="${cb}" stroke="${ck}" stroke-width=".9" stroke-linejoin="round"/><path d="M${q(-.6)} ${q(-.78)} q${q(.4)} ${q(-.28)} ${q(.9)} ${q(-.12)}" stroke="#fff" stroke-width="${q(.12)}" fill="none" opacity=".28" stroke-linecap="round"/>`;
    else s += `<path d="M${q(-1.02)} ${q(.02)} C${q(-1.06)} ${q(-.4)} ${q(-.9)} ${q(-.55)} ${q(-.7)} ${q(-.6)} L${q(-.66)} ${q(-.3)}Z M${q(1.02)} ${q(.02)} C${q(1.06)} ${q(-.4)} ${q(.9)} ${q(-.55)} ${q(.7)} ${q(-.6)} L${q(.66)} ${q(-.3)}Z" fill="${cb}"/>`;
    if (o.barba) s += `<path d="M${q(-.84)} ${q(.3)} Q0 ${q(1.28)} ${q(.84)} ${q(.3)} Q${q(.5)} ${q(.86)} 0 ${q(.88)} Q${q(-.5)} ${q(.86)} ${q(-.84)} ${q(.3)}Z" fill="${o.barba}" opacity=".9"/><path d="M${q(-.38)} ${q(.5)} Q0 ${q(.36)} ${q(.38)} ${q(.5)}" stroke="${o.barba}" stroke-width="${q(.17)}" fill="none" stroke-linecap="round"/>`;
    s += [-1, 1].map(l => `<ellipse cx="${q(l * .38)}" cy="${q(.06)}" rx="${q(.13)}" ry="${q(.17)}" fill="#1A120C"/><circle cx="${q(l * .38 + .05)}" cy="${q(-.01)}" r="${q(.06)}" fill="#fff"/><path d="M${q(l * .38 - .18)} ${q(-.27)} q${q(.18)} ${q(-.12)} ${q(.36)} 0" stroke="${o.sobr || ck}" stroke-width="${q(.08)}" fill="none" stroke-linecap="round"/>`).join('');
    if (o.rugas) s += [-1, 1].map(l => `<path d="M${q(l * .6)} ${q(.02)} l${q(l * .15)} ${q(-.07)} M${q(l * .6)} ${q(.12)} l${q(l * .15)} ${q(.05)}" stroke="${pk}" stroke-width=".55" opacity=".75"/>`).join('') + `<path d="M${q(-.5)} ${q(.38)} q${q(.06)} ${q(.18)} ${q(.18)} ${q(.24)} M${q(.5)} ${q(.38)} q${q(-.06)} ${q(.18)} ${q(-.18)} ${q(.24)}" stroke="${pk}" stroke-width=".5" fill="none" opacity=".6"/>`;
    s += `<path d="M${q(-.08)} ${q(.3)} q${q(.1)} ${q(.1)} ${q(.18)} 0" stroke="${pk}" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${q(-.3)} ${q(.52)} Q0 ${q(.86)} ${q(.3)} ${q(.52)} Q0 ${q(.63)} ${q(-.3)} ${q(.52)}Z" fill="#7A2418" stroke="${pk}" stroke-width=".5" stroke-linejoin="round"/><path d="M${q(-.12)} ${q(.72)} q${q(.12)} ${q(.06)} ${q(.24)} 0" stroke="#FF8A7A" stroke-width="${q(.08)}" fill="none"/>`;
    s += [-1, 1].map(l => `<ellipse cx="${q(l * .62)}" cy="${q(.42)}" rx="${q(.18)}" ry="${q(.1)}" fill="#E8605A" opacity=".4"/>`).join('');
    if (o.chapeu) s += `<ellipse cx="0" cy="${q(-.6)}" rx="${q(1.8)}" ry="${q(.36)}" fill="url(#ccPalha)" stroke="#8A6420" stroke-width="1"/><path d="M${q(-.95)} ${q(-.66)} C${q(-.95)} ${q(-1.8)} ${q(.95)} ${q(-1.8)} ${q(.95)} ${q(-.66)}Z" fill="url(#ccPalha)" stroke="#8A6420" stroke-width="1"/><path d="M${q(-.96)} ${q(-.84)} Q0 ${q(-.66)} ${q(.96)} ${q(-.84)}" stroke="${o.fita || '#C8402A'}" stroke-width="${q(.22)}" fill="none"/><g stroke="#B88A3A" stroke-width=".5" fill="none" opacity=".8"><path d="M${q(-1.5)} ${q(-.56)} Q0 ${q(-.3)} ${q(1.5)} ${q(-.56)} M${q(-.6)} ${q(-1.26)} Q0 ${q(-1.38)} ${q(.6)} ${q(-1.26)} M${q(-.8)} ${q(-1.02)} Q0 ${q(-1.12)} ${q(.8)} ${q(-1.02)}"/></g><path d="M${q(-.6)} ${q(-1.34)} q${q(.4)} ${q(-.2)} ${q(.8)} ${q(-.1)}" stroke="#FFF2C0" stroke-width="${q(.12)}" fill="none" stroke-linecap="round" opacity=".8"/>`;
    if (o.bone) s += `<path d="M${q(-1.02)} ${q(-.3)} C${q(-1.1)} ${q(-1.3)} ${q(1.1)} ${q(-1.3)} ${q(1.02)} ${q(-.3)}Z" fill="${o.bone}" stroke="#12235A" stroke-width=".9"/><path d="M${q(.4)} ${q(-.34)} C${q(1)} ${q(-.5)} ${q(1.6)} ${q(-.4)} ${q(1.7)} ${q(-.24)} C${q(1.2)} ${q(-.16)} ${q(.8)} ${q(-.2)} ${q(.4)} ${q(-.26)}Z" fill="${o.bone}" stroke="#12235A" stroke-width=".9"/><path d="M${q(-.6)} ${q(-.9)} q${q(.4)} ${q(-.24)} ${q(.9)} ${q(-.14)}" stroke="#fff" stroke-width="${q(.1)}" fill="none" opacity=".5" stroke-linecap="round"/>`;
    return s; };
  const BRACO = { baixo:[-3, 11, -4, 22], aceno:[6, -6, 9, -17], frente:[7, 8, 15, 10], cima:[4, -8, 2, -19], cintura:[-7, 8, -2, 14] };
  const pessoa = o => { const c = o.crianca, k = c ? { cab:-60, r:12.5, omb:-47, cin:-27, sh:-15, br:.82 } : { cab:-80, r:11, omb:-65, cin:-37, sh:-21, br:1 };
    const pe = o.pele, pk = o.peleE, cm = o.camisa, ce = o.camisaE; let s = '';
    if (!o.sentado) {
      s += `<ellipse cx="0" cy="0" rx="17" ry="3.6" fill="#3A2A10" opacity=".22"/>`;
      const pernas = `M-5 ${k.cin + 4} L-6 -3 M5 ${k.cin + 4} L6 -3`;
      s += `<path d="${pernas}" stroke="${pk}" stroke-width="6.6" stroke-linecap="round"/><path d="${pernas}" stroke="${pe}" stroke-width="4.6" stroke-linecap="round"/>`;
      if (o.calca) s += `<path d="M-5 ${k.cin + 2} L-6 -10 M5 ${k.cin + 2} L6 -10" stroke="${o.calcaE}" stroke-width="7.6"/><path d="M-5 ${k.cin + 2} L-6 -10 M5 ${k.cin + 2} L6 -10" stroke="${o.calca}" stroke-width="5.8"/><path d="M-9.4 -10 h6.8 M2.6 -10 h6.8" stroke="${o.calcaE}" stroke-width="2.6" stroke-linecap="round"/><path d="M-4.6 ${k.cin + 6} L-5.4 -14" stroke="#fff" stroke-width=".8" opacity=".3"/>`;
      if (o.tamanco) s += [-1, 1].map(l => `<path d="M${l * 6.5 - 5.5} 0 h11 l-1 -4.4 h-9Z" fill="#9A6230" stroke="#3E220C" stroke-width=".9" stroke-linejoin="round"/><path d="M${l * 6.5 - 4.4} -4.2 q4.4 -3.4 8.8 0" fill="#5E3418" stroke="#3E220C" stroke-width=".8"/><path d="M${l * 6.5 - 5} -1.4 h10" stroke="#C88A50" stroke-width=".7"/>`).join('');
      else s += [-1, 1].map(l => `<ellipse cx="${l * 7}" cy="-.6" rx="5.4" ry="2" fill="${o.chinelo || '#2E7BF6'}" stroke="#12235A" stroke-width=".8"/><ellipse cx="${l * 7}" cy="-1.8" rx="4" ry="1.8" fill="${pe}" stroke="${pk}" stroke-width=".7"/><path d="M${l * 7 - 3} -1.4 L${l * 7} -3.2 L${l * 7 + 3} -1.4" stroke="${o.chinelo || '#2E7BF6'}" stroke-width="1.2" fill="none"/>`).join('');
    }
    if (o.saia) s += `<path d="M-10.5 ${k.cin - 1} L-15 ${k.sh + 3} Q0 ${k.sh + 7} 15 ${k.sh + 3} L10.5 ${k.cin - 1}Z" fill="${o.saia}" stroke="${o.saiaE}" stroke-width="1.1" stroke-linejoin="round"/><path d="M-5 ${k.cin + 2} l-3 ${k.sh - k.cin + 2} M5 ${k.cin + 2} l3 ${k.sh - k.cin + 2} M0 ${k.cin + 2} v${k.sh - k.cin + 4}" stroke="${o.saiaE}" stroke-width=".7" opacity=".55"/>${o.saiaFlor ? [[-8, k.sh], [-2, k.cin + 6], [6, k.sh - 1], [9, k.cin + 4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.4" fill="${o.saiaFlor}"/>`).join('') : ''}`;
    else if (o.calca) s += `<path d="M-10.5 ${k.cin - 2} L-10.8 ${k.cin + 7} H10.8 L10.5 ${k.cin - 2}Z" fill="${o.calca}" stroke="${o.calcaE}" stroke-width="1.1"/>`;
    else s += `<path d="M-10.5 ${k.cin - 2} L-11.8 ${k.sh} L-1 ${k.sh} L0 ${k.cin + 6} L1 ${k.sh} L11.8 ${k.sh} L10.5 ${k.cin - 2}Z" fill="${o.short}" stroke="${o.shortE}" stroke-width="1.1" stroke-linejoin="round"/><path d="M-8 ${k.sh - 1} v-4 M8 ${k.sh - 1} v-4" stroke="${o.shortE}" stroke-width=".7" opacity=".6"/>`;
    s += `<path d="M-3 ${k.omb - 1} V${P(k.cab + k.r * .9)} H3 V${k.omb - 1}Z" fill="${pe}" stroke="${pk}" stroke-width=".8"/>`;
    const tronco = `M-10.5 ${k.omb} C-12.6 ${k.omb + 8} -12 ${k.cin - 4} -11 ${k.cin + 1} H11 C12 ${k.cin - 4} 12.6 ${k.omb + 8} 10.5 ${k.omb} C6 ${k.omb - 3.6} -6 ${k.omb - 3.6} -10.5 ${k.omb}Z`;
    s += `<path d="${tronco}" fill="${cm}" stroke="${ce}" stroke-width="1.2" stroke-linejoin="round"/>`;
    if (o.listras) s += `<g stroke="${o.listras}" stroke-width="2" opacity=".9">${[8, 14, 20, 26].filter(v => k.omb + v < k.cin - 1).map(v => `<path d="M-11.6 ${k.omb + v} H11.6"/>`).join('')}</g>`;
    if (o.estampa) s += `<g transform="translate(0 ${k.omb + 12})"><path d="M-5 0 C-2 -3 3 -3 5 0 C3 3 -2 3 -5 0Z M-5 0 l-3 -2.4 v4.8Z" fill="${o.estampa}" stroke="${ce}" stroke-width=".5"/><circle cx="2.4" cy="-.4" r=".6" fill="${ce}"/></g>`;
    s += `<path d="M11 ${k.omb + 4} C12 ${k.omb + 12} 11.6 ${k.cin - 4} 10.6 ${k.cin}" stroke="#000" stroke-width="3" fill="none" opacity=".12"/><path d="M-8.4 ${k.omb + 3} C-9.6 ${k.omb + 10} -9.6 ${k.cin - 8} -9 ${k.cin - 3}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/>`;
    s += o.gola === 'v' ? `<path d="M-4 ${k.omb - 2.4} L0 ${k.omb + 3.6} L4 ${k.omb - 2.4}" fill="${pe}" stroke="${ce}" stroke-width="1"/>` : `<path d="M-4 ${k.omb - 2.6} Q0 ${k.omb + 1.4} 4 ${k.omb - 2.6}" fill="${pe}" stroke="${ce}" stroke-width="1"/>`;
    if (o.avental) s += `<path d="M-8 ${k.omb + 8} H8 L9.6 ${k.sh + 2} H-9.6Z" fill="${o.avental}" stroke="#8A7A6A" stroke-width=".9"/><path d="M-8 ${k.omb + 8} L-3 ${k.omb - 1} M8 ${k.omb + 8} L3 ${k.omb - 1}" stroke="${o.avental}" stroke-width="1.4"/><rect x="-4" y="${k.cin + 1}" width="8" height="5" rx="1" fill="none" stroke="#B8A898" stroke-width=".8"/>`;
    if (o.colete) s += `<path d="M-11 ${k.omb + 1} C-12.6 ${k.omb + 9} -12.2 ${k.cin - 4} -11.2 ${k.cin} H-2 V${k.omb + 1} C-4 ${k.omb - 2} -8 ${k.omb - 2} -11 ${k.omb + 1}Z M11 ${k.omb + 1} C12.6 ${k.omb + 9} 12.2 ${k.cin - 4} 11.2 ${k.cin} H2 V${k.omb + 1} C4 ${k.omb - 2} 8 ${k.omb - 2} 11 ${k.omb + 1}Z" fill="#FF7A1E" stroke="#A8400E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-11 ${k.omb + 10} H-2 M2 ${k.omb + 10} H11" stroke="#E8ECF2" stroke-width="2"/><path d="M-11.4 ${k.cin - 5} H11.4" stroke="#1E2230" stroke-width="1.6"/><rect x="-2" y="${k.cin - 6.6}" width="4" height="3.2" rx=".6" fill="#3A3E4E"/><path d="M-9 ${k.omb + 3} q1 6 0 12" stroke="#FFC08A" stroke-width="1.2" fill="none" opacity=".7"/>`;
    if (o.item) s += o.item;
    const braco = (lado, pose, cls) => { const sx = lado * 10.5, sy = k.omb + 3, a = Array.isArray(pose) ? pose : BRACO[pose || 'baixo'], b = k.br;
      const ex = sx + lado * a[0] * b, ey = sy + a[1] * b, hx = sx + lado * a[2] * b, hy = sy + a[3] * b;
      const d = `M${sx} ${sy} L${P(ex)} ${P(ey)} L${P(hx)} ${P(hy)}`, dm = `M${sx} ${sy} L${P(sx + (ex - sx) * .55)} ${P(sy + (ey - sy) * .55)}`;
      return `<g class="${cls}" style="transform-origin:${sx}px ${sy}px"><path d="${d}" stroke="${pk}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${pe}" stroke-width="4.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${o.mangaLonga ? `<path d="M${sx} ${sy} L${P(ex)} ${P(ey)} L${P(sx + (hx - sx) * .85)} ${P(sy + (hy - sy) * .85)}" stroke="${ce}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M${sx} ${sy} L${P(ex)} ${P(ey)} L${P(sx + (hx - sx) * .85)} ${P(sy + (hy - sy) * .85)}" stroke="${cm}" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : `<path d="${dm}" stroke="${o.colete ? '#A8400E' : ce}" stroke-width="8" stroke-linecap="round"/><path d="${dm}" stroke="${o.colete ? '#FF7A1E' : cm}" stroke-width="6.2" stroke-linecap="round"/>`}<circle cx="${P(hx)}" cy="${P(hy)}" r="2.8" fill="${pe}" stroke="${pk}" stroke-width=".8"/>${lado === 1 && o.naMao ? `<g transform="translate(${P(hx)} ${P(hy)})">${o.naMao}</g>` : ''}</g>`; };
    s += braco(-1, o.bracoE, 'cc-be') + braco(1, o.bracoD, 'cc-bd');
    if (o.itemFrente) s += o.itemFrente;
    s += `<g class="cc-cab" style="transform-origin:0px ${k.cab + k.r}px"><g transform="translate(0 ${k.cab})">${cabeca(Object.assign({}, o, { r:k.r }))}</g></g>`;
    return s; };
  const PELES = { vo:['#7A4A2E', '#3E2010'], neta:['#B47A52', '#5E3A1E'], avo:['#D8A47A', '#7A4A2A'], tia:['#5E3A26', '#2E1A0E'], menino:['#C8906A', '#6A3E20'], prima:['#E2B48C', '#8A5A36'] };
  const VO = { pele:PELES.vo[0], peleE:PELES.vo[1], cabelo:'#EDE8E0', cabeloE:'#A8A090', barba:'#E8E2D8', rugas:1, chapeu:1, camisa:'#5E9ACB', camisaE:'#2E5A8A', estampa:'#FFE27A', calca:'#E8D8B8', calcaE:'#8A7A5A', chinelo:'#3A3A3A', sobr:'#C8C0B0' };
  const NETA = { crianca:1, pele:PELES.neta[0], peleE:PELES.neta[1], cabelo:'#2A1A10', cabeloE:'#120A06', estilo:'cacho', camisa:'#FFD43A', camisaE:'#B8900E', short:'#2E7BF6', shortE:'#12458A', colete:1, chinelo:'#FF5A8A' };
  /* ---------- canoa ---------- */
  const casco = (h, cls) => `
      <path d="M${-h - 6} -20 C${-h + 8} -15 ${-h + 22} -13 ${-h + 42} -13 H${h - 42} C${h - 20} -13 ${h - 6} -16 ${h + 10} -23 C${h + 3} -6 ${h - 14} 8 ${h - 46} 9 H${-h + 46} C${-h + 14} 8 ${-h - 1} -4 ${-h - 6} -20Z" fill="url(#ccCasco)" stroke="#3A1E0C" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M${-h - 2} -16 C${-h + 30} -9 ${h - 40} -8 ${h + 6} -18" stroke="#2E7BF6" stroke-width="4" fill="none"/>
      <path d="M${-h} -12.4 C${-h + 30} -5.4 ${h - 40} -4.4 ${h + 4} -14.4" stroke="#FFFFFF" stroke-width="1.6" fill="none"/>
      <path d="M${-h + 1} -9.6 C${-h + 30} -2.6 ${h - 40} -1.6 ${h + 2} -11.4" stroke="#E5392C" stroke-width="2" fill="none"/>
      <g stroke="#6E3E18" stroke-width="1" fill="none" opacity=".55"><path d="M${-h + 26} 2 C${-h + 60} 6 ${h - 60} 6 ${h - 26} 1 M${-h + 50} 5.4 C${-h + 90} 8 ${h - 90} 8 ${h - 50} 5"/></g>
      <path d="M${-h + 20} -1 C${-h + 60} 3 ${h - 70} 3 ${h - 30} -2" stroke="#E0A06A" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M${-h - 6} -20 C${-h + 8} -15 ${-h + 22} -13 ${-h + 42} -13 H${h - 42} C${h - 20} -13 ${h - 6} -16 ${h + 10} -23" stroke="#E8B47E" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  const dentro = h => `<path d="M${-h - 2} -19 C${-h + 30} -24 ${h - 30} -25 ${h + 6} -22 C${h - 30} -14 ${-h + 30} -13 ${-h - 2} -19Z" fill="url(#ccDentro)" stroke="#5E3418" stroke-width="1.2"/><path d="M${-h + 50} -22 v8 M${h - 60} -23 v8" stroke="#7A4A22" stroke-width="3.4" stroke-linecap="round"/>`;
  /* ---------- peixes, tartaruga ---------- */
  const peixeG = () => `<path d="M-19 0 L-30 -9 Q-27 0 -30 9Z" fill="#F2C83A" stroke="#8A6A0E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-6 -8 L2 -15 L8 -8Z M-4 7 L2 12 L6 7Z" fill="#F2C83A" stroke="#8A6A0E" stroke-width="1"/>
      <path d="M-22 0 C-14 -11 8 -12 21 -2 C23 0 23 2 21 3 C8 11 -14 10 -22 0Z" fill="url(#ccPeixe)" stroke="#1E4A7A" stroke-width="1.4"/>
      <path d="M-18 2 C-8 7 8 7 20 2" fill="#EAF4FA" opacity=".8"/><path d="M-16 -3 C-6 -8 8 -8 18 -2" stroke="#9AD0F0" stroke-width="1.4" fill="none" opacity=".9"/>
      <path d="M10 -6 q-3 6 0 11" stroke="#1E4A7A" stroke-width="1" fill="none"/><circle cx="15" cy="-2" r="2.6" fill="#fff" stroke="#1E4A7A" stroke-width=".7"/><circle cx="15.6" cy="-2" r="1.5" fill="#0E1A2A"/><circle cx="16" cy="-2.6" r=".5" fill="#fff"/>`;
  const peixeP = () => `<path d="M-9 0 L-15 -5 Q-13 0 -15 5Z" fill="#9AD8C0" stroke="#2E6A5A" stroke-width=".9"/><path d="M-11 0 C-6 -6 5 -6 10 -1 C11 0 11 1 10 1.6 C5 6 -6 6 -11 0Z" fill="url(#ccFilhote)" stroke="#2E6A5A" stroke-width="1.1"/><path d="M-8 0 H7" stroke="#FFE27A" stroke-width="1.2" opacity=".9"/><circle cx="6" cy="-1.2" r="1.7" fill="#fff"/><circle cx="6.4" cy="-1.2" r="1" fill="#0E1A2A"/>`;
  const tarta = () => `<g fill="#7FA05A" stroke="#3E5A22" stroke-width="1.1"><path d="M-8 -9 C-14 -18 -22 -20 -24 -16 C-20 -12 -14 -10 -9 -6Z M-8 9 C-14 18 -22 20 -24 16 C-20 12 -14 10 -9 6Z M10 -8 C14 -14 18 -15 20 -13 C17 -10 14 -8 11 -6Z M10 8 C14 14 18 15 20 13 C17 10 14 8 11 6Z"/><ellipse cx="22" cy="0" rx="6" ry="4.6"/></g>
      <ellipse cx="0" cy="0" rx="17" ry="12" fill="url(#ccCasca)" stroke="#4E3A14" stroke-width="1.5"/><g fill="none" stroke="#5E4A1A" stroke-width=".9" opacity=".8"><path d="M-6 -6 L6 -6 L9 0 L6 6 L-6 6 L-9 0Z M-6 -6 L-10 -10 M6 -6 L9 -10 M6 6 L9 10 M-6 6 L-10 10 M9 0 H16 M-9 0 H-16"/></g><path d="M-10 -6 q8 -6 18 -3" stroke="#E8D8A0" stroke-width="1.4" fill="none" opacity=".7"/>
      <circle cx="24" cy="-1.6" r="1.4" fill="#12121A"/><circle cx="24.4" cy="-2" r=".5" fill="#fff"/><path d="M25 1.4 q1.6 1 3 0" stroke="#2E3A12" stroke-width=".7" fill="none"/>`;
  const desenhoLixo = {
    sacola:'<path d="M-16 -6 C-18 10 -12 20 0 22 C12 20 18 10 16 -6Z" fill="#F4F8FF" fill-opacity=".86" stroke="#8A9AB8" stroke-width="1.6"/><path d="M-11 -6 C-13 -17 -4 -19 -4 -8 M11 -6 C13 -17 4 -19 4 -8" stroke="#8A9AB8" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-9 4 q4 8 0 13 M6 2 q-3 9 2 15" stroke="#C9D4E6" stroke-width="1.3" fill="none"/>',
    garrafa:'<g transform="rotate(-70)"><path d="M-7 -18 h14 v5 C11 -9 13 -5 13 2 V20 C13 24 9 26 0 26 C-9 26 -13 24 -13 20 V2 C-13 -5 -11 -9 -7 -13Z" fill="#A8E6D8" fill-opacity=".85" stroke="#3E8A7A" stroke-width="1.7"/><rect x="-5.4" y="-25" width="10.8" height="8" rx="2" fill="#2E7FD6" stroke="#12458A" stroke-width="1.3"/><rect x="-13" y="4" width="26" height="9" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.1"/><path d="M-7 -5 V19" stroke="#E6FFF8" stroke-width="2.2" stroke-linecap="round" opacity=".8"/></g>',
    lata:'<g transform="rotate(-14)"><rect x="-18" y="-10" width="36" height="20" rx="4" fill="#C9CED8" stroke="#5A6070" stroke-width="1.7"/><rect x="-6" y="-10" width="12" height="20" fill="#3FA864"/><ellipse cx="18" cy="0" rx="3.4" ry="10" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.3"/><path d="M-15 -6 H13" stroke="#fff" stroke-width="1.8" opacity=".7" stroke-linecap="round"/></g>',
    chinelo:'<g transform="rotate(20)"><path d="M-6 -16 C2 -18 7 -12 7 -4 C7 6 5 14 0 16 C-6 17 -9 12 -9 4 C-9 -6 -11 -14 -6 -16Z" fill="#FFD43A" stroke="#A8780E" stroke-width="1.6"/><path d="M-7 -14 C0 -16 5 -11 5 -4 C5 6 3 12 0 14 C-4 15 -7 11 -7 4 C-7 -5 -9 -12 -7 -14Z" fill="#FFF2B0" opacity=".6"/><path d="M-8 -2 L-1 -9 L5 -2" stroke="#E5392C" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>',
    rede:'<path d="M-26 -10 C-8 -18 12 -16 28 -8 C26 6 14 14 -2 16 C-18 14 -28 4 -26 -10Z" fill="#3E8A5A" fill-opacity=".2" stroke="#2E6A4A" stroke-width="1.5"/><g stroke="#4EA87A" stroke-width="1.3" fill="none">' + [-18, -9, 0, 9, 18].map(x => `<path d="M${x} -14 Q${x + 4} 0 ${x - 2} 14"/>`).join('') + [-8, -1, 6].map(y => `<path d="M-26 ${y} Q0 ${y + 5} 28 ${y - 2}"/>`).join('') + '</g><circle cx="-20" cy="-11" r="3.6" fill="#FFC83D" stroke="#8A6A08" stroke-width="1.1"/><path d="M26 -8 q10 4 12 13" stroke="#2E6A4A" stroke-width="1.5" fill="none"/>'
  };
  /* ---------- paisagem ---------- */
  const casa = (x, y, w, h, parede, teto, jan, sape) => { const yb = y, yt = y - h;
    let o = `<ellipse cx="${x + w / 2}" cy="${yb + 1}" rx="${w * .62}" ry="3" fill="#2E4A1A" opacity=".3"/>`;
    o += `<rect x="${x}" y="${yt}" width="${w}" height="${h}" fill="${parede}" stroke="#6E5A44" stroke-width="1.2"/><rect x="${x + w * .7}" y="${yt}" width="${w * .3}" height="${h}" fill="#000" opacity=".08"/>`;
    if (sape) o += `<g stroke="#B8A080" stroke-width=".6" opacity=".7">${[.3, .55, .8].map(k => `<path d="M${x + 2} ${P(yt + h * k)} H${x + w - 2}"/>`).join('')}</g>`;
    o += `<rect x="${x + w * .14}" y="${yt + h * .28}" width="${P(w * .22)}" height="${P(h * .3)}" fill="#3A2A20" stroke="${jan}" stroke-width="1.6"/><path d="M${P(x + w * .25)} ${P(yt + h * .28)} V${P(yt + h * .58)}" stroke="${jan}" stroke-width="1"/>`;
    o += `<rect x="${P(x + w * .56)}" y="${P(yt + h * .38)}" width="${P(w * .2)}" height="${P(h * .62)}" fill="${jan}" stroke="#2A2A3A" stroke-width=".9"/><circle cx="${P(x + w * .72)}" cy="${P(yt + h * .7)}" r=".9" fill="#FFE27A"/>`;
    if (sape) o += `<path d="M${x - 6} ${yt + 3} L${x + w / 2} ${yt - h * .62} L${x + w + 6} ${yt + 3}Z" fill="url(#ccSape)" stroke="#7A5A22" stroke-width="1.2" stroke-linejoin="round"/><g stroke="#9A7A3A" stroke-width=".7" opacity=".85">${Array.from({ length:Math.round(w / 4) }, (_, i) => { const xx = x - 4 + i * (w + 8) / Math.round(w / 4); return `<path d="M${P(xx)} ${yt + 2} L${P(x + w / 2 + (xx - x - w / 2) * .4)} ${P(yt - h * .36)}"/>`; }).join('')}</g><path d="M${x - 6} ${yt + 3} L${x + w + 6} ${yt + 3}" stroke="#E8CC88" stroke-width="1.2"/>`;
    else o += `<path d="M${x - 4} ${yt + 2} L${x + w / 2} ${yt - h * .5} L${x + w + 4} ${yt + 2}Z" fill="url(#ccTelha)" stroke="#7A2A12" stroke-width="1.2" stroke-linejoin="round"/><g stroke="#8A3418" stroke-width=".7" fill="none" opacity=".8">${[.3, .6].map(k => `<path d="M${P(x - 4 + (w / 2 + 4) * k)} ${P(yt + 2 - (h * .5 + 2) * k)} ${Array.from({ length:5 }, () => `q${P((w + 8) * (1 - k) / 10)} 2 ${P((w + 8) * (1 - k) / 5)} 0`).join(' ')}"/>`).join('')}</g><path d="M${x - 4} ${yt + 2} L${x + w / 2} ${yt - h * .5}" stroke="#FFB08A" stroke-width="1.2" opacity=".8"/>`;
    return o; };
  const jerivaFolha = (a, L) => { const ca = Math.cos(a), sa = Math.sin(a); let fol = ''; const eixo = `M0 0 Q${P(ca * L * .5 - sa * 8)} ${P(sa * L * .5 + 6)} ${P(ca * L)} ${P(sa * L + 18)}`;
    for (let i = 2; i < 14; i++) { const t = i / 14, bx = ca * L * t - sa * 8 * 2 * t * (1 - t), by = sa * L * t + 18 * t * t + 6 * 2 * t * (1 - t), l = 16 * (1 - t * .6);
      fol += `M${P(bx)} ${P(by)} l${P(-sa * l + ca * 3)} ${P(ca * l * .7 + 6)} M${P(bx)} ${P(by)} l${P(sa * l + ca * 3)} ${P(-ca * l * .3 + 8)} `; }
    return `<path d="${fol}" stroke="#2E6A22" stroke-width="3" fill="none" stroke-linecap="round"/><path d="${fol}" stroke="#6EB84A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="${eixo}" stroke="#4E6A22" stroke-width="2.2" fill="none" stroke-linecap="round"/>`; };
  const mandioca = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-1 -10 1 -18 0 -26 M0 -14 C4 -18 6 -22 8 -26" stroke="#A8442A" stroke-width="1.6" fill="none"/>${[[0, -26], [8, -26], [-1, -16]].map(([cx, cy]) => [-1.2, -.6, 0, .6, 1.2].map(a => `<path d="M${cx} ${cy} q${P(Math.sin(a) * 4)} ${P(-Math.cos(a) * 5)} ${P(Math.sin(a) * 9)} ${P(-Math.cos(a) * 9)} q${P(-Math.sin(a) * 3 + Math.cos(a) * 1.4)} ${P(Math.cos(a) * 2)} ${P(-Math.sin(a) * 9)} ${P(Math.cos(a) * 9)}Z" fill="#5EA83E" stroke="#2E5A1E" stroke-width=".6"/>`).join('')).join('')}</g>`;
  const arvoreCopa = (x, y, rx, ry, c0, c1, esc) => `<path d="${copa(x, y + ry * .2, rx, ry, 9, .26)}" fill="${c1}" stroke="${esc}" stroke-width="1"/><path d="${copa(x - rx * .12, y - ry * .1, rx * .78, ry * .72, 8, .28)}" fill="${c0}"/><path d="M${P(x - rx * .55)} ${P(y - ry * .3)} q${P(rx * .3)} ${P(-ry * .5)} ${P(rx * .7)} ${P(-ry * .45)}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".3" stroke-linecap="round"/>`;
  const salsa = (x0, x1, y) => { let s = ''; for (let x = x0; x < x1; x += R(16, 24)) { const yy = y + R(-6, 6); s += `<path d="M${P(x)} ${P(yy)} q10 -6 20 -2" stroke="#3E7A2A" stroke-width="1.6" fill="none"/><path d="M${P(x + 6)} ${P(yy - 3)} c-4 -6 4 -10 6 -4 c4 -6 10 0 4 4Z" fill="#4E9A3A" stroke="#2E6A22" stroke-width=".8"/>${R(0, 1) < .55 ? `<g transform="translate(${P(x + 16)} ${P(yy - 6)})"><path d="M0 -4 L3.8 -1.2 L2.4 3.2 L-2.4 3.2 L-3.8 -1.2Z" fill="#D07ADC" stroke="#8A3A9A" stroke-width=".6"/><circle r="1.1" fill="#FFF0FA"/></g>` : ''}`; } return s; };
  /* ---------- montanha com floresta ---------- */
  const SERRA_MEIO = 'M0 205 V112 C40 96 80 104 120 92 C150 84 176 94 196 102 C214 92 240 84 270 92 C310 104 340 120 372 140 C404 160 428 182 452 205Z';
  const SERRA_PERTO = 'M0 262 V182 C40 170 80 178 120 172 C160 166 196 182 228 196 C258 208 286 226 312 248 L320 262Z';
  const interp = (pts, x) => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return pts[pts.length - 1][1]; };
  const TOPO_MEIO = [[-20, 112], [0, 112], [40, 100], [80, 104], [120, 92], [150, 86], [176, 92], [196, 102], [214, 94], [240, 86], [270, 92], [310, 104], [340, 120], [372, 140], [404, 160], [428, 182], [452, 205], [480, 205]];
  const TOPO_PERTO = [[-20, 184], [0, 182], [40, 172], [80, 177], [120, 172], [160, 168], [196, 182], [228, 196], [258, 208], [286, 226], [312, 248], [330, 262]];
  let mataMeio = '', mataPerto = '', floresMeio = '';
  const jucara = (x, y, h, c) => { const ty = y - h; let f = '';
    for (const a of [-2.8, -2.35, -1.95, -1.55, -1.15, -.75, -.35]) { const L = h * .46, ex = x + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .45 + L * .42; f += `M${P(x)} ${P(ty)} Q${P(x + Math.cos(a) * L * .55)} ${P(ty + Math.sin(a) * L * .55 - 2)} ${P(ex)} ${P(ey)} `; }
    return `<path d="M${P(x)} ${P(y)} Q${P(x + 1.5)} ${P(y - h * .5)} ${P(x)} ${P(ty)}" stroke="${c[2] || '#7A7466'}" stroke-width="${P(h * .035 + .7)}" fill="none"/><path d="${f}" stroke="${c[1]}" stroke-width="${P(h * .08 + 1.2)}" fill="none" stroke-linecap="round"/><path d="${f}" stroke="${c[0]}" stroke-width="${P(h * .05 + .6)}" fill="none" stroke-linecap="round" stroke-dasharray="1.4 1.1"/><circle cx="${P(x)}" cy="${P(ty + 1)}" r="${P(h * .04 + .6)}" fill="#C8601E"/>`; };
  const embN = (x, y, s, prata, tronco) => { let o = `<path d="M${P(x)} ${P(y)} V${P(y - 24 * s)} M${P(x)} ${P(y - 14 * s)} L${P(x - 8 * s)} ${P(y - 24 * s)} M${P(x)} ${P(y - 16 * s)} L${P(x + 9 * s)} ${P(y - 27 * s)}" stroke="${tronco}" stroke-width="${P(1.5 * s)}" fill="none" stroke-linecap="round"/>`;
    for (const [dx, dy] of [[0, -27], [-8, -26], [9, -29]]) { const cx = x + dx * s, cy = y + dy * s; let d = ''; for (let k = 0; k < 7; k++) { const a = -PI + k * PI / 6; d += `M${P(cx)} ${P(cy)} L${P(cx + Math.cos(a) * 7 * s)} ${P(cy + Math.sin(a) * 4 * s + 2.4 * s)} `; }
      o += `<path d="${d}" stroke="${prata[1]}" stroke-width="${P(3.6 * s)}" stroke-linecap="round"/><path d="${d}" stroke="${prata[0]}" stroke-width="${P(2.1 * s)}" stroke-linecap="round"/>`; }
    return o; };
  const guardaChuva = (x, y, r, c) => `<path d="${copa(x, y, r * 1.5, r * .46, 11, .22)}" fill="${c[1]}"/><path d="${copa(x - r * .1, y - r * .12, r * 1.2, r * .3, 10, .22)}" fill="${c[0]}"/><path d="M${P(x)} ${P(y + r * .4)} V${P(y + r * 1.2)}" stroke="${c[2] || '#6E5A44'}" stroke-width="${P(r * .12)}"/>`;
  const floresta = (topo, x0, x1, passo, linhas, dy, raio, pal, flor, emb, jc, yMax, xMax) => { let o = '';
    for (let j = 0; j < linhas; j++) for (let x = x0; x < x1; x += passo) { const xx = x + R(-passo * .4, passo * .4); if (xMax && xx > xMax(j)) continue; const y = interp(topo, xx) + 4 + j * dy + R(-3, 3); if (y > yMax) continue;
      const q = R(0, 1), r = raio * R(.75, 1.25), v = pal[Math.floor(R(0, pal.length))];
      if (q < .07) o += jucara(xx, y + r * .6, r * 2.4, jc);
      else if (q < .12) o += embN(xx, y + r * .8, r / 11, emb, emb[2]);
      else if (q < .19) { const f = flor[Math.floor(R(0, flor.length))]; o += `<path d="${copa(xx, y, r, r * .74, 8, .3)}" fill="${f[1]}"/><path d="${copa(xx - r * .14, y - r * .12, r * .74, r * .52, 7, .32)}" fill="${f[0]}"/>${Array.from({ length:4 }, () => `<circle cx="${P(xx + R(-r * .6, r * .5))}" cy="${P(y + R(-r * .5, r * .2))}" r="${P(r * .1)}" fill="${f[2]}" opacity=".9"/>`).join('')}`; }
      else if (q < .27) o += guardaChuva(xx, y, r, v);
      else o += `<path d="${copa(xx, y, r, r * .72, 8, .3)}" fill="${v[1]}"/><path d="${copa(xx - r * .15, y - r * .14, r * .72, r * .5, 7, .3)}" fill="${v[0]}"/><path d="M${P(xx - r * .5)} ${P(y - r * .32)} q${P(r * .4)} ${P(-r * .4)} ${P(r * .9)} ${P(-r * .22)}" stroke="#F4FAF0" stroke-width="1" fill="none" opacity=".35"/>`; }
    return o; };
  const VM = [['#7FB8A4', '#5E9A8A', '#7A8A80'], ['#8CBC96', '#6C9E7C', '#7A8A80'], ['#74AEA4', '#56908A', '#7A8A80'], ['#9CC49A', '#7CA47E', '#7A8A80'], ['#86B4B0', '#66969A', '#7A8A80']];
  const FM = [['#C4A2DC', '#A884C4', '#EADCF4'], ['#F0D88A', '#D8BC66', '#FFF2C0'], ['#EAB4CC', '#CC96B0', '#FFE4F0']];
  mataMeio = floresta(TOPO_MEIO, -10, 470, 11, 9, 11, 10, VM, FM, ['#E4ECE4', '#9AAAA0', '#C8CCC4'], ['#9CC49A', '#6C8E74', '#8A948A'], 202);
  const VP = [['#3E9A4E', '#26703A'], ['#2E8A6E', '#1A5E4A'], ['#7AAE3A', '#527E22'], ['#4E9A3A', '#2E6A22'], ['#5EB070', '#3A7E4A'], ['#2A7A5A', '#16503A'], ['#8ABE4A', '#5E8E2A'], ['#3E8A7E', '#22605A']];
  const FP = [['#A872D8', '#7A44A8', '#F0E0FF'], ['#FFD43A', '#D8A010', '#FFF4B0'], ['#F08AB8', '#C2507E', '#FFE4F0']];
  mataPerto = floresta(TOPO_PERTO, -14, 330, 14, 7, 13, 16, VP, FP, ['#E8F0E6', '#8A9A88', '#D8D4C8'], ['#5EA84A', '#2E6A22', '#6E6A5A'], 268, j => 318 - j * 4);
  const quaresmeira = (x, y) => `<path d="M${x} ${y + 18} V${y}" stroke="#5E4030" stroke-width="2.4"/><path d="${copa(x, y, 15, 11, 9, .3)}" fill="#9A62C8" stroke="#5E2E8A" stroke-width="1"/><path d="${copa(x - 3, y - 2, 10, 7, 8, .3)}" fill="#B88AE0"/><g fill="#E8D4FA">${[[-6, -2], [3, -5], [6, 2], [-2, 4]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.2"/>`).join('')}</g>`;
  const embauba = (x, y) => `<path d="M${x} ${y + 26} C${x - 1} ${y + 12} ${x + 1} ${y + 4} ${x} ${y - 4}" stroke="#C8C4B4" stroke-width="2.4" fill="none"/>${[-2.2, -1.4, -.6, .2, 1].map(a => `<path d="M${x} ${y - 4} l${P(Math.cos(a) * 12)} ${P(Math.sin(a) * 6 - 2)}" stroke="#8A9A88" stroke-width="1"/><ellipse cx="${P(x + Math.cos(a) * 12)}" cy="${P(y - 6 + Math.sin(a) * 6)}" rx="6" ry="3.4" transform="rotate(${P(a * 57)} ${P(x + Math.cos(a) * 12)} ${P(y - 6 + Math.sin(a) * 6)})" fill="#C8D8C4" stroke="#7A8A78" stroke-width=".7"/>`).join('')}`;
  /* ---------- trechos ---------- */
  const AGUA_LINHA = 'M300 292 C350 320 420 380 470 440 C490 466 505 486 512 500';
  const COSTA = (() => { const B = [[300, 292, 350, 320, 420, 380, 470, 440], [470, 440, 490, 466, 505, 486, 512, 500]], out = [];
    const bz = (b, t) => { const u = 1 - t; return [u * u * u * b[0] + 3 * u * u * t * b[2] + 3 * u * t * t * b[4] + t * t * t * b[6], u * u * u * b[1] + 3 * u * u * t * b[3] + 3 * u * t * t * b[5] + t * t * t * b[7]]; };
    for (let i = 0; i <= 60; i++) out.push(bz(B[0], i / 60)); for (let i = 1; i <= 16; i++) out.push(bz(B[1], i / 16));
    return out.map((q, i) => { const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return { x:q[0], y:q[1], nx:dy / l, ny:-dx / l }; }); })();
  const naCosta = (i, d) => { const q = COSTA[Math.min(COSTA.length - 1, Math.max(0, Math.round(i)))]; return [q.x + q.nx * d, q.y + q.ny * d]; };
  const renda = (d, amp, trechos, passo = 2) => trechos.map(([i0, i1]) => { let [x, y] = naCosta(i0, d), o = `M${P(x)} ${P(y)}`; for (let i = i0 + passo; i <= i1; i += passo) { const [x2, y2] = naCosta(i, d), [cx, cy] = naCosta(i - passo / 2, d + amp * (i % 4 ? 1 : .6)); o += ` Q${P(cx)} ${P(cy)} ${P(x2)} ${P(y2)}`; } return o; }).join(' ');
  const faixaEspuma = (d0, d1) => { let o = '', [x, y] = naCosta(0, d0); o = `M${P(x)} ${P(y)}`; for (let i = 2; i < COSTA.length; i += 2) { const [a, b] = naCosta(i, d0); o += ` L${P(a)} ${P(b)}`; } for (let i = COSTA.length - 1; i >= 0; i -= 2) { const [a, b] = naCosta(i, d1 + (i % 4 ? 0 : 1.6)), [cx, cy] = naCosta(i + 1, d1 + 3.4); o += ` Q${P(cx)} ${P(cy)} ${P(a)} ${P(b)}`; } return o + 'Z'; };
  const RIO = 'M204 250 C214 256 222 252 232 256 C244 262 240 270 252 274 C266 278 276 282 284 290 C288 294 292 298 296 300';
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Vila caiçara entre a Mata Atlântica da serra e o mar, com canoa, cerco de pesca e toninha">
    <defs>
      <linearGradient id="ccCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EBEF0"/><stop offset=".6" stop-color="#BFE4F8"/><stop offset="1" stop-color="#FFF0DA"/></linearGradient>
      <linearGradient id="ccTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4A9A"/><stop offset=".45" stop-color="#E87A7A"/><stop offset="1" stop-color="#FFC27A"/></linearGradient>
      <linearGradient id="ccMarTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB08A" stop-opacity=".75"/><stop offset=".5" stop-color="#C87AA8" stop-opacity=".35"/><stop offset="1" stop-color="#5A4A9A" stop-opacity=".2"/></linearGradient>
      <linearGradient id="ccHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF4F6" stop-opacity=".4"/><stop offset=".55" stop-color="#EAF4F6" stop-opacity=".12"/><stop offset="1" stop-color="#EAF4F6" stop-opacity=".3"/></linearGradient>
      <radialGradient id="ccNevoa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F4FAFA" stop-opacity=".62"/><stop offset="1" stop-color="#F4FAFA" stop-opacity="0"/></radialGradient>
      <linearGradient id="ccGranito" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8CAC4"/><stop offset=".6" stop-color="#9A9E98"/><stop offset="1" stop-color="#6E726C"/></linearGradient>
      <linearGradient id="ccQueda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F6FF"/><stop offset=".35" stop-color="#A6DCF2"/><stop offset=".8" stop-color="#D8F2FC"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
      <linearGradient id="ccPenhasco" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#7A847E"/><stop offset=".5" stop-color="#525E58"/><stop offset="1" stop-color="#36403C"/></linearGradient>
      <filter id="ccSuave" filterUnits="userSpaceOnUse" x="150" y="150" width="560" height="380"><feGaussianBlur stdDeviation="9"/></filter>
      <linearGradient id="ccRochaM" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5E6A64"/><stop offset="1" stop-color="#2E3834"/></linearGradient>
      <linearGradient id="ccLagoa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ADCD8"/><stop offset="1" stop-color="#2E9AC0"/></linearGradient>
      <linearGradient id="ccTempo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5468"/><stop offset="1" stop-color="#8A94A4"/></linearGradient>
      <radialGradient id="ccSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8D0"/><stop offset=".6" stop-color="#FFD24A"/><stop offset="1" stop-color="#F6A62A"/></radialGradient>
      <radialGradient id="ccSolHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF0B0" stop-opacity=".8"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient>
      <linearGradient id="ccLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#98BCC4"/><stop offset="1" stop-color="#C6DCD8"/></linearGradient>
      <linearGradient id="ccSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A9E78"/><stop offset="1" stop-color="#2E7652"/></linearGradient>
      <linearGradient id="ccPerto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E8A4E"/><stop offset="1" stop-color="#2A6A3A"/></linearGradient>
      <linearGradient id="ccIlha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AA8A8"/><stop offset="1" stop-color="#A8C8C4"/></linearGradient>
      <linearGradient id="ccMar" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#8AD2E8"/><stop offset=".18" stop-color="#3EA0D0"/><stop offset=".55" stop-color="#1C70AE"/><stop offset="1" stop-color="#114C8A"/></linearGradient>
      <linearGradient id="ccAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E8BC"/><stop offset="1" stop-color="#E0C080"/></linearGradient>
      <linearGradient id="ccMolhada" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8A86A" stop-opacity="0"/><stop offset=".5" stop-color="#B8965A" stop-opacity=".45"/><stop offset="1" stop-color="#9A7E4A" stop-opacity=".7"/></linearGradient>
      <linearGradient id="ccChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AC05A"/><stop offset="1" stop-color="#C8C47A"/></linearGradient>
      <linearGradient id="ccRio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9AE0FA"/><stop offset="1" stop-color="#3EA0D8"/></linearGradient>
      <linearGradient id="ccCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8763E"/><stop offset=".6" stop-color="#8A5028"/><stop offset="1" stop-color="#5E3418"/></linearGradient>
      <linearGradient id="ccDentro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A6236"/><stop offset="1" stop-color="#D8A46A"/></linearGradient>
      <linearGradient id="ccPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6A0"/><stop offset="1" stop-color="#D8A84E"/></linearGradient>
      <linearGradient id="ccSape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C878"/><stop offset="1" stop-color="#B08A42"/></linearGradient>
      <linearGradient id="ccTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8764A"/><stop offset="1" stop-color="#B84A26"/></linearGradient>
      <linearGradient id="ccPeixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E7AB8"/><stop offset=".55" stop-color="#9AC8E8"/><stop offset="1" stop-color="#F4FAFF"/></linearGradient>
      <linearGradient id="ccFilhote" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ABAA0"/><stop offset="1" stop-color="#E4F8EE"/></linearGradient>
      <radialGradient id="ccCasca" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#C8B06A"/><stop offset=".6" stop-color="#8A7A3A"/><stop offset="1" stop-color="#5E4E1E"/></radialGradient>
      <radialGradient id="ccLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="ccCercoAgua" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1A5A7A"/><stop offset="1" stop-color="#0E3A5A"/></radialGradient>
      <radialGradient id="ccCercoRaso" cx=".5" cy=".45" r=".55"><stop offset="0" stop-color="#C8F4FF"/><stop offset=".7" stop-color="#7AD4EE"/><stop offset="1" stop-color="#3EA6D2"/></radialGradient>
      <linearGradient id="ccPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A948A"/><stop offset="1" stop-color="#5A544C"/></linearGradient>
      <linearGradient id="ccSaco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F2EA"/><stop offset="1" stop-color="#C8C4B4"/></linearGradient>
      <linearGradient id="ccForno" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C87A4A"/><stop offset="1" stop-color="#8A4A26"/></linearGradient>
      <pattern id="ccMalha" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4 L4 0 L8 4 L4 8Z" fill="none" stroke="#D8F0F8" stroke-width=".7" opacity=".6"/></pattern>
      <clipPath id="ccCercoClip"><path d="M${Array.from({ length:61 }, (_, k) => { const a = PI * 2 * k / 60, d = ((a % (PI * 2)) + PI * 2) % (PI * 2) - PI, m = 1 - .46 * Math.exp(-((d / .55) ** 2)); return `${P(CERCO.x + Math.cos(a) * (CERCO.rx - 4) * m)} ${P(CERCO.y + Math.sin(a) * (CERCO.ry - 3) * m)}`; }).join(' L')}Z"/></clipPath>
      <radialGradient id="ccVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#0A2A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A2A3A" stop-opacity=".32"/></radialGradient>
      <filter id="ccGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${HZ + 4}" fill="url(#ccCeu)"/>
    <rect id="cc-ceu-tarde" width="800" height="${HZ + 4}" fill="url(#ccTarde)" style="opacity:0;transition:opacity 4s"/>
    <g id="cc-sol" class="toque"><g id="cc-sol-pos" transform="translate(${SOL0.x} ${SOL0.y})"><circle r="62" fill="url(#ccSolHalo)"/><g class="cc-raios">${Array.from({ length:12 }, (_, i) => { const a = i * PI / 6; return `<path d="M${P(Math.cos(a) * 32)} ${P(Math.sin(a) * 32)} L${P(Math.cos(a + .1) * 42)} ${P(Math.sin(a + .1) * 42)}" stroke="#FFD24A" stroke-width="3" stroke-linecap="round" opacity=".8"/>`; }).join('')}</g><circle r="25" fill="url(#ccSolG)" stroke="#E8961E" stroke-width="2"/><path d="M-13 -9 q8 -9 20 -8" stroke="#FFFBE6" stroke-width="3.4" fill="none" stroke-linecap="round"/><g id="cc-sol-hint">${brilhoHotspot(26, -24)}</g><circle r="46" fill="transparent"/></g></g>
    <g class="deriva" id="cc-nuvens-boas"><use href="#nuvem" x="420" y="30" width="96" height="44" style="color:#fff" opacity=".92"/><use href="#nuvem" x="560" y="112" width="70" height="32" style="color:#fff" opacity=".8"/></g>
    <!-- ilha -->
    <g id="cc-ilha"><path d="M592 ${HZ} C604 186 626 168 652 162 C672 158 690 150 712 152 C738 154 760 164 780 170 C790 174 796 176 800 176 V${HZ}Z" fill="url(#ccIlha)"/><path d="M640 172 C660 164 690 158 720 160" stroke="#C8E0DC" stroke-width="2" fill="none" opacity=".8"/><g fill="#6E9E98" opacity=".7">${[[650, 176], [676, 168], [704, 166], [732, 170], [758, 176]].map(([x, y]) => `<path d="${copa(x, y, 12, 6, 7, .3)}"/>`).join('')}</g></g>
    <!-- serra do mar -->
    <path d="M0 ${HZ} V70 L40 52 L84 64 L128 40 L176 56 L214 34 L262 58 L300 50 L346 82 L392 104 L430 132 L470 168 L520 ${HZ}Z" fill="url(#ccLonge)"/>
    <g fill="#E8F0EE" opacity=".5">${[[128, 40], [214, 34], [300, 50]].map(([x, y]) => `<path d="M${x - 10} ${y + 8} L${x} ${y} L${x + 8} ${y + 7} Q${x} ${y + 4} ${x - 10} ${y + 8}Z"/>`).join('')}</g>
    <path d="${SERRA_MEIO}" fill="url(#ccSerra)"/>
    <g>${mataMeio}</g>
    <path d="${SERRA_MEIO}" fill="url(#ccHaze)" pointer-events="none"/>
    <g id="cc-rochedos"><path d="M286 118 C288 102 300 92 314 94 C326 96 334 108 334 122 C320 126 300 126 286 118Z" fill="url(#ccGranito)" stroke="#5E625E" stroke-width="1"/><path d="M296 104 C298 112 298 118 300 122 M308 98 C310 108 310 116 312 124 M320 100 C322 108 324 116 324 124" stroke="#7E827C" stroke-width="1" fill="none" opacity=".8"/><path d="M292 108 C298 98 308 94 318 96" stroke="#F0F0EA" stroke-width="1.6" fill="none" opacity=".8"/>
      <path d="M62 104 C66 94 76 90 86 92 C92 96 94 104 92 112 C82 114 70 112 62 104Z" fill="url(#ccGranito)" stroke="#5E625E" stroke-width="1" opacity=".9"/><path d="M70 98 C72 104 72 108 74 112 M80 94 C82 100 82 106 84 112" stroke="#7E827C" stroke-width=".9" fill="none"/>${[[284, 122, 9], [296, 126, 10], [312, 127, 11], [328, 124, 9], [338, 120, 7], [58, 110, 8], [72, 114, 9], [88, 114, 8], [98, 110, 6]].map(([x, y, r], k) => `<path d="${copa(x, y, r, r * .62, 8, .25)}" fill="${k % 2 ? '#88AE92' : '#7AA286'}"/>`).join('')}</g>
    <g pointer-events="none">${[[120, 150, 170, 14], [330, 160, 120, 12], [60, 194, 150, 12], [260, 198, 160, 10]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ccNevoa)"/>`).join('')}</g>
    <!-- mar -->
    <rect y="${HZ}" width="800" height="${500 - HZ}" fill="url(#ccMar)"/>
    <g pointer-events="none" filter="url(#ccSuave)"><path d="${AGUA_LINHA}" stroke="#2E9AB8" stroke-width="210" fill="none" opacity=".22"/><path d="${AGUA_LINHA}" stroke="#46C4CC" stroke-width="130" fill="none" opacity=".32"/><path d="${AGUA_LINHA}" stroke="#5ED8D0" stroke-width="70" fill="none" opacity=".42"/><path d="${AGUA_LINHA}" stroke="#9AEEE0" stroke-width="24" fill="none" opacity=".55"/></g>
    <g pointer-events="none" opacity=".2" transform="matrix(1 0 0 -.4 0 ${P(HZ * 1.4)})"><path d="M592 ${HZ} C604 186 626 168 652 162 C672 158 690 150 712 152 C738 154 760 164 780 170 C790 174 796 176 800 176 V${HZ}Z" fill="#2E5A6A"/></g>
    <g id="cc-barquinho" pointer-events="none"><g style="animation:flutua 3s ease-in-out infinite alternate"><path d="M676 212 h26 l-3 5 h-20Z" fill="#F4F4F0" stroke="#3A4A5A" stroke-width=".8"/><path d="M678 214 h22" stroke="#E5392C" stroke-width="1.2"/><rect x="684" y="205" width="9" height="7" fill="#F4F4F0" stroke="#3A4A5A" stroke-width=".7"/><rect x="686" y="207" width="5" height="2.6" fill="#7FC8EA"/><path d="M692 205 v-6" stroke="#3A4A5A" stroke-width=".8"/></g><path d="M678 220 h22" stroke="#3A4A5A" stroke-width="1.6" opacity=".25"/><path d="M670 219 q4 -2 8 0 M700 219 q4 -2 8 0" stroke="#fff" stroke-width=".9" fill="none"/></g>
    <g id="cc-reflexo" pointer-events="none" style="transition:opacity 2s">${Array.from({ length:12 }, (_, i) => { const y = HZ + 6 + i * 9, w = 26 - i * 1.4; return `<rect class="brilho" style="animation-delay:${(i * .23).toFixed(2)}s" x="${P(SOL0.x - w / 2 + (i % 3 - 1) * 5)}" y="${y}" width="${P(w)}" height="2" rx="1" fill="${i % 2 ? '#FFF6D0' : '#FFFFFF'}" opacity=".8"/>`; }).join('')}</g>
    <rect id="cc-mar-tempo" y="${HZ}" width="800" height="${500 - HZ}" fill="#4A6478" style="opacity:.42;transition:opacity 2s"/>
    <rect id="cc-mar-tarde" y="${HZ}" width="800" height="${500 - HZ}" fill="url(#ccMarTarde)" pointer-events="none" style="opacity:0;transition:opacity 4s"/><path d="M440 ${HZ + 1} H800" stroke="#E6F8FF" stroke-width="2" opacity=".8"/>
    <g id="cc-calmo" pointer-events="none" style="opacity:0;transition:opacity 2s"><g fill="#fff">${Array.from({ length:22 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .31 % 2.4).toFixed(2)}s" x="${P(460 + (i * 61) % 330)}" y="${P(HZ + 6 + (i * 23) % 260)}" width="${10 + i % 3 * 5}" height="2.2" rx="1.1"/>`).join('')}</g><g stroke="#D8F4FF" stroke-width="1.4" fill="none" opacity=".7">${Array.from({ length:12 }, () => { const x = R(470, 780), y = R(220, 480); return `<path d="M${P(x)} ${P(y)} q8 -3 16 0 t16 0"/>`; }).join('')}</g></g>
    <path id="cc-mar-hit" d="M300 292 C350 320 420 380 470 440 C490 466 505 486 512 500 H800 V${HZ} H452Z" fill="transparent"/>
    <path d="${SERRA_PERTO}" fill="url(#ccPerto)" stroke="#1E4A2A" stroke-width="1.2"/>
    <g>${mataPerto}</g>
    ${quaresmeira(58, 192)}${quaresmeira(150, 186)}${jucara(246, 236, 44, ['#6EB84A', '#2E6A22'])}${jucara(30, 214, 40, ['#6EB84A', '#2E6A22'])}${embN(272, 230, 1.2, ['#EEF4EC', '#8A9A88'], '#D8D4C8')}<path d="M228 226 C232 214 244 208 256 212 C264 216 266 226 262 234 C250 236 236 234 228 226Z" fill="url(#ccGranito)" stroke="#4E524E" stroke-width="1"/><path d="M234 220 C240 214 248 212 256 214" stroke="#F0F0EA" stroke-width="1.4" fill="none"/><path d="M236 230 q4 -8 2 -14 M248 232 q2 -8 0 -16" stroke="#6E726C" stroke-width=".8" fill="none"/>
    <g id="cc-guapuruvu" class="toque" data-fig="guapuruvu"><svg x="104" y="122" width="70" height="72" viewBox="0 0 110 113"><use href="#f-guapuruvu" width="110" height="130"/></svg><rect x="106" y="124" width="66" height="70" fill="transparent"/>${brilhoHotspot(166, 140)}</g>
    <!-- areia, vila e rio -->
    <path d="M0 262 V238 C60 228 140 232 200 240 C240 246 280 268 300 292 L0 330Z" fill="url(#ccChao)"/>
    <!-- cachoeira (nascente na mata) -->
    <g id="cc-cachoeira" class="toque">
      <path d="M186 110 C183 122 189 134 187 148 C186 160 189 170 191 178" stroke="#EEF8FC" stroke-width="3.6" fill="none" opacity=".8" stroke-linecap="round"/><path class="cc-queda" d="M186 110 C183 122 189 134 187 148 C186 160 189 170 191 178" stroke="#9ED4EE" stroke-width="1" fill="none" stroke-dasharray="18 5 10 4" opacity=".9"/>
      <ellipse cx="190" cy="176" rx="18" ry="6" fill="url(#ccNevoa)"/>
      <path d="M156 254 C154 238 160 224 158 210 C157 198 164 186 172 178 C178 172 186 170 192 173 C198 167 210 166 218 171 C228 176 236 188 238 200 C242 214 240 232 248 254Z" fill="url(#ccPenhasco)" stroke="#161E1B" stroke-width="1.3"/>
      <g fill="#6A7670" opacity=".55"><path d="M162 214 C166 200 172 190 180 186 C176 198 172 210 170 224Z"/><path d="M222 182 C230 188 234 198 234 210 C228 204 224 196 220 190Z"/><path d="M164 240 C168 232 174 228 178 230 C174 236 170 242 168 248Z"/></g>
      <path d="M170 196 l6 10 l-2 12 M230 214 l-4 10 l3 10 M224 178 l-6 8 M166 228 l5 6" stroke="#1E2825" stroke-width="1" fill="none" opacity=".8"/>
      ${[[148, 248], [150, 238], [151, 228], [152, 218], [153, 208], [156, 198], [160, 190], [165, 182], [171, 175], [178, 170], [210, 166], [218, 168], [226, 172], [233, 178], [238, 186], [242, 195], [245, 205], [247, 215], [248, 225], [250, 235], [252, 246]].map(([x, y], k) => { const r = 7 + (k * 7 % 5); return `<path d="${copa(x, y, r, r * .7, 8, .26)}" fill="${['#2F6E34', '#3A8040', '#2A6630'][k % 3]}" stroke="#1E4A22" stroke-width=".8"/><path d="${copa(x - r * .25, y - r * .28, r * .55, r * .36, 7, .22)}" fill="${k % 2 ? '#5EA048' : '#4E9440'}"/>`; }).join('')}
      <path d="M150 222 q8 -6 14 -2 M150 222 q6 -10 14 -10 M150 222 q2 -10 6 -14 M246 230 q-8 -6 -14 -2 M246 230 q-6 -10 -14 -10 M246 230 q-2 -10 -6 -14" stroke="#3E7A2A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      ${[[178, 184, 202, 198, -1.5], [193, 204, 216, 222, 1.5], [222, 182, 224, 246, 0]].map(([yt, x0, x1, yb, inc], n) => { const xa = x0 + inc * 2, xb = x1 + inc * 2 + (n === 2 ? 4 : 0), xa2 = x0 - (n === 2 ? 4 : 1); let fios = ''; for (let k = 0; k <= 4 + n; k++) { const f = k / (4 + n), x = x0 + 2 + (x1 - x0 - 4) * f, xbt = xa2 + 2 + (xb - xa2 - 4) * f; fios += `M${P(x)} ${yt + 2} C${P(x + 2)} ${P(yt + 6)} ${P(xbt - 1)} ${P(yt + (yb - yt) * .6)} ${P(xbt)} ${yb - 1} `; }
        return `<path d="M${x0} ${yt} C${x0 - 2} ${yt + 4} ${xa2} ${P(yt + (yb - yt) * .5)} ${xa2} ${yb} L${xb} ${yb} C${xb} ${P(yt + (yb - yt) * .5)} ${x1 + 3} ${yt + 4} ${x1} ${yt}Z" fill="url(#ccQueda)"/>
        <path class="cc-queda" d="${fios}" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-dasharray="${14 + n * 3} 3 8 2" stroke-linecap="round" opacity=".95"/><path d="${fios}" stroke="#6EBCE2" stroke-width=".5" fill="none" opacity=".6"/>
        <path d="M${x0 - 10} ${yt + 1} C${x0 - 7} ${yt - 6} ${x0 + 1} ${yt - 6} ${x0 + 2} ${yt - 1} L${x1 - 2} ${yt - 1} C${x1} ${yt - 6} ${x1 + 8} ${yt - 6} ${x1 + 11} ${yt + 2} C${x1 + 6} ${yt + 5} ${x1 + 2} ${yt + 3} ${x1} ${yt + 1} L${x0} ${yt + 1} C${x0 - 3} ${yt + 4} ${x0 - 7} ${yt + 5} ${x0 - 10} ${yt + 1}Z" fill="#3A4642" stroke="#161E1B" stroke-width="1"/>
        <path d="M${x0 - 8} ${yt - 1} C${x0 - 5} ${yt - 4} ${x0 - 1} ${yt - 4} ${x0 + 1} ${yt - 2} M${x1 + 1} ${yt - 3} C${x1 + 4} ${yt - 4} ${x1 + 7} ${yt - 2} ${x1 + 9} ${yt}" stroke="#6E9A50" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M${x0 + 1} ${yt + .5} C${(x0 + x1) / 2 - 4} ${yt - 1.5} ${(x0 + x1) / 2 + 4} ${yt + 2} ${x1 - 1} ${yt}" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${(xa2 + xb) / 2}" cy="${yb + 1}" rx="${(xb - xa2) / 2 + 8}" ry="4" fill="url(#ccNevoa)"/>
        <g fill="#fff">${Array.from({ length:8 + n * 2 }, (_, k) => `<circle cx="${P(xa2 - 3 + (xb - xa2 + 6) * k / (7 + n * 2))}" cy="${P(yb - .5 + R(-1.8, 1.4))}" r="${P(R(1.8, 3.4))}"/>`).join('')}</g>`; }).join('')}
      <path d="M170 250 C174 242 198 240 214 241 C226 241 236 244 238 250 C230 258 182 259 170 250Z" fill="#3E9CC0" stroke="#163A44" stroke-width="1"/><path d="M180 248 C192 245 212 244 228 248" stroke="#BFEFFA" stroke-width="1.4" fill="none"/><path d="M188 252 q6 -2 12 0 M206 253 q6 -2 12 0" stroke="#E6FAFF" stroke-width=".9" fill="none"/>
      <g class="cc-spray" fill="#fff" opacity=".45">${[[184, 242, 6], [220, 240, 6], [202, 236, 5], [178, 220, 3.4], [228, 218, 3.6], [186, 200, 3], [214, 202, 2.6], [196, 228, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <g>${[[166, 252, 10, 5.4], [240, 252, 10, 5], [186, 257, 6, 3], [222, 258, 7, 3], [174, 236, 5, 4], [234, 234, 5, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3E4A46" stroke="#161E1B" stroke-width="1"/><path d="M${x - rx * .6} ${y - ry * .3} q${rx * .5} ${-ry * .7} ${rx} ${-ry * .25}" stroke="#E6F4F8" stroke-width="1.1" fill="none"/><path d="M${x - rx * .9} ${y + ry * .2} q${rx * .4} ${-ry * .3} ${rx * .8} ${-ry * .1}" stroke="#5E8A3A" stroke-width="1.4" fill="none" opacity=".8"/>`).join('')}</g>
      <rect x="160" y="104" width="80" height="152" fill="transparent"/>
    </g>
    <path d="M0 320 C100 312 220 300 300 292 C350 320 420 380 470 440 C490 466 505 486 512 500 H0Z" fill="url(#ccAreia)"/>
    <path d="M300 292 C350 320 420 380 470 440 C490 466 505 486 512 500 H452 C446 480 430 458 414 440 C374 392 326 336 284 302Z" fill="url(#ccMolhada)"/>
    <g stroke="#D8B878" stroke-width="1.4" fill="none" opacity=".8">${Array.from({ length:16 }, () => { const y = R(330, 494), x = R(10, 380 - (494 - y) * .3); return `<path d="M${P(x)} ${P(y)} q7 -3 14 0 t14 0"/>`; }).join('')}</g>
    <g>${Array.from({ length:170 }, () => { const y = R(312, 498), x = R(0, 300 + (y - 300) * .78); return `<circle cx="${P(x)}" cy="${P(y)}" r="${P(R(.5, 1.3))}" fill="${R(0, 1) < .55 ? '#C8A466' : '#FFF8E4'}" opacity=".75"/>`; }).join('')}</g>
    <g>${[[150, 452, 0], [340, 470, 1], [60, 440, 2], [250, 440, 1], [380, 420, 0], [180, 486, 2], [420, 488, 0]].map(([x, y, t]) => t === 2 ? `<path d="M${x} ${y} c3 -4 9 -4 9 1 c0 3 -4 4 -5 2 c-1 -2 1 -3 2 -2" fill="#FFF4E6" stroke="#B8906A" stroke-width=".9"/>` : t === 1 ? `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" fill="#E8D8F0" stroke="#9A7AA8" stroke-width=".8"/><path d="M${x - 3} ${y} h6" stroke="#9A7AA8" stroke-width=".5"/>` : `<path d="M${x - 4} ${y} c0 -6 8 -6 8 0Z" fill="#FFE4D0" stroke="#C8806A" stroke-width=".8"/>`).join('')}</g>
    <g id="cc-pegadas" pointer-events="none" fill="#B8935A" opacity=".5">${Array.from({ length:11 }, (_, k) => { const t = k / 10, x = 286 + 140 * t, y = 368 + 40 * t + Math.sin(t * 5) * 6, ang = 28 + t * 6, l = k % 2 ? 3.4 : -3.4; return `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(ang)}) translate(0 ${l})"><ellipse rx="3.2" ry="1.7"/><circle cx="3.6" cy="${k % 2 ? -.8 : .8}" r=".7"/><circle cx="3.9" cy="0" r=".6"/></g>`; }).join('')}</g>
    <g id="cc-jundu">${Array.from({ length:15 }, (_, i) => { const x = i * 21 + R(-4, 4), y = 322 - x * .1 + R(-2, 3); return `<path d="M${P(x)} ${P(y)} q-2 -9 -6 -13 M${P(x)} ${P(y)} q1 -11 4 -15 M${P(x)} ${P(y)} q4 -6 9 -8" stroke="${i % 2 ? '#6E9A3A' : '#8AAE4A'}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${P(x - 8)} ${P(y + 4)} q10 -5 22 -1" stroke="#3E7A2A" stroke-width="1.4" fill="none"/><path d="M${P(x + 2)} ${P(y + 2)} c-4 -5 3 -9 5 -4 c3 -5 9 0 4 4Z" fill="#4E9A3A" stroke="#2E6A22" stroke-width=".7"/>${i % 3 !== 1 ? `<g transform="translate(${P(x + 12)} ${P(y - 1)})"><path d="M0 -3.4 L3.2 -1 L2 2.8 L-2 2.8 L-3.2 -1Z" fill="#D07ADC" stroke="#8A3A9A" stroke-width=".5"/><circle r=".9" fill="#FFF0FA"/></g>` : ''}`; }).join('')}</g>
    <g id="cc-espumas" pointer-events="none" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"><path d="${renda(13, 3, [[2, 20], [24, 46], [50, 72]])}" stroke-width="2" opacity=".75"/><path d="${renda(27, 3.4, [[6, 30], [36, 58], [62, 76]], 3)}" stroke-width="1.6" opacity=".55"/><path d="${renda(46, 3.6, [[0, 18], [26, 52]], 3)}" stroke-width="1.3" opacity=".38"/><path d="${renda(70, 4, [[4, 22], [34, 48]], 4)}" stroke-width="1.1" opacity=".25"/></g>
    <g id="cc-espuma" pointer-events="none"><path d="${faixaEspuma(-1.5, 5)}" fill="#FFFFFF" opacity=".88"/><g fill="#FFFFFF" opacity=".8">${Array.from({ length:34 }, (_, k) => { const [x, y] = naCosta(2 + k * 2.2, R(6, 10)); return `<circle cx="${P(x)}" cy="${P(y)}" r="${P(R(.7, 1.6))}"/>`; }).join('')}</g></g>
    <path d="M300 292 C350 320 420 380 470 440 C490 466 505 486 512 500" stroke="#FFF8E8" stroke-width="2" fill="none" opacity=".5" transform="translate(-14 4)"/>
    <g id="cc-bravo" pointer-events="none" style="transition:opacity 2s">
      <g id="cc-cristas">${Array.from({ length:14 }, (_, i) => { const x = 470 + (i * 97) % 330, y = 222 + Math.floor(i / 3) * 52 + (i % 3) * 8, w = 30 + (i % 3) * 12; return `<path d="M${x - w} ${y} C${x - w * .5} ${y - 9} ${x + w * .3} ${y - 11} ${x + w} ${y - 2} C${x + w * .5} ${y - 4} ${x - w * .2} ${y - 2} ${x - w} ${y}Z" fill="#FFFFFF" opacity=".85"/><path d="M${x - w * .6} ${y + 2} q${w * .5} -4 ${w} 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6"/>`; }).join('')}</g>
      <path d="${faixaEspuma(-2, 12)}" fill="#FFFFFF" opacity=".7"/><path d="${renda(22, 5, [[0, 76]])}" stroke="#FFFFFF" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>
    </g>
    <path d="${RIO}" stroke="#8A7A4A" stroke-width="17" fill="none" stroke-linecap="round" opacity=".45"/>
    <path d="${RIO}" stroke="#5E9A3A" stroke-width="14" fill="none" stroke-linecap="round" opacity=".5" stroke-dasharray="3 5"/>
    <path id="cc-rio" d="${RIO}" stroke="#2E8EC0" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="${RIO}" stroke="#7FD0EE" stroke-width="3.4" fill="none" stroke-linecap="round" transform="translate(-1 -1.4)" opacity=".9"/>
    <path d="M286 296 C278 288 282 282 292 284 C306 286 330 292 336 302 C338 310 322 314 306 312 C294 310 290 302 286 296Z" fill="#E8D49A" opacity=".8"/>
    <path id="cc-lagoa" d="M290 297 C284 291 290 287 298 288 C310 289 326 294 330 302 C330 308 318 310 306 308 C296 306 293 301 290 297Z" fill="url(#ccLagoa)" stroke="#2E7A9A" stroke-width="1"/>
    <path d="M296 293 C306 293 318 296 324 301" stroke="#E6FAFF" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path id="cc-rio-turvo" d="M252 274 C266 278 276 282 284 290 C288 294 292 298 300 300 C312 304 322 304 326 302" stroke="#8A7A4A" stroke-width="10" fill="none" stroke-linecap="round" style="opacity:0;transition:opacity 1.6s"/>
    <path class="cc-fluxo" d="${RIO}" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="3 16" opacity=".75"/>
    <g fill="#5E6A64" stroke="#1E2A28" stroke-width=".8">${[[226, 252, 3.4], [246, 268, 3], [270, 279, 3.6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${P(r * .6)}"/>`).join('')}</g>
    <g stroke-linecap="round" fill="none">${[[282, 300], [287, 306], [276, 298], [334, 306], [338, 300]].map(([x, y], k) => `<path d="M${x} ${y} q${k % 2 ? 2 : -2} -10 ${k % 2 ? 1 : -1} -18" stroke="#4E7A2A" stroke-width="1.6"/><path d="M${x + (k % 2 ? 1 : -1)} ${y - 18} v-6" stroke="#7A4A22" stroke-width="3"/>`).join('')}</g>
    <!-- roça de mandioca -->
    <g id="cc-roca" class="toque"><path d="M150 262 C170 252 200 250 222 256 L216 274 C196 270 170 272 150 278Z" fill="#9A6A3A" stroke="#6E4422" stroke-width="1"/><g stroke="#7A4E28" stroke-width=".8" fill="none" opacity=".8"><path d="M154 268 C176 262 196 262 218 264 M152 274 C174 268 196 268 216 270"/></g><g id="cc-roca-pl">${[[160, 270, .62], [174, 266, .68], [188, 266, .66], [202, 264, .64], [214, 266, .6], [168, 276, .58], [196, 274, .6]].map(([x, y, s]) => mandioca(x, y, s)).join('')}</g><rect x="146" y="236" width="80" height="44" fill="transparent"/></g>
    <!-- casas -->
    <g id="cc-casas">${casa(4, 276, 52, 32, '#FFF6E8', 0, '#2E7BF6')}${casa(64, 262, 46, 30, '#FFE07A', 0, '#3FA864')}${casa(124, 266, 36, 26, '#F4E6D2', 1, '#C8402A')}${casa(232, 240, 36, 24, '#FFCAD8', 0, '#2E7BF6')}<g transform="translate(170 250)"><path d="M0 0 V-16 M10 0 V-16" stroke="#6E4422" stroke-width="1.6"/><path d="M-4 -16 H14" stroke="#6E4422" stroke-width="2"/><path d="M-2 -16 C0 -10 4 -10 6 -16 M6 -16 C8 -11 10 -11 12 -16" stroke="#3FA864" stroke-width="1" fill="none"/></g></g>
    <g stroke="#8A8A8A" stroke-width=".8"><path d="M52 248 L62 244 M100 238 L110 252"/></g>
    <!-- casa de farinha -->
    <g id="cc-farinha" class="toque">
      <ellipse cx="96" cy="334" rx="56" ry="5" fill="#5A4A1A" opacity=".25"/>
      <path d="M48 334 V296 M144 334 V296" stroke="#6E4422" stroke-width="3.4" stroke-linecap="round"/><path d="M48 334 V296 M144 334 V296" stroke="#B07A4A" stroke-width="1.4"/>
      <path d="M58 334 C58 318 72 312 96 312 C120 312 134 318 134 334Z" fill="url(#ccForno)" stroke="#5E2E12" stroke-width="1.4"/><path d="M88 334 C88 326 104 326 104 334Z" fill="#3A1A0A"/><path d="M90 334 C92 330 96 329 100 331" stroke="#FF9A3A" stroke-width="2" fill="none"/>
      <ellipse cx="96" cy="312" rx="38" ry="5.4" fill="#C8C2B4" stroke="#6E6A5E" stroke-width="1.2"/><ellipse cx="96" cy="311" rx="33" ry="3.6" fill="#FFF4DC"/><g fill="#F0E2BE">${Array.from({ length:12 }, () => `<circle cx="${P(R(68, 124))}" cy="${P(R(309, 313))}" r=".9"/>`).join('')}</g>
      <path d="M36 300 L96 270 L156 300Z" fill="url(#ccSape)" stroke="#7A5A22" stroke-width="1.4" stroke-linejoin="round"/><g stroke="#9A7A3A" stroke-width=".7" opacity=".9">${Array.from({ length:20 }, (_, i) => `<path d="M${40 + i * 6} 299 L${P(96 + (40 + i * 6 - 96) * .45)} ${P(284)}"/>`).join('')}</g><path d="M36 300 H156" stroke="#E8CC88" stroke-width="1.4"/>
      <g id="cc-avo" transform="translate(128 334) scale(.74)">${pessoa({ pele:PELES.avo[0], peleE:PELES.avo[1], cabelo:'#D8D4CC', cabeloE:'#8A867E', estilo:'coque', rugas:1, camisa:'#E86A8A', camisaE:'#9A2E4E', saia:'#3E6AB8', saiaE:'#1E3A7A', saiaFlor:'#FFE27A', avental:'#FFF8EE', chinelo:'#7A4A2A', bracoD:[-10, 6, -22, 4], bracoE:[-3, 10, -10, 18], itemFrente:'' })}<g id="cc-rodo" style="transform-origin:-12px -60px"><path d="M-12 -61 L-52 -20" stroke="#5E3418" stroke-width="3.4" stroke-linecap="round"/><path d="M-12 -61 L-52 -20" stroke="#C8925A" stroke-width="1.8" stroke-linecap="round"/><path d="M-58 -24 L-46 -14" stroke="#5E3418" stroke-width="4.4" stroke-linecap="round"/></g></g>
      <g id="cc-fumaca" fill="#fff" opacity="0"><circle cx="80" cy="300" r="5"/><circle cx="92" cy="292" r="6"/><circle cx="104" cy="298" r="4.4"/></g>
      <rect x="40" y="270" width="116" height="66" fill="transparent"/>
    </g>
    <!-- varal de redes -->
    <g id="cc-varal" class="toque"><ellipse cx="200" cy="340" rx="38" ry="4" fill="#5A4A1A" opacity=".2"/><path d="M168 340 V300 M232 340 V300" stroke="#5E3418" stroke-width="3.4" stroke-linecap="round"/><path d="M168 340 V300 M232 340 V300" stroke="#B07A4A" stroke-width="1.4"/><path d="M164 302 H236" stroke="#6E4422" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M168 303 C170 318 166 330 172 336 L190 334 C186 322 190 312 186 303Z M188 303 C192 320 188 330 194 338 L214 336 C210 324 214 312 210 303Z M210 303 C212 316 210 326 216 334 L232 332 C228 322 232 312 230 303Z" fill="#3E9A6A" fill-opacity=".35" stroke="#2E6A4A" stroke-width="1.1"/>
      <g stroke="#5ABA8A" stroke-width=".8" fill="none" opacity=".9">${Array.from({ length:9 }, (_, i) => `<path d="M${170 + i * 7} 304 q${i % 2 ? 2 : -2} 14 ${i % 2 ? -1 : 1} 30"/>`).join('')}${[312, 320, 328].map(y => `<path d="M168 ${y} Q200 ${y + 4} 232 ${y - 1}"/>`).join('')}</g>
      <g fill="#FF8A3A" stroke="#8A3A0E" stroke-width=".6">${[176, 198, 220].map(x => `<rect x="${x - 3}" y="302" width="6" height="4" rx="1.6"/>`).join('')}</g>
      <rect x="160" y="296" width="80" height="46" fill="transparent"/></g>
    <!-- detalhes da areia -->
    <g fill="#E0C48A" opacity=".8">${Array.from({ length:9 }, (_, i) => { const x = 330 - i * 26, y = 440 - i * 8 + (i % 2) * 6; return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" transform="rotate(-20 ${x} ${y})"/><ellipse cx="${x + 5}" cy="${y + 5}" rx="2.6" ry="1.4" transform="rotate(-20 ${x + 5} ${y + 5})"/>`; }).join('')}</g>
    <g>${[[90, 470, '#FFE0D0', '#C8806A'], [300, 486, '#FFF0DC', '#B8906A'], [410, 452, '#FFD8E4', '#B86A8A'], [226, 372, '#FFF4E0', '#B8966A']].map(([x, y, c1, c2]) => `<path d="M${x - 5} ${y} c0 -7 10 -7 10 0Z" fill="${c1}" stroke="${c2}" stroke-width=".9"/><path d="M${x - 2.4} ${y} l2.4 -4.6 l2.4 4.6" stroke="${c2}" stroke-width=".7" fill="none"/>`).join('')}</g>
    <g id="cc-tronco"><path d="M8 398 C30 392 60 392 78 396 C80 402 76 406 70 406 C50 404 28 406 10 408 C4 406 4 400 8 398Z" fill="#B8A084" stroke="#5E4A34" stroke-width="1.4"/><ellipse cx="76" cy="401" rx="4" ry="5" fill="#D8C4A4" stroke="#5E4A34" stroke-width="1"/><path d="M76 398 a2 2 0 1 0 .1 0" stroke="#8A7458" stroke-width=".7" fill="none"/><path d="M16 400 C34 396 52 396 66 398" stroke="#E8DCC8" stroke-width="1.4" fill="none"/><path d="M30 392 C26 384 30 378 36 378" stroke="#4E9A3A" stroke-width="1.6" fill="none"/></g>
    <!-- saco de reciclagem -->
    <g id="cc-saco" transform="translate(${SACO.x} ${SACO.y})"><ellipse cx="0" cy="18" rx="22" ry="4" fill="#5A4A1A" opacity=".25"/><path d="M-18 -14 C-22 0 -20 12 -16 18 H16 C20 12 22 0 18 -14Z" fill="url(#ccSaco)" stroke="#6E6A5E" stroke-width="1.6"/><path d="M-18 -14 C-10 -10 10 -10 18 -14 C10 -18 -10 -18 -18 -14Z" fill="#5A5444"/><path d="M-19 -3 H19" stroke="#3FA864" stroke-width="3"/><g transform="translate(0 7)" fill="none" stroke="#2E8A4A" stroke-width="1.6" stroke-linecap="round"><path d="M-5 2 L0 -5 L4 0 M5 3 L-5 3 M-3 -3"/><path d="M3 -2 l1.6 2.4 l-2.8 .4"/></g><g id="cc-saco-dentro"></g><g id="cc-saco-hint" style="display:none">${brilhoHotspot(20, -18)}</g></g>
    <!-- canoa grande da vizinha (figurinha) -->
    <g id="cc-canoa-fig" class="toque" data-fig="canoacaicara"><ellipse cx="72" cy="470" rx="70" ry="6" fill="#5A4420" opacity=".25"/><svg x="-4" y="424" width="150" height="51" viewBox="2 26 156 53"><use href="#f-canoacaicara" width="160" height="90"/></svg>${brilhoHotspot(134, 438)}</g>
    <!-- jerivá -->
    <g id="cc-jeriva" class="toque">
      <path d="M326 336 C328 300 332 260 336 222 C338 200 340 186 344 172" stroke="#5E4A34" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M326 336 C328 300 332 260 336 222 C338 200 340 186 344 172" stroke="#9A8468" stroke-width="5.4" fill="none" stroke-linecap="round"/>
      <g stroke="#6E5A44" stroke-width="1" opacity=".7">${Array.from({ length:14 }, (_, i) => { const y = 330 - i * 11; return `<path d="M${P(323 + i * 1.2)} ${y} l7 -2"/>`; }).join('')}</g>
      <g id="cc-copa-vento" style="transform-origin:344px 172px;transition:transform 1.6s"><g class="cc-copa-mexe" style="transform-origin:344px 172px">
        <g transform="translate(344 172)">${[[-2.8, 70], [-2.3, 76], [-1.8, 60], [-1.2, 56], [-.6, 66], [-.1, 74], [.5, 64]].map(([a, L]) => jerivaFolha(a, L)).join('')}<circle r="5" fill="#7A5A2A"/><g fill="#F2A23A" stroke="#A85A10" stroke-width=".6">${[[-4, 6], [0, 8], [4, 6], [-2, 11], [3, 11]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.2"/>`).join('')}</g></g>
      </g></g>
      <rect x="300" y="120" width="90" height="216" fill="transparent"/>
    </g>
    <!-- laje com atobá -->
    <g id="cc-laje"><path d="M484 246 C488 234 500 228 512 230 C524 230 532 238 534 248Z" fill="url(#ccPedra)" stroke="#3A3632" stroke-width="1.4"/><path d="M490 240 C498 234 508 233 516 234" stroke="#C8C2B8" stroke-width="1.6" fill="none"/><path d="M480 248 q12 -5 24 0 t26 0" stroke="#fff" stroke-width="2" fill="none" opacity=".85"/></g>
    <g id="cc-atoba" class="toque" data-fig="atobapardo"><g id="cc-atoba-pos"><rect x="488" y="194" width="40" height="40" fill="transparent"/><svg x="490" y="196" width="34" height="34" viewBox="0 0 100 100"><use href="#f-atobapardo" width="100" height="120"/></svg></g>${brilhoHotspot(528, 202)}</g>
    <!-- cerco flutuante: espia (caminho), sala, boca e casa de peixe -->
    <g id="cc-cerco" class="toque">
      ${(() => { const pc = (C, a) => [C.x + Math.cos(a) * C.rx, C.y + Math.sin(a) * C.ry]; const coracao = a => { const d = ((a % (PI * 2)) + PI * 2) % (PI * 2) - PI, k = 1 - .46 * Math.exp(-((d / .55) ** 2)); return [CERCO.x + Math.cos(a) * CERCO.rx * k, CERCO.y + Math.sin(a) * CERCO.ry * k]; };
        const arco = (C, a0, a1, n) => Array.from({ length:n + 1 }, (_, k) => pc(C, a0 + (a1 - a0) * k / n));
        const casaP = Array.from({ length:49 }, (_, k) => coracao(PI + .2 + (PI * 2 - .4) * k / 48)), salaA = arco(SALA, -.55, -1.85, 8), salaB = arco(SALA, -2.55, -PI * 2 + .55, 22);
        const espia = Array.from({ length:13 }, (_, k) => [440 + (552 - 440) * k / 12, 262 + (290 - 262) * k / 12]);
        const caminho = pts => 'M' + pts.map(([x, y]) => `${P(x)} ${P(y)}`).join(' L');
        const parede = (pts, postes, boias) => { const d = caminho(pts);
          let o = `<path d="${d}" stroke="#0E3E62" stroke-width="9" fill="none" opacity=".28" transform="translate(0 6)" stroke-linejoin="round"/>`;
          o += `<g stroke="#D8F0F8" stroke-width=".7" opacity=".45">${pts.map(([x, y]) => `<path d="M${P(x)} ${P(y)} v8"/>`).join('')}</g>`;
          o += `<path d="${d}" stroke="#D8F0F8" stroke-width=".6" fill="none" opacity=".5" transform="translate(0 4)"/>`;
          o += `<path d="${d}" stroke="#F4ECD8" stroke-width="1.7" fill="none" stroke-linejoin="round"/>`;
          o += pts.filter((_, k) => k % postes === 0).map(([x, y]) => `<path d="M${P(x)} ${P(y + 6)} V${P(y - 16)}" stroke="#4E3A1E" stroke-width="3.2" stroke-linecap="round"/><path d="M${P(x - .4)} ${P(y + 5)} V${P(y - 15)}" stroke="#C8A06A" stroke-width="1.1"/><path d="M${P(x)} ${P(y + 8)} v7" stroke="#4E3A1E" stroke-width="2" opacity=".25"/><path d="M${P(x - 4)} ${P(y + 6)} q4 -2 8 0" stroke="#fff" stroke-width=".9" fill="none" opacity=".8"/>`).join('');
          o += pts.filter((_, k) => k % boias === 1).map(([x, y], k) => `<ellipse cx="${P(x)}" cy="${P(y)}" rx="3.6" ry="2.2" fill="${k % 2 ? '#FF8A3A' : '#FFFFFF'}" stroke="#7A3A12" stroke-width=".6"/>`).join('');
          return o; };
        const casaD = caminho(casaP);
        return `<path d="${casaD}Z" fill="#0E5A8A" opacity=".08"/><path d="${casaD}Z" fill="url(#ccMalha)" opacity=".22"/>
          <path id="cc-cerco-raso" d="${casaD}Z" fill="#46C8DC" style="opacity:0;transition:opacity 1s"/>
          <g id="cc-sombras" clip-path="url(#ccCercoClip)" fill="#0A2A3E" opacity=".38">${PEIXES.map((p, i) => { const L = p.t === 'grande' ? 16 : p.t === 'tartaruga' ? 12 : 8, sx = i % 2 ? -1 : 1; return p.t === 'tartaruga' ? `<ellipse class="cc-sombra" cx="${p.x}" cy="${p.y + 3}" rx="11" ry="8"/>` : `<path class="cc-sombra" transform="translate(${p.x} ${p.y + 3}) scale(${sx} 1)" d="M${-L} 0 C${-L * .6} ${-L * .32} ${L * .4} ${-L * .3} ${L * .7} 0 L${L} ${-L * .26} L${L} ${L * .26} L${L * .7} 0 C${L * .4} ${L * .3} ${-L * .6} ${L * .32} ${-L} 0Z"/>`; }).join('')}</g>
          <g id="cc-rede-sobe" style="opacity:0;transition:opacity .8s"><path d="${casaD}Z" fill="url(#ccMalha)" opacity=".9"/><path d="M${CERCO.x - 80} ${CERCO.y + 18} C${CERCO.x - 40} ${CERCO.y + 34} ${CERCO.x + 40} ${CERCO.y + 34} ${CERCO.x + 84} ${CERCO.y + 16}" stroke="#E8F4F8" stroke-width="1.6" fill="none"/><g fill="#fff">${Array.from({ length:10 }, (_, k) => `<circle cx="${P(CERCO.x - 80 + k * 18)}" cy="${P(CERCO.y + 22 + Math.sin(k) * 5)}" r="1.3"/>`).join('')}</g></g>
          ${parede(espia, 2, 2)}${parede(salaA, 3, 2)}${parede(salaB, 4, 2)}${parede(casaP, 4, 2)}
          <g fill="none" stroke="#fff" stroke-width="1.1" opacity=".7">${[[600, 286], [560, 286], [520, 312], [760, 330], [700, 348], [640, 346]].map(([x, y]) => `<path d="M${x - 7} ${y} q7 -3 14 0"/>`).join('')}</g>`; })()}
      <g id="cc-cerco-hint" style="display:none">${brilhoHotspot(CERCO.x + 40, CERCO.y - 46)}</g>
      <rect x="516" y="${CERCO.y - CERCO.ry - 20}" width="${CERCO.x + CERCO.rx - 516}" height="${CERCO.ry * 2 + 26}" fill="transparent"/>
    </g>
    <g id="cc-peixes">${PEIXES.map((p, i) => `<g class="cc-peixe" data-i="${i}" data-t="${p.t}" transform="translate(${p.x} ${p.y})" style="opacity:0;transition:opacity .8s;pointer-events:none"><g class="cc-sel" style="display:none"><ellipse rx="${p.t === 'filhote' ? 16 : 28}" ry="${p.t === 'tartaruga' ? 20 : 14}" fill="none" stroke="#FFE27A" stroke-width="2.4" stroke-dasharray="5 4"/></g><g style="animation:flutua ${(1.6 + i * .23).toFixed(2)}s ease-in-out infinite alternate"><g transform="scale(${p.t === 'grande' ? 1 : p.t === 'tartaruga' ? .95 : 1.35}) ${i % 2 ? 'scale(-1 1)' : ''}">${p.t === 'grande' ? peixeG() : p.t === 'tartaruga' ? tarta() : peixeP()}</g></g><ellipse rx="${p.t === 'filhote' ? 16 : 26}" ry="16" fill="transparent"/></g>`).join('')}</g>
    <!-- toninha -->
    <g id="cc-toninha" class="toque" data-fig="toninha"><g id="cc-ton-pos"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><ellipse cx="448" cy="352" rx="40" ry="7" fill="#0E5A8A" opacity=".35"/><svg x="404" y="306" width="84" height="46" viewBox="0 0 150 82"><use href="#f-toninha" width="150" height="100"/></svg><path d="M412 350 q8 -6 16 0 M462 352 q8 -6 16 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="406" cy="344" r="2" fill="#E6F8FF"/><circle cx="486" cy="342" r="1.6" fill="#E6F8FF"/></g></g>${brilhoHotspot(486, 312)}</g>
    <!-- maria-farinha -->
    <g id="cc-siri" class="toque"><ellipse cx="236" cy="492" rx="6" ry="2.4" fill="#6E5430" opacity=".6"/><g id="cc-siri-pos" transform="translate(254 488)"><g id="cc-siri-in"><path d="M-8 2 l-6 5 M-7 3 l-4 7 M8 2 l6 5 M7 3 l4 7" stroke="#C8A878" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="10" ry="6.4" fill="#F4E2BE" stroke="#9A7A4A" stroke-width="1.4"/><path d="M-9 -3 C-15 -8 -16 -12 -11 -14 C-9 -10 -8 -9 -7 -6 M9 -3 C15 -8 16 -12 11 -14 C9 -10 8 -9 7 -6" fill="#F4E2BE" stroke="#9A7A4A" stroke-width="1.3"/><path d="M-3 -5 v-6 M3 -5 v-6" stroke="#9A7A4A" stroke-width="1.3"/><circle cx="-3" cy="-11.4" r="2.2" fill="#1A1410"/><circle cx="3" cy="-11.4" r="2.2" fill="#1A1410"/><circle cx="-2.4" cy="-12" r=".7" fill="#fff"/><circle cx="3.6" cy="-12" r=".7" fill="#fff"/><path d="M-5 -1 q5 -3 10 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></g><rect x="-20" y="-20" width="40" height="32" fill="transparent"/></g></g>
    <!-- vô em pé, empurrando -->
    <g id="cc-vo-pe" class="toque" transform="translate(158 474) scale(1.18)">${pessoa(Object.assign({}, VO, { bracoD:[8, 7, 18, 6], bracoE:'cintura' }))}</g>
    <!-- canoa da família -->
    <g id="cc-canoa" class="toque" style="cursor:grab"><g id="cc-canoa-pos" transform="translate(${PRAIA.x} ${PRAIA.y})"><g id="cc-canoa-bob">
      <ellipse id="cc-canoa-sombra" cx="0" cy="8" rx="108" ry="6" fill="#5A4420" opacity=".28"/>
      ${dentro(96)}
      <g id="cc-balaio" transform="translate(4 -16)"><path d="M-12 2 C-12 -8 12 -8 12 2 L10 12 H-10Z" fill="#D8A84E" stroke="#7A5418" stroke-width="1.1"/><g stroke="#A8782A" stroke-width=".8"><path d="M-11 5 H11 M-10.6 8.4 H10.6"/></g><g id="cc-balaio-peixes"></g><path d="M-8 -3 C-3 -6 4 -6 9 -3" stroke="#FFE6A0" stroke-width="1.2" fill="none"/></g>
      <g id="cc-vo-sent" style="display:none" transform="translate(-58 25) scale(.92)">${pessoa(Object.assign({}, VO, { sentado:1, bracoE:[4, 8, 8, 14], bracoD:[-2, 12, -8, 22], item:'' }))}<g id="cc-remo" style="transform-origin:-4px -46px"><path d="M-10 -72 L16 6" stroke="#5E3418" stroke-width="3.6" stroke-linecap="round"/><path d="M-10 -72 L16 6" stroke="#D8A86A" stroke-width="1.8" stroke-linecap="round"/><path d="M12 -2 C18 -4 24 4 22 14 C16 16 12 10 12 -2Z" fill="#D8A86A" stroke="#5E3418" stroke-width="1.3"/></g></g>
      <g id="cc-neta" class="toque" transform="translate(56 18) scale(1.02)">${pessoa(Object.assign({}, NETA, { sentado:1, bracoD:'baixo', bracoE:'baixo' }))}</g>
      ${casco(96)}
      <path id="cc-canoa-esteira" d="M-120 4 q10 -4 20 0 q10 4 20 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" style="opacity:0"/>
      <g id="cc-canoa-hint" style="display:none">${brilhoHotspot(84, -40)}</g>
      <rect x="-110" y="-70" width="220" height="86" fill="transparent"/>
    </g></g></g>
    <g id="cc-mao" style="display:none"><path d="M380 482 C414 488 446 484 476 470" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M484 465 l-14 1 l6 11Z" fill="#fff"/></g>
    <g id="cc-corda" class="toque" style="display:none"><path d="M632 378 C634 364 638 352 646 ${CERCO.y + CERCO.ry - 1}" stroke="#8A6A3A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M632 378 C634 364 638 352 646 ${CERCO.y + CERCO.ry - 1}" stroke="#F4DCA8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-dasharray="3 2"/><circle cx="646" cy="${CERCO.y + CERCO.ry - 1}" r="5" fill="#FF8A3A" stroke="#8A3A0E" stroke-width="1"/>${brilhoHotspot(662, CERCO.y + CERCO.ry - 6)}<rect x="616" y="${CERCO.y + CERCO.ry - 20}" width="64" height="64" fill="transparent"/></g>
    <g id="cc-solta" style="display:none"><path d="M${CERCO.x + 40} ${CERCO.y - CERCO.ry - 6} C${CERCO.x + 60} ${CERCO.y - CERCO.ry - 24} ${CERCO.x + 90} ${CERCO.y - CERCO.ry - 28} ${CERCO.x + 112} ${CERCO.y - CERCO.ry - 20}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="5 6" stroke-linecap="round"/><path d="M${CERCO.x + 116} ${CERCO.y - CERCO.ry - 18} l-10 -6 l1 10Z" fill="#fff"/></g>
    <!-- lixo trazido pela maré -->
    <g id="cc-lixos">${LIXO.map((l, i) => `<g class="cc-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="display:none;cursor:grab"><g style="animation:flutua ${(2.2 + i * .3).toFixed(1)}s ease-in-out infinite alternate">${desenhoLixo[l.id]}</g><circle r="26" fill="transparent"/></g>`).join('')}</g>
    <!-- fandango ao entardecer -->
    <g id="cc-fandango" class="toque" style="opacity:0;transition:opacity 1.6s;pointer-events:none">
      <g id="cc-luzes">${Array.from({ length:13 }, (_, i) => { const x = 132 + i * 24, y = 296 + Math.sin(i / 12 * PI) * 18; return `<circle cx="${x}" cy="${P(y + 4)}" r="7" fill="#FFE8A0" opacity=".25"/><path d="M${x} ${P(y)} v2" stroke="#3A3A3A" stroke-width="1.4"/><ellipse class="brilho" style="animation-delay:${(i * .2).toFixed(1)}s" cx="${x}" cy="${P(y + 4.6)}" rx="3" ry="3.8" fill="${['#FFE27A', '#FF9A5A', '#9AE0FF'][i % 3]}" stroke="#8A6A2A" stroke-width=".6"/>`; }).join('')}<path d="M132 296 Q276 332 420 296" stroke="#5A4A3A" stroke-width=".9" fill="none"/><path d="M132 296 V424 M420 296 V428" stroke="#5E3418" stroke-width="3.4" stroke-linecap="round"/><path d="M132 296 V424 M420 296 V428" stroke="#A8743E" stroke-width="1.4"/></g>
      <g class="cc-musico" transform="translate(168 424) scale(1.2)">${pessoa(Object.assign({}, VO, { bracoD:[2, 14, -10, 18], bracoE:[2, 12, -6, 14], item:`<g transform="translate(-2 -44) rotate(-28)"><path d="M-30 0 H-6" stroke="#5E3418" stroke-width="4"/><path d="M-36 -3 h7 v6 h-7Z" fill="#7A4A22"/><path d="M-6 0 C-6 -8 2 -10 6 -7 C10 -10 22 -10 22 0 C22 10 10 10 6 7 C2 10 -6 8 -6 0Z" fill="#E8B46A" stroke="#7A4A22" stroke-width="1.2"/><circle cx="8" cy="0" r="3" fill="#3A2210"/><path d="M-34 -1 H18 M-34 1 H18" stroke="#F4F0E6" stroke-width=".4"/></g>` }))}</g>
      <g class="cc-musico" transform="translate(230 426) scale(1.22)">${pessoa({ pele:PELES.tia[0], peleE:PELES.tia[1], cabelo:'#1A0E08', estilo:'longo', camisa:'#2EA88A', camisaE:'#1E6A5A', saia:'#F4F0E6', saiaE:'#A8A090', saiaFlor:'#E5392C', chinelo:'#E5392C', bracoE:[4, 8, 13, 16], bracoD:[-2, 10, -10, 12], itemFrente:`<g transform="translate(-10 -58) rotate(140)"><path d="M-9 0 C-9 -5 -5 -6 -3 -4 C-1 -6 3 -6 5 -4 C7 -6 11 -5 11 0 C11 5 7 6 5 4 C3 6 -1 6 -3 4 C-5 6 -9 5 -9 0Z" fill="#A85A2A" stroke="#4E2010" stroke-width="1.1"/><path d="M-1 -2 q1 2 0 4 M4 -2 q-1 2 0 4" stroke="#3A1A0A" stroke-width=".8" fill="none"/><path d="M11 0 H26" stroke="#3A1A0A" stroke-width="2.6" stroke-linecap="round"/><circle cx="27" cy="0" r="2.2" fill="#3A1A0A"/><path d="M-8 0 H26" stroke="#F4E6C8" stroke-width=".4"/><path d="M-6 -3 C-2 -5 4 -5 8 -3" stroke="#E8A070" stroke-width=".9" fill="none"/></g><path d="M-16 -44 L22 -62" stroke="#5E3A1A" stroke-width="1.3" stroke-linecap="round"/><path d="M-16 -44 L22 -62" stroke="#F4ECD8" stroke-width=".5" transform="translate(0 1.2)"/>` })}</g>
      <g class="cc-musico" transform="translate(290 422) scale(1.16)">${pessoa({ crianca:1, pele:PELES.menino[0], peleE:PELES.menino[1], cabelo:'#3A2414', camisa:'#E5392C', camisaE:'#8A1E14', listras:'#FFFFFF', short:'#3A3A4A', shortE:'#1A1A22', bone:'#2E7BF6', chinelo:'#3FA864', bracoE:'cima', bracoD:[-2, -4, -12, -10], itemFrente:`<g transform="translate(-17 -64) rotate(-10)"><rect x="-12" y="-12" width="24" height="24" rx="2" fill="#F4EAD2" stroke="#7A5A2A" stroke-width="1.8"/><rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#D8C8A0" stroke-width="1"/><path d="M-12 -12 l-4 -4 M12 -12 l4 -4" stroke="#E5392C" stroke-width="1.6"/></g>` })}</g>
      <g class="cc-danca" transform="translate(346 424) scale(1.24)"><g class="cc-danca-in">${pessoa(Object.assign({}, NETA, { colete:0, tamanco:1, saia:'#FF7AB0', saiaE:'#B83A6E', saiaFlor:'#FFFFFF', bracoD:'aceno', bracoE:[-8, -4, -12, -14] }))}</g></g>
      <g class="cc-danca" transform="translate(400 426) scale(1.2)"><g class="cc-danca-in">${pessoa({ crianca:1, pele:PELES.prima[0], peleE:PELES.prima[1], cabelo:'#6A3A1A', estilo:'rabo', laco:'#FFD43A', camisa:'#8A5AD8', camisaE:'#4E2A9A', short:'#F4F0E6', shortE:'#8A8070', tamanco:1, bracoD:[8, -2, 16, -10], bracoE:[-8, -2, -16, -10] })}</g></g>
      <g id="cc-notas"></g>
      <g id="cc-fandango-hint">${brilhoHotspot(196, 316)}</g>
      <rect x="130" y="300" width="300" height="130" fill="transparent"/>
    </g>
    <!-- tempo: nuvens de vento sul -->
    <g id="cc-tempo" style="transition:opacity 2s"><rect width="800" height="${HZ + 4}" fill="url(#ccTempo)" opacity=".55" pointer-events="none"/>
      <g id="cc-nuvens-sul" pointer-events="none"><use href="#nuvem" x="330" y="4" width="200" height="88" style="color:#6A7488"/><use href="#nuvem" x="470" y="44" width="170" height="74" style="color:#7E889A"/><use href="#nuvem" x="230" y="56" width="160" height="68" style="color:#8A94A6"/><use href="#nuvem" x="700" y="112" width="100" height="44" style="color:#6E788C"/><path d="M420 70 q30 -10 60 -4" stroke="#C8D0DC" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g>
      <g id="cc-vento-linhas" pointer-events="none" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"><path d="M440 150 q30 -8 60 0 q14 4 24 -6"/><path d="M560 120 q30 -8 60 0 q14 4 24 -6"/><path d="M380 186 q30 -8 60 0"/></g>
      <rect id="cc-tempo-hit" x="250" y="0" width="380" height="130" fill="transparent" class="toque"/>
    </g>
    <!-- noite -->
    <g id="cc-noite" pointer-events="none" style="opacity:0"><rect width="800" height="500" fill="#0B1838" opacity=".66"/><g fill="#fff">${Array.from({ length:44 }, () => { const x = R(4, 796), y = x < 330 ? R(4, 40) : x < 460 ? R(4, 90) : R(4, 180); return `<circle cx="${P(x)}" cy="${P(y)}" r="${P(R(.6, 1.6))}"/>`; }).join('')}</g>
      <g transform="translate(470 70)"><circle r="30" fill="#FFF6D8" opacity=".18"/><circle r="18" fill="#FFF6D8"/><g fill="#E6DCB8" opacity=".8"><circle cx="-5" cy="-4" r="3"/><circle cx="6" cy="5" r="2.4"/><circle cx="3" cy="-8" r="1.6"/></g></g>
      <g stroke="#FFF6D8" stroke-linecap="round" opacity=".5">${Array.from({ length:9 }, (_, i) => { const y = HZ + 8 + i * 12, w = 18 - i * 1.4; return `<path d="M${P(470 - w + (i % 2) * 6)} ${y} h${P(w * 2)}" stroke-width="${(2.6 - i * .15).toFixed(1)}"/>`; }).join('')}</g></g>
    <!-- galho da mata emoldurando -->
    <g id="cc-galho" class="toque"><path d="M-10 64 C20 50 50 34 92 26 C110 22 126 22 140 16" stroke="#3E2A1A" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M-10 64 C20 50 50 34 92 26 C110 22 126 22 140 16" stroke="#7A5A3A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 56 C24 44 54 30 90 24" stroke="#A88A68" stroke-width="1.6" fill="none" opacity=".8"/>
      <path d="M40 40 C44 60 40 80 46 100 M70 30 C72 46 68 60 72 72" stroke="#4E6A2A" stroke-width="1.6" fill="none"/><g fill="#5EA83E" stroke="#2E5A1E" stroke-width=".6">${[[46, 100], [44, 86], [42, 72], [72, 72], [70, 58]].map(([x, y]) => `<path d="M${x} ${y} c-6 -2 -8 -6 -6 -10 c4 2 6 6 6 10Z M${x} ${y} c6 -2 8 -6 6 -10 c-4 2 -6 6 -6 10Z"/>`).join('')}</g>
      ${[[0, 30, 22, 16, '#3E8A3A', '#2A6A2A'], [30, 14, 26, 16, '#4E9A3A', '#2E6A22'], [76, 6, 24, 14, '#5EA84A', '#2E6A22'], [120, 4, 22, 12, '#3E8A4A', '#1E5A2A'], [-4, 0, 30, 18, '#2E7A3A', '#1A5A2A']].map(([x, y, rx, ry, c1, c2]) => arvoreCopa(x, y, rx, ry, c1, c2, '#173E22')).join('')}
      <g id="cc-bromelia" transform="translate(104 22)"><path d="M0 0 C-10 -4 -16 -12 -18 -20 C-10 -14 -4 -10 0 -4 C-2 -12 0 -20 4 -26 C6 -18 6 -10 4 -4 C8 -10 14 -16 22 -18 C18 -10 10 -4 4 0Z" fill="#6AA84A" stroke="#2E5A1E" stroke-width="1"/><path d="M-2 -2 C2 -10 4 -16 8 -20 C8 -12 6 -6 2 -2Z" fill="#E5392C" stroke="#8A1E14" stroke-width=".9"/><circle cx="5" cy="-18" r="2" fill="#FFD43A"/></g>
      <rect x="-10" y="0" width="150" height="60" fill="transparent"/></g>
    <!-- primeiro plano -->
    <g>${salsa(0, 190, 494)}</g>
    <g id="cc-pedras"><path d="M690 500 C694 478 712 462 736 460 C752 452 774 452 790 462 C800 466 800 470 800 470 V500Z" fill="url(#ccPedra)" stroke="#33302C" stroke-width="1.8"/><path d="M748 500 C752 488 764 482 780 484 C792 486 800 490 800 494 V500Z" fill="#6E6860" stroke="#33302C" stroke-width="1.4"/><path d="M706 474 C716 466 730 462 744 464" stroke="#C8C2B8" stroke-width="2.2" fill="none" stroke-linecap="round"/><g fill="#2E2A26">${[[722, 480], [732, 486], [760, 470], [770, 476]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2" />`).join('')}</g><path d="M684 494 q10 -6 22 -2 q8 -8 18 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" class="cc-espuma2"/></g>
    <rect width="800" height="500" fill="url(#ccVinheta)" pointer-events="none"/><rect id="cc-calor" width="800" height="500" fill="#FF8A4A" pointer-events="none" style="opacity:0;transition:opacity 4s;mix-blend-mode:multiply"/><rect width="800" height="500" filter="url(#ccGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* vida da cena */
  s.querySelectorAll('.cc-fluxo, .cc-queda').forEach(f => f.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:1200, iterations:Infinity }));
  el(s, '#cc-espuma').animate([{ transform:'translate(0px,0px)', opacity:.95 }, { transform:'translate(-5px,4px)', opacity:.7 }], { duration:3200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }); el(s, '#cc-espumas').animate([{ transform:'translate(0px,0px)' }, { transform:'translate(-4px,3px)' }], { duration:3200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#cc-cristas').animate([{ transform:'translateX(0)' }, { transform:'translateX(-22px)' }], { duration:1800, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#cc-nuvens-sul').animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)' }], { duration:6000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#cc-vento-linhas').animate([{ transform:'translateX(30px)', opacity:0 }, { opacity:.8 }, { transform:'translateX(-60px)', opacity:0 }], { duration:1800, iterations:Infinity });
  el(s, '.cc-raios').animate([{ transform:'rotate(0)' }, { transform:'rotate(30deg)' }], { duration:9000, iterations:Infinity });
  const copaMexe = el(s, '.cc-copa-mexe');
  let animCopa = null;
  const vento = forte => { if (animCopa) animCopa.cancel(); el(s, '#cc-copa-vento').style.transform = forte ? 'rotate(-14deg)' : 'rotate(0)';
    animCopa = copaMexe.animate([{ transform:'rotate(0)' }, { transform:`rotate(${forte ? -8 : -2.4}deg)` }], { duration:forte ? 500 : 2600, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }); };
  vento(true);
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-8, 8), y:y + sorte(-3, 3), vy:sorte(.6, 1.4), r:sorte(1.6, 3.6), topo:y - 30, f:sorte(0, 6) }); };
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-10, 10), y:y + sorte(-3, 3), t:i * 2, cor:cor || '#E6F8FF' }); };
  /* ================= FASE 1: ler o mar ================= */
  const TEMPOS = [{ tempo:1, mar:.42, bravo:1, calmo:0, forte:true }, { tempo:.65, mar:.25, bravo:.55, calmo:.2, forte:true }, { tempo:0, mar:0, bravo:0, calmo:1, forte:false }];
  const aplicaTempo = d => { const t = TEMPOS[d]; el(s, '#cc-tempo').style.opacity = t.tempo; el(s, '#cc-mar-tempo').style.opacity = t.mar; el(s, '#cc-bravo').style.opacity = t.bravo; el(s, '#cc-calmo').style.opacity = t.calmo; vento(t.forte);
    el(s, '#cc-tempo-hit').style.display = t.tempo ? '' : 'none'; el(s, '#cc-reflexo').style.opacity = (1 - t.tempo).toFixed(2); };
  aplicaTempo(0);
  const solPos = (x, y) => el(s, '#cc-sol-pos').setAttribute('transform', `translate(${P(x)} ${P(y)})`);
  el(s, '#cc-sol').addEventListener('click', e => { e.stopPropagation();
    if (fase !== 'ler') { toca('ok'); c.brilhos(SOL0.x, SOL0.y, 5, '#FFE27A'); api.diz(fase === 'fandango' ? 'O sol se põe atrás da serra.' : 'De manhã o sol nasce do lado do mar.'); return; }
    if (ocupado) return;
    if (dia >= 2) { toca('ok'); api.diz('Hoje o mar está manso. Arraste a canoa até a água!'); return; }
    ocupado = true; toca('vapor'); el(s, '#cc-sol-hint').style.display = 'none';
    const noite = el(s, '#cc-noite');
    tween(1700, e2 => { solPos(SOL0.x - 600 * e2, SOL0.y + 160 * e2 - 40 * Math.sin(e2 * PI)); noite.style.opacity = Math.max(0, (e2 - .45) / .55).toFixed(2); }, () => {
      dia++; aplicaTempo(dia);
      if (dia === 1) { api.diz('De noite o vô olha a lua. A lua puxa a água do mar e faz a maré subir e descer.'); }
      else api.diz('Lua cheia! Nessa lua a maré sobe mais alto e desce mais baixo.');
      depois(2600, () => {
        if (dia === 1) { toca('chuva'); c.chover(420, 800, 60, 420, 60, '#BFD8EE'); }
        tween(1700, e3 => { solPos(SOL0.x + 80 - 80 * e3, 260 - (260 - SOL0.y) * e3); noite.style.opacity = (1 - Math.min(1, e3 * 1.6)).toFixed(2); }, () => {
          ocupado = false;
          if (dia === 1) { el(s, '#cc-sol-hint').style.display = ''; api.diz('Ainda tem vento sul e chuvinha. O mar continua agitado. Toque no sol para passar mais um dia.'); }
          else { toca('vitoria'); el(s, '#cc-canoa-hint').style.display = ''; el(s, '#cc-mao').style.display = ''; api.hud('<span class="chip">Mar: manso</span>');
            api.diz('Mar manso e sem vento forte! Agora sim. Arraste a canoa até a água!'); }
        });
      });
    });
  });
  el(s, '#cc-tempo-hit').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Nuvens escuras e vento sul: lá vem mar bravo. O caiçara lê o céu antes de sair.'); });
  el(s, '#cc-jeriva').addEventListener('click', e => { e.stopPropagation(); toca('clique'); c.brilhos(344, 172, 4, '#C8F0A0');
    api.diz(dia < 2 && fase === 'ler' ? 'As folhas do jerivá mostram o vento. Hoje ele sopra forte!' : 'O jerivá é uma palmeira da Mata Atlântica. Os passarinhos adoram os coquinhos dele.'); });
  el(s, '#cc-mar-hit').addEventListener('pointerdown', e => { if (fase === 'remar') return remaToque(e); if (fase === 'escolher' && selec >= 0) return; if (fase === 'escolher') return; const p = c.ponto(e); toca('splash'); respinga(p.x, p.y, 3);
    if (fase === 'ler') api.diz(dia < 2 ? 'Ondas grandes com espuma branca: é mar bravo. Melhor esperar!' : 'Ondinhas pequenas: mar manso, bom para a canoa.'); });
  /* canoa: arrastar até a água */
  const can = { x:PRAIA.x, y:PRAIA.y, k:1 };
  const poeCanoa = () => el(s, '#cc-canoa-pos').setAttribute('transform', `translate(${P(can.x)} ${P(can.y)}) scale(${can.k.toFixed(3)})`);
  let arrCanoa = null;
  el(s, '#cc-canoa').addEventListener('pointerdown', e => { if (fase !== 'ler' || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arrCanoa = { x0:p.x, dx:p.x - can.x, moveu:false }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!arrCanoa) return; const p = c.ponto(e); if (Math.abs(p.x - arrCanoa.x0) > 8) arrCanoa.moveu = true;
    if (dia < 2) { can.x = PRAIA.x + Math.max(-6, Math.min(16, p.x - arrCanoa.dx - PRAIA.x)); poeCanoa(); return; }
    can.x = Math.max(PRAIA.x, Math.min(LARGA.x, p.x - arrCanoa.dx)); can.y = PRAIA.y + (LARGA.y - PRAIA.y) * (can.x - PRAIA.x) / (LARGA.x - PRAIA.x); poeCanoa();
    el(s, '#cc-vo-pe').setAttribute('transform', `translate(${P(158 + (can.x - PRAIA.x))} 474) scale(1.18)`); });
  s.addEventListener('pointerup', () => { if (!arrCanoa) return; const m = arrCanoa.moveu; arrCanoa = null;
    if (dia < 2) { tween(400, e2 => { can.x = can.x + (PRAIA.x - can.x) * e2; poeCanoa(); }); toca('glub');
      el(s, '#cc-canoa-bob').animate([{ transform:'translateX(0)' }, { transform:'translateX(-4px)' }, { transform:'translateX(4px)' }, { transform:'translateX(0)' }], { duration:300, iterations:2 });
      api.diz('Ainda não! Com vento sul e ondas grandes, o mar está bravo. Toque no sol e espere o mar acalmar.'); return; }
    if (!m || can.x > PRAIA.x + 120) lancar(); else { tween(500, e2 => { can.x += (PRAIA.x - can.x) * e2; can.y = PRAIA.y; poeCanoa(); el(s, '#cc-vo-pe').setAttribute('transform', `translate(${P(158 + (can.x - PRAIA.x))} 474) scale(1.18)`); }); api.diz('Mais um pouco, até a água!'); } });
  function lancar(){
    fase = 'lancando'; ocupado = true; el(s, '#cc-mao').style.display = 'none'; el(s, '#cc-canoa-hint').style.display = 'none'; toca('clique');
    const x0 = can.x, y0 = can.y, vx0 = 158 + (can.x - PRAIA.x);
    tween(1400, e2 => { can.x = x0 + (LARGA.x - x0) * e2; can.y = y0 + (LARGA.y - y0) * e2; poeCanoa(); el(s, '#cc-vo-pe').setAttribute('transform', `translate(${P(vx0 + (LARGA.x - 120 - vx0) * Math.min(1, e2 * 1.2))} 474) scale(1.18)`); }, () => {
      toca('splash'); respinga(LARGA.x - 60, LARGA.y + 4, 5); respinga(LARGA.x + 40, LARGA.y + 4, 4);
      el(s, '#cc-vo-pe').style.display = 'none'; el(s, '#cc-vo-sent').style.display = ''; el(s, '#cc-canoa-sombra').setAttribute('fill', '#0E4A7A');
      el(s, '#cc-canoa-bob').style.animation = 'flutua 2.4s ease-in-out infinite alternate';
      fase = 'remar'; ocupado = false; api.hud('<span class="chip">Remadas: 0/4</span>');
      api.diz('A canoa caiçara é feita de um tronco só. Agora arraste o dedo na água para remar até o cerco!');
    });
  }
  /* remar: arrastar (ou tocar) na água */
  const ROTA = [[LARGA.x, LARGA.y, 1], [562, 446, .98], [578, 428, .96], [592, 412, .94], [ATRACA.x, ATRACA.y, ATRACA.k]];
  let golpe = null;
  function remaToque(e){ if (fase !== 'remar' || ocupado) return; const p = c.ponto(e); golpe = { x:p.x, y:p.y, feito:false }; s.setPointerCapture(e.pointerId); }
  el(s, '#cc-canoa').addEventListener('pointerdown', e => { if (fase === 'remar') { e.stopPropagation(); remaToque(e); } });
  s.addEventListener('pointermove', e => { if (!golpe || golpe.feito) return; const p = c.ponto(e); if (Math.hypot(p.x - golpe.x, p.y - golpe.y) > 40) { golpe.feito = true; rema(); } });
  s.addEventListener('pointerup', () => { if (!golpe) return; const g = golpe; golpe = null; if (!g.feito) rema(); });
  function rema(){
    if (fase !== 'remar' || ocupado) return; ocupado = true; remadas++;
    toca('splash'); el(s, '#cc-remo').animate([{ transform:'rotate(0)' }, { transform:'rotate(-22deg)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }], { duration:800 });
    el(s, '#cc-vo-sent').querySelectorAll('.cc-be, .cc-bd').forEach(b => b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-14deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:800 }));
    const [ax, ay, ak] = ROTA[remadas - 1], [bx, by, bk] = ROTA[remadas];
    el(s, '#cc-canoa-esteira').style.opacity = 1;
    respinga(can.x - 40 * can.k, can.y + 6, 3);
    tween(900, e2 => { can.x = ax + (bx - ax) * e2; can.y = ay + (by - ay) * e2; can.k = ak + (bk - ak) * e2; poeCanoa(); }, () => {
      el(s, '#cc-canoa-esteira').style.opacity = 0; ocupado = false;
      api.hud(`<span class="chip">Remadas: ${remadas}/4</span>`);
      if (remadas === 1) api.diz('Isso! Remando de leve, sem barulho de motor.');
      if (remadas === 2) api.diz('Lá na frente está o cerco, uma armadilha de rede presa no fundo do mar.');
      if (remadas === 4) chegaCerco();
    });
  }
  /* ================= FASE 2: o cerco ================= */
  function chegaCerco(){
    fase = 'puxar'; toca('ok'); el(s, '#cc-corda').style.display = ''; api.hud('<span class="chip">Rede: 0/3</span>');
    api.diz('O peixe entra no cerco e fica nadando lá dentro, vivo. Toque na corda para puxar a rede!');
  }
  let pegaCorda = null;
  el(s, '#cc-corda').addEventListener('pointerdown', e => { if (fase !== 'puxar') return; e.stopPropagation(); const p = c.ponto(e); pegaCorda = { y:p.y, feito:false }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!pegaCorda || pegaCorda.feito) return; const p = c.ponto(e); if (Math.abs(p.y - pegaCorda.y) > 24) { pegaCorda.feito = true; puxa(); } });
  s.addEventListener('pointerup', () => { if (!pegaCorda) return; const g = pegaCorda; pegaCorda = null; if (!g.feito) puxa(); });
  function puxa(){
    if (fase !== 'puxar' || ocupado) return; ocupado = true; puxadas++; toca('glub');
    el(s, '#cc-vo-sent').querySelectorAll('.cc-be, .cc-bd').forEach(b => b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(0)' }], { duration:700 }));
    el(s, '#cc-corda').animate([{ transform:'translateY(0)' }, { transform:'translateY(6px)' }, { transform:'translateY(0)' }], { duration:600 });
    respinga(CERCO.x + sorte(-80, 80), CERCO.y + sorte(-10, 20), 4); bolhas(CERCO.x, CERCO.y + 10, 6);
    const k = puxadas / 3;
    el(s, '#cc-cerco-raso').style.opacity = (k * .9).toFixed(2); el(s, '#cc-rede-sobe').style.opacity = k.toFixed(2); el(s, '#cc-sombras').style.opacity = (.55 * (1 - k)).toFixed(2);
    s.querySelectorAll('.cc-peixe').forEach(f => f.style.opacity = (Math.min(1, k * 1.2)).toFixed(2));
    depois(800, () => { ocupado = false; api.hud(`<span class="chip">Rede: ${puxadas}/3</span>`);
      if (puxadas === 1) api.diz('A rede vai subindo devagar...');
      if (puxadas === 3) comecaEscolha(); });
  }
  function comecaEscolha(){
    fase = 'escolher'; el(s, '#cc-corda').style.display = 'none';
    s.querySelectorAll('.cc-peixe').forEach(f => { f.style.opacity = 1; f.style.pointerEvents = ''; f.classList.add('toque'); f.style.cursor = 'grab'; });
    api.hud('<span class="chip">Escolhas: 0/8</span>');
    api.diz('No cerco o pescador escolhe! Leve só 3 peixes grandes para a canoa e arraste para fora do cerco os filhotes e a tartaruga.');
  }
  const pf = [...s.querySelectorAll('.cc-peixe')], ppos = PEIXES.map(p => ({ x:p.x, y:p.y, foi:false }));
  const poePeixe = i => pf[i].setAttribute('transform', `translate(${P(ppos[i].x)} ${P(ppos[i].y)})`);
  const foraCerco = (x, y) => Math.pow((x - CERCO.x) / CERCO.rx, 2) + Math.pow((y - CERCO.y) / CERCO.ry, 2) > 1.15;
  const naCanoa = (x, y) => Math.hypot(x - BALAIO.x, y - BALAIO.y) < 64 || (y > 360 && y < 420 && x > 510 && x < 690);
  const seleciona = i => { selec = i; pf.forEach((f, j) => el(f, '.cc-sel').style.display = j === i ? '' : 'none'); el(s, '#cc-canoa-hint').style.display = i >= 0 ? '' : 'none'; el(s, '#cc-solta').style.display = i >= 0 ? '' : 'none'; };
  let arrP = null;
  pf.forEach((f, i) => f.addEventListener('pointerdown', e => { if (fase !== 'escolher' || ppos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arrP = { i, dx:p.x - ppos[i].x, dy:p.y - ppos[i].y, x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); toca('clique'); }));
  s.addEventListener('pointermove', e => { if (!arrP) return; const p = c.ponto(e); if (Math.hypot(p.x - arrP.x0, p.y - arrP.y0) > 8) arrP.moveu = true;
    if (arrP.moveu) { ppos[arrP.i].x = Math.max(20, Math.min(780, p.x - arrP.dx)); ppos[arrP.i].y = Math.max(210, Math.min(480, p.y - arrP.dy)); poePeixe(arrP.i); } });
  s.addEventListener('pointerup', () => { if (!arrP) return; const { i, moveu } = arrP; arrP = null;
    if (!moveu) { seleciona(selec === i ? -1 : i); if (selec === i) api.diz(PEIXES[i].t === 'grande' ? 'Peixe grande! Toque na canoa para levar, ou no mar para soltar.' : 'Toque no mar, fora do cerco, para soltar.'); return; }
    const x = ppos[i].x, y = ppos[i].y;
    if (naCanoa(x, y)) leva(i); else if (foraCerco(x, y)) solta(i); else volta(i); });
  el(s, '#cc-canoa').addEventListener('click', e => { if (fase !== 'escolher' || selec < 0) return; e.stopPropagation(); const i = selec; seleciona(-1); leva(i); });
  el(s, '#cc-mar-hit').addEventListener('click', e => { if (fase !== 'escolher' || selec < 0) return; const p = c.ponto(e); if (!foraCerco(p.x, p.y) || naCanoa(p.x, p.y)) return; const i = selec; seleciona(-1); solta(i, p.x, p.y); });
  el(s, '#cc-cerco').addEventListener('click', e => { if (fase === 'escolher' && selec >= 0) { e.stopPropagation(); return; } if (fase === 'ler' || fase === 'lancando' || fase === 'remar') { e.stopPropagation(); toca('clique'); api.diz('É o cerco! O peixe entra pela porta e fica nadando lá dentro, sem se machucar.'); } });
  function anda(i, x1, y1, ms, fim){ const x0 = ppos[i].x, y0 = ppos[i].y; ocupado = true;
    tween(ms, e2 => { ppos[i].x = x0 + (x1 - x0) * e2; ppos[i].y = y0 + (y1 - y0) * e2 - Math.sin(e2 * PI) * 30; poePeixe(i); }, () => { ocupado = false; fim && fim(); }); }
  function volta(i, fala){ seleciona(-1); toca('glub'); anda(i, PEIXES[i].x, PEIXES[i].y, 600); if (fala) api.diz(fala); }
  const escolheu = () => { escolhas++; api.hud(`<span class="chip">Escolhas: ${escolhas}/8</span>`); if (escolhas === 8) depois(2400, voltaPraia); };
  function leva(i){ const t = PEIXES[i].t;
    if (t === 'filhote') return volta(i, 'Esse ainda é filhote! Solte no mar para ele crescer.');
    if (t === 'tartaruga') return volta(i, 'Tartaruga não se leva! Solte ela no mar.');
    if (guardados >= 3) return volta(i, 'Já temos peixe para o almoço. Este pode ficar no mar!');
    ppos[i].foi = true; guardados++;
    anda(i, BALAIO.x, BALAIO.y - 4, 700, () => { pf[i].style.display = 'none'; toca('pop'); c.brilhos(BALAIO.x, BALAIO.y - 16, 5, '#FFE27A');
      el(s, '#cc-balaio-peixes').insertAdjacentHTML('beforeend', `<g transform="translate(${-6 + guardados * 4} -2) rotate(${-60 + guardados * 30}) scale(.36)">${peixeG()}</g>`);
      api.diz(['Um peixe grande para o almoço da família.', 'Dois! O caiçara pesca só o que precisa.', 'Três! Já é o bastante para hoje.'][guardados - 1]); escolheu(); });
  }
  function solta(i, x, y){ const t = PEIXES[i].t; ppos[i].foi = true;
    const x1 = x || ppos[i].x, y1 = y || ppos[i].y, dx = x1 > CERCO.x ? 1 : -1;
    anda(i, x1, y1, x ? 600 : 10, () => { toca('splash'); respinga(ppos[i].x, ppos[i].y, 4); bolhas(ppos[i].x, ppos[i].y, 4);
      pf[i].animate([{ transform:`translate(${P(ppos[i].x)}px, ${P(ppos[i].y)}px)`, opacity:1 }, { transform:`translate(${P(ppos[i].x + dx * 70)}px, ${P(ppos[i].y + 30)}px)`, opacity:0 }], { duration:1400, fill:'forwards', easing:'ease-in' });
      api.diz(t === 'tartaruga' ? 'Tchau, tartaruga! O cerco não machuca, e ela volta a nadar livre.' : t === 'filhote' ? 'Isso! O filhote cresce e um dia vai ter seus próprios filhotes.' : guardados < 3 ? 'Pode soltar, mas ainda falta peixe para o almoço.' : 'Esse peixe fica no mar para outro dia. Muito bem!');
      escolheu(); });
  }
  function voltaPraia(){ depois(1200, () => { el(s, '#cc-cerco-raso').style.opacity = 0; el(s, '#cc-rede-sobe').style.opacity = 0; el(s, '#cc-sombras').style.opacity = .3; });
    fase = 'voltando'; seleciona(-1); toca('vitoria');
    api.diz('Peixe para o almoço, e o resto do mar continua cheio de vida. A canoa volta para a praia.');
    const x0 = can.x, y0 = can.y, k0 = can.k;
    depois(1800, () => tween(3200, e2 => { can.x = x0 + (PRAIA.x + 40 - x0) * e2; can.y = y0 + (PRAIA.y + 6 - y0) * e2; can.k = k0 + (1 - k0) * e2; poeCanoa(); }, () => {
      el(s, '#cc-canoa-bob').style.animation = ''; el(s, '#cc-canoa-sombra').setAttribute('fill', '#5A4420'); el(s, '#cc-remo').style.display = 'none'; comecaLixo(); }));
  }
  /* ================= FASE 3: da serra ao mar ================= */
  const lix = [...s.querySelectorAll('.cc-lixo')], lpos = LIXO.map(l => ({ x:l.x, y:l.y, foi:false }));
  const poeLixo = (i, k) => lix[i].setAttribute('transform', `translate(${P(lpos[i].x)} ${P(lpos[i].y)})${k ? ` scale(${k.toFixed(2)})` : ''}`);
  function comecaLixo(){
    fase = 'lixo'; lix.forEach(l => { l.style.display = ''; l.animate([{ opacity:0 }, { opacity:1 }], { duration:900 }); });
    el(s, '#cc-rio-turvo').style.opacity = .75; el(s, '#cc-saco-hint').style.display = '';
    api.hud('<span class="chip">Lixo: 0/5</span>');
    api.diz('A maré trouxe lixo para a praia e para a boca do rio. Arraste o lixo até o saco de reciclagem!');
  }
  let arrL = null;
  lix.forEach((g, i) => g.addEventListener('pointerdown', e => { if (fase !== 'lixo' || lpos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arrL = { i, dx:p.x - lpos[i].x, dy:p.y - lpos[i].y, x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); toca('clique'); }));
  s.addEventListener('pointermove', e => { if (!arrL) return; const p = c.ponto(e); if (Math.hypot(p.x - arrL.x0, p.y - arrL.y0) > 8) arrL.moveu = true;
    lpos[arrL.i].x = Math.max(20, Math.min(780, p.x - arrL.dx)); lpos[arrL.i].y = Math.max(220, Math.min(486, p.y - arrL.dy)); poeLixo(arrL.i); });
  s.addEventListener('pointerup', () => { if (!arrL) return; const { i, moveu } = arrL; arrL = null;
    if (!moveu || Math.hypot(lpos[i].x - SACO.x, lpos[i].y - SACO.y) < 70) guarda(i);
    else { const x0 = lpos[i].x, y0 = lpos[i].y; tween(500, e2 => { lpos[i].x = x0 + (LIXO[i].x - x0) * e2; lpos[i].y = y0 + (LIXO[i].y - y0) * e2; poeLixo(i); }); api.diz('Leve até o saco de reciclagem, perto da casa de farinha!'); } });
  function guarda(i){ lpos[i].foi = true; ocupado = true; const x0 = lpos[i].x, y0 = lpos[i].y;
    tween(800, e2 => { lpos[i].x = x0 + (SACO.x - x0) * e2; lpos[i].y = y0 + (SACO.y - 14 - y0) * e2 - Math.sin(e2 * PI) * 40; poeLixo(i, 1 - .6 * e2); }, () => {
      lix[i].style.display = 'none'; ocupado = false; lixos++; toca('pop'); c.brilhos(SACO.x, SACO.y - 20, 5, '#FFE27A');
      el(s, '#cc-saco').animate([{ transform:`translate(${SACO.x}px, ${SACO.y}px) scale(1)` }, { transform:`translate(${SACO.x}px, ${SACO.y}px) scale(1.08, .94)` }, { transform:`translate(${SACO.x}px, ${SACO.y}px) scale(1)` }], { duration:400 });
      api.hud(`<span class="chip">Lixo: ${lixos}/5</span>`);
      const falas = { rede:'Uma rede de pesca perdida. No mar ela prende toninhas e tartarugas!', garrafa:'Garrafa de plástico no mar dura centenas de anos.', sacola:'A tartaruga pode confundir sacola com comida.', lata:'A lata vai para a reciclagem e vira outra lata.', chinelo:'Até chinelo o mar traz! Tudo para o saco.' };
      if (lixos === 2) { el(s, '#cc-rio-turvo').style.opacity = .3; }
      if (lixos < 5) api.diz(falas[LIXO[i].id]);
      else { el(s, '#cc-rio-turvo').style.opacity = 0; el(s, '#cc-saco-hint').style.display = 'none'; toca('vitoria');
        el(s, '#cc-rio').setAttribute('stroke-width', '11'); for (let k = 0; k < 8; k++) c.add({ tipo:'brilho', t:-k * 3, x:200 + k * 13, y:206 + k * 11, cor:'#E6FAFF' });
        api.diz('Praia limpa! A água do rio nasce lá na serra, dentro da Mata Atlântica. A floresta protege a nascente e a água chega limpinha ao mar.');
        depois(6600, comecaFandango); }
    }); }
  /* fandango ao pôr do sol */
  function comecaFandango(){
    fase = 'fandango';
    el(s, '#cc-ceu-tarde').style.opacity = .9; el(s, '#cc-reflexo').style.opacity = 0; el(s, '#cc-mar-tarde').style.opacity = 1; el(s, '#cc-calor').style.opacity = .16; el(s, '#cc-nuvens-boas').style.opacity = .5;
    tween(4000, e2 => solPos(SOL0.x - 560 * e2, SOL0.y + 140 * e2 - 30 * Math.sin(e2 * PI)));
    el(s, '#cc-neta').style.display = 'none'; el(s, '#cc-vo-sent').style.display = 'none';
    const fd = el(s, '#cc-fandango'); fd.style.opacity = 1; fd.style.pointerEvents = '';
    api.hud('<span class="chip">Fandango: 0/6</span>');
    api.diz('No fim da tarde tem fandango caiçara, com viola, rabeca e o batido dos tamancos! Toque nos músicos para tocar.');
  }
  const FRASES = [[294, 370, 440], [494, 440, 370], [392, 440, 494, 440], [440, 370, 294], [330, 370, 392, 440], [494, 440, 370, 330, 294]];
  const batido = t0 => { if (!somOn) return; [0, .18, .27, .45].forEach(t => tom(140, t0 + t, .05, 'square', .05, 90)); };
  el(s, '#cc-fandango').addEventListener('click', e => { e.stopPropagation(); if (fase !== 'fandango' || ocupado) return; ocupado = true; notas++;
    const fr = FRASES[notas - 1];
    if (somOn) fr.forEach((f, j) => { tom(f, j * .22, .5, 'triangle', .09); tom(f * 2, j * .22, .3, 'sine', .025); });
    batido(0); batido(.5);
    el(s, '#cc-fandango-hint').style.display = 'none';
    s.querySelectorAll('.cc-danca-in').forEach((d, j) => d.animate([{ transform:'translateY(0)' }, { transform:'translateY(-7px) rotate(' + (j ? 4 : -4) + 'deg)' }, { transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:fr.length * 220 + 200 }));
    s.querySelectorAll('.cc-musico .cc-bd').forEach(b => b.animate([{ transform:'rotate(0)' }, { transform:'rotate(10deg)' }, { transform:'rotate(-6deg)' }, { transform:'rotate(0)' }], { duration:500, iterations:2 }));
    const nt = el(s, '#cc-notas'); nt.insertAdjacentHTML('beforeend', `<g transform="translate(${170 + notas * 34} 290)"><path d="M0 0 V-14 l8 -3 V-3" stroke="#FFF6D8" stroke-width="1.8" fill="none"/><ellipse cx="-2" cy="0" rx="3" ry="2.2" fill="#FFF6D8"/><ellipse cx="6" cy="-3" rx="3" ry="2.2" fill="#FFF6D8"/></g>`);
    const n = nt.lastElementChild; n.animate([{ transform:`translate(${170 + notas * 34}px, 290px)`, opacity:1 }, { transform:`translate(${180 + notas * 34}px, 240px)`, opacity:0 }], { duration:1800, fill:'forwards' });
    api.hud(`<span class="chip">Fandango: ${notas}/6</span>`);
    depois(fr.length * 220 + 300, () => { ocupado = false;
      if (notas === 2) api.diz('O fandango caiçara é música e dança que os mais velhos ensinam aos mais novos. Ele é patrimônio cultural do Brasil!');
      if (notas === 4) api.diz('Os tamancos batem na madeira e marcam o ritmo!');
      if (notas === 6) { toca('vitoria'); c.brilhos(290, 360, 10, '#FFE27A');
        api.diz('Os caiçaras vivem entre a serra e o mar. Cuidam da mata que guarda as nascentes e pescam só o que precisam. Assim sempre tem água limpa e peixe no mar!');
        depois(6400, api.fim); } });
  });
  /* ================= toques extras ================= */
  let tonOcup = false;
  el(s, '#cc-toninha').addEventListener('click', () => { if (tonOcup) return; tonOcup = true; toca('splash');
    const tp = el(s, '#cc-ton-pos'); const a = tp.animate([{ transform:'translate(0,0) rotate(0)' }, { transform:'translate(-20px,-38px) rotate(-14deg)' }, { transform:'translate(-44px,4px) rotate(12deg)' }, { transform:'translate(0,0) rotate(0)' }], { duration:1500, easing:'ease-in-out' });
    depois(1100, () => { respinga(420, 340, 5); bolhas(420, 345, 4); }); a.onfinish = () => { tonOcup = false; };
    api.diz(fase === 'ler' ? 'Eu sou a Nina, uma toninha! Sou um golfinho pequeno e tímido, e vivo perto da costa.' : fase === 'escolher' ? 'Algumas redes de pesca prendem toninhas. No cerco é diferente: os bichos ficam vivos e dá para soltar.' : 'As toninhas comem peixinhos e lulas. Mar limpo é bom para mim!'); });
  let atoOcup = false;
  el(s, '#cc-atoba').addEventListener('click', () => { if (atoOcup) return; atoOcup = true; toca('pop');
    const ap = el(s, '#cc-atoba-pos'); const a = ap.animate([{ transform:'translate(0,0)' }, { transform:'translate(20px,-60px)' }, { transform:'translate(46px,-70px)' }, { transform:'translate(54px,40px)' }, { transform:'translate(54px,40px)', opacity:0 }, { transform:'translate(0,0)', opacity:0 }, { transform:'translate(0,0)', opacity:1 }], { duration:3000, easing:'ease-in-out' });
    depois(1500, () => { toca('splash'); respinga(560, 276, 6); bolhas(560, 282, 5); }); a.onfinish = () => { atoOcup = false; };
    api.diz('O atobá-pardo mergulha de cabeça no mar, como uma flecha, para pegar peixe!'); });
  el(s, '#cc-guapuruvu').addEventListener('click', () => { toca('planta'); for (let i = 0; i < 16; i++) c.add({ tipo:'petala', x:sorte(112, 168), y:sorte(130, 152), vy:sorte(.5, 1), f:sorte(0, 6), chao:sorte(200, 260), cor:'#FFD43A', borda:'#B8860E' });
    api.diz('O guapuruvu fica coberto de flores amarelas. A madeira dele, leve, já foi muito usada para fazer canoas.'); });
  el(s, '#cc-canoa-fig').addEventListener('click', () => { toca('clique'); api.diz('Esta canoa foi cavada à mão num tronco inteiro. Hoje os mestres canoeiros usam árvores que já caíram ou que têm licença.'); });
  el(s, '#cc-cachoeira').addEventListener('click', e => { e.stopPropagation(); toca('splash'); respinga(199, 203, 5); for (let i = 0; i < 5; i++) c.add({ tipo:'infiltra', x0:200, y0:204, x1:300, y1:294, dur:sorte(70, 100), f:sorte(0, 6) });
    api.diz('Esta água nasce dentro da mata, lá no alto da serra, e desce até a vila. É água doce para beber e cozinhar!'); });
  let farOcup = false;
  el(s, '#cc-farinha').addEventListener('click', e => { e.stopPropagation(); if (farOcup) return; farOcup = true; toca('vapor');
    el(s, '#cc-rodo').animate([{ transform:'rotate(0)' }, { transform:'rotate(10deg)' }, { transform:'rotate(-8deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 });
    const fm = el(s, '#cc-fumaca'); fm.animate([{ opacity:.9, transform:'translateY(0)' }, { opacity:0, transform:'translateY(-30px)' }], { duration:1800 });
    depois(1800, () => { farOcup = false; });
    api.diz('Na casa de farinha, a vó torra a mandioca ralada no forno. Vira farinha para comer com o peixe!'); });
  el(s, '#cc-roca').addEventListener('click', e => { e.stopPropagation(); toca('planta'); el(s, '#cc-roca-pl').animate([{ transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:500 });
    api.diz('Na roça plantam mandioca. A comida dela fica guardada na raiz, debaixo da terra.'); });
  let siriOcup = false, siriX = 254;
  el(s, '#cc-siri').addEventListener('click', e => { e.stopPropagation(); if (siriOcup) return; siriOcup = true; toca('clique');
    const x0 = siriX, x1 = siriX > 245 ? 236 : 254, sp = el(s, '#cc-siri-pos');
    tween(700, (e2, k) => { siriX = x0 + (x1 - x0) * e2; sp.setAttribute('transform', `translate(${P(siriX)} ${P(488 + (x1 === 236 ? e2 * 4 : 4 - e2 * 4))})${x1 === 236 ? ` scale(${(1 - e2 * .9).toFixed(2)})` : ` scale(${(.1 + e2 * .9).toFixed(2)})`}`); }, () => { siriOcup = false; });
    api.diz(x1 === 236 ? 'A maria-farinha corre de lado e se esconde no buraco da areia!' : 'Olha ela de novo, espiando!'); });
  el(s, '#cc-neta').addEventListener('click', e => { if (fase === 'escolher' || fase === 'remar') return; e.stopPropagation(); toca('pop');
    el(s, '#cc-neta').querySelector('.cc-bd').animate([{ transform:'rotate(0)' }, { transform:'rotate(-150deg)' }, { transform:'rotate(-120deg)' }, { transform:'rotate(-150deg)' }, { transform:'rotate(0)' }], { duration:1200 });
    api.diz(fase === 'ler' ? 'Eu uso colete salva-vidas na canoa. O vô me ensina a ler o mar!' : 'Obrigada pela ajuda!'); });
  el(s, '#cc-vo-pe').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#cc-vo-pe').querySelector('.cc-cab').animate([{ transform:'rotate(0)' }, { transform:'rotate(-8deg)' }, { transform:'rotate(6deg)' }, { transform:'rotate(0)' }], { duration:900 });
    api.diz(dia < 2 ? 'O vô diz: vento sul traz mar bravo. Pescador sabido espera o mar acalmar.' : 'O vô diz: mar manso, vamos lá!'); });
  el(s, '#cc-varal').addEventListener('click', e => { e.stopPropagation(); toca('clique'); el(s, '#cc-varal').animate([{ transform:'translateY(0)' }, { transform:'translateY(-2px)' }, { transform:'translateY(0)' }], { duration:400 });
    api.diz('As redes secam no varal. Depois o pescador remenda os buracos com agulha e linha.'); });
  el(s, '#cc-galho').addEventListener('click', e => { e.stopPropagation(); toca('pop'); [880, 1100, 990, 1320].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sine', .05, f * 1.2), i * 140));
    el(s, '#cc-bromelia').animate([{ transform:'translate(104px, 22px) rotate(0)' }, { transform:'translate(104px, 22px) rotate(-8deg)' }, { transform:'translate(104px, 22px) rotate(6deg)' }, { transform:'translate(104px, 22px) rotate(0)' }], { duration:900 });
    api.diz('Uma bromélia no galho! A água da chuva fica guardada no meio das folhas dela.'); });
  el(s, '#cc-saco').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('É o saco da reciclagem da vila.'); });
  (function vida(t){ if (!vivo) return; requestAnimationFrame(vida); })(0);
  api.diz('Oi, eu sou a Nina, uma toninha! O vô e a neta querem pescar, mas olha o céu e o mar...');
  api.diz('Toque no sol para o dia passar e espere o mar acalmar!');
  api.hud('<span class="chip">Mar: bravo</span>');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
