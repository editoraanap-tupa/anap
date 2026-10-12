/* ================= JOGO 15: Rio Nilo, o rio das cheias ================= */
function jogoNilo(palco, api){
  semente = 31;
  let vivo = true, fase = 'cheia', nivel = 0, chegando = 0, regas = 0, carga = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tw = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k, k*k*(3-2*k)); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const lgd = (id, st, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 === undefined ? 1 : y2}">${st.map((c, i) => `<stop offset="${(i / (st.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const PIV = { x:437, y:296 }, L1 = 118, L2 = 58, CORDA = 44, TH_UP = -28, TH_DN = 22, BACIA = { x:398, y:346 };
  const NUV = [{ x:70, y:74, s:.82 }, { x:172, y:50, s:.95 }, { x:270, y:84, s:.78 }];
  const NIVEIS = [450, 420, 392, 366];
  const DOCA = { x:588, y:458 }, DE = .95;
  /* canteiros: [x topo esq, x topo dir, x base esq, x base dir] */
  const CANT = [[306, 462, 286, 478], [166, 294, 144, 274], [26, 154, 4, 132]];
  const Y0 = 366, Y1 = 490;
  const ITENS = [{ id:'trigo', x:384, y:420 }, { id:'linho', x:218, y:420 }, { id:'cebola', x:98, y:418 }];
  const FX = 478, FY = 372, FK = 1.35;
  const dentro = (c, qx, qy) => { const yy = Y0 + (Y1 - Y0) * qy, xl = c[0] + (c[2] - c[0]) * qy, xr = c[1] + (c[3] - c[1]) * qy; return [xl + (xr - xl) * qx, yy]; };
  const rachas = c => { let d = ''; for (let k = 0; k < 8; k++) { let [x, y] = dentro(c, R(.08, .92), R(.08, .92)); d += `M${x.toFixed(1)} ${y.toFixed(1)}`; for (let j = 0; j < 4; j++) { x += R(-13, 13); y += R(-7, 7); d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; if (j === 1) d += ` M${x.toFixed(1)} ${y.toFixed(1)} l${R(-8, 8).toFixed(1)} ${R(3, 7).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)}`; } d += ' '; } return `<path d="${d}" stroke="#F8E6BC" stroke-width="1.1" fill="none" opacity=".6" transform="translate(.8 1)"/><path d="${d}" stroke="#7E5A30" stroke-width="1.2" fill="none" stroke-linejoin="round" opacity=".85"/>`; };
  const torroes = (c, cor, borda, luz, n) => Array.from({ length:n || 24 }, () => { const [x, y] = dentro(c, R(.04, .96), R(.04, .96)), r = 1.4 + (y - Y0) / (Y1 - Y0) * 2.2; return `<ellipse cx="${x.toFixed(1)}" cy="${(y + r * .5).toFixed(1)}" rx="${(r * 1.5).toFixed(1)}" ry="${(r * .6).toFixed(1)}" fill="#000" opacity=".15"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r * 1.4).toFixed(1)}" ry="${r.toFixed(1)}" fill="${cor}" stroke="${borda}" stroke-width=".7"/><path d="M${(x - r).toFixed(1)} ${(y - r * .2).toFixed(1)} q${r.toFixed(1)} ${(-r * .9).toFixed(1)} ${(2 * r).toFixed(1)} 0" stroke="${luz}" stroke-width=".9" fill="none"/>`; }).join('');
  const papiroMini = (x, y, s) => `<g class="balanca" style="animation-duration:${R(4, 6.5).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s"><ellipse cx="${x}" cy="${y}" rx="${(8 * s).toFixed(1)}" ry="${(2 * s).toFixed(1)}" fill="#1E4A1A" opacity=".4"/>${[[-7, -24], [0, -32], [8, -22], [-2, -18]].map(([dx, dy]) => { const ex = x + dx * s, ey = y + dy * s; let r = ''; for (let k = 0; k < 11; k++) { const a = Math.PI * (.95 + 1.1 * k / 10); r += `M${ex.toFixed(1)} ${ey.toFixed(1)} q${(Math.cos(a) * 4 * s).toFixed(1)} ${(Math.sin(a) * 4 * s - 1.4 * s).toFixed(1)} ${(Math.cos(a) * 7 * s).toFixed(1)} ${(Math.sin(a) * 5 * s + 1.6 * s).toFixed(1)} `; } const st = `M${x} ${y} Q${(x + dx * s * .3).toFixed(1)} ${(y + dy * s * .5).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`; return `<path d="${st}" stroke="#2E6A22" stroke-width="${(2.4 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${st}" stroke="#8ACB54" stroke-width="${(1.1 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${r}" stroke="#3E7A22" stroke-width="${(1.5 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${r}" stroke="#C0EA84" stroke-width="${(.7 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`;
  const abelharuco = () => `<path d="M-6 1 L-22 5" stroke="#1E5A2A" stroke-width="2.4" stroke-linecap="round"/><path d="M-6 1 L-22 5" stroke="#5AC05A" stroke-width="1" stroke-linecap="round"/><path d="M-1 4 v3 M3 4 v3" stroke="#3A2A1A" stroke-width="1" stroke-linecap="round"/><path d="M-7 0 C-7 -6 4 -9 8 -4 C10 0 6 4 0 4 C-4 4 -7 3 -7 0Z" fill="url(#niAbel)" stroke="#1E5A2A" stroke-width="1"/><path d="M-5 -1 C-2 -4 2 -4 5 -2" stroke="#2E8A3A" stroke-width="1.4" fill="none"/><circle cx="8" cy="-6" r="4.4" fill="#6ACC5A" stroke="#1E5A2A" stroke-width="1"/><path d="M5 -9.6 q3 -1.6 6 .4" stroke="#E8B030" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M4 -6 h9" stroke="#12121A" stroke-width="1.7" stroke-linecap="round"/><path d="M8 -2.4 q3 1 5 -1" stroke="#2EA8E0" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M12 -6.2 L20 -4.6 L12 -4.2Z" fill="#1A1A22"/><circle cx="9" cy="-6.2" r="1.3" fill="#B8241A"/><circle cx="9.4" cy="-6.6" r=".45" fill="#fff"/><path d="M-3 -4 q3 -2 6 -1" stroke="#D8F8B0" stroke-width="1" fill="none"/>`;
  const POUSO_A = [[288, 234], [304, 222], [320, 240]], POUSO_B = [[414, 293], [452, 293], [463, 293]];
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
  const fileira = (c, fn) => { const [a, b, cc, dd] = c; let s = ''; for (let r = 0; r < 5; r++) { const yy = Y0 + 14 + r * 24, q = (yy - Y0) / (Y1 - Y0), xl = a + (cc - a) * q + 8, xr = b + (dd - b) * q - 8, n = 7; for (let k = 0; k < n; k++) { const x = xl + (xr - xl) * (k + .5) / n, sc = .7 + q * .5; s += `<ellipse cx="${(x + 2 * sc).toFixed(1)}" cy="${(yy + .6).toFixed(1)}" rx="${(6 * sc).toFixed(1)}" ry="${(1.6 * sc).toFixed(1)}" fill="#1A1008" opacity=".2"/>` + fn(x, yy, sc, r * n + k); } } return s; };
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
  const RIO = 'M296 190 C330 196 380 206 420 222 C470 244 496 270 503 300 C510 340 512 400 498 500 L780 500 C750 440 716 380 680 330 C640 280 560 236 470 212 C400 198 340 192 304 189Z';
  const RIO_E = 'M296 190 C330 196 380 206 420 222 C470 244 496 270 503 300 C510 340 512 400 498 500', RIO_D = 'M780 500 C750 440 716 380 680 330 C640 280 560 236 470 212 C400 198 340 192 304 189';
  const CHEIA = 'M0 308 C120 300 250 302 345 294 C400 288 440 262 452 236 L472 236 C492 262 508 300 512 340 L508 500 H0Z';
  const EP = t => ({ y:300 + 196 * t, xl:664 + 70 * t, xr:692 + 128 * t }), EH = t => 8 + 60 * t;
  const CORR = (() => { const a = EP(0), b = EP(1); return `M${a.xl} ${a.y} L${a.xr} ${a.y} L${b.xr} ${b.y} L${b.xl} ${b.y}Z`; })();
  const quadE = (ta, tb, dxa, dya, dxb, dyb, lado) => { const a = EP(ta), b = EP(tb), xa = lado ? a.xr : a.xl, xb = lado ? b.xr : b.xl; return `M${xa.toFixed(1)} ${a.y.toFixed(1)} L${(xa + dxa).toFixed(1)} ${(a.y + dya).toFixed(1)} L${(xb + dxb).toFixed(1)} ${(b.y + dyb).toFixed(1)} L${xb.toFixed(1)} ${b.y.toFixed(1)}Z`; };
  const ESCADA = (() => {
    const N = 12; let deg = '';
    for (let k = 0; k < N; k++) {
      const t0 = k / N, t1 = (k + 1) / N, tm = t0 + (t1 - t0) * .52, a = EP(t0), m = EP(tm), b = EP(t1);
      deg += `<path d="M${a.xl.toFixed(1)} ${a.y.toFixed(1)} L${a.xr.toFixed(1)} ${a.y.toFixed(1)} L${m.xr.toFixed(1)} ${m.y.toFixed(1)} L${m.xl.toFixed(1)} ${m.y.toFixed(1)}Z" fill="url(#niDegrau)"/>`;
      deg += `<path d="M${m.xl.toFixed(1)} ${m.y.toFixed(1)} L${m.xr.toFixed(1)} ${m.y.toFixed(1)} L${b.xr.toFixed(1)} ${b.y.toFixed(1)} L${b.xl.toFixed(1)} ${b.y.toFixed(1)}Z" fill="#B8915E"/>`;
      deg += `<path d="M${m.xl.toFixed(1)} ${m.y.toFixed(1)} L${m.xr.toFixed(1)} ${m.y.toFixed(1)}" stroke="#FFF2D6" stroke-width="${(1 + t1 * 1.4).toFixed(1)}"/><path d="M${b.xl.toFixed(1)} ${b.y.toFixed(1)} L${b.xr.toFixed(1)} ${b.y.toFixed(1)}" stroke="#6E4A2A" stroke-width="${(.8 + t1).toFixed(1)}"/>`;
      if (k % 3 === 1) { const x = m.xl + (m.xr - m.xl) * .62; deg += `<path d="M${x.toFixed(1)} ${(m.y + 2).toFixed(1)} l${(3 + t1 * 4).toFixed(1)} ${(-1).toFixed(1)}" stroke="#8A6440" stroke-width="1" opacity=".6"/>`; }
    }
    /* parede alta do lado da margem (na sombra), com fiadas de pedra */
    const parede = quadE(0, 1, 2, -EH(0), 14, -EH(1), 1);
    let fiadas = ''; for (let r = 1; r < 7; r++) { const q = r / 7; fiadas += `M${(EP(0).xr + 2 * q).toFixed(1)} ${(EP(0).y - EH(0) * q).toFixed(1)} L${(EP(1).xr + 14 * q).toFixed(1)} ${(EP(1).y - EH(1) * q).toFixed(1)} `; }
    for (let k = 0; k < 14; k++) { const t = (k + .5) / 14, p = EP(t), h = EH(t), q0 = (k % 2) / 7 + .07; for (let r = 0; r < 3; r++) { const qa = q0 + r * 2 / 7; if (qa + 1 / 7 > 1) continue; fiadas += `M${(p.xr + 14 * t * qa).toFixed(1)} ${(p.y - h * qa).toFixed(1)} l${(14 * t / 7).toFixed(1)} ${(-h / 7).toFixed(1)} `; } }
    const coroa = (() => { const a = EP(0), b = EP(1); return `M${a.xr + 2} ${a.y - EH(0)} L${b.xr + 14} ${b.y - EH(1)} L${b.xr + 40} ${b.y - EH(1) - 6} L${a.xr + 8} ${a.y - EH(0) - 2}Z`; })();
    /* mureta do lado do rio */
    const PM = t => 5 + 9 * t, QD = t => 34 - 26 * t;
    const mTopo = (() => { let d = ''; for (let i = 0; i <= 10; i++) { const t = i / 10, p = EP(t); d += `${i ? 'L' : 'M'}${(p.xl - 1).toFixed(1)} ${(p.y - PM(t)).toFixed(1)} `; } for (let i = 10; i >= 0; i--) { const t = i / 10, p = EP(t); d += `L${(p.xl + 5 + 4 * t).toFixed(1)} ${(p.y - PM(t) + 1 + t).toFixed(1)} `; } return d + 'Z'; })();
    const mFace = (() => { let d = ''; for (let i = 0; i <= 10; i++) { const t = i / 10, p = EP(t); d += `${i ? 'L' : 'M'}${(p.xl - 1).toFixed(1)} ${(p.y - PM(t)).toFixed(1)} `; } for (let i = 10; i >= 0; i--) { const t = i / 10, p = EP(t); d += `L${(p.xl - 1 - QD(t) * .35).toFixed(1)} ${(p.y + QD(t)).toFixed(1)} `; } return d + 'Z'; })();
    let mBlocos = ''; for (let r = 1; r < 4; r++) { const q = r / 4; let d = ''; for (let i = 0; i <= 10; i++) { const t = i / 10, p = EP(t), y0 = p.y - PM(t), y1 = p.y + QD(t); d += `${i ? 'L' : 'M'}${(p.xl - 1 - QD(t) * .35 * q).toFixed(1)} ${(y0 + (y1 - y0) * q).toFixed(1)} `; } mBlocos += d; }
    for (let k = 0; k < 16; k++) { const t = (k + .5) / 16, p = EP(t), y0 = p.y - PM(t), y1 = p.y + QD(t), r = k % 4, qa = r / 4, qb = (r + 1) / 4; mBlocos += `M${(p.xl - 1 - QD(t) * .35 * qa).toFixed(1)} ${(y0 + (y1 - y0) * qa).toFixed(1)} L${(p.xl - 1 - QD(t) * .35 * qb).toFixed(1)} ${(y0 + (y1 - y0) * qb).toFixed(1)} `; }
    return { fundo:`<path d="${parede}" fill="url(#niPedraF)" stroke="#5E3E22" stroke-width="1.3" stroke-linejoin="round"/><path d="${fiadas}" stroke="#6E4E30" stroke-width=".9" fill="none" opacity=".55"/><path d="${coroa}" fill="#F2DAB0" stroke="#7A5434" stroke-width="1.2" stroke-linejoin="round"/><path d="M${EP(0).xr + 2} ${EP(0).y - EH(0)} L${EP(1).xr + 14} ${EP(1).y - EH(1)}" stroke="#FFF4DE" stroke-width="1.6"/>`,
      degraus:`<path d="${CORR}" fill="#B8915E"/>${deg}<path d="${quadE(0, 1, 2, -EH(0), 14, -EH(1), 1)}" fill="none"/><path d="M${EP(0).xr} ${EP(0).y} L${EP(1).xr} ${EP(1).y}" stroke="#3A2414" stroke-width="2" opacity=".5"/>`,
      sombra:`<path d="M${EP(0).xr} ${EP(0).y} L${EP(1).xr} ${EP(1).y} L${EP(1).xr - 30} ${EP(1).y} L${EP(0).xr - 6} ${EP(0).y}Z" fill="#2A1808" opacity=".22"/>`,
      mureta:`<path d="${mFace}" fill="url(#niPedraL)" stroke="#5E3E22" stroke-width="1.3" stroke-linejoin="round"/><path d="${mBlocos}" stroke="#8A6440" stroke-width=".9" fill="none" opacity=".6"/><path d="${mTopo}" fill="#F6E0B8" stroke="#7A5434" stroke-width="1.1" stroke-linejoin="round"/><path d="M${EP(0).xl - 1} ${EP(0).y - PM(0)} L${EP(1).xl - 1} ${EP(1).y - PM(1)}" stroke="#FFF6E2" stroke-width="1.4"/>` };
  })();
  const faixasCampo = (x0, x1, y0, rows, h, inc, cores) => { let s = ''; for (let r = 0; r < rows; r++) { const ya = y0 + r * h; let x = x0 + r * inc, k = r; while (x < x1) { const w = R(16, 30) * (1 + r * .3); s += `<path d="M${x.toFixed(1)} ${ya.toFixed(1)} h${w.toFixed(1)} l${(inc * .6).toFixed(1)} ${(h - 1.2).toFixed(1)} h${(-w - inc * 1.2).toFixed(1)}Z" fill="${cores[(k++) % cores.length]}" stroke="#5E8A3A" stroke-width=".6"/>`; x += w + 1.4; } } return s; };
  const NP = [[-46, 8, 19], [-26, -4, 25], [0, -14, 30], [28, -6, 25], [50, 8, 18], [-14, 12, 22], [16, 12, 22], [36, 14, 16], [-36, 16, 16]];
  const NUV_ARO = (() => { let d = ''; NP.forEach(([x, y, r], i) => { let on = false; for (let a = -175; a <= 5; a += 5) { const ra = a * Math.PI / 180, px = x + Math.cos(ra) * r, py = y + Math.sin(ra) * r, fora = NP.every(([x2, y2, r2], j) => j === i || Math.hypot(px - x2, py - y2) > r2 + .5) && py < 14; if (fora) { d += `${on ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)} `; on = true; } else on = false; } }); return d; })();
  const nuvemVol = () => `<ellipse cx="2" cy="30" rx="62" ry="8" fill="#3E4864" opacity=".25"/>${NP.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#46506E" stroke="#3A425E" stroke-width="3"/>`).join('')}${NP.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#6E7898"/>`).join('')}
      <g clip-path="url(#niNuvC)"><g filter="url(#niNuvF)">${NP.map(([x, y, r]) => `<circle cx="${x + 3}" cy="${y - 5}" r="${(r * .86).toFixed(1)}" fill="#A6AEC6"/>`).join('')}${NP.slice(0, 5).map(([x, y, r]) => `<circle cx="${x + 6}" cy="${y - 9}" r="${(r * .64).toFixed(1)}" fill="#DCDCE8"/>`).join('')}${NP.slice(0, 5).map(([x, y, r]) => `<circle cx="${x + 8}" cy="${y - 13}" r="${(r * .36).toFixed(1)}" fill="#FFF8EE"/>`).join('')}</g>
      <path d="M-70 22 C-40 36 40 36 70 22 V40 H-70Z" fill="#4E5876" opacity=".7"/>
      <g class="ni-nuv-esc" style="opacity:0;transition:opacity 1.2s"><rect x="-80" y="-50" width="160" height="90" fill="#2E3650" opacity=".6"/></g></g>
      <path d="${NUV_ARO}" stroke="#FFE8C0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".95"/>`;
  const nuvemBranca = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[[-30, 6, 14], [-12, -2, 18], [10, -6, 20], [30, 4, 14], [0, 8, 16]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#niPuffB)"/>`).join('')}<path d="M-44 12 C-20 22 20 22 44 12 C30 20 -30 20 -44 12Z" fill="#E2D2C8" opacity=".7"/></g>`;
  const falucaLonge = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation:flutua ${R(3, 4.5).toFixed(1)}s ease-in-out infinite alternate"><path d="M-40 2 L30 -88 C40 -56 46 -24 42 4Z" fill="#FFF8EC" stroke="#8A7A5A" stroke-width="3"/><path d="M-50 4 C-30 8 40 8 56 2 C50 14 30 18 0 18 C-30 18 -46 14 -50 4Z" fill="#E8EEF6" stroke="#3A4A6A" stroke-width="3"/><path d="M-46 9 C-20 12 30 12 52 7" stroke="#2E7BF6" stroke-width="3" fill="none"/></g></g>`;
  const pombal = (x, y, h) => { let fur = ''; for (let r = 0; r < 6; r++) { const yy = y - 16 - r * (h - 26) / 6, w = 13 - r * 1.2; for (let k = -1; k <= 1; k++) fur += `<ellipse cx="${(x + k * w * .6).toFixed(1)}" cy="${yy.toFixed(1)}" rx="1.8" ry="2.2" fill="#3A2214"/>`; fur += `<path d="M${(x - w - 3).toFixed(1)} ${(yy + 4).toFixed(1)} h${(2 * w + 6).toFixed(1)}" stroke="#6E4220" stroke-width="1.6" stroke-linecap="round"/>`; }
    return `<g><path d="M${x - 22} ${y + 1} l-14 4 h40 l14 -4Z" fill="#3A2410" opacity=".2"/><path d="M${x - 16} ${y} L${x - 10} ${y - h + 14} Q${x} ${y - h - 6} ${x + 10} ${y - h + 14} L${x + 16} ${y}Z" fill="url(#niAdobe)" stroke="#7A4A26" stroke-width="1.6" stroke-linejoin="round"/><path d="M${x + 8} ${y - h + 18} L${x + 13} ${y - 2}" stroke="#9A6234" stroke-width="4" opacity=".35"/><path d="M${x - 12} ${y - 4} L${x - 7} ${y - h + 18}" stroke="#FCE6C0" stroke-width="1.6" opacity=".8"/>${fur}<circle cx="${x}" cy="${y - h + 2}" r="2.4" fill="#E8C060" stroke="#7A4A26" stroke-width=".8"/><g fill="#F4F2EC" stroke="#6A6A7A" stroke-width=".6"><path d="M${x - 6} ${y - h + 22} q3 -3 6 0 l-3 1.6Z"/><path d="M${x + 4} ${y - h + 34} q3 -3 6 0 l-3 1.6Z"/></g></g>`; };
  const domo = (cx, y, r) => `<path d="M${cx - r} ${y} A${r} ${r * .9} 0 0 1 ${cx + r} ${y}Z" fill="url(#niDomo)" stroke="#7A4A26" stroke-width="1.4"/><path d="M${cx - r * .6} ${y - r * .5} A${r * .7} ${r * .7} 0 0 1 ${cx} ${y - r * .86}" stroke="#FCE6C0" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="${cx}" cy="${y - r * .9 - 2}" r="1.8" fill="#E8C060" stroke="#7A4A26" stroke-width=".7"/><circle cx="${cx + r * .3}" cy="${y - r * .35}" r="1.4" fill="#5A3418"/>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Rio Nilo no Egito: montanhas distantes com nuvens de chuva, o rio no meio do deserto, campos, um shaduf, um nilômetro e uma vila">
    <defs>
      ${lgd('niCeu', ['#3E8CD8', '#7FB8E6', '#CDE4EE', '#FBDDB0'])}
      ${lgd('niMonteL', ['#A6B2D0', '#CCCCD8'])}${lgd('niMonte', ['#7A9E9A', '#A2B8A6'])}${lgd('niMonteE', ['#2E6A62', '#4E8A6A'])}
      ${lgd('niPlato', ['#F0C49A', '#D4966A'])}${lgd('niAreia', ['#F6D8A0', '#E8BA7A'])}${lgd('niDuna', ['#FCE4AE', '#E8B470'])}${lgd('niDuna2', ['#F8D89C', '#DCA25C'])}${lgd('niFalesia', ['#F6D4C0', '#DEA894'])}${lgd('niTalude', ['#EEC8A2', '#DCAE84'])}${lgd('niPedraF', ['#C8A47A', '#A4805A'])}${lgd('niPedraL', ['#F2D8AE', '#CFA87C'])}${lgd('niMonte2', ['#C8A46C', '#A8844E'])}${lgd('niDique', ['#D0A46A', '#8E663C'])}
      ${lgd('niVerde', ['#AED266', '#78B24A', '#4E8E36'])}
      ${lgd('niRio', ['#7FCFE0', '#3E9EC4', '#1E6E9A'])}${lgd('niRioCheia', ['#C08A5A', '#9A643E', '#7A4A2A'])}
      ${lgd('niCheia', ['#B88C62', '#946A44'])}
      ${lgd('niSeco', ['#E6C890', '#C9A066'])}${lgd('niLama', ['#4E3C30', '#2A1E16'])}${lgd('niMolhado', ['#3A2E28', '#1A1210'])}
      ${lgd('niVerdeC', ['#8ED65A', '#4E9E36'])}${lgd('niOuro', ['#F2D27A', '#D2A040'])}
      ${lgd('niAdobe', ['#ECC48E', '#C8915A'])}${lgd('niPedra', ['#E2C298', '#B48A5E'])}${lgd('niVara', ['#D9A060', '#8A5A2A'], 1, 0)}${lgd('niBalde', ['#C9784A', '#7A3E1E'])}
      ${lgd('niCesto', ['#E0A858', '#A86A28'])}${lgd('niMadeira', ['#B07A44', '#6E4220'], 1, 0)}${lgd('niBarro', ['#E08A54', '#9A4A22'], 1, 0)}${lgd('niPoco', ['#5A4028', '#3A2818'])}<linearGradient id="niSombraT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140C06" stop-opacity=".55"/><stop offset="1" stop-color="#140C06" stop-opacity="0"/></linearGradient>${lgd('niColuna', ['#F0D8B0', '#B8915E'], 1, 0)}${lgd('niDegrau', ['#E8CCA0', '#BC976A'])}${lgd('niTil', ['#B8D0C8', '#6E8E86'])}${lgd('niAbel', ['#7ADC6A', '#2E9A3E'])}${lgd('niFolha', ['#7FC04A', '#2E6A22'], 1, 0)}<linearGradient id="niBruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0" stop-opacity="0"/><stop offset=".45" stop-color="#FFF4E0" stop-opacity=".45"/><stop offset="1" stop-color="#FFF4E0" stop-opacity="0"/></linearGradient><linearGradient id="niReflexo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFEFFF" stop-opacity="0"/><stop offset=".5" stop-color="#CFEFFF" stop-opacity=".4"/><stop offset="1" stop-color="#CFEFFF" stop-opacity="0"/></linearGradient>${lgd('niVela', ['#FFFFFF', '#E8DCC2'], 1, 1)}${lgd('niCasco', ['#F4F6FA', '#B8C4D6'])}
      ${lgd('niGarca', ['#FFFFFF', '#DCE2EE'])}${lgd('niGalab', ['#9CC8E8', '#5E90BE'])}${lgd('niBlusa', ['#FF8A5A', '#E0502E'])}
      <radialGradient id="niPuff" cx=".65" cy=".28" r=".85"><stop offset="0" stop-color="#FFF9EE"/><stop offset=".35" stop-color="#E8E6EE"/><stop offset=".72" stop-color="#A4ACC4"/><stop offset="1" stop-color="#727C9A"/></radialGradient>
      <radialGradient id="niPuffB" cx=".6" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#FFF4E4"/><stop offset="1" stop-color="#EAD4C8"/></radialGradient>
      <radialGradient id="niRaio" gradientUnits="userSpaceOnUse" cx="694" cy="62" r="520"><stop offset="0" stop-color="#FFF4D0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4D0" stop-opacity="0"/></radialGradient>
      <radialGradient id="niHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".8"/><stop offset=".45" stop-color="#FFE8A0" stop-opacity=".3"/><stop offset="1" stop-color="#FFE8A0" stop-opacity="0"/></radialGradient>
      <radialGradient id="niDomo" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FAE0B6"/><stop offset="1" stop-color="#C08850"/></radialGradient>
      <linearGradient id="niBrumaV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0DC" stop-opacity=".55"/><stop offset="1" stop-color="#FFF0DC" stop-opacity=".1"/></linearGradient>
      <linearGradient id="niVeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E86B8" stop-opacity=".55"/><stop offset="1" stop-color="#6E86B8" stop-opacity="0"/></linearGradient>
      <radialGradient id="niLuz" gradientUnits="userSpaceOnUse" cx="694" cy="62" r="720"><stop offset="0" stop-color="#FFE2A0" stop-opacity=".3"/><stop offset=".5" stop-color="#FFD890" stop-opacity=".1"/><stop offset="1" stop-color="#FFD890" stop-opacity="0"/></radialGradient>
      <radialGradient id="niSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFD24A"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <radialGradient id="niPele1" cx=".4" cy=".35"><stop offset="0" stop-color="#C98A5A"/><stop offset="1" stop-color="#8A5530"/></radialGradient>
      <radialGradient id="niPele2" cx=".4" cy=".35"><stop offset="0" stop-color="#B07448"/><stop offset="1" stop-color="#7A4626"/></radialGradient>
      <radialGradient id="niPeso" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#9A8A78"/><stop offset=".6" stop-color="#6A5A4A"/><stop offset="1" stop-color="#3E3228"/></radialGradient>
      <radialGradient id="niVinheta" cx=".5" cy=".46" r=".78"><stop offset=".62" stop-color="#3A1E0A" stop-opacity="0"/><stop offset="1" stop-color="#3A1E0A" stop-opacity=".32"/></radialGradient>
      <linearGradient id="niNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E0" stop-opacity=".7"/></linearGradient>
      <clipPath id="niPocoC"><path d="${CORR}"/></clipPath><filter id="niNuvF" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter><clipPath id="niNuvC">${NP.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join()}</clipPath><filter id="niDesf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>${CANT.map((c, i) => `<clipPath id="niCantC${i}"><path d="${cantPath(c)}"/></clipPath>`).join('')}
      <clipPath id="niRioC"><path d="${RIO}"/></clipPath>
      <filter id="niGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="210" fill="url(#niCeu)"/>
    <g opacity=".55" pointer-events="none">${[[120, 22], [136, 30], [152, 24], [168, 18], [106, 16]].map(([a, w]) => { const r = a * Math.PI / 180, d = w / 400, L = 760; return `<path d="M694 62 L${(694 + Math.cos(r - d) * L).toFixed(0)} ${(62 + Math.sin(r - d) * L).toFixed(0)} L${(694 + Math.cos(r + d) * L).toFixed(0)} ${(62 + Math.sin(r + d) * L).toFixed(0)}Z" fill="url(#niRaio)"/>`; }).join('')}</g>
    <g id="ni-sol" class="toque"><circle cx="694" cy="62" r="78" fill="url(#niHalo)"/><circle cx="694" cy="62" r="28" fill="url(#niSolG)" stroke="#F2A81E" stroke-width="2"/><path d="M679 51 q8 -9 21 -9" stroke="#FFF8D8" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva" style="animation-duration:40s">${nuvemBranca(470, 54, .8)}${nuvemBranca(580, 112, .55)}</g>
    <!-- planalto da Etiópia, longe -->
    <path d="M0 132 L18 124 H44 L54 110 H92 L102 100 H146 L160 110 H196 L210 120 H242 C262 130 290 150 322 172 L326 196 H0Z" fill="url(#niMonteL)"/>
    <path d="M44 124 L54 110 V132 L40 140Z M92 110 L102 100 V124 L88 128Z M196 110 L210 120 V140 L194 136Z" fill="#8A92B4" opacity=".5"/>
    <path d="M18 124 H44 M54 110 H92 M102 100 H146 M160 110 H196 M210 120 H242" stroke="#ECEEF6" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    <path d="M146 100 L160 110 L168 134 L150 130Z M242 120 C262 130 280 142 296 156 L270 156Z" fill="#C8CCDE" opacity=".6"/>
    <g stroke="#9AA2C0" stroke-width="1" opacity=".55">${[[60, 116, 26], [110, 106, 30], [216, 126, 20]].map(([x, y, w]) => `<path d="M${x} ${y} h${w} M${x + 4} ${y + 6} h${w - 6}"/>`).join('')}</g>
    <path d="M0 196 C24 162 60 144 100 150 C134 134 172 136 206 152 C236 164 266 180 296 196Z" fill="url(#niMonte)" stroke="#5E8A86" stroke-width="1.2"/>
    <g fill="#5E8E7A" opacity=".45">${Array.from({ length:22 }, () => { const x = R(20, 280), y = R(156, 190); return `<path d="${copa(x, y, R(5, 10), R(2.6, 4.4), 6, .3)}"/>`; }).join('')}</g>
    <path d="M30 168 C60 152 92 150 120 156 M150 146 C180 144 210 152 236 166" stroke="#D4E4D4" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/>
    <path id="ni-cascata" d="M176 140 C182 154 190 166 202 174 C220 184 262 190 298 191" stroke="#9AD6F0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
    <!-- deserto: dunas douradas e falésias de calcário -->
    <rect y="186" width="800" height="120" fill="url(#niAreia)"/>
    <path d="M440 198 L452 184 H520 L530 174 H600 L612 162 H700 L716 152 H800 V206 H440Z" fill="#EBC6AC" opacity=".8"/>
    <path d="M512 246 C518 232 526 220 534 212 L544 201 C562 197 586 200 604 197 L614 190 L626 186 C650 183 676 188 700 184 L711 177 L722 172 C746 169 772 174 800 170 V254 H512Z" fill="url(#niFalesia)" stroke="#B07A62" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M534 212 L544 201 C546 214 548 226 546 242 L530 244Z M614 190 L626 186 C628 200 630 214 628 238 L612 240 C614 222 616 206 614 190Z M711 177 L722 172 C724 190 726 210 722 236 L706 236 C710 214 712 196 711 177Z" fill="#C88672" opacity=".7"/>
    <g fill="none" stroke-linecap="round">${[556, 572, 590, 640, 660, 684, 738, 758, 782].map((x, i) => { const y0 = x < 610 ? 200 : x < 705 ? 187 : 173; let d = `M${x} ${y0 + 2}`; for (let y = y0 + 8; y < 240; y += 8) d += ` L${(x + Math.sin(y * .3 + i) * .8).toFixed(1)} ${y}`; return `<path d="${d}" stroke="#C48A74" stroke-width="1.4" opacity=".75"/><path d="${d}" stroke="#FFEADC" stroke-width="1" opacity=".7" transform="translate(2 0)"/>`; }).join('')}</g>
    <path d="M544 201 C562 197 586 200 604 197 M626 186 C650 183 676 188 700 184 M722 172 C746 169 772 174 800 170" stroke="#FFEFE2" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <g stroke="#D29C86" stroke-width="1" opacity=".7">${[210, 219, 228].map(y => `<path d="M${550 + (y - 200) * .1} ${y} h22 m8 0 h18 M${632} ${y - 8} h26 m6 0 h30 M${728} ${y - 14} h20 m10 0 h34"/>`).join('')}</g>
    <path d="M500 250 C560 236 640 232 720 236 C760 236 790 238 800 240 V270 H500Z" fill="url(#niTalude)"/>
    <path d="M0 236 C40 210 90 200 140 206 C180 200 230 194 300 194 L300 250 H0Z" fill="url(#niDuna)"/>
    <path d="M140 206 C176 214 206 228 236 246 L140 246Z" fill="#D6A060" opacity=".45"/>
    <path d="M10 228 C50 210 96 202 140 206" stroke="#FFF2CE" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M0 258 C34 240 80 232 130 236 C160 238 182 246 200 256 L0 270Z" fill="url(#niDuna2)"/>
    <path d="M130 236 C160 240 184 250 204 262 L130 262Z" fill="#C88E50" opacity=".4"/><path d="M6 252 C40 238 90 232 130 236" stroke="#FFF2CE" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <g stroke="#E2B070" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".8">${Array.from({ length:16 }, () => { const x = R(10, 260), y = R(214, 258); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q6 -2.4 12 0 t12 0"/>`; }).join('')}</g>
    <!-- faixa verde do vale -->
    <path id="ni-faixa" d="M0 272 C70 258 150 230 230 208 C262 200 282 194 298 192 L310 192 C380 198 460 214 540 236 C620 254 720 264 800 264 V500 H0Z" fill="url(#niVerde)"/>
    <path d="M0 272 C70 258 150 230 230 208 C262 200 282 194 298 192 M310 192 C380 198 460 214 540 236 C620 254 720 264 800 264" stroke="#F2DCA0" stroke-width="3" fill="none"/>
    <path d="M0 276 C70 262 150 234 230 212 M320 196 C390 202 460 218 540 240 C620 258 720 268 800 268" stroke="#3E7A2E" stroke-width="2" fill="none" opacity=".35"/>
    <g>${faixasCampo(214, 400, 205, 3, 8, -5, ['#A8D06A', '#D4D47A', '#7CBA52', '#E6CC7E', '#94C860'])}</g>
    <g>${faixasCampo(560, 800, 262, 2, 9, 6, ['#9CCB5A', '#D8CE78', '#78B64E', '#B8D46E'])}</g>
    <g fill="#4E8E36" opacity=".5">${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(310, 350); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q2 -6 4 0 q2 -5 4 0"/>`; }).join('')}</g>
    <!-- palmeirais em várias distâncias -->
    <g>${[[300, 195, .2], [318, 197, .24], [336, 200, .26], [362, 204, .3], [390, 210, .34], [474, 218, .32], [498, 224, .36], [526, 232, .4], [552, 240, .44], [584, 248, .48]].map(([x, y, s], i) => palmeira(x, y, 40 * s * 1.6, s, i % 2 ? '#6AAE4E' : '#5AA046', '#4A8A3A', i % 2 ? 1 : -1)).join('')}</g>
    <rect y="176" width="800" height="90" fill="url(#niBruma)" pointer-events="none"/>
    <g>${[[612, 270, .56], [640, 276, .62], [668, 282, .66], [740, 280, .72], [776, 286, .82], [436, 232, .46], [456, 244, .52]].map(([x, y, s], i) => palmeira(x, y, 40 * s * 1.6, s, i % 2 ? '#5AA642' : '#4E9A3A', '#3E8030', i % 2 ? -1 : 1)).join('')}</g>
    <!-- rio -->
    <path d="${RIO_E} M${RIO_D.slice(1)}" stroke="#E2C48E" stroke-width="22" fill="none"/>
    <path d="${RIO_E} M${RIO_D.slice(1)}" stroke="#6E4E34" stroke-width="13" fill="none"/>
    <path d="${RIO_E} M${RIO_D.slice(1)}" stroke="#4A3222" stroke-width="7" fill="none"/>
    <path d="${RIO_E} M${RIO_D.slice(1)}" stroke="#F6E2B8" stroke-width="23" fill="none" stroke-dasharray="1 9" stroke-linecap="round" opacity=".5"/>
    <path id="ni-rio" d="${RIO}" fill="url(#niRio)" stroke="#1E5A7A" stroke-width="1.4"/>
    <g clip-path="url(#niRioC)" pointer-events="none">
      <path d="M220 160 L420 210 L560 300 L620 500" stroke="#CFEFFF" stroke-width="120" fill="none" opacity=".18" filter="url(#niDesf)"/>
      <path d="M300 190 C360 198 420 214 470 236 C530 262 570 300 598 340 C622 376 640 430 650 500" stroke="#0E4A78" stroke-width="64" fill="none" opacity=".3" filter="url(#niDesf)"/>
      <path d="${RIO}" fill="none" stroke="#D2F4FA" stroke-width="14" opacity=".5" filter="url(#niDesf)"/>
      <g fill="#2E5A2A" opacity=".2" filter="url(#niDesf)">${[[600, 262, 30], [650, 292, 34], [700, 330, 30], [560, 244, 22]].map(([x, y, r]) => `<ellipse cx="${x - 24}" cy="${y + 14}" rx="${r}" ry="${(r * .35).toFixed(0)}"/>`).join('')}</g>
      <path d="${RIO_E}" stroke="#4E3420" stroke-width="5" fill="none" opacity=".35"/><path d="M${RIO_D.slice(1)}" stroke="#4E3420" stroke-width="5" fill="none" opacity=".35"/>
      <path d="M452 230 q16 -5 32 -1 q-16 4 -32 1Z" fill="#E8CC94" stroke="#B08A58" stroke-width="1"/><path d="M456 229 q12 -3 24 -1" stroke="#FFF0CC" stroke-width="1" fill="none"/>
      <path d="M608 300 q18 -7 40 -2 q-20 6 -40 2Z" fill="#E8CC94" stroke="#B08A58" stroke-width="1.2"/><g stroke="#4E8A30" stroke-width="1.2" stroke-linecap="round">${[616, 624, 632].map(x => `<path d="M${x} 299 l-1 -6 M${x + 2} 299 l2 -5"/>`).join('')}</g>
    </g>
    <path id="ni-rio-cheia" d="${RIO}" fill="url(#niRioCheia)" style="opacity:0;transition:opacity 1.6s"/>
    <g clip-path="url(#niRioC)" id="ni-reflexos">${[[330, 194, 16], [400, 212, 22], [470, 240, 30], [540, 284, 44], [560, 330, 60], [600, 400, 70], [640, 470, 80], [530, 446, 40], [580, 364, 36]].map(([x, y, w], i) => `<path class="brilha-agua" style="animation-delay:${(i * .37).toFixed(1)}s" d="M${x - w / 2} ${y} q${w / 4} -3 ${w / 2} 0 t${w / 2} 0" stroke="#F0FAFF" stroke-width="${(1 + i * .2).toFixed(1)}" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <path id="ni-centro" d="M300 190 C360 198 420 214 470 236 C530 262 570 300 598 340 C618 370 636 400 650 430" fill="none" stroke="none"/>
    ${falucaLonge(352, 199, .13)}${falucaLonge(404, 210, .17)}
    ${[[330, 194, .35], [372, 202, .4], [414, 216, .5], [452, 238, .6], [490, 272, .8], [508, 334, .9], [520, 228, .5], [562, 244, .6], [604, 266, .7], [648, 296, .85]].map(([x, y, k]) => papiroMini(x, y, k)).join('')}
    <!-- faluca (longe) -->
    <g id="ni-faluca" class="toque" data-fig="faluca"><g id="ni-faluca-pos" transform="translate(512 248) scale(.42)"><g style="animation:flutua 3.4s ease-in-out infinite alternate">
      <ellipse cx="0" cy="24" rx="80" ry="9" fill="#0E3A5A" opacity=".3"/>
      <g opacity=".35"><path d="M-60 34 C-30 40 40 40 70 32" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-40 42 C-10 46 30 46 50 40" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M20 32 L44 -60 L50 32Z" fill="#FFF6E2" opacity=".35"/></g>
      <path d="M-74 10 L-90 30 L-84 32 L-70 16" fill="#6E4220" stroke="#3A2210" stroke-width="1.6" stroke-linejoin="round"/><path d="M-72 12 L-80 -2" stroke="#6E4220" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M-11 -58 L74 6 M-11 -58 L-70 8" stroke="#6A5A44" stroke-width="1" fill="none" opacity=".8"/>
      <path d="M-12 14 L-10 -60" stroke="#4E2E14" stroke-width="5" stroke-linecap="round"/>
      <path d="M-64 10 L36 -128" stroke="#4E2E14" stroke-width="4.6" stroke-linecap="round"/><path d="M-64 10 L36 -128" stroke="url(#niVara)" stroke-width="2.4" stroke-linecap="round"/>
      <g id="ni-vento" opacity="0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-150 -80 q20 -8 44 0 q14 5 26 0"/><path d="M-170 -40 q24 -8 50 0"/><path d="M-140 -2 q18 -6 40 0 q10 4 20 0"/></g>
      <g id="ni-vela"><path d="M-60 6 L34 -124 C48 -84 58 -40 54 10 C20 13 -24 12 -60 6Z" fill="url(#niVela)" stroke="#8A7A5A" stroke-width="2.2" stroke-linejoin="round"/>
      <g stroke="#CDBE9A" stroke-width="1.3" fill="none"><path d="M-36 -22 C-4 -18 26 -14 52 -12"/><path d="M-14 -56 C8 -50 30 -44 50 -40"/><path d="M8 -88 C22 -82 34 -76 44 -72"/><path d="M-12 8 L22 -96"/><path d="M18 10 L38 -60"/></g>
      <path d="M30 -110 C42 -76 48 -40 48 0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/></g>
      <path d="M36 -128 l18 -4 l-5 7 l6 4 l-19 0Z" fill="#E5392C" stroke="#8A1E14" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-72 10 C-50 14 50 14 78 8 C72 22 56 30 34 30 H-40 C-58 30 -68 22 -72 10Z" fill="url(#niCasco)" stroke="#3A4A6A" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M-68 16 C-36 21 40 21 72 14" stroke="#2E7BF6" stroke-width="3.6" fill="none"/><path d="M-62 23 C-30 27 36 27 64 21" stroke="#FFC83D" stroke-width="2.4" fill="none"/>
      <g fill="#E5392C" stroke="#8A1E14" stroke-width=".6">${[-52, -32, -12, 8, 28, 48].map(x => `<path d="M${x} 16 l5 7 l5 -7Z"/>`).join('')}</g><g fill="#FFFFFF" opacity=".9">${[-42, -22, -2, 18, 38].map(x => `<circle cx="${x + 5}" cy="19" r="1.4"/>`).join('')}</g>
      <path d="M-74 10 C-50 13 50 13 80 7" stroke="#7A4A22" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-70 8.6 C-50 11.4 50 11.4 76 5.6" stroke="#C88A50" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <g id="ni-carga"></g>
      <g transform="translate(-48 4)"><path d="M-5 0 v-14 C-5 -20 5 -20 5 -14 V0Z" fill="#2E7BF6" stroke="#12235A" stroke-width="1.2"/><circle cx="0" cy="-22" r="5.6" fill="url(#niPele2)" stroke="#4E2A14" stroke-width="1.1"/><path d="M-5.6 -23 C-5 -30 5 -30 5.6 -23 C2 -26 -2 -26 -5.6 -23Z" fill="#2A1A10"/><circle cx="1" cy="-22" r=".9" fill="#12121A"/><circle cx="3.6" cy="-22" r=".9" fill="#12121A"/><path d="M.6 -19.4 q1.6 1.2 3.2 0" stroke="#4E2A14" stroke-width=".7" fill="none"/><path d="M5 -8 L14 -12" stroke="url(#niPele2)" stroke-width="3" stroke-linecap="round"/><path d="M-6 -27 C-6 -32 6 -32 6 -27Z" fill="#F6F2E8" stroke="#8A8270" stroke-width=".8"/></g>
      <rect x="-80" y="-130" width="150" height="160" fill="transparent"/>
    </g></g>${'' }<g id="ni-faluca-hint">${brilhoHotspot(540, 206)}</g></g>
    <!-- nilômetro: escada de pedra descendo para o rio -->
    <g id="ni-nilometro" class="toque">
      ${ESCADA.fundo}
      ${ESCADA.degraus}
      <g clip-path="url(#niPocoC)">
        <g id="ni-poco-agua" style="transition:transform 2s ease-in-out"><rect id="ni-poco-cor" x="640" y="${NIVEIS[0]}" width="200" height="140" fill="#3E9EC4" opacity=".86" style="transition:fill 1.6s"/><path d="M640 ${NIVEIS[0]} h200" stroke="#FFFFFF" stroke-width="2.4"/><path d="M700 ${NIVEIS[0] + 7} q8 -2 16 0 M744 ${NIVEIS[0] + 12} q8 -2 16 0 M770 ${NIVEIS[0] + 5} q8 -2 16 0" stroke="#CFEFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
      </g>
      ${ESCADA.sombra}
      ${ESCADA.mureta}
      <path d="${(() => { let d = ''; for (let i = 0; i <= 10; i++) { const t = i / 10, p = EP(t), q = 34 - 26 * t; d += `${i ? 'L' : 'M'}${(p.xl - 1 - q * .35).toFixed(1)} ${(p.y + q).toFixed(1)} `; } return d; })()}" stroke="#E6F8FF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="685" cy="492" rx="18" ry="3.4" fill="#0E3A5A" opacity=".3"/>
      <rect x="676" y="362" width="18" height="130" fill="url(#niColuna)" stroke="#5A3A1E" stroke-width="1.4"/>
      <path d="M672 354 h26 v8 h-26Z" fill="#E8CCA0" stroke="#5A3A1E" stroke-width="1.3"/><path d="M674 356 h22" stroke="#FFF4DE" stroke-width="1.4"/>
      <path d="M679.5 366 V488" stroke="#FFF0D6" stroke-width="1.6" opacity=".8"/><path d="M691 366 V488" stroke="#6E4A2A" stroke-width="1.8" opacity=".45"/>
      ${Array.from({ length:9 }, (_, i) => { const y = 372 + i * 14, L = i % 2 ? 8 : 15; return `<path d="M676 ${y} h${L}" stroke="#3E2410" stroke-width="1.8"/><path d="M676 ${y + 1.6} h${L}" stroke="#FFF0D6" stroke-width="1" opacity=".85"/>${i % 2 ? '' : `<path d="M687 ${y - 5.4} l2 2.7 l-2 2.7 l-2 -2.7Z" fill="none" stroke="#3E2410" stroke-width=".9"/>`}`; }).join('')}
      <path d="M676 488 q9 -3 18 0" stroke="#E6F8FF" stroke-width="1.6" fill="none"/>
      <g>${[[NIVEIS[1], '#E5A23A'], [NIVEIS[2], '#7AC04A'], [NIVEIS[3], '#2E9E5A']].map(([y, c]) => `<path d="M674 ${y} l-8 -5 v10Z" fill="${c}" stroke="#4E2E14" stroke-width="1"/>`).join('')}</g>
      <g id="ni-nilo-hint" style="display:none">${brilhoHotspot(790, 330)}</g>
    </g>
    <!-- vila de adobe -->
    <g id="ni-vila">
      ${palmeira(34, 278, 92, 1.15, '#5AA642', '#3E8A30', 1)}${palmeira(148, 252, 76, .95, '#6AB448', '#4A9638', -1)}${palmeira(250, 246, 70, .85, '#5AA642', '#3E8A30', 1)}
      <g>
        ${casa(54, 252, 40, 26, '#2E7BF6', '#F2C83A', '')}${casa(98, 248, 34, 24, '#E5392C', '#1FA8A0', domo(115, 224, 9))}${casa(206, 250, 40, 26, '#1FA8A0', '#E5392C', '')}
      </g>
      <ellipse cx="300" cy="294" rx="36" ry="5" fill="#1E3A12" opacity=".25"/><path d="M296 294 C296 282 294 272 290 264 M298 284 C304 274 310 268 318 262" stroke="#5A3A1E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M296 294 C296 282 294 272 290 264" stroke="#9A6A3E" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="${copa(300, 246, 38, 26, 13, .25)}" fill="#2E6A3A" stroke="#173A1E" stroke-width="1.6"/><path d="${copa(306, 238, 28, 18, 11, .25)}" fill="#4A8A4A" stroke="#1E4A26" stroke-width="1.1"/><path d="${copa(314, 230, 15, 9, 8, .3)}" fill="#7AB866"/>
      <g fill="#C8A04A">${[[282, 252], [314, 254], [298, 260], [326, 242], [290, 238]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
      <path d="M0 304 C40 290 120 284 200 286 C262 288 312 294 344 304 V318 H0Z" fill="url(#niMonte2)"/><path d="M0 304 C40 290 120 284 200 286 C262 288 312 294 344 304" stroke="#E8C890" stroke-width="2" fill="none"/>
      ${casa(2, 302, 64, 50, '#2E7BF6', '#F2C83A', domo(48, 252, 12))}${toldo(2, 64, 272)}
      ${casa(74, 296, 76, 62, '#1FA8A0', '#F2C83A', `<g transform="translate(138 232)"><path d="M0 6 v-6" stroke="#5A5A6A" stroke-width="1.4"/><ellipse cx="0" cy="-3" rx="8" ry="5.6" transform="rotate(-24)" fill="#F4F6FA" stroke="#5A6070" stroke-width="1.2"/><circle cx="2" cy="-6" r="1.2" fill="#5A6070"/></g>${escadaTeto(126, 296, 62)}${varal(80, 116, 226)}`)}
      ${pombal(166, 294, 86)}
      ${casa(188, 300, 66, 48, '#E5392C', '#1FA8A0', `${domo(236, 252, 11)}<g stroke="#8A6A2A" stroke-width="1.3" stroke-linecap="round"><path d="M194 249 l20 -4 M195 247 l20 -5 M196 250 l19 -3"/></g><path d="M192 250 q14 -8 26 -4 l-2 4Z" fill="#C8A85A" stroke="#7A5A22" stroke-width=".8"/>`)}
      <path d="M256 304 h46 v-16 h-46Z" fill="url(#niAdobe)" stroke="#8A5A32" stroke-width="1.4"/><path d="M258 290 h42" stroke="#F8DCB0" stroke-width="1.2"/><path d="M256 306 l-12 3 h46 l12 -3Z" fill="#3A2410" opacity=".18"/>
      ${zir(70, 308)}
      <g id="ni-poupa" class="toque" transform="translate(280 288)"><g id="ni-poupa-in">
        <g id="ni-crista" style="transform-origin:8px -12px;transition:transform .3s cubic-bezier(.3,1.6,.5,1);transform:scale(.55)"><path d="M6 -12 l-8 -10 l6 2 l-2 -9 l6 6 l2 -9 l3 8 l5 -7 l-1 9 l5 -3 l-6 12Z" fill="#F0A060" stroke="#7A3E14" stroke-width="1"/><path d="M-1 -21 l2 2 M3 -27 l1 3 M9 -28 l0 3 M14 -24 l-1 3" stroke="#1A1A22" stroke-width="2.2" stroke-linecap="round"/></g>
        <path d="M-12 0 C-12 -8 0 -10 6 -6 C10 -2 8 2 0 2 C-6 2 -10 2 -12 0Z" fill="#E8A070" stroke="#7A3E14" stroke-width="1.2"/>
        <path d="M-12 -2 C-16 -2 -20 0 -22 2 C-18 4 -14 2 -10 2Z" fill="#1A1A22"/>
        <path d="M-8 -6 l-3 6 M-4 -7 l-2 7 M0 -7 l-1 7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M-8 -6 l-3 6 M-4 -7 l-2 7 M0 -7 l-1 7" stroke="#1A1A22" stroke-width="1" stroke-linecap="round" transform="translate(1.6 0)"/>
        <circle cx="8" cy="-10" r="5" fill="#F0A870" stroke="#7A3E14" stroke-width="1.1"/><circle cx="9.6" cy="-11" r="1.4" fill="#12121A"/><circle cx="10" cy="-11.5" r=".5" fill="#fff"/>
        <path d="M12 -9 q8 2 12 8" stroke="#2A1A10" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </g><rect x="-24" y="-32" width="50" height="38" fill="transparent"/></g>
      <g id="ni-arvore" class="toque"><rect x="262" y="218" width="76" height="56" fill="transparent"/></g>
      <g id="ni-palmeira-alvo" class="toque"><rect x="108" y="154" width="54" height="44" fill="transparent"/></g>
    </g>
    <!-- campos -->
    <g id="ni-campos">
      ${CANT.map(c => `<path d="${cantPath(c, -9)}" fill="url(#niDique)" stroke="#5E3E1E" stroke-width="1.4" stroke-linejoin="round"/><path d="M${c[0] - 8} ${Y0 - 5} H${c[1] + 8}" stroke="#F6DCAC" stroke-width="2" stroke-linecap="round"/><path d="M${c[2] - 9} ${Y1 + 3.4} H${c[3] + 9}" stroke="#F2D8A8" stroke-width="1.6" stroke-linecap="round"/><path d="M${c[0] - 7} ${Y0 - 3} L${c[2] - 8} ${Y1 + 2}" stroke="#F8E2B8" stroke-width="1.2" opacity=".7"/>`).join('')}
      <g fill="#7A5430" opacity=".55">${Array.from({ length:70 }, () => { const k = Math.floor(R(0, 3)), c = CANT[k], q = R(0, 1), y = Y0 - 4 + q * (Y1 - Y0 + 6); const xl = c[0] + (c[2] - c[0]) * q - 6, xr = c[1] + (c[3] - c[1]) * q + 6, x = R(0, 1) < .5 ? xl + R(-2, 1) : xr + R(-1, 2); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${R(1, 2.2).toFixed(1)}" ry="${R(.6, 1.2).toFixed(1)}"/>`; }).join('')}</g>
      ${CANT.map((c, i) => `<g class="ni-cant" data-i="${i}">
        <path class="ni-seco" d="${cantPath(c)}" fill="url(#niSeco)" stroke="#9A7444" stroke-width="1.6"/>
        <g class="ni-seco" clip-path="url(#niCantC${i})">${sulcos(c, '#9A7040', 2.2, .5)}<g transform="translate(1.6 0)">${sulcos(c, '#FAE6B8', 1, .6)}</g>${rachas(c)}${torroes(c, '#D8B47A', '#8A6438', '#FAE8C0', 26)}</g>
        <g class="ni-lama" style="opacity:0;transition:opacity 2s"><path d="${cantPath(c)}" fill="url(#niLama)" stroke="#1E1410" stroke-width="1.6"/>${ondulas(c, '#5E4A3C', 1.3, .85)}<path d="${cantPath(c, 10)}" fill="none" stroke="#8A7A6E" stroke-width="1" opacity=".35"/><g clip-path="url(#niCantC${i})">${torroes(c, '#3A2C22', '#1A1210', '#9A8A7A', 18)}<path d="${cantPath(c)}" fill="url(#niReflexo)" opacity=".6"/></g><g fill="#C8B8A8" opacity=".22">${[[.3, .25], [.62, .5], [.22, .72], [.74, .86], [.5, .14], [.4, .55], [.82, .3]].map(([qx, qy]) => { const yy = Y0 + (Y1 - Y0) * qy, xl = c[0] + (c[2] - c[0]) * qy, xr = c[1] + (c[3] - c[1]) * qy, xx = xl + (xr - xl) * qx; return `<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(5 + qy * 6).toFixed(1)}" ry="${(1.6 + qy).toFixed(1)}"/>`; }).join('')}</g></g>
        <g class="ni-molha" style="opacity:0;transition:opacity 1.4s"><path d="${cantPath(c)}" fill="url(#niMolhado)" stroke="#120C0A" stroke-width="1.6"/><path d="${cantPath(c, 6)}" fill="#5EA8D0" opacity=".28"/>${sulcos(c, '#8ED0F0', 1.6, .55)}<path d="${cantPath(c)}" fill="url(#niReflexo)"/><g fill="none" stroke="#E6F8FF" stroke-width="1.2" opacity=".55">${[[.3, .3], [.7, .55], [.45, .8]].map(([qx, qy]) => { const [x, y] = dentro(c, qx, qy); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(8 + qy * 8).toFixed(1)}" ry="${(2 + qy * 2).toFixed(1)}"/>`; }).join('')}</g></g>
        <g class="ni-brotos" style="opacity:0;transition:opacity 1s">${fileira(c, (x, y, s) => broto(x, y, s))}</g>
        <g class="ni-maduro" style="opacity:0;transition:opacity 2s"><path d="${cantPath(c)}" fill="${i === 0 ? 'url(#niOuro)' : 'url(#niVerdeC)'}" stroke="${i === 0 ? '#8A6A1E' : '#2E6A22'}" stroke-width="1.6" opacity=".9"/>${fileira(c, (x, y, s) => MADURO[i](x, y, s))}</g>
        <path d="M${c[2]} ${Y1} L${c[0]} ${Y0} L${c[1]} ${Y0}" clip-path="url(#niCantC${i})" stroke="#2A1808" stroke-width="7" fill="none" opacity=".22"/>
      </g>`).join('')}
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
        <path d="M-4 0 L22 -6 L30 -4 L6 2Z" fill="#2A1A0A" opacity=".2"/><ellipse cx="0" cy="0" rx="14" ry="3" fill="#2A1A0A" opacity=".3"/>
        <path d="M-5 -2 v-10 M5 -2 v-10" stroke="#8A5530" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M-12 -44 C-15 -34 -17 -22 -16 -10 C-6 -7 6 -7 16 -10 C17 -22 15 -34 12 -44 C6 -48 -6 -48 -12 -44Z" fill="url(#niGalab)" stroke="#2E4A6E" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M-6 -40 C-8 -30 -9 -20 -9 -10 M4 -38 C5 -28 6 -20 7 -10 M-1 -30 C-1 -22 0 -16 0 -9" stroke="#4E78A8" stroke-width="1.1" fill="none" opacity=".7"/>
        <path d="M-10 -40 C-12 -30 -13 -20 -12 -12" stroke="#DCEEFA" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M-4 -46 L0 -38 L4 -46" fill="#7AA8D4" stroke="#2E4A6E" stroke-width="1"/>
        <path d="M-11 -42 C-17 -34 -18 -26 -15 -20" stroke="#2E4A6E" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="M-11 -42 C-17 -34 -18 -26 -15 -20" stroke="#8CB8E0" stroke-width="5.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="-14.6" cy="-18.4" rx="2.8" ry="3.2" fill="url(#niPele1)" stroke="#4E2A14" stroke-width=".9"/>
        <path d="M-9 -1 h6 M3 -1 h6" stroke="#6E4020" stroke-width="2.6" stroke-linecap="round"/>
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
        <rect x="-14" y="-70" width="28" height="72" fill="transparent"/>
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
      <g id="ni-nuri-pos"><g id="ni-nuri-in"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><svg x="639" y="292" width="86" height="72" viewBox="0 0 120 100"><use href="#f-martim"/></svg></g></g></g>
      ${brilhoHotspot(722, 300)}
      <rect x="641" y="292" width="84" height="64" fill="transparent"/>
    </g>
    <!-- nuvens de chuva sobre as montanhas -->
    ${NUV.map((n, i) => `<g class="ni-nuvem toque" data-i="${i}"><g transform="translate(${n.x} ${n.y}) scale(${n.s})">
      <path class="ni-veu" d="M-44 24 C-46 60 -54 90 -60 ${(196 - n.y) / n.s} H52 C46 90 42 60 40 24Z" fill="url(#niVeu)" style="opacity:0;transition:opacity 1s" pointer-events="none"/>
      <g class="ni-nuv-in" style="animation:flutua ${(3 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${nuvemVol()}
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
    ${papiroMini(774, 506, 1.7)}
    <rect width="800" height="500" fill="url(#niLuz)" pointer-events="none"/><rect width="800" height="500" fill="url(#niVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#niGrao)" pointer-events="none"/>
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
    el(g, '.ni-nuv-esc').style.opacity = .55; const veu = el(g, '.ni-veu'); veu.style.opacity = 1; depois(3600, () => veu.style.opacity = .25); el(g, '.ni-nuv-hint').style.display = 'none';
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
    const pN = EP((NIVEIS[nivel] - 300) / 196); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:pN.xl + (pN.xr - pN.xl) * (k + .5) / 4, y:NIVEIS[nivel], t:k * 2, cor:'#E8C8A0' });
    c.brilhos((pN.xl + pN.xr) / 2, NIVEIS[nivel] - 8, 5, '#FFE27A');
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
    let hx, hy; if (yaw > .9) { hx = PIV.x + 66 * Math.cos(r); hy = PIV.y + 66 * Math.sin(r); } else { hx = FX + 18 * FK; hy = FY - 28 * FK; }
    let lx = (hx - FX) / FK - 9, ly = (hy - FY) / FK + 42; const LL = Math.hypot(lx, ly), MX = 34; if (LL > MX) { lx *= MX / LL; ly *= MX / LL; }
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
  let fx = 512, fy = 248, fe = .42;
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
    const a = np.animate([{ transform:'translate(0,0)' }, { transform:'translate(-28px,-34px)' }, { transform:'translate(-32px,-38px)' }, { transform:'translate(-28px,-34px)' }, { transform:'translate(-85px,112px)' }, { transform:'translate(-85px,112px)' }, { transform:'translate(0,0)' }], { duration:3200, easing:'ease-in-out' });
    depois(1900, () => { toca('splash'); for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:600 + sorte(-10, 10), y:440, t:k, cor:'#E6F6FF' }); });
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
    for (let k = 0; k < 4; k++) c.add({ tipo:'semente', x:146 + sorte(-8, 8), y:184 + sorte(-4, 4), vy:sorte(-1, 0), alvoY:250 + sorte(-2, 2) });
    api.diz('Tâmaras! As tamareiras crescem bem no calor, perto da água do rio.'); });
  el(s, '#ni-agricultor').addEventListener('click', e => { e.stopPropagation(); if (fase === 'shaduf') return; toca('pop'); api.diz('O agricultor conhece o rio e sabe a hora certa de plantar e colher.'); });
  el(s, '#ni-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(694, 62, 6, '#FFE27A'); api.diz('No Egito quase nunca chove. O sol é forte e o deserto é seco.'); });
  api.hud('<span class="chip">Cheia: 0/3</span>');
  api.diz('Oi, eu sou o Nuri, um martim-pescador do Rio Nilo! Aqui quase não chove. Toque nas nuvens das montanhas, lá longe!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
