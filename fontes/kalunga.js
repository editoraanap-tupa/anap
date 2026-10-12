/* ================= JOGO: Kalunga, quilombo das águas (Goiás) ================= */
function jogoKalunga(palco, api){
  semente = 211;
  const F = n => (+n).toFixed(1);
  let vivo = true, fase = 'trilha', ocupado = false, camX = -800;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const lg = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const rg = (id, a, b, c, cx = .38, cy = .32) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r=".75"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
  /* ---------- pele, roupas ---------- */
  const PELE = {
    a:{ c:'#6E4028', l:'#8E5A3A', e:'#2E160A', g:'kaPeleA' }, b:{ c:'#94603C', l:'#B27C52', e:'#45240E', g:'kaPeleB' },
    c:{ c:'#C88E62', l:'#E2AE84', e:'#6A3E20', g:'kaPeleC' }, d:{ c:'#EDC2A0', l:'#FFDCC2', e:'#94644A', g:'kaPeleD' }
  };
  /* ---------- desenhos ---------- */
  const tufo = (x, y, h, c, esc, n = 5) => { const d = Array.from({ length:n }, (_, i) => { const dx = (i - (n - 1) / 2) * 2.4, L = h * R(.7, 1.1); return `M${F(x + dx)} ${y} q${F(R(-3, 3))} ${F(-L * .5)} ${F(dx * 1.6 + R(-4, 4))} ${F(-L)}`; }).join(' '); return `<path d="${d}" stroke="${esc}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; };
  const capinzal = (x0, x1, y0, y1, n, c, esc, h) => Array.from({ length:n }, () => tufo(R(x0, x1), F(R(y0, y1)), h * R(.7, 1.2), c, esc, 4 + Math.floor(R(0, 3)))).join('');
  /* árvore do cerrado: tronco torto e casca grossa, copa em tufos */
  const arvore = (x, y, h, w, cop, esc, luz, tronco = '#6E4E34', flores) => {
    const t1 = `M${F(x - 2)} ${y} C${F(x - 6)} ${F(y - h * .16)} ${F(x + 6)} ${F(y - h * .3)} ${F(x + 1)} ${F(y - h * .48)}`;
    const t2 = `M${F(x + 1)} ${F(y - h * .44)} C${F(x + 9)} ${F(y - h * .5)} ${F(x + w * .24)} ${F(y - h * .52)} ${F(x + w * .3)} ${F(y - h * .66)}`;
    const t3 = `M${F(x)} ${F(y - h * .38)} C${F(x - 8)} ${F(y - h * .46)} ${F(x - w * .24)} ${F(y - h * .52)} ${F(x - w * .3)} ${F(y - h * .68)}`;
    const t4 = `M${F(x + 1)} ${F(y - h * .46)} C${F(x + 2)} ${F(y - h * .6)} ${F(x - 3)} ${F(y - h * .7)} ${F(x + 2)} ${F(y - h * .8)}`;
    const tw = Math.max(2.6, w * .12), t = [t1, t2, t3, t4].join(' ');
    const n = 4 + Math.floor(R(0, 3)), tufos = [];
    for (let i = 0; i < n; i++) { const a = -Math.PI * (.12 + .76 * i / (n - 1)) + R(-.15, .15); tufos.push([Math.cos(a) * R(.22, .34), .72 + Math.max(0, -Math.sin(a) - .5) * .28 + R(-.04, .04), R(.2, .3), R(.11, .16)]); }
    tufos.push([R(-.06, .06), .9, R(.28, .36), R(.14, .18)]);
    let fl = '', fo = '';
    if (flores) for (let i = 0; i < 30; i++) { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)), tf = tufos[i % tufos.length]; fl += `<circle cx="${F(x + tf[0] * w + Math.cos(a) * r * tf[2] * w * .9)}" cy="${F(y - tf[1] * h + Math.sin(a) * r * tf[3] * h * .8)}" r="${F(R(1.6, 3))}" fill="${flores}" stroke="#A8780A" stroke-width=".4"/>`; }
    tufos.forEach(([dx, dy, rx, ry]) => { for (let k = 0; k < 4; k++) { const fx = x + dx * w + R(-rx, rx) * w * .6, fy = y - dy * h + R(-ry, ry) * h * .5; fo += `M${F(fx)} ${F(fy)} q2 -2.4 4 0 `; } });
    return `<g><ellipse cx="${F(x + w * .1)}" cy="${F(y + 1)}" rx="${F(w * .42)}" ry="${F(Math.max(2, w * .06))}" fill="#2A1A08" opacity=".2"/>
      <path d="${t}" stroke="#2E1E12" stroke-width="${F(tw + 2.6)}" fill="none" stroke-linecap="round"/><path d="${t}" stroke="${tronco}" stroke-width="${F(tw)}" fill="none" stroke-linecap="round"/>
      <path d="${t1}" stroke="#3A2618" stroke-width="${F(tw * .55)}" fill="none" stroke-dasharray="1.6 3.2" opacity=".75"/><path d="${t1}" stroke="#C8A27A" stroke-width="${F(tw * .25)}" fill="none" stroke-dasharray="2 5" opacity=".55" transform="translate(-${F(tw * .25)} 0)"/>
      ${tufos.map(([dx, dy, rx, ry]) => `<path d="${copa(x + dx * w + 2, y - dy * h + 3, rx * w, ry * h, 9, .3)}" fill="#1A2A0E" opacity=".22"/>`).join('')}
      ${tufos.map(([dx, dy, rx, ry]) => `<path d="${copa(x + dx * w, y - dy * h, rx * w, ry * h, 8 + Math.floor(R(0, 4)), R(.26, .4))}" fill="${cop}" stroke="${esc}" stroke-width="1.4" stroke-linejoin="round"/>`).join('')}
      <path d="${fo}" stroke="${esc}" stroke-width=".9" fill="none" opacity=".45"/>
      ${tufos.map(([dx, dy, rx, ry]) => `<path d="M${F(x + dx * w - rx * w * .6)} ${F(y - dy * h - ry * h * .2)} q${F(rx * w * .5)} ${F(-ry * h * .8)} ${F(rx * w * 1.1)} ${F(-ry * h * .5)}" stroke="${luz}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}
      ${fl}</g>`;
  };
  const canela = (x, y, h, k = 1) => `<g><path d="M${x} ${y} C${x - 2} ${y - h * .4} ${x + 3} ${y - h * .7} ${x + 1} ${y - h}" stroke="#2A2620" stroke-width="${F(5 * k)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x - 2} ${y - h * .4} ${x + 3} ${y - h * .7} ${x + 1} ${y - h}" stroke="#5E5448" stroke-width="${F(3 * k)}" fill="none" stroke-linecap="round" stroke-dasharray="2 2"/>
    <g class="balanca" style="animation-duration:${F(R(4, 6))}s;transform-origin:${x + 1}px ${y - h}px">${Array.from({ length:11 }, (_, i) => { const a = (-170 + i * 16) * Math.PI / 180, L = h * R(.32, .46); return `<path d="M${x + 1} ${F(y - h)} Q${F(x + 1 + Math.cos(a) * L * .5)} ${F(y - h + Math.sin(a) * L * .6 - 3)} ${F(x + 1 + Math.cos(a) * L)} ${F(y - h + Math.sin(a) * L * .5 + L * .25)}" stroke="#2E5A3A" stroke-width="${F(2.6 * k)}" fill="none" stroke-linecap="round"/><path d="M${x + 1} ${F(y - h)} Q${F(x + 1 + Math.cos(a) * L * .5)} ${F(y - h + Math.sin(a) * L * .6 - 3)} ${F(x + 1 + Math.cos(a) * L)} ${F(y - h + Math.sin(a) * L * .5 + L * .25)}" stroke="#8AC8A0" stroke-width="${F(1.2 * k)}" fill="none" stroke-linecap="round"/>`; }).join('')}
    ${[0, 1, 2, 3, 4, 5].map(i => { const a = i * 1.047; return `<path d="M${x + 1} ${F(y - h - 4)} l${F(Math.cos(a) * 6 * k)} ${F(Math.sin(a) * 6 * k - 3)} l${F(Math.cos(a + .5) * -3 * k)} ${F(Math.sin(a + .5) * 3 * k)}Z" fill="#B87AE0" stroke="#5E2A8A" stroke-width=".6"/>`; }).join('')}<circle cx="${x + 1}" cy="${F(y - h - 5)}" r="${F(1.8 * k)}" fill="#FFE27A"/></g></g>`;
  const pedra = (x, y, rx, ry, cor = '#A89A8A', esc = '#4E443A') => `<ellipse cx="${F(x + 2)}" cy="${F(y + ry * .6)}" rx="${F(rx * 1.05)}" ry="${F(ry * .45)}" fill="#2A1A08" opacity=".22"/><path d="${copa(x, y, rx, ry, 6, .14)}" fill="${cor}" stroke="${esc}" stroke-width="1.2"/><path d="M${F(x - rx * .5)} ${F(y - ry * .3)} q${F(rx * .3)} ${F(-ry * .5)} ${F(rx * .8)} ${F(-ry * .3)}" stroke="#FFF4E2" stroke-width="1.2" fill="none" opacity=".6" stroke-linecap="round"/>`;
  const cupinzinho = (x, y, h) => `<ellipse cx="${x + 3}" cy="${y + 1}" rx="${F(h * .5)}" ry="${F(h * .1)}" fill="#2A1A08" opacity=".22"/><path d="M${F(x - h * .42)} ${y} C${F(x - h * .3)} ${F(y - h * .6)} ${F(x - h * .16)} ${F(y - h)} ${x} ${F(y - h)} C${F(x + h * .16)} ${F(y - h)} ${F(x + h * .3)} ${F(y - h * .6)} ${F(x + h * .42)} ${y}Z" fill="url(#kaCupim)" stroke="#5E3420" stroke-width="1.3"/><path d="M${F(x - h * .2)} ${F(y - h * .6)} q${F(h * .1)} ${F(-h * .2)} ${F(h * .2)} ${F(-h * .28)}" stroke="#F2C8A0" stroke-width="1.2" fill="none" opacity=".7"/>`;
  /* buriti da vereda (só cenário) */
  const buriti = (x, y, h, k = 1) => {
    const tx = x + 4, ty = y - h;
    let fol = '', sec = '';
    for (let i = 0; i < 8; i++) {
      const a = (-165 + i * 21) * Math.PI / 180, L = h * .42 * k, cx = tx + Math.cos(a) * L * .45, cy = ty + Math.sin(a) * L * .45;
      let leque = `M${F(cx)} ${F(cy)}`;
      for (let j = 0; j <= 8; j++) { const b = a - .42 + j * .105, r = L * (j % 2 ? .78 : .92); leque += ` L${F(cx + Math.cos(b) * r * .62)} ${F(cy + Math.sin(b) * r * .62 + r * .1)}`; }
      fol += `<path d="M${F(tx)} ${F(ty)} L${F(cx)} ${F(cy)}" stroke="#5E6A2A" stroke-width="1.6"/><path d="${leque}Z" fill="url(#kaPalmeira)" stroke="#2E5A22" stroke-width="1" stroke-linejoin="round"/>`;
    }
    for (let i = 0; i < 4; i++) { const xx = tx - 8 + i * 5; sec += `<path d="M${F(xx)} ${F(ty + 2)} C${F(xx - 2)} ${F(ty + 12)} ${F(xx + 1)} ${F(ty + 20)} ${F(xx - 3)} ${F(ty + 26 + i * 2)}" stroke="#8A6A3A" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
    return `<g><path d="M${x} ${y} C${x + 1} ${F(y - h * .4)} ${x + 4} ${F(y - h * .7)} ${tx} ${ty}" stroke="#4A3A28" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x + 1} ${F(y - h * .4)} ${x + 4} ${F(y - h * .7)} ${tx} ${ty}" stroke="#8E7A5E" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path d="${Array.from({ length:Math.floor(h / 8) }, (_, i) => `M${F(x + i * 4 / (h / 8) - 2)} ${F(y - 6 - i * 8)} h5`).join(' ')}" stroke="#5E4A34" stroke-width="1" opacity=".7"/>${sec}<g class="balanca" style="animation-duration:${F(R(5, 7))}s;transform-origin:${tx}px ${ty}px">${fol}</g></g>`;
  };
  const samambaia = (x, y, h, cor, esc) => { let d = ''; [-1, 1].forEach(l => [.5, .8, 1].forEach(k => { const ex = x + l * h * .7 * k, ey = y - h * k; d += `M${x} ${y} Q${F(x + l * h * .2)} ${F(ey + h * .1)} ${F(ex)} ${F(ey)} `; })); return `<path d="${d}" stroke="${esc}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="2 1.2"/>`; };
  /* pessoas: pés em (0,0), cabeça em (0,-64) */
  const pessoa = o => {
    const P = PELE[o.pele], k = o.k || 1, cab = o.cabCor || '#1E120C', B = o.blusa, pc = o.baixoCor || ['#34507E', '#1C2E50'], sap = o.sapato || '#3A2A20';
    const BR = { baixo:['M10 -48 C13 -42 14 -36 13.4 -29', 13.4, -27.4], aceno:['M10 -48 C16 -54 19 -60 20 -66', 20.4, -68], aponta:['M10 -48 C16 -48 21 -50 26 -53', 27.6, -53.6],
      segura:['M10 -48 C14 -42 18 -40 22 -42', 23.4, -42.4], pilao:['M10 -48 C15 -45 16 -43 15 -40', 15.4, -39], enxada:['M10 -48 C14 -44 15 -40 13 -36', 12.6, -34.6] };
    const BT = { pilao:['M-10 -48 C-4 -52 6 -55 13.5 -56', 14.6, -56.4], enxada:['M-10 -48 C-2 -50 8 -54 16 -56', 17, -56.6] };
    const fa = BR[o.braco || 'baixo'], ta = BT[o.braco] || ['M-10 -48 C-13 -42 -14 -36 -13.4 -29', -13.4, -27.4];
    const braco = (a, cls) => `<g${cls ? ` class="${cls}" style="transform-origin:${a === fa ? 10 : -10}px -48px"` : ''}><path d="${a[0]}" stroke="${P.e}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${a[0]}" stroke="${P.c}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="${a[0]}" stroke="${B.e}" stroke-width="7.4" fill="none" stroke-dasharray="7 200"/><path d="${a[0]}" stroke="${B.c}" stroke-width="5.6" fill="none" stroke-dasharray="6.4 200"/><circle cx="${a[1]}" cy="${a[2]}" r="2.9" fill="${P.c}" stroke="${P.e}" stroke-width=".9"/>${a === fa && o.celular ? `<g transform="translate(${a[1] + 1} ${a[2] - 5}) rotate(12)"><rect x="-2.6" y="-4" width="5.2" height="8.6" rx="1.2" fill="#22263A" stroke="#0A0C14" stroke-width=".8"/><rect x="-1.8" y="-3" width="3.6" height="6" rx=".6" fill="#7AD0FF"/><path d="M-1.2 -2.4 l2 1.6" stroke="#fff" stroke-width=".7" opacity=".8"/></g>` : ''}</g>`;
    let s = `<ellipse cx="0" cy="1" rx="15" ry="2.8" fill="#1A1208" opacity=".22"/>`;
    /* mochila atrás */
    if (o.mochila) s += `<rect x="-18" y="-50" width="10" height="22" rx="3.4" fill="${o.mochila[0]}" stroke="${o.mochila[1]}" stroke-width="1.2"/><rect x="-19" y="-40" width="5" height="9" rx="2" fill="${o.mochila[1]}" opacity=".6"/><path d="M-16 -47 v14" stroke="#fff" stroke-width="1.2" opacity=".35" stroke-linecap="round"/>`;
    /* cabelo de trás */
    if (o.cab === 'trancas') s += `<g stroke-linecap="round" fill="none">${[[-8.6, -64, -11, -38], [-6, -64, -8, -36], [-3.6, -66, -4.6, -40], [6.4, -64, 8.6, -40], [8.8, -63, 11, -42]].map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} Q${F((x0 + x1) / 2 - 1.6)} ${F((y0 + y1) / 2)} ${x1} ${y1}" stroke="${cab}" stroke-width="3.2"/><path d="M${x0} ${y0} Q${F((x0 + x1) / 2 - 1.6)} ${F((y0 + y1) / 2)} ${x1} ${y1}" stroke="#5A3A2A" stroke-width="1.4" stroke-dasharray="1.4 1.6"/><circle cx="${x1}" cy="${y1 + 1}" r="1.3" fill="#E8B83A" stroke="#8A6A1A" stroke-width=".5"/>`).join('')}</g>`;
    if (o.cab === 'cacho') s += `<path d="${copa(0, -69, 12.8, 11.6, 13, .22)}" fill="${cab}" stroke="#120806" stroke-width="1"/>`;
    if (o.cab === 'liso') s += `<path d="M-9.4 -67 C-12.6 -56 -12 -46 -10.4 -41 C-4 -39.4 4 -39.4 10.4 -41 C12 -46 12.6 -56 9.4 -67Z" fill="${cab}" stroke="#4A2A14" stroke-width="1"/>`;
    if (o.cab === 'coque') s += `<circle cx="-4" cy="-74.4" r="4.6" fill="${cab}" stroke="#6E6A66" stroke-width="1"/>`;
    s += braco(ta);
    /* pernas */
    if (o.baixo === 'saia') s += `<path d="M-5 -2 V-16 M5 -2 V-16" stroke="${P.e}" stroke-width="5.8" stroke-linecap="round"/><path d="M-5 -2 V-16 M5 -2 V-16" stroke="${P.c}" stroke-width="4" stroke-linecap="round"/><path d="M-11 -30 L-14.6 -11 C-6 -8.6 6 -8.6 14.6 -11 L11 -30Z" fill="${pc[0]}" stroke="${pc[1]}" stroke-width="1.2" stroke-linejoin="round"/><g fill="${pc[2] || '#fff'}" opacity=".75">${[[-8, -14], [-2, -19], [5, -14], [9, -21], [-6, -24], [2, -27], [-10, -19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g><path d="M-14 -11.6 C-6 -9.4 6 -9.4 14 -11.6" stroke="${pc[1]}" stroke-width="1.6" fill="none"/>`;
    else if (o.baixo === 'bermuda') s += `<path d="M-5 -2 V-18 M5 -2 V-18" stroke="${P.e}" stroke-width="5.8" stroke-linecap="round"/><path d="M-5 -2 V-18 M5 -2 V-18" stroke="${P.c}" stroke-width="4" stroke-linecap="round"/><path d="M-11 -31 L-12 -15.6 H-1.2 L0 -24 L1.2 -15.6 H12 L11 -31Z" fill="${pc[0]}" stroke="${pc[1]}" stroke-width="1.2" stroke-linejoin="round"/><path d="M-9 -27 v8" stroke="#fff" stroke-width="1" opacity=".3"/>`;
    else s += `<path d="M-5 -2 V-29 M5 -2 V-29" stroke="${pc[1]}" stroke-width="6.6" stroke-linecap="round"/><path d="M-5 -2 V-29 M5 -2 V-29" stroke="${pc[0]}" stroke-width="4.8" stroke-linecap="round"/><path d="M-6.4 -26 V-6" stroke="#fff" stroke-width=".9" opacity=".3"/>${o.bolso ? `<rect x="5" y="-20" width="4.4" height="5" rx="1" fill="${pc[1]}" opacity=".6"/>` : ''}`;
    s += `<path d="M-10 0 h7.4 M2.6 0 h7.8" stroke="${sap}" stroke-width="4" stroke-linecap="round"/><path d="M-9.4 -1 h5 M3.2 -1 h5" stroke="#fff" stroke-width=".8" opacity=".35" stroke-linecap="round"/>`;
    /* tronco */
    s += `<path d="M-11 -50 C-12.6 -44 -12.4 -36 -11.4 -28 H11.4 C12.4 -36 12.6 -44 11 -50 C6 -53.4 -6 -53.4 -11 -50Z" fill="url(#${B.g})" stroke="${B.e}" stroke-width="1.4" stroke-linejoin="round"/>`;
    s += `<path d="M-8 -47 C-9 -42 -9 -36 -8 -31" stroke="#fff" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round"/><path d="M-4 -51.6 C-2 -48 2 -48 4 -51.6" stroke="${B.e}" stroke-width="1" fill="none"/>`;
    if (o.estampa) s += o.estampa;
    if (o.baixo !== 'saia') s += `<path d="M-11.2 -29 H11.2" stroke="${pc[1]}" stroke-width="2.2"/>`;
    if (o.cracha) s += `<path d="M-4.4 -51 L-1 -41 M4.4 -51 L1 -41" stroke="#E8452E" stroke-width="1.1"/><rect x="-3.2" y="-41.4" width="6.4" height="8" rx="1" fill="#FFFFFF" stroke="#5A6070" stroke-width=".8"/><rect x="-3.2" y="-41.4" width="6.4" height="2.4" fill="#2E9A6A"/><circle cx="0" cy="-35.6" r="1.6" fill="#C8A47A"/>`;
    if (o.pochete) s += `<path d="M-11 -31.6 C-4 -29 4 -29 11 -31.6" stroke="#2A2A2A" stroke-width="1.4" fill="none"/><rect x="-1" y="-33.4" width="11" height="6.6" rx="2.6" fill="${o.pochete}" stroke="#1E1E1E" stroke-width="1"/><path d="M0 -30 h9" stroke="#fff" stroke-width=".7" opacity=".5"/>`;
    if (o.mochila) s += `<path d="M-9 -50.4 C-6 -44 -6 -38 -8.6 -31" stroke="${o.mochila[1]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    s += braco(fa, o.bracoCls);
    /* cabeça */
    let h = `<path d="M-3 -51 v-5.4 h6 v5.4Z" fill="${P.c}" stroke="${P.e}" stroke-width=".6"/>`;
    h += `<ellipse cx="-8.1" cy="-63" rx="1.7" ry="2.5" fill="${P.c}" stroke="${P.e}" stroke-width=".8"/><ellipse cx="8.1" cy="-63" rx="1.7" ry="2.5" fill="${P.c}" stroke="${P.e}" stroke-width=".8"/>`;
    h += `<ellipse cx="0" cy="-64" rx="8.4" ry="9.2" fill="url(#${P.g})" stroke="${P.e}" stroke-width="1.3"/>`;
    if (o.brinco) h += `<circle cx="-8.2" cy="-59.6" r="1.1" fill="#F2C23A" stroke="#8A6A0A" stroke-width=".4"/><circle cx="8.2" cy="-59.6" r="1.1" fill="#F2C23A" stroke="#8A6A0A" stroke-width=".4"/>`;
    /* cabelo da frente */
    const capC = { trancas:'M-9 -62 C-10.4 -74 10.4 -75 9.2 -62 C8 -68 3 -70.4 -1 -69.4 C-5 -70 -8 -67 -9 -62Z', cacho:'M-8.8 -63 C-9.4 -73.4 9.4 -73.4 8.8 -63 C6 -67.4 -6 -67.4 -8.8 -63Z', curto:'M-8.8 -62 C-10 -74.6 10 -74.6 8.8 -62 C7.4 -67.6 -7.4 -67.6 -8.8 -62Z', coque:'M-8.8 -62 C-10 -74 10 -74 8.8 -62 C6 -68 -6 -68.6 -8.8 -62Z', liso:'M-9 -61 C-10.6 -75 10.6 -75 9 -61 C7 -67 1 -69.4 -3 -68 C-6 -67 -8 -64 -9 -61Z' };
    if (capC[o.cab]) h += `<path d="${capC[o.cab]}" fill="${cab}" stroke="${o.cab === 'coque' ? '#6E6A66' : '#120806'}" stroke-width="1"/>`;
    if (o.cab === 'trancas') h += `<path d="M-1 -69.4 C-3 -71 -5 -71 -7 -68.6 M-1 -69.4 C2 -71.4 5 -71 7.4 -68" stroke="#5A3A2A" stroke-width=".8" fill="none"/>`;
    if (o.cab === 'cacho') h += `<g fill="none" stroke="#4A2A1A" stroke-width=".8" opacity=".8">${[[-8, -74], [-3, -78], [3, -78], [8, -74], [-11, -68], [11, -68]].map(([x, y]) => `<path d="M${x} ${y} a1.6 1.6 0 1 1 1.6 1.6"/>`).join('')}</g>`;
    if (o.cab === 'curto') h += `<g fill="#3A2418" opacity=".55">${[[-5, -70], [-1, -71.4], [3, -70.6], [6, -68], [-7, -66.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8"/>`).join('')}</g>`;
    if (o.cab === 'coque') h += `<path d="M-6 -70 q4 -3 9 -1.4" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/>`;
    if (o.cab === 'liso') h += `<path d="M-2 -70 q4 -2.4 7 0" stroke="#C88A5A" stroke-width="1" fill="none" opacity=".8"/>`;
    /* rosto */
    h += `<path d="M-5.6 -68 q2 -1.3 4 -.2 M1.8 -68.2 q2 -1.1 4 .2" stroke="#1A0E0A" stroke-width=".95" fill="none" stroke-linecap="round"/>`;
    h += `<ellipse cx="-3.3" cy="-64.6" rx="1.35" ry="1.7" fill="#1A0E0A"/><ellipse cx="3.5" cy="-64.6" rx="1.35" ry="1.7" fill="#1A0E0A"/><circle cx="-2.9" cy="-65.3" r=".55" fill="#fff"/><circle cx="3.9" cy="-65.3" r=".55" fill="#fff"/>`;
    if (o.oculos) h += `<g fill="none" stroke="#2A2A3A" stroke-width=".9"><circle cx="-3.3" cy="-64.6" r="2.8"/><circle cx="3.5" cy="-64.6" r="2.8"/><path d="M-.5 -64.8 h1.2"/></g>`;
    h += `<path d="M.2 -63.2 q1 1.6 -.2 2.5" stroke="${P.e}" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
    h += `<path d="M-3 -59.6 C-1.6 -57.4 1.8 -57.4 3.2 -59.6" fill="#fff" stroke="#5A1E10" stroke-width=".9" stroke-linecap="round"/>`;
    h += `<ellipse cx="-5.4" cy="-61" rx="1.9" ry="1.1" fill="#E0705A" opacity=".45"/><ellipse cx="5.6" cy="-61" rx="1.9" ry="1.1" fill="#E0705A" opacity=".45"/>`;
    if (o.rugas) h += `<path d="M-7 -66.6 l-1.6 -.6 M7.4 -66.6 l1.6 -.6 M-4.6 -57.6 q-1 1 -1.6 .4 M4.8 -57.6 q1 1 1.6 .4" stroke="${P.e}" stroke-width=".6" fill="none" opacity=".7"/>`;
    /* chapéus */
    if (o.chapeu === 'bone') h += `<path d="M-9.4 -67 C-9.6 -78.6 9.6 -78.6 9.4 -67Z" fill="${o.chapCor[0]}" stroke="${o.chapCor[1]}" stroke-width="1.1"/><path d="M7.6 -68.2 h9.4 c1.4 0 1.4 2.6 0 2.8 h-9.4Z" fill="${o.chapCor[1]}" stroke="${o.chapCor[1]}" stroke-width=".8"/><path d="M-5 -74 q4 -2.6 9 -1" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5"/><circle cx="0" cy="-77.4" r="1" fill="${o.chapCor[1]}"/><path d="M-2 -71.6 h6" stroke="#FFE27A" stroke-width="1.6" stroke-linecap="round"/>`;
    if (o.chapeu === 'palha') h += `<path d="M-19 -69 C-12 -73 12 -73 19 -69 C13 -65.6 -13 -65.6 -19 -69Z" fill="url(#kaPalha)" stroke="#8A6A2A" stroke-width="1.1"/><path d="M-8 -70.4 C-8 -80.6 8 -80.6 8 -70.4Z" fill="url(#kaPalha)" stroke="#8A6A2A" stroke-width="1.1"/><path d="M-8 -72 h16" stroke="#7A3A1E" stroke-width="1.8"/><g stroke="#B08A3A" stroke-width=".5" fill="none" opacity=".8"><path d="M-15 -70.4 l3 1.8 M-11 -71.4 l3 2 M11 -71.4 l-3 2 M15 -70.4 l-3 1.8 M-6 -75.4 h12 M-6.6 -77.6 h13"/></g>`;
    if (o.chapeu === 'sol') h += `<path d="M-17 -67 C-12 -72.6 12 -72.6 17 -67 C13 -64.4 -13 -64.4 -17 -67Z" fill="${o.chapCor[0]}" stroke="${o.chapCor[1]}" stroke-width="1.1"/><path d="M-8.4 -68.6 C-8.6 -78.6 8.6 -78.6 8.4 -68.6Z" fill="${o.chapCor[0]}" stroke="${o.chapCor[1]}" stroke-width="1.1"/><path d="M-8.4 -70 h16.8" stroke="${o.chapCor[2]}" stroke-width="2"/><path d="M-4 -75.4 q3 -2 7 -1.2" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/>`;
    if (o.lenco) h += `<path d="M-9.4 -66 C-10 -77 10 -77 9.4 -66 C6 -69.6 -6 -69.6 -9.4 -66Z" fill="${o.lenco[0]}" stroke="${o.lenco[1]}" stroke-width="1"/><g fill="${o.lenco[2]}">${[[-5, -72], [0, -74], [5, -72], [-2, -70], [3, -70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g><path d="M8.4 -67 l4 3 l-1.4 -4.4Z" fill="${o.lenco[0]}" stroke="${o.lenco[1]}" stroke-width=".8"/>`;
    s += o.crianca ? `<g transform="translate(0 -51) scale(1.16) translate(0 51)">${h}</g>` : h;
    if (o.frente) s += o.frente;
    return `<g transform="translate(${F(o.x)} ${F(o.y)}) scale(${o.flip ? -k : k} ${k})">${s}</g>`;
  };
  /* casa de adobe com telhado de palha */
  const casaAdobe = (x, y, w, h, porta) => {
    const topo = y - h, cum = topo - h * .78;
    let tij = '';
    for (let r = 0; r < Math.floor(h / 8); r++) { const yy = y - 4 - r * 8; for (let c = 0; c < w / 16; c++) { const xx = x + 2 + c * 16 + (r % 2) * 8; if (xx + 12 < x + w) tij += `<rect x="${F(xx)}" y="${F(yy - 6)}" width="13" height="6" rx="1.4"/>`; } }
    let palha = '';
    for (let i = 0; i < 38; i++) { const t = i / 37, bx = x - 16 + t * (w + 32), tx2 = x + w / 2 + (bx - x - w / 2) * .12; palha += `M${F(tx2)} ${F(cum + 4)} L${F(bx + R(-2, 2))} ${F(topo + 6 + R(-2, 3))} `; }
    return `<g>
      <path d="M${x - 4} ${y + 2} H${x + w + 4}" stroke="#5E3A1E" stroke-width="4" stroke-linecap="round" opacity=".35"/>
      <rect x="${x}" y="${topo}" width="${w}" height="${h}" fill="url(#kaAdobe)" stroke="#5E321A" stroke-width="2"/>
      <g fill="#E2A878" stroke="#9A5A34" stroke-width=".7" opacity=".5">${tij}</g>
      <path d="M${x + 10} ${topo + 14} q${w * .2} -4 ${w * .34} 3 q-6 10 -${w * .3} 8Z" fill="#EAC09A" opacity=".4"/>
      <rect x="${x}" y="${topo}" width="${w}" height="12" fill="#3A1E0E" opacity=".28"/>
      ${porta ? `<rect x="${x + w * .58}" y="${y - h * .72}" width="${w * .2}" height="${h * .72}" fill="url(#kaMadeira)" stroke="#3A2010" stroke-width="1.6"/><path d="M${F(x + w * .64)} ${F(y - h * .7)} V${y} M${F(x + w * .71)} ${F(y - h * .7)} V${y}" stroke="#4A2A14" stroke-width=".9" opacity=".7"/><circle cx="${F(x + w * .75)}" cy="${F(y - h * .36)}" r="1.4" fill="#2A1A0A"/>` : ''}
      <rect x="${x + w * .14}" y="${y - h * .66}" width="${w * .24}" height="${h * .3}" fill="#3A2416" stroke="#3A2010" stroke-width="1.6"/>
      <path d="M${F(x + w * .14)} ${F(y - h * .66)} l-${F(w * .1)} 3 v${F(h * .3 - 2)} l${F(w * .1)} -3Z" fill="url(#kaMadeira)" stroke="#3A2010" stroke-width="1.2"/>
      <path d="M${F(x + w * .38)} ${F(y - h * .66)} l${F(w * .1)} 3 v${F(h * .3 - 2)} l-${F(w * .1)} -3Z" fill="url(#kaMadeira)" stroke="#3A2010" stroke-width="1.2"/>
      <path d="M${x + w * .14} ${F(y - h * .36)} h${F(w * .24)}" stroke="#7A4A2A" stroke-width="2.4"/>
      <path d="M${x - 16} ${topo + 6} L${x + w / 2} ${F(cum)} L${x + w + 16} ${topo + 6} Q${x + w / 2} ${topo + 12} ${x - 16} ${topo + 6}Z" fill="url(#kaPalha)" stroke="#7A5A1E" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="${palha}" stroke="#A8822E" stroke-width=".9" opacity=".75"/>
      <path d="M${x - 16} ${topo + 6} ${Array.from({ length:Math.round((w + 32) / 6) }, () => `l3 ${F(R(2, 5))} l3 ${F(-R(2, 5))}`).join(' ')}" stroke="#8A6A22" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
      <path d="M${F(x + w / 2 - 12)} ${F(cum + 8)} L${x + w / 2} ${F(cum)} L${F(x + w / 2 + 12)} ${F(cum + 8)}" stroke="#6E4E1A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M${F(x - 6)} ${topo + 2} L${F(x + w / 2 - 6)} ${F(cum + 6)}" stroke="#FFF0B0" stroke-width="2" opacity=".55" stroke-linecap="round"/>
    </g>`;
  };
  /* sementes (desenhadas em 0,0) */
  const SEM = {
    mandioca:'<g><g transform="rotate(-28)"><rect x="-3.4" y="-16" width="6.8" height="30" rx="3" fill="#9A6A54" stroke="#4E2E20" stroke-width="1.2"/><path d="M-3.4 -6 h6.8 M-3.4 5 h6.8" stroke="#5E3A28" stroke-width="1.4"/><path d="M-1.6 -14 V12" stroke="#D8B4A0" stroke-width="1" opacity=".7"/></g><g transform="rotate(14) translate(8 2)"><rect x="-3.4" y="-14" width="6.8" height="26" rx="3" fill="#B07A60" stroke="#4E2E20" stroke-width="1.2"/><path d="M-3.4 -4 h6.8 M-3.4 6 h6.8" stroke="#5E3A28" stroke-width="1.4"/></g><path d="M-8 3 C-2 6 6 6 12 2" stroke="#E0B030" stroke-width="2.4" fill="none"/></g>',
    milho:'<g transform="rotate(-20)"><path d="M0 16 C-9 10 -9 -10 0 -18 C9 -10 9 10 0 16Z" fill="url(#kaMilho)" stroke="#9A6A08" stroke-width="1.2"/>' + [-12, -7, -2, 3, 8].map(y => `<path d="M-5 ${y} H5" stroke="#C8901A" stroke-width=".8"/>`).join('') + '<path d="M0 -16 V14" stroke="#C8901A" stroke-width=".8"/><path d="M0 18 C-12 12 -12 -4 -6 -10 C-6 4 -4 12 0 18Z M0 18 C12 12 12 -4 6 -10 C6 4 4 12 0 18Z" fill="#8CC85A" stroke="#3E7A22" stroke-width="1.1"/><path d="M-2 -10 q1 -3 3 -4" stroke="#FFF6C0" stroke-width="1.2" fill="none"/></g>',
    feijao:'<g><path d="M-14 -2 C-14 10 14 10 14 -2Z" fill="url(#kaCuia)" stroke="#5A3418" stroke-width="1.4"/>' + [[-8, -4, '#7A2A1E'], [-3, -6, '#3A2014'], [2, -4, '#7A2A1E'], [7, -5, '#A8442A'], [-5, -1, '#A8442A'], [4, -1, '#3A2014'], [0, -8, '#A8442A']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="${c}" stroke="#2A100A" stroke-width=".6"/><circle cx="${x - 1}" cy="${y - .6}" r=".6" fill="#fff" opacity=".7"/>`).join('') + '<path d="M-14 -2 H14" stroke="#3A2010" stroke-width="1.4"/><path d="M-10 2 q8 4 18 0" stroke="#E8B884" stroke-width="1" fill="none" opacity=".7"/></g>',
    abobora:'<g><path d="M-14 2 C-16 -10 -4 -12 0 -9 C4 -12 16 -10 14 2 C12 12 -12 12 -14 2Z" fill="url(#kaAbobora)" stroke="#9A4A08" stroke-width="1.4"/><path d="M-6 -9 C-9 -2 -8 6 -5 10 M6 -9 C9 -2 8 6 5 10 M0 -9 V10" stroke="#C8620E" stroke-width="1.1" fill="none"/><path d="M0 -9 C0 -13 2 -15 4 -16" stroke="#4E6A22" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-10 -4 q2 -4 6 -4" stroke="#FFE0A0" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>'
  };
  /* plantas da roça (crescem por escala) */
  const PLANTA = {
    mandioca:`<g>${[[-6, -66, -18], [2, -78, 4], [8, -60, 20]].map(([x, y, a]) => `<path d="M0 0 C${x * .4} ${y * .4} ${x} ${y * .7} ${x} ${y}" stroke="#7A3A2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>` + Array.from({ length:7 }, (_, i) => { const b = (a - 90 + (i - 3) * 30) * Math.PI / 180, L = i % 6 === 0 ? 11 : 17; return `<path d="M${x} ${y} Q${F(x + Math.cos(b - .2) * L * .6)} ${F(y + Math.sin(b - .2) * L * .6)} ${F(x + Math.cos(b) * L)} ${F(y + Math.sin(b) * L)} Q${F(x + Math.cos(b + .2) * L * .6)} ${F(y + Math.sin(b + .2) * L * .6)} ${x} ${y}Z" fill="url(#kaFolhaM)" stroke="#2E5A1E" stroke-width=".9"/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="1.6" fill="#A8443A"/>`).join('')}</g>`,
    milho:`<g><path d="M0 0 C-1 -30 1 -70 0 -100" stroke="#3E6A1E" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M0 0 C-1 -30 1 -70 0 -100" stroke="#9ACB4E" stroke-width="2.6" fill="none" stroke-linecap="round"/>${[[-16, 1, 30], [-32, -1, 34], [-50, 1, 32], [-66, -1, 28], [-82, 1, 22]].map(([y, l, L]) => `<path d="M0 ${y} C${l * 10} ${y - 12} ${l * L * .8} ${y - 8} ${l * L} ${y + 6} C${l * L * .7} ${y - 2} ${l * 10} ${y - 6} 0 ${y - 4}Z" fill="url(#kaFolhaM)" stroke="#2E5A1A" stroke-width="1.1" stroke-linejoin="round"/>`).join('')}<path d="M0 -100 l-6 -12 M0 -100 l1 -15 M0 -100 l7 -11" stroke="#C8A44A" stroke-width="2" stroke-linecap="round"/><g transform="translate(3 -50) rotate(24)"><path d="M0 0 C-6 -6 -6 -22 0 -28 C6 -22 6 -6 0 0Z" fill="#7AA03A" stroke="#3E5A1A" stroke-width="1"/><path d="M0 -4 C-4 -9 -4 -20 0 -25 C4 -20 4 -9 0 -4Z" fill="url(#kaMilho)" stroke="#9A6A08" stroke-width=".8"/><path d="M0 -28 q-2 -6 2 -9" stroke="#D8A04A" stroke-width="1" fill="none"/></g></g>`,
    feijao:`<g>${[[-14, -30, -1], [0, -42, 1], [12, -32, 1], [-6, -20, -1], [8, -18, 1]].map(([x, y, l]) => `<path d="M0 0 Q${x * .5} ${y * .6} ${x} ${y}" stroke="#3E6A1E" stroke-width="1.8" fill="none"/>` + [[0, 0], [-6, 4], [6, 4]].map(([dx, dy]) => `<path d="M${x + dx} ${y + dy} c-5 -2 -7 -9 0 -12 c7 3 5 10 0 12Z" fill="url(#kaFolhaF)" stroke="#24561E" stroke-width=".9"/>`).join('')).join('')}<g fill="#8CB84A" stroke="#3E6A1E" stroke-width=".8"><path d="M-4 -14 c-3 6 -3 14 -1 18 c2 -4 2 -12 1 -18Z"/><path d="M6 -12 c3 6 3 12 1 16 c-2 -4 -2 -10 -1 -16Z"/></g><circle cx="-10" cy="-38" r="2.4" fill="#F2F0FF" stroke="#9A8AC8" stroke-width=".6"/><circle cx="10" cy="-40" r="2.2" fill="#E8D8FF" stroke="#9A8AC8" stroke-width=".6"/></g>`,
    abobora:`<g><path d="M-34 -4 C-20 -10 14 -10 36 -4" stroke="#3E6A1E" stroke-width="3" fill="none" stroke-linecap="round"/>${[[-26, -12, 13], [20, -14, 14], [-4, -22, 16]].map(([x, y, r]) => `<path d="${copa(x, y, r, r * .78, 5, .5)}" fill="url(#kaFolhaF)" stroke="#24561E" stroke-width="1.1"/><path d="M${x} ${y + r * .5} L${x} ${y - r * .4} M${x} ${y} l${F(-r * .5)} ${F(-r * .3)} M${x} ${y} l${F(r * .5)} ${F(-r * .3)}" stroke="#2E6A22" stroke-width=".9"/>`).join('')}<g transform="translate(10 -4)"><path d="M-14 2 C-16 -10 -4 -12 0 -9 C4 -12 16 -10 14 2 C12 12 -12 12 -14 2Z" fill="url(#kaAbobora)" stroke="#9A4A08" stroke-width="1.4"/><path d="M-6 -9 C-9 -2 -8 6 -5 10 M6 -9 C9 -2 8 6 5 10" stroke="#C8620E" stroke-width="1.1" fill="none"/><path d="M-10 -4 q2 -4 6 -4" stroke="#FFE0A0" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><g transform="translate(-22 -26)">${[0, 1, 2, 3, 4].map(i => `<path d="M0 0 L${F(Math.cos(i * 1.256) * 7)} ${F(Math.sin(i * 1.256) * 7)} L${F(Math.cos(i * 1.256 + .6) * 4)} ${F(Math.sin(i * 1.256 + .6) * 4)}Z" fill="#FFC83D" stroke="#C88A0A" stroke-width=".6"/>`).join('')}<circle r="1.8" fill="#F08A1E"/></g></g>`
  };
  const lixoD = {
    lata:'<g transform="rotate(-70)"><rect x="-7" y="-12" width="14" height="24" rx="3" fill="#C9CED8" stroke="#5A6070" stroke-width="1.4"/><rect x="-7" y="-4" width="14" height="9" fill="#2E8AD6"/><ellipse cx="0" cy="-12" rx="7" ry="2" fill="#E9EEF6" stroke="#5A6070"/><path d="M-4 -8 V8" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>',
    pacote:'<g transform="rotate(12)"><path d="M-12 -12 L12 -12 L10 12 L-10 12Z" fill="#F2A01E" stroke="#9A5A08" stroke-width="1.4" stroke-linejoin="round"/><path d="M-12 -12 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3" stroke="#9A5A08" stroke-width="1.2" fill="#F2A01E"/><circle cx="0" cy="0" r="5" fill="#E5392C"/><path d="M-8 8 H8" stroke="#fff" stroke-width="1.4" opacity=".6"/></g>',
    garrafa:'<g transform="rotate(-62)"><path d="M-5 -16 h10 v5 C8 -8 10 -5 10 1 V15 C10 18 7 19 0 19 C-7 19 -10 18 -10 15 V1 C-10 -5 -8 -8 -5 -11Z" fill="#A8E6D8" fill-opacity=".85" stroke="#3E8A7A" stroke-width="1.4"/><rect x="-4" y="-21" width="8" height="6" rx="1.4" fill="#E5392C" stroke="#8A1A10"/><rect x="-10" y="2" width="20" height="7" fill="#3E9AE8"/><path d="M-6 -4 V14" stroke="#E6FFF8" stroke-width="1.8" stroke-linecap="round"/></g>',
    copo:'<g><path d="M-9 -10 H9 L6 10 H-6Z" fill="#FFFFFF" fill-opacity=".9" stroke="#8A9AB8" stroke-width="1.4" stroke-linejoin="round"/><path d="M-8 -6 H8" stroke="#E5392C" stroke-width="2"/><path d="M-5 -4 L-3 7" stroke="#C9D4E6" stroke-width="1.4"/></g>'
  };
  /* ---------- posições ---------- */
  const COVAS = [{ x:528, y:350 }, { x:602, y:356 }, { x:676, y:350 }, { x:748, y:356 }];
  const SEMS = [{ t:'mandioca', x:366, y:424 }, { t:'milho', x:390, y:414 }, { t:'feijao', x:414, y:426 }, { t:'abobora', x:388, y:438 }];
  const MUDAS = [{ x:220, y:326 }, { x:384, y:322 }, { x:252, y:352 }, { x:350, y:354 }];
  const LIXO = [{ id:'lata', x:162, y:446 }, { id:'pacote', x:300, y:376 }, { id:'garrafa', x:452, y:466 }, { id:'copo', x:724, y:374 }];
  const SACO = { x:592, y:448 };
  const CORMUDA = [['url(#kaMuda1)', '#2E5A3A', '#BFE6C8'], ['url(#kaMuda2)', '#5A6A12', '#F4F8B0'], ['url(#kaMuda3)', '#7A2A2A', '#FFD0C0'], ['url(#kaMuda4)', '#1E4A2A', '#A8E0A0']];
  /* ---------- pessoas da cena ---------- */
  const guia = pessoa({ x:0, y:0, k:1.12, pele:'a', cab:'trancas', cabCor:'#1A0E08', blusa:{ g:'kaRGuia', c:'#2E9A7A', e:'#145A44' }, baixoCor:['#7A6A4A', '#4A3E2A'], sapato:'#4A2E1A', chapeu:'bone', chapCor:['#E8603A', '#8E2E14'], cracha:1, pochete:'#3A3A4A', braco:'aponta', brinco:1, bolso:1, estampa:'<rect x="3" y="-47" width="6" height="6" rx="1" fill="none" stroke="#145A44" stroke-width=".8"/><path d="M-11 -44 C-6 -42 6 -42 11 -44" stroke="#9AE8C8" stroke-width="1" fill="none" opacity=".7"/>' });
  const turista = pessoa({ x:0, y:0, k:1.06, pele:'d', cab:'liso', cabCor:'#8A5A32', blusa:{ g:'kaRTur', c:'#F27A6A', e:'#A8382A' }, baixo:'bermuda', baixoCor:['#C8B48A', '#7A6A4A'], sapato:'#5A6A8A', chapeu:'sol', chapCor:['#F4E8C8', '#A8946A', '#3E8AD6'], mochila:['#3E6AB0', '#1E3A6A'], braco:'segura', celular:1, oculos:1, estampa:'<path d="M-11.6 -42 H11.6 M-11.4 -36 H11.4" stroke="#FFE0D8" stroke-width="1.6" opacity=".8"/>' });
  const menino = pessoa({ x:0, y:0, k:.84, pele:'c', cab:'cacho', cabCor:'#2A160C', blusa:{ g:'kaRMen', c:'#FFC83D', e:'#A8780A' }, baixo:'bermuda', baixoCor:['#3E7AD6', '#1E3E7A'], sapato:'#E5392C', mochila:['#8A4AB8', '#4E2470'], braco:'aceno', bracoCls:'ka-aceno', crianca:1, estampa:'<path d="M0 -46 l1.6 3.4 l3.6 .4 l-2.7 2.4 l.8 3.6 l-3.3 -1.8 l-3.3 1.8 l.8 -3.6 l-2.7 -2.4 l3.6 -.4Z" fill="#E5392C" stroke="#8A1A10" stroke-width=".5"/>' });
  const enxada = '<g><path d="M17 -64 L-12 -4" stroke="#3E2414" stroke-width="3.6" stroke-linecap="round"/><path d="M17 -64 L-12 -4" stroke="#B07A44" stroke-width="2" stroke-linecap="round"/><path d="M-16 -8 L-6 -2 L-12 6 L-24 2Z" fill="#9AA4B2" stroke="#3E4652" stroke-width="1.2" stroke-linejoin="round"/><path d="M-20 1 l8 3" stroke="#E6EEF8" stroke-width="1" opacity=".8"/></g>';
  /* ---------- SVG ---------- */
  /* ---------- vista A: comunidade, escola e roça na beira do rio Paranã ---------- */
  const escola = (() => {
    const x = 276, y = 304, w = 176, h = 70, topo = y - h;
    const telhas = Array.from({ length:6 }, (_, r) => `<path d="M${F(x - 14 + r * 2)} ${F(topo - 4 - r * 7)} ${Array.from({ length:Math.round((w + 28 - r * 4) / 10) }, () => 'q5 4 10 0').join(' ')}" stroke="#8A2E18" stroke-width="1.3" fill="none" opacity=".7"/>`).join('');
    const janela = (jx, i) => `<g class="ka-janela" data-i="${i}"><rect x="${jx}" y="${topo + 18}" width="30" height="26" fill="#2A3A5A" stroke="#1E4A8A" stroke-width="2"/><g class="ka-luz" style="opacity:0;transition:opacity .8s"><rect x="${jx}" y="${topo + 18}" width="30" height="26" fill="#FFE9A0"/></g>
      ${i === 0 ? `<g transform="translate(${jx + 15} ${topo + 50}) scale(.55)"><circle cx="0" cy="-26" r="10" fill="url(#kaPeleA)" stroke="#2E160A" stroke-width="1.4"/><path d="${copa(0, -31, 11, 8, 10, .25)}" fill="#1A0E08"/><circle cx="-3.4" cy="-25" r="1.5" fill="#1A0E0A"/><circle cx="3.4" cy="-25" r="1.5" fill="#1A0E0A"/><circle cx="-3" cy="-25.6" r=".5" fill="#fff"/><circle cx="3.8" cy="-25.6" r=".5" fill="#fff"/><path d="M-3 -21 q3 2.6 6 0" stroke="#5A1E10" stroke-width="1.2" fill="none"/><path d="M-12 -14 C-12 -20 12 -20 12 -14 V-8 H-12Z" fill="#E5392C"/></g>` : ''}
      ${i === 1 ? `<g transform="translate(${jx + 15} ${topo + 50}) scale(.55)"><circle cx="0" cy="-26" r="10" fill="url(#kaPeleB)" stroke="#45240E" stroke-width="1.4"/><path d="M-10 -28 C-11 -40 11 -40 10 -28 C6 -33 -6 -33 -10 -28Z" fill="#1A0E08"/><circle cx="-11" cy="-30" r="4" fill="#1A0E08"/><circle cx="11" cy="-30" r="4" fill="#1A0E08"/><circle cx="-3.4" cy="-25" r="1.5" fill="#1A0E0A"/><circle cx="3.4" cy="-25" r="1.5" fill="#1A0E0A"/><circle cx="-3" cy="-25.6" r=".5" fill="#fff"/><circle cx="3.8" cy="-25.6" r=".5" fill="#fff"/><path d="M-3 -21 q3 2.6 6 0" stroke="#5A1E10" stroke-width="1.2" fill="none"/><path d="M-12 -14 C-12 -20 12 -20 12 -14 V-8 H-12Z" fill="#3EA8E8"/></g>` : ''}
      <path d="M${jx + 15} ${topo + 18} V${topo + 44} M${jx} ${topo + 31} H${jx + 30}" stroke="#1E4A8A" stroke-width="1.6"/><path d="M${jx + 3} ${topo + 22} l8 0" stroke="#fff" stroke-width="1.4" opacity=".4"/><rect x="${jx - 3}" y="${topo + 44}" width="36" height="4" fill="#C8BCA8" stroke="#8A7E6A" stroke-width=".8"/></g>`;
    return `<g id="ka-escola" class="toque">
      <path d="M${x - 6} ${y + 2} H${x + w + 6}" stroke="#4E3A1E" stroke-width="4" opacity=".3" stroke-linecap="round"/>
      <rect x="${x}" y="${topo}" width="${w}" height="${h}" fill="url(#kaParede)" stroke="#8A7A62" stroke-width="2"/>
      <rect x="${x}" y="${y - 18}" width="${w}" height="18" fill="#3E8AD6" stroke="#1E4A8A" stroke-width="1.4"/><path d="M${x} ${y - 18} H${x + w}" stroke="#9ACBF4" stroke-width="1.4"/>
      ${janela(x + 14, 0)}${janela(x + 52, 1)}${janela(x + 132, 2)}
      <rect x="${x + 92}" y="${y - 46}" width="28" height="46" fill="#3FA864" stroke="#1E5A34" stroke-width="2"/><path d="M${x + 106} ${y - 46} V${y}" stroke="#1E5A34" stroke-width="1.2"/><circle cx="${x + 102}" cy="${y - 22}" r="1.4" fill="#FFE27A"/><circle cx="${x + 110}" cy="${y - 22}" r="1.4" fill="#FFE27A"/>
      <rect x="${x + 82}" y="${topo + 8}" width="48" height="14" rx="3" fill="#FFF6E0" stroke="#8A6A3A" stroke-width="1.4"/><text x="${x + 106}" y="${topo + 18.6}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="10" fill="#2E5AA8">ESCOLA</text>
      <path d="M${x - 14} ${topo + 4} L${x + 8} ${topo - 40} H${x + w - 8} L${x + w + 14} ${topo + 4}Z" fill="url(#kaTelha)" stroke="#6E2414" stroke-width="2" stroke-linejoin="round"/>
      ${telhas}
      <path d="M${x + 8} ${topo - 40} H${x + w - 8}" stroke="#6E2414" stroke-width="4" stroke-linecap="round"/>
      <g id="ka-solar" class="toque">${[0, 1, 2].map(i => `<g transform="translate(${x + 26 + i * 44} ${topo - 26}) skewX(-18)"><rect x="0" y="0" width="38" height="20" fill="url(#kaSolar)" stroke="#0A142E" stroke-width="1.4"/><path d="M9.5 0 V20 M19 0 V20 M28.5 0 V20 M0 10 H38" stroke="#7A9ADA" stroke-width=".8"/><path d="M3 3 l10 0" stroke="#fff" stroke-width="1.6" opacity=".6"/></g>`).join('')}<rect x="${x + 20}" y="${topo - 32}" width="140" height="32" fill="transparent"/></g>
      <path d="M${x + w - 20} ${topo - 40} V${topo - 64}" stroke="#5A5A6A" stroke-width="2"/><path d="M${x + w - 28} ${topo - 64} l8 -6 l8 6" stroke="#5A5A6A" stroke-width="1.6" fill="none"/>
    </g>`;
  })();
  const pilao = `<g id="ka-pilao" class="toque"><g transform="translate(226 394) scale(1.4) translate(-226 -394)">
      <g id="ka-mao-pilao"><path d="M240 302 V354" stroke="#3E2414" stroke-width="7" stroke-linecap="round"/><path d="M240 302 V354" stroke="#B07A44" stroke-width="4.4" stroke-linecap="round"/><ellipse cx="240" cy="301" rx="4.6" ry="3" fill="#8A5A30" stroke="#3E2414" stroke-width="1.2"/></g>
      ${pessoa({ ...{ x:226, y:394, k:1.1, pele:'b', cab:'coque', cabCor:'#D8D2CA', blusa:{ g:'kaRAnc', c:'#6A8AD8', e:'#2E4A8A' }, baixo:'saia', baixoCor:['#B8486A', '#6E1E3A', '#FFE0EA'], sapato:'#3A2A20', braco:'pilao', rugas:1, brinco:1, estampa:'<g fill="#FFE27A" stroke="#A8780A" stroke-width=".3">' + [[-6, -44], [2, -40], [7, -46], [-4, -34], [5, -33], [-8, -39]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('') + '</g>' } })}
      <path d="M226 394 L229 360 C231 352 249 352 251 360 L254 394Z" fill="url(#kaMadeira)" stroke="#3E2414" stroke-width="1.8" stroke-linejoin="round"/>
      <ellipse cx="240" cy="358" rx="11" ry="3.4" fill="#4A2A14" stroke="#3E2414" stroke-width="1.2"/><path d="M232 366 V390 M246 368 V390" stroke="#E2B07A" stroke-width="1.4" opacity=".5"/><path d="M228 378 H252" stroke="#5E3A1E" stroke-width="1.4"/>
      <rect x="200" y="290" width="62" height="108" fill="transparent"/></g></g>`;
  const galinha = `<g id="ka-galinha" class="toque"><g id="ka-gal-in" style="transform-origin:150px 412px"><ellipse cx="150" cy="413" rx="12" ry="2.4" fill="#1A1208" opacity=".22"/><path d="M146 404 v8 M152 404 v8" stroke="#E8A21E" stroke-width="1.6"/><path d="M136 396 C134 386 144 380 152 384 C158 380 166 386 164 394 C162 404 140 406 136 396Z" fill="#B8642E" stroke="#5E2A10" stroke-width="1.4"/><path d="M138 394 C140 388 150 386 156 392" stroke="#E8A060" stroke-width="1.4" fill="none"/><path d="M136 392 C128 388 128 380 134 380 C134 386 136 388 138 390Z" fill="#3A2A1E" stroke="#1E140A" stroke-width="1"/><circle cx="160" cy="382" r="6" fill="#C8743A" stroke="#5E2A10" stroke-width="1.3"/><path d="M157 376 q2 -4 4 0 q2 -4 4 1" fill="#E5392C" stroke="#8A1A10" stroke-width=".8"/><path d="M165 382 l5 1.4 l-5 1.6Z" fill="#F2B83A" stroke="#8A5A0A" stroke-width=".6"/><path d="M164 386 q1 3 -1 4" fill="#E5392C"/><circle cx="161.4" cy="381" r="1.3" fill="#12121A"/><circle cx="161.8" cy="380.6" r=".45" fill="#fff"/></g><rect x="124" y="370" width="52" height="46" fill="transparent"/></g>`;
  const baru = (() => {
    const x = 478, y = 312;
    const fr = [[440, 196], [462, 214], [506, 206], [524, 188], [484, 176], [450, 168]].map(([fx, fy], i) => `<g class="ka-baru-fruto" data-i="${i}"><path d="M${fx} ${fy - 6} v4" stroke="#5E4A2A" stroke-width="1.2"/><ellipse cx="${fx}" cy="${fy + 2}" rx="4.8" ry="6.4" fill="#A8743E" stroke="#4E3016" stroke-width="1.2"/><path d="M${fx - 2} ${fy - 2} q1 -2 2.4 -2" stroke="#E8C08A" stroke-width="1.1" fill="none"/></g>`).join('');
    return `<g id="ka-baru" class="toque" data-fig="baru">${arvore(x, y, 200, 150, 'url(#kaCopa4)', '#1E4A1E', '#A8E07A', '#5E3E26')}${fr}${brilhoHotspot(530, 150)}<rect x="400" y="110" width="150" height="200" fill="transparent"/></g>`;
  })();
  const vistaA = `
    <path d="M0 262 C120 236 220 240 320 248 C420 256 520 236 640 240 C720 242 770 250 800 256 V320 H0Z" fill="url(#kaMorroS)" id="ka-morroA"/>
    <path class="ka-verde" style="opacity:0;transition:opacity 2.4s" d="M0 262 C120 236 220 240 320 248 C420 256 520 236 640 240 C720 242 770 250 800 256 V320 H0Z" fill="url(#kaMorroV)"/>
    <g opacity=".85">${[[30, 252, 34, 30, 'url(#kaCopaS)', '#8A7A2A'], [600, 246, 40, 36, 'url(#kaCopa3)', '#5A6A22'], [720, 252, 30, 28, 'url(#kaCopa2)', '#2E5A44'], [160, 248, 26, 24, 'url(#kaCopaS)', '#8A7A2A']].map(([x, y, h, w, c, e]) => arvore(x, y, h, w, c, e, '#F4F2B0')).join('')}</g>
    <path d="M0 300 C140 286 300 290 460 296 C600 300 700 292 800 296 V500 H0Z" fill="url(#kaChaoS)"/>
    <path class="ka-verde" style="opacity:0;transition:opacity 2.4s" d="M0 300 C140 286 300 290 460 296 C600 300 700 292 800 296 V500 H0Z" fill="url(#kaChaoV)"/>
    <g class="ka-seco" style="transition:opacity 2s"><path d="${Array.from({ length:16 }, () => { const x = R(10, 460), y = R(400, 436); return `M${F(x)} ${F(y)} l6 3 l5 -2 l7 4`; }).join(' ')}" stroke="#9A6A3A" stroke-width="1" fill="none" opacity=".6"/>${capinzal(0, 460, 300, 330, 14, '#E8CC7A', '#9A7A3A', 12)}</g>
    <g class="ka-verde" style="opacity:0;transition:opacity 2.4s">${capinzal(0, 460, 300, 330, 14, '#9AD05A', '#3E7A2A', 13)}</g>
    <g fill="#9A7448" opacity=".35">${Array.from({ length:16 }, () => `<ellipse cx="${F(R(120, 460))}" cy="${F(R(320, 440))}" rx="${F(R(10, 30))}" ry="${F(R(2, 5))}"/>`).join('')}</g>
    ${capinzal(110, 460, 330, 440, 14, '#E2C46A', '#8A6A2A', 11)}${capinzal(110, 460, 330, 440, 10, '#9AC05A', '#4E7A22', 10)}
    ${[[190, 430, 7, 4], [330, 420, 9, 5], [430, 404, 6, 4], [300, 446, 6, 3]].map(([x, y, rx, ry]) => pedra(x, y, rx, ry)).join('')}${cupinzinho(330, 330, 22)}${canela(150, 360, 26, .7)}
    <g id="ka-ipe" class="toque">${arvore(256, 300, 150, 110, 'url(#kaCopaS)', '#7A6A22', '#FFF0A0', '#6E4E34', '#F2C230')}
      <g class="ka-verde" style="opacity:0;transition:opacity 2.4s">${arvore(256, 300, 150, 110, 'url(#kaCopa1)', '#3E6A22', '#D8F0A0', '#6E4E34')}</g><rect x="200" y="150" width="112" height="150" fill="transparent"/></g>
    <ellipse cx="136" cy="310" rx="90" ry="7" fill="#2A1A08" opacity=".2"/>${casaAdobe(66, 306, 128, 64, true)}
    <g transform="translate(122 4)"><ellipse cx="62" cy="309" rx="12" ry="3" fill="#2A1A08" opacity=".25"/><path d="M52 306 C46 296 48 284 56 282 H68 C76 284 78 296 72 306Z" fill="url(#kaPote)" stroke="#6E2E14" stroke-width="1.4"/><ellipse cx="62" cy="282" rx="7" ry="2.4" fill="#5A2A14" stroke="#6E2E14" stroke-width="1"/><path d="M53 292 q9 3 18 0" stroke="#F2B88A" stroke-width="1.2" fill="none" opacity=".7"/><path d="M55 288 q2 -3 5 -4" stroke="#FFD8B8" stroke-width="1.4" fill="none" opacity=".7"/></g>
    <g transform="translate(200 300)"><path d="M0 0 V-34 M40 0 V-30" stroke="#5E3E26" stroke-width="3"/><path d="M0 -30 Q20 -24 40 -27" stroke="#6A6A6A" stroke-width="1" fill="none"/><path d="M8 -28 h8 v12 h-8Z" fill="#E8603A"/><path d="M22 -27 h9 v10 h-9Z" fill="#3E8AD6"/></g>
    ${baru}
    ${escola}
    <path d="M462 318 C560 306 680 304 800 310 V392 C700 388 580 390 462 394Z" fill="url(#kaTerraS)" stroke="#7A4A2A" stroke-width="2"/>
    <path class="ka-verde" style="opacity:0;transition:opacity 2.4s" d="M462 318 C560 306 680 304 800 310 V392 C700 388 580 390 462 394Z" fill="url(#kaTerra)" stroke="#4A2A14" stroke-width="2"/>
    <path d="${Array.from({ length:6 }, (_, i) => `M${470 + i * 4} ${330 + i * 11} C600 ${322 + i * 11} 700 ${320 + i * 11} 800 ${324 + i * 11}`).join(' ')}" stroke="#4A2A14" stroke-width="1.4" fill="none" opacity=".35"/>
    <g class="ka-seco" style="transition:opacity 2s"><path d="M480 340 l10 4 l6 -3 l9 5 M560 370 l8 -3 l6 4 l10 -2 M700 336 l9 4 l7 -2 M640 378 l8 3 l10 -3" stroke="#7A4A2A" stroke-width="1.2" fill="none" opacity=".7"/></g>
    ${COVAS.map((v, i) => `<g class="ka-cova" data-i="${i}"><ellipse cx="${v.x}" cy="${v.y}" rx="17" ry="6" fill="#3A1E0E" stroke="#2A140A" stroke-width="1.2"/><path d="M${v.x - 15} ${v.y - 3} q15 -6 30 0" stroke="#B07A50" stroke-width="2" fill="none"/><g class="ka-cova-hint" style="display:none">${brilhoHotspot(v.x + 12, v.y - 14)}</g><g class="ka-planta" style="transform-origin:${v.x}px ${v.y}px;transform:scale(0);transition:transform 2.6s cubic-bezier(.3,1.3,.5,1)"><g transform="translate(${v.x} ${v.y})"></g></g></g>`).join('')}
    <g id="ka-mata">${[[492, 414, 44, 40, 'url(#kaCopa2)', '#1E4A3A', '#BFE8D0'], [556, 410, 36, 34, 'url(#kaCopa3)', '#4E6A12', '#F4F8B0'], [624, 414, 48, 44, 'url(#kaCopa4)', '#1E4A1E', '#BFE8A0'], [694, 408, 38, 36, 'url(#kaCopa1)', '#2E5A1E', '#E0F4B0'], [764, 414, 46, 42, 'url(#kaCopa2)', '#1E4A3A', '#BFE8D0']].map(([x, y, h, w, c, e, l]) => arvore(x, y, h, w, c, e, l)).join('')}${capinzal(470, 800, 404, 418, 16, '#9AD05A', '#3E7A2A', 10)}</g>
    <g id="ka-rioA" class="toque"><path id="ka-rio-agua" d="M0 462 C120 456 260 462 400 456 C470 452 530 424 600 418 C700 412 760 418 800 416 V500 H0Z" fill="url(#kaRio)" stroke="#E6F6FF" stroke-width="2.4" style="transition:transform 2.4s"/>
      <g fill="none" stroke="#E6F6FF" stroke-linecap="round" opacity=".7"><path class="ka-fluxo" d="M20 476 h60 M150 484 h90 M300 478 h50 M460 466 h70 M580 440 h60 M690 432 h50 M120 494 h80 M420 490 h90 M640 470 h80" stroke-width="2" stroke-dasharray="24 30"/></g>
      <g opacity=".22" fill="#2E6A3A">${[[492, 424, 30], [556, 420, 24], [624, 422, 34], [694, 418, 26], [764, 420, 32]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + 10}" rx="${r * .7}" ry="${r * .4}"/>`).join('')}</g>
      <g opacity=".3" fill="#FFE9C4">${[[120, 470, 60], [330, 468, 40], [560, 440, 50]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="2"/>`).join('')}</g>
      <rect y="482" width="800" height="18" fill="#0E3A5A" opacity=".25"/>
      <path d="M0 464 C120 458 260 464 400 458 C470 454 530 426 600 420 C700 414 760 420 800 418" stroke="#2E5A6A" stroke-width="1" fill="none" opacity=".4" transform="translate(0 4)"/></g>
    ${galinha}
    ${pilao}
    <g id="ka-balaio"><ellipse cx="388" cy="444" rx="34" ry="5" fill="#1A1208" opacity=".25"/><path d="M352 430 C354 446 422 446 424 430Z" fill="url(#kaBalaio)" stroke="#6E4A1A" stroke-width="1.8"/><path d="M356 436 C370 440 406 440 420 436 M360 442 C376 445 400 445 416 442" stroke="#8A5E22" stroke-width="1.2" fill="none"/><g stroke="#8A5E22" stroke-width="1" opacity=".7">${Array.from({ length:9 }, (_, i) => `<path d="M${358 + i * 7.6} 431 l1 12"/>`).join('')}</g><ellipse cx="388" cy="430" rx="36" ry="6" fill="none" stroke="#6E4A1A" stroke-width="3"/><ellipse cx="388" cy="430" rx="36" ry="6" fill="none" stroke="#F2D28A" stroke-width="1.2"/></g>
    ${SEMS.map((m, i) => `<g class="ka-sem toque" data-i="${i}" data-t="${m.t}" transform="translate(${m.x} ${m.y})" style="cursor:grab"><g class="ka-sem-in">${SEM[m.t]}</g><circle r="22" fill="transparent"/></g>`).join('')}
    <g id="ka-agricultor" class="toque">${pessoa({ x:494, y:432, k:1.52, pele:'a', cab:'curto', cabCor:'#1A0E08', blusa:{ g:'kaRAgr', c:'#E8EEF6', e:'#6A7A94' }, baixoCor:['#5A4A3A', '#2E241A'], sapato:'#2A1E14', chapeu:'palha', braco:'enxada', estampa:'<path d="M-11 -44 H11 M-11 -38 H11 M-11 -32 H11" stroke="#7AA8E0" stroke-width="1.6" opacity=".7"/><path d="M-2 -50 V-29" stroke="#6A7A94" stroke-width=".8"/>', frente:enxada })}<rect x="452" y="310" width="66" height="122" fill="transparent"/></g>
    <g id="ka-nuvens" class="toque"><g id="ka-nuv-in" style="transform-origin:640px 70px;transition:transform 1s cubic-bezier(.3,1.4,.5,1)">
      <g id="ka-nuv-cinza" style="opacity:0;transition:opacity 1s"><use href="#nuvem" x="530" y="22" width="220" height="104" style="color:#6E7A96"/><use href="#nuvem" x="536" y="24" width="208" height="96" style="color:#AEB8CE"/><use href="#nuvem" x="566" y="56" width="140" height="58" style="color:#8A96B0"/></g>
      <g id="ka-nuv-branca" style="transition:opacity 1s"><use href="#nuvem" x="572" y="44" width="136" height="64" style="color:#fff"/><path d="M596 72 q12 -9 26 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path d="M582 62 q14 -10 30 -6" stroke="#E6ECF8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>
      <g id="ka-nuv-hint" style="display:none">${brilhoHotspot(712, 52)}</g><rect x="520" y="16" width="240" height="110" fill="transparent"/></g>
  `;
  /* ---------- vista B: trilha, nascente e cachoeira ---------- */
  const TR0 = 'M176 488 C184 470 196 454 206 440 C214 428 220 418 226 410';
  const TRE = 'M226 410 C232 392 244 372 262 350 C276 334 290 322 304 318 C330 314 360 322 400 334 C440 346 480 360 512 372';
  const TRC = 'M226 410 C246 426 266 438 296 444 C330 450 380 448 420 440 C450 434 476 420 516 404';
  const vistaB = `
    <path d="M0 236 C80 220 160 214 250 224 C330 232 420 226 540 238 V340 H0Z" fill="url(#kaMorroB)"/>
    <path d="M0 236 C80 220 160 214 250 224 C330 232 420 226 540 238" stroke="#E2E8A0" stroke-width="2" fill="none" opacity=".6"/>
    <g opacity=".9">${[[40, 248, 40, 36, 'url(#kaCopa3)', '#5A6A22', '#F4F8B0'], [196, 240, 46, 40, 'url(#kaCopa2)', '#2E5A44', '#C8F0D8'], [430, 246, 38, 34, 'url(#kaCopaS)', '#8A7A2A', '#FFF4B0'], [500, 252, 30, 30, 'url(#kaCopa1)', '#3E6A22', '#E0F4B0']].map(([x, y, h, w, c, e, l]) => arvore(x, y, h, w, c, e, l)).join('')}</g>
    ${capinzal(0, 520, 240, 290, 22, '#E2D27A', '#9A8A3A', 12)}
    <g id="ka-veado" class="toque" data-fig="veadocampeiro"><g id="ka-veado-in" style="transition:transform 1.4s ease-in-out"><g style="animation:flutua 3s ease-in-out infinite alternate"><svg x="88" y="214" width="76" height="76" viewBox="0 0 120 120"><use href="#f-veadocampeiro"/></svg></g></g><rect x="92" y="216" width="70" height="72" fill="transparent"/>${brilhoHotspot(156, 222)}</g>
    <path d="M0 296 C120 284 260 288 400 296 C470 300 520 312 560 330 V500 H0Z" fill="url(#kaChaoB)"/>
    <g fill="#9AA84A" opacity=".45">${Array.from({ length:14 }, () => `<ellipse cx="${F(R(20, 540))}" cy="${F(R(320, 495))}" rx="${F(R(14, 40))}" ry="${F(R(3, 7))}"/>`).join('')}</g>
    ${capinzal(0, 520, 300, 470, 26, '#C8D06A', '#6A7A2A', 11)}${capinzal(0, 520, 310, 480, 18, '#E8C860', '#9A7A2A', 13)}${capinzal(0, 520, 310, 480, 14, '#8EC85A', '#3E6A22', 10)}
    ${cupinzinho(470, 300, 26)}${cupinzinho(64, 318, 20)}
    ${[[120, 380, 8, 5], [420, 476, 9, 5], [94, 352, 6, 4], [500, 470, 7, 4], [150, 410, 5, 3]].map(([x, y, rx, ry]) => pedra(x, y, rx, ry)).join('')}
    ${canela(440, 470, 34, .9)}${canela(30, 352, 30, .8)}${canela(136, 330, 26, .7)}
    <g>${Array.from({ length:22 }, (_, i) => { const x = R(20, 520), y = R(300, 480), cr = ['#FFFFFF', '#F2C230', '#C86AD8', '#FF7A5A'][i % 4]; return Math.hypot(x - 302, (y - 322) * 3) < 110 || (x > 140 && x < 520 && y > 380) ? '' : `<path d="M${F(x)} ${F(y)} v-8" stroke="#4E7A2A" stroke-width="1.2"/><g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${F(x + Math.cos(k * 1.256) * 2.2)}" cy="${F(y - 9 + Math.sin(k * 1.256) * 2.2)}" r="1.7" fill="${cr}" stroke="#5A3A5A" stroke-width=".4"/>`).join('')}<circle cx="${F(x)}" cy="${F(y - 9)}" r="1.1" fill="#F28A1E"/></g>`; }).join('')}</g>
    <g fill="#8A7A4A" opacity=".5">${Array.from({ length:30 }, () => `<ellipse cx="${F(R(10, 540))}" cy="${F(R(330, 495))}" rx="${F(R(1.4, 3.4))}" ry="${F(R(.8, 1.8))}"/>`).join('')}</g>
    <!-- penhasco e cachoeira -->
    <path d="M520 352 L532 270 L546 196 L566 128 L586 78 L612 52 L650 42 L700 38 L760 30 L800 28 V372 L760 360 L690 352 L600 356Z" fill="url(#kaRocha)" stroke="#5E3428" stroke-width="2.4" stroke-linejoin="round"/>
    <g clip-path="url(#kaPenClip)">
      ${Array.from({ length:9 }, (_, k) => { const y0 = 40 + k * 36, cor = ['#E6AC80', '#C98460', '#DDA076', '#B8744E', '#E2A47A', '#C07A56', '#D49670', '#B06C4A', '#CC8C66'][k]; return `<path d="M500 ${y0} ${Array.from({ length:11 }, (_, q) => `L${520 + q * 30} ${F(y0 + R(-5, 5))}`).join(' ')} L820 ${y0 + 40} L500 ${y0 + 40}Z" fill="${cor}"/><path d="M500 ${y0} ${Array.from({ length:11 }, (_, q) => `L${520 + q * 30} ${F(y0 + R(-3, 3))}`).join(' ')}" stroke="#FFD8B8" stroke-width="1.6" fill="none" opacity=".5"/><path d="M500 ${y0 + 34} H820" stroke="#6E3A28" stroke-width="3" opacity=".25"/>`; }).join('')}
      <path d="${Array.from({ length:26 }, () => { const x = R(520, 800), y = R(50, 340); return `M${F(x)} ${F(y)} l${F(R(-3, 3))} ${F(R(10, 24))}`; }).join(' ')}" stroke="#5E3428" stroke-width="1.4" opacity=".55"/>
      <path d="${Array.from({ length:40 }, () => { const x = R(520, 800), y = R(50, 350); return `M${F(x)} ${F(y)} h${F(R(4, 12))}`; }).join(' ')}" stroke="#7A4434" stroke-width="1" opacity=".4"/>
      <rect x="500" y="0" width="70" height="380" fill="#3A1E14" opacity=".18"/>
    </g>
    <path d="M620 46 C630 120 622 240 610 352 L728 352 C716 240 710 120 718 40Z" fill="url(#kaRochaE)" opacity=".8"/>
    <path d="M626 50 C634 130 628 240 618 350 L640 350 C646 240 646 130 646 46Z M694 44 C696 130 700 240 706 350 L724 350 C712 240 708 130 712 42Z" fill="url(#kaMolhado)" opacity=".85"/>
    ${[[630, 112, 12], [716, 148, 11], [626, 220, 13], [718, 256, 12], [612, 340, 16], [724, 332, 14]].map(([x, y, r]) => `<path d="M${x - r} ${y} C${x - r * .6} ${y - 4} ${x + r * .6} ${y - 5} ${x + r} ${y} C${x + r * .6} ${y + 3} ${x - r * .6} ${y + 3} ${x - r} ${y}Z" fill="url(#kaMusgo)" stroke="#2E5A1E" stroke-width=".9"/>${[-.6, -.2, .3, .7].map(k => `<path d="M${F(x + k * r)} ${y + 1} q1 ${F(R(5, 10))} -1 ${F(R(10, 18))}" stroke="#4E8A2E" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}<path d="M${x - r * .5} ${y - 1.4} q${r * .4} -2 ${r} -1" stroke="#C8F09A" stroke-width="1.1" fill="none" opacity=".8"/>`).join('')}
    ${[[612, 132, 12], [726, 160, 11], [604, 232, 13], [730, 262, 12], [590, 300, 10]].map(([x, y, h]) => `<g class="balanca" style="transform-origin:${x}px ${y}px;animation-duration:${F(R(4, 6))}s">${[-1, -.4, .3, 1].map(l => `<path d="M${x} ${y} Q${F(x + l * h * .6)} ${F(y + h * .3)} ${F(x + l * h * .5)} ${F(y + h)}" stroke="#2E6A3A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${F(x + l * h * .6)} ${F(y + h * .3)} ${F(x + l * h * .5)} ${F(y + h)}" stroke="#8AD07A" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="2 1.2"/>`).join('')}</g>`).join('')}
    ${[[560, 128, 16, 'url(#kaCopa2)', '#2E5A44'], [596, 70, 20, 'url(#kaCopa1)', '#3E6A22'], [740, 32, 22, 'url(#kaCopa4)', '#1E4A1E'], [780, 30, 16, 'url(#kaCopa3)', '#5A6A22'], [548, 198, 12, 'url(#kaCopa1)', '#3E6A22'], [770, 196, 12, 'url(#kaCopa2)', '#2E5A44'], [540, 270, 12, 'url(#kaCopa4)', '#1E4A1E']].map(([x, y, r, c, e]) => `<path d="${copa(x, y, r, r * .6, 8, .35)}" fill="${c}" stroke="${e}" stroke-width="1.3"/>`).join('')}
    ${arvore(624, 50, 46, 44, 'url(#kaCopa3)', '#5A6A22', '#F4F8B0')}
    <g id="ka-araras" class="toque"><g id="ka-araras-in">${[[700, 26, 1], [722, 34, -1]].map(([x, y, l]) => `<g transform="translate(${x} ${y}) scale(${l * .9} .9)"><path d="M0 0 C-2 8 -1 16 4 22 L2 34 L6 26 L8 34 L8 22 C10 14 8 6 4 0Z" fill="#2E7AD6" stroke="#123A7A" stroke-width="1.1" stroke-linejoin="round"/><path d="M3 4 C6 8 7 14 6 20" fill="none" stroke="#FFD23A" stroke-width="4" stroke-linecap="round"/><circle cx="2" cy="-2" r="5" fill="#2E8AE8" stroke="#123A7A" stroke-width="1.1"/><path d="M-1 -1 C-1 2 1 3 3 2" fill="#fff" stroke="#123A7A" stroke-width=".6"/><path d="M-3 -2 C-7 -2 -8 2 -5 4 C-4 2 -3 1 -2 1Z" fill="#2A2A2A"/><circle cx="1" cy="-3" r="1.2" fill="#12121A"/><circle cx="1.3" cy="-3.3" r=".4" fill="#fff"/><path d="M-1 -6 q2 -2 5 -1" stroke="#7AE07A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`).join('')}</g><rect x="684" y="14" width="56" height="60" fill="transparent"/></g>
    <g id="ka-queda" class="toque">
      <path d="M648 42 C646 120 640 230 632 340 L708 340 C700 230 694 120 692 40Z" fill="url(#kaQueda)" opacity=".94"/>
      <g fill="none" stroke-linecap="round">${[[654, 2.4], [664, 3.4], [672, 2], [680, 3], [688, 2.2], [660, 1.6], [684, 1.4]].map(([x, w], i) => `<path class="ka-veio" d="M${x} 44 C${x - 2} 140 ${x - 6} 240 ${x - 12 + (x - 650) * .1} 338" stroke="${i % 2 ? '#BFEFF2' : '#FFFFFF'}" stroke-width="${w}" stroke-dasharray="${18 + i * 4} ${12 + i * 3}" opacity=".9"/>`).join('')}</g>
      <path d="M646 46 C645 140 640 240 632 336" stroke="#9AD8E0" stroke-width="1.6" fill="none" opacity=".7"/><path d="M694 42 C696 140 700 240 708 336" stroke="#9AD8E0" stroke-width="1.6" fill="none" opacity=".7"/>
      <g id="ka-arco" style="opacity:0;transition:opacity 1.6s"><path d="M590 340 C600 280 740 280 750 340" stroke="url(#kaArco)" stroke-width="7" fill="none" opacity=".55"/></g>
      <rect x="626" y="36" width="90" height="300" fill="transparent"/></g>
    <!-- poço azul-turquesa -->
    <ellipse cx="650" cy="364" rx="156" ry="44" fill="#4E3A2A" opacity=".5"/>
    <ellipse cx="650" cy="362" rx="152" ry="40" fill="url(#kaPocoT)"/>
    <g clip-path="url(#kaPocoClip)"><ellipse cx="668" cy="352" rx="90" ry="20" fill="#0A5A7A" opacity=".45"/>
      ${[[560, 384, 16, 6], [612, 394, 12, 5], [736, 390, 18, 6], [700, 398, 10, 4], [536, 372, 10, 4], [776, 378, 12, 5]].map(([x, y, rx, ry]) => `<path d="${copa(x, y, rx, ry, 6, .14)}" fill="#6A8A7A" opacity=".55" stroke="#2E5A5A" stroke-width=".8"/>`).join('')}
      <rect id="ka-caus" x="480" y="318" width="340" height="90" fill="url(#kaCaus)" opacity=".3"/>
      <path d="M560 398 C620 404 700 404 770 396" stroke="#E6FFFF" stroke-width="1.4" fill="none" opacity=".5"/></g>
    <g clip-path="url(#kaPocoClip)"><g fill="#E8F8F0" opacity=".35">${Array.from({ length:26 }, () => `<ellipse cx="${F(R(520, 780))}" cy="${F(R(360, 400))}" rx="${F(R(2, 5))}" ry="${F(R(1, 2.4))}"/>`).join('')}</g>
      <g id="ka-peixes" style="opacity:0;transition:opacity 2s">${[[590, 382], [700, 388], [740, 372]].map(([x, y], i) => `<g transform="translate(${x} ${y}) scale(${i % 2 ? -1 : 1} 1)"><path d="M-8 0 C-3 -4 4 -4 8 0 C4 4 -3 4 -8 0Z M-8 0 L-13 -4 L-12 0 L-13 4Z" fill="#8A9A5A" stroke="#3E4A2A" stroke-width=".8"/><circle cx="4" cy="-.6" r="1" fill="#12121A"/></g>`).join('')}</g>
      <path id="ka-turvo" d="M494 362 A156 44 0 0 0 806 362 A156 44 0 0 0 494 362Z" fill="url(#kaPocoM)" style="opacity:.82;transition:opacity 3s"/>
      <g id="ka-ondas" fill="none" stroke="#fff" opacity=".6">${[0, 1, 2].map(i => `<ellipse class="ka-onda" cx="670" cy="344" rx="${30 + i * 26}" ry="${6 + i * 5}" stroke-width="1.4"/>`).join('')}</g>
      <path d="M520 352 C580 338 720 336 790 352" stroke="#FFFFFF" stroke-width="2" fill="none" opacity=".35"/>
      <g id="ka-brilhos-poco" style="opacity:0;transition:opacity 2s" fill="#fff">${Array.from({ length:12 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .31 % 2)}s" x="${F(R(530, 770))}" y="${F(R(350, 392))}" width="${F(R(8, 16))}" height="2" rx="1"/>`).join('')}</g>
    </g>
    <g filter="url(#kaNeb)" opacity=".75" fill="#FFFFFF"><ellipse cx="668" cy="330" rx="62" ry="16"/><ellipse cx="650" cy="300" rx="40" ry="12" opacity=".6"/><ellipse cx="690" cy="270" rx="26" ry="10" opacity=".4"/></g>
    <g fill="#FFFFFF" opacity=".95">${[[618, 344, 9], [634, 340, 14], [654, 346, 18], [676, 340, 18], [696, 346, 14], [712, 342, 10], [646, 336, 10], [688, 334, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${F(r * .42)}"/>`).join('')}</g>
    ${[[506, 368, 18, 10], [530, 392, 22, 11], [574, 404, 18, 8], [770, 392, 26, 12], [796, 372, 18, 14], [728, 404, 20, 8], [612, 330, 16, 8], [724, 330, 18, 9], [758, 336, 14, 8]].map(([x, y, rx, ry]) => `<path d="${copa(x, y, rx, ry, 7, .16)}" fill="url(#kaRochaE)" stroke="#3A2018" stroke-width="1.6"/><path d="M${x - rx * .5} ${y - ry * .5} q${rx * .4} -${ry * .5} ${rx * .9} -${ry * .2}" stroke="#E2A88A" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>`).join('')}
    <g id="ka-pato" class="toque" data-fig="patomergulhao"><g id="ka-pato-in" style="transition:transform .7s, opacity .5s"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><svg x="548" y="340" width="70" height="54" viewBox="0 0 130 100"><use href="#f-patomergulhao-n"/></svg></g><rect x="548" y="342" width="70" height="50" fill="transparent"/><g fill="none" stroke="#E6FFFF" opacity=".75"><ellipse cx="584" cy="388" rx="28" ry="4" stroke-width="1.4"/><ellipse cx="584" cy="390" rx="38" ry="6" stroke-width="1" opacity=".6"/></g></g>${brilhoHotspot(612, 346)}</g>
    <path d="M500 410 C540 404 600 412 640 410 C700 408 760 414 800 410 V500 H500Z" fill="#9A8A5A"/>
    <path d="M470 420 C520 404 560 404 590 412 C620 420 610 470 560 480 C520 486 470 470 470 420Z" fill="url(#kaAreia)" opacity=".9"/>
    <path d="M736 404 C744 430 752 460 770 500 H800 V404Z" fill="url(#kaRio)" opacity=".85"/><path class="ka-fluxo" d="M748 420 C752 440 760 464 772 496" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-dasharray="14 18"/>
    ${[[640, 470, 22, 10], [700, 488, 18, 9], [600, 498, 26, 10]].map(([x, y, rx, ry]) => `<path d="${copa(x, y, rx, ry, 7, .16)}" fill="#8A7466" stroke="#3A2A20" stroke-width="1.4"/>`).join('')}
    <!-- vereda e nascente -->
    <ellipse cx="302" cy="322" rx="92" ry="30" fill="url(#kaVereda)" stroke="#2E6A3A" stroke-width="1.6"/>
    <ellipse cx="302" cy="318" rx="70" ry="20" fill="#86D07A" opacity=".45"/>
    ${buriti(252, 312, 76)}${buriti(356, 306, 90)}${buriti(392, 318, 58)}
    ${samambaia(232, 330, 14, '#9AE08A', '#2E6A3A')}${samambaia(378, 336, 12, '#9AE08A', '#2E6A3A')}${samambaia(330, 340, 10, '#7ACB6A', '#2E6A3A')}
    <path id="ka-corrego" d="M304 324 C330 330 360 336 400 342 C440 348 470 356 506 364" stroke="#4EC2D2" stroke-width="3" fill="none" stroke-linecap="round" style="transition:stroke-width 1.6s"/>
    <path id="ka-corrego-fluxo" d="M304 324 C330 330 360 336 400 342 C440 348 470 356 506 364" stroke="#E6FFFF" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="6 10"/>
    <g id="ka-nascente" class="toque"><ellipse cx="302" cy="322" rx="14" ry="5" fill="#3EB8CC" stroke="#1E7A8A" stroke-width="1.4"/><ellipse class="ka-borbulha" cx="302" cy="321" rx="5" ry="1.8" fill="none" stroke="#fff" stroke-width="1.2"/><path d="M294 320 q4 -2 8 0" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>
      <g transform="translate(320 306)"><path d="M0 0 V-22" stroke="#5E3E26" stroke-width="3"/><rect x="-12" y="-36" width="24" height="16" rx="3" fill="url(#kaMadeira)" stroke="#3E2414" stroke-width="1.4"/><path d="M-3 -24 C-6 -27 -5 -30 -1 -34 C3 -30 4 -27 1 -24 C0 -23 -2 -23 -3 -24Z" fill="#4EB8F0" stroke="#1E5A8A" stroke-width=".9"/><path d="M4 -24 v-6 m0 3 l3 -3 m-3 2 l-2 -2" stroke="#8AE07A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
      <rect x="276" y="300" width="56" height="34" fill="transparent"/></g>
    <g id="ka-pisado" style="transition:opacity 2s">${[[262, 340, 22, 8], [290, 332, 18, 7], [330, 330, 20, 7], [236, 318, 14, 6], [370, 328, 14, 6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#9A7448" opacity=".85"/>`).join('')}<g fill="#6E4E2E" opacity=".7">${[[256, 340], [266, 336], [286, 332], [296, 328], [326, 330], [336, 326]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.2"/>`).join('')}</g></g>
    <path d="${TRE}" stroke="#B8945A" stroke-width="12" fill="none" stroke-linecap="round" opacity=".35" id="ka-tre-velha" style="transition:opacity 2s"/>
    <path d="${TR0}" stroke="#9A7440" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${TR0}" stroke="url(#kaTrilha)" stroke-width="17" fill="none" stroke-linecap="round"/>
    <path d="${TRC}" stroke="#9A7440" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${TRC}" stroke="url(#kaTrilha)" stroke-width="17" fill="none" stroke-linecap="round"/>
    <g fill="#A8A096" stroke="#4E4A44" stroke-width="1">${[[214, 452], [240, 400], [258, 436], [286, 454], [320, 438], [350, 458], [380, 436], [416, 452], [440, 428], [468, 438], [486, 412], [200, 418], [192, 476], [168, 458]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${F(R(4, 6.4))}" ry="${F(R(2.4, 3.4))}"/>`).join('')}</g>
    <g stroke="#6E4224" stroke-width="3.4" stroke-linecap="round">${[[278, 440, 292, 446], [330, 446, 346, 446], [392, 444, 406, 442]].map(([a, b, c2, d]) => `<path d="M${a} ${b - 6} L${c2} ${d + 6}"/>`).join('')}</g>
    <path id="ka-tr0" d="${TR0}" fill="none" stroke="none"/><path id="ka-tre" d="${TRE}" fill="none" stroke="none"/><path id="ka-trc" d="${TRC}" fill="none" stroke="none"/>
    <path id="ka-hit-e" d="M226 410 C232 392 244 372 262 350 C276 334 290 322 304 318" stroke="transparent" stroke-width="34" fill="none" class="toque"/>
    <path id="ka-hit-c" d="${TRC}" stroke="transparent" stroke-width="34" fill="none" class="toque"/>
    <g id="ka-dica-c" style="display:none" pointer-events="none"><path d="${TRC}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="6 10" stroke-linecap="round"/></g>
    <g id="ka-dica-0" pointer-events="none"><path d="${TR0}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="6 10" stroke-linecap="round"/></g>
    ${MUDAS.map((m, i) => `<g class="ka-muda toque" data-i="${i}"><g class="ka-cova3"><ellipse cx="${m.x}" cy="${m.y}" rx="10" ry="4" fill="#4A2A14"/><path d="M${m.x + 8} ${m.y} v-16" stroke="#C8A06A" stroke-width="2.4" stroke-linecap="round"/><path d="M${m.x + 8} ${m.y - 16} l6 2 l-6 3Z" fill="#E8603A"/><g class="ka-muda-hint" style="display:none">${brilhoHotspot(m.x - 6, m.y - 14)}</g></g>
      <g class="ka-muda-in" style="transform-origin:${m.x}px ${m.y}px;transform:scale(0);transition:transform 1.4s cubic-bezier(.3,1.5,.5,1)"><path d="M${m.x} ${m.y} V${m.y - 26}" stroke="#5E3E26" stroke-width="2.6" stroke-linecap="round"/><path d="${copa(m.x, m.y - 30, 13, 10, 8, .32)}" fill="${CORMUDA[i][0]}" stroke="${CORMUDA[i][1]}" stroke-width="1.3"/><path d="${copa(m.x - 6, m.y - 22, 8, 6, 6, .3)}" fill="${CORMUDA[i][0]}" stroke="${CORMUDA[i][1]}" stroke-width="1.1"/><path d="M${m.x - 7} ${m.y - 34} q5 -5 11 -3" stroke="${CORMUDA[i][2]}" stroke-width="1.6" fill="none" stroke-linecap="round"/>${tufo(m.x - 10, m.y + 2, 9, '#9AD05A', '#3E7A2A', 4)}${tufo(m.x + 11, m.y + 3, 8, '#9AD05A', '#3E7A2A', 4)}</g>
      <rect x="${m.x - 22}" y="${m.y - 40}" width="44" height="48" fill="transparent"/></g>`).join('')}
    <g id="ka-saco"><ellipse cx="${SACO.x}" cy="${SACO.y + 18}" rx="22" ry="4" fill="#1A1208" opacity=".25"/><path d="M${SACO.x - 18} ${SACO.y - 10} C${SACO.x - 24} ${SACO.y + 8} ${SACO.x - 18} ${SACO.y + 20} ${SACO.x} ${SACO.y + 20} C${SACO.x + 18} ${SACO.y + 20} ${SACO.x + 24} ${SACO.y + 8} ${SACO.x + 18} ${SACO.y - 10} Z" fill="url(#kaSaco)" stroke="#1E3A12" stroke-width="1.8"/><path d="M${SACO.x - 18} ${SACO.y - 10} q6 -8 9 0 q4 -9 9 0 q4 -9 9 0 q5 -8 9 0" fill="#4E7A2E" stroke="#1E3A12" stroke-width="1.4"/><path d="M${SACO.x - 12} ${SACO.y} C${SACO.x - 14} ${SACO.y + 8} ${SACO.x - 10} ${SACO.y + 14} ${SACO.x - 6} ${SACO.y + 16}" stroke="#9ACB7A" stroke-width="2" fill="none" opacity=".7"/><path d="M${SACO.x - 4} ${SACO.y + 4} l4 -5 l4 5 M${SACO.x + 6} ${SACO.y + 2} l4 2 l-1 4" stroke="#E8FFD8" stroke-width="1.6" fill="none" stroke-linecap="round"/><g id="ka-saco-hint" style="display:none">${brilhoHotspot(SACO.x + 22, SACO.y - 18)}</g></g>
    ${LIXO.map((l, i) => `<g class="ka-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab">${l.id === 'copo' ? `<g style="animation:flutua 2.4s ease-in-out infinite alternate">${lixoD[l.id]}</g>` : lixoD[l.id]}<circle r="24" fill="transparent"/></g>`).join('')}
    <g id="ka-grupo" class="toque" style="cursor:grab"><g id="ka-grupo-pos" transform="translate(176 488)"><g id="ka-grupo-vira"><g id="ka-grupo-anda"><g transform="scale(1.36)">
      <g transform="translate(-28 -6)" id="ka-turista">${turista}</g>
      <g id="ka-guia">${guia}</g>
      <g transform="translate(-50 3)" id="ka-menino">${menino}</g>
    </g></g></g><rect x="-100" y="-140" width="140" height="148" fill="transparent"/></g></g>
    <g id="ka-flash" style="opacity:0" pointer-events="none"><circle cx="0" cy="0" r="40" fill="#FFFFFF"/></g>
  `;
  /* ---------- frente fixa: cupinzeiro e a Seri ---------- */
  const frente = `
    <path d="M-10 500 C0 470 14 440 24 410 C30 392 40 380 52 384 C62 388 68 404 74 424 C82 450 96 476 112 500Z" fill="url(#kaCupim)" stroke="#5E3420" stroke-width="2.4"/>
    <path d="M30 414 C34 400 42 392 50 394 M22 450 C30 440 44 436 56 440 M60 420 C64 436 70 456 84 476" stroke="#F2C8A0" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
    <g fill="#7A4A2E" opacity=".6">${Array.from({ length:16 }, () => `<circle cx="${F(R(16, 96))}" cy="${F(R(420, 494))}" r="${F(R(1.2, 2.6))}"/>`).join('')}</g>
    ${capinzal(-6, 140, 492, 500, 12, '#D8D27A', '#7A7A2A', 22)}
    ${capinzal(700, 806, 488, 500, 10, '#C8D86A', '#5A6A22', 26)}
    <g class="balanca" style="transform-origin:780px 500px;animation-duration:6s">${[[790, 470, 46, 34, 'url(#kaCopa4)', '#1E4A1E'], [752, 488, 34, 24, 'url(#kaCopa1)', '#2E5A1E'], [800, 430, 30, 26, 'url(#kaCopa2)', '#1E4A3A']].map(([x, y, rx, ry, c2, e]) => `<path d="${copa(x, y, rx, ry, 11, .3)}" fill="${c2}" stroke="${e}" stroke-width="1.8"/><path d="M${x - rx * .6} ${y - ry * .3} q${rx * .4} -${ry * .6} ${rx * .9} -${ry * .5}" stroke="#D8F4B0" stroke-width="2.2" fill="none" opacity=".7" stroke-linecap="round"/>`).join('')}<g>${[[766, 452], [784, 470], [758, 478], [796, 446], [776, 438]].map(([x, y]) => `<g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${F(x + Math.cos(k * 1.256) * 2.6)}" cy="${F(y + Math.sin(k * 1.256) * 2.6)}" r="2" fill="#FF8AC8" stroke="#A83A7A" stroke-width=".5"/>`).join('')}<circle cx="${x}" cy="${y}" r="1.4" fill="#FFE27A"/></g>`).join('')}</g></g>
    <g pointer-events="none"><g class="balanca" style="transform-origin:830px -30px;animation-duration:7s">${[150, 165, 180, 196, 128].map((g, i) => { const a = g * Math.PI / 180, L = 120 - i * 8, cx = 830 + Math.cos(a) * L * .55, cy = -30 + Math.sin(a) * L * .55 + 40; let d = `M${F(cx)} ${F(cy)}`; for (let j = 0; j <= 10; j++) { const b = a - .5 + j * .1, r = L * (j % 2 ? .4 : .5); d += ` L${F(cx + Math.cos(b) * r)} ${F(cy + Math.sin(b) * r + r * .35)}`; } return `<path d="M830 -30 L${F(cx)} ${F(cy)}" stroke="#4E5A22" stroke-width="3"/><path d="${d}Z" fill="url(#kaPalmeira)" stroke="#1E4A1E" stroke-width="1.3" stroke-linejoin="round"/>${Array.from({ length:5 }, (_, j) => { const b = a - .4 + j * .2; return `<path d="M${F(cx)} ${F(cy)} L${F(cx + Math.cos(b) * L * .42)} ${F(cy + Math.sin(b) * L * .42 + L * .15)}" stroke="#2E6A2A" stroke-width=".9" opacity=".7"/>`; }).join('')}`; }).join('')}</g></g>
    <g id="ka-seri" class="toque" data-fig="seriema"><g id="ka-seri-in" style="transform-origin:58px 388px"><svg x="10" y="264" width="96" height="125" viewBox="0 0 100 130"><use href="#f-seriema"/></svg></g><rect x="20" y="268" width="80" height="120" fill="transparent"/>${brilhoHotspot(96, 282)}</g>
  `;
  const mesasLonge = `M0 210 L0 150 L30 136 L170 130 L196 142 L232 152 L300 150 L326 128 L520 122 L552 138 L596 152 L690 150 L722 130 L900 126 L930 140 L980 152 L1100 148 V210Z`;
  const mesasPerto = `M0 230 L0 176 C20 170 40 160 60 158 L190 156 C214 166 230 182 262 186 C300 190 330 178 360 168 L410 166 C430 176 456 190 490 192 L560 190 C590 180 610 166 640 162 L820 160 C850 170 870 186 900 190 C940 194 980 180 1010 172 L1100 170 V230Z`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Território Kalunga, em Goiás: trilha até uma cachoeira de água azul-turquesa, uma nascente, a comunidade com casas de adobe, a escola e a roça na beira do rio Paranã">
    <defs>
      ${lg('kaCeu', '#5EB4EE', '#FFE9C4')}${rg('kaSol', '#FFFBE0', '#FFD25A', '#F2A62A', .5, .5)}
      ${lg('kaMesaL', '#B4B2DA', '#C9CBE6')}${lg('kaMesaP', '#B07E7A', '#9A8A9A')}${lg('kaNevoa', 'rgba(255,240,220,0)', 'rgba(255,240,220,.75)')}
      ${lg('kaMorroS', '#D8BC6E', '#B8944A')}${lg('kaMorroV', '#9CC85A', '#5E9A3A')}${lg('kaMorroB', '#B9C46A', '#8EA448')}
      ${lg('kaChaoS', '#D9B870', '#B88E4E')}${lg('kaChaoV', '#8EC058', '#5A9238')}${lg('kaChaoB', '#B4BC5E', '#869A3E')}
      ${lg('kaRocha', '#D99E74', '#8E5442', .3, 1)}${lg('kaRochaE', '#9A6250', '#5E342A')}${lg('kaQueda', '#FFFFFF', '#C8F2F2')}
      ${rg('kaPocoT', '#9AF6EC', '#26C2C8', '#0E7896', .5, .4)}${rg('kaPocoM', '#9AA27A', '#7A8A5A', '#4E5E3A', .5, .4)}
      ${lg('kaAreia', '#F2DEAA', '#D2B47A')}${lg('kaRio', '#5CB8C4', '#1E6A86')}${lg('kaRioV', '#4EC2D2', '#1A5E8A')}
      ${lg('kaAdobe', '#D9A272', '#A86A44')}${lg('kaPalha', '#F2D27A', '#B8902E')}${lg('kaMadeira', '#B07A4A', '#6E4224')}
      ${lg('kaParede', '#FFF8EC', '#EADCC6')}${lg('kaTelha', '#E2704A', '#9E3A22')}${lg('kaSolar', '#3E62B0', '#14244A', 1, 1)}
      ${lg('kaVereda', '#6EBE6A', '#2E7A44')}${lg('kaPalmeira', '#9AD05A', '#3E8A3A')}${lg('kaTrilha', '#EAD2A0', '#C8A46A')}
      ${lg('kaTerra', '#8A5A3A', '#5E3A22')}${lg('kaTerraS', '#C8925E', '#9A6A42')}${lg('kaBalaio', '#E8C27A', '#A87A3A')}${lg('kaCuia', '#C88A4A', '#7A4A22')}
      ${lg('kaMilho', '#FFE27A', '#F2A81E')}${rg('kaAbobora', '#FFC870', '#F28A1E', '#C8580A')}${lg('kaFolhaM', '#9AD05A', '#3E8A2E')}${lg('kaFolhaF', '#7CC85A', '#2E7A2A')}
      ${lg('kaCopa1', '#8EB850', '#5A8A32')}${lg('kaCopa2', '#6EA88A', '#3E7A5E')}${lg('kaCopa3', '#B2C25A', '#7A9638')}${lg('kaCopa4', '#5E9A4A', '#2E6A2E')}${lg('kaCopaS', '#C8B05A', '#9A8A3A')}
      ${lg('kaMuda1', '#7ED0A0', '#2E8A5A')}${lg('kaMuda2', '#D8E86A', '#8AA82A')}${lg('kaMuda3', '#FF9A7A', '#B8463A')}${lg('kaMuda4', '#5EB86A', '#1E6A3A')}
      ${lg('kaSaco', '#5E8A3A', '#2E5A1E')}${rg('kaPote', '#E8A070', '#C0663A', '#8A3E1E')}${lg('kaCupim', '#D29A6A', '#9A5E3A')}
      ${rg('kaPeleA', '#9A6440', '#6E4028', '#4A2614')}${rg('kaPeleB', '#C08A5E', '#94603C', '#6A3E22')}${rg('kaPeleC', '#F0BE92', '#C88E62', '#9A6440')}${rg('kaPeleD', '#FFE6D2', '#EDC2A0', '#C8987A')}
      ${lg('kaRGuia', '#4EC09A', '#1E7A5A')}${lg('kaRTur', '#FF9A88', '#D8503E')}${lg('kaRMen', '#FFE07A', '#F2A81E')}${lg('kaRAnc', '#8AA8F0', '#3E5AB0')}${lg('kaRAgr', '#FFFFFF', '#C8D2E2')}
      <radialGradient id="kaVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#2A1A0A" stop-opacity="0"/><stop offset="1" stop-color="#2A1A0A" stop-opacity=".32"/></radialGradient>
      <radialGradient id="kaLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></radialGradient>
      <linearGradient id="kaArco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF5A5A"/><stop offset=".2" stop-color="#FFB03A"/><stop offset=".4" stop-color="#FFE84A"/><stop offset=".6" stop-color="#5AD06A"/><stop offset=".8" stop-color="#4A9AFF"/><stop offset="1" stop-color="#9A5AE8"/></linearGradient>
      <clipPath id="kaPenClip"><path d="M520 352 L532 270 L546 196 L566 128 L586 78 L612 52 L650 42 L700 38 L760 30 L800 28 V372 L760 360 L690 352 L600 356Z"/></clipPath>${lg('kaMolhado', '#4A2A22', '#2A1610', 1, 0)}${lg('kaMusgo', '#8CC85A', '#3E7A2E')}
      <filter id="kaNeb" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
      <pattern id="kaCaus" width="60" height="22" patternUnits="userSpaceOnUse"><path d="M0 11 C8 3 16 19 24 9 C32 1 40 17 48 10 C54 6 58 13 60 11 M6 20 C14 15 20 22 28 18 M36 3 C42 0 48 6 54 2" stroke="#fff" stroke-width="1.4" fill="none"/></pattern>
      <clipPath id="kaPocoClip"><ellipse cx="650" cy="362" rx="152" ry="40"/></clipPath>
      <filter id="kaGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
      <filter id="kaDesf"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#kaCeu)"/>
    <circle cx="470" cy="62" r="62" fill="url(#kaLuz)"/><circle cx="470" cy="62" r="24" fill="url(#kaSol)" stroke="#F2A62A" stroke-width="2"/><path d="M458 52 q7 -8 18 -8" stroke="#FFFBE0" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <g class="deriva"><use href="#nuvem" x="90" y="26" width="96" height="46" style="color:#fff" opacity=".85"/><use href="#nuvem" x="360" y="54" width="70" height="32" style="color:#fff" opacity=".7"/></g>
    <g id="ka-fundo" transform="translate(-280 0)">
      <path d="${mesasLonge}" fill="url(#kaMesaL)"/>
      <path d="${[[30, 136, 170], [326, 128, 520], [722, 130, 900]].map(([a, y, b]) => Array.from({ length:Math.floor((b - a) / 14) }, (_, i) => `M${a + 8 + i * 14} ${y + 4} v${F(R(6, 14))}`).join(' ')).join(' ')}" stroke="#9A98C4" stroke-width="2" opacity=".6"/>
      <path d="M30 136 L170 130 M326 128 L520 122 M722 130 L900 126" stroke="#E6E4F6" stroke-width="2" opacity=".8"/>
      ${[[30, 136, 170], [326, 128, 520], [722, 130, 900]].map(([a, y, b]) => `<path d="M${a} ${y} L${b} ${y - 4} L${b + 8} ${y + 14} L${a - 10} ${y + 18}Z" fill="#9C98C8" opacity=".35"/><path d="M${a - 10} ${y + 18} L${a} ${y} L${a + 22} ${y + 18}Z" fill="#E0DEF4" opacity=".6"/>`).join('')}
      <rect y="120" width="1100" height="90" fill="url(#kaNevoa)" opacity=".7"/>
      <path d="${mesasPerto}" fill="url(#kaMesaP)"/>
      ${[[60, 158, 190], [360, 168, 410], [640, 162, 820], [1010, 172, 1100]].map(([a, y, b]) => `<path d="M${a} ${y} L${b} ${y - 2} L${b + 6} ${y + 18} L${a - 8} ${y + 20}Z" fill="#8A5E62" opacity=".32"/><path d="M${a - 8} ${y + 20} L${a} ${y} L${a + 26} ${y + 20}Z" fill="#F2C2AA" opacity=".45"/><path d="M${b + 6} ${y + 18} C${b + 30} ${y + 30} ${b + 40} ${y + 44} ${b + 60} ${y + 52}" stroke="#7A5060" stroke-width="2" fill="none" opacity=".35"/>`).join('')}
      <path d="${[[60, 158, 190], [360, 168, 410], [640, 162, 820], [1010, 172, 1100]].map(([a, y, b]) => Array.from({ length:Math.floor((b - a) / 11) }, (_, i) => `M${a + 6 + i * 11} ${y + 3} v${F(R(8, 18))}`).join(' ')).join(' ')}" stroke="#7A5A62" stroke-width="2.2" opacity=".55"/>
      <path d="M60 158 L190 156 M360 168 L410 166 M640 162 L820 160 M1010 172 L1100 170" stroke="#F2C8B0" stroke-width="2.2" opacity=".8"/>
      <rect y="150" width="1100" height="80" fill="url(#kaNevoa)"/>
    </g>
    <g id="ka-mundo" transform="translate(-800 0)">
      <g id="ka-vistaA">${vistaA}</g>
      <g id="ka-vistaB" transform="translate(800 0)">${vistaB}</g>
    </g>
    <g id="ka-frente">${frente}</g>
    <g id="ka-mao" pointer-events="none"></g>
    <rect width="800" height="500" fill="url(#kaVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#kaGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mundo = el(s, '#ka-mundo'), fundoP = el(s, '#ka-fundo');
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  const scrB = x => x + 800 + camX, scrA = x => x + camX;
  const locB = p => ({ x:p.x - 800 - camX, y:p.y }), locA = p => ({ x:p.x - camX, y:p.y });
  /* animações contínuas */
  s.querySelectorAll('.ka-veio').forEach((v, i) => v.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-(60 + i * 14) }], { duration:700 + i * 60, iterations:Infinity }));
  s.querySelectorAll('.ka-fluxo').forEach(v => v.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-54 }], { duration:2600, iterations:Infinity }));
  el(s, '#ka-caus').animate([{ transform:'translate(0,0)' }, { transform:'translate(-60px,0)' }], { duration:7000, iterations:Infinity });
  el(s, '#ka-corrego-fluxo').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:1400, iterations:Infinity });
  s.querySelectorAll('.ka-onda').forEach((o, i) => o.animate([{ opacity:.9, transform:'scale(.6)' }, { opacity:0, transform:'scale(1.15)' }], { duration:2400, delay:i * 800, iterations:Infinity }));
  s.querySelectorAll('.ka-onda').forEach(o => { o.style.transformOrigin = '670px 344px'; });
  el(s, '.ka-borbulha').animate([{ transform:'scale(.4)', opacity:1 }, { transform:'scale(1.8)', opacity:0 }], { duration:1500, iterations:Infinity });
  el(s, '.ka-borbulha').style.transformOrigin = '302px 321px';
  const dicas = [el(s, '#ka-dica-0'), el(s, '#ka-dica-c')];
  dicas.forEach(d => el(d, 'path').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:900, iterations:Infinity }));
  /* câmera */
  function pan(x1, ms, fim){
    const x0 = camX, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camX = x0 + (x1 - x0) * e; mundo.setAttribute('transform', `translate(${F(camX)} 0)`); fundoP.setAttribute('transform', `translate(${F(camX * .35)} 0)`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  /* ---------- 1. trilha: guiar o grupo sem pisar na nascente ---------- */
  const amostra = sel => { const p = el(s, sel), L = p.getTotalLength(), pts = []; for (let d = 0; d <= L; d += 3) { const q = p.getPointAtLength(d); pts.push({ x:q.x, y:q.y, d }); } return { L, pts, em:d => p.getPointAtLength(Math.max(0, Math.min(L, d))) }; };
  const TR = { tr0:amostra('#ka-tr0'), tre:amostra('#ka-tre'), trc:amostra('#ka-trc') };
  const PISA = 62;
  let rota = 'tr0', dist = 0, gX = 176, gY = 488, vira = 1, andando = 0, arrG = null, auto = null;
  const gpos = el(s, '#ka-grupo-pos'), gvira = el(s, '#ka-grupo-vira'), ganda = el(s, '#ka-grupo-anda');
  const poeGrupo = () => {
    const q = TR[rota].em(dist), dx = q.x - gX;
    if (Math.abs(dx) > .4) vira = dx < 0 ? -1 : 1;
    if (Math.hypot(q.x - gX, q.y - gY) > .3) andando = performance.now();
    gX = q.x; gY = q.y; gpos.setAttribute('transform', `translate(${F(gX)} ${F(gY)})`); gvira.setAttribute('transform', vira < 0 ? 'scale(-1 1)' : '');
  };
  const maisPerto = (tr, x, y, d0, d1) => { let m = null, md = 1e9; tr.pts.forEach(p => { if (p.d < d0 || p.d > d1) return; const dd = Math.hypot(p.x - x, p.y - y); if (dd < md) { md = dd; m = p; } }); return { p:m, dist:md }; };
  let errosTrilha = 0;
  function pisouNascente(){
    arrG = null; auto = null; ocupado = true; toca('glub'); errosTrilha++;
    el(s, '#ka-nascente').animate([{ opacity:1 }, { opacity:.4 }, { opacity:1 }], { duration:500, iterations:3 });
    c.brilhos(scrB(300), 320, 4, '#7FE8FF');
    api.diz('Opa! Ali é a nascente, onde a água brota do chão. Se a gente pisa, a terra fica dura e a água não entra. Siga pelo caminho de pedras!');
    el(s, '#ka-dica-c').style.display = '';
    andaAte('tre', 0, 1100, () => { rota = 'tr0'; dist = TR.tr0.L; ocupado = false; });
  }
  function andaAte(r, d1, ms, fim){
    const d0 = dist, t0 = performance.now(); rota = r;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); dist = d0 + (d1 - d0) * k; poeGrupo(); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0);
  }
  function chegouCachoeira(){
    fase = 'chegou'; arrG = null; el(s, '#ka-dica-c').style.display = 'none'; toca('vitoria'); c.brilhos(scrB(560), 360, 8, '#FFE27A');
    chip('Trilha: chegamos!');
    api.diz('Chegamos à cachoeira! Os guias Kalunga conhecem cada trilha e ensinam os visitantes a cuidar das águas.');
    depois(2600, () => { foto(); });
    depois(5200, () => api.diz('Agora vamos até a comunidade, na beira do rio Paranã.'));
    depois(8200, () => pan(0, 2600, comecaRoca));
  }
  function foto(){
    const fl = el(s, '#ka-flash'); fl.setAttribute('transform', `translate(${F(gX - 18)} ${F(gY - 96)})`);
    fl.animate([{ opacity:0 }, { opacity:.95 }, { opacity:0 }], { duration:500 }); somOn && tom(2200, 0, .05, 'square', .04, 1800); somOn && tom(1200, .06, .08, 'square', .03, 900);
  }
  el(s, '#ka-grupo').addEventListener('pointerdown', e => {
    if (fase !== 'trilha' || ocupado) return; e.stopPropagation();
    const p = locB(c.ponto(e)); arrG = { x0:p.x, y0:p.y, ox:p.x - gX, oy:p.y - gY, moveu:false }; auto = null; s.setPointerCapture(e.pointerId); el(s, '#ka-dica-0').style.display = 'none'; toca('clique');
  });
  s.addEventListener('pointermove', e => {
    if (!arrG || ocupado) return; const p0 = locB(c.ponto(e));
    if (Math.hypot(p0.x - arrG.x0, p0.y - arrG.y0) > 8) arrG.moveu = true;
    const p = { x:p0.x - arrG.ox, y:p0.y - arrG.oy };
    if (rota === 'tr0') {
      const m = maisPerto(TR.tr0, p.x, p.y, dist - 20, dist + 50); if (m.p && m.dist < 90) dist = Math.max(dist - 10, m.p.d);
      if (dist >= TR.tr0.L - 3) {
        const e1 = maisPerto(TR.tre, p.x, p.y, 0, 80), e2 = maisPerto(TR.trc, p.x, p.y, 0, 80), dF = Math.hypot(p.x - 226, p.y - 410);
        if (dF > 14) { if (e1.dist < e2.dist) { rota = 'tre'; dist = 0; } else { rota = 'trc'; dist = 0; } }
      }
    } else {
      const tr = TR[rota], m = maisPerto(tr, p.x, p.y, dist - 20, dist + 50);
      if (m.p && m.dist < 90) dist = Math.max(dist - 10, m.p.d);
    }
    poeGrupo();
    if (rota === 'tre' && dist >= PISA) pisouNascente();
    else if (rota === 'trc' && dist >= TR.trc.L - 4) chegouCachoeira();
  });
  s.addEventListener('pointerup', () => {
    if (!arrG) return; const m = arrG.moveu; arrG = null;
    if (!m && fase === 'trilha') { toca('pop'); api.diz('Arraste o grupo pela trilha. Ou toque no caminho que você escolher!'); }
  });
  /* toque no caminho: o grupo anda sozinho */
  const vaiPor = r => {
    if (fase !== 'trilha' || ocupado) return; ocupado = true; el(s, '#ka-dica-0').style.display = 'none';
    const segue = () => { if (r === 'tre') andaAte('tre', PISA, 1200, () => { ocupado = false; pisouNascente(); }); else andaAte('trc', TR.trc.L, 2600, () => { ocupado = false; chegouCachoeira(); }); };
    if (rota === 'tr0' && dist < TR.tr0.L) andaAte('tr0', TR.tr0.L, 1400 * (1 - dist / TR.tr0.L) + 100, () => { dist = 0; segue(); });
    else { if (rota !== r) dist = 0; segue(); }
  };
  el(s, '#ka-hit-e').addEventListener('click', e => { e.stopPropagation(); vaiPor('tre'); });
  el(s, '#ka-hit-c').addEventListener('click', e => { e.stopPropagation(); vaiPor('trc'); });
  /* ---------- 2. roça: chamar as chuvas e plantar ---------- */
  let chuvas = 0, plantas = 0;
  function comecaRoca(){
    fase = 'chuva'; chip('Chuva: 0/3'); el(s, '#ka-nuv-hint').style.display = '';
    api.diz('Esta é a roça da comunidade. É tempo da seca, a terra está dura e seca. Toque nas nuvens para chegar o tempo das águas!');
  }
  el(s, '#ka-nuvens').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'chuva') { toca('pop'); api.diz(fase === 'plantar' || fase === 'cresce' ? 'Chuva boa! No Cerrado chove de outubro até abril, mais ou menos.' : 'No Cerrado o ano tem dois tempos: o tempo da seca e o tempo das águas.'); return; }
    if (ocupado) return; chuvas++; toca('chuva');
    el(s, '#ka-nuv-in').style.transform = `scale(${(1 + chuvas * .16).toFixed(2)})`;
    el(s, '#ka-nuv-cinza').style.opacity = Math.min(1, chuvas * .45); el(s, '#ka-nuv-branca').style.opacity = chuvas >= 2 ? 0 : 1;
    for (let i = 0; i < 6; i++) c.add({ tipo:'vapor', x0:sorte(100, 700), y0:sorte(300, 420), x1:640 + sorte(-40, 40), y1:70 + sorte(-10, 10), dur:sorte(60, 90), f:sorte(0, 6), r:sorte(3, 5), x:0, y:0 });
    chip(`Chuva: ${chuvas}/3`);
    if (chuvas === 1) api.diz('As nuvens estão crescendo...');
    if (chuvas === 3) { el(s, '#ka-nuv-hint').style.display = 'none'; ocupado = true; chegaChuva(); }
  });
  function chegaChuva(){
    toca('chuva'); c.chover(20, 790, 90, 430, 160, '#3D8BFF'); depois(1100, () => c.chover(20, 790, 90, 430, 120, '#5AA0FF'));
    api.diz('Chegou o tempo das águas! A chuva molha a terra e enche o rio.');
    depois(1400, () => {
      s.querySelectorAll('.ka-verde').forEach(g => g.style.opacity = 1); s.querySelectorAll('.ka-seco').forEach(g => g.style.opacity = 0);
      el(s, '#ka-rio-agua').setAttribute('fill', 'url(#kaRioV)'); el(s, '#ka-rio-agua').style.transform = 'translateY(-6px)';
      for (let i = 0; i < 26; i++) c.add({ tipo:'petala', x:scrA(256) + sorte(-50, 50), y:sorte(160, 230), vy:sorte(.6, 1.2), f:sorte(0, 6), chao:sorte(300, 330), cor:'#F2C230', borda:'#A87A0A' });
    });
    depois(4200, () => { el(s, '#ka-nuv-in').style.transform = 'scale(1)'; el(s, '#ka-nuv-cinza').style.opacity = 0; el(s, '#ka-nuv-branca').style.opacity = 1; ocupado = false; comecaPlantar(); });
  }
  function comecaPlantar(){
    fase = 'plantar'; chip('Roça: 0/4'); s.querySelectorAll('.ka-cova-hint').forEach(h => h.style.display = '');
    api.diz('Agora é hora de plantar! Arraste as sementes do balaio para as covas da roça.');
  }
  const sems = [...s.querySelectorAll('.ka-sem')], semPos = SEMS.map(m => ({ x:m.x, y:m.y, foi:false }));
  const covaLivre = new Array(4).fill(true);
  let arrS = null;
  const poeSem = i => sems[i].setAttribute('transform', `translate(${F(semPos[i].x)} ${F(semPos[i].y)})`);
  sems.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (semPos[i].foi || ocupado) return; e.stopPropagation();
    if (fase !== 'plantar') { toca('clique'); api.diz(fase === 'chuva' ? 'Com a terra seca, a semente não brota. Primeiro toque nas nuvens!' : 'Sementes de mandioca, milho, feijão e abóbora.'); return; }
    const p = locA(c.ponto(e)); arrS = { i, dx:p.x - semPos[i].x, dy:p.y - semPos[i].y, x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique');
  }));
  s.addEventListener('pointermove', e => { if (!arrS) return; const p = locA(c.ponto(e)); if (Math.hypot(p.x - arrS.x0, p.y - arrS.y0) > 8) arrS.moveu = true; semPos[arrS.i].x = Math.max(10, Math.min(790, p.x - arrS.dx)); semPos[arrS.i].y = Math.max(40, Math.min(490, p.y - arrS.dy)); poeSem(arrS.i); });
  s.addEventListener('pointerup', () => {
    if (!arrS) return; const { i, moveu } = arrS; arrS = null; sems[i].style.cursor = 'grab'; const p = semPos[i];
    if (!moveu) { const k = covaLivre.indexOf(true); if (k >= 0) return voaSem(i, k); return; }
    let k = -1, md = 46; COVAS.forEach((v, j) => { const d = Math.hypot(p.x - v.x, p.y - v.y); if (covaLivre[j] && d < md) { md = d; k = j; } });
    if (k >= 0) return voaSem(i, k);
    if (p.x > 470 && p.y > 380 && p.y < 430) { toca('glub'); api.diz('Aqui não! As árvores da beira do rio seguram a terra e protegem a água. A roça fica mais para cima.'); }
    else toca('glub');
    voltaSem(i);
  });
  function anima(i, x1, y1, ms, fim){ const x0 = semPos[i].x, y0 = semPos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); semPos[i].x = x0 + (x1 - x0) * e; semPos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 36; poeSem(i); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0); }
  const voltaSem = i => anima(i, SEMS[i].x, SEMS[i].y, 600);
  function voaSem(i, k){
    covaLivre[k] = false; semPos[i].foi = true; const v = COVAS[k], t = SEMS[i].t;
    anima(i, v.x, v.y - 4, 700, () => {
      sems[i].style.display = 'none'; plantas++; toca('planta');
      const cova = s.querySelector(`.ka-cova[data-i="${k}"]`); el(cova, '.ka-cova-hint').style.display = 'none';
      const pl = el(cova, '.ka-planta'); el(pl, 'g').innerHTML = PLANTA[t];
      for (let j = 0; j < 4; j++) c.add({ tipo:'respingo', x:scrA(v.x) + sorte(-6, 6), y:v.y, t:j, cor:'#7A4A22' });
      requestAnimationFrame(() => { pl.style.transform = 'scale(.35)'; }); depois(1200, () => { pl.style.transform = plantas >= 4 ? 'scale(1)' : 'scale(.6)'; });
      c.brilhos(scrA(v.x), v.y - 20, 5, '#FFE27A');
      chip(`Roça: ${plantas}/4`);
      const falas = { mandioca:'Mandioca! Dela as famílias fazem a farinha.', milho:'Milho! Ele cresce alto e dá espigas.', feijao:'Feijão! Ele também deixa a terra mais forte.', abobora:'Abóbora! As folhas grandes cobrem o chão e guardam a umidade.' };
      if (plantas < 4) api.diz(falas[t]);
      else { depois(800, () => { s.querySelectorAll('.ka-planta').forEach(q => q.style.transform = 'scale(1)'); toca('vitoria'); }); api.diz(falas[t] + ' A roça está plantada! Plantar no tempo certo é um saber antigo do povo Kalunga.'); depois(6200, voltaNascente); }
    });
  }
  function voltaNascente(){ fase = 'volta'; api.diz('Vamos voltar à cachoeira. A nascente precisa da nossa ajuda!'); depois(2400, () => pan(-800, 2600, comecaMudas)); }
  /* ---------- 3. nascente: mudas nativas e lixo ---------- */
  let mudas = 0, lixos = 0;
  function comecaMudas(){
    fase = 'mudas'; chip('Mudas: 0/4'); s.querySelectorAll('.ka-muda-hint').forEach(h => h.style.display = '');
    api.diz('A trilha velha machucou a nascente. Toque em volta dela para plantar mudas do Cerrado!');
  }
  s.querySelectorAll('.ka-muda').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'mudas' || g.dataset.feito) { if (fase !== 'mudas') { toca('clique'); api.diz('Ao redor da nascente o chão fica úmido, cheio de plantas.'); } return; }
    g.dataset.feito = 1; const i = +g.dataset.i, m = MUDAS[i]; mudas++;
    el(g, '.ka-cova3').style.display = 'none'; el(g, '.ka-muda-in').style.transform = 'scale(1)'; toca('planta'); c.brilhos(scrB(m.x), m.y - 24, 5, '#C8FF9A');
    el(s, '#ka-pisado').style.opacity = F(1 - mudas / 4); el(s, '#ka-tre-velha').style.opacity = F(.35 * (1 - mudas / 4));
    el(s, '#ka-corrego').setAttribute('stroke-width', F(3 + mudas * 1.2));
    chip(`Mudas: ${mudas}/4`);
    if (mudas === 1) api.diz('As raízes seguram a terra e ajudam a água da chuva a entrar no chão.');
    if (mudas === 3) api.diz('Olha o corregozinho: a água da nascente está correndo mais forte!');
    if (mudas === 4) { toca('ok'); depois(2200, comecaLixo); }
  }));
  function comecaLixo(){
    fase = 'lixo'; chip('Lixo: 0/4'); el(s, '#ka-saco-hint').style.display = '';
    api.diz('Visitantes deixaram lixo no caminho. Arraste o lixo até o saco verde!');
  }
  const lix = [...s.querySelectorAll('.ka-lixo')], lixPos = LIXO.map(l => ({ x:l.x, y:l.y, foi:false }));
  const poeLixo = (i, k) => lix[i].setAttribute('transform', `translate(${F(lixPos[i].x)} ${F(lixPos[i].y)})${k ? ` scale(${F(k)})` : ''}`);
  let arrL = null;
  lix.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (lixPos[i].foi || ocupado) return; e.stopPropagation();
    if (fase !== 'lixo') { toca('clique'); api.diz('Lixo jogado na natureza vai parar na água.'); return; }
    const p = locB(c.ponto(e)); arrL = { i, dx:p.x - lixPos[i].x, dy:p.y - lixPos[i].y, x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique');
  }));
  s.addEventListener('pointermove', e => { if (!arrL) return; const p = locB(c.ponto(e)); if (Math.hypot(p.x - arrL.x0, p.y - arrL.y0) > 8) arrL.moveu = true; lixPos[arrL.i].x = Math.max(10, Math.min(790, p.x - arrL.dx)); lixPos[arrL.i].y = Math.max(40, Math.min(490, p.y - arrL.dy)); poeLixo(arrL.i); });
  s.addEventListener('pointerup', () => {
    if (!arrL) return; const { i, moveu } = arrL; arrL = null; lix[i].style.cursor = 'grab';
    if (!moveu || Math.hypot(lixPos[i].x - SACO.x, lixPos[i].y - SACO.y) < 70) recolhe(i);
    else { toca('glub'); voaLixo(i, LIXO[i].x, LIXO[i].y, 600, 1); }
  });
  function voaLixo(i, x1, y1, ms, k1, fim){ const x0 = lixPos[i].x, y0 = lixPos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); lixPos[i].x = x0 + (x1 - x0) * e; lixPos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 44; poeLixo(i, 1 + (k1 - 1) * e); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0); }
  function recolhe(i){
    lixPos[i].foi = true; if (LIXO[i].id === 'copo') for (let j = 0; j < 3; j++) c.add({ tipo:'respingo', x:scrB(lixPos[i].x), y:lixPos[i].y + 8, t:j * 2, cor:'#E6FFFF' });
    voaLixo(i, SACO.x, SACO.y - 8, 800, .3, () => {
      lix[i].style.display = 'none'; lixos++; toca('pop'); c.brilhos(scrB(SACO.x), SACO.y - 16, 5, '#FFE27A'); chip(`Lixo: ${lixos}/4`);
      el(s, '#ka-saco').animate([{ transform:'scale(1)' }, { transform:'scale(1.06,.94)' }, { transform:'scale(1)' }], { duration:300 }); el(s, '#ka-saco').style.transformOrigin = `${SACO.x}px ${SACO.y + 20}px`;
      const falas = { lata:'A lata vai para a reciclagem.', pacote:'Pacote de salgadinho perto da nascente, não!', garrafa:'A garrafa de plástico levaria centenas de anos para sumir.', copo:'Tirou o copo do poço! A água agradece.' };
      if (lixos < 4) api.diz(falas[LIXO[i].id]); else aguaLimpa();
    });
  }
  function aguaLimpa(){
    fase = 'fim'; el(s, '#ka-saco-hint').style.display = 'none'; toca('vitoria');
    el(s, '#ka-turvo').style.opacity = 0; el(s, '#ka-brilhos-poco').style.opacity = 1; el(s, '#ka-peixes').style.opacity = 1; el(s, '#ka-arco').style.opacity = 1;
    c.brilhos(scrB(650), 360, 14, '#FFFFFF'); depois(600, () => c.brilhos(scrB(600), 380, 10, '#9AF6EC'));
    chip('Água cristalina!');
    api.diz('A água ficou cristalina e azul-turquesa! Cuidar da nascente é cuidar da cachoeira, do rio e de todo mundo.');
    depois(5600, () => { toca('vitoria'); api.diz('O povo Kalunga cuida destas terras e águas há mais de 200 anos. Obrigada por ajudar!'); depois(6200, api.fim); });
  }
  /* ---------- toques extras ---------- */
  const canto = () => { if (!somOn) return; [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => setTimeout(() => somOn && tom(760 + i * 70, 0, .13, 'square', .028, 1150 + i * 90), i * 125)); };
  el(s, '#ka-seri').addEventListener('click', () => {
    canto(); el(s, '#ka-seri-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-7deg) scale(1.04)' }, { transform:'rotate(4deg)' }, { transform:'rotate(-5deg) scale(1.03)' }, { transform:'rotate(0)' }], { duration:1100 });
    api.diz(fase === 'trilha' ? 'Sou a Seri, uma seriema! Meu canto parece uma risada e dá para ouvir de longe.' : 'A seriema corre rápido pelo campo e come insetos, lagartos e até cobras.');
  });
  el(s, '#ka-queda').addEventListener('click', e => {
    e.stopPropagation(); toca('splash'); el(s, '#ka-arco').style.opacity = 1;
    for (let i = 0; i < 18; i++) c.add({ tipo:'vapor', x0:scrB(670) + sorte(-30, 30), y0:340, x1:scrB(670) + sorte(-70, 70), y1:sorte(250, 300), dur:sorte(40, 70), f:sorte(0, 6), r:sorte(2, 5), x:0, y:0 });
    for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:scrB(640 + i * 18), y:344, t:i * 2, cor:'#E6FFFF' });
    api.diz(fase === 'fim' ? 'Um arco-íris na névoa da cachoeira!' : 'A cachoeira cai das pedras e forma um poço. A água vem das nascentes lá de cima.');
    if (fase !== 'fim') depois(2600, () => { el(s, '#ka-arco').style.opacity = 0; });
  });
  let araOc = false;
  el(s, '#ka-araras').addEventListener('click', e => {
    e.stopPropagation(); if (araOc) return; araOc = true; [1500, 1100, 1700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sawtooth', .025, f * .6), i * 160));
    const a = el(s, '#ka-araras-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(-160px,40px)' }, { transform:'translate(-300px,-10px)' }, { transform:'translate(-120px,-30px)' }, { transform:'translate(0,0)' }], { duration:4200, easing:'ease-in-out' });
    a.onfinish = () => { araOc = false; };
    api.diz('Araras-canindé! Elas fazem ninho em buracos de árvores e de paredões.');
  });
  let patoOc = false;
  el(s, '#ka-pato').addEventListener('click', () => {
    if (patoOc) return; patoOc = true; toca('splash'); const pi = el(s, '#ka-pato-in');
    pi.style.transform = 'translate(0,16px)'; pi.style.opacity = 0;
    depois(200, () => { for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:scrB(584), y:384, t:i * 2, cor:'#E6FFFF' }); });
    depois(1700, () => { pi.style.transform = 'translate(36px,0)'; pi.style.opacity = 1; toca('glub'); });
    depois(3600, () => { pi.style.transform = ''; patoOc = false; });
    api.diz('O pato-mergulhão mergulha para pegar peixes. Ele só vive em rios de água limpinha. É raro no mundo todo!');
  });
  let veadoOc = false;
  el(s, '#ka-veado').addEventListener('click', () => {
    if (veadoOc) return; veadoOc = true; somOn && tom(500, 0, .2, 'triangle', .04, 300);
    const v = el(s, '#ka-veado-in'); v.style.transform = 'translate(70px,-6px)'; depois(1600, () => { v.style.transform = ''; }); depois(3100, () => { veadoOc = false; });
    api.diz('O veado-campeiro vive nos campos abertos do Cerrado.');
  });
  el(s, '#ka-turista').addEventListener('click', e => { e.stopPropagation(); if (fase === 'trilha') return; foto(); api.diz('Clique! Uma foto da cachoeira para lembrar.'); });
  el(s, '#ka-menino').addEventListener('click', e => { if (fase === 'trilha') return; e.stopPropagation(); toca('pop'); s.querySelectorAll('#ka-menino .ka-aceno').forEach(b => b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-24deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:600, iterations:2 })); api.diz('Oi! Quero ver o pato-mergulhão!'); });
  el(s, '#ka-nascente').addEventListener('click', e => { e.stopPropagation(); toca('glub'); c.add({ tipo:'bolha', x:scrB(302), y:320, vy:.5, r:3, topo:300, f:0 }); api.diz('É uma nascente: a água da chuva entra no chão e brota aqui, devagarinho.'); });
  let pilOc = false;
  el(s, '#ka-pilao').addEventListener('click', e => {
    e.stopPropagation(); if (pilOc) return; pilOc = true;
    const m = el(s, '#ka-mao-pilao'); const a = m.animate([{ transform:'translateY(0)' }, { transform:'translateY(-22px)' }, { transform:'translateY(4px)' }, { transform:'translateY(-22px)' }, { transform:'translateY(4px)' }, { transform:'translateY(0)' }], { duration:1300 });
    [380, 900].forEach(t => setTimeout(() => somOn && tom(110, 0, .14, 'sine', .14, 60), t));
    a.onfinish = () => { pilOc = false; };
    api.diz('Tum, tum! A vovó soca os grãos no pilão, como faziam os mais velhos.');
  });
  el(s, '#ka-escola').addEventListener('click', e => {
    e.stopPropagation(); toca('ok'); s.querySelectorAll('.ka-luz').forEach(l => l.style.opacity = .55); c.brilhos(scrA(364), 214, 6, '#FFE27A');
    depois(2600, () => s.querySelectorAll('.ka-luz').forEach(l => l.style.opacity = 0));
    api.diz('A escola da comunidade tem placas solares: a luz do sol vira energia.');
  });
  let galOc = false;
  el(s, '#ka-galinha').addEventListener('click', e => {
    e.stopPropagation(); if (galOc) return; galOc = true; [0, 1, 2].forEach(i => setTimeout(() => somOn && tom(700 - i * 60, 0, .09, 'square', .03, 500), i * 130));
    const g = el(s, '#ka-gal-in'); const a = g.animate([{ transform:'rotate(0)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }], { duration:900 }); a.onfinish = () => { galOc = false; };
  });
  el(s, '#ka-baru').addEventListener('click', () => {
    const fr = [...s.querySelectorAll('.ka-baru-fruto')].find(f => !f.dataset.caiu); toca('pop');
    if (fr) { fr.dataset.caiu = 1; fr.animate([{ transform:'translateY(0)' }, { transform:`translateY(${F(400 - (+fr.querySelector('ellipse').getAttribute('cy')))}px)` }], { duration:700, easing:'ease-in', fill:'forwards' }); }
    api.diz('Um baru caiu! Dentro do fruto tem uma castanha gostosa do Cerrado.');
  });
  el(s, '#ka-agricultor').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz(fase === 'plantar' ? 'Me ajuda? Arraste as sementes para as covas da roça.' : 'Aqui a gente planta milho, feijão, mandioca e abóbora juntos, na mesma roça.'); });
  el(s, '#ka-ipe').addEventListener('click', e => { e.stopPropagation(); for (let i = 0; i < 10; i++) c.add({ tipo:'petala', x:scrA(256) + sorte(-50, 50), y:sorte(170, 220), vy:sorte(.6, 1.2), f:sorte(0, 6), chao:sorte(300, 330), cor:fase === 'chuva' ? '#F2C230' : '#9AD05A', borda:fase === 'chuva' ? '#A87A0A' : '#3E7A2A' }); api.diz('O ipê-amarelo floresce no fim da seca, quando quase não tem folhas.'); });
  el(s, '#ka-rioA').addEventListener('click', e => { e.stopPropagation(); const p = locA(c.ponto(e)); toca('splash'); for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:scrA(p.x), y:p.y, t:i * 2, cor:'#E6FFFF' }); api.diz('É o rio Paranã. Muitas comunidades Kalunga vivem nos vales deste rio e dos riachos que chegam nele.'); });
  /* névoa da cachoeira e peixinhos (canvas) */
  const nevoa = Array.from({ length:14 }, () => ({ x:sorte(-50, 50), y:sorte(0, 20), r:sorte(6, 14), f:sorte(0, 6) }));
  c.desenho(ctx => {
    const t = performance.now() / 1000, bx = scrB(670); if (bx < -100 || bx > 900) return;
    nevoa.forEach(n => { const x = bx + n.x + Math.sin(t * .8 + n.f) * 8, y = 336 - n.y - ((t * 12 + n.f * 10) % 26); ctx.globalAlpha = .18 + .1 * Math.sin(t + n.f); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y, n.r, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1;
    ganda.setAttribute('transform', performance.now() - andando < 160 ? `translate(0 ${F(-Math.abs(Math.sin(t * 12)) * 2.4)})` : '');
  });
  /* início */
  chip('Trilha até a cachoeira');
  api.diz('Oi! Eu sou a Seri, uma seriema. Aqui é o território Kalunga, em Goiás. Arraste o grupo pela trilha até a cachoeira, sem pisar na nascente!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
