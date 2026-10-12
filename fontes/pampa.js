/* ================= JOGO 7: Pampa, a água escondida ================= */
function jogoPampa(palco, api){
  semente = 91;
  let vivo = true, fase = 'vento', vel = 0, ang = 0, bomba = 0, etapa = 0, voando = false, chuvas = 0, chovendo = false, aquif = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const SUP = 372, CX = 650, CY = 214, META = 100;
  const LAMA = { x:292, y:364 }, POSTE = { x:420, y:316 }, POUSO = { x:360, y:312 };
  const tufo = (x, y, h, cor) => `<path d="M${x} ${y} q-3 -${(h*.5).toFixed(0)} -7 -${h.toFixed(0)} M${x} ${y} q0 -${(h*.6).toFixed(0)} 1 -${(h*1.15).toFixed(0)} M${x} ${y} q3 -${(h*.5).toFixed(0)} 8 -${(h*.95).toFixed(0)}" stroke="${cor}"/>`;
  const capim = (n, x0, x1, y0, y1, h0, h1, cor) => Array.from({length:n}, () => tufo(R(x0, x1).toFixed(0), R(y0, y1).toFixed(0), R(h0, h1), cor)).join('');
  const flores = Array.from({length:40}, () => { const x = R(330, 790), y = R(340, 370), cor = ['#FFD447', '#FFFFFF', '#B57BFF', '#FF8AB8'][Math.floor(R(0, 4))]; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.2" fill="${cor}" stroke="#5E6A3A" stroke-width=".6"/>`; }).join('');
  const ave = `<g class="pa-ave"><path d="M-6 6 C-14 10 -20 14 -22 20 C-14 18 -8 14 -2 10Z" fill="#8A5428" stroke="#4E2E14" stroke-width="1.2"/><ellipse cx="2" cy="4" rx="12" ry="9" fill="#B97A44" stroke="#4E2E14" stroke-width="1.5"/><path d="M4 -1 C10 3 12 9 8 12 C4 10 2 5 4 -1Z" fill="#F2DCC0" stroke="#4E2E14" stroke-width="1"/><circle cx="9" cy="-7" r="7.2" fill="#B97A44" stroke="#4E2E14" stroke-width="1.5"/><circle cx="11.2" cy="-8.2" r="2" fill="#12121A"/><circle cx="11.7" cy="-8.8" r=".7" fill="#fff"/><path d="M6 -10 C8 -12 12 -12 14 -10" stroke="#F2DCC0" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M15 -8 L23 -6 L15 -4Z" fill="#5E4A36" stroke="#2E1E10" stroke-width="1" stroke-linejoin="round"/><circle class="pa-bola" cx="24" cy="-5" r="3.6" fill="#8A5A30" stroke="#4E321C" stroke-width="1" style="opacity:0"/><g class="pa-asa" style="display:none"><g class="asa"><path d="M-6 0 C-2 -14 10 -18 14 -14 C8 -10 4 -4 2 0Z" fill="#9A5E2E" stroke="#4E2E14" stroke-width="1.2" stroke-linejoin="round"/></g></g><path class="pa-pes" d="M0 13 l-1 6 M6 13 l1 6" stroke="#6E5A4A" stroke-width="1.8" stroke-linecap="round"/></g>`;
  const ninho = `<defs><clipPath id="paNinhoClip"><rect id="pa-ninho-clip" x="${POSTE.x - 40}" y="${POSTE.y + 4}" width="80" height="0"/></clipPath></defs><g clip-path="url(#paNinhoClip)"><path d="M${POSTE.x - 30} ${POSTE.y + 2} C${POSTE.x - 32} ${POSTE.y - 26} ${POSTE.x - 14} ${POSTE.y - 42} ${POSTE.x + 2} ${POSTE.y - 42} C${POSTE.x + 20} ${POSTE.y - 42} ${POSTE.x + 34} ${POSTE.y - 26} ${POSTE.x + 32} ${POSTE.y + 2}Z" fill="#C88450" stroke="#5E2E14" stroke-width="2" stroke-linejoin="round"/>${textura(POSTE.x, POSTE.y - 18, 24, 14, 12, '#A8622E', 1.2)}<path d="M${POSTE.x - 20} ${POSTE.y - 20} C${POSTE.x - 16} ${POSTE.y - 32} ${POSTE.x - 6} ${POSTE.y - 38} ${POSTE.x + 4} ${POSTE.y - 38}" stroke="#F0B886" stroke-width="2.4" fill="none" stroke-linecap="round"/><path id="pa-porta" d="M${POSTE.x + 6} ${POSTE.y + 2} C${POSTE.x + 4} ${POSTE.y - 10} ${POSTE.x + 8} ${POSTE.y - 18} ${POSTE.x + 14} ${POSTE.y - 18} C${POSTE.x + 20} ${POSTE.y - 18} ${POSTE.x + 22} ${POSTE.y - 10} ${POSTE.x + 22} ${POSTE.y + 2}Z" fill="#3E1E0C" stroke="#5E2E14" stroke-width="1.4" style="opacity:0;transition:opacity .6s"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Pampa com coxilhas, banhado, corticeira, joão-de-barro, cata-vento, bebedouro e o Aquífero Guarani debaixo da terra">
    <defs>
      <linearGradient id="paCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CBDF2"/><stop offset=".7" stop-color="#D2EEFA"/><stop offset="1" stop-color="#FFF2D2"/></linearGradient>
      <linearGradient id="paCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9DA6E"/><stop offset="1" stop-color="#76B848"/></linearGradient>
      <linearGradient id="paSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4A2A"/><stop offset="1" stop-color="#5E3A1E"/></linearGradient>
      <linearGradient id="paAq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD0FF"/><stop offset="1" stop-color="#2E6FD6"/></linearGradient>
      <pattern id="paGraos" width="20" height="14" patternUnits="userSpaceOnUse"><circle cx="5" cy="4" r="3.6" fill="#E9B98A" stroke="#A8744E" stroke-width=".9"/><circle cx="15" cy="5" r="3" fill="#DDA878" stroke="#A8744E" stroke-width=".9"/><circle cx="10" cy="11" r="3.3" fill="#F0C496" stroke="#A8744E" stroke-width=".9"/><circle cx="4" cy="3" r="1" fill="#FFF0D8"/></pattern>
      <clipPath id="paAqClip"><rect x="0" y="442" width="800" height="58"/></clipPath>
      <radialGradient id="paVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#1A2A0A" stop-opacity="0"/><stop offset="1" stop-color="#1A2A0A" stop-opacity=".28"/></radialGradient>
      <linearGradient id="paC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6EEC0"/><stop offset="1" stop-color="#BEE0A0"/></linearGradient>
      <linearGradient id="paC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2E49A"/><stop offset="1" stop-color="#A2D27A"/></linearGradient>
      <linearGradient id="paC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ADDA80"/><stop offset="1" stop-color="#88C25E"/></linearGradient>
      <linearGradient id="paRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E7A86"/><stop offset="1" stop-color="#5A5662"/></linearGradient>
      <linearGradient id="paBan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD8F2"/><stop offset="1" stop-color="#3E9AD0"/></linearGradient>
      <linearGradient id="paNuvChuva" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D0E0"/><stop offset="1" stop-color="#7A84A2"/></linearGradient>
      <filter id="paGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#paCeu)"/>
    <g id="pa-sol" class="toque"><circle cx="120" cy="74" r="46" fill="#FFE27A" opacity=".3"/><circle cx="120" cy="74" r="28" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M104 64 q8 -9 20 -9" stroke="#FFF1B8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="120" cy="74" r="46" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="440" y="40" width="100" height="48" style="color:#fff" opacity=".9"/><use href="#nuvem" x="230" y="20" width="70" height="34" style="color:#fff" opacity=".7"/></g>
    <g id="pa-chuva" class="toque" style="opacity:0;transition:opacity .8s;pointer-events:none">${[[150, 40], [320, 30], [500, 44]].map(([x, y]) => `<g class="pa-nuv" data-x="${x}"><use href="#nuvem" x="${x - 66}" y="${y}" width="132" height="66" style="color:#5A6787"/><use href="#nuvem" x="${x - 62}" y="${y + 3}" width="124" height="60" style="color:#AEB7CC"/><use href="#nuvem" x="${x - 44}" y="${y + 26}" width="88" height="40" style="color:#8A94AE"/><path d="M${x - 30} ${y + 24} q10 -7 22 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="${x - 70}" y="${y}" width="140" height="70" fill="transparent"/></g>`).join('')}</g>
    <path d="M0 214 C100 200 200 196 300 206 C400 194 520 192 620 204 C700 196 760 198 800 202 V320 H0Z" fill="url(#paC1)" stroke="#B4D49A" stroke-width="1.6"/>
    <path d="M0 236 C80 218 160 214 240 226 C340 208 440 210 520 224 C620 206 720 210 800 222 V320 H0Z" fill="url(#paC2)" stroke="#94C070" stroke-width="2"/>
    <path d="M40 228 C100 218 160 216 220 226 M360 214 C420 208 470 210 510 220 M620 210 C680 206 730 208 780 216" stroke="#E6F6C8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M0 268 C100 246 200 246 300 262 C400 244 520 246 620 260 C700 248 760 250 800 256 V340 H0Z" fill="url(#paC3)" stroke="#76B04E" stroke-width="2"/><path d="M60 258 C120 248 180 248 240 256 M420 250 C480 244 540 246 600 254" stroke="#D6F0B0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <g fill="#5E9A3E">${[60, 90, 470, 500, 760].map((x, i) => `<path d="${copa(x, 254 - (i % 2) * 4, 12, 8, 7)}" stroke="#3E7A22" stroke-width="1.2"/><path d="M${x} 260 v10" stroke="#5E4428" stroke-width="2.4"/>`).join('')}</g>
    <g stroke="#B9E08E" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8">${Array.from({length:30}, () => { const x = R(0, 800), y = R(230, 300); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q2 -4 3 -7 M${(x + 4).toFixed(0)} ${y.toFixed(0)} q1 -3 1 -6"/>`; }).join('')}</g>
    <g id="pa-umbu" class="toque"><path d="M520 300 C516 284 508 276 500 268 M520 300 C524 284 534 274 546 268 M520 300 C520 286 522 276 520 262" stroke="#4E321C" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M506 302 C512 290 528 290 534 302Z" fill="#6E4A2A" stroke="#4E321C" stroke-width="2"/><path d="${copa(490, 258, 30, 16, 10)}" fill="#3E8A3A" stroke="#245A22" stroke-width="2"/><path d="${copa(552, 256, 30, 16, 10)}" fill="#3E8A3A" stroke="#245A22" stroke-width="2"/><path d="${copa(520, 244, 40, 20, 12)}" fill="#4E9E44" stroke="#245A22" stroke-width="2"/>${textura(520, 252, 52, 16, 12, '#2E6A2A', 1.4)}<path d="M492 236 q12 -8 26 -5" stroke="#B8E89A" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="470" y="222" width="104" height="80" fill="transparent"/></g>
    <path d="M0 316 C120 300 260 302 400 312 C540 300 680 300 800 308 V${SUP + 8} H0Z" fill="url(#paCampo)" stroke="#5E9A3E" stroke-width="2"/>
    <g stroke-width="2" fill="none" stroke-linecap="round">${capim(70, 0, 800, 318, 370, 8, 14, '#4E8A2E')}</g>
    <g>${Array.from({length:22}, () => { const x = R(330, 790), y = R(330, 368), h = R(16, 24); return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s"><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-2 -${(h / 2).toFixed(0)} 2 -${h.toFixed(0)}" stroke="#7A9A3E" stroke-width="1.4" fill="none"/><path d="M${(x + 2).toFixed(0)} ${(y - h).toFixed(0)} q6 4 4 12 M${(x + 2).toFixed(0)} ${(y - h).toFixed(0)} q-6 4 -4 12" stroke="#E8E0B8" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`; }).join('')}</g>
    <g>${Array.from({length:10}, () => { const x = R(340, 780), y = R(336, 366); return `<g><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-4 -8 -8 -10 M${x.toFixed(0)} ${y.toFixed(0)} q0 -9 2 -12 M${x.toFixed(0)} ${y.toFixed(0)} q4 -8 8 -9" stroke="#6E8A4A" stroke-width="1.4" fill="none"/>${[[-8, -11], [2, -13], [8, -10], [-3, -9]].map(([dx, dy]) => `<circle cx="${(x + dx).toFixed(0)}" cy="${(y + dy).toFixed(0)}" r="2.6" fill="#FFD447" stroke="#B07A08" stroke-width=".8"/>`).join('')}</g>`; }).join('')}</g>
    <g>${flores}</g>
    <rect x="0" y="${SUP}" width="800" height="${500 - SUP}" fill="url(#paSolo)"/>
    <path d="M0 ${SUP} H800" stroke="#3E7A22" stroke-width="5"/>
    <g stroke="#C9A07A" stroke-width="1.2" fill="none" opacity=".7">${Array.from({length:40}, () => { const x = R(0, 800); return `<path d="M${x.toFixed(0)} ${SUP + 2} q${R(-4, 4).toFixed(0)} 8 ${R(-3, 3).toFixed(0)} ${R(12, 22).toFixed(0)}"/>`; }).join('')}</g>
    <path d="M0 404 Q200 396 400 406 T800 402 V442 H0Z" fill="url(#paRocha)" stroke="#4E4A52" stroke-width="2"/><g fill="#8A8692" opacity=".55">${Array.from({length:16}, (_, i) => `<path d="M${i * 52 + 6} 410 h30 l4 6 h-30Z"/>`).join('')}</g>
    <g>${Array.from({length:26}, () => { const x = R(10, 790), y = R(382, 400), r = R(2.5, 6); return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(1)}" ry="${(r * .6).toFixed(1)}" fill="#8E5A34" stroke="#4E2E14" stroke-width="1"/>`; }).join('')}</g>
    <g stroke="#55515A" stroke-width="1.6" fill="none">${Array.from({length:12}, (_, i) => `<path d="M${i * 70 + R(0, 20)} 406 l${R(-8, 8).toFixed(0)} 36"/>`).join('')}</g>
    <text x="784" y="432" text-anchor="end" font-family="Baloo 2, sans-serif" font-weight="700" font-size="12" fill="#E8E4EE" opacity=".9">rocha</text>
    <path d="M40 412 l10 14 M120 418 l-8 12 M260 410 l12 16 M420 416 l-6 14 M560 410 l10 14 M720 414 l-8 14" stroke="#4E4A52" stroke-width="1.6"/>
    <g clip-path="url(#paAqClip)"><rect x="0" y="442" width="800" height="58" fill="#8A5A3A"/><rect id="pa-aq" x="0" y="470" width="800" height="60" fill="url(#paAq)"/><rect x="0" y="442" width="800" height="58" fill="url(#paGraos)" opacity=".85"/></g>
    <path d="M0 442 H800" stroke="#4E4A52" stroke-width="2.4"/>
    <rect id="pa-aq-toque" class="toque" x="0" y="442" width="800" height="58" fill="transparent"/>
    <text x="16" y="490" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#fff" stroke="#12235A" stroke-opacity=".55" stroke-width="3.4" paint-order="stroke">Aquífero Guarani: água escondida debaixo da terra</text>
    <path d="M${CX} ${SUP} V468" stroke="#3E3A42" stroke-width="7"/><path d="M${CX} ${SUP} V468" stroke="#9A96A2" stroke-width="3"/>
    <g id="pa-gotas"></g>
    <g id="pa-banhado" class="toque"><ellipse cx="150" cy="${SUP - 8}" rx="116" ry="17" fill="#5E8A3E" opacity=".55"/><ellipse id="pa-ban" cx="150" cy="${SUP - 10}" rx="104" ry="13" fill="url(#paBan)" stroke="#2E7FB0" stroke-width="2"/><path d="M80 ${SUP - 6} h40 M150 ${SUP - 4} h30" stroke="#2E7FB0" stroke-width="1.2" opacity=".6"/><path id="pa-ban-brilho" d="M90 ${SUP - 13} q10 -3 20 0 M170 ${SUP - 8} q8 -3 16 0" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g stroke-width="2.4" fill="none" stroke-linecap="round">${[34, 46, 56, 70, 82, 226, 238, 250, 262, 272].map(x => tufo(x, SUP - 6, R(18, 30), '#3E7A2A')).join('')}</g>
      <g fill="#7A4A2A">${[44, 58, 72, 236, 248, 266].map(x => `<ellipse cx="${x + 2}" cy="${(SUP - 26 - R(0, 6)).toFixed(0)}" rx="2.6" ry="6"/>`).join('')}</g>
      ${[[118, SUP - 12], [178, SUP - 9]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="-6" cy="1" rx="7" ry="3" fill="#3FA864" stroke="#1E6B3A" stroke-width="1.2"/><ellipse cx="5" cy="2" rx="7" ry="3" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.2"/><circle cx="0" cy="-5" r="3" fill="#B57BFF" stroke="#6A3EAE" stroke-width="1"/></g>`).join('')}
      <g id="pa-garca" transform="translate(140 ${SUP - 14})"><path d="M-2 0 V-16 M3 0 V-16" stroke="#3E3A2A" stroke-width="1.6"/><path d="M-10 -24 C-10 -32 4 -34 10 -28 C14 -22 8 -16 -2 -16 C-8 -16 -12 -20 -10 -24Z" fill="#fff" stroke="#5A6787" stroke-width="1.4"/><path d="M8 -28 C10 -36 6 -42 10 -48" stroke="#5A6787" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 -28 C10 -36 6 -42 10 -48" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="11" cy="-49" r="3.6" fill="#fff" stroke="#5A6787" stroke-width="1.2"/><path d="M14 -50 L24 -48 L14 -47Z" fill="#FFC83D" stroke="#8A6A08" stroke-width=".8"/><circle cx="12" cy="-50" r=".9" fill="#12235A"/><ellipse cx="0" cy="2" rx="10" ry="2" fill="#E6F6FF" opacity=".6"/></g>
      <g id="pa-sapos" style="opacity:0;transition:opacity .8s">${[[92, SUP - 14], [206, SUP - 12]].map(([x, y]) => `<svg x="${x - 9}" y="${y - 12}" width="18" height="15" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg>`).join('')}</g>
      <rect x="40" y="${SUP - 40}" width="220" height="44" fill="transparent"/></g>
    <g id="pa-lama" class="toque"><ellipse cx="${LAMA.x}" cy="${LAMA.y}" rx="26" ry="8" fill="#7A4A2A" stroke="#4E2E14" stroke-width="2"/><ellipse cx="${LAMA.x - 6}" cy="${LAMA.y - 2}" rx="8" ry="2.6" fill="#9A6A3E"/><circle cx="${LAMA.x + 10}" cy="${LAMA.y - 1}" r="2" fill="#5E3A1E"/><g id="pa-lama-hint" style="display:none">${brilhoHotspot(LAMA.x + 14, LAMA.y - 14)}</g><rect x="${LAMA.x - 32}" y="${LAMA.y - 22}" width="64" height="34" fill="transparent"/></g>
    <g class="toque" data-fig="corticeira" id="pa-cort"><svg x="250" y="236" width="104" height="104" viewBox="0 0 120 120"><use href="#f-corticeira"/></svg>${brilhoHotspot(334, 252)}</g>
    <path d="M354 334 H560 M354 348 H560" stroke="#8A8478" stroke-width="1.4"/>
    <g>${[360, 420, 480, 540].map(x => `<rect x="${x - 5}" y="${x === POSTE.x ? POSTE.y : 322}" width="10" height="${SUP - (x === POSTE.x ? POSTE.y : 322)}" rx="2" fill="#8A6A4A" stroke="#4E3A28" stroke-width="1.6"/><path d="M${x - 2} ${(x === POSTE.x ? POSTE.y : 322) + 8} v20 M${x + 2} ${(x === POSTE.x ? POSTE.y : 322) + 20} v16" stroke="#B89878" stroke-width="1.4"/><ellipse cx="${x}" cy="${SUP}" rx="9" ry="2.6" fill="#3E2A18" opacity=".35"/>`).join('')}</g>
    <g id="pa-ninho">${ninho}</g>
    <g id="pa-joao" class="toque" data-fig="joao" transform="translate(${POUSO.x} ${POUSO.y - 10})"><g id="pa-joao-in">${ave}</g><rect x="-24" y="-18" width="50" height="40" fill="transparent"/></g>
    <g id="pa-quero" class="toque" data-fig="queroquero"><g id="pa-quero-in"><svg x="500" y="${SUP - 46}" width="46" height="46" viewBox="0 0 100 100"><use href="#f-queroquero"/></svg></g>${brilhoHotspot(536, SUP - 42)}</g>
    <g id="pa-ema" class="toque" data-fig="ema" transform="translate(600 314) scale(.75)"><g id="pa-ema-in"><svg x="-22" y="-58" width="44" height="58" viewBox="0 0 100 130"><use href="#f-ema"/></svg></g></g>
    <g id="pa-bebe"><path d="M${CX + 6} 344 H${CX + 44} V350" stroke="#3E3A42" stroke-width="5" fill="none"/><path d="M${CX + 6} 344 H${CX + 44} V350" stroke="#9A96A2" stroke-width="2" fill="none"/><path d="M${CX + 36} ${SUP - 22} H${CX + 112} L${CX + 106} ${SUP} H${CX + 42}Z" fill="#9AA0AE" stroke="#4E4E5A" stroke-width="2"/><clipPath id="paBebeClip"><path d="M${CX + 39} ${SUP - 19} H${CX + 109} L${CX + 104} ${SUP - 2} H${CX + 44}Z"/></clipPath><g clip-path="url(#paBebeClip)"><rect id="pa-bebe-agua" x="${CX + 36}" y="${SUP}" width="80" height="22" fill="#5AAEFF"/></g><path d="M${CX + 40} ${SUP - 22} H${CX + 108}" stroke="#C9CED8" stroke-width="2"/></g>
    <g id="pa-cata" class="toque" style="cursor:grab">
      <path d="M${CX - 24} ${SUP} L${CX - 4} ${CY + 10} M${CX + 24} ${SUP} L${CX + 4} ${CY + 10} M${CX - 20} 330 H${CX + 20} M${CX - 15} 290 H${CX + 15} M${CX - 11} 252 H${CX + 11} M${CX - 20} 330 L${CX + 15} 290 M${CX + 20} 330 L${CX - 15} 290 M${CX - 15} 290 L${CX + 11} 252 M${CX + 15} 290 L${CX - 11} 252" stroke="#4E4E5A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M${CX - 24} ${SUP} L${CX - 4} ${CY + 10} M${CX + 24} ${SUP} L${CX + 4} ${CY + 10}" stroke="#A8ACB8" stroke-width="1.6" fill="none"/>
      <path d="M${CX + 6} ${CY} H${CX + 52} L${CX + 66} ${CY - 16} L${CX + 66} ${CY + 14} L${CX + 52} ${CY + 4}Z" fill="#FFC83D" stroke="#8A6A08" stroke-width="2" stroke-linejoin="round"/>
      <g id="pa-pas">${Array.from({length:12}, (_, k) => { const a = k * 30; return `<g transform="rotate(${a} ${CX} ${CY})"><path d="M${CX} ${CY} L${CX + 4} ${CY - 54} L${CX + 14} ${CY - 54} L${CX + 6} ${CY - 6}Z" fill="${k % 2 ? '#E9EEF6' : '#FFFFFF'}" stroke="#5A6787" stroke-width="1.6" stroke-linejoin="round"/></g>`; }).join('')}</g>
      <circle cx="${CX}" cy="${CY}" r="8" fill="#E5392C" stroke="#7A1410" stroke-width="2"/><circle cx="${CX - 2}" cy="${CY - 2}" r="2.4" fill="#FFB0A0"/>
      <rect x="${CX - 70}" y="${CY - 70}" width="140" height="${SUP - CY + 70}" fill="transparent"/></g>
    <g id="pa-mao" style="display:none"><path d="M${CX - 66} ${CY - 50} q40 -40 80 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8" opacity=".9"/><path d="M${CX + 14} ${CY - 50} l-12 -2 l8 -10Z" fill="#fff"/></g>
    <rect width="800" height="500" fill="url(#paVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#paGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const pas = el(s, '#pa-pas'), cata = el(s, '#pa-cata'), bebeAgua = el(s, '#pa-bebe-agua'), gotas = el(s, '#pa-gotas');
  el(s, '#pa-mao').style.display = ''; el(s, '#pa-mao').animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  /* 1. vento: girar o cata-vento puxa água do aquífero para o bebedouro */
  let arr = null;
  const empurra = v => { if (fase !== 'vento') return; vel = Math.min(14, vel + v); el(s, '#pa-mao').style.display = 'none'; };
  cata.addEventListener('pointerdown', e => { arr = c.ponto(e); s.setPointerCapture(e.pointerId); empurra(2.5); toca('clique'); });
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); empurra(Math.hypot(p.x - arr.x, p.y - arr.y) * .05); arr = p; });
  s.addEventListener('pointerup', () => arr = null);
  const GOTAS = Array.from({length:8}, (_, i) => ({ y:470 - i * 13, e:null }));
  GOTAS.forEach(g => { g.e = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); g.e.setAttribute('cx', CX); g.e.setAttribute('r', 3.2); g.e.setAttribute('fill', '#7FD0FF'); g.e.setAttribute('stroke', '#1B56C4'); g.e.setAttribute('stroke-width', 1); g.e.style.opacity = 0; gotas.appendChild(g.e); });
  let ultT = performance.now(), emaAnda = null;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    const base = fase === 'vento' ? 0 : .8;
    vel += (base - vel) * .012; ang = (ang + vel * dt * .06) % 360;
    pas.setAttribute('transform', `rotate(${ang.toFixed(1)} ${CX} ${CY})`);
    const fluxo = fase === 'vento' ? Math.max(0, vel - .6) : 0;
    GOTAS.forEach(g => { g.y -= fluxo * dt * .02; if (g.y < SUP - 30) g.y += 98; g.e.setAttribute('cy', g.y.toFixed(1)); g.e.style.opacity = fluxo > .3 ? 1 : 0; });
    if (fase === 'vento' && fluxo > 0) {
      bomba = Math.min(META, bomba + fluxo * dt * .0045);
      bebeAgua.setAttribute('y', (SUP - bomba / META * 18).toFixed(1));
      if (Math.random() < fluxo * .02) c.add({ tipo:'respingo', x:CX + 44, y:SUP - 18, t:0 });
      api.hud(`<span class="chip">Água no bebedouro: ${Math.round(bomba)}%</span>`);
      if (bomba >= META) bebedouroCheio();
    }
    if (emaAnda) { const k = Math.min(1, (t - emaAnda.t0) / emaAnda.ms); const x = emaAnda.x0 + (emaAnda.x1 - emaAnda.x0) * k, y = emaAnda.y0 + (emaAnda.y1 - emaAnda.y0) * k + Math.abs(Math.sin(k * 30)) * -2; el(s, '#pa-ema').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(.75 + .25 * k).toFixed(2)})`); if (k >= 1) { emaAnda = null; } }
    requestAnimationFrame(vida);
  })(ultT);
  let meio = false;
  function bebedouroCheio(){
    fase = 'bebem'; toca('vitoria'); c.brilhos(CX + 74, SUP - 14, 10, '#BFE6FF');
    api.diz('O bebedouro encheu! Essa água estava escondida bem fundo, no Aquífero Guarani. Olha a ema chegando para beber!');
    emaAnda = { x0:600, y0:314, x1:CX + 92, y1:SUP - 6, t0:performance.now(), ms:3600 };
    depois(4200, () => { el(s, '#pa-ema-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(18deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 }); toca('glub'); });
    depois(6400, comecaBarro);
  }
  /* 2. barro: o joão-de-barro constrói a casa com a lama do banhado */
  function comecaBarro(){
    fase = 'barro'; el(s, '#pa-lama-hint').style.display = '';
    api.hud('<span class="chip">Casa do joão-de-barro: 0/5</span>');
    api.diz('Agora ajude o Barrinho a fazer a casa dele! Toque na lama do banhado para ele buscar barro. Barro é terra com água.');
  }
  const joao = el(s, '#pa-joao'), joaoIn = el(s, '#pa-joao-in');
  let jx = POUSO.x, jy = POUSO.y - 10;
  function voar(x1, y1, ms, fim){
    const x0 = jx, y0 = jy, t0 = performance.now();
    joaoIn.querySelector('.pa-asa').style.display = ''; joaoIn.querySelector('.pa-pes').style.display = 'none';
    joaoIn.setAttribute('transform', x1 < x0 ? 'scale(-1 1)' : '');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); jx = x0 + (x1 - x0) * e; jy = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50; joao.setAttribute('transform', `translate(${jx.toFixed(1)} ${jy.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else { joaoIn.querySelector('.pa-asa').style.display = 'none'; joaoIn.querySelector('.pa-pes').style.display = ''; fim && fim(); } })(t0);
  }
  el(s, '#pa-lama').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'barro') { toca('glub'); api.diz('É lama do banhado: terra misturada com água.'); return; }
    if (voando) return; voando = true; el(s, '#pa-lama-hint').style.display = 'none';
    voar(LAMA.x + 8, LAMA.y - 18, 900, () => {
      toca('glub'); for (let i = 0; i < 5; i++) c.add({ tipo:'respingo', x:LAMA.x + sorte(-8, 8), y:LAMA.y, t:i, cor:'#7A4A2A' });
      joaoIn.querySelector('.pa-bola').style.opacity = 1;
      depois(300, () => voar(POSTE.x - 14, POSTE.y - 24 - etapa * 4, 1000, () => {
        joaoIn.querySelector('.pa-bola').style.opacity = 0; etapa++; toca('planta');
        const h = [0, 14, 24, 34, 42, 48][etapa]; el(s, '#pa-ninho-clip').setAttribute('y', POSTE.y + 4 - h); el(s, '#pa-ninho-clip').setAttribute('height', h);
        c.brilhos(POSTE.x, POSTE.y - h / 2, 5, '#F0B886');
        api.hud(`<span class="chip">Casa do joão-de-barro: ${etapa}/5</span>`);
        if (etapa === 2) api.diz('Bolinha por bolinha! Ele mistura o barro com palha para a casa ficar forte.');
        if (etapa < 5) { depois(300, () => voar(POUSO.x, POUSO.y - 10, 700, () => { voando = false; el(s, '#pa-lama-hint').style.display = ''; })); }
        else { el(s, '#pa-porta').style.opacity = 1; toca('vitoria'); api.diz('A casa ficou pronta, com portinha e tudo! Sem a água do banhado, não teria barro.'); depois(500, () => voar(POUSO.x, POUSO.y - 10, 900, () => { voando = false; })); depois(3800, comecaChuva); }
      }));
    });
  });
  /* 3. chuva: o banhado guarda a água como esponja e ela desce até o aquífero */
  function comecaChuva(){
    fase = 'chuva'; const ch = el(s, '#pa-chuva'); ch.style.opacity = 1; ch.style.pointerEvents = '';
    api.hud('<span class="chip">Chuvas: 0/3</span>');
    api.diz('Chegaram nuvens de chuva! Toque nas nuvens para chover no Pampa e veja para onde vai a água.');
  }
  el(s, '#pa-chuva').addEventListener('click', e => {
    const g = e.target.closest('.pa-nuv'); if (!g || fase !== 'chuva' || chovendo || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; chovendo = true; chuvas++; toca('chuva'); const x = +g.dataset.x;
    let n = 0; (function cai(){ if (!vivo) return; for (let k = 0; k < 3; k++) c.add({ tipo:'chuva', x:x + sorte(-60, 60), y:100, vx:-.3, vy:sorte(9, 12), chao:SUP - 4, cor:'#3D8BFF' }); if (n % 4 === 0) c.add({ tipo:'infiltra', x0:sorte(60, 760), y0:SUP + 4, x1:sorte(40, 760), y1:sorte(452, 470), dur:sorte(80, 110), f:sorte(0, 6), chega:() => { aquif = Math.min(1, aquif + .012); el(s, '#pa-aq').setAttribute('y', (470 - aquif * 26).toFixed(1)); } }); if (++n < 60) depois(45, cai); })();
    const ban = el(s, '#pa-ban'), rx0 = +ban.getAttribute('rx'), ry0 = +ban.getAttribute('ry');
    ban.animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }], { duration:2400, fill:'forwards' });
    ban.setAttribute('rx', (rx0 + 8).toFixed(0)); ban.setAttribute('ry', (ry0 + 2).toFixed(0));
    depois(2800, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) { el(s, '#pa-sapos').style.opacity = 1; api.diz('O banhado guardou a água como uma esponja, e os sapinhos apareceram! O campo não ficou alagado.'); }
      if (chuvas === 2) api.diz('Parte da água desce devagar pela terra e vai encher o Aquífero Guarani lá embaixo.');
      if (chuvas === 3) { fase = 'fim'; toca('vitoria'); el(s, '#pa-chuva').style.opacity = 0; api.diz('Debaixo do Pampa fica parte do Aquífero Guarani, uma das maiores reservas de água doce escondida debaixo da terra do mundo. Os banhados ajudam a guardar essa água!'); depois(5600, api.fim); }
    });
  });
  /* toques extras */
  el(s, '#pa-quero').addEventListener('click', () => { [1500, 1300, 1500, 1300].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .09, 'square', .04, f * .85), i * 150)); el(s, '#pa-quero-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:400, iterations:2 }); });
  el(s, '#pa-umbu').addEventListener('click', e => { e.stopPropagation(); toca('pop'); c.brilhos(520, 246, 6, '#B8E89A'); api.diz('É um umbu, a árvore grandona do Pampa. A sombra dele é o lugar preferido dos bichos no calor.'); });
  el(s, '#pa-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(120, 74, 8, '#FFE27A'); api.diz('No Pampa o inverno é frio e o verão é quente. O campo fica verdinho com a chuva.'); });
  el(s, '#pa-banhado').addEventListener('click', e => { if (fase === 'chuva') return; e.stopPropagation(); toca('glub'); const p = c.ponto(e); for (let i = 0; i < 4; i++) c.add({ tipo:'bolha', x:p.x + sorte(-8, 8), y:p.y, t:i }); api.diz('Isto é um banhado, um campo encharcado cheio de plantas e bichos. Ele guarda água como uma esponja.'); });
  el(s, '#pa-aq-toque').addEventListener('click', e => { e.stopPropagation(); toca('glub'); const p = c.ponto(e); for (let i = 0; i < 5; i++) c.add({ tipo:'bolha', x:p.x + sorte(-10, 10), y:p.y, t:i }); api.diz('O Aquífero Guarani fica debaixo de quatro países: Brasil, Argentina, Paraguai e Uruguai. A água fica guardada entre os grãos de areia e pedra.'); });
  api.hud('<span class="chip">Água no bebedouro: 0%</span>');
  api.diz('Oi, eu sou o Barrinho, um joão-de-barro do Pampa! Os bichos estão com sede. Arraste o dedo no cata-vento para ele girar e puxar água lá de baixo da terra.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
