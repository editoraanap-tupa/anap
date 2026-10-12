/* ================= JOGO 15: Chinampas de Xochimilco, jardins no lago ================= */
function jogoChinampa(palco, api){
  semente = 197;
  const AG = 300, FUN = 470, FL = 262, FR = 530, TF = 268, TB = 238, BL = 290, BR = 502, FB = 270;
  const CAM = [{ tipo:'junco', y0:420, y1:476 }, { tipo:'lama', y0:370, y1:420 }, { tipo:'junco', y0:320, y1:370 }, { tipo:'lama', y0:TF, y1:320 }];
  const ESTACAS = [{ x:268, y:AG, f:1 }, { x:396, y:AG, f:1 }, { x:524, y:AG, f:1 }, { x:BL, y:FB, f:0 }, { x:BR, y:FB, f:0 }];
  const CANTOS = [{ x:282, y:TF - 2 }, { x:512, y:TF - 2 }];
  const PLANTAS = { milho:[{ x:338, y:252 }, { x:438, y:250 }], feijao:[{ x:338, y:252 }, { x:438, y:250 }], abobora:[{ x:384, y:262 }, { x:476, y:262 }] };
  const LIXO = [{ id:'garrafa', x:604, y:326 }, { id:'sacola', x:704, y:368 }, { id:'lata', x:766, y:452 }, { id:'copo', x:584, y:438 }];
  const FILTROS = [{ x:552, y:AG }, { x:786, y:AG }];
  const CESTO = { x:686, y:266 };
  let vivo = true, fase = 'estacas', estacas = 0, camadas = 0, arvores = 0, sementes = 0, aguas = 0, lixos = 0, filtros = 0, ocupado = false, molhado = 0, cresc = .22, arvK = .4;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const F = n => n.toFixed(1);
  /* ---------- desenhos ---------- */
  const ahuejote = (x, y, h, w, c0, c1, esc) => {
    let folhas = '';
    for (let i = 0; i < Math.round(h / 7); i++) { const yy = y - h * .22 - R(0, h * .74), lim = w * .5 * Math.sin(Math.PI * Math.min(1, (y - yy) / h)) , xx = x + R(-lim, lim); folhas += `M${F(xx)} ${F(yy)} q${F(R(-2, 2))} ${F(R(3, 5))} ${F(R(-3, 3))} ${F(R(7, 10))} `; }
    const tronco = `M${x} ${y} C${x - 1} ${y - h * .2} ${x + 2} ${y - h * .45} ${x} ${y - h * .7}`;
    const ramos = `M${x} ${y - h * .3} q${F(-w * .25)} ${F(-h * .1)} ${F(-w * .32)} ${F(-h * .22)} M${x} ${y - h * .42} q${F(w * .2)} ${F(-h * .1)} ${F(w * .3)} ${F(-h * .24)}`;
    const copaD = `M${x} ${F(y - h * .16)} C${F(x - w * .62)} ${F(y - h * .3)} ${F(x - w * .56)} ${F(y - h * .78)} ${F(x - w * .12)} ${F(y - h * .98)} Q${x} ${F(y - h * 1.04)} ${F(x + w * .12)} ${F(y - h * .98)} C${F(x + w * .56)} ${F(y - h * .78)} ${F(x + w * .62)} ${F(y - h * .3)} ${x} ${F(y - h * .16)}Z`;
    return `<path d="${copaD}" fill="url(#${c0})" stroke="${esc}" stroke-width="1.6"/>
      <path d="${tronco}" stroke="#4A3626" stroke-width="${F(Math.max(2, w * .1))}" fill="none" stroke-linecap="round"/><path d="${ramos}" stroke="#4A3626" stroke-width="${F(Math.max(1.4, w * .05))}" fill="none" stroke-linecap="round"/>
      <path d="${folhas}" stroke="${c1}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M${F(x - w * .26)} ${F(y - h * .38)} C${F(x - w * .34)} ${F(y - h * .6)} ${F(x - w * .24)} ${F(y - h * .82)} ${F(x - w * .06)} ${F(y - h * .94)}" stroke="#E6F4DA" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>`;
  };
  const estaca = (x, y0, y1, w) => `<path d="M${F(x - w / 2)} ${y0} V${y1 - w} L${x} ${y1} L${F(x + w / 2)} ${y1 - w} V${y0}Z" fill="url(#chMadeira)" stroke="#3A2414" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y0}" rx="${F(w / 2)}" ry="${F(w / 5)}" fill="#D8B48A" stroke="#3A2414" stroke-width="1.1"/><path d="M${F(x - w / 4)} ${y0 + 4} V${y1 - w - 4}" stroke="#E8C8A0" stroke-width="1.2" opacity=".55"/><path d="M${F(x + w / 6)} ${y0 + 14} l2 6 M${F(x - w / 6)} ${y0 + 40} l-1.6 6" stroke="#5E3E26" stroke-width=".9" opacity=".7"/>`;
  const camada = (k) => {
    const c = CAM[k], x0 = FL + 3, x1 = FR - 3, h = c.y1 - c.y0;
    let det = '';
    if (c.tipo === 'junco') {
      for (let i = 0; i < Math.round(h / 4.4); i++) { const yy = c.y0 + 3 + i * 4.4; det += `M${x0} ${F(yy)} ` + Array.from({ length:8 }, () => `q${F(R(14, 20))} ${F(R(-2, 2))} ${F(R(30, 36))} ${F(R(-1.4, 1.4))}`).join(' ') + ' '; }
      return `<rect x="${x0}" y="${c.y0}" width="${x1 - x0}" height="${h}" fill="url(#chJunco)"/><rect x="${x0}" y="${c.y0}" width="${x1 - x0}" height="${h}" fill="url(#chTrama)"/><g stroke="#5E6E1E" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".5">${Array.from({ length:6 }, () => { const xx = R(x0 + 20, x1 - 20), yy = R(c.y0 + 8, c.y1 - 8); return `<path d="M${F(xx)} ${F(yy - 6)} q3 6 0 12"/>`; }).join('')}</g><path d="${det}" stroke="#6E8A2E" stroke-width="1.6" fill="none" opacity=".75"/><g stroke="#F2F4B0" stroke-width="1" opacity=".7" fill="none">${Array.from({ length:16 }, () => { const xx = R(x0 + 6, x1 - 30), yy = R(c.y0 + 4, c.y1 - 4); return `<path d="M${F(xx)} ${F(yy)} h${F(R(10, 26))}"/>`; }).join('')}</g><g fill="#8A9A3A">${Array.from({ length:14 }, () => `<rect x="${F(R(x0 + 4, x1 - 8))}" y="${F(R(c.y0 + 2, c.y1 - 6))}" width="1.6" height="4" rx=".8"/>`).join('')}</g><path d="M${x0} ${c.y0 + 1} H${x1}" stroke="#E8EE9A" stroke-width="1.6" opacity=".8"/>`;
    }
    return `<rect x="${x0}" y="${c.y0}" width="${x1 - x0}" height="${h}" fill="url(#chLama)"/>${Array.from({ length:7 }, () => `<ellipse cx="${F(R(x0 + 20, x1 - 20))}" cy="${F(R(c.y0 + 10, c.y1 - 10))}" rx="${F(R(26, 50))}" ry="${F(R(9, 16))}" fill="url(#chLamaB)"/>`).join('')}<g fill="#fff" opacity=".22">${Array.from({ length:14 }, () => { const xx = R(x0 + 6, x1 - 30), yy = R(c.y0 + 5, c.y1 - 5); return `<path d="M${F(xx)} ${F(yy)} q${F(R(6, 12))} -2.4 ${F(R(14, 24))} 0 q-${F(R(6, 10))} 1.2 -${F(R(14, 24))} 0Z"/>`; }).join('')}</g><g>${Array.from({ length:6 }, () => { const xx = R(x0 + 8, x1 - 8), yy = R(c.y0 + 6, c.y1 - 6); return `<ellipse cx="${F(xx)}" cy="${F(yy)}" rx="2.6" ry="1.6" fill="#3E6A7A" opacity=".6"/><circle cx="${F(xx - .8)}" cy="${F(yy - .6)}" r=".7" fill="#E6FFFF"/>`; }).join('')}</g><path d="${Array.from({ length:4 }, () => { const xx = R(x0 + 10, x1 - 40), yy = R(c.y0 + 6, c.y1 - 6); return `M${F(xx)} ${F(yy)} c4 3 8 -2 12 1 s8 3 12 -1`; }).join(' ')}" stroke="#C8A27A" stroke-width=".9" fill="none" opacity=".55"/><g fill="#8E6A4A" opacity=".75">${Array.from({ length:34 }, () => `<ellipse cx="${F(R(x0 + 3, x1 - 3))}" cy="${F(R(c.y0 + 3, c.y1 - 3))}" rx="${F(R(1.2, 3.4))}" ry="${F(R(.8, 2))}"/>`).join('')}</g><g fill="#2A1A0E" opacity=".55">${Array.from({ length:22 }, () => `<circle cx="${F(R(x0 + 3, x1 - 3))}" cy="${F(R(c.y0 + 3, c.y1 - 3))}" r="${F(R(.8, 1.8))}"/>`).join('')}</g><path d="${Array.from({ length:5 }, () => { const xx = R(x0 + 10, x1 - 40), yy = R(c.y0 + 6, c.y1 - 6); return `M${F(xx)} ${F(yy)} q6 -3 12 -1 t12 1`; }).join(' ')}" stroke="#A88A5A" stroke-width="1.1" fill="none" opacity=".6"/><path d="M${x0} ${c.y0 + 1} H${x1}" stroke="#9A7A5A" stroke-width="1.6" opacity=".8"/>`;
  };
  /* plantas da milpa: desenhadas na base (0,0), crescem por escala */
  const milho = () => `<g><path d="M0 0 C-1 -30 1 -70 0 -112" stroke="#3E6A1E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 0 C-1 -30 1 -70 0 -112" stroke="#8CC84A" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${[[-18, 1, 34], [-36, -1, 38], [-54, 1, 36], [-72, -1, 32], [-90, 1, 26]].map(([y, l, L]) => `<path d="M0 ${y} C${l * 10} ${y - 12} ${l * L * .8} ${y - 8} ${l * L} ${y + 6} C${l * L * .7} ${y - 2} ${l * 10} ${y - 6} 0 ${y - 4}Z" fill="url(#chFolhaM)" stroke="#2E5A1A" stroke-width="1.1" stroke-linejoin="round"/>`).join('')}
    <path d="M0 -112 l-6 -14 M0 -112 l1 -18 M0 -112 l7 -13 M0 -110 l-10 -8 M0 -110 l10 -6" stroke="#C8A44A" stroke-width="2" stroke-linecap="round"/><path d="M0 -112 l-6 -14 M0 -112 l1 -18 M0 -112 l7 -13" stroke="#F2DA8A" stroke-width=".9" stroke-linecap="round"/>
    <g class="ch-fruto" style="opacity:0;transition:opacity 1s"><g transform="translate(3 -58) rotate(24)"><path d="M0 0 C-6 -6 -6 -22 0 -28 C6 -22 6 -6 0 0Z" fill="#7AA03A" stroke="#3E5A1A" stroke-width="1"/><path d="M0 -4 C-4 -9 -4 -20 0 -25 C4 -20 4 -9 0 -4Z" fill="url(#chEspiga)" stroke="#8A3A5A" stroke-width=".8"/><g fill="#fff" opacity=".6"><circle cx="-1.2" cy="-18" r=".9"/><circle cx="-1.2" cy="-12" r=".9"/></g><path d="M0 -28 q-2 -6 2 -9 M0 -28 q3 -5 6 -6" stroke="#D8A04A" stroke-width="1" fill="none"/></g>
      <g transform="translate(-3 -40) rotate(-26)"><path d="M0 0 C-5 -5 -5 -18 0 -23 C5 -18 5 -5 0 0Z" fill="#7AA03A" stroke="#3E5A1A" stroke-width="1"/><path d="M0 -3 C-3.4 -8 -3.4 -16 0 -20 C3.4 -16 3.4 -8 0 -3Z" fill="url(#chEspiga2)" stroke="#A8701A" stroke-width=".8"/></g></g></g>`;
  const feijao = () => `<g><path d="M2 0 C-8 -10 8 -20 -4 -30 C-12 -38 8 -46 -2 -56 C-10 -64 8 -72 0 -82 C-6 -90 4 -96 2 -102" stroke="#2E5A1A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M2 0 C-8 -10 8 -20 -4 -30 C-12 -38 8 -46 -2 -56 C-10 -64 8 -72 0 -82 C-6 -90 4 -96 2 -102" stroke="#6EAA3A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    ${[[-6, -12, -1], [6, -24, 1], [-9, -38, -1], [7, -50, 1], [-7, -64, -1], [6, -78, 1], [-3, -92, -1]].map(([x, y, l]) => `<path d="M${x} ${y} c${l * 4} -6 ${l * 12} -6 ${l * 13} 1 c${-l * 2} 6 ${-l * 9} 6 ${-l * 13} -1Z" fill="url(#chFolhaF)" stroke="#24561E" stroke-width=".9"/>`).join('')}
    <g class="ch-fruto" style="opacity:0;transition:opacity 1s">${[[8, -30], [-10, -46], [8, -62], [-6, -86]].map(([x, y]) => `<path d="M${x} ${y} c2 6 1 14 -2 18" stroke="#3E6A1E" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} c2 6 1 14 -2 18" stroke="#9AD05A" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}<g fill="#FFFFFF" stroke="#B060A8" stroke-width=".6">${[[-6, -20], [10, -56], [-4, -76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g></g></g>`;
  const abobora = () => `<g><path d="M-30 -2 C-20 -8 20 -8 34 -2" stroke="#3E6A1E" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${[[-26, -10, 13], [-6, -16, 16], [16, -12, 14], [32, -6, 10]].map(([x, y, r]) => `<path d="M${x} ${y + r * .7} C${x - r * 1.1} ${y + r * .2} ${x - r} ${y - r * .9} ${x - r * .2} ${y - r * .8} Q${x} ${y - r * 1.2} ${x + r * .2} ${y - r * .8} C${x + r} ${y - r * .9} ${x + r * 1.1} ${y + r * .2} ${x} ${y + r * .7}Z" fill="url(#chFolhaA)" stroke="#1E4A22" stroke-width="1.2"/><path d="M${x} ${y + r * .6} V${y - r * .6} M${x} ${y} l${-r * .5} ${-r * .4} M${x} ${y} l${r * .5} ${-r * .4}" stroke="#9AD08A" stroke-width=".9" fill="none" opacity=".8"/>`).join('')}
    <g class="ch-fruto" style="opacity:0;transition:opacity 1s"><g transform="translate(-14 -6)"><path d="M-11 0 C-13 -12 13 -12 11 0 C10 6 -10 6 -11 0Z" fill="url(#chAbob)" stroke="#9A4A0A" stroke-width="1.2"/><path d="M-4 -8 C-6 -2 -5 3 -3 5 M4 -8 C6 -2 5 3 3 5" stroke="#C86A1A" stroke-width="1" fill="none"/><path d="M0 -9 l2 -5" stroke="#4E6A1E" stroke-width="2.4" stroke-linecap="round"/><path d="M-7 -5 q3 -3 6 -3" stroke="#FFE0A8" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
      ${[[10, -22], [30, -14]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 1, 2, 3, 4].map(k => `<ellipse cx="${F(Math.cos(k * 1.256) * 3.6)}" cy="${F(Math.sin(k * 1.256) * 3.6)}" rx="3.4" ry="2.4" transform="rotate(${F(k * 72)} ${F(Math.cos(k * 1.256) * 3.6)} ${F(Math.sin(k * 1.256) * 3.6)})" fill="#FFC83D" stroke="#B07A08" stroke-width=".6"/>`).join('')}<circle r="2" fill="#F08A1E"/></g>`).join('')}</g></g>`;
  /* axolote da cena (cabeça para a esquerda), origem no centro da cabeça */
  const guelra = (p0, p1, p2, cor, esc) => {
    const bq = t => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
    let fr = ''; for (let i = 1; i < 9; i++) { const t = .18 + i * .1; if (t > 1) break; const [x, y] = bq(t), [x2, y2] = bq(Math.min(1, t + .02)), L = Math.hypot(x2 - x, y2 - y) || 1, dx = (x2 - x) / L, dy = (y2 - y) / L, nx = -dy, ny = dx, f = 3.6 - t * 1.6; fr += `M${F(x)} ${F(y)} l${F(nx * f + dx * 2)} ${F(ny * f + dy * 2)} M${F(x)} ${F(y)} l${F(-nx * f + dx * 2)} ${F(-ny * f + dy * 2)} `; }
    const d = `M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
    return `<path d="${fr}" stroke="${esc}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${esc}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${fr}" stroke="${cor}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  };
  const axo = (corpo, cab, esc, gc, ge, pinta) => `<g transform="translate(-44 -48)">
    <path d="M86 60 C98 52 110 44 124 40 C124 52 116 64 100 72 C94 75 88 72 86 68Z" fill="url(#${corpo})" stroke="${esc}" stroke-width="1.6" stroke-linejoin="round" opacity=".95"/>
    <path d="M84 74 C86 80 84 84 80 86 M90 72 C94 78 96 82 94 86 M40 76 C38 82 34 86 30 88 M54 78 C54 84 56 88 60 90" stroke="${esc}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M84 74 C86 80 84 84 80 86 M90 72 C94 78 96 82 94 86 M40 76 C38 82 34 86 30 88 M54 78 C54 84 56 88 60 90" stroke="${pinta}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M34 64 C38 52 58 50 76 54 C92 57 100 62 96 72 C92 80 74 82 58 80 C44 79 32 74 34 64Z" fill="url(#${corpo})" stroke="${esc}" stroke-width="1.8"/>
    <path d="M56 56 C66 54 78 56 88 60" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
    <g class="ch-guelras">${[[[24, 40], [14, 30], [12, 16]], [[22, 46], [10, 42], [8, 34]], [[24, 52], [12, 56], [9, 53]], [[62, 38], [70, 26], [80, 16]], [[64, 44], [78, 38], [88, 32]], [[64, 50], [78, 52], [88, 50]]].map(g => guelra(...g, gc, ge)).join('')}</g>
    <ellipse cx="44" cy="48" rx="24" ry="19" fill="url(#${cab})" stroke="${esc}" stroke-width="2"/>
    <path d="M28 38 C34 31 46 29 56 32" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="34" cy="46" rx="3.4" ry="3.8" fill="#1A0E14"/><circle cx="35.2" cy="44.6" r="1.3" fill="#fff"/><ellipse cx="54" cy="46" rx="3.4" ry="3.8" fill="#1A0E14"/><circle cx="55.2" cy="44.6" r="1.3" fill="#fff"/>
    <path class="ch-boca" d="M30 54 C36 61 52 61 58 54" stroke="#5E1E34" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="27" cy="53" rx="4" ry="2.2" fill="#FF7A9E" opacity=".45"/><ellipse cx="61" cy="53" rx="4" ry="2.2" fill="#FF7A9E" opacity=".45"/></g>`;
  /* pessoas */
  const agricultora = (x, y) => `<g transform="translate(${x} ${y}) scale(1.38)">
    <ellipse cx="0" cy="1" rx="15" ry="2.6" fill="#2A1A0A" opacity=".25"/>
    <path d="M-6 0 v-14 M5 0 v-14" stroke="#9A6440" stroke-width="4.4" stroke-linecap="round"/><path d="M-10 0 h7 M2 0 h8" stroke="#5E3A22" stroke-width="3.6" stroke-linecap="round"/><path d="M-9 -.6 h5 M3 -.6 h5" stroke="#8A5A3A" stroke-width="1" stroke-linecap="round"/>
    <path d="M-14 -12 C-15 -26 -11 -36 0 -37 C11 -36 15 -26 14 -12 C8 -10 -8 -10 -14 -12Z" fill="url(#chSaia)" stroke="#14244A" stroke-width="1.4"/>
    <path d="M-13.6 -15 C-8 -13 8 -13 13.6 -15" stroke="#FFC83D" stroke-width="1.6" fill="none"/><path d="M-13.4 -18 C-8 -16 8 -16 13.4 -18" stroke="#E0458A" stroke-width="1.2" fill="none" stroke-dasharray="2 1.6"/>
    <path d="M-6 -36 C-7 -26 -6 -18 -4 -12 M5 -36 C6 -26 5 -18 3 -12" stroke="#3A5AA0" stroke-width="1" fill="none" opacity=".7"/>
    <path d="M-12 -36 C-13 -46 -8 -53 0 -53 C8 -53 13 -46 12 -36 L13 -27 C6 -25 -6 -25 -13 -27Z" fill="url(#chBlusa)" stroke="#0E5A5A" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M-7 -52 C-5 -46 5 -46 7 -52" fill="#FFF6E6" stroke="#0E5A5A" stroke-width=".9"/>
    <g stroke-width=".6">${[[-5, -47, '#E0458A'], [0, -45.4, '#FFC83D'], [5, -47, '#E0458A'], [-8.6, -43, '#FF8A3A'], [8.6, -43, '#FF8A3A']].map(([fx, fy, fc]) => `<g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${F(fx + Math.cos(k * 1.256) * 1.3)}" cy="${F(fy + Math.sin(k * 1.256) * 1.3)}" r="1" fill="${fc}" stroke="#7A1E3A"/>`).join('')}<circle cx="${fx}" cy="${fy}" r=".6" fill="#fff"/></g>`).join('')}</g>
    <path d="M-10 -40 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6" stroke="#FFF2B0" stroke-width=".9" fill="none"/>
    <path d="M-5 -46 q-1 -3 1 -4 M5 -46 q1 -3 -1 -4" stroke="#3FA864" stroke-width=".9" fill="none"/>
    <path d="M-12 -30 C-6 -28 6 -28 12 -30" stroke="#0E5A5A" stroke-width=".8" fill="none" opacity=".6"/>
    <path d="M-11 -48 C-17 -42 -18 -34 -16 -28" stroke="#0E5A5A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-11 -48 C-17 -42 -18 -34 -16 -28" stroke="#3EC2B8" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-17.4 -32 h3.4" stroke="#E0458A" stroke-width="1.4"/>
    <circle cx="-16" cy="-26.6" r="2.8" fill="#A86A44" stroke="#4E2A14" stroke-width=".9"/>
    <g id="ch-braco-ag" style="transform-origin:11px -48px"><path d="M11 -48 C17 -54 20 -60 21 -66" stroke="#0E5A5A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M11 -48 C17 -54 20 -60 21 -66" stroke="#3EC2B8" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 -58.6 l3.2 1.4" stroke="#E0458A" stroke-width="1.4"/><circle cx="21.4" cy="-68" r="3" fill="#A86A44" stroke="#4E2A14" stroke-width=".9"/><path d="M20 -70.6 l-.6 -2 M22 -70.8 l.2 -2.2" stroke="#4E2A14" stroke-width=".8" stroke-linecap="round"/></g>
    <path d="M-3.4 -52 v-4 h6.8 v4Z" fill="#9A6440"/>
    <path d="M-2 -60 C-13 -60 -13 -77 0 -77 C13 -77 13 -60 2 -60Z" fill="#2A1A14"/>
    <path d="M-8.4 -64 C-11 -56 -9 -50 -6.6 -43" stroke="#2A1A14" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-9.6 -58 l2.4 .6 M-8.8 -53 l2.4 .6 M-7.8 -48 l2.4 .6" stroke="#5A3A2A" stroke-width=".8"/><circle cx="-6.6" cy="-43" r="1.7" fill="#E0458A" stroke="#8A1A4A" stroke-width=".5"/>
    <ellipse cx="0" cy="-65" rx="8.2" ry="9.2" fill="url(#chPele1)" stroke="#4E2A14" stroke-width="1.3"/>
    <circle cx="-8" cy="-62.6" r="1.1" fill="#FFC83D" stroke="#A86A08" stroke-width=".4"/><circle cx="8" cy="-62.6" r="1.1" fill="#FFC83D" stroke="#A86A08" stroke-width=".4"/>
    <path d="M-5.6 -68.6 q2 -1.2 4 -.2 M1.8 -68.8 q2 -1 4 .2" stroke="#2A1A14" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <ellipse cx="-3.4" cy="-65.4" rx="1.3" ry="1.6" fill="#1A0E0A"/><ellipse cx="3.6" cy="-65.4" rx="1.3" ry="1.6" fill="#1A0E0A"/><circle cx="-3" cy="-66" r=".5" fill="#fff"/><circle cx="4" cy="-66" r=".5" fill="#fff"/>
    <path d="M0 -64.2 q.8 1.6 -.2 2.4" stroke="#7A3E20" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-3 -60.4 C-1.6 -58.4 1.8 -58.4 3.2 -60.4" fill="#fff" stroke="#6E2E14" stroke-width=".9" stroke-linecap="round"/>
    <ellipse cx="-5.4" cy="-61.8" rx="1.9" ry="1.1" fill="#E07A5A" opacity=".55"/><ellipse cx="5.6" cy="-61.8" rx="1.9" ry="1.1" fill="#E07A5A" opacity=".55"/>
    <path d="M-21 -71 C-13 -75 13 -75 21 -71 C15 -67.6 -15 -67.6 -21 -71Z" fill="url(#chPalha)" stroke="#8A6A2A" stroke-width="1.1"/>
    <path d="M-8.4 -72.4 C-8.4 -83 8.4 -83 8.4 -72.4Z" fill="url(#chPalha)" stroke="#8A6A2A" stroke-width="1.1"/>
    <g stroke="#B08A3A" stroke-width=".5" opacity=".8" fill="none"><path d="M-17 -72.6 l3 2 M-13 -73.4 l3 2.4 M-9 -73.8 l2 2.6 M9 -73.8 l-2 2.6 M13 -73.4 l-3 2.4 M17 -72.6 l-3 2 M-15 -70 l3 -2 M15 -70 l-3 -2"/><path d="M-6 -76 h12 M-7 -78.4 h14 M-5 -80.6 h10"/></g>
    <path d="M-8.4 -74.4 h16.8" stroke="#E0458A" stroke-width="1.8"/><path d="M-8.4 -74.4 h16.8" stroke="#FFC83D" stroke-width=".6" stroke-dasharray="1.4 1.4"/>
    <path d="M-5 -80 q3 -2 7 -1.4" stroke="#FFF2C0" stroke-width="1" fill="none" stroke-linecap="round"/>
    <rect x="-24" y="-84" width="50" height="86" fill="transparent"/></g>`;
  const barqueiro = (x, y) => `<g transform="translate(${x} ${y}) scale(1.36)">
    <path d="M-5 0 v-16 M5 0 v-16" stroke="#3A3A48" stroke-width="5" stroke-linecap="round"/><path d="M-5 -6 v-9" stroke="#5A5A6A" stroke-width="1" opacity=".6"/><path d="M-8 0 h5 M3 0 h6" stroke="#2A1E14" stroke-width="3" stroke-linecap="round"/>
    <path d="M-11 -14 C-12 -32 -8 -40 0 -41 C8 -40 12 -32 11 -14Z" fill="url(#chCamisa)" stroke="#7A2A10" stroke-width="1.4"/>
    <path d="M0 -40 V-15" stroke="#A8380E" stroke-width=".9"/><g fill="#FFF2E0">${[-36, -30, -24, -18].map(cy => `<circle cx="1.6" cy="${cy}" r=".7"/>`).join('')}</g>
    <path d="M3.6 -33 h5 v4.4 h-5Z" fill="none" stroke="#A8380E" stroke-width=".8"/>
    <path d="M-3.6 -41 L0 -37 L3.6 -41" fill="#FFF2E0" stroke="#A8380E" stroke-width=".8"/>
    <path d="M-11 -20 C-6 -18 6 -18 11 -20" stroke="#5A3A22" stroke-width="2" fill="none"/>
    <path d="M9 -36 C12 -42 13 -46 14 -50 M-9 -36 C-4 -27 6 -27 15 -30" stroke="#A8380E" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M9 -36 C12 -42 13 -46 14 -50 M-9 -36 C-4 -27 6 -27 15 -30" stroke="#E0602A" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <path d="M12.6 -44 l3 .8 M9 -29 l2 2.4" stroke="#7A4A2E" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="14.6" cy="-51" r="2.8" fill="#7A4A2E" stroke="#3E2010" stroke-width=".9"/><circle cx="16" cy="-30" r="2.8" fill="#7A4A2E" stroke="#3E2010" stroke-width=".9"/>
    <path d="M-3 -41 v-4 h6 v4Z" fill="#7A4A2E"/>
    <ellipse cx="0" cy="-51" rx="7.6" ry="8.2" fill="url(#chPele2)" stroke="#3E2010" stroke-width="1.3"/>
    <ellipse cx="-7.4" cy="-50" rx="1.4" ry="2" fill="#7A4A2E" stroke="#3E2010" stroke-width=".7"/>
    <path d="M-8 -54 C-8 -63 8 -63 8 -54 L14 -54 C14 -51.6 8 -51.6 6 -52.6 H-8Z" fill="#2E6AB0" stroke="#163A6A" stroke-width="1.1"/><path d="M-4 -59 q4 -2.6 8 -.6" stroke="#8AC0FF" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="0" cy="-61.6" r="1" fill="#163A6A"/>
    <path d="M-5.2 -54 q2 -1 3.6 0 M2 -54 q2 -1 3.6 0" stroke="#1A0E0A" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <ellipse cx="-2.8" cy="-51.2" rx="1.2" ry="1.5" fill="#1A0E0A"/><ellipse cx="3.4" cy="-51.2" rx="1.2" ry="1.5" fill="#1A0E0A"/><circle cx="-2.4" cy="-51.8" r=".45" fill="#fff"/><circle cx="3.8" cy="-51.8" r=".45" fill="#fff"/>
    <path d="M.4 -50 q1 1.6 0 2.4" stroke="#4E2410" stroke-width=".8" fill="none"/>
    <path d="M-4 -47.2 h8.4" stroke="#2A1A10" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><path d="M-3 -45.4 C-1.4 -43.6 2 -43.6 3.6 -45.4" stroke="#3E1A0A" stroke-width="1" fill="none" stroke-linecap="round"/>
    <ellipse cx="-4.6" cy="-47.6" rx="1.6" ry=".9" fill="#C86A4A" opacity=".45"/><ellipse cx="5" cy="-47.6" rx="1.6" ry=".9" fill="#C86A4A" opacity=".45"/>
    <rect x="-20" y="-66" width="40" height="68" fill="transparent"/></g>`;
  const elodea = (x, y, h, esc, cor) => { let d = '', fol = ''; const n = Math.round(h / 9); for (let i = 0; i <= n; i++) { const yy = y - i * h / n, xx = x + Math.sin(i * .7) * 5; d += (i ? 'L' : 'M') + F(xx) + ' ' + F(yy) + ' '; if (i > 0) [-1, 1].forEach(l => { fol += `<ellipse cx="${F(xx + l * 5)}" cy="${F(yy + 1)}" rx="5" ry="1.7" transform="rotate(${l * -24} ${F(xx + l * 5)} ${F(yy + 1)})" fill="${cor}" stroke="${esc}" stroke-width=".7"/>`; }); } return `<g class="balanca" style="animation-duration:${F(R(4, 6))}s;transform-origin:${x}px ${y}px"><path d="${d}" stroke="${esc}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>${fol}</g>`; };
  const cabomba = (x, y, h) => { let s2 = `<path d="M${x} ${y} C${x - 6} ${y - h * .4} ${x + 6} ${y - h * .7} ${x} ${y - h}" stroke="#2E6A4A" stroke-width="2" fill="none"/>`; for (let i = 1; i < 6; i++) { const yy = y - i * h / 6, xx = x + Math.sin(i) * 3; s2 += `<g stroke="#4EB88A" stroke-width="1.1" fill="none" stroke-linecap="round">${[-60, -35, -12, 12, 35, 60].map(a => { const r = a * Math.PI / 180; return `<path d="M${F(xx)} ${F(yy)} l${F(Math.sin(r) * 9)} ${F(-Math.cos(r) * 7)}"/>`; }).join('')}</g>`; } return `<g class="balanca" style="animation-duration:${F(R(3.6, 5))}s;transform-origin:${x}px ${y}px">${s2}</g>`; };
  const trajMini = (teto, casco, musicos) => `<path d="M-30 -1 C-24 4 24 4 30 -1 L28 -7 H-28Z" fill="${casco}" stroke="#5E0E2A" stroke-width="1"/><path d="M-27 -4 H27" stroke="#FFF2B0" stroke-width="1.4"/><g fill="#fff">${[-20, -10, 0, 10, 20].map(x => `<circle cx="${x}" cy="-1.6" r="1.1"/>`).join('')}</g>
    <path d="M-24 -7 V-22 M-6 -7 V-22 M10 -7 V-22 M24 -7 V-22" stroke="#1E4A8A" stroke-width="1.3"/>
    <path d="M-28 -22 C-14 -27 14 -27 28 -22 V-19.6 H-28Z" fill="${teto}" stroke="#8A5A08" stroke-width=".8"/><g fill="#3FA864">${Array.from({ length:7 }, (_, k) => `<path d="M${-28 + k * 8} -19.6 q4 4 8 0Z"/>`).join('')}</g>
    <path d="M-36 -7 V-20 C-36 -30 -22 -30 -22 -20 V-7" fill="none" stroke="${casco}" stroke-width="3"/><path d="M-35 -20 C-35 -28 -23 -28 -23 -20" fill="#FFF2B0" stroke="#8A5A08" stroke-width=".6"/>${[[-32, -22, '#E0458A'], [-29, -25, '#FFC83D'], [-26, -22, '#3E9AE0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${c}"/>`).join('')}
    ${musicos ? `<g><circle cx="-14" cy="-13" r="2.6" fill="#A86A44" stroke="#4E2A14" stroke-width=".5"/><path d="M-17 -7 v-4 h6 v4Z" fill="#2E2E3A"/><ellipse cx="-11" cy="-9" rx="2.6" ry="1.8" fill="#C8863A" stroke="#6E3E14" stroke-width=".5"/><path d="M-9 -9.6 l5 -2" stroke="#6E3E14" stroke-width=".8"/>
      <circle cx="-1" cy="-13.4" r="2.6" fill="#7A4A2E" stroke="#3E2010" stroke-width=".5"/><path d="M-4 -7 v-4 h6 v4Z" fill="#E5392C"/><path d="M1 -11.4 l6 -2.4" stroke="#FFC83D" stroke-width="1.4" stroke-linecap="round"/><circle cx="7.4" cy="-13.8" r="1.4" fill="#FFC83D"/>
      <circle cx="12" cy="-13" r="2.6" fill="#C8865A" stroke="#4E2A14" stroke-width=".5"/><path d="M9 -7 v-4 h6 v4Z" fill="#3E9AE0"/><path d="M13 -9 l4 -5" stroke="#8A4A1E" stroke-width="1.6" stroke-linecap="round"/><path d="M11 -12 l8 3" stroke="#3E2010" stroke-width=".5"/></g>` : `<path d="M-2 -7 v-6" stroke="#7A4A2E" stroke-width="2.4"/>`}
    <path d="M26 -7 v-12" stroke="#2E2E3A" stroke-width="2"/><circle cx="26" cy="-21" r="2.2" fill="#8A5A3A"/><path d="M30 -30 L34 4" stroke="#7A5232" stroke-width=".9"/>`;
  const desenhoLixo = {
    garrafa:'<g transform="rotate(70)"><path d="M-6 -18 h12 v5 C10 -10 11 -6 11 0 V18 C11 22 8 23 0 23 C-8 23 -11 22 -11 18 V0 C-11 -6 -10 -10 -6 -13Z" fill="#B8E8E0" fill-opacity=".8" stroke="#3E8A7A" stroke-width="1.6"/><rect x="-5" y="-25" width="10" height="8" rx="2" fill="#E5392C" stroke="#8A1A10" stroke-width="1.2"/><rect x="-11" y="2" width="22" height="8" fill="#4E9AE0" stroke="#1E4A8A" stroke-width="1"/><path d="M-6 -6 V16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>',
    sacola:'<path d="M-16 -6 C-18 8 -12 20 0 22 C12 20 18 8 16 -6Z" fill="#F4F8FF" fill-opacity=".75" stroke="#8A9AB8" stroke-width="1.5"/><path d="M-10 -6 C-12 -17 -3 -18 -3 -7 M10 -6 C12 -17 3 -18 3 -7" stroke="#8A9AB8" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M-8 3 q4 7 0 12 M6 1 q-3 9 2 14" stroke="#C9D4E6" stroke-width="1.3" fill="none"/>',
    lata:'<g transform="rotate(-14)"><rect x="-18" y="-10" width="36" height="20" rx="4" fill="#C9CED8" stroke="#5A6070" stroke-width="1.6"/><rect x="-6" y="-10" width="12" height="20" fill="#3FA864"/><ellipse cx="18" cy="0" rx="3.4" ry="10" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.3"/><path d="M-15 -6 H13" stroke="#fff" stroke-width="1.8" opacity=".7" stroke-linecap="round"/></g>',
    copo:'<g transform="rotate(100)"><path d="M-10 -14 H10 L7 14 H-7Z" fill="#FFFFFF" stroke="#9AA4B8" stroke-width="1.5" stroke-linejoin="round"/><path d="M-9 -8 H9 M-8 0 H8" stroke="#FF8A5A" stroke-width="2.4"/><ellipse cx="0" cy="-14" rx="10" ry="2.4" fill="#E6ECF4" stroke="#9AA4B8" stroke-width="1.2"/><path d="M-5 -10 L-3 10" stroke="#fff" stroke-width="1.6" opacity=".8"/></g>'
  };
  const tule = (x, y, h, n, cor, esc, cls) => `<g class="${cls || 'balanca'}" style="animation-duration:${F(R(3.5, 5.5))}s;animation-delay:${F(R(-4, 0))}s;transform-origin:${x}px ${y}px">${Array.from({ length:n }, (_, i) => { const dx = (i - (n - 1) / 2) * 4, L = h * R(.7, 1.05), cx = x + dx + R(-6, 6); return `<path d="M${F(x + dx)} ${y} Q${F(cx)} ${F(y - L * .55)} ${F(cx + R(-8, 8))} ${F(y - L)}" stroke="${esc}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${F(x + dx)} ${y} Q${F(cx)} ${F(y - L * .55)} ${F(cx + R(-8, 8))} ${F(y - L)}" stroke="${cor}" stroke-width="2" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`;
  const tifa = (x, y, h) => `<path d="M${x} ${y} V${y - h}" stroke="#4E6A2A" stroke-width="2"/><rect x="${x - 2.6}" y="${y - h + 4}" width="5.2" height="16" rx="2.6" fill="#7A4A2A" stroke="#3E2414" stroke-width=".8"/><path d="M${x} ${y - h + 4} v-6" stroke="#4E6A2A" stroke-width="1.2"/>`;
  const vitoria = (x, y, r) => `<g><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${F(r * .32)}" fill="url(#chLirio)" stroke="#1E5A2A" stroke-width="1.1"/><path d="M${x} ${y} L${x + r} ${F(y - r * .08)}" stroke="#1E5A2A" stroke-width="1.1"/><path d="M${F(x - r * .6)} ${F(y - r * .1)} q${F(r * .4)} ${F(-r * .12)} ${F(r * .8)} 0" stroke="#B8E8A0" stroke-width="1" fill="none" opacity=".8"/></g>`;
  const flor = (x, y, r, cor, esc) => `<g>${[0, 1, 2, 3, 4].map(k => { const a = k * 1.2566 - 1.57; return `<circle cx="${F(x + Math.cos(a) * r * .9)}" cy="${F(y + Math.sin(a) * r * .9)}" r="${F(r * .62)}" fill="${cor}" stroke="${esc}" stroke-width=".6"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${F(r * .45)}" fill="#FFE27A" stroke="#B07A08" stroke-width=".5"/></g>`;
  const pompom = (x, y, r) => `<g><path d="${copa(x, y, r, r * .85, 10, .35)}" fill="url(#chCemp)" stroke="#A8480A" stroke-width="1"/><path d="${copa(x, y - r * .1, r * .55, r * .45, 8, .35)}" fill="#FFC83D" stroke="#C8740A" stroke-width=".7"/><path d="M${F(x - r * .5)} ${F(y - r * .35)} q${F(r * .3)} ${F(-r * .35)} ${F(r * .7)} ${F(-r * .35)}" stroke="#FFF3B0" stroke-width="1.2" fill="none" opacity=".8" stroke-linecap="round"/></g>`;
  const alface = (x, y) => `<g><path d="${copa(x, y - 5, 9, 6, 8, .4)}" fill="url(#chAlface)" stroke="#2E6A22" stroke-width="1"/><path d="M${x - 4} ${y - 7} q4 -4 8 0" stroke="#E6FFC8" stroke-width="1" fill="none"/></g>`;
  const pato = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="14" ry="2.6" fill="#E6F6FF" opacity=".5"/><path d="M-13 -2 C-14 -10 -6 -12 2 -11 C8 -11 13 -8 12 -2 C9 2 -9 2 -13 -2Z" fill="url(#chPato)" stroke="#4E3A24" stroke-width="1.3"/><path d="M-12 -4 l-5 -3 l1 5Z" fill="#6E5236" stroke="#3E2A16" stroke-width=".8"/><path d="M-6 -7 q6 -3 12 0" stroke="#E6D6C0" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M-2 -6 h7" stroke="#3E6AB0" stroke-width="2"/><circle cx="8" cy="-15" r="5.4" fill="#8A6A48" stroke="#4E3A24" stroke-width="1.1"/><path d="M12.6 -15.4 l6 1 l-6 2Z" fill="#E8B43A" stroke="#8A5A0A" stroke-width=".8"/><circle cx="9.4" cy="-16" r="1.2" fill="#12121A"/><circle cx="9.8" cy="-16.4" r=".45" fill="#fff"/><path d="M4 -17 h8" stroke="#4E3A24" stroke-width=".9" opacity=".6"/></g>`;
  /* ---------- cena ---------- */
  const velhaCam = ['#5E3E22', '#7A8A3A', '#4E3420', '#6E7A34', '#46301C', '#62702E', '#3E2A18'];
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Chinampas de Xochimilco: jardins construídos dentro do lago, com canais, árvores ahuejote, uma trajinera colorida, vulcões ao longe e axolotes debaixo da água">
    <defs>
      <linearGradient id="chCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB2EC"/><stop offset=".62" stop-color="#BFE2F6"/><stop offset="1" stop-color="#FFEBD2"/></linearGradient>
      <linearGradient id="chVulc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA6C8"/><stop offset="1" stop-color="#C6CEE0"/></linearGradient>
      <linearGradient id="chVulc2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AEB8D4"/><stop offset="1" stop-color="#D2D8E8"/></linearGradient>
      <linearGradient id="chNeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE6F6"/></linearGradient>
      <linearGradient id="chLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C8A8"/><stop offset="1" stop-color="#7EA88A"/></linearGradient>
      <linearGradient id="chSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED2D8"/><stop offset=".5" stop-color="#5EB0B8"/><stop offset="1" stop-color="#3A96A4"/></linearGradient>
      <linearGradient id="chAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EA8B4"/><stop offset=".45" stop-color="#22808E"/><stop offset="1" stop-color="#14505E"/></linearGradient>
      <linearGradient id="chRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="chProf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EE0E0" stop-opacity=".22"/><stop offset=".35" stop-color="#1E7A8A" stop-opacity="0"/><stop offset="1" stop-color="#062A3A" stop-opacity=".45"/></linearGradient>
      <linearGradient id="chBrilhoSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6FFFF" stop-opacity=".45"/><stop offset="1" stop-color="#E6FFFF" stop-opacity="0"/></linearGradient>
      <radialGradient id="chSeixo" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#C8BAA0"/><stop offset="1" stop-color="#6E6050"/></radialGradient>
      <pattern id="chTrama" width="14" height="9" patternUnits="userSpaceOnUse"><path d="M0 9 L14 0 M-7 4.5 L7 -4.5 M7 13.5 L21 4.5" stroke="#6E7E26" stroke-width="1.1" opacity=".55"/><path d="M0 0 L14 9 M-7 4.5 L7 13.5 M7 -4.5 L21 4.5" stroke="#F4F2A8" stroke-width=".8" opacity=".45"/></pattern>
      <radialGradient id="chLamaB" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8E6440" stop-opacity=".8"/><stop offset="1" stop-color="#8E6440" stop-opacity="0"/></radialGradient>
      <linearGradient id="chMonarca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA23A"/><stop offset="1" stop-color="#E0600A"/></linearGradient>
      <linearGradient id="chFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5A3E"/><stop offset="1" stop-color="#3A2C1C"/></linearGradient>
      <linearGradient id="chTopo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6440"/><stop offset="1" stop-color="#5E3E22"/></linearGradient>
      <linearGradient id="chTopoV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A6A3A"/><stop offset="1" stop-color="#4E3A20"/></linearGradient>
      <linearGradient id="chJunco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2D67A"/><stop offset="1" stop-color="#94A444"/></linearGradient>
      <linearGradient id="chLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4A2C"/><stop offset="1" stop-color="#3E2816"/></linearGradient>
      <linearGradient id="chMolha" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#14303A" stop-opacity=".55"/><stop offset=".8" stop-color="#1E4A5A" stop-opacity=".35"/><stop offset="1" stop-color="#2E6A7A" stop-opacity="0"/></linearGradient>
      <linearGradient id="chMadeira" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8885A"/><stop offset=".5" stop-color="#8E5E36"/><stop offset="1" stop-color="#5E3A1E"/></linearGradient>
      <linearGradient id="chAhue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8C8A0"/><stop offset=".55" stop-color="#6E9A72"/><stop offset="1" stop-color="#46705A"/></linearGradient>
      <linearGradient id="chAhue2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B4D2A4"/><stop offset=".55" stop-color="#7EA878"/><stop offset="1" stop-color="#4E7A5E"/></linearGradient>
      <linearGradient id="chFolhaM" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8E66A"/><stop offset="1" stop-color="#5E9A2E"/></linearGradient>
      <linearGradient id="chFolhaF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ED06A"/><stop offset="1" stop-color="#2E8A3E"/></linearGradient>
      <radialGradient id="chFolhaA" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#6EC08A"/><stop offset="1" stop-color="#1E6A4A"/></radialGradient>
      <linearGradient id="chEspiga" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E06AB0"/><stop offset=".5" stop-color="#8E3EA8"/><stop offset="1" stop-color="#4E2A8A"/></linearGradient>
      <linearGradient id="chEspiga2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F0A81E"/></linearGradient>
      <radialGradient id="chAbob" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFC060"/><stop offset="1" stop-color="#E06A12"/></radialGradient>
      <radialGradient id="chCemp" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFB040"/><stop offset="1" stop-color="#E8600A"/></radialGradient>
      <radialGradient id="chAlface" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#D6F49A"/><stop offset="1" stop-color="#6EAE3A"/></radialGradient>
      <radialGradient id="chLirio" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8ED86A"/><stop offset="1" stop-color="#3E8A3A"/></radialGradient>
      <linearGradient id="chPato" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B08A62"/><stop offset="1" stop-color="#7A5A3A"/></linearGradient>
      <linearGradient id="chCanoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A6A42"/><stop offset="1" stop-color="#5A3820"/></linearGradient>
      <linearGradient id="chTraj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A8E"/><stop offset="1" stop-color="#C8285A"/></linearGradient>
      <linearGradient id="chTrajT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD84A"/><stop offset="1" stop-color="#F0A81E"/></linearGradient>
      <linearGradient id="chPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D88A"/><stop offset="1" stop-color="#C8A04A"/></linearGradient>
      <linearGradient id="chSaia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A5AA8"/><stop offset="1" stop-color="#1E3A7A"/></linearGradient>
      <linearGradient id="chBlusa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EC2B8"/><stop offset="1" stop-color="#1E8A86"/></linearGradient>
      <linearGradient id="chCamisa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A4A"/><stop offset="1" stop-color="#D2501E"/></linearGradient>
      <radialGradient id="chPele1" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#C8865A"/><stop offset="1" stop-color="#9A6440"/></radialGradient>
      <radialGradient id="chPele2" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#A86E46"/><stop offset="1" stop-color="#7A4A2E"/></radialGradient>
      <linearGradient id="chCesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2B870"/><stop offset="1" stop-color="#A8763A"/></linearGradient>
      <linearGradient id="chXc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFDCE8"/><stop offset="1" stop-color="#F49AB8"/></linearGradient>
      <radialGradient id="chXh" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="#FFF0F4"/><stop offset=".6" stop-color="#FFC2D6"/><stop offset="1" stop-color="#F08EB2"/></radialGradient>
      <linearGradient id="chWc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A8A66"/><stop offset="1" stop-color="#4E5236"/></linearGradient>
      <radialGradient id="chWh" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="#A8A884"/><stop offset=".6" stop-color="#7A7A58"/><stop offset="1" stop-color="#55583C"/></radialGradient>
      <radialGradient id="chSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFD84A"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <radialGradient id="chVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#0A1A2A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A2A" stop-opacity=".34"/></radialGradient>
      <linearGradient id="chNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E4" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E4" stop-opacity=".7"/></linearGradient>
      <pattern id="chCaus" width="80" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 C10 5 20 25 30 12 C40 2 50 22 60 14 C68 8 74 18 80 15 M10 28 C18 22 26 30 34 26 M46 4 C54 0 62 8 70 4" stroke="#fff" stroke-width="1.5" fill="none" opacity=".45"/></pattern>
      <clipPath id="chCorte"><rect x="${FL + 3}" y="200" width="${FR - FL - 6}" height="280"/></clipPath>
      <filter id="chGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
    </defs>
    <rect width="800" height="300" fill="url(#chCeu)"/>
    <g id="ch-sol" class="toque"><circle cx="86" cy="58" r="46" fill="#FFE27A" opacity=".25"/><circle cx="86" cy="58" r="33" fill="#FFE27A" opacity=".3"/><circle cx="86" cy="58" r="23" fill="url(#chSolG)" stroke="#F0A81E" stroke-width="2"/><path d="M74 50 q7 -8 17 -8" stroke="#FFF6C8" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva"><use href="#nuvem" x="180" y="26" width="96" height="46" style="color:#fff" opacity=".92"/><use href="#nuvem" x="640" y="40" width="70" height="34" style="color:#fff" opacity=".8"/></g>
    <g stroke="#4E5A7A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"><path d="M300 70 q6 -6 12 0 q6 -6 12 0"/><path d="M330 90 q4 -4 8 0 q4 -4 8 0"/></g>
    <g id="ch-vulcoes" class="toque">
      <path d="M318 200 L432 86 C438 80 446 80 452 86 L590 200Z" fill="url(#chVulc)"/>
      <path d="M432 90 L392 150 L362 200 H404 L420 150 L438 112Z" fill="#C2CAE2" opacity=".55"/>
      <path d="M440 96 L428 160 L436 200 H462 L452 150Z" fill="#B4BEDA" opacity=".45"/>
      <path d="M446 84 C452 86 470 104 590 200 H486 C494 170 476 130 446 84Z" fill="#6E7AA2" opacity=".42"/>
      <path d="M454 100 L500 160 L520 200 H548 L496 146Z" fill="#5E6A92" opacity=".25"/>
      <g stroke="#7E8AAE" stroke-width="1.2" fill="none" opacity=".5" stroke-linecap="round"><path d="M436 104 L420 144 L414 176 M444 100 L446 150 L440 190 M452 104 L476 150 L488 186 M428 120 L396 168"/></g>
      <path d="M418 100 L432 86 C438 80 446 80 452 86 L468 102 L462 108 L456 104 L452 116 L446 104 L440 118 L434 106 L426 112 L424 104Z" fill="url(#chNeve)" stroke="#B8C4DA" stroke-width="1"/>
      <path d="M446 82 C450 84 460 94 468 102 L462 108 L456 104 L452 116 L448 98Z" fill="#C6D2EC"/>
      <path d="M428 96 q6 -8 12 -12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M439 118 l-2 8 M452 116 l2 9 M426 112 l-3 6" stroke="#F2F6FF" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M520 200 C540 150 560 138 584 136 C600 128 616 130 630 136 C650 128 668 132 690 142 C720 150 750 176 790 200Z" fill="url(#chVulc2)"/>
      <path d="M584 136 C574 150 560 172 552 200 H580 C584 174 592 154 600 132Z M630 136 C624 156 620 178 622 200 H646 C640 176 640 156 646 134Z" fill="#C8D0E4" opacity=".55"/>
      <path d="M690 142 C710 160 724 180 730 200 H790 C760 176 730 152 690 142Z" fill="#8E9ABA" opacity=".4"/>
      <path d="M566 142 C576 136 590 134 600 132 C612 128 624 130 632 136 C646 130 662 132 676 138 C670 142 662 141 656 145 L650 152 L644 144 C636 142 630 146 626 152 L620 144 C612 144 606 148 600 156 L596 146 C588 144 578 146 566 142Z" fill="url(#chNeve)" stroke="#C4CEE0" stroke-width="1"/>
      <path d="M632 136 C646 130 662 132 676 138 C670 142 662 141 656 145 L650 152 L644 144Z" fill="#CCD6EE"/>
      <path d="M574 139 q12 -5 24 -6 M610 131 q10 -2 18 2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <rect x="300" y="80" width="500" height="120" fill="transparent"/></g>
    <path d="M0 196 C30 170 70 160 110 168 C150 176 180 160 220 168 C260 176 290 186 320 196Z" fill="#B8C6D6" opacity=".85"/><path d="M60 196 C90 180 130 176 170 184 C200 190 230 186 260 196Z" fill="#A6B8C6" opacity=".7"/>
    <g opacity=".8">${[[640, 184, 10, 14], [652, 178, 8, 20], [662, 186, 12, 12], [676, 172, 9, 26], [688, 182, 14, 16], [704, 188, 10, 10], [716, 176, 8, 22], [726, 184, 12, 14], [740, 180, 9, 18], [752, 188, 16, 10], [770, 182, 8, 16], [782, 186, 12, 12]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#B4BED2"/><rect x="${x + w * .6}" y="${y}" width="${F(w * .4)}" height="${h}" fill="#A4AEC6"/>${h > 15 ? `<path d="M${x + 2} ${y + 4} h${w - 4} M${x + 2} ${y + 9} h${w - 4} M${x + 2} ${y + 14} h${w - 4}" stroke="#CED6E6" stroke-width=".8" stroke-dasharray="1.4 1.4"/>` : ''}`).join('')}</g>
    <path d="M0 196 C80 184 160 190 240 194 C320 186 400 192 800 194 V204 H0Z" fill="#9ABCA8" opacity=".8"/>
    <g opacity=".5">${Array.from({ length:44 }, (_, i) => { const x = i * 18.5 + R(-4, 4), y = 199, h = R(9, 15); return `<path d="M${F(x)} ${y} C${F(x - 3.4)} ${F(y - h * .4)} ${F(x - 2.4)} ${F(y - h * .9)} ${F(x)} ${F(y - h)} C${F(x + 2.4)} ${F(y - h * .9)} ${F(x + 3.4)} ${F(y - h * .4)} ${F(x)} ${y}Z" fill="#9EB8B4"/>`; }).join('')}</g>
    <rect y="170" width="800" height="34" fill="url(#chNevoa)"/>
    <rect y="200" width="800" height="100" fill="url(#chSup)"/>
    <rect y="200" width="800" height="40" fill="url(#chCaus)" opacity=".25"/>
    <g id="ch-longe">
      ${[[0, 206, 210, 6, '#8CB878'], [250, 205, 230, 6, '#A0C07A'], [520, 206, 280, 6, '#8CB878']].map(([x, y, w, h, c]) => `<path d="M${x} ${y + h} L${x + 6} ${y} H${x + w - 6} L${x + w} ${y + h}Z" fill="${c}" stroke="#5E8A5A" stroke-width=".8"/><path d="M${x + 2} ${y + h} H${x + w - 2}" stroke="#4E7A4A" stroke-width="1.6" opacity=".6"/>`).join('')}
      <path d="M262 207.4 h80" stroke="#FF8A3A" stroke-width="2.4" stroke-dasharray="6 3" opacity=".85"/><path d="M360 207.4 h70" stroke="#E0458A" stroke-width="2.4" stroke-dasharray="5 3" opacity=".8"/><path d="M20 208 h90" stroke="#B57BFF" stroke-width="2" stroke-dasharray="4 2" opacity=".7"/><path d="M560 208 h70" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 2" opacity=".75"/>
      <g opacity=".22">${Array.from({ length:30 }, (_, i) => { const x = 6 + i * 27 + R(-4, 4), y = 213, h = R(12, 18); return `<path d="M${F(x)} ${y} C${F(x - 6)} ${F(y + h * .4)} ${F(x - 4)} ${F(y + h * .9)} ${F(x)} ${F(y + h)} C${F(x + 4)} ${F(y + h * .9)} ${F(x + 6)} ${F(y + h * .4)} ${F(x)} ${y}Z" fill="#4E8A6E"/>`; }).join('')}</g>
      <g opacity=".8">${Array.from({ length:30 }, (_, i) => { const x = 6 + i * 27 + R(-4, 4), y = 207, h = R(20, 30); return `<path d="M${F(x)} ${y} C${F(x - 6)} ${F(y - h * .4)} ${F(x - 4)} ${F(y - h * .9)} ${F(x)} ${F(y - h)} C${F(x + 4)} ${F(y - h * .9)} ${F(x + 6)} ${F(y - h * .4)} ${F(x)} ${y}Z" fill="url(#chLonge)" stroke="#6E9A7E" stroke-width=".6"/><path d="M${F(x - 2)} ${F(y - h * .3)} q-1 ${F(-h * .3)} 1 ${F(-h * .55)}" stroke="#D8ECD8" stroke-width=".8" fill="none" opacity=".7"/>`; }).join('')}</g>
      ${[[-20, 224, 190, 7, '#7EAE6A'], [560, 223, 260, 7, '#88B470']].map(([x, y, w, h, c]) => `<path d="M${x} ${y + h} L${x + 7} ${y} H${x + w - 7} L${x + w} ${y + h}Z" fill="${c}" stroke="#4E7A4A" stroke-width=".9"/><path d="M${x + 10} ${y + 3} H${x + w - 10}" stroke="${x < 0 ? '#FFC83D' : '#E0458A'}" stroke-width="2.4" stroke-dasharray="5 2.4" opacity=".85"/><path d="M${x + 2} ${y + h} H${x + w - 2}" stroke="#3E6A3A" stroke-width="1.8" opacity=".6"/>`).join('')}
      <g opacity=".25">${[580, 616, 700, 742, 790, 6, 44].map((x, i) => { const y = 231, h = 22 + (i % 3) * 5; return `<path d="M${x} ${y} C${x - 7} ${y + h * .4} ${x - 5} ${y + h * .9} ${x} ${y + h} C${x + 5} ${y + h * .9} ${x + 7} ${y + h * .4} ${x} ${y}Z" fill="#3E7A5E"/>`; }).join('')}</g>
      <g>${[580, 616, 700, 742, 790, 6, 44].map((x, i) => { const y = 224, h = 34 + (i % 3) * 7; return `<path d="M${x} ${y} C${x - 8} ${y - h * .4} ${x - 6} ${y - h * .9} ${x} ${y - h} C${x + 6} ${y - h * .9} ${x + 8} ${y - h * .4} ${x} ${y}Z" fill="url(#chAhue2)" stroke="#5E8A6E" stroke-width=".8" opacity=".92"/><path d="M${x} ${y} V${y - h * .5}" stroke="#5A4636" stroke-width="1.2"/><path d="M${x - 3} ${F(y - h * .3)} q-1 ${F(-h * .3)} 1.4 ${F(-h * .58)}" stroke="#E6F4DA" stroke-width="1" fill="none" opacity=".6"/>`; }).join('')}</g>
      ${[[262, 217, .62], [596, 218, .75]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><g class="deriva" style="animation-duration:${x > 300 ? 26 : 32}s">${trajMini('#3FA864', '#FF6A8E')}</g></g>`).join('')}
      <g fill="#fff">${Array.from({ length:16 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .41 % 2.6)}s" x="${F(20 + (i * 97) % 760)}" y="${F(232 + (i * 13) % 60)}" width="${8 + i % 3 * 5}" height="1.8" rx=".9" opacity=".8"/>`).join('')}</g>
      <g stroke="#E6F6FF" stroke-width="1.2" fill="none" opacity=".7"><path d="M120 236 q6 -2 12 0 M300 246 q6 -2 12 0 M560 240 q6 -2 12 0 M690 252 q6 -2 12 0 M210 258 q6 -2 12 0"/></g>
    </g>
    <g id="ch-musicos" class="toque"><g transform="translate(404 228) scale(1.3)"><g id="ch-mus-in">${trajMini('#FFC83D', '#E0458A', true)}</g></g><rect x="360" y="192" width="88" height="46" fill="transparent"/></g>
    <!-- chinampa antiga (esquerda) -->
    <g id="ch-velha">
      <path d="M-10 ${TF} L-10 ${TB} H162 L188 ${TF}Z" fill="url(#chTopoV)" stroke="#3A2A14" stroke-width="1.6"/>
      ${[0, 1, 2, 3].map(k => `<path d="M${-10} ${TB + 4 + k * 7} H${F(165 + k * 5.6)}" stroke="#4E3A1E" stroke-width="2" opacity=".5"/>`).join('')}
      <g>${Array.from({ length:7 }, (_, i) => alface(92 + (i % 4) * 18 + (i > 3 ? 9 : 0), 252 + (i > 3 ? 12 : 0))).join('')}</g>
      <g>${[[8, 246], [22, 244], [36, 246], [50, 244], [64, 246], [14, 258], [30, 258], [46, 258], [62, 258], [76, 256]].map(([x, y], i) => `<path d="M${x} ${y + 6} V${y}" stroke="#2E5A1E" stroke-width="1.6"/><path d="M${x - 5} ${y + 5} l5 -3 l5 3" stroke="#4E8A2E" stroke-width="1.6" fill="none"/>${pompom(x, y - 2, 6.4)}`).join('')}</g>
      <g class="toque" data-fig="cempasuchil" id="ch-cemp"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><svg x="2" y="214" width="38" height="38" viewBox="0 0 110 110"><use href="#f-cempasuchil"/></svg></g>${brilhoHotspot(38, 220)}<rect x="0" y="212" width="86" height="56" fill="transparent"/></g>
    </g>
    <g id="ch-ahue-velho" class="toque"><g class="balanca" style="animation-duration:6s;transform-origin:170px ${TF}px">${ahuejote(170, TF - 2, 236, 46, 'chAhue', '#3E6A4E', '#2E5A3E')}</g></g>
    <g id="ch-agric" class="toque">${agricultora(96, TF - 5)}</g>
    <g id="ch-cesto-sem"><path d="M128 ${TF - 4} L130 ${TF - 22} H160 L162 ${TF - 4}Z" fill="url(#chCesto)" stroke="#6E4418" stroke-width="1.4" stroke-linejoin="round"/><path d="M130 ${TF - 16} H160 M129 ${TF - 10} H161" stroke="#8A5A22" stroke-width="1"/><path d="M134 ${TF - 22} l2 18 M142 ${TF - 22} v18 M150 ${TF - 22} v18 M157 ${TF - 22} l-1 18" stroke="#8A5A22" stroke-width=".8" opacity=".7"/></g>
    
    <g id="ch-pato" class="toque"><g id="ch-pato-pos" transform="translate(0 0)">${pato(252, 254, .8)}</g><rect x="230" y="234" width="44" height="28" fill="transparent"/></g>
    <!-- nova chinampa: pegada, estacas de trás, topo, árvores e plantas -->
    <path id="ch-pegada" d="M${FL} ${AG} L${BL} ${FB} H${BR} L${FR} ${AG}Z" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-width="2.4" stroke-dasharray="8 6"/>
    <g id="ch-estacas-tras">${ESTACAS.map((e, i) => e.f ? '' : `<g class="ch-estaca" data-i="${i}"><g class="ch-est-in" style="opacity:0">${estaca(e.x, 222, FB + 4, 8)}</g></g>`).join('')}</g>
    <g id="ch-topo" style="opacity:0;transition:opacity 1s">
      <path d="M${FL} ${TF} L${BL} ${TB} H${BR} L${FR} ${TF}Z" fill="url(#chTopo)" stroke="#3A2414" stroke-width="1.6"/>
      <path d="M${FL} ${TF} L${BL} ${TB} H${BR} L${FR} ${TF}Z" fill="#1E3A3A" opacity="0" id="ch-topo-molhado" style="transition:opacity 1.4s"/>
      ${[0, 1, 2, 3].map(k => `<path d="M${F(BL - k * 6.5)} ${TB + 6 + k * 7} H${F(BR + k * 6.5)}" stroke="#4A2E18" stroke-width="2" opacity=".45"/>`).join('')}
      <g fill="#A8805A" opacity=".7">${Array.from({ length:24 }, () => `<ellipse cx="${F(R(296, 500))}" cy="${F(R(TB + 4, TF - 4))}" rx="${F(R(1.4, 3))}" ry="${F(R(.8, 1.6))}"/>`).join('')}</g>
      <path d="M${BL + 6} ${TB + 2} H${BR - 6}" stroke="#B89070" stroke-width="1.6" opacity=".7"/>
    </g>
    <g id="ch-plantas">
      ${['milho', 'feijao', 'abobora'].map(t => PLANTAS[t].map((p, j) => `<g class="ch-planta" data-t="${t}" transform="translate(${p.x} ${p.y})"><g class="ch-pl-in" style="transform-origin:0px 0px;transform:scale(0);transition:transform 1.2s cubic-bezier(.3,1.4,.5,1)">${t === 'milho' ? milho() : t === 'feijao' ? feijao() : abobora()}</g></g>`).join('')).join('')}
    </g>
    <g id="ch-arvores">${CANTOS.map((p, i) => `<g class="ch-arv" data-i="${i}"><g class="ch-arv-in" style="transform-origin:${p.x}px ${p.y}px;transform:scale(0);transition:transform 1.4s cubic-bezier(.3,1.3,.5,1)"><g class="balanca" style="animation-duration:${5 + i}s;transform-origin:${p.x}px ${p.y}px">${ahuejote(p.x, p.y, 220, 40, 'chAhue2', '#4A7A5A', '#2E5A3E')}</g></g></g>`).join('')}</g>
    <!-- colheita (fase 3) -->
    <g id="ch-colheita" class="toque" style="opacity:0;transition:opacity .8s;pointer-events:none" transform="translate(470 254)"><g id="ch-colh-in">
      <path d="M-24 0 L-22 -18 H22 L24 0Z" fill="url(#chCesto)" stroke="#6E4418" stroke-width="1.4" stroke-linejoin="round"/><path d="M-22 -12 H22 M-23 -6 H23" stroke="#8A5A22" stroke-width="1"/>
      <g transform="translate(-12 -22) rotate(-30)"><path d="M0 0 C-5 -5 -5 -18 0 -22 C5 -18 5 -5 0 0Z" fill="url(#chEspiga)" stroke="#5E2A6A" stroke-width=".9"/></g><g transform="translate(-4 -22) rotate(-10)"><path d="M0 0 C-5 -5 -5 -18 0 -22 C5 -18 5 -5 0 0Z" fill="url(#chEspiga2)" stroke="#A8701A" stroke-width=".9"/></g>
      <path d="M2 -20 C0 -30 22 -30 20 -20 C19 -14 3 -14 2 -20Z" fill="url(#chAbob)" stroke="#9A4A0A" stroke-width="1.1"/><path d="M11 -27 l1 -4" stroke="#4E6A1E" stroke-width="2"/>
      ${pompom(-18, -22, 6)}${pompom(18, -30, 5)}
      <circle r="34" cy="-14" fill="transparent"/></g></g>
    <!-- água em corte -->
    <rect y="${AG}" width="800" height="${500 - AG}" fill="url(#chAgua)"/>
    <rect y="${AG}" width="800" height="70" fill="url(#chCaus)" opacity=".3" id="ch-caus"/>
    <g id="ch-raios">${[[192, 16, 1.6], [226, 12, 1.2], [300, 34, 1.6], [420, 46, 1.4], [548, 30, 1.8], [610, 44, 1.5], [690, 26, 2], [748, 38, 1.4]].map(([x, w, k]) => `<path d="M${x} ${AG} L${x + w} ${AG} L${F(x + w * k + 14)} 466 L${F(x - w * .4 + 4)} 466Z" fill="url(#chRaio)" opacity=".5"/>`).join('')}</g>
    <rect y="${AG}" width="800" height="${500 - AG}" fill="url(#chProf)" pointer-events="none"/>
    <rect id="ch-agua-toque" x="0" y="${AG + 2}" width="800" height="${FUN - AG}" fill="transparent"/>
    <g id="ch-velha-corte">
      ${velhaCam.map((c, k) => `<rect x="-10" y="${TF + k * 30}" width="198" height="31" fill="${c}"/>`).join('')}
      <g stroke="#B8C47A" stroke-width="1" opacity=".35" fill="none">${Array.from({ length:12 }, () => { const y = R(TF + 30, 470); return `<path d="M${F(R(-10, 60))} ${F(y)} h${F(R(30, 90))}"/>`; }).join('')}</g>
      <g fill="#2A1A0E" opacity=".35">${Array.from({ length:40 }, () => `<circle cx="${F(R(-8, 184))}" cy="${F(R(TF + 4, 470))}" r="${F(R(.8, 2))}"/>`).join('')}</g>
      <rect x="-10" y="${TF}" width="198" height="${AG - TF}" fill="#3A2A14" opacity=".15"/>
      <path d="M-10 ${AG} H188" stroke="#9ED2D8" stroke-width="1.4" opacity=".55" stroke-dasharray="4 4"/>
      <g stroke="#E8D6B0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"><path d="M170 ${TF} C166 300 176 330 160 370 C150 396 156 420 146 446 M168 300 C150 316 136 320 120 342 M172 330 C186 346 180 370 186 392 M162 370 C140 380 126 400 118 430"/></g>
      ${[8, 92, 182].map(x => estaca(x, TF - 10, 484, 8)).join('')}
      <path d="M-10 ${TF} H188" stroke="#2A1A0A" stroke-width="2"/>
    </g>
    <g id="ch-camadas" clip-path="url(#chCorte)">${CAM.map((cm, k) => `<g class="ch-cam" data-k="${k}" style="transform-origin:400px ${cm.y1}px;transform:scaleY(0);transition:transform .9s cubic-bezier(.3,1.25,.5,1)">${camada(k)}</g>`).join('')}
      <rect id="ch-molhado" x="${FL}" y="${TF}" width="${FR - FL}" height="${AG - TF + 30}" fill="url(#chMolha)" opacity="0" style="transition:opacity 1.4s"/>
    </g>
    <g id="ch-raizes">${CANTOS.map((p, i) => { const s = i ? -1 : 1, x = p.x; return `<path class="ch-raiz" d="M${x} ${TF} C${x + s * 4} 300 ${x - s * 6} 330 ${x + s * 10} 368 C${x + s * 18} 390 ${x + s * 8} 412 ${x + s * 20} 440 M${x} 298 C${x + s * 20} 312 ${x + s * 34} 316 ${x + s * 48} 336 M${x + s * 2} 336 C${x + s * 26} 350 ${x + s * 36} 372 ${x + s * 56} 384 M${x + s * 10} 368 C${x - s * 2} 384 ${x - s * 2} 400 ${x + s * 4} 420" stroke="#F0DEB8" stroke-width="2.4" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="transition:stroke-dashoffset 2.4s ease-out"/>`; }).join('')}
      <g id="ch-raizes-pl" style="opacity:0;transition:opacity 1.4s" stroke="#E8D2A8" stroke-width="1.2" fill="none" stroke-linecap="round">${[338, 438, 384, 476].map(x => `<path d="M${x} ${TF} c-3 8 2 14 -2 22 M${x} ${TF + 4} c6 6 8 12 12 18 M${x} ${TF + 4} c-6 6 -10 10 -12 18"/>`).join('')}</g></g>
    <g id="ch-estacas-frente">${ESTACAS.map((e, i) => e.f ? `<g class="ch-estaca" data-i="${i}"><g class="ch-est-in" style="opacity:0">${estaca(e.x, TF - 14, 488, 10)}</g></g>` : '').join('')}</g>
    <g id="ch-cerca" style="opacity:0;transition:opacity 1s">
      <g stroke="#6E4A2A" stroke-width="3" fill="none" stroke-linecap="round">${[TF + 6, TF + 15, TF + 24].map((y, k) => `<path d="M268 ${y} Q332 ${y + (k % 2 ? -4 : 4)} 396 ${y} T524 ${y}"/>`).join('')}</g>
      <g stroke="#B88A5A" stroke-width="1.2" fill="none" stroke-linecap="round">${[TF + 5, TF + 14, TF + 23].map((y, k) => `<path d="M268 ${y} Q332 ${y + (k % 2 ? -4 : 4)} 396 ${y} T524 ${y}"/>`).join('')}</g>
      <g stroke="#8A6A4A" stroke-width="2" fill="none" opacity=".35">${[340, 380, 420, 460].map((y, k) => `<path d="M268 ${y} Q332 ${y + (k % 2 ? -4 : 4)} 396 ${y} T524 ${y}"/>`).join('')}</g>
      <path d="M${BL} 232 H${BR}" stroke="#6E4A2A" stroke-width="2.4" opacity=".8"/><path d="M${BL} 244 H${BR}" stroke="#6E4A2A" stroke-width="2.4" opacity=".8"/>
    </g>
    <!-- fundo do lago -->
    <path d="M0 ${FUN} C80 462 160 474 260 468 C360 462 460 476 560 466 C660 458 740 472 800 464 V500 H0Z" fill="url(#chFundo)" stroke="#2A1E10" stroke-width="1.6"/>
    <g fill="#8A7656" opacity=".7">${Array.from({ length:26 }, () => `<ellipse cx="${F(R(4, 796))}" cy="${F(R(476, 496))}" rx="${F(R(2, 5))}" ry="${F(R(1, 2.4))}"/>`).join('')}</g>
    ${elodea(612, FUN, 110, '#3E9A5A', '#9AD87A')}${elodea(742, FUN - 2, 92, '#2E8A6A', '#8ED8B0')}${cabomba(676, FUN, 80)}${cabomba(232, FUN, 70)}${elodea(194, FUN, 78, '#4E8A3A', '#B8E07A')}
    <g stroke="#5E8A3A" stroke-width="1.6" fill="none" opacity=".85"><path d="M246 ${AG} C240 360 252 410 244 ${FUN}"/><path d="M200 ${AG + 1} C206 350 196 420 202 ${FUN}"/></g>
    <g>${Array.from({ length:44 }, () => { const x = R(4, 796), y = R(472, 497), rx = R(2.6, 7), ry = rx * R(.5, .7); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(rx)}" ry="${F(ry)}" fill="url(#chSeixo)" stroke="#3A2E1E" stroke-width=".8"/><path d="M${F(x - rx * .5)} ${F(y - ry * .3)} q${F(rx * .4)} ${F(-ry * .5)} ${F(rx * .8)} ${F(-ry * .3)}" stroke="#E8DCC4" stroke-width=".9" fill="none" opacity=".75"/>`; }).join('')}</g>
    <path d="M0 ${FUN + 3} C80 ${FUN - 5} 160 ${FUN + 7} 260 ${FUN + 1} C360 ${FUN - 5} 460 ${FUN + 9} 560 ${FUN - 1} C660 ${FUN - 9} 740 ${FUN + 5} 800 ${FUN - 3}" stroke="#A89070" stroke-width="2" fill="none" opacity=".55"/>
    ${tule(204, FUN, 120, 4, '#5EA85A', '#24562E')}${tule(250, FUN, 90, 3, '#6EB86A', '#24562E')}${tule(14, 478, 70, 3, '#5EA85A', '#24562E')}
    <g id="ch-filtros">${FILTROS.map((f, i) => `<g class="ch-filtro toque" data-i="${i}"><g class="ch-fil-in" style="transform-origin:${f.x}px ${FUN}px;transform:scale(1,0);transition:transform 1.4s cubic-bezier(.3,1.3,.5,1)">${tule(f.x, FUN, 200, 5, '#7CC86A', '#2E6A2E', 'x')}${tifa(f.x - 8, FUN - 176, 30)}${tifa(f.x + 6, FUN - 184, 34)}<g stroke="#E8DCB0" stroke-width="1.4" fill="none" opacity=".8">${[-12, -4, 4, 12].map(d => `<path d="M${f.x + d} ${FUN} q${d / 2} 8 ${d} 14"/>`).join('')}</g></g><g class="ch-fil-hint" style="display:none"><circle cx="${f.x}" cy="${AG + 8}" r="16" fill="#fff" opacity=".22"/>${brilhoHotspot(f.x, AG - 10)}<path d="M${f.x} ${AG + 30} v40 M${f.x - 7} ${AG + 62} l7 9 l7 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g><rect x="${f.x - 22}" y="${AG - 30}" width="44" height="${FUN - AG + 30}" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-lixos">${LIXO.map((l, i) => `<g class="ch-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab"><g style="animation:flutua ${F(2.4 + i * .5)}s ease-in-out infinite alternate">${desenhoLixo[l.id]}</g><circle r="28" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-primos" style="opacity:0;transition:opacity 1.4s">
      <g transform="translate(700 400) scale(.42 .42)"><g style="animation:flutua 3.6s ease-in-out infinite alternate">${axo('chWc', 'chWh', '#2E3020', '#B8606E', '#5E2430', '#6E7050')}</g></g>
      <g transform="translate(236 430) scale(-.36 .36)"><g style="animation:flutua 4.2s ease-in-out infinite alternate">${axo('chWc', 'chWh', '#2E3020', '#A8585E', '#5E2430', '#6E7050')}</g></g>
    </g>
    <rect id="ch-sujeira" x="${FR + 2}" y="${AG}" width="${800 - FR}" height="${500 - AG}" fill="#6E6A3A" opacity=".55" pointer-events="none" style="transition:opacity 1.2s"/>
    <rect id="ch-sujeira-sup" x="${FR + 2}" y="250" width="${800 - FR}" height="50" fill="#7A7A4A" opacity=".35" pointer-events="none" style="transition:opacity 1.2s"/>
    <g id="ch-xochi" class="toque" data-fig="axolote"><g id="ch-xochi-pos" transform="translate(632 420) scale(.62)"><g style="animation:flutua 3s ease-in-out infinite alternate"><g id="ch-xochi-in">${axo('chXc', 'chXh', '#B4506E', '#FF5C8A', '#9A1E48', '#FFC2D6')}</g></g></g>${brilhoHotspot(668, 396)}<rect x="596" y="382" width="90" height="70" fill="transparent"/></g>
    <!-- superfície -->
    <rect y="${AG + 1}" width="800" height="10" fill="url(#chBrilhoSup)" pointer-events="none"/>
    <g id="ch-onda1" pointer-events="none"><path d="M-40 ${AG} ${Array.from({ length:44 }, () => 'q10 -3.4 20 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.2" fill="none" opacity=".9"/></g>
    <g id="ch-onda2" pointer-events="none"><path d="M-60 ${AG + 5} ${Array.from({ length:30 }, () => 'q15 3 30 0').join(' ')}" stroke="#BFE6EE" stroke-width="1.2" fill="none" opacity=".5"/></g>
    <g fill="#fff" pointer-events="none">${[200, 236, 560, 600, 650, 712, 770].map((x, i) => `<rect class="brilho" style="animation-delay:${F(i * .5)}s" x="${x}" y="${AG + 3 + i % 3 * 3}" width="${10 + i % 2 * 8}" height="1.6" rx=".8"/>`).join('')}</g>
    <g>${vitoria(246, AG - 3, 12)}${vitoria(200, AG - 1, 8)}<g transform="translate(250 ${AG - 6})">${flor(0, 0, 4, '#FFB8D8', '#B0407A')}</g></g>
    <g id="ch-garca" class="toque" data-fig="garcabranca"><g id="ch-garca-in" style="transform-origin:214px 298px"><svg x="192" y="232" width="48" height="62" viewBox="0 0 100 130"><use href="#f-garcabranca"/></svg></g>${brilhoHotspot(236, 240)}</g>
    <!-- canoa de trabalho -->
    <g id="ch-canoa"><g id="ch-canoa-pos"><g style="animation:flutua 3.4s ease-in-out infinite alternate">
      <path d="M770 150 L788 476" stroke="#3A2414" stroke-width="5" stroke-linecap="round"/><path d="M770 150 L788 476" stroke="#B88A5A" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="670" cy="${AG + 6}" rx="104" ry="7" fill="#0E3A44" opacity=".35"/>
      <path d="M566 ${AG - 18} C580 ${AG - 12} 760 ${AG - 12} 776 ${AG - 20} C772 ${AG - 2} 760 ${AG + 6} 740 ${AG + 6} H600 C582 ${AG + 6} 570 ${AG - 4} 566 ${AG - 18}Z" fill="url(#chCanoa)" stroke="#2E1A0A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M570 ${AG - 16} C590 ${AG - 10} 754 ${AG - 10} 774 ${AG - 18}" stroke="#C8986A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M580 ${AG - 4} C620 ${AG} 720 ${AG} 762 ${AG - 6}" stroke="#4E3018" stroke-width="1.2" fill="none" opacity=".7"/>
      <g id="ch-junco" class="toque ch-fonte" data-t="junco" style="cursor:grab"><g class="ch-fonte-in"><path d="M582 ${AG - 18} C590 ${AG - 40} 640 ${AG - 44} 650 ${AG - 20}Z" fill="url(#chJunco)" stroke="#5E6A1E" stroke-width="1.4"/><g stroke="#6E7A2A" stroke-width="1.3" fill="none">${Array.from({ length:9 }, (_, k) => `<path d="M${586 + k * 7} ${AG - 18} q${F(R(-4, 4))} -16 ${F(R(-10, 10))} -${F(R(26, 40))}"/>`).join('')}</g><path d="M604 ${AG - 34} q12 4 24 0" stroke="#8A5A22" stroke-width="2.6" fill="none"/><path d="M596 ${AG - 34} q4 -6 12 -6" stroke="#F4F6B0" stroke-width="1.6" fill="none" stroke-linecap="round"/></g><g class="ch-fonte-hint" style="display:none">${brilhoHotspot(616, AG - 52)}</g><rect x="576" y="${AG - 72}" width="80" height="58" fill="transparent"/></g>
      <g id="ch-lama" class="toque ch-fonte" data-t="lama" style="cursor:grab"><g class="ch-fonte-in"><path d="M660 ${AG - 16} L662 ${AG - 36} H702 L704 ${AG - 16}Z" fill="url(#chCesto)" stroke="#6E4418" stroke-width="1.4" stroke-linejoin="round"/><path d="M662 ${AG - 28} H704" stroke="#8A5A22" stroke-width="1"/><path d="M660 ${AG - 36} C666 ${AG - 46} 696 ${AG - 46} 704 ${AG - 36}Z" fill="url(#chLama)" stroke="#2A1A0A" stroke-width="1.2"/><g fill="#8E6A4A"><circle cx="672" cy="${AG - 40}" r="1.6"/><circle cx="690" cy="${AG - 41}" r="1.4"/></g><path d="M668 ${AG - 40} q6 -3 12 -2" stroke="#A88A5A" stroke-width="1.4" fill="none"/></g><g class="ch-fonte-hint" style="display:none">${brilhoHotspot(682, AG - 56)}</g><rect x="652" y="${AG - 66}" width="60" height="52" fill="transparent"/></g>
      <g id="ch-cesto-lixo" style="display:none"><path d="M664 ${AG - 16} L662 ${AG - 40} H708 L706 ${AG - 16}Z" fill="#4EA864" stroke="#1E5A2A" stroke-width="1.6" stroke-linejoin="round"/><path d="M662 ${AG - 40} H708" stroke="#2E7A3A" stroke-width="3.4" stroke-linecap="round"/><path d="M678 ${AG - 30} l4 -5 l4 5 M692 ${AG - 34} l4 2 l-2 4 M686 ${AG - 22} l-5 0 l2 -4" stroke="#E8FFD8" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g id="ch-cesto-dentro">${['#B8E8E0', '#F4F8FF', '#3FA864', '#FFFFFF'].map((c, i) => `<circle cx="${670 + i * 10}" cy="${AG - 40}" r="5" fill="${c}" stroke="#4E5A6A" stroke-width="1" style="opacity:0;transition:opacity .4s"/>`).join('')}</g></g>
      <g id="ch-barq" class="toque">${barqueiro(754, AG - 16)}</g>
    </g></g></g>
    <!-- trajinera -->
    <g id="ch-traj" class="toque"><g id="ch-traj-pos" transform="translate(360 0)"><g style="animation:flutua 3.8s ease-in-out infinite alternate">
      <ellipse cx="676" cy="${AG + 6}" rx="116" ry="7" fill="#0E3A44" opacity=".35"/>
      <path d="M770 140 L790 476" stroke="#3A2414" stroke-width="5" stroke-linecap="round"/><path d="M770 140 L790 476" stroke="#B88A5A" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M570 ${AG - 92} V${AG - 22} M620 ${AG - 92} V${AG - 22} M690 ${AG - 92} V${AG - 22} M740 ${AG - 92} V${AG - 22}" stroke="#1E4A8A" stroke-width="3.4"/><path d="M570 ${AG - 92} V${AG - 22} M620 ${AG - 92} V${AG - 22} M690 ${AG - 92} V${AG - 22} M740 ${AG - 92} V${AG - 22}" stroke="#5EA8FF" stroke-width="1.4"/>
      <path d="M560 ${AG - 92} C600 ${AG - 106} 712 ${AG - 106} 752 ${AG - 92} V${AG - 86} H560Z" fill="url(#chTrajT)" stroke="#8A5A08" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M560 ${AG - 86} H752" stroke="#E0458A" stroke-width="4"/><g fill="#3FA864">${Array.from({ length:12 }, (_, k) => `<path d="M${563 + k * 16} ${AG - 84} q8 9 16 0Z" stroke="#1E6A3A" stroke-width=".8"/>`).join('')}</g>
      <g transform="translate(560 ${AG - 92})"><path d="M-6 0 C-6 -26 26 -26 26 0Z" fill="url(#chTraj)" stroke="#7A0E2A" stroke-width="1.6"/><path d="M-1 -2 C-1 -18 21 -18 21 -2" fill="none" stroke="#FFC83D" stroke-width="2"/>${flor(10, -10, 4, '#FFFFFF', '#B0407A')}${flor(1, -4, 2.6, '#FFC83D', '#A86A08')}${flor(19, -4, 2.6, '#7CC8FF', '#1E5AA8')}</g>
      <path d="M552 ${AG - 22} C566 ${AG - 16} 770 ${AG - 16} 790 ${AG - 24} C786 ${AG - 2} 772 ${AG + 6} 750 ${AG + 6} H590 C568 ${AG + 6} 556 ${AG - 6} 552 ${AG - 22}Z" fill="url(#chTraj)" stroke="#6E0E2A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M560 ${AG - 12} C600 ${AG - 6} 740 ${AG - 6} 782 ${AG - 14}" stroke="#FFC83D" stroke-width="4" fill="none"/><path d="M566 ${AG - 4} C610 ${AG} 730 ${AG} 774 ${AG - 6}" stroke="#2E7BF6" stroke-width="2.4" fill="none"/>
      <g>${[590, 630, 670, 710, 750].map(x => flor(x, AG - 12, 3.4, '#FFFFFF', '#B0407A')).join('')}</g>
      <path d="M556 ${AG - 23} C570 ${AG - 18} 770 ${AG - 18} 788 ${AG - 26}" stroke="#FFB8CC" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g id="ch-carga" style="opacity:0;transition:opacity .8s"><path d="M640 ${AG - 18} L642 ${AG - 36} H686 L688 ${AG - 18}Z" fill="url(#chCesto)" stroke="#6E4418" stroke-width="1.4"/><g transform="translate(652 ${AG - 36}) rotate(-24)"><path d="M0 0 C-5 -5 -5 -18 0 -22 C5 -18 5 -5 0 0Z" fill="url(#chEspiga)" stroke="#5E2A6A" stroke-width=".9"/></g><path d="M662 ${AG - 38} C660 ${AG - 48} 682 ${AG - 48} 680 ${AG - 38}Z" fill="url(#chAbob)" stroke="#9A4A0A" stroke-width="1"/>${pompom(648, AG - 40, 5)}${pompom(684, AG - 44, 5)}</g>
      ${barqueiro(755, AG - 20)}
    </g><rect x="550" y="${AG - 120}" width="250" height="130" fill="transparent"/></g></g>
    <g id="ch-borboletas" class="toque">${[[26, 198, 1], [66, 186, .85]].map(([x, y, k], i) => `<g class="ch-borb" transform="translate(${x} ${y}) scale(${k})"><g class="ch-borb-voo"><g style="animation:flutua ${2 + i * .6}s ease-in-out infinite alternate"><g class="ch-asas">
      <path d="M0 0 C-4 -10 -14 -14 -16 -8 C-18 -2 -10 2 0 1Z M0 1 C-8 2 -12 8 -9 11 C-6 13 -2 8 0 3Z" fill="url(#chMonarca)" stroke="#2A1408" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M0 0 C4 -10 14 -14 16 -8 C18 -2 10 2 0 1Z M0 1 C8 2 12 8 9 11 C6 13 2 8 0 3Z" fill="url(#chMonarca)" stroke="#2A1408" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-2 -1 L-12 -9 M-3 0 L-14 -4 M2 -1 L12 -9 M3 0 L14 -4 M-1 3 L-8 9 M1 3 L8 9" stroke="#2A1408" stroke-width=".7"/>
      <g fill="#fff">${[[-14, -9], [-16, -6], [-12, -12], [14, -9], [16, -6], [12, -12], [-9, 10], [9, 10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".8"/>`).join('')}</g></g>
      <ellipse cx="0" cy="2" rx="1.4" ry="5" fill="#2A1408"/><path d="M0 -3 l-3 -5 M0 -3 l3 -5" stroke="#2A1408" stroke-width=".7"/></g></g><rect x="-20" y="-18" width="40" height="34" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-peixe-garca" style="opacity:0" pointer-events="none"><g transform="translate(244 244) rotate(-20)"><path d="M-7 0 C-3 -4 4 -4 7 0 C4 4 -3 4 -7 0Z M7 0 l5 -3.4 v6.8Z" fill="#C8D6C0" stroke="#3E5A4A" stroke-width=".9"/><circle cx="-3.6" cy="-.6" r=".9" fill="#12121A"/></g></g>
    <!-- beija-flor e marcas -->
    <g id="ch-beija" class="toque" data-fig="beijaflor"><g id="ch-beija-pos"><g style="animation:flutua 1.1s ease-in-out infinite alternate"><svg x="128" y="132" width="52" height="43" viewBox="0 0 120 100"><use href="#f-beijaflor"/></svg></g></g>${brilhoHotspot(176, 136)}<rect x="126" y="128" width="56" height="50" fill="transparent"/></g>
    <g id="ch-marcas">${ESTACAS.map((e, i) => `<g class="ch-marca toque" data-i="${i}"><ellipse cx="${e.x}" cy="${e.y}" rx="${e.f ? 16 : 12}" ry="${e.f ? 6 : 4.6}" fill="#fff" opacity=".35" stroke="#fff" stroke-width="2"/><path d="M${e.x} ${e.y - (e.f ? 54 : 44)} v${e.f ? 30 : 24} M${e.x - 6} ${e.y - (e.f ? 30 : 26)} l6 8 l6 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${brilhoHotspot(e.x + 12, e.y - 20)}<rect x="${e.x - (e.f ? 15 : 11)}" y="${e.y - (e.f ? 58 : 48)}" width="${e.f ? 30 : 22}" height="${e.f ? 68 : 56}" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-cantos">${CANTOS.map((p, i) => `<g class="ch-canto toque" data-i="${i}" style="display:none"><circle cx="${p.x}" cy="${p.y - 6}" r="13" fill="#fff" opacity=".3" stroke="#fff" stroke-width="2"/><path d="M${p.x} ${p.y - 2} V${p.y - 16} M${p.x} ${p.y - 10} l-5 -4 M${p.x} ${p.y - 13} l5 -4" stroke="#3E8A3A" stroke-width="2.4" stroke-linecap="round"/>${brilhoHotspot(p.x + 14, p.y - 22)}<rect x="${p.x - 22}" y="${p.y - 32}" width="44" height="40" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-sementes" style="display:none">${[['milho', 130, '#FFD447', '#B07A08'], ['feijao', 148, '#8E2A2A', '#3E0A0A'], ['abobora', 166, '#F6EBC8', '#9A8A5A']].map(([t, x, c, e]) => `<g class="ch-sem toque" data-t="${t}" transform="translate(${x} ${TF - 28})" style="cursor:grab"><g class="ch-sem-in"><circle r="9" fill="#FFF8E6" stroke="#8A5A22" stroke-width="1.4"/>${t === 'milho' ? `<g fill="${c}" stroke="${e}" stroke-width=".7"><path d="M-4 -2 l2 -3 h2 l1 3 l-2 2Z"/><path d="M1 1 l2 -3 h2 l1 3 l-2 2Z"/><path d="M-4 3 l2 -3 h2 l1 3 l-2 2Z" fill="#E06AB0"/></g>` : t === 'feijao' ? `<g fill="${c}" stroke="${e}" stroke-width=".7"><ellipse cx="-2.6" cy="-1" rx="3.4" ry="2.2" transform="rotate(-20 -2.6 -1)"/><ellipse cx="3" cy="2" rx="3.4" ry="2.2" transform="rotate(15 3 2)"/></g><circle cx="-3" cy="-2" r=".6" fill="#fff"/>` : `<g fill="${c}" stroke="${e}" stroke-width=".7"><ellipse cx="-2.6" cy="0" rx="2" ry="3.6" transform="rotate(-20 -2.6 0)"/><ellipse cx="2.8" cy="0" rx="2" ry="3.6" transform="rotate(20 2.8 0)"/></g>`}</g>${brilhoHotspot(6, -10)}<circle r="10.4" fill="transparent"/></g>`).join('')}</g>
    <g id="ch-mao" style="display:none"><path d="M640 236 C560 180 460 190 410 236" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M404 242 l6 -14 l8 10Z" fill="#fff"/></g>
    ${tule(788, 500, 110, 4, '#4E9A4A', '#1E4A26')}${tule(8, 500, 90, 4, '#4E9A4A', '#1E4A26')}
    <rect width="800" height="500" fill="url(#chVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#chGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  s.querySelectorAll('#ch-raios path').forEach((r, i) => r.animate([{ opacity:.25 }, { opacity:.6 }, { opacity:.25 }], { duration:4200 + i * 900, iterations:Infinity }));
  el(s, '#ch-caus').animate([{ opacity:.15 }, { opacity:.38 }, { opacity:.15 }], { duration:3600, iterations:Infinity });
  s.querySelectorAll('.ch-asas').forEach((a, i) => a.animate([{ transform:'scaleX(1)' }, { transform:'scaleX(.25)' }], { duration:260 + i * 40, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  el(s, '#ch-onda1').animate([{ transform:'translateX(0)' }, { transform:'translateX(20px)' }], { duration:2400, iterations:Infinity });
  el(s, '#ch-onda2').animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)' }], { duration:3600, iterations:Infinity });
  el(s, '#ch-musicos').animate([{ transform:'translateX(0)' }, { transform:'translateX(-14px)' }], { duration:9000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  const pegada = el(s, '#ch-pegada'); pegada.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-28 }], { duration:1200, iterations:Infinity });
  const mao = el(s, '#ch-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-8, 8), y:y + sorte(-4, 4), vy:sorte(.7, 1.6), r:sorte(1.6, 4), topo:AG + 4, f:sorte(0, 6) }); };
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-8, 8), y, t:i * 2, cor:cor || '#E6F6FF' }); };
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  /* arrasto genérico: move um grupo e solta numa área */
  let arr = null;
  function arrastavel(g, ok, x0, y0, solta, bx, by){
    const st = { x:x0, y:y0 };
    const poe = (x, y, k) => g.setAttribute('transform', `translate(${F(x)} ${F(y)})${k ? ` scale(${k})` : ''}`);
    g.addEventListener('pointerdown', e => { if (!ok() || ocupado || arr) return; e.stopPropagation(); const p = c.ponto(e); arr = { g, st, poe, solta, x0, y0, bx:bx || 0, by:by || 0, dx:p.x - st.x, dy:p.y - st.y, px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique'); });
    return { st, poe };
  }
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); if (Math.hypot(p.x - arr.px, p.y - arr.py) > 8) arr.moveu = true; arr.st.x = Math.max(10 - arr.bx, Math.min(790 - arr.bx, p.x - arr.dx)); arr.st.y = Math.max(20 - arr.by, Math.min(490 - arr.by, p.y - arr.dy)); arr.poe(arr.st.x, arr.st.y); });
  s.addEventListener('pointerup', () => { if (!arr) return; const a = arr; arr = null; a.g.style.cursor = 'grab'; a.solta(a.moveu, a.st.x, a.st.y); });
  function voa(g, st, x1, y1, ms, k1, fim){
    const x0 = st.x, y0 = st.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); st.x = x0 + (x1 - x0) * e; st.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 40;
      g.setAttribute('transform', `translate(${F(st.x)} ${F(st.y)}) scale(${F(1 + (k1 - 1) * e)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  /* ---------- 1. construir: estacas ---------- */
  const marcas = [...s.querySelectorAll('.ch-marca')];
  marcas.forEach(m => m.animate([{ transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:1100, iterations:Infinity }));
  marcas.forEach(m => m.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'estacas' || m.dataset.feito) return; m.dataset.feito = 1; m.style.display = 'none';
    const i = +m.dataset.i, E = ESTACAS[i], est = s.querySelector(`.ch-estaca[data-i="${i}"] .ch-est-in`);
    est.style.opacity = 1;
    const a = est.animate([{ transform:'translateY(-170px)' }, { transform:'translateY(6px)', offset:.75 }, { transform:'translateY(0)' }], { duration:700, easing:'cubic-bezier(.5,0,.8,1)' });
    a.onfinish = () => { if (!vivo) return; toca('splash'); respinga(E.x, E.y, 4); if (E.f) bolhas(E.x, FUN - 6, 4); c.brilhos(E.x, E.y - 30, 3, '#FFE27A'); somOn && tom(180, 0, .12, 'square', .06, 120); };
    estacas++; chip(`Estacas: ${estacas}/5`);
    if (estacas === 1) api.diz('Toc! A estaca entra firme no fundo do lago.');
    if (estacas === 3) api.diz('As estacas vão segurar as paredes da chinampa.');
    if (estacas === 5) depois(900, () => { el(s, '#ch-cerca').style.opacity = 1; pegada.style.display = 'none'; toca('ok'); api.diz('A cerca está pronta! Galhos trançados ligam as estacas.'); depois(2600, comecaCamadas); });
  }));
  /* ---------- 1b. camadas de juncos e lama ---------- */
  const fontes = { junco:el(s, '#ch-junco'), lama:el(s, '#ch-lama') }, pos0 = { junco:{ x:0, y:0 }, lama:{ x:0, y:0 } };
  const precisa = () => CAM[camadas] ? CAM[camadas].tipo : null;
  const marcaFonte = () => Object.entries(fontes).forEach(([t, g]) => { el(g, '.ch-fonte-hint').style.display = fase === 'camadas' && precisa() === t ? '' : 'none'; });
  function comecaCamadas(){ fase = 'camadas'; chip('Camadas: 0/4'); mao.style.display = ''; marcaFonte(); api.diz('Arraste os juncos da canoa para dentro da cerca.'); }
  Object.entries(fontes).forEach(([t, g]) => {
    const { st, poe } = arrastavel(g, () => fase === 'camadas', 0, 0, (moveu, x, y) => {
      if (precisa() !== t) { voltaFonte(g, st); toca('glub'); api.diz(t === 'lama' ? 'Primeiro os juncos! Arraste os juncos da canoa.' : 'Agora é a vez da lama! Arraste o cesto de lama.'); return; }
      const cx = (t === 'junco' ? 616 : 682) + x, cy = AG - 30 + y;
      if (!moveu || (cx > FL - 20 && cx < FR + 20 && cy > 180 && cy < 480)) poeCamada(g, st); else { voltaFonte(g, st); api.diz('Solte dentro da cerca de estacas!'); }
   }, t === 'junco' ? 616 : 682, AG - 30);
    g._st = st; g._poe = poe;
  });
  function voltaFonte(g, st){ voa(g, st, 0, 0, 500, 1); }
  function poeCamada(g, st){
    const t = precisa(), alvoX = 400 - (t === 'junco' ? 616 : 682), alvoY = (CAM[camadas].y0 + 10) - (AG - 30);
    voa(g, st, alvoX, alvoY, 650, .7, () => {
      const k = camadas; camadas++;
      g.setAttribute('transform', ''); st.x = 0; st.y = 0;
      const cam = s.querySelector(`.ch-cam[data-k="${k}"]`); cam.style.transform = 'scaleY(1)';
      toca(t === 'junco' ? 'planta' : 'glub'); bolhas(sorte(300, 500), CAM[k].y0, 6); c.brilhos(400, CAM[k].y0, 4, t === 'junco' ? '#F4F6B0' : '#E8C8A0');
      chip(`Camadas: ${camadas}/4`);
      if (camadas === 1) api.diz('Juncos e plantas do lago fazem a base. Agora arraste a lama do fundo do canal!');
      if (camadas === 2) api.diz('A lama do fundo é cheia de restos de plantas, um adubo natural. Arraste os juncos de novo.');
      if (camadas === 3) api.diz('Mais uma camada de lama e a terra sai da água! Arraste a lama.');
      if (camadas === 4) { mao.style.display = 'none'; el(s, '#ch-topo').style.opacity = 1; toca('vitoria'); c.brilhos(400, 250, 10, '#FFE27A'); api.diz('Uma ilha de terra no meio do lago! Assim os povos do lago, como os mexicas, construíam as chinampas há centenas de anos.'); depois(5200, comecaArvores); }
      marcaFonte();
    });
  }
  /* ---------- 2. ahuejotes, sementes e água que sobe ---------- */
  function comecaArvores(){ fase = 'arvores'; chip('Ahuejotes: 0/2'); s.querySelectorAll('.ch-canto').forEach(g => g.style.display = ''); api.diz('Toque nos cantos da chinampa para plantar ahuejotes, árvores que seguram a terra.'); }
  s.querySelectorAll('.ch-canto').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'arvores' || g.dataset.feito) return; g.dataset.feito = 1; g.style.display = 'none';
    const i = +g.dataset.i; arvores++; chip(`Ahuejotes: ${arvores}/2`); toca('planta');
    s.querySelector(`.ch-arv[data-i="${i}"] .ch-arv-in`).style.transform = `scale(${arvK})`;
    depois(500, () => { s.querySelectorAll('.ch-raiz')[i].style.strokeDashoffset = 0; });
    c.brilhos(CANTOS[i].x, CANTOS[i].y - 30, 5, '#C8F0A0');
    if (arvores === 1) api.diz('As raízes do ahuejote crescem dentro da lama e prendem a chinampa, como pregos vivos!');
    if (arvores === 2) depois(2600, comecaSementes);
  }));
  const semG = [...s.querySelectorAll('.ch-sem')], SEMX = { milho:130, feijao:148, abobora:166 };
  function comecaSementes(){ fase = 'sementes'; chip('Sementes: 0/3'); el(s, '#ch-sementes').style.display = ''; api.diz('Arraste as sementes do cesto para a chinampa: milho, feijão e abóbora.'); }
  semG.forEach(g => {
    const t = g.dataset.t;
    const { st } = arrastavel(g, () => fase === 'sementes' && !g.dataset.feito, SEMX[t], TF - 28, (moveu, x, y) => {
      if (!moveu || (x > FL && x < FR && y > 150 && y < AG + 10)) planta(g, st); else { voa(g, st, SEMX[t], TF - 28, 500, 1); api.diz('Solte a semente em cima da chinampa nova!'); }
    });
    g._st = st;
  });
  function planta(g, st){
    const t = g.dataset.t; g.dataset.feito = 1;
    voa(g, st, PLANTAS[t][0].x, PLANTAS[t][0].y - 40, 600, .6, () => {
      g.style.display = 'none'; sementes++; chip(`Sementes: ${sementes}/3`);
      PLANTAS[t].forEach((p, j) => c.add({ tipo:'semente', x:p.x + (t === 'feijao' ? 6 : 0), y:p.y - 50, vy:1, alvoY:p.y, chega:() => {
        const pl = s.querySelectorAll(`.ch-planta[data-t="${t}"] .ch-pl-in`)[j]; pl.style.transform = `scale(${cresc})`; toca('planta'); } }));
      if (t === 'milho') api.diz('Milho! Ele cresce alto e forte.');
      if (t === 'feijao') api.diz('O feijão sobe enrolado no pé de milho.');
      if (t === 'abobora') api.diz('As folhas largas da abóbora fazem sombra e guardam a umidade da terra.');
      if (sementes === 3) { el(s, '#ch-raizes-pl').style.opacity = 1; depois(3200, comecaAgua); }
    });
  }
  function comecaAgua(){ fase = 'agua'; chip('Água: 0/3'); api.diz('Milho, feijão e abóbora juntos formam a milpa. Ninguém precisa regar: toque na água do canal e veja!'); }
  const cresce = () => {
    s.querySelectorAll('.ch-pl-in').forEach(p => { if (p.style.transform !== 'scale(0)') p.style.transform = `scale(${cresc})`; });
    s.querySelectorAll('.ch-arv-in').forEach(p => { if (p.style.transform !== 'scale(0)') p.style.transform = `scale(${arvK})`; });
  };
  function sobeAgua(px){
    ocupado = true; aguas++; chip(`Água: ${aguas}/3`); toca('glub');
    for (let i = 0; i < 26; i++) {
      const lado = i % 2 ? FR - 6 : FL + 6, y0 = sorte(AG + 10, 440);
      depois(i * 70, () => c.add({ tipo:'infiltra', x0:lado + (lado < 400 ? -10 : 10), y0, x1:sorte(300, 500), y1:sorte(TF + 4, TF + 26), dur:sorte(70, 110), f:sorte(0, 6), chega:() => { if (Math.random() < .3) c.add({ tipo:'brilho', x:sorte(300, 500), y:TF - 4, cor:'#BFE6FF' }); } }));
    }
    bolhas(px, AG + 40, 4);
    depois(1400, () => {
      molhado = aguas / 3; el(s, '#ch-molhado').style.opacity = F(molhado); el(s, '#ch-topo-molhado').style.opacity = F(molhado * .32);
      cresc = [.22, .55, .8, 1][aguas]; arvK = [.4, .58, .76, .92][aguas]; cresce(); toca('planta'); ocupado = false;
      if (aguas === 1) api.diz('A água do canal entra pela terra e sobe sozinha, como num pano molhado!');
      if (aguas === 2) api.diz('As raízes bebem essa água o tempo todo.');
      if (aguas === 3) { s.querySelectorAll('.ch-fruto').forEach(f => f.style.opacity = 1); toca('vitoria'); c.brilhos(400, 160, 10, '#FFE27A'); api.diz('Terra molhada e cheia de adubo: na chinampa dá para colher várias vezes por ano!'); voaBeija(380, 120); depois(5200, comecaLixo); }
    });
  }
  el(s, '#ch-agua-toque').addEventListener('pointerdown', e => {
    const p = c.ponto(e);
    if (fase === 'agua' && !ocupado && aguas < 3) { sobeAgua(p.x); return; }
    toca('glub'); bolhas(p.x, p.y, 3);
  });
  /* ---------- 3. limpar o canal, plantas-filtro e trajinera ---------- */
  const lix = [...s.querySelectorAll('.ch-lixo')];
  function comecaLixo(){ fase = 'lixo'; chip('Lixo: 0/4'); el(s, '#ch-cesto-lixo').style.display = ''; s.querySelectorAll('.ch-fonte').forEach(f => f.style.display = 'none'); api.diz('Ih, o canal da Xóchi está sujo! O axolote só vive em água limpa. Arraste o lixo até o cesto verde da canoa.'); }
  lix.forEach((g, i) => {
    const { st } = arrastavel(g, () => fase === 'lixo' && !g.dataset.feito, LIXO[i].x, LIXO[i].y, (moveu, x, y) => {
      if (!moveu || Math.hypot(x - CESTO.x, y - CESTO.y) < 80) recolhe(g, st, i); else { voa(g, st, LIXO[i].x, LIXO[i].y, 600, 1); toca('glub'); api.diz('Leve até o cesto verde da canoa!'); }
    });
  });
  function recolhe(g, st, i){
    g.dataset.feito = 1; if (st.y > AG) bolhas(st.x, st.y, 5);
    voa(g, st, CESTO.x, CESTO.y - 6, 800, .3, () => {
      g.style.display = 'none'; lixos++; toca('pop'); c.brilhos(CESTO.x, CESTO.y - 20, 5, '#FFE27A');
      el(s, '#ch-cesto-dentro').children[lixos - 1].style.opacity = 1; chip(`Lixo: ${lixos}/4`);
      el(s, '#ch-sujeira').style.opacity = F(.55 - lixos * .08); el(s, '#ch-sujeira-sup').style.opacity = F(.35 - lixos * .05);
      const falas = { garrafa:'Garrafa de plástico no canal, não!', sacola:'A sacola pode enroscar nos bichos da água.', lata:'A lata vai para a reciclagem.', copo:'Copo descartável também é lixo de plástico.' };
      if (lixos < 4) api.diz(falas[LIXO[i].id]);
      else { toca('ok'); depois(1200, comecaFiltros); }
    });
  }
  function comecaFiltros(){ fase = 'filtros'; chip('Plantas-filtro: 0/2'); s.querySelectorAll('.ch-fil-hint').forEach(h => h.style.display = ''); api.diz('Sem lixo! Agora toque nas beiradas do canal para plantar plantas-filtro.'); }
  s.querySelectorAll('.ch-filtro').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'filtros' || g.dataset.feito) return; g.dataset.feito = 1;
    const i = +g.dataset.i; filtros++; chip(`Plantas-filtro: ${filtros}/2`); toca('planta');
    el(g, '.ch-fil-hint').style.display = 'none'; el(g, '.ch-fil-in').style.transform = 'scale(1,1)'; bolhas(FILTROS[i].x, FUN - 20, 8);
    el(s, '#ch-sujeira').style.opacity = F(.23 - filtros * .115); el(s, '#ch-sujeira-sup').style.opacity = F(.15 - filtros * .075);
    for (let k = 0; k < 8; k++) c.add({ tipo:'brilho', t:-k * 3, x:FILTROS[i].x + sorte(-40, 40), y:sorte(AG + 20, 440), cor:'#E6FFF8' });
    if (filtros === 1) api.diz('As raízes dessas plantas seguram a sujeira e deixam a água limpinha.');
    if (filtros === 2) depois(1600, voltamPrimos);
  }));
  function voltamPrimos(){
    fase = 'primos'; el(s, '#ch-primos').style.opacity = 1; toca('vitoria'); bolhas(700, 420, 8); bolhas(236, 440, 6); festaXochi();
    api.diz('Água limpinha! Olha quem voltou: meus primos axolotes. Na natureza, a maioria é escura assim.');
    depois(4600, () => {
      api.diz('O barqueiro leva o lixo para a reciclagem.');
      el(s, '#ch-canoa-pos').animate([{ transform:'translateX(0)' }, { transform:'translateX(320px)' }], { duration:2800, easing:'ease-in', fill:'forwards' });
      depois(3000, chegaTraj);
    });
  }
  let trajX = 360;
  function moveTraj(x1, ms, fim){ const x0 = trajX, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); trajX = x0 + (x1 - x0) * e; el(s, '#ch-traj-pos').setAttribute('transform', `translate(${F(trajX)} 0)`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  function chegaTraj(){
    toca('splash'); moveTraj(0, 2600, () => {
      fase = 'colheita'; chip('Colheita'); const co = el(s, '#ch-colheita'); co.style.opacity = 1; co.style.pointerEvents = '';
      mao.style.display = ''; mao.setAttribute('transform', 'translate(0 0) scale(-1 1) translate(-1110 0)');
      api.diz('Chegou a trajinera, o barco colorido de Xochimilco! Arraste a colheita até ela.');
    });
  }
  const colh = el(s, '#ch-colheita');
  const colhSt = arrastavel(colh, () => fase === 'colheita', 470, 254, (moveu, x, y) => {
    if (!moveu || (x > 560 && y > 180 && y < AG + 20)) carrega(); else { voa(colh, colhSt.st, 470, 254, 500, 1); api.diz('Leve a cesta até a trajinera!'); }
  });
  function carrega(){
    mao.style.display = 'none';
    voa(colh, colhSt.st, 664, AG - 26, 700, .5, () => {
      colh.style.display = 'none'; el(s, '#ch-carga').style.opacity = 1; toca('pop'); c.brilhos(664, AG - 40, 6, '#FFE27A');
      fase = 'partir'; chip('Para o mercado!');
      api.diz('Agora arraste a trajinera para a direita e leve a colheita pelo canal!');
    });
  }
  let pegaTraj = null;
  el(s, '#ch-traj').addEventListener('pointerdown', e => { if (fase !== 'partir') return; e.stopPropagation(); const p = c.ponto(e); pegaTraj = { x0:p.x }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!pegaTraj) return; const p = c.ponto(e); trajX = Math.max(0, Math.min(120, p.x - pegaTraj.x0)); el(s, '#ch-traj-pos').setAttribute('transform', `translate(${F(trajX)} 0)`); });
  s.addEventListener('pointerup', () => { if (!pegaTraj) return; pegaTraj = null; parte(); });
  function parte(){
    if (fase !== 'partir') return; fase = 'fim'; toca('splash'); respinga(600, AG, 4); bolhas(790, 440, 5);
    moveTraj(380, 3400, () => {});
    depois(1200, () => { toca('vitoria'); api.diz('Os canais são as ruas de Xochimilco! As chinampas dão comida e flores há centenas de anos e são Patrimônio da Humanidade. Quem cuida da chinampa cuida da água e dos axolotes!'); depois(6800, api.fim); });
  }
  el(s, '#ch-traj').addEventListener('click', e => { if (fase !== 'partir') return; e.stopPropagation(); });
  /* ---------- toques extras ---------- */
  function festaXochi(){ const g = el(s, '#ch-xochi-in'); g.animate([{ transform:'rotate(0)' }, { transform:'rotate(-8deg) translateY(-6px)' }, { transform:'rotate(6deg)' }, { transform:'rotate(0)' }], { duration:900 }); s.querySelectorAll('#ch-xochi .ch-guelras').forEach(q => q.animate([{ opacity:1 }, { opacity:.6 }, { opacity:1 }], { duration:500, iterations:3 })); bolhas(612, 400, 5); }
  let xoK = 0;
  el(s, '#ch-xochi').addEventListener('click', () => { toca('glub'); festaXochi();
    const falas = fase === 'lixo' || fase === 'filtros' ? ['Me ajuda a limpar o canal? Água limpa é a minha casa!'] : ['Eu respiro pelas guelras, essas plumas cor-de-rosa na minha cabeça!', 'Se eu machuco uma patinha, ela cresce de novo!', 'Eu vivo na natureza só aqui, nos canais de Xochimilco.'];
    api.diz(falas[xoK++ % falas.length]); });
  let garcaOc = false;
  el(s, '#ch-garca').addEventListener('click', () => {
    if (garcaOc) return; garcaOc = true; toca('clique');
    const g = el(s, '#ch-garca-in');
    g.animate([{ transform:'rotate(0)' }, { transform:'rotate(-6deg)', offset:.3 }, { transform:'rotate(58deg)', offset:.5 }, { transform:'rotate(58deg)', offset:.6 }, { transform:'rotate(0)' }], { duration:1500, easing:'ease-in-out' });
    depois(700, () => { toca('splash'); respinga(262, AG, 4); bolhas(262, AG + 14, 4); });
    depois(1500, () => { const pg = el(s, '#ch-peixe-garca'); pg.style.opacity = 1; pg.animate([{ transform:'rotate(-4deg)' }, { transform:'rotate(4deg)' }], { duration:200, iterations:6, direction:'alternate' }); toca('pop'); api.diz('Pegou um peixinho! A garça-branca espera paradinha e mergulha o bico bem rápido.'); });
    depois(2900, () => { el(s, '#ch-peixe-garca').style.opacity = 0; toca('glub'); garcaOc = false; });
  });
  /* músicos da trajinera tocam uma melodia */
  let musOc = false;
  el(s, '#ch-musicos').addEventListener('click', e => {
    e.stopPropagation(); if (musOc) return; musOc = true;
    const mel = [[523, .18], [659, .18], [784, .18], [880, .36], [784, .18], [698, .18], [659, .36], [587, .18], [659, .18], [523, .5]];
    let t = 0; mel.forEach(([f, d]) => { if (somOn) { tom(f, t, d * .95, 'triangle', .07); tom(f / 2, t, d * .9, 'sine', .04); } t += d; });
    el(s, '#ch-mus-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-1.5px)' }], { duration:180, iterations:Math.round(t / .18), direction:'alternate' });
    for (let i = 0; i < 8; i++) depois(i * 280, () => {
      const n = document.createElementNS('http://www.w3.org/2000/svg', 'g'), x = 404 + sorte(-26, 26), cor = ['#E0458A', '#FFC83D', '#3E9AE0', '#3FA864'][i % 4];
      n.setAttribute('pointer-events', 'none');
      n.innerHTML = `<g transform="translate(${F(x)} 206)"><ellipse cx="0" cy="0" rx="3.4" ry="2.6" transform="rotate(-20)" fill="${cor}" stroke="#2A1A3A" stroke-width=".8"/><path d="M3 -1 V-13 q4 2 6 6" stroke="#2A1A3A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`;
      el(s, '#ch-musicos').appendChild(n);
      const a = n.animate([{ transform:'translate(0,0)', opacity:1 }, { transform:`translate(${F(sorte(-20, 20))}px,-60px)`, opacity:0 }], { duration:2000, easing:'ease-out' }); a.onfinish = () => n.remove();
    });
    api.diz('Música na trajinera! Nos passeios pelos canais, músicos tocam para as famílias.');
    depois(Math.round(t * 1000) + 300, () => { musOc = false; });
  });
  /* borboletas-monarca sobre o cempasúchil */
  let borbOc = false;
  el(s, '#ch-borboletas').addEventListener('click', e => {
    e.stopPropagation(); if (borbOc) return; borbOc = true; toca('pop');
    s.querySelectorAll('.ch-borb-voo').forEach((b, i) => b.animate([{ transform:'translate(0,0)' }, { transform:`translate(${50 + i * 20}px,-60px)` }, { transform:`translate(${120 - i * 30}px,-20px)` }, { transform:`translate(${40 + i * 10}px,-90px)` }, { transform:'translate(0,0)' }], { duration:4200, easing:'ease-in-out' }));
    api.diz('Borboletas-monarca! Elas voam milhares de quilômetros, do Canadá e dos Estados Unidos até as florestas do México.');
    depois(4300, () => { borbOc = false; });
  });
  function voaBeija(x, y){ const g = el(s, '#ch-beija-pos'); g.animate([{ transform:'translate(0,0)' }, { transform:`translate(${x - 154}px, ${y - 153}px)` }, { transform:`translate(${x - 134}px, ${y - 163}px)` }, { transform:'translate(0,0)' }], { duration:3600, easing:'ease-in-out' }); }
  el(s, '#ch-beija').addEventListener('click', () => { [2400, 2900, 2600].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'sine', .04, f * 1.2), i * 90)); voaBeija(sorte(160, 420), sorte(110, 170)); api.diz('O beija-flor bate as asas tão rápido que parece parado no ar!'); });
  el(s, '#ch-cemp').addEventListener('click', () => { toca('planta'); for (let i = 0; i < 16; i++) c.add({ tipo:'petala', x:sorte(10, 80), y:sorte(222, 250), vy:sorte(.5, 1), f:sorte(0, 6), chao:sorte(262, 270), cor:Math.random() < .5 ? '#FF9A2A' : '#FFC83D', borda:'#A8480A' }); api.diz('Cempasúchil, uma flor laranja do México. Xochimilco quer dizer campo de flores!'); });
  el(s, '#ch-agric').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ch-braco-ag').animate([{ transform:'rotate(0)' }, { transform:'rotate(-25deg)' }, { transform:'rotate(12deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    api.diz(fase === 'sementes' ? 'As sementes estão no meu cesto. Eu guardo as melhores de cada colheita!' : 'Bom dia! Minha família planta nesta chinampa há muitas gerações.'); });
  el(s, '#ch-barq').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('O barqueiro empurra a canoa com uma vara comprida que toca o fundo do canal.'); });
  el(s, '#ch-vulcoes').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Lá longe estão os vulcões Popocatépetl e Iztaccíhuatl, com neve no topo.'); });
  el(s, '#ch-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(86, 58, 6, '#FFE27A'); api.diz('O sol aquece a chinampa, e a água do canal mantém a terra fresquinha.'); });
  el(s, '#ch-ahue-velho').addEventListener('click', e => { e.stopPropagation(); toca('planta'); api.diz('O ahuejote é fininho e alto. Ele deixa o sol passar para as plantas da chinampa.'); });
  let patoX = 0, patoOc = false;
  el(s, '#ch-pato').addEventListener('click', e => { e.stopPropagation(); if (patoOc) return; patoOc = true; [520, 440].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sawtooth', .04, f * .7), i * 160));
    const x0 = patoX, x1 = patoX ? 0 : 16, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1400); patoX = x0 + (x1 - x0) * k; el(s, '#ch-pato-pos').setAttribute('transform', `translate(${F(patoX)} ${F(Math.sin(k * 12) * 1.2)})`); if (k < 1) requestAnimationFrame(q); else patoOc = false; })(t0);
    respinga(246 + patoX, 256, 2); api.diz('Quá! Os patos também gostam dos canais.'); });
  /* peixinhos nativos no canal limpo e bolhas */
  const cardume = (n, cx, cy, esc, cor) => ({ cx, cy, esc, cor, fx:Array.from({ length:n }, (_, k) => ({ ox:Math.cos(k * 2.4) * (8 + k % 3 * 7), oy:Math.sin(k * 2.4) * (5 + k % 3 * 3), f:sorte(0, 6) })) });
  const cardumes = [cardume(9, 660, 360, 1, '#C8D6C0'), cardume(5, 224, 360, .7, '#D8E4C8')];
  const poeira = Array.from({ length:46 }, (_, i) => ({ x:i % 4 === 0 ? sorte(190, 258) : i % 4 === 1 ? sorte(270, 522) : sorte(536, 796), y:sorte(AG + 8, FUN - 6), r:sorte(.6, 1.8), f:sorte(0, 6), v:sorte(.05, .18) }));
  c.desenho(ctx => {
    const t = performance.now() / 1000, limpo = Math.min(1, lixos / 4 * .6 + filtros * .2);
    poeira.forEach(p => { p.y -= p.v; if (p.y < AG + 6) p.y = FUN - 6; const sujo = p.x > FR ? 1 - limpo : 0; if (p.x > FL && p.x < FR && camadas && p.y > CAM[camadas - 1].y0 - 4) return;
      ctx.globalAlpha = .28 + .25 * Math.sin(t + p.f) * .5; ctx.fillStyle = sujo > .5 ? '#C8B87A' : '#E6FFF8'; ctx.beginPath(); ctx.arc(p.x + Math.sin(t * .6 + p.f) * 4, p.y, p.r, 0, 7); ctx.fill(); });
    cardumes.forEach((cd, ci) => {
      const ax = ci ? 224 + Math.sin(t * .5) * 16 : 664 + Math.sin(t * .23) * 100, ay = ci ? 346 + Math.sin(t * .9) * 22 : 344 + Math.sin(t * .41) * 26;
      const dir = ci ? Math.cos(t * .5) : Math.cos(t * .23);
      ctx.globalAlpha = ci ? .9 : .3 + limpo * .62;
      cd.fx.forEach(p => { const x = ax + p.ox * (dir > 0 ? 1 : -1), y = ay + p.oy + Math.sin(t * 1.6 + p.f) * 2.4;
        ctx.save(); ctx.translate(x, y); ctx.scale((dir > 0 ? 1 : -1) * cd.esc, cd.esc); ctx.fillStyle = cd.cor; ctx.strokeStyle = '#3E5A4A'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, -3.4 + Math.sin(t * 12 + p.f)); ctx.lineTo(-10, 3.4 + Math.sin(t * 12 + p.f)); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, 0, 7, 2.8, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.globalAlpha *= .7; ctx.beginPath(); ctx.moveTo(-3, -1); ctx.lineTo(3, -1.4); ctx.stroke(); ctx.globalAlpha /= .7;
        ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(4, -.6, .9, 0, 7); ctx.fill(); ctx.restore(); });
    });
    ctx.globalAlpha = 1;
  });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1500) { ultB = t; bolhas(sorte(560, 780), 450, 1); if (Math.random() < .5) bolhas(sorte(200, 250), 450, 1); } requestAnimationFrame(vida); })(0);
  chip('Estacas: 0/5');
  api.diz('Oi, eu sou a Xóchi, uma axolote de Xochimilco, no México! Aqui as pessoas plantam jardins dentro do lago.');
  api.diz('Toque nas setas para fincar as estacas da nova chinampa.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
