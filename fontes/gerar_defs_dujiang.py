# figurinhas e capa de Dujiangyan (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(256)

# panda-gigante (Lin), sentada segurando um broto de bambu
folhas_lin = ''.join(f'<path d="M{x} {y} C{x + dx * .4:.1f} {y + dy * .2 - 4:.1f} {x + dx * .8:.1f} {y + dy * .7:.1f} {x + dx} {y + dy} C{x + dx * .6:.1f} {y + dy * .9:.1f} {x + dx * .2:.1f} {y + dy * .5 + 3:.1f} {x} {y}Z" fill="url(#duPnFolha)" stroke="#1E5A2A" stroke-width="1.1" stroke-linejoin="round"/>' for x, y, dx, dy in [(95, 30, 18, -10), (95, 30, 14, 8), (93, 44, -16, -6), (96, 18, 4, -16), (94, 56, 16, 2)])
S.append(f'''<symbol id="f-panda" viewBox="0 0 120 120">
  <defs>{lg('duPnB', '#FFFFFF', '#D6DDE8')}{lg('duPnP', '#4E4E5E', '#14141C')}{rg('duPnCab', '#FFFFFF', '#F4F6FA', '#CDD5E2', .4, .3)}{lg('duPnBambu', '#B8E07A', '#5E9A2E', 1, 0)}{lg('duPnFolha', '#8ED86A', '#3E9A3A')}{rg('duPnOlho', '#3A3A48', '#16161E', '#08080C', .4, .35)}</defs>
  <ellipse cx="60" cy="114" rx="42" ry="4.4" fill="#0A1440" opacity=".18"/>
  <path d="M30 108 C22 92 24 72 38 64 C50 58 72 58 84 64 C98 72 100 92 92 108Z" fill="url(#duPnB)" stroke="#6A7488" stroke-width="1.8"/>
  <path d="M30 76 C40 64 80 64 92 76 C86 84 74 82 60 82 C46 82 36 84 30 76Z" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.2"/>
  <path d="M44 88 C52 92 68 92 76 88" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="40" cy="106" rx="14" ry="9.4" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/>
  <ellipse cx="80" cy="106" rx="14" ry="9.4" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/>
  <ellipse cx="38" cy="107" rx="5.4" ry="4.2" fill="#8A7E86"/><g fill="#8A7E86"><circle cx="31" cy="102" r="1.8"/><circle cx="35" cy="100" r="1.8"/><circle cx="40" cy="99.4" r="1.8"/><circle cx="45" cy="100.4" r="1.8"/></g>
  <ellipse cx="82" cy="107" rx="5.4" ry="4.2" fill="#8A7E86"/><g fill="#8A7E86"><circle cx="75" cy="100.4" r="1.8"/><circle cx="80" cy="99.4" r="1.8"/><circle cx="85" cy="100" r="1.8"/><circle cx="89" cy="102" r="1.8"/></g>
  <path d="M34 74 C22 82 24 96 36 98 C44 99 48 92 46 86 C44 82 40 80 40 76Z" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/>
  <path d="M99 110 C98 84 96 56 94 18" stroke="#3E6A1E" stroke-width="7.4" fill="none" stroke-linecap="round"/>
  <path d="M99 110 C98 84 96 56 94 18" stroke="url(#duPnBambu)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M93 96 h11 M92 70 h10 M91 44 h10" stroke="#3E6A1E" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M96.4 104 C96 90 95 76 94.4 62" stroke="#E8FFC0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
  {folhas_lin}
  <path d="M86 70 C94 66 102 70 102 78 C102 84 96 86 90 84 C86 82 82 78 84 74Z" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/>
  <path d="M90 72 q5 -2 9 1" stroke="#7A7A8E" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="35" cy="22" r="12" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/><circle cx="35" cy="22" r="6" fill="#5E5A6A"/>
  <circle cx="85" cy="22" r="12" fill="url(#duPnP)" stroke="#0A0A10" stroke-width="1.4"/><circle cx="85" cy="22" r="6" fill="#5E5A6A"/>
  <ellipse cx="60" cy="44" rx="32" ry="28" fill="url(#duPnCab)" stroke="#6A7488" stroke-width="1.8"/>
  <path d="M38 28 C44 20 56 17 66 18" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="45" rx="8.6" ry="11.6" transform="rotate(32 46 45)" fill="url(#duPnP)"/>
  <ellipse cx="74" cy="45" rx="8.6" ry="11.6" transform="rotate(-32 74 45)" fill="url(#duPnP)"/>
  <circle cx="47.4" cy="44" r="4.6" fill="url(#duPnOlho)" stroke="#fff" stroke-width=".8"/><circle cx="49" cy="42.2" r="1.8" fill="#fff"/><circle cx="46" cy="46" r=".7" fill="#fff" opacity=".8"/>
  <circle cx="72.6" cy="44" r="4.6" fill="url(#duPnOlho)" stroke="#fff" stroke-width=".8"/><circle cx="74.2" cy="42.2" r="1.8" fill="#fff"/><circle cx="71.2" cy="46" r=".7" fill="#fff" opacity=".8"/>
  <path d="M55 54 C55 51 65 51 65 54 C65 57 61 59 60 59 C59 59 55 57 55 54Z" fill="#23232E"/><path d="M57.4 53 q2.4 -1 4.6 0" stroke="#8A8A9E" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M60 59 v2.4 M54.6 61.4 q2.7 3.2 5.4 0 q2.7 3.2 5.4 0" stroke="#3A3A48" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="38" cy="57" rx="5" ry="2.8" fill="#FF9AB0" opacity=".6"/><ellipse cx="82" cy="57" rx="5" ry="2.8" fill="#FF9AB0" opacity=".6"/>
</symbol>''')

# panda-vermelho num galho, com a cauda listrada
aneis = ''.join(f'<path d="M{x0} {y0} q{dx} {dy} {dx * 2} {dy * 2}" stroke="#6E2A12" stroke-width="5.4" fill="none" opacity=".8"/>' for x0, y0, dx, dy in [(96, 58, 6, 8), (104, 50, 7, 6), (110, 40, 7, 3), (112, 30, 6, 1)])
S.append(f'''<symbol id="f-pandavermelho" viewBox="0 0 130 110">
  <defs>{lg('duRvC', '#F0844A', '#B8461E')}{rg('duRvCab', '#F6A060', '#E06A30', '#A83E16', .42, .34)}{lg('duRvPerna', '#5A2A1A', '#24100A')}{lg('duRvGalho', '#9A6A44', '#5A3820')}{lg('duRvF', '#9AD87A', '#3E8A3A')}
    <clipPath id="duRvClip"><path d="M80 74 C100 80 122 66 124 44 C126 30 118 18 106 20 C112 30 112 46 104 56 C98 62 88 62 80 60Z"/></clipPath></defs>
  <ellipse cx="66" cy="104" rx="52" ry="3.6" fill="#0A1440" opacity=".16"/>
  <path d="M2 94 C30 88 70 90 128 84 L128 92 C80 98 40 98 2 102Z" fill="url(#duRvGalho)" stroke="#3A2210" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M10 95 C40 91 80 92 120 87" stroke="#C99A6A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M20 96 C14 104 8 106 4 104 C8 100 12 98 20 96Z M110 88 C118 80 124 80 128 82 C122 86 118 88 110 88Z" fill="url(#duRvF)" stroke="#1E5A1E" stroke-width="1"/>
  <path d="M80 74 C100 80 122 66 124 44 C126 30 118 18 106 20 C112 30 112 46 104 56 C98 62 88 62 80 60Z" fill="url(#duRvC)" stroke="#6E2A12" stroke-width="1.8" stroke-linejoin="round"/>
  <g clip-path="url(#duRvClip)">{aneis}<path d="M108 22 C116 24 122 32 120 44" stroke="#FFD0A0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>
  <path d="M44 90 V80 M54 92 V80 M76 90 V80 M86 88 V78" stroke="#24100A" stroke-width="8.4" stroke-linecap="round"/>
  <path d="M44 90 V80 M54 92 V80 M76 90 V80 M86 88 V78" stroke="url(#duRvPerna)" stroke-width="6" stroke-linecap="round"/>
  <path d="M36 76 C32 62 46 52 66 52 C86 52 94 62 90 76 C86 86 46 88 36 76Z" fill="url(#duRvC)" stroke="#6E2A12" stroke-width="1.8"/>
  <path d="M40 78 C52 84 78 84 88 76 C84 70 50 70 40 78Z" fill="#3A160C" opacity=".75"/>
  <path d="M48 58 C58 54 72 54 82 57" stroke="#FFC08A" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M14 26 C12 14 18 8 24 10 C28 12 30 18 28 24Z" fill="#7A3014" stroke="#4A1A08" stroke-width="1.4"/><path d="M15.6 24 C14 16 18 12 22 13" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M56 24 C58 12 52 6 46 8 C42 10 40 16 42 22Z" fill="#7A3014" stroke="#4A1A08" stroke-width="1.4"/><path d="M54.4 22 C56 14 52 10 48 11" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="35" cy="40" rx="24" ry="20" fill="url(#duRvCab)" stroke="#6E2A12" stroke-width="1.8"/>
  <path d="M18 34 C20 28 26 26 30 30 C28 34 22 36 18 34Z M52 34 C50 28 44 26 40 30 C42 34 48 36 52 34Z" fill="#FFF8F0"/>
  <path d="M14 46 C16 56 26 60 35 60 C44 60 54 56 56 46 C50 50 44 48 40 46 L35 50 L30 46 C26 48 20 50 14 46Z" fill="#FFF8F0" stroke="#C88A6A" stroke-width=".8"/>
  <path d="M26 42 C24 48 24 52 26 56 M44 42 C46 48 46 52 44 56" stroke="#A83E16" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>
  <circle cx="27" cy="40" r="4.4" fill="#1A0E0A"/><circle cx="28.6" cy="38.4" r="1.6" fill="#fff"/><circle cx="25.8" cy="41.6" r=".6" fill="#fff" opacity=".8"/>
  <circle cx="43" cy="40" r="4.4" fill="#1A0E0A"/><circle cx="44.6" cy="38.4" r="1.6" fill="#fff"/><circle cx="41.8" cy="41.6" r=".6" fill="#fff" opacity=".8"/>
  <path d="M32 50 C32 48 38 48 38 50 C38 52 35 53 35 53 C35 53 32 52 32 50Z" fill="#2A1410"/>
  <path d="M35 53 v1.6 M31.6 55 q1.7 2 3.4 0 q1.7 2 3.4 0" stroke="#5A2A1A" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M22 26 C28 21 38 20 46 23" stroke="#FFD0A0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <ellipse cx="20" cy="50" rx="3.4" ry="2" fill="#FF8AA0" opacity=".55"/><ellipse cx="50" cy="50" rx="3.4" ry="2" fill="#FF8AA0" opacity=".55"/>
</symbol>''')

# bambu: tres colmos de verdes diferentes e um broto
def colmo(x0, y0, x1, y1, w, grad, esc, nos):
    s = f'<path d="M{x0} {y0} L{x1} {y1}" stroke="{esc}" stroke-width="{w + 2.6}" stroke-linecap="round"/><path d="M{x0} {y0} L{x1} {y1}" stroke="url(#{grad})" stroke-width="{w}" stroke-linecap="round"/>'
    for k in nos:
        x = x0 + (x1 - x0) * k; y = y0 + (y1 - y0) * k
        s += f'<path d="M{x - w / 2 - 1:.1f} {y:.1f} h{w + 2}" stroke="{esc}" stroke-width="1.8" stroke-linecap="round"/><path d="M{x - w / 2:.1f} {y - 1.6:.1f} h{w * .6:.1f}" stroke="#F6FFE0" stroke-width="1" opacity=".7"/>'
    s += f'<path d="M{x0 - w * .22:.1f} {y0 - 4} L{x1 - w * .22:.1f} {y1 + 4}" stroke="#F6FFE0" stroke-width="{w * .22:.1f}" stroke-linecap="round" opacity=".55"/>'
    return s
def folha(x, y, a, L, grad, esc):
    import math as _m
    ex = x + _m.cos(a) * L; ey = y + _m.sin(a) * L; nx = -_m.sin(a) * L * .24; ny = _m.cos(a) * L * .24
    mx = (x + ex) / 2; my = (y + ey) / 2
    return f'<path d="M{x:.1f} {y:.1f} Q{mx + nx:.1f} {my + ny:.1f} {ex:.1f} {ey:.1f} Q{mx - nx:.1f} {my - ny:.1f} {x:.1f} {y:.1f}Z" fill="url(#{grad})" stroke="{esc}" stroke-width="1" stroke-linejoin="round"/><path d="M{x:.1f} {y:.1f} L{(x + ex * 2) / 3:.1f} {(y + ey * 2) / 3:.1f}" stroke="{esc}" stroke-width=".7" opacity=".6"/>'
fl = ''
for (x, y, a, L, g, e) in [(30, 40, -2.4, 22, 'duBbF1', '#1E5A2A'), (30, 40, -1.9, 20, 'duBbF2', '#1E5A2A'), (34, 58, -2.8, 20, 'duBbF1', '#1E5A2A'), (32, 26, -1.4, 18, 'duBbF2', '#1E5A2A'),
                           (52, 22, -1.2, 22, 'duBbF3', '#24603A'), (52, 22, -.6, 20, 'duBbF3', '#24603A'), (54, 40, -.2, 22, 'duBbF2', '#1E5A2A'), (50, 12, -1.8, 18, 'duBbF1', '#1E5A2A'),
                           (74, 34, -.4, 22, 'duBbF1', '#2E6A1E'), (74, 34, .3, 20, 'duBbF2', '#2E6A1E'), (72, 50, -.9, 18, 'duBbF3', '#24603A'), (70, 24, -1.5, 18, 'duBbF2', '#2E6A1E'),
                           (28, 70, -2.2, 16, 'duBbF3', '#24603A'), (76, 64, -.3, 16, 'duBbF1', '#2E6A1E'), (53, 60, -2.5, 16, 'duBbF1', '#1E5A2A'), (40, 30, -2.0, 16, 'duBbF3', '#24603A'), (62, 30, -.9, 16, 'duBbF1', '#24603A')]:
    fl += folha(x, y, a, L, g, e)
S.append(f'''<symbol id="f-bambuchina" viewBox="0 0 100 130">
  <defs>{lg('duBbC1', '#D8EE8A', '#7AB83A', 1, 0)}{lg('duBbC2', '#7ACB6A', '#2E8A4A', 1, 0)}{lg('duBbC3', '#9AD8B0', '#3E9A7A', 1, 0)}{lg('duBbF1', '#A8E07A', '#4E9A3A')}{lg('duBbF2', '#6ACB7A', '#2E7A4A')}{lg('duBbF3', '#8AD8C0', '#3A8A72')}{lg('duBbChao', '#8A6A44', '#5A4028')}{lg('duBbBroto', '#E8C08A', '#A8743E')}</defs>
  <ellipse cx="50" cy="125" rx="38" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M10 124 C16 112 34 108 50 108 C66 108 84 112 90 124Z" fill="url(#duBbChao)" stroke="#3E2814" stroke-width="1.6"/>
  {tex(50, 116, 30, 5, 10, '#6E4E2E', 1)}
  {capim(14, 86, 112, 16, '#3E7A2A', (3, 7), 1.2)}
  {colmo(34, 114, 28, 14, 7, 'duBbC1', '#4E7A1E', (.2, .42, .62, .82))}
  {colmo(66, 114, 74, 22, 6.4, 'duBbC3', '#1E6A4E', (.25, .48, .7))}
  {colmo(50, 116, 52, 6, 8, 'duBbC2', '#1E5A2E', (.18, .38, .58, .78))}
  {fl}
  <path d="M74 116 C72 104 76 94 80 88 C84 94 88 104 86 116Z" fill="url(#duBbBroto)" stroke="#6E4418" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M74 112 C78 106 84 106 86 110 M75 104 C78 98 83 98 85 102 M77 96 C79 92 82 92 83 94" stroke="#6E4418" stroke-width="1.1" fill="none"/>
  <path d="M78 108 C77 100 78 94 80 90" stroke="#FFF0D0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M80 88 c-1 -4 1 -7 3 -8" stroke="#6ACB5A" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>''')

# cesto comprido de bambu cheio de pedras do rio
pedras = ''
for _ in range(34):
    x = R(18, 118); y = R(26, 72); r = R(5, 9)
    cor = random.choice(['#9AA4B4', '#B8AE9E', '#7E8A9C', '#C9BFA8', '#8E98A8', '#A89A88'])
    pedras += f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r:.1f}" ry="{r * .8:.1f}" fill="{cor}" stroke="#4E525E" stroke-width="1"/><path d="M{x - r * .5:.1f} {y - r * .3:.1f} q{r * .4:.1f} {-r * .4:.1f} {r * .8:.1f} {-r * .2:.1f}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6" stroke-linecap="round"/>'
trama = ''
for k in range(-4, 11):
    x = 6 + k * 15
    trama += f'<path d="M{x} 22 L{x + 34} 78" stroke="#5E3E18" stroke-width="4.6" opacity=".9"/><path d="M{x} 22 L{x + 34} 78" stroke="url(#duCsTira)" stroke-width="3"/>'
    trama += f'<path d="M{x + 34} 22 L{x} 78" stroke="#5E3E18" stroke-width="4.6" opacity=".9"/><path d="M{x + 34} 22 L{x} 78" stroke="url(#duCsTira2)" stroke-width="3"/>'
trama += '<path d="M0 50 H140" stroke="#5E3E18" stroke-width="4.6" opacity=".9"/><path d="M0 50 H140" stroke="url(#duCsTira)" stroke-width="3"/>'
S.append(f'''<symbol id="f-cestopedra" viewBox="0 0 140 100">
  <defs>{lg('duCsTira', '#F2D89A', '#C89A52')}{lg('duCsTira2', '#E6C47E', '#B08440')}{lg('duCsAgua', '#7ED0F2', '#2E86C8')}{rg('duCsBoca', '#5A4632', '#3A2C1E', '#1E160E', .5, .5)}
    <clipPath id="duCsClip"><path d="M18 24 H118 C130 24 132 76 118 76 H18 C6 76 6 24 18 24Z"/></clipPath></defs>
  <ellipse cx="70" cy="90" rx="64" ry="6" fill="url(#duCsAgua)" opacity=".75"/>
  <path d="M14 90 q6 -3 12 0 t12 0 M98 90 q6 -3 12 0 t12 0" stroke="#E6F6FF" stroke-width="1.4" fill="none" opacity=".9"/>
  <ellipse cx="70" cy="82" rx="58" ry="5" fill="#0A1440" opacity=".22"/>
  <g clip-path="url(#duCsClip)"><rect x="0" y="20" width="140" height="60" fill="#3A2E22"/>{pedras}{trama}</g>
  <path d="M18 24 H118 C130 24 132 76 118 76 H18 C6 76 6 24 18 24Z" fill="none" stroke="#4A2E10" stroke-width="2.2"/>
  <ellipse cx="118" cy="50" rx="10" ry="26" fill="url(#duCsBoca)" stroke="#4A2E10" stroke-width="2"/>
  <g>{''.join(f'<circle cx="{118 + R(-5, 5):.1f}" cy="{30 + i * 6.4:.1f}" r="{R(3.4, 4.6):.1f}" fill="{random.choice(["#9AA4B4", "#C9BFA8", "#8E98A8"])}" stroke="#3E424E" stroke-width=".8"/>' for i in range(7))}</g>
  <ellipse cx="118" cy="50" rx="10" ry="26" fill="none" stroke="#D8B070" stroke-width="2.4"/>
  <path d="M20 29 H112" stroke="#FFF2C8" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <path d="M24 70 H110" stroke="#3A220A" stroke-width="2" stroke-linecap="round" opacity=".35"/>
</symbol>''')

# capa: o rio Min dividido pela Boca de Peixe, o Gargalo do Jarro e a planície de arroz
arrozal = ''
for i in range(4):
    y0 = 84 + i * 6.6; y1 = y0 + 5.6
    for j in range(3):
        xa = 134 + j * 13 - i * 2.4; xb = xa + 11.6
        cor = ['#8CD06A', '#6EC05A', '#A8DA6A', '#7CCB78'][(i + j) % 4]
        arrozal += f'<path d="M{xa + 1.6:.1f} {y0:.1f} H{xb + 1.6:.1f} L{xb:.1f} {y1:.1f} H{xa:.1f}Z" fill="{cor}" stroke="#4E8A3A" stroke-width=".6"/><path d="M{xa + 3:.1f} {y0 + 2:.1f} h{8:.1f} M{xa + 2.6:.1f} {y0 + 4:.1f} h8" stroke="#3E8A2A" stroke-width=".6" stroke-dasharray="1 1.4"/>'
casas = ''
for x, y, k in [(146, 74, 1), (158, 72, .9), (166, 76, 1)]:
    casas += f'<g transform="translate({x} {y}) scale({k})"><path d="M-5 0 V-5.4 H5 V0Z" fill="#F6F0E2" stroke="#6E5A44" stroke-width=".6"/><path d="M-7 -5 Q0 -8.4 7 -5 L5.4 -7.6 Q0 -10 -5.4 -7.6Z" fill="#5E6676" stroke="#2E3440" stroke-width=".5"/><rect x="-1.2" y="-3.4" width="2.4" height="3.4" fill="#8A5A3A"/></g>'
S.append(f'''<symbol id="capa-dujiang" viewBox="0 0 170 110">
  <defs>{ceu('cpDuC', '#7EC0EE', '#F6EEDC')}{ceu('cpDuM1', '#B4C4DE', '#D8E0EC')}{ceu('cpDuM2', '#5E9A8A', '#3E7A6A')}{ceu('cpDuT', '#B8D88A', '#7EB05A')}{ceu('cpDuR', '#B0A48E', '#6E6458')}{ceu('cpDuA', '#6EC8F0', '#2E86C8')}{ceu('cpDuH', '#7CB862', '#4E8A44')}</defs>
  <rect width="170" height="110" fill="url(#cpDuC)"/>
  <circle cx="146" cy="18" r="11" fill="#FFE27A" opacity=".35"/><circle cx="146" cy="18" r="6.4" fill="#FFC83D" stroke="#F0A81E" stroke-width="1"/>
  <use href="#nuvem" x="20" y="8" width="40" height="20" style="color:#fff" opacity=".9"/>
  <path d="M0 46 L18 26 L30 34 L46 18 L62 32 L76 22 L92 36 L108 20 L124 32 L140 24 L170 40 V60 H0Z" fill="url(#cpDuM1)"/>
  <path d="M0 58 C12 44 26 40 40 44 C52 48 64 40 78 44 L84 52 L90 44 C104 38 120 46 132 42 C146 38 160 44 170 50 V64 H0Z" fill="url(#cpDuM2)" stroke="#2E5A4A" stroke-width=".6"/>
  <g fill="#4E8A5A" opacity=".9">{''.join(f'<path d="{copa(x, y, 6, 4, 6, .3)}"/>' for x, y in [(14, 50), (30, 46), (50, 48), (118, 46), (136, 44), (156, 48)])}</g>
  <path d="M0 64 C30 56 60 54 84 54 C110 54 140 56 170 60 V110 H0Z" fill="url(#cpDuT)"/>
  <path d="M84 50 C84 56 83 60 83 64" stroke="url(#cpDuA)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M80 64 C72 76 70 88 62 110" stroke="#D8C49A" stroke-width="15" fill="none"/><path d="M80 64 C72 76 70 88 62 110" stroke="url(#cpDuA)" stroke-width="11" fill="none"/>
  <path d="M86 64 C90 74 92 80 102 82 C112 84 124 82 150 80" stroke="#D8C49A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M86 64 C90 74 92 80 102 82 C112 84 124 82 150 80" stroke="url(#cpDuA)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M130 82 C140 90 150 96 170 100 M138 81 C150 84 160 86 170 88" stroke="#3E9ADA" stroke-width="1.6" fill="none"/>
  {arrozal}
  <path d="M83 60 C86 64 88 72 90 80 C86 80 84 72 81 64Z" fill="#B89466" stroke="#5A3E1E" stroke-width=".8"/>
  <path d="M82.4 61 C84 64 85.6 70 86.4 76" stroke="#F2D89A" stroke-width=".9" fill="none"/>
  <path d="M104 78 C106 66 112 56 120 54 C124 54 126 58 126 62 L124 80 C116 82 110 82 104 78Z" fill="url(#cpDuH)" stroke="#2E5A2E" stroke-width=".8"/>
  <path d="M119 62 L124 62 L123.4 80 L117 80Z" fill="url(#cpDuR)" stroke="#3E362E" stroke-width=".6"/>
  <path d="M131 80 L132 64 C134 60 140 60 142 64 L142 82 C138 84 134 84 131 80Z" fill="url(#cpDuR)" stroke="#3E362E" stroke-width=".8"/>
  <path d="M131 66 L136 62 L137 80" stroke="#8A7E6A" stroke-width=".8" fill="none"/>
  <g fill="#3E8A4A" stroke="#2E5A2E" stroke-width=".5"><path d="{copa(114, 56, 7, 4, 7, .3)}"/><path d="{copa(137, 62, 5, 3, 6, .3)}"/></g>
  <path d="M124 81 h8" stroke="#fff" stroke-width=".8" stroke-dasharray="2 1.6" opacity=".9"/>
  {casas}
  <path d="M66 84 q3 -1.6 6 0 M64 96 q3 -1.6 6 0 M96 82 q2 -1 4 0" stroke="#E6F6FF" stroke-width=".9" fill="none"/>
  <svg x="2" y="66" width="44" height="44" viewBox="0 0 120 120"><use class="sem" href="#f-panda"/></svg>
  <svg x="40" y="54" width="20" height="26" viewBox="0 0 100 130"><use class="sem" href="#f-bambuchina"/></svg>
</symbol>''')
