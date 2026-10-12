/* ================= JOGO 19: Dujiangyan, o rio dividido ================= */
function jogoDujiang(palco, api){
  semente = 256;
  let vivo = true, fase = 'rocha', ocupado = false, camada = 0, quente = false, cheios = 0, estacao = 'normal', feitas = { cheia:false, seca:false }, interno = false, gargalo = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const f1 = n => n.toFixed(1);
  /* ---------- geometria dos rios (curvas de Bézier cúbicas) ---------- */
  const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const RIOS = {
    longe:[[[400, 150], [400, 170], [399, 190], [398, 206]]],
    perto:[[[398, 206], [398, 216], [398, 226], [400, 238]]],
    fora:[[[396, 238], [372, 290], [362, 340], [366, 392]], [[366, 392], [370, 440], [352, 475], [318, 520]]],
    dentro:[[[404, 238], [428, 290], [436, 340], [444, 382]], [[444, 382], [452, 414], [492, 424], [548, 420]]],
    garg:[[[548, 420], [575, 419], [605, 419], [646, 422]]],
    c1:[[[646, 422], [676, 410], [702, 384], [740, 366]], [[740, 366], [770, 352], [790, 346], [814, 342]]],
    c2:[[[646, 422], [694, 428], [742, 436], [814, 444]]],
    c3:[[[646, 422], [668, 444], [690, 472], [706, 514]]],
    verte:[[[444, 396], [428, 402], [410, 406], [384, 410]]]
  };
  const dDe = segs => segs.map((s, i) => (i ? '' : `M${s[0][0]} ${s[0][1]} `) + `C${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]} ${s[3][0]} ${s[3][1]}`).join(' ');
  const amostra = segs => { const pts = []; let L = 0; segs.forEach(s => { for (let i = pts.length ? 1 : 0; i <= 30; i++) { const t = i / 30, x = bz(s[0][0], s[1][0], s[2][0], s[3][0], t), y = bz(s[0][1], s[1][1], s[2][1], s[3][1], t); if (pts.length) L += Math.hypot(x - pts[pts.length - 1].x, y - pts[pts.length - 1].y); pts.push({ x, y, L }); } }); return pts; };
  const AM = {}; Object.keys(RIOS).forEach(k => AM[k] = amostra(RIOS[k]));
  const noPonto = (k, d) => { const a = AM[k]; let i = 1; while (i < a.length - 1 && a[i].L < d) i++; const p = a[i - 1], q = a[i], k2 = Math.max(0, Math.min(1, (d - p.L) / ((q.L - p.L) || 1))); const dx = q.x - p.x, dy = q.y - p.y, m = Math.hypot(dx, dy) || 1; return { x:p.x + dx * k2, y:p.y + dy * k2, tx:dx / m, ty:dy / m }; };
  const xEm = (k, y) => { const a = AM[k]; let m = a[0]; a.forEach(p => { if (Math.abs(p.y - y) < Math.abs(m.y - y)) m = p; }); return m.x; };
  const dPerto = (k, x, y) => { let m = AM[k][0]; AM[k].forEach(p => { if (Math.hypot(p.x - x, p.y - y) < Math.hypot(m.x - x, m.y - y)) m = p; }); return m.L; };
  /* largura de cada rio no começo e no fim (perspectiva: mais estreito lá longe) */
  const PERF = { longe:[5, 18], perto:[18, 34], fora:[36, 64], dentro:[22, 27], garg:[20, 22], c1:[11, 8], c2:[11, 9], c3:[11, 15], verte:[16, 16] };
  const larg = (k, d) => { const a = AM[k], u = Math.min(1, d / a[a.length - 1].L); return PERF[k][0] + (PERF[k][1] - PERF[k][0]) * u; };
  const LARG = {}; Object.keys(PERF).forEach(k => LARG[k] = (PERF[k][0] + PERF[k][1]) / 2);
  const fac = {}, prog = {}; Object.keys(RIOS).forEach(k => { fac[k] = 1; prog[k] = ['dentro', 'garg', 'c1', 'c2', 'c3'].includes(k) ? 0 : 1; });
  const poli = (k, f, pr, mais) => { const a = AM[k], Lt = a[a.length - 1].L, L = Lt * pr, E = [], D = [];
    if (pr <= .002) return 'M0 0Z';
    const poe = (x, y, tx, ty, l) => { const w = (larg(k, l) * f + (mais || 0)) / 2; E.push(`${f1(x - ty * w)} ${f1(y + tx * w)}`); D.push(`${f1(x + ty * w)} ${f1(y - tx * w)}`); };
    for (let i = 0; i < a.length; i++) { if (a[i].L > L) { const q = noPonto(k, L); poe(q.x, q.y, q.tx, q.ty, L); break; }
      const j0 = Math.max(0, i - 1), j1 = Math.min(a.length - 1, i + 1), dx = a[j1].x - a[j0].x, dy = a[j1].y - a[j0].y, m = Math.hypot(dx, dy) || 1; poe(a[i].x, a[i].y, dx / m, dy / m, a[i].L); }
    return 'M' + E.join(' L') + ' L' + D.reverse().join(' L') + 'Z'; };
  const bordaX = (k, y, lado) => { const a = AM[k]; let m = a[0]; a.forEach(q => { if (Math.abs(q.y - y) < Math.abs(m.y - y)) m = q; }); return m.x + lado * larg(k, m.L) / 2; };
  /* dique (Boca de Peixe): faixa entre a margem direita do rio de fora e a margem esquerda do rio de dentro */
  const borda = (y0, y1, ponta) => { const esq = [], dir = []; for (let y = y0; y <= y1 + .1; y += 6) { esq.push([bordaX('fora', y, 1) + 1, y]); dir.push([bordaX('dentro', y, -1) - 1, y]); }
    let d = ponta ? `M400 ${y0 - 14} C${f1(esq[0][0] - 1)} ${y0 - 8} ${f1(esq[0][0])} ${y0 - 2} ${f1(esq[0][0])} ${y0}` : `M${f1(esq[0][0])} ${y0}`;
    esq.slice(1).forEach(p => d += ` L${f1(p[0])} ${p[1]}`); dir.reverse().forEach(p => d += ` L${f1(p[0])} ${p[1]}`);
    return d + (ponta ? ` C${f1(dir[dir.length - 1][0])} ${y0 - 2} ${f1(dir[dir.length - 1][0] - 1)} ${y0 - 8} 400 ${y0 - 14}Z` : 'Z'); };
  const DIQUE = [borda(232, 284, true), borda(284, 340), borda(340, 394)];
  const textoDique = (y0, y1, i) => { let s2 = ''; for (let y = y0 - 10; y <= y1 + 2; y += 6) { const xa = bordaX('fora', y, 1), xb = bordaX('dentro', y, -1); for (let x = xa + 2; x < xb - 1; x += 6.4) { const r = R(2.4, 3.6); s2 += `<ellipse cx="${f1(x + R(-1, 1))}" cy="${f1(y + R(-1, 1))}" rx="${f1(r)}" ry="${f1(r * .76)}" fill="${['#A8B2C0', '#C8BCA4', '#8E98A8', '#B8A88C', '#D6CCB8'][Math.floor(R(0, 4.99))]}" stroke="#5E5A52" stroke-width=".6"/>`; } }
    let l = ''; for (let k = -5; k < 9; k++) { const x = 356 + k * 13; l += `M${x} ${y0 - 16} l26 ${y1 - y0 + 30} M${x + 26} ${y0 - 16} l-26 ${y1 - y0 + 30} `; }
    let h = ''; for (let y = y0 - 6; y < y1 + 6; y += 17) h += `M360 ${y} H460 `;
    return `<clipPath id="duSegC${i}"><path d="${DIQUE[i]}"/></clipPath><g clip-path="url(#duSegC${i})"><path d="${DIQUE[i]}" fill="#5A4630"/>${s2}<path d="${l}" stroke="#5E3E18" stroke-width="2.2" fill="none" opacity=".75"/><path d="${l}" stroke="#E2C080" stroke-width="1.1" fill="none" opacity=".9"/><path d="${h}" stroke="#5E3E18" stroke-width="3" fill="none"/><path d="${h}" stroke="#EED39A" stroke-width="1.6" fill="none"/><path d="${DIQUE[i]}" fill="url(#duMolhado)"/></g>`; };
  const brilhoBorda = (y0, y1, k, lado, dx) => { let d = ''; for (let y = y0; y <= y1; y += 6) d += `${d ? 'L' : 'M'}${f1(bordaX(k, y, lado) + dx)} ${y} `; return d; };
  const VAGA = [{ x:401, y:258, a:84 }, { x:404, y:312, a:80 }, { x:410, y:367, a:76 }];
  const CESTOS = [{ x:440, y:452 }, { x:514, y:458 }, { x:470, y:486 }];
  const PEDRAS = [{ x:200, y:452, r:12, c:'#9AA6B8' }, { x:236, y:444, r:11, c:'#C2B49C' }, { x:270, y:456, r:12.5, c:'#8E9AAE' }, { x:214, y:480, r:12, c:'#B0A28A' }, { x:250, y:478, r:11.5, c:'#A4AEBC' }, { x:286, y:480, r:11, c:'#C9BBA0' }];
  const CAMADAS = [
    'M556 356 C566 346 584 342 600 343 C618 344 632 348 640 356 L640 384 C614 381 580 382 556 385Z',
    'M556 385 C580 382 614 381 640 384 L640 411 C612 409 580 410 556 412Z',
    'M556 412 C580 410 612 409 640 411 L640 438 C612 436 580 437 556 439Z'
  ];
  const CENTRO = [{ x:598, y:366 }, { x:598, y:397 }, { x:598, y:424 }];
  /* ---------- pequenos desenhos ---------- */
  const arvore = (x, y, s, cor, esc, luz, tronco) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-1 -10 1 -18 0 -26" stroke="${tronco || '#6E4A2E'}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="${copa(0, -34, 17, 14, 9, .26)}" fill="${cor}" stroke="${esc}" stroke-width="1.6"/><path d="${copa(-4, -38, 9, 7, 7, .3)}" fill="${luz}" opacity=".7"/></g>`;
  const cipreste = (x, y, s, cor, esc) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-8" stroke="#5A3E26" stroke-width="3"/><path d="M0 -50 C6 -36 10 -20 8 -8 C4 -4 -4 -4 -8 -8 C-10 -20 -6 -36 0 -50Z" fill="${cor}" stroke="${esc}" stroke-width="1.4"/><path d="M-2 -40 C-4 -30 -5 -20 -4 -12" stroke="#fff" stroke-width="1.4" fill="none" opacity=".25" stroke-linecap="round"/></g>`;
  const pessoa = (x, y, pele, cabelo, camisa, calca, s, atras, frente, contorno) => { const e = contorno || '#5A3420';
    return `<g transform="translate(${x} ${y}) scale(${s || 1})">
    <ellipse cx="0" cy="1" rx="13" ry="3" fill="#1E2A14" opacity=".28"/>
    ${atras || ''}
    <path d="M-6.4 -17 L-6 -1 H-1 L0 -12 L1 -1 H6 L6.4 -17Z" fill="${calca}" stroke="#1E2440" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-3.8 -10 l.6 6 M3.8 -10 l-.6 6" stroke="#fff" stroke-width=".8" opacity=".25"/>
    <path d="M-7.6 -.4 C-7.6 -2.6 -1 -2.6 -.6 -.4Z M.6 -.4 C1 -2.6 7.6 -2.6 7.6 -.4Z" fill="#3A2A1E" stroke="#1E140C" stroke-width=".8"/>
    <path d="M-8.4 -16 C-9.4 -26 -7 -33 0 -33.6 C7 -33 9.4 -26 8.4 -16 C4 -14.6 -4 -14.6 -8.4 -16Z" fill="${camisa}" stroke="#1E2440" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M-8.6 -18.6 C-3 -17 3 -17 8.6 -18.6" stroke="#3A2A1E" stroke-width="2" fill="none"/>
    <path d="M-3 -33 L0 -29 L3 -33" stroke="#fff" stroke-width="1.1" fill="none" opacity=".6" stroke-linejoin="round"/>
    <path d="M-5 -27 q1.4 4 .4 8 M4.6 -26 q-1.6 3 -.6 6.4" stroke="#1E2440" stroke-width=".8" fill="none" opacity=".35"/>
    <path d="M-6 -31 C-7 -27 -7.4 -23 -7 -19" stroke="#fff" stroke-width="1.4" fill="none" opacity=".3" stroke-linecap="round"/>
    <path d="M-2.2 -33.6 V-36 H2.2 V-33.6Z" fill="${pele}"/>
    <ellipse cx="-7.4" cy="-41" rx="1.8" ry="2.4" fill="${pele}" stroke="${e}" stroke-width=".8"/><ellipse cx="7.4" cy="-41" rx="1.8" ry="2.4" fill="${pele}" stroke="${e}" stroke-width=".8"/>
    <ellipse cx="0" cy="-41.4" rx="7.4" ry="7.8" fill="${pele}" stroke="${e}" stroke-width="1.1"/>
    <path d="M-7.8 -41 C-8.6 -50.6 8.6 -51.6 7.8 -41.6 C6.6 -45 3 -46.4 -.6 -45.6 C-3.6 -45 -6 -43.6 -7.8 -41Z" fill="${cabelo}" stroke="#0E0A08" stroke-width=".6"/>
    <path d="M-3.4 -48 q3 -1.6 6 -.6" stroke="#fff" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"/>
    <path d="M-5 -43.8 q1.6 -1.2 3 0 M2 -43.8 q1.6 -1.2 3 0" stroke="#2A1A10" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <ellipse cx="-3.2" cy="-41" rx="1.2" ry="1.5" fill="#1A1210"/><ellipse cx="3.4" cy="-41" rx="1.2" ry="1.5" fill="#1A1210"/><circle cx="-2.8" cy="-41.6" r=".45" fill="#fff"/><circle cx="3.8" cy="-41.6" r=".45" fill="#fff"/>
    <path d="M.2 -40 q.8 1.6 -.4 2" stroke="${e}" stroke-width=".7" fill="none" stroke-linecap="round"/>
    <path d="M-2.4 -36.6 q2.4 2 4.8 0" stroke="#7A2E1E" stroke-width=".9" fill="#FFF" stroke-linecap="round"/>
    <ellipse cx="-5" cy="-37.8" rx="1.6" ry=".9" fill="#FF8A7A" opacity=".45"/><ellipse cx="5.2" cy="-37.8" rx="1.6" ry=".9" fill="#FF8A7A" opacity=".45"/>
    ${frente || ''}</g>`; };
  const pinho = (x, y, s, cor, esc) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-12" stroke="#5A3E26" stroke-width="3.2" stroke-linecap="round"/>${[0, 1, 2, 3].map(k => { const yy = -7 - k * 8.6, w = 15 - k * 3.2; return `<path d="M${-w} ${yy} C${-w * .5} ${yy - 4} ${-w * .3} ${yy - 11} 0 ${yy - 13} C${w * .3} ${yy - 11} ${w * .5} ${yy - 4} ${w} ${yy} C${w * .4} ${yy - 2.6} ${-w * .4} ${yy - 2.6} ${-w} ${yy}Z" fill="${cor}" stroke="${esc}" stroke-width="1.1" stroke-linejoin="round"/><path d="M${-w * .6} ${yy - 2} C${-w * .3} ${yy - 5} ${-w * .2} ${yy - 8} 0 ${yy - 10}" stroke="#fff" stroke-width="1" fill="none" opacity=".25"/>`; }).join('')}</g>`;
  const ARV = (x, y, tipo, s, cor, esc, luz) => tipo === 'p' ? pinho(x, y, s, cor, esc) : tipo === 'c' ? cipreste(x, y + 2, s * 1.1, cor, esc)
    : tipo === 'b' ? `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-14" stroke="#6E4A2E" stroke-width="3"/><path d="${copa(-8, -22, 12, 9, 8, .3)}" fill="${cor}" stroke="${esc}" stroke-width="1.2"/><path d="${copa(8, -26, 13, 10, 8, .3)}" fill="${cor}" stroke="${esc}" stroke-width="1.2"/><path d="${copa(0, -34, 11, 8, 8, .3)}" fill="${luz}" stroke="${esc}" stroke-width="1.2"/></g>`
    : tipo === 'm' ? `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-1 -8 1 -14 0 -20 M0 -12 l-6 -6 M0 -14 l6 -7" stroke="#5A3420" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[[-8, -24, 9], [7, -27, 10], [0, -34, 9]].map(([dx, dy, r]) => `<path d="${copa(dx, dy, r, r * .78, 9, .34)}" fill="${cor}" stroke="${esc}" stroke-width="1.1"/>`).join('')}<path d="${copa(-2, -32, 5, 3.4, 6, .3)}" fill="${luz}" opacity=".7"/></g>`
    : `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-1 -8 1 -14 0 -22" stroke="#6E4A2E" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="${copa(0, -28, 15, 12, 10, .26)}" fill="${cor}" stroke="${esc}" stroke-width="1.3"/><path d="${copa(-4, -32, 8, 5.6, 7, .3)}" fill="${luz}" opacity=".55"/></g>`;
  const serra = (y0, pts) => { let d = `M-10 ${y0} L${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; d += ` C${f1(x1 + (x2 - x1) * .42)} ${y1} ${f1(x2 - (x2 - x1) * .42)} ${y2} ${x2} ${y2}`; } return d + ` L810 ${y0}Z`; };
  const casa = (x, y, s, i) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="1" rx="28" ry="3.4" fill="#2E4A14" opacity=".24"/>
    <path d="M-20 0 V-19 H20 V0Z" fill="url(#duParede)" stroke="#6E5A44" stroke-width="1.2"/>
    <path d="M-20 -19 H20 M-20 -9.6 H20 M-9 -19 V0 M9 -19 V0 M-20 -19 V0 M20 -19 V0" stroke="#6E4428" stroke-width="1.8" opacity=".9"/>
    <rect x="-4.4" y="-9.6" width="8.8" height="9.6" fill="url(#duMadeira)" stroke="#3E2414" stroke-width=".9"/><path d="M0 -9.6 V0" stroke="#3E2414" stroke-width=".7"/>
    <rect x="-16.4" y="-16.4" width="6" height="5" fill="${i % 2 ? '#FFE6A8' : '#BFE0F2'}" stroke="#3E2414" stroke-width=".8"/><path d="M-13.4 -16.4 V-11.4 M-16.4 -13.9 H-10.4" stroke="#3E2414" stroke-width=".5"/>
    <rect x="10.4" y="-16.4" width="6" height="5" fill="#BFE0F2" stroke="#3E2414" stroke-width=".8"/><path d="M13.4 -16.4 V-11.4 M10.4 -13.9 H16.4" stroke="#3E2414" stroke-width=".5"/>
    ${i === 1 ? '<path d="M-24 -4 h-6 v4 h6" fill="#C8401E" opacity=".0"/><g fill="#E5392C" stroke="#8A1A10" stroke-width=".6"><ellipse cx="-14" cy="-6" rx="1.6" ry="2.2"/><ellipse cx="14" cy="-6" rx="1.6" ry="2.2"/></g>' : ''}
    <path d="M-30 -16 Q-25 -17.4 -22 -20.6 L-18 -28.6 H18 L22 -20.6 Q25 -17.4 30 -16 Q22 -18.6 0 -18.6 Q-22 -18.6 -30 -16Z" fill="url(#duTelha)" stroke="#262C38" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="${Array.from({ length:11 }, (_, j) => `M${-16 + j * 3.2} -28 L${-19.4 + j * 3.9} -19`).join(' ')}" stroke="#8E98A8" stroke-width=".8" opacity=".85"/>
    <path d="M-20 -29 H20" stroke="#323846" stroke-width="2.6" stroke-linecap="round"/><path d="M-20 -29 q-3 0 -5 -3.4 M20 -29 q3 0 5 -3.4" stroke="#323846" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-28 -16.4 Q-22 -18 -18 -18" stroke="#A8B0BE" stroke-width="1" fill="none" opacity=".8"/></g>`;
  const colza = (x, y, w, h, n) => { let s2 = `<path d="M${x + 6} ${y} H${x + w - 6} L${x + w + 4} ${y + h} H${x - 4}Z" fill="#7CB24A" stroke="#4E8A2E" stroke-width="1"/>`;
    for (let k = 0; k < n; k++) { const y0 = y + 2 + k * h / n, y1 = y0 + h / n - 2.4, a = (y0 - y) / h * 10 - 6, b = (y1 - y) / h * 10 - 6;
      s2 += `<path d="M${f1(x + 6 - a)} ${f1(y0)} H${f1(x + w - 6 + a)} L${f1(x + w - 6 + b)} ${f1(y1)} H${f1(x + 6 - b)}Z" fill="url(#duColza)" stroke="#D8A20E" stroke-width=".6"/><path d="M${f1(x + 8 - a)} ${f1(y0 + 1)} H${f1(x + w - 8 + a)}" stroke="#FFF6B0" stroke-width="1" stroke-dasharray="2 3" opacity=".9"/>`; }
    return s2; };
  const cesto = (x, y, i) => `<g class="du-cesto" data-i="${i}"><g transform="translate(${x} ${y}) scale(.8) translate(${-x} ${-y})"><g class="du-cesto-in" style="transform-origin:${x}px ${y}px">
    <ellipse cx="${x}" cy="${y + 15}" rx="40" ry="5" fill="#1E2A14" opacity=".25"/>
    <path d="M${x - 34} ${y - 12} H${x + 30} C${x + 40} ${y - 12} ${x + 40} ${y + 12} ${x + 30} ${y + 12} H${x - 34} C${x - 42} ${y + 12} ${x - 42} ${y - 12} ${x - 34} ${y - 12}Z" fill="#3A2C1E"/>
    <g class="du-cesto-pedras">${[0, 1].map(j => `<g class="du-cp" style="opacity:0;transition:opacity .4s">${[[-24, 0, 8, '#9AA6B8'], [-10, 4, 7.4, '#C2B49C'], [-16, -6, 6.4, '#8E9AAE'], [-2, -3, 7, '#B0A28A']].map(([dx, dy, r, c]) => `<ellipse cx="${x + dx + j * 26}" cy="${y + dy}" rx="${r}" ry="${(r * .8).toFixed(1)}" fill="${c}" stroke="#4E525E" stroke-width="1"/>`).join('')}</g>`).join('')}</g>
    <g stroke="#5E3E18" stroke-width="3.6" fill="none">${[-30, -18, -6, 6, 18].map(dx => `<path d="M${x + dx} ${y - 12} l12 24 M${x + dx + 12} ${y - 12} l-12 24"/>`).join('')}<path d="M${x - 38} ${y} H${x + 34}"/></g>
    <g stroke="url(#duTira)" stroke-width="2.2" fill="none">${[-30, -18, -6, 6, 18].map(dx => `<path d="M${x + dx} ${y - 12} l12 24 M${x + dx + 12} ${y - 12} l-12 24"/>`).join('')}<path d="M${x - 38} ${y} H${x + 34}"/></g>
    <path d="M${x - 34} ${y - 12} H${x + 30} C${x + 40} ${y - 12} ${x + 40} ${y + 12} ${x + 30} ${y + 12} H${x - 34} C${x - 42} ${y + 12} ${x - 42} ${y - 12} ${x - 34} ${y - 12}Z" fill="none" stroke="#4A2E10" stroke-width="2"/>
    <ellipse cx="${x + 30}" cy="${y}" rx="6" ry="12" fill="#2A1E12" stroke="#D8B070" stroke-width="2"/>
    <path d="M${x - 32} ${y - 9} H${x + 26}" stroke="#FFF2C8" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    <g class="du-cesto-hint" style="display:none">${brilhoHotspot(x - 6, y - 22)}</g></g><rect x="${x - 46}" y="${y - 24}" width="88" height="48" fill="transparent"/></g></g>`;
  const chama = (x, y) => `<g transform="translate(${x} ${y})"><g class="du-fogo-in"><path d="M-16 0 C-20 -12 -10 -18 -12 -30 C-4 -24 0 -30 -2 -42 C8 -32 14 -24 10 -12 C16 -16 18 -22 16 -28 C24 -18 22 -4 14 0Z" fill="#FF8A2A" stroke="#C8401E" stroke-width="1.6" stroke-linejoin="round"/><path d="M-8 0 C-10 -8 -4 -12 -4 -20 C2 -14 6 -10 4 -4 C8 -6 9 -10 8 -14 C12 -8 10 -2 6 0Z" fill="#FFE27A"/></g></g>`;
  /* rio em camadas: margem, água, faixa clara, lama (cheia) e brilho correndo */
  const ondas = (k, fase2) => { if (LARG[k] < 10) return ''; const a = AM[k], Lt = a[a.length - 1].L, passo = k === 'garg' ? 7 : 15; let d = '';
    for (let l = (fase2 ? passo / 2 : 0) + 6; l < Lt - 4; l += passo) { const q = noPonto(k, l), w = larg(k, l), o = (((l * 7.3) % 1.2) - .6) * w * .5, cx = q.x - q.ty * o, cy = q.y + q.tx * o, m = w * (k === 'garg' ? .32 : .16);
      d += `M${f1(cx - q.tx * 3 - q.ty * m)} ${f1(cy - q.ty * 3 + q.tx * m)} Q${f1(cx + q.tx * 2)} ${f1(cy + q.ty * 2)} ${f1(cx - q.tx * 3 + q.ty * m)} ${f1(cy - q.ty * 3 - q.tx * m)} `; }
    return `<path class="du-onda${fase2 ? '2' : ''}" d="${d}" stroke="#E6F7FF" stroke-width="${k === 'garg' ? 2 : 1.3}" fill="none" stroke-linecap="round"/>`; };
  const rio = (k) => `<g class="du-rio" data-k="${k}"><path class="du-agua" d="${poli(k, 1, prog[k])}" fill="url(#duAgua)" stroke="#245E96" stroke-width="1.3" stroke-linejoin="round"/>
      <path class="du-funda" d="${poli(k, .58, prog[k])}" fill="#22649E" opacity=".42"/>
      <path class="du-clara" d="${poli(k, .2, prog[k])}" fill="#BFE8FF" opacity=".28"/>
      <path class="du-lama" d="${poli(k, 1, prog[k])}" fill="#A8865A" style="opacity:0;transition:opacity 2s"/>
      <path class="du-espuma" d="${poli(k, 1, prog[k])}" fill="none" stroke="#F6FCFF" stroke-width="${LARG[k] > 12 ? 2 : 1.2}" stroke-dasharray="3 4 8 4" opacity=".8"/>
      <g class="du-ondas" style="opacity:${prog[k] ? 1 : 0};transition:opacity 1s">${ondas(k)}${ondas(k, true)}</g>
      <path class="du-corre" d="${dDe(RIOS[k])}" stroke="#F2FBFF" stroke-width="${Math.max(1.2, LARG[k] * .07).toFixed(1)}" fill="none" stroke-linecap="round" stroke-dasharray="6 ${(14 + LARG[k] * .5).toFixed(0)}" style="opacity:${prog[k] ? .75 : 0};transition:opacity 1s"/>
      ${LARG[k] > 14 ? `<path class="du-corre" d="${dDe(RIOS[k])}" transform="translate(${(LARG[k] * .22).toFixed(1)} 0)" stroke="#D8F2FF" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-dasharray="4 ${(20 + LARG[k] * .6).toFixed(0)}" style="opacity:${prog[k] ? .6 : 0};transition:opacity 1s"/>` : ''}</g>`;
  const margem = (k, mais) => `<path class="du-margem" d="${poli(k, 1.32, 1, mais || 10)}" fill="url(#duCascalho)" stroke="#8C7650" stroke-width="1.4" stroke-linejoin="round"/><path d="${poli(k, 1.32, 1, mais || 10)}" fill="url(#duSeixo)" opacity=".7"/>`;
  /* arrozais da planície de Chengdu */
  const LIN = [306, 326, 350, 380, 416, 458, 506];
  let arrozais = '', nArroz = 0;
  LIN.slice(0, -1).forEach((y0, r) => { const y1 = LIN[r + 1] - 3, w = 34 + r * 9, inc = .16; let x = 662 + (r % 2) * w * .45 - (r > 3 ? 14 : 0) + (y0 > 430 ? 10 : 0);
    if (x > 662) { const x0 = 656; arrozais += `<path d="M${x0 + (y1 - y0) * inc} ${y0} H${x - 3 + (y1 - y0) * inc} L${x - 3} ${y1} H${x0}Z" fill="#B49A66" stroke="#7E6A40" stroke-width="1"/>`; }
    while (x < 812) { const xa = x, xb = x + w - 3, dx = (y1 - y0) * inc, cor = ['#7CCB5A', '#9ED86A', '#62B85A', '#B4DE6E'][(r + nArroz) % 4];
      arrozais += `<g class="du-arroz"><path d="M${xa + dx} ${y0} H${xb + dx} L${xb} ${y1} H${xa}Z" fill="url(#duTerraArroz)" stroke="#7E6A40" stroke-width="1"/>
        <path class="du-arroz-agua" d="M${xa + dx + 1.5} ${y0 + 1.5} H${xb + dx - 1.5} L${xb - 1.5} ${y1 - 1.5} H${xa + 1.5}Z" fill="url(#duEspelho)" style="opacity:0;transition:opacity 1s"/>
        <g class="du-arroz-verde" style="opacity:0;transition:opacity 1.2s"><path d="M${xa + dx + 1.5} ${y0 + 1.5} H${xb + dx - 1.5} L${xb - 1.5} ${y1 - 1.5} H${xa + 1.5}Z" fill="${cor}" opacity=".88"/>
        <path d="${Array.from({ length:Math.max(2, Math.round((y1 - y0) / 6)) }, (_, j) => { const yy = y0 + 4 + j * 6; return yy < y1 - 2 ? `M${f1(xa + 4 + (y1 - yy) * inc)} ${yy} H${f1(xb - 4 + (y1 - yy) * inc)}` : ''; }).join(' ')}" stroke="#3E8A2A" stroke-width="${(1 + r * .3).toFixed(1)}" stroke-dasharray="${(1.6 + r * .4).toFixed(1)} ${(2.4 + r * .5).toFixed(1)}" fill="none"/></g></g>`;
      x += w; nArroz++; } });
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Vale do rio Min, na China, com montanhas, a Boca de Peixe dividindo o rio, o Gargalo do Jarro aberto na rocha, arrozais da planície de Chengdu, uma vila e uma panda-gigante">
    <defs>
      <linearGradient id="duCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB4E6"/><stop offset=".55" stop-color="#BFE0F2"/><stop offset="1" stop-color="#F8EEDA"/></linearGradient>
      <linearGradient id="duM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AEBCDA"/><stop offset="1" stop-color="#DCE4EE"/></linearGradient>
      <linearGradient id="duM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EA6B8"/><stop offset="1" stop-color="#B6CCD2"/></linearGradient>
      <linearGradient id="duM3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E8E6E"/><stop offset="1" stop-color="#6EA474"/></linearGradient>
      <linearGradient id="duM4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A9A6A"/><stop offset="1" stop-color="#86B66C"/></linearGradient>
      <linearGradient id="duNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="duChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B6D486"/><stop offset=".5" stop-color="#94C266"/><stop offset="1" stop-color="#6EA64E"/></linearGradient>
      <linearGradient id="duPlan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4DE9A"/><stop offset="1" stop-color="#A9C874"/></linearGradient>
      <linearGradient id="duRocha" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C4B8A2"/><stop offset=".55" stop-color="#9A8C76"/><stop offset="1" stop-color="#6E6252"/></linearGradient>
      <linearGradient id="duRochaE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A7E6C"/><stop offset="1" stop-color="#564C40"/></linearGradient>
      <linearGradient id="duBloco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8A88E"/><stop offset="1" stop-color="#857660"/></linearGradient>
      <radialGradient id="duQuente" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#FFE08A"/><stop offset=".5" stop-color="#FF8A3A"/><stop offset="1" stop-color="#B8401E"/></radialGradient>
      <linearGradient id="duMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6AA866"/><stop offset="1" stop-color="#4A8452"/></linearGradient>
      <linearGradient id="duDique" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C89A5A"/><stop offset=".5" stop-color="#E8C88A"/><stop offset="1" stop-color="#B08048"/></linearGradient>
      <linearGradient id="duTira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D89A"/><stop offset="1" stop-color="#C89A52"/></linearGradient>
      <pattern id="duTrama" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 0 L12 12 M12 0 L0 12" stroke="#7A5226" stroke-width="1.4" opacity=".55"/><circle cx="6" cy="2" r="2.4" fill="#9AA4B4" opacity=".55"/><circle cx="1" cy="8" r="2" fill="#A89A88" opacity=".5"/></pattern>
      <linearGradient id="duParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBF0"/><stop offset="1" stop-color="#E6D8BE"/></linearGradient>
      <linearGradient id="duTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76808E"/><stop offset="1" stop-color="#4A5262"/></linearGradient>
      <linearGradient id="duMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8744A"/><stop offset="1" stop-color="#6A4022"/></linearGradient>
      <linearGradient id="duTerraArroz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8B07A"/><stop offset="1" stop-color="#A88C58"/></linearGradient>
      <linearGradient id="duEspelho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D6F0FF"/><stop offset=".5" stop-color="#8CCBF0"/><stop offset="1" stop-color="#5AA6DA"/></linearGradient>
      <linearGradient id="duCascalho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2D6B2"/><stop offset="1" stop-color="#C2AC80"/></linearGradient>
      <pattern id="duSeixo" width="22" height="16" patternUnits="userSpaceOnUse"><ellipse cx="4" cy="4" rx="2.6" ry="1.6" fill="#A8946A"/><ellipse cx="15" cy="9" rx="2" ry="1.3" fill="#9AA4B4"/><ellipse cx="8" cy="13" rx="1.6" ry="1" fill="#B8A47A"/><ellipse cx="19" cy="2" rx="1.4" ry="1" fill="#F4ECD8"/></pattern>
      <linearGradient id="duAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CD2F2"/><stop offset=".45" stop-color="#4FA6DE"/><stop offset="1" stop-color="#3486C8"/></linearGradient>
      <linearGradient id="duSerraA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9EB4CC"/><stop offset="1" stop-color="#D2DEE6"/></linearGradient>
      <linearGradient id="duSerraB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EA4A4"/><stop offset="1" stop-color="#B4CCC0"/></linearGradient>
      <linearGradient id="duEstrato" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C2B294"/><stop offset=".5" stop-color="#A8987C"/><stop offset="1" stop-color="#8A7C66"/></linearGradient>
      <linearGradient id="duBruma" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".75"/><stop offset=".7" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="duMolhado" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1E3A5A" stop-opacity=".35"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".18"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1E3A5A" stop-opacity=".3"/></linearGradient>
      <linearGradient id="duMorro2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8CC060"/><stop offset=".6" stop-color="#5E9A4A"/><stop offset="1" stop-color="#3E7A3E"/></linearGradient>
      <linearGradient id="duBambuC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8C88A"/><stop offset="1" stop-color="#B08048"/></linearGradient>
      <linearGradient id="duFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A89A84"/><stop offset=".7" stop-color="#7A6E5E"/><stop offset="1" stop-color="#5A5044"/></linearGradient>
      <linearGradient id="duTopo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC46E"/><stop offset="1" stop-color="#5E9A54"/></linearGradient>
      <linearGradient id="duColza" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE45A"/><stop offset="1" stop-color="#F2C21E"/></linearGradient>
      <radialGradient id="duSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <linearGradient id="duFaisao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD84A"/><stop offset="1" stop-color="#F09A1E"/></linearGradient>
      <linearGradient id="duBufalo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E6670"/><stop offset="1" stop-color="#3E3842"/></linearGradient>
      <radialGradient id="duVinheta" cx=".5" cy=".46" r=".78"><stop offset=".62" stop-color="#16263A" stop-opacity="0"/><stop offset="1" stop-color="#16263A" stop-opacity=".32"/></radialGradient>
      <filter id="duGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
      <filter id="duSombra" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#1E2A14" flood-opacity=".35"/></filter>
    </defs>
    <rect width="800" height="300" fill="url(#duCeu)"/>
    <g id="du-sol" class="toque" style="transform-origin:700px 62px"><circle id="du-sol-aura" cx="700" cy="62" r="56" fill="#FFE27A" opacity=".22"/><circle cx="700" cy="62" r="40" fill="#FFE27A" opacity=".28"/><circle cx="700" cy="62" r="27" fill="url(#duSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M686 52 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><g id="du-sol-hint" style="display:none">${brilhoHotspot(728, 40)}</g><circle cx="700" cy="62" r="52" fill="transparent"/></g>
    <g class="deriva" style="animation-duration:40s"><use href="#nuvem" x="470" y="26" width="84" height="40" style="color:#fff" opacity=".9"/><use href="#nuvem" x="96" y="44" width="60" height="28" style="color:#fff" opacity=".8"/></g>
    <path d="M0 200 L0 122 C30 104 52 86 78 92 C100 98 112 70 140 64 C166 58 180 86 206 90 C236 94 250 60 280 56 C310 52 330 84 356 92 C380 98 400 76 428 70 C458 64 478 92 506 94 C536 96 556 66 588 62 C620 58 640 90 668 96 C694 100 716 72 744 70 C772 68 790 88 800 92 V200Z" fill="url(#duM1)"/>
    <g fill="#fff" opacity=".9"><path d="M128 70 C134 64 146 62 152 66 L146 72 L140 68 L134 74Z"/><path d="M268 62 C274 56 286 54 292 58 L286 66 L280 61 L273 67Z"/><path d="M416 76 C422 70 434 68 440 72 L434 79 L428 74 L421 80Z"/><path d="M576 68 C582 62 594 60 600 64 L594 71 L588 66 L581 72Z"/><path d="M734 76 C740 70 750 70 756 73 L750 80 L744 76 L738 81Z"/></g>
    <rect y="96" width="800" height="60" fill="url(#duNevoa)"/>
    <path d="${serra(232, [[-10, 152], [26, 116], [62, 144], [98, 104], [140, 142], [184, 110], [226, 146], [268, 118], [314, 150], [356, 124], [400, 156], [440, 122], [482, 146], [526, 106], [570, 140], [612, 112], [656, 144], [700, 108], [744, 140], [790, 116], [810, 128]])}" fill="url(#duSerraA)"/>
    <g fill="#8EA8BE" opacity=".55">${[[98, 108], [184, 114], [526, 110], [700, 112]].map(([x, y]) => pinho(x, y + 4, .5, '#8EA8BE', '#8EA8BE')).join('')}</g>
    <rect y="128" width="800" height="40" fill="url(#duNevoa)" opacity=".9"/>
    <g id="du-nuvem" class="toque"><g id="du-nuvem-in" style="transform-origin:236px 58px;transition:transform 1s"><use href="#nuvem" x="168" y="22" width="140" height="70" style="color:#8A97B4"/><use href="#nuvem" x="174" y="24" width="130" height="64" style="color:#E6ECF6"/><use href="#nuvem" x="196" y="48" width="86" height="38" style="color:#C2CCE0"/><path d="M188 48 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#5AA0E8"><path d="M210 92 l-3 8 a3 3 0 0 0 6 0Z"/><path d="M236 96 l-3 8 a3 3 0 0 0 6 0Z"/><path d="M262 90 l-3 8 a3 3 0 0 0 6 0Z"/></g></g><g id="du-nuvem-hint" style="display:none">${brilhoHotspot(296, 36)}</g><rect x="160" y="18" width="160" height="90" fill="transparent"/></g>
    <g id="du-serra" class="toque"><path d="${serra(250, [[-10, 186], [40, 150], [86, 178], [134, 144], [180, 176], [226, 154], [272, 180], [322, 158], [372, 186], [400, 194], [430, 182], [476, 152], [524, 178], [574, 142], [624, 174], [672, 150], [720, 178], [768, 152], [810, 170]])}" fill="url(#duSerraB)"/>
      ${[[40, 154], [134, 148], [226, 158], [476, 156], [574, 146], [672, 154], [768, 156]].map(([x, y], i) => pinho(x + (i % 2 ? 6 : -6), y + 6, .55, '#6E9690', '#5E8680')).join('')}</g>
    <g class="deriva" style="animation-duration:34s" pointer-events="none"><ellipse cx="160" cy="176" rx="150" ry="12" fill="url(#duBruma)" opacity=".8"/><ellipse cx="620" cy="168" rx="170" ry="11" fill="url(#duBruma)" opacity=".75"/></g>
    <rect y="150" width="800" height="70" fill="url(#duNevoa)" opacity=".55"/>
    <path d="M-10 272 L-10 196 C30 170 70 150 112 154 C150 158 170 176 206 172 C240 168 262 150 300 156 C334 162 360 172 380 190 C388 204 392 222 392 240 L340 252 C250 262 120 268 -10 272Z" fill="url(#duM3)" stroke="#2E5A44" stroke-width="1.4"/>
    <path d="M408 240 C408 220 412 202 420 192 C444 170 476 160 516 164 C556 170 584 150 624 146 C668 142 700 162 736 160 C766 158 790 150 812 152 V292 C760 284 700 278 672 274 C640 262 600 252 560 246 C500 240 450 240 408 240Z" fill="url(#duM3)" stroke="#2E5A44" stroke-width="1.4"/>
    <g opacity=".7">${Array.from({ length:26 }, (_, i) => { const x = -10 + i * 32 + R(-6, 6); if (x > 368 && x < 432) return ''; const y = (x < 400 ? 186 + Math.abs(x - 160) * .03 : 182 + Math.abs(x - 620) * .03) + R(-6, 4), tp = ['p', 'r', 'c', 'b', 'p', 'r'][i % 6];
      return ARV(x, y, tp, R(.62, .82), ['#78A894', '#86B4A0', '#6E9E8C'][i % 3], '#5E8C7C', '#A8CEB8'); }).join('')}</g>
    <rect y="178" width="800" height="26" fill="url(#duNevoa)" opacity=".55"/>
    <path d="M184 252 C190 228 200 206 214 196 C250 190 300 192 344 200 L350 252Z" fill="#7CB25A" stroke="#3E6A2E" stroke-width="1.2"/>
    <g id="du-terracos">${Array.from({ length:7 }, (_, k) => { const y = 200 + k * 7, xa = 192 + k * 4, xb = 340 - k * 1.5, sag = 4 + k * .6, verde = k % 3 === 2;
      return `<path d="M${xa} ${y} Q${(xa + xb) / 2} ${y + sag} ${xb} ${y - 1} L${xb + 1} ${y + 6} Q${(xa + xb) / 2} ${y + sag + 7} ${xa - 2} ${y + 7}Z" fill="${verde ? '#9ED070' : 'url(#duEspelho)'}" stroke="#5E8A44" stroke-width=".8"/><path d="M${xa} ${y} Q${(xa + xb) / 2} ${y + sag} ${xb} ${y - 1}" stroke="#B8E08A" stroke-width="1.4" fill="none"/>
        <path d="M${xa - 2} ${y + 7} Q${(xa + xb) / 2} ${y + sag + 7} ${xb + 1} ${y + 6}" stroke="#3E6A2A" stroke-width="2.6" fill="none"/>
        ${verde ? `<path d="M${xa + 6} ${y + 3} Q${(xa + xb) / 2} ${y + sag + 3} ${xb - 6} ${y + 2}" stroke="#4E9A3A" stroke-width="1.4" stroke-dasharray="1.6 2.6" fill="none"/>` : `<path d="M${xa + 14 + k * 6} ${y + 3 + sag * .3} h${10 + k}" stroke="#fff" stroke-width="1.2" opacity=".85" stroke-linecap="round"/><path d="M${xb - 34} ${y + 3 + sag * .5} h6" stroke="#fff" stroke-width="1" opacity=".6"/>`}`; }).join('')}</g>
    <g>${[[-6, 220, 'r'], [24, 214, 'p'], [54, 222, 'b'], [86, 216, 'm'], [118, 220, 'p'], [150, 214, 'c'], [176, 222, 'r'], [352, 236, 'p'], [446, 238, 'p'], [470, 230, 'r'], [500, 224, 'b'], [528, 228, 'c'], [556, 222, 'm'], [584, 226, 'p'], [612, 218, 'r'], [642, 228, 'b'], [670, 224, 'p'], [700, 230, 'c'], [728, 226, 'r'], [758, 232, 'm'], [790, 226, 'p']].map(([x, y, tp], i) => {
        const cores = { r:[['#4E8E5E', '#2A5A3E', '#8CC27E'], ['#3E7E5A', '#244E3A', '#7CB27A']], p:[['#2E6E50', '#1E4A36', '#5E9A7A'], ['#3A7A5A', '#1E4A36', '#6AA680']], c:[['#2E6448', '#1E4432', '#5A8A6A'], ['#3E7452', '#1E4432', '#6A9A72']], b:[['#6AA86A', '#2E5A34', '#A8D88A'], ['#5A9A62', '#2E5A34', '#9AD08A']], m:[['#C8503A', '#7A2A1A', '#F08A5A'], ['#D8A23A', '#8A5A12', '#FFE08A']] }[tp][i % 2];
        return ARV(x, y + 16, tp, R(.86, 1.06), cores[0], cores[1], cores[2]); }).join('')}
      ${casa(74, 254, .42, 0)}${casa(104, 250, .38, 1)}${casa(318, 252, .4, 2)}</g>
    <path d="M362 246 C368 220 372 198 386 178 C392 172 396 172 398 178 L396 240Z" fill="url(#duRochaE)" stroke="#3E362E" stroke-width="1.2"/>
    <path d="M438 246 C432 220 428 200 416 180 C410 172 404 172 402 178 L404 240Z" fill="url(#duRocha)" stroke="#3E362E" stroke-width="1.2"/>
    <path d="M374 214 l10 -4 M378 196 l8 -2 M424 210 l-10 -4 M418 194 l-8 -2" stroke="#4E463A" stroke-width="1.2" opacity=".7"/>
    <rect y="150" width="800" height="40" fill="url(#duNevoa)" opacity=".35"/>
    <path d="M-10 240 C120 250 300 240 400 236 C520 236 680 258 812 268 V510 H-10Z" fill="url(#duChao)"/>
    <path d="M640 262 C700 264 760 268 812 272 V510 H648 C652 420 646 330 640 262Z" fill="url(#duPlan)"/>
    ${colza(240, 258, 112, 36, 5)}${colza(40, 252, 80, 20, 3)}${colza(462, 258, 56, 26, 4)}
    <g stroke="#5E9A3E" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8">${Array.from({ length:46 }, (_, i) => { const lado = i % 3, x = lado === 2 ? R(456, 540) : R(80, 330), y = lado === 2 ? R(292, 340) : R(300, 440); return (lado < 2 && x > 290 && y < 330) ? '' : `<path d="M${f1(x)} ${f1(y)} q-1 -5 -3 -7 M${f1(x + 2)} ${f1(y)} q0 -6 1 -8 M${f1(x + 4)} ${f1(y)} q2 -4 4 -6"/>`; }).join('')}</g>
    <g>${Array.from({ length:24 }, (_, i) => { const x = i % 4 === 3 ? R(458, 540) : R(90, 320), y = i % 4 === 3 ? R(296, 340) : R(310, 436), c = ['#FFFFFF', '#FF9AC8', '#FFE45A', '#C8A0FF'][i % 4]; return `<g fill="${c}" stroke="#8A6A8A" stroke-width=".4">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(x + Math.cos(a / 57.3) * 2.2)}" cy="${f1(y + Math.sin(a / 57.3) * 1.6)}" r="1.5"/>`).join('')}<circle cx="${f1(x)}" cy="${f1(y)}" r="1" fill="#F0A81E" stroke="none"/></g>`; }).join('')}</g>
    <g opacity=".85">${[[680, 272], [716, 268], [758, 272], [796, 270]].map(([x, y], i) => cipreste(x, y + 8, .6, ['#4E8A5A', '#3E7A52'][i % 2], '#2A5440')).join('')}</g>
    <g id="du-vila" class="toque">${casa(712, 304, .82, 0)}${casa(756, 298, .74, 1)}${casa(792, 306, .8, 2)}
      ${arvore(734, 304, .56, '#D8A23A', '#8A5A12', '#FFE08A')}${arvore(690, 308, .5, '#4E9A5A', '#2A5A34', '#9AD88A')}
      <g id="du-vila-ok" style="opacity:0;transition:opacity .8s">${brilhoHotspot(756, 262)}</g>
      <rect x="680" y="262" width="120" height="50" fill="transparent"/></g>
    <g id="du-arrozais">${arrozais}</g>
    <g id="du-bufalo" class="toque"><g id="du-buf-in" style="transform-origin:752px 478px">
      <ellipse cx="752" cy="482" rx="30" ry="4" fill="#1E2A14" opacity=".3"/>
      <path d="M730 470 v12 M738 472 v12 M764 472 v12 M772 470 v12" stroke="#2E2830" stroke-width="5" stroke-linecap="round"/>
      <path d="M724 462 C724 448 740 444 756 444 C772 444 780 450 780 462 C780 472 768 476 752 476 C736 476 724 474 724 462Z" fill="url(#duBufalo)" stroke="#1E1A22" stroke-width="1.6"/>
      <path d="M734 450 C744 446 760 446 770 449" stroke="#9A92A0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M724 458 c-4 2 -6 8 -4 12" stroke="#3E3842" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g id="du-buf-cab"><path d="M776 452 C782 446 794 448 796 456 C798 464 792 470 786 470 C780 470 776 464 776 452Z" fill="url(#duBufalo)" stroke="#1E1A22" stroke-width="1.6"/>
      <path d="M782 450 C774 442 770 436 776 432 C778 438 784 442 788 446 M792 450 C800 444 804 438 800 434 C798 440 794 444 790 447" fill="#E8DCC4" stroke="#6E5E4A" stroke-width="1.2"/>
      <ellipse cx="792" cy="466" rx="5" ry="3.4" fill="#5E5662"/><circle cx="785" cy="457" r="2" fill="#12121A"/><circle cx="785.6" cy="456.4" r=".7" fill="#fff"/></g></g>
      <rect x="716" y="430" width="88" height="56" fill="transparent"/></g>
    ${margem('c1', 3)}${margem('c2', 3)}${margem('c3', 3)}
    ${rio('c1')}${rio('c2')}${rio('c3')}
    <g id="du-garca" class="toque"><g class="deriva" style="animation-duration:26s"><g style="animation:flutua 3s ease-in-out infinite alternate"><svg x="560" y="190" width="54" height="27" viewBox="0 0 40 20"><use href="#garca"/></svg><svg x="604" y="206" width="40" height="20" viewBox="0 0 40 20"><use href="#garca"/></svg></g></g><rect x="556" y="186" width="96" height="46" fill="transparent"/></g>
    <path d="M378 196 C388 176 396 160 400 150 C404 160 412 176 422 196 L416 244 H384Z" fill="#6E9A6E"/>
    ${margem('longe', 4)}${margem('perto', 8)}${margem('fora', 12)}${margem('dentro', 8)}${margem('garg', 2)}
    ${rio('longe')}${rio('perto')}${rio('fora')}${rio('dentro')}${rio('garg')}
    <path d="M346 250 C352 230 364 214 382 204 C386 214 388 226 386 244 C374 250 360 252 346 250Z" fill="url(#duRochaE)" stroke="#3E362E" stroke-width="1.2"/><path d="M360 232 l12 -6 M354 244 l14 -4" stroke="#3E362E" stroke-width="1" opacity=".6"/>
    <path d="M454 250 C448 230 436 214 418 204 C414 214 412 226 414 244 C426 250 440 252 454 250Z" fill="url(#duRocha)" stroke="#3E362E" stroke-width="1.2"/><path d="M440 232 l-12 -6 M446 244 l-14 -4" stroke="#3E362E" stroke-width="1" opacity=".6"/>
    <path d="${copa(360, 212, 16, 9, 8, .3)}" fill="#3E7E5A" stroke="#2A5440" stroke-width="1"/><path d="${copa(440, 212, 16, 9, 8, .3)}" fill="#4E8E5E" stroke="#2A5440" stroke-width="1"/>
    <path id="du-fora-toque" class="toque" d="${poli('fora', 1, 1)}" fill="transparent"/>
    <g id="du-peixe" style="opacity:0"><path d="M-12 0 C-6 -7 6 -7 12 0 C6 7 -6 7 -12 0Z M-12 0 L-19 -6 L-17 0 L-19 6Z" fill="#E8A040" stroke="#8A4A12" stroke-width="1.2"/><path d="M-4 -5 q4 -3 8 0" stroke="#FFE0A0" stroke-width="1.4" fill="none"/><circle cx="6" cy="-1" r="1.3" fill="#12121A"/></g>
    <g id="du-jangada" class="toque"><g id="du-jang-pos"><g style="animation:flutua 2.6s ease-in-out infinite alternate">
      <ellipse cx="350" cy="356" rx="24" ry="4" fill="#1E4A7A" opacity=".35"/>
      <path d="M330 350 L370 348 L372 356 L332 358Z" fill="url(#duBambuC)" stroke="#5E3E18" stroke-width="1.2" stroke-linejoin="round"/><path d="M331 352 L371 350 M331.6 354.4 L371.6 352.4" stroke="#7A5226" stroke-width=".8"/><path d="M332 350 L333 358 M369 348 L371 356" stroke="#5E3E18" stroke-width="1.6"/>
      <path d="M344 349 L362 320" stroke="#6E4428" stroke-width="2" stroke-linecap="round"/>
      <g id="du-vara" style="transform-box:fill-box;transform-origin:30% 30%"><path d="M352 330 L330 366" stroke="#8A6040" stroke-width="1.8" stroke-linecap="round"/></g>
      ${pessoa(352, 349, '#C99064', '#1A1414', '#5E8A5A', '#3E4A5E', .62, '', '<path d="M6 -28 C2 -24 -2 -22 -4 -20" stroke="#5E8A5A" stroke-width="4" fill="none" stroke-linecap="round"/>')}
      <g transform="translate(362 352)"><path d="M0 0 C2 -4 8 -4 10 0Z" fill="#B88456" stroke="#5E3E18" stroke-width=".8"/><path d="M1 -1 h8" stroke="#5E3E18" stroke-width=".5"/></g></g></g>
      <rect x="322" y="314" width="56" height="50" fill="transparent"/></g>
    <g id="du-vertedouro"><path d="M388 396 C402 392 424 390 440 392 C444 400 448 410 452 420 C432 420 408 418 390 416Z" fill="#A8A498" stroke="#5E5A50" stroke-width="1.4"/>
      <g fill="#C8C4B6" stroke="#6E6A5E" stroke-width=".8">${Array.from({ length:12 }, (_, i) => `<ellipse cx="${394 + (i % 6) * 9 + (i > 5 ? 4 : 0)}" cy="${400 + (i > 5 ? 9 : 0)}" rx="4" ry="2.6"/>`).join('')}</g></g>
    <g id="du-verte-agua" style="opacity:0;transition:opacity 1.4s">${rio('verte')}</g>
    <g id="du-dique-vagas" style="display:none">${DIQUE.map((d, i) => `<path class="du-vaga" data-i="${i}" d="${d}" fill="#fff" fill-opacity=".38" stroke="#fff" stroke-width="2.6" stroke-dasharray="7 5"/>`).join('')}</g>
    <g id="du-dique">${DIQUE.map((d, i) => `<g class="du-seg" data-i="${i}" style="opacity:0;transition:opacity .6s">${textoDique([232, 284, 340][i], [284, 340, 394][i], i)}<path d="${d}" fill="none" stroke="#3E2A10" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="${brilhoBorda([236, 284, 340][i], [284, 340, 394][i], 'fora', 1, 4)}" stroke="#2A3E52" stroke-width="3" fill="none" opacity=".35"/><path d="${brilhoBorda([236, 284, 340][i], [284, 340, 394][i], 'fora', 1, 3)}" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7" stroke-dasharray="10 5"/>
        <path d="${brilhoBorda([236, 284, 340][i], [284, 340, 394][i], 'dentro', -1, -3)}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6" stroke-dasharray="7 6"/></g>`).join('')}
      <path id="du-dique-luz" d="M401 222 C404 250 406 300 410 386" stroke="#FFF2C8" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-dasharray="14 10" opacity=".4" style="opacity:0;transition:opacity .6s"/>
      <g id="du-espuma-ponta" style="opacity:0;transition:opacity 1s" pointer-events="none"><g class="du-esp-in" style="transform-origin:400px 222px">
        <path d="M384 226 C388 214 396 208 400 207 C404 208 412 214 416 226 C410 220 404 217 400 217 C396 217 390 220 384 226Z" fill="#F4FBFF" opacity=".9"/>
        ${[[388, 228, 4], [412, 228, 4], [384, 236, 3], [416, 236, 3], [393, 220, 2.6], [407, 220, 2.6], [382, 244, 2.4], [418, 244, 2.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".85"/>`).join('')}
        <path d="M380 232 q-4 8 -6 16 M420 232 q4 8 6 16" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></g></g>
      <g id="du-boca" style="opacity:0;transition:opacity .6s"><circle cx="401" cy="232" r="2.2" fill="#2A1E12"/><circle cx="401.6" cy="231.4" r=".7" fill="#fff"/></g></g>
    <g pointer-events="none"><ellipse cx="660" cy="258" rx="150" ry="14" fill="url(#duBruma)" opacity=".9"/></g>
    <g id="du-morro">
      <path d="M496 408 C500 384 508 366 518 352 L528 342 L536 330 C548 316 560 308 572 298 L588 288 C604 276 622 266 644 260 C672 254 700 254 726 260 C746 264 760 274 772 286 L752 300 C734 312 712 318 696 328 C682 338 668 350 652 356 L640 360 L640 412 L556 412 L556 360 C540 372 520 392 508 410Z" fill="url(#duMorro2)" stroke="#23482A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M772 286 L752 300 C734 312 712 318 696 328 C682 338 668 350 652 356 L640 360 L640 340 C664 330 690 310 712 296 C732 284 752 280 772 286Z" fill="#2E5A34" opacity=".3"/>
      <path d="M540 326 C566 300 600 280 640 268 C672 260 708 258 740 266" stroke="#C8E8A0" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>
      ${[[600, 318, 16, 7], [660, 300, 13, 6], [712, 290, 10, 5], [560, 338, 10, 5]].map(([x, y, rx, ry]) => `<path d="M${x - rx} ${y + ry} C${x - rx * .6} ${y - ry} ${x + rx * .4} ${y - ry * 1.2} ${x + rx} ${y + ry * .6}Z" fill="url(#duEstrato)" stroke="#3E362E" stroke-width="1"/><path d="M${x - rx * .6} ${y + ry * .2} h${rx * 1.1}" stroke="#6E6252" stroke-width=".8"/>`).join('')}
      <path d="M496 408 C506 386 520 370 536 362 L556 356 L556 412 L508 412Z" fill="url(#duEstrato)" stroke="#3E362E" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M502 400 C512 386 526 376 542 372 M508 392 C520 380 534 372 552 368" stroke="#6E6252" stroke-width="1.1" fill="none" opacity=".6"/>
      <path d="M640 360 L652 356 C668 350 682 338 696 328 C700 344 692 366 680 382 L664 398 L640 412Z" fill="url(#duRochaE)" stroke="#3E362E" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M646 372 l18 -12 M648 388 l22 -16 M652 402 l18 -14" stroke="#3E362E" stroke-width="1" opacity=".5"/>
      <path d="M556 360 L566 352 L578 356 L590 346 L604 352 L618 344 L630 352 L640 350 L640 412 C614 409 580 409 556 412Z" fill="url(#duFace)" stroke="#3E362E" stroke-width="1.6" stroke-linejoin="round"/>
      ${[[366, '#B8A88E'], [378, '#9A8C76'], [390, '#B0A086'], [400, '#8E8270']].map(([y, cor]) => `<path d="M556 ${y} C576 ${y - 3} 600 ${y + 2} 620 ${y - 2} C628 ${y - 3} 636 ${y - 1} 640 ${y}" stroke="${cor}" stroke-width="5" fill="none" opacity=".55"/><path d="M556 ${y + 2.6} C576 ${y - .4} 600 ${y + 4.6} 620 ${y + .6} C628 ${y - .4} 636 ${y + 1.6} 640 ${y + 2.6}" stroke="#4E463A" stroke-width=".9" fill="none" opacity=".6"/>`).join('')}
      <path d="M572 358 l-2 10 l3 8 l-2 12 M606 352 l2 12 l-3 10 l3 14 M628 356 l-2 14 l2 10" stroke="#3E362E" stroke-width="1" fill="none" opacity=".55"/>
      ${[[568, 357, 6], [596, 350, 7], [624, 349, 6], [584, 377, 4], [614, 389, 4.4], [562, 395, 3.4]].map(([x, y, r]) => `<path d="${copa(x, y, r, r * .5, 7, .4)}" fill="#6E9A4E" stroke="#3E6A2E" stroke-width=".8"/>`).join('')}
      <path d="M556 412 C580 409 614 409 640 412 L640 419 C614 415 580 415 556 419Z" fill="#1E2A3A" opacity=".38"/>
      ${[[520, 344, .62, 'p'], [548, 322, .74, 'p'], [574, 304, .8, 'r'], [664, 278, .82, 'p'], [694, 276, .74, 'b'], [722, 274, .72, 'p'], [748, 286, .64, 'c'], [676, 318, .72, 'p'], [704, 306, .66, 'r'], [536, 356, .5, 'b']].map(([x, y, s2, tp], i) => ARV(x, y, tp, s2, tp === 'p' ? '#2E6E50' : tp === 'c' ? '#2E6448' : ['#4E9A5A', '#6AAE62'][i % 2], '#1E4A36', '#9AD08A')).join('')}
    </g>
    <g id="du-lidui">
      <ellipse cx="600" cy="497" rx="58" ry="6" fill="#1E2A14" opacity=".3"/>
      <path d="M550 494 C546 474 548 456 556 444 L566 436 L578 440 L590 431 L604 436 L620 429 L634 437 L644 446 C652 462 652 480 648 496 C622 506 574 504 550 494Z" fill="url(#duEstrato)" stroke="#3E362E" stroke-width="1.6" stroke-linejoin="round"/>
      ${[452, 464, 476, 488].map((y, k) => `<path d="M${552 - k} ${y} C572 ${y - 3} 596 ${y + 3} 620 ${y - 2} C632 ${y - 4} 642 ${y - 1} ${648 + k * .5} ${y + 1}" stroke="${k % 2 ? '#8A7C66' : '#C8B89A'}" stroke-width="4" fill="none" opacity=".5"/><path d="M${552 - k} ${y + 2.4} C572 ${y - .6} 596 ${y + 5.4} 620 ${y + .4} C632 ${y - 1.6} 642 ${y + 1.4} ${648 + k * .5} ${y + 3.4}" stroke="#4E463A" stroke-width=".8" fill="none" opacity=".55"/>`).join('')}
      <path d="M572 444 l2 12 l-3 12 l2 14 M612 438 l-2 14 l3 12 M636 446 l-2 16" stroke="#3E362E" stroke-width="1" fill="none" opacity=".55"/>
      <path d="M552 452 C548 466 548 480 552 492" stroke="#E8DCC4" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
      ${[[562, 444, 5], [596, 436, 6], [630, 440, 5], [646, 466, 4], [556, 470, 3.6]].map(([x, y, r]) => `<path d="${copa(x, y, r, r * .5, 7, .4)}" fill="#6E9A4E" stroke="#3E6A2E" stroke-width=".8"/>`).join('')}
      ${pinho(562, 452, .46, '#2E6E50', '#1E4A36')}${pinho(640, 456, .5, '#3A7A5A', '#1E4A36')}${pinho(600, 444, .36, '#2E6448', '#1E4A36')}
      <g class="deriva" style="animation-duration:18s" pointer-events="none"><ellipse cx="600" cy="490" rx="74" ry="8" fill="url(#duBruma)" opacity=".75"/></g>
    </g>
    <g id="du-rocha" class="toque">
      ${CAMADAS.map((d, i) => `<g class="du-bloco" data-i="${i}"><path d="${d}" fill="url(#duBloco)" stroke="#3E362E" stroke-width="1.6" stroke-linejoin="round"/><path d="M558 ${[364, 394, 422][i]} C580 ${[361, 391, 419][i]} 610 ${[366, 396, 424][i]} 638 ${[362, 392, 420][i]} M558 ${[374, 403, 430][i]} C584 ${[371, 400, 427][i]} 612 ${[376, 405, 432][i]} 638 ${[372, 401, 428][i]}" stroke="#6E6252" stroke-width="1.1" fill="none" opacity=".55"/>${i === 0 ? `<path d="${copa(576, 349, 6, 3, 7, .4)}" fill="#6E9A4E" stroke="#3E6A2E" stroke-width=".8"/><path d="${copa(614, 348, 7, 3.4, 7, .4)}" fill="#6E9A4E" stroke="#3E6A2E" stroke-width=".8"/>` : ''}<path class="du-calor" d="${d}" fill="url(#duQuente)" style="opacity:0;transition:opacity 1s"/>
        <path d="M562 ${[354, 390, 416][i]} C584 ${[348, 387, 414][i]} 610 ${[348, 386, 413][i]} 634 ${[354, 389, 415][i]}" stroke="#E8DCC4" stroke-width="1.8" fill="none" opacity=".6" stroke-linecap="round"/>
        <path class="du-racha" d="M${570 + i * 4} ${[360, 390, 417][i]} l8 7 l-4 6 l9 6 M${604 - i * 3} ${[358, 389, 416][i]} l-5 9 l7 5 l-3 8 M${624} ${[364, 392, 420][i]} l6 6 l-6 7" stroke="#2A221A" stroke-width="1.8" fill="none" stroke-linejoin="round" style="opacity:0;transition:opacity .3s"/></g>`).join('')}
      <g id="du-fogo" style="display:none">${chama(598, 384)}</g>
      <g id="du-rocha-hint" style="display:none">${brilhoHotspot(622, 350)}</g>
      <rect x="550" y="340" width="96" height="102" fill="transparent"/></g>
    <g id="du-trab1" class="toque">
      <g transform="translate(528 410)"><path d="M-12 0 L12 -5 M-12 -5 L12 0 M-10 -10 L14 -7" stroke="#6E4428" stroke-width="5" stroke-linecap="round"/><path d="M-12 0 L12 -5 M-12 -5 L12 0 M-10 -10 L14 -7" stroke="#C08A5A" stroke-width="2.6" stroke-linecap="round"/><path d="M-12 -2.4 a1.6 2.4 0 1 0 .1 0" fill="#E8C49A"/></g>
      ${pessoa(492, 404, '#E2AE84', '#1A1414', '#3E6AA8', '#4A4038', 1.5,
        '<path d="M-7 -30 C-11 -26 -12 -20 -10 -15" stroke="#3E6AA8" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="-10" cy="-14.6" r="2.2" fill="#E2AE84" stroke="#5A3420" stroke-width=".7"/>',
        '<path d="M7 -30 C11 -34 13 -40 14 -44" stroke="#3E6AA8" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="14.4" cy="-45" r="2.4" fill="#E2AE84" stroke="#5A3420" stroke-width=".7"/><path d="M12 -40 L18 -60" stroke="#6E4428" stroke-width="2.6" stroke-linecap="round"/><path d="M12 -40 L18 -60" stroke="#C08A5A" stroke-width="1.2" stroke-linecap="round"/><path d="M16.4 -56 l3.4 1 l-.8 3 l-3.4 -1Z M17.2 -59 l3.4 1" fill="#B88456" stroke="#5A3420" stroke-width=".6"/><g class="du-tocha"><path d="M18.6 -60 C14 -64 16 -71 19.6 -76 C20.4 -70 25 -68 22.6 -61Z" fill="#FF8A2A" stroke="#C8401E" stroke-width="1"/><path d="M19.2 -62 C17.8 -65 19 -69 20 -70.4 C20.8 -67 22 -66 21.2 -62Z" fill="#FFE27A"/></g>')}
      <g id="du-trab1-hint" style="display:none">${brilhoHotspot(470, 330)}</g><rect x="470" y="318" width="62" height="96" fill="transparent"/></g>
    <g id="du-trab2" class="toque">
      ${pessoa(632, 344, '#B67E54', '#2A1E14', '#D8603A', '#3E4E6A', 1.4,
        '<path d="M-7 -30 C-11 -28 -14 -26 -16 -23" stroke="#D8603A" stroke-width="4.4" fill="none" stroke-linecap="round"/>',
        '<path d="M7 -30 C2 -28 -6 -26 -12 -24" stroke="#D8603A" stroke-width="4.4" fill="none" stroke-linecap="round"/><g class="du-balde" style="transform-box:fill-box;transform-origin:70% 20%"><path d="M-27 -30 L-25 -16 H-11 L-9 -30Z" fill="url(#duMadeira)" stroke="#3E2414" stroke-width="1.2" stroke-linejoin="round"/><path d="M-26.4 -26 H-9.6 M-25.6 -20 H-10.4" stroke="#5A5A64" stroke-width="1.4"/><path d="M-22 -29 V-17 M-15 -29 V-17" stroke="#4A2E14" stroke-width=".6" opacity=".6"/><ellipse cx="-18" cy="-30" rx="9" ry="2.6" fill="#6CC0EE" stroke="#3E2414" stroke-width="1"/><path d="M-22 -30.4 q3 -1 6 0" stroke="#fff" stroke-width=".9" fill="none"/><path d="M-27 -30 C-25 -40 -11 -40 -9 -30" stroke="#5A5A64" stroke-width="1.3" fill="none"/></g><circle cx="-13" cy="-23.6" r="2.3" fill="#B67E54" stroke="#5A3420" stroke-width=".7"/><circle cx="-17" cy="-22.4" r="2.2" fill="#B67E54" stroke="#5A3420" stroke-width=".7"/>')}
      <g id="du-trab2-hint" style="display:none">${brilhoHotspot(650, 270)}</g><rect x="604" y="262" width="52" height="86" fill="transparent"/></g>
    <g id="du-crianca" class="toque"><g id="du-bici" transform="translate(700 336)"><g id="du-bici-in" transform="scale(1.5)">
      <ellipse cx="0" cy="6.4" rx="16" ry="2" fill="#1E2A14" opacity=".25"/>
      <circle cx="-9" cy="0" r="6" fill="none" stroke="#2E2E3A" stroke-width="2"/><circle cx="9" cy="0" r="6" fill="none" stroke="#2E2E3A" stroke-width="2"/><path d="M-9 -5 V5 M-14 0 H-4 M9 -5 V5 M4 0 H14" stroke="#8A8A9A" stroke-width=".5"/>
      <path d="M-9 0 L-2 -9 L7 -9 L9 0 M-2 -9 L0 0 L7 -9 M-4 -12 h5 M7 -9 l2 -5 h4" stroke="#E8403A" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M-12 -4 h6 l-1 3 h-4Z" fill="#3E7AC8" stroke="#1E3A6A" stroke-width=".5"/>
      <path d="M0 0 L-2 -8" stroke="#2E4A8A" stroke-width="3" stroke-linecap="round"/><path d="M-1.6 -.4 h3" stroke="#fff" stroke-width="1.4"/>
      <path d="M-8 -18 C-10 -14 -9 -10 -6 -9 L-3 -10 L-4 -18Z" fill="#3EA86A" stroke="#1E5A3A" stroke-width=".7"/>
      <path d="M-3 -10 C-4 -16 -1 -20 2 -20 C6 -20 6 -14 5 -10Z" fill="#FFC83D" stroke="#8A5A0E" stroke-width="1"/><path d="M-1 -18 q2 2 4 0" stroke="#fff" stroke-width=".7" fill="none" opacity=".7"/>
      <path d="M3 -16 L11 -13" stroke="#C99064" stroke-width="2.2" stroke-linecap="round"/><circle cx="2.4" cy="-24" r="4.4" fill="#C99064" stroke="#4A2E1A" stroke-width=".9"/><path d="M-2.2 -24.4 C-2.6 -30 6.6 -30.6 7 -24.8 C4 -27 0 -27 -2.2 -24.4Z" fill="#1E1614"/><ellipse cx="4.4" cy="-23.8" rx=".7" ry=".9" fill="#12121A"/><circle cx="4.6" cy="-24.1" r=".3" fill="#fff"/><path d="M3.4 -21.4 q1.4 1 2.6 0" stroke="#6E2A1E" stroke-width=".6" fill="none"/><ellipse cx="5.6" cy="-22.4" rx="1" ry=".6" fill="#FF8A7A" opacity=".55"/></g></g>
      <rect x="672" y="290" width="56" height="54" fill="transparent"/></g>
    <g id="du-pedregal"><ellipse cx="242" cy="470" rx="78" ry="30" fill="url(#duCascalho)" stroke="#9A865A" stroke-width="1.6"/>
      <g fill="#BCA678">${Array.from({ length:26 }, () => `<ellipse cx="${R(172, 312).toFixed(0)}" cy="${R(450, 494).toFixed(0)}" rx="${R(2, 4).toFixed(1)}" ry="${R(1.4, 2.6).toFixed(1)}"/>`).join('')}</g></g>
    <g id="du-cesto-fig" class="toque" data-fig="cestopedra"><svg x="128" y="456" width="76" height="54" viewBox="0 0 140 100"><use href="#f-cestopedra"/></svg>${brilhoHotspot(196, 466)}</g>
    <g id="du-cestos">${CESTOS.map((p, i) => cesto(p.x, p.y, i)).join('')}</g>
    <g id="du-pedras">${PEDRAS.map((p, i) => `<g class="du-pedra toque" data-i="${i}" transform="translate(${p.x} ${p.y})" style="cursor:grab"><ellipse cx="0" cy="${(p.r * .7).toFixed(1)}" rx="${p.r + 2}" ry="3" fill="#3E3420" opacity=".3"/><ellipse cx="0" cy="0" rx="${p.r}" ry="${(p.r * .82).toFixed(1)}" fill="${p.c}" stroke="#4A4E5A" stroke-width="1.6"/><path d="M${-p.r * .5} ${-p.r * .3} q${p.r * .4} ${-p.r * .45} ${p.r * .9} ${-p.r * .25}" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/><circle r="${p.r + 12}" fill="transparent"/></g>`).join('')}</g>
    <g id="du-mao" style="display:none"><path d="M276 438 C330 396 390 414 420 440" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M424 446 l-14 -2 l7 -11Z" fill="#fff"/></g>
    <g id="du-faisao" class="toque"><g id="du-fai-in" style="transform-origin:290px 352px">
      <ellipse cx="290" cy="354" rx="22" ry="3" fill="#1E2A14" opacity=".28"/>
      <path d="M276 344 C262 342 246 346 234 352 C248 348 262 348 274 350Z" fill="#C86A2A" stroke="#7A3A12" stroke-width="1"/><path d="M274 342 C258 336 244 336 232 340 C246 340 258 342 272 346Z" fill="#E8A040" stroke="#7A3A12" stroke-width="1"/>
      <path d="M286 352 v-6 M294 352 v-6" stroke="#A8743E" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M272 340 C272 330 284 326 296 330 C304 334 304 344 296 348 C288 352 276 350 272 340Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.4"/>
      <path d="M278 334 C284 330 292 330 296 332 C292 336 284 338 278 334Z" fill="#2E6AD6" stroke="#12358A" stroke-width=".9"/>
      <path d="M294 332 C296 324 300 318 306 316 C310 316 312 320 310 324 C306 324 302 328 300 334Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.2"/>
      <path d="M300 320 C296 314 298 308 304 306 C306 310 308 312 308 316Z" fill="url(#duFaisao)" stroke="#A8620E" stroke-width="1"/>
      <path d="M298 322 C300 318 304 316 306 318 C304 322 302 326 300 330Z" fill="#F0A81E" stroke="#8A4A08" stroke-width=".8"/>
      <path d="M310 320 l5 1 l-5 1.6Z" fill="#E8D08A"/><circle cx="307" cy="319.4" r="1.4" fill="#12121A"/><circle cx="307.4" cy="319" r=".5" fill="#fff"/></g>
      <rect x="228" y="300" width="92" height="58" fill="transparent"/></g>
    <g id="du-arvpv">
      <path d="M170 330 C172 300 166 276 172 250" stroke="#5E3E26" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M170 330 C172 300 166 276 172 250" stroke="#8A6040" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M170 286 C186 280 206 278 226 282" stroke="#5E3E26" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M170 286 C186 280 206 278 226 282" stroke="#8A6040" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="${copa(172, 236, 52, 30, 11, .24)}" fill="#3E8A5A" stroke="#245A3A" stroke-width="1.6"/><path d="${copa(160, 228, 28, 16, 9, .3)}" fill="#7CC27A" opacity=".55"/>
      <path d="${copa(212, 256, 22, 12, 8, .3)}" fill="#4E9A62" stroke="#245A3A" stroke-width="1.2"/></g>
    <g id="du-pv" class="toque" data-fig="pandavermelho"><g id="du-pv-in" style="transform-origin:206px 280px"><svg x="176" y="248" width="56" height="47" viewBox="0 0 130 110"><use href="#f-pandavermelho"/></svg></g>${brilhoHotspot(230, 254)}</g>
    <g id="du-brotos" class="toque"><g id="du-brotos-in" style="transform-origin:190px 444px">
      ${[[182, 444, 1], [194, 446, .8], [204, 444, .66]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-6 0 C-7 -10 -3 -20 0 -26 C3 -20 7 -10 6 0Z" fill="#E6C48A" stroke="#6E4418" stroke-width="1.2" stroke-linejoin="round"/><path d="M-5 -4 C-2 -8 3 -8 5 -5 M-4 -12 C-1 -15 2 -15 4 -12 M-2 -19 C0 -21 1 -21 2 -19" stroke="#6E4418" stroke-width="1" fill="none"/><path d="M-3 -4 C-3 -12 -1 -18 0 -22" stroke="#FFF0D0" stroke-width="1.2" fill="none" opacity=".8"/><path d="M0 -26 c-1 -4 1 -7 3 -8" stroke="#6ACB5A" stroke-width="2" fill="none" stroke-linecap="round"/></g>`).join('')}</g>
      <rect x="172" y="410" width="40" height="40" fill="transparent"/></g>
    <g id="du-lin" class="toque" data-fig="panda"><ellipse cx="108" cy="464" rx="50" ry="7" fill="#1E2A14" opacity=".28"/><g id="du-lin-in" style="transform-origin:108px 466px"><svg x="44" y="334" width="130" height="130" viewBox="0 0 120 120"><use href="#f-panda"/></svg></g>${brilhoHotspot(158, 352)}</g>
    <g id="du-bambus" class="toque" data-fig="bambuchina">${[[14, 500, 330, '#9AD06A', '#4E8A2E'], [34, 500, 300, '#5EB46A', '#2E7A3E'], [-4, 500, 360, '#7CC8A0', '#2E8A6A'], [56, 500, 250, '#A8D870', '#5A8A2A']].map(([x, y, h, cor, esc], i) => `<g class="balanca" style="transform-origin:${x}px ${y}px;animation-duration:${(5 + i).toFixed(0)}s;animation-delay:${-i}s"><path d="M${x} ${y} L${x + 6} ${y - h}" stroke="${esc}" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${y} L${x + 6} ${y - h}" stroke="${cor}" stroke-width="6" stroke-linecap="round"/>${Array.from({ length:Math.floor(h / 40) }, (_, j) => `<path d="M${f1(x - 5 + (j + 1) * 40 / h * 6)} ${y - (j + 1) * 40} h11" stroke="${esc}" stroke-width="2" stroke-linecap="round"/>`).join('')}${Array.from({ length:5 }, (_, j) => { const yy = y - h + j * 22 + 6, xx = x + 6 - j * 22 / h * 6, lado = j % 2 ? 1 : -1; return `<path d="M${f1(xx)} ${yy} q${lado * 14} -4 ${lado * 30} 6 q${-lado * 16} 2 ${-lado * 30} -6Z M${f1(xx)} ${yy + 4} q${lado * 10} 6 ${lado * 22} 16 q${-lado * 12} -4 ${-lado * 22} -16Z" fill="${cor}" stroke="${esc}" stroke-width="1.1" stroke-linejoin="round"/>`; }).join('')}</g>`).join('')}${brilhoHotspot(48, 240)}</g>
    <g pointer-events="none">${[[240, 498], [330, 500], [520, 500], [610, 502], [780, 500], [700, 504]].map(([x, y], i) => `<g class="balanca" style="transform-origin:${x}px ${y}px;animation-delay:${(-i * .7).toFixed(1)}s"><path d="M${x} ${y} q-6 -16 -4 -30 M${x + 6} ${y} q2 -18 8 -32 M${x + 12} ${y} q6 -12 14 -20 M${x - 6} ${y} q-8 -10 -14 -18" stroke="#3E7A2A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-6 -16 -4 -30 M${x + 6} ${y} q2 -18 8 -32" stroke="#8ACB5A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`).join('')}</g>
    <rect width="800" height="500" fill="url(#duVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#duGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* ---------- água correndo ---------- */
  const rioEl = k => s.querySelector(`.du-rio[data-k="${k}"]`);
  s.querySelectorAll('.du-onda').forEach((p, i) => p.animate([{ opacity:.85 }, { opacity:.15 }, { opacity:.85 }], { duration:1200, iterations:Infinity, delay:-(i % 4) * 300 }));
  s.querySelectorAll('.du-onda2').forEach((p, i) => p.animate([{ opacity:.15 }, { opacity:.85 }, { opacity:.15 }], { duration:1200, iterations:Infinity, delay:-(i % 4) * 300 }));
  s.querySelectorAll('.du-espuma').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-38 }], { duration:2400, iterations:Infinity }));
  el(s, '.du-esp-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.08,1.04)' }, { transform:'scale(1)' }], { duration:900, iterations:Infinity });
  s.querySelectorAll('.du-corre').forEach((p, i) => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-46 }], { duration:1300 + (i % 3) * 200, iterations:Infinity }));
  const redesenha = k => { const g = rioEl(k), d = poli(k, fac[k], prog[k]); g.querySelector('.du-agua').setAttribute('d', d); g.querySelector('.du-lama').setAttribute('d', d); g.querySelector('.du-clara').setAttribute('d', poli(k, fac[k] * .2, prog[k])); g.querySelector('.du-funda').setAttribute('d', poli(k, fac[k] * .58, prog[k])); g.querySelector('.du-espuma').setAttribute('d', d); };
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k)); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const encher = (k, ms) => tween(ms, e => { prog[k] = e; redesenha(k); }, () => { rioEl(k).querySelectorAll('.du-corre').forEach(c2 => c2.style.opacity = .75); rioEl(k).querySelector('.du-ondas').style.opacity = 1; });
  const largura = (k, f, lama) => { const f0 = fac[k]; rioEl(k).querySelector('.du-lama').style.opacity = lama || 0; tween(1800, e => { fac[k] = f0 + (f - f0) * e; redesenha(k); }); };
  /* partículas que descem os rios: brilhos de água e grãos de areia */
  const fluxo = [], espumas = [], cacos = []; let ultimo = 0;
  const nasce = (tipo) => fluxo.push({ k:'longe', d:0, v:sorte(1.1, 1.7), o:sorte(-.35, .35), tipo, f:sorte(0, 6) });
  const proximo = p => {
    if (p.k === 'longe') { p.k = 'perto'; p.d = 0; return true; }
    if (p.k === 'perto') { const pDentro = !interno ? 0 : p.tipo === 'areia' ? .18 : estacao === 'cheia' ? .4 : estacao === 'seca' ? .6 : .5; p.k = Math.random() < pDentro ? 'dentro' : 'fora'; p.d = 0; return true; }
    if (p.k === 'dentro' && gargalo) { p.k = 'garg'; p.d = 0; return true; }
    if (p.k === 'garg') { p.k = ['c1', 'c2', 'c3'][Math.floor(Math.random() * 3)]; p.d = 0; return true; }
    if (p.k === 'verte') { p.k = 'fora'; p.d = dPerto('fora', 368, 410); return true; }
    return false; };
  const D_VERTE = dPerto('dentro', 444, 396);
  c.desenho(ctx => {
    const t = performance.now();
    const taxa = estacao === 'cheia' ? 60 : estacao === 'seca' ? 220 : 130;
    if (t - ultimo > taxa && fluxo.length < 170) { ultimo = t; nasce('agua'); if (estacao === 'cheia' && Math.random() < .8) nasce('areia'); }
    if (interno && Math.random() < .5) espumas.push({ x:400 + sorte(-6, 6), y:220, vx:sorte(-1, 1) * (estacao === 'cheia' ? 1.6 : 1), vy:sorte(.6, 1.4), t:0, r:sorte(1.2, 2.6) });
    if (gargalo && prog.garg >= 1 && Math.random() < .55) { const q = noPonto('garg', sorte(0, 60)); espumas.push({ x:q.x, y:q.y + sorte(-7, 7), vx:sorte(1.6, 2.6), vy:sorte(-.2, .2), t:0, r:sorte(1.2, 2.4) }); }
    for (let i = cacos.length - 1; i >= 0; i--) { const k = cacos[i]; if (k.y < k.chao) { k.vy += .25; k.x += k.vx; k.y += k.vy; k.a += .2; } else { k.y = k.chao; k.t = (k.t || 0) + 1; if (k.t > 60) { cacos.splice(i, 1); continue; } }
      ctx.save(); ctx.globalAlpha = k.t ? 1 - k.t / 60 : 1; ctx.translate(k.x, k.y); ctx.rotate(k.a); ctx.fillStyle = k.cor; ctx.strokeStyle = '#3E362E'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-k.r, 0); ctx.lineTo(-k.r * .3, -k.r * .9); ctx.lineTo(k.r, -k.r * .4); ctx.lineTo(k.r * .6, k.r * .7); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    for (let i = espumas.length - 1; i >= 0; i--) { const e = espumas[i]; e.t++; e.x += e.vx; e.y += e.vy; if (e.t > 34) { espumas.splice(i, 1); continue; } ctx.globalAlpha = .9 * (1 - e.t / 34); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill(); }
    for (let i = fluxo.length - 1; i >= 0; i--) {
      const p = fluxo[i], L = AM[p.k][AM[p.k].length - 1].L;
      p.d += p.v * (estacao === 'cheia' ? 1.5 : 1) * (p.k.length === 2 ? .7 : 1);
      if (p.k === 'dentro' && estacao === 'cheia' && !p.pulou && p.d >= D_VERTE) { p.pulou = true; if (p.tipo === 'areia' || Math.random() < .4) { p.k = 'verte'; p.d = 0; } }
      if (p.d >= L && !proximo(p)) { fluxo.splice(i, 1); continue; }
      const q = noPonto(p.k, p.d), w = larg(p.k, p.d) * fac[p.k] * .8, ox = -q.ty * p.o * w, oy = q.tx * p.o * w;
      if (p.tipo === 'agua') { ctx.globalAlpha = .75; ctx.strokeStyle = '#F4FCFF'; ctx.lineWidth = p.k.length === 2 ? 1.4 : 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(q.x + ox - q.tx * 4, q.y + oy - q.ty * 4); ctx.lineTo(q.x + ox + q.tx * 4, q.y + oy + q.ty * 4); ctx.stroke(); }
      else { ctx.globalAlpha = .95; ctx.fillStyle = '#B8864A'; ctx.strokeStyle = '#6E4A1E'; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(q.x + ox, q.y + oy + Math.sin(t / 200 + p.f), 2.2, 0, 7); ctx.fill(); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  });
  /* ---------- 1. Gargalo do Jarro: fogo esquenta, água fria racha a rocha ---------- */
  const fogo = el(s, '#du-fogo'), fogoIn = el(s, '.du-fogo-in');
  fogoIn.animate([{ transform:'scale(1,1)' }, { transform:'scale(1.08,.9)' }, { transform:'scale(.94,1.1)' }, { transform:'scale(1,1)' }], { duration:500, iterations:Infinity });
  s.querySelectorAll('.du-tocha').forEach(tc => tc.animate([{ opacity:1 }, { opacity:.7 }, { opacity:1 }], { duration:400, iterations:Infinity }));
  const dicas = () => { const r = fase === 'rocha'; el(s, '#du-trab1-hint').style.display = r && !quente ? '' : 'none'; el(s, '#du-trab2-hint').style.display = r && quente ? '' : 'none'; el(s, '#du-rocha-hint').style.display = 'none'; };
  function acender(){
    if (fase !== 'rocha' || ocupado) return;
    if (quente) { toca('clique'); api.diz('A rocha já está quente! Toque no balde de água fria.'); return; }
    ocupado = true; toca('vapor'); const b = s.querySelectorAll('.du-bloco')[camada], cc = CENTRO[camada];
    fogo.setAttribute('transform', `translate(0 ${cc.y - 384 + 12})`); fogo.style.display = '';
    for (let i = 0; i < 6; i++) c.add({ tipo:'brilho', t:-i * 4, x:cc.x + sorte(-26, 26), y:cc.y + sorte(-10, 6), cor:'#FFB347' });
    depois(500, () => b.querySelector('.du-calor').style.opacity = .85);
    depois(1500, () => { quente = true; ocupado = false; fogo.style.display = 'none'; dicas(); api.diz(camada === 0 ? 'A rocha ficou bem quente! Agora toque no balde e jogue água fria.' : 'Rocha quente! Toque no balde.'); });
  }
  function esfriar(){
    if (fase !== 'rocha' || ocupado) return;
    if (!quente) { toca('clique'); api.diz('Primeiro esquente a rocha: toque no fogo!'); return; }
    ocupado = true; const b = s.querySelectorAll('.du-bloco')[camada], cc = CENTRO[camada];
    el(s, '.du-balde').animate([{ transform:'rotate(0)' }, { transform:'rotate(-50deg)' }, { transform:'rotate(0)' }], { duration:700 });
    toca('splash'); for (let i = 0; i < 18; i++) setTimeout(() => vivo && c.add({ tipo:'chuva', x:604 + sorte(-4, 4), y:304, vx:sorte(-1.4, .2), vy:sorte(3, 5), chao:cc.y + sorte(-4, 6), cor:'#5AB0F0' }), i * 30);
    depois(500, () => { toca('vapor'); for (let i = 0; i < 16; i++) c.add({ tipo:'vapor', x0:cc.x + sorte(-28, 28), y0:cc.y, x1:cc.x + sorte(-40, 40), y1:cc.y - sorte(50, 90), dur:sorte(40, 70), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 }); b.querySelector('.du-calor').style.opacity = 0; b.querySelector('.du-racha').style.opacity = 1; });
    depois(1300, () => { toca('pop'); b.animate([{ transform:'translateY(0)', opacity:1 }, { transform:'translateY(14px)', opacity:0 }], { duration:600, fill:'forwards' });
      for (let i = 0; i < 12; i++) cacos.push({ x:cc.x + sorte(-30, 30), y:cc.y + sorte(-8, 8), vx:sorte(-1.6, 1.6), vy:sorte(-3.4, -.6), chao:cc.y + sorte(16, 34), r:sorte(2, 4.4), a:sorte(0, 6), cor:['#9A8C76', '#B8A88E', '#7A6E5E'][i % 3] });
      camada++; quente = false; api.hud(`<span class="chip">Rocha: ${camada}/3</span>`);
      depois(700, () => { ocupado = false; dicas();
        if (camada === 1) api.diz('Crac! A rocha quente racha com a água fria. Toque no fogo de novo!');
        if (camada === 2) api.diz('As pessoas daqui levaram anos para abrir este caminho na montanha. Toque no fogo!');
        if (camada === 3) { toca('vitoria'); el(s, '#du-rocha').style.pointerEvents = 'none'; gargalo = true; api.diz('Abriu! Este corte na montanha se chama Gargalo do Jarro. Ele é estreito de propósito.'); depois(5000, comecaCestos); } }); });
  }
  el(s, '#du-trab1').addEventListener('click', e => { e.stopPropagation(); if (fase === 'rocha') acender(); else { toca('pop'); api.diz('Fogo para esquentar e água fria para rachar: assim a rocha foi aberta, sem máquinas!'); } });
  el(s, '#du-trab2').addEventListener('click', e => { e.stopPropagation(); if (fase === 'rocha') esfriar(); else { toca('pop'); api.diz(fase === 'fim' ? 'A água do rio rega nossas plantações há muitas gerações!' : 'O rio de dentro vai levar água para a planície!'); } });
  el(s, '#du-rocha').addEventListener('click', e => { e.stopPropagation(); if (quente) esfriar(); else acender(); });
  /* ---------- 2. Cestos de bambu com pedras formam a Boca de Peixe ---------- */
  const pedras = [...s.querySelectorAll('.du-pedra')], pos = PEDRAS.map(p => ({ x:p.x, y:p.y, foi:false }));
  const cheio = [0, 0, 0], pronto = [false, false, false]; let alvoCesto = 0;
  const mao = el(s, '#du-mao');
  function comecaCestos(){
    fase = 'cestos'; dicas(); el(s, '#du-dique-vagas').style.display = ''; mao.style.display = '';
    mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
    s.querySelectorAll('.du-cesto-hint')[0].style.display = '';
    api.hud('<span class="chip">Cestos: 0/3</span>');
    api.diz('Agora vamos dividir o rio. Arraste as pedras para dentro dos cestos de bambu!');
  }
  let arr = null;
  pedras.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (pos[i].foi || ocupado) return; e.stopPropagation();
    if (fase !== 'cestos') { toca('clique'); api.diz(fase === 'rocha' ? 'São pedras redondas do rio. Logo vamos usar!' : 'Pedras redondas do rio.'); return; }
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(16, Math.min(784, p.x - arr.dx)); pos[arr.i].y = Math.max(200, Math.min(494, p.y - arr.dy));
    pedras[arr.i].setAttribute('transform', `translate(${f1(pos[arr.i].x)} ${f1(pos[arr.i].y)})`);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; pedras[i].style.cursor = 'grab';
    let k = -1, dm = 1e9; CESTOS.forEach((b, j) => { const dd = Math.hypot(pos[i].x - b.x, pos[i].y - b.y); if (cheio[j] < 2 && dd < dm) { dm = dd; k = j; } });
    if (!moveu) k = cheio[alvoCesto] < 2 ? alvoCesto : cheio.findIndex(n => n < 2);
    else if (dm > 70) { voa(i, PEDRAS[i].x, PEDRAS[i].y, 600, 1, () => {}); toca('glub'); api.diz('Leve a pedra até um cesto de bambu!'); return; }
    guarda(i, k);
  });
  function voa(i, x1, y1, ms, esc, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50;
      pedras[i].setAttribute('transform', `translate(${f1(pos[i].x)} ${f1(pos[i].y)}) scale(${(1 + (esc - 1) * e).toFixed(2)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function guarda(i, k){
    if (k < 0) return; pos[i].foi = true; cheio[k]++; const b = CESTOS[k];
    voa(i, b.x - 8, b.y - 4, 800, .55, () => {
      pedras[i].style.display = 'none'; toca('pop'); c.brilhos(b.x, b.y - 10, 4, '#FFE27A');
      s.querySelectorAll('.du-cesto')[k].querySelectorAll('.du-cp')[cheio[k] - 1].style.opacity = 1;
      el(s.querySelectorAll('.du-cesto')[k], '.du-cesto-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.08,.92)' }, { transform:'scale(1)' }], { duration:400 });
      if (cheio[k] === 2) rola(k); else api.diz('Mais uma pedra neste cesto!');
    });
  }
  function rola(k){
    s.querySelectorAll('.du-cesto-hint').forEach(h => h.style.display = 'none');
    const n = pronto.filter(Boolean).length; pronto[k] = true; alvoCesto = cheio.findIndex(m => m < 2);
    if (alvoCesto >= 0) s.querySelectorAll('.du-cesto-hint')[alvoCesto].style.display = '';
    const g = s.querySelectorAll('.du-cesto')[k], b = CESTOS[k], v = VAGA[n];
    toca('ok');
    g.style.transformOrigin = `${b.x}px ${b.y}px`; g.style.transformBox = 'view-box';
    const an = g.animate([{ transform:'translate(0,0) rotate(0) scale(1)', opacity:1 }, { transform:`translate(${(v.x - b.x) * .5}px, ${(v.y - b.y) * .5 - 50}px) rotate(${-v.a / 2}deg) scale(.8)`, opacity:1 }, { transform:`translate(${v.x - b.x}px, ${v.y - b.y}px) rotate(${-v.a}deg) scale(.6)`, opacity:0 }], { duration:1300, easing:'ease-in-out', fill:'forwards' });
    an.onfinish = () => { if (!vivo) return; toca('splash');
      s.querySelectorAll('.du-seg')[n].style.opacity = 1; s.querySelectorAll('.du-vaga')[n].style.display = 'none';
      for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:v.x + sorte(-18, 18), y:v.y + sorte(-14, 14), t:i * 2, cor:'#E6F6FF' });
      api.hud(`<span class="chip">Cestos: ${n + 1}/3</span>`);
      if (n === 0) api.diz('Um cesto cheio de pedras é pesado e firme. A água passa entre as pedras sem derrubar o cesto.');
      if (n === 1) api.diz('Os cestos estão formando um dique comprido, com a ponta virada para o rio.');
      if (n === 2) dividir(); };
  }
  function dividir(){
    fase = 'divide'; el(s, '#du-dique-luz').style.opacity = 1; el(s, '#du-boca').style.opacity = 1; el(s, '#du-espuma-ponta').style.opacity = 1; toca('vitoria');
    api.diz('Parece a boca de um peixe! A Boca de Peixe divide o rio em dois: o rio de fora e o rio de dentro.');
    depois(1800, () => { toca('chuva'); interno = true; encher('dentro', 2400); });
    depois(4300, () => { encher('garg', 900); });
    depois(5300, () => { encher('c1', 1600); encher('c2', 1400); encher('c3', 1300); api.diz('A água do rio de dentro passa pelo Gargalo do Jarro e chega aos canais da planície.'); });
    depois(10500, comecaEstacoes);
  }
  /* ---------- 3. Estações: cheia e seca ---------- */
  function comecaEstacoes(){
    fase = 'estacoes'; el(s, '#du-nuvem-hint').style.display = '';
    api.hud('<span class="chip">Estações: 0/2</span>');
    api.diz('Toque na nuvem de chuva para chegar a época das cheias!');
  }
  const conta = () => api.hud(`<span class="chip">Estações: ${(feitas.cheia ? 1 : 0) + (feitas.seca ? 1 : 0)}/2</span>`);
  function cheia(){
    if (ocupado) return; ocupado = true; estacao = 'cheia'; feitas.cheia = true; conta(); el(s, '#du-nuvem-hint').style.display = 'none';
    toca('chuva'); el(s, '#du-nuvem-in').style.transform = 'scale(1.18)'; c.chover(110, 700, 70, 230, 110, '#5A9AE0');
    largura('longe', 1.3, .45); largura('perto', 1.3, .45); largura('fora', 1.3, .5); largura('dentro', 1.1, .25); largura('garg', 1, .15);
    el(s, '#du-verte-agua').style.opacity = 1; el(s, '#du-sol').style.opacity = .55;
    api.diz('Na cheia, o rio fica enorme e cheio de areia. A maior parte da água e quase toda a areia vão pelo rio de fora.');
    depois(5600, () => { el(s, '#du-vila-ok').style.opacity = 1; c.brilhos(740, 270, 6, '#FFE27A'); toca('ok');
      api.diz('A água que sobra no rio de dentro pula pelo vertedouro e volta para o rio de fora. A vila fica segura!'); });
    depois(11000, () => { ocupado = false; el(s, '#du-nuvem-in').style.transform = '';
      if (!feitas.seca) { el(s, '#du-sol-hint').style.display = ''; api.diz('Agora toque no sol para chegar a época seca!'); } else final(); });
  }
  function seca(){
    if (ocupado) return; ocupado = true; estacao = 'seca'; feitas.seca = true; conta(); el(s, '#du-sol-hint').style.display = 'none';
    toca('vapor'); el(s, '#du-sol').style.opacity = 1; el(s, '#du-sol').animate([{ transform:'scale(1)' }, { transform:'scale(1.12)' }, { transform:'scale(1)' }], { duration:900 });
    for (let i = fluxo.length - 1; i >= 0; i--) if (fluxo[i].tipo === 'areia') fluxo.splice(i, 1);
    largura('longe', .75, 0); largura('perto', .75, 0); largura('fora', .6, 0); largura('dentro', 1, 0); largura('garg', 1, 0);
    el(s, '#du-verte-agua').style.opacity = 0; el(s, '#du-vila-ok').style.opacity = 0;
    api.diz('Na seca, o rio fica baixinho. Agora a maior parte da água vai pelo rio de dentro, para as plantações.');
    const campos = [...s.querySelectorAll('.du-arroz')];
    campos.forEach((g, i) => depois(1500 + i * 70, () => g.querySelector('.du-arroz-agua').style.opacity = .95));
    depois(1500 + campos.length * 70 + 600, () => { toca('planta'); campos.forEach((g, i) => depois(i * 60, () => { g.querySelector('.du-arroz-verde').style.opacity = 1; if (i % 4 === 0) c.brilhos(700 + (i * 37) % 100, 330 + (i * 23) % 150, 1, '#FFFFFF'); })); api.diz('Os arrozais se enchem de água e o arroz cresce verdinho!'); });
    depois(9000, () => { ocupado = false; if (!feitas.cheia) { el(s, '#du-nuvem-hint').style.display = ''; api.diz('Agora toque na nuvem para chegar a época das cheias!'); } else final(); });
  }
  function final(){
    if (fase === 'fim') return; fase = 'fim'; toca('vitoria');
    api.diz('Dujiangyan tem mais de 2.200 anos e funciona até hoje! O povo de Sichuan repartiu o rio sem represa, com pedras, bambu e muita sabedoria.');
    depois(6400, api.fim);
  }
  el(s, '#du-nuvem').addEventListener('click', e => { e.stopPropagation();
    if (fase === 'estacoes' || fase === 'fim') { cheia(); return; }
    toca('clique'); api.diz('Lá no alto das montanhas chove e a neve derrete. Toda essa água desce pelo rio Min.'); });
  el(s, '#du-sol').addEventListener('click', e => { e.stopPropagation();
    if (fase === 'estacoes' || fase === 'fim') { seca(); return; }
    toca('ok'); c.brilhos(700, 62, 5, '#FFE27A'); api.diz('Sichuan tem verão de muita chuva e inverno mais seco.'); });
  /* ---------- toques extras ---------- */
  let linOcupada = false;
  el(s, '#du-lin').addEventListener('click', () => { toca('pop');
    if (!linOcupada) { linOcupada = true; el(s, '#du-lin-in').animate([{ transform:'translateY(0) scale(1,1)' }, { transform:'translateY(4px) scale(1.06,.94)' }, { transform:'translateY(-10px) scale(.96,1.04)' }, { transform:'translateY(0) scale(1,1)' }], { duration:800 }); depois(800, () => linOcupada = false); }
    api.diz(fase === 'rocha' ? 'Sou a Lin! Toque no fogo e depois no balde para abrir a rocha.' : fase === 'cestos' ? 'Arraste as pedras para os cestos, pode ser por cima do rio!' : 'Eu passo quase o dia todo comendo bambu. Aqui nas montanhas de Sichuan é a minha casa!'); });
  let pvOcupado = false;
  el(s, '#du-pv').addEventListener('click', () => { if (pvOcupado) return; pvOcupado = true; toca('pop');
    el(s, '#du-pv-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px) rotate(-6deg)' }, { transform:'translateY(0) rotate(4deg)' }, { transform:'translateY(0) rotate(0)' }], { duration:900 });
    api.diz('Um panda-vermelho! Ele é do tamanho de um gato e se enrola na cauda peluda para se esquentar.'); depois(1000, () => pvOcupado = false); });
  el(s, '#du-bambus').addEventListener('click', () => { toca('clique'); [0, 1, 2].forEach(i => c.add({ tipo:'petala', x:20 + i * 16, y:200 + i * 20, vy:sorte(.8, 1.4), f:sorte(0, 6), chao:470, cor:'#8ACB5A', borda:'#3E7A2A' }));
    api.diz('O bambu é a planta que cresce mais rápido no mundo! E dele as pessoas daqui fizeram os cestos do dique.'); });
  el(s, '#du-cesto-fig').addEventListener('click', () => { toca('clique'); api.diz('Um cesto comprido de bambu cheio de pedras. Era assim que se construíam os diques do rio.'); });
  let faiOcupado = false;
  el(s, '#du-faisao').addEventListener('click', e => { e.stopPropagation(); if (faiOcupado) return; faiOcupado = true;
    [1500, 1900, 1700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'square', .03, f * .8), i * 140));
    el(s, '#du-fai-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-16px)' }, { transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:900 });
    api.diz('O faisão-dourado vive nas florestas das montanhas da China. Que penas coloridas!'); depois(1000, () => faiOcupado = false); });
  let bufOcupado = false;
  el(s, '#du-bufalo').addEventListener('click', e => { e.stopPropagation(); if (bufOcupado) return; bufOcupado = true;
    somOn && tom(130, 0, .8, 'sawtooth', .05, 95);
    el(s, '#du-buf-cab').animate([{ transform:'rotate(0)' }, { transform:'rotate(8deg)' }, { transform:'rotate(-4deg)' }, { transform:'rotate(0)' }], { duration:900, easing:'ease-in-out' });
    api.diz('O búfalo-d’água gosta de lama e de água fresquinha, bem perto dos arrozais.'); depois(1000, () => bufOcupado = false); });
  el(s, '#du-buf-cab').style.transformBox = 'fill-box'; el(s, '#du-buf-cab').style.transformOrigin = '0% 30%';
  let biciX = 0, biciOcupada = false;
  el(s, '#du-crianca').addEventListener('click', e => { e.stopPropagation(); if (biciOcupada) return; biciOcupada = true;
    [1800, 2200].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .15, 'sine', .06), i * 160));
    const x0 = biciX, x1 = biciX === 0 ? 76 : 0, t0 = performance.now(), vira = x1 < x0;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1800), e2 = k * k * (3 - 2 * k); biciX = x0 + (x1 - x0) * e2;
      el(s, '#du-bici').setAttribute('transform', `translate(${f1(700 + biciX)} ${f1(336 - biciX * .06)})`); el(s, '#du-bici-in').setAttribute('transform', vira ? 'scale(-1.5 1.5)' : 'scale(1.5)');
      if (k < 1) requestAnimationFrame(q); else biciOcupada = false; })(t0);
    api.diz(fase === 'fim' ? 'A água do rio chega até a nossa vila. Aqui tem arroz, verduras e peixe!' : 'Oi! Eu moro na planície de Chengdu e vou de bicicleta para a escola.'); });
  el(s, '#du-garca').addEventListener('click', e => { e.stopPropagation(); [900, 700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .18, 'triangle', .05, f * .6), i * 200)); api.diz('Garças! Elas procuram peixinhos e sapos nos arrozais.'); });
  el(s, '#du-vila').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Na planície de Chengdu vivem milhões de pessoas. A água delas vem deste rio.'); });
  let peixeOcupado = false;
  el(s, '#du-fora-toque').addEventListener('click', e => { e.stopPropagation(); const p = c.ponto(e); toca('splash');
    for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:i * 3, cor:'#E6F6FF' });
    if (peixeOcupado) return; peixeOcupado = true; const px = el(s, '#du-peixe');
    px.animate([{ transform:`translate(${p.x - 14}px, ${p.y}px) rotate(-60deg)`, opacity:1 }, { transform:`translate(${p.x}px, ${p.y - 34}px) rotate(0deg)`, opacity:1 }, { transform:`translate(${p.x + 14}px, ${p.y}px) rotate(60deg)`, opacity:1 }, { transform:`translate(${p.x + 14}px, ${p.y}px) rotate(60deg)`, opacity:0 }], { duration:900, easing:'ease-in-out' });
    depois(820, () => { for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x + 14, y:p.y, t:i * 3, cor:'#E6F6FF' }); });
    api.diz(fase === 'estacoes' || fase === 'fim' ? 'Uma carpa! O rio não foi fechado por uma represa, então os peixes podem subir e descer o rio.' : 'Uma carpa pulou! O rio Min desce das montanhas bem rápido.'); depois(1000, () => peixeOcupado = false); });
  el(s, '#du-dique').addEventListener('click', e => { if (fase === 'rocha' || fase === 'cestos') return; e.stopPropagation(); toca('clique'); api.diz('A Boca de Peixe! A ponta divide o rio sem fechar o caminho da água.'); });
  el(s, '#du-vertedouro').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Este é o vertedouro: uma parte baixinha do dique, por onde a água que sobra volta para o rio de fora.'); });
  let brotoOcupado = false, mordidas = 0;
  el(s, '#du-brotos').addEventListener('click', e => { e.stopPropagation(); if (brotoOcupado) return; brotoOcupado = true; mordidas++;
    [0, 1, 2].forEach(i => setTimeout(() => { if (!vivo) return; somOn && tom(260 + i * 30, 0, .07, 'square', .04, 180); el(s, '#du-lin-in').animate([{ transform:'scale(1,1)' }, { transform:'scale(1.04,.96)' }, { transform:'scale(1,1)' }], { duration:260 }); c.add({ tipo:'petala', x:150 + sorte(-8, 8), y:396, vy:sorte(.6, 1.2), f:sorte(0, 6), chao:460, cor:'#E6C48A', borda:'#6E4418' }); }, i * 320));
    el(s, '#du-brotos-in').style.transition = 'transform .9s'; el(s, '#du-brotos-in').style.transform = 'scaleY(.35)';
    api.diz(mordidas === 1 ? 'Nhac, nhac! Broto de bambu é macio e gostoso. Uma panda come mais de 12 quilos de bambu por dia!' : 'Nhac! O bambu cresce de novo bem rápido.');
    depois(3600, () => { el(s, '#du-brotos-in').style.transform = ''; brotoOcupado = false; }); });
  let jangOcupada = false;
  el(s, '#du-jangada').addEventListener('click', e => { e.stopPropagation(); if (jangOcupada) return; jangOcupada = true; toca('glub');
    el(s, '#du-vara').animate([{ transform:'rotate(0)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 });
    el(s, '#du-jang-pos').animate([{ transform:'translate(0,0)' }, { transform:'translate(-6px,46px)' }, { transform:'translate(0,0)' }], { duration:3600, easing:'ease-in-out' });
    [0, 900, 1800].forEach(ms => depois(ms, () => { for (let i = 0; i < 2; i++) c.add({ tipo:'respingo', x:338 + sorte(-6, 6), y:362 + ms / 40, t:i * 3, cor:'#E6F6FF' }); }));
    api.diz('Uma jangada de bambu! O pescador empurra a vara no fundo do rio para ela andar.'); depois(3700, () => jangOcupada = false); });
  let brumaOcupada = false;
  el(s, '#du-serra').addEventListener('click', e => { e.stopPropagation(); if (brumaOcupada) return; brumaOcupada = true; toca('vapor');
    for (let i = 0; i < 26; i++) { const y = sorte(150, 196), x0 = sorte(-40, 300); c.add({ tipo:'vapor', x0, y0:y, x1:x0 + sorte(300, 460), y1:y + sorte(-8, 8), dur:sorte(140, 200), f:sorte(0, 6), r:sorte(6, 11), x:0, y:0 }); }
    api.diz('As montanhas de Sichuan vivem cobertas de neblina. O ar daqui é úmido e chove bastante no verão.'); depois(3200, () => brumaOcupada = false); });
  /* início */
  dicas(); api.hud('<span class="chip">Rocha: 0/3</span>');
  api.diz('Oi, eu sou a Lin, uma panda-gigante! Há mais de 2.200 anos, o povo daqui abriu a montanha para a água passar. Toque no fogo para esquentar a rocha!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
