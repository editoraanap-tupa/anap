/* ================= JOGO: Terra dos Inuit, o gelo do mar ================= */
function jogoInuit(palco, api){
  semente = 64;
  let vivo = true, fase = 'gelo', coluna = 0, blocos = 0, pedacos = 0, fogo = 0, ocupado = false, aurora = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k), k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const P = v => (+v).toFixed(1), PI = Math.PI;
  const HZ = 208;
  const COLS = [292, 378, 464, 550], ROWS = [298, 378], SEGURO = [0, 1, 0, 1];
  const INICIO = { x:176, y:346 }, PARADA = { x:614, y:448 };
  const IG = { x:716, y:336, rx:72, h:78 };
  const PANELA = { x:420, y:438 };
  const PILHA = [[676, 468], [726, 472], [774, 468], [700, 444], [750, 446], [726, 420]];
  const PEDACOS = [{ x:432, y:240, doce:true }, { x:480, y:252, doce:false }, { x:528, y:238, doce:true }, { x:576, y:252, doce:false }, { x:622, y:234, doce:true }];
  /* ---------- formas ---------- */
  const blob = (cx, cy, rx, ry, n, amp) => {
    const pts = []; for (let i = 0; i < n; i++) { const a = i / n * PI * 2, k = 1 + R(-amp, amp); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    const m = (a, b) => `${P((a[0] + b[0]) / 2)} ${P((a[1] + b[1]) / 2)}`;
    let d = `M${m(pts[n - 1], pts[0])}`; for (let i = 0; i < n; i++) d += ` Q${P(pts[i][0])} ${P(pts[i][1])} ${m(pts[i], pts[(i + 1) % n])}`; return d + 'Z';
  };
  /* crista de pressão: blocos de gelo empurrados uns contra os outros */
  const crista = (x0, x1, y, h) => { let o = ''; for (let x = x0; x < x1; x += R(9, 15)) { const w = R(10, 18), hh = h * R(.5, 1.1), inc = R(-.4, .4);
    o += `<path d="M${P(x)} ${P(y)} L${P(x + inc * hh)} ${P(y - hh)} L${P(x + w * .6)} ${P(y - hh * R(.7, 1))} L${P(x + w)} ${P(y)}Z" fill="#FFFFFF" stroke="#7FA2C8" stroke-width="1.1" stroke-linejoin="round"/><path d="M${P(x + w * .6)} ${P(y - hh * .8)} L${P(x + w)} ${P(y)} L${P(x + w * .5)} ${P(y)}Z" fill="#B4CDEA" opacity=".9"/>`; }
    return o + `<path d="M${x0 - 6} ${y + 1} H${x1 + 10}" stroke="#A9C3E2" stroke-width="3" stroke-linecap="round" opacity=".7"/>`; };
  /* casa colorida sobre pés de metal (por causa do chão congelado) */
  const CASAS = [['#F26A5A', '#B23A2E'], ['#4E9BE8', '#235FAE'], ['#FFD25A', '#D8981E'], ['#5CC79A', '#2A8A62'], ['#B989E8', '#6E44A8'], ['#FF9A4A', '#C8601E']];
  const casa = (x, y, w, h, i, porta) => { const [c1, c2] = CASAS[i], yb = y - 7, yt = yb - h;
    let o = `<ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * .62}" ry="3" fill="#8FA9CC" opacity=".55"/>`;
    o += `<g stroke="#4A5068" stroke-width="1.6">${[x + 4, x + w / 2, x + w - 4].map(px => `<path d="M${px} ${yb} V${y}"/>`).join('')}</g>`;
    o += `<rect x="${x}" y="${yt}" width="${w}" height="${h}" fill="url(#inCasa${i})" stroke="${c2}" stroke-width="1.4"/>`;
    o += `<path d="M${x + 2} ${yt + 3} V${yb - 2}" stroke="#fff" stroke-width="1.4" opacity=".45"/>`;
    o += `<path d="M${x - 3} ${yt + 1} L${x + w / 2} ${yt - 9} L${x + w + 3} ${yt + 1}Z" fill="#3E4560" stroke="#22283C" stroke-width="1.2" stroke-linejoin="round"/>`;
    o += `<path d="M${x - 2} ${yt} L${x + w / 2} ${yt - 8.4} L${x + w + 2} ${yt} C${x + w * .8} ${yt - 3} ${x + w * .7} ${yt - 1} ${x + w * .55} ${yt - 4} C${x + w * .4} ${yt - 2} ${x + w * .2} ${yt - 2} ${x - 2} ${yt}Z" fill="#FFFFFF" stroke="#B8CCE6" stroke-width=".8"/>`;
    const jw = Math.min(8, w * .2);
    o += `<g class="in-janela">${[x + w * .18, porta ? x + w * .62 : x + w * .58].map(jx => `<rect x="${P(jx)}" y="${yt + h * .3}" width="${jw}" height="${jw * .8}" rx="1" fill="#A8DDF6" stroke="#fff" stroke-width="1.2"/>`).join('')}</g>`;
    if (porta) o += `<rect x="${x + w * .4}" y="${yb - h * .62}" width="${w * .16}" height="${h * .62}" fill="${c2}" stroke="#22283C" stroke-width=".9"/><path d="M${x + w * .36} ${yb} h${w * .26} v4 h-${w * .26}Z" fill="#9AA4B8"/>`;
    return o;
  };
  /* pessoas de parca: rosto, capuz com pelo e faixa enfeitada na barra */
  const parca = (cx, cy, s, pele, cor, esc, faixa, cabelo) => `<g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="M-11 6 C-13 -8 -9 -20 0 -21 C9 -20 13 -8 11 6Z" fill="${cor}" stroke="${esc}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M0 -20 V4" stroke="${esc}" stroke-width=".8" opacity=".5"/>
      <path d="M-11.6 1.4 H11.6" stroke="${faixa}" stroke-width="3.4"/><path d="M-10 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4 l2 -1.4 l2 1.4" stroke="${esc}" stroke-width=".9" fill="none"/>
      <g fill="#F7F1E4" stroke="#B8A888" stroke-width=".6">${[-10, -6.6, -3.3, 0, 3.3, 6.6, 10].map(x => `<circle cx="${x}" cy="5.6" r="2.2"/>`).join('')}</g>
      <path d="M-6 -16 C-8 -10 -8 -4 -7 -2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>
      <path d="${copa(0, -29, 12, 11.6, 18, .14)}" fill="#E8D4AE" stroke="#8A6A44" stroke-width="1"/>
      <g stroke="#B08A5E" stroke-width=".7" stroke-linecap="round">${Array.from({ length:16 }, (_, k) => { const an = k / 16 * Math.PI * 2; return `<path d="M${(Math.cos(an) * 8.6).toFixed(1)} ${(-29 + Math.sin(an) * 8.4).toFixed(1)} L${(Math.cos(an) * 11).toFixed(1)} ${(-29 + Math.sin(an) * 10.8).toFixed(1)}"/>`; }).join('')}</g>
      <circle cx="0" cy="-29" r="8.4" fill="${esc}"/>
      <circle cx="0.4" cy="-28.6" r="7" fill="${pele}" stroke="#5A3418" stroke-width=".8"/>
      <path d="M-6.4 -30 C-6 -37 6 -38 7.2 -30 C4 -33.6 2 -32 0 -34 C-2 -32 -4 -33 -6.4 -30Z" fill="${cabelo}"/>
      <path d="M-3.6 -31.4 q1.4 -.9 2.6 0 M2 -31.4 q1.4 -.9 2.6 0" stroke="${cabelo}" stroke-width=".6" fill="none" stroke-linecap="round"/>
      <ellipse cx="-2.2" cy="-28.6" rx="1.25" ry="1.55" fill="#1A1210"/><ellipse cx="3.2" cy="-28.6" rx="1.25" ry="1.55" fill="#1A1210"/><circle cx="-1.8" cy="-29.2" r=".5" fill="#fff"/><circle cx="3.6" cy="-29.2" r=".5" fill="#fff"/>
      <ellipse cx="-4.4" cy="-25.6" rx="1.8" ry="1.1" fill="#E86A5A" opacity=".5"/><ellipse cx="5.4" cy="-25.6" rx="1.8" ry="1.1" fill="#E86A5A" opacity=".5"/>
      <path d="M-1.6 -25.4 q2.1 2.6 4.2 0Z" fill="#8A2A1E" stroke="#5A2A18" stroke-width=".5" stroke-linejoin="round"/>
    </g>`;
  /* cão de trenó (pelo grosso, rabo enrolado) */
  const cao = (x, y, fl, c1, c2, cls) => `<g class="${cls}" transform="translate(${x} ${y}) scale(${fl} 1)"><g class="in-cao-in">
      <ellipse cx="0" cy="1" rx="12" ry="2.2" fill="#8FA9CC" opacity=".6"/>
      <path d="M-6 -4 V0 M-3 -4 V0.4 M5 -4 V0 M8 -4 V0.4" stroke="${c2}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-9 -6 C-10 -11 -4 -13 2 -12 C8 -12 11 -9 10 -5 C8 -2 -6 -2 -9 -6Z" fill="${c1}" stroke="${c2}" stroke-width="1.1"/>
      <path d="M-6 -4 C-2 -2 4 -2 8 -4" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M-8 -10 C-14 -14 -13 -20 -8 -18 C-10 -16 -9 -13 -7 -12Z" fill="${c1}" stroke="${c2}" stroke-width="1"/>
      <path d="M7 -15 L8 -21 L11 -16Z M11 -15 L13 -21 L14.6 -15Z" fill="${c1}" stroke="${c2}" stroke-width=".9" stroke-linejoin="round"/>
      <circle cx="11" cy="-12.6" r="4.2" fill="${c1}" stroke="${c2}" stroke-width="1"/>
      <path d="M12 -11 C14 -12 17 -11.4 17.4 -10 C16 -8.6 13 -8.6 12 -9.4Z" fill="#FFFFFF" stroke="${c2}" stroke-width=".7"/>
      <circle cx="17.2" cy="-10.4" r=".9" fill="#1A1A22"/><circle cx="12.4" cy="-13.6" r=".9" fill="#1A1A22"/><circle cx="12.7" cy="-13.9" r=".3" fill="#fff"/>
      <path d="M9 -12 C10 -10 10 -8 9 -7" stroke="#FFFFFF" stroke-width="1.2" fill="none"/></g>
      <rect x="-16" y="-24" width="36" height="28" fill="transparent"/></g>`;
  /* placa de gelo irregular: cantos quebrados e lados retos misturados com curvas */
  const placaForma = (cx, cy, rx, ry) => { const n = 12, pts = [];
    for (let i = 0; i < n; i++) { const an = i / n * PI * 2 + R(-.12, .12), k = 1 + R(-.2, .16); pts.push([cx + Math.cos(an) * rx * k, cy + Math.sin(an) * ry * k]); }
    let d = `M${P(pts[0][0])} ${P(pts[0][1])}`;
    for (let i = 1; i <= n; i++) { const q = pts[i % n], pr = pts[i - 1]; d += i % 3 === 0 ? ` L${P(q[0])} ${P(q[1])}` : ` Q${P((pr[0] + q[0]) / 2 + R(-3, 3))} ${P((pr[1] + q[1]) / 2 + R(-3, 3))} ${P(q[0])} ${P(q[1])}`; }
    return d + 'Z'; };
  /* ---------- placas de gelo do caminho ---------- */
  let placas = '';
  const formas = [];
  COLS.forEach((x, c) => ROWS.forEach((y, r) => {
    const d = placaForma(x, y, 40, 25), ok = SEGURO[c] === r; formas.push(d);
    placas += `<g class="in-placa toque" data-c="${c}" data-r="${r}" data-ok="${ok ? 1 : 0}">`;
    if (ok) {
      placas += `<g transform="translate(0 7)"><path d="${d}" fill="#5FAED2" stroke="#2E6E9A" stroke-width="1.6"/></g>
        <path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/>
        <path d="${d}" fill="url(#inGrosso)" stroke="#7FA6CC" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M${x - 30} ${y - 2} C${x - 26} ${y - 14} ${x - 12} ${y - 16} ${x - 4} ${y - 10} C${x + 4} ${y - 18} ${x + 22} ${y - 16} ${x + 26} ${y - 4} C${x + 14} ${y - 8} ${x - 18} ${y - 6} ${x - 30} ${y - 2}Z" fill="#FFFFFF" stroke="#D2E2F2" stroke-width="1"/>
        <path d="M${x - 24} ${y - 1} C${x - 10} ${y - 4} ${x + 10} ${y - 5} ${x + 22} ${y - 2}" stroke="#B4CCE8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M${x + 14} ${y + 14} l6 -3 l3 4Z M${x - 22} ${y + 12} l5 -2 l2 3Z" fill="#9FD0EA" opacity=".8"/>
        <path d="M${x - 26} ${y - 8} C${x - 16} ${y - 18} ${x + 4} ${y - 20} ${x + 18} ${y - 16}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
        <g stroke="#C6D8EE" stroke-width="1.3" fill="none" stroke-linecap="round"><path d="M${x - 14} ${y + 6} q8 -4 16 0 M${x + 8} ${y + 10} q6 -3 12 0"/></g>
        <g fill="#fff">${[[x - 20, y], [x + 16, y - 4], [x + 2, y + 12]].map(([a, b]) => `<rect class="brilho" style="animation-delay:${R(0, 2).toFixed(1)}s" x="${P(a)}" y="${P(b)}" width="2.2" height="2.2" transform="rotate(45 ${P(a + 1)} ${P(b + 1)})"/>`).join('')}</g>`;
    } else {
      placas += `<path d="${d}" fill="none" stroke="#C6D8EC" stroke-width="5" stroke-linejoin="round" stroke-dasharray="5 3 9 4" opacity=".8"/>
        <path d="${d}" fill="url(#inFino)" stroke="#22344E" stroke-width="1.5" stroke-linejoin="round"/>
        <g fill="#E6F0FA" opacity=".85">${[[x - 34, y + 4, 6, 2.4], [x + 30, y - 10, 5, 2], [x + 10, y + 21, 7, 2.2]].map(([a2, b2, rx2, ry2]) => `<ellipse cx="${P(a2)}" cy="${P(b2)}" rx="${rx2}" ry="${ry2}"/>`).join('')}</g>
        <g stroke="#DCEBF8" stroke-width=".8" stroke-linecap="round" opacity=".7">${[[x - 16, y - 6], [x + 4, y - 12], [x + 20, y + 4]].map(([a2, b2]) => `<path d="M${P(a2 - 2)} ${P(b2)} h4 M${P(a2)} ${P(b2 - 2)} v4"/>`).join('')}</g>
        <path d="M${x - 30} ${y - 6} C${x - 18} ${y - 18} ${x + 10} ${y - 20} ${x + 30} ${y - 10}" stroke="#16243A" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>
        <path d="M${x - 22} ${y + 2} q14 -8 30 -4 M${x - 6} ${y + 12} q10 -4 22 -2" stroke="#BFD6EE" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/>
        <g fill="none" stroke="#9FC0E0" stroke-width=".9" opacity=".6">${[[x + 12, y + 2, 2.4], [x - 14, y + 8, 1.8], [x + 22, y + 10, 1.4]].map(([a, b, rr]) => `<circle cx="${P(a)}" cy="${P(b)}" r="${rr}"/>`).join('')}</g>
        <g class="in-racha" style="opacity:0;transition:opacity .25s"><path d="M${x} ${y} l-9 -6 l-6 -10 M${x} ${y} l12 -4 l10 -9 M${x} ${y} l3 10 l10 6 M${x} ${y} l-12 6 l-13 1" stroke="#0A1426" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M${x} ${y} l-9 -6 l-6 -10 M${x} ${y} l12 -4 l10 -9 M${x} ${y} l3 10 l10 6 M${x} ${y} l-12 6 l-13 1" stroke="#E6F4FF" stroke-width="1.2" fill="none" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#0E2440"/><path d="M${x - 5} ${y - 1} q5 -3 10 0" stroke="#7FB6E6" stroke-width="1" fill="none"/></g>`;
    }
    placas += `<ellipse class="in-dica" cx="${x}" cy="${y}" rx="45" ry="29" fill="none" stroke="#fff" stroke-width="2.6" stroke-dasharray="7 6" style="display:none"/>
      <ellipse cx="${x}" cy="${y + 3}" rx="44" ry="30" fill="transparent"/></g>`;
  }));
  /* ---------- iglu: fiadas de blocos em espiral ---------- */
  const fiadas = [[6, 17], [5, 16], [4, 15], [3, 14], [2, 10]];
  const larg = y => IG.rx * Math.sqrt(Math.max(0, 1 - Math.pow((IG.y - y) / IG.h, 2)));
  const pecas = []; { let yb = IG.y;
    fiadas.forEach(([n, hh], k) => { const yt = yb - hh, passo = 180 / n, ini = -90 - (k % 2) * passo / 2, wb = larg(yb), wt = larg(yt);
      for (let j = 0; j <= n; j++) { const a0 = Math.max(-90, ini + j * passo), a1 = Math.min(90, ini + (j + 1) * passo); if (a1 - a0 < 4) continue;
        const sx = a => Math.sin(a * PI / 180), g = .7;
        const d = `M${P(IG.x + wb * sx(a0 + g))} ${P(yb - .6)} L${P(IG.x + wb * sx(a1 - g))} ${P(yb - .6)} L${P(IG.x + wt * sx(a1 - g))} ${P(yt + .6)} L${P(IG.x + wt * sx(a0 + g))} ${P(yt + .6)}Z`;
        const m = (a0 + a1) / 2; pecas.push({ d, tom: m < -35 ? 'A' : m < 25 ? 'B' : 'C', cx:IG.x + (wb + wt) / 2 * sx(m), cy:(yb + yt) / 2 }); }
      yb = yt; });
    pecas.push({ d:`M${P(IG.x - larg(yb) + 1)} ${P(yb)} C${IG.x - 10} ${IG.y - IG.h - 3} ${IG.x + 10} ${IG.y - IG.h - 3} ${P(IG.x + larg(yb) - 1)} ${P(yb)}Z`, tom:'A', cx:IG.x, cy:yb - 3 }); }
  const domo = `M${IG.x - IG.rx} ${IG.y} A${IG.rx} ${IG.h} 0 0 1 ${IG.x + IG.rx} ${IG.y}Z`;
  /* ---------- pedaços de gelo para beber ---------- */
  const pedacoSvg = (p, i) => { const d = blob(0, 0, 19, 13, 8, .16);
    return p.doce ? `<path d="M-16 6 C-8 14 10 14 18 6" stroke="#2E7FB6" stroke-width="6" fill="none" opacity=".25" stroke-linecap="round"/><path d="${d}" fill="url(#inVelho)" stroke="#2A78AE" stroke-width="1.6"/><path d="M-10 -5 L-2 -9 L8 -6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path d="M-4 2 L4 -2 L10 3" stroke="#5FB4E0" stroke-width="1.2" fill="none" opacity=".8"/><circle cx="6" cy="5" r="1.4" fill="#E6F8FF" opacity=".8"/>`
      : `<path d="M-16 6 C-8 14 10 14 18 6" stroke="#6A7488" stroke-width="6" fill="none" opacity=".2" stroke-linecap="round"/><path d="${d}" fill="url(#inNovo)" stroke="#7A8698" stroke-width="1.6"/><g stroke="#fff" stroke-width="1.1" stroke-linecap="round">${[[-9, -3], [0, -6], [8, -1], [-3, 4], [10, 6]].map(([a, b]) => `<path d="M${a - 2.4} ${b} h4.8 M${a} ${b - 2.4} v4.8 M${a - 1.7} ${b - 1.7} l3.4 3.4 M${a + 1.7} ${b - 1.7} l-3.4 3.4"/>`).join('')}</g><path d="M-10 -6 q6 -4 12 -3" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>`; };
  /* ---------- montanhas, iceberg ---------- */
  const serra = 'M0 158 L30 150 L54 152 L80 136 L118 138 L146 124 L186 128 L214 116 L252 120 L282 110 L318 122 L352 118 L388 132 L420 128 L460 140 L500 134 L540 146 L590 140 L640 150 L690 140 L740 146 L800 136 V212 H0Z';
  const neveSerra = 'M80 136 L118 138 L146 124 L186 128 L214 116 L252 120 L282 110 L318 122 L352 118 L388 132 L380 138 L352 128 L330 134 L318 128 L290 122 L280 130 L262 126 L250 132 L222 126 L210 132 L188 136 L170 132 L146 136 L120 146 L96 142Z';
  const iceberg = 'M416 212 L424 186 L440 172 L446 146 L462 134 L470 110 L486 96 L496 104 L506 92 L520 98 L532 86 L544 100 L552 124 L568 134 L576 156 L594 168 L604 190 L614 212Z';
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Ártico com mar congelado, cidade inuit, iceberg, acampamento com iglu e raposa-do-ártico">
    <defs>
      <linearGradient id="inCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A4E92"/><stop offset=".38" stop-color="#6E92CE"/><stop offset=".72" stop-color="#E4A8BC"/><stop offset="1" stop-color="#FFD6B4"/></linearGradient>
      <radialGradient id="inSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".6" stop-color="#FFD48A"/><stop offset="1" stop-color="#FFAE6A"/></radialGradient>
      <radialGradient id="inBrilhoSol" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE4B8" stop-opacity=".9"/><stop offset="1" stop-color="#FFC0A0" stop-opacity="0"/></radialGradient>
      <linearGradient id="inSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E98CC"/><stop offset="1" stop-color="#D6C4DE"/></linearGradient>
      <linearGradient id="inMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2FA"/><stop offset="1" stop-color="#C8D2EC"/></linearGradient>
      <linearGradient id="inBerg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#C8EEFA"/><stop offset="1" stop-color="#5CB8DE"/></linearGradient>
      <linearGradient id="inBergS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CCBEA"/><stop offset="1" stop-color="#2E8CC4"/></linearGradient>
      <linearGradient id="inMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8DDEB"/><stop offset=".12" stop-color="#EEF3FB"/><stop offset=".6" stop-color="#F6FAFF"/><stop offset="1" stop-color="#D6E6F6"/></linearGradient>
      <linearGradient id="inTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D2DDF0"/></linearGradient>
      <linearGradient id="inGrosso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#EAF4FC"/><stop offset="1" stop-color="#CFE4F4"/></linearGradient>
      <linearGradient id="inFino" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A86A6"/><stop offset=".55" stop-color="#3E5876"/><stop offset="1" stop-color="#26384F"/></linearGradient>
      <linearGradient id="inVelho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAFAFF"/><stop offset=".5" stop-color="#8FD4F0"/><stop offset="1" stop-color="#3E9ED4"/></linearGradient>
      <linearGradient id="inNovo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBFBF8"/><stop offset=".6" stop-color="#D6DBE0"/><stop offset="1" stop-color="#A4AEBA"/></linearGradient>
      <linearGradient id="inBlocoA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6F0FA"/></linearGradient>
      <linearGradient id="inBlocoB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F8FE"/><stop offset="1" stop-color="#D4E2F2"/></linearGradient>
      <linearGradient id="inBlocoC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6E4F4"/><stop offset="1" stop-color="#A8C0DE"/></linearGradient>
      <linearGradient id="inMotoG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E9CF0"/><stop offset="1" stop-color="#1E50A8"/></linearGradient>
      <linearGradient id="inMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A96A8"/><stop offset=".35" stop-color="#EEF2F8"/><stop offset="1" stop-color="#6E7A8E"/></linearGradient>
      <linearGradient id="inAguaPote" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ADCF8"/><stop offset="1" stop-color="#3E9AD6"/></linearGradient>
      <linearGradient id="inCanal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E4E86"/><stop offset="1" stop-color="#0C2648"/></linearGradient>
      <linearGradient id="inFoca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E98AE"/><stop offset="1" stop-color="#C8D0DE"/></linearGradient>
      <linearGradient id="inCaminhao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB24A"/><stop offset="1" stop-color="#E0701E"/></linearGradient>
      <radialGradient id="inLuzIglu" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFD48A" stop-opacity=".95"/><stop offset="1" stop-color="#FFB050" stop-opacity="0"/></radialGradient>
      ${CASAS.map(([a, b], i) => `<linearGradient id="inCasa${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset=".7" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('')}
      <clipPath id="inCanalClip"><rect x="140" y="380" width="220" height="${475 - 380}"/></clipPath>
      <radialGradient id="inVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#14204A" stop-opacity="0"/><stop offset="1" stop-color="#14204A" stop-opacity=".34"/></radialGradient>
      <filter id="inGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${HZ}" fill="url(#inCeu)"/>
    <g id="in-estrelas" style="opacity:0;transition:opacity 3s">${Array.from({ length:46 }, () => `<circle class="brilho" style="animation-delay:${R(0, 2.4).toFixed(1)}s" cx="${R(6, 794).toFixed(0)}" cy="${R(6, 120).toFixed(0)}" r="${R(.7, 1.7).toFixed(1)}" fill="#fff"/>`).join('')}</g>
    <g opacity=".75">${[[150, 52, 120], [520, 34, 160], [700, 76, 110], [360, 88, 140]].map(([x, y, w]) => `<path d="M${x} ${y} C${x + w * .2} ${y - 8} ${x + w * .6} ${y - 6} ${x + w} ${y} C${x + w * .7} ${y + 4} ${x + w * .3} ${y + 5} ${x} ${y}Z" fill="#FFE2EC" opacity=".7"/>`).join('')}</g>
    <g id="in-sol" class="toque" style="transition:opacity 3s, transform 4s ease-in;transform-origin:352px 114px"><circle cx="352" cy="114" r="80" fill="url(#inBrilhoSol)"/>
    <circle cx="352" cy="114" r="19" fill="url(#inSolG)" stroke="#F4A060" stroke-width="1.6"/><path d="M340 106 q8 -7 18 -6" stroke="#FFF8E4" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="352" cy="114" r="34" fill="transparent"/></g>
    <path d="${serra}" fill="url(#inSerra)" stroke="#7A72AE" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="${neveSerra}" fill="#F8F4FC" opacity=".9"/>
    <g stroke="#8E86BE" stroke-width="1" opacity=".55" fill="none"><path d="M40 168 C120 160 220 164 300 158 M380 162 C460 156 560 166 640 160 M90 182 C200 176 300 180 420 176"/></g>
    <path d="M560 212 C600 186 650 176 700 178 C740 180 772 170 800 168 V212Z" fill="url(#inMorro)" stroke="#9EAED4" stroke-width="1.2"/>
    <path d="M610 196 C650 184 690 182 730 184" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    <rect y="${HZ - 2}" width="800" height="${500 - HZ + 2}" fill="url(#inMar)"/>
    <rect id="in-mar" y="${HZ}" width="800" height="${500 - HZ}" fill="transparent"/>
    <g opacity=".75">${crista(0, 140, 228, 12)}${crista(330, 420, 222, 9)}${crista(640, 800, 228, 11)}</g>
    <g stroke="#C9DAEE" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9">${Array.from({ length:18 }, () => { const x = R(240, 780), y = R(260, 470); return `<path d="M${P(x)} ${P(y)} q12 -4 26 0 t24 0"/>`; }).join('')}</g>
    <g opacity=".55">${[[120, 330, 90, 10], [330, 432, 110, 9], [640, 380, 70, 8], [520, 470, 90, 8], [760, 300, 60, 7], [250, 250, 70, 6]].map(([x, y, rx, ry]) => `<path d="M${x - rx} ${y} C${x - rx * .5} ${y - ry * 1.6} ${x + rx * .4} ${y - ry * 1.8} ${x + rx} ${y} C${x + rx * .4} ${y - ry * .5} ${x - rx * .4} ${y - ry * .4} ${x - rx} ${y}Z" fill="#B8CDEA"/><path d="M${x - rx * .7} ${y - ry * .9} C${x - rx * .2} ${y - ry * 1.5} ${x + rx * .3} ${y - ry * 1.5} ${x + rx * .6} ${y - ry}" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g opacity=".8">${crista(250, 318, 252, 8)}${crista(704, 800, 300, 11)}${crista(0, 84, 368, 8)}</g>
    <g>${[[300, 444, 46], [560, 404, 40], [120, 384, 52], [740, 470, 50]].map(([x, y, w]) => `<path d="M${x - w} ${y} C${x - w * .4} ${y - 9} ${x + w * .3} ${y - 11} ${x + w} ${y - 2} C${x + w * .5} ${y - 4} ${x - w * .3} ${y - 2} ${x - w} ${y}Z" fill="#FFFFFF" stroke="#C4D6EC" stroke-width="1"/><path d="M${x - w * .5} ${y - 1} C${x} ${y - 4} ${x + w * .5} ${y - 4} ${x + w * .9} ${y - 2}" stroke="#A9C3E2" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`).join('')}</g>
    <g fill="#fff">${Array.from({ length:26 }, () => { const x = R(20, 780), y = R(226, 490); return `<path class="brilho" style="animation-delay:${R(0, 2.4).toFixed(1)}s;animation-duration:${R(1.8, 3.2).toFixed(1)}s" d="M${P(x)} ${P(y - 3.4)} L${P(x + .8)} ${P(y - .8)} L${P(x + 3.4)} ${P(y)} L${P(x + .8)} ${P(y + .8)} L${P(x)} ${P(y + 3.4)} L${P(x - .8)} ${P(y + .8)} L${P(x - 3.4)} ${P(y)} L${P(x - .8)} ${P(y - .8)}Z"/>`; }).join('')}</g>
    <g stroke="#9EB8DA" stroke-width="1.2" fill="none" opacity=".75"><path d="M250 232 l30 4 l24 -3 l40 6 l30 -2 M620 240 l40 5 l30 -4 l50 6 M60 312 l40 -4 l30 6"/></g>
    <g fill="#F4F8FE" stroke="#8EAACE" stroke-width="1">${[[606, 300], [618, 306], [236, 452], [370, 330], [700, 392]].map(([x, y]) => `<path d="M${x - 6} ${y} L${x - 4} ${y - 6} L${x + 5} ${y - 7} L${x + 7} ${y}Z"/>`).join('')}</g>
    <g transform="translate(704 222)"><ellipse cx="0" cy="1" rx="16" ry="2.4" fill="#9DB8DA" opacity=".6"/><path d="M-11 0 V-7 L0 -12 L11 -7 V0Z" fill="#F6F2E8" stroke="#8A8270" stroke-width=".9"/><path d="M0 -12 V0" stroke="#B8AE96" stroke-width=".8"/><path d="M-3 0 V-5 H3 V0Z" fill="#5A5444"/><path d="M15 0 l3 -5 l3 5Z M-18 -1 l2 -4 l2 4Z" fill="#E04A3C" opacity=".8"/></g>
    <g id="in-berg" class="toque">
      <path d="M404 214 C430 206 600 206 628 214 C600 220 430 220 404 214Z" fill="#9CC6E6" opacity=".7"/>
      <path d="${iceberg}" fill="url(#inBerg)" stroke="#3E8CBE" stroke-width="2" stroke-linejoin="round"/>
      <path d="M532 86 L544 100 L552 124 L568 134 L576 156 L594 168 L604 190 L614 212 H560 L566 186 L548 160 L540 130Z" fill="url(#inBergS)" opacity=".8"/>
      <path d="M486 96 L496 104 L492 140 L478 176 L486 212 H470 L462 178 L474 140Z" fill="#AEE2F4" opacity=".8"/>
      <path d="M520 150 C516 170 520 192 530 212 H512 C504 192 506 170 520 150Z" fill="#2E7EB8" opacity=".7"/>
      <path d="M446 146 L462 134 L470 110 L486 96" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g stroke="#6CBCE0" stroke-width="1.2" fill="none" opacity=".8"><path d="M432 196 C470 192 520 194 600 198 M440 178 C480 174 540 176 590 180"/></g>
      <path d="M418 210 C450 202 480 206 500 204 C530 200 580 204 612 210" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>
      <g fill="#fff">${[[448, 186], [500, 120], [538, 160]].map(([a, b]) => `<rect class="brilho" style="animation-delay:${R(0, 2).toFixed(1)}s" x="${a}" y="${b}" width="3" height="3" transform="rotate(45 ${a + 1.5} ${b + 1.5})"/>`).join('')}</g>
    </g>
    <g id="in-urso" class="toque" data-fig="ursopolar"><g id="in-urso-pos"><svg x="350" y="191" width="42" height="30" viewBox="0 0 140 100"><use href="#f-ursopolar"/></svg></g>${brilhoHotspot(390, 192)}</g>
    <g id="in-terra">
      <path d="M0 176 C50 166 110 168 150 180 C196 194 224 232 268 288 C200 302 100 304 0 306Z" fill="url(#inTerra)" stroke="#9EB4D6" stroke-width="1.6"/>
      <path d="M150 180 C196 194 224 232 268 288 C240 290 222 280 210 262 C196 238 176 210 150 196Z" fill="#C6D6EE" opacity=".7"/>
      <g fill="#5E6478" stroke="#3A3E52" stroke-width="1">${[[226, 252, 9, 4], [42, 290, 12, 4], [246, 276, 7, 3]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/><path d="M${x - a} ${y - 1} C${x - a / 2} ${y - b - 2} ${x + a / 2} ${y - b - 2} ${x + a} ${y - 1}" fill="#fff" stroke="none"/>`).join('')}</g>
      <path d="M6 272 C60 266 140 266 236 272" stroke="#C2CFE6" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M6 272 C60 266 140 266 236 272" stroke="#DCE6F4" stroke-width="2" fill="none" stroke-dasharray="6 6"/>
      <g stroke="#5A4A3E" stroke-width="1.6"><path d="M96 238 V196 M182 248 V210"/><path d="M90 200 h12 M176 214 h12" stroke-width="1.4"/></g>
      <path d="M90 201 C120 210 150 212 176 215 M102 201 C130 210 160 213 188 215" stroke="#4A4050" stroke-width=".7" fill="none"/>
      <g id="in-casas" class="toque">${casa(12, 214, 34, 20, 0)}${casa(54, 208, 30, 18, 3)}${casa(114, 216, 32, 19, 4)}${casa(22, 258, 36, 21, 1, 1)}${casa(68, 262, 32, 19, 5, 1)}</g>
      <g id="in-escola" class="toque">${casa(118, 260, 54, 26, 2, 1)}<g>${[['#E8524A', 128], ['#2E7BF6', 134], ['#3FA864', 140]].map(([c, x]) => `<circle cx="${x + 26}" cy="235" r="1.6" fill="${c}"/>`).join('')}</g><rect x="118" y="214" width="54" height="40" fill="transparent"/></g>
      <g id="in-inuksuk" class="toque" transform="translate(200 214)">
        <ellipse cx="0" cy="2" rx="16" ry="3" fill="#8FA9CC" opacity=".6"/>
        <g fill="#7A7E92" stroke="#3A3E52" stroke-width="1.3" stroke-linejoin="round">
          <path d="M-11 1 L-10 -12 L-4 -13 L-4 1Z"/><path d="M4 1 L4 -13 L10 -12 L11 1Z"/>
          <path d="M-14 -13 L14 -14 L13 -19 L-13 -18Z" fill="#8E92A6"/>
          <path d="M-8 -19 L-7 -28 L7 -28 L8 -19Z" fill="#6E7286"/>
          <path d="M-12 -28 L12 -29 L11 -33 L-11 -32Z" fill="#8E92A6"/>
          <path d="M-4 -33 L-3 -40 L4 -40 L5 -33Z" fill="#7A7E92"/>
        </g>
        <path d="M-13 -18 L13 -19 M-11 -32 L11 -33 M-3 -40 L4 -40" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
        <rect x="-18" y="-44" width="36" height="48" fill="transparent"/>
      </g>
      <g id="in-coruja" class="toque" data-fig="corujaneves"><g id="in-coruja-in"><svg x="226" y="214" width="30" height="36" viewBox="0 0 100 120"><use href="#f-corujaneves"/></svg></g>${brilhoHotspot(258, 218)}</g>
      <g id="in-caminhao" class="toque"><g id="in-cam-pos" transform="translate(40 272)">
        <ellipse cx="0" cy="1" rx="22" ry="2.6" fill="#7E96BC" opacity=".6"/>
        <rect x="-20" y="-14" width="26" height="11" rx="5" fill="#E9EEF6" stroke="#5A6478" stroke-width="1.2"/><path d="M-17 -12 h20" stroke="#fff" stroke-width="1.4"/>
        <path d="M-9 -12 c2 3 3 4 3 5.4 a3 3 0 0 1 -6 0 c0 -1.4 1 -2.4 3 -5.4Z" fill="#2E8CF0" stroke="#12458A" stroke-width=".6"/>
        <path d="M6 -3 V-15 H14 L19 -9 V-3Z" fill="url(#inCaminhao)" stroke="#8A3E0E" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 -13 H13 L16.4 -9 H9Z" fill="#BFE8FF" stroke="#8A3E0E" stroke-width=".7"/>
        <rect x="-21" y="-5" width="40" height="3" fill="#4A5068"/>
        <circle cx="-13" cy="-1" r="3" fill="#2A2E38" stroke="#12141A" stroke-width=".8"/><circle cx="12" cy="-1" r="3" fill="#2A2E38" stroke="#12141A" stroke-width=".8"/>
        <rect x="-24" y="-18" width="46" height="20" fill="transparent"/></g></g>
      <g id="in-caes" class="toque">${cao(92, 298, 1, '#9AA0B2', '#3E4456', 'in-cao')}${cao(128, 301, -1, '#E8D6B4', '#7A5A34', 'in-cao')}<path d="M100 296 C108 300 116 300 124 297" stroke="#8A5A2A" stroke-width="1" fill="none"/><path d="M110 300 V292" stroke="#5A4A3E" stroke-width="1.6"/></g>
      <g id="in-corvo" class="toque"><g id="in-corvo-voo"><g transform="translate(182 209)">
        <path d="M-3 0 L-2 3 M2 0 L3 3" stroke="#3A3A44" stroke-width="1"/>
        <path d="M-9 -2 C-12 -1 -14 2 -15 4 C-11 3 -8 1 -6 0Z" fill="#14161E"/>
        <path d="M-8 -2 C-8 -8 -2 -11 3 -10 C6 -9 6 -4 4 -1 C1 1 -5 1 -8 -2Z" fill="#1E2230" stroke="#0A0C12" stroke-width=".8"/>
        <path d="M-5 -6 C-3 -8 0 -8 2 -8" stroke="#4E5A7A" stroke-width="1" fill="none"/>
        <circle cx="4" cy="-11" r="3.4" fill="#1E2230" stroke="#0A0C12" stroke-width=".8"/><path d="M6.6 -12 L11 -10.6 L6.6 -9.4Z" fill="#2A2E3A"/><circle cx="4.8" cy="-11.8" r=".8" fill="#fff"/></g></g>
        <rect x="168" y="192" width="26" height="22" fill="transparent"/></g>
    </g>
    <g id="in-foca" class="toque" transform="translate(218 414)">
      <ellipse cx="50" cy="7" rx="14" ry="5.6" fill="#E6F0FA" stroke="#9EB8DA" stroke-width="1.2"/><ellipse cx="50" cy="7" rx="10" ry="3.6" fill="#16406E"/><path d="M43 6 q6 -2 12 0" stroke="#5E9AD6" stroke-width="1" fill="none"/>
      <g id="in-foca-in"><ellipse cx="0" cy="10" rx="34" ry="4" fill="#8FA9CC" opacity=".5"/>
      <path d="M-30 4 L-41 -3 L-38 5 L-43 11 L-30 8Z" fill="#6E7A92" stroke="#343C52" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M-30 4 C-34 -4 -24 -12 -6 -12 C10 -12 22 -9 27 -1 C29 6 20 10 4 10 C-12 10 -26 10 -30 4Z" fill="url(#inFoca)" stroke="#343C52" stroke-width="1.6"/>
      <g fill="none" stroke="#D2DAE8" stroke-width="1" opacity=".85">${[[-18, -5], [-6, -8], [6, -6], [-12, 1], [2, 0]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2"/>`).join('')}</g>
      <path d="M-20 -8 C-10 -12 4 -12 14 -9" stroke="#C6D0E2" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M6 8 C4 13 -2 14 -6 12 C-3 10 0 8 2 6Z" fill="#5E6A82" stroke="#343C52" stroke-width="1"/>
      <circle cx="26" cy="-4" r="9" fill="url(#inFoca)" stroke="#343C52" stroke-width="1.5"/>
      <circle cx="28" cy="-6" r="2.6" fill="#12141E"/><circle cx="29" cy="-7" r="1" fill="#fff"/>
      <ellipse cx="33.5" cy="-2" rx="1.6" ry="1.2" fill="#22283A"/><path d="M31 0 l7 -1 M31 1 l7 1.4 M30 1.6 l6 3" stroke="#E6ECF6" stroke-width=".6"/></g>
      <rect x="-44" y="-18" width="110" height="34" fill="transparent"/>
    </g>
    <g id="in-trilhas"></g>
    ${placas}
    <g id="in-iglu">
      <ellipse id="in-iglu-sombra" cx="${IG.x}" cy="${IG.y + 3}" rx="${IG.rx + 14}" ry="9" fill="#9DB8DA" opacity=".55" style="display:none"/>
      <path id="in-fantasma" d="${domo}" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-width="2.4" stroke-dasharray="8 7" style="display:none"/>
      <g id="in-pecas">${pecas.map((p, i) => `<path class="in-peca" data-i="${i}" d="${p.d}" fill="url(#inBloco${p.tom})" stroke="#93AED0" stroke-width="1.3" stroke-linejoin="round" style="opacity:0;transform-box:fill-box;transform-origin:50% 100%"/>`).join('')}</g>
      <g id="in-iglu-fim" style="opacity:0;transition:opacity 1s">
        <path d="M${IG.x - 60} ${IG.y - 14} C${IG.x - 50} ${IG.y - 52} ${IG.x - 20} ${IG.y - 72} ${IG.x + 4} ${IG.y - 74}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M${IG.x + 30} ${IG.y - 44} l14 -4 l2 12 l-14 4Z" fill="#DDF4FF" stroke="#7FB0D6" stroke-width="1.2"/>
        <path d="M${IG.x - 52} ${IG.y + 14} V${IG.y - 4} A26 24 0 0 1 ${IG.x} ${IG.y - 4} V${IG.y + 14}Z" fill="url(#inBlocoB)" stroke="#93AED0" stroke-width="1.4"/>
        <path d="M${IG.x - 52} ${IG.y + 3} H${IG.x} M${IG.x - 40} ${IG.y + 14} V${IG.y + 3} M${IG.x - 14} ${IG.y + 14} V${IG.y + 3} M${IG.x - 28} ${IG.y + 3} V${IG.y - 14}" stroke="#93AED0" stroke-width="1.1"/>
        <path d="M${IG.x - 37} ${IG.y + 14} V${IG.y + 2} A11 12 0 0 1 ${IG.x - 15} ${IG.y + 2} V${IG.y + 14}Z" fill="#2A4468" stroke="#1A2E4E" stroke-width="1.2"/>
        <ellipse cx="${IG.x - 26}" cy="${IG.y + 16}" rx="30" ry="4" fill="#B4CAE6" opacity=".8"/>
      </g>
    </g>
    <g id="in-moto" transform="translate(${INICIO.x} ${INICIO.y})"><g transform="scale(.98)">
      <ellipse cx="-40" cy="2" rx="104" ry="6" fill="#7E9CC6" opacity=".45"/>
      <path d="M-140 -2 H-60 C-52 -2 -48 -7 -51 -13" stroke="#5A3418" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-140 -2 H-60 C-52 -2 -48 -7 -51 -13" stroke="#C08A50" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g fill="#D8A462" stroke="#7A4A22" stroke-width="1">${Array.from({ length:10 }, (_, i) => `<rect x="${-137 + i * 8}" y="-10" width="5.4" height="4.4" rx="1"/><path d="M${-135 + i * 8} -6 V-2" stroke="#7A4A22" stroke-width="1.6"/>`).join('')}</g>
      <rect x="-138" y="-27" width="34" height="17" rx="3" fill="#3E8A6A" stroke="#1E5A40" stroke-width="1.4"/><path d="M-130 -27 V-10 M-112 -27 V-10" stroke="#C8B48A" stroke-width="1.6"/><path d="M-136 -24 h30" stroke="#7ACCA8" stroke-width="1.4" opacity=".8"/>
      <g id="in-crianca" class="toque" style="transform-box:fill-box;transform-origin:50% 100%">
        <path d="M-90 -10 H-74 L-70 -8" stroke="#2E3346" stroke-width="5.4" fill="none" stroke-linecap="round"/><ellipse cx="-69" cy="-8.4" rx="3.6" ry="2.4" fill="#4A2E1E"/>
        ${parca(-88, -16, .98, '#C08458', '#1FA6A0', '#0E5E5A', '#FFD25A', '#2A1A12')}
        <g id="in-cri-braco" style="transform-origin:-83px -32px"><path d="M-83 -32 C-79 -36 -76 -41 -75 -46" stroke="#1FA6A0" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-75" cy="-46" r="3" fill="#F7F1E4" stroke="#B8A888" stroke-width=".7"/><circle cx="-74.6" cy="-48.6" r="3.1" fill="#E8524A" stroke="#7A1A14" stroke-width=".8"/></g>
        <rect x="-104" y="-70" width="38" height="70" fill="transparent"/></g>
      <path d="M-52 -8 H-38" stroke="#4A4A50" stroke-width="2"/>
      <rect x="-42" y="-15" width="52" height="14" rx="6" fill="#22262E"/>
      <g fill="#5A6070" stroke="#12141A" stroke-width=".8">${[-34, -22, -10, 2].map(x => `<circle cx="${x}" cy="-8" r="4"/>`).join('')}</g>
      <path d="M28 -15 L33 -2" stroke="#22262E" stroke-width="3"/>
      <path d="M16 0 H52 C58 0 61 -4 59 -10" stroke="#1E2430" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M-42 -14 H16 C30 -14 44 -16 56 -22 C52 -31 38 -35 22 -35 H-2 C-10 -29 -26 -27 -42 -23Z" fill="url(#inMotoG)" stroke="#10306A" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M-38 -18 H20 C34 -18 44 -20 51 -24" stroke="#FFD25A" stroke-width="2.6" fill="none"/>
      <path d="M-30 -24 C-14 -27 4 -31 20 -32" stroke="#9ACCFF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M16 -35 L26 -49 C30 -49 33 -47 32 -44 L28 -35Z" fill="#CFF0FF" fill-opacity=".85" stroke="#4E7AA8" stroke-width="1.2"/>
      <path d="M-40 -23 C-40 -30 -8 -31 0 -29 L2 -24 Z" fill="#20242E"/>
      <ellipse cx="53" cy="-21" rx="3.2" ry="2.6" fill="#FFF4C0" stroke="#8A7A40" stroke-width=".9"/>
      <path d="M12 -36 L17 -43" stroke="#22262E" stroke-width="2.6" stroke-linecap="round"/>
      <g id="in-motorista" class="toque">
        <path d="M-18 -26 H-2 L6 -14" stroke="#2E3346" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="7" cy="-13" rx="4.6" ry="3" fill="#4A2E1E"/>
        ${parca(-12, -30, 1.22, '#A86A44', '#E04A3C', '#8A1E16', '#2E6FD6', '#1A100C')}
        <path d="M-5 -49 C3 -48 10 -45 15 -43" stroke="#E04A3C" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="13" cy="-43.6" r="3.2" fill="#F7F1E4" stroke="#B8A888" stroke-width=".7"/><circle cx="17" cy="-43" r="3.4" fill="#3A3040"/>
        <rect x="-28" y="-82" width="50" height="82" fill="transparent"/></g>
    </g></g>
    <g id="in-tuuq" style="display:none" pointer-events="none"><g id="in-tuuq-in">
      <path d="M0 -70 V0" stroke="#5A3418" stroke-width="4.4" stroke-linecap="round"/><path d="M0 -70 V-8" stroke="#C89A60" stroke-width="2" stroke-linecap="round"/>
      <path d="M-2.6 -10 L0 4 L2.6 -10Z" fill="#B8C2D2" stroke="#4A5468" stroke-width="1"/>
      <ellipse cx="0" cy="-60" rx="6" ry="7" fill="#E04A3C" stroke="#8A1E16" stroke-width="1.2"/><path d="M-4 -63 q3 -3 6 -1" stroke="#FFB0A0" stroke-width="1.2" fill="none"/>
    </g></g>
    <g id="in-canal" class="toque" data-fig="narval">
      <path d="M150 474 C170 456 230 450 280 452 C320 454 346 462 352 474 C330 486 260 490 210 488 C176 486 156 482 150 474Z" fill="url(#inCanal)" stroke="#0A1A30" stroke-width="1.6"/>
      <path d="M176 466 q20 -6 40 -2 M250 462 q20 -4 40 0 M210 478 q24 -4 50 0" stroke="#5E9AD6" stroke-width="1.4" fill="none" opacity=".7"/>
      <g clip-path="url(#inCanalClip)"><g id="in-narval-pos"><svg x="196" y="446" width="104" height="62" viewBox="0 0 150 90"><use href="#f-narval"/></svg></g></g>
      <path d="M144 476 C162 486 230 494 290 490 C330 488 352 482 358 474 L362 500 H140Z" fill="#F4F8FE" stroke="#A8C0DE" stroke-width="1.6"/>
      <path d="M150 480 C190 490 280 494 352 480" stroke="#7FC0E6" stroke-width="2" fill="none" opacity=".7"/>
      ${brilhoHotspot(292, 452)}
    </g>
    <g id="in-panela">
      <ellipse cx="${PANELA.x}" cy="${PANELA.y + 48}" rx="40" ry="5" fill="#9DB8DA" opacity=".6"/>
      <g id="in-fogareiro" class="toque">
        <path d="M${PANELA.x - 22} ${PANELA.y + 46} L${PANELA.x - 14} ${PANELA.y + 30} M${PANELA.x + 22} ${PANELA.y + 46} L${PANELA.x + 14} ${PANELA.y + 30}" stroke="#3A3E4E" stroke-width="2.6" stroke-linecap="round"/>
        <rect x="${PANELA.x - 13}" y="${PANELA.y + 30}" width="26" height="14" rx="3" fill="#2E8C5A" stroke="#14502E" stroke-width="1.4"/><path d="M${PANELA.x - 10} ${PANELA.y + 33} h20" stroke="#7AD8A0" stroke-width="1.4" opacity=".8"/>
        <rect x="${PANELA.x - 16}" y="${PANELA.y + 26}" width="32" height="5" rx="2" fill="#4A5064" stroke="#22283A" stroke-width="1"/>
        <g id="in-chama" style="transform-origin:${PANELA.x}px ${PANELA.y + 26}px;transform:scale(0);transition:transform .6s cubic-bezier(.3,1.5,.5,1)"><g style="animation:flutua .5s ease-in-out infinite alternate"><path d="M${PANELA.x - 12} ${PANELA.y + 26} C${PANELA.x - 12} ${PANELA.y + 16} ${PANELA.x - 6} ${PANELA.y + 12} ${PANELA.x - 6} ${PANELA.y + 8} C${PANELA.x - 2} ${PANELA.y + 14} ${PANELA.x + 2} ${PANELA.y + 10} ${PANELA.x + 2} ${PANELA.y + 6} C${PANELA.x + 8} ${PANELA.y + 12} ${PANELA.x + 12} ${PANELA.y + 18} ${PANELA.x + 12} ${PANELA.y + 26}Z" fill="#4E9CFF" stroke="#1E50C8" stroke-width="1"/><path d="M${PANELA.x - 6} ${PANELA.y + 26} C${PANELA.x - 6} ${PANELA.y + 20} ${PANELA.x - 2} ${PANELA.y + 16} ${PANELA.x} ${PANELA.y + 14} C${PANELA.x + 4} ${PANELA.y + 18} ${PANELA.x + 6} ${PANELA.y + 22} ${PANELA.x + 6} ${PANELA.y + 26}Z" fill="#BFE4FF"/></g></g>
        <g id="in-fogo-dica" style="display:none">${brilhoHotspot(PANELA.x + 30, PANELA.y + 34)}</g>
        <rect x="${PANELA.x - 30}" y="${PANELA.y + 4}" width="60" height="46" fill="transparent"/>
      </g>
      <path d="M${PANELA.x - 16} ${PANELA.y + 27} L${PANELA.x - 20} ${PANELA.y + 15} M${PANELA.x + 16} ${PANELA.y + 27} L${PANELA.x + 20} ${PANELA.y + 15}" stroke="#3A3E4E" stroke-width="2.4" stroke-linecap="round"/>
      <g id="in-pote" transform="translate(0 -13)">
        <path d="M${PANELA.x - 31} ${PANELA.y - 4} C${PANELA.x - 40} ${PANELA.y - 6} ${PANELA.x - 40} ${PANELA.y + 4} ${PANELA.x - 30} ${PANELA.y + 4} M${PANELA.x + 31} ${PANELA.y - 4} C${PANELA.x + 40} ${PANELA.y - 6} ${PANELA.x + 40} ${PANELA.y + 4} ${PANELA.x + 30} ${PANELA.y + 4}" stroke="#3A4256" stroke-width="2.6" fill="none"/>
        <path d="M${PANELA.x - 28} ${PANELA.y - 8} V${PANELA.y + 20} C${PANELA.x - 28} ${PANELA.y + 28} ${PANELA.x + 28} ${PANELA.y + 28} ${PANELA.x + 28} ${PANELA.y + 20} V${PANELA.y - 8}Z" fill="url(#inMetal)" stroke="#3A4256" stroke-width="1.8"/>
        <path d="M${PANELA.x - 20} ${PANELA.y - 2} V${PANELA.y + 18}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <ellipse cx="${PANELA.x}" cy="${PANELA.y - 8}" rx="28" ry="7" fill="#4A5468" stroke="#3A4256" stroke-width="1.8"/>
        <ellipse id="in-agua" cx="${PANELA.x}" cy="${PANELA.y - 7}" rx="25" ry="5.4" fill="url(#inAguaPote)" style="opacity:0;transition:opacity 1.2s"/>
        <g id="in-pote-gelo">${[[-12, -10, 9], [2, -12, 10], [14, -9, 8]].map(([dx, dy, r], i) => `<path class="in-pg" d="M${PANELA.x + dx - r} ${PANELA.y + dy + 3} L${PANELA.x + dx - r * .6} ${PANELA.y + dy - 4} L${PANELA.x + dx + r * .4} ${PANELA.y + dy - 5} L${PANELA.x + dx + r} ${PANELA.y + dy + 2}Z" fill="url(#inVelho)" stroke="#2A78AE" stroke-width="1.2" style="opacity:0;transition:opacity .4s, transform 1.2s;transform-box:fill-box;transform-origin:50% 100%"/>`).join('')}</g>
        <path d="M${PANELA.x - 26} ${PANELA.y - 9} C${PANELA.x - 14} ${PANELA.y - 14} ${PANELA.x + 10} ${PANELA.y - 14} ${PANELA.x + 22} ${PANELA.y - 11}" stroke="#C8D2E0" stroke-width="1.2" fill="none"/>
      </g>
      <g id="in-caneca" style="display:none"><g class="cresce"><path d="M${PANELA.x + 40} ${PANELA.y + 28} h18 v16 c0 4 -18 4 -18 0Z" fill="#F26A5A" stroke="#8A2A1E" stroke-width="1.4"/><path d="M${PANELA.x + 58} ${PANELA.y + 32} c7 0 7 9 0 9" stroke="#8A2A1E" stroke-width="2" fill="none"/><ellipse cx="${PANELA.x + 49}" cy="${PANELA.y + 28}" rx="9" ry="2.4" fill="#9ADCF8" stroke="#8A2A1E" stroke-width="1"/><path d="M${PANELA.x + 43} ${PANELA.y + 34} v7" stroke="#FFB0A0" stroke-width="1.6" stroke-linecap="round"/></g></g>
    </g>
    <g id="in-pilha">${PILHA.map(([x, y], i) => `<g class="in-bloco toque" data-i="${i}" transform="translate(${x} ${y})" style="cursor:grab"><path d="M-21 2 L-19 -10 L19 -11 L21 1Z" fill="#AFC6E2" stroke="#7C9CC4" stroke-width="1.2" stroke-linejoin="round"/><path d="M-21 2 L21 1 L20 11 L-20 12Z" fill="url(#inBlocoA)" stroke="#7C9CC4" stroke-width="1.4" stroke-linejoin="round"/><path d="M-17 4 H14" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><g fill="#C6D8EE"><circle cx="-8" cy="8" r="1"/><circle cx="6" cy="6" r=".8"/><circle cx="12" cy="9" r="1"/></g><rect x="-26" y="-16" width="52" height="32" fill="transparent"/></g>`).join('')}</g>
    <g id="in-pedacos">${PEDACOS.map((p, i) => `<g class="in-pedaco toque" data-i="${i}" transform="translate(${p.x} ${p.y})" style="opacity:0;pointer-events:none;transition:opacity .8s"><g style="animation:flutua ${(2.4 + i * .3).toFixed(1)}s ease-in-out infinite alternate"><g transform="scale(1.18)">${pedacoSvg(p, i)}</g></g><circle r="24" fill="transparent"/></g>`).join('')}</g>
    <path d="M610 500 C640 474 700 476 744 486 C770 490 790 486 800 482 V500Z" fill="#FFFFFF" stroke="#B4C8E4" stroke-width="1.4"/>
    <path d="M0 444 C30 426 90 424 130 444 C150 456 160 476 158 500 H0Z" fill="url(#inGrosso)" stroke="#A8C0DE" stroke-width="1.6"/>
    <path d="M10 440 C40 428 80 428 110 438" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M60 470 C90 462 120 466 140 480" stroke="#C6D8EE" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g id="in-raposa" class="toque" data-fig="raposaartica"><g id="in-raposa-pulo"><svg x="14" y="368" width="114" height="104" viewBox="0 0 120 110"><use href="#f-raposaartica"/></svg></g>${brilhoHotspot(116, 384)}</g>
    <g id="in-seta1" style="display:none" pointer-events="none"><path d="M700 404 C690 386 690 372 700 360" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/><path d="M694 362 l8 -10 l5 12Z" fill="#fff"/></g>
    <g id="in-seta2" style="display:none" pointer-events="none"><path d="M470 270 C470 330 450 370 432 412" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/><path d="M426 408 l4 14 l9 -11Z" fill="#fff"/></g>
    <rect id="in-noite" width="800" height="500" fill="#0A1638" style="opacity:0;transition:opacity 3s" pointer-events="none"/>
    <g id="in-luzes" style="opacity:0;transition:opacity 3s" pointer-events="none">
      <ellipse cx="${IG.x - 22}" cy="${IG.y + 4}" rx="70" ry="40" fill="url(#inLuzIglu)"/>
      <path d="M${IG.x - 37} ${IG.y + 14} V${IG.y + 2} A11 12 0 0 1 ${IG.x - 15} ${IG.y + 2} V${IG.y + 14}Z" fill="#FFC870"/>
      <path d="M${IG.x + 30} ${IG.y - 44} l14 -4 l2 12 l-14 4Z" fill="#FFE2A0"/>
      <g fill="#FFE07A">${[[12, 214, 34, 20], [54, 208, 30, 18], [114, 216, 32, 19], [22, 258, 36, 21, 1], [68, 262, 32, 19, 1], [118, 260, 54, 26, 1]].map(([x, y, w, h, pt]) => { const yt = y - 7 - h, jw = Math.min(8, w * .2); return [x + w * .18, pt ? x + w * .62 : x + w * .58].map(jx => `<rect x="${P(jx)}" y="${P(yt + h * .3)}" width="${P(jw)}" height="${P(jw * .8)}" rx="1"/>`).join(''); }).join('')}</g>
      <ellipse cx="${PANELA.x}" cy="${PANELA.y + 30}" rx="22" ry="12" fill="#7AB8FF" opacity=".35"/>
    </g>
    <rect width="800" height="500" fill="url(#inVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#inGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const neveSobe = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'vapor', x0:x + sorte(-8, 8), y0:y, x1:x + sorte(-34, 34), y1:y - sorte(16, 40), dur:sorte(22, 38), f:sorte(0, 6), r:sorte(2, 4), x:0, y:0 }); };
  /* ---------- 1. gelo seguro: tocar para testar o caminho ---------- */
  const moto = { x:INICIO.x, y:INICIO.y };
  const poeMoto = () => el(s, '#in-moto').setAttribute('transform', `translate(${P(moto.x)} ${P(moto.y)})`);
  const placasEl = [...s.querySelectorAll('.in-placa')];
  const marcaColuna = () => placasEl.forEach(g => el(g, '.in-dica').style.display = (fase === 'gelo' && +g.dataset.c === coluna) ? '' : 'none');
  s.querySelectorAll('.in-dica').forEach((d, i) => d.animate([{ opacity:.25 }, { opacity:1 }, { opacity:.25 }], { duration:1500, iterations:Infinity, delay:(i % 2) * 300 }));
  const tuuq = el(s, '#in-tuuq');
  const testa = (x, y, fim) => {
    tuuq.style.display = ''; tuuq.setAttribute('transform', `translate(${x + 14} ${y - 2})`);
    const a = el(s, '#in-tuuq-in').animate([{ transform:'translateY(-18px)' }, { transform:'translateY(0)' }, { transform:'translateY(-12px)' }, { transform:'translateY(0)' }], { duration:700, easing:'ease-in' });
    depois(330, () => tom(130, 0, .1, 'square', .05, 80)); depois(680, () => tom(120, 0, .1, 'square', .05, 70));
    a.onfinish = () => { if (!vivo) return; tuuq.style.display = 'none'; fim(); };
  };
  const anda = (x1, y1, ms, fim) => {
    const x0 = moto.x, y0 = moto.y; let ult = 0;
    if (somOn) { tom(70, 0, ms / 1000, 'sawtooth', .025, 95); tom(140, 0, ms / 1000, 'triangle', .02, 180); }
    tween(ms, (e, k) => { moto.x = x0 + (x1 - x0) * e; moto.y = y0 + (y1 - y0) * e - Math.abs(Math.sin(k * PI * 3)) * 2; poeMoto();
      if (k - ult > .08) { ult = k; neveSobe(moto.x - 28, moto.y - 2, 2); } }, () => {
      const tr = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tr.setAttribute('d', `M${P(x0 - 30)} ${P(y0 + 1)} L${P(x1 - 30)} ${P(y1 + 1)}`); tr.setAttribute('stroke', '#B8CCE4'); tr.setAttribute('stroke-width', '7'); tr.setAttribute('stroke-dasharray', '2 3'); tr.setAttribute('opacity', '.8');
      el(s, '#in-trilhas').appendChild(tr); fim && fim(); });
  };
  placasEl.forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    const col = +g.dataset.c, row = +g.dataset.r, ok = g.dataset.ok === '1', x = COLS[col], y = ROWS[row];
    if (fase !== 'gelo') { toca('clique'); api.diz(ok ? 'Gelo branco e grosso aguenta muito peso.' : 'Gelo escuro é fino. Ele se formou há pouco tempo.'); return; }
    if (ocupado) return;
    if (col !== coluna) { toca('clique'); c.brilhos(COLS[coluna], ROWS[0] + 40, 4, '#FFFFFF'); api.diz(col < coluna ? 'Esse pedaço já passou! Toque no gelo da frente.' : 'Um pedaço de cada vez! Toque no gelo mais perto.'); return; }
    ocupado = true;
    testa(x, y, () => {
      if (!ok) {
        const r = el(g, '.in-racha'); r.style.opacity = 1; toca('splash'); tom(1800, 0, .18, 'square', .03, 600);
        for (let i = 0; i < 5; i++) c.add({ tipo:'respingo', x:x + sorte(-14, 14), y:y + sorte(-4, 6), t:i * 2, cor:'#0E2440' });
        api.diz('Crec! Gelo escuro é fino e novinho. Perigo! Toque no gelo branco e grosso.');
        depois(2400, () => { r.style.opacity = 0; ocupado = false; }); return;
      }
      toca('ok'); c.brilhos(x, y - 4, 6, '#FFFFFF');
      anda(x + 12, y + 10, 1100, () => {
        coluna++; ocupado = false; api.hud(`<span class="chip">Caminho: ${coluna}/4</span>`);
        if (coluna === 1) api.diz('Toc, toc! Som firme: o gelo branco e grosso é seguro.');
        if (coluna === 2) api.diz('Os Inuit leem as cores do gelo e escutam o som dele.');
        if (coluna === 3) api.diz('Eles batem no gelo com uma vara de ponta de ferro para ver se é firme.');
        if (coluna < 4) { marcaColuna(); return; }
        fase = 'chegada'; marcaColuna(); ocupado = true;
        anda(PARADA.x, PARADA.y, 1300, () => { ocupado = false; toca('vitoria'); c.brilhos(PARADA.x, PARADA.y - 30, 8, '#FFE27A');
          api.diz('Chegamos ao acampamento! No inverno, o mar congelado vira a estrada dos Inuit.'); depois(5200, comecaIglu); });
      });
    });
  }));
  /* ---------- 2. iglu: arrastar blocos de neve, que sobem em espiral ---------- */
  const pecaEl = [...s.querySelectorAll('.in-peca')];
  const GRUPOS = [0, 1, 2, 3, 4, 5, 6].map(k => Math.round(pecaEl.length * k / 6));
  function comecaIglu(){
    fase = 'iglu'; el(s, '#in-fantasma').style.display = ''; el(s, '#in-iglu-sombra').style.display = ''; el(s, '#in-seta1').style.display = '';
    api.hud('<span class="chip">Blocos: 0/6</span>');
    api.diz('Agora vamos fazer um iglu, uma casa de neve para a noite. Arraste os blocos de neve até o iglu.');
  }
  const blocoEl = [...s.querySelectorAll('.in-bloco')], bpos = PILHA.map(([x, y]) => ({ x, y, foi:false }));
  const poeBloco = (i, esc) => blocoEl[i].setAttribute('transform', `translate(${P(bpos[i].x)} ${P(bpos[i].y)})${esc ? ` scale(${esc.toFixed(2)})` : ''}`);
  let arr = null;
  const voo = (lista, i, x1, y1, ms, esc, fim) => { const p = lista[i], x0 = p.x, y0 = p.y; ocupado = true;
    tween(ms, (e, k) => { p.x = x0 + (x1 - x0) * e; p.y = y0 + (y1 - y0) * e - Math.sin(k * PI) * 36; fim.poe(i, 1 + (esc - 1) * e); }, () => { ocupado = false; fim.fim && fim.fim(); }); };
  blocoEl.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'iglu' || bpos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { tipo:'bloco', i, dx:p.x - bpos[i].x, dy:p.y - bpos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; el(s, '#in-seta1').style.display = 'none'; toca('clique');
  }));
  const pedEl = [...s.querySelectorAll('.in-pedaco')], ppos = PEDACOS.map(p => ({ x:p.x, y:p.y, foi:false }));
  const poePedaco = (i, esc) => pedEl[i].setAttribute('transform', `translate(${P(ppos[i].x)} ${P(ppos[i].y)})${esc ? ` scale(${esc.toFixed(2)})` : ''}`);
  pedEl.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'agua' || ppos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { tipo:'pedaco', i, dx:p.x - ppos[i].x, dy:p.y - ppos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); el(s, '#in-seta2').style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    const L = arr.tipo === 'bloco' ? bpos : ppos;
    L[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); L[arr.i].y = Math.max(40, Math.min(485, p.y - arr.dy));
    (arr.tipo === 'bloco' ? poeBloco : poePedaco)(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { tipo, i, moveu } = arr; arr = null;
    if (tipo === 'bloco') { blocoEl[i].style.cursor = 'grab';
      if (!moveu || Math.hypot(bpos[i].x - IG.x, bpos[i].y - (IG.y - 34)) < 110) assenta(i);
      else { const [x, y] = PILHA[i]; voo(bpos, i, x, y, 600, 1, { poe:poeBloco }); toca('glub'); api.diz('Leve o bloco até o iglu!'); }
    } else {
      const perto = Math.hypot(ppos[i].x - PANELA.x, ppos[i].y - PANELA.y) < 90;
      if (moveu && !perto) { const p = PEDACOS[i]; voo(ppos, i, p.x, p.y, 600, 1, { poe:poePedaco }); toca('glub'); api.diz('Leve o gelo até a panela!'); return; }
      escolhe(i);
    }
  });
  function assenta(i){
    bpos[i].foi = true; const alvo = pecas[GRUPOS[blocos]] || pecas[0];
    voo(bpos, i, alvo.cx, alvo.cy, 700, .5, { poe:poeBloco, fim:() => {
      blocoEl[i].style.display = 'none'; blocos++; toca('pop');
      const de = GRUPOS[blocos - 1], ate = GRUPOS[blocos];
      for (let j = de; j < ate; j++) depois((j - de) * 130, () => { const p = pecaEl[j]; p.style.opacity = 1; p.animate([{ transform:'scale(.2)' }, { transform:'scale(1.12)' }, { transform:'scale(1)' }], { duration:420, easing:'ease-out' }); tom(520 + j * 22, 0, .07, 'triangle', .04); neveSobe(pecas[j].cx, pecas[j].cy, 2); });
      api.hud(`<span class="chip">Blocos: ${blocos}/6</span>`);
      if (blocos === 1) api.diz('Os blocos sobem em espiral, um apoiado no outro.');
      if (blocos === 3) api.diz('A neve tem muito ar preso dentro. Esse ar segura o calor!');
      if (blocos === 5) api.diz('Falta pouco! O último bloco fecha o teto.');
      if (blocos === 6) depois(1000, igluPronto);
    } });
  }
  function igluPronto(){
    fase = 'pronto'; el(s, '#in-fantasma').style.display = 'none'; el(s, '#in-iglu-fim').style.opacity = 1;
    toca('vitoria'); c.brilhos(IG.x, IG.y - 50, 10, '#FFFFFF');
    api.diz('Iglu pronto! Lá fora faz muito frio, mas dentro dele fica bem mais quentinho.');
    depois(5600, comecaAgua);
  }
  /* ---------- 3. água para beber: gelo velho (doce) x gelo novo (salgado) ---------- */
  function comecaAgua(){
    fase = 'agua'; el(s, '#in-seta2').style.display = '';
    pedEl.forEach((g, i) => depois(i * 160, () => { g.style.opacity = 1; g.style.pointerEvents = ''; }));
    c.brilhos(PEDACOS[0].x, PEDACOS[0].y, 4, '#FFFFFF'); c.brilhos(PEDACOS[4].x, PEDACOS[4].y, 4, '#FFFFFF');
    api.hud('<span class="chip">Gelo na panela: 0/3</span>');
    api.diz('E para beber? Os Inuit derretem gelo. Leve o gelo azul do iceberg até a panela.');
  }
  function escolhe(i){
    const p = PEDACOS[i];
    if (!p.doce) {
      voo(ppos, i, PANELA.x, PANELA.y - 40, 500, 1, { poe:poePedaco, fim:() => { toca('glub'); voo(ppos, i, p.x, p.y, 700, 1, { poe:poePedaco }); } });
      api.diz('Esse é gelo novo do mar: ainda tem sal! Escolha o gelo azul.'); return;
    }
    ppos[i].foi = true;
    voo(ppos, i, PANELA.x, PANELA.y - 24, 800, .4, { poe:poePedaco, fim:() => {
      pedEl[i].style.display = 'none'; pedacos++; toca('pop'); c.brilhos(PANELA.x, PANELA.y - 28, 5, '#BFE8FF');
      s.querySelectorAll('.in-pg')[pedacos - 1].style.opacity = 1;
      api.hud(`<span class="chip">Gelo na panela: ${pedacos}/3</span>`);
      if (pedacos === 1) api.diz('O iceberg veio de uma geleira, que é feita de neve. O gelo dele é de água doce!');
      if (pedacos === 2) api.diz('Gelo do mar bem velho também perde o sal e fica azulado.');
      if (pedacos === 3) depois(900, () => { fase = 'fogo'; el(s, '#in-fogo-dica').style.display = ''; api.hud('<span class="chip">Fogo: 0/3</span>'); api.diz('Panela cheia de gelo! Agora toque no fogareiro para derreter.'); });
    } });
  }
  el(s, '#in-fogareiro').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'fogo') { toca('clique'); api.diz(fase === 'fim' ? 'A água ferveu. Hora do chá!' : 'É um fogareiro de acampamento. Ele vai esquentar a panela.'); return; }
    if (ocupado || fogo >= 3) return; ocupado = true; fogo++; toca('vapor');
    el(s, '#in-chama').style.transform = `scale(${(.5 + fogo * .22).toFixed(2)})`;
    for (let i = 0; i < 8 + fogo * 4; i++) c.add({ tipo:'vapor', x0:PANELA.x + sorte(-20, 20), y0:PANELA.y - 24, x1:PANELA.x + sorte(-40, 40), y1:PANELA.y - sorte(80, 120), dur:sorte(60, 90), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
    s.querySelectorAll('.in-pg').forEach(g => g.style.transform = `scale(${(1 - fogo * .3).toFixed(2)})`);
    const ag = el(s, '#in-agua'); ag.style.opacity = (fogo / 3).toFixed(2);
    api.hud(`<span class="chip">Fogo: ${fogo}/3</span>`);
    depois(1500, () => { ocupado = false;
      if (fogo === 1) api.diz('O calor faz o gelo derreter. O sólido vira líquido!');
      if (fogo === 2) api.diz('Olha a água aparecendo na panela!');
      if (fogo === 3) { fase = 'fim'; el(s, '#in-fogo-dica').style.display = 'none'; s.querySelectorAll('.in-pg').forEach(g => g.style.opacity = 0); el(s, '#in-caneca').style.display = '';
        toca('vitoria'); api.diz('Água doce e quentinha! Dá para beber e fazer chá.'); depois(4600, final); }
    });
  });
  function final(){
    el(s, '#in-noite').style.opacity = .55; el(s, '#in-sol').style.opacity = 0; el(s, '#in-sol').style.transform = 'translateY(40px)'; el(s, '#in-luzes').style.opacity = 1; el(s, '#in-estrelas').style.opacity = 1;
    tween(4000, e => aurora = e);
    [392, 523, 659, 784].forEach((f, i) => setTimeout(() => vivo && somOn && tom(f, 0, 1.4, 'sine', .04), 1200 + i * 420));
    api.diz('A noite chegou... e o céu ganhou luzes! É a aurora boreal.');
    depois(5200, () => { toca('vitoria'); api.diz('Os Inuit conhecem o gelo como ninguém. Mas o planeta está esquentando, e o gelo do mar está ficando mais fino. Cuidar do planeta protege o gelo deles!'); depois(7200, api.fim); });
  }
  /* aurora boreal: cortinas de luz no canvas, recortadas acima das montanhas e do iceberg */
  const perfil = (pts, x) => { for (let k = 1; k < pts.length; k++) if (x <= pts[k][0]) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k]; return y0 + (y1 - y0) * (x - x0) / Math.max(1, x1 - x0); } return pts[pts.length - 1][1]; };
  const nums = d => d.match(/-?[\d.]+/g).map(Number), pares = arr => { const o = []; for (let k = 0; k + 1 < arr.length; k += 2) o.push([arr[k], arr[k + 1]]); return o; };
  const ptsSerra = pares(nums(serra.split(' V')[0])), ptsBerg = pares(nums(iceberg));
  let ceu = 'M0 0 H800'; for (let x = 800; x >= 0; x -= 4) { let y = perfil(ptsSerra, x); if (x >= 416 && x <= 614) y = Math.min(y, perfil(ptsBerg, x)); ceu += ` L${x} ${P(y)}`; } ceu += 'Z';
  const ceuClip = typeof Path2D === 'function' ? new Path2D(ceu) : null;
  c.desenho(ctx => {
    if (aurora <= 0) return;
    const t = performance.now() / 1000;
    ctx.save(); if (ceuClip) ctx.clip(ceuClip); ctx.globalCompositeOperation = 'lighter';
    [[0, '#3CF29A', '#7A5CFF', 0], [1.9, '#6CF5C8', '#FF6AC8', 14], [3.4, '#48D890', '#5A8CFF', -10]].forEach(([f, c1, c2, dy]) => {
      const g = ctx.createLinearGradient(0, 20, 0, 160); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.3, c2); g.addColorStop(.75, c1); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      const base = x => 112 + dy + Math.sin(x * .007 + t * .3 + f) * 22 + Math.sin(x * .019 - t * .45) * 7;
      const alto = x => 64 + Math.sin(x * .011 + t * .5 + f) * 22;
      for (let x = -20; x < 820; x += 6) {
        const x2 = x + 6, b1 = base(x), b2 = base(x2), sk = 10;
        ctx.globalAlpha = aurora * (.09 + .2 * Math.pow((1 + Math.sin(x * .045 + t * 1.1 + f)) / 2, 2));
        ctx.beginPath(); ctx.moveTo(x, b1); ctx.lineTo(x2, b2); ctx.lineTo(x2 + sk, b2 - alto(x2)); ctx.lineTo(x + sk, b1 - alto(x)); ctx.closePath(); ctx.fill();
      }
    });
    ctx.restore();
  });
  /* ---------- toques extras ---------- */
  let raposaOcupada = false;
  el(s, '#in-raposa').addEventListener('click', () => {
    if (raposaOcupada) return; raposaOcupada = true; toca('pop');
    const a = el(s, '#in-raposa-pulo').animate([{ transform:'translate(0,0)' }, { transform:'translate(14px,-46px) rotate(-10deg)' }, { transform:'translate(30px,8px) rotate(14deg)' }, { transform:'translate(30px,4px)' }, { transform:'translate(0,0)' }], { duration:1500, easing:'ease-in-out' });
    depois(620, () => { toca('splash'); neveSobe(96, 456, 12); });
    a.onfinish = () => { raposaOcupada = false; };
    api.diz(fase === 'gelo' ? 'Sou o Floco! Meu pelo é branco no inverno. Toque no gelo para testar o caminho.' : 'Eu escuto os bichinhos debaixo da neve e pulo de cabeça para pegar!');
  });
  let narvalOcupado = false;
  el(s, '#in-canal').addEventListener('click', () => {
    if (narvalOcupado) return; narvalOcupado = true;
    const n = el(s, '#in-narval-pos'), sobe = n.animate([{ transform:'translateY(0)' }, { transform:'translateY(-17px)' }], { duration:900, easing:'ease-out', fill:'forwards' });
    sobe.onfinish = () => { if (!vivo) return; toca('splash'); for (let i = 0; i < 16; i++) c.add({ tipo:'vapor', x0:262 + sorte(-3, 3), y0:452, x1:262 + sorte(-18, 18), y1:452 - sorte(30, 56), dur:sorte(26, 44), f:sorte(0, 6), r:sorte(2, 3.6), x:0, y:0 });
      for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:220 + i * 20, y:470, t:i * 2, cor:'#BFE6FF' });
      api.diz('Um narval! O chifre dele é um dente bem comprido. Ele sobe nas rachaduras do gelo para respirar.');
      depois(2200, () => { const d = n.animate([{ transform:'translateY(-17px)' }, { transform:'translateY(0)' }], { duration:1200, easing:'ease-in', fill:'forwards' }); d.onfinish = () => { narvalOcupado = false; }; }); };
  });
  let ursoOcupado = false;
  el(s, '#in-urso').addEventListener('click', () => {
    if (ursoOcupado) return; ursoOcupado = true; toca('glub');
    const a = el(s, '#in-urso-pos').animate([{ transform:'translate(0,0)' }, { transform:'translate(-16px,-1px)' }, { transform:'translate(-20px,0)' }, { transform:'translate(0,0)' }], { duration:2600, easing:'ease-in-out' });
    a.onfinish = () => { ursoOcupado = false; };
    api.diz('Um urso-polar lá longe! Ele caça focas em cima do gelo do mar.');
  });
  el(s, '#in-coruja').addEventListener('click', () => {
    [[420, 380], [420, 370]].forEach(([f, f2], i) => setTimeout(() => vivo && somOn && tom(f, 0, .35, 'sine', .07, f2), i * 420));
    el(s, '#in-coruja-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px)' }, { transform:'translateY(0)' }], { duration:500, iterations:2 });
    api.diz('Uma coruja-das-neves! No verão do Ártico o sol quase não se põe, e ela caça de dia.');
  });
  el(s, '#in-inuksuk').addEventListener('click', e => { e.stopPropagation(); toca('clique'); c.brilhos(200, 196, 4, '#FFFFFF'); api.diz('É um inuksuk, uma pilha de pedras feita pelos Inuit. Ele mostra o caminho para quem viaja.'); });
  el(s, '#in-casas').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('As casas ficam em cima de pés de metal, para o calor da casa não derreter o chão congelado.'); });
  el(s, '#in-escola').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Na escola, as crianças aprendem inuktitut, a língua dos Inuit.'); });
  let camOcupado = false, camX = 40;
  el(s, '#in-caminhao').addEventListener('click', e => { e.stopPropagation(); if (camOcupado) return; camOcupado = true;
    [0, 260].forEach(d => setTimeout(() => vivo && somOn && tom(330, 0, .18, 'square', .03), d));
    const x0 = camX, x1 = camX < 100 ? 196 : 40;
    tween(2200, e2 => { camX = x0 + (x1 - x0) * e2; el(s, '#in-cam-pos').setAttribute('transform', `translate(${P(camX)} ${P(272 - (camX - 40) * .01)})${x1 < x0 ? ' scale(-1 1)' : ''}`); }, () => { camOcupado = false; });
    api.diz('Na cidade, um caminhão leva água até a caixa-d\'água de cada casa.'); });
  el(s, '#in-motorista').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz(fase === 'gelo' ? 'A gente mora na cidade, mas acampa no gelo para pescar. Toque no gelo para testar o caminho!' : 'Meu avô me ensinou a fazer iglu, e agora eu ensino minha filha.'); });
  el(s, '#in-crianca').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#in-cri-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(15deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    anjos++; if (anjos % 2 === 0 && !ocupado) { const cr = el(s, '#in-crianca'); cr.animate([{ transform:'translate(0,0)' }, { transform:'translate(6px,-18px)', offset:.15 }, { transform:'translate(12px,30px)', offset:.35 }, { transform:'translate(12px,30px) scale(1.1,.9)', offset:.5 }, { transform:'translate(12px,30px)', offset:.7 }, { transform:'translate(6px,-18px)', offset:.85 }, { transform:'translate(0,0)' }], { duration:2400, easing:'ease-in-out' }); depois(1000, anjo); depois(700, () => toca('splash')); api.diz('Olha, fiz um anjo de neve!'); }
    else api.diz('Oi! Minha avó me ensinou a ler as cores do gelo.'); });
  el(s, '#in-berg').addEventListener('click', e => { e.stopPropagation(); toca('clique'); c.brilhos(510, 140, 5, '#FFFFFF'); api.diz('Um iceberg preso no gelo do mar! Ele é azulado porque é gelo muito velho e apertado.'); });
  let focaOcupada = false;
  el(s, '#in-foca').addEventListener('click', e => { e.stopPropagation(); if (focaOcupada) return; focaOcupada = true; toca('glub');
    const fi = el(s, '#in-foca-in'), a = fi.animate([{ transform:'translate(0,0) scale(1)', opacity:1 }, { transform:'translate(40px,4px) scale(.5)', opacity:0 }], { duration:700, easing:'ease-in', fill:'forwards' });
    a.onfinish = () => { if (!vivo) return; toca('splash'); for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:268 + sorte(-4, 4), y:421, t:i * 2, cor:'#E6F6FF' });
      depois(2400, () => { const b = fi.animate([{ transform:'translate(40px,4px) scale(.5)', opacity:0 }, { transform:'translate(0,0) scale(1)', opacity:1 }], { duration:800, easing:'ease-out', fill:'forwards' }); b.onfinish = () => { focaOcupada = false; }; }); };
    api.diz('Uma foca-anelada! Ela faz buracos no gelo para respirar e mergulha por eles.'); });
  el(s, '#in-caes').addEventListener('click', e => { e.stopPropagation();
    s.querySelectorAll('#in-caes .in-cao-in').forEach((g, i) => g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-7px)' }, { transform:'translateY(0)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }], { duration:900, delay:i * 150 }));
    if (somOn) { tom(520, 0, .9, 'sine', .05, 760); tom(600, .35, 1, 'sine', .04, 880); }
    api.diz('Cães de trenó! Eles aguentam muito frio e puxavam os trenós pelo gelo. Muitas famílias ainda têm cães.'); });
  let corvoOcupado = false;
  el(s, '#in-corvo').addEventListener('click', e => { e.stopPropagation(); if (corvoOcupado) return; corvoOcupado = true;
    [0, 260].forEach(d => setTimeout(() => vivo && somOn && tom(330, 0, .14, 'square', .03, 210), d));
    const a = el(s, '#in-corvo-voo').animate([{ transform:'translate(0,0)' }, { transform:'translate(120px,-90px)' }, { transform:'translate(300px,-60px)' }, { transform:'translate(120px,-110px)' }, { transform:'translate(0,0)' }], { duration:4200, easing:'ease-in-out' });
    a.onfinish = () => { corvoOcupado = false; };
    api.diz('Um corvo! Ele mora no Ártico o ano inteiro e é muito esperto.'); });
  el(s, '#in-sol').addEventListener('click', e => { e.stopPropagation(); if (aurora > 0) return;
    for (let i = 0; i < 44; i++) c.add({ tipo:'brilho', t:-i * 2, x:sorte(20, 780), y:sorte(222, 490), cor: i % 3 ? '#FFFFFF' : '#BFE8FF' });
    [880, 1175, 1318, 1760].forEach((f, i) => setTimeout(() => vivo && somOn && tom(f, 0, .5, 'sine', .04), i * 110));
    api.diz('O sol baixinho faz o gelo brilhar inteirinho! No inverno, ele quase não sobe no céu.'); });
  let anjos = 0;
  const anjo = () => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'), x = moto.x - 112, y = moto.y + 32;
    g.setAttribute('transform', `translate(${P(x)} ${P(y)})`);
    g.innerHTML = '<g style="animation:cresce .8s ease-out"><path d="M0 -6 C-10 -14 -20 -12 -20 -4 C-18 2 -8 2 -2 0 C-6 6 -8 10 -4 12 L4 12 C8 10 6 6 2 0 C8 2 18 2 20 -4 C20 -12 10 -14 0 -6Z" fill="#DCE8F6" stroke="#A8C0DE" stroke-width="1.2"/><ellipse cx="0" cy="-9" rx="4.4" ry="3.6" fill="#DCE8F6" stroke="#A8C0DE" stroke-width="1.2"/><path d="M-16 -6 C-12 -10 -6 -9 -3 -6 M16 -6 C12 -10 6 -9 3 -6" stroke="#fff" stroke-width="1.4" fill="none"/></g>';
    el(s, '#in-trilhas').appendChild(g); c.brilhos(x, y - 4, 6, '#FFFFFF'); };
  let ultGelo = 0;
  el(s, '#in-mar').addEventListener('click', e => { const p = c.ponto(e); c.brilhos(p.x, p.y, 3, '#FFFFFF');
    if (somOn) { tom(240, 0, .9, 'sine', .05, 70); tom(900, .05, .5, 'sine', .015, 300); }
    if (performance.now() - ultGelo > 9000) { ultGelo = performance.now(); api.diz('Ouviu? O gelo do mar estala e canta quando a maré mexe e quando esfria.'); } });
  /* vida: brilhinhos de gelo no ar e fumaça das casas */
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 900) { ultB = t; c.add({ tipo:'brilho', x:sorte(20, 780), y:sorte(40, 260), cor:'#FFFFFF' }); if (Math.random() < .5) { const [hx, hy] = [[29, 182], [69, 177], [130, 184]][Math.floor(Math.random() * 3)]; c.add({ tipo:'vapor', x0:hx, y0:hy, x1:hx + sorte(6, 20), y1:hy - 40, dur:110, f:sorte(0, 6), r:2.2, x:0, y:0 }); } } requestAnimationFrame(vida); })(0);
  marcaColuna();
  api.hud('<span class="chip">Caminho: 0/4</span>');
  api.diz('Oi, eu sou o Floco, uma raposa-do-ártico! Aqui o mar congela e vira estrada. Toque no gelo para testar o caminho até o acampamento.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
