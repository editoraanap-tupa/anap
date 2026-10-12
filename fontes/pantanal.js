/* ================= JOGO 4: Pantanal, cheia e seca ================= */
function jogoPantanal(palco, api){
  semente = 61;
  let vivo = true, fase = 'seca0', agua = 440, nPeixes = 0, nComida = 0, voando = false, capiAlto = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const NS = 'http://www.w3.org/2000/svg';
  const LAGOAS = [{ x:330, y:392, rx:62, ry:14 }, { x:530, y:404, rx:66, ry:15 }, { x:700, y:388, rx:52, ry:12 }];
  const tufo = (x, y, h, cor) => `<path d="M${x} ${y} q-3 -${(h*.5).toFixed(0)} -7 -${h.toFixed(0)} M${x} ${y} q0 -${(h*.6).toFixed(0)} 1 -${(h*1.15).toFixed(0)} M${x} ${y} q3 -${(h*.5).toFixed(0)} 8 -${(h*.95).toFixed(0)} M${x} ${y} q-1 -${(h*.4).toFixed(0)} -3 -${(h*.7).toFixed(0)}" stroke="${cor}"/>`;
  const capim = (n, y0, y1, h0, h1, cor) => Array.from({length:n}, () => tufo(R(6, 794).toFixed(0), R(y0, y1).toFixed(0), R(h0, h1), cor)).join('');
  const caranda = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="balanca" style="animation-delay:${d}s"><path d="M0 0 C-2 -30 2 -60 0 -88" stroke="#5E4A36" stroke-width="6" fill="none"/><path d="M0 0 C-2 -30 2 -60 0 -88" stroke="#A8957A" stroke-width="2.2" fill="none"/><path d="M-2 -20 h4 M-2 -40 h4 M-2 -60 h4" stroke="#5E4A36" stroke-width="1.4"/>${[-175,-150,-122,-95,-68,-40,-12,-200].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r)*34, ey = -88 + Math.sin(r)*24; return `<path d="M0 -88 Q${(Math.cos(r)*16).toFixed(1)} ${(-88 + Math.sin(r)*16 - 8).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#1E6B3A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 -88 Q${(Math.cos(r)*16).toFixed(1)} ${(-88 + Math.sin(r)*16 - 8).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#4FB46A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }).join('')}<circle cx="0" cy="-88" r="5" fill="#1E5E32"/></g></g>`;
  const aguape = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" class="pn-aguape"><ellipse cx="-8" cy="2" rx="9" ry="4" fill="#3FA864" stroke="#1E6B3A" stroke-width="1.4"/><ellipse cx="8" cy="3" rx="9" ry="4" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.4"/><ellipse cx="0" cy="-1" rx="8" ry="4" fill="#5FD483" stroke="#1E6B3A" stroke-width="1.4"/><g fill="#B57BFF" stroke="#6A3EAE" stroke-width="1"><circle cx="-3" cy="-9" r="3.4"/><circle cx="3" cy="-10" r="3.4"/><circle cx="0" cy="-14" r="3.4"/></g><circle cx="0" cy="-10" r="1.6" fill="#FFC83D"/></g>`;
  const peixe = cor => `<g class="pn-nada"><path d="M-14 0 C-8 -9 8 -9 15 0 C8 9 -8 9 -14 0Z" fill="${cor}" stroke="#7A3E10" stroke-width="1.4"/><path d="M-13 0 L-23 -8 L-21 8Z" fill="${cor}" stroke="#7A3E10" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 -7 C2 -12 6 -12 8 -7" fill="${cor}" stroke="#7A3E10" stroke-width="1.2"/><circle cx="8" cy="-1.5" r="2" fill="#12235A"/><circle cx="8.6" cy="-2.1" r=".7" fill="#fff"/><path d="M-3 -6 q4 6 0 12" stroke="#7A3E10" stroke-width="1" fill="none"/><path d="M-8 -3 q8 -4 16 0" stroke="#FFF1B8" stroke-width="1.4" fill="none" opacity=".7"/></g>`;
  const capi = (x, y, s, id) => `<g class="pn-capi" id="${id}" transform="translate(${x} ${y})"><g transform="scale(${s})"><svg x="-48" y="-68" width="96" height="68" viewBox="0 0 140 100"><use href="#f-capivara"/></svg></g></g>`;
  const ipe = `<g id="pn-ipe" class="toque"><path d="M470 300 C472 270 466 250 474 222 L484 222 C490 250 484 272 488 300Z" fill="#7A5A3E" stroke="#3E2A18" stroke-width="2"/><path d="M478 236 C464 222 452 218 440 214 M480 232 C494 218 506 214 520 212 M479 228 C478 214 480 206 484 196" stroke="#3E2A18" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <g class="balanca" style="animation-delay:-2s"><path d="${copa(444, 208, 34, 18, 11)}" fill="#E66AA8" stroke="#9E2E6A" stroke-width="2"/><path d="${copa(518, 204, 34, 18, 11)}" fill="#E66AA8" stroke="#9E2E6A" stroke-width="2"/><path d="${copa(482, 186, 40, 22, 12)}" fill="#F28DC0" stroke="#9E2E6A" stroke-width="2"/>
    <g fill="#FFC6E2">${Array.from({length:22}, () => `<circle cx="${R(420, 548).toFixed(0)}" cy="${R(172, 222).toFixed(0)}" r="${R(2, 3.4).toFixed(1)}"/>`).join('')}</g><path d="M462 172 q12 -8 26 -4" stroke="#FFE0F0" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <rect x="410" y="160" width="150" height="140" fill="transparent"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Pantanal com rio, lagoas, ipê-rosa, ninho de tuiuiú, capivaras, jacaré e onça">
    <defs>
      <linearGradient id="pnCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC6F4"/><stop offset=".55" stop-color="#CFE9F5"/><stop offset=".8" stop-color="#FFE3B8"/><stop offset="1" stop-color="#FFC98A"/></linearGradient>
      <linearGradient id="pnCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C3D66E"/><stop offset=".5" stop-color="#A3C25A"/><stop offset="1" stop-color="#85A848"/></linearGradient>
      <linearGradient id="pnAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FCDEB" stop-opacity=".82"/><stop offset="1" stop-color="#2F7FC0" stop-opacity=".95"/></linearGradient>
      <linearGradient id="pnRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CC0E8"/><stop offset="1" stop-color="#2A6EB0"/></linearGradient>
      <radialGradient id="pnVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#0A1A2E" stop-opacity="0"/><stop offset="1" stop-color="#0A1A2E" stop-opacity=".3"/></radialGradient>
      <filter id="pnGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#pnCeu)"/>
    <g id="pn-sol" class="toque"><circle cx="600" cy="86" r="66" fill="#FFE27A" opacity=".28"/><circle cx="600" cy="86" r="40" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M577 72 q10 -12 26 -12" stroke="#FFF1B8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="600" cy="86" r="66" fill="transparent"/></g>
    <g id="pn-nuvem" class="toque"><g class="deriva" style="animation-duration:9s"><use href="#nuvem" x="676" y="34" width="122" height="62" style="color:#6F7A98"/><use href="#nuvem" x="680" y="38" width="114" height="56" style="color:#B9C2D6"/><use href="#nuvem" x="700" y="56" width="84" height="40" style="color:#CCD3E3"/><path d="M712 66 q10 -7 22 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M712 102 l-4 10 M736 104 l-4 10 M760 102 l-4 10" stroke="#5AAEDD" stroke-width="3" stroke-linecap="round"/></g><rect x="670" y="26" width="130" height="92" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="230" y="44" width="130" height="62" style="color:#fff" opacity=".85"/><use href="#nuvem" x="40" y="80" width="80" height="38" style="color:#fff" opacity=".6"/></g>
    <g id="pn-aves" class="toque"><g id="pn-aves-in">${[[0,0],[26,10],[52,20],[-24,12],[-46,24]].map(([x, y], i) => `<use href="#garca" x="${330 + x}" y="${120 + y}" width="40" height="20" style="animation-delay:${-i*.1}s"/>`).join('')}</g><rect x="270" y="110" width="140" height="50" fill="transparent"/></g>
    <path d="${copa(130, 266, 170, 18, 26, .5)}" fill="#A6CBB0" stroke="#8DB89A" stroke-width="2"/>
    <path d="${copa(650, 262, 200, 20, 28, .5)}" fill="#A6CBB0" stroke="#8DB89A" stroke-width="2"/>
    <path d="${copa(150, 278, 190, 20, 26, .45)}" fill="#6FA97A" stroke="#4F8E5E" stroke-width="2"/>
    <path d="${copa(660, 276, 190, 22, 26, .45)}" fill="#6FA97A" stroke="#4F8E5E" stroke-width="2"/>
    ${textura(400, 278, 400, 12, 40, '#5A9466', 1.4)}
    ${caranda(250, 300, .8, -.4)}${caranda(286, 302, .66, -1.2)}${caranda(380, 300, .74, -2)}${caranda(600, 298, .82, -.8)}${caranda(632, 302, .6, -1.6)}
    <g class="toque" data-fig="onca" id="pn-onca"><svg x="690" y="222" width="96" height="68" viewBox="0 0 140 100"><use href="#f-onca"/></svg>${brilhoHotspot(772, 228)}</g>
    ${ipe}
    <path d="M0 290 Q200 280 400 292 T800 286 V500 H0Z" fill="url(#pnCampo)" stroke="#7A9A3E" stroke-width="2"/>
    <path d="M0 304 C40 282 140 278 210 296 C240 304 250 316 250 330 L0 330Z" fill="#B3CC64" stroke="#7A9A3E" stroke-width="2"/>
    ${textura(400, 350, 400, 46, 70, '#86A848', 1.4)}
    <g>${Array.from({length:30}, () => { const x = R(10, 790), y = R(300, 430), c = ['#FFE27A','#fff','#FFB3D9'][Math.floor(rnd()*3)]; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.2" fill="${c}" stroke="#7A9A3E" stroke-width=".8"/>`; }).join('')}</g>
    <g id="pn-lagoas">${LAGOAS.map((l, i) => `<g class="toque pn-lagoa" data-l="${i}"><ellipse cx="${l.x}" cy="${l.y + 2}" rx="${l.rx + 10}" ry="${l.ry + 6}" fill="#8A6A3A" stroke="#5E4422" stroke-width="2"/><ellipse cx="${l.x}" cy="${l.y}" rx="${l.rx}" ry="${l.ry}" fill="#5AAEDD" stroke="#2F7FC0" stroke-width="2"/><path d="M${l.x - l.rx*.5} ${l.y - 3} q8 -3 16 0 M${l.x + l.rx*.2} ${l.y + 4} q6 -2 12 0" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${l.x + l.rx*.55}" cy="${l.y + 2}" rx="8" ry="3" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.2"/><g stroke="#3E7A2A" stroke-width="2.2" fill="none" stroke-linecap="round">${tufo((l.x - l.rx - 4).toFixed(0), l.y + 4, 22, '#3E7A2A')}${tufo((l.x + l.rx + 2).toFixed(0), l.y + 2, 18, '#3E7A2A')}</g></g>`).join('')}</g>
    <path d="M0 448 C120 430 220 470 360 452 S620 430 800 452 V500 H0Z" fill="url(#pnRio)" stroke="#2A6E9E" stroke-width="2.5"/>
    <g stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75" class="brilha-agua"><path d="M60 468 q10 -4 20 0 M300 478 q12 -4 24 0 M520 462 q10 -4 20 0 M700 476 q12 -4 24 0"/></g>
    <g id="pn-arvore"><path d="M70 300 C74 260 72 230 78 200 L90 200 C94 230 92 260 96 300Z" fill="#8A6A4E" stroke="#4E3A26" stroke-width="2"/><path d="M80 216 V292 M86 226 q1 30 0 60" stroke="#6E5440" stroke-width="1.4" fill="none"/><path d="M84 214 C70 200 58 196 46 194 M84 210 C100 196 112 192 126 190" stroke="#4E3A26" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="balanca" style="animation-delay:-1s"><path d="${copa(50, 186, 42, 19, 11)}" fill="#2F7E46" stroke="#1E5E32" stroke-width="2"/><path d="${copa(122, 180, 44, 19, 11)}" fill="#3F8E52" stroke="#1E5E32" stroke-width="2"/>${textura(86, 182, 70, 12, 14, '#24683A', 1.4)}<path d="M30 174 q10 -6 22 -3 M108 168 q10 -6 22 -3" stroke="#A8E0B4" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
      <path d="M58 192 C70 186 110 186 124 192 C120 202 64 202 58 192Z" fill="#B88A50" stroke="#6E4A22" stroke-width="2"/><path d="M62 192 l8 -5 M74 190 l6 -6 M96 190 l-4 -6 M110 191 l-6 -6 M118 192 l6 -4 M66 197 l8 3 M100 198 l8 -2" stroke="#6E4A22" stroke-width="1.6"/>
      <g id="pn-filhotes" class="toque"><g transform="translate(80 180)"><circle r="8" fill="#F4F1EA" stroke="#4E5B7A" stroke-width="1.6"/><path class="pn-bico" d="M4 -2 L16 -6 L4 2Z" fill="#2B2B33"/><circle cx="2" cy="-2" r="1.4" fill="#12121A"/></g><g transform="translate(102 182)"><circle r="7" fill="#F4F1EA" stroke="#4E5B7A" stroke-width="1.6"/><path class="pn-bico" d="M4 -2 L14 -5 L4 2Z" fill="#2B2B33"/><circle cx="2" cy="-2" r="1.3" fill="#12121A"/></g><rect x="66" y="168" width="50" height="24" fill="transparent"/></g>
    </g>
    <g id="pn-tuiuiu" class="toque" data-fig="tuiuiu" transform="translate(116 118)"><g id="pn-tui-pouso"><svg x="0" y="0" width="56" height="74" viewBox="0 0 100 130"><use href="#f-tuiuiu"/></svg></g><g id="pn-tui-voo" style="display:none"><svg x="-30" y="10" width="120" height="60" viewBox="0 0 160 80"><use href="#tuiuiu-voa"/></svg></g></g>
    <rect id="pn-agua" x="0" y="440" width="800" height="80" fill="url(#pnAgua)"/>
    <path id="pn-onda" d="M-40 440 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" opacity=".8"/>
    <g stroke-width="2.4" fill="none" stroke-linecap="round">${capim(40, 300, 440, 10, 20, '#5E8A2E')}${capim(20, 320, 440, 14, 26, '#4E7A26')}</g>
    <g id="pn-aguapes">${aguape(150, 462, 1)}${aguape(420, 470, .9)}${aguape(760, 466, 1.1)}</g>
    <g class="toque" data-fig="jacare" id="pn-jacare"><g id="pn-jac-in"><svg x="552" y="440" width="140" height="38" viewBox="0 6 150 40.7" preserveAspectRatio="xMidYMax slice"><use class="sem" href="#f-jacare"/></svg><path d="M552 477 q20 -5 40 0 t40 0 t40 0 t20 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/></g>${brilhoHotspot(654, 444)}</g>
    <g id="pn-capis">${capi(160, 360, .9, 'pn-capi1')}${capi(212, 372, .55, 'pn-capi2')}${capi(244, 368, .5, 'pn-capi3')}</g>
    <g id="pn-peixes"></g>
    <g pointer-events="none"><g stroke-width="4" fill="none" stroke-linecap="round" class="balanca">${[[10,500,70],[24,500,90],[40,500,64],[760,500,80],[778,500,96],[792,500,70]].map(([x, y, h]) => `<path d="M${x} ${y} q-6 -${h/2} -${10 + (x % 7)} -${h}" stroke="#2E6B22"/><path d="M${x + 6} ${y} q4 -${h/2} ${8 + (x % 5)} -${h*.9}" stroke="#3E8A2E"/>`).join('')}</g></g>
    <rect width="800" height="500" fill="url(#pnVinheta)" pointer-events="none"/>
    <rect width="800" height="500" filter="url(#pnGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const aguaEl = el(s, '#pn-agua'), onda = el(s, '#pn-onda'), gp = el(s, '#pn-peixes');
  const posAgua = y => { agua = y; aguaEl.setAttribute('y', y.toFixed(1)); aguaEl.setAttribute('height', (520 - y).toFixed(1)); };
  function moverAgua(y1, ms, fim){ const y0 = agua, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); posAgua(y0 + (y1 - y0) * e); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  const PEIXES = [], CORES = ['#F2A33A', '#F7C531', '#E8743A', '#F2A33A', '#F7C531'];
  const posP = f => f.el.setAttribute('transform', `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${f.dir} 1)`);
  /* laço da vida: ondas, aguapés, jacaré e peixes nadando sozinhos */
  (function vida(t){
    if (!vivo) return;
    onda.setAttribute('transform', `translate(${((t/40) % 40).toFixed(1)} ${(agua - 440).toFixed(1)})`);
    const boia = Math.max(0, 440 - agua);
    el(s, '#pn-aguapes').setAttribute('transform', `translate(0 ${(-boia + Math.sin(t/700)*2).toFixed(1)})`);
    el(s, '#pn-jac-in').setAttribute('transform', `translate(0 ${(Math.sin(t/900)*2).toFixed(1)})`);
    PEIXES.forEach(f => { if (!f.vaga || f.comido) return; f.ang += .02 + f.v * .01; const nx = f.cx + Math.cos(f.ang) * f.r, ny = f.cy + Math.sin(f.ang * 1.7) * 6; f.dir = nx >= f.x ? 1 : -1; f.x = nx; f.y = ny; posP(f); });
    requestAnimationFrame(vida);
  })(performance.now());
  function soltarPeixes(){
    gp.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'toque pn-peixe'); g.innerHTML = peixe(CORES[i]) + '<circle r="26" fill="transparent"/>';
      const f = { el:g, x: 90 + i * 150 + R(-20, 20), y: 470 + R(-6, 6), livre:true, dir:1, vaga:true, ang:R(0, 6), r:R(14, 24), v:R(0, 1) }; f.cx = f.x; f.cy = f.y; PEIXES.push(f); gp.appendChild(g); posP(f);
      g.addEventListener('click', ev => { ev.stopPropagation(); levarPeixe(f); });
    }
  }
  function nadar(f, x1, y1, ms, fim){ f.vaga = false; const x0 = f.x, y0 = f.y, t0 = performance.now(); f.dir = x1 >= x0 ? 1 : -1; (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); f.x = x0 + (x1-x0)*e; f.y = y0 + (y1-y0)*e + Math.sin(k*Math.PI*3)*4; posP(f); if (k < 1) requestAnimationFrame(q); else { f.cx = f.x; f.cy = f.y; f.ang = 0; f.r = R(10, 20); f.x = f.cx + f.r; f.vaga = true; fim && fim(); } })(t0); }
  function levarPeixe(f){
    if (fase !== 'peixes' || !f.livre) return; f.livre = false; toca('splash');
    nadar(f, R(270, 760), R(336, 410), 1400, () => { for (let i = 0; i < 6; i++) c.add({ tipo:'bolha', x:f.x + sorte(-8,8), y:f.y, vy:sorte(.8,1.6), r:sorte(2,4), topo:agua, f:sorte(0,6) }); toca('glub'); c.brilhos(f.x, f.y, 4, '#FFE27A'); });
    nPeixes++; api.hud(`<span class="chip">Peixes no campo alagado: ${nPeixes}/5</span>`);
    if (nPeixes === 1) api.diz('Isso! Na cheia, os peixes saem do rio e entram no campo alagado. Lá tem comida e lugar seguro para os filhotes.');
    if (nPeixes === 5) { fase = 'esperaSeca'; depois(1600, () => { api.diz('Todos os peixes acharam comida! Meses depois a chuva para. Toque no Sol para a seca chegar.'); pisca('#pn-sol'); }); }
  }
  function pisca(sel){ s.querySelectorAll('.pn-dica').forEach(e => e.remove()); const g = el(s, sel); const bb = g.getBBox(); g.insertAdjacentHTML('beforeend', `<circle class="pn-dica pino-pulso" cx="${(bb.x + bb.width/2).toFixed(0)}" cy="${(bb.y + bb.height/2).toFixed(0)}" r="${(Math.min(70, Math.max(bb.width, bb.height)/2)).toFixed(0)}" fill="none" stroke="#fff" stroke-width="4" pointer-events="none"/>`); }
  /* capivaras: andam e buscam o lugar alto na cheia */
  const CAPIS = [{ id:'pn-capi1', x:160, y:360 }, { id:'pn-capi2', x:212, y:372 }, { id:'pn-capi3', x:244, y:368 }];
  function andarCapis(alvos, ms){ CAPIS.forEach((cp, i) => { const g = el(s, '#' + cp.id), x0 = cp.x, y0 = cp.y, [x1, y1] = alvos[i], t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); cp.x = x0 + (x1-x0)*e; cp.y = y0 + (y1-y0)*e - Math.abs(Math.sin(k*Math.PI*8))*3; g.setAttribute('transform', `translate(${cp.x.toFixed(1)} ${cp.y.toFixed(1)}) scale(${x1 < x0 ? -1 : 1} 1)`); if (k < 1) requestAnimationFrame(q); else g.setAttribute('transform', `translate(${x1} ${y1})`); })(t0); }); }
  el(s, '#pn-capis').addEventListener('click', e => {
    e.stopPropagation(); api.figurinha('capivara'); toca('pop');
    if (fase === 'seca0' || fase === 'tuiuiu' || fase === 'fim') { const dx = R(-60, 60); andarCapis(CAPIS.map(cp => [Math.max(120, Math.min(420, cp.x + dx)), cp.y]), 1400); }
  });
  /* interações livres */
  el(s, '#pn-ipe').addEventListener('click', e => { e.stopPropagation(); toca('planta'); for (let i = 0; i < 26; i++) c.add({ tipo:'petala', x:sorte(424, 546), y:sorte(170, 220), vy:sorte(.6, 1.3), f:sorte(0, 6), chao:sorte(300, 430), cor: Math.random() < .5 ? '#F28DC0' : '#FFC6E2' }); api.diz('É a piúva, um ipê-rosa! Quando ela floresce, o Pantanal fica todo enfeitado.'); });
  el(s, '#pn-aves').addEventListener('click', e => { e.stopPropagation(); const g = el(s, '#pn-aves-in'); if (g.dataset.voando) return; g.dataset.voando = 1; toca('pop'); g.animate([{ transform:'translate(0,0)' }, { transform:'translate(520px,-90px)' }, { transform:'translate(520px,-90px)', opacity:0 }, { transform:'translate(-420px,0)', opacity:0 }, { transform:'translate(0,0)', opacity:1 }], { duration:5200, easing:'ease-in-out' }).onfinish = () => delete g.dataset.voando; api.diz('Um bando de garças! Elas também pescam nas águas do Pantanal.'); });
  el(s, '#pn-jacare').addEventListener('click', () => { const g = el(s, '#pn-jac-in'); g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:500 }); toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:sorte(580, 670), y:agua + 30, t:i }); });
  el(s, '#pn-onca').addEventListener('click', () => { el(s, '#pn-onca').animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:450 }); });
  el(s, '#pn-filhotes').addEventListener('click', e => { e.stopPropagation(); piar(); });
  function piar(){ toca('clique'); s.querySelectorAll('.pn-bico').forEach(b => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = '0% 50%'; b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-25deg)' }, { transform:'rotate(0)' }], { duration:300, iterations:3 }); }); }
  /* cheia */
  el(s, '#pn-nuvem').addEventListener('click', () => {
    if (fase !== 'seca0') return; fase = 'enchendo'; s.querySelectorAll('.pn-dica').forEach(e => e.remove());
    toca('chuva'); c.chover(20, 780, 90, 440, 180, '#5AAEDD'); depois(2400, () => c.chover(20, 780, 90, 400, 120, '#5AAEDD'));
    api.diz('Começou a época das chuvas! A água dos rios sobe e cobre os campos. Olha as capivaras correndo para o lugar mais alto!');
    andarCapis([[150, 300], [198, 306], [240, 304]], 2200); capiAlto = true;
    depois(900, () => moverAgua(322, 3600, () => { fase = 'peixes'; soltarPeixes(); api.hud('<span class="chip">Peixes no campo alagado: 0/5</span>'); api.diz('Olha os peixes no rio! Toque em cada peixe para ele nadar até o campo alagado.'); }));
  });
  /* seca */
  el(s, '#pn-sol').addEventListener('click', () => {
    if (fase !== 'esperaSeca') return; fase = 'secando'; s.querySelectorAll('.pn-dica').forEach(e => e.remove()); toca('ok');
    api.diz('Chegou a seca. A água baixa devagar e fica só no rio e nas lagoas.');
    PEIXES.forEach((f, i) => { const l = LAGOAS[i % 3]; nadar(f, l.x + R(-l.rx*.5, l.rx*.5), l.y, 3200, () => { f.r = R(8, l.rx*.4); f.cy = l.y; }); });
    moverAgua(440, 3600, () => {
      andarCapis([[160, 360], [212, 372], [244, 368]], 2000);
      fase = 'tuiuiu'; api.hud('<span class="chip">Comida no ninho: 0/3</span>');
      api.diz('Os peixes ficaram nas lagoas. Os filhotes de tuiuiú estão com fome! Toque numa lagoa para o tuiuiú ir pescar.'); piar();
    });
  });
  const usadas = {};
  el(s, '#pn-lagoas').addEventListener('click', e => {
    const g = e.target.closest('.pn-lagoa'); if (!g || fase !== 'tuiuiu' || voando) return;
    const i = +g.dataset.l; if (usadas[i]) { api.diz('Já pescamos nesta lagoa. Escolha outra!'); return; }
    usadas[i] = true; voando = true; e.stopPropagation(); pescar(LAGOAS[i]);
  });
  function pescar(l){
    const tui = el(s, '#pn-tuiuiu'), pouso = el(s, '#pn-tui-pouso'), voo = el(s, '#pn-tui-voo');
    const x0 = 116, y0 = 118, x1 = l.x - 28, y1 = l.y - 66; toca('pop');
    const voar = (xa, ya, xb, yb, ms, fim) => { pouso.style.display = 'none'; voo.style.display = ''; const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); const x = xa + (xb-xa)*e, y = ya + (yb-ya)*e - Math.sin(k*Math.PI)*80; tui.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${xb < xa ? ' translate(56 0) scale(-1 1)' : ''}`); if (k < 1) requestAnimationFrame(q); else { pouso.style.display = ''; voo.style.display = 'none'; tui.setAttribute('transform', `translate(${xb} ${yb})`); fim && fim(); } })(t0); };
    voar(x0, y0, x1, y1, 1500, () => {
      toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:l.x + sorte(-10,10), y:l.y, t:i });
      const f = PEIXES.find(f => !f.comido && Math.hypot(f.x - l.x, f.y - l.y) < l.rx + 30); if (f) { f.comido = true; f.el.style.transition = 'opacity .4s'; f.el.style.opacity = 0; }
      depois(600, () => voar(x1, y1, x0, y0, 1500, () => {
        voando = false; nComida++; toca('ok'); c.brilhos(92, 176, 8, '#FFE27A'); piar();
        api.hud(`<span class="chip">Comida no ninho: ${nComida}/3</span>`);
        if (nComida < 3) api.diz(nComida === 1 ? 'Os filhotes comeram! O tuiuiú é a ave símbolo do Pantanal. Toque em outra lagoa.' : 'Mais uma! Falta só uma lagoa.');
        else { fase = 'fim'; api.diz('Os filhotes estão de barriga cheia! No Pantanal, a cheia e a seca se revezam todo ano, e a vida acompanha o ritmo da água.'); depois(3600, api.fim); }
      }));
    });
  }
  api.hud('<span class="chip">Época da seca</span>');
  api.diz('Oi, eu sou a Capi, uma capivara do Pantanal! Aqui a água tem ritmo: tem a época da cheia e a época da seca. Toque na nuvem de chuva para a cheia começar. Você também pode tocar nos bichos e nas árvores!');
  pisca('#pn-nuvem');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
