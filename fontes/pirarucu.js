/* ================= JOGO 22: Lagos do pirarucu, manejo ribeirinho na várzea do Amazonas ================= */
function jogoPirarucu(palco, api){
  semente = 523;
  const AG0 = 300, NIV = { cheia:236, normal:300, seca:340 }, HZ = 214, NINHO = { x:424, y:462 };
  const SUPX = [372, 512], BOIAS = [{ x:366, y:229 }, { x:410, y:225 }, { x:454, y:229 }], BOIA0 = [{ x:384, y:AG0 - 4 }, { x:436, y:AG0 - 2 }, { x:488, y:AG0 - 4 }];
  const FRUTAS = [{ x:640, y:178 }, { x:690, y:186 }, { x:742, y:176 }];
  let AG = AG0, vivo = true, fase = 'contar', contados = 0, boias = 0, chuvas = 0, frutas = 0, sois = 0, ocupado = false, ninhoK = 0, filhotes = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const F = n => n.toFixed(1);
  /* ---------- desenhos ---------- */
  /* pirarucu de lado (cabeça para a direita), centro em 0,0, ~170 de comprimento */
  const escamas = () => { let s = ''; for (let x = -60; x <= 34; x += 8.5) [-9, -2, 5].forEach((y, r) => { const lim = x < -40 ? 8 : 13; if (Math.abs(y + 1) > lim) return; const cor = x < -34 ? '#FF6A48' : x < -12 ? '#E87A54' : x < 8 ? '#B8866A' : '#8C8E74'; s += `<path d="M${F(x + (r % 2) * 4.2)} ${y - 3.4} c3.2 1.2 3.6 5.6 0 7" stroke="${cor}" stroke-width="1.2" fill="none" opacity="${x < -12 ? .9 : .55}"/>`; }); return s; };
  const ESC = escamas();
  const pira = (macho) => `<g>
    <path d="M-22 -14 C-30 -30 -52 -28 -64 -8 L-50 -10Z" fill="url(#piBarb)" stroke="#5A1E14" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M-22 14 C-30 30 -52 28 -64 8 L-50 10Z" fill="url(#piBarb)" stroke="#5A1E14" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M-30 -22 C-40 -24 -50 -20 -58 -10 M-30 22 C-40 24 -50 20 -58 10" stroke="#FFB08A" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M-66 -6 C-78 -20 -94 -22 -100 -11 C-103 -3 -103 3 -100 11 C-94 22 -78 20 -66 6Z" fill="url(#piRabo)" stroke="#6A1A12" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M-72 -8 C-84 -16 -94 -14 -98 -6 M-72 8 C-84 16 -94 14 -98 6 M-74 0 H-98" stroke="#8A2416" stroke-width="1" fill="none" opacity=".7"/>
    <path d="M-80 -14 C-88 -16 -94 -14 -97 -9" stroke="#FFC0A0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M76 -1 C72 -9 62 -14 47 -16 C26 -19 2 -18 -24 -15 C-44 -13 -58 -9 -68 -5 L-68 5 C-58 9 -44 13 -24 15 C2 18 30 17 48 13 C61 10 70 6 76 2Z" fill="url(#piCorpo)" stroke="#2E3226" stroke-width="1.7"/>
    <path d="M76 -1 C72 -9 62 -14 47 -16 C26 -19 2 -18 -24 -15 C-44 -13 -58 -9 -68 -5 L-68 5 C-58 9 -44 13 -24 15 C2 18 30 17 48 13 C61 10 70 6 76 2Z" fill="url(#piSomb)"/>
    ${ESC}
    <path d="M60 -11 C34 -15 -6 -14 -52 -6" stroke="#E8F0D8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".42"/>
    <path d="M44 12 C20 15 -10 14 -40 10" stroke="#F4ECCC" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".5"/>
    <path class="pi-escura" d="M76 -1 C72 -9 62 -14 47 -16 C42 -16.6 38 -16.8 33 -16.6 C29 -6 29 6 34 15.6 C40 15 44 14 48 13 C61 10 70 6 76 2Z" fill="#1A201C" opacity="0" style="transition:opacity 1.6s"/>
    <path d="M41 -15 C34 -6 34 6 40 13.4" stroke="#2E3226" stroke-width="1.3" fill="none"/><path d="M43 -12 C38 -5 38 4 42 10" stroke="#C8D0B4" stroke-width=".9" fill="none" opacity=".55"/>
    <g stroke="#3E4434" stroke-width=".8" fill="none" opacity=".55"><path d="M50 -12 q4 1.6 8 0 M54 -8 q3 1.4 6 0 M47 -6 q3 1.4 6 0 M62 -9 q2 1.2 4 .4"/></g>
    <path d="M38 8 C30 14 22 18 15 16 C21 12 27 8 35 6Z" fill="url(#piBarb)" stroke="#5A2A1A" stroke-width="1"/>
    <path d="M76 -1 Q67 3 55 1.6" stroke="#2E1E14" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M74 2 Q68 5 60 4.4" stroke="#C8C0A0" stroke-width=".8" fill="none" opacity=".7"/>
    <circle cx="58" cy="-6.6" r="4.4" fill="#E8C24A" stroke="#3E3420" stroke-width="1"/><circle cx="58.4" cy="-6.6" r="2.8" fill="#14120E"/><circle cx="59.4" cy="-7.8" r="1.1" fill="#fff"/><circle cx="57.4" cy="-5.4" r=".45" fill="#fff"/>
    ${macho ? '' : ''}</g>`;
  /* peixe-boi-da-amazônia (Nonô), cabeça para a direita, origem no centro do corpo */
  const peixeboi = () => `<g>
    <path d="M-52 -2 C-68 -14 -86 -12 -90 0 C-86 12 -68 14 -52 4Z" fill="url(#piPbC)" stroke="#3A3A44" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M-60 -6 C-72 -10 -82 -8 -86 -2" stroke="#C8CCD8" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M-54 -4 C-50 -24 -16 -32 14 -28 C38 -25 56 -16 60 -2 C62 12 46 22 18 24 C-14 26 -46 18 -54 -4Z" fill="url(#piPbC)" stroke="#3A3A44" stroke-width="1.8"/>
    <path d="M-30 20 C-10 25 14 25 30 20 C22 26 -14 28 -30 20Z" fill="#E8E2EA" opacity=".8"/>
    <path d="M6 10 C14 6 24 8 26 16 C22 22 12 22 6 18Z" fill="url(#piPbM)" stroke="#9A7A8A" stroke-width=".9"/>
    <path d="M-36 -18 C-14 -28 20 -28 44 -18" stroke="#E6EAF2" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>
    <g fill="#5A5A66" opacity=".35"><circle cx="-20" cy="-8" r="1.2"/><circle cx="-6" cy="-14" r="1"/><circle cx="12" cy="-10" r="1.3"/><circle cx="-32" cy="2" r="1"/><circle cx="28" cy="-14" r=".9"/></g>
    <g class="pi-nadadeira" style="transform-origin:28px 12px"><path d="M28 12 C24 22 18 32 10 34 C6 34 6 30 10 26 C16 20 20 14 24 10Z" fill="url(#piPbN)" stroke="#3A3A44" stroke-width="1.3" stroke-linejoin="round"/><path d="M22 16 C18 22 14 28 10 31" stroke="#B8BCC8" stroke-width="1" fill="none" opacity=".7"/></g>
    <path d="M50 -14 C64 -16 76 -10 78 0 C80 10 72 16 60 16 C54 16 50 12 50 8Z" fill="url(#piPbF)" stroke="#3A3A44" stroke-width="1.6"/>
    <ellipse cx="72" cy="2" rx="7.4" ry="8.4" fill="url(#piPbF)" stroke="#3A3A44" stroke-width="1.4"/>
    <g fill="#3A3A44"><circle cx="70" cy="-3" r=".8"/><circle cx="74" cy="-1" r=".8"/><circle cx="72" cy="4" r=".8"/><circle cx="76" cy="3" r=".8"/><circle cx="68" cy="6" r=".8"/></g>
    <path d="M76 -6 l2.4 -1.2 M77 -4 l2.6 -.4" stroke="#2A2A30" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M66 10 C70 13 76 12 78 8" stroke="#5A3A44" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="55" cy="-5" rx="3" ry="3.4" fill="#1A1420"/><circle cx="56" cy="-6.2" r="1.2" fill="#fff"/><circle cx="54.4" cy="-3.8" r=".45" fill="#fff"/>
    <path d="M50.6 -10 q4 -2.6 8.4 -.4" stroke="#3A3A44" stroke-width="1" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="5" rx="4" ry="2.2" fill="#FF8AA8" opacity=".55"/>
    <path d="M54 -12 C60 -15 68 -14 72 -10" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
  /* tambaqui */
  const tambaqui = () => `<g><path d="M-26 -2 C-34 -12 -42 -14 -46 -8 C-44 -2 -44 2 -46 8 C-42 14 -34 12 -26 2Z" fill="#2A2E34" stroke="#121418" stroke-width="1.2"/>
    <path d="M-8 -20 C-14 -30 -24 -28 -28 -16Z M-6 20 C-12 28 -22 26 -26 14Z" fill="#2A2E34" stroke="#121418" stroke-width="1.1"/>
    <path d="M30 -2 C28 -16 12 -24 -6 -22 C-22 -20 -30 -10 -30 0 C-30 10 -22 20 -6 22 C12 24 28 14 30 2Z" fill="url(#piTbq)" stroke="#1E2228" stroke-width="1.6"/>
    <path d="M-28 4 C-20 18 4 22 22 12 C10 18 -14 18 -28 4Z" fill="#1E2228" opacity=".55"/>
    <path d="M18 -14 C8 -19 -8 -19 -20 -12" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>
    <path d="M14 -16 C9 -6 9 6 14 15" stroke="#3A3E44" stroke-width="1" fill="none"/>
    <path d="M30 0 Q26 4 22 3" stroke="#121418" stroke-width="1.2" fill="none"/>
    <circle cx="21" cy="-6" r="3" fill="#E8D24A" stroke="#3A3420" stroke-width=".8"/><circle cx="21.3" cy="-6" r="1.9" fill="#14120E"/><circle cx="22" cy="-6.8" r=".8" fill="#fff"/></g>`;
  /* rosto amigável */
  const rosto = (x, y, r, pg, esc, boca) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${F(r * 1.1)}" fill="url(#${pg})" stroke="${esc}" stroke-width="1.2"/>
    <path d="M${F(x - r * .72)} ${F(y - r * .46)} q${F(r * .26)} ${F(-r * .16)} ${F(r * .5)} -${F(r * .02)} M${F(x + r * .22)} ${F(y - r * .48)} q${F(r * .26)} ${F(-r * .14)} ${F(r * .5)} ${F(r * .04)}" stroke="#2A1A12" stroke-width=".95" fill="none" stroke-linecap="round"/>
    <ellipse cx="${F(x - r * .42)}" cy="${F(y - r * .06)}" rx="${F(r * .16)}" ry="${F(r * .2)}" fill="#1A0E0A"/><ellipse cx="${F(x + r * .44)}" cy="${F(y - r * .06)}" rx="${F(r * .16)}" ry="${F(r * .2)}" fill="#1A0E0A"/>
    <circle cx="${F(x - r * .37)}" cy="${F(y - r * .13)}" r="${F(r * .065)}" fill="#fff"/><circle cx="${F(x + r * .49)}" cy="${F(y - r * .13)}" r="${F(r * .065)}" fill="#fff"/>
    <path d="M${F(x + r * .02)} ${F(y + r * .1)} q${F(r * .1)} ${F(r * .2)} ${F(-r * .04)} ${F(r * .3)}" stroke="${esc}" stroke-width=".8" fill="none" stroke-linecap="round"/>
    ${boca === 'aberta' ? `<path d="M${F(x - r * .4)} ${F(y + r * .5)} C${F(x - r * .2)} ${F(y + r * .95)} ${F(x + r * .24)} ${F(y + r * .95)} ${F(x + r * .44)} ${F(y + r * .5)}Z" fill="#7A2A20" stroke="#5A1A10" stroke-width=".8"/><path d="M${F(x - r * .3)} ${F(y + r * .54)} H${F(x + r * .34)}" stroke="#fff" stroke-width="1" />` : `<path d="M${F(x - r * .38)} ${F(y + r * .48)} C${F(x - r * .2)} ${F(y + r * .76)} ${F(x + r * .24)} ${F(y + r * .76)} ${F(x + r * .42)} ${F(y + r * .48)}" fill="#fff" stroke="#6E2E14" stroke-width=".9" stroke-linecap="round"/>`}
    <ellipse cx="${F(x - r * .7)}" cy="${F(y + r * .3)}" rx="${F(r * .22)}" ry="${F(r * .13)}" fill="#E8705A" opacity=".5"/><ellipse cx="${F(x + r * .72)}" cy="${F(y + r * .3)}" rx="${F(r * .22)}" ry="${F(r * .13)}" fill="#E8705A" opacity=".5"/>`;
  const braco = (d, esc, cor, w) => `<path d="${d}" stroke="${esc}" stroke-width="${w + 2}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const mao = (x, y, pg, esc, r) => `<circle cx="${x}" cy="${y}" r="${r || 2.8}" fill="url(#${pg})" stroke="${esc}" stroke-width=".9"/>`;
  /* contadora sentada na canoa (quadril em 0,0) com prancheta */
  const contadora = () => `<g>
    <path d="M-13 0 C-14 -12 -12 -24 -8 -28 C-4 -31 4 -31 8 -28 C12 -24 14 -12 13 0Z" fill="url(#piCamCo)" stroke="#8A2E14" stroke-width="1.4"/>
    <path d="M-4 -30 C-2 -26 2 -26 4 -30" fill="none" stroke="#8A2E14" stroke-width="1"/>
    <g transform="translate(-4 -18) scale(.5)"><path d="M-10 0 C-6 -4 4 -4 8 0 C4 4 -6 4 -10 0Z M8 0 l5 -3.4 v6.8Z" fill="#FFF2E0" stroke="#FFF2E0" stroke-width="1"/></g>
    <path d="M-12 -4 C-6 -2 6 -2 12 -4" stroke="#8A2E14" stroke-width=".8" fill="none" opacity=".6"/>
    ${braco('M-9 -25 C-16 -18 -12 -10 -2 -12', '#8A2E14', '#F2784A', 4.6)}
    <g transform="translate(4 -16) rotate(-14)"><rect x="-9" y="-11" width="18" height="22" rx="1.6" fill="#9A6A3A" stroke="#4E3018" stroke-width="1"/><rect x="-7" y="-8" width="14" height="17" fill="#FFFDF4" stroke="#C8B89A" stroke-width=".5"/><rect x="-3.4" y="-12.6" width="6.8" height="3.2" rx=".8" fill="#C8CCD4" stroke="#5A5E66" stroke-width=".6"/>
      <g stroke="#2E5AA8" stroke-width=".9" stroke-linecap="round"><path d="M-5 -5.4 h9 M-5 -3 h6" opacity=".35"/></g>
      <g id="pi-tracos" stroke="#1E3A8A" stroke-width="1.2" stroke-linecap="round">${[0, 1, 2, 3].map(k => `<path class="pi-traco" d="M${F(-4.4 + k * 2.4)} 0 v6.4" style="opacity:0;transition:opacity .4s"/>`).join('')}<path class="pi-traco" d="M-5.6 5.6 L4.2 .6" style="opacity:0;transition:opacity .4s"/></g>
      <g transform="translate(-6 -2) scale(.28)"><path d="M-10 0 C-6 -4 4 -4 8 0 C4 4 -6 4 -10 0Z M8 0 l5 -3.4 v6.8Z" fill="#E0582E"/></g></g>
    ${mao(-2, -12, 'piPeleA', '#5E3418')}
    ${braco('M9 -25 C15 -18 14 -12 8 -8', '#8A2E14', '#F2784A', 4.6)}
    <path d="M8 -8 l5 -9" stroke="#FFC83D" stroke-width="1.6" stroke-linecap="round"/><path d="M12.2 -15.6 l.8 -1.4" stroke="#E86A8A" stroke-width="1.6" stroke-linecap="round"/>
    ${mao(8, -8, 'piPeleA', '#5E3418')}
    <path d="M-3 -30 v-3.4 h6 v3.4Z" fill="#A8704A"/>
    <path d="M-9 -38 C-12 -30 -12 -24 -14 -18 C-10 -20 -8 -24 -8 -30Z" fill="#1E1410"/>
    <path d="M-9 -40 C-10 -50 10 -50 9 -40 C9 -46 -9 -46 -9 -40Z" fill="#1E1410"/>
    ${rosto(0, -38.6, 8, 'piPeleA', '#5E3418')}
    <path d="M-9 -41 C-8 -50 8 -50 9.4 -41 C6 -46 -6 -46 -9 -41Z" fill="#1E1410"/>
    <path d="M-10 -43 C-9 -51 9 -51 10 -43 L15 -42 C15 -40 10 -40 8 -41 H-10Z" fill="#2E8A8A" stroke="#14504E" stroke-width="1"/><path d="M-5 -48 q4 -2 9 0" stroke="#8AE0D8" stroke-width="1" fill="none" stroke-linecap="round"/>
    <circle cx="-8.2" cy="-35" r="1.1" fill="#FFC83D" stroke="#A86A08" stroke-width=".4"/><circle cx="8.6" cy="-35" r="1.1" fill="#FFC83D" stroke="#A86A08" stroke-width=".4"/>
    <rect x="-20" y="-56" width="40" height="58" fill="transparent"/></g>`;
  /* contador em pé na popa, com colete salva-vidas, apontando para o lago (pés em 0,0) */
  const contador = () => `<g>
    <path d="M-5 0 v-15 M5 0 v-15" stroke="#5E3418" stroke-width="4.6" stroke-linecap="round"/><path d="M-8 0 h5 M3 0 h6" stroke="#2A2A32" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-9 -12 L-10 -22 H10 L9 -12 H2 L0 -18 L-2 -12Z" fill="#3A5A8A" stroke="#1E2E4A" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-11 -20 C-12 -34 -8 -42 0 -43 C8 -42 12 -34 11 -20Z" fill="#2E9A5A" stroke="#14502E" stroke-width="1.3"/>
    <path d="M-11 -22 C-12 -32 -10 -38 -4 -41 L-3 -22Z M11 -22 C12 -32 10 -38 4 -41 L3 -22Z" fill="url(#piColete)" stroke="#9A3A08" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-10 -28 h6 M4 -28 h6 M-10 -33 h6 M4 -33 h6" stroke="#2A2A32" stroke-width="1.2"/><path d="M-8 -37 l3 -2 M8 -37 l-3 -2" stroke="#FFE0A8" stroke-width="1" opacity=".8"/>
    <path d="M-10.4 -25 h5 M5 -25 h5" stroke="#E8ECF0" stroke-width="1.4"/>
    ${braco('M8 -38 C14 -32 16 -26 18 -20', '#14502E', '#2E9A5A', 4.4)}${mao(18.4, -19, 'piPeleB', '#3A1E0E', 2.9)}
    <g id="pi-braco-ct" style="transform-origin:-8px -38px">${braco('M-8 -38 C-16 -42 -22 -48 -28 -54', '#14502E', '#2E9A5A', 4.4)}${mao(-29, -55, 'piPeleB', '#3A1E0E', 2.9)}<path d="M-30 -58 l-3.4 -3" stroke="#3A1E0E" stroke-width="1.8" stroke-linecap="round"/></g>
    <path d="M-3 -43 v-3.6 h6 v3.6Z" fill="#7A4A2E"/>
    ${rosto(0, -52, 8.2, 'piPeleB', '#3A1E0E', 'aberta')}
    <path d="M-4.6 -46.6 q4.6 1.6 9.4 0" stroke="#2A1810" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M-8.4 -55 C-9 -64 9 -64 8.6 -55 C6 -58 -6 -58 -8.4 -55Z" fill="#1A1210"/>
    <path d="M-9 -57 C-9 -66 9 -66 9 -57 L-9 -57Z" fill="url(#piBone)" stroke="#7A1A10" stroke-width="1.1"/><path d="M-10 -57.4 h-7 C-17 -55 -12 -54.4 -9 -55Z" fill="#C8301E" stroke="#7A1A10" stroke-width="1"/><circle cx="0" cy="-65" r="1" fill="#7A1A10"/><path d="M-4 -62 q4 -2.4 8 -.6" stroke="#FF9A84" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <ellipse cx="-8.4" cy="-51.4" rx="1.4" ry="2.2" fill="#7A4A2E" stroke="#3A1E0E" stroke-width=".7"/><ellipse cx="8.6" cy="-51.4" rx="1.4" ry="2.2" fill="#7A4A2E" stroke="#3A1E0E" stroke-width=".7"/>
    <rect x="-34" y="-70" width="58" height="72" fill="transparent"/></g>`;
  /* avó na rede (centro do assento em 0,0) */
  const avo = () => `<g>
    <path d="M2 2 C10 4 18 8 22 14 M6 2 C14 6 20 10 24 16" stroke="#C88E64" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M20 14 l4 1.4 M22 16 l4 1.4" stroke="#7A3A5A" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-12 4 C-13 -10 -10 -22 0 -24 C10 -22 13 -10 12 4Z" fill="url(#piVest)" stroke="#5A2E7A" stroke-width="1.3"/>
    <g fill="#FFF0FA">${[[-6, -16], [5, -18], [-3, -6], [7, -6], [0, -12]].map(([x, y]) => `<g>${[0, 1, 2, 3, 4].map(k => `<circle cx="${F(x + Math.cos(k * 1.256) * 1.4)}" cy="${F(y + Math.sin(k * 1.256) * 1.4)}" r=".95"/>`).join('')}<circle cx="${x}" cy="${y}" r=".7" fill="#FFC83D"/></g>`).join('')}</g>
    <path d="M-5 -23 C-3 -19 3 -19 5 -23" stroke="#5A2E7A" stroke-width=".9" fill="none"/>
    ${braco('M-9 -19 C-12 -12 -8 -6 -1 -6', '#5A2E7A', '#B07ADA', 4.2)}${mao(-1, -6, 'piPeleC', '#6E3E20')}
    <g id="pi-braco-avo" style="transform-origin:9px -19px">${braco('M9 -19 C14 -24 16 -30 17 -36', '#5A2E7A', '#B07ADA', 4.2)}${mao(17, -37.6, 'piPeleC', '#6E3E20')}</g>
    <path d="M-2.6 -24 v-3 h5.2 v3Z" fill="#C88E64"/>
    ${rosto(0, -33, 7.6, 'piPeleC', '#6E3E20')}
    <path d="M-8 -36 C-9 -45 9 -45 8.2 -36 C6 -40 -6 -40 -8 -36Z" fill="#D8D8E0" stroke="#9A9AA8" stroke-width=".8"/>
    <circle cx="0" cy="-42.4" r="4.4" fill="#E2E2EA" stroke="#9A9AA8" stroke-width=".8"/><path d="M-2.4 -43.4 q2 -1.6 4.4 -.6" stroke="#fff" stroke-width=".9" fill="none"/>
    <g fill="none" stroke="#6E4A2A" stroke-width=".8"><circle cx="-3.2" cy="-33.4" r="2.4"/><circle cx="3.4" cy="-33.4" r="2.4"/><path d="M-.8 -33.6 h1.8"/></g>
    <rect x="-16" y="-48" width="42" height="64" fill="transparent"/></g>`;
  /* menina com uniforme da escola e mochila (pés em 0,0) */
  const menina = () => `<g>
    <path d="M-4 0 v-13 M4 0 v-13" stroke="#6E3E22" stroke-width="3.8" stroke-linecap="round"/>
    <path d="M-7 .4 h5 M2 .4 h6" stroke="#F4F4F8" stroke-width="3.2" stroke-linecap="round"/><path d="M-7 1.4 h5 M2 1.4 h6" stroke="#3E6AD0" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M-8 -11 L-9 -20 H9 L8 -11Z" fill="#1E3A7A" stroke="#0E1E4A" stroke-width="1"/>
    <path d="M14 -24 C17 -24 18 -14 15 -10 H9 V-26Z" fill="url(#piMoch)" stroke="#7A1410" stroke-width="1.1"/><path d="M11 -18 h5" stroke="#FFC83D" stroke-width="1.2"/>
    <path d="M-9 -18 C-10 -30 -7 -36 0 -37 C7 -36 10 -30 9 -18Z" fill="#FDFDFF" stroke="#7A8AB0" stroke-width="1.2"/>
    <path d="M-4 -36.4 L0 -32 L4 -36.4" fill="none" stroke="#2E5AC8" stroke-width="1.6"/><path d="M-9 -26 h18" stroke="#2E5AC8" stroke-width="1" opacity=".5"/>
    <circle cx="-4" cy="-28" r="1.6" fill="#2E5AC8"/><path d="M6 -36 l2 10" stroke="#B8241A" stroke-width="2"/>
    ${braco('M-7 -33 C-11 -28 -12 -22 -11 -17', '#7A8AB0', '#FDFDFF', 4)}${mao(-11, -16, 'piPeleD', '#4A2614', 2.6)}
    <g id="pi-braco-me" style="transform-origin:7px -33px">${braco('M7 -33 C11 -38 13 -44 13 -50', '#7A8AB0', '#FDFDFF', 4)}${mao(13, -51.4, 'piPeleD', '#4A2614', 2.6)}</g>
    <path d="M-2.4 -37 v-3 h4.8 v3Z" fill="#8E5A3A"/>
    <circle cx="-8" cy="-52" r="5" fill="#1E1410"/><circle cx="8" cy="-52" r="5" fill="#1E1410"/><circle cx="-8" cy="-52" r="2" fill="#2E2018"/><circle cx="8" cy="-52" r="2" fill="#2E2018"/>
    <path d="M-5 -51 l2 1.6 M5 -51 l-2 1.6" stroke="#FFC83D" stroke-width="1.8" stroke-linecap="round"/>
    ${rosto(0, -45.6, 7.2, 'piPeleD', '#4A2614', 'aberta')}
    <path d="M-7.2 -48 C-7 -55 7 -55 7.2 -48 C4 -51 -4 -51 -7.2 -48Z" fill="#1E1410"/>
    <rect x="-14" y="-60" width="32" height="62" fill="transparent"/></g>`;
  /* criança jogando bola (pés em 0,0) */
  const crianca = (pg, esc, camisa, cesc, short, cab) => `<g>
    <path d="M-4 0 l1 -12 M4 0 l2 -12" stroke="url(#${pg})" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M-8 -10 L-8 -18 H8 L8 -10Z" fill="${short}" stroke="#1A1A22" stroke-width=".9"/>
    <path d="M-8 -16 C-9 -27 -6 -32 0 -33 C6 -32 9 -27 8 -16Z" fill="${camisa}" stroke="${cesc}" stroke-width="1.1"/>
    ${braco('M-6 -29 C-11 -26 -13 -22 -14 -18', cesc, camisa, 3.6)}${braco('M6 -29 C11 -33 13 -37 14 -41', cesc, camisa, 3.6)}
    ${mao(-14, -17, pg, esc, 2.3)}${mao(14, -42, pg, esc, 2.3)}
    ${cab}
    ${rosto(0, -40, 6.6, pg, esc, 'aberta')}
    </g>`;
  const ariranha = () => `<g>
    <path d="M-6 6 C-16 6 -26 2 -32 -4 C-26 -2 -18 -2 -8 0Z" fill="url(#piAriC)" stroke="#2A1608" stroke-width="1.2"/>
    <path d="M-12 8 C-14 -8 -10 -24 0 -28 C10 -24 14 -8 12 8Z" fill="url(#piAriC)" stroke="#2A1608" stroke-width="1.5"/>
    <path d="M-5 -22 C-8 -14 -4 -6 2 -8 C8 -10 8 -18 4 -22 C2 -18 -2 -18 -5 -22Z" fill="url(#piAriG)" stroke="#B8A080" stroke-width=".7"/>
    <path d="M-10 2 C-12 6 -8 8 -6 6 M10 2 C12 6 8 8 6 6" stroke="#2A1608" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <ellipse cx="0" cy="-32" rx="10" ry="8.4" fill="url(#piAriC)" stroke="#2A1608" stroke-width="1.4"/>
    <circle cx="-8" cy="-38" r="2.4" fill="#5A3418" stroke="#2A1608" stroke-width="1"/><circle cx="8" cy="-38" r="2.4" fill="#5A3418" stroke="#2A1608" stroke-width="1"/>
    <ellipse cx="0" cy="-28" rx="5.4" ry="3.8" fill="#8A5A3A" stroke="#2A1608" stroke-width=".8"/><ellipse cx="0" cy="-30.4" rx="2" ry="1.4" fill="#1A0E08"/>
    <path d="M-2 -27 q2 1.6 4 0" stroke="#1A0E08" stroke-width=".8" fill="none"/>
    <g stroke="#F4ECDC" stroke-width=".6" opacity=".8"><path d="M-4 -28 l-8 -1 M-4 -27 l-8 1.4 M4 -28 l8 -1 M4 -27 l8 1.4"/></g>
    <circle cx="-4" cy="-35" r="1.7" fill="#14100C"/><circle cx="4" cy="-35" r="1.7" fill="#14100C"/><circle cx="-3.5" cy="-35.6" r=".6" fill="#fff"/><circle cx="4.5" cy="-35.6" r=".6" fill="#fff"/>
    <path d="M-6 -40 q6 -4 12 0" stroke="#C8946A" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-8 -14 C-8 -20 -6 -24 -3 -26" stroke="#C8946A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/></g>`;
  const uacari = () => `<g>
    <path d="M6 4 C10 14 8 22 4 28" stroke="#D8D0C0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 4 C10 14 8 22 4 28" stroke="#F8F4EC" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="${copa(0, -4, 13, 13, 12, .3)}" fill="url(#piUacC)" stroke="#A89A84" stroke-width="1.2"/>
    <path d="M-10 4 C-12 10 -8 12 -4 10 M10 4 C12 10 8 12 4 10" stroke="#A89A84" stroke-width="4.4" stroke-linecap="round" fill="none"/><path d="M-10 4 C-12 10 -8 12 -4 10 M10 4 C12 10 8 12 4 10" stroke="#F4EEE2" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <path d="M-8 -6 C-12 -2 -14 4 -12 8 M8 -6 C12 -2 14 4 12 8" stroke="#E8E0D0" stroke-width="1.2" fill="none" opacity=".8"/>
    <path d="${copa(0, -20, 10, 9, 10, .35)}" fill="url(#piUacC)" stroke="#A89A84" stroke-width="1.1"/>
    <ellipse cx="0" cy="-19" rx="6.6" ry="7.2" fill="url(#piUacR)" stroke="#8A1E1A" stroke-width="1.1"/>
    <circle cx="-6.6" cy="-20" r="2" fill="#E04A40" stroke="#8A1E1A" stroke-width=".7"/><circle cx="6.6" cy="-20" r="2" fill="#E04A40" stroke="#8A1E1A" stroke-width=".7"/>
    <circle cx="-2.6" cy="-21" r="1.6" fill="#E8A040"/><circle cx="2.6" cy="-21" r="1.6" fill="#E8A040"/><circle cx="-2.5" cy="-21" r=".9" fill="#14100C"/><circle cx="2.7" cy="-21" r=".9" fill="#14100C"/><circle cx="-2.2" cy="-21.4" r=".35" fill="#fff"/><circle cx="3" cy="-21.4" r=".35" fill="#fff"/>
    <path d="M-1 -17.6 h2" stroke="#8A1E1A" stroke-width=".8" stroke-linecap="round"/><path d="M-2.4 -15 q2.4 1.6 4.8 0" stroke="#8A1E1A" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <path d="M-4 -24.6 q4 -2 8 0" stroke="#FFB0A0" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
  const jacana = () => `<g>
    <path d="M-2 0 l-4 4 l-9 1 M-2 0 l-2 6 l-4 4 M2 0 l4 4 l9 0 M2 0 l1 7 l4 3" stroke="#7A8A2A" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M-2 -6 l0 6 M2 -6 l0 6" stroke="#7A8A2A" stroke-width="1.3"/>
    <path d="M-12 -12 C-10 -20 4 -22 10 -16 C12 -10 6 -6 -2 -6 C-8 -6 -12 -8 -12 -12Z" fill="url(#piJac)" stroke="#3A1A0A" stroke-width="1.1"/>
    <path d="M-8 -14 C-4 -18 2 -18 6 -16" stroke="#E8D24A" stroke-width="1.6" fill="none" opacity=".8"/>
    <path d="M6 -16 C8 -22 10 -26 12 -28" stroke="#14100C" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="13" cy="-29" r="3.6" fill="#14100C"/><path d="M15 -32 l3 -1 l0 3Z" fill="#E03A2A"/><path d="M16 -29 l5 1 l-5 1.4Z" fill="#F2D24A" stroke="#8A6A0A" stroke-width=".4"/>
    <circle cx="13.6" cy="-29.6" r=".8" fill="#fff"/></g>`;
  /* aguapé e canarana (prado flutuante) */
  const aguape = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${[[-8, -6, -20], [4, -9, 10], [-2, -12, -4], [10, -4, 30]].map(([dx, dy, a]) => `<g transform="translate(${dx} ${dy}) rotate(${a})"><path d="M0 8 C-3 4 -3 0 0 -1 C3 0 3 4 0 8Z" fill="#7AB84A" stroke="#2E5A1E" stroke-width=".8"/><path d="M0 -1 C-7 -2 -9 -10 -5 -14 C-2 -16 2 -16 5 -14 C9 -10 7 -2 0 -1Z" fill="url(#piAgp)" stroke="#1E5A2A" stroke-width="1"/><path d="M-3 -10 q2 -2 5 -1" stroke="#D8F4B0" stroke-width=".9" fill="none"/></g>`).join('')}</g>`;
  const florAguape = (x, y) => `<g><path d="M${x} ${y} V${y - 18}" stroke="#4E8A2E" stroke-width="1.6"/>${[0, 1, 2, 3, 4, 5].map(k => `<ellipse cx="${F(x + (k % 2 ? 3 : -3))}" cy="${F(y - 18 - k * 3.2)}" rx="3.6" ry="2.4" fill="${k % 3 === 1 ? '#C8A0F0' : '#9A6AD8'}" stroke="#5A2E9A" stroke-width=".6"/>`).join('')}<circle cx="${x - 3}" cy="${y - 21}" r=".9" fill="#FFE04A"/><circle cx="${x + 3}" cy="${y - 27}" r=".9" fill="#FFE04A"/></g>`;
  const canarana = (x, y, n) => Array.from({ length:n }, (_, i) => { const xx = x + i * 5 + R(-2, 2), h = R(16, 28), b = R(-8, 8); return `<path d="M${F(xx)} ${y} Q${F(xx + b * .3)} ${F(y - h * .6)} ${F(xx + b)} ${F(y - h)}" stroke="#2E5A1E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${F(xx)} ${y} Q${F(xx + b * .3)} ${F(y - h * .6)} ${F(xx + b)} ${F(y - h)}" stroke="${i % 2 ? '#8CC84A' : '#A8D45A'}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }).join('');
  /* árvore de várzea ao longe */
  const arvLonge = (x, y, r, c0, esc, luz) => `<path d="M${x} ${y} V${F(y - r * .8)}" stroke="#5A4A3A" stroke-width="${F(Math.max(1.4, r * .12))}"/><path d="${copa(x, y - r * 1.2, r, r * .72, 9, .3)}" fill="${c0}" stroke="${esc}" stroke-width="1"/><path d="${copa(x - r * .2, y - r * 1.34, r * .5, r * .36, 7, .3)}" fill="${luz}" opacity=".7"/>`;
  const acai = (x, y, h, cor, esc) => { const tx = x + R(-4, 4), ty = y - h; return `<path d="M${x} ${y} Q${F(x + (tx - x) * .4)} ${F(y - h * .5)} ${F(tx)} ${F(ty)}" stroke="#6A5E4A" stroke-width="1.6" fill="none"/>${[-150, -120, -90, -60, -30, -170, -10].map(a => { const r = a * Math.PI / 180, L = h * R(.26, .34); return `<path d="M${F(tx)} ${F(ty)} Q${F(tx + Math.cos(r) * L * .6)} ${F(ty + Math.sin(r) * L * .6 - 3)} ${F(tx + Math.cos(r) * L)} ${F(ty + Math.sin(r) * L + 4)}" stroke="${esc}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${F(tx)} ${F(ty)} Q${F(tx + Math.cos(r) * L * .6)} ${F(ty + Math.sin(r) * L * .6 - 3)} ${F(tx + Math.cos(r) * L)} ${F(ty + Math.sin(r) * L + 4)}" stroke="${cor}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="2 1"/>`; }).join('')}`; };
  const boia = () => `<g><path d="M0 -6 V-30" stroke="#5A3A22" stroke-width="2"/><path d="M0 -30 L16 -25 L0 -20Z" fill="#FFC83D" stroke="#A86A08" stroke-width="1"/><path d="M2 -27 l8 2" stroke="#fff" stroke-width="1" opacity=".7"/>
    <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#piBoia)" stroke="#7A1A10" stroke-width="1.4"/><path d="M-12 0 C-6 3 6 3 12 0" stroke="#fff" stroke-width="2.6" fill="none"/><path d="M-7 -4 q4 -2.4 8 -1.4" stroke="#FFC0B0" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  const fruta = (x, y) => `<g><path d="M${x} ${y - 14} q-2 7 0 9" stroke="#5A3A1E" stroke-width="1.4" fill="none"/><ellipse cx="${x}" cy="${y}" rx="5.4" ry="7.4" fill="url(#piFruta)" stroke="#7A1A10" stroke-width="1.2"/><path d="M${x - 2} ${y - 4} q1 -2 3 -2" stroke="#FFC8B0" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
  const NUV = [[40, 42, 36, 20], [72, 30, 32, 26], [100, 44, 27, 18], [66, 50, 52, 13]];
  const nuvElip = (f, st) => NUV.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${st || ''}/>`).join('');
  const nuvemD = (x, y, w) => `<g transform="translate(${x} ${y}) scale(${F(w / 130)})">${nuvElip('#C8D8EA', 'stroke="#B4C8DE" stroke-width="3"')}${nuvElip('url(#piNuv)')}<path d="M20 52 C44 61 98 61 118 52" stroke="#D0DCEA" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/><path d="M52 16 q14 -11 32 -5 M16 36 q8 -10 22 -10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  const arvFlor = (x, y, r, flor, fesc) => `<path d="M${x} ${y} V${y - r}" stroke="#5A4A3A" stroke-width="2.4"/><path d="M${x} ${y - r * .7} l${F(-r * .5)} ${F(-r * .4)} M${x} ${y - r * .8} l${F(r * .45)} ${F(-r * .35)}" stroke="#5A4A3A" stroke-width="1.4"/><path d="${copa(x, y - r * 1.3, r, r * .62, 10, .3)}" fill="#6E9A4A" stroke="#4A6A2E" stroke-width="1"/><g fill="${flor}" stroke="${fesc}" stroke-width=".5">${Array.from({ length:22 }, () => { const a = R(0, 6.28), d = Math.sqrt(R(0, 1)); return `<circle cx="${F(x + Math.cos(a) * r * .92 * d)}" cy="${F(y - r * 1.34 + Math.sin(a) * r * .55 * d)}" r="${F(R(1.6, 2.8))}"/>`; }).join('')}</g><path d="M${F(x - r * .6)} ${F(y - r * 1.6)} q${F(r * .4)} ${F(-r * .3)} ${F(r * .9)} ${F(-r * .2)}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5" stroke-linecap="round"/>`;
  const embauba = (x, y, h) => { const t = `M${x} ${y} C${x - 2} ${y - h * .4} ${x + 3} ${y - h * .7} ${x} ${y - h}`; const fol = (fx, fy, r) => `<g transform="translate(${F(fx)} ${F(fy)})">${[0, 1, 2, 3, 4, 5, 6].map(k => { const a = -Math.PI + k * Math.PI / 6; return `<path d="M0 0 Q${F(Math.cos(a - .2) * r * .7)} ${F(Math.sin(a - .2) * r * .5)} ${F(Math.cos(a) * r)} ${F(Math.sin(a) * r * .6 + 3)} Q${F(Math.cos(a + .2) * r * .7)} ${F(Math.sin(a + .2) * r * .5)} 0 0Z" fill="${k % 2 ? '#B8CCB4' : '#D8E4D4'}" stroke="#7A9478" stroke-width=".7"/>`; }).join('')}</g>`; return `<path d="${t}" stroke="#D8D8D0" stroke-width="3" fill="none"/><path d="${t}" stroke="#A8A89E" stroke-width="1" fill="none" stroke-dasharray="2 4"/><path d="M${x} ${y - h * .72} q-10 -4 -16 -12 M${x} ${y - h * .8} q10 -4 15 -12" stroke="#C8C8C0" stroke-width="1.8" fill="none"/>${fol(x - 16, y - h * .8 - 12, 13)}${fol(x + 15, y - h * .82 - 12, 12)}${fol(x, y - h - 2, 15)}`; };
  const aninga = (x, y, h, dx, a) => { const tx = x + dx, ty = y - h; return `<path d="M${x} ${y} Q${F(x + dx * .2)} ${F(y - h * .6)} ${F(tx)} ${F(ty)}" stroke="#2E5A1E" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${F(x + dx * .2)} ${F(y - h * .6)} ${F(tx)} ${F(ty)}" stroke="#6EAA3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><g transform="translate(${F(tx)} ${F(ty)}) rotate(${a})"><path d="M0 0 C-6 -6 -15 -9 -18 -4 C-15 7 -7 18 0 30 C7 18 15 7 18 -4 C15 -9 6 -6 0 0Z" fill="url(#piAninga)" stroke="#1E4A1E" stroke-width="1.2"/><path d="M0 0 V27 M0 8 l-9 -4 M0 8 l9 -4 M0 16 l-6 2 M0 16 l6 2" stroke="#A8D88A" stroke-width=".9" fill="none" opacity=".8"/><path d="M-12 -2 q2 8 8 16" stroke="#D8F4C0" stroke-width="1.2" fill="none" opacity=".6"/></g>`; };
  const trIg = (x, y0, w, lado) => { const top = 160; return `<path d="M${x - w * 1.6} ${y0} C${x - w * .8} ${y0 - 10} ${x - w * .6} ${y0 - 26} ${x - w * .5} ${y0 - 50} L${x - w * .5} ${top} H${x + w * .5} L${x + w * .5} ${y0 - 50} C${x + w * .6} ${y0 - 26} ${x + w * .9} ${y0 - 10} ${x + w * 1.7} ${y0}Z" fill="url(#piTrIg)" stroke="#2A2C20" stroke-width="1.4"/><path d="M${x - w * .2} ${y0 - 40} V${top}" stroke="#8A8A6E" stroke-width="1.6" opacity=".5"/><g stroke="#2E3024" stroke-width="1" fill="none" opacity=".55"><path d="M${x + w * .2} ${y0 - 70} q3 -10 0 -20 M${x - w * .1} ${y0 - 130} q-3 -8 0 -18 M${x + w * .25} ${y0 - 190} q3 -8 0 -16"/></g><path d="M${x} ${y0 - 120} C${x + lado * 20} ${y0 - 130} ${x + lado * 34} ${y0 - 150} ${x + lado * 40} ${y0 - 176}" stroke="#3E4032" stroke-width="${F(w * .3)}" fill="none" stroke-linecap="round"/><g fill="#5E7A3A" stroke="#2E4A1E" stroke-width=".6" opacity=".8">${[0, 1, 2, 3].map(k => `<ellipse cx="${F(x + lado * (24 + k * 5))}" cy="${F(y0 - 140 - k * 9)}" rx="4.4" ry="2" transform="rotate(${lado * 30} ${F(x + lado * (24 + k * 5))} ${F(y0 - 140 - k * 9)})"/>`).join('')}</g><path d="M${x + w * .5} ${y0 - 160} C${x + w * .5 + 8} ${y0 - 120} ${x + w * .5 - 4} ${y0 - 90} ${x + w * .5 + 6} ${y0 - 60}" stroke="#4E6A3A" stroke-width="1.6" fill="none"/>`; };
  /* ---------- casa flutuante (desenhada com a água em AG0) ---------- */
  const DK = AG0 - 14;
  const casa = `<g id="pi-casa">
    <g stroke="#3A2414" stroke-width="1.2">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(k => `<rect x="${k * 15.4}" y="${DK}" width="15.4" height="7" fill="${k % 2 ? '#9A6A42' : '#A8784C'}"/>`).join('')}</g>
    <path d="M0 ${DK + 1} H216" stroke="#D8B48A" stroke-width="1.4" opacity=".8"/>
    <path d="M6 ${DK} V${DK - 110} H132 V${DK}Z" fill="url(#piParede)" stroke="#145A58" stroke-width="1.6"/>
    <g stroke="#1E7A74" stroke-width="1" opacity=".55">${Array.from({ length:15 }, (_, k) => `<path d="M${14 + k * 8} ${DK - 108} V${DK - 2}"/>`).join('')}</g>
    <path d="M6 ${DK - 6} H132 M6 ${DK - 104} H132" stroke="#FFFFFF" stroke-width="3"/>
    <g transform="translate(36 ${DK - 92})"><rect width="30" height="30" fill="#2A3A4A" stroke="#FFFFFF" stroke-width="3"/><path d="M15 0 V30 M0 15 H30" stroke="#fff" stroke-width="1.6"/><rect x="2" y="2" width="12" height="12" fill="#FFE8A8" opacity=".55"/><path d="M-12 -2 V32 L0 30 V0Z M42 -2 V32 L30 30 V0Z" fill="#FFC83D" stroke="#A86A08" stroke-width="1"/><path d="M-9 4 v22 M-5 3 v24 M35 3 v24 M39 4 v22" stroke="#C88A1A" stroke-width=".8"/>
      <path d="M-4 34 H34" stroke="#7A4A2A" stroke-width="3"/><g>${[2, 10, 18, 26].map((x, i) => `<path d="M${x} 33 c-2 -6 2 -8 0 -12" stroke="#2E7A2E" stroke-width="1.4" fill="none"/><circle cx="${x}" cy="${21 - i % 2 * 2}" r="2.4" fill="${['#E8406A', '#FF8A3A', '#E8406A', '#FFC83D'][i]}" stroke="#7A1A3A" stroke-width=".5"/>`).join('')}</g></g>
    <g transform="translate(96 ${DK - 70})"><rect width="26" height="66" fill="#C8763A" stroke="#6E3A14" stroke-width="1.4"/><path d="M4 4 h18 v26 h-18Z M4 36 h18 v26 h-18Z" fill="none" stroke="#8A4A1E" stroke-width="1"/><circle cx="21" cy="36" r="1.6" fill="#FFC83D"/></g>
    <path d="M-6 ${DK - 104} L18 ${DK - 150} H120 L146 ${DK - 104}Z" fill="url(#piTelha)" stroke="#4A5A6E" stroke-width="1.6" stroke-linejoin="round"/>
    <g stroke="#E6EEF6" stroke-width="1.3" opacity=".7">${Array.from({ length:13 }, (_, k) => `<path d="M${F(-2 + k * 11.4)} ${DK - 105} L${F(20 + k * 7.8)} ${DK - 149}"/>`).join('')}</g>
    <g stroke="#6E7E92" stroke-width="1" opacity=".6">${Array.from({ length:13 }, (_, k) => `<path d="M${F(2 + k * 11.4)} ${DK - 105} L${F(23 + k * 7.8)} ${DK - 149}"/>`).join('')}</g>
    <path d="M-6 ${DK - 104} H146" stroke="#3A4A5E" stroke-width="3" stroke-linecap="round"/>
    <g id="pi-solar" class="toque"><path d="M62 ${DK - 112} L74 ${DK - 140} H112 L118 ${DK - 112}Z" fill="url(#piSolar)" stroke="#E6EEF6" stroke-width="1.6" stroke-linejoin="round"/><path d="M68 ${DK - 126} H115 M88 ${DK - 140} L84 ${DK - 112} M100 ${DK - 140} L100 ${DK - 112}" stroke="#7AA8E0" stroke-width=".8"/><path d="M76 ${DK - 136} L72 ${DK - 128}" stroke="#E6F2FF" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><rect x="60" y="${DK - 144}" width="62" height="36" fill="transparent"/></g>
    <g id="pi-antena"><path d="M28 ${DK - 140} V${DK - 168}" stroke="#5A5E66" stroke-width="2"/><g transform="translate(28 ${DK - 168}) rotate(-24)"><path d="M-12 0 A12 6 0 0 0 12 0Z" fill="#F4F6FA" stroke="#7A8090" stroke-width="1.2"/><path d="M0 1 l0 -8" stroke="#5A5E66" stroke-width="1.2"/><circle cx="0" cy="-8" r="1.4" fill="#5A5E66"/></g></g>
    <path d="M130 ${DK - 92} L218 ${DK - 80} V${DK - 74} L130 ${DK - 86}Z" fill="url(#piTelha)" stroke="#4A5A6E" stroke-width="1.3"/>
    <path d="M136 ${DK - 88} V${DK} M212 ${DK - 78} V${DK}" stroke="#5A3A22" stroke-width="4"/><path d="M136 ${DK - 88} V${DK} M212 ${DK - 78} V${DK}" stroke="#A8784C" stroke-width="1.6"/>
    <path d="M132 ${DK - 24} H216 M132 ${DK - 12} H216" stroke="#7A5232" stroke-width="2.4"/>${[150, 166, 182, 198].map(x => `<path d="M${x} ${DK - 24} V${DK}" stroke="#7A5232" stroke-width="1.8"/>`).join('')}
    <g id="pi-rede-g"><path d="M137 ${DK - 66} C150 ${DK - 30} 196 ${DK - 30} 211 ${DK - 64}" stroke="#7A3A1E" stroke-width="1" fill="none"/>
      <path d="M140 ${DK - 60} C152 ${DK - 26} 194 ${DK - 26} 208 ${DK - 58} C196 ${DK - 40} 152 ${DK - 40} 140 ${DK - 60}Z" fill="url(#piRede)" stroke="#8A2A4A" stroke-width="1.1"/>
      <g id="pi-avo" class="toque">${`<g transform="translate(172 ${DK - 42}) scale(1.16)">${avo()}</g>`}</g>
      <path d="M144 ${DK - 50} C156 ${DK - 22} 192 ${DK - 22} 204 ${DK - 48} C190 ${DK - 32} 158 ${DK - 32} 144 ${DK - 50}Z" fill="url(#piRede)" stroke="#8A2A4A" stroke-width="1.1"/>
      <path d="M150 ${DK - 40} C162 ${DK - 26} 186 ${DK - 26} 198 ${DK - 40}" stroke="#FFF2B0" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>
      <g stroke="#FFE27A" stroke-width="1">${[150, 158, 166, 174, 182, 190, 198].map((x, i) => `<path d="M${x} ${F(DK - 30 + Math.abs(i - 3) * -1.6)} v6"/>`).join('')}</g></g>
    <g id="pi-horta" class="toque"><path d="M12 ${DK} L16 ${DK - 26} M40 ${DK} L36 ${DK - 26}" stroke="#5A3A22" stroke-width="3"/><path d="M4 ${DK - 34} C10 ${DK - 22} 42 ${DK - 22} 50 ${DK - 34} Z" fill="url(#piCanoa)" stroke="#3A2414" stroke-width="1.3"/><path d="M6 ${DK - 32} C16 ${DK - 28} 38 ${DK - 28} 48 ${DK - 32}" stroke="#6E4A2A" stroke-width="2"/>
      <g id="pi-horta-pl">${[10, 16, 22, 28, 34, 40, 45].map((x, i) => i % 2 ? `<path d="M${x} ${DK - 32} q-2 -8 0 -14 M${x} ${DK - 32} q3 -6 5 -10" stroke="#3E8A2E" stroke-width="1.6" fill="none" stroke-linecap="round"/>` : `<path d="${copa(x, DK - 38, 4.4, 3.6, 7, .4)}" fill="#6EC04A" stroke="#2E6A1E" stroke-width=".8"/>`).join('')}</g><rect x="0" y="${DK - 54}" width="54" height="54" fill="transparent"/></g>
    <g id="pi-menina" class="toque"><g transform="translate(222 ${DK + 1}) scale(1.12)">${menina()}</g></g>
  </g>`;
  /* canoa dos contadores com motor rabeta */
  const canoa = `<g id="pi-canoa"><g id="pi-canoa-pos"><g mask="url(#piMascCasa)" opacity=".44" pointer-events="none"><use href="#pi-canoa-in" transform="translate(0 ${2 * AG0 - 6}) scale(1 -1)" filter="url(#piBlur)"/></g><g id="pi-canoa-in" style="animation:flutua 3.6s ease-in-out infinite alternate">
    <ellipse cx="640" cy="${AG0 + 6}" rx="118" ry="7" fill="#0E3A30" opacity=".3"/>
    <path d="M760 ${AG0 - 26} L802 ${AG0 + 26}" stroke="#2A2A32" stroke-width="3.4" stroke-linecap="round"/><path d="M760 ${AG0 - 26} L802 ${AG0 + 26}" stroke="#9AA2B0" stroke-width="1.4" stroke-linecap="round"/>
    <g transform="translate(800 ${AG0 + 24})"><g class="pi-helice"><path d="M0 0 l-2 -7 l4 0Z M0 0 l-2 7 l4 0Z" fill="#C8CCD4" stroke="#4A4E58" stroke-width=".8"/></g></g>
    <path d="M526 ${AG0 - 26} C540 ${AG0 - 16} 720 ${AG0 - 14} 752 ${AG0 - 22} C752 ${AG0 - 6} 744 ${AG0 + 6} 726 ${AG0 + 6} H572 C552 ${AG0 + 6} 534 ${AG0 - 6} 526 ${AG0 - 26}Z" fill="url(#piCanoaV)" stroke="#123A2A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M532 ${AG0 - 20} C556 ${AG0 - 12} 716 ${AG0 - 10} 750 ${AG0 - 17}" stroke="#F4F0E0" stroke-width="3" fill="none"/>
    <path d="M540 ${AG0 - 6} C590 ${AG0 - 1} 700 ${AG0 - 1} 746 ${AG0 - 7}" stroke="#C8301E" stroke-width="2.4" fill="none"/>
    <path d="M532 ${AG0 - 24} C546 ${AG0 - 18} 718 ${AG0 - 16} 750 ${AG0 - 23}" stroke="#8ED8B0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <g transform="translate(560 ${AG0 - 12}) scale(.5)"><path d="M-10 0 C-6 -4 4 -4 8 0 C4 4 -6 4 -10 0Z M8 0 l5 -3.4 v6.8Z" fill="#FFC83D"/></g>
    <path d="M598 ${AG0 - 17} h24" stroke="#5A3A22" stroke-width="4" stroke-linecap="round"/>
    <g transform="translate(610 ${AG0 - 16}) scale(1.42)">${contadora()}</g>
    <g transform="translate(744 ${AG0 - 30})"><rect x="-10" y="-14" width="20" height="16" rx="3" fill="url(#piMotor)" stroke="#1E1E28" stroke-width="1.3"/><rect x="-7" y="-20" width="12" height="7" rx="2" fill="#C8301E" stroke="#5A1A10" stroke-width="1"/><path d="M-6 -10 h10 M-6 -6 h10" stroke="#5A5E6A" stroke-width="1"/><path d="M-8 -12 q4 -2 8 -1" stroke="#fff" stroke-width="1" opacity=".6"/><path d="M-10 -6 L-30 -2" stroke="#2A2A32" stroke-width="2.6" stroke-linecap="round"/></g>
    <g id="pi-contador" class="toque"><g transform="translate(716 ${AG0 - 14}) scale(1.4)">${contador()}</g></g>
  </g></g></g>`;
  /* ---------- cena ---------- */
  const DEFS = `<defs>
      <linearGradient id="piCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58AEE6"/><stop offset=".6" stop-color="#B8DEF0"/><stop offset="1" stop-color="#FFE6C2"/></linearGradient>
      <linearGradient id="piMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC2B6"/><stop offset="1" stop-color="#B8D2C4"/></linearGradient>
      <linearGradient id="piLongeA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AA87E"/><stop offset="1" stop-color="#5E8E6A"/></linearGradient>
      <linearGradient id="piBarranco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8845A"/><stop offset="1" stop-color="#7A5A3A"/></linearGradient>
      <linearGradient id="piSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EC0B0"/><stop offset=".55" stop-color="#6EA89A"/><stop offset="1" stop-color="#4E8E80"/></linearGradient>
      <linearGradient id="piReflexo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E6E4A" stop-opacity=".7"/><stop offset="1" stop-color="#3E6E4A" stop-opacity="0"/></linearGradient>
      <linearGradient id="piAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CB898" stop-opacity=".5"/><stop offset=".25" stop-color="#5E906E" stop-opacity=".6"/><stop offset=".6" stop-color="#3E644A" stop-opacity=".72"/><stop offset="1" stop-color="#24382A" stop-opacity=".86"/></linearGradient>
      <linearGradient id="piTurvo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8A50" stop-opacity="0"/><stop offset=".5" stop-color="#8A7A44" stop-opacity=".12"/><stop offset="1" stop-color="#5A4A28" stop-opacity=".26"/></linearGradient>
      <linearGradient id="piProf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8FFF0" stop-opacity=".14"/><stop offset=".22" stop-color="#E8FFF0" stop-opacity="0"/><stop offset=".6" stop-color="#14281C" stop-opacity="0"/><stop offset="1" stop-color="#14281C" stop-opacity=".3"/></linearGradient>
      <linearGradient id="piTrIg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A6A52"/><stop offset=".5" stop-color="#4E5040"/><stop offset="1" stop-color="#36382C"/></linearGradient>
      <linearGradient id="piMascG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="piMascCasa" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="500"><rect x="-10" y="${AG0 + 6}" width="820" height="44" fill="url(#piMascG)"/></mask>
      <mask id="piMascFlo" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="500"><rect x="-10" y="${HZ}" width="820" height="52" fill="url(#piMascG)"/></mask>
      <clipPath id="piClipIg"><rect id="pi-clip-ig" x="0" y="${AG0}" width="800" height="200"/></clipPath>
      <filter id="piBlur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <linearGradient id="piRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBE0" stop-opacity=".46"/><stop offset="1" stop-color="#FFFBE0" stop-opacity="0"/></linearGradient>
      <linearGradient id="piBrilhoSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6FFF4" stop-opacity=".5"/><stop offset="1" stop-color="#E6FFF4" stop-opacity="0"/></linearGradient>
      <linearGradient id="piFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8925E"/><stop offset="1" stop-color="#5A4A30"/></linearGradient>
      <linearGradient id="piTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6440"/><stop offset=".5" stop-color="#6A4A2E"/><stop offset="1" stop-color="#4A321E"/></linearGradient>
      <linearGradient id="piPraia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8D2A0"/><stop offset="1" stop-color="#C8A870"/></linearGradient>
      <linearGradient id="piTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8A890"/><stop offset=".5" stop-color="#8A7A64"/><stop offset="1" stop-color="#5A4C3C"/></linearGradient>
      <linearGradient id="piTronco2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6A4E"/><stop offset=".5" stop-color="#6A4E36"/><stop offset="1" stop-color="#4A3424"/></linearGradient>
      <radialGradient id="piCopa1" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#7EC45A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <radialGradient id="piCopa2" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#A8D46A"/><stop offset="1" stop-color="#5E9A2E"/></radialGradient>
      <radialGradient id="piCopa3" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#5EB89A"/><stop offset="1" stop-color="#1E6A5A"/></radialGradient>
      <linearGradient id="piCorpo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D8462E"/><stop offset=".26" stop-color="#C05E44"/><stop offset=".5" stop-color="#8A7A60"/><stop offset=".75" stop-color="#6E765E"/><stop offset="1" stop-color="#5E6A56"/></linearGradient>
      <linearGradient id="piSomb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2418" stop-opacity=".5"/><stop offset=".45" stop-color="#1E2418" stop-opacity="0"/><stop offset=".7" stop-color="#FFF8E0" stop-opacity=".1"/><stop offset="1" stop-color="#FFF8E0" stop-opacity=".45"/></linearGradient>
      <linearGradient id="piRabo" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#C8381E"/><stop offset=".6" stop-color="#E8502E"/><stop offset="1" stop-color="#FF8A4A"/></linearGradient>
      <linearGradient id="piBarb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A83A24"/><stop offset="1" stop-color="#6A2618"/></linearGradient>
      <linearGradient id="piPbC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A8EA0"/><stop offset=".6" stop-color="#6E7284"/><stop offset="1" stop-color="#5A5E6E"/></linearGradient>
      <radialGradient id="piPbF" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#A8ACBC"/><stop offset="1" stop-color="#6E7284"/></radialGradient>
      <linearGradient id="piPbN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A7E90"/><stop offset="1" stop-color="#4E5262"/></linearGradient>
      <radialGradient id="piPbM" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFE6F0"/><stop offset="1" stop-color="#F0B8CC"/></radialGradient>
      <linearGradient id="piTbq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A6270"/><stop offset=".55" stop-color="#7A7E6A"/><stop offset="1" stop-color="#C8B45A"/></linearGradient>
      <radialGradient id="piPeleA" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#C8865A"/><stop offset="1" stop-color="#9A6440"/></radialGradient>
      <radialGradient id="piPeleB" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#9A6440"/><stop offset="1" stop-color="#6E4228"/></radialGradient>
      <radialGradient id="piPeleC" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#E2AA80"/><stop offset="1" stop-color="#B8805A"/></radialGradient>
      <radialGradient id="piPeleD" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#A8704A"/><stop offset="1" stop-color="#7A4A2E"/></radialGradient>
      <radialGradient id="piPeleE" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#D89A6A"/><stop offset="1" stop-color="#A86E46"/></radialGradient>
      <linearGradient id="piCamCo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A5A"/><stop offset="1" stop-color="#E05A2E"/></linearGradient>
      <linearGradient id="piColete" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA03A"/><stop offset="1" stop-color="#E86A0E"/></linearGradient>
      <linearGradient id="piBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F04A2E"/><stop offset="1" stop-color="#B82A16"/></linearGradient>
      <linearGradient id="piVest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B88AE8"/><stop offset="1" stop-color="#8A5AC8"/></linearGradient>
      <linearGradient id="piMoch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F04A3A"/><stop offset="1" stop-color="#B8241A"/></linearGradient>
      <linearGradient id="piParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4EC0B4"/><stop offset="1" stop-color="#2E9A90"/></linearGradient>
      <linearGradient id="piTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8E2EE"/><stop offset="1" stop-color="#9AAABE"/></linearGradient>
      <linearGradient id="piSolar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3E6AC0"/><stop offset="1" stop-color="#1A2E6A"/></linearGradient>
      <linearGradient id="piRede" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8406A"/><stop offset=".33" stop-color="#FF8A3A"/><stop offset=".66" stop-color="#FFC83D"/><stop offset="1" stop-color="#3EB88A"/></linearGradient>
      <linearGradient id="piCanoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8784C"/><stop offset="1" stop-color="#6A4428"/></linearGradient>
      <linearGradient id="piCanoaV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EA87A"/><stop offset="1" stop-color="#1E6A4A"/></linearGradient>
      <linearGradient id="piMotor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A707E"/><stop offset="1" stop-color="#2E323C"/></linearGradient>
      <linearGradient id="piTora" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8845E"/><stop offset=".5" stop-color="#7A5A3A"/><stop offset="1" stop-color="#4E3820"/></linearGradient>
      <radialGradient id="piAneis" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E8C890"/><stop offset=".7" stop-color="#C89A64"/><stop offset="1" stop-color="#8A6440"/></radialGradient>
      <radialGradient id="piAgp" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8ED86A"/><stop offset="1" stop-color="#2E8A3E"/></radialGradient>
      <linearGradient id="piAriC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A34"/><stop offset="1" stop-color="#5A361C"/></linearGradient>
      <linearGradient id="piAriG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0"/><stop offset="1" stop-color="#E8D4B0"/></linearGradient>
      <radialGradient id="piUacC" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCD2C0"/></radialGradient>
      <radialGradient id="piUacR" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FF6A5A"/><stop offset="1" stop-color="#D02A22"/></radialGradient>
      <linearGradient id="piJac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A4A1E"/><stop offset="1" stop-color="#6A2A0E"/></linearGradient>
      <radialGradient id="piBoia" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FF7A5A"/><stop offset="1" stop-color="#C8281E"/></radialGradient>
      <radialGradient id="piFruta" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FF9A5A"/><stop offset="1" stop-color="#C8381E"/></radialGradient>
      <radialGradient id="piSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFD84A"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <radialGradient id="piNinho" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#5A4A30"/><stop offset="1" stop-color="#A8925E" stop-opacity="0"/></radialGradient>
      <radialGradient id="piVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#0A1A14" stop-opacity="0"/><stop offset="1" stop-color="#0A1A14" stop-opacity=".34"/></radialGradient>
      <linearGradient id="piNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E4" stop-opacity="0"/><stop offset="1" stop-color="#FFF4E4" stop-opacity=".6"/></linearGradient>
      <linearGradient id="piNuvemC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A94A8"/><stop offset="1" stop-color="#5A6478"/></linearGradient>
      <pattern id="piCaus" width="80" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 C10 5 20 25 30 12 C40 2 50 22 60 14 C68 8 74 18 80 15 M10 28 C18 22 26 30 34 26 M46 4 C54 0 62 8 70 4" stroke="#F4FFE6" stroke-width="1.5" fill="none" opacity=".45"/></pattern>
      <linearGradient id="piNuv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4EDF7"/></linearGradient>
      <radialGradient id="piAninga" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#8ED86A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <filter id="piGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
    </defs>`;
  /* floresta ao longe (camada do meio, com cores variadas) */
  const CORES = [['#5E9A5A', '#3E7A44', '#9ACA80'], ['#7AA84A', '#4E7A2E', '#B8D880'], ['#4E8A7A', '#2E6A5A', '#8AC8B0'], ['#9AB070', '#6A8A4A', '#C8DCA0'], ['#A8BCA0', '#7A9478', '#E0ECD8'], ['#6E8E3E', '#4A6A26', '#A8C870'], ['#5A9A8A', '#3A7A6A', '#9ADCC8']];
  let floresta = '';
  for (let x = -10; x < 820; x += R(24, 34)) { if (x > 372 && x < 446) continue; const c = CORES[Math.floor(R(0, CORES.length))], r = R(14, 22), y = HZ - 6 + R(-2, 2); floresta += arvLonge(Math.round(x), Math.round(y), Math.round(r), c[0], c[1], c[2]); }
  let emergentes = [[96, 34], [300, 30], [520, 36], [596, 28]].map(([x, r], i) => { const c = CORES[(i * 3 + 1) % CORES.length]; return `<path d="M${x} ${HZ - 4} V${HZ - 60}" stroke="#6A5A48" stroke-width="3"/><path d="M${x} ${HZ - 50} l-12 -10 M${x} ${HZ - 56} l10 -8" stroke="#6A5A48" stroke-width="1.6"/><path d="${copa(x, HZ - 70, r, r * .5, 11, .3)}" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.1"/><path d="${copa(x - r * .25, HZ - 76, r * .5, r * .22, 8, .3)}" fill="${c[2]}" opacity=".75"/>`; }).join('');
  const palmeiras = [[206, 62], [222, 56], [252, 66], [340, 58], [356, 50], [474, 60], [492, 52]].map(([x, h]) => acai(x, HZ - 4, h, '#7AB85A', '#2E5A2E')).join('');
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Lago de várzea na Amazônia: casa flutuante, canoa dos contadores de pirarucu, floresta alagada e pirarucus debaixo da água">
    ${DEFS}
    <rect width="800" height="${HZ + 20}" fill="url(#piCeu)"/>
    <g id="pi-sol" class="toque"><circle cx="112" cy="58" r="48" fill="#FFE27A" opacity=".22"/><circle cx="112" cy="58" r="34" fill="#FFE27A" opacity=".3"/><g id="pi-raios-sol" style="transform-origin:112px 58px">${Array.from({ length:12 }, (_, k) => { const a = k * Math.PI / 6; return `<path d="M${F(112 + Math.cos(a) * 30)} ${F(58 + Math.sin(a) * 30)} L${F(112 + Math.cos(a) * 40)} ${F(58 + Math.sin(a) * 40)}" stroke="#FFD84A" stroke-width="3" stroke-linecap="round" opacity=".7"/>`; }).join('')}</g><circle cx="112" cy="58" r="23" fill="url(#piSolG)" stroke="#F0A81E" stroke-width="2"/><path d="M100 50 q7 -8 17 -8" stroke="#FFF6C8" stroke-width="3.4" fill="none" stroke-linecap="round"/><g id="pi-sol-hint" style="display:none">${brilhoHotspot(142, 34)}</g><rect x="64" y="10" width="96" height="96" fill="transparent"/></g>
    <g class="deriva">${nuvemD(196, 22, 84)}<g opacity=".85">${nuvemD(556, 46, 62)}</g></g>
    <g id="pi-nuvem" class="toque"><g id="pi-nuvem-in">${nuvemD(318, 26, 132)}<g id="pi-nuvem-esc" style="opacity:0;transition:opacity 1.2s"><g transform="translate(318 26) scale(1.015)">${nuvElip('url(#piNuvemC)', 'stroke="#4A5468" stroke-width="2.4"')}<path d="M24 52 C46 60 96 60 116 52" stroke="#4A5468" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/><path d="M52 18 q14 -10 30 -5" stroke="#A8B4C8" stroke-width="4" fill="none" stroke-linecap="round"/></g></g></g><g id="pi-nuvem-hint" style="display:none">${brilhoHotspot(446, 34)}</g><rect x="316" y="22" width="138" height="72" fill="transparent"/></g>
    <g stroke="#3E4A5A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"><path d="M230 96 q6 -6 12 0 q6 -6 12 0"/><path d="M262 112 q4 -4 8 0 q4 -4 8 0"/><path d="M520 100 q5 -5 10 0 q5 -5 10 0"/></g>
    <path d="${copa(400, HZ - 26, 440, 30, 40, .35)}" fill="url(#piMorro)" opacity=".85"/>
    <path d="M370 ${HZ} C376 ${HZ - 22} 384 ${HZ - 30} 410 ${HZ - 32} C436 ${HZ - 30} 444 ${HZ - 22} 450 ${HZ}Z" fill="#A8C8B8"/>
    <path d="M380 ${HZ + 2} C392 ${HZ - 14} 428 ${HZ - 14} 440 ${HZ + 2}Z" fill="#8EBCB0"/><path d="M396 ${HZ - 8} h28" stroke="#E6FFF8" stroke-width="1" opacity=".7"/>
    ${emergentes}
    <g id="pi-floresta">${floresta}</g>
    ${palmeiras}
    ${arvFlor(262, HZ - 2, 20, '#F2D23A', '#A8820A')}${embauba(316, HZ - 2, 62)}${arvFlor(512, HZ - 2, 18, '#F08AB8', '#A83A6A')}${embauba(456, HZ - 2, 54)}
    <rect y="${HZ - 30}" width="800" height="34" fill="url(#piNevoa)"/>
    <g id="pi-escola" class="toque"><g transform="translate(538 ${HZ - 2})">
      <path d="M8 0 V-20 M30 0 V-20 M52 0 V-20 M74 0 V-20" stroke="#5A3A22" stroke-width="2.4"/><path d="M8 -6 L30 -18 M30 -6 L52 -18 M52 -6 L74 -18" stroke="#7A5232" stroke-width="1"/>
      <rect x="2" y="-48" width="78" height="28" fill="#F4E6B0" stroke="#8A6A2A" stroke-width="1.2"/><path d="M2 -26 H80" stroke="#2E7BC8" stroke-width="3"/>
      ${[12, 30, 48, 64].map(x => `<rect x="${x}" y="-42" width="10" height="10" fill="#5ABCE8" stroke="#2E5A8A" stroke-width=".8"/>`).join('')}
      <path d="M-4 -46 L12 -62 H70 L86 -46Z" fill="#C8463A" stroke="#7A1E14" stroke-width="1.2" stroke-linejoin="round"/><path d="M4 -52 H78" stroke="#E87A6A" stroke-width="1" opacity=".7"/>
      <rect x="26" y="-60" width="30" height="8" rx="1.4" fill="#fff" stroke="#7A1E14" stroke-width=".6"/><text x="41" y="-54" text-anchor="middle" font-size="6.4" font-family="Baloo 2, sans-serif" font-weight="800" fill="#2E5AA8">ESCOLA</text>
      <path d="M-2 -20 H84" stroke="#7A5232" stroke-width="2"/><path d="M84 -20 L96 0" stroke="#7A5232" stroke-width="1.6"/>
      <rect x="-4" y="-66" width="102" height="68" fill="transparent"/></g></g>
    <g id="pi-longe-agua">
      <rect y="${HZ - 6}" width="800" height="22" fill="url(#piBarranco)"/>
      <g stroke="#5A3E22" stroke-width="1" opacity=".5" fill="none">${Array.from({ length:30 }, (_, i) => `<path d="M${F(i * 27 + R(0, 10))} ${HZ - 4} q${F(R(-3, 3))} 8 ${F(R(-4, 4))} 14"/>`).join('')}</g>
      <rect id="pi-sup-rect" y="${HZ}" width="800" height="${AG0 + 2 - HZ}" fill="url(#piSup)"/>
      <path d="M366 ${HZ + 1} C378 ${HZ - 5} 394 ${HZ - 9} 410 ${HZ - 9} C426 ${HZ - 9} 442 ${HZ - 5} 454 ${HZ + 1}Z" fill="#86BEB0" stroke="#5E9A8A" stroke-width="1"/><path d="M384 ${HZ - 4} h50 M392 ${HZ - 7} h34" stroke="#E6FFF8" stroke-width="1" opacity=".8"/>
      <g mask="url(#piMascFlo)" opacity=".34" pointer-events="none"><use href="#pi-floresta" transform="translate(0 ${2 * HZ}) scale(1 -1)" filter="url(#piBlur)"/></g>
      <rect y="${HZ}" width="800" height="22" fill="url(#piReflexo)"/>
      <g opacity=".16">${Array.from({ length:40 }, (_, i) => `<rect x="${F(i * 20 + R(0, 10))}" y="${HZ + 2}" width="${F(R(2, 4))}" height="${F(R(10, 24))}" rx="1.5" fill="${CORES[i % 7][1]}"/>`).join('')}</g>
      <rect y="${HZ}" width="800" height="40" fill="url(#piCaus)" opacity=".2"/>
      <g fill="#fff">${Array.from({ length:14 }, (_, i) => `<rect class="brilho" style="animation-delay:${F(i * .41 % 2.6)}s" x="${F(20 + (i * 97) % 760)}" y="${F(HZ + 12 + (i * 13) % 60)}" width="${8 + i % 3 * 5}" height="1.6" rx=".8" opacity=".8"/>`).join('')}</g>
      <g stroke="#E6FFF6" stroke-width="1.1" fill="none" opacity=".6"><path d="M120 ${HZ + 26} q6 -2 12 0 M300 ${HZ + 40} q6 -2 12 0 M560 ${HZ + 30} q6 -2 12 0 M690 ${HZ + 46} q6 -2 12 0 M210 ${HZ + 56} q6 -2 12 0"/></g>
      <g id="pi-vigia" class="toque"><g transform="translate(500 ${HZ + 14})">
        <path d="M-20 2 H22 L20 6 H-18Z" fill="#7A5232" stroke="#3A2414" stroke-width=".8"/><rect x="-14" y="-16" width="24" height="18" fill="#F2C84A" stroke="#8A6A0A" stroke-width=".9"/><rect x="-9" y="-11" width="7" height="7" fill="#2A3A4A"/><path d="M-18 -15 L-2 -26 L16 -15Z" fill="#9AAABE" stroke="#4A5A6E" stroke-width=".9"/>
        <g id="pi-vigia-p" style="opacity:0;transition:opacity 1s"><path d="M15 2 v-8" stroke="#2E4A8A" stroke-width="3.6"/><path d="M15 -6 v-7" stroke="#E8502E" stroke-width="4.4" stroke-linecap="round"/><circle cx="15" cy="-16" r="3" fill="#8E5A3A"/><path d="M12 -18 q3 -3 6 0" fill="#1E1410"/><rect x="16" y="-17.6" width="4.4" height="2.4" rx="1" fill="#2A2A32"/></g>
        <rect x="-22" y="-28" width="46" height="36" fill="transparent"/></g></g>
      <path id="pi-corda" d="M${BOIAS[0].x} ${BOIAS[0].y - 1} Q${(BOIAS[0].x + BOIAS[1].x) / 2} ${BOIAS[0].y + 3} ${BOIAS[1].x} ${BOIAS[1].y - 1} Q${(BOIAS[1].x + BOIAS[2].x) / 2} ${BOIAS[2].y + 3} ${BOIAS[2].x} ${BOIAS[2].y - 1}" stroke="#FFE27A" stroke-width="1.6" fill="none" stroke-dasharray="3 2" style="opacity:0;transition:opacity 1s"/>
      <g id="pi-boias-ok">${BOIAS.map((b, i) => `<g class="pi-boia-ok" data-i="${i}" style="display:none"><g transform="translate(${b.x} ${b.y}) scale(.62)"><g style="animation:flutua ${F(2.2 + i * .4)}s ease-in-out infinite alternate">${boia()}</g></g></g>`).join('')}</g>
      <g id="pi-vagas">${BOIAS.map((b, i) => `<g class="pi-vaga" data-i="${i}" style="display:none"><ellipse cx="${b.x}" cy="${b.y}" rx="11" ry="4" fill="#fff" opacity=".35" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 2"/>${brilhoHotspot(b.x + 8, b.y - 12)}</g>`).join('')}</g>
      <g id="pi-barco-escola" class="toque"><g id="pi-be-pos"><g transform="translate(0 ${HZ + 38}) scale(.62)">
        <path d="M-40 -4 C-30 4 30 4 42 -6 L40 -12 H-38Z" fill="#E8E2D2" stroke="#4A4434" stroke-width="1.2"/><path d="M-36 -9 H40" stroke="#2E7BC8" stroke-width="2.4"/>
        ${[[-26, '#8E5A3A'], [-12, '#C8865A'], [2, '#6E4228']].map(([x, p], i) => `<g class="pi-kid" data-i="${i}"><path d="M${x - 4} -11 v-8 h8 v8Z" fill="#fff" stroke="#7A8AB0" stroke-width=".7"/><circle cx="${x}" cy="-23" r="4.4" fill="${p}" stroke="#3A1E0E" stroke-width=".6"/><path d="M${x - 4.4} -24 C${x - 4} -29 ${x + 4} -29 ${x + 4.4} -24Z" fill="#1E1410"/><circle cx="${x - 1.6}" cy="-23" r=".7" fill="#14100C"/><circle cx="${x + 1.6}" cy="-23" r=".7" fill="#14100C"/><path d="M${x + 4} -12 l${i === 1 ? '3 -10' : '4 -3'}" stroke="${p}" stroke-width="1.8" stroke-linecap="round"/></g>`).join('')}
        <path d="M14 -11 v-9 h8 v9Z" fill="#E8B43A" stroke="#7A5A0A" stroke-width=".7"/><circle cx="18" cy="-24" r="4.4" fill="#A86E46" stroke="#3A1E0E" stroke-width=".6"/><path d="M13.6 -25 h9 v-2 c0 -3 -9 -3 -9 0Z" fill="#2E6AB0"/>
        <rect x="34" y="-20" width="9" height="8" rx="2" fill="#4A4E58"/><path d="M42 -14 L60 0" stroke="#4A4E58" stroke-width="2"/>
        <rect x="-44" y="-34" width="108" height="40" fill="transparent"/></g></g></g>
    </g>
    <!-- margem direita: barranco, árvores de várzea (troncos) -->
    <g id="pi-margem">
      <path d="M560 500 V470 C600 430 618 360 650 326 C664 318 690 318 720 317 L800 315 V500Z" fill="url(#piTerra)" stroke="#3A2414" stroke-width="1.6"/>
      <path d="M650 326 C664 318 690 318 720 317 L800 315 V324 L720 326 C690 326 664 327 646 334Z" fill="url(#piPraia)"/>
    </g>
    <g stroke="#D8C49A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"><path d="M690 322 C670 330 662 350 650 360 C640 368 636 380 628 392 M700 322 C686 340 676 360 668 384 M666 330 C650 334 640 346 636 356"/></g>
    <g id="pi-aninga">${aninga(738, 318, 58, -18, 20)}${aninga(752, 318, 76, -6, 8)}${aninga(770, 318, 52, 10, -18)}${aninga(744, 318, 40, -28, 36)}</g>
    <g id="pi-troncos">
      <path d="M684 320 C690 300 694 250 692 200 C690 150 694 110 700 70 L716 70 C720 110 722 150 720 200 C718 250 722 300 730 320 C716 316 700 316 684 320Z" fill="url(#piTronco)" stroke="#3E3226" stroke-width="1.6"/>
      <path d="M676 322 C684 312 690 306 694 296 M736 322 C726 312 722 304 720 296" stroke="#3E3226" stroke-width="1.4" fill="url(#piTronco)"/>
      <path d="M698 300 C696 250 698 180 702 90" stroke="#E0D4C0" stroke-width="2" fill="none" opacity=".55"/>
      <g stroke="#5A4C3C" stroke-width="1" opacity=".5" fill="none"><path d="M704 290 q4 -10 0 -20 M710 220 q-4 -8 0 -18 M706 150 q4 -8 0 -16"/></g>
      <path d="M700 140 C680 136 660 132 612 128" stroke="#4E3E2E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M700 140 C680 136 660 132 612 128" stroke="#9A8A72" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M714 110 C740 100 760 96 790 84" stroke="#4E3E2E" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M760 318 C766 260 764 180 768 0 H812 V318Z" fill="url(#piTronco2)" stroke="#2A1E14" stroke-width="1.8"/>
      <path d="M772 300 C772 220 772 120 776 10" stroke="#B8987A" stroke-width="2.4" fill="none" opacity=".5"/>
      <g stroke="#3A2A1C" stroke-width="1.2" opacity=".6" fill="none"><path d="M782 290 q6 -14 0 -28 M786 200 q-5 -12 0 -24 M780 120 q6 -10 0 -22 M790 60 q-4 -8 0 -16"/></g>
      <path d="M740 318 C748 308 756 300 762 290 M800 316 C796 306 792 298 790 288" stroke="#2A1E14" stroke-width="1.4" fill="none"/>
      <g fill="#5E8A3A" stroke="#2E5A1E" stroke-width=".8">${[[772, 250], [770, 180], [776, 110]].map(([x, y]) => `<path d="M${x} ${y} c-8 -2 -14 4 -12 10 c6 0 12 -4 12 -10Z"/><path d="M${x} ${y + 12} c-6 0 -10 6 -8 10 c5 0 9 -4 8 -10Z"/>`).join('')}</g>
    </g>
    <!-- partes submersas de coisas que boiam (ficam atrás da água) -->
    <g id="pi-flut-sob">
      <g stroke="#E8DCB8" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75">${Array.from({ length:16 }, (_, i) => { const x = 290 + i * 4.4 + R(-2, 2), L = R(30, 64); return `<path d="M${F(x)} ${AG0 + 4} q${F(R(-6, 6))} ${F(L * .5)} ${F(R(-4, 4))} ${F(L)}"/>`; }).join('')}</g>
      <g stroke="#8A6A4A" stroke-width=".8" fill="none" opacity=".6">${Array.from({ length:12 }, (_, i) => { const x = 296 + i * 5 + R(-2, 2), L = R(20, 40); return `<path d="M${F(x)} ${AG0 + 4} q${F(R(-4, 4))} ${F(L * .5)} ${F(R(-3, 3))} ${F(L)}"/>`; }).join('')}</g>
    </g>
    <g id="pi-igapo" clip-path="url(#piClipIg)" style="opacity:0;transition:opacity 1.6s" pointer-events="none">${trIg(36, 446, 20, 1)}${trIg(132, 466, 15, -1)}${trIg(256, 472, 13, 1)}${trIg(520, 474, 16, -1)}${trIg(612, 430, 18, 1)}</g>
    <!-- água em corte -->
    <g id="pi-agua-g">
      <rect y="${AG0}" width="800" height="320" fill="url(#piAgua)"/>
      <rect y="${AG0}" width="800" height="320" fill="url(#piTurvo)"/>
      <rect y="${AG0}" width="800" height="70" fill="url(#piCaus)" opacity=".26" id="pi-caus"/>
      <g id="pi-raios">${[[150, 18, 1.6], [250, 14, 1.3], [330, 30, 1.5], [440, 40, 1.4], [540, 26, 1.7], [620, 30, 1.5]].map(([x, w, k]) => `<path d="M${x} ${AG0} L${x + w} ${AG0} L${F(x + w * k + 14)} 470 L${F(x - w * .4 + 4)} 470Z" fill="url(#piRaio)" opacity=".5"/>`).join('')}</g>
    </g>
    <path d="M0 440 C60 446 120 462 200 466 C300 474 420 476 520 470 C560 466 580 440 600 420 L560 500 H0Z" fill="url(#piFundo)" stroke="#3A2E1E" stroke-width="1.6"/>
    <g stroke="#C8B488" stroke-width="1.2" fill="none" opacity=".7">${Array.from({ length:18 }, () => { const x = R(10, 560), y = R(474, 494); return `<path d="M${F(x)} ${F(y)} q5 -2.4 10 0 t10 0"/>`; }).join('')}</g>
    <ellipse id="pi-ninho" cx="${NINHO.x}" cy="${NINHO.y + 4}" rx="34" ry="8" fill="url(#piNinho)" style="opacity:0;transition:opacity 1.2s"/>
    <g fill="#8A7656" opacity=".7">${Array.from({ length:30 }, () => `<ellipse cx="${F(R(4, 590))}" cy="${F(R(474, 496))}" rx="${F(R(2, 5))}" ry="${F(R(1, 2.4))}"/>`).join('')}</g>
    <g>${Array.from({ length:22 }, () => { const x = R(10, 580), y = R(470, 496), a = R(0, 180); return `<g transform="translate(${F(x)} ${F(y)}) rotate(${F(a)})"><path d="M-6 0 C-3 -3 3 -3 6 0 C3 3 -3 3 -6 0Z" fill="${['#C8863A', '#A8642A', '#D8A04A', '#8A5A2A'][Math.floor(R(0, 4))]}" stroke="#5A3A1A" stroke-width=".6"/><path d="M-6 0 H6" stroke="#5A3A1A" stroke-width=".5"/></g>`; }).join('')}</g>
    <path d="M-10 452 C30 440 70 446 120 432 C140 426 150 418 166 410 M80 442 C90 428 104 420 118 418 M30 446 C34 436 44 430 52 428" stroke="#3A2A1A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-10 452 C30 440 70 446 120 432 C140 426 150 418 166 410 M80 442 C90 428 104 420 118 418" stroke="#7A6248" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <g id="pi-ovos" style="opacity:0;transition:opacity 1s">${Array.from({ length:26 }, (_, i) => { const a = i * 2.4, r = 3 + (i % 5) * 4.4; return `<circle cx="${F(NINHO.x + Math.cos(a) * r * 1.4)}" cy="${F(NINHO.y + 3 + Math.sin(a) * r * .32)}" r="1.9" fill="#F2C84A" stroke="#A8701A" stroke-width=".5"/>`; }).join('')}</g>
    <g id="pi-margem-corte">
      <path d="M560 500 V470 C600 432 618 368 652 336 C666 329 690 328 720 327 L800 325 V500Z" fill="url(#piTerra)"/>
      <g stroke="#4A321E" stroke-width="2" opacity=".45" fill="none">${[350, 380, 412, 446].map((y, k) => `<path d="M${640 - k * 22} ${y} C700 ${y - 4} 760 ${y + 4} 800 ${y - 2}"/>`).join('')}</g>
      <g fill="#2A1A0E" opacity=".35">${Array.from({ length:40 }, () => `<circle cx="${F(R(620, 798))}" cy="${F(R(334, 496))}" r="${F(R(.8, 2))}"/>`).join('')}</g>
      <g stroke="#D8C49A" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"><path d="M700 330 C692 360 704 390 690 420 M700 340 C720 360 724 384 744 400 M778 330 C770 370 782 400 772 440 M694 350 C676 362 664 380 656 404"/></g>
      <g fill="#C8A87A" opacity=".5">${Array.from({ length:24 }, () => `<ellipse cx="${F(R(640, 796))}" cy="${F(R(340, 496))}" rx="${F(R(1.6, 4))}" ry="${F(R(1, 2.2))}"/>`).join('')}</g>
      <path d="M560 500 V470 C600 432 618 368 652 336" stroke="#3A2414" stroke-width="1.6" fill="none"/>
    </g>
    <g id="pi-plantas-fundo">${[[30, 470, 70, '#5E8A3A', '#B8D86A'], [62, 462, 52, '#7A4A2A', '#D8805A'], [206, 468, 60, '#3E7A5A', '#8ED8A8'], [548, 466, 58, '#6A8A2A', '#C8E06A'], [584, 448, 40, '#7A4A2A', '#E8906A']].map(([x, y, h, esc, cor], i) => `<g class="balanca" style="animation-duration:${F(3.4 + i * .6)}s;transform-origin:${x}px ${y}px">${Array.from({ length:5 }, (_, k) => { const dx = (k - 2) * 4, L = h * (.7 + (k % 3) * .15), b = (k - 2) * 6; return `<path d="M${x + dx} ${y} Q${x + dx + b * .3} ${F(y - L * .55)} ${x + dx + b} ${F(y - L)}" stroke="${esc}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x + dx} ${y} Q${x + dx + b * .3} ${F(y - L * .55)} ${x + dx + b} ${F(y - L)}" stroke="${cor}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`).join('')}</g>
    <rect id="pi-agua-toque" x="0" y="${AG0 + 2}" width="800" height="200" fill="transparent"/>
    <!-- bichos debaixo da água -->
    <g id="pi-nono" class="toque" data-fig="peixeboi"><g id="pi-nono-pos" transform="translate(236 420)"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><g id="pi-nono-in" style="transform-origin:0px 0px">${peixeboi()}</g></g></g>${brilhoHotspot(318, 392)}<rect x="140" y="384" width="190" height="74" fill="transparent"/></g>
    <g id="pi-tambaquis" style="opacity:0;transition:opacity 1.2s">${[0, 1].map(i => `<g class="pi-tbq" data-i="${i}" transform="translate(${720 + i * 40} ${280 + i * 18}) scale(${i ? -.8 : -.9} ${i ? .8 : .9})">${tambaqui()}</g>`).join('')}</g>
    <g id="pi-peixes">${[0, 1, 2, 3, 4].map(i => `<g class="pi-peixe toque" data-i="${i}"><g class="pi-pos">${pira(i === 0)}<ellipse rx="92" ry="24" fill="transparent"/></g></g>`).join('')}</g>
    <g id="pi-jovem" class="toque" data-fig="arapaima"><g transform="translate(566 446) scale(-.42 .42)"><g style="animation:flutua 2.8s ease-in-out infinite alternate">${pira(false)}</g></g>${brilhoHotspot(584, 426)}<rect x="520" y="430" width="92" height="32" fill="transparent"/></g>
    <g id="pi-ninho-alvo" class="toque" style="display:none"><ellipse cx="${NINHO.x}" cy="${NINHO.y}" rx="30" ry="9" fill="#fff" opacity=".25" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>${brilhoHotspot(NINHO.x + 26, NINHO.y - 16)}<path d="M${NINHO.x} ${NINHO.y - 50} v28 M${NINHO.x - 7} ${NINHO.y - 30} l7 9 l7 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="${NINHO.x - 40}" y="${NINHO.y - 56}" width="80" height="70" fill="transparent"/></g>
    <g id="pi-agua-frente" pointer-events="none"><rect y="${AG0}" width="800" height="200" fill="url(#piProf)"/><rect y="${AG0}" width="800" height="320" fill="#4E7A5A" opacity=".06"/></g>
    <!-- coisas que boiam -->
    <g id="pi-flut">
      <rect y="${AG0 + 1}" width="800" height="10" fill="url(#piBrilhoSup)" pointer-events="none"/>
      <g id="pi-onda1" pointer-events="none"><path d="M-40 ${AG0} ${Array.from({ length:44 }, () => 'q10 -3.4 20 0').join(' ')}" stroke="#E6FFF4" stroke-width="2.2" fill="none" opacity=".85"/></g>
      <g id="pi-onda2" pointer-events="none"><path d="M-60 ${AG0 + 5} ${Array.from({ length:30 }, () => 'q15 3 30 0').join(' ')}" stroke="#BFE6DA" stroke-width="1.2" fill="none" opacity=".5"/></g>
      <g fill="#fff" pointer-events="none">${[250, 330, 420, 520, 600].map((x, i) => `<rect class="brilho" style="animation-delay:${F(i * .5)}s" x="${x}" y="${AG0 + 3 + i % 3 * 3}" width="${10 + i % 2 * 8}" height="1.6" rx=".8"/>`).join('')}</g>
      <g id="pi-casa-g"><g style="animation:flutua 4.2s ease-in-out infinite alternate">
        <g mask="url(#piMascCasa)" opacity=".44" pointer-events="none"><use href="#pi-casa" transform="translate(0 ${2 * DK + 18}) scale(1 -1)" filter="url(#piBlur)"/></g>
        <ellipse cx="110" cy="${AG0 + 8}" rx="116" ry="6" fill="#0E3A30" opacity=".3"/>
        ${[[0, AG0 - 5, 216, 10, .82], [4, AG0 + 3, 220, 11, 1]].map(([x, y, w, r, op]) => `<g opacity="${op}"><rect x="${x}" y="${y - r}" width="${w}" height="${r * 2}" rx="${r}" fill="url(#piTora)" stroke="#2E1E10" stroke-width="1.4"/><path d="M${x + 8} ${y - r * .4} H${x + w - 14}" stroke="#C8A27A" stroke-width="1.4" opacity=".6"/><path d="M${x + 20} ${y + 2} h40 M${x + 90} ${y + 4} h30 M${x + 150} ${y + 1} h40" stroke="#3E2A16" stroke-width="1" opacity=".6"/><ellipse cx="${x + w - 2}" cy="${y}" rx="${r * .5}" ry="${r}" fill="url(#piAneis)" stroke="#2E1E10" stroke-width="1.2"/><ellipse cx="${x + w - 2}" cy="${y}" rx="${r * .25}" ry="${r * .5}" fill="none" stroke="#8A6440" stroke-width=".8"/></g>`).join('')}
        <rect x="0" y="${AG0}" width="226" height="16" fill="#3E7A6A" opacity=".45"/>
        ${casa}
      </g></g>
      <g id="pi-ari" class="toque" data-fig="ariranha"><g id="pi-ari-pos"><g style="animation:flutua 3s ease-in-out infinite alternate">
        <rect x="236" y="${AG0 - 7}" width="56" height="12" rx="6" fill="url(#piTora)" stroke="#2E1E10" stroke-width="1.2"/><ellipse cx="290" cy="${AG0 - 1}" rx="3" ry="6" fill="url(#piAneis)" stroke="#2E1E10" stroke-width="1"/><path d="M244 ${AG0 - 4} h30" stroke="#C8A27A" stroke-width="1.2" opacity=".6"/>
        <rect x="234" y="${AG0}" width="60" height="6" fill="#3E7A6A" opacity=".45"/>
        <g id="pi-ari-in" style="transform-origin:262px ${AG0 - 6}px"><g transform="translate(262 ${AG0 - 7}) scale(.92)">${ariranha()}</g></g>
      </g></g>${brilhoHotspot(282, AG0 - 52)}<rect x="234" y="${AG0 - 52}" width="60" height="58" fill="transparent"/></g>
      <g id="pi-prado"><g style="animation:flutua 3.8s ease-in-out infinite alternate">
        <path d="M292 ${AG0 + 2} C300 ${AG0 - 6} 350 ${AG0 - 6} 362 ${AG0 + 2} C350 ${AG0 + 6} 304 ${AG0 + 6} 292 ${AG0 + 2}Z" fill="#4E8A3A" stroke="#1E4A1E" stroke-width="1"/>
        ${canarana(296, AG0, 13)}
        ${florAguape(318, AG0 - 8)}${florAguape(344, AG0 - 6)}
        ${aguape(306, AG0 + 2, .9)}${aguape(334, AG0 + 2, 1)}${aguape(354, AG0 + 3, .7)}
        <g id="pi-jacana" class="toque"><g id="pi-jac-pos" transform="translate(326 ${AG0 - 6})"><g id="pi-jac-in">${jacana()}</g></g><rect x="306" y="${AG0 - 40}" width="40" height="40" fill="transparent"/></g>
      </g></g>
      ${canoa}
      <g stroke="#F4FFF8" stroke-width="1.2" fill="none" opacity=".45" pointer-events="none"><path d="M20 ${AG0 + 20} h40 M90 ${AG0 + 26} h30 M150 ${AG0 + 19} h46 M560 ${AG0 + 18} h50 M640 ${AG0 + 24} h36 M700 ${AG0 + 30} h30"/></g>
      <g id="pi-ripples" pointer-events="none"></g>
    </g>
    <!-- boias para levar (fase 2) -->
    <g id="pi-boias">${BOIA0.map((b, i) => `<g class="pi-boia toque" data-i="${i}" transform="translate(${b.x} ${b.y})" style="display:none;cursor:grab"><g style="animation:flutua ${F(2.4 + i * .5)}s ease-in-out infinite alternate">${boia()}</g>${brilhoHotspot(12, -34)}<circle cy="-12" r="24" fill="transparent"/></g>`).join('')}</g>
    <g id="pi-mao" style="display:none" pointer-events="none"><path d="M436 286 C430 260 418 246 412 234" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M406 230 l12 -3 l-3 12Z" fill="#fff"/></g>
    <!-- copa grande da direita (moldura) e frutas -->
    <g id="pi-copa">
      <path d="${copa(700, 54, 128, 86, 18, .26)}" fill="url(#piCopa3)" stroke="#164A3A" stroke-width="1.8"/>
      <path d="${copa(650, 86, 66, 50, 12, .3)}" fill="url(#piCopa1)" stroke="#1E5A2A" stroke-width="1.6"/>
      <path d="${copa(760, 110, 64, 44, 12, .3)}" fill="url(#piCopa2)" stroke="#3E6A1E" stroke-width="1.6"/>
      <path d="${copa(620, 118, 34, 22, 9, .3)}" fill="url(#piCopa2)" stroke="#3E6A1E" stroke-width="1.4"/>
      ${textura(700, 60, 110, 60, 28, '#0E3A2E', 1.1)}${textura(650, 90, 50, 34, 12, '#1E4A1E', 1)}
      <g fill="#E6F6D8" opacity=".45">${Array.from({ length:26 }, () => { const x = R(600, 800), y = R(10, 140); return `<path d="M${F(x)} ${F(y)} q4 -3 8 0 q-4 2 -8 0Z"/>`; }).join('')}</g>
      <path d="M620 40 q20 -18 50 -20 M612 80 q14 -16 34 -18 M730 90 q14 -10 30 -10" stroke="#C8F0A8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <g id="pi-uacari" class="toque" data-fig="uacari"><g transform="translate(642 128)"><g id="pi-uac-in" style="transform-origin:0px 0px">${uacari()}</g></g>${brilhoHotspot(662, 96)}<rect x="624" y="92" width="38" height="46" fill="transparent"/></g>
      <g id="pi-frutas">${FRUTAS.map((f, i) => `<g class="pi-fruta" data-i="${i}"><g class="pi-fruta-in">${fruta(f.x, f.y)}</g><g class="pi-fruta-hint" style="display:none">${brilhoHotspot(f.x + 10, f.y - 12)}</g><rect x="${f.x - 14}" y="${f.y - 22}" width="28" height="36" fill="transparent"/></g>`).join('')}</g>
    </g>
    <!-- festa (final) -->
    <g id="pi-festa" style="opacity:0;transition:opacity 1.2s" pointer-events="none">
      <path d="M210 ${DK - 78 + 40} Q450 ${DK + 4} 694 ${DK - 92 + 40}" stroke="#5A3A22" stroke-width="1.2" fill="none"/>
      ${Array.from({ length:17 }, (_, i) => { const t = (i + .5) / 17, x = (1 - t) * (1 - t) * 210 + 2 * (1 - t) * t * 450 + t * t * 694, y = (1 - t) * (1 - t) * (DK - 38) + 2 * (1 - t) * t * (DK + 4) + t * t * (DK - 52); return `<path d="M${F(x - 6)} ${F(y)} L${F(x + 6)} ${F(y)} L${F(x)} ${F(y + 12)}Z" fill="${['#E8406A', '#FFC83D', '#2E9AE0', '#3EB86A', '#FF8A3A', '#B07ADA'][i % 6]}" stroke="#3A2A1A" stroke-width=".6"/>`; }).join('')}
      <g id="pi-bola-kids">
        <g transform="translate(662 318) scale(1.05)">${crianca('piPeleE', '#6E3E20', '#FFC83D', '#A86A08', '#2E5AC8', '<path d="M-7 -42 C-8 -50 8 -50 7 -42 C4 -46 -4 -46 -7 -42Z" fill="#1E1410"/>')}</g>
        <g transform="translate(744 316) scale(-1.05 1.05)">${crianca('piPeleB', '#3A1E0E', '#3EB86A', '#1E6A3A', '#1E1E2A', '<circle cx="0" cy="-43" r="7.6" fill="#1A1210"/>')}</g>
        <g id="pi-bola"><circle cx="702" cy="308" r="5" fill="#fff" stroke="#2A2A32" stroke-width="1"/><path d="M700 305 l3 0 l1 3 l-2.4 2 l-2.4 -2Z" fill="#2A2A32"/></g>
      </g>
    </g>
    <path d="M0 500 C10 470 4 440 16 420 M14 500 C24 476 22 452 34 436 M30 500 C34 484 44 470 50 460" stroke="#1E4A2A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M0 500 C10 470 4 440 16 420 M14 500 C24 476 22 452 34 436 M30 500 C34 484 44 470 50 460" stroke="#4E9A4A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect width="800" height="500" fill="url(#piVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#piGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* ---------- animações de ambiente ---------- */
  s.querySelectorAll('#pi-raios path').forEach((r, i) => { r.style.transformBox = 'fill-box'; r.style.transformOrigin = '50% 0'; r.animate([{ transform:'skewX(-4deg)' }, { transform:'skewX(4deg)' }], { duration:6000 + i * 700, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }); }); s.querySelectorAll('#pi-raios path').forEach((r, i) => r.animate([{ opacity:.25 }, { opacity:.6 }, { opacity:.25 }], { duration:4200 + i * 900, iterations:Infinity }));
  el(s, '#pi-caus').animate([{ opacity:.14 }, { opacity:.36 }, { opacity:.14 }], { duration:3600, iterations:Infinity });
  el(s, '#pi-onda1').animate([{ transform:'translateX(0)' }, { transform:'translateX(20px)' }], { duration:2400, iterations:Infinity });
  el(s, '#pi-onda2').animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)' }], { duration:3600, iterations:Infinity });
  el(s, '#pi-raios-sol').animate([{ transform:'rotate(0)' }, { transform:'rotate(30deg)' }], { duration:9000, iterations:Infinity });
  s.querySelectorAll('.pi-helice').forEach(h => h.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(-1)' }], { duration:160, iterations:Infinity }));
  el(s, '#pi-be-pos').animate([{ transform:'translateX(262px)' }, { transform:'translateX(470px)' }], { duration:26000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  const mao_ = el(s, '#pi-mao'); mao_.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const bolhas = (x, y, n, topo) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-8, 8), y:y + sorte(-4, 4), vy:sorte(.7, 1.6), r:sorte(1.6, 4), topo:(topo || AG) + 4, f:sorte(0, 6) }); };
  const respinga = (x, y, n, cor) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:x + sorte(-10, 10), y, t:i * 2, cor:cor || '#E6FFF4' }); };
  const chip = t => api.hud(`<span class="chip">${t}</span>`);
  const NS = 'http://www.w3.org/2000/svg';
  /* anel na superfície (boiada) */
  function anel(x, n, cor){
    for (let k = 0; k < (n || 3); k++) depois(k * 260, () => {
      const e = document.createElementNS(NS, 'ellipse'); e.setAttribute('cx', F(x)); e.setAttribute('cy', F(AG0 + 1)); e.setAttribute('rx', '8'); e.setAttribute('ry', '2.4'); e.setAttribute('fill', 'none'); e.setAttribute('stroke', cor || '#F4FFF8'); e.setAttribute('stroke-width', '2');
      e.style.transformOrigin = `${F(x)}px ${AG0 + 1}px`; el(s, '#pi-ripples').appendChild(e);
      const a = e.animate([{ transform:'scale(1)', opacity:.95 }, { transform:'scale(6)', opacity:0 }], { duration:1600, easing:'ease-out' }); a.onfinish = () => e.remove();
    });
  }
  function numero(x, y, n, cor){
    const g = document.createElementNS(NS, 'g'); g.setAttribute('pointer-events', 'none');
    g.innerHTML = `<circle cx="${F(x)}" cy="${F(y)}" r="13" fill="${cor || '#FFC83D'}" stroke="#7A4A08" stroke-width="2"/><text x="${F(x)}" y="${F(y + 5.6)}" text-anchor="middle" font-size="16" font-family="Baloo 2, sans-serif" font-weight="800" fill="#3A2408">${n}</text>`;
    s.appendChild(g); const a = g.animate([{ transform:'translateY(0)', opacity:0 }, { transform:'translateY(-10px)', opacity:1, offset:.2 }, { transform:'translateY(-34px)', opacity:0 }], { duration:1700, easing:'ease-out' }); a.onfinish = () => g.remove();
  }
  /* ---------- nível da água ---------- */
  function poeNivel(v){
    AG = v; const dy = v - AG0;
    ['#pi-agua-g', '#pi-flut', '#pi-flut-sob', '#pi-agua-frente'].forEach(q => el(s, q).setAttribute('transform', `translate(0 ${F(dy)})`));
    el(s, '#pi-longe-agua').setAttribute('transform', `translate(0 ${F(dy * .34)})`);
    el(s, '#pi-agua-toque').setAttribute('y', F(v + 2)); el(s, '#pi-sup-rect').setAttribute('height', F(v - HZ - dy * .34 + 2)); el(s, '#pi-clip-ig').setAttribute('y', F(v));
  }
  function nivel(v1, ms, fim){ const v0 = AG, t0 = performance.now(); ocupado = true; depois(ms * .5, () => P.forEach(p => { if (p.est === 'nada') { const z = zona(); p.tx = z.x; p.ty = z.y; } })); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); poeNivel(v0 + (v1 - v0) * e); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0); }
  /* ---------- pirarucus que nadam ---------- */
  const zona = () => {
    if (AG < 280 && Math.random() < .4) return { x:sorte(640, 780), y:sorte(AG + 26, 296) };
    if (AG < 280) return { x:sorte(80, 610), y:sorte(AG + 40, 420) };
    const lo = Math.max(AG + 40, 336), hi = /ninho|ovos|nascem|filhotes|sobeFil/.test(fase) ? 396 : AG > 320 ? 446 : 438;
    return { x:sorte(340, 610), y:sorte(lo, hi) };
  };
  const PX = [{ x:380, y:356, k:.8 }, { x:540, y:410, k:.74 }, { x:450, y:384, k:.7 }, { x:590, y:350, k:.66 }, { x:400, y:426, k:.72 }];
  const P = PX.map((p, i) => { const z = zona(); return { i, x:p.x, y:p.y, k:p.k, dir:i % 2 ? -1 : 1, a:0, tx:z.x, ty:z.y, v:sorte(.45, .75), est:'nada', t:0, contado:false, g:s.querySelector(`.pi-peixe[data-i="${i}"]`), pos:s.querySelector(`.pi-peixe[data-i="${i}"] .pi-pos`) }; });
  function passo(p, tx, ty, v){ const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); if (d < v) { p.x = tx; p.y = ty; return true; } p.x += dx / d * v; p.y += dy / d * v; if (Math.abs(dx) > 4) p.dir = dx > 0 ? 1 : -1; return false; }
  let ultimoT = performance.now();
  function anda(t){
    const dt = Math.min(3, (t - ultimoT) / 16.7); ultimoT = t;
    P.forEach(p => {
      let alvoA = 0;
      if (p.est === 'nada') {
        if (passo(p, p.tx, p.ty, p.v * dt)) { const z = zona(); p.tx = z.x; p.ty = z.y; }
        alvoA = Math.max(-.25, Math.min(.25, (p.ty - p.y) / 200)) * p.dir;
        if (p.y < AG + 24) p.y += (AG + 24 - p.y) * .1; if (AG > 280 && p.x > 616) { p.tx = Math.min(p.tx, 590); p.ty = Math.max(p.ty, AG + 50); }
      } else if (p.est === 'sobe') {
        if (passo(p, p.sx, AG - 4 + 31.5 * p.k, 1.5 * dt)) { p.est = 'boia'; p.t = t; boiada(p); }
        alvoA = -.44 * p.dir;
      } else if (p.est === 'boia') {
        alvoA = -.44 * p.dir; p.y = AG - 4 + 31.5 * p.k + Math.sin(t / 300) * 1.2;
        if (t - p.t > (p.boiaMs || 2600)) { p.est = 'desce'; p.g.removeAttribute('data-sup'); p.ty2 = Math.min(AG + 100, 430); p.tx2 = p.x + p.dir * 50; anel(p.x + p.dir * 66, 1); toca('glub'); }
      } else if (p.est === 'desce') {
        if (passo(p, p.tx2, p.ty2, 1.2 * dt)) { p.est = 'nada'; const z = zona(); p.tx = z.x; p.ty = z.y; }
        alvoA = .3 * p.dir;
      } else if (p.est === 'ninho') {
        if (passo(p, p.nx, p.ny, .9 * dt)) p.dir = p.ndir;
        alvoA = .06 * p.dir * Math.sin(t / 500);
      }
      p.a += (alvoA - p.a) * .06 * dt;
      const ond = Math.sin(t / 260 + p.i) * .02;
      p.pos.setAttribute('transform', `translate(${F(p.x)} ${F(p.y)}) rotate(${F((p.a + ond) * 57.3)}) scale(${F(p.dir * p.k)} ${F(p.k)})`);
    });
  }
  const nariz = p => { const ca = Math.cos(p.a), sa = Math.sin(p.a), lx = 74 * p.dir * p.k, ly = -2 * p.k; return { x:p.x + lx * ca - ly * sa, y:p.y + lx * sa + ly * ca }; };
  function boiada(p){
    const n = nariz(p); p.g.setAttribute('data-sup', '1');
    anel(n.x, 3); respinga(n.x, AG, 5); bolhas(n.x - p.dir * 20, AG + 30, 4); toca('splash');
    somOn && tom(140, 0, .18, 'sine', .08, 70);
  }
  /* ---------- 1. contar os pirarucus ---------- */
  let ultSobe = 0, nonoRespira = 0;
  function agenda(t){
    if (fase !== 'contar') return;
    if (t - ultSobe < 2300) return;
    if (P.some(p => p.est === 'sobe' || p.est === 'boia')) return;
    const livres = P.filter(p => p.est === 'nada'); if (!livres.length) return;
    const nao = livres.filter(p => !p.contado);
    const p = (nao.length && Math.random() < .78) ? nao[Math.floor(Math.random() * nao.length)] : livres[Math.floor(Math.random() * livres.length)];
    ultSobe = t; p.est = 'sobe'; p.sx = Math.max(SUPX[0], Math.min(SUPX[1], p.x)); p.boiaMs = 2700;
  }
  let avisoEspera = 0;
  P.forEach(p => p.g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'contar') {
      if (p.est === 'boia' || (p.est === 'sobe' && p.y < AG + 60)) {
        if (p.contado) { toca('clique'); api.diz('Esse você já contou! Cada pirarucu conta uma vez só.'); return; }
        p.contado = true; contados++; toca('ok'); const n = nariz(p); numero(n.x, AG - 30, contados); c.brilhos(n.x, AG - 10, 4, '#FFE27A');
        s.querySelectorAll('.pi-traco')[contados - 1].style.opacity = 1; chip(`Pirarucus: ${contados}/5`);
        el(s, '#pi-braco-ct').animate([{ transform:'rotate(0)' }, { transform:'rotate(-12deg)' }, { transform:'rotate(0)' }], { duration:500 });
        if (contados === 1) api.diz('Um! Os contadores reconhecem o pirarucu pelo barulho e pelo jeito que ele boia.');
        if (contados === 2) api.diz('Dois! A contadora anota cada um na prancheta.');
        if (contados === 3) api.diz('O pirarucu respira ar! Ele sobe mais ou menos a cada 15 ou 20 minutos.');
        if (contados === 4) api.diz('Falta um! Olhe bem a água.');
        if (contados === 5) { fase = 'contado'; toca('vitoria'); c.brilhos(640, 200, 8, '#FFE27A'); api.diz('Cinco pirarucus! Esse jeito de contar nasceu do saber dos pescadores ribeirinhos, e os cientistas confirmaram que funciona.'); depois(6200, comecaBoias); }
      } else if (performance.now() - avisoEspera > 3000) { avisoEspera = performance.now(); toca('glub'); api.diz('Espere ele subir para respirar! Toque quando ele boiar.'); }
      return;
    }
    if (fase === 'filhotes' && p.i === 0) { levaFilhotes(); return; }
    toca('glub'); bolhas(p.x, p.y, 3);
    if (fase !== 'ninho' && fase !== 'filhotes') api.diz(['As escamas do pirarucu são duras e grandes.', 'O rabo vermelho deu nome ao peixe: pira é peixe, urucu é vermelho.', 'O pirarucu é um dos maiores peixes de água doce do mundo!'][p.i % 3]);
  }));
  /* ---------- 2. lago de procriação ---------- */
  const boiaG = [...s.querySelectorAll('.pi-boia')];
  function comecaBoias(){
    fase = 'boias'; chip('Boias: 0/3');
    s.querySelectorAll('.pi-vaga').forEach(v => v.style.display = ''); boiaG.forEach(b => { b.style.display = ''; b.animate([{ opacity:0 }, { opacity:1 }], { duration:600 }); });
    mao_.style.display = '';
    api.diz('Este lago vai ficar fechado para os pirarucus terem filhotes. Arraste as boias até a entrada do lago.');
  }
  let arr = null;
  function arrastavel(g, ok, x0, y0, solta){
    const st = { x:x0, y:y0 };
    const poe = (x, y, k) => g.setAttribute('transform', `translate(${F(x)} ${F(y)})${k ? ` scale(${F(k)})` : ''}`);
    g.addEventListener('pointerdown', e => { if (!ok() || ocupado || arr) return; e.stopPropagation(); const p = c.ponto(e); arr = { g, st, poe, solta, dx:p.x - st.x, dy:p.y - st.y, px:p.x, py:p.y, moveu:false }; s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao_.style.display = 'none'; toca('clique'); });
    return { st, poe };
  }
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); if (Math.hypot(p.x - arr.px, p.y - arr.py) > 8) arr.moveu = true; arr.st.x = Math.max(10, Math.min(790, p.x - arr.dx)); arr.st.y = Math.max(20, Math.min(490, p.y - arr.dy)); arr.poe(arr.st.x, arr.st.y); });
  s.addEventListener('pointerup', () => { if (!arr) return; const a = arr; arr = null; a.g.style.cursor = 'grab'; a.solta(a.moveu, a.st.x, a.st.y); });
  function voa(g, st, x1, y1, ms, k1, fim){
    const x0 = st.x, y0 = st.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); st.x = x0 + (x1 - x0) * e; st.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 30;
      g.setAttribute('transform', `translate(${F(st.x)} ${F(st.y)}) scale(${F(1 + (k1 - 1) * e)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  const vagaLivre = (x, y) => { let m = -1, md = 1e9; BOIAS.forEach((b, i) => { if (s.querySelector(`.pi-boia-ok[data-i="${i}"]`).style.display !== 'none') return; const d = x == null ? i : Math.hypot(b.x - x, b.y - y); if (d < md) { md = d; m = i; } }); return m; };
  boiaG.forEach((g, i) => {
    const { st } = arrastavel(g, () => fase === 'boias' && !g.dataset.feito, BOIA0[i].x, BOIA0[i].y, (moveu, x, y) => {
      if (!moveu || y < 262) poeBoia(g, st, moveu ? vagaLivre(x, y) : vagaLivre()); else { voa(g, st, BOIA0[i].x, BOIA0[i].y, 500, 1); toca('glub'); api.diz('Leve a boia até a entrada do lago, lá no fundo!'); }
    });
  });
  function poeBoia(g, st, v){
    if (v < 0) return; g.dataset.feito = 1;
    voa(g, st, BOIAS[v].x, BOIAS[v].y, 700, .62, () => {
      g.style.display = 'none'; s.querySelector(`.pi-boia-ok[data-i="${v}"]`).style.display = ''; s.querySelector(`.pi-vaga[data-i="${v}"]`).style.display = 'none';
      boias++; chip(`Boias: ${boias}/3`); toca('splash'); respinga(BOIAS[v].x, BOIAS[v].y + 4, 3); c.brilhos(BOIAS[v].x, BOIAS[v].y - 10, 3, '#FFE27A');
      if (boias === 1) api.diz('As boias avisam: aqui ninguém pesca agora.');
      if (boias === 3) { el(s, '#pi-vigia-p').style.opacity = 1; el(s, '#pi-corda').style.opacity = 1; toca('ok'); api.diz('Lago fechado! O vigia da comunidade toma conta dele.'); depois(3600, comecaNinho); }
    });
  }
  function comecaNinho(){ fase = 'ninho0'; chip('Ninho'); el(s, '#pi-ninho-alvo').style.display = ''; api.diz('Toque no fundo do lago para o casal de pirarucus fazer o ninho.'); }
  el(s, '#pi-ninho-alvo').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'ninho0') {
      fase = 'ninho'; el(s, '#pi-ninho-alvo').style.display = 'none'; toca('glub');
      [[0, NINHO.x - 60, NINHO.y - 14, 1], [1, NINHO.x + 62, NINHO.y - 18, -1]].forEach(([i, x, y, d]) => { const p = P[i]; p.est = 'ninho'; p.nx = x; p.ny = y; p.ndir = d; p.g.removeAttribute('data-sup'); });
      api.diz('O casal cava um ninho na areia do fundo do lago.');
      depois(2600, () => { el(s, '#pi-ninho').style.opacity = 1; for (let k = 0; k < 10; k++) c.add({ tipo:'bolha', x:NINHO.x + sorte(-26, 26), y:NINHO.y, vy:sorte(.4, 1), r:sorte(1.4, 3), topo:AG + 4, f:sorte(0, 6) }); });
      depois(4200, () => { el(s, '#pi-ovos').style.opacity = 1; toca('pop'); c.brilhos(NINHO.x, NINHO.y - 6, 4, '#FFE27A'); api.diz('Ovinhos! Toque no ninho para ver os filhotes nascerem.'); fase = 'ovos'; el(s, '#pi-ninho-alvo').style.display = ''; el(s, '#pi-ninho-alvo').querySelector('path').style.display = 'none'; });
      return;
    }
    if (fase === 'ovos') {
      fase = 'nascem'; el(s, '#pi-ninho-alvo').style.display = 'none'; el(s, '#pi-ovos').style.opacity = 0; toca('vitoria');
      filhotes = true; FIL.forEach(f => { f.x = NINHO.x + sorte(-20, 20); f.y = NINHO.y - sorte(0, 6); });
      el(s, '.pi-peixe[data-i="0"] .pi-escura').style.opacity = .78;
      api.diz('Nasceram! Os filhotes ficam pertinho da cabeça do pai, e ele fica com a cabeça bem escura.');
      depois(5200, () => { fase = 'filhotes'; chip('Filhotes'); hintPai(true); api.diz('Toque no pai para ele levar os filhotes para respirar.'); });
    }
  });
  let hintG = null;
  function hintPai(on){ if (hintG) { hintG.remove(); hintG = null; } if (!on) return; hintG = document.createElementNS(NS, 'g'); hintG.setAttribute('pointer-events', 'none'); hintG.innerHTML = brilhoHotspot(0, 0); s.appendChild(hintG); }
  function levaFilhotes(){
    fase = 'sobeFil'; hintPai(false); const p = P[0]; p.est = 'sobe'; p.sx = 430; p.boiaMs = 3200; toca('glub');
    api.diz('Os filhotes também sobem para respirar ar, bem juntinhos do pai!');
    depois(7400, () => { P[1].est = 'nada'; P[0].est = 'nada'; toca('vitoria'); c.brilhos(430, AG - 20, 8, '#FFE27A'); api.diz('Com o lago protegido, nascem muitos pirarucus.'); depois(4200, comecaCheia); });
  }
  /* ---------- 3. cheia e seca ---------- */
  function comecaCheia(){
    fase = 'cheia'; chip('Cheia: 0/3'); toca('clique');
    el(s, '#pi-canoa-pos').animate([{ transform:'translateX(0)' }, { transform:'translateX(320px)' }], { duration:3200, easing:'ease-in', fill:'forwards' }); motor();
    api.diz('Os contadores voltam para casa. Chegou o tempo das chuvas!');
    depois(2600, () => { el(s, '#pi-nuvem-hint').style.display = ''; el(s, '#pi-nuvem-esc').style.opacity = .85; api.diz('Toque na nuvem para o rio encher.'); });
  }
  el(s, '#pi-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'cheia' && chuvas < 3) {
      if (ocupado) return; ocupado = true; chuvas++; chip(`Cheia: ${chuvas}/3`); toca('chuva'); c.chover(330, 460, 86, AG, 26, '#4A8AE0'); c.chover(150, 330, 100, AG, 16, '#4A8AE0'); c.chover(460, 640, 100, AG, 16, '#4A8AE0');
      el(s, '#pi-nuvem-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(3px)' }, { transform:'translateY(0)' }], { duration:500 });
      depois(900, () => nivel(AG0 - chuvas * (AG0 - NIV.cheia) / 3, 1700, () => {
        if (chuvas === 1) api.diz('Na cheia, o rio sobe muitos metros!');
        if (chuvas === 2) { el(s, '#pi-igapo').style.opacity = .55; api.diz('A casa flutuante sobe junto com a água.'); }
        if (chuvas === 3) { el(s, '#pi-igapo').style.opacity = 1; el(s, '#pi-nuvem-hint').style.display = 'none'; el(s, '#pi-nuvem-esc').style.opacity = 0; el(s, '#pi-tambaquis').style.opacity = 1; toca('vitoria'); api.diz('A floresta ficou alagada, e os peixes nadam entre as árvores!'); depois(3800, comecaFrutas); }
      }));
      return;
    }
    toca('pop'); api.diz('Na Amazônia chove muito. A chuva enche os rios todo ano.');
  });
  function comecaFrutas(){ fase = 'frutas'; chip('Frutas: 0/3'); s.querySelectorAll('.pi-fruta-hint').forEach(h => h.style.display = ''); api.diz('Toque nas frutas da árvore para elas caírem na água.'); }
  const TB = [{ x:720, y:280, d:-1, k:.9 }, { x:760, y:298, d:-1, k:.8 }];
  const tbqG = [...s.querySelectorAll('.pi-tbq')];
  const poeTbq = i => tbqG[i].setAttribute('transform', `translate(${F(TB[i].x)} ${F(TB[i].y)}) scale(${F(TB[i].d * TB[i].k)} ${F(TB[i].k)})`);
  function nadaTbq(i, x, y, ms, fim){ const b = TB[i], x0 = b.x, y0 = b.y, t0 = performance.now(); b.d = x > x0 ? 1 : -1; (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); b.x = x0 + (x - x0) * e; b.y = y0 + (y - y0) * e; poeTbq(i); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  s.querySelectorAll('.pi-fruta').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'frutas' || g.dataset.feito) return; g.dataset.feito = 1;
    const i = +g.dataset.i, f = FRUTAS[i], cai = AG + 12 - f.y; frutas++; chip(`Frutas: ${frutas}/3`); toca('pop');
    el(g, '.pi-fruta-hint').style.display = 'none';
    const fr = el(g, '.pi-fruta-in'); fr.animate([{ transform:'translateY(0)' }, { transform:`translateY(${F(cai - 12)}px)`, offset:.7 }, { transform:`translateY(${F(cai)}px)` }], { duration:900, easing:'ease-in', fill:'forwards' });
    depois(650, () => { toca('splash'); respinga(f.x, AG, 4); anel(f.x, 2); });
    const ti = i % 2; nadaTbq(ti, f.x + (TB[ti].x > f.x ? 26 : -26), AG + 26, 1100, () => { fr.style.opacity = 0; toca('glub'); bolhas(f.x, AG + 20, 3); TB[ti].d = TB[ti].x < f.x ? 1 : -1; poeTbq(ti); });
    if (frutas === 1) depois(1300, () => api.diz('O tambaqui come frutas e sementes que caem na água.'));
    if (frutas === 3) depois(1500, () => { api.diz('Ele espalha as sementes, e nascem novas árvores na floresta!'); depois(3800, comecaSeca); });
  }));
  function comecaSeca(){ fase = 'seca'; chip('Seca: 0/2'); el(s, '#pi-sol-hint').style.display = ''; api.diz('Agora toque no sol para chegar a seca.'); }
  el(s, '#pi-sol').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'seca' && sois < 2) {
      if (ocupado) return; ocupado = true; sois++; chip(`Seca: ${sois}/2`); toca('ok'); c.brilhos(112, 58, 6, '#FFE27A');
      el(s, '#pi-raios-sol').animate([{ opacity:.6 }, { opacity:1 }, { opacity:.6 }], { duration:800 });
      for (let k = 0; k < 8; k++) c.add({ tipo:'vapor', x0:sorte(240, 620), y0:AG - 4, x1:sorte(260, 560), y1:sorte(70, 110), dur:sorte(80, 120), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
      if (sois === 1) { el(s, '#pi-tambaquis').style.opacity = 0; el(s, '#pi-igapo').style.opacity = 0; }
      nivel(sois === 1 ? 296 : NIV.seca, 1800, () => {
        if (sois === 1) api.diz('A água baixa devagar, e os peixes voltam para os lagos.');
        if (sois === 2) { el(s, '#pi-sol-hint').style.display = 'none'; api.diz('Seca! Aparecem as praias. A comunidade pesca só a cota combinada: só pirarucus grandes, e só uma parte deles.'); depois(6400, festa); }
      });
      return;
    }
    toca('ok'); c.brilhos(112, 58, 4, '#FFE27A'); api.diz('Na Amazônia faz calor o ano todo.');
  });
  function festa(){
    fase = 'fim'; chip('Festa na comunidade!'); el(s, '#pi-festa').style.opacity = 1; toca('vitoria');
    el(s, '#pi-bola').animate([{ transform:'translate(-34px,0)' }, { transform:'translate(0,-26px)' }, { transform:'translate(34px,0)' }, { transform:'translate(0,-26px)' }, { transform:'translate(-34px,0)' }], { duration:1800, iterations:Infinity });
    ['#pi-braco-avo', '#pi-braco-me'].forEach(q => el(s, q).animate([{ transform:'rotate(0)' }, { transform:'rotate(-22deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:800, iterations:6 }));
    for (let i = 0; i < 5; i++) depois(i * 500, () => c.brilhos(sorte(200, 680), sorte(150, 240), 3, ['#FFE27A', '#FF8AB0', '#8AE0FF'][i % 3]));
    const mel = [[523, .18], [659, .18], [784, .18], [659, .18], [698, .36], [587, .18], [659, .18], [523, .5]];
    let tt = 0; mel.forEach(([f, d]) => { if (somOn) { tom(f, tt, d * .95, 'triangle', .07); tom(f / 2, tt, d * .9, 'sine', .04); } tt += d; });
    api.diz('Com o manejo, os pirarucus voltaram a ser muitos! Contar, proteger e pescar só um pouco: assim os ribeirinhos cuidam do lago e da vida.');
    depois(7200, api.fim);
  }
  /* ---------- toques extras ---------- */
  function motor(){ if (!somOn) return; for (let i = 0; i < 10; i++) tom(70 + (i % 2) * 8, i * .09, .09, 'sawtooth', .035, 60); }
  let nonoK = 0, nonoOc = false;
  function nonoSobe(falar){
    if (nonoOc) return; nonoOc = true; const g = el(s, '#pi-nono-pos'), alvo = AG + 12 - 420;
    g.animate([{ transform:'translate(236px,420px)' }, { transform:`translate(300px,${420 + alvo}px) rotate(-14deg)`, offset:.4 }, { transform:`translate(300px,${420 + alvo}px) rotate(-14deg)`, offset:.7 }, { transform:'translate(236px,420px)' }], { duration:4200, easing:'ease-in-out' });
    depois(1700, () => { anel(380, 2, '#F4FFF8'); respinga(380, AG, 3); toca('glub'); if (falar) api.diz('Eu também subo para respirar ar, mas não sou pirarucu: sou peixe-boi!'); });
    depois(4300, () => { nonoOc = false; });
  }
  el(s, '#pi-nono').addEventListener('click', () => {
    toca('glub'); bolhas(312, 410, 4);
    el(s, '#pi-nono-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-6deg) translateY(-4px)' }, { transform:'rotate(4deg)' }, { transform:'rotate(0)' }], { duration:900 });
    if (fase === 'contar' && !nonoOc && nonoK % 2 === 0) { nonoK++; nonoSobe(true); return; }
    const falas = ['Eu como capim e plantas da água. Nhac!', 'O peixe-boi-da-amazônia é o menor peixe-boi do mundo. Eu só vivo em água doce.', 'Na cheia, eu passeio pela floresta alagada!', 'Eu também respiro ar, como você.'];
    api.diz(falas[nonoK++ % falas.length]);
  });
  let ariOc = false;
  el(s, '#pi-ari').addEventListener('click', () => {
    if (ariOc) return; ariOc = true; const g = el(s, '#pi-ari-in');
    [700, 760, 660].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'square', .03, f * 1.3), i * 110));
    g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px) rotate(-10deg)', offset:.25 }, { transform:'translateY(40px) rotate(80deg)', opacity:0, offset:.45 }, { transform:'translateY(40px)', opacity:0, offset:.7 }, { transform:'translateY(-4px)', opacity:1, offset:.88 }, { transform:'translateY(0)', opacity:1 }], { duration:2600, easing:'ease-in-out' });
    depois(900, () => { toca('splash'); respinga(266, AG, 5); bolhas(266, AG + 30, 5); });
    depois(1900, () => { toca('pop'); respinga(262, AG, 3); });
    api.diz('A ariranha mergulha e pega peixes. Ela vive em família e é a maior lontra do mundo!');
    depois(2700, () => { ariOc = false; });
  });
  el(s, '#pi-uacari').addEventListener('click', () => {
    toca('pop'); el(s, '#pi-uac-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(-14px,-18px) rotate(-12deg)', offset:.4 }, { transform:'translate(-22px,0)', offset:.6 }, { transform:'translate(-22px,0)', offset:.8 }, { transform:'translate(0,0)' }], { duration:1800, easing:'ease-in-out' });
    [900, 1200].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .08, 'sine', .05, f * 1.4), i * 140));
    api.diz('O uacari-branco tem a cara bem vermelha. Ele vive no alto das árvores da floresta alagada.');
  });
  let jacOc = false;
  el(s, '#pi-jacana').addEventListener('click', e => {
    e.stopPropagation(); if (jacOc) return; jacOc = true; toca('clique');
    el(s, '#pi-jac-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(12px,-2px)' }, { transform:'translate(22px,0)' }, { transform:'translate(10px,-2px)' }, { transform:'translate(0,0)' }], { duration:2400, easing:'ease-in-out' });
    api.diz('A jaçanã tem dedos bem compridos para andar em cima das plantas que boiam.');
    depois(2500, () => { jacOc = false; });
  });
  el(s, '#pi-barco-escola').addEventListener('click', e => { e.stopPropagation(); motor(); s.querySelectorAll('.pi-kid').forEach((k, i) => k.animate([{ transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:300, iterations:4, delay:i * 90 })); api.diz('Aqui o rio é a rua: as crianças vão para a escola de barco!'); });
  el(s, '#pi-escola').addEventListener('click', e => { e.stopPropagation(); [880, 880, 1040].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .22, 'triangle', .06), i * 240)); api.diz('A escola fica no alto, sobre esteios, para a cheia não alcançar.'); });
  el(s, '#pi-avo').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#pi-braco-avo').animate([{ transform:'rotate(0)' }, { transform:'rotate(-25deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 }); el(s, '#pi-rede-g').animate([{ transform:'translateX(0)' }, { transform:'translateX(3px)' }, { transform:'translateX(-3px)' }, { transform:'translateX(0)' }], { duration:1400 }); api.diz('Moro numa casa flutuante. Na cheia, ela sobe junto com o rio!'); });
  el(s, '#pi-menina').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#pi-braco-me').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }], { duration:600, iterations:3 }); api.diz('Tchau! Vou pegar o barco da escola.'); });
  el(s, '#pi-horta').addEventListener('click', e => { e.stopPropagation(); toca('planta'); el(s, '#pi-horta-pl').animate([{ transform:'scaleY(1)' }, { transform:'scaleY(1.25)' }, { transform:'scaleY(1)' }], { duration:900 }); c.brilhos(28, DK - 40 + (AG - AG0), 3, '#C8F0A0'); api.diz('A horta fica no alto, num canteiro suspenso, para a cheia não levar o cheiro-verde.'); });
  el(s, '#pi-horta-pl').style.transformBox = 'fill-box'; el(s, '#pi-horta-pl').style.transformOrigin = '50% 100%';
  el(s, '#pi-solar').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(90, DK - 126 + (AG - AG0), 4, '#BFE6FF'); api.diz('A placa solar transforma a luz do sol em energia para a casa.'); });
  el(s, '#pi-contador').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#pi-braco-ct').animate([{ transform:'rotate(0)' }, { transform:'rotate(-14deg)' }, { transform:'rotate(6deg)' }, { transform:'rotate(0)' }], { duration:700 }); api.diz('Eu sou contador de pirarucu. Aprendi olhando a água desde criança!'); });
  el(s, '#pi-vigia').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz(boias === 3 ? 'O vigia fica de olho para ninguém pescar no lago fechado.' : 'Esta é a casinha do vigia do lago.'); });
  el(s, '#pi-agua-toque').addEventListener('pointerdown', e => { const p = c.ponto(e); toca('glub'); bolhas(p.x, p.y, 3); });
  /* ---------- canvas: partículas, filhotes, marquinhas ---------- */
  const FIL = Array.from({ length:18 }, (_, k) => ({ x:NINHO.x, y:NINHO.y, ox:Math.cos(k * 2.4) * Math.sqrt(k + 1) * 4.6, oy:Math.sin(k * 2.4) * Math.sqrt(k + 1) * 2.6 - 4, f:sorte(0, 6) }));
  const poeira = Array.from({ length:96 }, (_, i) => ({ x:sorte(4, 796), y:sorte(AG0 + 8, 466), r:i % 9 === 0 ? sorte(2.4, 4) : sorte(.6, 1.8), f:sorte(0, 6), v:sorte(.04, .16), cor:['#F4F0D0', '#D8E8B0', '#E8D8A8'][i % 3] }));
  const piabas = Array.from({ length:11 }, (_, k) => ({ ox:Math.cos(k * 2.4) * (8 + k % 3 * 8), oy:Math.sin(k * 2.4) * (5 + k % 3 * 4), f:sorte(0, 6) }));
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    { const ax = 110 + Math.sin(t * .21) * 80, ay = Math.max(AG + 40, 360) + Math.sin(t * .5) * 14, d = Math.cos(t * .21) > 0 ? 1 : -1;
      piabas.forEach(p => { const x = ax + p.ox * d, y = ay + p.oy + Math.sin(t * 1.8 + p.f) * 2; ctx.save(); ctx.translate(x, y); ctx.scale(d, 1); ctx.globalAlpha = .85; ctx.fillStyle = '#D8E4DC'; ctx.strokeStyle = '#3E5A54'; ctx.lineWidth = .9;
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-9, -3 + Math.sin(t * 12 + p.f)); ctx.lineTo(-9, 3 + Math.sin(t * 12 + p.f)); ctx.closePath(); ctx.fillStyle = '#E8603A'; ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#D8E4DC'; ctx.beginPath(); ctx.ellipse(0, 0, 6.4, 2.6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-3, -.8); ctx.lineTo(3, -1.2); ctx.stroke();
        ctx.fillStyle = '#12121A'; ctx.beginPath(); ctx.arc(3.6, -.5, .8, 0, 7); ctx.fill(); ctx.restore(); }); }
    poeira.forEach(p => { p.y -= p.v; if (p.y < AG + 6) p.y = 466; if (p.x > 650 && p.y > 328) return;
      ctx.globalAlpha = (p.r > 2.2 ? .1 : .24) + (p.r > 2.2 ? .06 : .18) * Math.sin(t + p.f); ctx.fillStyle = p.cor; ctx.beginPath(); ctx.arc(p.x + Math.sin(t * .6 + p.f) * 4, p.y, p.r, 0, 7); ctx.fill(); });
    P.forEach(p => { if (!p.contado || fase === 'fim') return; ctx.globalAlpha = .5 + .3 * Math.sin(t * 3 + p.i); ctx.fillStyle = '#FFE27A'; const x = p.x - p.dir * 10 * p.k, y = p.y - 26 * p.k; ctx.beginPath(); for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 5 + Math.cos(a + .6) * 1.4, y + Math.sin(a) * 5 + Math.sin(a + .6) * 1.4); ctx.lineTo(x + Math.cos(a) * 6.4, y + Math.sin(a) * 6.4); } ctx.fill(); });
    if (filhotes) {
      const pai = P[0], n = nariz(pai), d = pai.dir, hx = n.x + d * 6, hy = n.y - 20 * pai.k;
      const halo = ctx.createRadialGradient(hx, hy, 2, hx, hy, 30); halo.addColorStop(0, 'rgba(255,248,210,.32)'); halo.addColorStop(1, 'rgba(255,248,210,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(hx, hy, 30, 0, 7); ctx.fill();
      FIL.forEach(f => { const tx = hx + f.ox + Math.sin(t * 1.1 + f.f) * 2.2, ty = Math.max(AG + 5, hy + f.oy + Math.cos(t * 1.3 + f.f) * 1.6); f.x += (tx - f.x) * .08; f.y += (ty - f.y) * .08;
        ctx.save(); ctx.translate(f.x, f.y); ctx.scale(d, 1); ctx.rotate(Math.sin(t * 2 + f.f) * .08); ctx.globalAlpha = .95;
        const w = Math.sin(t * 16 + f.f) * .7;
        ctx.fillStyle = '#4A3424'; ctx.strokeStyle = '#1E140C'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(4, 0); ctx.quadraticCurveTo(2, -2, -2, -1.2); ctx.lineTo(-5.4, -1.8 + w); ctx.lineTo(-5, 0); ctx.lineTo(-5.4, 1.8 + w); ctx.lineTo(-2, 1.2); ctx.quadraticCurveTo(2, 2, 4, 0); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,230,180,.55)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(2.6, .9); ctx.lineTo(-2, .9); ctx.stroke();
        ctx.fillStyle = '#F4E6B0'; ctx.beginPath(); ctx.arc(2.2, -.5, .75, 0, 7); ctx.fill(); ctx.fillStyle = '#100C08'; ctx.beginPath(); ctx.arc(2.4, -.5, .4, 0, 7); ctx.fill(); ctx.restore(); });
    }
    if (hintG && fase === 'filhotes') { const n = nariz(P[0]); hintG.setAttribute('transform', `translate(${F(n.x)} ${F(n.y - 24)})`); }
    ctx.globalAlpha = 1;
  });
  let ultB = 0, ultNono = performance.now();
  (function vida(t){ if (!vivo) return; anda(t); agenda(t);
    if (t - ultB > 1600) { ultB = t; bolhas(sorte(300, 600), 456, 1); }
    if (fase === 'contar' && contados >= 2 && t - ultNono > 16000 && !P.some(p => p.est === 'boia')) { ultNono = t; nonoSobe(false); }
    requestAnimationFrame(vida); })(performance.now());
  chip('Pirarucus: 0/5');
  api.diz('Oi, eu sou a Nonô, uma peixe-boi-da-amazônia! Aqui, na várzea do Amazonas, a comunidade ribeirinha cuida dos lagos.');
  api.diz('O pirarucu sobe para respirar. Toque em cada pirarucu quando ele boiar!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
