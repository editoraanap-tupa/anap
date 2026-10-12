/* ================= JOGO 15: Poços de degraus, guardar a monção (Índia) ================= */
function jogoBaoli(palco, api){
  semente = 131;
  let vivo = true, fase = 'vento', zw = 6.88, alvoZw = 6.88, taxa = 1, chovendo = 0, ultQ = performance.now(), nuvensOk = 0, blocos = 0, andares = 0, anda = false, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k), k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const F = n => n.toFixed(1);
  /* o poço: meia pirâmide invertida de degraus, cortada na frente. x = lado, d = fundo (0 frente, 1 trás), z = andares para baixo */
  const NV = 7, ZW_SECA = 5.5, W = k => 200 - k * 22, D = k => 1 - k * .1;
  const P = (x, d, z) => { const sc = 1 - .17 * d; return [400 + x * sc, 292 - 66 * d + z * 28 * sc]; };
  const linha = a => 'M' + a.map(p => F(p[0]) + ' ' + F(p[1])).join(' L');
  const poli = a => linha(a) + 'Z';
  const espelho = a => a.map(([x, y]) => [800 - x, y]);
  /* ---------- paredes e escadas ---------- */
  let paredes = '';
  for (let k = 0; k < NV; k++) {
    const w = W(k), d = D(k), u = 30, m = Math.floor(2 * w / u), off = -m * u / 2 + (k % 2 ? u / 2 : 0);
    const fundoP = poli([P(-w, d, k), P(w, d, k), P(w, d, k + 1), P(-w, d, k + 1)]);
    paredes += `<path d="${fundoP}" fill="url(#baRi)"/><path d="${fundoP}" fill="url(#baBloco)"/><path d="${fundoP}" fill="#2A1206" opacity="${(.03 + k * .035).toFixed(3)}" stroke="#7A4A2A" stroke-width=".8"/>`;
    let luz = '', som = '', deg = '', ar = '';
    for (let j = 0; j < m - (k % 2 ? 1 : 0); j++) {
      const x0 = off + j * u, cx = x0 + u / 2, pl = 2.2, ta = P(cx - pl, d, k + .2), tb = P(cx + pl, d, k + .2), e = P(x0 + .6, d, k + 1), dd = P(x0 + u - .6, d, k + 1), mid = P(cx, d, k + 1), mt = P(cx, d, k + .2);
      luz += poli([ta, mt, mid, e]) + ' '; som += poli([mt, tb, dd, mid]) + ' ';
      ar += `M${F(e[0])} ${F(e[1])} L${F(ta[0])} ${F(ta[1])} L${F(tb[0])} ${F(tb[1])} L${F(dd[0])} ${F(dd[1])} `;
      for (const q of [.14, .26, .38, .5, .62, .74, .86]) { const h = pl + (u / 2 - .6 - pl) * q, l = P(cx - h, d, k + .2 + .8 * q), r = P(cx + h, d, k + .2 + .8 * q); deg += `M${F(l[0])} ${F(l[1])} L${F(r[0])} ${F(r[1])} `; }
    }
    paredes += `<path d="${som}" fill="#9A5E36"/><path d="${luz}" fill="#FBE0B0"/><path d="${deg}" stroke="#6E3A1A" stroke-width=".8" opacity=".75"/><path d="${ar}" stroke="#5E3018" stroke-width="1" fill="none" stroke-linejoin="round"/>`;
    paredes += `<path d="${poli([P(-w, d, k), P(w, d, k), P(w, d, k + .22), P(-w, d, k + .22)])}" fill="#3A1A08" opacity=".3"/><path d="${linha([P(-w, d, k + .5), P(w, d, k + .5)])}" stroke="#FFE6BC" stroke-width=".7" opacity=".35" stroke-dasharray="1 2"/>`;
    for (const sx of [-1, 1]) {
      const lado = poli([P(sx * w, 0, k), P(sx * w, d, k), P(sx * w, d, k + 1), P(sx * w, 0, k + 1)]);
      paredes += `<path d="${lado}" fill="url(#${sx < 0 ? 'baSl' : 'baSr'})"/><path d="${lado}" fill="url(#baBloco)"/><path d="${lado}" fill="url(#baFundo)" stroke="#6E4224" stroke-width=".8"/><path d="${poli([P(sx * w, 0, k), P(sx * w, d, k), P(sx * w, d, k + .2), P(sx * w, 0, k + .2)])}" fill="#3A1A08" opacity=".26"/>`;
      const a = k % 2 ? .12 : d - .12, b = k % 2 ? d - .12 : .12, n = 7, esc = [P(sx * w, a, k)];
      for (let q = 0; q < n; q++) { const dn = a + (b - a) * (q + 1) / n; esc.push(P(sx * w, dn, k + q / n), P(sx * w, dn, k + (q + 1) / n)); }
      esc.push(P(sx * w, a, k + 1.7 / n));
      paredes += `<path d="${poli(esc)}" fill="${sx < 0 ? '#FCE6BC' : '#E8BE86'}" stroke="#5E3018" stroke-width=".9" stroke-linejoin="round"/>`;
      { let st = ''; for (let q = 1; q < n; q++) { const dn = a + (b - a) * q / n, t1 = P(sx * w, dn, k + q / n), t2 = P(sx * w, dn - (b - a) / n * .9, k + q / n); st += `M${F(t1[0])} ${F(t1[1])} L${F(t2[0])} ${F(t2[1])} `; } paredes += `<path d="${st}" stroke="#FFF6E0" stroke-width="1" opacity=".75"/>`; }
      paredes += `<path d="${linha([P(sx * w, b, k + 1), P(sx * w, a, k + 1.7 / n)])}" stroke="#6E3A1A" stroke-width="1.4" opacity=".5"/>`;
    }
    if (k < NV - 1) {
      const w2 = W(k + 1), d2 = D(k + 1);
      paredes += `<path d="${poli([P(-w, 0, k + 1), P(-w, d, k + 1), P(w, d, k + 1), P(w, 0, k + 1), P(w2, 0, k + 1), P(w2, d2, k + 1), P(-w2, d2, k + 1), P(-w2, 0, k + 1)])}" fill="url(#baPiso)" stroke="#9A6A40" stroke-width=".6"/>`;
      paredes += `<path d="${linha([P(-w2, 0, k + 1), P(-w2, d2, k + 1), P(w2, d2, k + 1), P(w2, 0, k + 1)])}" stroke="#FFF4DC" stroke-width="1.6" fill="none" opacity=".9"/>`;
      { let jn = ''; for (let q = 1; q < 8; q++) { const xq = -w + (2 * w) * q / 8, a1 = P(xq, d, k + 1), a2 = P(xq * w2 / w, d2, k + 1); jn += `M${F(a1[0])} ${F(a1[1])} L${F(a2[0])} ${F(a2[1])} `; } paredes += `<path d="${jn}" stroke="#B8875A" stroke-width=".6" opacity=".6"/>`; }
    }
  }
  paredes += `<path d="${poli([P(-W(6), 0, 7), P(-W(6), D(6), 7), P(W(6), D(6), 7), P(W(6), 0, 7)])}" fill="#3E6A5E"/>`;
  /* contorno do furo (corte da frente) e região do poço */
  const perfil = [];
  for (let j = 0; j < NV; j++) { perfil.push(P(-W(j), 0, j + 1)); if (j < NV - 1) perfil.push(P(-W(j + 1), 0, j + 1)); }
  const dirP = espelho(perfil);
  const regiao = [P(-W(0), 0, 0), P(-W(0), D(0), 0), P(W(0), D(0), 0), P(W(0), 0, 0), ...dirP, ...perfil.slice().reverse()];
  const solo = [[0, 292], P(-W(0), 0, 0), ...perfil, ...dirP.slice().reverse(), P(W(0), 0, 0), [800, 292], [800, 500], [0, 500]];
  function aguaPaths(z){
    if (z >= NV - .01) return ['M0 0', 'M0 0'];
    const k = Math.min(NV - 1, Math.floor(z)), w = W(k), d = D(k);
    const sup = poli([P(-w, 0, z), P(-w, d, z), P(w, d, z), P(w, 0, z)]);
    const esq = [P(-w, 0, z)];
    for (let j = k; j < NV; j++) { esq.push(P(-W(j), 0, j + 1)); if (j < NV - 1) esq.push(P(-W(j + 1), 0, j + 1)); }
    return [sup, poli([...esq, ...espelho(esq).reverse()])];
  }
  /* ---------- pessoas e bichos ---------- */
  const menina = () => `<ellipse cx="0" cy="1" rx="8" ry="1.8" fill="#3E2A14" opacity=".25"/>
    <path d="M-2.6 -12 V-1.5 M2.6 -12 V-1.5" stroke="#B8A890" stroke-width="3.8" stroke-linecap="round"/><path d="M-2.6 -12 V-1.5 M2.6 -12 V-1.5" stroke="#F6EEE2" stroke-width="2.6" stroke-linecap="round"/><path d="M-5 0 h3.6 M1.2 0 h3.6" stroke="#8A3A1E" stroke-width="2.2" stroke-linecap="round"/><path d="M-4.4 -.6 h1.4 M1.8 -.6 h1.4" stroke="#FFC83D" stroke-width=".7"/>
    <path d="M-6 -27 C-7 -20 -9 -14 -9.4 -10 H9.4 C9 -14 7 -20 6 -27Z" fill="url(#baKurtaP)" stroke="#7A1440" stroke-width="1" stroke-linejoin="round"/>
    <path d="M-6 -27 C-7 -20 -9 -14 -9.4 -10 H9.4 C9 -14 7 -20 6 -27Z" fill="url(#baDobra)"/>
    <path d="M-9.2 -11 H9.2" stroke="#FFC83D" stroke-width="2.4"/><path d="M-9 -11 H9" stroke="#E5392C" stroke-width=".9" stroke-dasharray="1 1.2"/>
    <path d="M-2.6 -27 L0 -23.8 L2.6 -27" stroke="#FFC83D" stroke-width="1" fill="none" stroke-linejoin="round"/><path d="M0 -23.8 V-18" stroke="#FFC83D" stroke-width=".6" stroke-dasharray="1 1"/>
    <path d="M-5.4 -27 C-2 -24 3 -18 7 -11.6" stroke="#E2701A" stroke-width="3.8" fill="none" stroke-linecap="round"/><path d="M-5.4 -27 C-2 -24 3 -18 7 -11.6" stroke="#FFA02E" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M-5.4 -27 C-2 -24 3 -18 7 -11.6" stroke="#FFF2C8" stroke-width=".6" fill="none" stroke-dasharray="1 1.4"/>
    <path d="M6.2 -12 l-.6 2.6 M7.2 -11.8 l0 2.8 M8.2 -11.8 l.6 2.6" stroke="#E5392C" stroke-width=".7" stroke-linecap="round"/>
    <path d="M-6 -26 C-8 -22 -9 -18 -8 -15" stroke="#7A4428" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-6 -26 C-8 -22 -9 -18 -8 -15" stroke="#A86E48" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-9 -16.6 l2 .4" stroke="#FFD447" stroke-width="1" stroke-linecap="round"/>
    <g class="ba-pq"><path d="M6 -26 C8 -22 9 -19 8.4 -16.6" stroke="#7A4428" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M6 -26 C8 -22 9 -19 8.4 -16.6" stroke="#A86E48" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="9.6" cy="-13.6" r="5.2" fill="url(#baBarro)" stroke="#6E2A10" stroke-width="1"/><path d="M5 -13 C7 -11.6 12 -11.6 14.2 -13" stroke="#FFF3DC" stroke-width=".8" fill="none" stroke-dasharray="1 1"/><ellipse cx="9.6" cy="-18.6" rx="2.8" ry="1.1" fill="#8A3A18"/><path d="M6.4 -15 q1 -3 3 -3.6" stroke="#FFD2A8" stroke-width="1" fill="none" stroke-linecap="round"/></g>
    <g class="ba-pc" style="display:none"><path d="M6 -26 C8 -32 7 -38 4.4 -41" stroke="#7A4428" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M6 -26 C8 -32 7 -38 4.4 -41" stroke="#A86E48" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-41" rx="4.4" ry="1.4" fill="#FFA02E" stroke="#A8400E" stroke-width=".6"/><circle cx="0" cy="-46.2" r="5.4" fill="url(#baBarro)" stroke="#6E2A10" stroke-width="1"/><path d="M-4.8 -45 C-2 -43.6 2 -43.6 4.8 -45" stroke="#FFF3DC" stroke-width=".8" fill="none" stroke-dasharray="1 1"/><ellipse cx="0" cy="-51.4" rx="2.8" ry="1" fill="#3FA8D8"/><path d="M-3 -47 q1 -3 3 -3.6" stroke="#FFD2A8" stroke-width="1" fill="none" stroke-linecap="round"/></g>
    <rect x="-1.5" y="-30" width="3" height="3.6" fill="#A86E48"/>
    <circle cx="0" cy="-34.4" r="6.6" fill="url(#baPeleM)" stroke="#5E3418" stroke-width="1"/>
    <path d="M-6.9 -34.4 C-7.2 -43.4 7.2 -43.4 6.9 -34.4 C5.4 -39 -1.6 -40.2 -6.9 -34.4Z" fill="#1E1410"/><path d="M-4 -40 C-1 -41.6 2 -41.4 4 -40" stroke="#5E4A40" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M-6.2 -33.4 C-8.8 -28.4 -8.8 -24 -7.6 -19.6" stroke="#1E1410" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-8.4 -29 l1.6 .6 M-8.6 -25.6 l1.6 .6 M-8.2 -22.4 l1.6 .6" stroke="#4A3A30" stroke-width=".7"/><circle cx="-7.6" cy="-19.4" r="1.4" fill="#FFC83D" stroke="#B07A08" stroke-width=".4"/>
    <ellipse cx="2.9" cy="-34.2" rx="1.5" ry="1.9" fill="#12121A"/><circle cx="3.4" cy="-35" r=".65" fill="#fff"/><circle cx="2.4" cy="-33.4" r=".3" fill="#fff"/>
    <path d="M1.4 -37.4 q1.6 -1 3.4 -.2" stroke="#2A1A10" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M5.4 -33 q.8 1 .1 1.6" stroke="#7A4428" stroke-width=".6" fill="none" stroke-linecap="round"/>
    <circle cx="-2.4" cy="-32.6" r=".9" fill="#FFC83D" stroke="#B07A08" stroke-width=".3"/>
    <ellipse cx="3.6" cy="-31" rx="1.8" ry="1.1" fill="#FF7A7A" opacity=".55"/><path d="M1 -30.4 q2 2 4.2 0" stroke="#5E2410" stroke-width="1" fill="#C8505A" stroke-linecap="round"/>`;
  const zig = (x0, y, n, dx, h) => `M${x0} ${y} ` + Array.from({ length:n }, (_, i) => `l${dx} ${i % 2 ? h : -h}`).join(' ');
  const mulher = (x, y) => `<g transform="translate(${x} ${y}) scale(1.45)"><ellipse cx="0" cy="1" rx="11" ry="2.2" fill="#5E3A14" opacity=".22"/>
    <path d="M-10 0 C-10 -7 -7 -15 -5 -19 H5 C7 -15 10 -7 10 0Z" fill="url(#baGhagraP)" stroke="#6E0E1E" stroke-width="1" stroke-linejoin="round"/><path d="M-10 0 C-10 -7 -7 -15 -5 -19 H5 C7 -15 10 -7 10 0Z" fill="url(#baDobra)"/>
    <path d="M-9.8 -1.8 C-4 -.4 4 -.4 9.8 -1.8" stroke="#1E7A5E" stroke-width="3.4" fill="none"/><path d="${zig(-9.4, -1.4, 16, 1.17, .9)}" stroke="#FFD447" stroke-width=".7" fill="none"/>
    <path d="M-7.6 -9 C-2 -8 2 -8 7.6 -9" stroke="#FFD447" stroke-width="1.2" fill="none"/><path d="M-6 -15.4 C-2 -14.8 2 -14.8 6 -15.4" stroke="#FF8AB8" stroke-width=".9" fill="none"/>
    <path d="M-5 -19 L-4.6 -27 H4.6 L5 -19Z" fill="#2E8A6E" stroke="#145A44" stroke-width=".9"/><path d="M-4.6 -21 H4.6" stroke="#FFD447" stroke-width=".7" stroke-dasharray="1 .8"/>
    <path d="M4 -26 C7 -30 7 -35 5 -38.4" stroke="#7A4A2A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M4 -26 C7 -30 7 -35 5 -38.4" stroke="#B07A50" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M5.2 -31 h2.6 M5.4 -32.4 h2.4 M5.6 -33.8 h2.2" stroke="#E5392C" stroke-width=".8"/>
    <path d="M-5.6 -35 C-7.4 -29 -9 -22 -8.2 -14 C-6 -16 -4.4 -20 -3.4 -26 C-1 -24 3 -22 5 -19 C4 -24 3 -30 4.8 -35 C2 -38.6 -3 -38.6 -5.6 -35Z" fill="url(#baOdhniP)" stroke="#A8400E" stroke-width=".9" stroke-linejoin="round"/>
    <path d="M-8.2 -14 C-6 -16 -4.4 -20 -3.4 -26 C-1 -24 3 -22 5 -19" stroke="#FFD447" stroke-width="1.1" fill="none"/>
    <circle cx="0" cy="-31.6" r="4.8" fill="#B07A50" stroke="#5E3418" stroke-width=".9"/>
    <path d="M-6 -30.6 C-6.4 -38.8 6.4 -38.8 6 -30.6 C4 -35.2 -4 -35.2 -6 -30.6Z" fill="url(#baOdhniP)" stroke="#A8400E" stroke-width=".8"/><path d="M-5.6 -31.6 C-4 -35 4 -35 5.6 -31.6" stroke="#FFD447" stroke-width=".8" fill="none"/>
    <ellipse cx="1.9" cy="-31.6" rx="1.1" ry="1.4" fill="#12121A"/><circle cx="2.3" cy="-32.2" r=".45" fill="#fff"/><path d="M.8 -34.2 q1.2 -.8 2.6 -.1" stroke="#2A1A10" stroke-width=".6" fill="none" stroke-linecap="round"/>
    <ellipse cx="2.6" cy="-29.4" rx="1.4" ry=".8" fill="#FF7A7A" opacity=".5"/><path d="M.4 -28.4 q1.6 1.4 3.2 0" stroke="#5E2410" stroke-width=".8" fill="#C8505A" stroke-linecap="round"/><circle cx="-1.6" cy="-30" r=".7" fill="#FFD447" stroke="#B07A08" stroke-width=".25"/>
    <ellipse cx="0" cy="-40.6" rx="5.4" ry="4.4" fill="url(#baLatao)" stroke="#7A5A10" stroke-width=".9"/><path d="M-5.2 -40 C-2 -38.6 2 -38.6 5.2 -40" stroke="#8A6418" stroke-width=".6" fill="none"/><path d="M-3 -42 q2 -2 4 -1.6" stroke="#FFF6C8" stroke-width="1" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="-47.6" r="3.8" fill="url(#baBarro)" stroke="#6E2A10" stroke-width=".8"/><path d="M-3.4 -47 C-1 -46 1 -46 3.4 -47" stroke="#FFF3DC" stroke-width=".6" fill="none" stroke-dasharray=".8 .8"/><ellipse cx="0" cy="-51" rx="2" ry=".8" fill="#8A3A18"/></g>`;
  const menino = (x, y) => `<g transform="translate(${x} ${y}) scale(1.45)"><ellipse cx="0" cy="1" rx="8" ry="1.8" fill="#5E3A14" opacity=".22"/>
    <path d="M-2.4 -10 V-1 M2.4 -10 V-1" stroke="#5E3418" stroke-width="3.2" stroke-linecap="round"/><path d="M-2.4 -10 V-1 M2.4 -10 V-1" stroke="#7A4A2A" stroke-width="2.2" stroke-linecap="round"/><path d="M-4.4 0 h3.4 M1 0 h3.4" stroke="#2A2A34" stroke-width="2.4" stroke-linecap="round"/><path d="M-4 -.8 h2 M1.4 -.8 h2" stroke="#fff" stroke-width=".6"/>
    <path d="M-5.2 -14.4 H5.2 L5.6 -9 H.6 L0 -11 L-.6 -9 H-5.6Z" fill="#2E3A6A" stroke="#141E44" stroke-width=".7"/>
    <rect x="-9" y="-23.6" width="5.4" height="9.6" rx="2" fill="#E5392C" stroke="#7A1410" stroke-width=".8"/><rect x="-8.4" y="-19.4" width="4.2" height="3.4" rx="1" fill="#FFC83D" stroke="#A8700E" stroke-width=".5"/>
    <path d="M-5 -24 C-5 -26.4 5 -26.4 5 -24 L5.2 -14 H-5.2Z" fill="#9ACFFF" stroke="#2E6AB0" stroke-width=".9"/><path d="M-5 -24 C-5 -26.4 5 -26.4 5 -24 L5.2 -14 H-5.2Z" fill="url(#baDobra)"/>
    <path d="M-2.4 -25.6 L0 -23 L2.4 -25.6 L1 -26.2 L0 -25 L-1 -26.2Z" fill="#fff" stroke="#2E6AB0" stroke-width=".5"/><path d="M0 -23 V-14.6" stroke="#2E6AB0" stroke-width=".5"/><g fill="#fff"><circle cx=".9" cy="-21" r=".4"/><circle cx=".9" cy="-18" r=".4"/></g><rect x="1.8" y="-22.4" width="2.4" height="2" fill="none" stroke="#2E6AB0" stroke-width=".5"/>
    <path d="M-3.6 -24.6 L-3.2 -15" stroke="#B8241C" stroke-width="1.4"/>
    <g id="ba-aceno"><path d="M4.6 -23.4 C7 -26 8 -29 8.6 -32" stroke="#5E3418" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M4.6 -23.4 C7 -26 8 -29 8.6 -32" stroke="#7A4A2A" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="8.8" cy="-32.6" r="1.6" fill="#7A4A2A" stroke="#5E3418" stroke-width=".5"/></g>
    <circle cx="0" cy="-30" r="5" fill="#7A4A2A" stroke="#3E2414" stroke-width=".9"/><path d="M-5.2 -30.4 C-5.4 -37 5.4 -37 5.2 -30.4 C3 -33.4 -2 -34 -5.2 -30.4Z M-1 -35.4 l1 -2.4 l1 2" fill="#1A1410"/>
    <ellipse cx="2" cy="-30" rx="1.2" ry="1.5" fill="#12121A"/><circle cx="2.4" cy="-30.6" r=".5" fill="#fff"/><path d="M.8 -32.6 q1.2 -.8 2.6 -.1" stroke="#1A1410" stroke-width=".6" fill="none" stroke-linecap="round"/>
    <ellipse cx="3" cy="-27.8" rx="1.4" ry=".8" fill="#FF7A6A" opacity=".45"/><path d="M.2 -27.4 q1.8 1.8 3.6 0Z" fill="#fff" stroke="#3E1408" stroke-width=".7" stroke-linejoin="round"/></g>`;
  const crianca = (pele, camisa, short, cabelo, menina) => `<path d="M-2 -9 V-1 M2 -9 V-1" stroke="${pele}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M-4 -12 H4 L4.4 -7.6 H-4.4Z" fill="${short}"/><path d="M-4.4 -19 C-4.4 -21 4.4 -21 4.4 -19 L4.2 -11.6 H-4.2Z" fill="${camisa}" stroke="#2A2A34" stroke-width=".6"/>
    <path d="M-4 -18.6 l-3.4 -4 M4 -18.6 l3.4 -4" stroke="${pele}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="0" cy="-23.8" r="4.2" fill="${pele}" stroke="#3E2414" stroke-width=".7"/><path d="M-4.4 -24 C-4.6 -29.6 4.6 -29.6 4.4 -24 C2.6 -26.6 -2 -27 -4.4 -24Z" fill="${cabelo}"/>${menina ? `<circle cx="-4.6" cy="-22.6" r="1.6" fill="${cabelo}"/><circle cx="4.6" cy="-22.6" r="1.6" fill="${cabelo}"/>` : ''}
    <circle cx="-1.5" cy="-23.6" r=".7" fill="#12121A"/><circle cx="1.5" cy="-23.6" r=".7" fill="#12121A"/><path d="M-1.6 -21.6 q1.6 1.6 3.2 0Z" fill="#fff" stroke="#3E1408" stroke-width=".5"/>`;
  const ra = (x, y, s, i) => `<g class="ba-ra toque" data-i="${i}" style="opacity:0;transition:opacity 1s;pointer-events:none"><g transform="translate(${x} ${y}) scale(${s})"><g class="ba-ra-in">
    <ellipse cx="0" cy="1" rx="10" ry="2" fill="#2A3A14" opacity=".25"/>
    <path d="M-6 -2 C-12 -2 -13 -7 -8 -8 C-6 -6 -5 -4 -3 -3Z M6 -2 C12 -2 13 -7 8 -8 C6 -6 5 -4 3 -3Z" fill="#D8B818" stroke="#6E5A08" stroke-width=".8" stroke-linejoin="round"/>
    <path d="M-12 0 h5 M7 0 h5" stroke="#6E5A08" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="0" cy="-6" rx="8" ry="5.6" fill="url(#baRa)" stroke="#6E5A08" stroke-width=".9"/>
    <path d="M-3 -9 C-1 -10 1 -10 3 -9" stroke="#3E7A2A" stroke-width="1.2" fill="none" opacity=".6"/>
    <g class="ba-saco" style="transform-box:fill-box;transform-origin:50% 30%;transform:scale(.25)"><circle cx="-5.4" cy="-3.6" r="3" fill="#6AB4FF" stroke="#2E5AA8" stroke-width=".7"/><circle cx="5.4" cy="-3.6" r="3" fill="#6AB4FF" stroke="#2E5AA8" stroke-width=".7"/><circle cx="-6.2" cy="-4.6" r=".8" fill="#fff" opacity=".8"/><circle cx="4.6" cy="-4.6" r=".8" fill="#fff" opacity=".8"/></g>
    <path d="M-4 -1 C-6 1 -5 1 -3 0 M4 -1 C6 1 5 1 3 0" stroke="#6E5A08" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="-3.6" cy="-10.6" r="2.4" fill="#F2DA30" stroke="#6E5A08" stroke-width=".7"/><circle cx="3.6" cy="-10.6" r="2.4" fill="#F2DA30" stroke="#6E5A08" stroke-width=".7"/>
    <circle cx="-3.4" cy="-10.6" r="1.3" fill="#12121A"/><circle cx="3.8" cy="-10.6" r="1.3" fill="#12121A"/><circle cx="-3" cy="-11.1" r=".45" fill="#fff"/><circle cx="4.2" cy="-11.1" r=".45" fill="#fff"/>
    <path d="M-3 -5.4 q3 2 6 0" stroke="#6E5A08" stroke-width=".8" fill="none" stroke-linecap="round"/></g><circle r="14" cy="-5" fill="transparent"/></g></g>`;
  const esquilo = `<path d="M5 -4 C16 -8 19 -20 11 -26 C6 -22 9 -14 2 -8Z" fill="#8A6A4E" stroke="#4E3A28" stroke-width=".9" stroke-linejoin="round"/><path d="M8 -8 C13 -12 14 -18 11 -23" stroke="#C8A888" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-5" rx="8" ry="4.8" fill="#A88466" stroke="#4E3A28" stroke-width=".9"/><ellipse cx="-1" cy="-3.4" rx="5" ry="2.2" fill="#E8D8C0"/>
    <path d="M-5 -8.4 C-1 -10.4 3 -10.2 6 -8" stroke="#3E2A1A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-5.4 -8.6 C-1 -10.6 3 -10.4 6.2 -8.2 M-5 -6.6 C-1 -8.2 3 -8 6.4 -6" stroke="#F8EEDC" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M-4.6 -10.2 C-1 -12 2.4 -11.8 5.2 -10" stroke="#F8EEDC" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-5 -1 v1.6 M3 -1 v1.6" stroke="#4E3A28" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="-8" cy="-8" r="4" fill="#A88466" stroke="#4E3A28" stroke-width=".9"/><path d="M-8 -12 l1 -2.6 l1.4 2.4Z" fill="#8A6A4E" stroke="#4E3A28" stroke-width=".6"/>
    <circle cx="-9.4" cy="-8.6" r="1.2" fill="#12121A"/><circle cx="-9" cy="-9" r=".4" fill="#fff"/><circle cx="-12" cy="-7.4" r=".7" fill="#3E2A1A"/><path d="M-10 -6.4 l1.2 .3" stroke="#F8EEDC" stroke-width=".6"/>`;
  const construtor = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="1" rx="11" ry="2.2" fill="#5E3A14" opacity=".22"/>
    <path d="M13 -30 L5 0" stroke="#6E4A2A" stroke-width="2" stroke-linecap="round"/><path d="M2 -1 L9 1 L8 5 L1 3Z" fill="#9AA0AE" stroke="#4E5260" stroke-width=".8"/>
    <path d="M-2.8 -13 V-1 M2.8 -13 V-1" stroke="#F2EEE4" stroke-width="3.6" stroke-linecap="round"/><path d="M-5 0 h3.4 M1.6 0 h3.4" stroke="#6E3A1E" stroke-width="2" stroke-linecap="round"/>
    <path d="M-6.4 -28 C-7.4 -22 -8.4 -16 -7.6 -11 H7.6 C8.4 -16 7.4 -22 6.4 -28Z" fill="#FBF8F0" stroke="#8A8270" stroke-width=".9"/><path d="M-4 -28 L-3.6 -18 H3.6 L4 -28" fill="#3E6AB0" stroke="#1E3A6A" stroke-width=".7"/>
    <path d="M6 -26 C9 -24 11 -22 11.4 -20" stroke="#8A5634" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 -26 C-2 -24 3 -24 8 -26" stroke="#8A5634" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="-32.4" r="4.8" fill="#8A5634" stroke="#3E2414" stroke-width=".9"/><path d="M.6 -30.2 q1.6 -.8 3.4 .2" stroke="#1E1410" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="2" cy="-32.8" rx=".9" ry="1.1" fill="#12121A"/><circle cx="2.3" cy="-33.2" r=".35" fill="#fff"/>
    <path d="M-5.8 -33 C-6.4 -41.6 6.4 -41.6 5.8 -33 C3 -35.4 -3 -35.4 -5.8 -33Z" fill="#E5392C" stroke="#8A1410" stroke-width=".9"/><path d="M-5 -36 C-2 -38 2 -38 5 -36 M-5.4 -34.4 C-2 -36.4 2 -36.4 5.4 -34.4" stroke="#FFC83D" stroke-width=".9" fill="none"/><path d="M-5.4 -34 C-8 -31 -8.4 -27 -7.4 -24" stroke="#FFC83D" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  const construtora = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="1" rx="10" ry="2.2" fill="#5E3A14" opacity=".22"/>
    <path d="M-9 0 C-9 -7 -6.4 -14 -4.6 -18 H4.6 C6.4 -14 9 -7 9 0Z" fill="#3E5EC8" stroke="#1E2E6A" stroke-width="1"/><path d="M-8.6 -1.8 C-4 -.6 4 -.6 8.6 -1.8" stroke="#FFC83D" stroke-width="2" fill="none"/>
    <path d="M-4.6 -18 L-4.2 -26 H4.2 L4.6 -18Z" fill="#FFC83D" stroke="#A8700E" stroke-width=".8"/>
    <path d="M-4 -25 C-7 -30 -7 -35 -5 -38.6 M4 -25 C7 -30 7 -35 5 -38.6" stroke="#9A6440" stroke-width="2.3" fill="none" stroke-linecap="round"/>
    <path d="M-5.2 -34 C-7 -28 -8 -22 -7.4 -15 C-5 -18 -4 -22 -3 -26 C0 -24 3 -22 4.6 -18 C4 -24 3 -29 4.6 -34Z" fill="#E84A8A" stroke="#8A1E4A" stroke-width=".8"/>
    <circle cx="0" cy="-31" r="4.4" fill="#9A6440" stroke="#4E2E14" stroke-width=".9"/><path d="M-5.4 -30 C-5.8 -37.6 5.8 -37.6 5.4 -30 C4 -34 -4 -34 -5.4 -30Z" fill="#E84A8A" stroke="#8A1E4A" stroke-width=".8"/>
    <ellipse cx="1.7" cy="-31" rx=".9" ry="1.1" fill="#12121A"/><circle cx="2" cy="-31.4" r=".35" fill="#fff"/><path d="M.4 -28.2 q1.4 1 2.8 0" stroke="#5E2410" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-8 -39 C-6 -36 6 -36 8 -39Z" fill="#6A6E7A" stroke="#33363E" stroke-width=".8"/><path d="${copa(0, -40.4, 6.6, 3, 7, .3)}" fill="#9A6A3A" stroke="#5E3A1A" stroke-width=".7"/></g>`;
  /* ---------- paisagem ---------- */
  const tufo = (x, y, s, c1, c2) => `<path d="M${x - 3 * s} ${y} q-1 ${F(-5 * s)} -3 ${F(-8 * s)} M${x} ${y} q0 ${F(-6 * s)} 1 ${F(-10 * s)} M${x + 3 * s} ${y} q1 ${F(-4 * s)} 4 ${F(-7 * s)}" stroke="${c2}" stroke-width="${F(2.6 * s)}" fill="none" stroke-linecap="round"/><path d="M${x - 3 * s} ${y} q-1 ${F(-5 * s)} -3 ${F(-8 * s)} M${x} ${y} q0 ${F(-6 * s)} 1 ${F(-10 * s)} M${x + 3 * s} ${y} q1 ${F(-4 * s)} 4 ${F(-7 * s)}" stroke="${c1}" stroke-width="${F(1.3 * s)}" fill="none" stroke-linecap="round"/>`;
  const casa = (x, y0, w, h, cor, esc, extra) => `<g><rect x="${x}" y="${y0}" width="${w}" height="${h}" fill="${cor}" stroke="${esc}" stroke-width="1.2"/><rect x="${x}" y="${y0}" width="${w}" height="${h}" fill="url(#baParede)"/>
    <path d="M${x - 1.6} ${y0} h${w + 3.2} v-3.6 h-${w + 3.2}Z" fill="#F6EBD6" stroke="${esc}" stroke-width=".8"/><g fill="#F6EBD6" stroke="${esc}" stroke-width=".6">${Array.from({ length:Math.floor(w / 7) }, (_, i) => `<rect x="${x + 1 + i * 7}" y="${y0 - 6.4}" width="3.4" height="2.8"/>`).join('')}</g>
    <path d="M${x + w * .22} ${y0 + h} v-9 a4 4 0 0 1 8 0 v9Z" fill="#6A3A22" stroke="${esc}" stroke-width=".8"/><path d="M${x + w * .22 + 4} ${y0 + h} v-12" stroke="#3E1E10" stroke-width=".6"/>
    <path d="M${x + w * .62} ${y0 + 15} v-6 a3.4 3.4 0 0 1 6.8 0 v6Z" fill="#2E5A6A" stroke="#F6EBD6" stroke-width="1.2"/>${extra || ''}</g>`;
  const ZT = [1.8, 3.4, 5.0, 6.8];
  const PUF = [[-40, -4, 20, 1], [30, -12, 22, 1], [-6, -24, 18, 1], [-50, 8, 17, 0], [-26, -8, 23, 0], [6, -18, 27, 0], [36, -4, 22, 0], [56, 8, 15, 0]];
  const fofo = (cb, cf, lin, aro, barriga) => `<g stroke="${lin}" stroke-width="5">${PUF.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}<ellipse cx="2" cy="10" rx="62" ry="13"/></g>
      ${PUF.filter(q => q[3]).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cb}"/>`).join('')}<ellipse cx="2" cy="10" rx="62" ry="13" fill="${barriga}"/>
      ${PUF.filter(q => !q[3]).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cf}"/>`).join('')}<ellipse cx="2" cy="12" rx="58" ry="9" fill="${barriga}" opacity=".85"/>
      <g stroke="${aro}" stroke-width="3" fill="none" stroke-linecap="round">${PUF.filter(q => !q[3]).map(([x, y, r]) => `<path d="M${F(x - r * .7)} ${F(y - r * .5)} A${r * .86} ${r * .86} 0 0 1 ${F(x + r * .3)} ${F(y - r * .82)}"/>`).join('')}</g>`;
  const nuvem = (i, n) => `<g class="ba-nuvem toque" data-i="${i}" transform="translate(${n.x} ${n.y})"><g style="animation:flutua ${(3 + i * .7).toFixed(1)}s ease-in-out infinite alternate"><g transform="scale(${n.s})">
      <g class="ba-nc">${fofo('url(#baNuvL2)', 'url(#baNuvL)', '#8FA0C2', '#FFFFFF', '#C6D2EA')}</g>
      <g class="ba-ne" style="opacity:0;transition:opacity 1.6s">${fofo('url(#baNuvD2)', 'url(#baNuvD)', '#262E48', '#FFE9C8', '#3A4462')}<g stroke="#9AB8FF" stroke-width="2.2" stroke-linecap="round" opacity=".55">${[-40, -16, 8, 32].map(x => `<path d="M${x} 24 l-3 7"/>`).join('')}</g></g>
    </g></g><ellipse cx="0" cy="0" rx="${(76 * n.s).toFixed(0)}" ry="${(40 * n.s).toFixed(0)}" fill="transparent"/></g>`;
  const NUV = [{ x:110, y:96, s:1, tx:318, ty:80 }, { x:176, y:140, s:.78, tx:452, ty:66 }, { x:58, y:146, s:.74, tx:548, ty:100 }];
  /* johad: dique de terra em meia-lua */
  const JA = [628, 258], JC = [690, 296], JB = [752, 258];
  const bez = t => [(1 - t) * (1 - t) * JA[0] + 2 * (1 - t) * t * JC[0] + t * t * JB[0], (1 - t) * (1 - t) * JA[1] + 2 * (1 - t) * t * JC[1] + t * t * JB[1]];
  const monte = (t0, t1) => { const n = 8, cima = [], baixo = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n, [x, y] = bez(t), h = 6.4 * Math.sin(Math.PI * (.12 + .76 * i / n)); cima.push([x, y - h]); baixo.push([x, y + 3.4]); } return `M${F(baixo[0][0])} ${F(baixo[0][1])} ` + cima.map(p => `L${F(p[0])} ${F(p[1])}`).join(' ') + ' ' + baixo.reverse().map(p => `L${F(p[0])} ${F(p[1])}`).join(' ') + 'Z'; };
  const SLOTS = [[.2, .4], [.4, .6], [.6, .8]].map(([a, b]) => ({ a, b, c:bez((a + b) / 2) }));
  const TERRA = [{ x:784, y:258 }, { x:770, y:276 }, { x:792, y:290 }];
  const torrao = `<path d="${copa(0, 0, 13, 7, 9, .3)}" fill="url(#baMonte)" stroke="#5E3A1A" stroke-width="1.4"/><path d="M-7 -3 q4 -4 9 -3" stroke="#D8A870" stroke-width="1.6" fill="none" stroke-linecap="round"/><g fill="#5E3A1A"><circle cx="3" cy="1" r="1"/><circle cx="-4" cy="2" r=".8"/><circle cx="7" cy="-1" r=".7"/></g>`;
  /* ---------- svg ---------- */
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Poço de degraus na Índia, cortado para mostrar as escadas, a água e a terra; uma vila, um pavão, o mar ao longe e nuvens de monção">
    <defs>
      <linearGradient id="baCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FAEE6"/><stop offset=".55" stop-color="#A8D6F0"/><stop offset="1" stop-color="#FBE3BC"/></linearGradient>
      <linearGradient id="baMon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3A58"/><stop offset="1" stop-color="#7A8098"/></linearGradient>
      <radialGradient id="baSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0961E"/></radialGradient>
      <linearGradient id="baMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA8E0"/><stop offset="1" stop-color="#1E6AB0"/></linearGradient>
      <linearGradient id="baMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A4B8"/><stop offset="1" stop-color="#E6C8C0"/></linearGradient>
      <linearGradient id="baMorro2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B88C8C"/><stop offset="1" stop-color="#DDB49A"/></linearGradient>
      <linearGradient id="baTerra" gradientUnits="userSpaceOnUse" x1="0" y1="186" x2="0" y2="292"><stop offset="0" stop-color="#F0D6A4"/><stop offset="1" stop-color="#DCA666"/></linearGradient>
      <linearGradient id="baVerde" gradientUnits="userSpaceOnUse" x1="0" y1="186" x2="0" y2="292"><stop offset="0" stop-color="#B8D47A"/><stop offset="1" stop-color="#7EB04A"/></linearGradient>
      <linearGradient id="baRi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9BE88"/><stop offset="1" stop-color="#C98E58"/></linearGradient>
      <linearGradient id="baSl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4CF98"/><stop offset="1" stop-color="#E2AE72"/></linearGradient>
      <linearGradient id="baSr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A86A3E"/><stop offset="1" stop-color="#C08250"/></linearGradient>
      <linearGradient id="baPiso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE7C2"/><stop offset="1" stop-color="#EAC690"/></linearGradient>
      <linearGradient id="baAs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46B8CC"/><stop offset=".55" stop-color="#7AD8DE"/><stop offset="1" stop-color="#A8F0EE"/></linearGradient>
      <linearGradient id="baAg" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="490"><stop offset="0" stop-color="#3AAAC8"/><stop offset="1" stop-color="#0E4A70"/></linearGradient>
      <linearGradient id="baFundo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2A1206" stop-opacity="0"/><stop offset="1" stop-color="#2A1206" stop-opacity=".22"/></linearGradient>
      <pattern id="baBloco" width="26" height="9.4" patternUnits="userSpaceOnUse"><path d="M0 .3 H26 M0 4.9 H26 M7 .3 V4.9 M20 4.9 V9.4" stroke="#6E3A1A" stroke-width=".55" opacity=".32" fill="none"/><path d="M0 1 H26 M0 5.6 H26" stroke="#FFF2D8" stroke-width=".5" opacity=".28"/><circle cx="4" cy="3" r=".5" fill="#8A5A30" opacity=".35"/><circle cx="15" cy="7.4" r=".6" fill="#8A5A30" opacity=".3"/><circle cx="22" cy="2.4" r=".4" fill="#FFF2D8" opacity=".4"/></pattern>
      <pattern id="baCaus" width="40" height="16" patternUnits="userSpaceOnUse"><path d="M-2 5 C4 1 8 9 14 5 S24 1 30 5 S38 9 42 5 M-2 13 C3 10 9 16 15 12 S25 9 31 13 S38 16 42 13" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M10 5 C12 8 11 10 13 12 M30 5 C28 8 30 10 28 13" stroke="#FFFFFF" stroke-width=".7" fill="none" opacity=".7"/></pattern>
      <linearGradient id="baLencolG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AD4FA" stop-opacity=".85"/><stop offset=".45" stop-color="#3E8EE0" stop-opacity=".6"/><stop offset="1" stop-color="#2E6AC8" stop-opacity="0"/></linearGradient>
      <radialGradient id="baNuvL" cx=".42" cy=".25" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F2F6FF"/><stop offset="1" stop-color="#C6D2EA"/></radialGradient>
      <radialGradient id="baNuvL2" cx=".42" cy=".25" r=".75"><stop offset="0" stop-color="#EEF2FA"/><stop offset="1" stop-color="#AEBCD8"/></radialGradient>
      <radialGradient id="baNuvD" cx=".42" cy=".22" r=".8"><stop offset="0" stop-color="#9AA6C4"/><stop offset=".55" stop-color="#6A7698"/><stop offset="1" stop-color="#3E4868"/></radialGradient>
      <radialGradient id="baNuvD2" cx=".42" cy=".22" r=".8"><stop offset="0" stop-color="#7A86A6"/><stop offset="1" stop-color="#323C5A"/></radialGradient>
      <pattern id="baKurtaP" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#D93A7A"/><circle cx="2.5" cy="2.5" r=".75" fill="#FFE6F0"/><circle cx="2.5" cy="2.5" r=".3" fill="#FFC83D"/><circle cx="0" cy="0" r=".35" fill="#FFC83D"/><circle cx="5" cy="0" r=".35" fill="#FFC83D"/><circle cx="0" cy="5" r=".35" fill="#FFC83D"/><circle cx="5" cy="5" r=".35" fill="#FFC83D"/></pattern>
      <pattern id="baGhagraP" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#C8283E"/><path d="M3 1.6 L4.4 3 L3 4.4 L1.6 3Z" fill="#FFD447"/><circle cx="3" cy="3" r=".45" fill="#2E8A6E"/><g fill="#FFE6E0"><circle cx="0" cy="0" r=".45"/><circle cx="6" cy="0" r=".45"/><circle cx="0" cy="6" r=".45"/><circle cx="6" cy="6" r=".45"/></g></pattern>
      <pattern id="baOdhniP" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#FF8A2E"/><circle cx="1" cy="1" r=".55" fill="#FFE27A"/><circle cx="3" cy="3" r=".4" fill="#E5392C"/></pattern>
      <linearGradient id="baDobra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <radialGradient id="baRa" cx=".4" cy=".3"><stop offset="0" stop-color="#FFF27A"/><stop offset=".6" stop-color="#E8C820"/><stop offset="1" stop-color="#A88A10"/></radialGradient>
      <linearGradient id="baSombra" gradientUnits="userSpaceOnUse" x1="0" y1="226" x2="0" y2="490"><stop offset="0" stop-color="#1A2440" stop-opacity="0"/><stop offset=".5" stop-color="#2A1A30" stop-opacity=".16"/><stop offset="1" stop-color="#1A1430" stop-opacity=".42"/></linearGradient>
      <linearGradient id="baPav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6CE98"/><stop offset="1" stop-color="#D49C64"/></linearGradient>
      <linearGradient id="baParede" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
      <radialGradient id="baNuv" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C8D4EA"/></radialGradient>
      <radialGradient id="baNuvC" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#9AA4BE"/><stop offset="1" stop-color="#4A5470"/></radialGradient>
      <radialGradient id="baBarro" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F2A870"/><stop offset=".6" stop-color="#C9622E"/><stop offset="1" stop-color="#7E3416"/></radialGradient>
      <radialGradient id="baLatao" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF0A0"/><stop offset=".6" stop-color="#E0B040"/><stop offset="1" stop-color="#8A6418"/></radialGradient>
      <radialGradient id="baPeleM" cx=".4" cy=".35"><stop offset="0" stop-color="#B8805A"/><stop offset="1" stop-color="#8A5636"/></radialGradient>
      <radialGradient id="baLang" cx=".4" cy=".3"><stop offset="0" stop-color="#E2DCD0"/><stop offset="1" stop-color="#9A948A"/></radialGradient>
      <linearGradient id="baMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08850"/><stop offset="1" stop-color="#8A5A2E"/></linearGradient>
      <linearGradient id="baLagoG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ED0E6"/><stop offset="1" stop-color="#2E8AC0"/></linearGradient>
      <linearGradient id="baNeem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E9A44"/><stop offset="1" stop-color="#22663A"/></linearGradient>
      <linearGradient id="baKhejri" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4C48A"/><stop offset="1" stop-color="#7A9058"/></linearGradient>
      <pattern id="baPoros" width="36" height="12" patternUnits="userSpaceOnUse"><path d="M3 4 h8 M21 10 h6" stroke="#DDF2FF" stroke-width="1.2" stroke-linecap="round" opacity=".45"/></pattern>
      <clipPath id="baAguaC"><path id="ba-cl-sup" d="M0 0"/><path id="ba-cl-sec" d="M0 0"/></clipPath>
      <clipPath id="baPocoC"><path d="${poli(regiao)}"/></clipPath>
      <clipPath id="baSoloC"><path d="${poli(solo)}"/></clipPath>
      <radialGradient id="baVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#2A1206" stop-opacity="0"/><stop offset="1" stop-color="#2A1206" stop-opacity=".32"/></radialGradient>
      <filter id="baGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="300" fill="url(#baCeu)"/>
    <g id="ba-sol"><circle cx="704" cy="64" r="56" fill="#FFE27A" opacity=".22"/><circle cx="704" cy="64" r="40" fill="#FFE27A" opacity=".3"/><circle cx="704" cy="64" r="27" fill="url(#baSolG)" stroke="#E8901E" stroke-width="2.4"/><path d="M690 54 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva" opacity=".75"><use href="#nuvem" x="560" y="30" width="70" height="30" style="color:#fff"/><use href="#nuvem" x="250" y="40" width="56" height="24" style="color:#fff"/></g>
    <g id="ba-arco" style="opacity:0;transition:opacity 2s" fill="none" stroke-width="5">${['#FF6A6A', '#FFB347', '#FFE27A', '#7AD07A', '#5AB4FF', '#9A7AE6'].map((c, i) => `<path d="M${520 + i * 5} 200 A${150 - i * 5} ${130 - i * 5} 0 0 1 ${820 - i * 5} 200" stroke="${c}" opacity=".7"/>`).join('')}</g>
    <path d="M150 188 C190 168 230 160 270 166 C310 150 352 154 392 160 C440 146 490 150 534 158 C584 140 630 146 676 150 C720 134 764 140 800 148 V190 H150Z" fill="url(#baMorro)"/>
    <g id="ba-forte" fill="#D9B4A4" stroke="#A07A80" stroke-width=".8"><path d="M700 146 V134 h46 v12Z"/>${[700, 715, 730, 746].map(x => `<rect x="${x - 4}" y="${130}" width="8" height="16" rx="3"/>`).join('')}<path d="M718 134 v-8 h12 v8Z"/><g fill="#A07A80" stroke="none">${[707, 722, 738].map(x => `<rect x="${x}" y="137" width="2" height="3"/>`).join('')}</g></g>
    <path d="M300 190 C340 176 380 172 420 178 C470 168 520 172 560 180 C610 170 680 172 720 180 C760 174 790 176 800 178 V192 H300Z" fill="url(#baMorro2)" opacity=".85"/>
    <path d="M0 170 C60 168 150 170 236 176 C244 180 246 186 240 190 H0Z" fill="url(#baMar)"/>
    <g stroke="#E6F6FF" stroke-width="1.2" fill="none" opacity=".85">${[[14, 176], [60, 180], [110, 177], [160, 183], [196, 179], [36, 185]].map(([x, y]) => `<path d="M${x} ${y} q4 -2 8 0 q4 2 8 0"/>`).join('')}</g>
    <g id="ba-barco" transform="translate(88 180)"><path d="M-10 0 C-6 4 6 4 10 0Z" fill="#8A5A2E" stroke="#4E2E14" stroke-width=".8"/><path d="M0 0 V-14" stroke="#4E2E14" stroke-width="1"/><path d="M1 -14 C8 -10 10 -4 9 -1 L1 -1Z" fill="#FFF6E0" stroke="#8A7A5A" stroke-width=".7"/></g>
    <rect id="ba-monsao" width="800" height="300" fill="url(#baMon)" style="opacity:0;transition:opacity 2s" pointer-events="none"/>
    <path d="M0 190 C60 188 150 188 244 186 H800 V300 H0Z" fill="url(#baTerra)"/>
    <path d="M0 190 C60 188 150 188 244 186" stroke="#FFF2D0" stroke-width="2.4" fill="none" opacity=".8"/>
    <g id="ba-campos">${[0, 1, 2, 3].map(i => `<path d="M${10 + i * 6} ${196 + i * 7} H${236 - i * 4}" stroke="#C08A50" stroke-width="3.2" stroke-linecap="round" opacity=".7"/>`).join('')}<g class="ba-verdeja" style="opacity:0;transition:opacity 2.4s">${[0, 1, 2, 3].map(i => Array.from({ length:16 }, (_, j) => tufo(16 + i * 6 + j * 13.4, 196 + i * 7, .55 + i * .08, '#9AD050', '#3E7A22')).join('')).join('')}</g></g>
    <g stroke="#B88A50" stroke-width="1.1" fill="none" opacity=".7">${Array.from({ length:26 }, () => { const x = R(10, 790), y = R(206, 288); if (x > 190 && x < 610) return ''; return `<path d="M${F(x)} ${F(y)} q4 -2 8 0"/>`; }).join('')}</g>
    <g class="ba-verdeja" style="opacity:0;transition:opacity 2.4s"><path d="M0 230 C40 226 120 232 200 236 L210 292 H0Z" fill="url(#baVerde)" opacity=".55"/><path d="M600 236 C660 230 740 232 800 228 V292 H604Z" fill="url(#baVerde)" opacity=".55"/></g>
    <!-- khejri e esquilo (esquerda, ao fundo) -->
    <g id="ba-khejri"><path d="M226 216 C224 204 228 194 222 182 M224 198 C214 190 210 186 204 184 M226 192 C234 186 240 180 246 178" stroke="#6E5440" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="${copa(214, 176, 18, 10, 9, .4)}" fill="url(#baKhejri)" stroke="#5E6E3E" stroke-width="1.2"/><path d="${copa(240, 172, 16, 9, 9, .4)}" fill="url(#baKhejri)" stroke="#5E6E3E" stroke-width="1.2"/><path d="${copa(226, 164, 15, 9, 9, .4)}" fill="#C4D29A" stroke="#5E6E3E" stroke-width="1.2"/>
      <g fill="#E8E0A0">${[[212, 172], [236, 168], [226, 160], [246, 174]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g></g>
    <g id="ba-esquilo" class="toque"><g transform="translate(252 223) scale(-1.15 1.15)"><g id="ba-esq-in">${esquilo}</g></g><rect x="234" y="196" width="36" height="30" fill="transparent"/></g>
    <!-- vila (direita, ao fundo) -->
    <g id="ba-vila">
      ${casa(636, 176, 46, 54, '#E8A090', '#9A4E3E', `<g><rect x="663" y="186" width="16" height="11" fill="#F2B8A4" stroke="#9A4E3E" stroke-width=".8"/><path d="M661 186 Q671 178 681 186Z" fill="#E8B07A" stroke="#9A4E3E" stroke-width=".8"/><path d="M665 197 h12" stroke="#9A4E3E" stroke-width="1"/><g fill="#5A2A1E">${[666, 670, 674].map(x => `<rect x="${x}" y="189" width="2.4" height="6" rx="1.2"/>`).join('')}</g></g>`)}
      ${casa(600, 190, 40, 40, '#5E86D6', '#2A4A8A', `<path d="M606 198 h10 v8 h-10Z" fill="#8AC8F0" stroke="#F6EBD6" stroke-width="1"/>`)}
      ${casa(680, 194, 42, 34, '#7A9EE6', '#2E4E9A', `<g transform="translate(688 190) skewX(-20)"><rect x="0" y="-8" width="22" height="8" fill="#1E3A7A" stroke="#E6ECF8" stroke-width=".8"/><path d="M5.5 -8 v8 M11 -8 v8 M16.5 -8 v8 M0 -4 h22" stroke="#7AA8E6" stroke-width=".6"/></g>`)}
      ${casa(720, 184, 46, 46, '#E8C070', '#9A6A1E', `<g><rect x="748" y="168" width="12" height="12" rx="2" fill="#2A2A34" stroke="#12121A" stroke-width=".8"/><path d="M748 172 h12" stroke="#4E4E5A" stroke-width="1"/></g>`)}
      ${casa(764, 196, 40, 34, '#5E86D6', '#2A4A8A', '')}
      <g class="balanca" style="animation-duration:3s"><path d="M640 186 C650 190 662 190 672 186" stroke="#5E4A3A" stroke-width=".7" fill="none"/>${[['#E5392C', 644], ['#FFC83D', 652], ['#2EAE8A', 660], ['#E84A8A', 667]].map(([c, x]) => `<path d="M${x} 188.6 h6 l-1 9 h-4Z" fill="${c}" stroke="#4E2E1E" stroke-width=".5"/>`).join('')}</g>
      <g>${[[612, 228], [628, 230], [700, 228]].map(([x, y]) => `<path d="${copa(x, y - 5, 7, 6, 7, .35)}" fill="#C8288A" stroke="#7A1458" stroke-width=".8"/><g fill="#FF7AC8">${[[-3, -7], [2, -4], [4, -9]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="1.3"/>`).join('')}</g>`).join('')}</g>
    </g>
    <!-- nim com o langur -->
    <g id="ba-nim"><path d="M582 230 C584 214 578 204 582 190 M582 206 C574 200 568 196 562 196 M582 200 C592 194 598 190 604 186" stroke="#5E4030" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="${copa(584, 176, 36, 20, 12, .3)}" fill="url(#baNeem)" stroke="#1E5A2E" stroke-width="1.6"/><path d="${copa(566, 168, 18, 12, 9, .3)}" fill="#5AAA4E"/><path d="${copa(600, 164, 18, 11, 9, .3)}" fill="#4E9E46"/>
      ${textura(584, 176, 30, 16, 12, '#8ACB6A', 1.2)}</g>
    <g id="ba-langur" class="toque" data-fig="langur"><g id="ba-lang-pos"><svg x="584" y="163" width="38" height="45" viewBox="0 0 110 130"><use href="#f-langur"/></svg></g>${brilhoHotspot(626, 168)}</g>
    <!-- pavilhão do poço -->
    <g id="ba-pavilhao" class="toque" data-fig="baoli">
      <rect x="292" y="216" width="216" height="10" fill="#D9A06A" stroke="#8A5A30" stroke-width="1"/>
      <rect x="300" y="194" width="200" height="22" fill="url(#baPav)" stroke="#8A5A30" stroke-width="1.2"/>
      <g fill="#6A3420">${Array.from({ length:9 }, (_, i) => { const x = 309 + i * 22.6; return `<path d="M${x} 216 V204 C${x} 197 ${x + 13} 197 ${x + 13} 204 V216Z"/>`; }).join('')}</g>
      <g fill="#FFE6C0" opacity=".6">${Array.from({ length:10 }, (_, i) => `<rect x="${302 + i * 22.6}" y="196" width="2" height="19"/>`).join('')}</g>
      <rect x="294" y="189" width="212" height="5" fill="#E8B07A" stroke="#8A5A30" stroke-width="1"/><path d="M296 194 H504" stroke="#6A3A1A" stroke-width="1.2" opacity=".5"/>
      <rect x="314" y="174" width="172" height="15" fill="url(#baPav)" stroke="#8A5A30" stroke-width="1.1"/>
      <g fill="#7A3E22">${Array.from({ length:7 }, (_, i) => { const x = 350 + i * 15.4; return `<path d="M${x} 189 V181 C${x} 176 ${x + 9} 176 ${x + 9} 181 V189Z"/>`; }).join('')}</g>
      ${[318, 466].map(x => `<g><rect x="${x}" y="176" width="16" height="11" fill="#F2C48E" stroke="#8A5A30" stroke-width=".8"/><path d="M${x - 2} 176 Q${x + 8} 168 ${x + 18} 176Z" fill="#E8B07A" stroke="#8A5A30" stroke-width=".8"/><g fill="#6A3420"><rect x="${x + 3}" y="179" width="3" height="6" rx="1.4"/><rect x="${x + 10}" y="179" width="3" height="6" rx="1.4"/></g><path d="M${x - 1} 187 h18" stroke="#8A5A30" stroke-width="1.6"/></g>`).join('')}
      <g fill="#F2C48E" stroke="#8A5A30" stroke-width=".7">${Array.from({ length:15 }, (_, i) => `<rect x="${316 + i * 11.4}" y="169.4" width="5" height="4.6"/>`).join('')}</g>
      <path d="M316 176 H484" stroke="#FFF2D8" stroke-width="1" opacity=".7"/>
      ${brilhoHotspot(492, 182)}
    </g>
    <!-- poço -->
    <path d="${poli(regiao)}" fill="#7A4A2A"/>
    <g id="ba-paredes">${paredes}</g>
    <path id="ba-cascata" d="M508 226 V230" stroke="#BFF0FF" stroke-width="4" fill="none" stroke-dasharray="5 6" stroke-linecap="round" style="opacity:0;transition:opacity .8s"/>
    <rect width="800" height="500" fill="url(#baSombra)" clip-path="url(#baPocoC)" pointer-events="none"/>
    <g id="ba-agua" class="toque">
      <path id="ba-ag-sec" d="M0 0" fill="url(#baAg)" opacity=".56"/>
      <path id="ba-ag-sup" d="M0 0" fill="url(#baAs)" opacity=".5"/>
      <g clip-path="url(#baAguaC)" pointer-events="none"><rect id="ba-caus" x="160" y="200" width="520" height="300" fill="url(#baCaus)" opacity=".2"/><g><rect id="ba-caus2" x="160" y="206" width="520" height="300" fill="url(#baCaus)" opacity=".2"/></g></g>
      <path id="ba-ag-fundo" d="M0 0" stroke="#E6FFFF" stroke-width="1" fill="none" opacity=".6"/>
      <path id="ba-ag-borda" d="M0 0" stroke="#E6FFFF" stroke-width="2" fill="none" opacity=".95"/>
    </g>
    <g id="ba-criancas">${[[189, .72, '#7A4A2A', '#FFC83D', '#2E6AB0', '#1A1410', false], [189, .42, '#9A6440', '#2EAE8A', '#E84A8A', '#1A1410', true]].map(([x, d, pe, ca, sh, cb, mn], i) => { const q = P(x, d, 1), sc = (1 - .17 * d) * 1.4; return `<g class="ba-cr toque" data-i="${i}" style="opacity:0;transition:opacity 1s;pointer-events:none"><g transform="translate(${F(q[0])} ${F(q[1])}) scale(${sc.toFixed(3)})"><g class="ba-cr-in">${crianca(pe, ca, sh, cb, mn)}</g><rect x="-8" y="-30" width="16" height="32" fill="transparent"/></g></g>`; }).join('')}</g>
    <path d="${linha([P(-W(0), 0, 0), P(-W(0), D(0), 0), P(W(0), D(0), 0), P(W(0), 0, 0)])}" stroke="#B87E4A" stroke-width="6" fill="none" stroke-linejoin="round"/>
    <path d="${linha([P(-W(0), 0, 0), P(-W(0), D(0), 0), P(W(0), D(0), 0), P(W(0), 0, 0)])}" stroke="#F8DCAC" stroke-width="2.4" fill="none" stroke-linejoin="round" transform="translate(0 -1.4)"/>
    <!-- terra cortada -->
    <g clip-path="url(#baSoloC)" id="ba-solo">
      <rect x="0" y="292" width="800" height="208" fill="#C98E54"/>
      <path d="M0 298 C160 302 300 296 400 300 C520 304 660 296 800 300" stroke="#A86E3A" stroke-width="1" fill="none" opacity=".45"/>
      <path d="M0 312 C120 306 260 316 400 310 C540 304 680 314 800 308 V500 H0Z" fill="#E2B67E"/>
      <path d="M0 312 C120 306 260 316 400 310 C540 304 680 314 800 308" stroke="#F6D8A8" stroke-width="2" fill="none" opacity=".7"/>
      <g fill="#C8975E" opacity=".55">${Array.from({ length:34 }, () => `<circle cx="${F(R(0, 800))}" cy="${F(R(320, 362))}" r="${F(R(.8, 1.5))}"/>`).join('')}</g>
      <path d="M0 370 C140 364 260 374 400 368 C540 362 660 372 800 366 V500 H0Z" fill="#C77A62"/>
      <path d="M0 370 C140 364 260 374 400 368 C540 362 660 372 800 366" stroke="#E2A088" stroke-width="2" fill="none" opacity=".6"/>
      <g stroke="#A85A48" stroke-width="1.2" fill="none" opacity=".45" stroke-linecap="round"><path d="M0 388 C200 382 400 394 800 384"/><path d="M0 406 C220 402 420 412 800 402"/><path d="M60 396 C120 394 160 398 220 396 M520 392 C580 390 640 394 720 392"/></g>
      <path d="M0 428 C140 424 280 432 400 428 C540 424 680 432 800 426 V500 H0Z" fill="#A88A70"/>
      <path d="M0 428 C140 424 280 432 400 428 C540 424 680 432 800 426" stroke="#C8AE94" stroke-width="2" fill="none" opacity=".6"/>
      <g>${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(438, 496), rx = R(3, 6.4); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(rx)}" ry="${F(rx * R(.55, .75))}" fill="${['#C2A88E', '#B89C82', '#CDB49A'][Math.floor(R(0, 3))]}" opacity=".8"/><ellipse cx="${F(x - rx * .25)}" cy="${F(y - rx * .2)}" rx="${F(rx * .4)}" ry="${F(rx * .2)}" fill="#E6D4BE" opacity=".6"/>`; }).join('')}</g>
      <g stroke="#7A5232" stroke-width="1.1" fill="none" opacity=".6" stroke-linecap="round">${[30, 90, 150, 640, 700, 760].map(x => `<path d="M${x} 292 q-4 10 2 18 q4 6 -2 12 M${x + 4} 296 q6 6 4 14"/>`).join('')}</g>
      <g id="ba-lencol"><rect id="ba-lencol-r" x="0" y="480" width="800" height="40" fill="#2E6AC8" opacity=".26"/><rect id="ba-lencol-b" x="0" y="480" width="800" height="40" fill="url(#baLencolG)"/><rect id="ba-lencol-p" x="0" y="480" width="800" height="40" fill="url(#baPoros)"/><path id="ba-lencol-l" d="M0 0 ${Array.from({ length:41 }, () => 'q5 -2.4 10 0 q5 2.4 10 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.4" fill="none" transform="translate(0 480)"/></g>
      <rect x="0" y="292" width="800" height="6" fill="#6E9A3A" opacity=".35"/>
    </g>
    <path d="${poli(solo)}" fill="none" stroke="#5E3418" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M0 292.6 H200 M600 292.6 H800" stroke="#FFE6B8" stroke-width="1.6" opacity=".8"/>
    <!-- johad -->
    <g id="ba-johad">
      <ellipse cx="690" cy="258" rx="58" ry="12" fill="#B88A58" stroke="#8A5E34" stroke-width="1.2"/>
      <path d="M650 256 l10 3 l8 -4 M676 262 l10 -3 l9 4 l10 -2 M716 256 l10 3 l8 -2" stroke="#7A5030" stroke-width="1" fill="none" opacity=".8"/>
      <g id="ba-lago" style="transform-box:fill-box;transform-origin:50% 50%;transform:scale(0)"><ellipse cx="690" cy="257" rx="55" ry="10.6" fill="url(#baLagoG)" stroke="#1E6A9A" stroke-width="1.2"/><path d="M660 255 h20 M700 259 h16" stroke="#E6FFFF" stroke-width="1.3" stroke-linecap="round"/></g>
      <path d="${monte(0, .2)}" fill="url(#baMonte)" stroke="#5E3A1A" stroke-width="1.2"/><path d="${monte(.8, 1)}" fill="url(#baMonte)" stroke="#5E3A1A" stroke-width="1.2"/>
      ${SLOTS.map((sl, i) => `<g class="ba-vaga" data-i="${i}"><path class="ba-fant" d="${monte(sl.a, sl.b)}" fill="#FFF6E0" fill-opacity=".25" stroke="#FFF6E0" stroke-width="1.4" stroke-dasharray="4 3" style="opacity:0"/><path class="ba-cheio" d="${monte(sl.a, sl.b)}" fill="url(#baMonte)" stroke="#5E3A1A" stroke-width="1.2" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .6s cubic-bezier(.3,1.6,.5,1)"/><g class="ba-hint" style="display:none">${brilhoHotspot(+F(sl.c[0]), +F(sl.c[1] - 12))}</g></g>`).join('')}
      <g class="ba-verdeja" style="opacity:0;transition:opacity 2.4s">${[.08, .3, .5, .7, .92].map(t => { const [x, y] = bez(t); return tufo(+F(x), +F(y - 4), .7, '#9AD050', '#3E7A22'); }).join('')}${tufo(636, 252, .9, '#7AC04A', '#2E6A1E')}${tufo(744, 250, .9, '#7AC04A', '#2E6A1E')}</g>
    </g>
    <g id="ba-ras">${ra(620, 290, 1.15, 0)}${ra(632, 266, 1, 1)}${ra(748, 266, 1, 2)}</g>
    <g id="ba-construtores" style="opacity:0;transition:opacity 1.2s"><g transform="translate(614 256) scale(1.25) translate(-614 -256)">${construtor(614, 256)}</g><g transform="translate(770 252) scale(1.25) translate(-770 -252)">${construtora(770, 252)}</g></g>
    <g id="ba-terras">${TERRA.map((t, i) => `<g class="ba-terra toque" data-i="${i}" transform="translate(${t.x} ${t.y})" style="display:none;cursor:grab">${torrao}<circle r="22" fill="transparent"/></g>`).join('')}</g>
    <!-- gente e pavão (esquerda, na frente) -->
    <g id="ba-mulher" class="toque">${mulher(146, 274)}<rect x="130" y="198" width="32" height="76" fill="transparent"/></g>
    <g id="ba-menino" class="toque">${menino(186, 268)}<rect x="172" y="214" width="28" height="56" fill="transparent"/></g>
    <g class="toque" data-fig="cantaro" id="ba-potes"><svg x="96" y="262" width="28" height="30" viewBox="0 0 100 110"><use href="#f-cantaro"/></svg><svg x="116" y="272" width="20" height="22" viewBox="0 0 100 110"><use href="#f-cantaro"/></svg>${brilhoHotspot(124, 260)}</g>
    <g id="ba-pavao" class="toque" data-fig="pavao"><g id="ba-pav-in" style="transform-box:fill-box;transform-origin:50% 100%"><g class="balanca" style="animation-duration:4.2s"><svg x="0" y="206" width="94" height="87" viewBox="0 0 130 120"><use href="#f-pavao"/></svg></g></g>${brilhoHotspot(84, 214)}</g>
    <g>${tufo(10, 293, 1.3, '#C8B860', '#7A6A2E')}${tufo(214, 293, 1.1, '#C8B860', '#7A6A2E')}${tufo(612, 293, 1.2, '#C8B860', '#7A6A2E')}${tufo(788, 293, 1.3, '#C8B860', '#7A6A2E')}</g>
    <!-- a menina -->
    <g id="ba-menina" class="toque" style="cursor:grab"><g id="ba-men-pos"><g class="ba-men-in">${menina()}</g><rect x="-14" y="-50" width="28" height="52" fill="transparent"/></g><g id="ba-men-hint" style="display:none"></g></g>
    <!-- nuvens e vento -->
    <g id="ba-vento" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" style="opacity:.7;transition:opacity 1.5s">${[[20, 120, 250, 90], [10, 160, 230, 150], [60, 60, 270, 46]].map(([x0, y0, x1, y1], i) => `<path class="ba-vt" d="M${x0} ${y0} C${x0 + 70} ${y0 - 30} ${x1 - 80} ${y1 + 30} ${x1} ${y1}" stroke-dasharray="14 12"/><path d="M${x1 - 10} ${y1 - 6} l10 6 l-10 6" opacity=".9"/>`).join('')}</g>
    <g id="ba-nuvens">${NUV.map((n, i) => nuvem(i, n)).join('')}</g>
    <g id="ba-mao" pointer-events="none"><path d="M170 96 C220 60 270 60 300 70" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M304 72 l-12 6 l2 -12Z" fill="#fff"/></g>
    <g id="ba-calor" pointer-events="none" style="opacity:0;transition:opacity 2.5s"><rect width="800" height="292" fill="#FF8A2E" opacity=".16"/>${[[120, 240], [660, 230], [300, 200]].map(([x, y]) => `<path class="ba-onda" d="M${x} ${y} q6 -6 12 0 t12 0 t12 0" stroke="#FFF2D0" stroke-width="2" fill="none" opacity=".7"/>`).join('')}</g>
    <rect width="800" height="500" fill="url(#baVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#baGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* ---------- água ---------- */
  const agSup = el(s, '#ba-ag-sup'), agSec = el(s, '#ba-ag-sec'), agBorda = el(s, '#ba-ag-borda'), agFundo = el(s, '#ba-ag-fundo'), clSup = el(s, '#ba-cl-sup'), clSec = el(s, '#ba-cl-sec');
  const lenR = el(s, '#ba-lencol-r'), lenB = el(s, '#ba-lencol-b'), lenP = el(s, '#ba-lencol-p'), lenL = el(s, '#ba-lencol-l'), cascata = el(s, '#ba-cascata');
  function desenhaAgua(){
    const [sup, sec] = aguaPaths(zw); agSup.setAttribute('d', sup); agSec.setAttribute('d', sec); clSup.setAttribute('d', sup); clSec.setAttribute('d', sec);
    const k = Math.min(NV - 1, Math.floor(zw)), a = P(-W(k), 0, zw), b = P(W(k), 0, zw), a2 = P(-W(k), D(k), zw), b2 = P(W(k), D(k), zw);
    agBorda.setAttribute('d', zw < NV ? `M${F(a[0])} ${F(a[1])} L${F(b[0])} ${F(b[1])}` : 'M0 0');
    agFundo.setAttribute('d', zw < NV ? `M${F(a[0])} ${F(a[1])} L${F(a2[0])} ${F(a2[1])} L${F(b2[0])} ${F(b2[1])} L${F(b[0])} ${F(b[1])}` : 'M0 0');
    const yl = 292 + zw * 28; lenB.setAttribute('y', F(yl)); lenB.setAttribute('height', '54'); lenR.setAttribute('y', F(yl)); lenR.setAttribute('height', F(Math.max(0, 500 - yl))); lenP.setAttribute('y', F(yl)); lenP.setAttribute('height', F(Math.max(0, 500 - yl))); lenL.setAttribute('transform', `translate(${(-(performance.now() / 60) % 20).toFixed(1)} ${F(yl)})`);
    const fundo = P(130, D(k), zw)[1]; cascata.setAttribute('d', `M508 226 V${F(fundo)}`);
  }
  desenhaAgua();
  const yAgua = () => { const k = Math.min(NV - 1, Math.floor(zw)); return [P(0, D(k), zw)[1], P(0, 0, zw)[1], W(k)]; };
  const chuvaEm = (x0, x1, y0, n, ms) => {
    for (let i = 0; i < n; i++) depois(i * ms / n, () => {
      const x = sorte(x0, x1); let chao;
      const [yb, yf, w] = yAgua();
      if (x > 400 - w * .86 && x < 400 + w * .86 && zw < NV) chao = sorte(yb + 2, yf - 2);
      else if (x > 232 && x < 568) chao = sorte(240, 300);
      else if (x > 630 && x < 750 && fase === 'chuva2') chao = sorte(250, 264);
      else chao = sorte(200, 290);
      c.add({ tipo:'chuva', x, y:y0 + sorte(-8, 8), vx:.8, vy:sorte(9, 12), chao, cor:'#4A8EF0' });
    });
  };
  const mao = el(s, '#ba-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  s.querySelectorAll('.ba-vt').forEach((v, i) => v.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-52 }], { duration:1400 + i * 300, iterations:Infinity }));
  s.querySelectorAll('.ba-onda').forEach((v, i) => v.animate([{ transform:'translateY(0)', opacity:.1 }, { transform:'translateY(-14px)', opacity:.8 }, { transform:'translateY(-28px)', opacity:0 }], { duration:2400 + i * 500, iterations:Infinity }));
  cascata.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-22 }], { duration:500, iterations:Infinity });
  el(s, '#ba-caus').animate([{ transform:'translate(0,0)' }, { transform:'translate(-40px,0)' }], { duration:5200, iterations:Infinity });
  el(s, '#ba-caus2').animate([{ transform:'translate(-40px,0)', opacity:.04 }, { transform:'translate(-20px,0)', opacity:.18 }, { transform:'translate(0,0)', opacity:.04 }], { duration:3800, iterations:Infinity });
  const verdeja = op => s.querySelectorAll('.ba-verdeja').forEach(g => g.style.opacity = op);
  const trovao = () => { if (somOn) { try { ruido(1.4, 'lowpass', 180, .22); } catch (e) {} } };
  /* pavão dança */
  let dancando = false;
  function danca(fala){
    if (fala) api.diz(fala);
    if (dancando) return; dancando = true;
    if (somOn) { tom(620, 0, .34, 'triangle', .07, 980); tom(980, .4, .42, 'triangle', .06, 600); }
    el(s, '#ba-pav-in').animate([{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(-6px) rotate(-6deg)' }, { transform:'translateY(0) rotate(5deg)' }, { transform:'translateY(-6px) rotate(-5deg)' }, { transform:'translateY(0) rotate(4deg)' }, { transform:'translateY(-4px) rotate(-3deg)' }, { transform:'translateY(0) rotate(0)' }], { duration:1800, easing:'ease-in-out' }).onfinish = () => { dancando = false; };
    c.brilhos(48, 240, 6, '#7AE0C8');
    el(s, '#ba-pav-in').animate([{ filter:'brightness(1) saturate(1)' }, { filter:'brightness(1.25) saturate(1.6) hue-rotate(-12deg)' }, { filter:'brightness(1.05) saturate(1.2) hue-rotate(10deg)' }, { filter:'brightness(1.3) saturate(1.7)' }, { filter:'brightness(1) saturate(1)' }], { duration:1800, easing:'ease-in-out' });
    for (let i = 0; i < 12; i++) depois(i * 110, () => { const a = Math.PI * (1.04 + .92 * i / 11), r = sorte(30, 42); c.add({ tipo:'brilho', x:33 + Math.cos(a) * r * 1.05, y:262 + Math.sin(a) * r, cor:['#7AF0FF', '#FFE27A', '#9AFF9A'][i % 3] }); });
  }
  /* ---------- 1. a monção: arrastar as nuvens do mar para a terra ---------- */
  const nuvs = [...s.querySelectorAll('.ba-nuvem')], npos = NUV.map(n => ({ x:n.x, y:n.y, ok:false }));
  const poeN = i => nuvs[i].setAttribute('transform', `translate(${F(npos[i].x)} ${F(npos[i].y)})`);
  const voa = (i, x1, y1, ms, fim) => { const x0 = npos[i].x, y0 = npos[i].y; tween(ms, e => { npos[i].x = x0 + (x1 - x0) * e; npos[i].y = y0 + (y1 - y0) * e; poeN(i); }, fim); };
  let arrN = null;
  nuvs.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'vento' || npos[i].ok || npos[i].voando) return; e.stopPropagation();
    const p = c.ponto(e); arrN = { i, dx:p.x - npos[i].x, dy:p.y - npos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arrN) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arrN.x0, p.y - arrN.y0) > 8) arrN.moveu = true;
    npos[arrN.i].x = Math.max(40, Math.min(760, p.x - arrN.dx)); npos[arrN.i].y = Math.max(40, Math.min(150, p.y - arrN.dy)); poeN(arrN.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arrN) return; const { i, moveu } = arrN; arrN = null; nuvs[i].style.cursor = '';
    const n = NUV[i];
    if (!moveu || npos[i].x > 250) { npos[i].voando = true; voa(i, n.tx, n.ty, moveu ? 900 : 1700, () => chegaNuvem(i)); if (!moveu) api.diz('O vento leva a nuvem do mar para a terra!'); }
    else { voa(i, n.x, n.y, 700); api.diz('Arraste a nuvem até a terra seca, perto do poço!'); }
  });
  function chegaNuvem(i){
    npos[i].ok = true; nuvensOk++;
    el(nuvs[i], '.ba-ne').style.opacity = 1; el(nuvs[i], '.ba-nc').style.transition = 'opacity 1.6s'; el(nuvs[i], '.ba-nc').style.opacity = 0;
    el(s, '#ba-monsao').style.opacity = (.16 * nuvensOk).toFixed(2);
    trovao(); depois(500, () => toca('chuva'));
    chuvaEm(npos[i].x - 60 * NUV[i].s, npos[i].x + 60 * NUV[i].s, npos[i].y + 18, 90, 3600);
    chovendo++; cascata.style.opacity = 1; depois(4400, () => { if (--chovendo <= 0) cascata.style.opacity = 0; });
    alvoZw = [4.9, 3.0, 1.1][nuvensOk - 1]; taxa = 1.1;
    api.hud(`<span class="chip">Nuvens: ${nuvensOk}/3</span>`);
    if (nuvensOk === 1) { api.diz('É a monção! No verão, o vento sopra do oceano e traz nuvens cheias de chuva.'); verdeja(.5); }
    if (nuvensOk === 2) { api.diz('Olha o poço enchendo, andar por andar!'); danca(); }
    if (nuvensOk === 3) {
      fase = 'cheio'; verdeja(1); depois(1800, () => mostraRa(0, true));
      depois(3800, () => {
        toca('vitoria'); el(s, '#ba-arco').style.opacity = 1; el(s, '#ba-monsao').style.opacity = .1; danca();
        api.diz('Quase toda a chuva do ano cai em poucos meses. Por isso o povo daqui aprendeu a guardar cada gota!');
        depois(6400, comecaSeca);
      });
    }
  }
  /* ---------- 2. os meses secos: descer os degraus até a água ---------- */
  function comecaSeca(){
    fase = 'seca'; mostraRa(0, false); el(s, '#ba-vento').style.opacity = 0; el(s, '#ba-arco').style.opacity = 0; el(s, '#ba-monsao').style.opacity = 0; el(s, '#ba-calor').style.opacity = 1; verdeja(.25);
    nuvs.forEach((g, i) => { voa(i, 900 + i * 60, npos[i].y - 20, 3000 + i * 400); });
    api.hud('<span class="chip">Meses secos</span>');
    api.diz('Agora vêm os meses secos. Sem chuva, a água vai baixando...');
    alvoZw = ZW_SECA; taxa = .55;
    const espera = () => { if (Math.abs(zw - ZW_SECA) < .02) comecaDescida(); else depois(300, espera); };
    depois(1200, espera);
  }
  /* caminho da menina pelas escadas da parede esquerda */
  const way = [[-W(0) - 12, D(0) - .12, 0]];
  for (let k = 0; k < 6; k++) { const a = k % 2 ? .12 : D(k) - .12, b = k % 2 ? D(k) - .12 : .12; way.push([-W(k) + 7, a, k]); if (k < 5) way.push([-W(k) + 7, b, k + 1]); else { const f = ZW_SECA - .14 - 5; way.push([-W(k) + 7, a + (b - a) * f, 5 + f]); } }
  const amostras = [], fimLance = [];
  for (let j = 0; j < way.length - 1; j++) {
    const A = way[j], B = way[j + 1], pa = P(...A), pb = P(...B), n = Math.max(2, Math.ceil(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 2.5));
    for (let q = (j ? 1 : 0); q <= n; q++) { const t = q / n, x = A[0] + (B[0] - A[0]) * t, d = A[1] + (B[1] - A[1]) * t, z = A[2] + (B[2] - A[2]) * t, p = P(x, d, z); amostras.push({ x:p[0], y:p[1], sc:1 - .17 * d }); }
    if (j >= 1 && j % 2 === 1) fimLance.push(amostras.length - 1);
  }
  let cur = 0, vira = 1;
  const menG = el(s, '#ba-men-pos');
  function poeMenina(){
    const a = amostras[cur], b = amostras[Math.min(amostras.length - 1, cur + 2)], v = amostras[Math.max(0, cur - 2)];
    const dx = (b.x - v.x); if (Math.abs(dx) > .6) vira = dx > 0 ? 1 : -1;
    const k = a.sc * 1.3; menG.setAttribute('transform', `translate(${F(a.x)} ${F(a.y)}) scale(${(k * vira).toFixed(3)} ${k.toFixed(3)})`);
  }
  poeMenina();
  function comecaDescida(){
    fase = 'descer'; el(s, '#ba-calor').style.opacity = .55;
    api.hud('<span class="chip">Andares: 0/6</span>');
    api.diz('A água desceu, mas a escada chega até ela, em qualquer altura!');
    api.diz('Arraste a menina pelos degraus até a água!');
    const h = el(s, '#ba-men-hint'); h.style.display = '';
    h.innerHTML = `<path d="${linha(amostras.slice(0, fimLance[1]).filter((_, i) => i % 3 === 0).map(a => [a.x, a.y - 8]))}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="5 7" stroke-linecap="round" opacity=".9"/>${brilhoHotspot(+F(amostras[0].x + 12), +F(amostras[0].y - 50))}`;
    h.animate([{ opacity:.25 }, { opacity:1 }, { opacity:.25 }], { duration:1600, iterations:Infinity });
  }
  function irPara(j){
    if (j <= cur) return; cur = Math.min(amostras.length - 1, j); poeMenina();
    while (andares < 6 && cur >= fimLance[andares]) {
      andares++; toca('clique'); api.hud(`<span class="chip">Andares: ${andares}/6</span>`);
      if (andares === 3) api.diz('Quanto mais fundo, mais fresquinho. As paredes fazem sombra na água.');
    }
    if (cur >= amostras.length - 1 && fase === 'descer') chegouAgua();
  }
  let arrM = null;
  el(s, '#ba-menina').addEventListener('pointerdown', e => {
    e.stopPropagation();
    if (fase !== 'descer' || anda) { if (fase !== 'descer') { toca('pop'); api.diz(fase === 'johad' || fase === 'chuva2' ? 'A água do poço é de todos. Cada um pega só o que precisa.' : 'Eu venho buscar água no poço de degraus.'); } return; }
    const p = c.ponto(e); arrM = { x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); el(s, '#ba-men-hint').style.display = 'none';
  });
  s.addEventListener('pointermove', e => {
    if (!arrM) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arrM.x0, p.y - arrM.y0) > 6) arrM.moveu = true;
    let melhor = -1, md = 1e9;
    for (let j = cur; j < Math.min(amostras.length, cur + 40); j++) { const a = amostras[j], dd = Math.hypot(a.x - p.x, a.y - 29 * a.sc - p.y), nota = dd - .875 * (j - cur); if (dd < 80 && nota < md) { md = nota; melhor = j; } }
    if (melhor > cur) irPara(melhor);
  });
  s.addEventListener('pointerup', () => { if (!arrM) return; const m = arrM.moveu; arrM = null; if (!m) avanca(); });
  function avanca(){
    if (fase !== 'descer' || anda) return; anda = true; const alvo = fimLance[Math.min(5, andares)];
    (function passo(){ if (!vivo) return; if (cur < alvo && fase === 'descer') { irPara(cur + 1); requestAnimationFrame(passo); } else anda = false; })();
  }
  function chegouAgua(){
    fase = 'agua'; anda = false;
    const a = amostras[amostras.length - 1]; toca('splash');
    for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:a.x + 14 + i * 4, y:yAgua()[1] - 6, t:i * 3, cor:'#E6FFFF' });
    depois(500, () => { menG.querySelector('.ba-pq').style.display = 'none'; menG.querySelector('.ba-pc').style.display = ''; toca('glub'); c.brilhos(a.x, a.y - 60, 5, '#BFF0FF'); });
    api.diz('Lá no fundo, na sombra, a água fica fresquinha e evapora bem menos.');
    depois(3000, () => {
      api.diz('Ela leva a água para casa no cântaro de barro.');
      const ini = cur, t0 = performance.now();
      (function sobe(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 5600); cur = Math.round(ini * (1 - k)); poeMenina(); if (k < 1) requestAnimationFrame(sobe); else { vira = 1; poeMenina(); depois(800, comecaJohad); } })(t0);
    });
  }
  /* ---------- 3. o johad: murinho de terra que segura a chuva ---------- */
  const terras = [...s.querySelectorAll('.ba-terra')], tpos = TERRA.map(t => ({ x:t.x, y:t.y, foi:false })), vagas = [...s.querySelectorAll('.ba-vaga')], ocupada = [false, false, false];
  const poeT = (i, k) => terras[i].setAttribute('transform', `translate(${F(tpos[i].x)} ${F(tpos[i].y)}) scale(${k || 1})`);
  function comecaJohad(){
    fase = 'johad'; el(s, '#ba-construtores').style.opacity = 1;
    terras.forEach(t => t.style.display = ''); vagas.forEach(v => { el(v, '.ba-fant').style.opacity = 1; el(v, '.ba-hint').style.display = ''; });
    api.hud('<span class="chip">Johad: 0/3</span>');
    api.diz('E se a seca for longa? As vilas daqui constroem johads: murinhos de terra que seguram a água da chuva.');
    api.diz('Arraste a terra para montar o johad!');
  }
  let arrT = null;
  terras.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'johad' || tpos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arrT = { i, dx:p.x - tpos[i].x, dy:p.y - tpos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arrT) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arrT.x0, p.y - arrT.y0) > 6) arrT.moveu = true;
    tpos[arrT.i].x = Math.max(20, Math.min(790, p.x - arrT.dx)); tpos[arrT.i].y = Math.max(190, Math.min(300, p.y - arrT.dy)); poeT(arrT.i, 1.1);
  });
  s.addEventListener('pointerup', () => {
    if (!arrT) return; const { i, moveu } = arrT; arrT = null; terras[i].style.cursor = 'grab';
    let v = -1, md = 70;
    SLOTS.forEach((sl, j) => { if (ocupada[j]) return; const dd = Math.hypot(sl.c[0] - tpos[i].x, sl.c[1] - tpos[i].y); if (dd < md) { md = dd; v = j; } });
    if (!moveu) v = ocupada.indexOf(false);
    if (v < 0) { const t = TERRA[i], x0 = tpos[i].x, y0 = tpos[i].y; tween(600, e => { tpos[i].x = x0 + (t.x - x0) * e; tpos[i].y = y0 + (t.y - y0) * e; poeT(i); }); api.diz('Leve a terra até o tracejado do murinho!'); return; }
    ocupada[v] = true; tpos[i].foi = true; ocupado = true;
    const x0 = tpos[i].x, y0 = tpos[i].y, [x1, y1] = SLOTS[v].c;
    tween(560, (e, k) => { tpos[i].x = x0 + (x1 - x0) * e; tpos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 22; poeT(i, 1 - .3 * e); }, () => { ocupado = false; assenta(i, v); });
  });
  function assenta(i, v){
    terras[i].style.display = 'none'; const vg = vagas[v]; el(vg, '.ba-fant').style.opacity = 0; el(vg, '.ba-hint').style.display = 'none'; el(vg, '.ba-cheio').style.transform = 'scale(1)';
    toca('pop'); const [x, y] = SLOTS[v].c; for (let q = 0; q < 5; q++) c.add({ tipo:'respingo', x:x + sorte(-14, 14), y:y + sorte(-2, 3), t:q * 2, cor:'#8A5A2E' });
    blocos++; api.hud(`<span class="chip">Johad: ${blocos}/3</span>`);
    if (blocos === 1) api.diz('Isso! A terra bem socada vira um muro firme.');
    if (blocos === 3) {
      fase = 'nuvem2'; toca('ok'); api.diz('O johad está pronto! Agora só falta a chuva.');
      el(s, '#ba-vento').style.opacity = .7; const g = nuvs[0]; el(g, '.ba-nc').style.opacity = 1; el(g, '.ba-ne').style.opacity = 0; npos[0].x = -90; npos[0].y = 70; poeN(0);
      voa(0, 690, 96, 3200, () => {
        el(g, '.ba-ne').style.opacity = 1; el(g, '.ba-nc').style.opacity = 0; fase = 'chuva2'; el(s, '#ba-monsao').style.opacity = .3; el(s, '#ba-calor').style.opacity = 0;
        api.diz('Toque na nuvem para chover no johad!');
        const h = document.createElementNS('http://www.w3.org/2000/svg', 'g'); h.id = 'ba-nuv-hint'; h.innerHTML = brilhoHotspot(740, 74); s.appendChild(h);
      });
    }
  }
  nuvs[0].addEventListener('click', e => {
    if (fase !== 'chuva2' || ocupado) return; e.stopPropagation(); ocupado = true; fase = 'recarga';
    const h = el(s, '#ba-nuv-hint'); if (h) h.remove(); el(s, '#ba-vento').style.opacity = 0;
    trovao(); toca('chuva'); chuvaEm(600, 790, 116, 120, 4200); chovendo++; cascata.style.opacity = 1; depois(4600, () => { if (--chovendo <= 0) cascata.style.opacity = 0; }); depois(2200, () => toca('chuva'));
    tween(3600, e => { el(s, '#ba-lago').style.transform = `scale(${(.15 + .85 * e).toFixed(3)})`; });
    depois(1200, () => { el(s, '#ba-lago').style.transform = 'scale(.2)'; api.diz('A água da chuva fica presa no johad e não escorre embora.'); });
    depois(3600, recarga);
  });
  function recarga(){
    let n = 0;
    for (let i = 0; i < 28; i++) depois(i * 160, () => {
      const x = sorte(648, 732), yl = 292 + zw * 28 + 6;
      c.add({ tipo:'infiltra', x0:x, y0:262, x1:x + sorte(-6, 6), y1:yl, dur:sorte(70, 100), f:sorte(0, 6), chega:() => {
        const k = Math.min(NV - 1, Math.floor(zw)), xp = 400 + W(k) + 4, y2 = 292 + zw * 28 + 6;
        c.add({ tipo:'infiltra', x0:x, y0:y2, x1:xp, y1:y2, dur:sorte(60, 90), f:sorte(0, 6), chega:() => { alvoZw = Math.max(1.8, alvoZw - .14); taxa = .8; n++; if (n % 6 === 1) toca('glub'); } });
      } });
    });
    depois(1600, () => { verdeja(1); mostraRa(0, true); mostraRa(1, true); mostraRa(2, true); api.diz('Devagarinho, a água entra na terra e enche a água lá de baixo. O poço enche de novo!'); });
    depois(5200, () => { danca(); el(s, '#ba-arco').style.opacity = 1; el(s, '#ba-monsao').style.opacity = .08; voa(0, 980, 60, 3600); });
    const fim = () => {
      if (zw > 2.2) { depois(400, fim); return; }
      fase = 'fim'; toca('vitoria');
      api.hud('<span class="chip">Poço cheio!</span>');
      api.diz('Há mais de mil anos, o povo da Índia guarda a água da monção. Com poços de degraus e johads, até rios que tinham secado voltaram a correr!');
      depois(6800, api.fim);
    };
    depois(6000, fim);
  }
  /* ---------- toques extras ---------- */
  el(s, '#ba-pavao').addEventListener('click', () => { danca(fase === 'vento' ? 'Sou o Neel! Quando as nuvens da chuva chegam, eu abro o leque e danço.' : 'Meu leque tem mais de cem penas com desenhos de olhos!'); });
  let esqOcupado = false;
  el(s, '#ba-esquilo').addEventListener('click', e => { e.stopPropagation(); if (esqOcupado) return; esqOcupado = true;
    if (somOn) [0, .1, .2, .3].forEach(t => tom(2600, t, .05, 'square', .02, 3400));
    el(s, '#ba-esq-in').animate([{ transform:'translate(0,0) rotate(0)' }, { transform:'translate(14px,-2px) rotate(0)' }, { transform:'translate(20px,-8px) rotate(80deg)' }, { transform:'translate(21px,-30px) rotate(84deg)' }, { transform:'translate(21px,-30px) rotate(84deg)' }, { transform:'translate(20px,-8px) rotate(80deg)' }, { transform:'translate(0,0) rotate(0)' }], { duration:2600, easing:'ease-in-out' }).onfinish = () => { esqOcupado = false; };
    api.diz('É um esquilo-palmista: ele tem três listras nas costas e sobe nas árvores num instante!'); });
  let langOcupado = false;
  el(s, '#ba-langur').addEventListener('click', () => { if (langOcupado) return; langOcupado = true;
    if (somOn) { tom(900, 0, .12, 'square', .03, 1300); tom(1200, .14, .12, 'square', .03, 800); }
    const lp = el(s, '#ba-lang-pos');
    lp.animate([{ transform:'translate(0,0)' }, { transform:'translate(-60px,-70px)' }, { transform:'translate(-112px,-38px)' }], { duration:900, easing:'ease-in-out', fill:'forwards' }).onfinish = () => {
      depois(1600, () => { lp.animate([{ transform:'translate(-112px,-38px)' }, { transform:'translate(-60px,-70px)' }, { transform:'translate(0,0)' }], { duration:900, easing:'ease-in-out', fill:'forwards' }).onfinish = () => { langOcupado = false; }; }); };
    api.diz('O langur tem a cara preta e uma cauda mais comprida que o corpo!'); });
  el(s, '#ba-pavilhao').addEventListener('click', () => { toca('ok'); api.diz('Na Índia, o poço de degraus Chand Baori tem uns 3.500 degraus. São 13 andares!'); });
  el(s, '#ba-potes').addEventListener('click', () => { toca('pop'); api.diz('O pote de barro solta um pouquinho de água pelos furinhos. Ela evapora e deixa a água de dentro fresquinha.'); });
  el(s, '#ba-mulher').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('O poço de degraus também era lugar de encontro. Lá embaixo dava para descansar no fresquinho.'); });
  el(s, '#ba-menino').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ba-aceno').animate([{ transform:'rotate(0)' }, { transform:'rotate(-24deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 }); api.diz('Hoje a vila tem torneira e painel solar, mas a água ainda vem da chuva guardada na terra.'); });
  el(s, '#ba-vila').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('Muitas casas daqui são pintadas de azul. Dizem que a cor deixa a casa mais fresca.'); });
  el(s, '#ba-agua').addEventListener('click', e => { e.stopPropagation(); const p = c.ponto(e); toca('splash'); for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:i * 4, cor:'#E6FFFF' }); peixePula = { x:p.x, y:p.y, t:0 }; api.diz('Tem peixinhos morando no poço!'); });
  /* rãs que coaxam depois da chuva */
  const ras = [...s.querySelectorAll('.ba-ra')];
  function mostraRa(i, on){ const r = ras[i]; r.style.opacity = on ? 1 : 0; r.style.pointerEvents = on ? '' : 'none'; if (on && i !== 2) coaxa(i, true); }
  function coaxa(i, quieta){
    const r = ras[i];
    if (somOn) [0, .32].forEach(t => { tom(150 + i * 14, t, .2, 'sawtooth', .05, 110); tom(300 + i * 20, t + .02, .16, 'triangle', .03, 220); });
    el(r, '.ba-saco').animate([{ transform:'scale(.25)' }, { transform:'scale(1.15)' }, { transform:'scale(.4)' }, { transform:'scale(1.1)' }, { transform:'scale(.25)' }], { duration:760, easing:'ease-in-out' });
    el(r, '.ba-ra-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-2px)' }, { transform:'translateY(0)' }, { transform:'translateY(-2px)' }, { transform:'translateY(0)' }], { duration:760 });
    if (!quieta) api.diz('É a rã-touro-indiana! Na monção, o macho fica amarelo e enche dois balões azuis para coaxar.');
  }
  ras.forEach((r, i) => r.addEventListener('click', e => { e.stopPropagation(); coaxa(i); }));
  /* criançada pulando na água do poço */
  const crs = [...s.querySelectorAll('.ba-cr')]; let crVis = false; const crOcup = [false, false];
  crs.forEach((g, i) => g.addEventListener('click', e => {
    e.stopPropagation(); if (crOcup[i] || !crVis) return; crOcup[i] = true;
    const x = 189, d = i ? .42 : .72, sc = (1 - .17 * d) * 1.4, q0 = P(x, d, 1), q1 = P(x - 34, d, zw + .15), dx = (q1[0] - q0[0]) / sc, dy = (q1[1] - q0[1]) / sc;
    toca('pop');
    el(g, '.ba-cr-in').animate([{ transform:'translate(0,0) rotate(0)', opacity:1 }, { transform:`translate(${F(dx * .45)}px,-26px) rotate(-20deg)`, opacity:1, offset:.45 }, { transform:`translate(${F(dx)}px,${F(dy)}px) rotate(-40deg)`, opacity:1, offset:.85 }, { transform:`translate(${F(dx)}px,${F(dy + 8)}px) rotate(-40deg)`, opacity:0 }], { duration:900, easing:'ease-in' }).onfinish = () => {
      toca('splash'); for (let j = 0; j < 5; j++) c.add({ tipo:'respingo', x:q1[0] + sorte(-6, 6), y:q1[1] - 2, t:j * 2, cor:'#E6FFFF' });
      const inn = el(g, '.ba-cr-in'); inn.style.opacity = 0;
      depois(1500, () => { inn.animate([{ opacity:0 }, { opacity:1 }], { duration:600, fill:'forwards' }).onfinish = () => { inn.style.opacity = ''; crOcup[i] = false; }; });
    };
    api.diz(i ? 'Tchibum! No calor, a criançada se refresca na água do poço.' : 'Os degraus descem até a água. Dá para pular e nadar perto da escada!');
  }));
  const vigiaCr = () => { const v = zw < 3.2 && fase !== 'descer' && fase !== 'agua'; if (v !== crVis) { crVis = v; crs.forEach(g => { g.style.opacity = v ? 1 : 0; g.style.pointerEvents = v ? '' : 'none'; }); } };
  let aves = [];
  el(s, '#ba-nim').addEventListener('click', e => { e.stopPropagation(); if (aves.length) return; [1800, 2100, 1700, 2300].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'square', .025, f * 1.3), i * 120)); aves = Array.from({ length:6 }, (_, i) => ({ x:584 + sorte(-24, 24), y:172 + sorte(-10, 10), vx:-sorte(2.4, 3.4), vy:-sorte(.4, 1.2), f:sorte(0, 6) })); api.diz('Periquitos-de-colar! Eles moram nas árvores da vila.'); });
  /* ---------- quadro a quadro: nível da água, peixes e periquitos ---------- */
  let peixePula = null;
  const peixes = [0, 1, 2].map(i => ({ a:i * 2.1, v:.006 + i * .002, cor:['#FF8A3A', '#FFC83D', '#FF6A5A'][i] }));
  c.desenho(ctx => {
    const agora = performance.now(), dt = Math.min(.06, (agora - ultQ) / 1000); ultQ = agora;
    if (Math.abs(alvoZw - zw) > .0005) {
      const antes = Math.floor(zw); zw += Math.sign(alvoZw - zw) * Math.min(taxa * dt, Math.abs(alvoZw - zw));
      if (Math.floor(zw) !== antes && somOn) toca('glub');
    }
    desenhaAgua(); vigiaCr();
    const t = performance.now() / 1000;
    if (zw < 6.5) {
      const k = Math.min(NV - 1, Math.floor(zw)), cx0 = P(0, D(k) * .5, zw), rx = W(k) * .55, ry = (P(0, 0, zw)[1] - P(0, D(k), zw)[1]) * .28;
      peixes.forEach(p => {
        p.a += p.v; const x = cx0[0] + Math.cos(p.a) * rx, y = cx0[1] + Math.sin(p.a) * ry, ang = Math.atan2(Math.cos(p.a) * ry, -Math.sin(p.a) * rx);
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = .55; ctx.fillStyle = p.cor;
        const ab = Math.sin(t * 9 + p.a) * 1.6;
        ctx.beginPath(); ctx.ellipse(0, 0, 7, 3, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-11, -3.4 + ab); ctx.lineTo(-11, 3.4 + ab); ctx.closePath(); ctx.fill(); ctx.restore();
      });
    }
    if (peixePula) {
      const k = peixePula.t / 40; peixePula.t++;
      const x = peixePula.x + k * 22, y = peixePula.y - Math.sin(k * Math.PI) * 30;
      ctx.save(); ctx.translate(x, y); ctx.rotate(-1.2 + k * 2.4); ctx.globalAlpha = 1; ctx.fillStyle = '#FF8A3A'; ctx.strokeStyle = '#8A3A10'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 3.6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-12, -4); ctx.lineTo(-12, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(4.4, -.8, 1, 0, 7); ctx.fill(); ctx.restore();
      if (k >= 1) { c.add({ tipo:'respingo', x, y, t:0, cor:'#E6FFFF' }); peixePula = null; }
    }
    if (aves.length) {
      aves.forEach(a => {
        a.x += a.vx; a.y += a.vy + Math.sin(t * 6 + a.f) * .4;
        ctx.save(); ctx.translate(a.x, a.y); ctx.globalAlpha = 1;
        ctx.strokeStyle = '#2E8A2E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(16, 3); ctx.stroke();
        ctx.fillStyle = '#5ACB4A'; ctx.strokeStyle = '#1E6A1E'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 6, 3.4, 0, 0, 7); ctx.fill(); ctx.stroke();
        const fl = Math.sin(t * 22 + a.f) * 6; ctx.fillStyle = '#3EA83A'; ctx.beginPath(); ctx.moveTo(-1, -1); ctx.lineTo(3, -1); ctx.lineTo(2, -1 - fl); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#E5392C'; ctx.beginPath(); ctx.arc(-6.4, .6, 1.6, 0, 7); ctx.fill(); ctx.restore();
      });
      if (aves.every(a => a.x < -30)) aves = [];
    }
  });
  api.hud('<span class="chip">Nuvens: 0/3</span>');
  api.diz('Oi, eu sou o Neel, um pavão-indiano! Aqui no Rajastão, na Índia, quase não chove durante o ano.');
  api.diz('Arraste as nuvens do mar até a terra seca!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
