/* ================= JOGO 9: Antártica, a água congelada ================= */
function jogoAntartida(palco, api){
  semente = 73;
  let vivo = true, fase = 'gelo', postos = 0, krill = 0, neves = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const HOR = 200, FRENTE = 330, GT = 196, LY = 310;
  const VAGAS = [252, 336, 420, 504].map(x => ({ x, y:LY, placa:-1 }));
  const NINHO = { x:592, y:LY - 4 }, INICIO = { x:192, y:LY - 2 };
  const PLACAS = [{ x:298, y:238 }, { x:430, y:226 }, { x:548, y:254 }, { x:372, y:270 }];
  const CARDUME = [{ x:252, y:414 }, { x:396, y:452 }, { x:530, y:406 }];
  const borda = (rx, ry, sem) => { semente = sem; return Array.from({ length:14 }, (_, i) => { const a = i / 14 * Math.PI * 2, j = R(.86, 1.06); return `${(Math.cos(a) * rx * j).toFixed(1)},${(Math.sin(a) * ry * j).toFixed(1)}`; }).join(' '); };
  const placa = (rx, ry, sem) => { const b = borda(rx, ry, sem); return `<ellipse cx="0" cy="${ry * .9}" rx="${rx * 1.05}" ry="${ry * .7}" fill="#1E5A9A" opacity=".35"/><g transform="translate(0 8)"><polygon points="${b}" fill="#7FB8E0" stroke="#4E86B8" stroke-width="1.6"/></g><polygon points="${b}" fill="#F6FBFF" stroke="#9ABCD8" stroke-width="1.8" stroke-linejoin="round"/><path d="M${-rx * .55} ${-ry * .25} q${rx * .3} ${-ry * .4} ${rx * .7} ${-ry * .3}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${rx * .2} ${ry * .2} q${rx * .2} ${ry * .2} ${rx * .4} 0" stroke="#CFE6F5" stroke-width="2" fill="none" stroke-linecap="round"/>`; };
  const filhote = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-12" rx="11" ry="13" fill="#9AA4B4" stroke="#4E5A6E" stroke-width="1.6"/><path d="M-8 -16 q-4 -2 -6 2 M8 -16 q4 -2 6 2" stroke="#B8C0CC" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="0" cy="-26" r="8" fill="#2E3446" stroke="#12141E" stroke-width="1.4"/><circle cx="-3" cy="-27" r="1.6" fill="#fff"/><circle cx="3" cy="-27" r="1.6" fill="#fff"/><path d="M-2 -23 l2 3 l2 -3Z" fill="#E86A3A"/><path d="M-6 0 h4 M2 0 h4" stroke="#E86A3A" stroke-width="2" stroke-linecap="round"/></g>`;
  const camada = (y0, h, k) => { const y1 = y0 - h; return `<path d="M0 ${y0 + 2} C50 ${y0 - 8} 120 ${y0 - 4} 178 ${y0 + 6} L176 ${y1 + 6} C120 ${y1 - 4} 50 ${y1 - 8} 0 ${y1}Z" fill="${k % 2 ? '#F4FAFF' : '#FFFFFF'}" stroke="#B8D4EA" stroke-width="1.4"/><g fill="none" stroke="#9CC8EA" stroke-width="1">${Array.from({ length:6 }, () => `<circle cx="${R(10, 168).toFixed(0)}" cy="${(y0 - h / 2 - 4 + R(-3, 3)).toFixed(0)}" r="${R(1.2, 2.4).toFixed(1)}"/>`).join('')}</g>`; };
  semente = 73;
  const camadasGeleira = Array.from({ length:9 }, (_, k) => { const y = GT + 14 + k * 14; return `<path d="M0 ${y} C40 ${y - 4} 90 ${y + 3} 140 ${y - 1} C170 ${y - 3} 200 ${y + 2} 230 ${y}" stroke="#fff" stroke-width="1.4" fill="none" opacity="${(.55 - k * .04).toFixed(2)}"/><g fill="none" stroke="#fff" stroke-width=".9" opacity=".6">${Array.from({ length:4 }, () => `<circle cx="${R(8, 200).toFixed(0)}" cy="${(y + R(3, 10)).toFixed(0)}" r="${R(1, 2).toFixed(1)}"/>`).join('')}</g>`; }).join('');
  const pico = (px, py, w, base, k) => `<path d="M${px - w} ${base} L${px - w * .45} ${py + (base - py) * .45} L${px} ${py} L${px + w * .1} ${base}Z" fill="url(#anLuz${k})"/><path d="M${px} ${py} L${px + w * .55} ${py + (base - py) * .5} L${px + w} ${base} L${px + w * .1} ${base}Z" fill="url(#anSom${k})"/><path d="M${px} ${py} L${px + w * .1} ${base}" stroke="#fff" stroke-width="1.2" opacity=".7"/><path d="M${px - w * .2} ${py + (base - py) * .3} l${w * .1} ${(base - py) * .2} M${px + w * .3} ${py + (base - py) * .35} l${-w * .06} ${(base - py) * .3}" stroke="#9CC0E2" stroke-width="1.4" fill="none" opacity=".8"/>`;
  const seracs = Array.from({ length:7 }, (_, k) => { const x = 120 + k * 13, h = R(30, 70); return `<path d="M${x} ${GT + 8 + k * 8} l6 -6 l7 4 V${GT + 8 + k * 8 + h} H${x}Z" fill="${k % 2 ? '#CBE8F8' : '#E9F6FD'}" stroke="#8CC4EA" stroke-width="1"/>`; }).join('');
  const estrela = (x, y, c) => `<path d="M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y - 2} L${x + 3} ${y + 1} L${x + 5} ${y + 6} L${x} ${y + 3} L${x - 5} ${y + 6} L${x - 3} ${y + 1} L${x - 7} ${y - 2} L${x - 2} ${y - 2}Z" fill="${c}" stroke="#7A1E10" stroke-width="1"/>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Antártica com geleira, placas de gelo, pinguins, foca, iceberg, krill e baleia-azul">
    <defs>
      <linearGradient id="anCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC8F0"/><stop offset=".7" stop-color="#D8EEFB"/><stop offset="1" stop-color="#FFF4E6"/></linearGradient>
      <linearGradient id="anPlano" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AB4DE"/><stop offset="1" stop-color="#2E6EB0"/></linearGradient>
      <linearGradient id="anFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A78BE"/><stop offset=".6" stop-color="#16488A"/><stop offset="1" stop-color="#0A2656"/></linearGradient>
      <linearGradient id="anMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C6DFF2"/></linearGradient>
      <linearGradient id="anLuz0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2EEF8"/></linearGradient><linearGradient id="anSom0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C6DCEE"/><stop offset="1" stop-color="#AFCBE4"/></linearGradient>
      <linearGradient id="anLuz1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6E8F6"/></linearGradient><linearGradient id="anSom1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8C8E6"/><stop offset="1" stop-color="#7EA8D2"/></linearGradient>
      <linearGradient id="anFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6FBFF"/><stop offset=".35" stop-color="#BFE2F7"/><stop offset="1" stop-color="#3E94D2"/></linearGradient>
      <linearGradient id="anSub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0F2" stop-opacity=".75"/><stop offset="1" stop-color="#3E8AC8" stop-opacity=".2"/></linearGradient>
      <linearGradient id="anChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E4E7A"/><stop offset="1" stop-color="#16284A"/></linearGradient>
      <linearGradient id="anHalo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD6B8" stop-opacity="0"/><stop offset="1" stop-color="#FFD6B8" stop-opacity=".55"/></linearGradient>
      <linearGradient id="anSombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8C8E6"/><stop offset="1" stop-color="#7EA8D2"/></linearGradient>
      <linearGradient id="anBerg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#DDF0FB"/><stop offset="1" stop-color="#A8D4F0"/></linearGradient>
      <linearGradient id="anBergBaixo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FDcF6"/><stop offset="1" stop-color="#3E8AC8"/></linearGradient>
      <radialGradient id="anSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#FFE7A0"/><stop offset="1" stop-color="#FFD070"/></radialGradient>
      <radialGradient id="anVinheta" cx=".5" cy=".42" r=".78"><stop offset=".6" stop-color="#0A2050" stop-opacity="0"/><stop offset="1" stop-color="#0A2050" stop-opacity=".3"/></radialGradient>
      <clipPath id="anGelClip"><path d="M0 ${GT} C50 ${GT - 10} 120 ${GT - 6} 178 ${GT + 4} L186 250 L198 296 L210 322 L0 334Z"/></clipPath>
      <filter id="anGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${HOR + 4}" fill="url(#anCeu)"/>
    <g id="an-sol" class="toque"><circle cx="520" cy="96" r="60" fill="#FFE7A0" opacity=".25"/><circle cx="520" cy="96" r="24" fill="url(#anSolG)"/><circle cx="520" cy="96" r="50" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="300" y="34" width="92" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="640" y="22" width="70" height="32" style="color:#fff" opacity=".7"/></g>
    <g class="voando" style="animation-duration:16s"><path d="M0 60 q7 -7 14 0 q7 -7 14 0" stroke="#3E4A6A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M30 76 q5 -5 10 0 q5 -5 10 0" stroke="#3E4A6A" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <rect y="${HOR - 70}" width="800" height="74" fill="url(#anHalo)"/>
    <g opacity=".75">${[[250, 128, 70], [340, 112, 80], [450, 132, 70], [600, 120, 90], [720, 110, 90]].map(([x, y, w]) => pico(x, y, w, HOR + 2, 0)).join('')}</g>
    <g>${[[220, 150, 60], [300, 138, 70], [400, 158, 60], [560, 146, 70], [660, 140, 80], [770, 154, 60]].map(([x, y, w]) => pico(x, y, w, HOR + 2, 1)).join('')}</g>
    <path d="M140 ${HOR + 2} C300 ${HOR - 6} 500 ${HOR - 4} 800 ${HOR - 2} V${HOR + 3} H140Z" fill="#F4FAFF"/>
    <path d="M0 ${HOR} H800 V${FRENTE} H0Z" fill="url(#anPlano)"/>
    <g stroke="#CFE6F5" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round">${Array.from({ length:20 }, () => { const x = R(200, 780), y = R(HOR + 8, FRENTE - 6); const w = 10 + (y - HOR) * .2; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} h${w.toFixed(0)}"/>`; }).join('')}</g>
    <g fill="#FFF6DC">${Array.from({ length:16 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .41 % 2.4).toFixed(2)}s" x="${(520 - (6 + i * 2.4) + (i * 37) % (12 + i * 4)).toFixed(0)}" y="${(HOR + 6 + i * 7).toFixed(0)}" width="${(8 + i % 3 * 5)}" height="2" rx="1"/>`).join('')}</g>
    <g fill="#fff" opacity=".9">${[[620, 214, 14], [700, 222, 10], [250, 210, 9]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.6}" ry="${r * .35}"/>`).join('')}</g>
    <g id="an-vagas">${VAGAS.map(v => `<ellipse class="an-vaga" cx="${v.x}" cy="${v.y + 2}" rx="38" ry="11" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-width="2.4" stroke-dasharray="7 6"/>`).join('')}</g>
    <g id="an-geleira" class="toque">
      <path d="M0 ${FRENTE} L214 ${FRENTE} C210 360 196 392 160 410 C110 424 50 418 0 410Z" fill="url(#anSub)" stroke="#BFE6FF" stroke-width="1.4" opacity=".9"/>
      <g clip-path="url(#anGelClip)"><rect x="0" y="${GT - 12}" width="230" height="160" fill="url(#anFace)"/>${camadasGeleira}<g fill="#7EC0EA" opacity=".45">${[40, 78, 112, 146, 172].map((x, k) => `<path d="M${x} ${GT + 14} C${x + 4} ${GT + 50} ${x - 3} ${GT + 90} ${x + 2} ${FRENTE}" stroke="#4E9AD6" stroke-width="${3 + k % 2 * 2}" fill="none"/>`).join('')}</g><path d="M150 ${GT + 30} L156 280 M128 ${GT + 40} L132 250 M176 ${GT + 40} L182 300 M100 ${GT + 60} L104 300" stroke="#5EA8DC" stroke-width="2" opacity=".5"/><path d="M178 ${GT + 4} L186 250 L198 296 L210 322" stroke="#3E8AC8" stroke-width="12" opacity=".18" fill="none"/></g>
      <path d="M-4 ${GT + 2} C40 ${GT - 14} 120 ${GT - 12} 182 ${GT + 2} C176 ${GT + 10} 150 ${GT + 8} 130 ${GT + 12} C100 ${GT + 6} 60 ${GT + 12} 30 ${GT + 8} C14 ${GT + 10} 4 ${GT + 8} -4 ${GT + 8}Z" fill="#fff" stroke="#BCD8EE" stroke-width="1.4"/>
      <g fill="#E6F6FF" stroke="#9CC8EA" stroke-width=".8">${[30, 60, 92, 130, 160].map(x => `<path d="M${x} ${GT + 9} l3 ${(9 + x % 7).toFixed(0)} l3 ${-(9 + x % 7).toFixed(0)}Z"/>`).join('')}</g>
      <path d="M0 ${GT} C50 ${GT - 10} 120 ${GT - 6} 178 ${GT + 4} L186 250 L198 296 L210 322" stroke="#7EA8D2" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
      <g id="an-camadas">${[0, 1, 2].map(k => `<g class="an-camada" style="opacity:0;transition:opacity 1s, transform 1s;transform:translateY(-14px)">${camada(GT - k * 12, 12, k)}</g>`).join('')}</g>
      <text x="16" y="284" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#2E5A8A" stroke="#fff" stroke-width="3" paint-order="stroke">geleira</text>
    </g>
    <g transform="translate(118 ${LY + 6})">${placa(96, 14, 5)}</g>
    <g id="an-foca" class="toque" data-fig="foca"><svg x="52" y="${LY - 30}" width="96" height="58" viewBox="0 0 150 90"><use href="#f-foca"/></svg>${brilhoHotspot(132, LY - 26)}</g>
    <g id="an-ninho" transform="translate(${NINHO.x} ${LY + 4})">${placa(60, 17, 9)}</g>
    <g id="an-filhotes">${[[552, LY], [574, LY + 3]].map(([x, y], i) => `<g class="an-filhote"><g style="animation:flutua ${(1.6 + i * .3).toFixed(1)}s ease-in-out infinite alternate">${filhote(x, y, 1)}</g></g>`).join('')}</g>
    <g id="an-adulto" class="toque" data-fig="pinguim"><svg x="618" y="${LY - 56}" width="38" height="56" viewBox="0 0 90 130"><use href="#f-pinguim"/></svg>${brilhoHotspot(650, LY - 50)}</g>
    <g id="an-berg" class="toque"><path d="M660 ${FRENTE} L668 254 L690 214 L712 178 L736 196 L760 168 L786 204 L800 214 V${FRENTE}Z" fill="url(#anBerg)" stroke="#8CB8DE" stroke-width="2" stroke-linejoin="round"/><path d="M712 178 L720 ${FRENTE} M760 168 L752 ${FRENTE}" stroke="#B8D8F0" stroke-width="2"/><path d="M690 214 L700 300 L668 ${FRENTE}Z" fill="#B8DCF4" opacity=".6"/><path d="M736 196 L748 260 L760 168Z M760 168 L770 290 L800 214Z" fill="#9ACDF0" opacity=".55"/><path d="M712 178 L736 196 L760 168 L786 204 C770 196 756 190 744 200 C730 192 720 186 712 178Z" fill="#fff"/><path d="M728 230 l6 30 l-4 26" stroke="#5EAEE0" stroke-width="2.4" fill="none" opacity=".6"/><path d="M662 ${FRENTE - 2} C700 ${FRENTE - 8} 760 ${FRENTE - 6} 800 ${FRENTE - 4}" stroke="#fff" stroke-width="3" stroke-dasharray="8 5" fill="none"/><path d="M684 230 q14 -30 26 -44" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="an-berg-hint" style="display:none">${brilhoHotspot(730, 200)}</g></g>
    <rect y="${FRENTE}" width="800" height="${500 - FRENTE}" fill="url(#anFundo)"/>
    <g opacity=".35">${[[90, 50], [300, 60], [520, 40]].map(([x, w]) => `<path d="M${x} ${FRENTE} L${x + w} ${FRENTE} L${x + w * 2} 500 L${x - w * .6} 500Z" fill="#fff" opacity=".18"/>`).join('')}</g>
    <path d="M0 482 C80 474 160 480 240 476 C330 472 420 482 520 476 C580 472 620 478 650 480 V500 H0Z" fill="url(#anChao)"/>
    <g fill="#3E5E8A">${[[40, 482, 14], [180, 478, 10], [300, 478, 16], [470, 480, 12], [600, 478, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .5}"/>`).join('')}</g>
    ${estrela(110, 486, '#E5603C')}${estrela(380, 484, '#FF8A5A')}${estrela(560, 482, '#E5603C')}
    <g>${[[230, 478], [250, 480], [440, 478]].map(([x, y]) => `<path d="M${x - 6} ${y} C${x - 7} ${y - 14} ${x - 3} ${y - 22} ${x} ${y - 24} C${x + 3} ${y - 22} ${x + 7} ${y - 14} ${x + 6} ${y}Z" fill="#F2E6B8" stroke="#A8925A" stroke-width="1.2"/><ellipse cx="${x}" cy="${y - 22}" rx="3" ry="1.4" fill="#A8925A"/>`).join('')}</g>
    <g opacity=".85">${[[120, 370, 1], [146, 382, .8], [600, 360, .9]].map(([x, y, k], i) => `<g style="animation:flutua ${(3 + i * .7).toFixed(1)}s ease-in-out infinite alternate"><g transform="translate(${x} ${y}) scale(${k})"><path d="M-14 0 C-8 -6 6 -6 14 0 C6 6 -8 6 -14 0Z M-14 0 l-7 -5 v10Z" fill="#E6F6FF" fill-opacity=".7" stroke="#8CC4EA" stroke-width="1"/><circle cx="8" cy="-1" r="1.6" fill="#1E3460"/></g></g>`).join('')}</g>
    <g id="an-berg-baixo" class="toque" style="opacity:.14;transition:opacity 1.6s"><path d="M660 ${FRENTE} L640 372 L652 420 L636 466 L676 494 L760 498 L800 480 V${FRENTE}Z" fill="url(#anBergBaixo)" stroke="#E6F6FF" stroke-width="2.2" stroke-linejoin="round"/><path d="M662 344 l-10 30 M690 420 l20 40 M740 360 l10 50" stroke="#E6F6FF" stroke-width="1.6" opacity=".7"/></g>
    <g id="an-cardumes">${CARDUME.map((k, i) => { semente = 30 + i; return `<g class="an-krill toque" data-i="${i}" data-fig="krill" style="transform-origin:${k.x}px ${k.y}px;transition:transform 1s, opacity 1s"><g style="animation:flutua ${(2.4 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${Array.from({ length:16 }, () => { const x = k.x + R(-40, 40), y = k.y + R(-18, 18), a = R(-30, 30); return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)})"><path d="M-5 0 C-3 -3 3 -3 6 0 C3 2 -3 2 -5 0Z M-5 0 l-3 -2 l0 4Z" fill="#FF8A5A" stroke="#B84A20" stroke-width=".6"/></g>`; }).join('')}</g><g class="an-hint" style="display:none">${brilhoHotspot(k.x + 30, k.y - 20)}</g><ellipse cx="${k.x}" cy="${k.y}" rx="52" ry="30" fill="transparent"/></g>`; }).join('')}</g>
    <g id="an-baleia" class="toque" data-fig="baleiaazul" style="display:none"><g id="an-baleia-pos"><g style="animation:flutua 6s ease-in-out infinite alternate"><svg x="0" y="0" width="250" height="118" viewBox="0 0 170 80" style="overflow:visible"><g transform="translate(170 0) scale(-1 1)"><use href="#f-baleiaazul"/></g></svg></g></g></g>
    <path d="M0 ${FRENTE} ${Array.from({ length:40 }, () => 'q10 -3 20 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.4" fill="none"/>
    <g id="an-placas">${PLACAS.map((p, i) => `<g class="an-placa toque" data-i="${i}" transform="translate(${p.x} ${p.y})" style="cursor:grab"><g style="animation:flutua ${(2.8 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${placa(38, 11, 20 + i)}</g><ellipse cx="0" cy="2" rx="46" ry="20" fill="transparent"/></g>`).join('')}</g>
    <g id="an-neve" class="toque" data-fig="pinguim" transform="translate(${INICIO.x} ${INICIO.y})"><g id="an-neve-in"><svg x="-18" y="-52" width="36" height="52" viewBox="0 0 90 130"><use href="#f-pinguim"/></svg><path d="M-10 -40 q10 -6 20 0" stroke="#FFC83D" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
    <g id="an-mao"><path d="M316 252 C300 278 270 296 256 300" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M252 302 l6 -12 l8 9Z" fill="#fff"/></g>
    <g id="an-nuvem" class="toque" style="opacity:0;pointer-events:none;transition:opacity 1s"><use href="#nuvem" x="20" y="40" width="170" height="80" style="color:#8A97B4"/><use href="#nuvem" x="26" y="42" width="160" height="74" style="color:#E8EEF6"/><use href="#nuvem" x="50" y="70" width="110" height="44" style="color:#C2CCDE"/><path d="M58 70 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="an-nuvem-hint">${brilhoHotspot(170, 56)}</g><rect x="20" y="40" width="170" height="80" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#anVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#anGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#an-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.8, 1.8), r:sorte(2, 4.5), topo:FRENTE + 4, f:sorte(0, 6) }); };
  /* 1. gelo: montar o caminho de placas de gelo até os filhotes */
  const pl = [...s.querySelectorAll('.an-placa')], pos = PLACAS.map(p => ({ x:p.x, y:p.y, vaga:-1 }));
  const poe = i => pl[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  pl.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'gelo' || pos[i].vaga >= 0 || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(230, Math.min(560, p.x - arr.dx)); pos[arr.i].y = Math.max(HOR + 18, Math.min(LY, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; pl[i].style.cursor = 'grab';
    const livres = VAGAS.map((v, k) => k).filter(k => VAGAS[k].placa < 0);
    let melhor = -1, dmin = moveu ? 72 : 1e9;
    livres.forEach(k => { const d = Math.hypot(pos[i].x - VAGAS[k].x, pos[i].y - VAGAS[k].y); if (d < dmin) { dmin = d; melhor = k; } });
    if (melhor >= 0) encaixa(i, melhor); else { toca('glub'); api.diz('Coloque a placa de gelo em cima de um tracejado.'); }
  });
  function desliza(i, x1, y1, ms, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e; poe(i); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function encaixa(i, k){
    VAGAS[k].placa = i; pos[i].vaga = k; pl[i].style.cursor = 'default';
    desliza(i, VAGAS[k].x, VAGAS[k].y, 500, () => {
      postos++; toca('pop'); c.add({ tipo:'respingo', x:VAGAS[k].x, y:VAGAS[k].y + 10, t:0, cor:'#E6F6FF' }); c.brilhos(VAGAS[k].x, VAGAS[k].y - 6, 4, '#FFFFFF');
      s.querySelectorAll('.an-vaga')[k].style.display = 'none';
      api.hud(`<span class="chip">Caminho de gelo: ${postos}/4</span>`);
      if (postos === 2) api.diz('Isso! O gelo flutua na água do mar.');
      if (postos === 4) atravessa();
    });
  }
  const neve = el(s, '#an-neve'), neveIn = el(s, '#an-neve-in');
  let nx = INICIO.x, ny = INICIO.y;
  function pula(x1, y1, ms, alto, fim){
    const x0 = nx, y0 = ny, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); nx = x0 + (x1 - x0) * e; ny = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * alto; neve.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0);
  }
  function atravessa(){
    fase = 'pulando'; api.diz('O caminho ficou pronto! Lá vou eu!');
    const rota = [...VAGAS.map(v => ({ x:v.x, y:v.y - 4 })), { x:NINHO.x + 6, y:NINHO.y }];
    let k = 0;
    (function prox(){ if (k >= rota.length) return chegou(); const p = rota[k++]; pula(p.x, p.y, 520, 26, () => { toca('clique'); depois(120, prox); }); })();
  }
  function chegou(){
    toca('vitoria'); c.brilhos(NINHO.x, NINHO.y - 30, 10, '#FFE27A');
    s.querySelectorAll('.an-filhote').forEach((f, i) => f.animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:400, iterations:3, delay:i * 150 }));
    api.diz('Cheguei nos meus filhotes! Eles estão com fome.');
    depois(3600, comecaIceberg);
  }
  /* 2. iceberg e krill */
  function comecaIceberg(){
    fase = 'iceberg'; el(s, '#an-berg-hint').style.display = '';
    api.hud('<span class="chip">Descubra o iceberg</span>');
    api.diz('Viu aquele iceberg? Toque nele para descobrir um segredo.');
  }
  const revela = () => {
    if (fase !== 'iceberg') return; fase = 'revelado'; el(s, '#an-berg-hint').style.display = 'none';
    el(s, '#an-berg-baixo').style.opacity = 1; toca('glub'); bolhas(720, 420, 8); c.brilhos(720, 400, 8, '#E6F6FF');
    api.diz('Uau! A maior parte do iceberg fica escondida debaixo da água. E ele é de água doce, que se soltou de uma geleira.');
    depois(5600, comecaKrill);
  };
  el(s, '#an-berg').addEventListener('click', e => { e.stopPropagation(); if (fase === 'iceberg') return revela(); toca('clique'); api.diz('É um iceberg, um pedaço de geleira que flutua no mar.'); });
  el(s, '#an-berg-baixo').addEventListener('click', e => { e.stopPropagation(); if (fase === 'iceberg') revela(); });
  function comecaKrill(){
    fase = 'krill'; s.querySelectorAll('.an-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Comida para os filhotes: 0/3</span>');
    api.diz('Esses pontinhos laranja são krill, bichinhos do mar. Toque neles para eu mergulhar e pegar comida!');
  }
  function nada(x1, y1, ms, fim){
    const x0 = nx, y0 = ny, t0 = performance.now(), ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI + 90;
    neveIn.setAttribute('transform', `translate(0 -26) rotate(${ang.toFixed(0)}) translate(0 26)`);
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); nx = x0 + (x1 - x0) * e; ny = y0 + (y1 - y0) * e; neve.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0);
  }
  s.querySelectorAll('.an-krill').forEach(g => g.addEventListener('click', e => {
    if (fase !== 'krill' || ocupado || g.dataset.feito) { if (fase !== 'krill') { toca('glub'); api.diz('É krill! Pequenininho, mas é a comida mais importante daqui.'); } return; }
    g.dataset.feito = 1; ocupado = true; el(g, '.an-hint').style.display = 'none';
    const k = CARDUME[+g.dataset.i]; toca('splash');
    pula(NINHO.x - 30, FRENTE + 6, 500, 30, () => {
      c.add({ tipo:'respingo', x:nx, y:FRENTE, t:0, cor:'#E6F6FF' }); bolhas(nx, FRENTE + 20, 4);
      nada(k.x, k.y, 900, () => {
        toca('glub'); bolhas(k.x, k.y, 6); g.style.transform = 'scale(.45)'; g.style.opacity = .55;
        nada(NINHO.x - 30, FRENTE + 6, 900, () => {
          neveIn.removeAttribute('transform');
          pula(NINHO.x + 6, NINHO.y, 500, 30, () => {
            krill++; ocupado = false; toca('pop'); c.brilhos(NINHO.x - 20, NINHO.y - 30, 5, '#FF8A5A');
            api.hud(`<span class="chip">Comida para os filhotes: ${krill}/3</span>`);
            if (krill === 1) api.diz('Hum! Pinguins, focas e baleias comem krill.');
            if (krill === 3) baleia();
          });
        });
      });
    });
  }));
  function baleia(){
    fase = 'baleia'; const b = el(s, '#an-baleia'), bp = el(s, '#an-baleia-pos'); b.style.display = '';
    api.diz('Os filhotes estão de barriga cheia! Olha quem chegou para comer krill também: a baleia-azul, o maior animal do mundo!');
    [[110, 90], [90, 70]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, 1.1, 'sine', .08, f2), i * 900));
    const t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 6500), e = 1 - Math.pow(1 - k, 3); bp.setAttribute('transform', `translate(${(820 - 640 * e).toFixed(1)} 368)`); if (k < 1) requestAnimationFrame(q); })(t0);
    depois(6800, comecaNeve);
  }
  /* 3. neve: a neve se acumula e vira o gelo da geleira */
  function comecaNeve(){
    fase = 'neve'; const n = el(s, '#an-nuvem'); n.style.opacity = 1; n.style.pointerEvents = '';
    api.hud('<span class="chip">Neve na geleira: 0/3</span>');
    api.diz('Chegou uma nuvem de neve! Toque nela para nevar em cima da geleira.');
  }
  el(s, '#an-nuvem').addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'neve' || ocupado || neves >= 3) return;
    ocupado = true; const k = neves; toca('chuva'); el(s, '#an-nuvem-hint').style.display = 'none';
    for (let i = 0; i < 46; i++) c.add({ tipo:'floco', t:0, x:sorte(20, 180), y:sorte(90, 110) - i * 4, vy:sorte(.8, 1.4), f:sorte(0, 6), r:sorte(2, 3.6), chao:GT - k * 12 + sorte(-6, 4) });
    depois(2600, () => {
      const cam = s.querySelectorAll('.an-camada')[k]; cam.style.opacity = 1; cam.style.transform = 'translateY(0)';
      neves++; ocupado = false; toca('planta'); c.brilhos(90, GT - k * 12 - 6, 6, '#FFFFFF');
      api.hud(`<span class="chip">Neve na geleira: ${neves}/3</span>`);
      if (neves === 1) api.diz('Aqui quase não derrete. A neve de um ano fica em cima da neve do outro.');
      if (neves === 2) api.diz('As camadas de baixo vão ficando apertadas e viram gelo, com bolhinhas de ar presas dentro.');
      if (neves === 3) { fase = 'fim'; toca('vitoria'); el(s, '#an-nuvem').style.opacity = 0; api.diz('A maior parte da água doce do planeta está congelada, e quase todo esse gelo fica aqui na Antártica. Esse gelo levou milhares de anos para se formar!'); depois(6400, api.fim); }
    });
  });
  /* toques extras */
  el(s, '#an-foca').addEventListener('click', () => { toca('glub'); api.diz('A foca-de-weddell abre buracos no gelo com os dentes para respirar.'); });
  el(s, '#an-adulto').addEventListener('click', () => { [880, 700, 880].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .14, 'sawtooth', .03, f * .8), i * 170)); });
  el(s, '#an-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(520, 96, 6, '#FFE7A0'); api.diz('Na Antártica o sol fica baixinho. No verão quase não escurece, e no inverno quase não aparece!'); });
  el(s, '#an-geleira').addEventListener('click', e => { if (fase === 'neve') return; e.stopPropagation(); toca('clique'); api.diz('Uma geleira é um rio de gelo bem lento. Ela foi feita de neve, camada por camada.'); });
  neve.addEventListener('click', () => { if (fase === 'gelo') api.diz('Monte o caminho de gelo para eu chegar nos meus filhotes!'); });
  let ultN = 0;
  (function vida(t){ if (!vivo) return; if (t - ultN > 260) { ultN = t; c.add({ tipo:'floco', x:sorte(0, 800), y:-6, vy:sorte(.5, 1), f:sorte(0, 6), r:sorte(1.4, 3), chao:sorte(220, 480) }); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Caminho de gelo: 0/4</span>');
  api.diz('Oi, eu sou a Neve, uma pinguim! Meus filhotes estão do outro lado. Arraste as placas de gelo para os tracejados e monte um caminho.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
