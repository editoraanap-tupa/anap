# figurinhas e capa do Rio Nilo (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(97)

# ---------- martim-pescador-malhado (Nuri) ----------
def _pintas(pts, r=1.5, cor='#FFFFFF'):
    return ''.join(f'<ellipse cx="{x}" cy="{y}" rx="{r * 1.4:.1f}" ry="{r:.1f}" fill="{cor}"/>' for x, y in pts)
S.append(f'''<symbol id="f-martim" viewBox="0 0 120 100">
  <defs>{rg('niMBr', '#FFFFFF', '#F2F4F8', '#C9D0DE', .45, .35)}{lg('niMPr', '#3A3D4C', '#0E0F16')}{lg('niMHaste', '#9AD06A', '#4E8A32')}{lg('niMBico', '#3A3A46', '#0C0C12')}</defs>
  <ellipse cx="62" cy="95" rx="34" ry="3.4" fill="#0A1440" opacity=".16"/>
  <path d="M8 94 C34 86 66 80 112 74" stroke="#2E5A1E" stroke-width="6.4" fill="none" stroke-linecap="round"/>
  <path d="M8 94 C34 86 66 80 112 74" stroke="url(#niMHaste)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M14 90 C36 84 64 78 104 73" stroke="#D8F4B0" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M47 66 L27 93 C30 96 35 97 39 96 L56 72Z" fill="url(#niMPr)" stroke="#0A0A10" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M38 80 l5 3 M33 86 l5 3 M44 74 l5 3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <path d="M42 46 C40 64 50 81 64 81 C77 81 83 66 81 52 C79 40 67 34 57 36 C49 37 43 40 42 46Z" fill="url(#niMBr)" stroke="#2A2E3A" stroke-width="1.8"/>
  <path d="M57 51 C64 56 73 56 81 50" stroke="#14151C" stroke-width="4.2" fill="none" stroke-linecap="round"/>
  <path d="M60 60 C66 64 74 64 80 59" stroke="#14151C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M39 43 C33 57 37 73 51 81 C58 73 61 58 59 46 C55 39 46 37 39 43Z" fill="url(#niMPr)" stroke="#0A0A10" stroke-width="1.6" stroke-linejoin="round"/>
  {_pintas([(44, 48), (51, 47), (42, 56), (49, 55), (56, 54), (44, 64), (51, 63), (47, 72), (54, 70)], 1.6)}
  <path d="M42 46 C45 42 50 41 54 42" stroke="#6A6E86" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M68 70 C72 72 76 70 78 66" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M60 79 l-1 5 M66 79 l1 5" stroke="#3A2A22" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="70" cy="29" r="17" fill="url(#niMBr)" stroke="#2A2E3A" stroke-width="1.8"/>
  <path d="M53 31 C51 17 61 9 73 10 C82 10 88 17 87 25 C80 21 73 21 67 25 C63 29 59 33 53 31Z" fill="url(#niMPr)" stroke="#0A0A10" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M56 20 L44 14 L55 17 L47 7 L59 13 L57 3 L66 11 L67 6 L71 11Z" fill="url(#niMPr)" stroke="#0A0A10" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M64 13 C68 11 74 11 78 13" stroke="#6A6E86" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M86 30 C79 32 71 35 58 37 L56 33 C67 31 77 27 86 26Z" fill="#14151C"/>
  <circle cx="75" cy="28" r="6.4" fill="#FFFFFF" stroke="#14151C" stroke-width="1"/>
  <circle cx="75.6" cy="28.4" r="4.6" fill="#1A1410"/><circle cx="77.2" cy="26.6" r="1.7" fill="#FFFFFF"/><circle cx="74" cy="30.4" r=".7" fill="#FFFFFF"/>
  <path d="M84 24.5 L117 34 L84 33Z" fill="url(#niMBico)" stroke="#0A0A10" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M87 27 L108 32" stroke="#6A6E86" stroke-width="1.1" stroke-linecap="round"/>
  <ellipse cx="78" cy="39" rx="4.2" ry="2.4" fill="#FF9AA8" opacity=".55"/>
  <path d="M60 22 q4 -6 10 -7" stroke="#8A8EA8" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# ---------- papiro ----------
def _umbela(cx, cy, r, n=26):
    s = ''; pontas = ''
    for i in range(n):
        a = math.pi * (.92 + 1.16 * i / (n - 1)) + R(-.04, .04)
        rr = r * R(.85, 1.05)
        ex, ey = cx + math.cos(a) * rr, cy + math.sin(a) * rr * .78
        qx, qy = cx + math.cos(a) * rr * .55, cy + math.sin(a) * rr * .55 - r * .22
        tx, ty = ex + math.cos(a) * 3.2, ey + 2.6
        s += f'M{cx} {cy} Q{qx:.1f} {qy:.1f} {ex:.1f} {ey:.1f} '
        pontas += f'M{ex:.1f} {ey:.1f} q{math.cos(a) * 2:.1f} {-1:.1f} {tx - ex:.1f} {ty - ey:.1f} '
    return s, pontas
pap = ''
for cx, cy, r, bx in [(22, 40, 15, 42), (80, 36, 16, 56), (52, 20, 19, 48), (36, 64, 12, 44), (70, 62, 12, 54)]:
    dU, pt = _umbela(cx, cy, r)
    pap += f'<path d="M{bx} 112 C{bx + (cx - bx) * .3:.1f} 80 {cx:.1f} {cy + 30:.1f} {cx} {cy}" stroke="#2E6A22" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M{bx} 112 C{bx + (cx - bx) * .3:.1f} 80 {cx:.1f} {cy + 30:.1f} {cx} {cy}" stroke="url(#niPHaste)" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    pap += f'<ellipse cx="{cx}" cy="{cy - r * .25:.1f}" rx="{r * .95:.1f}" ry="{r * .55:.1f}" fill="#C8EC8A" opacity=".35"/>'
    pap += f'<path d="{dU}" stroke="#3E7A22" stroke-width="1.9" fill="none" stroke-linecap="round"/><path d="{dU}" stroke="#B8E67A" stroke-width=".9" fill="none" stroke-linecap="round"/>'
    pap += f'<path d="{pt}" stroke="#6A9A2A" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
    pap += f'<path d="M{cx - 3} {cy + 2} L{cx} {cy - 3} L{cx + 3} {cy + 2}Z" fill="#7A9A3A" stroke="#3E5A1A" stroke-width=".8"/>'
S.append(f'''<symbol id="f-papiro" viewBox="0 0 100 130">
  <defs>{lg('niPHaste', '#B8E07A', '#5E9A3A')}{lg('niPAgua', '#7FCBE0', '#2E7FA8')}{lg('niPLama', '#5A4232', '#2A1E16')}</defs>
  <ellipse cx="50" cy="118" rx="46" ry="9" fill="url(#niPAgua)" stroke="#1E5A7A" stroke-width="1.4"/>
  {ondas(10, 90, 121, '#E6F6FF', 1.2, .8)}
  <path d="M30 116 C30 108 70 108 70 116 C64 119 36 119 30 116Z" fill="url(#niPLama)"/>
  {pap}
  <g fill="#4E8A2A" stroke="#2E5A1A" stroke-width="1"><path d="M34 114 C30 104 32 98 36 94 C38 102 40 108 40 114Z"/><path d="M64 114 C68 104 66 98 62 94 C60 102 58 108 58 114Z"/><path d="M46 114 C44 106 46 100 50 96 C52 104 52 110 52 114Z"/></g>
  <path d="M38 110 C37 104 38 100 40 98" stroke="#C8F09A" stroke-width="1" fill="none"/>
  <g stroke="#E6F6FF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"><path d="M14 116 q5 -2 10 0 M78 116 q5 -2 10 0"/></g>
</symbol>''')

# ---------- shaduf ----------
tij = ''.join(f'<path d="M{x0} {y} h{w}" stroke="#8A5A32" stroke-width=".9" opacity=".6"/>' for x0, w, y in [(30, 14, 70), (30, 14, 78), (30, 14, 86), (30, 14, 94), (58, 14, 72), (58, 14, 80), (58, 14, 88), (58, 14, 96)])
S.append(f'''<symbol id="f-shaduf" viewBox="0 0 130 120">
  <defs>{lg('niSBarro', '#E2A86A', '#A8683A')}{lg('niSVara', '#D9A060', '#8A5A2A')}{lg('niSAgua', '#7FCBE0', '#2E7FA8')}{rg('niSPeso', '#8A7A6A', '#5A4A3E', '#3A2E26', .4, .3)}{lg('niSLama', '#4A3A2E', '#241A14')}{lg('niSBal', '#C9784A', '#7A3E1E')}</defs>
  <ellipse cx="62" cy="114" rx="56" ry="4" fill="#2A1A0A" opacity=".18"/>
  <path d="M2 100 C30 96 60 96 84 98 L84 114 H2Z" fill="url(#niSLama)"/>
  <path d="M6 100 C30 97 58 97 82 99" stroke="#6A5444" stroke-width="1.2" fill="none"/>
  <path d="M84 96 C100 94 116 96 128 98 V114 H84Z" fill="url(#niSAgua)" stroke="#1E5A7A" stroke-width="1.2"/>
  {ondas(88, 126, 104, '#E6F6FF', 1.1, .8)}
  <path d="M10 104 H70" stroke="#5FB6E0" stroke-width="3" stroke-linecap="round"/><path d="M14 103 H66" stroke="#BFEAFF" stroke-width="1" stroke-linecap="round"/>
  <path d="M28 100 V66 C28 62 46 62 46 66 V100Z" fill="url(#niSBarro)" stroke="#6E3E1E" stroke-width="1.6"/>
  <path d="M56 100 V68 C56 64 74 64 74 68 V100Z" fill="url(#niSBarro)" stroke="#6E3E1E" stroke-width="1.6"/>
  {tij}
  <path d="M31 70 V96" stroke="#F4CC98" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
  <path d="M24 62 H78" stroke="#5A3418" stroke-width="5.4" stroke-linecap="round"/><path d="M24 62 H78" stroke="url(#niSVara)" stroke-width="3" stroke-linecap="round"/>
  <path d="M8 76 L118 30" stroke="#5A3418" stroke-width="6" stroke-linecap="round"/><path d="M8 76 L118 30" stroke="url(#niSVara)" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M30 66 L100 37" stroke="#F4D4A0" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>
  <circle cx="51" cy="58" r="3" fill="#7A4A22" stroke="#3E2210" stroke-width="1"/>
  <path d="M2 80 C0 70 8 64 16 66 C24 68 26 78 20 84 C14 90 4 88 2 80Z" fill="url(#niSPeso)" stroke="#2A2018" stroke-width="1.6"/>
  <path d="M6 74 q4 -5 10 -5" stroke="#B8A898" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M117 31 V78" stroke="#8A6A3E" stroke-width="1.4"/>
  <path d="M109 78 H125 L122 92 C119 95 115 95 112 92Z" fill="url(#niSBal)" stroke="#5A2A10" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M109 78 C112 75 122 75 125 78" fill="#3E9AD0" stroke="#5A2A10" stroke-width="1.2"/>
  <path d="M112 82 V90" stroke="#F0A878" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
  <path d="M110 92 q-2 5 -1 9 M124 90 q2 5 1 8" stroke="#7FCBF0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
</symbol>''')

# ---------- faluca ----------
S.append(f'''<symbol id="f-faluca" viewBox="0 0 130 130">
  <defs>{lg('niFVela', '#FFFFFF', '#E8DCC2', 1, 1)}{lg('niFCasco', '#F4F6FA', '#B8C4D6')}{lg('niFAgua', '#7FCBE0', '#2E7FA8')}{lg('niFMastro', '#D9A060', '#7A4A22')}</defs>
  <ellipse cx="66" cy="114" rx="60" ry="12" fill="url(#niFAgua)" stroke="#1E5A7A" stroke-width="1.4"/>
  <path d="M30 112 C50 116 84 116 104 110" stroke="#1E5A7A" stroke-width="2" fill="none" opacity=".4"/>
  <path d="M52 100 L53.6 56" stroke="#4E2E14" stroke-width="4.4" stroke-linecap="round"/><path d="M52 100 L53.6 56" stroke="url(#niFMastro)" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M14 96 L96 4" stroke="#4E2E14" stroke-width="3.8" stroke-linecap="round"/><path d="M14 96 L96 4" stroke="url(#niFMastro)" stroke-width="2" stroke-linecap="round"/>
  <path d="M17 93 L94 7 C104 36 110 64 108 96 C80 99 46 98 17 93Z" fill="url(#niFVela)" stroke="#8A7A5A" stroke-width="1.8" stroke-linejoin="round"/>
  <g stroke="#CDBE9A" stroke-width="1" fill="none"><path d="M36 72 C60 74 84 76 106 78"/><path d="M54 50 C70 54 88 58 104 60"/><path d="M72 30 C82 34 92 38 100 42"/><path d="M58 94 L84 20"/><path d="M80 96 L94 40"/></g>
  <path d="M90 14 C98 38 102 62 102 86" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M96 4 l14 -3 l-4 5 l5 3 l-15 0Z" fill="#E5392C" stroke="#8A1E14" stroke-width="1" stroke-linejoin="round"/>
  <path d="M10 98 C20 100 100 100 122 96 C118 108 104 114 86 114 H40 C24 114 14 108 10 98Z" fill="url(#niFCasco)" stroke="#3A4A6A" stroke-width="2" stroke-linejoin="round"/>
  <path d="M14 102 C40 106 96 106 118 101" stroke="#2E7BF6" stroke-width="3" fill="none"/>
  <path d="M18 107 C44 110 92 110 112 106" stroke="#FFC83D" stroke-width="2" fill="none"/>
  <g fill="#E5392C">{''.join(f'<circle cx="{x}" cy="{110.5 - abs(x - 64) * .02:.1f}" r="1.3"/>' for x in range(30, 104, 9))}</g>
  <path d="M8 97 C20 99 100 99 124 95" stroke="#7A4A22" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M10 96 C24 98 98 98 122 94" stroke="#E0A868" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <g stroke="#E6F6FF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"><path d="M4 116 q6 -3 12 0 M110 118 q6 -3 12 0 M50 124 q6 -3 12 0"/></g>
</symbol>''')

# ---------- capa ----------
palm = lambda x, y, s: (f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 C1 -10 -1 -20 2 -30" stroke="#6E4A2A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    '<path d="M2 -30 c-6 -3 -12 -1 -15 4 c6 -2 10 -2 15 -4Z M2 -30 c3 -6 10 -8 15 -5 c-6 1 -10 2 -15 5Z M2 -30 c-7 -6 -4 -12 1 -14 c-1 4 -1 8 -1 14Z M2 -30 c6 -1 12 3 13 8 c-5 -4 -9 -6 -13 -8Z M2 -30 c-5 1 -10 6 -10 10 c3 -5 6 -7 10 -10Z" fill="#3E9A3A" stroke="#1E5A1E" stroke-width=".7" stroke-linejoin="round"/>'
    '<circle cx="1" cy="-28" r="1.6" fill="#C8642A"/><circle cx="3.4" cy="-27.4" r="1.6" fill="#A84A1E"/></g>')
S.append(f'''<symbol id="capa-nilo" viewBox="0 0 170 110">
  <defs>{ceu('cpNiC', '#6AB6EA', '#FBE6C4')}{lg('cpNiD', '#F2CC88', '#D49A52')}{lg('cpNiR', '#5FB8D8', '#1E7AA8')}{lg('cpNiF', '#4E3C30', '#2A1E16')}{lg('cpNiV', '#8CD05A', '#4E9A3A')}{lg('cpNiM', '#7AA0B0', '#4E7A84')}</defs>
  <rect width="170" height="110" fill="url(#cpNiC)"/>
  <circle cx="146" cy="18" r="15" fill="#FFE8A8" opacity=".4"/><circle cx="146" cy="18" r="8.5" fill="#FFE27A" stroke="#F0A81E" stroke-width=".9"/>
  <path d="M0 44 C10 32 22 30 34 36 C44 28 56 30 62 40 L62 50 H0Z" fill="url(#cpNiM)" opacity=".85"/>
  <g transform="translate(10 8)"><use href="#nuvem" width="40" height="20" style="color:#AEB8CA"/></g>
  <path d="M0 50 C30 44 60 46 90 44 C110 40 140 38 170 42 V60 H0Z" fill="url(#cpNiD)"/>
  <path d="M100 46 L108 36 H130 L136 30 H160 L170 34 V50 H100Z" fill="#E8B488" stroke="#A8683A" stroke-width=".7"/>
  <path d="M108 36 V48 M130 36 V48 M136 30 V48" stroke="#C8885A" stroke-width=".7"/>
  <path d="M0 64 C30 58 50 54 70 52 C90 52 120 54 170 60 V110 H0Z" fill="url(#cpNiV)"/>
  <path d="M0 84 C20 80 40 78 58 80 L50 110 H0Z" fill="url(#cpNiF)"/>
  <path d="M0 84 C20 80 40 78 58 80" stroke="#D8B47E" stroke-width="1.6" fill="none"/>
  <g stroke="#7FD04A" stroke-width="1.2" stroke-linecap="round">{''.join(f'<path d="M{x + y * .1:.1f} {y} l-1 -3 M{x + y * .1:.1f} {y} l1.4 -3.4"/>' for y in (88, 96, 104) for x in range(6, 46, 7))}</g>
  <path d="M0 78 C20 74 40 72 60 73" stroke="#3E9AD0" stroke-width="1.6" fill="none"/>
  <path d="M58 52 C70 52 76 56 76 64 C76 78 80 92 92 110 H136 C116 92 104 78 100 66 C96 58 84 52 70 52Z" fill="url(#cpNiR)" stroke="#1E5A7A" stroke-width=".8"/>
  <path d="M80 72 h8 M90 88 h12 M104 100 h10 M82 62 h6" stroke="#E6F6FF" stroke-width="1" stroke-linecap="round"/>
  {palm(14, 64, .8)}{palm(26, 66, 1)}{palm(150, 66, .9)}{palm(162, 62, .7)}
  <g transform="translate(76 46)"><svg width="30" height="30" viewBox="0 0 130 130"><use class="sem" href="#f-faluca"/></svg></g>
  <svg x="34" y="62" width="34" height="32" viewBox="0 0 130 120"><use class="sem" href="#f-shaduf"/></svg>
  <path d="M148 110 V92" stroke="#7A5434" stroke-width="3" stroke-linecap="round"/>
  <svg x="128" y="66" width="38" height="32" viewBox="0 0 120 100"><use class="sem" href="#f-martim"/></svg>
  {capim(110, 170, 110, 16, '#3E8A2A', (4, 9), 1)}
</symbol>''')
