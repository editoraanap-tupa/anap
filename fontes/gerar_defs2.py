import math, random, pathlib
d = pathlib.Path(__file__).parent
random.seed(11)
R = random.uniform
def copa(cx, cy, rx, ry, n, amp=.28):
    s = ''
    for i in range(n + 1):
        t = i / n * 2 * math.pi; x = cx + math.cos(t) * rx; y = cy + math.sin(t) * ry
        if i == 0: s = f'M{x:.1f} {y:.1f}'; continue
        tm = (i - .5) / n * 2 * math.pi; k = 1 + amp * R(.7, 1.2)
        s += f' Q{cx + math.cos(tm) * rx * k:.1f} {cy + math.sin(tm) * ry * k:.1f} {x:.1f} {y:.1f}'
    return s + 'Z'
def tex(cx, cy, rx, ry, n, cor, w=1):
    s = ''
    for _ in range(n):
        t = R(0, 6.28); r = math.sqrt(R(0, 1)); x = cx + math.cos(t) * rx * r; y = cy + math.sin(t) * ry * r; a = R(1.6, 2.8)
        s += f'M{x - a:.1f} {y:.1f} q{a:.1f} {-a * .9:.1f} {2 * a:.1f} 0 '
    return f'<path d="{s}" stroke="{cor}" stroke-width="{w}" fill="none" stroke-linecap="round"/>'
def capim(x0, x1, y, n, cor, h=(4, 8), w=1):
    s = ''
    for _ in range(n):
        x = R(x0, x1); hh = R(*h)
        s += f'M{x:.1f} {y:.1f} q{R(-1.5,1.5):.1f} {-hh/2:.1f} {R(-2.5,2.5):.1f} {-hh:.1f} '
    return f'<path d="{s}" stroke="{cor}" stroke-width="{w}" fill="none" stroke-linecap="round"/>'

S = []
# ---------- bichos e plantas ----------
S.append('''<symbol id="f-tuiuiu" viewBox="0 0 100 130">
  <ellipse cx="50" cy="126" rx="26" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M44 86 L40 124 M56 86 L60 124" stroke="#1E1E28" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M34 124 h10 M56 124 h10" stroke="#1E1E28" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M28 64 C26 48 40 40 54 42 C70 44 80 56 78 72 C76 86 62 92 48 90 C36 88 30 78 28 64Z" fill="#FFFFFF" stroke="#4E5B7A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M60 50 C74 54 80 66 76 80 C70 74 64 66 60 50Z" fill="#E9EEF6" stroke="#4E5B7A" stroke-width="1.2"/>
  <path d="M70 84 C78 90 84 96 88 104 C80 102 74 96 70 90Z" fill="#1E1E28"/>
  <path d="M36 56 C40 52 46 50 52 50" stroke="#D3DCEE" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M40 46 C38 36 38 28 40 22" stroke="#1E1E28" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M35 46 C36 42 44 42 46 46 C46 50 36 50 35 46Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.2"/>
  <ellipse cx="42" cy="18" rx="9" ry="8" fill="#1E1E28"/>
  <circle cx="45" cy="16" r="1.8" fill="#FFF3C4"/><circle cx="45.4" cy="15.6" r=".7" fill="#1E1E28"/>
  <path d="M48 16 C60 18 72 24 84 34 C72 30 60 26 48 22Z" fill="#2B2B33" stroke="#12121A" stroke-width="1" stroke-linejoin="round"/>
  <path d="M50 18 C60 20 68 24 76 29" stroke="#55556A" stroke-width="1" fill="none"/>
</symbol>''')
S.append(f'''<symbol id="f-jacare" viewBox="0 0 150 80">
  <defs><linearGradient id="jcAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB6D9"/><stop offset="1" stop-color="#2E7BB6"/></linearGradient></defs>
  <path d="M6 50 Q75 40 144 50 L144 76 Q75 80 6 76Z" fill="url(#jcAgua)" stroke="#1E5E8E" stroke-width="1.4"/>
  <path d="M14 42 C30 30 60 26 92 30 C108 26 124 26 140 34 C146 38 144 46 136 46 C120 48 100 48 86 48 C60 52 30 52 14 48Z" fill="#6E8B3D" stroke="#33461A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M30 34 l4 -5 l4 5 M44 31 l4 -5 l4 5 M58 29 l4 -5 l4 5 M72 29 l4 -5 l4 5" fill="#5A7330" stroke="#33461A" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M100 40 C110 42 126 42 140 40" stroke="#33461A" stroke-width="1.2" fill="none"/>
  <path d="M104 44 l2 -3 M112 44 l2 -3 M120 44 l2 -3 M128 43 l2 -3" stroke="#F4F1D0" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="96" cy="28" rx="7" ry="6" fill="#7E9C48" stroke="#33461A" stroke-width="1.6"/><ellipse cx="97" cy="27" rx="3.6" ry="3.4" fill="#F2D44A"/><path d="M97 24.4 V29.6" stroke="#12121A" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="136" cy="34" r="1.6" fill="#33461A"/>
  <path d="M6 52 Q40 46 70 50" stroke="#BFE6FF" stroke-width="1.6" fill="none" opacity=".8"/>
  <g stroke="#E6F6FF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M20 62 q6 -3 12 0 M70 68 q6 -3 12 0 M114 60 q6 -3 12 0"/></g>
</symbol>''')
ros = ''.join(f'<path d="M{x} {y} a{r} {r*.8:.1f} 0 1 1 0.1 0" stroke="#3A2210" stroke-width="1.5" fill="none" stroke-dasharray="3 1.6"/>' for x, y, r in [(30,70,4),(44,80,3.6),(58,72,4),(74,80,3.4),(88,72,3.8),(102,80,3.4),(38,90,3),(66,92,3.2),(94,90,3)])
S.append(f'''<symbol id="f-onca" viewBox="0 0 140 100">
  <defs><linearGradient id="ocPelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B84A"/><stop offset="1" stop-color="#D98A22"/></linearGradient></defs>
  <ellipse cx="70" cy="96" rx="56" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M112 72 C126 66 134 52 128 40 C126 52 118 60 108 64Z" fill="url(#ocPelo)" stroke="#6E3E10" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M126 44 l3 -3" stroke="#3A2210" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 94 C14 78 18 62 34 58 C58 52 92 54 108 60 C120 66 122 84 116 94Z" fill="url(#ocPelo)" stroke="#6E3E10" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M34 92 C44 86 92 86 104 92" fill="#FFF3D6" stroke="#6E3E10" stroke-width="1.2"/>
  {ros}
  <path d="M34 94 v-10 M48 94 v-8 M96 94 v-8 M108 94 v-10" stroke="#6E3E10" stroke-width="1.4" stroke-linecap="round"/>
  <circle cx="30" cy="34" r="9" fill="url(#ocPelo)" stroke="#6E3E10" stroke-width="1.6"/><circle cx="30" cy="34" r="4.5" fill="#F7C9A0"/>
  <circle cx="64" cy="32" r="9" fill="url(#ocPelo)" stroke="#6E3E10" stroke-width="1.6"/><circle cx="64" cy="32" r="4.5" fill="#F7C9A0"/>
  <path d="M22 54 C18 36 30 26 47 26 C64 26 76 36 72 54 C70 66 60 72 47 72 C34 72 24 66 22 54Z" fill="url(#ocPelo)" stroke="#6E3E10" stroke-width="1.8"/>
  <path d="M34 60 C36 52 58 52 60 60 C60 68 54 72 47 72 C40 72 34 68 34 60Z" fill="#FFF3D6" stroke="#C98A4A" stroke-width="1"/>
  <path d="M42 56 C44 53 50 53 52 56 C50 60 44 60 42 56Z" fill="#7A3E1E"/>
  <path d="M47 60 v4 M47 64 q-4 3 -7 1 M47 64 q4 3 7 1" stroke="#3A2210" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="38" cy="46" rx="4" ry="4.6" fill="#FFF3C4" stroke="#3A2210" stroke-width="1"/><ellipse cx="56" cy="46" rx="4" ry="4.6" fill="#FFF3C4" stroke="#3A2210" stroke-width="1"/>
  <ellipse cx="38" cy="47" rx="1.6" ry="3" fill="#12121A"/><ellipse cx="56" cy="47" rx="1.6" ry="3" fill="#12121A"/>
  <path d="M30 38 a2.4 2 0 1 1 .1 0 M62 36 a2.4 2 0 1 1 .1 0 M46 34 a2 1.6 0 1 1 .1 0 M26 52 a2 1.6 0 1 1 .1 0 M68 52 a2 1.6 0 1 1 .1 0" stroke="#3A2210" stroke-width="1.6" fill="#3A2210"/>
</symbol>''')
S.append('''<symbol id="f-capivara" viewBox="0 0 140 100">
  <defs><linearGradient id="cpPelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B98352"/><stop offset="1" stop-color="#8A5A32"/></linearGradient></defs>
  <ellipse cx="70" cy="94" rx="52" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M38 80 v12 M56 82 v10 M90 82 v10 M106 80 v12" stroke="#5E3A1C" stroke-width="7" stroke-linecap="round"/>
  <path d="M20 60 C20 40 46 30 74 30 C100 30 120 40 122 58 C124 76 106 84 74 84 C42 84 20 78 20 60Z" fill="url(#cpPelo)" stroke="#4E2E14" stroke-width="1.8"/>
  <path d="M30 54 q6 -4 12 -2 M48 46 q6 -4 12 -2 M68 42 q6 -4 12 -2 M88 46 q6 -4 12 -2 M40 66 q6 -3 12 -1 M70 62 q6 -3 12 -1" stroke="#7A4E28" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M100 36 C112 26 132 30 136 46 C138 56 132 64 120 64 C110 64 102 54 100 36Z" fill="url(#cpPelo)" stroke="#4E2E14" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M128 40 C136 40 140 48 138 56 C134 58 130 56 128 52Z" fill="#7A4A26" stroke="#4E2E14" stroke-width="1.4"/>
  <ellipse cx="106" cy="30" rx="5" ry="4" fill="#9A6A40" stroke="#4E2E14" stroke-width="1.4"/>
  <circle cx="118" cy="42" r="2.4" fill="#12121A"/><circle cx="118.8" cy="41.2" r=".8" fill="#fff"/>
  <path d="M134 46 l1 1" stroke="#12121A" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 44 C46 34 66 32 84 34" stroke="#D4A06A" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>''')
S.append('''<symbol id="f-lobo" viewBox="0 0 120 130">
  <defs><linearGradient id="lbPelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F08A3C"/><stop offset="1" stop-color="#C85A1E"/></linearGradient></defs>
  <ellipse cx="60" cy="126" rx="40" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M100 66 C112 70 116 82 112 96 C106 88 100 80 96 72Z" fill="url(#lbPelo)" stroke="#6E2E0E" stroke-width="1.6" stroke-linejoin="round"/><path d="M112 96 C110 90 108 86 106 84 C110 84 114 90 112 96Z" fill="#fff"/>
  <path d="M34 82 L32 124 M46 84 L46 124 M82 84 L82 124 M94 82 L96 124" stroke="#1E1E28" stroke-width="6" stroke-linecap="round"/>
  <path d="M34 82 L33 100 M46 84 L46 100 M82 84 L82 100 M94 82 L95 100" stroke="#C85A1E" stroke-width="6" stroke-linecap="round"/>
  <path d="M28 70 C28 58 44 52 64 52 C86 52 102 58 102 70 C102 82 90 88 64 88 C40 88 28 82 28 70Z" fill="url(#lbPelo)" stroke="#6E2E0E" stroke-width="1.8"/>
  <path d="M30 60 C40 50 56 48 70 52 C58 56 44 60 32 66Z" fill="#1E1E28"/>
  <path d="M38 72 C52 80 76 80 92 74" stroke="#F7B27A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M34 62 C30 50 26 40 22 30" stroke="#1E1E28" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M34 62 C30 50 26 40 22 30" stroke="url(#lbPelo)" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M12 6 L16 24 L24 18Z M30 4 L28 22 L36 20Z" fill="url(#lbPelo)" stroke="#6E2E0E" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 12 L17 21 M30 10 L30 19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M10 26 C10 18 18 16 26 18 C34 20 36 28 32 34 C28 40 20 42 14 40 C8 38 6 34 4 34 C2 32 4 28 10 26Z" fill="url(#lbPelo)" stroke="#6E2E0E" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M4 33 C2 31 2 29 5 28 C7 28 8 30 7 32Z" fill="#1E1E28"/>
  <path d="M8 36 C12 40 20 42 26 38" fill="#fff" stroke="#6E2E0E" stroke-width="1"/>
  <circle cx="18" cy="26" r="2.4" fill="#12121A"/><circle cx="18.7" cy="25.3" r=".8" fill="#fff"/>
</symbol>''')
S.append('''<symbol id="f-tamandua" viewBox="0 0 150 100">
  <defs><linearGradient id="tmPelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8A76"/><stop offset="1" stop-color="#6E5E4C"/></linearGradient></defs>
  <ellipse cx="74" cy="96" rx="60" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M104 50 C122 30 146 30 148 50 C146 68 128 76 108 72Z" fill="#7A6A56" stroke="#3E3226" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M112 50 l8 -8 M120 56 l10 -8 M114 64 l14 -6 M126 46 l8 -6 M132 58 l10 -4" stroke="#5A4A38" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M48 78 v16 M60 80 v14 M92 80 v14 M104 78 v16" stroke="#3E3226" stroke-width="7" stroke-linecap="round"/>
  <path d="M30 60 C34 44 60 38 80 40 C100 42 112 52 110 66 C108 80 92 84 70 84 C46 84 28 76 30 60Z" fill="url(#tmPelo)" stroke="#3E3226" stroke-width="1.8"/>
  <path d="M40 52 C58 58 76 66 92 82 L82 84 C68 70 54 62 36 58Z" fill="#1E1E28"/>
  <path d="M42 54 C58 60 72 68 84 80" stroke="#F4F1E6" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M34 56 C24 54 14 56 2 62 C14 62 24 64 34 66Z" fill="#8E7E6A" stroke="#3E3226" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="26" cy="58" r="1.8" fill="#12121A"/><path d="M34 50 C32 46 34 44 38 46" fill="#8E7E6A" stroke="#3E3226" stroke-width="1.4"/>
  <path d="M2 62 q-1 4 2 6" stroke="#E57FA5" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')
S.append('''<symbol id="f-pequi" viewBox="0 0 100 100">
  <ellipse cx="50" cy="94" rx="36" ry="4" fill="#0A1440" opacity=".16"/>
  <path d="M16 30 C30 14 54 10 74 18 C60 24 40 28 16 30Z" fill="#4FA35A" stroke="#1E6B3A" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 29 C36 24 54 20 72 18" stroke="#1E6B3A" stroke-width="1.1" fill="none"/>
  <path d="M60 22 C76 14 92 20 96 34 C84 34 70 30 60 22Z" fill="#3E9A55" stroke="#1E6B3A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M50 24 V34" stroke="#5E3A1C" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="34" cy="62" r="24" fill="#6DAF4A" stroke="#2E6B22" stroke-width="1.8"/><path d="M22 52 q6 -8 16 -8" stroke="#A8DA80" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <circle cx="72" cy="66" r="22" fill="#F4F1D6" stroke="#2E6B22" stroke-width="1.8"/>
  <circle cx="72" cy="66" r="15" fill="#F7C531" stroke="#C98A00" stroke-width="1.4"/><circle cx="72" cy="66" r="7" fill="#F9D867" stroke="#C98A00" stroke-width="1"/>
  <path d="M66 60 q3 -3 7 -2" stroke="#FFF1B8" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>''')
folhas = ''.join(f'<path d="M50 40 Q{50+math.cos(a)*22:.1f} {40+math.sin(a)*14-8:.1f} {50+math.cos(a)*42:.1f} {40+math.sin(a)*26:.1f}" stroke="#2E8B4A" stroke-width="5" fill="none" stroke-linecap="round"/>' for a in [math.radians(x) for x in (-170,-140,-110,-75,-45,-15,15,165)])
S.append(f'''<symbol id="f-buriti" viewBox="0 0 100 150">
  <ellipse cx="50" cy="144" rx="40" ry="6" fill="#5FB6D9" stroke="#2E7BB6" stroke-width="1.4"/>
  <path d="M46 144 C47 110 47 80 48 42 L54 42 C55 80 55 110 56 144Z" fill="#9A8064" stroke="#4E3A26" stroke-width="1.6"/>
  <path d="M47 60 h8 M47 76 h8 M47 92 h8 M47 108 h8 M47 124 h8" stroke="#6E5640" stroke-width="1.4"/>
  {folhas}
  <path d="M50 40 C40 20 30 14 18 12 M50 40 C60 18 72 12 84 12 M50 40 C50 22 50 14 52 4" stroke="#3FA864" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M50 40 C40 20 30 14 18 12 M50 40 C60 18 72 12 84 12 M50 40 C50 22 50 14 52 4" stroke="#7FD49A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g fill="#8A3E1E" stroke="#4E1E0C" stroke-width="1">{''.join(f'<ellipse cx="{x}" cy="{y}" rx="3.6" ry="4.4"/>' for x,y in [(44,48),(48,52),(52,50),(56,48),(46,56),(54,56),(50,58)])}</g>
  <path d="M16 140 q4 -10 8 0 M76 140 q4 -12 8 0" stroke="#3E8A3A" stroke-width="2" fill="none" stroke-linecap="round"/>
</symbol>''')

S.append('''<symbol id="tuiuiu-voa" viewBox="0 0 160 80">
  <g class="asa"><path d="M70 40 C56 20 34 8 6 6 C14 12 18 16 22 18 C14 18 10 20 6 22 C16 24 24 26 30 28 C24 30 20 32 16 36 C34 38 52 40 70 44Z" fill="#fff" stroke="#4E5B7A" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 6 C14 12 18 16 22 18 C14 18 10 20 6 22 C16 24 24 26 30 28 C24 30 20 32 16 36 L28 34 C24 26 18 16 6 6Z" fill="#1E1E28"/></g>
  <path d="M60 40 C70 32 90 32 100 40 C94 48 72 50 60 44Z" fill="#fff" stroke="#4E5B7A" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M60 42 L40 46 M60 44 L42 50" stroke="#1E1E28" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M98 40 C108 38 116 36 122 34" stroke="#1E1E28" stroke-width="7" stroke-linecap="round"/>
  <path d="M100 41 C103 37 108 37 110 39 C110 43 102 44 100 41Z" fill="#E5392C" stroke="#7A1410" stroke-width="1"/>
  <ellipse cx="126" cy="32" rx="7" ry="6" fill="#1E1E28"/><circle cx="128" cy="30" r="1.4" fill="#FFF3C4"/>
  <path d="M131 30 C142 30 152 32 158 36 C150 36 142 36 132 35Z" fill="#2B2B33" stroke="#12121A" stroke-width="1" stroke-linejoin="round"/>
  <g class="asa" style="animation-delay:-.16s"><path d="M80 40 C86 22 104 10 130 4 C122 12 120 16 118 20 C124 20 128 22 132 24 C122 26 116 28 110 30 C116 32 118 34 120 38 C104 40 92 42 80 44Z" fill="#F2F5FA" stroke="#4E5B7A" stroke-width="1.8" stroke-linejoin="round"/><path d="M130 4 C122 12 120 16 118 20 C124 20 128 22 132 24 C122 26 116 28 110 30 C116 32 118 34 120 38 L110 36 C114 26 120 14 130 4Z" fill="#1E1E28"/></g>
</symbol>''')
S.append('''<symbol id="garca" viewBox="0 0 40 20">
  <g class="asa"><path d="M20 12 C14 4 8 2 2 2 C6 6 10 10 18 13Z" fill="#fff" stroke="#6F84AE" stroke-width="1"/></g>
  <path d="M12 12 C16 10 24 10 28 12 C24 15 16 15 12 12Z" fill="#fff" stroke="#6F84AE" stroke-width="1"/>
  <path d="M28 12 C32 10 34 9 36 9 L40 9.6 L36 10.4" stroke="#6F84AE" stroke-width="1" fill="#fff"/><path d="M38 9.6 L40 9.8" stroke="#F0B42A" stroke-width="1.4"/>
  <g class="asa" style="animation-delay:-.16s"><path d="M20 12 C24 4 30 1 36 0 C32 5 28 9 22 13Z" fill="#F2F5FA" stroke="#6F84AE" stroke-width="1"/></g>
</symbol>''')
# ---------- capas (cenas 170x110) ----------
def ceu(id, c0, c1): return f'<linearGradient id="{id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{c0}"/><stop offset="1" stop-color="{c1}"/></linearGradient>'
S.append(f'''<symbol id="capa-amazonia" viewBox="0 0 170 110">
  <defs>{ceu('cpAmzC','#5DB8F5','#E8F7EE')}{ceu('cpAmzR','#7CC3D9','#2E7FA8')}</defs>
  <rect width="170" height="110" fill="url(#cpAmzC)"/>
  <circle cx="140" cy="20" r="11" fill="#FFE27A" stroke="#F0B42A" stroke-width="1.4"/><circle cx="140" cy="20" r="18" fill="#FFE27A" opacity=".25"/>
  <path d="{copa(85,62,95,10,22,.5)}" fill="#8CC7AE" stroke="#6FAE94" stroke-width="1"/>
  <path d="{copa(85,72,95,12,20,.5)}" fill="#4F9E73" stroke="#3E8662" stroke-width="1"/>
  <path d="M0 72 C40 66 80 76 170 70 V110 H0Z" fill="#2B7F50"/>
  {tex(85,80,80,6,30,'#22693F',.8)}
  <path d="M0 84 C40 80 70 90 110 86 S150 80 170 84 V110 H0Z" fill="url(#cpAmzR)" stroke="#2E6E54" stroke-width="1.2"/>
  <g stroke="#E6F6FF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"><path d="M20 94 q5 -2 10 0 M90 100 q6 -2 12 0 M130 92 q5 -2 10 0"/></g>
  <g stroke="#1E6B3A" stroke-width="1"><ellipse cx="54" cy="98" rx="11" ry="3.2" fill="#4FBF6A"/><ellipse cx="70" cy="102" rx="7" ry="2.2" fill="#5FD483"/></g><path d="M54 98 L60 96" stroke="#1E6B3A" stroke-width="1"/>
  <path d="M100 96 C104 88 112 86 118 90 C114 92 110 94 106 98Z" fill="#EE86AE" stroke="#8E2E58" stroke-width="1.2"/>
  <path d="M118 84 C119 60 120 50 122 40 L127 40 C129 50 130 60 131 84Z" fill="#D9CBB2" stroke="#6E5B45" stroke-width="1.2"/>
  <path d="M112 86 C118 82 120 76 121 68 L122 86Z M137 86 C131 82 129 76 128 68 L127 86Z" fill="#C2B196" stroke="#6E5B45" stroke-width="1"/>
  <path d="{copa(124,38,30,12,12)}" fill="#1F7A45" stroke="#0C3F23" stroke-width="1.2"/>
  <path d="{copa(124,30,22,10,10)}" fill="#39A764" stroke="#1E7B45" stroke-width="1.1"/>
  {tex(124,34,24,8,10,'#1D7A44',.8)}
  <path d="M116 24 q6 -4 13 -2" stroke="#B6F2C4" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M0 48 C12 46 26 46 40 50" stroke="#5E3518" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 48 C12 46 26 46 40 50" stroke="#A56D3E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M34 48 C38 42 44 40 48 40 C46 46 42 48 34 48Z" fill="#52BE78" stroke="#1E6B3A" stroke-width="1"/>
  <svg x="6" y="8" width="38" height="50" viewBox="0 0 100 130"><use class="sem" href="#f-arara"/></svg>
</symbol>''')
cerca = ''.join(f'<path d="M{x} 70 l2 -4 l2 4" />' for x in range(6, 170, 14))
S.append(f'''<symbol id="capa-caatinga" viewBox="0 0 170 110">
  <defs>{ceu('cpCaaC','#FFB872','#FFF0D2')}{ceu('cpCaaT','#EBC18A','#D29E62')}</defs>
  <rect width="170" height="110" fill="url(#cpCaaC)"/>
  <circle cx="34" cy="26" r="16" fill="#FFE27A" opacity=".35"/><circle cx="34" cy="26" r="10" fill="#FFC83D" stroke="#F0A81E" stroke-width="1.4"/>
  <path d="M0 62 L20 48 L36 56 L58 40 L80 54 L104 42 L126 54 L150 44 L170 52 V72 H0Z" fill="#E8B98A" stroke="#D29E6C" stroke-width="1" stroke-linejoin="round"/>
  <rect y="66" width="170" height="44" fill="url(#cpCaaT)"/><path d="M0 66 Q60 60 170 66" stroke="#C49460" stroke-width="1" fill="none"/>
  <g stroke="#B98A52" stroke-width="1" fill="none" stroke-linecap="round"><path d="M14 90 l6 3 l-2 4 M120 98 l-5 3 l3 4 M70 102 l6 2"/></g>
  {capim(0,170,108,26,'#9AA05A',(3,6),.9)}
  <path d="M8 74 l3 -12 M11 66 l-4 -4 M11 64 l4 -5 M150 76 l2 -10 M152 70 l4 -3 M152 68 l-4 -4" stroke="#8C7A68" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <rect x="96" y="58" width="44" height="26" fill="#F6E4CC" stroke="#7A4A2A" stroke-width="1.2"/>
  <path d="M92 60 L118 44 L144 60Z" fill="#D2633F" stroke="#7A2E18" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M100 56 L118 46 L136 56" stroke="#B04A2A" stroke-width=".9" fill="none"/>
  <rect x="104" y="66" width="8" height="18" fill="#2E7BF6" stroke="#123E8E" stroke-width="1"/><rect x="120" y="64" width="12" height="9" fill="#22A565" stroke="#12753F" stroke-width="1"/>
  <path d="M126 64 v9 M120 68.5 h12" stroke="#12753F" stroke-width=".8"/>
  <path d="M140 62 H150 V70" stroke="#4E5B7A" stroke-width="3.4" fill="none" stroke-linejoin="round"/><path d="M140 62 H150 V70" stroke="#93A2C2" stroke-width="2" fill="none" stroke-linejoin="round"/>
  <rect x="144" y="70" width="20" height="18" rx="2" fill="#F4F1EA" stroke="#5A6787" stroke-width="1.2"/><ellipse cx="154" cy="70" rx="10" ry="2.4" fill="#E9E4D8" stroke="#5A6787" stroke-width="1"/>
  <path d="M146 80 h16" stroke="#3D8BFF" stroke-width="5" opacity=".75"/>
  <svg x="44" y="22" width="44" height="66" viewBox="0 0 100 150"><use class="sem" href="#f-mandacaru"/></svg>
  <path d="M10 18 q4 -3 8 0 q4 -3 8 0" stroke="#4E5B7A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M66 14 q3 -2 6 0 q3 -2 6 0" stroke="#4E5B7A" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')
# Pantanal
carandas = ''.join(f'<g transform="translate({x} {y})"><path d="M0 0 V-16" stroke="#6E5B45" stroke-width="1.6"/><path d="M0 -16 l-7 -2 M0 -16 l7 -2 M0 -16 l-5 -6 M0 -16 l5 -6 M0 -16 l0 -7" stroke="#2E8B4A" stroke-width="1.6" stroke-linecap="round"/></g>' for x, y in [(22,62),(34,60),(150,60)])
S.append(f'''<symbol id="capa-pantanal" viewBox="0 0 170 110">
  <defs>{ceu('cpPanC','#FFC98A','#FFF2D8')}{ceu('cpPanA','#7FC6E4','#2F86C0')}</defs>
  <rect width="170" height="110" fill="url(#cpPanC)"/>
  <circle cx="120" cy="40" r="14" fill="#FFB347" stroke="#F08A1E" stroke-width="1.2"/><circle cx="120" cy="40" r="22" fill="#FFB347" opacity=".25"/>
  <path d="{copa(30,62,30,6,10,.5)}" fill="#5D9E6A" stroke="#4A8656" stroke-width="1"/><path d="{copa(140,62,34,6,10,.5)}" fill="#5D9E6A" stroke="#4A8656" stroke-width="1"/>
  {carandas}
  <rect y="62" width="170" height="48" fill="url(#cpPanA)"/>
  <path d="M0 62.5 H170" stroke="#2F86C0" stroke-width="1"/>
  {capim(0,170,72,40,'#5FAE58',(3,7),1)}{capim(0,170,90,30,'#4E9E4A',(4,8),1)}
  <g stroke="#E6F6FF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"><path d="M20 82 q5 -2 10 0 M110 96 q6 -2 12 0 M140 78 q5 -2 10 0"/></g>
  <path d="M112 62 q6 0 8 -2" stroke="#FFE2A0" stroke-width="1.2" fill="none" opacity=".7"/>
  <g transform="translate(96 86)"><path d="M-18 0 C-10 -6 6 -6 22 -3 C26 -2 26 2 22 2 C8 3 -8 4 -18 2Z" fill="#6E8B3D" stroke="#33461A" stroke-width="1.2" stroke-linejoin="round"/><ellipse cx="-6" cy="-5" rx="4" ry="3.4" fill="#7E9C48" stroke="#33461A" stroke-width="1"/><ellipse cx="-5.6" cy="-5.4" rx="2" ry="1.8" fill="#F2D44A"/><path d="M-5.6 -7 v3" stroke="#12121A" stroke-width="1"/><path d="M-24 3 q8 -3 16 0 M14 4 q6 -2 12 0" stroke="#E6F6FF" stroke-width="1" fill="none"/></g>
  <svg x="12" y="34" width="38" height="50" viewBox="0 0 100 130"><use class="sem" href="#f-tuiuiu"/></svg>
  <path d="M96 22 q4 -3 8 0 q4 -3 8 0 M138 18 q3 -2 6 0 q3 -2 6 0" stroke="#4E5B7A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
</symbol>''')
arvC = lambda x, y, s: f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 C-1 -8 3 -12 0 -20 C-3 -24 -6 -24 -8 -28 M0 -12 C4 -16 8 -18 10 -24" stroke="#6E4A2A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="{copa(-6,-30,9,5,7)}" fill="#7EAA4A" stroke="#4E7A2A" stroke-width="1"/><path d="{copa(10,-27,8,4.5,7)}" fill="#8EBA52" stroke="#4E7A2A" stroke-width="1"/></g>'
S.append(f'''<symbol id="capa-cerrado" viewBox="0 0 170 110">
  <defs>{ceu('cpCerC','#7CC8F5','#EAF6FF')}{ceu('cpCerT','#E8C97A','#C9A44A')}{ceu('cpCerS','#B8743E','#7A4A22')}</defs>
  <rect width="170" height="110" fill="url(#cpCerC)"/>
  <path d="M110 18 q8 -6 16 0 q6 -3 10 1 q4 4 -1 5 h-26 q-4 -2 1 -6Z" fill="#fff" opacity=".95"/>
  <path d="M0 46 L30 38 L60 44 L100 34 L140 42 L170 38 V60 H0Z" fill="#B9C98A" stroke="#93A86A" stroke-width="1" stroke-linejoin="round"/>
  <rect y="54" width="170" height="16" fill="url(#cpCerT)"/>
  {capim(0,170,62,40,'#A88A3A',(3,7),.9)}
  <rect y="66" width="170" height="44" fill="url(#cpCerS)"/>
  <path d="M0 66 H170" stroke="#5E3A1C" stroke-width="1.2"/>
  <rect y="96" width="170" height="14" fill="#3D8BFF" opacity=".85"/><path d="M0 96 q10 -2 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#9FD8FF" stroke-width="1.2" fill="none"/>
  <g stroke="#E2B07A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".95"><path d="M36 60 C36 72 30 82 34 94 M36 70 C42 78 40 86 46 92 M36 74 C30 80 24 84 22 90"/><path d="M100 58 C100 72 106 82 102 94 M100 70 C94 78 96 86 90 92 M100 76 C108 82 112 86 114 92"/></g>
  {arvC(36,60,1.1)}{arvC(100,58,1.2)}
  <g transform="translate(150 66)"><path d="M0 0 V-20" stroke="#8A7058" stroke-width="2"/><path d="M0 -20 l-10 -2 M0 -20 l10 -2 M0 -20 l-7 -8 M0 -20 l7 -8 M0 -20 l0 -10" stroke="#3FA864" stroke-width="2.2" stroke-linecap="round"/></g>
  <path d="M146 66 q4 6 2 12 q-2 6 2 18" stroke="#3D8BFF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <svg x="58" y="30" width="30" height="34" viewBox="0 0 120 130"><use class="sem" href="#f-lobo"/></svg>
</symbol>''')
exec((d / 'gerar_defs3.py').read_text())
exec((d / 'gerar_defs4.py').read_text())
exec((d / 'gerar_defs5.py').read_text())
exec((d / 'gerar_defs_chinampa.py').read_text())
exec((d / 'gerar_defs_inuit.py').read_text())
exec((d / 'gerar_defs_subak.py').read_text())
exec((d / 'gerar_defs_dujiang.py').read_text())
exec((d / 'gerar_defs_baoli.py').read_text())
exec((d / 'gerar_defs_qanat.py').read_text())
exec((d / 'gerar_defs_nilo.py').read_text())
exec((d / 'gerar_defs_vilas.py').read_text())
exec((d / 'gerar_defs_diques.py').read_text())
exec((d / 'gerar_defs_casa.py').read_text())
exec((d / 'gerar_defs_lagos.py').read_text())
exec((d / 'gerar_defs_deserto.py').read_text())
exec((d / 'gerar_defs_andes.py').read_text())
(d / 'defs2.html').write_text('<svg class="defs" aria-hidden="true"><defs>\n' + '\n'.join(S) + '\n</defs></svg>\n')
print('ok', sum(len(s) for s in S))
