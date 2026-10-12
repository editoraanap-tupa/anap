# figurinhas e capa dos Grandes Lagos (executado dentro de gerar_defs2.py, depois do gerar_defs5.py)
random.seed(73)

# castor (Tico)
escamas_rabo = ''.join(f'<path d="M{x} 82 L{x + 6} 96" stroke="#2A1C12" stroke-width=".9" opacity=".55"/>' for x in range(10, 44, 6)) + ''.join(f'<path d="M{x} 96 L{x + 7} 82" stroke="#2A1C12" stroke-width=".9" opacity=".55"/>' for x in range(8, 44, 6))
pelo = ''.join(f'<path d="M{R(42, 86):.1f} {R(44, 84):.1f} q2 -3 4 -1" stroke="#6A3A18" stroke-width="1" fill="none" opacity=".55" stroke-linecap="round"/>' for _ in range(14))
S.append(f'''<symbol id="f-castor" viewBox="0 0 120 100">
  <defs>{lg('lgCaCorpo', '#C07E44', '#7A4620')}{rg('lgCaRosto', '#DDA466', '#B87638', '#8E5426', .4, .3)}{lg('lgCaRabo', '#6A5444', '#33241A')}{lg('lgCaBar', '#F0CDA0', '#CC9862')}{lg('lgCaGalho', '#C9925A', '#8A5A2E')}
  <clipPath id="lgCaRaboClip"><path d="M44 84 C30 78 10 80 4 88 C2 96 20 99 46 93Z"/></clipPath></defs>
  <ellipse cx="58" cy="96" rx="50" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M44 84 C30 78 10 80 4 88 C2 96 20 99 46 93Z" fill="url(#lgCaRabo)" stroke="#20160E" stroke-width="1.8" stroke-linejoin="round"/>
  <g clip-path="url(#lgCaRaboClip)">{escamas_rabo}</g>
  <path d="M12 85 C22 82 32 82 40 84" stroke="#9A8270" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M38 84 C30 62 38 40 60 34 C82 30 94 46 92 66 C90 84 80 93 62 93 C50 93 42 90 38 84Z" fill="url(#lgCaCorpo)" stroke="#4A2810" stroke-width="2"/>
  {pelo}
  <path d="M62 52 C76 50 84 62 82 76 C80 86 72 90 64 89 C58 78 56 64 62 52Z" fill="url(#lgCaBar)" stroke="#9A6634" stroke-width="1.2"/>
  <path d="M44 56 C48 46 54 40 62 38" stroke="#E8B47A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M56 90 C52 96 60 98 70 97 C76 96 76 92 72 90Z" fill="#3E2A1C" stroke="#20160E" stroke-width="1.3"/><path d="M60 96 l2 -4 M65 97 l1 -5 M70 96 l0 -4" stroke="#6A5444" stroke-width=".9"/>
  <circle cx="64" cy="13" r="5.6" fill="#8E5426" stroke="#4A2810" stroke-width="1.6"/><circle cx="64" cy="13" r="2.6" fill="#5E3418"/>
  <circle cx="88" cy="10" r="5" fill="#8E5426" stroke="#4A2810" stroke-width="1.6"/><circle cx="88" cy="10" r="2.2" fill="#5E3418"/>
  <path d="M58 30 C58 16 70 9 82 9 C96 9 106 18 106 30 C106 42 96 49 82 49 C68 49 58 42 58 30Z" fill="url(#lgCaRosto)" stroke="#4A2810" stroke-width="2"/>
  <path d="M64 22 C68 15 76 12 84 12" stroke="#F2C48A" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="96" cy="35" rx="11" ry="8.4" fill="#EBC492" stroke="#9A6634" stroke-width="1.2"/>
  <rect x="91" y="40" width="9" height="9.4" rx="2" fill="#F2A13A" stroke="#8A5214" stroke-width="1.2"/><path d="M95.5 40.5 V49" stroke="#8A5214" stroke-width="1"/><path d="M92.6 42 h2" stroke="#FFE0A8" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="103" cy="29.5" rx="4.6" ry="3.4" fill="#1E1410"/><ellipse cx="102" cy="28.4" rx="1.6" ry="1" fill="#fff" opacity=".8"/>
  <path d="M96 38.5 q4 2 8 -.5" stroke="#5E3418" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <g stroke="#5E3418" stroke-width=".8" stroke-linecap="round" opacity=".8"><path d="M98 34 l14 -3 M99 36 l13 1 M92 34 l-10 -2"/></g>
  <circle cx="82" cy="25" r="5.4" fill="#16100C"/><circle cx="84" cy="22.8" r="2" fill="#fff"/><circle cx="80.6" cy="27" r=".9" fill="#fff" opacity=".8"/>
  <path d="M76 17 q5 -3 10 -1" stroke="#4A2810" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="88" cy="38" rx="4" ry="2.4" fill="#FF8A8A" opacity=".45"/>
  <path d="M70 66 L112 54" stroke="#5A3414" stroke-width="5.4" stroke-linecap="round"/><path d="M70 66 L112 54" stroke="url(#lgCaGalho)" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M104 56 C106 48 112 44 118 44 C116 50 112 54 104 56Z" fill="#5FB84A" stroke="#2E6A22" stroke-width="1.1"/>
  <path d="M110 54 C114 52 118 54 119 58 C114 59 112 58 110 54Z" fill="#E8603A" stroke="#8E2E14" stroke-width="1"/>
  <ellipse cx="80" cy="64" rx="6" ry="4.6" fill="#8E5426" stroke="#4A2810" stroke-width="1.4"/><ellipse cx="92" cy="61" rx="5.4" ry="4.2" fill="#9A5E2E" stroke="#4A2810" stroke-width="1.4"/>
</symbol>''')

# mobelha-grande
pintas = ''.join(f'<rect x="{x + (3 if (y // 6) % 2 else 0)}" y="{y}" width="2.4" height="1.8" rx=".6" fill="#F4F6FA"/>' for x in range(22, 80, 7) for y in range(42, 56, 5))
S.append(f'''<symbol id="f-mobelha" viewBox="0 0 130 90">
  <defs>{lg('lgMoAgua', '#8FD2F6', '#2E7BC6')}{lg('lgMoCorpo', '#3A4250', '#12161E')}{rg('lgMoCab', '#3E6A5A', '#1A2A26', '#0C1210', .4, .3)}
  <clipPath id="lgMoClip"><path d="M10 54 C16 38 48 34 78 38 C94 40 102 46 100 56 C90 64 40 66 10 54Z"/></clipPath></defs>
  <ellipse cx="62" cy="70" rx="60" ry="14" fill="url(#lgMoAgua)" stroke="#1E5A9A" stroke-width="1.4"/>
  {ondas(8, 118, 74, '#E6F6FF', 1.2, .8)}{ondas(22, 104, 80, '#E6F6FF', 1, .55)}
  <path d="M10 54 C16 38 48 34 78 38 C94 40 102 46 100 56 C90 64 40 66 10 54Z" fill="url(#lgMoCorpo)" stroke="#06080C" stroke-width="2"/>
  <g clip-path="url(#lgMoClip)">{pintas}</g>
  <path d="M20 46 C34 40 52 38 70 39" stroke="#6A7488" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M12 54 C8 50 4 50 2 52 C6 54 8 56 12 56Z" fill="#12161E"/>
  <path d="M84 44 C84 34 88 26 94 22 L104 24 C98 30 96 38 98 48Z" fill="#1A2A26" stroke="#06080C" stroke-width="1.8" stroke-linejoin="round"/>
  <g stroke="#F4F6FA" stroke-width="1.3" stroke-linecap="round"><path d="M88 33 l2 4 M91 31 l2 4 M94 30 l2 4 M97 30 l1.6 4"/></g>
  <path d="M86 40 C90 42 94 42 98 41" stroke="#F4F6FA" stroke-width="1.6" fill="none" stroke-dasharray="1.6 1.4"/>
  <ellipse cx="101" cy="22" rx="12" ry="10" fill="url(#lgMoCab)" stroke="#06080C" stroke-width="2"/>
  <path d="M111 21 L129 25 L111 27Z" fill="#2A2E36" stroke="#06080C" stroke-width="1.4" stroke-linejoin="round"/><path d="M112 24 h12" stroke="#5A6070" stroke-width=".9"/>
  <circle cx="104" cy="19" r="3.6" fill="#D8262A" stroke="#5A0A0A" stroke-width="1"/><circle cx="104.4" cy="19.2" r="1.7" fill="#12121A"/><circle cx="105.2" cy="18" r="1" fill="#fff"/>
  <path d="M94 14 q6 -4 12 -2" stroke="#6AA090" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M20 60 C40 64 70 64 96 58" stroke="#BFE6FF" stroke-width="2" fill="none" opacity=".75"/>
</symbol>''')

# alce
S.append(f'''<symbol id="f-alce" viewBox="0 0 120 120">
  <defs>{lg('lgAlCorpo', '#7A5232', '#3E2614')}{lg('lgAlPerna', '#6A4A30', '#C8B49A')}{lg('lgAlChifre', '#F0DAB0', '#C49E66')}{rg('lgAlCab', '#9A6A42', '#6E4626', '#4A2E16', .45, .3)}</defs>
  <ellipse cx="62" cy="115" rx="50" ry="4" fill="#0A1440" opacity=".18"/>
  <g transform="translate(5 9) scale(.91)">
  <g stroke="#2A1A0E" stroke-width="1.4" stroke-linejoin="round">
    <path d="M42 70 C44 84 42 96 44 110 h5 C49 98 52 86 54 74Z M90 70 C94 82 96 94 95 110 h5 C101 96 100 82 100 70Z" fill="url(#lgAlPerna)" opacity=".8"/>
    <path d="M36 66 C30 50 40 36 58 34 C70 26 92 28 102 38 C110 46 110 62 104 72 C98 80 86 80 76 78 H48 C40 78 38 72 36 66Z" fill="url(#lgAlCorpo)"/>
    <path d="M48 72 C52 86 50 100 51 112 h6 C58 100 60 86 62 76Z M80 74 C84 88 84 100 84 112 h6 C91 100 92 86 94 72Z" fill="url(#lgAlPerna)"/>
    <path d="M102 42 C110 44 112 52 108 58 C106 52 104 48 102 42Z" fill="#4A2E16"/>
  </g>
  <path d="M43 111 h7 M50 113 h8 M83 113 h8 M94 111 h7" stroke="#2A1A0E" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M58 36 C70 30 86 30 96 36" stroke="#A87A52" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M32 28 C22 24 10 20 4 10 C3 6 4 2 6 0 C8 4 10 6 12 6 C12 2 13 -1 15 -2 C16 2 18 5 20 6 C21 2 23 0 25 0 C26 4 26 8 28 10 C30 8 32 8 34 10 C34 16 36 22 32 28Z" fill="url(#lgAlChifre)" stroke="#7A5A2E" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M42 28 C42 20 46 14 52 12 C54 8 56 4 58 2 C59 6 60 8 62 8 C64 4 66 2 68 2 C68 6 68 10 70 12 C72 10 74 10 76 10 C74 16 72 20 66 22 C58 26 50 28 42 28Z" fill="url(#lgAlChifre)" stroke="#7A5A2E" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M10 12 C18 18 24 22 30 25 M48 22 C56 18 62 14 68 10" stroke="#FFF2D8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M24 34 C18 32 14 26 16 22 C22 24 26 28 28 32Z M44 32 C50 28 54 24 54 20 C48 22 44 26 42 30Z" fill="#6E4626" stroke="#2A1A0E" stroke-width="1.2"/>
  <path d="M24 30 C30 24 42 24 46 32 C50 40 46 48 40 54 C36 60 30 66 22 66 C14 66 10 60 12 54 C14 46 18 36 24 30Z" fill="url(#lgAlCab)" stroke="#2A1A0E" stroke-width="1.8"/>
  <path d="M28 66 C30 72 28 78 24 80 C22 76 22 70 24 66Z" fill="#4A2E16" stroke="#2A1A0E" stroke-width="1.2"/>
  <ellipse cx="17" cy="58" rx="7" ry="6" fill="#8A5E3A" stroke="#2A1A0E" stroke-width="1.2"/>
  <ellipse cx="14" cy="57" rx="1.6" ry="1.1" fill="#1A100A"/><ellipse cx="19" cy="57.5" rx="1.6" ry="1.1" fill="#1A100A"/>
  <path d="M14 63 q4 2 8 0" stroke="#2A1A0E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="32" cy="40" r="4.6" fill="#12100C"/><circle cx="33.6" cy="38.4" r="1.7" fill="#fff"/><circle cx="31" cy="41.6" r=".8" fill="#fff" opacity=".7"/>
  <path d="M28 34 q4 -2 8 0" stroke="#2A1A0E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="26" cy="50" rx="3.4" ry="2" fill="#FF8A8A" opacity=".4"/>
  <path d="M26 30 C30 28 36 28 40 30" stroke="#C4946A" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
</symbol>''')

# truta-de-riacho
vermes = ''.join(f'<path d="M{x} {R(14, 24):.1f} q3 -3 6 0 t6 0" stroke="#C8D88A" stroke-width="1.3" fill="none" opacity=".8"/>' for x in range(30, 96, 11))
pontos = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.6" fill="#7AB4FF" opacity=".75"/><circle cx="{x:.1f}" cy="{y:.1f}" r="1.5" fill="#E5262A"/>' for x, y in [(44, 34), (58, 30), (72, 36), (86, 32), (52, 40), (66, 42)]) + ''.join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="#F2D44A"/>' for x, y in [(38, 28), (50, 26), (64, 24), (78, 26), (92, 28), (80, 40), (40, 40)])
S.append(f'''<symbol id="f-truta" viewBox="0 0 130 70">
  <defs>{lg('lgTrCorpo', '#5E7A3A', '#E8783A')}{lg('lgTrBarriga', '#FFB070', '#F05A2A')}
  <clipPath id="lgTrClip"><path d="M20 36 C28 18 56 12 84 14 C104 16 118 26 122 36 C118 46 104 54 84 56 C56 58 28 52 20 36Z"/></clipPath></defs>
  <ellipse cx="70" cy="66" rx="48" ry="3" fill="#0A1440" opacity=".14"/>
  <path d="M22 36 L4 20 C6 28 8 32 8 36 C8 40 6 44 4 52Z" fill="#6E8A42" stroke="#2E3E14" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M8 22 L12 36 L8 50" stroke="#A8C070" stroke-width="1" fill="none" opacity=".7"/>
  <path d="M50 16 C54 6 66 4 72 14Z" fill="#6E8A42" stroke="#2E3E14" stroke-width="1.4"/>
  <path d="M20 36 C28 18 56 12 84 14 C104 16 118 26 122 36 C118 46 104 54 84 56 C56 58 28 52 20 36Z" fill="url(#lgTrCorpo)" stroke="#2E3E14" stroke-width="2"/>
  <g clip-path="url(#lgTrClip)"><path d="M20 44 C40 56 90 58 124 42 V70 H20Z" fill="url(#lgTrBarriga)"/>{vermes}{pontos}<path d="M20 45 C50 52 90 52 122 42" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/></g>
  <path d="M46 54 C48 64 56 66 60 56Z M74 56 C76 66 84 66 86 55Z" fill="#F0602A" stroke="#7A2A0E" stroke-width="1.2"/><path d="M47 55 C49 61 52 63 54 62 M75 57 C77 62 80 64 82 63" stroke="#fff" stroke-width="1.6" fill="none"/>
  <path d="M96 22 C100 30 100 42 96 50" stroke="#2E3E14" stroke-width="1.3" fill="none" opacity=".8"/>
  <circle cx="106" cy="30" r="5.4" fill="#FFF6D8" stroke="#2E3E14" stroke-width="1.2"/><circle cx="107" cy="30.4" r="3.2" fill="#12121A"/><circle cx="108.2" cy="29" r="1.2" fill="#fff"/>
  <path d="M114 40 q4 2 7 -1" stroke="#2E3E14" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M34 26 C50 18 70 16 88 18" stroke="#E6F2C0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
</symbol>''')

# capa
bordos = ''.join(f'<path d="{copa(x, y, rx, ry, 8)}" fill="{c}" stroke="{e}" stroke-width=".9"/><path d="M{x - rx * .5:.1f} {y - ry * .45:.1f} q{rx * .4:.1f} {-ry * .4:.1f} {rx * .8:.1f} {-ry * .2:.1f}" stroke="#FFE6B0" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/>' for x, y, rx, ry, c, e in [(12, 30, 15, 12, '#E8502E', '#8E2414'), (36, 26, 14, 12, '#F29A2E', '#9A5410'), (58, 34, 12, 10, '#F2C83A', '#9A7410'), (24, 42, 13, 9, '#D23A2A', '#7A1A10')])
pinheiros = ''.join(f'<path d="M{x} {y} l-{5*s:.1f} {9*s:.1f} h{3*s:.1f} l-{4*s:.1f} {7*s:.1f} h{12*s:.1f} l-{4*s:.1f} -{7*s:.1f} h{3*s:.1f}Z" fill="{c}" stroke="#1A4038" stroke-width=".7"/>' for x, y, s, c in [(74, 38, 1.1, '#2E6A5A'), (84, 42, .9, '#3A7A66'), (124, 47, .55, '#5A8A96'), (132, 48, .5, '#5A8A96')])
gravetos = ''.join(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="#4A2810" stroke-width="3.2" stroke-linecap="round"/><path d="M{x1} {y1} L{x2} {y2}" stroke="{c}" stroke-width="1.8" stroke-linecap="round"/>' for x1, y1, x2, y2, c in [(54, 98, 78, 96, '#B07A44'), (56, 92, 76, 91, '#9A6234'), (58, 86, 74, 86, '#C08A50'), (60, 81, 72, 80, '#A86E3C'), (62, 76, 70, 76, '#B07A44')])
toca = ''.join(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{c}" stroke-width="2" stroke-linecap="round"/>' for x1, y1, x2, y2, c in [(16, 80, 30, 70, '#8A5A30'), (24, 70, 40, 72, '#A06A38'), (34, 70, 46, 80, '#7A4A22'), (18, 76, 44, 76, '#9A6234'), (22, 72, 34, 66, '#B07A44')])
S.append(f'''<symbol id="capa-lagos" viewBox="0 0 170 110">
  <defs>{lg('lgCpC', '#6EB8EE', '#FFE6C4')}{lg('lgCpLago', '#6EC0F0', '#2A6EC0')}{lg('lgCpLagoa', '#5AA8E0', '#2E6AB0')}{lg('lgCpChao', '#9AC85A', '#5E9A3A')}</defs>
  <rect width="170" height="110" fill="url(#lgCpC)"/>
  <circle cx="104" cy="20" r="13" fill="#FFE27A" opacity=".3"/><circle cx="104" cy="20" r="7.5" fill="#FFC83D" stroke="#F0A81E" stroke-width="1"/>
  <use href="#nuvem" x="122" y="8" width="34" height="16" style="color:#fff" opacity=".9"/>
  <path d="M70 52 C86 44 104 46 118 42 C134 38 152 44 170 40 V56 H70Z" fill="#9AB4D2"/>
  <path d="M96 56 C110 48 124 50 136 52 L140 56Z" fill="#7E9CC0"/>
  {pinheiros}
  <rect x="0" y="55" width="170" height="55" fill="url(#lgCpLago)"/>
  <path d="M84 60 h18 M110 64 h26 M92 70 h14 M140 58 h12" stroke="#E6F6FF" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
  <g transform="translate(152 57)"><path d="M-12 1 C-8 -4 8 -5 14 1Z" fill="#7A7488" stroke="#4E4A5A" stroke-width=".8"/><path d="M-3.6 -2 L-2.6 -24 H2.6 L3.6 -2Z" fill="#fff" stroke="#5A6787" stroke-width=".8"/><path d="M-3.4 -9 H3.4 M-3 -17 H3" stroke="#E5392C" stroke-width="3"/><rect x="-3.4" y="-29" width="6.8" height="5" fill="#FFE27A" stroke="#5A6787" stroke-width=".7"/><path d="M-4.6 -29 L0 -33.6 L4.6 -29Z" fill="#E5392C" stroke="#7A1A10" stroke-width=".7"/><path d="M-3 -27 L-20 -32 V-21Z" fill="#FFF6C8" opacity=".6"/></g>
  <path d="M0 40 C14 34 40 34 62 42 C70 46 78 52 82 58 L82 64 H0Z" fill="url(#lgCpChao)" stroke="#3E7A2A" stroke-width="1"/>
  <path d="M8 36 V50 M34 32 V48 M56 38 V50 M24 44 V54" stroke="#5E3A1E" stroke-width="2.2"/>
  {bordos}
  <path d="M0 64 C20 60 44 60 66 64 L80 66 V110 H0Z" fill="url(#lgCpLagoa)"/>
  <path d="M0 64 C20 60 44 60 66 64" stroke="#BFE6FF" stroke-width="1.4" fill="none"/>
  <path d="M12 82 C12 62 46 60 48 82Z" fill="#8A5A30" stroke="#4A2810" stroke-width="1"/>{toca}
  <path d="M10 82 C20 79 40 79 50 82" stroke="#BFE6FF" stroke-width="1.2" fill="none" opacity=".8"/>
  <path d="M52 110 L58 74 C62 70 70 70 74 74 L82 110Z" fill="#7A4A22" stroke="#3E2414" stroke-width="1"/>{gravetos}
  <svg x="54" y="49" width="32" height="27" viewBox="0 0 120 100"><use class="sem" href="#f-castor"/></svg>
  <svg x="100" y="68" width="40" height="28" viewBox="0 0 130 90"><use class="sem" href="#f-mobelha"/></svg>
  <g transform="translate(148 92) rotate(-30)"><svg x="-14" y="-8" width="28" height="15" viewBox="0 0 130 70"><use class="sem" href="#f-truta"/></svg></g>
  <path d="M134 100 q4 -6 8 0 M152 101 q3 -5 7 0" stroke="#E6F6FF" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="140" cy="94" r="1.2" fill="#E6F6FF"/><circle cx="156" cy="95" r="1" fill="#E6F6FF"/>
  <g stroke="#5A7A2A" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M6 110 q2 -14 0 -26 M12 110 q0 -12 4 -22 M44 110 q2 -10 -2 -20"/></g>
  <g fill="#7A4A22" stroke="#3E2414" stroke-width=".6"><ellipse cx="6" cy="84" rx="1.8" ry="5"/><ellipse cx="16" cy="88" rx="1.8" ry="5"/><ellipse cx="42" cy="90" rx="1.8" ry="5"/></g>
</symbol>''')
