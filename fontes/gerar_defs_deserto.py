# figurinhas e capa dos Desertos (executado dentro de gerar_defs2.py)
random.seed(73)
def _lg(i, cores, x2=0, y2=1):
    n = len(cores) - 1
    return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">' + ''.join(f'<stop offset="{k / n:.2f}" stop-color="{c}"/>' for k, c in enumerate(cores)) + '</linearGradient>'

# feneco
FECO = '''<path d="M14 -6 C42 -2 60 -18 54 -42 C50 -56 36 -54 38 -42 C42 -28 32 -18 12 -18Z" fill="url(#deFgFcP)" stroke="#9A6430" stroke-width="2" stroke-linejoin="round"/>
  <path d="M54 -42 C50 -56 36 -54 38 -42 C42 -47 50 -48 54 -42Z" fill="#5A3420" stroke="#3A1E10" stroke-width="1.4"/>
  <path d="M-22 -2 C-27 -24 -18 -46 0 -48 C18 -46 27 -24 22 -2Z" fill="url(#deFgFcP)" stroke="#9A6430" stroke-width="2"/>
  <path d="M-10 -4 C-13 -20 -7 -36 0 -38 C7 -36 13 -20 10 -4Z" fill="#FFF4E2"/>
  <path d="M-12 -4 V-18 M10 -4 V-18" stroke="#E2B07A" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-12" cy="-2" rx="7" ry="4" fill="#FFF4E2" stroke="#9A6430" stroke-width="1.4"/><ellipse cx="10" cy="-2" rx="7" ry="4" fill="#FFF4E2" stroke="#9A6430" stroke-width="1.4"/>
  <path d="M-10 -64 C-26 -80 -38 -104 -34 -120 C-20 -112 -6 -94 -1 -74Z" fill="url(#deFgFcP)" stroke="#9A6430" stroke-width="2" stroke-linejoin="round"/><path d="M-11 -70 C-22 -84 -30 -100 -30 -112 C-20 -103 -10 -90 -6 -76Z" fill="url(#deFgFcO)"/>
  <path d="M10 -64 C26 -80 38 -104 34 -120 C20 -112 6 -94 1 -74Z" fill="url(#deFgFcP)" stroke="#9A6430" stroke-width="2" stroke-linejoin="round"/><path d="M11 -70 C22 -84 30 -100 30 -112 C20 -103 10 -90 6 -76Z" fill="url(#deFgFcO)"/>
  <path d="M-14 -76 C-20 -84 -24 -92 -26 -100 M14 -76 C20 -84 24 -92 26 -100" stroke="#FFF4E2" stroke-width="1.4" fill="none" opacity=".8"/>
  <path d="M-22 -62 C-24 -78 -10 -84 0 -84 C10 -84 24 -78 22 -62 C20 -50 9 -44 0 -44 C-9 -44 -20 -50 -22 -62Z" fill="url(#deFgFcP)" stroke="#9A6430" stroke-width="2"/>
  <path d="M-16 -74 C-10 -80 -2 -81 6 -79" stroke="#FFE6BE" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M-10 -55 C-8 -62 8 -62 10 -55 C8 -46 -8 -46 -10 -55Z" fill="#FFF4E2"/>
  <ellipse cx="-14" cy="-56" rx="4" ry="2.4" fill="#FF9A9A" opacity=".55"/><ellipse cx="14" cy="-56" rx="4" ry="2.4" fill="#FF9A9A" opacity=".55"/>
  <ellipse cx="-8.5" cy="-65" rx="4.4" ry="5.4" fill="#1E120C"/><ellipse cx="8.5" cy="-65" rx="4.4" ry="5.4" fill="#1E120C"/><circle cx="-7" cy="-67" r="1.7" fill="#fff"/><circle cx="10" cy="-67" r="1.7" fill="#fff"/><circle cx="-9.6" cy="-63" r=".7" fill="#fff" opacity=".8"/><circle cx="7.4" cy="-63" r=".7" fill="#fff" opacity=".8"/>
  <ellipse cx="0" cy="-56" rx="3.4" ry="2.4" fill="#1E120C"/><circle cx="-1" cy="-56.8" r=".9" fill="#fff" opacity=".8"/>
  <path d="M0 -53.6 v2 M0 -51.6 q-3 2.4 -5 .4 M0 -51.6 q3 2.4 5 .4" stroke="#5A3420" stroke-width="1.2" fill="none" stroke-linecap="round"/>'''
S.append(f'''<symbol id="f-feneco" viewBox="0 0 120 120">
  <defs>{_lg('deFgFcP', ['#FBE2B6', '#EDBE80', '#D9A060'])}{_lg('deFgFcO', ['#FFD0C4', '#F49A9A'])}{_lg('deFgFcA', ['#F8D696', '#E8B068'])}</defs>
  <ellipse cx="62" cy="113" rx="50" ry="6" fill="#5A2E10" opacity=".18"/>
  <path d="M10 114 C24 102 44 100 62 102 C82 100 100 104 112 114Z" fill="url(#deFgFcA)" stroke="#C98A44" stroke-width="1.2"/>
  <path d="M30 106 q6 -2 12 0 M76 106 q6 -2 12 0" stroke="#C98A44" stroke-width="1" fill="none"/>
  <g transform="translate(54 108) scale(.82)">{FECO}</g>
</symbol>''')

# besouro-da-neblina na crista da duna
S.append(f'''<symbol id="f-besouro" viewBox="0 0 120 90">
  <defs>{_lg('deFgBe', ['#5A5070', '#2A2236', '#16101C'])}<linearGradient id="deFgBeD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC48A"/><stop offset="1" stop-color="#E07444"/></linearGradient></defs>
  <path d="M0 90 V70 C30 62 60 54 84 52 C100 52 112 58 120 64 V90Z" fill="url(#deFgBeD)"/>
  <path d="M0 70 C30 62 60 54 84 52 C100 52 112 58 120 64" stroke="#FFE6C0" stroke-width="2" fill="none"/>
  <g fill="#E6EEF8" opacity=".9"><ellipse cx="16" cy="24" rx="16" ry="6"/><ellipse cx="32" cy="18" rx="12" ry="5"/><ellipse cx="10" cy="36" rx="10" ry="4"/></g><g stroke="#B8CCE6" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M30 30 q6 -2 12 0 M22 44 q6 -2 12 0"/></g>
  <g transform="translate(66 62) scale(1.3) rotate(-24)">
    <ellipse cx="0" cy="1" rx="22" ry="3" fill="#3A1418" opacity=".25"/>
    <g stroke="#1A1420" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M-10 -8 L-20 -2 L-24 1"/><path d="M-2 -7 L-6 0 L-8 1"/><path d="M6 -7 L10 0 L13 1"/><path d="M12 -9 L24 -2 L30 1"/></g>
    <path d="M-22 -14 q-6 -8 -12 -7 M-21 -12 q-8 -3 -12 1" stroke="#1A1420" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="-15" rx="17" ry="10.5" fill="url(#deFgBe)" stroke="#0C0810" stroke-width="1.4"/>
    <g fill="#7A6E90" opacity=".75"><circle cx="0" cy="-20" r="1.3"/><circle cx="8" cy="-22" r="1.3"/><circle cx="15" cy="-18" r="1.2"/><circle cx="4" cy="-14" r="1.1"/><circle cx="12" cy="-12" r="1.1"/></g>
    <path d="M-6 -21 C0 -26 10 -26 17 -21" stroke="#C9BEE6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="-13" cy="-13" rx="6.5" ry="6" fill="#2A2234" stroke="#0C0810" stroke-width="1.3"/>
    <circle cx="-21" cy="-11" r="5.6" fill="#2A2234" stroke="#0C0810" stroke-width="1.3"/>
    <circle cx="-22.4" cy="-12.6" r="2.6" fill="#fff"/><circle cx="-23" cy="-12.4" r="1.5" fill="#120E18"/><circle cx="-23.5" cy="-13.1" r=".6" fill="#fff"/>
    <path d="M-25 -7.6 q1.4 1.2 3 .4" stroke="#C9BEE6" stroke-width="1" fill="none" stroke-linecap="round"/>
    {''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#BFE8FF" stroke="#2E7BC4" stroke-width=".7"/><circle cx="{x - r * .35:.1f}" cy="{y - r * .35:.1f}" r="{r * .3:.1f}" fill="#fff"/>' for x, y, r in [(12, -25, 2.6), (3, -26.5, 2.2), (16, -18, 2), (-5, -22, 2.4), (-19, -6, 1.8)])}
  </g>
</symbol>''')

# dromedário
S.append(f'''<symbol id="f-dromedario" viewBox="0 0 140 130">
  <defs>{_lg('deFgDr', ['#F0C080', '#D9A060', '#C08440'])}{_lg('deFgDrN', ['#E8B46E', '#D29A56'], 1, 0)}</defs>
  <ellipse cx="80" cy="124" rx="50" ry="5" fill="#5A2E10" opacity=".2"/>
  <g transform="translate(84 120) scale(.68)">
    <g stroke-linecap="round" fill="none"><path d="M30 -56 L33 -28 L31 0" stroke="#8A5A2A" stroke-width="9"/><path d="M-28 -56 L-30 -28 L-29 0" stroke="#8A5A2A" stroke-width="9"/></g>
    <path d="M50 -78 C58 -66 60 -54 58 -40" stroke="#7A4A1E" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M58 -42 l-3 10 l6 -2 l1 -9Z" fill="#4A2A12"/>
    <path d="M-40 -74 Q-58 -98 -88 -134" stroke="#6E3E16" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-40 -74 Q-58 -98 -88 -134" stroke="url(#deFgDrN)" stroke-width="17" fill="none" stroke-linecap="round"/>
    <path d="M-80 -147 C-91 -153 -106 -151 -112 -142 C-116 -136 -114 -129 -107 -127 C-99 -125 -89 -129 -81 -131 C-75 -135 -75 -143 -80 -147Z" fill="url(#deFgDr)" stroke="#6E3E16" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-82 -148 l1 -9 l6 6Z" fill="#C88A4A" stroke="#6E3E16" stroke-width="1.4" stroke-linejoin="round"/>
    <ellipse cx="-93" cy="-142" rx="4.2" ry="3.6" fill="#fff" stroke="#6E3E16" stroke-width=".8"/><circle cx="-94" cy="-141.6" r="2.4" fill="#1E120C"/><circle cx="-94.8" cy="-142.6" r=".9" fill="#fff"/>
    <path d="M-97.4 -145 C-95 -147.6 -90 -147.6 -88.6 -145" stroke="#5A3010" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-96 -146.4 l-1.6 -3 M-93 -147.4 l0 -3.2 M-90 -146.4 l1.4 -2.8" stroke="#3A1E0C" stroke-width="1" stroke-linecap="round"/>
    <path d="M-108 -139 q1.6 -1.6 3 0" stroke="#3A1E0C" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M-112 -132 q5 2.6 10 0" stroke="#6E3E16" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-102" cy="-135" rx="3" ry="1.8" fill="#FF9A8A" opacity=".5"/>
    <path d="M-50 -66 C-54 -86 -30 -96 -12 -94 C-8 -126 30 -128 40 -96 C54 -90 60 -78 56 -64 C52 -50 30 -48 0 -50 C-30 -50 -48 -54 -50 -66Z" fill="url(#deFgDr)" stroke="#6E3E16" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M-40 -58 C-20 -52 20 -52 50 -58 C46 -50 30 -48 0 -50 C-24 -50 -38 -52 -40 -58Z" fill="#B07A40" opacity=".6"/>
    <path d="M-4 -106 C2 -118 22 -120 30 -106" stroke="#FFE2B0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>
    <g stroke-linecap="round" fill="none"><path d="M38 -56 L42 -28 L40 0" stroke="#6E3E16" stroke-width="12"/><path d="M38 -56 L42 -28 L40 0" stroke="#D2A060" stroke-width="8"/><path d="M-20 -56 L-23 -28 L-21 0" stroke="#6E3E16" stroke-width="12"/><path d="M-20 -56 L-23 -28 L-21 0" stroke="#D2A060" stroke-width="8"/></g>
    <g fill="#B98048" stroke="#6E3E16" stroke-width="1.2"><ellipse cx="41" cy="-28" rx="5" ry="4"/><ellipse cx="-23" cy="-28" rx="5" ry="4"/></g>
    <g fill="#7A4A1E"><ellipse cx="40" cy="0" rx="7" ry="3"/><ellipse cx="-21" cy="0" rx="7" ry="3"/></g>
  </g>
</symbol>''')

# cacto-saguaro com o pica-pau na janelinha
_costelas = ''.join(f'<path d="M{x} {186 if x != 400 else 180} V446"/>' for x in (384, 392, 400, 408, 416)) + ''.join(f'<path d="M{x} 244 V318"/>' for x in (325, 333, 341)) + ''.join(f'<path d="M{x} 206 V280"/>' for x in (459, 467, 475))
_espinhos = ''.join(f'<circle cx="{x}" cy="{196 + k * 23 + (8 if x % 16 else 0)}" r="1.4"/>' for x in (384, 392, 400, 408, 416) for k in range(11))
_flor = lambda x, y: f'<g transform="translate({x} {y})">' + ''.join(f'<ellipse cx="0" cy="-7" rx="4.6" ry="7" fill="#FFFFFF" stroke="#C9B8A0" stroke-width="1" transform="rotate({a})"/>' for a in range(0, 360, 60)) + '<circle r="4" fill="#FFD447" stroke="#B88A08" stroke-width="1"/></g>'
S.append(f'''<symbol id="f-saguaro" viewBox="0 0 100 130">
  <defs><linearGradient id="deFgSa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2A7A3A"/><stop offset=".3" stop-color="#9ADE70"/><stop offset=".6" stop-color="#4EB050"/><stop offset="1" stop-color="#1A5A2A"/></linearGradient>{_lg('deFgSaC', ['#F2D2A0', '#D9A86A'])}</defs>
  <ellipse cx="50" cy="124" rx="40" ry="5" fill="#5A2E10" opacity=".2"/>
  <path d="M8 126 C20 116 38 114 50 116 C64 114 82 116 94 126Z" fill="url(#deFgSaC)" stroke="#B8844A" stroke-width="1.2"/>
  <g transform="translate(-110 -59) scale(.4)">
    <path d="M377 352 C348 354 316 346 316 316 V250 C316 236 350 236 350 250 V310 C350 322 362 326 377 324Z" fill="url(#deFgSa)" stroke="#1E4A1E" stroke-width="3" stroke-linejoin="round"/>
    <path d="M423 314 C452 316 484 308 484 278 V212 C484 198 450 198 450 212 V272 C450 284 438 288 423 286Z" fill="url(#deFgSa)" stroke="#1E4A1E" stroke-width="3" stroke-linejoin="round"/>
    <rect x="374" y="176" width="52" height="276" rx="26" fill="url(#deFgSa)" stroke="#1E4A1E" stroke-width="3.2"/>
    <g stroke="#1E5420" stroke-width="2.2" opacity=".55" fill="none">{_costelas}</g>
    <g fill="#FFF4C8">{_espinhos}</g>
    <path d="M382 196 C384 186 392 180 400 179" stroke="#E6F6B0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    {_flor(392, 178)}{_flor(410, 182)}{_flor(468, 200)}{_flor(334, 238)}
    <ellipse cx="400" cy="300" rx="12" ry="15" fill="#2A1A0E" stroke="#5E3A18" stroke-width="2.4"/>
    <circle cx="398" cy="302" r="8.6" fill="#E8D2A8" stroke="#5A4A3A" stroke-width="1.8"/><path d="M391 296 C394 290 402 290 406 294 C402 297 395 297 391 296Z" fill="#E5392C"/>
    <circle cx="395" cy="302" r="2.6" fill="#12121A"/><circle cx="394" cy="301" r="1" fill="#fff"/><path d="M390 305 L380 307 L390 309Z" fill="#3A3A42"/>
  </g>
</symbol>''')

# capa
S.append(f'''<symbol id="capa-deserto" viewBox="0 0 170 110">
  <defs>{ceu('cpDeC', '#6A8AD8', '#FFE0A6')}<radialGradient id="cpDeG"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".9"/><stop offset=".5" stop-color="#FFE08A" stop-opacity=".4"/><stop offset="1" stop-color="#FFD070" stop-opacity="0"/></radialGradient><radialGradient id="cpDeS" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#FFD860"/><stop offset="1" stop-color="#FFA830"/></radialGradient>
  <linearGradient id="cpDeL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC48A"/><stop offset="1" stop-color="#E07444"/></linearGradient><linearGradient id="cpDeSo" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#C2604E"/><stop offset="1" stop-color="#8A3A44"/></linearGradient>
  {ceu('cpDeA', '#F8D696', '#E8B068')}{ceu('cpDeF', '#F4CDA6', '#EAB894')}{ceu('cpDeAg', '#9ADFFF', '#3E9AE8')}</defs>
  <rect width="170" height="110" fill="url(#cpDeC)"/>
  <circle cx="132" cy="24" r="24" fill="url(#cpDeG)"/><circle cx="132" cy="24" r="11" fill="url(#cpDeS)" stroke="#F0A030" stroke-width="1"/>
  <use href="#nuvem" x="30" y="10" width="30" height="14" style="color:#fff" opacity=".8"/>
  <path d="M0 60 C20 50 40 46 60 52 C80 44 110 42 130 50 C150 46 160 48 170 50 V70 H0Z" fill="url(#cpDeF)"/>
  <path d="M60 52 C70 48 78 46 86 46 M130 50 C140 46 150 45 158 46" stroke="#FFF0DC" stroke-width="1" fill="none"/>
  <path d="M100 66 C120 58 150 58 170 62 V80 H100Z" fill="#F6C27C"/>
  <path d="M0 96 C20 86 44 64 62 50 C68 46 74 44 80 44 C86 46 92 52 100 58 C120 72 150 80 170 84 V110 H0Z" fill="url(#cpDeL)"/>
  <path d="M0 96 C20 86 44 64 62 50 C68 46 74 44 80 44 C76 62 70 86 66 110 H0Z" fill="url(#cpDeSo)"/>
  <path d="M0 96 C20 86 44 64 62 50 C68 46 74 44 80 44 C86 46 92 52 100 58 C120 72 150 80 170 84" stroke="#FFE6C0" stroke-width="1.2" fill="none"/>
  <g fill="#fff" opacity=".55"><ellipse cx="18" cy="56" rx="24" ry="6"/><ellipse cx="40" cy="50" rx="14" ry="4"/></g>
  <svg x="66" y="33" width="18" height="13" viewBox="0 0 120 90"><use class="sem" href="#f-besouro"/></svg>
  <svg x="12" y="52" width="26" height="34" viewBox="0 0 100 130"><use class="sem" href="#f-saguaro"/></svg>
  <ellipse cx="136" cy="94" rx="26" ry="5" fill="url(#cpDeAg)" stroke="#2E7BC4" stroke-width=".8"/><path d="M124 93 q6 -2 12 0" stroke="#EAF8FF" stroke-width="1" fill="none"/>
  <path d="M150 92 Q150 74 156 60" stroke="#6E4220" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M150 92 Q150 74 156 60" stroke="#C99050" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g fill="none" stroke-linecap="round" stroke-width="2.6">{''.join(f'<path d="M156 60 Q{156 + math.cos(a) * 9:.1f} {56 + math.sin(a) * 5:.1f} {156 + math.cos(a) * 17:.1f} {62 + math.sin(a) * 6 + abs(math.cos(a)) * 5:.1f}" stroke="{c}"/>' for a, c in [(-2.9, '#4E9A3A'), (-2.2, '#7CC24E'), (-1.5, '#2E8A5A'), (-.8, '#7CC24E'), (-.2, '#4E9A3A'), (3.4, '#2E8A5A')])}</g>
  <g fill="#E07A2A">{''.join(f'<circle cx="{156 + dx}" cy="{64 + dy}" r="1.3"/>' for dx, dy in [(-2, 0), (1, 1), (0, 3)])}</g>
  <svg x="98" y="58" width="40" height="38" viewBox="0 0 140 130"><use class="sem" href="#f-dromedario"/></svg>
  <svg x="66" y="62" width="44" height="44" viewBox="0 0 120 120"><use class="sem" href="#f-feneco"/></svg>
</symbol>''')
