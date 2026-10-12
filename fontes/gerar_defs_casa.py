# figurinhas e capa da parada "De volta para casa" (executado dentro de gerar_defs2.py)
random.seed(83)

def notinha(x, y, s, cor):
    return f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 V-12 L8 -14 V-2" stroke="{cor}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="-2" cy="0" rx="3" ry="2.2" fill="{cor}"/><ellipse cx="6" cy="-2" rx="3" ry="2.2" fill="{cor}"/></g>'

def florzinha(x, y, r, cor, esc):
    p = ''.join(f'<ellipse cx="{x + math.cos(a) * r * .9:.1f}" cy="{y + math.sin(a) * r * .9:.1f}" rx="{r * .75:.1f}" ry="{r * .5:.1f}" transform="rotate({a * 180 / math.pi:.0f} {x + math.cos(a) * r * .9:.1f} {y + math.sin(a) * r * .9:.1f})" fill="{cor}" stroke="{esc}" stroke-width=".7"/>' for a in [i * 2 * math.pi / 5 + .3 for i in range(5)])
    return p + f'<circle cx="{x}" cy="{y}" r="{r * .38:.1f}" fill="#FFE27A" stroke="#B8860E" stroke-width=".5"/>'

# sabiá-laranjeira cantando num galho de ipê-roxo
ipes = ''.join(florzinha(x, y, r, '#C58AE8', '#6E3A9A') for x, y, r in [(12, 76, 4.2), (20, 70, 3.6), (104, 70, 4.4), (112, 76, 3.8), (98, 78, 3.2)])
S.append(f'''<symbol id="f-sabia" viewBox="0 0 120 100">
  <defs>{lg('csSbCosta', '#9C8466', '#6A553C')}{lg('csSbPeito', '#F2A050', '#C9622A')}{rg('csSbCab', '#B09A7A', '#8A7254', '#5E4A32')}{lg('csSbGalho', '#8A5A34', '#5A3418')}</defs>
  <ellipse cx="62" cy="93" rx="44" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M4 80 C30 76 60 80 90 75 C100 73 110 72 118 70" stroke="#4A2A12" stroke-width="7.4" fill="none" stroke-linecap="round"/>
  <path d="M4 80 C30 76 60 80 90 75 C100 73 110 72 118 70" stroke="url(#csSbGalho)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M10 78 C30 75 56 78 86 74" stroke="#C08A5E" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M86 75 C90 82 96 86 102 86" stroke="#5A3418" stroke-width="3" fill="none" stroke-linecap="round"/>
  {ipes}
  <path d="M42 60 L14 80 C14 84 20 86 24 84 L48 68Z" fill="#7A6246" stroke="#3E2E1A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M22 80 L42 66 M18 80 L40 64" stroke="#5A4630" stroke-width="1" opacity=".7"/>
  <path d="M36 60 C34 44 46 32 62 32 C78 32 90 44 88 58 C86 70 74 78 60 78 C47 78 38 70 36 60Z" fill="url(#csSbCosta)" stroke="#3E2E1A" stroke-width="1.8"/>
  <path d="M58 48 C72 44 88 52 88 62 C86 72 74 78 60 77 C54 70 53 58 58 48Z" fill="url(#csSbPeito)" stroke="#8A3E14" stroke-width="1.3"/>
  <path d="M64 56 C70 54 78 56 82 60 M62 64 C70 62 78 64 82 68" stroke="#FFC890" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M40 58 C42 46 54 40 68 44 C64 54 56 62 40 66Z" fill="#6E5A3E" stroke="#3E2E1A" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M46 56 C52 52 58 50 64 48 M44 61 C50 58 56 56 62 54" stroke="#A88C68" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M60 76 l-3 6 M66 76 l1 6" stroke="#6E6A66" stroke-width="2" stroke-linecap="round"/>
  <circle cx="78" cy="34" r="15" fill="url(#csSbCab)" stroke="#3E2E1A" stroke-width="1.8"/>
  <path d="M80 42 C86 43 91 47 89 54 C85 52 81 49 78 46Z" fill="#F4E8D2" stroke="#8A7254" stroke-width="1"/>
  <path d="M82 45 l1 4 M85 46 l1 4" stroke="#7A6246" stroke-width=".9" stroke-linecap="round"/>
  <path d="M91 31 L105 35 L91 39Z" fill="#E8C24A" stroke="#8A6A10" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M91 35 L104 35" stroke="#8A6A10" stroke-width=".8"/>
  <circle cx="84" cy="31" r="4.6" fill="#2A1A0E" stroke="#E8B84A" stroke-width="1.6"/><circle cx="85.6" cy="29.6" r="1.5" fill="#fff"/>
  <ellipse cx="82" cy="39" rx="2.6" ry="1.4" fill="#FF9A8A" opacity=".55"/>
  <path d="M68 24 C72 20 78 19 82 20" stroke="#D2BC98" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  {notinha(104, 18, .9, '#E86A2A')}{notinha(92, 8, .7, '#C9622A')}
</symbol>''')

# bem-te-vi no fio
S.append(f'''<symbol id="f-bemtevi" viewBox="0 0 120 100">
  <defs>{lg('csBtCosta', '#A07A4C', '#6E4E2C')}{lg('csBtBarriga', '#FFE45A', '#F2AE12')}{rg('csBtCab', '#3E3836', '#22201E', '#121010')}</defs>
  <ellipse cx="60" cy="94" rx="40" ry="3.6" fill="#0A1440" opacity=".14"/>
  <path d="M0 82 C40 88 80 86 120 78" stroke="#2E3440" stroke-width="2.6" fill="none"/>
  <path d="M40 62 L18 84 C18 88 24 89 28 86 L46 68Z" fill="#7A5A3A" stroke="#3E2A16" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M26 84 L44 66" stroke="#C8884A" stroke-width="1" opacity=".8"/>
  <path d="M34 62 C32 46 44 36 60 36 C76 36 88 46 87 60 C86 72 74 81 60 81 C46 81 36 74 34 62Z" fill="url(#csBtCosta)" stroke="#3E2A16" stroke-width="1.8"/>
  <path d="M55 50 C70 44 88 52 87 63 C85 75 72 81 60 80 C52 74 50 60 55 50Z" fill="url(#csBtBarriga)" stroke="#A8740A" stroke-width="1.3"/>
  <path d="M62 60 C70 58 78 60 82 64" stroke="#FFF2A8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M38 58 C40 46 52 41 65 45 C61 55 53 63 38 66Z" fill="#8A6038" stroke="#3E2A16" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M44 56 C50 52 56 50 62 48 M42 61 C48 58 54 56 60 54" stroke="#D89A5A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M58 80 l-2 4 M64 80 l1 4" stroke="#3E3836" stroke-width="2" stroke-linecap="round"/>
  <circle cx="78" cy="35" r="15" fill="url(#csBtCab)" stroke="#0A0808" stroke-width="1.6"/>
  <path d="M64 30 C70 22 86 20 95 28 C86 27 75 29 66 35Z" fill="#fff" stroke="#9AA0AE" stroke-width=".8"/>
  <path d="M74 21 C77 18 82 18 85 20 C82 22 78 23 74 21Z" fill="#FFD43A" stroke="#B8860E" stroke-width=".7"/>
  <path d="M76 43 C82 47 88 48 91 44 C91 52 85 55 78 51Z" fill="#fff" stroke="#9AA0AE" stroke-width=".8"/>
  <path d="M91 33 L108 37 L91 42Z" fill="#1E1A18" stroke="#000" stroke-width="1" stroke-linejoin="round"/><path d="M93 35 L104 37" stroke="#6E6A66" stroke-width="1" stroke-linecap="round"/>
  <circle cx="84" cy="36" r="4.4" fill="#fff"/><circle cx="85" cy="36.4" r="2.8" fill="#12121A"/><circle cx="86" cy="35.2" r="1.1" fill="#fff"/>
  <path d="M100 18 q4 -4 8 0 M104 10 q5 -4 10 0" stroke="#F2AE12" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>''')

# joaninha numa folha
nerv = ''.join(f'<path d="M{x} {y} Q{x + 10} {y - 12} {x + 22} {y - 16}" stroke="#2E7A2A" stroke-width="1.1" fill="none" opacity=".7"/><path d="M{x} {y} Q{x + 4} {y + 12} {x + 14} {y + 18}" stroke="#2E7A2A" stroke-width="1.1" fill="none" opacity=".7"/>' for x, y in [(26, 56), (44, 52), (62, 48), (80, 46)])
pintas = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#1A1416"/>' for x, y, r in [(52, 42, 4.4), (50, 58, 4), (60, 70, 3.4), (74, 40, 4), (76, 56, 4.4), (84, 68, 3.2)])
S.append(f'''<symbol id="f-joaninha" viewBox="0 0 120 100">
  <defs>{lg('csJnFolha', '#9EDC6A', '#4E9E3A')}{rg('csJnCasco', '#FF8A6A', '#E5392C', '#A8180E', .36, .3)}</defs>
  <ellipse cx="60" cy="94" rx="46" ry="4" fill="#0A1440" opacity=".15"/>
  <path d="M6 64 C20 34 56 22 94 26 C108 28 116 34 116 36 C110 60 80 86 40 86 C24 86 12 78 6 64Z" fill="url(#csJnFolha)" stroke="#2E6A22" stroke-width="2" stroke-linejoin="round"/>
  <path d="M8 64 C40 54 76 40 114 36" stroke="#2E7A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
  {nerv}
  <path d="M24 46 C40 34 62 30 84 30" stroke="#D8F6B0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M46 72 l-8 6 M52 76 l-4 8 M78 74 l6 6 M84 68 l8 4 M48 48 l-8 -2 M84 44 l8 -4" stroke="#1A1416" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="66" cy="56" rx="24" ry="22" fill="url(#csJnCasco)" stroke="#6E0E08" stroke-width="2"/>
  <path d="M66 34 V78" stroke="#4A0A06" stroke-width="1.6"/>
  {pintas}
  <path d="M50 40 C54 36 60 35 64 36" stroke="#FFD2C2" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M86 40 C92 30 100 30 104 34 C104 44 96 50 88 48Z" fill="#1A1416" stroke="#000" stroke-width="1"/>
  <path d="M96 31 C98 24 100 20 104 18 M100 33 C104 28 108 26 112 26" stroke="#1A1416" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="104" cy="18" r="2" fill="#1A1416"/><circle cx="112" cy="26" r="2" fill="#1A1416"/>
  <circle cx="94" cy="38" r="3.6" fill="#fff"/><circle cx="101" cy="39" r="3.2" fill="#fff"/><circle cx="94.8" cy="38.6" r="1.9" fill="#12121A"/><circle cx="101.6" cy="39.6" r="1.7" fill="#12121A"/><circle cx="95.4" cy="37.8" r=".7" fill="#fff"/><circle cx="102.2" cy="38.8" r=".6" fill="#fff"/>
  <path d="M95 44 q3 2 6 0" stroke="#FF9A8A" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</symbol>''')

# horta caseira
def alface(x, y, r):
    s = f'<path d="{copa(x, y, r, r * .62, 9, .3)}" fill="#5EB84A" stroke="#2E6A22" stroke-width="1.2"/>'
    s += f'<path d="{copa(x, y - r * .18, r * .72, r * .46, 8, .3)}" fill="#8ED866" stroke="#3E7A2A" stroke-width="1"/>'
    s += f'<path d="{copa(x, y - r * .32, r * .4, r * .28, 7, .3)}" fill="#C2F08A" stroke="#4E8A2A" stroke-width=".8"/>'
    return s
def cenoura(x, y):
    return (f'<path d="M{x} {y} q-6 -10 -4 -18 M{x} {y} q0 -12 3 -20 M{x} {y} q6 -8 8 -16" stroke="#3E9A3A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            f'<path d="M{x - 5} {y} C{x - 5} {y + 6} {x + 5} {y + 6} {x + 5} {y}Z" fill="#FF8A2A" stroke="#A8480E" stroke-width="1"/>')
toms = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#E5392C" stroke="#8E1E10" stroke-width="1"/><circle cx="{x - r * .35:.1f}" cy="{y - r * .35:.1f}" r="{r * .28:.1f}" fill="#FFB0A0"/><path d="M{x - 2} {y - r + .5} l2 -2 l2 2" stroke="#2E7A2A" stroke-width="1.2" fill="none"/>' for x, y, r in [(104, 34, 5.4), (114, 44, 4.8), (100, 50, 5), (112, 24, 4)])
S.append(f'''<symbol id="f-horta" viewBox="0 0 140 100">
  <defs>{lg('csHtMad', '#C88A50', '#8A5428')}{lg('csHtTerra', '#7A4E2E', '#4E2E18')}{lg('csHtReg', '#5AB8FF', '#1E6ED6')}</defs>
  <ellipse cx="70" cy="94" rx="62" ry="4.5" fill="#0A1440" opacity=".16"/>
  <path d="M106 66 V10" stroke="#8A6A3E" stroke-width="3" stroke-linecap="round"/>
  <path d="M106 60 C96 54 92 44 96 34 M106 48 C116 42 118 32 114 22 M106 36 C98 30 98 20 104 14" stroke="#3E8A2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g fill="#4EA83A" stroke="#2E6A22" stroke-width="1">{''.join(f'<path d="M{x} {y} c-6 -2 -10 2 -10 6 c6 1 9 -2 10 -6Z"/>' for x, y in [(96, 40), (114, 30), (100, 22), (118, 46), (108, 56)])}</g>
  {toms}
  <rect x="10" y="60" width="112" height="28" rx="3" fill="url(#csHtMad)" stroke="#5A3418" stroke-width="1.8"/>
  <path d="M10 70 H122 M10 80 H122" stroke="#6E4020" stroke-width="1" opacity=".55"/>
  <path d="M38 60 V88 M72 60 V88 M104 60 V88" stroke="#6E4020" stroke-width="1.2" opacity=".6"/>
  <path d="M14 63 H118" stroke="#F0C08A" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>
  <path d="M12 60 C30 56 100 56 120 60Z" fill="url(#csHtTerra)" stroke="#3E2010" stroke-width="1.2"/>
  {alface(28, 54, 14)}{alface(56, 56, 11)}
  {cenoura(78, 58)}{cenoura(90, 59)}
  <g transform="translate(42 80) scale(-1 1)"><path d="M6 -8 C2 -18 -6 -20 -10 -24" stroke="#1E5AB0" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M-14 -27 l6 -2 l2 6 l-6 2Z" fill="#1E5AB0" stroke="#0E3A7A" stroke-width=".8"/>
    <path d="M4 -12 H26 L24 12 H6Z" fill="url(#csHtReg)" stroke="#0E3A7A" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M26 -6 C34 -6 34 6 25 6" stroke="#0E3A7A" stroke-width="2.4" fill="none"/>
    <path d="M8 -8 V8" stroke="#BFE6FF" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    <g fill="#5AB8FF" stroke="#1E6ED6" stroke-width=".6"><path d="M-16 -18 q2 4 0 5 q-2 -1 0 -5Z"/><path d="M-20 -12 q2 4 0 5 q-2 -1 0 -5Z"/></g></g>
</symbol>''')

# capa: a casa, a cisterna, a horta e o córrego, com o Pingo
telhas = ''.join(f'<path d="M{x} {y} q3 3 6 0" stroke="#A8401E" stroke-width=".8" fill="none"/>' for y in range(34, 54, 5) for x in range(12 + (y % 2) * 3, 86, 6) if abs(x + 3 - 48) < (y - 26) * 1.55)
ipe = ''.join(f'<path d="{copa(x, y, rx, ry, 8, .35)}" fill="{c}" stroke="#6A2E8E" stroke-width=".8"/>' for x, y, rx, ry, c in [(140, 34, 22, 12, '#B26AD8'), (128, 26, 14, 9, '#C58AE8'), (152, 24, 13, 9, '#D2A2F0'), (140, 18, 10, 7, '#E2C2F8')])
S.append(f'''<symbol id="capa-casa" viewBox="0 0 170 110">
  <defs>{ceu('cpCsC', '#6EC2F5', '#FFF0D8')}{lg('cpCsP', '#FFF4D6', '#F2D8A8')}{lg('cpCsT', '#F07A48', '#C2481E')}{lg('cpCsG', '#9AD86A', '#5EA83E')}{lg('cpCsAg', '#7FD0FF', '#2E7BF6')}{lg('cpCsCis', '#5AB8FF', '#1E6ED6')}{lg('cpCsRua', '#8A909E', '#5E6472')}</defs>
  <rect width="170" height="110" fill="url(#cpCsC)"/>
  <circle cx="104" cy="16" r="14" fill="#FFE27A" opacity=".3"/><circle cx="104" cy="16" r="8" fill="#FFC83D" stroke="#F0A81E" stroke-width="1"/>
  <use href="#nuvem" x="20" y="4" width="34" height="16" style="color:#fff" opacity=".9"/>
  <path d="M0 58 C30 48 60 52 90 46 C120 42 150 48 170 44 V70 H0Z" fill="#B8DCA0" opacity=".85"/>
  <path d="M84 56 V40 h4 V34 l2 -6 l2 6 v6 h4 V56Z" fill="#E6D8F0" stroke="#B8A8D0" stroke-width=".6"/>
  <path d="M140 64 V42" stroke="#6E4A2A" stroke-width="3" stroke-linecap="round"/><path d="M140 50 l-8 -8 M140 46 l8 -8" stroke="#6E4A2A" stroke-width="1.8" stroke-linecap="round"/>
  {ipe}
  <rect y="62" width="170" height="30" fill="url(#cpCsG)"/>
  <path d="M120 62 C126 70 118 80 124 92 L170 92 V62 C160 66 150 64 140 62Z" fill="#E6D2A0" opacity=".5"/>
  <path d="M136 62 C140 72 132 82 138 92 L158 92 C152 82 158 72 152 62Z" fill="url(#cpCsAg)" stroke="#1E6ED6" stroke-width=".8"/>
  <path d="M140 70 q3 -1 5 0 M138 82 q3 -1 6 0" stroke="#E6F6FF" stroke-width=".9" fill="none"/>
  <g>{''.join(f'<path d="M{x} {y} V{y - 9}" stroke="#6E4A2A" stroke-width="1.4"/><path d="{copa(x, y - 12, 6, 5, 7)}" fill="{c}" stroke="#2E6A22" stroke-width=".7"/>' for x, y, c in [(132, 74, '#3E9A4A'), (162, 72, '#6EB84A'), (134, 90, '#2E8A5A'), (162, 90, '#4EA83A')])}</g>
  <rect x="14" y="44" width="68" height="40" fill="url(#cpCsP)" stroke="#8A6A4A" stroke-width="1.2"/>
  <path d="M6 46 L48 18 L90 46Z" fill="url(#cpCsT)" stroke="#7A2A10" stroke-width="1.2" stroke-linejoin="round"/>
  {telhas}
  <path d="M60 46 H92 V49 H60Z" fill="#9AA6B8" stroke="#4E5A6E" stroke-width=".6"/><path d="M90 49 V64 H96" stroke="#7A869A" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
  <rect x="22" y="52" width="16" height="14" rx="1" fill="#BFE6FF" stroke="#4E5A6E" stroke-width="1"/><path d="M30 52 v14 M22 59 h16" stroke="#4E5A6E" stroke-width=".8"/><path d="M20 52 h4 v14 h-4Z M36 52 h4 v14 h-4Z" fill="#22A565" stroke="#12753F" stroke-width=".6"/>
  <rect x="54" y="60" width="12" height="24" fill="#2E7BF6" stroke="#12458A" stroke-width="1"/><circle cx="63" cy="72" r="1" fill="#FFC83D"/>
  <path d="M92 64 C92 60 106 60 106 64 V84 C106 88 92 88 92 84Z" fill="url(#cpCsCis)" stroke="#0E3A7A" stroke-width="1"/><ellipse cx="99" cy="64" rx="7" ry="2" fill="#7FC8FF" stroke="#0E3A7A" stroke-width=".8"/><path d="M95 68 V82" stroke="#BFE6FF" stroke-width="1.4" stroke-linecap="round"/>
  <rect x="104" y="80" width="26" height="8" rx="1" fill="#A86A3A" stroke="#5A3418" stroke-width=".8"/>
  <g>{''.join(f'<circle cx="{x}" cy="78" r="3.4" fill="{c}" stroke="#2E6A22" stroke-width=".6"/>' for x, c in [(108, '#6EC24A'), (115, '#9ADA6A'), (122, '#6EC24A')])}<circle cx="127" cy="74" r="2" fill="#E5392C"/><circle cx="125" cy="70" r="1.6" fill="#E5392C"/></g>
  <rect y="92" width="170" height="18" fill="url(#cpCsRua)"/><path d="M0 92 H170" stroke="#D8DCE4" stroke-width="2"/><path d="M8 102 h12 M34 102 h12 M60 102 h12 M86 102 h12 M112 102 h12 M138 102 h12" stroke="#FFD447" stroke-width="1.4"/>
  <svg x="62" y="56" width="31" height="38" viewBox="-8 -6 136 166"><use class="sem" href="#pc"/></svg>
  <g>{''.join(f'<ellipse cx="{x}" cy="{y}" rx="1.6" ry="1" fill="#C58AE8" transform="rotate({a} {x} {y})"/>' for x, y, a in [(120, 50, 20), (112, 60, -30), (150, 58, 40), (104, 44, 10)])}</g>
</symbol>''')
