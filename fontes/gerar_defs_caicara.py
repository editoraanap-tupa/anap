# figurinhas e capa dos Caiçaras (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(311)

# ---------- toninha (Nina) ----------
S.append(f'''<symbol id="f-toninha" viewBox="0 0 150 100">
  <defs>{lg('ccnCorpo', '#C2AE98', '#86705C')}{lg('ccnBarriga', '#FFF6EC', '#E6D6C6')}{lg('ccnAgua', '#7FD4F2', '#2A86C0')}{rg('ccnCab', '#D2C6B8', '#A69486', '#7A6A5E', .45, .3)}</defs>
  <ellipse cx="76" cy="90" rx="70" ry="9" fill="url(#ccnAgua)" stroke="#1E6A9E" stroke-width="1.4"/>
  {ondas(10, 140, 90, '#E6F6FF', 1.3, .8)}
  <path d="M20 88 C16 80 20 74 26 72 M128 88 C132 80 128 74 122 74" stroke="#BFE8FF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="14" cy="76" r="2.6" fill="#D8F2FF"/><circle cx="136" cy="70" r="2" fill="#D8F2FF"/><circle cx="142" cy="78" r="1.4" fill="#D8F2FF"/>
  <path d="M26 64 C18 58 10 54 4 54 C7 59 12 63 16 66 C11 70 7 76 6 82 C13 78 20 72 27 68Z" fill="url(#ccnCorpo)" stroke="#4E4036" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M58 41 C62 34 66 29 71 28 C74 28 75 31 75 34 C76 37 79 39 82 40Z" fill="url(#ccnCorpo)" stroke="#4E4036" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M65 35 C67 32 69 30 71 30" stroke="#D8CCC0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M24 66 C36 50 56 40 80 38 C96 36 106 36 112 40 C118 36 124 38 126 44 C134 46 142 48 147 51 C143 55 134 56 124 56 C116 64 100 70 82 71 C60 72 40 72 24 66Z" fill="url(#ccnCorpo)" stroke="#4E4036" stroke-width="2" stroke-linejoin="round"/>
  <path d="M40 66 C58 68 84 68 104 62 C114 59 120 57 124 56 C116 64 100 70 82 71 C64 72 48 70 40 66Z" fill="url(#ccnBarriga)"/>
  <path d="M104 40 C112 34 122 36 126 44 C122 50 112 50 106 46Z" fill="url(#ccnCab)"/>
  <path d="M124 52 C132 52 140 52 146 51.4" stroke="#4E4036" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M110 53 C116 57 123 56 128 53" stroke="#4E4036" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M108 51.6 q1 1.6 2.6 1.6" stroke="#4E4036" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M90 62 C94 72 92 80 84 86 C82 78 82 70 84 63Z" fill="url(#ccnCorpo)" stroke="#4E4036" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M42 54 C60 44 84 40 104 40" stroke="#E6DCD2" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M110 39 C114 37 118 37 121 39" stroke="#F0E8E0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="112" cy="46" rx="4" ry="4.4" fill="#1E1410"/><circle cx="113.4" cy="44.6" r="1.5" fill="#fff"/><circle cx="111" cy="47.8" r=".6" fill="#fff"/>
  <path d="M107 41 q4 -3 9 -1" stroke="#4E4036" stroke-width="1" fill="none" stroke-linecap="round"/>
  <ellipse cx="116" cy="53" rx="4" ry="2" fill="#FF9AAA" opacity=".6"/>
</symbol>''')

# ---------- atobá-pardo ----------
S.append(f'''<symbol id="f-atobapardo" viewBox="0 0 100 120">
  <defs>{lg('ccaPena', '#7A5A44', '#3E2A1E')}{lg('ccaBarriga', '#FFFFFF', '#E4E0DA')}{lg('ccaBico', '#FFF0A0', '#E8C040')}{lg('ccaPedra', '#8E8A84', '#4E4A48')}{lg('ccaMar', '#7FD0F0', '#2A86C0')}</defs>
  <ellipse cx="50" cy="114" rx="44" ry="5" fill="url(#ccaMar)" opacity=".9"/>
  {ondas(8, 92, 114, '#E6F6FF', 1.1, .8)}
  <path d="M10 114 C12 100 24 94 42 94 C62 93 82 98 90 114Z" fill="url(#ccaPedra)" stroke="#33302E" stroke-width="1.6"/>
  <path d="M20 104 C30 98 44 97 56 98" stroke="#B8B4AE" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <g fill="#F4F2EE" opacity=".8"><circle cx="70" cy="101" r="1.6"/><circle cx="76" cy="104" r="1.2"/><circle cx="30" cy="106" r="1.4"/></g>
  <path d="M62 82 C70 92 76 100 80 108 C72 104 64 96 58 88Z" fill="url(#ccaPena)" stroke="#2A1C14" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M44 92 L40 98 M44 92 L44 99 M44 92 L48 98 M58 92 L54 99 M58 92 L58 100 M58 92 L62 99" stroke="#C89A1E" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M36 98 C40 95 48 95 50 98Z M52 99 C56 96 64 96 66 99Z" fill="#F2C83A" stroke="#A8780E" stroke-width="1"/>
  <path d="M34 54 C30 66 32 82 42 90 C50 96 62 94 66 84 C70 72 68 58 62 50Z" fill="url(#ccaBarriga)" stroke="#8A847C" stroke-width="1.6"/>
  <path d="M38 64 C38 74 42 82 48 86" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M34 56 C36 48 44 42 54 44 C64 46 68 54 66 62 C60 56 48 54 34 56Z" fill="url(#ccaPena)" stroke="#2A1C14" stroke-width="1.6"/>
  <path d="M60 48 C72 52 76 66 74 80 C72 88 68 92 64 92 C62 78 60 62 58 52Z" fill="url(#ccaPena)" stroke="#2A1C14" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M64 56 C68 64 70 74 68 84 M66 54 C72 62 73 70 72 78" stroke="#9A7A62" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M42 50 C40 40 40 30 46 24" stroke="#2A1C14" stroke-width="15" fill="none" stroke-linecap="round"/>
  <path d="M42 50 C40 40 40 30 46 24" stroke="url(#ccaPena)" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="48" cy="22" rx="13" ry="11.4" fill="url(#ccaPena)" stroke="#2A1C14" stroke-width="1.8"/>
  <path d="M40 15 C44 11 50 11 54 13" stroke="#A88A70" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M38 22 C30 24 18 28 8 32 C18 32 30 31 39 28Z" fill="url(#ccaBico)" stroke="#9A7A10" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M10 31.6 C20 29.6 30 27.6 38 26" stroke="#9A7A10" stroke-width=".9" fill="none"/>
  <path d="M36 18 C40 16 44 18 46 22 C42 25 38 24 36 22Z" fill="#F4E08A" opacity=".85"/>
  <circle cx="42" cy="20.4" r="3.4" fill="#FFF4C8" stroke="#2A1C14" stroke-width=".8"/><circle cx="41.6" cy="20.6" r="2.1" fill="#12100E"/><circle cx="42.4" cy="19.6" r=".9" fill="#fff"/>
  <ellipse cx="46" cy="27" rx="3" ry="1.5" fill="#FF9AAA" opacity=".55"/>
</symbol>''')

# ---------- guapuruvu ----------
def _folha_guapu(x, y, a, L, cor='#5EA83E'):
    ca, sa = math.cos(a), math.sin(a)
    P = lambda u, v: (x + ca * u - sa * v, y + sa * u + ca * v)
    s = f'<path d="M{x:.1f} {y:.1f} L{P(L, 0)[0]:.1f} {P(L, 0)[1]:.1f}" stroke="#3E6A22" stroke-width="1"/>'
    for i in range(1, 9):
        u = L * i / 9
        for lado in (-1, 1):
            p0 = P(u, 0); p1 = P(u + 2.2, lado * 5.4 * (1 - i / 13))
            s += f'<ellipse cx="{(p0[0] + p1[0]) / 2:.1f}" cy="{(p0[1] + p1[1]) / 2:.1f}" rx="{3.2 * (1 - i / 14):.1f}" ry="1.4" transform="rotate({math.degrees(math.atan2(p1[1] - p0[1], p1[0] - p0[0])):.0f} {(p0[0] + p1[0]) / 2:.1f} {(p0[1] + p1[1]) / 2:.1f})" fill="{cor}" stroke="#2E5A1E" stroke-width=".4"/>'
    return s
def _cacho(x, y, h):
    s = ''
    n = int(h * .9)
    for i in range(n):
        a = R(0, 6.28); r = math.sqrt(R(0, 1)) * h * .45
        cx = x + math.cos(a) * r; cy = y - h * .45 + math.sin(a) * r * .8
        s += f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({R(0, 72):.0f})">' + ''.join(f'<ellipse cx="0" cy="-1.3" rx="1" ry="1.5" transform="rotate({k * 72})" fill="{random.choice(["#FFD43A", "#FFE066", "#FFC21E"])}" stroke="#C89010" stroke-width=".3"/>' for k in range(5)) + '<circle r=".6" fill="#E08A10"/></g>'
    return s
gp_folhas = ''.join(_folha_guapu(x, y, a, L) for x, y, a, L in [(55, 42, -2.6, 30), (55, 40, -.5, 30), (40, 36, -2.9, 22), (70, 34, -.2, 24), (54, 30, -1.6, 20), (30, 44, 2.9, 18), (80, 44, .3, 18)])
gp_cachos = ''.join(_cacho(x, y, h) for x, y, h in [(24, 40, 14), (38, 32, 16), (54, 28, 17), (70, 30, 16), (86, 38, 14), (46, 44, 12), (64, 44, 12), (16, 50, 10), (94, 50, 10)])
S.append(f'''<symbol id="f-guapuruvu" viewBox="0 0 110 130">
  <defs>{lg('ccgTronco', '#D8D2C6', '#8E887C', 1, 0)}{lg('ccgChao', '#8ACB5A', '#3E7A2A')}{rg('ccgCopa', '#9AD86A', '#5EA83E', '#2E6A2A', .45, .35)}</defs>
  <ellipse cx="55" cy="125" rx="40" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M12 126 C18 116 36 112 55 112 C76 112 92 116 98 126Z" fill="url(#ccgChao)" stroke="#2E5A1E" stroke-width="1.4"/>
  {capim(16, 94, 118, 22, '#2E6A22', (3, 7), 1.1)}
  <path d="M50 120 C52 100 52 80 53 52 L57 52 C58 80 58 100 62 120Z" fill="url(#ccgTronco)" stroke="#5E584E" stroke-width="1.5"/>
  <path d="M46 121 C48 117 50 116 51 112 M66 121 C64 117 61 116 60 112" stroke="#5E584E" stroke-width="1.3" fill="none"/>
  <g stroke="#7A746A" stroke-width=".9" fill="none" opacity=".8">{''.join(f'<path d="M{51.6 + (120 - y) * .02:.1f} {y} q3.4 1.6 6.6 0"/>' for y in range(60, 118, 8))}</g>
  <path d="M53 110 C53.6 90 54 72 54.6 56" stroke="#F4F0E6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M54 60 C46 52 36 46 26 44 M56 58 C64 50 74 44 86 42 M55 56 C54 46 52 38 48 30 M56 56 C60 46 64 38 68 32" stroke="#6E685E" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="{copa(55, 38, 44, 15, 16, .2)}" fill="url(#ccgCopa)" stroke="#2E5A1E" stroke-width="1.3" opacity=".95"/>
  {gp_folhas}
  {gp_cachos}
  <path d="M22 30 C34 22 50 18 66 19" stroke="#E8FFC8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>
</symbol>''')

# ---------- canoa caiçara ----------
S.append(f'''<symbol id="f-canoacaicara" viewBox="0 0 160 90">
  <defs>{lg('cccCasco', '#B0703E', '#5E3418')}{lg('cccDentro', '#D8A46A', '#9A6236')}{lg('cccAreia', '#F6E2B0', '#D8B678')}{lg('cccMar', '#7FD0F0', '#2A86C0', 1, 0)}{lg('cccRemo', '#E8C08A', '#A8763E')}</defs>
  <path d="M0 76 C8 70 20 68 30 70 C20 74 10 80 0 84Z" fill="url(#cccMar)" opacity=".9"/>
  <path d="M0 74 C8 69 18 67 30 70" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M0 86 C30 76 70 72 110 74 C134 75 150 78 160 82 V90 H0Z" fill="url(#cccAreia)" stroke="#B8965A" stroke-width="1.2"/>
  <g stroke="#D8BC80" stroke-width="1.2" fill="none" opacity=".8"><path d="M40 84 q6 -3 12 0 M96 82 q5 -2 10 0 M128 85 q4 -2 8 0"/></g>
  <ellipse cx="82" cy="73" rx="70" ry="5" fill="#5E4420" opacity=".25"/>
  <path d="M8 46 C22 50 36 52 52 52 H112 C128 52 142 48 154 40 C150 56 138 70 112 72 H52 C30 72 14 62 8 46Z" fill="url(#cccCasco)" stroke="#3A1E0C" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 48 C30 46 60 44 90 44 C116 44 136 44 150 42 C138 52 120 54 100 54 H54 C36 54 22 52 12 48Z" fill="url(#cccDentro)" stroke="#5E3418" stroke-width="1.2"/>
  <path d="M44 46 V54 M104 45 V54" stroke="#7A4A22" stroke-width="3" stroke-linecap="round"/>
  <path d="M10 51 C30 56 60 57 100 57 C126 57 142 52 152 45" stroke="#2E7BF6" stroke-width="3.4" fill="none"/>
  <path d="M10 54 C30 59 60 60 100 60 C126 60 142 55 151 48" stroke="#FFFFFF" stroke-width="1.4" fill="none"/>
  <path d="M11 56.4 C30 62 60 63 100 63 C126 63 141 58 150 51" stroke="#E5392C" stroke-width="1.6" fill="none"/>
  <g stroke="#7A4A22" stroke-width=".9" fill="none" opacity=".6"><path d="M20 64 C40 68 80 69 120 67 M30 68 C60 71 100 71 126 68"/></g>
  <path d="M16 50 C34 48 60 47 90 47" stroke="#FFE2B8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M56 40 L124 50" stroke="#5E3418" stroke-width="4.4" stroke-linecap="round"/><path d="M56 40 L124 50" stroke="url(#cccRemo)" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M120 46 C130 44 142 48 146 54 C138 56 128 56 120 53Z" fill="url(#cccRemo)" stroke="#5E3418" stroke-width="1.3"/>
  <path d="M52 37 h8 v5 h-8Z" fill="#8A5A2A" stroke="#4E2E10" stroke-width=".8"/>
  <g transform="translate(70 40)"><path d="M-10 4 C-10 -4 10 -4 10 4 L8 12 H-8Z" fill="#D8A84E" stroke="#7A5418" stroke-width="1.1"/><path d="M-9 6 H9 M-8.6 9 H8.6" stroke="#A8782A" stroke-width=".8"/><path d="M-6 -1 C-2 -4 4 -4 7 -1" stroke="#FFE6A0" stroke-width="1.2" fill="none"/></g>
</symbol>''')

# ---------- capa: caiçaras, entre a serra e o mar ----------
def _arv(x, y, r, c, e):
    return f'<path d="{copa(x, y, r, r * .8, 8, .3)}" fill="{c}" stroke="{e}" stroke-width=".5"/>'
def _topo(x):
    pts = [(-5, 40), (0, 40), (12, 32), (26, 36), (40, 30), (56, 40), (70, 48), (84, 58), (96, 66)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return 66
cp_serra = ''
for j in range(6):
    for x in range(-4, 96, 6):
        y = _topo(x) + 3 + j * 6 + R(-1.5, 1.5)
        if y > 70: continue
        c1, c2 = random.choice([('#3E9A4E', '#26703A'), ('#2E8A6E', '#1A5E4A'), ('#7AAE3A', '#527E22'), ('#5EB070', '#3A7E4A'), ('#2A7A5A', '#16503A')])
        r = R(4.4, 6.4)
        cp_serra += f'<path d="{copa(x + R(-2, 2), y, r, r * .72, 7, .3)}" fill="{c2}"/><path d="{copa(x - r * .15, y - r * .15, r * .7, r * .5, 6, .3)}" fill="{c1}"/>'
cp_flor = ''.join(f'<path d="{copa(x, _topo(x) + R(4, 20), 2.6, 2, 6, .3)}" fill="{c}" stroke="{e}" stroke-width=".3"/>' for x, c, e in [(8, '#B07AD8', '#6A3A9A'), (22, '#FFD23A', '#B8860E'), (36, '#B07AD8', '#6A3A9A'), (48, '#E8F0D8', '#8AA08A'), (60, '#FFD23A', '#B8860E'), (16, '#F2A0C4', '#B85A86'), (72, '#B07AD8', '#6A3A9A')])
S.append(f'''<symbol id="capa-caicara" viewBox="0 0 170 110">
  <defs>{ceu('cpCcC', '#7EC8F4', '#FFF0DC')}{ceu('cpCcM', '#4FB8DC', '#17689A')}{ceu('cpCcS', '#9CC2BE', '#6E9E92')}{ceu('cpCcA', '#F8E6B4', '#DCBC7E')}{ceu('cpCcK', '#B0703E', '#5E3418')}</defs>
  <rect width="170" height="110" fill="url(#cpCcC)"/>
  <circle cx="140" cy="18" r="11" fill="#FFE27A" opacity=".35"/><circle cx="140" cy="18" r="6.4" fill="#FFC83D" stroke="#F0A81E" stroke-width=".8"/>
  <use href="#nuvem" x="84" y="8" width="34" height="16" style="color:#fff" opacity=".9"/>
  <path d="M120 52 C130 44 146 42 156 46 C162 48 168 46 170 46 V54 H118Z" fill="#8EB4B4" opacity=".85"/>
  <rect y="52" width="170" height="58" fill="url(#cpCcM)"/>
  <path d="M0 20 L14 12 L26 18 L40 8 L56 18 L70 22 L86 40 L100 54 H0Z" fill="url(#cpCcS)"/>
  <path d="M0 40 L12 32 L26 36 L40 30 L56 40 L70 48 L84 58 L96 66 H0Z" fill="#2E6A3E"/>
  {cp_serra}{cp_flor}
  <path d="M30 24 C31 32 29 40 32 48 C34 54 31 60 34 66" stroke="#2E5A4A" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>
  <path d="M30 24 C31 32 29 40 32 48 C34 54 31 60 34 66" stroke="#F4FCFF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M30 24 C31 32 29 40 32 48 C34 54 31 60 34 66" stroke="#7FD0F0" stroke-width=".8" fill="none" stroke-dasharray="2 2"/>
  <ellipse cx="34" cy="66" rx="5" ry="1.6" fill="#fff" opacity=".9"/>
  <path d="M0 70 C24 64 46 60 64 58 C80 66 92 82 100 110 H0Z" fill="url(#cpCcA)" stroke="#C8A266" stroke-width=".8"/>
  <path d="M64 58 C80 66 92 82 100 110" stroke="#fff" stroke-width="1.4" fill="none" stroke-dasharray="5 3" opacity=".9"/>
  <g stroke="#5E3418" stroke-width=".6">
    <path d="M10 66 h14 v-8 h-14Z" fill="#FFF6E4"/><path d="M8 58 L17 51 L26 58Z" fill="#D8743E"/><rect x="15" y="61" width="3" height="5" fill="#2E7BF6"/>
    <path d="M30 63 h12 v-7 h-12Z" fill="#FFE07A"/><path d="M28 56 L36 50 L44 56Z" fill="#C8A060"/><rect x="34" y="59" width="3" height="4" fill="#3FA864"/>
  </g>
  <g fill="none" stroke="#F4F8FA" stroke-width=".8"><ellipse cx="128" cy="72" rx="26" ry="8"/></g>
  <g fill="#FF8A3A" stroke="#8A3A0E" stroke-width=".4">{''.join(f'<circle cx="{128 + math.cos(a) * 26:.1f}" cy="{72 + math.sin(a) * 8:.1f}" r="1.3"/>' for a in [i * .52 for i in range(12)])}</g>
  <path d="M102 66 L128 72" stroke="#F4F8FA" stroke-width=".7" stroke-dasharray="2 1.4"/>
  <g transform="translate(112 92)">
    <ellipse cx="0" cy="4" rx="30" ry="2.6" fill="#0E4A7A" opacity=".35"/>
    <path d="M-30 -6 C-20 -3 -10 -2 0 -2 H16 C24 -2 30 -4 34 -9 C32 0 24 4 14 4 H-14 C-24 4 -29 0 -30 -6Z" fill="url(#cpCcK)" stroke="#3A1E0C" stroke-width=".8"/>
    <path d="M-28 -3 C-10 1 14 1 33 -6" stroke="#2E7BF6" stroke-width="1.4" fill="none"/>
    <g><path d="M-16 -4 v-8" stroke="#2E4A8A" stroke-width="5" stroke-linecap="round"/><circle cx="-16" cy="-15" r="3.4" fill="#8A5A36"/><path d="M-20 -16 C-20 -21 -12 -21 -12 -16Z" fill="#E8C878" stroke="#8A6A2A" stroke-width=".4"/><path d="M-22 -16 h12" stroke="#C8A048" stroke-width="1.2"/></g>
    <path d="M-12 -10 L-4 6" stroke="#8A5A2A" stroke-width="1.2"/>
    <g><path d="M14 -4 v-7" stroke="#FF7A2E" stroke-width="5.4" stroke-linecap="round"/><circle cx="14" cy="-13.6" r="3.2" fill="#B07A50"/><circle cx="13" cy="-16.4" r="2.6" fill="#2A1A10"/></g>
  </g>
  <g transform="translate(150 98)"><path d="M-10 0 C-4 -6 6 -6 10 0" fill="#8E8070" stroke="#4E4036" stroke-width=".8"/><path d="M-2 -4 l3 -5 l2 5" fill="#8E8070" stroke="#4E4036" stroke-width=".6"/></g>
  <path d="M0 110 V96 C10 92 18 94 24 100 C30 96 38 98 40 110Z" fill="#4E9A3A" opacity=".9"/><circle cx="14" cy="99" r="2" fill="#C87ADC"/><circle cx="30" cy="102" r="1.8" fill="#C87ADC"/>
</symbol>''')
