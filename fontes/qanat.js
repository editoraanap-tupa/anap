/* ================= JOGO: Qanats do Irã, rios debaixo da terra ================= */
function jogoQanat(palco, api){
  semente = 131;
  let vivo = true, fase = 'mae', cavadas = 0, pocos = 0, ocupado = false, cava = 200, trecho = 0, avisoT = 0, vila = 0, aguaVila = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tween = (dur, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.max(0, Math.min(1, (t - t0) / dur)); fn(k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const f1 = n => n.toFixed(1);
  /* perfil do chão (o corte da terra) e do lençol de água: curvas suaves por pontos */
  const curva = PTS => x => { let i = 0; while (i < PTS.length - 2 && x > PTS[i + 1][0]) i++;
    const p0 = PTS[Math.max(0, i - 1)], p1 = PTS[i], p2 = PTS[i + 1], p3 = PTS[Math.min(PTS.length - 1, i + 2)], t = Math.max(0, Math.min(1, (x - p1[0]) / (p2[0] - p1[0])));
    return .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t * t * t); };
  const P = curva([[-40, 146], [0, 150], [100, 160], [200, 180], [300, 216], [400, 258], [470, 295], [540, 330], [600, 338], [700, 339], [800, 338], [840, 338]]);
  const W = curva([[-40, 248], [0, 252], [100, 268], [200, 286], [300, 338], [420, 392], [560, 430], [800, 468], [840, 470]]);
  const MAE = 200, XO = 540, POCOS = [268, 336, 404, 472], CHK = [268, 336, 404, 472, 540], FUNDO_MAE = 338;
  const T = x => 312 + (x - 200) * 28 / 340;
  const linha = (x0, x1, fn, dy, passo) => { const a = []; for (let x = x0; x <= x1; x += (passo || 8)) a.push(`${x} ${f1(fn(x) + (dy || 0))}`); if ((x1 - x0) % (passo || 8)) a.push(`${x1} ${f1(fn(x1) + (dy || 0))}`); return a.join(' L'); };
  const camada = (f, k) => x => P(x) + (505 - P(x)) * f + 3.4 * Math.sin(x / 41 + k);
  /* desenhos pequenos */
  const tufo = (x, y, s, c1, c2) => `<path d="M${f1(x - 3 * s)} ${y} q-1 ${f1(-4 * s)} -3 ${f1(-6 * s)} M${x} ${y} q0 ${f1(-5 * s)} 1 ${f1(-8 * s)} M${f1(x + 3 * s)} ${y} q1 ${f1(-3 * s)} 4 ${f1(-5 * s)}" stroke="${c2}" stroke-width="${f1(1.9 * s)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q0 ${f1(-5 * s)} 1 ${f1(-8 * s)}" stroke="${c1}" stroke-width="${f1(.8 * s)}" fill="none" stroke-linecap="round"/>`;
  /* espinheiro-de-camelo: arbusto baixo cinza-esverdeado do deserto */
  const arbusto = (x, y, r) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${f1(r * 1.1)}" ry="${f1(r * .25)}" fill="#5A3A1A" opacity=".25"/><path d="M${x} ${y} l${f1(-r * .5)} ${f1(-r * .7)} M${x} ${y} l${f1(r * .1)} ${f1(-r * .9)} M${x} ${y} l${f1(r * .6)} ${f1(-r * .6)}" stroke="#6E5A3A" stroke-width="1.2" stroke-linecap="round"/><path d="${copa(x, y - r * .55, r, r * .5, 9, .32)}" fill="url(#qaArbusto)" stroke="#4A5A34" stroke-width="1.1"/><g fill="#E8D8F0">${Array.from({ length:4 }, () => `<circle cx="${f1(x + R(-r * .7, r * .7))}" cy="${f1(y - r * .6 + R(-r * .25, r * .2))}" r="1"/>`).join('')}</g><path d="M${f1(x - r * .6)} ${f1(y - r * .8)} q${f1(r * .4)} ${f1(-r * .25)} ${f1(r * .8)} ${f1(-r * .15)}" stroke="#DDE8C0" stroke-width="1.1" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  const pedra = (x, y, rx, ry) => `<path d="M${x - rx} ${y} C${x - rx} ${f1(y - ry * .9)} ${f1(x - rx * .4)} ${f1(y - ry * 1.15)} ${f1(x + rx * .1)} ${y - ry} C${f1(x + rx * .7)} ${f1(y - ry * 1.05)} ${x + rx} ${f1(y - ry * .5)} ${x + rx} ${y}Z" fill="url(#qaPedra)" stroke="#5E4434" stroke-width="1.4"/><path d="M${f1(x - rx * .6)} ${f1(y - ry * .6)} q${f1(rx * .3)} ${f1(-ry * .4)} ${f1(rx * .7)} ${f1(-ry * .38)}" stroke="#F6E2CC" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`;
  /* montinho de terra em volta da boca do poço (de lado parece uma cratera) */
  const monte = (x, k) => { const yl = P(x - 22 * k), yr = P(x + 22 * k), y0 = P(x - 6), y1 = P(x + 6);
    return `<path d="M${f1(x - 22 * k)} ${f1(yl + 1)} Q${f1(x - 15 * k)} ${f1(y0 - 11 * k)} ${x - 7} ${f1(y0 - 5)} L${x - 5} ${f1(y0 + 1)} H${x + 5} L${x + 7} ${f1(y1 - 5)} Q${f1(x + 15 * k)} ${f1(y1 - 11 * k)} ${f1(x + 22 * k)} ${f1(yr + 1)}Z" fill="url(#qaMonte)" stroke="#7A4A26" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M${f1(x - 18 * k)} ${f1(yl - 3)} Q${f1(x - 14 * k)} ${f1(y0 - 9 * k)} ${x - 8} ${f1(y0 - 5)}" stroke="#FFE6BC" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
      <g fill="#9A6A3E">${[-15, -10, 11, 16].map(d => `<circle cx="${f1(x + d * k)}" cy="${f1(P(x + d * k) - 4 * k)}" r="1.2"/>`).join('')}</g>`; };
  const marca = (x, i) => { const y = P(x); return `<g class="qa-marca toque" data-i="${i}"><path d="M${x} ${f1(y + 2)} V${f1(y - 20)}" stroke="#5E3A1E" stroke-width="3.4" stroke-linecap="round"/><path d="M${x} ${f1(y + 2)} V${f1(y - 20)}" stroke="#C88A50" stroke-width="1.6" stroke-linecap="round"/><path d="M${x + 1} ${f1(y - 20)} l12 3 l-12 4Z" fill="#E5392C" stroke="#7A1410" stroke-width="1"/><path d="M${x + 1} ${f1(y - 18.6)} l6 1.5" stroke="#fff" stroke-width="1.4"/><ellipse cx="${x}" cy="${f1(y + 1)}" rx="8" ry="2" fill="#5A3A1A" opacity=".3"/>${brilhoHotspot(x + 12, y - 30)}<rect x="${x - 22}" y="${f1(y - 40)}" width="44" height="48" fill="transparent"/></g>`; };
  const flor = (x, y, r, cor, esc) => `<g>${[0, 1, 2, 3, 4].map(k => { const a = k * 1.2566 - 1.57; return `<ellipse cx="${f1(x + Math.cos(a) * r)}" cy="${f1(y + Math.sin(a) * r)}" rx="${f1(r * .8)}" ry="${f1(r * .56)}" transform="rotate(${(a * 57.3 + 90).toFixed(0)} ${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)})" fill="${cor}" stroke="${esc}" stroke-width=".7"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${f1(r * .5)}" fill="#FFD447" stroke="#B07A08" stroke-width=".5"/></g>`;
  const rosa = (x, y, s) => `<g><path d="${copa(x, y - 7 * s, 10 * s, 7 * s, 8, .3)}" fill="url(#qaRoseira)" stroke="#2E5A2A" stroke-width="1"/>${[[-5, -10, '#FF5A8A', '#A02A50'], [4, -12, '#E5392C', '#7A1410'], [0, -6, '#FF8AB8', '#9A2E5E'], [7, -6, '#FFD0E0', '#B05A80']].map(([dx, dy, c, e]) => `<circle cx="${f1(x + dx * s)}" cy="${f1(y + dy * s)}" r="${f1(2.6 * s)}" fill="${c}" stroke="${e}" stroke-width=".7"/><path d="M${f1(x + dx * s - 1.2)} ${f1(y + dy * s)} q1.2 -1.4 2.4 0" stroke="${e}" stroke-width=".6" fill="none"/>`).join('')}</g>`;
  const cipreste = (x, y, h) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${f1(h * .16)}" ry="2.4" fill="#2A1A0A" opacity=".25"/><path d="M${x} ${y} V${y - 6}" stroke="#5E3A1E" stroke-width="3"/><path d="M${x} ${f1(y - h)} C${f1(x - h * .16)} ${f1(y - h * .7)} ${f1(x - h * .17)} ${f1(y - h * .2)} ${f1(x - h * .08)} ${y - 4} C${f1(x - 2)} ${y - 2} ${x + 2} ${y - 2} ${f1(x + h * .08)} ${y - 4} C${f1(x + h * .17)} ${f1(y - h * .2)} ${f1(x + h * .16)} ${f1(y - h * .7)} ${x} ${f1(y - h)}Z" fill="url(#qaCipreste)" stroke="#123A2A" stroke-width="1.3"/><path d="M${f1(x - 2)} ${f1(y - h * .85)} C${f1(x - h * .1)} ${f1(y - h * .6)} ${f1(x - h * .1)} ${f1(y - h * .3)} ${f1(x - h * .05)} ${f1(y - h * .1)}" stroke="#8ED0A8" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/><path d="M${x} ${f1(y - h * .8)} l-3 4 M${x} ${f1(y - h * .6)} l3 4 M${x} ${f1(y - h * .4)} l-3 4 M${x} ${f1(y - h * .25)} l3 4" stroke="#1E4A34" stroke-width="1" opacity=".6"/></g>`;
  /* casa de adobe (tijolo de barro) com teto plano e abóbada pequena, para o fundo da vila */
  const casinha = (x, y, w, h, abobada) => `<g><path d="M${x} ${y} V${y - h} H${x + w} V${y}Z" fill="url(#qaAdobeLonge)" stroke="#9A6A3E" stroke-width="1.1"/>${abobada ? `<path d="M${f1(x + w * .2)} ${y - h} C${f1(x + w * .2)} ${f1(y - h - w * .32)} ${f1(x + w * .8)} ${f1(y - h - w * .32)} ${f1(x + w * .8)} ${y - h}Z" fill="url(#qaAdobeLonge)" stroke="#9A6A3E" stroke-width="1.1"/><path d="M${f1(x + w * .3)} ${f1(y - h - w * .12)} q${f1(w * .12)} ${f1(-w * .14)} ${f1(w * .26)} ${f1(-w * .16)}" stroke="#FFF0D2" stroke-width="1" fill="none" opacity=".7"/>` : ''}<path d="M${x - 1} ${y - h} H${x + w + 1}" stroke="#B8875A" stroke-width="2"/><rect x="${f1(x + w * .4)}" y="${f1(y - h * .55)}" width="${f1(w * .2)}" height="${f1(h * .55)}" rx="${f1(w * .1)}" fill="#5E3A20" opacity=".8"/><rect x="${f1(x + w * .12)}" y="${f1(y - h * .75)}" width="${f1(w * .14)}" height="${f1(h * .2)}" fill="#6E4A2E" opacity=".7"/></g>`;
  const badgirLonge = (x, y, h) => `<g><path d="M${x} ${y} V${y - h} H${x + 10} V${y}Z" fill="url(#qaAdobeLonge)" stroke="#9A6A3E" stroke-width="1"/><path d="M${x + 2.4} ${y - h + 3} v10 M${x + 5} ${y - h + 3} v10 M${x + 7.6} ${y - h + 3} v10" stroke="#6E4A2E" stroke-width="1.2"/><path d="M${x - 1} ${y - h} h12" stroke="#B8875A" stroke-width="2"/></g>`;
  /* gente: desenhada com cuidado, roupas de hoje */
  const menina = (x, y) => `<g><path d="M${x - 2.4} ${y - 12} V${y - 1} M${x + 2.4} ${y - 12} V${y - 1}" stroke="#2E4A86" stroke-width="3.6" stroke-linecap="round"/><path d="M${x - 5} ${y} h4.6 M${x + .6} ${y} h4.6" stroke="#F2F2F2" stroke-width="2.6" stroke-linecap="round"/><path d="M${x - 5} ${y + .8} h4.6 M${x + .6} ${y + .8} h4.6" stroke="#E5392C" stroke-width="1" stroke-linecap="round"/>
      <path d="M${x - 6} ${y - 11} C${x - 6.6} ${y - 18} ${x - 5} ${y - 23} ${x} ${y - 23} C${x + 5} ${y - 23} ${x + 6.6} ${y - 18} ${x + 6} ${y - 11}Z" fill="#FFB020" stroke="#9A5A08" stroke-width="1.1"/><path d="M${x - 4} ${y - 17} h8" stroke="#fff" stroke-width="1.2" opacity=".7"/>
      <g class="qa-bracos" style="transform-box:fill-box;transform-origin:50% 0%"><path d="M${x - 5} ${y - 20} l-4 7 M${x + 5} ${y - 20} l4 7" stroke="#C88A5E" stroke-width="2.6" stroke-linecap="round"/></g>
      <path d="M${x - 6} ${y - 29} C${x - 9} ${y - 25} ${x - 9} ${y - 19} ${x - 6} ${y - 18}" stroke="#3A2214" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="${x}" cy="${y - 29}" r="6.2" fill="#D49A6A" stroke="#7A4A2A" stroke-width="1.1"/><path d="M${x - 6.4} ${y - 29.6} C${x - 6.4} ${y - 37} ${x + 6.4} ${y - 37} ${x + 6.4} ${y - 30} C${x + 3} ${y - 32} ${x - 2} ${y - 33} ${x - 6.4} ${y - 29.6}Z" fill="#3A2214"/><circle cx="${x + 5.4}" cy="${y - 34}" r="2.4" fill="#3A2214"/><circle cx="${x + 5.8}" cy="${y - 34}" r="1" fill="#E5392C"/>
      <circle cx="${x - 2.2}" cy="${y - 28.6}" r="1" fill="#2A1A10"/><circle cx="${x + 2.4}" cy="${y - 28.6}" r="1" fill="#2A1A10"/><path d="M${x - 1.6} ${y - 25.8} q1.6 1.4 3.2 0" stroke="#7A3A2A" stroke-width=".9" fill="none" stroke-linecap="round"/><circle cx="${x - 3.8}" cy="${y - 26.6}" r="1.2" fill="#FF8A7A" opacity=".5"/><circle cx="${x + 3.8}" cy="${y - 26.6}" r="1.2" fill="#FF8A7A" opacity=".5"/></g>`;
  const avo = (x, y) => `<g><ellipse cx="${x}" cy="${y - 1}" rx="13" ry="3.4" fill="#8E2A3A" stroke="#5A1424" stroke-width="1"/><path d="M${x - 11} ${y - 1} h22" stroke="#FFC83D" stroke-width="1" stroke-dasharray="2 2"/>
      <path d="M${x - 9} ${y - 2} C${x - 10} ${y - 12} ${x - 7} ${y - 20} ${x} ${y - 20} C${x + 7} ${y - 20} ${x + 9} ${y - 12} ${x + 10} ${y - 2}Z" fill="#3E7A6A" stroke="#1E4A3E" stroke-width="1.1"/><path d="M${x - 6} ${y - 12} q6 3 12 0" stroke="#8ED0B8" stroke-width="1" fill="none" opacity=".7"/>
      <path d="M${x - 5} ${y - 14} q4 4 9 1" stroke="#B88058" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="${x + 5}" cy="${y - 13}" r="2.6" fill="#E5392C" stroke="#7A1410" stroke-width=".6"/>
      <g class="qa-lenco" style="transform-box:fill-box;transform-origin:50% 80%"><path d="M${x - 7.4} ${y - 23} C${x - 9} ${y - 33} ${x - 4} ${y - 37} ${x} ${y - 37} C${x + 4} ${y - 37} ${x + 9} ${y - 33} ${x + 7.4} ${y - 23} L${x + 4} ${y - 19} H${x - 4}Z" fill="#7A4AA8" stroke="#3E1E66" stroke-width="1.1"/><g fill="#F2E2FF">${[[-4, -32], [3, -34], [5, -27], [-6, -26], [0, -36]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r=".8"/>`).join('')}</g></g>
      <ellipse cx="${x}" cy="${y - 27.4}" rx="5" ry="5.6" fill="#C8906A" stroke="#7A4A2A" stroke-width="1"/>
      <path d="M${x - 3.6} ${y - 28.4} h2.6 M${x + 1} ${y - 28.4} h2.6 M${x - 1} ${y - 28.4} h2" stroke="#6E4A2E" stroke-width=".7"/><circle cx="${x - 2.3}" cy="${y - 28.2}" r=".8" fill="#2A1A10"/><circle cx="${x + 2.3}" cy="${y - 28.2}" r=".8" fill="#2A1A10"/>
      <path d="M${x - 1.6} ${y - 25} q1.6 1.2 3.2 0" stroke="#7A3A2A" stroke-width=".8" fill="none" stroke-linecap="round"/><circle cx="${x - 3.4}" cy="${y - 25.6}" r="1.1" fill="#FF8A7A" opacity=".45"/><circle cx="${x + 3.4}" cy="${y - 25.6}" r="1.1" fill="#FF8A7A" opacity=".45"/></g>`;
  /* o muqanni (cavador de qanat) girando o sarilho */
  const cavador = (x, y) => `<g><path d="M${x - 3} ${y - 14} L${x - 4} ${y - 1} M${x + 3} ${y - 14} L${x + 5} ${y - 1}" stroke="#5E4A3A" stroke-width="4" stroke-linecap="round"/><path d="M${x - 7} ${y} h5 M${x + 3} ${y} h5" stroke="#2A1E16" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M${x - 6.6} ${y - 13} C${x - 7} ${y - 22} ${x - 5} ${y - 27} ${x} ${y - 27} C${x + 5} ${y - 27} ${x + 7} ${y - 22} ${x + 6.6} ${y - 13}Z" fill="#3E7AB8" stroke="#1E3A6A" stroke-width="1.1"/><path d="M${x - 6} ${y - 24} L${x - 2} ${y - 13} M${x + 6} ${y - 24} L${x + 2} ${y - 13}" stroke="#6E5236" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y - 26} v12" stroke="#1E3A6A" stroke-width=".7"/><path d="M${x - 4} ${y - 22} q2 -2 4 -2" stroke="#9AC8F0" stroke-width="1.2" fill="none" opacity=".7"/>
      <g id="qa-braco" style="transform-origin:${x + 4}px ${y - 22}px"><path d="M${x + 4} ${y - 22} L${x + 12} ${y - 17}" stroke="#3E7AB8" stroke-width="3.4" stroke-linecap="round"/><circle cx="${x + 13}" cy="${y - 16.6}" r="1.8" fill="#A87050"/></g>
      <circle cx="${x}" cy="${y - 32}" r="6" fill="#A87050" stroke="#5E3414" stroke-width="1.1"/><path d="M${x - 6.4} ${y - 33} C${x - 6} ${y - 40} ${x + 6} ${y - 40} ${x + 6.4} ${y - 33}Z" fill="#E8E2D2" stroke="#8A7A5E" stroke-width="1"/><path d="M${x - 2} ${y - 33.4} h10" stroke="#C8BEA4" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="${x + 2.4}" cy="${y - 31.6}" r=".9" fill="#1A1210"/><path d="M${x + .6} ${y - 28.6} q2.4 1 4.4 -.2" stroke="#3A2414" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="${x + 4.4}" cy="${y - 30}" r="1.1" fill="#FF8A7A" opacity=".4"/></g>`;
  /* jerboa na toca */
  const jerboa = (x, y) => `<g><path d="M${x - 8} ${y} C${x - 22} ${y + 2} ${x - 30} ${y - 4} ${x - 34} ${y - 10}" stroke="#A8784A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${x - 34} ${y - 10} c-4 -2 -6 -6 -3 -8 c2 2 4 4 3 8Z" fill="#2A1A10"/><path d="M${x - 35} ${y - 13} c-1 -2 0 -4 1 -4" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M${x - 4} ${y + 1} c-6 0 -8 -2 -9 -4" stroke="#C89A68" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x}" cy="${y - 5}" rx="8" ry="6.4" fill="url(#qaJerboa)" stroke="#7A4E26" stroke-width="1.2"/><path d="M${x - 5} ${y - 2} q5 3 10 0" fill="#FFF6E2" stroke="none"/>
      <path d="M${x + 3} ${y - 14} C${x + 1} ${y - 22} ${x + 4} ${y - 26} ${x + 6} ${y - 25} C${x + 8} ${y - 22} ${x + 7} ${y - 16} ${x + 6} ${y - 12}Z M${x + 7} ${y - 13} C${x + 8} ${y - 21} ${x + 12} ${y - 24} ${x + 13} ${y - 22} C${x + 14} ${y - 18} ${x + 11} ${y - 14} ${x + 9} ${y - 11}Z" fill="url(#qaJerboa)" stroke="#7A4E26" stroke-width="1"/><path d="M${x + 4.6} ${y - 16} c-.6 -3 0 -6 1.4 -7 M${x + 9.4} ${y - 14} c.6 -3 2 -5 3 -6" stroke="#F2A898" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle cx="${x + 7}" cy="${y - 8}" r="5.6" fill="url(#qaJerboa)" stroke="#7A4E26" stroke-width="1.1"/><circle cx="${x + 8.6}" cy="${y - 9}" r="2" fill="#1A1008"/><circle cx="${x + 9.3}" cy="${y - 9.8}" r=".7" fill="#fff"/><circle cx="${x + 12.4}" cy="${y - 6.6}" r=".8" fill="#E88A8A"/><path d="M${x + 12} ${y - 6} l5 -1 M${x + 12} ${y - 5.4} l5 1" stroke="#7A4E26" stroke-width=".4"/></g>`;
  /* poupa no telhado */
  const poupa = (x, y) => `<g><path d="M${x - 4} ${y - 6} l-10 2 l9 3Z" fill="#2A1A1A"/><path d="M${x - 9} ${y - 5} l4 0 M${x - 12} ${y - 4.4} l3 0" stroke="#fff" stroke-width="1.2"/><path d="M${x - 1} ${y} v3 M${x + 2} ${y} v3" stroke="#6E4A3A" stroke-width="1"/>
      <ellipse cx="${x}" cy="${y - 5}" rx="7" ry="4.6" fill="#E8A07A" stroke="#7A4A2E" stroke-width="1"/><path d="M${x - 5} ${y - 6} q4 -2 8 1 l-2 4 q-4 0 -7 -2Z" fill="#2A1A1A"/><path d="M${x - 4} ${y - 5.4} l2 2 M${x - 1} ${y - 5} l2 2 M${x + 2} ${y - 4} l1.6 2" stroke="#fff" stroke-width="1"/>
      <g class="qa-crista" style="transform-origin:${x + 5}px ${y - 11}px;transition:transform .35s"><path d="M${x + 4} ${y - 11} l-6 -6 M${x + 5} ${y - 11} l-3 -8 M${x + 6} ${y - 11} l0 -8 M${x + 7} ${y - 11} l3 -7" stroke="#E89A6A" stroke-width="2.4" stroke-linecap="round"/><path d="M${x - 2.6} ${y - 17.4} l-.8 -.8 M${x + 1.6} ${y - 19.2} l-.4 -1 M${x + 6} ${y - 19.2} l0 -1 M${x + 10} ${y - 18} l.6 -.8" stroke="#1A1010" stroke-width="2.6" stroke-linecap="round"/></g>
      <circle cx="${x + 6}" cy="${y - 9.6}" r="3.6" fill="#E8A07A" stroke="#7A4A2E" stroke-width="1"/><circle cx="${x + 7}" cy="${y - 10}" r="1" fill="#1A1008"/><circle cx="${x + 7.3}" cy="${y - 10.3}" r=".35" fill="#fff"/><path d="M${x + 9} ${y - 9} q5 1 8 4" stroke="#2A1A10" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
  /* gato-persa sentado na porta */
  const gato = (x, y) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="12" ry="2.4" fill="#3A2410" opacity=".3"/>
      <g class="qa-gato-cauda" style="transform-box:fill-box;transform-origin:0% 100%"><path d="M${x + 7} ${y - 2} C${x + 16} ${y - 2} ${x + 18} ${y - 10} ${x + 14} ${y - 16}" stroke="#9A7A62" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x + 7} ${y - 2} C${x + 16} ${y - 2} ${x + 18} ${y - 10} ${x + 14} ${y - 16}" stroke="#F6E6D2" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <path d="${copa(x, y - 9, 10, 10, 11, .22)}" fill="url(#qaGato)" stroke="#8A6A52" stroke-width="1.2"/>
      <path d="M${x - 5} ${y} v-5 M${x + 1} ${y} v-5" stroke="#E8D4BC" stroke-width="4" stroke-linecap="round"/><path d="M${x - 7} ${y} h4 M${x - 1} ${y} h4" stroke="#B89A80" stroke-width="1" stroke-linecap="round"/>
      <path d="M${x - 9} ${y - 25} l1 -9 l6 5Z M${x + 9} ${y - 25} l-1 -9 l-6 5Z" fill="#F6E6D2" stroke="#8A6A52" stroke-width="1.1" stroke-linejoin="round"/><path d="M${x - 7.6} ${y - 27} l.6 -4 l2.6 2.4Z M${x + 7.6} ${y - 27} l-.6 -4 l-2.6 2.4Z" fill="#F4A8A8"/>
      <path d="${copa(x, y - 23, 10, 8.4, 10, .2)}" fill="url(#qaGato)" stroke="#8A6A52" stroke-width="1.2"/>
      <ellipse cx="${x - 3.6}" cy="${y - 24}" rx="2.2" ry="2.6" fill="#4E9A6A"/><ellipse cx="${x + 3.6}" cy="${y - 24}" rx="2.2" ry="2.6" fill="#4E9A6A"/><ellipse cx="${x - 3.6}" cy="${y - 23.8}" rx=".9" ry="1.9" fill="#1A1008"/><ellipse cx="${x + 3.6}" cy="${y - 23.8}" rx=".9" ry="1.9" fill="#1A1008"/><circle cx="${x - 2.9}" cy="${y - 25}" r=".7" fill="#fff"/><circle cx="${x + 4.3}" cy="${y - 25}" r=".7" fill="#fff"/>
      <path d="M${x - 1.2} ${y - 20.6} h2.4 l-1.2 1.4Z" fill="#E88A8A"/><path d="M${x} ${y - 19.2} q-1.6 1.6 -3 .4 M${x} ${y - 19.2} q1.6 1.6 3 .4" stroke="#8A6A52" stroke-width=".8" fill="none"/>
      <path d="M${x - 4} ${y - 19.6} l-7 -1 M${x - 4} ${y - 18.6} l-7 1 M${x + 4} ${y - 19.6} l7 -1 M${x + 4} ${y - 18.6} l7 1" stroke="#B89A80" stroke-width=".5"/><ellipse cx="${x - 6}" cy="${y - 20}" rx="1.6" ry="1" fill="#FF9A9A" opacity=".5"/><ellipse cx="${x + 6}" cy="${y - 20}" rx="1.6" ry="1" fill="#FF9A9A" opacity=".5"/></g>`;
  /* pastor e cabras */
  const cabra = (x, y, c1, c2, vira) => `<g transform="translate(${x} ${y}) scale(${vira ? -1 : 1} 1)"><ellipse cx="0" cy="1" rx="10" ry="1.8" fill="#4A2A10" opacity=".25"/>
      <path d="M-6 -6 v6 M-3 -6 v6 M4 -6 v6 M7 -6 v6" stroke="${c2}" stroke-width="2" stroke-linecap="round"/>
      <path d="M-9 -10 C-12 -12 -12 -15 -10 -15" stroke="${c2}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="-9" rx="9.6" ry="5" fill="${c1}" stroke="${c2}" stroke-width="1.1"/><path d="M-6 -12 q6 -2 12 0" stroke="#fff" stroke-width="1" fill="none" opacity=".45"/>
      <path d="M7 -11 L10 -17" stroke="${c1}" stroke-width="4" stroke-linecap="round"/>
      <path d="M9 -19 c-2 -4 -6 -4 -7 -2 M10 -19 c0 -4 -3 -6 -5 -5" stroke="#8A7A62" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <ellipse cx="12" cy="-17" rx="4.2" ry="3.2" fill="${c1}" stroke="${c2}" stroke-width="1"/><path d="M9 -18 l-4 2" stroke="${c2}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M14 -14 q0 3 -1 4" stroke="${c2}" stroke-width="1.2" fill="none"/><circle cx="12.6" cy="-18" r=".8" fill="#1A1008"/><circle cx="12.9" cy="-18.3" r=".3" fill="#fff"/></g>`;
  const pastor = (x, y) => `<g><path d="M${x + 9} ${y} L${x + 7} ${y - 34}" stroke="#6E4428" stroke-width="2" stroke-linecap="round"/><path d="M${x + 7} ${y - 34} q-1 -4 3 -5 q3 0 3 3" stroke="#6E4428" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M${x - 2.6} ${y - 12} V${y - 1} M${x + 2.6} ${y - 12} V${y - 1}" stroke="#3A4E7A" stroke-width="3.6" stroke-linecap="round"/><path d="M${x - 5.6} ${y} h4.6 M${x + 1} ${y} h4.6" stroke="#3A2A1E" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${x - 6.4} ${y - 11} C${x - 7} ${y - 19} ${x - 5} ${y - 24} ${x} ${y - 24} C${x + 5} ${y - 24} ${x + 7} ${y - 19} ${x + 6.4} ${y - 11}Z" fill="#4E8A5A" stroke="#24502E" stroke-width="1.1"/><path d="M${x} ${y - 23} v11" stroke="#24502E" stroke-width=".7"/>
      <path d="M${x + 5} ${y - 21} l3 8" stroke="#4E8A5A" stroke-width="3" stroke-linecap="round"/><circle cx="${x + 8}" cy="${y - 12.6}" r="1.5" fill="#B07A52"/><path d="M${x - 5} ${y - 21} l-2 8" stroke="#4E8A5A" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${x}" cy="${y - 29.6}" r="5.6" fill="#B07A52" stroke="#5E3414" stroke-width="1"/><path d="M${x - 6} ${y - 30} C${x - 6} ${y - 37} ${x + 6} ${y - 37} ${x + 6} ${y - 30}Z" fill="#5E4A3A"/><path d="M${x - 1} ${y - 31} h9" stroke="#5E4A3A" stroke-width="2" stroke-linecap="round"/>
      <circle cx="${x + 2}" cy="${y - 29.4}" r=".8" fill="#1A1008"/><path d="M${x + .6} ${y - 26.6} q1.8 1 3.4 -.2" stroke="#5E3414" stroke-width=".9" fill="none" stroke-linecap="round"/><circle cx="${x + 3.6}" cy="${y - 27.6}" r="1" fill="#FF8A7A" opacity=".45"/></g>`;
  /* concha fóssil (amonite) na terra */
  const fossil = (x, y, r) => `<g opacity=".7"><circle cx="${x}" cy="${y}" r="${r}" fill="#E6C8A0" stroke="#8A5A36" stroke-width=".9"/><path d="M${x} ${y} m${f1(r * .1)} 0 a${f1(r * .2)} ${f1(r * .2)} 0 1 1 ${f1(-r * .4)} 0 a${f1(r * .45)} ${f1(r * .45)} 0 1 1 ${f1(r * .85)} 0 a${f1(r * .7)} ${f1(r * .7)} 0 1 1 ${f1(-r * 1.35)} 0" stroke="#8A5A36" stroke-width=".8" fill="none"/></g>`;
  /* superfície da vila */
  const VY = 338;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Corte da terra no Irã: montanha com neve, água escondida debaixo do chão, poços em fila, túnel do qanat até a vila com jardim, casa do gelo e torre de vento; o guepardo Yuzi">
    <defs>
      <linearGradient id="qaCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B86DA"/><stop offset=".4" stop-color="#7DB8EE"/><stop offset=".72" stop-color="#CFE2F0"/><stop offset="1" stop-color="#FCE2BE"/></linearGradient>
      <radialGradient id="qaSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".55" stop-color="#FFD24A"/><stop offset="1" stop-color="#F6A21E"/></radialGradient>
      <linearGradient id="qaLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B2CC"/><stop offset="1" stop-color="#E8D4D2"/></linearGradient>
      <linearGradient id="qaLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B496B2"/><stop offset="1" stop-color="#D8BEB8"/></linearGradient>
      <linearGradient id="qaMonteLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6B08A"/><stop offset=".5" stop-color="#CC8E6A"/><stop offset="1" stop-color="#B07A5E"/></linearGradient>
      <linearGradient id="qaMonteBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8826A"/><stop offset=".6" stop-color="#9A6658"/><stop offset="1" stop-color="#8E6458"/></linearGradient>
      <linearGradient id="qaMonteSombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A5A5E"/><stop offset="1" stop-color="#5E3A4E"/></linearGradient>
      <linearGradient id="qaNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D8E6F6"/></linearGradient>
      <linearGradient id="qaPlanicie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EED0A0"/><stop offset=".5" stop-color="#F2D29C"/><stop offset="1" stop-color="#E6BC80"/></linearGradient>
      <linearGradient id="qaSaia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C89A78" stop-opacity="0"/><stop offset="1" stop-color="#E2B888"/></linearGradient>
      <linearGradient id="qaSolo0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDC38C"/><stop offset="1" stop-color="#DCAA70"/></linearGradient>
      <linearGradient id="qaSolo1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D49A62"/><stop offset="1" stop-color="#C48654"/></linearGradient>
      <linearGradient id="qaSolo2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9784A"/><stop offset="1" stop-color="#A86A40"/></linearGradient>
      <linearGradient id="qaSolo3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A5E3A"/><stop offset="1" stop-color="#7E4A30"/></linearGradient>
      <linearGradient id="qaAquifero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ACCF6" stop-opacity=".5"/><stop offset=".35" stop-color="#4EA8EA" stop-opacity=".48"/><stop offset="1" stop-color="#2A72C8" stop-opacity=".6"/></linearGradient>
      <linearGradient id="qaPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2B49A"/><stop offset="1" stop-color="#8A6A56"/></linearGradient>
      <linearGradient id="qaMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8B680"/><stop offset="1" stop-color="#B07A48"/></linearGradient>
      <linearGradient id="qaTunel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1008"/><stop offset=".7" stop-color="#3A2212"/><stop offset="1" stop-color="#5A3A22"/></linearGradient>
      <linearGradient id="qaPoco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2C18"/><stop offset=".35" stop-color="#2A170C"/><stop offset="1" stop-color="#1A0E06"/></linearGradient>
      <linearGradient id="qaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF2B0" stop-opacity=".95"/><stop offset="1" stop-color="#FFD86A" stop-opacity=".25"/></linearGradient>
      <radialGradient id="qaLampLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE48A" stop-opacity=".95"/><stop offset=".45" stop-color="#FFB83A" stop-opacity=".45"/><stop offset="1" stop-color="#FF9A1E" stop-opacity="0"/></radialGradient>
      <linearGradient id="qaAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EDCFF"/><stop offset="1" stop-color="#2E8AE0"/></linearGradient>
      <linearGradient id="qaTanque" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ED4E6"/><stop offset=".6" stop-color="#1FA0C8"/><stop offset="1" stop-color="#1A6AA0"/></linearGradient>
      <linearGradient id="qaAzulejo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EC4D2"/><stop offset="1" stop-color="#1A7A9A"/></linearGradient>
      <linearGradient id="qaAdobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0CC96"/><stop offset=".6" stop-color="#E2B47C"/><stop offset="1" stop-color="#CC9862"/></linearGradient>
      <linearGradient id="qaAdobeLado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9955E"/><stop offset="1" stop-color="#A87444"/></linearGradient>
      <linearGradient id="qaAdobeLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EACCA0"/><stop offset="1" stop-color="#D8B07C"/></linearGradient>
      <linearGradient id="qaIwan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4228"/><stop offset="1" stop-color="#9A6A44"/></linearGradient>
      <linearGradient id="qaCupula" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F6D4A0"/><stop offset=".55" stop-color="#DDAA70"/><stop offset="1" stop-color="#B07A48"/></linearGradient>
      <linearGradient id="qaGelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9AD8F4"/></linearGradient>
      <linearGradient id="qaCipreste" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3E8A6A"/><stop offset=".6" stop-color="#21604A"/><stop offset="1" stop-color="#16473A"/></linearGradient>
      <radialGradient id="qaRomaCopa" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#A8E06A"/><stop offset=".6" stop-color="#5EAA3A"/><stop offset="1" stop-color="#357A2A"/></radialGradient>
      <radialGradient id="qaRoseira" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#7AC86A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <radialGradient id="qaArbusto" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#C2C890"/><stop offset=".6" stop-color="#94A06A"/><stop offset="1" stop-color="#6A7A4A"/></radialGradient>
      <radialGradient id="qaJerboa" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#F6D8A8"/><stop offset="1" stop-color="#D49E62"/></radialGradient>
      <radialGradient id="qaRomaFruto" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#FF8A7A"/><stop offset=".6" stop-color="#D8283A"/><stop offset="1" stop-color="#8A0E22"/></radialGradient>
      <linearGradient id="qaVerde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD860"/><stop offset="1" stop-color="#5EA83E"/></linearGradient>
      <linearGradient id="qaVento" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#E6F8FF"/><stop offset="1" stop-color="#8ED8FF"/></linearGradient>
      <radialGradient id="qaGato" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFFAF2"/><stop offset=".7" stop-color="#F2E2CC"/><stop offset="1" stop-color="#D8C0A4"/></radialGradient>
      <linearGradient id="qaMadeira" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A4E26"/><stop offset=".5" stop-color="#B0703C"/><stop offset="1" stop-color="#7A4220"/></linearGradient>
      <linearGradient id="qaCascalho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A27E"/><stop offset="1" stop-color="#9A7A62"/></linearGradient>
      <linearGradient id="qaSolo4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5236"/><stop offset="1" stop-color="#6A3E2A"/></linearGradient>
      <linearGradient id="qaCrosta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08450"/><stop offset="1" stop-color="#E2B47E"/></linearGradient>
      <linearGradient id="qaAguaBrilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F8FF" stop-opacity=".8"/><stop offset="1" stop-color="#E6F8FF" stop-opacity="0"/></linearGradient>
      <pattern id="qaAzPadrao" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#1E9CB4"/><path d="M5 .8 L9.2 5 L5 9.2 L.8 5Z" fill="#E8F6F2"/><path d="M5 2.6 L7.4 5 L5 7.4 L2.6 5Z" fill="#1E4E9A"/><circle cx="5" cy="5" r=".9" fill="#F2C24A"/><path d="M0 0 h10 v10" stroke="#156A86" stroke-width=".6" fill="none"/></pattern>
      <radialGradient id="qaVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#2A1408" stop-opacity="0"/><stop offset="1" stop-color="#2A1408" stop-opacity=".38"/></radialGradient>
      <clipPath id="qaCavaClip"><rect id="qa-cava" x="190" y="280" width="0" height="80"/></clipPath>
      <clipPath id="qaAguaClip"><rect id="qa-aguarect" x="190" y="280" width="0" height="80"/></clipPath>
      <clipPath id="qaTanqueClip"><path d="M600 ${VY} L604 362 H670 L674 ${VY}Z"/></clipPath>
      <clipPath id="qaIwanClip"><path d="M708 ${VY} V294 C708 278 738 270 738 270 C738 270 768 278 768 294 V${VY}Z"/></clipPath>
      <clipPath id="qaVistaClip"><circle cx="712" cy="96" r="54"/></clipPath>
      <filter id="qaGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#qaCeu)"/>
    <path d="M330 52 q110 -12 210 -2 M600 120 q80 -8 170 0" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
    <g class="deriva"><use href="#nuvem" x="360" y="26" width="84" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="250" y="66" width="56" height="26" style="color:#fff" opacity=".7"/></g>
    <g id="qa-sol" style="transition:opacity 1.2s"><circle cx="590" cy="58" r="44" fill="#FFE27A" opacity=".2"/><circle cx="590" cy="58" r="32" fill="#FFE27A" opacity=".28"/><circle cx="590" cy="58" r="22" fill="url(#qaSolG)" stroke="#E8901A" stroke-width="2"/><path d="M578 50 q7 -8 17 -8" stroke="#FFF8D2" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
    <!-- serras distantes -->
    <path d="M280 236 L330 202 L362 214 L410 178 L452 200 L500 172 L548 196 L600 168 L650 190 L700 166 L750 188 L800 176 V260 H280Z" fill="url(#qaLonge)"/>
    <path d="M398 186 L410 178 L422 188 L410 190Z M490 180 L500 172 L512 182 L500 184Z M590 176 L600 168 L612 178 L600 180Z M690 174 L700 166 L712 176 L700 178Z" fill="#fff" opacity=".85"/>
    <path d="M410 178 L452 200 L430 236Z M500 172 L548 196 L520 236Z M600 168 L650 190 L622 236Z M700 166 L750 188 L722 236Z" fill="#9A7A9E" opacity=".25"/>
    <path d="M440 222 L480 206 L520 218 L570 200 L620 216 L670 204 L720 218 L770 208 L800 214 V260 H440Z" fill="url(#qaLonge2)" opacity=".8"/>
    <!-- planície -->
    <rect y="226" width="800" height="280" fill="url(#qaPlanicie)"/>
    <path d="M300 236 C420 232 600 238 800 236" stroke="#FFF2D6" stroke-width="2" fill="none" opacity=".6"/>
    <g fill="none" stroke="#B88A56" stroke-width="1.1" opacity=".75">${[[560, 246], [584, 248], [608, 250], [632, 252], [656, 254], [680, 256], [704, 258], [728, 260], [752, 262]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="1.4"/><ellipse cx="${x}" cy="${y + .3}" rx="1.6" ry=".5" fill="#7A4A2A" stroke="none"/>`).join('')}</g>
    <g fill="none" stroke="#C49A66" stroke-width=".9" opacity=".6">${[[600, 238], [618, 239], [636, 240], [654, 241], [672, 242], [690, 243]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1"/>`).join('')}</g>
    <path d="M520 268 C580 262 660 266 760 262 M560 290 C640 284 720 290 800 286" stroke="#D8AE74" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>
    <!-- montanha grande -->
    <g id="qa-pico" class="toque">
      <path d="M-20 270 L-20 150 L12 116 L44 86 L76 60 L100 44 L116 38 L134 50 L156 70 L178 62 L198 52 L214 46 L232 60 L260 90 L292 120 L326 150 L362 182 L400 210 L430 232 L440 270Z" fill="url(#qaMonteBase)" stroke="#5E3A3E" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-20 160 L12 116 L44 86 L76 60 L100 44 L116 38 L96 90 L70 140 L50 200 L40 270 H-20Z" fill="url(#qaMonteLuz)"/>
      <path d="M116 38 L134 50 L156 70 L150 120 L138 180 L130 270 L60 270 L80 190 L100 110Z" fill="url(#qaMonteSombra)" opacity=".85"/>
      <path d="M214 46 L232 60 L260 90 L292 120 L326 150 L362 182 L400 210 L430 232 L440 270 L300 270 L280 200 L250 130Z" fill="url(#qaMonteSombra)" opacity=".55"/>
      <path d="M198 52 L214 46 L250 130 L280 200 L300 270 L250 270 L232 180 L212 110Z" fill="#D29A78" opacity=".55"/>
      <path d="M116 38 L100 110 L80 190 M214 46 L212 110 L232 180 M156 70 L170 120 L176 170" stroke="#F6DCC6" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
      <path d="M40 120 C46 140 44 160 40 180 M70 100 C76 120 74 150 68 170 M250 120 C262 150 270 180 276 210 M300 140 C312 170 320 200 324 230" stroke="#7A4A50" stroke-width="1.8" fill="none" opacity=".4" stroke-linecap="round"/>
      <path d="M60 78 L76 60 L100 44 L116 38 L134 50 L156 70 L148 74 C142 70 138 80 132 76 C126 84 120 76 114 82 C108 78 104 88 98 84 C92 92 86 86 80 92 C74 86 68 92 62 88Z" fill="url(#qaNeve)" stroke="#A8C2DC" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M116 38 L134 50 L156 70 L148 74 C142 70 138 80 132 76 C126 84 120 76 114 82Z" fill="#A8BEE0" opacity=".6"/>
      <path d="M178 62 L198 52 L214 46 L232 60 L244 72 C238 76 232 70 228 78 C222 72 218 82 212 78 C206 84 200 76 194 80 C188 74 184 76 178 72Z" fill="url(#qaNeve)" stroke="#A8C2DC" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M214 46 L232 60 L244 72 C238 76 232 70 228 78 C222 72 218 82 212 78Z" fill="#A8BEE0" opacity=".6"/>
      <path d="M100 48 L92 70 L96 80 M198 58 L192 72" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M20 150 C30 170 26 190 22 210 M94 110 C104 130 100 160 94 190 M180 110 C190 140 196 170 198 200 M226 100 C240 130 250 160 256 190 M350 180 C360 196 366 210 368 226" stroke="#6E3E46" stroke-width="2.4" fill="none" opacity=".3" stroke-linecap="round"/>
      <path d="M8 140 L30 118 M58 104 L76 90 M160 96 L176 86 M272 112 L292 128 M330 160 L350 176" stroke="#F8E0C8" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
      <g fill="#7A4A50" opacity=".25">${Array.from({ length:30 }, () => { const y = R(110, 240), x = R(0, 200 + (y - 46) - 30); return `<path d="M${f1(x)} ${f1(y)} l${f1(R(5, 12))} ${f1(R(-2, 3))} l${f1(R(3, 8))} ${f1(R(1, 5))}" stroke="#6E3E46" stroke-width="1.2" fill="none"/>`; }).join('')}</g>
      <g fill="#4E2E44" opacity=".22"><path d="M44 86 L60 130 L42 172 L30 120Z"/><path d="M156 70 L178 112 L168 156 L150 120Z"/><path d="M260 90 L272 140 L304 172 L292 120Z"/><path d="M326 150 L332 192 L362 182Z"/><path d="M100 110 L112 150 L96 186Z"/></g>
      <g fill="#FFE2C4" opacity=".3"><path d="M76 60 L70 100 L54 124 L60 92Z"/><path d="M178 62 L172 102 L186 132 L192 90Z"/><path d="M198 52 L206 96 L222 120 L214 72Z"/><path d="M12 116 L24 140 L4 170Z"/></g>
      <path d="M76 60 L70 100 L54 124 M178 62 L172 102 L186 132 M12 116 L24 140" stroke="#FFF0DC" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M86 86 l8 10 l-3 6 M126 82 l6 8 M206 76 l5 9 M224 76 l7 8" stroke="#8EA8D0" stroke-width="1.6" fill="none" opacity=".75" stroke-linecap="round"/>
      <g fill="#fff" opacity=".9">${[[70, 74], [104, 52], [140, 64], [188, 66], [222, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3"/>`).join('')}</g>
      <path d="M-20 200 C40 210 120 214 200 230 C260 240 320 246 440 250 V280 H-20Z" fill="url(#qaSaia)"/>
      <path d="M72 186 L42 246 Q72 252 102 246Z" fill="#C49C80" opacity=".55"/><path d="M72 186 L42 246 M72 186 L102 246" stroke="#8A6A5E" stroke-width="1" opacity=".4"/><path d="M168 176 L138 246 Q168 252 198 246Z" fill="#C49C80" opacity=".55"/><path d="M168 176 L138 246 M168 176 L198 246" stroke="#8A6A5E" stroke-width="1" opacity=".4"/><path d="M250 196 L220 246 Q250 252 280 246Z" fill="#C49C80" opacity=".55"/><path d="M250 196 L220 246 M250 196 L280 246" stroke="#8A6A5E" stroke-width="1" opacity=".4"/><path d="M330 214 L300 246 Q330 252 360 246Z" fill="#C49C80" opacity=".55"/><path d="M330 214 L300 246 M330 214 L360 246" stroke="#8A6A5E" stroke-width="1" opacity=".4"/>
      <g>${Array.from({ length:46 }, () => { const x = R(30, 360), y = R(222, 248); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(1.4, 3))}" ry="${f1(R(1, 2))}" fill="${['#A88270', '#D2B49E', '#8A6A5E'][Math.floor(R(0, 2.99))]}" stroke="#6E4E44" stroke-width=".5"/>`; }).join('')}</g>
      <rect x="40" y="30" width="220" height="70" fill="transparent"/>
    </g>
    <!-- onagro na planície, ao pé da montanha -->
    <g id="qa-onagro" class="toque" data-fig="onagro"><ellipse cx="318" cy="206" rx="26" ry="3.6" fill="#5A3A1A" opacity=".25"/><g id="qa-onagro-in" style="transform-origin:318px 206px"><svg x="284" y="150" width="64" height="59" viewBox="0 0 130 120"><use href="#f-onagro"/></svg></g>${brilhoHotspot(344, 152)}</g>
    ${arbusto(258, 196, 7)}
    <!-- casa do gelo (yakhchal), muro de sombra e poça de fazer gelo -->
    <g id="qa-yakh" class="toque" data-fig="yakhchal">
      <path d="M496 256 V218 H570 V258Z" fill="url(#qaAdobeLado)" stroke="#8A5A32" stroke-width="1.4"/><path d="M496 218 l4 -4 h66 l4 4" fill="#F2D4A2" stroke="#8A5A32" stroke-width="1.1"/>
      <path d="M498 226 h70 M498 236 h70 M498 246 h70" stroke="#8E6038" stroke-width=".8" opacity=".5"/>
      <path id="qa-poca" d="M500 262 C504 256 566 256 572 262 C566 268 506 268 500 262Z" fill="#C8A070" stroke="#8A6A40" stroke-width="1.2"/>
      <path id="qa-poca-agua" d="M504 262 C508 258 562 258 568 262 C562 266 508 266 504 262Z" fill="url(#qaAgua)" style="opacity:0;transition:opacity 1s"/>
      <path id="qa-poca-gelo" d="M504 262 C508 258 562 258 568 262 C562 266 508 266 504 262Z" fill="url(#qaGelo)" stroke="#8ACAEA" stroke-width=".8" style="opacity:0;transition:opacity 1.6s"/>
      <ellipse cx="462" cy="256" rx="42" ry="5" fill="#5A3A1A" opacity=".25"/>
      <path d="M424 256 C424 222 446 178 462 168 C478 178 500 222 500 256Z" fill="url(#qaCupula)" stroke="#8A5A32" stroke-width="1.8" stroke-linejoin="round"/>
      ${[1, 2, 3, 4, 5, 6, 7].map(k => `<path d="M${f1(426 + k * 3.6)} ${256 - k * 11} Q462 ${252 - k * 11 - 3} ${f1(498 - k * 3.6)} ${256 - k * 11}" stroke="#A8784A" stroke-width="1" fill="none" opacity=".6"/>`).join('')}
      <path d="M458 172 C450 186 438 216 434 250" stroke="#FFEACC" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M462 168 C466 170 469 173 470 176 C467 179 459 179 456 176 C457 172 459 170 462 168Z" fill="#9A6A3E" stroke="#8A5A32" stroke-width="1"/>
      <path d="M452 256 V244 C452 238 472 238 472 244 V256Z" fill="#4E2E1A" stroke="#6E4428" stroke-width="1"/>
      <g id="qa-yakh-corte" style="opacity:0;transition:opacity 1.2s"><path d="M438 256 V234 C438 222 486 222 486 234 V256Z" fill="#3A2414" stroke="#6E4428" stroke-width="1.2"/><path d="M441 256 V236 C441 228 483 228 483 236 V256Z" fill="#5E3A20"/>
        <g stroke="#4E8AB8" stroke-width=".9">${[[443, 248], [456, 248], [469, 248], [449, 240], [462, 240], [472, 240]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="7.6" rx="1.4" fill="url(#qaGelo)"/>`).join('')}</g>
        <path d="M445 249.4 h4 M458 249.4 h4 M471 249.4 h4 M451 241.4 h4" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/></g>
      <g class="qa-dica3" style="display:none">${brilhoHotspot(484, 186)}</g>
      ${brilhoHotspot(446, 178)}
      <rect x="448" y="164" width="126" height="106" fill="transparent"/><rect x="424" y="164" width="24" height="70" fill="transparent"/>
    </g>
    <!-- pastor com as cabras -->
    <g id="qa-rebanho" class="toque">
      <g class="qa-cabra">${cabra(366, 240, '#3A2E2A', '#14100C')}</g><g class="qa-cabra">${cabra(386, 242, '#F4EEE4', '#8A7A6A')}</g><g class="qa-cabra">${cabra(436, 246, '#C8925A', '#6E4428', true)}</g>
      ${pastor(410, 244)}
      <rect x="352" y="204" width="96" height="44" fill="transparent"/>
    </g>
    <!-- fundo da vila -->
    <g id="qa-vila-fundo">
      ${casinha(604, 324, 34, 24, true)}${casinha(640, 322, 28, 30)}${badgirLonge(656, 292, 22)}${casinha(668, 324, 40, 22, true)}
      <path d="M598 326 C650 320 720 322 800 320 V340 H598Z" fill="#E6BE84"/>
    </g>
    <g class="qa-jardim-cresce" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform 1.1s cubic-bezier(.3,1.4,.5,1) .3s">${cipreste(610, 334, 52)}</g>
    <g class="qa-jardim-cresce" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform 1.1s cubic-bezier(.3,1.4,.5,1) .55s">${cipreste(666, 334, 58)}</g>
    <g class="qa-jardim-cresce" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform 1.1s cubic-bezier(.3,1.4,.5,1) .8s">${cipreste(638, 330, 38)}</g>
    <!-- o corte da terra -->
    <g id="qa-corte">
      <path d="M-10 ${f1(P(-10))} L${linha(0, 800, P, 0, 8)} L810 ${f1(P(810))} V505 H-10Z" fill="url(#qaSolo0)"/>
      ${[[.2, 1, 'qaSolo1'], [.38, 2.2, 'qaCrosta'], [.5, 3.1, 'qaSolo2'], [.7, 4.3, 'qaSolo3'], [.86, 5.2, 'qaSolo4']].map(([f, k, g]) => `<path d="M-10 505 V${f1(camada(f, k)(-10))} L${linha(0, 800, camada(f, k), 0, 10)} L810 505Z" fill="url(#${g})"/><path d="M0 ${f1(camada(f, k)(0))} L${linha(0, 800, camada(f, k), -1.2, 10)}" stroke="#FFE6C0" stroke-width="1.1" fill="none" opacity=".4"/><path d="M0 ${f1(camada(f, k)(0) + 1.4)} L${linha(0, 800, camada(f, k), 1.4, 10)}" stroke="#5E3420" stroke-width="1" fill="none" opacity=".25"/>`).join('')}
      <g fill="#7A4A2A" opacity=".22">${Array.from({ length:340 }, () => { const x = R(0, 800), y = R(P(x) + 6, 500); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R(.5, 1.1))}"/>`; }).join('')}</g>
      <g fill="#FFF0D0" opacity=".25">${Array.from({ length:160 }, () => { const x = R(0, 800), y = R(P(x) + 6, 500); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R(.4, .9))}"/>`; }).join('')}</g>
      <g>${Array.from({ length:22 }, () => { const x = R(10, 790), y = R(P(x) + 18, 490), n = Math.floor(R(3, 6)); return Array.from({ length:n }, () => { const dx = R(-7, 7), dy = R(-4, 4); return `<ellipse cx="${f1(x + dx)}" cy="${f1(y + dy)}" rx="${f1(R(1.8, 3.8))}" ry="${f1(R(1.3, 2.6))}" fill="${['#B88458', '#E2B888', '#9A7060', '#CDA078', '#A89488'][Math.floor(R(0, 4.99))]}" stroke="#6E4428" stroke-width=".6"/><path d="M${f1(x + dx - 1.2)} ${f1(y + dy - .8)} h1.6" stroke="#FFF4DC" stroke-width=".7" opacity=".8"/>`; }).join(''); }).join('')}</g>
      ${fossil(92, 236, 5)}${fossil(474, 372, 4.4)}${fossil(700, 404, 5)}${fossil(150, 330, 3.6)}
      <g stroke="#9A6A3E" stroke-width=".9" fill="none" opacity=".3">${Array.from({ length:22 }, () => { const x = R(0, 790), y = R(P(x) + 14, 490); return `<path d="M${f1(x)} ${f1(y)} q5 -2 10 0 q5 2 10 0"/>`; }).join('')}</g>
      <path d="M-10 ${f1(P(-10))} L${linha(0, 800, P, 0, 8)} L810 ${f1(P(810))} L${linha(0, 800, P, 7, 8).split(' L').reverse().join(' L')}Z" fill="#B87A48" opacity=".35"/>
      <!-- água guardada entre as pedrinhas: o lençol debaixo da montanha -->
      <g id="qa-aquifero">
        <path d="M-10 ${f1(W(-10))} L${linha(0, 800, W, 0, 10)} L810 ${f1(W(810))} V505 H-10Z" fill="url(#qaCascalho)"/>
        ${[22, 52, 92, 140].map((d, k) => `<path d="M0 ${f1(W(0) + d)} L${linha(0, 800, W, d + 3 * Math.sin(k), 10)}" stroke="#5E4A40" stroke-width="1.2" fill="none" opacity=".35"/>`).join('')}
        <g>${Array.from({ length:190 }, () => { const x = R(-4, 804), y = R(W(x) + 8, 502); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(2.4, 5.6))}" ry="${f1(R(1.8, 3.4))}" fill="${['#C8AE94', '#B09A86', '#D8C4AA', '#A89C92'][Math.floor(R(0, 3.99))]}" stroke="#5E4A40" stroke-width=".8"/><path d="M${f1(x - 1.4)} ${f1(y - 1)} q1.2 -.8 2.4 0" stroke="#F6E8D6" stroke-width=".7" fill="none"/>`; }).join('')}</g>
        <path d="M-10 ${f1(W(-10))} L${linha(0, 800, W, 0, 10)} L810 ${f1(W(810))} V505 H-10Z" fill="url(#qaAquifero)"/>
        <path d="M-10 ${f1(W(-10))} L${linha(0, 800, W, 0, 10)} L810 ${f1(W(810))} L${linha(0, 800, W, 16, 10).split(' L').reverse().join(' L')}Z" fill="url(#qaAguaBrilho)" opacity=".7"/>
        <path d="M0 ${f1(W(0))} L${linha(0, 800, W, 0, 10)}" stroke="#E6F8FF" stroke-width="2.4" fill="none" opacity=".85" stroke-linecap="round"/>
        <path id="qa-aquifero-onda" d="M0 ${f1(W(0) + 6)} L${linha(0, 800, W, 6, 10)}" stroke="#F2FBFF" stroke-width="1.2" fill="none" stroke-dasharray="24 30" opacity=".6"/>
        <g stroke="#DDF4FF" stroke-width="1.1" fill="none" opacity=".4" stroke-linecap="round">${Array.from({ length:12 }, (_, k) => { const x = 30 + k * 64 + R(-10, 10), y = W(x) + R(26, 80); return `<path d="M${f1(x)} ${f1(y)} q6 -2 12 0 q6 2 12 0"/>`; }).join('')}</g>
        <g fill="#CFEFFF" stroke="#3E86C8" stroke-width=".7">${[[60, 30], [130, 22], [252, 40], [330, 28], [470, 34], [610, 26], [720, 40], [520, 70], [170, 70], [40, 90]].map(([x, d]) => { const y = W(x) + d; return `<path d="M${x} ${f1(y - 4)} q3 4 0 5.6 q-3 -1.6 0 -5.6Z"/>`; }).join('')}</g>
      </g>
      <!-- toca do jerboa -->
      <g id="qa-toca" class="toque"><path d="M368 ${f1(P(368) + 2)} C370 256 382 262 380 270" stroke="#6E4428" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M368 ${f1(P(368) + 2)} C370 256 382 262 380 270" stroke="#4A2C18" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="378" cy="276" rx="16" ry="10" fill="#4A2C18" stroke="#6E4428" stroke-width="1.6"/><path d="M364 282 q14 4 28 0" stroke="#C8A070" stroke-width="2" fill="none" opacity=".6"/>
        <g id="qa-jerboa"><g id="qa-jerboa-in" style="transition:transform .5s cubic-bezier(.3,1.6,.5,1)"><g transform="translate(380 284) scale(.68) translate(-380 -284)">${jerboa(380, 284)}</g></g></g>
        <rect x="356" y="240" width="40" height="50" fill="transparent"/></g>
      <!-- raízes -->
      <g stroke="#8A5A32" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"><path d="M270 ${f1(P(270))} q-2 8 2 14 q3 5 0 10 M270 ${f1(P(270) + 6)} l6 6"/><path d="M420 ${f1(P(420))} q2 8 -2 14 M420 ${f1(P(420) + 6)} l-5 5"/><path d="M574 ${f1(P(574) + 2)} q-4 12 -12 18 M574 ${f1(P(574) + 2)} q2 14 8 22 q2 6 -2 10 M574 ${f1(P(574) + 6)} q10 6 14 14"/></g>
      <!-- poços (escavados durante o jogo) -->
      <g id="qa-pocos">
        <rect class="qa-poco" data-i="0" x="${MAE - 6}" y="${f1(P(MAE))}" width="12" height="0" fill="url(#qaPoco)" stroke="#6E4428" stroke-width="1.2"/>
        ${POCOS.map((x, i) => `<rect class="qa-poco" data-i="${i + 1}" x="${x - 5}" y="${f1(P(x))}" width="10" height="0" fill="url(#qaPoco)" stroke="#6E4428" stroke-width="1.2"/>`).join('')}
        <rect id="qa-mae-agua" x="${MAE - 6}" y="${FUNDO_MAE}" width="12" height="0" fill="url(#qaAgua)"/>
        ${[MAE, ...POCOS].map((x, i) => `<path class="qa-feixe" data-i="${i}" d="M${x - 4} ${f1(P(x))} L${x + 4} ${f1(P(x))} L${x + 7} ${f1(T(x) - 6)} L${x - 7} ${f1(T(x) - 6)}Z" fill="url(#qaLuz)" style="opacity:0;transition:opacity 1s"/>`).join('')}
      </g>
      <!-- túnel do qanat (cavado arrastando o lampião) -->
      <g id="qa-trilha" style="display:none"><path d="M${MAE} ${f1(T(MAE) - 8)} L${XO + 6} ${f1(T(XO + 6) - 8)}" stroke="#FFF2C8" stroke-width="3" fill="none" stroke-dasharray="2 9" stroke-linecap="round" opacity=".95"/><path d="M${XO - 6} ${f1(T(XO) - 15)} l12 7 l-12 6Z" fill="#FFF2C8" opacity=".9"/></g>
      <g clip-path="url(#qaCavaClip)">
        <path d="M${MAE - 4} ${f1(T(MAE) - 8)} L${XO + 10} ${f1(T(XO + 10) - 8)}" stroke="#7A4A26" stroke-width="20" fill="none"/>
        <path d="M${MAE - 4} ${f1(T(MAE) - 8)} L${XO + 10} ${f1(T(XO + 10) - 8)}" stroke="url(#qaTunel)" stroke-width="16" fill="none"/>
        <path d="M${MAE - 4} ${f1(T(MAE) - .6)} L${XO + 10} ${f1(T(XO + 10) - .6)}" stroke="#7A5232" stroke-width="2" fill="none"/>
        <g fill="none" stroke="#C8844A" stroke-width="1.4" opacity=".55">${Array.from({ length:13 }, (_, k) => { const x = 230 + k * 24; return `<ellipse cx="${x}" cy="${f1(T(x) - 8)}" rx="2.6" ry="8.4"/>`; }).join('')}</g>
      </g>
      <g clip-path="url(#qaAguaClip)">
        <path d="M${MAE - 4} ${f1(T(MAE) - 3)} L${XO + 10} ${f1(T(XO + 10) - 3)}" stroke="url(#qaAgua)" stroke-width="5.4" fill="none"/>
        <path class="qa-fluxo" d="M${MAE - 4} ${f1(T(MAE) - 4)} L${XO + 10} ${f1(T(XO + 10) - 4)}" stroke="#E6F8FF" stroke-width="1.3" fill="none" stroke-dasharray="5 11" stroke-linecap="round"/>
      </g>
      <g id="qa-gotas" style="opacity:0;transition:opacity 1s"><g fill="#BFEAFF" stroke="#2E7AC8" stroke-width=".6">${[[206, 300], [214, 304], [222, 306], [230, 309], [240, 311]].map(([x, y]) => `<path d="M${x} ${y - 3} q2 3 0 4.4 q-2 -1.4 0 -4.4Z"/>`).join('')}</g></g>
      <!-- boca do qanat na vila e canal aberto até o jardim -->
      <path d="M548 ${f1(P(548))} L548 ${f1(T(548) + 2)} L598 ${f1(T(548) + 3)} L600 ${VY}" fill="#5A3A22" stroke="#4A2C18" stroke-width="1.4"/>
      <path id="qa-canal-agua" d="M546 ${f1(T(548) - 2.4)} L600 ${f1(T(548) - 1.4)}" stroke="url(#qaAgua)" stroke-width="5" fill="none" style="opacity:0;transition:opacity .8s"/>
      <path class="qa-fluxo2" d="M546 ${f1(T(548) - 3)} L600 ${f1(T(548) - 2)}" stroke="#E6F8FF" stroke-width="1.2" fill="none" stroke-dasharray="5 9" style="opacity:0"/>
      <g id="qa-boca"><path d="M${XO - 12} ${f1(T(XO) + 2)} V${f1(T(XO) - 14)} C${XO - 12} ${f1(T(XO) - 27)} ${XO + 12} ${f1(T(XO) - 27)} ${XO + 12} ${f1(T(XO) - 14)} V${f1(T(XO) + 2)}Z" fill="#8A6A56" stroke="#4E3A2E" stroke-width="1.6"/><path d="M${XO - 7} ${f1(T(XO) + 2)} V${f1(T(XO) - 13)} C${XO - 7} ${f1(T(XO) - 20)} ${XO + 7} ${f1(T(XO) - 20)} ${XO + 7} ${f1(T(XO) - 13)} V${f1(T(XO) + 2)}Z" fill="#2A170C"/><path d="M${XO - 12} ${f1(T(XO) - 6)} h5 M${XO + 7} ${f1(T(XO) - 6)} h5 M${XO - 10} ${f1(T(XO) - 19)} l4 3 M${XO + 10} ${f1(T(XO) - 19)} l-4 3 M${XO} ${f1(T(XO) - 24)} v4" stroke="#4E3A2E" stroke-width="1"/><path d="M${XO - 10} ${f1(T(XO) - 16)} C${XO - 9} ${f1(T(XO) - 23)} ${XO - 3} ${f1(T(XO) - 25)} ${XO + 2} ${f1(T(XO) - 25)}" stroke="#E2CCB6" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
      <!-- tanque do jardim (espelho-d'água) com azulejos -->
      <g id="qa-tanque" class="toque">
        <path d="M598 ${VY} L602 365 H672 L676 ${VY}Z" fill="#3A2E2A" stroke="#14506A" stroke-width="4.4" stroke-linejoin="round"/>
        <path d="M600 ${VY} L604 362 H670 L674 ${VY}Z" fill="url(#qaAzPadrao)"/>
        <path d="M600 ${VY} L604 362 H670 L674 ${VY}Z" fill="#0A2A3A" opacity=".18"/>
        <g clip-path="url(#qaTanqueClip)"><rect id="qa-tanque-agua" x="594" y="364" width="90" height="30" fill="url(#qaTanque)" opacity=".86"/>
          <g id="qa-reflexo" style="opacity:0;transition:opacity 1.4s"><path d="M610 342 C607 348 607 356 610 362 C613 356 613 348 610 342Z M666 342 C662 349 662 357 666 363 C670 357 670 349 666 342Z" fill="#21604A" opacity=".35"/><path d="M606 344 h18 M640 346 h22 M616 352 h12 M650 356 h14" stroke="#F2FFFF" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></g>
          <path id="qa-tanque-brilho" d="M606 368 h20 M640 370 h24" stroke="#E6FFFF" stroke-width="2" stroke-linecap="round" opacity="0"/></g>
        <path d="M596 ${VY - 1} H604 M670 ${VY - 1} H678" stroke="#F2F6F0" stroke-width="3" stroke-linecap="round"/><path d="M596 ${VY - 1} H604 M670 ${VY - 1} H678" stroke="#1E9CB4" stroke-width="1.4" stroke-dasharray="2 2"/>
        <g id="qa-fonte" style="opacity:0;transition:opacity .8s"><path d="M637 ${VY + 4} V${VY - 20}" stroke="#BFF0FF" stroke-width="2.4" stroke-linecap="round"/><path class="qa-jato" d="M637 ${VY - 20} q-10 -4 -16 14 M637 ${VY - 20} q10 -4 16 14" stroke="#E6FAFF" stroke-width="1.8" fill="none" stroke-dasharray="3 4" stroke-linecap="round"/><circle cx="637" cy="${VY - 22}" r="2.6" fill="#E6FAFF"/></g>
        <g id="qa-ondas"></g>
        <rect x="596" y="${VY - 26}" width="82" height="54" fill="transparent"/>
      </g>
      <g id="qa-comporta" class="toque"><g id="qa-tabua" style="transition:transform .8s cubic-bezier(.3,1.4,.5,1)"><rect x="589" y="${f1(T(548) - 14)}" width="7" height="16" rx="1.4" fill="#B07A44" stroke="#5E3414" stroke-width="1.2"/><circle cx="592.5" cy="${f1(T(548) - 17)}" r="2.4" fill="#8A5A2A" stroke="#5E3414" stroke-width="1"/></g><rect x="578" y="${f1(T(548) - 34)}" width="24" height="44" fill="transparent"/></g>
      <g id="qa-dica-jardim" class="qa-dica3" style="display:none">${brilhoHotspot(612, 318)}</g>
    </g>
    <!-- borda do corte: casca do chão com areia -->
    <g pointer-events="none">
    <path d="M-10 ${f1(P(-10))} L${linha(0, 800, P, 0, 8)} L810 ${f1(P(810))}" stroke="#A8703E" stroke-width="5" fill="none" opacity=".45"/>
    <path d="M-10 ${f1(P(-10))} L${linha(0, 800, P, 0, 8)} L810 ${f1(P(810))}" stroke="#FFEFCC" stroke-width="2.2" fill="none"/>
    <path id="qa-grama" d="M560 ${f1(P(560) + 1)} L${linha(560, 800, P, 1, 8)} L800 ${f1(P(800) + 6)} L${linha(560, 800, P, 6, 8).split(' L').reverse().join(' L')}Z" fill="url(#qaVerde)" pointer-events="none" style="opacity:0;transition:opacity 1.4s"/>
    <g>${Array.from({ length:46 }, () => { const x = R(0, 590); return tufo(x, P(x) + 1, R(.7, 1.1), '#F6E2A0', '#A08A4A'); }).join('')}</g>
    ${arbusto(150, P(150) + 1, 9)}${arbusto(312, P(312) + 1, 8)}${arbusto(452, P(452) + 1, 7)}${pedra(232, P(232) + 2, 7, 5)}${pedra(296, P(296) + 2, 5, 4)}${pedra(500, P(500) + 2, 6, 4)}
    <!-- montinhos de terra (aparecem quando os poços são cavados) -->
    ${[MAE, ...POCOS].map((x, i) => `<g class="qa-monte" data-i="${i}" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .7s cubic-bezier(.3,1.5,.5,1)">${monte(x, i === 0 ? 1.15 : 1)}</g>`).join('')}
    </g>
    ${POCOS.map((x, i) => marca(x, i + 1)).join('')}
    <!-- sarilho e cavador no poço-mãe -->
    <g id="qa-sarilho" class="toque" style="opacity:0;pointer-events:none;transition:opacity .8s">
      <g transform="translate(${MAE} ${f1(P(MAE))}) scale(1.4) translate(${-MAE} ${f1(-P(MAE))})">
      <path d="M${MAE - 15} ${f1(P(MAE - 15) + 2)} L${MAE - 12} ${f1(P(MAE) - 27)} M${MAE + 15} ${f1(P(MAE + 15) + 2)} L${MAE + 12} ${f1(P(MAE) - 27)}" stroke="#5E3414" stroke-width="4.4" stroke-linecap="round"/><path d="M${MAE - 15} ${f1(P(MAE - 15) + 2)} L${MAE - 12} ${f1(P(MAE) - 27)} M${MAE + 15} ${f1(P(MAE + 15) + 2)} L${MAE + 12} ${f1(P(MAE) - 27)}" stroke="#B07A44" stroke-width="2.2" stroke-linecap="round"/>
      <rect x="${MAE - 15}" y="${f1(P(MAE) - 30)}" width="30" height="6" rx="3" fill="#8A5A2A" stroke="#4E2A10" stroke-width="1.2"/><path d="M${MAE - 12} ${f1(P(MAE) - 28.6)} h24" stroke="#D8A46A" stroke-width="1" opacity=".8"/>
      <path id="qa-corda" d="M${MAE} ${f1(P(MAE) - 24)} V${f1(P(MAE) + 10)}" stroke="#E2C89A" stroke-width="1.2"/>
      <g id="qa-balde"><path d="M${MAE - 4} ${f1(P(MAE) + 10)} h8 l-1 7 h-6Z" fill="#6E4A2E" stroke="#3A2414" stroke-width="1"/><path d="M${MAE - 4} ${f1(P(MAE) + 10)} q4 -4 8 0" stroke="#3A2414" stroke-width=".8" fill="none"/></g>
      <g id="qa-manivela" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="${MAE + 17}" cy="${f1(P(MAE) - 27)}" r="7" fill="none" stroke="#5E3414" stroke-width="2.4"/><circle cx="${MAE + 17}" cy="${f1(P(MAE) - 27)}" r="7" fill="none" stroke="#C88A50" stroke-width="1"/>${[0, 45, 90, 135].map(a => `<path d="M${f1(MAE + 17 + 7 * Math.cos(a / 57.3))} ${f1(P(MAE) - 27 + 7 * Math.sin(a / 57.3))} L${f1(MAE + 17 - 7 * Math.cos(a / 57.3))} ${f1(P(MAE) - 27 - 7 * Math.sin(a / 57.3))}" stroke="#8A5A2A" stroke-width="1.3"/>`).join('')}<circle cx="${MAE + 17}" cy="${f1(P(MAE) - 27)}" r="1.8" fill="#4E2A10"/></g><path d="M${MAE - 8} ${f1(P(MAE) - 30)} l2 6 M${MAE - 4} ${f1(P(MAE) - 30)} l2 6 M${MAE} ${f1(P(MAE) - 30)} l2 6 M${MAE + 4} ${f1(P(MAE) - 30)} l2 6" stroke="#E2C89A" stroke-width="1.2"/>
      ${cavador(MAE + 30, P(MAE) + 7)}
      </g>
    </g>
    <!-- lampião do cavador no túnel -->
    <g id="qa-lamp" class="toque" style="display:none;cursor:grab"><g id="qa-lamp-pos">
      <circle r="30" fill="url(#qaLampLuz)"/>
      <g><path d="M-9 7 v-6 M-5 7 v-6" stroke="#5E4A3A" stroke-width="2.4" stroke-linecap="round"/><path d="M-12 1 C-12 -6 -2 -8 -2 -1Z" fill="#3E7AB8" stroke="#1E3A6A" stroke-width=".8"/><circle cx="-6" cy="-9" r="3.6" fill="#A87050" stroke="#5E3414" stroke-width=".8"/><path d="M-10 -10 C-10 -15 -2 -15 -2 -10Z" fill="#FFC83D" stroke="#9A6A08" stroke-width=".8"/><circle cx="-2.4" cy="-11.6" r="1.2" fill="#FFF6C8"/><path d="M-3 -3 l5 -1" stroke="#A87050" stroke-width="1.8" stroke-linecap="round"/></g>
      <g><path d="M3 -8 h6 l-1 2 h-4Z" fill="#6E4A2E"/><rect x="2.6" y="-6" width="7" height="9" rx="1.6" fill="#FFE48A" stroke="#7A4A1A" stroke-width="1"/><path d="M6 -4.4 q-1.6 2 0 3.6 q1.6 -1.6 0 -3.6Z" fill="#FF8A1E"/><path d="M2.6 3 h7" stroke="#7A4A1A" stroke-width="1.4"/></g>
      <g id="qa-lamp-dica">${brilhoHotspot(16, -18)}</g>
      <circle r="28" fill="transparent"/></g></g>
    <!-- romãzeira -->
    <g id="qa-roma" class="toque" data-fig="roma">
      <ellipse cx="574" cy="${f1(P(574) + 2)}" rx="22" ry="3.4" fill="#4A2A10" opacity=".3"/>
      <path d="M574 ${f1(P(574) + 2)} C572 316 576 308 572 298 M573 312 C566 306 560 302 556 294 M574 306 C582 300 588 296 592 288" stroke="#6E4428" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M574 ${f1(P(574) + 2)} C572 316 576 308 572 298" stroke="#A8724A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="${copa(560, 288, 17, 13, 10, .28)}" fill="url(#qaRomaCopa)" stroke="#2E5A1E" stroke-width="1.4"/><path d="${copa(588, 284, 16, 13, 10, .28)}" fill="url(#qaRomaCopa)" stroke="#2E5A1E" stroke-width="1.4"/><path d="${copa(574, 272, 18, 14, 10, .28)}" fill="url(#qaRomaCopa)" stroke="#2E5A1E" stroke-width="1.4"/>
      <path d="M560 264 q8 -6 18 -5" stroke="#E0FFB0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <g fill="#C8F07A" opacity=".6">${Array.from({ length:14 }, () => `<ellipse cx="${f1(R(548, 600))}" cy="${f1(R(264, 296))}" rx="1.6" ry="1"/>`).join('')}</g>
      ${[[560, 292, 4.2], [586, 290, 4], [574, 276, 3.8], [550, 282, 3.4]].map(([x, y, r]) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="url(#qaRomaFruto)" stroke="#6E0A1A" stroke-width="1"/><path d="M${x - 1.6} ${f1(y - r)} l1.6 -2 l1.6 2" fill="#C82A3A" stroke="#6E0A1A" stroke-width=".7"/><circle cx="${f1(x - r * .35)}" cy="${f1(y - r * .35)}" r="${f1(r * .25)}" fill="#fff" opacity=".6"/></g>`).join('')}
      <g class="qa-romas-novas">${[[568, 286, 3.6], [596, 280, 3.4], [556, 272, 3.2]].map(([x, y, r], k) => `<g style="transform-box:fill-box;transform-origin:50% 50%;transform:scale(0);transition:transform .7s cubic-bezier(.3,1.6,.5,1) ${(1 + k * .25).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="${r}" fill="url(#qaRomaFruto)" stroke="#6E0A1A" stroke-width="1"/><circle cx="${f1(x - r * .35)}" cy="${f1(y - r * .35)}" r="${f1(r * .25)}" fill="#fff" opacity=".6"/></g>`).join('')}${flor(582, 266, 2.6, '#FF7A2A', '#A8400E')}${flor(548, 290, 2.4, '#FF7A2A', '#A8400E')}</g>
      <g id="qa-roma-cai"><circle cx="586" cy="290" r="4" fill="url(#qaRomaFruto)" stroke="#6E0A1A" stroke-width="1" style="opacity:0"/></g>
      ${brilhoHotspot(598, 262)}
      <rect x="540" y="254" width="62" height="64" fill="transparent"/>
    </g>
    <g class="qa-jardim-cresce" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1) 1s">${rosa(602, VY - 1, 1)}${rosa(676, VY - 1, .9)}</g>
    <!-- casa com iwan (varanda em arco), cúpula, porta de madeira e badgir (torre de vento) -->
    <g id="qa-casa">
      <ellipse cx="744" cy="${VY + 1}" rx="64" ry="4.4" fill="#4A2A10" opacity=".3"/>
      <path d="M690 250 C690 222 728 222 728 250Z" fill="url(#qaCupula)" stroke="#8A5A32" stroke-width="1.6"/><path d="M696 244 C698 232 708 228 716 228" stroke="#FFEACC" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M709 229 v-6" stroke="#8A5A32" stroke-width="2.4" stroke-linecap="round"/><circle cx="709" cy="222" r="2" fill="#C9955E" stroke="#8A5A32" stroke-width=".8"/>
      <g id="qa-badgir" class="toque">
        <path d="M752 252 V160 H786 V252Z" fill="url(#qaAdobe)" stroke="#8A5A32" stroke-width="1.6"/>
        <path d="M786 252 V160 l7 -5 V250Z" fill="url(#qaAdobeLado)" stroke="#8A5A32" stroke-width="1.2"/>
        <path d="M748 160 H790 l5 -5 H753Z" fill="#F2D4A2" stroke="#8A5A32" stroke-width="1.2"/><path d="M748 160 H790" stroke="#8A5A32" stroke-width="1.8"/>
        ${[756, 763.4, 770.8, 778.2].map(x => `<rect x="${x}" y="168" width="4.6" height="38" rx="1.2" fill="#2E1A0E"/><path d="M${x + 1} 170 v8" stroke="#6E4428" stroke-width=".8"/>`).join('')}
        <path d="M754 212 H784 M754 216 H784" stroke="#B8875A" stroke-width="1.2"/><path d="M754 226 H784 M754 238 H784" stroke="#C89A68" stroke-width=".8" opacity=".6"/>
        <path d="M755 164 V250" stroke="#FFF0D2" stroke-width="1.8" opacity=".6"/>
        <g class="qa-dica3" style="display:none">${brilhoHotspot(798, 170)}</g>
        <rect x="744" y="150" width="54" height="102" fill="transparent"/>
      </g>
      <path d="M684 ${VY} V250 H800 V${VY}Z" fill="url(#qaAdobe)" stroke="#8A5A32" stroke-width="1.8"/>
      <path d="M682 250 H802" stroke="#C9955E" stroke-width="4.4"/><path d="M682 248.4 H802" stroke="#FFF0D2" stroke-width="1.2" opacity=".75"/>
      <g stroke="#C89A68" stroke-width=".8" opacity=".45" fill="none">${Array.from({ length:15 }, (_, k) => { const y = VY - 6 - k * 5.6; let d = `M686 ${f1(y)}H799`; for (let x = 688 + (k % 2) * 6; x < 798; x += 12) d += `M${x} ${f1(y)}v-5.6`; return `<path d="${d}"/>`; }).join('')}</g>
      <g fill="#F6DCB0" opacity=".55">${[[694, 262, 8, 4], [786, 276, 7, 5], [690, 322, 6, 4], [794, 318, 5, 3]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join('')}</g>
      <g stroke="#A8784A" stroke-width=".8" opacity=".5">${Array.from({ length:26 }, () => { const x = R(688, 798), y = R(256, 334); return `<path d="M${f1(x)} ${f1(y)} l${f1(R(-2, 2))} ${f1(R(-1, 1))}"/>`; }).join('')}</g>
      <g><rect x="688" y="282" width="14" height="22" rx="2" fill="#3A2414" stroke="#6E4428" stroke-width="1.6"/><path d="M688 289 h14 M688 296 h14 M695 282 v22" stroke="#B0703C" stroke-width="1.2"/><path d="M686 305 h18" stroke="#C9955E" stroke-width="2.4" stroke-linecap="round"/><path d="M690 284 l4 4" stroke="#FFD88A" stroke-width=".8" opacity=".6"/></g>
      <path d="M703 ${VY} V294 C703 274 738 263 738 263 C738 263 773 274 773 294 V${VY}" fill="none" stroke="#B8875A" stroke-width="5"/>
      <path d="M703 ${VY} V294 C703 274 738 263 738 263 C738 263 773 274 773 294 V${VY}" fill="none" stroke="#1E9CB4" stroke-width="1.6" stroke-dasharray="3 3"/>
      <path d="M708 ${VY} V294 C708 278 738 270 738 270 C738 270 768 278 768 294 V${VY}Z" fill="url(#qaIwan)"/>
      <g clip-path="url(#qaIwanClip)">
        <path d="M728 286 C728 278 748 278 748 286 V304 H728Z" fill="#5A3420" opacity=".6"/><path d="M732 300 h12" stroke="#C88A5E" stroke-width="1.6"/><circle cx="735" cy="298" r="2" fill="#2EA6C8"/><circle cx="741" cy="298" r="1.6" fill="#E5392C"/>
        <path d="M708 ${VY - 2} H768" stroke="#8E2A3A" stroke-width="5"/><path d="M710 ${VY - 2} H766" stroke="#E8B04A" stroke-width="1.2" stroke-dasharray="3 2"/><path d="M710 ${VY - 4.4} H766" stroke="#1E4E9A" stroke-width=".8"/>
        <g id="qa-vento-dentro" style="opacity:0;transition:opacity .8s"><path class="qa-vento" d="M764 270 C756 274 744 272 736 276" stroke="url(#qaVento)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="8 8"/></g>
        <g id="qa-avo" transform="translate(724 ${VY - 3}) scale(1.5) translate(-724 ${-(VY - 3)})">${avo(724, VY - 3)}</g>
        <g id="qa-menina" transform="translate(754 ${VY - 3}) scale(1.5) translate(-754 ${-(VY - 3)})">${menina(754, VY - 3)}</g>
      </g>
      <path d="M708 294 C708 278 738 270 738 270 C738 270 768 278 768 294" stroke="#6E4428" stroke-width="1.4" fill="none"/>
      <g><path d="M776 ${VY} V306 C776 297 796 297 796 306 V${VY}Z" fill="url(#qaMadeira)" stroke="#4E2A10" stroke-width="1.6"/><path d="M781 300 V${VY} M786 298 V${VY} M791 300 V${VY}" stroke="#5E3414" stroke-width=".9" opacity=".7"/>
        <g fill="#E8C060" stroke="#7A5A10" stroke-width=".4">${[[779, 312], [793, 312], [779, 326], [793, 326], [786, 304]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g><circle cx="789" cy="320" r="2.2" fill="none" stroke="#E8C060" stroke-width="1"/><path d="M774 ${VY} h24" stroke="#9A6A3E" stroke-width="2.4"/></g>
      <g id="qa-gato" class="toque"><g id="qa-gato-in" style="transform-box:fill-box;transform-origin:50% 100%">${gato(784, VY - 1)}</g><rect x="770" y="${VY - 38}" width="34" height="40" fill="transparent"/></g>
      <g id="qa-poupa" class="toque"><g id="qa-poupa-in">${poupa(740, 248)}</g><rect x="722" y="226" width="30" height="26" fill="transparent"/></g>
    </g>
    <!-- vento entrando na torre -->
    <g id="qa-vento" style="opacity:0;transition:opacity .8s" pointer-events="none">
      <path class="qa-vento" d="M846 166 C826 170 812 174 794 176 M850 186 C830 188 812 190 794 190" stroke="url(#qaVento)" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="10 9"/>
      <path class="qa-vento" d="M769 178 V256" stroke="#BFEFFF" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="6 8" opacity=".9"/>
      <g id="qa-vento-baixo" style="opacity:0;transition:opacity .8s"><path d="M764 266 C754 272 738 268 730 273 C725 277 730 281 735 279 C739 277 736 274 732 275" stroke="#3E8AD0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".45"/><path class="qa-vento" d="M764 266 C754 272 738 268 730 273 C725 277 730 281 735 279 C739 277 736 274 732 275" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="9 6"/>
        <path d="M776 280 q6 -5 12 0 M694 276 q6 -6 12 -2" stroke="#E6F8FF" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    </g>
    <!-- Yuzi, o guepardo -->
    <g id="qa-yuzi" class="toque" data-fig="guepardo"><ellipse cx="104" cy="${f1(P(104) + 1)}" rx="30" ry="4" fill="#4A2A10" opacity=".3"/>${pedra(104, P(104) + 3, 34, 9)}<g id="qa-yuzi-in" style="transform-origin:100px ${f1(P(100))}px"><svg x="66" y="${f1(P(100) - 82)}" width="68" height="80" viewBox="0 0 110 130"><use href="#f-guepardo"/></svg></g>${brilhoHotspot(132, P(100) - 74)}</g>
    <!-- vista de cima: fila de crateras -->
    <g id="qa-vista" style="opacity:0;transition:opacity .8s" pointer-events="none"><g class="cresce">
      <circle cx="712" cy="96" r="58" fill="#fff" stroke="#8A5A32" stroke-width="3"/>
      <g clip-path="url(#qaVistaClip)">
        <rect x="650" y="36" width="130" height="120" fill="#EED0A0"/>
        <path d="M650 36 L700 36 C690 50 674 60 650 66Z" fill="#B07A5E"/><path d="M650 36 L676 36 C670 44 660 50 650 52Z" fill="#fff"/>
        ${[[684, 70], [696, 82], [708, 94], [720, 106], [732, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#C8925A" stroke="#8A5A32" stroke-width="1"/><circle cx="${x}" cy="${y}" r="2" fill="#3A2414"/>`).join('')}
        <path d="M676 62 L744 130" stroke="#3EA6F0" stroke-width="1.4" stroke-dasharray="3 3" opacity=".7"/>
        <path d="${copa(752, 138, 20, 14, 9, .3)}" fill="#6EB84A" stroke="#2E6A22" stroke-width="1"/><rect x="742" y="134" width="12" height="8" fill="#E2B47C" stroke="#8A5A32" stroke-width=".8"/>
      </g>
      <path d="M712 38 v6 M712 148 v6" stroke="#8A5A32" stroke-width="2"/>
    </g></g>
    <!-- noite (para fazer gelo) -->
    <g id="qa-noite" style="opacity:0;transition:opacity 1.2s" pointer-events="none"><rect width="800" height="500" fill="#14204A" opacity=".5"/><g fill="#FFF8D2">${Array.from({ length:26 }, () => `<circle cx="${f1(R(10, 790))}" cy="${f1(R(8, 200))}" r="${f1(R(.8, 1.8))}"/>`).join('')}</g><circle cx="680" cy="60" r="16" fill="#FFF6D8"/><circle cx="688" cy="54" r="14" fill="#2A3A6A" opacity=".9"/></g>
    <rect width="800" height="500" fill="url(#qaVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#qaGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* terra voando (partículas próprias desenhadas no canvas) */
  const terra = [];
  const jogaTerra = (x, y, n) => { for (let i = 0; i < n; i++) terra.push({ x:x + sorte(-4, 4), y, vx:sorte(-2.2, 2.2), vy:sorte(-4.6, -2), r:sorte(1.4, 3.2), cor:['#C8925A', '#E2B47E', '#9A6A3E'][i % 3], chao:y + sorte(2, 8) }); };
  c.desenho(ctx => {
    for (let i = terra.length - 1; i >= 0; i--) { const p = terra[i]; p.vy += .3; p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = 1; ctx.fillStyle = p.cor; ctx.strokeStyle = '#6E4428'; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.stroke();
      if (p.vy > 0 && p.y > p.chao) terra.splice(i, 1); }
  });
  const pocosR = [...s.querySelectorAll('.qa-poco')], montes = [...s.querySelectorAll('.qa-monte')], feixes = [...s.querySelectorAll('.qa-feixe')];
  const fundoPoco = i => i === 0 ? FUNDO_MAE : T(POCOS[i - 1]) - 14;
  const xPoco = i => i === 0 ? MAE : POCOS[i - 1];
  el(s, '#qa-roma').after(el(s, '#qa-comporta'));
  const fluxos = [...s.querySelectorAll('.qa-fluxo, .qa-fluxo2, .qa-vento, .qa-jato')];
  fluxos.forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:p.classList.contains('qa-vento') ? 700 : 1000, iterations:Infinity }));
  el(s, '#qa-aquifero-onda').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-34 }], { duration:3200, iterations:Infinity });
  const balde = el(s, '#qa-balde'), corda = el(s, '#qa-corda');
  const sobeBalde = prof => { const a = balde.animate([{ transform:`translateY(${prof}px)` }, { transform:'translateY(0)' }], { duration:900, easing:'ease-in-out' }); el(s, '#qa-manivela').animate([{ transform:'rotate(0)' }, { transform:'rotate(720deg)' }], { duration:900 }); el(s, '#qa-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(20deg)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(0)' }], { duration:900 }); return a; };
  /* 1. o poço-mãe: cavar no pé da montanha até achar a água */
  const pocoMae = el(s, '.qa-poco[data-i="0"]');
  const gMae = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gMae.innerHTML = marca(MAE, 0); const mMae = gMae.firstElementChild; el(s, '#qa-sarilho').after(mMae);
  s.querySelectorAll('.qa-marca').forEach(m => { if (+m.dataset.i > 0) m.style.display = 'none'; });
  const cavaPoco = (i, ate, dur, fim) => { const r = pocosR[i], y0 = P(xPoco(i)), h0 = +r.getAttribute('height');
    tween(dur, k => { r.setAttribute('height', f1(h0 + (ate - y0 - h0) * k)); if (Math.random() < .25) jogaTerra(xPoco(i), y0 - 2, 1); }, fim); jogaTerra(xPoco(i), y0 - 2, 8); };
  mMae.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'mae' || ocupado) return; ocupado = true; cavadas++;
    toca('clique'); el(s, '#qa-sarilho').style.opacity = 1; el(s, '#qa-sarilho').style.pointerEvents = '';
    const ate = P(MAE) + (FUNDO_MAE - P(MAE)) * cavadas / 3;
    montes[0].style.transform = `scale(${(.45 + cavadas * .18).toFixed(2)})`;
    depois(200, () => sobeBalde(Math.min(110, ate - P(MAE) - 14)));
    cavaPoco(0, ate, 900, () => { ocupado = false;
      if (cavadas === 1) api.diz('Cava, cava... aqui em cima a terra é bem seca.');
      if (cavadas === 2) api.diz('Mais fundo! A neve da montanha derrete e a água se esconde debaixo da terra.');
      if (cavadas === 3) { mMae.style.display = 'none'; montes[0].style.transform = 'scale(1)'; toca('splash');
        const ag = el(s, '#qa-mae-agua'), yA = W(MAE);
        tween(1400, k => { ag.setAttribute('y', f1(FUNDO_MAE - (FUNDO_MAE - yA) * k)); ag.setAttribute('height', f1((FUNDO_MAE - yA) * k)); });
        for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:MAE + sorte(-3, 3), y:yA + 2, t:k * 3, cor:'#E6F8FF' });
        c.brilhos(MAE, yA, 6, '#BFEAFF'); pocos = 1; api.hud('<span class="chip">Poços: 1/5</span>');
        api.diz('Achamos água! Este é o poço-mãe. Agora toque nas marcas para cavar uma fila de poços até a vila.');
        fase = 'pocos'; s.querySelectorAll('.qa-marca').forEach(m => { if (+m.dataset.i > 0) { m.style.display = ''; m.classList.add('cresce'); } }); }
    });
  });
  const FALAS_P = ['Cada poço dá ar fresco para quem cava lá embaixo.', 'O balde sobe cheio de terra, e a terra vira um montinho em volta da boca.', 'Os poços ficam cada vez mais rasos, porque o chão vai descendo até a vila.'];
  s.querySelectorAll('.qa-marca').forEach(m => { const i = +m.dataset.i; if (!i) return;
    m.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'pocos' || m.dataset.feito) return; m.dataset.feito = 1; m.style.display = 'none';
      toca('clique'); depois(150, () => toca('pop')); montes[i].style.transform = 'scale(1)';
      cavaPoco(i, fundoPoco(i), 1100, () => {
        pocos++; api.hud(`<span class="chip">Poços: ${pocos}/5</span>`); toca('ok');
        if (pocos < 5) api.diz(FALAS_P[Math.min(2, pocos - 2)]);
        else { fase = 'vista'; toca('vitoria'); el(s, '#qa-vista').style.opacity = 1;
          api.diz('Vistos lá do alto, os poços parecem uma fila de crateras no deserto!');
          depois(5600, comecaTunel); }
      });
    });
  });
  /* 2. o túnel: arrastar o lampião do poço-mãe até a vila, descendo bem devagar */
  const lamp = el(s, '#qa-lamp'), lampPos = el(s, '#qa-lamp-pos'), cavaR = el(s, '#qa-cava');
  const poeLamp = x => { lampPos.setAttribute('transform', `translate(${f1(x)} ${f1(T(x) - 8)})`); cavaR.setAttribute('width', f1(Math.max(0, x - 190 + 10))); };
  function comecaTunel(){
    fase = 'tunel'; el(s, '#qa-vista').style.opacity = 0; lamp.style.display = ''; el(s, '#qa-trilha').style.display = ''; poeLamp(cava);
    el(s, '#qa-trilha').animate([{ opacity:.35 }, { opacity:1 }, { opacity:.35 }], { duration:1600, iterations:Infinity });
    api.hud('<span class="chip">Túnel: 0/5</span>');
    api.diz('Agora arraste o lampião pela trilha, do poço-mãe até a vila. O túnel desce só um pouquinho!');
  }
  function avanca(x){
    if (x <= cava) return; cava = Math.min(XO + 8, x); poeLamp(cava);
    if (Math.random() < .3) jogaTerra(cava + 10, T(cava) - 6, 1);
    while (trecho < 5 && cava >= CHK[trecho]) {
      trecho++; api.hud(`<span class="chip">Túnel: ${trecho}/5</span>`);
      if (trecho < 5) { feixes[trecho].style.opacity = .65; feixes[0].style.opacity = .65; toca('ok'); c.brilhos(CHK[trecho - 1], T(CHK[trecho - 1]) - 20, 4, '#FFF2B0');
        if (trecho === 1) api.diz('Uma luz lá de cima! Pelos poços entram luz e ar fresco.');
        if (trecho === 3) api.diz('Os cavadores sabem fazer o túnel descer só um tiquinho, sem errar.'); }
      else { fase = 'agua'; toca('vitoria'); lamp.style.display = 'none'; el(s, '#qa-trilha').style.display = 'none'; correAgua(); }
    }
  }
  let pega = null, animL = false;
  lamp.addEventListener('pointerdown', e => { if (fase !== 'tunel' || animL) return; e.stopPropagation(); const p = c.ponto(e); pega = { x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); lamp.style.cursor = 'grabbing'; el(s, '#qa-lamp-dica').style.display = 'none'; toca('clique'); });
  s.addEventListener('pointermove', e => { if (!pega) return; const p = c.ponto(e);
    if (Math.hypot(p.x - pega.x0, p.y - pega.y0) > 8) pega.moveu = true; if (!pega.moveu || fase !== 'tunel') return;
    const dy = p.y - (T(Math.max(MAE, p.x)) - 8);
    if (Math.abs(dy) <= 34) { if (p.x > cava) avanca(Math.min(p.x, cava + 46)); }
    else if (p.x > cava - 30 && performance.now() - avisoT > 3200) { avisoT = performance.now(); toca('glub');
      api.diz(dy < 0 ? 'Ops, assim o túnel sobe! A água não corre para cima.' : 'Fundo demais! O túnel desce só um pouquinho.'); }
  });
  s.addEventListener('pointerup', () => { if (!pega) return; const m = pega.moveu; pega = null; lamp.style.cursor = 'grab';
    if (!m && fase === 'tunel') { const x0 = cava, x1 = CHK[trecho] + .5; animL = true;
      tween(900, k => avanca(x0 + (x1 - x0) * k), () => { animL = false; }); } });
  function correAgua(){
    const ar = el(s, '#qa-aguarect'); el(s, '#qa-gotas').style.opacity = 1;
    for (let i = 0; i < 8; i++) c.add({ tipo:'infiltra', x0:MAE - 40 + i * 10, y0:W(MAE - 40 + i * 10) + 20, x1:MAE + 20 + i * 5, y1:T(MAE + 20) - 4, dur:sorte(50, 80), f:sorte(0, 6) });
    toca('splash'); api.diz('O túnel chegou na vila! Olhe a água correndo sozinha, só com a força da gravidade.');
    tween(3000, k => { ar.setAttribute('width', f1((XO + 20 - 190) * k)); }, () => {
      el(s, '#qa-canal-agua').style.opacity = 1; el(s, '.qa-fluxo2').style.opacity = .9; toca('splash');
      for (let k = 0; k < 5; k++) c.add({ tipo:'respingo', x:XO + 8 + sorte(-4, 4), y:T(XO) - 2, t:k * 2, cor:'#E6F8FF' });
      c.brilhos(XO, T(XO) - 12, 6, '#BFEAFF'); aguaVila = true;
      depois(1200, () => api.diz('Debaixo da terra, o sol forte não esquenta a água, e ela quase não evapora.'));
      depois(6200, comecaVila);
    });
  }
  /* 3. a água na vila: jardim, casa do gelo e torre de vento */
  function comecaVila(){
    fase = 'vila'; s.querySelectorAll('.qa-dica3').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Vila: 0/3</span>');
    api.diz('A água chegou na vila! Toque no jardim, na casa do gelo e na torre de vento.');
  }
  const feitos = {};
  const marcaVila = (k, fala) => { if (feitos[k]) return false; feitos[k] = 1; vila++; api.hud(`<span class="chip">Vila: ${vila}/3</span>`); api.diz(fala);
    if (vila === 3) depois(5600, () => { fase = 'fim'; toca('vitoria'); c.brilhos(400, 250, 10, '#FFE27A');
      api.diz('O povo do Irã inventou o qanat há uns 3 mil anos, e muitos ainda funcionam hoje. Que ideia genial para cuidar de cada gota!'); depois(6800, api.fim); });
    return true; };
  function jardim(){
    if (!marcaVila('jardim', 'Um jardim persa! A água corre nos canais e enche o espelho-d\'água. As plantas fazem sombra no calor.')) return;
    el(s, '#qa-dica-jardim').style.display = 'none'; el(s, '#qa-tabua').style.transform = 'translateY(-14px)'; toca('clique');
    const ag = el(s, '#qa-tanque-agua');
    depois(500, () => { toca('splash'); tween(2200, k => ag.setAttribute('y', f1(364 - 24 * k)), () => { el(s, '#qa-fonte').style.opacity = 1; el(s, '#qa-tanque-brilho').setAttribute('opacity', '.8'); el(s, '#qa-tanque-brilho').setAttribute('transform', 'translate(0 -24)'); el(s, '#qa-reflexo').style.opacity = 1; }); });
    depois(1600, () => { s.querySelectorAll('.qa-jardim-cresce').forEach(g => g.style.transform = 'scale(1)'); el(s, '#qa-grama').style.opacity = .85; toca('planta');
      s.querySelectorAll('.qa-romas-novas > g').forEach(g => g.style.transform = 'scale(1)'); c.brilhos(650, 300, 8, '#FFE27A'); });
  }
  el(s, '#qa-comporta').addEventListener('click', e => { e.stopPropagation(); if (fase === 'vila') jardim(); else { toca('clique'); api.diz('Uma comporta de madeira. Ela abre e fecha o caminho da água.'); } });
  el(s, '#qa-tanque').addEventListener('click', e => { e.stopPropagation(); if (fase === 'vila' && !feitos.jardim) return jardim(); const p = c.ponto(e);
    if (feitos.jardim) { toca('glub'); ondinhas(Math.max(606, Math.min(668, p.x))); api.diz('Ploc! A água do qanat é fresquinha, porque veio debaixo da terra.'); }
    else { toca('clique'); api.diz('O tanque do jardim está vazio. Ele espera a água do qanat.'); } });
  el(s, '#qa-yakh').addEventListener('click', () => {
    if (fase !== 'vila' || feitos.yakh) { toca('clique'); if (!feitos.yakh) api.diz('Que cúpula alta! É o yakhchal, a casa do gelo. As paredes grossas de barro guardam o frio.'); else { c.add({ tipo:'floco', x:462 + sorte(-20, 20), y:200, vy:.8, f:0, r:2.4, chao:250 }); api.diz('Lá dentro o gelo dura até o verão!'); } return; }
    marcaVila('yakh', 'No inverno, a água congela à noite numa poça rasa. O gelo vai para o yakhchal e dura até o verão!');
    s.querySelectorAll('#qa-yakh .qa-dica3').forEach(h => h.style.display = 'none');
    el(s, '#qa-poca-agua').style.opacity = 1; toca('splash');
    depois(900, () => { el(s, '#qa-noite').style.opacity = 1; el(s, '#qa-sol').style.opacity = 0; toca('vapor'); for (let i = 0; i < 30; i++) c.add({ tipo:'floco', x:sorte(420, 580), y:150 - i * 3, vy:sorte(.6, 1), f:sorte(0, 6), r:sorte(1.4, 2.6), chao:sorte(240, 266) }); });
    depois(2600, () => { el(s, '#qa-poca-gelo').style.opacity = 1; toca('ok'); c.brilhos(536, 262, 5, '#FFFFFF'); });
    depois(4200, () => { el(s, '#qa-noite').style.opacity = 0; el(s, '#qa-sol').style.opacity = 1; el(s, '#qa-yakh-corte').style.opacity = 1; toca('pop'); c.brilhos(462, 244, 5, '#BFEAFF'); });
  });
  el(s, '#qa-badgir').addEventListener('click', e => { e.stopPropagation();
    if (fase !== 'vila' || feitos.badgir) { toca('clique'); if (!feitos.badgir) api.diz('Esta torre é um badgir, uma torre de vento. Ela pega a brisa lá no alto.'); return; }
    marcaVila('badgir', 'O badgir pega a brisa lá no alto e manda para dentro de casa. Que fresquinho!');
    s.querySelectorAll('#qa-badgir .qa-dica3').forEach(h => h.style.display = 'none');
    el(s, '#qa-vento').style.opacity = 1; [520, 640, 780].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .5, 'sine', .03, f * 1.3), i * 180));
    depois(900, () => { el(s, '#qa-vento-dentro').style.opacity = 1; el(s, '#qa-vento-baixo').style.opacity = 1; for (let i = 0; i < 6; i++) c.add({ tipo:'vapor', x0:769, y0:258, x1:722 + sorte(-6, 40), y1:274 + sorte(-4, 4), dur:sorte(50, 80), f:sorte(0, 6), r:sorte(2, 3.4), x:0, y:0 });
      el(s, '#qa-menina .qa-bracos').animate([{ transform:'rotate(0)' }, { transform:'scaleY(-1)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 });
      el(s, '#qa-avo .qa-lenco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-4deg)' }, { transform:'rotate(3deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:3 }); });
  });
  const ondinhas = x => { const g = el(s, '#qa-ondas');
    for (let k = 0; k < 3; k++) depois(k * 220, () => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      e.setAttribute('cx', x); e.setAttribute('cy', 341); e.setAttribute('rx', 2); e.setAttribute('ry', .8); e.setAttribute('fill', 'none'); e.setAttribute('stroke', '#F2FFFF'); e.setAttribute('stroke-width', 1.6); g.appendChild(e);
      tween(1100, q => { e.setAttribute('rx', f1(2 + 22 * q)); e.setAttribute('ry', f1(.8 + 2.6 * q)); e.setAttribute('opacity', f1(1 - q)); }, () => e.remove()); });
    for (let i = 0; i < 3; i++) c.add({ tipo:'bolha', x:x + sorte(-6, 6), y:356, vy:sorte(.3, .6), r:sorte(1.2, 2.2), topo:342, f:sorte(0, 6) }); };
  /* toques extras */
  let gatoOcupado = false;
  el(s, '#qa-gato').addEventListener('click', e => { e.stopPropagation(); if (gatoOcupado) return; gatoOcupado = true;
    [660, 880, 620].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .22, 'sine', .04, f * 1.25), i * 140));
    el(s, '#qa-gato-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.08,.9)' }, { transform:'scale(.96,1.08)' }, { transform:'scale(1)' }], { duration:700 });
    el(s, '#qa-gato .qa-gato-cauda').animate([{ transform:'rotate(0)' }, { transform:'rotate(-14deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 });
    api.diz('Miau! O gato-persa tem esse nome por causa da Pérsia, o nome antigo do Irã.'); depois(1400, () => { gatoOcupado = false; }); });
  let cabraOcupada = false;
  el(s, '#qa-rebanho').addEventListener('click', e => { e.stopPropagation(); if (cabraOcupada) return; cabraOcupada = true;
    s.querySelectorAll('.qa-cabra').forEach((g, i) => { depois(i * 220, () => { g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-9px)' }, { transform:'translateY(0)' }], { duration:420, easing:'ease-out' }); somOn && tom(420 - i * 40, 0, .28, 'triangle', .035, 380 - i * 40); }); });
    api.diz('Méé! Um pastor com suas cabras. Os bichos também bebem a água que vem do qanat.'); depois(1400, () => { cabraOcupada = false; }); });
  el(s, '#qa-yuzi').addEventListener('click', () => { [180, 150, 180, 150].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .18, 'triangle', .04, f * .9), i * 120));
    el(s, '#qa-yuzi-in').animate([{ transform:'translateY(0) scale(1)' }, { transform:'translateY(-10px) scale(1.04,.96)' }, { transform:'translateY(0) scale(1)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }], { duration:800 });
    api.diz(fase === 'mae' ? 'Prrr! Toque na marca vermelha, ao pé da montanha, para cavar.' : fase === 'pocos' ? 'Prrr! Toque nas marcas vermelhas para cavar os poços.' : fase === 'tunel' ? 'Prrr! Arraste o lampião pela trilha de pontinhos.' : 'Prrr! Eu sou um guepardo-asiático. Hoje só existimos aqui no Irã.'); });
  el(s, '#qa-onagro').addEventListener('click', () => { [620, 300, 600, 290].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .22, 'sawtooth', .03, f * .85), i * 200));
    el(s, '#qa-onagro-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-3deg)' }, { transform:'rotate(2deg)' }, { transform:'rotate(0)' }], { duration:800 });
    api.diz('Um onagro-persa, um asno selvagem! Ele aguenta o calor e anda longe atrás de água.'); });
  let romaOcupada = false;
  el(s, '#qa-roma').addEventListener('click', () => { if (romaOcupada) return; romaOcupada = true; toca('pop');
    const f = el(s, '#qa-roma-cai circle'); f.style.opacity = 1;
    const a = f.animate([{ transform:'translateY(0)' }, { transform:`translateY(${f1(P(586) - 292)}px)` }], { duration:600, easing:'cubic-bezier(.5,0,1,1)', fill:'forwards' });
    a.onfinish = () => { f.style.opacity = 0; a.cancel(); toca('splash');
      for (let i = 0; i < 12; i++) c.add({ tipo:'petala', x:586 + sorte(-8, 8), y:P(586) - 10 - i * 2, vy:sorte(.4, .9), f:sorte(0, 6), chao:P(586) + 2, cor:['#E0203E', '#FF5A6A', '#B0102A'][i % 3], borda:'#6E0A1A' });
      depois(1600, () => { romaOcupada = false; }); };
    api.diz('Uma romã! Por dentro ela tem centenas de sementinhas vermelhas e docinhas.'); });
  let jerOcupado = false;
  el(s, '#qa-toca').addEventListener('click', e => { e.stopPropagation(); if (jerOcupado) return; jerOcupado = true; toca('pop');
    el(s, '#qa-jerboa-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(-4px,-14px)' }, { transform:'translate(0,0)' }, { transform:'translate(-3px,-10px)' }, { transform:'translate(0,0)' }], { duration:1000 });
    api.diz('Um jerboa! Ele pula como um cangurinho e passa o calor do dia dentro da toca.'); depois(1200, () => { jerOcupado = false; }); });
  el(s, '#qa-poupa').addEventListener('click', e => { e.stopPropagation(); const cr = el(s, '#qa-poupa .qa-crista');
    [440, 440, 440].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .14, 'sine', .05, f * .8), i * 220));
    cr.style.transform = 'scale(1.35) rotate(-8deg)'; depois(900, () => { cr.style.transform = ''; });
    api.diz('Pu-pu-pu! É a poupa. Ela abre a crista como um leque.'); });
  el(s, '#qa-pico').addEventListener('click', () => { toca('chuva');
    for (let i = 0; i < 26; i++) c.add({ tipo:'floco', x:sorte(70, 240), y:30 - i * 3, vy:sorte(.8, 1.3), f:sorte(0, 6), r:sorte(1.6, 3), chao:sorte(70, 120) });
    for (let i = 0; i < 6; i++) c.add({ tipo:'infiltra', x0:sorte(40, 180), y0:P(110) + 6, x1:sorte(30, 190), y1:sorte(W(100) + 10, 360), dur:sorte(70, 110), f:sorte(0, 6) });
    api.diz('A neve da montanha derrete devagar, e a água entra na terra. Lá embaixo ela fica guardada entre as pedrinhas.'); });
  el(s, '#qa-sarilho').addEventListener('click', e => { e.stopPropagation(); if (ocupado) return; toca('clique'); sobeBalde(40);
    api.diz('Este é o muqanni, o cavador de qanats. É um trabalho de muita coragem e cuidado!'); });
  api.hud('<span class="chip">Poços: 0/5</span>');
  api.diz('Oi, eu sou o Yuzi, um guepardo-asiático! Aqui no Irã quase não chove. Toque na marca vermelha para cavar e achar água.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
