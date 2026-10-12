/* ================= JOGO 22: Velho Chico, os povos do Rio São Francisco ================= */
function jogoVelhochico(palco, api){
  semente = 229;
  const AY = 196, DS = 17;
  const P0 = [150, 322], P1 = [300, 352], P2 = [420, 420], P3 = [530, 500];
  const START = { x:720, y:222 }, WP = [{ x:480, y:282 }, { x:350, y:232 }, { x:300, y:262 }], DOCK = { x:264, y:266 };
  const COROAS = [{ x:470, y:222, rx:58, ry:12 }, { x:370, y:302, rx:72, ry:15 }, { x:252, y:226, rx:46, ry:10 }];
  const COVAS = [{ x:626, y:284 }, { x:676, y:280 }, { x:726, y:276 }, { x:774, y:272 }];
  const ARV = ['caraibeira', 'inga', 'juazeiro', 'oiticica'];
  const SEM = ['feijao', 'milho', 'abobora', 'batata'], PLT = [.26, .47, .68], PLX = [.05, -.04, .08, -.02], ESC = [1.35, .82, 1.25, 1.3];
  const MUDA0 = { x:650, y:446 }, CUIA0 = { x:170, y:444 };
  let vivo = true, fase = 'navega', boias = 0, faixas = 0, plantadas = 0, arvores = 0, ocupado = false;
  let bx = START.x, by = START.y, virado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const F = n => n.toFixed(1);
  /* ---------- geometria da beira da vazante ---------- */
  const bz = t => { const u = 1 - t; return [u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0], u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1]]; };
  const nr = t => { const u = 1 - t, dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]), dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]), L = Math.hypot(dx, dy); return [dy / L, -dx / L]; };
  const tap = t => Math.pow(Math.max(0, Math.sin(Math.PI * t)), .6);
  const pt = (k, t) => { const b = bz(t), n = nr(t), o = DS * k * tap(t); return [b[0] + n[0] * o, b[1] + n[1] * o]; };
  const curva = (k, n = 44) => Array.from({ length:n + 1 }, (_, i) => pt(k, i / n));
  const linha = k => 'M' + curva(k).map(p => F(p[0]) + ' ' + F(p[1])).join(' L');
  const faixa = (k0, k1) => { const a = curva(k0), b = curva(k1).reverse(); return 'M' + a.map(p => F(p[0]) + ' ' + F(p[1])).join(' L') + ' L' + b.map(p => F(p[0]) + ' ' + F(p[1])).join(' L') + 'Z'; };
  const onde = (x, y) => { let best = 1e9, bt = 0; for (let i = 0; i <= 90; i++) { const t = i / 90, b = bz(t), d = (x - b[0]) ** 2 + (y - b[1]) ** 2; if (d < best) { best = d; bt = t; } }
    if (best > 130 * 130) return 9; const b = bz(bt), n = nr(bt), d = (x - b[0]) * n[0] + (y - b[1]) * n[1]; if (d < -3) return -1; return Math.floor(Math.max(0, d) / (DS * Math.max(.2, tap(bt)))); };
  const terraD = `M-10 288 C30 292 92 304 ${P0[0]} ${P0[1]} ` + curva(0).map(p => 'L' + F(p[0]) + ' ' + F(p[1])).join(' ') + ' L548 512 L-10 512Z';
  /* ---------- gente ---------- */
  const POSE = { baixo:[[14, -41], [15, -30]], aceno:[[19, -60], [23, -72]], frente:[[18, -44], [26, -44]], cima:[[17, -63], [21, -76]], cuia:[[18, -43], [12, -35]], quadril:[[19, -44], [11, -36]] };
  const braco = (lado, pose, o, id) => {
    const [[ex, ey], [hx, hy]] = POSE[pose], k = lado, sx = 10.6 * k;
    const g = `<path d="M${sx} -52 L${ex * k} ${ey}" stroke="${o.re}" stroke-width="6.8" stroke-linecap="round"/><path d="M${sx} -52 L${ex * k} ${ey}" stroke="${o.r0}" stroke-width="5" stroke-linecap="round"/>${o.mangaLonga ? `<path d="M${ex * k} ${ey} L${hx * k} ${hy}" stroke="${o.re}" stroke-width="5.8" stroke-linecap="round"/><path d="M${ex * k} ${ey} L${hx * k} ${hy}" stroke="${o.r0}" stroke-width="4.2" stroke-linecap="round"/>` : `<path d="M${ex * k} ${ey} L${hx * k} ${hy}" stroke="${o.pele[2]}" stroke-width="4.6" stroke-linecap="round"/><path d="M${ex * k} ${ey} L${hx * k} ${hy}" stroke="${o.pele[0]}" stroke-width="3.2" stroke-linecap="round"/>`}<circle cx="${hx * k}" cy="${hy}" r="2.8" fill="${o.pele[0]}" stroke="${o.pele[2]}" stroke-width=".9"/>`;
    return id ? `<g id="${id}" style="transform-origin:${sx}px -52px">${g}</g>` : g;
  };
  const cabeloTras = o => {
    const c = o.cab, cc = o.cabCor;
    if (c === 'coque') return `<path d="M-10.6 -68 C-12.6 -80 -6 -85 0 -85 C6 -85 12.6 -80 10.6 -68 C10 -61 7.6 -58 6 -60 H-6 C-7.6 -58 -10 -61 -10.6 -68Z" fill="${cc}"/>`;
    if (c === 'cachos') return `<path d="${copa(-12.6, -74, 7.4, 8, 9, .34)}" fill="${cc}" stroke="#120A06" stroke-width=".8"/><path d="${copa(12.6, -74, 7.4, 8, 9, .34)}" fill="${cc}" stroke="#120A06" stroke-width=".8"/><path d="${copa(0, -77, 11.4, 9, 11, .3)}" fill="${cc}" stroke="#120A06" stroke-width=".8"/><path d="M-16 -78 q2 -2 4 0 M12 -79 q2 -2 4 0 M-4 -85 q2 -2 4 0 M14 -70 q2 -1.6 3.4 .4" stroke="#5A4034" stroke-width=".8" fill="none"/>`;
    if (c === 'trancas') return `<g stroke-linecap="round" fill="none">${[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((x, i) => `<path d="M${x} -76 C${F(x * 1.3)} -64 ${F(x * 1.6 + (i % 2 ? 1 : -1))} -54 ${F(x * 1.7)} ${-42 - (i % 3) * 2}" stroke="${cc}" stroke-width="2.7"/>`).join('')}${[-8, -4, 0, 4, 8].map(x => `<path d="M${x} -70 C${F(x * 1.3)} -62 ${F(x * 1.6)} -54 ${F(x * 1.7)} -46" stroke="#6A5A50" stroke-width=".7" stroke-dasharray="1.4 1.6"/>`).join('')}</g>`;
    if (c === 'branco') return `<path d="M-10 -70 C-10 -79 10 -79 10 -70 V-65 H-10Z" fill="#E4E4E4" stroke="#A4A4A4" stroke-width=".8"/>`;
    return `<path d="M-10 -70 C-10 -80 10 -80 10 -70 V-64 H-10Z" fill="${cc}"/>`;
  };
  const cabeloFrente = o => {
    const c = o.cab, cc = o.cabCor;
    if (c === 'coque') return `<path d="M-9.8 -72 C-8.4 -80 -2.4 -81.4 0 -78 C2.4 -81.4 8.4 -80 9.8 -72 C6 -76.4 2.4 -76.6 0 -75.2 C-2.4 -76.6 -6 -76.4 -9.8 -72Z" fill="${cc}"/><path d="M-7 -77 C-4 -79 -2 -79 -1 -77.4" stroke="#B4AEA8" stroke-width=".9" fill="none"/><path d="M-10 -70 C-10.8 -66 -10 -62 -8.6 -60 M10 -70 C10.8 -66 10 -62 8.6 -60" stroke="${cc}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    if (c === 'cachos') return `<path d="${copa(0, -79.4, 10.2, 4.4, 10, .45)}" fill="${cc}" stroke="#120A06" stroke-width=".7"/><circle cx="-11" cy="-70.6" r="1.9" fill="#FF5C8A" stroke="#9A1E48" stroke-width=".5"/><circle cx="11" cy="-70.6" r="1.9" fill="#FFC83D" stroke="#A8700A" stroke-width=".5"/><path d="M-5 -81 q2 -1.6 4 0 M2 -81.4 q2 -1.6 4 0" stroke="#6A4A3A" stroke-width=".7" fill="none"/>`;
    if (c === 'trancas') return `<path d="M-10.2 -70.6 C-10.4 -81 10.4 -81 10.2 -70.6 C6.4 -75.4 -6.4 -75.4 -10.2 -70.6Z" fill="${cc}"/><path d="M-6 -78.6 L-5 -74.6 M0 -80 V-75.6 M6 -78.6 L5 -74.6" stroke="#4A3A32" stroke-width=".7"/><path d="M-10.4 -73.6 C-6 -77.6 6 -77.6 10.4 -73.6" stroke="#E8A21E" stroke-width="2.6" fill="none"/><path d="M-10.4 -73.6 C-6 -77.6 6 -77.6 10.4 -73.6" stroke="#C8361E" stroke-width="1" fill="none" stroke-dasharray="1.6 1.6"/>`;
    if (c === 'branco') return `<path d="M-9.8 -70.6 C-9.6 -77 -6 -78.6 -3 -77.2 M9.8 -70.6 C9.6 -77 6 -78.6 3 -77.2" stroke="#F4F4F4" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-4 -66.4 C-1.6 -68 1.6 -68 4 -66.4 C2.4 -65 -2.4 -65 -4 -66.4Z" fill="#F4F4F4" stroke="#B8B8B8" stroke-width=".6"/>`;
    return `<path d="M-9.8 -71.6 C-9 -80 9 -80 9.8 -71.6 C6 -75 -4 -76 -9.8 -71.6Z" fill="${cc}"/>`;
  };
  const chapeu = o => {
    if (o.chapeu === 'palha') return `<path d="M-23 -76.6 C-15 -81 15 -81 23 -76.6 C16.6 -72.6 -16.6 -72.6 -23 -76.6Z" fill="url(#vcPalha)" stroke="#8A6A2A" stroke-width="1.1"/><path d="M-9.4 -77.6 C-9.4 -89 9.4 -89 9.4 -77.6Z" fill="url(#vcPalha)" stroke="#8A6A2A" stroke-width="1.1"/><path d="M-9.4 -79.6 h18.8" stroke="#C8361E" stroke-width="2"/><g stroke="#B08A3A" stroke-width=".5" opacity=".85" fill="none"><path d="M-19 -77.6 l3 2 M-14 -78.6 l3 2.4 M14 -78.6 l-3 2.4 M19 -77.6 l-3 2 M-16 -75 l3 -2 M16 -75 l-3 -2"/><path d="M-6.4 -82.6 h12.8 M-5.4 -85.4 h10.8"/></g><path d="M-5.4 -86 q3 -2 7 -1.4" stroke="#FFF2C0" stroke-width="1" fill="none" stroke-linecap="round"/>`;
    if (o.chapeu === 'bone') return `<path d="M-10.2 -73.4 C-10.6 -84 10.6 -84 10.2 -73.4Z" fill="${o.bone}" stroke="#5E1410" stroke-width="1"/><path d="M-11 -73.6 C-6 -70.6 6 -70.6 11 -73.6 C6 -75.4 -6 -75.4 -11 -73.6Z" fill="#8A1E14" stroke="#5E1410" stroke-width=".8"/><path d="M-5 -80.6 q4 -2.4 8.4 -.6" stroke="#FF9A8A" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="0" cy="-83" r=".9" fill="#5E1410"/>`;
    return '';
  };
  const gente = o => {
    const [p0, p1, pe] = o.pele;
    let pernas;
    if (o.saia) pernas = `<path d="M-4.6 0 V-12 M4.6 0 V-12" stroke="${pe}" stroke-width="5" stroke-linecap="round"/><path d="M-4.6 0 V-12 M4.6 0 V-12" stroke="${p0}" stroke-width="3.4" stroke-linecap="round"/><path d="M-8.6 .4 h6.4 M2.4 .4 h6.6" stroke="#5E3A22" stroke-width="2.6" stroke-linecap="round"/>`;
    else if (o.short) pernas = `<path d="M-4.6 -1 V-16 M4.6 -1 V-16" stroke="${pe}" stroke-width="5" stroke-linecap="round"/><path d="M-4.6 -1 V-16 M4.6 -1 V-16" stroke="${p0}" stroke-width="3.4" stroke-linecap="round"/><path d="M-10 -30 L-11 -15 H-1 L0 -22 L1 -15 H11 L10 -30Z" fill="${o.calca}" stroke="#14244A" stroke-width="1"/><path d="M-9.4 .4 h7.4 M2 .4 h7.4" stroke="#F4F4F8" stroke-width="3.4" stroke-linecap="round"/><path d="M-9.4 .4 h7.4 M2 .4 h7.4" stroke="#E5392C" stroke-width="1" stroke-linecap="round"/>`;
    else pernas = `<path d="M-10 -30 L-10.6 -1 H-2.6 L0 -21 L2.6 -1 H10.6 L10 -30Z" fill="${o.calca}" stroke="#1A1E2E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-6.4 -26 V-3 M6.4 -26 V-3" stroke="#fff" stroke-width=".7" opacity=".25"/><ellipse cx="-6.8" cy="0" rx="4.6" ry="1.8" fill="#3A2A1E"/><ellipse cx="6.8" cy="0" rx="4.6" ry="1.8" fill="#3A2A1E"/>`;
    const est = o.estampa === 'flores' ? [[-6, -48], [4, -44], [-3, -38], [7, -52], [-8, -34], [6, -35]].map(([x, y], i) => `<g>${[0, 1, 2, 3, 4].map(q => `<circle cx="${F(x + Math.cos(q * 1.256) * 1.3)}" cy="${F(y + Math.sin(q * 1.256) * 1.3)}" r="1" fill="${i % 2 ? '#FFE27A' : '#FFFFFF'}"/>`).join('')}<circle cx="${x}" cy="${y}" r=".6" fill="#C8361E"/></g>`).join('')
      : o.estampa === 'listra' ? `<path d="M-12.4 -44 H12.4" stroke="#2E6AC8" stroke-width="2.6"/><path d="M-12.6 -40.4 H12.6" stroke="#E5392C" stroke-width="1"/>`
      : o.estampa === 'colete' ? `<path d="M-11 -54 C-12.6 -44 -12.6 -36 -12 -30 H-4 L-3 -55Z M11 -54 C12.6 -44 12.6 -36 12 -30 H4 L3 -55Z" fill="#3E8A4A" stroke="#1E4A2A" stroke-width="1"/><rect x="-10" y="-44" width="5" height="4" rx=".8" fill="none" stroke="#1E4A2A" stroke-width=".7"/><rect x="5" y="-44" width="5" height="4" rx=".8" fill="none" stroke="#1E4A2A" stroke-width=".7"/><path d="M5.6 -50 l1.6 -2.4 l1.6 2.4 l-1.6 2.4Z" fill="#FFE27A"/>` : '';
    const saia = o.saia ? `<path d="M-13 -11 C-14.4 -22 -12.4 -32 -11 -37 H11 C12.4 -32 14.4 -22 13 -11 C7 -8.6 -7 -8.6 -13 -11Z" fill="${o.saia}" stroke="#0E3A3A" stroke-width="1.2"/><path d="M-12.8 -14 C-7 -11.8 7 -11.8 12.8 -14" stroke="#FFE27A" stroke-width="1.4" fill="none"/><path d="M-6 -35 C-7 -26 -6 -18 -4.6 -11 M5 -35 C6 -26 5 -18 4 -11" stroke="#0E3A3A" stroke-width=".8" fill="none" opacity=".5"/>` : '';
    const rosto = `<path d="M-6.2 -74.8 q2.2 -1.5 4.4 -.3 M1.8 -75.1 q2.2 -1.2 4.4 .3" stroke="${o.sobr || '#2A1A14'}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <ellipse cx="-3.6" cy="-70.6" rx="1.5" ry="1.9" fill="#1A0E0A"/><ellipse cx="3.6" cy="-70.6" rx="1.5" ry="1.9" fill="#1A0E0A"/><circle cx="-3.1" cy="-71.3" r=".6" fill="#fff"/><circle cx="4.1" cy="-71.3" r=".6" fill="#fff"/>
      ${o.idoso ? `<path d="M-7.6 -71.6 l-1.6 -.8 M-7.6 -70 l-1.8 .4 M7.6 -71.6 l1.6 -.8 M7.6 -70 l1.8 .4" stroke="${pe}" stroke-width=".5" opacity=".7"/>` : ''}
      <path d="M.2 -68.8 q1.1 1.8 -.4 2.7" stroke="${pe}" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <path d="M-3.6 -64.6 C-1.6 -62 1.8 -62 3.8 -64.6 C1.6 -63.6 -1.4 -63.6 -3.6 -64.6Z" fill="#fff" stroke="#6E2E14" stroke-width=".9" stroke-linejoin="round"/>
      <ellipse cx="-5.8" cy="-66" rx="2" ry="1.1" fill="#E0705A" opacity=".5"/><ellipse cx="6" cy="-66" rx="2" ry="1.1" fill="#E0705A" opacity=".5"/>`;
    return `<g transform="translate(${o.x} ${o.y}) scale(${o.s})">
      ${o.sombra === false ? '' : `<ellipse cx="0" cy="1" rx="16" ry="2.8" fill="#2A1A0A" opacity=".24"/>`}
      ${o.cab === 'trancas' ? cabeloTras(o) : ''}${pernas}
      <path d="M-11 -54 C-13.4 -46 -13.4 -38 -12.4 -29 C-6 -27 6 -27 12.4 -29 C13.4 -38 13.4 -46 11 -54 C6 -57.4 -6 -57.4 -11 -54Z" fill="url(#${o.gr})" stroke="${o.re}" stroke-width="1.3"/>
      ${est}<path d="M-4.6 -56 Q0 -51 4.6 -56" stroke="${o.re}" stroke-width="1" fill="${o.gola || 'none'}"/><path d="M-8 -50 C-9 -44 -9 -38 -8.4 -33" stroke="#fff" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/>
      ${saia}${braco(-1, o.bE || 'baixo', o)}${braco(1, o.bD || 'baixo', o, o.idBraco)}
      <path d="M-3 -60 v6.4 h6 v-6.4Z" fill="${p1}"/>
      ${o.cab === 'trancas' ? '' : cabeloTras(o)}
      <ellipse cx="-9.6" cy="-69" rx="1.9" ry="2.7" fill="${p1}" stroke="${pe}" stroke-width=".8"/><ellipse cx="9.6" cy="-69" rx="1.9" ry="2.7" fill="${p1}" stroke="${pe}" stroke-width=".8"/>
      ${o.brinco ? `<circle cx="-9.8" cy="-65.6" r="1.1" fill="#FFC83D" stroke="#A8700A" stroke-width=".4"/><circle cx="9.8" cy="-65.6" r="1.1" fill="#FFC83D" stroke="#A8700A" stroke-width=".4"/>` : ''}
      <ellipse cx="0" cy="-70" rx="9.6" ry="10.6" fill="url(#${o.gp})" stroke="${pe}" stroke-width="1.3"/>
      ${rosto}${cabeloFrente(o)}${chapeu(o)}${o.mais || ''}
      <rect x="-24" y="-92" width="48" height="95" fill="transparent"/></g>`;
  };
  /* ---------- barca com carranca ---------- */
  const barqueiro = gente({ x:66, y:-14, s:.92, pele:['#D6A47A', '#B07E56', '#5E3A22'], gp:'vcPeleC', gr:'vcCamC', r0:'#3EAA5E', re:'#1E6A3A', cab:'curto', cabCor:'#1E1410', chapeu:'bone', bone:'#E0402A', calca:'#3A4A6A', bD:'frente', bE:'baixo', sombra:false, estampa:'listra' });
  const barca = () => `
    <g class="vc-esteira" style="opacity:0;transition:opacity .6s"><path d="M98 -4 C130 -14 170 -18 220 -28 M98 6 C130 14 170 22 220 34" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".85"/><path d="M98 0 C140 -2 180 2 230 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".35"/><g fill="#fff" opacity=".8">${[[110, -2, 3], [126, 4, 2.4], [140, -6, 2], [158, 8, 2.2], [176, -10, 1.8], [196, 12, 1.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M-100 -4 C-116 -10 -128 -16 -140 -26 M-100 4 C-118 10 -130 16 -142 24" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M100 0 C130 0 160 4 200 0" stroke="#E6F8FF" stroke-width="1.6" fill="none" stroke-dasharray="6 6"/></g>
    <ellipse cx="0" cy="4" rx="104" ry="9" fill="#0A3A4A" opacity=".32"/><path d="M-84 6 C-50 14 50 14 86 6 C60 18 -60 18 -84 6Z" fill="#2A5EA8" opacity=".25"/><path d="M-70 10 h30 M-20 12 h40 M40 10 h30" stroke="#E8C23A" stroke-width="1.6" opacity=".35" stroke-dasharray="6 5"/>
    <path d="M-60 6 C-20 10 40 10 80 6" stroke="#E6F8FF" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>
    <path d="M96 -18 L104 -18 L104 -8 C104 -4 100 -2 96 -4Z" fill="#4E5262" stroke="#1E2230" stroke-width="1.2"/><path d="M100 -8 V8" stroke="#2E3240" stroke-width="2.4"/><path d="M98 -20 h10 c3 0 4 2 4 5 v6 h-14Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.1"/><path d="M100 -18 h7" stroke="#FF9A8A" stroke-width="1" stroke-linecap="round"/>
    <path d="M86 -28 V-74" stroke="#5E3E22" stroke-width="1.8"/><path d="M86 -74 l18 4 l-18 5Z" fill="#FFC83D" stroke="#A8700A" stroke-width=".8"/><path d="M86 -66 l14 3.4 l-14 4Z" fill="#2E86C8" stroke="#1E4A8A" stroke-width=".8"/>
    <path d="M-48 -22 V-62 M-10 -22 V-66 M30 -22 V-62" stroke="#3A2414" stroke-width="3.6"/><path d="M-48 -22 V-62 M-10 -22 V-66 M30 -22 V-62" stroke="#A87A4A" stroke-width="1.8"/>
    <g><rect x="-42" y="-38" width="18" height="14" rx="1.4" fill="#C8955A" stroke="#6E4418" stroke-width="1"/><path d="M-42 -31 h18" stroke="#6E4418" stroke-width=".8"/>${[[-38, -40], [-32, -41], [-27, -40]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.6" fill="url(#vcManga)" stroke="#5E4A10" stroke-width=".6"/>`).join('')}
      <rect x="-20" y="-36" width="18" height="12" rx="1.4" fill="#B88550" stroke="#6E4418" stroke-width="1"/>${[[-16, -38], [-12, -39], [-8, -38], [-14, -41], [-10, -41.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#7A3E9A" stroke="#3E1A5A" stroke-width=".5"/>`).join('')}<path d="M-12 -42 q1 -3 3 -3" stroke="#3E8A3A" stroke-width="1" fill="none"/>
      <path d="M2 -24 C0 -34 4 -40 12 -40 C20 -40 24 -34 22 -24Z" fill="#E8D6A8" stroke="#8A7040" stroke-width="1"/><path d="M6 -36 q6 -3 12 0" stroke="#8A7040" stroke-width=".8" fill="none"/></g>
    <path d="M-58 -60 C-30 -76 30 -76 44 -60 V-55 H-58Z" fill="url(#vcPalha)" stroke="#7A5A1E" stroke-width="1.3" stroke-linejoin="round"/>
    <g stroke="#A8823A" stroke-width=".7" opacity=".85" fill="none"><path d="M-54 -61 C-30 -73 26 -73 40 -61 M-50 -64 C-28 -73 22 -73 34 -64"/>${Array.from({ length:14 }, (_, i) => `<path d="M${-54 + i * 7} -56 l2 -8"/>`).join('')}</g>
    <path d="M-58 -55 H44" stroke="#7A5A1E" stroke-width="1.4"/><g fill="#C8A04A">${Array.from({ length:17 }, (_, i) => `<path d="M${-58 + i * 6} -55 l3 4 l3 -4Z"/>`).join('')}</g>
    <path d="M-40 -68 q16 -6 34 -6" stroke="#FFF2C0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
    ${barqueiro}
    <path d="M70 -36 L98 -16" stroke="#3A2A1E" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M-100 -28 C-92 -10 -76 2 -52 4 H66 C82 4 94 -4 98 -20 L94 -22 H-90Z" fill="url(#vcCasco)" stroke="#0E2E5E" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-96 -24 C-86 -18 -60 -16 -40 -16 H94" stroke="#E8C23A" stroke-width="3.6" fill="none"/>
    <path d="M-90 -14 C-78 -6 -60 -4 -40 -4 H88" stroke="#D8402A" stroke-width="3.4" fill="none"/>
    <path d="M-84 -6 C-72 0 -56 2 -40 2 H80" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".75"/>
    <path d="M-80 -10 C-66 -4 -50 -2 -36 -2 M-70 -1 h120" stroke="#0E2E5E" stroke-width=".8" fill="none" opacity=".45"/>
    <g fill="#FFC83D" stroke="#A8700A" stroke-width=".6">${[-60, -30, 0, 30, 60].map(x => `<path d="M${x} -10 l3 -3 l3 3 l-3 3Z"/>`).join('')}</g>
    <path d="M-92 -26 C-70 -22 -40 -22 -20 -22 H96" stroke="#7AB8FF" stroke-width="1.2" fill="none" opacity=".7"/>
    <path d="M-100 -28 L-110 -42" stroke="#3A2414" stroke-width="6" stroke-linecap="round"/><path d="M-100 -28 L-110 -42" stroke="#A87A4A" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="-110" y="-80" width="230" height="90" fill="transparent"/>
    <g class="toque" data-fig="carranca" id="vc-carranca"><svg x="-134" y="-82" width="38" height="46" viewBox="0 0 100 120"><use href="#f-carranca"/></svg>${brilhoHotspot(-104, -84)}<rect x="-136" y="-84" width="42" height="50" fill="transparent"/></g>
    `;
  const peixeC = () => `<path d="M-20 0 L-33 -9 C-30 -3 -30 3 -33 9Z" fill="#B8C4D2" stroke="#3E4A5E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-31 -6 l7 4 M-31 6 l7 -4" stroke="#2E3644" stroke-width="1.3"/>
    <path d="M-4 -9 C-2 -16 5 -17 9 -12Z" fill="#C8D2DE" stroke="#3E4A5E" stroke-width="1"/>
    <path d="M-22 0 C-14 -10 6 -12 18 -5 C22 -2 22 2 18 4 C6 11 -14 10 -22 0Z" fill="url(#vcPrata)" stroke="#3E4A5E" stroke-width="1.3"/>
    <g stroke="#8E9AAE" stroke-width=".7" fill="none" opacity=".8">${[-12, -6, 0, 6].map(x => `<path d="M${x} -3 q2.4 -2.4 4.8 0 M${x - 2} 2 q2.4 -2.4 4.8 0"/>`).join('')}</g>
    <path d="M-14 -5 C-4 -9 8 -9 15 -5" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8" stroke-linecap="round"/><path d="M-16 3 C-6 7 8 7 16 3" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7"/>
    <path d="M2 6 C0 11 -4 13 -7 12 C-5 9 -2 7 0 5Z" fill="#E8C870" stroke="#8A5E1A" stroke-width=".7"/><path d="M-8 6 C-10 10 -13 11 -15 10 C-13 8 -11 7 -10 5Z" fill="#E8C870" stroke="#8A5E1A" stroke-width=".6"/>
    <ellipse cx="20" cy="1" rx="1.6" ry="1.8" fill="#E8A0A8" stroke="#3E4A5E" stroke-width=".6"/>
    <circle cx="12" cy="-2" r="2.6" fill="#F2E2A0" stroke="#3E4A5E" stroke-width=".6"/><circle cx="12.3" cy="-1.8" r="1.7" fill="#16182A"/><circle cx="12.9" cy="-2.6" r=".65" fill="#fff"/>`;
  /* ---------- árvores ---------- */
  const flores = (cx, cy, rx, ry, n, cores) => Array.from({ length:n }, () => { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; return `<circle cx="${F(x)}" cy="${F(y)}" r="${F(R(1.2, 2.6))}" fill="${cores[Math.floor(R(0, cores.length))]}"/>`; }).join('');
  const arvore = (tipo, h) => {
    const w = h * .62;
    if (tipo === 'caraibeira') return `<path d="M0 0 C-3 -20 4 -36 -2 -${F(h * .55)} M-1 -${F(h * .42)} C-12 -${F(h * .52)} -20 -${F(h * .6)} -26 -${F(h * .7)} M1 -${F(h * .46)} C12 -${F(h * .56)} 18 -${F(h * .64)} 24 -${F(h * .72)}" stroke="#4A3A2A" stroke-width="${F(h * .07)}" fill="none" stroke-linecap="round"/><path d="M0 0 C-3 -20 4 -36 -2 -${F(h * .55)}" stroke="#8A7A62" stroke-width="${F(h * .03)}" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="${copa(-w * .32, -h * .74, w * .42, h * .2, 9, .32)}" fill="url(#vcCaraib2)" stroke="#B07A08" stroke-width="1.1"/><path d="${copa(w * .3, -h * .76, w * .42, h * .2, 9, .32)}" fill="url(#vcCaraib2)" stroke="#B07A08" stroke-width="1.1"/><path d="${copa(0, -h * .86, w * .5, h * .2, 10, .3)}" fill="url(#vcCaraib)" stroke="#B07A08" stroke-width="1.2"/>
      ${flores(0, -h * .8, w * .62, h * .2, 26, ['#FFF27A', '#FFE04A', '#F6B21E', '#FFFBD0'])}<path d="M${F(-w * .3)} ${F(-h * .92)} q${F(w * .2)} ${F(-h * .1)} ${F(w * .46)} ${F(-h * .08)}" stroke="#FFFBE0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    if (tipo === 'inga') return `<path d="M0 0 C2 -18 -3 -34 1 -${F(h * .5)} M0 -${F(h * .36)} C-10 -${F(h * .44)} -18 -${F(h * .5)} -24 -${F(h * .56)} M1 -${F(h * .4)} C10 -${F(h * .48)} 16 -${F(h * .54)} 22 -${F(h * .58)}" stroke="#5A4232" stroke-width="${F(h * .065)}" fill="none" stroke-linecap="round"/>
      <path d="${copa(-w * .36, -h * .62, w * .4, h * .2, 9, .3)}" fill="url(#vcInga2)" stroke="#1E5A2A" stroke-width="1.1"/><path d="${copa(w * .36, -h * .64, w * .4, h * .2, 9, .3)}" fill="url(#vcInga2)" stroke="#1E5A2A" stroke-width="1.1"/><path d="${copa(0, -h * .78, w * .5, h * .24, 10, .3)}" fill="url(#vcInga)" stroke="#1E5A2A" stroke-width="1.2"/>
      ${Array.from({ length:12 }, () => { const x = R(-w * .55, w * .55), y = -h * R(.6, .92); return `<g stroke="#fff" stroke-width=".7">${[0, 1, 2, 3, 4, 5].map(q => `<path d="M${F(x)} ${F(y)} l${F(Math.cos(q) * 3)} ${F(Math.sin(q) * 3)}"/>`).join('')}</g><circle cx="${F(x)}" cy="${F(y)}" r="1.1" fill="#FFFDE6"/>`; }).join('')}<path d="M${F(-w * .34)} ${F(-h * .86)} q${F(w * .2)} ${F(-h * .08)} ${F(w * .4)} ${F(-h * .07)}" stroke="#D8F6B8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`;
    if (tipo === 'juazeiro') return `<path d="M0 0 C-2 -14 3 -24 0 -${F(h * .4)} M0 -${F(h * .28)} C-8 -${F(h * .34)} -14 -${F(h * .4)} -18 -${F(h * .46)}" stroke="#5E4A3A" stroke-width="${F(h * .08)}" fill="none" stroke-linecap="round"/>
      <path d="${copa(0, -h * .66, w * .64, h * .32, 13, .22)}" fill="url(#vcJua)" stroke="#123E2A" stroke-width="1.3"/><path d="${copa(-w * .12, -h * .74, w * .4, h * .18, 10, .25)}" fill="#3E9A5E" opacity=".55"/>
      ${flores(0, -h * .66, w * .54, h * .26, 14, ['#E8D04A', '#F2E27A'])}<path d="M${F(-w * .4)} ${F(-h * .78)} q${F(w * .22)} ${F(-h * .14)} ${F(w * .5)} ${F(-h * .14)}" stroke="#B8F0C8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`;
    return `<path d="M0 0 C-2 -16 2 -26 0 -${F(h * .42)} M0 -${F(h * .3)} C10 -${F(h * .36)} 20 -${F(h * .4)} 28 -${F(h * .44)} M0 -${F(h * .34)} C-10 -${F(h * .4)} -20 -${F(h * .44)} -28 -${F(h * .46)}" stroke="#4E3E30" stroke-width="${F(h * .075)}" fill="none" stroke-linecap="round"/>
      <path d="${copa(0, -h * .62, w * .8, h * .24, 14, .24)}" fill="url(#vcOiti)" stroke="#1E4A3E" stroke-width="1.3"/><path d="${copa(w * .1, -h * .7, w * .5, h * .14, 10, .25)}" fill="#7EB89A" opacity=".5"/><path d="M${F(-w * .5)} ${F(-h * .7)} q${F(w * .3)} ${F(-h * .12)} ${F(w * .7)} ${F(-h * .1)}" stroke="#D8F0E0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`;
  };
  /* ---------- plantas da vazante (base 0,0) ---------- */
  const planta = t => {
    if (t === 'feijao') return `<path d="M0 0 C-3 -8 3 -14 -1 -22 C-4 -28 3 -32 1 -38" stroke="#2E5A1A" stroke-width="2" fill="none"/>${[[-5, -8, -1], [5, -14, 1], [-6, -22, -1], [5, -28, 1], [-3, -34, -1], [4, -6, 1]].map(([x, y, l]) => `<path d="M${x} ${y} c${l * 4} -5 ${l * 11} -5 ${l * 12} 1 c${-l * 2} 5 ${-l * 8} 5 ${-l * 12} -1Z" fill="url(#vcFolhaF)" stroke="#24561E" stroke-width=".8"/>`).join('')}
      <g class="vc-fruto" style="opacity:0;transition:opacity 1s">${[[6, -20], [-8, -26], [7, -32]].map(([x, y]) => `<path d="M${x} ${y} c2 5 1 11 -2 14" stroke="#3E6A1E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x} ${y} c2 5 1 11 -2 14" stroke="#A8D86A" stroke-width="1.7" fill="none" stroke-linecap="round"/>`).join('')}<g fill="#fff" stroke="#B060A8" stroke-width=".5"><circle cx="-4" cy="-16" r="1.8"/><circle cx="2" cy="-36" r="1.8"/></g></g>`;
    if (t === 'milho') return `<path d="M0 0 C-1 -20 1 -46 0 -70" stroke="#3E6A1E" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M0 0 C-1 -20 1 -46 0 -70" stroke="#8CC84A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      ${[[-10, 1, 24], [-22, -1, 28], [-34, 1, 26], [-46, -1, 22], [-56, 1, 18]].map(([y, l, L]) => `<path d="M0 ${y} C${l * 8} ${y - 9} ${l * L * .8} ${y - 6} ${l * L} ${y + 5} C${l * L * .7} ${y - 1} ${l * 8} ${y - 4} 0 ${y - 3}Z" fill="url(#vcFolhaM)" stroke="#2E5A1A" stroke-width="1" stroke-linejoin="round"/>`).join('')}
      <path d="M0 -70 l-4 -10 M0 -70 l1 -12 M0 -70 l5 -9" stroke="#C8A44A" stroke-width="1.8" stroke-linecap="round"/>
      <g class="vc-fruto" style="opacity:0;transition:opacity 1s"><g transform="translate(2 -36) rotate(22)"><path d="M0 0 C-5 -5 -5 -18 0 -23 C5 -18 5 -5 0 0Z" fill="#7AA03A" stroke="#3E5A1A" stroke-width="1"/><path d="M0 -3 C-3.4 -8 -3.4 -16 0 -20 C3.4 -16 3.4 -8 0 -3Z" fill="url(#vcEspiga)" stroke="#A8701A" stroke-width=".8"/><path d="M0 -23 q-2 -5 2 -8 M0 -23 q3 -4 6 -5" stroke="#B8702A" stroke-width=".9" fill="none"/></g></g>`;
    if (t === 'abobora') return `<path d="M-24 -2 C-14 -6 14 -6 26 -2" stroke="#3E6A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      ${[[-20, -8, 10], [-4, -13, 13], [14, -10, 11]].map(([x, y, r]) => `<path d="M${x} ${y + r * .7} C${x - r * 1.1} ${y + r * .2} ${x - r} ${y - r * .9} ${x - r * .2} ${y - r * .8} Q${x} ${y - r * 1.2} ${x + r * .2} ${y - r * .8} C${x + r} ${y - r * .9} ${x + r * 1.1} ${y + r * .2} ${x} ${y + r * .7}Z" fill="url(#vcFolhaA)" stroke="#1E4A22" stroke-width="1.1"/><path d="M${x} ${y + r * .6} V${y - r * .6} M${x} ${y} l${-r * .5} ${-r * .4} M${x} ${y} l${r * .5} ${-r * .4}" stroke="#9AD08A" stroke-width=".8" fill="none" opacity=".8"/>`).join('')}
      <g class="vc-fruto" style="opacity:0;transition:opacity 1s"><g transform="translate(6 -4)"><path d="M-11 0 C-13 -12 13 -12 11 0 C10 6 -10 6 -11 0Z" fill="url(#vcAbob)" stroke="#9A4A0A" stroke-width="1.2"/><path d="M-4 -8 C-6 -2 -5 3 -3 5 M4 -8 C6 -2 5 3 3 5" stroke="#C86A1A" stroke-width="1" fill="none"/><path d="M0 -9 l2 -5" stroke="#4E6A1E" stroke-width="2.4" stroke-linecap="round"/><path d="M-7 -5 q3 -3 6 -3" stroke="#FFE0A8" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><g transform="translate(-16 -16)">${[0, 1, 2, 3, 4].map(k => `<ellipse cx="${F(Math.cos(k * 1.256) * 3.2)}" cy="${F(Math.sin(k * 1.256) * 3.2)}" rx="3" ry="2.2" transform="rotate(${F(k * 72)} ${F(Math.cos(k * 1.256) * 3.2)} ${F(Math.sin(k * 1.256) * 3.2)})" fill="#FFC83D" stroke="#B07A08" stroke-width=".5"/>`).join('')}<circle r="1.8" fill="#F08A1E"/></g></g>`;
    return `<path d="M-22 -1 C-12 -4 10 -5 22 -1" stroke="#5E3A6A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${[[-18, -6, -1], [-8, -10, 1], [2, -7, -1], [12, -11, 1], [20, -5, 1], [-2, -15, 1]].map(([x, y, l]) => `<path d="M${x} ${y + 6} C${x - 6} ${y + 2} ${x - 7} ${y - 5} ${x - 2} ${y - 6} L${x} ${y - 3} L${x + 2} ${y - 6} C${x + 7} ${y - 5} ${x + 6} ${y + 2} ${x} ${y + 6}Z" fill="url(#vcFolhaB)" stroke="#2E3A1E" stroke-width=".9"/><path d="M${x} ${y + 5} V${y - 3}" stroke="#C8A0D8" stroke-width=".7" opacity=".8"/>`).join('')}
      <g class="vc-fruto" style="opacity:0;transition:opacity 1s"><g transform="translate(-6 2) rotate(-14)"><path d="M-10 0 C-10 -6 10 -7 12 -1 C12 4 -8 6 -10 0Z" fill="url(#vcBatata)" stroke="#6A1E3A" stroke-width="1.1"/><path d="M-5 -3 q5 -2 10 -1" stroke="#F0A8C8" stroke-width="1.1" fill="none" stroke-linecap="round"/><g fill="#5A1A30"><circle cx="-2" cy="1" r=".6"/><circle cx="4" cy="-1" r=".6"/></g></g></g>`;
  };
  const sementeIcone = t => t === 'feijao' ? `<g fill="#8E2A2A" stroke="#3E0A0A" stroke-width=".7"><ellipse cx="-3" cy="-1" rx="3.6" ry="2.4" transform="rotate(-20 -3 -1)"/><ellipse cx="3" cy="2" rx="3.6" ry="2.4" transform="rotate(15 3 2)"/><ellipse cx="2" cy="-4" rx="3.2" ry="2.2" fill="#F2E6C8" stroke="#8A7A5A"/></g>`
    : t === 'milho' ? `<g fill="#FFD447" stroke="#B07A08" stroke-width=".7"><path d="M-5 -2 l2 -3 h3 l1 3 l-2 2.4Z"/><path d="M1 1 l2 -3 h3 l1 3 l-2 2.4Z"/><path d="M-4 3 l2 -3 h3 l1 3 l-2 2.4Z"/></g>`
    : t === 'abobora' ? `<g fill="#F6EBC8" stroke="#9A8A5A" stroke-width=".7"><ellipse cx="-3" cy="0" rx="2.2" ry="4" transform="rotate(-20 -3 0)"/><ellipse cx="3" cy="0" rx="2.2" ry="4" transform="rotate(20 3 0)"/><ellipse cx="0" cy="-3" rx="2" ry="3.4"/></g>`
    : `<g><path d="M-6 2 C-6 -3 6 -4 7 0 C7 4 -5 5 -6 2Z" fill="url(#vcBatata)" stroke="#6A1E3A" stroke-width=".8"/><path d="M2 -2 q2 -5 6 -6 M2 -2 q-1 -5 -4 -7" stroke="#3E8A3A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`;
  const muda = () => `<path d="M-7 0 L-8 -12 H8 L7 0Z" fill="#2A2A30" stroke="#0E0E12" stroke-width="1"/><path d="M-7 -9 h14" stroke="#4A4A54" stroke-width="1"/><path d="M0 -12 C-1 -18 1 -22 0 -28" stroke="#3E6A1E" stroke-width="1.6" fill="none"/><path d="M0 -20 c-3 -4 -9 -4 -10 0 c3 3 8 3 10 0Z M0 -24 c3 -4 9 -4 10 0 c-3 3 -8 3 -10 0Z M0 -28 c-2 -3 -6 -4 -7 -1 c2 3 6 3 7 1Z" fill="url(#vcFolhaF)" stroke="#24561E" stroke-width=".7"/>`;
  const cabra = () => `<ellipse cx="0" cy="1" rx="18" ry="2.6" fill="#2A1A0A" opacity=".22"/><path d="M-12 -2 v-10 M-6 -2 v-10 M8 -2 v-10 M13 -2 v-10" stroke="#5E4A3A" stroke-width="2.6" stroke-linecap="round"/><path d="M-14 -10 C-18 -22 10 -26 16 -16 C18 -10 12 -8 0 -8 C-10 -8 -14 -8 -14 -10Z" fill="url(#vcCabra)" stroke="#5E4A3A" stroke-width="1.2"/><path d="M-6 -20 C0 -22 8 -22 12 -18" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/><path d="M-12 -16 C-14 -22 -12 -26 -10 -27" stroke="#5E4A3A" stroke-width="1.2" fill="none"/><path d="M14 -16 c3 -6 -1 -9 -6 -10" fill="#8A6A4A" stroke="#5E4A3A" stroke-width="1"/>
    <g id="vc-cabra-cab" style="transform-origin:-13px -16px"><path d="M-12 -16 C-16 -18 -22 -24 -22 -28 C-22 -32 -14 -32 -12 -28 C-11 -24 -10 -20 -12 -16Z" fill="url(#vcCabra)" stroke="#5E4A3A" stroke-width="1.2"/><path d="M-19 -31 C-20 -38 -15 -40 -12 -36 M-15 -31 C-14 -37 -9 -38 -8 -34" stroke="#6E5A44" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M-12 -30 l6 -2 l-5 4Z" fill="#E8D6C0" stroke="#5E4A3A" stroke-width=".7"/><circle cx="-17.4" cy="-28" r="1.2" fill="#1A1210"/><circle cx="-17" cy="-28.4" r=".4" fill="#fff"/><path d="M-21 -22 c-1 3 0 6 2 7" stroke="#E8E0D0" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="-21.4" cy="-25.4" rx="1" ry=".7" fill="#5E4A3A"/></g>`;
  const garca = (x, y, s, i) => `<g class="vc-garca" data-i="${i}" transform="translate(${x} ${y}) scale(${s})"><g class="vc-garca-in"><path d="M-3 0 l-1 -12 M3 0 l1 -12" stroke="#2A2A30" stroke-width="1.4"/><path d="M-10 -14 C-12 -22 4 -26 10 -18 C12 -14 4 -11 -2 -11 C-8 -11 -10 -12 -10 -14Z" fill="#FFFFFF" stroke="#7A8AA6" stroke-width="1"/><path d="M8 -18 C10 -26 6 -32 9 -36" stroke="#7A8AA6" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M8 -18 C10 -26 6 -32 9 -36" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="10" cy="-37" r="3" fill="#fff" stroke="#7A8AA6" stroke-width=".8"/><path d="M12 -37 l8 1.6 l-8 1Z" fill="#F2C23A" stroke="#A8700A" stroke-width=".5"/><circle cx="10.6" cy="-37.6" r=".7" fill="#1A1A22"/></g></g>`;
  /* ---------- cena ---------- */
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="O Rio São Francisco, o Velho Chico, no sertão: uma barca com carranca no canal entre bancos de areia, uma comunidade ribeirinha com plantação de vazante, um barranco sem árvores e a ararinha-azul numa caraibeira florida">
    <defs>
      <linearGradient id="vcCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F8CE0"/><stop offset=".55" stop-color="#8FCBF2"/><stop offset="1" stop-color="#FFE4BE"/></linearGradient>
      <linearGradient id="vcPorCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2E7A"/><stop offset=".45" stop-color="#C8507A"/><stop offset=".8" stop-color="#FF8A4A"/><stop offset="1" stop-color="#FFC870"/></linearGradient>
      <linearGradient id="vcSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AEA2C8"/><stop offset="1" stop-color="#D6C8D6"/></linearGradient>
      <linearGradient id="vcSerra2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6A88E"/><stop offset="1" stop-color="#E2CDB0"/></linearGradient>
      <linearGradient id="vcLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8BC8A"/><stop offset="1" stop-color="#BE9A66"/></linearGradient>
      <linearGradient id="vcNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E4" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E4" stop-opacity=".65"/></linearGradient>
      <linearGradient id="vcRio" gradientUnits="userSpaceOnUse" x1="0" y1="${AY}" x2="0" y2="500"><stop offset="0" stop-color="#9AD6E2"/><stop offset=".3" stop-color="#4EA8BC"/><stop offset=".7" stop-color="#2A8498"/><stop offset="1" stop-color="#17617A"/></linearGradient>
      <linearGradient id="vcReflexo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A89A6A" stop-opacity=".45"/><stop offset="1" stop-color="#A89A6A" stop-opacity="0"/></linearGradient>
      <linearGradient id="vcPorAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC27A"/><stop offset=".5" stop-color="#F08A6A"/><stop offset="1" stop-color="#A8507A"/></linearGradient>
      <radialGradient id="vcSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".55" stop-color="#FFE27A"/><stop offset="1" stop-color="#F6B21E"/></radialGradient>
      <radialGradient id="vcRaso" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#C8F0E0" stop-opacity=".75"/><stop offset="1" stop-color="#C8F0E0" stop-opacity="0"/></radialGradient>
      <linearGradient id="vcAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D2"/><stop offset="1" stop-color="#E4C286"/></linearGradient>
      <linearGradient id="vcTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2BC84"/><stop offset=".5" stop-color="#CFA068"/><stop offset="1" stop-color="#B07E4A"/></linearGradient>
      <linearGradient id="vcLama" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A5E3A"/><stop offset="1" stop-color="#5A3A22"/></linearGradient>
      <linearGradient id="vcBarTopo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDB27C"/><stop offset="1" stop-color="#B8844E"/></linearGradient>
      <linearGradient id="vcBarFace" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D88A52"/><stop offset=".4" stop-color="#B8643A"/><stop offset="1" stop-color="#8E4426"/></linearGradient>
      <linearGradient id="vcCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E8EE0"/><stop offset="1" stop-color="#1A4A94"/></linearGradient>
      <linearGradient id="vcCanoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B07A4A"/><stop offset="1" stop-color="#6A4024"/></linearGradient>
      <linearGradient id="vcPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4DC8E"/><stop offset="1" stop-color="#C8A04A"/></linearGradient>
      <radialGradient id="vcManga" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#FFD84A"/><stop offset=".6" stop-color="#F08A2A"/><stop offset="1" stop-color="#C8402A"/></radialGradient>
      <radialGradient id="vcCaraib" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFF6A0"/><stop offset=".55" stop-color="#FFD43A"/><stop offset="1" stop-color="#E8A01E"/></radialGradient>
      <radialGradient id="vcCaraib2" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFE87A"/><stop offset=".6" stop-color="#F2B82A"/><stop offset="1" stop-color="#C8841A"/></radialGradient>
      <radialGradient id="vcInga" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#A8E07A"/><stop offset=".6" stop-color="#5EAE4A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <radialGradient id="vcInga2" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#8ED06A"/><stop offset="1" stop-color="#2E6A34"/></radialGradient>
      <radialGradient id="vcJua" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5EC08A"/><stop offset=".6" stop-color="#2A8A5A"/><stop offset="1" stop-color="#155A3A"/></radialGradient>
      <radialGradient id="vcOiti" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#9AD0B0"/><stop offset=".6" stop-color="#4E9A7A"/><stop offset="1" stop-color="#2A6A56"/></radialGradient>
      <linearGradient id="vcFolhaM" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8E66A"/><stop offset="1" stop-color="#5E9A2E"/></linearGradient>
      <linearGradient id="vcFolhaF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ED06A"/><stop offset="1" stop-color="#2E8A3E"/></linearGradient>
      <radialGradient id="vcFolhaA" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#6EC08A"/><stop offset="1" stop-color="#1E6A4A"/></radialGradient>
      <linearGradient id="vcFolhaB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8EB85A"/><stop offset="1" stop-color="#4E5A2E"/></linearGradient>
      <linearGradient id="vcEspiga" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F0A81E"/></linearGradient>
      <radialGradient id="vcAbob" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFC060"/><stop offset="1" stop-color="#E06A12"/></radialGradient>
      <radialGradient id="vcBatata" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#E86A9A"/><stop offset="1" stop-color="#8A2A4E"/></radialGradient>
      <linearGradient id="vcPrata" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F8FC"/><stop offset=".6" stop-color="#C2CCD8"/><stop offset="1" stop-color="#8A98AC"/></linearGradient>
      <radialGradient id="vcSob" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#2E8EA6" stop-opacity=".55"/><stop offset=".7" stop-color="#2E8EA6" stop-opacity=".4"/><stop offset="1" stop-color="#2E8EA6" stop-opacity="0"/></radialGradient>
      <linearGradient id="vcFundoRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A4A62" stop-opacity="0"/><stop offset=".5" stop-color="#0A4A62" stop-opacity=".28"/><stop offset="1" stop-color="#0A4A62" stop-opacity="0"/></linearGradient>
      <filter id="vcBorrao2" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <clipPath id="vcEspelhoClip"><path d="M576 404 C640 410 720 414 800 418 V500 H560Z"/></clipPath>
      <linearGradient id="vcCabra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D8CCBC"/></linearGradient>
      <linearGradient id="vcParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ED6CE"/><stop offset="1" stop-color="#4EAAA6"/></linearGradient>
      <linearGradient id="vcTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E06A3A"/><stop offset="1" stop-color="#A8401E"/></linearGradient>
      <radialGradient id="vcPote" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="#E89A62"/><stop offset=".6" stop-color="#C0683A"/><stop offset="1" stop-color="#8A4222"/></radialGradient>
      <linearGradient id="vcCesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2B870"/><stop offset="1" stop-color="#A8763A"/></linearGradient>
      <radialGradient id="vcCuia" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#D8A060"/><stop offset="1" stop-color="#7A4A22"/></radialGradient>
      <radialGradient id="vcPeleA" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#A86E46"/><stop offset="1" stop-color="#7A4A2C"/></radialGradient>
      <radialGradient id="vcPeleB" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#CC8E60"/><stop offset="1" stop-color="#A06A42"/></radialGradient>
      <radialGradient id="vcPeleC" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ECC096"/><stop offset="1" stop-color="#C08A60"/></radialGradient>
      <radialGradient id="vcPeleD" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8A5A3A"/><stop offset="1" stop-color="#5E3820"/></radialGradient>
      <radialGradient id="vcPeleE" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#704630"/><stop offset="1" stop-color="#46281A"/></radialGradient>
      <linearGradient id="vcBlusaA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A4A"/><stop offset="1" stop-color="#D8582A"/></linearGradient>
      <linearGradient id="vcCamB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D2E2F4"/></linearGradient>
      <linearGradient id="vcCamC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ECC7A"/><stop offset="1" stop-color="#2E8A4A"/></linearGradient>
      <linearGradient id="vcCamD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F2FC"/><stop offset="1" stop-color="#A8C8E6"/></linearGradient>
      <linearGradient id="vcCamE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE06A"/><stop offset="1" stop-color="#F0A81E"/></linearGradient>
      <linearGradient id="vcTurvo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8723A"/><stop offset="1" stop-color="#7A4E26"/></linearGradient>
      <radialGradient id="vcVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#1A0E2A" stop-opacity="0"/><stop offset="1" stop-color="#1A0E2A" stop-opacity=".34"/></radialGradient>
      <filter id="vcBorrao" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="vcGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
      <clipPath id="vcTerraClip"><path d="${terraD}"/></clipPath>
      <clipPath id="vcFaceClip"><path id="vc-face-d" d="M584 270 L598 290 C650 296 730 296 800 290 V420 C740 412 690 416 650 408 C620 402 596 394 584 378 C574 352 574 300 584 270Z"/></clipPath>
    </defs>
    <rect width="800" height="${AY + 4}" fill="url(#vcCeu)"/>
    <rect id="vc-por-ceu" width="800" height="${AY + 4}" fill="url(#vcPorCeu)" opacity="0" pointer-events="none"/>
    <g id="vc-sol" class="toque"><g id="vc-sol-pos"><circle cx="690" cy="64" r="50" fill="#FFE27A" opacity=".22"/><circle cx="690" cy="64" r="36" fill="#FFE27A" opacity=".3"/><circle cx="690" cy="64" r="25" fill="url(#vcSolG)" stroke="#F0A81E" stroke-width="2"/><path d="M677 55 q7 -8 18 -8" stroke="#FFFBE0" stroke-width="3.4" fill="none" stroke-linecap="round"/></g></g>
    <g class="deriva"><use href="#nuvem" x="120" y="34" width="100" height="46" style="color:#fff" opacity=".9"/><use href="#nuvem" x="430" y="20" width="76" height="36" style="color:#fff" opacity=".8"/></g>
    <g id="vc-aves" stroke="#3E3A5A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"><path d="M300 74 q6 -6 12 0 q6 -6 12 0"/><path d="M334 92 q4 -4 8 0 q4 -4 8 0"/><path d="M560 60 q4 -4 8 0 q4 -4 8 0"/></g>
    <!-- serras e chapadas ao longe -->
    <path d="M0 152 L40 140 H120 L140 132 H230 L250 140 H330 L350 128 H470 L494 138 H580 L600 130 H700 L724 142 H800 V188 H0Z" fill="url(#vcSerra)"/>
    <path d="M120 132 H230 L236 136 H126Z M350 128 H470 L474 132 H354Z M600 130 H700 L704 134 H604Z" fill="#E6DCEC" opacity=".7"/>
    <g stroke="#9A8EB8" stroke-width="1" opacity=".45">${[60, 160, 280, 400, 520, 640, 760].map(x => `<path d="M${x} 150 l-6 30 M${x + 30} 148 l4 32"/>`).join('')}</g>
    <g stroke="#C8BCD8" stroke-width=".8" opacity=".6">${[136, 142, 148].map(y => `<path d="M0 ${y + 8} H800" stroke-dasharray="40 30 70 20"/>`).join('')}</g>
    <path d="M0 162 C60 146 120 150 180 156 C240 146 300 144 370 154 C440 146 520 142 590 152 C660 144 730 146 800 152 V184 H0Z" fill="#C8B4A4" opacity=".85"/>
    <g opacity=".7">${Array.from({ length:60 }, (_, i) => { const x = R(0, 800), y = R(156, 178), r = R(1.8, 3.2); return `<path d="${copa(x, y, r, r * .7, 6, .35)}" fill="${['#A89E86', '#9A9078', '#B4A890', '#8E9078'][i % 4]}"/>`; }).join('')}</g>
    <g stroke="#7E8A74" stroke-linecap="round" fill="none" opacity=".75">${[[70, 152, .7], [240, 150, .6], [330, 151, .8], [520, 148, .7], [610, 150, .6], [690, 149, .75]].map(([x, y, k]) => `<path d="M${x} ${y} v${F(-14 * k)} M${x} ${F(y - 8 * k)} h${F(-4 * k)} v${F(-6 * k)} M${x} ${F(y - 6 * k)} h${F(4 * k)} v${F(-7 * k)}" stroke-width="${F(2.4 * k)}"/>`).join('')}</g>
    <path d="M0 168 C40 158 90 162 140 160 C200 156 260 166 330 162 C420 156 520 166 600 160 C680 156 740 162 800 160 V190 H0Z" fill="url(#vcSerra2)" opacity=".9"/>
    <g opacity=".85">${Array.from({ length:50 }, (_, i) => { const x = R(0, 800), y = R(166, 182), r = R(2.4, 4); return `<path d="${copa(x, y, r, r * .72, 7, .35)}" fill="${['#A8A47E', '#9A9070', '#B8AA8A', '#8A8E6A', '#C0A88A'][i % 5]}" stroke="#7E7660" stroke-width=".4"/>`; }).join('')}</g>
    <g stroke="#5E8A5E" stroke-linecap="round" fill="none">${[[150, 172, .9], [420, 170, 1], [560, 171, .8], [770, 170, 1.1]].map(([x, y, k]) => `<path d="M${x} ${y} v${F(-16 * k)} M${x} ${F(y - 9 * k)} h${F(-5 * k)} v${F(-7 * k)} M${x} ${F(y - 7 * k)} h${F(5 * k)} v${F(-8 * k)}" stroke-width="${F(2.6 * k)}"/>`).join('')}</g>
    <rect y="150" width="800" height="46" fill="url(#vcNevoa)"/>
    <!-- margem de lá: cidade, irrigação e caatinga -->
    <path d="M0 178 C100 174 220 178 340 176 C480 174 620 178 800 176 V200 H0Z" fill="url(#vcLonge)"/>
    <g id="vc-cidade" class="toque" opacity=".92">${[[4, 168, 14, 12, '#F2E2C8'], [20, 164, 12, 16, '#E8C8A8'], [34, 170, 16, 10, '#F6B8A0'], [52, 160, 10, 20, '#DCE6F0'], [64, 166, 14, 14, '#F2D88A'], [80, 170, 12, 10, '#C8E0D8'], [94, 163, 10, 17, '#F2E2C8'], [106, 168, 16, 12, '#E8A890'], [124, 171, 12, 9, '#D8E8F2'], [138, 167, 14, 13, '#F6D0B0']].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#9A8A8A" stroke-width=".5"/><rect x="${x + w * .62}" y="${y}" width="${F(w * .38)}" height="${h}" fill="#000" opacity=".08"/>${h > 12 ? `<path d="M${x + 2} ${y + 4} h${w - 4} M${x + 2} ${y + 9} h${w - 4}" stroke="#8AA0B8" stroke-width="1" stroke-dasharray="1.6 1.6"/>` : `<path d="M${x - 1} ${y} L${x + w / 2} ${y - 4} L${x + w + 1} ${y}Z" fill="#D8784A"/>`}`).join('')}
      <path d="M116 150 v14 M122 150 v14" stroke="#8A8A9A" stroke-width="1.2"/><rect x="113" y="143" width="12" height="8" rx="2" fill="#C8D2DE" stroke="#7A8A9A" stroke-width=".6"/>
      <g id="vc-luzes" style="opacity:0;transition:opacity 2s">${[[8, 172], [24, 170], [40, 174], [56, 166], [58, 174], [70, 170], [98, 168], [110, 172], [142, 171]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="2" fill="#FFE27A"/>`).join('')}</g>
      <rect x="0" y="140" width="160" height="42" fill="transparent"/></g>
    <g id="vc-fazendas" class="toque">
      <path d="M168 182 L180 176 H470 L478 182 V194 H168Z" fill="#9ACC5E" stroke="#6E9A3E" stroke-width=".8"/>
      <path d="M180 178 H300 M180 186 H300" stroke="#6EB0D8" stroke-width="1.2" opacity=".8"/>
      ${[178, 183, 189].map((y, r) => Array.from({ length:15 }, (_, i) => { const x = 184 + i * 8 + (r % 2) * 4, rr = 2.6 + r * .5; return `<circle cx="${x}" cy="${y}" r="${F(rr)}" fill="#2E7A3A" stroke="#1E5A2A" stroke-width=".5"/><circle cx="${F(x - rr * .3)}" cy="${F(y - rr * .3)}" r="${F(rr * .4)}" fill="#6EB85A"/>`; }).join('')).join('')}
      <g>${[0, 1, 2, 3].map(r => `<path d="M${312 + r * 4} ${178 + r * 4} H${468 - r * 2}" stroke="#3E8A3A" stroke-width="3" stroke-linecap="round"/><path d="M${312 + r * 4} ${177 + r * 4} H${468 - r * 2}" stroke="#8ED06A" stroke-width="1" stroke-linecap="round"/>`).join('')}<g fill="#6A2E8A">${Array.from({ length:22 }, (_, i) => `<circle cx="${318 + (i * 37) % 146}" cy="${180 + (i % 4) * 4}" r="1.1"/>`).join('')}</g></g>
      <g id="vc-aspersao" fill="#E6F6FF">${[[230, 176], [270, 176], [360, 176], [420, 176]].map(([x, y], i) => `<rect class="brilho" style="animation-delay:${i * .4}s" x="${x}" y="${y - 6}" width="1.6" height="6" rx=".8"/>`).join('')}</g>
      <rect x="166" y="168" width="314" height="28" fill="transparent"/></g>
    <g id="vc-caatinga">${Array.from({ length:30 }, (_, i) => { const x = 486 + i * 10.6 + R(-3, 3), y = 182 + R(-3, 3), r = R(3.4, 6); return `<path d="${copa(x, y, r, r * .72, 7, .35)}" fill="${['#A8A47E', '#9A9070', '#B4AA88', '#8E8A6E', '#B8A890'][i % 5]}" stroke="#6E6A52" stroke-width=".5"/>`; }).join('')}
      ${[[520, 186, 1], [600, 184, .8], [690, 186, 1.1], [760, 184, .9]].map(([x, y, k]) => `<path d="M${x} ${y} v${-14 * k} M${x} ${y - 9 * k} h${-4 * k} v${-5 * k} M${x} ${y - 7 * k} h${4 * k} v${-6 * k}" stroke="#4E7A4E" stroke-width="${F(2.2 * k)}" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g>${[[176, 191, 6], [196, 192, 5], [460, 190, 7], [480, 192, 5], [158, 192, 5], [560, 192, 6], [640, 193, 5], [740, 192, 6]].map(([x, y, r]) => `<path d="M${x} ${y} v6" stroke="#5A4A3A" stroke-width="1.2"/><path d="${copa(x, y - r * .4, r, r * .8, 8, .3)}" fill="#5EA05A" stroke="#2E6A3A" stroke-width=".6"/>`).join('')}</g>
    <!-- o rio -->
    <rect y="${AY}" width="800" height="${500 - AY}" fill="url(#vcRio)"/>
    <rect y="${AY}" width="800" height="18" fill="url(#vcReflexo)"/>
    <rect id="vc-por-agua" y="${AY}" width="800" height="${500 - AY}" fill="url(#vcPorAgua)" opacity="0" pointer-events="none"/>
    <g id="vc-reflexo-sol" style="opacity:0;transition:opacity 2s" fill="#FFE6A0">${Array.from({ length:9 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .3)}s" x="${F(470 - i * 4 - R(0, 20))}" y="${200 + i * 9}" width="${F(30 + i * 4)}" height="2.4" rx="1.2"/>`).join('')}</g>
    <g id="vc-correnteza" stroke="#E6F8FF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6" pointer-events="none">${Array.from({ length:40 }, () => { const x = R(0, 820), y = R(204, 490), w = 10 + (y - 196) * .08; return `<path d="M${F(x)} ${F(y)} q${F(w / 2)} -2 ${F(w)} 0"/>`; }).join('')}</g>
    <path d="M0 290 C140 250 300 236 460 250 C600 262 700 252 800 236 V300 C700 316 600 330 460 318 C300 304 150 320 0 350Z" fill="url(#vcFundoRio)" pointer-events="none"/>
    <path d="${linha(0)}" stroke="#C8F2EA" stroke-width="46" fill="none" opacity=".28" filter="url(#vcBorrao)" pointer-events="none"/>
    <path d="M-10 296 C40 300 100 312 150 322" stroke="#C8F2EA" stroke-width="36" fill="none" opacity=".25" filter="url(#vcBorrao)" pointer-events="none"/>
    <g pointer-events="none" opacity=".45" filter="url(#vcBorrao2)">${[[176, 199, 6], [196, 200, 5], [460, 199, 7], [480, 200, 5], [158, 200, 5], [560, 200, 6], [640, 201, 5], [740, 200, 6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + r * .9}" rx="${r}" ry="${F(r * .7)}" fill="#3E7A4A"/>`).join('')}<rect x="168" y="198" width="310" height="6" fill="#5E9A4A" opacity=".6"/></g>
    <g stroke="#0E5A72" stroke-width="1.2" fill="none" opacity=".35" stroke-linecap="round" pointer-events="none">${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(214, 490), w = 12 + (y - 196) * .09; return `<path d="M${F(x)} ${F(y)} q${F(w / 2)} 2 ${F(w)} 0"/>`; }).join('')}</g>
    <g fill="#fff" pointer-events="none">${Array.from({ length:14 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .37 % 2.6)}s" x="${F(200 + (i * 89) % 380)}" y="${F(206 + (i * 23) % 120)}" width="${8 + i % 3 * 5}" height="1.8" rx=".9" opacity=".85"/>`).join('')}</g>
    <g id="vc-turvo" pointer-events="none" style="transition:opacity 1.6s" opacity=".9">
      <path d="M556 350 C600 380 680 396 800 400 V500 H536 C548 470 516 420 556 350Z" fill="url(#vcTurvo)" opacity="1" filter="url(#vcBorrao)"/>
      <path d="M596 336 C540 334 470 352 410 378 C470 394 540 396 598 384Z" fill="#9A6434" opacity=".85" filter="url(#vcBorrao)"/>
      <path d="M584 296 C520 290 466 296 430 310 C476 324 532 322 584 318Z" fill="#9A6434" opacity=".6" filter="url(#vcBorrao)"/>
      <g stroke="#C8925A" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"><path d="M600 420 q-20 -4 -40 0 M640 450 q-24 -4 -48 0 M560 372 q-30 -2 -60 6 M700 430 q-20 -3 -40 0"/></g>
    </g>
    <path id="vc-canal" d="M${START.x} ${START.y} C640 236 560 290 ${WP[0].x} ${WP[0].y} S400 228 ${WP[1].x} ${WP[1].y} S280 268 ${WP[2].x} ${WP[2].y} L${DOCK.x} ${DOCK.y}" stroke="#0A4A62" stroke-width="30" fill="none" stroke-linecap="round" opacity=".22" pointer-events="none"/>
    <g id="vc-coroas">${COROAS.map((k, i) => `<g class="vc-coroa" data-i="${i}" style="transform-origin:${k.x}px ${k.y}px;transition:transform 2s ease-in-out"><ellipse cx="${k.x}" cy="${k.y}" rx="${k.rx * 1.5}" ry="${k.ry * 1.9}" fill="url(#vcRaso)"/><path d="M${k.x - k.rx} ${k.y + 2} C${k.x - k.rx * .7} ${k.y - k.ry * 1.1} ${k.x + k.rx * .6} ${k.y - k.ry * 1.2} ${k.x + k.rx} ${k.y} C${k.x + k.rx * .7} ${k.y + k.ry * 1.1} ${k.x - k.rx * .6} ${k.y + k.ry * 1.2} ${k.x - k.rx} ${k.y + 2}Z" fill="#C8A26A" opacity=".85"/><path d="M${F(k.x - k.rx * .86)} ${k.y + 1} C${F(k.x - k.rx * .6)} ${F(k.y - k.ry * .9)} ${F(k.x + k.rx * .5)} ${F(k.y - k.ry)} ${F(k.x + k.rx * .86)} ${k.y} C${F(k.x + k.rx * .5)} ${F(k.y + k.ry * .7)} ${F(k.x - k.rx * .5)} ${F(k.y + k.ry * .8)} ${F(k.x - k.rx * .86)} ${k.y + 1}Z" fill="url(#vcAreia)" stroke="#B8945A" stroke-width=".9"/><path d="M${F(k.x - k.rx * .5)} ${F(k.y - k.ry * .35)} q${F(k.rx * .3)} -3 ${F(k.rx * .7)} -2" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8" stroke-linecap="round"/><g stroke="#C8A46A" stroke-width=".7" fill="none" opacity=".8">${[0, 1, 2].map(q => `<path d="M${F(k.x - k.rx * .4 + q * k.rx * .25)} ${F(k.y + k.ry * .2)} q4 -2 8 0"/>`).join('')}</g></g>`).join('')}
      <ellipse cx="306" cy="206" rx="34" ry="5" fill="url(#vcAreia)" stroke="#B8945A" stroke-width=".7" opacity=".85"/>
      <g fill="none" stroke-linecap="round">${[[452, 218], [462, 216], [494, 219], [236, 223], [244, 222], [404, 300]].map(([x, y], i) => `<path d="M${x} ${y} q-2 -5 -4 -9 M${x} ${y} q0 -6 1 -11 M${x} ${y} q2 -5 5 -8" stroke="${i % 2 ? '#7EAA4A' : '#A8B85A'}" stroke-width="1.5"/>`).join('')}</g>
      <path d="M326 306 C340 300 356 302 370 298" stroke="#7A5A3A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M340 302 l-4 -6 M356 300 l3 -6" stroke="#7A5A3A" stroke-width="1.6" stroke-linecap="round"/>
      <g fill="#B8A890" stroke="#6E5E4A" stroke-width=".6">${[[486, 224, 3], [430, 222, 2.4], [408, 306, 3], [270, 228, 2.6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${F(r * .6)}"/>`).join('')}</g></g>
    <g id="vc-garcas" class="toque">${garca(352, 300, .55, 0)}${garca(392, 296, .5, 1)}<rect x="330" y="268" width="80" height="36" fill="transparent"/></g>
    <!-- boias do canal -->
    <g id="vc-boias">${WP.map((w, i) => `<g class="vc-boia toque" data-i="${i}"><g class="vc-boia-in" style="animation:flutua ${F(2 + i * .3)}s ease-in-out infinite alternate"><ellipse cx="${w.x}" cy="${w.y + 2}" rx="11" ry="3.4" fill="#0A3A4A" opacity=".3"/><path d="M${w.x - 7} ${w.y} L${w.x - 4} ${w.y - 22} H${w.x + 4} L${w.x + 7} ${w.y}Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.3" stroke-linejoin="round"/><path d="M${w.x - 5.6} ${w.y - 9} H${w.x + 5.6}" stroke="#fff" stroke-width="4"/><path d="M${w.x - 2.6} ${w.y - 19} v14" stroke="#FF9A8A" stroke-width="1.2" opacity=".8"/><circle cx="${w.x}" cy="${w.y - 25}" r="3" fill="#FFE27A" stroke="#A8700A" stroke-width=".8"/></g><g class="vc-boia-dica" style="display:none"><circle cx="${w.x}" cy="${w.y - 10}" r="18" fill="none" stroke="#fff" stroke-width="2.6" opacity=".8" class="vc-pulso"/>${brilhoHotspot(w.x + 14, w.y - 28)}</g><rect x="${w.x - 22}" y="${w.y - 40}" width="44" height="50" fill="transparent"/></g>`).join('')}</g>
    <!-- pescador com tarrafa -->
    <g id="vc-pescador" class="toque"><g transform="translate(566 209) scale(.6)"><g>
      <ellipse cx="0" cy="4" rx="52" ry="5" fill="#0A3A4A" opacity=".3"/>
      ${gente({ x:6, y:-4, s:1, pele:['#8A5A3A', '#6E4228', '#2A140A'], gp:'vcPeleD', gr:'vcCamD', r0:'#C8DCF0', re:'#5E7EA0', cab:'branco', cabCor:'#E4E4E4', calca:'#5A5048', bD:'cima', bE:'frente', idoso:true, sombra:false, mangaLonga:true, sobr:'#C8C8C8' })}
      <path d="M-48 -10 C-36 2 36 2 50 -12 L46 -14 H-44Z" fill="url(#vcCanoa)" stroke="#3A2010" stroke-width="1.6" stroke-linejoin="round"/><path d="M-44 -12 C-30 -6 30 -6 46 -13" stroke="#D8A878" stroke-width="1.6" fill="none"/>
      <path d="M-60 -4 C-30 -2 30 -2 62 -5 V3 C30 5 -30 5 -60 3Z" fill="#8ACCDC" opacity=".8"/>
      <g opacity=".32" filter="url(#vcBorrao2)"><path d="M-46 0 C-34 10 34 10 48 2 Z" fill="#4A2A14"/><path d="M-4 2 V22 M12 2 V24" stroke="#C8DCF0" stroke-width="10"/><circle cx="6" cy="34" r="7" fill="#6E4228"/></g>
      <path d="M-62 -3 q8 -2 16 0 M44 -4 q8 -2 16 0 M-40 6 q10 -2 20 0 M20 6 q10 -2 20 0" stroke="#F2FBFF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
      <g id="vc-tarrafa" style="opacity:0"><g transform="translate(-70 -30)"><g class="vc-rede"><ellipse cx="0" cy="0" rx="34" ry="12" fill="#fff" fill-opacity=".12" stroke="#F4F4F4" stroke-width="1.2"/>${Array.from({ length:12 }, (_, q) => `<path d="M0 -20 L${F(Math.cos(q * .52) * 34)} ${F(Math.sin(q * .52) * 12)}" stroke="#F4F4F4" stroke-width=".8"/>`).join('')}<ellipse cx="0" cy="0" rx="22" ry="7.6" fill="none" stroke="#F4F4F4" stroke-width=".8"/><g fill="#8A8A9A">${Array.from({ length:12 }, (_, q) => `<circle cx="${F(Math.cos(q * .52) * 34)}" cy="${F(Math.sin(q * .52) * 12)}" r="1.6"/>`).join('')}</g></g></g></g>
    </g></g><rect x="530" y="160" width="74" height="50" fill="transparent"/></g>
    <!-- figurinhas no rio -->
    <g id="vc-curimata" class="toque" data-fig="curimata">
      <ellipse cx="428" cy="338" rx="20" ry="4.4" fill="none" stroke="#F2FBFF" stroke-width="1.6" opacity=".85"/><ellipse cx="428" cy="338" rx="32" ry="7" fill="none" stroke="#E6F8FF" stroke-width="1" opacity=".5"/>
      <path d="M418 336 C414 326 418 318 424 314 M438 336 C444 328 444 320 440 316" stroke="#F2FBFF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>
      <g style="animation:flutua 2.4s ease-in-out infinite alternate"><g transform="translate(456 316) rotate(-24) scale(1.15)">${peixeC()}</g>
        <path d="M430 334 C440 312 462 300 482 304" stroke="#E6F8FF" stroke-width="1.4" fill="none" stroke-dasharray="1.5 5" stroke-linecap="round"/>
        <g fill="#E6F8FF" stroke="#8ACCE0" stroke-width=".5"><circle cx="420" cy="318" r="2"/><circle cx="444" cy="310" r="1.6"/><circle cx="486" cy="314" r="1.4"/><circle cx="414" cy="328" r="1.3"/></g></g>
      ${brilhoHotspot(482, 298)}<rect x="408" y="292" width="84" height="52" fill="transparent"/></g>
    <g id="vc-surubim" class="toque" data-fig="surubim">
      <g style="animation:flutua 4.4s ease-in-out infinite alternate"><svg x="504" y="358" width="72" height="25" viewBox="0 8 150 52" opacity=".72"><use href="#f-surubim"/></svg></g>
      <ellipse cx="540" cy="378" rx="46" ry="9" fill="url(#vcSob)" pointer-events="none"/>
      <path d="M512 368 q8 -2.4 16 0 t16 0 M546 380 q8 -2.4 16 0 t16 0" stroke="#E6F8FF" stroke-width="1.2" fill="none" opacity=".75"/>
      <ellipse cx="540" cy="364" rx="14" ry="2.6" fill="none" stroke="#F2FBFF" stroke-width="1.2" opacity=".7"/>
      <g fill="#fff"><rect class="brilho" x="520" y="372" width="10" height="1.6" rx=".8"/><rect class="brilho" style="animation-delay:.8s" x="556" y="366" width="8" height="1.4" rx=".7"/></g>
      ${brilhoHotspot(568, 356)}<rect x="500" y="350" width="80" height="40" fill="transparent"/></g>
    <!-- barca -->
    <g id="vc-barca" class="toque" style="cursor:grab"><g id="vc-barca-pos" transform="translate(${START.x} ${START.y}) scale(.55)"><g id="vc-barca-vira"><g style="animation:flutua 2.8s ease-in-out infinite alternate">${barca()}</g></g></g></g>
    <!-- barranco desmatado -->
    <g id="vc-barranco">
      <path d="M584 270 C620 258 700 250 800 246 V290 C730 296 650 296 598 290 Z" fill="url(#vcBarTopo)" stroke="#6E4224" stroke-width="1.4"/>
      <g stroke="#8A5A32" stroke-width="1" fill="none" opacity=".7"><path d="M610 276 l8 4 l6 -2 l6 5 M660 266 l6 5 l10 -1 M700 262 l-4 6 l8 4 M748 258 l6 4 l-2 6 M780 264 l-6 5"/></g>
      <g>${Array.from({ length:10 }, () => { const x = R(596, 796), y = 290 - (x - 590) * .2 + R(-2, 4), r = R(3, 6); return `<path d="${copa(x, y, r, r * .6, 6, .3)}" fill="#C88A56" stroke="#6E4224" stroke-width=".8"/>`; }).join('')}</g>
      <g id="vc-tocos">${[[650, 272], [705, 266], [760, 262]].map(([x, y]) => `<path d="M${x - 6} ${y} V${y - 8} C${x - 6} ${y - 11} ${x + 6} ${y - 11} ${x + 6} ${y - 8} V${y}Z" fill="#8A6A4A" stroke="#4A3220" stroke-width="1.1"/><ellipse cx="${x}" cy="${y - 9}" rx="6" ry="2.2" fill="#D8B88A" stroke="#4A3220" stroke-width=".9"/><path d="M${x - 3} ${y - 9} a3 1.2 0 1 0 6 0" stroke="#A8865A" stroke-width=".6" fill="none"/>`).join('')}</g>
      <g id="vc-capim-seco">${capimSeco()}</g>
      <path d="M584 270 L598 290 C650 296 730 296 800 290 V420 C740 412 690 416 650 408 C620 402 596 394 584 378 C574 352 574 300 584 270Z" fill="url(#vcBarFace)" stroke="#5E2E14" stroke-width="1.6"/>
      <g clip-path="url(#vcFaceClip)">
        ${[[310, '#C87848'], [330, '#A85A34'], [352, '#D49058'], [374, '#9A4E2C'], [396, '#C27040']].map(([y, c], i) => `<path d="M570 ${y} C640 ${y + 6} 720 ${y - 2} 810 ${y + 4} V${y + 12} C720 ${y + 8} 640 ${y + 16} 570 ${y + 10}Z" fill="${c}" opacity=".7"/>`).join('')}
        <g fill="#6E3418" opacity=".28">${[[604, 292, 10, 60], [636, 296, 8, 74], [690, 296, 12, 88], [742, 294, 9, 70], [786, 292, 10, 82]].map(([x, y, w, h]) => `<path d="M${x - w / 2} ${y} C${x - w / 3} ${y + h * .5} ${x - 1} ${y + h * .8} ${x} ${y + h} C${x + 1} ${y + h * .8} ${x + w / 3} ${y + h * .5} ${x + w / 2} ${y}Z"/>`).join('')}</g>
        <g stroke="#F2D2A8" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"><path d="M618 294 c-2 10 4 16 0 26 M664 296 c3 12 -3 18 1 30 M716 296 c-3 8 2 14 -1 22 M770 294 c2 10 -2 18 2 28"/></g>
        <g stroke-width=".9" fill="none" opacity=".55">${Array.from({ length:16 }, (_, i) => { const y = 300 + i * 7 + R(-2, 2); return `<path d="M572 ${F(y)} C620 ${F(y + R(-3, 3))} 660 ${F(y + R(2, 6))} 700 ${F(y + R(-2, 2))} S770 ${F(y + R(-4, 2))} 810 ${F(y + 3)}" stroke="${i % 2 ? '#7A3A1C' : '#F2C894'}"/>`; }).join('')}</g>
        <g>${Array.from({ length:40 }, () => { const x = R(580, 798), y = R(354, 366) + (x - 580) * .02, r = R(1.6, 3.4); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(r)}" ry="${F(r * .7)}" fill="#D8C4A8" stroke="#6E4A30" stroke-width=".5"/>`; }).join('')}</g>
        <g>${Array.from({ length:6 }, () => { const x = R(594, 790), y = R(310, 396), r = R(4, 7); return `<path d="${copa(x, y, r, r * .55, 6, .3)}" fill="#B86A3E" stroke="#5E2E14" stroke-width="1"/><path d="M${F(x - r * .6)} ${F(y - r * .3)} q${F(r * .5)} ${F(-r * .4)} ${F(r)} ${F(-r * .1)}" stroke="#F2C894" stroke-width="1" fill="none"/><ellipse cx="${F(x + 1)}" cy="${F(y + r * .8)}" rx="${F(r)}" ry="2" fill="#4A2010" opacity=".3"/>`; }).join('')}</g>
        <g fill="#E8B88A" opacity=".5">${Array.from({ length:30 }, () => `<ellipse cx="${F(R(580, 798))}" cy="${F(R(300, 410))}" rx="${F(R(1.4, 3.6))}" ry="${F(R(1, 2))}"/>`).join('')}</g>
        <g fill="#4A2410" opacity=".4">${Array.from({ length:26 }, () => `<circle cx="${F(R(580, 798))}" cy="${F(R(300, 410))}" r="${F(R(.8, 1.8))}"/>`).join('')}</g>
        <g id="vc-raizes">${COVAS.map((p, i) => `<path class="vc-raiz" d="M${p.x} ${p.y} C${p.x - 4} ${p.y + 20} ${p.x + 6} ${p.y + 40} ${p.x - 2} ${p.y + 66} C${p.x - 6} ${p.y + 80} ${p.x + 4} ${p.y + 94} ${p.x} ${p.y + 110} M${p.x} ${p.y + 18} C${p.x + 12} ${p.y + 28} ${p.x + 20} ${p.y + 32} ${p.x + 26} ${p.y + 48} M${p.x - 1} ${p.y + 34} C${p.x - 14} ${p.y + 44} ${p.x - 18} ${p.y + 56} ${p.x - 26} ${p.y + 70} M${p.x - 2} ${p.y + 66} C${p.x + 10} ${p.y + 74} ${p.x + 14} ${p.y + 86} ${p.x + 20} ${p.y + 98}" stroke="#F0DCB4" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="transition:stroke-dashoffset 2.6s ease-out"/>`).join('')}</g>
        <path d="M576 300 C600 292 700 290 800 292" stroke="#F2C894" stroke-width="2" fill="none" opacity=".6"/>
      </g>
      <g id="vc-pe-barranco">${Array.from({ length:12 }, (_, i) => { const x = 588 + i * 18 + R(-4, 4), y = 404 + (x - 584) * .06 + R(-3, 3), r = R(5, 10); return `<path d="${copa(x, y, r, r * .55, 7, .3)}" fill="${i % 2 ? '#A85A34' : '#C27040'}" stroke="#5E2E14" stroke-width="1"/>`; }).join('')}</g>
      <path d="M580 392 C620 410 700 420 800 424" stroke="#D8B48A" stroke-width="3" fill="none" opacity=".5"/>
      <g id="vc-capim-novo" style="opacity:0;transition:opacity 2s">${capimVerde()}</g>
      <g id="vc-arvores">${COVAS.map((p, i) => `<g class="vc-arv" data-i="${i}" transform="translate(${p.x} ${p.y})"><g class="vc-arv-in" style="transform-origin:0px 0px;transform:scale(0);transition:transform 1.6s cubic-bezier(.3,1.3,.5,1)"><g class="balanca" style="animation-duration:${F(5 + i * .7)}s;transform-origin:0px 0px">${arvore(ARV[i], [118, 108, 96, 102][i])}</g></g></g>`).join('')}</g>
      <g id="vc-covas">${COVAS.map((p, i) => `<g class="vc-cova toque" data-i="${i}"><ellipse cx="${p.x}" cy="${p.y}" rx="9" ry="3.6" fill="#4A2A14" stroke="#2A1408" stroke-width="1"/><ellipse cx="${p.x}" cy="${p.y - .6}" rx="6" ry="2" fill="#2A1408"/><g class="vc-cova-dica" style="display:none"><circle cx="${p.x}" cy="${p.y - 4}" r="14" fill="none" stroke="#fff" stroke-width="2.4" class="vc-pulso"/>${brilhoHotspot(p.x + 12, p.y - 18)}</g><rect x="${p.x - 22}" y="${p.y - 34}" width="44" height="46" fill="transparent"/></g>`).join('')}</g>
    </g>
    <g id="vc-ararinha2" pointer-events="none" style="opacity:0"><g id="vc-ar2-pos"><g transform="scale(1.15)">
      <path d="M-7 1 C-14 3 -22 6 -30 10 C-22 4 -14 0 -7 -2Z" fill="#1E4AA0" stroke="#102A66" stroke-width=".9" stroke-linejoin="round"/>
      <ellipse cx="0" cy="0" rx="10" ry="6.4" fill="#3A78D2" stroke="#143A86" stroke-width="1.2"/>
      <path d="M-6 -3 C-2 -5 3 -5 6 -4" stroke="#A8D0FF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="9" cy="-4" r="5.4" fill="#A8C4E0" stroke="#4E6E9E" stroke-width="1.1"/>
      <path d="M13 -6 C17 -6 19 -3 17 0 C16 1 14 0 13 -1Z" fill="#2A2E38" stroke="#0E1014" stroke-width=".7"/>
      <circle cx="10.4" cy="-5" r="1.6" fill="#F2E6B0" stroke="#3A3E4A" stroke-width=".5"/><circle cx="10.7" cy="-5" r=".9" fill="#16141C"/><circle cx="11" cy="-5.4" r=".35" fill="#fff"/>
      <g class="vc-asa" style="transform-origin:0px -2px"><path d="M2 -3 C-2 -14 -10 -20 -16 -20 C-12 -14 -8 -8 -4 -2Z" fill="#2A5CB4" stroke="#102A66" stroke-width="1" stroke-linejoin="round"/><path d="M-2 -6 l-8 -9 M0 -4 l-6 -10" stroke="#7EB4F2" stroke-width=".7" opacity=".7"/></g>
    </g></g></g>
    <!-- margem de cá: comunidade e vazante -->
    <g id="vc-caraibeira" class="toque">
      <path d="M118 336 C112 300 124 280 112 248 M114 272 C96 262 84 250 74 232 M116 262 C132 250 146 240 160 226 M112 248 C108 230 112 216 106 200" stroke="#4A3A2A" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M118 336 C112 300 124 280 112 248" stroke="#8A7A62" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="${copa(72, 214, 40, 26, 11, .3)}" fill="url(#vcCaraib2)" stroke="#B07A08" stroke-width="1.2"/>
      <path d="${copa(150, 210, 38, 26, 11, .3)}" fill="url(#vcCaraib2)" stroke="#B07A08" stroke-width="1.2"/>
      <path d="${copa(110, 186, 50, 30, 13, .28)}" fill="url(#vcCaraib)" stroke="#B07A08" stroke-width="1.3"/>
      ${flores(110, 200, 82, 40, 70, ['#FFF27A', '#FFE04A', '#F6B21E', '#FFFBD0', '#E8901E'])}
      <path d="M78 172 q22 -16 54 -14" stroke="#FFFBE0" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M40 222 C60 216 80 214 100 218" stroke="#4A3A2A" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    </g>
    <g id="vc-celeste" class="toque" data-fig="ararinhaazul"><g id="vc-celeste-pos"><g id="vc-celeste-in" style="transform-origin:70px 222px"><svg x="40" y="160" width="56" height="62" viewBox="0 0 110 120"><use href="#f-ararinhaazul"/></svg></g></g>${brilhoHotspot(94, 166)}<rect x="36" y="158" width="62" height="66" fill="transparent"/></g>
    <path id="vc-terra" d="${terraD}" fill="url(#vcTerra)" stroke="#8A5E32" stroke-width="1.4"/>
    <g clip-path="url(#vcTerraClip)" pointer-events="none">
      <path d="${linha(0)}" stroke="#9A6A3E" stroke-width="16" fill="none" opacity=".28"/><path d="${linha(0)}" stroke="#7A5232" stroke-width="5" fill="none" opacity=".3"/>
      <path d="M40 342 C110 360 180 380 230 410 C270 434 300 460 316 512" stroke="#C49460" stroke-width="24" fill="none" opacity=".35" stroke-linecap="round"/><path d="M40 342 C110 360 180 380 230 410 C270 434 300 460 316 512" stroke="#F0D6A4" stroke-width="16" fill="none" opacity=".55" stroke-linecap="round"/>
      <g fill="#A87A48" opacity=".55">${Array.from({ length:70 }, () => `<ellipse cx="${F(R(0, 520))}" cy="${F(R(330, 500))}" rx="${F(R(1.4, 4))}" ry="${F(R(.8, 1.8))}"/>`).join('')}</g>
      <g fill="#FFF0D0" opacity=".5">${Array.from({ length:40 }, () => `<ellipse cx="${F(R(0, 520))}" cy="${F(R(330, 500))}" rx="${F(R(1, 2.6))}" ry="${F(R(.6, 1.2))}"/>`).join('')}</g>
      <g>${Array.from({ length:12 }, () => { const x = R(170, 480), y = R(410, 498), r = R(2.6, 5.4); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(r)}" ry="${F(r * .6)}" fill="#B8A890" stroke="#6E5E4A" stroke-width=".8"/><path d="M${F(x - r * .5)} ${F(y - r * .2)} q${F(r * .4)} ${F(-r * .4)} ${F(r * .8)} ${F(-r * .2)}" stroke="#F2EAD8" stroke-width=".8" fill="none"/>`; }).join('')}</g>
      <g fill="none" stroke-linecap="round">${Array.from({ length:34 }, () => { const x = R(0, 470), y = R(345, 500), h = R(5, 11), c = ['#B8A050', '#98A048', '#C8B060', '#7E9A3E'][Math.floor(R(0, 4))]; return `<path d="M${F(x)} ${F(y)} q-2 ${F(-h / 2)} -4 ${F(-h)} M${F(x)} ${F(y)} q0 ${F(-h / 2)} 1 ${F(-h * 1.2)} M${F(x)} ${F(y)} q2 ${F(-h / 2)} 5 ${F(-h * .9)}" stroke="${c}" stroke-width="1.3"/>`; }).join('')}</g>
    </g>
    <g id="vc-faixas">${[0, 1, 2, 3].map(k => `<path class="vc-faixa" data-k="${k}" d="${faixa(k, k + 1)}" fill="url(#vcLama)"/><path d="${faixa(k + .55, k + 1)}" fill="#2A4A52" opacity="${F(.12 + k * .05)}"/><path d="${linha(k + 1)}" stroke="#C89A6A" stroke-width="1.2" fill="none" opacity=".5"/>`).join('')}
      <g fill="#fff" opacity=".22">${Array.from({ length:26 }, () => { const k = R(.2, 3.8), t = R(.12, .9), [x, y] = pt(k, t); return `<path d="M${F(x)} ${F(y)} q4 -1.4 8 0"/>`; }).join('')}</g>
      <g fill="#3E6A7A" opacity=".55">${Array.from({ length:14 }, () => { const [x, y] = pt(R(.4, 3.6), R(.2, .85)); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="3" ry="1.2"/>`; }).join('')}</g></g>
    <g id="vc-capas">${[0, 1, 2, 3].map(k => `<path class="vc-capa" data-k="${k}" d="${faixa(k, k + 1)}" fill="url(#vcRio)" style="transition:opacity 2.2s"/>`).join('')}</g>
    <g id="vc-margens" pointer-events="none">${[0, 1, 2, 3, 4].map(k => `<path class="vc-margem" data-k="${k}" d="${linha(k)}" stroke="#F2FBFF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="${k ? 0 : .85}" style="transition:opacity 1.6s"/>`).join('')}</g>
    <g id="vc-brilha-faixa" pointer-events="none">${[0, 1, 2, 3].map(k => `<g class="vc-bf" data-k="${k}" style="display:none">${[.25, .4, .55, .7].map((t, q) => { const [x, y] = pt(k + .5, t); return `<g class="brilho" style="animation-delay:${q * .35}s">${brilhoHotspot(+F(x), +F(y - 4))}</g>`; }).join('')}<path d="${faixa(k, k + 1)}" fill="#FFF6C0" opacity=".18"/></g>`).join('')}</g>
    <g id="vc-plantas">${[3, 2, 1, 0].map(k => PLT.map((t, j) => { const [x, y] = pt(k + .55, t + PLX[k]); return `<g class="vc-pl" data-k="${k}" transform="translate(${F(x)} ${F(y)}) scale(${F(ESC[k])})"><g class="vc-pl-in" style="transform-origin:0px 0px;transform:scale(0);transition:transform 1.3s cubic-bezier(.3,1.4,.5,1)">${planta(SEM[k])}</g></g>`; }).join('')).join('')}</g>
    <g id="vc-faixa-alvo">${[0, 1, 2, 3].map(k => `<path class="vc-alvo" data-k="${k}" d="${faixa(k, k + 1)}" fill="transparent" style="display:none"/>`).join('')}</g>
    <!-- casa, píer, potes -->
    <g id="vc-casa">
      <ellipse cx="50" cy="338" rx="62" ry="6" fill="#5E3E1E" opacity=".25"/>
      <rect x="2" y="284" width="96" height="52" fill="url(#vcParede)" stroke="#1E6A6A" stroke-width="1.6"/>
      <rect x="2" y="326" width="96" height="10" fill="#E8D6B8" stroke="#1E6A6A" stroke-width="1"/>
      <path d="M-6 286 L50 254 L106 286Z" fill="url(#vcTelha)" stroke="#6E2410" stroke-width="1.6" stroke-linejoin="round"/>
      <g stroke="#8A2E14" stroke-width=".9" opacity=".7" fill="none">${[0, 1, 2, 3, 4].map(q => `<path d="M${F(2 + q * 3)} ${F(282 - q * 5.6)} L${F(98 - q * 3)} ${F(282 - q * 5.6)}"/>`).join('')}</g>
      <path d="M-6 286 L50 254 L106 286" stroke="#FFB08A" stroke-width="1.4" fill="none" opacity=".6"/>
      <rect x="40" y="298" width="20" height="38" rx="1" fill="#C8562E" stroke="#6E2410" stroke-width="1.3"/><path d="M50 298 v38" stroke="#6E2410" stroke-width=".9"/><circle cx="56" cy="318" r="1.2" fill="#FFE27A"/>
      <rect x="10" y="298" width="20" height="16" fill="#FFF2C0" stroke="#1E6A6A" stroke-width="1.2"/><path d="M10 298 l-4 18 h4Z M30 298 l4 18 h-4Z" fill="#E8A21E" stroke="#8A5A08" stroke-width=".8"/><path d="M20 298 v16 M10 306 h20" stroke="#1E6A6A" stroke-width=".9"/>
      <rect x="70" y="298" width="20" height="16" fill="#FFF2C0" stroke="#1E6A6A" stroke-width="1.2"/><path d="M80 298 v16 M70 306 h20" stroke="#1E6A6A" stroke-width=".9"/>
      <path d="M4 288 h92" stroke="#fff" stroke-width="1.4" opacity=".6"/>
      <g fill="#FF6A8E">${[[12, 324], [22, 323], [74, 324], [86, 323]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g><path d="M8 326 q6 -6 20 0 M70 326 q8 -6 20 0" stroke="#3E8A3A" stroke-width="2" fill="none"/>
    </g>
    <g id="vc-pote" class="toque"><ellipse cx="26" cy="362" rx="20" ry="3.4" fill="#3A2210" opacity=".25"/>
      <path d="M12 362 C2 352 4 336 12 332 H22 C30 336 32 352 22 362Z" fill="url(#vcPote)" stroke="#5E2A12" stroke-width="1.3"/><ellipse cx="17" cy="332" rx="5.4" ry="1.8" fill="#6E3418" stroke="#5E2A12" stroke-width="1"/><path d="M9 344 q8 3 16 0" stroke="#F2C894" stroke-width="1.2" fill="none"/><path d="M8 340 q1 -4 4 -6" stroke="#FFD8B0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M30 362 C24 356 26 346 31 344 H38 C43 346 45 356 39 362Z" fill="url(#vcPote)" stroke="#5E2A12" stroke-width="1.2"/><ellipse cx="34.5" cy="344" rx="3.6" ry="1.2" fill="#6E3418"/><path d="M28 352 q6 2 12 0" stroke="#E8604A" stroke-width="1.2" fill="none"/>
      <rect x="0" y="326" width="48" height="40" fill="transparent"/></g>
    <g id="vc-pier">
      <path d="M92 336 L186 276 L204 286 L112 348Z" fill="#B08452" stroke="#4A2E16" stroke-width="1.4" stroke-linejoin="round"/>
      <g stroke="#6E4A28" stroke-width="1">${Array.from({ length:11 }, (_, i) => { const t = i / 10, x0 = 92 + 94 * t, y0 = 336 - 60 * t; return `<path d="M${F(x0)} ${F(y0)} L${F(x0 + 19)} ${F(y0 + 11.6)}"/>`; }).join('')}</g>
      <path d="M92 336 L186 276" stroke="#E2BC8A" stroke-width="1.4"/>
      <g stroke="#3A2410" stroke-width="3.4" stroke-linecap="round"><path d="M200 288 v20 M186 278 v14 M150 312 v14 M168 300 v14"/></g>
      <g stroke="#E6F8FF" stroke-width="1.2" fill="none" opacity=".7"><path d="M194 308 q6 -2 12 0 M144 326 q6 -2 12 0 M162 314 q6 -2 12 0"/></g>
    </g>
    <g id="vc-menina" class="toque">${gente({ x:150, y:313, s:.92, pele:['#C88A5C', '#A06A42', '#5A3018'], gp:'vcPeleB', gr:'vcCamB', r0:'#F4F8FF', re:'#5A7AA8', cab:'cachos', cabCor:'#2A1A14', calca:'#2E4A8A', short:true, bD:'aceno', idBraco:'vc-braco-me', estampa:'listra' })}</g>
    <g id="vc-cabra" class="toque"><g id="vc-cabra-pos" transform="translate(300 486) scale(1.05)">${cabra()}</g><rect x="270" y="446" width="50" height="44" fill="transparent"/></g>
    <g id="vc-vazanteira" class="toque">${gente({ x:84, y:474, s:1.42, pele:['#9A6440', '#7A4A2C', '#3A1E10'], gp:'vcPeleA', gr:'vcBlusaA', r0:'#FF8A3A', re:'#8A3A10', cab:'coque', cabCor:'#3A3430', chapeu:'palha', saia:'#2E9A96', bD:'baixo', bE:'quadril', idBraco:'vc-braco-vz', estampa:'flores', brinco:true, idoso:true })}</g>
    <g id="vc-balaio"><ellipse cx="${CUIA0.x}" cy="${CUIA0.y + 18}" rx="22" ry="4" fill="#3A2210" opacity=".25"/><path d="M${CUIA0.x - 20} ${CUIA0.y + 2} L${CUIA0.x - 16} ${CUIA0.y + 18} H${CUIA0.x + 16} L${CUIA0.x + 20} ${CUIA0.y + 2}Z" fill="url(#vcCesto)" stroke="#6E4418" stroke-width="1.4" stroke-linejoin="round"/><path d="M${CUIA0.x - 19} ${CUIA0.y + 8} H${CUIA0.x + 19} M${CUIA0.x - 17} ${CUIA0.y + 13} H${CUIA0.x + 17}" stroke="#8A5A22" stroke-width="1"/><g stroke="#8A5A22" stroke-width=".8" opacity=".7">${[-12, -4, 4, 12].map(d => `<path d="M${CUIA0.x + d} ${CUIA0.y + 2} v16"/>`).join('')}</g></g>
    <g id="vc-sem" class="toque" style="cursor:grab;opacity:.45" transform="translate(${CUIA0.x} ${CUIA0.y})"><g id="vc-sem-in"><ellipse cx="0" cy="2" rx="17" ry="7" fill="url(#vcCuia)" stroke="#4A2A10" stroke-width="1.4"/><path d="M-17 0 C-14 9 14 9 17 0" fill="url(#vcCuia)" stroke="#4A2A10" stroke-width="1.2"/><ellipse cx="0" cy="0" rx="14" ry="4.6" fill="#6E4A2A"/><g id="vc-sem-icone" transform="translate(0 -3)">${sementeIcone('feijao')}</g><path d="M-12 4 q4 3 10 3" stroke="#F2C894" stroke-width="1.2" fill="none" stroke-linecap="round"/></g><g id="vc-sem-dica" style="display:none">${brilhoHotspot(14, -14)}</g><circle r="22" fill="transparent"/></g>
    <g clip-path="url(#vcEspelhoClip)" pointer-events="none"><g opacity=".3" filter="url(#vcBorrao2)"><use href="#vc-barranco" transform="translate(0 828) scale(1 -1)"/></g><g stroke="#E6F8FF" stroke-width="1.4" fill="none" opacity=".6">${Array.from({ length:10 }, (_, i) => `<path d="M${F(590 + (i * 53) % 210)} ${F(426 + (i * 17) % 70)} q8 -2 16 0 t16 0"/>`).join('')}</g></g>
    <!-- canoa do viveiro -->
    <g id="vc-canoa-viv">
      <ellipse cx="704" cy="474" rx="100" ry="8" fill="#0A3A4A" opacity=".3"/>
      <g id="vc-agente" class="toque">${gente({ x:760, y:462, s:1.12, pele:['#7A4C34', '#5A3422', '#1E0E06'], gp:'vcPeleE', gr:'vcCamE', r0:'#FFD84A', re:'#A8700A', cab:'trancas', cabCor:'#1A1210', calca:'#2E3A5A', bD:'frente', idBraco:'vc-braco-ag', estampa:'colete', sombra:false })}</g>
      <path d="M606 452 C626 478 772 482 796 456 L792 450 H610Z" fill="url(#vcCanoa)" stroke="#3A2010" stroke-width="2" stroke-linejoin="round"/>
      <path d="M612 454 C640 466 760 468 790 454" stroke="#D8A878" stroke-width="2" fill="none"/><path d="M620 462 C660 474 740 474 780 462" stroke="#4A2A14" stroke-width="1" fill="none" opacity=".6"/>
      <path d="M624 452 L628 436 H690 L694 452Z" fill="#C8955A" stroke="#6E4418" stroke-width="1.3"/><path d="M626 444 H692" stroke="#6E4418" stroke-width=".9"/>
      <g id="vc-mudas-caixa">${[0, 1, 2, 3].map(i => `<g class="vc-mc" data-i="${i}" transform="translate(${636 + i * 15} 440) scale(.8)">${muda()}</g>`).join('')}</g>
    </g>
    <g id="vc-muda" class="toque" style="cursor:grab;display:none" transform="translate(${MUDA0.x} ${MUDA0.y})"><g style="animation:flutua 1.6s ease-in-out infinite alternate">${muda()}</g><g id="vc-muda-dica">${brilhoHotspot(12, -30)}</g><circle cy="-12" r="20" fill="transparent"/></g>
    <!-- peixes de volta -->
    <g id="vc-peixes" pointer-events="none" style="opacity:0;transition:opacity 1.6s">
      ${[[560, 432, 1], [600, 470, -1], [548, 482, 1]].map(([x, y, d], i) => `<g class="vc-pulo" data-i="${i}" transform="translate(${x} ${y})"><g class="vc-pulo-in" style="opacity:0"><g transform="scale(${d * .8} .8) translate(0 -14)">${peixeC()}</g></g></g>`).join('')}
      <g id="vc-surubim-nada" transform="translate(680 490)"><g class="vc-sn-in"><path d="M-30 0 C-20 -6 10 -7 26 -2 C30 0 30 3 26 4 C10 8 -20 7 -30 0Z M26 0 l10 -6 v12Z" fill="#2A4A5A" opacity=".45"/><path d="M-30 -1 l-10 -3 M-30 1 l-10 4" stroke="#2A4A5A" stroke-width="1" opacity=".5"/></g></g>
    </g>
    <!-- molduras -->
    <g pointer-events="none">${moita(-6, 500, 1.1)}${moita(36, 506, .8)}</g>
    <g pointer-events="none" class="balanca" style="animation-duration:5s;transform-origin:790px 500px">${Array.from({ length:8 }, (_, i) => { const x = 772 + i * 4, h = 64 + (i % 3) * 20, xe = x - 4 + (i % 2) * 8; return `<path d="M${x} 500 Q${x - 6} ${500 - h * .6} ${xe} ${500 - h}" stroke="#1E4A26" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x} 500 Q${x - 6} ${500 - h * .6} ${xe} ${500 - h}" stroke="${i % 2 ? '#5EA85A' : '#7EC06A'}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${i % 3 === 1 ? `<rect x="${xe - 3}" y="${500 - h - 4}" width="6" height="18" rx="3" fill="#7A4A2A" stroke="#3E2414" stroke-width=".9"/><path d="M${xe} ${500 - h - 4} v-7" stroke="#3E6A2A" stroke-width="1.4"/>` : ''}`; }).join('')}</g>
    <rect id="vc-agua-toque" x="0" y="0" width="0" height="0" fill="transparent"/>
    <rect id="vc-por-tinta" width="800" height="500" fill="#FF8A4A" opacity="0" pointer-events="none" style="mix-blend-mode:multiply"/>
    <rect width="800" height="500" fill="url(#vcVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#vcGrao)" pointer-events="none"/>
  </svg>`;
  function capimSeco(){ return Array.from({ length:16 }, () => { const x = R(592, 796), y = 290 - (x - 592) * .2 + R(-14, 0); return `<path d="M${F(x)} ${F(y)} l-2 -5 M${F(x)} ${F(y)} l1 -6 M${F(x)} ${F(y)} l3 -4" stroke="#B89A5A" stroke-width="1" fill="none"/>`; }).join(''); }
  function capimVerde(){ return Array.from({ length:30 }, () => { const x = R(590, 798), y = 290 - (x - 590) * .2 + R(-14, 2), h = R(5, 10); return `<path d="M${F(x)} ${F(y)} q-2 ${F(-h / 2)} -3 ${F(-h)} M${F(x)} ${F(y)} q1 ${F(-h / 2)} 1 ${F(-h * 1.1)} M${F(x)} ${F(y)} q2 ${F(-h / 2)} 4 ${F(-h * .9)}" stroke="${R(0, 1) < .5 ? '#4E9A3A' : '#7CC04E'}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`; }).join(''); }
  function moita(x, y, k){ return `<g transform="translate(${x} ${y}) scale(${k})">${Array.from({ length:9 }, (_, i) => { const a = -1.4 + i * .35, L = 40 + (i % 3) * 14; return `<path d="M0 0 Q${F(Math.cos(a - 1.57) * L * .3 + 2)} ${F(-L * .5)} ${F(Math.sin(a) * L * .8)} ${F(-Math.cos(a) * L)}" stroke="#2E4A1E" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M0 0 Q${F(Math.cos(a - 1.57) * L * .3 + 2)} ${F(-L * .5)} ${F(Math.sin(a) * L * .8)} ${F(-Math.cos(a) * L)}" stroke="${i % 2 ? '#8EB84A' : '#B8C85A'}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }).join('')}<g fill="#E5392C" stroke="#7A1410" stroke-width=".6"><circle cx="-4" cy="-30" r="2.6"/><circle cx="8" cy="-40" r="2.2"/></g></g>`; }
  const c = criarCena(palco, svg), s = c.svg;
  /* ---------- animações de ambiente ---------- */
  el(s, '#vc-correnteza').animate([{ transform:'translateX(0)' }, { transform:'translateX(-40px)' }], { duration:5200, iterations:Infinity });
  s.querySelectorAll('.vc-pulso').forEach(p => { p.style.transformBox = 'fill-box'; p.style.transformOrigin = 'center'; p.animate([{ transform:'scale(.7)', opacity:.9 }, { transform:'scale(1.4)', opacity:0 }], { duration:1300, iterations:Infinity }); });
  el(s, '#vc-aves').animate([{ transform:'translateX(0)' }, { transform:'translateX(-60px)' }], { duration:16000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-10, 10), y:y + sorte(-2, 2), t:i * 2, cor:cor || '#E6F6FF' }); };
  const brilha = (x, y, n, cor) => c.brilhos(x, y, n, cor);
  /* ---------- arrasto genérico ---------- */
  let arr = null;
  function arrastavel(g, ok, x0, y0, solta){
    const st = { x:x0, y:y0 };
    const poe = (x, y) => g.setAttribute('transform', `translate(${F(x)} ${F(y)})`);
    g.addEventListener('pointerdown', e => { if (!ok() || ocupado || arr) return; e.stopPropagation(); const p = c.ponto(e); arr = { tipo:'g', g, st, poe, solta, dx:p.x - st.x, dy:p.y - st.y, px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique'); });
    return { st, poe };
  }
  function voa(g, st, x1, y1, ms, fim){
    const x0 = st.x, y0 = st.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); st.x = x0 + (x1 - x0) * e; st.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 36;
      g.setAttribute('transform', `translate(${F(st.x)} ${F(st.y)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  /* ---------- 1. navegar pelo canal ---------- */
  const barcaG = el(s, '#vc-barca'), barcaPos = el(s, '#vc-barca-pos'), barcaVira = el(s, '#vc-barca-vira');
  const escala = y => .5 + (y - 210) * .0042;
  const poeBarca = (x, y) => { bx = x; by = y; barcaPos.setAttribute('transform', `translate(${F(x)} ${F(y)}) scale(${F(escala(y))})`); };
  const vira = d => { if (d === virado) return; virado = d; barcaVira.setAttribute('transform', d ? 'scale(-1 1)' : ''); };
  const esteira = on => s.querySelectorAll('.vc-esteira').forEach(e => e.style.opacity = on ? 1 : 0);
  const naCoroa = (x, y) => COROAS.find(k => ((x - k.x) / (k.rx + 16)) ** 2 + ((y - k.y) / (k.ry + 7)) ** 2 < 1);
  const boiaG = [...s.querySelectorAll('.vc-boia')];
  const marcaBoia = () => boiaG.forEach((b, i) => { el(b, '.vc-boia-dica').style.display = fase === 'navega' && i === boias ? '' : 'none'; });
  let ultimoSeguro = { x:START.x, y:START.y }, encalhado = false;
  function moveBarca(x1, y1, ms, fim){
    const x0 = bx, y0 = by, t0 = performance.now(); ocupado = true; esteira(true); vira(x1 > x0 + 2);
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); poeBarca(x0 + (x1 - x0) * e, y0 + (y1 - y0) * e);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; esteira(false); fim && fim(); } })(t0);
  }
  function pegaBoia(){
    const i = boias; boias++; chip(`Canal: ${boias}/3`); toca('ok');
    const b = boiaG[i]; el(b, '.vc-boia-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:500 });
    brilha(WP[i].x, WP[i].y - 24, 6, '#FFE27A'); respinga(WP[i].x, WP[i].y, 3);
    if (boias === 1) api.diz('Isso! O barqueiro conhece cada curva do rio.');
    if (boias === 2) api.diz('Esses bancos de areia no meio do rio são as coroas.');
    if (boias === 3) { arr = null; api.diz('Quando a beira do rio perde as árvores, a terra cai na água e o rio fica raso.'); depois(300, () => moveBarca(DOCK.x, DOCK.y, 1400, atraca)); }
    marcaBoia();
  }
  function encalha(k){
    if (encalhado) return; encalhado = true; arr = null; toca('glub'); somOn && tom(110, 0, .25, 'sawtooth', .05, 70);
    for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:bx + sorte(-30, 10), y:by + sorte(-2, 4), t:i, cor:'#E8C88A' });
    el(s, `.vc-coroa[data-i="${COROAS.indexOf(k)}"]`).animate([{ transform:'translateX(0)' }, { transform:'translateX(-3px)' }, { transform:'translateX(3px)' }, { transform:'translateX(0)' }], { duration:300 });
    barcaVira.animate([{ transform:barcaVira.getAttribute('transform') ? 'scale(-1,1) rotate(0)' : 'rotate(0)' }, { transform:barcaVira.getAttribute('transform') ? 'scale(-1,1) rotate(-4deg)' : 'rotate(-4deg)' }, { transform:barcaVira.getAttribute('transform') ? 'scale(-1,1) rotate(3deg)' : 'rotate(3deg)' }, { transform:barcaVira.getAttribute('transform') ? 'scale(-1,1)' : 'rotate(0)' }], { duration:500 });
    api.diz('Encalhou na areia! Arraste a barca pela água escura do canal.');
    depois(520, () => moveBarca(ultimoSeguro.x, ultimoSeguro.y, 500, () => { encalhado = false; }));
  }
  barcaG.addEventListener('pointerdown', e => {
    if (fase !== 'navega' || ocupado || arr || encalhado || e.target.closest('[data-fig]')) return; e.stopPropagation();
    const p = c.ponto(e); arr = { tipo:'barca', dx:p.x - bx, dy:p.y - by }; s.setPointerCapture(e.pointerId); toca('clique'); esteira(true);
  });
  function arrastaBarca(p){
    let x = Math.max(196, Math.min(744, p.x - arr.dx)), y = Math.max(212, Math.min(312, p.y - arr.dy));
    if (x > 572 && y > 258) y = 258;
    const passos = Math.ceil(Math.hypot(x - bx, y - by) / 6) || 1, x0 = bx, y0 = by;
    for (let i = 1; i <= passos; i++) {
      const xi = x0 + (x - x0) * i / passos, yi = y0 + (y - y0) * i / passos, k = naCoroa(xi, yi);
      if (k) { encalha(k); return; }
      if (Math.abs(xi - bx) > .5) vira(xi > bx);
      poeBarca(xi, yi);
      if (boias < 3 && Math.hypot(xi - WP[boias].x, yi - WP[boias].y) < 34) { ultimoSeguro = { x:WP[boias].x, y:WP[boias].y }; pegaBoia(); if (!arr) return; }
    }
    if (!naCoroa(bx, by)) { const d = Math.hypot(bx - ultimoSeguro.x, by - ultimoSeguro.y); if (d > 40) ultimoSeguro = { x:bx, y:by }; }
  }
  boiaG.forEach((b, i) => b.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'navega' || ocupado || i !== boias) return;
    moveBarca(WP[i].x, WP[i].y, 1300, () => { ultimoSeguro = { x:WP[i].x, y:WP[i].y }; pegaBoia(); });
  }));
  function atraca(){
    vira(false); toca('splash'); respinga(DOCK.x - 30, DOCK.y + 4, 4); fase = 'porto';
    api.diz('Chegamos à comunidade! Aqui o povo do rio pesca, planta e navega.');
    el(s, '#vc-canal').animate([{ opacity:.22 }, { opacity:.12 }], { duration:1200, fill:'forwards' });
    depois(4200, comecaVazante);
  }
  /* ---------- 2. vazante ---------- */
  const semG = el(s, '#vc-sem'), semSt = arrastavel(semG, () => fase === 'vazante' && faixaAtiva >= 0, CUIA0.x, CUIA0.y, (moveu, x, y) => {
    if (!moveu) { planta2(); return; }
    const r = onde(x, y + 4);
    if (r === faixaAtiva) planta2();
    else { voa(semG, semSt.st, CUIA0.x, CUIA0.y, 500); toca('glub');
      api.diz(r === -1 ? 'Aí a terra já está seca. Arraste para a faixa molhada que brilha!' : r < faixaAtiva ? 'Essa faixa já tem planta. Arraste para a faixa nova que brilha!' : 'Aí ainda é rio! Arraste para a faixa molhada que brilha.'); }
  });
  let faixaAtiva = -1;
  function comecaVazante(){
    fase = 'vazante'; chip('Vazante: 0/4');
    api.diz('Agora vem o tempo da seca, e o rio vai baixando devagar.');
    depois(2600, () => desce(0));
  }
  function desce(k){
    toca('vapor'); el(s, `.vc-capa[data-k="${k}"]`).style.opacity = 0;
    s.querySelectorAll('.vc-margem').forEach((m, i) => m.style.opacity = i === k + 1 ? .85 : 0);
    s.querySelectorAll('.vc-coroa').forEach(g => g.style.transform = `scale(${F(1 + (k + 1) * .07)})`);
    depois(1600, () => {
      faixaAtiva = k; el(s, `.vc-bf[data-k="${k}"]`).style.display = ''; el(s, `.vc-alvo[data-k="${k}"]`).style.display = '';
      el(s, '#vc-sem-icone').innerHTML = sementeIcone(SEM[k]); semG.style.opacity = 1; el(s, '#vc-sem-dica').style.display = '';
      semG.animate([{ transform:`translate(${CUIA0.x}px,${CUIA0.y}px) scale(1)` }, { transform:`translate(${CUIA0.x}px,${CUIA0.y - 8}px) scale(1.15)` }, { transform:`translate(${CUIA0.x}px,${CUIA0.y}px) scale(1)` }], { duration:700 });
      const nome = { feijao:'o feijão', milho:'o milho', abobora:'a abóbora', batata:'a batata-doce' }[SEM[k]];
      api.diz(k === 0 ? `O rio baixou e deixou terra molhada! Arraste ${nome} da cuia para a faixa que brilha.` : `O rio baixou mais! Arraste ${nome} para a nova faixa molhada.`);
    });
  }
  function planta2(){
    const k = faixaAtiva; if (k < 0) return; faixaAtiva = -1;
    el(s, `.vc-bf[data-k="${k}"]`).style.display = 'none'; el(s, `.vc-alvo[data-k="${k}"]`).style.display = 'none'; el(s, '#vc-sem-dica').style.display = 'none';
    const [mx, my] = pt(k + .5, .5);
    voa(semG, semSt.st, mx, my - 30, 600, () => {
      semG.setAttribute('transform', `translate(${CUIA0.x} ${CUIA0.y})`); semSt.st.x = CUIA0.x; semSt.st.y = CUIA0.y; semG.style.opacity = .45;
      el(s, '#vc-braco-vz').animate([{ transform:'rotate(0)' }, { transform:'rotate(-40deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:800 });
      const pls = [...s.querySelectorAll(`.vc-pl[data-k="${k}"] .vc-pl-in`)];
      PLT.forEach((t, j) => { const [x, y] = pt(k + .55, t + PLX[k]); c.add({ tipo:'semente', x, y:y - 46, vy:1, alvoY:y, chega:() => { pls[j].style.transform = 'scale(.5)'; toca('planta'); brilha(x, y - 10, 3, '#C8F0A0'); } }); });
      faixas++; chip(`Vazante: ${faixas}/4`);
      const falas = { feijao:'O feijão cresce rapidinho na terra úmida.', milho:'Milho plantado! Ele cresce alto e forte.', abobora:'A abóbora espalha as folhas largas pelo chão.', batata:'A batata-doce cresce escondida debaixo da terra.' };
      api.diz(falas[SEM[k]]);
      if (k < 3) depois(3000, () => desce(k + 1)); else depois(2600, colheVazante);
    });
  }
  el(s, '#vc-faixa-alvo').addEventListener('click', e => { e.stopPropagation(); if (fase === 'vazante' && !ocupado && faixaAtiva >= 0) planta2(); });
  function colheVazante(){
    s.querySelectorAll('.vc-pl-in').forEach(p => p.style.transform = 'scale(1)'); toca('vitoria');
    depois(1300, () => { s.querySelectorAll('.vc-fruto').forEach(f => f.style.opacity = 1); brilha(330, 340, 12, '#FFE27A'); });
    api.diz('Isso é a vazante: plantar na terra molhada e fofinha que o rio deixa quando baixa.');
    depois(5200, () => { api.diz('Nem precisa regar! A água guardada na terra molhada alimenta as plantas.'); depois(4600, comecaMata); });
  }
  /* ---------- 3. mata ciliar no barranco ---------- */
  const mudaG = el(s, '#vc-muda'), mudaSt = arrastavel(mudaG, () => fase === 'mata', MUDA0.x, MUDA0.y, (moveu, x, y) => {
    if (!moveu) { plantaArv(COVAS.findIndex((_, i) => !feitas[i])); return; }
    let melhor = -1, dm = 60; COVAS.forEach((p, i) => { if (feitas[i]) return; const d = Math.hypot(x - p.x, y - p.y); if (d < dm) { dm = d; melhor = i; } });
    if (melhor >= 0) plantaArv(melhor); else { voa(mudaG, mudaSt.st, MUDA0.x, MUDA0.y, 500); toca('glub'); api.diz('Leve a muda até uma cova no alto do barranco!'); }
  });
  const feitas = [false, false, false, false];
  function comecaMata(){
    fase = 'mata'; chip('Mata ciliar: 0/4');
    api.diz('Olha o barranco! Sem árvores na beira, a terra desmorona e suja o rio.');
    depois(3600, () => {
      mudaG.style.display = ''; s.querySelectorAll('.vc-cova-dica').forEach(d => d.style.display = '');
      el(s, '.vc-mc[data-i="0"]').style.opacity = 0;
      api.diz('Arraste as mudas da canoa até as covas no alto do barranco.');
    });
  }
  function plantaArv(i){
    if (i < 0 || feitas[i] || fase !== 'mata') return; feitas[i] = true;
    const p = COVAS[i];
    el(s, `.vc-cova[data-i="${i}"] .vc-cova-dica`).style.display = 'none';
    voa(mudaG, mudaSt.st, p.x, p.y + 2, 700, () => {
      arvores++; chip(`Mata ciliar: ${arvores}/4`); toca('planta');
      const a = el(s, `.vc-arv[data-i="${i}"] .vc-arv-in`); a.style.transform = 'scale(.3)'; depois(900, () => { a.style.transform = 'scale(1)'; toca('planta'); brilha(p.x, p.y - 60, 6, '#C8F0A0'); });
      depois(600, () => { s.querySelectorAll('.vc-raiz')[i].style.strokeDashoffset = 0; });
      el(s, `.vc-cova[data-i="${i}"]`).style.pointerEvents = 'none';
      el(s, '#vc-turvo').style.opacity = F(.9 - arvores * .2);
      el(s, '#vc-capim-novo').style.opacity = F(arvores / 4);
      el(s, '#vc-braco-ag').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(0)' }], { duration:700 });
      const falas = ['Caraibeira! As raízes dela agarram a terra do barranco.', 'O ingazeiro gosta de beira de rio.', 'O juazeiro fica verdinho mesmo na seca.'];
      if (arvores < 4) {
        api.diz(falas[arvores - 1]);
        mudaSt.st.x = MUDA0.x; mudaSt.st.y = MUDA0.y; mudaG.setAttribute('transform', `translate(${MUDA0.x} ${MUDA0.y})`);
        el(s, `.vc-mc[data-i="${arvores}"]`).style.opacity = 0;
      } else { mudaG.style.display = 'none'; fase = 'limpa'; depois(1800, rioLimpo); }
    });
  }
  s.querySelectorAll('.vc-cova').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); if (fase === 'mata' && !ocupado && !arr) plantaArv(+g.dataset.i); }));
  function rioLimpo(){
    api.diz('Essa é a mata ciliar: ela protege o rio como os cílios protegem os olhos!');
    el(s, '#vc-turvo').style.opacity = 0; toca('vitoria'); brilha(680, 200, 10, '#FFE27A');
    depois(2600, () => {
      el(s, '#vc-peixes').style.opacity = 1; pulos = true; pulaPeixe(0); depois(700, () => pulaPeixe(1));
      el(s, '#vc-surubim-nada').animate([{ transform:'translate(680px,490px)' }, { transform:'translate(560px,484px)' }, { transform:'translate(680px,490px)' }], { duration:9000, iterations:Infinity });
      chegaArara();
      api.diz('A água está ficando limpa e os peixes voltaram: curimatãs e surubins!');
      depois(2600, () => api.diz('E olha: uma ararinha-azul veio pousar na caraibeira nova!'));
      depois(5200, () => { api.diz('Lá nas nascentes, na Serra da Canastra, em Minas Gerais, cuidar das matas também protege o Velho Chico.'); depois(6000, () => { fase = 'final'; chip('Seguir viagem'); el(s, '#vc-barca').style.cursor = 'pointer'; api.diz('Toque na barca para seguir viagem pelo Velho Chico!'); dicaBarca(); }); });
    });
  }
  function chegaArara(){
    const g = el(s, '#vc-ararinha2'), pos = el(s, '#vc-ar2-pos'), asa = el(g, '.vc-asa'); g.style.opacity = 1;
    const bate = asa.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(-.6)' }], { duration:180, iterations:Infinity, direction:'alternate' });
    [1900, 2300, 2100].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .07, 'square', .03, f * .8), 2400 + i * 110));
    const a = pos.animate([{ transform:'translate(-40px,120px)' }, { transform:'translate(200px,70px)' }, { transform:'translate(420px,96px)' }, { transform:'translate(560px,150px)' }, { transform:'translate(612px,186px)' }], { duration:4200, easing:'ease-in-out', fill:'forwards' });
    a.onfinish = () => { bate.cancel(); asa.style.transform = 'scaleY(.35)'; brilha(612, 180, 4, '#7EB4F2'); };
  }
  let pulos = false;
  function pulaPeixe(i){
    if (!vivo || !pulos) return;
    const g = s.querySelectorAll('.vc-pulo')[i % 3], gi = el(g, '.vc-pulo-in');
    gi.animate([{ transform:'translate(-20px,10px) rotate(30deg)', opacity:0 }, { transform:'translate(-10px,-18px) rotate(-10deg)', opacity:1, offset:.3 }, { transform:'translate(6px,-26px) rotate(-30deg)', opacity:1, offset:.55 }, { transform:'translate(20px,8px) rotate(-60deg)', opacity:0 }], { duration:1300, easing:'ease-in-out' });
    const x0 = +g.getAttribute('transform').match(/[\d.]+/g)[0], y0 = +g.getAttribute('transform').match(/[\d.]+/g)[1];
    depois(1150, () => { respinga(x0 + 20, y0 + 6, 3); toca('splash'); });
    depois(sorte(2200, 3600), () => pulaPeixe(i + 1));
  }
  /* ---------- final: pôr do sol e a barca segue viagem ---------- */
  function dicaBarca(){ if (fase !== 'final') return; brilha(bx - 20, by - 40, 4, '#FFE27A'); depois(1600, dicaBarca); }
  barcaG.addEventListener('click', e => {
    if (fase === 'final') { e.stopPropagation(); partir(); return; }
    if (fase !== 'navega' && !e.target.closest('[data-fig]')) { toca('pop'); api.diz('O barqueiro conhece o rio desde menino: cada canal e cada coroa.'); }
  });
  function partir(){
    fase = 'fim'; chip('Boa viagem!'); toca('splash'); respinga(bx, by + 4, 5);
    el(s, '#vc-por-ceu').style.transition = 'opacity 5s'; el(s, '#vc-por-ceu').style.opacity = .9;
    el(s, '#vc-por-agua').style.transition = 'opacity 5s'; el(s, '#vc-por-agua').style.opacity = .34;
    el(s, '#vc-por-tinta').style.transition = 'opacity 5s'; el(s, '#vc-por-tinta').style.opacity = .16;
    el(s, '#vc-reflexo-sol').style.opacity = 1; el(s, '#vc-luzes').style.opacity = 1;
    el(s, '#vc-sol-pos').animate([{ transform:'translate(0,0)' }, { transform:'translate(-200px,118px)' }], { duration:6000, fill:'forwards', easing:'ease-in-out' });
    const rota = [WP[2], WP[1], WP[0], START, { x:880, y:212 }];
    let i = 0; const segue = () => { if (i >= rota.length) return; const w = rota[i++]; moveBarca(w.x, w.y, i === rota.length ? 1800 : 1500, segue); esteira(true); };
    depois(500, segue);
    depois(2400, () => { toca('vitoria'); api.diz('O Velho Chico nasce em Minas Gerais e corre mais de 2.700 quilômetros até o mar. Quem cuida da beira cuida do rio!'); depois(7000, api.fim); });
  }
  /* ---------- arrasto: movimento e soltura ---------- */
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (arr.tipo === 'barca') { arrastaBarca(p); return; }
    if (Math.hypot(p.x - arr.px, p.y - arr.py) > 8) arr.moveu = true;
    arr.st.x = Math.max(10, Math.min(790, p.x - arr.dx)); arr.st.y = Math.max(20, Math.min(490, p.y - arr.dy)); arr.poe(arr.st.x, arr.st.y);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const a = arr; arr = null;
    if (a.tipo === 'barca') { esteira(false); return; }
    a.g.style.cursor = 'grab'; a.solta(a.moveu, a.st.x, a.st.y);
  });
  /* ---------- toques extras ---------- */
  let ceK = 0;
  el(s, '#vc-celeste').addEventListener('click', () => {
    const g = el(s, '#vc-celeste-in'); g.animate([{ transform:'rotate(0)' }, { transform:'rotate(-10deg) translateY(-6px)' }, { transform:'rotate(6deg)' }, { transform:'rotate(0)' }], { duration:700 });
    [2000, 2400].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'square', .03, f * .85), i * 120));
    const falas = ['As ararinhas-azuis fazem ninho no oco das caraibeiras, perto dos riachos.', 'Minha família quase sumiu da natureza. Agora estamos voltando a voar livres na Bahia!', 'Meu bico forte abre sementes duras da caatinga.'];
    api.diz(falas[ceK++ % falas.length]);
  });
  let pesOc = false;
  el(s, '#vc-pescador').addEventListener('click', e => {
    e.stopPropagation(); if (pesOc) return; pesOc = true; toca('clique');
    const t = el(s, '#vc-tarrafa'), r = el(t, '.vc-rede');
    t.style.opacity = 1; r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'center';
    r.animate([{ transform:'scale(.1)', opacity:1 }, { transform:'scale(1)', opacity:1, offset:.5 }, { transform:'scale(1) translateY(10px)', opacity:0 }], { duration:1600, easing:'ease-out' });
    depois(900, () => { toca('splash'); respinga(524, 196, 6); });
    depois(1600, () => { t.style.opacity = 0; pesOc = false; });
    api.diz('O pescador joga a tarrafa, uma rede redonda que se abre no ar e cai na água!');
  });
  el(s, '#vc-fazendas').addEventListener('click', e => { e.stopPropagation(); toca('chuva'); brilha(300, 176, 8, '#E6F6FF'); api.diz('Lá do outro lado, a água do rio irriga plantações de manga e uva no meio do sertão.'); });
  el(s, '#vc-cidade').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Do outro lado do rio fica Petrolina, em Pernambuco. Do lado de cá é a Bahia!'); });
  el(s, '#vc-menina').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#vc-braco-me').animate([{ transform:'rotate(0)' }, { transform:'rotate(-26deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:600, iterations:2 });
    el(s, '#vc-menina').animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:500 });
    api.diz('Oi! Depois da escola eu ajudo minha avó na vazante.'); });
  el(s, '#vc-vazanteira').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#vc-braco-vz').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(0)' }], { duration:700 });
    api.diz(fase === 'vazante' ? 'As sementes estão na minha cuia. Eu guardo as melhores de cada colheita!' : 'Aprendi com meus pais a plantar seguindo o rio: quando ele baixa, a gente planta.'); });
  el(s, '#vc-agente').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#vc-braco-ag').animate([{ transform:'rotate(0)' }, { transform:'rotate(-26deg)' }, { transform:'rotate(0)' }], { duration:600 });
    api.diz('Eu cuido do viveiro da comunidade: mudas de árvores para a beira do rio.'); });
  let cabOc = false;
  el(s, '#vc-cabra').addEventListener('click', e => { e.stopPropagation(); if (cabOc) return; cabOc = true; [[620, .14], [560, .22]].forEach(([f, d], i) => setTimeout(() => somOn && tom(f, 0, d, 'sawtooth', .04, f * .85), i * 180));
    el(s, '#vc-cabra-cab').animate([{ transform:'rotate(0)' }, { transform:'rotate(-14deg)' }, { transform:'rotate(6deg)' }, { transform:'rotate(0)' }], { duration:700 });
    el(s, '#vc-cabra-pos').animate([{ transform:'translate(300px,486px) scale(1.05)' }, { transform:'translate(300px,474px) scale(1.05)' }, { transform:'translate(300px,486px) scale(1.05)' }], { duration:500 });
    depois(800, () => { cabOc = false; }); api.diz('Méé! As cabras vivem bem no sertão e bebem água do rio.'); });
  el(s, '#vc-pote').addEventListener('click', e => { e.stopPropagation(); toca('vapor');
    for (let i = 0; i < 6; i++) c.add({ tipo:'vapor', x0:sorte(8, 40), y0:sorte(338, 356), x1:sorte(0, 50), y1:sorte(300, 316), dur:sorte(50, 80), f:sorte(0, 6), r:sorte(2, 4), x:0, y:0 });
    api.diz('O pote de barro deixa a água fresquinha: um pouquinho dela passa pelo barro e evapora.'); });
  let garOc = false;
  el(s, '#vc-garcas').addEventListener('click', e => { e.stopPropagation(); if (garOc) return; garOc = true; toca('pop');
    s.querySelectorAll('.vc-garca-in').forEach((g, i) => g.animate([{ transform:'translate(0,0)' }, { transform:`translate(${-20 - i * 10}px,-40px)` }, { transform:`translate(${-50 + i * 20}px,-60px)` }, { transform:`translate(${-10 + i * 6}px,-30px)` }, { transform:'translate(0,0)' }], { duration:3200, easing:'ease-in-out' }));
    depois(3300, () => { garOc = false; }); api.diz('As garças descansam nas coroas e pescam no raso.'); });
  el(s, '#vc-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); brilha(690, 64, 6, '#FFE27A'); api.diz('No sertão chove pouco. Boa parte da água do Velho Chico vem das chuvas de Minas Gerais!'); });
  el(s, '#vc-caraibeira').addEventListener('click', e => { e.stopPropagation(); toca('planta'); for (let i = 0; i < 12; i++) c.add({ tipo:'petala', x:sorte(60, 170), y:sorte(180, 230), vy:sorte(.5, 1), f:sorte(0, 6), chao:sorte(300, 330), cor:Math.random() < .5 ? '#FFE04A' : '#F6B21E', borda:'#B07A08' }); api.diz('A caraibeira fica toda amarela de flores na seca.'); });
  /* toque na água: ondinhas e, depois do rio limpo, peixes */
  s.addEventListener('pointerdown', e => {
    if (arr) return; const p = c.ponto(e);
    if (p.y > AY + 6 && e.target.closest && !e.target.closest('.toque')) {
      const r = onde(p.x, p.y); const naAgua = (r >= 4 || r === 9 || (r >= faixas && r >= 0)) && !(p.x > 576 && p.y > 262 && p.y < 420);
      if (naAgua) { respinga(p.x, p.y, 3); toca('glub'); }
    }
  });
  /* terra caindo do barranco sem árvores */
  (function cai(){ if (!vivo) return; if (Math.random() > arvores / 4 && fase !== 'fim') { const x = sorte(594, 712); c.add({ tipo:'semente', x, y:sorte(300, 330), vy:.6, alvoY:sorte(404, 414), chega:() => {} }); } depois(sorte(1600, 2600), cai); })();
  chip('Canal: 0/3'); marcaBoia(); poeBarca(START.x, START.y);
  api.diz('Oi! Eu sou a Celeste, uma ararinha-azul. Este é o Rio São Francisco, o Velho Chico!');
  api.diz('Arraste a barca pelo canal de água escura, de boia em boia, até a comunidade.');
  return () => { vivo = false; pulos = false; timers.forEach(clearTimeout); c.parar(); };
}
