/* ================= JOGO 10: Andes e Himalaia, as caixas-d'água das montanhas ================= */
function jogoAndes(palco, api){
  semente = 83;
  let vivo = true, fase = 'neve', neves = 0, ocupado = false, derr = 0, marco = 0, abertos = 0;
  let geloY = 182, geloAlvo = 182;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const LAGO = { x:470, y:318 }, SOL0 = { x:70, y:104 }, SOL1 = { x:730, y:104 };
  const solXY = u => ({ x:SOL0.x + (SOL1.x - SOL0.x) * u, y:SOL0.y - 300 * u * (1 - u) });
  const NUVENS = [{ x:296, y:34, a:236, b:362, chao:[70, 130] }, { x:438, y:58, a:390, b:486, chao:[96, 150] }, { x:690, y:52, a:620, b:770, chao:[110, 170] }];
  const LINHAS = [{ y:336, x0:596 }, { y:378, x0:564 }, { y:420, x0:532 }];
  const PORTAS = [{ x:578, y:344 }, { x:552, y:384 }, { x:524, y:426 }, { x:470, y:462 }];
  /* terraços curvos: cada um tem borda de trás, borda da frente e pé do muro (curvas de Bézier que seguem o morro) */
  const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const TX = L => [L.x0, L.x0 + 90, 700, 800], TB = L => [L.y, L.y + 27, L.y + 13, L.y - 12], TF = L => [L.y + 20, L.y + 47, L.y + 31, L.y + 8], TW = L => [L.y + 36, L.y + 63, L.y + 47, L.y + 24];
  const curva = (xs, ys, dx) => `C${xs[1] + (dx || 0)} ${ys[1]} ${xs[2]} ${ys[2]} ${xs[3]} ${ys[3]}`;
  const RAMOS = [...LINHAS.map((L, i) => { const P = PORTAS[i]; return `M${P.x} ${P.y} Q${P.x + 10} ${L.y + 5} ${L.x0 + 8} ${L.y + 4} C${L.x0 + 90} ${L.y + 32} 700 ${L.y + 18} 798 ${L.y - 7}`; }), 'M470 462 Q450 466 426 472'];
  const CANAL = 'M552 322 Q576 328 578 344 Q580 364 552 384 Q528 402 524 426 Q518 452 470 462';
  const f1 = n => n.toFixed(1);
  /* linha central da língua de gelo: desce do circo (alto, à esquerda) em S suave rumo ao lago; afina até a frente */
  const GX = yy => { const s = (yy - 150) / 140; return 340 + 56 * s + 9 * Math.sin(6.283 * s); }, GW = yy => 26 - 13 * (yy - 150) / 140;
  const GD = yy => (GX(yy + 1) - GX(yy - 1)) / 2;
  const faixa = (y0, y1, a0, a1, b0, b1, ond) => { const E = [], D = []; for (let yy = y0; yy <= y1; yy += 6) { const k = (yy - y0) / (y1 - y0), w = GW(yy); E.push(`${f1(GX(yy) - w * a0 - a1 + ond * Math.sin(yy * .37))} ${yy}`); D.push(`${f1(GX(yy) + w * b0 + b1 + ond * Math.sin(yy * .29 + 2))} ${yy}`); } return `M${E.join(' L')} L${D.reverse().join(' L')}Z`; };
  const ichu = (x, y, h, c1, c2) => { let d = ''; for (let i = 0; i < 11; i++) { const a = -1.15 + i * .23, L = h * R(.7, 1.1); d += `M${(x + (i - 5) * 1.2).toFixed(1)} ${y} Q${(x + Math.sin(a) * L * .4).toFixed(1)} ${(y - L * .6).toFixed(1)} ${(x + Math.sin(a) * L).toFixed(1)} ${(y - Math.cos(a) * L).toFixed(1)} `; } return `<g class="balanca" style="animation-duration:${R(3.5, 5.5).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s;transform-origin:${x}px ${y}px"><ellipse cx="${x}" cy="${y}" rx="${(h * .32).toFixed(1)}" ry="${(h * .07).toFixed(1)}" fill="#3A3A12" opacity=".25"/><path d="${d}" stroke="${c2}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c1}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${x - 2} ${y - h * .2} q2 ${f1(-h * .35)} 6 ${f1(-h * .6)}" stroke="#FFF6CC" stroke-width="1" fill="none" opacity=".7" stroke-linecap="round"/></g>`; };
  const tufo = (x, y, s, c1, c2) => `<path d="M${x - 3 * s} ${y} q-1 ${f1(-5 * s)} -3 ${f1(-7 * s)} M${x} ${y} q0 ${f1(-6 * s)} 1 ${f1(-9 * s)} M${x + 3 * s} ${y} q1 ${f1(-4 * s)} 4 ${f1(-6 * s)}" stroke="${c2}" stroke-width="${f1(2 * s)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q0 ${f1(-6 * s)} 1 ${f1(-9 * s)} M${x + 3 * s} ${y} q1 ${f1(-4 * s)} 4 ${f1(-6 * s)}" stroke="${c1}" stroke-width="${f1(.9 * s)}" fill="none" stroke-linecap="round"/>`;
  const pedra = (x, y, rx, ry, id) => `<path d="M${x - rx} ${y} C${x - rx} ${y - ry * .9} ${x - rx * .4} ${y - ry * 1.15} ${x + rx * .1} ${y - ry} C${x + rx * .7} ${y - ry * 1.05} ${x + rx} ${y - ry * .5} ${x + rx} ${y}Z" fill="url(#${id || 'adPedra'})" stroke="#4A3E44" stroke-width="1.8"/><path d="M${x + rx * .15} ${y - ry * .95} C${x + rx * .6} ${y - ry * .8} ${x + rx * .85} ${y - ry * .4} ${x + rx * .9} ${y}" stroke="#4E4250" stroke-width="2" fill="none" opacity=".35"/><path d="M${x - rx * .7} ${y - ry * .6} q${rx * .3} ${-ry * .4} ${rx * .7} ${-ry * .38}" stroke="#E6DCD6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="${f1(x - rx * .2)}" cy="${f1(y - ry * .45)}" r="${f1(Math.max(1, rx * .12))}" fill="#E8A83A" opacity=".75"/><circle cx="${f1(x + rx * .35)}" cy="${f1(y - ry * .3)}" r="${f1(Math.max(.8, rx * .08))}" fill="#C8D66A" opacity=".7"/>`;
  const flor = (x, y, r, cor, esc, miolo) => `<g>${[0, 1, 2, 3, 4].map(k => { const a = k * 1.2566 - 1.57; return `<ellipse cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" rx="${(r * .78).toFixed(1)}" ry="${(r * .55).toFixed(1)}" transform="rotate(${(a * 57.3 + 90).toFixed(0)} ${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)})" fill="${cor}" stroke="${esc}" stroke-width=".8"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${(r * .5).toFixed(1)}" fill="${miolo || '#FFD447'}" stroke="#B07A08" stroke-width=".6"/></g>`;
  const lupino = (x, y, h) => `<path d="M${x} ${y} V${y - h}" stroke="#3E6A3A" stroke-width="1.6"/>${Array.from({ length:6 }, (_, i) => `<ellipse cx="${x + (i % 2 ? 2.4 : -2.4)}" cy="${(y - h + 3 + i * h / 9).toFixed(1)}" rx="${(2 + i * .35).toFixed(1)}" ry="1.8" fill="${i < 2 ? '#C8A8F0' : '#8E5AD0'}" stroke="#4E2A8A" stroke-width=".6"/>`).join('')}<path d="M${x - 8} ${y} q4 -6 8 -2 q4 -4 8 2" fill="#5E9A4A" stroke="#2E5A2A" stroke-width=".8"/>`;
  /* almofada de yareta: planta-almofada verde-viva do altiplano */
  const yareta = (x, y, r) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${f1(r * 1.1)}" ry="${f1(r * .3)}" fill="#3A3A14" opacity=".25"/><path d="${copa(x, y - r * .45, r, r * .55, 10, .18)}" fill="url(#adYareta)" stroke="#2E5A1E" stroke-width="1.3"/><g fill="#C8F07A" opacity=".75">${Array.from({ length:Math.round(r * .9) }, () => `<circle cx="${f1(x + R(-r * .75, r * .75))}" cy="${f1(y - r * .45 + R(-r * .35, r * .25))}" r="${f1(R(.7, 1.3))}"/>`).join('')}</g><path d="M${f1(x - r * .6)} ${f1(y - r * .75)} q${f1(r * .4)} ${f1(-r * .3)} ${f1(r * .9)} ${f1(-r * .2)}" stroke="#E6FFB0" stroke-width="1.4" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  /* puya: roseta espinhosa com espiga alta */
  const puya = (x, y, h) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="18" ry="4" fill="#3A3A14" opacity=".3"/>${Array.from({ length:13 }, (_, i) => { const a = -1.45 + i * .242, L = R(14, 20); return `<path d="M${x} ${y - 4} Q${f1(x + Math.sin(a) * L * .5)} ${f1(y - 6 - Math.cos(a) * L * .5)} ${f1(x + Math.sin(a) * L)} ${f1(y - 3 - Math.cos(a) * L * .75)}" stroke="#4A6A5A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y - 4} Q${f1(x + Math.sin(a) * L * .5)} ${f1(y - 6 - Math.cos(a) * L * .5)} ${f1(x + Math.sin(a) * L)} ${f1(y - 3 - Math.cos(a) * L * .75)}" stroke="#9EC2A8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`; }).join('')}<path d="M${x - 5} ${y - 12} C${x - 7} ${y - h * .5} ${x - 5} ${y - h * .9} ${x} ${y - h} C${x + 5} ${y - h * .9} ${x + 7} ${y - h * .5} ${x + 5} ${y - 12}Z" fill="url(#adPuya)" stroke="#5E6A3A" stroke-width="1.3"/><g fill="#F6F0C8" stroke="#A8A060" stroke-width=".5">${Array.from({ length:16 }, (_, k) => `<circle cx="${f1(x + (k % 2 ? 2.4 : -2.4))}" cy="${f1(y - 16 - k * (h - 22) / 16)}" r="1.5"/>`).join('')}</g><path d="M${x - 3} ${y - 16} C${x - 4} ${y - h * .5} ${x - 3} ${y - h * .85} ${x} ${y - h + 4}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5"/></g>`;
  /* casa de adobe com fachada, lateral em perspectiva, empena e telhado de palha (ichu) ou de telha */
  const casa = (x, y, w, h, telha, tesc, palha) => {
    const L = x - w / 2, D = x + w / 2, d = w * .32, dy = d * .45, rh = w * .36, topo = y - h - dy / 2 - rh;
    const A = [L - 5, y - h + 3], B = [D + 3, y - h + 3], C = [D + d / 2 + 1, topo], E = [L - 5 + d / 2, topo];
    const tij = Array.from({ length:Math.floor(h / 5) }, (_, k) => { const yy = y - 6 - k * 5; let s = `M${L + 1} ${yy}H${D - 1}`; for (let xx = L + (k % 2 ? 4 : 8); xx < D - 2; xx += 9) s += `M${f1(xx)} ${yy}v-5`; return s; }).join('');
    const tlinhas = palha ? Array.from({ length:Math.floor(w / 3.2) }, (_, k) => { const t = k / Math.floor(w / 3.2), xa = A[0] + (B[0] - A[0]) * t, xb = E[0] + (C[0] - E[0]) * t; return `M${f1(xa + R(-1, 1))} ${f1(A[1] + R(0, 2))}L${f1(xb)} ${topo + 1}`; }).join('')
      : Array.from({ length:4 }, (_, k) => { const t = (k + 1) / 5, ya = A[1] + (topo - A[1]) * t, xa = A[0] + (E[0] - A[0]) * t, xb = B[0] + (C[0] - B[0]) * t; let s = `M${f1(xa)} ${f1(ya)}`; for (let xx = xa; xx < xb - 4; xx += 5) s += ` q2.5 3 5 0`; return s; }).join('');
    const franja = palha ? `<path d="M${A[0]} ${A[1]} ${Array.from({ length:Math.floor((B[0] - A[0]) / 3) }, (_, k) => `L${f1(A[0] + k * 3 + 1.5)} ${f1(A[1] + 2 + (k % 2) * 2.2)}`).join(' ')} L${B[0]} ${B[1]}Z" fill="${telha}" stroke="${tesc}" stroke-width="1"/>` : '';
    return `<g><ellipse cx="${f1(x + d * .4)}" cy="${y + 1}" rx="${f1(w * .72)}" ry="5" fill="#3A2E1E" opacity=".28"/>
      <path d="M${D} ${y} L${f1(D + d)} ${f1(y - dy)} V${f1(y - dy - h)} L${D} ${y - h}Z" fill="url(#adAdobeLado)" stroke="#6E4428" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M${D} ${y - h} L${f1(D + d / 2)} ${f1(topo)} L${f1(D + d)} ${f1(y - dy - h)}Z" fill="url(#adAdobeLado)" stroke="#6E4428" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M${D + 2} ${y - 4} L${f1(D + d - 2)} ${f1(y - dy - 4)}" stroke="#8E7E76" stroke-width="3"/>
      <path d="M${L} ${y} V${y - h} H${D} V${y}Z" fill="url(#adAdobe)" stroke="#7A4E2E" stroke-width="1.6"/>
      <path d="${tij}" stroke="#B88A5C" stroke-width=".8" opacity=".45" fill="none"/>
      <path d="M${L + 4} ${y - h + 10} q4 -3 9 -1 q3 4 -1 7 q-6 2 -8 -6Z" fill="#F8E2BE" opacity=".7"/>
      <path d="M${L} ${y - 5} H${D} V${y}H${L}Z" fill="url(#adPedra)" stroke="#5E5258" stroke-width="1"/><path d="M${L + 6} ${y - 5}v5M${L + 15} ${y - 5}v5M${L + 25} ${y - 5}v5M${L + 34} ${y - 5}v5" stroke="#5E5258" stroke-width=".7"/>
      <rect x="${L}" y="${y - h}" width="${w}" height="6" fill="#4A2A12" opacity=".28"/>
      <rect x="${f1(x - w * .2 - 7)}" y="${y - 22}" width="17" height="3.4" rx="1" fill="url(#adMadeira)" stroke="#4E2A10" stroke-width=".9"/>
      <rect x="${f1(x - w * .2 - 5)}" y="${y - 18.6}" width="13" height="14" fill="#5E3414" stroke="#3A1E0A" stroke-width="1"/><path d="M${f1(x - w * .2 - 1)} ${y - 18}v13M${f1(x - w * .2 + 3)} ${y - 18}v13" stroke="#8A5228" stroke-width="1"/><circle cx="${f1(x - w * .2 + 5)}" cy="${y - 11}" r="1" fill="#FFC83D"/>
      <rect x="${f1(x + w * .22 - 5)}" y="${y - h + 9}" width="10" height="9" fill="#2E4A6E" stroke="#4E2A10" stroke-width="1.6"/><path d="M${f1(x + w * .22 - 3)} ${y - h + 12} l4 -2" stroke="#BFE6FF" stroke-width="1.2" opacity=".8"/><rect x="${f1(x + w * .22 - 9)}" y="${y - h + 9}" width="4" height="9" fill="#3E8AD6" stroke="#1E4A8A" stroke-width=".8"/><rect x="${f1(x + w * .22 + 5)}" y="${y - h + 9}" width="4" height="9" fill="#3E8AD6" stroke="#1E4A8A" stroke-width=".8"/>
      <rect x="${f1(x + w * .22 - 7)}" y="${y - h + 18}" width="14" height="3" fill="#8A5228" stroke="#4E2A10" stroke-width=".7"/>${flor(x + w * .22 - 3, y - h + 17, 1.8, '#FF5A6A', '#9A1A2A')}${flor(x + w * .22 + 3, y - h + 17, 1.6, '#FFD447', '#9A7A0E')}
      <path d="M${f1(x - w * .2 + 12)} ${y} c-1 -5 1 -7 4 -7 c3 0 5 2 4 7Z" fill="#C8642E" stroke="#6E2A10" stroke-width=".9"/>
      <path d="M${f1(C[0])} ${f1(C[1])} L${f1(D + d + 3)} ${f1(y - dy - h + 3)}" stroke="${tesc}" stroke-width="4" stroke-linecap="round"/><path d="M${f1(C[0])} ${f1(C[1])} L${f1(D + d + 3)} ${f1(y - dy - h + 3)}" stroke="${telha}" stroke-width="2" stroke-linecap="round"/>
      <path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${f1(C[0])} ${f1(C[1])} L${f1(E[0])} ${f1(E[1])}Z" fill="${palha ? 'url(#adPalha)' : telha}" stroke="${tesc}" stroke-width="1.6" stroke-linejoin="round"/>
      ${palha ? '' : `<path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${f1(C[0])} ${f1(C[1])} L${f1(E[0])} ${f1(E[1])}Z" fill="url(#adTelhaLuz)"/>`}
      <path d="${tlinhas}" stroke="${tesc}" stroke-width="${palha ? .8 : 1}" fill="none" opacity="${palha ? .6 : .55}"/>${franja}
      <path d="M${f1(E[0] - 1)} ${f1(topo)} L${f1(C[0] + 1)} ${f1(topo)}" stroke="${tesc}" stroke-width="${palha ? 4 : 3.4}" stroke-linecap="round"/><path d="M${f1(E[0] + 2)} ${f1(topo - .6)} L${f1(C[0] - 2)} ${f1(topo - .6)}" stroke="#fff" stroke-width="1" opacity=".35" stroke-linecap="round"/>
      <path d="M${f1(A[0] + 6)} ${f1(A[1] - 4)} L${f1(E[0] + 6)} ${f1(topo + 3)}" stroke="#fff" stroke-width="1.6" opacity=".3" stroke-linecap="round"/></g>`;
  };
  const quinoa = (x, y, cor, esc, s) => `<g><path d="M${x} ${y} V${y - 22 * s}" stroke="#5E7A2A" stroke-width="${2 * s}"/><path d="M${x} ${y - 6 * s} q-7 -2 -9 -8 q6 0 9 5 M${x} ${y - 10 * s} q7 -2 9 -8 q-6 0 -9 5" fill="#7AA03A" stroke="#4E6A1E" stroke-width=".7"/>${[[0, -38, 2.8], [-3, -33, 3.2], [3, -32, 3.2], [-4, -27, 3.3], [4, -26, 3.2], [0, -29, 3], [-2, -22, 2.8], [2, -21, 2.6]].map(([dx, dy, r]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(r * s).toFixed(1)}" fill="${cor}" stroke="${esc}" stroke-width=".8"/>`).join('')}<path d="M${x - 3 * s} ${y - 34 * s} q1 -3 3 -4" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  const batata = (x, y, s) => `<g><path d="${copa(x, y - 9 * s, 13 * s, 9 * s, 8, .35)}" fill="url(#adBatata)" stroke="#1E5A2A" stroke-width="1.2"/><path d="M${x - 8 * s} ${y - 12 * s} q4 -4 9 -4" stroke="#B8E8A0" stroke-width="1.4" fill="none" opacity=".7"/>${flor(x - 4 * s, y - 16 * s, 2.2 * s, '#E8D4FF', '#7A4AB8')}${flor(x + 6 * s, y - 12 * s, 2 * s, '#FFFFFF', '#8A7AA8')}</g>`;
  const arroz = (x, y, s) => `<g stroke-linecap="round" fill="none"><path d="M${x} ${y} q-4 -8 -8 -14 M${x} ${y} q-1 -10 -2 -18 M${x} ${y} q2 -10 5 -17 M${x} ${y} q5 -6 10 -11" stroke="#3E8A2A" stroke-width="${2.6 * s}"/><path d="M${x} ${y} q-4 -8 -8 -14 M${x} ${y} q-1 -10 -2 -18 M${x} ${y} q2 -10 5 -17 M${x} ${y} q5 -6 10 -11" stroke="#A8E64A" stroke-width="${1.4 * s}"/></g>`;
  const queuna = (x, y, s) => `<g><path d="M${x} ${y} C${x - 4} ${y - 30 * s} ${x + 6} ${y - 50 * s} ${x - 2} ${y - 76 * s} M${x - 1} ${y - 40 * s} C${x - 12 * s} ${y - 50 * s} ${x - 20 * s} ${y - 58 * s} ${x - 26 * s} ${y - 70 * s} M${x + 2} ${y - 50 * s} C${x + 12 * s} ${y - 58 * s} ${x + 18 * s} ${y - 66 * s} ${x + 22 * s} ${y - 80 * s}" stroke="#6E2E1A" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x - 4} ${y - 30 * s} ${x + 6} ${y - 50 * s} ${x - 2} ${y - 76 * s} M${x - 1} ${y - 40 * s} C${x - 12 * s} ${y - 50 * s} ${x - 20 * s} ${y - 58 * s} ${x - 26 * s} ${y - 70 * s} M${x + 2} ${y - 50 * s} C${x + 12 * s} ${y - 58 * s} ${x + 18 * s} ${y - 66 * s} ${x + 22 * s} ${y - 80 * s}" stroke="url(#adCasca)" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 1} ${y - 10 * s} l3 -4 M${x + 1} ${y - 26 * s} l-3 -3 M${x - 2} ${y - 60 * s} l3 -4" stroke="#F2B08A" stroke-width="1.4" stroke-linecap="round"/>${[[-26, -78, 22, 15], [22, -88, 22, 15], [-2, -90, 26, 17], [-10, -70, 16, 10], [12, -70, 16, 10]].map(([dx, dy, rx, ry]) => `<path d="${copa(x + dx * s, y + dy * s, rx * s, ry * s, 9, .3)}" fill="url(#adQueuna)" stroke="#24463A" stroke-width="1.4"/>`).join('')}<g fill="#B8DCC0" opacity=".55">${[[-30, -82], [-20, -76], [18, -92], [28, -86], [-6, -96], [4, -92]].map(([dx, dy]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(2 * s).toFixed(1)}"/>`).join('')}</g></g>`;
  const porta = (p, i) => `<g class="ad-porta toque" data-i="${i}"><ellipse cx="${p.x}" cy="${p.y + 7}" rx="16" ry="3" fill="#2E2418" opacity=".3"/><path d="M${p.x - 14} ${p.y + 6} v-16 q0 -4 4 -4 h3 v20Z M${p.x + 14} ${p.y + 6} v-16 q0 -4 -4 -4 h-3 v20Z" fill="url(#adPedra)" stroke="#3A3036" stroke-width="1.4"/><path d="M${p.x - 12} ${p.y - 9} h3 M${p.x + 9} ${p.y - 9} h3" stroke="#EDE4E0" stroke-width="1.2" opacity=".7"/><g class="ad-tabua" style="transition:transform .8s cubic-bezier(.3,1.4,.5,1)"><rect x="${p.x - 8}" y="${p.y - 10}" width="16" height="15" rx="2" fill="url(#adMadeira)" stroke="#4E2A10" stroke-width="1.4"/><path d="M${p.x - 8} ${p.y - 5} h16 M${p.x - 8} ${p.y} h16" stroke="#6E3E1A" stroke-width="1"/><circle cx="${p.x}" cy="${p.y - 13}" r="2.6" fill="#8A5A2A" stroke="#4E2A10" stroke-width="1"/></g><g class="ad-dica" style="display:none">${brilhoHotspot(p.x + 12, p.y - 22)}</g><rect x="${p.x - 22}" y="${p.y - 30}" width="44" height="42" fill="transparent"/></g>`;
  /* pedras encaixadas do muro de arrimo (estilo inca) ao longo da curva */
  const muro = (L, i) => { const xs = TX(L), xs2 = xs.map((v, k) => k ? v : v - 4), yf = TF(L); let s = '';
    for (let r = 0; r < 2; r++) { let t = r ? R(.01, .03) : 0;
      while (t < 1) { const dt = R(11, 17) / (800 - L.x0), tb = Math.min(1, t + dt), xa = bz(...xs2, t) + 1, xb = bz(...xs2, tb) - .6, ya = bz(...yf, t) + 1.4 + r * 7.6, yb = bz(...yf, tb) + 1.4 + r * 7.6, h = 6.6;
        const cor = ['#C2B09E', '#AE9A88', '#CDBDAA', '#A08B7A', '#B8A694', '#C9B29A'][Math.floor(R(0, 5.99))];
        s += `<path d="M${f1(xa + 1.6)} ${f1(ya)} L${f1(xb - 1.6)} ${f1(yb)} Q${f1(xb)} ${f1(yb)} ${f1(xb)} ${f1(yb + 1.8)} L${f1(xb)} ${f1(yb + h - 1.6)} Q${f1(xb)} ${f1(yb + h)} ${f1(xb - 1.8)} ${f1(yb + h)} L${f1(xa + 1.8)} ${f1(ya + h)} Q${f1(xa)} ${f1(ya + h)} ${f1(xa)} ${f1(ya + h - 1.6)} L${f1(xa)} ${f1(ya + 1.8)} Q${f1(xa)} ${f1(ya)} ${f1(xa + 1.6)} ${f1(ya)}Z" fill="${cor}"/><path d="M${f1(xa + 1.6)} ${f1(ya + 1)} L${f1(xb - 1.6)} ${f1(yb + 1)}" stroke="#F2E8DC" stroke-width="1" opacity=".75"/>`;
        t = tb; } }
    return `<g stroke="none">${s}</g>`; };
  const campo = (L, i) => { const { y, x0 } = L, xs = TX(L), xf = xs.map((v, k) => k ? v : v - 4), xw = xs.map((v, k) => k ? v : v - 6), yb = TB(L), yf = TF(L), yw = TW(L);
    const campoD = `M${x0} ${y} ${curva(xs, yb)} V${yf[3]} C700 ${yf[2]} ${xf[1]} ${yf[1]} ${xf[0]} ${yf[0]}Z`;
    const n = Math.floor((790 - x0) / 23);
    return `<g class="ad-terraco" data-i="${i}">
    <path class="ad-campo" d="${campoD}" fill="url(#adTerraSeca)" stroke="#8A6A3E" stroke-width="1.4" style="transition:fill 1.6s"/>
    <path class="ad-umido" d="${campoD}" fill="url(#${i === 2 ? 'adEspelho' : 'adTerraMolhada'})" style="opacity:0;transition:opacity 1.6s"/>
    <g stroke="#8E6A42" stroke-width="1.2" opacity=".5" fill="none">${[.35, .6, .85].map(k => `<path d="M${x0 + 4} ${f1(yb[0] + (yf[0] - yb[0]) * k)} C${xs[1]} ${f1(yb[1] + (yf[1] - yb[1]) * k)} 700 ${f1(yb[2] + (yf[2] - yb[2]) * k)} 800 ${f1(yb[3] + (yf[3] - yb[3]) * k)}"/>`).join('')}</g>
    <g stroke="#F2DCB0" stroke-width=".9" opacity=".55" fill="none">${[.47, .72].map(k => `<path d="M${x0 + 8} ${f1(yb[0] + (yf[0] - yb[0]) * k)} C${xs[1]} ${f1(yb[1] + (yf[1] - yb[1]) * k)} 700 ${f1(yb[2] + (yf[2] - yb[2]) * k)} 800 ${f1(yb[3] + (yf[3] - yb[3]) * k)}"/>`).join('')}</g>
    <g>${Array.from({ length:n * 2 }, (_, k) => { const t = (k * 11.5 + 12) / (800 - x0), xx = bz(...xs, t), yy = bz(...yb, t) + (bz(...yf, t) - bz(...yb, t)) * .72; return `<path d="M${f1(xx)} ${f1(yy)} q-2 -3 -3 -4 M${f1(xx)} ${f1(yy)} q1 -3 3 -4" stroke="#9A8A3A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`; }).join('')}</g>
    <path d="M${xf[0]} ${yf[0]} ${curva(xf, yf)} V${yw[3]} C700 ${yw[2]} ${xw[1]} ${yw[1]} ${xw[0]} ${yw[0]}Z" fill="url(#adMuro)" stroke="#3E322C" stroke-width="1.6" stroke-linejoin="round"/>
    ${muro(L, i)}
    <path d="M${xw[0]} ${yw[0]} ${curva(xw, yw)}" stroke="#2E261E" stroke-width="2.2" fill="none" opacity=".35"/>
    <path d="M${xf[0] + 2} ${yf[0] - .6} ${curva(xf, yf.map(v => v - .6))}" stroke="#7A9A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${xf[0] + 2} ${yf[0] - 1} ${curva(xf, yf.map(v => v - 1))}" stroke="#C8E07A" stroke-width="1" fill="none" opacity=".7"/>
    <g class="ad-plantas">${Array.from({ length:n }, (_, k) => { const t = (k * 23 + 18) / (800 - x0), xx = bz(...xs, t) + R(-3, 3), yy = bz(...yb, t) + (bz(...yf, t) - bz(...yb, t)) * .74; const cores = [['#D8342E', '#8A1A14'], ['#F28A2A', '#A04A0E'], ['#F2C230', '#9A7A0E'], ['#9A3A8E', '#5A1A52'], ['#E85A6A', '#8E2A34']]; const cc = cores[(k + i) % 5];
      const p = i === 0 ? quinoa(xx, yy, cc[0], cc[1], R(.85, 1.05)) : i === 1 ? batata(xx, yy, R(.9, 1.1)) : arroz(xx, yy, R(.9, 1.1));
      return `<g class="ad-planta" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1) ${(k * .06).toFixed(2)}s">${p}</g>`; }).join('')}</g></g>`; };
  /* contornos das montanhas */
  const MONTE = 'M-10 340 L30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L262 86 L280 72 L300 62 L314 74 L326 84 L336 96 L352 108 L370 116 L386 106 L400 100 L414 94 L430 92 L446 106 L470 132 L494 152 L520 182 L548 206 L580 240 L612 280 L650 330 L700 350 H-10Z';
  const HIM = 'M470 330 L512 262 L540 214 L566 178 L588 146 L600 124 L612 136 L626 150 L640 142 L652 136 L670 116 L688 100 L700 92 L716 108 L730 124 L742 136 L756 128 L770 122 L786 130 L800 140 V330Z';
  const LAGOD = `M392 318 C394 306 428 299 468 300 C510 299 548 304 558 315 C566 326 540 338 500 340 C468 343 428 342 406 336 C392 331 389 325 392 318Z`;
  const fissuras = (n, x0, x1, y0, y1, cor, op) => `<g stroke="${cor}" stroke-width="1.3" fill="none" opacity="${op}" stroke-linecap="round">${Array.from({ length:n }, () => { const x = R(x0, x1), y = R(y0, y1); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${R(6, 16).toFixed(0)} ${R(-3, 4).toFixed(0)} l${R(4, 12).toFixed(0)} ${R(2, 7).toFixed(0)}"/>`; }).join('')}</g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Montanhas com geleira, lago azul-turquesa, terraços de plantação, vila, a lhama Quilla, condor, iaque e leopardo-das-neves">
    <defs>
      <linearGradient id="adCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E6CC6"/><stop offset=".35" stop-color="#6FA6E4"/><stop offset=".62" stop-color="#B4D2F0"/><stop offset=".82" stop-color="#E8E8F0"/><stop offset="1" stop-color="#F8E4CC"/></linearGradient>
      <linearGradient id="adLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6CEEA"/><stop offset="1" stop-color="#E2E4F0"/></linearGradient>
      <linearGradient id="adLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6B0D6"/><stop offset="1" stop-color="#D2D6EA"/></linearGradient>
      <linearGradient id="adHimLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8C0E2"/><stop offset=".6" stop-color="#97A2CC"/><stop offset="1" stop-color="#8A94BE"/></linearGradient>
      <linearGradient id="adHimSombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A74A2"/><stop offset="1" stop-color="#555E8C"/></linearGradient>
      <linearGradient id="adRochaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0C6B2"/><stop offset=".5" stop-color="#C2A294"/><stop offset="1" stop-color="#A28688"/></linearGradient>
      <linearGradient id="adRochaLuz2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2BCB4"/><stop offset=".6" stop-color="#B09694"/><stop offset="1" stop-color="#94808A"/></linearGradient>
      <linearGradient id="adMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0908C"/><stop offset=".6" stop-color="#957680"/><stop offset="1" stop-color="#806878"/></linearGradient>
      <linearGradient id="adRochaSombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A6078"/><stop offset=".6" stop-color="#5E4A66"/><stop offset="1" stop-color="#4E4060"/></linearGradient>
      <linearGradient id="adVale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8090"/><stop offset="1" stop-color="#A49A98"/></linearGradient>
      <linearGradient id="adGelo" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="0" y2="300"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#F2FAFF"/><stop offset=".55" stop-color="#CFE8F8"/><stop offset=".72" stop-color="#A6D2EE"/><stop offset=".88" stop-color="#9ABCD2"/><stop offset="1" stop-color="#8CA2B4"/></linearGradient>
      <linearGradient id="adGeloSombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6EA8DC" stop-opacity="0"/><stop offset="1" stop-color="#4E8CCC" stop-opacity=".7"/></linearGradient>
      <linearGradient id="adNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6E8F6"/></linearGradient>
      <linearGradient id="adPuna" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4C47C"/><stop offset=".45" stop-color="#B6AE5C"/><stop offset="1" stop-color="#7E8C40"/></linearGradient>
      <linearGradient id="adPunaVerde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8D86A"/><stop offset="1" stop-color="#5E9A3E"/></linearGradient>
      <linearGradient id="adColina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A89A6A"/><stop offset="1" stop-color="#8E8A56"/></linearGradient>
      <linearGradient id="adFrente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA448"/><stop offset=".5" stop-color="#76843A"/><stop offset="1" stop-color="#4E5E26"/></linearGradient>
      <linearGradient id="adEncosta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A2B05A"/><stop offset=".5" stop-color="#7E9A44"/><stop offset="1" stop-color="#5E7E36"/></linearGradient>
      <linearGradient id="adMorenaL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E7080"/><stop offset="1" stop-color="#9A8E8C"/></linearGradient>
      <linearGradient id="adMoraina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A69CA0"/><stop offset="1" stop-color="#B8AC94"/></linearGradient>
      <linearGradient id="adRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CEB4AE"/><stop offset=".6" stop-color="#9E8290"/><stop offset="1" stop-color="#836A7C"/></linearGradient>
      <linearGradient id="adPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BEB0B2"/><stop offset="1" stop-color="#6E6066"/></linearGradient>
      <linearGradient id="adMuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E4E44"/><stop offset="1" stop-color="#3E322C"/></linearGradient>
      <linearGradient id="adTerraSeca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6C690"/><stop offset="1" stop-color="#C49A62"/></linearGradient>
      <linearGradient id="adTerraMolhada" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5E3A"/><stop offset="1" stop-color="#6A4428"/></linearGradient>
      <linearGradient id="adEspelho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2ECF8"/><stop offset=".5" stop-color="#8ED0EC"/><stop offset="1" stop-color="#5EAED6"/></linearGradient>
      <linearGradient id="adMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A4E"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="adAdobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C496"/><stop offset=".5" stop-color="#DAAE7E"/><stop offset="1" stop-color="#C49468"/></linearGradient>
      <linearGradient id="adAdobeLado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B88660"/><stop offset="1" stop-color="#9A6A48"/></linearGradient>
      <linearGradient id="adPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A04E"/><stop offset=".5" stop-color="#E6C470"/><stop offset="1" stop-color="#B8903E"/></linearGradient>
      <linearGradient id="adTelhaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
      <linearGradient id="adCasca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E2744A"/><stop offset="1" stop-color="#A8401E"/></linearGradient>
      <linearGradient id="adPuya" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8C890"/><stop offset=".5" stop-color="#A8B070"/><stop offset="1" stop-color="#7A8A4E"/></linearGradient>
      <radialGradient id="adYareta" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#A8E05A"/><stop offset=".6" stop-color="#5EA83A"/><stop offset="1" stop-color="#3A7A2A"/></radialGradient>
      <radialGradient id="adQueuna" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#8EBC9A"/><stop offset=".6" stop-color="#4E8468"/><stop offset="1" stop-color="#2E5A48"/></radialGradient>
      <radialGradient id="adBatata" cx=".4" cy=".3" r=".7"><stop offset="0" stop-color="#6EC05A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <radialGradient id="adLago" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#1E9AB2"/><stop offset=".45" stop-color="#2EBAC8"/><stop offset=".85" stop-color="#6ADCD8"/><stop offset="1" stop-color="#A8F0E4"/></radialGradient>
      <radialGradient id="adLagoSeco" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#6E5E4C"/><stop offset=".7" stop-color="#8A7A62"/><stop offset="1" stop-color="#A6967A"/></radialGradient>
      <radialGradient id="adSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".55" stop-color="#FFCE45"/><stop offset="1" stop-color="#F29A1E"/></radialGradient>
      <linearGradient id="adNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F2F8" stop-opacity="0"/><stop offset=".7" stop-color="#F2F2F8" stop-opacity=".5"/><stop offset="1" stop-color="#F6F0E8" stop-opacity=".7"/></linearGradient>
      <linearGradient id="adNevoaBaixa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2F4" stop-opacity="0"/><stop offset="1" stop-color="#F4F2F0" stop-opacity=".42"/></linearGradient>
      <radialGradient id="adVinheta" cx=".5" cy=".42" r=".78"><stop offset=".58" stop-color="#1A1430" stop-opacity="0"/><stop offset="1" stop-color="#1A1430" stop-opacity=".36"/></radialGradient>
      <clipPath id="adLagoClip"><path d="${LAGOD}"/></clipPath>
      <filter id="adGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#adCeu)"/>
    <path d="M60 70 q120 -14 220 -4 M480 40 q100 -10 190 2 M520 76 q60 -6 120 0" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
    <g class="deriva"><use href="#nuvem" x="560" y="16" width="80" height="38" style="color:#fff" opacity=".8"/><use href="#nuvem" x="40" y="40" width="64" height="30" style="color:#fff" opacity=".7"/></g>
    <!-- cordilheiras distantes, apagadas pela atmosfera -->
    <path d="M0 214 L40 196 L80 170 L104 182 L140 160 L176 186 L220 178 L262 150 L300 172 L346 164 L392 140 L430 162 L476 150 L520 128 L560 152 L604 140 L650 118 L690 146 L740 132 L800 150 V330 H0Z" fill="url(#adLonge2)"/>
    <path d="M70 176 L80 170 L92 178 L84 182Z M130 166 L140 160 L152 170 L142 172Z M252 156 L262 150 L274 160 L262 162Z M382 146 L392 140 L404 150 L392 152Z M508 136 L520 128 L534 140 L520 142Z M640 124 L650 118 L664 128 L650 132Z" fill="#fff" opacity=".7"/>
    <path d="M0 236 L40 206 L70 218 L120 180 L160 200 L210 176 L260 196 L320 170 L380 190 L430 166 L500 188 L560 172 L620 194 L680 178 L740 196 L800 184 V330 H0Z" fill="url(#adLonge)"/>
    <path d="M40 206 L70 218 L56 260 Z M120 180 L160 200 L140 250Z M210 176 L260 196 L232 250Z M320 170 L380 190 L350 250Z M430 166 L500 188 L462 250Z M560 172 L620 194 L590 250Z M680 178 L740 196 L712 250Z" fill="#7E88B4" opacity=".28"/>
    <path d="M110 188 L120 180 L132 188 L124 192Z M200 182 L210 176 L220 184 L212 186Z M310 176 L320 170 L332 178 L322 180Z M420 172 L430 166 L442 174 L432 176Z M670 184 L680 178 L692 186 L682 188Z" fill="#fff" opacity=".9"/>
    <rect y="150" width="800" height="180" fill="url(#adNevoa)"/>
    <g id="ad-him">
      <path d="${HIM}" fill="url(#adHimLuz)" stroke="#5E6890" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M600 124 L612 136 L626 150 L640 142 L652 136 L640 200 L626 262 L616 330 L560 330 L580 250 L594 180Z M700 92 L716 108 L730 124 L742 136 L756 128 L770 122 L772 200 L780 330 L716 330 L712 250 L706 170Z" fill="url(#adHimSombra)" opacity=".85"/>
      <path d="M770 122 L786 130 L800 140 V330 H780 L772 200Z" fill="#6A74A2" opacity=".5"/>
      <path d="M600 124 L594 180 L580 250 M700 92 L706 170 L712 250 M652 136 L640 200" stroke="#DCE2F6" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>
      ${fissuras(10, 560, 790, 190, 300, '#4E5884', .4)}
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path transform="translate(0 18)" d="M582 150 L600 124 L626 150 L652 136 L670 120 L700 92 L730 124 L742 136 L770 122 L800 140 V160 C786 154 776 160 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C700 152 690 150 682 140 C672 160 660 156 652 150 C640 166 630 162 622 158 C610 170 600 164 592 162Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
      <path d="M582 150 L600 124 L626 150 L652 136 L670 120 L700 92 L730 124 L742 136 L770 122 L800 140 V160 C786 154 776 160 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C700 152 690 150 682 140 C672 160 660 156 652 150 C640 166 630 162 622 158 C610 170 600 164 592 162Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M600 124 L626 150 L652 136 C646 150 640 158 632 160 C624 162 616 162 608 166 C604 150 602 136 600 124Z M700 92 L730 124 L742 136 L770 122 C770 140 768 150 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C704 120 702 106 700 92Z" fill="#9CB4DC" opacity=".55"/>
      <path d="M700 98 L694 130 L688 142 M600 130 L596 150 M770 128 L772 146" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85" fill="none"/>
      <rect x="470" y="200" width="330" height="130" fill="url(#adNevoaBaixa)"/>
    </g>
    <g id="ad-monte">
      <path d="${MONTE}" fill="url(#adMonte)" stroke="#4E3A50" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-10 340 L30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L214 150 L184 214 L150 280 L120 340Z" fill="url(#adRochaLuz)"/>
      <path d="M300 62 L314 74 L326 84 L336 96 L352 108 L346 160 L340 230 L334 300 L330 340 L204 340 L224 250 L248 178 L272 118Z" fill="url(#adRochaSombra)"/>
      <path d="${faixa(118, 336, 1, 22, 1, 22, 2.2)}" fill="url(#adVale)" stroke="#4A3A52" stroke-width="1.6" stroke-opacity=".35" stroke-linejoin="round"/>
      <path d="M386 106 L400 100 L414 94 L430 92 L444 150 L458 220 L472 290 L480 340 L420 340 L416 300 L412 200 L404 128Z" fill="url(#adRochaLuz2)"/>
      <path d="M430 92 L446 106 L470 132 L498 200 L530 270 L560 345 L480 340 L472 290 L458 220 L444 150Z" fill="url(#adRochaSombra)"/>
      <path d="M470 132 L494 152 L520 182 L548 206 L580 240 L612 280 L650 330 L700 350 L560 345 L530 270 L498 200Z" fill="#7A6276" opacity=".9"/>
      <path d="M240 100 L214 150 L184 214 L150 280 M300 62 L272 118 L248 178 L224 250 M430 92 L444 150 L458 220 L472 290 M470 132 L498 200 L530 270" stroke="#F6E6DA" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L262 86 L280 72 L300 62" stroke="#FFF2E8" stroke-width="1.6" fill="none" opacity=".55" stroke-linejoin="round"/>
      <path d="M110 214 C114 236 108 258 102 284 M160 176 C164 204 156 232 148 256 M204 132 C206 158 198 184 190 204 M58 270 C62 290 58 306 52 324 M84 238 C86 258 82 276 76 296" stroke="#8A6670" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M262 108 C256 140 246 176 236 210 M288 100 C282 140 274 190 262 240 M318 96 C314 140 306 200 296 270" stroke="#3E2E4A" stroke-width="2" fill="none" opacity=".35" stroke-linecap="round"/>
      <path d="M452 140 C470 180 484 220 496 270 M486 170 C506 210 520 250 534 300" stroke="#3A2A48" stroke-width="2" fill="none" opacity=".3" stroke-linecap="round"/>
      ${fissuras(8, 40, 200, 230, 320, '#7A5A64', .45)}${fissuras(8, 230, 330, 160, 320, '#3E2E48', .4)}${fissuras(6, 420, 470, 150, 320, '#7A6274', .45)}${fissuras(8, 490, 640, 220, 330, '#3E2E48', .35)}
      <path d="M252 92 L262 86 L280 72 L300 62 L314 74 L326 84 L336 96 C330 100 326 96 320 102 C314 98 310 108 304 104 C300 114 294 104 288 112 C284 104 276 112 272 104 L266 118 C262 108 258 104 252 102Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/>
      <path d="M300 62 L314 74 L326 84 L336 96 C330 100 326 96 320 102 C314 98 310 108 304 104 C300 110 296 104 292 108Z" fill="#A8BEE0" opacity=".7"/>
      <path d="M228 116 L240 100 L252 110 C246 118 240 118 236 130 C232 122 230 118 224 120Z M174 156 L180 150 L192 158 C186 164 182 168 180 176 C176 168 172 162 168 162Z M414 94 L430 92 L446 106 L470 132 C462 136 458 132 454 140 C448 132 444 140 440 132 C436 126 432 132 428 124 C422 120 418 112 410 110Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/>
      <path d="M430 92 L446 106 L470 132 C462 136 458 132 454 140 C448 132 444 140 440 132Z" fill="#A8BEE0" opacity=".7"/>
      <path d="M180 156 L174 172 L178 180 L170 198 M240 106 L232 130 L236 138 L228 160 M282 80 L272 108 M110 220 L104 236" stroke="#fff" stroke-width="1.8" fill="none" opacity=".8" stroke-linecap="round"/>
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path d="M206 130 C220 120 232 106 240 100 L262 86 L280 72 L290 70 C286 90 280 108 270 120 C262 114 258 126 250 122 C244 132 236 126 230 138 C222 132 216 142 208 140Z M470 132 L494 152 C488 158 484 154 478 162 C474 154 468 158 462 150 C464 142 466 136 470 132Z M140 190 L160 176 L180 150 C182 166 176 180 168 186 C162 184 156 194 148 194Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path d="M84 238 L110 214 L142 188 C140 206 132 220 122 226 C116 222 110 234 102 234 C96 240 90 236 84 244Z M494 152 L520 182 L548 206 C540 212 534 206 528 214 C520 206 512 212 506 200 C500 192 496 180 488 172Z M30 294 L58 270 C56 282 50 290 44 294 C40 292 36 298 30 298Z M204 132 L222 122 C222 136 216 150 208 154 C202 150 198 158 192 156 C194 146 198 138 204 132Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
    </g>
    <g id="ad-leopardo" class="toque" data-fig="leopardo"><g id="ad-leo-in" style="transition:transform .7s cubic-bezier(.3,1.5,.5,1)"><svg x="170" y="180" width="96" height="70" viewBox="0 0 150 110"><use href="#f-leopardo"/></svg></g>
      <path d="M140 256 C146 244 148 236 152 230 L166 220 L180 224 L196 212 L214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256Z" fill="url(#adRocha)"/><path d="M214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256 H226 L222 236Z" fill="#4E3A52" opacity=".35"/><path d="M140 256 C146 244 148 236 152 230 L166 220 L180 224 L196 212 L214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256" fill="none" stroke="#3E2E3E" stroke-width="1.8" stroke-linejoin="round"/><path d="M156 230 L166 222 L180 226 M198 214 L214 218 L228 211" stroke="#F2DED6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/><path d="M180 226 L186 248 M214 218 L210 246 M244 222 L250 248" stroke="#3E2E3E" stroke-width="1.2" opacity=".5"/><path d="M146 250 q50 -6 130 2" stroke="#3E2E3E" stroke-width="3" opacity=".18" fill="none"/>${brilhoHotspot(240, 194)}<rect x="150" y="180" width="124" height="66" fill="transparent"/></g>
    <!-- planície de cascalho (fluvioglacial) e morena frontal -->
    <path d="M346 266 C340 284 320 298 294 310 L476 306 C454 294 434 282 420 266 C402 274 364 274 346 266Z" fill="url(#adMoraina)" stroke="#6E6066" stroke-width="1.4" stroke-linejoin="round"/>
    <g fill="#8E8488">${Array.from({ length:34 }, () => { const yy = R(258, 306), w = (yy - 250) * 2.6; return `<ellipse cx="${(380 + R(-w / 2, w / 2)).toFixed(0)}" cy="${yy.toFixed(0)}" rx="${R(1.6, 4.4).toFixed(1)}" ry="${R(1.2, 2.6).toFixed(1)}" stroke="#5E5258" stroke-width=".6"/>`; }).join('')}</g>
    <path d="M330 302 C346 288 366 292 380 296 C396 290 416 290 432 302 C418 308 400 304 380 306 C362 304 344 310 330 302Z" fill="#8E8284" stroke="#5E5258" stroke-width="1.2"/>
    <g fill="#B8AEAC" stroke="#5E5258" stroke-width=".7">${Array.from({ length:12 }, (_, k) => `<ellipse cx="${(336 + k * 8 + R(-2, 2)).toFixed(0)}" cy="${(300 - Math.sin(k / 11 * 3.14) * 6 + R(-1, 1)).toFixed(1)}" rx="${R(2.4, 4).toFixed(1)}" ry="${R(1.6, 2.4).toFixed(1)}"/>`).join('')}</g>
    <!-- morenas laterais: cristas de cascalho que a geleira empurrou para os lados -->
    <path d="${faixa(146, 294, 1, 17, -1, 3, 1.4)}" fill="url(#adMorenaL)" stroke="#3E3244" stroke-width="1.3" stroke-opacity=".5"/>
    <path d="${faixa(146, 294, -1, 3, 1, 17, 1.4)}" fill="url(#adMorenaL)" stroke="#3E3244" stroke-width="1.3" stroke-opacity=".5"/>
    <path d="M${Array.from({ length:25 }, (_, k) => { const yy = 150 + k * 6; return `${f1(GX(yy) - GW(yy) - 8)} ${yy}`; }).join(' L')} M${Array.from({ length:25 }, (_, k) => { const yy = 150 + k * 6; return `${f1(GX(yy) + GW(yy) + 8)} ${yy}`; }).join(' L')}" stroke="#DCD0CE" stroke-width="1.5" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"/>
    <g stroke="#4E4450" stroke-width=".5">${Array.from({ length:50 }, (_, k) => { const lado = k % 2 ? 1 : -1, yy = R(152, 292), xx = GX(yy) + lado * (GW(yy) + R(2, 14)); return `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="${f1(R(1.4, 3))}" ry="${f1(R(1, 2))}" fill="${['#8A7E84', '#B8ACAA', '#6E6268', '#A09294'][k % 4]}"/>`; }).join('')}</g>
    <g id="ad-riachos" style="opacity:0;transition:opacity 1.2s">
      <path d="M380 262 C384 276 394 284 406 290 C420 296 430 302 438 312 M394 282 C390 292 398 300 412 306 C420 310 426 312 432 316" stroke="#2A6E9E" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
      <path d="M394 282 C390 292 398 300 412 306 C420 310 426 312 432 316" stroke="#5EC6EE" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path id="ad-riacho1" d="M372 254 C378 270 394 282 406 290 C420 296 430 302 438 312" stroke="#4AB8F0" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path id="ad-riacho2" d="M474 160 C482 190 494 214 496 238 C498 262 504 286 506 306" stroke="#4AB8F0" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path class="ad-fluxo" d="M372 254 C378 270 394 282 406 290 C420 296 430 302 438 312 M474 160 C482 190 494 214 496 238 C498 262 504 286 506 306" stroke="#E6F8FF" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-dasharray="3 14" opacity=".8"/>
      <g fill="#fff" opacity=".85"><circle cx="483" cy="192" r="1.6"/><circle cx="496" cy="240" r="1.8"/><circle cx="500" cy="276" r="1.4"/><ellipse cx="507" cy="306" rx="5" ry="1.8"/></g>
    </g>
    <g id="ad-gelo"><path id="ad-gelo-corpo" fill="url(#adGelo)" stroke="#8AB4DA" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M404 104 C410 112 408 124 400 136 C394 146 386 156 376 170 L364 164 C374 152 382 140 388 128 C393 118 398 108 404 104Z" fill="url(#adGelo)" stroke="#8AB4DA" stroke-width="1.4"/><path d="M400 112 l-5 4 M394 126 l-5 3 M386 140 l-5 3" stroke="#6EA6D8" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M300 70 C312 80 326 92 338 102 C350 110 360 116 368 118 C354 120 336 112 322 100 C312 90 304 80 300 70Z" fill="#fff" opacity=".9"/>
      <path id="ad-gelo-sombra" fill="url(#adGeloSombra)"/>
      <path d="M296 100 C312 112 334 122 356 126" stroke="#3E7AB4" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M297 103 C313 115 335 125 356 129" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path id="ad-gelo-fenda" fill="#4A86C0" stroke="#2E6CA8" stroke-width=".5" stroke-linejoin="round" opacity=".85"/>
      <path id="ad-gelo-moraina" stroke="#7A6C70" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
      <path id="ad-gelo-frente" fill="#7E8E9C" stroke="#4E5E70" stroke-width="1"/><path id="ad-gelo-sujo" fill="#5E5458" opacity=".75"/>
      <path id="ad-gelo-boca" fill="#1A3E6A"/>
      <path id="ad-gelo-luz" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M361 124 L367 116 L372 117 L377 111 L384 119 L381 130 L377 140 L372 155 L368 144 L364 134Z" fill="#7A6280" stroke="#4A3A52" stroke-width="1.2" stroke-linejoin="round"/><path d="M364 124 L368 118 L372 119 L377 113" stroke="#E2D2D0" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M377 113 L384 119 L381 130 L377 140 L372 155 L374 138 L378 124Z" fill="#4A3A52" opacity=".45"/><path d="M366 120 C370 116 376 113 382 117 C376 118 372 120 366 122Z" fill="#fff"/>
      <path d="M314 86 l5 5 l-1 6 M330 98 l4 3 M292 92 l4 6" stroke="#6E5A74" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>
      <g id="ad-gelo-hint" style="display:none">${brilhoHotspot(378, 120)}</g></g>
    <rect x="0" y="250" width="800" height="70" fill="url(#adNevoaBaixa)" opacity=".7" pointer-events="none"/>
    <path d="M-10 330 C30 306 80 292 130 294 C180 296 220 300 262 308 L262 340 H-10Z" fill="url(#adColina)" stroke="#6E6A3A" stroke-width="1.4"/>
    <path d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272 V500 H0Z" fill="url(#adPuna)"/>
    <path id="ad-verde" d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272 V500 H0Z" fill="url(#adPunaVerde)" style="opacity:0;transition:opacity 1.5s"/>
    <path d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272" stroke="#F6EAB0" stroke-width="3" fill="none" opacity=".65"/>
    <path d="M0 360 C120 344 240 350 330 346 M0 410 C100 396 200 400 260 406" stroke="#8E8A3E" stroke-width="10" fill="none" opacity=".15" stroke-linecap="round"/>
    <g>${Array.from({ length:70 }, () => { const x = R(0, 520), y = R(318, 440), s = .55 + (y - 318) / 110; return tufo(x, y, s, '#F2E2A0', '#A0943E'); }).join('')}</g>
    <g>${Array.from({ length:7 }, () => { const x = R(30, 300), y = R(318, 340); return ichu(x, y, R(10, 14), '#EEDC90', '#9A8A3A'); }).join('')}</g>
    <g>${[[120, 360, 16], [170, 330, 11], [560, 300, 10], [44, 384, 13], [300, 318, 9], [610, 292, 8]].map(([x, y, r]) => yareta(x, y, r)).join('')}</g>
    ${puya(160, 324, 66)}
    ${pedra(276, 330, 9, 6)}${pedra(36, 344, 7, 5)}${pedra(220, 410, 8, 5)}
    <g id="ad-lago" class="toque">
      <path d="M380 320 C382 302 426 292 468 293 C516 292 560 298 570 314 C576 330 546 346 500 348 C462 351 420 350 398 342 C382 336 378 328 380 320Z" fill="#A69A72" stroke="#6E6040" stroke-width="2"/>
      <path d="${LAGOD}" fill="url(#adLagoSeco)" stroke="#5E5040" stroke-width="1.2"/>
      <path d="M430 320 l10 4 l8 -3 M470 326 l6 -5 l10 2 M500 318 l8 5 M452 314 l6 -4" stroke="#4E4232" stroke-width="1" fill="none" opacity=".5"/>
      <g id="ad-agua" style="transform-origin:${LAGO.x}px ${LAGO.y + 3}px;transform:scale(.22);transition:transform 1.2s"><g clip-path="url(#adLagoClip)">
        <path d="${LAGOD}" fill="url(#adLago)"/>
        <path d="M400 300 L428 318 L446 306 L468 324 L500 300Z" fill="#E6FAFF" opacity=".28"/>
        <path d="M430 300 L452 314 L468 324 L486 300Z" fill="#fff" opacity=".25"/>
        <path d="M504 300 L528 316 L556 300Z" fill="#BCD8F0" opacity=".25"/>
        <path d="M392 318 C394 306 428 299 468 300 C510 299 548 304 558 315" stroke="#C8FFF6" stroke-width="5" fill="none" opacity=".55"/>
        <path d="M${LAGO.x - 54} ${LAGO.y + 2} h30 M${LAGO.x + 10} ${LAGO.y + 8} h36 M${LAGO.x - 20} ${LAGO.y + 14} h24 M${LAGO.x + 50} ${LAGO.y - 4} h18" stroke="#E6FFFF" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      </g><path d="${LAGOD}" fill="none" stroke="#16607A" stroke-width="1.6"/></g>
      <path d="M548 312 v-16 M552 314 v-20 M556 312 v-14 M400 330 v-14 M404 332 v-18" stroke="#5E7A2E" stroke-width="2" stroke-linecap="round"/><path d="M552 294 v-4 M404 314 v-4" stroke="#8A5A2A" stroke-width="3" stroke-linecap="round"/>
      ${[[-88, 0, 10, 7], [-70, 16, 8, 6], [92, 6, 12, 8], [60, 22, 9, 6], [-20, 24, 7, 5], [24, 26, 6, 4]].map(([dx, dy, rx, ry]) => pedra(LAGO.x + dx, LAGO.y + dy + 4, rx, ry)).join('')}
    </g>
    <path d="M552 322 L560 326" stroke="#7A6E62" stroke-width="9" stroke-linecap="round"/>
    <path d="M520 500 L506 456 C540 420 560 380 590 330 C640 316 720 300 800 296 V500Z" fill="url(#adEncosta)"/>
    <path d="M506 456 C540 420 560 380 590 330 C640 316 720 300 800 296" stroke="#D2E08A" stroke-width="2.4" fill="none" opacity=".6"/>
    <g>${Array.from({ length:26 }, () => { const x = R(600, 790), y = R(300, 318); return tufo(x, y, .7, '#E6F0A0', '#5E7A2E'); }).join('')}</g>
    ${LINHAS.map(campo).join('')}
    <g id="ad-canal"><path d="${CANAL}" stroke="#3E3430" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${CANAL}" stroke="#B8A894" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="7 2"/><path d="${CANAL}" stroke="#6E5A48" stroke-width="5.4" fill="none" stroke-linecap="round"/><path id="ad-canal-agua" d="${CANAL}" stroke="#3E9AE6" stroke-width="4.4" fill="none" stroke-linecap="round" style="opacity:0"/><path class="ad-fluxo2" d="${CANAL}" stroke="#D8F2FF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="5 10" style="opacity:0"/></g>
    <g id="ad-ramos">${RAMOS.map((d, i) => `<g class="ad-ramo" data-i="${i}"><path d="${d}" stroke="#3E3430" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#B8A894" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-dasharray="6 1.6"/><path d="${d}" stroke="#6E5A48" stroke-width="3.6" fill="none" stroke-linecap="round"/><path class="ad-ramo-agua" d="${d}" stroke="#3E9AE6" stroke-width="3.4" fill="none" stroke-linecap="round" style="opacity:0"/><path class="ad-ramo-fluxo" d="${d}" stroke="#D8F2FF" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="5 10" style="opacity:0"/></g>`).join('')}</g>
    <g id="ad-iaque" class="toque" data-fig="iaque"><ellipse cx="248" cy="360" rx="46" ry="6" fill="#3A3414" opacity=".25"/><g id="ad-iaque-in" style="transform-origin:250px 362px"><svg x="190" y="282" width="112" height="82" viewBox="0 0 150 110"><use href="#f-iaque"/></svg></g>${brilhoHotspot(296, 296)}</g>
    <g id="ad-vizcacha" class="toque"><g id="ad-viz-in" style="transition:transform .5s cubic-bezier(.3,1.6,.5,1);transform:translateY(12px)">
      <path d="M368 360 C380 352 386 340 380 332 C376 342 370 350 362 354Z" fill="#8A7A6A" stroke="#4E4038" stroke-width="1.2"/>
      <ellipse cx="352" cy="352" rx="14" ry="11" fill="#C2B4A2" stroke="#5E5044" stroke-width="1.6"/>
      <path d="M340 334 C336 322 338 314 342 314 C346 318 346 326 344 334Z M348 332 C348 320 352 314 356 316 C358 322 354 328 352 334Z" fill="#C2B4A2" stroke="#5E5044" stroke-width="1.3"/><path d="M341 330 c-1 -6 0 -10 1.4 -11 M350 330 c1 -6 3 -9 4.4 -10" stroke="#E8B4A8" stroke-width="1.4" fill="none"/>
      <circle cx="344" cy="342" r="10" fill="#D2C6B4" stroke="#5E5044" stroke-width="1.6"/><circle cx="340" cy="340" r="2.4" fill="#1A1210"/><circle cx="340.8" cy="339.2" r=".8" fill="#fff"/><ellipse cx="335" cy="345" rx="2" ry="1.4" fill="#5E4038"/><path d="M336 348 l-8 1 M336 346 l-8 -2" stroke="#5E5044" stroke-width=".6"/></g>
      ${pedra(352, 366, 30, 16)}${pedra(380, 370, 16, 10)}<rect x="320" y="318" width="80" height="54" fill="transparent"/></g>
    <g id="ad-vila">
      <path d="M222 470 C240 446 300 424 360 430 C410 436 440 456 446 480 C420 496 300 498 240 490Z" fill="#B49A6A" opacity=".55"/>
      <path d="M232 474 C260 452 310 436 360 440" stroke="#8E7A4E" stroke-width="1" fill="none" opacity=".5" stroke-dasharray="3 4"/>
      ${casa(256, 452, 50, 30, '#C8502E', '#7A2A14')}${casa(318, 438, 44, 26, '#D8A44A', '#8A6418', true)}${casa(340, 478, 46, 28, '#B8482A', '#6E2210')}
      <g><path d="M222 466 C226 462 236 462 240 466 C246 462 254 464 256 468 L256 474 H222Z" fill="url(#adPedra)" stroke="#4A3E44" stroke-width="1.2"/><path d="M226 468 h8 M240 470 h10" stroke="#4A3E44" stroke-width=".8"/></g>
      <g id="ad-pila"><ellipse cx="404" cy="490" rx="30" ry="6" fill="#2E2418" opacity=".25"/><ellipse cx="404" cy="478" rx="26" ry="9" fill="#5E524C"/><path d="M378 478 V490 C390 498 418 498 430 490 V478" fill="url(#adPedra)" stroke="#3A3036" stroke-width="1.6"/><ellipse cx="404" cy="478" rx="26" ry="9" fill="none" stroke="#3A3036" stroke-width="1.6"/><path d="M380 476 C390 470 416 470 428 476" stroke="#E6DCD8" stroke-width="1.2" fill="none" opacity=".7"/><ellipse id="ad-pila-agua" cx="404" cy="479" rx="21" ry="6" fill="#3EAEE6" style="opacity:0;transition:opacity 1.2s"/><path d="M386 484 v8 M398 486 v9 M412 486 v9 M424 484 v7" stroke="#4A3E3A" stroke-width="1" opacity=".6"/>
        <path id="ad-bica" d="M428 472 Q418 470 414 478" stroke="#7FD0FF" stroke-width="3" fill="none" stroke-linecap="round" style="opacity:0"/></g>
      <g id="ad-crianca" class="toque"><path d="M376 498 v-12 M382 498 v-12" stroke="#2E3A6A" stroke-width="4.4" stroke-linecap="round"/><path d="M371 488 C371 472 387 472 387 488Z" fill="#E5392C" stroke="#7A1A14" stroke-width="1.4"/><path d="M372 482 h14 M372 478 h14" stroke="#FFC83D" stroke-width="1.4"/><path id="ad-braco" d="M386 478 l9 -9" stroke="#A8724A" stroke-width="3.6" stroke-linecap="round" style="transform-origin:386px 478px"/><circle cx="379" cy="466" r="7.4" fill="#B8804E" stroke="#5E3414" stroke-width="1.4"/><path d="M371 464 C371 454 387 454 387 464 L389 466 H369Z" fill="#3E8AD6" stroke="#1E4A8A" stroke-width="1.2"/><path d="M379 455 v-3" stroke="#FFC83D" stroke-width="2.4" stroke-linecap="round"/><circle cx="381.6" cy="466.6" r="1.2" fill="#1A1210"/><path d="M379 470 q2.4 1.6 4 0" stroke="#5E3414" stroke-width="1" fill="none"/><rect x="364" y="448" width="34" height="52" fill="transparent"/></g>
    </g>
    ${PORTAS.map(porta).join('')}
    <path d="M0 448 C70 432 150 440 210 458 C260 472 300 486 330 500 H0Z" fill="url(#adFrente)" stroke="#4E5622" stroke-width="2"/>
    <path d="M0 450 C70 434 150 442 210 460" stroke="#D2DC7A" stroke-width="2" fill="none" opacity=".6"/>
    <g>${Array.from({ length:34 }, () => { const x = R(0, 300), y = R(452, 500); if (y < 440 + x * .1) return ''; return tufo(x, y, R(1.2, 1.7), '#D8E880', '#3E5A1E'); }).join('')}</g>
    ${yareta(96, 484, 12)}${pedra(300, 496, 12, 7)}
    <g id="ad-quilla" class="toque" data-fig="lhama"><ellipse cx="82" cy="468" rx="44" ry="6" fill="#2E3410" opacity=".3"/><g id="ad-quilla-in" style="transform-origin:84px 472px"><svg x="18" y="332" width="128" height="139" viewBox="0 0 120 130"><use href="#f-lhama"/></svg></g>${brilhoHotspot(136, 350)}</g>
    <g id="ad-flores" class="toque">${flor(176, 478, 4.6, '#FF8A2A', '#A8400E')}${flor(194, 486, 4, '#FFD447', '#A07A08', '#E5392C')}${flor(214, 476, 4.2, '#FF5A8A', '#A02A50')}${flor(232, 488, 3.4, '#FFFFFF', '#8A7AA8')}${lupino(160, 494, 30)}${lupino(232, 494, 24)}${lupino(246, 496, 20)}<rect x="150" y="458" width="94" height="40" fill="transparent"/></g>
    ${ichu(10, 500, 44, '#F2DC8A', '#9A8A3A')}${ichu(40, 500, 34, '#E8CE6E', '#8A7A2E')}${ichu(150, 500, 30, '#F2DC8A', '#9A8A3A')}${ichu(280, 500, 26, '#E8CE6E', '#8A7A2E')}${ichu(486, 500, 30, '#F2DC8A', '#9A8A3A')}
    ${queuna(770, 500, 1.15)}${ichu(720, 500, 36, '#E8CE6E', '#8A7A2E')}${ichu(796, 500, 30, '#F2DC8A', '#9A8A3A')}
    <g id="ad-condor" class="toque" data-fig="condor"><g class="deriva" style="animation-duration:22s"><g id="ad-condor-voo"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><svg x="548" y="196" width="116" height="68" viewBox="0 0 170 100"><use href="#f-condor"/></svg></g></g></g>${brilhoHotspot(652, 204)}</g>
    <g id="ad-inverno" pointer-events="none" style="transition:opacity 1.2s"><rect width="800" height="500" fill="#B4C6E8" opacity=".3"/></g>
    <g id="ad-nuvens">${NUVENS.map((n, i) => `<g class="ad-nuvem toque" data-i="${i}" style="transition:opacity 1.2s"><g style="animation:flutua ${(3 + i * .5).toFixed(1)}s ease-in-out infinite alternate"><use href="#nuvem" x="${n.x - 72}" y="${n.y - 30}" width="144" height="70" style="color:#7E8AA6"/><use href="#nuvem" x="${n.x - 68}" y="${n.y - 30}" width="136" height="64" style="color:#E8EEF6"/><use href="#nuvem" x="${n.x - 46}" y="${n.y - 4}" width="92" height="38" style="color:#BAC4D8"/><path d="M${n.x - 50} ${n.y - 6} q12 -9 28 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g class="ad-dica">${brilhoHotspot(n.x + 46, n.y - 14)}</g></g><rect x="${n.x - 74}" y="${n.y - 34}" width="148" height="76" fill="transparent"/></g>`).join('')}</g>
    <g id="ad-sol-trilha" style="display:none"><path d="M${SOL0.x} ${SOL0.y} Q400 ${SOL0.y - 150} ${SOL1.x} ${SOL1.y}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 10" opacity=".9"/><path d="M${SOL1.x - 4} ${SOL1.y + 2} l12 -2 l-6 -11Z" fill="#fff"/></g>
    <g id="ad-sol" class="toque" style="display:none;cursor:grab"><g id="ad-sol-pos"><circle r="50" fill="#FFE27A" opacity=".22"/><circle r="38" fill="#FFE27A" opacity=".3"/><circle r="26" fill="url(#adSolG)" stroke="#E8901A" stroke-width="2.4"/><path d="M-14 -10 q8 -9 20 -9" stroke="#FFF8D2" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-8" cy="2" r="2.2" fill="#8A4A0E"/><circle cx="8" cy="2" r="2.2" fill="#8A4A0E"/><path d="M-6 9 q6 5 12 0" stroke="#8A4A0E" stroke-width="2" fill="none" stroke-linecap="round"/><g id="ad-sol-hint">${brilhoHotspot(22, -22)}</g><circle r="48" fill="transparent"/></g></g>
    <rect width="800" height="500" fill="url(#adVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#adGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* geleira desenhada pela posição da ponta (y): circo de neve no alto, língua de gelo entre morenas, fendas e frente com caverna de gelo */
  const corpo = el(s, '#ad-gelo-corpo'), fenda = el(s, '#ad-gelo-fenda'), frente = el(s, '#ad-gelo-frente'), luz = el(s, '#ad-gelo-luz'), sombra = el(s, '#ad-gelo-sombra'), boca = el(s, '#ad-gelo-boca'), medial = el(s, '#ad-gelo-moraina');
  const sujo = el(s, '#ad-gelo-sujo');
  function desenhaGelo(y){
    const f = n => n.toFixed(1), fim = Math.max(158, y - 8), E = [], D = [];
    for (let yy = 150; yy < fim; yy += 5) { E.push([GX(yy) - GW(yy) + 1.4 * Math.sin(yy * .21), yy]); D.push([GX(yy) + GW(yy) + 1.4 * Math.sin(yy * .17 + 1), yy]); }
    E.push([GX(fim) - GW(fim), fim]); D.push([GX(fim) + GW(fim), fim]);
    const P = a => a.map(p => `${f(p[0])} ${f(p[1])}`).join(' L'), cx = GX(y), w = GW(y);
    corpo.setAttribute('d', `M${P(E.slice().reverse())} C306 144 302 140 300 132 C296 128 298 122 294 116 C290 110 292 104 288 98 C286 90 290 84 292 78 L300 64 C312 74 326 88 338 98 C352 108 362 114 372 114 C380 112 386 108 392 104 C392 112 388 116 384 122 C380 126 382 132 376 136 C372 140 370 146 ${f(D[0][0])} 150 L${P(D)} Q${f(cx + 2)} ${f(y + 10)} ${f(E[E.length - 1][0])} ${f(E[E.length - 1][1])}Z`);
    sombra.setAttribute('d', `M${f(GX(150) + GW(150) * .25)} 150 L${P(D)} Q${f(cx + w * .6)} ${f(y + 4)} ${f(cx + w * .3)} ${f(y + 2)} L${P(D.slice().reverse().map(p => [GX(p[1]) + GW(p[1]) * .25, p[1]]))}Z`);
    let d = '';
    for (let yy = 162, k = 0; yy < y - 14; yy += 13, k++) { const m = GX(yy), g = GD(yy), a1 = GW(yy) - 4 - (k % 2) * 5, a2 = GW(yy) - 4 - ((k + 1) % 2) * 6;
      d += `M${f(m - a1)} ${f(yy + a1 * g)} Q${f(m + 6 * g)} ${f(yy + 6)} ${f(m + a2)} ${f(yy - a2 * g)} Q${f(m + 3.5 * g)} ${f(yy + 3.6)} ${f(m - a1)} ${f(yy + a1 * g)}Z `; }
    d += 'M314 116 Q324 124 336 126 Q324 122 314 116Z M306 130 Q318 138 330 140 Q318 136 306 130Z';
    fenda.setAttribute('d', d);
    frente.setAttribute('d', `M${f(cx - w + 1)} ${f(y - 12)} Q${f(cx + 2)} ${f(y + 10)} ${f(cx + w - 1)} ${f(y - 12)} Q${f(cx + 1)} ${f(y - 1)} ${f(cx - w + 1)} ${f(y - 12)}Z`);
    sujo.setAttribute('d', [[-8, -6, 1.6], [-3, -3, 1.2], [5, -5, 1.5], [9, -9, 1], [-11, -11, 1.1], [1, -12, 1], [12, -12, 1.2], [-6, -15, .9]].map(([dx, dy, r]) => `M${f(cx + dx - r)} ${f(y + dy)} a${r} ${r} 0 1 0 ${f(2 * r)} 0 a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`).join(' ') + ` M${f(cx - w + 3)} ${f(y - 16)} Q${f(cx)} ${f(y - 9)} ${f(cx + w - 3)} ${f(y - 17)} Q${f(cx)} ${f(y - 12)} ${f(cx - w + 3)} ${f(y - 16)}Z`);
    boca.setAttribute('d', y > 192 ? `M${f(cx - 5)} ${f(y + 1)} Q${f(cx - 5)} ${f(y - 7)} ${f(cx + 1)} ${f(y - 7.5)} Q${f(cx + 7)} ${f(y - 7)} ${f(cx + 7)} ${f(y + 1)} Q${f(cx + 1)} ${f(y + 2.4)} ${f(cx - 5)} ${f(y + 1)}Z` : '');
    const ml = []; for (let yy = 156; yy < y - 4; yy += 6) ml.push([GX(yy) + 4, yy]);
    medial.setAttribute('d', ml.length > 1 ? `M${P(ml)}` : '');
    const lz = []; for (let yy = 156; yy < y - 14; yy += 6) lz.push([GX(yy) - GW(yy) + 4, yy]);
    luz.setAttribute('d', `M292 86 C294 104 300 122 312 136` + (lz.length > 1 ? ` M${P(lz)}` : ''));
  }
  desenhaGelo(geloY);
  const fluxos = [...s.querySelectorAll('.ad-fluxo, .ad-fluxo2')];
  fluxos.forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-30 }], { duration:900, iterations:Infinity }));
  /* 1. neve: tocar nas nuvens para nevar nos picos */
  const nuvens = [...s.querySelectorAll('.ad-nuvem')], camadas = [...s.querySelectorAll('.ad-neve')];
  nuvens.forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'neve' || g.dataset.feito || ocupado) return; g.dataset.feito = 1; ocupado = true;
    const n = NUVENS[+g.dataset.i]; el(g, '.ad-dica').style.display = 'none'; toca('chuva');
    g.animate([{ transform:'translateY(0)' }, { transform:'translateY(4px)' }, { transform:'translateY(0)' }], { duration:500, iterations:3 });
    for (let i = 0; i < 60; i++) c.add({ tipo:'floco', x:sorte(n.a, n.b), y:n.y + sorte(0, 16) - i * 3, vy:sorte(.9, 1.5), f:sorte(0, 6), r:sorte(2, 3.8), chao:sorte(...n.chao) });
    depois(1500, () => {
      neves++; camadas[neves - 1] && (camadas[neves - 1].style.opacity = 1); geloAlvo = 182 + neves * 33;
      c.brilhos(372, 140 + neves * 24, 6, '#FFFFFF'); toca('ok');
      api.hud(`<span class="chip">Neve: ${neves}/3</span>`);
      depois(1300, () => { g.style.opacity = 0; g.style.pointerEvents = 'none'; ocupado = false; });
      if (neves === 1) api.diz('A neve se acumula no alto, camada sobre camada.');
      if (neves === 2) api.diz('A neve fica tão apertada que vira gelo. A geleira está crescendo!');
      if (neves === 3) { toca('vitoria'); api.diz('Que geleira grande! Ela é a caixa-d\'água da montanha: guarda a água do inverno em forma de gelo.'); depois(5600, comecaVerao); }
    });
  }));
  /* 2. verão: arrastar o sol pelo céu, a geleira derrete devagar e enche o lago */
  const solG = el(s, '#ad-sol'), solPos = el(s, '#ad-sol-pos'), trilha = el(s, '#ad-sol-trilha');
  const poeSol = u => { const p = solXY(u); solPos.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); };
  let solU = 0;
  function comecaVerao(){
    fase = 'sol'; solG.style.display = ''; trilha.style.display = ''; poeSol(0);
    trilha.animate([{ opacity:.25 }, { opacity:1 }, { opacity:.25 }], { duration:1600, iterations:Infinity });
    api.hud('<span class="chip">Degelo: 0/4</span>');
    api.diz('Chegou o verão! Arraste o sol pelo céu, de um lado ao outro.');
  }
  function derrete(u){
    if (u <= derr) return; derr = Math.min(1, u);
    el(s, '#ad-inverno').style.opacity = (1 - derr).toFixed(2);
    geloAlvo = 281 - 30 * derr;
    el(s, '#ad-riachos').style.opacity = derr > .04 ? 1 : 0;
    el(s, '#ad-riacho1').setAttribute('stroke-width', (1.5 + derr * 4).toFixed(1)); el(s, '#ad-riacho2').setAttribute('stroke-width', (1 + derr * 3).toFixed(1));
    el(s, '#ad-agua').style.transform = `scale(${(.22 + .78 * derr).toFixed(2)})`;
    el(s, '#ad-verde').style.opacity = (derr * .55).toFixed(2);
    if (Math.random() < .5) c.add({ tipo:'infiltra', x0:GX(geloY) + sorte(-10, 10), y0:geloY - 4, x1:440 + sorte(-6, 6), y1:LAGO.y - 4, dur:sorte(40, 70), f:sorte(0, 6) });
    const m = Math.floor(derr * 4 + .001);
    if (m > marco) {
      marco = m; toca('splash'); api.hud(`<span class="chip">Degelo: ${marco}/4</span>`);
      for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:LAGO.x + sorte(-50, 50), y:LAGO.y + sorte(-4, 8), t:i * 2, cor:'#E6FFFF' });
      if (marco === 1) api.diz('O sol derrete a ponta da geleira bem devagarinho.');
      if (marco === 2) api.diz('A água do degelo desce a montanha em riachos.');
      if (marco === 3) api.diz('O lago está enchendo! A água de geleira fica azul-turquesa.');
      if (marco === 4) { fase = 'regar'; toca('vitoria'); trilha.style.display = 'none'; el(s, '#ad-sol-hint').style.display = 'none'; solG.style.cursor = '';
        api.diz('Mesmo sem chuva, a geleira solta água o verão inteiro, bem na época seca!'); depois(5200, comecaCanais); }
    }
  }
  let pegaSol = null, animSol = false;
  solG.addEventListener('pointerdown', e => { if (fase !== 'sol' || animSol) return; e.stopPropagation(); const p = c.ponto(e); pegaSol = { x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); solG.style.cursor = 'grabbing'; toca('clique'); });
  s.addEventListener('pointermove', e => { if (!pegaSol) return; const p = c.ponto(e); if (Math.hypot(p.x - pegaSol.x0, p.y - pegaSol.y0) > 8) pegaSol.moveu = true; if (!pegaSol.moveu) return;
    const u = Math.max(solU, Math.min(1, (p.x - SOL0.x) / (SOL1.x - SOL0.x))); solU = u; poeSol(u); derrete(u); });
  s.addEventListener('pointerup', () => { if (!pegaSol) return; const m = pegaSol.moveu; pegaSol = null; solG.style.cursor = fase === 'sol' ? 'grab' : '';
    if (!m && fase === 'sol') { const u0 = solU, u1 = Math.min(1, Math.floor(solU * 4 + .001) / 4 + .25), t0 = performance.now(); animSol = true; toca('vapor');
      (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1200); solU = u0 + (u1 - u0) * k; poeSol(solU); derrete(solU); if (k < 1) requestAnimationFrame(q); else animSol = false; })(t0); } });
  /* 3. canais: abrir as comportas de pedra para regar os terraços e levar água à vila */
  function comecaCanais(){
    fase = 'canais';
    const ag = el(s, '#ad-canal-agua'), L = ag.getTotalLength(); ag.style.opacity = 1; ag.style.strokeDasharray = L; ag.style.strokeDashoffset = L;
    ag.animate([{ strokeDashoffset:L }, { strokeDashoffset:0 }], { duration:1800, fill:'forwards', easing:'ease-out' });
    depois(1800, () => { el(s, '.ad-fluxo2').style.opacity = .9; s.querySelectorAll('.ad-porta .ad-dica').forEach(h => h.style.display = ''); });
    toca('splash'); api.hud('<span class="chip">Canais: 0/4</span>');
    api.diz('A água precisa chegar às plantações e à vila. Toque nas comportas de pedra para abrir os canais!');
  }
  const FALAS = ['Quinoa! Ela cresce bem no frio, lá no alto da montanha.', 'Batata! Nos Andes existem milhares de tipos de batata.', 'Arroz em degraus! Os terraços seguram a água e a terra no morro.', 'A água chegou na vila! As pessoas usam para beber, cozinhar e lavar.'];
  s.querySelectorAll('.ad-porta').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); const i = +g.dataset.i;
    if (fase !== 'canais') { toca('clique'); api.diz('É uma comporta de pedra. Ela abre e fecha o caminho da água nos canais.'); return; }
    if (g.dataset.feito) return; g.dataset.feito = 1; abertos++;
    el(g, '.ad-tabua').style.transform = 'translateY(-13px)'; el(g, '.ad-dica').style.display = 'none'; toca('clique');
    const ramo = s.querySelectorAll('.ad-ramo')[i], ag = el(ramo, '.ad-ramo-agua'), L = ag.getTotalLength();
    ag.style.opacity = 1; ag.style.strokeDasharray = L; ag.animate([{ strokeDashoffset:L }, { strokeDashoffset:0 }], { duration:i === 3 ? 700 : 1600, fill:'forwards', easing:'ease-out' });
    depois(i === 3 ? 700 : 1600, () => { const fl = el(ramo, '.ad-ramo-fluxo'); fl.style.opacity = .9; fl.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-30 }], { duration:900, iterations:Infinity }); });
    depois(900, () => toca('splash'));
    if (i < 3) {
      const t = s.querySelectorAll('.ad-terraco')[i];
      depois(1200, () => { el(t, '.ad-umido').style.opacity = 1; });
      depois(1900, () => { t.querySelectorAll('.ad-planta').forEach(p => p.style.transform = 'scale(1)'); toca('planta'); c.brilhos(700, LINHAS[i].y - 6, 8, '#FFE27A'); });
    } else {
      depois(700, () => { el(s, '#ad-bica').style.opacity = 1; el(s, '#ad-pila-agua').style.opacity = 1; for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:412 + sorte(-6, 6), y:478, t:k * 3, cor:'#E6F6FF' }); });
      depois(1500, () => { el(s, '#ad-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-35deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:3 }); c.brilhos(404, 466, 6, '#BFF4FF'); });
    }
    api.hud(`<span class="chip">Canais: ${abertos}/4</span>`);
    if (abertos < 4) api.diz(FALAS[i]);
    else { depois(2200, () => { fase = 'fim'; toca('vitoria'); api.diz('As geleiras guardam água no inverno e soltam devagar no tempo seco. Mas o planeta está esquentando e elas estão encolhendo. Por isso precisamos cuidar delas!'); depois(6800, api.fim); }); api.diz(FALAS[i]); }
  }));
  /* toques extras */
  el(s, '#ad-quilla').addEventListener('click', () => {
    [196, 220, 208, 186].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .32, 'triangle', .05, f * 1.06), i * 260));
    el(s, '#ad-quilla-in').animate([{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(-8px) rotate(-2deg)' }, { transform:'translateY(0) rotate(0)' }, { transform:'translateY(-4px) rotate(1deg)' }, { transform:'translateY(0)' }], { duration:900 });
    api.diz(fase === 'neve' ? 'Hmmm! Lhamas cantarolam assim para conversar. Toque nas nuvens para nevar!' : fase === 'sol' ? 'Hmmm! Arraste o sol pelo céu para chegar o verão.' : 'Hmmm! Meu pelo grosso me esquenta no frio da montanha.');
  });
  let condorOcupado = false;
  el(s, '#ad-condor').addEventListener('click', () => { toca('pop'); if (condorOcupado) return; condorOcupado = true;
    const v = el(s, '#ad-condor-voo').animate([{ transform:'translate(0,0)' }, { transform:'translate(-120px,-70px)' }, { transform:'translate(-220px,-20px)' }, { transform:'translate(-100px,30px)' }, { transform:'translate(0,0)' }], { duration:5200, easing:'ease-in-out' });
    v.onfinish = () => { condorOcupado = false; };
    api.diz('O condor-dos-andes quase não bate as asas: ele plana no ar quente que sobe a montanha.'); });
  el(s, '#ad-iaque').addEventListener('click', () => { [92, 84].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .4, 'sawtooth', .04, f * .8), i * 380));
    el(s, '#ad-iaque-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-3deg)' }, { transform:'rotate(2deg)' }, { transform:'rotate(0)' }], { duration:700 });
    api.diz('Um iaque do Himalaia! Ele grunhe em vez de mugir, e o pelo comprido aguenta muito frio.'); });
  let leoOcupado = false;
  el(s, '#ad-leopardo').addEventListener('click', () => { if (leoOcupado) return; leoOcupado = true; toca('pop'); el(s, '#ad-leo-in').style.transform = 'translateY(-18px)';
    api.diz('Um leopardo-das-neves! Ele enrola a cauda peluda no corpo como um cachecol.');
    depois(2600, () => { el(s, '#ad-leo-in').style.transform = ''; leoOcupado = false; }); });
  let vizOcupada = false;
  el(s, '#ad-vizcacha').addEventListener('click', e => { e.stopPropagation(); if (vizOcupada) return; vizOcupada = true; toca('pop'); el(s, '#ad-viz-in').style.transform = 'translateY(-6px)';
    api.diz('Uma viscacha! Parece coelho, mas é parente da chinchila.'); depois(2200, () => { el(s, '#ad-viz-in').style.transform = 'translateY(12px)'; vizOcupada = false; }); });
  el(s, '#ad-flores').addEventListener('click', e => { e.stopPropagation(); toca('planta');
    for (let i = 0; i < 10; i++) c.add({ tipo:'petala', x:200 + sorte(-44, 44), y:440 - i * 5, vy:sorte(.5, 1), f:sorte(0, 6), chao:500, cor:['#FF8A2A', '#FFD447', '#FF5A8A', '#B57BFF'][i % 4], borda:'#7A3A1E' });
    api.diz('Lá no alto as plantas são baixinhas, para fugir do vento gelado.'); });
  el(s, '#ad-lago').addEventListener('click', e => { e.stopPropagation(); const p = c.ponto(e); toca(derr > .3 ? 'splash' : 'clique');
    if (derr > .3) { for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:i * 3, cor:'#E6FFFF' }); api.diz('A água do lago é geladinha, porque vem da geleira!'); }
    else api.diz('O lago está quase seco. Ele espera a água da geleira.'); });
  el(s, '#ad-crianca').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ad-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-35deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    api.diz(abertos >= 4 ? 'Obrigada! Agora tem água na vila!' : 'Oi! A água da nossa vila vem lá da geleira.'); });
  el(s, '#ad-gelo').addEventListener('click', e => { e.stopPropagation(); toca('clique'); c.brilhos(372, geloY - 60, 4, '#FFFFFF'); api.diz('Uma geleira é um rio de gelo. Ela escorrega montanha abaixo bem devagar.'); });
  /* vida: neve caindo no inverno e a geleira se ajustando */
  let ultN = 0;
  (function vida(t){ if (!vivo) return;
    if (Math.abs(geloAlvo - geloY) > .2) { geloY += (geloAlvo - geloY) * .04; desenhaGelo(geloY); }
    if (fase === 'neve' && t - ultN > 300) { ultN = t; c.add({ tipo:'floco', x:sorte(0, 800), y:-6, vy:sorte(.5, 1), f:sorte(0, 6), r:sorte(1.2, 2.6), chao:sorte(200, 480) }); }
    requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Neve: 0/3</span>');
  api.diz('Oi, eu sou a Quilla, uma lhama! Aqui no alto faz muito frio. Toque nas nuvens para nevar nas montanhas.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
