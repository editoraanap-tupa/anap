# figurinhas e capa dos Andes e Himalaia (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(83)

# ---------- lhama (Quilla) ----------
def _manta(x0, y0):
    faixas = [('#E5392C', '#9A1E14'), ('#FFC83D', '#B07A08'), ('#1FA8A0', '#0E5E5A'), ('#8E4AC8', '#4E2280'), ('#FF7AA8', '#B03A6A')]
    s = ''
    for i, (c, e) in enumerate(faixas):
        y = y0 + i * 5
        s += f'<path d="M{x0} {y} H{x0 + 34} V{y + 5} H{x0}Z" fill="{c}"/>'
    zig = ' '.join(f'l3 -2.4 l3 2.4' for _ in range(5))
    s += f'<path d="M{x0 + 1} {y0 + 8.5} {zig}" stroke="#FFF6E0" stroke-width="1.2" fill="none"/><path d="M{x0 + 1} {y0 + 18.5} {zig}" stroke="#FFF6E0" stroke-width="1.2" fill="none"/>'
    return s

la_corpo = copa(54, 76, 31, 17, 13, .2)
la_tex = tex(54, 80, 24, 11, 12, '#D9BC98', 1.1)
S.append(f'''<symbol id="f-lhama" viewBox="0 0 120 130">
  <defs>{rg('laLa', '#FFFDF6', '#F4E4CC', '#D9BC98', .4, .3)}{lg('laCara', '#E8B482', '#C98A52')}{lg('laPerna', '#F4E4CC', '#C99A6E')}
  <clipPath id="laMantaC"><path d="M36 60 C42 54 66 54 74 60 L72 84 C62 88 46 88 38 84Z"/></clipPath></defs>
  <ellipse cx="56" cy="124" rx="36" ry="4" fill="#2A1A0A" opacity=".18"/>
  <g stroke-linecap="round">
    <path d="M34 86 V119 M74 86 V119" stroke="#9A7A5A" stroke-width="10"/><path d="M34 86 V119 M74 86 V119" stroke="#E2C8A6" stroke-width="7"/>
    <path d="M44 88 V121 M66 88 V121" stroke="#9A7A5A" stroke-width="10"/><path d="M44 88 V121 M66 88 V121" stroke="url(#laPerna)" stroke-width="7"/>
  </g>
  <g fill="#5E3E26"><rect x="40" y="117" width="8" height="6" rx="2.5"/><rect x="62" y="117" width="8" height="6" rx="2.5"/><rect x="30" y="115" width="8" height="5" rx="2.5" opacity=".8"/><rect x="70" y="115" width="8" height="5" rx="2.5" opacity=".8"/></g>
  <path d="{copa(24, 70, 7, 9, 7, .3)}" fill="url(#laLa)" stroke="#9A7A5A" stroke-width="1.6"/>
  <path d="{la_corpo}" fill="url(#laLa)" stroke="#9A7A5A" stroke-width="2"/>
  {la_tex}
  <g clip-path="url(#laMantaC)">{_manta(36, 58)}<path d="M36 83 H74" stroke="#5E3E26" stroke-width="1"/></g>
  <path d="M36 60 C42 54 66 54 74 60 L72 84 C62 88 46 88 38 84Z" fill="none" stroke="#6E2E1E" stroke-width="1.4" stroke-linejoin="round"/>
  <g fill="#FFC83D" stroke="#B07A08" stroke-width=".6">{''.join(f'<circle cx="{x}" cy="{86.5 + (i % 2) * 1.5}" r="1.8"/>' for i, x in enumerate(range(40, 72, 6)))}</g>
  <path d="M66 72 C62 54 66 40 74 30 L92 34 C88 46 86 58 84 74Z" fill="url(#laLa)" stroke="#9A7A5A" stroke-width="2" stroke-linejoin="round"/>
  <path d="M70 60 q-3 -4 0 -8 M72 48 q-3 -4 0 -8 M84 62 q3 -4 0 -8 M86 50 q3 -4 0 -8" stroke="#D9BC98" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M74 36 C70 50 70 60 72 70" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M78 18 C72 10 72 2 76 -1 C80 4 82 10 82 16Z" fill="url(#laCara)" stroke="#8A5A2E" stroke-width="1.5" stroke-linejoin="round" transform="translate(0 4)"/>
  <path d="M92 18 C96 10 100 4 104 3 C104 9 100 16 96 20Z" fill="url(#laCara)" stroke="#8A5A2E" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M77 14 C76 10 76 7 77.5 5 M95.5 16 C97 12 99 9 101.5 7.5" stroke="#FFB8A0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g><path d="M76.5 20 l-6 4" stroke="#E5392C" stroke-width="1.4"/><circle cx="69" cy="25" r="3.6" fill="#E5392C" stroke="#9A1E14" stroke-width=".9"/><circle cx="68" cy="24" r="1" fill="#FFB0A0"/>
     <path d="M98 19 l7 2" stroke="#1FA8A0" stroke-width="1.4"/><circle cx="107" cy="22" r="3.6" fill="#1FA8A0" stroke="#0E5E5A" stroke-width=".9"/><circle cx="106" cy="21" r="1" fill="#BFF4EE"/>
     <circle cx="73" cy="29" r="2.4" fill="#FFC83D" stroke="#B07A08" stroke-width=".8"/><circle cx="103" cy="27" r="2.4" fill="#FF7AA8" stroke="#B03A6A" stroke-width=".8"/></g>
  <ellipse cx="86" cy="28" rx="13" ry="11" fill="url(#laCara)" stroke="#8A5A2E" stroke-width="1.8"/>
  <ellipse cx="98" cy="34" rx="9" ry="7" fill="#F6D8B0" stroke="#8A5A2E" stroke-width="1.6"/>
  <path d="{copa(85, 18, 9, 5, 7, .4)}" fill="url(#laLa)" stroke="#9A7A5A" stroke-width="1.3"/>
  <path d="M102 31 q2 -1 3 1" stroke="#4E2E16" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M97 37 q4 3 8 0" stroke="#6E3E1E" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="88" cy="25" rx="3.8" ry="4.4" fill="#2A1A10"/><circle cx="89.3" cy="23.4" r="1.4" fill="#fff"/><circle cx="87" cy="27" r=".6" fill="#fff"/>
  <path d="M84 21 l-2 -2 M86 20 l-1 -2.6 M88.6 20.4 l0 -2.6" stroke="#2A1A10" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="85" cy="33" rx="4" ry="2.2" fill="#FF8A8A" opacity=".55"/>
  <path d="M78 24 q2 -6 8 -7" stroke="#FFE6C8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>''')

# ---------- condor-dos-andes (planando) ----------
def _asa(m):
    X = (lambda x: x) if m > 0 else (lambda x: 170 - x)
    p = lambda pts: ' '.join(f'{X(x):.1f} {y}' for x, y in pts)
    asa = f'M{p([(76, 44)])} C{p([(58, 30), (34, 26), (10, 30)])} L{p([(2, 34), (14, 37), (1, 41), (15, 43), (3, 49), (18, 49), (9, 56), (24, 54)])} C{p([(42, 60), (62, 60), (78, 56)])}Z'
    faixa = f'M{p([(26, 50)])} C{p([(42, 54), (60, 55), (76, 53)])} L{p([(76, 47)])} C{p([(60, 44), (42, 43), (28, 45)])}Z'
    linhas = ''.join(f'<path d="M{X(x):.1f} {y} l{(-6 if m > 0 else 6)} 5" stroke="#9AA0B8" stroke-width=".9"/>' for x, y in [(36, 46), (46, 46), (56, 47), (66, 48)])
    return f'<path d="{asa}" fill="url(#cdAsa)" stroke="#0A0A12" stroke-width="1.6" stroke-linejoin="round"/><path d="{faixa}" fill="url(#cdBr)" stroke="#8A90A8" stroke-width=".8"/>{linhas}<path d="M{X(70)} 42 C{X(56)} 33 {X(36)} 30 {X(16)} 32" stroke="#6A6E86" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>'
S.append(f'''<symbol id="f-condor" viewBox="0 0 170 100">
  <defs>{lg('cdAsa', '#4A4C62', '#16161E')}{lg('cdBr', '#FFFFFF', '#C9CEDC')}{rg('cdCab', '#F2A08A', '#C8604E', '#8E3A2E', .4, .35)}</defs>
  <ellipse cx="85" cy="94" rx="40" ry="3" fill="#0A1440" opacity=".12"/>
  {_asa(1)}{_asa(-1)}
  <path d="M76 62 L85 80 L94 62Z" fill="#26262E" stroke="#0A0A12" stroke-width="1.4" stroke-linejoin="round"/>
  <ellipse cx="85" cy="54" rx="15" ry="11" fill="url(#cdAsa)" stroke="#0A0A12" stroke-width="1.6"/>
  <path d="{copa(85, 42, 13, 6, 10, .35)}" fill="#FAFAFF" stroke="#8A90A8" stroke-width="1.2"/>
  <path d="M85 38 C78 38 76 32 78 27 C80 22 90 22 92 27 C94 32 92 38 85 38Z" fill="url(#cdCab)" stroke="#6E2A1E" stroke-width="1.4"/>
  <path d="M80 23 C82 18 88 18 90 22" fill="#7A2A2E" stroke="#4E1418" stroke-width="1"/>
  <path d="M91 28 C97 28 100 31 99 35 C97 34 95 33 92 33Z" fill="#F2E6C8" stroke="#8A7A4E" stroke-width="1"/>
  <circle cx="87.5" cy="29" r="2.4" fill="#2A1A10"/><circle cx="88.3" cy="28.2" r=".8" fill="#fff"/>
  <path d="M79 30 q2 -4 6 -5" stroke="#FFD8C8" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>''')

# ---------- iaque ----------
franja = ''.join(f'<path d="M{x:.1f} {74 + R(-3, 3):.1f} q{R(-2, 2):.1f} 9 {R(-2, 2):.1f} {R(15, 20):.1f}" stroke="#2A1C16" stroke-width="{R(3, 4.5):.1f}" fill="none" stroke-linecap="round"/>' for x in [34 + i * 4.2 for i in range(21)])
pelos = ''.join(f'<path d="M{x:.1f} {y:.1f} q-2 6 {R(-2, 1):.1f} 12" stroke="#7A5A48" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/>' for x, y in [(R(48, 120), R(34, 66)) for _ in range(16)])
S.append(f'''<symbol id="f-iaque" viewBox="0 0 150 110">
  <defs>{rg('iqPelo', '#8A6650', '#4E3628', '#2A1C16', .45, .25)}{lg('iqChifre', '#FFF8E8', '#C9B48A')}{lg('iqFoc', '#F4E6D0', '#C9AE8A')}</defs>
  <ellipse cx="80" cy="104" rx="56" ry="4" fill="#2A1A0A" opacity=".2"/>
  <g stroke="#2A1C16" stroke-width="7" stroke-linecap="round"><path d="M46 84 V100 M62 86 V101 M104 86 V100 M118 84 V99"/></g>
  <g fill="#1A1210"><rect x="42" y="98" width="8" height="5" rx="2"/><rect x="58" y="99" width="8" height="5" rx="2"/><rect x="100" y="98" width="8" height="5" rx="2"/><rect x="114" y="97" width="8" height="5" rx="2"/></g>
  <path d="M128 46 C138 50 140 64 136 82 C134 88 130 90 128 86 C130 72 128 58 124 52Z" fill="#3A2820" stroke="#1A1210" stroke-width="1.4"/>
  <path d="M128 84 q2 8 -2 12 q6 -2 8 -10" fill="#3A2820" stroke="#1A1210" stroke-width="1.2"/>
  <path d="M30 56 C30 34 50 22 70 24 C80 16 96 16 104 24 C122 26 134 40 132 62 C130 76 122 84 110 86 C90 90 60 90 44 86 C34 82 30 70 30 56Z" fill="url(#iqPelo)" stroke="#1A1210" stroke-width="2"/>
  {franja}
  {pelos}
  <path d="M60 30 C72 22 88 20 100 24" stroke="#A88470" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M8 56 C4 44 10 32 22 30 C34 28 42 38 42 50 C42 62 38 74 26 76 C14 76 10 66 8 56Z" fill="url(#iqPelo)" stroke="#1A1210" stroke-width="1.8"/>
  <path d="M14 46 C16 36 24 34 30 36 C26 44 22 54 20 66 C14 62 13 54 14 46Z" fill="url(#iqFoc)" opacity=".95"/>
  <path d="M16 34 C8 30 4 22 8 14 C10 20 14 24 20 28Z" fill="url(#iqChifre)" stroke="#8A7A5A" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M34 32 C40 26 42 18 38 10 C36 16 32 22 28 28Z" fill="url(#iqChifre)" stroke="#8A7A5A" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M4 40 C0 38 -1 44 2 46 C6 46 8 44 10 42Z" fill="#4E3628" stroke="#1A1210" stroke-width="1.2"/>
  <ellipse cx="18" cy="68" rx="10" ry="7" fill="#C9AE8A" stroke="#6E5440" stroke-width="1.4"/>
  <ellipse cx="14" cy="68" rx="1.6" ry="1.2" fill="#3A2820"/><ellipse cx="21" cy="68" rx="1.6" ry="1.2" fill="#3A2820"/>
  <path d="M14 72 q4 2 8 0" stroke="#6E5440" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="25" cy="48" rx="3.6" ry="4" fill="#1A1210"/><circle cx="26.3" cy="46.6" r="1.3" fill="#fff"/><circle cx="24.2" cy="50" r=".5" fill="#fff"/>
  <path d="M22 42.5 q3 -2 6 -.6" stroke="#1A1210" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M28 22 C30 18 36 16 40 20 C36 22 32 24 28 30Z" fill="#4E3628" stroke="#1A1210" stroke-width="1" opacity=".9"/>
  <path d="M12 46 q2 -8 8 -11" stroke="#FFF8E8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
</symbol>''')

# ---------- leopardo-das-neves ----------
def _roseta(x, y, r):
    return f'<path d="M{x - r:.1f} {y:.1f} a{r:.1f} {r * .8:.1f} 0 1 1 {r * 1.6:.1f} {-r * .6:.1f}" stroke="#4E5260" stroke-width="{max(1, r * .45):.1f}" fill="none" stroke-linecap="round"/><circle cx="{x:.1f}" cy="{y - r * .2:.1f}" r="{r * .35:.1f}" fill="#9A9488" opacity=".6"/>'
rosetas = ''.join(_roseta(x, y, R(3, 4.6)) for x, y in [(78, 64), (92, 60), (106, 64), (118, 70), (86, 76), (100, 76), (114, 82), (126, 78), (72, 80)])
anel_cauda = ''.join(f'<path d="M{x} {y} q4 -5 8 0" stroke="#4E5260" stroke-width="2.4" fill="none" stroke-linecap="round"/>' for x, y in [(106, 93), (90, 98), (74, 100), (130, 72), (131, 58)])
S.append(f'''<symbol id="f-leopardo" viewBox="0 0 150 110">
  <defs>{rg('lpPelo', '#FFFDF8', '#E6E2D8', '#B8B2A4', .4, .3)}{lg('lpCauda', '#F2EFE8', '#C9C4B8')}{rg('lpOlho', '#E6F0C8', '#A8BC88', '#6E8456', .5, .5)}</defs>
  <ellipse cx="78" cy="104" rx="62" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M60 58 C74 46 116 46 130 60 C140 72 136 92 120 96 C100 100 72 100 58 94 C46 88 48 68 60 58Z" fill="url(#lpPelo)" stroke="#7A7468" stroke-width="2"/>
  {rosetas}
  <path d="M128 90 C140 86 146 70 142 54 C140 46 134 42 130 46 C136 58 134 74 124 82Z" fill="url(#lpCauda)" stroke="#7A7468" stroke-width="1.8"/>
  <path d="M124 82 C116 96 96 104 70 104 C56 104 46 100 44 94 C60 96 90 96 112 86Z" fill="url(#lpCauda)" stroke="#7A7468" stroke-width="1.8" stroke-linejoin="round"/>
  {anel_cauda}
  <path d="M34 96 C30 88 34 82 40 82 C46 82 50 88 48 96Z M52 98 C50 90 54 84 60 84 C66 84 68 90 66 98Z" fill="url(#lpPelo)" stroke="#7A7468" stroke-width="1.6"/>
  <path d="M38 96 v-4 M42 96 v-4 M56 98 v-4 M60 98 v-4" stroke="#9A9488" stroke-width="1" stroke-linecap="round"/>
  <path d="M28 24 C24 14 30 8 36 12 C38 14 40 18 40 22Z M64 22 C66 12 74 10 76 18 C76 22 74 26 70 28Z" fill="url(#lpPelo)" stroke="#7A7468" stroke-width="1.6"/>
  <path d="M31 20 C30 15 33 13 35 15 M67 20 C69 15 72 15 72 19" stroke="#FFB8B0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M20 48 C18 30 32 18 50 18 C68 18 82 30 80 48 C80 64 66 74 50 74 C34 74 20 64 20 48Z" fill="url(#lpPelo)" stroke="#7A7468" stroke-width="2"/>
  <g fill="#5A5E6C"><circle cx="36" cy="28" r="2"/><circle cx="44" cy="24" r="2.2"/><circle cx="56" cy="24" r="2.2"/><circle cx="64" cy="28" r="2"/><circle cx="50" cy="29" r="1.6"/><circle cx="26" cy="46" r="1.6"/><circle cx="74" cy="46" r="1.6"/></g>
  <ellipse cx="50" cy="58" rx="13" ry="9" fill="#FFFFFF" opacity=".9"/>
  <ellipse cx="38" cy="44" rx="6.4" ry="7" fill="url(#lpOlho)" stroke="#3A3E48" stroke-width="1.4"/><ellipse cx="62" cy="44" rx="6.4" ry="7" fill="url(#lpOlho)" stroke="#3A3E48" stroke-width="1.4"/>
  <ellipse cx="38.6" cy="45" rx="2.8" ry="4.6" fill="#1A1C22"/><ellipse cx="61.4" cy="45" rx="2.8" ry="4.6" fill="#1A1C22"/>
  <circle cx="40.4" cy="41.6" r="1.8" fill="#fff"/><circle cx="63.2" cy="41.6" r="1.8" fill="#fff"/>
  <path d="M46 53 C46 51 54 51 54 53 L50 57Z" fill="#E88A8A" stroke="#8E4A4A" stroke-width="1" stroke-linejoin="round"/>
  <path d="M50 57 V60 M50 60 q-4 3 -7 0 M50 60 q4 3 7 0" stroke="#6E6A60" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M38 58 l-14 -2 M38 61 l-13 2 M62 58 l14 -2 M62 61 l13 2" stroke="#9A9488" stroke-width=".8" stroke-linecap="round"/>
  <ellipse cx="32" cy="55" rx="4" ry="2.2" fill="#FFB8B0" opacity=".5"/><ellipse cx="68" cy="55" rx="4" ry="2.2" fill="#FFB8B0" opacity=".5"/>
  <path d="M28 34 C32 26 40 22 48 21" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# ---------- capa ----------
terr = ''
for i, (y, c0, c1) in enumerate([(74, '#B8D84A', '#7AA02A'), (82, '#E07A4A', '#9A3E1E'), (90, '#7CCB5A', '#3E8A2A'), (98, '#A8DC6A', '#5E9A3A')]):
    x0 = 104 - i * 8
    terr += f'<path d="M{x0} {y} C{x0 + 24} {y - 3} 150 {y - 3} 170 {y - 5} V{y + 3} C150 {y + 5} {x0 + 24} {y + 6} {x0 - 2} {y + 6}Z" fill="{c0}" stroke="{c1}" stroke-width=".8"/>'
    terr += f'<path d="M{x0 - 2} {y + 6} C{x0 + 24} {y + 6} 150 {y + 5} 170 {y + 3} V{y + 8} C150 {y + 10} {x0 + 24} {y + 11} {x0 - 4} {y + 11}Z" fill="#B0A090" stroke="#6E5E52" stroke-width=".7"/>'
    terr += ''.join(f'<path d="M{x0 + 6 + k * 9} {y + 7} v3" stroke="#6E5E52" stroke-width=".5"/>' for k in range(int((170 - x0) / 9)))
casas = ''.join(f'<path d="M{x} {y} v-6 h10 v6Z" fill="#E8C9A0" stroke="#7A4E2E" stroke-width=".7"/><path d="M{x - 1.5} {y - 6} L{x + 5} {y - 11} L{x + 11.5} {y - 6}Z" fill="#D2502E" stroke="#7A2A14" stroke-width=".7"/><rect x="{x + 4}" y="{y - 4}" width="2.4" height="4" fill="#5E3414"/>' for x, y in [(58, 100), (72, 104), (46, 106)])
S.append(f'''<symbol id="capa-andes" viewBox="0 0 170 110">
  <defs>{ceu('cpAdC', '#5E9ADE', '#F8E8D4')}{lg('cpAdM', '#B0948C', '#5E4658')}{lg('cpAdL', '#6EE0D8', '#1E8AA8')}{lg('cpAdG', '#FFFFFF', '#B4DAF4')}{lg('cpAdP', '#D8CC78', '#8E9A48')}{lg('cpAdT', '#8EB85A', '#5E8A3A')}</defs>
  <rect width="170" height="110" fill="url(#cpAdC)"/>
  <circle cx="22" cy="18" r="14" fill="#FFE8A8" opacity=".35"/><circle cx="22" cy="18" r="8" fill="#FFE27A" stroke="#F0A81E" stroke-width=".9"/>
  <path d="M0 58 L18 38 L30 46 L44 32 L100 40 L114 26 L128 36 L144 30 L170 46 V70 H0Z" fill="#B8C2E2" opacity=".85"/>
  <path d="M108 32 L114 26 L120 32 L114 34Z M138 34 L144 30 L150 34 L144 36Z M12 44 L18 38 L24 44 L18 46Z" fill="#fff"/>
  <path d="M0 86 L24 54 L50 22 L62 10 L72 20 L84 16 L104 40 L126 62 L150 84Z" fill="url(#cpAdM)" stroke="#4E3A4A" stroke-width="1" stroke-linejoin="round"/>
  <path d="M84 16 L104 40 L126 62 L150 84 H96 C94 64 90 40 84 16Z" fill="#3E2E44" opacity=".3"/>
  <path d="M30 60 L40 54 M108 50 L116 58 M36 70 l8 -4" stroke="#4E3A4A" stroke-width=".8" opacity=".7"/>
  <path d="M50 22 L62 10 L72 20 L84 16 L94 28 C88 30 84 36 82 44 C80 50 78 56 76 60 C74 62 71 62 70 59 C68 50 66 40 62 34 C58 30 52 30 46 28Z" fill="url(#cpAdG)" stroke="#7AA4C8" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M62 18 C66 26 70 34 72 46 M80 24 C78 34 76 44 74 54 M64 34 h10 M70 44 h8" stroke="#9CC8EA" stroke-width=".8" fill="none"/>
  <path d="M52 24 C56 18 60 14 63 13" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M73 62 C76 66 80 68 84 70" stroke="#4ECAF0" stroke-width="1.4" fill="none"/>
  <path d="M0 110 V82 C20 74 50 74 76 76 C90 76 100 74 110 70 L170 64 V110Z" fill="url(#cpAdP)"/>
  <ellipse cx="90" cy="73" rx="15" ry="3.6" fill="url(#cpAdL)" stroke="#16607A" stroke-width=".8"/><path d="M80 72 h10 M94 74 h6" stroke="#E6FFFF" stroke-width=".8"/>
  <path d="M92 110 L84 82 C110 74 140 70 170 66 V110Z" fill="url(#cpAdT)"/>
  {terr}
  <path d="M100 76 C98 84 94 92 88 98 C84 102 80 104 76 106" stroke="#3E8AE6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  {casas}
  <g transform="translate(116 8)"><svg width="30" height="18" viewBox="0 0 170 100"><use class="sem" href="#f-condor"/></svg></g>
  <svg x="2" y="54" width="48" height="52" viewBox="0 0 120 130"><use class="sem" href="#f-lhama"/></svg>
  <g fill="#C84A8A">{''.join(f'<circle cx="{x}" cy="{y}" r="1.6"/>' for x, y in [(34, 104), (40, 107), (28, 101)])}</g><g fill="#FFD447">{''.join(f'<circle cx="{x}" cy="{y}" r="1.4"/>' for x, y in [(37, 100), (30, 107)])}</g>
  {capim(0, 60, 110, 22, '#7A7A2E', (4, 9), 1)}
</symbol>''')
