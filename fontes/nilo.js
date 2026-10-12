/* ================= JOGO 15: Rio Nilo, o rio das cheias ================= */
function jogoNilo(palco, api){
  semente = 31;
  let vivo = true, fase = 'cheia', nivel = 0, chegando = 0, regas = 0, carga = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tw = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k, k*k*(3-2*k)); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const lgd = (id, st, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 === undefined ? 1 : y2}">${st.map((c, i) => `<stop offset="${(i / (st.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const PIV = { x:437, y:296 }, L1 = 118, L2 = 58, CORDA = 44, TH_UP = -28, TH_DN = 22, BACIA = { x:398, y:346 };
  const NUV = [{ x:66, y:70, s:1 }, { x:168, y:44, s:1.15 }, { x:268, y:78, s:.92 }];
  const NIVEIS = [392, 366, 338, 306];
  const DOCA = { x:606, y:452 }, DE = .86;
  /* canteiros: [x topo esq, x topo dir, x base esq, x base dir] */
  const CANT = [[306, 462, 286, 478], [166, 294, 144, 274], [26, 154, 4, 132]];
  const Y0 = 366, Y1 = 490;
  const ITENS = [{ id:'trigo', x:384, y:420 }, { id:'linho', x:218, y:420 }, { id:'cebola', x:98, y:418 }];
  const FX = 518, FY = 384, FK = 1.35;
  const dentro = (c, qx, qy) => { const yy = Y0 + (Y1 - Y0) * qy, xl = c[0] + (c[2] - c[0]) * qy, xr = c[1] + (c[3] - c[1]) * qy; return [xl + (xr - xl) * qx, yy]; };
  const rachas = c => { let d = ''; for (let k = 0; k < 8; k++) { let [x, y] = dentro(c, R(.08, .92), R(.08, .92)); d += `M${x.toFixed(1)} ${y.toFixed(1)}`; for (let j = 0; j < 4; j++) { x += R(-13, 13); y += R(-7, 7); d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; if (j === 1) d += ` M${x.toFixed(1)} ${y.toFixed(1)} l${R(-8, 8).toFixed(1)} ${R(3, 7).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)}`; } d += ' '; } return `<path d="${d}" stroke="#F8E6BC" stroke-width="1.1" fill="none" opacity=".6" transform="translate(.8 1)"/><path d="${d}" stroke="#7E5A30" stroke-width="1.2" fill="none" stroke-linejoin="round" opacity=".85"/>`; };
  const torroes = (c, cor, borda, luz, n) => Array.from({ length:n || 24 }, () => { const [x, y] = dentro(c, R(.04, .96), R(.04, .96)), r = 1.4 + (y - Y0) / (Y1 - Y0) * 2.2; return `<ellipse cx="${x.toFixed(1)}" cy="${(y + r * .5).toFixed(1)}" rx="${(r * 1.5).toFixed(1)}" ry="${(r * .6).toFixed(1)}" fill="#000" opacity=".15"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r * 1.4).toFixed(1)}" ry="${r.toFixed(1)}" fill="${cor}" stroke="${borda}" stroke-width=".7"/><path d="M${(x - r).toFixed(1)} ${(y - r * .2).toFixed(1)} q${r.toFixed(1)} ${(-r * .9).toFixed(1)} ${(2 * r).toFixed(1)} 0" stroke="${luz}" stroke-width=".9" fill="none"/>`; }).join('');
  const papiroMini = (x, y, s) => `<g class="balanca" style="animation-duration:${R(4, 6.5).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s"><ellipse cx="${x}" cy="${y}" rx="${(8 * s).toFixed(1)}" ry="${(2 * s).toFixed(1)}" fill="#1E4A1A" opacity=".4"/>${[[-7, -24], [0, -32], [8, -22], [-2, -18]].map(([dx, dy]) => { const ex = x + dx * s, ey = y + dy * s; let r = ''; for (let k = 0; k < 11; k++) { const a = Math.PI * (.95 + 1.1 * k / 10); r += `M${ex.toFixed(1)} ${ey.toFixed(1)} q${(Math.cos(a) * 4 * s).toFixed(1)} ${(Math.sin(a) * 4 * s - 1.4 * s).toFixed(1)} ${(Math.cos(a) * 7 * s).toFixed(1)} ${(Math.sin(a) * 5 * s + 1.6 * s).toFixed(1)} `; } const st = `M${x} ${y} Q${(x + dx * s * .3).toFixed(1)} ${(y + dy * s * .5).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`; return `<path d="${st}" stroke="#2E6A22" stroke-width="${(2.4 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${st}" stroke="#8ACB54" stroke-width="${(1.1 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${r}" stroke="#3E7A22" stroke-width="${(1.5 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${r}" stroke="#C0EA84" stroke-width="${(.7 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`;
  const abelharuco = () => `<path d="M-6 1 L-22 5" stroke="#1E5A2A" stroke-width="2.4" stroke-linecap="round"/><path d="M-6 1 L-22 5" stroke="#5AC05A" stroke-width="1" stroke-linecap="round"/><path d="M-1 4 v3 M3 4 v3" stroke="#3A2A1A" stroke-width="1" stroke-linecap="round"/><path d="M-7 0 C-7 -6 4 -9 8 -4 C10 0 6 4 0 4 C-4 4 -7 3 -7 0Z" fill="url(#niAbel)" stroke="#1E5A2A" stroke-width="1"/><path d="M-5 -1 C-2 -4 2 -4 5 -2" stroke="#2E8A3A" stroke-width="1.4" fill="none"/><circle cx="8" cy="-6" r="4.4" fill="#6ACC5A" stroke="#1E5A2A" stroke-width="1"/><path d="M5 -9.6 q3 -1.6 6 .4" stroke="#E8B030" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M4 -6 h9" stroke="#12121A" stroke-width="1.7" stroke-linecap="round"/><path d="M8 -2.4 q3 1 5 -1" stroke="#2EA8E0" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M12 -6.2 L20 -4.6 L12 -4.2Z" fill="#1A1A22"/><circle cx="9" cy="-6.2" r="1.3" fill="#B8241A"/><circle cx="9.4" cy="-6.6" r=".45" fill="#fff"/><path d="M-3 -4 q3 -2 6 -1" stroke="#D8F8B0" stroke-width="1" fill="none"/>`;
  const POUSO_A = [[290, 226], [306, 214], [322, 232]], POUSO_B = [[414, 293], [452, 293], [463, 293]];
  /* ---------- desenhos ---------- */
  const palmeira = (x, y, h, s, cor, esc, dir) => {
    const d = dir || 1, tx = x + d * h * .18, ty = y - h;
    let fol = '';
    [[-150, 1], [-118, .9], [-80, 1.05], [-48, .95], [-20, .9], [-176, .85], [8, .8]].forEach(([a, k], i) => {
      const r = 34 * s * k, ar = a * Math.PI / 180, ex = tx + Math.cos(ar) * r, ey = ty + Math.sin(ar) * r * .8 + r * .38;
      const mx = tx + Math.cos(ar) * r * .55, my = ty + Math.sin(ar) * r * .55 - 6 * s;
      fol += `<path d="M${tx.toFixed(1)} ${ty.toFixed(1)} Q${mx.toFixed(1)} ${(my - 7 * s).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} Q${(mx + 2).toFixed(1)} ${(my + 5 * s).toFixed(1)} ${tx.toFixed(1)} ${(ty + 3 * s).toFixed(1)}Z" fill="${i % 2 ? cor : esc}" stroke="#1E4A1A" stroke-width="${(1.1 * s).toFixed(1)}" stroke-linejoin="round"/>`;
      fol += `<path d="M${tx.toFixed(1)} ${ty.toFixed(1)} Q${mx.toFixed(1)} ${(my - 4 * s).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#CDEB8A" stroke-width="${(.9 * s).toFixed(1)}" fill="none" opacity=".75"/>`;
      for (let j = 1; j < 5; j++) { const q = j / 5, px = tx + (ex - tx) * q, py = ty + (ey - ty) * q - Math.sin(q * Math.PI) * 6 * s; fol += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(Math.cos(ar + 1.2) * 5 * s).toFixed(1)} ${(4 * s).toFixed(1)}" stroke="#1E4A1A" stroke-width="${(.8 * s).toFixed(1)}" opacity=".6"/>`; }
    });
    let aneis = ''; for (let j = 1; j < 9; j++) { const q = j / 9, px = x + (tx - x) * q * q * .6 + (tx - x) * q * .4, py = y - h * q; aneis += `<path d="M${(px - 3.2 * s).toFixed(1)} ${py.toFixed(1)} q${(3.2 * s).toFixed(1)} ${(2.4 * s).toFixed(1)} ${(6.4 * s).toFixed(1)} 0" stroke="#5A3A1E" stroke-width="${(.9 * s).toFixed(1)}" fill="none"/>`; }
    return `<g class="ni-palma"><ellipse cx="${x + 4}" cy="${y + 1}" rx="${(16 * s).toFixed(1)}" ry="${(3 * s).toFixed(1)}" fill="#1E3A12" opacity=".22"/><path d="M${x} ${y} C${x + d * 2} ${y - h * .5} ${tx - d * 4} ${ty + h * .3} ${tx} ${ty}" stroke="#4E3018" stroke-width="${(7.4 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x + d * 2} ${y - h * .5} ${tx - d * 4} ${ty + h * .3} ${tx} ${ty}" stroke="#A8784A" stroke-width="${(4.6 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>${aneis}<g class="balanca" style="animation-duration:${R(4, 6).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s">${fol}<g stroke="#5A2A10" stroke-width=".7">${[[-4, 6], [0, 8], [4, 6], [-2, 11], [2, 11]].map(([dx, dy]) => `<circle cx="${(tx + dx * s).toFixed(1)}" cy="${(ty + dy * s).toFixed(1)}" r="${(2.4 * s).toFixed(1)}" fill="${dy > 8 ? '#C8642A' : '#E08A34'}"/>`).join('')}</g></g></g>`;
  };
  const casa = (x, y, w, h, porta, enfeite, extra) => { const px = x + w * .5; let tri = ''; for (let k = 0; k < Math.floor((w - 4) / 6); k++) tri += `<path d="M${x + 3 + k * 6} ${y - h + 5} l3 4 l3 -4Z" fill="${k % 2 ? enfeite : porta}" stroke="#5A3418" stroke-width=".5"/>`;
    let merl = ''; for (let k = 0; k < Math.floor(w / 9); k++) merl += `<path d="M${x + 1 + k * 9} ${y - h} v-4 q3.5 -3 7 0 v4" fill="#E0B07A" stroke="#7A4A26" stroke-width="1.1"/>`;
    return `<g>
      <ellipse cx="${x + w * .6}" cy="${y + 2}" rx="${w * .66}" ry="4.4" fill="#3A2410" opacity=".24"/>
      ${merl}
      <rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="url(#niAdobe)" stroke="#7A4A26" stroke-width="1.6"/>
      <rect x="${x + w - 8}" y="${y - h + .8}" width="7.2" height="${h - 1.6}" fill="#9A6234" opacity=".3"/>
      <path d="M${x + 1} ${y - h + 1} h${w - 2} v3 h-${w - 2}Z" fill="#7A4A26" opacity=".25"/>
      <path d="${copa(x + w * .28, y - h * .42, 6, 3.6, 6, .3)}" fill="#F8DCB0" opacity=".55"/><path d="${copa(x + w * .78, y - h * .7, 4, 2.6, 6, .3)}" fill="#F8DCB0" opacity=".45"/>
      <g stroke="#9A6A3E" stroke-width=".9" opacity=".55"><path d="M${x + 4} ${y - 9} h7 M${x + w - 16} ${y - 13} h8 M${x + 6} ${y - h + 20} h6 M${x + w - 12} ${y - 6} h6"/><path d="M${x + w - 10} ${y - h + 4} l-3 6 l2 5" fill="none"/></g>
      <path d="M${x + 3} ${y - h + 4} V${y - 3}" stroke="#FCE6C0" stroke-width="1.6" opacity=".8"/>
      ${tri}
      <path d="M${px - 10} ${y} V${y - 22} C${px - 10} ${y - 31} ${px + 10} ${y - 31} ${px + 10} ${y - 22} V${y}Z" fill="${porta}" stroke="#2A3A5A" stroke-width="1.1"/>
      <path d="M${px - 7} ${y} V${y - 21} C${px - 7} ${y - 27} ${px + 7} ${y - 27} ${px + 7} ${y - 21} V${y}Z" fill="url(#niMadeira)" stroke="#3E2210" stroke-width="1.2"/>
      <path d="M${px - 3.5} ${y - 25} V${y} M${px} ${y - 26} V${y} M${px + 3.5} ${y - 25} V${y}" stroke="#4E2E14" stroke-width=".8" opacity=".7"/>
      <path d="M${px - 7} ${y - 16} h14 M${px - 7} ${y - 6} h14" stroke="#3E2210" stroke-width="1.2"/>
      <circle cx="${px + 4.6}" cy="${y - 11}" r="1.4" fill="none" stroke="#E8C060" stroke-width=".9"/>
      <path d="M${px - 6} ${y - 22} q2 -3 5 -3" stroke="#D8A070" stroke-width="1" fill="none" opacity=".8"/>
      ${[x + 7, x + w - 16].map(wx => `<rect x="${wx}" y="${y - h + 13}" width="9" height="8" rx="1" fill="#2A1C14" stroke="#7A4A26" stroke-width="1"/><path d="M${wx + 3} ${y - h + 13} v8 M${wx + 6} ${y - h + 13} v8" stroke="#8A6A4A" stroke-width=".7"/><path d="M${wx - 4} ${y - h + 13} h4 v8 h-4Z M${wx + 9} ${y - h + 13} h4 v8 h-4Z" fill="url(#niMadeira)" stroke="#3E2210" stroke-width=".7"/><path d="M${wx - 1} ${y - h + 22.6} h11" stroke="#F8DCB0" stroke-width="1.3"/>`).join('')}
      ${extra || ''}</g>`; };
  const zir = (x, y) => `<g id="ni-zir" class="toque"><ellipse cx="${x}" cy="${y + 1}" rx="12" ry="2.6" fill="#3A2410" opacity=".25"/><path d="M${x - 9} ${y} l3 -12 M${x + 9} ${y} l-3 -12 M${x - 7} ${y - 6} h14" stroke="#6E4220" stroke-width="2" stroke-linecap="round"/>
      <path d="M${x - 6} ${y - 24} C${x - 12} ${y - 20} ${x - 10} ${y - 8} ${x} ${y - 6} C${x + 10} ${y - 8} ${x + 12} ${y - 20} ${x + 6} ${y - 24}Z" fill="url(#niBarro)" stroke="#6E3414" stroke-width="1.3"/>
      <ellipse cx="${x}" cy="${y - 24}" rx="6" ry="1.8" fill="#5A2A10" stroke="#6E3414" stroke-width="1"/><path d="M${x - 6} ${y - 19} q-2 6 1 10" stroke="#F4B080" stroke-width="1.4" fill="none" opacity=".8"/>
      <path d="M${x - 4} ${y - 14} q4 3 8 0" stroke="#8A4420" stroke-width=".8" fill="none"/><circle id="ni-zir-gota" cx="${x}" cy="${y - 4}" r="1.6" fill="#7FCBF0" style="opacity:0"/>
      <rect x="${x - 14}" y="${y - 30}" width="28" height="32" fill="transparent"/></g>`;
  const toldo = (x0, x1, y) => { let h = ''; for (let k = x0 + 2; k < x1 - 1; k += 3) h += `M${k} ${y - 4} l${(k - (x0 + x1) / 2) * .04 + 1} 9 `; return `<path d="M${x0 + 3} ${y + 4} V${y + 28} M${x1 - 3} ${y + 4} V${y + 28}" stroke="#6E4220" stroke-width="2.2" stroke-linecap="round"/><path d="M${x0 - 2} ${y - 4} H${x1 + 2} L${x1 + 4} ${y + 5} H${x0 - 4}Z" fill="#B8A054" stroke="#5A4A1E" stroke-width="1.1"/><path d="${h}" stroke="#7A6A2A" stroke-width=".8"/><path d="M${x0 - 4} ${y + 5} H${x1 + 4}" stroke="#E2D08A" stroke-width="1.2"/><path d="M${x0} ${y + 6} H${x1}" stroke="#3A2410" stroke-width="3" opacity=".18"/>`; };
  const escadaTeto = (x, y, h) => Array.from({ length:5 }, (_, k) => `<path d="M${x + k * 3.4} ${y - k * h / 5} h7 v${-h / 5} h-7Z" fill="#D8A870" stroke="#7A4A26" stroke-width=".9"/><path d="M${x + k * 3.4} ${y - (k + 1) * h / 5} h7" stroke="#FCE6C0" stroke-width="1"/>`).join('');
  const varal = (x0, x1, y) => `<path d="M${x0} ${y + 8} V${y - 2} M${x1} ${y + 8} V${y - 2}" stroke="#6E4220" stroke-width="1.4"/><path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + 4} ${x1} ${y}" stroke="#5A4A3A" stroke-width=".8" fill="none"/>${[['#E5392C', 0], ['#2E7BF6', 1], ['#F2C83A', 2], ['#FFFFFF', 3]].map(([c, k]) => { const xx = x0 + 4 + k * (x1 - x0 - 8) / 4; return `<path d="M${xx} ${y + 1.6} h7 l-1 8 h-5Z" fill="${c}" stroke="#4E3A2A" stroke-width=".7"/>`; }).join('')}`;
  const garca = (x, y, s, i) => `<g class="ni-garca" data-i="${i}" transform="translate(${x} ${y}) scale(${s})"><g class="ni-garca-in">
      <ellipse cx="0" cy="13" rx="9" ry="2" fill="#1E3A12" opacity=".25"/>
      <path d="M-2 0 l-1.4 13 M3 0 l1.6 13" stroke="#5A5A3A" stroke-width="1.8" stroke-linecap="round"/><path d="M-6 13 h5 M2 13 h6" stroke="#5A5A3A" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M-11 -10 C-12 -20 0 -24 8 -18 C12 -12 10 -2 2 1 C-6 3 -12 -2 -11 -10Z" fill="url(#niGarca)" stroke="#7A8AA8" stroke-width="1.3"/>
      <path d="M-11 -10 C-15 -8 -18 -4 -19 -1 C-15 -3 -12 -4 -9 -5Z" fill="#F4F6FA" stroke="#7A8AA8" stroke-width="1"/>
      <path d="M-6 -16 C-2 -19 3 -19 6 -17" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M5 -17 C10 -22 4 -28 8 -33" stroke="#7A8AA8" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="M5 -17 C10 -22 4 -28 8 -33" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M4 -22 C6 -24 6 -27 6 -29" stroke="#F2C88A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="10" cy="-35" rx="5" ry="4.4" fill="#FFFFFF" stroke="#7A8AA8" stroke-width="1.2"/><path d="M6 -38 C8 -41 12 -41 14 -38" stroke="#F2C070" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M14 -35.6 L23 -33.4 L14 -32.6Z" fill="#F2B82A" stroke="#A8740E" stroke-width=".7" stroke-linejoin="round"/>
      <circle cx="11.6" cy="-35.4" r="1.3" fill="#12121A"/><circle cx="12" cy="-35.9" r=".45" fill="#fff"/></g></g>`;
  /* canteiros */
  const cantPath = (c, enc) => { const [a, b, cc, dd] = c, e = enc || 0; return `M${a + e} ${Y0 + e * .6} L${b - e} ${Y0 + e * .6} L${dd - e} ${Y1 - e * .4} L${cc + e} ${Y1 - e * .4}Z`; };
  const sulcos = (c, cor, w, op) => { const [a, b, cc, dd] = c; let s = ''; for (let k = 1; k < 8; k++) { const q = k / 8; s += `M${(a + (b - a) * q).toFixed(1)} ${Y0 + 3} L${(cc + (dd - cc) * q).toFixed(1)} ${Y1 - 3} `; } return `<path d="${s}" stroke="${cor}" stroke-width="${w}" fill="none" opacity="${op}"/>`; };
  const ondulas = (c, cor, w, op) => { const [a, b, cc, dd] = c; let s = ''; for (let r = 0; r < 9; r++) { const yy = Y0 + 8 + r * 14, q = (yy - Y0) / (Y1 - Y0), xl = a + (cc - a) * q + 4, xr = b + (dd - b) * q - 4, n = Math.round((xr - xl) / 16); s += `M${xl.toFixed(1)} ${yy}`; for (let k = 0; k < n; k++) s += ` q${((xr - xl) / n / 2).toFixed(1)} ${k % 2 ? 2 : -2} ${((xr - xl) / n).toFixed(1)} 0`; s += ' '; } return `<path d="${s}" stroke="${cor}" stroke-width="${w}" fill="none" opacity="${op}" stroke-linecap="round"/>`; };
  const fileira = (c, fn) => { const [a, b, cc, dd] = c; let s = ''; for (let r = 0; r < 5; r++) { const yy = Y0 + 14 + r * 24, q = (yy - Y0) / (Y1 - Y0), xl = a + (cc - a) * q + 8, xr = b + (dd - b) * q - 8, n = 7; for (let k = 0; k < n; k++) s += fn(xl + (xr - xl) * (k + .5) / n, yy, .7 + q * .5, r * n + k); } return s; };
  const broto = (x, y, s) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(-1 * s).toFixed(1)} ${(-5 * s).toFixed(1)} ${(-5 * s).toFixed(1)} ${(-7 * s).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} q${(1 * s).toFixed(1)} ${(-6 * s).toFixed(1)} ${(5 * s).toFixed(1)} ${(-8 * s).toFixed(1)}" stroke="#7FD04A" stroke-width="${(2.2 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  const trigo = (x, y, s) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q-1 ${(-10 * s).toFixed(1)} 1 ${(-20 * s).toFixed(1)}" stroke="#B8862A" stroke-width="${(1.4 * s).toFixed(1)}" fill="none"/><ellipse cx="${(x + 1).toFixed(1)}" cy="${(y - 23 * s).toFixed(1)}" rx="${(2.4 * s).toFixed(1)}" ry="${(5.4 * s).toFixed(1)}" fill="#F2C24A" stroke="#A8741E" stroke-width="${(.8 * s).toFixed(1)}"/><path d="M${(x + 1).toFixed(1)} ${(y - 28 * s).toFixed(1)} l0 ${(-5 * s).toFixed(1)}" stroke="#D8A43A" stroke-width=".8"/><path d="M${(x - 3).toFixed(1)} ${(y - 6 * s).toFixed(1)} q-3 -4 -4 -8 M${(x + 3).toFixed(1)} ${(y - 9 * s).toFixed(1)} q3 -3 4 -7" stroke="#C89A3A" stroke-width="${(1.1 * s).toFixed(1)}" fill="none"/>`;
  const linho = (x, y, s) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q1 ${(-10 * s).toFixed(1)} 0 ${(-20 * s).toFixed(1)} M${x.toFixed(1)} ${(y - 12 * s).toFixed(1)} l${(-4 * s).toFixed(1)} -4 M${x.toFixed(1)} ${(y - 16 * s).toFixed(1)} l${(4 * s).toFixed(1)} -4" stroke="#4E9A3A" stroke-width="${(1.3 * s).toFixed(1)}" fill="none"/><g fill="#7AA8FF" stroke="#2E58B8" stroke-width=".6">${[[0, -22], [-4, -18], [4, -18]].map(([dx, dy]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(2.6 * s).toFixed(1)}"/>`).join('')}</g><circle cx="${x.toFixed(1)}" cy="${(y - 22 * s).toFixed(1)}" r="${(.9 * s).toFixed(1)}" fill="#FFE27A"/>`;
  const cebola = (x, y, s) => `<path d="M${x.toFixed(1)} ${(y - 6 * s).toFixed(1)} q-3 ${(-8 * s).toFixed(1)} -6 ${(-14 * s).toFixed(1)} M${x.toFixed(1)} ${(y - 6 * s).toFixed(1)} q0 ${(-9 * s).toFixed(1)} 1 ${(-16 * s).toFixed(1)} M${x.toFixed(1)} ${(y - 6 * s).toFixed(1)} q3 ${(-7 * s).toFixed(1)} 6 ${(-12 * s).toFixed(1)}" stroke="#4E9A3A" stroke-width="${(1.8 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><ellipse cx="${x.toFixed(1)}" cy="${(y - 3 * s).toFixed(1)}" rx="${(4.6 * s).toFixed(1)}" ry="${(3.8 * s).toFixed(1)}" fill="#B04A8A" stroke="#6A1E4E" stroke-width="${(.8 * s).toFixed(1)}"/><path d="M${(x - 2 * s).toFixed(1)} ${(y - 5 * s).toFixed(1)} q1 -1 2 -1" stroke="#F0B0D8" stroke-width="1" fill="none"/>`;
  const MADURO = [trigo, linho, cebola];
  const feixe = {
    trigo:`<g stroke-linecap="round"><path d="M-14 22 L4 -14 M-8 24 L6 -16 M-2 24 L8 -14 M4 24 L10 -12 M10 22 L12 -10" stroke="#8A5A1A" stroke-width="3.6"/><path d="M-14 22 L4 -14 M-8 24 L6 -16 M-2 24 L8 -14 M4 24 L10 -12 M10 22 L12 -10" stroke="#E2B04A" stroke-width="2"/></g>${[[4, -18], [7, -21], [10, -18], [13, -14], [1, -15]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="7" transform="rotate(14 ${x} ${y})" fill="#F6CC5A" stroke="#A8741E" stroke-width="1"/><path d="M${x} ${y - 7} l1 -6" stroke="#E0B04A" stroke-width=".9"/>`).join('')}<path d="M-8 6 C-2 10 6 10 12 4" stroke="#C8302A" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-6 6 C-1 8 4 8 9 5" stroke="#FF8A7A" stroke-width="1" fill="none"/>`,
    linho:`<g stroke-linecap="round"><path d="M-10 24 L0 -14 M-4 24 L3 -16 M2 24 L6 -14 M8 24 L9 -12" stroke="#3E6A22" stroke-width="3.6"/><path d="M-10 24 L0 -14 M-4 24 L3 -16 M2 24 L6 -14 M8 24 L9 -12" stroke="#9ACB5E" stroke-width="2"/></g><g fill="#7AA8FF" stroke="#2E58B8" stroke-width=".9">${[[0, -18], [4, -21], [8, -17], [-3, -14], [11, -13]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6"/>`).join('')}</g><g fill="#FFE27A">${[[0, -18], [4, -21], [8, -17]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g><path d="M-6 8 C-1 12 6 11 11 6" stroke="#E8C88A" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
    cebola:`<path d="M-20 0 C-22 18 -12 24 0 24 C12 24 22 18 20 0Z" fill="url(#niCesto)" stroke="#6E3E14" stroke-width="1.8"/><path d="M-19 8 C-8 12 8 12 19 8 M-17 16 C-6 20 6 20 17 16" stroke="#8A5A22" stroke-width="1.2" fill="none"/>${[[-11, -2], [0, -5], [11, -2], [-5, -10], [6, -10]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="6" fill="#B04A8A" stroke="#6A1E4E" stroke-width="1.2"/><path d="M${x - 3} ${y - 2} q2 -2 4 -2" stroke="#F0B0D8" stroke-width="1.2" fill="none"/><path d="M${x} ${y - 6} l0 -4" stroke="#C8B07A" stroke-width="1.2"/>`).join('')}<path d="M-21 0 C-8 4 8 4 21 0" stroke="#5A3010" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M-19 -1 C-8 2 8 2 19 -1" stroke="#E0A858" stroke-width="1.1" fill="none"/>`
  };
  /* rio: margens */
  const RIO = 'M246 181 C296 190 352 199 400 214 C450 230 490 262 500 300 C508 336 514 400 500 500 L700 500 C676 420 640 340 600 296 C560 254 480 222 422 206 C362 190 302 182 254 179Z';
  const CHEIA = 'M0 302 C120 296 250 292 350 286 C410 282 452 262 468 240 L540 236 C590 248 640 262 684 272 V412 H800 V500 H0Z';
  const ESCADA = (() => { let d = 'M690 262', t = ''; for (let i = 0; i < 9; i++) { const x = 708 + i * 6, y = 262 + i * 17; d += ` H${x} V${y + 17}`; t += `<path d="M690 ${y} H${x}" stroke="#FCEAC8" stroke-width="2" stroke-linecap="round"/><path d="M${x - 1} ${y + 2} V${y + 16}" stroke="#7A5434" stroke-width="2" opacity=".45"/><path d="M690 ${y + 4} H${x - 2}" stroke="#8A6440" stroke-width="1" opacity=".35"/>`; } d += ' H762 V420 H690Z'; return `<path d="${d}" fill="url(#niDegrau)" stroke="#6E4A2A" stroke-width="1.3" stroke-linejoin="round"/>${t}`; })();
  const BLOCOS = (() => { let d = ''; for (let r = 0; r < 15; r++) { const y = 248 + r * 12; d += `M676 ${y} H804 `; for (let x = 676 + (r % 2 ? 10 : 0); x < 804; x += 20) d += `M${x} ${y} v12 `; } return d; })();
  const BLOCOS2 = (() => { let d = ''; for (let r = 0; r < 14; r++) { const y = 256 + r * 12; d += `M690 ${y} H790 `; for (let x = 690 + (r % 2 ? 9 : 0); x < 790; x += 18) d += `M${x} ${y} v12 `; } return d; })();
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Rio Nilo no Egito: montanhas distantes com nuvens de chuva, o rio no meio do deserto, campos, um shaduf, um nilômetro e uma vila">
    <defs>
      ${lgd('niCeu', ['#4FA2E2', '#9CCDEE', '#F6E2C0'])}
      ${lgd('niMonteL', ['#93AFC6', '#B9C6D4'])}${lgd('niMonte', ['#4E8E7E', '#7AAA86'])}${lgd('niMonteE', ['#2E6A62', '#4E8A6A'])}
      ${lgd('niPlato', ['#F0C49A', '#D4966A'])}${lgd('niAreia', ['#F6DCA4', '#E2B474'])}${lgd('niDuna', ['#F8E2B0', '#E8BC7A'])}
      ${lgd('niVerde', ['#9CCB5A', '#6AA844', '#4E8E36'])}
      ${lgd('niRio', ['#7FCFE0', '#3E9EC4', '#1E6E9A'])}${lgd('niRioCheia', ['#C08A5A', '#9A643E', '#7A4A2A'])}
      ${lgd('niCheia', ['#B88C62', '#946A44'])}
      ${lgd('niSeco', ['#E6C890', '#C9A066'])}${lgd('niLama', ['#4E3C30', '#2A1E16'])}${lgd('niMolhado', ['#3A2E28', '#1A1210'])}
      ${lgd('niVerdeC', ['#8ED65A', '#4E9E36'])}${lgd('niOuro', ['#F2D27A', '#D2A040'])}
      ${lgd('niAdobe', ['#ECC48E', '#C8915A'])}${lgd('niPedra', ['#E2C298', '#B48A5E'])}${lgd('niVara', ['#D9A060', '#8A5A2A'], 1, 0)}${lgd('niBalde', ['#C9784A', '#7A3E1E'])}
      ${lgd('niCesto', ['#E0A858', '#A86A28'])}${lgd('niMadeira', ['#B07A44', '#6E4220'], 1, 0)}${lgd('niBarro', ['#E08A54', '#9A4A22'], 1, 0)}${lgd('niPoco', ['#5A4028', '#3A2818'])}<linearGradient id="niSombraT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140C06" stop-opacity=".55"/><stop offset="1" stop-color="#140C06" stop-opacity="0"/></linearGradient>${lgd('niColuna', ['#F0D8B0', '#B8915E'], 1, 0)}${lgd('niDegrau', ['#E8CCA0', '#BC976A'])}${lgd('niTil', ['#B8D0C8', '#6E8E86'])}${lgd('niAbel', ['#7ADC6A', '#2E9A3E'])}${lgd('niFolha', ['#7FC04A', '#2E6A22'], 1, 0)}<linearGradient id="niBruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0" stop-opacity=".5"/><stop offset="1" stop-color="#FFF4E0" stop-opacity="0"/></linearGradient><linearGradient id="niReflexo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFEFFF" stop-opacity="0"/><stop offset=".5" stop-color="#CFEFFF" stop-opacity=".4"/><stop offset="1" stop-color="#CFEFFF" stop-opacity="0"/></linearGradient>${lgd('niVela', ['#FFFFFF', '#E8DCC2'], 1, 1)}${lgd('niCasco', ['#F4F6FA', '#B8C4D6'])}
      ${lgd('niBufalo', ['#6A6672', '#2A262E'])}${lgd('niGarca', ['#FFFFFF', '#DCE2EE'])}${lgd('niChifre', ['#E8DCC8', '#7A6A58'], 1, 0)}${lgd('niGalab', ['#9CC8E8', '#5E90BE'])}${lgd('niBlusa', ['#FF8A5A', '#E0502E'])}
      <radialGradient id="niSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFD24A"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <radialGradient id="niPele1" cx=".4" cy=".35"><stop offset="0" stop-color="#C98A5A"/><stop offset="1" stop-color="#8A5530"/></radialGradient>
      <radialGradient id="niPele2" cx=".4" cy=".35"><stop offset="0" stop-color="#B07448"/><stop offset="1" stop-color="#7A4626"/></radialGradient>
      <radialGradient id="niPeso" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#9A8A78"/><stop offset=".6" stop-color="#6A5A4A"/><stop offset="1" stop-color="#3E3228"/></radialGradient>
      <radialGradient id="niVinheta" cx=".5" cy=".46" r=".78"><stop offset=".62" stop-color="#3A1E0A" stop-opacity="0"/><stop offset="1" stop-color="#3A1E0A" stop-opacity=".32"/></radialGradient>
      <linearGradient id="niNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E0" stop-opacity=".7"/></linearGradient>
      <clipPath id="niPocoC"><path d="M690 416 V252 H790 V416Z"/></clipPath><filter id="niDesf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>${CANT.map((c, i) => `<clipPath id="niCantC${i}"><path d="${cantPath(c)}"/></clipPath>`).join('')}
      <clipPath id="niRioC"><path d="${RIO}"/></clipPath>
      <filter id="niGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="200" fill="url(#niCeu)"/>
    <g id="ni-sol" class="toque"><circle cx="694" cy="62" r="58" fill="#FFE8A0" opacity=".25"/><circle cx="694" cy="62" r="42" fill="#FFE27A" opacity=".3"/><circle cx="694" cy="62" r="27" fill="url(#niSolG)" stroke="#F0A81E" stroke-width="2.2"/><path d="M680 52 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="440" y="40" width="70" height="32" style="color:#fff" opacity=".7"/><use href="#nuvem" x="560" y="96" width="52" height="24" style="color:#fff" opacity=".55"/></g>
    <!-- planalto da Etiópia, longe -->
    <path d="M0 150 C30 116 66 96 104 104 C134 80 176 74 210 94 C244 100 280 124 330 160 L334 184 H0Z" fill="url(#niMonteL)"/>
    <path d="M0 184 C20 150 56 128 98 136 C130 118 170 118 204 134 C236 146 268 162 300 184Z" fill="url(#niMonte)" stroke="#3E7A6A" stroke-width="1.4"/>
    <g fill="#3E7A62" opacity=".55">${Array.from({ length:18 }, () => { const x = R(20, 280), y = R(148, 178); return `<path d="${copa(x, y, R(6, 11), R(3, 5), 6, .3)}"/>`; }).join('')}</g>
    <path d="M30 160 C60 146 90 144 120 150 M150 140 C180 138 210 146 236 160" stroke="#A8D0B0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M0 184 C26 168 52 160 80 166 C100 158 124 160 140 172 L150 184Z" fill="url(#niMonteE)" opacity=".9"/>
    <path id="ni-cascata" d="M176 132 C182 148 190 160 200 168 C214 176 232 180 250 182" stroke="#8ED0F0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>
    <!-- deserto e platô -->
    <path d="M300 184 L312 166 H366 L374 158 H452 L462 168 H540 L552 154 H640 L650 162 H736 L748 150 H800 V190 H300Z" fill="url(#niPlato)" stroke="#B87A4E" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M312 166 V184 M374 158 V184 M462 168 V184 M552 154 V184 M650 162 V184 M748 150 V184" stroke="#C88A5E" stroke-width="1.1" opacity=".8"/>
    <path d="M312 167 H366 M374 159 H452 M552 155 H640 M748 151 H800" stroke="#FFE2C0" stroke-width="1.6" opacity=".8"/>
    <rect y="150" width="800" height="40" fill="url(#niNevoa)"/>
    <path d="M0 182 H800 V300 H0Z" fill="url(#niAreia)"/>
    <path d="M0 214 C40 200 80 196 120 204 C150 196 176 192 200 194 C170 200 140 206 120 214 C80 206 40 210 0 222Z" fill="url(#niDuna)" opacity=".9"/>
    <path d="M560 206 C610 196 660 200 700 208 C740 200 780 198 800 202 V214 C760 210 720 214 690 218 C650 212 600 212 560 206Z" fill="url(#niDuna)" opacity=".9"/>
    <path d="M20 238 C40 230 70 228 96 232 M600 220 C640 214 680 216 720 222" stroke="#FFF0D0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
    <!-- faixa verde do Nilo -->
    <path id="ni-faixa" d="M0 262 C80 244 160 210 240 186 C320 190 430 205 520 220 C600 232 700 238 800 236 V500 H0Z" fill="url(#niVerde)"/>
    <path d="M0 262 C80 244 160 210 240 186 C320 190 430 205 520 220 C600 232 700 238 800 236" stroke="#C8E890" stroke-width="2" fill="none" opacity=".8"/>
    <g fill="#4E8E36" opacity=".55">${Array.from({ length:30 }, () => { const x = R(0, 800), y = R(300, 350); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q2 -6 4 0 q2 -5 4 0" />`; }).join('')}</g>
    <!-- arvoredo distante ao longo do rio -->
    <g>${[[262, 192, .34], [300, 196, .4], [340, 200, .42], [380, 206, .46], [430, 214, .5], [540, 226, .52], [580, 232, .56], [620, 236, .6]].map(([x, y, s], i) => palmeira(x, y, 40 * s * 1.6, s, i % 2 ? '#5AA642' : '#4A9638', '#3E8030', i % 2 ? 1 : -1)).join('')}</g>
    <rect y="176" width="800" height="78" fill="url(#niBruma)" pointer-events="none"/>
    <!-- rio -->
    <path d="M246 181 C296 190 352 199 400 214 C450 230 490 262 500 300 C508 336 514 400 500 500 M700 500 C676 420 640 340 600 296 C560 254 480 222 422 206 C362 190 302 182 254 179" stroke="#8A6A44" stroke-width="9" fill="none" opacity=".55"/>
    <path d="M246 181 C296 190 352 199 400 214 C450 230 490 262 500 300 C508 336 514 400 500 500 M700 500 C676 420 640 340 600 296 C560 254 480 222 422 206 C362 190 302 182 254 179" stroke="#D8BC88" stroke-width="5" fill="none"/>
    <path id="ni-rio" d="${RIO}" fill="url(#niRio)" stroke="#1E5A7A" stroke-width="1.6"/>
    <g clip-path="url(#niRioC)" pointer-events="none">
      <path d="M250 182 C300 190 360 198 412 212 C462 228 500 262 536 300 C572 346 590 420 600 500" stroke="#0E4A78" stroke-width="64" fill="none" opacity=".34" filter="url(#niDesf)"/>
      <path d="${RIO}" fill="none" stroke="#D2F4FA" stroke-width="14" opacity=".55" filter="url(#niDesf)"/>
      <g fill="#2E6A3A" opacity=".18">${[[470, 252, .5], [520, 300, .7], [610, 430, .9]].map(([x, y, k]) => `<path d="M${x} ${y} l${(-2 * k).toFixed(1)} ${(26 * k).toFixed(1)} M${x} ${y}" stroke="#2E5A2A" stroke-width="${(3 * k).toFixed(1)}"/><path d="${copa(x - 2 * k, y + 32 * k, 18 * k, 7 * k, 7, .45)}"/>`).join('')}</g>
      <g fill="#FFFFFF" opacity=".22">${[[430, 214, 24], [492, 262, 30], [560, 360, 40], [610, 470, 50]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${(w * .12).toFixed(1)}"/>`).join('')}</g>
      <path d="M444 223 q16 -5 32 -1 q-16 4 -32 1Z" fill="#E8CC94" stroke="#B08A58" stroke-width="1"/><path d="M448 222 q12 -3 24 -1" stroke="#FFF0CC" stroke-width="1" fill="none"/>
      <path d="M624 377 q18 -7 40 -2 q-20 6 -40 2Z" fill="#E8CC94" stroke="#B08A58" stroke-width="1.2"/><path d="M630 375 q14 -4 28 -2" stroke="#FFF0CC" stroke-width="1.2" fill="none"/><g stroke="#4E8A30" stroke-width="1.2" stroke-linecap="round">${[636, 644, 652].map(x => `<path d="M${x} 376 l-1 -6 M${x + 2} 376 l2 -5"/>`).join('')}</g>
    </g>
    <path id="ni-rio-cheia" d="${RIO}" fill="url(#niRioCheia)" style="opacity:0;transition:opacity 1.6s"/>
    <g clip-path="url(#niRioC)" id="ni-reflexos">${[[300, 192, 20], [400, 214, 26], [470, 250, 30], [520, 300, 40], [540, 352, 50], [560, 420, 60], [590, 480, 70]].map(([x, y, w], i) => `<path class="brilha-agua" style="animation-delay:${(i * .4).toFixed(1)}s" d="M${x - w / 2} ${y} q${w / 4} -3 ${w / 2} 0 t${w / 2} 0" stroke="#E6F8FF" stroke-width="${(1 + i * .25).toFixed(1)}" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <path id="ni-centro" d="M250 182 C300 190 360 198 412 212 C462 228 500 262 536 300 C572 346 590 380 640 404" fill="none" stroke="none"/>
    <g class="balanca" style="animation-duration:4.6s">${[[476, 262], [508, 340], [512, 372], [640, 340], [612, 300], [672, 410], [432, 222]].map(([x, y], i) => `<path d="M${x} ${y} q-3 -10 -7 -14 M${x + 2} ${y} q0 -12 1 -17 M${x + 4} ${y} q3 -8 8 -11" stroke="#2E6A22" stroke-width="${(2.4 + y / 200).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-3 -10 -7 -14 M${x + 2} ${y} q0 -12 1 -17 M${x + 4} ${y} q3 -8 8 -11" stroke="#8ACB54" stroke-width="${(1 + y / 400).toFixed(1)}" fill="none" stroke-linecap="round"/>`).join('')}</g>
    ${[[300, 193, .4], [404, 213, .5], [432, 223, .6], [478, 262, .8], [500, 324, 1], [636, 336, 1], [668, 404, 1.1]].map(([x, y, k]) => papiroMini(x, y, k)).join('')}
    <!-- faluca (longe) -->
    <g id="ni-faluca" class="toque" data-fig="faluca"><g id="ni-faluca-pos" transform="translate(490 238) scale(.42)"><g style="animation:flutua 3.4s ease-in-out infinite alternate">
      <ellipse cx="0" cy="22" rx="74" ry="8" fill="#0E3A5A" opacity=".3"/>
      <path d="M-12 14 L-10 -60" stroke="#4E2E14" stroke-width="5" stroke-linecap="round"/>
      <path d="M-64 10 L36 -128" stroke="#4E2E14" stroke-width="4.6" stroke-linecap="round"/><path d="M-64 10 L36 -128" stroke="url(#niVara)" stroke-width="2.4" stroke-linecap="round"/>
      <g id="ni-vento" opacity="0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-150 -80 q20 -8 44 0 q14 5 26 0"/><path d="M-170 -40 q24 -8 50 0"/><path d="M-140 -2 q18 -6 40 0 q10 4 20 0"/></g>
      <g id="ni-vela"><path d="M-60 6 L34 -124 C48 -84 58 -40 54 10 C20 13 -24 12 -60 6Z" fill="url(#niVela)" stroke="#8A7A5A" stroke-width="2.2" stroke-linejoin="round"/>
      <g stroke="#CDBE9A" stroke-width="1.3" fill="none"><path d="M-36 -22 C-4 -18 26 -14 52 -12"/><path d="M-14 -56 C8 -50 30 -44 50 -40"/><path d="M8 -88 C22 -82 34 -76 44 -72"/><path d="M-12 8 L22 -96"/><path d="M18 10 L38 -60"/></g>
      <path d="M30 -110 C42 -76 48 -40 48 0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/></g>
      <path d="M36 -128 l18 -4 l-5 7 l6 4 l-19 0Z" fill="#E5392C" stroke="#8A1E14" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-72 10 C-50 14 50 14 78 8 C72 22 56 30 34 30 H-40 C-58 30 -68 22 -72 10Z" fill="url(#niCasco)" stroke="#3A4A6A" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M-68 16 C-36 21 40 21 72 14" stroke="#2E7BF6" stroke-width="3.6" fill="none"/><path d="M-62 23 C-30 27 36 27 64 21" stroke="#FFC83D" stroke-width="2.4" fill="none"/>
      <path d="M-74 10 C-50 13 50 13 80 7" stroke="#7A4A22" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g id="ni-carga"></g>
      <g transform="translate(-48 4)"><path d="M-5 0 v-14 C-5 -20 5 -20 5 -14 V0Z" fill="#2E7BF6" stroke="#12235A" stroke-width="1.2"/><circle cx="0" cy="-22" r="5.6" fill="url(#niPele2)" stroke="#4E2A14" stroke-width="1.1"/><path d="M-5.6 -23 C-5 -30 5 -30 5.6 -23 C2 -26 -2 -26 -5.6 -23Z" fill="#2A1A10"/><circle cx="2" cy="-22" r=".9" fill="#12121A"/></g>
      <rect x="-80" y="-130" width="150" height="160" fill="transparent"/>
    </g></g>${'' }<g id="ni-faluca-hint">${brilhoHotspot(516, 196)}</g></g>
    <!-- búfalo-d'água na margem -->
    <g id="ni-bufalo" class="toque" style="display:none"><g transform="translate(600 322) scale(.7) translate(-590 -322)"><g id="ni-bufalo-in">
      <ellipse cx="590" cy="318" rx="62" ry="9" fill="#164E7A" opacity=".35"/>
      <path d="M566 312 C566 292 584 280 606 280 C630 280 650 292 652 312 C636 318 590 320 566 312Z" fill="url(#niBufalo)" stroke="#16141A" stroke-width="1.8"/>
      <path d="M580 288 C592 282 610 282 624 286" stroke="#C8C2D4" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M600 284 C612 284 624 288 632 294" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M640 300 q6 4 8 10" stroke="#3E3A46" stroke-width="1.2" fill="none"/>
      <g id="ni-buf-cab">
        <path d="M546 286 C531 280 518 272 515 258 C514 250 520 246 525 249 C522 258 530 268 548 278Z" fill="url(#niChifre)" stroke="#3A2E24" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M570 286 C585 280 598 272 601 258 C602 250 596 246 591 249 C594 258 586 268 568 278Z" fill="url(#niChifre)" stroke="#3A2E24" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M519 255 l-3 -5 M597 255 l3 -5" stroke="#2A2018" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M545 293 C534 290 527 294 524 299 C532 302 540 300 547 298Z" fill="url(#niBufalo)" stroke="#16141A" stroke-width="1.2"/><path d="M542 295 C536 295 531 297 529 299" stroke="#B88A8A" stroke-width="1.4" fill="none"/>
        <path d="M571 293 C582 290 589 294 592 299 C584 302 576 300 569 298Z" fill="url(#niBufalo)" stroke="#16141A" stroke-width="1.2"/><path d="M574 295 C580 295 585 297 587 299" stroke="#B88A8A" stroke-width="1.4" fill="none"/>
        <path d="M546 280 C552 276 564 276 570 280 C576 288 574 304 570 314 C566 322 550 322 546 314 C542 304 540 288 546 280Z" fill="url(#niBufalo)" stroke="#16141A" stroke-width="1.6"/>
        <path d="M550 282 C554 280 562 280 566 282" stroke="#9A94A6" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="558" cy="314" rx="10.5" ry="7" fill="#8A8094" stroke="#16141A" stroke-width="1.3"/><ellipse cx="554" cy="314" rx="1.6" ry="1.2" fill="#2A2630"/><ellipse cx="562" cy="314" rx="1.6" ry="1.2" fill="#2A2630"/><path d="M553 309.6 q5 -2 10 0" stroke="#C8C0D0" stroke-width="1.2" fill="none"/>
        <ellipse cx="551" cy="297" rx="3" ry="3.2" fill="#FFFFFF" stroke="#16141A" stroke-width=".8"/><circle cx="551.4" cy="297.6" r="2.1" fill="#140E10"/><circle cx="552.2" cy="296.6" r=".8" fill="#fff"/>
        <ellipse cx="565" cy="297" rx="3" ry="3.2" fill="#FFFFFF" stroke="#16141A" stroke-width=".8"/><circle cx="565.4" cy="297.6" r="2.1" fill="#140E10"/><circle cx="566.2" cy="296.6" r=".8" fill="#fff"/>
        <path d="M547 292 q4 -2 7 0 M561 292 q4 -2 7 0" stroke="#2A2630" stroke-width="1" fill="none"/>
      </g>
      <path d="M528 316 Q536 311 550 316 T578 316 T606 316 T634 316 T654 316 C668 318 666 328 648 330 L536 330 C516 328 516 318 528 316Z" fill="#3E9EC4" opacity=".9"/>
      <path d="M522 316 Q536 311 550 316 T578 316 T606 316 T634 316 T660 316" stroke="#E6F8FF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g fill="none" stroke="#E6F8FF" stroke-linecap="round" opacity=".7"><ellipse cx="560" cy="321" rx="30" ry="4" stroke-width="1.2"/><ellipse cx="610" cy="322" rx="40" ry="5" stroke-width="1"/></g>
    </g></g><rect x="540" y="268" width="104" height="58" fill="transparent"/></g>
    <!-- nilômetro -->
    <g id="ni-nilometro" class="toque">
      <ellipse cx="744" cy="424" rx="70" ry="7" fill="#2A1A0A" opacity=".25"/>
      <path d="M676 422 V236 H804 V422Z" fill="url(#niPedra)" stroke="#6E4A2A" stroke-width="1.8"/>
      <path d="${BLOCOS}" stroke="#8A6440" stroke-width="1" fill="none" opacity=".55"/>
      <path d="M676 422 V236" stroke="#F6E2C0" stroke-width="2" opacity=".7"/>
      <path d="M690 416 V252 H790 V416Z" fill="url(#niPoco)" stroke="#5A3A1E" stroke-width="1.6"/>
      <g clip-path="url(#niPocoC)">
        <path d="${BLOCOS2}" stroke="#2A1A0E" stroke-width="1" fill="none" opacity=".45"/>
        ${ESCADA}
        <g id="ni-poco-agua" style="transition:transform 2s ease-in-out"><rect id="ni-poco-cor" x="688" y="${NIVEIS[0]}" width="104" height="140" fill="#3E9EC4" opacity=".9" style="transition:fill 1.6s"/><path d="M688 ${NIVEIS[0]} h104" stroke="#FFFFFF" stroke-width="3"/><path d="M688 ${NIVEIS[0] + 3} h104" stroke="#1E4A6A" stroke-width="1" opacity=".4"/><path d="M696 ${NIVEIS[0] + 8} q6 -2 12 0 M726 ${NIVEIS[0] + 11} q6 -2 12 0 M708 ${NIVEIS[0] + 18} h20" stroke="#BFEAFF" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
        <rect x="688" y="250" width="104" height="30" fill="url(#niSombraT)"/>
        <rect x="688" y="250" width="12" height="170" fill="#140C06" opacity=".22"/>
      </g>
      <rect x="766" y="258" width="16" height="158" fill="url(#niColuna)" stroke="#5A3A1E" stroke-width="1.3"/>
      <path d="M763 252 h22 v7 h-22Z" fill="#E8CCA0" stroke="#5A3A1E" stroke-width="1.2"/>
      <path d="M769 262 V412" stroke="#FFF0D6" stroke-width="1.4" opacity=".8"/><path d="M780 262 V412" stroke="#6E4A2A" stroke-width="1.6" opacity=".5"/>
      ${Array.from({ length:9 }, (_, i) => { const y = 270 + i * 17.4, L = i % 2 ? 7 : 14; return `<path d="M766 ${y.toFixed(1)} h${L}" stroke="#3E2410" stroke-width="1.8"/><path d="M766 ${(y + 1.6).toFixed(1)} h${L}" stroke="#FFF0D6" stroke-width="1" opacity=".8"/>${i % 2 ? '' : `<path d="M776 ${(y - 5).toFixed(1)} l2 3 l-2 3 l-2 -3Z" fill="none" stroke="#3E2410" stroke-width=".9"/>`}`; }).join('')}
      <g>${[[NIVEIS[1], '#E5A23A'], [NIVEIS[2], '#7AC04A'], [NIVEIS[3], '#2E9E5A']].map(([y, c]) => `<path d="M764 ${y} l-7 -4.4 v8.8Z" fill="${c}" stroke="#4E2E14" stroke-width="1"/>`).join('')}</g>
      <path d="M672 236 H808 V246 H672Z" fill="#E8CCA0" stroke="#6E4A2A" stroke-width="1.6"/><path d="M674 238 H806" stroke="#FFF4DE" stroke-width="2" stroke-linecap="round"/><path d="M700 236 V246 M736 236 V246 M772 236 V246" stroke="#8A6440" stroke-width="1"/>
      <path d="M676 422 V400 C676 388 694 388 694 400 V422Z" fill="#2E6A8A" stroke="#5A3A1E" stroke-width="1.6"/><path d="M679 410 h12" stroke="#BFEAFF" stroke-width="1.2"/>
      <g id="ni-nilo-hint" style="display:none">${brilhoHotspot(790, 262)}</g>
    </g>
    <!-- vila de adobe -->
    <g id="ni-vila">
      ${palmeira(36, 250, 70, .95, '#5AA642', '#3E8A30', 1)}${palmeira(150, 236, 62, .85, '#6AB448', '#4A9638', -1)}${palmeira(232, 226, 54, .75, '#5AA642', '#3E8A30', 1)}
      <ellipse cx="300" cy="270" rx="26" ry="4" fill="#1E3A12" opacity=".25"/><path d="M296 270 C296 260 294 252 290 246 M298 262 C302 254 308 250 314 246" stroke="#5A3A1E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M296 270 C296 260 294 252 290 246" stroke="#9A6A3E" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="${copa(300, 232, 32, 21, 12, .25)}" fill="#2E6A3A" stroke="#173A1E" stroke-width="1.6"/><path d="${copa(304, 226, 24, 15, 10, .25)}" fill="#4A8A4A" stroke="#1E4A26" stroke-width="1.1"/><path d="${copa(310, 220, 13, 8, 8, .3)}" fill="#7AB866"/>
      <g fill="#C8A04A">${[[286, 236], [312, 238], [298, 244], [320, 228]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join('')}</g>
      <path d="M0 286 C60 272 160 268 280 272 C300 274 320 278 330 284 V296 H0Z" fill="#B48E5A" opacity=".55"/>
      ${casa(10, 284, 46, 36, '#2E7BF6', '#F2C83A', '')}${toldo(4, 60, 254)}
      ${casa(62, 278, 54, 44, '#1FA8A0', '#F2C83A', `<g transform="translate(104 228)"><path d="M0 6 v-6" stroke="#5A5A6A" stroke-width="1.4"/><ellipse cx="0" cy="-3" rx="7" ry="5" transform="rotate(-24)" fill="#F4F6FA" stroke="#5A6070" stroke-width="1.2"/><circle cx="2" cy="-6" r="1.2" fill="#5A6070"/></g>`)}
      ${casa(124, 282, 42, 32, '#F2C83A', '#E5392C', `<g stroke="#8A6A2A" stroke-width="1.2" stroke-linecap="round"><path d="M130 249 l18 -4 M131 247 l18 -5 M132 250 l17 -3"/></g><path d="M128 250 q12 -8 24 -4 l-2 4Z" fill="#C8A85A" stroke="#7A5A22" stroke-width=".8"/>`)}
      ${casa(172, 276, 58, 40, '#E5392C', '#1FA8A0', `${escadaTeto(212, 276, 40)}${varal(178, 210, 226)}`)}${zir(68, 286)}
      <path d="M232 276 h38 v-14 h-38Z" fill="url(#niAdobe)" stroke="#8A5A32" stroke-width="1.4"/><path d="M234 264 h34" stroke="#F8DCB0" stroke-width="1.2"/>
      <g id="ni-poupa" class="toque" transform="translate(252 262)"><g id="ni-poupa-in">
        <g id="ni-crista" style="transform-origin:8px -12px;transition:transform .3s cubic-bezier(.3,1.6,.5,1);transform:scale(.55)"><path d="M6 -12 l-8 -10 l6 2 l-2 -9 l6 6 l2 -9 l3 8 l5 -7 l-1 9 l5 -3 l-6 12Z" fill="#F0A060" stroke="#7A3E14" stroke-width="1"/><path d="M-1 -21 l2 2 M3 -27 l1 3 M9 -28 l0 3 M14 -24 l-1 3" stroke="#1A1A22" stroke-width="2.2" stroke-linecap="round"/></g>
        <path d="M-12 0 C-12 -8 0 -10 6 -6 C10 -2 8 2 0 2 C-6 2 -10 2 -12 0Z" fill="#E8A070" stroke="#7A3E14" stroke-width="1.2"/>
        <path d="M-12 -2 C-16 -2 -20 0 -22 2 C-18 4 -14 2 -10 2Z" fill="#1A1A22"/>
        <path d="M-8 -6 l-3 6 M-4 -7 l-2 7 M0 -7 l-1 7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M-8 -6 l-3 6 M-4 -7 l-2 7 M0 -7 l-1 7" stroke="#1A1A22" stroke-width="1" stroke-linecap="round" transform="translate(1.6 0)"/>
        <circle cx="8" cy="-10" r="5" fill="#F0A870" stroke="#7A3E14" stroke-width="1.1"/><circle cx="9.6" cy="-11" r="1.4" fill="#12121A"/><circle cx="10" cy="-11.5" r=".5" fill="#fff"/>
        <path d="M12 -9 q8 2 12 8" stroke="#2A1A10" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </g><rect x="-24" y="-32" width="50" height="38" fill="transparent"/></g>
      <g id="ni-arvore" class="toque"><rect x="268" y="206" width="66" height="50" fill="transparent"/></g>
      <g id="ni-palmeira-alvo" class="toque"><rect x="128" y="160" width="50" height="40" fill="transparent"/></g>
    </g>
    <!-- campos -->
    <g id="ni-campos">
      ${CANT.map((c, i) => `<g class="ni-cant" data-i="${i}">
        <path d="${cantPath(c)}" fill="#8A6A3E" opacity=".6" transform="translate(0 3)"/>
        <path class="ni-seco" d="${cantPath(c)}" fill="url(#niSeco)" stroke="#9A7444" stroke-width="1.6"/>
        <g class="ni-seco" clip-path="url(#niCantC${i})">${sulcos(c, '#9A7040', 2.2, .5)}<g transform="translate(1.6 0)">${sulcos(c, '#FAE6B8', 1, .6)}</g>${rachas(c)}${torroes(c, '#D8B47A', '#8A6438', '#FAE8C0', 26)}</g>
        <g class="ni-lama" style="opacity:0;transition:opacity 2s"><path d="${cantPath(c)}" fill="url(#niLama)" stroke="#1E1410" stroke-width="1.6"/>${ondulas(c, '#5E4A3C', 1.3, .85)}<path d="${cantPath(c, 10)}" fill="none" stroke="#8A7A6E" stroke-width="1" opacity=".35"/><g clip-path="url(#niCantC${i})">${torroes(c, '#3A2C22', '#1A1210', '#9A8A7A', 18)}<path d="${cantPath(c)}" fill="url(#niReflexo)" opacity=".6"/></g><g fill="#C8B8A8" opacity=".22">${[[.3, .25], [.62, .5], [.22, .72], [.74, .86], [.5, .14], [.4, .55], [.82, .3]].map(([qx, qy]) => { const yy = Y0 + (Y1 - Y0) * qy, xl = c[0] + (c[2] - c[0]) * qy, xr = c[1] + (c[3] - c[1]) * qy, xx = xl + (xr - xl) * qx; return `<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(5 + qy * 6).toFixed(1)}" ry="${(1.6 + qy).toFixed(1)}"/>`; }).join('')}</g></g>
        <g class="ni-molha" style="opacity:0;transition:opacity 1.4s"><path d="${cantPath(c)}" fill="url(#niMolhado)" stroke="#120C0A" stroke-width="1.6"/><path d="${cantPath(c, 6)}" fill="#5EA8D0" opacity=".28"/>${sulcos(c, '#8ED0F0', 1.6, .55)}<path d="${cantPath(c)}" fill="url(#niReflexo)"/><g fill="none" stroke="#E6F8FF" stroke-width="1.2" opacity=".55">${[[.3, .3], [.7, .55], [.45, .8]].map(([qx, qy]) => { const [x, y] = dentro(c, qx, qy); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(8 + qy * 8).toFixed(1)}" ry="${(2 + qy * 2).toFixed(1)}"/>`; }).join('')}</g></g>
        <g class="ni-brotos" style="opacity:0;transition:opacity 1s">${fileira(c, (x, y, s) => broto(x, y, s))}</g>
        <g class="ni-maduro" style="opacity:0;transition:opacity 2s"><path d="${cantPath(c)}" fill="${i === 0 ? 'url(#niOuro)' : 'url(#niVerdeC)'}" stroke="${i === 0 ? '#8A6A1E' : '#2E6A22'}" stroke-width="1.6" opacity=".9"/>${fileira(c, (x, y, s) => MADURO[i](x, y, s))}</g>
      </g>`).join('')}
      ${CANT.map(c => `<path d="${cantPath(c)}" fill="none" stroke="#9A7444" stroke-width="7" stroke-linejoin="round"/><path d="${cantPath(c)}" fill="none" stroke="#D8B47E" stroke-width="3.6" stroke-linejoin="round"/><path d="M${c[2] + 4} ${Y1 + 1} H${c[3] - 4}" stroke="#F2D8A8" stroke-width="1.4" stroke-linecap="round"/>`).join('')}
      <g stroke="#4E8A30" stroke-width="1.3" fill="none" stroke-linecap="round">${CANT.map(c => Array.from({ length:7 }, (_, k) => { const x = c[0] + 8 + k * (c[1] - c[0] - 16) / 6; return `<path d="M${x.toFixed(0)} ${Y0 - 1} q-1 -5 -4 -7 M${(x + 2).toFixed(0)} ${Y0 - 1} q1 -6 3 -8"/>`; }).join('')).join('')}</g>
      <g>${[[140, 430], [282, 440], [470, 470], [12, 400]].map(([x, y]) => `<path d="M${x} ${y} q-2 -8 -6 -12 M${x + 2} ${y} q0 -10 2 -14 M${x + 4} ${y} q3 -6 7 -9" stroke="#5E9E3A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <path d="M0 492 C120 488 300 490 470 494 L470 500 H0Z" fill="#7AA84A"/><g stroke="#4E8A30" stroke-width="1.4" fill="none" stroke-linecap="round">${Array.from({ length:26 }, (_, k) => { const x = 6 + k * 18 + R(-4, 4); return `<path d="M${x.toFixed(0)} 500 q-1 -6 -4 -9 M${(x + 3).toFixed(0)} 500 q1 -7 3 -10"/>`; }).join('')}</g>
      <!-- canal -->
      <path d="M418 352 C340 356 250 356 160 358 C110 358 60 360 0 362" stroke="#8A6A3E" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M418 352 C340 356 250 356 160 358 C110 358 60 360 0 362" stroke="#5A3E26" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="ni-canal-agua" d="M412 352 C340 356 250 356 160 358 C110 358 60 360 0 362" stroke="#3E9EE0" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path class="ni-canal-brilho" d="M412 351 C340 355 250 355 160 357 C110 357 60 359 0 361" stroke="#BFEAFF" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="6 10"/>
      ${[[384, 362], [228, 364], [90, 366]].map(([x, y], i) => `<path class="ni-bica" data-i="${i}" d="M${x} ${y - 4} l-2 12" stroke="#3E9EE0" stroke-width="4" stroke-linecap="round" style="opacity:0;transition:opacity .6s"/>`).join('')}
    </g>
    <!-- cheia: a água cobre a planície -->
    <g id="ni-cheia" style="opacity:0;transition:opacity 1.8s" pointer-events="none">
      <path d="${CHEIA}" fill="url(#niCheia)" opacity=".8"/><path d="${CHEIA}" fill="#7FB8D0" opacity=".12"/>
      <path d="M0 302 C120 296 250 292 350 286 C410 282 452 262 468 240" stroke="#E8C8A0" stroke-width="2.4" fill="none" opacity=".8"/>
      <g stroke="#F4DCB8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".75" class="brilha-agua">${Array.from({ length:22 }, () => { const x = R(10, 640), y = R(310, 490); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -3 16 0 t16 0"/>`; }).join('')}</g>
    </g>
    <!-- garças-vaqueiras -->
    <g id="ni-garcas" class="toque">${[[214, 326, .9], [244, 318, .8], [272, 330, 1]].map(([x, y, s], i) => garca(x, y, s, i)).join('')}<rect x="190" y="290" width="100" height="48" fill="transparent"/></g>
    <g id="ni-menina" class="toque" transform="translate(186 326) scale(1.55)">
        <ellipse cx="0" cy="0.6" rx="11" ry="2.4" fill="#1E3A12" opacity=".3"/>
        <path d="M-3.4 -1 v-11 M3.4 -1 v-11" stroke="#1E3A6E" stroke-width="4.6" stroke-linecap="round"/><path d="M-3.4 -1 v-11 M3.4 -1 v-11" stroke="#3E68B0" stroke-width="3" stroke-linecap="round"/>
        <path d="M-6.6 0 h5.4 v-2.4 h-5.4Z M1.2 0 h5.4 v-2.4 h-5.4Z" fill="#FFFFFF" stroke="#4E5A6E" stroke-width=".7"/><path d="M-6.6 0 h5.4 M1.2 0 h5.4" stroke="#E5392C" stroke-width="1"/>
        <path d="M-9 -22 h-2.6 v10 h2.6" fill="#8E4AC8" stroke="#3E1E6A" stroke-width=".9"/>
        <path d="M-7.6 -11 C-8.6 -18 -8 -23 -5 -25 H5 C8 -23 8.6 -18 7.6 -11Z" fill="url(#niBlusa)" stroke="#8A2A10" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M-5.6 -24 C-5 -20 -5 -16 -6 -12" stroke="#5E2E9E" stroke-width="1.6" fill="none"/>
        <path d="M-1.6 -18 c1.4 -2 4 -2 5 0 c-1 2 -3.6 2 -5 0Z M-1.6 -18 l-2 -1.4 v2.8Z" fill="#7FD0F0" stroke="#1E5A7A" stroke-width=".6"/>
        <path d="M-6.6 -23 C-9 -19 -9.6 -15 -9 -12" stroke="url(#niBlusa)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-9" cy="-11.4" r="1.7" fill="url(#niPele2)" stroke="#4E2A14" stroke-width=".6"/>
        <g id="ni-menina-braco" style="transform-origin:6px -23px"><path d="M6 -23 C9 -26 11 -29 12.6 -33" stroke="#E0502E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10.4 -29.4 L12.6 -33" stroke="#8A5530" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="13.2" cy="-34.4" rx="1.9" ry="2.2" fill="url(#niPele2)" stroke="#4E2A14" stroke-width=".6"/><path d="M12 -36 v-1.6 M13.4 -36.4 v-1.6 M14.6 -35.6 l.8 -1.4" stroke="#7A4626" stroke-width=".8" stroke-linecap="round"/></g>
        <path d="M-1.6 -25.6 v-2 h3.2 v2Z" fill="#7A4626"/>
        <circle cx="-8" cy="-37" r="3.6" fill="#1E120C"/><circle cx="8" cy="-37" r="3.6" fill="#1E120C"/><circle cx="-6" cy="-35.4" r="1.1" fill="#FFC83D"/><circle cx="6" cy="-35.4" r="1.1" fill="#FFC83D"/>
        <ellipse cx="0" cy="-32.4" rx="6.8" ry="7" fill="url(#niPele2)" stroke="#4E2A14" stroke-width="1"/>
        <path d="M-6.9 -33 C-7.6 -41 7.6 -41 6.9 -33 C5 -36.6 1 -37.4 -1 -36 C-3 -37 -5.6 -36 -6.9 -33Z" fill="#1E120C"/>
        <ellipse cx="-2.4" cy="-31.8" rx="1.2" ry="1.5" fill="#1A0E08"/><ellipse cx="2.6" cy="-31.8" rx="1.2" ry="1.5" fill="#1A0E08"/><circle cx="-2" cy="-32.4" r=".45" fill="#fff"/><circle cx="3" cy="-32.4" r=".45" fill="#fff"/>
        <path d="M-3.4 -34.4 q1 -.8 2 0 M1.6 -34.4 q1 -.8 2 0" stroke="#1E120C" stroke-width=".6" fill="none"/>
        <path d="M-2 -28.6 q2 1.8 4 0" stroke="#6E1E0C" stroke-width=".8" fill="#FFFFFF" stroke-linecap="round"/>
        <ellipse cx="-4.2" cy="-29.4" rx="1.4" ry=".8" fill="#E06A5A" opacity=".4"/><ellipse cx="4.4" cy="-29.4" rx="1.4" ry=".8" fill="#E06A5A" opacity=".4"/>
        <rect x="-14" y="-44" width="30" height="46" fill="transparent"/>
      </g>
    <!-- papiro na beira do rio -->
    <g id="ni-papiro" class="toque" data-fig="papiro"><svg x="458" y="398" width="82" height="106" viewBox="0 0 100 130"><use href="#f-papiro"/></svg>${brilhoHotspot(526, 410)}</g>
    <!-- shaduf -->
    <g id="ni-shaduf">
      <ellipse cx="${BACIA.x}" cy="${BACIA.y + 2}" rx="20" ry="7" fill="#8A6A3E" stroke="#5A3E1E" stroke-width="1.4"/><ellipse id="ni-bacia-agua" cx="${BACIA.x}" cy="${BACIA.y + 1}" rx="15" ry="4.4" fill="#5A3E26"/>
      <g id="ni-postes" class="toque" data-fig="shaduf">
        <ellipse cx="438" cy="353" rx="34" ry="5" fill="#2A1A0A" opacity=".22"/>
        <path d="M414 352 V306 C414 301 428 301 428 306 V352Z" fill="url(#niAdobe)" stroke="#6E3E1E" stroke-width="1.6"/>
        <path d="M446 352 V306 C446 301 460 301 460 306 V352Z" fill="url(#niAdobe)" stroke="#6E3E1E" stroke-width="1.6"/>
        <g stroke="#9A6A3E" stroke-width=".9" opacity=".6">${[312, 322, 332, 342].map(y => `<path d="M415 ${y} h12 M447 ${y} h12"/>`).join('')}</g>
        <path d="M417 308 V348 M449 308 V348" stroke="#F8DCB0" stroke-width="1.4" opacity=".7"/>
        <path d="M408 300 H466" stroke="#5A3418" stroke-width="6" stroke-linecap="round"/><path d="M408 299 H466" stroke="url(#niVara)" stroke-width="3" stroke-linecap="round"/>
        <g id="ni-shaduf-hint">${brilhoHotspot(470, 316)}</g>
      </g>
      <g id="ni-vara" class="toque" style="cursor:grab" transform="rotate(${TH_UP} ${PIV.x} ${PIV.y})">
        <path d="M${PIV.x - L2} ${PIV.y} H${PIV.x + L1}" stroke="#5A3418" stroke-width="7" stroke-linecap="round"/>
        <path d="M${PIV.x - L2} ${PIV.y - .5} H${PIV.x + L1}" stroke="url(#niVara)" stroke-width="4" stroke-linecap="round"/>
        <path d="M${PIV.x - 30} ${PIV.y - 1.4} H${PIV.x + L1 - 10}" stroke="#F4D4A0" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>
        <path d="M${PIV.x - L2 - 13} ${PIV.y} C${PIV.x - L2 - 14} ${PIV.y - 12} ${PIV.x - L2 + 2} ${PIV.y - 16} ${PIV.x - L2 + 10} ${PIV.y - 6} C${PIV.x - L2 + 16} ${PIV.y + 4} ${PIV.x - L2 + 6} ${PIV.y + 16} ${PIV.x - L2 - 4} ${PIV.y + 13} C${PIV.x - L2 - 10} ${PIV.y + 11} ${PIV.x - L2 - 13} ${PIV.y + 6} ${PIV.x - L2 - 13} ${PIV.y}Z" fill="url(#niPeso)" stroke="#2A2018" stroke-width="1.6"/>
        <path d="M${PIV.x - L2 - 8} ${PIV.y - 5} q4 -5 10 -5" stroke="#C8B8A8" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <circle cx="${PIV.x}" cy="${PIV.y}" r="3.4" fill="#7A4A22" stroke="#3E2210" stroke-width="1"/>
        <rect x="${PIV.x + 10}" y="${PIV.y - 14}" width="${L1 - 4}" height="28" fill="transparent"/>
      </g>
      <g id="ni-agricultor" class="toque" style="opacity:0;transition:opacity 1s" transform="translate(${FX} ${FY}) scale(${FK})">
        <ellipse cx="0" cy="0" rx="20" ry="4" fill="#164E7A" opacity=".35"/>
        <path d="M-5 -2 v-10 M5 -2 v-10" stroke="#8A5530" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M-12 -44 C-15 -34 -17 -22 -16 -10 C-6 -7 6 -7 16 -10 C17 -22 15 -34 12 -44 C6 -48 -6 -48 -12 -44Z" fill="url(#niGalab)" stroke="#2E4A6E" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M-6 -40 C-8 -30 -9 -20 -9 -10 M4 -38 C5 -28 6 -20 7 -10 M-1 -30 C-1 -22 0 -16 0 -9" stroke="#4E78A8" stroke-width="1.1" fill="none" opacity=".7"/>
        <path d="M-10 -40 C-12 -30 -13 -20 -12 -12" stroke="#DCEEFA" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M-4 -46 L0 -38 L4 -46" fill="#7AA8D4" stroke="#2E4A6E" stroke-width="1"/>
        <path d="M-11 -42 C-17 -34 -18 -26 -15 -20" stroke="#2E4A6E" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="M-11 -42 C-17 -34 -18 -26 -15 -20" stroke="#8CB8E0" stroke-width="5.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="-14.6" cy="-18.4" rx="2.8" ry="3.2" fill="url(#niPele1)" stroke="#4E2A14" stroke-width=".9"/>
        <path d="M-18 -4 Q-9 -8 0 -5 T18 -4 L20 2 L-20 2Z" fill="#3E9EC4" opacity=".92"/><path d="M-18 -4 Q-9 -8 0 -5 T18 -4" stroke="#E6F8FF" stroke-width="1.4" fill="none"/>
        <path id="ni-agr-braco" d="M9 -42 L18 -60" stroke="#2E4A6E" stroke-width="7.4" fill="none" stroke-linecap="round"/><path id="ni-agr-braco2" d="M9 -42 L18 -60" stroke="#8CB8E0" stroke-width="5.2" fill="none" stroke-linecap="round"/>
        <ellipse id="ni-agr-mao" cx="18" cy="-60" rx="3" ry="3.3" fill="url(#niPele1)" stroke="#4E2A14" stroke-width=".9"/>
        <path d="M-3.6 -48 v-4 h7.2 v4Z" fill="#8A5530"/>
        <ellipse cx="-8.4" cy="-56" rx="1.8" ry="2.6" fill="#B07448" stroke="#4E2A14" stroke-width=".8"/><ellipse cx="8.4" cy="-56" rx="1.8" ry="2.6" fill="#B07448" stroke="#4E2A14" stroke-width=".8"/>
        <ellipse cx="0" cy="-56" rx="8.4" ry="9.2" fill="url(#niPele1)" stroke="#4E2A14" stroke-width="1.2"/>
        <path d="M-9 -60 C-10 -70 10 -70 9 -60 C6 -63 -6 -63 -9 -60Z" fill="#F6F2E8" stroke="#8A8270" stroke-width="1.1"/>
        <path d="M-8.6 -62 C-4 -66 4 -66 8.6 -62 M-7 -66 C-2 -68 3 -68 7 -66" stroke="#C8C0A8" stroke-width="1" fill="none"/>
        <path d="M8 -63 C12 -62 13 -58 12 -54" stroke="#F6F2E8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M8 -63 C12 -62 13 -58 12 -54" stroke="#8A8270" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".3"/>
        <path d="M-5.6 -58.4 q2 -1.4 3.6 0 M2 -58.4 q2 -1.4 3.6 0" stroke="#2A1A10" stroke-width="1" fill="none" stroke-linecap="round"/>
        <ellipse cx="-3.6" cy="-55.6" rx="1.5" ry="1.7" fill="#fff"/><ellipse cx="3.8" cy="-55.6" rx="1.5" ry="1.7" fill="#fff"/><circle cx="-3.4" cy="-55.4" r="1.1" fill="#1A1008"/><circle cx="4" cy="-55.4" r="1.1" fill="#1A1008"/><circle cx="-3" cy="-55.9" r=".4" fill="#fff"/><circle cx="4.4" cy="-55.9" r=".4" fill="#fff"/>
        <path d="M0 -55 q1.4 2.4 0 3" stroke="#6E3A1A" stroke-width=".9" fill="none"/>
        <path d="M-4.4 -51 C-2 -52.4 2 -52.4 4.4 -51 C2 -50 -2 -50 -4.4 -51Z" fill="#2A1A10"/>
        <path d="M-3 -49 q3 2.2 6 0" stroke="#6E2A10" stroke-width="1" fill="none" stroke-linecap="round"/>
        <ellipse cx="-5.4" cy="-51.6" rx="1.8" ry="1" fill="#E07A5A" opacity=".35"/><ellipse cx="5.4" cy="-51.6" rx="1.8" ry="1" fill="#E07A5A" opacity=".35"/>
        <rect x="-22" y="-74" width="48" height="78" fill="transparent"/>
      </g>
      <g id="ni-balde" class="toque" style="cursor:grab"><g id="ni-balde-in">
        <path d="M0 0 V${CORDA}" stroke="#8A6A3E" stroke-width="1.6"/>
        <path d="M-10 ${CORDA} H10 L7 ${CORDA + 15} C4 ${CORDA + 18} -4 ${CORDA + 18} -7 ${CORDA + 15}Z" fill="url(#niBalde)" stroke="#5A2A10" stroke-width="1.5" stroke-linejoin="round"/>
        <path id="ni-balde-agua" d="M-10 ${CORDA} C-6 ${CORDA - 3} 6 ${CORDA - 3} 10 ${CORDA}" fill="#3E9AD0" stroke="#5A2A10" stroke-width="1.1" style="opacity:0"/>
        <path d="M-6 ${CORDA + 4} V${CORDA + 12}" stroke="#F0A878" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
        <rect x="-18" y="${CORDA - 10}" width="36" height="34" fill="transparent"/>
      </g></g>
    </g>
    <g id="ni-abelharucos" pointer-events="none">${POUSO_A.map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="ni-ab"><g style="animation:flutua ${(2 + i * .4).toFixed(1)}s ease-in-out infinite alternate">${abelharuco()}</g></g></g>`).join('')}</g>
    <!-- itens da colheita -->
    <g id="ni-itens">${ITENS.map((it, i) => `<g class="ni-item toque" data-i="${i}" transform="translate(${it.x} ${it.y})" style="display:none;cursor:grab"><g class="cresce"><ellipse cx="0" cy="24" rx="20" ry="4" fill="#1E1410" opacity=".3"/>${feixe[it.id]}</g><g class="ni-item-hint">${brilhoHotspot(18, -20)}</g><circle r="32" fill="transparent"/></g>`).join('')}</g>
    <!-- tilápia -->
    <g id="ni-tilapias" pointer-events="none">${[0, 1, 2].map(i => `<g class="ni-til" style="opacity:0"><g class="ni-til-pos"><path d="M-13 0 C-7 -9 8 -9 13 0 C8 8 -7 8 -13 0Z" fill="url(#niTil)" stroke="#2E4A44" stroke-width="1.3"/><path d="M-13 0 L-21 -7 L-18 0 L-21 7Z" fill="#7A9A90" stroke="#2E4A44" stroke-width="1.2" stroke-linejoin="round"/><path d="M-4 -7 C-1 -11 5 -10 8 -6" fill="#8AA8A0" stroke="#2E4A44" stroke-width="1"/><path d="M-6 -3 v6 M-1 -4 v8 M4 -4 v7" stroke="#4E6E66" stroke-width="1" opacity=".6"/><path d="M-6 -4 C-2 -6 4 -6 8 -3" stroke="#E0F0EA" stroke-width="1.4" fill="none"/><circle cx="7.4" cy="-1.4" r="2" fill="#fff" stroke="#2E4A44" stroke-width=".6"/><circle cx="7.8" cy="-1.4" r="1.2" fill="#12121A"/><circle cx="8.2" cy="-1.9" r=".4" fill="#fff"/></g></g>`).join('')}</g>
    <rect id="ni-agua-toque" x="552" y="336" width="96" height="48" fill="transparent" class="toque"/>
    <!-- Nuri, o martim-pescador -->
    <g id="ni-nuri" class="toque" data-fig="martim">
      <path d="M740 500 V452" stroke="#4E3018" stroke-width="10" stroke-linecap="round"/><path d="M740 500 V452" stroke="#A8784A" stroke-width="6" stroke-linecap="round"/><path d="M737 456 V496" stroke="#D8A878" stroke-width="1.4"/>
      <ellipse cx="740" cy="452" rx="5" ry="2" fill="#7A5434" stroke="#4E3018" stroke-width="1"/>
      <g id="ni-nuri-pos"><g id="ni-nuri-in"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><svg x="700" y="388" width="86" height="72" viewBox="0 0 120 100"><use href="#f-martim"/></svg></g></g></g>
      ${brilhoHotspot(782, 398)}
      <rect x="700" y="384" width="90" height="116" fill="transparent"/>
    </g>
    <!-- nuvens de chuva sobre as montanhas -->
    ${NUV.map((n, i) => `<g class="ni-nuvem toque" data-i="${i}"><g transform="translate(${n.x} ${n.y}) scale(${n.s})"><g class="ni-nuv-in" style="animation:flutua ${(3 + i * .5).toFixed(1)}s ease-in-out infinite alternate">
      <use href="#nuvem" x="-56" y="-30" width="112" height="56" style="color:#8E9AB0"/><use href="#nuvem" x="-52" y="-32" width="104" height="50" class="ni-nuv-cor" style="color:#EEF2F8;transition:color 1s"/>
      <path d="M-34 -14 q10 -8 22 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
      <g class="ni-nuv-hint">${brilhoHotspot(40, -26)}</g></g>
      <rect x="-60" y="-36" width="120" height="66" fill="transparent"/></g></g>`).join('')}
    <!-- primeiro plano -->
    <g class="balanca" style="animation-duration:5s">${[0, 10, 22].map((x, i) => `<path d="M${x} 500 q${4 + i * 2} -30 ${-6 + i * 6} -${46 + i * 10}" stroke="#2E6A22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x} 500 q${4 + i * 2} -30 ${-6 + i * 6} -${46 + i * 10}" stroke="#7FC04A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g>${[[786, 500], [796, 500], [776, 500]].map(([x, y], i) => `<path d="M${x} ${y} q${-6 - i * 2} -24 ${-2 - i * 8} -${36 + i * 8}" stroke="#2E6A22" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q${-6 - i * 2} -24 ${-2 - i * 8} -${36 + i * 8}" stroke="#8ACB54" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <!-- primeiro plano: moldura de plantas -->
    <g class="balanca" style="animation-duration:6.4s">${[[-8, 18, 150, 16], [6, 34, 124, 14], [18, 52, 96, 12], [-4, -2, 104, 12]].map(([x, dx, h, w]) => `<path d="M${x} 502 C${x + dx * .3} ${502 - h * .5} ${x + dx * .7} ${502 - h * .85} ${x + dx} ${502 - h} C${x + dx * .6 + w * .4} ${502 - h * .75} ${x + w} ${502 - h * .4} ${x + w} 502Z" fill="url(#niFolha)" stroke="#1E4A16" stroke-width="1.6" stroke-linejoin="round"/><path d="M${x + w * .5} 500 C${x + dx * .4 + w * .3} ${502 - h * .5} ${x + dx * .8} ${502 - h * .85} ${x + dx} ${502 - h + 4}" stroke="#B8E67A" stroke-width="1.2" fill="none" opacity=".8"/>`).join('')}</g>
    ${papiroMini(26, 504, 1.9)}
    <g class="balanca" style="animation-duration:5.2s">${[[804, -10, 74, 12], [798, -22, 58, 10]].map(([x, dx, h, w]) => `<path d="M${x} 502 C${x + dx * .3} ${502 - h * .5} ${x + dx * .7} ${502 - h * .85} ${x + dx} ${502 - h} C${x + dx * .6 - w * .4} ${502 - h * .75} ${x - w} ${502 - h * .4} ${x - w} 502Z" fill="url(#niFolha)" stroke="#1E4A16" stroke-width="1.6" stroke-linejoin="round"/>`).join('')}</g>
    <g id="ni-mao" pointer-events="none"><g class="mao-dica"><circle cx="168" cy="96" r="14" fill="#fff" opacity=".35"/><path d="M160 104 C160 92 164 86 168 86 C172 86 172 92 172 96 L178 96 C184 96 186 102 184 110 L180 120 H164 Z" fill="#FFF4E6" stroke="#5A3A2A" stroke-width="2" stroke-linejoin="round"/></g></g>
    <rect width="800" height="500" fill="url(#niVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#niGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#ni-mao');
  const centro = el(s, '#ni-centro'), centroL = centro.getTotalLength();
  /* canal: começa seco */
  const canal = el(s, '.ni-canal-agua'), canalL = canal.getTotalLength(), canalB = el(s, '.ni-canal-brilho');
  canal.style.strokeDasharray = `${canalL} ${canalL}`; canal.style.strokeDashoffset = canalL; canal.style.transition = 'stroke-dashoffset 1.6s ease-out';
  canalB.style.opacity = 0; canalB.animate([{ strokeDashoffset:0 }, { strokeDashoffset:32 }], { duration:900, iterations:Infinity });
  const CANAL_ATE = [canalL * .12, canalL * .5, canalL * .86];
  const cants = [...s.querySelectorAll('.ni-cant')];
  const mostra = (g, sel, v) => g.querySelectorAll(sel).forEach(e => e.style.opacity = v);
  /* ---------- pulsos de água descendo o rio (canvas) ---------- */
  const pulsos = [];
  c.desenho(ctx => {
    const agora = performance.now();
    for (let i = pulsos.length - 1; i >= 0; i--) {
      const p = pulsos[i], k = Math.min(1, (agora - p.t0) / 3200);
      for (let j = 0; j < 9; j++) {
        const kk = Math.max(0, k - j * .018), pt = centro.getPointAtLength(kk * centroL), w = 3 + (pt.y - 180) * .09;
        ctx.globalAlpha = (.75 - j * .07) * (k < .9 ? 1 : (1 - k) * 10);
        ctx.fillStyle = j % 2 ? '#B07A4E' : '#8E5A34'; ctx.strokeStyle = '#E8C8A0'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(pt.x, pt.y, w, w * .42, .5, 0, 7); ctx.fill(); if (j === 0) ctx.stroke();
      }
      if (k >= 1) { pulsos.splice(i, 1); p.chega && p.chega(); }
    }
    ctx.globalAlpha = 1;
  });
  /* ---------- 1. cheia: tocar ou varrer as nuvens ---------- */
  const nuvens = [...s.querySelectorAll('.ni-nuvem')], usadas = [false, false, false];
  function chuvaNuvem(i){
    if (fase !== 'cheia' || usadas[i]) { if (fase !== 'cheia') { toca('clique'); api.diz('Lá longe, nas montanhas da Etiópia, chove muito no verão.'); } return; }
    usadas[i] = true; mao.style.display = 'none'; chegando++;
    const n = NUV[i], g = nuvens[i];
    el(g, '.ni-nuv-cor').style.color = '#9AA6BC'; el(g, '.ni-nuv-hint').style.display = 'none';
    g.animate([{ transform:'translate(0,0)' }, { transform:'translate(0,6px)' }, { transform:'translate(0,0)' }], { duration:500 });
    toca('chuva'); c.chover(n.x - 44, n.x + 40, n.y + 18, 170, 46, '#4A86E0');
    const cas = el(s, '#ni-cascata'); cas.animate([{ strokeWidth:2.4, opacity:.75 }, { strokeWidth:6, opacity:1 }, { strokeWidth:2.4, opacity:.75 }], { duration:3400 });
    if (chegando === 1) api.diz('Chuva nas montanhas, bem longe daqui! A água desce pelo rio até o Egito.');
    depois(1400, () => pulsos.push({ t0:performance.now(), chega:() => sobe() }));
  }
  function sobe(){
    nivel++; toca('splash');
    el(s, '#ni-poco-agua').style.transform = `translateY(${NIVEIS[nivel] - NIVEIS[0]}px)`;
    el(s, '#ni-poco-cor').style.fill = '#B0784A';
    el(s, '#ni-rio-cheia').style.opacity = (.3 + nivel * .22).toFixed(2);
    el(s, '#ni-cheia').style.opacity = [0, .35, .66, 1][nivel];
    for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:700 + k * 22, y:NIVEIS[nivel], t:k * 2, cor:'#E8C8A0' });
    c.brilhos(718, NIVEIS[nivel] - 8, 5, '#FFE27A');
    api.hud(`<span class="chip">Cheia: ${nivel}/3</span>`);
    if (nivel === 2) api.diz('O rio está subindo! A escada com marcas é o nilômetro: ela mede a cheia.');
    if (nivel === 3) { toca('vitoria'); api.diz('Cheia boa! A água cobre os campos e traz lama do alto das montanhas.'); depois(5200, baixa); }
  }
  nuvens.forEach((g, i) => g.addEventListener('click', e => { e.stopPropagation(); chuvaNuvem(i); }));
  let varrendo = false;
  s.addEventListener('pointerdown', () => varrendo = true); s.addEventListener('pointerup', () => varrendo = false); s.addEventListener('pointerleave', () => varrendo = false);
  s.addEventListener('pointermove', e => {
    if (!varrendo || fase !== 'cheia') return; const p = c.ponto(e);
    NUV.forEach((n, i) => { if (!usadas[i] && Math.abs(p.x - n.x) < 54 * n.s && Math.abs(p.y - n.y) < 30 * n.s) chuvaNuvem(i); });
  });
  function baixa(){
    fase = 'baixa'; api.hud('<span class="chip">Lama preta</span>');
    el(s, '#ni-cheia').style.transition = 'opacity 4s'; el(s, '#ni-cheia').style.opacity = 0;
    el(s, '#ni-rio-cheia').style.transition = 'opacity 4s'; el(s, '#ni-rio-cheia').style.opacity = 0;
    el(s, '#ni-poco-agua').style.transform = ''; el(s, '#ni-poco-cor').style.fill = '#3E9EC4';
    cants.forEach(g => { mostra(g, '.ni-lama', 1); });
    depois(2200, () => { cants.forEach(g => mostra(g, '.ni-seco', 0)); toca('ok'); api.diz('A água baixou e deixou uma lama preta e fértil. Os egípcios chamavam sua terra de Kemet, a terra preta!'); });
    depois(8200, comecaShaduf);
  }
  /* ---------- 2. shaduf: abaixar e levantar a vara ---------- */
  let th = TH_UP, yaw = 1, inc = 0, cheio = false, arr = null;
  const vara = el(s, '#ni-vara'), balde = el(s, '#ni-balde'), baldeIn = el(s, '#ni-balde-in'), braco = el(s, '#ni-agr-braco'), braco2 = el(s, '#ni-agr-braco2'), maoA = el(s, '#ni-agr-mao');
  function poeVara(){
    const r = th * Math.PI / 180;
    vara.setAttribute('transform', `translate(${PIV.x} ${PIV.y}) scale(${yaw.toFixed(3)} 1) rotate(${th.toFixed(2)}) translate(${-PIV.x} ${-PIV.y})`);
    const tx = PIV.x + yaw * Math.cos(r) * L1, ty = PIV.y + Math.sin(r) * L1;
    balde.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
    baldeIn.setAttribute('transform', inc ? `rotate(${inc.toFixed(1)} 0 ${CORDA})` : '');
    let hx, hy; if (yaw > .9) { hx = tx - 4; hy = ty + 24; } else { hx = FX + 18 * FK; hy = FY - 28 * FK; }
    let lx = (hx - FX) / FK - 9, ly = (hy - FY) / FK + 42; const LL = Math.hypot(lx, ly), MX = 30; if (LL > MX) { lx *= MX / LL; ly *= MX / LL; }
    const dB = `M9 -42 L${(9 + lx).toFixed(1)} ${(-42 + ly).toFixed(1)}`; braco.setAttribute('d', dB); braco2.setAttribute('d', dB); maoA.setAttribute('cx', (9 + lx).toFixed(1)); maoA.setAttribute('cy', (-42 + ly).toFixed(1));
  }
  poeVara();
  function comecaShaduf(){
    fase = 'shaduf'; el(s, '#ni-agricultor').style.opacity = 1;
    api.hud('<span class="chip">Campos regados: 0/3</span>');
    api.diz('Agora os campos precisam de água. Arraste a vara do shaduf para baixo e depois para cima!');
    mostraMao(546, 300);
  }
  function mostraMao(x, y){ const m = el(mao, '.mao-dica'); m.parentNode.setAttribute('transform', `translate(${x - 168} ${y - 96})`); mao.style.display = ''; }
  const pegaVara = e => {
    if (fase !== 'shaduf' || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { y0:p.y, x0:p.x, th0:th, moveu:false }; s.setPointerCapture(e.pointerId); vara.style.cursor = balde.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  };
  vara.addEventListener('pointerdown', pegaVara); balde.addEventListener('pointerdown', pegaVara);
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 6) arr.moveu = true;
    th = Math.max(TH_UP, Math.min(TH_DN, arr.th0 + (p.y - arr.y0) * .55)); poeVara();
    if (!cheio && th >= TH_DN - 3) enche();
    if (cheio && th <= TH_UP + 3) { arr = null; despeja(); }
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const moveu = arr.moveu; arr = null; vara.style.cursor = balde.style.cursor = 'grab';
    if (!moveu) { cicloAuto(); return; }
    if (cheio) { const t0 = th; ocupado = true; tw(700, (k, e) => { th = t0 + (TH_UP - t0) * e; poeVara(); }, () => { ocupado = false; despeja(); }); }
    else { const t0 = th; tw(500, (k, e) => { th = t0 + (TH_UP - t0) * e; poeVara(); }); api.diz('Puxe a vara até o balde entrar no rio!'); mostraMao(546, 300); }
  });
  function enche(){
    cheio = true; toca('splash'); el(s, '#ni-balde-agua').style.opacity = 1;
    const r = th * Math.PI / 180, bx = PIV.x + Math.cos(r) * L1, by = PIV.y + Math.sin(r) * L1 + CORDA + 6;
    for (let k = 0; k < 5; k++) c.add({ tipo:'respingo', x:bx + sorte(-8, 8), y:by, t:k, cor:'#E6F6FF' });
    if (regas === 0) api.diz('Balde cheio! Agora levante a vara.');
  }
  let pendente = false;
  function cicloAuto(){
    if (fase !== 'shaduf') return; if (ocupado) { pendente = true; return; } ocupado = true; mao.style.display = 'none';
    const t0 = th;
    tw(800, (k, e) => { th = t0 + (TH_DN - t0) * e; poeVara(); }, () => { enche(); depois(300, () => tw(900, (k, e) => { th = TH_DN + (TH_UP - TH_DN) * e; poeVara(); }, () => { ocupado = false; despeja(); })); });
  }
  function despeja(){
    if (!cheio) return; ocupado = true; th = TH_UP;
    tw(900, (k, e) => { yaw = 1 - 1.45 * e; poeVara(); }, () => {
      tw(500, (k, e) => { inc = -50 * e; poeVara(); }, () => {
        toca('splash');
        const r = th * Math.PI / 180, bx = PIV.x + yaw * Math.cos(r) * L1, by = PIV.y + Math.sin(r) * L1 + CORDA;
        for (let k = 0; k < 16; k++) c.add({ tipo:'infiltra', x0:bx - 8 + sorte(-3, 3), y0:by + sorte(0, 4), x1:BACIA.x + sorte(-8, 8), y1:BACIA.y, dur:sorte(16, 34), f:sorte(0, 6) });
        el(s, '#ni-balde-agua').style.opacity = 0; cheio = false;
        el(s, '#ni-bacia-agua').setAttribute('fill', '#3E9EE0');
        depois(700, () => rega());
        tw(500, (k, e) => { inc = -50 * (1 - e); poeVara(); }, () => tw(900, (k, e) => { yaw = -.45 + 1.45 * e; poeVara(); }, () => { ocupado = false; if (regas < 3 && fase === 'shaduf') { if (pendente) { pendente = false; cicloAuto(); } else mostraMao(546, 300); } else pendente = false; }));
      });
    });
  }
  function rega(){
    const i = regas; regas++;
    canalB.style.opacity = 1; canal.style.strokeDashoffset = canalL - CANAL_ATE[i];
    depois(1500, () => {
      s.querySelectorAll('.ni-bica')[i].style.opacity = 1; toca('glub');
      mostra(cants[i], '.ni-molha', 1);
      depois(1500, () => { mostra(cants[i], '.ni-brotos', 1); toca('planta'); c.brilhos([384, 218, 78][i], 410, 6, '#C8F07A'); });
    });
    api.hud(`<span class="chip">Campos regados: ${regas}/3</span>`);
    if (regas === 1) api.diz('O peso de barro na outra ponta ajuda a levantar o balde. Quase sem força!');
    if (regas === 2) api.diz('A água corre pelo canal até a plantação.');
    if (regas === 3) { depois(3200, () => { toca('vitoria'); api.diz('Todos os campos regados! As plantinhas já estão nascendo.'); }); depois(8400, comecaColheita); }
  }
  el(s, '#ni-postes').addEventListener('click', e => {
    if (fase === 'shaduf') { cicloAuto(); return; }
    toca('clique'); api.diz('Isto é um shaduf: uma vara com um balde numa ponta e um peso de barro na outra.');
  });
  /* ---------- 3. colheita: levar até a faluca ---------- */
  const fpos = el(s, '#ni-faluca-pos');
  let fx = 490, fy = 238, fe = .42;
  const poeFaluca = () => fpos.setAttribute('transform', `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${fe.toFixed(3)})`);
  function comecaColheita(){
    fase = 'colheita'; api.hud('<span class="chip">Colheita: 0/3</span>');
    cants.forEach(g => { mostra(g, '.ni-maduro', 1); });
    depois(1200, () => cants.forEach(g => mostra(g, '.ni-brotos', 0)));
    api.diz('O tempo passou e o trigo ficou dourado! A faluca vem buscar a colheita.');
    el(s, '#ni-faluca-hint').style.display = 'none';
    const x0 = fx, y0 = fy, e0 = fe;
    tw(4200, (k, e) => { fx = x0 + (DOCA.x - x0) * e; fy = y0 + (DOCA.y - y0) * e; fe = e0 + (DE - e0) * e; poeFaluca(); }, () => {
      itens.forEach(g => g.style.display = '');
      toca('pop'); api.diz('Arraste o trigo, o linho e as cebolas até a faluca.');
    });
  }
  const itens = [...s.querySelectorAll('.ni-item')], ipos = ITENS.map(it => ({ x:it.x, y:it.y, foi:false }));
  const poeItem = (i, esc) => itens[i].setAttribute('transform', `translate(${ipos[i].x.toFixed(1)} ${ipos[i].y.toFixed(1)})${esc ? ` scale(${esc.toFixed(2)})` : ''}`);
  let arrI = null;
  itens.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'colheita' || ipos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arrI = { i, dx:p.x - ipos[i].x, dy:p.y - ipos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arrI) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arrI.x0, p.y - arrI.y0) > 8) arrI.moveu = true;
    ipos[arrI.i].x = Math.max(20, Math.min(780, p.x - arrI.dx)); ipos[arrI.i].y = Math.max(200, Math.min(480, p.y - arrI.dy)); poeItem(arrI.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arrI) return; const { i, moveu } = arrI; arrI = null; itens[i].style.cursor = 'grab';
    if (!moveu || Math.hypot(ipos[i].x - DOCA.x, ipos[i].y - (DOCA.y - 20)) < 110) embarca(i);
    else { const it = ITENS[i], x0 = ipos[i].x, y0 = ipos[i].y; tw(600, (k, e) => { ipos[i].x = x0 + (it.x - x0) * e; ipos[i].y = y0 + (it.y - y0) * e; poeItem(i); }); toca('glub'); api.diz('Leve até a faluca, no rio!'); }
  });
  const CARGA = [[-30, -2], [0, -4], [26, -2]];
  function embarca(i){
    ipos[i].foi = true; ocupado = true; el(itens[i], '.ni-item-hint').style.display = 'none';
    const x0 = ipos[i].x, y0 = ipos[i].y, x1 = DOCA.x + CARGA[carga][0] * DE, y1 = DOCA.y + (CARGA[carga][1] - 6) * DE;
    tw(800, (k, e) => { ipos[i].x = x0 + (x1 - x0) * e; ipos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50; poeItem(i, 1 - .3 * e); }, () => {
      ocupado = false; itens[i].style.display = 'none';
      el(s, '#ni-carga').insertAdjacentHTML('beforeend', `<g transform="translate(${CARGA[carga][0]} ${CARGA[carga][1] - 10}) scale(.8)">${feixe[ITENS[i].id]}</g>`);
      carga++; toca('pop'); c.brilhos(x1, y1 - 20, 6, '#FFE27A');
      api.hud(`<span class="chip">Colheita: ${carga}/3</span>`);
      const falas = { trigo:'O trigo vira farinha, e a farinha vira pão.', linho:'Do linho se faz um tecido fresquinho.', cebola:'Cebolas para a feira!' };
      if (carga < 3) api.diz(falas[ITENS[i].id]);
      else navega();
    });
  }
  function navega(){
    fase = 'fim'; toca('vitoria');
    api.diz('A faluca vai para a feira. No Nilo, a correnteza desce o rio e o vento sopra rio acima: dá para ir e voltar!');
    depois(2600, () => { const x0 = fx, y0 = fy, e0 = fe; tw(6000, (k, e) => { fx = x0 + (470 - x0) * e; fy = y0 + (226 - y0) * e; fe = e0 + (.3 - e0) * e; poeFaluca(); }); });
    depois(7600, () => { api.diz('O povo do Egito aprendeu a ler o rio: mediu a cheia, guardou a lama boa e levou água aos campos. Hoje o Nilo ainda dá água a quase todo o Egito!'); depois(6200, api.fim); });
  }
  /* ---------- toques extras ---------- */
  el(s, '#ni-faluca').addEventListener('click', () => { if (fase === 'colheita' || fase === 'fim') return; api.diz('Uma faluca! É um barco a vela que navega no Nilo há muito tempo.'); });
  el(s, '#ni-nilometro').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz(nivel >= 3 || fase !== 'cheia' ? 'Pelas marcas do nilômetro, os egípcios sabiam se a colheita ia ser boa.' : 'Este é o nilômetro, uma escada de pedra com marcas para medir o rio.'); });
  /* Nuri paira e mergulha */
  let nuriOcupado = false;
  el(s, '#ni-nuri').addEventListener('click', () => {
    if (nuriOcupado) return; nuriOcupado = true; const np = el(s, '#ni-nuri-pos');
    [2400, 2800, 2400, 3000].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'square', .03, f * 1.1), i * 120));
    const a = np.animate([{ transform:'translate(0,0)' }, { transform:'translate(-90px,-60px)' }, { transform:'translate(-96px,-64px)' }, { transform:'translate(-90px,-60px)' }, { transform:'translate(-100px,10px)' }, { transform:'translate(-100px,10px)' }, { transform:'translate(0,0)' }], { duration:3200, easing:'ease-in-out' });
    depois(1900, () => { toca('splash'); for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:650 + sorte(-10, 10), y:462, t:k, cor:'#E6F6FF' }); });
    a.onfinish = () => { nuriOcupado = false; };
    api.diz(fase === 'cheia' && nivel === 0 ? 'Eu sou o Nuri! Toque nas nuvens das montanhas lá longe.' : 'Eu bato as asas parado no ar e mergulho de bico para pegar peixinhos!');
  });
  /* tilápias saltam em sequência */
  let tilOcupada = false;
  const tils = [...s.querySelectorAll('.ni-til')];
  el(s, '#ni-agua-toque').addEventListener('click', e => {
    e.stopPropagation(); if (tilOcupada) return; tilOcupada = true; toca('glub');
    [[560, 376, 44, 50], [584, 362, 40, 56], [606, 380, 36, 46]].forEach(([x0, y0, dx, h], k) => depois(k * 380, () => {
      const g = tils[k], p = el(g, '.ni-til-pos'); g.style.opacity = 1; toca('splash');
      for (let q = 0; q < 3; q++) c.add({ tipo:'respingo', x:x0, y:y0, t:q * 2, cor:'#E6F6FF' });
      tw(1000, kk => { const x = x0 + kk * dx, y = y0 - Math.sin(kk * Math.PI) * h; p.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-55 + kk * 110).toFixed(0)})`); }, () => {
        g.style.opacity = 0; for (let q = 0; q < 4; q++) c.add({ tipo:'respingo', x:x0 + dx, y:y0, t:q * 2, cor:'#E6F6FF' }); if (k === 2) tilOcupada = false; });
    }));
    api.diz('Tilápias! Esse peixe vive no Nilo há muito, muito tempo.');
  });
  /* vela enche de vento */
  let velaOcupada = false;
  el(s, '#ni-faluca').addEventListener('click', () => {
    if (velaOcupada) return; velaOcupada = true; const v = el(s, '#ni-vela'), ve = el(s, '#ni-vento');
    somOn && tom(300, 0, .6, 'sine', .04, 520);
    tw(1600, k => { const b = Math.sin(k * Math.PI); v.setAttribute('transform', `translate(-60 8) scale(${(1 + b * .16).toFixed(3)} ${(1 - b * .03).toFixed(3)}) translate(60 -8)`); ve.setAttribute('opacity', (b * .9).toFixed(2)); ve.setAttribute('transform', `translate(${(k * 50).toFixed(1)} 0)`); }, () => { velaOcupada = false; });
  });
  /* abelharucos pousam no shaduf */
  let abOcupado = false;
  el(s, '#ni-arvore').addEventListener('click', e => { e.stopPropagation(); if (abOcupado) return; abOcupado = true;
    const abs = [...s.querySelectorAll('.ni-ab')];
    [2200, 2600, 2400].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .09, 'triangle', .04, f * 1.15), i * 160));
    abs.forEach((g, i) => { const dx = POUSO_B[i][0] - POUSO_A[i][0], dy = POUSO_B[i][1] - POUSO_A[i][1];
      g.animate([{ transform:'translate(0,0)' }, { transform:`translate(${dx * .5}px,${dy * .5 - 50}px)` }, { transform:`translate(${dx}px,${dy}px)` }], { duration:1500 + i * 200, easing:'ease-in-out', fill:'forwards' });
      depois(6200 + i * 200, () => g.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:`translate(${dx * .5}px,${dy * .5 - 60}px)` }, { transform:'translate(0,0)' }], { duration:1600, easing:'ease-in-out', fill:'forwards' })); });
    depois(2000, () => [2400, 2800].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'triangle', .04, f * 1.2), i * 200)));
    depois(8200, () => abOcupado = false);
    api.diz('Abelharucos! Esses passarinhos verdes pousam no shaduf e caçam abelhas e libélulas no ar.'); });
  /* o zir, pote de barro que refresca a água */
  el(s, '#ni-zir').addEventListener('click', e => { e.stopPropagation(); toca('glub'); const g = el(s, '#ni-zir-gota');
    g.animate([{ opacity:1, transform:'translateY(0)' }, { opacity:1, transform:'translateY(8px)' }, { opacity:0, transform:'translateY(10px)' }], { duration:900, iterations:2 });
    api.diz('Este pote de barro é o zir. A água passa devagar pelo barro e evapora por fora, e isso deixa a água de dentro fresquinha!'); });
  /* búfalo bufa */
  let bufOcupado = false;
  el(s, '#ni-bufalo').addEventListener('click', e => { e.stopPropagation(); if (bufOcupado) return; bufOcupado = true;
    somOn && tom(110, 0, .5, 'sawtooth', .05, 70); const cab = el(s, '#ni-buf-cab');
    cab.animate([{ transform:'translate(0,0)' }, { transform:'translate(-2px,-6px)' }, { transform:'translate(0,0)' }], { duration:900 }).onfinish = () => bufOcupado = false;
    for (let k = 0; k < 6; k++) c.add({ tipo:'bolha', x:570 + sorte(-5, 5), y:322, vy:sorte(.4, 1), r:sorte(1.5, 3), topo:302, f:sorte(0, 6) });
    api.diz('O búfalo-d\'água adora se refrescar no rio. Ele ajuda no trabalho do campo.'); });
  /* garças-vaqueiras voam */
  let garOcupadas = false;
  el(s, '#ni-garcas').addEventListener('click', e => { e.stopPropagation(); if (garOcupadas) return; garOcupadas = true;
    [1600, 1900, 1500].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'triangle', .04, f * .8), i * 140));
    s.querySelectorAll('.ni-garca-in').forEach((g, i) => g.animate([{ transform:'translate(0,0)' }, { transform:`translate(${-20 + i * 14}px,-46px)` }, { transform:`translate(${-10 + i * 8}px,-30px)` }, { transform:'translate(0,0)' }], { duration:2200 + i * 200, easing:'ease-in-out' }));
    depois(2700, () => garOcupadas = false);
    api.diz('As garças-vaqueiras seguem os bois e os agricultores para comer insetos.'); });
  /* poupa abre a crista */
  el(s, '#ni-poupa').addEventListener('click', e => { e.stopPropagation(); const cr = el(s, '#ni-crista'); cr.style.transform = 'scale(1)';
    [0, 1, 2].forEach(i => setTimeout(() => somOn && tom(520, 0, .12, 'sine', .07, 480), i * 260));
    depois(1600, () => cr.style.transform = 'scale(.55)'); api.diz('A poupa abre a crista como um leque e canta: up, up, up!'); });
  /* menina acena */
  el(s, '#ni-menina').addEventListener('click', e => { e.stopPropagation(); toca('pop');
    el(s, '#ni-menina-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    api.diz('Oi! Meu avô lembra das cheias. Hoje uma grande represa controla o rio, e a água vai pelos canais.'); });
  /* tâmaras caem */
  el(s, '#ni-palmeira-alvo').addEventListener('click', e => { e.stopPropagation(); toca('pop');
    for (let k = 0; k < 4; k++) c.add({ tipo:'semente', x:152 + sorte(-8, 8), y:180 + sorte(-4, 4), vy:sorte(-1, 0), alvoY:232 + sorte(-2, 2) });
    api.diz('Tâmaras! As tamareiras crescem bem no calor, perto da água do rio.'); });
  el(s, '#ni-agricultor').addEventListener('click', e => { e.stopPropagation(); if (fase === 'shaduf') return; toca('pop'); api.diz('O agricultor conhece o rio e sabe a hora certa de plantar e colher.'); });
  el(s, '#ni-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(694, 62, 6, '#FFE27A'); api.diz('No Egito quase nunca chove. O sol é forte e o deserto é seco.'); });
  api.hud('<span class="chip">Cheia: 0/3</span>');
  api.diz('Oi, eu sou o Nuri, um martim-pescador do Rio Nilo! Aqui quase não chove. Toque nas nuvens das montanhas, lá longe!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
