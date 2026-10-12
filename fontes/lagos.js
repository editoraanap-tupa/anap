/* ================= JOGO 11: Grandes Lagos, lagos gigantes ================= */
function jogoLagos(palco, api){
  semente = 83;
  let vivo = true, fase = 'represa', galhos = 0, neves = 0, peixes = 0, sois = 0, ocupado = false, nivel = 362;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const LAGO = 360, HZ = 292, DAM = { x:312, y:318 };
  const NIVEIS = [362, 346, 330, 313, 295, 278];
  const chao = x => x < 150 ? 318 : Math.min(362, 318 + (x - 150) * 44 / 150);
  const GALHOS = [{ x:96, y:246, r:-8 }, { x:200, y:328, r:10 }, { x:262, y:346, r:-4 }, { x:372, y:356, r:12 }, { x:476, y:318, r:-6 }];
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k), k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  /* ---------- desenhos ---------- */
  const P = v => (+v).toFixed(1), PI = Math.PI;
  /* galhos recursivos (árvores, raízes) */
  const segsDe = (x, y, len, a, w, n, alvo, puxa) => {
    const out = [];
    const go = (x0, y0, len, a, w, n) => {
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len, k = R(-.16, .16) * len;
      const mx = (x0 + x1) / 2 - Math.sin(a) * k, my = (y0 + y1) / 2 + Math.cos(a) * k;
      out.push({ d:`M${P(x0)} ${P(y0)} Q${P(mx)} ${P(my)} ${P(x1)} ${P(y1)}`, w, a, x0, y0, mx, my, x1, y1 });
      if (n <= 0) return;
      const nf = n >= 3 ? 2 : (R(0, 1) < .5 ? 3 : 2);
      for (let i = 0; i < nf; i++) {
        let na = a + (nf === 2 ? (i ? 1 : -1) * R(.26, .52) : (i - 1) * R(.36, .56));
        na += (alvo - na) * puxa;
        go(x1, y1, len * R(.62, .78), na, Math.max(.6, w * .64), n - 1);
      }
    };
    go(x, y, len, a, w, n); return out;
  };
  const pinta = (segs, cor, tinta, borda) => {
    const b = {}; segs.forEach(sg => { const k = (Math.round(sg.w * 2) / 2).toFixed(1); (b[k] = b[k] || []).push(sg.d); });
    let o = '', f = '';
    Object.keys(b).sort((p, q) => q - p).forEach(k => { const d = b[k].join(' '); if (borda) o += `<path d="${d}" stroke="${tinta}" stroke-width="${(+k + Math.min(borda, +k * .8 + .4)).toFixed(1)}"/>`; f += `<path d="${d}" stroke="${cor}" stroke-width="${k}"/>`; });
    return { o:`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${o}</g>`, f:`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${f}</g>` };
  };
  const neveDe = segs => {
    const b = {}; segs.forEach(sg => { if (sg.w < .9 || Math.abs(Math.cos(sg.a)) < .3) return; const wn = Math.min(3.6, Math.max(1.5, sg.w * .62)), k = (Math.round(wn * 2) / 2).toFixed(1), o = sg.w * .42 + .5; (b[k] = b[k] || []).push(`M${P(sg.x0 + (sg.x1 - sg.x0) * .12)} ${P(sg.y0 + (sg.y1 - sg.y0) * .12 - o)} Q${P(sg.mx)} ${P(sg.my - o)} ${P(sg.x1 - (sg.x1 - sg.x0) * .12)} ${P(sg.y1 - (sg.y1 - sg.y0) * .12 - o)}`); });
    let sh = '', wh = ''; Object.keys(b).forEach(k => { const d = b[k].join(' '); sh += `<path d="${d}" stroke="#A9C2E0" stroke-width="${(+k + 1.3).toFixed(1)}" transform="translate(0 .9)"/>`; wh += `<path d="${d}" stroke="#FFFFFF" stroke-width="${k}"/>`; });
    return `<g fill="none" stroke-linecap="round">${sh}${wh}</g>`;
  };
  const arvore = (x, y, h, o) => {
    const top = y - h * o.ht, wt = o.wb * .5;
    let segs = [];
    o.limbs.forEach(([a, f]) => { segs = segs.concat(segsDe(x + Math.cos(a) * wt * .4, top + 4, h * f, a, wt * 1.7, o.nv, -PI / 2, o.puxa ?? .12)); });
    const p = pinta(segs, o.pal[1], o.pal[0], 2.2);
    const corpo = `<path d="M${P(x - o.wb)} ${y + 2} C${P(x - o.wb * .45)} ${y - 3} ${P(x - wt)} ${P(y - h * o.ht * .45)} ${P(x - wt)} ${P(top)} L${P(x + wt)} ${P(top)} C${P(x + wt)} ${P(y - h * o.ht * .45)} ${P(x + o.wb * .45)} ${y - 3} ${P(x + o.wb)} ${y + 2}Z" fill="url(#${o.grad})" stroke="${o.pal[0]}" stroke-width="1.8" stroke-linejoin="round"/>`;
    let luz = ''; segs.forEach(sg => { if (sg.w < 2.4) return; luz += `M${P(sg.x0 - sg.w * .22)} ${P(sg.y0)} Q${P(sg.mx - sg.w * .22)} ${P(sg.my)} ${P(sg.x1 - sg.w * .2)} ${P(sg.y1)} `; });
    const brilho = luz ? `<path d="${luz}" stroke="${o.pal[2]}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/>` : '';
    return { arv:p.o + corpo + p.f + brilho, segs, top };
  };
  /* copa em camadas: [tinta, sombra, base, luz, brilho] */
  const copaRica = (x, y, rx, ry, p, gid) => {
    let o = `<path d="${copa(x, y + ry * .05, rx, ry * .95, 14, .26)}" fill="${p[1]}" stroke="${p[0]}" stroke-width="2.2" stroke-linejoin="round"/>`;
    [[0, .4, .4], [-.5, .26, .44], [.48, .28, .44], [-.56, -.1, .4], [.54, -.08, .4], [0, -.04, .5], [-.24, -.42, .44], [.26, -.4, .42]].forEach(([dx, dy, k]) => { o += `<path d="${copa(x + dx * rx, y + dy * ry, rx * k, ry * k, 8, .32)}" fill="url(#${gid})" stroke="${p[1]}" stroke-width="1" stroke-opacity=".75"/>`; });
    [[-.32, -.56, .2], [-.62, -.24, .13], [.06, -.7, .14], [.36, -.52, .11], [-.1, -.18, .12]].forEach(([dx, dy, k]) => { o += `<path d="${copa(x + dx * rx, y + dy * ry, rx * k, ry * k * .8, 6, .3)}" fill="${p[4]}" opacity=".5"/>`; });
    let d1 = '', d2 = '';
    for (let i = 0; i < 18; i++) { const t = R(0, 6.28), r = Math.sqrt(R(.05, 1)), px = x + Math.cos(t) * rx * .84 * r, py = y + Math.sin(t) * ry * .84 * r, s = R(1.3, 2.4); const d = `M${P(px)} ${P(py - s)} l${P(s * .8)} ${P(s)} l${P(-s * .8)} ${P(s)} l${P(-s * .8)} ${P(-s)}Z`; if (py < y - ry * .1) d1 += d; else d2 += d; }
    o += `<path d="${d1}" fill="${p[4]}" opacity=".85"/><path d="${d2}" fill="${p[1]}" opacity=".8"/>`;
    o += `<path d="M${P(x - rx * .78)} ${P(y - ry * .3)} Q${P(x - rx * .55)} ${P(y - ry * .95)} ${P(x + rx * .05)} ${P(y - ry * .98)}" stroke="${p[4]}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>`;
    return o;
  };
  const copaBetula = (x, y, p, gid) => {
    const C = [[-14, 8, 12], [14, 6, 12], [-8, -12, 12], [10, -14, 11], [0, -28, 10], [0, 0, 13], [-20, -6, 8], [20, -4, 8]];
    let o = C.map(([dx, dy, r]) => `<path d="${copa(x + dx, y + dy + 2, r + 2, r * .9 + 2, 7, .3)}" fill="${p[1]}" stroke="${p[0]}" stroke-width="1.8"/>`).join('');
    o += C.map(([dx, dy, r]) => `<path d="${copa(x + dx, y + dy, r, r * .88, 7, .3)}" fill="url(#${gid})"/>`).join('');
    let d = ''; for (let i = 0; i < 16; i++) { const px = x + R(-24, 24), py = y + R(-34, 16), s = R(1.1, 2); d += `M${P(px)} ${P(py - s)} l${P(s * .8)} ${P(s)} l${P(-s * .8)} ${P(s)} l${P(-s * .8)} ${P(-s)}Z`; }
    o += `<path d="${d}" fill="${p[4]}" opacity=".85"/>`;
    o += `<g stroke="${p[2]}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8">${[[-22, 10], [24, 8], [-4, 14]].map(([dx, dy]) => `<path d="M${x + dx} ${y + dy} q-1 8 1 14"/>`).join('')}</g><g fill="${p[3]}">${[[-22, 10], [24, 8], [-4, 14]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy + 9}" r="1.6"/><circle cx="${x + dx + 1}" cy="${y + dy + 14}" r="1.4"/>`).join('')}</g>`;
    return o;
  };
  const pinheiro = (x, y, h, pal, gid) => {
    let arv = `<ellipse cx="${x}" cy="${y + 1}" rx="${P(h * .26)}" ry="3" fill="#1E140A" opacity=".25"/><path d="M${x - 3.6} ${y + 2} L${x - 2} ${P(y - h * .3)} H${x + 2} L${x + 3.6} ${y + 2}Z" fill="#6A4428" stroke="#2E1C10" stroke-width="1.4"/>`, n = '';
    const T = 5;
    for (let k = 0; k < T; k++) {
      const w = h * (.4 - k * .066), yy = y - h * .12 - k * h * .155, top = yy - h * (.3 - k * .02), tips = k > 2 ? 4 : 5;
      let d = `M${x} ${P(top)} C${P(x - w * .22)} ${P(top + (yy - top) * .45)} ${P(x - w * .66)} ${P(yy - 5)} ${P(x - w)} ${P(yy + 2)}`, tipsN = '';
      for (let j = 1; j <= tips; j++) { const tx = x - w + j * 2 * w / tips, nx = tx - w / tips, ty = yy + (j === tips ? 2 : R(-.5, 2.5)); d += ` Q${P(nx)} ${P(yy - R(3, 5.5))} ${P(tx)} ${P(ty)}`; tipsN += `<ellipse cx="${P(tx - w / tips * .5)}" cy="${P(yy - 2.6)}" rx="${P(w / tips * .42)}" ry="1.8"/>`; }
      d += ` C${P(x + w * .66)} ${P(yy - 5)} ${P(x + w * .22)} ${P(top + (yy - top) * .45)} ${x} ${P(top)}Z`;
      if (k) arv += `<path d="${d}" fill="${pal[0]}" opacity=".35" transform="translate(0 4)"/>`;
      arv += `<path d="${d}" fill="url(#${gid})" stroke="${pal[0]}" stroke-width="1.5" stroke-linejoin="round"/>`;
      arv += `<path d="M${P(x - 1)} ${P(top + 3)} C${P(x - w * .24)} ${P(top + (yy - top) * .48)} ${P(x - w * .6)} ${P(yy - 6)} ${P(x - w * .9)} ${P(yy - 1)}" stroke="${pal[3]}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75"/>`;
      let ag = ''; for (let j = 0; j < 5; j++) { const ax = x - w * R(.15, .8), ay = yy - R(3, (yy - top) * .5); ag += `M${P(ax)} ${P(ay)} l-3 3 M${P(ax + 2)} ${P(ay)} l2 3 `; }
      arv += `<path d="${ag}" stroke="${pal[3]}" stroke-width="1" opacity=".55" fill="none" stroke-linecap="round"/>`;
      const sx = w * .6, ys = top + (yy - top) * .62;
      n += `<path d="M${x} ${P(top - 1.5)} C${P(x - w * .2)} ${P(top + (yy - top) * .3)} ${P(x - w * .42)} ${P(ys - 5)} ${P(x - sx)} ${P(ys)} Q${P(x - sx * .7)} ${P(ys + 4)} ${P(x - sx * .45)} ${P(ys + 1)} Q${P(x - sx * .25)} ${P(ys + 5)} ${x} ${P(ys + 1)} Q${P(x + sx * .3)} ${P(ys + 4.5)} ${P(x + sx * .5)} ${P(ys + .5)} Q${P(x + sx * .75)} ${P(ys + 3.5)} ${P(x + sx)} ${P(ys)} C${P(x + w * .42)} ${P(ys - 5)} ${P(x + w * .2)} ${P(top + (yy - top) * .3)} ${x} ${P(top - 1.5)}Z" fill="url(#lgNeve)" stroke="#AFC8E6" stroke-width="1"/><g fill="#fff" stroke="#B8D0EA" stroke-width=".6">${tipsN}</g>`;
    }
    return { arv, neve:n };
  };
  const tufo = (x, y, s, c1, c2) => `<path d="M${P(x - 3 * s)} ${y} q${P(-2 * s)} ${P(-5 * s)} ${P(-4 * s)} ${P(-8 * s)} M${P(x - 1 * s)} ${y} q${P(-1 * s)} ${P(-7 * s)} ${P(1 * s)} ${P(-11 * s)} M${P(x + 1 * s)} ${y} q${P(2 * s)} ${P(-6 * s)} ${P(5 * s)} ${P(-9 * s)}" stroke="${c1}" stroke-width="${P(1.8 * s)}" fill="none" stroke-linecap="round"/><path d="M${P(x)} ${y} q${P(.5 * s)} ${P(-5 * s)} ${P(-1.5 * s)} ${P(-9 * s)} M${P(x + 2.4 * s)} ${y} q${P(1 * s)} ${P(-4 * s)} ${P(3.5 * s)} ${P(-6 * s)}" stroke="${c2}" stroke-width="${P(1.3 * s)}" fill="none" stroke-linecap="round"/>`;
  const graveto = (x1, y1, x2, y2, w, cor, tinta, ponta) => {
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / PI, L = `M${P(x1)} ${P(y1)} L${P(x2)} ${P(y2)}`;
    return `<path d="${L}" stroke="${tinta}" stroke-width="${P(w + 2.4)}" stroke-linecap="round"/><path d="${L}" stroke="${cor}" stroke-width="${P(w)}" stroke-linecap="round"/><path d="M${P(x1 + (x2 - x1) * .12)} ${P(y1 + (y2 - y1) * .12 - w * .24)} L${P(x2 - (x2 - x1) * .18)} ${P(y2 - (y2 - y1) * .18 - w * .24)}" stroke="#F0D2A0" stroke-width="${P(Math.max(.7, w * .22))}" stroke-linecap="round" opacity=".6"/>` + (ponta && w > 2.6 ? `<g transform="translate(${P(x2)} ${P(y2)}) rotate(${P(ang)})"><ellipse rx="${P(w * .3)}" ry="${P(w * .52)}" fill="#E8C896" stroke="${tinta}" stroke-width=".9"/><ellipse rx="${P(w * .14)}" ry="${P(w * .26)}" fill="none" stroke="#B8905A" stroke-width=".6"/></g>` : '');
  };
  const FOLHA = 'M0 0 L-1.5 -6 L-9 -4 L-8 -8 L-15 -12 L-11 -13 L-13 -19 L-7 -17 L-6 -21 L-2 -17 L0 -27 L2 -17 L6 -21 L7 -17 L13 -19 L11 -13 L15 -12 L8 -8 L9 -4 L1.5 -6Z';
  const FOLHA_E = 'M0 -27 L-2 -17 L-6 -21 L-7 -17 L-13 -19 L-11 -13 L-15 -12 L-8 -8 L-9 -4 L-1.5 -6 L0 0Z';
  const folha = (x, y, a, s, c, e) => `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(a)}) scale(${s})"><path d="${FOLHA}" fill="${c}" stroke="${e}" stroke-width="${P(1.3 / s)}" stroke-linejoin="round"/><path d="${FOLHA_E}" fill="#fff" opacity=".2"/><path d="M0 -1 V-21 M0 -8 L-10 -14 M0 -8 L10 -14 M0 -4 L-7 -5 M0 -4 L7 -5" stroke="${e}" stroke-width="${P(.9 / s)}" fill="none" opacity=".55"/></g>`;
  const pato = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="2" cy="1.5" rx="20" ry="3.4" fill="#1E4E8A" opacity=".28"/><path d="M-12 3 C-4 7 8 7 14 3" stroke="#5A4A3A" stroke-width="3" fill="none" opacity=".18" stroke-linecap="round"/><path d="M14 -9 c4 -4 7 -2 4 1.6" stroke="#22222A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-14 -4 C-14 -14 4 -16 14 -10 C18 -6 18 -2 14 0 H-10 C-14 0 -15 -2 -14 -4Z" fill="url(#lgPatoC)" stroke="#4A3A2A" stroke-width="1.4"/><path d="M-14 -4 C-15 -9 -12 -12 -8 -12 C-6 -8 -7 -3 -10 0 C-13 0 -14 -2 -14 -4Z" fill="#8E4A28" opacity=".9"/><path d="M-4 -9 C2 -14 12 -13 16 -8 C10 -5 2 -5 -4 -9Z" fill="#B8A898" stroke="#4A3A2A" stroke-width="1"/><path d="M3 -8.6 L11 -9.2 L12.4 -7.2 L4 -6.8Z" fill="#3E66C8" stroke="#fff" stroke-width=".7"/><path d="M14 -10 C18 -6 22 -8 22 -12 C18 -12 16 -12 14 -10Z" fill="#2A2A30"/><path d="M-12 -6 C-14 -14 -14 -20 -10 -24" stroke="#3A2A1A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-12 -6 C-14 -14 -14 -20 -10 -24" stroke="#1E7A4A" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M-14.8 -10 h5.4" stroke="#fff" stroke-width="1.8"/><circle cx="-11" cy="-24" r="5" fill="url(#lgPatoV)" stroke="#0E3A22" stroke-width="1.2"/><path d="M-14 -26 q2 -2.6 5 -2" stroke="#9AF0C0" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="-12.6" cy="-25" r="1.3" fill="#12121A"/><circle cx="-13" cy="-25.4" r=".5" fill="#fff"/><path d="M-15 -23 L-22 -22 L-15 -20Z" fill="#F2C43A" stroke="#8A6A08" stroke-width=".9" stroke-linejoin="round"/></g>`;
  const perca = `<path d="M-30 0 L-42 -9 L-39 0 L-42 9Z" fill="#E8A040" stroke="#6A4A10" stroke-width="1.4" stroke-linejoin="round" opacity=".92"/><path d="M-12 -9 L-8 -18 L-4 -10 L0 -18 L4 -10 L8 -17 L10 -9Z" fill="#B8A040" stroke="#5A4A10" stroke-width="1.2" stroke-linejoin="round" opacity=".9"/><path d="M-30 0 C-24 -12 -2 -14 16 -10 C26 -8 32 -4 34 0 C32 6 24 10 14 11 C-4 13 -24 10 -30 0Z" fill="url(#lgPercaG)" stroke="#4E5214" stroke-width="1.8"/><g stroke="#3E4A14" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M-20 -6 v10 M-11 -9 v14 M-2 -10 v16 M7 -10 v15 M15 -8 v12"/></g><path d="M-2 10 L2 18 L6 10Z M12 9 L14 15 L18 9Z" fill="#F06A2A" stroke="#8A2A0E" stroke-width="1"/><path d="M10 -2 C14 2 14 6 10 8" stroke="#E07A2A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M20 -8 C17 -3 17 3 20 8" stroke="#4E5214" stroke-width="1.2" fill="none" opacity=".6"/><circle cx="24" cy="-3" r="3.6" fill="#FFF6C8" stroke="#4E5214" stroke-width="1"/><circle cx="24.8" cy="-2.8" r="2" fill="#12121A"/><circle cx="25.6" cy="-3.8" r=".7" fill="#fff"/><path d="M30 3 q3 1 4 -1" stroke="#4E5214" stroke-width="1.2" fill="none"/><path d="M-18 -7 C-6 -12 6 -12 16 -9" stroke="#F8F4C0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>`;
  const esturjao = `<path d="M-56 0 C-62 -10 -70 -18 -76 -20 C-72 -12 -70 -4 -72 4 C-68 2 -62 2 -56 4Z" fill="#6E7078" stroke="#33353C" stroke-width="1.6" stroke-linejoin="round"/><path d="M-58 2 C-44 -10 0 -14 30 -10 C44 -8 56 -6 64 -2 C60 4 48 8 30 9 C0 12 -40 10 -58 2Z" fill="url(#lgEstG)" stroke="#33353C" stroke-width="2"/><path d="M-50 4 C-20 10 20 10 50 4" fill="none" stroke="#E2E4EA" stroke-width="3" stroke-linecap="round" opacity=".7"/><g fill="#D0D2D8" stroke="#4A4C54" stroke-width=".9">${[-44, -32, -20, -8, 4, 16, 28].map(x => `<path d="M${x} -9 l4 -4 l4 4Z"/>`).join('')}${[-40, -26, -12, 2, 16, 30].map(x => `<path d="M${x} -1 l3 -3 l3 3 l-3 3Z"/>`).join('')}</g><path d="M-6 -11 L2 -20 L10 -12Z" fill="#6E7078" stroke="#33353C" stroke-width="1.2"/><path d="M-10 9 L-4 16 L2 9Z M20 8 L26 14 L30 7Z" fill="#7A7C84" stroke="#33353C" stroke-width="1.2"/><path d="M48 4 l-2 7 M52 3 l0 7 M56 2 l2 6" stroke="#5A5C64" stroke-width="1.2" stroke-linecap="round"/><circle cx="46" cy="-4" r="3" fill="#FFF6E0" stroke="#33353C" stroke-width="1"/><circle cx="46.6" cy="-3.8" r="1.7" fill="#12121A"/><circle cx="47.2" cy="-4.6" r=".6" fill="#fff"/><path d="M-40 -6 C-20 -12 10 -13 34 -10" stroke="#D2D6E0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const galhoDes = i => {
    const [cor, tinta] = [['#B07A44', '#4A2810'], ['#9A6234', '#3E220C'], ['#C08A50', '#4E3014'], ['#A86E3C', '#44260E'], ['#B88450', '#4A2E12']][i];
    const fol = [['#E8502E', '#7A2010'], ['#F29A2E', '#8A4A0E'], ['#F2C83A', '#8A6A0E'], ['#D23A2A', '#6A1410'], ['#E87A2A', '#7A3A10']][i];
    return `<path d="M-27 -2.6 C-10 -4.6 8 -5 24 -3.2 L24.6 .2 C8 .6 -10 3.4 -27 5Z" fill="${cor}" stroke="${tinta}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-22 -1.6 C-8 -3 6 -3.4 20 -2.4" stroke="#F0D2A0" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/><path d="M-16 2.2 l5 -.4 M-2 1 l6 -.4 M10 .2 l5 -.2" stroke="${tinta}" stroke-width=".9" opacity=".6"/><ellipse cx="-27" cy="1.2" rx="2.2" ry="3.9" fill="#E8C896" stroke="${tinta}" stroke-width="1.1"/><path d="M-27 -.6 v3.4" stroke="#B8905A" stroke-width=".7"/><path d="M-6 -3.4 Q-10 -9 -15 -13 M8 -3.8 Q12 -9 17 -13 M18 -3 Q22 -6 27 -8" stroke="${tinta}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-6 -3.4 Q-10 -9 -15 -13 M8 -3.8 Q12 -9 17 -13 M18 -3 Q22 -6 27 -8" stroke="${cor}" stroke-width="1.8" fill="none" stroke-linecap="round"/>${folha(-15, -12, -30, .5, fol[0], fol[1])}${folha(17, -12, 25, .46, fol[0], fol[1])}${folha(27, -8, 70, .38, ['#F2C83A', '#E8502E', '#D23A2A', '#F29A2E', '#F2B83A'][i], fol[1])}`;
  };
  /* represa do castor: monte bagunçado de galhos, lama e folhas */
  const CORG = [['#B07A44', '#4A2810'], ['#8E5A30', '#3A200C'], ['#C49058', '#50321A'], ['#6E4A2E', '#2E1C0E'], ['#A8784A', '#46280E'], ['#7A5A3A', '#33200E']];
  const camada = (k) => {
    const x = 316 - k * 3, y = 354 - k * 17.6, w = 44 - k * 5;
    const vara = (atras) => { const cx = x + R(-w, w) * .86, cy = y + R(-3, 9), a = R(-42, 42) * PI / 180 + (R(0, 1) < .18 ? PI / 2 * (R(0, 1) < .5 ? .7 : -.7) : 0), L = R(.45, .85) * w + 10, wd = R(2.2, atras ? 5 : 7), c = CORG[Math.floor(R(0, 6))]; const dx = Math.cos(a) * L / 2, dy = Math.sin(a) * L / 2; return graveto(cx - dx, cy - dy, cx + dx, cy + dy, wd, c[0], c[1], R(0, 1) < .6); };
    let o = '';
    for (let i = 0; i < 3; i++) o += vara(true);
    o += `<path d="M${P(x - w - 5)} ${P(y + 13)} Q${P(x - w - 6)} ${P(y + 2)} ${P(x - w + 1)} ${P(y - 7)} Q${P(x)} ${P(y - 13)} ${P(x + w - 1)} ${P(y - 7)} Q${P(x + w + 7)} ${P(y + 2)} ${P(x + w + 4)} ${P(y + 13)} Q${P(x)} ${P(y + 18)} ${P(x - w - 5)} ${P(y + 13)}Z" fill="url(#lgLama)"/>`;
    o += `<g fill="#3A2414" opacity=".35">${Array.from({ length:5 }, () => `<ellipse cx="${P(x + R(-w, w) * .8)}" cy="${P(y + R(-6, 6))}" rx="${P(R(3, 7))}" ry="${P(R(1.6, 3))}"/>`).join('')}</g>`;
    const nv = 12 - Math.floor(k / 2);
    for (let i = 0; i < nv; i++) o += vara(false);
    o += `<g fill="#5A3A20" stroke="#2E1C0E" stroke-width=".8">${Array.from({ length:4 }, () => { const mx = x + R(-w, w) * .7, my = y + R(-8, 4); return `<path d="M${P(mx - 5)} ${P(my + 2)} q2 -5 5 -4 q4 -1 5 4 q-5 2 -10 0Z"/>`; }).join('')}</g>`;
    o += `<g fill="#C8A070" opacity=".6">${Array.from({ length:3 }, () => `<ellipse cx="${P(x + R(-w, w) * .7)}" cy="${P(y + R(-8, 2))}" rx="1.8" ry=".8"/>`).join('')}</g>`;
    o += Array.from({ length:2 }, (_, j) => { const c = [['#E8502E', '#7A2010'], ['#F2C83A', '#8A6A0E'], ['#F29A2E', '#8A4A0E'], ['#D23A2A', '#6A1410']][(k + j) % 4]; return folha(x + R(-w, w) * .8, y + R(-8, 2), R(-80, 80), .32, c[0], c[1]); }).join('');
    if (k < 3) o += `<g class="lg-filete" style="transition:opacity 1.4s"><path d="M${P(x + w * .5)} ${P(y - 3)} C${P(x + w * .62)} ${P(y)} ${P(x + w * .7)} ${P(y + 3)} ${P(x + w * .76)} ${P(y + 9)}" stroke="#7EC4EC" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"/><path d="M${P(x + w * .5)} ${P(y - 3)} C${P(x + w * .62)} ${P(y)} ${P(x + w * .7)} ${P(y + 3)} ${P(x + w * .76)} ${P(y + 9)}" stroke="#F2FAFF" stroke-width=".7" fill="none" stroke-linecap="round"/><ellipse cx="${P(x + w * .77)}" cy="${P(y + 11)}" rx="1" ry="1.5" fill="#CFEFFF" stroke="#4A9AD8" stroke-width=".4"/></g>`;
    return `<g class="lg-dique" data-k="${k}" style="display:none"><g class="cresce">${o}</g></g>`;
  };
  /* ---------- árvores perto (atrás da lagoa) ---------- */
  const ARV = [
    { t:'b', x:30, y:250, rx:44, ry:38, h:96, o:['#5A0E08', '#8E1A10', '#CC3420', '#F2643C', '#FFB48C'], v:['#1E4A1E', '#2E6A2A', '#4E9A3A', '#7CC456', '#C8F09A'] },
    { t:'bt', x:78, y:252, h:84, o:['#6A4A08', '#A0700E', '#E2AE26', '#F6D454', '#FFF2B0'], v:['#3A5A14', '#5A8A22', '#86B83A', '#B4DA5A', '#EAFAB0'] },
    { t:'p', x:122, y:252, h:96, pal:0 },
    { t:'b', x:194, y:246, rx:40, ry:34, h:90, o:['#5E2A06', '#9A4208', '#E2741C', '#F7A040', '#FFD9A0'], v:['#1A4A38', '#2A6A52', '#44946E', '#72BE8E', '#C4EED0'] },
    { t:'b', x:262, y:248, rx:32, ry:28, h:74, o:['#6A4A08', '#A86A0C', '#EBA82A', '#F8CC50', '#FFF0B4'], v:['#245024', '#3A7A3A', '#62B04A', '#94D86A', '#DDF8B0'] },
    { t:'p', x:300, y:250, h:84, pal:1 },
    { t:'b', x:350, y:252, rx:28, ry:24, h:62, o:['#3E0A14', '#6E1426', '#B02A3A', '#D8505A', '#FFA0A4'], v:['#2E5A1A', '#46802A', '#6EAE3E', '#9AD460', '#D8F6A8'] }
  ];
  const PINPAL = [['#0E2E26', '#1A4A3C', '#2E6A56', '#5EA486'], ['#122C38', '#1E4A56', '#2E6A72', '#62A2A4']];
  const gradRad = (id, p) => `<radialGradient id="${id}" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="${p[3]}"/><stop offset=".5" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[1]}"/></radialGradient>`;
  let gradArv = PINPAL.map((p, i) => `<linearGradient id="lgPin${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p[3]}"/><stop offset=".42" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>`).join('');
  let troncos = '', outono = '', prima = '', neveArv = '', pinhos = '', sombrasArv = '';
  ARV.forEach((a, i) => {
    if (a.t === 'p') { const p = pinheiro(a.x, a.y, a.h, PINPAL[a.pal], `lgPin${a.pal}`); pinhos += p.arv; neveArv += p.neve; return; }
    gradArv += gradRad(`lgCo${i}`, a.o) + gradRad(`lgCv${i}`, a.v);
    sombrasArv += `<ellipse cx="${a.x + 4}" cy="${a.y + 1}" rx="${a.t === 'bt' ? 14 : a.rx * .55}" ry="3.4" fill="#2A1A0A" opacity=".22"/>`;
    if (a.t === 'bt') {
      const t = arvore(a.x, a.y, a.h, { wb:4.4, ht:.66, nv:3, puxa:.06, grad:'lgBet', pal:['#2E2A2A', '#5E5450', '#9A908A'], limbs:[[-PI / 2 - .55, .2], [-PI / 2 + .5, .2], [-PI / 2 - .04, .22]] });
      const tt = t.top;
      troncos += t.arv + `<g stroke="#2A2628" stroke-linecap="round">${[[.12, 3], [.24, 2], [.33, 3.4], [.45, 2.2], [.55, 3], [.64, 2]].map(([f, L], j) => `<path d="M${P(a.x - (j % 2 ? 0 : 2.4))} ${P(a.y - (a.y - tt) * f / .66)} h${L}" stroke-width="${j % 3 ? 1.2 : 1.8}"/>`).join('')}</g><path d="M${a.x - 2.4} ${P(tt + 10)} l2.4 2.6 l2.4 -2.6" stroke="#1E1A1C" stroke-width="1.6" fill="none"/><path d="M${a.x - 1.2} ${a.y - 4} V${P(tt + 4)}" stroke="#fff" stroke-width="1.2" opacity=".7"/>`;
      neveArv += neveDe(t.segs);
      outono += copaBetula(a.x, a.y - a.h * .9, a.o, `lgCo${i}`);
      prima += copaBetula(a.x, a.y - a.h * .9, a.v, `lgCv${i}`);
      return;
    }
    const t = arvore(a.x, a.y, a.h, { wb:a.h * .07, ht:.42, nv:4, grad:'lgCasca', pal:['#2E1C10', '#6A4630', '#A07A58'], limbs:[[-PI / 2 - .62, .27], [-PI / 2 + .58, .27], [-PI / 2 + .02, .24]] });
    troncos += t.arv;
    neveArv += neveDe(t.segs) + `<ellipse cx="${a.x}" cy="${P(t.top + 2)}" rx="${P(a.h * .05)}" ry="1.8" fill="#fff"/>`;
    outono += `<g class="lg-bordo toque" data-x="${a.x}" data-y="${a.y - a.h}">${copaRica(a.x, a.y - a.h, a.rx, a.ry, a.o, `lgCo${i}`)}</g>`;
    prima += copaRica(a.x, a.y - a.h, a.rx, a.ry, a.v, `lgCv${i}`);
  });
  /* folhas caídas no chão (outono) */
  const folhasChao = Array.from({ length:22 }, () => { const x = R(4, 330), y = R(244, 254) + (x > 300 ? 4 : 0); const c = [['#E8502E', '#7A2010'], ['#F2C83A', '#8A6A0E'], ['#F29A2E', '#8A4A0E'], ['#C8321E', '#5A0E08']][Math.floor(R(0, 4))]; return folha(x, y, R(-90, 90), R(.16, .24), c[0], c[1]); }).join('');
  /* árvores do meio, mais apagadas */
  let meioO = '', meioP = '', meioPin = '', meioG = '';
  const MEIO = [[40, 210], [92, 204], [160, 208], [236, 214], [310, 222], [380, 236]];
  const MO = [['#E8A27A', '#C8805E', '#F8CDAE'], ['#E6C27A', '#C4A05E', '#F8E2AA'], ['#E89A6A', '#C4784E', '#F8C8A0'], ['#E8BA72', '#C49654', '#F8DEA6'], ['#DC8E80', '#B86A60', '#F4BCB0'], ['#E6C27A', '#C4A05E', '#F8E2AA']];
  const MV = [['#A8D88A', '#84B66C', '#D4F2B8'], ['#B8E09A', '#92BE78', '#E0F6C2'], ['#98CC7A', '#76AA5C', '#C8EAA8']];
  MEIO.forEach(([x, y], i) => {
    const sg = segsDe(x, y + 34, 14, -PI / 2, 2.6, 3, -PI / 2, .08);
    meioG += pinta(sg, '#9C94A6', '#9C94A6', 0).f;
    const cr = (c) => `<path d="${copa(x, y, 26, 18, 9, .3)}" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.2"/><path d="${copa(x + 4, y + 7, 19, 8, 7, .3)}" fill="${c[1]}" opacity=".55"/><path d="${copa(x - 7, y - 6, 14, 8, 7, .3)}" fill="${c[2]}" opacity=".8"/>`;
    meioO += cr(MO[i]); meioP += cr(MV[i % 3]);
  });
  [[66, 214, 40], [128, 212, 44], [200, 218, 40], [272, 222, 42], [346, 232, 40], [404, 246, 34]].forEach(([x, y, h]) => { for (let k = 0; k < 3; k++) { const w = h * (.3 - k * .07), yb = y - k * h * .26, yt = yb - h * .42; meioPin += `<path d="M${x} ${P(yt)} L${P(x - w)} ${P(yb)} H${P(x + w)}Z" fill="#6E9A98" stroke="#5A8684" stroke-width=".8" stroke-linejoin="round"/><path d="M${x} ${P(yt)} L${P(x + w)} ${P(yb)} H${x}Z" fill="#5A8684" opacity=".6"/>`; } });
  /* floresta distante na outra margem */
  const floresta = (x0, x1, yb, hmin, hmax, cor, cor2, pula) => { let o = '', x = x0; while (x < x1) { const h = R(hmin, hmax), w = h * .32; if (!pula || !pula(x)) o += `<path d="M${P(x)} ${P(yb(x) - h)} L${P(x - w)} ${P(yb(x) + 2)} H${P(x + w)}Z" fill="${cor}"/><path d="M${P(x)} ${P(yb(x) - h)} L${P(x + w)} ${P(yb(x) + 2)} H${P(x)}Z" fill="${cor2}"/>`; x += R(5, 11); } return o; };
  const pinMeio = floresta(470, 800, x => 262 - Math.sin(x / 60) * 4, 7, 13, '#93A8C8', '#8AA0C2');
  const pinLonge = floresta(360, 800, x => 282 - Math.sin(x / 47) * 3, 9, 20, '#6C88AC', '#5E7AA0', x => x > 684 && x < 788);
  const pinMorro = floresta(0, 420, x => (x < 200 ? 176 - Math.sin(x / 200 * PI) * 16 : 176 + (x - 200) * .13 - Math.sin((x - 200) / 220 * PI) * 10) + 6, 6, 12, '#A8B6D2', '#9EADCB');
  const neveChao = `<path d="M-4 255 C10 246 24 248 36 247 C48 244 60 248 72 246 C86 245 98 247 108 254 C104 257 96 255 88 256 C60 257 30 257 -4 258Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M366 364 C372 358 380 358 388 357 C396 356 404 357 410 362 C396 366 380 366 366 366Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M6 252 C30 250 60 251 90 250" stroke="#C8DAEE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  const pedra = (x, y, r, g) => `<ellipse cx="${P(x + r * .15)}" cy="${P(y + r * .55)}" rx="${P(r * 1.05)}" ry="${P(r * .3)}" fill="#1E120A" opacity=".35"/><path d="${copa(x, y, r, r * .7, 7, .12)}" fill="url(#${g})" stroke="#2A1E18" stroke-width="1.3"/><path d="M${P(x - r * .55)} ${P(y - r * .25)} q${P(r * .35)} ${P(-r * .35)} ${P(r * .8)} ${P(-r * .2)}" stroke="#F2EADC" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  /* superfície da margem de terra (para capim e raízes) */
  const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const supY = x => x < 100 ? 252 : x < 150 ? 252 + (x - 100) * 66 / 50 : x < 300 ? 318 + (x - 150) * 44 / 150 : 362;
  const dentro = (x, y, m) => y > supY(x) + m && (y < 360 || x < 406 + (y - 360) * .457 - m) && x > m * .5;
  let capim = '';
  for (let x = 2; x < 106; x += R(5, 9)) capim += tufo(x, 253, R(.7, 1.1), '#6A8A2E', '#9AB84A');
  for (let t = 0; t < .3; t += .07) capim += tufo(bz(100, 116, 126, 150, t), bz(252, 256, 304, 318, t) + 1, .7, '#6A8A2E', '#9AB84A');
  for (let x = 336; x < 404; x += R(6, 10)) capim += tufo(x, 362, R(.6, .9), '#5E8A2E', '#8AB84A');
  let raizes = '';
  [[22, 254, 1], [36, 254, .8], [74, 254, .7], [86, 254, .6]].forEach(([x, y, s]) => { const sg = segsDe(x, y, 26 * s, PI / 2 + R(-.3, .3), 4.2 * s, 4, PI / 2, .1); const p = pinta(sg, '#6A4428', '#2A180C', 1.6); raizes += p.o + p.f; });
  let raizinhas = ''; for (let x = 4; x < 104; x += 3) raizinhas += `M${x} 255 q${P(R(-2, 2))} ${P(R(4, 7))} ${P(R(-3, 3))} ${P(R(7, 13))} `;
  for (let x = 330; x < 404; x += 3) raizinhas += `M${x} 364 q${P(R(-2, 2))} ${P(R(3, 6))} ${P(R(-3, 3))} ${P(R(6, 11))} `;
  let pedras = '', n = 0, tent = 0;
  while (n < 16 && tent < 400) { tent++; const x = R(6, 440), y = R(300, 442), r = R(4.5, 11); if (!dentro(x, y, r + 6)) continue; if (Math.hypot((x - 72) / 44, (y - 346) / 26) < 1 || (x < 70 && y < 340 && Math.abs((x - 18) - (y - 252) * .5) < 16) || Math.hypot((x - 250) / 34, (y - 370) / 20) < 1 || (x > 140 && x < 300 && y < supY(x) + 26)) continue; pedras += pedra(x, y, r, ['lgPedraC', 'lgPedraQ'][n % 2]); n++; }
  let pedrinhas = ''; for (let i = 0; i < 70; i++) { const x = R(0, 470), y = R(414, 452); if (!dentro(x, y, 2)) continue; const r = R(1, 2.8); pedrinhas += `<circle cx="${P(x)}" cy="${P(y)}" r="${P(r)}" fill="${['#8A8496', '#9A8A78', '#6E6878', '#B0A08A'][i % 4]}" stroke="#3A2E24" stroke-width=".6"/>`; }
  let manchas = ''; for (let i = 0; i < 22; i++) { const x = R(0, 460), y = R(300, 410); if (!dentro(x, y, 4)) continue; manchas += `<ellipse cx="${P(x)}" cy="${P(y)}" rx="${P(R(6, 16))}" ry="${P(R(2, 5))}" fill="${i % 3 ? '#A07448' : '#4A2E18'}" opacity="${i % 3 ? .3 : .35}"/>`; }
  /* rocha-mãe em estratos */
  let rocha = ''; const CR = ['#857F92', '#6E6880', '#958FA2', '#625C72', '#7A748A'];
  for (let j = 0; j < 5; j++) { const y0 = 450 + j * 11; let d = `M-4 ${P(y0 + R(-2, 2))}`; for (let x = 40; x <= 520; x += 40) d += ` Q${P(x - 20)} ${P(y0 + R(-3, 3) + x * .012)} ${x} ${P(y0 + R(-2, 2) + x * .015)}`; rocha += `<path d="${d} V510 H-4Z" fill="${CR[j]}" stroke="#3E384A" stroke-width="1.2"/><path d="${d}" stroke="#B4AEC0" stroke-width="1.3" fill="none" opacity=".55" transform="translate(0 1.6)"/>`; let jt = ''; for (let q = 0; q < 6; q++) { const jx = R(0, 470); jt += `M${P(jx)} ${P(y0 + 3 + jx * .013)} l${P(R(-2, 2))} ${P(R(6, 10))} `; } rocha += `<path d="${jt}" stroke="#3E384A" stroke-width="1.3" fill="none" opacity=".75"/>`; }
  rocha += Array.from({ length:9 }, () => { const x = R(10, 460), y = 449 + x * .012; return `<path d="M${P(x - 6)} ${P(y + 2)} l3 -5 l7 -1 l3 5 l-4 3Z" fill="#9A94A8" stroke="#3E384A" stroke-width="1"/>`; }).join('');
  /* lago grande: ondinhas */
  const ondas = Array.from({ length:26 }, (_, i) => { const x = R(400, 790), y = R(298, 356), s = (y - 286) / 70; return `<path d="M${P(x)} ${P(y)} q${P(4 + s * 8)} ${P(-1.6 - s)} ${P(9 + s * 16)} 0" stroke="${i % 3 ? '#E6F6FF' : '#2C78C0'}" stroke-width="${P(.9 + s * 1.2)}" opacity="${i % 3 ? .8 : .45}"/>`; }).join('');
  /* reflexo das árvores na lagoa do castor */
  const reflexo = (cores) => { let o = ''; [[122, 0], [194, 1], [262, 2], [300, 3]].forEach(([x, ci]) => { for (let r = 0; r < 6; r++) { const w = (ci === 0 || ci === 3 ? 10 - r * 1.4 : 30 - r * 4) * R(.8, 1.1), y = 276 + r * 3.2, dx = R(-4, 4); o += `<path d="M${P(x - w / 2 + dx)} ${P(y)} h${P(w)}" stroke="${cores[ci]}" stroke-width="2.2" stroke-linecap="round"/>`; } }); return o; };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Grandes Lagos com castor construindo represa, lagoa com brejo, alce, mobelha, farol e o lago visto por dentro com peixes">
    <defs>
      <linearGradient id="lgCeuO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A9EE2"/><stop offset=".45" stop-color="#9ED0F2"/><stop offset=".72" stop-color="#D6ECF8"/><stop offset="1" stop-color="#FFE0B8"/></linearGradient>
      <linearGradient id="lgCeuI" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C92BE"/><stop offset=".4" stop-color="#AEBCDA"/><stop offset=".68" stop-color="#D8DCEC"/><stop offset=".86" stop-color="#EEE2EA"/><stop offset="1" stop-color="#F8EEE8"/></linearGradient>
      <linearGradient id="lgCeuP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#48AEF2"/><stop offset=".7" stop-color="#BDE6FB"/><stop offset="1" stop-color="#EEFAF0"/></linearGradient>
      <radialGradient id="lgHalo" cx="612" cy="74" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF4D0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4D0" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F6FC" stop-opacity="0"/><stop offset="1" stop-color="#F2F6FC" stop-opacity=".7"/></linearGradient>
      <linearGradient id="lgSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8E2F4"/><stop offset=".14" stop-color="#8EC6EC"/><stop offset=".55" stop-color="#4C9EDC"/><stop offset="1" stop-color="#2A72C0"/></linearGradient>
      <linearGradient id="lgRefMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E7AA0" stop-opacity=".55"/><stop offset="1" stop-color="#5E7AA0" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA6DE"/><stop offset=".3" stop-color="#2A7CC4"/><stop offset=".7" stop-color="#14498E"/><stop offset="1" stop-color="#0A2C62"/></linearGradient>
      <linearGradient id="lgLagoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC6E6"/><stop offset=".12" stop-color="#4E9ED0"/><stop offset=".5" stop-color="#2E78AE"/><stop offset="1" stop-color="#1A4E80"/></linearGradient>
      <linearGradient id="lgBrilhoAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset=".3" stop-color="#7A5232"/><stop offset=".62" stop-color="#8A6440"/><stop offset="1" stop-color="#6E5038"/></linearGradient>
      <linearGradient id="lgMargem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2B65E"/><stop offset=".3" stop-color="#A2A44C"/><stop offset=".75" stop-color="#7E8A3C"/><stop offset="1" stop-color="#6A6A34"/></linearGradient>
      <linearGradient id="lgMargemP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD466"/><stop offset=".3" stop-color="#72B44C"/><stop offset="1" stop-color="#4E8A3A"/></linearGradient>
      <linearGradient id="lgNeveM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF4FB"/><stop offset="1" stop-color="#CADCF0"/></linearGradient>
      <linearGradient id="lgNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F2F7FD"/><stop offset="1" stop-color="#C6DAF0"/></linearGradient>
      <linearGradient id="lgMorroF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6CEE6"/><stop offset="1" stop-color="#D8DEEE"/></linearGradient>
      <linearGradient id="lgMorroL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0BEDA"/><stop offset="1" stop-color="#C8D4E6"/></linearGradient>
      <linearGradient id="lgMorroM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9EB0D0"/><stop offset="1" stop-color="#B4C4DE"/></linearGradient>
      <linearGradient id="lgMorroP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E98BE"/><stop offset="1" stop-color="#94AACA"/></linearGradient>
      <linearGradient id="lgRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F8FF" stop-opacity=".45"/><stop offset="1" stop-color="#E6F8FF" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgGelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".22" stop-color="#E6F6FF"/><stop offset=".7" stop-color="#B6DCF4"/><stop offset="1" stop-color="#86C0EA"/></linearGradient>
      <linearGradient id="lgGeloSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F8FD"/><stop offset=".35" stop-color="#DCEBF7"/><stop offset="1" stop-color="#A6CDEB"/></linearGradient>
      <radialGradient id="lgGeloClaro" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5E9ACB" stop-opacity=".55"/><stop offset=".7" stop-color="#7EB2DA" stop-opacity=".35"/><stop offset="1" stop-color="#9CC6E6" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgFarol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8CEDC"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset="1" stop-color="#AEB6C8"/></linearGradient>
      <linearGradient id="lgFaixa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B82A20"/><stop offset=".35" stop-color="#F0503E"/><stop offset="1" stop-color="#A0221A"/></linearGradient>
      <linearGradient id="lgRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A96A8"/><stop offset="1" stop-color="#5E5A6E"/></linearGradient>
      <radialGradient id="lgLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgFacho" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>
      <radialGradient id="lgSolG" cx=".4" cy=".38" r=".6"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A01E"/></radialGradient>
      <radialGradient id="lgToca" cx=".5" cy=".4" r=".65"><stop offset="0" stop-color="#4A3020"/><stop offset=".6" stop-color="#2A1A0E"/><stop offset="1" stop-color="#140C06"/></radialGradient>
      <radialGradient id="lgDomo" cx=".38" cy=".25" r=".85"><stop offset="0" stop-color="#A87A4A"/><stop offset=".55" stop-color="#6E4626"/><stop offset="1" stop-color="#3A2212"/></radialGradient>
      <linearGradient id="lgLama" x1="0" y1="270" x2="0" y2="372" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7A5636"/><stop offset=".5" stop-color="#5E4028"/><stop offset="1" stop-color="#46301C"/></linearGradient>
      <linearGradient id="lgCasca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6444"/><stop offset=".35" stop-color="#A07A58"/><stop offset=".7" stop-color="#6A4630"/><stop offset="1" stop-color="#4A2E1C"/></linearGradient>
      <linearGradient id="lgBet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D4D0C8"/><stop offset=".35" stop-color="#FFFFFC"/><stop offset=".75" stop-color="#E4E0D8"/><stop offset="1" stop-color="#A8A49C"/></linearGradient>
      <radialGradient id="lgPedraC" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#C4BECC"/><stop offset=".55" stop-color="#8E889A"/><stop offset="1" stop-color="#5A5468"/></radialGradient>
      <radialGradient id="lgPedraQ" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#D2B898"/><stop offset=".55" stop-color="#9A8068"/><stop offset="1" stop-color="#5E4A3A"/></radialGradient>
      <radialGradient id="lgPedraA" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#9AB0C8"/><stop offset=".55" stop-color="#5E7090"/><stop offset="1" stop-color="#2E3E5E"/></radialGradient>
      <linearGradient id="lgAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8B07A"/><stop offset="1" stop-color="#7A6A4A"/></linearGradient>
      <linearGradient id="lgAlga" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7AC86A"/><stop offset=".5" stop-color="#3E8A4A"/><stop offset="1" stop-color="#1E5A36"/></linearGradient>
      <linearGradient id="lgTaboa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6234"/><stop offset=".4" stop-color="#7A4A22"/><stop offset="1" stop-color="#4A2A12"/></linearGradient>
      <linearGradient id="lgPercaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8A836"/><stop offset=".45" stop-color="#D6D058"/><stop offset=".8" stop-color="#F2EAA0"/><stop offset="1" stop-color="#F8F0C0"/></linearGradient>
      <linearGradient id="lgEstG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A6C76"/><stop offset=".55" stop-color="#9A9CA6"/><stop offset="1" stop-color="#D4D6DE"/></linearGradient>
      <linearGradient id="lgPatoC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8A898"/><stop offset="1" stop-color="#7A6A5A"/></linearGradient>
      <radialGradient id="lgPatoV" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#4ECB8A"/><stop offset=".6" stop-color="#1E7A4A"/><stop offset="1" stop-color="#0E4A2A"/></radialGradient>
      <radialGradient id="lgNinfeia" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#8ADA6A"/><stop offset="1" stop-color="#3A8A3A"/></radialGradient>
      ${gradArv}
      <pattern id="lgGraos" width="34" height="30" patternUnits="userSpaceOnUse"><g fill="#2A180C" opacity=".5"><circle cx="3" cy="4" r=".9"/><circle cx="17" cy="9" r=".7"/><circle cx="27" cy="3" r="1"/><circle cx="9" cy="19" r=".8"/><circle cx="24" cy="22" r=".9"/><circle cx="31" cy="15" r=".6"/></g><g fill="#D8B486" opacity=".45"><circle cx="12" cy="3" r=".7"/><circle cx="22" cy="14" r=".8"/><circle cx="4" cy="26" r=".7"/><circle cx="15" cy="27" r=".6"/><circle cx="30" cy="27" r=".7"/></g></pattern>
      <clipPath id="lgBaciaClip"><path d="M100 252 C116 256 126 304 150 318 L300 362 L312 362 L312 200 L90 200Z"/></clipPath>
      <clipPath id="lgSoloClip"><path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 360 C424 392 452 440 470 500 H0Z"/></clipPath>
      <clipPath id="lgFundoClip"><rect x="340" y="${LAGO}" width="460" height="140"/></clipPath>
      <clipPath id="lgDomoClip"><path d="M118 282 C116 264 130 238 160 228 C190 238 206 290 204 336 L150 318 C136 308 126 296 118 282Z"/></clipPath>
      <clipPath id="lgSubmerso"><rect x="100" y="279" width="120" height="80"/></clipPath>
      <radialGradient id="lgVinheta" cx=".5" cy=".45" r=".78"><stop offset=".58" stop-color="#0A1A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A3A" stop-opacity=".36"/></radialGradient>
      <filter id="lgGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#lgCeuO)"/>
    <rect width="800" height="500" fill="url(#lgHalo)"/>
    <rect id="lg-ceu-i" width="800" height="500" fill="url(#lgCeuI)" style="opacity:0;transition:opacity 2s"/>
    <rect id="lg-ceu-p" width="800" height="500" fill="url(#lgCeuP)" style="opacity:0;transition:opacity 2s"/>
    <g id="lg-sol" class="toque" style="transition:opacity 1.6s"><g id="lg-sol-in" style="transform-origin:612px 74px;transition:transform 1s"><circle cx="612" cy="74" r="56" fill="#FFE27A" opacity=".18"/><circle cx="612" cy="74" r="40" fill="#FFE27A" opacity=".28"/><circle cx="612" cy="74" r="27" fill="url(#lgSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M598 64 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="624" cy="84" r="3" fill="#FFF6C8" opacity=".6"/></g><g id="lg-sol-hint" style="display:none">${brilhoHotspot(640, 50)}</g><circle cx="612" cy="74" r="50" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="150" y="34" width="90" height="42" style="color:#fff" opacity=".85"/><use href="#nuvem" x="690" y="120" width="70" height="32" style="color:#fff" opacity=".75"/></g>
    <g id="lg-nuvem" class="toque"><g id="lg-nuvem-in" style="transform-origin:420px 80px;transition:transform .5s"><g id="lg-nuvem-clara" style="transition:opacity 1.2s"><use href="#nuvem" x="352" y="44" width="130" height="62" style="color:#fff" opacity=".95"/></g><g id="lg-nuvem-neve" style="opacity:0;transition:opacity 1.2s"><use href="#nuvem" x="340" y="34" width="164" height="80" style="color:#7A88A8"/><use href="#nuvem" x="346" y="37" width="154" height="72" style="color:#C9D2E4"/><use href="#nuvem" x="372" y="62" width="104" height="46" style="color:#A4B0C8"/><path d="M370 64 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#fff" stroke="#A8C0DE" stroke-width=".8">${[[384, 120], [414, 128], [446, 118], [470, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g></g></g><g id="lg-nuvem-hint" style="display:none">${brilhoHotspot(486, 52)}</g><rect x="340" y="34" width="166" height="100" fill="transparent"/></g>
    <path d="M0 160 C40 140 90 128 150 140 C200 120 260 128 320 150 C370 164 410 186 440 210 V300 H0Z" fill="url(#lgMorroF)"/>
    <path d="M300 292 L300 238 C340 226 372 212 410 220 C450 200 480 194 520 208 C560 188 600 192 640 212 C680 202 720 204 760 216 C780 212 792 214 800 212 V292Z" fill="url(#lgMorroF)"/>
    <path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204 V300 H0Z" fill="url(#lgMorroL)"/>
    <path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244 V292Z" fill="url(#lgMorroM)"/>
    <g id="lg-neve-longe" style="opacity:0;transition:opacity 2s"><path d="M0 160 C40 140 90 128 150 140 C200 120 260 128 320 150 C370 164 410 186 440 210 V230 H0Z" fill="#EEF0FA" opacity=".9"/><path d="M300 292 L300 238 C340 226 372 212 410 220 C450 200 480 194 520 208 C560 188 600 192 640 212 C680 202 720 204 760 216 C780 212 792 214 800 212 V292Z" fill="#E8ECF8" opacity=".92"/><path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204 V300 H0Z" fill="#F2F5FB" opacity=".9"/><path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244 V292Z" fill="#F6F8FC" opacity=".9"/><path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204" stroke="#C8D2E6" stroke-width="1.4" fill="none"/><path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244" stroke="#C4CEE4" stroke-width="1.4" fill="none"/></g>
    <g opacity=".85">${pinMorro}</g>
    ${pinMeio}
    <rect x="300" y="236" width="500" height="56" fill="url(#lgNevoa)"/>
    <path d="M330 292 C400 278 460 272 520 280 C580 270 640 274 690 282 C730 276 770 272 800 272 V292Z" fill="url(#lgMorroP)"/>
    ${pinLonge}
    <g id="lg-farol" class="toque"><path d="M682 293 C688 284 698 278 712 276 C722 270 736 268 748 272 C760 268 776 274 786 282 C792 286 796 290 798 293Z" fill="url(#lgRocha)" stroke="#4E4A5C" stroke-width="1.4"/><path d="M698 284 C706 279 716 278 724 280 M742 276 C752 273 764 275 772 280" stroke="#B8B4C6" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M712 284 l6 -4 l8 2 M760 286 l6 -5 l8 3" stroke="#4E4A5C" stroke-width="1" fill="none" opacity=".7"/><g transform="translate(712 270)"><path d="M-7 4 V-4 H7 V4Z" fill="#F2E8D8" stroke="#4E4A5C" stroke-width="1"/><path d="M-9 -3 L0 -9 L9 -3Z" fill="#B83A2E" stroke="#6A1A12" stroke-width=".9" stroke-linejoin="round"/><rect x="-4" y="-1.5" width="3" height="3" fill="#FFE27A" stroke="#4E4A5C" stroke-width=".5"/></g><path d="M682 293 q5 -3 10 0 t10 0 t10 0 M770 293 q5 -3 10 0 t10 0 t10 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/><circle cx="744" cy="206" r="18" fill="url(#lgLuz)"/><g transform="translate(744 276)"><path d="M-9 0 L-6.4 -56 H6.4 L9 0Z" fill="url(#lgFarol)" stroke="#4E5470" stroke-width="1.6"/>${[[-8.4, -14, -20], [-7.6, -30, -36], [-6.9, -44, -50]].map(([w, y1, y2]) => `<path d="M${w} ${y1} Q0 ${y1 + 2.4} ${-w} ${y1} L${-w - .4} ${y2} Q0 ${y2 + 2.4} ${w + .4} ${y2}Z" fill="url(#lgFaixa)"/>`).join('')}<path d="M-4 -6 V-52" stroke="#fff" stroke-width="1.4" opacity=".6"/><rect x="-10" y="-58.5" width="20" height="3" rx="1" fill="#2E3448"/><path d="M-9 -58.5 V-62 M-5 -58.5 V-62 M0 -58.5 V-62 M5 -58.5 V-62 M9 -58.5 V-62 M-9.5 -62 H9.5" stroke="#2E3448" stroke-width=".9"/><rect x="-6" y="-69" width="12" height="10" rx="1" fill="#FFE27A" stroke="#2E3448" stroke-width="1.4"/><path d="M-2 -69 V-59 M2 -69 V-59" stroke="#C89A2A" stroke-width=".7"/><path d="M-8 -69 Q0 -79 8 -69Z" fill="#E5392C" stroke="#7A1A10" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-77" r="1.6" fill="#2E3448"/><path d="M-3 -72 q2 -3 4 -3" stroke="#FFB0A0" stroke-width="1" fill="none"/><path d="M-2.4 0 V-7 a2.4 2.4 0 0 1 4.8 0 V0Z" fill="#2E3448"/><rect x="-1.4" y="-26" width="2.8" height="4" rx="1" fill="#2E3448"/><rect x="-1.2" y="-41" width="2.4" height="3.6" rx="1" fill="#2E3448"/></g><path id="lg-facho" d="M744 -63 L652 -82 L652 -42Z" transform="translate(0 276)" fill="url(#lgFacho)" style="opacity:.35"/><rect x="684" y="196" width="110" height="96" fill="transparent"/></g>
    <path d="M330 292 H800 V${LAGO} H380Z" fill="url(#lgSup)"/>
    <path d="M330 292 H800 V304 H339Z" fill="url(#lgRefMorro)"/>
    <g opacity=".22" fill="#3E5A80">${Array.from({ length:30 }, () => { const x = R(380, 680), h = R(5, 10); return `<path d="M${P(x)} ${P(294 + h)} L${P(x - h * .3)} 293 H${P(x + h * .3)}Z"/>`; }).join('')}</g>
    <g id="lg-reflexo"><g opacity=".55">${[[294, 7, '#fff'], [298, 6, '#E5392C'], [303, 5, '#fff'], [308, 5, '#E5392C'], [313, 4, '#fff'], [318, 3, '#FFE27A']].map(([y, w, c], i) => `<path d="M${744 - w + (i % 2) * 2} ${y} h${w * 2}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g><g stroke="#FFF4C8" stroke-linecap="round" opacity=".75">${Array.from({ length:12 }, (_, i) => { const y = 296 + i * 5.2, w = 6 + i * 2.6 + R(-3, 3); return `<path d="M${P(612 - w / 2 + R(-6, 6))} ${P(y)} h${P(w)}" stroke-width="${P(1.2 + i * .12)}"/>`; }).join('')}</g></g>
    <g fill="none" stroke-linecap="round">${ondas}</g>
    <rect id="lg-sup" class="toque" x="380" y="292" width="420" height="${LAGO - 292}" fill="transparent"/>
    <g id="lg-sup-gelo" style="opacity:0;transition:opacity 1.6s;pointer-events:none"><path d="M330 292 H800 V${LAGO} H380Z" fill="url(#lgGeloSup)"/>
      ${[[470, 322, 60, 9], [620, 340, 80, 11], [720, 306, 46, 6], [540, 302, 40, 5], [420, 348, 44, 8]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#lgGeloClaro)"/><g fill="#fff" stroke="#8DB6DA" stroke-width=".5" opacity=".9">${Array.from({ length:7 }, () => { const bx = x + R(-rx, rx) * .7, by = y + R(-ry, ry) * .5; return `<ellipse cx="${P(bx)}" cy="${P(by)}" rx="${P(R(1, 2.4))}" ry="${P(R(.6, 1.2))}"/><ellipse cx="${P(bx + R(-1, 1))}" cy="${P(by - 2.4)}" rx="${P(R(.6, 1.4))}" ry=".6"/>`; }).join('')}</g>`).join('')}
      <g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M392 334 l26 -7 l18 9 l24 -5 l14 4 M540 306 l16 10 l32 -3 l12 6 M600 352 l26 -10 l30 6 l24 -12 l20 4 M690 300 l18 9 l22 -2 M452 356 l38 -5 l12 3 M760 330 l20 -6 M640 318 l-12 -6 M520 345 l10 -10" stroke="#fff" stroke-width="2.4" transform="translate(0 1)"/><path d="M392 334 l26 -7 l18 9 l24 -5 l14 4 M540 306 l16 10 l32 -3 l12 6 M600 352 l26 -10 l30 6 l24 -12 l20 4 M690 300 l18 9 l22 -2 M452 356 l38 -5 l12 3 M760 330 l20 -6 M640 318 l-12 -6 M520 345 l10 -10" stroke="#6E9CC8" stroke-width="1.1"/></g>
      <g><path d="M330 292 C380 290 430 296 480 293 C540 290 600 296 660 293 C720 290 770 295 800 293 V299 C760 301 720 297 660 300 C600 302 540 297 480 300 C430 302 380 298 334 298Z" fill="#fff"/><path d="M334 298 C380 298 430 302 480 300 C540 297 600 302 660 300 C720 297 760 301 800 299" stroke="#B0CAE6" stroke-width="1.2" fill="none"/>${[[450, 333, 46], [664, 324, 40], [560, 352, 54], [760, 350, 30]].map(([x, y, w]) => `<path d="M${x - w} ${y + 2} C${x - w * .5} ${y - 4} ${x + w * .4} ${y - 4} ${x + w} ${y + 2} C${x + w * .4} ${y} ${x - w * .4} ${y} ${x - w} ${y + 2}Z" fill="#fff"/><path d="M${x - w} ${y + 2} C${x - w * .4} ${y + .2} ${x + w * .4} ${y + .2} ${x + w} ${y + 2}" stroke="#A9C6E6" stroke-width="1.2" fill="none"/>`).join('')}</g>
      <g fill="#fff">${[[500, 318], [612, 330], [700, 342], [760, 312], [430, 306]].map(([x, y]) => `<path d="M${x} ${y - 4} l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1Z"/>`).join('')}</g></g>
    <g id="lg-placas" style="opacity:0;transition:opacity 1.6s;pointer-events:none">${[[420, 310, 34], [500, 330, 44], [610, 304, 38], [690, 336, 50], [770, 312, 30]].map(([x, y, w], i) => { const d = `M${x - w} ${y} L${x - w * .6} ${y - 7} L${x + w * .7} ${y - 6} L${x + w} ${y + 1} L${x + w * .5} ${y + 7} L${x - w * .7} ${y + 6}Z`; return `<g style="animation:flutua ${(2.6 + i * .5).toFixed(1)}s ease-in-out infinite alternate"><ellipse cx="${x}" cy="${y + 8}" rx="${w * 1.05}" ry="3" fill="#2A6AA6" opacity=".3"/><path d="${d}" fill="#8EC0E6" stroke="#5E94C4" stroke-width="1.2" transform="translate(0 3.5)"/><path d="${d}" fill="url(#lgGeloSup)" stroke="#8AB8DC" stroke-width="1.4" stroke-linejoin="round"/><path d="M${x - w * .5} ${y - 3} h${w * .7}" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M${x - w * .2} ${y + 3} l${w * .3} -4" stroke="#A8CCE8" stroke-width="1" fill="none"/></g>`; }).join('')}</g>
    <g id="lg-mobelha" class="toque" data-fig="mobelha"><g id="lg-mob-pos"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><svg x="530" y="300" width="78" height="54" viewBox="0 0 130 90"><use href="#f-mobelha"/></svg></g>${brilhoHotspot(600, 300)}</g></g>
    <rect x="340" y="${LAGO}" width="460" height="140" fill="url(#lgFundo)"/>
    <g clip-path="url(#lgFundoClip)">
      <g stroke="#CFF0FF" stroke-width="1.2" fill="none" opacity=".22">${Array.from({ length:9 }, (_, i) => `<path d="M${380 + i * 48} ${LAGO + 6 + (i % 3) * 4} q12 -6 24 0 t24 2 M${396 + i * 48} ${LAGO + 16 + (i % 2) * 5} q10 4 20 -2"/>`).join('')}</g>
      <g id="lg-raios">${[[430, 34], [520, 52], [610, 30], [690, 56], [770, 28]].map(([x, w]) => `<path d="M${x} ${LAGO} L${x + w} ${LAGO} L${x + w * 1.6 + 40} 490 L${x + 10} 490Z" fill="url(#lgRaio)" opacity=".5"/>`).join('')}</g>
      <g fill="#123E7A" opacity=".55">${[500, 620, 760].map(x => `<path d="${copa(x, 486, 60, 22, 9, .25)}"/>`).join('')}${[530, 600, 700, 780].map((x, i) => `<path d="M${x} 486 C${x - 6} 460 ${x + 6} 440 ${x + 2} ${420 + i * 6} C${x + 8} 444 ${x + 4} 462 ${x + 5} 486Z"/>`).join('')}</g>
      <path d="M400 482 C500 470 600 476 700 468 C740 466 780 470 800 468 V500 H400Z" fill="url(#lgAreia)" stroke="#8A6A3A" stroke-width="1.6"/>
      <g stroke="#E2CC96" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".55">${[[540, 484], [600, 488], [660, 482], [720, 480], [770, 486], [500, 490]].map(([x, y]) => `<path d="M${x - 14} ${y} q7 -3 14 0 t14 0"/>`).join('')}</g>
      <g transform="translate(560 476) rotate(-4)"><rect x="-34" y="-6" width="68" height="12" rx="6" fill="#5A4030" stroke="#2A1A10" stroke-width="1.4"/><ellipse cx="34" cy="0" rx="3.4" ry="6" fill="#8A6A4A" stroke="#2A1A10" stroke-width="1"/><path d="M-28 -2 H24 M-20 2 H14" stroke="#7A5A40" stroke-width="1.2"/><path d="M-30 -6 C-20 -9 0 -9 20 -7" stroke="#4E8A3A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>
      <g>${[[520, 484, 13], [598, 478, 8], [700, 474, 16], [760, 476, 10], [636, 482, 7], [470, 488, 9]].map(([x, y, r]) => `<ellipse cx="${x + 2}" cy="${y + r * .5}" rx="${r * 1.1}" ry="${r * .25}" fill="#0A1A3A" opacity=".35"/><path d="${copa(x, y, r, r * .62, 7, .12)}" fill="url(#lgPedraA)" stroke="#1E2A44" stroke-width="1.4"/><path d="M${x - r * .7} ${y - r * .4} q${r * .6} ${-r * .35} ${r * 1.3} ${-r * .1}" stroke="#5E9A5A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M${x - r * .5} ${y - r * .2} q${r * .4} -${r * .25} ${r * .8} 0" stroke="#D8E6F2" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}</g>
      <g>${[480, 590, 668, 742, 792].map((x, i) => { const h = 62 + (i % 3) * 14, l = (i % 2 ? 1 : -1) * 10; return `<g class="balanca" style="animation-duration:${(4 + i * .6).toFixed(1)}s;animation-delay:${(-i).toFixed(1)}s"><path d="M${x - 3} 484 C${x - 3 - l * .2} ${484 - h * .4} ${x + l * .6 - 2} ${484 - h * .75} ${x + l} ${484 - h} C${x + l * .6 + 2} ${484 - h * .7} ${x + 3 - l * .2} ${484 - h * .35} ${x + 3} 484Z" fill="url(#lgAlga)" stroke="#1E4A2A" stroke-width="1"/><path d="M${x + 6} 484 C${x + 4} ${484 - h * .3} ${x + 14} ${484 - h * .5} ${x + 12} ${484 - h * .7} C${x + 16} ${484 - h * .45} ${x + 9} ${484 - h * .3} ${x + 10} 484Z" fill="url(#lgAlga)" stroke="#1E4A2A" stroke-width="1"/><path d="M${x} 482 C${x - l * .1} ${484 - h * .4} ${x + l * .5} ${484 - h * .74} ${x + l * .9} ${486 - h}" stroke="#A8E68A" stroke-width=".8" fill="none" opacity=".6"/></g>`; }).join('')}</g>
      <g fill="#E6F6FF" opacity=".35">${Array.from({ length:20 }, () => `<circle cx="${P(R(420, 800))}" cy="${P(R(372, 470))}" r="${P(R(.6, 1.4))}"/>`).join('')}</g>
      <rect id="lg-fundo-toque" x="420" y="${LAGO + 2}" width="380" height="136" fill="transparent"/>
      <g id="lg-peixes">
        <g class="lg-peixe toque" data-p="truta" data-fig="truta"><g class="deriva" style="animation-duration:19s"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><g class="lg-pin"><svg x="560" y="384" width="90" height="48" viewBox="0 0 130 70"><use href="#f-truta"/></svg></g></g></g><g class="lg-phint">${brilhoHotspot(640, 388)}</g></g>
        <g class="lg-peixe toque" data-p="perca"><g class="deriva" style="animation-duration:23s;animation-delay:-8s"><g style="animation:flutua 2.2s ease-in-out infinite alternate"><g class="lg-pin"><g transform="translate(528 430) scale(.9)">${perca}</g><g transform="translate(494 448) scale(.6)">${perca}</g></g></g></g><g class="lg-phint" style="display:none">${brilhoHotspot(556, 414)}</g><rect x="466" y="408" width="104" height="52" fill="transparent"/></g>
        <g class="lg-peixe toque" data-p="esturjao"><g class="deriva" style="animation-duration:30s;animation-direction:alternate-reverse"><g style="animation:flutua 4s ease-in-out infinite alternate"><g class="lg-pin"><g transform="translate(690 452) scale(-1 1) scale(.95)">${esturjao}</g></g></g></g><g class="lg-phint" style="display:none">${brilhoHotspot(760, 440)}</g><rect x="610" y="430" width="160" height="40" fill="transparent"/></g>
      </g>
      <g id="lg-laje" style="transform-origin:0 357px;transform:scaleY(0);transition:transform 1.6s ease-out"><path d="M340 357 H800 V378 ${Array.from({ length:23 }, (_, i) => `q-10 ${i % 2 ? 3.4 : -1.6} -20 ${i % 3 ? .4 : -.4}`).join(' ')}Z" fill="url(#lgGelo)" fill-opacity=".94" stroke="#6AA6D6" stroke-width="1.6"/><g stroke="#fff" stroke-width=".9" opacity=".35">${Array.from({ length:40 }, (_, i) => { const x = 344 + i * 11.4 + R(-3, 3); return `<path d="M${P(x)} 362 v${P(R(8, 14))}"/>`; }).join('')}</g><g fill="#fff" stroke="#7EB2DA" stroke-width=".5">${Array.from({ length:16 }, (_, i) => { const x = 360 + i * 28 + R(-6, 6); return [0, 1, 2, 3].map(j => `<ellipse cx="${P(x + R(-.8, .8))}" cy="${P(374 - j * 3.2)}" rx="${P(1.6 - j * .25)}" ry="${P(1.1 - j * .15)}"/>`).join(''); }).join('')}</g><path d="M420 364 l14 6 l10 -3 M600 362 l10 8 l14 -2 l8 6 M720 366 l12 -4 l10 7" stroke="#fff" stroke-width="1.4" fill="none" opacity=".85"/><path d="M340 361 H800" stroke="#fff" stroke-width="3"/><text x="486" y="374" text-anchor="start" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#123E78" stroke="#fff" stroke-width="3.4" stroke-linejoin="round" paint-order="stroke">gelo</text><text x="486" y="400" text-anchor="start" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#fff" stroke="#0A2E62" stroke-width="3.6" stroke-linejoin="round" paint-order="stroke">água</text></g>
    </g>
    <path d="M380 ${LAGO} ${Array.from({ length:21 }, () => 'q10 -3 20 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.4" fill="none"/>
    <path d="M380 ${LAGO + 3} H800" stroke="#0E3A72" stroke-width="2" opacity=".18"/>
    <g opacity=".78"><g opacity=".8">${meioG}</g><g id="lg-meio-o" style="transition:opacity 2s">${meioO}</g><g id="lg-meio-p" style="opacity:0;transition:opacity 2s">${meioP}</g>${meioPin}</g>
    <path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgMargem)"/>
    <path id="lg-margem-p" d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgMargemP)" style="opacity:0;transition:opacity 2s"/>
    <path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292" stroke="#DCE08A" stroke-width="2" fill="none" opacity=".6"/>
    <g opacity=".85">${Array.from({ length:26 }, () => { const x = R(130, 360), y = R(256, 300); return x > 340 && y < 270 ? '' : tufo(x, y, R(.5, .8), '#6E7A2E', '#A4AE4A'); }).join('')}</g>
    <g id="lg-neve-margem" style="opacity:0;transition:opacity 2s"><path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgNeveM)"/><g stroke="#C4D6EC" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"><path d="M140 262 C170 258 200 260 226 264 M250 270 C280 266 310 270 336 276 M160 286 C190 282 220 286 250 290"/></g><g fill="#fff">${[[180, 258], [300, 266], [220, 284]].map(([x, y]) => `<path d="M${x} ${y - 3} l.8 2.2 l2.2 .8 l-2.2 .8 l-.8 2.2 l-.8 -2.2 l-2.2 -.8 l2.2 -.8Z"/>`).join('')}</g></g>
    ${sombrasArv}
    <g id="lg-troncos">${troncos}</g>
    <g id="lg-pinhos">${pinhos}</g>
    <g id="lg-outono" style="transition:opacity 2s">${folhasChao}${outono}</g>
    <g id="lg-prima" style="opacity:0;transition:opacity 2s;pointer-events:none">${prima}</g>
    <g id="lg-neve-arv" style="opacity:0;transition:opacity 2s;pointer-events:none">${neveArv}</g>
    <path d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#2E6EA8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".35"/>
    <path id="lg-riacho-chao" d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#4A9AD8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path id="lg-riacho-flux" d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#DFF4FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 10"/>
    <g id="lg-alce" class="toque" data-fig="alce"><g id="lg-alce-pos" transform="translate(0 0)"><ellipse cx="46" cy="251" rx="32" ry="4" fill="#2A1A0A" opacity=".28"/><g id="lg-alce-in" style="transform-origin:48px 250px;transition:transform .8s"><g transform="translate(94 0) scale(-1 1)"><svg x="4" y="166" width="86" height="86" viewBox="0 0 120 120"><use href="#f-alce"/></svg></g></g></g>${brilhoHotspot(24, 178)}</g>
    <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO} C424 392 452 440 470 500 H0Z" fill="url(#lgSolo)"/>
    <g clip-path="url(#lgSoloClip)">
      <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO}" stroke="#3A2414" stroke-width="40" fill="none" opacity=".75"/>
      <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO}" stroke="#24160A" stroke-width="16" fill="none" opacity=".6"/>
      <path d="M150 326 L300 370 C330 374 370 370 400 372" stroke="#2A2620" stroke-width="18" fill="none" opacity=".4"/>
      ${manchas}
      <path d="M0 410 C60 402 120 416 200 406 C280 398 360 414 480 404 V500 H0Z" fill="#8E6E4C"/>
      <path d="M0 410 C60 402 120 416 200 406 C280 398 360 414 480 404" stroke="#5A3E26" stroke-width="2" fill="none" opacity=".6"/>
      ${pedrinhas}
      <rect width="480" height="500" y="250" fill="url(#lgGraos)"/>
      ${rocha}
      ${raizes}
      <path d="${raizinhas}" stroke="#2E1C0E" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>
      ${pedras}
    </g>
    <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO} C424 392 452 440 470 500" stroke="#2A180C" stroke-width="2" fill="none"/>
    <path d="M0 252 H100 C116 256 122 270 128 282" stroke="#7A9A3A" stroke-width="5" fill="none" stroke-linecap="round" id="lg-grama"/>
    <path d="M332 363 C356 362 392 362 406 ${LAGO}" stroke="#6E8E36" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M132 290 C140 306 146 316 160 321 L300 362" stroke="#4A4A2A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    ${capim}
    <g>${[[176, 330, 4], [214, 340, 3.2], [262, 352, 3.6], [196, 336, 2.4]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#8A8496" stroke="#2E2420" stroke-width=".9"/>`).join('')}${folha(232, 345, 60, .22, '#C8642A', '#6A2A10')}${folha(160, 324, -50, .2, '#D8A02A', '#6A4A08')}</g>
    <g id="lg-tamia" class="toque"><path d="M18 252 C24 290 40 316 60 336" stroke="#9A7048" stroke-width="15" fill="none" stroke-linecap="round" opacity=".7"/><path d="M18 252 C24 290 40 316 60 336" stroke="#1E120A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M8 254 C10 246 26 246 30 254Z" fill="#7A5432" stroke="#3A2414" stroke-width="1.2"/><path d="M41 346 C42 330 58 324 74 324 C92 324 104 334 103 348 C102 358 90 363 72 363 C54 363 40 358 41 346Z" fill="#A07A50" opacity=".7"/><ellipse cx="72" cy="346" rx="30" ry="15" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.6"/><path d="M46 356 C58 361 86 361 98 355 C92 352 82 354 72 353 C62 353 52 352 46 356Z" fill="#C8A060"/><path d="M48 356 C60 360 84 360 96 356 M52 354 c6 -2 10 0 16 -1 M74 352 c6 1 12 -1 18 1" stroke="#E8C880" stroke-width="1.2" fill="none" stroke-linecap="round"/><g fill="#B8743A" stroke="#5A3414" stroke-width=".8">${[[88, 352], [92, 348], [84, 349], [95, 352]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.6"/><path d="M${x - 2} ${y - 2} q2 -1.6 4 0" stroke="#E8B070" stroke-width=".8" fill="none"/>`).join('')}</g><g id="lg-tamia-in" transform="translate(64 352)"><path d="M-12 -2 C-20 -8 -22 -16 -16 -20 C-14 -12 -10 -8 -6 -6Z" fill="#9A5E2E" stroke="#4A2810" stroke-width="1.2"/><ellipse cx="0" cy="-6" rx="11" ry="8" fill="#C07A40" stroke="#4A2810" stroke-width="1.4"/><path d="M-8 -11 C-2 -14 4 -14 8 -11 M-8 -7 C-2 -10 4 -10 8 -7" stroke="#2A1A0E" stroke-width="1.6" fill="none"/><path d="M-7 -9 C-2 -12 4 -12 7 -9" stroke="#F2E0C0" stroke-width="1.2" fill="none"/><ellipse cx="2" cy="-2" rx="6" ry="3" fill="#F2DCB8" opacity=".7"/><circle cx="9" cy="-12" r="6" fill="#C88446" stroke="#4A2810" stroke-width="1.4"/><circle cx="7" cy="-18" r="2.2" fill="#9A5E2E" stroke="#4A2810" stroke-width="1"/><path id="lg-tamia-dorme" d="M9 -13 q2 1.6 4 0" stroke="#12121A" stroke-width="1.4" fill="none" stroke-linecap="round" style="opacity:0"/><g id="lg-tamia-olho"><circle cx="11" cy="-13" r="2" fill="#12121A"/><circle cx="11.7" cy="-13.7" r=".7" fill="#fff"/></g><circle cx="15" cy="-11" r="1.4" fill="#2A1A0E"/><path d="M12 -15 l6 -2" stroke="#F2E0C0" stroke-width="1.2" stroke-linecap="round"/></g><text id="lg-tamia-z" x="80" y="336" font-family="Baloo 2, sans-serif" font-weight="800" font-size="12" fill="#FFF0C8" stroke="#2A1A0E" stroke-width="2.6" paint-order="stroke" style="opacity:0;transition:opacity 1s">z z</text><rect x="38" y="326" width="66" height="38" fill="transparent"/></g>
    <g id="lg-sapo-dorme" style="opacity:0;transition:opacity 1.4s"><path d="M226 371 C226 361 238 357 250 357 C264 357 275 362 275 371 C275 380 263 383 250 383 C236 383 226 379 226 371Z" fill="#9A7A52" opacity=".75"/><path d="M229 371 C229 363 239 360 250 360 C262 360 272 364 272 371 C272 378 262 380 250 380 C238 380 229 377 229 371Z" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.2"/><svg x="233" y="356" width="34" height="26" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg><text x="272" y="360" font-family="Baloo 2, sans-serif" font-weight="800" font-size="12" fill="#EEF4FF" stroke="#1E2A44" stroke-width="2.6" paint-order="stroke">z z</text></g>
    <g id="lg-tico" class="toque" data-fig="castor" transform="translate(240 344)"><g id="lg-tico-in"><svg x="-36" y="-60" width="72" height="60" viewBox="0 0 120 100"><use href="#f-castor"/></svg></g>${brilhoHotspot(24, -58)}</g>
    <g clip-path="url(#lgBaciaClip)"><g id="lg-agua" style="transform:translateY(90px);transition:transform 1.4s ease-in-out">
      <rect x="100" y="272" width="214" height="110" fill="url(#lgLagoa)" opacity=".88"/>
      <g opacity=".5">${[[150, 18], [210, 24], [270, 14]].map(([x, w]) => `<path d="M${x} 273 L${x + w} 273 L${x + w * 1.4 - 30} 382 L${x - 34} 382Z" fill="url(#lgRaio)"/>`).join('')}</g>
      <g id="lg-refl-o" style="transition:opacity 1.6s" opacity=".5">${reflexo(['#2E6A56', '#E2741C', '#EBA82A', '#2E6A72'])}</g>
      <g id="lg-refl-p" style="opacity:0;transition:opacity 1.6s"><g opacity=".5">${reflexo(['#2E6A56', '#44946E', '#62B04A', '#2E6A72'])}</g></g>
      <rect x="100" y="272" width="214" height="7" fill="url(#lgBrilhoAgua)"/>
      <path d="M100 272 H350" stroke="#E6F6FF" stroke-width="2.4"/><path d="M130 281 h40 M210 285 h30 M264 280 h24 M160 290 h18" stroke="#DFF2FF" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
      <g fill="#E6F6FF" opacity=".35">${Array.from({ length:10 }, () => `<circle cx="${P(R(110, 306))}" cy="${P(R(290, 370))}" r="${P(R(.6, 1.3))}"/>`).join('')}</g>
      <g id="lg-brejo" style="opacity:0;transition:opacity 1.4s">${[[210, 272, 9], [282, 273, 10], [298, 272, 7]].map(([x, y, r]) => `<path d="M${x} ${y} L${x + r} ${y - r * .1} A${r} ${r * .34} 0 1 1 ${x + r * .7} ${y + r * .26}Z" fill="url(#lgNinfeia)" stroke="#2A6A2A" stroke-width="1.2"/><path d="M${x} ${y} l${-r * .7} -1 M${x} ${y} l${-r * .3} 2.4 M${x} ${y} l${r * .3} 2.2" stroke="#2A6A2A" stroke-width=".6" opacity=".7"/><path d="M${x - r * .7} ${y - r * .18} q${r * .5} -2 ${r} -1" stroke="#C8F0A0" stroke-width="1" fill="none" stroke-linecap="round"/>`).join('')}<g transform="translate(298 269)"><path d="M0 0 C-4 -3 -4 -8 0 -10 C4 -8 4 -3 0 0Z" fill="#FFF6FA" stroke="#C2508A" stroke-width=".9"/><path d="M-5 0 C-6 -4 -3 -6 0 -4 C3 -6 6 -4 5 0Z" fill="#FFD2E4" stroke="#C2508A" stroke-width=".9"/><circle cx="0" cy="-2" r="1.6" fill="#FFD447"/></g></g>
      <g id="lg-sapos" class="toque" style="opacity:0;transition:opacity 1s">${[[210, 271], [282, 271]].map(([x, y], i) => `<g class="lg-sapo" data-i="${i}"><svg x="${x - 11}" y="${y - 16}" width="22" height="18" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg></g>`).join('')}<rect x="198" y="252" width="100" height="22" fill="transparent"/></g>
      <g id="lg-patos" class="toque" style="opacity:0;transition:opacity 1.2s"><g id="lg-patos-in" style="transition:transform 2.4s ease-out;transform:translate(-120px,-150px)"><g style="animation:flutua 3s ease-in-out infinite alternate"><g stroke="#E6F6FF" stroke-width="1" fill="none" opacity=".7"><ellipse cx="258" cy="273" rx="26" ry="3"/><ellipse cx="236" cy="275" rx="17" ry="2.2"/></g>${pato(256, 272, 1.1)}${pato(234, 274, .78)}</g></g><rect x="216" y="236" width="64" height="40" fill="transparent"/></g>
      <g id="lg-gelo-lagoa" style="opacity:0;transition:opacity 1.6s"><path d="M100 266 H314 V281 ${Array.from({ length:11 }, (_, i) => `q-10 ${i % 2 ? 2.4 : -1} -19.5 0`).join(' ')}Z" fill="url(#lgGelo)" fill-opacity=".95" stroke="#6AA6D6" stroke-width="1.2"/><ellipse cx="160" cy="274" rx="26" ry="3.6" fill="url(#lgGeloClaro)"/><ellipse cx="260" cy="275" rx="22" ry="3" fill="url(#lgGeloClaro)"/><g fill="#fff" stroke="#7EB2DA" stroke-width=".4">${[[150, 276], [158, 274], [168, 277], [252, 276], [262, 274], [270, 277], [200, 277], [120, 275]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry=".9"/>`).join('')}</g><path d="M130 272 l20 3 l14 -3 M220 271 l26 4 l8 -2" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M130 272 l20 3 l14 -3 M220 271 l26 4 l8 -2" stroke="#7AA8D2" stroke-width=".8" fill="none" transform="translate(0 1)"/><path d="M98 266 C120 262 140 264 160 263 C190 261 220 265 250 263 C280 262 300 264 316 266Z" fill="#fff" stroke="#BCD2EA" stroke-width=".8"/></g>
    </g></g>
    <g id="lg-casa" style="display:none"><g class="cresce">
      <path d="M118 282 C116 264 130 238 160 228 C190 238 206 290 204 336 L150 318 C136 308 126 296 118 282Z" fill="url(#lgDomo)" stroke="#2E1A0C" stroke-width="2.4"/>
      <g clip-path="url(#lgDomoClip)">
        <g fill="#4A2E18" opacity=".6">${Array.from({ length:10 }, () => `<ellipse cx="${P(R(126, 200))}" cy="${P(R(240, 330))}" rx="${P(R(6, 12))}" ry="${P(R(3, 6))}"/>`).join('')}</g>
        ${(() => { let sg = ''; for (let i = 0; i < 70; i++) { const x = R(118, 206), y = R(228, 338); const a = Math.atan2(y - 336, x - 162) + PI / 2 + R(-.5, .5), L = R(12, 26), w = R(1.6, 4), c = CORG[Math.floor(R(0, 6))]; sg += graveto(x - Math.cos(a) * L / 2, y - Math.sin(a) * L / 2, x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, w, c[0], c[1], R(0, 1) < .3); } return sg; })()}
        <g fill="#5A3A20" stroke="#2E1C0E" stroke-width=".7">${Array.from({ length:9 }, () => { const x = R(126, 200), y = R(250, 332); return `<path d="M${P(x - 6)} ${P(y + 2)} q2 -5 6 -4 q5 -1 6 4 q-6 2 -12 0Z"/>`; }).join('')}</g>
        <path d="M150 230 l-6 -6 M160 228 l2 -9 M170 231 l6 -6" stroke="#4A2810" stroke-width="2" stroke-linecap="round"/>
        <rect x="100" y="279" width="120" height="70" fill="#2A6EA6" opacity=".22"/>
        <path d="M110 279 H220" stroke="#E6F6FF" stroke-width="2"/>
      </g>
      <path d="M118 290 l-8 -4 M122 268 l-9 -2 M204 300 l9 -3 M200 276 l8 -5 M136 244 l-6 -6 M186 246 l6 -6" stroke="#5A3418" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M137 260 C136 248 146 240 160 240 C174 240 185 248 184 260 C184 265 174 266 160 266 C146 266 137 265 137 260Z" fill="#A07A50" opacity=".8"/>
      <path d="M140 260 C140 250 148 243 160 243 C172 243 181 250 181 260 C181 263 172 264 160 264 C148 264 140 263 140 260Z" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.4"/>
      <path d="M142 261 C150 264 172 264 179 261 M146 259 c4 -1.6 8 0 12 -1 M162 259 c5 1 9 -1 13 .6" stroke="#E2BE7A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M174 262 C182 280 188 304 194 330" stroke="#5A3A20" stroke-width="15" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M174 262 C182 280 188 304 194 330" stroke="#1E120A" stroke-width="11" fill="none" stroke-linecap="round"/>
      <g clip-path="url(#lgSubmerso)"><path d="M174 262 C182 280 188 304 194 330" stroke="#24384E" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#CFEFFF" opacity=".8"><circle cx="186" cy="300" r="1.4"/><circle cx="184" cy="292" r="1"/><circle cx="190" cy="314" r="1.2"/></g></g>
      <path d="M176 279 h10" stroke="#E6F6FF" stroke-width="1.6"/>
      <g id="lg-tico-casa" class="toque" data-fig="castor" style="display:none"><svg x="142" y="235" width="34" height="28" viewBox="0 0 120 100"><use href="#f-castor"/></svg><text x="176" y="244" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#FFF0C8" stroke="#2A1A0E" stroke-width="2.4" paint-order="stroke">z</text></g>
      <g id="lg-neve-casa" style="opacity:0;transition:opacity 1.6s"><path d="M123 262 C122 250 132 234 146 229 C152 224 168 223 176 229 C190 236 198 250 198 262 C196 266 192 263 191 259 C188 266 185 262 184 256 C178 246 170 240 160 240 C150 240 141 246 136 256 C135 262 131 266 129 260 C127 266 123 266 123 262Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M134 248 C142 238 152 234 160 234 C170 234 180 238 186 248" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/><path d="M137 256 C143 246 151 242 160 242 C169 242 177 246 183 256" stroke="#B8CEE8" stroke-width="1.2" fill="none"/><g fill="#E6F4FF" stroke="#9EC2E2" stroke-width=".6">${[[129, 262, 5], [191, 260, 6], [184, 257, 4]].map(([x, y, h]) => `<path d="M${x - 1.4} ${y} L${x} ${y + h} L${x + 1.4} ${y}Z"/>`).join('')}</g></g>
    </g></g>
    <g id="lg-estoque" style="opacity:0;transition:opacity 1.4s">${[[236, 334, -10, 0], [250, 330, 8, 1], [244, 340, 14, 2], [262, 344, -4, 4]].map(([x, y, r, ci]) => { const a = r * PI / 180, c = CORG[ci]; return graveto(x - Math.cos(a) * 16, y - Math.sin(a) * 16, x + Math.cos(a) * 16, y + Math.sin(a) * 16, 4.4, c[0], c[1], true) + `<path d="M${P(x + 6)} ${P(y - 2)} l5 -8" stroke="${c[1]}" stroke-width="1.6" stroke-linecap="round"/><path d="M${P(x + 11)} ${P(y - 10)} c3 -3 7 -1 5 2 c-2 1 -4 0 -5 -2Z" fill="#6A9A3A" stroke="#2E5A1A" stroke-width=".6"/>`; }).join('')}<path d="M226 348 C240 344 258 348 272 350" stroke="#3A2414" stroke-width="3" fill="none" opacity=".6"/></g>
    <g id="lg-dique">${[0, 1, 2, 3, 4].map(camada).join('')}</g>
    <g id="lg-taboas" style="display:none"><g class="cresce">${[[112, 268, 40], [104, 264, 30], [214, 274, 30], [292, 274, 40], [284, 276, 30]].map(([x, y, h], i) => `<g class="balanca" style="animation-delay:${(-i * .6).toFixed(1)}s"><path d="M${x - 1} ${y} C${x - 10} ${y - h * .3} ${x - 12} ${y - h * .6} ${x - 9} ${y - h * .85} C${x - 8} ${y - h * .55} ${x - 5} ${y - h * .3} ${x + 1} ${y}Z" fill="#5E8A2E" stroke="#2E4A14" stroke-width=".8"/><path d="M${x} ${y} C${x + 8} ${y - h * .3} ${x + 10} ${y - h * .5} ${x + 9} ${y - h * .75} C${x + 6} ${y - h * .5} ${x + 3} ${y - h * .3} ${x + 1.4} ${y}Z" fill="#7AAA3E" stroke="#2E4A14" stroke-width=".8"/><path d="M${x} ${y} q-2 -${h / 2} 1 -${h}" stroke="#2E4A14" stroke-width="3.2" fill="none"/><path d="M${x} ${y} q-2 -${h / 2} 1 -${h}" stroke="#6A9A3A" stroke-width="1.8" fill="none"/><rect x="${x - 3}" y="${y - h * .8}" width="6" height="${h * .28}" rx="3" fill="url(#lgTaboa)" stroke="#2E1A0A" stroke-width="1"/><path d="M${x - 1.4} ${y - h * .76} v${h * .2}" stroke="#B8844A" stroke-width="1" stroke-linecap="round" opacity=".8"/></g>`).join('')}</g></g>
    <g id="lg-neve-chao" style="opacity:0;transition:opacity 2s;pointer-events:none">${neveChao}<path d="M278 282 C282 272 292 270 300 271 C308 268 318 270 324 274 C330 276 332 282 330 284 C324 280 316 279 304 280 C294 280 286 281 278 282Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1" id="lg-neve-dique" style="opacity:0"/></g>
    <g id="lg-flores" style="opacity:0;transition:opacity 2s;pointer-events:none">${[[14, 250], [40, 251], [92, 250], [336, 362], [362, 362], [64, 249]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 v-8" stroke="#3E7A2A" stroke-width="1.4"/><path d="M0 -3 q-4 -1 -5 -4 q3 0 5 3" fill="#5EA03A"/><path d="M0 -8 l-4 -4 l4 -1 l4 1Z M0 -8 l-3 3 M0 -8 l3 3" fill="#FFFFFF" stroke="#B8A8C8" stroke-width=".8"/><circle cx="0" cy="-10" r="1.4" fill="#FFD447"/></g>`).join('')}</g>
    <g id="lg-degelo" style="opacity:0;transition:opacity 1.4s;pointer-events:none"><path class="lg-fio" d="M30 196 C40 212 50 226 70 236 C90 244 100 250 114 266" stroke="#4A9AF2" stroke-width="3.4" fill="none" stroke-linecap="round"/><path class="lg-fio" d="M520 254 C524 266 532 276 536 292" stroke="#4A9AF2" stroke-width="3" fill="none" stroke-linecap="round"/><path class="lg-fio" d="M664 254 C660 266 668 280 662 292" stroke="#4A9AF2" stroke-width="3" fill="none" stroke-linecap="round"/><g class="lg-fluxo" stroke="#E6F6FF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="5 9"><path d="M30 196 C40 212 50 226 70 236 C90 244 100 250 114 266"/><path d="M520 254 C524 266 532 276 536 292"/><path d="M664 254 C660 266 668 280 662 292"/></g></g>
    <g id="lg-galhos">${GALHOS.map((g, i) => `<g class="lg-galho toque" data-i="${i}" transform="translate(${g.x} ${g.y})" style="cursor:grab"><g transform="rotate(${g.r})"><ellipse cx="0" cy="6" rx="26" ry="3" fill="#1E120A" opacity=".2"/>${galhoDes(i)}</g><circle r="32" fill="transparent"/></g>`).join('')}</g>
    <g id="lg-alvo" style="opacity:.0"><ellipse cx="${DAM.x}" cy="${DAM.y + 18}" rx="40" ry="16" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 7"/></g>
    <g id="lg-mao" pointer-events="none"><path d="M206 312 C226 262 270 258 300 296" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M304 300 l-14 -2 l7 -10Z" fill="#fff"/></g>
    <g id="lg-ramo" class="toque"><path d="M-20 30 C40 36 90 52 140 42 C170 36 190 44 210 58" stroke="#2E1C10" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-20 30 C40 36 90 52 140 42 C170 36 190 44 210 58" stroke="#6E4A30" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-20 27 C40 33 90 49 140 39 C160 35 176 37 190 44" stroke="#A07A58" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M10 36 l8 1 M48 41 l9 2 M100 47 l8 -1 M160 42 l7 2" stroke="#2E1C10" stroke-width="1.2" stroke-linecap="round" opacity=".6"/><path d="M70 44 C80 60 84 70 82 80 M150 42 C160 30 170 24 182 22 M112 46 C116 52 116 56 112 60" stroke="#2E1C10" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M70 44 C80 60 84 70 82 80 M150 42 C160 30 170 24 182 22 M112 46 C116 52 116 56 112 60" stroke="#6E4A30" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g id="lg-ramo-o" style="transition:opacity 2s">${[[30, 46, '#E2452A', '#7A1A0A'], [58, 58, '#F08A2A', '#8A400A'], [84, 84, '#D2302A', '#6A100A'], [112, 60, '#F2B83A', '#8A600A'], [182, 22, '#E8602A', '#7E2A0E'], [208, 64, '#F2C83A', '#8A6A0A'], [140, 58, '#E2452A', '#7A1A0A']].map(([x, y, c, e], i) => folha(x, y, (i * 47) % 360, 1, c, e)).join('')}</g>
      <g id="lg-ramo-p" style="opacity:0;transition:opacity 2s">${[[30, 46], [58, 58], [84, 84], [112, 60], [182, 22], [208, 64], [140, 58]].map(([x, y], i) => folha(x, y, (i * 47) % 360, .8, i % 2 ? '#7CC85A' : '#9AD86A', '#2E6A22')).join('')}</g>
      <path id="lg-ramo-n" d="M-20 24 C40 30 90 46 140 36 C170 30 190 38 210 52" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" style="opacity:0;transition:opacity 2s"/></g>
    <g pointer-events="none">${[[790, 500, 70, -8], [772, 500, 50, 10], [356, 500, 40, -6]].map(([x, y, h, l], i) => `<g class="balanca" style="animation-delay:${(-i * .8).toFixed(1)}s"><path d="M${x - 4} ${y} C${x - 4 - l * .2} ${y - h * .4} ${x + l * .6 - 2} ${y - h * .75} ${x + l} ${y - h} C${x + l * .6 + 2} ${y - h * .7} ${x + 4 - l * .2} ${y - h * .35} ${x + 4} ${y}Z" fill="#2E6A3A" stroke="#123A1E" stroke-width="1.2"/><path d="M${x} ${y} C${x - l * .1} ${y - h * .4} ${x + l * .5} ${y - h * .74} ${x + l * .9} ${y - h + 2}" stroke="#7AC86A" stroke-width="1" fill="none" opacity=".7"/></g>`).join('')}</g>
    <rect width="800" height="500" fill="url(#lgVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#lgGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#lg-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  el(s, '#lg-riacho-flux').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:1100, iterations:Infinity });
  s.querySelectorAll('#lg-raios path').forEach((r, i) => r.animate([{ opacity:.25 }, { opacity:.6 }, { opacity:.25 }], { duration:4200 + i * 900, iterations:Infinity }));
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.6, 1.4), r:sorte(2, 4.5), topo:(fase === 'inverno' || fase === 'peixes') ? 382 : LAGO + 2, f:sorte(0, 6) }); };
  const show = (sel, v) => { el(s, sel).style.opacity = v; };
  /* ---------- Tico ---------- */
  const tico = el(s, '#lg-tico'); let ticoX = 240, ticoY = 344;
  const poeTico = () => tico.setAttribute('transform', `translate(${ticoX.toFixed(1)} ${ticoY.toFixed(1)})`);
  const ticoNada = () => { const alvo = Math.min(chao(ticoX), nivel + 26); const y0 = ticoY; tween(1400, e => { ticoY = y0 + (alvo - y0) * e; poeTico(); }); };
  const ticoVai = (x1, y1, ms, fim) => { const x0 = ticoX, y0 = ticoY; tween(ms, e => { ticoX = x0 + (x1 - x0) * e; ticoY = y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 24; poeTico(); }, fim); };
  const roer = () => el(s, '#lg-tico-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:600 });
  /* ---------- 1. represa: arrastar os galhos até o dique ---------- */
  const gs = [...s.querySelectorAll('.lg-galho')], pos = GALHOS.map(g => ({ x:g.x, y:g.y, foi:false, base:g.y }));
  const poe = i => gs[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  gs.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'represa' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; el(s, '#lg-alvo').style.opacity = .8; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(40, Math.min(480, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; gs[i].style.cursor = 'grab'; el(s, '#lg-alvo').style.opacity = 0;
    if (!moveu || Math.hypot(pos[i].x - DAM.x, pos[i].y - DAM.y) < 95) colocar(i); else voltar(i);
  });
  function anima(i, x1, y1, ms, esc, fim){
    const x0 = pos[i].x, y0 = pos[i].y; ocupado = true;
    tween(ms, (e, k) => { pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50; gs[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${(1 + (esc - 1) * e).toFixed(2)})`); }, () => { ocupado = false; fim && fim(); });
  }
  function voltar(i){ const g = GALHOS[i]; anima(i, g.x, Math.min(g.y, nivel - 3), 700, 1); toca('glub'); api.diz('Leve o galho até a represa, no fim da lagoa!'); }
  function colocar(i){
    pos[i].foi = true;
    const yAlvo = 354 - galhos * 17.6;
    anima(i, 316 - galhos * 3, yAlvo, 900, .7, () => {
      gs[i].style.display = 'none';
      const cam = s.querySelector(`.lg-dique[data-k="${galhos}"]`); cam.style.display = '';
      galhos++; toca('planta'); roer(); c.brilhos(DAM.x, yAlvo - 6, 6, '#FFE27A');
      for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:DAM.x - 40 + sorte(-10, 10), y:NIVEIS[galhos], t:k * 2, cor:'#BFE6FF' });
      nivel = NIVEIS[galhos]; el(s, '#lg-agua').style.transform = `translateY(${nivel - 272}px)`; toca('splash');
      depois(500, ticoNada);
      api.hud(`<span class="chip">Galhos na represa: ${galhos}/5</span>`);
      const falas = ['Isso! A represa segura a água, e ela começa a subir.', 'Eu prendo os galhos com lama. Meus dentes cortam madeira!', 'Olha a lagoa crescendo atrás da represa!', 'Só falta um galho!'];
      if (galhos < 5) api.diz(falas[galhos - 1]); else represaPronta();
    });
  }
  /* galhos no fundo da lagoa boiam quando a água sobe */
  (function boia(){ if (!vivo) return; pos.forEach((p, i) => { if (p.foi || (arr && arr.i === i) || ocupado) return; const by = GALHOS[i].x > 140 && GALHOS[i].x < 300 ? Math.min(GALHOS[i].y, nivel - 2) : GALHOS[i].y; if (Math.abs(p.y - by) > .3) { p.y += (by - p.y) * .05; poe(i); } }); requestAnimationFrame(boia); })();
  function represaPronta(){
    fase = 'brejo'; toca('vitoria'); el(s, '#lg-riacho-flux').style.opacity = .35;
    api.diz('Pronto! A represa fez uma lagoa. Agora eu construo a minha casa!');
    depois(1400, () => { el(s, '#lg-casa').style.display = ''; toca('planta'); c.brilhos(160, 262, 8, '#FFE27A'); ticoVai(304, 280, 1200); });
    depois(3200, () => { el(s, '#lg-taboas').style.display = ''; show('#lg-brejo', 1); show('#lg-sapos', 1); toca('pop'); });
    depois(4200, () => { show('#lg-patos', 1); el(s, '#lg-patos-in').style.transform = 'translate(0,0)'; [520, 470].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sawtooth', .04, f * .7), i * 220)); });
    depois(4600, () => { api.diz('Virou um brejo cheio de vida: sapos, patos e até o alce veio beber! O brejo guarda a água como uma esponja e deixa a água mais limpa.'); alceBebe(); });
    depois(10500, comecaInverno);
  }
  let alceX = 0, alceOcupado = false;
  function alceBebe(){
    if (alceOcupado) return; alceOcupado = true; const x0 = alceX, x1 = fase === 'represa' ? alceX : 34;
    tween(1600, e => { alceX = x0 + (x1 - x0) * e; el(s, '#lg-alce-pos').setAttribute('transform', `translate(${alceX.toFixed(1)} ${(Math.abs(Math.sin(e * 12)) * -1.5).toFixed(1)})`); }, () => {
      const a = el(s, '#lg-alce-in'); a.style.transform = 'rotate(12deg)';
      depois(600, () => { toca('glub'); for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:118 + sorte(-6, 6), y:Math.min(nivel, 300), t:k * 3, cor:'#BFE6FF' }); });
      depois(2000, () => { a.style.transform = ''; alceOcupado = false; });
    });
  }
  /* ---------- 2. inverno: tocar na nuvem de neve ---------- */
  function comecaInverno(){
    fase = 'inverno'; show('#lg-nuvem-clara', 0); show('#lg-nuvem-neve', 1); el(s, '#lg-nuvem-hint').style.display = ''; el(s, '#lg-sol').style.opacity = .45;
    api.hud('<span class="chip">Inverno: 0/3</span>');
    api.diz('O inverno está chegando! Toque na nuvem de neve.');
  }
  const neva = () => { for (let i = 0; i < 70; i++) depois(i * 30, () => c.add({ tipo:'floco', x:sorte(0, 800), y:sorte(100, 130), vy:sorte(1.2, 2.4), f:sorte(0, 6), r:sorte(1.6, 3.4), chao:sorte(250, 480) })); };
  el(s, '#lg-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'inverno') { toca('pop'); api.diz(fase === 'represa' || fase === 'brejo' ? 'É outono. Logo vai esfriar, e por isso eu preciso terminar a represa.' : 'Essa nuvem trouxe muita neve.'); return; }
    if (ocupado) return; ocupado = true; neves++; toca('vapor'); neva();
    el(s, '#lg-nuvem-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.08)' }, { transform:'scale(1)' }], { duration:500 });
    api.hud(`<span class="chip">Inverno: ${neves}/3</span>`);
    if (neves === 1) depois(900, () => {
      show('#lg-ceu-i', 1); show('#lg-outono', 0); el(s, '#lg-outono').style.pointerEvents = 'none'; show('#lg-meio-o', 0); show('#lg-neve-chao', 1); show('#lg-neve-margem', .85); show('#lg-neve-arv', 1); show('#lg-neve-longe', 1); show('#lg-ramo-o', 0); show('#lg-ramo-n', 1); show('#lg-refl-o', 0); s.querySelectorAll('.lg-filete').forEach(f => f.style.opacity = 0);
      show('#lg-patos', 0); show('#lg-sapos', 0); show('#lg-brejo', .5); vooMobelha(false); show('#lg-tamia-z', 1); show('#lg-tamia-dorme', 1); show('#lg-tamia-olho', 0);
      api.diz('Neve! As árvores perderam as folhas, e a mobelha e os patos voaram para lugares mais quentes.');
      depois(1400, () => ocupado = false);
    });
    if (neves === 2) depois(900, () => {
      show('#lg-sup-gelo', .6); el(s, '#lg-laje').style.transform = 'scaleY(.45)'; show('#lg-gelo-lagoa', 1); el(s, '#lg-neve-dique').style.opacity = 1; show('#lg-neve-casa', 1); toca('clique');
      el(s, '#lg-riacho-flux').style.opacity = 0; el(s, '#lg-riacho-chao').setAttribute('stroke', '#A8D4F2');
      api.diz('Brrr! A água do lago começa a congelar por cima.');
      depois(1400, () => ocupado = false);
    });
    if (neves === 3) depois(900, () => {
      show('#lg-sup-gelo', 1); el(s, '#lg-laje').style.transform = 'scaleY(1)'; toca('ok'); c.brilhos(600, 368, 8, '#FFFFFF');
      tico.style.display = 'none'; el(s, '#lg-tico-casa').style.display = ''; show('#lg-estoque', 1); show('#lg-sapo-dorme', 1);
      el(s, '#lg-nuvem-hint').style.display = 'none';
      api.diz('O gelo flutua! Ele fica por cima, como um cobertor, e a água lá embaixo não congela.');
      depois(5200, comecaPeixes);
    });
  });
  function comecaPeixes(){
    fase = 'peixes'; ocupado = false; s.querySelectorAll('.lg-phint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Peixes: 0/3</span>');
    api.diz('Os peixes continuam nadando debaixo do gelo! Toque nos peixes.');
  }
  const FALA_PEIXE = { truta:'A truta gosta de água bem fria e limpinha.', perca:'As percas nadam em grupo, mesmo no inverno.', esturjao:'O esturjão vive no fundo do lago. Ele é de uma família de peixes do tempo dos dinossauros!' };
  s.querySelectorAll('.lg-peixe').forEach(g => g.addEventListener('click', () => {
    const p = g.dataset.p, r = g.getBoundingClientRect(), sv = s.getBoundingClientRect(), x = (r.left + r.width / 2 - sv.left) / sv.width * 800, y = (r.top + r.height / 2 - sv.top) / sv.height * 500;
    toca('glub'); bolhas(x, y, 5);
    el(g, '.lg-pin').animate([{ transform:'translateX(0)' }, { transform:'translateX(-6px)' }, { transform:'translateX(6px)' }, { transform:'translateX(0)' }], { duration:500 });
    if (fase !== 'peixes' || g.dataset.feito) { api.diz(FALA_PEIXE[p]); return; }
    g.dataset.feito = 1; el(g, '.lg-phint').style.display = 'none'; peixes++;
    api.hud(`<span class="chip">Peixes: ${peixes}/3</span>`); c.brilhos(x, y, 5, '#BFE6FF');
    api.diz(FALA_PEIXE[p]);
    if (peixes === 3) { toca('vitoria'); depois(3800, () => { api.diz('Eu também passo o inverno quentinho na minha casa, comendo os galhos que guardei debaixo da água.'); }); depois(8200, comecaPrimavera); }
  }));
  /* ---------- 3. primavera: tocar no sol ---------- */
  function comecaPrimavera(){
    fase = 'primavera'; el(s, '#lg-sol').style.opacity = 1; el(s, '#lg-sol-hint').style.display = '';
    api.hud('<span class="chip">Sol da primavera: 0/3</span>');
    api.diz('Agora toque no sol para a primavera chegar!');
  }
  el(s, '#lg-sol').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'primavera') { toca('ok'); c.brilhos(612, 74, 6, '#FFE27A'); api.diz(fase === 'inverno' || fase === 'peixes' ? 'No inverno o sol fica baixinho e esquenta pouco.' : 'O sol de outono já está mais fraquinho.'); return; }
    if (ocupado || sois >= 3) return; ocupado = true; sois++; toca('vapor');
    el(s, '#lg-sol-in').style.transform = `scale(${(1 + sois * .12).toFixed(2)})`;
    for (let i = 0; i < 14; i++) c.add({ tipo:'vapor', x0:sorte(380, 780), y0:300 + sorte(0, 40), x1:612 + sorte(-60, 60), y1:130 + sorte(-10, 20), dur:sorte(70, 110), f:sorte(0, 6), r:sorte(2.4, 4.6), x:0, y:0 });
    api.hud(`<span class="chip">Sol da primavera: ${sois}/3</span>`);
    if (sois === 1) depois(900, () => {
      show('#lg-nuvem-clara', 1); show('#lg-nuvem-neve', 0);
      show('#lg-ceu-i', 0); show('#lg-ceu-p', 1); show('#lg-neve-chao', 0); show('#lg-neve-margem', 0); show('#lg-neve-arv', 0); show('#lg-neve-longe', 0); show('#lg-ramo-n', 0); show('#lg-neve-casa', 0);
      show('#lg-sup-gelo', 0); el(s, '#lg-laje').style.transform = 'scaleY(0)'; show('#lg-placas', 1); show('#lg-gelo-lagoa', 0); s.querySelectorAll('.lg-filete').forEach(f => f.style.opacity = '');
      show('#lg-degelo', 1); s.querySelectorAll('#lg-degelo .lg-fluxo path').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-28 }], { duration:900, iterations:Infinity }));
      el(s, '#lg-riacho-chao').setAttribute('stroke', '#4A9AD8'); el(s, '#lg-riacho-flux').style.opacity = .6;
      for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:sorte(400, 780), y:sorte(300, 350), t:k, cor:'#E6F6FF' });
      api.diz('O gelo e a neve estão derretendo! A água da neve desce em riachos até o lago.');
      depois(1400, () => ocupado = false);
    });
    if (sois === 2) depois(900, () => {
      show('#lg-placas', 0); show('#lg-prima', 1); show('#lg-meio-p', 1); show('#lg-margem-p', 1); show('#lg-ramo-p', 1); show('#lg-flores', 1); show('#lg-refl-p', 1);
      show('#lg-sapo-dorme', 0); show('#lg-sapos', 1); show('#lg-tamia-z', 0); show('#lg-tamia-dorme', 0); show('#lg-tamia-olho', 1); show('#lg-brejo', 1); show('#lg-estoque', 0); show('#lg-patos', 1);
      el(s, '#lg-tico-casa').style.display = 'none'; tico.style.display = ''; toca('planta'); c.brilhos(304, 250, 6, '#B8E88A');
      api.diz('O lago e a lagoa ficaram cheios com a água da neve. Tudo ficou verde!');
      depois(1400, () => ocupado = false);
    });
    if (sois === 3) depois(900, () => {
      el(s, '#lg-sol-hint').style.display = 'none'; show('#lg-degelo', .5);
      vooMobelha(true);
      api.diz('Olha quem voltou: a mobelha! Escute o canto dela.');
      depois(3600, () => { cantoMobelha(); });
      depois(6800, () => { fase = 'fim'; toca('vitoria'); api.diz('Os Grandes Lagos guardam muita água doce: mais ou menos um quinto de toda a água doce dos lagos e rios do planeta! E os brejos, como a lagoa do castor, seguram e limpam a água.'); depois(6400, api.fim); });
    });
  });
  /* ---------- mobelha ---------- */
  const mobPos = el(s, '#lg-mob-pos');
  function vooMobelha(volta){
    const a = volta ? { x:320, y:-260 } : { x:0, y:0 }, b = volta ? { x:0, y:0 } : { x:300, y:-280 };
    if (volta) mobPos.style.opacity = 1;
    tween(2600, e => { const x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e; mobPos.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); }, () => { if (!volta) mobPos.style.opacity = 0; else { toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:560 + k * 10, y:340, t:k * 2, cor:'#E6F6FF' }); } });
  }
  function cantoMobelha(){ [[420, 640], [640, 560], [560, 760], [760, 520]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .55, 'sine', .07, f2), i * 480)); }
  el(s, '#lg-mobelha').addEventListener('click', () => { cantoMobelha(); for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:570 + k * 8, y:342, t:k * 3, cor:'#E6F6FF' }); api.diz('É a mobelha! O canto dela parece um uivo e se ouve longe no lago. Ela mergulha fundo para pegar peixes.'); });
  /* ---------- toques extras ---------- */
  el(s, '#lg-farol').addEventListener('click', e => { e.stopPropagation(); toca('clique'); [196, 196].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .5, 'triangle', .06, f * .95), i * 650)); el(s, '#lg-facho').animate([{ opacity:.35 }, { opacity:1 }, { opacity:.2 }, { opacity:1 }, { opacity:.35 }], { duration:1800 }); api.diz('Um farol! Os Grandes Lagos são tão grandes que têm ondas e navios, como o mar. Mas a água deles é doce.'); });
  s.querySelectorAll('.lg-bordo').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); const x = +g.dataset.x, y = +g.dataset.y; toca('pop'); for (let i = 0; i < 10; i++) depois(i * 90, () => c.add({ tipo:'petala', x:x + sorte(-30, 30), y:y + sorte(-10, 20), vy:sorte(1, 1.8), f:sorte(0, 6), chao:sorte(250, 340), cor:['#E2452A', '#F08A2A', '#F2C83A'][i % 3], borda:'#7A2A10' })); api.diz('Folhas de bordo! No outono elas ficam vermelhas, laranjas e amarelas antes de cair.'); }));
  el(s, '#lg-ramo').addEventListener('click', e => { e.stopPropagation(); toca('pop'); if (fase === 'inverno' || fase === 'peixes') { for (let i = 0; i < 8; i++) c.add({ tipo:'floco', x:sorte(0, 200), y:sorte(40, 70), vy:sorte(1.4, 2.2), f:sorte(0, 6), r:2.4, chao:sorte(200, 330) }); return; } for (let i = 0; i < 6; i++) c.add({ tipo:'petala', x:sorte(20, 200), y:sorte(40, 80), vy:sorte(1, 1.8), f:sorte(0, 6), chao:sorte(230, 330), cor:fase === 'primavera' || fase === 'fim' ? '#8ACB5A' : ['#E2452A', '#F08A2A', '#F2C83A'][i % 3], borda:fase === 'primavera' || fase === 'fim' ? '#2E6A22' : '#7A2A10' }); });
  el(s, '#lg-alce').addEventListener('click', () => { [110, 90].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .6, 'sawtooth', .05, f * .8), i * 500)); if (fase === 'represa') { el(s, '#lg-alce-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-6deg)' }, { transform:'rotate(0)' }], { duration:700 }); api.diz('O alce é o maior bicho da família dos veados. Ele adora comer plantas de brejo!'); return; } alceBebe(); api.diz('O alce adora plantas de brejo e sabe nadar muito bem!'); });
  el(s, '#lg-patos').addEventListener('click', e => { e.stopPropagation(); [560, 520, 560].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'sawtooth', .04, f * .7), i * 170)); el(s, '#lg-patos-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(0,-6px)' }, { transform:'translate(0,0)' }], { duration:500 }); });
  s.querySelectorAll('.lg-sapo').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); [300, 240].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'square', .04, f * .6), i * 160)); g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-14px)' }, { transform:'translateY(0)' }], { duration:500, easing:'ease-out' }); api.diz('Croac! Os sapos colocam os ovos na água parada da lagoa.'); }));
  el(s, '#lg-tamia').addEventListener('click', e => { e.stopPropagation(); [1800, 2000, 1800].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .06, 'square', .03, f), i * 110)); const frio = fase === 'inverno' || fase === 'peixes'; if (!frio) el(s, '#lg-tamia-in').animate([{ transform:'translate(64px,352px)' }, { transform:'translate(64px,346px)' }, { transform:'translate(64px,352px)' }], { duration:400, iterations:2 }); api.diz(frio ? 'A tâmia dorme na toca no inverno e guarda sementes para comer quando acordar.' : 'É uma tâmia! Ela guarda sementes na toca, debaixo da terra.'); });
  el(s, '#lg-sapo-dorme').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Psiu! O sapo passa o inverno dormindo na lama do fundo da lagoa.'); });
  tico.addEventListener('click', () => { roer(); toca('pop'); if (fase === 'represa') api.diz('Eu sou o Tico! Arraste os galhos até a represa.'); else api.diz('Castores constroem represas, e a água parada vira um brejo cheio de vida.'); });
  el(s, '#lg-tico-casa').addEventListener('click', () => api.diz('Psiu, estou na minha casa! A entrada fica debaixo da água, para ninguém entrar.'));
  /* peixe pula quando toca na água do lago */
  let pulando = false;
  el(s, '#lg-sup').addEventListener('click', e => {
    const p = c.ponto(e);
    if (fase === 'inverno' || fase === 'peixes') { toca('clique'); c.brilhos(p.x, p.y, 3, '#FFFFFF'); api.diz('O gelo está duro! Os peixes estão lá embaixo, na água.'); return; }
    if (pulando) return; pulando = true; toca('splash');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = `<svg x="-22" y="-12" width="44" height="24" viewBox="0 0 130 70"><use href="#f-truta"/></svg>`; el(s, '#lg-galhos').before(g);
    const x0 = p.x - 30, x1 = p.x + 30, yb = Math.max(p.y, 310);
    for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:x0, y:yb, t:k * 2, cor:'#E6F6FF' });
    tween(1000, (e2, k) => { const x = x0 + (x1 - x0) * k, y = yb - Math.sin(k * Math.PI) * 60, a = -50 + k * 100; g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})`); }, () => { g.remove(); toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:x1, y:yb, t:k * 2, cor:'#E6F6FF' }); pulando = false; });
  });
  el(s, '#lg-fundo-toque').addEventListener('click', e => { const p = c.ponto(e); toca('glub'); bolhas(p.x, p.y, 4); });
  /* cardume de peixinhos no lago (canvas) */
  const cardume = Array.from({ length:12 }, (_, i) => ({ x:620 + sorte(-60, 60), y:420 + sorte(-20, 20), vx:sorte(-1, 1), vy:0, f:sorte(0, 6) }));
  c.desenho(ctx => {
    const t = performance.now() / 1000, frio = fase === 'inverno' || fase === 'peixes';
    const ax = 600 + Math.cos(t * (frio ? .18 : .32)) * 150, ay = 420 + Math.sin(t * .5) * 22;
    cardume.forEach((p, i) => {
      const ox = Math.cos(i * 2.4) * (12 + i % 4 * 6), oy = Math.sin(i * 2.4) * (6 + i % 4 * 3);
      p.vx += (ax + ox - p.x) * .003 + Math.sin(t * 3 + p.f) * .03; p.vy += (ay + oy - p.y) * .003;
      const sp = Math.hypot(p.vx, p.vy), max = frio ? .7 : 1.3; if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.vx *= .975; p.vy *= .975; p.x = Math.max(430, Math.min(790, p.x + p.vx)); p.y = Math.max(386, Math.min(462, p.y + p.vy));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx || .01)); ctx.globalAlpha = .9;
      ctx.fillStyle = i % 4 === 0 ? '#E6EEF8' : '#B8CCE0'; ctx.strokeStyle = '#2A4A7A'; ctx.lineWidth = 1;
      const ab = Math.sin(t * 12 + p.f) * 1.6;
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, -3 + ab); ctx.lineTo(-10, 3 + ab); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 6.5, 2.8, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0E1A2A'; ctx.beginPath(); ctx.arc(3.6, -.5, .9, 0, 7); ctx.fill(); ctx.restore();
    });
  });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1600) { ultB = t; bolhas(sorte(500, 780), 470, 1); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Galhos na represa: 0/5</span>');
  api.diz('Oi, eu sou o Tico, um castor dos Grandes Lagos! Vou fazer uma represa no riacho. Arraste os galhos até a represa.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
