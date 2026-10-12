/* ================= JOGO 22: Sementes do Xingu, a muvuca que planta matas ================= */
function jogoXingu(palco, api){
  semente = 211;
  const F = n => (+n).toFixed(1);
  let vivo = true, fase = 'colher', camX = 0, ocupado = false, colhidos = 0, especies = {}, adicionados = 0, giro = 0, rot = 0, semeadas = 0, tempo = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  const capim = (x0, x1, y, n, cor, h, w) => { let d = ''; for (let i = 0; i < n; i++) { const x = R(x0, x1), hh = R(h[0], h[1]); d += `M${F(x)} ${F(y)} q${F(R(-1.5, 1.5))} ${F(-hh / 2)} ${F(R(-2.5, 2.5))} ${F(-hh)} `; } return `<path d="${d}" stroke="${cor}" stroke-width="${w || 1}" fill="none" stroke-linecap="round"/>`; };
  /* ---------------- desenhos ---------------- */
  const copaRica = (cx, cy, rx, ry, g, esc, luz, sombra, n) => {
    let s = `<path d="${copa(cx + rx * .05, cy + ry * .12, rx, ry, n || 14, .3)}" fill="${sombra}" stroke="${esc}" stroke-width="1.6" stroke-linejoin="round"/>`;
    s += `<g stroke="${esc}" stroke-width=".7">${Array.from({ length:Math.round(rx / 4) }, () => { const a = R(0, 6.28), x = cx + Math.cos(a) * rx * R(.92, 1.06), y = cy + Math.sin(a) * ry * R(.92, 1.08), r = a * 57.3 + 90 + R(-30, 30); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(R(3.6, 6))}" ry="${F(R(1.8, 2.8))}" transform="rotate(${F(r)} ${F(x)} ${F(y)})" fill="${R(0, 1) < .5 ? sombra : luz}"/>`; }).join('')}</g>`;
    s += `<path d="${copa(cx, cy, rx * .96, ry * .94, n || 14, .3)}" fill="url(#${g})" stroke="${esc}" stroke-width="1.3" stroke-linejoin="round"/>`;
    s += `<path d="${copa(cx + rx * .06, cy + ry * .46, rx * .8, ry * .38, 12, .3)}" fill="${esc}" opacity=".2"/>`;
    for (let i = 0; i < 8; i++) { const a = R(0, 6.28), r = R(.1, .6), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r - ry * .1, k = R(.2, .34); s += `<path d="${copa(x, y, rx * k, ry * k * 1.1, 8, .35)}" fill="url(#${g})" stroke="${esc}" stroke-width=".8" opacity=".95"/>`; }
    s += `<path d="${copa(cx - rx * .28, cy - ry * .32, rx * .42, ry * .34, 9, .35)}" fill="${luz}" opacity=".42"/>`;
    s += `<g stroke="${luz}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75">${Array.from({ length:6 }, () => { const x = cx + R(-rx * .7, rx * .3), y = cy + R(-ry * .7, ry * .1); return `<path d="M${F(x)} ${F(y)} q${F(R(4, 7))} ${F(R(-5, -3))} ${F(R(10, 15))} 0"/>`; }).join('')}</g>`;
    s += `<g stroke="${esc}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".45">${Array.from({ length:7 }, () => { const x = cx + R(-rx * .5, rx * .7), y = cy + R(-ry * .1, ry * .7); return `<path d="M${F(x)} ${F(y)} q${F(R(3, 5))} ${F(R(2, 4))} ${F(R(8, 12))} 0"/>`; }).join('')}</g>`;
    return s;
  };
  const tronco = (x, yb, yt, w, g, esc, dx) => {
    dx = dx || 0; const h = yb - yt, w2 = w * .42;
    const d = `M${F(x - w * .95)} ${yb} C${F(x - w * .5)} ${F(yb - 5)} ${F(x - w * .52)} ${F(yb - h * .3)} ${F(x - w2 + dx * .6)} ${F(yb - h * .62)} L${F(x - w2 * .8 + dx)} ${yt} L${F(x + w2 * .8 + dx)} ${yt} L${F(x + w2 + dx * .6)} ${F(yb - h * .62)} C${F(x + w * .52)} ${F(yb - h * .3)} ${F(x + w * .5)} ${F(yb - 5)} ${F(x + w * .95)} ${yb}Z`;
    let casca = '';
    for (let i = 0; i < 6; i++) { const xx = x + R(-w * .3, w * .3), yy = R(yt + 10, yb - 14); casca += `M${F(xx)} ${F(yy)} q${F(R(-2, 2))} ${F(R(6, 10))} ${F(R(-1, 1))} ${F(R(14, 22))} `; }
    const raiz = `<path d="M${F(x - w * .7)} ${yb - 2} q${F(-w * .4)} 2 ${F(-w * .8)} 6 M${F(x + w * .7)} ${yb - 2} q${F(w * .4)} 2 ${F(w * .8)} 6 M${F(x - w * .2)} ${yb} q-2 4 -5 7 M${F(x + w * .3)} ${yb} q2 4 6 6" stroke="${esc}" stroke-width="${F(Math.max(2, w * .16))}" fill="none" stroke-linecap="round"/>`;
    return `${raiz}<path d="${d}" fill="url(#${g})" stroke="${esc}" stroke-width="1.6" stroke-linejoin="round"/><path d="${casca}" stroke="${esc}" stroke-width="1.1" fill="none" opacity=".5" stroke-linecap="round"/><path d="M${F(x - w * .28)} ${yb - 8} C${F(x - w * .3)} ${F(yb - h * .35)} ${F(x - w2 * .6 + dx * .7)} ${F(yb - h * .7)} ${F(x - w2 * .5 + dx)} ${yt + 6}" stroke="#fff" stroke-width="2" fill="none" opacity=".22" stroke-linecap="round"/>`;
  };
  const galho = (d, w, cor, esc) => `<path d="${d}" stroke="${esc}" stroke-width="${w + 2.4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  /* frutos pendurados (origem no cabinho) */
  const FRUTO = {
    jatoba:`<path d="M0 -4 v10" stroke="#4E2E14" stroke-width="1.8"/><path d="M-6.6 8 C-10 18 -8 32 0 36 C8 32 10 18 6.6 8 C4.6 3.6 -4.6 3.6 -6.6 8Z" fill="url(#xiJatF)" stroke="#2A140A" stroke-width="1.4"/><path d="M0 7 C-1 18 -1 28 0 35" stroke="#2A140A" stroke-width=".8" opacity=".5"/><path d="M-3.4 12 C-5 18 -4.4 26 -1.6 31" stroke="#C8966A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>`,
    pequi:`<path d="M0 -4 v8" stroke="#3E5A1A" stroke-width="1.8"/><circle cx="0" cy="15" r="11" fill="url(#xiPeqF)" stroke="#2E4A12" stroke-width="1.4"/><path d="M-6 9 q3.4 -4 9 -2.4" stroke="#EAF8B8" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="0" cy="26" r="1.4" fill="#3E5A1A"/><path d="M-3 5 l3 -2 l3 2" stroke="#3E6A1A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    baru:`<path d="M0 -4 v8" stroke="#4E3418" stroke-width="1.8"/><path d="M0 4 C9 4 11 16 9 22 C7 28 -7 28 -9 22 C-11 16 -9 4 0 4Z" fill="url(#xiBarF)" stroke="#3E220E" stroke-width="1.4"/><g fill="#E0B888" opacity=".75"><circle cx="-3" cy="12" r="1.2"/><circle cx="3.6" cy="17" r="1"/><circle cx="-2" cy="21" r=".9"/></g><path d="M-5 9 q2 -3 6 -3" stroke="#F2D2A8" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    ipe:`<path d="M0 -4 v6" stroke="#5E4A2A" stroke-width="1.6"/><g class="xi-vagem"><path d="M0 2 C3 12 4 26 2.4 40 C1.6 43 -1.6 43 -2 40 C-2.6 26 -2.4 12 0 2Z" fill="url(#xiIpeF)" stroke="#4E3E1E" stroke-width="1.2"/><path d="M.6 6 C1.6 16 1.8 28 .8 38" stroke="#4E3E1E" stroke-width=".7" fill="none" opacity=".6"/><path d="M-.8 8 C-.6 16 -.6 26 -1 34" stroke="#E8DCB0" stroke-width="1" fill="none" opacity=".7"/></g>`
  };
  const SEM = {
    jatoba:`<ellipse rx="5" ry="3.6" fill="#7A3E1E" stroke="#3A1A0A" stroke-width=".8"/><ellipse cx="-1.2" cy="-1" rx="2.6" ry="1.5" fill="#EAD48E" opacity=".9"/>`,
    pequi:`<circle r="4.4" fill="url(#xiPeqP)" stroke="#A8680A" stroke-width=".8"/><circle cx="-1.3" cy="-1.3" r="1.3" fill="#FFF3B0"/>`,
    baru:`<ellipse rx="3.8" ry="5.2" fill="#A0683A" stroke="#4E2A10" stroke-width=".8"/><path d="M0 -3.6 v7" stroke="#E0B080" stroke-width=".9"/>`,
    ipe:`<path d="M-8 0 C-6 -3.4 -2 -2.6 0 -1 C2 -2.6 6 -3.4 8 0 C6 3.4 2 2.6 0 1 C-2 2.6 -6 3.4 -8 0Z" fill="#FFF6DC" fill-opacity=".9" stroke="#A8945A" stroke-width=".7"/><ellipse rx="2.2" ry="1.7" fill="#7A5A2A"/>`,
    rapida:`<ellipse rx="4.6" ry="3.2" fill="#FFFDF2" stroke="#A89A7A" stroke-width=".8"/><path d="M-2.6 -.6 q2.4 -1.4 5 0" stroke="#C8B48A" stroke-width=".7" fill="none"/>`,
    guandu:`<circle r="2.6" fill="#C89A5A" stroke="#6E4A22" stroke-width=".6"/>`
  };
  const cesto = (x, y, k, id, cheio) => {
    let tr = '';
    for (let yy = -18; yy < 28; yy += 7.4) { const f = 1 - (yy + 26) / 70 * .24; tr += `<path d="M${F(-54 * f)} ${yy} Q0 ${F(yy + 9)} ${F(54 * f)} ${yy}" stroke="#8A5A22" stroke-width="2.2" fill="none" opacity=".7"/><path d="M${F(-54 * f)} ${yy - 2} Q0 ${F(yy + 7)} ${F(54 * f)} ${yy - 2}" stroke="#F4D49A" stroke-width=".9" fill="none" opacity=".6"/>`; }
    let cost = ''; for (let i = -5; i <= 5; i++) cost += `M${F(i * 10)} -24 Q${F(i * 10.6)} 6 ${F(i * 7.6)} 31 `;
    let dentro = '';
    if (cheio) { const tipos = ['jatoba', 'pequi', 'baru', 'ipe']; for (let j = 0; j < 30; j++) { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)); dentro += `<g transform="translate(${F(Math.cos(a) * 44 * r)} ${F(-28 + Math.sin(a) * 7 * r - R(0, 5))}) rotate(${F(R(-40, 40))})">${SEM[tipos[j % 4]]}</g>`; } }
    return `<g transform="translate(${x} ${y}) scale(${k})">
      <ellipse cx="0" cy="31" rx="60" ry="7" fill="#2A1A0A" opacity=".3"/>
      <path d="M-56 -26 C-55 0 -47 22 -40 30 C-20 36 20 36 40 30 C47 22 55 0 56 -26Z" fill="url(#xiCesto)" stroke="#5E3A12" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M-56 -26 C-55 0 -47 22 -40 30 C-20 36 20 36 40 30 C47 22 55 0 56 -26Z" fill="url(#xiTrama)" opacity=".8"/>
      <path d="${cost}" stroke="#7A4A18" stroke-width="1.3" fill="none" opacity=".55"/>${tr}
      <path d="M-50 4 Q0 14 50 4" stroke="#B8402A" stroke-width="4.4" fill="none" opacity=".85"/><path d="M-50 4 Q0 14 50 4" stroke="#3A2414" stroke-width="1.6" fill="none" stroke-dasharray="5 4" opacity=".7"/>
      <path d="M-46 -12 C-44 6 -38 20 -32 26" stroke="#FFE8B8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/>
      <ellipse cx="0" cy="-26" rx="54" ry="9.6" fill="#3A220E"/>
      <g id="${id}">${dentro}</g>
      <path d="M-56 -26 A56 10 0 0 0 56 -26" stroke="#C8904A" stroke-width="4.6" fill="none"/><path d="M-56 -26 A56 10 0 0 0 56 -26" stroke="#6E4418" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
      <path d="M-56 -26 A56 10 0 0 1 56 -26" stroke="#B07A3A" stroke-width="3.4" fill="none"/>
    </g>`;
  };
  /* ---------- pessoas (pés em 0,0; altura ~100) ---------- */
  const cabeca = o => {
    const e = o.esc, cc = o.corCab, lc = o.luzCab;
    let tras = '', frente = '';
    if (o.cab === 'franja') {
      tras = `<path d="M-12.8 -86 C-15 -102 15 -102 12.8 -86 L14.2 -68 C8 -65 -8 -65 -14.2 -68Z" fill="${cc}" stroke="${e}" stroke-width=".8"/>`;
      frente = `<path d="M-12 -84.6 C-13.4 -101 13.4 -101 12 -84.6 C11.6 -86.4 11 -87.6 10.2 -87.8 H-10.2 C-11 -87.6 -11.6 -86.4 -12 -84.6Z" fill="${cc}"/><path d="M-9.8 -88 H9.8" stroke="${lc}" stroke-width=".8" stroke-dasharray="1.2 1.3" opacity=".7"/><path d="M-7 -96.4 q6 -3.6 13 -1" stroke="${lc}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/><path d="M12.4 -84 L13.6 -70 M-12.4 -84 L-13.6 -70" stroke="${lc}" stroke-width=".8" opacity=".5"/>`;
    } else if (o.cab === 'tigela') {
      frente = `<path d="M-11.8 -84 C-13 -100 13 -100 11.8 -84 C11.2 -86.6 10 -87.6 8.6 -87.8 H-8.6 C-10 -87.6 -11.2 -86.6 -11.8 -84Z" fill="${cc}"/><path d="M-6.6 -95.6 q5 -3 11 -1" stroke="${lc}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M-8.4 -88 H8.4" stroke="${lc}" stroke-width=".7" stroke-dasharray="1.2 1.3" opacity=".6"/>`;
    } else if (o.cab === 'curto') {
      frente = `<path d="M-11.4 -85 C-12.6 -99 12.6 -99 11.4 -85 C9 -92 -9 -92 -11.4 -85Z" fill="${cc}"/><path d="M-5 -95 q4 -2 9 -.6" stroke="${lc}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    } else if (o.cab === 'cachos') {
      tras = `<g fill="${cc}" stroke="${e}" stroke-width=".7">${[[-13, -78], [-14.6, -72], [13, -78], [14.6, -72], [-11, -70], [11, -70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6"/>`).join('')}</g>`;
      frente = `<g fill="${cc}" stroke="${e}" stroke-width=".7">${[-150, -125, -100, -80, -55, -30, -170, -10].map(a => { const r = a * Math.PI / 180; return `<circle cx="${F(Math.cos(r) * 11.4)}" cy="${F(-86 + Math.sin(r) * 12.6)}" r="4.4"/>`; }).join('')}</g><g fill="none" stroke="${lc}" stroke-width=".9" opacity=".8">${[-130, -90, -50].map(a => { const r = a * Math.PI / 180; return `<path d="M${F(Math.cos(r) * 11.4 - 2)} ${F(-86 + Math.sin(r) * 12.6 - 1)} q2 -2 4 0"/>`; }).join('')}</g>`;
    }
    let chapeu = '';
    if (o.chapeu) chapeu = `<path d="M-10.6 -95 C-11 -108 11 -108 10.6 -95Z" fill="url(#xiPalha)" stroke="#8A6A2A" stroke-width="1.1"/><ellipse cx="0" cy="-94.4" rx="21" ry="4.8" fill="url(#xiPalha)" stroke="#8A6A2A" stroke-width="1.1"/><path d="M-10.8 -97 H10.8" stroke="#C8402A" stroke-width="2.4"/><g stroke="#B08A3A" stroke-width=".6" opacity=".8" fill="none"><path d="M-17 -95.4 l3 2 M-12 -96.4 l3 2.4 M12 -96.4 l-3 2.4 M17 -95.4 l-3 2 M-6 -101 h12 M-7 -103.6 h14"/></g><path d="M-6 -104 q4 -2 9 -1.4" stroke="#FFF2C0" stroke-width="1" fill="none" stroke-linecap="round"/>`;
    const sardas = o.sardas ? `<g fill="#B8704A" opacity=".55"><circle cx="-7.4" cy="-81" r=".5"/><circle cx="-6" cy="-80" r=".5"/><circle cx="-8.4" cy="-79.6" r=".5"/><circle cx="7.4" cy="-81" r=".5"/><circle cx="6" cy="-80" r=".5"/><circle cx="8.4" cy="-79.6" r=".5"/></g>` : '';
    return `${tras}<ellipse cx="-11" cy="-83" rx="2.3" ry="3.1" fill="${o.peleC}" stroke="${e}" stroke-width=".8"/><ellipse cx="11" cy="-83" rx="2.3" ry="3.1" fill="${o.peleC}" stroke="${e}" stroke-width=".8"/>
      <ellipse cx="0" cy="-84" rx="11" ry="12.4" fill="url(#${o.pele})" stroke="${e}" stroke-width="1.3"/>
      <path d="M-6.8 -89 q2.4 -1.5 4.8 -.3 M2 -89.3 q2.4 -1.2 4.8 .3" stroke="${cc}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="-4.2" cy="-84.2" rx="1.75" ry="2.2" fill="#1A0E0A"/><ellipse cx="4.2" cy="-84.2" rx="1.75" ry="2.2" fill="#1A0E0A"/><circle cx="-3.6" cy="-85" r=".75" fill="#fff"/><circle cx="4.8" cy="-85" r=".75" fill="#fff"/>
      <path d="M0 -82.6 q1.3 2.2 -.5 3.2" stroke="${o.nariz}" stroke-width=".95" fill="none" stroke-linecap="round"/>
      <path d="M-4.2 -77.4 C-2 -74 2 -74 4.2 -77.4Z" fill="#fff" stroke="#6E2E14" stroke-width=".95" stroke-linejoin="round"/><path d="M-2.4 -75.4 q2.4 1.2 4.8 0" stroke="#E87A6A" stroke-width=".9" fill="none" opacity=".8"/>
      <ellipse cx="-7.2" cy="-79.4" rx="2.5" ry="1.5" fill="#E0705A" opacity=".42"/><ellipse cx="7.2" cy="-79.4" rx="2.5" ry="1.5" fill="#E0705A" opacity=".42"/>${sardas}
      <path d="M-8 -91 q3 -3.4 7 -3.6" stroke="#fff" stroke-width="1.3" fill="none" opacity=".22" stroke-linecap="round"/>${frente}${chapeu}`;
  };
  const BRACOS = {
    lado:[['M-11 -66 C-16 -60 -18 -50 -17.4 -40', -17.4, -38.4, 'M-11 -66 L-14.6 -58'], ['M11 -66 C16 -60 18 -50 17.4 -40', 17.4, -38.4, 'M11 -66 L14.6 -58']],
    aponta:[['M-11 -66 C-16 -60 -18 -50 -17.4 -40', -17.4, -38.4, 'M-11 -66 L-14.6 -58'], ['M11 -66 C17 -72 22 -83 24.6 -94', 25, -96.6, 'M11 -66 L16.4 -72']],
    segura:[['M-11 -66 C-16 -58 -15 -49 -8 -45', -7.4, -44.6, 'M-11 -66 L-14.6 -58'], ['M11 -66 C16 -58 15 -49 8 -45', 7.4, -44.6, 'M11 -66 L14.6 -58']]
  };
  const pessoa = (x, y, k, o, id) => {
    const e = o.esc, pc = o.peleC;
    let baixo = '';
    if (o.baixo === 'short') baixo = `<path d="M-13.6 -46 L-14.6 -27 H-1.4 L0 -36 L1.4 -27 H14.6 L13.6 -46Z" fill="url(#${o.baixoG})" stroke="${o.baixoEsc}" stroke-width="1.2" stroke-linejoin="round"/><path d="M-13 -30 H-2 M2 -30 H13" stroke="#fff" stroke-width="1.2" opacity=".5"/><path d="M-13.6 -43 H13.6" stroke="${o.baixoEsc}" stroke-width="1.6" opacity=".7"/><path d="M-1.6 -43 l-1.4 5 M1.6 -43 l1.4 5" stroke="#fff" stroke-width=".8" opacity=".7"/><path d="M-12.6 -42 C-9.6 -40 -8.4 -37 -8 -34 M12.6 -42 C9.6 -40 8.4 -37 8 -34" stroke="${o.baixoEsc}" stroke-width=".9" fill="none" opacity=".6"/>`;
    else if (o.baixo === 'saia') baixo = `<path d="M-13.4 -48 C-15 -40 -17 -31 -18.2 -22 C-8 -19 8 -19 18.2 -22 C17 -31 15 -40 13.4 -48Z" fill="url(#${o.baixoG})" stroke="${o.baixoEsc}" stroke-width="1.2"/><path d="M-17.4 -25 C-8 -22 8 -22 17.4 -25" stroke="#FFC83D" stroke-width="2" fill="none"/><path d="M-17 -27.6 C-8 -24.6 8 -24.6 17 -27.6" stroke="#fff" stroke-width=".9" fill="none" stroke-dasharray="2 1.6"/><path d="M-16.6 -31 ${Array.from({ length:11 }, (_, i) => `L${F(-15 + i * 3)} ${i % 2 ? -33 : -30.4}`).join(' ')} L16.6 -31" stroke="#E8452A" stroke-width="1.1" fill="none" stroke-linejoin="round"/><path d="M-10.4 -46 C-11.6 -38 -12.8 -30 -13.4 -24 M10.4 -46 C11.6 -38 12.8 -30 13.4 -24 M0 -47 V-23" stroke="${o.baixoEsc}" stroke-width=".7" fill="none" opacity=".45"/><path d="M-13.4 -46.6 C-6 -45 6 -45 13.4 -46.6" stroke="${o.baixoEsc}" stroke-width="1.6" fill="none" opacity=".6"/><path d="M-5 -46 C-6 -38 -7 -30 -8 -23 M5 -46 C6 -38 7 -30 8 -23" stroke="${o.baixoEsc}" stroke-width=".8" fill="none" opacity=".5"/>`;
    else if (o.baixo === 'calca') baixo = `<path d="M-13.6 -46 L-12.8 -5 H-2.2 L0 -34 L2.2 -5 H12.8 L13.6 -46Z" fill="url(#${o.baixoG})" stroke="${o.baixoEsc}" stroke-width="1.2" stroke-linejoin="round"/><path d="M-8 -40 V-8 M8 -40 V-8" stroke="#B8D0F0" stroke-width=".8" opacity=".45" stroke-dasharray="2 2"/><path d="M-13 -44 H13" stroke="#5A3A22" stroke-width="2.2"/><rect x="-2" y="-45.4" width="4" height="3" rx=".6" fill="#E8C86A"/><path d="M-12.6 -42 C-9 -40.6 -7.4 -38 -7 -35 M12.6 -42 C9 -40.6 7.4 -38 7 -35 M-1 -42 V-34" stroke="${o.baixoEsc}" stroke-width=".9" fill="none" opacity=".7"/><path d="M-12.9 -9 H-2.2 M12.9 -9 H2.2" stroke="${o.baixoEsc}" stroke-width="1.4" opacity=".7"/><path d="M-10.6 -22 q2 -1 4 0 M10.6 -22 q-2 -1 -4 0" stroke="#fff" stroke-width=".9" fill="none" opacity=".35"/>`;
    const pes = o.pe === 'bota' ? `<path d="M-13.4 0 C-13.6 -3 -12.6 -8 -11.6 -11 H-3 V0Z M13.4 0 C13.6 -3 12.6 -8 11.6 -11 H3 V0Z" fill="#6E4428" stroke="#2E1A0A" stroke-width="1"/><path d="M-13.4 -1 H-3 M13.4 -1 H3" stroke="#2E1A0A" stroke-width="1.6"/>`
      : `<ellipse cx="-7.6" cy="-.6" rx="6.2" ry="2.2" fill="${o.corPe}" stroke="${e}" stroke-width=".8"/><ellipse cx="7.6" cy="-.6" rx="6.2" ry="2.2" fill="${o.corPe}" stroke="${e}" stroke-width=".8"/><ellipse cx="-7.4" cy="-2" rx="4.4" ry="1.8" fill="${pc}" stroke="${e}" stroke-width=".7"/><ellipse cx="7.4" cy="-2" rx="4.4" ry="1.8" fill="${pc}" stroke="${e}" stroke-width=".7"/><path d="M-10 -1.4 L-7.4 -3.4 L-4.8 -1.4 M10 -1.4 L7.4 -3.4 L4.8 -1.4" stroke="${o.corPe}" stroke-width="1.2" fill="none"/>`;
    const [bE, bD] = BRACOS[o.braco || 'lado'];
    const braco = (b, cls) => `<g ${cls}><path d="${b[0]}" stroke="${e}" stroke-width="7.6" fill="none" stroke-linecap="round"/><path d="${b[0]}" stroke="${pc}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="${b[3]}" stroke="${o.blusaEsc}" stroke-width="8.6" stroke-linecap="round"/><path d="${b[3]}" stroke="url(#${o.blusa})" stroke-width="6.4" stroke-linecap="round"/>${(() => { const m = b[3].match(/-?[\d.]+/g).map(Number), dx = m[2] - m[0], dy = m[3] - m[1], l = Math.hypot(dx, dy), px = -dy / l * 3.4, py = dx / l * 3.4; return `<path d="M${F(m[2] - px)} ${F(m[3] - py)} L${F(m[2] + px)} ${F(m[3] + py)}" stroke="${o.blusaEsc}" stroke-width="1.2" stroke-linecap="round"/>`; })()}<circle cx="${b[1]}" cy="${b[2]}" r="3.4" fill="${pc}" stroke="${e}" stroke-width=".9"/>${o.braco === 'aponta' && b === bD ? `<path d="M${b[1]} ${b[2] - 2} l.6 -4.6" stroke="${e}" stroke-width="2.6" stroke-linecap="round"/><path d="M${b[1]} ${b[2] - 2} l.6 -4.6" stroke="${pc}" stroke-width="1.5" stroke-linecap="round"/>` : ''}</g>`;
    return `<g transform="translate(${x} ${y}) scale(${k})" ${id ? `id="${id}"` : ''}>
      <ellipse cx="0" cy="1" rx="20" ry="3.2" fill="#1A0E04" opacity=".26"/>
      <path d="M-6 -42 L-6.8 -3 M6 -42 L6.8 -3" stroke="${e}" stroke-width="8.8" stroke-linecap="round"/><path d="M-6 -42 L-6.8 -3 M6 -42 L6.8 -3" stroke="${pc}" stroke-width="6.6" stroke-linecap="round"/><path d="M-4.4 -24 V-8 M7.6 -24 V-8" stroke="#fff" stroke-width="1" opacity=".22"/>
      ${pes}${baixo}${cabeca(Object.assign({}, o, { _so:'tras' })).split('<ellipse cx="-11"')[0]}
      <rect x="-3.6" y="-75" width="7.2" height="8" fill="${pc}" stroke="${e}" stroke-width=".8"/>
      <path d="M-14 -44 C-15.4 -54 -15 -63 -10.6 -69.6 C-6 -71.6 6 -71.6 10.6 -69.6 C15 -63 15.4 -54 14 -44 C6 -42 -6 -42 -14 -44Z" fill="url(#${o.blusa})" stroke="${o.blusaEsc}" stroke-width="1.3"/>
      <path d="M-4.8 -70.8 C-3 -66.4 3 -66.4 4.8 -70.8" fill="${pc}" stroke="${o.blusaEsc}" stroke-width="1"/><path d="M-13.4 -46.4 C-6 -44.4 6 -44.4 13.4 -46.4" stroke="${o.blusaEsc}" stroke-width="1" fill="none" opacity=".75"/><path d="M-12.6 -56 C-11 -52 -11.6 -48 -12.6 -45 M12.6 -56 C11 -52 11.6 -48 12.6 -45" stroke="${o.blusaEsc}" stroke-width=".8" fill="none" opacity=".4"/>${o.chapeu ? `<path d="M0 -66.6 V-46" stroke="${o.blusaEsc}" stroke-width=".9"/>${[-62, -56, -50].map(y => `<circle cx="1.6" cy="${y}" r=".9" fill="#F4E8D8" stroke="${o.blusaEsc}" stroke-width=".4"/>`).join('')}<path d="M4 -62 h6 v5 h-6Z" fill="none" stroke="${o.blusaEsc}" stroke-width=".8"/>` : ''}
      <path d="M-11 -50 C-6 -48.6 6 -48.6 11 -50" stroke="${o.blusaEsc}" stroke-width=".8" fill="none" opacity=".4"/><path d="M-9.6 -66 C-11.6 -60 -11.6 -54 -10.6 -48" stroke="#fff" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round"/>
      ${o.estampa || ''}${braco(bE, '')}${braco(bD, o.idBraco ? `id="${o.idBraco}" style="transform-origin:11px -66px"` : '')}
      ${cabeca(o).replace(/^[\s\S]*?(<ellipse cx="-11")/, '$1')}${o.extra || ''}
      <rect x="-24" y="-112" width="48" height="114" fill="transparent"/></g>`;
  };
  const P_COLETORA = { pele:'xiPeleA', peleC:'#B07850', esc:'#4E2A14', nariz:'#7A4428', cab:'franja', corCab:'#17110E', luzCab:'#6E625C', blusa:'xiBlusaA', blusaEsc:'#9A3014', baixo:'saia', baixoG:'xiSaiaA', baixoEsc:'#14564E', corPe:'#FFC83D',
    estampa:`<path d="M-5 -56 C-5 -62 1 -64 4 -62 C4 -57 0 -54 -5 -56Z" fill="#3FA864" stroke="#1E6A3A" stroke-width=".7"/><path d="M-5 -56 L3 -61.6" stroke="#B8F0A8" stroke-width=".6"/>`,
    extra:`<g>${[-5, -3, -1, 1, 3, 5].map((x, i) => `<circle cx="${x}" cy="${F(-68.6 + Math.abs(x) * -.18 + 1.4)}" r="1.1" fill="${i % 2 ? '#fff' : '#D8302A'}" stroke="#5A1A10" stroke-width=".3"/>`).join('')}</g>` };
  const P_MENINO = { pele:'xiPeleB', peleC:'#9C6844', esc:'#3E2010', nariz:'#6A3A20', cab:'tigela', corCab:'#120D0A', luzCab:'#5E524C', blusa:'xiBlusaB', blusaEsc:'#5A6A8A', baixo:'short', baixoG:'xiShortB', baixoEsc:'#14285A', corPe:'#3E9AE0', braco:'segura',
    estampa:`<path d="M-10.4 -69.6 L-6 -67.6 M10.4 -69.6 L6 -67.6" stroke="#2E6AD8" stroke-width="1.4"/><circle cx="5.6" cy="-60" r="3.2" fill="#3FA864" stroke="#1E5A2A" stroke-width=".6"/><path d="M4 -59 q1.6 -3 3.4 -2.4 q-.4 2.6 -3.4 2.4Z" fill="#fff"/>`,
    extra:`<g transform="translate(0 -40)"><path d="M-13 -6 L-11 8 H11 L13 -6Z" fill="url(#xiCesto)" stroke="#5E3A12" stroke-width="1.1"/><path d="M-12 0 H12 M-11.4 4 H11.4" stroke="#8A5A22" stroke-width=".9"/><ellipse cx="0" cy="-6" rx="13" ry="2.6" fill="#3A220E" stroke="#C8904A" stroke-width="1.4"/><circle cx="-6.6" cy="-5.6" r="3" fill="#FF7A9E" opacity="0"/></g><circle cx="-7.4" cy="-44.6" r="3.4" fill="#9C6844" stroke="#3E2010" stroke-width=".9"/><circle cx="7.4" cy="-44.6" r="3.4" fill="#9C6844" stroke="#3E2010" stroke-width=".9"/>` };
  const P_FAZ = { pele:'xiPeleC', peleC:'#E6B690', esc:'#7A4A2E', nariz:'#B8704A', cab:'cachos', corCab:'#6E3E1E', luzCab:'#B8784A', chapeu:true, sardas:true, blusa:'xiXad', blusaEsc:'#7A1E1E', baixo:'calca', baixoG:'xiJeans', baixoEsc:'#1E3A6A', pe:'bota', idBraco:'',
    estampa:`<path d="M0 -70 V-44" stroke="#7A1E1E" stroke-width=".9"/><g fill="#fff">${[-64, -58, -52].map(y => `<circle cx="1.6" cy="${y}" r=".7"/>`).join('')}</g><path d="M3.4 -64 h5.6 v4.4 h-5.6Z" fill="none" stroke="#7A1E1E" stroke-width=".8"/>` };
  const P_PESC = { pele:'xiPeleD', peleC:'#8A5434', esc:'#3A1E0E', nariz:'#5A2E16', cab:'curto', corCab:'#120D0A', luzCab:'#5A4E48', blusa:'xiRegata', blusaEsc:'#1E5A3A', baixo:'short', baixoG:'xiShortP', baixoEsc:'#5A2A10', corPe:'#E0458A', braco:'segura' };
  /* bichos e coisas */
  const arara = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M2 8 C4 20 6 32 3 44 C1 36 -2 24 -2 12Z" fill="#2E6AD8" stroke="#0E2A6A" stroke-width="1"/><path d="M1 10 C3 22 4 30 3 40" stroke="#E8C82A" stroke-width="1.2" fill="none"/><path d="M-6 -2 C-8 -14 4 -18 8 -10 C12 -2 10 8 4 12 C-2 14 -6 8 -6 -2Z" fill="#FFC83D" stroke="#9A6A08" stroke-width="1.1"/><path d="M8 -10 C14 -6 14 6 6 12 C10 4 10 -4 8 -10Z" fill="#2E7AE8" stroke="#0E2A6A" stroke-width="1"/><path d="M2 -6 C6 -4 10 2 8 10" stroke="#5EA8FF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="0" cy="-17" r="7" fill="#2E8AE8" stroke="#0E2A6A" stroke-width="1.1"/><path d="M-6 -18 C-6 -13 -3 -11 0 -12 C-1 -15 -3 -18 -6 -18Z" fill="#fff" stroke="#9AA4B8" stroke-width=".5"/><path d="M-6 -20 C-11 -20 -12 -14 -9 -11 C-8 -14 -7 -15 -5 -15Z" fill="#1A1A22"/><circle cx="-1.6" cy="-18" r="1.5" fill="#12121A"/><circle cx="-1.2" cy="-18.4" r=".5" fill="#fff"/><path d="M-4 -24 C0 -26 4 -24 6 -21" stroke="#3E9A3A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-2 16 l-2 4 M3 16 l1 4" stroke="#3A3A44" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const cutia = `<g><ellipse cx="0" cy="12" rx="20" ry="3" fill="#2A1A0A" opacity=".3"/><path d="M-8 4 l-2 8 M-2 6 l-1 6 M10 4 l1 8 M14 2 l2 9" stroke="#3A2414" stroke-width="2.2" stroke-linecap="round"/><path d="M-16 0 C-18 -10 -6 -16 6 -14 C16 -12 20 -4 18 4 C14 10 -10 10 -16 0Z" fill="url(#xiCutia)" stroke="#4E2A10" stroke-width="1.3"/><path d="M-6 -12 C2 -14 10 -12 14 -8" stroke="#F2B878" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/><g stroke="#6E3E1A" stroke-width=".7" opacity=".6"><path d="M-6 -8 l2 3 M0 -10 l2 3 M6 -10 l2 3 M10 -6 l2 3"/></g><path d="M-14 -6 C-20 -10 -26 -6 -26 -1 C-25 2 -20 3 -16 2Z" fill="url(#xiCutia)" stroke="#4E2A10" stroke-width="1.2"/><ellipse cx="-14" cy="-10" rx="2.4" ry="3.6" fill="#C8784A" stroke="#4E2A10" stroke-width=".8"/><circle cx="-21" cy="-4" r="1.6" fill="#12121A"/><circle cx="-20.5" cy="-4.5" r=".5" fill="#fff"/><circle cx="-26" cy="-1" r="1" fill="#3A1A10"/><g id="xi-cutia-sem"><ellipse cx="-28" cy="3" rx="3.4" ry="2.6" fill="#A0683A" stroke="#4E2A10" stroke-width=".7"/></g></g>`;
  const morpho = (x, y, s, i) => `<g class="xi-morpho" transform="translate(${x} ${y}) scale(${s})"><g class="xi-mo-voo"><g style="animation:flutua ${F(1.8 + i * .5)}s ease-in-out infinite alternate"><g class="xi-asas"><path d="M0 0 C-6 -14 -20 -18 -22 -8 C-23 0 -12 3 0 1Z M0 1 C-10 3 -14 10 -10 14 C-6 16 -2 10 0 3Z" fill="url(#xiMorpho)" stroke="#0A1A3A" stroke-width="1.3"/><path d="M0 0 C6 -14 20 -18 22 -8 C23 0 12 3 0 1Z M0 1 C10 3 14 10 10 14 C6 16 2 10 0 3Z" fill="url(#xiMorpho)" stroke="#0A1A3A" stroke-width="1.3"/><g fill="#fff" opacity=".8"><circle cx="-17" cy="-9" r="1"/><circle cx="17" cy="-9" r="1"/></g></g><ellipse cx="0" cy="3" rx="1.4" ry="6" fill="#1A1408"/><path d="M0 -3 l-3 -6 M0 -3 l3 -6" stroke="#1A1408" stroke-width=".7"/></g></g><rect x="-24" y="-20" width="48" height="38" fill="transparent"/></g>`;
  const samambaia = (x, y, h, cor, esc, flip) => { let d = ''; for (let i = 1; i < 9; i++) { const t = i / 9, px = x + (flip ? -1 : 1) * h * .5 * t * t, py = y - h * t, L = 12 * (1 - t * .7); d += `M${F(px)} ${F(py)} l${F(-L)} ${F(-L * .3)} M${F(px)} ${F(py)} l${F(L)} ${F(-L * .4)} `; } return `<path d="M${x} ${y} Q${F(x + (flip ? -1 : 1) * h * .1)} ${F(y - h * .6)} ${F(x + (flip ? -1 : 1) * h * .5)} ${F(y - h)}" stroke="${esc}" stroke-width="2.4" fill="none"/><path d="${d}" stroke="${esc}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="2.6" stroke-linecap="round"/>`; };
  const folhona = (x, y, a, L, g, esc) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C${F(L * .3)} ${F(-L * .22)} ${F(L * .8)} ${F(-L * .2)} ${L} 0 C${F(L * .8)} ${F(L * .2)} ${F(L * .3)} ${F(L * .22)} 0 0Z" fill="url(#${g})" stroke="${esc}" stroke-width="1.5"/><path d="M0 0 H${F(L * .96)}" stroke="${esc}" stroke-width="1.2" opacity=".7"/>${[.25, .45, .65, .82].map(t => `<path d="M${F(L * t)} 0 l${F(L * .1)} ${F(-L * .12)} M${F(L * t)} 0 l${F(L * .1)} ${F(L * .12)}" stroke="${esc}" stroke-width=".8" opacity=".5"/>`).join('')}<path d="M${F(L * .2)} ${F(-L * .08)} C${F(L * .4)} ${F(-L * .16)} ${F(L * .6)} ${F(-L * .15)} ${F(L * .8)} ${F(-L * .08)}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".35"/></g>`;
  const heliconia = (x, y, h, cor, flip) => { const f = flip ? -1 : 1; let br = ''; for (let i = 0; i < 6; i++) { const yy = y - h * .45 - i * h * .085, l = i % 2 ? 1 : -1; br += `<path d="M${x + f * 2} ${F(yy)} l${F(l * 11)} ${F(-3)} l${F(-l * 9)} ${F(-5)}Z" fill="${cor}" stroke="#7A1A10" stroke-width=".9" stroke-linejoin="round"/><path d="M${F(x + f * 2 + l * 8)} ${F(yy - 3.4)} l${F(l * 2)} -.6" stroke="#FFE27A" stroke-width="1.6" stroke-linecap="round"/>`; }
    return `<g class="balanca" style="animation-duration:5s"><path d="M${x} ${y} C${x - 2} ${F(y - h * .4)} ${x + 3} ${F(y - h * .7)} ${x + f * 2} ${F(y - h * .95)}" stroke="#2E5A1E" stroke-width="2.6" fill="none"/>${folhona(x, y - 6, -110 + f * -10, h * .62, 'xiVerdeB', '#1E4A26')}${folhona(x, y - 4, -70 + f * 10, h * .55, 'xiJat', '#14422A')}${br}</g>`; };
  const buriti = (x, y, h) => { let fol = ''; for (let i = 0; i < 9; i++) { const a = -160 + i * 17.5, L = R(30, 40), r = a * Math.PI / 180, ex = x + Math.cos(r) * L, ey = y - h + Math.sin(r) * L * .8; let raios = ''; for (let k = -3; k <= 3; k++) { const rr = r + k * .1; raios += `M${x} ${y - h} L${F(x + Math.cos(rr) * L * 1.08)} ${F(y - h + Math.sin(rr) * L * .86)} `; } fol += `<path d="${raios}" stroke="#2E6A2A" stroke-width="2.6" stroke-linecap="round"/><path d="${raios}" stroke="#7ACB5A" stroke-width="1.2" stroke-linecap="round"/>`; }
    return `<g><path d="M${x - 3} ${y} L${x - 2} ${y - h} H${x + 2} L${x + 3} ${y}Z" fill="url(#xiTr1)" stroke="#5E5648" stroke-width="1"/>${Array.from({ length:Math.round(h / 8) }, (_, k) => `<path d="M${x - 2.6} ${y - 6 - k * 8} h5.2" stroke="#7A7060" stroke-width=".8"/>`).join('')}${fol}<g fill="#8A3E1E" stroke="#4A1E0A" stroke-width=".5">${Array.from({ length:7 }, (_, k) => `<circle cx="${F(x - 6 + k * 2)}" cy="${F(y - h + 8 + (k % 3) * 3)}" r="2.2"/>`).join('')}</g></g>`; };
  const casaXingu = (x, y, w, h, id) => {
    const L = x - w / 2, D = x + w / 2, cid = `${id}-c`;
    const cont = `M${L} ${y} C${L - 5} ${F(y - h * .72)} ${F(L + w * .08)} ${F(y - h * .99)} ${F(x - w * .24)} ${y - h} L${F(x + w * .24)} ${y - h} C${F(D - w * .08)} ${F(y - h * .99)} ${D + 5} ${F(y - h * .72)} ${D} ${y}Z`;
    let faixas = '', fios = '', luz = '';
    const N = 9, bh = h / N + 3;
    for (let r = 0; r < N; r++) { const yy = y - h - 2 + r * (h / N); let d = `M${L - 12} ${F(yy)} H${D + 12} V${F(yy + bh)}`; for (let xx = D + 12; xx > L - 12; xx -= 7) d += ` Q${F(xx - 3.5)} ${F(yy + bh + R(2.5, 4.5))} ${F(xx - 7)} ${F(yy + bh)}`; faixas += `<path d="${d}Z" fill="${r % 2 ? '#D8AE5E' : '#E6C474'}" stroke="#9A6E2A" stroke-width=".9"/>`;
      for (let xx = L - 8; xx < D + 8; xx += R(3, 5.5)) fios += `M${F(xx)} ${F(yy + R(1, 4))} l${F(R(-.8, .8))} ${F(bh - R(1, 4))} `;
      for (let k = 0; k < 6; k++) { const xx = R(L, D); luz += `M${F(xx)} ${F(yy + 2)} l${F(R(-.5, .5))} ${F(bh * .7)} `; } }
    let franja = ''; for (let xx = L - 4; xx < D + 4; xx += R(2.4, 4)) franja += `M${F(xx)} ${F(y - 6)} l${F(R(-1.4, 1.4))} ${F(R(6, 10))} `;
    const dw = w * .055, dh = h * .3;
    return `<g ${id ? `id="${id}"` : ''}><clipPath id="${cid}"><path d="${cont}"/></clipPath>
      <ellipse cx="${x}" cy="${y + 3}" rx="${F(w * .58)}" ry="${F(h * .07 + 4)}" fill="#4A2E10" opacity=".32"/>
      <path d="${cont}" fill="#C89A4E" stroke="#6E4A1A" stroke-width="1.8"/>
      <g clip-path="url(#${cid})">${faixas}<path d="${fios}" stroke="#9A6A26" stroke-width=".9" fill="none" opacity=".55"/><path d="${luz}" stroke="#FFF2C8" stroke-width="1" fill="none" opacity=".55"/>
        <rect x="${L - 10}" y="${y - h - 6}" width="${w + 20}" height="${h + 10}" fill="url(#xiCasaLuz)"/></g>
      <path d="${franja}" stroke="#B8883C" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="${franja}" stroke="#6E4A1A" stroke-width=".5" fill="none" opacity=".6"/>
      <path d="M${F(x - w * .27)} ${F(y - h + 3)} Q${x} ${F(y - h - 7)} ${F(x + w * .27)} ${F(y - h + 3)}" stroke="#6E4A1A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${F(x - w * .27)} ${F(y - h + 2)} Q${x} ${F(y - h - 8)} ${F(x + w * .27)} ${F(y - h + 2)}" stroke="#A87A32" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g stroke="#8A5E22" stroke-width="1.2" stroke-linecap="round">${Array.from({ length:9 }, (_, k) => { const xx = x - w * .24 + k * w * .06; return `<path d="M${F(xx)} ${F(y - h - 2 - Math.sin(k / 8 * Math.PI) * 4)} l${F(R(-2, 2))} -5"/>`; }).join('')}</g>
      <path d="M${F(x - dw - 3)} ${y} V${F(y - dh)} Q${x} ${F(y - dh - 9)} ${F(x + dw + 3)} ${F(y - dh)} V${y}Z" fill="#7A5420"/>
      <path d="M${F(x - dw)} ${y} V${F(y - dh + 2)} Q${x} ${F(y - dh - 5)} ${F(x + dw)} ${F(y - dh + 2)} V${y}Z" fill="url(#xiPorta)"/>
      <path d="M${F(x - dw - 1.5)} ${y} V${F(y - dh)} M${F(x + dw + 1.5)} ${y} V${F(y - dh)}" stroke="#5A3A16" stroke-width="2.4"/></g>`;
  };
  const rede = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 22; return `<g><path d="M${x1} ${y1 + 40} V${y1 - 26} M${x2} ${y2 + 40} V${y2 - 26}" stroke="#4E3018" stroke-width="5" stroke-linecap="round"/><path d="M${x1 - 1} ${y1 + 40} V${y1 - 26}" stroke="#A87A4A" stroke-width="1.6"/><path d="M${x1} ${y1} L${x1 + 10} ${y1 + 8} M${x2} ${y2} L${x2 - 10} ${y2 + 8}" stroke="#E8D8B0" stroke-width="1.2"/>
      <path d="M${x1 + 10} ${y1 + 8} Q${mx} ${my + 6} ${x2 - 10} ${y2 + 8} Q${mx} ${my - 8} ${x1 + 10} ${y1 + 8}Z" fill="#E5392C" stroke="#7A1A10" stroke-width="1.1"/>
      ${['#FFC83D', '#2E7AD8', '#FFFDF2'].map((c, k) => `<path d="M${x1 + 12} ${y1 + 9 + k * 1.6} Q${mx} ${my - 2 + k * 3} ${x2 - 12} ${y2 + 9 + k * 1.6}" stroke="${c}" stroke-width="1.4" fill="none"/>`).join('')}
      <path d="M${x1 + 12} ${y1 + 10} Q${mx} ${my + 8} ${x2 - 12} ${y2 + 10}" stroke="#FFC83D" stroke-width="1" fill="none" stroke-dasharray="1.6 2"/></g>`; };
  const pote = (x, y, k, cor) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="1" rx="13" ry="3" fill="#3A2410" opacity=".3"/><path d="M-7 -22 C-14 -18 -14 -2 -8 0 H8 C14 -2 14 -18 7 -22Z" fill="${cor || 'url(#xiBarroPote)'}" stroke="#5A2A10" stroke-width="1.1"/><ellipse cx="0" cy="-22" rx="7.4" ry="2.2" fill="#3A1A08" stroke="#5A2A10" stroke-width="1"/><path d="M-9 -12 H9" stroke="#FFE2B8" stroke-width="1.2" opacity=".6" stroke-dasharray="2 1.6"/><path d="M-8 -18 C-10 -12 -9 -6 -6 -3" stroke="#fff" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/></g>`;
  const cipo = (x1, y1, x2, y2, f) => { const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + (f || 26); let fl = ''; for (let k = 1; k < 6; k++) { const t = k / 6, xx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, yy = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + 10) + t * t * y2; fl += `<ellipse cx="${F(xx)}" cy="${F(yy + 2)}" rx="3" ry="1.6" transform="rotate(${F(R(-50, 50))} ${F(xx)} ${F(yy + 2)})" fill="#5EAA4A" stroke="#1E4A1E" stroke-width=".5"/>`; } return `<path d="M${x1} ${y1} Q${F(mx)} ${F(my + 10)} ${x2} ${y2}" stroke="#3A5A1E" stroke-width="1.8" fill="none"/>${fl}<path d="M${F(mx)} ${F(my)} q-2 8 1 16" stroke="#3A5A1E" stroke-width="1.2" fill="none"/>`; };
  const subBosque = (x0, x1, y) => { let s2 = ''; for (let x = x0; x < x1; x += R(16, 26)) { const r = R(10, 17), c = ['#3E7A3A', '#4E8A3A', '#2E6A3E', '#5E9A4A'][Math.floor(R(0, 4))]; s2 += `<path d="${copa(x, y - r * .5, r, r * .7, 9, .35)}" fill="${c}" stroke="#1E4A22" stroke-width=".9"/><path d="M${F(x - r * .5)} ${F(y - r * .8)} q${F(r * .4)} -3 ${F(r * .8)} -1" stroke="#B8E89A" stroke-width="1" fill="none" opacity=".6"/>`; if (R(0, 1) < .35) s2 += `<circle cx="${F(x + R(-6, 6))}" cy="${F(y - r)}" r="1.8" fill="${R(0, 1) < .5 ? '#FFFFFF' : '#FF7AB8'}" stroke="#7A2A4A" stroke-width=".4"/>`; } for (let k = 0; k < 3; k++) s2 += folhona(R(x0, x1), y, R(-150, -30), R(20, 30), 'xiVerdeB', '#1E4A26'); return s2; };
  const arvForma = (x, y, h, rx, tipo, g, esc, luz, somb) => {
    if (tipo === 'coluna') return `<g>${tronco(x, y, y - h * .5, Math.max(5, rx * .22), 'xiTr2', '#3A2414')}${copaRica(x, y - h * .74, rx * .62, rx * 1.15, g, esc, luz, somb, 12)}</g>`;
    if (tipo === 'guarda') return `<g>${tronco(x, y, y - h * .62, Math.max(6, rx * .16), 'xiTr1', '#5E5648')}${galho(`M${x} ${F(y - h * .6)} C${F(x - rx * .3)} ${F(y - h * .74)} ${F(x - rx * .6)} ${F(y - h * .78)} ${F(x - rx * .8)} ${F(y - h * .82)} M${x} ${F(y - h * .6)} C${F(x + rx * .3)} ${F(y - h * .74)} ${F(x + rx * .6)} ${F(y - h * .78)} ${F(x + rx * .8)} ${F(y - h * .82)}`, 3, '#A89E8E', '#5E5648')}${copaRica(x, y - h * .88, rx * 1.3, rx * .4, g, esc, luz, somb, 16)}</g>`;
    if (tipo === 'camadas') return `<g>${tronco(x, y, y - h * .95, Math.max(5, rx * .16), 'xiTr3', '#2E2620')}${galho(`M${x} ${F(y - h * .5)} q${F(-rx * .4)} -6 ${F(-rx * .7)} -4 M${x} ${F(y - h * .7)} q${F(rx * .3)} -6 ${F(rx * .55)} -4`, 2.4, '#6E645A', '#2E2620')}${copaRica(x - rx * .3, y - h * .52, rx * .62, rx * .34, g, esc, luz, somb, 10)}${copaRica(x + rx * .36, y - h * .58, rx * .56, rx * .32, g, esc, luz, somb, 10)}${copaRica(x - rx * .08, y - h * .76, rx * .66, rx * .34, g, esc, luz, somb, 11)}${copaRica(x + rx * .1, y - h * .95, rx * .42, rx * .3, g, esc, luz, somb, 9)}</g>`;
    return arvNova(x, y, h, rx, g, esc, luz, somb);
  };
  const casaPalha = (x, y, w, h, id) => {
    let pal = ''; for (let r = 0; r < 9; r++) { const yy = y - h + 10 + r * (h - 14) / 8, f = Math.sqrt(Math.max(0, 1 - Math.pow((yy - y) / h, 2))), lx = w / 2 * f; for (let xx = -lx + 4; xx < lx - 2; xx += 5.4) pal += `M${F(x + xx)} ${F(yy - 1)} l${F(R(-.6, .6))} ${F(R(6, 9))} `; }
    return `<g ${id ? `id="${id}"` : ''}><ellipse cx="${x}" cy="${y + 2}" rx="${F(w * .56)}" ry="6" fill="#4A2E10" opacity=".3"/>
      <path d="M${x - w / 2} ${y} C${x - w / 2} ${F(y - h * .62)} ${F(x - w * .3)} ${y - h} ${x} ${y - h} C${F(x + w * .3)} ${y - h} ${x + w / 2} ${F(y - h * .62)} ${x + w / 2} ${y}Z" fill="url(#xiPalhaCasa)" stroke="#6E4A1A" stroke-width="1.6"/>
      <path d="${pal}" stroke="#A87A32" stroke-width="1.1" fill="none" opacity=".7"/>
      <path d="M${F(x - w * .4)} ${F(y - h * .5)} C${F(x - w * .34)} ${F(y - h * .8)} ${F(x - w * .2)} ${F(y - h * .95)} ${F(x - w * .04)} ${F(y - h * .98)}" stroke="#FFF0C0" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>
      <path d="M${x + w / 2} ${y} C${x + w / 2} ${F(y - h * .62)} ${F(x + w * .3)} ${y - h} ${x} ${y - h} C${F(x + w * .2)} ${F(y - h * .9)} ${F(x + w * .4)} ${F(y - h * .5)} ${F(x + w * .44)} ${y}Z" fill="#6E4A1A" opacity=".22"/>
      ${Array.from({ length:5 }, (_, r) => { const yy = F(y - h + 14 + r * (h - 18) / 4.4); const f = Math.sqrt(Math.max(0, 1 - Math.pow((yy - y) / h, 2))); return `<path d="M${F(x - w / 2 * f + 3)} ${yy} Q${x} ${F(+yy + 6)} ${F(x + w / 2 * f - 3)} ${yy}" stroke="#7A5420" stroke-width="1.3" fill="none" opacity=".5"/>`; }).join('')}
      <path d="M${F(x - w * .09)} ${y} V${F(y - h * .34)} Q${x} ${F(y - h * .42)} ${F(x + w * .09)} ${F(y - h * .34)} V${y}Z" fill="#2A1A0A" stroke="#5E3A12" stroke-width="1.4"/>
      <path d="M${F(x - w * .09)} ${y} V${F(y - h * .34)} M${F(x + w * .09)} ${y} V${F(y - h * .34)}" stroke="#8A5A22" stroke-width="2.2"/>
      <path d="M${x - w / 2 + 2} ${y - 1} H${x + w / 2 - 2}" stroke="#5E3A12" stroke-width="2"/></g>`;
  };
  /* ---------- geometria do riacho da nascente (tela 3) ---------- */
  const RIO = [[[148, 318], [214, 324], [262, 350], [330, 368]], [[330, 368], [420, 390], [480, 408], [560, 418]], [[560, 418], [650, 428], [730, 436], [816, 440]]];
  const bz = (p, t) => { const u = 1 - t; return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]]; };
  const rioPt = t => { const k = Math.min(2, Math.floor(t * 3)), tt = t * 3 - k; return bz(RIO[k], tt); };
  const rioPoly = (w0, w1, j) => { const L = [], Rr = []; for (let i = 0; i <= 60; i++) { const t = i / 60, [x, y] = rioPt(t), [x2, y2] = rioPt(Math.min(1, t + .01)), [x0, y0] = rioPt(Math.max(0, t - .01)), dx = x2 - x0, dy = y2 - y0, l = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * t + (j ? R(-j, j) : 0); L.push([x - dy / l * w * .55, y + dx / l * w * .45]); Rr.push([x + dy / l * w * .55, y - dx / l * w * .45]); } return 'M' + L.map(p => F(p[0]) + ' ' + F(p[1])).join(' L') + ' L' + Rr.reverse().map(p => F(p[0]) + ' ' + F(p[1])).join(' L') + 'Z'; };
  const RIOD = rioPoly(16, 46), RIOW = rioPoly(30, 66);
  const ZONAS = [{ x:118, y:290, rx:84, ry:22 }, { x:420, y:352, rx:100, ry:19 }, { x:255, y:428, rx:112, ry:30 }, { x:590, y:476, rx:140, ry:20 }];
  const broto = (x, y, s) => `<g transform="translate(${F(x)} ${F(y)}) scale(${F(s)})"><path d="M0 0 C0 -4 1 -7 0 -10" stroke="#3E7A1E" stroke-width="1.6" fill="none"/><path d="M0 -9 C-4 -13 -9 -11 -9 -8 C-6 -6 -2 -7 0 -9Z M0 -9 C4 -13 9 -11 9 -8 C6 -6 2 -7 0 -9Z" fill="#8ED85A" stroke="#2E6A1A" stroke-width=".8"/></g>`;
  const feijaoPorco = (x, y, s) => `<g transform="translate(${F(x)} ${F(y)}) scale(${F(s)})"><path d="M0 0 C-1 -8 1 -14 0 -20" stroke="#2E6A1E" stroke-width="2" fill="none"/>${[[-1, -18, -40], [1, -20, 30], [0, -24, -90], [-1, -10, -150], [1, -12, -30]].map(([l, y2, a]) => `<g transform="translate(0 ${y2}) rotate(${a})"><path d="M0 0 C3 -5 12 -6 15 0 C12 6 3 5 0 0Z" fill="url(#xiFeijao)" stroke="#1E5A1A" stroke-width=".9"/><path d="M1 0 H13" stroke="#BEEA9A" stroke-width=".7"/></g>`).join('')}</g>`;
  const guandu = (x, y, h) => { let fol = '', fl = ''; for (let i = 0; i < 9; i++) { const yy = y - h * .25 - R(0, h * .7), xx = x + R(-h * .22, h * .22); fol += `<ellipse cx="${F(xx)}" cy="${F(yy)}" rx="5.4" ry="2.2" transform="rotate(${F(R(-50, 50))} ${F(xx)} ${F(yy)})" fill="${i % 2 ? '#6EB84A' : '#4E9A3A'}" stroke="#24561A" stroke-width=".6"/>`; if (i % 2) fl += `<circle cx="${F(xx + 3)}" cy="${F(yy - 3)}" r="2.4" fill="#FFD23A" stroke="#C8740A" stroke-width=".5"/>`; } return `<path d="M${x} ${y} C${x - 2} ${F(y - h * .4)} ${x + 3} ${F(y - h * .7)} ${x} ${y - h} M${x} ${F(y - h * .4)} l${F(-h * .2)} ${F(-h * .25)} M${x} ${F(y - h * .55)} l${F(h * .2)} ${F(-h * .25)}" stroke="#4E3A1E" stroke-width="1.6" fill="none"/>${fol}${fl}`; };
  const arvNova = (x, y, h, rx, g, esc, luz, somb) => `<g>${tronco(x, y, y - h * .6, Math.max(6, rx * .18), 'xiTr2', '#3A2414')}${copaRica(x, y - h * .78, rx, rx * .7, g, esc, luz, somb, 11)}</g>`;
  const toco = (x, y, w) => `<g><ellipse cx="${x}" cy="${y + 2}" rx="${w * .9}" ry="3" fill="#3A1A0A" opacity=".3"/><path d="M${x - w / 2} ${y} V${y - w * .5} H${x + w / 2} V${y}Z" fill="url(#xiTr2)" stroke="#3A2414" stroke-width="1.2"/><ellipse cx="${x}" cy="${y - w * .5}" rx="${w / 2}" ry="${F(w * .18)}" fill="#E8C898" stroke="#6E4A2A" stroke-width="1"/><ellipse cx="${x}" cy="${y - w * .5}" rx="${F(w * .3)}" ry="${F(w * .1)}" fill="none" stroke="#B8905A" stroke-width=".7"/><circle cx="${x}" cy="${y - w * .5}" r="1" fill="#8A5A2A"/></g>`;
  const boi = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="10" rx="16" ry="2" fill="#4A5A2A" opacity=".3"/><path d="M-9 2 v8 M-5 3 v7 M7 3 v7 M11 2 v8" stroke="#6E6A66" stroke-width="2.2" stroke-linecap="round"/><path d="M-13 -2 C-13 -8 -6 -9 4 -9 C8 -12 12 -12 13 -8 C14 -4 14 2 10 4 C2 6 -8 6 -12 3Z" fill="#F4F0EA" stroke="#7A746E" stroke-width="1"/><path d="M12 -8 C16 -9 19 -6 19 -2 C19 1 16 2 14 0Z" fill="#F4F0EA" stroke="#7A746E" stroke-width="1"/><path d="M14 -9 l-1 -3 M17 -8 l2 -3" stroke="#9A8A6A" stroke-width="1.2"/><circle cx="16.4" cy="-5" r=".8" fill="#12121A"/><path d="M-13 -2 C-16 0 -16 4 -15 6" stroke="#7A746E" stroke-width="1" fill="none"/></g>`;
  /* ---------- defs ---------- */
  const lg = (i, a, b, x2, y2) => `<linearGradient id="${i}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 === undefined ? 1 : y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const rg = (i, a, b, c, cx, cy) => `<radialGradient id="${i}" cx="${cx || .38}" cy="${cy || .32}" r=".75"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
  const defs = `<defs>
    ${lg('xiCeu0', '#7CC6EE', '#EAF6DE')}${lg('xiCeu1', '#62B8EE', '#FFF0D6')}${lg('xiCeu2', '#8ACBEB', '#FFE6C2')}
    ${lg('xiLonge', '#B4D6C4', '#8CBCA6')}${lg('xiMeio', '#6FA884', '#447A5A')}${lg('xiChao0', '#9A7444', '#5A3C20')}${lg('xiNevoa', '#F4FFF0', '#F4FFF0')}
    <linearGradient id="xiRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8D8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF8D8" stop-opacity="0"/></linearGradient>
    <linearGradient id="xiBruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF6E6" stop-opacity="0"/><stop offset="1" stop-color="#EAF6E6" stop-opacity=".75"/></linearGradient>
    ${rg('xiJat', '#5EAA62', '#2E7A44', '#1A5232')}${rg('xiPeq', '#C8E070', '#8CB84A', '#5A8A2E')}${rg('xiBar', '#9EC0A0', '#6A9A7E', '#3E6A56')}${rg('xiIpe', '#FFF08A', '#FFD23A', '#E8A01A')}${rg('xiIpeR', '#F6B8E0', '#D07AC0', '#9A4A9A')}${rg('xiIng', '#E8A070', '#C86A44', '#8A3E2A')}${rg('xiVerdeB', '#8ED07A', '#4E9A4E', '#2E6A3A')}
    ${lg('xiTr1', '#C8C0B0', '#8A8070', 1, 0)}${lg('xiTr2', '#9A6E48', '#5A3A22', 1, 0)}${lg('xiTr3', '#7A7068', '#463E38', 1, 0)}
    ${lg('xiJatF', '#8A5030', '#3E1E0A', 1, 1)}${rg('xiPeqF', '#C8E88A', '#7EB040', '#4E7A22')}${rg('xiBarF', '#C8966A', '#9A6838', '#5E3A1A')}${lg('xiIpeF', '#B8A880', '#7A6A44', 1, 0)}${rg('xiPeqP', '#FFE27A', '#FFB02A', '#E0800A')}
    ${lg('xiCesto', '#E8C07A', '#A8763A')}
    <pattern id="xiTrama" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L10 0 M-5 4 L5 -4 M5 12 L15 4" stroke="#7A4A18" stroke-width="1" opacity=".5"/><path d="M0 0 L10 8 M-5 4 L5 12 M5 -4 L15 4" stroke="#FFE6B0" stroke-width=".7" opacity=".45"/></pattern>
    ${rg('xiPeleA', '#CC9268', '#AE744C', '#94603C', .4, .35)}${rg('xiPeleB', '#B8805A', '#9C6844', '#80522F', .4, .35)}${rg('xiPeleC', '#F8D4B8', '#E6B690', '#D49E78', .4, .35)}${rg('xiPeleD', '#A06A48', '#8A5434', '#6E4024', .4, .35)}${rg('xiPeleE', '#D8A47A', '#C08A60', '#A07048', .4, .35)}
    ${lg('xiBlusaA', '#FF9A6A', '#E0582E')}${lg('xiSaiaA', '#36B8A8', '#1A7A70')}${lg('xiBlusaB', '#FFFFFF', '#D8E2F0')}${lg('xiShortB', '#4A6AB0', '#22407E')}${lg('xiJeans', '#5A86C8', '#2E5290')}${lg('xiPalha', '#F6DE90', '#CCA450')}${lg('xiRegata', '#5ED08A', '#2E8A5A')}${lg('xiShortP', '#E89A4A', '#B8642A')}
    <pattern id="xiXad" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#E04848"/><rect width="4" height="8" fill="#B82E2E" opacity=".7"/><rect width="8" height="3" y="2.5" fill="#FFF0E6" opacity=".55"/><rect x="1.4" width="1.2" height="8" fill="#FFF0E6" opacity=".5"/></pattern>
    ${lg('xiCutia', '#D8925A', '#9A5A2A')}${lg('xiMorpho', '#5ED8FF', '#1E5AD8', 1, 1)}
    ${lg('xiRio', '#7EC8D8', '#3A92B0')}${lg('xiAreia', '#FBF0D6', '#E6CFA0')}${lg('xiPraca', '#E8BC84', '#C88E54')}${lg('xiPalhaCasa', '#EACB7E', '#B8883C')}${lg('xiLonge1', '#A6CCBA', '#86B4A0')}
    ${lg('xiRio2', '#2A7096', '#8AD2DE')}${rg('xiPatio', '#F2D49C', '#E2B87A', '#CC9A5E', .5, .45)}${rg('xiBarroPote', '#E08A5A', '#B85A2E', '#7A3416', .35, .3)}${lg('xiPortaL', '#000', '#000')}<linearGradient id="xiCasaLuz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF4D0" stop-opacity=".35"/><stop offset=".45" stop-color="#FFF4D0" stop-opacity="0"/><stop offset=".75" stop-color="#5A3A10" stop-opacity=".08"/><stop offset="1" stop-color="#4A2A08" stop-opacity=".38"/></linearGradient><linearGradient id="xiPorta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120A04"/><stop offset="1" stop-color="#3A2410"/></linearGradient><clipPath id="xiRioClip"><rect x="0" y="205" width="800" height="62"/></clipPath>${lg('xiBacia', '#F4F8FC', '#9AA8BA')}${lg('xiBaciaIn', '#8A98AA', '#D8E2EE')}${lg('xiSaco', '#E2D2A8', '#B8A270')}${lg('xiBalde', '#4EA8F0', '#1E66B8')}${lg('xiCanoa', '#9A6A42', '#4E2E16')}${lg('xiAlum', '#E6EEF6', '#8E9AAA')}${lg('xiTraca', '#5E6A44', '#2E3620')}
    ${rg('xiAreiaB', '#F2DCA8', '#DEC084', '#C8A468', .5, .5)}${lg('xiPasto', '#D6D88A', '#A8B45A')}${lg('xiPasto2', '#C8CE7A', '#9AA84E')}${lg('xiTerra', '#C87A4A', '#8E4A2A')}${lg('xiBarro', '#DDB884', '#AE8452')}${lg('xiVerdeChao', '#9AD06E', '#4E8A3A')}${lg('xiLimpo', '#8ADAEC', '#2E88B8')}${lg('xiSoja', '#B8D06A', '#8AAA44')}${rg('xiFeijao', '#9AE07A', '#5EAA4A', '#2E7A2E')}${rg('xiBroto', '#9ED87A', '#6AB04E', '#4E8A3A', .5, .5)}${rg('xiSolG', '#FFF8D0', '#FFD84A', '#F0A01E', .45, .45)}
    ${lg('xiEspaco', '#060C24', '#1A2A5A')}${rg('xiMata', '#3E8A4A', '#2A6A3A', '#1A4A2A', .5, .5)}
    <radialGradient id="xiVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#0A1A10" stop-opacity="0"/><stop offset="1" stop-color="#0A1A10" stop-opacity=".34"/></radialGradient>
    <filter id="xiGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
    <clipPath id="xiMapaC"><rect x="150" y="70" width="500" height="320" rx="26"/></clipPath>
  </defs>`;
  /* ================= TELA 1: a floresta (coleta) ================= */
  const FRUTOS = [{ t:'jatoba', x:70, y:184, chao:436 }, { t:'jatoba', x:168, y:188, chao:440 }, { t:'pequi', x:290, y:202, chao:438 }, { t:'pequi', x:352, y:206, chao:436 }, { t:'baru', x:478, y:188, chao:440 }, { t:'baru', x:552, y:192, chao:438 }, { t:'ipe', x:654, y:166 }, { t:'ipe', x:744, y:170 }];
  const CESTO0 = { x:410, y:452 };
  const tela0 = (() => {
    let s = `<rect width="800" height="380" fill="url(#xiCeu0)"/>`;
    s += `<g opacity=".9">${Array.from({ length:15 }, (_, i) => { const x = i * 58 + R(-10, 10), y = R(118, 160), r = R(40, 62); return `<path d="${copa(x, y, r, r * .62, 11, .3)}" fill="url(#xiLonge)" stroke="#9CC4B0" stroke-width="1"/>`; }).join('')}</g>`;
    s += `<g stroke="#B6D0C0" stroke-width="5" opacity=".9">${Array.from({ length:16 }, (_, i) => { const x = 20 + i * 50 + R(-12, 12); return `<path d="M${F(x)} 160 L${F(x + R(-4, 4))} 372"/>`; }).join('')}</g>`;
    s += `<g>${Array.from({ length:10 }, (_, i) => { const x = 40 + i * 82 + R(-16, 16), y = R(196, 236), r = R(38, 56), cor = ['#6FA884', '#86A86A', '#5E9A8A', '#9AA870', '#6E9A6A'][i % 5]; return `<path d="${copa(x, y, r, r * .6, 11, .3)}" fill="${cor}" stroke="#3E6E50" stroke-width="1.2" opacity=".85"/><path d="${copa(x - r * .25, y - r * .2, r * .45, r * .25, 8, .3)}" fill="#E6F4DA" opacity=".25"/>`; }).join('')}</g>`;
    s += `<g stroke="#7E9A82" stroke-width="7">${[210, 410, 600, 775].map(x => `<path d="M${x} 230 L${x + 2} 380"/>`).join('')}</g>`;
    s += `<rect y="240" width="800" height="150" fill="url(#xiBruma)"/>`;
    s += `<g id="xi-raios">${[[560, 60], [640, 40], [720, 70], [470, 36]].map(([x, w]) => `<path d="M${x} 0 L${x + w} 0 L${x - 170 + w * 1.6} 470 L${x - 230} 470Z" fill="url(#xiRaio)" opacity=".5"/>`).join('')}</g>`;
    s += `<path d="M0 372 C120 362 260 376 400 368 C540 360 680 374 800 366 V500 H0Z" fill="url(#xiChao0)"/>`;
    s += `<g>${Array.from({ length:26 }, (_, i) => samambaia(R(0, 800), R(372, 392), R(18, 30), i % 2 ? '#6EAA5A' : '#5E9A4E', '#2E5A2A', i % 3 === 0)).join('')}</g>`;
    s += heliconia(448, 392, 56, '#E5392C', false) + heliconia(36, 392, 50, '#FF8A2A', true) + heliconia(768, 394, 48, '#E5392C', true);
    s += `<g fill="#F4E6D0" stroke="#8A6A4A" stroke-width=".7">${[[104, 434], [111, 437], [136, 433]].map(([x, y], i) => `<path d="M${x - 4} ${y} q4 -6 8 0Z"/><path d="M${x} ${y} v4" stroke="#C8B090" stroke-width="1.4"/>`).join('')}</g>`;
    s += `<path d="M0 470 C200 462 600 478 800 466 V500 H0Z" fill="#3E2A14" opacity=".25"/>`;
    s += `<g>${Array.from({ length:120 }, () => { const x = R(0, 800), y = R(392, 498), c = ['#C8783A', '#E0A44A', '#A0582A', '#8A6A3A', '#D8B060', '#7A4A22'][Math.floor(R(0, 6))]; return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(R(3, 6))}" ry="${F(R(1.2, 2.4))}" transform="rotate(${F(R(-40, 40))} ${F(x)} ${F(y)})" fill="${c}" opacity=".8"/>`; }).join('')}</g>`;
    /* árvores principais */
    s += `<g id="xi-jatoba">${tronco(118, 438, 160, 30, 'xiTr1', '#5E5648', 4)}${galho('M120 210 C100 190 80 180 58 176 M124 196 C150 178 170 172 196 170', 6, '#A89E8E', '#5E5648')}${copaRica(120, 116, 118, 76, 'xiJat', '#14422A', '#A8E0A0', '#1E5A36', 18)}</g>`;
    s += `<g id="xi-pequizeiro">${tronco(318, 432, 196, 22, 'xiTr3', '#2E2620', -10)}${galho('M312 236 C296 222 282 216 268 214 M314 226 C330 212 344 208 362 210', 5, '#6E645A', '#2E2620')}${copaRica(320, 160, 82, 56, 'xiPeq', '#3E5A1A', '#F4FFB0', '#6A8A2E', 14)}</g>`;
    s += `<g id="xi-baru">${tronco(512, 434, 176, 24, 'xiTr2', '#3A2414', 6)}${galho('M516 214 C494 200 482 196 466 194 M518 206 C538 196 552 194 570 196', 5, '#8A5E3A', '#3A2414')}${copaRica(515, 138, 92, 62, 'xiBar', '#24463A', '#E0F4E0', '#3A6A56', 15)}</g>`;
    s += `<g id="xi-ipe" class="toque">${tronco(700, 436, 150, 24, 'xiTr3', '#2E2620', -6)}${galho('M698 190 C670 160 650 150 630 142 M700 176 C720 150 746 138 770 132 M699 168 C696 140 700 120 706 96', 6, '#6E645A', '#2E2620')}${copaRica(700, 106, 98, 70, 'xiIpe', '#9A6A08', '#FFFBD0', '#E0A01A', 18)}<g>${Array.from({ length:36 }, () => { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)), x = 700 + Math.cos(a) * 90 * r, y = 106 + Math.sin(a) * 62 * r; return `<path d="M${F(x)} ${F(y)} l-2.4 -4 q2.4 -2 4.8 0Z" fill="#FFE45A" stroke="#C8800A" stroke-width=".6"/>`; }).join('')}</g></g>`;
    s += `<g id="xi-araras" class="toque"><g id="xi-arara-a">${arara(186, 64, 1.1, false)}</g><g id="xi-arara-b">${arara(216, 70, 1.1, true)}</g><rect x="166" y="30" width="72" height="86" fill="transparent"/></g>`;
    /* frutos */
    s += `<g id="xi-frutos">${FRUTOS.map((f, i) => `<g class="xi-fruto toque" data-i="${i}" transform="translate(${f.x} ${f.y})"><g class="xi-fr-in" style="transform-box:fill-box;transform-origin:50% 0%">${FRUTO[f.t]}</g><g class="xi-fr-hint">${brilhoHotspot(12, 2)}</g><circle cx="0" cy="18" r="22" fill="transparent"/></g>`).join('')}</g>`;
    s += `<g id="xi-fig-jatoba" class="toque" data-fig="jatoba"><svg x="160" y="440" width="44" height="37" viewBox="0 0 120 100"><use href="#f-jatoba"/></svg>${brilhoHotspot(202, 444)}</g>`;
    s += `<g id="xi-cutia" class="toque"><g id="xi-cutia-pos" transform="translate(556 452)"><g transform="scale(1.3)">${cutia}</g></g><rect x="516" y="426" width="70" height="44" fill="transparent"/></g>`;
    s += cesto(CESTO0.x, CESTO0.y, 1, 'xi-cesto0-in', false);
    s += pessoa(244, 484, 1.5, Object.assign({ braco:'aponta', idBraco:'xi-braco-col' }, P_COLETORA), 'xi-coletora');
    s += pessoa(614, 486, 1.2, P_MENINO, 'xi-menino');
    s += `<g id="xi-morphos" class="toque">${morpho(560, 300, .9, 0)}${morpho(190, 290, .75, 1)}</g>`;
    s += `<g>${folhona(800, 470, -150, 110, 'xiVerdeB', '#1E4A26')}${folhona(800, 430, -170, 90, 'xiJat', '#14422A')}${folhona(800, 500, -125, 96, 'xiVerdeB', '#1E4A26')}${samambaia(770, 500, 60, '#5EAA4E', '#1E4A1E', true)}</g>`;
    return s;
  })();
  /* ================= TELA 2: a aldeia (muvuca) ================= */
  const BACIA = { x:420, y:398 };
  const FONTES = { arv:{ x:165, y:452 }, rap:{ x:622, y:452 }, areia:{ x:748, y:466 } };
  const sementesSetor = (tipos, a0, a1, n) => Array.from({ length:n }, (_, j) => { const a = R(a0, a1) * Math.PI / 180, r = R(20, 100); return `<g transform="translate(${F(Math.cos(a) * r)} ${F(Math.sin(a) * r)}) scale(1.6 4)">${SEM[tipos[j % tipos.length]]}</g>`; }).join('');
  const tela1 = (() => {
    let s = `<rect width="800" height="300" fill="url(#xiCeu1)"/>`;
    s += `<g class="deriva"><use href="#nuvem" x="90" y="40" width="110" height="52" style="color:#fff" opacity=".92"/><use href="#nuvem" x="560" y="24" width="84" height="40" style="color:#fff" opacity=".85"/></g>`;
    s += `<g stroke="#4E5A7A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"><path d="M360 70 q6 -6 12 0 q6 -6 12 0"/><path d="M400 92 q4 -4 8 0 q4 -4 8 0"/></g>`;
    s += `<g>${Array.from({ length:18 }, (_, i) => { const x = i * 48 + R(-8, 8), y = R(170, 186), r = R(26, 40); return `<path d="${copa(x, y, r, r * .55, 10, .3)}" fill="url(#xiLonge1)" stroke="#8AB4A0" stroke-width="1"/>`; }).join('')}</g>`;
    s += `<g>${Array.from({ length:22 }, (_, i) => { const x = i * 38 + R(-8, 8), y = R(194, 204), r = R(18, 28); return `<path d="${copa(x, y, r, r * .5, 9, .3)}" fill="#5E9A70" stroke="#3E7A54" stroke-width="1"/>`; }).join('')}</g>`;
    s += `<rect y="204" width="800" height="62" fill="url(#xiRio2)"/>`;
    s += `<g clip-path="url(#xiRioClip)"><g transform="translate(0 410) scale(1 -1)" opacity=".28">${Array.from({ length:22 }, (_, i) => { const x = i * 38 + R(-8, 8), y = R(194, 204), r = R(18, 28); return `<path d="${copa(x, y, r, r * .5, 9, .3)}" fill="#2E6A4A"/>`; }).join('')}<g transform="translate(0 0)">${buriti(126, 206, 46)}${buriti(668, 206, 40)}</g></g>
      <g stroke="#BFEAF2" stroke-width="1" opacity=".5">${Array.from({ length:16 }, () => { const x = R(0, 780), y = R(212, 262); return `<path d="M${F(x)} ${F(y)} h${F(R(14, 40))}"/>`; }).join('')}</g></g>`;
    s += `${buriti(126, 206, 46)}${buriti(668, 206, 40)}`;
    s += `<g class="balanca" style="animation-duration:7s">${buriti(300, 266, 150)}</g><g class="balanca" style="animation-duration:6s">${buriti(482, 268, 112)}</g>${buriti(36, 266, 132)}`;
    s += `<g></g><path d="M0 205 H800" stroke="#3E7A60" stroke-width="2" opacity=".6"/>`;
    s += `<g id="xi-ondas1" stroke="#E6F8FF" stroke-width="1.4" fill="none" opacity=".8">${Array.from({ length:12 }, () => { const x = R(0, 760), y = R(214, 252); return `<path d="M${F(x)} ${F(y)} q6 -2 12 0 q6 2 12 0"/>`; }).join('')}</g>`;
    s += `<g fill="#fff">${Array.from({ length:12 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .37 % 2.4)}s" x="${F(20 + (i * 71) % 760)}" y="${F(212 + (i * 13) % 44)}" width="${8 + i % 3 * 5}" height="1.6" rx=".8"/>`).join('')}</g>`;
    s += `<g id="xi-banho" class="toque">${[[530, 246, 'xiPeleB', '#9C6844', 'franja'], [574, 250, 'xiPeleD', '#8A5434', 'curto'], [616, 244, 'xiPeleE', '#C08A60', 'tigela']].map(([x, y, p, pc, cb], i) => `<g class="xi-crianca" data-i="${i}"><g transform="translate(${x} ${y}) scale(.62)"><g class="xi-cri-in"><path d="M-12 -66 C-22 -74 -24 -86 -20 -92 M12 -66 C22 -74 24 -86 20 -92" stroke="#3A1E0E" stroke-width="7" fill="none" stroke-linecap="round" opacity="${i === 1 ? 1 : 0}"/><path d="M-12 -66 C-22 -74 -24 -86 -20 -92 M12 -66 C22 -74 24 -86 20 -92" stroke="${pc}" stroke-width="5" fill="none" stroke-linecap="round" opacity="${i === 1 ? 1 : 0}"/><path d="M-15 -60 C-15 -66 -12 -70 -6 -71 H6 C12 -70 15 -66 15 -60Z" fill="${pc}" stroke="#3A1E0E" stroke-width="1"/>${cabeca({ pele:p, peleC:pc, esc:'#3A1E0E', nariz:'#6A3A20', cab:cb, corCab:'#120D0A', luzCab:'#5E524C' })}</g></g><ellipse cx="${x}" cy="${y - 37}" rx="17" ry="4" fill="none" stroke="#E6F8FF" stroke-width="1.6" opacity=".9"/></g>`).join('')}<rect x="506" y="180" width="134" height="80" fill="transparent"/></g>`;
    s += `<g id="xi-canoa" class="toque"><g id="xi-canoa-pos"><g style="animation:flutua 3.2s ease-in-out infinite alternate">${pessoa(724, 240, .62, P_PESC, '')}<path d="M710 166 L742 250" stroke="#3A2414" stroke-width="3" stroke-linecap="round"/><path d="M710 166 L742 250" stroke="#C8986A" stroke-width="1.4" stroke-linecap="round"/><path d="M738 244 l8 10 l-6 2Z" fill="#A8784A" stroke="#3A2414" stroke-width=".8"/><path d="M660 232 C680 240 770 240 794 230 C786 246 774 250 760 250 H690 C676 250 664 244 660 232Z" fill="url(#xiCanoa)" stroke="#2A1408" stroke-width="1.6"/><path d="M664 234 C690 241 768 241 790 232" stroke="#C8986A" stroke-width="1.8" fill="none"/><ellipse cx="726" cy="252" rx="70" ry="4" fill="#1E5A6A" opacity=".3"/></g></g><rect x="650" y="160" width="150" height="96" fill="transparent"/></g>`;
    s += `<path d="M0 262 C120 254 260 268 400 260 C540 252 680 266 800 258 V286 C680 292 540 280 400 288 C260 296 120 282 0 290Z" fill="url(#xiAreia)" stroke="#D8BE8A" stroke-width="1"/>`;
    s += `<path d="M0 262 C120 254 260 268 400 260 C540 252 680 266 800 258 V264 C680 272 540 258 400 266 C260 274 120 260 0 268Z" fill="#C8AE7A" opacity=".55"/><path d="M0 263 C120 255 260 269 400 261 C540 253 680 267 800 259" stroke="#F4FBFF" stroke-width="1.6" fill="none" opacity=".8"/>`;
    s += `<g fill="#C8AA74" opacity=".7">${Array.from({ length:70 }, () => `<circle cx="${F(R(0, 800))}" cy="${F(R(266, 288))}" r="${F(R(.5, 1.2))}"/>`).join('')}</g><g stroke="#D2B47E" stroke-width=".9" fill="none" opacity=".8">${Array.from({ length:10 }, () => { const x = R(0, 760), y = R(270, 284); return `<path d="M${F(x)} ${F(y)} q6 -1.6 12 0 q6 1.6 12 0"/>`; }).join('')}</g>
      <g fill="#B8945E" opacity=".6">${Array.from({ length:7 }, (_, k) => { const x = 610 - k * 9, y = 268 + k * 3.4; return `<ellipse cx="${F(x + (k % 2) * 5)}" cy="${F(y)}" rx="2.4" ry="1.2"/>`; }).join('')}</g>`;
    s += `<g id="xi-barco" class="toque"><g transform="translate(760 270)"><path d="M-34 -6 L30 -8 L26 4 H-30Z" fill="url(#xiAlum)" stroke="#4E5A6A" stroke-width="1.3"/><path d="M-32 -4 H28" stroke="#fff" stroke-width="1.2" opacity=".8"/><path d="M-34 -6 L-38 -10" stroke="#4E5A6A" stroke-width="1.4"/><g id="xi-motor"><rect x="28" y="-18" width="10" height="12" rx="2" fill="#2E2E3A" stroke="#12121A" stroke-width=".8"/><path d="M33 -6 V6" stroke="#2E2E3A" stroke-width="2.4"/><rect x="29" y="-16" width="3" height="4" fill="#E5392C"/></g></g><rect x="720" y="248" width="80" height="34" fill="transparent"/></g>`;
    s += `<rect y="280" width="800" height="220" fill="url(#xiPraca)"/>${capim(0, 800, 292, 40, '#8AA84A', [4, 9], 1.4)}`;
    s += `<ellipse cx="420" cy="410" rx="390" ry="104" fill="url(#xiPatio)" opacity=".9"/>`;
    s += `<g stroke="#F4DCAA" stroke-width="16" fill="none" stroke-linecap="round" opacity=".55"><path d="M150 342 C190 370 260 380 330 392"/><path d="M450 296 C440 330 430 350 420 370"/><path d="M560 300 C590 290 610 286 640 284"/><path d="M640 470 C600 440 560 430 540 420"/></g>`;
    s += `<g stroke="#B8844A" stroke-width="1" fill="none" opacity=".5">${Array.from({ length:26 }, () => { const x = R(60, 760), y = R(320, 490); return `<path d="M${F(x)} ${F(y)} l${F(R(4, 9))} ${F(R(-2, 2))} l${F(R(3, 7))} ${F(R(-2, 3))}"/>`; }).join('')}</g>`;
    s += `<g>${capim(0, 60, 330, 14, '#6E9A3A', [5, 12], 1.6)}${capim(560, 640, 300, 12, '#7EAA44', [5, 11], 1.5)}${capim(740, 800, 400, 16, '#6E9A3A', [6, 13], 1.6)}${capim(0, 40, 470, 10, '#7EAA44', [6, 12], 1.6)}</g>`;
    s += `<g></g><path d="M0 284 C200 278 600 290 800 282" stroke="#B8844A" stroke-width="1.4" fill="none" opacity=".6"/>`;
    s += `<g opacity=".5" stroke="#A8743E" stroke-width="1.2" fill="none">${Array.from({ length:30 }, () => { const x = R(0, 780), y = R(300, 490); return `<path d="M${F(x)} ${F(y)} q${F(R(8, 14))} -2 ${F(R(18, 30))} 0"/>`; }).join('')}</g>`;
    s += `<g fill="#8A6A44" opacity=".6">${Array.from({ length:40 }, () => `<ellipse cx="${F(R(0, 800))}" cy="${F(R(296, 498))}" rx="${F(R(1.4, 3))}" ry="${F(R(.8, 1.6))}"/>`).join('')}</g>`;
    s += `<g id="xi-tracaja" class="toque" data-fig="tracaja"><path d="M268 274 C290 268 330 268 350 276" stroke="#5E3A1E" stroke-width="9" stroke-linecap="round"/><path d="M268 274 C290 268 330 268 350 276" stroke="#9A6A42" stroke-width="6" stroke-linecap="round"/><path d="M276 270 C296 266 322 266 340 271" stroke="#C8986A" stroke-width="1.4" fill="none"/><g id="xi-traca-in"><svg x="282" y="244" width="54" height="27" viewBox="0 0 140 70"><use href="#f-tracaja" width="140" height="90"/></svg></g>${brilhoHotspot(338, 240)}</g>`;
    s += `<g>${copaRica(-6, 232, 56, 44, 'xiJat', '#14422A', '#A8E0A0', '#1E5A36', 12)}</g>`;
    s += casaXingu(160, 336, 290, 116, 'xi-casa1');
    s += casaXingu(452, 292, 156, 62, 'xi-casa2');
    s += pote(398, 296, .8) + pote(414, 298, .62) + pote(506, 294, .7, '#3A2A22');
    s += rede(22, 352, 96, 356);
    s += `<rect x="20" y="214" width="280" height="124" fill="transparent" class="toque" id="xi-casa-toque"/>`;
    /* bacia de alumínio */
    s += `<g id="xi-bacia"><ellipse cx="${BACIA.x}" cy="${BACIA.y + 58}" rx="150" ry="14" fill="#3A2410" opacity=".28"/>
      <path d="M${BACIA.x - 132} ${BACIA.y} C${BACIA.x - 126} ${BACIA.y + 36} ${BACIA.x - 108} ${BACIA.y + 56} ${BACIA.x} ${BACIA.y + 60} C${BACIA.x + 108} ${BACIA.y + 56} ${BACIA.x + 126} ${BACIA.y + 36} ${BACIA.x + 132} ${BACIA.y}Z" fill="url(#xiBacia)" stroke="#4E5A6A" stroke-width="1.8"/>
      <path d="M${BACIA.x - 110} ${BACIA.y + 14} C${BACIA.x - 100} ${BACIA.y + 40} ${BACIA.x - 70} ${BACIA.y + 50} ${BACIA.x - 40} ${BACIA.y + 54}" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>
      <path d="M${BACIA.x - 128} ${BACIA.y + 16} C${BACIA.x - 40} ${BACIA.y + 34} ${BACIA.x + 40} ${BACIA.y + 34} ${BACIA.x + 128} ${BACIA.y + 16}" stroke="#7A8698" stroke-width="1.2" fill="none" opacity=".6"/>
      <ellipse cx="${BACIA.x}" cy="${BACIA.y}" rx="128" ry="36" fill="url(#xiBaciaIn)" stroke="#4E5A6A" stroke-width="1.6"/>
      <g transform="translate(${BACIA.x} ${BACIA.y + 3}) scale(1 .3)"><g id="xi-mistura">
        <g id="xi-m-areia" style="opacity:0;transition:opacity .8s"><circle r="114" fill="url(#xiAreiaB)"/>${Array.from({ length:60 }, () => { const a = R(0, 6.28), r = R(0, 108); return `<circle cx="${F(Math.cos(a) * r)}" cy="${F(Math.sin(a) * r)}" r="${F(R(1.4, 3.4))}" fill="${R(0, 1) < .5 ? '#F8E8C0' : '#B8945A'}" opacity=".8"/>`; }).join('')}</g>
        <g id="xi-m-arv" style="opacity:0;transition:opacity .8s">${sementesSetor(['jatoba', 'pequi', 'baru', 'ipe'], 120, 240, 34)}</g>
        <g id="xi-m-rap" style="opacity:0;transition:opacity .8s">${sementesSetor(['rapida', 'guandu', 'rapida'], -60, 60, 34)}</g>
        <g id="xi-m-mix" style="opacity:0">${sementesSetor(['jatoba', 'rapida', 'pequi', 'guandu', 'baru', 'rapida', 'ipe', 'guandu'], 0, 360, 70)}</g>
      </g></g>
      <g id="xi-pa" style="opacity:0;transition:opacity .6s"><path id="xi-pa-cabo" d="M480 400 L494 330" stroke="#4E2E14" stroke-width="7" stroke-linecap="round"/><path id="xi-pa-cabo2" d="M480 400 L494 330" stroke="#C8986A" stroke-width="4.4" stroke-linecap="round"/></g>
      <path d="M${BACIA.x - 128} ${BACIA.y} A128 36 0 0 0 ${BACIA.x + 128} ${BACIA.y}" stroke="#F4F8FC" stroke-width="5" fill="none"/><path d="M${BACIA.x - 128} ${BACIA.y} A128 36 0 0 0 ${BACIA.x + 128} ${BACIA.y}" stroke="#4E5A6A" stroke-width="1.2" fill="none"/>
      <path d="M${BACIA.x - 128} ${BACIA.y} A128 36 0 0 1 ${BACIA.x + 128} ${BACIA.y}" stroke="#C8D2DE" stroke-width="3.4" fill="none"/>
      <path d="M${BACIA.x - 70} ${BACIA.y + 32} q30 6 60 6" stroke="#fff" stroke-width="2.4" fill="none" opacity=".9" stroke-linecap="round"/>
      <g id="xi-giro" style="display:none" pointer-events="none"><ellipse cx="${BACIA.x}" cy="${BACIA.y + 2}" rx="88" ry="24" fill="none" stroke="#fff" stroke-width="3.4" stroke-dasharray="10 9" opacity=".9"/><path d="M${BACIA.x + 76} ${BACIA.y - 12} l14 2 l-4 12" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
      <ellipse id="xi-bacia-toque" cx="${BACIA.x}" cy="${BACIA.y + 10}" rx="150" ry="64" fill="transparent"/></g>`;
    s += pessoa(246, 486, 1.5, Object.assign({ braco:'segura' }, P_COLETORA), 'xi-coletora2');
    s += pessoa(694, 436, 1.42, Object.assign({}, P_FAZ, { idBraco:'xi-braco-faz' }), 'xi-faz1');
    /* fontes arrastáveis */
    s += `<g id="xi-f-arv" class="toque xi-fonte" data-t="arv" style="cursor:grab"><g class="xi-fonte-pos">${cesto(FONTES.arv.x, FONTES.arv.y, .74, 'xi-cesto1-in', true)}<g class="xi-fonte-hint">${brilhoHotspot(FONTES.arv.x + 30, FONTES.arv.y - 40)}</g></g><rect x="${FONTES.arv.x - 46}" y="${FONTES.arv.y - 40}" width="92" height="70" fill="transparent"/></g>`;
    s += `<g id="xi-f-rap" class="toque xi-fonte" data-t="rap" style="cursor:grab"><g class="xi-fonte-pos"><g transform="translate(${FONTES.rap.x} ${FONTES.rap.y})"><ellipse cx="0" cy="30" rx="36" ry="6" fill="#3A2410" opacity=".3"/><path d="M-28 -18 C-34 0 -32 20 -26 28 C-10 34 10 34 26 28 C32 20 34 0 28 -18Z" fill="url(#xiSaco)" stroke="#6E5A2E" stroke-width="1.6"/><path d="M-26 -6 C-10 -2 10 -2 26 -6 M-28 8 C-10 12 10 12 28 8" stroke="#9A864E" stroke-width="1" fill="none" opacity=".7"/><g stroke="#8A7642" stroke-width=".6" opacity=".55">${Array.from({ length:10 }, (_, i) => `<path d="M${-24 + i * 5.4} -16 V28"/>`).join('')}</g><path d="M-28 -18 C-20 -26 20 -26 28 -18 C20 -12 -20 -12 -28 -18Z" fill="#5E4A22"/><g class="xi-cont">${Array.from({ length:16 }, (_, j) => `<g transform="translate(${F(R(-20, 20))} ${F(R(-22, -15))}) rotate(${F(R(-50, 50))})">${SEM[j % 3 ? 'rapida' : 'guandu']}</g>`).join('')}</g><path d="M-28 -18 C-20 -12 20 -12 28 -18" stroke="#C8B47A" stroke-width="2.4" fill="none"/><path d="M-22 -4 C-24 8 -22 18 -18 24" stroke="#fff" stroke-width="2" fill="none" opacity=".4" stroke-linecap="round"/></g><g class="xi-fonte-hint">${brilhoHotspot(FONTES.rap.x + 24, FONTES.rap.y - 34)}</g></g><rect x="${FONTES.rap.x - 36}" y="${FONTES.rap.y - 34}" width="72" height="70" fill="transparent"/></g>`;
    s += `<g id="xi-f-areia" class="toque xi-fonte" data-t="areia" style="cursor:grab"><g class="xi-fonte-pos"><g transform="translate(${FONTES.areia.x} ${FONTES.areia.y})"><ellipse cx="0" cy="22" rx="30" ry="5" fill="#3A2410" opacity=".3"/><path d="M-22 -14 L-17 20 C-8 24 8 24 17 20 L22 -14Z" fill="url(#xiBalde)" stroke="#123E7A" stroke-width="1.5"/><path d="M-20 -2 H20 M-19 8 H19" stroke="#0E3A6A" stroke-width="1" opacity=".5"/><path d="M-22 -14 C-22 -36 22 -36 22 -14" stroke="#2A2A3A" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="-14" rx="22" ry="5" fill="#123E7A"/><path class="xi-cont" d="M-20 -14 C-14 -24 12 -24 20 -14 C12 -10 -12 -10 -20 -14Z" fill="url(#xiAreiaB)" stroke="#B8945A" stroke-width=".8"/><path d="M-16 -8 V14" stroke="#9AD0FF" stroke-width="2.4" opacity=".6" stroke-linecap="round"/></g><g class="xi-fonte-hint">${brilhoHotspot(FONTES.areia.x + 22, FONTES.areia.y - 34)}</g></g><rect x="${FONTES.areia.x - 30}" y="${FONTES.areia.y - 38}" width="60" height="66" fill="transparent"/></g>`;
    s += `<g>${samambaia(14, 500, 50, '#6EAA5A', '#2E5A2A', false)}${samambaia(790, 500, 40, '#6EAA5A', '#2E5A2A', true)}</g>`;
    return s;
  })();
  /* ================= TELA 3: a nascente na fazenda (semear) ================= */
  const zonaCrescer = (z, i) => {
    let g1 = `<path d="${copa(z.x, z.y, z.rx * 1.02, z.ry * .95, 18, .22)}" fill="url(#xiBroto)" opacity=".92"/>${capim(z.x - z.rx * .8, z.x + z.rx * .8, z.y + z.ry * .4, Math.round(z.rx / 4), '#4E8A3A', [3, 7], 1)}`;
    for (let k = 0; k < Math.round(z.rx / 6); k++) { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)); g1 += broto(z.x + Math.cos(a) * z.rx * .85 * r, z.y + Math.sin(a) * z.ry * .8 * r, R(.7, 1.2)); }
    for (let k = 0; k < Math.round(z.rx / 28); k++) g1 += feijaoPorco(z.x + R(-z.rx * .7, z.rx * .7), z.y + R(-z.ry * .4, z.ry * .5), R(.8, 1.1));
    let g2 = '';
    for (let k = 0; k < Math.round(z.rx / 26); k++) g2 += guandu(Math.round(z.x + R(-z.rx * .75, z.rx * .75)), Math.round(z.y + R(-z.ry * .3, z.ry * .5)), R(26, 40));
    g2 += arvNova(Math.round(z.x + R(-z.rx * .3, 0)), Math.round(z.y + z.ry * .3), 40, 16, ['xiVerdeB', 'xiIng', 'xiPeq', 'xiBar'][i], '#24461E', '#E6FFD0', '#2E5A2A');
    const PAL = { xiJat:['#14422A', '#A8E0A0', '#1E5A36'], xiVerdeB:['#1E4A26', '#E6FFD0', '#2E5A2A'], xiPeq:['#3E5A1A', '#F4FFB0', '#6A8A2E'], xiBar:['#24463A', '#E0F4E0', '#3A6A56'], xiIpe:['#9A6A08', '#FFFBD0', '#E0A01A'], xiIng:['#6A2E1A', '#FFE0C8', '#8A3E2A'], xiIpeR:['#6A2A6A', '#FFE6F6', '#9A4A9A'] };
    const T = [
      [[40, 300, 150, 50, 'redonda', 'xiJat'], [86, 306, 120, 30, 'coluna', 'xiVerdeB'], [196, 300, 135, 40, 'camadas', 'xiPeq'], [140, 298, 110, 44, 'guarda', 'xiBar']],
      [[330, 358, 135, 44, 'camadas', 'xiBar'], [512, 364, 110, 38, 'redonda', 'xiVerdeB'], [452, 358, 125, 48, 'guarda', 'xiIng'], [392, 362, 100, 28, 'coluna', 'xiIpe']],
      [[180, 452, 96, 34, 'redonda', 'xiIpeR'], [310, 462, 88, 36, 'guarda', 'xiVerdeB'], [240, 460, 80, 22, 'coluna', 'xiJat']],
      [[490, 498, 92, 34, 'camadas', 'xiJat'], [630, 500, 84, 34, 'guarda', 'xiBar'], [560, 500, 74, 22, 'coluna', 'xiPeq'], [700, 500, 76, 30, 'redonda', 'xiIng']]
    ][i];
    const topo = a => a[1] - a[2] * (a[4] === 'guarda' ? .86 : a[4] === 'coluna' ? .7 : a[4] === 'camadas' ? .6 : .74);
    let g3 = ''; { const nb = Math.round(z.rx / 16); for (let k = 0; k < nb; k++) { const x = z.x - z.rx + (k + .5) * 2 * z.rx / nb + R(-6, 6), y = z.y - (i < 2 ? R(44, 74) : R(24, 40)), r = R(22, 34); g3 += `<path d="${copa(x, y, r, r * .78, 12, .3)}" fill="${['#2E5A36', '#3A6A3A', '#24502E', '#4A7A3E'][k % 4]}" stroke="#163A22" stroke-width="1.1"/><path d="${copa(x - r * .25, y - r * .25, r * .5, r * .35, 8, .3)}" fill="#6EA04E" opacity=".45"/>`; } }
    g3 += T.map(a => arvForma(a[0], a[1], a[2], a[3], a[4], a[5], ...PAL[a[5]])).join('');
    for (let k = 0; k + 1 < T.length; k++) { const a = T[k], b = T[k + 1]; g3 += cipo(a[0] + (b[0] > a[0] ? a[3] * .4 : -a[3] * .4), F(topo(a) + 8), b[0] - (b[0] > a[0] ? b[3] * .3 : -b[3] * .3), F(topo(b) + 10), 16 + k * 6); }
    if (i === 0) g3 += buriti(172, 314, 90);
    g3 += subBosque(z.x - z.rx * .9, z.x + z.rx * .7, z.y + z.ry * .2) + subBosque(z.x - z.rx * .7, z.x + z.rx * .95, z.y + z.ry * .85);
    const anim = 'transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform 1.8s cubic-bezier(.3,1.25,.5,1)';
    return { g1:`<g class="xi-g1" style="${anim}">${g1}</g>`, g2:`<g class="xi-g2" style="${anim}">${g2}</g>`, g3:`<g class="xi-g3" style="${anim}">${g3}</g>` };
  };
  const CRESC = ZONAS.map(zonaCrescer);
  const tela2 = (() => {
    let s = `<rect width="800" height="320" fill="url(#xiCeu2)"/>`;
    s += `<g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="300" y="34" width="96" height="44" style="color:#fff" opacity=".9"/><use href="#nuvem" x="600" y="60" width="64" height="30" style="color:#fff" opacity=".8"/></g>`;
    s += `<g id="xi-chuva-nuvem" style="opacity:0;transition:opacity .8s"><use href="#nuvem" x="120" y="10" width="240" height="96" style="color:#B8C4D4"/><use href="#nuvem" x="380" y="2" width="280" height="110" style="color:#A8B6CA"/><use href="#nuvem" x="600" y="14" width="200" height="86" style="color:#B8C4D4"/></g>`;
    s += `<path d="M0 182 C40 172 100 170 160 176 C170 178 176 180 180 182Z" fill="#3E7A4A"/><path d="M0 178 C30 170 70 166 120 170" stroke="#2E5A3A" stroke-width="3" fill="none" opacity=".5"/>`;
    s += `<rect y="180" width="800" height="30" fill="url(#xiSoja)"/><path d="M0 180 H250 L232 210 H0Z" fill="#C8B070" opacity=".55"/><path d="M560 180 H800 V210 H600Z" fill="#7AA040" opacity=".45"/>`;
    s += `<clipPath id="xiSojaClip"><rect y="178" width="800" height="34"/></clipPath><g stroke-width="1.3" opacity=".85" clip-path="url(#xiSojaClip)">${Array.from({ length:90 }, (_, i) => { const xb = -500 + i * 20, xt = xb + (400 - xb) / 3; return `<path d="M${F(xt)} 180 L${xb} 210" stroke="${i % 2 ? '#7E9E3A' : '#DCE48E'}"/>`; }).join('')}</g>`;
    s += `<g stroke="#5E7A2E" stroke-width="1" opacity=".5">${[183, 187, 192, 198, 205].map(y => `<path d="M0 ${y} H800" stroke-dasharray="${F(1 + (y - 180) / 6)} ${F(2 + (y - 180) / 4)}"/>`).join('')}</g><path d="M250 180 L232 210 M560 180 L600 210" stroke="#4E6A2A" stroke-width="2.4" opacity=".7"/>`;
    s += `<g transform="translate(640 166)"><rect x="0" y="0" width="16" height="18" fill="#C8CED8" stroke="#6E7A8A" stroke-width="1"/><path d="M0 0 L8 -8 L16 0Z" fill="#9AA4B4" stroke="#6E7A8A" stroke-width="1"/><rect x="20" y="6" width="22" height="12" fill="#E8E0D0" stroke="#8A7A6A" stroke-width="1"/><path d="M18 6 L31 -2 L44 6Z" fill="#C85A3A" stroke="#7A3A1E" stroke-width="1"/></g>`;
    s += `<g>${[[250, 178], [420, 180], [520, 176], [740, 180]].map(([x, y]) => `<path d="M${x} ${y + 6} V${y - 4}" stroke="#5A4A3A" stroke-width="1.6"/><path d="${copa(x, y - 8, 9, 6, 8, .3)}" fill="#6E9A5A" stroke="#3E6A3A" stroke-width=".8"/>`).join('')}</g>`;
    s += `<path d="M0 206 C200 200 500 212 800 204 V372 H0Z" fill="url(#xiPasto)"/>`;
    s += `<g fill="none" stroke-linecap="round">${Array.from({ length:9 }, (_, i) => { const y = 212 + i * i * 1.5 + i * 6, w = 2 + i * 1.6; return `<path d="M-10 ${F(y)} C200 ${F(y - 5)} 520 ${F(y + 6)} 810 ${F(y - 3)}" stroke="${i % 2 ? '#B8C060' : '#E4E89A'}" stroke-width="${F(w)}" opacity=".5"/>`; }).join('')}</g>`;
    s += `<g fill="#8A9A3E" opacity=".55">${Array.from({ length:40 }, () => { const x = R(0, 800), y = R(214, 300), k = (y - 200) / 60; return `<path d="M${F(x - 3 * k)} ${F(y)} l${F(1.4 * k)} ${F(-5 * k)} l${F(1.2 * k)} ${F(4 * k)} l${F(1.2 * k)} ${F(-6 * k)} l${F(1.2 * k)} ${F(6 * k)}Z"/>`; }).join('')}</g>`;
    s += `<g stroke="#A8B05A" stroke-width="1" fill="none" opacity=".7">${Array.from({ length:60 }, () => { const x = R(0, 800), y = R(212, 330); return `<path d="M${F(x)} ${F(y)} l-1 -4 M${F(x + 2)} ${F(y)} l1 -5"/>`; }).join('')}</g>`;
    s += `<g id="xi-bois" class="toque">${boi(450, 226, .9, false)}${boi(500, 232, 1, true)}${boi(410, 236, 1.05, false)}<rect x="380" y="206" width="140" height="40" fill="transparent"/></g>`;
    s += (() => { const P = Array.from({ length:15 }, (_, i) => { const t = i / 14, e = t * t; return { x:300 + 500 * (1 - Math.pow(1 - t, 1.6)), y:248 + 34 * e, h:12 + 18 * e, w:1.8 + 3 * e }; }); const fio = f => `M${P.map(p => `${F(p.x)} ${F(p.y - p.h * f)}`).join(' L')}`; return `<g fill="none" stroke-linecap="round"><path d="${fio(.85)}" stroke="#3E2A16" stroke-width="1.4"/><path d="${fio(.5)}" stroke="#3E2A16" stroke-width="1.3"/><path d="${fio(.85)}" stroke="#C8B8A0" stroke-width=".5" opacity=".7"/></g>${P.map(p => `<ellipse cx="${F(p.x + 2)}" cy="${F(p.y + 1)}" rx="${F(p.w * 1.6)}" ry="${F(p.w * .4)}" fill="#3A2A10" opacity=".3"/><path d="M${F(p.x)} ${F(p.y)} V${F(p.y - p.h)}" stroke="#3E2814" stroke-width="${F(p.w + 1.4)}"/><path d="M${F(p.x - p.w * .2)} ${F(p.y - .5)} V${F(p.y - p.h + .5)}" stroke="#9A6E44" stroke-width="${F(p.w * .55)}"/><path d="M${F(p.x - p.w * .7)} ${F(p.y - p.h)} h${F(p.w * 1.4)}" stroke="#C8986A" stroke-width="1"/>`).join('')}`; })();
    s += `<g id="xi-ipe2" class="toque" data-fig="ipeamarelo">${tronco(604, 280, 214, 12, 'xiTr3', '#2E2620', -3)}${galho('M603 230 C592 218 584 214 576 212 M604 224 C614 212 624 208 634 206', 3, '#6E645A', '#2E2620')}${copaRica(604, 200, 46, 32, 'xiIpe', '#9A6A08', '#FFFBD0', '#E0A01A', 11)}${brilhoHotspot(646, 176)}</g>`;
    /* terra pelada, voçorocas e riacho */
    s += `<path d="M0 262 C90 256 170 268 250 286 C340 306 440 318 560 334 C660 346 740 350 800 350 V500 H0Z" fill="url(#xiTerra)" stroke="#7A3E1E" stroke-width="1.6"/>`;
    s += `<g stroke="#7A3A1A" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".6"><path d="M60 270 C66 286 60 296 70 310"/><path d="M290 300 C296 318 290 330 300 346"/><path d="M380 316 C386 330 380 344 392 360"/><path d="M520 334 C522 350 516 364 526 386"/><path d="M200 466 C210 480 206 490 214 500"/><path d="M430 470 C426 484 434 492 430 500"/></g>`;
    s += `<g stroke="#E8A87A" stroke-width="1" fill="none" opacity=".45">${Array.from({ length:30 }, () => { const x = R(0, 800), y = R(300, 498); return `<path d="M${F(x)} ${F(y)} q${F(R(6, 10))} -2 ${F(R(14, 24))} 0"/>`; }).join('')}</g>`;
    s += `<g fill="#6E3A1A" opacity=".5">${Array.from({ length:50 }, () => `<ellipse cx="${F(R(0, 800))}" cy="${F(R(290, 498))}" rx="${F(R(1.2, 3))}" ry="${F(R(.8, 1.6))}"/>`).join('')}</g>`;
    s += `<g id="xi-vocoroca" style="transition:opacity 2s">${[[226, 284, 30], [478, 330, 34]].map(([x, y, h]) => `<path d="M${x - 3} ${y} C${x - 8} ${y + h * .4} ${x - 16} ${y + h * .8} ${x - 22} ${y + h} L${x + 22} ${y + h} C${x + 14} ${y + h * .8} ${x + 8} ${y + h * .4} ${x + 3} ${y}Z" fill="#7A3416" stroke="#4A1A08" stroke-width="1"/><path d="M${x} ${y + 3} C${x - 3} ${y + h * .5} ${x - 6} ${y + h * .8} ${x - 8} ${y + h}" stroke="#4A1A08" stroke-width="1.4" fill="none"/><path d="M${x - 3} ${y} C${x - 8} ${y + h * .4} ${x - 16} ${y + h * .8} ${x - 22} ${y + h}" stroke="#E8A070" stroke-width="1.2" fill="none" opacity=".7"/>`).join('')}</g>`;
    s += `<path id="xi-verde" d="M0 262 C90 256 170 268 250 286 C340 306 440 318 560 334 C660 346 740 350 800 350 V500 H0Z" fill="url(#xiVerdeChao)" opacity="0" style="transition:opacity 2s"/>`;
    s += `<g id="xi-enxurrada" style="opacity:0;transition:opacity 1s" stroke="#9A5A2A" stroke-width="3" fill="none" stroke-linecap="round">${[[64, 272, 120, 312], [292, 304, 300, 362], [384, 320, 392, 382], [520, 338, 528, 412]].map(([a, b, c2, d]) => `<path class="xi-enx" d="M${a} ${b} C${a + 6} ${(b + d) / 2} ${c2 - 6} ${(b + d) / 2} ${c2} ${d}" pathLength="100" stroke-dasharray="14 10"/>`).join('')}</g>`;
    s += `<g id="xi-tocos">${toco(250, 330, 22)}${toco(470, 452, 26)}${toco(766, 478, 18)}</g>`;
    s += `<g id="xi-zonas">${ZONAS.map((z, i) => `<g class="xi-zona" data-i="${i}"><ellipse class="xi-zona-sem" cx="${z.x}" cy="${z.y}" rx="${z.rx}" ry="${z.ry}" fill="#5A2E14" opacity="0" style="transition:opacity .8s"/><g class="xi-zona-pontos" style="opacity:0;transition:opacity .8s">${Array.from({ length:26 }, () => { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)); return `<circle cx="${F(z.x + Math.cos(a) * z.rx * .85 * r)}" cy="${F(z.y + Math.sin(a) * z.ry * .8 * r)}" r="${F(R(1.2, 2.2))}" fill="${['#FFFDF2', '#7A3E1E', '#E8D48A', '#C89A5A'][Math.floor(R(0, 4))]}"/>`; }).join('')}</g><g class="xi-zona-hint"><ellipse cx="${z.x}" cy="${z.y}" rx="${z.rx}" ry="${z.ry}" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-width="2.6" stroke-dasharray="9 7" class="xi-tracejado"/>${brilhoHotspot(z.x + z.rx * .6, z.y - z.ry * .6)}</g><ellipse cx="${z.x}" cy="${z.y}" rx="${z.rx}" ry="${z.ry + 6}" fill="transparent"/></g>`).join('')}</g>`;
    s += `<g id="xi-cresc-tras">${[0, 1].map(i => CRESC[i].g1 + CRESC[i].g2 + CRESC[i].g3).join('')}</g>`;
    /* riacho */
    s += `<path d="${rioPoly(54, 94, 3)}" fill="#B8602E" stroke="#7A3416" stroke-width="1" stroke-linejoin="round"/><path d="${rioPoly(46, 84, 2.4)}" fill="#8E3A18"/><path d="${rioPoly(38, 72, 1.6)}" fill="#6E2A10"/>`;
    s += (() => { let d = '', d2 = ''; for (let i = 2; i < 58; i++) { const t = i / 60, [x, y] = rioPt(t), [x2, y2] = rioPt(t + .01), dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1, w = 44 + 38 * t; for (const sg of [-1, 1]) { const ox = x - sg * dy / l * w * .5, oy = y + sg * dx / l * w * .42; d += `M${F(ox - dx / l * 5)} ${F(oy - dy / l * 5)} l${F(dx / l * 9)} ${F(dy / l * 9)} `; if (i % 3 === 0) d2 += `M${F(ox + sg * 2)} ${F(oy + 2)} l${F(R(-1, 1))} ${F(R(3, 5))} `; } } return `<path d="${d}" stroke="#5E200A" stroke-width="1" opacity=".55" fill="none"/><path d="${d2}" stroke="#D07A4A" stroke-width="1" opacity=".6" fill="none"/>`; })();
    s += (() => { let d = ''; for (let i = 1; i < 60; i++) { const t = i / 60, [x, y] = rioPt(t), [x2, y2] = rioPt(t + .01), dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1, w = 54 + 40 * t; for (const sg of [-1, 1]) { const ox = x - sg * dy / l * w * .55, oy = y + sg * dx / l * w * .45; for (let k = 0; k < 3; k++) d += `M${F(ox + k * 2 - 2)} ${F(oy + (sg < 0 ? 1 : -1))} l${F(R(-2, 2) + sg * 1.4)} ${F(sg < 0 ? R(3, 6) : -R(3, 6))} `; } } return `<path id="xi-margem-capim" d="${d}" stroke="#4E7A2E" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0" style="transition:opacity 2s"/>`; })();
    s += `<path d="${RIOW}" fill="#6E3A1A" opacity=".45"/>`;
    s += `<path id="xi-rio-barro" d="${RIOD}" fill="url(#xiBarro)" stroke="#5A2E14" stroke-width="1.4" style="transition:opacity 2s"/>`;
    s += `<g id="xi-rio-ondasB" stroke="#F4E2C0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8" style="transition:opacity 2s">${[.1, .26, .42, .58, .72, .86].map(t => { const [x, y] = rioPt(t); return `<path d="M${F(x - 10)} ${F(y + 1)} q5 -2 10 0 q5 2 10 0"/>`; }).join('')}</g>`;
    s += `<path id="xi-rio-limpo" d="${RIOD}" fill="url(#xiLimpo)" stroke="#1E5A7A" stroke-width="1.4" opacity="0" style="transition:opacity 2s"/>`;
    s += `<g id="xi-rio-brilho" opacity="0" style="transition:opacity 2s" stroke="#E6FAFF" stroke-width="1.4" fill="none" stroke-linecap="round">${[.12, .3, .45, .6, .75, .9].map(t => { const [x, y] = rioPt(t); return `<path d="M${F(x - 8)} ${F(y)} q5 -2 10 0 q5 2 10 0"/>`; }).join('')}</g>`;
    s += `<g id="xi-calor" stroke="#FFF2D8" stroke-width="1.6" fill="none" opacity=".6" style="transition:opacity 2s">${[.2, .4, .55, .7, .85].map(t => { const [x, y] = rioPt(t); return `<path class="xi-onda-calor" d="M${F(x - 6)} ${F(y - 10)} q3 -4 0 -8 q-3 -4 0 -8 M${F(x + 6)} ${F(y - 8)} q3 -4 0 -8 q-3 -4 0 -8"/>`; }).join('')}</g>`;
    s += `<g id="xi-nascente" class="toque"><ellipse cx="148" cy="318" rx="30" ry="10" fill="#5A2E14" stroke="#3E1E0A" stroke-width="1.2"/><g fill="#A8A096" stroke="#4E4840" stroke-width=".8">${[[118, 318, 6, 3.6], [126, 326, 5, 3], [176, 316, 6, 3.4], [168, 326, 5, 3], [140, 309, 4, 2.4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><path d="M${x - rx * .5} ${y - ry * .3} q${rx * .4} ${-ry * .5} ${rx * .8} -.2" stroke="#E8E2D8" stroke-width=".8" fill="none"/>`).join('')}</g><ellipse id="xi-nasc-barro" cx="148" cy="318" rx="22" ry="6" fill="url(#xiBarro)" style="transition:opacity 2s"/><ellipse id="xi-nasc-limpa" cx="148" cy="318" rx="22" ry="6" fill="url(#xiLimpo)" opacity="0" style="transition:opacity 2s"/><g id="xi-olho" opacity="0" style="transition:opacity 2s" fill="none" stroke="#E6FAFF" stroke-width="1.2"><ellipse class="xi-olho-a" cx="146" cy="318" rx="6" ry="2"/><ellipse class="xi-olho-b" cx="146" cy="318" rx="12" ry="3.6"/></g><rect x="118" y="304" width="60" height="26" fill="transparent"/></g>`;
    s += `<clipPath id="xiRioDClip"><path d="${RIOD}"/></clipPath><g id="xi-sombra-rio" opacity="0" style="transition:opacity 2s" pointer-events="none" clip-path="url(#xiRioDClip)"><g fill="#0E3A2A">${[.08, .18, .28, .38, .48, .58, .68, .78, .88, .97].map((t, i) => { const [x, y] = rioPt(t); return `<ellipse cx="${F(x + (i % 2 ? 8 : -6))}" cy="${F(y + 1)}" rx="${F(30 + t * 34)}" ry="${F(8 + t * 6)}" opacity=".42"/>`; }).join('')}</g><g fill="#FFF8C8">${Array.from({ length:16 }, (_, i) => { const [x, y] = rioPt(.05 + i * .058); return `<ellipse cx="${F(x + R(-14, 14))}" cy="${F(y + R(-3, 3))}" rx="${F(R(3, 6))}" ry="${F(R(1, 2))}" opacity=".45"/>`; }).join('')}</g></g>`;
    s += `<g id="xi-nasc-vida" opacity="0" style="transition:opacity 2s" pointer-events="none"><ellipse cx="148" cy="319" rx="34" ry="12" fill="none" stroke="#4E8A3A" stroke-width="3.4" opacity=".8"/><ellipse cx="148" cy="319" rx="34" ry="12" fill="none" stroke="#9AD06E" stroke-width="1.2" stroke-dasharray="3 4"/>${[[110, 318, -1], [118, 312, -1], [180, 310, 1], [188, 316, 1]].map(([x, y, f]) => [-70, -40, -100].map(a => { const r = a * Math.PI / 180, L = 16, ex = x + Math.cos(r) * L * f * -1, ey = y + Math.sin(r) * L; let lf = ''; for (let k = 1; k < 6; k++) { const t = k / 6, px = x + (ex - x) * t, py = y + (ey - y) * t - Math.sin(t * 3.14) * 3; lf += `<ellipse cx="${F(px)}" cy="${F(py)}" rx="${F(3.2 * (1 - t * .6))}" ry="1.2" transform="rotate(${F(a + 90)} ${F(px)} ${F(py)})"/>`; } return `<path d="M${x} ${y} Q${F((x + ex) / 2)} ${F((y + ey) / 2 - 4)} ${F(ex)} ${F(ey)}" stroke="#1E4A1E" stroke-width="1" fill="none"/><g fill="#6EBA5A" stroke="#1E4A1E" stroke-width=".4">${lf}</g>`; }).join('')).join('')}${[[118, 328, '#FF7AB8'], [132, 331, '#fff'], [170, 330, '#FFD23A'], [182, 326, '#fff'], [160, 333, '#FF7AB8']].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><path d="M0 0 v-5" stroke="#2E6A2A" stroke-width="1"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-7.6" rx="1.4" ry="2.2" transform="rotate(${a} 0 -5.4)" fill="${c}" stroke="#7A3A4A" stroke-width=".3"/>`).join('')}<circle cy="-5.4" r="1" fill="#E89A1A"/></g>`).join('')}<path class="xi-filete" d="M162 320 C176 324 188 326 200 330" stroke="#E6FAFF" stroke-width="1.6" fill="none" stroke-dasharray="4 5" stroke-linecap="round"/></g>`;
    s += `<g id="xi-cresc-frente">${[2, 3].map(i => CRESC[i].g1 + CRESC[i].g2 + CRESC[i].g3).join('')}</g>`;
    s += pessoa(748, 358, 1.36, Object.assign({}, P_FAZ, { idBraco:'xi-braco-faz2' }), 'xi-faz2');
    s += `<g id="xi-balde" class="toque" style="cursor:grab"><g id="xi-balde-pos" transform="translate(690 378)"><ellipse cx="0" cy="22" rx="28" ry="5" fill="#3A1A0A" opacity=".32"/><path d="M-21 -14 L-16 20 C-8 24 8 24 16 20 L21 -14Z" fill="url(#xiBalde)" stroke="#123E7A" stroke-width="1.5"/><path d="M-19 -2 H19 M-18 8 H18" stroke="#0E3A6A" stroke-width="1" opacity=".5"/><path d="M-21 -14 C-21 -36 21 -36 21 -14" stroke="#2A2A3A" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="-14" rx="21" ry="5" fill="#123E7A"/><path d="M-19 -14 C-13 -24 12 -24 19 -14 C12 -10 -12 -10 -19 -14Z" fill="url(#xiAreiaB)" stroke="#B8945A" stroke-width=".8"/><g>${Array.from({ length:12 }, (_, j) => `<g transform="translate(${F(R(-14, 14))} ${F(R(-19, -14))}) scale(.7)">${SEM[['jatoba', 'rapida', 'pequi', 'guandu', 'baru', 'ipe'][j % 6]]}</g>`).join('')}</g><path d="M-15 -8 V14" stroke="#9AD0FF" stroke-width="2.4" opacity=".6" stroke-linecap="round"/><g id="xi-balde-hint" style="display:none">${brilhoHotspot(22, -30)}</g><rect x="-30" y="-40" width="60" height="68" fill="transparent"/></g></g>`;
    s += `<g>${samambaia(796, 500, 46, '#8AA84A', '#4E5A1E', true)}${capim(150, 800, 500, 40, '#C8A44A', [6, 14], 1.6)}${capim(560, 800, 498, 24, '#E0C070', [5, 11], 1.2)}</g>`;
    s += `<rect id="xi-noite" width="800" height="500" fill="#1A2A5A" opacity="0" pointer-events="none"/>`;
    s += `<g id="xi-sol" class="toque"><g id="xi-sol-pos" transform="translate(92 74)"><circle r="46" fill="#FFE27A" opacity=".22"/><circle r="32" fill="#FFE27A" opacity=".3"/><circle r="22" fill="url(#xiSolG)" stroke="#F0A01E" stroke-width="2"/><path d="M-12 -8 q7 -8 17 -8" stroke="#FFF8D0" stroke-width="3.4" fill="none" stroke-linecap="round"/><g id="xi-sol-hint" style="display:none">${brilhoHotspot(28, -24)}<path d="M40 0 h40 M70 -8 l10 8 l-10 8" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><circle r="40" fill="transparent"/></g></g>`;
    return s;
  })();
  /* ================= vista do espaço (final) ================= */
  const NASC = ['M402 318 C380 330 350 338 318 350', 'M402 318 C406 334 402 350 408 368', 'M402 318 C430 326 466 330 498 346', 'M414 258 C450 258 500 248 540 260', 'M318 350 C300 356 284 364 268 376'];
  const espaco = (() => {
    let campos = '';
    for (let gy = 66; gy < 400;) { const h = R(20, 40); for (let gx = 146; gx < 660;) { const w = R(24, 70); campos += `<rect x="${F(gx)}" y="${F(gy)}" width="${F(w)}" height="${F(h)}" fill="${['#E6D49A', '#D8C27A', '#CFE09A', '#B8D07A', '#EADCB0', '#C8B070', '#A8C46A'][Math.floor(R(0, 7))]}" stroke="#F4ECCE" stroke-width="1"/>`; if (R(0, 1) < .5) campos += `<path d="M${F(gx + 2)} ${F(gy + h * .3)} h${F(w - 4)} M${F(gx + 2)} ${F(gy + h * .6)} h${F(w - 4)}" stroke="#fff" stroke-width=".6" opacity=".35"/>`; gx += w; } gy += h; }
    [[200, 120], [600, 110], [560, 340], [236, 300], [612, 240], [190, 210]].forEach(([x, y]) => { const r = R(16, 22); campos += `<circle cx="${x}" cy="${y}" r="${F(r)}" fill="${R(0, 1) < .5 ? '#9AC85A' : '#D8C27A'}" stroke="#F4ECCE" stroke-width="1.2"/><path d="M${x} ${y} L${F(x + r)} ${y}" stroke="#fff" stroke-width=".8" opacity=".6"/><circle cx="${x}" cy="${y}" r="${F(r * .5)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".4"/>`; });
    campos += `<path d="M146 230 C260 240 300 200 340 190 M470 150 C540 160 600 140 660 150" stroke="#F8F0DA" stroke-width="2" fill="none" opacity=".8"/>`;
    const ilha = `M352 82 C384 70 430 76 450 92 C470 108 468 130 482 148 C498 168 494 194 480 214 C468 236 474 258 456 276 C440 292 406 296 384 286 C358 274 356 250 342 232 C326 210 330 186 324 164 C318 140 322 100 352 82Z`;
    let manchas = ''; for (let i = 0; i < 70; i++) manchas += `<circle cx="${F(R(322, 496))}" cy="${F(R(72, 296))}" r="${F(R(3, 8))}" fill="${R(0, 1) < .5 ? '#2E6A3A' : '#5EAA5E'}" opacity=".7"/>`;
    return `<g id="xi-espaco" style="opacity:0;display:none" pointer-events="none">
      <rect width="800" height="500" fill="url(#xiEspaco)"/>
      <g fill="#fff">${Array.from({ length:70 }, (_, i) => `<circle cx="${F(R(0, 800))}" cy="${F(R(0, 500))}" r="${F(R(.4, 1.6))}" opacity="${F(R(.3, 1))}"/>`).join('')}</g>
      <g id="xi-mapa" style="transform-box:fill-box;transform-origin:50% 50%"><rect x="142" y="62" width="516" height="336" rx="32" fill="#2A3A6A" stroke="#8AB0FF" stroke-width="2"/>
      <g clip-path="url(#xiMapaC)">${campos}
        <path d="${ilha}" fill="#1A4A2A" opacity=".5" transform="translate(4 6)"/>
        <clipPath id="xiIlhaC"><path d="${ilha}"/></clipPath><path d="${ilha}" fill="url(#xiMata)" stroke="#14381E" stroke-width="2"/><g clip-path="url(#xiIlhaC)">${manchas}</g>
        <g id="xi-fitas" stroke="#2E8A3E" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9">${NASC.map(d => `<path d="${d}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="transition:stroke-dashoffset 2.6s ease-out"/>`).join('')}</g>
        <path d="M404 60 C412 96 398 130 412 164 C424 196 404 228 414 258 C420 282 406 300 402 318" stroke="#3E8AD8" stroke-width="4.4" fill="none" stroke-linecap="round"/>
        <g stroke="#3E8AD8" stroke-width="2.6" fill="none" stroke-linecap="round">${NASC.map(d => `<path d="${d}"/>`).join('')}</g>
        <path d="M404 60 C412 96 398 130 412 164 C424 196 404 228 414 258 C420 282 406 300 402 318" stroke="#9AD8FF" stroke-width="1.4" fill="none" opacity=".8"/>
        <g id="xi-pino" style="opacity:0;transition:opacity 1s"><circle cx="318" cy="350" r="5" fill="#FFE27A" stroke="#A86A08" stroke-width="1.4"/><circle class="xi-pino-a" style="transform-box:fill-box;transform-origin:50% 50%" cx="318" cy="350" r="9" fill="none" stroke="#FFE27A" stroke-width="2"/></g>
      </g>
      <path d="M150 90 q0 -20 20 -20 h60" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/></g>
      <g transform="translate(700 64) rotate(-20)"><rect x="-8" y="-6" width="16" height="12" rx="2" fill="#C8D2E0" stroke="#4E5A6A"/><rect x="-34" y="-5" width="22" height="10" fill="#2E6AD8" stroke="#123E7A"/><rect x="12" y="-5" width="22" height="10" fill="#2E6AD8" stroke="#123E7A"/><path d="M-34 0 H34" stroke="#8AB0FF" stroke-width=".6"/><circle cx="0" cy="8" r="2.4" fill="#FFE27A"/></g>
    </g>`;
  })();
  /* ================= cena ================= */
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Sementes do Xingu: coleta de sementes na floresta, a muvuca preparada na aldeia e a mata plantada de novo na nascente do rio">
    ${defs}
    <g id="xi-mundo">
      <g id="xi-tela0">${tela0}</g>
      <g id="xi-tela1" transform="translate(800 0)">${tela1}</g>
      <g id="xi-tela2" transform="translate(1600 0)">${tela2}</g>
      <g id="xi-emenda1" pointer-events="none">${tronco(800, 504, -10, 26, 'xiTr2', '#3A2414', 0)}<path d="M796 60 C790 140 806 220 798 300 C792 360 804 420 800 470" stroke="#3E7A2A" stroke-width="3" fill="none"/>${[90, 160, 230, 300, 370].map((y, i) => `<path d="M${798 + (i % 2 ? 4 : -4)} ${y} c${i % 2 ? 8 : -8} -4 ${i % 2 ? 14 : -14} 2 ${i % 2 ? 12 : -12} 8 c${i % 2 ? -4 : 4} 1 ${i % 2 ? -10 : 10} -2 ${i % 2 ? -12 : 12} -8Z" fill="#5EAA4E" stroke="#1E4A1E" stroke-width=".8"/>`).join('')}${copaRica(800, 20, 70, 44, 'xiJat', '#14422A', '#A8E0A0', '#1E5A36', 14)}${folhona(800, 500, -60, 100, 'xiVerdeB', '#1E4A26')}${folhona(800, 500, -120, 100, 'xiJat', '#14422A')}${folhona(800, 490, -90, 70, 'xiVerdeB', '#1E4A26')}</g>
      <g id="xi-emenda2" pointer-events="none">${[-14, -4, 6, 16].map((d, i) => `<path d="${copa(1600 + d, 478 - (i % 2) * 14, 16, 20, 9, .3)}" fill="${i % 2 ? '#7AA84A' : '#5E9A44'}" stroke="#2E5A22" stroke-width="1.2"/>`).join('')}${capim(1576, 1626, 470, 24, '#3E6A2A', [14, 34], 2)}${capim(1578, 1624, 492, 20, '#C8A44A', [10, 26], 1.6)}<path d="M1596 500 V402" stroke="#4E3420" stroke-width="6" stroke-linecap="round"/><path d="M1594 500 V402" stroke="#A8784A" stroke-width="2"/></g>
    </g>
    ${espaco}
    <g id="xi-tapi" class="toque" data-fig="anta"><g id="xi-tapi-pos"><g id="xi-tapi-in" style="transform-box:fill-box;transform-origin:50% 100%"><svg x="4" y="400" width="122" height="94" viewBox="0 0 130 100"><use href="#f-anta"/></svg></g></g>${brilhoHotspot(112, 410)}</g>
    <rect width="800" height="500" fill="url(#xiVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#xiGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mundo = el(s, '#xi-mundo');
  const poeCam = x => { camX = x; mundo.setAttribute('transform', `translate(${F(-x)} 0)`); };
  function viaja(x1, ms, fim){ const x0 = camX, t0 = performance.now(); ocupado = true; (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); poeCam(x0 + (x1 - x0) * e); el(s, '#xi-tapi-in').style.transform = k < 1 ? `translateY(${F(-Math.abs(Math.sin(k * 18)) * 5)}px)` : ''; if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0); }
  /* animações de ambiente */
  s.querySelectorAll('#xi-raios path').forEach((r, i) => r.animate([{ opacity:.25 }, { opacity:.65 }, { opacity:.25 }], { duration:5000 + i * 900, iterations:Infinity }));
  s.querySelectorAll('.xi-fr-in').forEach((f, i) => f.animate([{ transform:'rotate(-5deg)' }, { transform:'rotate(5deg)' }], { duration:1400 + i * 130, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  s.querySelectorAll('.xi-asas').forEach((a, i) => a.animate([{ transform:'scaleX(1)' }, { transform:'scaleX(.2)' }], { duration:240 + i * 50, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  el(s, '#xi-ondas1').animate([{ transform:'translateX(0)' }, { transform:'translateX(18px)' }], { duration:3000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  s.querySelectorAll('.xi-tracejado').forEach(t => t.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:1200, iterations:Infinity }));
  s.querySelectorAll('.xi-onda-calor').forEach((o, i) => o.animate([{ transform:'translateY(0)', opacity:.9 }, { transform:'translateY(-8px)', opacity:0 }], { duration:1600 + i * 200, iterations:Infinity }));
  s.querySelectorAll('.xi-enx').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-48 }], { duration:900, iterations:Infinity }));
  s.querySelectorAll('.xi-olho-a, .xi-olho-b').forEach((o, i) => o.animate([{ transform:'scale(.4)', opacity:1 }, { transform:'scale(1.6)', opacity:0 }], { duration:1800, delay:i * 900, iterations:Infinity }));
  s.querySelectorAll('.xi-olho-a, .xi-olho-b').forEach(o => { o.style.transformBox = 'fill-box'; o.style.transformOrigin = '50% 50%'; });
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-8, 8), y, t:i * 2, cor:cor || '#E6F6FF' }); };
  /* ================= FASE 1: coletar sementes ================= */
  const conteudo0 = el(s, '#xi-cesto0-in');
  const fruG = [...s.querySelectorAll('.xi-fruto')];
  const FALA_ESP = { jatoba:'Jatobá! A vagem é dura, e as sementes vêm cobertas por uma farinha docinha.', pequi:'Pequi! Cuidado: dentro do caroço tem espinhos escondidos.', baru:'Baru! A castanha dele é gostosa e forte.', ipe:'As sementes do ipê têm asinhas e voam com o vento!' };
  let slot0 = 0;
  const poeNoCesto = t => {
    for (let k = 0; k < 3; k++) { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)), n = document.createElementNS('http://www.w3.org/2000/svg', 'g'); n.setAttribute('transform', `translate(${F(Math.cos(a) * 42 * r)} ${F(-28 + Math.sin(a) * 6.6 * r - slot0 * .22)}) rotate(${F(R(-40, 40))})`); n.innerHTML = SEM[t]; conteudo0.appendChild(n); n.animate([{ opacity:0 }, { opacity:1 }], { duration:300 }); slot0++; }
    toca('pop'); c.brilhos(CESTO0.x, CESTO0.y - 34, 3, '#FFE27A');
    colhidos++; chip(`Sementes: ${colhidos}/8`);
    el(s, '#xi-cesto0-in').parentNode.animate([{ transform:`translate(${CESTO0.x}px,${CESTO0.y}px) scale(1)` }, { transform:`translate(${CESTO0.x}px,${CESTO0.y}px) scale(1.06,.94)` }, { transform:`translate(${CESTO0.x}px,${CESTO0.y}px) scale(1)` }], { duration:300 });
    if (!especies[t]) { especies[t] = 1; api.diz(FALA_ESP[t]); }
    if (colhidos === 8) fimColeta();
  };
  function arcoAte(g, x0, y0, x1, y1, ms, k1, fim){ const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 70; g.setAttribute('transform', `translate(${F(x)} ${F(y)}) rotate(${F(k * 360)}) scale(${F(1 + (k1 - 1) * e)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  fruG.forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'colher' || g.dataset.feito) return; g.dataset.feito = 1;
    const i = +g.dataset.i, f = FRUTOS[i]; el(g, '.xi-fr-hint').style.display = 'none'; toca('clique');
    if (f.t === 'ipe') {
      el(g, '.xi-vagem').animate([{ transform:'scaleX(1)' }, { transform:'scaleX(1.8)', opacity:.4 }], { duration:500, fill:'forwards' });
      for (let k = 0; k < 4; k++) {
        const n = document.createElementNS('http://www.w3.org/2000/svg', 'g'); n.setAttribute('pointer-events', 'none'); n.innerHTML = `<g transform="scale(1.4)">${SEM.ipe}</g>`; el(s, '#xi-tela0').appendChild(n);
        const x0 = f.x + sorte(-6, 6), y0 = f.y + 20 + k * 6, x1 = CESTO0.x + sorte(-24, 24), y1 = CESTO0.y - 30, dur = 2200 + k * 300, t0 = performance.now() + k * 160, fase0 = sorte(0, 6);
        (function q(t){ if (!vivo) return; const kk = Math.max(0, Math.min(1, (t - t0) / dur)); const x = x0 + (x1 - x0) * kk + Math.sin(kk * 9 + fase0) * 26 * (1 - kk), y = y0 + (y1 - y0) * kk; n.setAttribute('transform', `translate(${F(x)} ${F(y)}) rotate(${F(Math.sin(kk * 12 + fase0) * 30)})`); if (kk < 1) requestAnimationFrame(q); else { n.remove(); if (k === 3) { g.style.display = 'none'; poeNoCesto('ipe'); } } })(performance.now());
      }
      return;
    }
    let x = f.x, y = f.y, vy = 0, rr = 0, quicou = false;
    (function cai(){ if (!vivo) return; vy += .55; y += vy; rr += 4; if (y >= f.chao) { y = f.chao; if (!quicou && vy > 3) { quicou = true; vy = -vy * .32; toca('clique'); respinga(x, f.chao + 30, 2, '#8A6A3A'); } else { g.setAttribute('transform', `translate(${F(x)} ${F(y)})`); return arcoAte(g, x, y, CESTO0.x, CESTO0.y - 52, 700, .6, () => { g.style.display = 'none'; poeNoCesto(f.t); }); } } g.setAttribute('transform', `translate(${F(x)} ${F(y)}) rotate(${F(rr)})`); requestAnimationFrame(cai); })();
  }));
  function fimColeta(){
    fase = 'viagem1'; toca('vitoria'); c.brilhos(CESTO0.x, CESTO0.y - 40, 10, '#FFE27A');
    api.diz('Cesto cheio! Cada árvore dá sementes num tempo diferente. Quem coleta conhece a floresta como ninguém.');
    depois(4600, () => { api.diz('Vamos levar as sementes para a aldeia.'); viaja(800, 2800, comecaMuvuca); });
  }
  /* ================= FASE 2: fazer a muvuca ================= */
  const fontes = [...s.querySelectorAll('.xi-fonte')];
  let arr = null;
  function comecaMuvuca(){
    fase = 'muvuca'; chip('Muvuca: 0/3');
    s.querySelectorAll('.xi-fonte-hint').forEach(h => h.style.display = '');
    api.diz('Na aldeia, as sementes viram muvuca: uma mistura de muitas sementes. Arraste as sementes e a areia para a bacia grande.');
  }
  s.querySelectorAll('.xi-fonte-hint').forEach(h => h.style.display = 'none');
  fontes.forEach(g => g.addEventListener('pointerdown', e => {
    if (fase !== 'muvuca' || g.dataset.feito || ocupado || arr) return; e.stopPropagation();
    const p = c.ponto(e); arr = { g, x0:p.x, y0:p.y, dx:0, dy:0, moveu:false, tipo:g.dataset.t, pos:el(g, '.xi-fonte-pos') }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique');
  }));
  const voaFonte = (pos, x0, y0, x1, y1, ms, fim) => { const t0 = performance.now(); ocupado = true; (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); pos.setAttribute('transform', `translate(${F(x0 + (x1 - x0) * e)} ${F(y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 40)})`); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0); };
  function despeja(g){
    const t = g.dataset.t, o = FONTES[t], pos = el(g, '.xi-fonte-pos'); g.dataset.feito = 1; el(g, '.xi-fonte-hint').style.display = 'none';
    const cur = (pos.getAttribute('transform') || 'translate(0 0)').match(/-?[\d.]+/g).map(Number);
    voaFonte(pos, cur[0], cur[1], BACIA.x + (t === 'arv' ? -60 : t === 'rap' ? 60 : 0) - o.x, BACIA.y - 50 - o.y, 600, () => {
      pos.animate([{ transform:'rotate(0)' }, { transform:`rotate(${t === 'arv' ? 30 : -30}deg)` }, { transform:'rotate(0)' }], { duration:1000 });
      const cx = BACIA.x + (t === 'arv' ? -60 : t === 'rap' ? 60 : 0);
      for (let k = 0; k < 16; k++) depois(k * 50, () => t === 'areia' ? c.add({ tipo:'petala', x:cx + sorte(-10, 10), y:BACIA.y - 60, vy:sorte(2.4, 3.6), f:sorte(0, 6), chao:BACIA.y + sorte(-6, 10), cor:'#F2DCA8', borda:'#B8945A' }) : c.add({ tipo:'semente', x:cx + sorte(-12, 12), y:BACIA.y - 56, vy:1, alvoY:BACIA.y + sorte(-8, 10) }));
      depois(500, () => { el(s, `#xi-m-${t}`).style.opacity = 1; toca(t === 'areia' ? 'chuva' : 'planta'); });
      depois(1100, () => {
        s.querySelectorAll(`#xi-f-${t} .xi-cont, #xi-cesto1-in`).forEach(q => { if (t !== 'arv' && q.id === 'xi-cesto1-in') return; q.style.opacity = 0; });
        voaFonte(pos, BACIA.x + (t === 'arv' ? -60 : t === 'rap' ? 60 : 0) - o.x, BACIA.y - 50 - o.y, 0, 0, 600, () => {
          adicionados++; chip(`Muvuca: ${adicionados}/3`);
          if (t === 'arv') api.diz('Sementes das árvores da floresta. Elas crescem devagar.');
          if (t === 'rap') api.diz('Feijão-de-porco, feijão-guandu e outras plantas que crescem rápido. Elas vão fazer sombra para as árvores pequenas.');
          if (t === 'areia') api.diz('A areia ajuda a espalhar as sementes bem certinho na terra.');
          if (adicionados === 3) depois(2600, comecaMistura);
        });
      });
    });
  }
  s.addEventListener('pointermove', e => {
    if (arr) { const p = c.ponto(e); arr.dx = p.x - arr.x0; arr.dy = p.y - arr.y0; if (Math.hypot(arr.dx, arr.dy) > 8) arr.moveu = true; arr.pos.setAttribute('transform', `translate(${F(arr.dx)} ${F(arr.dy)})`); }
    else if (mexe) giraMistura(e);
    else if (baldeArr) moveBalde(e);
    else if (solArr) moveSol(e);
  });
  s.addEventListener('pointerup', e => {
    if (arr) { const a = arr; arr = null; a.g.style.cursor = 'grab'; const o = FONTES[a.tipo], x = o.x + a.dx, y = o.y + a.dy;
      if (!a.moveu || (Math.abs(x - BACIA.x) < 170 && Math.abs(y - BACIA.y - 10) < 90)) despeja(a.g); else { voaFonte(a.pos, a.dx, a.dy, 0, 0, 500); toca('glub'); api.diz('Solte dentro da bacia grande!'); } }
    else if (mexe) soltaMistura();
    else if (baldeArr) soltaBalde();
    else if (solArr) soltaSol();
  });
  /* mistura: girar o dedo dentro da bacia */
  let mexe = null, voltas = 0;
  const META = 3;
  function comecaMistura(){ fase = 'mistura'; chip(`Voltas: 0/${META}`); el(s, '#xi-giro').style.display = ''; el(s, '#xi-pa').style.opacity = 1; poePa(); api.diz('Agora gire o dedo dentro da bacia para misturar a muvuca!'); }
  const poePa = () => { const a = rot * Math.PI / 180, px = BACIA.x + Math.cos(a) * 70, py = BACIA.y + 3 + Math.sin(a) * 70 * .3; ['#xi-pa-cabo', '#xi-pa-cabo2'].forEach(q => el(s, q).setAttribute('d', `M${F(px)} ${F(py)} L${F(px + 16)} ${F(py - 74)}`)); };
  const atualizaMistura = () => {
    rot = rot % 3600; el(s, '#xi-mistura').setAttribute('transform', `rotate(${F(rot)})`); poePa();
    const k = Math.min(1, giro / (Math.PI * 2 * META));
    el(s, '#xi-m-mix').style.opacity = F(k); el(s, '#xi-m-arv').style.opacity = F(1 - k); el(s, '#xi-m-rap').style.opacity = F(1 - k);
    const v = Math.min(META, Math.floor(giro / (Math.PI * 2))); if (v !== voltas) { voltas = v; chip(`Voltas: ${v}/${META}`); if (v > 0) { toca('pop'); c.brilhos(BACIA.x, BACIA.y, 4, '#FFE27A'); } }
    if (giro >= Math.PI * 2 * META && fase === 'mistura') fimMistura();
  };
  el(s, '#xi-bacia-toque').addEventListener('pointerdown', e => {
    if (fase !== 'mistura' || ocupado) return; e.stopPropagation(); const p = c.ponto(e);
    mexe = { a:Math.atan2((p.y - BACIA.y) / .45, p.x - BACIA.x), moveu:0 }; s.setPointerCapture(e.pointerId); el(s, '#xi-giro').style.display = 'none';
  });
  function giraMistura(e){ const p = c.ponto(e), a = Math.atan2((p.y - BACIA.y) / .45, p.x - BACIA.x); let d = a - mexe.a; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; mexe.a = a; mexe.moveu += Math.abs(d); giro += Math.abs(d); rot += d * 180 / Math.PI; if (Math.random() < .25) c.add({ tipo:'brilho', x:p.x, y:p.y, cor:'#FFE6A8' }); atualizaMistura(); }
  function soltaMistura(){ const m = mexe; mexe = null; if (fase !== 'mistura') return; if (m.moveu < .3) autoGiro(); else if (giro < Math.PI * 2 * META) el(s, '#xi-giro').style.display = ''; }
  function autoGiro(){ ocupado = true; const g0 = giro, r0 = rot, t0 = performance.now(); toca('clique'); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 900); giro = g0 + Math.PI * 2 * k; rot = r0 + 360 * k; atualizaMistura(); if (k < 1 && fase === 'mistura') requestAnimationFrame(q); else ocupado = false; })(t0); }
  function fimMistura(){
    fase = 'viagem2'; el(s, '#xi-giro').style.display = 'none'; toca('vitoria'); c.brilhos(BACIA.x, BACIA.y, 10, '#FFE27A');
    el(s, '#xi-mistura').setAttribute('transform', `rotate(${F(rot)})`);
    api.diz('Muvuca pronta! Muitas espécies juntas, como numa floresta de verdade.');
    depois(4200, () => { api.diz('O rio Xingu nasce fora do território, em fazendas. Vamos levar a muvuca até lá!'); depois(1800, () => viaja(1600, 3200, chegaNascente)); });
  }
  /* ================= FASE 3: semear a beira do rio e ver o tempo passar ================= */
  s.querySelectorAll('.xi-zona-hint').forEach(h => h.style.display = 'none');
  function chegaNascente(){
    fase = 'chuvaRuim'; el(s, '#xi-chuva-nuvem').style.opacity = 1; el(s, '#xi-enxurrada').style.opacity = 1;
    c.chover(40, 780, 20, 330, 70, '#9AC8E8'); toca('chuva');
    api.diz('Ih! Aqui cortaram a mata da beira do rio. Sem árvores, a chuva leva a terra para a água, e o riacho fica barrento e quente.');
    depois(4200, () => { el(s, '#xi-chuva-nuvem').style.opacity = 0; el(s, '#xi-enxurrada').style.opacity = 0; });
    depois(6400, comecaSemear);
  }
  function comecaSemear(){ fase = 'semear'; chip('Semeado: 0/4'); s.querySelectorAll('.xi-zona-hint').forEach(h => h.style.display = ''); el(s, '#xi-balde-hint').style.display = ''; api.diz('Arraste o balde de muvuca sobre a terra pelada para semear.'); }
  const zonas = [...s.querySelectorAll('.xi-zona')], zProg = [0, 0, 0, 0];
  let baldeArr = null, bx = 690, by = 378;
  const poeBalde = (x, y, r) => { bx = x; by = y; el(s, '#xi-balde-pos').setAttribute('transform', `translate(${F(x)} ${F(y)})${r ? ` rotate(${r})` : ''}`); };
  const dentroZona = (z, x, y) => Math.pow((x - z.x) / z.rx, 2) + Math.pow((y - z.y) / (z.ry + 10), 2) < 1.2;
  function semeia(i){
    const z = ZONAS[i], g = zonas[i]; if (g.dataset.feito) return; g.dataset.feito = 1;
    el(g, '.xi-zona-hint').style.display = 'none'; el(g, '.xi-zona-sem').style.opacity = .35; el(g, '.xi-zona-pontos').style.opacity = 1;
    toca('planta'); c.brilhos(z.x, z.y - 10, 5, '#E8D48A'); semeadas++; chip(`Semeado: ${semeadas}/4`);
    const falas = ['Semente na beira da nascente!', 'Muvuca na terra! Cada semente tem seu tempo de brotar.', 'Aqui vão nascer plantas rápidas e árvores juntas.', 'Mais um pedaço semeado!'];
    if (semeadas < 4) api.diz(falas[semeadas - 1]);
    else { el(s, '#xi-balde-hint').style.display = 'none'; depois(900, () => { poeBalde(690, 378); comecaTempo(); }); }
  }
  el(s, '#xi-balde').addEventListener('pointerdown', e => { if (fase !== 'semear' || ocupado) return; e.stopPropagation(); const p = c.ponto(e); baldeArr = { dx:p.x - bx, dy:p.y - by, x0:p.x, y0:p.y, moveu:false, ux:p.x, uy:p.y }; s.setPointerCapture(e.pointerId); toca('clique'); });
  function moveBalde(e){
    const p = c.ponto(e), a = baldeArr; if (Math.hypot(p.x - a.x0, p.y - a.y0) > 8) a.moveu = true;
    poeBalde(Math.max(30, Math.min(770, p.x - a.dx)), Math.max(220, Math.min(480, p.y - a.dy)), -30);
    const d = Math.hypot(p.x - a.ux, p.y - a.uy); a.ux = p.x; a.uy = p.y;
    ZONAS.forEach((z, i) => { if (zonas[i].dataset.feito || !dentroZona(z, bx, by + 20)) return; zProg[i] += d; if (Math.random() < .5) c.add({ tipo:'semente', x:bx - 14 + sorte(-6, 6), y:by - 6, vy:1, alvoY:Math.min(by + 26, z.y + z.ry * .6) }); if (zProg[i] > 70) semeia(i); });
  }
  function soltaBalde(){
    const a = baldeArr; baldeArr = null;
    if (!a.moveu) { const i = zonas.findIndex(g => !g.dataset.feito); if (i >= 0) jogaEm(i); return; }
    voltaBalde();
  }
  function voltaBalde(){ const x0 = bx, y0 = by, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 500), e = k * k * (3 - 2 * k); poeBalde(x0 + (690 - x0) * e, y0 + (378 - y0) * e); if (k < 1) requestAnimationFrame(q); })(t0); }
  function jogaEm(i){
    if (fase !== 'semear' || ocupado || zonas[i].dataset.feito) return; ocupado = true; const z = ZONAS[i], x0 = bx, y0 = by, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 600), e = k * k * (3 - 2 * k); poeBalde(x0 + (z.x + 16 - x0) * e, y0 + (z.y - 30 - y0) * e - Math.sin(k * Math.PI) * 30, -30 * e);
      if (k < 1) requestAnimationFrame(q); else { for (let j = 0; j < 12; j++) depois(j * 60, () => c.add({ tipo:'semente', x:z.x + sorte(-z.rx * .6, z.rx * .6), y:z.y - 34, vy:1, alvoY:z.y + sorte(-z.ry * .4, z.ry * .4) })); depois(800, () => { semeia(i); ocupado = false; if (semeadas < 4) voltaBalde(); }); } })(t0);
  }
  zonas.forEach((g, i) => g.addEventListener('click', e => { e.stopPropagation(); if (fase === 'semear') jogaEm(i); }));
  /* o sol atravessa o céu: o tempo passa */
  let solArr = null, sx = 92, solOc = false;
  const solY = x => 74 - 44 * Math.sin(Math.PI * Math.max(0, Math.min(1, (x - 92) / (712 - 92))));
  const poeSol = x => { sx = x; el(s, '#xi-sol-pos').setAttribute('transform', `translate(${F(x)} ${F(solY(x))})`); };
  function comecaTempo(){ fase = 'tempo'; chip(`Tempo: 0/3`); el(s, '#xi-sol-hint').style.display = ''; api.diz('Tudo semeado, bem no começo das chuvas! Agora arraste o sol pelo céu para o tempo passar.'); }
  el(s, '#xi-sol').addEventListener('pointerdown', e => { if (fase !== 'tempo' || ocupado || solOc) return; e.stopPropagation(); const p = c.ponto(e); solArr = { dx:p.x - sx, x0:p.x, moveu:false }; s.setPointerCapture(e.pointerId); el(s, '#xi-sol-hint').style.display = 'none'; toca('clique'); });
  el(s, '#xi-sol').addEventListener('click', e => { if (fase === 'tempo') return; e.stopPropagation(); if (fase === 'semear' || fase === 'fim') return; toca('ok'); c.brilhos(sx, solY(sx), 5, '#FFE27A'); api.diz('Sem sombra, o sol esquenta a água do riacho.'); });
  function moveSol(e){ const p = c.ponto(e); if (Math.abs(p.x - solArr.x0) > 8) solArr.moveu = true; poeSol(Math.max(92, Math.min(712, p.x - solArr.dx))); el(s, '#xi-noite').setAttribute('opacity', F(Math.max(0, (sx - 520) / 192) * .35)); }
  function soltaSol(){ const a = solArr; solArr = null; if (!a.moveu || sx > 560) autoSol(); else { const x0 = sx, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 500); poeSol(x0 + (92 - x0) * k); el(s, '#xi-noite').setAttribute('opacity', 0); if (k < 1) requestAnimationFrame(q); else el(s, '#xi-sol-hint').style.display = ''; })(t0); } }
  function autoSol(){
    solOc = true; ocupado = true; const x0 = sx, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1300); poeSol(x0 + (712 - x0) * k); el(s, '#xi-noite').setAttribute('opacity', F(Math.max(0, (sx - 520) / 192) * .45)); if (k < 1) requestAnimationFrame(q); else passaTempo(); })(t0);
  }
  function passaTempo(){
    tempo++; chip(`Tempo: ${tempo}/3`); toca('chuva');
    el(s, '#xi-chuva-nuvem').style.opacity = 1; c.chover(40, 780, 20, 360, 60, '#9AD0FF');
    const noite = el(s, '#xi-noite'); noite.setAttribute('opacity', 0); const an = noite.animate([{ opacity:.45 }, { opacity:.2 }, { opacity:0 }], { duration:2000 });
    poeSol(92);
    depois(900, () => {
      s.querySelectorAll(`.xi-g${tempo}`).forEach(g => g.style.transform = 'scale(1)'); toca('planta');
      if (tempo === 1) { el(s, '#xi-rio-barro').style.opacity = .75; el(s, '#xi-rio-limpo').style.opacity = .25; el(s, '#xi-nasc-limpa').style.opacity = .3; el(s, '#xi-verde').style.opacity = .2; el(s, '#xi-rio-ondasB').style.opacity = .5; api.diz('Primeiro brotam as plantas rápidas. Elas cobrem o chão e seguram a terra.'); }
      if (tempo === 2) { el(s, '#xi-rio-barro').style.opacity = .35; el(s, '#xi-rio-limpo').style.opacity = .65; el(s, '#xi-nasc-limpa').style.opacity = .7; el(s, '#xi-calor').style.opacity = .25; el(s, '#xi-verde').style.opacity = .55; el(s, '#xi-rio-ondasB').style.opacity = .2; el(s, '#xi-vocoroca').style.opacity = .4; el(s, '#xi-nasc-vida').style.opacity = .6; el(s, '#xi-margem-capim').style.opacity = .6; s.querySelectorAll('#xi-tocos g').forEach(t => t.style.opacity = .6); api.diz('As plantas rápidas fazem sombra, e as arvorezinhas crescem protegidas.'); }
      if (tempo === 3) { fimTempo(); return; }
      depois(1800, () => { el(s, '#xi-chuva-nuvem').style.opacity = 0; ocupado = false; solOc = false; el(s, '#xi-sol-hint').style.display = ''; });
    });
  }
  let peixes = false;
  function fimTempo(){
    fase = 'final'; el(s, '#xi-rio-barro').style.opacity = 0; el(s, '#xi-rio-limpo').style.opacity = 1; el(s, '#xi-rio-brilho').style.opacity = 1; el(s, '#xi-calor').style.opacity = 0;
    el(s, '#xi-nasc-barro').style.opacity = 0; el(s, '#xi-nasc-limpa').style.opacity = 1; el(s, '#xi-olho').style.opacity = 1; el(s, '#xi-sombra-rio').style.opacity = 1; el(s, '#xi-nasc-vida').style.opacity = 1; el(s, '#xi-margem-capim').style.opacity = 1; el(s, '#xi-tocos').style.opacity = 0; el(s, '#xi-verde').style.opacity = .92; el(s, '#xi-rio-ondasB').style.opacity = 0; el(s, '#xi-vocoroca').style.opacity = 0; el(s, '#xi-enxurrada').style.display = 'none';
    toca('vitoria'); c.brilhos(400, 300, 12, '#FFE27A'); depois(1800, () => el(s, '#xi-chuva-nuvem').style.opacity = 0);
    api.diz('Cresceu uma mata na beira do rio! A sombra deixa a água fresquinha, e as raízes seguram a terra.');
    depois(2400, () => { peixes = true; festaTapi(); api.diz('A nascente está limpa, e os peixes voltaram!'); });
    depois(8600, vistaEspaco);
  }
  function vistaEspaco(){
    fase = 'fim'; const esp = el(s, '#xi-espaco'); esp.style.display = ''; toca('ok');
    esp.animate([{ opacity:0 }, { opacity:1 }], { duration:1400, fill:'forwards' });
    el(s, '#xi-mapa').animate([{ transform:'scale(1.7)' }, { transform:'scale(1)' }], { duration:2600, easing:'cubic-bezier(.2,.8,.3,1)', fill:'forwards' });
    api.diz('Vista do espaço, o Território Indígena do Xingu é uma ilha verde no meio das fazendas.');
    depois(1600, () => { el(s, '#xi-pino').style.opacity = 1; el(s, '.xi-pino-a').animate([{ transform:'scale(.6)', opacity:1 }, { transform:'scale(2.2)', opacity:0 }], { duration:1400, iterations:Infinity }); });
    depois(3000, () => { s.querySelectorAll('#xi-fitas path').forEach((p, i) => depois(i * 500, () => { p.style.strokeDashoffset = 0; toca('planta'); })); });
    depois(5200, () => { toca('vitoria'); api.diz('Os povos do Xingu cuidam da floresta, e as sementes deles ajudam a cuidar das nascentes do rio!'); depois(6400, api.fim); });
  }
  /* ================= toques extras ================= */
  function festaTapi(){ el(s, '#xi-tapi-in').animate([{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(-12px) rotate(-6deg)' }, { transform:'translateY(0) rotate(4deg)' }, { transform:'translateY(-6px) rotate(0)' }, { transform:'translateY(0)' }], { duration:900 }); }
  let tapK = 0;
  el(s, '#xi-tapi').addEventListener('click', () => { toca('pop'); festaTapi(); [180, 150].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .14, 'triangle', .07, f * 1.3), i * 140));
    const falas = ['Eu sou uma anta, o maior mamífero terrestre do Brasil!', 'Quando eu era bebê, tinha listras e pintinhas, como uma melancia!', 'Eu como frutas e espalho as sementes pelo cocô. Sou jardineira da floresta!', 'Eu adoro nadar no rio e me refrescar na água limpa.'];
    api.diz(falas[tapK++ % falas.length]); });
  el(s, '#xi-coletora').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#xi-braco-col').animate([{ transform:'rotate(0)' }, { transform:'rotate(-18deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:800 }); api.diz('Bom dia! Eu sei quando cada fruto fica maduro. A floresta tem um calendário!'); });
  el(s, '#xi-menino').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#xi-menino').animate([{ transform:'translate(614px,486px) scale(1.2)' }, { transform:'translate(614px,476px) scale(1.2)' }, { transform:'translate(614px,486px) scale(1.2)' }], { duration:500, iterations:2 }); api.diz('Depois da coleta, vou para a escola da aldeia. Lá a gente aprende na nossa língua e em português.'); });
  let ararOc = false;
  el(s, '#xi-araras').addEventListener('click', e => { e.stopPropagation(); if (ararOc) return; ararOc = true; [900, 1200, 800, 1100].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sawtooth', .035, f * .7), i * 170));
    ['#xi-arara-a', '#xi-arara-b'].forEach((q, i) => el(s, q).animate([{ transform:'translate(0,0)' }, { transform:`translate(${120 + i * 30}px,-40px)` }, { transform:`translate(${300 + i * 20}px,${20 - i * 20}px)` }, { transform:`translate(${140 - i * 20}px,-30px)` }, { transform:'translate(0,0)' }], { duration:4200, easing:'ease-in-out' }));
    api.diz('Araras-canindé! Elas voam em casal e conversam bem alto.'); depois(4300, () => { ararOc = false; }); });
  let cutOc = false;
  el(s, '#xi-cutia').addEventListener('click', e => { e.stopPropagation(); if (cutOc) return; cutOc = true; toca('clique');
    const g = el(s, '#xi-cutia-pos'); g.animate([{ transform:'translate(556px,452px)' }, { transform:'translate(530px,458px)' }, { transform:'translate(506px,462px)' }, { transform:'translate(506px,464px) rotate(-8deg)' }, { transform:'translate(506px,462px)' }, { transform:'translate(556px,452px)' }], { duration:3000, easing:'ease-in-out' });
    depois(1500, () => { el(s, '#xi-cutia-sem').style.opacity = 0; respinga(470, 466, 3, '#8A6A3A'); toca('pop'); });
    depois(3200, () => { el(s, '#xi-cutia-sem').style.opacity = 1; cutOc = false; });
    api.diz('A cutia enterra sementes para comer depois. Muitas ela esquece, e elas viram árvores!'); });
  let moOc = false;
  el(s, '#xi-morphos').addEventListener('click', e => { e.stopPropagation(); if (moOc) return; moOc = true; toca('pop');
    s.querySelectorAll('.xi-mo-voo').forEach((b, i) => b.animate([{ transform:'translate(0,0)' }, { transform:`translate(${40 + i * 30}px,-50px)` }, { transform:`translate(${-60 + i * 20}px,-20px)` }, { transform:`translate(${20 - i * 10}px,-80px)` }, { transform:'translate(0,0)' }], { duration:4000, easing:'ease-in-out' }));
    api.diz('Borboleta-azul! As asas brilham quando batem no sol.'); depois(4100, () => { moOc = false; }); });
  el(s, '#xi-fig-jatoba').addEventListener('click', () => { toca('pop'); c.brilhos(182, 456, 4, '#FFE27A'); api.diz('Uma vagem de jatobá caída no chão. Dentro tem farinha docinha!'); });
  el(s, '#xi-ipe').addEventListener('click', e => { if (e.target.closest('.xi-fruto')) return; toca('planta'); for (let i = 0; i < 14; i++) c.add({ tipo:'petala', x:sorte(620, 780) - camX, y:sorte(110, 170), vy:sorte(.6, 1.2), f:sorte(0, 6), chao:sorte(420, 470), cor:Math.random() < .5 ? '#FFE45A' : '#FFC83D', borda:'#C8800A' }); api.diz('O ipê-amarelo floresce na seca, quando perde as folhas.'); });
  /* aldeia */
  let banOc = false;
  el(s, '#xi-banho').addEventListener('click', e => { e.stopPropagation(); if (banOc) return; banOc = true;
    s.querySelectorAll('.xi-cri-in').forEach((k, i) => k.animate([{ transform:'translateY(0)' }, { transform:'translateY(-22px)', offset:.3 }, { transform:'translateY(40px)', offset:.6 }, { transform:'translateY(40px)', offset:.75 }, { transform:'translateY(0)' }], { duration:1800, delay:i * 220 }));
    [0, 220, 440].forEach((d, i) => depois(d + 700, () => { toca('splash'); respinga([530, 574, 616][i], 214, 4); }));
    [660, 880, 760].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'triangle', .05, f * 1.3), 300 + i * 120));
    api.diz('Banho de rio! A criançada adora pular na água limpa do Xingu.'); depois(2400, () => { banOc = false; }); });
  let canOc = false;
  el(s, '#xi-canoa').addEventListener('click', e => { e.stopPropagation(); if (canOc) return; canOc = true; toca('splash');
    el(s, '#xi-canoa-pos').animate([{ transform:'translateX(0)' }, { transform:'translateX(-120px)' }, { transform:'translateX(0)' }], { duration:5000, easing:'ease-in-out' });
    api.diz('Peixe com beiju de mandioca é comida de todo dia por aqui. Pescar de canoa faz parte da vida no Xingu.'); depois(5100, () => { canOc = false; }); });
  el(s, '#xi-barco').addEventListener('click', e => { e.stopPropagation(); if (somOn) for (let i = 0; i < 8; i++) tom(70 + (i % 2) * 8, i * .08, .08, 'sawtooth', .04); el(s, '#xi-motor').animate([{ transform:'translateY(0)' }, { transform:'translateY(-1.5px)' }], { duration:80, iterations:10, direction:'alternate' }); api.diz('Para ir longe pelo rio, também tem barco a motor.'); });
  el(s, '#xi-casa-toque').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Nestas casas grandes de palha, várias famílias moram juntas.'); });
  let tracOc = false;
  el(s, '#xi-tracaja').addEventListener('click', () => { if (tracOc) return; tracOc = true; toca('glub');
    el(s, '#xi-traca-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(10px,-6px)', offset:.25 }, { transform:'translate(24px,-34px)', opacity:1, offset:.5 }, { transform:'translate(30px,-40px)', opacity:0, offset:.6 }, { transform:'translate(0,0)', opacity:0, offset:.85 }, { transform:'translate(0,0)', opacity:1 }], { duration:4200 });
    depois(2200, () => respinga(340, 230, 4)); api.diz('Tracajá tomando sol no tronco! Quando alguém chega perto, ele pula na água.'); depois(4300, () => { tracOc = false; }); });
  el(s, '#xi-faz1').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#xi-braco-faz').animate([{ transform:'rotate(0)' }, { transform:'rotate(-70deg)' }, { transform:'rotate(-50deg)' }, { transform:'rotate(-70deg)' }, { transform:'rotate(0)' }], { duration:1200 }); api.diz('Eu tenho uma fazenda onde nasce um riacho. Vim buscar a muvuca!'); });
  el(s, '#xi-coletora2').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Aqui na rede de sementes trabalham juntos indígenas, agricultores e gente da cidade.'); });
  /* fazenda */
  el(s, '#xi-faz2').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#xi-braco-faz2').animate([{ transform:'rotate(0)' }, { transform:'rotate(-70deg)' }, { transform:'rotate(-50deg)' }, { transform:'rotate(-70deg)' }, { transform:'rotate(0)' }], { duration:1200 });
    api.diz(tempo >= 3 ? 'Minha nascente está viva de novo! Obrigada, rede de sementes!' : 'Quero a nascente da minha fazenda limpa e viva de novo!'); });
  el(s, '#xi-bois').addEventListener('click', e => { e.stopPropagation(); if (somOn) { tom(150, 0, .5, 'sawtooth', .05, 110); tom(110, .45, .4, 'sawtooth', .04, 90); } api.diz('Muuu! Com uma cerca, o gado fica longe da beira do rio, e a mata pode crescer.'); });
  el(s, '#xi-ipe2').addEventListener('click', () => { toca('planta'); for (let i = 0; i < 14; i++) c.add({ tipo:'petala', x:sorte(570, 640), y:sorte(180, 220), vy:sorte(.5, 1), f:sorte(0, 6), chao:sorte(270, 290), cor:Math.random() < .5 ? '#FFE45A' : '#FFC83D', borda:'#C8800A' }); api.diz(tempo >= 3 ? 'O ipê-amarelo agora tem muita companhia!' : 'Este ipê-amarelo ficou sozinho no pasto. Logo ele vai ganhar companhia!'); });
  el(s, '#xi-nascente').addEventListener('click', e => { e.stopPropagation(); if (fase === 'semear') { jogaEm(0); return; } toca('glub'); for (let i = 0; i < 5; i++) c.add({ tipo:'bolha', x:148 + sorte(-10, 10), y:318, vy:sorte(.3, .6), r:sorte(1.4, 2.6), topo:300, f:sorte(0, 6) }); api.diz('Aqui é a nascente, onde a água sai de dentro da terra.'); });
  /* ambiente no canvas: poeira de luz na floresta e peixes no riacho limpo */
  const motes = Array.from({ length:40 }, () => ({ x:sorte(380, 800), y:sorte(40, 460), r:sorte(.8, 2), f:sorte(0, 6), v:sorte(.08, .25) }));
  const peixeL = Array.from({ length:6 }, (_, k) => ({ t:k / 6, v:sorte(.0006, .0012), f:sorte(0, 6), cor:k % 2 ? '#E8C86A' : '#C8D6E0' }));
  c.desenho(ctx => {
    const tt = performance.now() / 1000;
    if (camX < 800) { ctx.fillStyle = '#FFF8D8'; motes.forEach(p => { p.y -= p.v; if (p.y < 30) p.y = 460; const x = p.x + Math.sin(tt * .5 + p.f) * 8 - camX; ctx.globalAlpha = .25 + .3 * Math.sin(tt * 1.4 + p.f) ** 2; ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 7); ctx.fill(); }); }
    if (peixes && camX > 1500 && fase !== 'fim') peixeL.forEach(p => {
      p.t += p.v; if (p.t > .98) p.t = .1;
      const [x, y] = rioPt(p.t), [x2, y2] = rioPt(p.t + .01), ang = Math.atan2(y2 - y, x2 - x), xx = x + 1600 - camX, yy = y + Math.sin(tt * 2 + p.f) * 3;
      ctx.save(); ctx.translate(xx, yy); ctx.rotate(ang); ctx.globalAlpha = .9; ctx.fillStyle = p.cor; ctx.strokeStyle = '#2E4A5A'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-11, -3.4 + Math.sin(tt * 12 + p.f)); ctx.lineTo(-11, 3.4 + Math.sin(tt * 12 + p.f)); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 7.4, 3, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(4, -.6, .9, 0, 7); ctx.fill(); ctx.restore();
    });
    ctx.globalAlpha = 1;
  });
  chip('Sementes: 0/8');
  api.diz('Oi, eu sou a Tapi, uma antinha do Xingu! No Território Indígena do Xingu vivem muitos povos, cada um com sua língua e seu jeito de viver.');
  api.diz('Toque nos frutos das árvores para colher sementes no cesto.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
