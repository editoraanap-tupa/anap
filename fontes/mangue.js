/* ================= JOGO 22: Marisqueiras do mangue, Bahia ================= */
function jogoMangue(palco, api){
  semente = 233;
  const ALTA = 262, BAIXA = 436;
  const F = n => n.toFixed(1);
  let vivo = true, fase = 'mare', nivel = ALTA, luaK = 0, ocupado = false, escolhidos = 0, acertos = 0, lixos = 0, mudas = 0, abertoI = -1, filhotes = 0, maisK = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  /* trilha da Lua: do alto do céu até o horizonte (lá a maré fica seca) */
  const LUA = k => ({ x:306 + 214 * k, y:52 + 40 * Math.pow(k, 1.3) - 16 * Math.sin(k * Math.PI) });
  const ITENS = [
    { tipo:'ostraG', x:126, y:352, levar:true },
    { tipo:'caranguejoP', x:384, y:372, levar:false },
    { tipo:'caranguejoG', x:300, y:398, levar:true },
    { tipo:'ostraP', x:214, y:330, levar:false },
    { tipo:'sururu', x:584, y:388, levar:true },
    { tipo:'femea', x:400, y:418, levar:false }
  ];
  const CESTO = { x:502, y:420 };
  const LIXO = [{ id:'garrafa', x:176, y:396 }, { id:'sacola', x:772, y:368 }, { id:'lata', x:262, y:300 }];
  const COVAS = [{ x:258, y:342 }, { x:330, y:330 }, { x:404, y:344 }];
  const PROPS = [{ x:42, y:180 }, { x:70, y:190 }, { x:150, y:182 }];
  /* posições das marisqueiras: na canoa (relativo ao nível) e na lama */
  const CAN_X = 688, MA = { canoa:{ x:640, dy:-2 }, lama:{ x:458, y:412 } }, MB = { canoa:{ x:740, dy:-2 }, lama:{ x:670, y:404 } };
  /* ---------- desenhos ---------- */
  const tri = (d, esc, cor, w, luz) => `<path d="${d}" stroke="${esc}" stroke-width="${F(w + 2.6)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${cor}" stroke-width="${F(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${luz ? `<path d="${d}" stroke="${luz}" stroke-width="${F(Math.max(.8, w * .28))}" fill="none" stroke-linecap="round" opacity=".55" transform="translate(-${F(w * .22)} -${F(w * .22)})"/>` : ''}`;
  /* raiz-escora do mangue-vermelho */
  const raiz = (x0, y0, x1, y1, h, w) => { const mx = x0 + (x1 - x0) * .42; return tri(`M${x0} ${y0} C${F(mx)} ${F(y0 - h)} ${F(x1 - (x1 - x0) * .08)} ${F(Math.min(y0, y1) - h * .4)} ${x1} ${y1}`, '#3A1E12', 'url(#mgRaiz)', w, '#E8B890'); };
  const folhas = (cx, cy, rx, ry, n, cor, esc, luz) => { let s = ''; for (let i = 0; i < n; i++) { const a = R(0, 6.28), r = Math.sqrt(R(0, 1)), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r, ang = R(-70, 70), L = R(6, 10); s += `<g transform="translate(${F(x)} ${F(y)}) rotate(${F(ang)})"><path d="M0 0 C${F(L * .35)} -${F(L * .32)} ${F(L * .75)} -${F(L * .3)} ${F(L)} 0 C${F(L * .75)} ${F(L * .3)} ${F(L * .35)} ${F(L * .32)} 0 0Z" fill="${cor}" stroke="${esc}" stroke-width=".7"/><path d="M1 0 H${F(L * .8)}" stroke="${luz}" stroke-width=".6" opacity=".7"/></g>`; } return s; };
  const propagulo = (L) => `<path d="M0 0 C1 ${F(L * .3)} -1 ${F(L * .7)} 0 ${L}" stroke="#2E3A12" stroke-width="5.2" fill="none" stroke-linecap="round"/><path d="M0 0 C1 ${F(L * .3)} -1 ${F(L * .7)} 0 ${L}" stroke="url(#mgProp)" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M-.8 3 C0 ${F(L * .3)} -1.4 ${F(L * .6)} -1 ${F(L * .8)}" stroke="#E6F2A0" stroke-width=".8" fill="none" opacity=".7"/><path d="M-3.6 -3 C-3 1 3 1 3.6 -3 C2 -6 -2 -6 -3.6 -3Z" fill="#8A5A2A" stroke="#3E2410" stroke-width=".8"/>`;
  const caranguejo = (k, ov, cor) => {
    const C = cor || ['mgUcaC', '#3A2A52'], P = cor ? 'mgAratu' : 'mgUcaP', G = cor ? 'mgAratu' : 'mgGarra';
    const pern = [0, 1, 2, 3].map(j => [-1, 1].map(l => { const y0 = -3 + j * 3.2, kx = l * (24 + j * 1.6), ky = y0 - 7 + j * .8, tx = l * (32 + j * 2.6), ty = 11.4 + j * .9; return { d:`M${l * 14} ${F(y0)} Q${F(l * 18 + l * j)} ${F(y0 - 6)} ${F(kx)} ${F(ky)} Q${F(kx + l * 6)} ${F(ky + 4)} ${F(tx)} ${F(ty)}`, kx, ky, tx, ty, l, y0 }; })).flat();
    return `<g transform="scale(${k})"><ellipse cx="0" cy="15" rx="30" ry="4.4" fill="#1E140A" opacity=".3"/>
      ${pern.map(q => `<path d="${q.d}" stroke="#5A2A3A" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${q.d}" stroke="url(#${P})" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${F(q.kx)}" cy="${F(q.ky)}" r="1.1" fill="#FFE2CC"/><path d="M${F((q.l * 14 + q.kx) / 2)} ${F((q.y0 + q.ky) / 2 - 1.4)} l${q.l * .6} -1.8 M${F((q.l * 14 + q.kx * 3) / 4)} ${F((q.y0 + q.ky * 3) / 4 - 1.4)} l${q.l * .6} -1.8 M${F((q.kx + q.tx) / 2 + q.l * 1.2)} ${F((q.ky + q.ty) / 2)} l${q.l * 1.6} -.6" stroke="#5A2A3A" stroke-width=".6" stroke-linecap="round" opacity=".8"/>`).join('')}
      ${ov ? `<g><ellipse cx="0" cy="9" rx="14" ry="6.6" fill="url(#mgOvos)" stroke="#8A3A10" stroke-width="1"/><g fill="#FFB060" stroke="#A8480E" stroke-width=".4">${Array.from({ length:18 }, (_, i) => `<circle cx="${F(Math.cos(i * 2.4) * (3 + i % 3 * 3.4))}" cy="${F(9 + Math.sin(i * 2.4) * (1.6 + i % 3 * 1.5))}" r="1.6"/>`).join('')}</g><g fill="#fff" opacity=".85"><circle cx="-4" cy="7" r=".6"/><circle cx="3" cy="6.6" r=".6"/><circle cx="8" cy="9" r=".5"/></g></g>` : ''}
      ${[-1, 1].map(l => `<path d="M${l * 10} -5 Q${l * 15} -9 ${l * 19} -9" stroke="#5A2A3A" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M${l * 10} -5 Q${l * 15} -9 ${l * 19} -9" stroke="url(#${P})" stroke-width="3.6" fill="none" stroke-linecap="round"/>
        <path d="M${l * 16} -9 C${l * 15} -18 ${l * 27} -21 ${l * 30} -14 C${l * 32} -9 ${l * 27} -5 ${l * 21} -5 C${l * 18} -5 ${l * 16} -6 ${l * 16} -9Z" fill="url(#${G})" stroke="#5A2A3A" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M${l * 26} -18 C${l * 30} -23 ${l * 35} -21 ${l * 34} -16 C${l * 33} -14 ${l * 31} -14 ${l * 29.6} -15" fill="url(#${G})" stroke="#5A2A3A" stroke-width="1" stroke-linejoin="round"/>
        <path d="M${l * 19} -13 q${l * 3} -4 ${l * 7} -3.6" stroke="#FFF0F4" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".85"/><circle cx="${l * 31}" cy="-15" r=".8" fill="#FFF0E0"/>`).join('')}
      <path d="M-21 1 C-22 -10 -12 -17 0 -17 C12 -17 22 -10 21 1 C18 9 -18 9 -21 1Z" fill="url(#${C[0]})" stroke="${C[1]}" stroke-width="1.5"/>
      <path d="M-19 2 C-12 6 12 6 19 2" stroke="#E8C0B0" stroke-width="1.4" fill="none" opacity=".6"/>
      <g fill="#fff" opacity=".3"><circle cx="8" cy="-9" r="1.2"/><circle cx="12" cy="-5" r=".9"/><circle cx="4" cy="-12" r=".8"/></g>
      <path d="M-14 -9 C-10 -14 -4 -15 1 -15" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M-5 -15 L-6.4 -19.6 M5 -15 L6.4 -19.6" stroke="${C[1]}" stroke-width="2.2" stroke-linecap="round"/>
      ${[-1, 1].map(l => `<circle cx="${l * 7}" cy="-23" r="4.2" fill="#fff" stroke="${C[1]}" stroke-width="1"/><circle cx="${l * 7 + .4}" cy="-22.4" r="2.6" fill="#1A0E1A"/><circle cx="${l * 7 + 1.2}" cy="-23.4" r="1" fill="#fff"/>`).join('')}
      <path d="M-4.4 -6.4 Q0 -2 4.4 -6.4" stroke="#3A1430" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="-10" cy="-6" rx="2.6" ry="1.4" fill="#FF9AB8" opacity=".55"/><ellipse cx="10" cy="-6" rx="2.6" ry="1.4" fill="#FF9AB8" opacity=".55"/></g>`;
  };
  const ostra = (k, grande) => `<g transform="scale(${k})"><ellipse cx="0" cy="8" rx="${grande ? 17 : 15}" ry="3" fill="#1E140A" opacity=".25"/>
    <path d="M-15 2 C-18 -6 -10 -14 -2 -13 C6 -16 16 -10 15 -2 C16 6 6 10 -2 9 C-10 10 -15 7 -15 2Z" fill="url(#mgOstra)" stroke="#3E3A4A" stroke-width="1.4"/>
    <path d="M-12 1 C-10 -6 -4 -9 2 -9 C8 -10 12 -6 11 -1 M-9 4 C-6 0 0 -2 6 -2 M-6 -11 c-1 4 0 9 2 13" stroke="#6E6880" stroke-width="1" fill="none" opacity=".75"/>
    <path d="M-10 -3 C-7 -8 -1 -10 4 -10" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-15 2 C-8 6 6 6 15 -1" stroke="#E8E0F0" stroke-width="1" fill="none" opacity=".8"/>
    ${grande ? `<path d="M2 -12 C8 -20 18 -18 18 -10 C18 -6 12 -6 8 -8Z" fill="url(#mgOstra)" stroke="#3E3A4A" stroke-width="1.2"/><path d="M6 -14 q5 -3 9 0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/>` : ''}</g>`;
  const sururu = (k) => `<g transform="scale(${k})"><ellipse cx="0" cy="6" rx="22" ry="4" fill="#1E140A" opacity=".3"/>
    ${[[-12, 0, -30], [-3, -4, -10], [7, -1, 20], [14, 3, 40], [-4, 4, 70], [4, 6, -60]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-9 0 C-8 -5 4 -6 9 -1 C8 3 -4 4 -9 0Z" fill="url(#mgSururu)" stroke="#0E1420" stroke-width="1"/><path d="M-6 -2 C-2 -4 3 -4 6 -2" stroke="#8AA0C8" stroke-width="1" fill="none" opacity=".8"/><path d="M-8 0 C-3 1.4 3 1.4 8 -1" stroke="#5E4A2A" stroke-width=".7" fill="none" opacity=".7"/></g>`).join('')}
    <path d="M-20 6 C-12 2 12 2 20 6" stroke="#5E4630" stroke-width="2.4" fill="none" opacity=".6"/></g>`;
  const desenhoItem = { ostraG:() => ostra(1.15, true), ostraP:() => ostra(.55, false), caranguejoG:() => caranguejo(1.05), caranguejoP:() => caranguejo(.52), femea:() => caranguejo(.92, true), sururu:() => sururu(1) };
  /* marisqueiras (origem nos pés) */
  const olhos = (y, esc) => `<ellipse cx="-3.6" cy="${y}" rx="1.5" ry="1.8" fill="#1A0E0A"/><ellipse cx="3.8" cy="${y}" rx="1.5" ry="1.8" fill="#1A0E0A"/><circle cx="-3.1" cy="${y - .7}" r=".6" fill="#fff"/><circle cx="4.3" cy="${y - .7}" r=".6" fill="#fff"/>`;
  const mulherA = () => `<g>
    <ellipse cx="0" cy="1" rx="17" ry="3" fill="#1E140A" opacity=".3"/>
    <path d="M-11 0 Q-11.6 -4 -8.6 -5 L-8.8 -20 H-2.2 L-2 -2 Q-2 0 -4 0Z M11 0 Q11.6 -4 8.6 -5 L8.8 -20 H2.2 L2 -2 Q2 0 4 0Z" fill="url(#mgBota)" stroke="#5A6470" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M-11 -.6 H-2.4 M11 -.6 H2.4" stroke="#2A2E36" stroke-width="1.6"/><path d="M-7.6 -18 v12 M3.6 -18 v12" stroke="#fff" stroke-width="1.1" opacity=".8"/>
    <g fill="#6E4A2A" opacity=".85"><ellipse cx="-6" cy="-4" rx="3" ry="1.6"/><ellipse cx="7" cy="-6" rx="2.4" ry="1.4"/><circle cx="-4" cy="-9" r="1"/><circle cx="5" cy="-11" r=".9"/><ellipse cx="0" cy="-1" rx="2" ry="1"/></g>
    <path d="M-10 -18 L-11.4 -42 H11.4 L10 -18 H3 L1 -32 H-1 L-3 -18Z" fill="url(#mgCalcaA)" stroke="#16204A" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M-10.2 -20 h7 M3 -20 h7" stroke="#5A6AB0" stroke-width="1.4"/>
    <path d="M-12.4 -40 C-13.6 -52 -9.4 -62 0 -62 C9.4 -62 13.6 -52 12.4 -40 C6 -37.6 -6 -37.6 -12.4 -40Z" fill="url(#mgBlusaA)" stroke="#8A2E1E" stroke-width="1.4"/>
    <path d="M-4.6 -61.4 L0 -56 L4.6 -61.4" fill="#FFE8D8" stroke="#8A2E1E" stroke-width=".9"/><path d="M0 -56 V-42" stroke="#B8442E" stroke-width=".8"/><g fill="#FFF2E6">${[-52, -47].map(y => `<circle cx="1.6" cy="${y}" r=".7"/>`).join('')}</g>
    <path d="M3.6 -52 h5.6 v5 h-5.6Z" fill="#FF8A6A" stroke="#8A2E1E" stroke-width=".7"/>
    <path d="M-12 -44 C-6 -42 6 -42 12 -44" stroke="#8A2E1E" stroke-width=".8" fill="none" opacity=".6"/>
    <path d="M-8 -58 C-10 -52 -10 -46 -9 -42" stroke="#FFB49A" stroke-width="1.4" fill="none" opacity=".6"/>
    <path d="M-11 -58 C-16 -50 -17 -42 -14 -34" stroke="#8A2E1E" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M-11 -58 C-16 -50 -17 -42 -14 -34" stroke="url(#mgBlusaA)" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <circle cx="-13.6" cy="-32" r="3" fill="url(#mgPeleA)" stroke="#2E160A" stroke-width=".9"/>
    <g class="mg-braco" style="transform-origin:11px -58px"><path d="M11 -58 C17 -62 20 -68 21 -75" stroke="#8A2E1E" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M11 -58 C17 -62 20 -68 21 -75" stroke="url(#mgBlusaA)" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="21.4" cy="-77.4" r="3.1" fill="url(#mgPeleA)" stroke="#2E160A" stroke-width=".9"/><path d="M19.8 -80 l-.6 -2.2 M22 -80.4 l.2 -2.4 M23.6 -79 l1 -1.8" stroke="#2E160A" stroke-width=".8" stroke-linecap="round"/></g>
    <path d="M-3.4 -62 v-4.4 h6.8 v4.4Z" fill="url(#mgPeleA)"/>
    <g fill="#5A5A60" stroke="#2A2A30" stroke-width=".5">${[[-8.4, -71], [-9, -67], [-8, -63.4], [8.4, -71], [9, -67], [8, -63.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>
    <g fill="#C8C8D0">${[[-9, -69.6], [8.8, -68.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>
    <ellipse cx="0" cy="-70" rx="8.4" ry="9.4" fill="url(#mgPeleA)" stroke="#2E160A" stroke-width="1.3"/>
    <circle cx="-8.2" cy="-66.4" r="1.4" fill="none" stroke="#F0B42A" stroke-width=".8"/><circle cx="8.2" cy="-66.4" r="1.4" fill="none" stroke="#F0B42A" stroke-width=".8"/>
    <path d="M-5.6 -74 q2 -1.2 4 -.2 M1.8 -74.2 q2 -1 4 .2" stroke="#1A0E0A" stroke-width=".9" fill="none" stroke-linecap="round"/>
    ${olhos(-70.6)}
    <path d="M-6.6 -69 l-1.4 -.6 M6.8 -69 l1.4 -.6" stroke="#2E160A" stroke-width=".5" opacity=".7"/>
    <path d="M0 -69 q1 1.8 -.4 2.6" stroke="#2E160A" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-3.4 -65.2 C-1.8 -62.6 2 -62.6 3.6 -65.2Z" fill="#fff" stroke="#4E1A0A" stroke-width=".9" stroke-linejoin="round"/>
    <ellipse cx="-5.4" cy="-66.6" rx="1.9" ry="1.1" fill="#C8584A" opacity=".5"/><ellipse cx="5.6" cy="-66.6" rx="1.9" ry="1.1" fill="#C8584A" opacity=".5"/>
    <path d="M-23 -77 C-15 -81.6 15 -81.6 23 -77 C16 -73 -16 -73 -23 -77Z" fill="url(#mgPalha)" stroke="#7A5A1E" stroke-width="1.1"/>
    <path d="M-8.6 -78.4 C-8.6 -89.4 8.6 -89.4 8.6 -78.4Z" fill="url(#mgPalha)" stroke="#7A5A1E" stroke-width="1.1"/>
    <g stroke="#A8823A" stroke-width=".5" opacity=".8" fill="none"><path d="M-18 -78.4 l3 2 M-14 -79.2 l3 2.4 M-10 -79.6 l2 2.6 M10 -79.6 l-2 2.6 M14 -79.2 l-3 2.4 M18 -78.4 l-3 2 M-16 -75.8 l3 -2 M16 -75.8 l-3 -2"/><path d="M-6 -82.4 h12 M-7 -84.8 h14 M-5 -87 h10"/></g>
    <path d="M-8.6 -80.6 h17.2" stroke="#1E8A6A" stroke-width="2.2"/><path d="M-8.6 -80.6 h17.2" stroke="#FFD84A" stroke-width=".7" stroke-dasharray="1.6 1.4"/>
    <path d="M-5 -86.4 q3 -2 7 -1.4" stroke="#FFF2C0" stroke-width="1" fill="none" stroke-linecap="round"/>
    <rect x="-24" y="-92" width="50" height="94" fill="transparent"/></g>`;
  const mulherB = () => `<g>
    <ellipse cx="0" cy="1" rx="16" ry="3" fill="#1E140A" opacity=".3"/>
    <path d="M-7 -14 V-26 M6 -14 V-26" stroke="url(#mgPeleB)" stroke-width="5.4" stroke-linecap="round"/>
    <path d="M-10.6 0 Q-11 -3.4 -8.6 -4 L-9 -15 H-3 L-2.6 -2 Q-2.6 0 -4.4 0Z M10.6 0 Q11 -3.4 8.6 -4 L9 -15 H3 L2.6 -2 Q2.6 0 4.4 0Z" fill="url(#mgBotaB)" stroke="#1E3A22" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M-10.6 -.6 H-3 M10.6 -.6 H3" stroke="#14261A" stroke-width="1.6"/><path d="M-9 -13.6 H-3 M3 -13.6 H9" stroke="#8ACB7A" stroke-width="1.1"/>
    <g fill="#6E4A2A" opacity=".8"><ellipse cx="-6" cy="-3" rx="2.6" ry="1.4"/><ellipse cx="6.4" cy="-5" rx="2.2" ry="1.2"/><circle cx="-7" cy="-17" r="1"/><circle cx="6" cy="-19" r=".8"/></g>
    <path d="M-10.4 -24 L-11 -40 H11 L10.4 -24 H2.6 L1 -32 H-1 L-2.6 -24Z" fill="url(#mgJeans)" stroke="#1A2E5A" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M-10.4 -26 h7.8 M2.6 -26 h7.8" stroke="#A8C4F0" stroke-width="1" stroke-dasharray="1.4 1"/><path d="M5 -38 q3 4 5 4" stroke="#A8C4F0" stroke-width=".8" fill="none"/>
    <path d="M-9 -62 C-15 -56 -15 -40 -12 -30 C-10 -36 -9 -48 -6 -58Z" fill="#2A1A14" stroke="#120A06" stroke-width=".8"/>
    <path d="M-12 -40 C-13 -50 -9 -60 0 -60 C9 -60 13 -50 12 -40 C6 -37.6 -6 -37.6 -12 -40Z" fill="url(#mgBlusaB)" stroke="#9A6A08" stroke-width="1.4"/>
    <path d="M-12.4 -56 L-17 -50 L-13 -46 L-10.6 -50Z M12.4 -56 L17 -50 L13 -46 L10.6 -50Z" fill="url(#mgBlusaB)" stroke="#9A6A08" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-4.4 -59.6 C-2 -57 2 -57 4.4 -59.6" stroke="#9A6A08" stroke-width="1" fill="none"/>
    <g transform="translate(0 -48)"><path d="M-6 0 C-3 -4 3 -4 6 0 C3 4 -3 4 -6 0Z M6 0 l4 -3 v6Z" fill="#2E8AC8" stroke="#0E4A7A" stroke-width=".8"/><circle cx="-3" cy="-.6" r=".8" fill="#fff"/><path d="M-1 -2 q2 2 0 4" stroke="#9AD8FF" stroke-width=".6" fill="none"/></g>
    <path d="M-7 -56 C-9 -50 -9 -45 -8 -42" stroke="#FFF6C0" stroke-width="1.4" fill="none" opacity=".7"/>
    <path d="M-15 -48 C-17 -42 -16 -36 -13 -32" stroke="url(#mgPeleB)" stroke-width="4.6" fill="none" stroke-linecap="round"/>
    <g transform="translate(-14 -30)"><path d="M-7 0 L-6 12 H6 L7 0Z" fill="url(#mgBalde)" stroke="#0E3A6A" stroke-width="1.2" stroke-linejoin="round"/><path d="M-7 0 C-7 -8 7 -8 7 0" stroke="#3A4A5A" stroke-width="1" fill="none"/><ellipse cx="0" cy="0" rx="7" ry="1.8" fill="#0E2A44" stroke="#0E3A6A" stroke-width=".8"/>${[[-3.4, -.6], [0, -1.6], [3, -.4], [-1, .6]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.2" fill="#2A3448" stroke="#0E1420" stroke-width=".5"/>`).join('')}<path d="M-5 3 v7" stroke="#8AC8FF" stroke-width="1.2" opacity=".7"/></g>
    <circle cx="-13.6" cy="-31" r="2.6" fill="url(#mgPeleB)" stroke="#4E2A14" stroke-width=".9"/>
    <g class="mg-braco" style="transform-origin:15px -50px"><path d="M15 -50 C18 -44 19 -40 18 -34" stroke="url(#mgPeleB)" stroke-width="4.6" fill="none" stroke-linecap="round"/><circle cx="18" cy="-32" r="2.6" fill="url(#mgPeleB)" stroke="#4E2A14" stroke-width=".9"/>
      <g class="mg-cel" style="opacity:0;transition:opacity .4s"><rect x="15.6" y="-41" width="7" height="11" rx="1.4" fill="#2A2E3A" stroke="#12141A" stroke-width=".7"/><rect x="16.4" y="-40" width="5.4" height="8.6" rx=".8" fill="#9AE0FF"/><path d="M16.8 -35 q1.4 -2 2.6 0 t2.4 0" stroke="#2E7BF6" stroke-width=".8" fill="none"/><circle cx="19.2" cy="-38" r=".9" fill="#FFE27A"/></g></g>
    <path d="M-3 -60 v-4.4 h6 v4.4Z" fill="url(#mgPeleB)"/>
    <ellipse cx="0" cy="-69" rx="8.2" ry="9.2" fill="url(#mgPeleB)" stroke="#4E2A14" stroke-width="1.3"/>
    <path d="M-8.2 -71 C-9 -77 -5 -80 0 -80 C5 -80 9 -77 8.2 -71 C6 -74 2 -75 -1 -75 C-4 -75 -6 -74 -8.2 -71Z" fill="#2A1A14"/>
    <path d="M-5.6 -73 q2 -1 3.6 0 M2 -73 q2 -1 3.6 0" stroke="#1A0E0A" stroke-width=".9" fill="none" stroke-linecap="round"/>
    ${olhos(-69.8)}
    <path d="M.2 -68.4 q1 1.6 -.2 2.4" stroke="#6E3A1A" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <path d="M-3.2 -64.6 C-1.6 -62 2 -62 3.4 -64.6Z" fill="#fff" stroke="#6E2E14" stroke-width=".9" stroke-linejoin="round"/>
    <ellipse cx="-5.4" cy="-65.8" rx="1.8" ry="1" fill="#E07A5A" opacity=".55"/><ellipse cx="5.6" cy="-65.8" rx="1.8" ry="1" fill="#E07A5A" opacity=".55"/>
    <circle cx="-8.2" cy="-66" r=".9" fill="#F0B42A"/><circle cx="8.2" cy="-66" r=".9" fill="#F0B42A"/>
    <path d="M-8.8 -73 C-9 -82 9 -82 8.8 -73Z" fill="url(#mgBone)" stroke="#0E5A5A" stroke-width="1.1"/>
    <path d="M-9 -73 C-14 -73 -19 -71.6 -20 -70 C-14 -69.6 -6 -71 -2 -72.4Z" fill="#1E9A8E" stroke="#0E5A5A" stroke-width="1" stroke-linejoin="round"/>
    <path d="M-5 -79 q4 -2 8 0" stroke="#B8FFF4" stroke-width="1" fill="none" stroke-linecap="round"/><circle cx="0" cy="-81.2" r="1" fill="#0E5A5A"/>
    <g stroke="#2A1A14" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M8 -74 C14 -72 15 -64 13 -56"/><path d="M8.6 -71 C13 -66 12 -60 10 -54"/></g>
    <g fill="#FF6A8E"><circle cx="13" cy="-56" r="1.1"/><circle cx="10" cy="-54" r="1.1"/></g>
    <rect x="-24" y="-86" width="50" height="88" fill="transparent"/></g>`;
  const desenhoLixo = {
    garrafa:'<g transform="rotate(-62)"><path d="M-6 -18 h12 v5 C10 -10 11 -6 11 0 V18 C11 22 8 23 0 23 C-8 23 -11 22 -11 18 V0 C-11 -6 -10 -10 -6 -13Z" fill="#C8ECE6" fill-opacity=".85" stroke="#3E8A7A" stroke-width="1.6"/><rect x="-5" y="-25" width="10" height="8" rx="2" fill="#2E7BF6" stroke="#123A8A" stroke-width="1.2"/><rect x="-11" y="2" width="22" height="8" fill="#E5392C" stroke="#8A1A10" stroke-width="1"/><path d="M-6 -6 V16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="M-11 16 C-4 20 4 20 11 16" stroke="#6E4A2A" stroke-width="3" opacity=".5"/></g>',
    sacola:'<path d="M-16 -6 C-18 8 -12 20 0 22 C12 20 18 8 16 -6Z" fill="#F4F8FF" fill-opacity=".85" stroke="#8A9AB8" stroke-width="1.5"/><path d="M-10 -6 C-12 -17 -3 -18 -3 -7 M10 -6 C12 -17 3 -18 3 -7" stroke="#8A9AB8" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M-8 3 q4 7 0 12 M6 1 q-3 9 2 14" stroke="#C9D4E6" stroke-width="1.3" fill="none"/><path d="M-14 14 C-6 20 6 20 14 14" stroke="#6E4A2A" stroke-width="2.4" fill="none" opacity=".4"/>',
    lata:'<g transform="rotate(16)"><rect x="-17" y="-9" width="34" height="18" rx="4" fill="#C9CED8" stroke="#5A6070" stroke-width="1.6"/><rect x="-5" y="-9" width="10" height="18" fill="#FFB020"/><ellipse cx="17" cy="0" rx="3.2" ry="9" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.3"/><path d="M-14 -5 H12" stroke="#fff" stroke-width="1.8" opacity=".7" stroke-linecap="round"/></g>'
  };
  const guaraMini = (cor) => `<g><path d="M-10 0 C-8 -6 6 -7 12 -2 C8 3 -4 4 -10 0Z" fill="${cor || 'url(#mgGuaraC)'}" stroke="#A8285A" stroke-width="1"/><path d="M-12 0 l-3 1 l3 1.6Z" fill="#F0A050"/><path d="M11 -2 C14 -4 16 -7 18 -8" stroke="#A8285A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M11 -2 C14 -4 16 -7 18 -8" stroke="#FFE6EE" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="19" cy="-8.6" r="2.6" fill="#FFE6EE" stroke="#A8285A" stroke-width=".8"/><path d="M21 -8.6 L27 -7 C30 -7 31 -3.6 28.6 -3 C26.6 -2.6 26 -4.4 26 -5.4Z" fill="#7A8486" stroke="#3A4044" stroke-width=".7"/><circle cx="19" cy="-9.4" r="1.6" fill="#B8C8A8"/><circle cx="19.6" cy="-9.2" r=".7" fill="#12121A"/><g class="mg-asa"><path d="M-2 -3 C-6 -14 -2 -20 4 -22 C6 -14 6 -8 4 -2Z" fill="#F49AB8" stroke="#A8285A" stroke-width=".9"/><path d="M0 -8 C1 -12 3 -14 4 -14" stroke="#D0285A" stroke-width="2.4" stroke-linecap="round"/></g><path d="M-2 2 l-2 6 M2 2 l1 6" stroke="#D0506A" stroke-width="1.1"/></g>`;
  /* ---------- cena ---------- */
  semente = 233;
  const longe = Array.from({ length:26 }, (_, i) => { const x = i * 32 + R(-8, 8), y = 168 + R(-2, 3), r = R(14, 24); return `<path d="${copa(x, y, r, r * .55, 7, .3)}" fill="${['#9CB8A4', '#A8C0A0', '#94B0A8'][i % 3]}"/>`; }).join('');
  const fundoMangue = (x0, x1, yTopo, yBase, cores) => { let s = ''; for (let x = x0; x <= x1; x += R(20, 30)) { const r = R(18, 30), y = yTopo + R(-6, 10), c = cores[Math.floor(R(0, cores.length))]; s += `<path d="${copa(x, y, r, r * .62, 8, .32)}" fill="${c[0]}" stroke="${c[1]}" stroke-width="1"/><path d="${copa(x - r * .2, y - r * .18, r * .5, r * .28, 6, .3)}" fill="${c[2]}" opacity=".55"/>`; } return s; };
  const raizesLonge = (x0, x1, y) => { let s = ''; for (let x = x0; x < x1; x += R(18, 36)) { const n = 2 + Math.floor(R(0, 3)), top = y - R(14, 30); for (let k = 0; k < n; k++) { const w = R(5, 15) * (k % 2 ? 1 : -1), xx = x + R(-4, 4); s += `M${F(xx)} ${F(top)} C${F(xx + w * .2)} ${F(top + 2)} ${F(xx + w * .9)} ${F(y - 10)} ${F(xx + w)} ${F(y + R(-2, 3))} `; } } return `<path d="${s}" stroke="#4E3A2A" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/><path d="${s}" stroke="#9A7A5E" stroke-width="1" fill="none" opacity=".55" stroke-linecap="round"/>`; };
  const pneumat = (n, cx, cy, rx, ry) => { const pts = []; for (let i = 0; i < n; i++) { const a = R(0, 6.28), r = Math.sqrt(R(.12, 1)); pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } pts.sort((a, b) => a[1] - b[1]);
    return pts.map(([x, y]) => { const h = (7 + R(0, 7)) * (.75 + (y - cy + ry) / (2 * ry) * .5), w = 1.7 + h * .06; return `<ellipse cx="${F(x + 1)}" cy="${F(y + .6)}" rx="${F(w + 1.6)}" ry="1" fill="#2A1A10" opacity=".35"/><path d="M${F(x - w)} ${F(y)} L${F(x - w * .45)} ${F(y - h)} Q${F(x)} ${F(y - h - 1.6)} ${F(x + w * .45)} ${F(y - h)} L${F(x + w)} ${F(y)}Z" fill="url(#mgPneu)" stroke="#3A2A1A" stroke-width=".7" stroke-linejoin="round"/><path d="M${F(x - w * .45)} ${F(y - 1)} L${F(x - w * .2)} ${F(y - h + 1)}" stroke="#F2E6C8" stroke-width=".7" opacity=".8"/><path d="M${F(x - w)} ${F(y - 1.4)} H${F(x + w)}" stroke="#4E3A24" stroke-width=".9" opacity=".6"/>`; }).join(''); };
  const tocas = Array.from({ length:20 }, () => { const x = R(250, 600), y = R(300, 432), r = R(3, 5.4) * (.7 + (y - 300) / 300); return `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(r + 2.4)}" ry="${F(r * .75)}" fill="#8A6A48" opacity=".7"/><ellipse cx="${F(x)}" cy="${F(y + .6)}" rx="${F(r)}" ry="${F(r * .5)}" fill="#1E140C"/><path d="M${F(x - r)} ${F(y - .4)} q${F(r)} ${F(-r * .5)} ${F(r * 2)} 0" stroke="#B89A78" stroke-width=".8" fill="none"/>${Array.from({ length:4 }, (_, k) => { const a = -2.6 + k * .7 + R(-.2, .2), d = r + R(3, 7), bx = x + Math.cos(a) * d * 1.3, by = y + Math.sin(a) * d * .5 + 1.6, br = R(1, 1.8) * (.7 + (y - 300) / 300); return `<circle cx="${F(bx)}" cy="${F(by)}" r="${F(br)}" fill="#7A5A3E" stroke="#4E3420" stroke-width=".4"/><circle cx="${F(bx - br * .3)}" cy="${F(by - br * .3)}" r="${F(br * .35)}" fill="#C8AE8A"/>`; }).join('')}`; }).join('');
  const passos = (x0, y0, x1, y1, n) => Array.from({ length:n }, (_, i) => { const k = (i + .5) / n, x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, l = i % 2 ? 3 : -3, a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI; return `<g transform="translate(${F(x)} ${F(y + l)}) rotate(${F(a)})"><ellipse rx="4.6" ry="2.1" fill="#3A2414" opacity=".8"/><ellipse cx="-.6" cy="-.4" rx="3.4" ry="1.2" fill="#2A1A10" opacity=".35"/><path d="M-3 -1.6 h6" stroke="#B89A78" stroke-width=".5" opacity=".7"/></g>`; }).join('');
  const pegadas = Array.from({ length:14 }, () => { const x = R(260, 600), y = R(310, 428); return `<path d="M${F(x)} ${F(y)} l3 -1.4 M${F(x + 1)} ${F(y + 2)} l3 -.6 M${F(x + 6)} ${F(y + 1)} l2.6 1.4" stroke="#4E3420" stroke-width=".7" opacity=".5"/>`; }).join('');
  const conchas = Array.from({ length:12 }, () => { const x = R(240, 600), y = R(380, 432); return `<g transform="translate(${F(x)} ${F(y)}) rotate(${F(R(-40, 40))})"><path d="M-3 0 C-3 -3 3 -3 3 0Z" fill="#F2E6D8" stroke="#8A7A6A" stroke-width=".5"/><path d="M0 -2.4 V0 M-1.6 -1.8 l.6 1.8 M1.6 -1.8 l-.6 1.8" stroke="#B8A898" stroke-width=".3"/></g>`; }).join('');
  /* copa do mangue-vermelho grande */
  const copaV = `<path d="${copa(120, 104, 150, 66, 16, .24)}" fill="url(#mgCopaV0)" stroke="#0E3A22" stroke-width="2"/>
    <path d="${copa(60, 120, 80, 44, 11, .28)}" fill="url(#mgCopaV1)" stroke="#124A2A" stroke-width="1.4"/>
    <path d="${copa(200, 118, 76, 42, 11, .28)}" fill="url(#mgCopaV1)" stroke="#124A2A" stroke-width="1.4"/>
    <path d="${copa(118, 72, 96, 44, 12, .28)}" fill="url(#mgCopaV2)" stroke="#1E5A30" stroke-width="1.3"/>
    <path d="${copa(90, 56, 46, 22, 9, .3)}" fill="#7CC46A" opacity=".55"/><path d="${copa(176, 84, 40, 18, 8, .3)}" fill="#7CC46A" opacity=".4"/>
    <g>${folhas(120, 100, 140, 54, 70, '#2E7A3E', '#0E3A22', '#9ADC8A')}${folhas(130, 112, 130, 44, 26, '#2E6E5A', '#0E3A2A', '#A8E0C8')}${folhas(110, 70, 90, 32, 34, '#5EAE4E', '#1E5A2A', '#D4F4B8')}${folhas(100, 60, 70, 22, 16, '#9AC84A', '#4E7A1E', '#F0FAC8')}${folhas(150, 120, 110, 30, 7, '#E8C24A', '#8A6A1A', '#FFF2B0')}</g>
    <g fill="#F4F2C8" stroke="#C8B860" stroke-width=".5">${[[40, 128], [92, 140], [150, 136], [206, 132], [70, 96], [168, 104], [236, 112]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="2" /><circle cx="3" cy="1" r="1.6"/><circle cx="-2.6" cy="1.4" r="1.4"/></g>`).join('')}</g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Manguezal da Bahia na maré: raízes do mangue-vermelho, lama com tocas de caranguejo, marisqueiras numa canoa e a Lua no céu">
    <defs>
      <linearGradient id="mgCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EB4E6"/><stop offset=".55" stop-color="#BCDCEE"/><stop offset="1" stop-color="#FFE6CC"/></linearGradient>
      <radialGradient id="mgLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6DA" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></radialGradient>
      <radialGradient id="mgNoite" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#4E64B8"/><stop offset="1" stop-color="#1E2A6A"/></radialGradient>
      <radialGradient id="mgLua" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#EEF2FA"/><stop offset="1" stop-color="#C8D2E6"/></radialGradient>
      <linearGradient id="mgMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB6B0"/><stop offset="1" stop-color="#B9CCC2"/></linearGradient>
      <linearGradient id="mgMorro2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86A898"/><stop offset="1" stop-color="#A4BCA8"/></linearGradient>
      <linearGradient id="mgBaia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED0D6"/><stop offset="1" stop-color="#6AAEB8"/></linearGradient>
      <linearGradient id="mgNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E4" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E4" stop-opacity=".65"/></linearGradient>
      <linearGradient id="mgLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8062"/><stop offset=".5" stop-color="#7A5E42"/><stop offset="1" stop-color="#5A4230"/></linearGradient>
      <linearGradient id="mgLamaBrilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#E6F4FF" stop-opacity=".22"/></linearGradient>
      <linearGradient id="mgPoca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EC8E8"/><stop offset=".6" stop-color="#C8E6F4"/><stop offset="1" stop-color="#FFEBD8"/></linearGradient><linearGradient id="mgCanal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8D8E6"/><stop offset="1" stop-color="#6AAEC0"/></linearGradient>
      <linearGradient id="mgAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EAEA6" stop-opacity=".58"/><stop offset=".22" stop-color="#3A8A86" stop-opacity=".76"/><stop offset=".6" stop-color="#22686C" stop-opacity=".88"/><stop offset="1" stop-color="#123E46" stop-opacity=".95"/></linearGradient>
      <linearGradient id="mgAguaSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6FFFA" stop-opacity=".5"/><stop offset="1" stop-color="#E6FFFA" stop-opacity="0"/></linearGradient>
      <linearGradient id="mgRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="mgTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A86A4A"/><stop offset=".5" stop-color="#7A4430"/><stop offset="1" stop-color="#4E2A1C"/></linearGradient>
      <linearGradient id="mgRaiz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B07A54"/><stop offset="1" stop-color="#6E4028"/></linearGradient>
      <linearGradient id="mgTroncoP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A89C8A"/><stop offset=".5" stop-color="#7E7262"/><stop offset="1" stop-color="#564C40"/></linearGradient>
      <linearGradient id="mgPneu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8C8A0"/><stop offset=".5" stop-color="#A8906A"/><stop offset="1" stop-color="#6E5638"/></linearGradient>
      <radialGradient id="mgCopaV0" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#3E8A4A"/><stop offset="1" stop-color="#14502E"/></radialGradient>
      <radialGradient id="mgCopaV1" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#4E9E52"/><stop offset="1" stop-color="#1E6436"/></radialGradient>
      <radialGradient id="mgCopaV2" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#68B85A"/><stop offset="1" stop-color="#2E7A3E"/></radialGradient>
      <radialGradient id="mgCopaP0" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#9AAE7A"/><stop offset="1" stop-color="#5E7250"/></radialGradient>
      <radialGradient id="mgCopaP1" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#B8C890"/><stop offset="1" stop-color="#7A8E5E"/></radialGradient>
      <radialGradient id="mgCopaB" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#C8DE6A"/><stop offset="1" stop-color="#7EA43A"/></radialGradient>
      <linearGradient id="mgProp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C23E"/><stop offset=".6" stop-color="#5E8A2A"/><stop offset="1" stop-color="#7A5226"/></linearGradient>
      <linearGradient id="mgUcaC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA2DC"/><stop offset=".55" stop-color="#7068A8"/><stop offset="1" stop-color="#6E4A66"/></linearGradient>
      <linearGradient id="mgUcaP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB894"/><stop offset="1" stop-color="#E07A72"/></linearGradient>
      <linearGradient id="mgGarra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6B8D4"/><stop offset="1" stop-color="#B8689A"/></linearGradient>
      <radialGradient id="mgOvos" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#FFB060"/><stop offset="1" stop-color="#D2641E"/></radialGradient>
      <linearGradient id="mgAratu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A4A"/><stop offset="1" stop-color="#B0281A"/></linearGradient>
      <linearGradient id="mgChama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2E6C8"/><stop offset="1" stop-color="#B8A07A"/></linearGradient>
      <radialGradient id="mgOstra" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#F2EEF6"/><stop offset=".6" stop-color="#B8B0C8"/><stop offset="1" stop-color="#7E7690"/></radialGradient>
      <linearGradient id="mgSururu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5E8A"/><stop offset="1" stop-color="#1A2034"/></linearGradient>
      <linearGradient id="mgCanoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E8AD8"/><stop offset="1" stop-color="#1E4E9A"/></linearGradient>
      <linearGradient id="mgSaco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D0D6DE"/></linearGradient>
      <radialGradient id="mgPeleA" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8A5434"/><stop offset="1" stop-color="#5A321C"/></radialGradient>
      <radialGradient id="mgPeleB" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#B8784C"/><stop offset="1" stop-color="#8A5434"/></radialGradient>
      <linearGradient id="mgBlusaA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A6A"/><stop offset="1" stop-color="#D8503A"/></linearGradient>
      <linearGradient id="mgCalcaA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4A9A"/><stop offset="1" stop-color="#22306E"/></linearGradient>
      <linearGradient id="mgBota" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C8D0DA"/></linearGradient>
      <linearGradient id="mgBotaB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E9A5A"/><stop offset="1" stop-color="#2A5E34"/></linearGradient>
      <linearGradient id="mgBlusaB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE06A"/><stop offset="1" stop-color="#F0B42A"/></linearGradient>
      <linearGradient id="mgJeans" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E8AD0"/><stop offset="1" stop-color="#36609E"/></linearGradient>
      <linearGradient id="mgBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EC8B8"/><stop offset="1" stop-color="#1E9A8E"/></linearGradient>
      <linearGradient id="mgBalde" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5EB0F0"/><stop offset="1" stop-color="#2E6AB8"/></linearGradient>
      <linearGradient id="mgPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2DA8A"/><stop offset="1" stop-color="#C8A04A"/></linearGradient>
      <linearGradient id="mgCesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2B870"/><stop offset="1" stop-color="#9A6A30"/></linearGradient>
      <linearGradient id="mgGuaraC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC0D2"/><stop offset="1" stop-color="#EC7AA0"/></linearGradient>
      <linearGradient id="mgVela" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6E6"/><stop offset="1" stop-color="#E6D6BC"/></linearGradient>
      <linearGradient id="mgFicha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset="1" stop-color="#F2E8D6"/></linearGradient>
      <radialGradient id="mgVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#0A1A14" stop-opacity="0"/><stop offset="1" stop-color="#0A1A14" stop-opacity=".36"/></radialGradient>
      <pattern id="mgCaus" width="80" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 C10 5 20 25 30 12 C40 2 50 22 60 14 C68 8 74 18 80 15 M10 28 C18 22 26 30 34 26 M46 4 C54 0 62 8 70 4" stroke="#fff" stroke-width="1.5" fill="none" opacity=".45"/></pattern>
      <filter id="mgGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
    </defs>
    <rect width="800" height="300" fill="url(#mgCeu)"/>
    <circle cx="40" cy="180" r="170" fill="url(#mgLuz)" opacity=".6"/>
    <g class="deriva"><use href="#nuvem" x="560" y="10" width="86" height="40" style="color:#fff" opacity=".92"/><use href="#nuvem" x="680" y="40" width="64" height="30" style="color:#fff" opacity=".8"/><use href="#nuvem" x="410" y="96" width="54" height="24" style="color:#fff" opacity=".6"/></g>
    <!-- outra margem da baía -->
    <g id="mg-longe" class="toque">
      <path d="M250 176 C290 140 330 128 372 136 C402 120 440 118 470 132 C500 122 540 126 574 146 C610 140 650 150 700 176Z" fill="url(#mgMorro)"/>
      <path d="M300 176 C340 158 380 152 420 158 C460 148 500 152 540 164 C570 160 610 166 640 176Z" fill="url(#mgMorro2)"/>
      <g>${[[408, 146, '#FFF2E0', '#E0583A'], [418, 144, '#FFE27A', '#C8402A'], [428, 147, '#BFE6FF', '#E0583A'], [438, 145, '#FFFFFF', '#B8442E'], [449, 148, '#FFC2B0', '#C8402A'], [460, 146, '#E6F6D0', '#E0583A'], [470, 150, '#FFF2E0', '#B8442E'], [396, 151, '#FFD0E6', '#C8402A'], [482, 152, '#FFE27A', '#E0583A']].map(([x, y, c, t]) => `<rect x="${x}" y="${y}" width="8.4" height="6.4" fill="${c}" stroke="#7A8A8A" stroke-width=".4"/><path d="M${x - .8} ${y} L${x + 4.2} ${y - 3.4} L${x + 9.2} ${y}Z" fill="${t}"/><rect x="${x + 3}" y="${y + 3}" width="2" height="3.4" fill="#6E5A4A" opacity=".7"/>`).join('')}</g>
      <g fill="#7A9A88" opacity=".9">${[384, 392, 492, 500, 506].map((x, i) => `<path d="M${x} ${156 - i % 2 * 2} q-4 -3 0 -9 q4 6 0 9Z"/>`).join('')}</g>
      <rect x="250" y="120" width="450" height="56" fill="transparent"/></g>
    <rect x="0" y="170" width="800" height="50" fill="url(#mgBaia)"/>
    <g stroke="#E6FFFF" stroke-width="1.1" fill="none" opacity=".7"><path d="M330 184 h18 M420 192 h26 M520 186 h14 M360 204 h20 M470 208 h22"/></g>
    <rect y="150" width="800" height="70" fill="url(#mgNevoa)" pointer-events="none"/>
    <g id="mg-saveiro" class="toque"><g id="mg-sav-pos" transform="translate(0 0)"><g transform="translate(372 203)"><g style="animation:flutua 3s ease-in-out infinite alternate">
      <path d="M-20 0 C-14 6 14 6 22 -1 L20 -4 H-20Z" fill="#7A4A2A" stroke="#3A2010" stroke-width="1"/><path d="M-19 -2.6 H20" stroke="#FFE27A" stroke-width="1.2"/>
      <path d="M0 -4 V-40" stroke="#4A2E1A" stroke-width="1.4"/><path d="M1 -38 L1 -6 L22 -6 Z" fill="url(#mgVela)" stroke="#8A7A5A" stroke-width=".8"/><path d="M-1 -34 L-1 -7 L-18 -7Z" fill="#F0E2C6" stroke="#8A7A5A" stroke-width=".8"/>
      <path d="M4 -30 l14 20 M4 -22 l10 14" stroke="#C8B48A" stroke-width=".5"/></g></g><rect x="346" y="158" width="56" height="52" fill="transparent"/></g></g>
    <!-- mangue do fundo -->
    <g opacity=".95" pointer-events="none">${longe}</g>
    <path d="M300 236 C360 222 420 226 470 230 C520 222 560 226 600 236 V262 H300Z" fill="#7E9C7A"/>
    <g>${fundoMangue(290, 330, 220, 262, [['#7E9E6E', '#5E7A50', '#B8D0A0']])}${fundoMangue(520, 600, 222, 262, [['#8AA472', '#62804E', '#C2D8A2']])}</g>
    <g>${fundoMangue(-10, 300, 184, 262, [['#5E8A5A', '#3E6A42', '#9EC48E'], ['#6E9A50', '#46703A', '#B4D08A'], ['#7A9A6A', '#56744A', '#B8CCA0']])}${fundoMangue(560, 810, 188, 262, [['#6A8E62', '#46684A', '#A8C898'], ['#86A060', '#5E7A42', '#C4D896'], ['#5E8264', '#3E6046', '#9EBE9A']])}</g>
    ${raizesLonge(-10, 810, 270)}
    <!-- lama do manguezal -->
    <path d="M0 262 H800 V446 C700 440 640 452 560 446 C470 438 400 450 300 444 C200 438 110 450 0 444Z" fill="url(#mgLama)"/>
    <g>${Array.from({ length:9 }, () => `<ellipse cx="${F(R(30, 770))}" cy="${F(R(290, 430))}" rx="${F(R(30, 70))}" ry="${F(R(5, 10))}" fill="#6A4E36" opacity=".35"/>`).join('')}</g>
    <g id="mg-canais">${[[214, 300, 206, 446, 3.6], [334, 336, 324, 446, 3], [612, 384, 604, 446, 3.4]].map(([x0, y0, x1, y1, w]) => { const d = `M${x0} ${y0} C${x0 + 14} ${y0 + (y1 - y0) * .3} ${x1 - 16} ${y0 + (y1 - y0) * .55} ${x1 + 6} ${y0 + (y1 - y0) * .78} S${x1 - 4} ${y1 - 6} ${x1} ${y1}`; return `<path d="${d}" stroke="#4A3220" stroke-width="${w + 3}" fill="none" stroke-linecap="round" opacity=".6"/><path d="${d}" stroke="url(#mgCanal)" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFFFFF" stroke-width=".8" fill="none" stroke-dasharray="6 10" opacity=".7" transform="translate(-.8 -.6)"/>`; }).join('')}</g>
    <g id="mg-brilho-lama"><g>${[[470, 300, 26], [560, 312, 20], [250, 362, 16], [420, 362, 22], [534, 390, 14], [356, 420, 18], [662, 430, 20]].map(([x, y, r]) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${r + 2}" ry="${F(r * .24 + 1.4)}" fill="#3E2A1A" opacity=".55"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${F(r * .24)}" fill="url(#mgPoca)"/><ellipse cx="${F(x - r * .3)}" cy="${F(y - r * .05)}" rx="${F(r * .3)}" ry="${F(r * .07)}" fill="#fff" opacity=".7"/><path d="M${F(x - r * .7)} ${F(y + r * .1)} q${F(r * .7)} ${F(r * .08)} ${F(r * 1.3)} -.6" stroke="#fff" stroke-width=".8" fill="none" opacity=".6"/></g>`).join('')}</g>
    <g fill="#FFFFFF">${Array.from({ length:22 }, () => `<ellipse cx="${F(R(240, 790))}" cy="${F(R(296, 440))}" rx="${F(R(10, 36))}" ry="${F(R(.8, 1.8))}" opacity="${F(R(.12, .3))}"/>`).join('')}</g></g>
    ${textura(420, 370, 360, 70, 120, '#4E3624', .9)}${textura(420, 330, 360, 50, 60, '#B49A7A', .8)}
    <g>${Array.from({ length:6 }, () => `<ellipse cx="${F(R(260, 760))}" cy="${F(R(300, 420))}" rx="${F(R(16, 30))}" ry="${F(R(3, 5))}" fill="#6E8A3A" opacity=".35"/>`).join('')}</g>
    <g stroke="#C8AE8A" stroke-width="1.2" fill="none" opacity=".45">${Array.from({ length:16 }, () => { const x = R(240, 760), y = R(300, 436); return `<path d="M${F(x)} ${F(y)} q10 -2.4 20 0 t20 0"/>`; }).join('')}</g>
    <g>${tocas}</g>${pegadas}${conchas}
    <g id="mg-passos" style="opacity:0;transition:opacity 2.4s">${passos(616, 432, 470, 414, 9)}${passos(724, 432, 682, 408, 4)}</g>
    <g>${Array.from({ length:16 }, (_, i) => { const x = R(240, 780), y = R(296, 436), cor = ['#E8C24A', '#D89A3A', '#9AB84A', '#C8742A'][i % 4]; return `<g transform="translate(${F(x)} ${F(y)}) rotate(${F(R(-50, 50))})"><path d="M0 0 C3 -3.6 9 -3.6 12 0 C9 3.6 3 3.6 0 0Z" fill="${cor}" stroke="#6E4A1A" stroke-width=".6"/><path d="M1 0 H11" stroke="#FFF2C0" stroke-width=".5" opacity=".7"/></g>`; }).join('')}</g>
    <path d="M0 420 C120 430 260 424 400 430 C540 436 680 426 800 432 V448 H0Z" fill="#3E2A1C" opacity=".25"/>
    <rect y="262" width="800" height="186" fill="url(#mgLamaBrilho)"/>
    <!-- tocos do mangue cortado -->
    <g id="mg-tocos">${[[294, 320, 13], [368, 312, 11], [436, 324, 10]].map(([x, y, r]) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${r + 6}" ry="${F(r * .32)}" fill="#3E2A18" opacity=".5"/><path d="M${x - r} ${y} V${y - r * 1.2} H${x + r} V${y}Z" fill="url(#mgTronco)" stroke="#3A1E12" stroke-width="1.3"/><path d="M${x - r} ${y} C${x - r - 5} ${y + 2} ${x - r - 8} ${y + 3} ${x - r - 10} ${y + 2} M${x + r} ${y} C${x + r + 5} ${y + 2} ${x + r + 8} ${y + 4} ${x + r + 11} ${y + 3}" stroke="#5E3420" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y - r * 1.2}" rx="${r}" ry="${F(r * .36)}" fill="#E2B88A" stroke="#3A1E12" stroke-width="1.2"/><ellipse cx="${x}" cy="${y - r * 1.2}" rx="${F(r * .6)}" ry="${F(r * .2)}" fill="none" stroke="#B07A54" stroke-width=".8"/><ellipse cx="${x}" cy="${y - r * 1.2}" rx="${F(r * .25)}" ry="${F(r * .09)}" fill="#B07A54"/><path d="M${x - r + 3} ${y - r * .9} v${F(r * .8)}" stroke="#D8A07A" stroke-width="1.2" opacity=".6"/></g>`).join('')}</g>
    <g id="mg-regua" class="toque"><ellipse cx="548" cy="452" rx="8" ry="2.2" fill="#2A1A10" opacity=".4"/><rect x="544.5" y="246" width="7" height="224" rx="1.6" fill="#F6F2EA" stroke="#3A3A44" stroke-width="1.2"/>
      ${Array.from({ length:14 }, (_, i) => `<rect x="545.1" y="${250 + i * 16}" width="5.8" height="8" fill="${i % 2 ? '#3A6EC8' : '#C8402E'}" opacity=".9"/><path d="M551.5 ${250 + i * 16} h2.4" stroke="#3A3A44" stroke-width=".9"/>`).join('')}
      <path d="M546 250 V462" stroke="#fff" stroke-width=".9" opacity=".6"/><rect x="542" y="240" width="12" height="6" rx="2" fill="#5E6470" stroke="#2A2A30" stroke-width="1"/><rect x="536" y="240" width="24" height="236" fill="transparent"/></g>
    <!-- mangue-branco ao fundo -->
    <g id="mg-branco" class="toque"><path d="M486 270 C486 250 482 232 488 214 M486 246 C478 236 470 232 462 226 M487 238 C496 230 504 228 512 222" stroke="#5E4A36" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="${copa(488, 206, 46, 26, 10, .3)}" fill="url(#mgCopaB)" stroke="#5E7A2A" stroke-width="1.3"/><path d="${copa(478, 198, 26, 13, 7, .3)}" fill="#E0EE9A" opacity=".55"/>
      ${folhas(488, 208, 40, 18, 22, '#A8C858', '#5E7A2A', '#F2FAC8')}
      <rect x="440" y="176" width="96" height="100" fill="transparent"/></g>
    <!-- mangue-preto à direita -->
    <g id="mg-preto" class="toque">
      <path d="M690 340 C688 300 694 260 686 220 C684 200 690 180 688 160 M688 250 C672 232 650 222 630 214 M689 228 C708 210 730 200 752 196 M686 196 C670 176 656 170 640 164" stroke="#3A2E22" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M690 340 C688 300 694 260 686 220 C684 200 690 180 688 160 M688 250 C672 232 650 222 630 214 M689 228 C708 210 730 200 752 196 M686 196 C670 176 656 170 640 164" stroke="url(#mgTroncoP)" stroke-width="8.4" fill="none" stroke-linecap="round"/>
      <path d="M686 330 C684 300 690 270 684 236" stroke="#CEC2AE" stroke-width="1.6" fill="none" opacity=".6"/>
      <path d="${copa(692, 130, 112, 58, 14, .24)}" fill="url(#mgCopaP0)" stroke="#3E4E32" stroke-width="1.8"/>
      <path d="${copa(660, 112, 60, 30, 9, .28)}" fill="url(#mgCopaP1)" stroke="#5E6E44" stroke-width="1.2"/><path d="${copa(740, 120, 52, 28, 9, .28)}" fill="url(#mgCopaP1)" stroke="#5E6E44" stroke-width="1.2"/>
      ${folhas(694, 130, 104, 46, 56, '#7E9460', '#3E4E32', '#E2ECC8')}${folhas(700, 140, 96, 40, 24, '#9AAE8E', '#4E5E44', '#F0F6E8')}${folhas(680, 120, 80, 30, 12, '#6E8A3A', '#3E5222', '#DCECB0')}${folhas(690, 110, 60, 22, 26, '#A8B888', '#5E6E44', '#F2F6E0')}
      <path d="${copa(650, 100, 30, 12, 7, .3)}" fill="#E6EEC8" opacity=".35"/>
      <rect x="590" y="70" width="210" height="270" fill="transparent"/></g>
    <g id="mg-pneus">${pneumat(64, 694, 348, 100, 26)}</g>
    <!-- mangue-vermelho grande -->
    <g id="mg-verm" class="toque" data-fig="manguevermelho">
      <path d="M110 268 C108 240 114 212 108 186 M108 214 C90 196 64 186 40 178 M110 200 C130 186 160 178 196 172 M112 236 C140 226 170 212 216 196" stroke="#3A1E12" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M110 268 C108 240 114 212 108 186 M108 214 C90 196 64 186 40 178 M110 200 C130 186 160 178 196 172 M112 236 C140 226 170 212 216 196" stroke="url(#mgTronco)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M106 262 C104 240 108 220 104 196" stroke="#E0A87A" stroke-width="1.8" fill="none" opacity=".55"/>
      ${raiz(110, 262, 18, 400, 50, 6)}${raiz(110, 262, 62, 418, 34, 6.4)}${raiz(112, 260, 152, 424, 40, 6.4)}${raiz(112, 258, 214, 400, 60, 6)}${raiz(108, 250, 0, 352, 30, 5)}
      ${raiz(106, 236, 30, 330, 44, 5)}${raiz(114, 236, 248, 352, 70, 5)}${raiz(150, 220, 186, 380, 30, 4.4)}${tri('M128 256 C190 226 262 236 300 345', '#3A1E12', 'url(#mgRaiz)', 7.4, '#E8B890')}${raiz(80, 200, 44, 300, 26, 4)}${raiz(170, 210, 228, 312, 40, 4.2)}
      <path d="M196 172 C200 220 192 260 196 300 M60 184 C58 220 66 250 60 290 M150 180 C152 220 146 250 150 280" stroke="#4E2E1A" stroke-width="2.4" fill="none" opacity=".8"/>
      <g stroke-linecap="round" fill="none">${[[20, 168, 52], [34, 176, 70], [62, 182, 46], [84, 186, 64], [140, 182, 38], [150, 178, 58], [266, 158, 44], [280, 150, 34]].map(([x, y, h]) => `<path d="M${x} ${y} C${x + 2} ${y + h * .4} ${x - 2} ${y + h * .7} ${x + 1} ${y + h}" stroke="#3A1E12" stroke-width="3"/><path d="M${x} ${y} C${x + 2} ${y + h * .4} ${x - 2} ${y + h * .7} ${x + 1} ${y + h}" stroke="#9A6A48" stroke-width="1.6"/><path d="M${x + 1} ${y + h - 4} v4" stroke="#E8D0A8" stroke-width="2"/>`).join('')}</g>
      ${copaV}
      ${brilhoHotspot(132, 222)}</g>
    <g id="mg-props">${PROPS.map((p, i) => `<g class="mg-prop toque" data-i="${i}" transform="translate(${p.x} ${p.y})" style="cursor:grab"><g class="mg-prop-in"><g class="balanca" style="animation-duration:${F(3 + i * .7)}s">${propagulo(44 + i * 6)}</g></g><g class="mg-prop-hint" style="display:none">${brilhoHotspot(10, 18)}</g><rect x="-12" y="-6" width="24" height="${54 + i * 6}" fill="transparent"/></g>`).join('')}</g>
    <!-- bichos: aratu e chama-marés -->
    <g id="mg-aratu" class="toque"><g id="mg-aratu-pos" transform="translate(54 318) rotate(-50)"><g transform="scale(.42)">${caranguejo(1, false, ['mgAratu', '#6E140A'])}</g></g><rect x="30" y="296" width="48" height="44" fill="transparent"/></g>
    <g id="mg-chama" class="toque">${[[228, 428, 1], [268, 434, -1]].map(([x, y, l], i) => `<g transform="translate(${x} ${y}) scale(${l * .8} .8)"><ellipse cx="0" cy="6" rx="16" ry="3" fill="#1E140A" opacity=".3"/><path d="M-10 2 l-8 6 M-10 -1 l-9 3 M10 2 l8 6 M10 -1 l9 3" stroke="#6E5A3A" stroke-width="2.4" stroke-linecap="round"/><path d="M-12 0 C-12 -9 12 -9 12 0 C10 4 -10 4 -12 0Z" fill="url(#mgChama)" stroke="#6E5A3A" stroke-width="1.2"/><path d="M-4 -6 l-1 -6 M4 -6 l1 -6" stroke="#6E5A3A" stroke-width="1.6"/><circle cx="-5" cy="-13" r="2.4" fill="#1A0E0A"/><circle cx="5" cy="-13" r="2.4" fill="#1A0E0A"/><circle cx="-4.4" cy="-13.6" r=".8" fill="#fff"/><circle cx="5.6" cy="-13.6" r=".8" fill="#fff"/><path d="M-6 -4 q-4 -3 -8 -2" stroke="#6E5A3A" stroke-width="2" stroke-linecap="round"/><g class="mg-garra-g" style="transform-origin:10px -2px"><path d="M10 -2 C14 -8 18 -16 24 -20 C30 -18 28 -8 22 -4 C18 -2 14 -1 10 -2Z" fill="#FF8A3A" stroke="#8A2E0A" stroke-width="1.3"/><path d="M14 -8 C18 -12 22 -15 25 -16" stroke="#FFD08A" stroke-width="2.4" fill="none" stroke-linecap="round"/></g></g>`).join('')}<rect x="200" y="400" width="96" height="44" fill="transparent"/></g>
    <!-- itens da maré seca -->
    <g id="mg-itens">${ITENS.map((it, i) => `<g class="mg-item" data-i="${i}" transform="translate(${it.x} ${it.y})" style="opacity:0;transition:opacity .9s"><g class="mg-it-in">${desenhoItem[it.tipo]()}</g><g class="mg-it-hint" style="display:none">${brilhoHotspot(16, -18)}</g><circle r="24" fill="transparent"/></g>`).join('')}</g>
    <g id="mg-lixos">${LIXO.map((l, i) => `<g class="mg-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab"><g>${desenhoLixo[l.id]}</g><g class="mg-lixo-hint" style="display:none">${brilhoHotspot(16, -16)}</g><circle r="26" fill="transparent"/></g>`).join('')}</g>
    <g id="mg-covas">${COVAS.map((p, i) => `<g class="mg-cova toque" data-i="${i}" style="display:none"><ellipse cx="${p.x}" cy="${p.y}" rx="13" ry="4.6" fill="#3A2614" opacity=".55" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>${brilhoHotspot(p.x + 12, p.y - 14)}<rect x="${p.x - 18}" y="${p.y - 30}" width="36" height="40" fill="transparent"/></g>`).join('')}</g>
    <g id="mg-mudas">${COVAS.map((p, i) => `<g class="mg-muda" data-i="${i}" transform="translate(${p.x} ${p.y})"><g class="mg-muda-in" style="transform-origin:0px 0px;transform:scale(0);transition:transform 1.2s cubic-bezier(.3,1.5,.5,1)">
      <path d="M0 0 V-34" stroke="#3A2A12" stroke-width="5" stroke-linecap="round"/><path d="M0 0 V-34" stroke="url(#mgProp)" stroke-width="3" stroke-linecap="round"/>
      <path d="M0 -2 q-6 2 -9 6 M0 -2 q6 2 9 6 M0 -3 q-2 4 -5 7" stroke="#C89A6A" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      ${[[-1, -36, -1], [1, -38, 1], [-1, -42, -.6], [1, -43, .6]].map(([a, y, l]) => `<path d="M0 ${y} c${l * 4} -4 ${l * 12} -4 ${l * 14} 1 c${-l * 3} 5 ${-l * 10} 4 ${-l * 14} -1Z" fill="#4EA44E" stroke="#1E5A2A" stroke-width=".8"/><path d="M${l * 2} ${y - .4} l${l * 9} -.6" stroke="#B8EAA0" stroke-width=".6"/>`).join('')}</g></g>`).join('')}</g>
    <!-- água da maré -->
    <g id="mg-agua" pointer-events="none">
      <rect x="0" y="${ALTA}" width="800" height="420" fill="url(#mgAgua)"/>
      <g opacity=".22">${[[110, 150, 26, '#1E5A30'], [690, 110, 22, '#4E5E3A'], [488, 46, 10, '#7EA43A'], [300, 60, 8, '#4E7A4A'], [580, 50, 8, '#5E7A4A']].map(([x, rx, ry, c]) => `<ellipse cx="${x}" cy="${ALTA + ry * .6}" rx="${rx}" ry="${ry}" fill="${c}"/>`).join('')}</g>
      <rect x="0" y="${ALTA}" width="800" height="60" fill="url(#mgCaus)" opacity=".3" id="mg-caus"/>
      <g>${[[60, 20], [180, 14], [330, 28], [470, 22], [610, 30], [740, 18]].map(([x, w]) => `<path class="mg-raio" d="M${x} ${ALTA} h${w} L${x + w + 26} ${ALTA + 200} H${x + 10}Z" fill="url(#mgRaio)" opacity=".4"/>`).join('')}</g>
      <rect x="0" y="${ALTA}" width="800" height="12" fill="url(#mgAguaSup)"/>
      <g id="mg-onda1"><path d="M-40 ${ALTA} ${Array.from({ length:44 }, () => 'q10 -3.4 20 0').join(' ')}" stroke="#E6FFFA" stroke-width="2.2" fill="none" opacity=".9"/></g>
      <g id="mg-onda2"><path d="M-60 ${ALTA + 6} ${Array.from({ length:30 }, () => 'q15 3 30 0').join(' ')}" stroke="#BFEAE6" stroke-width="1.2" fill="none" opacity=".5"/></g>
      <g fill="#fff">${[90, 200, 320, 450, 560, 690, 760].map((x, i) => `<rect class="brilho" style="animation-delay:${F(i * .5)}s" x="${x}" y="${ALTA + 4 + i % 3 * 3}" width="${10 + i % 2 * 8}" height="1.6" rx=".8"/>`).join('')}</g>
    </g>
    <rect id="mg-agua-toque" x="0" y="${BAIXA + 6}" width="800" height="${500 - BAIXA - 6}" fill="transparent"/>
    <!-- cavalo-marinho no canal (sempre submerso) -->
    <g id="mg-cavalo" class="toque" data-fig="cavalomarinho" opacity=".92"><g transform="translate(468 474)"><g style="animation:flutua 2.6s ease-in-out infinite alternate"><svg x="-16" y="-24" width="32" height="40" viewBox="0 0 100 130"><use href="#f-cavalomarinho"/></svg></g></g>${brilhoHotspot(492, 452)}<rect x="446" y="444" width="48" height="52" fill="transparent"/></g>
    <!-- cesto (samburá) da marisqueira -->
    <g id="mg-cesto" style="opacity:0;transition:opacity .8s" transform="translate(${CESTO.x} ${CESTO.y})">
      <ellipse cx="0" cy="2" rx="22" ry="4" fill="#1E140A" opacity=".3"/>
      <path d="M-18 0 C-22 -14 -18 -26 -14 -28 H14 C18 -26 22 -14 18 0 C10 4 -10 4 -18 0Z" fill="url(#mgCesto)" stroke="#5E3A14" stroke-width="1.4"/>
      <path d="M-19 -8 C-8 -5 8 -5 19 -8 M-19 -16 C-8 -13 8 -13 19 -16" stroke="#7A4E1E" stroke-width="1.2" fill="none"/><path d="M-10 -27 l-2 27 M0 -27.6 v28 M10 -27 l2 27" stroke="#7A4E1E" stroke-width=".9" opacity=".7"/>
      <g id="mg-cesto-dentro">${[[-8, -28, 'ostra'], [6, -30, 'uca'], [0, -32, 'sururu']].map(([x, y, t]) => `<g transform="translate(${x} ${y})" style="opacity:0;transition:opacity .5s">${t === 'ostra' ? ostra(.4, false) : t === 'uca' ? caranguejo(.32) : sururu(.4)}</g>`).join('')}</g>
      <ellipse cx="0" cy="-28" rx="14" ry="3.4" fill="#5E3A14" opacity=".55"/><path d="M-14 -28 C-12 -40 12 -40 14 -28" stroke="#7A4E1E" stroke-width="2" fill="none"/></g>
    <!-- canoa com motor -->
    <g id="mg-canoa"><g id="mg-canoa-pos" transform="translate(${CAN_X} ${ALTA - 4})"><g style="animation:flutua 3.4s ease-in-out infinite alternate">
      <ellipse cx="0" cy="12" rx="110" ry="6" fill="#0E3A3A" opacity=".3"/>
      <path d="M86 -2 l10 0 l6 16 l4 16" stroke="#2A2A30" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="90" y="-14" width="16" height="13" rx="3" fill="#E5392C" stroke="#7A1410" stroke-width="1.2"/><path d="M93 -10 h10" stroke="#FFB8A8" stroke-width="1.2"/><path d="M104 28 l4 4 l-6 2Z" fill="#5A5E6A"/>
      <path d="M-100 -12 C-96 -20 92 -22 96 -14 L96 -8 H-100Z" fill="#7A4A2A" stroke="#3A2010" stroke-width="1.2"/><path d="M-80 -14 V-6 M-30 -16 V-7 M20 -16 V-7 M70 -15 V-7" stroke="#3A2010" stroke-width="2.4"/>
      <g id="mg-saco"><path d="M18 -10 C14 -24 20 -34 30 -36 C42 -34 48 -24 44 -10Z" fill="url(#mgSaco)" stroke="#7A8494" stroke-width="1.3"/><path d="M26 -36 l4 -4 l4 4" stroke="#7A8494" stroke-width="1.4" fill="none"/><path d="M22 -14 C28 -20 36 -20 42 -14 M24 -22 l16 0" stroke="#B8C0CC" stroke-width=".8" fill="none"/><g id="mg-saco-dentro">${['#C8ECE6', '#F4F8FF', '#FFB020'].map((c, i) => `<circle cx="${24 + i * 7}" cy="-36" r="4" fill="${c}" stroke="#5A6070" stroke-width=".8" style="opacity:0;transition:opacity .4s"/>`).join('')}</g></g>
      <path d="M-40 -8 l-4 -14 h14 l-2 14" fill="#E2B870" stroke="#6E4418" stroke-width="1" opacity=".9"/>
    </g></g></g>
    <!-- marisqueiras -->
    <g id="mg-mA" class="toque"><g id="mg-mA-pos" transform="translate(${MA.canoa.x} ${ALTA + MA.canoa.dy})"><g class="mg-anda"><g transform="scale(1.62)">${mulherA()}</g></g></g></g>
    <g id="mg-mB" class="toque"><g id="mg-mB-pos" transform="translate(${MB.canoa.x} ${ALTA + MB.canoa.dy})"><g class="mg-anda"><g transform="scale(1.58)">${mulherB()}</g></g></g></g>
    <g id="mg-canoa-frente" pointer-events="none"><g id="mg-canoa-f-pos" transform="translate(${CAN_X} ${ALTA - 4})"><g style="animation:flutua 3.4s ease-in-out infinite alternate">
      <path d="M-104 -12 C-96 -6 92 -6 98 -14 C96 6 84 14 66 14 H-74 C-92 14 -102 6 -104 -10Z" fill="url(#mgCanoa)" stroke="#0E2A5A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-100 -6 C-60 0 60 0 96 -8" stroke="#FFE27A" stroke-width="3" fill="none"/><path d="M-98 1 C-60 6 60 6 92 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>
      <path d="M-104 -10 C-96 -4 92 -4 98 -12" stroke="#E5392C" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M-80 4 C-40 9 40 9 80 2" stroke="#0E2A5A" stroke-width="1" fill="none" opacity=".5"/><path d="M-90 -9 q4 -1 8 0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    </g></g></g>
    <!-- colhereiros -->
    <g id="mg-colh" class="toque" data-fig="colhereiro"><g id="mg-colh-pos"><g style="animation:flutua 3.2s ease-in-out infinite alternate"><svg x="738" y="30" width="50" height="60" viewBox="0 0 100 120"><use href="#mg-colh-corpo"/></svg></g></g>${brilhoHotspot(786, 40)}<rect x="736" y="28" width="56" height="62" fill="transparent"/></g>
    <g id="mg-bando" style="display:none">${[[0, -40, 60, 58], [0, -70, 132, 38], [0, 20, 250, 120], [0, 0, 640, 76], [0, -20, 700, 64], [0, -50, 200, 52]].map(([dx, dy, x, y], i) => `<g class="mg-gb" data-x="${x}" data-y="${y}" data-dx="${dx}" data-dy="${dy}" transform="translate(${x + 600} ${y + dy})"><g transform="scale(${i % 2 ? -1.5 : 1.5} 1.5)">${guaraMini()}</g></g>`).join('')}</g>
    <!-- amigo: Uçá -->
    <g id="mg-uca" class="toque" data-fig="caranguejouca"><g transform="translate(170 186)"><g class="mg-uca-sobe"><g id="mg-uca-in" style="transform-origin:46px 60px"><ellipse cx="46" cy="60" rx="30" ry="4" fill="#1E140A" opacity=".25"/><svg x="0" y="0" width="92" height="77" viewBox="0 0 120 100"><use href="#mg-uca-corpo"/></svg></g></g></g>${brilhoHotspot(258, 196)}<rect x="168" y="184" width="94" height="66" fill="transparent"/></g>
    <!-- lua e trilha -->
    <path id="mg-trilha" d="${Array.from({ length:21 }, (_, i) => { const p = LUA(i / 20); return (i ? 'L' : 'M') + F(p.x) + ' ' + F(p.y); }).join(' ')}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 9" stroke-linecap="round" opacity=".85" pointer-events="none"/>
    <g id="mg-seta" pointer-events="none"><path d="M0 0 l-12 -4 l4 10Z" fill="#fff" opacity=".9"/></g>
    <g id="mg-lua" class="toque" style="cursor:grab"><g id="mg-lua-pos" transform="translate(${LUA(0).x} ${LUA(0).y})">
      <circle r="44" fill="url(#mgLuz)" opacity=".7"/><circle class="mg-anel" r="35" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="4 5" opacity=".9"/><circle r="31" fill="url(#mgNoite)" stroke="#2A3A7A" stroke-width="2"/><g fill="#FFF6C8">${[[-20, -12, 1.2], [-14, 18, .9], [18, 14, 1.1], [22, -6, .8], [-24, 4, .7], [10, -24, .8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M-24 20 q6 -4 12 0 t12 0 t12 0 t12 0" stroke="#7EC8FF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/><circle r="17" fill="url(#mgLua)" stroke="#7E8CB0" stroke-width="1.6" transform="translate(0 -3)"/>
      <g fill="#C8D2E4" opacity=".85" transform="translate(0 -3) scale(.78)"><circle cx="-7" cy="-5" r="4.6"/><circle cx="6" cy="6" r="3.4"/><circle cx="8" cy="-8" r="2.2"/><circle cx="-4" cy="10" r="2"/></g>
      <path d="M-11 -11 q5 -6 12 -7" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <g class="mg-lua-hint">${brilhoHotspot(28, -26)}</g><circle r="36" fill="transparent"/></g></g>
    <!-- ficha de escolha -->
    <g id="mg-ficha" style="display:none">
      <rect x="0" y="0" width="800" height="500" fill="#0A1A14" opacity=".25"/>
      <g transform="translate(400 150)">
        <rect x="-150" y="-112" width="300" height="230" rx="24" fill="url(#mgFicha)" stroke="#6E4A22" stroke-width="3"/>
        <rect x="-138" y="-100" width="276" height="140" rx="16" fill="#8A6A48" stroke="#5A4230" stroke-width="1.6"/>
        <g opacity=".5">${Array.from({ length:10 }, () => `<ellipse cx="${F(R(-120, 120))}" cy="${F(R(-90, 30))}" rx="${F(R(12, 30))}" ry="${F(R(3, 6))}" fill="#6A4E36"/>`).join('')}</g>
        <g id="mg-ficha-item" transform="translate(0 -24) scale(2.2)"></g>
        <g id="mg-b-levar" class="toque"><circle cx="-62" cy="78" r="30" fill="#3FA864" stroke="#1E5A2A" stroke-width="2.4"/><path d="M-78 70 C-80 82 -76 92 -62 94 C-48 92 -44 82 -46 70Z" fill="#E2B870" stroke="#6E4418" stroke-width="1.6"/><path d="M-78 70 h32 M-77 78 h30 M-76 86 h28" stroke="#8A5A22" stroke-width="1"/><path d="M-74 70 C-72 58 -52 58 -50 70" stroke="#FFF2C8" stroke-width="2.4" fill="none"/><path d="M-82 62 a24 24 0 0 1 14 -10" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".6"/></g>
        <g id="mg-b-devolver" class="toque"><circle cx="62" cy="78" r="30" fill="#2E8AD8" stroke="#123A7A" stroke-width="2.4"/><path d="M44 88 q9 -6 18 0 t18 0" stroke="#BFEFFF" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M74 66 C70 58 56 58 52 66 C50 70 52 74 56 76" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M48 72 l8 6 l2 -10Z" fill="#fff"/><path d="M38 62 a24 24 0 0 1 14 -10" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".6"/></g>
      </g></g>
    <!-- primeiro plano -->
    <g pointer-events="none">
      <path d="M-10 500 C10 470 30 450 60 444 M0 480 C30 460 60 470 90 500 M40 500 C50 470 80 456 120 460" stroke="#2A140A" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M-10 500 C10 470 30 450 60 444 M0 480 C30 460 60 470 90 500 M40 500 C50 470 80 456 120 460" stroke="#7A4A30" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M-6 494 C12 468 30 452 56 446 M44 494 C54 470 80 460 112 462" stroke="#C8906A" stroke-width="1.4" fill="none" opacity=".6"/>
      ${tri('M-10 418 C30 412 70 422 132 436', '#1E2A10', '#5E4A26', 3.6, '#B89A6A')}
      ${[[30, 416, 56, 1], [92, 428, 66, 0]].map(([x, y, L, b]) => `<g transform="translate(${x} ${y})"><g class="balanca" style="animation-duration:${4 + b}s">${propagulo(L)}</g></g>`).join('')}
      ${[[8, 416, -150, 22], [16, 418, -30, 24], [44, 418, -160, 24], [52, 420, -20, 26], [74, 424, -150, 22], [80, 425, -40, 26], [112, 432, -170, 22], [120, 433, -10, 24], [132, 436, -60, 20]].map(([x, y, a, L], i) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C${L * .3} -${L * .3} ${L * .75} -${L * .3} ${L} 0 C${L * .75} ${L * .3} ${L * .3} ${L * .3} 0 0Z" fill="${['#2E7A3E', '#3E8E46', '#2A6E52', '#4E9A3A'][i % 4]}" stroke="#0E3A1E" stroke-width="1.2"/><path d="M2 0 H${L * .85}" stroke="#A8E0A0" stroke-width=".9"/><path d="M${L * .2} -${L * .14} q${L * .3} -${L * .1} ${L * .6} 0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".45"/></g>`).join('')}
      <g>${tri('M700 -4 C716 8 744 12 806 6', '#1E2A10', '#5E4A26', 3, '#B89A6A')}${[[706, 2, 100, 22], [720, 7, 70, 24], [734, 10, 120, 20], [760, 11, 60, 22], [778, 10, 110, 20]].map(([x, y, a, L], i) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C${L * .3} -${L * .3} ${L * .75} -${L * .3} ${L} 0 C${L * .75} ${L * .3} ${L * .3} ${L * .3} 0 0Z" fill="${['#2E7A3E', '#3E8E46', '#2A6E52'][i % 3]}" stroke="#0E3A1E" stroke-width="1.1"/><path d="M2 0 H${L * .85}" stroke="#A8E0A0" stroke-width=".8"/></g>`).join('')}<g transform="translate(726 8)"><g class="balanca" style="animation-duration:4.6s">${propagulo(46)}</g></g></g>
      ${[[20, 452, -40], [40, 440, -10], [64, 450, 20], [8, 470, -70], [96, 458, 30]].filter(() => false).map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C-6 -10 -6 -24 0 -32 C6 -24 6 -10 0 0Z" fill="#2E6A3A" stroke="#0E3A1E" stroke-width="1.2"/><path d="M0 -2 V-28" stroke="#8AC87A" stroke-width=".9"/></g>`).join('')}
      ${[[772, 500, 0], [792, 496, 18], [752, 500, -20], [800, 470, 40]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C-2 -30 2 -60 0 -${84 - i * 8}" stroke="#2E5A1E" stroke-width="3" fill="none"/>${Array.from({ length:7 }, (_, k) => { const yy = -12 - k * 10; return `<path d="M0 ${yy} c-12 -2 -20 -8 -22 -16 c10 0 18 6 22 12Z M0 ${yy - 4} c12 -2 20 -8 22 -16 c-10 0 -18 6 -22 12Z" fill="${k % 2 ? '#4E9A3A' : '#3E8A34'}" stroke="#1E4A1A" stroke-width=".8"/>`; }).join('')}</g>`).join('')}
    </g>
    <rect width="800" height="500" fill="url(#mgVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#mgGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  s.querySelectorAll('.mg-raio').forEach((r, i) => r.animate([{ opacity:.2 }, { opacity:.55 }, { opacity:.2 }], { duration:4200 + i * 700, iterations:Infinity }));
  el(s, '#mg-onda1').animate([{ transform:'translateX(0)' }, { transform:'translateX(20px)' }], { duration:2400, iterations:Infinity });
  el(s, '#mg-onda2').animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)' }], { duration:3600, iterations:Infinity });
  const trilha = el(s, '#mg-trilha'); trilha.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-22 }], { duration:900, iterations:Infinity });
  s.querySelectorAll('.mg-asa').forEach((a, i) => a.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(-.6)' }], { duration:280 + i * 30, iterations:Infinity, direction:'alternate' }));
  const bolhas = (x, y, n, topo) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-8, 8), y:y + sorte(-4, 4), vy:sorte(.6, 1.4), r:sorte(1.4, 3.4), topo:topo || nivel + 2, f:sorte(0, 6) }); };
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-8, 8), y, t:i * 2, cor:cor || '#E6FFFA' }); };
  /* ---------- maré ---------- */
  const mA = el(s, '#mg-mA-pos'), mB = el(s, '#mg-mB-pos');
  let naCanoa = true;
  const pos = { A:{ x:MA.canoa.x, y:ALTA + MA.canoa.dy }, B:{ x:MB.canoa.x, y:ALTA + MB.canoa.dy } };
  const poeM = (g, p) => g.setAttribute('transform', `translate(${F(p.x)} ${F(p.y)})`);
  function poeNivel(n){
    nivel = n; const d = n - ALTA;
    el(s, '#mg-agua').setAttribute('transform', `translate(0 ${F(d)})`); el(s, '#mg-brilho-lama').style.opacity = F(Math.max(0, (n - ALTA - 40) / (BAIXA - ALTA - 40)));
    el(s, '#mg-canoa-pos').setAttribute('transform', `translate(${CAN_X} ${F(n - 4)})`); el(s, '#mg-canoa-f-pos').setAttribute('transform', `translate(${CAN_X} ${F(n - 4)})`);
    if (naCanoa) { pos.A.y = n + MA.canoa.dy; pos.B.y = n + MB.canoa.dy; poeM(mA, pos.A); poeM(mB, pos.B); }
    s.querySelectorAll('.mg-item').forEach(g => { const it = ITENS[+g.dataset.i]; if (!g.dataset.feito) g.style.opacity = n > it.y + 8 ? 1 : 0; });
  }
  const luaPos = el(s, '#mg-lua-pos'), seta = el(s, '#mg-seta');
  function poeLua(k){ luaK = Math.max(0, Math.min(1, k)); const p = LUA(luaK); luaPos.setAttribute('transform', `translate(${F(p.x)} ${F(p.y)})`); }
  function poeSeta(){ const k = fase === 'mare' ? Math.min(1, luaK + .32) : Math.max(0, luaK - .32), p = LUA(k), q = LUA(fase === 'mare' ? k - .02 : k + .02), a = Math.atan2(p.y - q.y, p.x - q.x) * 180 / Math.PI; seta.setAttribute('transform', `translate(${F(p.x)} ${F(p.y)}) rotate(${F(a)})`); }
  poeLua(0); poeSeta(); el(s, '#mg-lua .mg-anel').animate([{ transform:'rotate(0deg)' }, { transform:'rotate(360deg)' }], { duration:12000, iterations:Infinity }); seta.animate([{ opacity:.3 }, { opacity:1 }, { opacity:.3 }], { duration:1300, iterations:Infinity });
  let falouMare = 0;
  function mudaMare(k){
    poeLua(k); poeNivel(ALTA + (BAIXA - ALTA) * luaK); poeSeta();
    if (fase === 'mare') {
      chip(`Maré baixando: ${Math.round(luaK * 100)}%`);
      if (luaK > .35 && falouMare < 1) { falouMare = 1; api.diz('A maré está vazando! A água volta devagar para o mar.'); }
      if (luaK > .7 && falouMare < 2) { falouMare = 2; api.diz('Olha as raízes do mangue aparecendo! E as tocas na lama.'); }
      if (luaK >= .99) mareSeca();
    } else if (fase === 'enche') {
      chip(`Maré enchendo: ${Math.round((1 - luaK) * 100)}%`);
      filhotes = Math.min(1, (1 - luaK) * 1.2);
      if (luaK <= .01) mareCheia();
    }
  }
  let arrLua = null, animLua = false;
  function passoLua(alvo){
    animLua = true; const k0 = luaK, t0 = performance.now(); toca('glub');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1100), e = k * k * (3 - 2 * k); mudaMare(k0 + (alvo - k0) * e); if (k < 1 && (fase === 'mare' || fase === 'enche')) requestAnimationFrame(q); else animLua = false; })(t0);
  }
  el(s, '#mg-lua').addEventListener('pointerdown', e => {
    e.stopPropagation();
    if ((fase !== 'mare' && fase !== 'enche') || animLua) { if (fase !== 'mare' && fase !== 'enche') falaLua(); return; }
    const p = c.ponto(e); arrLua = { px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); el(s, '#mg-lua').style.cursor = 'grabbing';
  });
  s.addEventListener('pointermove', e => {
    if (!arrLua) return; const p = c.ponto(e); if (Math.hypot(p.x - arrLua.px, p.y - arrLua.py) > 6) arrLua.moveu = true; if (!arrLua.moveu) return;
    let melhor = luaK, md = 1e9; for (let i = 0; i <= 60; i++) { const q = LUA(i / 60), dd = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (dd < md) { md = dd; melhor = i / 60; } }
    if (fase === 'mare') melhor = Math.max(melhor, luaK - .05); else melhor = Math.min(melhor, luaK + .05);
    mudaMare(melhor);
  });
  s.addEventListener('pointerup', () => {
    if (!arrLua) return; const a = arrLua; arrLua = null; el(s, '#mg-lua').style.cursor = 'grab';
    if (!a.moveu && (fase === 'mare' || fase === 'enche')) passoLua(fase === 'mare' ? Math.min(1, luaK + .34) : Math.max(0, luaK - .34));
  });
  let luaFala = 0;
  function falaLua(){ toca('clique'); c.brilhos(LUA(luaK).x, LUA(luaK).y, 4, '#FFFFFF'); api.diz(['A Lua puxa a água do mar. Por isso a maré sobe e desce todo dia.', 'Na Lua cheia e na Lua nova, as marés ficam mais fortes: a água sobe mais e desce mais.'][luaFala++ % 2]); }
  /* caminhar das marisqueiras */
  function anda(g, p, x1, y1, ms, fim){
    const x0 = p.x, y0 = p.y, t0 = performance.now(), inner = el(g, '.mg-anda');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); p.x = x0 + (x1 - x0) * e; p.y = y0 + (y1 - y0) * e - Math.abs(Math.sin(k * Math.PI * 6)) * 3; poeM(g, p);
      inner.setAttribute('transform', `rotate(${F(Math.sin(k * Math.PI * 6) * 3)})`);
      if (k < 1) requestAnimationFrame(q); else { inner.setAttribute('transform', ''); fim && fim(); } })(t0);
  }
  function mareSeca(){
    fase = 'desce'; trilha.style.display = 'none'; seta.style.display = 'none'; el(s, '#mg-lua .mg-lua-hint').style.display = 'none';
    toca('ok'); c.brilhos(400, 380, 8, '#FFF2C8'); chip('Maré seca!');
    api.diz('Maré seca! Duas vezes por dia a maré enche e duas vezes ela vaza.');
    for (let i = 0; i < 6; i++) depois(300 + i * 400, () => { const y = sorte(320, 420); bolhas(sorte(260, 560), y, 2, y - 12); });
    depois(2400, () => {
      naCanoa = false; toca('splash'); respinga(600, BAIXA, 4);
      depois(900, () => el(s, '#mg-passos').style.opacity = 1); anda(mA, pos.A, MA.lama.x, MA.lama.y, 2600, () => { el(s, '#mg-cesto').style.opacity = 1; toca('pop'); });
      depois(500, () => anda(mB, pos.B, MB.lama.x, MB.lama.y, 1800));
      api.diz('As marisqueiras descem da canoa. Na maré seca, elas pegam mariscos com as mãos, na lama.');
      depois(5600, comecaEscolha);
    });
  }
  /* ---------- 2. mariscar com cuidado ---------- */
  const itens = [...s.querySelectorAll('.mg-item')];
  function comecaEscolha(){
    fase = 'escolha'; chip('Mariscos: 0/6'); itens.forEach(g => { g.classList.add('toque'); el(g, '.mg-it-hint').style.display = ''; g.style.opacity = 1; });
    itens.forEach((g, i) => el(g, '.mg-it-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:1200 + i * 120, iterations:Infinity }));
    api.diz('Toque nos bichos da lama e escolha: levar no cesto ou devolver ao mangue.');
  }
  const ficha = el(s, '#mg-ficha');
  itens.forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'escolha' || g.dataset.feito || ocupado) return;
    const i = +g.dataset.i, it = ITENS[i]; abertoI = i; ocupado = true; toca('clique');
    el(s, '#mg-ficha-item').innerHTML = desenhoItem[it.tipo]();
    ficha.style.display = ''; ficha.animate([{ opacity:0 }, { opacity:1 }], { duration:250 });
    el(ficha, 'g[transform^="translate(400"]').animate([{ transform:'scale(.6)' }, { transform:'scale(1)' }], { duration:320, easing:'cubic-bezier(.3,1.4,.5,1)' });
    const dica = { ostraG:'Que ostra grande!', ostraP:'Uma ostra pequenininha.', caranguejoG:'Um caranguejo-uçá grandão!', caranguejoP:'Um caranguejo pequenininho.', femea:'Uma caranguejo... olha embaixo dela!', sururu:'Um grupinho de sururu.' };
    api.diz(dica[it.tipo]);
  }));
  const RESP = {
    ostraG:['Ostra grande, pode levar!', 'Essa ostra já cresceu, pode ir para o cesto!'],
    ostraP:['Ela ainda é pequenininha. Vamos deixar na raiz para crescer!', 'Isso! A ostra pequena fica presa na raiz para crescer.'],
    caranguejoG:['Caranguejo grande, pode levar!', 'Esse já está grandão, pode ir para o cesto!'],
    caranguejoP:['É um filhote! Ele volta para a toca para crescer.', 'Isso! O filhote volta para a toca e vai crescer.'],
    femea:['Olha embaixo dela: são ovinhos! A mamãe caranguejo volta para o mangue.', 'Muito bem! A mamãe leva os ovinhos. Ela volta para o mangue.'],
    sururu:['Sururu! É um marisco que vive em grupinhos na lama.', 'Esse sururu já está grande, pode ir para o cesto!']
  };
  function escolhe(levar){
    if (abertoI < 0) return; const i = abertoI, it = ITENS[i], g = itens[i]; abertoI = -1;
    ficha.style.display = 'none'; g.dataset.feito = 1; el(g, '.mg-it-hint').style.display = 'none'; g.classList.remove('toque');
    const certo = levar === it.levar; if (certo) acertos++;
    api.diz(RESP[it.tipo][levar ? 0 : 1]);
    if (it.levar) {
      toca(certo ? 'ok' : 'pop');
      voaItem(g, it, CESTO.x, CESTO.y - 26, () => { g.style.display = 'none'; const dentro = el(s, '#mg-cesto-dentro').children[{ ostraG:0, caranguejoG:1, sururu:2 }[it.tipo]]; dentro.style.opacity = 1; c.brilhos(CESTO.x, CESTO.y - 30, 5, '#FFE27A'); toca('pop'); fim1(); });
    } else {
      toca(certo ? 'ok' : 'glub');
      if (it.tipo === 'ostraP') { c.brilhos(it.x, it.y, 5, '#FFB8D0'); el(g, '.mg-it-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.3)' }, { transform:'scale(1)' }], { duration:700 }); depois(800, fim1); }
      else { const dir = it.x < 400 ? -1 : 1; const a = g.animate([{ transform:`translate(${it.x}px,${it.y}px) scale(1)`, opacity:1 }, { transform:`translate(${it.x + dir * 18}px,${it.y - 4}px) scale(.8)`, opacity:1, offset:.6 }, { transform:`translate(${it.x + dir * 24}px,${it.y}px) scale(.1)`, opacity:0 }], { duration:1400, easing:'ease-in', fill:'forwards' }); a.onfinish = () => { if (!vivo) return; bolhas(it.x + dir * 24, it.y, 3, it.y - 30); fim1(); }; }
    }
  }
  function voaItem(g, it, x1, y1, fim){ const x0 = it.x, y0 = it.y, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 800), e = k * k * (3 - 2 * k); g.setAttribute('transform', `translate(${F(x0 + (x1 - x0) * e)} ${F(y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50)}) scale(${F(1 - .6 * e)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  function fim1(){
    escolhidos++; ocupado = false; chip(`Mariscos: ${escolhidos}/6`);
    if (escolhidos === 6) { toca('vitoria'); c.brilhos(CESTO.x, CESTO.y - 40, 10, '#FFE27A');
      depois(1800, () => api.diz(acertos >= 5 ? 'Cesto cheio! Pegar só os grandes garante marisco amanhã e para os netos.' : 'Cesto cheio! Pegar só os grandes garante marisco amanhã. Você aprendeu direitinho!'));
      depois(6400, () => { festaUca(); api.diz('Na época da andada, os caranguejos saem das tocas para namorar. Aí ninguém pega caranguejo: é o defeso.'); });
      depois(13400, comecaLixo); }
  }
  el(s, '#mg-b-levar').addEventListener('click', e => { e.stopPropagation(); escolhe(true); });
  el(s, '#mg-b-devolver').addEventListener('click', e => { e.stopPropagation(); escolhe(false); });
  /* ---------- 3. cuidar do mangue: lixo, mudas e a maré que volta ---------- */
  let arr = null;
  function arrastavel(g, ok, x0, y0, solta){
    const st = { x:x0, y:y0 };
    g.addEventListener('pointerdown', e => { if (!ok() || ocupado || arr) return; e.stopPropagation(); const p = c.ponto(e); arr = { g, st, solta, dx:p.x - st.x, dy:p.y - st.y, px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique'); });
    return st;
  }
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); if (Math.hypot(p.x - arr.px, p.y - arr.py) > 8) arr.moveu = true; arr.st.x = Math.max(10, Math.min(790, p.x - arr.dx)); arr.st.y = Math.max(20, Math.min(490, p.y - arr.dy)); arr.g.setAttribute('transform', `translate(${F(arr.st.x)} ${F(arr.st.y)})`); });
  s.addEventListener('pointerup', () => { if (!arr) return; const a = arr; arr = null; a.g.style.cursor = 'grab'; a.solta(a.moveu, a.st.x, a.st.y); });
  function voa(g, st, x1, y1, ms, k1, fim){
    const x0 = st.x, y0 = st.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); st.x = x0 + (x1 - x0) * e; st.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 40;
      g.setAttribute('transform', `translate(${F(st.x)} ${F(st.y)}) scale(${F(1 + (k1 - 1) * e)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  const SACO = () => ({ x:CAN_X + 31, y:nivel - 4 - 24 });
  const lix = [...s.querySelectorAll('.mg-lixo')];
  function comecaLixo(){ fase = 'lixo'; chip('Lixo: 0/3'); lix.forEach(g => el(g, '.mg-lixo-hint').style.display = ''); api.diz('Ih, a maré trouxe lixo para o mangue. Arraste o lixo até o saco branco da canoa.'); }
  lix.forEach((g, i) => {
    const st = arrastavel(g, () => fase === 'lixo' && !g.dataset.feito, LIXO[i].x, LIXO[i].y, (moveu, x, y) => {
      const sc = SACO();
      if (!moveu || Math.hypot(x - sc.x, y - sc.y) < 90) recolhe(g, st, i); else { voa(g, st, LIXO[i].x, LIXO[i].y, 500, 1); toca('glub'); api.diz('Leve até o saco branco da canoa!'); }
    });
  });
  function recolhe(g, st, i){
    g.dataset.feito = 1; el(g, '.mg-lixo-hint').style.display = 'none'; const sc = SACO();
    voa(g, st, sc.x, sc.y - 8, 800, .3, () => {
      g.style.display = 'none'; lixos++; toca('pop'); c.brilhos(sc.x, sc.y - 10, 5, '#FFE27A'); el(s, '#mg-saco-dentro').children[lixos - 1].style.opacity = 1; chip(`Lixo: ${lixos}/3`);
      const falas = { garrafa:'Garrafa presa nas raízes, não! Ela vai para a reciclagem.', sacola:'Sacola de plástico pode enroscar nos bichos e nas raízes.', lata:'A lata também vai para a reciclagem.' };
      if (lixos < 3) api.diz(falas[LIXO[i].id]); else { toca('ok'); api.diz('Mangue limpo! O lixo vai embora na canoa.'); depois(2600, comecaMudas); }
    });
  }
  const props = [...s.querySelectorAll('.mg-prop')], covas = [...s.querySelectorAll('.mg-cova')];
  function comecaMudas(){
    fase = 'mudas'; chip('Mudas: 0/3'); covas.forEach(g => g.style.display = ''); props.forEach(g => el(g, '.mg-prop-hint').style.display = '');
    api.diz('Aqui cortaram o mangue. Arraste as canetinhas do mangue-vermelho até a lama para plantar.');
  }
  const livreCova = () => COVAS.findIndex((_, i) => !covas[i].dataset.feito);
  props.forEach((g, i) => {
    const st = arrastavel(g, () => fase === 'mudas' && !g.dataset.feito, PROPS[i].x, PROPS[i].y, (moveu, x, y) => {
      let k = -1, md = 70; COVAS.forEach((p, j) => { if (covas[j].dataset.feito) return; const d = Math.hypot(x - p.x, y + 30 - p.y); if (d < md) { md = d; k = j; } });
      if (!moveu) k = livreCova();
      if (k >= 0) planta(g, st, k); else { voa(g, st, PROPS[i].x, PROPS[i].y, 500, 1); api.diz('Solte a canetinha num círculo da lama!'); }
    });
    g._st = st;
  });
  covas.forEach((cv, j) => cv.addEventListener('click', e => { e.stopPropagation(); if (fase !== 'mudas' || cv.dataset.feito || ocupado) return; const pi = props.findIndex(p => !p.dataset.feito); if (pi >= 0) planta(props[pi], props[pi]._st, j); }));
  function planta(g, st, k){
    g.dataset.feito = 1; covas[k].dataset.feito = 1; el(g, '.mg-prop-hint').style.display = 'none';
    voa(g, st, COVAS[k].x, COVAS[k].y - 40, 700, 1, () => {
      g.style.display = 'none'; covas[k].style.display = 'none'; mudas++; chip(`Mudas: ${mudas}/3`); toca('planta');
      respinga(COVAS[k].x, COVAS[k].y, 3, '#8B6A4A'); el(s, `.mg-muda[data-i="${k}"] .mg-muda-in`).style.transform = 'scale(1.4)'; c.brilhos(COVAS[k].x, COVAS[k].y - 30, 5, '#C8F0A0');
      if (mudas === 1) api.diz('A canetinha é o propágulo: ela já brota quando ainda está pendurada na árvore!');
      if (mudas === 2) api.diz('Ela fica de pé na lama e logo solta raízes.');
      if (mudas === 3) { toca('vitoria'); api.diz('Daqui a alguns anos, aqui vai ter mangue de novo!'); depois(3800, voltaCanoa); }
    });
  }
  function voltaCanoa(){
    fase = 'volta'; chip('A maré vai voltar'); api.diz('A maré vai encher! Hora de voltar para a canoa.');
    el(s, '#mg-cesto').style.opacity = 0;
    anda(mA, pos.A, MA.canoa.x, BAIXA + MA.canoa.dy, 2600); depois(300, () => anda(mB, pos.B, MB.canoa.x, BAIXA + MB.canoa.dy, 1800, () => {}));
    depois(3200, () => { naCanoa = true; poeNivel(nivel); fase = 'enche'; trilha.style.display = ''; seta.style.display = ''; poeSeta(); el(s, '#mg-lua .mg-lua-hint').style.display = ''; chip('Maré enchendo: 0%');
      api.diz('Arraste a Lua para o alto e a maré vai encher.'); });
  }
  function mareCheia(){
    fase = 'fim'; trilha.style.display = 'none'; seta.style.display = 'none'; el(s, '#mg-lua .mg-lua-hint').style.display = 'none'; filhotes = 1;
    toca('vitoria'); chip('Maré cheia!'); bolhas(150, 380, 8, ALTA + 4); bolhas(600, 400, 6, ALTA + 4);
    api.diz('Maré cheia! Olha os filhotes de peixe escondidos entre as raízes: o mangue é o berçário do mar.');
    depois(2800, chegaBando);
    depois(7600, () => { toca('vitoria'); festaUca(); api.diz('Quem cuida do mangue cuida do mar. Obrigado, marisqueiras, por ensinar a respeitar a maré!'); depois(6500, api.fim); });
  }
  function chegaBando(){
    const b = el(s, '#mg-bando'); b.style.display = ''; toca('pop');
    b.querySelectorAll('.mg-gb').forEach((g, i) => { const x = +g.dataset.x, y = +g.dataset.y, dy = +g.dataset.dy; const t0 = performance.now() + i * 220;
      (function q(t){ if (!vivo) return; const k = Math.max(0, Math.min(1, (t - t0) / 2600)), e = 1 - Math.pow(1 - k, 3); g.setAttribute('transform', `translate(${F(x + 600 * (1 - e))} ${F(y + dy * (1 - e) - Math.sin(e * Math.PI) * 20)})`); if (k < 1) requestAnimationFrame(q); })(performance.now()); });
    api.diz('Chegaram os colhereiros! Eles ficam cor-de-rosa porque comem camarõezinhos e outros bichinhos da lama.');
  }
  /* ---------- toques extras ---------- */
  function festaUca(){ el(s, '#mg-uca-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-10deg) translateY(-8px)' }, { transform:'rotate(8deg)' }, { transform:'rotate(0)' }], { duration:900 }); }
  let ucaK = 0;
  el(s, '#mg-uca').addEventListener('click', () => { toca('pop'); festaUca(); [700, 900].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .06, 'square', .03), i * 110));
    const falas = fase === 'escolha' ? ['Pode olhar com calma: só vai para o cesto quem já cresceu!'] : ['Eu cavo minha toca na lama, bem funda, entre as raízes.', 'Eu como folhas do mangue que caem na lama.', 'O mangue fica onde o rio encontra o mar. A água aqui é salobra: meio doce, meio salgada.'];
    api.diz(falas[ucaK++ % falas.length]); });
  let guaraOc = false;
  el(s, '#mg-colh').addEventListener('click', () => { if (guaraOc) return; guaraOc = true; toca('pop');
    const a = el(s, '#mg-colh-pos').animate([{ transform:'translate(0,0)' }, { transform:'translate(-120px,-30px)' }, { transform:'translate(-260px,10px)' }, { transform:'translate(-120px,-20px)' }, { transform:'translate(0,0)' }], { duration:4200, easing:'ease-in-out' });
    a.onfinish = () => { guaraOc = false; }; api.diz('Um colhereiro! O bico dele parece uma colher: ele balança o bico na água rasa para pegar comida.'); });
  el(s, '#mg-cavalo').addEventListener('click', () => { toca('glub'); bolhas(560, 470, 4, nivel + 2); api.diz('Um cavalo-marinho! É o papai que carrega os ovinhos, numa bolsa na barriga.'); });
  el(s, '#mg-verm').addEventListener('click', () => { toca('planta'); api.diz('Mangue-vermelho! As raízes-escora seguram a árvore na lama mole e acalmam as ondas.'); });
  el(s, '#mg-preto').addEventListener('click', () => { toca('planta'); api.diz('Mangue-preto! Essas varetinhas na lama são raízes que saem para respirar.'); });
  el(s, '#mg-branco').addEventListener('click', () => { toca('planta'); api.diz('Mangue-branco! As folhas e a lama do mangue seguram a sujeira e ajudam a limpar a água.'); });
  el(s, '#mg-regua').addEventListener('click', () => { toca('clique'); api.diz('Essa é a régua de maré: as listras mostram quanto a água subiu ou desceu.'); });
  el(s, '#mg-longe').addEventListener('click', () => { toca('clique'); api.diz('Lá do outro lado da baía tem uma cidadezinha do Recôncavo.'); });
  let savX = 0, savOc = false;
  el(s, '#mg-saveiro').addEventListener('click', () => { if (savOc) return; savOc = true; toca('splash'); const x0 = savX, x1 = savX ? 0 : 52, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 3600), e = k * k * (3 - 2 * k); savX = x0 + (x1 - x0) * e; el(s, '#mg-sav-pos').setAttribute('transform', `translate(${F(savX)} 0)`); if (k < 1) requestAnimationFrame(q); else savOc = false; })(t0);
    api.diz('Um saveiro! Esse barco a vela é tradicional na Baía de Todos os Santos.'); });
  let aratuOc = false;
  el(s, '#mg-aratu').addEventListener('click', () => { if (aratuOc) return; aratuOc = true; toca('clique');
    const g = el(s, '#mg-aratu-pos'); const a = g.animate([{ transform:'translate(0,0)' }, { transform:'translate(22px,-40px)' }, { transform:'translate(30px,-56px)' }, { transform:'translate(0,0)' }], { duration:2400, easing:'ease-in-out' });
    a.onfinish = () => { aratuOc = false; }; api.diz('O aratu é um caranguejo vermelhinho que sobe nas raízes do mangue!'); });
  el(s, '#mg-chama').addEventListener('click', () => { toca('pop'); s.querySelectorAll('.mg-garra-g').forEach((g, i) => g.animate([{ transform:'rotate(0)' }, { transform:'rotate(-35deg)' }, { transform:'rotate(0)' }], { duration:420, iterations:4, delay:i * 150 }));
    api.diz('O chama-maré balança a garra grande como quem acena: oi!'); });
  el(s, '#mg-mA').addEventListener('click', e => { e.stopPropagation(); if (arr) return; toca('pop'); el(s, '#mg-mA .mg-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-25deg)' }, { transform:'rotate(12deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    api.diz(['Aprendi com minha avó a ler a maré. Muitas marisqueiras do Recôncavo são de comunidades quilombolas.', 'O mangue dá o sustento da minha família. Por isso a gente cuida dele.'][maisK++ % 2]); });
  el(s, '#mg-mB').addEventListener('click', e => { e.stopPropagation(); if (arr) return; toca('pop'); const cel = el(s, '#mg-mB .mg-cel'); cel.style.opacity = 1; el(s, '#mg-mB .mg-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-70deg)' }], { duration:400, fill:'forwards' }).onfinish = () => depois(2400, () => { cel.style.opacity = 0; el(s, '#mg-mB .mg-braco').animate([{ transform:'rotate(-70deg)' }, { transform:'rotate(0)' }], { duration:400, fill:'forwards' }); });
    api.diz('Eu confiro no celular a tábua das marés: ela diz a hora da maré seca.'); });
  el(s, '#mg-agua-toque').addEventListener('pointerdown', e => { const p = c.ponto(e); if (nivel < BAIXA - 20) return; pulaTainha(p.x); });
  let tainhaOc = false, tainha = null;
  function pulaTainha(x){ if (tainhaOc) return; tainhaOc = true; toca('splash'); respinga(x, nivel + 4, 4); tainha = { x, t0:performance.now() }; depois(1100, () => { respinga(x + 50, nivel + 4, 4); toca('glub'); tainhaOc = false; tainha = null; }); api.diz('Uma tainha pulou! Ela cresce no mangue e depois vai para o mar.'); }
  /* peixinhos, filhotes e bolhas das tocas */
  const cardume = Array.from({ length:9 }, (_, k) => ({ ox:Math.cos(k * 2.4) * (8 + k % 3 * 7), oy:Math.sin(k * 2.4) * (4 + k % 3 * 3), f:sorte(0, 6) }));
  const bercario = Array.from({ length:22 }, (_, k) => ({ x:sorte(20, 260), y:sorte(300, 430), f:sorte(0, 6), v:sorte(.3, .8), e:sorte(.45, .8) })).concat(Array.from({ length:10 }, () => ({ x:sorte(570, 790), y:sorte(320, 430), f:sorte(0, 6), v:sorte(.3, .7), e:sorte(.4, .7) })));
  const peixe = (ctx, x, y, dir, esc, cor, t, f) => { ctx.save(); ctx.translate(x, y); ctx.scale(dir * esc, esc); ctx.fillStyle = cor; ctx.strokeStyle = '#2E4A4A'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, -3.4 + Math.sin(t * 12 + f)); ctx.lineTo(-10, 3.4 + Math.sin(t * 12 + f)); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 2.8, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(4, -.6, .9, 0, 7); ctx.fill(); ctx.restore(); };
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    const ax = 380 + Math.sin(t * .23) * 260, ay = Math.max(nivel + 24, 470) + Math.sin(t * .5) * 6, dir = Math.cos(t * .23) > 0 ? 1 : -1;
    ctx.globalAlpha = .75; cardume.forEach(p => peixe(ctx, ax + p.ox * dir, ay + p.oy + Math.sin(t * 1.6 + p.f) * 2, dir, .9, '#C8D8CC', t, p.f));
    if (filhotes > 0) bercario.forEach(p => { if (p.y < nivel + 10) return; const x = p.x + Math.sin(t * p.v + p.f) * 14, d = Math.cos(t * p.v + p.f) > 0 ? 1 : -1; ctx.globalAlpha = filhotes * .9; peixe(ctx, x, p.y + Math.sin(t * 1.4 + p.f) * 2, d, p.e, p.f > 3 ? '#FFE6A8' : '#D8F0E6', t, p.f); });
    if (tainha) { const k = Math.min(1, (performance.now() - tainha.t0) / 1100), x = tainha.x + 50 * k, y = nivel + 4 - Math.sin(k * Math.PI) * 70; ctx.globalAlpha = 1; ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.cos(k * Math.PI) * .9); ctx.fillStyle = '#B8C8D8'; ctx.strokeStyle = '#3A4A5A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(0, 0, 14, 4.6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-21, -6); ctx.lineTo(-21, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.globalAlpha = .7; ctx.fillRect(-8, -2, 14, 1.2); ctx.globalAlpha = 1; ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(8, -1, 1.3, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.globalAlpha = 1;
  });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1400) { ultB = t; if (nivel > 400) { const y = sorte(320, 425); bolhas(sorte(260, 560), y, 1, y - 10); } else bolhas(sorte(20, 780), 470, 1); } requestAnimationFrame(vida); })(0);
  poeNivel(ALTA); chip('Maré cheia');
  api.diz('Oi! Eu sou o Uçá, um caranguejo do manguezal da Bahia. As marisqueiras chegaram de canoa!');
  api.diz('Arraste a Lua até o horizonte e veja a maré baixar.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
