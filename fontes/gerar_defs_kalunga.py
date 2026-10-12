# figurinhas e capa do Kalunga (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(211)

def _riscos(pts, cor, w=.8, op=.7):
    return f'<path d="{" ".join(f"M{x:.1f} {y:.1f} q{d / 2:.1f} {-abs(d) * .3:.1f} {d:.1f} 0" for x, y, d in pts)}" stroke="{cor}" stroke-width="{w}" fill="none" stroke-linecap="round" opacity="{op}"/>'

# ---------- seriema (Seri) ----------
_ser_peito = _riscos([(R(46, 64), R(44, 76), R(2.4, 4)) for _ in range(22)], '#8A7456', .9, .75)
_ser_pena = ''.join(f'<path d="M{x} {y} q-6 3 -12 2" stroke="#5E4A32" stroke-width="1.1" fill="none" opacity=".75"/>' for x, y in [(44, 60), (42, 66), (40, 72), (46, 70), (36, 64)])
_ser_cauda = ''.join(f'<path d="M{24 - i * 4.4:.1f} {74 + i * 6:.1f} l7 -3" stroke="#3E3022" stroke-width="2.2" stroke-linecap="round"/>' for i in range(4))
_ser_crista = ''.join(f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" stroke="#5E4A32" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" stroke="#B8A68A" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
                     for x0, y0, x1, y1, x2, y2 in [(71, 21, 70, 12, 66, 4), (73, 21, 74, 12, 72, 3), (74, 22, 78, 14, 78, 6), (70, 22, 66, 14, 61, 9)])
S.append(f'''<symbol id="f-seriema" viewBox="0 0 100 130">
  <defs>{lg('kasCorpo', '#E6D8BC', '#A8916C')}{rg('kasCab', '#F4EAD6', '#D2C2A2', '#A8946E', .45, .35)}{lg('kasAsa', '#B09670', '#6E5A3E')}{lg('kasPerna', '#FF8A4A', '#D8482A')}{lg('kasChao', '#D8C27A', '#A8904A')}{lg('kasBico', '#FF6A4A', '#C8301E')}</defs>
  <ellipse cx="52" cy="124" rx="34" ry="4.6" fill="#0A1440" opacity=".18"/>
  <path d="M18 126 C24 118 40 116 54 117 C70 116 84 119 88 126Z" fill="url(#kasChao)" stroke="#7A6A2E" stroke-width="1.2"/>
  {capim(20, 86, 121, 14, '#7A8A2E', (4, 9), 1.4)}
  <path d="M30 70 C22 80 14 92 8 104 C14 104 20 98 24 92 C26 88 30 82 34 76Z" fill="url(#kasAsa)" stroke="#3E3022" stroke-width="1.4" stroke-linejoin="round"/>{_ser_cauda}
  <path d="M8 104 C12 103 16 100 18 97" stroke="#F4EAD6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M46 82 L42 100 L44 121 M56 82 L58 100 L55 121" stroke="#8E2A14" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M46 82 L42 100 L44 121 M56 82 L58 100 L55 121" stroke="url(#kasPerna)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M44 121 l-7 1.4 M44 121 l7 1 M44 121 l-2 3 M55 121 l-7 1.2 M55 121 l7 1.2 M55 121 l2 3" stroke="#B83A1E" stroke-width="2" stroke-linecap="round"/>
  <path d="M43.6 92 l2 1 M57.4 92 l-2 1" stroke="#FFC0A0" stroke-width="1" opacity=".8"/>
  <path d="M28 66 C26 52 40 44 56 46 C70 48 76 58 72 70 C68 82 54 88 42 86 C32 84 28 76 28 66Z" fill="url(#kasCorpo)" stroke="#5E4A32" stroke-width="1.8"/>
  {_ser_peito}
  <path d="M30 64 C32 54 42 50 52 52 C50 62 46 74 36 80 C31 76 29 70 30 64Z" fill="url(#kasAsa)" stroke="#3E3022" stroke-width="1.3"/>{_ser_pena}
  <path d="M34 56 C38 51 46 49 52 50" stroke="#F4EAD6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M58 50 C60 40 62 34 63 30 L72 32 C70 38 70 44 70 52Z" fill="url(#kasCorpo)" stroke="#5E4A32" stroke-width="1.6" stroke-linejoin="round"/>
  {_riscos([(R(60, 68), R(34, 50), R(2, 3)) for _ in range(8)], '#8A7456', .8, .7)}
  {_ser_crista}
  <circle cx="66" cy="26" r="11.5" fill="url(#kasCab)" stroke="#5E4A32" stroke-width="1.8"/>
  <path d="M58 20 C61 16 66 15 70 16" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M75 25 C82 24 88 26 90 30 C86 30 82 30 76 31Z" fill="url(#kasBico)" stroke="#7A1A0E" stroke-width="1.2" stroke-linejoin="round"/><path d="M76 29 H86" stroke="#7A1A0E" stroke-width=".7"/><path d="M89 29.6 q1 1.4 -.6 2.2" stroke="#7A1A0E" stroke-width="1" fill="none"/>
  <circle cx="69" cy="24.6" r="5.4" fill="#9AD4F2" stroke="#4E8AB0" stroke-width=".9"/>
  <circle cx="69.4" cy="24.8" r="3.6" fill="#E8C23A"/><circle cx="69.6" cy="24.9" r="2.4" fill="#12121A"/><circle cx="70.6" cy="23.7" r="1.1" fill="#fff"/><circle cx="68.6" cy="26" r=".45" fill="#fff"/>
  <path d="M63.4 21.6 q3 -2.4 7 -1.6" stroke="#3E3022" stroke-width="1" fill="none" stroke-linecap="round"/>
  <ellipse cx="67" cy="32" rx="3" ry="1.6" fill="#FF8A7A" opacity=".55"/>
</symbol>''')

# ---------- pato-mergulhão ----------
_pm_barras = ''.join(f'<path d="M{x:.1f} {y:.1f} q2.4 -1.6 5 0" stroke="#5E6E7A" stroke-width=".8" fill="none" opacity=".7"/>' for x, y in [(R(36, 82), R(58, 72)) for _ in range(26)])
_pm_crista = 'M88 22 C82 16 76 16 70 18 C74 20 76 22 76 24 C70 22 64 24 62 28 C68 28 72 30 74 32 C70 32 66 36 66 40 C72 38 78 36 82 36Z'
S.append(f'''<symbol id="f-patomergulhao" viewBox="0 0 130 100">
  <defs>{lg('kapAgua', '#7FE0E6', '#1E8AA8')}{lg('kapCostas', '#8A9AA6', '#4A5A66')}{lg('kapFlanco', '#E8EEF2', '#AEBAC4')}{rg('kapCab', '#3E6A5A', '#1E3A32', '#0A1A14', .4, .3)}</defs>
  <ellipse cx="64" cy="84" rx="60" ry="12" fill="url(#kapAgua)" stroke="#126A86" stroke-width="1.4"/>
  {ondas(14, 110, 86, '#E6FFFF', 1.2, .8)}{ondas(30, 96, 92, '#BFF4F6', 1, .6)}
  <path d="M20 66 C16 60 18 56 24 58 L30 62Z" fill="#2E3A42" stroke="#12181E" stroke-width="1.2"/>
  <path d="M22 66 C24 56 40 52 60 54 C78 55 92 60 94 70 C92 80 70 84 50 83 C34 82 22 76 22 66Z" fill="url(#kapFlanco)" stroke="#3E4A54" stroke-width="1.8"/>
  {_pm_barras}
  <path d="M26 62 C34 54 50 52 66 55 C74 57 80 60 82 64 C70 62 52 62 40 66 C34 68 28 66 26 62Z" fill="url(#kapCostas)" stroke="#2E3A44" stroke-width="1.3"/>
  <path d="M46 64 C54 62 62 62 70 64 L66 70 C58 69 52 69 46 70Z" fill="#FFFFFF" stroke="#2E3A44" stroke-width="1.1"/><path d="M48 67 H66" stroke="#1E2A34" stroke-width="1.2"/>
  <path d="M32 58 C40 54 52 53 62 55" stroke="#C8D6E0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M30 80 C46 84 70 84 88 78" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>
  <path d="M84 64 C88 56 86 48 84 42 L96 40 C98 48 98 56 92 66Z" fill="url(#kapCab)" stroke="#0A1A14" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M84 64 C88 64 92 66 94 68" stroke="#E8EEF2" stroke-width="1.6" fill="none" opacity=".7"/>
  <path d="{_pm_crista}" fill="#16302A" stroke="#0A1A14" stroke-width="1.2" stroke-linejoin="round"/>
  <circle cx="90" cy="32" r="11" fill="url(#kapCab)" stroke="#0A1A14" stroke-width="1.7"/>
  <path d="M84 24 C87 22 92 21 95 22" stroke="#7AC8A8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M99 33 C108 32 118 33 125 36 C126 37.6 125 38.6 123 38.4 C116 38 108 37.6 99 38Z" fill="#2A2A30" stroke="#0A0A10" stroke-width="1.1" stroke-linejoin="round"/>
  <path d="M102 37.6 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1" stroke="#5A5A64" stroke-width=".6" fill="none"/><path d="M124 36.6 q2 1 0 3" stroke="#0A0A10" stroke-width="1" fill="none"/>
  <path d="M102 34 H118" stroke="#6A6A78" stroke-width=".9" opacity=".8"/>
  <circle cx="93" cy="30" r="3.8" fill="#FFF6E8" stroke="#0A1A14" stroke-width=".7"/><circle cx="93.6" cy="30.2" r="2.6" fill="#3A1A0E"/><circle cx="94.6" cy="29" r="1.1" fill="#fff"/><circle cx="92.6" cy="31.4" r=".45" fill="#fff"/>
  <ellipse cx="94" cy="38" rx="2.6" ry="1.4" fill="#FF8AA0" opacity=".45"/>
</symbol>''')
S.append(f'''<symbol id="f-patomergulhao-n" viewBox="0 0 130 100">
  <defs>{lg('kapnCostas', '#8A9AA6', '#4A5A66')}{lg('kapnFlanco', '#E8EEF2', '#AEBAC4')}{rg('kapnCab', '#3E6A5A', '#1E3A32', '#0A1A14', .4, .3)}</defs>
  <path d="M20 66 C16 60 18 56 24 58 L30 62Z" fill="#2E3A42" stroke="#12181E" stroke-width="1.2"/>
  <path d="M22 66 C24 56 40 52 60 54 C78 55 92 60 94 70 C92 80 70 84 50 83 C34 82 22 76 22 66Z" fill="url(#kapnFlanco)" stroke="#3E4A54" stroke-width="1.8"/>
  {_pm_barras}
  <path d="M26 62 C34 54 50 52 66 55 C74 57 80 60 82 64 C70 62 52 62 40 66 C34 68 28 66 26 62Z" fill="url(#kapnCostas)" stroke="#2E3A44" stroke-width="1.3"/>
  <path d="M46 64 C54 62 62 62 70 64 L66 70 C58 69 52 69 46 70Z" fill="#FFFFFF" stroke="#2E3A44" stroke-width="1.1"/><path d="M48 67 H66" stroke="#1E2A34" stroke-width="1.2"/>
  <path d="M32 58 C40 54 52 53 62 55" stroke="#C8D6E0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M30 80 C46 84 70 84 88 78" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>
  <path d="M84 64 C88 56 86 48 84 42 L96 40 C98 48 98 56 92 66Z" fill="url(#kapnCab)" stroke="#0A1A14" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M84 64 C88 64 92 66 94 68" stroke="#E8EEF2" stroke-width="1.6" fill="none" opacity=".7"/>
  <path d="{_pm_crista}" fill="#16302A" stroke="#0A1A14" stroke-width="1.2" stroke-linejoin="round"/>
  <circle cx="90" cy="32" r="11" fill="url(#kapnCab)" stroke="#0A1A14" stroke-width="1.7"/>
  <path d="M84 24 C87 22 92 21 95 22" stroke="#7AC8A8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M99 33 C108 32 118 33 125 36 C126 37.6 125 38.6 123 38.4 C116 38 108 37.6 99 38Z" fill="#2A2A30" stroke="#0A0A10" stroke-width="1.1" stroke-linejoin="round"/>
  <path d="M102 37.6 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1" stroke="#5A5A64" stroke-width=".6" fill="none"/><path d="M124 36.6 q2 1 0 3" stroke="#0A0A10" stroke-width="1" fill="none"/>
  <path d="M102 34 H118" stroke="#6A6A78" stroke-width=".9" opacity=".8"/>
  <circle cx="93" cy="30" r="3.8" fill="#FFF6E8" stroke="#0A1A14" stroke-width=".7"/><circle cx="93.6" cy="30.2" r="2.6" fill="#3A1A0E"/><circle cx="94.6" cy="29" r="1.1" fill="#fff"/><circle cx="92.6" cy="31.4" r=".45" fill="#fff"/>
  <ellipse cx="94" cy="38" rx="2.6" ry="1.4" fill="#FF8AA0" opacity=".45"/>
</symbol>''')

# ---------- veado-campeiro ----------
S.append(f'''<symbol id="f-veadocampeiro" viewBox="0 0 120 120">
  <defs>{lg('kavCorpo', '#E8B070', '#B87436')}{rg('kavCab', '#F2C080', '#D99A56', '#AE6A30', .4, .3)}{lg('kavChao', '#E2CC7A', '#B0944A')}{lg('kavPerna', '#C8864A', '#8A5426')}{lg('kavChifre', '#F2E2C2', '#B8A07A')}</defs>
  <ellipse cx="58" cy="114" rx="40" ry="4.4" fill="#0A1440" opacity=".18"/>
  <path d="M12 116 C20 106 40 104 60 105 C80 104 100 106 108 116Z" fill="url(#kavChao)" stroke="#7A6A2E" stroke-width="1.2"/>
  {capim(14, 106, 110, 18, '#8A8A2E', (5, 11), 1.4)}
  <path d="M40 74 L36 96 L38 110 M48 76 L48 96 L46 110 M70 74 L74 96 L72 110 M78 72 L84 94 L82 109" stroke="#6E3E18" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 74 L36 96 L38 110 M48 76 L48 96 L46 110 M70 74 L74 96 L72 110 M78 72 L84 94 L82 109" stroke="url(#kavPerna)" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36 109.6 h4 M44 109.6 h4 M70 109.6 h4 M80 108.6 h4" stroke="#2A1A10" stroke-width="3" stroke-linecap="round"/>
  <path d="M30 62 C26 56 28 50 32 50 C34 54 34 58 34 62Z" fill="#FFFFFF" stroke="#8A5426" stroke-width="1.2"/><path d="M31 52 C32 50 34 50 34 54" stroke="#B87436" stroke-width="2" fill="none"/>
  <path d="M30 66 C30 56 44 52 60 52 C74 52 86 56 88 66 C90 76 80 82 60 82 C42 82 30 76 30 66Z" fill="url(#kavCorpo)" stroke="#7A4420" stroke-width="1.8"/>
  <path d="M36 74 C46 82 70 82 82 76 C76 80 64 82 58 82 C48 82 40 80 36 74Z" fill="#FFF4E2" stroke="#C8A27A" stroke-width=".8"/>
  <path d="M38 60 C46 55 60 54 72 56" stroke="#FFE0B0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M78 60 C80 50 84 42 88 36 L98 40 C94 48 90 56 88 64Z" fill="url(#kavCorpo)" stroke="#7A4420" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M86 52 C88 48 90 45 92 42 L96 44 C93 49 91 52 89 56Z" fill="#FFF4E2"/>
  <path d="M86 22 C84 14 80 10 76 8 M84 16 L78 16 M90 22 C92 14 96 10 100 8 M92 15 L98 17" stroke="#7A5A3A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M86 22 C84 14 80 10 76 8 M84 16 L78 16 M90 22 C92 14 96 10 100 8 M92 15 L98 17" stroke="url(#kavChifre)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M80 26 C72 22 68 16 70 12 C76 14 80 20 82 24Z" fill="#D99A56" stroke="#7A4420" stroke-width="1.3"/><path d="M78 23 C74 20 72 17 72 14" stroke="#FFD6C0" stroke-width="1.6" fill="none"/>
  <path d="M96 26 C104 22 108 16 106 12 C100 14 96 20 94 24Z" fill="#D99A56" stroke="#7A4420" stroke-width="1.3"/><path d="M98 23 C102 20 104 17 104 14" stroke="#FFD6C0" stroke-width="1.6" fill="none"/>
  <path d="M80 30 C80 22 96 20 98 30 C100 38 104 42 104 46 C104 50 98 50 94 48 C88 46 80 40 80 30Z" fill="url(#kavCab)" stroke="#7A4420" stroke-width="1.7"/>
  <path d="M96 44 C98 47 101 48 103 47" stroke="#FFF4E2" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="102.6" cy="45" rx="2.6" ry="2" fill="#2A1A12"/><circle cx="102" cy="44.2" r=".7" fill="#fff" opacity=".8"/>
  <circle cx="89" cy="32" r="5" fill="#FFF8EC"/><ellipse cx="89.6" cy="32.4" rx="3" ry="3.4" fill="#1A0E0A"/><circle cx="90.6" cy="31" r="1.2" fill="#fff"/><circle cx="88.8" cy="33.8" r=".45" fill="#fff"/>
  <path d="M83 26 C85 24 88 23 91 23" stroke="#FFE6C0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="95" cy="40" rx="2.8" ry="1.5" fill="#FF8A7A" opacity=".5"/>
</symbol>''')

# ---------- baru ----------
def _fol(x, y, a, L, cor='url(#kabF)'):
    ca, sa = math.cos(a), math.sin(a)
    P = lambda u, v: f'{x + ca * u - sa * v:.1f} {y + sa * u + ca * v:.1f}'
    return f'<path d="M{P(0, 0)} Q{P(L * .5, -L * .32)} {P(L, 0)} Q{P(L * .5, L * .32)} {P(0, 0)}Z" fill="{cor}" stroke="#1E4A1E" stroke-width=".9"/><path d="M{P(L * .1, 0)} L{P(L * .86, 0)}" stroke="#3E7A2A" stroke-width=".6"/>'
_ba_folhas = ''
for (bx, by, ang) in [(30, 50, -2.3), (52, 34, -1.6), (78, 30, -1.0), (96, 44, -.5)]:
    ca, sa = math.cos(ang), math.sin(ang)
    ex, ey = bx + ca * 26, by + sa * 26
    _ba_folhas += f'<path d="M{bx} {by} L{ex:.1f} {ey:.1f}" stroke="#4E6A2A" stroke-width="1.2"/>'
    for k in range(4):
        t = .2 + k * .24; px, py = bx + ca * 26 * t, by + sa * 26 * t
        _ba_folhas += _fol(px, py, ang - 1.1, 10 + k, 'url(#kabF)' if k % 2 else 'url(#kabF2)') + _fol(px, py, ang + 1.1, 10 + k, 'url(#kabF2)' if k % 2 else 'url(#kabF)')
    _ba_folhas += _fol(ex, ey, ang, 12)
def _fruto(x, y, r=1, rot=0):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({r})"><path d="M0 -14 v5" stroke="#5E4A2A" stroke-width="1.6"/>'
            f'<ellipse cx="0" cy="0" rx="8" ry="10.6" fill="url(#kabFr)" stroke="#4E3016" stroke-width="1.4"/>'
            f'<g fill="#7A4E26" opacity=".6"><circle cx="-3" cy="2" r=".9"/><circle cx="2" cy="5" r=".8"/><circle cx="3" cy="-3" r=".7"/><circle cx="-1" cy="-6" r=".7"/></g>'
            f'<path d="M-4 -5 q1.6 -3.4 4.6 -3.6" stroke="#F2D2A0" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>')
S.append(f'''<symbol id="f-baru" viewBox="0 0 120 120">
  <defs>{lg('kabF', '#8CD05A', '#3E8A2E')}{lg('kabF2', '#5EB06A', '#2E6A3A')}{rg('kabFr', '#D8A26A', '#A8723E', '#7A4A22', .4, .3)}{lg('kabG', '#9A6A3E', '#5E3A1E')}{lg('kabChao', '#C8A86A', '#8A6A3A')}{lg('kabNoz', '#C8784A', '#7A3A1E')}{lg('kabCasca', '#E8C8A0', '#B08A5A')}</defs>
  <ellipse cx="60" cy="113" rx="44" ry="4.4" fill="#0A1440" opacity=".18"/>
  <path d="M14 114 C22 104 40 102 60 103 C80 102 98 104 106 114Z" fill="url(#kabChao)" stroke="#5E4422" stroke-width="1.3"/>
  {capim(16, 104, 108, 14, '#7A8A2E', (4, 8), 1.3)}
  <g transform="translate(5 12) scale(.9)"><path d="M6 70 C20 60 30 52 52 34 C64 26 82 26 106 46" stroke="#3E2414" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M6 70 C20 60 30 52 52 34 C64 26 82 26 106 46" stroke="url(#kabG)" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <path d="M14 63 l3 -1 M30 52 l3 -2 M70 28 l3 0 M90 34 l3 2" stroke="#2A1A0E" stroke-width="1" opacity=".7"/>
  {_ba_folhas}
  {_fruto(42, 58, 1, 8)}{_fruto(64, 50, 1.05, -4)}{_fruto(86, 58, .95, -10)}</g>
  <g transform="translate(60 100)">
    <path d="M-30 0 C-34 -10 -26 -18 -16 -16 C-10 -15 -8 -8 -10 -2Z" fill="url(#kabFr)" stroke="#4E3016" stroke-width="1.3"/>
    <path d="M-27 -2 C-29 -9 -24 -14 -17 -13 C-13 -12 -12 -7 -13 -3Z" fill="url(#kabCasca)" stroke="#8A6A3A" stroke-width=".9"/>
    <path d="M-2 0 C-6 -6 -2 -12 6 -12 C14 -12 18 -6 14 0 C10 3 2 3 -2 0Z" fill="url(#kabNoz)" stroke="#4E1E0E" stroke-width="1.3"/>
    <path d="M2 -8 C5 -10 9 -10 12 -8" stroke="#F2B8A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M18 2 C16 -6 22 -12 28 -10 C34 -8 34 0 30 3 C26 5 20 5 18 2Z" fill="url(#kabNoz)" stroke="#4E1E0E" stroke-width="1.3"/>
    <path d="M22 -6 C24 -8 27 -8 29 -7" stroke="#F2B8A0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  </g>
</symbol>''')

# ---------- capa: território Kalunga ----------
def _arv(x, y, h, c0, c1):
    return (f'<path d="M{x} {y} C{x - 1} {y - h * .3} {x + 1} {y - h * .5} {x} {y - h * .6}" stroke="#5E3E26" stroke-width="1.4" fill="none"/>'
            f'<path d="{copa(x, y - h * .78, h * .4, h * .26, 8, .3)}" fill="{c0}" stroke="{c1}" stroke-width=".7"/>')
_cap_arv = ''.join(_arv(x, y, h, c0, c1) for x, y, h, c0, c1 in [(10, 64, 16, '#8EB850', '#4E6A22'), (44, 62, 12, '#C8B05A', '#7A6A2A'), (30, 66, 14, '#6EA88A', '#2E5A44'), (92, 64, 13, '#9AC05A', '#4E6A22')])
S.append(f'''<symbol id="capa-kalunga" viewBox="0 0 170 110">
  <defs>{ceu('cpKaC', '#6EBCF0', '#FFE9C4')}{ceu('cpKaM', '#B4B2DA', '#C9CBE6')}{ceu('cpKaR', '#D99E74', '#8E5442')}{ceu('cpKaQ', '#FFFFFF', '#C8F2F2')}{ceu('cpKaP', '#7FF0E6', '#1E9AB0')}{ceu('cpKaG', '#B8C46A', '#7A9A3E')}{ceu('cpKaPa', '#F2D27A', '#B8902E')}{ceu('cpKaA', '#D9A272', '#A86A44')}{ceu('cpKaCu', '#D29A6A', '#9A5E3A')}</defs>
  <rect width="170" height="110" fill="url(#cpKaC)"/>
  <circle cx="84" cy="18" r="11" fill="#FFE27A" opacity=".35"/><circle cx="84" cy="18" r="6.4" fill="#FFC83D" stroke="#F0A81E" stroke-width=".8"/>
  <use href="#nuvem" x="18" y="6" width="34" height="16" style="color:#fff" opacity=".9"/>
  <path d="M0 52 L0 34 L10 30 L52 28 L60 34 L72 40 L100 38 L108 30 L130 28 V52Z" fill="url(#cpKaM)"/>
  <path d="M10 30 L52 28 M108 30 L130 28" stroke="#EEEAF8" stroke-width="1"/>
  <path d="M0 56 C30 46 60 48 100 52 L118 56 V110 H0Z" fill="url(#cpKaG)"/>
  {_cap_arv}
  <path d="M112 100 L114 70 L120 44 L128 26 L140 16 L170 12 V100Z" fill="url(#cpKaR)" stroke="#5E3428" stroke-width="1"/>
  <path d="M120 44 C130 42 140 46 150 42 M116 66 C128 64 140 68 150 64 M150 30 C158 28 164 30 170 28" stroke="#7A4434" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M141 16 C140 40 138 60 134 82 L156 82 C152 60 150 40 150 15Z" fill="url(#cpKaQ)" opacity=".95"/>
  <path d="M143 18 V80 M147 18 C147 40 148 60 150 80" stroke="#BFEFF2" stroke-width="1" stroke-dasharray="4 3"/>
  <path d="{copa(132, 18, 7, 4, 7, .35)}" fill="#6EA88A" stroke="#2E5A44" stroke-width=".7"/><path d="{copa(162, 12, 8, 4, 7, .35)}" fill="#8EB850" stroke="#4E6A22" stroke-width=".7"/>
  <ellipse cx="142" cy="90" rx="34" ry="11" fill="url(#cpKaP)" stroke="#126A86" stroke-width="1"/>
  <ellipse cx="144" cy="83" rx="12" ry="3" fill="#fff" opacity=".9"/>
  <path d="M118 92 q6 -2 12 0 M146 96 q6 -2 12 0" stroke="#E6FFFF" stroke-width="1" fill="none"/>
  <g fill="#7A5A4A" stroke="#3A2018" stroke-width=".7"><ellipse cx="110" cy="96" rx="6" ry="3"/><ellipse cx="174" cy="94" rx="6" ry="4"/><ellipse cx="124" cy="100" rx="5" ry="2.4"/></g>
  <path d="M40 110 C46 96 60 90 82 92 C96 93 104 96 112 96" stroke="#9A7440" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M40 110 C46 96 60 90 82 92 C96 93 104 96 112 96" stroke="#EAD2A0" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g transform="translate(52 72)"><rect x="0" y="-12" width="28" height="14" fill="url(#cpKaA)" stroke="#5E321A" stroke-width=".9"/><rect x="17" y="-8" width="5" height="10" fill="#6E4224"/><rect x="4" y="-8" width="6" height="5" fill="#3A2416" stroke="#5E321A" stroke-width=".6"/><path d="M-5 -11 L14 -26 L33 -11Z" fill="url(#cpKaPa)" stroke="#7A5A1E" stroke-width=".9" stroke-linejoin="round"/><path d="M0 -12 L14 -23 M28 -12 L14 -23 M6 -12 L14 -20 M22 -12 L14 -20" stroke="#A8822E" stroke-width=".5"/></g>
  <g stroke="#5E3A22" stroke-width="1" opacity=".7"><path d="M84 78 h22 M86 82 h22 M88 86 h20"/></g>
  <g>{''.join(f'<path d="M{x} 79 v-6 M{x} 75 l-2 -2 M{x} 76 l2 -2" stroke="#4E8A2E" stroke-width="1" stroke-linecap="round"/>' for x in (88, 94, 100, 106))}</g>
  <path d="M100 104 C120 100 150 101 170 99 V110 H100Z" fill="#9A8A5A"/><g fill="#7A5A4A" stroke="#3A2018" stroke-width=".7"><ellipse cx="160" cy="104" rx="7" ry="3.4"/><ellipse cx="128" cy="106" rx="5" ry="2.4"/></g>
  <path d="M-2 110 C2 98 6 88 10 82 C14 78 18 80 20 86 C24 96 28 104 30 110Z" fill="url(#cpKaCu)" stroke="#5E3420" stroke-width="1"/>
  <svg x="2" y="50" width="26" height="34" viewBox="0 0 100 130"><use href="#f-seriema"/></svg>
  <svg x="124" y="84" width="22" height="17" viewBox="0 0 130 100"><use href="#f-patomergulhao"/></svg>
</symbol>''')
