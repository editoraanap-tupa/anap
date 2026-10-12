/* ================= JOGO: Kaingang, Alta Paulista: o morro, a chuva e o rio ================= */
function jogoKaingang(palco, api){
  semente = 263;
  const BANK = 386, GTOP = 242, GBOT = 388;
  const MC = [{ x:252, t:'jeriva' }, { x:338, t:'ipe' }, { x:548, t:'embauba' }, { x:694, t:'copa' }];
  const ROWS = [266, 304, 342];
  const BAR = [{ x:445, y:292 }, { x:446, y:342 }];
  const ACHA = [{ x:566, y:432, t:'lambari' }, { x:352, y:436, t:'piapara' }, { x:726, y:438, t:'bigua' }];
  const NASC = { x:618, y:384 };
  let vivo = true, fase = 'chuva1', chuvas = 0, mudas = 0, linhas = 0, feixes = 0, anos = 0, achados = 0, criancas = 0, ocupado = false, lama = 0, verde = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const F = n => n.toFixed(1);
  /* ---------- geometria da voçoroca ---------- */
  const GX = y => 444 + Math.sin((y - 240) / 21) * 3.4;
  const GW = (y, k) => { const t = Math.max(0, y - GTOP); return k * (3 + 30 * Math.sqrt(t / 146) + t * .14 + 2.6 * Math.sin(t / 9)); };
  const gulD = (k, ex) => { const L = [], Rr = []; for (let y = GTOP; y <= GBOT; y += 6) { const w = GW(y, k) + (y > 250 ? Math.sin(y * .71) * 1.3 * k : 0) + (ex || 0); L.push(`${F(GX(y) - w)} ${y}`); Rr.push(`${F(GX(y) + w)} ${y}`); } return `M${GX(GTOP - 3)} ${GTOP - 3 - (ex || 0)} L${L.join(' L')} L${Rr.reverse().join(' L')}Z`; };
  const ramo = (x0, y0, x1, y1, w) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; let a = [], b = []; for (let k = 0; k <= 8; k++) { const t = k / 8, ww = w * (1 - t * .85) + Math.sin(k * 1.7) * .8, cx = x0 + dx * t + Math.sin(t * 5) * 2, cy = y0 + dy * t; a.push(`${F(cx + nx * ww)} ${F(cy + ny * ww)}`); b.push(`${F(cx - nx * ww)} ${F(cy - ny * ww)}`); } return `M${a.join(' L')} L${b.reverse().join(' L')}Z`; };
  const vaca = (x, y, k, f, cor) => `<g transform="translate(${x} ${y}) scale(${k * f} ${k})"><ellipse cx="0" cy="1" rx="15" ry="2.2" fill="#5A2E10" opacity=".3"/><path d="M-10 0 v-9 M-6 0 v-9 M7 0 v-9 M10 0 v-9" stroke="#8A8278" stroke-width="2.4" stroke-linecap="round"/><path d="M-10 0 h1.6 M-6 0 h1.6 M7 0 h1.6 M10 0 h1.6" stroke="#2A2420" stroke-width="2"/><path d="M-14 -15 C-14 -21 -4 -22 4 -21 C6 -24 10 -24 11 -20 L12 -9 C6 -7 -6 -7 -13 -9Z" fill="${cor}" stroke="#7A7268" stroke-width=".9"/><path d="M4 -21 C6 -24 10 -24 11 -20" fill="#CFC8BC" stroke="#7A7268" stroke-width=".8"/><path d="M-14 -13 c-3 2 -3 7 -2 10" stroke="#7A7268" stroke-width="1" fill="none"/><path d="M-15.6 -3 l-1 2" stroke="#2A2420" stroke-width="1.4"/><path d="M10 -19 C13 -20 17 -17 18 -12 C19 -9 17 -7 15 -8 C13 -10 11 -14 10 -19Z" fill="${cor}" stroke="#7A7268" stroke-width=".9"/><path d="M11 -17 l-3 4 M15.4 -18 l1 -3 M12 -18.6 l-1 -3" stroke="#9A9286" stroke-width="1.4" stroke-linecap="round"/><path d="M11 -17 l-3 4" stroke="#D8D0C4" stroke-width=".8"/><circle cx="15.4" cy="-14.6" r=".9" fill="#1A1410"/><circle cx="15.7" cy="-14.9" r=".3" fill="#fff"/><ellipse cx="17.6" cy="-9.6" rx="1.6" ry="1.2" fill="#3A3430"/><path d="M-6 -11 C-2 -6 4 -6 8 -10 L8 -6 C4 -3 -2 -3 -6 -7Z" fill="#E8E2D8" opacity=".6"/><path d="M-10 -18 h12" stroke="#fff" stroke-width="1.6" opacity=".6" stroke-linecap="round"/></g>`;
  const CRISTA = [[0, 214], [100, 198], [210, 184], [290, 179], [360, 184], [410, 198], [450, 212], [490, 212], [560, 200], [640, 192], [720, 192], [800, 202]];
  const crista = x => { for (let i = 1; i < CRISTA.length; i++) if (x <= CRISTA[i][0]) { const [a, b] = CRISTA[i - 1], [c2, d] = CRISTA[i], t = (x - a) / (c2 - a); return b + (d - b) * (t * t * (3 - 2 * t)); } return 202; };
  const CO = x => -16 * Math.exp(-Math.pow((x - 448) / 80, 2)) + 7 * Math.exp(-Math.pow((x - 280) / 120, 2)) + 6 * Math.exp(-Math.pow((x - 660) / 110, 2));
  const rowY = (i, x) => ROWS[i] + CO(x) * (.6 + i * .2);
  const naGrota = (x, y) => Math.abs(x - GX(y)) < GW(y, 1) + 9;
  const rowD = i => { let d = ''; for (let x = 232; x <= 668; x += 8) d += (x === 232 ? 'M' : 'L') + x + ' ' + F(rowY(i, x)) + ' '; return d; };
  /* ---------- desenhos ---------- */
  const tufo = (x, y, h, c1, c2) => `<path d="M${F(x - 5)} ${F(y)} q1 ${F(-h * .6)} -3 ${F(-h)} M${F(x - 1)} ${F(y)} q0 ${F(-h * .7)} 1 ${F(-h * 1.15)} M${F(x + 3)} ${F(y)} q1 ${F(-h * .6)} 5 ${F(-h * .9)}" stroke="${c2}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${F(x - 5)} ${F(y)} q1 ${F(-h * .6)} -3 ${F(-h)} M${F(x - 1)} ${F(y)} q0 ${F(-h * .7)} 1 ${F(-h * 1.15)} M${F(x + 3)} ${F(y)} q1 ${F(-h * .6)} 5 ${F(-h * .9)}" stroke="${c1}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  const toco = (x, y, w) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${w * 1.2}" ry="${F(w * .32)}" fill="#6A3418" opacity=".3"/><path d="M${x - w / 2} ${y} V${F(y - w * .9)} L${F(x - w * .2)} ${F(y - w * 1.05)} L${F(x + w * .1)} ${F(y - w * .86)} L${x + w / 2} ${F(y - w)} V${y}Z" fill="url(#kgTronco)" stroke="#3A2210" stroke-width="1.1"/><ellipse cx="${x}" cy="${F(y - w * .92)}" rx="${F(w / 2)}" ry="${F(w * .16)}" fill="#D8B080" stroke="#5E3A1E" stroke-width=".8"/><ellipse cx="${x}" cy="${F(y - w * .92)}" rx="${F(w / 4.4)}" ry="${F(w * .08)}" fill="none" stroke="#9A6A3E" stroke-width=".6"/><path d="M${x - w / 2} ${y} l${F(-w * .4)} 1 M${x + w / 2} ${y} l${F(w * .4)} 1" stroke="#4A2A14" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const casa = (x, y, w, h, par, tel, porta) => `<g><rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${par}" stroke="#6A3A24" stroke-width=".9"/><path d="M${x - 3} ${y - h + 1} L${x + w / 2} ${y - h - h * .62} L${x + w + 3} ${y - h + 1}Z" fill="${tel}" stroke="#7A2A16" stroke-width=".9" stroke-linejoin="round"/><path d="M${x} ${y - h - 1} L${x + w / 2} ${F(y - h - h * .5)} L${x + w} ${y - h - 1}" stroke="#F09A7A" stroke-width=".8" fill="none" opacity=".8"/><rect x="${F(x + w * .16)}" y="${F(y - h * .62)}" width="${F(w * .22)}" height="${F(h * .26)}" fill="#7EC0E0" stroke="#6A3A24" stroke-width=".6"/><rect x="${F(x + w * (porta || .6))}" y="${F(y - h * .6)}" width="${F(w * .2)}" height="${F(h * .6)}" fill="${porta ? '#3E7A9A' : '#8A4A2A'}" stroke="#5A2A14" stroke-width=".6"/><rect x="${x + w * .7}" y="${y - h}" width="${F(w * .3)}" height="${h}" fill="#000" opacity=".08"/></g>`;
  const mangueira = (x, y, r) => `<g><path d="M${x} ${y} V${y - r * .9}" stroke="#4A3020" stroke-width="${F(r * .22)}"/><path d="${copa(x, y - r * 1.25, r, r * .8, 10, .3)}" fill="url(#kgCopaEsc)" stroke="#173E2A" stroke-width=".9"/><path d="${copa(x - r * .25, y - r * 1.4, r * .5, r * .36, 7, .3)}" fill="#4E9A5E" opacity=".7"/></g>`;
  const bananeira = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 V-18" stroke="#6E8A3A" stroke-width="3"/><path d="M0 -18 C-10 -24 -18 -22 -22 -16 C-14 -18 -8 -18 0 -16Z M0 -18 C10 -26 18 -24 22 -18 C14 -19 8 -19 0 -16Z M0 -18 C-4 -28 -2 -34 4 -36 C2 -30 2 -24 0 -17Z" fill="#7AB848" stroke="#3E6A22" stroke-width=".8"/></g>`;
  /* árvores da mata ciliar: base (0,0), crescem por escala */
  const arvore = t => {
    if (t === 'jeriva') {
      const fr = [[-58, 26, 1], [-34, 22, 1], [-8, 20, 1], [8, 20, -1], [34, 22, -1], [58, 26, -1], [-80, 18, 1], [80, 18, -1]].map(([a, L, s2]) => { const r = a * Math.PI / 180, x1 = Math.sin(r) * 44, y1 = -100 - Math.cos(r) * 20 + Math.abs(a) * .36; let fol = ''; for (let k = 1; k < 9; k++) { const tt = k / 9, px = x1 * tt, py = -100 + (y1 + 100) * tt - Math.sin(tt * Math.PI) * 10; fol += `M${F(px)} ${F(py)} l${F(-3 + s2 * 2)} ${F(9 - tt * 3)} M${F(px)} ${F(py)} l${F(3 + s2 * 2)} ${F(8 - tt * 3)} `; } return `<path d="M0 -100 Q${F(x1 * .5)} ${F(-100 + (y1 + 100) * .5 - 14)} ${F(x1)} ${F(y1)}" stroke="#2E5A22" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="${fol}" stroke="#5E9E3A" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M0 -100 Q${F(x1 * .5)} ${F(-100 + (y1 + 100) * .5 - 14)} ${F(x1)} ${F(y1)}" stroke="#9AD06A" stroke-width=".9" fill="none" opacity=".8"/>`; }).join('');
      return `<path d="M-3 0 C-2 -40 -2 -70 -1 -100 H2 C2 -70 3 -40 4 0Z" fill="url(#kgPalm)" stroke="#5A5040" stroke-width=".9"/><path d="${Array.from({ length:12 }, (_, k) => `M-2.6 ${-8 - k * 7.6} h5.6`).join(' ')}" stroke="#6E6450" stroke-width=".8"/>${fr}<g fill="#F28A1E" stroke="#A84A08" stroke-width=".5">${[[-6, -92], [-3, -90], [-5, -88], [-1, -91], [-8, -89]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>`;
    }
    if (t === 'ipe') {
      const flores = Array.from({ length:44 }, () => { const a = R(0, 6.28), rr = Math.sqrt(R(0, 1)); const x = Math.cos(a) * 34 * rr, y = -80 + Math.sin(a) * 24 * rr; return `<circle cx="${F(x)}" cy="${F(y)}" r="${F(R(2, 3.6))}"/>`; }).join('');
      return `<path d="M-3 0 C-2 -24 -6 -40 -16 -60 M0 -2 C2 -30 0 -50 2 -72 M3 0 C4 -30 12 -46 22 -62" stroke="#4A3428" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-1 -10 C0 -30 -3 -44 -10 -58" stroke="#8A6A54" stroke-width="1.4" fill="none" opacity=".7"/>
        <path d="${copa(0, -80, 40, 28, 13, .3)}" fill="url(#kgIpeRoxo)" stroke="#7A2A6A" stroke-width="1.3"/><g fill="#F6B8E6" stroke="#B0488E" stroke-width=".5">${flores}</g><path d="${copa(-12, -88, 18, 11, 8, .3)}" fill="#FFD6F2" opacity=".5"/><g fill="#5E9A4A">${[[-30, -70], [26, -72], [10, -60]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2"/>`).join('')}</g>`;
    }
    if (t === 'embauba') {
      const folha = (x, y, a, k) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})">${[-50, -25, 0, 25, 50].map(b => `<path d="M0 0 L${F(Math.sin(b * Math.PI / 180) * 16)} ${F(-Math.cos(b * Math.PI / 180) * 16)}" stroke="#4E6A5A" stroke-width="5.4" stroke-linecap="round"/><path d="M0 0 L${F(Math.sin(b * Math.PI / 180) * 16)} ${F(-Math.cos(b * Math.PI / 180) * 16)}" stroke="url(#kgEmb)" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
      return `<path d="M-2.6 0 C-2 -40 -1 -76 0 -98 H3 C3 -76 3.6 -40 3.6 0Z" fill="#E6E2D0" stroke="#8A8670" stroke-width=".9"/><path d="${Array.from({ length:9 }, (_, k) => `M-2.4 ${-10 - k * 10} q2.6 1.4 5.6 0`).join(' ')}" stroke="#9A967E" stroke-width=".8" fill="none"/><path d="M0 -84 l-18 -8 M1 -90 l18 -10" stroke="#C8C4B0" stroke-width="2" stroke-linecap="round"/>${folha(-20, -94, -50, 1)}${folha(20, -102, 46, 1.05)}${folha(0, -104, 0, 1.15)}${folha(-8, -98, -18, .9)}${folha(12, -96, 22, .9)}`;
    }
    return `<path d="M-3 0 C-3 -20 -4 -36 -12 -50 M3 0 C3 -24 6 -38 14 -50 M0 0 V-58" stroke="#4A3020" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="${copa(-2, -66, 40, 30, 12, .28)}" fill="url(#kgCopaEsc)" stroke="#123A2A" stroke-width="1.4"/><path d="${copa(-12, -76, 22, 15, 9, .3)}" fill="url(#kgCopaLuz)" opacity=".85"/><path d="${copa(16, -60, 14, 10, 7, .3)}" fill="#3E8A5A" opacity=".8"/><path d="M-28 -72 q4 -10 14 -14" stroke="#C8F0B0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`;
  };
  /* mudinha no saquinho preto */
  const muda = (cor) => `<path d="M-6 0 L-7 -10 C-7 -12 7 -12 7 -10 L6 0Z" fill="#2A2A30" stroke="#0E0E12" stroke-width=".8"/><path d="M-5 -9 h10" stroke="#4E4E58" stroke-width=".8"/><path d="M0 -10 C-1 -16 1 -20 0 -26" stroke="#3E6A22" stroke-width="1.6" fill="none"/><path d="M0 -18 c-7 -2 -10 -6 -10 -9 c5 0 8 3 10 9Z M0 -22 c6 -2 9 -6 9 -9 c-5 0 -8 3 -9 9Z M0 -26 c-2 -4 0 -8 2 -9 c1 3 0 6 -2 9Z" fill="${cor || '#6EC04A'}" stroke="#2E6A22" stroke-width=".7"/>`;
  const plantinha = (x, y, v) => `<g class="kg-pl" data-k="${[.74, .9, 1.06][v || 0]}" style="transform-origin:${F(x)}px ${F(y)}px;transform:scale(0);transition:transform .5s cubic-bezier(.3,1.6,.5,1)"><ellipse cx="${F(x)}" cy="${F(y + 1)}" rx="7" ry="2" fill="#7A3A18" opacity=".35"/><path d="M${F(x)} ${F(y)} c-6 -2 -9 -7 -8 -11 c5 1 7 5 8 11Z M${F(x)} ${F(y)} c6 -2 9 -7 8 -11 c-5 1 -7 5 -8 11Z M${F(x)} ${F(y)} c-2 -5 -1 -11 1 -14 c2 4 1 9 -1 14Z" fill="url(#${['kgFileira', 'kgFileira2', 'kgFileira3'][v || 0]})" stroke="#2A5A1E" stroke-width=".8"/><path d="M${F(x - 4)} ${F(y - 7)} l2 1" stroke="#D8F6A8" stroke-width=".8"/>${v === 2 ? `<g class="kg-florzinha" style="opacity:0;transition:opacity 1.5s"><circle cx="${F(x - 3)}" cy="${F(y - 12)}" r="1.6" fill="#FFD02A" stroke="#B07A08" stroke-width=".4"/><circle cx="${F(x + 3)}" cy="${F(y - 11)}" r="1.4" fill="#FFD02A" stroke="#B07A08" stroke-width=".4"/></g>` : ''}</g>`;
  const feixe = () => `<g>${[-10, -5, 0, 5, 10].map((d, k) => `<path d="M${d} 4 L${d + (k - 2) * 1.4} -26" stroke="#5E6A1E" stroke-width="4.6" stroke-linecap="round"/><path d="M${d} 4 L${d + (k - 2) * 1.4} -26" stroke="url(#kgBambu)" stroke-width="3.2" stroke-linecap="round"/><path d="M${d - 1.6} ${-6 - k % 2 * 6} h3.2 M${d - 1.6} ${-16 - k % 2 * 4} h3.2" stroke="#4E5A1A" stroke-width=".9"/>`).join('')}<path d="M-13 -8 C-4 -5 4 -5 13 -8 M-13 -14 C-4 -11 4 -11 13 -14" stroke="#8A5A2A" stroke-width="2.4" fill="none"/><path d="M-13 -8 C-4 -5 4 -5 13 -8" stroke="#D8A86A" stroke-width=".9" fill="none"/></g>`;
  const palicada = (x, y) => { const w = GW(y, 1) + 3; let st = ''; for (let k = 0; k <= 8; k++) { const t = k / 8, xx = x - w + t * 2 * w, yy = y + Math.sin(t * Math.PI) * 5, h = 12 + Math.sin(k * 2.3) * 3 + Math.sin(t * Math.PI) * 4; st += `<path d="M${F(xx)} ${F(yy + 3)} L${F(xx + (t - .5) * 2)} ${F(yy - h)}" stroke="#5E5A1A" stroke-width="4.4" stroke-linecap="round"/><path d="M${F(xx)} ${F(yy + 3)} L${F(xx + (t - .5) * 2)} ${F(yy - h)}" stroke="url(#kgBambu)" stroke-width="2.8" stroke-linecap="round"/><path d="M${F(xx - 1.4)} ${F(yy - 5)} h2.8" stroke="#4E5A1A" stroke-width=".8"/><ellipse cx="${F(xx + (t - .5) * 2)}" cy="${F(yy - h)}" rx="1.4" ry=".7" fill="#F4F0B0"/>`; }
    return `<path d="M${F(x - w - 4)} ${y + 2} C${F(x - w)} ${y - 14} ${F(x + w)} ${y - 14} ${F(x + w + 4)} ${y + 2} C${F(x + w * .5)} ${y + 8} ${F(x - w * .5)} ${y + 8} ${F(x - w - 4)} ${y + 2}Z" class="kg-areia-presa" fill="#EAB878" stroke="#B07038" stroke-width=".8" style="opacity:0;transition:opacity 1.6s"/><ellipse cx="${x}" cy="${y + 6}" rx="${F(w + 4)}" ry="3.4" fill="#3A1A08" opacity=".3"/>${st}<path d="M${F(x - w - 2)} ${y - 5} Q${x} ${y + 2} ${F(x + w + 2)} ${y - 5}" stroke="#7A4A22" stroke-width="2.4" fill="none"/><path d="M${F(x - w - 2)} ${y - 5} Q${x} ${y + 2} ${F(x + w + 2)} ${y - 5}" stroke="#D8A86A" stroke-width=".8" fill="none" stroke-dasharray="3 2"/><path d="M${F(x - w - 4)} ${y + 5} Q${x} ${y + 11} ${F(x + w + 4)} ${y + 5}" stroke="#C8783E" stroke-width="3" fill="none" opacity=".8"/>`; };
  /* voçoroca em 3D: duas paredes com camadas de areia, sombra, bordas que desmoronam e raízes */
  const gully3D = k => {
    const ys = []; for (let y = GTOP; y <= GBOT; y += 4) ys.push(y);
    const jag = (y, sd) => y > GTOP + 4 ? (Math.sin(y * 1.37 + sd) * 1.3 + Math.sin(y * .53 + sd * 2) * 1.5) * k : 0;
    const Lr = ys.map(y => [GX(y) - GW(y, k) + jag(y, 1), y]), Rr = ys.map(y => [GX(y) + GW(y, k) + jag(y, 4), y]);
    const fl = y => GW(y, k) * .24 + .5, Lf = ys.map(y => [GX(y) - fl(y) + Math.sin(y * .3) * .8 * k, y]), Rf = ys.map(y => [GX(y) + fl(y) + Math.sin(y * .3) * .8 * k, y]);
    const P = a => a.map(([x, y]) => `${F(x)} ${F(y)}`).join(' L'), poly = (a, b) => `M${P(a)} L${P(b.slice().reverse())}Z`, lerp = (a, b, t) => a.map(([x, y], i) => [x + (b[i][0] - x) * t, y]);
    const top = `M${F(GX(GTOP) - GW(GTOP, k) - 2)} ${GTOP + 2} Q${F(GX(GTOP))} ${F(GTOP - 3 - 4 * k)} ${F(GX(GTOP) + GW(GTOP, k) + 2)} ${GTOP + 2}`;
    let est = '';
    if (k > .4) [.16, .32, .5, .68, .84].forEach((t, n) => { est += `<path d="M${P(lerp(Lr, Lf, t))}" stroke="${n % 2 ? '#B04A22' : '#FFE2B4'}" stroke-width="${n % 2 ? 2 : 1.1}" fill="none" opacity=".75" stroke-linecap="round"/><path d="M${P(lerp(Rf, Rr, t))}" stroke="${n % 2 ? '#4A1608' : '#C87840'}" stroke-width="${n % 2 ? 1.6 : 1}" fill="none" opacity=".6" stroke-linecap="round"/>`; });
    let raiz = '', migalha = '', tufos = '';
    if (k > .5) {
      raiz = [[0, 304, 1], [0, 344, 1], [1, 322, -1], [1, 290, -1]].map(([lado, y, d]) => { const x = lado ? GX(y) + GW(y, k) : GX(y) - GW(y, k); const r = `M${F(x)} ${y} q${F(d * 4)} 5 ${F(d * 6)} 12 t${F(d * 3)} 10 M${F(x + d * 3)} ${y + 6} q${F(d * 5)} 2 ${F(d * 8)} 7`; return `<path d="${r}" stroke="#2A1206" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="${r}" stroke="#B89070" stroke-width=".9" fill="none" stroke-linecap="round"/>`; }).join('');
      migalha = Array.from({ length:16 }, (_, n) => { const y = GTOP + 20 + n * 8.4, lado = n % 2, x = GX(y) + (lado ? 1 : -1) * GW(y, k) * R(.25, .55), r = R(1.6, 4); return `<path d="M${F(x - r)} ${F(y + r * .4)} L${F(x - r * .4)} ${F(y - r * .6)} L${F(x + r * .6)} ${F(y - r * .5)} L${F(x + r)} ${F(y + r * .4)}Z" fill="${lado ? '#8A3A16' : '#D88848'}" stroke="#4A1A08" stroke-width=".6"/>`; }).join('');
      tufos = Array.from({ length:12 }, (_, n) => { const y = GTOP + 14 + n * 11, lado = n % 2, x = GX(y) + (lado ? 1 : -1) * (GW(y, k) + 3); return tufo(x, y + 2, R(5, 8), '#C8D27A', '#7A7A2A'); }).join('');
    }
    return `<path d="${poly(Lr.map(([x, y]) => [x - 6, y]), Rr.map(([x, y]) => [x + 6, y]))}" fill="#6A2A10" opacity=".22" filter="url(#kgBlur)"/>
      <path d="${poly(Lr, Lf)}" fill="url(#kgParL)"/>
      <path d="${poly(Rf, Rr)}" fill="url(#kgParR)"/>
      ${est}
      <path d="${poly(Lf, Rf)}" fill="url(#kgFundoG)"/>
      <path d="${poly(lerp(Lr, Lf, .5), Rr)}" fill="#1E0802" opacity="${F(.18 + k * .2)}"/>
      <path d="M${P(ys.map(y => [GX(y) + Math.sin(y * .21) * fl(y) * .5, y]))}" stroke="#E8B878" stroke-width="${F(.6 + k * 2.2)}" fill="none" opacity=".75" stroke-linecap="round"/>
      <path d="M${P(Rf)}" stroke="#1E0A02" stroke-width="${F(1 + k * 2)}" fill="none" opacity=".45"/>
      ${migalha}${raiz}
      <path d="M${P(Lr)}" stroke="#4A1A08" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M${P(Rr)}" stroke="#4A1A08" stroke-width="1.6" fill="none" stroke-linejoin="round"/>
      <path d="M${P(Lr.map(([x, y]) => [x - 1.6, y - .6]))}" stroke="#FFE2B4" stroke-width="1.4" fill="none" opacity=".9"/><path d="M${P(Rr.map(([x, y]) => [x + 1.4, y - .6]))}" stroke="#F4C890" stroke-width="1.2" fill="none" opacity=".7"/>
      <path d="${top}" stroke="#4A1A08" stroke-width="1.6" fill="#7A3416"/>${tufos}`;
  };
  const cupim = (x, y, h) => { const w = h * .62; return `<g><ellipse cx="${x}" cy="${y + 1}" rx="${F(w * 1.5)}" ry="${F(h * .14)}" fill="#5A2410" opacity=".3"/><path d="M${F(x - w)} ${y} C${F(x - w * .95)} ${F(y - h * .4)} ${F(x - w * .7)} ${F(y - h * .7)} ${F(x - w * .3)} ${F(y - h * .86)} C${F(x - w * .2)} ${F(y - h * 1.04)} ${F(x + w * .2)} ${F(y - h * 1.04)} ${F(x + w * .28)} ${F(y - h * .84)} C${F(x + w * .5)} ${F(y - h * .9)} ${F(x + w * .6)} ${F(y - h * .6)} ${F(x + w * .56)} ${F(y - h * .5)} C${F(x + w * .9)} ${F(y - h * .4)} ${F(x + w)} ${F(y - h * .2)} ${F(x + w)} ${y}Z" fill="url(#kgCupim)" stroke="#5A2410" stroke-width="1.1"/><path d="M${F(x - w * .6)} ${F(y - h * .3)} C${F(x - w * .5)} ${F(y - h * .6)} ${F(x - w * .3)} ${F(y - h * .76)} ${F(x - w * .16)} ${F(y - h * .86)}" stroke="#F4C08A" stroke-width="1.4" fill="none" opacity=".75" stroke-linecap="round"/><g fill="#5A2410" opacity=".55">${Array.from({ length:8 }, () => `<circle cx="${F(x + R(-w * .7, w * .7))}" cy="${F(y - R(2, h * .7))}" r="${F(R(.5, 1.1))}"/>`).join('')}</g><path d="M${F(x - w * .3)} ${F(y - h * .2)} q${F(w * .3)} -2 ${F(w * .6)} 0" stroke="#7A3014" stroke-width=".8" fill="none"/></g>`; };
  /* ---------- pessoas (origem nos pés) ---------- */
  const olhos = (y, esc) => `<path d="M-5.6 ${y - 3.4} q2 -1.3 4 -.3 M1.8 ${y - 3.6} q2 -1 4 .3" stroke="${esc}" stroke-width=".95" fill="none" stroke-linecap="round"/><ellipse cx="-3.4" cy="${y}" rx="1.35" ry="1.7" fill="#1A0E0A"/><ellipse cx="3.6" cy="${y}" rx="1.35" ry="1.7" fill="#1A0E0A"/><circle cx="-2.9" cy="${y - .6}" r=".55" fill="#fff"/><circle cx="4.1" cy="${y - .6}" r=".55" fill="#fff"/>`;
  const artesa = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="0" cy="1" rx="17" ry="3" fill="#2A1A0A" opacity=".28"/>
    <path d="M-5 0 v-15 M5 0 v-15" stroke="#9A6440" stroke-width="4.6" stroke-linecap="round"/><path d="M-5 -2 v-11" stroke="#B87E54" stroke-width="1.2" opacity=".6"/>
    <path d="M-10 .4 h8 M2 .4 h8" stroke="#7A3A1E" stroke-width="2.6" stroke-linecap="round"/><path d="M-7 -1.6 l2 -2 l2 2 M4 -1.6 l2 -2 l2 2" stroke="#C8682E" stroke-width="1.1" fill="none"/>
    <path d="M-14 -13 C-15 -26 -11 -38 0 -39 C11 -38 15 -26 14 -13 C8 -11 -8 -11 -14 -13Z" fill="url(#kgSaia)" stroke="#1A2E5A" stroke-width="1.3"/>
    <path d="M-13.4 -15.4 C-8 -13.4 8 -13.4 13.4 -15.4" stroke="#F0C070" stroke-width=".8" fill="none" stroke-dasharray="1.6 1.2"/><path d="M0 -38 V-14" stroke="#F0C070" stroke-width=".7" stroke-dasharray="1.6 1.2" opacity=".8"/><path d="M4 -30 h6 v5 c0 1.4 -6 1.4 -6 0Z" fill="none" stroke="#F0C070" stroke-width=".7" stroke-dasharray="1.2 1"/>
    <path d="M-9 -36 C-10 -28 -9 -20 -8 -14" stroke="#7AA0E0" stroke-width="1.2" fill="none" opacity=".5"/>
    <path d="M-12.4 -36 C-13 -47 -9 -54 0 -54 C9 -54 13 -47 12.4 -36 L13 -32 C6 -30 -6 -30 -13 -32Z" fill="url(#kgBlusa)" stroke="#8A2A2A" stroke-width="1.3" stroke-linejoin="round"/>
    <g fill="#FFF4E6" opacity=".9">${[[-8, -46], [-3, -40], [6, -44], [9, -37], [-9, -36], [2, -35], [-5, -50], [5, -50]].map(([a, b]) => `<g transform="translate(${a} ${b})"><circle r="1.05" cx="0" cy="-1"/><circle r="1.05" cx="1" cy="0"/><circle r="1.05" cx="0" cy="1"/><circle r="1.05" cx="-1" cy="0"/><circle r=".6" fill="#FFC83D"/></g>`).join('')}</g>
    <path d="M-12 -30 C-6 -28.6 6 -28.6 12 -30" stroke="#B03A30" stroke-width=".9" fill="none" opacity=".6"/>
    <path d="M-5.4 -53 C-4 -48.6 4 -48.6 5.4 -53Z" fill="#9A6440"/>
    <path d="M-6.6 -52.4 C-4 -47 4 -47 6.6 -52.4" fill="none" stroke="#5E2A10" stroke-width=".5"/><g stroke="#3A1A0A" stroke-width=".4">${[-6, -4.6, -3, -1.4, 0, 1.4, 3, 4.6, 6].map((a, i) => `<circle cx="${a}" cy="${F(-51.8 + Math.cos(a / 6.6 * 1.5) * -3.6 + 3.6)}" r="${i % 2 ? .9 : 1.1}" fill="${i % 2 ? '#2A1A10' : '#C8281E'}"/>`).join('')}</g>
    <path d="M-11.4 -50 C-16 -44 -18 -38 -17 -30" stroke="#8A2A2A" stroke-width="6.2" fill="none" stroke-linecap="round"/><path d="M-11.4 -50 C-16 -44 -18 -38 -17 -30" stroke="url(#kgBlusa)" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-16.4 -40 C-17.6 -34 -17.4 -30 -16.8 -27" stroke="#9A6440" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <g transform="translate(-17 -24)">${muda('#7CCB4A')}</g><circle cx="-16.6" cy="-27.4" r="2.7" fill="#9A6440" stroke="#4E2A14" stroke-width=".8"/>
    <g id="kg-braco-ar" style="transform-origin:11px -49px"><path d="M11 -49 C16 -54 19 -60 20 -66" stroke="#8A2A2A" stroke-width="6.2" fill="none" stroke-linecap="round"/><path d="M11 -49 C16 -54 19 -60 20 -66" stroke="url(#kgBlusa)" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M18.6 -60 C19.6 -64 20.2 -67 20.6 -69" stroke="#9A6440" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="20.8" cy="-70.6" r="2.9" fill="#9A6440" stroke="#4E2A14" stroke-width=".8"/><path d="M19.4 -73 l-.6 -2 M21.4 -73.4 l.2 -2.2 M23 -72.4 l.8 -1.8" stroke="#4E2A14" stroke-width=".8" stroke-linecap="round"/></g>
    <path d="M-9.4 -66 C-12 -58 -11 -52 -9 -46 L-6 -52Z" fill="#1E1410"/>
    <path d="M-3 -55 v-5 h6 v5Z" fill="#8A5636"/>
    <ellipse cx="0" cy="-64.4" rx="8.2" ry="9.4" fill="url(#kgPele1)" stroke="#4E2A14" stroke-width="1.2"/>
    <path d="M-8.6 -66 C-9.6 -76 -4 -78.6 0 -78.6 C4 -78.6 9.6 -76 8.6 -66 C7 -71 3 -73.4 0 -72.6 C-3 -73.4 -7 -71 -8.6 -66Z" fill="#1E1410"/>
    <path d="M-1 -78 C-2 -75 -2 -73 0 -72.6" stroke="#4A3A34" stroke-width=".7" fill="none"/>
    <path d="M-6.4 -75.4 C-4 -77 -1.6 -77 -.4 -76.6 M2 -77 C4 -76.6 6 -75.4 7 -73.6" stroke="#D8D4CC" stroke-width=".8" fill="none" opacity=".85" stroke-linecap="round"/>
    <path d="M7.6 -66 C10 -60 10 -54 8.6 -48 C8.6 -42 9.4 -38 8 -34" stroke="#1E1410" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M7.4 -60 l2.2 .6 M8.6 -54 l2.2 .4 M8.2 -48 l2.2 .4 M8.6 -42 l2 .4" stroke="#4A3A34" stroke-width=".8"/><circle cx="8.2" cy="-36.4" r="1.7" fill="#FFC83D" stroke="#A86A08" stroke-width=".5"/>
    <path d="M-8.2 -63 c-.6 2 -.2 3.4 .6 4.4" stroke="#C8281E" stroke-width="1.2" fill="none"/><circle cx="-7.6" cy="-58.4" r="1" fill="#C8281E"/>
    ${olhos(-65.4, '#1E1410')}
    <path d="M0 -63.6 q.9 1.6 -.2 2.4" stroke="#6A3418" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-3.2 -59.8 C-1.6 -57.6 1.8 -57.6 3.4 -59.8" fill="#fff" stroke="#6A2A14" stroke-width=".9" stroke-linecap="round"/>
    <path d="M-6.4 -61.6 q.8 .8 1.6 .6 M5.4 -61.6 q.8 .2 1.4 -.6" stroke="#7A4A2E" stroke-width=".5" fill="none" opacity=".7"/>
    <ellipse cx="-5.4" cy="-61.4" rx="1.9" ry="1.1" fill="#E07A5A" opacity=".5"/><ellipse cx="5.6" cy="-61.4" rx="1.9" ry="1.1" fill="#E07A5A" opacity=".5"/>
    <rect x="-22" y="-82" width="48" height="84" fill="transparent"/></g>`;
  const menina = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="0" cy="1" rx="13" ry="2.6" fill="#2A1A0A" opacity=".28"/>
    <path d="M-4 0 v-13 M4 0 v-13" stroke="#8A5434" stroke-width="4" stroke-linecap="round"/>
    <path d="M-9 0 C-9 -3 -2 -3 -2 0Z M2 0 C2 -3 9 -3 9 0Z" fill="#FFFFFF" stroke="#4A5A8A" stroke-width=".9"/><path d="M-8 -.6 h5 M3 -.6 h5" stroke="#E0458A" stroke-width=".9"/>
    <path d="M-9 -12 L-8.6 -22 H8.6 L9 -12 H1.4 L0 -16 L-1.4 -12Z" fill="#C8302A" stroke="#6A1410" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-10 -21 C-11 -32 -7 -38 0 -38 C7 -38 11 -32 10 -21Z" fill="url(#kgCamB)" stroke="#5A6A8A" stroke-width="1.1"/>
    <path d="M-10 -22 h20" stroke="#2E6AB0" stroke-width="2"/><path d="M-4 -37.6 L0 -34 L4 -37.6" fill="none" stroke="#2E6AB0" stroke-width="1.6"/>
    <path d="M3 -33 h4 v3.4 h-4Z" fill="#3FA864" stroke="#1E6A3A" stroke-width=".5"/><path d="M4 -31.4 q1 -1 2 0" stroke="#fff" stroke-width=".5" fill="none"/>
    <path d="M-9 -35 C-13 -30 -12 -24 -6 -22" stroke="#5A6A8A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-9 -35 C-13 -30 -12 -24 -6 -22" stroke="url(#kgCamB)" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M9 -35 C13 -30 12 -24 6 -22" stroke="#5A6A8A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M9 -35 C13 -30 12 -24 6 -22" stroke="url(#kgCamB)" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <g transform="translate(0 -18)">${muda('#8AD04A')}</g><circle cx="-5" cy="-21.6" r="2.4" fill="#8A5434" stroke="#4A2410" stroke-width=".7"/><circle cx="5" cy="-21.6" r="2.4" fill="#8A5434" stroke="#4A2410" stroke-width=".7"/>
    <path d="M-2.6 -38 v-4 h5.2 v4Z" fill="#7A4628"/>
    <path d="M-6 -47 C-12 -44 -12 -36 -8 -32 C-6 -36 -6 -42 -4 -46Z" fill="#141010"/>
    <ellipse cx="0" cy="-48" rx="7.4" ry="8" fill="url(#kgPele2)" stroke="#4A2410" stroke-width="1.1"/>
    <path d="M-7.6 -49 C-8.6 -58 -3 -59.6 0 -59.6 C3.4 -59.6 8.6 -58 7.6 -49 C6 -53.6 2 -55 -1 -54 C-3 -55 -6 -53 -7.6 -49Z" fill="#141010"/>
    <path d="M6.4 -56 C12 -58 15 -54 13 -48 C12 -44 13 -40 14 -38" stroke="#141010" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="7.6" cy="-56.4" r="1.8" fill="#FFC83D" stroke="#A86A08" stroke-width=".5"/>
    <path d="M-3 -58 q3 -1.6 6 -.6" stroke="#5A4A44" stroke-width=".8" fill="none" opacity=".8"/>
    ${olhos(-48.6, '#141010')}
    <path d="M0 -47 q.8 1.4 -.2 2" stroke="#5A2A10" stroke-width=".7" fill="none"/>
    <path d="M-2.8 -43.6 C-1.4 -41.6 1.6 -41.6 3 -43.6" fill="#fff" stroke="#5A1E0A" stroke-width=".8" stroke-linecap="round"/>
    <ellipse cx="-4.8" cy="-45" rx="1.7" ry="1" fill="#E0705A" opacity=".5"/><ellipse cx="5" cy="-45" rx="1.7" ry="1" fill="#E0705A" opacity=".5"/>
    <rect x="-16" y="-62" width="32" height="64" fill="transparent"/></g>`;
  const menino = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="0" cy="1" rx="13" ry="2.6" fill="#2A1A0A" opacity=".28"/>
    <path d="M-4 0 v-13 M4 0 v-13" stroke="#5A3420" stroke-width="4" stroke-linecap="round"/>
    <path d="M-9 0 C-9 -3.4 -2 -3.4 -2 0Z M2 0 C2 -3.4 9 -3.4 9 0Z" fill="#FF8A2A" stroke="#7A3A0A" stroke-width=".9"/><path d="M-8 -.6 h5 M3 -.6 h5" stroke="#fff" stroke-width=".9"/>
    <path d="M-9 -12 L-8.6 -22 H8.6 L9 -12 H1.4 L0 -15 L-1.4 -12Z" fill="url(#kgJeans)" stroke="#1A2E5A" stroke-width="1.1" stroke-linejoin="round"/><path d="M-8 -14 h5 M3 -14 h5" stroke="#9AB8E8" stroke-width=".6" stroke-dasharray="1 1"/>
    <path d="M-10 -21 C-11 -32 -7 -38 0 -38 C7 -38 11 -32 10 -21Z" fill="url(#kgCamV)" stroke="#1E5A2A" stroke-width="1.1"/>
    <circle cx="0" cy="-29" r="4.4" fill="#FFE27A" stroke="#C88A0A" stroke-width=".6"/><path d="M-2 -29 q2 -3.4 4 0 q-2 3.4 -4 0Z" fill="#3E9AE0"/>
    <path d="M-3.4 -37.6 C-2 -35.6 2 -35.6 3.4 -37.6" fill="none" stroke="#1E5A2A" stroke-width="1.2"/>
    <path d="M-9 -35 C-13 -30 -14 -24 -13 -19" stroke="#1E5A2A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-9 -35 C-13 -30 -14 -24 -13 -19" stroke="url(#kgCamV)" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="-13" cy="-17.6" r="2.4" fill="#5A3420" stroke="#2A1408" stroke-width=".7"/>
    <g transform="translate(-14 -16)"><path d="M-1 0 L-1 6 M-3.4 6 h4.8 l-.6 6 h-3.6Z" stroke="#6A4A2A" stroke-width="1.4" fill="#9AA8B8" stroke-linejoin="round"/></g>
    <g id="kg-braco-mn" style="transform-origin:9px -35px"><path d="M9 -35 C13 -30 15 -26 16 -21" stroke="#1E5A2A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M9 -35 C13 -30 15 -26 16 -21" stroke="url(#kgCamV)" stroke-width="3.4" fill="none" stroke-linecap="round"/><g transform="translate(18 -16)"><path d="M-4 -4 C-4 -8 6 -8 6 -4 L5 4 H-3Z" fill="#3E9AE0" stroke="#1E4A8A" stroke-width=".9"/><path d="M6 -2 L14 -8 l1 2 L7 1Z" fill="#3E9AE0" stroke="#1E4A8A" stroke-width=".8"/><path d="M-4 -4 C-8 -8 -8 0 -4 1" stroke="#1E4A8A" stroke-width="1.2" fill="none"/><path d="M-2 -5 q3 -1.6 6 0" stroke="#BFE6FF" stroke-width=".9" fill="none"/></g><circle cx="16" cy="-19.6" r="2.4" fill="#5A3420" stroke="#2A1408" stroke-width=".7"/></g>
    <path d="M-2.6 -38 v-4 h5.2 v4Z" fill="#4A2A18"/>
    <ellipse cx="0" cy="-48" rx="7.4" ry="8" fill="url(#kgPele3)" stroke="#2A1408" stroke-width="1.1"/>
    <path d="${copa(0, -55, 8.6, 5, 11, .5)}" fill="#1A120E" stroke="#0A0604" stroke-width=".5"/><g fill="none" stroke="#3A2A22" stroke-width=".6">${[[-5, -57], [-1, -59], [3, -58], [6, -55], [-6, -53]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.4"/>`).join('')}</g>
    <path d="M-7.8 -52 C-8 -49 -7.6 -47 -7.2 -46 M7.8 -52 C8 -49 7.6 -47 7.2 -46" stroke="#1A120E" stroke-width="1.4" fill="none"/>
    <ellipse cx="-7.4" cy="-47.6" rx="1.3" ry="1.9" fill="#5A3420" stroke="#2A1408" stroke-width=".6"/><ellipse cx="7.4" cy="-47.6" rx="1.3" ry="1.9" fill="#5A3420" stroke="#2A1408" stroke-width=".6"/>
    ${olhos(-48.4, '#1A120E')}
    <path d="M0 -47 q1 1.4 -.2 2.1" stroke="#2A1408" stroke-width=".7" fill="none"/>
    <path d="M-3 -43.6 C-1.4 -41 1.6 -41 3.2 -43.6Z" fill="#fff" stroke="#3A1208" stroke-width=".8" stroke-linejoin="round"/>
    <ellipse cx="-4.8" cy="-45" rx="1.7" ry="1" fill="#B0503A" opacity=".45"/><ellipse cx="5" cy="-45" rx="1.7" ry="1" fill="#B0503A" opacity=".45"/>
    <rect x="-16" y="-62" width="38" height="64" fill="transparent"/></g>`;
  /* cesto kaingang trançado */
  const cesto = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="0" cy="1" rx="17" ry="3" fill="#2A1A0A" opacity=".3"/>
    <path d="M-14 -24 C-15 -14 -12 -4 -10 0 H10 C12 -4 15 -14 14 -24Z" fill="url(#kgPalha)" stroke="#6A4418" stroke-width="1.2"/>
    <path d="M-14 -24 C-15 -14 -12 -4 -10 0 H10 C12 -4 15 -14 14 -24Z" fill="url(#kgTrama)"/>
    <path d="M-14.2 -16 C-6 -14.6 6 -14.6 14.2 -16 L13.8 -12 C6 -10.6 -6 -10.6 -13.8 -12Z" fill="#8A3A1E" opacity=".85"/><path d="M-13.6 -8 C-6 -6.8 6 -6.8 13.6 -8 L13 -5.4 C6 -4.2 -6 -4.2 -13 -5.4Z" fill="#2A2A20" opacity=".7"/>
    <ellipse cx="0" cy="-24" rx="14" ry="3.6" fill="#7A5222" stroke="#6A4418" stroke-width="1.1"/><ellipse cx="0" cy="-24.4" rx="12" ry="2.6" fill="#3A2410"/>
    <path d="M-13 -24 C-12 -40 12 -40 13 -24" stroke="#6A4418" stroke-width="3.4" fill="none"/><path d="M-13 -24 C-12 -40 12 -40 13 -24" stroke="#D8B070" stroke-width="1.8" fill="none" stroke-dasharray="2.4 1.2"/>
    <path d="M-11 -20 C-11 -12 -9 -6 -8 -2" stroke="#FFF2C8" stroke-width="1.2" fill="none" opacity=".6"/></g>`;
  /* gralha-picaça (Tita) - origem nos pés, olhando para a direita */
  const gralha = () => `<g>
    <path d="M-14 -16 C-26 -6 -34 6 -38 16 C-32 16 -24 10 -16 -2Z" fill="#1E1E3A" stroke="#0A0A1A" stroke-width="1.1" stroke-linejoin="round"/><path d="M-38 16 C-34 16 -30 13 -28 10 L-33 7Z" fill="#FFF0C0" stroke="#8A7A4A" stroke-width=".7"/>
    <path d="M-16 -14 C-18 -26 -6 -34 6 -32 C16 -30 20 -20 16 -10 C12 -2 0 2 -8 0 C-14 -2 -16 -8 -16 -14Z" fill="url(#kgGrBarr)" stroke="#6A5A2A" stroke-width="1.2"/>
    <path d="M-16 -14 C-18 -24 -10 -32 2 -32 C-4 -26 -8 -18 -8 -8 C-12 -8 -15 -10 -16 -14Z" fill="url(#kgGrAsa)" stroke="#1E1A5A" stroke-width="1.2"/>
    <path d="M-14 -20 C-10 -24 -6 -26 -2 -27 M-14 -16 C-11 -19 -8 -21 -5 -22" stroke="#9A9AFF" stroke-width="1" fill="none" opacity=".8"/>
    <path d="M-1 -30 C10 -32 19 -24 19 -11 C13 -11 7 -15 3 -21Z" fill="#1A1A22"/>
    <path d="M-2 -1 l-2 6 l-3 1 M2 0 l0 6 l-3 1 M0 6 l3 .4" stroke="#2A2A30" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="kg-gr-cab"><circle cx="8" cy="-36" r="11" fill="url(#kgGrCab)" stroke="#0A0A14" stroke-width="1.2"/>
    <path d="M-1 -42 C-4 -46 -2 -50 2 -49 C1 -52 5 -54 7 -51 C8 -54 12 -54 12 -50" fill="#1A1A26" stroke="#0A0A14" stroke-width="1"/>
    <path d="M-1 -32 C-3 -38 -2 -44 2 -46 C0 -40 0 -36 1 -30Z" fill="#B8D8FF" stroke="#4A6AB0" stroke-width=".6"/>
    <ellipse cx="11.4" cy="-41.4" rx="4" ry="1.7" fill="#4AB8FF" stroke="#1E5AA8" stroke-width=".5"/>
    <ellipse cx="11" cy="-31.4" rx="3" ry="1.5" fill="#3A8AF0" stroke="#1E4A9A" stroke-width=".5"/>
    <circle cx="11.4" cy="-37" r="3.4" fill="#FFE04A" stroke="#8A6A08" stroke-width=".6"/><circle cx="12" cy="-37" r="1.8" fill="#0A0A10"/><circle cx="12.7" cy="-37.9" r=".75" fill="#fff"/>
    <path d="M17.6 -37 L26 -34.6 L17.4 -32.4Z" fill="#141418" stroke="#0A0A10" stroke-width=".8" stroke-linejoin="round"/><path d="M18.6 -36 l5 1.2" stroke="#6A6A78" stroke-width=".6"/>
    <path d="M1 -42 C4 -45 8 -46 11 -45" stroke="#5A5A70" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="13.4" cy="-29.6" rx="2.2" ry="1.1" fill="#FF8AB0" opacity=".5"/></g></g>`;
  const piapara = (k) => `<g transform="scale(${k})"><path d="M22 0 L34 -9 C32 -3 32 3 34 9Z" fill="url(#kgPiaFin)" stroke="#6A5A1E" stroke-width="1"/>
    <path d="M-26 0 C-20 -9 -2 -11 12 -8 C18 -6 22 -3 23 0 C22 3 18 6 12 8 C-2 11 -20 9 -26 0Z" fill="url(#kgPia)" stroke="#4A4A2A" stroke-width="1.2"/>
    <path d="M-8 -9 L-2 -16 L4 -9Z M4 8 L8 13 L12 7Z M-12 7 L-9 12 L-5 8Z" fill="url(#kgPiaFin)" stroke="#6A5A1E" stroke-width=".8"/>
    <g fill="#2A2A1E" opacity=".75"><ellipse cx="-6" cy="0" rx="3" ry="2.6"/><ellipse cx="4" cy="-.4" rx="3" ry="2.6"/><ellipse cx="14" cy="0" rx="2.4" ry="2.2"/></g>
    <path d="M-18 -4 C-8 -8 4 -8 16 -5" stroke="#FFFFF0" stroke-width="1.3" fill="none" opacity=".7"/>
    <circle cx="-19" cy="-1.6" r="2.4" fill="#fff" stroke="#3A3A1E" stroke-width=".6"/><circle cx="-19.4" cy="-1.6" r="1.4" fill="#12121A"/><circle cx="-19.9" cy="-2.2" r=".55" fill="#fff"/>
    <path d="M-26 1 q2 1 4 .4" stroke="#4A4A2A" stroke-width=".8" fill="none"/><path d="M-15 -5 C-14 -2 -14 2 -15 5" stroke="#8A8A5A" stroke-width=".8" fill="none"/></g>`;
  const bigua = () => `<g><path d="M-6 -4 C-10 4 -14 10 -16 16 L-10 13 L-9 17 L-4 6Z" fill="#141418" stroke="#000" stroke-width=".8"/>
    <path d="M-8 -8 C-12 -22 -2 -32 6 -30 C14 -28 14 -12 8 -2 C2 4 -6 2 -8 -8Z" fill="url(#kgBigua)" stroke="#000" stroke-width="1.1"/>
    <path d="M-6 -20 C-2 -24 4 -24 8 -22 M-7 -13 C-3 -17 3 -17 7 -15 M-6 -6 C-2 -10 3 -10 6 -8" stroke="#6A7A78" stroke-width=".9" fill="none" opacity=".8"/>
    <path d="M5 -28 C5 -33 6 -37 8 -40" stroke="#000" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M5 -28 C5 -33 6 -37 8 -40" stroke="#26262E" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="10" cy="-42" rx="6.2" ry="5.4" fill="#26262E" stroke="#000" stroke-width="1"/>
    <path d="M15 -43.4 L27 -41.4 Q29.6 -40.4 27.4 -38.4 L15 -39.4Z" fill="#8A8A90" stroke="#3A3A40" stroke-width=".7"/><path d="M27 -41.4 q2.4 1.2 .8 3.4" stroke="#3A3A40" stroke-width=".8" fill="none"/>
    <path d="M12 -39 C15 -38 16 -35 14 -33 C11 -34 10 -37 12 -39Z" fill="#E8B43A" stroke="#A87A1A" stroke-width=".4"/>
    <circle cx="12" cy="-43.4" r="1.7" fill="#3AC8B8"/><circle cx="12.3" cy="-43.6" r=".8" fill="#0A0A10"/><circle cx="12.7" cy="-44" r=".35" fill="#fff"/>
    <path d="M4 -40 q3 -3 7 -3" stroke="#5A5A66" stroke-width="1" fill="none"/>
    <path d="M-1 1 V8 M4 0 V8" stroke="#141418" stroke-width="1.8"/></g>`;
  /* ---------- cena ---------- */
  const flores = (x, y, n, cor, esc) => Array.from({ length:n }, () => { const xx = x + R(-14, 14), yy = y + R(-4, 4); return `<path d="M${F(xx)} ${F(yy + 8)} V${F(yy)}" stroke="#3E7A2A" stroke-width="1"/><g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${F(xx + Math.cos(k * 1.256) * 2)}" cy="${F(yy + Math.sin(k * 1.256) * 2)}" r="1.6" fill="${cor}" stroke="${esc}" stroke-width=".4"/>`).join('')}<circle cx="${F(xx)}" cy="${F(yy)}" r="1" fill="#FFE27A"/></g>`; }).join('');
  const taboa = (x, y, h) => `<path d="M${x} ${y} Q${x - 2} ${y - h * .5} ${x + 1} ${y - h}" stroke="#3E6A22" stroke-width="2" fill="none"/><rect x="${x - 2.4}" y="${y - h + 6}" width="5" height="16" rx="2.5" fill="#7A4A26" stroke="#3A2010" stroke-width=".8"/><path d="M${x + 1} ${y - h + 6} v-6" stroke="#3E6A22" stroke-width="1.2"/>`;
  const folhaLonga = (x, y, h, a, c1, c2) => `<path d="M${x} ${y} Q${F(x + a * .4)} ${F(y - h * .6)} ${F(x + a)} ${F(y - h)} Q${F(x + a * .3)} ${F(y - h * .55)} ${F(x + 3)} ${y}Z" fill="${c1}" stroke="${c2}" stroke-width=".9"/>`;
  const cristaD = 'M0 214 C70 204 140 188 210 184 C260 180 320 177 360 184 C400 190 420 204 450 212 C480 216 520 208 560 200 C620 192 680 189 720 192 C760 194 790 200 800 202';
  const slopeD = cristaD + ' V394 H0Z';
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Alta Paulista: um morro de terra arenosa com uma voçoroca, um rio de águas barrentas, a aldeia kaingang no alto do morro e uma senhora kaingang com mudas e um cesto trançado">
    <defs>
      <linearGradient id="kgCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EAEE6"/><stop offset=".6" stop-color="#B8DEF2"/><stop offset="1" stop-color="#FFEBD0"/></linearGradient>
      <radialGradient id="kgSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8D0"/><stop offset=".55" stop-color="#FFD84A"/><stop offset="1" stop-color="#F5A623"/></radialGradient>
      <linearGradient id="kgNuvem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E4ECF6"/><stop offset="1" stop-color="#AEBCD2"/></linearGradient>
      <linearGradient id="kgNuvemE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4CCDA"/><stop offset=".45" stop-color="#7E8AA4"/><stop offset="1" stop-color="#46506C"/></linearGradient>
      <linearGradient id="kgNuvemB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A7690"/><stop offset="1" stop-color="#363E56"/></linearGradient>
      <linearGradient id="kgParL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F6B878"/><stop offset=".4" stop-color="#D0743A"/><stop offset="1" stop-color="#5A220C"/></linearGradient>
      <linearGradient id="kgParR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A1406"/><stop offset=".45" stop-color="#7A3416"/><stop offset="1" stop-color="#A8542A"/></linearGradient>
      <linearGradient id="kgFundoG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A1C08"/><stop offset="1" stop-color="#6A3214"/></linearGradient>
      <linearGradient id="kgVerdeVoc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8D870"/><stop offset=".45" stop-color="#4E8E36"/><stop offset=".6" stop-color="#3E7A2E"/><stop offset="1" stop-color="#6EA84A"/></linearGradient>
      <linearGradient id="kgCupim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E09058"/><stop offset=".55" stop-color="#B05A2A"/><stop offset="1" stop-color="#7A3416"/></linearGradient>
      <linearGradient id="kgPraia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4DCA8"/><stop offset="1" stop-color="#D8A868"/></linearGradient>
      <linearGradient id="kgProf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8F0EC" stop-opacity=".45"/><stop offset=".18" stop-color="#7ED0D8" stop-opacity="0"/><stop offset=".55" stop-color="#0A3A5A" stop-opacity=".38"/><stop offset="1" stop-color="#0A3A5A" stop-opacity=".12"/></linearGradient>
      <linearGradient id="kgPe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A2410" stop-opacity="0"/><stop offset="1" stop-color="#5A2410" stop-opacity=".28"/></linearGradient>
      <linearGradient id="kgLonge1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C6CC"/><stop offset="1" stop-color="#9CBCB0"/></linearGradient>
      <linearGradient id="kgLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC08A"/><stop offset="1" stop-color="#86AE72"/></linearGradient>
      <linearGradient id="kgEncosta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDB878"/><stop offset=".5" stop-color="#DB9256"/><stop offset="1" stop-color="#C2703C"/></linearGradient>
      <linearGradient id="kgEncLado" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5E3A1E" stop-opacity=".22"/><stop offset=".3" stop-color="#5E3A1E" stop-opacity="0"/><stop offset=".75" stop-color="#FFF0C8" stop-opacity="0"/><stop offset="1" stop-color="#FFF0C8" stop-opacity=".16"/></linearGradient>
      <pattern id="kgEstratos" width="40" height="12" patternUnits="userSpaceOnUse"><rect width="40" height="12" fill="#D27A42"/><rect y="3" width="40" height="3" fill="#E8A866"/><rect y="8" width="40" height="2" fill="#B85A2E"/><path d="M0 6 q10 -1 20 0 t20 0" stroke="#F4C890" stroke-width=".8" fill="none" opacity=".7"/></pattern>
      <linearGradient id="kgGrota" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A2410"/><stop offset=".5" stop-color="#8A4422"/><stop offset="1" stop-color="#4A1E0C"/></linearGradient>
      <linearGradient id="kgVegG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ACB5A"/><stop offset="1" stop-color="#4E9A3A"/></linearGradient>
      <linearGradient id="kgRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC6D4"/><stop offset=".5" stop-color="#3E98B0"/><stop offset="1" stop-color="#1E6A86"/></linearGradient>
      <linearGradient id="kgLamaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C88A48"/><stop offset=".5" stop-color="#A8682E"/><stop offset="1" stop-color="#7A4A1E"/></linearGradient>
      <radialGradient id="kgPluma" cx=".5" cy=".2" r=".6"><stop offset="0" stop-color="#C88A50" stop-opacity=".95"/><stop offset="1" stop-color="#C88A50" stop-opacity="0"/></radialGradient>
      <radialGradient id="kgBancoG" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#F6D49A"/><stop offset="1" stop-color="#D49A5A"/></radialGradient>
      <linearGradient id="kgRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="kgTerraF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AA84A"/><stop offset=".25" stop-color="#6E8E3A"/><stop offset="1" stop-color="#4A5E26"/></linearGradient>
      <linearGradient id="kgTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8805A"/><stop offset=".5" stop-color="#7A5434"/><stop offset="1" stop-color="#4E321C"/></linearGradient>
      <linearGradient id="kgTroncoI" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A9484"/><stop offset=".45" stop-color="#7A7262"/><stop offset="1" stop-color="#4A4436"/></linearGradient>
      <radialGradient id="kgCopaInga" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#8ACB6A"/><stop offset=".6" stop-color="#4E9A44"/><stop offset="1" stop-color="#2E6A32"/></radialGradient>
      <radialGradient id="kgCopaEsc" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#4EA078"/><stop offset=".6" stop-color="#2E7A5A"/><stop offset="1" stop-color="#1A5040"/></radialGradient>
      <radialGradient id="kgCopaLuz" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#A8E08A"/><stop offset="1" stop-color="#5EAA5A"/></radialGradient>
      <radialGradient id="kgCopaOl" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#B8C86A"/><stop offset="1" stop-color="#6E8A3A"/></radialGradient>
      <radialGradient id="kgIpeRoxo" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F49AD8"/><stop offset=".6" stop-color="#D05AAE"/><stop offset="1" stop-color="#9A3080"/></radialGradient>
      <radialGradient id="kgIpeAm" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFF08A"/><stop offset=".6" stop-color="#FFD02A"/><stop offset="1" stop-color="#E0A010"/></radialGradient>
      <linearGradient id="kgEmb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0EEE4"/><stop offset="1" stop-color="#9AB8A6"/></linearGradient>
      <linearGradient id="kgPalm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8B09A"/><stop offset="1" stop-color="#7A7260"/></linearGradient>
      <linearGradient id="kgFileira" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8EA6A"/><stop offset="1" stop-color="#4E9A2E"/></linearGradient>
      <linearGradient id="kgFileira2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ADAA0"/><stop offset="1" stop-color="#2E8A5A"/></linearGradient>
      <linearGradient id="kgFileira3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8E87A"/><stop offset="1" stop-color="#7A9A2E"/></linearGradient>
      <linearGradient id="kgBambu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8E07A"/><stop offset="1" stop-color="#A8A83A"/></linearGradient>
      <linearGradient id="kgVagem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8E06A"/><stop offset="1" stop-color="#7A9A2E"/></linearGradient>
      <linearGradient id="kgPalha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2D490"/><stop offset=".6" stop-color="#D8A85A"/><stop offset="1" stop-color="#A8763A"/></linearGradient>
      <pattern id="kgTrama" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 h3 M3 0 v3 M3 6 v-3 h3" stroke="#8A5A22" stroke-width=".9" fill="none" opacity=".75"/><path d="M0 1 h2 M4 4 h2" stroke="#FFF0C0" stroke-width=".6" opacity=".6"/></pattern>
      <linearGradient id="kgSaia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A88C8"/><stop offset="1" stop-color="#2E4E8A"/></linearGradient>
      <linearGradient id="kgBlusa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A78"/><stop offset="1" stop-color="#E0504A"/></linearGradient>
      <linearGradient id="kgCamB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE4F0"/></linearGradient>
      <linearGradient id="kgCamV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ED07A"/><stop offset="1" stop-color="#2E9A4E"/></linearGradient>
      <linearGradient id="kgJeans" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A7AB8"/><stop offset="1" stop-color="#34508A"/></linearGradient>
      <radialGradient id="kgPele1" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#C88A5E"/><stop offset="1" stop-color="#9A6440"/></radialGradient>
      <radialGradient id="kgPele2" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#B87C52"/><stop offset="1" stop-color="#8A5434"/></radialGradient>
      <radialGradient id="kgPele3" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8A5A3A"/><stop offset="1" stop-color="#5A3420"/></radialGradient>
      <linearGradient id="kgGrAsa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A74F0"/><stop offset=".5" stop-color="#4A42C0"/><stop offset="1" stop-color="#2A2480"/></linearGradient>
      <linearGradient id="kgGrBarr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8DC"/><stop offset="1" stop-color="#F0D890"/></linearGradient>
      <radialGradient id="kgGrCab" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#3A3A50"/><stop offset="1" stop-color="#0E0E18"/></radialGradient>
      <linearGradient id="kgPia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A9A5E"/><stop offset=".45" stop-color="#D8D8B0"/><stop offset="1" stop-color="#F4F2E0"/></linearGradient>
      <linearGradient id="kgPiaFin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4C84A"/><stop offset="1" stop-color="#D8902A"/></linearGradient>
      <linearGradient id="kgBigua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3E44"/><stop offset="1" stop-color="#121418"/></linearGradient>
      <linearGradient id="kgTatu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8A890"/><stop offset="1" stop-color="#7A6A54"/></linearGradient>
      <radialGradient id="kgVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#1A1008" stop-opacity="0"/><stop offset="1" stop-color="#1A1008" stop-opacity=".32"/></radialGradient>
      <linearGradient id="kgNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E4" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E4" stop-opacity=".65"/></linearGradient>
      <linearGradient id="kgCortina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A88A8" stop-opacity=".32"/><stop offset="1" stop-color="#7A88A8" stop-opacity="0"/></linearGradient>
      <linearGradient id="kgNoite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2250"/><stop offset="1" stop-color="#E07A4A"/></linearGradient>
      <pattern id="kgCaus" width="80" height="26" patternUnits="userSpaceOnUse"><path d="M0 13 C10 4 20 22 30 10 C40 2 50 20 60 12 C68 6 74 16 80 13 M10 24 C18 19 26 26 34 22" stroke="#fff" stroke-width="1.4" fill="none" opacity=".45"/></pattern>
      <pattern id="kgCana" width="7" height="5" patternUnits="userSpaceOnUse"><path d="M0 4 L3.5 0 L7 4" stroke="#6E9A3A" stroke-width="1" fill="none" opacity=".7"/></pattern>
      <clipPath id="kgRioClip"><path d="M0 390 C120 386 260 392 400 388 C540 384 680 390 800 386 V500 H0Z"/></clipPath>
      <filter id="kgGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
      <filter id="kgBlur"><feGaussianBlur stdDeviation="2"/></filter><filter id="kgBlur8" x="-.3" y="-.3" width="1.6" height="1.6"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="800" height="230" fill="url(#kgCeu)"/>
    <g id="kg-sol" class="toque"><g id="kg-sol-pos"><circle cx="716" cy="62" r="52" fill="#FFE27A" opacity=".2"/><circle cx="716" cy="62" r="36" fill="#FFE27A" opacity=".3"/><circle cx="716" cy="62" r="25" fill="url(#kgSolG)" stroke="#F0A81E" stroke-width="2"/><path d="M703 54 q7 -9 18 -9" stroke="#FFF8D0" stroke-width="3.4" fill="none" stroke-linecap="round"/><g id="kg-sol-dica" style="display:none"><circle cx="716" cy="62" r="34" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/><path d="M670 62 h-34 M644 54 l-9 8 l9 8" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${brilhoHotspot(744, 38)}</g><circle cx="716" cy="62" r="40" fill="transparent"/></g></g>
    <g class="deriva"><use href="#nuvem" x="560" y="24" width="84" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="70" y="40" width="70" height="34" style="color:#fff" opacity=".8"/></g>
    <g stroke="#4A5470" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".6"><path d="M190 96 q5 -5 10 0 q5 -5 10 0"/><path d="M214 84 q4 -4 8 0 q4 -4 8 0"/></g>
    <rect id="kg-noite" width="800" height="230" fill="url(#kgNoite)" opacity="0" pointer-events="none"/>
    <!-- longe: morros, plantações e a cidade -->
    <path d="M0 176 C90 160 180 168 260 172 C360 160 460 150 560 164 C650 156 740 160 800 166 V220 H0Z" fill="url(#kgLonge1)"/>
    <g id="kg-cidade" class="toque" opacity=".9">${[[560, 172, 14, 16], [576, 168, 10, 22], [588, 174, 16, 12], [606, 166, 12, 26], [620, 172, 18, 14], [650, 170, 12, 18], [664, 175, 16, 10], [682, 170, 10, 18], [694, 173, 18, 14], [716, 169, 12, 20], [730, 174, 16, 12], [748, 171, 12, 16]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C4D0D8"/><rect x="${F(x + w * .62)}" y="${y}" width="${F(w * .38)}" height="${h}" fill="#AEBCC8"/>${h > 15 ? `<path d="M${x + 2} ${y + 4} h${w - 4} M${x + 2} ${y + 9} h${w - 4}" stroke="#E0E8EE" stroke-width=".8" stroke-dasharray="1.4 1.4"/>` : ''}`).join('')}
      <path d="M638 186 V150 L642 142 L646 150 V186Z" fill="#D4DCE4" stroke="#9AA8B8" stroke-width=".7"/><path d="M642 142 v-5 M640 139.6 h4" stroke="#9AA8B8" stroke-width=".8"/>
      <path d="M766 186 V158 M778 186 V158 M764 158 h16 v-10 h-16Z" stroke="#A0AEBE" stroke-width="1.6" fill="#C4D0D8"/>
      <rect x="550" y="160" width="250" height="30" fill="transparent"/></g>
    <path d="M0 190 C80 178 160 182 240 186 C320 178 420 176 520 184 C620 176 720 182 800 180 V224 H0Z" fill="url(#kgLonge2)"/>
    <g opacity=".85"><path d="M60 188 L120 184 L150 194 L80 198Z" fill="url(#kgCana)"/><path d="M60 188 L120 184 L150 194 L80 198Z" fill="#B8D07A" opacity=".45"/><path d="M420 186 L500 182 L520 192 L440 196Z" fill="#D8C87A" opacity=".7"/><path d="M520 190 L600 186 L640 196 L548 198Z" fill="url(#kgCana)"/><path d="M660 186 L740 184 L770 192 L690 196Z" fill="#C8D88A" opacity=".6"/></g>
    <g opacity=".75">${Array.from({ length:34 }, (_, i) => { const x = i * 24 + R(-5, 5), y = 194 + R(-2, 3), r = R(5, 9); return `<path d="${copa(x, y - r * .6, r, r * .7, 7, .3)}" fill="${['#6E9A5A', '#7EA866', '#5E8A54'][i % 3]}"/>`; }).join('')}</g>
    <rect y="170" width="800" height="50" fill="url(#kgNevoa)"/>
    <!-- aldeia no alto do morro -->
    <g id="kg-aldeia" transform="translate(0 -25)">
      ${mangueira(214, 206, 16)}${bananeira(238, 206, .8)}${bananeira(374, 212, .7)}
      ${casa(250, 208, 26, 14, '#F2E2C8', '#C8553A')}${casa(340, 210, 24, 13, '#E8C8A0', '#B84A30')}
      <g id="kg-escola" class="toque"><rect x="280" y="190" width="52" height="19" fill="#FFF0D8" stroke="#6A3A24" stroke-width=".9"/><path d="M277 191 L286 181 H326 L335 191Z" fill="#C8553A" stroke="#7A2A16" stroke-width=".9" stroke-linejoin="round"/>
        <path d="M280 203 h52" stroke="#3FA864" stroke-width="2.6"/><path d="M280 205.4 h52" stroke="#FFC83D" stroke-width="1.6"/>
        ${[286, 296, 316, 324].map(x => `<rect x="${x}" y="194" width="6" height="5" fill="#7EC0E0" stroke="#6A3A24" stroke-width=".5"/>`).join('')}<rect x="305" y="196" width="7" height="13" fill="#3E7A9A" stroke="#5A2A14" stroke-width=".5"/>
        <g transform="translate(290 199) scale(.5)"><path d="M-6 0 C-3 -3 3 -3 6 0 C3 3 -3 3 -6 0Z M6 0 l3 -2 v4Z" fill="#3E9AE0"/></g><g transform="translate(320 200) scale(.5)"><path d="M-6 0 C-3 -3 3 -3 6 0 C3 3 -3 3 -6 0Z M6 0 l3 -2 v4Z" fill="#FF8A3A"/></g>
        <path d="M338 209 V178" stroke="#8A8A90" stroke-width="1"/><g id="kg-bandeira"><rect x="338.5" y="178" width="11" height="7.6" fill="#2E9A4A"/><path d="M340 181.8 L344 179 L348 181.8 L344 184.6Z" fill="#FFD02A"/><circle cx="344" cy="181.8" r="1.6" fill="#2E5AB0"/></g>
        <rect x="276" y="176" width="76" height="36" fill="transparent"/></g>
      ${mangueira(392, 212, 13)}${mangueira(196, 210, 12)}
      <g stroke="#fff" stroke-width=".9" opacity=".8"><path d="M362 212 v-8 h10 v8"/></g>
    </g>
    <!-- o morro (encosta) -->
    <path id="kg-encosta" d="${slopeD}" fill="url(#kgEncosta)" stroke="#8A4A22" stroke-width="1.4"/>
    <path d="${slopeD}" fill="url(#kgEncLado)"/>
    <g opacity=".5">${Array.from({ length:26 }, () => { const x = R(10, 790), y = R(222, 380), w = R(30, 80); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(w)}" ry="${F(w * .16)}" fill="${R(0, 1) < .5 ? '#F2C488' : '#C27040'}" opacity="${F(R(.25, .5))}"/>`; }).join('')}</g>
    <path d="M0 214 C40 240 90 300 130 394 H0Z" fill="#5A2410" opacity=".2" filter="url(#kgBlur8)"/>
    <path d="M392 204 C420 214 474 216 508 206 C534 262 556 330 584 394 H306 C330 330 360 262 392 204Z" fill="#6A2A10" opacity=".26" filter="url(#kgBlur8)"/>
    <ellipse cx="270" cy="236" rx="170" ry="44" fill="#FFE8BE" opacity=".5" filter="url(#kgBlur8)"/><ellipse cx="660" cy="230" rx="130" ry="34" fill="#FFE8BE" opacity=".45" filter="url(#kgBlur8)"/>
    <rect y="330" width="800" height="64" fill="url(#kgPe)"/>
    <g fill="#B8502A" opacity=".32">${[[300, 256, 40], [590, 272, 46], [370, 362, 54], [530, 360, 50], [660, 332, 34], [140, 300, 40]].map(([x, y, w]) => `<path d="${copa(x, y + CO(x) * .5, w, w * .18, 10, .5)}"/>`).join('')}</g>
    <g fill="none" stroke-linecap="round">${Array.from({ length:14 }, (_, i) => { const y0 = 226 + 162 * Math.pow(i / 13, 1.3); let d = '', on = false; for (let x = 0; x <= 800; x += 16) { const y = y0 + CO(x) * (.4 + i * .06) + Math.sin(x * .05 + i) * 1.2; if (y < crista(x) + 7) { on = false; continue; } d += (on ? 'L' : 'M') + x + ' ' + F(y) + ' '; on = true; } const w = .7 + i * .09; return `<path d="${d}" stroke="#A85A2E" stroke-width="${F(w * 1.6)}" opacity=".45" stroke-dasharray="${F(30 + i * 4)} ${F(8 + i)}"/><path d="${d}" stroke="#FFE6B8" stroke-width="${F(w * .8)}" opacity=".5" transform="translate(0 ${F(w * 1.6)})" stroke-dasharray="${F(24 + i * 4)} ${F(14 + i)}"/>`; }).join('')}</g>
    <path d="${cristaD}" stroke="#FFE6B8" stroke-width="2.6" fill="none" opacity=".75" transform="translate(0 2)"/>
    <g id="kg-pasto" opacity=".85">${Array.from({ length:22 }, () => { const x = R(0, 800), y = R(214, 384), w = R(24, 70); return `<path d="${copa(x, y, w, w * .18, 9, .4)}" fill="#C8C06A" opacity="${F(R(.25, .45))}"/>`; }).join('')}${Array.from({ length:70 }, () => { const x = R(4, 796), y = R(218, 386); return naGrota(x, y) ? '' : tufo(x, y, R(5, 9), '#C8D27A', '#8A8A3A'); }).join('')}</g>
    <g stroke="#A85A2E" stroke-width="1.3" fill="none" opacity=".45" stroke-linecap="round">${Array.from({ length:26 }, () => { const x = R(220, 680), y = R(226, 330); const L = R(20, 46); return naGrota(x, y) ? '' : `<path d="M${F(x)} ${F(y)} q${F((448 - x) * .03 + R(-2, 2))} ${F(L * .4)} ${F((448 - x) * .07 + R(-2, 2))} ${F(L)}"/>`; }).join('')}</g>
    <g opacity=".55">${Array.from({ length:420 }, () => { const x = R(4, 796), y = R(crista(0) - 30, 392); if (y < crista(x) + 2) return ''; const c2 = ['#8A3A18', '#A84A20', '#FFF0CC', '#C86A34', '#6A2A10'][Math.floor(R(0, 5))]; return `<circle cx="${F(x)}" cy="${F(y)}" r="${F(R(.4, 1.2) * (.6 + (y - 200) / 300))}" fill="${c2}"/>`; }).join('')}</g>
    <g>${Array.from({ length:34 }, () => { const x = R(10, 790), y = R(226, 388); if (y < crista(x) + 6 || naGrota(x, y)) return ''; const r = R(1.4, 3.2) * (.6 + (y - 200) / 260); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(r)}" ry="${F(r * .62)}" fill="${R(0, 1) < .5 ? '#B8AC98' : '#D8C8A8'}" stroke="#5E4A34" stroke-width=".6"/><path d="M${F(x - r * .5)} ${F(y - r * .2)} q${F(r * .4)} ${F(-r * .4)} ${F(r * .8)} 0" stroke="#fff" stroke-width=".6" fill="none" opacity=".7"/>`; }).join('')}</g>
    ${cupim(334, 238, 16)}${cupim(522, 236, 12)}${cupim(770, 350, 22)}${cupim(196, 364, 18)}
    ${[[290, 236, 9], [592, 236, 8], [362, 330, 11], [520, 322, 10], [690, 268, 9], [232, 300, 8]].map(([x, y, w]) => toco(x, y, w)).join('')}
    <g id="kg-capim" style="opacity:0;transition:opacity 2.4s" pointer-events="none"><path d="${slopeD}" fill="#7AB848" opacity=".32"/>${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(222, 380), w = R(30, 70); return `<path d="${copa(x, y, w, w * .2, 9, .4)}" fill="#8ACB5A" opacity=".35"/>`; }).join('')}${Array.from({ length:90 }, () => { const x = R(4, 796), y = R(220, 388); return naGrota(x, y) ? '' : tufo(x, y, R(6, 10), '#C8F08A', '#4E8A2E'); }).join('')}</g>
    <g id="kg-cerca">${Array.from({ length:25 }, (_, i) => { const x = 474 + i * 13.2, y = crista(x) + 13; return `<path d="M${F(x)} ${F(y + 6)} V${F(y - 5)}" stroke="#6A4A2E" stroke-width="1.7"/><path d="M${F(x - .5)} ${F(y + 5)} V${F(y - 4)}" stroke="#B89A72" stroke-width=".5"/>`; }).join('')}<path d="${Array.from({ length:25 }, (_, i) => { const x = 474 + i * 13.2; return `${i ? 'L' : 'M'}${F(x)} ${F(crista(x) + 10)}`; }).join(' ')}" stroke="#8A8070" stroke-width=".7" fill="none"/><path d="${Array.from({ length:25 }, (_, i) => { const x = 474 + i * 13.2; return `${i ? 'L' : 'M'}${F(x)} ${F(crista(x) + 14)}`; }).join(' ')}" stroke="#8A8070" stroke-width=".7" fill="none"/></g>
    <g id="kg-vacas" class="toque"><g id="kg-vacas-in">${vaca(604, 250, 1.25, 1, '#F4F2EC')}${vaca(648, 258, 1.1, -1, '#E2DDD4')}</g><rect x="582" y="222" width="90" height="42" fill="transparent"/></g>
    <!-- ipê-amarelo no alto do morro -->
    <g id="kg-ipe" class="toque" transform="translate(0 -22)"><g class="balanca" style="animation-duration:7s;transform-origin:704px 214px"><path d="M704 214 C703 196 700 186 692 176 M704 206 C708 192 714 184 722 178 M703 200 V170" stroke="#4A3428" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="${copa(704, 166, 32, 20, 12, .3)}" fill="url(#kgIpeAm)" stroke="#B07A08" stroke-width="1.2"/><g fill="#FFF4A0" stroke="#C8900A" stroke-width=".4">${Array.from({ length:36 }, () => { const a = R(0, 6.28), rr = Math.sqrt(R(0, 1)); return `<circle cx="${F(704 + Math.cos(a) * 28 * rr)}" cy="${F(166 + Math.sin(a) * 17 * rr)}" r="${F(R(1.6, 2.8))}"/>`; }).join('')}</g><path d="${copa(694, 160, 13, 7, 7, .3)}" fill="#FFFBD0" opacity=".55"/></g><rect x="668" y="140" width="72" height="76" fill="transparent"/></g>
    <!-- tatu-galinha na toca -->
    <g id="kg-tatu" class="toque"><ellipse cx="742" cy="306" rx="18" ry="5" fill="#B8703A"/><ellipse cx="742" cy="303" rx="11" ry="6" fill="#3A1A0A"/>
      <g id="kg-tatu-in" style="transform:translateY(12px);transition:transform .5s cubic-bezier(.3,1.5,.5,1)"><g clip-path="url(#kgTocaClip)"><g transform="translate(742 300)"><path d="M-10 4 C-10 -6 -4 -10 2 -10 C8 -10 12 -6 12 0 L12 6 H-10Z" fill="url(#kgTatu)" stroke="#4A3A2A" stroke-width="1"/><path d="M-6 -8 V4 M-2 -10 V4 M2 -10 V4 M6 -9 V4" stroke="#5A4A36" stroke-width=".9"/><path d="M10 -4 L20 -2 L12 2Z" fill="#C8B49A" stroke="#4A3A2A" stroke-width=".8"/><path d="M8 -8 l-1 -6 l4 4Z" fill="#C8A890" stroke="#4A3A2A" stroke-width=".7"/><circle cx="12" cy="-3" r="1.1" fill="#12121A"/><circle cx="12.3" cy="-3.3" r=".4" fill="#fff"/></g></g></g>
      <ellipse cx="742" cy="308" rx="16" ry="3" fill="#C8783E"/><rect x="718" y="282" width="48" height="32" fill="transparent"/></g>
    <!-- curvas de nível -->
    <g id="kg-linhas" style="display:none">${ROWS.map((y, i) => `<g class="kg-linha toque" data-i="${i}"><path class="kg-lin-guia" d="${rowD(i)}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="7 7" opacity=".85" stroke-linecap="round"/><path class="kg-lin-prog" d="${rowD(i)}" stroke="#8ADA5A" stroke-width="5" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" opacity=".9"/>${brilhoHotspot(240, rowY(i, 240) - 12)}<path d="M228 ${F(rowY(i, 232))} l-8 -6 v12Z" fill="#fff" opacity=".9"/><path d="${rowD(i)}" stroke="transparent" stroke-width="30" fill="none"/></g>`).join('')}</g>
    <g id="kg-fileiras">${ROWS.map((y, i) => `<g class="kg-fileira" data-i="${i}">${Array.from({ length:28 }, (_, k) => { const x = 238 + k * 15.4 + R(-2, 2), yy = rowY(i, x) + 2; return naGrota(x, yy) ? '' : plantinha(x, yy, i); }).join('')}</g>`).join('')}</g>
    <!-- voçoroca -->
    <g id="kg-voc">
      ${[.2, .55, 1].map((k, j) => `<g class="kg-voc-est" data-j="${j}" style="opacity:0;transition:opacity 1.4s">
        ${gully3D(k)}
      </g>`).join('')}
      <g id="kg-voc-verde" style="opacity:0;transition:opacity 2s">
        <path d="${gulD(1, 1.5)}" fill="url(#kgVerdeVoc)" stroke="#4E8A2E" stroke-width="1.4"/>
        <path d="${gulD(.45)}" fill="#2E6A26" opacity=".35" filter="url(#kgBlur)"/>
        <path d="M${GX(GTOP + 4)} ${GTOP + 4} ${Array.from({ length:24 }, (_, n) => `L${F(GX(GTOP + 8 + n * 6) + Math.sin(n * .9) * 2)} ${GTOP + 8 + n * 6}`).join(' ')}" stroke="#7ACB8A" stroke-width="1.6" fill="none" opacity=".55"/>
        ${Array.from({ length:56 }, () => { const y = R(GTOP + 6, 384), x = GX(y) + R(-1, 1) * GW(y, .9); return tufo(x, y, R(5, 10) * (.6 + (y - 240) / 300), '#C8F08A', '#2E6A22'); }).join('')}
        ${[[438, 372, 1, '#4E9A5E'], [454, 324, .8, '#7AB84A'], [436, 286, .62, '#2E7A5A'], [458, 352, .7, '#C8D84A']].map(([x, y, k, c2]) => `<g><path d="M${x} ${y} v${F(-10 * k)}" stroke="#4A3020" stroke-width="${F(2.4 * k)}"/><path d="${copa(x, y - 16 * k, 11 * k, 9 * k, 8, .3)}" fill="${c2}" stroke="#1E4A26" stroke-width=".8"/><path d="${copa(x - 3 * k, y - 19 * k, 5 * k, 3.6 * k, 6, .3)}" fill="#fff" opacity=".22"/></g>`).join('')}
        ${flores(446, 350, 3, '#FFFFFF', '#9A9AB0')}${flores(440, 314, 2, '#FFD02A', '#B07A08')}${flores(450, 270, 2, '#C8A0FF', '#6A4AB0')}
      </g>
    </g>
    <g id="kg-barreiras">${BAR.map((b, i) => `<g class="kg-bar" data-i="${i}" style="opacity:0;transition:opacity .4s">${palicada(b.x, b.y)}</g>`).join('')}</g>
    <g id="kg-bar-capim" style="opacity:0;transition:opacity 2s" pointer-events="none">${BAR.map(b => `${Array.from({ length:7 }, () => `<path d="${copa(b.x + R(-1, 1) * GW(b.y, .8), b.y + R(-2, 6), R(6, 10), R(3, 5), 7, .5)}" fill="${R(0, 1) < .5 ? '#6EAA48' : '#4E8E36'}"/>`).join('')}${Array.from({ length:12 }, (_, k) => tufo(b.x - GW(b.y, 1) + k * GW(b.y, 1) / 5.5 + R(-3, 3), b.y + R(-6, 6), R(7, 12), '#C8F08A', '#2E6A22')).join('')}`).join('')}</g>
    <g id="kg-vagas-bar" style="display:none">${BAR.map((b, i) => `<g class="kg-vb toque" data-i="${i}"><ellipse cx="${b.x}" cy="${b.y}" rx="${F(GW(b.y, 1) + 4)}" ry="7" fill="#fff" opacity=".3" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 4"/>${brilhoHotspot(b.x + GW(b.y, 1) + 8, b.y - 14)}<rect x="${F(b.x - GW(b.y, 1) - 10)}" y="${b.y - 24}" width="${F(GW(b.y, 1) * 2 + 20)}" height="36" fill="transparent"/></g>`).join('')}</g>
    <!-- enxurrada -->
    <g id="kg-enx" style="opacity:0;transition:opacity .8s" fill="none" stroke-linecap="round">
      ${['M300 228 C330 240 350 236 372 252 S410 270 432 288', 'M572 226 C550 238 534 236 516 252 S480 270 458 286', 'M384 222 C396 232 410 232 418 244 S434 254 440 262', 'M520 248 C506 262 498 262 490 280 S470 304 456 322', 'M246 270 C280 282 300 300 330 306 S386 330 420 352', 'M650 262 C630 280 606 284 580 300 S520 330 470 350', 'M280 240 C286 260 276 280 284 300 S290 350 284 384', 'M612 236 C606 260 616 280 608 300 S600 350 604 384', 'M350 250 C346 270 358 290 352 310 S364 350 362 384', 'M540 252 C546 272 534 290 540 310 S528 350 530 384'].map((d, i) => `<path d="${d}" stroke="#C88A50" stroke-width="${i < 6 ? 9 : 6}" opacity=".25"/><path d="${d}" stroke="#8A4A1E" stroke-width="${i < 6 ? 4.4 : 3}" opacity=".7"/><path class="kg-enx-f" d="${d}" stroke="#D89A5A" stroke-width="${i < 6 ? 2.4 : 1.6}" stroke-dasharray="10 12"/>`).join('')}
    </g>
    <!-- nascente -->
    <g id="kg-nasc" class="toque"><path d="M594 382 C600 374 636 374 642 382 C636 388 600 388 594 382Z" fill="#8A5A3A" stroke="#4E2E1A" stroke-width="1"/>
      <path id="kg-nasc-agua" d="M600 381 C606 376 630 376 636 381 C630 385 606 385 600 381Z" fill="#7CD0E8" style="opacity:0;transition:opacity 1.2s"/>
      <g fill="url(#kgTroncoI)" stroke="#4A4436" stroke-width=".8">${[[596, 380, 5, 3.4], [608, 376, 4, 2.6], [628, 376, 5, 3], [640, 380, 4.4, 3], [618, 386, 5, 2.6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <path id="kg-nasc-fio" d="M618 384 C616 388 620 392 618 398" stroke="#BFF0FF" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4 4" style="opacity:0;transition:opacity 1.2s"/>
      <g id="kg-nasc-plantas" style="opacity:.0;transition:opacity 2s">${tufo(592, 380, 10, '#C8F08A', '#2E6A2A')}${tufo(646, 380, 9, '#C8F08A', '#2E6A2A')}${flores(620, 370, 2, '#FFFFFF', '#8A8AB0')}</g>
      <rect x="586" y="364" width="64" height="30" fill="transparent"/></g>
    <!-- mata ciliar -->
    <g id="kg-ciliar">${MC.map((m, i) => `<g class="kg-arv" id="kg-arv-${i}" data-i="${i}" style="display:none"><ellipse cx="${m.x}" cy="${BANK}" rx="13" ry="3.4" fill="#5A2E14" opacity=".55"/><ellipse cx="${m.x}" cy="${BANK - 1}" rx="10" ry="2.4" fill="#8A6A3A"/><g class="kg-muda-pl" style="transition:opacity 1.2s"><g transform="translate(${m.x} ${BANK}) scale(1.35)">${muda(['#6EC04A', '#8AD04A', '#5EB05A', '#9AD86A'][i])}</g></g><g class="kg-arv-in" style="transform-origin:${m.x}px ${BANK}px;transform:scale(0);transition:transform 2.2s cubic-bezier(.3,1.2,.5,1)"><g class="balanca" style="animation-duration:${5 + i}s;transform-origin:${m.x}px ${BANK}px"><g transform="translate(${m.x} ${BANK})">${arvore(m.t)}</g></g></g><path class="kg-estaca" d="M${m.x + 7} ${BANK} V${BANK - 22}" stroke="#8A5A2A" stroke-width="2" stroke-linecap="round"/></g>`).join('')}</g>
    <g id="kg-vagas" style="display:none">${MC.map((m, i) => `<g class="kg-vaga toque" data-i="${i}"><ellipse cx="${m.x}" cy="${BANK - 2}" rx="15" ry="5.4" fill="#fff" opacity=".35" stroke="#fff" stroke-width="2.4"/><path d="M${m.x} ${BANK - 46} v24 M${m.x - 6} ${BANK - 28} l6 8 l6 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${brilhoHotspot(m.x + 14, BANK - 30)}<rect x="${m.x - 18}" y="${BANK - 52}" width="36" height="60" fill="transparent"/></g>`).join('')}</g>
    <!-- margem e rio -->
    <path d="M0 383 C120 379 260 385 400 381 C540 377 680 383 800 379 V386 H0Z" fill="#8A3E1A"/>
    <path d="M0 384 C60 384 90 390 140 389 C200 388 230 384 300 386 C360 388 380 392 420 390 C480 388 520 383 580 385 C640 388 680 391 730 388 C760 386 780 384 800 383 V396 H0Z" fill="url(#kgPraia)"/>
    <g fill="#C89858" opacity=".7">${Array.from({ length:40 }, () => `<circle cx="${F(R(0, 800))}" cy="${F(R(386, 392))}" r="${F(R(.4, 1))}"/>`).join('')}</g>
    <path d="M0 383 C120 379 260 385 400 381 C540 377 680 383 800 379" stroke="#F4C890" stroke-width="1.4" fill="none" opacity=".8"/>
    <path id="kg-lingua" d="M424 382 C432 380 458 380 468 382 C474 388 480 394 486 398 L406 398 C412 392 418 388 424 382Z" fill="#D8A060" stroke="#A86A34" stroke-width=".8" style="opacity:0;transition:opacity 1.4s"/>
    <g clip-path="url(#kgRioClip)">
      <rect y="380" width="800" height="120" fill="url(#kgRio)"/>
      <rect y="380" width="800" height="120" fill="url(#kgProf)"/>
      <g id="kg-fundo-rio">${Array.from({ length:30 }, () => { const x = R(330, 800), y = R(452, 498), r = R(2, 5); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(r)}" ry="${F(r * .55)}" fill="#7A9A8A" opacity=".55"/>`; }).join('')}${[[560, 498, 40], [640, 500, 52], [380, 500, 34], [700, 498, 30]].map(([x, y, h]) => `<g class="balanca" style="animation-duration:${F(R(3.6, 5))}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y} C${x - 6} ${y - h * .4} ${x + 6} ${y - h * .7} ${x} ${y - h} M${x + 5} ${y} C${x + 10} ${y - h * .3} ${x + 2} ${y - h * .6} ${x + 8} ${y - h * .8}" stroke="#2E7A5A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></g>`).join('')}</g>
      <path d="M0 388 C200 384 600 386 800 384 V398 C600 400 200 400 0 400Z" fill="#E0A060" opacity=".22" filter="url(#kgBlur)"/>
      <rect y="388" width="800" height="60" fill="url(#kgCaus)" opacity=".3" id="kg-caus"/>
      <g id="kg-reflexo" opacity=".42" filter="url(#kgBlur)">${MC.map((m, i) => `<use href="#kg-arv-${i}" transform="translate(0 ${2 * BANK + 6}) scale(1 -1)"/>`).join('')}</g>
      <g id="kg-raios">${[[180, 14], [300, 26], [520, 22], [640, 30], [720, 18]].map(([x, w]) => `<path d="M${x} 390 L${x + w} 390 L${x + w + 24} 500 L${x + 6} 500Z" fill="url(#kgRaio)" opacity=".4"/>`).join('')}</g>
      <g id="kg-banco" style="transform-origin:446px 388px;transform:scale(0);transition:transform 1.6s ease-out"><path d="M380 388 C366 394 356 404 364 414 C372 424 394 424 408 432 C424 440 450 436 468 440 C494 442 522 434 528 420 C534 406 518 394 508 388Z" fill="#B88A50" opacity=".6"/><path d="M386 388 C374 394 366 402 372 410 C380 418 398 418 410 426 C426 432 450 430 466 432 C490 434 514 426 518 414 C522 402 512 392 502 388Z" fill="url(#kgBancoG)" stroke="#B07A40" stroke-width="1.2"/><g stroke="#C8904E" stroke-width="1" fill="none" opacity=".75">${[0, 1, 2, 3].map(n => `<path d="M${392 + n * 6} ${400 + n * 6} q${30 - n * 4} ${6 - n} ${56 - n * 6} 0 t${50 - n * 6} -4"/>`).join('')}</g><path d="M446 388 C444 400 450 412 440 426" stroke="#8A5A2A" stroke-width="2" fill="none" opacity=".45"/><g fill="#C8884A" opacity=".6">${Array.from({ length:16 }, () => `<circle cx="${F(R(392, 510))}" cy="${F(R(392, 424))}" r="${F(R(.7, 1.5))}"/>`).join('')}</g><g id="kg-banco-verde" style="opacity:0;transition:opacity 2s">${tufo(420, 404, 7, '#C8F08A', '#3E7A2A')}${tufo(480, 402, 6, '#C8F08A', '#3E7A2A')}${tufo(452, 410, 6, '#C8F08A', '#3E7A2A')}</g></g>
      <rect id="kg-lama" y="380" width="800" height="120" fill="url(#kgLamaG)" opacity="0" style="transition:opacity 1.6s" pointer-events="none"/>
      <g id="kg-redemo" opacity="0" style="transition:opacity 1.6s" fill="none" stroke-linecap="round" pointer-events="none">${Array.from({ length:16 }, () => { const x = R(20, 780), y = R(400, 492); return `<path d="M${F(x)} ${F(y)} c8 -4 18 -4 22 2 c3 5 -6 8 -10 4" stroke="${R(0, 1) < .5 ? '#E8B878' : '#6A3A14'}" stroke-width="${F(R(1, 2))}" opacity=".6"/>`; }).join('')}</g>
      <ellipse id="kg-pluma" cx="460" cy="400" rx="260" ry="40" fill="url(#kgPluma)" opacity="0" style="transition:opacity 1.6s" pointer-events="none"/>
      <rect id="kg-agua-toque" y="392" width="800" height="108" fill="transparent"/>
      <g stroke="#E6F6FF" stroke-width="1.3" fill="none" opacity=".7" id="kg-ondas"><path d="M40 404 q8 -2 16 0 M150 420 q8 -2 16 0 M262 410 q8 -2 16 0 M560 414 q8 -2 16 0 M680 424 q8 -2 16 0 M740 404 q8 -2 16 0 M330 468 q8 -2 16 0 M600 470 q8 -2 16 0"/></g>
      <g fill="#fff">${Array.from({ length:12 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .37 % 2.4)}s" x="${F(30 + (i * 67) % 740)}" y="${F(398 + (i * 17) % 70)}" width="${8 + i % 3 * 5}" height="1.6" rx=".8" opacity=".7"/>`).join('')}</g>
    </g>
    <!-- galho seco no rio e biguá -->
    <path d="M770 470 C760 440 748 420 740 404 M752 428 C760 420 770 418 778 410" stroke="#3A2A1E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M770 470 C760 440 748 420 740 404" stroke="#8A7058" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g id="kg-bigua" class="toque" style="opacity:0;transition:opacity .8s;pointer-events:none"><g id="kg-bigua-pos" transform="translate(744 406)"><g id="kg-bigua-in">${bigua()}</g></g><rect x="720" y="352" width="56" height="60" fill="transparent"/></g>
    <!-- piapara (figurinha) -->
    <g id="kg-piapara" class="toque" data-fig="piapara"><g id="kg-pia-op" style="transition:opacity 1.6s;opacity:.55"><g transform="translate(478 470)"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><g id="kg-pia-in">${piapara(.9)}</g></g></g></g>${brilhoHotspot(504, 456)}<rect x="446" y="452" width="66" height="34" fill="transparent"/></g>
    <g id="kg-pia-salto" style="opacity:0" pointer-events="none"><g id="kg-pia-salto-pos">${piapara(.8)}</g></g>
    <g id="kg-achados" style="display:none">${ACHA.map((a, i) => `<g class="kg-acha toque" data-i="${i}"><circle cx="${a.x}" cy="${a.y}" r="18" fill="#fff" opacity=".22" stroke="#fff" stroke-width="2.2" stroke-dasharray="4 4"/>${brilhoHotspot(a.x, a.y)}<circle cx="${a.x}" cy="${a.y}" r="26" fill="transparent"/></g>`).join('')}</g>
    <!-- margem da frente (esquerda) -->
    <path d="M0 405 C70 407 160 423 236 446 C278 460 306 480 326 500" stroke="url(#kgPraia)" stroke-width="12" fill="none"/><path d="M0 399 C70 401 164 417 240 440 C282 455 312 476 334 500" stroke="#E8F6FF" stroke-width="1.2" fill="none" opacity=".6"/>
    <path d="M0 412 C70 414 160 430 232 452 C272 466 300 484 318 500 H0Z" fill="url(#kgTerraF)" stroke="#3A4A1A" stroke-width="1.4"/>
    <path d="M0 414 C70 416 160 432 232 454 C272 468 300 486 316 500" stroke="#C8E08A" stroke-width="1.6" fill="none" opacity=".6"/>
    <path d="M0 416 C70 418 160 434 232 456 C262 466 286 480 304 496" stroke="#8A5A2A" stroke-width="2.6" fill="none" opacity=".35"/>
    <g>${Array.from({ length:36 }, () => { const x = R(4, 290), y = R(430, 498); return (y < 414 + x * .18 + (x > 200 ? (x - 200) * .5 : 0)) ? '' : tufo(x, y, R(6, 11), '#B8E07A', '#3E6A22'); }).join('')}</g>
    ${flores(40, 466, 4, '#FFFFFF', '#9A9AB0')}${flores(250, 482, 3, '#FFD02A', '#B07A08')}
    <!-- ingá (figurinha) -->
    <g id="kg-inga">
      <path d="M22 500 C30 450 26 410 40 360 C46 336 56 318 70 300" stroke="#3E3428" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M22 500 C30 450 26 410 40 360 C46 336 56 318 70 300" stroke="url(#kgTroncoI)" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M26 480 C30 440 30 410 38 380" stroke="#B8B0A0" stroke-width="2" fill="none" opacity=".6"/><path d="M34 440 c4 -2 6 -6 5 -10 M30 410 c4 -2 5 -5 4 -8" stroke="#4A4436" stroke-width="1.2" fill="none"/>
      <path d="M46 340 C80 330 120 324 168 318 M60 312 C40 290 24 270 8 252 M70 300 C100 280 130 262 170 252" stroke="#3E3428" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M46 340 C80 330 120 324 168 318 M60 312 C40 290 24 270 8 252 M70 300 C100 280 130 262 170 252" stroke="#8A8270" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="${copa(70, 250, 110, 44, 18, .25)}" fill="#1E4A26" opacity=".55" transform="translate(4 8)"/>
      <path d="${copa(70, 250, 110, 44, 18, .25)}" fill="url(#kgCopaInga)" stroke="#1E4A26" stroke-width="1.6"/>
      <path d="${copa(150, 296, 46, 22, 11, .3)}" fill="url(#kgCopaInga)" stroke="#1E4A26" stroke-width="1.4"/>
      <path d="${copa(20, 288, 40, 20, 10, .3)}" fill="url(#kgCopaInga)" stroke="#1E4A26" stroke-width="1.4"/>
      <g fill="none" stroke="#2E6A32" stroke-width="1.4" opacity=".7">${Array.from({ length:40 }, () => { const x = R(-20, 190), y = R(216, 300); return `<path d="M${F(x)} ${F(y)} q4 -3 8 0 q4 -3 8 0"/>`; }).join('')}</g>
      <g fill="#B8E890" opacity=".55">${Array.from({ length:30 }, () => { const x = R(0, 150), y = R(214, 262); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="4" ry="1.8" transform="rotate(${F(R(-30, 30))} ${F(x)} ${F(y)})"/>`; }).join('')}</g>
      <path d="M-10 236 C30 214 90 208 140 218" stroke="#E6FFD0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
      <g id="kg-vagens" class="toque" data-fig="inga"><g class="balanca" style="animation-duration:4s;transform-origin:150px 312px">${[[134, 310, 8], [146, 314, -6], [158, 312, 14], [170, 316, -2]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C-3 4 -1 8 -2 12 C-3 16 -1 20 -1 24 C-1 30 2 36 5 38 C7 39 8 37 7 34 C5 30 6 26 5 22 C4 18 6 14 5 10 C4 6 5 3 4 0Z" fill="url(#kgVagem)" stroke="#4E6A1A" stroke-width="1"/><path d="M1.6 4 C1 12 2 22 4 34" stroke="#E8F4A0" stroke-width=".9" fill="none" opacity=".85"/><path d="M-1.6 8 h6 M-2 15 h6.4 M-1.6 22 h6.4 M-.6 29 h6" stroke="#6E8A2A" stroke-width=".6"/><path d="M2 0 v-4" stroke="#4E6A1A" stroke-width="1.2"/></g>`).join('')}</g>${brilhoHotspot(182, 318)}<rect x="126" y="304" width="62" height="46" fill="transparent"/></g>
    </g>
    <g id="kg-vagem-cai" style="opacity:0" pointer-events="none"><g transform="rotate(30)"><path d="M0 0 C-4 8 -2 20 2 30 C4 34 7 34 7 30 C5 20 4 8 4 0Z" fill="url(#kgVagem)" stroke="#4E6A1A" stroke-width="1"/></g></g>
    <!-- Tita, a gralha-picaça -->
    <g id="kg-tita" class="toque" data-fig="gralhapicaca"><g id="kg-tita-pos" transform="translate(116 322) scale(1.05)"><g id="kg-tita-in">${gralha()}</g></g>${brilhoHotspot(150, 270)}<rect x="74" y="270" width="72" height="62" fill="transparent"/></g>
    <!-- artesã, cesto, mudas e bambus -->
    <g id="kg-artesa" class="toque">${artesa(112, 488, 1.62)}</g>
    <g id="kg-cesto" class="toque" data-fig="cestokaingang"><g style="animation:flutua 3.4s ease-in-out infinite alternate">${cesto(56, 494, 1.5)}</g>${brilhoHotspot(80, 444)}<rect x="28" y="436" width="56" height="62" fill="transparent"/></g>
    <g id="kg-bandeja"><path d="M168 486 L172 470 H238 L242 486Z" fill="url(#kgPalha)" stroke="#6A4418" stroke-width="1.3" stroke-linejoin="round"/><path d="M168 486 L172 470 H238 L242 486Z" fill="url(#kgTrama)"/><path d="M172 470 H238" stroke="#7A5222" stroke-width="2.4"/></g>
    <g id="kg-mudas">${[0, 1, 2, 3].map(i => `<g class="kg-muda toque" data-i="${i}" transform="translate(${184 + i * 15} 476)" style="cursor:grab"><g class="kg-muda-in">${muda(['#6EC04A', '#8AD04A', '#5EB05A', '#9AD86A'][i])}</g><g class="kg-muda-dica" style="display:none">${brilhoHotspot(4, -32)}</g><rect x="-9" y="-30" width="18" height="34" fill="transparent"/></g>`).join('')}</g>
    <g id="kg-feixes">${[0, 1].map(i => `<g class="kg-feixe toque" data-i="${i}" transform="translate(${272 + i * 26} 494)" style="cursor:grab"><g transform="rotate(${i ? 8 : -8})">${feixe()}</g><g class="kg-feixe-dica" style="display:none">${brilhoHotspot(10, -34)}</g><rect x="-16" y="-32" width="32" height="38" fill="transparent"/></g>`).join('')}</g>
    <!-- primeiro plano direito -->
    <path d="M540 500 C600 488 700 482 800 478 V500Z" fill="url(#kgTerraF)" stroke="#3A4A1A" stroke-width="1.2"/>
    <g class="balanca" style="animation-duration:5s;transform-origin:780px 500px">${taboa(762, 496, 96)}${taboa(774, 498, 112)}${taboa(788, 496, 84)}${folhaLonga(756, 498, 90, -14, '#5EA84A', '#24562E')}${folhaLonga(780, 498, 104, 8, '#4E9A3E', '#1E4A26')}${folhaLonga(794, 498, 80, -6, '#6EB85A', '#24562E')}</g>
    <g>${Array.from({ length:14 }, () => { const x = R(560, 760), y = R(488, 500); return tufo(x, y, R(8, 14), '#B8E07A', '#3E6A22'); }).join('')}</g>
    ${flores(620, 486, 3, '#C8A0FF', '#6A4AB0')}${flores(700, 482, 3, '#FFFFFF', '#9A9AB0')}
    <g id="kg-borbs" class="toque">${[[664, 458, 1], [700, 446, .8]].map(([x, y, k], i) => `<g transform="translate(${x} ${y}) scale(${k})"><g class="kg-borb-voo"><g style="animation:flutua ${2 + i * .5}s ease-in-out infinite alternate"><g class="kg-asas"><path d="M0 0 C-4 -10 -14 -12 -14 -5 C-14 0 -7 2 0 1Z M0 1 C-7 3 -10 8 -6 10 C-3 11 -1 6 0 3Z M0 0 C4 -10 14 -12 14 -5 C14 0 7 2 0 1Z M0 1 C7 3 10 8 6 10 C3 11 1 6 0 3Z" fill="#FFE04A" stroke="#A87A08" stroke-width="1" stroke-linejoin="round"/><circle cx="-8" cy="-5" r="1.2" fill="#E0901A"/><circle cx="8" cy="-5" r="1.2" fill="#E0901A"/></g><ellipse cx="0" cy="2" rx="1.2" ry="4.6" fill="#4A3A10"/><path d="M0 -2 l-3 -4 M0 -2 l3 -4" stroke="#4A3A10" stroke-width=".7"/></g></g><rect x="-16" y="-14" width="32" height="28" fill="transparent"/></g>`).join('')}</g>
    <g class="balanca" style="animation-duration:6s;transform-origin:10px 500px">${folhaLonga(2, 502, 70, 10, '#5EA84A', '#24562E')}${folhaLonga(10, 502, 90, -4, '#4E9A3E', '#1E4A26')}${folhaLonga(18, 502, 60, 16, '#7AB85A', '#24562E')}${tufo(28, 500, 18, '#B8E07A', '#3E6A22')}</g>
    <g class="balanca" style="animation-duration:5.4s;transform-origin:612px 500px">${[[-30, 34], [-14, 44], [4, 40], [20, 32]].map(([a, h]) => `<path d="M612 500 C${612 + a * .3} ${500 - h * .5} ${612 + a} ${500 - h * .8} ${612 + a * 1.2} ${500 - h} C${612 + a * .6} ${500 - h * .7} ${612 + a * .2} ${500 - h * .4} 616 500Z" fill="#6EB85A" stroke="#24562E" stroke-width="1"/><path d="M614 500 C${613 + a * .3} ${500 - h * .5} ${613 + a * .8} ${500 - h * .78} ${613 + a * 1.1} ${500 - h * .96}" stroke="#C8F0A0" stroke-width=".8" fill="none" opacity=".7"/>`).join('')}</g>
    <!-- crianças (fase 3) -->
    <g id="kg-criancas" style="opacity:0;transition:opacity 1s;pointer-events:none">
      <g id="kg-menina" class="toque kg-crianca" data-i="0"><g id="kg-menina-pos">${menina(376, 394, 1.55)}</g><g class="kg-cr-dica">${brilhoHotspot(396, 290)}</g></g>
      <g id="kg-menino" class="toque kg-crianca" data-i="1"><g id="kg-menino-pos">${menino(522, 394, 1.55)}</g><g class="kg-cr-dica">${brilhoHotspot(546, 290)}</g></g>
    </g>
    <g id="kg-ipe-novo" style="transform-origin:446px 396px;transform:scale(0);transition:transform 2s cubic-bezier(.3,1.3,.5,1)" pointer-events="none"><ellipse cx="440" cy="398" rx="14" ry="3.4" fill="#5A2E14" opacity=".5"/><path d="M440 398 C439 384 437 376 432 368 M440 392 C442 382 446 376 450 370 M440 388 V362" stroke="#4A3428" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="${copa(440, 358, 18, 12, 10, .3)}" fill="url(#kgIpeAm)" stroke="#B07A08" stroke-width="1"/><g fill="#FFF4A0" stroke="#C8900A" stroke-width=".4">${Array.from({ length:12 }, () => `<circle cx="${F(440 + R(-14, 14))}" cy="${F(358 + R(-8, 8))}" r="${F(R(1.2, 2))}"/>`).join('')}</g></g>
    <path id="kg-cortina" d="M292 112 L456 112 L700 384 L226 384Z" fill="url(#kgCortina)" filter="url(#kgBlur)" opacity="0" style="transition:opacity .8s" pointer-events="none"/>
    <!-- nuvem de chuva -->
    <g id="kg-nuvem" class="toque"><g style="animation:flutua 4s ease-in-out infinite alternate"><g id="kg-nuvem-in">
      <path d="M300 104 C278 104 270 82 290 74 C288 52 318 44 332 58 C342 36 380 34 392 56 C404 42 434 46 436 68 C456 66 464 90 448 100 C446 108 438 110 430 108 Z" fill="url(#kgNuvem)" stroke="#8A9AB8" stroke-width="2"/>
      <path id="kg-nuvem-esc" d="M300 104 C278 104 270 82 290 74 C288 52 318 44 332 58 C342 36 380 34 392 56 C404 42 434 46 436 68 C456 66 464 90 448 100 C446 108 438 110 430 108 Z" fill="url(#kgNuvemE)" opacity="0" style="transition:opacity .8s"/>
      <g id="kg-nuvem-pesada" style="opacity:0;transition:opacity .8s"><path d="M296 100 C286 112 300 124 316 120 C322 130 344 132 352 122 C362 132 388 132 396 120 C408 128 430 126 434 114 C448 116 456 104 448 98 C420 104 330 104 296 100Z" fill="url(#kgNuvemB)" stroke="#2E3448" stroke-width="1.6"/><path d="M312 116 C330 122 360 124 380 120 M400 118 C414 120 428 118 436 112" stroke="#8A96B0" stroke-width="1.4" fill="none" opacity=".6"/><path d="M300 90 C340 96 400 96 446 90" stroke="#2E3448" stroke-width="5" fill="none" opacity=".35" filter="url(#kgBlur)"/></g>
      <path d="M296 72 C300 60 314 56 326 62 M340 54 C350 44 372 44 382 54" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M298 100 C340 106 400 106 444 100" stroke="#9AA8C0" stroke-width="1.6" fill="none" opacity=".7"/></g></g>
      <g id="kg-nuvem-dica">${brilhoHotspot(446, 60)}</g><rect x="270" y="34" width="196" height="80" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#kgVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#kgGrao)" pointer-events="none"/>
    <clipPath id="kgTocaClip"><rect x="720" y="270" width="50" height="34"/></clipPath>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-8, 8), y:y + sorte(-4, 4), vy:sorte(.6, 1.4), r:sorte(1.4, 3.4), topo:392, f:sorte(0, 6) }); };
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-8, 8), y, t:i * 2, cor:cor || '#E6F6FF' }); };
  s.querySelectorAll('.kg-enx-f').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-44 }], { duration:700, iterations:Infinity }));
  s.querySelectorAll('.kg-asas').forEach((a, i) => a.animate([{ transform:'scaleX(1)' }, { transform:'scaleX(.3)' }], { duration:240 + i * 50, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  el(s, '#kg-caus').animate([{ transform:'translateX(0)' }, { transform:'translateX(-40px)' }], { duration:6000, iterations:Infinity });
  el(s, '#kg-ondas').animate([{ transform:'translateX(0)' }, { transform:'translateX(14px)' }], { duration:3000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#kg-nasc-fio').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-16 }], { duration:600, iterations:Infinity });
  s.querySelectorAll('.kg-lin-guia').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-28 }], { duration:1400, iterations:Infinity }));
  const setLama = v => { lama = v; el(s, '#kg-lama').style.opacity = F(v * .94); el(s, '#kg-pluma').style.opacity = F(Math.min(1, v * 1.3)); el(s, '#kg-redemo').style.opacity = F(v); el(s, '#kg-fundo-rio').style.opacity = F(1 - v); el(s, '#kg-caus').style.opacity = F(.12 + .4 * (1 - v)); el(s, '#kg-pia-op').style.opacity = F(1 - v * .5); };
  /* ---------- arrasto genérico ---------- */
  let arr = null;
  function arrastavel(g, ok, x0, y0, solta){
    const st = { x:x0, y:y0 };
    const poe = (x, y, k) => g.setAttribute('transform', `translate(${F(x)} ${F(y)})${k ? ` scale(${F(k)})` : ''}`);
    g.addEventListener('pointerdown', e => { if (!ok() || ocupado || arr) return; e.stopPropagation(); const p = c.ponto(e); arr = { g, st, poe, solta, dx:p.x - st.x, dy:p.y - st.y, px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique'); });
    return { st, poe };
  }
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); if (Math.hypot(p.x - arr.px, p.y - arr.py) > 8) arr.moveu = true; arr.st.x = Math.max(10, Math.min(790, p.x - arr.dx)); arr.st.y = Math.max(20, Math.min(496, p.y - arr.dy)); arr.poe(arr.st.x, arr.st.y, 1.25); });
  s.addEventListener('pointerup', () => { if (!arr) return; const a = arr; arr = null; a.g.style.cursor = 'grab'; a.poe(a.st.x, a.st.y); a.solta(a.moveu, a.st.x, a.st.y); });
  function voa(g, st, x1, y1, ms, k1, fim){
    const x0 = st.x, y0 = st.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); st.x = x0 + (x1 - x0) * e; st.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 36;
      g.setAttribute('transform', `translate(${F(st.x)} ${F(st.y)}) scale(${F(1 + (k1 - 1) * e)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  /* ---------- 1. chuva no morro sem árvores ---------- */
  const dicaNuvem = on => { el(s, '#kg-nuvem-dica').style.display = on ? '' : 'none'; };
  function chove(n){
    toca('chuva'); el(s, '#kg-nuvem-esc').style.opacity = .92; el(s, '#kg-nuvem-pesada').style.opacity = 1; el(s, '#kg-cortina').style.opacity = 1;
    for (let i = 0; i < n; i++) depois(i * 34, () => c.add({ tipo:'chuva', x:sorte(240, 690), y:sorte(96, 112), vx:-.6, vy:sorte(9, 12), chao:sorte(232, 384), cor:'#5E9AE8' }));
    depois(n * 34 + 600, () => { el(s, '#kg-nuvem-esc').style.opacity = 0; el(s, '#kg-nuvem-pesada').style.opacity = 0; el(s, '#kg-cortina').style.opacity = 0; });
  }
  el(s, '#kg-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'chuva1' && !ocupado) {
      ocupado = true; chuvas++; chip(`Chuva: ${chuvas}/3`); chove(70);
      depois(700, () => { el(s, '#kg-enx').style.opacity = 1; toca('splash'); });
      depois(1500, () => {
        s.querySelectorAll('.kg-voc-est').forEach((g, j) => { g.style.opacity = j === chuvas - 1 ? 1 : 0; });
        el(s, '#kg-banco').style.transform = `scale(${[.4, .72, 1][chuvas - 1]})`; if (chuvas > 1) el(s, '#kg-lingua').style.opacity = 1; setLama([.35, .62, .85][chuvas - 1]);
        for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:446 + sorte(-30, 30), y:392 + sorte(0, 14), t:i * 2, cor:'#C88A50' });
      });
      depois(3000, () => {
        el(s, '#kg-enx').style.opacity = 0; ocupado = false;
        if (chuvas === 1) api.diz('A terra daqui é arenosa, solta como areia. Sem plantas, a enxurrada leva a areia embora!');
        if (chuvas === 2) api.diz('A enxurrada cava a terra cada vez mais fundo. Toque na nuvem mais uma vez.');
        if (chuvas === 3) { fase = 'pausa'; dicaNuvem(false); api.diz('Virou uma voçoroca, um buraco enorme no morro! E a areia desceu para o rio, que ficou raso e barrento. Isso é o assoreamento.'); depois(6400, comecaMudas); }
      });
      return;
    }
    if (fase === 'chuva2' && !ocupado) { chuvaBoa(); return; }
    toca('pop'); api.diz(fase === 'anos' ? 'Agora é o sol que ajuda as plantas a crescer!' : 'Essa nuvem traz a chuva que enche os rios.');
  });
  /* ---------- 2a. mudas da mata ciliar ---------- */
  const mudasG = [...s.querySelectorAll('.kg-muda')], vagas = [...s.querySelectorAll('.kg-vaga')], livre = MC.map(() => true);
  const MX = i => 184 + i * 15;
  function comecaMudas(){
    fase = 'mudas'; chip('Mudas: 0/4'); el(s, '#kg-vagas').style.display = '';
    mudasG.forEach(g => el(g, '.kg-muda-dica').style.display = '');
    vagas.forEach(v => v.animate([{ transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:1100, iterations:Infinity }));
    api.diz('Os Kaingang sabem cuidar da terra e do rio. A senhora trouxe mudas de árvores nativas. Arraste as mudas até a beira do rio!');
  }
  const proxVaga = (x, y) => { let best = -1, d = 1e9; MC.forEach((m, i) => { if (!livre[i]) return; const dd = x == null ? i : Math.hypot(x - m.x, y - BANK); if (dd < d) { d = dd; best = i; } }); return { i:best, d }; };
  mudasG.forEach((g, i) => {
    const { st } = arrastavel(g, () => fase === 'mudas' && !g.dataset.feito, MX(i), 476, (moveu, x, y) => {
      const v = proxVaga(x, y);
      if (!moveu) plantaMuda(g, st, proxVaga().i);
      else if (v.i >= 0 && v.d < 80) plantaMuda(g, st, v.i);
      else { voa(g, st, MX(i), 476, 500, 1); toca('glub'); api.diz('Solte a muda numa marca da beira do rio.'); }
    });
    g._st = st;
  });
  vagas.forEach(v => v.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'mudas') return; const i = +v.dataset.i; if (!livre[i]) return; const g = mudasG.find(m => !m.dataset.feito); if (g) plantaMuda(g, g._st, i); }));
  function plantaMuda(g, st, vi){
    if (vi < 0) return; g.dataset.feito = 1; livre[vi] = false; el(g, '.kg-muda-dica').style.display = 'none';
    const m = MC[vi];
    voa(g, st, m.x, BANK, 650, 1, () => {
      g.style.display = 'none'; vagas[vi].style.display = 'none';
      s.querySelector(`.kg-arv[data-i="${vi}"]`).style.display = '';
      toca('planta'); c.brilhos(m.x, BANK - 20, 5, '#C8F0A0'); mudas++; chip(`Mudas: ${mudas}/4`);
      if (mudas === 1) api.diz('As árvores da beira do rio formam a mata ciliar. Ela protege o rio como os cílios protegem os olhos!');
      if (mudas === 3) api.diz('As raízes vão segurar a terra da margem.');
      if (mudas === 4) { el(s, '#kg-vagas').style.display = 'none'; toca('ok'); depois(2400, comecaLinhas); }
    });
  }
  /* ---------- 2b. plantar em curva de nível ---------- */
  const linG = [...s.querySelectorAll('.kg-linha')];
  let risco = null;
  function comecaLinhas(){ fase = 'linhas'; chip('Fileiras: 0/3'); el(s, '#kg-linhas').style.display = ''; api.diz('Agora arraste o dedo pelas linhas do morro para plantar em curva, atravessando a descida.'); }
  linG.forEach(g => {
    g.addEventListener('pointerdown', e => { if (fase !== 'linhas' || g.dataset.feito || risco) return; e.stopPropagation(); const p = c.ponto(e); risco = { g, i:+g.dataset.i, x0:p.x, xmin:p.x, xmax:p.x }; s.setPointerCapture(e.pointerId); toca('clique'); });
  });
  s.addEventListener('pointermove', e => { if (!risco) return; const p = c.ponto(e); risco.xmin = Math.min(risco.xmin, p.x); risco.xmax = Math.max(risco.xmax, p.x); const pct = Math.min(100, (risco.xmax - Math.min(risco.xmin, 232)) / 436 * 100); el(risco.g, '.kg-lin-prog').style.strokeDashoffset = F(100 - Math.max(pct, (risco.xmax - risco.xmin) / 436 * 100)); });
  s.addEventListener('pointerup', () => { if (!risco) return; const r = risco; risco = null; plantaLinha(r.g, r.i); });
  linG.forEach(g => g.addEventListener('click', e => { e.stopPropagation(); if (fase === 'linhas' && !g.dataset.feito && !risco) plantaLinha(g, +g.dataset.i); }));
  function plantaLinha(g, i){
    if (g.dataset.feito) return; g.dataset.feito = 1;
    const prog = el(g, '.kg-lin-prog'); prog.style.transition = 'stroke-dashoffset .9s'; prog.style.strokeDashoffset = 0;
    const pls = [...s.querySelectorAll(`.kg-fileira[data-i="${i}"] .kg-pl`)];
    pls.forEach((p, k) => depois(200 + k * 45, () => { p.style.transform = `scale(${F(.7 * p.dataset.k)})`; if (k % 5 === 0) toca('pop'); }));
    depois(400 + pls.length * 45, () => { g.style.display = 'none'; c.brilhos(450, rowY(i, 450), 4, '#C8F0A0'); });
    linhas++; chip(`Fileiras: ${linhas}/3`);
    if (linhas === 1) api.diz('Cada fileira em curva é como um degrauzinho: segura a água e a areia no lugar.');
    if (linhas === 3) depois(1800, comecaFeixes);
  }
  /* ---------- 2c. bambus na voçoroca ---------- */
  const feixeG = [...s.querySelectorAll('.kg-feixe')], vagasB = [...s.querySelectorAll('.kg-vb')], livreB = BAR.map(() => true);
  const FX = i => 272 + i * 26;
  function comecaFeixes(){ fase = 'feixes'; chip('Bambus: 0/2'); el(s, '#kg-vagas-bar').style.display = ''; feixeG.forEach(f => el(f, '.kg-feixe-dica').style.display = ''); api.diz('Leve os feixes de bambu para dentro da voçoroca.'); }
  feixeG.forEach((g, i) => {
    const { st } = arrastavel(g, () => fase === 'feixes' && !g.dataset.feito, FX(i), 494, (moveu, x, y) => {
      let best = -1, d = 1e9; BAR.forEach((b, j) => { if (!livreB[j]) return; const dd = Math.hypot(x - b.x, y - b.y); if (dd < d) { d = dd; best = j; } });
      if (!moveu) poeFeixe(g, st, livreB.indexOf(true));
      else if (best >= 0 && d < 90) poeFeixe(g, st, best);
      else { voa(g, st, FX(i), 494, 500, 1); toca('glub'); api.diz('Solte o bambu dentro da voçoroca, na marca.'); }
    });
    g._st = st;
  });
  vagasB.forEach(v => v.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'feixes') return; const j = +v.dataset.i; if (!livreB[j]) return; const g = feixeG.find(f => !f.dataset.feito); if (g) poeFeixe(g, g._st, j); }));
  function poeFeixe(g, st, j){
    if (j < 0) return; g.dataset.feito = 1; livreB[j] = false; el(g, '.kg-feixe-dica').style.display = 'none';
    voa(g, st, BAR[j].x, BAR[j].y, 650, .8, () => {
      g.style.display = 'none'; vagasB[j].style.display = 'none'; s.querySelector(`.kg-bar[data-i="${j}"]`).style.opacity = 1;
      toca('carimbo'); c.brilhos(BAR[j].x, BAR[j].y - 10, 4, '#F4F6B0'); feixes++; chip(`Bambus: ${feixes}/2`);
      if (feixes === 1) api.diz('O bambu freia a enxurrada, e a areia fica presa ali.');
      if (feixes === 2) { el(s, '#kg-vagas-bar').style.display = 'none'; depois(1800, () => { fase = 'chuva2'; chip('Chuva: 0/1'); dicaNuvem(true); api.diz('Tudo pronto! Toque na nuvem e veja o que a chuva faz agora.'); }); }
    });
  }
  function chuvaBoa(){
    ocupado = true; fase = 'pausa'; dicaNuvem(false); chip('Chuva: 1/1'); chove(80);
    for (let i = 0; i < 26; i++) depois(500 + i * 70, () => { const x = sorte(240, 690), y = sorte(250, 380); c.add({ tipo:'infiltra', x0:x, y0:y - 16, x1:x + sorte(-4, 4), y1:y + 10, dur:sorte(50, 80), f:sorte(0, 6), chega:() => {} }); });
    depois(2200, () => { s.querySelectorAll('.kg-areia-presa').forEach(a => a.style.opacity = 1); setLama(.7); api.diz('Viu? Agora a água da chuva entra na terra devagarinho, em vez de correr morro abaixo.'); });
    depois(5600, () => { el(s, '#kg-nasc-agua').style.opacity = 1; el(s, '#kg-nasc-fio').style.opacity = 1; c.brilhos(NASC.x, NASC.y - 6, 5, '#BFF0FF'); toca('ok'); api.diz('A água que entrou na terra brota limpinha lá embaixo, numa nascente!'); ocupado = false; });
    depois(10800, comecaAnos);
  }
  /* ---------- 3. os anos passam ---------- */
  const solPos = el(s, '#kg-sol-pos');
  let solArr = null;
  function comecaAnos(){ fase = 'anos'; chip('Anos: 0/3'); el(s, '#kg-sol-dica').style.display = ''; api.diz('As plantas precisam de tempo para crescer. Arraste o sol pelo céu para passar um ano.'); }
  const arcoY = x => 62 - Math.sin(Math.max(0, Math.min(1, (716 - x) / 632)) * Math.PI) * 30;
  el(s, '#kg-sol').addEventListener('pointerdown', e => { if (fase !== 'anos' || ocupado) return; e.stopPropagation(); const p = c.ponto(e); solArr = { x0:p.x, dx:0 }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!solArr) return; const p = c.ponto(e); solArr.dx = Math.max(-560, Math.min(0, p.x - solArr.x0)); solPos.setAttribute('transform', `translate(${F(solArr.dx)} ${F(arcoY(716 + solArr.dx) - 62)})`); });
  s.addEventListener('pointerup', () => { if (!solArr) return; const dx = solArr.dx; solArr = null; passaAno(dx); });
  el(s, '#kg-sol').addEventListener('click', e => { e.stopPropagation(); if (fase === 'anos') return; toca('ok'); c.brilhos(716, 62, 6, '#FFE27A'); api.diz('O sol aquece a terra e ajuda as plantas a crescer.'); });
  function passaAno(dx0){
    if (fase !== 'anos' || ocupado) return; ocupado = true; el(s, '#kg-sol-dica').style.display = 'none';
    const t0 = performance.now(), ms = 1800, x0 = dx0 || 0;
    el(s, '#kg-noite').animate([{ opacity:0 }, { opacity:.5, offset:.55 }, { opacity:.6, offset:.7 }, { opacity:0 }], { duration:ms + 900 });
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), x = x0 + (-600 - x0) * k; solPos.setAttribute('transform', `translate(${F(x)} ${F(arcoY(716 + x) - 62 + k * k * 60)})`); solPos.style.opacity = F(1 - Math.max(0, k - .8) * 5); if (k < 1) requestAnimationFrame(q); else nasce(); })(t0);
    function nasce(){ solPos.setAttribute('transform', 'translate(0 60)'); solPos.style.opacity = 1; solPos.animate([{ transform:'translate(0px,60px)' }, { transform:'translate(0px,0px)' }], { duration:900, easing:'ease-out', fill:'forwards' }); depois(950, () => { solPos.getAnimations().forEach(a => a.cancel()); solPos.setAttribute('transform', ''); }); cresceAno(); }
  }
  function cresceAno(){
    anos++; chip(`Anos: ${anos}/3`); toca('planta');
    const k = [0, .5, .74, .92][anos]; s.querySelectorAll('.kg-muda-pl').forEach(m => m.style.opacity = 0);
    s.querySelectorAll('.kg-arv-in').forEach(a => a.style.transform = `scale(${k})`);
    s.querySelectorAll('.kg-pl').forEach(p => p.style.transform = `scale(${F([.7, .85, .95, 1.05][anos] * p.dataset.k)})`);
    if (anos >= 2) s.querySelectorAll('.kg-florzinha').forEach(f => f.style.opacity = 1); if (anos >= 2) s.querySelectorAll('.kg-estaca').forEach(p => p.style.display = 'none');
    el(s, '#kg-voc-verde').style.opacity = F([0, .45, .8, 1][anos]); el(s, '#kg-bar-capim').style.opacity = F([0, .4, .8, 1][anos]); s.querySelectorAll('.kg-areia-presa').forEach(a => a.style.opacity = anos >= 2 ? 0 : 1); s.querySelectorAll('.kg-bar').forEach(b => { b.style.transition = 'opacity 2s'; b.style.opacity = [1, .92, .82, .75][anos]; }); el(s, '#kg-capim').style.opacity = F([0, .35, .7, 1][anos]); el(s, '#kg-nasc-plantas').style.opacity = F(anos / 3);
    setLama([.7, .42, .18, 0][anos]); el(s, '#kg-banco').style.transform = `scale(${[1, .8, .62, .5][anos]})`; if (anos >= 2) { el(s, '#kg-banco-verde').style.opacity = 1; el(s, '#kg-lingua').style.opacity = 0; }
    c.brilhos(450, 330, 8, '#C8F0A0');
    depois(1000, () => {
      ocupado = false;
      if (anos === 1) { api.diz('Um ano! As mudas cresceram e o capim começa a cobrir a voçoroca. Arraste o sol de novo.'); el(s, '#kg-sol-dica').style.display = ''; }
      if (anos === 2) { api.diz('Dois anos! A mata ciliar já faz sombra no rio. Arraste o sol mais uma vez.'); el(s, '#kg-sol-dica').style.display = ''; }
      if (anos === 3) { fase = 'pausa'; toca('vitoria'); api.diz('Três anos! A areia parou de descer, e o rio ficou limpinho de novo.'); depois(4200, comecaAchados); }
    });
  }
  /* ---------- 3b. quem voltou para o rio ---------- */
  let lambariVivo = false, biguaVeio = false;
  function comecaAchados(){ fase = 'achados'; chip('Bichos: 0/3'); el(s, '#kg-achados').style.display = ''; api.diz('Toque nos brilhos do rio para ver quem voltou.'); }
  s.querySelectorAll('.kg-acha').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'achados' || g.dataset.feito || ocupado) return; g.dataset.feito = 1; g.style.display = 'none';
    const a = ACHA[+g.dataset.i]; achados++; chip(`Bichos: ${achados}/3`); toca('splash'); respinga(a.x, a.y, 4); bolhas(a.x, a.y + 10, 5);
    if (a.t === 'lambari') { lambariVivo = true; api.diz('Lambaris! Eles nadam em cardume e só aparecem quando a água está limpa.'); }
    if (a.t === 'piapara') { saltaPiapara(a.x, a.y); api.diz('Uma piapara pulou! É um peixe dos rios daqui, com pintas escuras no corpo.'); }
    if (a.t === 'bigua') { chegaBigua(); api.diz('Um biguá! Ele mergulha para pegar peixinhos. Onde tem peixe, tem passarinho.'); }
    if (achados === 3) depois(4600, chegamCriancas);
  }));
  function saltaPiapara(x, y){
    const g = el(s, '#kg-pia-salto'), p = el(s, '#kg-pia-salto-pos'); g.style.opacity = 1;
    const t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1100), xx = x - 30 + k * 60, yy = y - Math.sin(k * Math.PI) * 60; p.setAttribute('transform', `translate(${F(xx)} ${F(yy)}) rotate(${F(-40 + k * 80)}) scale(-1 1)`); if (k < 1) requestAnimationFrame(q); else { g.style.opacity = 0; toca('splash'); respinga(xx, y, 5); bolhas(xx, y + 8, 4); } })(t0);
  }
  function chegaBigua(){
    biguaVeio = true; const g = el(s, '#kg-bigua'); g.style.opacity = 1; g.style.pointerEvents = '';
    el(s, '#kg-bigua-pos').animate([{ transform:'translate(120px,-160px)' }, { transform:'translate(0,0)' }], { duration:1200, easing:'ease-out' });
  }
  /* ---------- 3c. crianças da aldeia e da cidade ---------- */
  function chegamCriancas(){
    fase = 'criancas'; chip('Juntos: 0/2'); const g = el(s, '#kg-criancas'); g.style.opacity = 1; g.style.pointerEvents = '';
    el(s, '#kg-menina-pos').animate([{ transform:'translateX(-60px)' }, { transform:'translateX(0)' }], { duration:1400, easing:'ease-out' });
    el(s, '#kg-menino-pos').animate([{ transform:'translateX(80px)' }, { transform:'translateX(0)' }], { duration:1400, easing:'ease-out' });
    toca('pop'); api.diz('Olha quem chegou: uma menina da aldeia e um menino da cidade! Toque nas crianças para plantarem juntas.');
  }
  s.querySelectorAll('.kg-crianca').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'criancas' || g.dataset.feito) return; g.dataset.feito = 1; el(g, '.kg-cr-dica').style.display = 'none';
    const i = +g.dataset.i; criancas++; chip(`Juntos: ${criancas}/2`); toca('planta');
    const pos = el(g, i ? '#kg-menino-pos' : '#kg-menina-pos');
    pos.animate([{ transform:'translate(0,0)' }, { transform:`translate(${i ? -26 : 18}px,0)` }], { duration:900, easing:'ease-in-out', fill:'forwards' });
    if (i === 1) depois(900, () => { el(s, '#kg-braco-mn').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 }); for (let k = 0; k < 10; k++) depois(k * 90, () => c.add({ tipo:'chuva', x:448 + sorte(-10, 10), y:360, vx:-1.4, vy:sorte(2, 4), chao:396, cor:'#7CC8FF' })); });
    if (criancas === 1) api.diz(i ? 'O menino trouxe o regador.' : 'A menina trouxe uma muda de ipê.');
    if (criancas === 2) depois(1300, final);
  }));
  function final(){
    fase = 'fim'; chip('Rio vivo!'); el(s, '#kg-ipe-novo').style.transform = 'scale(1)'; toca('vitoria'); c.brilhos(440, 360, 10, '#FFE27A');
    for (let i = 0; i < 18; i++) c.add({ tipo:'petala', x:sorte(400, 480), y:sorte(320, 350), vy:sorte(.4, .9), f:sorte(0, 6), chao:sorte(390, 400), cor:i % 2 ? '#FFD02A' : '#FFF08A', borda:'#B07A08' });
    festaTita();
    depois(1400, () => api.diz('Na Alta Paulista correm rios como o Aguapeí e o do Peixe. Quando a aldeia e a cidade plantam juntas, a terra segura a chuva e o rio fica vivo!'));
    depois(8200, api.fim);
  }
  /* ---------- toques extras ---------- */
  function festaTita(){ el(s, '#kg-tita-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-14px) rotate(-6deg)' }, { transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:900 }); }
  let titaK = 0;
  el(s, '#kg-tita').addEventListener('click', () => {
    festaTita(); [1180, 980, 1180].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'square', .035, f * .8), i * 120));
    const falas = ['Quê-quê-quê! Eu sou uma gralha-picaça. A gente vive em bando e faz muito barulho!', 'Eu como frutinhas e espalho as sementes pela mata.', 'Olha o azul das minhas asas e o meu olho amarelo!'];
    api.diz(falas[titaK++ % falas.length]);
  });
  let artK = 0;
  el(s, '#kg-artesa').addEventListener('click', e => {
    e.stopPropagation(); toca('pop'); el(s, '#kg-braco-ar').animate([{ transform:'rotate(0)' }, { transform:'rotate(-22deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    const falas = ['Eu sou kaingang e moro na aldeia aqui do alto do morro.', 'Eu faço cestos trançados, como aprendi com a minha avó.', 'As mudas são de árvores que já nasciam na beira deste rio.'];
    api.diz(falas[artK++ % falas.length]);
  });
  el(s, '#kg-cesto').addEventListener('click', () => { toca('clique'); api.diz('Esse cesto foi trançado à mão. Os Kaingang ensinam esse saber às crianças.'); });
  el(s, '#kg-escola').addEventListener('click', e => { e.stopPropagation(); [660, 660, 880].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .18, 'triangle', .07), i * 220)); el(s, '#kg-bandeira').animate([{ transform:'skewY(0)' }, { transform:'skewY(6deg)' }, { transform:'skewY(-4deg)' }, { transform:'skewY(0)' }], { duration:900, iterations:2 }); api.diz('Essa é a escola da aldeia. Lá as crianças aprendem o português e a língua kaingang.'); });
  el(s, '#kg-cidade').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Lá longe fica a cidade. A água do rio é de todo mundo: da aldeia e da cidade.'); });
  let vacaOc = false;
  el(s, '#kg-vacas').addEventListener('click', e => { e.stopPropagation(); if (vacaOc) return; vacaOc = true; if (somOn) { tom(140, 0, .7, 'sawtooth', .05, 110); tom(70, 0, .7, 'sine', .06, 60); } el(s, '#kg-vacas-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(-6px)' }, { transform:'translateX(0)' }], { duration:1400, easing:'ease-in-out' }); api.diz('Muuu! O pasto bem cuidado, com capim fechadinho, também ajuda a segurar a terra.'); depois(1500, () => { vacaOc = false; }); });
  let ipeOc = false;
  el(s, '#kg-ipe').addEventListener('click', e => { e.stopPropagation(); if (ipeOc) return; ipeOc = true; toca('planta'); for (let i = 0; i < 18; i++) c.add({ tipo:'petala', x:sorte(678, 730), y:sorte(130, 158), vy:sorte(.5, 1), f:sorte(0, 6), chao:sorte(196, 236), cor:i % 2 ? '#FFD02A' : '#FFF08A', borda:'#B07A08' }); api.diz('O ipê-amarelo floresce no fim do inverno, quando quase não chove.'); depois(2000, () => { ipeOc = false; }); });
  let tatuOc = false;
  el(s, '#kg-tatu').addEventListener('click', e => { e.stopPropagation(); if (tatuOc) return; tatuOc = true; const t = el(s, '#kg-tatu-in'); t.style.transform = 'translateY(0)'; [300, 360].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'sine', .06, f * 1.4), i * 120)); api.diz('Um tatu-galinha! Ele cava a toca com as unhas fortes.'); depois(1800, () => { t.style.transform = 'translateY(12px)'; tatuOc = false; }); });
  let vagOc = false;
  el(s, '#kg-vagens').addEventListener('click', () => {
    if (vagOc) return; vagOc = true; toca('pop');
    const g = el(s, '#kg-vagem-cai'), t0 = performance.now();
    g.style.opacity = 1;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1100); g.setAttribute('transform', `translate(${F(160 + k * 30)} ${F(320 + k * k * 96)}) rotate(${F(k * 200)})`); if (k < 1) requestAnimationFrame(q); else { g.style.opacity = 0; respinga(196, 418, 3); toca('glub'); vagOc = false; } })(t0);
    api.diz(lama > .3 ? 'As vagens do ingá têm uma polpa branquinha e doce.' : 'O ingá caiu no rio. Peixes e outros bichos gostam dos frutos que caem das árvores da beira!');
  });
  el(s, '#kg-nasc').addEventListener('click', e => { e.stopPropagation(); toca('glub'); api.diz(el(s, '#kg-nasc-agua').style.opacity === '1' ? 'A nascente é onde a água guardada debaixo da terra brota de novo. Proteger as nascentes mantém o rio vivo.' : 'Aqui pode nascer água, se a chuva conseguir entrar na terra.'); });
  let borbOc = false;
  el(s, '#kg-borbs').addEventListener('click', e => { e.stopPropagation(); if (borbOc) return; borbOc = true; toca('pop'); s.querySelectorAll('.kg-borb-voo').forEach((b, i) => b.animate([{ transform:'translate(0,0)' }, { transform:`translate(${-40 - i * 20}px,-50px)` }, { transform:`translate(${-90 + i * 30}px,-20px)` }, { transform:`translate(${-30}px,-70px)` }, { transform:'translate(0,0)' }], { duration:4000, easing:'ease-in-out' })); api.diz('Borboletas-amarelas! Elas visitam as flores da beira do rio.'); depois(4100, () => { borbOc = false; }); });
  el(s, '#kg-piapara').addEventListener('click', () => { el(s, '#kg-pia-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-10deg)' }, { transform:'rotate(8deg)' }, { transform:'rotate(0)' }], { duration:600 }); bolhas(462, 464, 4); });
  let bigOc = false;
  el(s, '#kg-bigua').addEventListener('click', e => { e.stopPropagation(); if (!biguaVeio || bigOc) return; bigOc = true; const g = el(s, '#kg-bigua-in'); g.animate([{ transform:'translate(0,0)' }, { transform:'translate(-10px,30px) rotate(-60deg)', offset:.4 }, { transform:'translate(-10px,30px) rotate(-60deg)', offset:.6 }, { transform:'translate(0,0)' }], { duration:1800 }); depois(700, () => { toca('splash'); respinga(734, 410, 4); bolhas(734, 420, 4); }); api.diz('Tchibum! O biguá nada debaixo da água atrás dos peixinhos.'); depois(1900, () => { bigOc = false; }); });
  el(s, '#kg-agua-toque').addEventListener('pointerdown', e => { const p = c.ponto(e); toca('glub'); respinga(p.x, p.y, 3, lama > .3 ? '#E8C08A' : '#E6F6FF'); bolhas(p.x, p.y + 6, 3); });
  /* lambaris e areia no rio (canvas) */
  const cardume = Array.from({ length:11 }, (_, k) => ({ ox:Math.cos(k * 2.4) * (8 + k % 3 * 8), oy:Math.sin(k * 2.4) * (4 + k % 3 * 3), f:sorte(0, 6) }));
  const areia = Array.from({ length:60 }, () => ({ x:sorte(0, 800), y:sorte(396, 496), r:sorte(.8, 2), f:sorte(0, 6), v:sorte(.2, .6) }));
  let alfaL = 0;
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (lama > .05) { ctx.fillStyle = '#7A4A22'; areia.forEach(p => { p.x += p.v; if (p.x > 800) p.x = 0; ctx.globalAlpha = lama * .45; ctx.beginPath(); ctx.arc(p.x, p.y + Math.sin(t + p.f) * 2, p.r, 0, 7); ctx.fill(); }); }
    alfaL += ((lambariVivo ? 1 : 0) - alfaL) * .03;
    if (alfaL > .02) {
      const ax = 560 + Math.sin(t * .3) * 140, ay = 440 + Math.sin(t * .7) * 12, dir = Math.cos(t * .3) > 0 ? 1 : -1;
      cardume.forEach(p => { const x = ax + p.ox * dir, y = ay + p.oy + Math.sin(t * 2 + p.f) * 2;
        ctx.save(); ctx.globalAlpha = alfaL; ctx.translate(x, y); ctx.scale(dir, 1);
        ctx.fillStyle = '#F2C23A'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-11, -3.4 + Math.sin(t * 14 + p.f)); ctx.lineTo(-11, 3.4 + Math.sin(t * 14 + p.f)); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#E6EEF0'; ctx.strokeStyle = '#4A5A6A'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, 0, 7.4, 3, 0, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2A2A30'; ctx.beginPath(); ctx.arc(-5.4, 0, 1.1, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(2.4, -.6, .9, 0, 7); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.globalAlpha = alfaL * .7; ctx.beginPath(); ctx.moveTo(-3, -1); ctx.lineTo(4, -1.2); ctx.stroke(); ctx.restore(); });
    }
    ctx.globalAlpha = 1;
  });
  dicaNuvem(true); chip('Chuva: 0/3');
  api.diz('Oi! Eu sou a Tita, uma gralha-picaça da Alta Paulista, no interior de São Paulo. Aqui moram os Kaingang, nas Terras Indígenas Vanuíre e Icatu.');
  api.diz('Este morro perdeu a mata. Toque na nuvem para fazer chover.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
