/* ================= JOGO 3: Vilas sobre a água ================= */
function jogoVilas(palco, api, p){
  semente = 33;
  let vivo = true, fase = 'base', testando = false, boiando = false, vistos = {};
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const CX = 470, AG0 = 330, SOBE = 60, PEND = 270, FUNDO = 468, TOPO = 163, GANCHO = 104;
  /* ---------- montanhas ---------- */
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const SERRA1 = [[-10, 240], [40, 214], [70, 222], [110, 186], [150, 148], [176, 168], [204, 160], [236, 192], [276, 206], [318, 178], [350, 150], [376, 120], [400, 146], [426, 140], [456, 176], [500, 200], [548, 172], [590, 138], [622, 112], [650, 136], [676, 128], [716, 170], [760, 188], [810, 160]];
  const SERRA2 = [[-10, 276], [36, 258], [72, 266], [120, 236], [168, 262], [214, 248], [262, 274], [312, 246], [360, 268], [414, 240], [466, 266], [520, 250], [566, 272], [616, 244], [664, 264], [716, 236], [764, 258], [810, 248]];
  const serra = (pts, base) => `M-10 ${base} ` + pts.map(([x, y]) => `L${x} ${y}`).join(' ') + ` L810 ${base}Z`;
  const facetas = (pts, base, cor, op) => pts.slice(1, -1).map((pk, i) => { const v = pts[i + 2]; if (pk[1] > pts[i][1] || pk[1] > v[1]) return ''; return `<path d="M${pk[0]} ${pk[1]} L${v[0]} ${v[1]} L${(v[0] - 8).toFixed(0)} ${base} L${(pk[0] + 10).toFixed(0)} ${base}Z" fill="${cor}" opacity="${op}"/>`; }).join('');
  const neve = (pts, f) => pts.slice(1, -1).map((pk, i) => {
    const a = pts[i], b = pts[i + 2]; if (pk[1] > 160 || pk[1] > a[1] || pk[1] > b[1]) return '';
    const L = lerp(pk, a, f), Rr = lerp(pk, b, f); let zig = '';
    for (let k = 1; k < 6; k++) { const q = lerp(Rr, L, k / 6); zig += ` L${q[0].toFixed(1)} ${(q[1] + (k % 2 ? 9 : -2) + R(-2, 2)).toFixed(1)}`; }
    const m = lerp(Rr, L, .5);
    return `<path d="M${pk[0]} ${pk[1]} L${Rr[0].toFixed(1)} ${Rr[1].toFixed(1)}${zig} L${L[0].toFixed(1)} ${L[1].toFixed(1)}Z" fill="url(#viNeve)" stroke="#8C9CC8" stroke-width="1.4" stroke-linejoin="round"/><path d="M${pk[0]} ${pk[1]} L${Rr[0].toFixed(1)} ${Rr[1].toFixed(1)} L${(m[0] + 4).toFixed(1)} ${(m[1] + 6).toFixed(1)}Z" fill="#C3D0EE" opacity=".9"/><path d="M${pk[0] - 2} ${pk[1] + 4} L${(L[0] + 6).toFixed(1)} ${(L[1] - 2).toFixed(1)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  /* ---------- plantas ---------- */
  const totora = (x0, x1, base, n, h0, h1, frente) => Array.from({ length:n }, (_, i) => {
    const x = x0 + (x1 - x0) * (i + R(-.3, .3)) / n, h = R(h0, h1), dx = R(-14, 14), topo = base - h, cor = ['#6E9A3A', '#7FA845', '#5E8A32', '#8AB04E'][i % 4];
    return `<g class="balanca" style="animation-duration:${R(3.5, 6).toFixed(1)}s;animation-delay:${R(-5, 0).toFixed(1)}s"><path d="M${x.toFixed(1)} ${base} Q${(x + dx * .3).toFixed(1)} ${(base - h * .5).toFixed(1)} ${(x + dx).toFixed(1)} ${topo.toFixed(1)}" stroke="#3E5E1E" stroke-width="${frente ? 5.4 : 4}" fill="none" stroke-linecap="round"/><path d="M${x.toFixed(1)} ${base} Q${(x + dx * .3).toFixed(1)} ${(base - h * .5).toFixed(1)} ${(x + dx).toFixed(1)} ${topo.toFixed(1)}" stroke="${cor}" stroke-width="${frente ? 3 : 2.2}" fill="none" stroke-linecap="round"/>${i % 2 ? `<path d="M${(x + dx * .96).toFixed(1)} ${(topo + 10).toFixed(1)} q-6 -2 -5 -9 q5 1 5 9 q3 -6 9 -6 q-2 6 -9 6Z" fill="#9A6A2E" stroke="#5A3A14" stroke-width="1"/>` : ''}</g>`;
  }).join('');
  const arvore = (x, y, s, c1, c2, esc, tronco) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 0 C-3 -16 -6 -30 -2 -44 M2 0 C3 -16 5 -28 2 -44 M0 -30 C6 -36 12 -40 16 -48 M-1 -24 C-8 -30 -12 -36 -16 -42" stroke="${tronco}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${copa(0, -58, 34, 24, 9, .3)}" fill="${c2}" stroke="${esc}" stroke-width="2"/><path d="${copa(-6, -64, 24, 16, 8, .28)}" fill="${c1}"/><path d="M-22 -66 q10 -12 24 -10" stroke="#fff" stroke-width="2.4" fill="none" opacity=".35" stroke-linecap="round"/></g>`;
  const pato = (x, y, s, filhote) => filhote
    ? `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 C-14 -10 -6 -14 2 -12 C10 -10 12 -4 10 0 C4 3 -6 3 -12 0Z" fill="url(#viPatinho)" stroke="#A8780E" stroke-width="1.6"/><path d="M-12 -2 l-4 -4 l2 6Z" fill="#F2C43A" stroke="#A8780E" stroke-width="1.2"/><circle cx="6" cy="-15" r="6.4" fill="url(#viPatinho)" stroke="#A8780E" stroke-width="1.6"/><path d="M11 -15 q5 0 7 2 q-3 2 -7 1Z" fill="#FF8A2E" stroke="#B8500E" stroke-width="1"/><circle cx="8" cy="-16.6" r="1.6" fill="#12121A"/><circle cx="8.5" cy="-17.2" r=".55" fill="#fff"/><path d="M-6 -6 q5 -3 10 0" stroke="#FFF6C4" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`
    : `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 -4 C-30 -16 -18 -22 -4 -20 C8 -18 18 -12 18 -2 C10 4 -14 4 -26 -4Z" fill="url(#viPato)" stroke="#6E4A22" stroke-width="1.8" stroke-linejoin="round"/><path d="M-26 -4 L-34 -12 L-28 -2Z" fill="#B88A52" stroke="#6E4A22" stroke-width="1.4" stroke-linejoin="round"/><path d="M-14 -12 C-6 -18 6 -16 10 -8 C2 -6 -8 -6 -14 -12Z" fill="#A87A44" stroke="#6E4A22" stroke-width="1.2"/><path d="M-8 -12 h14" stroke="#2E6ABE" stroke-width="2.4" stroke-linecap="round"/><path d="M10 -14 C8 -24 10 -32 18 -34 C26 -35 30 -28 28 -22 C26 -18 20 -16 16 -12Z" fill="url(#viPatoC)" stroke="#1E4A2E" stroke-width="1.6"/><path d="M27 -27 q8 0 11 3 q-4 3 -11 2Z" fill="#FFB02E" stroke="#B86A0E" stroke-width="1.2"/><circle cx="23" cy="-28" r="2" fill="#12121A"/><circle cx="23.7" cy="-28.7" r=".7" fill="#fff"/><path d="M12 -17 h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M-18 -14 q10 -6 22 -4" stroke="#F2DDB8" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"/></g>`;
  const peixe = (x, y, s, c0, c1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 C-8 -9 8 -9 14 0 C8 8 -8 8 -14 0Z" fill="${c0}" stroke="${c1}" stroke-width="1.6"/><path d="M-13 0 L-22 -7 L-20 0 L-22 7Z" fill="${c0}" stroke="${c1}" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 -6 q4 -6 8 -2" fill="${c0}" stroke="${c1}" stroke-width="1.2"/><circle cx="7" cy="-1.4" r="2" fill="#fff"/><circle cx="7.4" cy="-1.4" r="1.1" fill="#12121A"/><path d="M-6 -3 q6 -3 12 -1" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  /* ---------- casa flutuante (origem = linha d'água no meio da base) ---------- */
  const telhas = Array.from({ length:5 }, (_, k) => { const y = -144 + k * 9.6, hw = 56 + (y + 150) / 50 * 34; let d = `M${(-hw).toFixed(1)} ${y.toFixed(1)}`; const n = Math.round(hw * 2 / 12); for (let i = 0; i < n; i++) d += ` q${(hw / n).toFixed(2)} 6 ${(hw * 2 / n).toFixed(2)} 0`; return d; }).join(' ');
  const grade = lado => [0, 1, 2].map(i => `<path d="M${lado * (118 - i * 18)} -26 V-50" stroke="#5A3414" stroke-width="4" stroke-linecap="round"/><path d="M${lado * (118 - i * 18)} -26 V-50" stroke="#C9894A" stroke-width="1.8" stroke-linecap="round"/>`).join('') + `<path d="M${lado * 120} -48 H${lado * 80} M${lado * 120} -38 H${lado * 80}" stroke="#5A3414" stroke-width="3.6" stroke-linecap="round"/><path d="M${lado * 120} -48.6 H${lado * 80}" stroke="#E0A868" stroke-width="1.4" stroke-linecap="round"/>`;
  const janela = x => `<rect x="${x - 3}" y="-87" width="38" height="31" rx="4" fill="#FFF6DA" stroke="#5A3414" stroke-width="2"/><rect x="${x + 1}" y="-83" width="30" height="23" rx="2" fill="url(#viVidro)" stroke="#1E4A7A" stroke-width="1.6"/><path d="M${x + 16} -83 V-60 M${x + 1} -71.5 H${x + 31}" stroke="#FFF6DA" stroke-width="2.6"/><path d="M${x + 4} -80 l6 0 M${x + 4} -76 l3 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M${x + 1} -83 C${x + 8} -78 ${x + 8} -68 ${x + 3} -60 H${x + 1}Z M${x + 31} -83 C${x + 24} -78 ${x + 24} -68 ${x + 29} -60 H${x + 31}Z" fill="#FF8AA8" stroke="#B83A62" stroke-width="1"/><rect x="${x - 4}" y="-56" width="40" height="7" rx="2" fill="#B8642E" stroke="#5A3414" stroke-width="1.6"/>${[4, 12, 20, 28].map((d, i) => `<circle cx="${x + d}" cy="-58" r="3.4" fill="${['#FF5E7E', '#FFD447', '#FF8A3D', '#C86AFF'][i]}" stroke="#7A2A3A" stroke-width=".9"/><circle cx="${x + d}" cy="-58" r="1.1" fill="#FFF6C4"/>`).join('')}<path d="M${x - 2} -56 q4 -6 8 -3 M${x + 32} -56 q-4 -6 -8 -3" stroke="#3E8A3A" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const CASA = `
    <ellipse cx="0" cy="-19" rx="124" ry="5" fill="#0B2A4A" opacity=".18"/>
    ${grade(-1)}${grade(1)}
    <rect x="-74" y="-104" width="148" height="80" fill="url(#viParede)" stroke="#1E5A5E" stroke-width="2.4"/>
    <g stroke="#1E6A6E" stroke-width="1.3" opacity=".55">${[-91, -78, -65, -52, -39].map(y => `<path d="M-74 ${y} H74"/>`).join('')}</g>
    <g stroke="#B8F0EA" stroke-width="1.2" opacity=".5">${[-90, -77, -64, -51, -38].map(y => `<path d="M-72 ${y} H-30"/>`).join('')}</g>
    <rect x="-74" y="-104" width="148" height="10" fill="#0B3A3E" opacity=".28"/>
    ${janela(-62)}${janela(30)}
    <path d="M-15 -24 V-66 C-15 -74 15 -74 15 -66 V-24Z" fill="url(#viPorta)" stroke="#8A4A10" stroke-width="2.2"/>
    <path d="M-10 -28 V-62 M10 -28 V-62" stroke="#C97A1E" stroke-width="1.4" opacity=".8"/><circle cx="9" cy="-44" r="2.4" fill="#5A3414"/><path d="M-11 -64 q8 -6 18 -2" stroke="#FFF2B0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-94 -98 L-56 -150 H56 L94 -98Z" fill="url(#viTelha)" stroke="#7A2A10" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="${telhas}" stroke="#A8401A" stroke-width="1.6" fill="none" opacity=".85"/>
    <path d="M-80 -104 L-52 -142" stroke="#FFC8A0" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
    <rect x="-62" y="-156" width="124" height="9" rx="4.5" fill="#C24A1E" stroke="#7A2A10" stroke-width="2.2"/><path d="M-56 -153.4 H40" stroke="#FFB08A" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M-96 -97 H96" stroke="#7A2A10" stroke-width="4" stroke-linecap="round"/>
    <rect x="30" y="-172" width="14" height="22" fill="#8A93A8" stroke="#3E465A" stroke-width="2"/><rect x="27" y="-176" width="20" height="6" rx="2" fill="#5E6678" stroke="#3E465A" stroke-width="1.8"/>
    <circle cx="0" cy="-160" r="5" fill="none" stroke="#5E6678" stroke-width="3"/><circle cx="0" cy="-160" r="5" fill="none" stroke="#C9D2E2" stroke-width="1.2"/>
    <g transform="translate(-100 -26)"><path d="M-8 0 C-10 -10 -6 -18 0 -18 C6 -18 10 -10 8 0Z" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.6"/><path d="M8 -2 C16 -2 18 -10 14 -14" stroke="#F29A3E" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="0" cy="-22" r="7" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.6"/><path d="M-6 -26 l-1 -7 l5 4 M6 -26 l1 -7 l-5 4" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.4" stroke-linejoin="round"/><path d="M-3.6 -23 q1.2 -1.6 2.4 0 M1.2 -23 q1.2 -1.6 2.4 0" stroke="#3A1E0C" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="0" cy="-20" r=".9" fill="#B8406E"/><path d="M-4 -12 q4 -2 8 0" stroke="#FFD2A0" stroke-width="1.6" fill="none"/></g>
    <g transform="translate(100 -26)"><path d="M-8 0 L-10 -14 H10 L8 0Z" fill="#D8743E" stroke="#7A3A14" stroke-width="1.6"/><path d="M-11 -14 H11" stroke="#7A3A14" stroke-width="2.4" stroke-linecap="round"/><path d="${copa(0, -24, 13, 10, 7, .3)}" fill="#4FB050" stroke="#2E6A2A" stroke-width="1.6"/><circle cx="-4" cy="-28" r="2.6" fill="#FFD447" stroke="#B8860E" stroke-width=".8"/><circle cx="5" cy="-22" r="2.6" fill="#FF6E8E" stroke="#B83A5A" stroke-width=".8"/></g>
    <path d="M-124 -26 H124 V-17 H-124Z" fill="url(#viDeck)" stroke="#4E2A10" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M-122 -23.6 H122" stroke="#E8B47A" stroke-width="1.4" opacity=".8"/>
    <g stroke="#6E3E18" stroke-width="1.2">${Array.from({ length:15 }, (_, i) => `<path d="M${-112 + i * 16} -25 V-18"/>`).join('')}</g>`;
  const BASES = {
    vazia:`<g id="vi-ph"><rect x="-120" y="-18" width="240" height="34" rx="12" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-width="3" stroke-dasharray="10 7"/><g id="vi-seta"><path d="M-6 -4 h12 v8 h7 l-13 12 l-13 -12 h7Z" fill="#fff" stroke="#1B56C4" stroke-width="1.8" stroke-linejoin="round"/></g></g>`,
    totora:`<path d="M-128 -4 C-134 -14 -124 -20 -112 -19 H112 C124 -20 134 -14 128 -4 C134 6 126 17 110 17 H-110 C-126 17 -134 6 -128 -4Z" fill="url(#viTot)" stroke="#5E4210" stroke-width="2.4"/>
      <g stroke="#8A6A1E" stroke-width="1.3" fill="none" opacity=".75">${[-11, -5, 1, 7, 12].map((y, i) => `<path d="M${-124 + i % 2 * 4} ${y} C-60 ${y + 2} 60 ${y - 2} ${124 - i % 2 * 4} ${y}"/>`).join('')}</g>
      ${[-90, -34, 22, 78].map(x => `<path d="M${x} -19 C${x - 3} -6 ${x - 3} 6 ${x} 17" stroke="#4E3208" stroke-width="5" fill="none"/><path d="M${x} -19 C${x - 3} -6 ${x - 3} 6 ${x} 17" stroke="#B88A3A" stroke-width="1.8" fill="none"/>`).join('')}
      <path d="M-126 -20 C-110 -30 110 -30 126 -20 C112 -14 -112 -14 -126 -20Z" fill="url(#viTotN)" stroke="#8A6A1E" stroke-width="1.8"/>
      <g stroke="#B8962E" stroke-width="1" opacity=".8">${Array.from({ length:18 }, (_, i) => `<path d="M${-112 + i * 13} -24 l7 4"/>`).join('')}</g>
      <path d="M-127 -10 C-137 -14 -142 -26 -136 -36 C-133 -30 -130 -25 -122 -20Z M127 -10 C137 -14 142 -26 136 -36 C133 -30 130 -25 122 -20Z" fill="url(#viTotN)" stroke="#5E4210" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-110 -12 H96" stroke="#FFF2B8" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`,
    barril:[-120, 4].map((x, i) => `<rect x="${x}" y="-17" width="116" height="34" rx="13" fill="url(#viTam${i})" stroke="${i ? '#7A3A0A' : '#0E2E6E'}" stroke-width="2.4"/>
      <path d="M${x + 30} -16 V16 M${x + 86} -16 V16" stroke="${i ? '#B8560E' : '#1A4A9E'}" stroke-width="4"/><path d="M${x + 32} -15 V15 M${x + 88} -15 V15" stroke="#fff" stroke-width="1.2" opacity=".45"/>
      <rect x="${x + 52}" y="-21" width="12" height="6" rx="1.5" fill="#E9EEF6" stroke="#3E465A" stroke-width="1.4"/>
      <path d="M${x + 12} -9 H${x + 104}" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
      <path d="M${x + 6} -10 C${x + 2} -4 ${x + 2} 4 ${x + 6} 10" stroke="${i ? '#7A3A0A' : '#0E2E6E'}" stroke-width="1.6" fill="none" opacity=".6"/>`).join('') +
      [-104, -16, 20, 104].map(x => `<path d="M${x} -20 V16" stroke="#7A5A2E" stroke-width="3"/><path d="M${x} -20 V16" stroke="#E2C48A" stroke-width="1.2" stroke-dasharray="3 2"/>`).join(''),
    pedra:[[-56, -10, 30, 13], [52, -10, 32, 13], [-92, 2, 34, 16], [-34, 4, 32, 15], [26, 3, 34, 16], [88, 2, 34, 16]].map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#viPedra)" stroke="#3E465A" stroke-width="2.2"/><path d="M${x - rx * .6} ${y - ry * .3} q${rx * .4} ${-ry * .6} ${rx * .9} ${-ry * .5}" stroke="#E9EEF6" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M${x + rx * .1} ${y + ry * .1} l${rx * .2} ${ry * .4} l${-rx * .1} ${ry * .3}" stroke="#4E566A" stroke-width="1.2" fill="none" opacity="${i % 2 ? .8 : 0}"/>`).join(''),
    tijolo:`<rect x="-122" y="-19" width="244" height="36" rx="3" fill="#E8D2B0" stroke="#7A3A1E" stroke-width="2.2"/>` + [0, 1, 2].map(r => Array.from({ length:8 }, (_, i) => { const x = -122 + i * 32 - (r % 2) * 16, w = 30; const x0 = Math.max(-121, x), x1 = Math.min(121, x + w); return x1 - x0 < 6 ? '' : `<rect x="${x0 + 1}" y="${-18 + r * 11.6}" width="${x1 - x0 - 2}" height="10" rx="1.6" fill="url(#viTij)" stroke="#8E3A1C" stroke-width="1.2"/><path d="M${x0 + 4} ${-15.6 + r * 11.6} h${Math.max(2, x1 - x0 - 14)}" stroke="#FFB08A" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>`; }).join('')).join('')
  };
  /* ---------- casa da margem (adobe e palha) ---------- */
  const palha = Array.from({ length:26 }, (_, i) => { const x = -66 + i * 5.3; return `M${x.toFixed(1)} ${(-60 - (1 - Math.abs(x) / 70) * 44 + 4).toFixed(1)} L${(x * 1.06).toFixed(1)} -58`; }).join(' ');
  const adobe = Array.from({ length:5 }, (_, r) => `M-54 ${-16 - r * 10} H54 ` + Array.from({ length:6 }, (_, i) => `M${-48 + i * 20 + (r % 2) * 10} ${-16 - r * 10} v10`).join(' ')).join(' ');
  const MARGEM = `<g id="vi-margem" class="toque" transform="translate(96 306)">
      <ellipse cx="0" cy="2" rx="74" ry="6" fill="#2E4A1A" opacity=".28"/>
      <rect x="-54" y="-66" width="108" height="60" fill="url(#viAdobe)" stroke="#7A4A22" stroke-width="2.2"/>
      <path d="${adobe}" stroke="#A86E3E" stroke-width="1.2" fill="none" opacity=".55"/>
      <rect x="-54" y="-66" width="108" height="8" fill="#5A2E10" opacity=".22"/>
      <path d="M-62 -6 H62 V2 H-62Z" fill="#9AA0B0" stroke="#4E566A" stroke-width="1.8"/><path d="M-50 -6 v8 M-30 -6 v8 M-6 -6 v8 M18 -6 v8 M40 -6 v8" stroke="#4E566A" stroke-width="1.2"/>
      <path d="M-12 -6 V-36 C-12 -46 12 -46 12 -36 V-6Z" fill="url(#viPortaAzul)" stroke="#12356E" stroke-width="2"/><path d="M-4 -40 V-8 M4 -40 V-8" stroke="#123E8E" stroke-width="1.2" opacity=".7"/><circle cx="7" cy="-22" r="1.8" fill="#FFD447"/>
      ${[-40, 26].map(x => `<rect x="${x}" y="-50" width="16" height="16" fill="#FFE9A8" stroke="#5A3414" stroke-width="1.8"/><path d="M${x + 8} -50 v16 M${x} -42 h16" stroke="#5A3414" stroke-width="1.4"/><path d="M${x} -50 l-7 2 v12 l7 2Z M${x + 16} -50 l7 2 v12 l-7 2Z" fill="#2E7BF6" stroke="#12356E" stroke-width="1.4" stroke-linejoin="round"/>`).join('')}
      <path d="M-72 -56 C-50 -80 -24 -104 0 -108 C24 -104 50 -80 72 -56 C40 -62 -40 -62 -72 -56Z" fill="url(#viPalha)" stroke="#7A5418" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="${palha}" stroke="#A8802E" stroke-width="1.2" opacity=".8"/>
      <path d="M-72 -56 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l2 -6" fill="#D8AE52" stroke="#7A5418" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-40 -84 C-24 -98 -8 -104 6 -104" stroke="#FFF0B0" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <g transform="translate(36 -6)"><path d="M-7 0 C-10 -8 -8 -14 0 -14 C8 -14 10 -8 7 0Z" fill="#C8642E" stroke="#6E2E10" stroke-width="1.4"/><path d="M-6 -10 h12" stroke="#FFD447" stroke-width="1.6"/><path d="M0 -14 C-4 -22 -10 -24 -12 -22 M0 -14 C2 -24 8 -26 10 -22" stroke="#3E8A3A" stroke-width="2" fill="none"/><circle cx="-12" cy="-22" r="2.4" fill="#FF6E8E"/><circle cx="10" cy="-23" r="2.4" fill="#FFD447"/></g>
      <rect x="-76" y="-112" width="152" height="118" fill="transparent"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Lago entre montanhas nevadas, com uma casa de adobe na margem, um píer com guindaste e uma casa esperando a base para boiar">
    <defs>
      <linearGradient id="viCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA8EE"/><stop offset=".55" stop-color="#A8DBFA"/><stop offset="1" stop-color="#F4F2E2"/></linearGradient>
      <radialGradient id="viSolG" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".6" stop-color="#FFD447"/><stop offset="1" stop-color="#F4A21E"/></radialGradient>
      <linearGradient id="viNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2EAF8"/></linearGradient>
      <linearGradient id="viSerra1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA6D8"/><stop offset="1" stop-color="#C6CDEA"/></linearGradient>
      <linearGradient id="viSerra2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E96B8"/><stop offset="1" stop-color="#A9BCCB"/></linearGradient>
      <linearGradient id="viMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C86A"/><stop offset="1" stop-color="#6E9A48"/></linearGradient>
      <linearGradient id="viNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2E2" stop-opacity="0"/><stop offset="1" stop-color="#F4F2E2" stop-opacity=".75"/></linearGradient>
      <linearGradient id="viLago" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AD2F2"/><stop offset=".25" stop-color="#3FA0DE"/><stop offset="1" stop-color="#1E5AA6"/></linearGradient>
      <linearGradient id="viFrente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5CC2F0" stop-opacity=".3"/><stop offset=".3" stop-color="#2E88D6" stop-opacity=".42"/><stop offset="1" stop-color="#103E86" stop-opacity=".62"/></linearGradient>
      <linearGradient id="viRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="viFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2C88A"/><stop offset="1" stop-color="#A8864E"/></linearGradient>
      <linearGradient id="viTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A060"/><stop offset="1" stop-color="#B8763E"/></linearGradient>
      <linearGradient id="viGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED45E"/><stop offset="1" stop-color="#5EA23A"/></linearGradient>
      <linearGradient id="viAdobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2C894"/><stop offset="1" stop-color="#D49A62"/></linearGradient>
      <linearGradient id="viPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DA7A"/><stop offset="1" stop-color="#C8963A"/></linearGradient>
      <linearGradient id="viPortaAzul" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5EA8FF"/><stop offset="1" stop-color="#1E5AC4"/></linearGradient>
      <linearGradient id="viParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EE0D2"/><stop offset="1" stop-color="#2EA6A2"/></linearGradient>
      <linearGradient id="viTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A5A"/><stop offset="1" stop-color="#D2501E"/></linearGradient>
      <linearGradient id="viDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8975A"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="viPorta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F2A81E"/></linearGradient>
      <linearGradient id="viVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8F2FF"/><stop offset="1" stop-color="#6EB8F0"/></linearGradient>
      <linearGradient id="viTot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C25A"/><stop offset=".6" stop-color="#B88A2E"/><stop offset="1" stop-color="#7A5A1E"/></linearGradient>
      <linearGradient id="viTotN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#E8C25A"/></linearGradient>
      <linearGradient id="viTam0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC0FF"/><stop offset=".35" stop-color="#3E8AF0"/><stop offset="1" stop-color="#1A4AA8"/></linearGradient>
      <linearGradient id="viTam1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC27A"/><stop offset=".35" stop-color="#FF8A2E"/><stop offset="1" stop-color="#C2520E"/></linearGradient>
      <radialGradient id="viPedra" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#C6CCDA"/><stop offset=".6" stop-color="#8A93A8"/><stop offset="1" stop-color="#5E6678"/></radialGradient>
      <linearGradient id="viTij" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F08A5A"/><stop offset="1" stop-color="#C2502A"/></linearGradient>
      <linearGradient id="viMadeira" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E0A260"/><stop offset="1" stop-color="#A8682E"/></linearGradient>
      <linearGradient id="viPato" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8CFA2"/><stop offset="1" stop-color="#B8884E"/></linearGradient>
      <linearGradient id="viPatoC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4EC27A"/><stop offset="1" stop-color="#1E7A4A"/></linearGradient>
      <linearGradient id="viPatinho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#F6C83A"/></linearGradient>
      <radialGradient id="viRaG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#B8C27A"/><stop offset="1" stop-color="#6E7A3A"/></radialGradient>
      <linearGradient id="viNuvemE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A96B2"/><stop offset="1" stop-color="#5E6A88"/></linearGradient>
      <radialGradient id="viVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#06204A" stop-opacity="0"/><stop offset="1" stop-color="#06204A" stop-opacity=".32"/></radialGradient>
      <filter id="viGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
      <clipPath id="viAguaClip"><rect x="0" y="${AG0 - SOBE - 4}" width="800" height="300"/></clipPath>
    </defs>
    <rect width="800" height="500" fill="url(#viCeu)"/>
    <g id="vi-arco" opacity="0" style="transition:opacity 2.4s" fill="none" stroke-width="11">${['#FF5E5E', '#FFA03E', '#FFE04A', '#5ED46A', '#4EA8FF', '#9A6AFF'].map((c, i) => `<path d="M${60 + i * 11} 330 A${250 - i * 11} ${230 - i * 11} 0 0 1 ${560 - i * 11} 330" stroke="${c}" opacity=".55"/>`).join('')}</g>
    <g id="vi-sol" class="toque" style="transform-origin:96px 76px"><circle cx="96" cy="76" r="62" fill="#FFF2B0" opacity=".3"/><circle cx="96" cy="76" r="46" fill="#FFE27A" opacity=".35"/><circle cx="96" cy="76" r="31" fill="url(#viSolG)" stroke="#E8961E" stroke-width="2.6"/><path d="M80 64 q9 -10 22 -9" stroke="#FFFBE0" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="574" y="104" width="86" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="160" y="132" width="64" height="30" style="color:#fff" opacity=".7"/></g>
    <path d="${serra(SERRA1, 330)}" fill="url(#viSerra1)" stroke="#7480B8" stroke-width="2" stroke-linejoin="round"/>
    ${facetas(SERRA1, 330, '#6E78B0', .35)}
    ${neve(SERRA1, .36)}
    <rect y="200" width="800" height="130" fill="url(#viNevoa)"/>
    <path d="${serra(SERRA2, 330)}" fill="url(#viSerra2)" stroke="#56709A" stroke-width="2" stroke-linejoin="round"/>
    ${facetas(SERRA2, 330, '#4E6890', .32)}
    <g stroke="#C8D8E6" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round">${SERRA2.slice(1, -1).filter((pk, i) => pk[1] < SERRA2[i][1] && pk[1] < SERRA2[i + 2][1]).map(([x, y]) => `<path d="M${x - 3} ${y + 4} L${x - 22} ${y + 26}"/>`).join('')}</g>
    <path d="M-10 336 V300 C40 288 90 290 140 297 C190 304 236 292 292 295 C350 298 384 286 444 290 C504 294 546 300 604 292 C664 284 722 296 810 289 V336Z" fill="url(#viMorro)" stroke="#4E7A30" stroke-width="2"/>
    <g fill="none" stroke-linecap="round">${[[300, 304, 420], [330, 314, 400], [470, 300, 590], [500, 311, 580]].map(([x0, y, x1], i) => `<path d="M${x0} ${y} C${(x0 + x1) / 2} ${y - 5} ${(x0 + x1) / 2} ${y - 5} ${x1} ${y}" stroke="${i % 2 ? '#D8C26A' : '#8AB04E'}" stroke-width="5"/><path d="M${x0} ${y + 2.6} C${(x0 + x1) / 2} ${y - 2.4} ${(x0 + x1) / 2} ${y - 2.4} ${x1} ${y + 2.6}" stroke="#5E8A38" stroke-width="1.2" opacity=".7"/>`).join('')}</g>
    <g>${[[330, 300, '#3E8A5A', '#2A6A44'], [356, 296, '#5EA04A', '#3E7A2A'], [610, 296, '#2E7A6A', '#1E5A4A'], [640, 292, '#7AAE3E', '#4E7A22']].map(([x, y, c, e]) => `<path d="${copa(x, y - 8, 11, 9, 7, .3)}" fill="${c}" stroke="${e}" stroke-width="1.4"/><path d="M${x} ${y} v6" stroke="#6E4A22" stroke-width="2.4"/>`).join('')}</g>
    <g class="deriva" style="animation-duration:20s"><g style="animation:flutua 1.4s ease-in-out infinite alternate" stroke="#2E3A5A" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M520 126 q6 -6 12 0 q6 -6 12 0"/><path d="M552 142 q5 -5 10 0 q5 -5 10 0"/><path d="M500 150 q4 -4 8 0 q4 -4 8 0"/></g></g>
    <g id="vi-nuvem" class="toque" style="transition:opacity .5s" opacity=".6">
      <g id="vi-nuvem-esc" opacity="0" style="transition:opacity 1s"><use href="#nuvem" x="196" y="2" width="244" height="118" style="color:#5E6A88"/></g>
      <use href="#nuvem" x="206" y="10" width="226" height="108" style="color:#B8C6DE"/><use href="#nuvem" x="212" y="12" width="214" height="100" style="color:#fff"/>
      <g id="vi-nuvem-cinza" opacity="0" style="transition:opacity 1s"><use href="#nuvem" x="212" y="12" width="214" height="100" style="color:#A2AEC8"/></g>
      <path d="M262 52 q16 -12 36 -6" stroke="#fff" stroke-width="4.6" fill="none" stroke-linecap="round" opacity=".9"/>
      <g id="vi-nuvem-dica" style="display:none">${brilhoHotspot(410, 34)}${brilhoHotspot(236, 92)}</g>
      <rect x="200" y="6" width="236" height="110" fill="transparent"/></g>
    <g id="vi-guindaste">
      <path d="M764 262 L770 30 M784 262 L778 30" stroke="#4E2A10" stroke-width="7" stroke-linecap="round"/><path d="M764 262 L770 30 M784 262 L778 30" stroke="url(#viMadeira)" stroke-width="4" stroke-linecap="round"/>
      <path d="${Array.from({ length:6 }, (_, i) => { const y = 250 - i * 36; return `M765 ${y} L783 ${y - 32} M783 ${y} L765 ${y - 32}`; }).join(' ')}" stroke="#7A4A1E" stroke-width="2.2"/>
      <path d="M774 22 L452 52 M774 22 L798 52" stroke="#4E566A" stroke-width="1.6"/>
      <path d="M446 50 H800 M450 64 H800" stroke="#4E2A10" stroke-width="7" stroke-linecap="round"/><path d="M446 50 H800 M450 64 H800" stroke="#E0A260" stroke-width="3.6" stroke-linecap="round"/>
      <path d="${Array.from({ length:17 }, (_, i) => `M${454 + i * 20} 64 L${464 + i * 20} 50`).join(' ')}" stroke="#7A4A1E" stroke-width="2.2"/>
      <path d="M774 120 L700 64" stroke="#4E2A10" stroke-width="6" stroke-linecap="round"/><path d="M774 120 L700 64" stroke="#C9894A" stroke-width="3" stroke-linecap="round"/>
      <rect x="780" y="66" width="20" height="30" rx="3" fill="#8A93A8" stroke="#3E465A" stroke-width="2"/><path d="M780 76 h20 M780 86 h20" stroke="#3E465A" stroke-width="1.2"/>
      <path d="M774 22 V8" stroke="#4E2A10" stroke-width="3"/><path d="M775 8 l18 5 l-18 5Z" fill="#FF6E3E" stroke="#8A2E10" stroke-width="1.4" stroke-linejoin="round"/>
      <rect x="456" y="64" width="28" height="12" rx="3" fill="#FFC83D" stroke="#7A4A0E" stroke-width="2"/><circle cx="470" cy="78" r="6" fill="#C9D2E2" stroke="#3E465A" stroke-width="2"/><circle cx="470" cy="78" r="1.8" fill="#3E465A"/>
    </g>
    <g id="vi-lago"><rect x="0" y="${AG0}" width="800" height="300" fill="url(#viLago)"/>
      <ellipse id="vi-sombra" cx="${CX}" cy="${AG0 + 24}" rx="128" ry="11" fill="#0B2E6A" opacity="0" style="transition:opacity .8s"/>
      <g opacity=".5">${[[380, 60], [520, 44], [660, 70]].map(([x, w]) => `<path d="M${x} ${AG0} L${x + w} ${AG0} L${x + w * 1.8} 490 L${x - w * .5} 490Z" fill="url(#viRaio)"/>`).join('')}</g></g>
    <g id="vi-fundo">
      <path d="M200 500 C260 478 330 470 420 474 C520 478 600 466 700 470 C750 472 780 468 810 466 V510 H200Z" fill="url(#viFundo)" stroke="#8A6A3A" stroke-width="2"/>
      <g fill="#8A93A8" stroke="#4E566A" stroke-width="1.4">${[[372, 480, 9, 5], [452, 482, 6, 4], [606, 476, 10, 6], [690, 478, 7, 4], [520, 486, 5, 3]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      ${[[400, 480, 50], [430, 478, 38], [584, 474, 46], [648, 474, 58], [720, 472, 40]].map(([x, y, h], i) => `<g class="balanca" style="animation-duration:${4 + i % 3}s;animation-delay:${-i}s"><path d="M${x} ${y} C${x - 8} ${y - h * .4} ${x + 8} ${y - h * .7} ${x - 2} ${y - h}" stroke="#2E6A3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x - 8} ${y - h * .4} ${x + 8} ${y - h * .7} ${x - 2} ${y - h}" stroke="#4EA85A" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[.3, .55, .8].map((k, j) => `<path d="M${x + (j % 2 ? 2 : -2)} ${(y - h * k).toFixed(0)} q${j % 2 ? 9 : -9} -3 ${j % 2 ? 12 : -12} -9" stroke="#4EA85A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</g>`).join('')}
      <g id="vi-peixes" class="toque"><g id="vi-peixes-vira"><g id="vi-peixes-in">${peixe(0, 0, 1, '#FFB347', '#A8620E')}${peixe(-34, 12, .8, '#FFC86A', '#A8620E')}${peixe(-22, -14, .7, '#FF9A5A', '#A8420E')}<rect x="-60" y="-26" width="86" height="50" fill="transparent"/></g></g></g>
      <g id="vi-ra" class="toque" transform="translate(560 476)"><g id="vi-ra-in" style="transform-origin:0 0"><ellipse cx="0" cy="2" rx="26" ry="5" fill="#5A4A2A" opacity=".3"/><path d="M-24 0 C-30 -4 -32 -10 -26 -12 M24 0 C30 -4 32 -10 26 -12" stroke="#5E6A2E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-22 0 C-26 -16 -12 -22 0 -22 C12 -22 26 -16 22 0 C14 4 -14 4 -22 0Z" fill="url(#viRaG)" stroke="#3E4A1E" stroke-width="1.8"/><path d="M-18 -4 q4 3 8 0 q4 3 8 0 q4 3 8 0 q4 3 8 0" stroke="#4E5A22" stroke-width="1.2" fill="none"/><path d="M-12 -18 q12 -6 24 0" stroke="#D8E09A" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/><circle cx="-8" cy="-20" r="5" fill="#C8D27A" stroke="#3E4A1E" stroke-width="1.4"/><circle cx="8" cy="-20" r="5" fill="#C8D27A" stroke="#3E4A1E" stroke-width="1.4"/><circle cx="-8" cy="-20" r="2.4" fill="#12121A"/><circle cx="8" cy="-20" r="2.4" fill="#12121A"/><circle cx="-7.2" cy="-20.8" r=".9" fill="#fff"/><circle cx="8.8" cy="-20.8" r=".9" fill="#fff"/><path d="M-6 -10 q6 3 12 0" stroke="#3E4A1E" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><rect x="-34" y="-30" width="68" height="40" fill="transparent"/></g>
    </g>
    <g id="vi-terra">
      <path d="M-10 302 C60 298 150 298 196 304 C228 308 244 320 256 342 C272 374 294 426 320 476 C326 488 330 496 334 510 H-10Z" fill="url(#viTerra)" stroke="#6E4220" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M246 326 C262 352 284 410 306 456 C314 474 322 492 330 510 H300 C292 488 282 466 270 444 C254 412 240 380 222 352Z" fill="#E2C48A" opacity=".75"/>
      <path d="M-10 350 C80 344 180 352 268 356 M-10 410 C90 404 200 412 296 420" stroke="#A8743E" stroke-width="3" fill="none" opacity=".55"/>
      <g fill="#9AA0B0" stroke="#5E6678" stroke-width="1.4">${[[40, 380, 10, 6], [150, 440, 12, 7], [230, 392, 8, 5], [90, 470, 9, 5], [210, 470, 11, 6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <path d="M-10 302 C60 298 150 298 196 304 C222 307 236 314 246 326 C200 318 120 316 -10 318Z" fill="url(#viGrama)" stroke="#3E7A2A" stroke-width="2"/>
      <path d="M10 304 C60 300 120 300 180 305" stroke="#D8F2A0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      ${capimJS(0, 240, 304, 26)}
      ${arvore(196, 304, 1.05, '#4E9A6A', '#2E7A54', '#1E5A3A', '#B8502E')}
      ${MARGEM}
      <g>${[[20, 300, '#FF6E8E'], [32, 304, '#FFD447'], [168, 302, '#C86AFF'], [180, 306, '#FF6E8E'], [228, 312, '#FFD447']].map(([x, y, c]) => `<path d="M${x} ${y + 6} v-8" stroke="#3E7A2A" stroke-width="1.6"/><circle cx="${x}" cy="${y - 3}" r="3.4" fill="${c}" stroke="#7A2A3A" stroke-width=".8"/><circle cx="${x}" cy="${y - 3}" r="1.1" fill="#FFF6C4"/>`).join('')}</g>
    </g>
    <g id="vi-pier">
      ${[652, 700, 748, 794].map(x => `<rect x="${x - 6}" y="262" width="12" height="${470 - 262 + (x > 700 ? 0 : 4)}" fill="url(#viMadeira)" stroke="#4E2A10" stroke-width="2"/>`).join('')}
      <path d="M652 300 L700 350 M700 300 L652 350 M700 300 L748 350 M748 300 L700 350 M748 300 L794 350 M794 300 L748 350" stroke="#7A4A1E" stroke-width="3" opacity=".9"/>
      <path d="M640 256 H800 V266 H640Z" fill="url(#viDeck)" stroke="#4E2A10" stroke-width="2.2"/><path d="M642 258.6 H800" stroke="#F2C48A" stroke-width="1.4"/>
      <g stroke="#6E3E18" stroke-width="1.2">${Array.from({ length:10 }, (_, i) => `<path d="M${650 + i * 16} 257 v8"/>`).join('')}</g>
      <g transform="translate(744 248)"><circle r="11" fill="#C9894A" stroke="#4E2A10" stroke-width="2"/><path d="M-11 0 H11 M0 -11 V11" stroke="#4E2A10" stroke-width="2"/><circle r="3" fill="#FFC83D" stroke="#4E2A10" stroke-width="1.2"/><path d="M8 -8 l8 -8" stroke="#4E2A10" stroke-width="3" stroke-linecap="round"/></g>
      <g id="vi-regua" class="toque"><rect x="626" y="246" width="20" height="214" rx="3" fill="#FFFDF4" stroke="#3E465A" stroke-width="2"/>
        ${Array.from({ length:21 }, (_, i) => `<path d="M626 ${256 + i * 10} h${i % 3 ? 6 : 12}" stroke="${256 + i * 10 < 300 ? '#E5392C' : 256 + i * 10 < 330 ? '#E8961E' : '#1E5AC4'}" stroke-width="${i % 3 ? 1.4 : 2.4}"/>`).join('')}
        <rect x="620" y="240" width="32" height="226" fill="transparent"/></g>
      <g id="vi-garca" class="toque" transform="translate(704 258)"><g id="vi-garca-in">
        <path d="M-4 0 L-2 -24 M6 0 L4 -24" stroke="#2E2E3A" stroke-width="2.4" stroke-linecap="round"/><path d="M-9 0 h9 M2 0 h9" stroke="#2E2E3A" stroke-width="2" stroke-linecap="round"/>
        <path d="M-20 -34 C-18 -46 4 -48 14 -38 C18 -32 12 -24 0 -22 C-10 -22 -20 -26 -26 -22 C-26 -28 -22 -32 -20 -34Z" fill="#FFFFFF" stroke="#5E6A88" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M-14 -36 C-6 -42 4 -40 10 -36" stroke="#D8E0F0" stroke-width="2" fill="none"/>
        <g id="vi-garca-pesc"><path d="M10 -38 C18 -48 8 -58 14 -68 C18 -74 26 -74 28 -68" stroke="#5E6A88" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M10 -38 C18 -48 8 -58 14 -68 C18 -74 26 -74 28 -68" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M28 -70 l18 3 l-18 2Z" fill="#FFC83D" stroke="#B8860E" stroke-width="1.2" stroke-linejoin="round"/><circle cx="24" cy="-70" r="1.8" fill="#12121A"/><circle cx="24.5" cy="-70.6" r=".6" fill="#fff"/></g>
        <rect x="-30" y="-80" width="80" height="82" fill="transparent"/></g></g>
    </g>
    ${totora(222, 262, 420, 7, 120, 160, false)}
    <g id="vi-casa" style="transition:opacity .45s"><g id="vi-base-in">${BASES.vazia}</g>${CASA}</g>
    <path id="vi-corda" d="M${CX} 84 V${PEND - TOPO}" stroke="#7A5A2E" stroke-width="2.6"/>
    <g id="vi-gancho" transform="translate(${CX} ${PEND - TOPO})"><path d="M0 -8 V-2 C0 2 -6 2 -6 -2" stroke="#4E566A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M0 -8 V-2 C0 2 -6 2 -6 -2" stroke="#C9D2E2" stroke-width="1.4" fill="none" stroke-linecap="round"/><rect x="-5" y="-16" width="10" height="9" rx="2" fill="#FFC83D" stroke="#7A4A0E" stroke-width="1.6"/></g>
    <g id="vi-frente" pointer-events="none"><rect x="0" y="${AG0}" width="800" height="300" fill="url(#viFrente)"/>
      <rect x="0" y="${AG0}" width="800" height="6" fill="#fff" opacity=".22"/>
      <path d="M0 ${AG0} ${Array.from({ length:40 }, () => 'q10 -3.4 20 0').join(' ')}" stroke="#F2FBFF" stroke-width="2.6" fill="none"/>
      <path d="M0 ${AG0 + 7} ${Array.from({ length:27 }, () => 'q15 3 30 0').join(' ')}" stroke="#BFE8FF" stroke-width="1.4" fill="none" opacity=".6"/>
      <g fill="#fff">${Array.from({ length:12 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .41 % 2.4).toFixed(2)}s" x="${(280 + (i * 61) % 500).toFixed(0)}" y="${(AG0 + 12 + (i * 9) % 30).toFixed(0)}" width="${10 + i % 3 * 6}" height="2.4" rx="1.2" opacity=".7"/>`).join('')}</g></g>
    <g id="vi-sup">
      <g id="vi-espuma" transform="translate(${CX} ${AG0})" opacity="0" style="transition:opacity .6s"><g id="vi-espuma-in"><path d="M-130 2 ${Array.from({ length:13 }, () => 'q10 5 20 0').join(' ')}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/><g fill="#fff">${[-136, -126, 128, 140].map((x, i) => `<circle cx="${x}" cy="${-4 + i % 2 * 2}" r="${2 + i % 2}"/>`).join('')}</g></g></g>
      <g id="vi-patos" class="toque"><g id="vi-patos-in">${pato(298, AG0, .8, false)}${pato(268, AG0, .7, true)}${pato(253, AG0, .6, true)}<rect x="240" y="${AG0 - 40}" width="100" height="48" fill="transparent"/></g></g>
    </g>
    <g pointer-events="none">${totora(-6, 70, 512, 9, 120, 190, true)}${totora(756, 810, 512, 6, 110, 170, true)}</g>
    <rect id="vi-escuro" width="800" height="500" fill="#0E1E44" opacity="0" style="transition:opacity 1.2s" pointer-events="none"/>
    <rect width="800" height="500" fill="url(#viVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#viGrao)" pointer-events="none"/>
  </svg>`;
  function capimJS(x0, x1, y, n){ let d = ''; for (let i = 0; i < n; i++) { const x = R(x0, x1), h = R(5, 10); d += `M${x.toFixed(1)} ${y + R(0, 10)} q${R(-2, 2).toFixed(1)} ${(-h / 2).toFixed(1)} ${R(-3, 3).toFixed(1)} ${(-h).toFixed(1)} `; } return `<path d="${d}" stroke="#3E7A2A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }
  const c = criarCena(palco, svg), s = c.svg;
  const casa = el(s, '#vi-casa'), baseIn = el(s, '#vi-base-in'), corda = el(s, '#vi-corda'), gancho = el(s, '#vi-gancho');
  const lago = el(s, '#vi-lago'), frente = el(s, '#vi-frente'), sup = el(s, '#vi-sup'), espuma = el(s, '#vi-espuma');
  el(s, '#vi-espuma-in').animate([{ transform:'translateX(-3px)' }, { transform:'translateX(3px)' }], { duration:1400, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  const seta = () => { const a = el(s, '#vi-seta'); if (a) a.animate([{ transform:'translateY(-3px)' }, { transform:'translateY(4px)' }], { duration:700, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }); };
  seta();
  /* ---------- estado e animação contínua ---------- */
  let agua = AG0, aguaDesenhada = -1;
  const H = { y:PEND, modo:'pend', s0:0, rot:0, preso:true, gy:PEND - TOPO };
  const lento = k => k * k * (3 - 2 * k);
  function tween(ms, fn, fim){ const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  const ondas = [];
  let proxOnda = 0;
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (agua !== aguaDesenhada) { aguaDesenhada = agua; const tr = `translate(0 ${(agua - AG0).toFixed(2)})`; lago.setAttribute('transform', tr); frente.setAttribute('transform', tr); sup.setAttribute('transform', tr); }
    let y = H.y, rot = 0, pivo = false;
    if (H.modo === 'pend') { rot = Math.sin(t * 1.3) * 1.6; pivo = true; }
    else if (H.modo === 'desce') { rot = Math.sin(t * 1.3) * .8; pivo = true; }
    else if (H.modo === 'boia') { const u = t - H.s0, am = Math.exp(-2.2 * u); y = agua + 9 * am * Math.cos(u * 6) + (1 - am) * 2.4 * Math.sin(t * 1.7); rot = (1 - am) * 1.3 * Math.sin(t * 1.15); H.y = y; }
    else { rot = H.rot; }
    casa.setAttribute('transform', pivo ? `translate(${CX} ${(y - TOPO).toFixed(2)}) rotate(${rot.toFixed(2)}) translate(0 ${TOPO})` : `translate(${CX} ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`);
    if (H.preso) H.gy = y - TOPO;
    gancho.setAttribute('transform', `translate(${CX} ${H.gy.toFixed(2)})`); corda.setAttribute('d', `M${CX} 84 V${(H.gy - 14).toFixed(2)}`);
    if (H.modo === 'boia' && t > proxOnda) { proxOnda = t + 1.3; ondas.push({ t0:t }); }
    for (let i = ondas.length - 1; i >= 0; i--) {
      const k = (t - ondas[i].t0) / 2.4; if (k >= 1) { ondas.splice(i, 1); continue; }
      ctx.globalAlpha = .55 * (1 - k); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(CX, agua + 3, 132 + k * 70, 4 + k * 8, 0, 0, Math.PI); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  const respingos = (x0, x1, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:sorte(x0, x1), y:agua + sorte(-2, 4), t:i % 5, cor:'#FFFFFF' }); };
  const bolhas = (x, y, n, sp) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-sp, sp), y:y + sorte(-6, 6), vy:sorte(1, 2.4), r:sorte(2.5, 6.5), topo:agua + 2, f:sorte(0, 6) }); };
  /* ---------- materiais ---------- */
  const MAT = [
    { id:'pedra', nome:'Pedras', sym:'m-pedra', boia:false, fala:'Afundou! Glub, glub. A pedra é pesada demais para boiar. Escolha outra base.' },
    { id:'tijolo', nome:'Tijolos', sym:'m-tijolo', boia:false, fala:'Afundou também! O tijolo é ótimo em terra firme, mas na água vai direto para o fundo.' },
    { id:'totora', nome:'Totora', sym:'m-totora', boia:true, fala:'Boiou! A totora é uma planta com ar por dentro, como um canudinho. O povo Uro faz ilhas inteiras com ela.' },
    { id:'barril', nome:'Tambores', sym:'m-barril', boia:true, fala:'Boiou! Tambores fechados ficam cheios de ar. No Camboja, muitas casas flutuam assim e sobem junto com a água.' }
  ];
  const mats = document.createElement('div'); mats.className = 'materiais';
  mats.innerHTML = MAT.map(m => `<button class="material" data-m="${m.id}"><svg viewBox="0 0 100 50" aria-hidden="true"><use href="#${m.sym}"/></svg>${m.nome}</button>`).join('');
  $('#p-acoes').appendChild(mats);
  const poeBase = id => { baseIn.innerHTML = `<g class="cresce">${BASES[id]}</g>`; };
  mats.addEventListener('click', e => {
    const b = e.target.closest('.material'); if (!b || testando || fase === 'subindo' || fase === 'postais') return;
    const m = MAT.find(m => m.id === b.dataset.m); testando = true; toca('pop'); poeBase(m.id);
    c.brilhos(CX, H.y, 5, '#FFE27A');
    if (boiando) {
      if (m.boia) { depois(700, () => { b.classList.add('testado-ok'); api.diz(m.fala); testando = false; }); }
      else { boiando = false; espuma.style.opacity = 0; el(s, '#vi-sombra').style.opacity = 0; depois(400, () => afundar(m, b)); }
      return;
    }
    depois(550, () => {
      H.modo = 'desce'; const y0 = H.y;
      tween(1150, k => { H.y = y0 + (agua - y0) * lento(k); }, () => {
        toca('splash'); respingos(CX - 130, CX + 130, 22); c.brilhos(CX, agua - 10, 6, '#FFFFFF');
        if (m.boia) {
          H.modo = 'boia'; H.s0 = performance.now() / 1000; boiando = true; espuma.style.opacity = 1; el(s, '#vi-sombra').style.opacity = .28; soltaGancho();
          depois(1000, () => {
            b.classList.add('testado-ok'); testando = false; api.diz(m.fala);
            if (fase === 'base') { fase = 'chuva'; depois(5200, () => { if (fase === 'chuva' && boiando) chamaChuva(); }); }
          });
        } else afundar(m, b);
      });
    });
  });
  function soltaGancho(){ H.preso = false; const g0 = H.gy; tween(900, k => { H.gy = g0 + (GANCHO - g0) * lento(k); }); }
  function afundar(m, b){
    H.modo = 'afunda'; if (H.preso) soltaGancho();
    const y0 = H.y, r0 = H.rot || 0, alvoR = m.id === 'pedra' ? 6 : -5; toca('glub');
    const bol = setInterval(() => { if (!vivo || H.modo !== 'afunda') return clearInterval(bol); bolhas(CX, H.y, 3, 110); }, 160);
    tween(2600, k => { H.y = y0 + (FUNDO - y0) * k * k; H.rot = r0 + (alvoR - r0) * k; }, () => {
      clearInterval(bol); H.modo = 'fundo'; el(s, '#vi-sombra').style.opacity = 0; toca('glub'); bolhas(CX, FUNDO - 10, 14, 120);
      b.classList.add('testado-nao'); api.diz(m.fala);
      depois(1900, () => {
        casa.style.opacity = 0;
        depois(500, () => {
          baseIn.innerHTML = BASES.vazia; seta(); H.modo = 'pend'; H.y = PEND; H.rot = 0; H.preso = true;
          casa.style.opacity = 1; toca('pop'); c.brilhos(CX, PEND - 80, 8, '#FFE27A'); testando = false;
        });
      });
    });
  }
  /* ---------- chuva ---------- */
  function chamaChuva(){ el(s, '#vi-nuvem').setAttribute('opacity', 1); el(s, '#vi-nuvem-dica').style.display = ''; api.diz('Agora toque na nuvem para chover. O que será que acontece com a casa quando a água sobe?'); }
  el(s, '#vi-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'base') { toca('clique'); api.diz('Esta nuvem está carregada de água! Primeiro, escolha uma base para a casa.'); return; }
    if (fase !== 'chuva' || testando) return;
    if (!boiando) { toca('clique'); api.diz('Primeiro escolha uma base que boia!'); return; }
    fase = 'subindo'; toca('chuva'); el(s, '#vi-nuvem').setAttribute('opacity', 1); el(s, '#vi-nuvem-dica').style.display = 'none';
    el(s, '#vi-nuvem-cinza').setAttribute('opacity', 1); el(s, '#vi-nuvem-esc').setAttribute('opacity', 1); el(s, '#vi-escuro').setAttribute('opacity', .16);
    [0, 1000, 2000].forEach(ms => depois(ms, () => c.chover(214, 430, 100, agua, 60, '#3D8BFF')));
    depois(900, () => tween(2800, k => { agua = AG0 - SOBE * lento(k); }));
    depois(2600, () => { respingos(40, 150, 14); toca('splash'); });
    depois(3800, () => {
      el(s, '#vi-nuvem-cinza').setAttribute('opacity', 0); el(s, '#vi-nuvem-esc').setAttribute('opacity', 0); el(s, '#vi-escuro').setAttribute('opacity', 0);
      el(s, '#vi-nuvem').setAttribute('opacity', .6); el(s, '#vi-arco').setAttribute('opacity', 1); toca('vitoria'); c.brilhos(CX, agua - 120, 8, '#FFE27A');
      api.diz('A água subiu e a casa que boia subiu junto! A casa da margem ficou com o pé molhado. Toque nos cartões-postais para conhecer vilas de verdade.');
      fase = 'postais'; mostrarPostais();
    });
  });
  /* ---------- extras ---------- */
  el(s, '#vi-sol').addEventListener('click', () => {
    toca('ok'); el(s, '#vi-sol').animate([{ transform:'scale(1)' }, { transform:'scale(1.12)' }, { transform:'scale(1)' }], { duration:700 });
    for (let i = 0; i < 14; i++) c.add({ tipo:'vapor', x0:sorte(300, 760), y0:agua - 2, x1:320 + sorte(-60, 60), y1:70 + sorte(-14, 14), dur:sorte(80, 120), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
    api.diz('O sol esquenta o lago. Um pouquinho da água vira vapor, sobe e ajuda a formar as nuvens.');
  });
  let patoK = 0;
  el(s, '#vi-patos').addEventListener('click', () => {
    patoK++; tom(520, 0, .1, 'sawtooth', .08, 380); tom(500, .16, .1, 'sawtooth', .08, 360);
    el(s, '#vi-patos-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px)' }, { transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:700 });
    respingos(246, 326, 6);
    api.diz(patoK % 2 ? 'Quá, quá! As penas do pato têm um óleo que não deixa a água entrar. Por isso ele boia sequinho.' : 'Os patinhos seguem a mamãe em fila pela água.');
  });
  const pin = el(s, '#vi-peixes');
  const nado = pin.animate([{ transform:'translate(330px, 392px)' }, { transform:'translate(450px, 410px)' }, { transform:'translate(600px, 396px)' }], { duration:16000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#vi-peixes-in').animate([{ transform:'translateY(-3px)' }, { transform:'translateY(3px)' }], { duration:1200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  let virado = false;
  const vira = setInterval(() => { if (!vivo) return; const vai = (nado.currentTime || 0) % 32000 < 16000; if (vai === virado) { virado = !vai; el(s, '#vi-peixes-vira').setAttribute('transform', virado ? 'scale(-1 1)' : ''); } }, 200);
  timers.push(vira);
  pin.addEventListener('click', () => {
    toca('glub'); nado.playbackRate = 4; depois(900, () => { nado.playbackRate = 1; });
    const m = new DOMMatrix(getComputedStyle(pin).transform); bolhas(m.e || 450, (m.f || 400) - 6, 8, 20);
    api.diz('Os peixinhos adoram a sombra embaixo da casa que boia. Ali é um ótimo esconderijo!');
  });
  el(s, '#vi-ra').addEventListener('click', () => {
    toca('glub'); el(s, '#vi-ra-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.18, .9)' }, { transform:'scale(1)' }], { duration:600 }); bolhas(560, 456, 6, 10);
    api.diz('É a rã-gigante do Lago Titicaca! Ela quase nunca sobe para respirar: tira o ar da água pela pele toda enrugada.');
  });
  el(s, '#vi-garca').addEventListener('click', () => {
    toca('clique'); el(s, '#vi-garca-pesc').animate([{ transform:'translate(0,0)' }, { transform:'translate(8px,10px)' }, { transform:'translate(0,0)' }], { duration:700 });
    api.diz('A garça fica paradinha no píer, esperando um peixe passar.');
  });
  el(s, '#vi-regua').addEventListener('click', () => {
    toca('clique'); c.brilhos(636, agua, 4, '#FFE27A');
    api.diz(agua < AG0 ? 'Veja na régua: a água do lago subiu bastante com a chuva!' : 'Esta régua mostra a altura da água do lago. Fique de olho nela quando chover!');
  });
  el(s, '#vi-margem').addEventListener('click', () => {
    toca('clique');
    api.diz(agua < AG0 ? 'A casa da margem está presa no chão, então não sobe. A água entrou pela porta!' : 'Esta casa de adobe fica em terra firme, presa no chão.');
  });
  /* ---------- cartões-postais ---------- */
  function mostrarPostais(){
    const box = document.createElement('div'); box.className = 'postais'; box.style.marginTop = '6px';
    box.innerHTML = p.figs.map(f => `<button class="postal" data-f="${f.id}"><div class="img">${figSvg(f.sym, f.vb)}</div><b>${f.nome}</b><span>${f.lugar}</span></button>`).join('');
    $('#p-acoes').appendChild(box);
    box.addEventListener('click', e => {
      const b = e.target.closest('.postal'); if (!b) return;
      const f = p.figs.find(f => f.id === b.dataset.f);
      modal(`<div class="postal-grande">${figSvg(f.sym, f.vb)}</div><h2>${f.nome}</h2><p style="font-weight:700;color:var(--tinta2)">${f.lugar}</p><p>${f.fato}</p><button class="btn azul peq" id="m-ok">Guardar no álbum</button>`);
      falar(f.nome + '. ' + f.fato);
      $('#m-ok').onclick = () => {
        fecharModal(); b.classList.add('visto'); vistos[f.id] = true;
        estado.figs[f.id] = true; salvar(); contar(); toca('fig');
        if (Object.keys(vistos).length === p.figs.length) depois(500, api.fim);
      };
    });
  }
  api.diz('Vamos construir uma casa que boia? Escolha uma base embaixo da cena e veja se ela boia ou afunda!');
  return () => { vivo = false; timers.forEach(t => { clearTimeout(t); clearInterval(t); }); c.parar(); };
}
