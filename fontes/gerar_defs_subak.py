# figurinhas e capa dos Terraços de Bali / subak (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(115)

# ---------- estorninho-de-bali (Puti) ----------
def _pluma(x0, y0, cx, cy, x1, y1, w):
    # pena fina e comprida, afinando na ponta (crista caída para trás)
    return (f'<path d="M{x0} {y0 - w} Q{cx} {cy - w} {x1} {y1} Q{cx} {cy + w} {x0} {y0 + w}Z" fill="url(#suEsCr)" stroke="#A4B0C8" stroke-width=".9" stroke-linejoin="round"/>')
_crista = (_pluma(86, 29, 74, 16, 58, 30, 2.6) + _pluma(83, 30, 70, 20, 54, 38, 2.4) + _pluma(80, 32, 66, 26, 52, 46, 2.2)
           + _pluma(88, 28, 80, 14, 64, 22, 2.2))
S.append(f'''<symbol id="f-estorninho" viewBox="0 0 120 110">
  <defs>{rg('suEsC', '#FFFFFF', '#F3F6FB', '#C8D2E2', .45, .3)}{lg('suEsCr', '#FFFFFF', '#E2E8F2')}{rg('suEsOlho', '#9ADCFF', '#2E8CEA', '#1A5CC0', .4, .35)}{lg('suEsBico', '#F6ECC4', '#B8A468')}{lg('suEsGalho', '#9A6A42', '#5A3A20')}{lg('suEsAsa', '#FFFFFF', '#D8E0EC')}{lg('suEsPreto', '#3A3E50', '#0E1018')}</defs>
  <ellipse cx="60" cy="104" rx="42" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M6 90 C30 84 70 86 114 80" stroke="#3E2612" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M6 90 C30 84 70 86 114 80" stroke="url(#suEsGalho)" stroke-width="6.4" fill="none" stroke-linecap="round"/>
  <path d="M14 88 C30 84 60 85 90 82" stroke="#C49A6E" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M96 82 C100 74 106 70 112 68" stroke="#4E2E16" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M112 68 C104 64 98 66 96 72 C102 74 108 72 112 68Z" fill="#5EB84A" stroke="#2E6A22" stroke-width="1.1"/><path d="M110 69 l-12 2" stroke="#2E6A22" stroke-width=".8"/>
  <path d="M18 88 C14 80 8 78 2 80 C6 86 12 90 18 88Z" fill="#7ACB5A" stroke="#2E6A22" stroke-width="1.1"/>
  <path d="M42 68 C34 76 24 86 14 96 L20 101 C30 92 40 82 48 74Z" fill="url(#suEsAsa)" stroke="#7A88A4" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M14 96 L20 101 L25.6 95.4 L19.4 90.4Z" fill="url(#suEsPreto)" stroke="#0A0C14" stroke-width=".9" stroke-linejoin="round"/>
  <g stroke="#5E7AA6" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M58 78 L57 88 M66 77 L67 88"/></g>
  <g stroke="#3E5A86" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M52 88 h9 M57 88 l2 3 M62 88 h9 M67 88 l2 3"/></g>
  <path d="M44 56 C50 46 70 44 80 50 C88 56 86 70 74 77 C64 82 50 82 42 75 C37 70 39 61 44 56Z" fill="url(#suEsC)" stroke="#7A88A4" stroke-width="1.7"/>
  <path d="M48 58 C58 53 70 55 74 62 C72 70 62 74 50 73 C44 70 44 62 48 58Z" fill="url(#suEsAsa)" stroke="#8C9AB4" stroke-width="1.2"/>
  <path d="M53 62 q8 -2 15 1 M51 67 q9 -1 17 2" stroke="#B4C0D4" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M50 72 C43 75 35 80 28 84 C31 79 36 73 44 68Z" fill="url(#suEsPreto)" stroke="#0A0C14" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M44 72 l-6 5 M47 73 l-7 6" stroke="#5A6280" stroke-width=".7"/>
  {_crista}
  <path d="M74 50 C72 44 74 36 80 32 C86 28 94 32 95 38 C96 44 92 49 86 51 C82 52 77 52 74 50Z" fill="url(#suEsC)" stroke="#7A88A4" stroke-width="1.6"/>
  <path d="M78 36 C81 31.6 89 32 92.6 37.4 C92.4 42.6 86 45 81 43.6 C77.6 42.4 76.6 39 78 36Z" fill="url(#suEsOlho)" stroke="#1A4E9A" stroke-width="1"/>
  <path d="M92 36.4 L106 40 L92 43 C93.6 41 93.6 38.4 92 36.4Z" fill="url(#suEsBico)" stroke="#7A6230" stroke-width="1.1" stroke-linejoin="round"/>
  <path d="M93 39.8 H103" stroke="#7A6230" stroke-width=".7"/>
  <circle cx="85.4" cy="38" r="3.8" fill="#2A1A10"/><circle cx="86.8" cy="36.5" r="1.5" fill="#fff"/><circle cx="84.4" cy="39.6" r=".55" fill="#fff"/>
  <ellipse cx="86" cy="47" rx="3" ry="1.6" fill="#FF9AAE" opacity=".5"/>
  <path d="M77 33 C80 30 84 29 87 29.6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M50 50 C56 46 64 45 70 46" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
</symbol>''')

# ---------- pato-corredor ----------
_pintas = ''.join(f'<path d="M{x:.1f} {y:.1f} q2 -1.4 4 0" stroke="#9A7040" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".55"/>' for x, y in [(R(38, 50), R(62, 100)) for _ in range(7)])
S.append(f'''<symbol id="f-patocorredor" viewBox="0 0 100 130">
  <defs>{rg('suPcC', '#FBEBCB', '#DDB886', '#A87E4E', .4, .3)}{lg('suPcPeito', '#FFFFFF', '#E8E6E0')}{lg('suPcBico', '#E6DE78', '#A8A43A')}{lg('suPcPe', '#FFB24A', '#E0782A')}{lg('suPcAsa', '#D2A46A', '#93653A')}</defs>
  <ellipse cx="52" cy="122" rx="28" ry="4" fill="#0A1440" opacity=".18"/>
  <g stroke="#B85E1A" stroke-width="1.2" stroke-linejoin="round" fill="url(#suPcPe)">
    <path d="M45 112 L44 118 L36 122 L46 122 L49 120 L52 122 L50 118 L49 112Z"/>
    <path d="M57 112 L58 118 L54 122 L63 122 L66 120 L70 122 L63 118 L61 112Z"/>
  </g>
  <path d="M38 102 C32 104 28 102 25 97 C30 95 35 96 39 98Z" fill="url(#suPcAsa)" stroke="#6E4622" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M45 30 C45 46 34 62 34 86 C34 104 42 115 52 115 C64 115 70 104 69 86 C68 68 62 50 61 30Z" fill="url(#suPcC)" stroke="#6E4622" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M55 34 C59 50 65 66 65 86 C65 100 60 109 53 110 C57 94 56 62 51 36Z" fill="url(#suPcPeito)" stroke="#C8BCA8" stroke-width=".9"/>
  {_pintas}
  <path d="M39 66 C47 60 57 66 57 80 C57 94 49 104 41 102 C36 92 35 76 39 66Z" fill="url(#suPcAsa)" stroke="#6E4622" stroke-width="1.4"/>
  <path d="M43 72 q5 6 4 18 M47 70 q5 8 3 22" stroke="#F2D8A8" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <ellipse cx="54" cy="21" rx="15" ry="13" fill="url(#suPcC)" stroke="#6E4622" stroke-width="1.8"/>
  <path d="M67 18 C73 17 80 18 83 21.5 C82 25.5 76 26.5 69 25.6Z" fill="url(#suPcBico)" stroke="#6A6A24" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M69 22 C74 22.4 78 22.4 82 21.8" stroke="#6A6A24" stroke-width=".8" fill="none"/><circle cx="76" cy="19.6" r=".7" fill="#6A6A24"/>
  <ellipse cx="58" cy="18" rx="4.4" ry="4.8" fill="#2A1A10"/><circle cx="59.6" cy="16.2" r="1.6" fill="#fff"/><circle cx="57" cy="20" r=".6" fill="#fff"/>
  <ellipse cx="60" cy="27" rx="3.8" ry="2" fill="#FF9A8A" opacity=".5"/>
  <path d="M44 14 C47 9 53 8 58 9" stroke="#FFF6E2" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M41 56 C42 48 44 42 46 38" stroke="#FFF6E2" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>''')

# ---------- lagartixa-tokay ----------
_manchas = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="url(#suTkM)" stroke="#B8541A" stroke-width=".6"/>' for x, y, r in
                   [(50, 40, 2.6), (60, 48, 2.3), (68, 38, 2.4), (78, 47, 2.3), (86, 39, 2.2), (56, 56, 1.8), (72, 56, 1.9), (42, 50, 2), (92, 50, 1.7), (34, 46, 1.6), (22, 50, 1.5), (14, 58, 1.3)])
def _pe(x, y, a):
    t = ''
    for k in (-56, -28, 0, 28, 56):
        r = math.radians(a + k); x1 = x + math.cos(r) * 7; y1 = y + math.sin(r) * 7
        t += f'<path d="M{x} {y} L{x1:.1f} {y1:.1f}" stroke="#5E7CA8" stroke-width="2.2" stroke-linecap="round"/><circle cx="{x1:.1f}" cy="{y1:.1f}" r="2.3" fill="#C8D8EE" stroke="#3E5A86" stroke-width=".8"/>'
    return t
S.append(f'''<symbol id="f-tokay" viewBox="0 0 140 90">
  <defs>{rg('suTkC', '#CEDCF2', '#8EA8D0', '#5A76A6', .45, .3)}{rg('suTkM', '#FFC07A', '#FF8A3A', '#E0601E', .4, .35)}{rg('suTkO', '#FFF6A0', '#E6D24A', '#B89A1E', .45, .4)}{lg('suTkCasca', '#B08A62', '#6E4E32')}</defs>
  <ellipse cx="72" cy="84" rx="58" ry="4" fill="#0A1440" opacity=".15"/>
  <path d="M0 66 C40 58 90 60 140 54 V80 C90 84 40 84 0 86Z" fill="url(#suTkCasca)" stroke="#4E3420" stroke-width="1.4"/>
  <path d="M8 72 q12 -2 24 0 M50 68 q14 -2 26 0 M92 64 q12 -2 26 -1 M20 80 q10 -1 20 0 M70 78 q12 -1 22 -1" stroke="#4E3420" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M30 42 C18 40 8 44 6 54 C4 62 10 68 18 64 C14 60 14 54 20 52 C24 51 28 52 32 54Z" fill="url(#suTkC)" stroke="#3E5A86" stroke-width="1.6" stroke-linejoin="round"/>
  <g stroke="#6E8CB8" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M14 46 l2 5 M8 56 l5 1"/></g>
  <g stroke="#3E5A86" stroke-width="8" stroke-linecap="round" fill="none"><path d="M44 38 Q40 30 32 26 M44 58 Q40 66 32 70 M88 38 Q94 30 102 26 M88 58 Q94 66 102 70"/></g>
  <g stroke="#9AB2D8" stroke-width="5.4" stroke-linecap="round" fill="none"><path d="M44 38 Q40 30 32 26 M44 58 Q40 66 32 70 M88 38 Q94 30 102 26 M88 58 Q94 66 102 70"/></g>
  {_pe(31, 25, -150)}{_pe(31, 71, 150)}{_pe(103, 25, -30)}{_pe(103, 71, 30)}
  <path d="M28 44 C38 32 62 30 80 32 C94 34 104 38 106 48 C104 58 94 62 80 64 C62 66 38 64 28 54Z" fill="url(#suTkC)" stroke="#3E5A86" stroke-width="1.8"/>
  {_manchas}
  <path d="M38 38 C54 32 74 32 90 36" stroke="#EEF4FF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M98 36 C104 26 124 26 132 34 C138 40 138 54 130 59 C120 64 104 62 98 54 C95 48 95 42 98 36Z" fill="url(#suTkC)" stroke="#3E5A86" stroke-width="1.8"/>
  <path d="M110 57 C118 59 126 58 133 52" stroke="#3E5A86" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="121" cy="40" r="8" fill="url(#suTkO)" stroke="#3E5A86" stroke-width="1.4"/>
  <ellipse cx="121.4" cy="40.4" rx="1.8" ry="5.8" fill="#1A1A22"/><circle cx="124" cy="37" r="2" fill="#fff"/><circle cx="119.4" cy="43.6" r=".7" fill="#fff"/>
  <circle cx="106" cy="44" r="2.2" fill="url(#suTkM)"/><circle cx="108" cy="54" r="1.6" fill="url(#suTkM)"/>
  <ellipse cx="127" cy="52" rx="3.2" ry="1.7" fill="#FF9AAE" opacity=".55"/>
  <circle cx="135" cy="45" r=".9" fill="#2A3A5A"/>
  <path d="M102 34 C108 29 116 28 122 29" stroke="#EEF4FF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
</symbol>''')

# ---------- espiga de arroz ----------
def _cacho(x0, y0, cx, cy, x1, y1, n, s=1):
    d = f'M{x0} {y0} Q{cx} {cy} {x1} {y1}'
    gr = ''
    for k in range(n + 1):
        t = .18 + .82 * k / n; u = 1 - t
        x = u * u * x0 + 2 * u * t * cx + t * t * x1; y = u * u * y0 + 2 * u * t * cy + t * t * y1
        tx = 2 * u * (cx - x0) + 2 * t * (x1 - cx); ty = 2 * u * (cy - y0) + 2 * t * (y1 - cy)
        a = math.degrees(math.atan2(ty, tx))
        for lado in ((-1, 1) if k < n else (0,)):
            xx = x + lado * 2.2 * s
            gr += f'<ellipse cx="{xx:.1f}" cy="{y:.1f}" rx="{3.1 * s:.1f}" ry="{1.75 * s:.1f}" transform="rotate({a + lado * 38:.0f} {xx:.1f} {y:.1f})" fill="url(#suEgG)" stroke="#9A6A14" stroke-width=".7"/>'
    return f'<path d="{d}" stroke="#A8862A" stroke-width="1.6" fill="none" stroke-linecap="round"/>{gr}'
_folhas = ''.join(f'<path d="M50 112 Q{50 + dx * .4:.1f} {112 - h * .6:.1f} {50 + dx:.1f} {112 - h:.1f} Q{50 + dx * .5 + 3:.1f} {112 - h * .5:.1f} 53 112Z" fill="url(#suEgF)" stroke="#5E7A1E" stroke-width="1.1" stroke-linejoin="round"/>'
                  for dx, h in [(-34, 52), (-22, 70), (-8, 84), (10, 80), (26, 66), (36, 46)])
S.append(f'''<symbol id="f-espigaarroz" viewBox="0 0 100 130">
  <defs>{lg('suEgF', '#C8D86A', '#6E9A2A')}{rg('suEgG', '#FFF0A0', '#F2C23A', '#C8901A', .4, .35)}{lg('suEgA', '#9FDDF8', '#3E9AD6')}</defs>
  <ellipse cx="50" cy="118" rx="44" ry="9" fill="url(#suEgA)" stroke="#2E7AB6" stroke-width="1.3"/>
  <path d="M14 117 q6 -2 12 0 M60 121 q6 -2 12 0 M40 124 q5 -1.6 10 0" stroke="#E6F6FF" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="50" cy="114" rx="14" ry="3" fill="#2E5A7A" opacity=".3"/>
  {_folhas}
  <g stroke-linecap="round" fill="none"><path d="M49 112 C48 90 47 62 46 36 M51 112 C54 90 58 66 62 40 M50 112 C48 92 40 72 32 54" stroke="#9A8A2A" stroke-width="2.2"/></g>
  {_cacho(46, 36, 40, 6, 18, 34, 9)}{_cacho(62, 40, 76, 12, 86, 44, 9)}{_cacho(32, 54, 18, 36, 8, 66, 6, .9)}
  <g transform="translate(80 100)"><ellipse cx="0" cy="1" rx="8" ry="2" fill="#2E7AB6" opacity=".3"/><path d="M-6 -3 C-6 -9 6 -9 6 -3 C6 0 -6 0 -6 -3Z" fill="#7ACB5A" stroke="#2E6A22" stroke-width="1"/><circle cx="-3" cy="-8.4" r="2.6" fill="#fff" stroke="#2E6A22" stroke-width=".8"/><circle cx="3" cy="-8.4" r="2.6" fill="#fff" stroke="#2E6A22" stroke-width=".8"/><circle cx="-2.6" cy="-8.2" r="1.3" fill="#12121A"/><circle cx="3.4" cy="-8.2" r="1.3" fill="#12121A"/><circle cx="-2.2" cy="-8.8" r=".45" fill="#fff"/><circle cx="3.8" cy="-8.8" r=".45" fill="#fff"/><path d="M-2.4 -3.4 q2.4 1.6 4.8 0" stroke="#2E6A22" stroke-width=".8" fill="none"/></g>
</symbol>''')

# ---------- capa ----------
def _terraco(i, y, h, x0):
    xs = list(range(x0, 171, 5)) + [170] if (170 - x0) % 5 else list(range(x0, 171, 5))
    top = lambda x: y + 2.6 * math.sin(x / 26 + i * .9) + (x - 100) * .03
    T = [(x, top(x)) for x in xs]
    B = [(x, top(x) + h) for x in xs]
    pt = lambda P: ' L'.join(f'{x:.1f} {yy:.1f}' for x, yy in P)
    sup = f'M{x0 - 3} {top(x0) + h * .5:.1f} Q{x0 - 2} {top(x0):.1f} {pt(T)} L{pt(B[::-1])} Q{x0 - 3} {top(x0) + h:.1f} {x0 - 3} {top(x0) + h * .5:.1f}Z'
    muro = f'M{pt(B)} L{pt([(x, yy + 2.6) for x, yy in B[::-1]])}Z'
    mudas = ''
    if i in (1, 3, 5):
        for x in range(x0 + 6, 168, 6):
            yy = top(x) + h * .55
            mudas += f'<path d="M{x} {yy:.1f} l-1.4 -3.4 M{x} {yy:.1f} l0 -4 M{x} {yy:.1f} l1.4 -3.4" stroke="#3E9A2A" stroke-width=".9" stroke-linecap="round"/>'
    return (f'<path d="{sup}" fill="url(#cpSuAg)" stroke="#3E7A4A" stroke-width=".6"/>'
            f'<path d="M{pt(T)}" stroke="#FFF4DC" stroke-width=".8" fill="none" opacity=".7" transform="translate(0 2.4)"/>{mudas}'
            f'<path d="{muro}" fill="#5E8A32" stroke="#3E6A22" stroke-width=".5"/>'
            f'<path d="M{pt(T)}" stroke="#4E9A2A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M{pt(T)}" stroke="#B8F07A" stroke-width=".9" fill="none" stroke-linecap="round" transform="translate(0 -.5)"/>')
_terr = ''.join(_terraco(i, y, h, x0) for i, (y, h, x0) in enumerate([(52, 7, 86), (60, 8, 70), (69, 9, 52), (79, 10, 34), (90, 11, 16), (102, 12, 0)]))
def _patinho(x, y, s, cor):
    return f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="1" rx="6" ry="1.4" fill="#1E4A6A" opacity=".3"/><path d="M-3.6 0 C-5 -6 -3 -12 0 -12 C3 -12 4 -6 3 0Z" fill="{cor}" stroke="#6E4622" stroke-width=".8"/><circle cx=".6" cy="-14" r="3" fill="{cor}" stroke="#6E4622" stroke-width=".8"/><path d="M3.2 -14.6 l4 .8 l-4 1.2Z" fill="#D8D25A" stroke="#6A6A24" stroke-width=".4"/><circle cx="1.6" cy="-14.6" r=".7" fill="#12121A"/></g>'
S.append(f'''<symbol id="capa-subak" viewBox="0 0 170 110">
  <defs>{ceu('cpSuC', '#5EB4EC', '#FFEBD0')}{lg('cpSuV', '#A2B4DC', '#8496C4')}<linearGradient id="cpSuAg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE8C8"/><stop offset=".45" stop-color="#BFE8F8"/><stop offset="1" stop-color="#6CBEE6"/></linearGradient>{lg('cpSuM', '#3E8A4A', '#1E5A3A')}{lg('cpSuH', '#8CC44A', '#5E9A32')}</defs>
  <rect width="170" height="110" fill="url(#cpSuC)"/>
  <circle cx="142" cy="20" r="14" fill="#FFF2B0" opacity=".45"/><circle cx="142" cy="20" r="8" fill="#FFD447" stroke="#F0A81E" stroke-width=".8"/>
  <path d="M-6 58 L38 14 C42 10 48 10 52 14 L100 54Z" fill="url(#cpSuV)" stroke="#7486B4" stroke-width=".8" stroke-linejoin="round"/>
  <path d="M38 14 C42 10 48 10 52 14 L56 20 C52 18 49 22 46 19 C43 22 40 18 35 20Z" fill="#E6ECF8" opacity=".85"/>
  <path d="M52 14 L100 54 H70 C66 40 60 24 52 14Z" fill="#6E80B0" opacity=".25"/>
  <path d="M98 22 q6 -4 12 0 q4 -2 7 1 q3 3 -1 4 h-18 q-3 -2 0 -5Z" fill="#fff" opacity=".92"/>
  <path d="M110 46 C126 36 150 38 170 42 V58 H110Z" fill="#7EA86A" opacity=".8"/>
  <path d="M0 44 C14 36 30 38 44 42 C58 36 74 40 92 50 V66 H0Z" fill="url(#cpSuM)"/>
  <g>{''.join(f'<path d="{copa(x, y, rx, ry, 8, .3)}" fill="{c}" stroke="#14402A" stroke-width=".6"/>' for x, y, rx, ry, c in [(6, 44, 10, 7, '#2E8A4A'), (22, 40, 11, 8, '#5EA83A'), (38, 44, 10, 7, '#1E6A44'), (54, 42, 11, 7, '#7AB83E'), (70, 46, 10, 6, '#2E7A5A'), (84, 50, 8, 5, '#4E9A3A')])}</g>
  <path d="M0 58 C30 50 70 50 100 50 L170 46 V110 H0Z" fill="url(#cpSuH)"/>
  {_terr}
  <path d="M74 52 C66 58 58 62 50 70 C44 76 36 82 26 92" stroke="#2E7AD6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M74 52 C66 58 58 62 50 70 C44 76 36 82 26 92" stroke="#CFF2FF" stroke-width=".9" fill="none" stroke-dasharray="3 3" stroke-linecap="round"/>
  {_patinho(100, 98, 1, '#F2DDB0')}{_patinho(110, 100, .95, '#E8C48A')}{_patinho(119, 97, .9, '#F2DDB0')}{_patinho(128, 99, .85, '#E8C48A')}
  <g transform="translate(150 74)"><path d="M-4 0 L-5 -10 C-5 -13 5 -13 5 -10 L4 0Z" fill="#2E7BB6" stroke="#12235A" stroke-width=".7"/><circle cx="0" cy="-15" r="3.2" fill="#9A6A42" stroke="#4E2E14" stroke-width=".7"/><path d="M-9 -15.6 L0 -22 L9 -15.6 Q0 -14 -9 -15.6Z" fill="#E8C878" stroke="#8A6A2A" stroke-width=".8" stroke-linejoin="round"/></g>
  <g transform="translate(163 108)"><path d="M0 0 C-2 -22 2 -44 -6 -66" stroke="#5E3E22" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M0 0 C-2 -22 2 -44 -6 -66" stroke="#A8784A" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M-6 -66 c-12 -2 -20 4 -24 12 c8 -6 16 -8 24 -12Z M-6 -66 c2 -12 12 -16 22 -14 c-8 4 -16 8 -22 14Z M-6 -66 c-12 -8 -22 -6 -26 -2 c10 0 18 0 26 2Z M-6 -66 c10 0 18 8 20 16 c-6 -6 -14 -10 -20 -16Z" fill="#4EA83A" stroke="#2E6A22" stroke-width=".9" stroke-linejoin="round"/></g>
  <svg x="2" y="64" width="50" height="46" viewBox="0 0 120 110"><use href="#f-estorninho"/></svg>
</symbol>''')
