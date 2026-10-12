# figurinhas e capas do Oceano e da Antártica (executado dentro de gerar_defs2.py)
random.seed(37)

# tartaruga-marinha
escudos = ''
for cx, cy, r in [(70, 50, 11), (52, 44, 9), (88, 44, 9), (56, 60, 9), (84, 60, 9), (70, 34, 8), (70, 66, 8)]:
    pts = ' '.join(f'{cx + math.cos(a) * r:.1f},{cy + math.sin(a) * r * .8:.1f}' for a in [i * math.pi / 3 for i in range(6)])
    escudos += f'<polygon points="{pts}" fill="#8A6A2E" stroke="#4E3A14" stroke-width="1.3" opacity=".75"/>'
S.append(f'''<symbol id="f-tartaruga" viewBox="0 0 150 110">
  <defs><radialGradient id="ttCasco" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#C9A050"/><stop offset=".6" stop-color="#9A7A36"/><stop offset="1" stop-color="#6E5420"/></radialGradient>
  <linearGradient id="ttPele" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD07A"/><stop offset="1" stop-color="#5E9A4A"/></linearGradient></defs>
  <ellipse cx="74" cy="104" rx="46" ry="3.5" fill="#0A1440" opacity=".16"/>
  <path d="M94 36 C90 18 74 4 52 2 C58 14 72 28 84 40Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M94 64 C90 82 74 96 52 98 C58 86 72 72 84 60Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M84 30 C72 16 62 10 56 8 M84 70 C72 84 62 90 56 92" stroke="#3E7A2A" stroke-width="1.2" fill="none" opacity=".6"/>
  <path d="M46 40 C36 32 26 30 18 32 C22 40 32 46 42 48Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M46 60 C36 68 26 70 18 68 C22 60 32 54 42 52Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M36 50 C36 30 52 20 70 20 C92 20 108 32 108 50 C108 70 92 80 70 80 C50 80 36 70 36 50Z" fill="url(#ttCasco)" stroke="#4E3A14" stroke-width="2"/>
  {escudos}
  <path d="M46 36 C54 28 64 25 76 26" stroke="#F0D88A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M106 44 C116 38 130 38 138 44 C144 50 140 58 130 60 C120 62 110 58 106 54Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.8"/>
  <path d="M118 44 l4 3 M126 42 l2 4 M114 52 l4 1" stroke="#3E7A2A" stroke-width="1.4" stroke-linecap="round"/>
  <circle cx="130" cy="47" r="3.4" fill="#12121A"/><circle cx="131" cy="46" r="1.1" fill="#fff"/>
  <path d="M132 55 q4 1 7 -2" stroke="#2E5A22" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M36 52 L28 54 L34 48Z" fill="url(#ttPele)" stroke="#2E5A22" stroke-width="1.2"/>
</symbol>''')

# baleia-jubarte
S.append('''<symbol id="f-jubarte" viewBox="0 0 170 100">
  <defs><linearGradient id="jbCorpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E6A9A"/><stop offset=".6" stop-color="#2E4A7A"/><stop offset="1" stop-color="#1E3460"/></linearGradient></defs>
  <path d="M28 46 C16 36 8 24 6 14 C14 20 22 24 30 30 C30 22 34 14 40 10 C40 22 38 34 34 44Z" fill="url(#jbCorpo)" stroke="#12234A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M30 48 C50 30 90 24 124 30 C148 34 164 46 164 58 C164 70 146 76 120 76 C86 76 54 70 30 48Z" fill="url(#jbCorpo)" stroke="#12234A" stroke-width="2"/>
  <path d="M84 72 C110 78 140 76 158 66 C150 76 126 82 100 80 C92 80 88 76 84 72Z" fill="#E9EEF6" stroke="#12234A" stroke-width="1.4"/>
  <path d="M104 74 L150 68 M100 70 L154 63 M108 77 L146 72" stroke="#9AA6C0" stroke-width="1.2"/>
  <path d="M96 68 C92 84 80 96 64 98 C70 88 78 78 86 66Z" fill="#E9EEF6" stroke="#12234A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M68 94 l4 -3 M74 90 l4 -3 M80 84 l3 -3" stroke="#4E6A9A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M78 30 l4 -4 l4 4" fill="#2E4A7A" stroke="#12234A" stroke-width="1.2"/>
  <g fill="#7A8EB8"><circle cx="146" cy="44" r="2"/><circle cx="138" cy="38" r="1.8"/><circle cx="154" cy="50" r="1.8"/><circle cx="130" cy="36" r="1.6"/></g>
  <circle cx="140" cy="58" r="2.6" fill="#0A1430"/><circle cx="141" cy="57" r=".9" fill="#fff"/>
  <path d="M60 38 C80 30 104 28 124 32" stroke="#7A92C0" stroke-width="3" fill="none" stroke-linecap="round"/>
</symbol>''')

# coral
ramos = ''
for x0, cor, esc in [(30, '#FF7A5A', '#B83A20'), (62, '#FF9AC8', '#B8406E'), (46, '#FFB347', '#B8700E')]:
    ramos += f'<g stroke="{esc}" stroke-width="9" stroke-linecap="round" fill="none"><path d="M{x0} 84 C{x0} 64 {x0 - 10} 54 {x0 - 14} 36 M{x0} 70 C{x0 + 8} 58 {x0 + 14} 50 {x0 + 16} 32 M{x0 - 6} 56 C{x0 - 2} 46 {x0} 38 {x0 + 2} 26"/></g><g stroke="{cor}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M{x0} 84 C{x0} 64 {x0 - 10} 54 {x0 - 14} 36 M{x0} 70 C{x0 + 8} 58 {x0 + 14} 50 {x0 + 16} 32 M{x0 - 6} 56 C{x0 - 2} 46 {x0} 38 {x0 + 2} 26"/></g><g fill="#FFF2E0">' + ''.join(f'<circle cx="{x0 + dx}" cy="{y}" r="1.2"/>' for dx, y in [(-14, 38), (16, 34), (2, 28), (-6, 60), (8, 62)]) + '</g>'
S.append(f'''<symbol id="f-coral" viewBox="0 0 100 100">
  <ellipse cx="50" cy="94" rx="40" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M8 92 C10 80 22 76 34 80 C40 72 56 72 62 80 C74 76 90 80 92 92Z" fill="#C9B88A" stroke="#7A6A3E" stroke-width="1.6"/>
  {ramos}
  <path d="M60 90 C60 76 70 70 80 70 C90 70 96 78 94 90Z" fill="#7CCB5A" stroke="#3E7A22" stroke-width="1.6"/>
  <path d="M66 86 q4 -8 8 0 q4 -8 8 0 q4 -6 8 0 M70 78 q4 -5 8 0 q4 -5 8 0" stroke="#3E7A22" stroke-width="1.4" fill="none"/>
  <circle cx="22" cy="20" r="2.4" fill="none" stroke="#BFE6FF" stroke-width="1.2"/><circle cx="80" cy="30" r="3" fill="none" stroke="#BFE6FF" stroke-width="1.2"/>
</symbol>''')

# budião-azul
escamas = ''.join(f'<path d="M{x} {y} q4 4 0 8" stroke="#1B56C4" stroke-width="1" fill="none" opacity=".6"/>' for x in range(36, 84, 8) for y in (30, 40))
S.append(f'''<symbol id="f-budiao" viewBox="0 0 120 80">
  <defs><linearGradient id="bdAzul" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5AB8FF"/><stop offset="1" stop-color="#1B6ED6"/></linearGradient></defs>
  <path d="M22 40 L4 24 L8 40 L4 56Z" fill="url(#bdAzul)" stroke="#0E3A8A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M20 40 C26 22 50 14 78 18 C98 22 112 32 114 42 C112 52 98 60 78 62 C50 66 26 58 20 40Z" fill="url(#bdAzul)" stroke="#0E3A8A" stroke-width="2"/>
  {escamas}
  <path d="M44 20 C54 8 70 8 80 18Z" fill="#3E8AE6" stroke="#0E3A8A" stroke-width="1.4"/>
  <path d="M50 60 C56 70 66 70 72 62Z" fill="#3E8AE6" stroke="#0E3A8A" stroke-width="1.4"/>
  <path d="M72 42 C76 48 82 50 88 48" stroke="#0E3A8A" stroke-width="1.4" fill="none"/>
  <path d="M106 36 C112 38 116 42 114 46 C110 48 106 46 104 44Z" fill="#E9F2FF" stroke="#0E3A8A" stroke-width="1.4"/>
  <circle cx="96" cy="34" r="4.4" fill="#fff" stroke="#0E3A8A" stroke-width="1.2"/><circle cx="97" cy="34" r="2.4" fill="#12121A"/><circle cx="97.8" cy="33.2" r=".8" fill="#fff"/>
  <path d="M34 28 C46 22 60 20 74 22" stroke="#BFE6FF" stroke-width="2.6" fill="none" stroke-linecap="round"/>
</symbol>''')

# pinguim-de-adélia
S.append('''<symbol id="f-pinguim" viewBox="0 0 90 130">
  <defs><linearGradient id="pgBarriga" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE6F2"/></linearGradient></defs>
  <ellipse cx="45" cy="126" rx="28" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M30 118 l-10 6 h16Z M58 118 l10 6 h-16Z" fill="#F28A5A" stroke="#8A3E1A" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M18 70 C16 40 26 22 45 22 C64 22 74 40 72 70 C70 100 62 120 45 120 C28 120 20 100 18 70Z" fill="#1E2236" stroke="#0A0C18" stroke-width="2"/>
  <path d="M28 64 C28 46 36 40 45 40 C54 40 62 46 62 64 C62 92 56 112 45 112 C34 112 28 92 28 64Z" fill="url(#pgBarriga)" stroke="#9AA6C0" stroke-width="1"/>
  <path d="M18 62 C8 72 6 88 10 98 C16 90 20 80 22 70Z" fill="#1E2236" stroke="#0A0C18" stroke-width="1.6"/>
  <path d="M72 62 C82 72 84 88 80 98 C74 90 70 80 68 70Z" fill="#1E2236" stroke="#0A0C18" stroke-width="1.6"/>
  <circle cx="45" cy="26" r="18" fill="#1E2236" stroke="#0A0C18" stroke-width="2"/>
  <circle cx="38" cy="24" r="5.4" fill="#fff"/><circle cx="52" cy="24" r="5.4" fill="#fff"/>
  <circle cx="38.6" cy="24.4" r="2.6" fill="#12121A"/><circle cx="51.4" cy="24.4" r="2.6" fill="#12121A"/><circle cx="39.4" cy="23.4" r=".9" fill="#fff"/><circle cx="52.2" cy="23.4" r=".9" fill="#fff"/>
  <path d="M41 32 L45 40 L49 32Z" fill="#E86A3A" stroke="#8A3E1A" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M30 16 C34 10 42 8 48 9" stroke="#4E5A7A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="36" cy="40" rx="3" ry="1.6" fill="#FF9AB0" opacity=".7"/><ellipse cx="54" cy="40" rx="3" ry="1.6" fill="#FF9AB0" opacity=".7"/>
</symbol>''')

# foca-de-weddell
manchas = ''.join(f'<ellipse cx="{R(40, 120):.0f}" cy="{R(38, 62):.0f}" rx="{R(2, 4.5):.1f}" ry="{R(1.4, 3):.1f}" fill="#4E5A70" opacity=".6"/>' for _ in range(14))
S.append(f'''<symbol id="f-foca" viewBox="0 0 150 90">
  <defs><linearGradient id="fcCorpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA8C0"/><stop offset="1" stop-color="#5E6A84"/></linearGradient></defs>
  <ellipse cx="76" cy="84" rx="62" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M18 66 C8 60 4 52 6 46 C14 50 20 54 24 60 C22 52 24 44 30 40 C32 50 30 60 28 66Z" fill="url(#fcCorpo)" stroke="#2E3A54" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M26 64 C34 44 70 32 104 34 C126 36 140 46 142 58 C144 72 128 80 100 80 C66 80 36 76 26 64Z" fill="url(#fcCorpo)" stroke="#2E3A54" stroke-width="2"/>
  <path d="M40 72 C70 78 110 78 134 70" stroke="#C9D2E2" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  {manchas}
  <path d="M86 70 C84 80 76 84 68 84 C72 78 76 72 80 68Z" fill="url(#fcCorpo)" stroke="#2E3A54" stroke-width="1.6"/>
  <path d="M50 46 C70 38 92 36 112 38" stroke="#C9D2E2" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="128" cy="50" r="3.4" fill="#12121A"/><circle cx="129" cy="49" r="1.1" fill="#fff"/><circle cx="114" cy="52" r="3" fill="#12121A"/><circle cx="114.8" cy="51.2" r="1" fill="#fff"/>
  <ellipse cx="124" cy="60" rx="7" ry="5" fill="#C9D2E2" stroke="#2E3A54" stroke-width="1.2"/><path d="M122 57 q2 2 4 0" stroke="#12121A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M130 60 l12 -2 M130 63 l12 2 M118 60 l-10 -2 M118 63 l-10 2" stroke="#2E3A54" stroke-width=".9"/>
  <path d="M120 66 q4 3 8 0" stroke="#2E3A54" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# krill
S.append('''<symbol id="f-krill" viewBox="0 0 120 70">
  <defs><linearGradient id="krCorpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB08A"/><stop offset="1" stop-color="#F06A3A"/></linearGradient></defs>
  <path d="M18 34 L4 24 L8 36 L4 46Z" fill="#FF9A6A" stroke="#A83A14" stroke-width="1.4" stroke-linejoin="round" opacity=".9"/>
  <path d="M18 36 C24 22 50 16 78 20 C94 22 104 28 106 36 C104 44 92 48 78 48 C50 50 26 48 18 36Z" fill="url(#krCorpo)" stroke="#A83A14" stroke-width="1.8" opacity=".95"/>
  <path d="M34 24 v22 M44 21 v26 M54 20 v28 M64 20 v28" stroke="#C84A1E" stroke-width="1.2" opacity=".7"/>
  <path d="M40 48 l-4 12 M50 48 l-2 12 M60 48 l0 12 M70 48 l2 12 M80 46 l4 10" stroke="#E0552A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M100 30 C110 20 116 12 118 6 M102 32 C112 26 118 22 120 18" stroke="#E0552A" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="96" cy="30" r="5" fill="#12121A"/><circle cx="97.4" cy="28.6" r="1.6" fill="#fff"/>
  <path d="M30 26 C44 20 60 19 74 21" stroke="#FFE0D0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g fill="#7FD0FF" opacity=".8"><circle cx="60" cy="36" r="2"/><circle cx="74" cy="36" r="2"/></g>
</symbol>''')

# baleia-azul
pintas = ''.join(f'<ellipse cx="{R(40, 140):.0f}" cy="{R(30, 50):.0f}" rx="{R(2, 5):.1f}" ry="{R(1, 2.4):.1f}" fill="#9AB4D8" opacity=".55"/>' for _ in range(16))
S.append(f'''<symbol id="f-baleiaazul" viewBox="0 0 170 80">
  <defs><linearGradient id="baCorpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E8EC0"/><stop offset=".7" stop-color="#4A6AA0"/><stop offset="1" stop-color="#34507E"/></linearGradient></defs>
  <path d="M22 40 C12 30 6 20 6 12 C14 18 20 24 26 30 C26 22 30 14 34 10 C36 22 34 32 30 40Z" fill="url(#baCorpo)" stroke="#1E3460" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M26 42 C50 28 100 24 140 30 C156 32 166 40 166 48 C166 58 150 62 128 62 C90 62 50 58 26 42Z" fill="url(#baCorpo)" stroke="#1E3460" stroke-width="2"/>
  {pintas}
  <path d="M100 60 C120 64 146 62 162 54" stroke="#C9D8F0" stroke-width="2.4" fill="none"/>
  <path d="M108 60 L156 56 M112 63 L150 60" stroke="#8AA0C8" stroke-width="1"/>
  <path d="M96 56 C92 66 84 72 76 74 C80 66 84 60 90 54Z" fill="url(#baCorpo)" stroke="#1E3460" stroke-width="1.6"/>
  <path d="M64 32 l3 -4 l3 4" fill="#4A6AA0" stroke="#1E3460" stroke-width="1"/>
  <circle cx="146" cy="44" r="2.4" fill="#0A1430"/><circle cx="146.8" cy="43.2" r=".8" fill="#fff"/>
  <path d="M50 34 C80 26 110 25 136 30" stroke="#A8C0E8" stroke-width="3" fill="none" stroke-linecap="round"/>
</symbol>''')

# capas
cor_ramos = ''.join(f'<path d="M{x} 104 C{x} 96 {x - 4} 92 {x - 6} 84 M{x} 98 C{x + 3} 92 {x + 6} 88 {x + 7} 82" stroke="{e}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M{x} 104 C{x} 96 {x - 4} 92 {x - 6} 84 M{x} 98 C{x + 3} 92 {x + 6} 88 {x + 7} 82" stroke="{c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>' for x, c, e in [(20, '#FF7A5A', '#A83A20'), (30, '#FFB347', '#A8620E'), (128, '#FF9AC8', '#A8406E'), (150, '#C08AFF', '#5E2E9A'), (160, '#FF7A5A', '#A83A20')])
cardume = ''.join(f'<path d="M{x} {y} c3 -2.4 7 -2.4 9 0 c-2 2.4 -6 2.4 -9 0Z M{x} {y} l-3 -2 v4Z" fill="#9FE0FF" stroke="#1B4E9A" stroke-width=".6"/>' for x, y in [(116, 50), (124, 46), (130, 53), (138, 48), (122, 57), (144, 55), (134, 60)])
S.append(f'''<symbol id="capa-oceano" viewBox="0 0 170 110">
  <defs>{ceu('cpOcC','#5DB6F2','#E6F6FF')}<linearGradient id="cpOcM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CC0F2"/><stop offset=".45" stop-color="#2386D6"/><stop offset="1" stop-color="#0E3E86"/></linearGradient><linearGradient id="cpOcR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="cpOcA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E2A8"/><stop offset="1" stop-color="#D2B070"/></linearGradient><radialGradient id="cpOcS" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".6" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A81E"/></radialGradient></defs>
  <rect width="170" height="110" fill="url(#cpOcC)"/>
  <circle cx="28" cy="15" r="15" fill="#FFE27A" opacity=".3"/><circle cx="28" cy="15" r="9" fill="url(#cpOcS)" stroke="#F0A81E" stroke-width="1"/>
  <use href="#nuvem" x="70" y="6" width="34" height="16" style="color:#fff" opacity=".9"/>
  <path d="M118 31 C126 22 140 18 154 19 C162 19 168 22 170 22 V31Z" fill="#6CC04E" stroke="#3E7A2A" stroke-width=".9"/><path d="M118 31 C128 27 140 27 150 31Z" fill="#F2DDA0"/>
  <path d="M160 21 C160 14 161 9 159 5" stroke="#8A6A3E" stroke-width="1.6" fill="none"/><path d="M159 5 c-4 -2 -8 -1 -10 2 c4 -1 6 0 10 -2Z M159 5 c2 -4 6 -5 9 -3 c-4 1 -6 2 -9 3Z M159 5 c-4 -4 -2 -7 1 -8 c-1 3 -1 5 -1 8Z" fill="#4EA83A"/>
  <g transform="translate(58 31)"><path d="M0 -6 H36 C34 0 30 3 24 3 H8 C4 3 1 0 0 -6Z" fill="#D8482A" stroke="#6E1E10" stroke-width="1"/><path d="M18 -6 V-24 L30 -8Z" fill="#FFF8EA" stroke="#B8A27A" stroke-width=".8"/><rect x="4" y="-12" width="12" height="6" fill="#5FB84A" stroke="#2E6A22" stroke-width=".8"/></g>
  <rect y="31" width="170" height="79" fill="url(#cpOcM)"/>
  <path d="M20 31 L36 31 L52 104 L4 104Z M86 31 L98 31 L118 104 L78 104Z" fill="url(#cpOcR)"/>
  <path d="M0 31 {' '.join('q4 -1.6 8 0' for _ in range(22))}" stroke="#E6F6FF" stroke-width="1.4" fill="none"/>
  <g fill="#fff">{''.join(f'<rect x="{x}" y="{y}" width="{w}" height="1" rx=".5"/>' for x, y, w in [(18, 34, 6), (30, 36, 4), (22, 39, 5), (36, 33, 3)])}</g>
  <path d="M110 74 C118 66 140 64 156 68 C164 70 168 74 166 78 C160 82 140 82 124 80 C118 79 112 78 110 74Z M112 74 L102 66 L104 74 L100 80Z" fill="#2E4A7A" opacity=".45"/>
  {cardume}
  <path d="M0 100 C30 94 60 98 90 99 C120 95 150 97 170 95 V110 H0Z" fill="url(#cpOcA)" stroke="#B8965A" stroke-width=".8"/>
  <path d="M8 104 C10 98 20 96 30 98 C36 94 44 96 46 102Z M118 104 C120 98 132 96 144 98 C152 94 162 96 166 102Z" fill="#8A6EA0" stroke="#4E3A62" stroke-width=".9"/>
  {cor_ramos}
  <path d="M40 103 C40 99 46 97 50 99 C54 97 58 100 58 103Z" fill="#9AD07A" stroke="#3E7A2A" stroke-width=".8"/>
  <svg x="40" y="46" width="70" height="51" viewBox="0 0 150 110"><use class="sem" href="#f-tartaruga"/></svg>
  <svg x="132" y="80" width="26" height="17" viewBox="0 0 120 80"><use class="sem" href="#f-budiao"/></svg>
  <g fill="none" stroke="#DFF4FF" stroke-width=".8"><circle cx="112" cy="58" r="1.6"/><circle cx="115" cy="52" r="1.1"/><circle cx="113" cy="47" r=".8"/></g>
</symbol>''')
S.append(f'''<symbol id="capa-antartida" viewBox="0 0 170 110">
  <defs>{ceu('cpAnC','#B8DCF5','#F2FAFF')}{ceu('cpAnM','#3E7EC0','#16386E')}{ceu('cpAnG','#FFFFFF','#CFE6F5')}</defs>
  <rect width="170" height="110" fill="url(#cpAnC)"/>
  <path d="M0 22 C20 14 40 18 60 12 C80 18 110 10 140 16 C150 14 160 16 170 18" stroke="#9AF0C8" stroke-width="4" fill="none" opacity=".5"/>
  <path d="M0 64 L20 34 L36 46 L56 22 L78 50 L96 40 L120 60 V70 H0Z" fill="url(#cpAnG)" stroke="#9ABCD8" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M20 34 L26 50 M56 22 L60 44 M96 40 L100 56" stroke="#A8C8E6" stroke-width="1.2"/>
  <rect y="66" width="170" height="44" fill="url(#cpAnM)"/>
  <path d="M0 66 H90 V74 H0Z" fill="#fff" stroke="#9ABCD8" stroke-width="1"/>
  <path d="M120 62 L130 52 L146 54 L152 66Z" fill="#fff" stroke="#9ABCD8" stroke-width="1" stroke-linejoin="round"/><path d="M118 66 L156 66 L148 92 L126 90Z" fill="#9AD0F0" opacity=".55"/>
  <svg x="24" y="40" width="22" height="32" viewBox="0 0 90 130"><use class="sem" href="#f-pinguim"/></svg>
  <svg x="44" y="46" width="18" height="26" viewBox="0 0 90 130"><use class="sem" href="#f-pinguim"/></svg>
  <svg x="60" y="82" width="64" height="30" viewBox="0 0 170 80"><use class="sem" href="#f-baleiaazul"/></svg>
</symbol>''')
