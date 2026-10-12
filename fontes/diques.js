/* ================= JOGO 10: Terra dos diques, morar abaixo do mar ================= */
function jogoDiques(palco, api){
  semente = 113;
  const SUP = 384, CR = 280, NB = 302, NOTCH = [166, 204, 242], CAN = 370, HX = 525, HY = 262, HOR = 300;
  const MAR0 = 368, MAR_ESPERA = 310, MAR_ALTO = 296, AREIA = 360, PLZ = 468, RUA = 392;
  /* face do dique voltada para o mar: do pé (56,452) até o ombro (138,288) */
  const faceX = y => 56 + (452 - y) / 164 * 82;
  const baseY = x => 456 - (x - 56) * .2162;
  let vivo = true, fase = 'mare', marY = MAR0, alvoMar = MAR_ESPERA, postos = 0, ocupado = false, vel = 0, ang = 0, seco = 0, filasAbertas = 0, chuvas = 0, chovendo = false, praca = PLZ;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const BLOCOS = [
    { tipo:'argila', x:417, y:350 },
    { tipo:'pedra', x:440, y:350 },
    { tipo:'grama', x:463, y:350 }
  ];
  const FILAS = [
    { y:311, k:.5, cores:['#E5392C', '#FFC83D', '#FF8AB8', '#B57BFF'] },
    { y:320, k:.6, cores:['#FFC83D', '#FF8A3A', '#E5392C', '#FFFFFF'] },
    { y:331, k:.72, cores:['#FF8AB8', '#B57BFF', '#FFC83D', '#E5392C'] },
    { y:343, k:.86, cores:['#FF8A3A', '#E5392C', '#FF8AB8', '#FFC83D'] },
    { y:357, k:1, cores:['#B57BFF', '#FFFFFF', '#FF8A3A', '#FF8AB8'] },
    { y:373, k:1.16, cores:['#E5392C', '#FF8AB8', '#FFC83D', '#B57BFF'] }
  ];
  const escuro = c => ({ '#E5392C':'#7A1410', '#FFC83D':'#A86A08', '#FF8AB8':'#9A2E5E', '#B57BFF':'#5A2E9A', '#FF8A3A':'#A8441A', '#FFFFFF':'#8A8AA0' }[c] || '#333');
  const F = n => n.toFixed(1);
  /* desenhos */
  const bloco = tipo => ({
    argila:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArg)" stroke="#4E3424" stroke-width="1.6"/><rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArgP)"/><path d="M-9 -4 q5 -3 10 0 t8 0 M-8 5 q5 -3 10 0 t7 0" stroke="#C9A486" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/><path d="M-10 -9 h12" stroke="#E2C2A2" stroke-width="2" stroke-linecap="round" opacity=".8"/>',
    pedra:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="#6E6E7E" stroke="#34343E" stroke-width="1.6"/><path d="M-12 -11 h11 v10 h-11Z M1 -11 h11 v7 h-11Z M-12 1 h7 v10 h-7Z M-3 1 h15 v10 h-15Z M1 -2 h11" fill="url(#dqPedra)" stroke="#34343E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-10 -9 h7 M3 -9 h6" stroke="#E2E2EC" stroke-width="1.6" stroke-linecap="round"/>',
    grama:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArg)" stroke="#4E3424" stroke-width="1.6"/><path d="M-13 -4 V-9 Q-13 -12 -10 -12 H10 Q13 -12 13 -9 V-4Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.4"/><path d="M-10 -11 l-1 -5 M-6 -11 l1 -6 M-2 -11 l-1 -5 M2 -11 l1 -6 M6 -11 l-1 -5 M10 -11 l1 -5" stroke="#3E8A2A" stroke-width="1.6" stroke-linecap="round"/><path d="M-8 3 l2 4 M4 1 l-1 4 M-1 6 l3 2" stroke="#8A6A4E" stroke-width="1.2" stroke-linecap="round"/>'
  })[tipo];
  const ovelha = (x, y, s, vira) => `<g transform="translate(${x} ${y}) scale(${vira ? -s : s} ${s})"><ellipse cx="2" cy="12.5" rx="15" ry="2.6" fill="#1E3A12" opacity=".25"/><path d="M-8 4 v8 M-3 5 v7 M4 5 v7 M8 4 v8" stroke="#3A3A40" stroke-width="2.4" stroke-linecap="round"/><path d="${copa(0, -1, 13, 8, 9, .3)}" fill="#F8F6EE" stroke="#A8A496" stroke-width="1.4"/><path d="M-6 -6 q4 -3 9 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="-4" rx="5.4" ry="4.4" fill="#3A3A40" stroke="#1A1A20" stroke-width="1"/><path d="M11 -8 l-4 -2" stroke="#3A3A40" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="-5" r="1.1" fill="#fff"/></g>`;
  const pato = (x, y, s, filhote) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="1" rx="10" ry="2" fill="#E6F6FF" opacity=".55"/><path d="M-9 -2 C-10 -8 -4 -9 2 -8 C6 -8 9 -6 8 -2 C6 1 -6 1 -9 -2Z" fill="${filhote ? '#FFD447' : '#A88A6A'}" stroke="${filhote ? '#A87A08' : '#4E3A24'}" stroke-width="1.2"/><path d="M-4 -5 q4 -2 8 0" stroke="${filhote ? '#FFF3B0' : '#E6D6C0'}" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="6" cy="-11" r="4.4" fill="${filhote ? '#FFD447' : '#2E7A4A'}" stroke="${filhote ? '#A87A08' : '#1E4A2E'}" stroke-width="1.1"/><path d="M10 -11 l5 1 l-5 1.6Z" fill="#FF9A3A" stroke="#A8541A" stroke-width=".7"/><circle cx="7.4" cy="-12" r="1" fill="#12121A"/><circle cx="7.8" cy="-12.4" r=".4" fill="#fff"/>${filhote ? '' : '<path d="M2 -8 h6" stroke="#fff" stroke-width="1.2"/>'}</g>`;
  const bici = (x, y, cor) => `<g transform="translate(${x} ${y})"><circle cx="-9" cy="-6" r="6" fill="none" stroke="#2A2A34" stroke-width="1.8"/><circle cx="9" cy="-6" r="6" fill="none" stroke="#2A2A34" stroke-width="1.8"/><path d="M-9 -6 L-3 -14 H7 L9 -6 M-3 -14 L1 -6 L7 -14 M-4 -17 h4 M7 -14 l1 -5 h3" stroke="${cor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 -19 h5 v4 h-5Z" fill="#C9A06A" stroke="#6E4A2A" stroke-width=".8"/><circle cx="1" cy="-6" r="1.4" fill="#2A2A34"/></g>`;
  const crianca = (x, y, pele, roupa, cabelo, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-3 0 v-8 M3 0 v-8" stroke="#2E3A6A" stroke-width="3" stroke-linecap="round"/><path d="M-6 -8 C-6 -18 6 -18 6 -8Z" fill="${roupa}" stroke="#12235A" stroke-width="1"/><path d="M-6 -14 l-4 -5 M6 -14 l4 -5" stroke="${pele}" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="-22" r="5" fill="${pele}" stroke="#4E2E14" stroke-width="1"/><path d="M-5 -23 C-5 -29 5 -29 5 -23 C3 -26 -3 -26 -5 -23Z" fill="${cabelo}"/><circle cx="-1.8" cy="-22" r=".8" fill="#12121A"/><circle cx="1.8" cy="-22" r=".8" fill="#12121A"/><path d="M-1.6 -19.6 q1.6 1.4 3.2 0" stroke="#7A2A10" stroke-width=".9" fill="none"/></g>`;
  /* janela com moldura branca, verga, peitoril e reflexo; arco opcional */
  const janela = (x, y, w, h, moldura, arco) => `<path d="M${x - 1.6} ${y + h + 1} h${w + 3.2} v2.2 h-${w + 3.2}Z" fill="${moldura}" stroke="#3E2A1E" stroke-width=".6"/>${arco ? `<path d="M${x - 1.5} ${y + 1} a${w / 2 + 1.5} ${w / 2 + 1.5} 0 0 1 ${w + 3} 0" fill="none" stroke="${arco}" stroke-width="2.6"/>` : `<path d="M${x - 1.6} ${y - 3} h${w + 3.2} v2.4 h-${w + 3.2}Z" fill="${moldura}" stroke="#3E2A1E" stroke-width=".6"/>`}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#dqVidro)" stroke="${moldura}" stroke-width="1.8"/><path d="M${x} ${y + h * .45} H${x + w} M${x + w / 2} ${y} V${y + h}" stroke="${moldura}" stroke-width="1.1"/><path d="M${x + 1.6} ${y + 4} l3 -2.2 M${x + w / 2 + 1.6} ${y + h * .45 + 4} l2.4 -1.8" stroke="#fff" stroke-width="1" opacity=".85" stroke-linecap="round"/>`;
  const floreira = (x, y, w, cores) => `<rect x="${x}" y="${y}" width="${w}" height="3.4" rx="1" fill="#7A4A2A" stroke="#3E2414" stroke-width=".7"/><g stroke="#2E6A22" stroke-width=".6">${Array.from({ length:Math.round(w / 3.2) }, (_, i) => `<circle cx="${F(x + 1.6 + i * 3.2)}" cy="${F(y - .6 - (i % 2) * 1.2)}" r="1.5" fill="${cores[i % cores.length]}"/>`).join('')}</g>`;
  const ancoras = pts => `<g stroke="#2A2220" stroke-width="1.1" fill="none" stroke-linecap="round">${pts.map(([x, y]) => `<path d="M${x - 2.4} ${y - 1.4} q2.4 2.8 4.8 0 M${x} ${y - 2} v4"/>`).join('')}</g>`;
  /* fileiras de tulipas: faixa de cor (vista de longe) + flores na frente */
  const filaSvg = (f, i) => { let hastes = '', copos = ''; const passo = 11 * f.k;
    for (let x = 252 + (i % 2) * passo / 2; x < 800; x += passo) { const h = 6.5 * f.k, r = 3.3 * f.k;
      hastes += `M${x.toFixed(1)} ${f.y} v${(-h).toFixed(1)} `;
      copos += `M${(x - r).toFixed(1)} ${(f.y - h).toFixed(1)} q0 ${(-r * 1.8).toFixed(1)} ${(r * .6).toFixed(1)} ${(-r * 1.6).toFixed(1)} l${(r * .4).toFixed(1)} ${(r * .7).toFixed(1)} l${(r * .4).toFixed(1)} ${(-r * .7).toFixed(1)} q${(r * .6).toFixed(1)} ${(r * .2).toFixed(1)} ${(r * .6).toFixed(1)} ${(r * 1.6).toFixed(1)}Z `; }
    const fy = f.y - 6.5 * f.k;
    return `<g class="dq-fila toque" data-i="${i}" data-c="0"><g class="dq-fila-in" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1)"><path d="M250 ${F(f.y + 1.6 * f.k)} V${F(f.y - 3 * f.k)} H800 V${F(f.y + 1.6 * f.k)}Z" fill="#3E8A2A"/><path d="M250 ${F(f.y - 3 * f.k)} H800" stroke="#7CC25A" stroke-width="${F(1.4 * f.k)}" opacity=".8"/><path class="dq-faixa" d="M250 ${F(fy + .6 * f.k)} V${F(fy - 4.6 * f.k)} H800 V${F(fy + .6 * f.k)}Z" fill="${f.cores[0]}" opacity=".78"/><path d="${hastes}" stroke="#2E7A22" stroke-width="${(1.3 * f.k).toFixed(1)}" fill="none"/><path class="dq-copos" d="${copos}" fill="${f.cores[0]}" stroke="${escuro(f.cores[0])}" stroke-width="${(.7 * f.k).toFixed(2)}" stroke-linejoin="round"/></g><rect x="250" y="${(f.y - 10 * f.k).toFixed(1)}" width="550" height="${(10 * f.k).toFixed(1)}" fill="transparent"/></g>`; };
  /* pás do moinho: varão de madeira, grade branca e vela de lona */
  const L = 78;
  const pas = [0, 90, 180, 270].map(a => `<g transform="rotate(${a} ${HX} ${HY})"><path d="M${HX} ${HY} L${HX} ${HY - L}" stroke="#3E1A0E" stroke-width="5.4" stroke-linecap="round"/><path d="M${HX} ${HY} L${HX} ${HY - L}" stroke="url(#dqVarao)" stroke-width="3" stroke-linecap="round"/><path d="M${HX + 2.4} ${HY - 14} V${HY - L + 2} H${HX + 17} V${HY - 14}Z" fill="#5E2A1A" opacity=".18"/><path d="M${HX + 2.4} ${HY - 15} V${HY - L + 3} Q${HX + 10} ${HY - L + 6} ${HX + 16} ${HY - L + 3} V${HY - 15} Q${HX + 10} ${HY - 18} ${HX + 2.4} ${HY - 15}Z" fill="url(#dqVela)" stroke="#8E3A22" stroke-width="1.3"/><path d="M${HX + 8} ${HY - 18} V${HY - L + 6} M${HX + 12.5} ${HY - 17} V${HY - L + 5}" stroke="#D6C6A8" stroke-width=".9" opacity=".8"/><g stroke="#FBF6EA" stroke-width="1.3">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => `<path d="M${HX + 1} ${HY - 16 - k * 7.4} H${HX + 17.5}"/>`).join('')}</g><path d="M${HX + 17.5} ${HY - 13} V${HY - L + 1}" stroke="#FBF6EA" stroke-width="2"/><path d="M${HX + 17.5} ${HY - 13} V${HY - L + 1}" stroke="#7A3A22" stroke-width=".7" opacity=".6"/><path d="M${HX - 2} ${HY - 16} L${HX - 2} ${HY - L + 4} L${HX - 6.5} ${HY - L + 4} L${HX - 6.5} ${HY - 16}Z" fill="#F2E8D6" stroke="#8E3A22" stroke-width="1"/></g>`).join('');
  /* pedras da proteção do dique, uma a uma */
  const pedras = (() => { const ux = .4472, uy = -.8944, nx = .8944, ny = .4472; let o = '', s0 = 1, k = 0;
    while (s0 < 150) { const w = R(10, 13.5), d = R(10.5, 13), cx = 56 + ux * (s0 + w / 2) + nx * (d / 2 + .6), cy = 452 + uy * (s0 + w / 2) + ny * (d / 2 + .6);
      const p = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [cx + ux * a * w / 2 + nx * b * d / 2 + R(-1, 1), cy + uy * a * w / 2 + ny * b * d / 2 + R(-1, 1)]);
      o += `<path d="M${p.map(q => F(q[0]) + ' ' + F(q[1])).join(' L')}Z" fill="url(#dqPd${k % 3})" stroke="#2E2E38" stroke-width="1.2" stroke-linejoin="round"/><path d="M${F(p[0][0] + ux * 1.6)} ${F(p[0][1] + uy * 1.6 + 1)} L${F(p[1][0] - ux * 1.6)} ${F(p[1][1] - uy * 1.6 + 1)}" stroke="#EEF0F8" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>`;
      s0 += w + R(.6, 1.6); k++; }
    let g = ''; for (let i = 0; i < 46; i++) { const s1 = R(4, 148), dd = R(14.5, 19); g += `<circle cx="${F(56 + ux * s1 + nx * dd)}" cy="${F(452 + uy * s1 + ny * dd)}" r="${F(R(.9, 1.9))}"/>`; }
    return `<g fill="#8A8A96" stroke="#4E4E5A" stroke-width=".5">${g}</g>${o}`; })();
  /* chão em corte */
  const linha = (x0, x1, yf, amp, passo) => { passo = passo || 30; let d = `M${x0} ${F(yf(x0))}`, i = 0;
    for (let x = x0; x < x1; x += passo, i++) { const xm = x + passo / 2, xe = Math.min(x1, x + passo); d += ` Q${F(xm)} ${F(yf(xm) + (i % 2 ? amp : -amp))} ${F(xe)} ${F(yf(xe))}`; }
    return d; };
  const camada = (yf, amp, fill, esc) => `<path d="${linha(0, 800, yf, amp)} V500 H0Z" fill="${fill}" stroke="${esc}" stroke-width="1.4"/>`;
  const topoTurfa = x => x < 352 ? Math.min(470, baseY(x) - 3) : SUP + 3, topoArgila = x => 446 + Math.max(0, 300 - x) * .06, topoAreia = x => 477 + Math.max(0, 300 - x) * .03;
  const DQ_TOPO = `M56 452 L138 288 Q141 281 148 280 H153 V${NB} H179 V${CR} H191 V${NB} H217 V${CR} H229 V${NB} H255 V${CR} H262 Q269 281 273 288 L328 370 Q334 380 352 388`;
  const DIQUE = `${DQ_TOPO} L352 392 L56 456Z`;
  const NUCLEO = `M86 449.5 L150 324 Q156 317 165 317 H236 Q245 317 250 324 L300 403.2Z`;
  const GRAMA = `M${F(faceX(318))} 318 L138 288 Q141 281 148 280 H153 M179 ${CR} H191 M217 ${CR} H229 M255 ${CR} H262 Q269 281 273 288 L328 370 Q334 380 352 388`;
  const PRACA = `M606 ${RUA} V410 H624 V428 H642 V446 H660 V${PLZ} H740 V446 H758 V428 H776 V410 H794 V${RUA}Z`;
  /* casinhas ao longe (névoa) */
  const longe = `<g opacity=".9">
      ${[[262, '#A9C9C0'], [300, '#B7CFB0'], [338, '#A6C3CC'], [372, '#B4CCA6'], [560, '#A9C6C8'], [592, '#B9CDB0']].map(([x, cor], i) => `<path d="${copa(x, HOR - 7 - (i % 2) * 2, 15, 9, 9, .25)}" fill="${cor}"/>`).join('')}
      ${[284, 352, 578].map(x => `<path d="M${x} ${HOR} V${HOR - 26}" stroke="#9AB0A8" stroke-width="1.6"/><path d="${copa(x, HOR - 28, 3.6, 9, 7, .2)}" fill="#A2BDB4"/>`).join('')}
      <g fill="#B9C9D0" stroke="#93A8B4" stroke-width=".8"><path d="M416 ${HOR} V${HOR - 12} L424 ${HOR - 18} L432 ${HOR - 12} V${HOR}Z"/><path d="M432 ${HOR} V${HOR - 9} H452 V${HOR}Z" fill="#C9B9B0"/><path d="M430 ${HOR - 9} L442 ${HOR - 15} L454 ${HOR - 9}Z" fill="#C49A90"/><path d="M466 ${HOR} V${HOR - 26} L470 ${HOR - 40} L474 ${HOR - 26} V${HOR}Z"/><path d="M460 ${HOR} V${HOR - 12} H480 V${HOR}Z"/></g>
      <g stroke="#E8EEF2" stroke-width="1.6" stroke-linecap="round" opacity=".95">${[[318, 34], [346, 28]].map(([x, h]) => `<path d="M${x} ${HOR} V${HOR - h}"/><g class="dq-turb" style="transform-box:view-box;transform-origin:${x}px ${HOR - h}px"><path d="M${x} ${HOR - h} l0 -12 M${x} ${HOR - h} l10.4 6 M${x} ${HOR - h} l-10.4 6" stroke-width="1.4"/></g>`).join('')}</g>
      <g stroke="#9AB4BC" fill="#B4C8CE" stroke-width=".9"><g transform="translate(405 ${HOR})"><path d="M-3 0 L-2 -15 H2 L3 0Z"/><path d="M0 -15 l-9 -9 M0 -15 l9 -9 M0 -15 l-9 9 M0 -15 l9 9" stroke-width="1.6" fill="none"/></g><g transform="translate(628 ${HOR - 1})"><path d="M-3 0 L-2 -14 H2 L3 0Z"/><path d="M0 -14 l-8 -8 M0 -14 l8 -8 M0 -14 l-8 8 M0 -14 l8 8" stroke-width="1.5" fill="none"/></g></g>
    </g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Terra dos diques: o mar mais alto que os campos, um dique com buracos, moinho, campo de tulipas, cidade com praça d'água, cegonha, foca, ovelha e patos">
    <defs>
      <linearGradient id="dqCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E9EE0"/><stop offset=".42" stop-color="#93CBF2"/><stop offset=".62" stop-color="#D6ECF8"/><stop offset=".75" stop-color="#FFF2DA"/><stop offset="1" stop-color="#FFE9C4"/></linearGradient>
      <radialGradient id="dqSolHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset=".4" stop-color="#FFE27A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
      <linearGradient id="dqNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F8FA" stop-opacity="0"/><stop offset=".7" stop-color="#EEF6F4" stop-opacity=".55"/><stop offset="1" stop-color="#EEF6F2" stop-opacity=".75"/></linearGradient>
      <linearGradient id="dqMar" gradientUnits="userSpaceOnUse" x1="0" y1="290" x2="0" y2="456"><stop offset="0" stop-color="#4FC2E6"/><stop offset=".22" stop-color="#2690C8"/><stop offset=".6" stop-color="#14609E"/><stop offset="1" stop-color="#0B3768"/></linearGradient>
      <linearGradient id="dqOnda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6EAFA"/><stop offset="1" stop-color="#4FB8E0" stop-opacity="0"/></linearGradient>
      <linearGradient id="dqRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6FAFF" stop-opacity=".3"/><stop offset="1" stop-color="#E6FAFF" stop-opacity="0"/></linearGradient>
      <linearGradient id="dqFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2C88E"/><stop offset="1" stop-color="#B0905E"/></linearGradient>
      <linearGradient id="dqBanco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAEABC"/><stop offset=".18" stop-color="#E8CE90"/><stop offset=".5" stop-color="#C9A86C"/><stop offset="1" stop-color="#9C7E50"/></linearGradient>
      <linearGradient id="dqDique" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9765A"/><stop offset=".5" stop-color="#8E5E44"/><stop offset="1" stop-color="#6A4230"/></linearGradient>
      <linearGradient id="dqNucleo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E0A8"/><stop offset=".55" stop-color="#E6C584"/><stop offset="1" stop-color="#C9A262"/></linearGradient>
      <pattern id="dqAreia" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#E2C48A"/><circle cx="4" cy="3" r="1.3" fill="#C9A066"/><circle cx="12" cy="8" r="1.1" fill="#C9A066"/><circle cx="9" cy="2" r=".8" fill="#F6E2B8"/><circle cx="2" cy="9" r=".9" fill="#F6E2B8"/></pattern>
      <pattern id="dqAreiaP" width="18" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="3" r="1.1" fill="#B88E52" opacity=".55"/><circle cx="12" cy="9" r=".9" fill="#B88E52" opacity=".5"/><circle cx="9" cy="2" r=".8" fill="#FFF6DA" opacity=".8"/><circle cx="2" cy="10" r=".7" fill="#FFF6DA" opacity=".7"/><circle cx="15" cy="4" r=".6" fill="#8E6A3A" opacity=".5"/></pattern>
      <pattern id="dqArgP" width="34" height="16" patternUnits="userSpaceOnUse"><path d="M2 5 q6 -3 12 0 t12 0 M10 13 q5 -2.4 10 0 t9 0" stroke="#5E3A26" stroke-width=".9" fill="none" opacity=".35"/><path d="M4 9 q4 -2 8 0" stroke="#D9AA88" stroke-width=".9" fill="none" opacity=".45"/><ellipse cx="27" cy="7" rx="1.6" ry="1.1" fill="#C9B6A6" opacity=".7"/><ellipse cx="17" cy="2" rx="1" ry=".7" fill="#4E2E1E" opacity=".4"/></pattern>
      <linearGradient id="dqGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6E27A"/><stop offset="1" stop-color="#4E9A3A"/></linearGradient>
      <linearGradient id="dqArg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8927A"/><stop offset="1" stop-color="#7E5E46"/></linearGradient>
      <linearGradient id="dqPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4B4C4"/><stop offset="1" stop-color="#76768A"/></linearGradient>
      <linearGradient id="dqPd0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8AABA"/><stop offset="1" stop-color="#5E6072"/></linearGradient>
      <linearGradient id="dqPd1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A968E"/><stop offset="1" stop-color="#5A564E"/></linearGradient>
      <linearGradient id="dqPd2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E98A8"/><stop offset="1" stop-color="#4A5262"/></linearGradient>
      <linearGradient id="dqCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6E2AA"/><stop offset=".35" stop-color="#9CCD78"/><stop offset="1" stop-color="#5EA43E"/></linearGradient>
      <linearGradient id="dqLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0AE88"/><stop offset=".4" stop-color="#8E8458"/><stop offset="1" stop-color="#5E4E30"/></linearGradient>
      <radialGradient id="dqPoca" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#F0FAFF"/><stop offset=".55" stop-color="#A8D6F0"/><stop offset="1" stop-color="#6A9EC2"/></radialGradient>
      <linearGradient id="dqCanal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AC8E2"/><stop offset=".45" stop-color="#3E8EB0"/><stop offset="1" stop-color="#1E5470"/></linearGradient>
      <linearGradient id="dqTurfa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A4630"/><stop offset=".6" stop-color="#4E3220"/><stop offset="1" stop-color="#3E2618"/></linearGradient>
      <pattern id="dqTurfaP" width="44" height="26" patternUnits="userSpaceOnUse"><path d="M3 4 q5 3 3 8 M20 2 q-3 5 1 9 q2 3 -1 6 M34 8 q4 3 2 9 M12 17 q4 2 6 7" stroke="#9A7656" stroke-width=".9" fill="none" opacity=".55"/><path d="M26 20 h7 M6 22 h5 M38 3 h4" stroke="#2E1A10" stroke-width="1.4" stroke-linecap="round" opacity=".45"/><circle cx="30" cy="14" r="1" fill="#C9A884" opacity=".4"/></pattern>
      <linearGradient id="dqArgSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8C86"/><stop offset="1" stop-color="#6A6862"/></linearGradient>
      <pattern id="dqSeixos" width="40" height="22" patternUnits="userSpaceOnUse"><ellipse cx="8" cy="6" rx="3" ry="1.8" fill="#B4B0A6" stroke="#5A5650" stroke-width=".6"/><ellipse cx="28" cy="15" rx="2.2" ry="1.4" fill="#A8A296" stroke="#5A5650" stroke-width=".6"/><path d="M16 12 q5 -2 10 0 M32 4 q3 -1.4 6 0" stroke="#A6A49C" stroke-width=".8" fill="none"/></pattern>
      <linearGradient id="dqPalha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5E5A40"/><stop offset=".3" stop-color="#8E8A62"/><stop offset=".5" stop-color="#ACA87C"/><stop offset=".72" stop-color="#86825C"/><stop offset="1" stop-color="#4E4A34"/></linearGradient>
      <linearGradient id="dqMuro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A8274"/><stop offset=".45" stop-color="#C6BCA6"/><stop offset="1" stop-color="#7A7264"/></linearGradient>
      <linearGradient id="dqVarao" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B86A3E"/><stop offset="1" stop-color="#7A3A1E"/></linearGradient>
      <linearGradient id="dqTijolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2704E"/><stop offset="1" stop-color="#8E3A26"/></linearGradient>
      <linearGradient id="dqTijolo2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94523E"/><stop offset="1" stop-color="#5A2C20"/></linearGradient>
      <pattern id="dqTijP" width="12" height="6" patternUnits="userSpaceOnUse"><path d="M0 .3 H12 M0 3.3 H12 M3 .3 V3.3 M9 3.3 V6.3" stroke="#3E1A10" stroke-width=".6" opacity=".35" fill="none"/><path d="M0 1 H12" stroke="#FFD2B8" stroke-width=".5" opacity=".18"/></pattern>
      <linearGradient id="dqOcre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6CE84"/><stop offset="1" stop-color="#C8904A"/></linearGradient>
      <linearGradient id="dqCinza" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A9A92"/><stop offset="1" stop-color="#46605E"/></linearGradient>
      <linearGradient id="dqMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2E8F2"/><stop offset="1" stop-color="#94B8CE"/></linearGradient>
      <linearGradient id="dqVela" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFBF2"/><stop offset=".6" stop-color="#F2E6D0"/><stop offset="1" stop-color="#D8C6A6"/></linearGradient>
      <linearGradient id="dqCapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5AAE78"/><stop offset="1" stop-color="#1E5A3A"/></linearGradient>
      <linearGradient id="dqVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDF4FF"/><stop offset=".5" stop-color="#8CBCE0"/><stop offset="1" stop-color="#3E6A9A"/></linearGradient>
      <linearGradient id="dqConcreto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8CCB8"/><stop offset="1" stop-color="#A69680"/></linearGradient>
      <pattern id="dqAzulejo" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#9A8C78"/><rect x=".5" y=".5" width="11" height="7" rx="1" fill="#D6C8B0"/><rect x="1.4" y="1.2" width="9" height="2" rx="1" fill="#E8DCC6" opacity=".8"/></pattern>
      <pattern id="dqMosaico" width="16" height="6" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#FF8A5A"/><rect x="4" width="4" height="3" fill="#FFD447"/><rect x="8" width="4" height="3" fill="#5AB8E6"/><rect x="12" width="4" height="3" fill="#7CCB5A"/><rect y="3" width="4" height="3" fill="#5AB8E6"/><rect x="4" y="3" width="4" height="3" fill="#FF8AB8"/><rect x="8" y="3" width="4" height="3" fill="#FFD447"/><rect x="12" y="3" width="4" height="3" fill="#FF8A5A"/><path d="M0 0 H16 M0 3 H16 M4 0 V6 M8 0 V6 M12 0 V6" stroke="#fff" stroke-width=".5"/></pattern>
      <pattern id="dqPavim" width="10" height="7" patternUnits="userSpaceOnUse"><rect width="10" height="7" fill="#B49A86"/><rect x=".5" y=".5" width="9" height="2.6" rx=".8" fill="#C9AE98"/><rect x="-4.5" y="3.9" width="9" height="2.6" rx=".8" fill="#C2A28C"/><rect x="5.5" y="3.9" width="9" height="2.6" rx=".8" fill="#CDB49E"/></pattern>
      <linearGradient id="dqAguaP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD0F2" stop-opacity=".95"/><stop offset="1" stop-color="#2E7BC6" stop-opacity=".95"/></linearGradient>
      <linearGradient id="dqCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E6A9A"/><stop offset="1" stop-color="#1E3A62"/></linearGradient>
      <linearGradient id="dqTeto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6DE74"/><stop offset="1" stop-color="#5E9A3E"/></linearGradient>
      <linearGradient id="dqRua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B4A2"/><stop offset="1" stop-color="#9A8270"/></linearGradient>
      <linearGradient id="dqFocaAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CBDE5" stop-opacity=".97"/><stop offset=".7" stop-color="#3AAADC" stop-opacity=".93"/><stop offset="1" stop-color="#2E9ED4" stop-opacity=".2"/></linearGradient>
      <radialGradient id="dqSolG" cx=".4" cy=".38" r=".6"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".55" stop-color="#FFD24D"/><stop offset="1" stop-color="#F5A81E"/></radialGradient>
      <clipPath id="dqMarClip"><path d="M0 0 H160 V280 L144 288 L62 452 V472 H0Z"/></clipPath>
      <linearGradient id="dqArcoF" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="320"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="dqArcoM" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="500"><rect width="800" height="500" fill="url(#dqArcoF)"/></mask>
      <clipPath id="dqPracaClip"><path d="${PRACA}"/></clipPath>
      <clipPath id="dqCampoClip"><rect x="250" y="${HOR}" width="550" height="${SUP - HOR + 2}"/></clipPath>
      <clipPath id="dqDiqueClip"><path d="${DIQUE}"/></clipPath>
      <radialGradient id="dqVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#0A1A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A3A" stop-opacity=".32"/></radialGradient>
      <filter id="dqGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
      <filter id="dqSombra" x="-10%" y="-10%" width="130%" height="130%"><feGaussianBlur stdDeviation="2.2"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#dqCeu)"/>
    <circle cx="70" cy="60" r="110" fill="url(#dqSolHalo)"/>
    <g id="dq-sol" class="toque"><circle cx="70" cy="60" r="50" fill="#FFE27A" opacity=".22"/><circle cx="70" cy="60" r="36" fill="#FFE27A" opacity=".3"/><circle cx="70" cy="60" r="25" fill="url(#dqSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M57 51 q8 -8 18 -8" stroke="#FFF6C8" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="70" cy="60" r="48" fill="transparent"/></g>
    <g opacity=".55"><use href="#nuvem" x="230" y="196" width="150" height="30" style="color:#fff"/><use href="#nuvem" x="560" y="214" width="130" height="24" style="color:#FFF6EA"/></g>
    <g class="deriva"><use href="#nuvem" x="180" y="34" width="120" height="58" style="color:#fff" opacity=".95"/><use href="#nuvem" x="196" y="52" width="80" height="34" style="color:#E6F0FA"/><use href="#nuvem" x="390" y="70" width="86" height="40" style="color:#fff" opacity=".85"/></g>
    <g id="dq-arco" mask="url(#dqArcoM)" style="opacity:0;transition:opacity 2.4s;pointer-events:none">${['#FF6B5A', '#FFB347', '#FFE27A', '#7CCB5A', '#5AAEFF', '#9A7BFF'].map((cor, i) => `<path d="M${330 + i * 7} 330 A${250 - i * 7} ${210 - i * 7} 0 0 1 ${830 - i * 7} 330" stroke="${cor}" stroke-width="7.4" fill="none" opacity=".55"/>`).join('')}</g>
    <g class="deriva" style="animation-duration:30s"><use href="#nuvem" x="640" y="120" width="96" height="44" style="color:#fff" opacity=".7"/><use href="#nuvem" x="20" y="150" width="70" height="32" style="color:#fff" opacity=".75"/></g>
    <g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="520" y="22" width="70" height="32" style="color:#fff" opacity=".8"/></g>
    <g class="deriva" style="animation-duration:20s"><g style="animation:flutua 2.4s ease-in-out infinite alternate">${[[330, 140, 1], [352, 152, .75], [300, 160, .6]].map(([x, y, k]) => `<path d="M${x} ${y} q${-8 * k} ${-7 * k} ${-16 * k} ${-2 * k} M${x} ${y} q${8 * k} ${-7 * k} ${16 * k} ${-2 * k}" stroke="#3E4A6A" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g></g>
    <!-- longe: árvores, igreja, moinhos e cata-ventos na névoa -->
    ${longe}
    <rect x="240" y="${HOR - 46}" width="560" height="48" fill="url(#dqNevoa)"/>
    <!-- o pôlder -->
    <path d="M250 ${HOR} C380 ${HOR - 2} 560 ${HOR + 1} 800 ${HOR - 1} V${SUP + 2} H250Z" fill="url(#dqCampo)"/>
    <g stroke="#4E8A36" stroke-width="1" opacity=".55">${FILAS.map(f => `<path d="M250 ${f.y + 1.5} H800"/>`).join('')}</g>
    <g>${[[324.5, 1.3], [348.5, 2]].map(([y, w]) => `<path d="M250 ${y} H800" stroke="#2E6A8E" stroke-width="${w + 1}"/><path d="M250 ${y} H800" stroke="#8ED4F0" stroke-width="${w}"/><path d="M250 ${y - w * .25} H800" stroke="#fff" stroke-width=".6" stroke-dasharray="14 22" opacity=".8"/>`).join('')}</g>
    <g id="dq-filas" clip-path="url(#dqCampoClip)">${FILAS.map(filaSvg).join('')}</g>
    <g id="dq-lama" clip-path="url(#dqCampoClip)" style="pointer-events:none"><path d="M250 ${HOR} C380 ${HOR - 2} 560 ${HOR + 1} 800 ${HOR - 1} V${SUP + 2} H250Z" fill="url(#dqLama)" opacity=".95"/>
      <g stroke="#3E2E1A" stroke-width="1.1" opacity=".5">${FILAS.map(f => `<path d="M250 ${f.y} H800"/>`).join('')}</g>
      <g stroke="#C6E0EC" stroke-width="1.2" opacity=".6">${[324.5, 348.5].map(y => `<path d="M250 ${y} H800"/>`).join('')}</g>
      ${[[300, 316, 16, 2.2], [372, 330, 20, 3], [440, 346, 26, 4.4], [560, 322, 18, 2.6], [620, 352, 30, 5], [690, 334, 22, 3.4], [760, 356, 26, 4.4], [480, 372, 22, 4.4], [600, 376, 28, 5], [720, 374, 16, 3.4], [350, 362, 22, 3.8], [520, 308, 14, 1.8]].map(([x, y, rx, ry]) => `<g class="dq-poca" style="transform-box:fill-box;transform-origin:50% 50%;transition:transform .6s"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dqPoca)" stroke="#4E6E8E" stroke-width="1"/><path d="M${x - rx * .5} ${y - ry * .3} h${rx * .5}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/></g>`).join('')}
      <g stroke="#6E8A3E" stroke-width="1.1">${Array.from({ length:40 }, () => { const x = R(254, 798), y = R(HOR + 6, 382); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-1 -4 M${x.toFixed(0)} ${y.toFixed(0)} l2 -4"/>`; }).join('')}</g></g>
    <path d="M250 ${HOR + 1} C380 ${HOR - 1} 560 ${HOR + 2} 800 ${HOR}" stroke="#EEF6E6" stroke-width="2" fill="none" opacity=".55"/>
    <!-- banco de areia e mar -->
    <path d="M-12 458 C-6 420 4 ${AREIA + 3} 28 ${AREIA} C50 ${AREIA - 3} 72 ${AREIA} 90 ${AREIA + 8} C104 ${AREIA + 22} 110 430 118 458Z" fill="url(#dqBanco)" stroke="#A8864E" stroke-width="1.8"/>
    <path d="M12 ${AREIA + 6} C24 ${AREIA + 1} 44 ${AREIA - 2} 70 ${AREIA + 2}" stroke="#FFF6DA" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M8 ${AREIA + 22} q8 -3 16 0 t16 0 t16 0 M14 ${AREIA + 36} q8 -3 16 0 t16 0 t16 0" stroke="#A8864E" stroke-width="1.1" fill="none" opacity=".55"/>
    <g fill="#FFE0C8" stroke="#B88A6A" stroke-width="1">${[[20, AREIA + 12], [62, AREIA + 8], [40, AREIA + 44]].map(([x, y]) => `<path d="M${x} ${y} c0 -6 9 -6 9 0Z"/><path d="M${x + 4.5} ${y - 4} v4" stroke-width=".6"/>`).join('')}</g>
    <g clip-path="url(#dqMarClip)"><rect id="dq-mar" x="0" y="${MAR0}" width="180" height="300" fill="url(#dqMar)" opacity=".9"/>
      <g id="dq-ondas" transform="translate(0 ${MAR0})">
        <path d="M0 2 L22 2 L40 150 L6 150Z M54 2 L70 2 L104 150 L74 150Z M108 2 L118 2 L146 150 L128 150Z" fill="url(#dqRaio)"/>
        <g id="dq-ondas-in2"><path d="M-40 3 ${Array.from({ length:12 }, () => 'q8 -4 16 0 q8 3 16 0').join(' ')} V14 H-40Z" fill="url(#dqOnda)" opacity=".55"/></g>
        <g id="dq-ondas-in"><path d="M-40 0 ${Array.from({ length:12 }, () => 'q10 -5 20 0').join(' ')} V8 H-40Z" fill="#8ADCF4" opacity=".85"/><path d="M-40 0 ${Array.from({ length:12 }, () => 'q10 -5 20 0').join(' ')}" stroke="#F2FBFF" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#fff" opacity=".9">${[6, 30, 52, 78, 104, 128].map((x, i) => `<ellipse cx="${x}" cy="${-2 + (i % 2)}" rx="3.4" ry="1.4"/>`).join('')}</g></g>
        <path d="M10 16 q8 2 16 0 M60 26 q8 2 16 0 M110 14 q8 2 16 0 M34 40 q8 2 16 0 M80 54 q8 2 16 0" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".6"/>
      </g>
      <g opacity=".75"><g style="animation:flutua 2.8s ease-in-out infinite alternate">${[[24, 414, 1], [44, 424, .8], [16, 432, .7]].map(([x, y, k]) => `<path d="M${x} ${y} c${4 * k} ${-4 * k} ${10 * k} ${-4 * k} ${13 * k} 0 c${-3 * k} ${4 * k} ${-9 * k} ${4 * k} ${-13 * k} 0Z M${x} ${y} l${-4 * k} ${-3 * k} v${6 * k}Z" fill="#0E3A66" stroke="#0A2A4E" stroke-width=".6"/><circle cx="${x + 10 * k}" cy="${y - .8 * k}" r="${.8 * k}" fill="#BFE6FF"/>`).join('')}</g></g>
    </g>
    <ellipse cx="46" cy="${AREIA + 2}" rx="32" ry="2.6" fill="#6E5430" opacity=".28"/>
    <g id="dq-foca" class="toque" data-fig="focacomum"><g id="dq-foca-pos"><g id="dq-foca-in"><svg x="4" y="${AREIA - 46}" width="84" height="50" viewBox="0 0 150 90"><use href="#f-focacomum"/></svg><g id="dq-foca-onda" style="opacity:0;transition:opacity .4s"><path d="M0 ${AREIA - 12} q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V${AREIA + 6} H0Z" fill="url(#dqFocaAgua)"/><path d="M0 ${AREIA - 12} q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#F2FBFF" stroke-width="2.4" fill="none" stroke-linecap="round"/></g></g></g>${brilhoHotspot(84, AREIA - 42)}</g>
    <!-- chão em corte: turfa, argila e areia -->
    <path d="${linha(0, 800, topoTurfa, 1.4)} V500 H0Z" fill="url(#dqTurfa)" stroke="#2E1A10" stroke-width="1.4"/>
    <path d="${linha(0, 800, topoTurfa, 1.4)} V500 H0Z" fill="url(#dqTurfaP)"/>
    <g stroke="#B08A62" stroke-width="1.1" fill="none" opacity=".5">${Array.from({ length:30 }, () => { const x = R(360, 796), y = R(392, 436); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${R(-6, 6).toFixed(0)} 5 ${R(-4, 4).toFixed(0)} ${R(8, 14).toFixed(0)}"/>`; }).join('')}</g>
    <path d="M0 450 Q16 446 32 450 T64 452 L66 462 Q34 470 0 472Z" fill="url(#dqFundo)" stroke="#A8864E" stroke-width="1.2"/>
    ${camada(topoArgila, 3, 'url(#dqArgSolo)', '#4E4C46')}<path d="${linha(0, 800, topoArgila, 3)} V500 H0Z" fill="url(#dqSeixos)"/>
    ${camada(topoAreia, 2.4, 'url(#dqNucleo)', '#A8885A')}<path d="${linha(0, 800, topoAreia, 2.4)} V500 H0Z" fill="url(#dqAreiaP)"/>
    <text x="566" y="430" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#F0DCC2" stroke="#2E1A10" stroke-opacity=".6" stroke-width="2.6" paint-order="stroke">turfa</text>
    <!-- algas na frente (mar) -->
    <g class="balanca" style="animation-duration:4.6s">${[[10, 474, 58, '#2E7A5A', '#6EC08A'], [22, 474, 44, '#3E6A2A', '#8EBA4E'], [34, 474, 50, '#2E7A5A', '#6EC08A']].map(([x, y, h, a, b]) => `<path d="M${x} ${y} q-6 -${h / 3} 1 -${h * .6} q6 -${h / 5} -1 -${h * .4}" stroke="${a}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-6 -${h / 3} 1 -${h * .6} q6 -${h / 5} -1 -${h * .4}" stroke="${b}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <!-- o dique: corpo de argila, núcleo de areia, pedras e grama -->
    <path d="${DIQUE}" fill="url(#dqDique)" stroke="#3E2418" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="${DIQUE}" fill="url(#dqArgP)"/>
    <g clip-path="url(#dqDiqueClip)">
      <path d="${NUCLEO}" fill="#4E2E1E" opacity=".25" transform="translate(0 -3)" filter="url(#dqSombra)"/>
      <path d="${NUCLEO}" fill="url(#dqNucleo)" stroke="#A8804A" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="${NUCLEO}" fill="url(#dqAreiaP)"/>
      <path d="M156 322 Q160 320 166 320 H234" stroke="#FFF6DA" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M56 456 L352 392" stroke="#2E1A10" stroke-width="5" opacity=".25"/>
    </g>
    ${pedras}
    <g>${[[50, 452, 9, 6], [64, 455, 7, 5], [40, 456, 6, 4.4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dqPd0)" stroke="#2E2E38" stroke-width="1.2"/><path d="M${x - rx * .5} ${y - ry * .5} q${rx * .4} ${-ry * .4} ${rx * .8} 0" stroke="#EEF0F8" stroke-width="1.2" fill="none" opacity=".7"/>`).join('')}</g>
    <text x="196" y="378" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#8A6230" stroke="#FFF2CC" stroke-width="2.6" paint-order="stroke" opacity=".95">areia</text>
    <text x="290" y="358" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#FFF0DE" stroke="#4E2E1E" stroke-opacity=".65" stroke-width="2.6" paint-order="stroke">argila</text>
    <path d="${GRAMA}" stroke="#2E6A22" stroke-width="9.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${GRAMA}" stroke="url(#dqGrama)" stroke-width="6.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M${F(faceX(312))} 312 L136 290 M266 285 L276 296 M290 322 L322 368" stroke="#D2F6A8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>
    <g stroke="#3E8A2A" stroke-width="1.5" fill="none" stroke-linecap="round">${[[124, 314], [130, 302], [146, 278], [184, 278], [188, 278], [222, 278], [226, 278], [258, 278], [272, 290], [284, 306], [298, 328], [312, 348], [326, 368], [342, 384]].map(([x, y]) => `<path d="M${x} ${y} l-2 -5 M${x} ${y} l2 -6 M${x} ${y} l.4 -4"/>`).join('')}</g>
    <g>${[[278, 296], [292, 318], [306, 340], [318, 360], [128, 306]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" stroke="#C9C2A0" stroke-width=".6"/><circle cx="${x}" cy="${y}" r=".8" fill="#FFD447"/>`).join('')}</g>
    <g id="dq-vagas">${NOTCH.map((x, i) => `<g class="dq-vaga" data-i="${i}"><rect x="${x - 13}" y="${CR}" width="26" height="${NB - CR}" fill="#3E2416" opacity=".45"/><path d="M${x - 13} ${CR + 4} h26" stroke="#2E1A10" stroke-width="3" opacity=".3"/><path d="M${x - 13} ${CR} V${NB} H${x + 13} V${CR}" stroke="#3E2416" stroke-width="1.6" fill="none" stroke-dasharray="3 3"/><g class="dq-vaga-hint">${brilhoHotspot(x, CR - 10)}</g></g>`).join('')}</g>
    <g id="dq-espuma" transform="translate(${F(faceX(MAR0))} ${MAR0})" pointer-events="none"><g id="dq-espuma-in"><path d="M-34 1 q5 -6 11 -2 q5 -6 11 -1 q5 -5 9 0 q3 -3 5 2 q-18 4 -36 1Z" fill="#fff" opacity=".9"/><circle cx="-1" cy="-8" r="2.2" fill="#fff" opacity=".85"/><circle cx="3" cy="-14" r="1.5" fill="#fff" opacity=".7"/><circle cx="-6" cy="-12" r="1.3" fill="#fff" opacity=".7"/></g></g>
    <g id="dq-ovelhas" class="toque"><g id="dq-ovelha-in">${ovelha(305, 327, .7, false)}${ovelha(286, 301, .5, false)}</g><rect x="270" y="286" width="54" height="52" fill="transparent"/></g>
    <g id="dq-nivel" style="opacity:0;transition:opacity 1.2s;pointer-events:none"><path d="M130 ${MAR_ALTO} H600" stroke="#12235A" stroke-width="3.6" stroke-dasharray="10 7" opacity=".3"/><path d="M130 ${MAR_ALTO} H600" stroke="#fff" stroke-width="2" stroke-dasharray="10 7"/>
      <text x="300" y="${MAR_ALTO - 8}" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="#12235A" stroke-opacity=".6" stroke-width="3.4" paint-order="stroke">nível do mar</text>
      <path d="M362 ${MAR_ALTO + 6} V${SUP - 6}" stroke="#12235A" stroke-width="4.6" opacity=".3"/><path d="M362 ${MAR_ALTO + 6} V${SUP - 6}" stroke="#fff" stroke-width="2.6"/><path d="M355 ${MAR_ALTO + 14} L362 ${MAR_ALTO + 4} L369 ${MAR_ALTO + 14} M355 ${SUP - 14} L362 ${SUP - 4} L369 ${SUP - 14}" stroke="#fff" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    </g>
    <!-- canal com margens -->
    <path d="M376 ${SUP + 8} C378 400 390 422 412 424 H452 C474 422 484 400 486 ${SUP + 8}Z" fill="#3E2416" opacity=".55"/>
    <path d="M383 ${CAN} H478 C476 402 466 416 446 416 H410 C394 416 386 404 383 ${CAN}Z" fill="url(#dqCanal)" stroke="#1E4E6A" stroke-width="1.8"/>
    <path d="M392 ${CAN + 12} q6 2 12 0 M436 ${CAN + 22} q6 2 12 0 M410 ${CAN + 34} q6 2 12 0" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".7"/>
    <path d="M383 ${CAN} H478" stroke="#E6F6FF" stroke-width="2.2"/>
    <path d="M334 ${SUP + 4} C348 382 362 364 377 363 C385 363 388 367 389 ${CAN + 3} C388 378 387 ${SUP} 386 ${SUP + 6}Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.6"/>
    <path d="M362 374 q6 -9 15 -10" stroke="#D2F6A8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <g id="dq-fluxo-canal" style="opacity:0;transition:opacity .6s"><path d="M470 ${CAN + 8} H388" stroke="#E6F6FF" stroke-width="2" stroke-dasharray="6 10" fill="none"/></g>
    <!-- montinho do moinho e valeta -->
    <path d="M466 ${SUP + 3} C468 374 476 364 490 362 H556 C560 366 562 374 563 ${SUP + 1}Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.8"/>
    <path d="M472 372 q6 -8 16 -9" stroke="#D2F6A8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M556 ${SUP} H600" stroke="#3E8A2A" stroke-width="3"/>
    <path d="M562 ${SUP} C564 400 566 410 575 410 C584 410 586 400 588 ${SUP}Z" fill="#5E4430" stroke="#3E2414" stroke-width="1.4"/>
    <path d="M564 398 C566 406 568 409 575 409 C582 409 584 406 586 398Z" fill="url(#dqCanal)" stroke="#1E4E6A" stroke-width="1"/>
    <g stroke="#3E7A2A" stroke-width="1.8" fill="none" stroke-linecap="round">${[560, 564, 586, 590].map(x => `<path d="M${x} ${SUP} q-1 -10 ${x < 575 ? -3 : 3} -16"/>`).join('')}</g>
    <g fill="#7A4A2A">${[[557, SUP - 18], [593, SUP - 17]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="4.4"/>`).join('')}</g>
    <g id="dq-patinho" class="toque"><g id="dq-patinho-in">${pato(575, 398, .6, true)}</g><rect x="562" y="384" width="26" height="18" fill="transparent"/></g>
    <g id="dq-rosca-g"><path d="M575 404 L474 360" stroke="#4E3A2A" stroke-width="12" stroke-linecap="round"/><path d="M575 404 L474 360" stroke="#C9A06A" stroke-width="8" stroke-linecap="round" opacity=".6"/><path id="dq-rosca-agua" d="M575 404 L474 360" stroke="#5AAEFF" stroke-width="6" stroke-linecap="round" style="opacity:0"/><path id="dq-rosca" d="M575 404 L474 360" stroke="#6E4A2A" stroke-width="9" stroke-dasharray="2.4 6" fill="none"/><path d="M474 360 q-5 -2 -9 4" stroke="#4E3A2A" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <!-- o moinho: base de pedra, corpo de palha, varanda e capota -->
    <g id="dq-moinho" class="toque" data-fig="moinho">
      <ellipse cx="525" cy="${SUP - 1}" rx="40" ry="4" fill="#1E3A12" opacity=".3"/>
      <path d="M493 ${SUP} L497 344 H553 L557 ${SUP}Z" fill="url(#dqMuro)" stroke="#3E3A30" stroke-width="2" stroke-linejoin="round"/>
      <g stroke="#4E4A40" stroke-width=".9">${[350, 358, 366, 374].map((y, i) => { let o = '', x = 495 + (i % 2) * 4; while (x < 553) { const w = R(7, 11), cor = ['#B8AE98', '#A69C86', '#CEC4AE', '#9A9480'][Math.floor(R(0, 4))]; o += `<rect x="${F(x)}" y="${y - 3.6}" width="${F(Math.min(w, 555 - x) - 1)}" height="6.6" rx="2.4" fill="${cor}"/>`; x += w; } return o; }).join('')}</g>
      <path d="M496 346 H554" stroke="#E6DCC6" stroke-width="1.4" opacity=".7"/>
      <path d="M516 ${SUP} V368 C516 359 534 359 534 368 V${SUP}Z" fill="#2E5A3A" stroke="#12351E" stroke-width="1.4"/><path d="M513 ${SUP} V368 C513 355 537 355 537 368 V${SUP}" stroke="#E6DCC6" stroke-width="2.4" fill="none" opacity=".85"/><path d="M525 362 V${SUP}" stroke="#12351E" stroke-width="1"/><circle cx="530" cy="374" r="1.2" fill="#FFD447"/>
      <path d="M500 344 L512 278 H538 L550 344Z" fill="url(#dqPalha)" stroke="#2E2A1E" stroke-width="2" stroke-linejoin="round"/>
      <g stroke-width="1" stroke-linecap="round">${Array.from({ length:30 }, (_, i) => { const t = (i + .5) / 30, x0 = 512 + t * 26, x1 = 500.5 + t * 49; return `<path d="M${F(x0)} 281 Q${F((x0 + x1) / 2 + R(-1.4, 1.4))} 312 ${F(x1)} 342" stroke="${i % 3 ? '#3E3A26' : '#D6D2A6'}" opacity="${i % 3 ? .35 : .5}" fill="none"/>`; }).join('')}</g>
      <path d="M509 296 L541 296 M506 316 L544 316" stroke="#3E3A26" stroke-width="1.4" opacity=".4"/>
      <path d="M520 278 L515 344 M530 278 L535 344" stroke="#2E2A1E" stroke-width="1" opacity=".45"/>
      <path d="M512 286 C510 306 508 326 505 342" stroke="#D6D2A6" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M517 300 h-3 v14 h3 M533 300 h3 v14 h-3" fill="#2E6A4A" stroke="#12351E" stroke-width=".8"/>
      <rect x="518" y="299" width="14" height="16" rx="2" fill="url(#dqVidro)" stroke="#F6F0E2" stroke-width="1.8"/><path d="M525 299 V315 M518 307 H532" stroke="#F6F0E2" stroke-width="1.2"/><path d="M520 303 l3 -2" stroke="#fff" stroke-width="1" opacity=".8"/>
      <path d="M484 344 H566" stroke="#3E2414" stroke-width="5" stroke-linecap="round"/><path d="M484 343 H566" stroke="#A8784A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M486 344 V332 M494 344 V332 M556 344 V332 M564 344 V332 M486 333 H500 M550 333 H564" stroke="#5E3A1E" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M488 346 L496 358 M562 346 L554 358" stroke="#5E3A1E" stroke-width="2" stroke-linecap="round"/>
      <path d="M507 280 C506 262 544 262 543 280Z" fill="url(#dqCapa)" stroke="#12351E" stroke-width="2" stroke-linejoin="round"/>
      <path d="M512 272 q10 -7 22 -5" stroke="#B6EEC6" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M509 278 H541" stroke="#12351E" stroke-width="1" opacity=".5"/>
      <path d="M538 276 L572 340" stroke="#3E2414" stroke-width="3.6" stroke-linecap="round"/><path d="M538 276 L572 340" stroke="#9A6A3E" stroke-width="1.6" stroke-linecap="round"/><path d="M552 302 L541 300" stroke="#5E3A1E" stroke-width="2" stroke-linecap="round"/>
      <g transform="translate(573 342)"><circle r="6" fill="none" stroke="#3E2414" stroke-width="2"/><path d="M-6 0 H6 M0 -6 V6 M-4.2 -4.2 L4.2 4.2 M-4.2 4.2 L4.2 -4.2" stroke="#7A4A2A" stroke-width="1.2"/></g>
      <g id="dq-moinho-hint">${brilhoHotspot(544, 326)}</g>
    </g>
    <g id="dq-pas-g" class="toque" style="cursor:grab"><g id="dq-pas">${pas}</g><path d="M${HX - 9} ${HY - 3} H${HX + 9} V${HY + 3} H${HX - 9}Z M${HX - 3} ${HY - 9} H${HX + 3} V${HY + 9} H${HX - 3}Z" fill="#5E3A1E"/><circle cx="${HX}" cy="${HY}" r="7" fill="#4E2E14" stroke="#2E1A0A" stroke-width="2"/><circle cx="${HX - 2}" cy="${HY - 2}" r="2.4" fill="#C9A07A"/><circle cx="${HX}" cy="${HY}" r="82" fill="transparent"/></g>
    <g id="dq-mao" style="display:none" pointer-events="none"><path d="M${HX - 64} ${HY - 50} q60 -56 124 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/><path d="M${HX + 62} ${HY - 50} l-14 -2 l8 -10Z" fill="#fff"/></g>
    <g id="dq-pato" class="toque"><g id="dq-pato-in">${pato(392, CAN, 1, false)}</g><rect x="378" y="${CAN - 20}" width="26" height="26" fill="transparent"/></g>
    <g id="dq-barco" class="toque"><g id="dq-barco-pos"><g style="animation:flutua 3s ease-in-out infinite alternate">
      <path d="M404 ${CAN - 8} H478 C474 ${CAN + 4} 468 ${CAN + 8} 458 ${CAN + 8} H418 C410 ${CAN + 8} 404 ${CAN + 2} 404 ${CAN - 8}Z" fill="url(#dqCasco)" stroke="#0E1E3A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M406 ${CAN - 4} H476" stroke="#FFC83D" stroke-width="2.4"/><path d="M412 ${CAN - 9} H472" stroke="#8ABAE6" stroke-width="1.6" opacity=".7"/>
      <path d="M474 ${CAN - 8} V${CAN - 34}" stroke="#5E3A1E" stroke-width="2.4"/><path d="M474 ${CAN - 34} l11 4 l-11 4Z" fill="#FF8A3A" stroke="#A8441A" stroke-width=".8"/>
    </g></g><rect x="400" y="${CAN - 38}" width="84" height="48" fill="transparent"/></g>
    <!-- cidade: telhados ao longe -->
    <g fill="#B4C6D0" stroke="#98AEBC" stroke-width=".9" opacity=".9"><path d="M598 330 V306 L606 298 L614 306 V296 H624 V330Z"/><path d="M611 330 V282 H621 V330Z" fill="#A8BCC8"/><path d="M611 282 L616 262 L621 282Z" fill="#9AB0BE"/><path d="M609 283 H623" stroke-width="1.4"/><circle cx="616" cy="292" r="2.4" fill="#E6EEF2"/></g>
    <path d="M596 ${SUP - 6} H800 V${RUA} H596Z" fill="url(#dqPavim)" stroke="#6E5E52" stroke-width="1.4"/>
    <path d="M596 ${SUP - 6} H800 V${RUA} H596Z" fill="url(#dqRua)" opacity=".35"/>
    <path d="M596 ${SUP - 6} H800" stroke="#EADCCE" stroke-width="1.8"/><path d="M596 ${RUA - 1} H800" stroke="#6E5E52" stroke-width="1.6" opacity=".5"/>
    <g id="dq-casas">
      <g id="dq-casa1"><path d="M600 ${SUP - 6} V334 H640 V${SUP - 6}Z" fill="url(#dqMadeira)" stroke="#3E5A6E" stroke-width="1.8"/>
        <g stroke="#7A9AB0" stroke-width=".9" opacity=".8">${[339, 344, 349, 354, 359, 364, 369, 374].map(y => `<path d="M601 ${y} H639"/>`).join('')}</g>
        <path d="M601.5 335 V${SUP - 6} M638.5 335 V${SUP - 6}" stroke="#FFFFFF" stroke-width="2"/>
        <rect x="604" y="340" width="22" height="15" rx="1.6" fill="url(#dqVidro)" stroke="#FFFFFF" stroke-width="2"/><path d="M615 340 V355" stroke="#fff" stroke-width="1.4"/><path d="M606 343 l5 -2" stroke="#fff" stroke-width="1.6" opacity=".8"/>
        ${floreira(603, 356, 24, ['#E5392C', '#FF8AB8', '#FFFFFF'])}
        <path d="M629 ${SUP - 6} V358 H637 V${SUP - 6}Z" fill="#E5703A" stroke="#7A3010" stroke-width="1.4"/><rect x="631" y="361" width="4" height="5" rx="1" fill="url(#dqVidro)"/><circle cx="635.5" cy="370" r=".9" fill="#FFD447"/>
        <path d="M596 334 H644 V330 H596Z" fill="#6E4A2A" stroke="#3E2414" stroke-width="1.2"/>
        <path d="M597 330 ${Array.from({ length:9 }, (_, i) => `q2.6 -${5 + (i % 3)} 5.2 0`).join(' ')} V330Z" fill="url(#dqTeto)" stroke="#2E6A22" stroke-width="1.4"/>
        <path id="dq-teto-molhado" d="M597 330 ${Array.from({ length:9 }, (_, i) => `q2.6 -${5 + (i % 3)} 5.2 0`).join(' ')} V330Z" fill="#1E7A3A" opacity="0" style="transition:opacity 1.2s"/>
        <g>${[[602, 325, '#FF8AB8'], [610, 323, '#FFD447'], [619, 325, '#FFFFFF'], [628, 323, '#FF8AB8'], [637, 325, '#FFD447'], [606, 327, '#B57BFF'], [624, 327, '#FFFFFF']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="${c}" stroke="#6E5A3A" stroke-width=".5"/>`).join('')}</g>
      </g>
      <g id="dq-casa2"><path d="M640 ${SUP - 6} V304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304 V${SUP - 6}Z" fill="url(#dqTijolo)" stroke="#5E2414" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M640 ${SUP - 6} V304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304 V${SUP - 6}Z" fill="url(#dqTijP)"/>
        <path d="M640 304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304" stroke="#FFF6E6" stroke-width="2.8" fill="none"/>
        <path d="M640 304 q-3 -4 1 -7 M682 304 q3 -4 -1 -7" stroke="#FFF6E6" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M641 328.5 H681" stroke="#FFF6E6" stroke-width="1.6" opacity=".8"/>
        ${janela(646, 308, 11, 15, '#FFF6E6', '#F2B49A')}${janela(665, 308, 11, 15, '#FFF6E6', '#F2B49A')}${janela(646, 333, 11, 15, '#FFF6E6')}${janela(665, 333, 11, 15, '#FFF6E6')}
        ${floreira(645, 348, 13, ['#FFD447', '#E5392C'])}${floreira(664, 348, 13, ['#FF8AB8', '#FFFFFF'])}
        <rect x="657" y="280" width="8" height="10" rx="4" fill="url(#dqVidro)" stroke="#FFF6E6" stroke-width="1.4"/>
        <path d="M661 271 v-6 h9" stroke="#3E2414" stroke-width="2.2" fill="none"/><path d="M669 265 v4" stroke="#2A2220" stroke-width="1"/>
        ${ancoras([[651, 302], [671, 302]])}
        <path d="M652 ${SUP - 6} h18 v-2.4 h-18Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <path d="M654 ${SUP - 8} V362 C654 355 668 355 668 362 V${SUP - 8}Z" fill="#2E5A3A" stroke="#12351E" stroke-width="1.4"/><path d="M655.5 361 C656 357 666 357 666.5 361Z" fill="#FFF3D6"/><path d="M661 362 V${SUP - 8}" stroke="#12351E" stroke-width=".9"/>
        <path d="M643 304 V${SUP - 6}" stroke="#7A8090" stroke-width="2.6"/><path d="M643 304 V${SUP - 6}" stroke="#B8BCC8" stroke-width="1"/>
        <path id="dq-cano1" d="M643 304 V${SUP - 6}" stroke="#5AAEFF" stroke-width="2.4" stroke-dasharray="5 7" style="opacity:0"/>
      </g>
      <g id="dq-casa3"><path d="M682 ${SUP - 6} V296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728 V${SUP - 6}Z" fill="url(#dqTijolo2)" stroke="#3E1A10" stroke-width="1.8"/>
        <path d="M682 ${SUP - 6} V296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728 V${SUP - 6}Z" fill="url(#dqTijP)"/>
        <path d="M682 296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728" stroke="#E6D2B8" stroke-width="2.4" fill="none"/>
        <g fill="#F2E6D2" stroke="#6E5A4A" stroke-width=".6">${[[681, 294.5, 8], [687, 284.5, 8], [693, 274.5, 8], [699, 264.5, 12], [710, 274.5, 7], [716, 284.5, 7], [722, 294.5, 7]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="2.6" rx=".6"/>`).join('')}</g>
        ${janela(688, 302, 11, 15, '#E6D2B8', '#B8705A')}${janela(706, 302, 11, 15, '#E6D2B8', '#B8705A')}${janela(688, 326, 11, 15, '#E6D2B8')}${janela(706, 326, 11, 15, '#E6D2B8')}
        <rect x="701" y="278" width="8" height="10" fill="url(#dqVidro)" stroke="#E6D2B8" stroke-width="1.4"/>
        ${ancoras([[692, 296], [714, 296]])}
        <path d="M697 ${SUP - 6} V356 H713 V${SUP - 6}Z" fill="#B0302A" stroke="#3E1010" stroke-width="1.4"/><path d="M697 356 C697 349 713 349 713 356" fill="#FFF3D6" stroke="#3E1010" stroke-width="1"/><path d="M705 350 v6 M700 352 l3 4 M710 352 l-3 4" stroke="#3E1010" stroke-width=".6"/><path d="M699 361 h12 v13 h-12Z" fill="none" stroke="#7A1E1A" stroke-width=".8"/><path d="M695 ${SUP - 6} h20 v-2.4 h-20Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <g class="toque" data-fig="tulipa" id="dq-vaso"><path d="M684 362 h13 l-2 6 h-9Z" fill="#C9674A" stroke="#5E2414" stroke-width="1"/><svg x="682" y="344" width="17" height="20" viewBox="0 0 100 120"><use href="#f-tulipa"/></svg>${brilhoHotspot(690, 344)}</g>
      </g>
      <g id="dq-casa4"><path d="M728 ${SUP - 6} V300 H734 C734 292 740 290 742 284 H758 C760 290 766 292 766 300 H770 V${SUP - 6}Z" fill="url(#dqOcre)" stroke="#7A4A1A" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M728 300 H734 C734 292 740 290 742 284 H758 C760 290 766 292 766 300 H770" stroke="#FFF6E6" stroke-width="2.6" fill="none"/>
        <path d="M741 283 H759 L757 279 H743Z" fill="#FFF6E6" stroke="#7A4A1A" stroke-width=".8"/><path d="M736 298 q2 -6 6 -6 M764 298 q-2 -6 -6 -6" stroke="#FFF6E6" stroke-width="1.6" fill="none"/>
        <path d="M729 324.5 H769" stroke="#FFF6E6" stroke-width="1.4" opacity=".8"/>
        ${janela(734, 306, 11, 15, '#FFF6E6')}${janela(753, 306, 11, 15, '#FFF6E6')}${janela(734, 330, 11, 15, '#FFF6E6')}${janela(753, 330, 11, 15, '#FFF6E6')}
        ${floreira(733, 322, 13, ['#E5392C', '#FFFFFF'])}${floreira(752, 322, 13, ['#B57BFF', '#FF8AB8'])}
        <circle cx="750" cy="292" r="4" fill="url(#dqVidro)" stroke="#FFF6E6" stroke-width="1.4"/>
        <path d="M741 ${SUP - 6} h18 v-2.4 h-18Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <path d="M743 ${SUP - 8} V358 H757 V${SUP - 8}Z" fill="#2E4E8A" stroke="#12235A" stroke-width="1.4"/><path d="M745 360 h10 v6 h-10Z M745 368 h10 v6 h-10Z" fill="none" stroke="#5A7AB8" stroke-width=".8"/><circle cx="754.5" cy="367" r=".9" fill="#FFD447"/>
        <path d="M730 300 V${SUP - 6}" stroke="#7A8090" stroke-width="2.6"/><path d="M730 300 V${SUP - 6}" stroke="#B8BCC8" stroke-width="1"/>
        <path id="dq-cano2" d="M730 300 V${SUP - 6}" stroke="#5AAEFF" stroke-width="2.4" stroke-dasharray="5 7" style="opacity:0"/>
      </g>
      <g id="dq-casa5"><path d="M770 ${SUP - 6} V302 L790 280 L810 302 V${SUP - 6}Z" fill="url(#dqCinza)" stroke="#24363A" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M770 302 L790 280 L810 302" stroke="#E6EEEA" stroke-width="2.6" fill="none"/><path d="M786 284 L790 276 L794 284" fill="#E6EEEA" stroke="#24363A" stroke-width=".8"/>
        ${janela(776, 308, 10, 14, '#E6EEEA')}${janela(776, 332, 10, 14, '#E6EEEA')}${janela(792, 308, 10, 14, '#E6EEEA')}
        <rect x="787" y="290" width="6" height="7" rx="3" fill="url(#dqVidro)" stroke="#E6EEEA" stroke-width="1.2"/>
        <path d="M790 ${SUP - 6} V356 H802 V${SUP - 6}Z" fill="#E5A23C" stroke="#7A4A10" stroke-width="1.4"/><path d="M790 356 h12" stroke="#FFF6E6" stroke-width="1.6"/>
      </g>
    </g>
    <g id="dq-ninho"><path d="M686 266 C688 258 722 258 724 266 C722 272 688 272 686 266Z" fill="#9A6A3A" stroke="#4E2E14" stroke-width="1.6"/>${textura(705, 265, 16, 3, 10, '#5E3A1E', 1.2)}<path d="M688 262 l-6 -4 M720 262 l6 -5 M694 260 l-3 -6 M716 260 l2 -6" stroke="#6E4A2A" stroke-width="1.6" stroke-linecap="round"/></g>
    <g id="dq-pim" class="toque" data-fig="cegonha"><g id="dq-pim-in" style="transform-origin:705px 262px">
      <path d="M710 242 C720 244 726 252 724 260 C718 256 714 252 710 250Z" fill="#1E1E28" stroke="#0A0A10" stroke-width="1.2"/>
      <path d="M690 250 C690 238 702 234 712 236 C722 238 726 248 722 256 C718 264 698 266 692 260 C690 258 690 254 690 250Z" fill="#FFFFFF" stroke="#5A6787" stroke-width="1.6"/>
      <path d="M702 248 C710 244 720 246 724 254 C720 260 712 262 704 260 C700 256 700 252 702 248Z" fill="#26262E" stroke="#0A0A10" stroke-width="1.2"/>
      <path d="M706 252 q6 -2 12 1" stroke="#6A6A7A" stroke-width="1.1" fill="none"/>
      <path d="M696 242 C694 232 698 224 694 216" stroke="#5A6787" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M696 242 C694 232 698 224 694 216" stroke="#fff" stroke-width="5.6" fill="none" stroke-linecap="round"/>
      <circle cx="694" cy="212" r="7.4" fill="#fff" stroke="#5A6787" stroke-width="1.6"/>
      <g id="dq-bico-cima"><path d="M688 210 C680 210 672 214 666 218 C674 217 682 215 689 214Z" fill="#F0602A" stroke="#8A2A10" stroke-width="1.1" stroke-linejoin="round"/></g>
      <g id="dq-bico-baixo" style="transform-origin:689px 214px"><path d="M689 214 C682 216 674 218 666 218.5 C674 220 682 219 689 217Z" fill="#D8401E" stroke="#8A2A10" stroke-width="1" stroke-linejoin="round"/></g>
      <circle cx="692" cy="210" r="2.6" fill="#12121A"/><circle cx="691.2" cy="209.2" r=".9" fill="#fff"/>
      <ellipse cx="695" cy="216" rx="2.4" ry="1.3" fill="#FF9AB0" opacity=".6"/>
      <path d="M690 206 q4 -3 8 -1" stroke="#E2E8F2" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>${brilhoHotspot(722, 232)}<rect x="664" y="200" width="62" height="66" fill="transparent"/></g>
    <g id="dq-bicis" class="toque">${bici(676, RUA - 1, '#2E7BF6')}${bici(784, RUA - 1, '#E5392C')}<rect x="662" y="372" width="30" height="20" fill="transparent"/><rect x="770" y="372" width="30" height="20" fill="transparent"/></g>
    <g id="dq-ciclista" style="opacity:0;pointer-events:none"><g id="dq-ciclista-pos">${bici(0, CR - 2, '#FFC83D')}<g transform="translate(0 ${CR - 16})"><path d="M-2 0 L3 -6 M-2 0 l4 6 l3 0" stroke="#2E3A6A" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M-6 -2 C-6 -14 4 -16 6 -6Z" fill="#FF8A3A" stroke="#7A3A10" stroke-width="1"/><path d="M4 -12 l6 3" stroke="#C98A5A" stroke-width="2" stroke-linecap="round"/><circle cx="2" cy="-18" r="4.4" fill="#C98A5A" stroke="#6E3E1A" stroke-width="1"/><path d="M-2 -20 C-2 -25 6 -25 6 -20Z" fill="#2E7BF6"/></g></g></g>
    <!-- praça d'água: degraus com azulejos e chão de mosaico -->
    <path d="M601 ${RUA} V414 H619 V432 H637 V450 H655 V${PLZ + 4} H745 V450 H763 V432 H781 V414 H799 V${RUA}Z" fill="#8E8270" stroke="#4E463C" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="${PRACA}" fill="url(#dqAzulejo)" stroke="#5E564C" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M606 ${RUA} H794 V${RUA + 8} H606Z" fill="#3E3428" opacity=".16"/>
    <path d="M607 ${RUA + 11} H793 M625 ${RUA + 29} H775 M643 ${RUA + 47} H757 M661 ${RUA + 64} H739" stroke="#4FAEE0" stroke-width="3" stroke-dasharray="6 1.4" opacity=".8"/>
    <g fill="url(#dqConcreto)" stroke="#6E6252" stroke-width="1">${[[606, 410], [624, 428], [642, 446], [740, 446], [758, 428], [776, 410]].map(([x, y]) => `<rect x="${x}" y="${y}" width="18" height="4"/>`).join('')}</g>
    <path d="M606 410 H624 M624 428 H642 M642 446 H660 M740 446 H758 M758 428 H776 M776 410 H794" stroke="#FFFFFF" stroke-width="1.8" opacity=".9"/>
    <rect x="660" y="${PLZ - 7}" width="80" height="7" fill="url(#dqMosaico)" stroke="#6E6252" stroke-width=".8"/>
    <path d="M660 ${PLZ - 7} H740" stroke="#fff" stroke-width="1.2" opacity=".7"/>
    <g stroke="#4E463C" stroke-width=".8"><rect x="693" y="${PLZ - 5}" width="14" height="3.4" rx=".6" fill="#5E5650"/><path d="M696 ${PLZ - 5} v3.4 M700 ${PLZ - 5} v3.4 M704 ${PLZ - 5} v3.4"/></g>
    <g fill="#3FA864" stroke="#1E5A2E" stroke-width="1"><rect x="644" y="439" width="14" height="4.4" rx="1.5"/><rect x="742" y="439" width="14" height="4.4" rx="1.5"/><path d="M646 443.4 v2.6 M656 443.4 v2.6 M744 443.4 v2.6 M754 443.4 v2.6" stroke="#2E3A2E" stroke-width="1.4"/></g>
    <g>${[[615, 410], [785, 410]].map(([x, y]) => `<path d="M${x - 5} ${y} h10 l-1.4 -7 h-7.2Z" fill="#C9674A" stroke="#5E2414" stroke-width=".9"/><path d="${copa(x, y - 13, 7, 7, 8, .3)}" fill="#5EAE4A" stroke="#2E6A22" stroke-width="1"/><path d="M${x - 3} ${y - 16} q3 -3 6 -1" stroke="#B6EE8E" stroke-width="1.4" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g clip-path="url(#dqPracaClip)"><rect id="dq-praca-agua" x="600" y="${PLZ}" width="200" height="80" fill="url(#dqAguaP)"/><path id="dq-praca-brilho" d="M660 ${PLZ} h24 M700 ${PLZ} h16 M630 ${PLZ} h8" stroke="#E6F6FF" stroke-width="2" stroke-linecap="round" style="opacity:0"/></g>
    <g id="dq-escoa" style="opacity:0;transition:opacity .5s;pointer-events:none"><path d="M643 ${SUP - 4} Q630 ${SUP} 622 ${RUA + 6}" stroke="#5AAEFF" stroke-width="3" stroke-dasharray="5 6" fill="none" stroke-linecap="round"/><path d="M730 ${SUP - 4} Q744 ${SUP} 748 ${RUA + 10}" stroke="#5AAEFF" stroke-width="3" stroke-dasharray="5 6" fill="none" stroke-linecap="round"/><path d="M617 ${RUA + 2} l5 6 l3 -7 M744 ${RUA + 6} l4 6 l4 -6" stroke="#2E7BF6" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <g id="dq-criancas" style="opacity:0;transition:opacity 1s">${crianca(680, PLZ - 6, '#C98A5A', '#FF6B5A', '#2E1E14', 1.3)}${crianca(722, PLZ - 6, '#F2C8A0', '#3FA864', '#C98A2A', 1.3)}${crianca(633, 428, '#8A5A3A', '#B57BFF', '#12121A', 1.1)}${crianca(767, 428, '#E8B48A', '#FFC83D', '#7A3A1A', 1.1)}<g id="dq-bola"><circle cx="701" cy="${PLZ - 16}" r="5.4" fill="#FFC83D" stroke="#A86A08" stroke-width="1.3"/><path d="M696.4 ${PLZ - 17} q4.6 -3.4 9.2 0" stroke="#fff" stroke-width="1.3" fill="none"/></g></g>
    <text x="700" y="490" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#fff" stroke="#3E2414" stroke-opacity=".75" stroke-width="3" paint-order="stroke">praça d'água</text>
    <g id="dq-chuva" style="opacity:0;transition:opacity .9s;pointer-events:none">${[[622, 30], [704, 54], [778, 24]].map(([x, y]) => `<g class="dq-nuv toque" data-x="${x}"><use href="#nuvem" x="${x - 54}" y="${y}" width="108" height="54" style="color:#5A6787"/><use href="#nuvem" x="${x - 50}" y="${y + 3}" width="100" height="48" style="color:#AEB7CC"/><use href="#nuvem" x="${x - 34}" y="${y + 20}" width="68" height="30" style="color:#8A94AE"/><path d="M${x - 24} ${y + 18} q9 -6 19 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><g class="dq-nuv-hint">${brilhoHotspot(x + 28, y + 12)}</g><rect x="${x - 40}" y="${y + 4}" width="80" height="50" fill="transparent"/></g>`).join('')}</g>
    <g id="dq-blocos">${BLOCOS.map((b, i) => `<g class="dq-bloco toque" data-i="${i}" transform="translate(${b.x} ${b.y}) scale(.82)" style="cursor:grab">${bloco(b.tipo)}<circle r="20" fill="transparent"/></g>`).join('')}</g>
    <g id="dq-bloco-hint">${brilhoHotspot(428, 332)}</g>
    <g id="dq-seta" pointer-events="none"><path d="M414 332 C398 290 320 254 226 262" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M222 262 l13 -8 l1 13Z" fill="#fff"/></g>
    <g class="balanca" style="animation-duration:5.2s">${[[372, SUP + 4, 26], [380, SUP + 4, 20], [470, SUP + 4, 22]].map(([x, y, h]) => `<path d="M${x} ${y} q-3 -${h / 2} 1 -${h}" stroke="#2E6A3A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-3 -${h / 2} 1 -${h}" stroke="#7CC25A" stroke-width="1.2" fill="none" stroke-linecap="round"/>`).join('')}<g fill="#7A4A2A">${[[373, SUP - 22], [471, SUP - 18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="4.6"/>`).join('')}</g></g>
    <rect width="800" height="500" fill="url(#dqVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#dqGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mar = el(s, '#dq-mar'), ondas = el(s, '#dq-ondas'), focaPos = el(s, '#dq-foca-pos');
  el(s, '#dq-ondas-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(20px)' }], { duration:1400, iterations:Infinity });
  el(s, '#dq-ondas-in2').animate([{ transform:'translateX(0)' }, { transform:'translateX(-32px)' }], { duration:2600, iterations:Infinity });
  el(s, '#dq-espuma-in').animate([{ transform:'scale(.85)', opacity:.6 }, { transform:'scale(1.1)', opacity:1 }, { transform:'scale(.85)', opacity:.6 }], { duration:1800, iterations:Infinity });
  s.querySelectorAll('.dq-turb').forEach((t, i) => t.animate([{ transform:'rotate(0deg)' }, { transform:'rotate(360deg)' }], { duration:5200 + i * 900, iterations:Infinity }));
  const espuma = el(s, '#dq-espuma');
  const seta = el(s, '#dq-seta'); seta.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const poeMar = y => { marY = y; mar.setAttribute('y', y.toFixed(1)); espuma.setAttribute('transform', `translate(${faceX(y).toFixed(1)} ${y.toFixed(1)})`); ondas.setAttribute('transform', `translate(0 ${y.toFixed(1)})`); const off = Math.min(0, y - AREIA + 12); focaPos.setAttribute('transform', `translate(0 ${off.toFixed(1)})`); el(s, '#dq-foca-onda').style.opacity = off < 0 ? 1 : 0; };
  /* 1. maré: tapar os buracos do dique */
  const blocos = [...s.querySelectorAll('.dq-bloco')], pos = BLOCOS.map(b => ({ x:b.x, y:b.y, foi:false }));
  const vagaLivre = NOTCH.map(() => true);
  const poe = (i, k) => blocos[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${k || .82})`);
  let arr = null;
  blocos.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; seta.style.display = 'none'; el(s, '#dq-bloco-hint').style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(40, Math.min(480, p.y - arr.dy)); poe(arr.i, 1);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; blocos[i].style.cursor = 'grab';
    let v = -1, melhor = 70;
    NOTCH.forEach((x, k) => { const d = Math.hypot(pos[i].x - x, pos[i].y - (CR + 11)); if (vagaLivre[k] && d < melhor) { melhor = d; v = k; } });
    if (v < 0 && !moveu) v = vagaLivre.indexOf(true);
    if (v >= 0) encaixa(i, v); else volta(i);
  });
  function anima(i, x1, y1, ms, k0, k1, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 30; poe(i, k0 + (k1 - k0) * e);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function volta(i){ const b = BLOCOS[i]; anima(i, b.x, b.y, 600, 1, .82); toca('glub'); api.diz('Leve o bloco até um buraco lá em cima do dique!'); }
  function encaixa(i, v){
    pos[i].foi = true; vagaLivre[v] = false;
    anima(i, NOTCH[v], CR + 11, 700, 1, 1, () => {
      postos++; toca('planta'); c.brilhos(NOTCH[v], CR + 4, 6, '#FFE27A');
      for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:NOTCH[v] + sorte(-10, 10), y:CR + 1, t:k * 2, cor:'#8A6A4E' });
      el(s.querySelectorAll('.dq-vaga')[v], '.dq-vaga-hint').style.display = 'none';
      api.hud(`<span class="chip">Buracos tapados: ${postos}/3</span>`);
      const falas = { argila:'Argila é um barro bem grudento. A água quase não passa por ela!', pedra:'As pedras protegem o dique da força das ondas.', grama:'A grama segura a terra com as raízes, e o dique fica firme.' };
      if (postos < 3) api.diz(falas[BLOCOS[i].tipo]);
      else mareAlta();
    });
  }
  function mareAlta(){
    fase = 'alta'; alvoMar = MAR_ALTO; toca('splash');
    api.diz('O dique segurou a maré! Olha a linha: o mar ficou mais alto que os campos e as casas.');
    depois(2600, () => { el(s, '#dq-nivel').style.opacity = 1; toca('vitoria'); });
    depois(7200, () => api.diz('Por isso o dique é tão importante. Uma parte grande deste país fica abaixo do nível do mar.'));
    depois(13000, comecaMoinho);
  }
  /* 2. moinho: bombear a água do campo encharcado para o canal */
  const pasG = el(s, '#dq-pas'), rosca = el(s, '#dq-rosca'), roscaAgua = el(s, '#dq-rosca-agua'), mao = el(s, '#dq-mao');
  function comecaMoinho(){
    fase = 'moinho'; el(s, '#dq-nivel').style.opacity = .4;
    mao.style.display = ''; mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
    api.hud('<span class="chip">Campo seco: 0%</span>');
    api.diz('Choveu muito e o campo ficou encharcado! Gire as pás do moinho com o dedo para tirar a água do campo.');
  }
  let giro = null;
  const empurra = v => { if (fase !== 'moinho') return; vel = Math.min(14, vel + v); mao.style.display = 'none'; };
  el(s, '#dq-pas-g').addEventListener('pointerdown', e => { if (arr) return; e.stopPropagation(); giro = c.ponto(e); s.setPointerCapture(e.pointerId); toca('clique'); if (fase === 'moinho') empurra(2.6); else vel = Math.min(5, vel + 1.5); });
  s.addEventListener('pointermove', e => { if (!giro) return; const p = c.ponto(e); empurra(Math.hypot(p.x - giro.x, p.y - giro.y) * .05); giro = p; });
  s.addEventListener('pointerup', () => giro = null);
  const pocas = [...s.querySelectorAll('.dq-poca')], lama = el(s, '#dq-lama'), filas = [...s.querySelectorAll('.dq-fila')];
  let falouMeio = false, falouCanal = false, dash = 0;
  function poeSeco(){
    lama.style.opacity = (1 - seco / 100).toFixed(2);
    pocas.forEach((p, i) => p.style.transform = `scale(${Math.max(0, 1 - seco / (55 + i * 5)).toFixed(2)})`);
    const abrir = Math.floor(seco / 16);
    while (filasAbertas < Math.min(FILAS.length, abrir)) { const f = filas[filasAbertas]; el(f, '.dq-fila-in').style.transform = 'scaleY(1)'; toca('planta'); c.brilhos(420 + filasAbertas * 50, FILAS[filasAbertas].y - 4, 4, '#FFE27A'); filasAbertas++; }
    api.hud(`<span class="chip">Campo seco: ${Math.round(seco)}%</span>`);
    if (!falouMeio && seco > 30) { falouMeio = true; api.diz('O moinho usa a força do vento para levantar a água do campo até o canal.'); }
    if (!falouCanal && seco > 62) { falouCanal = true; api.diz('O canal fica mais alto que o campo. Ele leva a água embora, até o mar.'); }
  }
  function campoSeco(){
    fase = 'florido'; toca('vitoria'); el(s, '#dq-fluxo-canal').style.opacity = 0;
    api.diz('O campo secou e as tulipas floresceram! Terra baixa assim, protegida por diques e secada com bombas, se chama pôlder.');
    depois(7600, comecaChuva);
  }
  let ultT = performance.now(), ultR = 0;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    /* maré */
    if (Math.abs(alvoMar - marY) > .1) poeMar(marY + Math.sign(alvoMar - marY) * Math.min(Math.abs(alvoMar - marY), dt * (fase === 'alta' ? .01 : .016)));
    if (fase === 'mare' && Math.abs(alvoMar - marY) < 1 && t - ultR > 650) {
      ultR = t; const livres = NOTCH.filter((_, k) => vagaLivre[k]);
      if (livres.length) { const x = livres[Math.floor(Math.random() * livres.length)]; for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:x - 8 + sorte(-4, 4), y:NB + 1, t:k * 2, cor:'#E6F6FF' }); c.add({ tipo:'bolha', x:x - 6, y:NB + 4, vy:.5, r:2, topo:NB - 6, f:0 }); }
    }
    /* moinho */
    const base = fase === 'moinho' ? 0 : .6;
    vel += (base - vel) * .012; ang = (ang + vel * dt * .06) % 360;
    pasG.setAttribute('transform', `rotate(${ang.toFixed(1)} ${HX} ${HY})`);
    dash = (dash + vel * dt * .02) % 1000; rosca.setAttribute('stroke-dashoffset', dash.toFixed(1));
    const fluxo = fase === 'moinho' ? Math.max(0, vel - .6) : 0;
    roscaAgua.style.opacity = fluxo > .3 ? .9 : 0;
    if (fase === 'moinho' && fluxo > 0) {
      seco = Math.min(100, seco + fluxo * dt * .0011);
      if (Math.random() < fluxo * .05) c.add({ tipo:'chuva', x:466 + sorte(-2, 2), y:362, vx:-1.2, vy:1.4, chao:CAN - 1, cor:'#5AAEFF' });
      const fc = el(s, '#dq-fluxo-canal'); fc.style.opacity = 1; fc.firstChild.setAttribute('stroke-dashoffset', (dash * 1.4).toFixed(1));
      poeSeco();
      if (seco >= 100) campoSeco();
    }
    requestAnimationFrame(vida);
  })(ultT);
  /* 3. chuva: a cidade guarda a água na praça d'água e no telhado verde */
  function comecaChuva(){
    fase = 'chuva'; const ch = el(s, '#dq-chuva'); ch.style.opacity = 1; ch.style.pointerEvents = '';
    api.hud('<span class="chip">Chuvas: 0/3</span>');
    api.diz('Lá vem chuva forte! Toque nas nuvens para chover na cidade. Para onde será que a água vai?');
  }
  const chaoX = x => x < 598 ? SUP : x < 642 ? 324 : x < 682 ? 300 + Math.abs(x - 661) * .8 : x < 728 ? 280 + Math.abs(x - 705) * .9 : x < 770 ? 292 : 300;
  const nivelPraca = (alvo, ms, fim) => { const y0 = praca, t0 = performance.now(), ag = el(s, '#dq-praca-agua'), br = el(s, '#dq-praca-brilho'); br.style.opacity = 1;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); praca = y0 + (alvo - y0) * k; ag.setAttribute('y', praca.toFixed(1)); br.setAttribute('transform', `translate(0 ${(praca - PLZ).toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const escoa = el(s, '#dq-escoa'), canos = [el(s, '#dq-cano1'), el(s, '#dq-cano2')];
  const fluir = ms => { escoa.style.opacity = 1; canos.forEach(p => p.style.opacity = 1);
    const a = [...escoa.querySelectorAll('path[stroke-dasharray]'), ...canos].map(p => p.animate([{ strokeDashoffset:24 }, { strokeDashoffset:0 }], { duration:500, iterations:Infinity }));
    depois(ms, () => { escoa.style.opacity = 0; canos.forEach(p => p.style.opacity = 0); a.forEach(x => x.cancel()); }); };
  el(s, '#dq-chuva').addEventListener('click', e => {
    const g = e.target.closest('.dq-nuv'); if (!g || fase !== 'chuva' || chovendo || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; el(g, '.dq-nuv-hint').style.display = 'none'; chovendo = true; chuvas++; toca('chuva'); const x = +g.dataset.x;
    let n = 0; (function cai(){ if (!vivo) return; for (let k = 0; k < 3; k++) { const px = x + sorte(-46, 46); c.add({ tipo:'chuva', x:px, y:sorte(78, 96), vx:-.3, vy:sorte(9, 12), chao:chaoX(px) - 2, cor:'#3D8BFF' }); }
      if (n % 5 === 0) c.add({ tipo:'infiltra', x0:sorte(602, 636), y0:322, x1:sorte(604, 634), y1:332, dur:sorte(30, 40), f:sorte(0, 6) });
      if (++n < 50) depois(45, cai); })();
    depois(1100, () => fluir(2600));
    depois(1300, () => { nivelPraca([456, 437, 418][chuvas - 1], 2200); el(s, '#dq-teto-molhado').setAttribute('opacity', (.22 * chuvas).toFixed(2)); });
    depois(3400, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) api.diz('A chuva escorre dos telhados e da rua... e vai para a praça d\'água! A praça guarda a água por um tempo.');
      if (chuvas === 2) api.diz('O telhado verde tem plantinhas que seguram a água da chuva, como uma esponja.');
      if (chuvas === 3) passaChuva();
    });
  });
  function passaChuva(){
    fase = 'seca'; el(s, '#dq-chuva').style.opacity = 0; el(s, '#dq-arco').style.opacity = 1; el(s, '#dq-chuva').style.pointerEvents = 'none'; toca('vitoria');
    api.diz('Choveu muito, mas a rua e as casas ficaram sequinhas! A água ficou guardada na praça.');
    depois(4200, () => {
      for (let k = 0; k < 14; k++) depois(k * 260, () => c.add({ tipo:'infiltra', x0:sorte(650, 750), y0:PLZ + 2, x1:sorte(630, 770), y1:sorte(476, 494), dur:sorte(80, 110), f:sorte(0, 6) }));
      nivelPraca(PLZ + 2, 5200, () => { el(s, '#dq-praca-brilho').style.opacity = 0; brincam(); });
      api.diz('Depois da chuva, a água vai saindo devagarinho para dentro do chão e para o canal.');
    });
  }
  function brincam(){
    el(s, '#dq-criancas').style.opacity = 1; toca('pop');
    el(s, '#dq-bola').animate([{ transform:'translate(-14px,0)' }, { transform:'translate(0,-16px)' }, { transform:'translate(14px,0)' }, { transform:'translate(0,-16px)' }, { transform:'translate(-14px,0)' }], { duration:1600, iterations:Infinity });
    api.diz('A praça secou e virou lugar de brincar de novo!');
    depois(4200, () => { fase = 'fim'; toca('vitoria'); api.diz('Quando a gente não consegue segurar a água, dá para planejar para onde ela vai. Diques, moinhos, telhados verdes e praças d\'água ajudam a viver junto com a água!'); depois(6400, api.fim); });
  }
  /* toques extras */
  let focaOcupada = false;
  el(s, '#dq-foca').addEventListener('click', () => { [300, 240, 300].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .22, 'sawtooth', .04, f * .7), i * 240));
    if (focaOcupada) return; focaOcupada = true; const fi = el(s, '#dq-foca-in');
    const a = fi.animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:900 });
    a.onfinish = () => { focaOcupada = false; };
    for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:40 + k * 16, y:Math.min(marY, AREIA) + 1, t:k * 2, cor:'#E6F6FF' });
    api.diz(marY > AREIA ? 'Uma foca-comum descansando no banco de areia! No Mar de Wadden, quando a maré baixa, os bancos de areia aparecem.' : 'A maré subiu e cobriu o banco de areia. A foca nada muito bem!'); });
  el(s, '#dq-ovelhas').addEventListener('click', e => { e.stopPropagation(); [[420, 340], [400, 320]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .45, 'triangle', .07, f2), i * 420));
    el(s, '#dq-ovelha-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:350, iterations:2 });
    api.diz('Méé! As ovelhas comem a grama do dique. A grama fica baixinha e fechada, e o dique fica mais forte.'); });
  el(s, '#dq-pato').addEventListener('click', e => { e.stopPropagation(); [0, 180].forEach(d => setTimeout(() => somOn && tom(560, 0, .12, 'square', .05, 360), d)); el(s, '#dq-pato-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(-5px)' }, { transform:'translateX(0)' }], { duration:900 }); c.add({ tipo:'respingo', x:392, y:CAN + 1, t:0, cor:'#E6F6FF' }); api.diz('Quac! Os patos adoram os canais.'); });
  el(s, '#dq-patinho').addEventListener('click', e => { e.stopPropagation(); [0, 140, 280].forEach(d => setTimeout(() => somOn && tom(1200, 0, .08, 'triangle', .05, 900), d)); el(s, '#dq-patinho-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }], { duration:300, iterations:2 }); api.diz('Um patinho na valeta! As valetas recolhem a água do campo e levam até o moinho.'); });
  let barcoOcupado = false;
  el(s, '#dq-barco').addEventListener('click', e => { if (fase === 'mare' || barcoOcupado) return; e.stopPropagation(); barcoOcupado = true; somOn && tom(180, 0, .5, 'sawtooth', .05, 170);
    const t0 = performance.now(), bp = el(s, '#dq-barco-pos');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 2400); bp.setAttribute('transform', `translate(${(-Math.sin(k * Math.PI) * 14).toFixed(1)} 0)`); if (k < 1) requestAnimationFrame(q); else barcoOcupado = false; })(t0);
    api.diz('Os canais são como ruas de água. Os barcos levam coisas de um lugar para outro.'); });
  let pedalando = false;
  el(s, '#dq-bicis').addEventListener('click', e => { e.stopPropagation(); [0, 160].forEach(d => setTimeout(() => somOn && tom(2200, 0, .18, 'sine', .06, 2100), d));
    if (fase === 'mare') { api.diz('Trim, trim! Quando o dique ficar pronto, dá para pedalar lá em cima.'); return; }
    if (pedalando) return; pedalando = true; const cg = el(s, '#dq-ciclista'), cp = el(s, '#dq-ciclista-pos'); cg.style.opacity = 1; const t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 3400); cp.setAttribute('transform', `translate(${(142 + k * 126).toFixed(1)} ${(-Math.abs(Math.sin(k * 40)) * .8).toFixed(1)})`); cg.style.opacity = Math.min(1, k * 10, (1 - k) * 10).toFixed(2); if (k < 1) requestAnimationFrame(q); else { cg.style.opacity = 0; pedalando = false; } })(t0);
    api.diz('Trim, trim! Aqui o chão é bem plano, e muita gente vai de bicicleta para todo lado. Até em cima do dique!'); });
  el(s, '#dq-filas').addEventListener('click', e => { const f = e.target.closest('.dq-fila'); if (!f) return;
    if (fase === 'mare' || fase === 'alta' || (fase === 'moinho' && +f.dataset.i >= filasAbertas)) { toca('glub'); api.diz('O campo está encharcado. As tulipas não crescem com as raízes debaixo da água.'); return; }
    const i = +f.dataset.i, k = (+f.dataset.c + 1) % 4; f.dataset.c = k; const cor = FILAS[i].cores[k], cp = el(f, '.dq-copos'); cp.setAttribute('fill', cor); cp.setAttribute('stroke', escuro(cor)); el(f, '.dq-faixa').setAttribute('fill', cor);
    toca('pop'); const p = c.ponto(e); for (let j = 0; j < 6; j++) c.add({ tipo:'petala', x:p.x + sorte(-14, 14), y:p.y - 6, vy:sorte(.4, .9), f:sorte(0, 6), chao:p.y + sorte(2, 8), cor, borda:escuro(cor) });
    if (!s.dataset.tulipas) { s.dataset.tulipas = 1; api.diz('As tulipas florescem na primavera, em fileiras de muitas cores!'); } });
  el(s, '#dq-pim').addEventListener('click', () => { [0, 70, 140, 210, 280, 350, 420].forEach(d => setTimeout(() => somOn && tom(900, 0, .04, 'square', .05, 500), d));
    el(s, '#dq-bico-baixo').animate([{ transform:'rotate(0)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(0)' }], { duration:140, iterations:4 });
    el(s, '#dq-pim-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(5deg)' }, { transform:'rotate(0)' }], { duration:600 });
    api.diz('Clac-clac-clac! As cegonhas conversam batendo o bico. Elas fazem ninhos grandes em lugares altos, como telhados.'); });
  el(s, '#dq-moinho').addEventListener('click', () => { if (fase === 'moinho') return; toca('ok'); api.diz('Os moinhos antigos usavam o vento para bombear a água. Hoje, bombas elétricas fazem quase todo esse trabalho.'); });
  el(s, '#dq-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(70, 60, 8, '#FFE27A'); api.diz('Aqui chove em todas as estações do ano. Por isso é preciso cuidar bem da água!'); });
  api.hud('<span class="chip">Buracos tapados: 0/3</span>');
  api.diz('Oi, eu sou o Pim, uma cegonha! Aqui muita terra fica mais baixa que o mar.');
  api.diz('A maré está subindo! Arraste os blocos do barco para tapar os buracos do dique.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
