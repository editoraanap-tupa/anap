# figurinhas e capa da Terra dos diques (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(83)

# cegonha-branca (Pim)
S.append(f'''<symbol id="f-cegonha" viewBox="0 0 100 130">
  <defs>{lg('dqcCorpo', '#FFFFFF', '#D9E2EE')}{lg('dqcAsa', '#4A4A58', '#16161E')}{lg('dqcBico', '#FF8A4A', '#D8401E')}{lg('dqcPerna', '#FF7A48', '#C8401E')}</defs>
  <ellipse cx="46" cy="125" rx="28" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M40 84 L37 104 L40 122 M52 84 L55 104 L52 122" stroke="#8A2A10" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 84 L37 104 L40 122 M52 84 L55 104 L52 122" stroke="url(#dqcPerna)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 122 h12 M48 122 h12" stroke="#C8401E" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M14 70 C6 76 2 84 4 90 C12 86 20 82 26 76Z" fill="url(#dqcAsa)" stroke="#0A0A10" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M18 66 C18 52 32 46 48 48 C64 50 72 60 70 72 C68 84 56 90 42 88 C28 86 18 80 18 66Z" fill="url(#dqcCorpo)" stroke="#5A6787" stroke-width="1.8"/>
  <path d="M16 70 C24 62 40 62 54 70 C48 80 34 86 22 84 C16 82 14 76 16 70Z" fill="url(#dqcAsa)" stroke="#0A0A10" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M22 74 q8 -4 16 -2 M24 79 q8 -3 14 -1" stroke="#6A6A7A" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M26 56 C32 50 42 49 50 51" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M60 56 C64 46 58 38 60 30" stroke="#5A6787" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M60 56 C64 46 58 38 60 30" stroke="url(#dqcCorpo)" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="62" cy="24" r="10" fill="url(#dqcCorpo)" stroke="#5A6787" stroke-width="1.8"/>
  <path d="M69 22 C80 24 90 30 98 38 C88 36 78 32 69 29Z" fill="url(#dqcBico)" stroke="#8A2A10" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M70 26 C80 29 88 33 96 37" stroke="#8A2A10" stroke-width="1" fill="none"/>
  <path d="M72 23 C80 25 86 28 90 31" stroke="#FFD0B0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <circle cx="64" cy="21" r="4" fill="#3A3A46"/><circle cx="64.4" cy="21.2" r="2.6" fill="#12121A"/><circle cx="65.4" cy="20" r="1.1" fill="#fff"/>
  <ellipse cx="60" cy="29" rx="3.4" ry="1.8" fill="#FF9AB0" opacity=".6"/>
  <path d="M55 17 q5 -4 11 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>''')

# moinho de polder
pas = ''
for a in (20, 110, 200, 290):
    pas += f'''<g transform="rotate({a} 50 40)"><path d="M50 40 L50 8" stroke="#6E2A18" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M51.5 36 L51.5 9 L61 9 L61 36Z" fill="url(#dqmVela)" stroke="#8E3A22" stroke-width="1.3"/>
    <path d="M51.5 30 H61 M51.5 24 H61 M51.5 18 H61 M51.5 13 H61 M56.2 9 V36" stroke="#B8503A" stroke-width=".9"/></g>'''
S.append(f'''<symbol id="f-moinho" viewBox="0 0 100 130">
  <defs>{lg('dqmPalha', '#8E8A6A', '#5A5640')}{lg('dqmTijolo', '#C9674A', '#8E3A26')}{lg('dqmVela', '#FFF8EA', '#EADBC0')}{lg('dqmChao', '#8CD06A', '#4E9A3A')}{lg('dqmCapa', '#3E8A5A', '#1E5A3A')}</defs>
  <ellipse cx="50" cy="125" rx="40" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M8 124 C14 112 30 108 50 108 C70 108 86 112 92 124Z" fill="url(#dqmChao)" stroke="#2E6A22" stroke-width="1.6"/>
  {capim(14, 86, 116, 18, '#2E6A22', (3, 6), 1.2)}
  <path d="M34 112 L36 92 H64 L66 112Z" fill="url(#dqmTijolo)" stroke="#5E2414" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M36 98 H64 M35 104 H65 M42 92 V98 M52 92 V98 M60 92 V98 M40 98 V104 M48 98 V104 M58 98 V104 M44 104 V112 M54 104 V112" stroke="#8E3A26" stroke-width=".8" opacity=".8"/>
  <path d="M46 112 V102 C46 98 54 98 54 102 V112Z" fill="#2E5A3A" stroke="#1E3A24" stroke-width="1.2"/>
  <path d="M37 92 L41 40 H59 L63 92Z" fill="url(#dqmPalha)" stroke="#3E3A2A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M44 44 L42 90 M50 42 V90 M56 44 L58 90" stroke="#3E3A2A" stroke-width=".9" opacity=".6"/>
  <path d="M42 48 C43 60 42 74 41 88" stroke="#B8B48E" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>
  <rect x="47" y="58" width="6" height="8" rx="1" fill="#FFF3D6" stroke="#3E3A2A" stroke-width="1"/>
  <path d="M28 88 H72" stroke="#5E3A1E" stroke-width="3" stroke-linecap="round"/><path d="M30 88 V94 M40 88 V94 M60 88 V94 M70 88 V94" stroke="#5E3A1E" stroke-width="1.4"/>
  <path d="M38 42 C38 30 62 30 62 42Z" fill="url(#dqmCapa)" stroke="#12351E" stroke-width="1.6"/>
  <path d="M42 36 q6 -4 12 -3" stroke="#8ED0A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  {pas}
  <circle cx="50" cy="40" r="4.4" fill="#5E3A1E" stroke="#2E1A0A" stroke-width="1.2"/><circle cx="49" cy="39" r="1.3" fill="#C9A07A"/>
</symbol>''')

# tulipas
def tulipa(x, y, h, c0, c1, esc, k=1):
    return f'''<path d="M{x} {y} C{x - 2} {y - h * .5} {x + 2} {y - h * .8} {x} {y - h}" stroke="#2E6A22" stroke-width="{3.4 * k:.1f}" fill="none" stroke-linecap="round"/>
  <path d="M{x} {y} C{x} {y - h * .5} {x} {y - h * .8} {x} {y - h}" stroke="#5FB84A" stroke-width="{1.8 * k:.1f}" fill="none" stroke-linecap="round"/>
  <path d="M{x - 11 * k:.1f} {y - h - 2 * k:.1f} C{x - 13 * k:.1f} {y - h - 16 * k:.1f} {x - 8 * k:.1f} {y - h - 24 * k:.1f} {x - 4 * k:.1f} {y - h - 26 * k:.1f} L{x} {y - h - 18 * k:.1f} L{x + 4 * k:.1f} {y - h - 26 * k:.1f} C{x + 8 * k:.1f} {y - h - 24 * k:.1f} {x + 13 * k:.1f} {y - h - 16 * k:.1f} {x + 11 * k:.1f} {y - h - 2 * k:.1f} C{x + 8 * k:.1f} {y - h + 4 * k:.1f} {x - 8 * k:.1f} {y - h + 4 * k:.1f} {x - 11 * k:.1f} {y - h - 2 * k:.1f}Z" fill="url(#{c0})" stroke="{esc}" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M{x} {y - h + 2 * k:.1f} C{x - 6 * k:.1f} {y - h - 8 * k:.1f} {x - 5 * k:.1f} {y - h - 20 * k:.1f} {x} {y - h - 28 * k:.1f} C{x + 5 * k:.1f} {y - h - 20 * k:.1f} {x + 6 * k:.1f} {y - h - 8 * k:.1f} {x} {y - h + 2 * k:.1f}Z" fill="url(#{c1})" stroke="{esc}" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M{x - 7 * k:.1f} {y - h - 6 * k:.1f} C{x - 8 * k:.1f} {y - h - 14 * k:.1f} {x - 6 * k:.1f} {y - h - 19 * k:.1f} {x - 4 * k:.1f} {y - h - 21 * k:.1f}" stroke="#fff" stroke-width="{2 * k:.1f}" fill="none" stroke-linecap="round" opacity=".7"/>'''
S.append(f'''<symbol id="f-tulipa" viewBox="0 0 100 120">
  <defs>{lg('dqtV0', '#FF6A5A', '#C8202A')}{lg('dqtV1', '#FF9A8A', '#E5392C')}{lg('dqtA0', '#FFE27A', '#F0A81E')}{lg('dqtA1', '#FFF3B0', '#FFC83D')}{lg('dqtR0', '#FFB0D8', '#D8508E')}{lg('dqtR1', '#FFD8EC', '#F08ABC')}{lg('dqtF', '#7CCB5A', '#2E7A2A')}{lg('dqtT', '#9A6A44', '#5E3A1E')}</defs>
  <ellipse cx="50" cy="116" rx="36" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M14 114 C18 104 34 100 50 100 C66 100 82 104 86 114Z" fill="url(#dqtT)" stroke="#3E220E" stroke-width="1.6"/>
  {tex(50, 108, 26, 4, 10, '#7A4E2A', 1)}
  <path d="M40 104 C28 94 24 80 28 66 C34 78 40 90 44 102Z" fill="url(#dqtF)" stroke="#1E5A1E" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M60 104 C74 96 80 82 76 70 C70 80 62 92 56 102Z" fill="url(#dqtF)" stroke="#1E5A1E" stroke-width="1.4" stroke-linejoin="round"/>
  {tulipa(28, 104, 34, 'dqtA0', 'dqtA1', '#A86A08', .82)}
  {tulipa(72, 104, 36, 'dqtR0', 'dqtR1', '#9A2E5E', .82)}
  {tulipa(50, 104, 50, 'dqtV0', 'dqtV1', '#7A1410', 1)}
  <path d="M46 104 C38 98 36 88 38 80 C42 88 46 96 48 102Z" fill="url(#dqtF)" stroke="#1E5A1E" stroke-width="1.2"/>
</symbol>''')

# foca-comum
pintas = ''.join(f'<ellipse cx="{R(36, 118):.0f}" cy="{R(36, 64):.0f}" rx="{R(1.6, 3.4):.1f}" ry="{R(1.2, 2.4):.1f}" fill="#5E5248" opacity=".55"/>' for _ in range(22))
S.append(f'''<symbol id="f-focacomum" viewBox="0 0 150 90">
  <defs>{lg('dqfCorpo', '#C8BCA8', '#7E7262')}{lg('dqfAreia', '#F6E2A8', '#D2B070')}{rg('dqfOlho', '#4A3A2E', '#1A120C', '#0A0604', .4, .35)}</defs>
  <ellipse cx="76" cy="86" rx="66" ry="3.6" fill="#0A1440" opacity=".16"/>
  <path d="M6 86 C14 72 40 68 76 68 C112 68 138 72 146 86Z" fill="url(#dqfAreia)" stroke="#B8965A" stroke-width="1.4"/>
  <path d="M20 82 q4 -2 8 0 M108 80 q4 -2 8 0 M60 84 q4 -2 8 0" stroke="#C9A86A" stroke-width="1.2" fill="none"/>
  <path d="M20 68 C10 64 4 58 6 52 C14 54 20 58 24 62 C22 56 24 50 30 48 C32 56 30 62 28 68Z" fill="url(#dqfCorpo)" stroke="#4E4236" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M26 70 C30 52 56 40 88 38 C104 36 116 30 122 24 C134 22 144 30 144 42 C144 54 136 60 126 62 C118 72 100 78 78 78 C52 78 34 76 26 70Z" fill="url(#dqfCorpo)" stroke="#4E4236" stroke-width="2"/>
  {pintas}
  <path d="M40 72 C64 76 96 74 114 68" stroke="#E6DCCB" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M84 70 C82 78 74 82 64 82 C70 76 74 72 78 68Z" fill="url(#dqfCorpo)" stroke="#4E4236" stroke-width="1.6"/>
  <path d="M48 50 C64 42 84 40 102 38" stroke="#EDE4D6" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="131" cy="36" rx="5" ry="5.4" fill="url(#dqfOlho)"/><circle cx="132.8" cy="34" r="1.8" fill="#fff"/><circle cx="130" cy="38.4" r=".7" fill="#fff" opacity=".7"/>
  <ellipse cx="117" cy="36" rx="4.4" ry="4.8" fill="url(#dqfOlho)"/><circle cx="118.6" cy="34.2" r="1.6" fill="#fff"/>
  <ellipse cx="129" cy="48" rx="8" ry="5.4" fill="#E6DCCB" stroke="#4E4236" stroke-width="1.2"/>
  <ellipse cx="126.6" cy="45.6" rx="1.5" ry="1" fill="#2A1E14"/><ellipse cx="131.4" cy="45.6" rx="1.5" ry="1" fill="#2A1E14"/>
  <path d="M125 50.5 q4 3.4 8 0" stroke="#4E4236" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M136 47 l11 -3 M136 50 l11 1 M122 47 l-10 -3 M122 50 l-10 1" stroke="#4E4236" stroke-width=".8"/>
  <ellipse cx="112" cy="46" rx="3.6" ry="2" fill="#FF9AB0" opacity=".5"/>
</symbol>''')

# capa: mar mais alto que os campos
fileiras = ''
for i, cor in enumerate(['#E5392C', '#FFC83D', '#FF8AB8', '#FF8A3A', '#B57BFF']):
    y0 = 82 + i * 4.6; y1 = y0 + 3.2 + i * .5
    fileiras += f'<path d="M{104 - i * 6} {y1:.1f} L170 {y1:.1f} L170 {y0:.1f} L{108 - i * 5} {y0:.1f}Z" fill="{cor}" stroke="#00000022" stroke-width=".4"/><path d="M{104 - i * 6} {y1 + .8:.1f} H170" stroke="#4E9A3A" stroke-width="1.4"/>'
pedras = ''.join(f'<path d="M{34 + k * 3.6:.1f} {104 - k * 9:.1f} l6 -1.4" stroke="#4E4E5A" stroke-width=".8"/>' for k in range(7))
S.append(f'''<symbol id="capa-diques" viewBox="0 0 170 110">
  <defs>{ceu('cpDqC', '#5EB4EE', '#FFF2DC')}{ceu('cpDqM', '#4CB4E6', '#0F3E7A')}{ceu('cpDqD', '#9ADA6E', '#4E9A3A')}{ceu('cpDqP', '#B8B8C6', '#6E6E7E')}{ceu('cpDqS', '#7A5236', '#4E3220')}{ceu('cpDqL', '#B9DA9A', '#8CC46A')}</defs>
  <rect width="170" height="110" fill="url(#cpDqC)"/>
  <circle cx="150" cy="16" r="12" fill="#FFE27A" opacity=".35"/><circle cx="150" cy="16" r="7" fill="#FFC83D" stroke="#F0A81E" stroke-width="1"/>
  <use href="#nuvem" x="74" y="6" width="46" height="23" style="color:#fff" opacity=".95"/><use href="#nuvem" x="16" y="10" width="30" height="15" style="color:#fff" opacity=".85"/>
  <path d="M90 76 C110 72 140 72 170 74 V82 H90Z" fill="url(#cpDqL)"/>
  <g fill="#8FB0C8" opacity=".8"><path d="M156 74 V64 h1.6 V74Z"/><path d="M152.5 63 l4.3 -4.3 l4.3 4.3 l-4.3 4.3Z" fill="none" stroke="#8FB0C8" stroke-width="1"/><path d="M134 74 v-10 l2 -5 l2 5 v10Z"/></g>
  <rect y="44" width="70" height="66" fill="url(#cpDqM)"/>
  <path d="M0 44 {' '.join('q3 -1.6 6 0' for _ in range(10))}" stroke="#E6F6FF" stroke-width="1.4" fill="none"/>
  <path d="M0 50 q4 1 8 0 M18 56 q4 1 8 0 M6 64 q4 1 8 0" stroke="#BFE6FF" stroke-width=".8" fill="none" opacity=".7"/>
  <path d="M-2 104 C8 96 22 96 32 104 V110 H-2Z" fill="#EBD394" stroke="#B8965A" stroke-width=".7"/>
  <svg x="4" y="88" width="28" height="17" viewBox="0 0 150 90"><use class="sem" href="#f-focacomum"/></svg>
  <path d="M30 110 L52 46 C55 38 58 36 64 36 H84 C90 36 93 40 97 48 L112 82 H170 V110Z" fill="url(#cpDqD)" stroke="#2E6A22" stroke-width="1"/>
  <path d="M30 110 L50 52 L56 50 L38 110Z" fill="url(#cpDqP)" stroke="#4E4E5A" stroke-width=".8"/>{pedras}
  <path d="M58 40 C66 37 80 37 88 39" stroke="#D6F8B8" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <rect x="90" y="82" width="80" height="28" fill="url(#cpDqS)"/>
  <path d="M90 82 H170" stroke="#3E7A22" stroke-width="1.6"/>
  {fileiras}
  <path d="M0 44 H170" stroke="#fff" stroke-width="1.1" stroke-dasharray="3 2.4" opacity=".95"/>
  <path d="M100 47 V78 M98 50 L100 46 L102 50 M98 75 L100 79 L102 75" stroke="#fff" stroke-width="1" fill="none" opacity=".9"/>
  <g transform="translate(70 36)"><ellipse cx="0" cy="-3" rx="5" ry="3.4" fill="#F6F6F0" stroke="#8A8A7A" stroke-width=".6"/><circle cx="4.6" cy="-4" r="1.9" fill="#3A3A40"/><path d="M-3 0 v2.4 M2 0 v2.4" stroke="#3A3A40" stroke-width=".9"/></g>
  <g transform="translate(80 36)"><ellipse cx="0" cy="-3" rx="4.4" ry="3" fill="#F6F6F0" stroke="#8A8A7A" stroke-width=".6"/><circle cx="-4" cy="-3.6" r="1.7" fill="#3A3A40"/><path d="M-2 0 v2.2 M2 0 v2.2" stroke="#3A3A40" stroke-width=".9"/></g>
  <svg x="104" y="20" width="48" height="62" viewBox="0 0 100 130"><use class="sem" href="#f-moinho"/></svg>
  <g><path d="M150 82 V58 L156 50 L162 58 V82Z" fill="#C9674A" stroke="#5E2414" stroke-width=".8"/><path d="M162 82 V54 h2 l2 -3 h2 l2 3 v28Z" fill="#7A4A3A" stroke="#3E2014" stroke-width=".8"/><g fill="#FFF3D6"><rect x="153" y="62" width="2.6" height="4"/><rect x="157" y="62" width="2.6" height="4"/><rect x="155" y="72" width="3" height="10" fill="#2E5A3A"/><rect x="165" y="60" width="2.4" height="4"/><rect x="165" y="68" width="2.4" height="4"/></g></g>
  <svg x="148" y="30" width="16" height="21" viewBox="0 0 100 130"><use class="sem" href="#f-cegonha"/></svg>
</symbol>''')
