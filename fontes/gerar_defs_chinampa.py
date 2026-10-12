# figurinhas e capa das Chinampas de Xochimilco (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(197)

# ---------- axolote (Xóchi) ----------
def _bq(p0, p1, p2, t):
    a = (1 - t) * (1 - t); b = 2 * (1 - t) * t; c = t * t
    return (a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1])
def _guelra(p0, p1, p2, k=1, cor='#FF5C8A', esc='#9A1E48', luz='#FFC2D6'):
    # um ramo de guelra com franjas de pena dos dois lados
    d = f'M{p0[0]:.1f} {p0[1]:.1f} Q{p1[0]:.1f} {p1[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    fr = ''
    for i in range(1, 9):
        t = .18 + i * .1
        if t > 1: break
        x, y = _bq(p0, p1, p2, t); x2, y2 = _bq(p0, p1, p2, min(1, t + .02))
        dx, dy = x2 - x, y2 - y; L = math.hypot(dx, dy) or 1; nx, ny = -dy / L, dx / L
        f = (3.6 - t * 1.6) * k
        fr += f'M{x:.1f} {y:.1f} q{nx * f * .6 + dx / L * 1.2:.1f} {ny * f * .6 + dy / L * 1.2:.1f} {nx * f + dx / L * 2:.1f} {ny * f + dy / L * 2:.1f} M{x:.1f} {y:.1f} q{-nx * f * .6 + dx / L * 1.2:.1f} {-ny * f * .6 + dy / L * 1.2:.1f} {-nx * f + dx / L * 2:.1f} {-ny * f + dy / L * 2:.1f} '
    return (f'<path d="{fr}" stroke="{esc}" stroke-width="{2.6 * k:.1f}" fill="none" stroke-linecap="round"/>'
            f'<path d="{d}" stroke="{esc}" stroke-width="{5 * k:.1f}" fill="none" stroke-linecap="round"/>'
            f'<path d="{fr}" stroke="{cor}" stroke-width="{1.5 * k:.1f}" fill="none" stroke-linecap="round"/>'
            f'<path d="{d}" stroke="{cor}" stroke-width="{3 * k:.1f}" fill="none" stroke-linecap="round"/>'
            f'<path d="{d}" stroke="{luz}" stroke-width="{.9 * k:.1f}" fill="none" stroke-linecap="round" opacity=".8"/>')

ax_g = ''.join(_guelra(*g) for g in [((24, 40), (14, 30), (12, 16)), ((22, 46), (10, 42), (8, 34)), ((24, 52), (12, 56), (9, 53)),
                                      ((62, 38), (70, 26), (80, 16)), ((64, 44), (78, 38), (88, 32)), ((64, 50), (78, 52), (88, 50))])
ax_pintas = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#E07A9E" opacity=".45"/>' for x, y, r in [(70, 58, 1.4), (78, 62, 1.1), (88, 60, 1.3), (96, 64, 1), (60, 64, 1.1), (84, 68, .9)])
S.append(f'''<symbol id="f-axolote" viewBox="0 0 130 100">
  <defs>{lg('chxCorpo', '#FFDCE8', '#F49AB8')}{rg('chxCab', '#FFF0F4', '#FFC2D6', '#F08EB2', .42, .3)}{lg('chxCauda', '#FFE6EE', '#F7A6C2', 1, 0)}{lg('chxChao', '#8A7A5A', '#4E4230')}{lg('chxAlga', '#7CCB7A', '#2E7A4A')}</defs>
  <ellipse cx="64" cy="94" rx="54" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M4 96 C10 86 30 84 60 85 C92 84 116 86 126 96Z" fill="url(#chxChao)" stroke="#3A2E1E" stroke-width="1.4"/>
  <g fill="#A8987A" stroke="#5E4E36" stroke-width=".8"><ellipse cx="18" cy="91" rx="5" ry="2.6"/><ellipse cx="108" cy="90" rx="6" ry="3"/><ellipse cx="96" cy="93" rx="3.4" ry="1.8"/></g>
  <path d="M116 90 C112 76 118 66 114 54 M122 90 C124 80 120 72 124 62" stroke="#1E5A36" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M116 90 C112 76 118 66 114 54 M122 90 C124 80 120 72 124 62" stroke="url(#chxAlga)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M86 60 C98 52 110 44 124 40 C124 52 116 64 100 72 C94 75 88 72 86 68Z" fill="url(#chxCauda)" stroke="#B4506E" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M94 60 C104 54 112 50 118 47" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M84 74 C86 80 84 84 80 86 M90 72 C94 78 96 82 94 86" stroke="#B4506E" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M84 74 C86 80 84 84 80 86 M90 72 C94 78 96 82 94 86" stroke="#F7A6C2" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M34 64 C38 52 58 50 76 54 C92 57 100 62 96 72 C92 80 74 82 58 80 C44 79 32 74 34 64Z" fill="url(#chxCorpo)" stroke="#B4506E" stroke-width="1.8"/>
  {ax_pintas}
  <path d="M56 56 C66 54 78 56 88 60" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M40 76 C38 82 34 86 30 88 M54 78 C54 84 56 88 60 90" stroke="#B4506E" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  <path d="M40 76 C38 82 34 86 30 88 M54 78 C54 84 56 88 60 90" stroke="#FFC2D6" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M27 88 l-2 1.6 M30 89 l-1 2.2 M33 88.6 l1 2 M58 91 l-1 2 M61 91 l1 2 M63.4 89.6 l2 1.4" stroke="#B4506E" stroke-width="1.6" stroke-linecap="round"/>
  {ax_g}
  <ellipse cx="44" cy="48" rx="24" ry="19" fill="url(#chxCab)" stroke="#B4506E" stroke-width="2"/>
  <path d="M28 38 C34 31 46 29 56 32" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="34" cy="46" rx="3.4" ry="3.8" fill="#2A1420"/><circle cx="35.2" cy="44.6" r="1.3" fill="#fff"/><circle cx="33.4" cy="47.6" r=".5" fill="#fff"/>
  <ellipse cx="54" cy="46" rx="3.4" ry="3.8" fill="#2A1420"/><circle cx="55.2" cy="44.6" r="1.3" fill="#fff"/><circle cx="53.4" cy="47.6" r=".5" fill="#fff"/>
  <path d="M30 54 C36 61 52 61 58 54" stroke="#8E2E4E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M38 57.6 C42 60 46 60 50 57.6" stroke="#FF8AA8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <ellipse cx="27" cy="53" rx="4" ry="2.2" fill="#FF7A9E" opacity=".5"/><ellipse cx="61" cy="53" rx="4" ry="2.2" fill="#FF7A9E" opacity=".5"/>
  <circle cx="22" cy="20" r="2.4" fill="none" stroke="#9FD8FF" stroke-width="1.2"/><circle cx="30" cy="10" r="1.6" fill="none" stroke="#9FD8FF" stroke-width="1"/>
</symbol>''')

# ---------- garça-branca ----------
S.append(f'''<symbol id="f-garcabranca" viewBox="0 0 100 130">
  <defs>{lg('chgCorpo', '#FFFFFF', '#DCE4EE')}{lg('chgBico', '#FFE27A', '#F0A81E')}{lg('chgAgua', '#8ED8F0', '#3E9AC8')}</defs>
  <ellipse cx="50" cy="122" rx="38" ry="6" fill="url(#chgAgua)" stroke="#2A7AA8" stroke-width="1.2"/>
  <path d="M18 122 q4 -2 8 0 M66 123 q4 -2 8 0 M40 125 q5 -2 10 0" stroke="#E6F6FF" stroke-width="1.2" fill="none"/>
  <path d="M44 86 L42 104 L44 121 M54 86 L58 104 L56 121" stroke="#1A1A22" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 70 C24 76 14 86 6 92 C16 92 28 86 34 80Z" fill="url(#chgCorpo)" stroke="#6A7A94" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M10 90 C18 86 26 82 32 78 M14 86 C20 83 26 79 30 76" stroke="#C6D0DE" stroke-width=".9" fill="none"/>
  <path d="M26 72 C26 60 40 54 56 56 C68 58 74 66 70 76 C66 86 52 90 40 88 C30 86 26 80 26 72Z" fill="url(#chgCorpo)" stroke="#6A7A94" stroke-width="1.8"/>
  <path d="M32 70 C40 74 52 74 62 70" stroke="#C6D0DE" stroke-width="1.2" fill="none"/>
  <path d="M34 62 C40 58 50 57 58 59" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M62 60 C70 52 58 44 60 34 C62 26 70 22 74 22" stroke="#6A7A94" stroke-width="9.6" fill="none" stroke-linecap="round"/>
  <path d="M62 60 C70 52 58 44 60 34 C62 26 70 22 74 22" stroke="url(#chgCorpo)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M63 46 C61 40 61 34 64 29" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="74" cy="21" rx="8.6" ry="7" fill="url(#chgCorpo)" stroke="#6A7A94" stroke-width="1.7"/>
  <path d="M80 18 L99 22 L80 25Z" fill="url(#chgBico)" stroke="#A86A08" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M81 21.6 H96" stroke="#A86A08" stroke-width=".8"/>
  <circle cx="76" cy="19" r="2.8" fill="#FFE27A" stroke="#A86A08" stroke-width=".6"/><circle cx="76.4" cy="19.2" r="1.7" fill="#12121A"/><circle cx="77" cy="18.4" r=".7" fill="#fff"/>
  <path d="M69 16 q4 -3 9 -2" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="71" cy="25" rx="2.6" ry="1.4" fill="#FF9AB0" opacity=".55"/>
</symbol>''')

# ---------- beija-flor ----------
S.append(f'''<symbol id="f-beijaflor" viewBox="0 0 120 100">
  <defs>{lg('chbCostas', '#6EE8B4', '#0E7A62')}{lg('chbGarg', '#FF7AB8', '#B0186A')}{lg('chbAsa', '#F0FFF8', '#A8E4D2')}{lg('chbFlor', '#FF6A5A', '#C8202A')}{lg('chbFolha', '#7CCB5A', '#2E7A2A')}{rg('chbCab', '#8AF0C4', '#22A882', '#0E6A52', .4, .3)}</defs>
  <ellipse cx="90" cy="96" rx="24" ry="3" fill="#0A1440" opacity=".15"/>
  <path d="M96 96 C94 80 98 64 94 46" stroke="#2E6A22" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M96 96 C94 80 98 64 94 46" stroke="#6EB84E" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M96 80 C106 76 112 68 114 60 C106 62 100 68 96 76Z M95 66 C88 66 82 62 80 56 C88 56 92 60 95 62Z" fill="url(#chbFolha)" stroke="#1E5A1E" stroke-width="1.2"/>
  <g stroke="#7A1410" stroke-width="1.2" stroke-linejoin="round">
    <path d="M94 48 C90 40 88 32 90 24 C96 28 98 38 97 46Z" fill="url(#chbFlor)"/>
    <path d="M93 46 C88 44 84 40 82 34 C88 34 92 38 95 42Z" fill="url(#chbFlor)"/>
    <path d="M97 46 C102 40 106 36 112 36 C110 42 104 46 98 48Z" fill="url(#chbFlor)"/>
  </g>
  <path d="M91 30 q0 6 3 12 M86 36 q4 2 7 6" stroke="#FFB8A8" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M38 40 C30 26 30 12 38 2 C44 12 46 26 44 40Z" fill="url(#chbAsa)" stroke="#5EAA98" stroke-width="1.2" opacity=".75"/>
  <path d="M26 64 L8 76 L16 76 L10 84 L22 78 L24 84 L32 68Z" fill="url(#chbCostas)" stroke="#0A5A44" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M24 64 C22 52 34 42 48 40 C56 39 60 44 58 50 C54 60 42 68 32 70 C28 70 25 68 24 64Z" fill="url(#chbCostas)" stroke="#0A5A44" stroke-width="1.8"/>
  <path d="M30 66 C38 64 48 58 54 50 C50 48 44 50 38 54 C32 58 30 62 30 66Z" fill="#F6FFFA" stroke="#9ADCC8" stroke-width=".8"/>
  <circle cx="60" cy="38" r="10" fill="url(#chbCab)" stroke="#0A5A44" stroke-width="1.8"/>
  <path d="M54 44 C58 50 64 50 68 44 C66 42 62 43 58 43Z" fill="url(#chbGarg)" stroke="#7A0E46" stroke-width="1"/>
  <path d="M68 36 L92 38 L68 40Z" fill="#1A1A22" stroke="#1A1A22" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M46 42 C40 28 40 12 48 2 C54 12 54 28 50 42Z" fill="url(#chbAsa)" stroke="#3E8A7A" stroke-width="1.3" opacity=".95"/>
  <path d="M47 36 C45 26 46 16 48 8 M50 38 C50 28 51 18 51 10" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>
  <path d="M34 8 q-6 2 -8 6 M30 18 q-6 1 -9 5 M54 3 q4 -2 8 -1" stroke="#9ADCC8" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
  <circle cx="62" cy="35.4" r="3.2" fill="#12121A"/><circle cx="63.1" cy="34.3" r="1.2" fill="#fff"/><circle cx="61.2" cy="36.8" r=".5" fill="#fff"/>
  <path d="M53 33 C55 30 58 29 61 29" stroke="#C8FFE6" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M30 56 C34 50 40 47 46 46" stroke="#B8FFE0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="58" cy="41.6" rx="2.6" ry="1.3" fill="#FF9AB0" opacity=".55"/>
</symbol>''')

# ---------- cempasúchil ----------
def _pompom(cx, cy, r, k):
    s = f'<path d="{copa(cx, cy, r, r * .82, 14, .34)}" fill="url(#chcP0)" stroke="#9A3E06" stroke-width="1.3"/>'
    s += f'<path d="{copa(cx, cy - r * .08, r * .76, r * .62, 12, .36)}" fill="url(#chcP1)" stroke="#B05008" stroke-width="1"/>'
    s += f'<path d="{copa(cx, cy - r * .14, r * .5, r * .4, 10, .38)}" fill="url(#chcP2)" stroke="#C06A0A" stroke-width=".9"/>'
    s += f'<path d="{copa(cx, cy - r * .18, r * .24, r * .2, 7, .4)}" fill="#FFE27A" stroke="#C88A0A" stroke-width=".7"/>'
    s += ''.join(f'<path d="M{cx + math.cos(a) * r * .3:.1f} {cy - r * .14 + math.sin(a) * r * .26:.1f} l{math.cos(a) * r * .3:.1f} {math.sin(a) * r * .24:.1f}" stroke="#C05A06" stroke-width=".7" opacity=".6"/>' for a in [i * .7 for i in range(9)])
    s += f'<path d="M{cx - r * .6:.1f} {cy - r * .3:.1f} q{r * .3:.1f} {-r * .4:.1f} {r * .7:.1f} {-r * .44:.1f}" stroke="#FFF3B0" stroke-width="{1.6 * k:.1f}" fill="none" stroke-linecap="round" opacity=".85"/>'
    return s
def _folha_rec(x, y, a, L):
    # folha recortada (pinada) do cempasúchil
    ca, sa = math.cos(a), math.sin(a)
    P = lambda u, v: f'{x + ca * u - sa * v:.1f} {y + sa * u + ca * v:.1f}'
    d = f'M{P(0, 0)} ' + ' '.join(f'L{P(L * t, -3.4 * (1 - t) - 1)} L{P(L * (t + .06), -.6)}' for t in [.12, .3, .48, .66, .84]) + f' L{P(L, 0)} ' + ' '.join(f'L{P(L * t, 3.4 * (1 - t) + 1)} L{P(L * (t - .06), .6)}' for t in [.84, .66, .48, .3, .12]) + 'Z'
    return f'<path d="{d}" fill="url(#chcF)" stroke="#1E4A1E" stroke-width=".9" stroke-linejoin="round"/>'
S.append(f'''<symbol id="f-cempasuchil" viewBox="0 0 110 110">
  <defs>{rg('chcP0', '#FFB040', '#FF8A1E', '#E0600A', .45, .35)}{rg('chcP1', '#FFC850', '#FFA22A', '#F07A10', .45, .35)}{rg('chcP2', '#FFE07A', '#FFC23A', '#F59A1A', .45, .35)}{lg('chcF', '#5EA84A', '#245A26')}{lg('chcT', '#8A5A36', '#4E3020')}</defs>
  <ellipse cx="55" cy="105" rx="42" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M10 104 C16 94 34 90 55 90 C76 90 94 94 100 104Z" fill="url(#chcT)" stroke="#2E1A0E" stroke-width="1.5"/>
  {tex(55, 98, 34, 4, 10, '#6E4428', 1)}
  <path d="M55 92 C54 74 50 62 34 48 M55 92 C56 72 60 60 76 46 M55 92 C55 70 55 50 55 30" stroke="#1E4A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M55 92 C54 74 50 62 34 48 M55 92 C56 72 60 60 76 46 M55 92 C55 70 55 50 55 30" stroke="#5E9A3A" stroke-width="2" fill="none" stroke-linecap="round"/>
  {_folha_rec(54, 84, -2.6, 26)}{_folha_rec(56, 82, -.5, 26)}{_folha_rec(52, 70, -2.3, 22)}{_folha_rec(58, 68, -.8, 22)}{_folha_rec(55, 56, -2.0, 16)}{_folha_rec(56, 54, -1.1, 16)}
  {_pompom(32, 46, 17, 1)}{_pompom(78, 44, 16, 1)}{_pompom(55, 26, 19, 1.1)}
</symbol>''')

# ---------- capa: jardins no lago ----------
def _ahue(x, y, h, w, c0='#6E9A62', c1='#3E6A44', op=1):
    return (f'<g opacity="{op}"><path d="M{x} {y} V{y - h * .5}" stroke="#4E3A2A" stroke-width="{max(.8, w * .14):.1f}"/>'
            f'<path d="M{x} {y - h * .2} C{x - w * .7} {y - h * .45} {x - w * .5} {y - h * .9} {x} {y - h} C{x + w * .5} {y - h * .9} {x + w * .7} {y - h * .45} {x} {y - h * .2}Z" fill="{c0}" stroke="{c1}" stroke-width=".7"/>'
            f'<path d="M{x - w * .22:.1f} {y - h * .4:.1f} C{x - w * .3:.1f} {y - h * .6:.1f} {x - w * .2:.1f} {y - h * .8:.1f} {x - w * .05:.1f} {y - h * .92:.1f}" stroke="#C8E6B0" stroke-width=".7" fill="none" opacity=".7"/></g>')
cap_ahue_longe = ''.join(_ahue(x, 58 + (i % 2), 18 + (i % 3) * 3, 5, '#9ABCA6', '#7A9C88', .9) for i, x in enumerate(range(6, 170, 11)))
cap_ahue = ''.join(_ahue(x, 72, 30 + (i % 2) * 4, 7) for i, x in enumerate([10, 50, 62]))
cap_milpa = ''.join(f'<path d="M{x} 74 V{60 - (i % 2) * 3}" stroke="#3E7A2A" stroke-width="1.4"/><path d="M{x} {66 - (i % 2) * 2} l-4 -3 M{x} {63 - (i % 2) * 2} l4 -3" stroke="#6EB84E" stroke-width="1.2" stroke-linecap="round"/><path d="M{x} {60 - (i % 2) * 3} l-1 -3 l2 0Z" fill="#E8D47A"/>' for i, x in enumerate(range(98, 150, 7)))
S.append(f'''<symbol id="capa-chinampa" viewBox="0 0 170 110">
  <defs>{ceu('cpChC', '#7EC4F0', '#FFF0E0')}{ceu('cpChV', '#B8C6DA', '#8A9AB4')}{ceu('cpChA', '#5EC4C8', '#1E6E8A')}{ceu('cpChT', '#6E4A2E', '#3E2616')}{ceu('cpChL', '#7CB85A', '#4E8A3A')}{ceu('cpChB', '#FF6A8A', '#C8285A')}</defs>
  <rect width="170" height="110" fill="url(#cpChC)"/>
  <circle cx="24" cy="18" r="9" fill="#FFE27A" opacity=".4"/><circle cx="24" cy="18" r="5.6" fill="#FFC83D" stroke="#F0A81E" stroke-width=".8"/>
  <use href="#nuvem" x="70" y="6" width="40" height="20" style="color:#fff" opacity=".9"/>
  <path d="M70 58 L104 22 L118 30 L150 58Z" fill="url(#cpChV)"/><path d="M98 28 L104 22 L118 30 L112 34 L106 30 L102 33Z" fill="#fff"/>
  <path d="M110 58 C120 40 132 36 140 38 C150 36 160 44 170 54 V58Z" fill="#A8B6CC"/><path d="M126 42 C132 37 140 37 146 39 C142 42 136 41 130 44Z" fill="#fff"/>
  <rect y="56" width="170" height="6" fill="#B8D8E8"/>
  {cap_ahue_longe}
  <path d="M0 62 H170 V66 H0Z" fill="#8EC8D8"/>
  <path d="M0 72 L4 64 H76 L72 72Z" fill="url(#cpChL)" stroke="#2E5A22" stroke-width=".6"/>
  <path d="M8 66 h60" stroke="#FF8A1E" stroke-width="2.4" stroke-dasharray="4 2"/><path d="M6 69 h62" stroke="#E0458A" stroke-width="2" stroke-dasharray="3 2"/>
  {cap_ahue}
  <path d="M86 74 L90 66 H170 V74Z" fill="url(#cpChL)" stroke="#2E5A22" stroke-width=".6"/>
  {cap_milpa}
  <g stroke="#3E7A2A" stroke-width=".8"><ellipse cx="156" cy="71" rx="5" ry="2.4" fill="#5EA84A"/><circle cx="154" cy="71" r="2.2" fill="#FFA22A"/></g>
  {_ahue(160, 74, 40, 8)}
  <rect y="74" width="170" height="36" fill="url(#cpChA)"/>
  <path d="M0 74 L0 110 H76 V74Z" fill="none"/>
  <g><rect x="0" y="74" width="74" height="36" fill="url(#cpChT)" opacity=".85"/>
    <path d="M0 82 H74 M0 90 H74 M0 98 H74" stroke="#A8C86A" stroke-width="1.6" opacity=".55" stroke-dasharray="5 2"/>
    <path d="M60 74 C58 84 62 92 56 104 M60 80 C66 88 68 96 66 106" stroke="#C8A27A" stroke-width=".9" fill="none" opacity=".8"/>
    <path d="M74 74 V110" stroke="#5E3A1E" stroke-width="2"/><path d="M70 74 V108 M4 74 V108" stroke="#7A5232" stroke-width="1.4"/></g>
  <path d="M76 75 q4 -2 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" stroke="#E6F6FF" stroke-width="1" fill="none"/>
  <g transform="translate(98 66)">
    <path d="M-16 8 C-12 13 12 13 20 8 L18 4 H-14Z" fill="url(#cpChB)" stroke="#6E0E2A" stroke-width=".8"/>
    <path d="M-12 7 H16" stroke="#FFC83D" stroke-width="1.4"/>
    <path d="M-12 4 V-6 M14 4 V-6" stroke="#2E7BF6" stroke-width="1.6"/>
    <path d="M-14 -6 C-8 -12 10 -12 16 -6 V-3 H-14Z" fill="#FFC83D" stroke="#A86A08" stroke-width=".7"/>
    <g fill="#E0458A"><circle cx="-8" cy="-7" r="1.2"/><circle cx="1" cy="-9" r="1.2"/><circle cx="10" cy="-7" r="1.2"/></g>
    <path d="M22 -14 L18 12" stroke="#7A5232" stroke-width="1"/><circle cx="20" cy="-2" r="2" fill="#8A5A3A"/><path d="M18 1 h4 v6 h-4Z" fill="#2E7BF6"/>
  </g>
  <path d="M84 104 C96 100 106 102 114 106" stroke="#2E7A4A" stroke-width="2" fill="none"/>
  <path d="M138 110 C136 100 140 92 136 84 M144 110 C146 100 142 94 146 86" stroke="#2E7A4A" stroke-width="1.6" fill="none"/>
  <svg x="92" y="84" width="40" height="31" viewBox="0 0 130 100"><use class="sem" href="#f-axolote"/></svg>
  <g fill="none" stroke="#E6F6FF" stroke-width=".8"><circle cx="128" cy="86" r="1.6"/><circle cx="132" cy="80" r="1.1"/></g>
  <svg x="38" y="44" width="22" height="22" viewBox="0 0 110 110"><use class="sem" href="#f-cempasuchil"/></svg>
  <svg x="150" y="56" width="14" height="18" viewBox="0 0 100 130"><use class="sem" href="#f-garcabranca"/></svg>
</symbol>''')
