/* ================= JOGO 1: Amazônia, a fábrica de chuva ================= */
function silhueta(x0, x1, base, amp, passo, sem){
  semente = sem; let d = `M${x0} 520 L${x0} ${base}`, x = x0;
  while (x < x1) { const w = passo * R(.6, 1.4), h = amp * R(.45, 1.25); d += ` Q${(x + w/2).toFixed(1)} ${(base - h*2).toFixed(1)} ${(x + w).toFixed(1)} ${(base + R(-3,3)).toFixed(1)}`; x += w; }
  return d + ` L${x1} 520Z`;
}
function copa(cx, cy, rx, ry, n, amp){
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n * Math.PI * 2, x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (!i) { d = `M${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
    const tm = (i - .5) / n * Math.PI * 2, k = 1 + (amp || .28) * R(.7, 1.2);
    d += ` Q${(cx + Math.cos(tm) * rx * k).toFixed(1)} ${(cy + Math.sin(tm) * ry * k).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + 'Z';
}
function textura(cx, cy, rx, ry, n, cor, larg){
  let d = '';
  for (let i = 0; i < n; i++) { const t = R(0, 6.28), r = Math.sqrt(R(0, 1)), x = cx + Math.cos(t) * rx * r, y = cy + Math.sin(t) * ry * r, w = R(3, 5.5); d += `M${(x - w).toFixed(1)} ${y.toFixed(1)} q${w.toFixed(1)} ${(-w * .9).toFixed(1)} ${(w * 2).toFixed(1)} 0 `; }
  return `<path d="${d}" stroke="${cor}" stroke-width="${larg || 1.5}" fill="none" stroke-linecap="round"/>`;
}
semente = 41;
const DEFS_AMZ = `
  <linearGradient id="aCeuDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB4F5"/><stop offset=".55" stop-color="#A9DDFB"/><stop offset="1" stop-color="#FFF1CF"/></linearGradient>
  <linearGradient id="aCeuAlva" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27346E"/><stop offset=".5" stop-color="#9A5C8C"/><stop offset=".85" stop-color="#F59A6B"/><stop offset="1" stop-color="#FFD39A"/></linearGradient>
  <radialGradient id="aSolBrilho"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE27A" stop-opacity=".5"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
  <radialGradient id="aSolDisco" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".6" stop-color="#FFD84D"/><stop offset="1" stop-color="#FFB52E"/></radialGradient>
  <linearGradient id="aRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8E2EC"/><stop offset=".4" stop-color="#6FB6CF"/><stop offset="1" stop-color="#3C88A8"/></linearGradient>
  <linearGradient id="aMargem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E8A4E"/><stop offset=".5" stop-color="#2A6E3E"/><stop offset="1" stop-color="#1A4E2E"/></linearGradient>
  <linearGradient id="aNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="aTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8977F"/><stop offset=".45" stop-color="#E6DAC7"/><stop offset="1" stop-color="#9A8870"/></linearGradient>
  <radialGradient id="aVinheta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#0A1A2E" stop-opacity="0"/><stop offset="1" stop-color="#0A1A2E" stop-opacity=".35"/></radialGradient>
  <linearGradient id="aRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>
  <filter id="aDesfoca" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="aSombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="aGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
  <symbol id="sumauma" viewBox="0 0 160 200">
    <ellipse cx="80" cy="196" rx="54" ry="6" fill="#0D3B22" opacity=".3"/>
    <path d="M30 200 C50 197 64 186 71 160 L74 200Z M130 200 C110 197 96 186 89 160 L86 200Z" fill="#C2B196" stroke="#6E5B45" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M50 200 C63 194 70 180 72 150 C73 128 74 110 76 92 L84 92 C86 110 87 128 88 150 C90 180 97 194 110 200Z" fill="url(#aTronco)" stroke="#6E5B45" stroke-width="2" stroke-linejoin="round"/>
    <path d="M79 100 V146 M83 108 q1.5 22 0 44 M66 192 q6 -10 6 -26 M94 192 q-6 -10 -6 -26 M76 160 q-1 12 -4 22" stroke="#8C7A62" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <g fill="none" stroke-linecap="round"><path d="M80 104 Q60 90 40 84 M80 104 Q100 88 122 82 M80 98 Q79 80 82 62" stroke="#6E5B45" stroke-width="6"/><path d="M80 104 Q60 90 40 84 M80 104 Q100 88 122 82 M80 98 Q79 80 82 62" stroke="#BFAE94" stroke-width="2.4"/></g>
    <path d="M104 88 C106 104 102 120 106 136" stroke="#3E7A3A" stroke-width="1.6" fill="none"/><g fill="#4FA35A">${[96,108,120,132].map((y,i) => `<ellipse cx="${i%2 ? 108 : 102}" cy="${y}" rx="3.2" ry="2" transform="rotate(${i%2 ? 30 : -30} ${i%2 ? 108 : 102} ${y})"/>`).join('')}</g>
    <g fill="#175A35" stroke="#0C3F23" stroke-width="2" stroke-linejoin="round"><path d="${copa(40,84,32,15,9)}"/><path d="${copa(122,82,32,15,9)}"/><path d="${copa(80,90,46,14,12)}"/></g>
    ${textura(80,88,50,10,14,'#0F4A2A')}
    <g fill="#23824C" stroke="#145C33" stroke-width="2" stroke-linejoin="round"><path d="${copa(50,66,32,18,10)}"/><path d="${copa(110,64,32,18,10)}"/><path d="${copa(80,60,40,20,12)}"/></g>
    ${textura(80,64,52,14,22,'#176B3D')}
    <g fill="#39A764" stroke="#1E7B45" stroke-width="1.8" stroke-linejoin="round"><path d="${copa(62,46,25,14,9)}"/><path d="${copa(100,44,25,14,9)}"/><path d="${copa(80,36,29,15,10)}"/></g>
    ${textura(80,42,34,10,14,'#2A8C50',1.3)}
    <g stroke="#B6F2C4" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"><path d="M64 28 q10 -7 22 -3"/><path d="M92 34 q7 -4 14 -1"/><path d="M36 56 q6 -4 12 -2"/><path d="M98 56 q7 -4 14 -1"/></g>
    <ellipse cx="80" cy="97" rx="50" ry="5" fill="#0A3A20" opacity=".35"/>
  </symbol>
  <symbol id="clareira" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="56" ry="10" fill="#8E5E34" stroke="#5E3A1C" stroke-width="1.6"/><ellipse cx="80" cy="191" rx="48" ry="6" fill="#A8743F"/>
    <path d="M52 192 L54 172 L70 172 L72 192Z M92 192 L94 178 L106 178 L108 192Z" fill="#7A4A2A" stroke="#4E2E18" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="62" cy="172" rx="8" ry="3" fill="#E2AE76" stroke="#4E2E18" stroke-width="1.4"/><ellipse cx="100" cy="178" rx="6" ry="2.4" fill="#E2AE76" stroke="#4E2E18" stroke-width="1.4"/>
    <ellipse cx="62" cy="172" rx="4" ry="1.4" fill="none" stroke="#B9834E" stroke-width="1"/><ellipse cx="100" cy="178" rx="3" ry="1.1" fill="none" stroke="#B9834E" stroke-width="1"/>
    <path d="M57 180 v8 M66 182 v8 M97 184 v6" stroke="#5E361C" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M30 194 q3 -9 6 0 M124 194 q3 -10 6 0 M80 196 q2 -6 4 0" stroke="#4E7A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="broto" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="56" ry="10" fill="#8E5E34" stroke="#5E3A1C" stroke-width="1.6"/><ellipse cx="80" cy="191" rx="48" ry="6" fill="#A8743F"/>
    <path d="M80 192 C80 182 81 176 80 166" stroke="#2F7A34" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 192 C80 182 81 176 80 166" stroke="#5FBF5A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M80 176 C68 176 60 168 58 158 C72 156 79 165 80 176Z" fill="#5FD483" stroke="#2B8A4A" stroke-width="1.6" stroke-linejoin="round"/><path d="M80 176 C72 172 66 166 61 160" stroke="#2B8A4A" stroke-width="1.2" fill="none"/>
    <path d="M80 170 C90 168 99 160 102 149 C88 149 81 158 80 170Z" fill="#43C06C" stroke="#237A40" stroke-width="1.6" stroke-linejoin="round"/><path d="M80 170 C88 164 95 157 99 152" stroke="#237A40" stroke-width="1.2" fill="none"/>
  </symbol>
  <symbol id="arvoreta" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="50" ry="8" fill="#5E7A2A" opacity=".45"/>
    <path d="M76 196 C77 176 77 158 78 138 L83 138 C84 158 84 176 85 196Z" fill="url(#aTronco)" stroke="#6E5B45" stroke-width="1.6"/>
    <path d="M80 160 Q70 152 64 146 M81 154 Q92 146 96 140" stroke="#6E5B45" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#23824C" stroke="#145C33" stroke-width="1.8" stroke-linejoin="round"><path d="${copa(64,142,20,12,8)}"/><path d="${copa(96,140,20,12,8)}"/></g>
    <path d="${copa(80,126,24,14,9)}" fill="#39A764" stroke="#1E7B45" stroke-width="1.8" stroke-linejoin="round"/>
    ${textura(80,134,30,12,10,'#1D7A44',1.3)}
    <path d="M70 118 q8 -6 18 -2" stroke="#B6F2C4" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  </symbol>
  <symbol id="arara-voa" viewBox="0 0 130 80">
    <path d="M46 44 C30 50 14 58 0 62 C10 52 26 44 42 38Z" fill="#E23A2E" stroke="#7A1410" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M44 42 C30 46 16 52 4 56" stroke="#2E7BF6" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M2 61 L12 56" stroke="#2E7BF6" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 40 C46 30 60 28 74 32 C82 36 84 46 76 50 C64 54 50 52 40 40Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M50 46 q8 3 18 1" stroke="#B3221A" stroke-width="1.4" fill="none"/>
    <g class="asa"><path d="M54 36 C46 16 54 2 72 0 C80 8 76 22 68 38Z" fill="#2E7BF6" stroke="#123E8E" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M56 34 C52 20 58 10 68 6 C70 16 68 26 64 36Z" fill="#FFC83D" stroke="#B07A00" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M58 34 C57 26 59 20 63 16 C64 24 63 30 62 35Z" fill="#E5392C"/>
      <path d="M62 4 L58 12 M70 3 L66 12 M76 8 L70 15" stroke="#123E8E" stroke-width="1.2" stroke-linecap="round"/></g>
    <circle cx="86" cy="34" r="12" fill="#E5392C" stroke="#7A1410" stroke-width="1.6"/>
    <path d="M86 28 C94 26 98 32 96 40 C92 42 88 40 86 36Z" fill="#fff" stroke="#C9C1B4" stroke-width="1"/><path d="M89 34 h5 M90 37 h4" stroke="#B9B0A2" stroke-width=".8"/>
    <circle cx="90" cy="32" r="2.6" fill="#12235A"/><circle cx="90.8" cy="31.2" r=".9" fill="#fff"/>
    <path d="M96 27 C108 26 112 36 106 44 C104 40 100 37 96 37Z" fill="#F1E9DA" stroke="#4E4336" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M96 38 C100 40 102 42 100 45 C97 44 95 42 95 40Z" fill="#2B2B33"/>
  </symbol>
  <symbol id="nuvem-rosto" viewBox="-4 -4 138 78">
    <use href="#nuvem" x="-2.5" y="-2" width="135" height="68" style="color:#8DB8E2"/>
    <use href="#nuvem" width="130" height="64" style="color:#fff"/>
    <path d="M12 52 C30 60 100 60 120 52 L120 60 Q66 66 12 60Z" fill="#DCEBFA"/>
    <ellipse cx="66" cy="18" rx="16" ry="5" fill="#fff" opacity=".9"/><path d="M58 14 q8 -6 18 -3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="pisca"><circle cx="54" cy="38" r="4.4" fill="#12235A"/><circle cx="76" cy="38" r="4.4" fill="#12235A"/><circle cx="55.6" cy="36.4" r="1.5" fill="#fff"/><circle cx="77.6" cy="36.4" r="1.5" fill="#fff"/></g>
    <path d="M60 46 Q65 51 70 46" stroke="#12235A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="46" cy="45" r="4" fill="#FF9DB5" opacity=".75"/><circle cx="84" cy="45" r="4" fill="#FF9DB5" opacity=".75"/>
  </symbol>
  <symbol id="folha-costela" viewBox="0 0 200 200">
    <path d="M10 196 C20 120 70 50 160 20 C190 70 170 150 90 190 C60 200 30 200 10 196Z" fill="#14593A"/>
    <path d="M14 194 C50 140 100 80 156 26" stroke="#2C8A57" stroke-width="5" fill="none"/>
    <g stroke="#2C8A57" stroke-width="3" fill="none"><path d="M40 160 C60 158 90 150 120 130 M60 128 C80 126 110 116 140 96 M84 96 C100 90 126 76 150 60 M36 150 C34 130 40 110 50 96 M64 116 C62 98 70 80 80 68"/></g>
    <g fill="#0F4A30"><ellipse cx="120" cy="150" rx="10" ry="16" transform="rotate(-40 120 150)"/><ellipse cx="150" cy="104" rx="8" ry="14" transform="rotate(-40 150 104)"/></g>
  </symbol>
  <symbol id="folha-palma" viewBox="0 0 220 200">
    <g stroke="#17603D" stroke-width="5" stroke-linecap="round" fill="none"><path d="M210 200 C170 150 120 110 40 90"/></g>
    <g fill="#1D6E45">${Array.from({length:11}, (_, i) => { const t = i/10, x = 210 - 170*t, y = 200 - 110*t + 20*t*t; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q-${(20 + 10*t).toFixed(0)} ${(30 - 4*i).toFixed(0)} -${(46 - 16*t).toFixed(0)} ${(46 - 3*i).toFixed(0)} q${(30 - 10*t).toFixed(0)} -${(10).toFixed(0)} ${(46 - 16*t).toFixed(0)} -${(46 - 3*i).toFixed(0)}Z"/><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-${(10 + 6*t).toFixed(0)} -${(34 - 2*i).toFixed(0)} -${(40 - 12*t).toFixed(0)} -${(44 - 2*i).toFixed(0)} q${(18).toFixed(0)} ${(20).toFixed(0)} ${(40 - 12*t).toFixed(0)} ${(44 - 2*i).toFixed(0)}Z"/>`; }).join('')}</g>
  </symbol>`;

function jogoAmazonia(palco, api){
  let c = null, fase = 'alvorecer', vivo = true;
  const timers = [];
  const depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const SLOTS = [62, 168, 274, 380, 486, 592].map((x, i) => ({ x, y: 156, est: [1,3,4].includes(i) ? 'clareira' : 'sumauma', ocup:false }));

  /* ---------- cena 1: a floresta ---------- */
  function cenaFloresta(){
    semente = 3;
    let raios = ''; for (let i = 0; i < 7; i++) { const a = -70 + i*24; raios += `<path d="M0 0 L${(Math.cos(a*RAD)*700).toFixed(0)} ${(Math.sin(a*RAD)*700 + 300).toFixed(0)} L${(Math.cos((a+7)*RAD)*700).toFixed(0)} ${(Math.sin((a+7)*RAD)*700 + 300).toFixed(0)}Z" fill="url(#aRaio)"/>`; }
    const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Floresta amazônica ao amanhecer, com rio, árvores e clareiras">
      <defs>${DEFS_AMZ}</defs>
      <rect width="800" height="500" fill="url(#aCeuDia)"/>
      <rect id="a-alva" width="800" height="500" fill="url(#aCeuAlva)" style="transition:opacity .3s"/>
      <g id="a-raios" opacity="0" style="transition:opacity 1s"><g class="gira-lento">${raios}</g></g>
      <g id="a-sol" class="toque"><circle r="120" fill="url(#aSolBrilho)"/><circle r="36" fill="url(#aSolDisco)"/><circle r="60" fill="transparent"/></g>
      <g class="deriva"><use href="#nuvem" x="470" y="40" width="130" height="62" style="color:#fff" opacity=".75"/><use href="#nuvem" x="660" y="96" width="90" height="44" style="color:#fff" opacity=".6"/></g>
      <path d="${silhueta(-10, 820, 236, 12, 30, 4)}" fill="#86BDA9" stroke="#A9D6C3" stroke-width="2"/>
      <rect x="0" y="214" width="800" height="60" fill="url(#aNevoa)" filter="url(#aDesfoca)" class="deriva-nevoa"/>
      <path d="${silhueta(-10, 820, 262, 16, 38, 5)}" fill="#5CA580" stroke="#7FC09C" stroke-width="2"/>${textura(400, 280, 420, 14, 40, "#4E9672", 1.4)}
      <g fill="#4B9670" stroke="#3E8662" stroke-width="1.6">${[120, 430, 700].map(x => `<rect x="${x-3}" y="196" width="6" height="70"/><path d="${copa(x,194,34,11,9)}"/><path d="${copa(x,183,22,8,7)}" fill="#58A47D"/>`).join('')}</g>
      <path d="${silhueta(-10, 820, 290, 20, 44, 6)}" fill="#3FA06A" transform="translate(0 -5)"/>
      <path d="${silhueta(-10, 820, 290, 20, 44, 6)}" fill="#2B7F50"/>${textura(400, 312, 420, 22, 70, "#22693F", 1.6)}${textura(400, 300, 420, 10, 40, "#46A56E", 1.4)}
      <g id="a-arvores"></g>
      <g id="a-casa" class="toque" data-fig="ribeirinha"><svg x="652" y="248" width="120" height="98" viewBox="0 0 160 130"><use href="#f-ribeirinha"/></svg>${brilhoHotspot(758,256)}</g>
      <path d="M0 336 C140 326 260 344 400 336 S660 324 800 334 V470 H0Z" fill="url(#aRio)"/><path d="M0 336 C140 326 260 344 400 336 S660 324 800 334" stroke="#2E6E54" stroke-width="3" fill="none"/><path d="M0 341 C140 331 260 349 400 341 S660 329 800 339" stroke="#D8F1F5" stroke-width="2" fill="none" opacity=".7"/>
      <g id="a-reflexo" opacity="0" style="transition:opacity 1s"><g stroke="#FFF6C8" stroke-width="4" stroke-linecap="round" opacity=".8"><path d="M118 352 h44 M108 366 h64 M122 380 h36 M130 394 h20"/></g></g>
      <g stroke="#fff" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round" fill="none" class="brilha-agua"><path d="M260 356 q12 -4 24 0 M420 372 q14 -5 28 0 M560 352 q12 -4 24 0 M330 396 q14 -5 28 0 M640 390 q12 -4 24 0"/></g>
      <g class="toque" data-fig="vitoria"><svg x="430" y="378" width="96" height="50" viewBox="0 0 150 80"><use href="#f-vitoria"/></svg><svg x="512" y="398" width="60" height="32" viewBox="0 0 150 80"><use href="#f-vitoria"/></svg>${brilhoHotspot(510,386)}</g>
      <g class="toque" data-fig="boto"><rect x="250" y="340" width="120" height="76" fill="transparent"/><g class="pula"><svg x="262" y="346" width="92" height="61" viewBox="0 0 150 100"><use href="#f-boto"/></svg></g></g>
      <g stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round" fill="none"><path d="M60 426 q14 -4 28 0 M200 432 q12 -4 24 0 M610 428 q14 -4 28 0 M720 420 q10 -3 20 0"/></g>
      <path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446 V500 H0Z" fill="url(#aMargem)"/>
      <path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446" stroke="#8A6A44" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446" stroke="#C8E8E0" stroke-width="2" fill="none" transform="translate(0 -5)" opacity=".7"/>
      <g>${[[150, 452, 9], [330, 446, 7], [470, 458, 8], [690, 452, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#8A8A7A" stroke="#4E4E44" stroke-width="1.4"/><path d="M${x - r * .5} ${y - r * .25} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#D8D8C8" stroke-width="1.2" fill="none"/>`).join('')}</g>
      ${[[40, 486, '#3E9A4E'], [210, 490, '#5AAE3A'], [390, 494, '#2E8A5A'], [570, 488, '#6AB84A'], [770, 492, '#3E9A4E']].map(([x, y, cor]) => `<path d="${copa(x, y - 14, 36, 22, 10, .3)}" fill="${cor}" stroke="#1E5A2E" stroke-width="2"/><path d="${copa(x - 8, y - 26, 20, 12, 7, .3)}" fill="#8AD06A" stroke="#2E7A2E" stroke-width="1.4" opacity=".9"/>${textura(x, y - 12, 30, 12, 6, "#1E5A2E", 1.2)}<path d="M${x - 20} ${y - 30} q10 -7 22 -4" stroke="#E0FFC0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
      <g stroke-linecap="round" fill="none">${Array.from({length:34}, (_, i) => { const x = 10 + i*24 + R(-6,6), y = 452 + R(0,10), cor = ['#4EAE5E', '#7CC24E', '#3C9A5E', '#9AD06A'][i % 4]; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${R(-4,4).toFixed(0)} -${R(8,14).toFixed(0)} ${R(-8,8).toFixed(0)} -${R(14,24).toFixed(0)}" stroke="${cor}" stroke-width="2.6"/>`; }).join('')}</g>
      ${[[270, 448], [300, 454], [640, 446]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-30" stroke="#3E7A2A" stroke-width="2.4"/>${[0, 1, 2].map(k => `<path d="M0 ${-10 - k * 8} l${k % 2 ? 10 : -10} -4 l${k % 2 ? -2 : 2} 7Z" fill="${k === 2 ? '#FFD25A' : '#E5392C'}" stroke="#8A1E14" stroke-width="1"/>`).join('')}<path d="M0 -6 C-14 -10 -20 -22 -18 -34 C-8 -26 -2 -16 0 -6Z" fill="#4E9E3A" stroke="#1E5A1E" stroke-width="1.2"/></g>`).join('')}
      <g class="balanca"><use href="#folha-costela" x="-70" y="350" width="230" height="230"/></g>
      <g class="balanca" style="animation-delay:-1.4s"><use href="#folha-palma" x="610" y="330" width="250" height="230"/></g>
      <g id="a-nuvens"></g>
      <g id="a-arara-voo"></g>
      <g id="a-mao" pointer-events="none"><g class="mao-dica"><circle r="16" fill="#fff" opacity=".85"/><path d="M-4 8 V-8 a4 4 0 0 1 8 0 V2 l6 1 a4 4 0 0 1 3 5 l-3 9 h-14Z" fill="#FFC83D" stroke="#12235A" stroke-width="2" stroke-linejoin="round" transform="translate(0 -2) scale(.9)"/></g></g>
      <rect width="800" height="500" fill="url(#aVinheta)" pointer-events="none"/>
      <rect width="800" height="500" filter="url(#aGrao)" pointer-events="none"/>
    </svg>`;
    c = criarCena(palco, svg);
    const s = c.svg;
    const sol = el(s, '#a-sol'), alva = el(s, '#a-alva');
    let sy = 300; const SX = 150;
    const posSol = y => { sy = Math.max(84, Math.min(320, y)); sol.setAttribute('transform', `translate(${SX} ${sy})`); const k = (320 - sy) / (320 - 84); alva.style.opacity = 1 - k; el(s, '#a-raios').style.opacity = k > .85 ? 1 : 0; el(s, '#a-reflexo').style.opacity = k; el(s, '#a-raios').setAttribute('transform', `translate(${SX} ${sy - 300})`); };
    posSol(250);
    el(s, '#a-mao').setAttribute('transform', `translate(${SX + 46} 200)`);
    let arrSol = null;
    s.addEventListener('pointerdown', e => { if (fase !== 'alvorecer') return; arrSol = { y: c.ponto(e).y, sy, moveu: 0 }; s.setPointerCapture(e.pointerId); });
    s.addEventListener('pointermove', e => { if (arrSol) { const dy = c.ponto(e).y - arrSol.y; arrSol.moveu = Math.max(arrSol.moveu, Math.abs(dy)); posSol(arrSol.sy + dy); if (sy < 140) nascer(); } });
    s.addEventListener('pointerup', () => { if (arrSol && fase === 'alvorecer') { const m = arrSol.moveu; arrSol = null; if (sy < 220 || m < 8) nascer(); else posSol(250); } });
    function nascer(){
      if (fase !== 'alvorecer') return; fase = 'floresta'; arrSol = null;
      el(s, '#a-mao').remove(); toca('vitoria');
      const y0 = sy, t0 = performance.now();
      (function sobe(t){ const k = Math.min(1, (t - t0)/900); posSol(y0 + (84 - y0) * (1 - (1-k)*(1-k))); if (k < 1 && vivo) requestAnimationFrame(sobe); })(t0);
      api.diz('Bom dia, floresta! Com o calor do Sol, as árvores soltam vapor de água pelas folhas. Toque nas árvores para ajudar. Nas clareiras, toque para a arara plantar uma semente!');
      autoVapor();
    }
    /* árvores */
    const gArv = el(s, '#a-arvores');
    function desenhaArvores(anima){
      gArv.innerHTML = SLOTS.map((sl, i) => `<g class="toque slot" data-slot="${i}" transform="translate(${sl.x - 80} ${sl.y})"><g class="${anima === i ? 'cresce' : 'balanca'}" style="animation-delay:${-i*.7}s"><use href="#${sl.est}" width="160" height="200"/></g>${sl.est === 'clareira' && fase !== 'alvorecer' ? brilhoHotspot(80, 150) : ''}<rect x="10" y="20" width="140" height="180" fill="transparent"/></g>`).join('');
    }
    desenhaArvores();
    gArv.addEventListener('click', e => {
      const g = e.target.closest('.slot'); if (!g || fase === 'alvorecer') return;
      const i = +g.dataset.slot, sl = SLOTS[i];
      if (sl.est === 'sumauma') {
        toca('vapor'); const ag = g.firstElementChild; ag.classList.remove('balanca'); ag.classList.add('chacoalha'); depois(520, () => { ag.classList.remove('chacoalha'); ag.classList.add('balanca'); });
        for (let k = 0; k < 6; k++) vapor(sl, k * 60);
      } else if (sl.est === 'clareira' && !sl.ocup) { sl.ocup = true; araraPlanta(i); }
    });
    function vapor(sl, atraso){
      depois(atraso || 0, () => c.add({ tipo:'vapor', x0: sl.x + sorte(-40, 40), y0: sl.y + 40 + sorte(-10, 10), x1: sl.x + sorte(-90, 90), y1: sorte(70, 150), r: sorte(7, 12), dur: sorte(70, 100), f: sorte(0, 6), chega: chegouVapor }));
    }
    let carga = 0;
    function chegouVapor(){ if (fase !== 'floresta') return; carga++; if (carga % 5 === 0) novaNuvenzinha(); }
    function autoVapor(){
      if (!vivo || fase !== 'floresta') return;
      const vivas = SLOTS.filter(sl => sl.est === 'sumauma');
      if (vivas.length) vapor(vivas[Math.floor(Math.random()*vivas.length)]);
      depois(Math.max(260, 1300 - vivas.length * 150), autoVapor);
    }
    /* arara planta semente */
    function araraPlanta(i){
      const sl = SLOTS[i], g = el(s, '#a-arara-voo');
      toca('pop');
      const voo = document.createElementNS(NS, 'g'); voo.innerHTML = '<use href="#arara-voa" x="-65" y="-40" width="130" height="80"/>'; g.appendChild(voo);
      const x0 = -80, x1 = 880, ty = 150, t0 = performance.now(), dur = 2200; let soltou = false;
      (function voa(t){
        if (!vivo) return;
        const k = Math.min(1, (t - t0)/dur), x = x0 + (x1 - x0)*k, y = ty - 60*Math.sin(k*Math.PI) + 10*Math.sin(t/120);
        voo.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.8)`);
        if (!soltou && x >= sl.x) { soltou = true; c.add({ tipo:'semente', x, y: y + 10, alvoY: sl.y + 186, vy: 1, chega: () => crescer(i) }); toca('clique'); }
        if (k < 1) requestAnimationFrame(voa); else voo.remove();
      })(t0);
    }
    function crescer(i){
      const sl = SLOTS[i];
      sl.est = 'broto'; desenhaArvores(i); toca('planta'); c.brilhos(sl.x, sl.y + 170, 6, '#9CF0B0');
      depois(1300, () => { sl.est = 'arvoreta'; desenhaArvores(i); toca('pop'); });
      depois(2600, () => { sl.est = 'sumauma'; sl.ocup = false; desenhaArvores(i); toca('ok'); c.brilhos(sl.x, sl.y + 60, 8, '#FFE27A');
        if (SLOTS.every(q => q.est === 'sumauma')) api.diz('A floresta está inteira de novo! Mais árvores, mais vapor, mais nuvens.'); });
    }
    /* nuvenzinhas */
    const gN = el(s, '#a-nuvens'), NUVS = [];
    const META = 5;
    function novaNuvenzinha(){
      if (NUVS.length >= META || fase !== 'floresta') return;
      let x, y, ok, tent = 0;
      do { x = sorte(130, 690); y = sorte(56, 150); ok = NUVS.every(n => Math.hypot(n.x - x, n.y - y) > 110); tent++; } while (!ok && tent < 30);
      const n = { x, y, tam: 1, el: document.createElementNS(NS, 'g') };
      n.el.setAttribute('class', 'toque nuvenzinha'); n.el.innerHTML = '<g class="nz-esc cresce"><use href="#nuvem-rosto" x="-65" y="-35" width="130" height="70"/></g>';
      gN.appendChild(n.el); NUVS.push(n); posN(n); toca('pop');
      api.hud(`<span class="chip">Nuvenzinhas ${NUVS.length}/${META}</span>`);
      if (NUVS.length === 1) api.diz('Olha! O vapor subiu e virou uma nuvenzinha. Continue até juntar cinco!');
      if (NUVS.length >= META) { fase = 'juntar'; api.diz('Que monte de nuvenzinhas! Agora arraste uma até a outra para juntar todas numa nuvem bem grande.'); api.hud('<span class="chip">Junte as nuvens</span>'); }
    }
    const escN = t => 0.62 + 0.2 * t;
    function posN(n){ n.el.setAttribute('transform', `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) scale(${escN(n.tam).toFixed(2)})`); }
    let arrN = null;
    gN.addEventListener('pointerdown', e => {
      if (fase !== 'juntar') return;
      const g = e.target.closest('.nuvenzinha'); if (!g) return;
      const n = NUVS.find(n => n.el === g); const p = c.ponto(e);
      arrN = { n, dx: n.x - p.x, dy: n.y - p.y }; s.setPointerCapture(e.pointerId); gN.appendChild(g);
    });
    s.addEventListener('pointermove', e => { if (!arrN) return; const p = c.ponto(e); arrN.n.x = Math.max(60, Math.min(740, p.x + arrN.dx)); arrN.n.y = Math.max(40, Math.min(220, p.y + arrN.dy)); posN(arrN.n); });
    s.addEventListener('pointerup', () => {
      if (!arrN) return; const a = arrN.n; arrN = null;
      const b = NUVS.filter(n => n !== a).sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y))[0];
      if (b && Math.hypot(b.x - a.x, b.y - a.y) < 50 + 30 * (escN(a.tam) + escN(b.tam))) {
        b.tam += a.tam; a.el.remove(); NUVS.splice(NUVS.indexOf(a), 1);
        b.x = (a.x + b.x) / 2; b.y = (a.y + b.y) / 2; posN(b);
        const e2 = b.el.querySelector('.nz-esc'); e2.classList.remove('cresce'); void e2.getBBox(); e2.classList.add('cresce');
        toca('splash'); c.brilhos(b.x, b.y, 6, '#fff');
        if (NUVS.length === 1) grandona(b);
      }
    });
    function grandona(n){
      fase = 'pronta'; toca('vitoria');
      n.x = 400; n.y = 110; n.el.style.transition = 'transform 1s ease-in-out'; posN(n);
      api.hud('<span class="chip">Rio voador pronto!</span>');
      api.diz('Uau! Nasceu um rio voador: uma nuvem enorme cheia de água que vai viajar pelo céu. Vamos com ela!');
      let foi = false; const seguir = () => { if (foi || !vivo) return; foi = true; api.botoes([]); paraMapa(); };
      api.botoes([{ txt:'Seguir o rio voador', cls:'azul', fn:seguir }]);
      n.el.classList.add('toque'); n.el.style.cursor = 'pointer'; n.el.addEventListener('click', seguir);
      depois(1200, () => { const h = document.createElementNS('http://www.w3.org/2000/svg', 'g'); h.innerHTML = brilhoHotspot(80, -30); n.el.querySelector('.nz-esc') ? n.el.querySelector('.nz-esc').appendChild(h) : n.el.appendChild(h); });
      depois(9000, seguir);
    }
    api.hud('');
    api.diz('Oi, eu sou a Rosinha, uma boto-cor-de-rosa! Ainda está escuro na floresta. Arraste o Sol para cima para o dia começar.');
  }

  /* ---------- cena 2: o mapa dos rios voadores ---------- */
  const MX = lon => (lon + 83) * 16, MY = lat => (9 - lat) * 11.6;
  const mp = pts => 'M' + pts.map(p => `${MX(p[0]).toFixed(1)} ${MY(p[1]).toFixed(1)}`).join(' L') + 'Z';
  const ml = pts => 'M' + pts.map(p => `${MX(p[0]).toFixed(1)} ${MY(p[1]).toFixed(1)}`).join(' L');
  const ANDES = [[-77,7],[-76,4],[-77.5,1],[-78.5,-2],[-77,-6],[-75,-10],[-72,-14],[-69.5,-17],[-68.5,-20],[-68.5,-24],[-69.5,-28],[-70,-32],[-70,-36]];
  function andesX(y){
    for (let i = 0; i < ANDES.length - 1; i++) { const y0 = MY(ANDES[i][1]), y1 = MY(ANDES[i+1][1]); if (y >= y0 && y <= y1) { const k = (y - y0)/(y1 - y0); return MX(ANDES[i][0]) + (MX(ANDES[i+1][0]) - MX(ANDES[i][0]))*k; } }
    return y < MY(ANDES[0][1]) ? MX(ANDES[0][0]) : MX(ANDES[ANDES.length-1][0]);
  }
  function paraMapa(){
    const veu = document.createElement('div'); veu.className = 'veu'; palco.appendChild(veu);
    depois(450, () => { c.parar(); palco.querySelectorAll('svg,canvas').forEach(e => e.remove()); cenaMapa(); veu.classList.add('sai'); depois(500, () => veu.remove()); });
  }
  function cenaMapa(){
    fase = 'mapa';
    semente = 9;
    let arvorinhas = ''; for (let i = 0; i < 160; i++) { const lon = R(-77, -47), lat = R(-12, 4); arvorinhas += `<circle cx="${MX(lon).toFixed(0)}" cy="${MY(lat).toFixed(0)}" r="${R(4,7).toFixed(1)}" fill="${rnd() < .5 ? '#1F7E46' : '#2C9455'}"/>`; }
    let montes = ''; ANDES.forEach((p, i) => { if (i === ANDES.length - 1) return; const q = ANDES[i+1]; for (let k = 0; k < 3; k++) { const t = k/3, x = MX(p[0] + (q[0]-p[0])*t), y = MY(p[1] + (q[1]-p[1])*t), h = R(18, 30), w = R(14, 20); montes += `<path d="M${(x-w).toFixed(0)} ${(y+8).toFixed(0)} L${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w).toFixed(0)} ${(y+8).toFixed(0)}Z" fill="#9A7A5C"/><path d="M${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w).toFixed(0)} ${(y+8).toFixed(0)} L${(x+w*.2).toFixed(0)} ${(y+8).toFixed(0)}Z" fill="#7C5E44"/><path d="M${(x-w*.35).toFixed(0)} ${(y-h*.6).toFixed(0)} L${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w*.35).toFixed(0)} ${(y-h*.6).toFixed(0)} L${x.toFixed(0)} ${(y-h*.5).toFixed(0)}Z" fill="#fff"/>`; } });
    const ROTA = [[-36,1],[-50,-1],[-63,-3],[-72,-7],[-70,-15],[-62,-19],[-54,-22],[-46,-24.5]];
    const ALVOS = [
      { id:'campo', nome:'Plantações', lon:-55, lat:-13, fala:'Choveu nas plantações! A comida que a gente come precisa de muita água para crescer.' },
      { id:'usina', nome:'Usina e represa', lon:-52, lat:-19.5, fala:'A represa encheu! Com a água, a usina hidrelétrica faz energia e as luzes das cidades acendem.' },
      { id:'cidade', nome:'Cidade', lon:-46, lat:-23, fala:'A represa da cidade encheu! Agora tem água tratada na torneira das casas.' }
    ];
    const icone = a => ({
      campo:`<circle r="34" fill="#FFF3D6" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><rect x="-34" y="-34" width="68" height="68" fill="#D9B46C" class="m-seco"/><g class="m-verde" opacity="0" style="transition:opacity 1s"><rect x="-34" y="-34" width="68" height="68" fill="#7CCB5A"/>${[-20,-6,8,22].map(x => `<path d="M${x} 24 V-6 M${x-6} 6 q6 -10 6 -14 q0 4 6 14" stroke="#2E8B3A" stroke-width="3" fill="none"/>`).join('')}</g><path d="M-34 10 H34 M-34 22 H34" stroke="#B48E4A" stroke-width="2" class="m-seco"/></g>`,
      usina:`<circle r="34" fill="#E9F1FF" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><rect x="-34" y="4" width="68" height="40" fill="#3D8BFF" class="m-agua" style="transition:transform 1.2s" transform="translate(0 16)"/><path d="M-12 -30 H12 L18 34 H-18Z" fill="#B6BFD4"/><path d="M-12 -30 H12 L14 -10 H-14Z" fill="#9AA6C2"/><path d="M4 -24 L-4 -8 H2 L-3 6 L8 -12 H2 L7 -24Z" fill="#FFC83D" class="m-raio" opacity=".25"/></g>`,
      cidade:`<circle r="34" fill="#E9F1FF" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><g fill="#7C8AA8"><rect x="-26" y="-14" width="14" height="44"/><rect x="-10" y="-26" width="16" height="56"/><rect x="8" y="-8" width="16" height="38"/></g><g fill="#5A6787" class="m-janelas">${[[-23,-8],[-23,2],[-6,-20],[-6,-10],[-6,0],[0,-20],[0,-10],[11,-2],[17,-2],[11,8]].map(p => `<rect x="${p[0]}" y="${p[1]}" width="4" height="5"/>`).join('')}</g><rect x="-34" y="26" width="68" height="10" fill="#2E8B3A"/></g>`
    })[a.id];
    const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Mapa da América do Sul com a Amazônia, a Cordilheira dos Andes, plantações, usina e cidade">
      <defs>
        <linearGradient id="mMar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BB8F0"/><stop offset="1" stop-color="#2369C4"/></linearGradient>
        <linearGradient id="mTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD07A"/><stop offset="1" stop-color="#6DB866"/></linearGradient>
        ${DEFS_AMZ}
        <clipPath id="mTerraClip"><path d="${mp(CONT.sul)}"/></clipPath>
        <clipPath id="mClip"><circle r="31"/></clipPath>
        <filter id="mSombra" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#0A2A5A" flood-opacity=".35"/></filter>
        <filter id="mGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
        <marker id="mSeta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#fff"/></marker>
      </defs>
      <rect width="800" height="500" fill="url(#mMar)"/>
      <g stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none" stroke-linecap="round">${Array.from({length:26}, () => { const x = R(0,800), y = R(0,500); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -5 16 0 t16 0"/>`; }).join('')}</g>
      <path d="${mp(CONT.sul)}" fill="#1E5FA8" transform="translate(4 8)" opacity=".5"/>
      <path d="${mp(CONT.sul)}" fill="url(#mTerra)" stroke="#E9F7D8" stroke-width="3" filter="url(#mSombra)"/>
      <g clip-path="url(#mTerraClip)">
        <path d="${mp([[-56,-11],[-48,-9],[-44,-8],[-41,-15],[-45,-20],[-50,-21],[-55,-17],[-58,-14]])}" fill="#C9C870"/>
        <path d="${mp([[-45,-3],[-38,-5],[-36,-10],[-41,-15],[-44,-10]])}" fill="#E2C58A"/>
        <ellipse cx="${MX(-57)}" cy="${MY(-18.5)}" rx="26" ry="30" fill="#6FC3B8"/>
        <path d="${mp([[-35,-6],[-39,-14],[-40,-21],[-45,-24],[-49,-27],[-52,-26],[-48,-22],[-43,-19],[-41,-12],[-37,-7]])}" fill="#3FA864"/>
        <path d="${mp([[-77,-2],[-72,2],[-66,3],[-60,4],[-54,2],[-50,0],[-48,-3],[-46,-5],[-48,-9],[-52,-10],[-56,-11],[-60,-12],[-64,-12],[-69,-11],[-73,-8],[-76,-5]])}" fill="#2A9156"/>
        ${arvorinhas}
        <path d="${ml([[-73,-4],[-66,-3.2],[-60,-3.2],[-55,-2.4],[-52,-1.6],[-49.5,-0.6]])}" stroke="#4DA9E8" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="${ml([[-47.5,-19],[-50,-21],[-52,-23],[-54,-25.5],[-56.5,-29],[-58.5,-33.5]])}" stroke="#4DA9E8" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${montes}
      </g>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff" stroke="#12235A" stroke-opacity=".35" stroke-width="3" paint-order="stroke">
        <text x="${MX(-66)}" y="${MY(-6.5)}" font-size="18">Amazônia</text>
        <text x="${MX(-82)}" y="${MY(-23)}" font-size="13" transform="rotate(-62 ${MX(-82)} ${MY(-23)})">Cordilheira dos Andes</text>
        <text x="785" y="${MY(-30)}" font-size="16" text-anchor="end">Oceano Atlântico</text>
      </g>
      <path id="m-rota" d="${ml(ROTA)}" stroke="#fff" stroke-opacity=".35" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${ml(ROTA)}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="10 14" class="vento" marker-end="url(#mSeta)"/>
      <g id="m-alvos">${ALVOS.map(a => `<g class="toque m-alvo" data-a="${a.id}" transform="translate(${MX(a.lon).toFixed(0)} ${MY(a.lat).toFixed(0)})" filter="url(#mSombra)">${icone(a)}<g transform="translate(0 50)"><rect x="-64" y="-12" width="128" height="24" rx="12" fill="#fff"/><text text-anchor="middle" y="5" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#12235A">${a.nome}</text></g><g class="m-ok" opacity="0" style="transition:opacity .4s"><circle cx="26" cy="-26" r="13" fill="#22A565" stroke="#fff" stroke-width="3"/><path d="M20 -26 l4 4 l8 -8" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g>
      <g id="m-nuvem" class="toque" style="cursor:grab"><g class="nz-esc"><use href="#nuvem-rosto" x="-80" y="-43" width="160" height="86"/></g><svg x="-12" y="-74" width="30" height="36" viewBox="-8 -6 136 166"><use href="#pingo"/></svg><g id="m-gotas"></g></g>
      <rect width="800" height="500" filter="url(#mGrao)" pointer-events="none"/>
    </svg>`;
    c = criarCena(palco, svg);
    const s = c.svg, nuvem = el(s, '#m-nuvem');
    let nx = MX(-62), ny = MY(-3), carga = 3, batida = false, chovendo = false;
    const feitos = {};
    const posM = () => { nuvem.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)}) scale(${(0.7 + carga*0.1).toFixed(2)})`); };
    const gotas = () => { el(s, '#m-gotas').innerHTML = Array.from({length:carga}, (_, i) => `<use href="#gota" x="${-24 + i*18}" y="34" width="12" height="16" style="color:#2E7BF6"/>`).join(''); };
    posM(); gotas();
    api.hud('<span class="chip">Leve a chuva: 0/3</span>');
    api.diz('O vento empurra o rio voador para o oeste, até a Cordilheira dos Andes. As montanhas são uma parede gigante! Arraste a nuvem e leve a chuva até as plantações, a usina e a cidade.');
    function mover(x, y){
      const lim = andesX(y) + 34;
      if (x < lim) { x = lim; if (!batida) { batida = true; toca('glub'); nuvem.classList.remove('treme-svg'); void nuvem.getBBox(); nuvem.classList.add('treme-svg'); api.diz('Opa! Os Andes são altos demais para a nuvem passar. Por isso o rio voador desvia para o sul, em direção ao centro do Brasil.'); depois(4000, () => batida = false); } }
      nx = Math.max(40, Math.min(770, x)); ny = Math.max(30, Math.min(470, y)); posM(); verAlvos();
    }
    function verAlvos(){
      if (chovendo) return;
      ALVOS.forEach(a => { if (!feitos[a.id] && Math.hypot(MX(a.lon) - nx, MY(a.lat) - (ny + 40)) < 46) chover(a); });
    }
    function chover(a){
      chovendo = true; arr = null; toca('chuva');
      c.chover(nx - 50, nx + 50, ny + 30, MY(a.lat) + 20, 70, '#BFE6FF');
      const g = el(s, `.m-alvo[data-a="${a.id}"]`);
      depois(1300, () => {
        feitos[a.id] = true; carga--; gotas(); posM(); toca('ok');
        g.querySelector('.m-ok').style.opacity = 1; c.brilhos(MX(a.lon), MY(a.lat), 8, '#FFE27A');
        if (a.id === 'campo') { g.querySelector('.m-verde').style.opacity = 1; }
        if (a.id === 'usina') { g.querySelector('.m-agua').setAttribute('transform', 'translate(0 -10)'); g.querySelector('.m-raio').setAttribute('opacity', 1); s.querySelectorAll('.m-janelas rect').forEach(r => r.setAttribute('fill', '#FFD84D')); }
        if (a.id === 'cidade') { g.querySelector('circle').setAttribute('fill', '#D4F2FF'); }
        api.diz(a.fala);
        const n = Object.keys(feitos).length;
        api.hud(`<span class="chip">Leve a chuva: ${n}/3</span>`);
        chovendo = false;
        if (n === 3) { fase = 'fim'; depois(2600, () => { api.diz('Tudo isso começou com as árvores da floresta. Cuidar da Amazônia é cuidar da chuva do Brasil inteiro!'); depois(2200, api.fim); }); }
      });
    }
    let arr = null;
    nuvem.addEventListener('pointerdown', e => { if (chovendo || fase !== 'mapa') return; const p = c.ponto(e); arr = { dx: nx - p.x, dy: ny - p.y }; s.setPointerCapture(e.pointerId); nuvem.style.cursor = 'grabbing'; });
    s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); mover(p.x + arr.dx, p.y + arr.dy); });
    s.addEventListener('pointerup', () => { arr = null; nuvem.style.cursor = 'grab'; });
    el(s, '#m-alvos').addEventListener('click', e => {
      const g = e.target.closest('.m-alvo'); if (!g || chovendo || arr || fase !== 'mapa') return;
      const a = ALVOS.find(a => a.id === g.dataset.a); if (feitos[a.id]) return;
      const x0 = nx, y0 = ny, x1 = MX(a.lon), y1 = MY(a.lat) - 40, t0 = performance.now();
      (function vai(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/1100), e2 = k*k*(3-2*k); mover(x0 + (x1-x0)*e2, y0 + (y1-y0)*e2); if (k < 1 && !chovendo) requestAnimationFrame(vai); })(t0);
    });
  }

  cenaFloresta();
  return () => { vivo = false; timers.forEach(clearTimeout); if (c) c.parar(); };
}
