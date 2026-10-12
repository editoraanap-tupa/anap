/* ================= JOGO 8: Oceano, o grande reservatório ================= */
function jogoOceano(palco, api){
  semente = 57;
  let vivo = true, fase = 'lixo', coletados = 0, corais = 0, sois = 0, nuvemK = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const MAR = 150, CESTO = { x:362, y:122 };
  const VAGAS = [{ x:140, y:440 }, { x:262, y:432 }, { x:384, y:442 }, { x:506, y:434 }];
  const CORES = [['#FF7A5A', '#B83A20'], ['#FF9AC8', '#B8406E'], ['#FFB347', '#B8700E'], ['#B57BFF', '#6A3EAE']];
  const LIXO = [
    { id:'sacola', x:470, y:222, nome:'sacola' }, { id:'garrafa', x:548, y:170, nome:'garrafa' }, { id:'canudo', x:84, y:300, nome:'canudo' },
    { id:'lata', x:704, y:470, nome:'lata' }, { id:'rede', x:300, y:388, nome:'rede' }
  ];
  const ramo = (x, y, cor, esc, s) => { const d = `M${x} ${y} C${x} ${y - 20 * s} ${x - 10 * s} ${y - 30 * s} ${x - 14 * s} ${y - 48 * s} M${x} ${y - 14 * s} C${x + 8 * s} ${y - 26 * s} ${x + 14 * s} ${y - 34 * s} ${x + 16 * s} ${y - 52 * s} M${x - 6 * s} ${y - 28 * s} C${x - 2 * s} ${y - 38 * s} ${x} ${y - 46 * s} ${x + 2 * s} ${y - 58 * s}`; return `<path d="${d}" stroke="${esc}" stroke-width="${(9 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${(5.6 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><g fill="#FFF2E0" opacity=".85">${[[-14, -48], [16, -52], [2, -58]].map(([dx, dy]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(1.6 * s).toFixed(1)}"/>`).join('')}</g>`; };
  const cerebro = (x, y, r, cor, esc) => `<path d="M${x - r} ${y} C${x - r} ${y - r * 1.15} ${x + r} ${y - r * 1.15} ${x + r} ${y}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8"/><path d="M${x - r * .7} ${y - r * .2} q${r * .15} -${r * .4} ${r * .3} 0 t${r * .3} 0 t${r * .3} 0 t${r * .3} 0 M${x - r * .5} ${y - r * .55} q${r * .15} -${r * .3} ${r * .3} 0 t${r * .3} 0 t${r * .3} 0" stroke="${esc}" stroke-width="1.4" fill="none" opacity=".8"/><path d="M${x - r * .6} ${y - r * .7} q${r * .4} -${r * .3} ${r * .9} -${r * .2}" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>`;
  const leque = (x, y, h, cor, esc) => `<path d="M${x} ${y} C${x - h * .7} ${y - h * .3} ${x - h * .8} ${y - h} ${x - h * .2} ${y - h * 1.1} C${x + h * .2} ${y - h * 1.2} ${x + h * .8} ${y - h} ${x + h * .6} ${y - h * .3}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8" opacity=".95"/><g stroke="${esc}" stroke-width="1" opacity=".6" fill="none">${[-.5, -.25, 0, .25, .5].map(k => `<path d="M${x} ${y} Q${x + k * h * .9} ${y - h * .6} ${x + k * h * 1.1} ${y - h * 1.02}"/>`).join('')}<path d="M${x - h * .55} ${y - h * .6} Q${x} ${y - h * .72} ${x + h * .6} ${y - h * .55} M${x - h * .4} ${y - h * .3} Q${x} ${y - h * .4} ${x + h * .45} ${y - h * .28}"/></g>`;
  const anemona = (x, y, cor, esc) => `<g>${Array.from({ length:9 }, (_, i) => { const a = -Math.PI * .9 + i * Math.PI * .8 / 8 * 1.0; const ex = x + Math.cos(a) * 18, ey = y + Math.sin(a) * 20; return `<path d="M${x} ${y} Q${(x + ex) / 2 + 3} ${(y + ey) / 2 - 4} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${esc}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${(x + ex) / 2 + 3} ${(y + ey) / 2 - 4} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${cor}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`; }).join('')}<ellipse cx="${x}" cy="${y + 2}" rx="12" ry="6" fill="${esc}"/></g>`;
  const peixinho = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 0 C-4 -6 6 -6 10 0 C6 6 -4 6 -10 0Z M-10 0 L-16 -5 L-15 0 L-16 5Z" fill="${cor}" stroke="#0E3A6A" stroke-width="1"/><circle cx="5" cy="-1" r="1.3" fill="#0E1A2A"/></g>`;
  const kelp = (x, h, cor) => `<g class="balanca" style="animation-duration:${R(4, 6).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s"><path d="M${x} 500 C${x - 12} ${500 - h * .3} ${x + 12} ${500 - h * .6} ${x - 4} ${500 - h}" stroke="#2E6A2A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x} 500 C${x - 12} ${500 - h * .3} ${x + 12} ${500 - h * .6} ${x - 4} ${500 - h}" stroke="#5AA040" stroke-width="3" fill="none" stroke-linecap="round"/>${Array.from({ length:Math.floor(h / 26) }, (_, i) => { const yy = 500 - 20 - i * 26, lado = i % 2 ? 1 : -1; return `<path d="M${x} ${yy} q${lado * 16} -6 ${lado * 22} -18 q${-lado * 10} 4 ${-lado * 22} 12Z" fill="#6EB84E" stroke="#2E6A2A" stroke-width="1.2"/>`; }).join('')}</g>`;
  const gorgonia = (x, y, h, cor, esc) => { let d = ''; const galho = (x0, y0, a, L, n) => { const x1 = x0 + Math.sin(a) * L, y1 = y0 - Math.cos(a) * L; d += `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${(x0 + Math.sin(a) * L * .5 + 3).toFixed(1)} ${(y0 - Math.cos(a) * L * .5).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} `; if (n > 0) { galho(x1, y1, a - .38, L * .72, n - 1); galho(x1, y1, a + .34, L * .7, n - 1); } }; [-.7, -.25, .2, .62].forEach(a => galho(x, y, a, h * .34, 3)); return `<path d="${d}" stroke="${esc}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; };
  const esponja = (x, y, cor, esc) => [[-12, 30, 9], [2, 40, 10], [16, 26, 8]].map(([dx, h, r]) => `<path d="M${x + dx - r} ${y} V${y - h + 4} C${x + dx - r} ${y - h - 2} ${x + dx + r} ${y - h - 2} ${x + dx + r} ${y - h + 4} V${y}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8"/><ellipse cx="${x + dx}" cy="${y - h + 3}" rx="${r - 3}" ry="3" fill="${esc}"/><path d="M${x + dx - r + 3} ${y - h + 10} V${y - 4}" stroke="#fff" stroke-width="2" opacity=".4" stroke-linecap="round"/>`).join('');
  const gaivota = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-8 -10 -20 -12 -30 -6 C-20 -6 -10 -2 0 4 C10 -2 20 -6 30 -6 C20 -12 8 -10 0 0Z" fill="#F4F6FA" stroke="#5A6787" stroke-width="1.4" stroke-linejoin="round"/><path d="M-30 -6 l6 1 M30 -6 l-6 1" stroke="#3E4A6A" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="4" ry="6" fill="#fff" stroke="#5A6787" stroke-width="1.2"/><path d="M0 -3 l3 -1 l-3 -1Z" fill="#FFC83D"/></g>`;
  const desenhoLixo = {
    sacola:'<path d="M-18 -6 C-20 10 -14 22 0 24 C14 22 20 10 18 -6Z" fill="#F4F8FF" fill-opacity=".82" stroke="#8A9AB8" stroke-width="1.6"/><path d="M-12 -6 C-14 -18 -4 -20 -4 -8 M12 -6 C14 -18 4 -20 4 -8" stroke="#8A9AB8" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-10 4 q4 8 0 14 M6 2 q-3 10 2 16" stroke="#C9D4E6" stroke-width="1.4" fill="none"/>',
    garrafa:'<g transform="rotate(-24)"><path d="M-8 -20 h16 v6 C12 -10 14 -6 14 2 V22 C14 26 10 28 0 28 C-10 28 -14 26 -14 22 V2 C-14 -6 -12 -10 -8 -14Z" fill="#A8E6D8" fill-opacity=".8" stroke="#3E8A7A" stroke-width="1.8"/><rect x="-6" y="-28" width="12" height="9" rx="2" fill="#2E7FD6" stroke="#12458A" stroke-width="1.4"/><rect x="-14" y="4" width="28" height="10" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.2"/><path d="M-8 -6 V20" stroke="#E6FFF8" stroke-width="2.4" stroke-linecap="round" opacity=".8"/></g>',
    canudo:'<g transform="rotate(32)"><rect x="-4" y="-26" width="8" height="52" rx="3" fill="#fff" stroke="#B83A3A" stroke-width="1.4"/><path d="M-4 -18 l8 -6 M-4 -6 l8 -6 M-4 6 l8 -6 M-4 18 l8 -6" stroke="#E5392C" stroke-width="3"/><path d="M-4 -26 q4 -6 10 -4" stroke="#B83A3A" stroke-width="1.4" fill="none"/></g>',
    lata:'<g transform="rotate(-12)"><rect x="-22" y="-12" width="44" height="24" rx="5" fill="#C9CED8" stroke="#5A6070" stroke-width="1.8"/><rect x="-8" y="-12" width="16" height="24" fill="#E5392C"/><ellipse cx="22" cy="0" rx="4" ry="12" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.4"/><path d="M-18 -7 H16" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/></g>',
    rede:'<path d="M-30 -14 C-10 -22 14 -20 32 -10 C30 6 18 18 -2 20 C-20 18 -32 6 -30 -14Z" fill="#3E8A5A" fill-opacity=".18" stroke="#2E6A4A" stroke-width="1.6"/><g stroke="#3E9A6A" stroke-width="1.4" fill="none">' + [-22, -12, -2, 8, 18, 26].map(x => `<path d="M${x} -18 Q${x + 4} 0 ${x - 2} 18"/>`).join('') + [-12, -4, 4, 12].map(y => `<path d="M-30 ${y} Q0 ${y + 6} 32 ${y - 2}"/>`).join('') + '</g><circle cx="-24" cy="-14" r="4" fill="#FFC83D" stroke="#8A6A08" stroke-width="1.2"/><path d="M30 -10 q10 4 14 14" stroke="#2E6A4A" stroke-width="1.6" fill="none"/>'
  };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Oceano com tartaruga-marinha, baleia-jubarte, recife de coral, barco recolhendo lixo e uma ilha com rio">
    <defs>
      <linearGradient id="ocVela" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset=".6" stop-color="#F6EBD2"/><stop offset="1" stop-color="#E2D2B0"/></linearGradient>
      <linearGradient id="ocVela2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B0"/><stop offset="1" stop-color="#F2C46A"/></linearGradient>
      <linearGradient id="ocCesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AD05A"/><stop offset="1" stop-color="#3E9A32"/></linearGradient>
      <radialGradient id="ocPele" cx=".4" cy=".35"><stop offset="0" stop-color="#E2A878"/><stop offset="1" stop-color="#B07448"/></radialGradient>
      <linearGradient id="ocCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DB6F2"/><stop offset=".8" stop-color="#C8EAFB"/><stop offset="1" stop-color="#F2FAFF"/></linearGradient>
      <linearGradient id="ocMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CC0F2"/><stop offset=".35" stop-color="#2386D6"/><stop offset=".75" stop-color="#14549E"/><stop offset="1" stop-color="#0B2E6A"/></linearGradient>
      <linearGradient id="ocRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="ocAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2DDA0"/><stop offset="1" stop-color="#C9A86A"/></linearGradient>
      <linearGradient id="ocPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A88AB4"/><stop offset="1" stop-color="#5E4A72"/></linearGradient>
      <linearGradient id="ocIlha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CD06A"/><stop offset="1" stop-color="#4E9A3A"/></linearGradient>
      <linearGradient id="ocCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5603C"/><stop offset="1" stop-color="#A8341C"/></linearGradient>
      <radialGradient id="ocSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <linearGradient id="ocNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>
      <linearGradient id="ocPele" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB08A"/><stop offset="1" stop-color="#E5603C"/></linearGradient>
      <radialGradient id="ocVivaG" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#FFE6F4" stop-opacity=".95"/><stop offset="1" stop-color="#E88AC8" stop-opacity=".7"/></radialGradient>
      <clipPath id="ocSubClip"><rect x="0" y="${MAR - 6}" width="800" height="400"/></clipPath>
      <radialGradient id="ocVinheta" cx=".5" cy=".42" r=".78"><stop offset=".6" stop-color="#04163A" stop-opacity="0"/><stop offset="1" stop-color="#04163A" stop-opacity=".34"/></radialGradient>
      <pattern id="ocCaus" width="80" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 C10 5 20 25 30 12 C40 2 50 22 60 14 C68 8 74 18 80 15 M10 28 C18 22 26 30 34 26 M46 4 C54 0 62 8 70 4" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/></pattern>
      <filter id="ocGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${MAR}" fill="url(#ocCeu)"/>
    <g id="oc-sol" class="toque" style="transform-origin:90px 62px"><circle cx="90" cy="62" r="54" fill="#FFE27A" opacity=".28"/><circle cx="90" cy="62" r="40" fill="#FFE27A" opacity=".3"/><circle cx="90" cy="62" r="28" fill="url(#ocSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M76 52 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><g id="oc-sol-hint" style="display:none">${brilhoHotspot(118, 40)}</g><circle cx="90" cy="62" r="52" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="200" y="22" width="90" height="42" style="color:#fff" opacity=".9"/><use href="#nuvem" x="470" y="40" width="64" height="30" style="color:#fff" opacity=".75"/></g>
    <rect y="${MAR - 34}" width="800" height="34" fill="url(#ocNevoa)"/>
    <g id="oc-gaivotas" class="toque"><g class="deriva" style="animation-duration:18s"><g style="animation:flutua 2.6s ease-in-out infinite alternate">${gaivota(520, 70, .9)}${gaivota(566, 92, .7)}</g><rect x="480" y="50" width="120" height="60" fill="transparent"/></g></g>
    <g id="oc-ilha">
      <path d="M584 ${MAR} C600 128 630 110 668 104 C700 98 724 92 750 96 C772 98 790 94 800 92 V${MAR}Z" fill="url(#ocIlha)" stroke="#3E7A2A" stroke-width="2"/>
      <path d="M640 112 C670 102 700 98 740 98" stroke="#C8F0A0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M584 ${MAR} C600 138 620 132 650 134 C680 136 700 140 720 ${MAR}Z" fill="#F2DDA0" stroke="#C9A86A" stroke-width="1.6"/>
      <path id="oc-rio" d="M742 100 C728 110 712 114 698 124 C684 134 672 138 652 ${MAR - 1}" stroke="#9CCBEB" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path id="oc-rio-fluxo" d="M742 100 C728 110 712 114 698 124 C684 134 672 138 652 ${MAR - 1}" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 12" style="opacity:0"/>
      <g transform="translate(770 98)"><path d="M0 0 C-2 -16 2 -30 -4 -46" stroke="#8A6A3E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-4 -46 c-10 -6 -22 -4 -28 4 c10 -2 18 0 28 -4Z M-4 -46 c4 -12 16 -16 26 -12 c-10 2 -18 6 -26 12Z M-4 -46 c-14 -12 -6 -24 2 -26 c-2 8 -2 16 -2 26Z M-4 -46 c10 -2 22 6 24 14 c-8 -6 -16 -10 -24 -14Z" fill="#4EA83A" stroke="#2E6A22" stroke-width="1.4" stroke-linejoin="round"/><circle cx="-2" cy="-42" r="3" fill="#8A5A2A"/><circle cx="-7" cy="-41" r="3" fill="#8A5A2A"/></g>
      <g transform="translate(706 104) scale(.75)"><path d="M0 0 C-2 -16 2 -30 -4 -46" stroke="#8A6A3E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-4 -46 c-10 -6 -22 -4 -28 4 c10 -2 18 0 28 -4Z M-4 -46 c4 -12 16 -16 26 -12 c-10 2 -18 6 -26 12Z M-4 -46 c-14 -12 -6 -24 2 -26 c-2 8 -2 16 -2 26Z M-4 -46 c10 -2 22 6 24 14 c-8 -6 -16 -10 -24 -14Z" fill="#4EA83A" stroke="#2E6A22" stroke-width="1.4" stroke-linejoin="round"/><circle cx="-2" cy="-42" r="3" fill="#8A5A2A"/><circle cx="-7" cy="-41" r="3" fill="#8A5A2A"/></g>
      <g fill="#8A8698" stroke="#4E4A5A" stroke-width="1.6"><path d="M712 150 C714 138 730 136 736 150Z"/><path d="M728 150 C732 142 744 142 746 150Z"/><path d="M590 150 C594 140 606 140 610 150Z"/></g><path d="M584 149 C620 140 680 142 720 149" stroke="#fff" stroke-width="2.4" fill="none" stroke-dasharray="10 6" opacity=".9"/><g><circle cx="652" cy="110" r="3" fill="#FF8AB8"/><circle cx="668" cy="104" r="3" fill="#FFD447"/><circle cx="684" cy="102" r="3" fill="#FF8AB8"/><circle cx="700" cy="100" r="3" fill="#FFFFFF"/></g>
      <g fill="#3E8A3A">${[[660, 112], [690, 106], [720, 102]].map(([x, y]) => `<path d="${copa(x, y, 12, 8, 7)}" stroke="#2E6A22" stroke-width="1.2"/>`).join('')}</g>
    </g>
    <g id="oc-nuvem" style="opacity:0;transition:opacity 1s, transform 4s ease-in-out"><g id="oc-nuvem-in" style="transform-origin:330px 60px;transform:scale(.5);transition:transform 1s"><use href="#nuvem" x="252" y="22" width="156" height="78" style="color:#8A97B4"/><use href="#nuvem" x="258" y="24" width="146" height="72" style="color:#DDE4F0"/><use href="#nuvem" x="282" y="50" width="100" height="44" style="color:#B6C0D6"/><path d="M290 50 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
    <rect y="${MAR}" width="800" height="${500 - MAR}" fill="url(#ocMar)"/>
    <rect y="${MAR}" width="800" height="70" fill="url(#ocCaus)" opacity=".35"/>
    <g fill="#fff">${Array.from({ length:14 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .37 % 2.4).toFixed(2)}s" x="${(30 + (i * 53) % 150).toFixed(0)}" y="${(MAR + 4 + (i * 7) % 22).toFixed(0)}" width="${(10 + i % 3 * 6)}" height="2.4" rx="1.2"/>`).join('')}</g>
    <g id="oc-raios">${[[120, 70], [300, 50], [470, 80], [640, 60]].map(([x, w]) => `<path d="M${x} ${MAR} L${x + w} ${MAR} L${x + w * 2.2} 470 L${x - w * .6} 470Z" fill="url(#ocRaio)" opacity=".55"/>`).join('')}</g>
    <g opacity=".35" fill="#0B3A7A">${Array.from({ length:7 }, (_, i) => `<path d="${copa(60 + i * 120, 432, 70, 28, 9, .25)}"/>`).join('')}</g>
    <rect id="oc-agua" x="0" y="${MAR + 2}" width="800" height="${500 - MAR - 2}" fill="transparent"/>
    <g id="oc-vivas">${[[300, 262, 1], [520, 300, .8]].map(([x, y, k], i) => `<g class="oc-viva toque" data-i="${i}" transform="translate(${x} ${y}) scale(${k})"><g class="oc-viva-in"><g style="animation:flutua ${(3.4 + i).toFixed(1)}s ease-in-out infinite alternate"><path d="M-10 6 C-12 20 -6 30 -10 42 M-3 8 C-1 22 -5 34 -1 46 M4 8 C6 20 2 32 6 44 M11 6 C13 18 9 28 12 38" stroke="#E88AC8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/><path d="M-6 8 C-8 16 -2 22 -4 30 M6 8 C8 16 2 22 4 30" stroke="#FFB8E0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M-18 8 C-20 -12 -8 -20 0 -20 C8 -20 20 -12 18 8 C12 4 6 10 0 6 C-6 10 -12 4 -18 8Z" fill="url(#ocVivaG)" stroke="#B8508E" stroke-width="1.6"/><path d="M-10 -8 q4 -6 10 -6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="-5" cy="-3" r="1.6" fill="#8E2E6A"/><circle cx="5" cy="-3" r="1.6" fill="#8E2E6A"/></g></g><rect x="-24" y="-24" width="48" height="72" fill="transparent"/></g>`).join('')}</g>
    <g id="oc-jubarte" class="toque" data-fig="jubarte" clip-path="url(#ocSubClip)"><g id="oc-jub-pos"><g style="animation:flutua 7s ease-in-out infinite alternate"><svg x="560" y="248" width="214" height="126" viewBox="0 0 170 100"><use href="#f-jubarte"/></svg></g></g>${brilhoHotspot(740, 268)}</g>
    <path d="M0 458 C120 444 240 452 360 450 C480 444 600 456 800 444 V500 H0Z" fill="url(#ocAreia)" stroke="#B8965A" stroke-width="2"/>
    <path d="M0 458 C120 444 240 452 360 450 C480 444 600 456 800 444 V500 H0Z" fill="url(#ocCaus)" opacity=".28" id="oc-caus-areia"/>
    <g stroke="#D9BC78" stroke-width="1.6" fill="none" opacity=".8">${Array.from({ length:14 }, () => { const x = R(0, 780), y = R(466, 494); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -4 16 0 t16 0"/>`; }).join('')}</g>
    <g>${[[560, 486], [96, 488], [640, 478]].map(([x, y]) => `<path d="M${x} ${y - 9} L${x + 2.6} ${y - 3} L${x + 9} ${y - 3} L${x + 4} ${y + 1.5} L${x + 6} ${y + 8} L${x} ${y + 4} L${x - 6} ${y + 8} L${x - 4} ${y + 1.5} L${x - 9} ${y - 3} L${x - 2.6} ${y - 3}Z" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}<path d="M440 484 c0 -10 16 -10 16 0Z" fill="#FFE0C8" stroke="#B88A6A" stroke-width="1.2"/><path d="M444 484 l4 -7 l4 7" stroke="#B88A6A" stroke-width="1" fill="none"/></g>
    <g id="oc-recife">
      ${[60, 200, 322, 446, 566].map((x, i) => `<path d="${copa(x, 452 + (i % 2) * 4, 62, 22, 10, .22)}" fill="url(#ocPedra)" stroke="#3E2E52" stroke-width="2"/>`).join('')}
      <g fill="#C9A8D6" opacity=".55">${Array.from({ length:22 }, () => `<circle cx="${R(10, 620).toFixed(0)}" cy="${R(440, 462).toFixed(0)}" r="${R(1.5, 3).toFixed(1)}"/>`).join('')}</g>
      ${cerebro(322, 452, 22, '#9AD07A', '#3E7A2A')}${gorgonia(616, 452, 70, '#C08AFF', '#5E2E9A')}${esponja(540, 454, '#FFB347', '#A8620E')}${anemona(572, 452, '#FF9AC8', '#B8406E')}${anemona(26, 450, '#FFB347', '#B8700E')}
      ${ramo(206, 448, '#FF7A5A', '#B83A20', .7)}${ramo(456, 452, '#FFB347', '#B8700E', .6)}
    </g>
    <g id="oc-polvo" class="toque"><g id="oc-polvo-in" style="transition:transform .6s cubic-bezier(.3,1.5,.5,1)"><g class="oc-pele" style="transition:fill 1s,stroke 1s" fill="url(#ocPele)" stroke="#8E2E14" stroke-width="1.8"><path d="M424 448 C418 438 420 430 426 432 C428 438 430 444 434 448Z M462 448 C470 440 472 432 466 432 C462 438 458 444 454 448Z M436 450 C430 458 422 460 418 456 C424 454 430 450 432 446Z M450 450 C456 458 464 460 468 456 C462 454 456 450 454 446Z"/><path d="M426 446 C424 426 432 412 444 412 C456 412 464 426 462 446Z"/></g><circle cx="438" cy="432" r="4.4" fill="#fff" stroke="#3E1E0C" stroke-width="1"/><circle cx="452" cy="432" r="4.4" fill="#fff" stroke="#3E1E0C" stroke-width="1"/><circle cx="439" cy="433" r="2.2" fill="#12121A"/><circle cx="453" cy="433" r="2.2" fill="#12121A"/><path d="M432 420 q6 -5 12 -4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/><g class="oc-pele" style="transition:fill 1s" fill="#C84A2A" opacity=".5"><circle cx="436" cy="422" r="2"/><circle cx="452" cy="420" r="2.4"/><circle cx="444" cy="440" r="1.8"/></g></g><path d="${copa(444, 458, 34, 12, 9, .2)}" fill="url(#ocPedra)" stroke="#3E2E52" stroke-width="2"/><rect x="410" y="406" width="70" height="56" fill="transparent"/></g>
    <g id="oc-caranguejo" class="toque"><g id="oc-car-pos" transform="translate(640 482)"><g id="oc-car-in"><path d="M-12 2 l-8 6 M-10 4 l-6 8 M12 2 l8 6 M10 4 l6 8" stroke="#A8341C" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="14" ry="9" fill="#F0703C" stroke="#8E2E14" stroke-width="1.8"/><path d="M-12 -4 C-20 -10 -24 -16 -18 -20 C-14 -16 -12 -14 -10 -8 M12 -4 C20 -10 24 -16 18 -20 C14 -16 12 -14 10 -8" fill="#F0703C" stroke="#8E2E14" stroke-width="1.8"/><path d="M-4 -8 v-6 M4 -8 v-6" stroke="#8E2E14" stroke-width="1.6"/><circle cx="-4" cy="-15" r="2.4" fill="#fff" stroke="#12121A"/><circle cx="4" cy="-15" r="2.4" fill="#fff" stroke="#12121A"/><circle cx="-4" cy="-15" r="1" fill="#12121A"/><circle cx="4" cy="-15" r="1" fill="#12121A"/><path d="M-6 -2 q6 -4 12 0" stroke="#FFC0A0" stroke-width="2" fill="none" opacity=".7"/></g><rect x="-26" y="-26" width="52" height="40" fill="transparent"/></g></g>
    <g>${[690, 712, 736, 600, 520].map((x, i) => `<g class="balanca" style="animation-delay:${(-i * .7).toFixed(1)}s"><path d="M${x} 490 q-4 -14 -2 -26 M${x + 5} 490 q2 -16 6 -28 M${x + 10} 490 q4 -10 10 -18" stroke="#3E8A3A" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join('')}</g>
    <g class="toque" data-fig="coral"><svg x="18" y="362" width="96" height="96" viewBox="0 0 100 100"><use href="#f-coral"/></svg>${brilhoHotspot(96, 380)}</g>
    ${VAGAS.map((v, i) => `<g class="oc-vaga toque" data-i="${i}"><g class="oc-branco">${ramo(v.x, v.y, '#F2EFE8', '#B8B2A6', .62)}${cerebro(v.x + 20, v.y + 2, 10, '#F2EFE8', '#B8B2A6')}<g class="oc-hint" style="display:none">${brilhoHotspot(v.x + 16, v.y - 44)}</g></g><g class="oc-novo" style="transform-origin:${v.x}px ${v.y}px;transform:scale(0);transition:transform 1s cubic-bezier(.3,1.5,.5,1)">${ramo(v.x, v.y, CORES[i][0], CORES[i][1], .9)}${ramo(v.x - 18, v.y + 2, CORES[(i + 1) % 4][0], CORES[(i + 1) % 4][1], .55)}${cerebro(v.x + 22, v.y + 2, 12, CORES[(i + 2) % 4][0], CORES[(i + 2) % 4][1])}</g><rect x="${v.x - 34}" y="${v.y - 64}" width="70" height="72" fill="transparent"/></g>`).join('')}
    <g id="oc-peixes">${[[380, 318, 1], [300, 352, .8], [520, 360, .9], [190, 366, .7]].map(([x, y, s], i) => `<g class="oc-peixe" style="opacity:0;transition:opacity 1.2s"><g style="animation:flutua ${(3 + i * .6).toFixed(1)}s ease-in-out infinite alternate"><svg x="${x}" y="${y}" width="${(60 * s).toFixed(0)}" height="${(40 * s).toFixed(0)}" viewBox="0 0 120 80"${i === 0 ? ' class="toque" data-fig="budiao"' : ''}><use href="#f-budiao"/></svg></g></g>`).join('')}
      <g class="oc-peixe" style="opacity:0;transition:opacity 1.2s">${[[430, 400, '#FFD447'], [446, 392, '#FFD447'], [440, 408, '#FFD447'], [250, 404, '#FF8AB8'], [262, 396, '#FF8AB8']].map(([x, y, c]) => peixinho(x, y, .9, c)).join('')}</g></g>
    <g id="oc-tata" class="toque" data-fig="tartaruga" style="cursor:grab"><g id="oc-tata-pos"><g id="oc-tata-vira"><g style="animation:flutua 4s ease-in-out infinite alternate"><svg x="130" y="196" width="124" height="91" viewBox="0 0 150 110"><use href="#f-tartaruga"/></svg></g></g></g></g>
    <g id="oc-barco"><g style="animation:flutua 3.2s ease-in-out infinite alternate">
      <ellipse cx="380" cy="${MAR + 6}" rx="96" ry="7" fill="#0E4A8A" opacity=".35"/>
      <path d="M402 ${MAR - 22} V56" stroke="#5A3418" stroke-width="5" stroke-linecap="round"/><path d="M402 ${MAR - 22} V56" stroke="#A8743E" stroke-width="2" stroke-linecap="round"/>
      <path d="M402 60 L306 ${MAR - 30}" stroke="#8A7A6A" stroke-width="1.2"/><path d="M402 60 L462 ${MAR - 34}" stroke="#8A7A6A" stroke-width="1.2"/>
      <path d="M398 64 C378 84 356 104 316 ${MAR - 32} L396 ${MAR - 32}Z" fill="url(#ocVela2)" stroke="#9A8A6A" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M406 62 C432 78 448 100 454 ${MAR - 34} L406 ${MAR - 34}Z" fill="url(#ocVela)" stroke="#9A8A6A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M408 84 C424 92 436 104 442 116 M408 100 C420 106 430 114 436 ${MAR - 36}" stroke="#E2D6BC" stroke-width="1.4" fill="none"/>
      <path d="M408 64 C426 74 438 86 446 100" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M402 56 l20 7 l-20 7Z" fill="#3FA864" stroke="#1E6A3A" stroke-width="1.2" stroke-linejoin="round"/><path d="M406 60 q5 2 9 3" stroke="#B8F0C8" stroke-width="1.2" fill="none"/>
      <path d="M294 ${MAR - 30} C330 ${MAR - 22} 420 ${MAR - 22} 466 ${MAR - 34} C460 ${MAR - 6} 442 ${MAR + 10} 414 ${MAR + 10} H336 C312 ${MAR + 10} 298 ${MAR - 6} 294 ${MAR - 30}Z" fill="url(#ocCasco)" stroke="#5E1A0E" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M300 ${MAR - 14} C340 ${MAR - 8} 420 ${MAR - 8} 460 ${MAR - 18}" stroke="#FFF4E4" stroke-width="5" fill="none"/><path d="M300 ${MAR - 14} C340 ${MAR - 8} 420 ${MAR - 8} 460 ${MAR - 18}" stroke="#2E7BF6" stroke-width="1.6" fill="none" transform="translate(0 4)"/>
      <path d="M304 ${MAR - 2} C340 ${MAR + 4} 420 ${MAR + 4} 454 ${MAR - 4}" stroke="#8A2A18" stroke-width="1.2" fill="none" opacity=".6"/>
      <path d="M314 ${MAR + 6} C340 ${MAR + 10} 420 ${MAR + 10} 446 ${MAR + 2} C440 ${MAR + 8} 430 ${MAR + 10} 414 ${MAR + 10} H336 C326 ${MAR + 10} 318 ${MAR + 9} 314 ${MAR + 6}Z" fill="#2E3A5A" opacity=".85"/>
      <path d="M292 ${MAR - 31} C330 ${MAR - 23} 420 ${MAR - 23} 468 ${MAR - 35}" stroke="#7A4A22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M294 ${MAR - 32} C330 ${MAR - 24} 420 ${MAR - 24} 466 ${MAR - 36}" stroke="#D8A060" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M306 ${MAR - 24} C312 ${MAR - 20} 318 ${MAR - 18} 326 ${MAR - 17}" stroke="#FFB8A8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="440" cy="${MAR - 4}" r="4.6" fill="#BFE8FF" stroke="#5E1A0E" stroke-width="2"/><circle cx="439" cy="${MAR - 5.4}" r="1.4" fill="#fff"/>
      <g fill="none" stroke="#fff" stroke-linecap="round" opacity=".85"><path d="M286 ${MAR + 2} q8 -4 16 0 q8 4 16 0" stroke-width="2.4"/><path d="M450 ${MAR + 4} q8 -4 16 0 q6 3 12 0" stroke-width="2"/><path d="M336 ${MAR + 14} h70" stroke-width="1.6" opacity=".5"/></g>
      <g id="oc-crianca" class="toque">
        <path d="M424 ${MAR - 24} v-12 M433 ${MAR - 24} v-12" stroke="#1E2E5A" stroke-width="5.4" stroke-linecap="round"/><path d="M419 ${MAR - 23} h9 M429 ${MAR - 23} h9" stroke="#F4F4F4" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M418 ${MAR - 34} C418 ${MAR - 40} 439 ${MAR - 40} 439 ${MAR - 34} V${MAR - 30} H418Z" fill="#2E4A8A" stroke="#12235A" stroke-width="1.4"/>
        <path id="oc-braco" d="M437 ${MAR - 47} C443 ${MAR - 50} 447 ${MAR - 55} 449 ${MAR - 61}" stroke="#A86A3E" stroke-width="5" fill="none" stroke-linecap="round" style="transform-origin:437px ${MAR - 47}px"/><circle cx="449.5" cy="${MAR - 62}" r="3.2" fill="#C98A5A" stroke="#6E3E1A" stroke-width="1"/>
        <path d="M416 ${MAR - 50} C416 ${MAR - 56} 441 ${MAR - 56} 441 ${MAR - 50} L440 ${MAR - 34} H417Z" fill="#FF7A2E" stroke="#A8400E" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M424 ${MAR - 54} V${MAR - 36} M433 ${MAR - 54} V${MAR - 36}" stroke="#FFD25A" stroke-width="2.2"/><path d="M417 ${MAR - 42} H440" stroke="#12235A" stroke-width="1.6"/><path d="M420 ${MAR - 50} q4 -3 8 -2" stroke="#FFC2A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M418 ${MAR - 49} C412 ${MAR - 46} 410 ${MAR - 42} 410 ${MAR - 38}" stroke="#A86A3E" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="428" cy="${MAR - 63}" r="10" fill="url(#ocPele)" stroke="#6E3E1A" stroke-width="1.6"/>
        <path d="M418 ${MAR - 64} C418 ${MAR - 76} 438 ${MAR - 76} 438 ${MAR - 64}Z" fill="#2E7BF6" stroke="#12458A" stroke-width="1.6" stroke-linejoin="round"/><path d="M436 ${MAR - 65} h10 c1 0 1 2 0 2.4 h-10Z" fill="#1E5AC4" stroke="#12458A" stroke-width="1.2"/><path d="M422 ${MAR - 70} q4 -4 9 -3" stroke="#8AC0FF" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M418.4 ${MAR - 63} q-2 4 0 7 M420 ${MAR - 63.6} q-1 3 0 5" stroke="#3A1E0C" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="432" cy="${MAR - 62}" rx="1.6" ry="2" fill="#12121A"/><circle cx="432.5" cy="${MAR - 62.8}" r=".6" fill="#fff"/><ellipse cx="434.6" cy="${MAR - 58.4}" rx="2.2" ry="1.3" fill="#FF8A7A" opacity=".55"/>
        <path d="M428 ${MAR - 57.6} q3 2.4 6 0" stroke="#6E3E1A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <rect x="406" y="${MAR - 80}" width="48" height="60" fill="transparent"/></g>
      <g transform="translate(318 ${MAR - 14})"><circle r="9" fill="none" stroke="#fff" stroke-width="5.4"/><circle r="9" fill="none" stroke="#E5392C" stroke-width="5.4" stroke-dasharray="7 7.1"/><circle r="11.6" fill="none" stroke="#8A2A18" stroke-width=".8" opacity=".6"/><path d="M-6 -6 q3 -3 7 -3" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/></g>
      <g id="oc-cesto"><path d="M336 ${MAR - 48} H392 L387 ${MAR - 22} H341Z" fill="url(#ocCesto)" stroke="#1E5A1A" stroke-width="2.2" stroke-linejoin="round"/><path d="M339 ${MAR - 40} H389 M340 ${MAR - 31} H388" stroke="#1E5A1A" stroke-width="1.2" opacity=".6"/><g stroke="#1E5A1A" stroke-width="1.1" opacity=".55">${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${343 + k * 7} ${MAR - 48} L${345 + k * 6.4} ${MAR - 22}"/>`).join('')}</g><path d="M334 ${MAR - 49} H394" stroke="#2E7A22" stroke-width="4" stroke-linecap="round"/><path d="M338 ${MAR - 50} H390" stroke="#9AE07A" stroke-width="1.4" stroke-linecap="round"/><path d="M356 ${MAR - 34} l4 -5 l4 5 M372 ${MAR - 39} l5 2 l-2 5 M366 ${MAR - 28} l-6 0 l2 -4" stroke="#E8FFD8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g id="oc-cesto-dentro">${['#F4F8FF', '#A8E6D8', '#E5392C', '#C9CED8', '#3E9A6A'].map((c, i) => `<circle cx="${342 + i * 10}" cy="${MAR - 48}" r="6" fill="${c}" stroke="#4E5A6A" stroke-width="1" style="opacity:0;transition:opacity .4s"/>`).join('')}</g></g>
    </g></g>
    <path d="M0 ${MAR} ${Array.from({ length:40 }, (_, i) => `q10 -4 20 0`).join(' ')}" stroke="#E6F6FF" stroke-width="2.6" fill="none"/>
    <path d="M0 ${MAR + 6} ${Array.from({ length:27 }, () => `q15 4 30 0`).join(' ')}" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".6"/>
    <g id="oc-lixos">${LIXO.map((l, i) => `<g class="oc-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab"><g style="animation:flutua ${(2.6 + i * .4).toFixed(1)}s ease-in-out infinite alternate">${desenhoLixo[l.id]}</g><circle r="34" fill="transparent"/></g>`).join('')}</g>
    <g id="oc-mao"><path d="M530 164 C480 100 420 92 384 104" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M380 104 l12 -8 l2 12Z" fill="#fff"/></g>
    <g id="oc-vapor"></g>
    ${kelp(760, 170, '#5AA040')}${kelp(784, 120, '#5AA040')}${kelp(14, 140, '#5AA040')}
    <rect width="800" height="500" fill="url(#ocVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#ocGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#oc-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  s.querySelectorAll('#oc-raios path').forEach((r, i) => r.animate([{ opacity:.3 }, { opacity:.7 }, { opacity:.3 }], { duration:4000 + i * 900, iterations:Infinity }));
  const bolhas = (x, y, n, topo) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.8, 1.8), r:sorte(2, 5), topo:topo || MAR + 4, f:sorte(0, 6) }); };
  /* 1. lixo: arrastar o lixo para o cesto do barco */
  const lix = [...s.querySelectorAll('.oc-lixo')], pos = LIXO.map(l => ({ x:l.x, y:l.y, foi:false }));
  const poe = i => lix[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  lix.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'lixo' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(60, Math.min(480, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; lix[i].style.cursor = 'grab';
    if (!moveu || Math.hypot(pos[i].x - CESTO.x, pos[i].y - CESTO.y) < 95) coletar(i); else voltar(i);
  });
  function anima(i, x1, y1, ms, esc, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 40;
      lix[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${(1 + (esc - 1) * e).toFixed(2)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function voltar(i){ const l = LIXO[i]; anima(i, l.x, l.y, 700, 1); toca('glub'); api.diz('Leve até o cestinho verde do barco!'); }
  function coletar(i){
    pos[i].foi = true; if (pos[i].y > MAR) bolhas(pos[i].x, pos[i].y, 5);
    anima(i, CESTO.x, CESTO.y - 6, 900, .3, () => {
      lix[i].style.display = 'none'; coletados++; toca('pop'); c.brilhos(CESTO.x, CESTO.y - 20, 6, '#FFE27A');
      el(s, '#oc-cesto-dentro').children[coletados - 1].style.opacity = 1;
      api.hud(`<span class="chip">Lixo no barco: ${coletados}/5</span>`);
      const falas = { sacola:'Sacola no mar parece água-viva, e a tartaruga pode engolir por engano!', garrafa:'Uma garrafa de plástico demora centenas de anos para sumir do mar.', canudo:'Canudo de plástico machuca os bichos do mar. Melhor usar copo!', lata:'A lata pode ser reciclada e virar outra lata.', rede:'Uma rede de pesca perdida. Os bichos ficam presos nela. Ainda bem que você tirou!' };
      if (coletados < 5) api.diz(falas[LIXO[i].id]);
      else { toca('vitoria'); api.diz('Mar limpinho! Quase todo o lixo do mar vem da terra, levado pela chuva e pelos rios.'); depois(4800, comecaCorais); }
    });
  }
  /* 2. corais: plantar mudas onde o recife ficou branco */
  function comecaCorais(){
    fase = 'corais'; s.querySelectorAll('.oc-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Corais: 0/4</span>');
    api.diz('Este pedaço do recife ficou branquinho, sem cor. Toque nele para plantar mudas de coral!');
  }
  s.querySelectorAll('.oc-vaga').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'corais') { toca('clique'); api.diz('Este coral ficou branquinho. Quando a água do mar esquenta demais, o coral perde a cor e fica fraco.'); return; }
    if (g.dataset.feito) return; g.dataset.feito = 1;
    const v = VAGAS[+g.dataset.i]; corais++;
    el(g, '.oc-branco').style.transition = 'opacity .8s'; el(g, '.oc-branco').style.opacity = 0;
    el(g, '.oc-novo').style.transform = 'scale(1)'; toca('planta'); bolhas(v.x, v.y - 20, 6); c.brilhos(v.x, v.y - 30, 6, '#FFE27A');
    depois(700, () => { s.querySelectorAll('.oc-peixe')[corais - 1].style.opacity = 1; if (corais === 4) s.querySelectorAll('.oc-peixe')[4].style.opacity = 1; });
    api.hud(`<span class="chip">Corais: ${corais}/4</span>`);
    if (corais === 1) api.diz('O coral parece planta, mas é um bicho! E olha: um peixe veio morar aqui.');
    if (corais === 2) api.diz('O recife é a casa e o berçário de muitos peixes.');
    if (corais === 4) { toca('vitoria'); api.diz('O recife ficou colorido e cheio de vida de novo!'); depois(4200, comecaSol); }
  }));
  /* 3. sol: a água do mar evapora, o sal fica e cai chuva doce */
  function comecaSol(){
    fase = 'sol'; el(s, '#oc-sol-hint').style.display = ''; el(s, '#oc-nuvem').style.opacity = .35;
    api.hud('<span class="chip">Sol: 0/3</span>');
    api.diz('A água do mar é salgada, não dá para beber. Mas o sol tem um truque! Toque no sol três vezes.');
  }
  const salpica = () => { for (let i = 0; i < 10; i++) c.add({ tipo:'brilho', t:-i * 2, x:sorte(160, 560), y:MAR + sorte(-2, 6), cor:'#FFFFFF' }); };
  el(s, '#oc-sol').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'sol') { toca('ok'); c.brilhos(90, 62, 6, '#FFE27A'); api.diz('O sol esquenta o mar o dia todo. Quase toda a água do planeta está nos oceanos.'); return; }
    if (ocupado || sois >= 3) return; ocupado = true; sois++; toca('vapor'); el(s, '#oc-sol').animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration:600 });
    for (let i = 0; i < 18; i++) c.add({ tipo:'vapor', x0:sorte(170, 560), y0:MAR - 2, x1:330 + sorte(-50, 50), y1:66 + sorte(-12, 12), dur:sorte(70, 110), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
    salpica(); depois(400, salpica);
    depois(1800, () => {
      nuvemK = sois; el(s, '#oc-nuvem').style.opacity = .35 + .22 * sois; el(s, '#oc-nuvem-in').style.transform = `scale(${(.5 + sois * .17).toFixed(2)})`;
      api.hud(`<span class="chip">Sol: ${sois}/3</span>`); ocupado = false;
      if (sois === 1) api.diz('A água subiu como vapor, mas o sal ficou no mar! Viu os brilhinhos? É o sal.');
      if (sois === 2) api.diz('O vapor vai se juntando lá no alto e forma uma nuvem.');
      if (sois === 3) choveNaIlha();
    });
  });
  function choveNaIlha(){
    fase = 'chuva'; el(s, '#oc-sol-hint').style.display = 'none';
    api.diz('A nuvem está cheia! O vento leva ela para a ilha.');
    el(s, '#oc-nuvem').style.transform = 'translate(392px, -6px)';
    depois(4200, () => {
      toca('chuva'); c.chover(660, 790, 96, 112, 70, '#3D8BFF');
      const rio = el(s, '#oc-rio'); rio.style.transition = 'stroke-width 2s, stroke 2s'; rio.setAttribute('stroke', '#3D8BFF'); rio.setAttribute('stroke-width', '7');
      const fl = el(s, '#oc-rio-fluxo'); fl.style.opacity = 1; fl.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-36 }], { duration:900, iterations:Infinity });
      api.diz('Chuva de água doce! Ela enche o rio da ilha, e o rio volta para o mar. A água vive dando essa volta.');
      depois(5200, () => { fase = 'fim'; toca('vitoria'); api.diz('Quase toda a água do planeta está nos oceanos, e ela é salgada. O sol transforma um pouquinho dela em chuva doce. Por isso cuidar do mar é cuidar da nossa água!'); depois(6400, api.fim); });
    });
  }
  /* toques extras */
  /* Tata nada até onde a criança arrastar */
  const tata = { x:0, y:0, ax:0, ay:0, vira:1 }; let pegaTata = null;
  el(s, '#oc-tata').addEventListener('pointerdown', e => { if (arr) return; e.stopPropagation(); const p = c.ponto(e); pegaTata = { x0:p.x, y0:p.y, dx:p.x - tata.ax, dy:p.y - tata.ay, moveu:false }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!pegaTata) return; const p = c.ponto(e); if (Math.hypot(p.x - pegaTata.x0, p.y - pegaTata.y0) > 8) pegaTata.moveu = true; tata.ax = Math.max(-120, Math.min(470, p.x - pegaTata.dx)); tata.ay = Math.max(-30, Math.min(170, p.y - pegaTata.dy)); });
  s.addEventListener('pointerup', () => { if (!pegaTata) return; const m = pegaTata.moveu; pegaTata = null;
    if (m) { bolhas(192 + tata.ax, 230 + tata.ay, 4); return; }
    toca('glub'); bolhas(250 + tata.x, 220 + tata.y, 5); api.diz(fase === 'lixo' ? 'Sou a Tata! Me ajuda a tirar o lixo do mar? Arraste até o barco.' : 'As tartarugas-marinhas nadam milhares de quilômetros e voltam para a praia onde nasceram.'); });
  /* cardume: os peixinhos seguem o dedo na água */
  const cardume = Array.from({ length:16 }, (_, i) => ({ x:660 + sorte(-60, 60), y:222 + sorte(-24, 24), vx:sorte(-1, 1), vy:0, f:sorte(0, 6), cor:i % 5 === 0 ? '#FFD447' : '#8FD8FF' }));
  let alvo = null, soltou = 0, primeiroCardume = true;
  el(s, '#oc-agua').addEventListener('pointerdown', e => { const p = c.ponto(e); alvo = { x:p.x, y:p.y, segura:true }; s.setPointerCapture(e.pointerId);
    if (p.y < MAR + 30) { toca('splash'); for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:MAR + 2, t:i * 3, cor:'#E6F6FF' }); } else { toca('glub'); bolhas(p.x, p.y, 2); }
    if (primeiroCardume) { primeiroCardume = false; api.diz('Os peixinhos nadam juntos, em cardume. Eles vão atrás do seu dedo!'); } });
  s.addEventListener('pointermove', e => { if (alvo && alvo.segura) { const p = c.ponto(e); alvo.x = p.x; alvo.y = p.y; } });
  s.addEventListener('pointerup', () => { if (alvo && alvo.segura) { alvo.segura = false; soltou = performance.now(); } });
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (alvo && !alvo.segura && performance.now() - soltou > 2600) alvo = null;
    const ax = alvo ? alvo.x : 650 + Math.cos(t * .35) * 110, ay = alvo ? Math.max(MAR + 16, alvo.y) : 222 + Math.sin(t * .6) * 26;
    cardume.forEach((p, i) => {
      const ox = Math.cos(i * 2.4) * (14 + i % 4 * 7), oy = Math.sin(i * 2.4) * (8 + i % 4 * 4);
      p.vx += (ax + ox - p.x) * .003 + Math.sin(t * 3 + p.f) * .04; p.vy += (ay + oy - p.y) * .003;
      const sp = Math.hypot(p.vx, p.vy), max = alvo ? 3.4 : 1.3; if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.vx *= .975; p.vy *= .975; p.x += p.vx; p.y = Math.max(MAR + 12, Math.min(440, p.y + p.vy));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx || .01)); ctx.globalAlpha = .95;
      ctx.fillStyle = p.cor; ctx.strokeStyle = '#1B4E9A'; ctx.lineWidth = 1;
      const ab = Math.sin(t * 14 + p.f) * 2;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-12, -4 + ab); ctx.lineTo(-12, 4 + ab); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 3.6, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0E1A2A'; ctx.beginPath(); ctx.arc(4.6, -.6, 1.1, 0, 7); ctx.fill(); ctx.restore();
    });
    tata.x += (tata.ax - tata.x) * .05; tata.y += (tata.ay - tata.y) * .05;
    const vx = tata.ax - tata.x; if (Math.abs(vx) > 2) tata.vira = vx < 0 ? -1 : 1;
    el(s, '#oc-tata-pos').setAttribute('transform', `translate(${tata.x.toFixed(1)} ${tata.y.toFixed(1)})`);
    el(s, '#oc-tata-vira').setAttribute('transform', tata.vira < 0 ? 'translate(384 0) scale(-1 1)' : '');
  });
  /* jubarte sobe, solta o borrifo e canta */
  let jubOcupada = false;
  el(s, '#oc-jubarte').addEventListener('click', () => {
    [[220, 330], [330, 260], [180, 300], [260, 420]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .7, 'sine', .07, f2), i * 520));
    if (jubOcupada) return; jubOcupada = true;
    const jp = el(s, '#oc-jub-pos'), sobe = jp.animate([{ transform:'translate(0,0)' }, { transform:'translate(0,-136px)' }], { duration:1300, easing:'ease-out', fill:'forwards' });
    sobe.onfinish = () => { if (!vivo) return; toca('splash'); for (let i = 0; i < 22; i++) c.add({ tipo:'vapor', x0:724 + sorte(-4, 4), y0:MAR - 4, x1:724 + sorte(-26, 26), y1:MAR - sorte(50, 80), dur:sorte(30, 50), f:sorte(0, 6), r:sorte(2, 4.5), x:0, y:0 }); for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:700 + i * 16, y:MAR + 2, t:i * 2, cor:'#E6F6FF' });
      api.diz('A baleia precisa subir para respirar ar! Esse jato é o ar saindo do nariz dela, que fica no alto da cabeça.');
      depois(1800, () => { const desce = jp.animate([{ transform:'translate(0,-136px)' }, { transform:'translate(0,0)' }], { duration:1600, easing:'ease-in-out', fill:'forwards' }); desce.onfinish = () => { jubOcupada = false; }; }); };
  });
  /* polvo, caranguejo, águas-vivas, gaivotas e a criança do barco */
  let polvoOcupado = false;
  el(s, '#oc-polvo').addEventListener('click', e => { e.stopPropagation(); if (polvoOcupado) return; polvoOcupado = true; const pin = el(s, '#oc-polvo-in'), peles = s.querySelectorAll('.oc-pele');
    pin.style.transform = 'translateY(-14px)'; toca('pop');
    depois(500, () => { peles.forEach(p => { p.setAttribute('fill', '#8A6E9A'); p.setAttribute('stroke', '#4E3A62'); }); api.diz('O polvo mudou de cor para ficar igual à pedra! Ele se esconde assim.'); });
    depois(3200, () => { peles[0].setAttribute('fill', 'url(#ocPele)'); peles[0].setAttribute('stroke', '#8E2E14'); peles[1].setAttribute('fill', '#C84A2A'); pin.style.transform = ''; polvoOcupado = false; }); });
  let carX = 640, carOcupado = false;
  el(s, '#oc-caranguejo').addEventListener('click', e => { e.stopPropagation(); if (carOcupado) return; carOcupado = true; toca('clique');
    const x0 = carX, x1 = carX > 600 ? sorte(470, 540) : sorte(640, 700), t0 = performance.now(), cin = el(s, '#oc-car-in');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1400); carX = x0 + (x1 - x0) * k; el(s, '#oc-car-pos').setAttribute('transform', `translate(${carX.toFixed(1)} ${(482 - Math.abs(Math.sin(k * 18)) * 2).toFixed(1)})`); cin.setAttribute('transform', `rotate(${(Math.sin(k * 30) * 4).toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else carOcupado = false; })(t0);
    api.diz('O caranguejo anda de lado!'); });
  s.querySelectorAll('.oc-viva').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); toca('glub'); const vin = el(g, '.oc-viva-in');
    vin.animate([{ transform:'translateY(0) scale(1,1)' }, { transform:'translateY(-6px) scale(1.15,.8)' }, { transform:'translateY(-26px) scale(.9,1.12)' }, { transform:'translateY(-30px) scale(1.12,.86)' }, { transform:'translateY(-48px) scale(1,1)' }, { transform:'translateY(0) scale(1,1)' }], { duration:2600, easing:'ease-in-out' });
    api.diz('Uma água-viva! A tartaruga come água-viva, e por isso pode confundir com uma sacola de plástico.'); }));
  el(s, '#oc-gaivotas').addEventListener('click', e => { e.stopPropagation(); [1300, 1600, 1250].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .16, 'triangle', .05, f * .7), i * 180)); });
  el(s, '#oc-crianca').addEventListener('click', e => { e.stopPropagation(); el(s, '#oc-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 }); toca('pop'); api.diz(fase === 'lixo' ? 'Me passa o lixo que eu guardo no cesto!' : 'Obrigada pela ajuda! Lá na terra o lixo vai para a reciclagem.'); });
  const caus = el(s, '#oc-caus-areia'); caus.animate([{ opacity:.12 }, { opacity:.34 }, { opacity:.12 }], { duration:3800, iterations:Infinity });
  el(s, '#oc-barco').addEventListener('click', e => { if (fase === 'lixo') return; e.stopPropagation(); toca('pop'); api.diz('O lixo vai para a reciclagem na terra.'); });
  el(s, '#oc-ilha').addEventListener('click', e => { if (fase === 'chuva' || fase === 'fim') return; e.stopPropagation(); toca('clique'); api.diz('É uma ilha. O riozinho dela está fraquinho, esperando chuva.'); });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1400) { ultB = t; bolhas(sorte(40, 620), 450, 1); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Lixo no barco: 0/5</span>');
  api.diz('Oi, eu sou a Tata, uma tartaruga-marinha! O mar está com lixo. Arraste cada lixo até o cestinho verde do barco.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
