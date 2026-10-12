/* ================= JOGO 15: Terraços de Bali, a água repartida do subak ================= */
function jogoSubak(palco, api){
  semente = 115;
  let vivo = true, fase = 'repartir', ocupado = false, plantadas = 0, linhas = 0, comidos = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const f1 = n => n.toFixed(1);
  /* ---------- terraços: 6 faixas curvas que descem o morro; 3 grupos (alto, meio, baixo) ---------- */
  const TY = [252, 284, 320, 360, 406, 454], TG = [.5, .6, .72, .84, .96, 1.08, 1.2], TW = [7, 8, 10, 11, 13, 14], TX0 = [372, 330, 238, 168, 84, -10];
  const FORMA = x => 13 * Math.sin(x / 105 + .2) + 5 * Math.sin(x / 41 + 1.3) + 2.4 * Math.sin(x / 17 + .6);
  const T = (i, x) => (i < 6 ? TY[i] : 514) + TG[i] * FORMA(x) + (x - 400) * .03;
  const F = (i, x) => T(i + 1, x) - TW[i];
  const MEIO = (i, x, k) => T(i, x) + (F(i, x) - T(i, x)) * (k == null ? .6 : k);
  const XS = i => { const a = []; for (let x = TX0[i] + 8; x < 810; x += 10) a.push(x); a.push(812); return a; };
  const pts = (i, fn, xs, dy) => xs.map(x => `${f1(x)} ${f1(fn(i, x) + (dy || 0))}`).join(' L');
  const faixaD = i => { const xs = XS(i), x0 = xs[0]; return `M${pts(i, T, xs)} L${pts(i, F, xs.slice().reverse())} C${x0 - 14} ${f1(F(i, x0))} ${x0 - 14} ${f1(T(i, x0))} ${x0} ${f1(T(i, x0))}Z`; };
  const paredeD = i => { const xs = XS(i), x0 = xs[0]; return `M${pts(i, F, xs)} L${pts(i + 1, T, xs.slice().reverse(), 1)} Q${x0 - 10} ${f1(T(i + 1, x0) + 1)} ${x0 - 4} ${f1(F(i, x0))}Z`; };
  const bordaD = i => { const xs = XS(i); return `M${xs[0] - 6} ${f1(F(i, xs[0]) - 2)} L${pts(i, F, xs)}`; };
  const GRUPO = [0, 0, 1, 1, 2, 2];          /* faixa -> grupo: 0 alto, 1 meio, 2 baixo */
  const CAI = [612, 0, 520, 0, 404, 0];      /* bica de uma faixa para a de baixo dentro do grupo */
  /* ---------- caixa de repartir (tembuku) ---------- */
  const BX0 = 240, BX1 = 360, BY0 = 214, BY1 = 246, PASSO = (BX1 - BX0) / 6;
  const SAI = [272, 300, 328];               /* saídas da rampa: baixo, meio, alto */
  const JUSTO = [2, 4];
  let tab = [1, 2];                          /* posição das tábuas em sextos */
  const parte = () => [tab[0] / 6, (tab[1] - tab[0]) / 6, (6 - tab[1]) / 6];   /* [baixo, meio, alto] */
  const CANAL = [
    'M272 266 C240 300 140 340 92 410',     /* baixo */
    'M300 266 C296 286 262 300 246 326',    /* meio */
    'M328 266 Q346 262 378 260'             /* alto */
  ];
  /* ---------- obstáculos (não plantar atrás deles) ---------- */
  const AGRI = [
    { x:648, f:0, s:.74, pele:'#9A6440', camisa:'#2E7BB6', ce:'#12456E', calca:'#2A2E3E', vira:-1, sarong:false, item:'enxada', lenco:'#FFC83D' },
    { x:458, f:2, s:.9, pele:'#7A4A2C', camisa:'#E8B23A', ce:'#8A5E10', calca:'#3E2A1E', vira:1, sarong:true, pano:'#B8324A', item:'cesto' },
    { x:262, f:4, s:1.06, pele:'#B07A52', camisa:'#E5603C', ce:'#8E2E14', calca:'#24304A', vira:1, sarong:false, item:'bandeira', lenco:'#2E9A8A' }
  ];
  const GARCA = { x:676, f:3 }, SAPO = { x:560, f:4 }, ESPANTA = { x:548, f:1 };
  const livre = (i, x) => !AGRI.some(a => a.f === i && Math.abs(a.x - x) < 26) && !(GARCA.f === i && Math.abs(GARCA.x - x) < 20) && !(ESPANTA.f === i && Math.abs(ESPANTA.x - x) < 18) && !(i === 5 && x > 660) && !(i === 5 && x < 130);
  const SLOTS = [0, 1, 2, 3, 4, 5].map(i => { const a = []; for (let x = Math.max(TX0[i] + 24, 16); x < 784; x += 31) if (livre(i, x)) a.push({ x, y:MEIO(i, x), ok:false }); return a; });
  const ESC = [.5, .58, .68, .78, .9, 1.02];
  /* ---------- caramujos ---------- */
  const CARAM = [[520, 0], [430, 1], [610, 2], [330, 3], [560, 3], [200, 4], [470, 4], [360, 5]].map(([x, i]) => ({ x, y:MEIO(i, x, .7), i, foi:false }));
  /* ---------- desenhos ---------- */
  const muda = (s) => `<g class="su-m"><path d="M0 0 q-3 -5 -6 -8 M0 0 q-1 -6 -1 -11 M0 0 q2 -6 5 -9 M0 0 q4 -3 7 -5" stroke="#2E7A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M0 0 q-3 -5 -6 -8 M0 0 q-1 -6 -1 -11 M0 0 q2 -6 5 -9" stroke="#9AE04A" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
  const pe = () => { const fol = 'M0 0 Q-8 -12 -14 -20 M0 0 Q-3 -16 -5 -28 M0 0 Q2 -18 3 -30 M0 0 Q6 -14 12 -22 M0 0 Q9 -8 16 -12';
    return `<g class="su-g" style="opacity:0;transform:scale(.4);transition:transform 2.2s ease-out, opacity .8s"><path d="${fol}" stroke="#2E6A1A" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="${fol}" stroke="#6CC23A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M0 0 Q-2 -14 -4 -24" stroke="#C8F07A" stroke-width=".9" fill="none" stroke-linecap="round"/></g>
    <g class="su-r" style="opacity:0;transition:opacity 1.6s"><path d="${fol}" stroke="#8A6A1A" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="${fol}" stroke="#E2C04A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-3 -26 Q-8 -32 -14 -26 M3 -28 Q10 -33 15 -24" stroke="#A8862A" stroke-width="1.4" fill="none"/><g fill="#F6CC3E" stroke="#A8761A" stroke-width=".6">${[[-6, -30], [-10, -29], [-13, -26.5], [6, -31], [10, -30], [13.5, -27], [-8, -31.6], [8, -32.4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.3" transform="rotate(${x < 0 ? -30 : 30} ${x} ${y})"/>`).join('')}</g></g>
    <g class="su-t" style="opacity:0;transition:opacity 1.2s"><path d="M-3 0 l-1 -5 M0 0 v-6 M3 0 l1 -5 M-1.6 0 l-.4 -4 M1.6 0 l.4 -4" stroke="#9A7A3A" stroke-width="1.8" stroke-linecap="round"/><path d="M0 0 v-6 M3 0 l1 -5" stroke="#E2C88A" stroke-width=".7" stroke-linecap="round"/></g>`; };
  const planta = (sl, i, k) => `<g class="su-pl" data-f="${i}" data-k="${k}" transform="translate(${f1(sl.x)} ${f1(sl.y)}) scale(${ESC[i]})"><g class="su-pl-in" style="transform:scale(0);transition:transform .5s cubic-bezier(.3,1.6,.5,1)"><ellipse cx="0" cy="0" rx="7" ry="1.6" fill="#1E5A7A" opacity=".25"/>${muda()}${pe()}</g></g>`;
  const agricultor = (a, k) => { const sk = a.pele, esc = '#3E2214';
    const pernas = a.sarong ? `<path d="M-3.6 -3 v-4 M3.6 -3 v-4" stroke="${sk}" stroke-width="3.8" stroke-linecap="round"/><path d="M-10 -32 C-11.4 -22 -11.6 -13 -10.4 -6 H10.4 C11.6 -13 11.4 -22 10 -32Z" fill="${a.pano}" stroke="#6E1424" stroke-width="1.2"/><path d="M-10.6 -24 H10.8 M-11.2 -10 H11.2" stroke="#FFD8A0" stroke-width="1.4" opacity=".85"/><g fill="none" stroke="#FFD8A0" stroke-width=".9" opacity=".9"><path d="M-9 -17 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3"/></g><path d="M3 -32 L5 -6" stroke="#6E1424" stroke-width=".9" opacity=".6"/><path d="M-12 -32 H12 V-29 H-12Z" fill="#FFC83D" stroke="#9A6A0E" stroke-width=".8"/>`
      : `<path d="M-4.6 -31 L-5.2 -7 M4.6 -31 L5.2 -7" stroke="${a.calca}" stroke-width="7.4" stroke-linecap="round"/><path d="M-5.2 -10.4 v-1 M5.2 -10.4 v-1" stroke="#7A86A8" stroke-width="8" stroke-linecap="round" opacity=".55"/><path d="M-5.2 -6 v-2 M5.2 -6 v-2" stroke="${sk}" stroke-width="4" stroke-linecap="round"/><path d="M0 -31 V-22" stroke="#12121A" stroke-width=".8" opacity=".4"/>`;
    const item = a.item === 'enxada' ? `<path d="M-13 -26 L-17 -66" stroke="#6E4422" stroke-width="2.6" stroke-linecap="round"/><path d="M-13 -26 L-17 -66" stroke="#C8925A" stroke-width="1" stroke-linecap="round"/><path d="M-19.6 -66 L-9.6 -67.6 L-9 -61 L-18 -59.8Z" fill="#9AA4B4" stroke="#4E5668" stroke-width="1"/>`
      : a.item === 'cesto' ? `<g transform="translate(-15 -27)"><path d="M-8 -6 C-8 4 8 4 8 -6Z" fill="#D8A860" stroke="#7A5222" stroke-width="1.1"/><path d="M-8 -6 C-4 -9 4 -9 8 -6" stroke="#7A5222" stroke-width="1.6" fill="none"/><path d="M-6 -3 h12 M-5 0 h10 M-4 -6 v8 M0 -6 v9 M4 -6 v8" stroke="#A8783A" stroke-width=".7"/><path d="M-4 -8 q-1 -5 2 -6 M2 -8 q2 -5 4 -4" stroke="#6CC23A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`
      : `<path d="M-13 -26 L-17 -104" stroke="#8A7A3A" stroke-width="2.2" stroke-linecap="round"/><path d="M-13 -26 L-17 -104 M-13.4 -40 h1.6 M-14 -56 h1.6 M-14.6 -70 h1.6 M-15.6 -88 h1.6" stroke="#D8C878" stroke-width=".9"/><g class="balanca" style="transform-origin:-17px -104px"><path d="M-17 -104 C-8 -106 -2 -102 4 -104 C0 -100 0 -96 4 -92 C-2 -90 -8 -94 -17 -92Z" fill="#FFFFFF" stroke="#8A8A9A" stroke-width="1"/></g>`;
    return `<g id="su-agri-${k}" class="su-agri toque" transform="translate(${a.x} ${f1(F(a.f, a.x) + 2)}) scale(${a.s * a.vira} ${a.s})">
      <ellipse cx="0" cy="-1" rx="17" ry="3.4" fill="#1E3A2A" opacity=".3"/>
      ${pernas}
      <path d="M-9 -4 h6.4 M2.6 -4 h6.4" stroke="${esc}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M-12 -30 C-13.6 -42 -11 -51 0 -52 C11 -51 13.6 -42 12 -30Z" fill="${a.camisa}" stroke="${a.ce}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M-4 -51 L0 -45 L4 -51" fill="#FFF6E6" stroke="${a.ce}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M0 -45 V-31" stroke="${a.ce}" stroke-width=".9" opacity=".7"/><g fill="#FFF6E6" stroke="${a.ce}" stroke-width=".5"><circle cx="0" cy="-41" r=".9"/><circle cx="0" cy="-36" r=".9"/></g>
      <path d="M4 -42 h5 v4 h-5Z" fill="none" stroke="${a.ce}" stroke-width=".9" opacity=".8"/>
      <path d="M-7 -48 q-3 7 -2 15" stroke="#fff" stroke-width="1.8" fill="none" opacity=".3" stroke-linecap="round"/>
      ${a.lenco ? `<path d="M-6 -51 C-3 -47 3 -47 6 -51 L5 -53 C2 -50 -2 -50 -5 -53Z" fill="${a.lenco}" stroke="#12235A" stroke-width=".7"/><path d="M4 -49 l2 7 l2 -1 l-2 -6" fill="${a.lenco}" stroke="#12235A" stroke-width=".6"/>` : ''}
      ${item}
      <path d="M-10.4 -48 C-14.4 -42 -14.6 -35 -13.4 -28" stroke="${a.camisa}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-10.4 -48 C-14.4 -42 -14.6 -35 -13.4 -28" stroke="${a.ce}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".22"/><path d="M-14.6 -36 h3" stroke="${a.ce}" stroke-width="2" stroke-linecap="round" opacity=".6"/><circle cx="-13.2" cy="-26.4" r="2.8" fill="${sk}" stroke="${esc}" stroke-width=".7"/>
      <g class="su-braco" style="transform-origin:10px -48px"><path d="M10.4 -48 C14.4 -42 14.6 -35 13.4 -28" stroke="${a.camisa}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M12.6 -36 h3" stroke="${a.ce}" stroke-width="2" stroke-linecap="round" opacity=".6"/><circle cx="13.2" cy="-26.4" r="2.8" fill="${sk}" stroke="${esc}" stroke-width=".7"/></g>
      <path d="M-2.6 -52 v-4 h5.2 v4" fill="${sk}" stroke="${esc}" stroke-width=".7"/>
      <ellipse cx="-8.4" cy="-60" rx="1.9" ry="2.6" fill="${sk}" stroke="${esc}" stroke-width=".7"/><ellipse cx="8.4" cy="-60" rx="1.9" ry="2.6" fill="${sk}" stroke="${esc}" stroke-width=".7"/>
      <ellipse cx="0" cy="-60" rx="8.2" ry="8.8" fill="${sk}" stroke="${esc}" stroke-width="1.1"/>
      <path d="M-8 -62 C-7.6 -68 7.6 -68 8 -62 C5 -65 -5 -65 -8 -62Z" fill="#1E140E"/>
      <path d="M-4.6 -63.4 q1.6 -1 3 0 M1.6 -63.4 q1.6 -1 3 0" stroke="#1E140E" stroke-width=".9" fill="none" stroke-linecap="round"/>
      <ellipse cx="-3" cy="-60.4" rx="1.3" ry="1.7" fill="#1A120C"/><ellipse cx="3" cy="-60.4" rx="1.3" ry="1.7" fill="#1A120C"/><circle cx="-2.6" cy="-61" r=".5" fill="#fff"/><circle cx="3.4" cy="-61" r=".5" fill="#fff"/>
      <path d="M0 -59.6 q.8 1.6 -.4 2" stroke="${esc}" stroke-width=".7" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M-3 -55.6 q3 2.6 6 0" stroke="#7A2A14" stroke-width="1.1" fill="#FFF4EE" stroke-linecap="round"/>
      <ellipse cx="-5" cy="-57" rx="1.8" ry="1.1" fill="#E2786A" opacity=".45"/><ellipse cx="5" cy="-57" rx="1.8" ry="1.1" fill="#E2786A" opacity=".45"/>
      <ellipse cx="0" cy="-65.6" rx="17" ry="3" fill="#2A1A0A" opacity=".22"/>
      <path d="M-8 -64 C-8 -58 -7 -54 -6 -52 M8 -64 C8 -58 7 -54 6 -52" stroke="#6E4A1E" stroke-width=".6" fill="none" opacity=".7"/>
      <path d="M-22 -66.6 L0 -82 L22 -66.6 Q0 -62.8 -22 -66.6Z" fill="url(#suPalha)" stroke="#8A6424" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M0 -82 L-15 -67 M0 -82 L-7.6 -65 M0 -82 L0 -64.4 M0 -82 L7.6 -65 M0 -82 L15 -67" stroke="#B88E3E" stroke-width=".7" opacity=".8"/>
      <path d="M-16.4 -68.8 Q0 -66.2 16.4 -68.8 M-10 -73.4 Q0 -71.6 10 -73.4 M-4.6 -77.6 Q0 -76.6 4.6 -77.6" stroke="#A87E2E" stroke-width=".7" fill="none" opacity=".75"/>
      <path d="M-2.4 -79.6 L-12.4 -70" stroke="#FFF4C8" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
      <path d="M-22 -66.6 Q0 -62.8 22 -66.6" stroke="#6E4A14" stroke-width="1.2" fill="none"/>
      <rect x="-24" y="-86" width="48" height="86" fill="transparent"/></g>`; };
  const crianca = (x, y, s, pele, roupa, cabelo, braco) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="8" ry="2" fill="#1E3A2A" opacity=".3"/><path d="M-3 -1 v-9 M3 -1 v-9" stroke="#2E3A6A" stroke-width="3.6" stroke-linecap="round"/><path d="M-7 -10 C-7 -21 7 -21 7 -10Z" fill="${roupa}" stroke="#12235A" stroke-width="1.1"/><path d="M-6 -17 l-4 5" stroke="${pele}" stroke-width="2.8" stroke-linecap="round"/>${braco ? `<path d="M6 -17 l6 -8" stroke="${pele}" stroke-width="2.8" stroke-linecap="round"/>` : `<path d="M6 -17 l4 5" stroke="${pele}" stroke-width="2.8" stroke-linecap="round"/>`}<circle cx="0" cy="-25" r="5.6" fill="${pele}" stroke="#3E2214" stroke-width="1"/><path d="M-5.6 -26 C-5.6 -32.4 5.6 -32.4 5.6 -26 C3.6 -29 -3 -29.4 -5.6 -26Z" fill="${cabelo}"/><circle cx="-2" cy="-25" r=".9" fill="#12121A"/><circle cx="2" cy="-25" r=".9" fill="#12121A"/><path d="M-1.8 -22.2 q1.8 1.4 3.6 0" stroke="#7A2A10" stroke-width=".9" fill="none"/></g>`;
  const patoJogo = (cor, esc) => `<ellipse cx="0" cy="0" rx="9" ry="2.2" fill="#1E3A4A" opacity=".3"/><path d="M-2.6 0 v-3 M2.6 0 v-3" stroke="#E0782A" stroke-width="1.6" stroke-linecap="round"/><path d="M-5 -1 h4 M1 -1 h4" stroke="#E0782A" stroke-width="1.8" stroke-linecap="round"/><path d="M-6 -6 C-9 -5 -10 -3 -11 -1 C-8 -2 -6 -3 -5 -4Z" fill="${cor}" stroke="${esc}" stroke-width=".9"/><path d="M-1.6 -26 C-1.6 -20 -6.6 -14 -6.6 -8 C-6.6 -3 -3 -1.4 0 -1.4 C4 -1.4 6.4 -4 6 -9 C5.6 -15 3.4 -20 3.4 -26Z" fill="${cor}" stroke="${esc}" stroke-width="1.1"/><path d="M2 -24 C3.6 -18 5 -14 5 -9 C5 -5 3 -3 1 -3 C2 -8 2 -16 1 -22Z" fill="#FFFDF6" opacity=".9"/><path d="M-5.6 -12 C-3 -14 0 -12 0 -8 C0 -5 -2 -3 -4.6 -3.6 C-6 -6 -6 -9 -5.6 -12Z" fill="${esc}" opacity=".35"/><ellipse cx=".8" cy="-28" rx="4.4" ry="3.8" fill="${cor}" stroke="${esc}" stroke-width="1.1"/><path d="M4.6 -29 C7 -29.4 9.6 -29 10.6 -28 C10 -26.6 7.6 -26.4 4.8 -26.8Z" fill="#D6CE5A" stroke="#6A6A24" stroke-width=".7"/><circle cx="2" cy="-29" r="1.1" fill="#1A120C"/><circle cx="2.4" cy="-29.4" r=".4" fill="#fff"/>`;
  const garca = () => `<ellipse cx="0" cy="0" rx="14" ry="2.6" fill="#1E5A7A" opacity=".3"/><path d="M-2 0 L-1 -18 M3 0 L2 -18" stroke="#2A2A34" stroke-width="1.8" stroke-linecap="round"/><path d="M-12 -24 C-14 -30 -6 -36 4 -34 C12 -32 14 -26 10 -21 C4 -16 -8 -17 -12 -24Z" fill="url(#suGarca)" stroke="#7A88A4" stroke-width="1.3"/><path d="M-12 -24 C-18 -22 -22 -20 -24 -17 C-18 -18 -14 -20 -10 -21Z" fill="#E6ECF4" stroke="#7A88A4" stroke-width="1"/><path d="M6 -33 C10 -38 6 -44 8 -50 C9 -54 13 -55 15 -53" stroke="#7A88A4" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M6 -33 C10 -38 6 -44 8 -50 C9 -54 13 -55 15 -53" stroke="#FFFFFF" stroke-width="3.6" fill="none" stroke-linecap="round"/><ellipse cx="13.6" cy="-54" rx="4.4" ry="3.6" fill="#fff" stroke="#7A88A4" stroke-width="1.1"/><path d="M17 -55 L28 -52.6 L17 -52Z" fill="#F2C23A" stroke="#A8761A" stroke-width=".7" stroke-linejoin="round"/><circle cx="14.6" cy="-55" r="1.2" fill="#1A1A22"/><circle cx="15" cy="-55.4" r=".4" fill="#fff"/><path d="M-6 -30 q8 -4 14 -2" stroke="#fff" stroke-width="1.6" fill="none" opacity=".9"/>`;
  const sapo = () => `<ellipse cx="0" cy="0" rx="9" ry="2" fill="#1E3A2A" opacity=".3"/><path d="M-8 -1 C-10 -6 -6 -10 0 -10 C6 -10 10 -6 8 -1Z" fill="url(#suSapo)" stroke="#1E5A1E" stroke-width="1.1"/><path d="M-8 -1 q-4 1 -6 -1 M8 -1 q4 1 6 -1" stroke="#1E5A1E" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="-3.6" cy="-10" r="2.8" fill="#8AD05A" stroke="#1E5A1E" stroke-width=".9"/><circle cx="3.6" cy="-10" r="2.8" fill="#8AD05A" stroke="#1E5A1E" stroke-width=".9"/><circle cx="-3.4" cy="-10.2" r="1.5" fill="#12121A"/><circle cx="3.8" cy="-10.2" r="1.5" fill="#12121A"/><circle cx="-2.9" cy="-10.8" r=".5" fill="#fff"/><circle cx="4.3" cy="-10.8" r=".5" fill="#fff"/><path d="M-3 -5 q3 2 6 0" stroke="#1E5A1E" stroke-width=".9" fill="none"/><path d="M-5 -8 q3 -2 6 -1" stroke="#D6F6A0" stroke-width="1" fill="none" opacity=".8"/>`;
  const caramujo = (c, k) => `<g class="su-car toque" data-i="${k}" transform="translate(${f1(c.x)} ${f1(c.y)}) scale(${(ESC[c.i] * 1.1).toFixed(2)})" style="display:none"><g class="su-car-in"><ellipse cx="0" cy="0" rx="9" ry="2" fill="#2A1A0A" opacity=".3"/><path d="M-9 0 C-9 -3 -4 -4 2 -3.4 C6 -3 9 -2 10 0Z" fill="#D8C48A" stroke="#7A6230" stroke-width=".9"/><path d="M7 -2 l3 -5 M8.6 -1.6 l4 -4" stroke="#7A6230" stroke-width=".9" stroke-linecap="round"/><circle cx="10" cy="-7" r=".9" fill="#3A2A14"/><circle cx="12.6" cy="-5.6" r=".9" fill="#3A2A14"/><circle cx="-1" cy="-7" r="6.6" fill="url(#suConcha)" stroke="#7A3A2A" stroke-width="1.1"/><path d="M-1 -7 m-4 0 a4 4 0 1 1 4 4 a2.6 2.6 0 1 1 -2.4 -2.8" stroke="#7A3A2A" stroke-width=".9" fill="none"/><path d="M-5 -10 q2 -2 5 -2" stroke="#FFE6D6" stroke-width="1" fill="none" opacity=".8"/></g><circle cx="0" cy="-5" r="18" fill="transparent"/></g>`;
  const coqueiro = (x, y, h, inc, s) => { const tx = x + inc, ty = y - h;
    const fr = [[-1, -.3, 1], [-.8, .5, .9], [-.4, -.95, .85], [.3, -1, .8], [.85, -.4, 1], [1, .45, .95], [.1, .9, .7]].map(([dx, dy, L]) => { const ex = tx + dx * 46 * s * L, ey = ty + dy * 26 * s * L + 10 * s * Math.abs(dx); const mx = tx + dx * 22 * s * L, my = ty + dy * 18 * s * L - 10 * s;
      let fol = ''; for (let k = 1; k < 9; k++) { const t = k / 9, u = 1 - t, px = u * u * tx + 2 * u * t * mx + t * t * ex, py = u * u * ty + 2 * u * t * my + t * t * ey; fol += `M${f1(px)} ${f1(py)} l${f1(-dy * 9 * s * (1 - t * .5) + dx * 3)} ${f1(dx * 9 * s * (1 - t * .5) + 6 * s)} M${f1(px)} ${f1(py)} l${f1(dy * 9 * s * (1 - t * .5) + dx * 3)} ${f1(-dx * 9 * s * (1 - t * .5) + 6 * s)} `; }
      return `<path d="${fol}" stroke="#2E6A22" stroke-width="${f1(3.4 * s)}" stroke-linecap="round" fill="none"/><path d="${fol}" stroke="#5EB040" stroke-width="${f1(1.8 * s)}" stroke-linecap="round" fill="none"/><path d="M${tx} ${ty} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="#3E7A22" stroke-width="${f1(1.6 * s)}" fill="none"/>`; }).join('');
    const anel = Array.from({ length:Math.floor(h / 9) }, (_, k) => { const t = k / Math.floor(h / 9), xx = x + inc * t * t, yy = y - h * t; return `M${f1(xx - 3.4 * s)} ${f1(yy)} q${f1(3.4 * s)} 2 ${f1(6.8 * s)} 0`; }).join(' ');
    return `<g><path d="M${x} ${y} Q${x + inc * .1} ${f1(y - h * .5)} ${tx} ${ty}" stroke="#4E3420" stroke-width="${f1(8 * s)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${x + inc * .1} ${f1(y - h * .5)} ${tx} ${ty}" stroke="url(#suTronco)" stroke-width="${f1(5.6 * s)}" fill="none" stroke-linecap="round"/><path d="${anel}" stroke="#5E4028" stroke-width="${f1(1 * s)}" fill="none" opacity=".6"/>${fr}<g fill="#8A5A2A" stroke="#4E3014" stroke-width=".6"><circle cx="${tx - 3 * s}" cy="${ty + 4 * s}" r="${f1(3.2 * s)}"/><circle cx="${tx + 3 * s}" cy="${ty + 4.6 * s}" r="${f1(3.2 * s)}"/><circle cx="${tx}" cy="${ty + 7 * s}" r="${f1(3 * s)}"/></g></g>`; };
  const bananeira = (x, y, s) => { const fol = [[-1, -.6], [-.5, -1.1], [.4, -1.1], [1, -.5], [.9, .1]].map(([dx, dy], k) => { const ex = x + dx * 34 * s, ey = y - 46 * s + dy * 22 * s, mx = x + dx * 14 * s, my = y - 56 * s;
    return `<path d="M${x} ${f1(y - 40 * s)} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)} Q${f1(mx + dy * 8 * s)} ${f1(my + 18 * s)} ${x} ${f1(y - 38 * s)}Z" fill="${k % 2 ? 'url(#suBanana2)' : 'url(#suBanana)'}" stroke="#2E6A1E" stroke-width="1.1" stroke-linejoin="round"/><path d="M${x} ${f1(y - 40 * s)} Q${f1(mx)} ${f1(my + 4 * s)} ${f1(ex)} ${f1(ey)}" stroke="#E6F6B0" stroke-width=".8" fill="none" opacity=".7"/>`; }).join('');
    return `<g class="balanca" style="transform-origin:${x}px ${y}px;animation-duration:${R(4, 6).toFixed(1)}s"><path d="M${x - 3 * s} ${y} C${x - 3 * s} ${y - 20 * s} ${x - 2 * s} ${y - 34 * s} ${x} ${y - 42 * s} L${x + 3 * s} ${y - 40 * s} C${x + 4 * s} ${y - 30 * s} ${x + 4 * s} ${y - 16 * s} ${x + 4 * s} ${y}Z" fill="#7AA03A" stroke="#3E6A1E" stroke-width="1"/>${fol}</g>`; };
  const arvore = (x, y, rx, ry, c0, c1, luz, tronco) => `<g>${tronco ? `<path d="M${x} ${y + ry * .6} V${f1(y + ry + 18)}" stroke="#4E3420" stroke-width="5" stroke-linecap="round"/>` : ''}<path d="${copa(x, y, rx, ry, 9, .26)}" fill="${c0}" stroke="${c1}" stroke-width="1.4"/><path d="${copa(x - rx * .25, y - ry * .3, rx * .55, ry * .45, 7, .3)}" fill="${luz}" opacity=".55"/><g fill="${luz}" opacity=".5">${Array.from({ length:4 }, () => `<circle cx="${f1(x + R(-rx * .6, rx * .5))}" cy="${f1(y + R(-ry * .6, ry * .2))}" r="${f1(R(1.4, 3))}"/>`).join('')}</g></g>`;
  const samambaia = (x, y, s) => `<g>${[-60, -25, 5, 35, 70].map(a => { const r = a * Math.PI / 180, ex = x + Math.sin(r) * 30 * s, ey = y - 20 * s - Math.cos(r) * 18 * s; let f = ''; for (let k = 1; k < 7; k++) { const t = k / 7, px = x + (ex - x) * t, py = y - 26 * s * Math.sin(t * 2.6) * .7 + (ey - y) * t; f += `M${f1(px)} ${f1(py)} l${f1(-3 * s)} ${f1(-4 * s * (1 - t))} M${f1(px)} ${f1(py)} l${f1(3 * s)} ${f1(-4 * s * (1 - t))} `; } return `<path d="M${x} ${y - 30 * s} Q${f1((x + ex) / 2)} ${f1(y - 40 * s)} ${f1(ex)} ${f1(ey)}" stroke="#2E6A3A" stroke-width="1.4" fill="none"/>`; }).join('')}${[-60, -25, 5, 35, 70].map(a => { const r = a * Math.PI / 180, ex = x + Math.sin(r) * 30 * s, ey = y - 20 * s - Math.cos(r) * 18 * s; return `<path d="M${x} ${y - 30 * s} Q${f1((x + ex) / 2)} ${f1(y - 40 * s)} ${f1(ex)} ${f1(ey)}" stroke="#6ABA5A" stroke-width="${f1(4.4 * s)}" fill="none" stroke-dasharray="${f1(2 * s)} ${f1(1.4 * s)}" opacity=".95"/>`; }).join('')}<path d="M${x} ${y} V${y - 30 * s}" stroke="#5E3E22" stroke-width="${f1(4 * s)}" stroke-linecap="round"/></g>`;
  const sentado = (x, y, s, pele, camisa, calca, vira, cabelo) => `<g transform="translate(${x} ${y}) scale(${s * vira} ${s})"><path d="M0 -1 H10 L11 9" stroke="${calca}" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 10 h4" stroke="${pele}" stroke-width="2.6" stroke-linecap="round"/><path d="M-5 0 C-6 -8 -5 -16 0 -17 C5 -16 6 -8 5 0Z" fill="${camisa}" stroke="#12235A" stroke-width="1"/><path d="M3 -13 C7 -10 9 -6 9 -2" stroke="${camisa}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="9.4" cy="-1.4" r="2" fill="${pele}" stroke="#3E2214" stroke-width=".6"/><circle cx="0" cy="-22" r="5.4" fill="${pele}" stroke="#3E2214" stroke-width="1"/><path d="M-5.4 -22.6 C-5.6 -28 4 -29.4 5.4 -24 C2 -26 -2 -25.4 -3.6 -21Z" fill="${cabelo || '#1E140E'}"/><circle cx="2.4" cy="-22.4" r=".85" fill="#12121A"/><path d="M1.6 -19.4 q1.6 1 3 -.2" stroke="#3E2214" stroke-width=".8" fill="none" stroke-linecap="round"/><ellipse cx="3.6" cy="-20.6" rx="1.3" ry=".8" fill="#E2786A" opacity=".45"/></g>`;
  const bale = (x, y) => { const pal = Array.from({ length:30 }, (_, k) => { const t = k / 29, xa = x - 58 + 116 * t, xb = x - 36 + 72 * t; return `M${f1(xa)} ${y - 46} L${f1(xb)} ${y - 70}`; }).join('');
    return `<g id="su-bale" class="toque"><ellipse cx="${x}" cy="${y + 16}" rx="64" ry="7" fill="#1E3A1A" opacity=".25"/>
    <g stroke="#5E3A1A" stroke-width="4.4" stroke-linecap="round"><path d="M${x - 46} ${y - 46} V${y + 14} M${x + 46} ${y - 46} V${y + 14}"/></g><g stroke="#A8743E" stroke-width="2" stroke-linecap="round"><path d="M${x - 46} ${y - 46} V${y + 14} M${x + 46} ${y - 46} V${y + 14}"/></g>
    <path d="M${x - 54} ${y} H${x + 54} V${y + 7} H${x - 54}Z" fill="url(#suMadeira)" stroke="#4E2A10" stroke-width="1.3"/><path d="M${x - 52} ${y + 1.6} H${x + 52}" stroke="#F2C890" stroke-width="1" opacity=".6"/>
    ${sentado(x - 22, y, 1, '#8A5A3A', '#3FA864', '#2A2E3E', 1)}${sentado(x + 22, y, 1, '#A86E48', '#E5603C', '#24304A', -1, '#2A1A10')}${sentado(x + 2, y + 1, .9, '#6E4228', '#2E7BB6', '#3E2A1E', 1)}
    <path d="M${x - 2} ${y - 2} h6 v-3 h-6Z" fill="#E6DCC8" stroke="#6E5A3A" stroke-width=".7"/>
    <path d="M${x - 62} ${y - 44} L${x + 62} ${y - 44} L${x + 38} ${y - 72} L${x - 38} ${y - 72}Z" fill="url(#suPalha)" stroke="#7A5A22" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="${pal}" stroke="#A8823A" stroke-width=".8" opacity=".7"/>
    <path d="M${x - 62} ${y - 44} ${Array.from({ length:31 }, (_, k) => `L${f1(x - 62 + k * 4.13)} ${y - 41 + (k % 2) * 2.4}`).join(' ')} L${x + 62} ${y - 44}Z" fill="#C8A050" stroke="#7A5A22" stroke-width=".8"/>
    <path d="M${x - 40} ${y - 72} H${x + 40}" stroke="#6E4A1A" stroke-width="3.4" stroke-linecap="round"/><path d="M${x - 30} ${y - 66} L${x - 50} ${y - 48}" stroke="#FFF2C8" stroke-width="1.6" opacity=".6" stroke-linecap="round"/>
    <rect x="${x - 64}" y="${y - 74}" width="128" height="92" fill="transparent"/></g>`; };
  const moto = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="1" rx="18" ry="2.6" fill="#1E3A1A" opacity=".3"/><circle cx="-11" cy="-5" r="5.4" fill="#2A2A34"/><circle cx="11" cy="-5" r="5.4" fill="#2A2A34"/><circle cx="-11" cy="-5" r="2.2" fill="#B8BCC8"/><circle cx="11" cy="-5" r="2.2" fill="#B8BCC8"/><path d="M-15 -8 C-14 -14 -6 -14 -2 -12 L6 -12 C9 -16 13 -16 16 -10 L15 -6 L-4 -6 C-8 -10 -12 -9 -15 -8Z" fill="#E5392C" stroke="#7A1410" stroke-width="1" stroke-linejoin="round"/><path d="M-12 -16 L-15 -26 M-18 -26 h6" stroke="#2A2A34" stroke-width="1.8" stroke-linecap="round"/><path d="M2 -15 h10 q2 0 2 2 h-13Z" fill="#2A2A34"/><path d="M-12 -12 q4 -2 8 -1" stroke="#FFB0A0" stroke-width="1" fill="none"/><circle cx="-16" cy="-12" r="1.6" fill="#FFF2B0" stroke="#7A1410" stroke-width=".5"/></g>`;
  const inhame = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C-2 -16 -2 -28 0 -40" stroke="#4E8A2A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 -40 C-24 -40 -34 -62 -20 -78 C-14 -84 -6 -80 -2 -72 C2 -82 12 -86 18 -78 C30 -62 22 -42 0 -40Z" fill="url(#suInhame)" stroke="#1E5A1E" stroke-width="1.6" stroke-linejoin="round"/><path d="M0 -40 L-2 -72 M-1 -50 L-16 -64 M-1 -58 L-14 -74 M0 -50 L14 -64 M0 -58 L12 -74" stroke="#B8E890" stroke-width="1.2" fill="none" opacity=".75"/><path d="M-18 -70 q4 -8 10 -8" stroke="#E6FFC8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
  const espantalho = () => { const tubos = [-14, -6, 2, 10].map((x, k) => `<g class="su-tubo" style="transform-origin:${x}px -58px"><path d="M${x} -58 v6" stroke="#5E4A2A" stroke-width=".8"/><rect x="${x - 2.4}" y="-52" width="4.8" height="${12 + k % 2 * 4}" rx="2" fill="url(#suBambu)" stroke="#6E5A1E" stroke-width=".9"/><path d="M${x - 2.4} ${-46 + k % 2 * 2} h4.8" stroke="#6E5A1E" stroke-width=".7"/></g>`).join('');
    return `<ellipse cx="0" cy="0" rx="10" ry="2.4" fill="#1E3A2A" opacity=".3"/><path d="M0 0 V-74" stroke="#6E5A1E" stroke-width="4" stroke-linecap="round"/><path d="M0 0 V-74" stroke="url(#suBambu)" stroke-width="2.6" stroke-linecap="round"/><path d="M-1.6 -20 h3.2 M-1.6 -44 h3.2" stroke="#6E5A1E" stroke-width="1.2"/><path d="M-20 -60 Q0 -63 16 -60" stroke="#6E5A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-20 -60 Q0 -63 16 -60" stroke="#E6D27A" stroke-width="1" fill="none"/>${tubos}<g class="balanca" style="transform-origin:0 -74px"><path d="M0 -74 C8 -78 14 -72 22 -76 C18 -70 22 -66 18 -62 C12 -64 6 -68 0 -66Z" fill="#E5392C" stroke="#7A1410" stroke-width="1"/><path d="M4 -71 q6 -2 12 -1" stroke="#FFB0A0" stroke-width="1" fill="none"/></g><path d="M16 -60 Q40 -50 70 -40" stroke="#E6DCC8" stroke-width=".8" fill="none" stroke-dasharray="3 2"/><rect x="-24" y="-82" width="48" height="84" fill="transparent"/>`; };
  const nuvemAgua = (x, y, rx, ry) => `<path d="${copa(x, y, rx, ry, 9, .3)}" fill="#FFFFFF" opacity=".5"/><path d="${copa(x + rx * .5, y + ry * .2, rx * .55, ry * .7, 7, .3)}" fill="#FFFFFF" opacity=".35"/>`;
  const rachas = i => { let d = ''; const xs = XS(i); for (let k = 0; k < xs.length / 2.2; k++) { const x = R(TX0[i] + 20, 790), y = MEIO(i, x, R(.2, .8)); d += `M${f1(x)} ${f1(y)} l${f1(R(-10, 10))} ${f1(R(-3, 3))} l${f1(R(-8, 8))} ${f1(R(-3, 3))} M${f1(x)} ${f1(y)} l${f1(R(-6, 6))} ${f1(R(2, 5))}`; } return d; };
  const brilhosAgua = i => { let d = ''; for (let k = 0; k < 4; k++) { const x = R(TX0[i] + 30, 700), w = R(30, 90); d += `M${f1(x)} ${f1(MEIO(i, x, R(.3, .8)))} q${f1(w / 2)} -2 ${f1(w)} 0 `; } return d; };
  const nuvens = (x, y, s, op) => `<g opacity="${op}" transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 q4 -14 20 -12 q8 -14 26 -6 q14 -6 22 6 q12 0 12 12 Z" fill="#fff"/><path d="M6 0 q12 -4 24 -1 q14 -3 28 0 q12 -2 22 1" stroke="#D6E6F4" stroke-width="2" fill="none"/></g>`;
  /* ---------- faixas ---------- */
  const faixasSvg = [0, 1, 2, 3, 4, 5].map(i => {
    const d = faixaD(i), xs = XS(i);
    let extra = '';
    AGRI.forEach((a, k) => { if (a.f === i) extra += agricultor(a, k); });
    if (GARCA.f === i) extra += `<g id="su-garca" class="toque" transform="translate(${GARCA.x} ${f1(MEIO(i, GARCA.x, .7))}) scale(.95)"><g id="su-garca-in">${garca()}</g><rect x="-26" y="-60" width="56" height="62" fill="transparent"/></g>`;
    if (ESPANTA.f === i) extra += `<g id="su-espanta" class="toque" transform="translate(${ESPANTA.x} ${f1(F(i, ESPANTA.x) + 1)}) scale(.82)">${espantalho()}</g>`;
    if (SAPO.f === i) extra += `<g id="su-sapo" class="toque" transform="translate(${SAPO.x} ${f1(F(i, SAPO.x) + 1)})"><g id="su-sapo-in">${sapo()}</g><rect x="-14" y="-16" width="28" height="18" fill="transparent"/></g>`;
    const cai = CAI[i] ? `<g class="su-cai" data-f="${i}" style="opacity:0;transition:opacity .8s"><path d="M${CAI[i] - 5} ${f1(F(i, CAI[i]) - 2)} q5 -2 10 0 l1 ${f1(T(i + 1, CAI[i]) - F(i, CAI[i]) + 4)} q-6 3 -12 0Z" fill="#7CC8F0" stroke="#2E7AB6" stroke-width="1"/><path class="su-fluxo" d="M${CAI[i]} ${f1(F(i, CAI[i]) - 2)} v${f1(T(i + 1, CAI[i]) - F(i, CAI[i]) + 6)}" stroke="#E6F8FF" stroke-width="1.6" stroke-dasharray="3 4" fill="none"/></g>` : '';
    return `<g class="su-faixa" data-i="${i}">
      <path d="${d}" fill="url(#suSeco)" stroke="#8A6236" stroke-width="1.2"/>
      <path class="su-rachas" d="${rachas(i)}" stroke="#8A5E30" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7" style="transition:opacity 1s"/>
      <path class="su-lama" d="${d}" fill="url(#suLama)" style="opacity:0;transition:opacity 1.6s"/>
      <g class="su-agua" style="opacity:0"><path d="${d}" fill="url(#suEspelho)"/><g clip-path="url(#suClip${i})"><path d="M${pts(i, T, xs, 1)}" stroke="#2E6E8E" stroke-width="7" fill="none" opacity=".2"/>${[0, 1].map(j => { const x = 300 + ((i * 173 + j * 260) % 470), y = MEIO(i, x, .5); return nuvemAgua(x, y, 30 + j * 10 + i * 3, 3.6 + i * .7); }).join("")}${i > 0 ? `<path d="M${f1(700 - i * 40)} ${f1(MEIO(i, 700 - i * 40, .25))} q24 -3 48 0" stroke="#4E9AD0" stroke-width="2" fill="none" opacity=".35"/>` : ''}</g></g>
      <path class="su-reflexo" d="${brilhosAgua(i)}" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" style="opacity:0"/>
      <path d="M${pts(i, T, xs, 1.6)}" stroke="#3E6A22" stroke-width="1.4" fill="none" opacity=".45"/>
      <path class="su-alvo" d="${d}" fill="transparent" data-pts="${SLOTS[i].map(o => `${Math.round(o.x)},${Math.round(o.y)}`).join(';')}"/>
      <g class="su-plantas">${SLOTS[i].map((sl, k) => planta(sl, i, k)).join('')}</g>
      <g class="su-dica" style="display:none">${brilhoHotspot(Math.max(TX0[i] + 60, 70) + 40, MEIO(i, Math.max(TX0[i] + 60, 70) + 40) - 6)}</g>
      ${extra}
      <path d="${paredeD(i)}" fill="url(#suParede)" stroke="#5E3E22" stroke-width="1"/>
      <path d="${paredeD(i)}" fill="url(#suTerraTx)" opacity=".55"/>
      <path d="M${pts(i, F, XS(i), TW[i] * .55)}" stroke="#5E3E22" stroke-width=".9" fill="none" opacity=".35" stroke-dasharray="14 8"/>
      <path d="M${pts(i, F, XS(i), 2.4)}" stroke="#5E9A2E" stroke-width="3.4" fill="none" opacity=".9"/>
      ${capimBorda(i)}
      ${cai}
      <path d="${bordaD(i)}" stroke="#3E8A22" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path d="${bordaD(i)}" stroke="#A8E06A" stroke-width="1.4" fill="none" stroke-linecap="round" transform="translate(0 -1.2)"/>
      ${[.3, .22, .14, .07, 0, 0][i] ? `<path d="${d} ${paredeD(i)}" fill="#E8F2FA" opacity="${[.3, .22, .14, .07][i]}" pointer-events="none"/>` : ''}
    </g>`; }).join('');
  /* ---------- floresta ---------- */
  semente = 131;
  const fundoMata = Array.from({ length:12 }, (_, k) => arvore(-10 + k * 30 + R(-6, 6), 150 + R(-6, 6) + Math.abs(k - 5) * 3, R(18, 24), R(13, 17), ['#4E8A7A', '#5E9A82', '#46806E'][k % 3], '#2E5A52', '#9AD0B4')).join('');
  const meioMata = Array.from({ length:11 }, (_, k) => arvore(-6 + k * 32 + R(-6, 6), 180 + R(-5, 5), R(20, 26), R(14, 18), ['#1E6A4A', '#3E8A3A', '#2E7A5A', '#5EA03A', '#24705E'][k % 5], '#14402A', ['#6EC07A', '#8ED05A', '#5EB89A', '#B8E06A', '#6ACAA0'][k % 5])).join('');
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Terraços de arroz em Bali, com vulcão, floresta, canais de água, agricultores, patos e o estorninho-de-bali">
    <defs>
      <linearGradient id="suCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CA8E6"/><stop offset=".5" stop-color="#A6DAF4"/><stop offset=".85" stop-color="#FFE8C8"/><stop offset="1" stop-color="#FFE0B8"/></linearGradient>
      <radialGradient id="suSol" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8D0"/><stop offset=".6" stop-color="#FFD447"/><stop offset="1" stop-color="#F6A81E"/></radialGradient>
      <linearGradient id="suVulcao" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B4C2E6"/><stop offset="1" stop-color="#8496C8"/></linearGradient>
      <linearGradient id="suVulcao2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8D2EE"/><stop offset="1" stop-color="#B0BEE2"/></linearGradient>
      <linearGradient id="suNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E8" stop-opacity="0"/><stop offset="1" stop-color="#FFF6E8" stop-opacity=".75"/></linearGradient>
      <linearGradient id="suMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ACC5A"/><stop offset="1" stop-color="#5E9A34"/></linearGradient>
      <linearGradient id="suMorroLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8CC88"/><stop offset="1" stop-color="#7EAE62"/></linearGradient>
      <linearGradient id="suMata" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E7A5A"/><stop offset="1" stop-color="#1A5A3A"/></linearGradient>
      <linearGradient id="suSeco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2C08A"/><stop offset="1" stop-color="#BE925A"/></linearGradient>
      <linearGradient id="suLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A7A52"/><stop offset="1" stop-color="#6E5236"/></linearGradient>
      <linearGradient id="suEspelho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0D8"/><stop offset=".35" stop-color="#C8EEFA"/><stop offset="1" stop-color="#6EC0EA"/></linearGradient>
      <linearGradient id="suParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B08458"/><stop offset=".55" stop-color="#8E6640"/><stop offset="1" stop-color="#6A4A2C"/></linearGradient>
      <pattern id="suTerraTx" width="16" height="9" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#C89E70"/><circle cx="11" cy="6" r=".8" fill="#5E3E22"/><path d="M6 8 q2 -1 4 0" stroke="#5E3E22" stroke-width=".6" fill="none"/></pattern>
      <linearGradient id="suBambu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8B050"/><stop offset=".5" stop-color="#F2E08A"/><stop offset="1" stop-color="#A8903A"/></linearGradient>
      <linearGradient id="suCortina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8F0FF"/><stop offset=".5" stop-color="#6EC0F0"/><stop offset="1" stop-color="#9ADCFA"/></linearGradient>
      <radialGradient id="suPoco" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#5EB8E6"/><stop offset="1" stop-color="#2A6E9A"/></radialGradient>
      <linearGradient id="suNevoaV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".75"/><stop offset=".7" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <pattern id="suCapimTx" width="12" height="10" patternUnits="userSpaceOnUse"><path d="M2 10 l1 -5 M6 10 l-1 -6 M9 10 l1.4 -4" stroke="#A8E06A" stroke-width="1" fill="none"/></pattern>
      <linearGradient id="suPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6BEB2"/><stop offset="1" stop-color="#857C70"/></linearGradient>
      <linearGradient id="suPedraEsc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A9286"/><stop offset="1" stop-color="#5E564C"/></linearGradient>
      <linearGradient id="suMadeira" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5428"/><stop offset=".4" stop-color="#D2965A"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="suAguaC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ADCF6"/><stop offset="1" stop-color="#3E9AD6"/></linearGradient>
      <linearGradient id="suPalha" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE6A0"/><stop offset=".5" stop-color="#E8C46A"/><stop offset="1" stop-color="#B88A3A"/></linearGradient>
      <linearGradient id="suTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6A4A"/><stop offset=".5" stop-color="#C8A27A"/><stop offset="1" stop-color="#7A5A3A"/></linearGradient>
      <linearGradient id="suBanana" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8E05A"/><stop offset="1" stop-color="#4E9A2A"/></linearGradient>
      <radialGradient id="suInhame" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8CD05A"/><stop offset="1" stop-color="#2E7A2E"/></radialGradient>
      <linearGradient id="suBanana2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8CCB4A"/><stop offset="1" stop-color="#3E8A2A"/></linearGradient>
      <linearGradient id="suGarca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6DEEA"/></linearGradient>
      <radialGradient id="suSapo" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#B8F07A"/><stop offset="1" stop-color="#4E9A2A"/></radialGradient>
      <radialGradient id="suConcha" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F2B898"/><stop offset=".6" stop-color="#C8785A"/><stop offset="1" stop-color="#8A4A34"/></radialGradient>
      <linearGradient id="suTelhado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A060"/><stop offset="1" stop-color="#8A6430"/></linearGradient>
      <linearGradient id="suPipa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E5392C"/><stop offset=".5" stop-color="#FFC83D"/><stop offset="1" stop-color="#E5392C"/></linearGradient>
      <radialGradient id="suVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#14301A" stop-opacity="0"/><stop offset="1" stop-color="#14301A" stop-opacity=".32"/></radialGradient>
      <filter id="suGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
      ${[0, 1, 2, 3, 4, 5].map(i => `<clipPath id="suClip${i}"><path d="${faixaD(i)}"/></clipPath>`).join("")}
      <filter id="suDesfoque"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#suCeu)"/>
    <g id="su-sol"><circle cx="690" cy="66" r="58" fill="#FFF2B0" opacity=".3"/><circle cx="690" cy="66" r="40" fill="#FFF2B0" opacity=".35"/><circle cx="690" cy="66" r="27" fill="url(#suSol)" stroke="#F0A81E" stroke-width="2"/><path d="M676 56 q8 -9 20 -9" stroke="#FFFBE0" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva">${nuvens(420, 54, 1, .9)}${nuvens(560, 130, .7, .75)}</g>
    <path d="M560 236 L640 132 Q660 112 680 132 L800 222 V240Z" fill="url(#suVulcao2)" opacity=".85"/>
    <path d="M-40 236 L168 70 Q186 54 200 50 Q220 44 240 50 Q258 56 274 70 L520 236Z" fill="url(#suVulcao)" stroke="#7486B8" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M200 50 Q220 44 240 50 L246 60 Q236 56 228 62 Q220 56 212 62 Q204 56 194 60Z" fill="#E6ECFA" opacity=".9"/>
    <path d="M240 50 Q258 56 274 70 L520 236 H380 C340 170 290 100 240 50Z" fill="#5E70A8" opacity=".22"/>
    <path d="M150 90 L118 140 M190 70 L170 120 M262 70 L300 128 M286 84 L340 140" stroke="#7E90C0" stroke-width="1.4" opacity=".6" fill="none"/>
    ${nuvens(110, 98, .9, .8)}
    <g class="deriva" style="animation-duration:46s"><path d="M60 128 C110 112 190 120 250 114 C300 110 350 122 400 118 C360 136 280 132 220 138 C160 144 100 140 60 128Z" fill="url(#suNevoaV)" opacity=".8"/></g>
    <g class="deriva" style="animation-duration:60s;animation-delay:-20s"><path d="M150 82 C190 72 240 76 290 70 C320 68 340 74 360 80 C320 90 260 88 220 92 C190 94 160 90 150 82Z" fill="url(#suNevoaV)" opacity=".7"/></g>
    <rect y="150" width="800" height="90" fill="url(#suNevoa)"/>
    <path d="M440 240 C520 214 600 208 680 214 C730 218 770 222 810 216 V300 H440Z" fill="url(#suMorroLonge)"/>
    <g opacity=".85">${coqueiro(520, 236, 52, 6, .55)}${coqueiro(560, 230, 60, -8, .6)}${coqueiro(612, 228, 46, 4, .5)}</g>
    <g transform="translate(588 226)"><path d="M-14 0 V-12 H14 V0Z" fill="#C89A6A" stroke="#6E4628" stroke-width="1"/><path d="M-20 -11 Q0 -30 20 -11Z" fill="url(#suTelhado)" stroke="#6E4A1E" stroke-width="1.2"/><path d="M-14 -16 Q0 -26 14 -16" stroke="#E6C88A" stroke-width="1" fill="none"/><rect x="-4" y="-9" width="8" height="9" fill="#5E3A1A"/></g>
    <g id="su-pipa" class="toque"><path id="su-linha" d="M744 214 Q700 180 612 112" stroke="#F6F0E0" stroke-width="1" fill="none" opacity=".9"/><g id="su-pipa-in" style="transform-origin:612px 112px"><g transform="translate(612 112) rotate(-14)"><path d="M-26 0 C-14 -14 14 -14 24 0 C14 12 -14 12 -26 0Z" fill="url(#suPipa)" stroke="#8A1A10" stroke-width="1.4"/><path d="M24 0 L40 -12 L36 0 L40 12Z" fill="#2E7BB6" stroke="#12456E" stroke-width="1.2" stroke-linejoin="round"/><path d="M-14 -9 L-6 -22 L2 -10Z M-14 9 L-6 22 L2 10Z" fill="#FFFFFF" stroke="#8A1A10" stroke-width="1.1"/><circle cx="-14" cy="-2" r="4" fill="#fff" stroke="#12121A" stroke-width="1"/><circle cx="-13" cy="-2" r="2" fill="#12121A"/><path d="M-4 -6 v12 M6 -7 v14 M15 -5 v10" stroke="#8A1A10" stroke-width="1" opacity=".6"/></g><path id="su-rabo" d="M650 106 q16 10 30 4 q14 -6 28 4 q12 8 24 2" stroke="#E5392C" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      ${crianca(744, 236, .9, '#8A5A3A', '#FFC83D', '#1E140E', true)}${crianca(764, 238, .82, '#A86E48', '#3FA864', '#2A1A10', false)}<rect x="600" y="80" width="90" height="60" fill="transparent"/><rect x="730" y="200" width="46" height="42" fill="transparent"/></g>
    <path d="M-10 236 L-10 130 C20 120 60 118 100 124 C150 112 210 120 260 140 C300 160 330 190 350 236Z" fill="url(#suMata)"/>
    <g id="su-floresta" class="toque">${fundoMata}${meioMata}
      ${arvore(40, 206, 26, 20, '#2E8A4A', '#14402A', '#8ED05A', true)}${arvore(128, 204, 24, 18, '#C84A3A', '#6E1E14', '#FF9A7A', true)}${arvore(300, 214, 22, 16, '#3E8A6A', '#14402A', '#8AD0AA', true)}
      ${coqueiro(20, 220, 84, -6, .66)}${coqueiro(176, 214, 74, 8, .6)}${coqueiro(270, 222, 62, -10, .55)}${coqueiro(96, 224, 70, 10, .62)}
      ${arvore(214, 196, 18, 14, '#7AB83E', '#3E6A1E', '#D8F07A', false)}${arvore(330, 222, 16, 12, '#A8C83A', '#5E7A1E', '#EEF8A0', false)}${arvore(150, 214, 15, 11, '#24705E', '#0E3A2E', '#6ACAA0', false)}
      ${bananeira(58, 238, .8)}${bananeira(236, 238, .75)}${bananeira(316, 244, .7)}${samambaia(14, 228, 1)}${samambaia(250, 226, .9)}${samambaia(120, 236, .8)}
      <rect x="0" y="110" width="340" height="100" fill="transparent"/></g>
    <path d="M-10 230 C40 222 120 222 180 226 C240 230 300 236 350 240 C390 244 420 250 450 248 L450 500 H-10Z" fill="url(#suMorro)"/>
    <g fill="#B8E07A" opacity=".55">${Array.from({ length:30 }, () => { const x = R(0, 360), y = R(244, 470); return `<path d="M${f1(x)} ${f1(y)} l1 -5 M${f1(x + 3)} ${f1(y)} l-1 -4" stroke="#4E8A2A" stroke-width="1.2"/>`; }).join('')}</g>
    <g id="su-fonte" class="toque"><ellipse cx="72" cy="226" rx="46" ry="11" fill="#3E7A4A"/><ellipse cx="72" cy="226" rx="42" ry="9" fill="url(#suAguaC)" stroke="#2E7AB6" stroke-width="1.2"/><path d="M42 224 q10 -3 20 0 M76 228 q8 -2 16 0" stroke="#E6F8FF" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <g fill="#8A8A7A" stroke="#4E4A40" stroke-width="1">${[[30, 226, 7, 5], [112, 228, 8, 5], [62, 234, 6, 3.4], [92, 235, 7, 3.6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <path id="su-nasc" d="M60 216 q-2 -6 2 -10 q4 4 2 10" fill="#BFE8FF" stroke="#2E7AB6" stroke-width=".8" opacity=".9"/></g>
    <path d="M114 228 C130 226 150 224 168 224" stroke="#6E6660" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M114 228 C130 226 150 224 168 224" stroke="url(#suPedra)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path class="su-agua-canal" d="M114 227 C130 225 150 223 168 223" stroke="#4EA8E6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path class="su-fluxo" d="M114 227 C130 225 150 223 168 223" stroke="#E6F8FF" stroke-width="1.6" fill="none" stroke-dasharray="5 7"/>
    <path d="M228 226 C238 224 248 222 258 222" stroke="#6E6660" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M228 226 C238 224 248 222 258 222" stroke="url(#suPedra)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path class="su-agua-canal" d="M228 225 C238 223 248 221 258 221" stroke="#4EA8E6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path class="su-fluxo" d="M228 225 C238 223 248 221 258 221" stroke="#E6F8FF" stroke-width="1.6" fill="none" stroke-dasharray="5 7"/>
    <g id="su-tunel" class="toque"><path d="M156 238 C152 214 166 188 194 182 C218 178 236 196 240 220 C242 230 240 236 238 240Z" fill="url(#suPedraEsc)" stroke="#3E3830" stroke-width="1.6"/>
      <path d="M160 214 C170 198 188 190 206 190" stroke="#C6BEB2" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M176 200 l8 4 M206 196 l6 6 M220 214 l-6 4 M184 220 l6 -2" stroke="#4E463C" stroke-width="1.2" opacity=".7"/>
      <path d="M158 196 C170 182 196 176 214 182 C226 186 236 196 238 206 C224 198 200 192 182 194 C172 195 164 196 158 196Z" fill="#5EA83A" stroke="#2E6A22" stroke-width="1.2"/>
      ${capimPath(160, 236, 190, '#3E8A2A')}
      <path d="M160 232 V222 A8 8 0 0 1 176 222 V232Z" fill="#1E1A16" stroke="#3E3830" stroke-width="1.2"/><path d="M162 230 V223 A6 6 0 0 1 174 223 V230" stroke="#6E665C" stroke-width="1" fill="none"/>
      <path d="M222 232 V222 A8 8 0 0 1 238 222 V232Z" fill="#1E1A16" stroke="#3E3830" stroke-width="1.2"/>
      <path d="M164 230 h8 M226 230 h8" stroke="#4EA8E6" stroke-width="3" stroke-linecap="round"/>
      <rect x="150" y="180" width="96" height="60" fill="transparent"/></g>
    ${CANAL.map((d, k) => `<path d="${d}" stroke="#5E564C" stroke-width="14" fill="none" stroke-linecap="round"/><path d="${d}" stroke="url(#suPedra)" stroke-width="11" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#7E766C" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/><path id="su-canal-${k}" d="${d}" stroke="#4EA8E6" stroke-width="3" fill="none" stroke-linecap="round" style="transition:stroke-width .6s"/><path class="su-fluxo su-fluxo-${k}" d="${d}" stroke="#E6F8FF" stroke-width="1.4" fill="none" stroke-dasharray="5 8"/>`).join('')}
    ${CANAL.map((d, k) => `<path class="su-canal-alvo toque" data-k="${k}" d="${d}" stroke="transparent" stroke-width="20" fill="none" stroke-linecap="round"/>`).join('')}
    ${bananeira(130, 296, .9)}${bale(62, 330)}${moto(150, 334)}${bananeira(206, 300, .7)}
    <g fill="#FF8AB8" stroke="#9A2E5E" stroke-width=".6">${[[118, 360], [128, 366], [40, 362], [20, 370], [210, 340]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join("")}</g><g fill="#FFD447" stroke="#9A7A0E" stroke-width=".6">${[[110, 368], [30, 354], [200, 348]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join("")}</g>
    <g id="su-caixa">
      <path d="M232 252 L368 252 L342 272 L258 272Z" fill="url(#suPedra)" stroke="#5E564C" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M244 258 L356 258 M252 265 L348 265" stroke="#7E766C" stroke-width=".9" opacity=".6"/>
      <g id="su-fios">${[0, 1, 2].map(k => `<path id="su-fio-${k}" d="M300 254 L${SAI[k]} 270" stroke="#5EB4EC" stroke-width="4" fill="none" stroke-linecap="round" style="transition:stroke-width .5s"/>`).join('')}</g>
      <path d="M222 228 C232 210 368 210 378 228Z" fill="#6E665C" stroke="#3E3830" stroke-width="1.4"/>
      <path d="M229 228 C238 214 362 214 371 228Z" fill="url(#suPoco)"/>
      <path d="M256 220 q14 -2 28 0 M304 218 q16 -2 32 0 M270 224 q20 -2 40 0 M322 224 q14 -2 28 0" stroke="#D6F2FF" stroke-width="1.2" fill="none" opacity=".75"/>
      <g fill="#8A8276" stroke="#4E463C" stroke-width=".9">${[[230, 220, 7, 4], [248, 214, 8, 4], [354, 214, 8, 4], [372, 221, 6, 4], [300, 210, 9, 3.4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <path d="M228 226 H372 L370 256 H230Z" fill="url(#suPedraEsc)" stroke="#3E3830" stroke-width="1.6" stroke-linejoin="round"/>
      <g stroke="#3E3830" stroke-width="1" fill="none" opacity=".75"><path d="M229 236 H371 M230 246 H370"/>${[244, 268, 292, 316, 340, 362].map((x, k) => `<path d="M${x - (k % 2) * 10} 226 v10 M${x + 2} 236 v10 M${x - 8} 246 v10"/>`).join('')}</g>
      <g fill="#C6BEB2" opacity=".35">${[[236, 228], [260, 238], [300, 228], [330, 248], [352, 238]].map(([x, y]) => `<rect x="${x}" y="${y + 1}" width="14" height="2" rx="1"/>`).join('')}</g>
      <path d="M232 254 q10 -6 20 -2 q8 -4 14 2Z M332 255 q10 -7 22 -3 q8 -2 14 3Z" fill="#5E9A3A" stroke="#2E6A22" stroke-width=".8"/>
      <path d="M224 224 H376 V229.6 H224Z" fill="#BEB6AA" stroke="#4E463C" stroke-width="1.2"/><path d="M226 225.4 H374" stroke="#EEE8DE" stroke-width="1" opacity=".8"/>
      <g stroke="#4E463C" stroke-width="1" fill="none">${[1, 2, 3, 4, 5].map(k => `<path d="M${f1(BX0 + k * PASSO - 2.4)} 224 l2.4 3 l2.4 -3"/>`).join('')}</g>
      <g id="su-jorros">${[0, 1, 2].map(k => `<g><path id="su-jorro-${k}" d="M${BX0} 224 h10 v32 h-10Z" fill="url(#suCortina)" stroke="#2E7AB6" stroke-width=".8" opacity=".95"/><path id="su-jflow-${k}" class="su-fluxo" d="M${BX0 + 3} 226 v28" stroke="#FFFFFF" stroke-width="1.4" stroke-dasharray="4 5" fill="none" opacity=".9"/><ellipse id="su-espuma-${k}" cx="${BX0 + 5}" cy="256" rx="6" ry="2.4" fill="#F2FBFF" opacity=".9"/></g>`).join('')}</g>
      <g id="su-tabuas">${[0, 1].map(k => `<g id="su-tabua-${k}" class="su-tabua toque" data-i="${k}" style="cursor:grab"><g class="su-tabua-pos"><path d="M-4.6 200 h9.2 v58 h-9.2Z" fill="url(#suMadeira)" stroke="#4E2A10" stroke-width="1.4"/><path d="M-1.6 203 V255" stroke="#F2C890" stroke-width="1" opacity=".8"/><path d="M-4.6 214 h9.2 M-4.6 218 h9.2" stroke="#C8A86A" stroke-width="1.6"/><path d="M-4.6 214 l9.2 4 M-4.6 218 l9.2 -4" stroke="#7A5A2A" stroke-width=".7"/><path d="M-5.6 200 l5.6 -6 l5.6 6Z" fill="#A86A34" stroke="#4E2A10" stroke-width="1.2" stroke-linejoin="round"/><g class="su-tabua-dica">${brilhoHotspot(0, 184)}</g><rect x="-18" y="180" width="36" height="84" fill="transparent"/></g></g>`).join('')}</g>
    </g>
    <g id="su-puti" class="toque" data-fig="estorninho"><g id="su-puti-in" style="transform-origin:200px 182px"><svg x="160" y="134" width="82" height="75" viewBox="0 0 120 110"><use href="#f-estorninho"/></svg></g>${brilhoHotspot(236, 140)}</g>
    <g id="su-chiqueiro" class="toque">
      <path d="M0 414 C20 406 56 404 82 408 L82 420 C56 416 20 418 0 426Z" fill="#7A9A3E" stroke="#3E5A1E" stroke-width="1"/>
      <g id="su-bando-casa">${[[14, 408, '#F2DDB0', '#8A6234'], [30, 410, '#E8C48A', '#7A5228'], [46, 408, '#FFFDF6', '#8A8478'], [62, 411, '#E8C48A', '#7A5228'], [22, 416, '#FFFDF6', '#8A8478'], [40, 417, '#F2DDB0', '#8A6234'], [56, 418, '#F2DDB0', '#8A6234']].map(([x, y, c, e], k) => `<g transform="translate(${x} ${y}) scale(.68)"><g style="animation:flutua ${(1.6 + k * .23).toFixed(2)}s ease-in-out infinite alternate">${patoJogo(c, e)}</g></g>`).join('')}</g>
      <g stroke="#6E4A22" stroke-width="3.4" stroke-linecap="round">${[2, 14, 26, 38, 50, 62, 74, 84].map((x, k) => `<path d="M${x} ${422 - k * .4} V${394 - k * .3}"/>`).join('')}</g>
      <g stroke="#C8A06A" stroke-width="2" stroke-linecap="round">${[2, 14, 26, 38, 50, 62, 74, 84].map((x, k) => `<path d="M${x - .6} ${421 - k * .4} V${395 - k * .3}"/>`).join('')}</g>
      <path d="M0 400 C30 396 60 396 88 398 M0 412 C30 408 60 408 88 410" stroke="#8A6A3A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 400 C30 396 60 396 88 398 M0 412 C30 408 60 408 88 410" stroke="#F2D8A8" stroke-width="1" fill="none"/>
      <rect x="0" y="380" width="90" height="46" fill="transparent"/>
    </g>
    ${faixasSvg}
    <g id="su-sobra" style="opacity:0;transition:opacity .8s">${[500, 690].map(x => `<path d="M${x - 11} ${f1(F(1, x) - 3)} q11 -4 22 0 l3 ${f1(T(2, x) - F(1, x) + 5)} q-14 4 -28 0Z" fill="#7CC8F0" stroke="#2E7AB6" stroke-width="1.2" opacity=".95"/><path d="M${x - 6} ${f1(F(1, x))} v${f1(T(2, x) - F(1, x))} M${x + 5} ${f1(F(1, x))} v${f1(T(2, x) - F(1, x))}" stroke="#E6F8FF" stroke-width="1.4" opacity=".8"/><path class="su-fluxo" d="M${x} ${f1(F(1, x) - 2)} v${f1(T(2, x) - F(1, x) + 6)}" stroke="#E6F8FF" stroke-width="1.6" stroke-dasharray="3 4"/>`).join('')}</g>
    <g id="su-feixes" style="opacity:0;transition:opacity 1.4s">${[[540, 1], [300, 3], [640, 4], [180, 5], [500, 5]].map(([x, i]) => { const y = F(i, x) + 1; return `<g transform="translate(${x} ${f1(y)}) scale(${ESC[i]})"><ellipse cx="0" cy="0" rx="10" ry="2.4" fill="#2A1A0A" opacity=".3"/><path d="M-6 0 L-8 -22 L-2 -28 L2 -28 L8 -22 L6 0Z" fill="#E2B84A" stroke="#8A6214" stroke-width="1.2" stroke-linejoin="round"/><path d="M-6 -12 H6" stroke="#6E4A1E" stroke-width="2.4"/><path d="M-4 -26 q-6 -4 -10 2 M4 -26 q6 -4 10 2 M0 -28 q0 -6 -4 -8" stroke="#C89A2A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-3 -2 l-1 -18" stroke="#FFF0A8" stroke-width="1" opacity=".8"/></g>`; }).join('')}</g>
    <g id="su-carams">${CARAM.map((c, k) => caramujo(c, k)).join('')}</g>
    <g id="su-patos" style="display:none"></g>
    <g id="su-patofig" class="toque" data-fig="patocorredor"><g transform="translate(114 476)"><g id="su-patofig-in"><g transform="scale(.95)">${patoJogo('#F2DDB0', '#8A6234')}</g></g></g><rect x="96" y="440" width="36" height="40" fill="transparent"/>${brilhoHotspot(128, 444)}</g>
    <g>${bananeira(708, 498, 1.1)}</g>
    <g id="su-espiga" class="toque" data-fig="espigaarroz"><g class="balanca" style="transform-origin:722px 500px"><svg x="676" y="404" width="80" height="104" viewBox="0 0 100 130"><use href="#f-espigaarroz"/></svg></g>${brilhoHotspot(700, 418)}</g>
    <g>${coqueiro(782, 504, 330, -34, 1.15)}</g>
    <g id="su-tokay" class="toque" data-fig="tokay"><g transform="translate(772 352) rotate(-78)"><g id="su-tokay-in"><svg x="-34" y="-24" width="68" height="44" viewBox="0 0 140 90"><use href="#f-tokay"/></svg></g></g>${brilhoHotspot(790, 318)}<rect x="752" y="314" width="42" height="74" fill="transparent"/></g>
    <g>${inhame(-8, 504, .8, -46)}${inhame(22, 510, 1.15, -16)}${inhame(64, 512, .85, 16)}${inhame(44, 516, .65, -2)}</g>
    <rect width="800" height="500" fill="url(#suVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#suGrao)" pointer-events="none"/>
  </svg>`;
  function capimBorda(i){ let d = ''; for (let x = TX0[i] + 8; x < 800; x += R(7, 13)) { const y = F(i, x) - 1, h = R(3, 6) * (.7 + i * .08); d += `M${f1(x)} ${f1(y)} q${f1(R(-1, 1))} ${f1(-h / 2)} ${f1(R(-2.4, 2.4))} ${f1(-h)} `; } return `<path d="${d}" stroke="#3E8A22" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; }
  function capimPath(x0, x1, y, cor){ let d = ''; for (let k = 0; k < 10; k++) { const x = R(x0, x1), h = R(4, 8); d += `M${f1(x)} ${y} q${f1(R(-1.5, 1.5))} ${f1(-h / 2)} ${f1(R(-2.5, 2.5))} ${f1(-h)} `; } return `<path d="${d}" stroke="${cor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`; }
  const c = criarCena(palco, svg), s = c.svg;
  /* água correndo nos canais */
  s.querySelectorAll('.su-fluxo').forEach((p, k) => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-26 }], { duration:900 + (k % 3) * 120, iterations:Infinity }));
  const faixas = [...s.querySelectorAll('.su-faixa')];
  const nivel = [0, 0, 0], alvoN = [0, 0, 0];
  let secar = 1;   /* fase 3: a água do campo baixa para virar lama */
  function pintaFaixas(){
    faixas.forEach((g, i) => {
      const L = nivel[GRUPO[i]], k = i % 2 === 0 ? Math.min(1, L * 2) : Math.max(0, L * 2 - 1), a = k * secar;
      g.querySelector('.su-agua').style.opacity = a.toFixed(3);
      g.querySelector('.su-reflexo').style.opacity = (a * .7).toFixed(3);
      g.querySelector('.su-rachas').style.opacity = Math.max(0, .7 - k * 1.6).toFixed(2);
      const cai = g.querySelector('.su-cai'); if (cai) cai.style.opacity = L > .52 && secar > .9 ? 1 : 0;
    });
  }
  /* ---------- fase 1: repartir a água ---------- */
  const tabG = [0, 1].map(k => el(s, `#su-tabua-${k}`));
  const xTab = p => BX0 + p * PASSO, canalW = [3, 3, 3];
  let tabX = tab.map(xTab);
  function desenhaCaixa(){
    const sh = parte(), bordas = [BX0, tabX[0], tabX[1], BX1];
    tabG.forEach((g, k) => g.setAttribute('transform', `translate(${f1(tabX[k])} 0)`));
    [0, 1, 2].forEach(k => {
      const a = bordas[k] + (k ? 4 : 0), b = bordas[k + 1] - (k < 2 ? 4 : 0), w = Math.max(2, b - a);
      el(s, `#su-jorro-${k}`).setAttribute('d', `M${f1(a)} 225 C${f1(a + 1)} 236 ${f1(a + 2)} 246 ${f1(a + 1)} 256 H${f1(b - 1)} C${f1(b - 2)} 246 ${f1(b - 1)} 236 ${f1(b)} 225Z`);
      const nf = Math.max(1, Math.round(w / 9)); el(s, `#su-jflow-${k}`).setAttribute('d', Array.from({ length:nf }, (_, q) => `M${f1(a + (q + .5) * w / nf)} 227 v27`).join(' '));
      const es = el(s, `#su-espuma-${k}`); es.setAttribute('cx', f1(a + w / 2)); es.setAttribute('rx', f1(w / 2 + 3));
      const fio = el(s, `#su-fio-${k}`); fio.setAttribute('d', `M${f1(a + w / 2)} 257 Q${f1((a + w / 2 + SAI[k]) / 2)} 266 ${SAI[k]} 271`);
    });
    const live = [(tabX[0] - BX0) / (BX1 - BX0), (tabX[1] - tabX[0]) / (BX1 - BX0), (BX1 - tabX[1]) / (BX1 - BX0)];
    [0, 1, 2].forEach(k => { el(s, `#su-fio-${k}`).setAttribute('stroke-width', f1(2 + live[k] * 18)); canalW[k] = 1.6 + live[k] * 13; el(s, `#su-canal-${k}`).setAttribute('stroke-width', f1(canalW[k])); });
    sh.forEach((v, k) => { alvoN[2 - k] = Math.min(1, v * 3); });
  }
  desenhaCaixa();
  let arr = null;
  tabG.forEach(g => g.addEventListener('pointerdown', e => {
    if (fase !== 'repartir' || ocupado) return; e.stopPropagation();
    const p = c.ponto(e), k = Math.abs(p.x - tabX[0]) <= Math.abs(p.x - tabX[1]) ? 0 : 1; arr = { k, dx:p.x - tabX[k], x0:p.x, moveu:false }; s.setPointerCapture(e.pointerId); tabG[k].style.cursor = 'grabbing'; toca('clique');
    s.querySelectorAll('.su-tabua-dica').forEach(h => h.style.display = 'none');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e); if (Math.abs(p.x - arr.x0) > 5) arr.moveu = true;
    const k = arr.k, min = k ? BX0 + 2 * PASSO : BX0 + PASSO, max = k ? BX1 - PASSO : BX1 - 2 * PASSO;
    tabX[k] = Math.max(min, Math.min(max, p.x - arr.dx));
    if (k === 0 && tabX[1] < tabX[0] + PASSO) tabX[1] = tabX[0] + PASSO;
    if (k === 1 && tabX[0] > tabX[1] - PASSO) tabX[0] = tabX[1] - PASSO;
    const novo = tabX.map(v => Math.round((v - BX0) / PASSO)); if (novo[0] !== tab[0] || novo[1] !== tab[1]) { tab = novo; toca('clique'); }
    desenhaCaixa();
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { k, moveu } = arr; arr = null; tabG[k].style.cursor = 'grab';
    if (!moveu) { const alvo = JUSTO[k]; if (tab[k] !== alvo) { tab[k] += Math.sign(alvo - tab[k]); if (k === 0 && tab[1] <= tab[0]) tab[1] = tab[0] + 1; if (k === 1 && tab[0] >= tab[1]) tab[0] = tab[1] - 1; } }
    tabX = tab.map(xTab); desenhaCaixa(); toca('splash');
    confere();
  });
  function confere(){
    const sh = parte();
    if (tab[0] === JUSTO[0] && tab[1] === JUSTO[1]) { fase = 'enchendo'; api.hud('<span class="chip">Água repartida: 3/3</span>'); api.diz('Isso! Três partes iguais. Agora a água chega a todos os terraços, do mais alto ao mais baixo.'); return; }
    const ok = sh.filter(v => Math.abs(v - 1 / 3) < .01).length;
    api.hud(`<span class="chip">Água repartida: ${ok}/3</span>`);
    if (sh[2] > .34) api.diz('O campo lá de cima ainda pega água demais. Os de baixo ficam com sede!');
    else if (sh[0] > .34) api.diz('Agora é o campo de baixo que pega demais. Tem que ser igual para todos!');
    else api.diz('Quase! Deixe os três pedaços de água do mesmo tamanho.');
  }
  /* ---------- fase 2: plantar as mudas ---------- */
  const plantas = [...s.querySelectorAll('.su-pl')];
  const porFaixa = [0, 1, 2, 3, 4, 5].map(i => plantas.filter(p => +p.dataset.f === i));
  const feitas = [0, 0, 0, 0, 0, 0], linhaOk = [false, false, false, false, false, false];
  function comecaPlantio(){
    fase = 'plantio'; faixas.forEach(g => g.querySelector('.su-dica').style.display = '');
    api.hud('<span class="chip">Terraços plantados: 0/6</span>');
    api.diz('Os campos estão alagados, prontos para o arroz. Plante as mudas: passe o dedo ou toque em cada terraço!');
  }
  function planta1(i, k, atraso){
    const sl = SLOTS[i][k]; if (sl.ok) return; sl.ok = true; feitas[i]++; plantadas++;
    const g = porFaixa[i][k].querySelector('.su-pl-in');
    depois(atraso || 0, () => { g.style.transform = 'scale(1)'; if (k % 3 === 0) c.add({ tipo:'respingo', x:sl.x, y:sl.y, t:0, cor:'#E6F8FF' }); });
    if (!linhaOk[i] && feitas[i] >= SLOTS[i].length * .8) {
      linhaOk[i] = true; linhas++; faixas[i].querySelector('.su-dica').style.display = 'none';
      SLOTS[i].forEach((o, kk) => { if (!o.ok) planta1(i, kk, 300 + kk * 30); });
      depois(400, () => { toca('planta'); c.brilhos(MEIO(i, 560), MEIO(i, 560) - 10, 5, '#C8F07A'); });
      api.hud(`<span class="chip">Terraços plantados: ${linhas}/6</span>`);
      if (linhas === 1) api.diz('O arroz gosta de crescer com os pés na água.');
      if (linhas === 3) api.diz('Cada mudinha vai virar um pé cheio de grãos.');
      if (linhas === 6) { fase = 'crescer'; depois(1600, cresce); }
    }
  }
  let plantando = false, ultimoP = null, ondaDita = false;
  const plantaPerto = (x, y) => { SLOTS.forEach((lst, i) => lst.forEach((sl, k) => { if (!sl.ok && Math.abs(sl.x - x) < 20 && Math.abs(sl.y - y) < 14) { planta1(i, k); if (Math.random() < .3) toca('pop'); } })); };
  faixas.forEach((g, i) => g.querySelector('.su-alvo').addEventListener('pointerdown', e => {
    if (fase !== 'plantio') { const p = c.ponto(e), L = nivel[GRUPO[i]], ag = (i % 2 === 0 ? Math.min(1, L * 2) : Math.max(0, L * 2 - 1)) * secar;
      if (ag > .3) { for (let q = 0; q < 3; q++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:q * 4, cor:'#FFFFFF' }); somOn && tom(880 + sorte(0, 300), 0, .18, 'sine', .05, 520); if (!ondaDita) { ondaDita = true; api.diz('Plic! A água parada do terraço é um espelho: dá para ver o céu e as nuvens.'); } }
      else if (fase === 'repartir') { toca('clique'); api.diz('Este terraço está secando, a terra até rachou! Falta a parte de água dele.'); }
      return; }
    e.stopPropagation(); const p = c.ponto(e); plantando = true; ultimoP = { x0:p.x, y0:p.y, i, moveu:false }; s.setPointerCapture(e.pointerId); plantaPerto(p.x, p.y);
  }));
  s.addEventListener('pointermove', e => { if (!plantando) return; const p = c.ponto(e); if (Math.hypot(p.x - ultimoP.x0, p.y - ultimoP.y0) > 10) ultimoP.moveu = true; plantaPerto(p.x, p.y); });
  s.addEventListener('pointerup', () => { if (!plantando) return; plantando = false; if (!ultimoP.moveu) { const i = ultimoP.i; toca('planta'); SLOTS[i].forEach((o, k) => { if (!o.ok) planta1(i, k, Math.abs(o.x - ultimoP.x0) * 2); }); } });
  function cresce(){
    api.hud('<span class="chip">O arroz está crescendo...</span>');
    api.diz('A água do subak chega a todos os terraços, e o arroz cresce verdinho.');
    plantas.forEach((p, k) => depois(k * 8, () => { p.querySelector('.su-m').style.opacity = 0; const g = p.querySelector('.su-g'); g.style.opacity = 1; g.style.transform = 'scale(1)'; }));
    depois(4800, () => {
      toca('ok'); api.hud('<span class="chip">O arroz amadureceu</span>'); api.diz('Depois de alguns meses, o arroz fica dourado e pesado de grãos.');
      plantas.forEach((p, k) => depois(k * 6, () => { p.querySelector('.su-g').style.opacity = 0; p.querySelector('.su-r').style.opacity = 1; }));
    });
    depois(10200, () => {
      api.hud('<span class="chip">Colheita!</span>'); toca('planta'); api.diz('Hora da colheita! Os vizinhos colhem juntos e depois deixam a água do campo baixar.');
      plantas.forEach((p, k) => depois(k * 6, () => { p.querySelector('.su-r').style.opacity = 0; p.querySelector('.su-t').style.opacity = 1; }));
      el(s, '#su-feixes').style.opacity = 1; faixas.forEach(g => g.querySelector('.su-lama').style.opacity = 1);
      const t0 = performance.now(); (function baixa(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 2500); secar = 1 - k * .62; pintaFaixas(); if (k < 1) requestAnimationFrame(baixa); })(t0);
      depois(5600, comecaPatos);
    });
  }
  /* ---------- fase 3: os patos ---------- */
  const carams = [...s.querySelectorAll('.su-car')];
  const N = 7, CORES = [['#F2DDB0', '#8A6234'], ['#E8C48A', '#7A5228'], ['#FFFDF6', '#8A8478'], ['#E8C48A', '#7A5228'], ['#FFFDF6', '#8A8478'], ['#F2DDB0', '#8A6234'], ['#E8C48A', '#7A5228']];
  const patosG = el(s, '#su-patos');
  patosG.innerHTML = CORES.map(([cc, e], k) => `<g class="su-pato${k === 0 ? ' toque' : ''}" ${k === 0 ? 'id="su-lider" style="cursor:grab"' : ''}><g class="su-pato-vira"><g class="su-pato-in">${k === 0 ? '<ellipse cx="0" cy="-12" rx="16" ry="18" fill="#FFF6C8" opacity=".35"/>' : ''}${patoJogo(cc, e)}</g></g>${k === 0 ? `<g class="su-lider-dica">${brilhoHotspot(10, -40)}</g><circle cx="0" cy="-12" r="22" fill="transparent"/>` : ''}</g>`).join('');
  const patos = [...patosG.querySelectorAll('.su-pato')];
  const lider = { x:70, y:418, tx:70, ty:418, vira:1 }, hist = [];
  for (let k = 0; k < 160; k++) hist.push({ x:20 + (k % 7) * 8, y:416, v:1 });
  let pegaLider = null, rotaAuto = null;
  function comecaPatos(){
    fase = 'patos'; el(s, '#su-bando-casa').style.display = 'none'; patosG.style.display = '';
    carams.forEach(g => g.style.display = '');
    lider.x = 70; lider.y = 418; lider.tx = 150; lider.ty = 470;
    api.hud('<span class="chip">Caramujos: 0/8</span>');
    api.diz('Depois da colheita, os patos entram no campo. Arraste o pato da frente e leve a turma até os caramujos!');
  }
  el(s, '#su-patos').addEventListener('pointerdown', e => {
    if (fase !== 'patos' || !e.target.closest('#su-lider')) return; e.stopPropagation();
    const p = c.ponto(e); pegaLider = { x0:p.x, y0:p.y, dx:p.x - lider.x, dy:p.y - lider.y }; rotaAuto = null; s.setPointerCapture(e.pointerId);
    el(s, '.su-lider-dica').style.display = 'none'; somOn && tom(560, 0, .12, 'square', .03, 420);
  });
  s.addEventListener('pointermove', e => { if (!pegaLider) return; const p = c.ponto(e); lider.tx = Math.max(20, Math.min(770, p.x - pegaLider.dx)); lider.ty = Math.max(262, Math.min(494, p.y - pegaLider.dy)); });
  s.addEventListener('pointerup', () => { pegaLider = null; });
  carams.forEach((g, k) => g.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'patos' || CARAM[k].foi) return; rotaAuto = k; lider.tx = CARAM[k].x; lider.ty = CARAM[k].y + 4; toca('clique'); }));
  function come(k){
    const cm = CARAM[k]; cm.foi = true; comidos++; const g = carams[k];
    g.querySelector('.su-car-in').animate([{ transform:'scale(1)', opacity:1 }, { transform:'scale(1.3)', opacity:.8 }, { transform:'scale(0)', opacity:0 }], { duration:450, fill:'forwards' });
    toca('pop'); somOn && [0, .12].forEach(t => tom(620, t, .09, 'square', .035, 380));
    c.brilhos(cm.x, cm.y - 8, 4, '#C8F07A');
    depois(900, () => { for (let j = 0; j < 3; j++) c.add({ tipo:'brilho', t:-j * 4, x:cm.x + sorte(-8, 8), y:cm.y + sorte(-2, 3), cor:'#B8E07A' }); });
    api.hud(`<span class="chip">Caramujos: ${comidos}/8</span>`);
    if (comidos === 1) api.diz('Os patos comem os caramujos e os insetos que estragam o arroz.');
    if (comidos === 3) api.diz('E o cocô dos patos vira adubo para a terra!');
    if (comidos === 5) api.diz('Sem veneno nenhum: os patos ajudam os agricultores.');
    if (comidos === 8) { fase = 'fim'; toca('vitoria'); depois(900, () => { api.diz('Campo limpinho e adubado! Em Bali, a floresta guarda a água, os canais levam e os vizinhos repartem. Há mais de mil anos é assim. Que ideia boa!'); depois(6600, api.fim); }); }
  }
  /* ---------- quadro a quadro: níveis, patos, libélulas ---------- */
  const canais = [0, 1, 2].map(k => el(s, `#su-canal-${k}`)), peixes = [{ k:0, u:.1, v:.0016, cor:'#FFB04A' }, { k:0, u:.55, v:.0013, cor:'#C8D8E8' }, { k:1, u:.3, v:.003, cor:'#FF8A5A' }, { k:2, u:.4, v:.004, cor:'#C8D8E8' }];
  const libs = [{ x:430, y:300, f:0, c:'#E5392C' }, { x:600, y:360, f:2, c:'#2E7BF6' }, { x:300, y:420, f:4, c:'#FF8A3A' }];
  let ultSobra = 0;
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (fase === 'repartir' || fase === 'enchendo') {
      let mudou = false; const dtN = Math.min(.1, t - (nivel.t || t)); nivel.t = t;
      for (let g = 0; g < 3; g++) { const d = alvoN[g] - nivel[g]; if (Math.abs(d) > .002) { nivel[g] += Math.sign(d) * Math.min(Math.abs(d), .4 * dtN); mudou = true; } }
      if (mudou) pintaFaixas();
      const sobra = parte()[2] > .34 && nivel[0] > .97; el(s, '#su-sobra').style.opacity = sobra ? 1 : 0;
      if (sobra && t - ultSobra > .22) { ultSobra = t; const xs = [500, 690][Math.floor(sorte(0, 2))]; c.add({ tipo:'respingo', x:xs + sorte(-4, 4), y:T(2, xs) + 2, t:0, cor:'#E6F8FF' }); c.add({ tipo:'respingo', x:sorte(440, 760), y:F(1, 600) - 3, t:0, cor:'#FFFFFF' }); }
      if (fase === 'enchendo' && nivel.every(v => v > .99)) { fase = 'cheio'; toca('vitoria'); faixas.forEach((g, i) => c.brilhos(560, MEIO(i, 560), 3, '#FFFFFF'));
        s.querySelectorAll('.su-agri .su-braco').forEach(b => b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-120deg)' }, { transform:'rotate(-90deg)' }, { transform:'rotate(-120deg)' }, { transform:'rotate(0)' }], { duration:1600 }));
        api.diz('No subak, os agricultores se reúnem e decidem juntos como repartir a água. Assim, ninguém fica sem!'); depois(5200, comecaPlantio); }
    }
    if (fase === 'patos' || fase === 'fim') {
      const dt = Math.min(.1, t - (lider.t || t)); lider.t = t;
      const vx = lider.tx - lider.x, vy = lider.ty - lider.y, dd = Math.hypot(vx, vy), v = Math.min(dd, (pegaLider ? 200 : 140) * dt);
      if (dd > .5) { lider.x += vx / dd * v; lider.y += vy / dd * v; if (Math.abs(vx) > 1) lider.vira = vx < 0 ? -1 : 1; }
      const anda = dd > 1;
      if (Math.hypot(lider.x - hist[0].x, lider.y - hist[0].y) > 3) { hist.unshift({ x:lider.x, y:lider.y, v:lider.vira }); hist.length = 160; }
      patos.forEach((g, k) => {
        const h = k === 0 ? { x:lider.x, y:lider.y, v:lider.vira } : hist[Math.min(hist.length - 1, k * 6)] || hist[hist.length - 1];
        const bob = anda ? Math.abs(Math.sin(t * 12 + k)) * 2 : 0, ginga = anda ? Math.sin(t * 12 + k) * 6 : 0;
        const esc = .9 + (h.y - 262) / 232 * .45;
        g.setAttribute('transform', `translate(${f1(h.x)} ${f1(h.y - bob)}) scale(${(esc * (h.v || 1)).toFixed(3)} ${esc.toFixed(3)})`);
        g.querySelector('.su-pato-in').setAttribute('transform', `rotate(${f1(ginga)})`);
        if (fase === 'patos') CARAM.forEach((cm, j) => { if (!cm.foi && Math.hypot(cm.x - h.x, cm.y - h.y) < 22) come(j); });
      });
      if (rotaAuto != null && CARAM[rotaAuto].foi) { const prox = CARAM.findIndex(cm => !cm.foi); rotaAuto = null; }
    }
    peixes.forEach(pe => { const cp = canais[pe.k], w = canalW[pe.k]; if (w < 4) return; pe.u = (pe.u + pe.v * (1 + w / 10)) % 1;
      const L = cp.getTotalLength(), a = cp.getPointAtLength(pe.u * L), b = cp.getPointAtLength(Math.min(L, pe.u * L + 2)), ang = Math.atan2(b.y - a.y, b.x - a.x), mexe = Math.sin(t * 10 + pe.u * 40) * .25;
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(ang + mexe * .3); ctx.globalAlpha = .85; ctx.fillStyle = pe.cor; ctx.strokeStyle = '#1E4A7A'; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-6, -2 + mexe * 2); ctx.lineTo(-6, 2 + mexe * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 3.6, 1.6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); });
    for (let q = pulos.length - 1; q >= 0; q--) { const pl = pulos[q], k = (t - pl.t0) / .9; if (k >= 1) { c.add({ tipo:'respingo', x:pl.x + pl.d * 26, y:pl.y, t:0, cor:'#E6F8FF' }); pulos.splice(q, 1); continue; }
      const x = pl.x + pl.d * 26 * k, y = pl.y - Math.sin(k * Math.PI) * 30;
      ctx.save(); ctx.translate(x, y); ctx.rotate(pl.d * (-1.1 + k * 2.2) + (pl.d < 0 ? Math.PI : 0)); ctx.fillStyle = '#FF9A3A'; ctx.strokeStyle = '#8A3A10'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-11, -4); ctx.lineTo(-11, 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 7, 3.4, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(4, -.8, 1.3, 0, 7); ctx.fill(); ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(4.3, -.8, .7, 0, 7); ctx.fill(); ctx.restore(); }
    for (let q = passaros.length - 1; q >= 0; q--) { const b = passaros[q], k = t - b.t0; if (k > 3.2) { passaros.splice(q, 1); continue; }
      b.x += b.vx - 1.6; b.y += b.vy; b.vy += .03; const asa = Math.sin(t * 30 + b.f) * 4;
      ctx.save(); ctx.translate(b.x, b.y); ctx.globalAlpha = Math.min(1, (3.2 - k) * 2); ctx.fillStyle = '#8A5A3A'; ctx.strokeStyle = '#3E2614'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 4.4, 2.6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-1, -1); ctx.quadraticCurveTo(-4, -4 - asa, -8, -2 - asa); ctx.moveTo(1, -1); ctx.quadraticCurveTo(4, -4 - asa, 7, -2 - asa); ctx.stroke();
      ctx.fillStyle = '#E8D2B0'; ctx.beginPath(); ctx.arc(-3.6, -.6, 1.8, 0, 7); ctx.fill(); ctx.restore(); }
    libs.forEach((l, k) => {
      const x = l.x + Math.sin(t * .7 + l.f) * 90 + Math.sin(t * 2.3 + k) * 14, y = l.y + Math.sin(t * 1.1 + l.f * 2) * 26, a = Math.cos(t * .7 + l.f) > 0 ? 0 : Math.PI, fl = Math.sin(t * 40 + k) * .5 + .5;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.sin(t * 2 + k) * .15);
      ctx.globalAlpha = .55; ctx.fillStyle = '#E6F6FF'; ctx.strokeStyle = '#7AA8C8'; ctx.lineWidth = .6;
      [[-2, -1], [2, -1]].forEach(([dx]) => { ctx.beginPath(); ctx.ellipse(dx, -4 - fl * 1.5, 2, 6, dx * .25, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(dx, 4 + fl * 1.5, 2, 6, -dx * .25, 0, 7); ctx.fill(); ctx.stroke(); });
      ctx.globalAlpha = 1; ctx.strokeStyle = l.c; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(8, 0); ctx.stroke();
      ctx.fillStyle = l.c; ctx.beginPath(); ctx.arc(9, 0, 2.2, 0, 7); ctx.fill(); ctx.restore();
    });
  });
  /* ---------- toques extras ---------- */
  el(s, '#su-puti').addEventListener('click', () => {
    el(s, '#su-puti-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-12px)' }, { transform:'translateY(0)' }, { transform:'translateY(-6px)' }, { transform:'translateY(0)' }], { duration:700 });
    [1800, 2400, 2000, 2700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'sine', .06, f * 1.2), i * 110));
    api.diz(fase === 'repartir' ? 'Eu só existo aqui, na ilha de Bali! Me ajude: arraste as tábuas para repartir a água.' : 'Estorninhos-de-bali quase sumiram. Hoje muita gente cuida para a gente voar livre de novo.');
  });
  const falasAgri = ['Meu campo é o mais alto. A água chega aqui primeiro, mas não posso pegar tudo!', 'No subak, a gente se reúne e decide junto a vez de cada um.', 'Meu campo é o mais baixo. Com a água bem repartida, ela chega até aqui!'];
  s.querySelectorAll('.su-agri').forEach((g, k) => g.addEventListener('click', e => { e.stopPropagation(); toca('pop'); g.querySelector('.su-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-120deg)' }, { transform:'rotate(-95deg)' }, { transform:'rotate(-120deg)' }, { transform:'rotate(0)' }], { duration:1200 }); api.diz(falasAgri[k]); }));
  let garcaOcup = false;
  el(s, '#su-garca').addEventListener('click', e => { e.stopPropagation(); if (garcaOcup) return; garcaOcup = true; toca('splash'); c.add({ tipo:'respingo', x:GARCA.x, y:MEIO(3, GARCA.x, .7), t:0, cor:'#E6F8FF' });
    const a = el(s, '#su-garca-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(-60px,-90px) scale(.9)' }, { transform:'translate(-140px,-60px) scale(.9)' }, { transform:'translate(-60px,-30px)' }, { transform:'translate(0,0)' }], { duration:3400, easing:'ease-in-out' });
    a.onfinish = () => { garcaOcup = false; }; api.diz('A garça pesca peixinhos e girinos nos campos alagados.'); });
  el(s, '#su-sapo').addEventListener('click', e => { e.stopPropagation(); toca('glub'); el(s, '#su-sapo-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(10px,-22px)' }, { transform:'translate(20px,0)' }, { transform:'translate(10px,-12px)' }, { transform:'translate(0,0)' }], { duration:1200 }); c.add({ tipo:'respingo', x:SAPO.x + 20, y:F(4, SAPO.x) + 3, t:0, cor:'#E6F8FF' }); api.diz('Nos campos de arroz alagados vivem sapos, peixinhos e libélulas.'); });
  el(s, '#su-pipa').addEventListener('click', e => { e.stopPropagation(); toca('vapor'); el(s, '#su-pipa-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-14deg) translate(-10px,-14px)' }, { transform:'rotate(10deg) translate(8px,-6px)' }, { transform:'rotate(0)' }], { duration:1800, easing:'ease-in-out' }); api.diz('Quando venta forte, as crianças de Bali soltam pipas enormes, até em forma de peixe!'); });
  el(s, '#su-floresta').addEventListener('click', e => { e.stopPropagation(); toca('chuva');
    for (let i = 0; i < 10; i++) { const x = sorte(20, 300); c.add({ tipo:'infiltra', x0:x, y0:sorte(140, 190), x1:72 + sorte(-20, 20), y1:222, dur:sorte(60, 100), f:sorte(0, 6) }); }
    api.diz('A floresta no alto da montanha segura a água da chuva como uma esponja. Ela alimenta as nascentes, por isso é protegida.'); });
  el(s, '#su-fonte').addEventListener('click', e => { e.stopPropagation(); toca('glub'); for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:72 + sorte(-20, 20), y:226, t:i * 2, cor:'#E6F8FF' }); api.diz('Daqui brota a água da nascente. Ela vem da chuva que a floresta guardou.'); });
  el(s, '#su-tunel').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Este túnel foi cavado na pedra pelos agricultores, para a água atravessar o morro!'); });
  el(s, '#su-patofig').addEventListener('click', () => { somOn && [0, .16].forEach(t => tom(520, t, .1, 'square', .04, 380)); el(s, '#su-patofig-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-8deg)' }, { transform:'rotate(8deg)' }, { transform:'rotate(0)' }], { duration:600, iterations:2 }); });
  el(s, '#su-tokay').addEventListener('click', () => { somOn && [[300, 0], [190, .28]].forEach(([f, t]) => tom(f, t, .18, 'square', .05, f * .7)); el(s, '#su-tokay-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(10px,0)' }, { transform:'translate(0,0)' }], { duration:700 }); });
  el(s, '#su-espiga').addEventListener('click', () => toca('planta'));
  const pulos = [], passaros = [];
  s.querySelectorAll('.su-canal-alvo').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); const p = c.ponto(e);
    pulos.push({ x:p.x, y:p.y, t0:performance.now() / 1000, d:sorte(0, 1) < .5 ? -1 : 1 }); toca('splash'); for (let q = 0; q < 3; q++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:q * 3, cor:'#E6F8FF' });
    api.diz('Peixinhos também moram nos canais e nos campos alagados. A água limpa é a casa deles!'); }));
  let espOcup = false;
  el(s, '#su-espanta').addEventListener('click', e => { e.stopPropagation(); if (espOcup) return; espOcup = true;
    s.querySelectorAll('#su-espanta .su-tubo').forEach((tb, q) => tb.animate([{ transform:'rotate(0)' }, { transform:`rotate(${q % 2 ? 24 : -24}deg)` }, { transform:`rotate(${q % 2 ? -18 : 18}deg)` }, { transform:'rotate(8deg)' }, { transform:'rotate(0)' }], { duration:1100, delay:q * 60 }));
    if (somOn) [0, .12, .22, .36, .46, .6].forEach((t, q) => { tom([920, 760, 1040, 820, 980, 700][q], t, .07, 'square', .05, 300); });
    const x0 = ESPANTA.x, y0 = MEIO(ESPANTA.f, ESPANTA.x);
    for (let q = 0; q < 6; q++) passaros.push({ x:x0 + sorte(-60, 60), y:y0 + sorte(-6, 10), vx:sorte(-3, 3) || 1, vy:sorte(-3.4, -2), f:sorte(0, 6), t0:performance.now() / 1000 });
    api.diz('Tloc, tloc! O espantalho de bambu faz barulho com o vento e espanta os passarinhos do arroz.');
    depois(1300, () => { espOcup = false; }); });
  el(s, '#su-bale').addEventListener('click', e => { e.stopPropagation(); toca('ok'); api.diz('Nesta casinha aberta, os agricultores do subak se reúnem para combinar a água, o plantio e a colheita.'); });
  el(s, '#su-chiqueiro').addEventListener('click', e => { if (fase === 'patos' || fase === 'fim') return; e.stopPropagation(); somOn && [0, .14, .28].forEach(t => tom(500 + t * 300, t, .09, 'square', .035, 360)); api.diz(fase === 'repartir' ? 'Os patos estão esperando a colheita para passear no campo.' : 'Quack! Os patos já querem sair.'); });
  /* começo */
  pintaFaixas();
  api.hud('<span class="chip">Água repartida: 0/3</span>');
  api.diz('Oi, eu sou o Puti, um estorninho-de-bali! Aqui a água desce da floresta e é repartida entre todos os campos.');
  api.diz('O campo de cima está pegando quase toda a água. Arraste as tábuas para dividir a água em três partes iguais!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
