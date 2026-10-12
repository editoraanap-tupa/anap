# figurinhas e capa do Velho Chico, Rio São Francisco (executado dentro de gerar_defs2.py, depois do gerar_defs5.py)
random.seed(83)

# ararinha-azul (Celeste) pousada num galho de caraibeira florida
penas_asa = ''.join(f'<path d="M{x:.1f} {y:.1f} q{-4:.1f} {6:.1f} {-2:.1f} {12:.1f}" stroke="#1A3E86" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75"/>' for x, y in [(62, 58), (68, 60), (74, 63), (79, 67)])
flores_cb = ''.join(f'<g transform="translate({x} {y}) rotate({a})"><path d="M0 0 C-3 -4 -3 -9 0 -11 C3 -9 3 -4 0 0Z M0 0 C-5 -1 -9 -4 -9 -7 C-6 -8 -2 -5 0 0Z M0 0 C5 -1 9 -4 9 -7 C6 -8 2 -5 0 0Z" fill="url(#vcFAm)" stroke="#B07A08" stroke-width=".8" stroke-linejoin="round"/><circle cx="0" cy="-2" r="1.4" fill="#C8601A"/></g>' for x, y, a in [(12, 96, -20), (22, 104, 160), (92, 92, 15), (102, 100, 150), (84, 104, -170)])
S.append(f'''<symbol id="f-ararinhaazul" viewBox="0 0 110 120">
  <defs>{rg('vcArCorpo', '#7EB4F2', '#3A78D2', '#1E4AA0', .4, .3)}{rg('vcArCab', '#D6E6F4', '#A8C4E0', '#7A9CC6', .4, .3)}{lg('vcArAsa', '#3A72CC', '#183C8A', 1, 1)}{lg('vcArCauda', '#3E7ED8', '#14347A')}{lg('vcArBico', '#4A4E5A', '#16181E')}{lg('vcFGalho', '#9A7650', '#5E4228')}{lg('vcFAm', '#FFE76A', '#F2B21E')}</defs>
  <ellipse cx="56" cy="116" rx="40" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M60 78 C68 94 74 106 80 118 C72 116 64 106 58 92Z" fill="url(#vcArCauda)" stroke="#102A66" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M56 80 C58 94 58 106 56 116 C52 110 50 98 50 86Z" fill="#2A5CB4" stroke="#102A66" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M60 86 C64 96 66 104 67 110" stroke="#7EB4F2" stroke-width="1.2" fill="none" opacity=".7"/>
  <path d="M4 92 C24 86 48 88 70 86 C84 85 96 88 108 84" stroke="#4A321C" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M4 92 C24 86 48 88 70 86 C84 85 96 88 108 84" stroke="url(#vcFGalho)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M10 90 C26 86 44 87 60 86" stroke="#C8A27A" stroke-width="1.2" fill="none" opacity=".7"/>
  <path d="M20 90 C16 96 14 100 12 96 M90 86 C94 92 98 96 102 100" stroke="#5E4228" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  {flores_cb}
  <path d="M38 50 C34 62 38 78 50 84 C62 88 74 82 76 70 C78 58 72 46 60 42 C50 40 42 42 38 50Z" fill="url(#vcArCorpo)" stroke="#143A86" stroke-width="1.8"/>
  <path d="M44 56 C44 66 48 74 54 78" stroke="#A8D0FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M58 50 C70 50 80 60 80 74 C78 82 70 86 64 84 C66 74 62 62 58 50Z" fill="url(#vcArAsa)" stroke="#102A66" stroke-width="1.6" stroke-linejoin="round"/>
  {penas_asa}
  <path d="M62 52 C70 54 76 60 78 68" stroke="#6EA4EE" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <g stroke="#3E414E" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M48 82 C47 86 46 88 44 89 M48 84 C49 87 50 88 52 89"/><path d="M60 84 C60 87 59 88 57 89 M61 85 C62 87 63 88 65 88"/></g>
  <path d="M30 34 C28 20 40 10 54 12 C66 14 72 24 70 36 C68 48 58 54 46 52 C36 50 31 44 30 34Z" fill="url(#vcArCab)" stroke="#4E6E9E" stroke-width="1.8"/>
  <path d="M36 20 C42 14 50 13 58 15" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M36 44 C42 50 52 52 60 50" stroke="#6E8EBE" stroke-width="1.2" fill="none" opacity=".6"/>
  <path d="M31 30 C33 24 42 22 47 26 C50 30 48 36 42 38 C36 40 31 36 31 30Z" fill="#6A7080" stroke="#3E4250" stroke-width="1"/>
  <path d="M36 30 C26 26 17 32 18 41 C19 48 25 49 27 44 C26 40 29 37 34 38Z" fill="url(#vcArBico)" stroke="#0E1014" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M27 44 C26 48 29 51 34 49 C37 47 36 42 33 40Z" fill="#2E323C" stroke="#0E1014" stroke-width="1.1"/>
  <path d="M22 33 q4 -3 9 -2" stroke="#8A8E9A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <circle cx="45" cy="29" r="5.6" fill="#F2E6B0" stroke="#3A3E4A" stroke-width="1.2"/><circle cx="45.6" cy="29.4" r="3.8" fill="#16141C"/><circle cx="47.2" cy="27.6" r="1.7" fill="#fff"/><circle cx="44.2" cy="31.2" r=".7" fill="#fff" opacity=".8"/>
  <ellipse cx="52" cy="40" rx="4" ry="2.2" fill="#FF9AAE" opacity=".4"/>
</symbol>''')

# surubim (pintado): peixe grande de bigodes compridos
pintas_s = ''.join(f'<circle cx="{R(36, 120):.1f}" cy="{R(30, 44):.1f}" r="{R(1.4, 2.8):.1f}" fill="#2E3644" opacity=".8"/>' for _ in range(26))
faixas_s = ''.join(f'<path d="M{x} 27 C{x - 3} 34 {x + 2} 40 {x - 1} 47" stroke="#3E4656" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>' for x in [50, 64, 78, 92, 106])
S.append(f'''<symbol id="f-surubim" viewBox="0 0 150 80">
  <defs>{lg('vcSuCorpo', '#B4C2D0', '#6E7E92')}{lg('vcSuAgua', '#6EC0D8', '#2A7E9A')}{lg('vcSuBarb', '#5E6676', '#2E3440')}
  <clipPath id="vcSuClip"><path d="M18 40 C20 30 34 24 54 24 C84 24 110 28 124 36 C128 40 126 46 120 48 C104 54 72 56 48 54 C30 52 18 48 18 40Z"/></clipPath></defs>
  <ellipse cx="74" cy="70" rx="68" ry="8" fill="url(#vcSuAgua)" stroke="#1E6A82" stroke-width="1.3"/>
  {ondas(12, 136, 68, '#E6F6FF', 1.1, .75)}
  <path d="M120 40 C130 30 138 24 146 22 C142 32 140 38 142 42 C140 46 142 52 146 60 C138 58 130 52 120 46Z" fill="#7A889C" stroke="#2E3644" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M130 30 l10 -4 M130 52 l10 4" stroke="#2E3644" stroke-width="1" opacity=".6"/>
  <path d="M60 25 C66 14 76 12 84 16 C80 20 78 24 78 26Z" fill="#7E8EA2" stroke="#2E3644" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M104 30 C108 24 114 24 116 28Z" fill="#7E8EA2" stroke="#2E3644" stroke-width="1.2"/>
  <path d="M18 40 C20 30 34 24 54 24 C84 24 110 28 124 36 C128 40 126 46 120 48 C104 54 72 56 48 54 C30 52 18 48 18 40Z" fill="url(#vcSuCorpo)" stroke="#2E3644" stroke-width="1.9"/>
  <g clip-path="url(#vcSuClip)">{faixas_s}{pintas_s}<path d="M16 46 C40 56 90 56 128 44 V60 H16Z" fill="#F4F6F8"/></g>
  <path d="M30 32 C48 26 76 25 100 28" stroke="#E6EEF6" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M66 50 C64 58 58 62 52 62 C54 56 56 52 60 50Z" fill="#7E8EA2" stroke="#2E3644" stroke-width="1.3"/>
  <g fill="none" stroke-linecap="round"><path d="M22 36 C14 34 8 36 4 42" stroke="url(#vcSuBarb)" stroke-width="1.8"/><path d="M22 40 C12 42 6 48 4 56" stroke="url(#vcSuBarb)" stroke-width="1.6"/><path d="M24 46 C18 52 16 58 18 64" stroke="url(#vcSuBarb)" stroke-width="1.4"/><path d="M28 47 C26 54 28 58 32 62" stroke="url(#vcSuBarb)" stroke-width="1.2"/></g>
  <circle cx="34" cy="34" r="3.6" fill="#16182A"/><circle cx="35.2" cy="32.8" r="1.4" fill="#fff"/><circle cx="33.2" cy="35.4" r=".6" fill="#fff" opacity=".8"/>
  <path d="M21 43 C26 46 32 46 36 44" stroke="#2E3644" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="41" rx="3.4" ry="1.8" fill="#FF9AAE" opacity=".45"/>
</symbol>''')

# curimatã saltando na água (piracema)
escamas_c = ''.join(f'<path d="M{x:.1f} {y:.1f} q3 -3 6 0" stroke="#8E9AAE" stroke-width=".8" fill="none" opacity=".7"/>' for x in range(46, 96, 8) for y in [30, 37, 44] )
S.append(f'''<symbol id="f-curimata" viewBox="0 0 130 90">
  <defs>{lg('vcCuCorpo', '#F2F6FA', '#9AA8BA')}{lg('vcCuAgua', '#7ED0E4', '#2A86A6')}{lg('vcCuBarb', '#E8C870', '#B8862A')}
  <clipPath id="vcCuClip"><path d="M22 38 C30 24 52 16 76 18 C96 20 108 30 110 38 C108 48 94 56 74 58 C50 60 30 52 22 38Z"/></clipPath></defs>
  <ellipse cx="62" cy="80" rx="58" ry="8" fill="url(#vcCuAgua)" stroke="#1E6A86" stroke-width="1.3"/>
  {ondas(10, 116, 79, '#E6F6FF', 1.1, .8)}
  <path d="M30 76 C26 68 30 62 36 60 M88 74 C94 68 96 62 92 58" stroke="#BFEAF6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="24" cy="64" r="2.6" fill="#BFEAF6"/><circle cx="98" cy="62" r="2" fill="#BFEAF6"/><circle cx="104" cy="70" r="1.6" fill="#BFEAF6"/>
  <g transform="translate(-6 2) rotate(-12 66 40) scale(.94)">
  <path d="M106 36 C116 26 122 20 128 16 C126 28 124 34 126 40 C124 46 126 52 128 62 C120 56 114 50 106 44Z" fill="#B8C4D2" stroke="#3E4A5E" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M112 30 l12 -8 M112 50 l12 8 M114 40 h10" stroke="#2E3644" stroke-width="2" opacity=".7" stroke-linecap="round"/>
  <path d="M56 20 C60 10 70 8 78 12 C74 16 72 18 72 20Z" fill="#C8D2DE" stroke="#3E4A5E" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M22 38 C30 24 52 16 76 18 C96 20 108 30 110 38 C108 48 94 56 74 58 C50 60 30 52 22 38Z" fill="url(#vcCuCorpo)" stroke="#3E4A5E" stroke-width="1.9"/>
  <g clip-path="url(#vcCuClip)">{escamas_c}<path d="M20 44 C44 58 90 58 112 40 V64 H20Z" fill="#FFFFFF" opacity=".8"/><path d="M20 34 C50 28 84 28 112 36" stroke="#C8A85A" stroke-width="2" fill="none" opacity=".45"/></g>
  <path d="M34 28 C48 21 66 19 84 21" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M70 56 C68 64 64 68 58 68 C60 62 62 58 66 56Z" fill="url(#vcCuBarb)" stroke="#8A5E1A" stroke-width="1.1"/>
  <path d="M48 46 C44 52 40 54 36 54 C38 50 42 46 46 44Z" fill="url(#vcCuBarb)" stroke="#8A5E1A" stroke-width="1"/>
  <ellipse cx="25" cy="39" rx="3" ry="3.6" fill="#E8A0A8" stroke="#3E4A5E" stroke-width="1"/>
  <circle cx="36" cy="33" r="4.2" fill="#F2E2A0" stroke="#3E4A5E" stroke-width=".8"/><circle cx="36.4" cy="33.4" r="3" fill="#16182A"/><circle cx="37.6" cy="32" r="1.3" fill="#fff"/><circle cx="35.4" cy="34.8" r=".5" fill="#fff" opacity=".8"/>
  <ellipse cx="42" cy="42" rx="3.4" ry="1.8" fill="#FF9AAE" opacity=".45"/>
  </g>
</symbol>''')

# carranca de madeira (arte popular do Velho Chico), sobre a proa
juba = ''.join(f'<path d="M{50 + math.cos(a) * 24:.1f} {48 + math.sin(a) * 28:.1f} q{math.cos(a + .7) * 10:.1f} {math.sin(a + .7) * 10:.1f} {math.cos(a) * 12:.1f} {math.sin(a) * 12:.1f}" stroke="#4A1A08" stroke-width="{w + 2.4}" fill="none" stroke-linecap="round"/><path d="M{50 + math.cos(a) * 24:.1f} {48 + math.sin(a) * 28:.1f} q{math.cos(a + .7) * 10:.1f} {math.sin(a + .7) * 10:.1f} {math.cos(a) * 12:.1f} {math.sin(a) * 12:.1f}" stroke="{c}" stroke-width="{w}" fill="none" stroke-linecap="round"/>' for a, c, w in [(math.pi * (.62 + i * .12), ['#C8361E', '#E8A21E', '#2E5EA8'][i % 3], 7 - (i % 2) * 1.6) for i in range(15)])
juba = juba.replace('stroke-linecap="round"/>', 'stroke-linecap="round"/>', -1)
veios = ''.join(f'<path d="M{x:.1f} 30 C{x - 2:.1f} 44 {x + 2:.1f} 56 {x - 1:.1f} 70" stroke="#7A4A22" stroke-width=".8" fill="none" opacity=".45"/>' for x in [38, 46, 54, 62])
S.append(f'''<symbol id="f-carranca" viewBox="0 0 100 120">
  <defs>{rg('vcCaMad', '#E8B880', '#C08048', '#8A5228', .42, .3)}{lg('vcCaJuba', '#B0461E', '#7A2A10')}{lg('vcCaProa', '#3E7AC6', '#1E4A8A')}{lg('vcCaBase', '#A86E3E', '#6A4220')}</defs>
  <ellipse cx="52" cy="115" rx="40" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M30 116 C30 100 36 90 50 86 C64 90 70 100 70 116Z" fill="url(#vcCaBase)" stroke="#4A2A12" stroke-width="1.8"/>
  <path d="M36 112 C36 102 42 94 50 92" stroke="#D8A878" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M30 106 H70" stroke="#E8C23A" stroke-width="3"/><path d="M31 100 H69" stroke="#C8361E" stroke-width="2.2"/>
  <path d="M18 50 C14 30 28 12 50 12 C72 12 86 30 82 50 C80 66 74 80 66 88 C58 94 42 94 34 88 C26 80 20 66 18 50Z" fill="url(#vcCaJuba)" stroke="#4A1A08" stroke-width="2"/>
  {juba}
  <path d="M28 46 C28 30 38 22 50 22 C62 22 72 30 72 46 C72 62 66 74 60 80 C56 84 44 84 40 80 C34 74 28 62 28 46Z" fill="url(#vcCaMad)" stroke="#5E3216" stroke-width="2"/>
  {veios}
  <path d="M30 34 C36 26 44 24 50 24" stroke="#F6D8B0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M33 38 C37 33 45 33 47 38 M53 38 C55 33 63 33 67 38" stroke="#4A2410" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="45" rx="6.4" ry="6" fill="#fff" stroke="#4A2410" stroke-width="1.4"/><ellipse cx="60" cy="45" rx="6.4" ry="6" fill="#fff" stroke="#4A2410" stroke-width="1.4"/>
  <circle cx="41" cy="46" r="3.4" fill="#1A1210"/><circle cx="61" cy="46" r="3.4" fill="#1A1210"/><circle cx="42.4" cy="44.4" r="1.3" fill="#fff"/><circle cx="62.4" cy="44.4" r="1.3" fill="#fff"/>
  <path d="M44 50 C44 56 42 58 40 60 C44 63 56 63 60 60 C58 58 56 56 56 50" fill="#D89A60" stroke="#5E3216" stroke-width="1.4" stroke-linejoin="round"/>
  <ellipse cx="45" cy="59" rx="2" ry="1.4" fill="#4A2410"/><ellipse cx="55" cy="59" rx="2" ry="1.4" fill="#4A2410"/>
  <path d="M36 66 C40 76 60 76 64 66 C58 68 42 68 36 66Z" fill="#8A1E14" stroke="#4A1208" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M38 66.6 l2.4 3.4 l2.4 -3 l2.4 3.4 l2.4 -3.2 l2.4 3.4 l2.4 -3.2 l2.4 3.4 l2.4 -3.2 l2.4 3.4 l2.2 -3.4" fill="#FFFDF2" stroke="#8A6A4A" stroke-width=".6"/>
  <path d="M44 74 C47 72 53 72 56 74" stroke="#E86A5A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="33" cy="56" rx="3.4" ry="2" fill="#E8604A" opacity=".45"/><ellipse cx="67" cy="56" rx="3.4" ry="2" fill="#E8604A" opacity=".45"/>
</symbol>''')

# capa: o Velho Chico no sertão, barca com carranca, coroa de areia, caraibeira e ararinha
caat = ''.join(f'<path d="{copa(x, y, r, r * .7, 7, .35)}" fill="{c}" stroke="#6E6A52" stroke-width=".5"/>' for x, y, r, c in [(110, 46, 4, '#A8A47E'), (118, 47, 3.4, '#9A9672'), (126, 45, 4.4, '#B4AE84'), (136, 47, 3, '#A09A74'), (146, 46, 4, '#A8A47E'), (158, 47, 3.6, '#9A9672'), (166, 45, 4, '#B0AA80')])
mangas = ''.join(f'<circle cx="{x}" cy="{y}" r="2.2" fill="#3E8A3A" stroke="#1E5A2A" stroke-width=".4"/>' for y in (48, 51.5) for x in range(36, 84, 5))
flor_cp = ''.join(f'<circle cx="{R(126, 166):.1f}" cy="{R(20, 52):.1f}" r="{R(1.4, 2.6):.1f}" fill="{random.choice(["#FFD83A", "#FFE76A", "#F2B21E"])}" stroke="#B07A08" stroke-width=".3"/>' for _ in range(60))
S.append(f'''<symbol id="capa-velhochico" viewBox="0 0 170 110">
  <defs>{lg('vcCpCeu', '#3E9AE8', '#FFE2B4')}{lg('vcCpRio', '#5EB4C8', '#1E6E8A')}{lg('vcCpSerra', '#B4A6C8', '#D8C8D4')}{lg('vcCpAreia', '#FFF0C8', '#E2C084')}{lg('vcCpCasco', '#3E86D6', '#1E4E96')}{lg('vcCpMarg', '#D8B07A', '#A87A4A')}{rg('vcCpCopa', '#FFF27A', '#F6C62A', '#D8941A')}{rg('vcCpSol', '#FFFBE0', '#FFE27A', '#F6B21E', .5, .5)}</defs>
  <rect width="170" height="110" fill="url(#vcCpCeu)"/>
  <circle cx="28" cy="20" r="14" fill="#FFE27A" opacity=".3"/><circle cx="28" cy="20" r="9" fill="url(#vcCpSol)"/>
  <path d="M0 44 L14 38 H40 L48 34 H78 L86 38 H120 L128 35 H150 L158 39 H170 V52 H0Z" fill="url(#vcCpSerra)"/>
  <path d="M0 47 C30 44 60 46 100 45 C130 44 150 46 170 45 V54 H0Z" fill="#C8B888"/>
  <rect x="32" y="46" width="54" height="7" fill="#7EB85A" opacity=".9"/>{mangas}
  <path d="M88 47 h18 M88 49.5 h18 M88 52 h18" stroke="#4E8A3A" stroke-width="1.4"/>
  {caat}
  <path d="M150 46 v-8 M150 42 h-3 v-3 M150 41 h3 v-3" stroke="#3E7A4A" stroke-width="1.6" stroke-linecap="round" fill="none"/>
  <rect y="52" width="170" height="58" fill="url(#vcCpRio)"/>
  <path d="M0 54 H170" stroke="#E6F8FF" stroke-width="1" opacity=".7"/>
  <path d="M96 62 C104 59 118 59 124 62 C118 64 104 64 96 62Z" fill="url(#vcCpAreia)" stroke="#C8A060" stroke-width=".5"/><path d="M30 60 C36 58 46 58 52 60 C46 62 36 62 30 60Z" fill="url(#vcCpAreia)" stroke="#C8A060" stroke-width=".5"/>
  <g stroke="#E6F8FF" stroke-width=".9" fill="none" opacity=".75"><path d="M10 62 q4 -1.4 8 0 M100 66 q4 -1.4 8 0 M60 90 q4 -1.4 8 0 M120 96 q4 -1.4 8 0 M20 98 q4 -1.4 8 0"/></g>
  <g transform="translate(86 84) scale(1.2)">
    <ellipse cx="0" cy="4" rx="34" ry="3" fill="#0E4A5E" opacity=".35"/>
    <path d="M-16 -8 V-20 M16 -8 V-20" stroke="#6E4A2A" stroke-width="1.4"/>
    <path d="M-20 -19 C-10 -25 10 -25 20 -19 V-17 H-20Z" fill="#E8C878" stroke="#8A6A2A" stroke-width=".8"/>
    <path d="M-17 -19 h34 M-18 -21 h36" stroke="#B8944A" stroke-width=".5"/>
    <rect x="-12" y="-12" width="8" height="5" fill="#F2A23A" stroke="#8A5A1A" stroke-width=".6"/><rect x="-2" y="-13" width="9" height="6" fill="#7A3E8A" stroke="#4A1E5A" stroke-width=".6"/>
    <path d="M-34 -10 C-30 -4 -20 2 0 2 C20 2 30 0 34 -6 L32 -8 H-32Z" fill="url(#vcCpCasco)" stroke="#123A6E" stroke-width="1"/>
    <path d="M-32 -7 H32" stroke="#E8C23A" stroke-width="1.4"/><path d="M-30 -4 C-20 0 20 0 30 -3" stroke="#D8402A" stroke-width="1.2" fill="none"/>
    <path d="M-34 -10 L-38 -16" stroke="#6E4A2A" stroke-width="1.6"/>
    <svg x="-47" y="-28" width="16" height="19" viewBox="0 0 100 120"><use class="sem" href="#f-carranca"/></svg>
    <circle cx="26" cy="-13" r="2.2" fill="#C8865A" stroke="#4E2A14" stroke-width=".5"/><path d="M23.4 -14 C23.4 -17 28.6 -17 28.6 -14Z" fill="#E5392C"/><path d="M24 -11 v4 h4 v-4Z" fill="#3FA864"/>
  </g>
  <path d="M120 110 C120 90 128 70 136 58 H150 C156 74 160 92 160 110Z" fill="url(#vcCpMarg)"/>
  <path d="M120 110 C122 96 126 86 130 78" stroke="#8A5A2A" stroke-width="1" fill="none" opacity=".7"/>
  <path d="M146 100 C144 80 146 64 142 52 M142 60 L132 50 M144 66 L156 56" stroke="#5E4228" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="{copa(146, 36, 24, 18, 12, .3)}" fill="url(#vcCpCopa)" stroke="#B07A08" stroke-width=".8"/>
  {flor_cp}
  <path d="M128 28 q8 -8 18 -8" stroke="#FFFBE0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <svg x="118" y="34" width="26" height="28" viewBox="0 0 110 120"><use class="sem" href="#f-ararinhaazul"/></svg>
  <path d="M0 110 V96 C14 92 34 94 50 100 C58 104 62 107 64 110Z" fill="url(#vcCpMarg)"/><path d="M0 98 C16 95 34 97 50 102" stroke="#6E4A2A" stroke-width="2.4" fill="none" opacity=".5"/>
  {''.join(f'<path d="M{x} 104 C{x - 1} 96 {x + 1} 88 {x} 80" stroke="#3E7A2A" stroke-width="1.6" fill="none"/><path d="M{x} 96 l-5 -3 M{x} 92 l5 -3 M{x} 88 l-4 -4" stroke="#7EC04A" stroke-width="1.6" stroke-linecap="round"/><path d="M{x} 80 l-2 -4 M{x} 80 l2 -4" stroke="#D8B04A" stroke-width="1"/><ellipse cx="{x + 2}" cy="90" rx="1.4" ry="3" fill="#F2C83A" stroke="#A8801A" stroke-width=".4"/>' for x in (10, 22, 34))}
  <ellipse cx="46" cy="104" rx="5" ry="3.6" fill="url(#vcCpSol)" stroke="#C8701A" stroke-width=".6"/><path d="M40 104 C42 100 50 100 52 104" fill="none" stroke="#3E8A3A" stroke-width="1.4"/>
</symbol>''')
