/* ================= JOGO 5: Cerrado, berço das águas ================= */
function jogoCerrado(palco, api){
  semente = 71;
  let vivo = true, fase = 'plantar', plantadas = 0, cheio = 0, nuvemX = 160, arrN = null, nRios = 0, nFlores = 0;
  const META = 70, SUP = 222, AQ0 = 478, AQ1 = 402;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const ARV = [{ x:80, ok:true, ipe:true }, { x:170 }, { x:260 }, { x:350 }, { x:440 }, { x:520, ok:true }];
  const PI = Math.PI, f1 = n => n.toFixed(1), f0 = n => n.toFixed(0), umDe = a => a[Math.floor(R(0, a.length - .001))];

  /* ---------- geometria: curvas lisas, galhos afinando ---------- */
  const liso = (P, ini = 'M') => { let d = `${ini}${f1(P[0][0])} ${f1(P[0][1])}`; for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`; } return d; };
  const NRM = (P, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; return [-dy / m, dx / m]; };
  const larg = (w0, w1, i, n) => w0 + (w1 - w0) * i / Math.max(1, n - 1);
  const tubo = (P, w0, w1) => { const A = [], B = []; P.forEach((p, i) => { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, P.length) / 2; A.push([p[0] + nx * w, p[1] + ny * w]); B.push([p[0] - nx * w, p[1] - ny * w]); }); return liso(A) + ' ' + liso(B.reverse(), 'L') + 'Z'; };
  const paralela = (P, w0, w1, k, jit) => P.map((p, i) => { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, P.length) / 2 * (k + R(-jit, jit)); return [p[0] + nx * w, p[1] + ny * w]; });
  const ramo = (x, y, ang, len, n, torce) => { const P = [[x, y]]; let a = ang; for (let k = 0; k < n; k++) { a += (k % 2 ? -torce : torce) + R(-.14, .14); x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; P.push([x, y]); } return P; };
  const ponta = P => P[P.length - 1];
  /* madeira com casca grossa (cortiça): fissuras ao longo do galho, placas e brilho do lado da luz */
  const lenho = (partes, casca, ink, risco, luz) => partes.map(([P, w0, w1]) => {
    let fis = ''; const n = P.length;
    [-.42, .05, .5].forEach(k => { if (w0 < 7 && k !== .05) return; fis += `<path d="${liso(paralela(P, w0, w1, k, .16))}" stroke="${risco}" stroke-width="${w0 > 10 ? 1.5 : 1.1}" fill="none" stroke-dasharray="${f0(R(5, 9))} ${f0(R(2, 4))} ${f0(R(3, 7))} ${f0(R(2, 3))}" stroke-linecap="round"/>`; });
    if (w0 > 9) for (let i = 1; i < n - 1; i++) { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, n) / 2, k = R(0, 1) < .5 ? -.42 : .05, p = P[i]; fis += `<path d="M${f1(p[0] + nx * w * k)} ${f1(p[1] + ny * w * k + 2)} l${f1(nx * w * .46)} ${f1(ny * w * .46 - 1.5)}" stroke="${risco}" stroke-width="1.1" stroke-linecap="round"/>`; }
    return `<path d="${tubo(P, w0, w1)}" fill="url(#${casca})" stroke="${ink}" stroke-width="1.7" stroke-linejoin="round"/>${fis}<path d="${liso(paralela(P, w0, w1, -.66, 0).slice(0, Math.max(2, n - 1)))}" stroke="${luz}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".75"/>`; }).join('');
  /* copa em lóbulos: sombra, corpo com degradê, folhas de couro na borda e brilho */
  const copaF = (L, k) => {
    const somb = L.map(([cx, cy, rx, ry]) => `<path d="${copa(cx + 3, cy + 5, rx, ry, 10, .22)}"/>`).join('');
    const corpo = L.map(([cx, cy, rx, ry]) => `<path d="${copa(cx, cy, rx, ry, Math.round(7 + rx / 4), .3)}" fill="url(#${k.g})" stroke="${k.ink}" stroke-width="1.8" stroke-linejoin="round"/>`).join('');
    let fol = '';
    L.forEach(([cx, cy, rx, ry]) => { const m = Math.round(rx / (k.dens || 3.2)); for (let j = 0; j < m; j++) { const t = R(-PI * .98, PI * .2), r = R(.8, 1); fol += k.folha(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r, t * 180 / PI); } for (let j = 0; j < m * .5; j++) { const t = R(-PI, PI), r = R(.2, .62); fol += k.folha(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r, t * 180 / PI); } });
    const luz = L.map(([cx, cy, rx, ry]) => `M${f1(cx - rx * .62)} ${f1(cy - ry * .15)} q${f1(rx * .2)} ${f1(-ry * .62)} ${f1(rx * .68)} ${f1(-ry * .68)}`).join(' ');
    return `<g fill="${k.sombra}" opacity=".5">${somb}</g>${corpo}${fol}<path d="${luz}" stroke="${k.luz}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>${k.extra ? k.extra(L) : ''}`;
  };
  /* folhas e flores de cada espécie */
  const folhaOv = (len, wid, fills, ink, nerv) => (x, y, a) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-28, 28))})"><path d="M0 0 Q${f1(len * .5)} ${f1(-wid)} ${len} 0 Q${f1(len * .5)} ${wid} 0 0Z" fill="${umDe(fills)}" stroke="${ink}" stroke-width=".9" stroke-linejoin="round"/><path d="M1 0 H${f1(len - 1.6)}" stroke="${nerv}" stroke-width=".6"/></g>`;
  const folhaPinada = (fills, ink) => (x, y, a) => { const cor = umDe(fills); let d = ''; for (let j = 0; j < 4; j++) d += `<circle cx="${f1(2.5 + j * 2.6)}" cy="-1.9" r="1.45"/><circle cx="${f1(2.5 + j * 2.6)}" cy="1.9" r="1.45"/>`; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-30, 30))})"><path d="M0 0 H13" stroke="${ink}" stroke-width=".7"/><g fill="${cor}" stroke="${ink}" stroke-width=".55">${d}<circle cx="13.2" cy="0" r="1.5"/></g></g>`; };
  const folhaTrio = (fills, ink, nerv) => { const f = folhaOv(8.5, 3.6, fills, ink, nerv); return (x, y, a) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-20, 20))})"><path d="M0 0 H3" stroke="${ink}" stroke-width=".8"/>${f(3, 0, -32)}${f(3, 0, 0)}${f(3, 0, 32)}</g>`; };
  const espalha = (L, n, fn, alto) => { let o = ''; for (let j = 0; j < n; j++) { const [cx, cy, rx, ry] = umDe(L), t = alto ? R(-PI * .95, -PI * .05) : R(-PI, PI), r = R(.35, .95); o += fn(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r); } return o; };
  const florIpe = (x, y) => { const r = R(1.6, 2.3), c = umDe(['#FFE45A', '#FFD233', '#FFC21E']); return `<g fill="${c}" stroke="#B07A08" stroke-width=".55">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(x + Math.cos(a * PI / 180 + 0.3) * r * 1.1)}" cy="${f1(y + Math.sin(a * PI / 180 + 0.3) * r * 1.1)}" r="${f1(r)}"/>`).join('')}<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .55)}" fill="#E58A12" stroke="none"/></g>`; };
  const florPT = (x, y) => `<g stroke="#A86A06" stroke-width=".5">${[[0, 0], [2.6, -2.2], [-2.4, -2.4], [.2, -4.6]].map(([dx, dy]) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y + dy)}" rx="2" ry="1.6" fill="#FFCF3A"/>`).join('')}<circle cx="${f1(x)}" cy="${f1(y - 2.2)}" r=".9" fill="#E0661E" stroke="none"/></g>`;
  const florCg = (x, y) => `<g><g fill="#FFFFFF" stroke="#9AA8A0" stroke-width=".45">${[0, 90, 180, 270].map(a => `<circle cx="${f1(x + Math.cos(a * PI / 180 + .5) * 1.7)}" cy="${f1(y + Math.sin(a * PI / 180 + .5) * 1.7)}" r="1.5"/>`).join('')}</g><circle cx="${f1(x)}" cy="${f1(y)}" r=".8" fill="#F2C230"/></g>`;
  const frutoCg = (x, y) => `<g><path d="M${f1(x)} ${f1(y - 6)} v3" stroke="#3E5A2A" stroke-width=".8"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="#F2D24A" stroke="#9A7A10" stroke-width=".8"/><circle cx="${f1(x - 1)}" cy="${f1(y - 1)}" r=".9" fill="#FFF6C0"/></g>`;
  const florPq = (x, y) => `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="url(#ceFlorPq)" stroke="#C8B47A" stroke-width=".5"/>${[0, 1, 2, 3, 4, 5].map(k => { const a = k * PI / 3 + .3; return `<path d="M${f1(x + Math.cos(a) * 2.6)} ${f1(y + Math.sin(a) * 2.6)} l${f1(Math.cos(a) * 1.8)} ${f1(Math.sin(a) * 1.8)}" stroke="#E8D9A0" stroke-width=".6"/>`; }).join('')}</g>`;
  const frutoPq = (x, y) => `<g><path d="M${f1(x)} ${f1(y - 7)} q1 3 0 4" stroke="#3E5A22" stroke-width="1" fill="none"/><circle cx="${f1(x)}" cy="${f1(y)}" r="4.4" fill="url(#ceFrutoPq)" stroke="#2E4A18" stroke-width="1"/><ellipse cx="${f1(x - 1.4)}" cy="${f1(y - 1.6)}" rx="1.3" ry=".9" fill="#E6F5B0"/></g>`;
  const sombraArv = (x, rx) => `<ellipse cx="${x}" cy="${SUP + 2}" rx="${rx}" ry="4.2" fill="#2E1A0A" opacity=".28"/>`;
  const balanca = (i, conteudo) => `<g class="balanca" style="animation-delay:${(-i * .7).toFixed(1)}s">${conteudo}</g>`;

  /* ---------- as cinco espécies (cada muda é uma árvore diferente) ---------- */
  const ESPECIE = {
    /* barbatimão: copa em andares, folhinhas compostas verde-amareladas */
    1: x => { const T = ramo(x, SUP + 3, -PI / 2 + .12, 52, 4, .14), a = ramo(...T[3], -PI / 2 - .95, 34, 3, .18), b = ramo(...T[4], -PI / 2 + .75, 30, 3, .18), c = ramo(...ponta(T), -PI / 2 - .1, 20, 2, .1);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
      const L = [[ax - 2, ay + 2, 24, 10], [bx + 2, by + 1, 24, 10], [cx - 4, cy - 2, 28, 12], [cx + 6, cy - 15, 17, 8]];
      return sombraArv(x, 30) + lenho([[T, 12, 6.5], [a, 6, 2.2], [b, 5.6, 2.2], [c, 5, 2.4]], 'ceCaR', '#3A1E0E', '#3A1E0E', '#D69A6A') + balanca(1, copaF(L, { g:'ceCoBa', ink:'#4E6420', sombra:'#3E5216', luz:'#F6FCC8', dens:2.8, folha:folhaOv(7.5, 4.6, ['#C8DA66', '#B4CC50', '#D8E67E'], '#4E6420', '#7E9A2E') })); },
    /* lixeira: tronco bem torto, copa rala cinza-esverdeada, folhas grandes e ásperas */
    2: x => { const T = ramo(x, SUP + 3, -PI / 2 - .16, 56, 5, .3), a = ramo(...T[3], -PI / 2 + .95, 32, 3, .32), b = ramo(...ponta(T), -PI / 2 - .75, 28, 3, .3), c = ramo(...ponta(T), -PI / 2 + .2, 16, 2, .2), d = ramo(...T[2], -PI / 2 - 1.25, 16, 2, .2);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c), [dx, dy] = ponta(d);
      const L = [[ax + 2, ay - 2, 18, 11], [bx - 2, by - 3, 19, 11], [cx + 2, cy - 7, 17, 10], [dx - 4, dy - 2, 11, 7]];
      return sombraArv(x, 28) + lenho([[T, 14, 6.5], [a, 6.4, 2.2], [b, 6, 2.2], [c, 4.6, 2], [d, 4, 1.8]], 'ceCaC', '#3A2E20', '#4A3C2A', '#E8DCC4') + balanca(2, copaF(L, { g:'ceCoLx', ink:'#3F5238', sombra:'#34452E', luz:'#EEF4E2', dens:2.6, folha:folhaOv(11, 6, ['#A9BC92', '#B8C9A2', '#9CB086'], '#4E6448', '#6E8462') })); },
    /* pau-terra: tronco em S com cortiça funda, copa oliva com cachos de flor amarela */
    3: x => { const T = ramo(x, SUP + 3, -PI / 2 + .32, 52, 5, .38), a = ramo(...ponta(T), -PI / 2 - .9, 28, 3, .34), b = ramo(...ponta(T), -PI / 2 + .62, 26, 3, .3), c = ramo(...T[2], -PI / 2 - 1.2, 18, 2, .2);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c), [tx, ty] = ponta(T);
      const L = [[cx - 2, cy - 3, 14, 9], [ax - 2, ay - 1, 23, 13], [bx + 3, by, 22, 13], [tx, ty - 18, 25, 14]];
      return sombraArv(x, 28) + lenho([[T, 15, 7.5], [a, 6.4, 2.2], [b, 6, 2.2], [c, 4.4, 1.8]], 'ceCaE', '#2E1A0C', '#2E1A0C', '#C8945E') + balanca(3, copaF(L, { g:'ceCoPt', ink:'#45501A', sombra:'#3A4416', luz:'#F0F2B8', dens:2.8, folha:folhaOv(10, 3.6, ['#A8B04C', '#B9BE5E', '#9AA442'], '#4E5A1E', '#76802E'), extra:L2 => espalha(L2, 12, florPT, true) })); },
    /* cagaiteira: copa redonda e densa verde-azulada, florzinhas brancas e frutinhas amarelas */
    4: x => { const T = ramo(x, SUP + 3, -PI / 2 - .06, 44, 3, .12), a = ramo(...ponta(T), -PI / 2 - .6, 22, 2, .16), b = ramo(...ponta(T), -PI / 2 + .55, 22, 2, .16);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [tx, ty] = ponta(T);
      const L = [[ax - 6, ay + 4, 21, 14], [bx + 6, by + 5, 21, 14], [tx, ty - 22, 26, 16], [tx - 4, ty - 38, 15, 9]];
      return sombraArv(x, 30) + lenho([[T, 12, 7.5], [a, 6, 2.6], [b, 6, 2.6]], 'ceCaE', '#2E1A0C', '#2E1A0C', '#C8945E') + balanca(4, copaF(L, { g:'ceCoCg', ink:'#1C463A', sombra:'#163A30', luz:'#D4F2E2', dens:2.4, folha:folhaOv(7, 3.2, ['#4E9E7E', '#5FB08E', '#3E8A6C'], '#1C463A', '#2E6A54'), extra:L2 => espalha(L2, 14, florCg, false) + espalha(L2, 4, frutoCg, false) })); },
    /* pequizeiro: copa larga verde viva, folhas em trio, flores de pompom e pequis */
    5: x => { const T = ramo(x, SUP + 3, -PI / 2 - .08, 44, 4, .16), a = ramo(...T[3], -PI / 2 - .95, 34, 3, .2), b = ramo(...T[3], -PI / 2 + .9, 34, 3, .2), c = ramo(...ponta(T), -PI / 2 - .05, 20, 2, .12);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
      const L = [[ax - 2, ay + 1, 25, 12], [bx + 2, by + 1, 25, 12], [cx, cy - 8, 30, 14], [cx - 18, cy - 4, 18, 10]];
      return sombraArv(x, 34) + lenho([[T, 14, 8], [a, 7, 2.6], [b, 7, 2.6], [c, 6, 2.6]], 'ceCaR', '#3A1E0E', '#3A1E0E', '#D69A6A') + balanca(5, copaF(L, { g:'ceCoPq', ink:'#2E5418', sombra:'#26461A', luz:'#ECFAC4', dens:3.6, folha:folhaTrio(['#7EB848', '#8CC656', '#6EA83E'], '#2E5418', '#4E8A2E'), extra:L2 => espalha(L2, 9, florPq, true) + frutoPq(ax - 8, ay + 12) + frutoPq(cx - 20, cy + 6) })); }
  };
  const ESPV = [0, 1, 2, 3, 4, 5];
  const arvore = (x, cresce, i) => { semente = x * 3; return `<g class="${cresce ? 'cresce' : ''}">${ESPECIE[ESPV[i] || 1](x)}</g>`; };
  /* ipê-amarelo florido, sem folhas */
  const ipe = x => { semente = 404; const T = ramo(x, SUP + 3, -PI / 2 + .05, 50, 5, .2), a = ramo(...T[3], -PI / 2 - 1.0, 34, 3, .24), b = ramo(...T[3], -PI / 2 + .92, 34, 3, .24), c = ramo(...ponta(T), -PI / 2 - .2, 22, 2, .15), d = ramo(...a[2], -PI / 2 - .2, 14, 2, .2), e = ramo(...b[2], -PI / 2 + .1, 14, 2, .2);
    const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
    const L = [[ax - 2, ay - 4, 22, 14], [bx + 2, by - 4, 22, 14], [x - 14, cy + 4, 18, 11], [x + 16, cy + 4, 18, 11], [cx, cy - 8, 26, 15]];
    const chao = Array.from({length:18}, () => `<ellipse cx="${f0(R(x - 46, x + 46))}" cy="${f1(SUP + R(-1, 3))}" rx="2.4" ry="1.3" fill="${umDe(['#FFD233', '#FFE45A', '#F5B921'])}" stroke="#B07A08" stroke-width=".5"/>`).join('');
    return `<g id="ce-ipe" class="toque">${sombraArv(x, 40)}${chao}${lenho([[T, 14, 6.5], [a, 6.4, 2], [b, 6.4, 2], [c, 5, 2], [d, 3, 1.4], [e, 3, 1.4]], 'ceCaI', '#2A2018', '#2E241A', '#B8A890')}
      <g class="balanca" style="animation-delay:-1.4s">${copaF(L, { g:'ceCoIpe', ink:'#A86A06', sombra:'#8A5404', luz:'#FFF8D0', dens:3.4, folha:(px, py) => florIpe(px, py), extra:L2 => espalha(L2, 8, florIpe, true) })}</g>
      <rect x="${x - 56}" y="${SUP - 106}" width="112" height="56" fill="transparent"/></g>`; };

  /* ---------- capim dourado, flores do campo e cupinzeiros ---------- */
  const tufoD = (x, y, h, cores, n) => { let d = ''; for (let k = 0; k < n; k++) { const a = -PI / 2 + (k - (n - 1) / 2) * .2 + R(-.1, .1), hh = h * R(.6, 1.1), ex = x + Math.cos(a) * hh, ey = y + Math.sin(a) * hh; d += `<path d="M${f1(x + R(-2, 2))} ${y} Q${f1(x + Math.cos(a) * hh * .35)} ${f1(y - hh * .6)} ${f1(ex)} ${f1(ey)}" stroke="${cores[k % cores.length]}"/>`; } return d; };
  const OURO = ['#D9B54A', '#C29A2E', '#E8CC6A', '#A88A2E', '#CDB25A', '#9E8E3E'];
  semente = 72;
  const capim = Array.from({length:64}, () => { const x = R(4, 556), h = R(11, 21), cores = [umDe(OURO), umDe(OURO), umDe(OURO)]; const esp = R(0, 1) < .45 ? `<ellipse cx="${f1(x + R(-3, 3))}" cy="${f1(SUP + 1 - h * R(.95, 1.1))}" rx="1.6" ry="3.6" fill="#EBD488" stroke="#9A7A22" stroke-width=".7"/>` : ''; return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s">${tufoD(x, SUP + 2, h, cores, Math.round(R(5, 8)))}${esp}</g>`; }).join('');
  const capimFrente = Array.from({length:52}, () => tufoD(R(0, 560), SUP + 4, R(6, 11), [umDe(OURO), '#8A7A2A', umDe(OURO)], Math.round(R(4, 6)))).join('');
  const dourado = Array.from({length:9}, () => { const x = R(150, 545), n = Math.round(R(3, 5)); let o = ''; for (let k = 0; k < n; k++) { const ex = x + (k - n / 2) * R(2, 4), ey = SUP - R(22, 32); o += `<path d="M${f1(x)} ${SUP + 1} Q${f1((x + ex) / 2)} ${f1(ey + 14)} ${f1(ex)} ${f1(ey)}" stroke="#B8902A" stroke-width=".9" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="2" fill="url(#ceOuro)" stroke="#9A6E0A" stroke-width=".6"/>`; } return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s">${o}</g>`; }).join('');
  const chuveirinho = Array.from({length:7}, () => { const x = R(100, 548), h = R(24, 34); return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s"><path d="M${f1(x)} ${SUP + 1} q${f1(R(-3, 3))} ${f1(-h * .5)} 0 ${f1(-h)}" stroke="#7A8A3A" stroke-width="1" fill="none"/><circle cx="${f1(x)}" cy="${f1(SUP + 1 - h)}" r="4.4" fill="url(#ceChuv)" stroke="#A89E7A" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<circle cx="${f1(x + Math.cos(k * .785) * 4.6)}" cy="${f1(SUP + 1 - h + Math.sin(k * .785) * 4.6)}" r=".8" fill="#fff"/>`).join('')}</g>`; }).join('');
  const florzinhas = Array.from({length:12}, () => { const x = R(110, 550), h = R(6, 12), cor = umDe(['#C98AE8', '#FF8AB8', '#FFFFFF', '#FFB347']); return `<path d="M${f1(x)} ${SUP + 2} v${f1(-h)}" stroke="#5E7A2A" stroke-width=".9"/><g fill="${cor}" stroke="#6E4A6E" stroke-width=".4">${[0, 1, 2, 3, 4].map(k => `<circle cx="${f1(x + Math.cos(k * 1.256) * 1.9)}" cy="${f1(SUP + 2 - h + Math.sin(k * 1.256) * 1.9)}" r="1.5"/>`).join('')}</g><circle cx="${f1(x)}" cy="${f1(SUP + 2 - h)}" r=".8" fill="#FFC21E"/>`; }).join('');
  const cupinzinho = (x, h, w) => `<g><ellipse cx="${x + w * .4}" cy="${SUP + 2}" rx="${w * 1.2}" ry="3" fill="#2E1A0A" opacity=".25"/><path d="M${x - w} ${SUP + 3} C${x - w} ${SUP - h * .5} ${x - w * .5} ${SUP - h} ${x} ${SUP - h} C${x + w * .5} ${SUP - h} ${x + w * .9} ${SUP - h * .5} ${x + w} ${SUP + 3}Z" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="1.5"/><path d="M${x - w * .5} ${SUP - h * .55} q${w * .4} -3 ${w * .8} 0 M${x - w * .6} ${SUP - h * .25} q${w * .5} -3 ${w} 0" stroke="#8E5228" stroke-width="1" fill="none"/><path d="M${x - w * .55} ${SUP - h * .45} q1 ${-h * .3} ${w * .4} ${-h * .45}" stroke="#F2C08E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;

  /* ---------- solo em camadas ---------- */
  const SOLOD = `M0 ${SUP} H560 C600 ${SUP} 620 260 660 290 C700 320 740 336 800 340`;
  const BZ = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]; };
  const SUPT = [[0, SUP], [560, SUP]]; for (let t = .05; t < 1.01; t += .05) SUPT.push(BZ([560, SUP], [600, SUP], [620, 260], [660, 290], t)); for (let t = .05; t < 1.01; t += .05) SUPT.push(BZ([660, 290], [700, 320], [740, 336], [800, 340], t));
  const supY = x => { x = Math.max(0, Math.min(800, x)); for (let i = 1; i < SUPT.length; i++) if (SUPT[i][0] >= x) { const a = SUPT[i - 1], b = SUPT[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) || 1); } return 340; };
  const linhaH = (fr, amp, sem) => { semente = sem; const P = []; for (let x = -10; x <= 810; x += 20) { const y0 = supY(x); P.push([x, y0 + (393 - y0) * fr + Math.sin(x / 47 + sem) * amp + R(-amp, amp) * .5]); } return P; };
  const HA = linhaH(.17, 2.2, 3), HC = linhaH(.6, 3.4, 5), HB = linhaH(.86, 2, 7);
  const camada = (P, desce) => liso(P) + (desce ? ' L810 500 L-10 500Z' : '');
  const regiaoA = SOLOD + ` L810 340 L810 ${f1(ponta(HA)[1])}` + liso([...HA].reverse(), ' L') + 'Z';
  const regiaoB2 = liso(HB) + ' L810 500 L-10 500Z';
  semente = 73;
  const emSolo = (fr0, fr1, xa = 4, xb = 796) => { const x = R(xa, xb), y0 = supY(x); return [x, y0 + (393 - y0) * R(fr0, fr1)]; };
  const raizinhas = Array.from({length:120}, () => { const x = R(2, 556); let d = `M${f1(x)} ${SUP + 2}`, y = SUP + 2, xx = x; const h = R(6, 20); while (y < SUP + h) { y += R(3, 5); xx += R(-2.2, 2.2); d += ` L${f1(xx)} ${f1(y)}`; } return d; }).join(' ');
  const humus = Array.from({length:70}, () => { const [x, y] = emSolo(.03, .16); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(.8, 2.4))}" ry="${f1(R(.6, 1.4))}" fill="${umDe(['#1E0E06', '#3A2010', '#8A5A30', '#2A1A10'])}"/>`; }).join('');
  const listras = Array.from({length:16}, () => { const [x, y] = emSolo(.22, .56); const w = R(30, 90); return `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(R(-3, 3))} ${f1(w)} 0" stroke="${umDe(['#E08A54', '#D8784A', '#9A4220'])}" stroke-width="${f1(R(1, 2.2))}" fill="none" opacity=".5" stroke-linecap="round"/>`; }).join('');
  const nodulos = Array.from({length:60}, () => { const [x, y] = emSolo(.2, .58); const r = R(.9, 2.2); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${umDe(['#6E2A12', '#7E3418', '#E8A070'])}" opacity=".75"/>`; }).join('');
  const manchas = Array.from({length:22}, () => { const [x, y] = emSolo(.64, .95); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(8, 20))}" ry="${f1(R(3, 6))}" fill="${umDe(['#F0C27A', '#E8B068', '#C8743E'])}" opacity=".45"/>`; }).join('');
  const seixo = (x, y, r) => { const g = umDe(['ceSx1', 'ceSx1', 'ceSx2', 'ceSx3']), rot = R(-30, 30); return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(rot)})"><ellipse cx="1" cy="${f1(r * .3)}" rx="${f1(r)}" ry="${f1(r * .62)}" fill="#3A1E0C" opacity=".35"/><ellipse rx="${f1(r)}" ry="${f1(r * .64)}" fill="url(#${g})" stroke="#4E2A14" stroke-width="1"/><path d="M${f1(-r * .5)} ${f1(-r * .2)} q${f1(r * .35)} ${f1(-r * .32)} ${f1(r * .75)} ${f1(-r * .1)}" stroke="#FFF2DE" stroke-width=".9" fill="none" opacity=".8" stroke-linecap="round"/></g>`; };
  const pedras = Array.from({length:30}, () => { const [x, y] = emSolo(.64, .97, 8, 792); return seixo(x, y, R(3.5, 8.5)); }).join('') + Array.from({length:12}, () => { const [x, y] = emSolo(.22, .55); return seixo(x, y, R(2.5, 4.5)); }).join('');
  const linhaSeixos = HC.filter((_, k) => k % 1 === 0).map(([x, y]) => seixo(x + R(-6, 6), y + R(-2, 2), R(2.4, 4.4)) + seixo(x + 10 + R(-4, 4), y + R(-2, 3), R(2, 3.6))).join('');
  const serrapilheira = Array.from({length:70}, () => { const x = R(2, 558); return `<ellipse cx="${f1(x)}" cy="${f1(SUP + R(.5, 3))}" rx="${f1(R(1.8, 3.4))}" ry="${f1(R(.8, 1.4))}" transform="rotate(${f0(R(-30, 30))} ${f1(x)} ${SUP + 2})" fill="${umDe(['#B8763A', '#8A5428', '#D89A4A', '#6E4A22', '#A8862E'])}" stroke="#4E2E14" stroke-width=".4"/>`; }).join('');
  /* bichos do solo: galerias de cupim, formigueiro, larva */
  const cupins = (pts) => pts.map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="2.2" ry="1.3" fill="#F6EAD0" stroke="#8A6A4A" stroke-width=".4"/><circle cx="2.3" cy="0" r="1" fill="#C88A3A"/></g>`).join('');
  const formiga = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="-2.6" cy="0" rx="1.8" ry="1.3" fill="#3A1408"/><circle cx="0" cy="0" r="1" fill="#3A1408"/><circle cx="2" cy="0" r="1.2" fill="#3A1408"/><path d="M-1 -1.8 L1 1.8 M1 -1.8 L-1 1.8 M3 -1 l1.4 -1.4" stroke="#3A1408" stroke-width=".45"/></g>`;
  const vidaSolo = `<g>
      <path d="M22 ${SUP + 2} C18 236 28 246 22 258 C16 270 32 282 28 296 M22 258 C34 260 44 258 52 266 M28 296 C40 298 52 296 60 306 M52 266 C60 276 70 278 76 286" stroke="#7A3E1C" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M22 ${SUP + 2} C18 236 28 246 22 258 C16 270 32 282 28 296 M22 258 C34 260 44 258 52 266 M28 296 C40 298 52 296 60 306 M52 266 C60 276 70 278 76 286" stroke="#2A1206" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${[[22, 258, 8, 5], [52, 266, 7, 4.5], [28, 296, 8, 5], [60, 306, 7, 4.5], [76, 286, 6, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + 1.5}" ry="${ry + 1.5}" fill="#7A3E1C"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ceCamara)"/>`).join('')}
      ${cupins([[20, 259], [25, 256], [52, 267], [30, 297], [26, 294], [60, 307]])}
      <path d="M604 ${f1(supY(604) + 1)} C600 250 612 262 606 274 C600 286 614 296 610 310 M606 274 C618 276 626 272 632 280 M610 310 C620 312 628 308 636 316" stroke="#7A3E1C" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M604 ${f1(supY(604) + 1)} C600 250 612 262 606 274 C600 286 614 296 610 310 M606 274 C618 276 626 272 632 280 M610 310 C620 312 628 308 636 316" stroke="#2A1206" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${[[606, 274, 7, 4], [632, 280, 7, 4.2], [610, 310, 8, 4.5], [636, 316, 6, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + 1.4}" ry="${ry + 1.4}" fill="#7A3E1C"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ceCamara)"/>`).join('')}
      ${formiga(606, 274, 10)}${formiga(632, 281, -20)}${formiga(611, 310, 0)}${formiga(603, 290, 70)}
      <g fill="#F6EEDC" stroke="#B8A47A" stroke-width=".5">${[[634, 316], [638, 317], [636, 314]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1.1"/>`).join('')}</g>
      <g transform="translate(306 252) scale(1.15)"><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#A8987A" stroke-width="8.6" fill="none" stroke-linecap="round"/><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#FFF4E0" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#CDB894" stroke-width="6.6" fill="none" stroke-dasharray=".8 2.6"/><path d="M-5 -1 l-2 3 M-3 -3 l-1 3.4 M-1 -4 l0 3.4" stroke="#8A5A2A" stroke-width=".8" stroke-linecap="round"/><circle cx="-8" cy="-3" r="3.4" fill="#E0882E" stroke="#8A4A12" stroke-width=".8"/><circle cx="-9" cy="-4" r=".8" fill="#3A1A08"/></g>
      <g fill="#5A3A1C" stroke="#2E1A0A" stroke-width=".5">${Array.from({length:10}, () => { const [x, y] = emSolo(.04, .14, 20, 550); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2" ry="1.2" transform="rotate(${f0(R(-40, 40))} ${f1(x)} ${f1(y)})"/>`; }).join('')}</g>
    </g>`;

  /* ---------- bichos ---------- */
  const arara = (x, y, d) => `<g transform="translate(${x} ${y})">
      <path d="M-8 1 C-20 6 -32 11 -46 16 C-44 12 -40 8 -36 6 C-28 2 -18 -2 -8 -4Z" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.2" stroke-linejoin="round"/><path d="M-10 0 C-22 6 -32 10 -42 14" stroke="#5FA8F0" stroke-width="1" fill="none"/><path d="M-9 2 C-18 7 -26 10 -34 12 C-28 8 -18 4 -9 1Z" fill="#F7B21E" stroke="#12235A" stroke-width=".8"/>
      <ellipse cx="0" cy="0" rx="13.5" ry="7.2" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.4"/>
      <path d="M-9 2.5 C-3 9 8 8.6 12.6 2 C6 4 -2 5 -9 2.5Z" fill="url(#ceArAm)" stroke="#12235A" stroke-width="1"/>
      <circle cx="13" cy="-3" r="6.6" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.4"/><path d="M10 -9 C13 -10.4 16 -10 18 -8" stroke="#6CC04A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="15.4" cy="-1.6" rx="3.8" ry="3.2" fill="#F6F6F2" stroke="#12235A" stroke-width=".6"/><path d="M13.2 -.2 q1.6 .6 3.2 0 M13.4 1.2 q1.4 .5 2.8 0" stroke="#12235A" stroke-width=".5" fill="none"/><circle cx="15" cy="-3" r="1.4" fill="#12235A"/><circle cx="15.4" cy="-3.4" r=".5" fill="#fff"/>
      <path d="M18 -5 C24 -6 26 0 21.6 4 C21.4 1 20.4 -.4 18.4 -.6Z" fill="#1E1E28" stroke="#0A0A12" stroke-width=".8"/><path d="M19 -4 q2.6 -.4 4 1.6" stroke="#6E6E80" stroke-width=".7" fill="none"/>
      <g class="asa" style="animation-delay:${d}s"><path d="M-7 -2 C-4 -16 6 -22 14 -20 C10 -15 7 -9 5 -2Z" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.3" stroke-linejoin="round"/><path d="M-2 -10 C2 -16 8 -19 12 -19 M-4 -6 C0 -12 6 -15 10 -15" stroke="#12235A" stroke-width=".7" fill="none" opacity=".7"/><path d="M-6 -3 C-3 -10 2 -13 6 -13" stroke="#8CC8FF" stroke-width="1.2" fill="none" stroke-linecap="round"/></g></g>`;
  const seriema = `<g id="ce-seriema" class="toque" transform="translate(22 166)"><g id="ce-seri-in">
      <ellipse cx="0" cy="1" rx="13" ry="2.4" fill="#2E1A0A" opacity=".3"/>
      <path d="M-3 -22 L-5 0 M3 -22 L5 0" stroke="#8E2A16" stroke-width="3.6" stroke-linecap="round"/><path d="M-3 -22 L-5 0 M3 -22 L5 0" stroke="#E04A2E" stroke-width="2.2" stroke-linecap="round"/><path d="M-9 0 h7 M2 0 h7" stroke="#B83A22" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-11 -32 C-22 -31 -30 -25 -36 -15 C-34 -13 -31 -13 -29 -15 C-24 -21 -17 -24 -10 -25Z" fill="url(#ceSeriCauda)" stroke="#3E2E1E" stroke-width="1.3" stroke-linejoin="round"/><path d="M-22 -28 l3 4 M-27 -23 l3 4" stroke="#2E2014" stroke-width="2" stroke-linecap="round"/><path d="M-36 -15 l3 2" stroke="#F4ECDC" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="-2" cy="-30" rx="13.5" ry="9.4" fill="url(#ceSeriCorpo)" stroke="#3E2E1E" stroke-width="1.6"/>
      <path d="M-12 -33 C-6 -36 2 -36 6 -33 C2 -28 -6 -26 -12 -28Z" fill="#8E7454" stroke="#3E2E1E" stroke-width="1"/><path d="M-10 -31 q3 2 6 1 M-6 -29 q3 2 6 1 M-2 -32 q2 2 5 1" stroke="#5E4A34" stroke-width=".8" fill="none"/>
      <path d="M2 -24 q3 -2 6 -1 M-2 -22 q3 -1 5 0" stroke="#F4ECDC" stroke-width="1" fill="none" opacity=".8"/>
      <g id="ce-seri-cab"><path d="M6 -34 C9 -40 9 -46 11 -52" stroke="#3E2E1E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M6 -34 C9 -40 9 -46 11 -52" stroke="#E2CEAA" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M7 -37 l2 -1 M8 -42 l2 -1 M9 -47 l2 -1" stroke="#A88A64" stroke-width=".8"/>
        <circle cx="12" cy="-53" r="5.8" fill="url(#ceSeriCab)" stroke="#3E2E1E" stroke-width="1.4"/>
        <path d="M14 -58 C11 -64 7 -67 2 -68 M14.6 -58 C14 -65 11 -69 7 -72 M15.2 -58 C16 -65 15 -69 12 -73" stroke="#3E2E1E" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M14 -58 C11 -64 7 -67 2 -68 M14.6 -58 C14 -65 11 -69 7 -72 M15.2 -58 C16 -65 15 -69 12 -73" stroke="#8E7454" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <circle cx="13.8" cy="-54" r="3" fill="#7AB4F0" stroke="#2E4A8A" stroke-width=".6"/><circle cx="13.8" cy="-54" r="2" fill="#FFF6D8"/><circle cx="14.2" cy="-54" r="1.1" fill="#12235A"/><circle cx="14.6" cy="-54.5" r=".45" fill="#fff"/>
        <path id="ce-seri-bico" d="M16 -55.5 C20 -55.6 23.6 -54 25 -51.6 C22 -51.4 19 -50.6 16 -50.4Z" fill="#E0553A" stroke="#8E2A16" stroke-width="1" stroke-linejoin="round"/><path d="M17 -54.4 q3 0 5.6 1.6" stroke="#FF9A7A" stroke-width=".7" fill="none"/></g></g><rect x="-38" y="-76" width="66" height="80" fill="transparent"/></g>`;
  const borboleta = (id, cor, cor2) => `<g id="${id}" class="toque ce-borb"><g class="ce-asas"><path d="M0 0 C-10 -13 -17 -5 -13 1 C-15 8 -6 10 0 2Z" fill="${cor}" stroke="#12235A" stroke-width="1.1"/><path d="M0 0 C10 -13 17 -5 13 1 C15 8 6 10 0 2Z" fill="${cor}" stroke="#12235A" stroke-width="1.1"/><path d="M-1 -1 C-8 -10 -14 -6 -12.4 -1 M1 -1 C8 -10 14 -6 12.4 -1" stroke="${cor2}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="-9" cy="-4" r="1.8" fill="#fff" stroke="#12235A" stroke-width=".5"/><circle cx="9" cy="-4" r="1.8" fill="#fff" stroke="#12235A" stroke-width=".5"/><circle cx="-7" cy="4" r="1.1" fill="${cor2}"/><circle cx="7" cy="4" r="1.1" fill="${cor2}"/></g><path d="M0 -4 V5" stroke="#12235A" stroke-width="2" stroke-linecap="round"/><path d="M0 -4 q-2 -4 -4 -5 M0 -4 q2 -4 4 -5" stroke="#12235A" stroke-width=".7" fill="none"/><rect x="-16" y="-14" width="32" height="26" fill="transparent"/></g>`;
  const NASC = [{ x:618, y:262, yf:288, nome:'São Francisco', fala:'Nasceu o Rio São Francisco! Ele atravessa o sertão e leva água para milhões de pessoas.' }, { x:676, y:303, yf:314, nome:'Paraná', fala:'Nasceu o Rio Paraná! Suas águas movem usinas que fazem energia para muitas cidades.' }, { x:736, y:329, yf:338, nome:'Tocantins', fala:'Nasceu o Rio Tocantins! Ele corre para o norte e vai encontrar a Amazônia.' }];

  /* ---------- fundo: serras, chapada, campo distante ---------- */
  semente = 74;
  const MESA = 'M428 236 L436 196 L441 170 L445 148 L451 134 L470 127 L560 125 L640 123 L702 122 L716 128 L724 150 L732 178 L740 206 L760 222 L800 232 V272 H428Z';
  const faixas = [[136, 10, '#F6C690'], [156, 7, '#C8764A'], [176, 13, '#ECAA72'], [198, 7, '#B8653C'], [214, 11, '#D99560']].map(([y, h, cor]) => { let top = `M420 ${y}`, bot = ''; for (let x = 440; x <= 820; x += 40) top += ` Q${x - 20} ${f1(y + R(-2.5, 2.5))} ${x} ${f1(y + R(-1.5, 1.5))}`; bot = ` L820 ${y + h} L420 ${y + h}Z`; return `<path d="${top}${bot}" fill="${cor}" opacity=".75"/><path d="${top}" stroke="#FFE2BC" stroke-width="1.3" fill="none" opacity=".55"/><path d="M420 ${y + h} H820" stroke="#8A4426" stroke-width="1.2" opacity=".45"/>`; }).join('');
  const juntas = Array.from({length:16}, () => { const x = R(458, 712), y0 = R(124, 150), y1 = y0 + R(30, 90); let d = `M${f1(x)} ${f1(y0)}`, xx = x; for (let y = y0 + 10; y < y1; y += 10) { xx += R(-1.6, 1.6); d += ` L${f1(xx)} ${f1(y)}`; } return `<path d="${d}" stroke="#8A4428" stroke-width="1.5" fill="none" opacity=".6"/><path d="${d}" transform="translate(1.6 0)" stroke="#FFD2A4" stroke-width="1" fill="none" opacity=".45"/>`; }).join('');
  const arbusto = (x, y, r) => `<path d="${copa(x, y, r, r * .72, 7, .3)}" fill="url(#ceArb)" stroke="#3E6A22" stroke-width="1"/><path d="M${f1(x - r * .5)} ${f1(y - r * .25)} q${f1(r * .3)} ${f1(-r * .4)} ${f1(r * .7)} ${f1(-r * .3)}" stroke="#D6F0A8" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  const topoMesa = Array.from({length:30}, (_, k) => 452 + k * 9).filter(x => x < 626 || x > 650).map(x => { const r = R(3.5, 7); return arbusto(x + R(-3, 3), (x < 470 ? 131 : x > 704 ? 124 : 125) - r * .35, r); }).join('') + [[536, 116], [668, 114]].map(([x, y]) => `<path d="M${x} 124 q-1 -5 1 -9 M${x} 118 q3 -2 5 -5" stroke="#4E321C" stroke-width="1.6" fill="none"/>${arbusto(x - 2, y - 2, 6)}${arbusto(x + 6, y - 4, 5)}`).join('');
  const ressaltos = [[470, 152], [520, 172], [586, 150], [700, 170], [552, 196], [680, 196]].map(([x, y]) => arbusto(x, y, R(3, 4.5))).join('');
  const longe = Array.from({length:22}, () => { const x = R(6, 436), y = R(200, 208), r = R(4, 8); return `<path d="M${f1(x)} ${f1(y + r)} v5" stroke="#6E7A62" stroke-width="1.2"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .62)}" fill="${umDe(['#8EA884', '#9AB08A', '#86A07E', '#A4B48C'])}"/><ellipse cx="${f1(x - r * .25)}" cy="${f1(y - r * .25)}" rx="${f1(r * .5)}" ry="${f1(r * .28)}" fill="#C4D4AE" opacity=".6"/>`; }).join('');
  const pocas = [[600, 246, 13], [700, 282, 12], [778, 292, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * .3)}" fill="url(#cePoca)" stroke="#2E7A5A" stroke-width="1"/><path d="M${x - r * .5} ${y - 1} h${f1(r * .5)}" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`).join('');

  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Corte do Cerrado com chapada, ipê-amarelo, cupinzeiro com seriema, raízes profundas, água guardada debaixo da terra e nascentes na vereda">
    <defs>
      <linearGradient id="ceCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA6EE"/><stop offset=".45" stop-color="#A6D8F6"/><stop offset=".75" stop-color="#E4F2F2"/><stop offset="1" stop-color="#FFE2B0"/></linearGradient>
      <radialGradient id="ceSolBrilho"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset=".35" stop-color="#FFE27A" stop-opacity=".4"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
      <radialGradient id="ceSolDisco" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".6" stop-color="#FFD84D"/><stop offset="1" stop-color="#FFB52E"/></radialGradient>
      <linearGradient id="ceMesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B07A"/><stop offset=".5" stop-color="#DC8C58"/><stop offset="1" stop-color="#B0603A"/></linearGradient>
      <linearGradient id="ceNeblina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8F2F6" stop-opacity="0"/><stop offset=".6" stop-color="#E8F2F6" stop-opacity=".12"/><stop offset="1" stop-color="#F4EEDC" stop-opacity=".55"/></linearGradient>
      <linearGradient id="ceQueda" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8DDF4"/><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#8CCDEE"/></linearGradient>
      <radialGradient id="ceNevoa"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="ceArb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C4E08C"/><stop offset=".55" stop-color="#7EA84C"/><stop offset="1" stop-color="#4E7A2E"/></radialGradient>
      <linearGradient id="ceCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCD498"/><stop offset="1" stop-color="#C8B666"/></linearGradient>
      <linearGradient id="ceVereda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6DC74"/><stop offset=".6" stop-color="#6CB250"/><stop offset="1" stop-color="#3E8A3E"/></linearGradient>
      <radialGradient id="cePoca" cx=".4" cy=".35"><stop offset="0" stop-color="#C8F0FF"/><stop offset="1" stop-color="#3E9ACC"/></radialGradient>
      <linearGradient id="ceSoloB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8643A"/><stop offset=".6" stop-color="#B0542C"/><stop offset="1" stop-color="#8E4220"/></linearGradient>
      <linearGradient id="ceSoloA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2614"/><stop offset=".7" stop-color="#6E3A1E"/><stop offset="1" stop-color="#8E4A26"/></linearGradient>
      <linearGradient id="ceSoloC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2854A"/><stop offset=".6" stop-color="#DC9A5C"/><stop offset="1" stop-color="#C88A56"/></linearGradient>
      <linearGradient id="ceSoloD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C89A68"/><stop offset="1" stop-color="#A8804E"/></linearGradient>
      <radialGradient id="ceSx1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4E6"/><stop offset=".6" stop-color="#E2CDB4"/><stop offset="1" stop-color="#A8907A"/></radialGradient>
      <radialGradient id="ceSx2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C87A56"/><stop offset=".6" stop-color="#8E3E22"/><stop offset="1" stop-color="#5A2210"/></radialGradient>
      <radialGradient id="ceSx3" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#DCDAD4"/><stop offset=".6" stop-color="#9A968E"/><stop offset="1" stop-color="#666258"/></radialGradient>
      <radialGradient id="ceCamara" cx=".5" cy=".4"><stop offset="0" stop-color="#7A4220"/><stop offset="1" stop-color="#4A2410"/></radialGradient>
      <linearGradient id="ceAq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6E4FF"/><stop offset=".3" stop-color="#4AA8F0"/><stop offset="1" stop-color="#1A58BC"/></linearGradient>
      <radialGradient id="ceGr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF2D8"/><stop offset=".55" stop-color="#DDB884"/><stop offset="1" stop-color="#9A7444"/></radialGradient>
      <radialGradient id="ceGr2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F4F0EA"/><stop offset=".55" stop-color="#BEB4A6"/><stop offset="1" stop-color="#7E7466"/></radialGradient>
      <pattern id="ceGraos" width="28" height="20" patternUnits="userSpaceOnUse"><ellipse cx="6.5" cy="6" rx="5.4" ry="4.4" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><ellipse cx="19" cy="4.6" rx="4.2" ry="3.4" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".9"/><ellipse cx="13" cy="14.6" rx="4.8" ry="3.9" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><ellipse cx="24.6" cy="14.4" rx="3.3" ry="3" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><circle cx="3" cy="16.4" r="2.2" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".7"/></pattern>
      <pattern id="ceGraos2" width="61" height="43" patternUnits="userSpaceOnUse"><ellipse cx="14" cy="10" rx="8" ry="6" fill="url(#ceGr2)" stroke="#5E5446" stroke-width="1"/><ellipse cx="44" cy="30" rx="9" ry="6.6" fill="url(#ceGr)" stroke="#7A5630" stroke-width="1"/><ellipse cx="50" cy="8" rx="5.4" ry="4.2" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".9"/><ellipse cx="20" cy="34" rx="4.6" ry="3.6" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/></pattern>
      <clipPath id="ceAqClip"><path d="M0 396 Q200 386 400 398 T800 392 V500 H0Z"/></clipPath>
      <clipPath id="ceSoloClip"><path d="${SOLOD} V500 H0Z"/></clipPath>
      <clipPath id="ceMesaClip"><path d="${MESA}"/></clipPath>
      <linearGradient id="ceRaiz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2610"/><stop offset=".4" stop-color="#8E5A32"/><stop offset="1" stop-color="#3E200C"/></linearGradient>
      <linearGradient id="ceCaR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A3A20"/><stop offset=".4" stop-color="#B07448"/><stop offset="1" stop-color="#5A2E16"/></linearGradient>
      <linearGradient id="ceCaC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A6C58"/><stop offset=".4" stop-color="#C6B698"/><stop offset="1" stop-color="#5E5240"/></linearGradient>
      <linearGradient id="ceCaE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2E1A"/><stop offset=".4" stop-color="#946A48"/><stop offset="1" stop-color="#3A2212"/></linearGradient>
      <linearGradient id="ceCaI" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E4236"/><stop offset=".4" stop-color="#8E8070"/><stop offset="1" stop-color="#3A3028"/></linearGradient>
      <radialGradient id="ceCoIpe" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4B0"/><stop offset=".45" stop-color="#FFD43A"/><stop offset=".85" stop-color="#F0A818"/><stop offset="1" stop-color="#C87C0A"/></radialGradient>
      <radialGradient id="ceCoBa" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#EEF5A6"/><stop offset=".5" stop-color="#B6CC52"/><stop offset="1" stop-color="#7A962C"/></radialGradient>
      <radialGradient id="ceCoLx" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#E2EAD0"/><stop offset=".5" stop-color="#A3B68E"/><stop offset="1" stop-color="#6A805E"/></radialGradient>
      <radialGradient id="ceCoPt" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#DADC8E"/><stop offset=".5" stop-color="#9CA646"/><stop offset="1" stop-color="#626E28"/></radialGradient>
      <radialGradient id="ceCoCg" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#A8DCC2"/><stop offset=".5" stop-color="#4E9C7E"/><stop offset="1" stop-color="#245E4C"/></radialGradient>
      <radialGradient id="ceCoPq" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#CCEE90"/><stop offset=".5" stop-color="#7CB646"/><stop offset="1" stop-color="#44782A"/></radialGradient>
      <radialGradient id="ceFlorPq" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFDF0"/><stop offset="1" stop-color="#F2E2A8"/></radialGradient>
      <radialGradient id="ceFrutoPq" cx=".35" cy=".3"><stop offset="0" stop-color="#B8DC6A"/><stop offset=".6" stop-color="#6A9A2E"/><stop offset="1" stop-color="#3E6A1A"/></radialGradient>
      <radialGradient id="ceOuro" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF2A8"/><stop offset=".6" stop-color="#F2C230"/><stop offset="1" stop-color="#B8820E"/></radialGradient>
      <radialGradient id="ceChuv" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F4F0E2"/><stop offset="1" stop-color="#D8D0B4"/></radialGradient>
      <linearGradient id="ceCupim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8A86C"/><stop offset=".5" stop-color="#C2743E"/><stop offset="1" stop-color="#8A4824"/></linearGradient>
      <radialGradient id="ceMonte" cx=".45" cy=".2" r=".9"><stop offset="0" stop-color="#D89A60"/><stop offset=".7" stop-color="#A86434"/><stop offset="1" stop-color="#7A4220"/></radialGradient>
      <radialGradient id="ceToca" cx=".5" cy=".4"><stop offset="0" stop-color="#1A0A04"/><stop offset=".8" stop-color="#3A1C0C"/><stop offset="1" stop-color="#5A2E14"/></radialGradient>
      <linearGradient id="ceTatuCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8AE90"/><stop offset=".55" stop-color="#8E7460"/><stop offset="1" stop-color="#5E4A3A"/></linearGradient>
      <linearGradient id="ceArAz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA8F6"/><stop offset=".6" stop-color="#2A78DA"/><stop offset="1" stop-color="#1A4EA8"/></linearGradient>
      <linearGradient id="ceArAm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE06A"/><stop offset="1" stop-color="#F59A1E"/></linearGradient>
      <radialGradient id="ceSeriCorpo" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#EADCC2"/><stop offset=".6" stop-color="#BCA07A"/><stop offset="1" stop-color="#7E6446"/></radialGradient>
      <linearGradient id="ceSeriCauda" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8060"/><stop offset="1" stop-color="#5E4A34"/></linearGradient>
      <radialGradient id="ceSeriCab" cx=".4" cy=".35"><stop offset="0" stop-color="#F4E8D2"/><stop offset="1" stop-color="#C6AE88"/></radialGradient>
      <radialGradient id="ceVinheta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#2E1A0A" stop-opacity="0"/><stop offset="1" stop-color="#2E1A0A" stop-opacity=".34"/></radialGradient>
      <filter id="ceGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#ceCeu)"/>
    <circle cx="380" cy="54" r="120" fill="url(#ceSolBrilho)"/>
    <g id="ce-sol" class="toque"><g class="gira-lento" style="transform-box:fill-box;transform-origin:center"><path d="${Array.from({length:12}, (_, k) => { const a = k * Math.PI / 6; return `M${(380 + Math.cos(a) * 40).toFixed(1)} ${(54 + Math.sin(a) * 40).toFixed(1)} L${(380 + Math.cos(a) * 54).toFixed(1)} ${(54 + Math.sin(a) * 54).toFixed(1)}`; }).join(' ')}" stroke="#FFD24A" stroke-width="5" stroke-linecap="round"/></g><circle cx="380" cy="54" r="32" fill="url(#ceSolDisco)" stroke="#F0A81E" stroke-width="3"/><path d="M362 44 q8 -10 22 -10" stroke="#FFF8D6" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="380" cy="54" r="58" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="560" y="30" width="110" height="52" style="color:#fff" opacity=".85"/><use href="#nuvem" x="40" y="22" width="80" height="38" style="color:#fff" opacity=".65"/><use href="#nuvem" x="250" y="118" width="70" height="30" style="color:#fff" opacity=".45"/></g>
    <g id="ce-araras" class="toque"><g id="ce-araras-in">${arara(0, 0, 0)}${arara(46, 14, -.16)}</g></g>
    <path d="M0 184 L60 160 L140 168 L200 150 L270 166 L340 148 L420 160 L500 150 L600 166 L800 170 V260 H0Z" fill="#CFC6E2" opacity=".7"/>
    <path d="M0 196 L40 176 L170 172 L196 186 L300 182 L330 168 L470 164 L500 180 L800 190 V260 H0Z" fill="#AEA8CC" opacity=".75"/>
    <g>
      <path d="${MESA}" fill="url(#ceMesa)"/>
      <g clip-path="url(#ceMesaClip)">
        ${faixas}${juntas}
        <path d="M420 120 H820 V138 C700 134 560 136 420 140Z" fill="#8A3E1E" opacity=".28"/>
        <path d="M428 236 L436 196 L441 170 L445 148 L451 134 L470 127 L478 140 L470 180 L462 236Z" fill="#FFE2BC" opacity=".3"/>
        <path d="M694 122 L716 128 L724 150 L732 178 L740 206 L760 222 L800 232 V272 H704 L708 220 L702 170 L698 140Z" fill="#6A2414" opacity=".32"/>
        <path d="M424 222 C500 214 560 230 640 218 C700 212 760 226 820 230 V280 H424Z" fill="#D9A07A" opacity=".55"/>
        ${Array.from({length:18}, () => `<ellipse cx="${f1(R(432, 790))}" cy="${f1(R(224, 240))}" rx="${f1(R(2, 5))}" ry="${f1(R(1.4, 3))}" fill="${umDe(['#B8653C', '#E8B88E', '#9A4E2C'])}" stroke="#7A3A1E" stroke-width=".6"/>`).join('')}
        <rect x="420" y="110" width="400" height="170" fill="url(#ceNeblina)"/>
      </g>
      <path d="${MESA}" fill="none" stroke="#8A4A26" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M445 148 L451 134 L470 127 L560 125 L640 123 L702 122 L716 128" stroke="#6E9E44" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${topoMesa}
    </g>
    <g id="ce-cachoeira" class="toque">
      <path d="M622 124 C620 160 618 190 620 216 L654 216 C652 190 650 160 650 124Z" fill="#6A2E16" opacity=".35"/>
      <path d="M636 124 C628 121 618 121 600 122" stroke="#7FC8EC" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M628 124 C631 150 626 182 628 214 L646 214 C643 182 647 150 643 124Z" fill="url(#ceQueda)" stroke="#9ED6F2" stroke-width="1"/>
      <path class="ce-flui" d="M632 126 C634 150 630 180 632 212" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-dasharray="10 8" stroke-linecap="round"/>
      <path class="ce-flui" d="M637 126 C639 150 635 182 637 212" stroke="#7FCDEB" stroke-width="2.6" fill="none" stroke-dasharray="8 10" stroke-linecap="round"/>
      <path class="ce-flui" d="M641 126 C642 152 640 182 642 212" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-dasharray="6 12" stroke-linecap="round"/>
      <path d="M640 220 C644 230 638 238 646 248" stroke="#6FC0EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="637" cy="218" rx="19" ry="5" fill="url(#cePoca)" stroke="#3E8ABE" stroke-width="1"/>
      <g fill="#fff"><ellipse cx="630" cy="215" rx="6" ry="2.6"/><ellipse cx="643" cy="215.5" rx="5" ry="2.2"/><circle cx="623" cy="212" r="1.6"/><circle cx="651" cy="211" r="1.4"/><circle cx="637" cy="210" r="1.8"/></g>
      <g opacity=".85"><g style="animation:flutua 2.4s ease-in-out infinite alternate"><circle cx="626" cy="206" r="12" fill="url(#ceNevoa)"/><circle cx="648" cy="204" r="11" fill="url(#ceNevoa)"/></g><g style="animation:flutua 3.1s ease-in-out -1s infinite alternate"><circle cx="637" cy="198" r="14" fill="url(#ceNevoa)" opacity=".7"/><circle cx="614" cy="214" r="8" fill="url(#ceNevoa)"/><circle cx="660" cy="214" r="8" fill="url(#ceNevoa)"/></g></g>
      <rect x="614" y="118" width="46" height="104" fill="transparent"/></g>
    <path d="M0 206 Q120 198 240 204 T480 200 L560 202 V228 H0Z" fill="url(#ceCampo)"/>
    <g opacity=".85">${longe}</g>
    <path d="M0 206 Q120 198 240 204 T480 200 L560 202 V228 H0Z" fill="#F4EEDC" opacity=".18"/>
    <path d="M560 230 C640 236 700 262 800 270 V350 H560Z" fill="url(#ceVereda)" stroke="#4E8A3A" stroke-width="2"/>
    <path d="M560 232 C640 238 700 264 800 272" stroke="#D2F0A8" stroke-width="2" fill="none" opacity=".7"/>
    ${pocas}
    <g>${[[588, 168, .56, 0], [652, 184, .5, -1.2], [770, 194, .54, -2.3]].map(([x, y, sc, d]) => `<g class="balanca" style="animation-delay:${d}s"><svg x="${x - 50 * sc}" y="${y}" width="${100 * sc}" height="${150 * sc}" viewBox="0 0 100 150"><use class="sem" href="#f-buriti"/></svg></g>`).join('')}</g>
    <g stroke-width="1.8" fill="none" stroke-linecap="round">${[592, 612, 628, 648, 664, 690, 712, 730, 752, 774, 792].map(x => tufoD(x, +f1(supY(x) - 4 - (x > 640 ? 6 : 2) - (x - 560) * .1), R(10, 16), ['#3E7A2A', '#5E9A3A', '#2E6A22'], 5)).join('')}</g>
    <path d="${SOLOD} V500 H0Z" fill="url(#ceSoloB)"/>
    <g clip-path="url(#ceSoloClip)">
      <path d="${camada(HC, true)}" fill="url(#ceSoloC)"/>
      <path d="${regiaoB2}" fill="url(#ceSoloD)" opacity=".7"/>
      ${listras}${nodulos}${manchas}
      <path d="${liso(HC)}" stroke="#7A3418" stroke-width="2" fill="none" opacity=".5"/>
      ${linhaSeixos}${pedras}
      <path d="${regiaoA}" fill="url(#ceSoloA)"/>
      <path d="${liso(HA)}" stroke="#3A1A0A" stroke-width="1.6" fill="none" opacity=".5"/>
      ${humus}
      <path d="${raizinhas}" stroke="#2A140A" stroke-width=".8" fill="none" opacity=".55"/>
      <path d="${SOLOD} L800 352 C740 346 700 332 656 302 C616 272 596 240 560 240 H0Z" fill="#1E1E1A" opacity=".22"/>
      ${vidaSolo}
    </g>
    <path d="${SOLOD}" stroke="#4A2A14" stroke-width="2.4" fill="none"/>
    <path d="M0 ${SUP + 1} H560" stroke="#E8C870" stroke-width="2" opacity=".7"/>
    ${serrapilheira}
    <g stroke-width="1.6" fill="none" stroke-linecap="round" pointer-events="none">${capim}${dourado}${chuveirinho}</g>
    <g pointer-events="none">${florzinhas}${cupinzinho(214, 20, 9)}${cupinzinho(396, 26, 10)}${cupinzinho(578, 16, 8)}</g>
    <g clip-path="url(#ceAqClip)"><rect x="0" y="380" width="800" height="120" fill="#7A5A3A"/><rect id="ce-aq" x="0" y="${AQ0}" width="800" height="130" fill="url(#ceAq)"/><rect x="0" y="380" width="800" height="120" fill="url(#ceGraos)" opacity=".9"/><rect x="7" y="383" width="800" height="120" fill="url(#ceGraos2)" opacity=".85"/>
      <g id="ce-aq-onda"><path d="M0 ${AQ0} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#F0FAFF" stroke-width="2.8" fill="none"/><path d="M0 ${AQ0 + 2} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5AB8F6" stroke-width="2" fill="none" opacity=".7"/><path d="M10 ${AQ0 + 16} q30 -6 60 0 t60 0 M200 ${AQ0 + 22} q30 -6 60 0 t60 0 M420 ${AQ0 + 14} q30 -6 60 0 t60 0 M630 ${AQ0 + 20} q30 -6 60 0 t60 0 M110 ${AQ0 + 40} q30 -6 60 0 M330 ${AQ0 + 44} q30 -6 60 0 M540 ${AQ0 + 38} q30 -6 60 0" stroke="#D8F4FF" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/><g fill="#E8F8FF" opacity=".8">${[60, 180, 300, 470, 590, 720].map(x => `<circle cx="${x}" cy="${AQ0 + 10 + (x % 7) * 3}" r="1.8"/><circle cx="${x + 8}" cy="${AQ0 + 24 + (x % 5) * 2}" r="1.2"/>`).join('')}</g></g></g>
    <path d="M0 396 Q200 386 400 398 T800 392" stroke="#4A2A14" stroke-width="3.2" fill="none"/><path d="M0 399 Q200 389 400 401 T800 395" stroke="#F2D4A8" stroke-width="1.4" fill="none" opacity=".45"/>
    <rect id="ce-aq-toque" class="toque" x="0" y="398" width="800" height="102" fill="transparent"/>
    <text x="16" y="488" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="#fff" stroke="#12235A" stroke-opacity=".55" stroke-width="3.4" paint-order="stroke">Água guardada debaixo da terra</text>
    <g id="ce-raizes" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="ce-toca" class="toque"><path d="M668 294 C674 320 684 338 694 352" stroke="#8A4A26" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M668 294 C674 320 684 338 694 352" stroke="#2A1408" stroke-width="12.5" fill="none" stroke-linecap="round"/><path d="M664 296 C670 318 678 334 688 348" stroke="#5A2E14" stroke-width="2" fill="none" opacity=".8"/><path d="M660 294 q8 -6 16 0" stroke="#C8855A" stroke-width="2" fill="none" stroke-linecap="round"/><g transform="translate(244 62)"><ellipse cx="456" cy="305" rx="43" ry="22.5" fill="#8A4A26"/><ellipse cx="456" cy="304" rx="40" ry="20" fill="url(#ceToca)"/><path d="M420 296 C430 284 482 284 492 296" stroke="#B8764A" stroke-width="1.8" fill="none" opacity=".7"/><path d="M420 318 q10 4 20 2 q12 3 24 0 q14 3 26 -2" stroke="#C8A050" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M426 320 l5 -3 M446 321 l4 -3 M470 321 l5 -3 M484 318 l3 -3" stroke="#E0BC66" stroke-width="1.2" stroke-linecap="round"/>
      <g id="ce-tatu"><path d="M406 311 C412 314 418 314 424 312" stroke="#5E4A3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M406 311 C412 314 418 314 424 312" stroke="#A88A70" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="2.4 1.4"/>
        <path d="M422 318 C420 298 438 286 458 288 C478 289 490 302 488 318Z" fill="url(#ceTatuCasco)" stroke="#3A2A1E" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M440 291 C436 301 436 311 438 318 M450 289 C448 300 448 310 449 318 M460 289 C460 300 461 310 462 318 M470 292 C472 302 472 310 472 318" stroke="#4E3A2A" stroke-width="1.5" fill="none"/>
        <path d="M442 291 C438 301 438 311 440 317 M452 289 C450 300 450 310 451 317 M462 289 C462 300 463 310 464 317 M472 292 C474 302 474 310 474 317" stroke="#E2CCAE" stroke-width=".8" fill="none" opacity=".8"/>
        <g fill="#E2CCAE" opacity=".7">${[[428, 304], [432, 298], [430, 311], [480, 302], [482, 310], [477, 296]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g>
        <path d="M424 315 C440 319 470 319 487 315" stroke="#E8D4B4" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M486 313 C492 306 500 302 507 302 C507 307 500 313 489 318Z" fill="#C9A884" stroke="#3A2A1E" stroke-width="1.4" stroke-linejoin="round"/><circle cx="507" cy="303" r="1.4" fill="#5E3A2A"/>
        <path d="M490 304 c-1 -5 2 -8 5 -7 c1 3 -1 6 -5 7Z" fill="#B89474" stroke="#3A2A1E" stroke-width="1.1"/>
        <path d="M494 308 q2.2 1.8 4.4 0" stroke="#12235A" stroke-width="1.4" fill="none" stroke-linecap="round"/><ellipse cx="499" cy="311" rx="2" ry="1.1" fill="#F2A08A" opacity=".7"/>
        <path d="M480 318 l2 3 M483 318 l2.6 2.6 M486 317 l3 2" stroke="#3A2A1E" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M444 293 q8 -4 18 -3" stroke="#F2E2C8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/></g>
      <g id="ce-zzz" font-family="Baloo 2, sans-serif" font-weight="800" fill="#FFF1D6" stroke="#5A2E14" stroke-width="1.6" paint-order="stroke"><text x="496" y="288" font-size="11">z</text><text x="504" y="278" font-size="14">z</text></g><rect x="410" y="270" width="96" height="58" fill="transparent"/></g></g>
    <g id="ce-minhoca" class="toque"><path id="ce-minh0" d="" stroke="#9A3A56" stroke-width="8" fill="none" stroke-linecap="round"/><path id="ce-minh" d="" stroke="#F09AAA" stroke-width="6" fill="none" stroke-linecap="round"/><path id="ce-minh2" d="" stroke="#B24A62" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="1 5"/><rect x="186" y="256" width="70" height="30" fill="transparent"/></g>
    <g id="ce-arvores"></g>
    <g id="ce-buracos"></g>
    <g stroke-width="1.5" fill="none" stroke-linecap="round" pointer-events="none">${capimFrente}</g>
    <g id="ce-flores"></g>
    <g id="ce-cupim" class="toque"><ellipse cx="30" cy="${SUP + 2}" rx="30" ry="4" fill="#2E1A0A" opacity=".3"/>
      <path d="M-2 ${SUP + 3} C0 212 2 200 4 190 C5 182 8 176 9 170 C10 164 13 160 17 161 C20 156 26 157 28 162 C32 168 34 178 37 188 C39 196 43 204 45 211 C46 216 48 ${SUP} 50 ${SUP + 3}Z" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="2" stroke-linejoin="round"/>
      <path d="M34 196 C40 188 46 190 47 198 C48 206 47 214 46 ${SUP}" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M6 200 q6 -4 12 0 M22 186 q5 -3 10 1 M12 212 q8 -3 16 0 M10 178 q4 -2 8 0 M28 206 q6 -3 12 0" stroke="#8E5228" stroke-width="1.4" fill="none"/>
      ${[[18, 182, 2.8, 2.1], [34, 202, 3, 2.3], [10, 206, 2.6, 1.9], [26, 214, 2.2, 1.6], [42, 206, 2, 1.6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + .9}" ry="${ry + .9}" fill="#E8A878"/><ellipse cx="${x}" cy="${y - .4}" rx="${rx}" ry="${ry}" fill="#2E1408"/>`).join('')}
      <g fill="#A86030">${[[8, 192], [14, 196], [30, 192], [24, 200], [16, 218], [36, 214], [20, 172], [4, 214]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g>
      <path d="M7 186 C8 176 11 168 15 164" stroke="#F6CC9C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M44 ${SUP} q-2 -10 -8 -14 M44 ${SUP} q0 -10 3 -16 M44 ${SUP} q3 -7 8 -10" stroke="#B8962E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
    ${seriema}
    <path id="ce-lingua" d="M54 ${SUP - 18} Q44 ${SUP - 14} 36 ${SUP - 19}" stroke="#E0557A" stroke-width="2.6" fill="none" stroke-linecap="round" style="opacity:0"/>
    <g class="toque" data-fig="tamandua" id="ce-tamandua"><ellipse cx="94" cy="${SUP + 2}" rx="34" ry="4" fill="#2E1A0A" opacity=".28"/><svg x="50" y="${SUP - 52}" width="84" height="56" viewBox="0 0 150 100"><use href="#f-tamandua"/></svg>${brilhoHotspot(100, SUP - 48)}</g>
    <g class="toque" data-fig="lobo" id="ce-lobo" transform="translate(514 0)"><ellipse cx="0" cy="${SUP + 1}" rx="22" ry="3.4" fill="#2E1A0A" opacity=".28"/><g id="ce-lobo-in"><svg x="-30" y="${SUP - 66}" width="60" height="66" viewBox="0 0 120 130"><use href="#f-lobo"/></svg></g>${brilhoHotspot(0, SUP - 62)}</g>
    <g class="toque" data-fig="pequi" id="ce-pequi"><g id="ce-pequi-in"><path d="M540 ${SUP - 62} v8" stroke="#3E6A22" stroke-width="2"/><svg x="528" y="${SUP - 56}" width="26" height="26" viewBox="0 0 100 100"><use href="#f-pequi"/></svg></g></g>
    <g class="toque" data-fig="buriti"><svg x="708" y="196" width="60" height="90" viewBox="0 0 100 150"><use href="#f-buriti"/></svg>${brilhoHotspot(744, 206)}</g>
    <g id="ce-rios"></g>
    <g id="ce-nasc"></g>
    ${borboleta('ce-borb1', '#FF9A3D', '#C2410C')}${borboleta('ce-borb2', '#B57BFF', '#6D28D9')}
    <g id="ce-nuvem" class="toque" style="cursor:grab;opacity:0;transition:opacity .6s"><use href="#nuvem" x="-80" y="-40" width="160" height="82" style="color:#6F7A98"/><use href="#nuvem" x="-76" y="-37" width="152" height="76" style="color:#C3CBDD"/><use href="#nuvem" x="-50" y="-12" width="100" height="46" style="color:#D3DAE8"/><path d="M-34 -14 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="ce-olhos-n" fill="#12235A"><circle cx="-14" cy="6" r="3"/><circle cx="12" cy="6" r="3"/><path d="M-6 14 q6 5 12 0" stroke="#12235A" stroke-width="2.2" fill="none" stroke-linecap="round"/></g><rect x="-84" y="-46" width="168" height="94" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#ceVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#ceGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const gR = el(s, '#ce-raizes'), gA = el(s, '#ce-arvores'), gB = el(s, '#ce-buracos'), nuvem = el(s, '#ce-nuvem'), aq = el(s, '#ce-aq'), aqOnda = el(s, '#ce-aq-onda');
  /* raízes orgânicas: afinam até a ponta, têm radicelas e um fio de água que desce na chuva */
  const raizesDe = (x, sem) => { semente = sem; const out = []; for (let k = 0; k < 7; k++) { const curta = k >= 5, lado = k === 0 ? 0 : (k % 2 ? -1 : 1), alvo = k === 0 ? 394 : curta ? R(246, 272) : R(290, 384); let xx = x + lado * R(1, 4), yy = SUP + 4; const P = [[xx, yy]]; while (yy < alvo) { yy = Math.min(alvo, yy + R(14, 24)); xx += lado * (curta ? R(10, 18) : R(4, 12)) + R(-5, 5); P.push([xx, yy]); } if (P.length < 3) P.splice(1, 0, [(P[0][0] + P[1][0]) / 2 + R(-2, 2), (P[0][1] + P[1][1]) / 2]); out.push({ P, w: k === 0 ? 10 : curta ? R(3.4, 4.6) : R(5, 7.5) }); } return out; };
  function desenhaRaizes(a, anima){
    const rs = raizesDe(a.x, a.x); let finas = '', corpo = '', luz = '', agua = '';
    rs.forEach(({ P, w }) => {
      const n = P.length;
      for (let i = 1; i < n; i++) { const p = P[i], q = P[i - 1], dx = p[0] - q[0], dy = p[1] - q[1], base = Math.atan2(dy, dx); [-1, 1].forEach(sg => { if (R(0, 1) < .35) return; const ang = base + sg * R(.7, 1.25), L = R(7, 17) * (1 - i / n * .4), t = R(.2, .8), sx = q[0] + dx * t, sy = q[1] + dy * t, ex = sx + Math.cos(ang) * L, ey = sy + Math.sin(ang) * L + L * .25; finas += `M${f1(sx)} ${f1(sy)} Q${f1(sx + Math.cos(ang) * L * .6)} ${f1(sy + Math.sin(ang) * L * .6)} ${f1(ex)} ${f1(ey)} M${f1(ex)} ${f1(ey)} l${f1(R(-3, 3))} ${f1(R(2, 4))} `; }); }
      const [tx, ty] = ponta(P); finas += `M${f1(tx)} ${f1(ty)} l-3 4 M${f1(tx)} ${f1(ty)} l3 4 M${f1(tx)} ${f1(ty)} l0 5 `;
      corpo += `<path d="${tubo(P, w, .9)}" fill="url(#ceRaiz)" stroke="#2A1406" stroke-width="1.1"/>`;
      luz += `<path d="${liso(paralela(P, w, .9, -.42, 0).slice(0, Math.max(2, n - 1)))}" stroke="#D29A68" stroke-width="1.1" fill="none" opacity=".75"/>`;
      agua += `<path class="ce-rag" d="${liso(P)}" stroke="#9EE0FF" stroke-width="${f1(Math.max(1.3, w * .22))}" fill="none" stroke-dasharray="2.4 14" style="opacity:0;transition:opacity 1s"/>`;
    });
    const id = 'ceRm' + a.x;
    const mascara = anima ? `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="${SUP - 10}" width="800" height="300">${rs.map(r => `<path d="${liso(r.P)}" pathLength="100" stroke="#fff" stroke-width="46" fill="none" stroke-linecap="butt" style="stroke-dasharray:100 120;stroke-dashoffset:100;transition:stroke-dashoffset 2.2s ease-out"/>`).join('')}</mask>` : '';
    gR.insertAdjacentHTML('beforeend', `<g>${mascara}<g${anima ? ` mask="url(#${id})"` : ''}><path d="${finas}" stroke="#4A2812" stroke-width=".9" fill="none" opacity=".9"/>${corpo}${luz}${agua}</g></g>`);
    if (fase === 'chuva') gR.querySelectorAll('.ce-rag').forEach(molhaRaiz);
    if (anima) requestAnimationFrame(() => requestAnimationFrame(() => s.querySelectorAll(`#${id} path`).forEach(p => p.style.strokeDashoffset = '0')));
  }
  function molhaRaiz(p){ if (p.dataset.ok) return; p.dataset.ok = 1; p.style.opacity = .75; p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:900, iterations:Infinity }); }
  ARV.forEach((a, i) => {
    if (a.ipe) { gA.insertAdjacentHTML('beforeend', ipe(a.x)); desenhaRaizes(a, false); }
    else if (a.ok) { gA.insertAdjacentHTML('beforeend', arvore(a.x, false, i)); desenhaRaizes(a, false); }
    else gB.insertAdjacentHTML('beforeend', `<g class="toque ce-buraco" data-i="${i}"><path d="M${a.x-34} ${SUP+3} Q${a.x-20} ${SUP-8} ${a.x} ${SUP-9} Q${a.x+20} ${SUP-8} ${a.x+34} ${SUP+3} Z" fill="url(#ceMonte)" stroke="#5E3218" stroke-width="2" stroke-linejoin="round"/><ellipse cx="${a.x}" cy="${SUP-5}" rx="13" ry="3.6" fill="#3A1A08" stroke="#5E3218" stroke-width="1.2"/><path d="M${a.x-22} ${SUP-3} q6 -4 12 -4" stroke="#E8B07A" stroke-width="1.6" fill="none" stroke-linecap="round"/><g fill="#8A5028" stroke="#4E2A12" stroke-width=".6"><circle cx="${a.x-24}" cy="${SUP}" r="1.8"/><circle cx="${a.x+18}" cy="${SUP-2}" r="2.2"/><circle cx="${a.x+26}" cy="${SUP+1}" r="1.5"/><circle cx="${a.x-12}" cy="${SUP+1}" r="1.4"/></g><g style="animation:flutua .9s ease-in-out ${-i * .3}s infinite alternate"><ellipse cx="${a.x}" cy="${SUP-22}" rx="6" ry="7.6" fill="url(#ceMonte)" stroke="#4E321C" stroke-width="1.6"/><path d="M${a.x} ${SUP-29} c4 -6 10 -6 12 -4 c-4 0 -8 2 -12 4" fill="#7EC850" stroke="#3E6A22" stroke-width="1.2"/><path d="M${a.x} ${SUP-29} c-3 -4 -8 -5 -10 -3 c3 0 6 1 10 3" fill="#9ADA62" stroke="#3E6A22" stroke-width="1.1"/><path d="M${a.x-2.4} ${SUP-25} q-1 4 1 7" stroke="#F0C08A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>${brilhoHotspot(a.x + 14, SUP - 30)}<rect x="${a.x-40}" y="${SUP-44}" width="80" height="54" fill="transparent"/></g>`);
  });
  gB.addEventListener('click', e => {
    const g = e.target.closest('.ce-buraco'); if (!g || fase !== 'plantar') return; e.stopPropagation();
    const i = +g.dataset.i, a = ARV[i]; g.remove(); a.ok = true; plantadas++; toca('planta');
    for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:a.x + sorte(-14, 14), y:SUP, t:k, cor:'#B5723A' });
    gA.insertAdjacentHTML('beforeend', arvore(a.x, true, i)); desenhaRaizes(a, true); c.brilhos(a.x, SUP - 40, 10, '#D6F0A8');
    api.hud(`<span class="chip">Mudas plantadas: ${plantadas}/4</span>`);
    if (plantadas === 1) api.diz('Viu as raízes? No Cerrado elas vão muito fundo, por isso dizem que é uma floresta de cabeça para baixo.');
    if (plantadas === 3) api.diz('Falta uma! As raízes do Cerrado chegam bem pertinho da água lá embaixo.');
    if (plantadas === 4) { soltaLobo(); depois(1800, comecaChuva); }
  });
  /* lobo-guará: espera quieto e depois passeia pelo campo */
  const lobo = el(s, '#ce-lobo'), loboIn = el(s, '#ce-lobo-in');
  let loboX = 514, loboDir = -1, loboAnda = false, loboPausa = 0;
  function soltaLobo(){ loboAnda = true; }
  lobo.addEventListener('click', () => { loboPausa = performance.now() + 1800; toca('fig'); });
  /* borboletas, minhoca, lobo e tamanduá: laço da vida */
  const borbs = [{ e:el(s, '#ce-borb1'), cx:250, cy:150, ax:90, ay:30, v:.00042, f:0, fugiu:0 }, { e:el(s, '#ce-borb2'), cx:470, cy:176, ax:70, ay:24, v:.00055, f:2, fugiu:0 }];
  borbs.forEach(b => b.e.addEventListener('click', ev => { ev.stopPropagation(); b.fugiu = performance.now(); toca('pop'); c.brilhos(b.x, b.y, 5, '#FFE27A'); }));
  const minh0 = el(s, '#ce-minh0'), minh = el(s, '#ce-minh'), minh2 = el(s, '#ce-minh2'); let minhEsc = 0;
  const araras = el(s, '#ce-araras-in'); let araraT0 = performance.now() - 6000;
  (function vida(t){
    if (!vivo) return;
    borbs.forEach(b => { const k = t * b.v + b.f, fuga = b.fugiu ? Math.min(1, (t - b.fugiu) / 1400) : 0; b.x = b.cx + Math.sin(k * 2.1) * b.ax + fuga * 300; b.y = b.cy + Math.sin(k * 3.3) * b.ay - fuga * 160; if (fuga >= 1) { b.fugiu = 0; } const asa = .35 + Math.abs(Math.sin(t / 70 + b.f)) * .65; b.e.setAttribute('transform', `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`); b.e.firstElementChild.setAttribute('transform', `scale(${asa.toFixed(2)} 1)`); });
    const esc = minhEsc > t ? 1 - Math.min(1, (minhEsc - t) / 300) * 0 : 0, sumido = minhEsc > t;
    let d = '', d2 = ''; for (let i = 0; i <= 10; i++) { const x = 196 + i * 5, y = 270 + Math.sin(t / 260 + i * .8) * 4 * (sumido ? .2 : 1); d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } minh0.setAttribute('d', d); minh.setAttribute('d', d); minh2.setAttribute('d', d); minh0.style.opacity = minh.style.opacity = minh2.style.opacity = sumido ? .25 : 1;
    if (loboAnda && t > loboPausa) { loboX += loboDir * .55; if (loboX < 150) loboDir = 1; if (loboX > 500) loboDir = -1; }
    lobo.setAttribute('transform', `translate(${loboX.toFixed(1)} ${loboAnda && t > loboPausa ? (Math.abs(Math.sin(t / 140)) * -2.2).toFixed(1) : 0})`);
    loboIn.setAttribute('transform', loboDir > 0 ? 'scale(-1 1)' : '');
    const ka = ((t - araraT0) % 16000) / 9000; araras.setAttribute('transform', ka <= 1 ? `translate(${(-90 + ka * 1000).toFixed(1)} ${(96 - Math.sin(ka * Math.PI) * 50).toFixed(1)})` : 'translate(-200 0)');
    requestAnimationFrame(vida);
  })(performance.now());
  el(s, '#ce-minhoca').addEventListener('click', e => { e.stopPropagation(); minhEsc = performance.now() + 1600; toca('clique'); api.diz('A minhoca cava túneis e deixa a terra fofinha. Assim a água da chuva entra no chão com facilidade.'); });
  el(s, '#ce-toca').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ce-tatu').animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px) rotate(-3deg)' }, { transform:'translateY(0)' }, { transform:'translateY(-4px) rotate(2deg)' }, { transform:'translateY(0)' }], { duration:700 }); el(s, '#ce-zzz').animate([{ opacity:1 }, { opacity:0, transform:'translateY(-12px)' }, { opacity:1 }], { duration:1400 }); api.diz('Um tatu-canastra na toca! Ele cava buracos fundos, e por esses caminhos a água da chuva também entra na terra.'); });
  el(s, '#ce-cupim').addEventListener('click', e => { e.stopPropagation(); lingua(); api.diz('É um cupinzeiro! O tamanduá-bandeira come cupins com a língua comprida, e a seriema gosta de cantar lá de cima.'); });
  el(s, '#ce-tamandua').addEventListener('click', () => lingua());
  function lingua(){ const l = el(s, '#ce-lingua'); l.animate([{ opacity:1, strokeDasharray:'0 30' }, { opacity:1, strokeDasharray:'30 0', offset:.4 }, { opacity:1, strokeDasharray:'30 0', offset:.6 }, { opacity:1, strokeDasharray:'0 30' }], { duration:900 }); toca('clique'); depois(380, () => c.brilhos(36, SUP - 20, 4, '#FFE27A')); }
  el(s, '#ce-seriema').addEventListener('click', e => { e.stopPropagation(); [990, 940, 880, 820, 760].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'triangle', .09, f * .8), i * 140)); const cab = el(s, '#ce-seri-cab'); cab.style.transformBox = 'fill-box'; cab.style.transformOrigin = '20% 100%'; cab.animate([{ transform:'rotate(0)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(0)' }], { duration:900 }); api.diz('A seriema canta alto, lá de cima do cupinzeiro! Dá para ouvir o canto dela de bem longe.'); });
  el(s, '#ce-ipe').addEventListener('click', e => { e.stopPropagation(); toca('planta'); for (let i = 0; i < 26; i++) c.add({ tipo:'petala', x:sorte(30, 130), y:sorte(SUP - 100, SUP - 60), vy:sorte(.6, 1.3), f:sorte(0, 6), chao:sorte(SUP - 4, SUP + 6), cor: Math.random() < .5 ? '#FFC83D' : '#FFE27A', borda:'#B07A08' }); api.diz('É o ipê-amarelo! Ele perde as folhas e fica todo florido no fim da seca.'); });
  el(s, '#ce-araras').addEventListener('click', e => { e.stopPropagation(); [1200, 900, 1250].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'sawtooth', .05, f * .7), i * 120)); c.brilhos(200, 90, 6, '#FFE27A'); api.diz('Araras-canindé, azuis e amarelas! Elas fazem ninho nos buritis da vereda.'); });
  el(s, '#ce-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(380, 54, 10, '#FFE27A'); api.diz('O sol do Cerrado é forte. A seca dura meses, por isso as plantas buscam água bem fundo com as raízes.'); });
  el(s, '#ce-cachoeira').addEventListener('click', e => { e.stopPropagation(); toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:636 + sorte(-8, 8), y:214, t:i }); api.diz('Uma cachoeira na chapada! A água que sai das pedras do Cerrado forma cachoeiras lindas.'); });
  el(s, '#ce-aq-toque').addEventListener('click', e => { if (fase === 'chuva') return; e.stopPropagation(); const p = c.ponto(e); for (let i = 0; i < 5; i++) c.add({ tipo:'bolha', x:p.x + sorte(-10, 10), y:p.y, t:i }); toca('glub'); api.diz(cheio >= META ? 'Agora tem muita água guardada entre os grãos de areia e pedra. Os cientistas chamam isso de aquífero.' : 'Aqui embaixo a água fica guardada entre grãos de areia e pedra, como numa esponja.'); });
  el(s, '#ce-pequi').addEventListener('click', () => { const g = el(s, '#ce-pequi-in'); if (g.dataset.caiu) return; g.dataset.caiu = 1; g.animate([{ transform:'translateY(0)' }, { transform:'translateY(48px)', offset:.45, easing:'ease-out' }, { transform:'translateY(38px)', offset:.6, easing:'ease-in' }, { transform:'translateY(48px)', offset:.75 }, { transform:'translateY(48px)', offset:.92, opacity:1 }, { transform:'translateY(48px)', opacity:0 }], { duration:2600 }); depois(2600, () => { delete g.dataset.caiu; }); });
  /* chuva arrastável que faz brotar flores */
  function comecaChuva(){
    fase = 'chuva'; nuvem.style.opacity = 1; posN(); toca('chuva'); gR.querySelectorAll('.ce-rag').forEach(molhaRaiz);
    api.hud(`<span class="chip">Água guardada: 0%</span>`);
    api.diz('Chegou a chuva! Arraste a nuvem por cima das árvores. As raízes ajudam a água a entrar no chão e encher a água guardada lá embaixo.');
    chovendo();
  }
  const posN = () => nuvem.setAttribute('transform', `translate(${nuvemX.toFixed(1)} 72)`);
  let dirN = 1;
  function chovendo(){
    if (!vivo || fase !== 'chuva') return;
    if (!arrN) { nuvemX += dirN * 1.4; if (nuvemX > 560 || nuvemX < 70) dirN *= -1; posN(); }
    const x = nuvemX + sorte(-60, 60);
    c.add({ tipo:'chuva', x, y:104, vx:-.4, vy:sorte(9,12), chao:SUP, cor:'#3D8BFF' });
    const perto = ARV.find(a => a.ok && Math.abs(a.x - x) < 56);
    if (perto && Math.random() < .55) depois(380, () => c.add({ tipo:'infiltra', x0:x, y0:SUP + 6, x1:perto.x + sorte(-30, 30), y1:AQ1 + 4 + sorte(0, 20), dur:sorte(70, 100), f:sorte(0, 6), chega:encher }));
    depois(70, chovendo);
  }
  const FLOR = ['#B57BFF', '#FFFFFF', '#FF8AB8', '#FFD447'];
  function brota(x){
    const cor = FLOR[nFlores++ % 4], h = sorte(11, 17), y = SUP + 2 - h, tinta = ['#5E3A9E', '#8A8A9A', '#B03A6E', '#B07A08'][(nFlores - 1) % 4];
    el(s, '#ce-flores').insertAdjacentHTML('beforeend', `<g class="cresce"><path d="M${x.toFixed(0)} ${SUP + 2} q-2 -${(h/2).toFixed(0)} 0 -${h.toFixed(0)}" stroke="#4E7A2A" stroke-width="1.8" fill="none"/><path d="M${x.toFixed(1)} ${(SUP - h * .35).toFixed(1)} q-6 -1 -7 -5 q5 0 7 5Z M${x.toFixed(1)} ${(SUP - h * .55).toFixed(1)} q6 -1 7 -5 q-5 0 -7 5Z" fill="#7EB848" stroke="#3E6A22" stroke-width=".7"/><g fill="${cor}" stroke="${tinta}" stroke-width=".8">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${(x + Math.cos(a * Math.PI / 180) * 3.4).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * 3.4).toFixed(1)}" rx="2.9" ry="2.1" transform="rotate(${a} ${(x + Math.cos(a * Math.PI / 180) * 3.4).toFixed(1)} ${(y + Math.sin(a * Math.PI / 180) * 3.4).toFixed(1)})"/>`).join('')}</g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#FFB020" stroke="#B0700A" stroke-width=".6"/><circle cx="${(x - .6).toFixed(1)}" cy="${(y - .6).toFixed(1)}" r=".6" fill="#FFF2B0"/></g>`);
  }
  function encher(){
    if (fase !== 'chuva') return; cheio++;
    const y = AQ0 + (AQ1 - AQ0) * Math.min(1, cheio / META); aq.setAttribute('y', y.toFixed(1)); aqOnda.setAttribute('transform', `translate(0 ${(y - AQ0).toFixed(1)})`);
    const pc = Math.min(100, Math.round(cheio / META * 100)); api.hud(`<span class="chip">Água guardada: ${pc}%</span>`);
    if (cheio % 6 === 0) brota(sorte(110, 545));
    if (cheio === 18) api.diz('Olha, a chuva fez brotar flores no Cerrado!');
    if (cheio === Math.round(META / 2)) api.diz('A água está descendo pelas raízes e enchendo os espaços entre os grãos. Continue!');
    if (cheio >= META) { fase = 'nascentes'; nuvem.style.opacity = 0; toca('vitoria'); mostraNascentes(); }
  }
  nuvem.addEventListener('pointerdown', e => { if (fase !== 'chuva') return; arrN = { dx: nuvemX - c.ponto(e).x }; s.setPointerCapture(e.pointerId); nuvem.style.cursor = 'grabbing'; });
  s.addEventListener('pointermove', e => { if (!arrN) return; nuvemX = Math.max(60, Math.min(600, c.ponto(e).x + arrN.dx)); posN(); });
  s.addEventListener('pointerup', () => { arrN = null; nuvem.style.cursor = 'grab'; });
  function mostraNascentes(){
    api.hud('<span class="chip">Nascentes: 0/3</span>');
    api.diz('A água debaixo da terra encheu! Agora ela sai devagar nas nascentes, lá na vereda. Toque em cada nascente.');
    el(s, '#ce-nasc').innerHTML = NASC.map((n, i) => `<g class="toque ce-n" data-n="${i}"><circle cx="${n.x}" cy="${n.y}" r="16" fill="#9FD8FF" stroke="#1B56C4" stroke-width="2.5"/><circle cx="${n.x}" cy="${n.y}" r="16" fill="none" stroke="#fff" stroke-width="3" class="pino-pulso"/><use href="#gota" x="${n.x - 6}" y="${n.y - 9}" width="12" height="16" style="color:#1B56C4"/><circle cx="${n.x}" cy="${n.y}" r="28" fill="transparent"/></g>`).join('');
  }
  el(s, '#ce-nasc').addEventListener('click', e => {
    const g = e.target.closest('.ce-n'); if (!g || fase !== 'nascentes' || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; const n = NASC[+g.dataset.n]; toca('splash'); nRios++;
    const d = `M${n.x} ${n.y} C${n.x + 30} ${n.y + 4} ${(n.x + 820) / 2} ${n.yf - 8} 820 ${n.yf}`;
    el(s, '#ce-rios').insertAdjacentHTML('beforeend', `<path d="${d}" stroke="#1B56C4" stroke-width="12" fill="none" stroke-linecap="round" class="ce-rio"/><path d="${d}" stroke="#5AAEFF" stroke-width="7" fill="none" stroke-linecap="round" class="ce-rio"/><path d="${d}" stroke="#DFF3FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 14" class="ce-corre" opacity="0"/><text x="${n.x - 22}" y="${n.y + 6}" text-anchor="end" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="#12235A" stroke-opacity=".6" stroke-width="3.4" paint-order="stroke" opacity="0" style="transition:opacity .6s .8s" class="ce-rotulo">${n.nome}</text>`);
    s.querySelectorAll('.ce-rio').forEach(p => { if (p.dataset.ok) return; p.dataset.ok = 1; const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = 'stroke-dashoffset 1.6s ease-out'; requestAnimationFrame(() => requestAnimationFrame(() => p.style.strokeDashoffset = 0)); });
    s.querySelectorAll('.ce-corre').forEach(p => { if (p.dataset.ok) return; p.dataset.ok = 1; depois(1500, () => { p.setAttribute('opacity', .9); p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-40 }], { duration:700, iterations:Infinity }); }); });
    s.querySelectorAll('.ce-rotulo').forEach(t => t.setAttribute('opacity', 1));
    c.brilhos(n.x, n.y, 8, '#BFE6FF'); for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:n.x + sorte(-8, 8), y:n.y, t:i }); api.diz(n.fala);
    api.hud(`<span class="chip">Nascentes: ${nRios}/3</span>`);
    if (nRios === 3) { fase = 'fim'; depois(3200, () => { api.diz('O Cerrado é o berço das águas: nele nascem rios que levam água para quase todo o Brasil. Cuidar do Cerrado é cuidar dessas nascentes!'); depois(3400, api.fim); }); }
  });
  s.querySelectorAll('.ce-flui').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-36 }], { duration:800, iterations:Infinity }));
  api.hud('<span class="chip">Mudas plantadas: 0/4</span>');
  api.diz('Oi, eu sou o Guará, um lobo-guará do Cerrado! Aqui tem pedaços de chão sem plantas. Toque em cada sementinha para plantar uma muda. Você também pode tocar nos bichos, nas flores e até debaixo da terra!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
