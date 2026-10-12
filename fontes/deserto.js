/* ================= JOGO 11: Desertos, bichos que guardam água ================= */
function jogoDeserto(palco, api){
  semente = 23;
  let vivo = true, fase = 'neblina', gotas = 0, chuvas = 0, achou = 0, goles = 0, ocupado = false, falaFeco = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tw = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k, k*k*(3-2*k)); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const lgd = (id, st, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 === undefined ? 1 : y2}">${st.map((c, i) => `<stop offset="${(i / (st.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const BES = [{ x:200, y:472 }, { x:292, y:482 }, { x:378, y:474 }];
  const VAGA = [{ x:402, y:268 }, { x:470, y:220 }, { x:580, y:208 }];
  const SUPB = 450, SUPC = 396;
  const COVA = [{ x:268, y:404 }, { x:440, y:410 }, { x:600, y:404 }];
  const FECO = [{ x:740, y:484 }, { x:78, y:470 }, { x:74, y:400 }];
  const SOL = [{ x:660, y:236, s:1.25 }, { x:712, y:78, s:.9 }, { x:176, y:128, s:1.1 }];
  /* ---------- desenhos ---------- */
  const besouro = (i, x, y) => `<g class="de-bes toque" data-i="${i}" data-fig="besouro" transform="translate(${x} ${y}) scale(1.2)" style="cursor:grab"><g class="de-bes-pose">
      <ellipse cx="2" cy="1" rx="25" ry="3.2" fill="#2A1020" opacity=".3"/>
      <g class="de-pernas" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#2E2440" stroke-width="1.7"><path d="M-6 -10 L-13 -18 L-19 -1 L-21 0"/><path d="M4 -9 L9 -17 L7 0 L9 .6"/><path d="M15 -10 L27 -19 L30 0 L33 .4"/></g>
        <g stroke="#0C0812" stroke-width="2.7"><path d="M-8 -9 L-18 -15 L-25 -.5 L-29 .6"/><path d="M1 -8 L-2 -14 L-7 .2 L-10 .8"/><path d="M11 -8 L22 -16 L33 0 L37 .6"/></g>
        <g stroke="#8E84B4" stroke-width=".8" opacity=".85"><path d="M-9 -10.2 L-17 -15"/><path d="M12 -9.4 L21 -15.8"/><path d="M-19 -13.6 L-24 -2"/><path d="M23 -14.6 L31 -2"/></g>
        <g fill="#0C0812"><circle cx="-18" cy="-15" r="1.6"/><circle cx="-2" cy="-14" r="1.4"/><circle cx="22" cy="-16" r="1.6"/></g>
      </g>
      <path d="M-22 -14 q-5 -6 -11 -7 M-21 -13 q-7 -2 -12 2" stroke="#120E18" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <g fill="#120E18"><circle cx="-33" cy="-21" r="1.3"/><circle cx="-31" cy="-21.3" r="1"/><circle cx="-33" cy="-11" r="1.3"/><circle cx="-31" cy="-11.4" r="1"/></g>
      <path d="M-6 -12 C-7 -22 2 -30 11 -30 C21 -30 27 -22 26 -15 C25 -9 18 -6 9 -6 C1 -6 -5 -8 -6 -12Z" fill="url(#deBes)" stroke="#06040A" stroke-width="1.5"/>
      <path d="M-3 -9 C4 -6.6 16 -6.6 24 -11" stroke="#7E72B0" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/>
      <path d="M-4 -17 C3 -27 17 -28 25 -17" stroke="#06040A" stroke-width=".9" fill="none" opacity=".7"/>
      <g fill="#C8BEEA" opacity=".42">${[[2, -21], [7, -24], [13, -25], [19, -22], [5, -15], [11, -17], [17, -15], [22, -14], [0, -12], [8, -10], [15, -10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".85"/>`).join('')}</g>
      <path d="M1 -24 C5 -28.4 12 -29 18 -27" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>
      <circle cx="3.4" cy="-21.6" r="1.3" fill="#FFFFFF" opacity=".85"/>
      <path d="M-14 -9 C-16 -15 -12 -20 -6 -20 C-2 -19 0 -15 -1 -10 C-3 -7 -10 -6 -14 -9Z" fill="url(#deBesCab)" stroke="#06040A" stroke-width="1.4"/>
      <path d="M-11 -16 C-9 -18.4 -6 -18.8 -4 -18" stroke="#B4AADC" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="-19.5" cy="-11" rx="6" ry="5.4" fill="url(#deBesCab)" stroke="#06040A" stroke-width="1.4"/>
      <path d="M-24.6 -8.4 l-2.6 1.4 M-24 -6.8 l-1.6 2" stroke="#06040A" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="-21.4" cy="-12.6" r="2.7" fill="#F4F0FF" stroke="#06040A" stroke-width=".7"/><circle cx="-22" cy="-12.4" r="1.7" fill="#120E18"/><circle cx="-22.6" cy="-13.2" r=".7" fill="#fff"/><circle cx="-21.3" cy="-11.6" r=".35" fill="#fff" opacity=".8"/>
      <path d="M-17 -15.4 C-16 -16.4 -14.6 -16.6 -13.6 -16" stroke="#9A90C4" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/>
      <g class="de-gotas">${[[12, -27], [4, -25.6], [20, -21], [-2, -17.6]].map(([gx, gy]) => `<g transform="translate(${gx} ${gy})"><g class="de-g" style="transform:scale(0)"><path d="M0 -4.2 C1.6 -2.2 3.2 -.6 3.2 1 A3.2 3.2 0 0 1 -3.2 1 C-3.2 -.6 -1.6 -2.2 0 -4.2Z" fill="url(#deGotaG)" stroke="#2E7BC4" stroke-width=".9"/><ellipse cx="-1.1" cy="-.2" rx=".8" ry="1.3" fill="#fff"/><circle cx="1.3" cy="2" r=".5" fill="#fff" opacity=".7"/></g></g>`).join('')}</g>
    </g><rect x="-36" y="-36" width="76" height="42" fill="transparent"/>${i === 1 ? brilhoHotspot(14, -38) : ''}</g>`;
  const feco = `<g id="de-feco-pula">
      <ellipse cx="6" cy="2" rx="44" ry="6.4" fill="#3A1A14" opacity=".26"/>
      <path d="M14 -6 C42 -2 60 -18 54 -42 C50 -56 36 -54 38 -42 C42 -28 32 -18 12 -18Z" fill="url(#deFcCauda)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 -10 C36 -10 48 -20 48 -34" stroke="#FFE8C4" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M54 -42 C50 -56 36 -54 38 -42 L40 -45 L42 -42 L44 -46 L47 -42 L50 -46 L52 -41Z" fill="#4A2A18" stroke="#2A140A" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M-22 -2 C-27 -24 -18 -46 0 -48 C18 -46 27 -24 22 -2Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2"/>
      <path d="M12 -40 C20 -32 23 -18 21 -4 C16 -10 14 -24 12 -40Z" fill="#B97A40" opacity=".35"/>
      <path d="M-10 -4 C-13 -20 -9 -32 -5 -37 L-3 -33 L-1 -38 L1 -33 L3 -38 L5 -33 L7 -36 C11 -28 13 -18 10 -4Z" fill="#FFF6E8"/>
      <path d="M-6 -24 q2 3 0 6 M4 -26 q-2 3 0 6 M-1 -16 q2 3 0 6" stroke="#EAD2B0" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <path d="M-12 -4 V-18 M10 -4 V-18" stroke="#D9A066" stroke-width="7" stroke-linecap="round"/>
      <path d="M-14 -16 V-6 M8 -16 V-6" stroke="#F4CE98" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="-12" cy="-2" rx="7.4" ry="4.2" fill="#FFF4E2" stroke="#8A5626" stroke-width="1.4"/><ellipse cx="10" cy="-2" rx="7.4" ry="4.2" fill="#FFF4E2" stroke="#8A5626" stroke-width="1.4"/>
      <path d="M-14.6 -.4 v-2.4 M-11.4 0 v-2.6 M7.4 -.4 v-2.4 M10.6 0 v-2.6" stroke="#B88A5A" stroke-width="1" stroke-linecap="round"/>
      <g class="de-orelha" style="transform-box:fill-box;transform-origin:80% 95%"><path d="M-10 -64 C-26 -80 -38 -104 -34 -120 C-20 -112 -6 -94 -1 -74Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/><path d="M-11 -70 C-22 -84 -30 -100 -30 -112 C-20 -103 -10 -90 -6 -76Z" fill="url(#deFcOrelha)"/><path d="M-12 -72 l-5 -2 M-14 -76 l-5 -1 M-16 -80 l-5 0 M-9 -74 l-1 -5" stroke="#FFF8EC" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><path d="M-30 -112 C-32 -104 -32 -96 -28 -88" stroke="#C88A5A" stroke-width="1.2" fill="none" opacity=".6"/></g>
      <g class="de-orelha" style="transform-box:fill-box;transform-origin:20% 95%"><path d="M10 -64 C26 -80 38 -104 34 -120 C20 -112 6 -94 1 -74Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/><path d="M11 -70 C22 -84 30 -100 30 -112 C20 -103 10 -90 6 -76Z" fill="url(#deFcOrelha)"/><path d="M12 -72 l5 -2 M14 -76 l5 -1 M16 -80 l5 0 M9 -74 l1 -5" stroke="#FFF8EC" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><path d="M30 -112 C32 -104 32 -96 28 -88" stroke="#C88A5A" stroke-width="1.2" fill="none" opacity=".6"/></g>
      <path d="M-22 -62 C-24 -78 -10 -84 0 -84 C10 -84 24 -78 22 -62 C20 -50 9 -44 0 -44 C-9 -44 -20 -50 -22 -62Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2"/>
      <path d="M-21 -60 L-27 -57 L-22 -55 L-26 -51 L-19 -51 C-20 -54 -21 -57 -21 -60Z M21 -60 L27 -57 L22 -55 L26 -51 L19 -51 C20 -54 21 -57 21 -60Z" fill="#FFF4E2" stroke="#C99A66" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M-16 -74 C-10 -80 -2 -81 6 -79" stroke="#FFEACB" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M-4 -82 l1 4 M1 -83 l0 4 M5 -82 l-1 4" stroke="#C88A50" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      <path d="M-10 -55 C-8 -62 8 -62 10 -55 C8 -46 -8 -46 -10 -55Z" fill="#FFF6E8"/>
      <ellipse cx="-14" cy="-56" rx="4" ry="2.4" fill="#FF8E8E" opacity=".5"/><ellipse cx="14" cy="-56" rx="4" ry="2.4" fill="#FF8E8E" opacity=".5"/>
      <g class="de-olhos"><ellipse cx="-8.5" cy="-65" rx="4.6" ry="5.6" fill="#1E120C"/><ellipse cx="8.5" cy="-65" rx="4.6" ry="5.6" fill="#1E120C"/><ellipse cx="-8.5" cy="-63.6" rx="3" ry="3.4" fill="#4A2C1A"/><ellipse cx="8.5" cy="-63.6" rx="3" ry="3.4" fill="#4A2C1A"/><circle cx="-7" cy="-67" r="1.8" fill="#fff"/><circle cx="10" cy="-67" r="1.8" fill="#fff"/><circle cx="-9.8" cy="-62.8" r=".8" fill="#fff" opacity=".85"/><circle cx="7.2" cy="-62.8" r=".8" fill="#fff" opacity=".85"/></g>
      <path d="M-13 -69.6 C-11 -71.4 -7 -71.6 -5 -70 M13 -69.6 C11 -71.4 7 -71.6 5 -70" stroke="#8A5626" stroke-width="1" fill="none" stroke-linecap="round" opacity=".6"/>
      <ellipse cx="0" cy="-56" rx="3.6" ry="2.5" fill="#1E120C"/><ellipse cx="-1" cy="-56.9" rx="1.2" ry=".7" fill="#fff" opacity=".85"/>
      <path d="M0 -53.6 v2 M0 -51.6 q-3 2.4 -5 .4 M0 -51.6 q3 2.4 5 .4" stroke="#5A3420" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <g stroke="#7A5638" stroke-width=".7" stroke-linecap="round" opacity=".6"><path d="M-6 -54 L-20 -57 M-6 -53 L-19 -51.6 M6 -54 L20 -57 M6 -53 L19 -51.6"/></g>
      <g fill="#8A5626" opacity=".55"><circle cx="-5" cy="-53.4" r=".5"/><circle cx="-6.6" cy="-54.6" r=".5"/><circle cx="5" cy="-53.4" r=".5"/><circle cx="6.6" cy="-54.6" r=".5"/></g>
    </g>`;
  const fronda = (x, y, a, L, cor, esc, luz) => {
    const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L * .5 + L * .42 * Math.abs(Math.cos(a)), mx = (x + ex) / 2, my = (y + ey) / 2 - L * .3;
    const B = t => [(1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * ex, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * ey];
    const D = t => { const dx = 2 * (1 - t) * (mx - x) + 2 * t * (ex - mx), dy = 2 * (1 - t) * (my - y) + 2 * t * (ey - my), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    const N = 13, A = [], Bs = [], f = v => v.toFixed(1);
    for (let k = 1; k < N; k++) {
      const t = k / N, [px, py] = B(t), [tx, ty] = D(t), nx = -ty, ny = tx, w = L * .2 * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), .7) + 1.5, cai = w * .5;
      A.push(`L${f(px + nx * w * .3)} ${f(py + ny * w * .3)} L${f(px + nx * w + tx * w * .8)} ${f(py + ny * w + ty * w * .8 + cai)}`);
      Bs.unshift(`L${f(px - nx * w + tx * w * .8)} ${f(py - ny * w + ty * w * .8 + cai)} L${f(px - nx * w * .3)} ${f(py - ny * w * .3)}`);
    }
    const d = `M${x} ${y} ${A.join(' ')} L${f(ex)} ${f(ey)} ${Bs.join(' ')}Z`;
    const rib = `M${x} ${y} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
    return `<path d="${d}" fill="${cor}" stroke="${esc}" stroke-width="1.3" stroke-linejoin="round"/><path d="${rib}" stroke="${esc}" stroke-width="2.2" fill="none" stroke-linecap="round"/>${luz ? `<path d="${rib}" stroke="${luz}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8" transform="translate(0 -1.4)"/>` : ''}`;
  };
  const palmeira = (x, y, h, inc, cor, esc, luz) => {
    const tx = x + inc, ty = y - h;
    let anel = '';
    for (let k = .08; k < .95; k += .07) { const px = x + inc * k * k, py = y - h * k; anel += `M${(px - 6).toFixed(1)} ${(py + 2).toFixed(1)} L${px.toFixed(1)} ${(py - 3).toFixed(1)} L${(px + 6).toFixed(1)} ${(py + 2).toFixed(1)} `; }
    const tronco = `M${x} ${y} Q${x} ${y - h * .5} ${tx} ${ty}`;
    const seca = [[2.25, 46], [.95, 44]].map(([a, L]) => fronda(tx, ty + 2, a, L * h / 150, '#C9964E', '#7A5222')).join('');
    const fr = [[-2.95, 64], [3.3, 44], [-.2, 66], [-2.45, 66], [-.65, 64], [-1.95, 58], [-1.25, 56]].map(([a, L], i) => fronda(tx, ty, a, L * h / 150, i % 2 ? cor : luz, esc, i % 2 ? luz : '#E8FFB0')).join('');
    const tamaras = [[-8, 12], [-4, 16], [0, 13], [4, 17], [8, 12], [-6, 20], [2, 21], [6, 22]].map(([dx, dy]) => `<ellipse cx="${(tx + dx).toFixed(1)}" cy="${(ty + dy).toFixed(1)}" rx="3" ry="3.8" fill="url(#deTamara)" stroke="#8A3E10" stroke-width=".9"/>`).join('');
    return `<g><ellipse cx="${x}" cy="${y + 2}" rx="28" ry="5" fill="#7A4A1A" opacity=".22"/>${seca}<path d="${tronco}" stroke="#5A3418" stroke-width="17" fill="none" stroke-linecap="round"/><path d="${tronco}" stroke="url(#deTronco)" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${anel}" stroke="#6E4220" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M${tx - 2} ${ty + 4} q-6 8 -6 14 M${tx + 2} ${ty + 4} q6 8 6 14" stroke="#E0A040" stroke-width="1.6" fill="none"/>${tamaras}${fr}<circle cx="${tx}" cy="${ty}" r="5" fill="${esc}"/></g>`;
  };
  const perna = (h, tras, fill, perto, p) => {
    const d = tras
      ? `M${h - 12} -86 C${h - 13} -66 ${h - 8} -54 ${h - 6} -44 C${h - 5} -36 ${h - 5} -30 ${h - 4.5} -24 C${h - 4} -18 ${h - 4} -12 ${h - 4.5} -8 C${h - 10} -6 ${h - 14} -3 ${h - 14} 0 H${h + 7} C${h + 7} -3 ${h + 5} -6 ${h + 3} -8 C${h + 3} -14 ${h + 3} -20 ${h + 4.5} -25 C${h + 7.5} -29 ${h + 8} -36 ${h + 6} -42 C${h + 12} -54 ${h + 15} -70 ${h + 13} -88Z`
      : `M${h - 10} -82 C${h - 11} -64 ${h - 6.5} -52 ${h - 5} -41 C${h - 7} -37 ${h - 7} -31 ${h - 5} -27 C${h - 4} -20 ${h - 4} -13 ${h - 4.5} -8 C${h - 10} -6 ${h - 14} -3 ${h - 14} 0 H${h + 7} C${h + 7} -3 ${h + 5} -6 ${h + 3} -8 C${h + 2.5} -13 ${h + 2.5} -20 ${h + 3.5} -27 C${h + 5.5} -31 ${h + 5.5} -37 ${h + 3.5} -41 C${h + 5} -52 ${h + 10} -64 ${h + 10} -82Z`;
    const ky = tras ? -28 : -34, kx = tras ? h + 3 : h - 1;
    return `<g class="de-dr-perna" data-p="${p}" data-x="${h}"><path d="${d}" fill="${fill}" stroke="#6E3E16" stroke-width="1.8" stroke-linejoin="round"/>
      <ellipse cx="${kx}" cy="${ky}" rx="5.4" ry="3.6" fill="${perto ? '#D9A464' : '#B07A40'}" opacity=".9"/><path d="M${kx - 4} ${ky - 1.6} q4 -2.6 8 0" stroke="#6E3E16" stroke-width="1" fill="none" opacity=".55"/>
      ${perto ? `<path d="M${h - 6} -74 C${h - 7} -60 ${h - 3} -50 ${h - 2} -42 M${h - 2} -24 V-12" stroke="#FFE4B4" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>` : ''}
      <path d="M${h - 13} -.6 C${h - 12} -4.6 ${h + 6} -4.6 ${h + 6.4} -.6Z" fill="${perto ? '#8A5A34' : '#6E4426'}" stroke="#4A2A12" stroke-width="1.2"/><path d="M${h - 3.4} -1 v-3.4" stroke="#4A2A12" stroke-width="1.1" stroke-linecap="round"/></g>`;
  };
  const dromedario = `<ellipse cx="8" cy="2" rx="80" ry="7.5" fill="#6A3A14" opacity=".26"/><ellipse cx="8" cy="1" rx="54" ry="4" fill="#4A2408" opacity=".18"/>
      <g id="de-dr-pernas-l">${perna(-20, false, 'url(#deDrPernaF)', false, 1)}${perna(52, true, 'url(#deDrPernaF)', false, 0)}</g>
      <g id="de-dr-pernas-p">${perna(-36, false, 'url(#deDrPerna)', true, 3)}${perna(38, true, 'url(#deDrPerna)', true, 2)}</g>
      <path d="M68 -94 C76 -82 77 -68 73 -56" stroke="#6E3E16" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M68 -94 C76 -82 77 -68 73 -56" stroke="#C99050" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M70 -60 C66 -54 67 -44 72 -40 C73 -45 76 -42 78 -40 C80 -46 79 -54 76 -60Z" fill="#5A3416" stroke="#3A1E0C" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-50 -84 C-54 -100 -44 -110 -28 -110 C-20 -134 -2 -150 16 -150 C36 -150 50 -132 54 -112 C66 -108 74 -96 72 -82 C70 -66 60 -58 46 -58 C28 -56 -4 -54 -26 -57 C-42 -60 -48 -70 -50 -84Z" fill="url(#deDrCorpo)" stroke="#6E3E16" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M-44 -66 C-24 -60 10 -60 40 -62 C54 -63 64 -70 68 -76 C66 -64 58 -58 46 -58 C28 -56 -4 -54 -26 -57 C-36 -59 -42 -62 -44 -66Z" fill="#A86A30" opacity=".5"/>
      <path d="M40 -120 C50 -112 54 -100 50 -88 C58 -96 60 -110 54 -118Z" fill="#B87A3C" opacity=".3"/>
      <path d="M52 -106 C36 -102 26 -86 28 -62 M-22 -102 C-34 -96 -42 -82 -44 -64" stroke="#9A622A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>
      <path d="M48 -100 C38 -96 32 -86 32 -74" stroke="#FFE4B4" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>
      <path d="M-12 -128 C-4 -142 10 -147 22 -145" stroke="#FFEACA" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M-44 -96 C-38 -104 -30 -107 -22 -106" stroke="#FFE2B0" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M3 -146.6 C3 -153 8 -157 12 -153 C13 -160 21 -161 22 -154 C25 -158 31 -156 29 -149 C30 -147 29 -146 28 -146 C20 -149 10 -149 3 -146.6Z" fill="#C88A48" stroke="#6E3E16" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M8 -151 q2 -3 4 -2 M16 -154 q3 -3 5 -1 M24 -151 q2 -2 4 0" stroke="#F4CC8C" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <g stroke="#B07838" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".6"><path d="M-30 -82 q4 4 10 4 M10 -78 q6 3 12 2 M34 -86 q5 2 10 0 M-6 -120 q4 -2 8 -1 M24 -128 q4 1 7 4"/></g>
      <g id="de-dr-pesc">
        <path d="M-36 -100 C-46 -98 -56 -96 -64 -104 C-72 -112 -73 -150 -70 -178 L-93 -160 C-101 -140 -101 -108 -93 -90 C-85 -72 -64 -62 -46 -64 C-40 -66 -34 -72 -32 -80Z" fill="url(#deDrPesc)" stroke="#6E3E16" stroke-width="2.3" stroke-linejoin="round"/>
        <path d="M-60 -98 C-66 -104 -68 -130 -66 -160" stroke="#FFE2B0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
        <path d="M-88 -92 C-80 -78 -64 -70 -50 -70" stroke="#A86A30" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
        <path d="M-95 -148 C-104 -134 -106 -112 -98 -94 C-96 -90 -92 -90 -91 -93 C-97 -110 -97 -130 -95 -148Z" fill="#B87A3C"/>
        <g fill="none" stroke-linecap="round">${[-144, -137, -130, -123, -116, -109, -102, -95].map((y, k) => { const x = -100.6 - Math.sin((y + 150) / 60 * Math.PI) * 2.6; return `<path d="M${(x + 3).toFixed(1)} ${y} q-5 2 -${(6 + (k % 3)).toFixed(0)} ${(7 + (k % 2) * 2).toFixed(0)}" stroke="#8A5424" stroke-width="2.2"/><path d="M${(x + 3).toFixed(1)} ${y} q-5 2 -${(6 + (k % 3)).toFixed(0)} ${(7 + (k % 2) * 2).toFixed(0)}" stroke="#D49A58" stroke-width="1.1"/>`; }).join('')}</g>
        <path d="M-70 -184 C-76 -191 -90 -192 -98 -186 C-104 -181 -110 -175 -113 -168 C-115 -162 -113 -157 -107 -156 C-100 -155 -91 -158 -84 -160 C-76 -162 -66 -168 -66 -177 C-66 -180 -68 -182 -70 -184Z" fill="url(#deDrCab)" stroke="#6E3E16" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M-113 -165 C-117 -160 -116 -154 -110 -153 C-107 -152.6 -105 -154 -104.6 -156 C-104 -153 -101 -152 -98 -153.4 C-96 -154.6 -97 -157.6 -99 -158.4 C-104 -160 -109 -161 -113 -165Z" fill="#D6A066" stroke="#6E3E16" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M-104.6 -156 L-105 -159.6" stroke="#6E3E16" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M-108 -152 C-105 -150 -100 -150 -97 -152" stroke="#8A5226" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M-110.4 -169.4 C-108.6 -170.6 -107 -170.2 -106.2 -168.4" stroke="#3A1E0C" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="-74" cy="-188" rx="4.6" ry="3.8" transform="rotate(-20 -74 -188)" fill="url(#deDrPesc)" stroke="#6E3E16" stroke-width="1.5"/><ellipse cx="-73.6" cy="-188.2" rx="2.2" ry="1.6" transform="rotate(-20 -74 -188)" fill="#C9826A"/>
        <ellipse cx="-88" cy="-176" rx="5.2" ry="4.4" fill="#FFFDF6" stroke="#6E3E16" stroke-width="1"/><circle cx="-89.2" cy="-175" r="3.3" fill="#2A160A"/><circle cx="-90.3" cy="-176" r="1.2" fill="#fff"/><circle cx="-88" cy="-173.6" r=".55" fill="#fff" opacity=".8"/>
        <path d="M-93.6 -177.2 C-91 -181.4 -85 -181.4 -82.4 -177 C-86 -178.2 -90 -178.2 -93.6 -177.2Z" fill="#DDA466" stroke="#6E3E16" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M-93.4 -177.6 q-3 -1.6 -4.6 -4.4 M-91 -179.4 q-2 -2.6 -2.4 -5.4 M-88 -180.2 q-.6 -3 0 -5.6 M-85 -179.6 q1 -2.8 2.6 -4.6" stroke="#3A1E0C" stroke-width="1.15" fill="none" stroke-linecap="round"/>
        <path d="M-96 -184 C-90 -187 -82 -186.6 -77 -183" stroke="#FFEFCC" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
        <ellipse cx="-99" cy="-165" rx="5" ry="2.8" fill="#FF9A8A" opacity=".42"/>
        <path d="M-72 -190 q1 -4 4 -5 q0 3 -2 5" fill="#8A5424" stroke="#6E3E16" stroke-width=".9"/>
      </g>
      <path d="M-40 -104 C-55 -104 -66 -93 -66 -78 C-66 -63 -55 -53 -40 -53 C-28 -53 -21 -63 -21 -78 C-21 -93 -28 -104 -40 -104Z" fill="#DEA664"/>
      <path d="M-63 -64 C-58 -56 -50 -53 -40 -53 C-34 -53 -29 -55 -26 -58" stroke="#6E3E16" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M-58 -94 C-62 -86 -62 -76 -58 -68" stroke="#A86A30" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".35"/>`;
  const pica = `<g id="de-pica-in"><ellipse cx="3" cy="14" rx="7" ry="2" fill="#1E2A10" opacity=".2"/>
      <path d="M5 12 L12 30 L8 29 L6 32 L2 16Z" fill="#2E2E36" stroke="#16161C" stroke-width="1"/><path d="M6 18 l3 -1 M7 22 l3 -1 M8 26 l3 -1" stroke="#F2F2F2" stroke-width="1"/>
      <path d="M-5 -6 C-8 2 -5 13 3 17 C9 19 13 13 12 4 C11 -4 6 -9 -1 -10Z" fill="url(#dePica)" stroke="#5A4A3A" stroke-width="1.3"/>
      <path d="M1 -7 C8 -6 13 2 12 11 C11 15 8 16 5 13 C3 6 2 -1 1 -7Z" fill="#26262E" stroke="#121218" stroke-width="1"/>
      <path d="M3 -3 l7 1 M3.6 1 l8 1 M4 5 l8 1 M4.4 9 l7 1 M5 12.6 l5 .6" stroke="#F6F6F6" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M-4 0 C-4 6 -2 11 2 14" stroke="#FFF4DA" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="-3.4" cy="-11" r="6.6" fill="url(#dePica)" stroke="#5A4A3A" stroke-width="1.3"/>
      <path d="M-6.4 -16.6 C-4.6 -18.6 -1 -18.6 .6 -16.6 C-1 -15 -4.6 -15 -6.4 -16.6Z" fill="#E5392C" stroke="#9A1E14" stroke-width=".7"/>
      <circle cx="-6.2" cy="-11.6" r="2" fill="#12121A"/><circle cx="-6.8" cy="-12.3" r=".75" fill="#fff"/>
      <path d="M-9.4 -11 L-18 -9 L-9.6 -7.2Z" fill="#45454E" stroke="#1E1E24" stroke-width=".8" stroke-linejoin="round"/><path d="M-10 -9.6 L-16 -9" stroke="#8A8A94" stroke-width=".6"/>
      <path d="M-5 -8 C-3 -6.6 -1 -6.6 1 -7.4" stroke="#C9B48E" stroke-width="1" fill="none" opacity=".8"/>
      <path d="M-3 8 l-6 1.4 M-3 8 l-5 3.4 M-1 11 l-6 1.4 M-1 11 l-5 3.6" stroke="#4A4A52" stroke-width="1.2" stroke-linecap="round"/>
    </g>`;
  const jerboa = `<g id="de-jer-in"><ellipse cx="2" cy="1" rx="14" ry="2.6" fill="#7A4A1A" opacity=".25"/><path d="M8 -6 C20 -4 30 -10 38 -18" stroke="#C9965A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M36 -16 c2 -4 6 -6 9 -4 c-1 4 -5 6 -9 4Z" fill="#2E1E14"/><path d="M38 -18 c3 -2 6 -1 7 1" stroke="#FFF4E2" stroke-width="1.6" fill="none"/>
      <path d="M2 -2 L8 0 L14 0" stroke="#A8743E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="2" cy="-10" rx="10" ry="9" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.4"/><path d="M-4 -4 C-2 -8 6 -8 8 -4 C6 -1 -2 -1 -4 -4Z" fill="#FFF4E2"/>
      <path d="M-8 -22 C-12 -32 -10 -40 -6 -42 C-2 -38 -2 -30 -4 -22Z" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.2"/><path d="M-7 -25 C-9 -32 -8 -37 -6 -39 C-4 -35 -4 -30 -5 -25Z" fill="#FFB0A8"/>
      <path d="M-2 -22 C0 -32 4 -38 8 -38 C10 -32 6 -26 2 -21Z" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.2"/><path d="M0 -24 C2 -31 5 -35 7 -35 C8 -31 5 -27 2 -23Z" fill="#FFB0A8"/>
      <circle cx="-6" cy="-17" r="7.4" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.4"/><circle cx="-9" cy="-18" r="2.6" fill="#1E120C"/><circle cx="-9.8" cy="-19" r=".9" fill="#fff"/><circle cx="-13.2" cy="-14.8" r="1.1" fill="#8A3E3E"/>
      <path d="M-6 -6 l-3 4" stroke="#A8743E" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const ganga = (x, y, f) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><ellipse cx="0" cy="3" rx="10" ry="2" fill="#7A4A1A" opacity=".25"/><path d="M8 -4 L18 -2 L8 0Z" fill="#8A6A44" stroke="#4E3A22" stroke-width=".8"/><ellipse cx="0" cy="-5" rx="11" ry="7" fill="url(#deGanga)" stroke="#5A4028" stroke-width="1.2"/><path d="M-6 -8 q4 3 8 0 q4 3 8 0" stroke="#FFF4D8" stroke-width="1.1" fill="none"/><path d="M-6 -2 C0 0 6 0 10 -2" stroke="#3A2A1A" stroke-width="1.6" fill="none"/><circle cx="-9" cy="-11" r="5" fill="#D9B07A" stroke="#5A4028" stroke-width="1.2"/><circle cx="-10.6" cy="-11.6" r="1.4" fill="#12121A"/><circle cx="-11" cy="-12" r=".5" fill="#fff"/><path d="M-13.6 -10.6 L-17 -9.6 L-13.6 -8.6Z" fill="#6E5A44"/><path d="M-2 2 v3 M2 2 v3" stroke="#6E5A44" stroke-width="1.2"/></g>`;
  /* areia de primeiro plano */
  const ondinhas = (x0, x1, y0, y1, n, cor, w) => Array.from({ length:n }, () => { const x = R(x0, x1), y = R(y0, y1), l = R(18, 46); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${(l / 4).toFixed(0)} -3 ${(l / 2).toFixed(0)} 0 t${(l / 2).toFixed(0)} 0" stroke="${cor}" stroke-width="${w || 1.4}" fill="none" stroke-linecap="round"/>`; }).join('');
  const raiz = 'M400 456 C370 460 330 462 290 466 C250 468 200 468 150 472 M290 466 C276 474 262 478 240 482 M400 456 C430 460 470 462 512 466 C556 470 600 470 650 474 M512 466 C528 474 546 478 566 482 M400 456 C396 466 392 474 386 484 M200 468 C186 472 172 476 160 482 M600 470 C616 476 630 478 646 482';
  const sagCostelas = (() => {
    let sulco = '', luz = '', are = '', esp = '';
    for (let k = -5; k <= 5; k++) {
      const th = k * Math.PI / 12, x = 400 + 25 * Math.sin(th), xm = 400 + 25 * Math.sin(th + Math.PI / 24), y0 = 180 + Math.abs(k) * 2.4;
      sulco += `M400 178 C${(400 + (x - 400) * .5).toFixed(1)} 179 ${x.toFixed(1)} ${y0 + 4} ${x.toFixed(1)} ${y0 + 20} V${SUPB - 3} `;
      if (k < 5 && th + Math.PI / 24 < 1.2) {
        if (k < 1) luz += `M${xm.toFixed(1)} ${y0 + 18} V${SUPB - 6} `;
        for (let y = y0 + 22 + (k & 1) * 7; y < SUPB - 8; y += 15) { are += `<circle cx="${xm.toFixed(1)}" cy="${y}" r="1.25"/>`; esp += `M${xm.toFixed(1)} ${y} l-3 -2.6 M${xm.toFixed(1)} ${y} l3 -2.6 M${xm.toFixed(1)} ${y} l0 3.6 M${xm.toFixed(1)} ${y} l-2.4 2.2 `; }
      }
    }
    const braco = (cx, y0, y1, xt, yt, lado) => {
      let s = '', l = '', a = '', e = '';
      [-11, -5.5, 0, 5.5, 11].forEach((o, j) => {
        const x = cx + o, yb = yt - o * lado * .9;
        s += `M${x} ${y0 + Math.abs(o) * .5} V${y1} Q${x} ${yb} ${xt} ${yb} `;
        if (j < 4) { const xm = x + 2.75; if (j < 2) l += `M${xm} ${y0 + 6} V${y1 - 2} `; for (let y = y0 + 12 + (j & 1) * 6; y < y1; y += 14) { a += `<circle cx="${xm}" cy="${y}" r="1.1"/>`; e += `M${xm} ${y} l-2.6 -2.2 M${xm} ${y} l2.6 -2.2 M${xm} ${y} l0 3 `; } }
      });
      return [s, l, a, e];
    };
    const bE = braco(333, 244, 312, 377, 338, 1), bD = braco(467, 206, 274, 423, 300, -1);
    return { sulco:sulco + bE[0] + bD[0], luz:luz + bE[1] + bD[1], are:are + bE[2] + bD[2], esp:esp + bE[3] + bD[3] };
  })();
  const florSag = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4.4" rx="3" ry="4.4" transform="rotate(${a})" fill="url(#deFlorSag)" stroke="#B8B090" stroke-width=".7"/>`).join('')}<circle r="2.6" fill="#F6C83A" stroke="#C08A1A" stroke-width=".7"/><circle cx="-.7" cy="-.8" r=".8" fill="#FFF4B0"/></g>`;
  const saguaro = `<g id="de-sag-in" style="transform-box:fill-box;transform-origin:50% 100%;transition:transform 1.8s cubic-bezier(.3,1.4,.5,1)">
      <path d="M377 352 C348 354 316 346 316 316 V250 C316 236 350 236 350 250 V310 C350 322 362 326 377 324Z" fill="url(#deSagB)" stroke="#22381A" stroke-width="2.3" stroke-linejoin="round"/>
      <path d="M423 314 C452 316 484 308 484 278 V212 C484 198 450 198 450 212 V272 C450 284 438 288 423 286Z" fill="url(#deSagB)" stroke="#22381A" stroke-width="2.3" stroke-linejoin="round"/>
      <rect x="374" y="176" width="52" height="${SUPB - 174}" rx="26" fill="url(#deSagA)" stroke="#22381A" stroke-width="2.4"/>
      <rect x="374" y="176" width="52" height="${SUPB - 174}" rx="26" fill="url(#deSagVol)"/>
      <path d="M377 352 C348 354 316 346 316 316 V250 C316 236 350 236 350 250 V310 C350 322 362 326 377 324Z M423 314 C452 316 484 308 484 278 V212 C484 198 450 198 450 212 V272 C450 284 438 288 423 286Z" fill="url(#deSagVol)"/>
      <path d="${sagCostelas.sulco}" stroke="#23401A" stroke-width="1.6" opacity=".55" fill="none" stroke-linecap="round"/>
      <path d="${sagCostelas.luz}" stroke="#E4F6B4" stroke-width="1.1" opacity=".45" fill="none" stroke-linecap="round"/>
      <path d="${sagCostelas.esp}" stroke="#E8DCB0" stroke-width=".65" opacity=".5" fill="none" stroke-linecap="round"/>
      <g fill="#F8F2D8" stroke="#8A8060" stroke-width=".4">${sagCostelas.are}</g>
      <path d="M382 200 C383 188 391 180 400 179" stroke="#EEFAC0" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M319 262 C319 250 323 244 330 243 M453 222 C453 210 457 204 464 203" stroke="#EEFAC0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      ${florSag(392, 182, .9)}${florSag(406, 177, 1)}${florSag(399, 171, .8)}${florSag(330, 241, .8)}${florSag(470, 203, .85)}
      <ellipse id="de-sag-furo" cx="410" cy="262" rx="0" ry="0" fill="#1E140C" stroke="#4E3418" stroke-width="1.6"/>
    </g>`;
  /* ---------- parte A: geometria da duna esculpida ---------- */
  const f1 = v => (+v).toFixed(1);
  const cub = (p0, p1, p2, p3, n) => Array.from({ length:n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]; });
  const samp = (a, t) => { const x = Math.max(0, Math.min(1, t)) * (a.length - 1), i = Math.min(a.length - 2, Math.floor(x)), k = x - i; return [a[i][0] + (a[i + 1][0] - a[i][0]) * k, a[i][1] + (a[i + 1][1] - a[i][1]) * k]; };
  const linha = pts => 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
  const PICO = [525, 196];
  const silL = cub(PICO, [490, 210], [440, 236], [400, 270], 24).concat(cub([400, 270], [290, 350], [120, 440], [-10, 470], 40).slice(1));
  const silR = cub(PICO, [545, 200], [590, 212], [650, 240], 24).concat(cub([650, 240], [710, 268], [760, 290], [820, 300], 30).slice(1));
  const arete = cub(PICO, [515, 262], [452, 340], [442, 510], 50);
  const D_SIL_L = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196', D_SIL_R = 'M525 196 C545 200 590 212 650 240 C710 268 760 290 820 300';
  const D_DUNA = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196 C545 200 590 212 650 240 C710 268 760 290 820 300 V510 H-10Z';
  const D_SOMBRA = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196 C515 262 452 340 442 510 H-10Z';
  const D_LUZ = 'M525 196 C545 200 590 212 650 240 C710 268 760 290 820 300 V510 H442 C452 340 515 262 525 196Z';
  const D_ARETE = 'M525 196 C515 262 452 340 442 510';
  const coons = (T, B, L, Rr) => (u, k) => { const t = T(u), b = B(u), l = L(k), r = Rr(k), t0 = T(0), t1 = T(1), b0 = B(0), b1 = B(1); return [0, 1].map(j => (1 - k) * t[j] + k * b[j] + (1 - u) * l[j] + u * r[j] - ((1 - u) * (1 - k) * t0[j] + u * (1 - k) * t1[j] + (1 - u) * k * b0[j] + u * k * b1[j])); };
  const faceLuz = coons(u => samp(silR, u), u => [442 + 378 * u, 510], k => samp(arete, k), k => [820, 300 + 210 * k]);
  const faceSom = coons(u => samp(silL, u), u => [442 - 452 * u, 510], k => samp(arete, k), k => [-10, 470 + 40 * k]);
  const ondasDuna = (F, n, k0, k1, a0, a1, fr) => { const out = []; for (let i = 0; i < n; i++) { const k = k0 + (k1 - k0) * Math.pow((i + R(.25, .75)) / n, 1.3), ph = R(0, 6.3), ph2 = R(0, 6.3), fq = fr * R(.8, 1.25), amp = a0 + (a1 - a0) * k; let u = R(0, .05); while (u < 1) { const len = R(.2, .5), seg = []; for (let v = u; v <= Math.min(1, u + len) + 1e-6; v += .01) { const p = F(v, k + .014 * Math.sin(v * 5 + ph2)); seg.push([p[0], p[1] + amp * Math.sin(v * fq + ph)]); } if (seg.length > 2) out.push({ d:linha(seg), k }); u += len + R(.03, .1); } } return out; };
  const desenhaOndas = (lst, esc, luz, w0, w1, o0, o1) => `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${lst.map(o => `<path d="${o.d}" stroke="${esc}" stroke-width="${f1(w0 + (w1 - w0) * o.k)}" opacity="${(o0 + (o1 - o0) * o.k).toFixed(2)}"/><path d="${o.d}" transform="translate(0 ${f1(-1 - o.k * 1.2)})" stroke="${luz}" stroke-width="${f1(.6 + o.k * .9)}" opacity="${(.35 + o.k * .3).toFixed(2)}"/>`).join('')}</g>`;
  const avalanches = () => [.07, .15, .24, .33, .44, .55, .66].map(u0 => { const km = R(.22, .5), w = R(.012, .02), L = [], Rt = []; for (let s = 0; s <= 16; s++) { const k = km * s / 16, e = Math.pow(Math.sin(Math.PI * Math.min(.999, s / 16 * .92 + .04)), .6) * w; L.push(faceSom(u0 - e, k)); Rt.unshift(faceSom(u0 + e, k)); } return `<path d="${linha(L.concat(Rt))}Z" fill="#D29AC0" opacity=".12"/>`; }).join('');
  const trilhaBes = (pts, cor) => pts.map((p, i) => { if (!i) return ''; const q = pts[i - 1], dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, s = i % 2 ? 1 : -1, o = 2.4 * (.6 + p[1] / 700); return `<path d="M${f1(p[0] + nx * o * s - dx / l)} ${f1(p[1] + ny * o * s - dy / l)} l${f1(dx / l * 1.8)} ${f1(dy / l * 1.8)}"/>`; }).join('');
  const pegada = (x, y, s, r) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${s} ${f1(s * .62)})"><path d="M-2.6 3.6 C-3.4 1 -1.6 -.2 0 -.2 C1.6 -.2 3.4 1 2.6 3.6 C1.4 4.6 -1.4 4.6 -2.6 3.6Z"/><ellipse cx="-3.2" cy="-1.8" rx="1.1" ry="1.4"/><ellipse cx="-1.1" cy="-3.4" rx="1.1" ry="1.4"/><ellipse cx="1.1" cy="-3.4" rx="1.1" ry="1.4"/><ellipse cx="3.2" cy="-1.8" rx="1.1" ry="1.4"/></g>`;
  const duna = (x, y, w, h, luz, som, cr) => { const px = x, py = y - h, L = x - w * .55, Rr = x + w * .5;
    const esq = `C${f1(L + w * .28)} ${f1(y - h * .18)} ${f1(px - w * .16)} ${f1(py + h * .1)} ${px} ${py}`, dir = `C${f1(px + w * .12)} ${f1(py + h * .12)} ${f1(Rr - w * .22)} ${f1(y - h * .12)} ${f1(Rr)} ${y}`, ar = `C${f1(px - w * .01)} ${f1(py + h * .42)} ${f1(px - w * .09)} ${f1(y - h * .3)} ${f1(px - w * .12)} ${y}`;
    return `<path d="M${f1(L)} ${y} ${esq} ${dir}Z" fill="${luz}"/><path d="M${f1(L)} ${y} ${esq} ${ar}Z" fill="${som}"/><path d="M${px} ${py} ${dir}" stroke="${cr}" stroke-width="1.5" fill="none" opacity=".75"/><path d="M${px} ${py} ${ar}" stroke="${cr}" stroke-width="1" fill="none" opacity=".55"/>`; };
  const costa = cub([-10, 334], [70, 330], [160, 322], [230, 316], 24).concat(cub([230, 316], [280, 311], [320, 306], [360, 302], 16).slice(1));
  const offCosta = (dy, a, f) => linha(costa.map((p, i) => [p[0], p[1] + dy * (.55 + .45 * (p[1] - 300) / 34) + Math.sin(i * f) * a]));
  const nevoaBanco = (pts, cor) => pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + r * .3}" rx="${f1(r * 1.45)}" ry="${f1(r * .62)}" fill="${cor}"/>`).join('');
  const BANCO = [[-40, 268, 30], [-8, 258, 32], [26, 262, 28], [58, 252, 32], [92, 260, 28], [124, 254, 30], [158, 262, 27], [190, 258, 26], [220, 266, 24], [250, 270, 20], [276, 276, 16], [300, 282, 12], [322, 288, 9]];
  const estrato = (x, y, w, h) => `<path d="M${x} ${y} C${x + w * .2} ${y - h} ${x + w * .7} ${y - h * 1.2} ${x + w} ${y - h * .2} C${x + w * .8} ${y + h * .5} ${x + w * .2} ${y + h * .6} ${x} ${y}Z" fill="url(#deEstrato)"/><path d="M${x + w * .12} ${y + h * .28} C${x + w * .4} ${y + h * .5} ${x + w * .75} ${y + h * .42} ${x + w * .92} ${y + h * .05}" stroke="#FFE4C4" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
  /* ---------- parte A: plantas e bichos do chão ---------- */
  const fita = (p0, p1, p2, p3, w0, w1, t0, t1, ond) => { const n = 18, A = [], B = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n, u = 1 - t; const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]; const dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]), dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]), l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2 * (1 + (ond || 0) * Math.sin(t * 17 + w0)); A.push([x - dy / l * w, y + dx / l * w]); B.unshift([x + dy / l * w, y - dx / l * w]); } return linha(A.concat(B)) + 'Z'; };
  const FOLHAS_WEL = [[[-6, -8], [-20, -24], [-46, -26], [-72, -16], 9, 13, 'E'], [[6, -8], [22, -24], [48, -26], [74, -14], 9, 13, 'D'], [[-6, -5], [-26, -9], [-54, -7], [-90, 0], 11, 16, 'E'], [[6, -5], [28, -10], [56, -8], [92, -1], 11, 16, 'D'], [[-4, -2], [-20, 5], [-46, 9], [-76, 15], 12, 15, 'E'], [[4, -2], [22, 5], [48, 10], [78, 14], 12, 15, 'D']];
  const welwitschia = FOLHAS_WEL.map(([a, b, c2, d, w0, w1, lado]) => { const pts = cub(a, b, c2, d, 14), fim = pts[14], pre = pts[13], dx = fim[0] - pre[0], dy = fim[1] - pre[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l; return `<path d="${fita(a, b, c2, d, w0, w1, 0, 1, .12)}" fill="url(#deWel${lado})" stroke="#3A4A1E" stroke-width="1.2" stroke-linejoin="round"/>${[-.3, -.1, .1, .3].map(o => `<path d="${linha(pts.slice(1, 14).map((q, j) => [q[0], q[1] + o * (w0 + (w1 - w0) * j / 14)]))}" stroke="${o < 0 ? '#E2F2A8' : '#3A4A1E'}" stroke-width=".7" fill="none" opacity="${o < 0 ? .5 : .32}"/>`).join('')}<g stroke="#A88A56" stroke-width="1.6" stroke-linecap="round" fill="none">${[-.35, 0, .35].map((o, k) => `<path d="M${f1(fim[0] - uy * w1 * o)} ${f1(fim[1] + ux * w1 * o)} q${f1(ux * 5 + k)} ${f1(uy * 5 + 1)} ${f1(ux * (7 + k * 2))} ${f1(uy * 7 + 2 - k)}"/>`).join('')}</g>`; }).join('');
  /* ---------- parte B: Sonora ---------- */
  const mesa = (x0, x1, top) => { const b = 300, h = b - top, yc = top + h * .55;
    const fx = y => (y - top) / (yc - top) * 6;
    let est = ''; [.18, .34, .52, .7, .86].forEach((q, j) => { const y = top + 4 + (yc - top - 4) * q, d = fx(y); est += `<path d="M${f1(x0 - d + 12)} ${f1(y)} H${f1(x1 + d)}" stroke="${j % 2 ? '#F2B49A' : '#A65450'}" stroke-width="${j % 2 ? 2.4 : 1.6}" opacity="${j % 2 ? .5 : .45}"/>`; });
    let sulcos = ''; for (let k = 0; k < 6; k++) { const x = x0 + 18 + (x1 - x0 - 30) * k / 5; sulcos += `M${f1(x)} ${top + 6} l${f1(R(-2, 2))} ${f1(h * .5 - 6)} `; }
    return `<path d="M${x0 - 6} ${f1(yc)} L${x1 + 6} ${f1(yc)} C${x1 + 20} ${f1(top + h * .72)} ${x1 + 44} ${b - 6} ${x1 + 66} ${b} L${x0 - 64} ${b} C${x0 - 40} ${b - 6} ${x0 - 20} ${f1(top + h * .72)} ${x0 - 6} ${f1(yc)}Z" fill="url(#deTalus)"/>
      <path d="M${x0 - 6} ${f1(yc)} C${x0 - 20} ${f1(top + h * .72)} ${x0 - 40} ${b - 6} ${x0 - 64} ${b} L${x0 - 20} ${b} C${x0 - 10} ${b - 10} ${x0} ${f1(top + h * .74)} ${x0 + 12} ${f1(yc)}Z" fill="#B87470" opacity=".45"/>
      <path d="M${x0} ${top + 4} L${x0 + 4} ${top} L${x1 - 4} ${top} L${x1} ${top + 4} L${x1 + 6} ${f1(yc)} L${x0 - 6} ${f1(yc)}Z" fill="url(#deMesa)"/>
      ${est}<path d="${sulcos}" stroke="#A85A52" stroke-width="1.2" opacity=".35" fill="none"/>
      <path d="M${x0} ${top + 4} L${x0 + 12} ${top + 4} L${x0 + 12} ${f1(yc)} L${x0 - 6} ${f1(yc)}Z" fill="url(#deMesaS)" opacity=".85"/>
      <path d="M${x0 - 2} ${top + 5} L${x0 + 4} ${top} L${x1 - 4} ${top} L${x1 + 2} ${top + 5}Z" fill="#F6C8B2" stroke="#C47E70" stroke-width="1"/>
      <path d="M${x0 + 8} ${top + .6} H${x1 - 6}" stroke="#FFE6D8" stroke-width="1.4" opacity=".8"/>`; };
  const sagLonge = (x, y, s, cor, luz) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 0 V-58 a4 4 0 0 1 8 0 V0Z M-4 -26 h-8 a4 4 0 0 1 -4 -4 V-42 a3.6 3.6 0 0 1 7.2 0 V-33 h4.8Z M4 -32 h8 V-48 a3.6 3.6 0 0 1 7.2 0 V-32 a4 4 0 0 1 -4 4 H4Z" fill="${cor}"/><path d="M-1.6 -4 V-56" stroke="${luz}" stroke-width="1.6" opacity=".7"/></g>`;
  const nuvemChuva = x => { const C = [[x - 52, 66, 22], [x - 24, 50, 30], [x + 12, 44, 34], [x + 46, 58, 26], [x + 66, 70, 16], [x - 70, 76, 14]];
    return `${C.map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r + 2.4}" fill="#4A5474"/>`).join('')}<ellipse cx="${x - 2}" cy="78" rx="78" ry="16" fill="#4A5474"/>${C.map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="url(#deNuvC)"/>`).join('')}<ellipse cx="${x - 2}" cy="78" rx="75.6" ry="13.6" fill="#7C88A6"/><path d="M${x - 70} 82 C${x - 40} 92 ${x + 40} 92 ${x + 72} 80" stroke="#5E6A8A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>${C.slice(0, 4).map(([a, b, r]) => `<path d="M${f1(a - r * .6)} ${f1(b - r * .45)} q${f1(r * .5)} ${f1(-r * .45)} ${f1(r * 1.1)} ${f1(-r * .1)}" stroke="#F4F6FC" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}`; };
  /* ---------- cena ---------- */
  semente = 23;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Desertos do mundo: dunas do Namibe com neblina, o cacto saguaro no deserto de Sonora e um oásis no Saara">
    <defs>
      ${lgd('deCeu0', ['#33407E', '#8A62A0', '#E88E8C', '#FFC69A', '#FFE4C0'])}
      ${lgd('deCeu1', ['#2D82D8', '#6DBBEF', '#BFE4F6', '#FFF0D2'])}
      ${lgd('deCeu2', ['#4E70C2', '#B8A4CC', '#F6BE86', '#FFE0A6'])}
      <radialGradient id="deSolG"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".9"/><stop offset=".4" stop-color="#FFD98A" stop-opacity=".45"/><stop offset="1" stop-color="#FFC870" stop-opacity="0"/></radialGradient>
      <radialGradient id="deSolD" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#FFD860"/><stop offset="1" stop-color="#FFA830"/></radialGradient>
      ${lgd('deMar', ['#D8CCE6', '#AEB0DA', '#7A8CC6', '#5E74B6'])}
      ${lgd('deDuLonge', ['#E9A898', '#D88E86'])}
      ${lgd('deDuMeio', ['#F0A274', '#D9805C'])}
      ${lgd('dePlanA', ['#E89A6C', '#C9704E'])}
      <linearGradient id="deDuLuz" gradientUnits="userSpaceOnUse" x1="520" y1="200" x2="760" y2="510"><stop offset="0" stop-color="#FFCB8E"/><stop offset=".28" stop-color="#FAAA66"/><stop offset=".62" stop-color="#EE8C4E"/><stop offset="1" stop-color="#D2683A"/></linearGradient>
      <linearGradient id="deDuSombra" gradientUnits="userSpaceOnUse" x1="500" y1="210" x2="140" y2="510"><stop offset="0" stop-color="#BC7A92"/><stop offset=".25" stop-color="#9C6890"/><stop offset=".6" stop-color="#7C5486"/><stop offset="1" stop-color="#5A3C70"/></linearGradient>
      <radialGradient id="deBes" cx=".32" cy=".22" r=".85"><stop offset="0" stop-color="#9A94C2"/><stop offset=".3" stop-color="#433A5C"/><stop offset=".7" stop-color="#1C1628"/><stop offset="1" stop-color="#0A0610"/></radialGradient>
      ${lgd('deFcPelo', ['#FBE2B6', '#EDBE80', '#D9A060'])}
      ${lgd('deFcOrelha', ['#FFD0C4', '#F49A9A'])}
      ${lgd('deMesa', ['#EE9E7E', '#D67A60', '#C2664E'])}
      ${lgd('deMesaL', ['#E8B0A0', '#D49488'])}
      ${lgd('dePlanB', ['#EDC796', '#DDAA70', '#C98E58'])}
      ${lgd('deSoloB', ['#A8683E', '#7E4A2C', '#5E361E'])}
      <linearGradient id="deSagA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E5A2A"/><stop offset=".3" stop-color="#A8B060"/><stop offset=".6" stop-color="#8A9A4A"/><stop offset="1" stop-color="#4A5626"/></linearGradient>
      <linearGradient id="deSagB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E5A2A"/><stop offset=".35" stop-color="#A2AC5C"/><stop offset="1" stop-color="#56622C"/></linearGradient>
      ${lgd('deFigo', ['#9AD0B0', '#5E9A88'])}
      ${lgd('deBarril', ['#C9C85A', '#8A9A3A'], 1, 0)}
      ${lgd('deDuC1', ['#F4CDA6', '#EAB894'])}
      ${lgd('deDuC2', ['#FAD08C', '#EBAE64'])}
      ${lgd('deAreia', ['#F8D696', '#EDBA70'])}
      ${lgd('deCorte', ['#E6AE68', '#D0924E', '#B47838'])}
      ${lgd('deLencol', ['#8AD6FF', '#3E8AE0', '#2560C0'])}
      ${lgd('deAgua', ['#9ADFFF', '#3E9AE8'])}
      <linearGradient id="deMiragem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DDF2FF" stop-opacity="0"/><stop offset=".3" stop-color="#DDF2FF" stop-opacity=".85"/><stop offset=".7" stop-color="#C6E8FF" stop-opacity=".85"/><stop offset="1" stop-color="#DDF2FF" stop-opacity="0"/></linearGradient>
      <linearGradient id="deTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A2E"/><stop offset=".45" stop-color="#C99050"/><stop offset="1" stop-color="#7A4A22"/></linearGradient>
      <radialGradient id="deTamara" cx=".35" cy=".3"><stop offset="0" stop-color="#FFC27A"/><stop offset="1" stop-color="#D2621E"/></radialGradient>
      <linearGradient id="dePoco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E2E14"/><stop offset=".5" stop-color="#8A5A2E"/><stop offset="1" stop-color="#4E2E14"/></linearGradient>
      ${lgd('deDrPelo', ['#F0C080', '#D9A060', '#C08440'])}
      <radialGradient id="deDrCorpo" cx=".45" cy=".25" r=".8"><stop offset="0" stop-color="#F8D49A"/><stop offset=".55" stop-color="#E2AA66"/><stop offset="1" stop-color="#C2843E"/></radialGradient>
      <radialGradient id="deDrCab" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#F8D8A0"/><stop offset="1" stop-color="#D49A56"/></radialGradient>
      ${lgd('deDrPerna', ['#E4AE6A', '#D29A56', '#C08440'], 1, 0)}
      ${lgd('deDrPernaF', ['#C08A4C', '#A87438'], 1, 0)}
      ${lgd('deDrPesc', ['#E8B46E', '#D29A56'], 1, 0)}
      ${lgd('deJer', ['#F6D29C', '#DDA866'])}
      ${lgd('deGanga', ['#E2BE88', '#B88A56'])}
      ${lgd('deWel', ['#9CC462', '#6A9A40', '#44702C'])}
      <pattern id="deGraos" width="18" height="12" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="#F2D49A" stroke="#B88A50" stroke-width=".7" opacity=".7"/><circle cx="13" cy="5" r="2.2" fill="#E8C084" stroke="#B88A50" stroke-width=".7" opacity=".7"/><circle cx="9" cy="10" r="2.4" fill="#F6DCA6" stroke="#B88A50" stroke-width=".7" opacity=".7"/></pattern>
      <clipPath id="deClip"><rect x="0" y="0" width="800" height="500"/></clipPath>
      <filter id="deBlur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="deBlur2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <radialGradient id="deVinheta" cx=".5" cy=".45" r=".78"><stop offset=".55" stop-color="#2E1420" stop-opacity="0"/><stop offset="1" stop-color="#2E1420" stop-opacity=".4"/></radialGradient>
      <filter id="deGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .075 0"/></filter>
      <radialGradient id="deBesCab" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6E6698"/><stop offset=".5" stop-color="#2A2238"/><stop offset="1" stop-color="#0E0A14"/></radialGradient>
      <radialGradient id="deGotaG" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#D2F0FF"/><stop offset="1" stop-color="#6CBCF0"/></radialGradient>
      <radialGradient id="deHorizA"><stop offset="0" stop-color="#FFD8B0" stop-opacity=".75"/><stop offset=".6" stop-color="#FFC8A8" stop-opacity=".3"/><stop offset="1" stop-color="#FFC0A0" stop-opacity="0"/></radialGradient>
      ${lgd('deEstrato', ['#D898B4', '#F2B8B6', '#FFDCC0'])}
      ${lgd('deL1', ['#F8CDB8', '#F0BAA8'])}${lgd('deL1S', ['#D2AECA', '#C4A0BE'])}
      ${lgd('deL2', ['#F8B890', '#F0A27E'])}${lgd('deL2S', ['#B988A6', '#A47898'])}
      <linearGradient id="deHazeA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6CDBC" stop-opacity="0"/><stop offset=".6" stop-color="#F6CDBC" stop-opacity=".35"/><stop offset="1" stop-color="#F8D6C6" stop-opacity=".85"/></linearGradient>
      <linearGradient id="deHazeA2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C8B4" stop-opacity="0"/><stop offset="1" stop-color="#F8D0BE" stop-opacity=".55"/></linearGradient>
      <linearGradient id="deNevoa" gradientUnits="userSpaceOnUse" x1="0" y1="226" x2="0" y2="300"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#F8EEF2"/><stop offset="1" stop-color="#D6CCE4"/></linearGradient>
      <radialGradient id="deWisp"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".6" stop-color="#F6F0F8" stop-opacity=".6"/><stop offset="1" stop-color="#F0EAF6" stop-opacity="0"/></radialGradient>
      ${lgd('dePraia', ['#EAB49C', '#E4A084', '#D9906E'])}
      ${lgd('deCosta', ['#F6B890', '#EC9E74'])}${lgd('deCostaS', ['#B08AA6', '#946E8E'])}
      <radialGradient id="deDuSol" gradientUnits="userSpaceOnUse" cx="640" cy="236" r="320"><stop offset="0" stop-color="#FFE8C0" stop-opacity=".42"/><stop offset=".5" stop-color="#FFD8A8" stop-opacity=".14"/><stop offset="1" stop-color="#FFE0B0" stop-opacity="0"/></radialGradient>
      <linearGradient id="deDuReflexo" gradientUnits="userSpaceOnUse" x1="0" y1="360" x2="0" y2="510"><stop offset="0" stop-color="#E88A78" stop-opacity="0"/><stop offset="1" stop-color="#E88A78" stop-opacity=".4"/></linearGradient>
      <pattern id="deGraoAreia" width="46" height="46" patternUnits="userSpaceOnUse">${Array.from({ length:70 }, (_, k) => `<circle cx="${f1(R(0, 46))}" cy="${f1(R(0, 46))}" r="${f1(R(.35, .85))}" fill="${k % 3 ? '#FFF0DA' : '#5A2A3A'}" opacity="${k % 3 ? .3 : .22}"/>`).join('')}</pattern>
      <clipPath id="deClipLuz"><path d="${D_LUZ}"/></clipPath><clipPath id="deClipSom"><path d="${D_SOMBRA}"/></clipPath>
      ${lgd('deWelSeca', ['#E2C08A', '#B08850'])}
      <linearGradient id="deWelE" gradientUnits="userSpaceOnUse" x1="-8" y1="0" x2="-92" y2="0"><stop offset="0" stop-color="#86BA52"/><stop offset=".4" stop-color="#5E903A"/><stop offset=".72" stop-color="#8A9248"/><stop offset="1" stop-color="#C6A66E"/></linearGradient>
      <linearGradient id="deWelD" gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="92" y2="0"><stop offset="0" stop-color="#86BA52"/><stop offset=".4" stop-color="#5E903A"/><stop offset=".72" stop-color="#8A9248"/><stop offset="1" stop-color="#C6A66E"/></linearGradient>
      <radialGradient id="deCone" cx=".35" cy=".3"><stop offset="0" stop-color="#FFB49A"/><stop offset="1" stop-color="#C83E2A"/></radialGradient>
      <radialGradient id="deCrown" cx=".4" cy=".3"><stop offset="0" stop-color="#A87A50"/><stop offset="1" stop-color="#5A3418"/></radialGradient>
      ${lgd('deGeco', ['#FFE6DA', '#F6BFAE', '#E2A090'])}
      ${lgd('deFcCauda', ['#F8DCB0', '#E8B678', '#CC8E50'])}
      ${lgd('deMontB', ['#9EA8D2', '#B8BCDA', '#D2D2E4'])}
      ${lgd('deMesaS', ['#B0605E', '#8E4A52'])}
      ${lgd('deTalus', ['#E8A890', '#E2B494', '#E8C4A0'])}
      <linearGradient id="deHazeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF2FA" stop-opacity="0"/><stop offset="1" stop-color="#F6EADA" stop-opacity=".55"/></linearGradient>
      <linearGradient id="deHazeB2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAEEDC" stop-opacity=".7"/><stop offset="1" stop-color="#FAEEDC" stop-opacity="0"/></linearGradient>
      <linearGradient id="deSagVol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".3" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".7" stop-color="#102008" stop-opacity="0"/><stop offset="1" stop-color="#102008" stop-opacity=".3"/></linearGradient>
      <radialGradient id="deFlorSag" cx=".5" cy=".8"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="#F0EAD0"/></radialGradient>
      <radialGradient id="deFigoR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#B8E6C6"/><stop offset=".6" stop-color="#78B09A"/><stop offset="1" stop-color="#4E887A"/></radialGradient>
      <radialGradient id="deTuna" cx=".35" cy=".3"><stop offset="0" stop-color="#FF7AAA"/><stop offset="1" stop-color="#B41E5A"/></radialGradient>
      <radialGradient id="deBarrilR" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E2E486"/><stop offset=".55" stop-color="#A8B246"/><stop offset="1" stop-color="#6E7E2A"/></radialGradient>
      <radialGradient id="deRocha" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E2C6AE"/><stop offset=".6" stop-color="#B08C76"/><stop offset="1" stop-color="#7E5E4A"/></radialGradient>
      ${lgd('deNuvC', ['#E6EAF4', '#B4BCD2', '#8A94B0'])}
      ${lgd('dePica', ['#EEDCB8', '#C8A87C'])}
    </defs>
    <rect id="de-ceu0" width="800" height="500" fill="url(#deCeu0)" style="transition:opacity 3s"/>
    <rect id="de-ceu1" width="800" height="500" fill="url(#deCeu1)" style="opacity:0;transition:opacity 3s"/>
    <rect id="de-ceu2" width="800" height="500" fill="url(#deCeu2)" style="opacity:0;transition:opacity 3s"/>
    <g id="de-estrelas" style="transition:opacity 3s">${Array.from({ length:26 }, () => `<circle cx="${R(10, 790).toFixed(0)}" cy="${R(8, 120).toFixed(0)}" r="${R(.6, 1.6).toFixed(1)}" fill="#FFF6E0" opacity="${R(.4, .9).toFixed(2)}"/>`).join('')}</g>
    <g id="de-sol" class="toque" style="transform:translate(${SOL[0].x}px,${SOL[0].y}px) scale(${SOL[0].s});transition:transform 3s ease-in-out"><circle r="80" fill="url(#deSolG)"/><circle r="30" fill="url(#deSolD)" stroke="#F0A030" stroke-width="2.4"/><path d="M-16 -12 q8 -9 20 -9" stroke="#FFF8DA" stroke-width="4" fill="none" stroke-linecap="round"/><circle r="44" fill="transparent"/></g>
    <g id="de-mundo" style="transition:transform 3.2s cubic-bezier(.6,0,.3,1)">
    <!-- ===== A: Namibe, amanhecer ===== -->
    <g id="de-pA" clip-path="url(#deClip)">
      <ellipse cx="560" cy="262" rx="460" ry="96" fill="url(#deHorizA)"/>
      <g class="deriva" opacity=".9">${estrato(230, 92, 190, 12)}${estrato(330, 74, 120, 8)}${estrato(470, 126, 150, 9)}${estrato(80, 150, 130, 7)}</g>
      <rect x="-10" y="286" width="380" height="50" fill="url(#deMar)"/>
      <path d="M-10 286.6 H370" stroke="#F4E6F2" stroke-width="1.6" opacity=".9"/>
      <g stroke-linecap="round" fill="none">${Array.from({ length:22 }, () => { const y = R(290, 326), x = R(-10, 330), l = R(6, 22) * (y - 280) / 30; return `<path d="M${f1(x)} ${f1(y)} h${f1(l)}" stroke="${R(0, 1) < .55 ? '#F6C8D4' : '#E6EAFF'}" stroke-width="${f1(.8 + (y - 288) / 30)}" opacity=".7"/>`; }).join('')}${Array.from({ length:14 }, () => { const y = R(296, 326), x = R(-10, 320), l = R(8, 18) * (y - 280) / 30; return `<path d="M${f1(x)} ${f1(y)} q${f1(l / 2)} -2.4 ${f1(l)} 0" stroke="#4A5E9E" stroke-width="1.2" opacity=".45"/>`; }).join('')}</g>
      ${[[300, 36, 180], [380, 52, 200], [470, 44, 190], [570, 60, 220], [690, 48, 200], [800, 56, 200]].map(([x, h, w]) => duna(x, 302, w, h, 'url(#deL1)', 'url(#deL1S)', '#FFE6D6')).join('')}
      <rect x="150" y="236" width="680" height="70" fill="url(#deHazeA)"/>
      ${[[380, 44, 190], [500, 64, 230], [650, 56, 240], [790, 66, 220]].map(([x, h, w]) => duna(x, 320, w, h, 'url(#deL2)', 'url(#deL2S)', '#FFDCC0')).join('')}
      <rect x="250" y="262" width="580" height="62" fill="url(#deHazeA2)"/>
      <g id="de-banco" filter="url(#deBlur2)" pointer-events="none"><path d="M-50 300 V266 H340 L346 300Z" fill="url(#deNevoa)"/>${nevoaBanco(BANCO, 'url(#deNevoa)')}<g transform="translate(3 -4)" opacity=".75">${nevoaBanco(BANCO.map(([x, y, r]) => [x, y, r * .7]), '#FFF4EE')}</g><g opacity=".5">${nevoaBanco([[300, 290, 22], [340, 292, 26], [380, 296, 22], [416, 300, 16]], '#F6EEF4')}</g></g>
      <path d="M-10 334 C70 330 160 322 230 316 C280 311 320 306 360 302 L440 300 V500 H-10Z" fill="url(#dePraia)"/>
      <path d="${offCosta(3.4, 0, 1)}" stroke="#B992A8" stroke-width="6" fill="none" opacity=".55"/>
      <path d="${offCosta(1.2, 0, 1)}" stroke="#F2D8E0" stroke-width="1.4" fill="none" opacity=".7"/>
      <g fill="none" stroke-linecap="round"><path d="${offCosta(-1, 1, 1.7)}" stroke="#FFFFFF" stroke-width="2.6" opacity=".95"/><path d="${offCosta(-3.8, 1.4, 2.3)}" stroke="#FFFFFF" stroke-width="1.6" stroke-dasharray="9 4" opacity=".8"/><path d="${offCosta(-9, 1, 1.3)}" stroke="#46589A" stroke-width="1.8" stroke-dasharray="30 16" opacity=".35" transform="translate(0 1.6)"/><path d="${offCosta(-9, 1, 1.3)}" stroke="#FFFFFF" stroke-width="1.8" stroke-dasharray="30 16" opacity=".75"/><path d="${offCosta(-17, .8, 1.1)}" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="16 30" stroke-dashoffset="12" opacity=".55"/></g>
      ${[[10, 160, 18], [120, 180, 26], [236, 170, 20], [340, 160, 22]].map(([x, w, h]) => duna(x, 366, w, h, 'url(#deL1)', 'url(#deL1S)', '#FFE8DA')).join('')}
      <rect x="-10" y="336" width="440" height="34" fill="url(#deHazeA2)"/>
      ${[[-20, 200, 34], [110, 220, 44], [250, 200, 36], [370, 180, 30]].map(([x, w, h]) => duna(x, 398, w, h, 'url(#deL2)', 'url(#deL2S)', '#FFDEC4')).join('')}
      <rect x="-10" y="356" width="440" height="46" fill="url(#deHazeA2)" opacity=".7"/>
      ${duna(-30, 444, 200, 44, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}${duna(80, 440, 250, 70, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}${duna(220, 436, 200, 54, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}
      <g stroke-linecap="round" fill="none">${[[14, 400], [40, 410], [128, 384], [168, 396], [250, 384], [290, 372], [196, 410], [96, 420]].map(([x, y]) => `<g stroke="#7A8A4A" stroke-width="1.5"><path d="M${x} ${y} q-3 -7 -7 -9 M${x} ${y} q-1 -9 -2 -12 M${x} ${y} q2 -9 4 -11 M${x} ${y} q4 -6 8 -7"/></g><path d="M${x - 1} ${y - 1} q0 -6 -1 -9" stroke="#C8D48A" stroke-width=".9"/>`).join('')}</g>
      <g class="deriva-nevoa" filter="url(#deBlur2)" opacity=".8" pointer-events="none">${[[30, 322, 80, 9], [140, 316, 90, 8], [250, 308, 80, 7], [330, 300, 70, 8], [400, 296, 50, 7], [80, 352, 60, 6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#deWisp)"/>`).join('')}</g>
      <path class="de-areia toque" d="${D_DUNA}" fill="url(#deDuLuz)"/>
      <path d="${D_LUZ}" fill="url(#deDuSol)" pointer-events="none"/>
      <g clip-path="url(#deClipLuz)" pointer-events="none">${desenhaOndas(ondasDuna(faceLuz, 17, .04, .97, 1, 3.4, 15), '#B85A32', '#FFE8C4', .9, 2.4, .26, .42)}</g>
      <path class="de-areia toque" d="${D_SOMBRA}" fill="url(#deDuSombra)"/>
      <path d="${D_SOMBRA}" fill="url(#deDuReflexo)" pointer-events="none"/>
      <g clip-path="url(#deClipSom)" pointer-events="none">${avalanches()}${desenhaOndas(ondasDuna(faceSom, 16, .04, .97, 1, 3.2, 14), '#3A2252', '#D29CC0', .8, 2.2, .24, .4)}<path d="${D_ARETE}" stroke="#40244E" stroke-width="12" fill="none" opacity=".22" filter="url(#deBlur2)"/></g>
      <path d="${D_DUNA}" fill="url(#deGraoAreia)" pointer-events="none"/>
      <g fill="none" stroke="#B05C34" stroke-width="1.1" stroke-linecap="round" opacity=".5" pointer-events="none">${trilhaBes(cub([548, 214], [600, 280], [560, 360], [640, 460], 46), '')}</g>
      <path d="M548 214 C600 280 560 360 640 460" stroke="#C26A3C" stroke-width=".7" fill="none" opacity=".3" pointer-events="none"/>
      <g fill="#9A4826" opacity=".5" pointer-events="none">${[[672, 330, .75, 28], [684, 342, .8, 22], [690, 358, .85, 30], [704, 372, .9, 24], [710, 390, .95, 32], [726, 404, 1, 26], [732, 424, 1.05, 32], [750, 438, 1.1, 26]].map(([x, y, s, r]) => pegada(x, y, s * 1.9, r)).join('')}</g>
      <path d="M716 470 C690 462 676 452 662 436" stroke="#B4603A" stroke-width="1.2" fill="none" stroke-dasharray="1 4" stroke-linecap="round" opacity=".5" pointer-events="none"/>
      <g pointer-events="none" fill="none" stroke-linecap="round"><path d="${D_ARETE}" stroke="#52305E" stroke-width="1.3" opacity=".7" transform="translate(-1.2 0)"/><path d="${D_ARETE}" stroke="#FFE6C2" stroke-width="2.2" opacity=".95" transform="translate(1 0)"/><path d="${D_SIL_L}" stroke="#FFD4AE" stroke-width="2.2" opacity=".9"/><path d="${D_SIL_R}" stroke="#FFF2D6" stroke-width="2.8"/><path d="M528 197 C548 201 590 212 640 236" stroke="#FFFFFF" stroke-width="1.2" opacity=".7"/></g>
      <g id="de-poeira" pointer-events="none" filter="url(#deBlur2)" opacity=".5"><path d="M524 196 C560 186 600 184 640 190 C600 190 560 194 524 198Z" fill="#FFE4C0"/><path d="M500 206 C540 200 580 202 610 208 C580 206 540 206 500 208Z" fill="#FFE8CA"/></g>
      <g id="de-neblina" filter="url(#deBlur)" opacity=".9" pointer-events="none"><g id="de-neb-mov"><g class="deriva-nevoa">${[[40, 268, 120, 26], [160, 258, 110, 24], [270, 274, 90, 18], [-30, 250, 100, 32], [110, 240, 90, 20], [210, 288, 120, 14], [70, 294, 130, 12], [230, 236, 70, 16], [320, 290, 70, 12]].map(([x, y, rx, ry], k) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${k % 2 ? '#FFF6F4' : '#F4F0FA'}" opacity=".78"/>`).join('')}</g></g></g>
      <g id="de-vagas">${VAGA.map((v, i) => `<g class="de-vaga" data-i="${i}" pointer-events="none"><ellipse cx="${v.x}" cy="${v.y + 1}" rx="18" ry="5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4" opacity=".9"/>${brilhoHotspot(v.x, v.y - 18)}</g>`).join('')}</g>
      <g id="de-wel" class="toque" transform="translate(84 482)"><ellipse cx="0" cy="4" rx="82" ry="10" fill="#2A1430" opacity=".3"/><g transform="scale(.86 1)">${welwitschia}</g><ellipse cx="0" cy="-3" rx="15" ry="7.5" fill="url(#deCrown)" stroke="#3A2210" stroke-width="1.6"/><ellipse cx="0" cy="-6" rx="12" ry="4.2" fill="#B08058" stroke="#5E3A1E" stroke-width="1.2"/><path d="M-8 -6 q8 -3 16 0 M-5 -4.6 q5 -2 10 0" stroke="#6E4628" stroke-width=".9" fill="none"/>${[[-7, -9, -14], [-2, -12, -4], [4, -12, 6], [9, -9, 16]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 2 V-2" stroke="#6E4628" stroke-width="1.2"/><ellipse cx="0" cy="-5" rx="2.8" ry="4.2" fill="url(#deCone)" stroke="#7A1E14" stroke-width=".8"/><path d="M-2 -6 l4 2 M-2 -3.6 l4 -2 M-2 -8 l4 -1.4" stroke="#7A1E14" stroke-width=".6" opacity=".7"/><circle cx="-1" cy="-6.6" r=".7" fill="#FFD6C8"/></g>`).join('')}<rect x="-94" y="-30" width="188" height="44" fill="transparent"/></g>
      <g id="de-gecko" class="toque" transform="translate(614 476)"><ellipse cx="4" cy="2" rx="34" ry="3.4" fill="#6A2A1A" opacity=".25"/>
        <path d="M12 -6 C24 -9 34 -12 46 -7 C49 -5.6 48 -4 45 -4.4 C34 -7 24 -2 12 -1.6Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.2" stroke-linejoin="round"/>
        <g stroke="#E2A090" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M-6 -4 l-6 4"/><path d="M2 -3 l3 5"/><path d="M10 -4 l-3 5"/><path d="M14 -4 l6 4"/></g>
        <g fill="#FFC8BC" stroke="#B86A5E" stroke-width=".7" opacity=".95">${[[-13, 1, -20], [5, 3, 10], [-8, 3, -6], [21, 1, 24]].map(([x, y, a]) => `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 -1 L-4 2 Q0 3.6 4 2Z"/>`).join('')}</g>
        <path d="M-10 -9 C-2 -13 10 -12 16 -8 C18 -5 16 -2 10 -1 C0 0 -8 -1 -12 -4Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.3"/>
        <path d="M-4 -10 C2 -11.6 8 -11.2 13 -9" stroke="#FFF0EA" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
        <g fill="#D88878" opacity=".55"><ellipse cx="-2" cy="-7" rx="1.6" ry="1"/><ellipse cx="4" cy="-7.4" rx="1.6" ry="1"/><ellipse cx="10" cy="-6.6" rx="1.4" ry=".9"/><ellipse cx="22" cy="-7.6" rx="1.4" ry=".8"/><ellipse cx="30" cy="-8.4" rx="1.2" ry=".7"/></g>
        <path d="M-10 -11 C-16 -16 -26 -15 -30 -9.6 C-31.4 -6.6 -28 -3.6 -22 -3.4 C-17 -3.2 -12 -4.4 -9 -6.6Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.3"/>
        <circle cx="-19" cy="-11" r="4.8" fill="#FFE6DE" stroke="#B8685A" stroke-width="1"/><circle cx="-19.4" cy="-11" r="3.4" fill="#3A2218"/><circle cx="-19.4" cy="-11" r="2" fill="#120A08"/><circle cx="-20.6" cy="-12.3" r="1.1" fill="#fff"/><circle cx="-18.2" cy="-9.8" r=".5" fill="#fff" opacity=".8"/>
        <path d="M-29 -6.4 q4 2 9 .4" stroke="#B8685A" stroke-width="1" fill="none" stroke-linecap="round"/><circle cx="-28" cy="-9.4" r=".5" fill="#8A4A3E"/>
        <path id="de-lingua" d="M-28 -6 C-31 -9 -29 -16 -23 -16" stroke="#FF6E8A" stroke-width="2.4" fill="none" stroke-linecap="round" style="opacity:0"/>
        <g id="de-gota-olho"><path d="M-17 -18.6 C-16 -17.4 -15 -16.6 -15 -15.6 A2 2 0 0 1 -19 -15.6 C-19 -16.6 -18 -17.4 -17 -18.6Z" fill="url(#deGotaG)" stroke="#2E7BC4" stroke-width=".7"/><circle cx="-17.6" cy="-15.8" r=".5" fill="#fff"/></g>
        <rect x="-32" y="-22" width="80" height="30" fill="transparent"/></g>
      <g id="de-bess">${BES.map((b, i) => besouro(i, b.x, b.y)).join('')}</g>
      <g id="de-mao" pointer-events="none"><path d="M226 448 C280 400 330 340 392 286" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="7 9" opacity=".9"/><path d="M398 280 l-14 2 l6 -12Z" fill="#fff"/></g>
    </g>
    <!-- ===== B: Sonora, meio-dia ===== -->
    <g id="de-pB" transform="translate(800 0)"><g clip-path="url(#deClip)">
      <path d="M-20 300 V268 C10 262 30 252 60 254 C90 256 100 240 130 238 C160 236 176 250 200 248 C236 244 250 232 290 236 C320 239 340 252 380 250 C420 248 440 236 480 240 C520 244 540 230 580 232 C620 234 640 248 680 246 C720 244 750 236 790 242 L820 246 V300Z" fill="url(#deMontB)"/>
      <path d="M60 254 C90 256 100 240 130 238 M290 236 C320 239 340 252 380 250 M580 232 C620 234 640 248 680 246" stroke="#DCE0F0" stroke-width="1.6" fill="none" opacity=".7"/>
      ${mesa(44, 164, 236)}${mesa(262, 320, 266)}${mesa(620, 704, 228)}
      <rect x="-20" y="220" width="840" height="86" fill="url(#deHazeB)"/>
      <path d="M-20 300 C100 292 250 296 400 294 C550 292 700 296 820 294 V500 H-20Z" fill="url(#dePlanB)"/>
      <rect x="-20" y="292" width="840" height="34" fill="url(#deHazeB2)"/>
      <g>${Array.from({ length:22 }, () => `<ellipse cx="${f1(R(-10, 810))}" cy="${f1(R(310, 446))}" rx="${f1(R(20, 70))}" ry="${f1(R(3, 8))}" fill="${R(0, 1) < .5 ? '#F8DCB0' : '#C9925E'}" opacity="${f1(R(.15, .3))}"/>`).join('')}</g>
      ${[[90, 312, .5], [250, 306, .4], [560, 308, .45], [700, 314, .55], [150, 304, .3], [470, 302, .32]].map(([x, y, s]) => sagLonge(x, y, s, '#8EA27E', '#C8D6A8')).join('')}
      <g>${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(316, 440), r = R(5, 12) * (y / 400), j = Math.floor(R(0, 4)); const cb = ['#5E7234', '#6E7A36', '#4E6A44', '#6A8050'][j], ct = ['#9AAE52', '#B2B45E', '#86A272', '#A6BA7E'][j]; return `<ellipse cx="${f1(x + r * .3)}" cy="${f1(y + 1)}" rx="${f1(r * 1.5)}" ry="${f1(r * .3)}" fill="#7A4A2A" opacity=".25"/><path d="${copa(x, y - r * .5, r * 1.4, r * .8, 7, .3)}" fill="${cb}" stroke="#3A4620" stroke-width="1.1"/><path d="${copa(x + r * .2, y - r * .75, r * .95, r * .5, 6, .28)}" fill="${ct}"/><circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .9)}" r="${f1(r * .12 + .5)}" fill="#FFE27A"/>`; }).join('')}</g>
      <g>${Array.from({ length:14 }, () => { const x = R(0, 800), y = R(330, 446), r = R(4, 10); return `<ellipse cx="${f1(x + r * .3)}" cy="${f1(y + r * .5)}" rx="${f1(r * 1.1)}" ry="${f1(r * .28)}" fill="#5A341E" opacity=".25"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .6)}" fill="url(#deRocha)" stroke="#6E4A34" stroke-width="1.1"/><path d="M${f1(x - r * .5)} ${f1(y - r * .3)} q${f1(r * .4)} -${f1(r * .3)} ${f1(r * .8)} 0" stroke="#F4DCC4" stroke-width="1.1" fill="none"/>`; }).join('')}</g>
      <g transform="translate(196 446)"><ellipse cx="2" cy="2" rx="34" ry="4.4" fill="#5A341E" opacity=".28"/><path d="M0 0 C-4 -14 -2 -26 4 -34" stroke="#4E7A5A" stroke-width="6" fill="none" stroke-linecap="round"/>${[[0, -18, 18, 22, -14], [-14, -40, 16, 20, -30], [14, -46, 15, 19, 26], [2, -64, 13, 17, 6]].map(([x, y, rx, ry, a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#deFigoR)" stroke="#2A5444" stroke-width="1.8"/><path d="M${x - rx * .55} ${y - ry * .35} C${x - rx * .4} ${y - ry * .8} ${x} ${y - ry * .95} ${x + rx * .3} ${y - ry * .85}" stroke="#E2FFE8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></g><g stroke="#FFF6D8" stroke-width=".6" stroke-linecap="round">${[[-6, -6], [5, -4], [-2, 6], [6, 7], [0, -12], [-9, 3], [9, -10]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="1" fill="#F6E8B0" stroke="#8A7A40"/><path d="M${x + dx} ${y + dy} l-2.4 -2 M${x + dx} ${y + dy} l2.4 -2 M${x + dx} ${y + dy} l0 2.8"/>`).join('')}</g>`).join('')}<g stroke="#7E1A40" stroke-width="1">${[[-24, -56], [24, -64], [8, -82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="4.8" fill="url(#deTuna)"/><circle cx="${x - 1.2}" cy="${y - 1.8}" r="1" fill="#FFC8DC" stroke="none"/>`).join('')}</g><g transform="translate(-6 -80)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.6" rx="2.6" ry="3.8" transform="rotate(${a})" fill="#FFE04A" stroke="#C8901A" stroke-width=".6"/>`).join('')}<circle r="1.8" fill="#E8862A"/></g></g>
      <g transform="translate(640 446)"><ellipse cx="2" cy="2" rx="30" ry="4.4" fill="#5A341E" opacity=".28"/><path d="M-22 0 C-26 -30 -14 -46 0 -46 C14 -46 26 -30 22 0Z" fill="url(#deBarrilR)" stroke="#3E4A16" stroke-width="2"/><path d="M-15 0 C-19 -26 -9 -42 0 -44 M-7 0 C-9 -28 -4 -42 0 -44 M7 0 C9 -28 4 -42 0 -44 M15 0 C19 -26 9 -42 0 -44" stroke="#4E5A1C" stroke-width="1.3" fill="none" opacity=".75"/><path d="M-17 -6 C-20 -24 -12 -38 -4 -42" stroke="#F0F2A0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/><g stroke="#B04A2A" stroke-width=".9" fill="none" stroke-linecap="round">${[[-18, -10], [-17, -22], [-12, -33], [-11, -6], [-9, -20], [-5, -34], [0, -8], [0, -22], [0, -36], [11, -6], [9, -20], [5, -34], [18, -10], [17, -22], [12, -33]].map(([x, y]) => `<path d="M${x} ${y} l-3 -3 M${x} ${y} l3 -3 M${x} ${y} q0 -5 2 -6"/>`).join('')}</g><g>${[-9, -3, 3, 9].map((dx, k) => `<g transform="translate(${dx} ${-46 + Math.abs(dx) * .3})">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-3" rx="1.8" ry="3.2" transform="rotate(${a})" fill="${k % 2 ? '#FFB43A' : '#FF8A2A'}" stroke="#B0501A" stroke-width=".5"/>`).join('')}<circle r="1.4" fill="#FFE27A"/></g>`).join('')}</g></g>
      <g transform="translate(730 440)" stroke-linecap="round" fill="none"><ellipse cx="0" cy="2" rx="22" ry="3.4" fill="#5A341E" opacity=".25"/>${[[-24, -120], [-12, -140], [0, -150], [12, -134], [26, -116], [-34, -96]].map(([dx, dy]) => { const pts = cub([0, 0], [dx * .2, dy * .4], [dx * .6, dy * .7], [dx, dy], 10); return `<path d="M0 0 Q${dx * .3} ${dy * .5} ${dx} ${dy}" stroke="#3E2E20" stroke-width="4.4"/><path d="M0 0 Q${dx * .3} ${dy * .5} ${dx} ${dy}" stroke="#7A6248" stroke-width="2.6"/><path d="${pts.slice(1, -1).map((p, i) => `M${f1(p[0])} ${f1(p[1])} l${i % 2 ? 3 : -3} -1.4`).join(' ')}" stroke="#3E2E20" stroke-width="1"/>${pts.slice(2, -2).map((p, i) => `<ellipse cx="${f1(p[0] + (i % 2 ? 3 : -3))}" cy="${f1(p[1] - 2)}" rx="1.4" ry="2.6" transform="rotate(${i % 2 ? 30 : -30} ${f1(p[0] + (i % 2 ? 3 : -3))} ${f1(p[1] - 2)})" fill="#7AB04A" stroke="none"/>`).join('')}<path d="M${dx} ${dy} l${dx > 0 ? 2 : -2} -12" stroke="#B42A1A" stroke-width="5.4"/><path d="M${dx} ${dy} l${dx > 0 ? 2 : -2} -12" stroke="#FF5A3A" stroke-width="3.2"/><circle cx="${dx + (dx > 0 ? 2.4 : -2.4)}" cy="${dy - 13}" r="1.6" fill="#FFB43A" stroke="none"/>`; }).join('')}</g>
      <g id="de-esc" class="toque" transform="translate(284 438)"><ellipse cx="0" cy="8" rx="36" ry="5" fill="#5A341E" opacity=".28"/><g id="de-esc-in"><path d="M8 -2 C18 -6 22 -16 16 -24 C12 -28 6 -26 8 -20" stroke="#5A2E14" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M8 -2 C18 -6 22 -16 16 -24 C12 -28 6 -26 8 -20" stroke="#D9903E" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M12 -4 l1 -2 M17 -9 l2 -1 M19 -16 l2 0 M16 -22 l1 1" stroke="#7A3E14" stroke-width="1" stroke-linecap="round"/><path d="M8 -20 l-4 3" stroke="#3A1E0C" stroke-width="2" stroke-linecap="round"/><path d="M-8 2 l-6 4 M-2 2 l-3 5 M4 2 l2 5 M10 2 l5 4" stroke="#8A4A1E" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="12" ry="4.6" fill="#E09A4C" stroke="#5A2E14" stroke-width="1.4"/><path d="M-6 -3 v6 M0 -4 v8 M6 -3 v6" stroke="#A8601E" stroke-width=".8"/><path d="M-8 -2 C-2 -4 4 -4 9 -2" stroke="#FFD8A0" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-12 -1 C-18 -4 -22 -2 -24 -6 M-12 1 C-18 4 -22 2 -24 6" stroke="#5A2E14" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-26 -8 l4 1 l-1 3Z M-26 8 l4 -1 l-1 -3Z" fill="#D9903E" stroke="#5A2E14" stroke-width="1"/><circle cx="-9" cy="-2" r="1.6" fill="#fff"/><circle cx="-9.4" cy="-2" r=".9" fill="#12121A"/></g><path d="M-8 6 C-6 -10 16 -16 34 -6 C40 -2 40 6 34 8Z" fill="url(#deRocha)" stroke="#5E4434" stroke-width="1.8"/><path d="M0 -4 C8 -10 20 -10 28 -6" stroke="#F0DCC8" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14 -2 l4 6 l-2 4" stroke="#6E5444" stroke-width="1" fill="none" opacity=".6"/><rect x="-30" y="-24" width="72" height="34" fill="transparent"/></g>
      <rect x="-20" y="${SUPB}" width="840" height="${500 - SUPB}" fill="url(#deSoloB)"/>
      <path d="M-20 ${SUPB + 20} C200 ${SUPB + 16} 500 ${SUPB + 24} 820 ${SUPB + 18}" stroke="#B87A4C" stroke-width="3" fill="none" opacity=".35"/><path d="M-20 ${SUPB + 36} C240 ${SUPB + 40} 520 ${SUPB + 32} 820 ${SUPB + 38}" stroke="#3E2214" stroke-width="2" fill="none" opacity=".3"/>
      <path d="M-20 ${SUPB} C200 ${SUPB - 3} 600 ${SUPB + 3} 820 ${SUPB}" stroke="#E8B884" stroke-width="4" fill="none"/>
      <g>${Array.from({ length:30 }, () => { const x = R(0, 800), y = R(SUPB + 10, 496), rx = R(2, 5), ry = R(1.4, 3); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#B07A52" stroke="#5A341E" stroke-width=".6" opacity=".8"/><path d="M${f1(x - rx * .5)} ${f1(y - ry * .3)} h${f1(rx * .8)}" stroke="#E8C49A" stroke-width=".7" opacity=".8"/>`; }).join('')}</g>
      <path d="${raiz}" stroke="#4A2A14" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${raiz}" stroke="#C99A6A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="${raiz}" stroke="#F0CFA0" stroke-width=".8" fill="none" stroke-linecap="round" transform="translate(0 -.8)" opacity=".7"/>
      <path id="de-raiz-agua" d="${raiz}" stroke="#5AC8FF" stroke-width="3" fill="none" stroke-linecap="round" style="opacity:0;transition:opacity 1.4s"/>
      <ellipse cx="404" cy="${SUPB + 2}" rx="66" ry="6" fill="#3A1E0C" opacity=".32"/>
      <g id="de-sag" class="toque" data-fig="saguaro">${saguaro}${brilhoHotspot(470, 186)}</g>
      <path d="M352 ${SUPB + 1} C372 ${SUPB - 7} 428 ${SUPB - 7} 450 ${SUPB + 1}Z" fill="#B88458" stroke="#6E4428" stroke-width="1.2" pointer-events="none"/><path d="M366 ${SUPB - 3} C384 ${SUPB - 7} 416 ${SUPB - 7} 434 ${SUPB - 3}" stroke="#E8C08A" stroke-width="1.4" fill="none" pointer-events="none"/>
      <g id="de-pica" transform="translate(860 120)" style="opacity:0"><g id="de-pica-vira" transform="scale(-1 1)">${pica}</g></g>
      <g id="de-nuvs" style="opacity:0;transition:opacity 1s;pointer-events:none">${[180, 380, 580].map((x, i) => `<g class="de-nuv toque" data-i="${i}" data-x="${x}"><g style="animation:flutua ${(2.6 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${nuvemChuva(x)}${brilhoHotspot(x + 40, 40)}</g><rect x="${x - 80}" y="20" width="160" height="84" fill="transparent"/></g>`).join('')}</g>
    </g></g>
    ${(semente = 478519057, '')}
    <!-- ===== C: Saara, oásis ===== -->
    <g id="de-pC" transform="translate(1600 0)"><g clip-path="url(#deClip)">
      <g class="deriva" opacity=".85"><use href="#nuvem" x="380" y="70" width="110" height="52" style="color:#FFE6C8"/><use href="#nuvem" x="600" y="40" width="80" height="38" style="color:#FCD8C0"/></g>
      <g stroke="#6A4A6A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"><path d="M520 150 q6 -6 12 0 q6 -6 12 0"/><path d="M556 168 q5 -5 10 0 q5 -5 10 0"/></g>
      <path d="M-20 320 C60 280 140 262 230 290 C300 256 380 246 470 276 C560 250 660 254 820 286 V340 H-20Z" fill="url(#deDuC1)" opacity=".9"/><g fill="none" stroke="#9A6A5A" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" opacity=".7"><path transform="translate(540 266) scale(0.8)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path transform="translate(566 264) scale(0.75)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path transform="translate(590 262) scale(0.7)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path d="M520 266 l0 -10 M522 256 a3 3 0 1 0 0.1 0" /></g>
      <path d="M230 290 C260 276 290 266 320 262 M470 276 C510 262 540 256 570 254" stroke="#FFF0DC" stroke-width="2" fill="none" opacity=".8"/>
      <g id="de-mira" class="toque"><rect x="60" y="322" width="680" height="16" fill="url(#deMiragem)"/><g opacity=".35" transform="translate(0 668) scale(1 -1)"><path d="M230 344 C260 336 290 334 320 334 L380 344Z M470 344 C510 336 540 334 570 334 L620 344Z" fill="#E8B894"/></g><rect x="60" y="316" width="680" height="26" fill="transparent"/></g>
      <path d="M-20 350 C120 322 260 328 380 340 C520 320 660 324 820 336 V400 H-20Z" fill="url(#deDuC2)" stroke="#D99A50" stroke-width="1.6"/>
      <path d="M20 344 C120 326 220 328 300 334 M500 330 C580 322 660 324 760 332" stroke="#FFF0C8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M-20 372 C30 350 80 340 130 352 C160 344 190 346 220 360 L220 400 H-20Z" fill="#F2BE76"/><path d="M130 352 C116 364 106 380 100 398 L220 398 L220 360 C190 346 160 344 130 352Z" fill="#DE9E58" opacity=".8"/><path d="M-20 372 C30 350 80 340 130 352 C160 344 190 346 220 360" stroke="#FFF2D2" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M600 366 C650 346 700 338 760 344 C790 346 810 350 830 356 L830 400 H600Z" fill="#F2BE76"/><path d="M760 344 C744 358 734 378 730 398 L830 398 V356 C810 350 790 346 760 344Z" fill="#DE9E58" opacity=".8"/><path d="M600 366 C650 346 700 338 760 344 C790 346 810 350 830 356" stroke="#FFF2D2" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path class="de-areia toque" d="M-20 ${SUPC - 10} C120 ${SUPC - 18} 300 ${SUPC - 4} 420 ${SUPC - 8} C560 ${SUPC - 14} 700 ${SUPC - 6} 820 ${SUPC - 12} V430 H-20Z" fill="url(#deAreia)"/>
      <g fill="none" opacity=".6" pointer-events="none">${ondinhas(0, 780, SUPC - 6, 424, 16, '#D9A058', 1.4)}</g>
      <g pointer-events="none">${[[120, 412, 9], [520, 420, 7], [710, 414, 11], [360, 424, 5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#C08A5A" stroke="#7A4E2A" stroke-width="1.2"/><path d="M${x - r * .5} ${y - r * .2} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#F2D2A8" stroke-width="1.2" fill="none"/>`).join('')}<g stroke="#A8864A" stroke-width="1.6" fill="none" stroke-linecap="round">${[[40, 420], [330, 414], [560, 426], [770, 422]].map(([x, y]) => `<path d="M${x} ${y} q-3 -7 -7 -10 M${x} ${y} q0 -9 2 -13 M${x} ${y} q4 -7 8 -9"/>`).join('')}</g></g>
      <rect x="-20" y="430" width="840" height="70" fill="url(#deCorte)"/>
      <rect x="-20" y="430" width="840" height="70" fill="url(#deGraos)"/>
      <path d="M-20 452 C200 448 600 456 820 450" stroke="#B47838" stroke-width="1.4" fill="none" opacity=".7"/>
      <rect x="-20" y="470" width="840" height="30" fill="url(#deLencol)"/><rect x="-20" y="470" width="840" height="30" fill="url(#deGraos)" opacity=".6"/>
      <path id="de-lencol-brilho" d="M-20 471 H820" stroke="#DFF6FF" stroke-width="2.4"/>
      <path d="M-20 430 C200 428 600 432 820 428" stroke="#FFE6B0" stroke-width="3" fill="none"/>
      <g id="de-palmas">${COVA.map((v, i) => `<g class="de-palma" style="display:none"><g class="cresce">${palmeira(v.x + [-48, -56, -60][i], v.y - 6, [150, 128, 140][i], [14, -18, -14][i], ['#4E9A3A', '#6AAE3A', '#2E8A5A'][i], ['#245A1E', '#3A6A1A', '#1A5A3A'][i], ['#7CC24E', '#A2CC4E', '#5AB08A'][i])}</g></g>`).join('')}</g>
      <g id="de-capim" style="opacity:0;transition:opacity 1.6s">${COVA.map((v, i) => { const lado = i % 2 ? 1 : -1; return `
        <g transform="translate(${v.x + 66 * lado} ${v.y + 2})"><path d="${copa(0, -9, 17, 10, 8, .32)}" fill="${['#5E9E3A', '#7AA83A', '#4E8E4A'][i]}" stroke="#2E5A1E" stroke-width="1.6"/><path d="M-8 -12 q6 -4 12 -2" stroke="#C8EE9A" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="-6" cy="-10" r="1.8" fill="#FF8A5A"/><circle cx="5" cy="-14" r="1.8" fill="#FFD25A"/></g>
        <g stroke-linecap="round">${[-56, -48, 48, 56].map((dx, k) => { const x = v.x + dx, y = v.y + (k % 2 ? 1 : 3), h = 26 + (k % 2) * 8; return `<path d="M${x} ${y} q${dx > 0 ? 2 : -2} ${-h / 2} ${dx > 0 ? 4 : -4} ${-h}" stroke="#4E8A2A" stroke-width="2.2" fill="none"/><rect x="${x + (dx > 0 ? 2 : -6)}" y="${y - h - 1}" width="4" height="10" rx="2" fill="#8A5224" stroke="#4E2E12" stroke-width="1"/><path d="M${x} ${y} q${dx > 0 ? -6 : 6} -10 ${dx > 0 ? -10 : 10} -14" stroke="#6AAE3A" stroke-width="1.8" fill="none"/>`; }).join('')}</g>
        <g>${[[-62, 4, 7], [-24, 13, 5], [28, 13, 6], [62, 3, 5]].map(([dx, dy, r]) => `<ellipse cx="${v.x + dx}" cy="${v.y + dy}" rx="${r}" ry="${r * .6}" fill="#C8A47A" stroke="#7A5A3A" stroke-width="1.2"/><path d="M${v.x + dx - r * .5} ${v.y + dy - r * .2} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#F4E2C4" stroke-width="1" fill="none"/>`).join('')}</g>`; }).join('')}${COVA.map(v => Array.from({ length:5 }, (_, k) => { const x = v.x - 50 + k * 25 + R(-6, 6), y = v.y + R(-4, 8); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q-3 -8 -7 -12 M${x.toFixed(0)} ${y.toFixed(0)} q0 -10 2 -15 M${x.toFixed(0)} ${y.toFixed(0)} q4 -8 8 -11" stroke="#5E9A2E" stroke-width="2" fill="none" stroke-linecap="round"/>`; }).join('')).join('')}</g>
      <g id="de-covas">${COVA.map((v, i) => `<g class="de-cova toque" data-i="${i}">
        <rect class="de-poco" x="${v.x - 9}" y="${v.y + 2}" width="18" height="0" fill="url(#dePoco)" stroke="#4E2E12" stroke-width="1.6" rx="3"/>
        <rect class="de-poco-agua" x="${v.x - 5}" y="472" width="10" height="0" rx="3" fill="url(#deAgua)" opacity=".85"/>
        <ellipse class="de-buraco" cx="${v.x}" cy="${v.y}" rx="0" ry="0" fill="#8A5428" stroke="#5E3416" stroke-width="1.6"/>
        <ellipse class="de-lago" cx="${v.x}" cy="${v.y}" rx="0" ry="0" fill="url(#deAgua)" stroke="#2E7BC4" stroke-width="2"/>
        <g class="de-lago-brilho" style="opacity:0"><ellipse cx="${v.x + 4}" cy="${v.y + 2}" rx="38" ry="7.5" fill="#2E86D8" opacity=".45"/><ellipse cx="${v.x - 10}" cy="${v.y - 4}" rx="22" ry="2.6" fill="#D6F4FF" opacity=".55"/><path d="M${v.x - 20} ${v.y - 2} q10 -4 20 0 M${v.x + 6} ${v.y + 3} q8 -3 14 0" stroke="#EAF8FF" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${v.x - 44} ${v.y + 1} C${v.x - 30} ${v.y + 15} ${v.x + 30} ${v.y + 15} ${v.x + 44} ${v.y + 1}" stroke="#E8C48A" stroke-width="3" fill="none" stroke-linecap="round"/></g>
        <g class="de-marca"><ellipse cx="${v.x}" cy="${v.y}" rx="26" ry="7" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="5 5"/><path d="M${v.x - 4} ${v.y - 1} l8 2 M${v.x + 6} ${v.y - 3} l-6 5" stroke="#B87A3A" stroke-width="1.6" stroke-linecap="round"/>${brilhoHotspot(v.x + 18, v.y - 16)}</g>
        <rect x="${v.x - 40}" y="${v.y - 30}" width="80" height="${500 - v.y + 30}" fill="transparent"/></g>`).join('')}</g>
      <g id="de-gangas" style="opacity:0;transition:opacity 1s" class="toque">${ganga(COVA[0].x - 44, COVA[0].y + 4, 1)}${ganga(COVA[0].x + 40, COVA[0].y + 10, -1)}<rect x="${COVA[0].x - 62}" y="${COVA[0].y - 20}" width="120" height="36" fill="transparent"/></g>
      <g id="de-jer" class="toque" transform="translate(176 ${SUPC + 4})"><g id="de-jer-pos">${jerboa}</g><rect x="-22" y="-46" width="70" height="52" fill="transparent"/></g>
      <g id="de-drome" class="toque" data-fig="dromedario" transform="translate(728 ${SUPC - 4})"><g id="de-dr-in"><g transform="scale(.94)">${dromedario}</g></g><rect x="-118" y="-198" width="198" height="202" fill="transparent"/>${brilhoHotspot(34, -152)}</g>
    </g></g>
    </g>
    <g id="de-feco" class="toque" data-fig="feneco" style="transform:translate(${FECO[0].x}px,${FECO[0].y}px);transition:transform 3.2s ease-in-out"><g transform="scale(.8)">${feco}</g><rect x="-40" y="-100" width="80" height="104" fill="transparent"/>${brilhoHotspot(-26, -84)}</g>
    <rect width="800" height="500" fill="url(#deVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#deGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mundo = el(s, '#de-mundo');
  /* ---------- vida de fundo ---------- */
  const graos = [];
  const sopra = (x, y, n, cor) => { for (let i = 0; i < n; i++) graos.push({ x:x + sorte(-30, 30), y:y + sorte(-6, 6), vx:sorte(1.6, 4.2), vy:sorte(-1.2, .2), v:0, cor:cor || '#F2C48A', r:sorte(.9, 2) }); };
  c.desenho(ctx => {
    for (let i = graos.length - 1; i >= 0; i--) {
      const g = graos[i]; g.v++; g.x += g.vx; g.y += g.vy; g.vy += .03;
      ctx.globalAlpha = Math.max(0, 1 - g.v / 70); ctx.fillStyle = g.cor; ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 7); ctx.fill();
      if (g.v > 70) graos.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  });
  const orelhas = [...s.querySelectorAll('.de-orelha')];
  const mexeOrelha = (forte) => orelhas.forEach((o, i) => o.animate([{ transform:'rotate(0)' }, { transform:`rotate(${(i ? 1 : -1) * (forte ? 14 : 7)}deg)` }, { transform:'rotate(0)' }, { transform:`rotate(${(i ? 1 : -1) * (forte ? 10 : 4)}deg)` }, { transform:'rotate(0)' }], { duration:forte ? 700 : 520, delay:i * 60 }));
  (function orelhaIdle(){ if (!vivo) return; mexeOrelha(false); depois(sorte(2600, 4600), orelhaIdle); })();
  const piscar = () => { const o = el(s, '.de-olhos'); o.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(.1)' }, { transform:'scaleY(1)' }], { duration:220 }); };
  el(s, '.de-olhos').style.transformBox = 'fill-box'; el(s, '.de-olhos').style.transformOrigin = '50% 50%';
  (function pisca(){ if (!vivo) return; piscar(); depois(sorte(2800, 5200), pisca); })();
  const mao = el(s, '#de-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const vagasG = [...s.querySelectorAll('.de-vaga')];
  const vaiPara = k => {
    mundo.style.transform = `translateX(${-800 * k}px)`;
    [0, 1, 2].forEach(j => el(s, '#de-ceu' + j).style.opacity = j === k ? 1 : 0);
    el(s, '#de-estrelas').style.opacity = k === 0 ? 1 : 0;
    el(s, '#de-sol').style.transform = `translate(${SOL[k].x}px,${SOL[k].y}px) scale(${SOL[k].s})`;
    el(s, '#de-feco').style.transform = `translate(${FECO[k].x}px,${FECO[k].y}px)`;
    el(s, '#de-feco-pula').animate([{ transform:'translateY(0)' }, { transform:'translateY(-14px)' }, { transform:'translateY(0)' }], { duration:400, iterations:8 });
    toca('vapor');
  };
  /* ---------- 1. neblina: levar o besouro ao alto da duna ---------- */
  const bes = [...s.querySelectorAll('.de-bes')], pos = BES.map(b => ({ x:b.x, y:b.y, foi:false })), livre = VAGA.map(() => true);
  const poe = i => bes[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(1.2)`);
  let arr = null;
  bes.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'neblina' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(150, Math.min(490, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; bes[i].style.cursor = 'grab';
    let alvo = -1, dmin = 1e9;
    VAGA.forEach((v, j) => { if (!livre[j]) return; const d = Math.hypot(pos[i].x - v.x, pos[i].y - v.y); if (d < dmin) { dmin = d; alvo = j; } });
    if (!moveu) alvo = livre.indexOf(true);
    if (alvo >= 0 && (!moveu || dmin < 90 || pos[i].y < 300)) sobe(i, alvo); else volta(i);
  });
  function anda(i, x1, y1, ms, fim){
    const x0 = pos[i].x, y0 = pos[i].y, pernas = el(bes[i], '.de-pernas');
    tw(ms, (k, e) => { pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.abs(Math.sin(k * 26)) * 1.6; poe(i); pernas.setAttribute('transform', `translate(${(Math.sin(k * 40) * 1.4).toFixed(2)} 0)`); }, () => { pernas.removeAttribute('transform'); fim && fim(); });
  }
  function volta(i){ ocupado = true; anda(i, BES[i].x, BES[i].y, 700, () => ocupado = false); toca('glub'); api.diz('Arraste o besouro até o alto da duna, onde a neblina chega!'); }
  function sobe(i, j){
    pos[i].foi = true; livre[j] = false; ocupado = true; const v = VAGA[j];
    vagasG[j].style.display = 'none';
    const dist = Math.hypot(v.x - pos[i].x, v.y - pos[i].y);
    anda(i, v.x, v.y, Math.max(500, dist * 6), () => {
      const pose = el(bes[i], '.de-bes-pose');
      pose.animate([{ transform:'rotate(0)' }, { transform:'rotate(-28deg)' }], { duration:600, fill:'forwards', easing:'ease-out' });
      pose.style.transformBox = 'view-box'; pose.style.transformOrigin = '0px -6px';
      toca('clique');
      depois(600, () => neblina(i, v));
    });
  }
  function neblina(i, v){
    const mov = el(s, '#de-neb-mov');
    mov.animate([{ transform:'translateX(0)', opacity:1 }, { transform:`translateX(${v.x - 170}px) translateY(${v.y - 262}px)`, opacity:1, offset:.55 }, { transform:`translateX(${v.x - 120}px) translateY(${v.y - 262}px)`, opacity:.5, offset:.8 }, { transform:'translateX(0)', opacity:1 }], { duration:5200, easing:'ease-in-out' });
    toca('vapor');
    for (let k = 0; k < 26; k++) depois(k * 40, () => c.add({ tipo:'vapor', x0:sorte(0, 260), y0:sorte(250, 296), x1:v.x + sorte(-14, 14), y1:v.y - 22 + sorte(-6, 6), dur:sorte(80, 120), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 }));
    const gs = [...bes[i].querySelectorAll('.de-g')];
    gs.forEach((g, k) => depois(1500 + k * 350, () => { g.animate([{ transform:'scale(0)' }, { transform:'scale(1.15)' }, { transform:'scale(1)' }], { duration:500, fill:'forwards' }); tom(900 + k * 120, 0, .08, 'sine', .04, 1300 + k * 120); }));
    depois(3300, () => {
      gs.forEach((g, k) => { const par = g.parentNode.getAttribute('transform').match(/-?[\d.]+/g).map(Number); const dx = -24 - par[0], dy = -9 - par[1];
        g.animate([{ transform:'translate(0,0) scale(1)', opacity:1 }, { transform:`translate(${dx * .6}px,${dy * .6 + 2}px) scale(1)`, opacity:1, offset:.6 }, { transform:`translate(${dx}px,${dy}px) scale(.3)`, opacity:0 }], { duration:900, delay:k * 140, fill:'forwards', easing:'ease-in' }); });
    });
    depois(4500, () => {
      toca('glub'); c.brilhos(v.x - 18, v.y - 8, 6, '#BFE8FF'); gotas++;
      api.hud(`<span class="chip">Besouros com água: ${gotas}/3</span>`);
      ocupado = false;
      if (gotas === 1) api.diz('Ele abaixa a cabeça e levanta as costas. A neblina vira gotinhas, e as gotas escorrem até a boca!');
      if (gotas === 2) api.diz('Aqui no deserto do Namibe quase não chove, mas a neblina vem do mar quase toda manhã.');
      if (gotas === 3) { toca('vitoria'); fase = 'viagem'; api.diz('Os besouros beberam a neblina! Agora vamos para outro deserto, do outro lado do mundo.'); depois(5200, comecaChuva); }
    });
  }
  /* ---------- 2. chuva: o saguaro enche de água ---------- */
  function comecaChuva(){
    vaiPara(1);
    depois(3400, () => {
      fase = 'chuva'; const n = el(s, '#de-nuvs'); n.style.opacity = 1; n.style.pointerEvents = '';
      api.hud('<span class="chip">Chuvas: 0/3</span>');
      api.diz('Este é o saguaro, um cacto gigante. Toque nas nuvens para chover nele!');
    });
  }
  const sagIn = el(s, '#de-sag-in'), stA = [...s.querySelectorAll('#deSagA stop')], stB = [...s.querySelectorAll('#deSagB stop')];
  const VERDE = [['#4E5A2A', '#A8B060', '#8A9A4A', '#4A5626'], ['#3E6A2A', '#9AC45A', '#76A848', '#2E5A22'], ['#2E6E32', '#8ED062', '#5CAE4C', '#215A26'], ['#2A7A3A', '#9ADE70', '#4EB050', '#1A5A2A']];
  const VERDE_B = [['#4E5A2A', '#A2AC5C', '#56622C'], ['#3E6A2A', '#94C058', '#3E6A26'], ['#2E6E32', '#86CC60', '#2E6E2E'], ['#2A7A3A', '#90D86C', '#226A2E']];
  stA.concat(stB).forEach(st => st.style.transition = 'stop-color 1.6s');
  let chovendo = false;
  s.querySelectorAll('.de-nuv').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'chuva' || chovendo || g.dataset.feito) return;
    g.dataset.feito = 1; chovendo = true; chuvas++; const x = +g.dataset.x;
    toca('chuva'); c.chover(x - 66, x + 66, 100, SUPB, 70, '#3D8BFF');
    depois(1200, () => { for (let k = 0; k < 14; k++) depois(k * 50, () => c.add({ tipo:'infiltra', x0:x + sorte(-60, 60), y0:SUPB + 2, x1:sorte(180, 620), y1:sorte(460, 476), dur:sorte(60, 90), f:sorte(0, 6) })); });
    depois(2000, () => {
      el(s, '#de-raiz-agua').style.opacity = (.35 + chuvas * .2).toFixed(2);
      sagIn.style.transform = `scaleX(${(1 + chuvas * .09).toFixed(2)})`;
      stA.forEach((st, k) => st.style.stopColor = VERDE[chuvas][k]); stB.forEach((st, k) => st.style.stopColor = VERDE_B[chuvas][k]);
      toca('planta'); c.brilhos(400, 300, 6, '#C9F2A0');
      g.style.transition = 'opacity 1s'; g.style.opacity = .25;
    });
    depois(3000, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) api.diz('As raízes do saguaro são curtinhas e bem espalhadas. Elas bebem a chuva rapidinho!');
      if (chuvas === 2) api.diz('Olha as dobras do cacto se abrindo como uma sanfona. Ele está guardando água lá dentro!');
      if (chuvas === 3) { fase = 'pica'; toca('vitoria'); api.diz('O saguaro ficou gordinho de água! Um saguaro grande guarda centenas de litros para os meses sem chuva.'); depois(3600, picaPau); }
    });
  }));
  function picaPau(){
    el(s, '#de-nuvs').style.opacity = 0;
    const p = el(s, '#de-pica'), vira = el(s, '#de-pica-vira'); p.style.opacity = 1; vira.setAttribute('transform', '');
    tw(1800, (k, e) => p.setAttribute('transform', `translate(${(860 - (860 - 426) * e).toFixed(1)} ${(120 + (262 - 120) * e - Math.sin(k * Math.PI) * 30 + Math.sin(k * 30) * 3).toFixed(1)})`), () => {
      let n = 0; (function bica(){ if (!vivo) return; el(s, '#de-pica-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(-4px)' }, { transform:'translateX(0)' }], { duration:140 }); tom(1400, 0, .04, 'square', .03); if (++n < 8) depois(170, bica); else { const f = el(s, '#de-sag-furo'); f.setAttribute('rx', 6.5); f.setAttribute('ry', 8.5); toca('pop'); api.diz('Um pica-pau fez um buraquinho no saguaro para morar. Lá dentro é fresquinho e úmido!'); depois(5600, comecaOasis); } })();
    });
  }
  /* ---------- 3. oásis: cavar até a água escondida ---------- */
  function comecaOasis(){
    fase = 'viagem'; vaiPara(2);
    depois(3400, () => {
      fase = 'cavar'; api.hud('<span class="chip">Água encontrada: 0/3</span>');
      api.diz('No Saara a areia esconde um segredo. Toque na areia marcada para cavar até achar água!');
    });
  }
  const covas = [...s.querySelectorAll('.de-cova')], prof = [0, 0, 0];
  covas.forEach((g, i) => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'cavar' || prof[i] >= 3) { if (fase !== 'cavar' && prof[i] < 3) { toca('clique'); sopra(COVA[i].x, COVA[i].y - 4, 8); } return; }
    prof[i]++; const v = COVA[i];
    el(g, '.de-marca').style.display = 'none';
    toca('clique'); tom(180, 0, .12, 'triangle', .05, 90);
    for (let k = 0; k < 7; k++) c.add({ tipo:'respingo', x:v.x + sorte(-16, 16), y:v.y + sorte(-3, 3), t:k, cor:'#B87A3A' });
    sopra(v.x, v.y - 6, 10, '#E8B46E');
    const b = el(g, '.de-buraco'); b.setAttribute('rx', 10 + prof[i] * 5); b.setAttribute('ry', 3 + prof[i] * 1.6);
    const poco = el(g, '.de-poco'), fundo = [0, 448, 462, 472][prof[i]];
    poco.setAttribute('y', 430); poco.setAttribute('height', fundo - 430);
    if (prof[i] < 3) { if (achou === 0 && prof[i] === 1) api.diz('Mais fundo! A água está bem lá embaixo.'); return; }
    achou++;
    const ag = el(g, '.de-poco-agua');
    tw(1400, (k, e2) => { ag.setAttribute('y', (472 - 42 * e2).toFixed(1)); ag.setAttribute('height', (42 * e2).toFixed(1)); });
    toca('glub'); c.brilhos(v.x, 472, 6, '#BFE8FF');
    depois(1100, () => {
      const lago = el(g, '.de-lago');
      tw(1300, (k, e2) => { lago.setAttribute('rx', (58 * e2).toFixed(1)); lago.setAttribute('ry', (14 * e2).toFixed(1)); });
      el(g, '.de-lago-brilho').style.transition = 'opacity 1s'; el(g, '.de-lago-brilho').style.opacity = 1;
      toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:v.x + sorte(-20, 20), y:v.y, t:k * 2, cor:'#E6F6FF' });
    });
    depois(2300, () => { s.querySelectorAll('.de-palma')[i].style.display = ''; toca('planta'); c.brilhos(v.x + [-48, -56, -60][i], v.y - 120, 6, '#B8F08A'); });
    api.hud(`<span class="chip">Água encontrada: ${achou}/3</span>`);
    if (achou === 1) depois(1500, () => api.diz('Achou! Debaixo da areia tem água guardada. Onde ela chega perto da superfície, nasce um oásis.'));
    if (achou === 2) depois(1500, () => api.diz('Com água, a tamareira cresce. As tâmaras são docinhas!'));
    if (achou === 3) { fase = 'chegam'; depois(2600, chegamBichos); }
  }));
  function chegamBichos(){
    toca('vitoria'); el(s, '#de-capim').style.opacity = 1; el(s, '#de-gangas').style.opacity = 1;
    api.diz('Virou um oásis! Os bichos do deserto vêm beber.');
    depois(2600, () => { fase = 'beber'; api.hud('<span class="chip">Dromedário bebeu: 0 litros</span>'); api.diz('Toque no dromedário para ele beber bastante água!'); });
  }
  let drX = 728, drOcupado = false;
  const drPesc = el(s, '#de-dr-pesc'), pernas = [...s.querySelectorAll('.de-dr-perna')];
  const PIV = [-40, -74];
  const pescoco = a => drPesc.setAttribute('transform', `rotate(${a.toFixed(1)} ${PIV[0]} ${PIV[1]})`);
  const LITROS = [0, 40, 80, 110];
  el(s, '#de-drome').addEventListener('click', e => {
    if (drOcupado) return;
    if (fase !== 'beber') { drOcupado = true; tw(900, k => pescoco(Math.sin(k * Math.PI) * 14), () => drOcupado = false); toca('pop'); if (fase === 'cavar' || fase === 'viagem') api.diz('O dromedário está com sede. Primeiro, vamos achar água!'); return; }
    drOcupado = true;
    const bebe = () => {
      tw(800, (k, e2) => pescoco(-108 * e2), () => {
        goles++; let n = 0; (function gole(){ if (!vivo) return; toca('glub'); c.add({ tipo:'respingo', x:COVA[2].x + sorte(-6, 6), y:COVA[2].y, t:0, cor:'#E6F6FF' }); if (++n < 3) depois(330, gole); })();
        depois(1100, () => {
          api.hud(`<span class="chip">Dromedário bebeu: ${LITROS[goles]} litros</span>`);
          tw(700, (k, e2) => pescoco(-108 * (1 - e2)), () => {
            drOcupado = false;
            if (goles === 1) api.diz('Glub, glub! O dromedário consegue beber mais de cem litros de uma vez só!');
            if (goles === 2) api.diz('E a corcova não guarda água: guarda gordura, uma reserva de energia para a viagem.');
            if (goles === 3) { fase = 'fim'; drOcupado = true; toca('vitoria'); c.brilhos(400, 300, 12, '#FFE27A'); api.diz('Nos desertos chove muito pouco, e a vida guarda cada gota: na neblina, dentro do cacto e debaixo da areia. A gente também pode guardar cada gota!'); depois(6600, api.fim); }
          });
        });
      });
    };
    if (drX > 712) { const x0 = drX; tw(1400, (k, e2) => { drX = x0 + (708 - x0) * e2; el(s, '#de-drome').setAttribute('transform', `translate(${drX.toFixed(1)} ${SUPC - 4})`); pernas.forEach(p => { const lado = +p.dataset.p % 2 ? 1 : -1; p.setAttribute('transform', `rotate(${(Math.sin(k * 16) * 8 * lado).toFixed(1)} ${p.dataset.x} -62)`); }); }, () => { pernas.forEach(p => p.removeAttribute('transform')); bebe(); }); }
    else bebe();
  });
  /* ---------- toques extras ---------- */
  const FALAS_FECO = ['Minhas orelhas enormes soltam o calor do corpo. Assim eu fico fresquinho no deserto!', 'Eu quase não bebo água: pego quase toda a água de que preciso da comida.', 'De dia eu fico na toca, longe do sol. Saio à noite, quando está fresquinho.'];
  el(s, '#de-feco').addEventListener('click', () => { mexeOrelha(true); toca('pop'); [880, 1180].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'triangle', .05, f * 1.2), i * 120)); api.diz(FALAS_FECO[falaFeco++ % 3]); });
  let lambeu = false;
  el(s, '#de-gecko').addEventListener('click', e => { e.stopPropagation(); if (lambeu) return; lambeu = true; const l = el(s, '#de-lingua'), g = el(s, '#de-gota-olho');
    l.animate([{ opacity:0 }, { opacity:1, offset:.2 }, { opacity:1, offset:.7 }, { opacity:0 }], { duration:900 }); toca('pop');
    depois(450, () => { g.style.transition = 'opacity .3s'; g.style.opacity = 0; });
    depois(3200, () => { g.style.opacity = 1; lambeu = false; });
    api.diz('Este lagartinho do Namibe lambe as gotinhas de neblina que ficam nos próprios olhos!'); });
  el(s, '#de-wel').addEventListener('click', e => { e.stopPropagation(); toca('planta'); c.brilhos(84, 470, 5, '#B8E08A'); api.diz('Esta planta só existe no deserto do Namibe. Ela tem só duas folhas compridas e pode viver mais de mil anos!'); });
  let escOcup = false;
  el(s, '#de-esc').addEventListener('click', e => { e.stopPropagation(); if (escOcup) return; escOcup = true; const ein = el(s, '#de-esc-in');
    ein.animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)', offset:.3 }, { transform:'translateX(18px)', offset:.55 }, { transform:'translateX(18px)', offset:.85 }, { transform:'translateX(0)' }], { duration:3200, easing:'ease-in-out' }); toca('clique');
    depois(3200, () => escOcup = false);
    api.diz('O escorpião passa o dia escondido debaixo das pedras, longe do sol quente.'); });
  let jerOcup = false;
  el(s, '#de-jer').addEventListener('click', e => { e.stopPropagation(); if (jerOcup) return; jerOcup = true; const j = el(s, '#de-jer-pos');
    tw(1500, k => { const salto = Math.abs(Math.sin(k * Math.PI * 3)) * 26, dx = Math.sin(k * Math.PI) * 40; j.setAttribute('transform', `translate(${dx.toFixed(1)} ${(-salto).toFixed(1)})`); }, () => { j.removeAttribute('transform'); jerOcup = false; });
    [0, 500, 1000].forEach(t => setTimeout(() => somOn && tom(700, 0, .08, 'sine', .05, 1100), t));
    api.diz('O jerboa pula como um canguruzinho! Ele quase não bebe: tira a água das sementes e plantas que come.'); });
  el(s, '#de-mira').addEventListener('click', e => { e.stopPropagation(); toca('ok'); api.diz('Parece um lago lá longe, mas é uma miragem: o ar bem quente entorta a luz do céu.'); });
  el(s, '#de-mira').animate([{ opacity:.55 }, { opacity:1 }, { opacity:.45 }, { opacity:.9 }, { opacity:.55 }], { duration:3200, iterations:Infinity });
  el(s, '#de-gangas').addEventListener('click', e => { e.stopPropagation(); [1500, 1700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sine', .05, f * .8), i * 160)); api.diz('Este passarinho molha as penas da barriga para levar água aos filhotes no ninho!'); });
  el(s, '#de-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); api.diz(fase === 'neblina' ? 'Está amanhecendo. De madrugada o deserto fica bem frio!' : 'No deserto o sol é forte de dia, e quase não tem nuvens para fazer sombra.'); });
  s.querySelectorAll('.de-areia').forEach(a => a.addEventListener('click', e => { const p = c.ponto(e); sopra(p.x, p.y, 18); tom(300, 0, .3, 'sawtooth', .015, 120); }));
  el(s, '#de-sag').addEventListener('click', () => { if (fase === 'chuva') return; toca('pop'); api.diz('Os espinhos do cacto são folhas bem fininhas. Assim ele perde pouca água, e os espinhos ainda fazem sombra!'); });
  api.hud('<span class="chip">Besouros com água: 0/3</span>');
  api.diz('Oi, eu sou o Feco, um feneco! No deserto quase não chove. Arraste o besouro até o alto da duna para pegar a neblina!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
