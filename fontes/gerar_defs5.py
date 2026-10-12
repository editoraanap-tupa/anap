# figurinhas antigas redesenhadas (executado dentro de gerar_defs2.py); substituem as do defs.html
random.seed(51)
def lg(i, a, b, x2=0, y2=1):
    return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
def rg(i, a, b, c, cx=.38, cy=.32):
    return f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r=".75"><stop offset="0" stop-color="{a}"/><stop offset=".6" stop-color="{b}"/><stop offset="1" stop-color="{c}"/></radialGradient>'
def ondas(x0, x1, y, cor, w=1.4, op=.8):
    return f'<path d="M{x0} {y} ' + ' '.join('q4 -2 8 0' for _ in range(int((x1 - x0) / 8))) + f'" stroke="{cor}" stroke-width="{w}" fill="none" opacity="{op}"/>'
def pessoa(x, y, pele, roupa, s=1, aceno=False):
    braco = f'<path d="M{x + 3 * s} {y - 13 * s} l{5 * s} {-7 * s}" stroke="{pele}" stroke-width="{2.4 * s}" stroke-linecap="round"/>' if aceno else ''
    return f'<path d="M{x - 4 * s} {y} L{x - 4 * s} {y - 14 * s} C{x - 4 * s} {y - 18 * s} {x + 4 * s} {y - 18 * s} {x + 4 * s} {y - 14 * s} L{x + 4 * s} {y}Z" fill="{roupa}" stroke="#12235A" stroke-width="{.9 * s}"/>{braco}<circle cx="{x}" cy="{y - 21 * s}" r="{4.4 * s}" fill="{pele}" stroke="#12235A" stroke-width="{.9 * s}"/><path d="M{x - 4.4 * s} {y - 22 * s} C{x - 4 * s} {y - 27 * s} {x + 4 * s} {y - 27 * s} {x + 4.4 * s} {y - 22 * s}" fill="#2E1E14"/>'

# boto-cor-de-rosa saltando
S.append(f'''<symbol id="f-boto" viewBox="0 0 150 100">
  <defs>{lg('btCorpo', '#FFD2E4', '#E86AA6')}{lg('btAgua', '#7FD0FF', '#2E7BF6')}</defs>
  <ellipse cx="44" cy="90" rx="38" ry="7" fill="url(#btAgua)" stroke="#1B56C4" stroke-width="1.4"/>
  {ondas(10, 80, 90, '#E6F6FF')}
  <path d="M22 86 C18 76 22 70 30 66 C28 74 30 80 34 86" fill="#9FDcFF" opacity=".8"/><circle cx="16" cy="74" r="3" fill="#BFE6FF"/><circle cx="72" cy="78" r="2.4" fill="#BFE6FF"/><circle cx="80" cy="70" r="1.6" fill="#BFE6FF"/>
  <path d="M36 82 C26 78 18 82 10 76 C18 74 24 70 30 70 C26 64 26 58 30 54 C34 62 38 68 44 72Z" fill="#E86AA6" stroke="#8E2E5E" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M38 76 C40 50 64 30 92 26 C108 24 118 28 124 34 C132 34 142 36 148 40 C142 44 132 44 124 44 C116 52 100 58 84 60 C68 64 54 72 44 80Z" fill="url(#btCorpo)" stroke="#8E2E5E" stroke-width="2" stroke-linejoin="round"/>
  <path d="M60 60 C76 56 96 54 112 50 C120 48 124 46 126 44 C116 52 100 58 84 60 C72 62 64 64 56 68Z" fill="#FFE6F0" opacity=".85"/>
  <path d="M84 56 C82 66 76 74 68 78 C70 70 72 62 76 58Z" fill="#E86AA6" stroke="#8E2E5E" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M72 38 C74 32 78 28 84 28 C82 32 80 36 80 40Z" fill="#F08AB8" stroke="#8E2E5E" stroke-width="1.4"/>
  <path d="M60 46 C74 34 96 30 112 30" stroke="#FFF0F6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <circle cx="118" cy="36" r="2.8" fill="#12121A"/><circle cx="118.8" cy="35.2" r=".9" fill="#fff"/>
  <path d="M126 40 C134 40 142 41 147 40" stroke="#8E2E5E" stroke-width="1.2" fill="none"/>
  <ellipse cx="110" cy="42" rx="4" ry="2" fill="#FF8AB8" opacity=".7"/>
</symbol>''')

# vitória-régia
veias = ''.join(f'<path d="M75 50 L{75 + math.cos(a) * 62:.1f} {50 + math.sin(a) * 20:.1f}" stroke="#2E8A3A" stroke-width="1.2" opacity=".7"/>' for a in [i * math.pi / 9 for i in range(18)])
S.append(f'''<symbol id="f-vitoria" viewBox="0 0 150 80">
  <defs>{rg('vtFolha', '#9BE07A', '#4FB050', '#2E8A3A', .45, .4)}{lg('vtAgua', '#8ED8F8', '#3E9AD8')}{lg('vtBorda', '#E07A8A', '#8E2E3E')}{lg('vtPet', '#FFFFFF', '#FFB8D2')}</defs>
  <ellipse cx="75" cy="58" rx="74" ry="20" fill="url(#vtAgua)" opacity=".85"/>
  {ondas(6, 146, 72, '#E6F6FF', 1.2, .7)}
  <ellipse cx="128" cy="62" rx="18" ry="5" fill="#4FB050" stroke="#2E6A2A" stroke-width="1.2"/><path d="M128 62 L144 60" stroke="#E6F6FF" stroke-width="1.6"/>
  <ellipse cx="75" cy="54" rx="66" ry="21" fill="url(#vtBorda)" stroke="#6E1E2E" stroke-width="1.6"/>
  <ellipse cx="75" cy="50" rx="64" ry="19" fill="url(#vtFolha)" stroke="#2E6A2A" stroke-width="1.8"/>
  {veias}
  <path d="M75 50 L139 50" stroke="#BFE6FF" stroke-width="3" opacity=".7"/>
  <path d="M24 44 C40 36 62 34 80 34" stroke="#D6F8B8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <g transform="translate(46 36)">
    <path d="M0 6 C-12 2 -16 -6 -12 -12 C-6 -6 -2 -2 0 0Z M0 6 C12 2 16 -6 12 -12 C6 -6 2 -2 0 0Z" fill="url(#vtPet)" stroke="#C2508A" stroke-width="1.1"/>
    <path d="M0 4 C-8 -4 -8 -14 -3 -20 C-1 -12 0 -6 0 0Z M0 4 C8 -4 8 -14 3 -20 C1 -12 0 -6 0 0Z" fill="url(#vtPet)" stroke="#C2508A" stroke-width="1.1"/>
    <path d="M0 4 C-3 -6 -2 -16 0 -22 C2 -16 3 -6 0 4Z" fill="#FFE6F0" stroke="#C2508A" stroke-width="1"/>
    <ellipse cx="0" cy="2" rx="5" ry="3" fill="#FFD447" stroke="#B07A08" stroke-width=".8"/>
  </g>
  <g transform="translate(100 44)"><path d="M0 0 C-5 -4 -5 -12 0 -16 C5 -12 5 -4 0 0Z" fill="#E0507A" stroke="#8E2E3E" stroke-width="1"/><path d="M-1 -12 q1 -2 2 0" stroke="#FFB8D2" stroke-width="1.4" fill="none"/></g>
</symbol>''')

# casa ribeirinha (palafita)
tabuas = ''.join(f'<path d="M{x} 50 V82" stroke="#9A5A2A" stroke-width="1" opacity=".7"/>' for x in range(42, 120, 8))
S.append(f'''<symbol id="f-ribeirinha" viewBox="0 0 160 130">
  <defs>{lg('rbMad', '#E9A15D', '#B86E30')}{lg('rbTel', '#E5503C', '#9A2A1A')}{lg('rbRio', '#C9A46A', '#7A5A30')}{lg('rbCeu', '#BFE6FF', '#FFFFFF')}</defs>
  <g transform="translate(140 72)"><path d="M0 30 C-2 10 2 -6 0 -24" stroke="#6E4A2A" stroke-width="3" fill="none"/><path d="M0 -24 c-10 -2 -18 4 -20 10 c6 -6 12 -8 20 -10Z M0 -24 c10 -4 18 0 22 6 c-8 -4 -14 -6 -22 -6Z M0 -24 c-4 -10 0 -16 6 -18 c-2 6 -4 12 -6 18Z" fill="#4EA83A" stroke="#245A22" stroke-width="1"/><g fill="#4A1E5A"><circle cx="-3" cy="-20" r="2"/><circle cx="1" cy="-19" r="2"/><circle cx="-1" cy="-17" r="2"/></g></g>
  <path d="M4 100 C40 94 120 94 156 100 V126 C120 130 40 130 4 126Z" fill="url(#rbRio)"/>
  {ondas(4, 156, 104, '#F2DDB0', 1.2, .8)}{ondas(10, 150, 116, '#F2DDB0', 1.2, .6)}
  <g stroke="#5E3414" stroke-width="4" stroke-linecap="round">{''.join(f'<path d="M{x} 84 V118"/>' for x in (44, 64, 96, 116))}</g>
  <path d="M30 82 H130 V88 H30Z" fill="#8A4E22" stroke="#4E2A10" stroke-width="1.4"/>
  <path d="M38 50 H122 V82 H38Z" fill="url(#rbMad)" stroke="#6E3A14" stroke-width="1.8"/>
  {tabuas}
  <path d="M28 52 L80 22 L132 52Z" fill="url(#rbTel)" stroke="#6E1E10" stroke-width="2" stroke-linejoin="round"/>
  <path d="M38 48 L80 26 L122 48" stroke="#FF8A6A" stroke-width="1.6" fill="none"/>
  <rect x="48" y="58" width="18" height="24" fill="#5E3414" stroke="#3E1E0C" stroke-width="1.4"/><circle cx="62" cy="70" r="1.4" fill="#FFC83D"/>
  <rect x="96" y="58" width="18" height="14" fill="#BFE6FF" stroke="#6E3A14" stroke-width="1.6"/><path d="M105 58 V72 M96 65 H114" stroke="#6E3A14" stroke-width="1.2"/>
  <path d="M72 62 C76 70 86 70 90 62" stroke="#E5392C" stroke-width="2.4" fill="none"/><path d="M72 62 v-4 M90 62 v-4" stroke="#6E3A14" stroke-width="1.2"/>
  {pessoa(76, 82, '#B87A50', '#2E7BF6', .9, True)}{pessoa(88, 82, '#8A5430', '#FFC83D', .7)}
  <path d="M30 84 L22 92 M130 84 L138 92" stroke="#5E3414" stroke-width="2"/>
  <path d="M40 112 C52 120 86 120 100 112 C96 108 46 108 40 112Z" fill="#8A4E22" stroke="#4E2A10" stroke-width="1.6"/><path d="M44 112 H96" stroke="#C88450" stroke-width="1.4"/>
  <path d="M86 104 L106 124" stroke="#6E3A14" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="106" cy="124" rx="3" ry="5" transform="rotate(-45 106 124)" fill="#C88450" stroke="#6E3A14" stroke-width="1"/>
  {pessoa(66, 112, '#C98A5A', '#22A565', .7)}
</symbol>''')

# mandacaru
costelas = ''.join(f'<path d="M{x} {y0} V{y1}" stroke="#1E6B3A" stroke-width="1.2" opacity=".7"/>' for x, y0, y1 in [(44, 24, 138), (50, 20, 138), (56, 24, 138), (22, 62, 104), (78, 46, 96)])
espinhos = ''.join(f'<path d="M{x} {y} l-2.4 -1.6 M{x} {y} l2.4 -1.6 M{x} {y} l0 -2.8" stroke="#F6F0D2" stroke-width=".8"/>' for x in (44, 56) for y in range(30, 136, 9)) + ''.join(f'<path d="M{x} {y} l-2 -1.4 M{x} {y} l2 -1.4" stroke="#F6F0D2" stroke-width=".8"/>' for x in (22, 78) for y in range(66, 100, 8))
S.append(f'''<symbol id="f-mandacaru" viewBox="0 0 100 150">
  <defs>{lg('mdC', '#5ACB7A', '#1E7A42', 1, 0)}{lg('mdChao', '#E8C27A', '#B8894A')}</defs>
  <ellipse cx="50" cy="142" rx="34" ry="6" fill="url(#mdChao)" stroke="#8A5E2A" stroke-width="1.2"/>
  <g fill="#B8894A">{''.join(f'<circle cx="{x}" cy="{y}" r="1.6"/>' for x, y in [(26, 142), (70, 141), (78, 144), (32, 145)])}</g>
  <path d="M28 106 C18 106 16 100 16 92 V62 C16 56 28 56 28 62 V96 H40" fill="url(#mdC)" stroke="#145A30" stroke-width="2" stroke-linejoin="round"/>
  <path d="M72 96 C82 96 84 90 84 84 V46 C84 40 72 40 72 46 V86 H60" fill="url(#mdC)" stroke="#145A30" stroke-width="2" stroke-linejoin="round"/>
  <path d="M38 140 V24 C38 12 62 12 62 24 V140Z" fill="url(#mdC)" stroke="#145A30" stroke-width="2.2"/>
  {costelas}{espinhos}
  <path d="M42 30 V130" stroke="#A8F0B8" stroke-width="2.4" opacity=".6" stroke-linecap="round"/>
  <g transform="translate(50 14)">{''.join(f'<ellipse cx="{math.cos(a) * 6:.1f}" cy="{math.sin(a) * 4 - 2:.1f}" rx="5" ry="2.6" transform="rotate({a * 180 / math.pi:.0f} {math.cos(a) * 6:.1f} {math.sin(a) * 4 - 2:.1f})" fill="#FFFFFF" stroke="#C9C2A6" stroke-width=".8"/>' for a in [i * math.pi / 4 for i in range(8)])}<circle cy="-2" r="3" fill="#FFD447" stroke="#B07A08" stroke-width=".8"/></g>
  <ellipse cx="22" cy="58" rx="4.6" ry="5.4" fill="#E0307A" stroke="#8E1E4A" stroke-width="1.2"/><path d="M20 55 q2 -2 4 0" stroke="#FFB8D2" stroke-width="1.2" fill="none"/>
  <ellipse cx="78" cy="42" rx="4" ry="4.8" fill="#E0307A" stroke="#8E1E4A" stroke-width="1.2"/>
</symbol>''')

# asa-branca em voo
S.append(f'''<symbol id="f-asabranca" viewBox="0 0 120 80">
  <defs>{lg('abCorpo', '#B8C4DA', '#7A86A6')}{lg('abAsa', '#9AA8C6', '#5E6A8A')}</defs>
  <path d="M58 40 C46 26 30 10 10 6 C16 14 22 22 30 30 C20 30 12 34 8 40 C22 40 40 42 56 46Z" fill="url(#abAsa)" stroke="#2E3A5A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M10 6 C16 14 22 22 30 30 C34 24 30 14 22 8Z" fill="#FFFFFF" stroke="#2E3A5A" stroke-width="1.2"/>
  <path d="M30 30 C26 28 18 28 14 30 M36 30 C32 22 26 16 20 12" stroke="#4E5A7A" stroke-width="1" fill="none"/>
  <path d="M30 48 L12 52 L16 46 L10 42 L32 42Z" fill="#6E7A9A" stroke="#2E3A5A" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 48 L28 46" stroke="#fff" stroke-width="1.6"/>
  <path d="M28 44 C40 34 66 30 86 34 C94 36 98 40 96 46 C92 52 70 56 48 54 C38 54 30 50 28 44Z" fill="url(#abCorpo)" stroke="#2E3A5A" stroke-width="1.8"/>
  <path d="M50 52 C62 54 78 52 90 48" stroke="#E6D2D6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M86 34 C92 30 100 30 104 34 C106 38 102 42 96 44 C92 42 88 38 86 34Z" fill="#9AA8C6" stroke="#2E3A5A" stroke-width="1.6"/>
  <path d="M104 35 L112 37 L104 39Z" fill="#3E3A3A" stroke="#1E1A1A" stroke-width=".8"/>
  <circle cx="99" cy="36" r="2.4" fill="#E5603C" stroke="#7A1E10" stroke-width=".8"/><circle cx="99" cy="36" r="1" fill="#12121A"/>
  <path d="M60 38 C76 28 96 22 116 22 C108 30 96 38 80 42Z" fill="url(#abAsa)" stroke="#2E3A5A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M116 22 C108 30 100 34 92 38 C98 30 106 24 116 22Z" fill="#FFFFFF" stroke="#2E3A5A" stroke-width="1.1"/>
  <path d="M40 40 C54 34 70 32 84 34" stroke="#E6ECF6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# tatu-bola
faixas = ''.join(f'<path d="M{x} {y0} C{x - 2} {y0 + 14} {x - 2} {y0 + 26} {x} 60" stroke="#6E4A22" stroke-width="1.6" fill="none"/>' for x, y0 in [(48, 20), (56, 18), (64, 18), (72, 20)])
placas = ''.join(f'<path d="M{x} {y} l3 -2 l3 2 l-3 2Z" fill="#E8C890" stroke="#8A6030" stroke-width=".6"/>' for x in range(26, 96, 7) for y in (34, 44, 54) if not (46 <= x <= 74))
S.append(f'''<symbol id="f-tatu" viewBox="0 0 120 80">
  <defs>{rg('ttCasco2', '#F2D8A6', '#CFA466', '#8A6030', .4, .25)}</defs>
  <ellipse cx="60" cy="72" rx="44" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M22 58 C14 60 8 64 4 62 C8 58 12 54 20 52Z" fill="url(#ttCasco2)" stroke="#5E3E18" stroke-width="1.4"/>
  <path d="M30 60 l-2 10 h6 l1 -8 M80 60 l2 10 h6 l-1 -10" fill="#C9A06A" stroke="#5E3E18" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M18 60 C16 32 40 14 62 14 C84 14 100 30 98 60Z" fill="url(#ttCasco2)" stroke="#5E3E18" stroke-width="2"/>
  {faixas}{placas}
  <path d="M30 32 C38 22 52 18 62 18" stroke="#FFF2D8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M18 60 H98" stroke="#5E3E18" stroke-width="2"/>
  <path d="M94 40 C102 36 112 40 114 48 C116 54 110 60 102 60 C96 60 92 52 94 40Z" fill="#D9B07A" stroke="#5E3E18" stroke-width="1.6"/>
  <path d="M96 40 C100 34 106 34 108 40 C104 40 100 40 96 40Z" fill="#E8C890" stroke="#5E3E18" stroke-width="1.2"/>
  <path d="M100 36 l-2 -8 l5 6Z M106 36 l1 -8 l3 7Z" fill="#C99A62" stroke="#5E3E18" stroke-width="1"/>
  <circle cx="106" cy="46" r="2.2" fill="#12121A"/><circle cx="106.6" cy="45.4" r=".7" fill="#fff"/>
  <path d="M114 50 l3 1" stroke="#5E3E18" stroke-width="1.4" stroke-linecap="round"/>
</symbol>''')

# umbuzeiro com as batatas que guardam água
S.append(f'''<symbol id="f-umbu" viewBox="0 0 150 130">
  <defs>{rg('umC1', '#A8E07A', '#5EAE48', '#2E7A2A')}{rg('umC2', '#8ACF66', '#4A9A3A', '#26662A')}{lg('umSolo', '#C9945A', '#8A5A2A')}{lg('umAg', '#9FDcFF', '#2E7BF6')}</defs>
  <path d="M4 94 C30 90 120 90 146 94 C140 112 120 126 96 128 C70 130 40 128 22 120 C12 114 6 104 4 94Z" fill="url(#umSolo)" stroke="#5E3A18" stroke-width="1.6"/>
  <path d="M4 94 C30 90 120 90 146 94" stroke="#6EAE3A" stroke-width="3" fill="none"/>
  <g stroke="#6E4A2A" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M75 92 C66 100 52 104 40 110 M75 92 C84 102 96 104 110 112 M75 92 C74 104 72 112 76 120"/></g>
  {''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#E8C890" stroke="#6E4A2A" stroke-width="1.4"/><path d="M{x} {y - ry * .5} c-2 3 -2 5 0 6 c2 -1 2 -3 0 -6Z" fill="url(#umAg)" stroke="#1B56C4" stroke-width=".6"/>' for x, y, rx, ry in [(38, 112, 9, 6), (112, 114, 10, 6.5), (76, 121, 8, 5.4)])}
  <path d="M70 92 C70 80 64 72 56 64 M80 92 C80 78 88 70 98 62 M74 92 C74 76 76 66 74 56" stroke="#5E3A1E" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M70 92 C70 80 64 72 56 64 M80 92 C80 78 88 70 98 62" stroke="#8A5E36" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="{copa(46, 52, 34, 20, 11, .2)}" fill="url(#umC2)" stroke="#1E5A22" stroke-width="1.8"/>
  <path d="{copa(106, 50, 34, 20, 11, .2)}" fill="url(#umC2)" stroke="#1E5A22" stroke-width="1.8"/>
  <path d="{copa(76, 40, 44, 24, 13, .2)}" fill="url(#umC1)" stroke="#1E5A22" stroke-width="1.8"/>
  {tex(76, 46, 50, 16, 14, '#2E6A2A', 1.2)}
  <path d="M48 30 q16 -10 34 -8" stroke="#D8F8B8" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <g>{''.join(f'<circle cx="{x}" cy="{y}" r="3.4" fill="#DDE87A" stroke="#7A8A2A" stroke-width="1"/><circle cx="{x - 1}" cy="{y - 1}" r="1" fill="#fff" opacity=".8"/>' for x, y in [(52, 58), (64, 48), (92, 44), (108, 58), (84, 60), (34, 50), (120, 46)])}</g>
</symbol>''')

# cartões-postais das vilas (f-ganvie, f-kopanyi, f-barcoescola) agora ficam em gerar_defs_vilas.py
