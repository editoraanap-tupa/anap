/* ================= JOGO 6: Mata Atlântica, a floresta que faz água ================= */
function jogoMata(palco, api){
  semente = 81;
  let vivo = true, fase = 'neblina', nBrom = 0, nPlant = 0, nPulos = 0, arrN = null, nevX = 690, nevY = 120, pulando = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const NS = 'http://www.w3.org/2000/svg';
  const CRISTA = [[0,186],[60,150],[120,124],[220,98],[320,126],[440,196],[560,262],[660,318],[740,356],[800,368]];
  const crista = x => { for (let i = 1; i < CRISTA.length; i++) { const [x0, y0] = CRISTA[i-1], [x1, y1] = CRISTA[i]; if (x <= x1) { const k = (x - x0) / (x1 - x0), e = k*k*(3-2*k); return y0 + (y1 - y0) * e; } } return 368; };
  let serra = 'M0 500 V186'; for (let x = 0; x <= 800; x += 10) serra += ` L${x} ${crista(x).toFixed(1)}`; serra += ' V500Z';
  const FLORES = ['maFRoxa', 'maFRoxa', 'maFRosa', 'maFAmar', 'maFBranca'];
  const VERDES = ['maV1', 'maV2', 'maV3', 'maV4', 'maV5', 'maV6', 'maV7'];
  const TINTA = { maV1:'#0B4A2A', maV2:'#3E6A12', maV3:'#3A4E12', maV4:'#0E5048', maV5:'#145E24', maV6:'#06321A', maV7:'#40664A' };
  const FUNDO = ['maV7', 'maV4', 'maV2', 'maV3', 'maV5'], FRENTE = ['maV1', 'maV6', 'maV5', 'maV2', 'maV4', 'maV3'];
  let ultVerde = '';
  const escolheVerde = y => { const lista = y < 4 ? FUNDO : y < 9 ? VERDES : FRENTE; let g; do { g = lista[Math.floor(R(0, lista.length))]; } while (g === ultVerde); ultVerde = g; return g; };
  /* copas da floresta em camadas, cada uma com luz e sombra próprias */
  let floresta = '';
  for (let y = 0; y < 15; y++) for (let x = -10; x < 820; x += R(28, 38)) {
    const yy = crista(Math.max(0, Math.min(800, x))) + 8 + y * 24 + R(-6, 6); if (yy > 492) continue;
    const r = R(16, 24) + y * .7, flor = y > 0 && y < 12 && R(0, 1) < .1, gr = flor ? FLORES[Math.floor(R(0, FLORES.length))] : escolheVerde(y), tinta = flor ? '#6E3E7A' : TINTA[gr];
    floresta += `<path d="${copa(x + 3, yy + 5, r, r * .72, 8)}" fill="#0B3A20" opacity=".45"/><path d="${copa(x, yy, r, r * .72, 8)}" fill="url(#${gr})" stroke="${tinta}" stroke-width="1.5"/>` + (y < 4 ? `<path d="${copa(x, yy, r, r * .72, 8)}" fill="#E8F6F2" opacity="${(.2 - y * .05).toFixed(2)}"/>` : '');
    if (flor) floresta += `<g fill="${gr === 'maFAmar' ? '#FFF6B8' : '#FFFFFF'}" opacity=".85">${Array.from({length:9}, () => `<circle cx="${(x + R(-r * .65, r * .65)).toFixed(1)}" cy="${(yy + R(-r * .5, r * .35)).toFixed(1)}" r="${R(1.2, 2.2).toFixed(1)}"/>`).join('')}</g>`;
    else floresta += textura(x, yy + 2, r * .6, r * .4, 3, tinta, 1.2);
    if (R(0, 1) < .45) floresta += `<path d="M${(x - r * .55).toFixed(0)} ${(yy - r * .28).toFixed(0)} q${(r * .3).toFixed(0)} -${(r * .26).toFixed(0)} ${(r * .62).toFixed(0)} -${(r * .1).toFixed(0)}" stroke="${flor ? '#FFF0FF' : '#B8F0A8'}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>`;
  }
  /* samambaiaçu: a samambaia que vira árvore */
  const samamb = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-2 -20 2 -40 0 -58" stroke="#3E2A18" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-2 -10 h4 M-2 -22 h4 M-2 -34 h4 M-2 -46 h4" stroke="#6E5038" stroke-width="2"/>${[-175,-150,-125,-95,-60,-30,-5].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r) * 40, ey = -58 + Math.sin(r) * 22 + 16, cx = Math.cos(r) * 22, cy = -58 + Math.sin(r) * 26; return `<path d="M0 -58 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#2E7A3A" stroke-width="2" fill="none"/><path d="M0 -58 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#5CC06A" stroke-width="13" fill="none" stroke-dasharray="2 2" stroke-linecap="round"/>`; }).join('')}</g>`;
  /* helicônias e folhas grandes na frente da cena */
  const heliconia = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${s * (f || 1)} ${s})"><path d="M0 0 C-30 -40 -40 -80 -30 -120 C-10 -90 0 -50 0 0Z" fill="url(#maFolha)" stroke="#0F5530" stroke-width="2"/><path d="M0 0 C-14 -40 -22 -80 -30 -118" stroke="#A8E89A" stroke-width="1.6" fill="none"/><path d="M6 0 C30 -30 50 -70 44 -110 C26 -80 10 -40 6 0Z" fill="url(#maFolha)" stroke="#0F5530" stroke-width="2"/><path d="M6 0 C22 -36 34 -70 44 -108" stroke="#A8E89A" stroke-width="1.6" fill="none"/><path d="M2 0 V-70" stroke="#2E6A2A" stroke-width="3"/>${[0, 1, 2, 3].map(k => `<path d="M2 ${-70 + k * 12} l${k % 2 ? -16 : 16} -6 l${k % 2 ? 14 : -14} 10Z" fill="${k % 2 ? '#FF5A3A' : '#E5392C'}" stroke="#8E1E14" stroke-width="1.2" stroke-linejoin="round"/><path d="M${k % 2 ? -12 : 16} ${-74 + k * 12} l${k % 2 ? -2 : 2} -2" stroke="#FFD447" stroke-width="2.4" stroke-linecap="round"/>`).join('')}</g>`;
  const embauba = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-2 -30 2 -50 0 -70" stroke="#B9B2A6" stroke-width="4" fill="none"/><path d="M0 -20 h3 M0 -40 h3" stroke="#8A8478" stroke-width="1.4"/>${[-160,-120,-80,-40,-10,-100,-60].map(a => { const r = a * Math.PI / 180; return `<path d="M0 -70 L${(Math.cos(r)*22).toFixed(1)} ${(-70 + Math.sin(r)*16).toFixed(1)}" stroke="#7A8A7A" stroke-width="1.4"/><ellipse cx="${(Math.cos(r)*22).toFixed(1)}" cy="${(-70 + Math.sin(r)*16).toFixed(1)}" rx="7" ry="4.4" transform="rotate(${a + 90} ${(Math.cos(r)*22).toFixed(1)} ${(-70 + Math.sin(r)*16).toFixed(1)})" fill="#C9DCC8" stroke="#6E8A72" stroke-width="1.2"/>`; }).join('')}</g>`;
  const jussara = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="balanca" style="animation-delay:${d}s"><path d="M0 0 C-1 -30 1 -60 0 -84" stroke="#5E4A36" stroke-width="3.4" fill="none"/>${[-170,-140,-110,-70,-40,-10].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r)*30, ey = -84 + Math.sin(r)*20 + 12; return `<path d="M0 -84 Q${(ex*.5).toFixed(1)} ${(-84 + Math.sin(r)*24).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#2E7A3A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 -84 Q${(ex*.5).toFixed(1)} ${(-84 + Math.sin(r)*24).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#5CC06A" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="2 3" opacity=".9"/>`; }).join('')}<path d="M-2 -60 h4" stroke="#7A3E5A" stroke-width="5" stroke-linecap="round"/></g></g>`;
  const BROM = [{ x:132, y:176 }, { x:214, y:146 }, { x:300, y:168 }];
  const NASC = { x:334, y:214 };
  const RIO = `M${NASC.x} ${NASC.y} C348 246 300 270 318 302 C336 332 392 344 432 360 C474 376 520 392 568 408 C612 422 650 436 700 448 C730 454 760 458 800 460`;
  const GAP = [{ x:368, y:300 }, { x:410, y:392 }, { x:522, y:356 }, { x:546, y:440 }, { x:650, y:404 }];
  const MICO0 = { x:258, y:258 }, FAMILIA = { x:742, y:376 };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Serra coberta pela Mata Atlântica, com neblina vinda do mar, bromélias, uma nascente, um rio até a praia e micos-leões-dourados">
    <defs>
      <linearGradient id="maCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC6F2"/><stop offset=".6" stop-color="#D6EEF7"/><stop offset="1" stop-color="#F6F1DC"/></linearGradient>
      <linearGradient id="maMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5CC4E8"/><stop offset="1" stop-color="#1F78B8"/></linearGradient>
      <linearGradient id="maLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC4A6"/><stop offset="1" stop-color="#6EA88A"/></linearGradient>
      <radialGradient id="maNevoa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="maVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#0A2A1A" stop-opacity="0"/><stop offset="1" stop-color="#0A2A1A" stop-opacity=".3"/></radialGradient>
      <radialGradient id="maV1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5FCB84"/><stop offset=".6" stop-color="#1E8A4E"/><stop offset="1" stop-color="#0E5A32"/></radialGradient><radialGradient id="maV2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#D2F07A"/><stop offset=".6" stop-color="#8CCB3E"/><stop offset="1" stop-color="#4E8A1E"/></radialGradient><radialGradient id="maV3" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9CC6A"/><stop offset=".6" stop-color="#8A9E38"/><stop offset="1" stop-color="#55701E"/></radialGradient><radialGradient id="maV4" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7ED8BE"/><stop offset=".6" stop-color="#2EA08A"/><stop offset="1" stop-color="#14685A"/></radialGradient><radialGradient id="maV5" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8AE27A"/><stop offset=".6" stop-color="#3EAE4A"/><stop offset="1" stop-color="#1E7A30"/></radialGradient><radialGradient id="maV6" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4AA866"/><stop offset=".6" stop-color="#1E6A3A"/><stop offset="1" stop-color="#0A4426"/></radialGradient><radialGradient id="maV7" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#D8ECC4"/><stop offset=".6" stop-color="#9CC28C"/><stop offset="1" stop-color="#638E64"/></radialGradient><radialGradient id="maFRoxa" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#E2C2FF"/><stop offset=".6" stop-color="#A86AE8"/><stop offset="1" stop-color="#6E3EB0"/></radialGradient><radialGradient id="maFRosa" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFD6EA"/><stop offset=".6" stop-color="#F28DC0"/><stop offset="1" stop-color="#C2508A"/></radialGradient><radialGradient id="maFAmar" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF2A0"/><stop offset=".6" stop-color="#FFC83D"/><stop offset="1" stop-color="#D08A10"/></radialGradient><radialGradient id="maFBranca" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E6F0E6"/><stop offset="1" stop-color="#A8C8B0"/></radialGradient><linearGradient id="maFolha" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5CC46E"/><stop offset="1" stop-color="#1E7A42"/></linearGradient><linearGradient id="maPedra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9C6D4"/><stop offset=".55" stop-color="#A29EB0"/><stop offset="1" stop-color="#7A7690"/></linearGradient><linearGradient id="maLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8DCD2"/><stop offset="1" stop-color="#9CC8BA"/></linearGradient><linearGradient id="maSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7A42"/><stop offset="1" stop-color="#0E4A28"/></linearGradient><radialGradient id="maNeb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="maGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#maCeu)"/>
    <g id="ma-sol" class="toque"><circle cx="560" cy="70" r="46" fill="#FFE27A" opacity=".3"/><circle cx="560" cy="70" r="28" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M545 60 q8 -9 20 -9" stroke="#FFF1B8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="560" cy="70" r="46" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="380" y="30" width="110" height="52" style="color:#fff" opacity=".9"/></g>
    <path d="M240 260 C320 180 420 140 520 160 C600 130 700 140 800 170 V400 H240Z" fill="url(#maLonge2)" stroke="#8CB8AA" stroke-width="2"/>
    <ellipse cx="560" cy="200" rx="200" ry="16" fill="url(#maNeb)"/>
    <path d="M300 300 C380 200 460 180 540 204 C600 172 680 180 800 226 V400 H300Z" fill="url(#maLonge)" stroke="#5E9A7A" stroke-width="2"/>
    <g fill="#5E9A7A" opacity=".55">${Array.from({length:26}, () => { const x = R(330, 800), y = R(220, 300); return `<path d="${copa(x, y, R(8, 13), R(5, 8), 6)}"/>`; }).join('')}</g>
    <path d="M330 260 C400 240 470 236 560 248" stroke="#fff" stroke-width="14" opacity=".45" fill="none" stroke-linecap="round"/>
    <g id="ma-pedra" class="toque"><path d="M596 270 C600 212 630 176 664 174 C700 174 724 212 728 270Z" fill="url(#maPedra)" stroke="#5E5A6E" stroke-width="2.4"/><path d="M628 196 C622 224 624 250 628 268 M650 180 C646 214 646 244 650 268 M676 178 C680 210 682 240 680 268 M702 192 C708 220 710 248 708 268" stroke="#8A8698" stroke-width="1.8" fill="none" opacity=".8"/><path d="M612 222 C620 196 640 180 664 178" stroke="#F0EEF6" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/><path d="${copa(664, 176, 20, 7, 8)}" fill="#5E9A6A" stroke="#3E7A4A" stroke-width="1.4"/><path d="${copa(612, 250, 12, 7, 6)}" fill="#6EAA7A" stroke="#3E7A4A" stroke-width="1.2"/><path d="${copa(712, 238, 10, 6, 6)}" fill="#6EAA7A" stroke="#3E7A4A" stroke-width="1.2"/><rect x="596" y="170" width="132" height="100" fill="transparent"/></g>
    <ellipse cx="520" cy="262" rx="160" ry="14" fill="url(#maNeb)" class="deriva"/>
    <path d="${serra}" fill="url(#maSerra)" stroke="#0E4A28" stroke-width="2.5"/>
    <g>${floresta}</g>
    <g>${BROM.map((b, i) => `<g><path d="M${b.x} ${b.y + 26} C${b.x - 3} ${b.y + 10} ${b.x + 4} ${b.y} ${b.x} ${b.y - 30}" stroke="#3E2A18" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${b.x} ${b.y + 26} C${b.x - 3} ${b.y + 10} ${b.x + 4} ${b.y} ${b.x} ${b.y - 30}" stroke="#7A5A3E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${b.x} ${b.y - 20} C${b.x - 14} ${b.y - 34} ${b.x - 26} ${b.y - 38} ${b.x - 34} ${b.y - 50} M${b.x} ${b.y - 24} C${b.x + 12} ${b.y - 36} ${b.x + 24} ${b.y - 40} ${b.x + 32} ${b.y - 52}" stroke="#3E2A18" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${copa(b.x - 30, b.y - 58, 28, 17, 10)}" fill="url(#maV2)" stroke="#0F5530" stroke-width="1.8"/><path d="${copa(b.x + 30, b.y - 60, 28, 17, 10)}" fill="url(#maV1)" stroke="#0F5530" stroke-width="1.8"/><path d="${copa(b.x, b.y - 76, 32, 19, 11)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.8"/>${textura(b.x, b.y - 66, 44, 16, 10, '#0F5530', 1.3)}<path d="M${b.x - 22} ${b.y - 88} q12 -8 26 -5" stroke="#B8F0A8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${b.x + 22} ${b.y - 46} C${b.x + 26} ${b.y - 20} ${b.x + 20} ${b.y + 4} ${b.x + 24} ${b.y + 30}" stroke="#4E7A2A" stroke-width="2" fill="none"/><path d="M${b.x - 26} ${b.y - 44} C${b.x - 30} ${b.y - 24} ${b.x - 24} ${b.y - 4} ${b.x - 28} ${b.y + 16}" stroke="#4E7A2A" stroke-width="2" fill="none"/><path d="${copa(b.x - 12, b.y + 30, 20, 12, 8)}" fill="url(#maV2)" stroke="#0F5530" stroke-width="1.6"/><path d="${copa(b.x + 14, b.y + 32, 18, 11, 8)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.6"/></g>`).join('')}</g>
    <g>${embauba(70, 168, .9)}${embauba(380, 196, .8)}${embauba(500, 252, .7)}</g>
    <g>${jussara(170, 150, .7, 0)}${jussara(260, 130, .75, -1.3)}${jussara(460, 236, .62, -2.2)}${jussara(30, 214, .7, -.6)}</g>
    <g>${samamb(40, 330, .9)}${samamb(240, 420, 1)}${samamb(150, 470, 1.1)}</g>
    <path d="M610 500 C640 470 660 452 700 446 C740 440 770 438 800 436 V500Z" fill="#F2DDA0" stroke="#C9A860" stroke-width="2"/>
    <path id="ma-mar" class="toque" d="M650 500 C680 480 700 466 740 460 C770 456 790 456 800 456 V500Z" fill="url(#maMar)" stroke="#1B5E9A" stroke-width="2"/>
    <path class="ma-onda" d="M672 486 q10 -4 20 0 t20 0 M716 470 q10 -4 20 0 t20 0 t20 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g id="ma-gaps"></g>
    <g id="ma-rio" style="opacity:0;transition:opacity .8s"><path d="${RIO}" stroke="#5E3A1C" stroke-width="15" fill="none" stroke-linecap="round" class="ma-rio-b"/><path id="ma-agua" d="${RIO}" stroke="#A8763E" stroke-width="10" fill="none" stroke-linecap="round"/><path id="ma-corre" d="${RIO}" stroke="#E6D2B0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="8 16"/></g>
    <g id="ma-nasc" class="toque"><circle cx="${NASC.x}" cy="${NASC.y}" r="13" fill="#7A5A3E" stroke="#3E2A18" stroke-width="2"/><circle id="ma-nasc-agua" cx="${NASC.x}" cy="${NASC.y}" r="8" fill="#7FCDEB" opacity=".25"/><circle cx="${NASC.x}" cy="${NASC.y}" r="26" fill="transparent"/></g>
    <g id="ma-peixes" style="opacity:0;transition:opacity 1s"></g>
    <g id="ma-arvores"></g>
    <g id="ma-broms">${BROM.map((b, i) => `<g class="toque ma-brom" data-fig="bromelia" data-b="${i}"><path d="M${b.x - 26} ${b.y + 8} C${b.x - 10} ${b.y + 2} ${b.x + 10} ${b.y + 2} ${b.x + 26} ${b.y + 8}" stroke="#3E2A18" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${b.x - 24} ${b.y + 6} C${b.x - 10} ${b.y + 1} ${b.x + 10} ${b.y + 1} ${b.x + 24} ${b.y + 6}" stroke="#8A6A4A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${b.x - 22} ${b.y + 9} q6 6 12 2 M${b.x + 8} ${b.y + 8} q6 5 12 1" stroke="#6CB858" stroke-width="3" fill="none" stroke-linecap="round"/><svg x="${b.x - 24}" y="${b.y - 38}" width="48" height="48" viewBox="0 0 100 100"><use href="#f-bromelia"/></svg><ellipse class="ma-seca" cx="${b.x}" cy="${(b.y - 8.3).toFixed(1)}" rx="6.2" ry="2.3" fill="#6E8A4A"/><g class="ma-pere" style="opacity:0;transition:opacity .5s, transform .5s;transform:translateY(6px)"><svg x="${b.x - 9}" y="${b.y - 22}" width="18" height="15" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg></g><rect x="${b.x - 30}" y="${b.y - 40}" width="60" height="54" fill="transparent"/></g>`).join('')}</g>
    <g class="toque" data-fig="tucano" id="ma-tucano"><g id="ma-tuc-in"><svg x="88" y="96" width="62" height="52" viewBox="0 0 120 100"><use href="#f-tucano"/></svg></g>${brilhoHotspot(140, 104)}</g>
    <g pointer-events="none">${heliconia(20, 505, .9)}${heliconia(92, 512, .7, -1)}${heliconia(300, 512, .62)}</g>
    <g id="ma-familia"><svg x="${FAMILIA.x - 34}" y="${FAMILIA.y - 30}" width="30" height="32" viewBox="0 0 120 130"><use href="#f-mico"/></svg><svg x="${FAMILIA.x - 6}" y="${FAMILIA.y - 22}" width="22" height="24" viewBox="0 0 120 130"><use href="#f-mico"/></svg><path d="M${FAMILIA.x - 8} ${FAMILIA.y + 22} C${FAMILIA.x - 10} ${FAMILIA.y + 40} ${FAMILIA.x - 4} ${FAMILIA.y + 54} ${FAMILIA.x - 8} ${FAMILIA.y + 70}" stroke="#3E2A18" stroke-width="8" fill="none"/><path d="${copa(FAMILIA.x - 8, FAMILIA.y + 14, 36, 15, 10)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.8"/><path d="M${FAMILIA.x - 34} ${FAMILIA.y + 6} q12 -6 24 -4" stroke="#B8F0A8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
    <g id="ma-coracoes"></g>
    <g class="toque" data-fig="mico" id="ma-mico" transform="translate(${MICO0.x} ${MICO0.y})"><g id="ma-mico-in"><svg x="-18" y="-38" width="36" height="39" viewBox="0 0 120 130"><use href="#f-mico"/></svg></g></g>
    <g id="ma-alvo" style="display:none"><circle r="20" fill="#FFE27A" opacity=".35"/><circle r="20" fill="none" stroke="#fff" stroke-width="3" class="pino-pulso"/><circle r="30" fill="transparent" class="toque"/></g>
    <g id="ma-nevoa" class="toque" style="cursor:grab"><ellipse cx="0" cy="0" rx="98" ry="40" fill="url(#maNevoa)"/><ellipse cx="-40" cy="-10" rx="50" ry="26" fill="url(#maNevoa)"/><ellipse cx="38" cy="-14" rx="56" ry="28" fill="url(#maNevoa)"/><g fill="#5A6787" opacity=".75"><circle cx="-14" cy="0" r="3.2"/><circle cx="14" cy="0" r="3.2"/><path d="M-6 9 q6 5 12 0" stroke="#5A6787" stroke-width="2.2" fill="none" stroke-linecap="round"/></g><rect x="-100" y="-44" width="200" height="88" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#maVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#maGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const nev = el(s, '#ma-nevoa'), agua = el(s, '#ma-agua'), corre = el(s, '#ma-corre');
  const posN = () => nev.setAttribute('transform', `translate(${nevX.toFixed(1)} ${nevY.toFixed(1)})`); posN();
  corre.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-48 }], { duration:900, iterations:Infinity });
  s.querySelectorAll('.ma-onda').forEach(o => o.animate([{ transform:'translateX(0)' }, { transform:'translateX(-12px)' }], { duration:2200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  /* 1. neblina: a mata "pega" a água das nuvens */
  const cheio = BROM.map(() => 0);
  nev.addEventListener('pointerdown', e => { if (fase !== 'neblina') return; const p = c.ponto(e); arrN = { dx: nevX - p.x, dy: nevY - p.y }; s.setPointerCapture(e.pointerId); nev.style.cursor = 'grabbing'; e.stopPropagation(); });
  s.addEventListener('pointermove', e => { if (!arrN) return; const p = c.ponto(e); nevX = Math.max(80, Math.min(740, p.x + arrN.dx)); nevY = Math.max(70, Math.min(260, p.y + arrN.dy)); posN(); });
  s.addEventListener('pointerup', () => { arrN = null; nev.style.cursor = 'grab'; });
  let ultT = performance.now(), dirN = -1;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    if (fase === 'neblina') {
      if (!arrN) { nevX += dirN * .35; if (nevX < 120 || nevX > 700) dirN *= -1; nevY += (150 - nevY) * .01; posN(); }
      if (Math.random() < .5) c.add({ tipo:'chuva', x:nevX + sorte(-70, 70), y:nevY + 20, vx:0, vy:sorte(2.5, 4), chao:Math.min(480, crista(nevX) + 40), cor:'#BFE6FF' });
      BROM.forEach((b, i) => {
        if (cheio[i] >= 1) return;
        if (Math.abs(nevX - b.x) < 90 && nevY < b.y && b.y - nevY < 150) {
          cheio[i] = Math.min(1, cheio[i] + dt / 2600);
          const g = s.querySelectorAll('.ma-brom')[i]; g.querySelector('.ma-seca').style.opacity = 1 - cheio[i];
          if (Math.random() < .08) c.add({ tipo:'brilho', x:b.x + sorte(-8, 8), y:b.y - 10, t:0, cor:'#BFE6FF' });
          if (cheio[i] >= 1) bromCheia(i, g);
        }
      });
    }
    requestAnimationFrame(vida);
  })(ultT);
  function bromCheia(i, g){
    nBrom++; toca('glub'); c.brilhos(BROM[i].x, BROM[i].y - 10, 8, '#BFE6FF');
    const p = g.querySelector('.ma-pere'); p.style.opacity = 1; p.style.transform = 'translateY(0)';
    api.hud(`<span class="chip">Bromélias com água: ${nBrom}/3</span>`);
    if (nBrom === 1) api.diz('A bromélia guardou água no copinho das folhas! Olha quem apareceu: uma perereca que vive ali dentro.');
    if (nBrom === 2) api.diz('Mais uma! As folhas da mata seguram a água da neblina, gotinha por gotinha.');
    if (nBrom === 3) { fase = 'nascente'; nev.style.transition = 'opacity 1s'; nev.style.opacity = 0; nev.style.pointerEvents = 'none'; depois(900, abreNascente); }
  }
  function abreNascente(){
    toca('splash'); el(s, '#ma-nasc-agua').setAttribute('opacity', 1); el(s, '#ma-rio').style.opacity = 1;
    const L = agua.getTotalLength(); s.querySelectorAll('#ma-rio path').forEach(p => { if (p.id === 'ma-corre') return; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = 'stroke-dashoffset 2.4s ease-out'; requestAnimationFrame(() => requestAnimationFrame(() => p.style.strokeDashoffset = 0)); });
    for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:NASC.x + sorte(-6, 6), y:NASC.y, t:i });
    depois(2600, () => {
      fase = 'ciliar';
      el(s, '#ma-gaps').innerHTML = GAP.map((g, i) => `<g class="toque ma-gap" data-g="${i}"><path d="${copa(g.x, g.y, 30, 15, 9, .18)}" fill="#B5723A" stroke="#6E3E1A" stroke-width="2"/><path d="M${g.x - 14} ${g.y - 4} l6 4 l-3 5 M${g.x + 8} ${g.y - 6} l5 5 M${g.x - 2} ${g.y + 4} l3 5" stroke="#6E3E1A" stroke-width="1.6" fill="none"/><ellipse cx="${g.x + 12}" cy="${g.y + 2}" rx="5" ry="2.6" fill="#8A5A30"/><g style="animation:flutua .9s ease-in-out ${-i * .2}s infinite alternate"><ellipse cx="${g.x}" cy="${g.y - 16}" rx="5.4" ry="7" fill="#8A5A30" stroke="#4E321C" stroke-width="1.4"/><path d="M${g.x} ${g.y - 22} c4 -6 10 -6 12 -4 c-4 0 -8 2 -12 4" fill="#7EC850" stroke="#3E6A22" stroke-width="1.2"/></g>${brilhoHotspot(g.x + 14, g.y - 22)}<rect x="${g.x - 34}" y="${g.y - 34}" width="68" height="52" fill="transparent"/></g>`).join('');
      api.hud('<span class="chip">Mata na beira do rio: 0/5</span>');
      api.diz('A água nasceu, mas está barrenta! Sem árvores na beira, a terra escorrega para dentro do rio. Toque nos pedaços pelados para plantar a mata ciliar.');
    });
  }
  /* 2. mata ciliar: plantar deixa o rio limpo */
  const mistura = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - k) + parseInt(b.substr(i + 1, 2), 16) * k).toString(16).padStart(2, '0')).join('');
  el(s, '#ma-gaps').addEventListener('click', e => {
    const g = e.target.closest('.ma-gap'); if (!g || fase !== 'ciliar') return; e.stopPropagation();
    const p = GAP[+g.dataset.g]; g.remove(); nPlant++; toca('planta');
    el(s, '#ma-arvores').insertAdjacentHTML('beforeend', `<g class="cresce"><path d="M${p.x} ${p.y + 6} C${p.x - 2} ${p.y - 6} ${p.x + 3} ${p.y - 14} ${p.x} ${p.y - 22}" stroke="#5E4428" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${copa(p.x - 10, p.y - 30, 20, 14, 9)}" fill="url(#maV2)" stroke="#145A30" stroke-width="1.8"/><path d="${copa(p.x + 12, p.y - 26, 18, 12, 8)}" fill="url(#maV4)" stroke="#145A30" stroke-width="1.8"/><path d="${copa(p.x, p.y - 42, 18, 12, 8)}" fill="url(#maV3)" stroke="#145A30" stroke-width="1.8"/><path d="M${p.x - 18} ${p.y - 46} q8 -5 16 -3" stroke="#B8F0A8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`);
    c.brilhos(p.x, p.y - 30, 10, '#D6F0A8');
    const k = nPlant / 5; agua.setAttribute('stroke', mistura('#A8763E', '#3D9BFF', k)); corre.setAttribute('stroke', mistura('#E6D2B0', '#E6F6FF', k));
    api.hud(`<span class="chip">Mata na beira do rio: ${nPlant}/5</span>`);
    if (nPlant === 2) api.diz('Viu? O rio já está ficando mais limpo. As raízes seguram a terra no lugar.');
    if (nPlant === 5) { toca('vitoria'); el(s, '#ma-peixes').style.opacity = 1; depois(1600, comecaCorredor); }
  });
  el(s, '#ma-peixes').innerHTML = [[470, 372], [600, 420], [400, 352]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g style="animation:flutua ${1 + i * .2}s ease-in-out infinite alternate"><path d="M-8 0 C-4 -5 4 -5 8 0 C4 5 -4 5 -8 0Z M-7 0 L-12 -4 L-12 4Z" fill="#FFB347" stroke="#8A4A10" stroke-width="1"/><circle cx="4" cy="-1" r="1" fill="#12235A"/></g></g>`).join('');
  /* 3. corredor: o mico atravessa pelas copas novas até a família */
  const mico = el(s, '#ma-mico'), alvo = el(s, '#ma-alvo');
  let micoX = MICO0.x, micoY = MICO0.y;
  const ROTA = [...GAP.map(g => ({ x:g.x, y:g.y - 50 })), { x:FAMILIA.x - 34, y:FAMILIA.y }];
  function mostraAlvo(){ const r = ROTA[nPulos]; alvo.style.display = ''; alvo.setAttribute('transform', `translate(${r.x} ${r.y - 14})`); }
  function comecaCorredor(){
    fase = 'corredor'; api.hud('<span class="chip">Pulos do mico: 0/6</span>');
    api.diz('A mata ciliar virou um caminho de árvores! Agora o mico-leão-dourado pode visitar a família. Toque no círculo brilhante para ele pular.');
    mostraAlvo();
  }
  alvo.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'corredor' || pulando) return; pulando = true; alvo.style.display = 'none';
    const r = ROTA[nPulos], x0 = micoX, y0 = micoY, t0 = performance.now(), dur = 700; toca('pop');
    el(s, '#ma-mico-in').setAttribute('transform', r.x < x0 ? 'scale(-1 1)' : '');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / dur), e = k*k*(3-2*k); micoX = x0 + (r.x - x0) * e; micoY = y0 + (r.y - y0) * e - Math.sin(k * Math.PI) * 46; mico.setAttribute('transform', `translate(${micoX.toFixed(1)} ${micoY.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else pousou(); })(t0);
  });
  function pousou(){
    pulando = false; nPulos++; c.brilhos(micoX, micoY - 10, 5, '#FFE27A');
    api.hud(`<span class="chip">Pulos do mico: ${nPulos}/6</span>`);
    if (nPulos === 3) api.diz('Isso! Sem árvores, o mico teria que descer no chão, onde é perigoso.');
    if (nPulos < 6) { mostraAlvo(); return; }
    fase = 'fim'; toca('vitoria');
    el(s, '#ma-coracoes').innerHTML = [0, 1, 2].map(i => `<path d="M${FAMILIA.x - 20 + i * 14} ${FAMILIA.y - 40} c-4 -6 -12 -2 -8 4 l8 8 l8 -8 c4 -6 -4 -10 -8 -4Z" fill="#FF6B8A" stroke="#9E2E4A" stroke-width="1.2" style="animation:flutua .8s ease-in-out ${-i * .25}s infinite alternate"/>`).join('');
    api.diz('A família está junta de novo! A Mata Atlântica protege as nascentes que levam água para a maioria das cidades do Brasil. Mata em pé, água limpa na torneira!');
    depois(5200, api.fim);
  }
  /* toques extras */
  el(s, '#ma-tucano').addEventListener('click', () => { el(s, '#ma-tuc-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:500 }); toca('pop'); });
  el(s, '#ma-pedra').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Na Serra do Mar tem morros de pedra bem lisinha. A água da chuva escorre por eles e desce para os rios.'); });
  el(s, '#ma-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(560, 70, 8, '#FFE27A'); api.diz('O sol aquece o mar, o vapor sobe e vira neblina. O vento leva essa neblina para a serra.'); });
  el(s, '#ma-mar').addEventListener('click', e => { e.stopPropagation(); toca('splash'); const p = c.ponto(e); for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:p.x + sorte(-8, 8), y:p.y, t:i }); api.diz('O mar fica pertinho da Mata Atlântica. Daqui sai a umidade que vira neblina e chuva na serra.'); });
  el(s, '#ma-nasc').addEventListener('click', e => { e.stopPropagation(); if (fase === 'neblina') { api.diz('Aqui é uma nascente, mas está quase seca. Leve a neblina até as bromélias e as árvores!'); toca('clique'); } else { toca('glub'); for (let i = 0; i < 4; i++) c.add({ tipo:'bolha', x:NASC.x + sorte(-5, 5), y:NASC.y, t:i }); } });
  api.hud('<span class="chip">Bromélias com água: 0/3</span>');
  api.diz('Oi, eu sou a Mica, uma mico-leão-dourado da Mata Atlântica! A neblina chegou do mar. Arraste a neblina até as bromélias para elas guardarem água.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
