# figurinhas e capa das Marisqueiras do mangue (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(233)

def _tri(d, esc, cor, w, luz=None, op=.55):
    s = (f'<path d="{d}" stroke="{esc}" stroke-width="{w + 2.4:.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
         f'<path d="{d}" stroke="{cor}" stroke-width="{w:.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    if luz: s += f'<path d="{d}" stroke="{luz}" stroke-width="{max(.7, w * .3):.1f}" fill="none" stroke-linecap="round" opacity="{op}" transform="translate({-w * .2:.1f} {-w * .2:.1f})"/>'
    return s

def _folhas(cx, cy, rx, ry, n, cor, esc, luz, L=(6, 10)):
    s = ''
    for _ in range(n):
        a = R(0, 6.28); r = math.sqrt(R(0, 1)); x = cx + math.cos(a) * rx * r; y = cy + math.sin(a) * ry * r; ang = R(-70, 70); l = R(*L)
        s += (f'<g transform="translate({x:.1f} {y:.1f}) rotate({ang:.1f})"><path d="M0 0 C{l * .35:.1f} {-l * .32:.1f} {l * .75:.1f} {-l * .3:.1f} {l:.1f} 0 C{l * .75:.1f} {l * .3:.1f} {l * .35:.1f} {l * .32:.1f} 0 0Z" fill="{cor}" stroke="{esc}" stroke-width=".6"/>'
              f'<path d="M1 0 H{l * .8:.1f}" stroke="{luz}" stroke-width=".5" opacity=".7"/></g>')
    return s

# ---------- caranguejo-uçá (Uçá) ----------
def _perna(d):
    return f'<path d="{d}" stroke="#5A2A3A" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" stroke="url(#mguP)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" stroke="#FFC8A0" stroke-width="1" fill="none" stroke-linecap="round" opacity=".55" transform="translate(-.8 -.8)"/>'
_pernas = ''
_pelos = ''
for j in range(4):
    y0 = 56 + j * 4
    for l in (-1, 1):
        sx, kx, ky, tx, ty = 60 + l * 22, 60 + l * (33 + j * 3.4), y0 - 10 + j * 1.2, 60 + l * (38 + j * 4.4), 80 + j * 1.2
        _pernas += _perna(f'M{sx} {y0} Q{sx + l * (8 + j):.1f} {y0 - 8} {kx:.1f} {ky:.1f} Q{kx + l * 8:.1f} {ky + 5:.1f} {tx:.1f} {ty:.1f}') + f'<circle cx="{kx:.1f}" cy="{ky:.1f}" r="1.5" fill="#FFE2CC"/>'
        for u in (.3, .55, .8):
            hx, hy = sx + (kx - sx) * u, y0 + (ky - y0) * u
            _pelos += f'<path d="M{hx:.1f} {hy - 2:.1f} l{l * .8:.1f} -2.4" stroke="#5A2A3A" stroke-width=".8" stroke-linecap="round"/>'
        _pelos += f'<path d="M{(kx + tx) / 2 + l * 2:.1f} {(ky + ty) / 2:.1f} l{l * 2.2:.1f} -.8" stroke="#5A2A3A" stroke-width=".8" stroke-linecap="round"/>'
def _garra(l):
    cx = 60
    return (f'<path d="M{cx + l * 16} 52 Q{cx + l * 26} 42 {cx + l * 32} 44" stroke="#3A1428" stroke-width="8" fill="none" stroke-linecap="round"/>'
            f'<path d="M{cx + l * 16} 52 Q{cx + l * 26} 42 {cx + l * 32} 44" stroke="url(#mguP)" stroke-width="5.4" fill="none" stroke-linecap="round"/>'
            f'<path d="M{cx + l * 28} 42 C{cx + l * 30} 28 {cx + l * 46} 26 {cx + l * 48} 38 C{cx + l * 48} 46 {cx + l * 40} 50 {cx + l * 32} 49Z" fill="url(#mguG)" stroke="#3A1428" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<path d="M{cx + l * 44} 34 L{cx + l * 54} 30 C{cx + l * 55} 36 {cx + l * 51} 40 {cx + l * 46} 41Z" fill="url(#mguG)" stroke="#3A1428" stroke-width="1.3" stroke-linejoin="round"/>'
            f'<path d="M{cx + l * 32} 36 q{l * 6} -6 {l * 12} -4" stroke="#FFE6F2" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>'
            f'<g fill="#FFE0EE" opacity=".8"><circle cx="{cx + l * 40}" cy="44" r=".9"/><circle cx="{cx + l * 44}" cy="43" r=".8"/><circle cx="{cx + l * 36}" cy="45" r=".8"/></g>')
S.append(f'''<symbol id="mg-uca-corpo" viewBox="0 0 120 100">
  <defs>{lg('mguC', '#9EA6E0', '#6C4E7E')}{lg('mguP', '#FFBC98', '#E07A72', 1, 1)}{lg('mguG', '#F6BCD8', '#B8689A', 1, 1)}{rg('mguOlho', '#3A2A4A', '#1A0E1A', '#0A060A', .4, .35)}</defs>
  {_pernas}{_pelos}
  {_garra(-1)}{_garra(1)}
  <path d="M30 58 C28 42 44 33 60 33 C76 33 92 42 90 58 C86 70 34 70 30 58Z" fill="url(#mguC)" stroke="#3A2A52" stroke-width="2"/><path d="M33 60 C44 66 76 66 87 60" stroke="#F0C8B8" stroke-width="2" fill="none" opacity=".6"/>
  <path d="M42 60 C50 64 70 64 78 60 M48 46 q12 5 24 0" stroke="#2E2450" stroke-width="1" fill="none" opacity=".4"/>
  <g fill="#B8C4F4" opacity=".5"><circle cx="70" cy="44" r="1.4"/><circle cx="76" cy="50" r="1.1"/><circle cx="64" cy="40" r="1"/></g>
  <path d="M40 48 C44 40 52 37 60 37" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M50 37 L47 24 M70 37 L73 24" stroke="#2E2450" stroke-width="5" stroke-linecap="round"/><path d="M50 37 L47 24 M70 37 L73 24" stroke="#7A80C8" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="46" cy="20" r="7" fill="#fff" stroke="#2E2450" stroke-width="1.6"/><circle cx="74" cy="20" r="7" fill="#fff" stroke="#2E2450" stroke-width="1.6"/>
  <circle cx="47.4" cy="20.6" r="4.4" fill="url(#mguOlho)"/><circle cx="75.4" cy="20.6" r="4.4" fill="url(#mguOlho)"/>
  <circle cx="49" cy="18.6" r="1.7" fill="#fff"/><circle cx="77" cy="18.6" r="1.7" fill="#fff"/><circle cx="46" cy="22.4" r=".7" fill="#fff"/><circle cx="74" cy="22.4" r=".7" fill="#fff"/>
  <path d="M51 52 C55 58 65 58 69 52" stroke="#2A1430" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M56 55.6 C58.6 57.4 61.4 57.4 64 55.6" stroke="#FF8AA8" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="44" cy="52" rx="4" ry="2.2" fill="#FF8AB8" opacity=".5"/><ellipse cx="76" cy="52" rx="4" ry="2.2" fill="#FF8AB8" opacity=".5"/>
</symbol>''')
S.append(f'''<symbol id="f-caranguejouca" viewBox="0 0 120 100">
  <defs>{lg('mguLama', '#8A6A4A', '#4E3624')}{lg('mguRaiz', '#B07A54', '#6E4028', 1, 1)}{lg('mguF', '#5EAE4E', '#1E6436', 1, 1)}</defs>
  <ellipse cx="60" cy="95" rx="54" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M2 96 C10 84 30 80 60 81 C90 80 112 84 118 96Z" fill="url(#mguLama)" stroke="#2E1E12" stroke-width="1.4"/>
  {tex(60, 89, 50, 5, 14, '#3E2A18', .9)}
  <ellipse cx="18" cy="88" rx="6" ry="2.2" fill="#1E140C"/><ellipse cx="102" cy="90" rx="5" ry="2" fill="#1E140C"/>
  {_tri('M98 84 C100 60 108 40 120 30', '#3A1E12', 'url(#mguRaiz)', 4.4, '#E8B890')}{_tri('M106 86 C110 70 114 60 120 54', '#3A1E12', 'url(#mguRaiz)', 3.4, '#E8B890')}
  <g transform="translate(112 26) rotate(30)"><path d="M0 0 C-6 -4 -12 -2 -14 4 C-8 6 -3 5 0 0Z" fill="url(#mguF)" stroke="#0E3A22" stroke-width=".8"/></g>
  <g transform="translate(96 90) rotate(-12)"><path d="M0 0 C4 -5 12 -5 16 0 C12 4 4 4 0 0Z" fill="#E8C24A" stroke="#8A6A1A" stroke-width=".8"/><path d="M1 0 H14" stroke="#FFF2B0" stroke-width=".6"/></g>
  <use href="#mg-uca-corpo" width="120" height="100"/>
  <g fill="none" stroke="#9FD8FF" stroke-width="1.1"><circle cx="16" cy="62" r="2.2"/><circle cx="12" cy="54" r="1.4"/></g>
</symbol>''')

# ---------- colhereiro ----------
S.append(f'''<symbol id="mg-colh-corpo" viewBox="0 0 100 120">
  <defs>{lg('mgcoC', '#FFD0DE', '#EE88AA')}{lg('mgcoAsa', '#F8A6C0', '#E06A94')}{lg('mgcoP', '#FFF4F7', '#F6C8D6')}{lg('mgcoB', '#9AA4A6', '#5E686A')}</defs>
  <path d="M44 80 L42 96 L40 101 M54 80 L56 96 L58 101" stroke="#A82A4A" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 80 L42 96 L40 101 M54 80 L56 96 L58 101" stroke="#F06A8A" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M34 101 h10 M52 101 h11" stroke="#A82A4A" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M26 66 C20 72 12 80 8 86 C16 86 26 80 32 74Z" fill="#F4B060" stroke="#A8602A" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M24 68 C24 56 38 50 54 52 C68 54 76 62 72 72 C68 82 54 86 40 84 C30 82 24 76 24 68Z" fill="url(#mgcoC)" stroke="#B0386A" stroke-width="1.8"/>
  <path d="M30 70 C38 60 52 58 64 62 C60 70 48 76 34 76Z" fill="url(#mgcoAsa)" stroke="#B0386A" stroke-width="1.1"/>
  <path d="M50 60 C56 59 61 60 64 62 C61 66 56 67 51 66Z" fill="#D0285A" stroke="#8A1A3A" stroke-width=".8"/>
  <path d="M34 75 C40 76 46 76 52 74" stroke="#FFE6EE" stroke-width="1" fill="none" opacity=".8"/>
  <path d="M34 60 C40 55 50 54 58 56" stroke="#FFF0F4" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M64 58 C72 50 62 42 64 32 C66 24 72 20 76 20" stroke="#B0386A" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M64 58 C72 50 62 42 64 32 C66 24 72 20 76 20" stroke="url(#mgcoP)" stroke-width="6.4" fill="none" stroke-linecap="round"/>
  <path d="M65 44 C63 38 64 32 67 27" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="76" cy="20" rx="8.4" ry="7.2" fill="url(#mgcoP)" stroke="#B0386A" stroke-width="1.7"/>
  <path d="M70 16 C74 12 82 13 84 18 C82 24 76 25 72 22Z" fill="#C8D4B4" stroke="#7A8A6A" stroke-width=".8"/>
  <path d="M82 17 L94 25 C98 26 100 31 97 33.6 C94 35.4 90 33.6 90 31 L81 23Z" fill="url(#mgcoB)" stroke="#2E3436" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M84 20 L92 26" stroke="#D8E0E2" stroke-width=".8" opacity=".8"/>
  <circle cx="78" cy="18" r="2.8" fill="#fff" stroke="#8A1A3A" stroke-width=".6"/><circle cx="78.6" cy="18.3" r="1.8" fill="#12121A"/><circle cx="79.2" cy="17.4" r=".7" fill="#fff"/>
  <ellipse cx="73" cy="24.6" rx="2.4" ry="1.3" fill="#FF9AB8" opacity=".8"/>
</symbol>''')
S.append(f'''<symbol id="f-colhereiro" viewBox="0 0 100 120">
  <defs>{lg('mgcoAg', '#7ECACC', '#2E8A9A')}{lg('mgcoR', '#B07A54', '#6E4028', 1, 1)}</defs>
  <ellipse cx="50" cy="114" rx="40" ry="5" fill="url(#mgcoAg)" stroke="#1E6A7A" stroke-width="1.2"/>
  <path d="M18 114 q4 -2 8 0 M64 115 q4 -2 8 0" stroke="#E6FFFF" stroke-width="1.1" fill="none"/>
  {_tri('M6 116 C10 100 20 96 30 98 C40 100 50 104 60 102 C74 100 86 104 96 116', '#3A1E12', 'url(#mgcoR)', 4.6, '#E8B890')}
  <use href="#mg-colh-corpo" width="100" height="120"/>
</symbol>''')

# ---------- mangue-vermelho ----------
_raizes_mv = ''
for x0, y0, x1, y1, h, w in [(55, 74, 20, 104, 14, 3.4), (55, 74, 38, 108, 8, 3.6), (56, 74, 72, 108, 10, 3.6), (57, 72, 92, 102, 16, 3.4), (54, 66, 12, 96, 10, 2.8), (58, 66, 100, 92, 18, 2.8), (66, 56, 84, 100, 8, 2.4), (44, 58, 30, 100, 8, 2.4)]:
    mx = x0 + (x1 - x0) * .42
    _raizes_mv += _tri(f'M{x0} {y0} C{mx:.1f} {y0 - h} {x1 - (x1 - x0) * .08:.1f} {min(y0, y1) - h * .4:.1f} {x1} {y1}', '#3A1E12', 'url(#mgvR)', w, '#E8B890')
def _prop(x, y, L):
    return (f'<path d="M{x} {y} C{x + 1} {y + L * .3:.1f} {x - 1} {y + L * .7:.1f} {x} {y + L}" stroke="#2E3A12" stroke-width="4" fill="none" stroke-linecap="round"/>'
            f'<path d="M{x} {y} C{x + 1} {y + L * .3:.1f} {x - 1} {y + L * .7:.1f} {x} {y + L}" stroke="url(#mgvP)" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
            f'<path d="M{x - 2.6} {y - 1} C{x - 2} {y + 2} {x + 2} {y + 2} {x + 2.6} {y - 1} C{x + 1.4} {y - 3.4} {x - 1.4} {y - 3.4} {x - 2.6} {y - 1}Z" fill="#8A5A2A" stroke="#3E2410" stroke-width=".6"/>')
S.append(f'''<symbol id="f-manguevermelho" viewBox="0 0 110 120">
  <defs>{lg('mgvA', '#7ECACC', '#2E7A88')}{lg('mgvL', '#8A6A4A', '#4E3624')}{lg('mgvT', '#A86A4A', '#4E2A1C', 1, 0)}{lg('mgvR', '#B07A54', '#6E4028', 1, 1)}{rg('mgvC0', '#4E9A52', '#2A7040', '#14502E', .45, .35)}{rg('mgvC1', '#8AD06A', '#4EA04E', '#2E7A3E', .45, .3)}{lg('mgvP', '#8A9A2A', '#5E4A22')}</defs>
  <ellipse cx="55" cy="115" rx="50" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M4 114 C12 104 30 100 55 100 C80 100 98 104 106 114Z" fill="url(#mgvL)" stroke="#2E1E12" stroke-width="1.4"/>
  <path d="M8 108 C30 104 80 104 102 108 L104 113 C80 116 30 116 6 113Z" fill="url(#mgvA)" opacity=".85"/>
  <path d="M14 109 q5 -2 10 0 M60 108 q5 -2 10 0 M84 110 q4 -2 8 0" stroke="#E6FFFF" stroke-width="1" fill="none"/>
  {_raizes_mv}
  <path d="M55 76 C54 60 57 46 54 32 M54 48 C44 40 32 36 22 34 M55 42 C66 34 80 30 92 30" stroke="#3A1E12" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M55 76 C54 60 57 46 54 32 M54 48 C44 40 32 36 22 34 M55 42 C66 34 80 30 92 30" stroke="url(#mgvT)" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  <path d="M53 70 C52 60 54 50 52 40" stroke="#E0A87A" stroke-width="1.2" fill="none" opacity=".6"/>
  <path d="{copa(56, 34, 42, 20, 13, .24)}" fill="url(#mgvC0)" stroke="#0E3A22" stroke-width="1.6"/>
  <path d="{copa(52, 27, 28, 11, 10, .28)}" fill="url(#mgvC1)" stroke="#1E5A30" stroke-width="1.1"/>
  {_folhas(56, 34, 36, 15, 46, '#2E7A3E', '#0E3A22', '#9ADC8A', (5, 8))}{_folhas(52, 26, 24, 8, 18, '#6EBE5A', '#1E5A2A', '#E0F8C8', (5, 8))}
  <path d="M30 22 q10 -7 22 -7" stroke="#E6FFD8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  {_prop(30, 44, 22)}{_prop(70, 46, 26)}{_prop(84, 42, 18)}
  <g fill="#FFF6C8" stroke="#C8B860" stroke-width=".5"><circle cx="44" cy="44" r="2"/><circle cx="47" cy="45" r="1.6"/><circle cx="62" cy="44" r="1.8"/></g>
  <g transform="translate(22 96)"><ellipse cx="0" cy="3" rx="5" ry="1.6" fill="#1E140A" opacity=".4"/><path d="M-4 2 C-4 -3 4 -3 4 2Z" fill="#B8B0C8" stroke="#3E3A4A" stroke-width=".8"/></g>
</symbol>''')

# ---------- cavalo-marinho ----------
_aneis = ''.join(f'<path d="M{x1:.1f} {y1:.1f} q{dx:.1f} {dy:.1f} {ex:.1f} {ey:.1f}" stroke="#B8701A" stroke-width=".9" fill="none" opacity=".75"/>' for x1, y1, dx, dy, ex, ey in
                 [(40, 40, 6, 2, 12, 1), (38, 48, 7, 2, 14, 1), (38, 56, 7, 2, 15, 0), (40, 64, 6, 2, 13, -1), (42, 72, 5, 2, 11, -2), (44, 80, 4, 1, 9, -2), (48, 88, 3, 1, 7, -2)])
S.append(f'''<symbol id="f-cavalomarinho" viewBox="0 0 100 130">
  <defs>{lg('mgcC', '#FFD86A', '#F09A1E', 1, 1)}{rg('mgcB', '#FFF2B0', '#FFC84A', '#E8901A', .4, .3)}{lg('mgcA', '#6ED0D8', '#1E7A8E')}{lg('mgcR', '#B07A54', '#6E4028', 1, 1)}{lg('mgcAl', '#7CCB7A', '#2E7A4A')}</defs>
  <ellipse cx="50" cy="124" rx="40" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M8 126 C14 116 30 112 50 113 C72 112 88 116 94 126Z" fill="#8A6A4A" stroke="#3E2A18" stroke-width="1.3"/>
  {_tri('M74 126 C70 100 78 70 70 40 C68 30 72 20 80 12', '#3A1E12', 'url(#mgcR)', 6, '#E8B890')}
  <path d="M86 126 C84 110 90 100 86 86 M16 126 C18 112 12 104 16 92" stroke="#1E5A36" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M86 126 C84 110 90 100 86 86 M16 126 C18 112 12 104 16 92" stroke="url(#mgcAl)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M52 92 C56 102 64 106 70 100 C74 96 72 90 68 92 C70 96 66 98 62 96 C58 94 58 88 56 84" fill="none" stroke="#9A5A0E" stroke-width="7" stroke-linecap="round"/>
  <path d="M52 92 C56 102 64 106 70 100 C74 96 72 90 68 92 C70 96 66 98 62 96 C58 94 58 88 56 84" fill="none" stroke="url(#mgcC)" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M40 34 C30 40 30 56 34 66 C38 76 44 84 50 92 C56 92 58 86 56 80 C54 72 56 62 56 52 C56 42 50 34 40 34Z" fill="url(#mgcB)" stroke="#9A5A0E" stroke-width="1.8" stroke-linejoin="round"/>
  {_aneis}
  <path d="M55 50 C62 50 66 56 64 62 C62 66 58 64 56 62" fill="#FFE6A0" stroke="#B8701A" stroke-width="1.1"/><path d="M57 53 l5 2 M57 57 l6 1 M57 61 l4 0" stroke="#D8901A" stroke-width=".6"/>
  <path d="M34 46 C32 54 33 62 36 68" stroke="#FFF6D0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M38 28 C30 26 26 30 28 36 C30 40 36 40 40 38Z" fill="url(#mgcB)" stroke="#9A5A0E" stroke-width="1.6"/>
  <path d="M44 22 C50 18 54 22 52 30 C50 36 44 38 38 36 C34 32 36 26 44 22Z" fill="url(#mgcB)" stroke="#9A5A0E" stroke-width="1.8"/>
  <path d="M44 22 L46 14 L48 21 L51 15 L52 23" fill="#FFC84A" stroke="#9A5A0E" stroke-width="1" stroke-linejoin="round"/>
  <path d="M38 30 L20 34 C18 35 18 38 20 38 L36 36Z" fill="url(#mgcC)" stroke="#9A5A0E" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="44" cy="28" r="4.4" fill="#fff" stroke="#9A5A0E" stroke-width="1"/><circle cx="43.4" cy="28.4" r="2.8" fill="#1A0E0A"/><circle cx="44.4" cy="27.2" r="1.1" fill="#fff"/>
  <path d="M39 22 q4 -3 9 -1" stroke="#FFF6D0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="34" rx="2.6" ry="1.3" fill="#FF8A6A" opacity=".55"/>
  <path d="M24 37 q3 2 6 0" stroke="#7A3A0A" stroke-width=".9" fill="none" stroke-linecap="round"/>
  <g fill="none" stroke="#E6FFFF" stroke-width="1.2"><circle cx="16" cy="22" r="2.6"/><circle cx="22" cy="12" r="1.8"/><circle cx="12" cy="8" r="1.2"/></g>
</symbol>''')

# ---------- capa: maré seca no mangue ----------
def _raizC(x0, y0, x1, y1, h, w=1.4):
    return f'<path d="M{x0} {y0} C{x0 + (x1 - x0) * .42:.1f} {y0 - h} {x1 - (x1 - x0) * .08:.1f} {min(y0, y1) - h * .4:.1f} {x1} {y1}" stroke="#4E2A1A" stroke-width="{w + 1:.1f}" fill="none" stroke-linecap="round"/><path d="M{x0} {y0} C{x0 + (x1 - x0) * .42:.1f} {y0 - h} {x1 - (x1 - x0) * .08:.1f} {min(y0, y1) - h * .4:.1f} {x1} {y1}" stroke="#A8724C" stroke-width="{w:.1f}" fill="none" stroke-linecap="round"/>'
cap_raizes = ''.join(_raizC(*r) for r in [(30, 66, 8, 92, 8), (30, 66, 20, 96, 5), (31, 66, 44, 96, 6), (32, 64, 56, 88, 10), (28, 58, 4, 80, 6, 1.1), (34, 58, 62, 76, 12, 1.1)])
cap_fundo = ''.join(f'<path d="{copa(x, 60 + R(-2, 3), r, r * .55, 7, .3)}" fill="{c}"/>' for x, r, c in [(84, 12, '#6E9A5E'), (100, 10, '#7EA468'), (116, 12, '#6A9062'), (132, 9, '#86A86A')])
cap_pneu = ''.join(f'<path d="M{x:.1f} {y:.1f} v{-R(2, 4):.1f}" stroke="#6E5A3E" stroke-width="1.2" stroke-linecap="round"/>' for x, y in [(R(132, 168), R(80, 96)) for _ in range(18)])
cap_tocas = ''.join(f'<ellipse cx="{R(64, 128):.1f}" cy="{R(82, 98):.1f}" rx="1.8" ry=".8" fill="#2A1A10"/>' for _ in range(9))
cap_colh = ''.join(f'<g transform="translate({x} {y}) scale({k})"><path d="M-6 0 C-4 -3 4 -4 7 -1 C4 2 -2 2 -6 0Z" fill="#F49AB8" stroke="#B0386A" stroke-width=".4"/><path d="M6 -1 L10 -4" stroke="#FFE6EE" stroke-width="1.6" stroke-linecap="round"/><path d="M10 -4.4 L14 -3 C15.4 -2.6 15 -1 14 -1 C13 -1 13 -1.8 13 -2.2Z" fill="#6E7678"/><path d="M-1 -1 C-3 -8 2 -10 5 -11 C5 -6 4 -3 2 -1Z" fill="#F8B0C8" stroke="#B0386A" stroke-width=".4"/><path d="M0 -3 l2 -3" stroke="#D0285A" stroke-width="1.4" stroke-linecap="round"/><path d="M-6 0 l-2 .4 l2 1Z" fill="#F4B060"/></g>' for x, y, k in [(96, 26, 1), (110, 20, .8), (122, 30, .9), (136, 22, .7)])
S.append(f'''<symbol id="capa-mangue" viewBox="0 0 170 110">
  <defs>{ceu('cpMgC', '#7EC0EC', '#FFEAD4')}{ceu('cpMgL', '#8E7458', '#4E3624')}{ceu('cpMgA', '#4E9E9A', '#1E5A5E')}{ceu('cpMgB', '#9ED0D6', '#6AAEB8')}{rg('cpMgV', '#5EAA5A', '#2E7A3E', '#14502E', .45, .35)}{rg('cpMgP', '#B4C48C', '#8A9E6A', '#5E7250', .45, .35)}</defs>
  <rect width="170" height="110" fill="url(#cpMgC)"/>
  <circle cx="78" cy="16" r="9" fill="#FFF6DA" opacity=".5"/><circle cx="78" cy="16" r="6" fill="#F4F6FC" stroke="#A8B4CC" stroke-width=".7"/><circle cx="76" cy="14.6" r="1.6" fill="#D2DAEA"/><circle cx="80" cy="18" r="1.1" fill="#D2DAEA"/>
  <path d="M40 58 C60 44 80 42 100 48 C120 42 140 46 170 58Z" fill="#A8C0B4"/>
  <g>{''.join(f'<rect x="{x}" y="{y}" width="3.4" height="2.6" fill="{c}"/><path d="M{x - .4} {y} l2.1 -1.6 l2.1 1.6Z" fill="#D2583A"/>' for x, y, c in [(86, 49, '#FFF2E0'), (90.4, 48, '#FFE27A'), (94.8, 49, '#BFE6FF'), (99, 48.4, '#FFC2B0')])}</g>
  <rect y="56" width="170" height="10" fill="url(#cpMgB)"/>
  <g transform="translate(118 62)"><path d="M-6 0 C-4 2 4 2 7 -.4 L6 -1.4 H-6Z" fill="#7A4A2A"/><path d="M0 -1.4 V-13" stroke="#4A2E1A" stroke-width=".6"/><path d="M.4 -12.4 V-2 H7Z" fill="#FFF6E6"/><path d="M-.4 -11 V-2.4 H-6Z" fill="#F0E2C6"/></g>
  {cap_fundo}
  <path d="M0 66 H170 V100 C130 98 100 102 70 100 C40 98 20 102 0 100Z" fill="url(#cpMgL)"/>
  {tex(100, 84, 60, 10, 20, '#3E2A18', .6)}{cap_tocas}
  {cap_pneu}
  <path d="M150 92 C150 80 152 64 148 50" stroke="#4E4436" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M150 92 C150 80 152 64 148 50" stroke="#8A7E6A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="{copa(150, 40, 26, 16, 10, .28)}" fill="url(#cpMgP)" stroke="#4E5E3A" stroke-width=".8"/>
  {cap_raizes}
  <path d="M30 68 C30 56 31 46 30 36" stroke="#4E2A1A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 68 C30 56 31 46 30 36" stroke="#A86A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="{copa(30, 30, 34, 18, 12, .26)}" fill="url(#cpMgV)" stroke="#0E3A22" stroke-width="1"/>
  <path d="{copa(26, 24, 20, 9, 8, .3)}" fill="#7CC46A" opacity=".6"/>
  <g stroke="#5E4A22" stroke-width="1.4" stroke-linecap="round"><path d="M20 38 v9 M40 40 v8 M46 37 v7"/></g>
  <rect y="98" width="170" height="12" fill="url(#cpMgA)"/>
  <path d="M0 98 q5 -1.6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" stroke="#E6FFFA" stroke-width=".9" fill="none"/>
  <g transform="translate(74 88) scale(.62)">
    <ellipse cx="0" cy="1" rx="14" ry="2.4" fill="#1E140A" opacity=".3"/>
    <path d="M-7 0 V-14 M6 0 V-14" stroke="#F2F4F8" stroke-width="5" stroke-linecap="round"/>
    <path d="M-10 -14 L-11 -32 H11 L10 -14Z" fill="#2E3E8A"/>
    <path d="M-12 -30 C-13 -42 -9 -50 0 -50 C9 -50 13 -42 12 -30Z" fill="#F07050" stroke="#8A2E1E" stroke-width="1"/>
    <path d="M11 -46 C16 -40 18 -34 16 -28" stroke="#F07050" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <path d="M-11 -46 C-16 -40 -16 -34 -14 -28" stroke="#F07050" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-57" rx="7" ry="8" fill="#6E4028" stroke="#2E160A" stroke-width="1"/>
    <path d="M-18 -63 C-12 -67 12 -67 18 -63 C12 -60 -12 -60 -18 -63Z M-7 -64 C-7 -73 7 -73 7 -64Z" fill="#E8C870" stroke="#7A5A1E" stroke-width=".9"/>
    <path d="M-7 -65 h14" stroke="#1E8A6A" stroke-width="1.8"/>
    <circle cx="-2.6" cy="-57" r="1" fill="#1A0E0A"/><circle cx="2.8" cy="-57" r="1" fill="#1A0E0A"/><path d="M-2.4 -53.4 q2.4 2 4.8 0" stroke="#4E1A0A" stroke-width=".9" fill="none" stroke-linecap="round"/>
    <g transform="translate(20 -4)"><path d="M-9 0 C-11 -9 -9 -16 -7 -17 H7 C9 -16 11 -9 9 0 C5 2 -5 2 -9 0Z" fill="#D8AE6A" stroke="#5E3A14" stroke-width="1"/><path d="M-10 -6 H10 M-10 -11 H10" stroke="#7A4E1E" stroke-width=".8"/></g>
  </g>
  {cap_colh}
  <svg x="100" y="74" width="34" height="28" viewBox="0 0 120 100"><use class="sem" href="#f-caranguejouca"/></svg>
</symbol>''')
