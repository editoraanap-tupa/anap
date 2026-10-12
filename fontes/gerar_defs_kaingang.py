# figurinhas e capa da parada Kaingang, Alta Paulista (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(263)

# ---------- gralha-picaça (Tita) ----------
S.append(f'''<symbol id="f-gralhapicaca" viewBox="0 0 120 100">
  <defs>{lg('kgfAsa', '#8A84FF', '#3A32B0', 1, 1)}{lg('kgfBarr', '#FFFBE6', '#F2DA94')}{rg('kgfCab', '#4A4A62', '#1E1E2C', '#0A0A12', .4, .3)}{lg('kgfCauda', '#3A3A70', '#14142A', 1, 1)}{lg('kgfGalho', '#A8805A', '#5E3E22')}{lg('kgfFolha', '#8ACB5A', '#2E7A32')}</defs>
  <ellipse cx="62" cy="95" rx="40" ry="3.4" fill="#0A1440" opacity=".16"/>
  <path d="M2 82 C30 78 70 80 118 76" stroke="#3E2A16" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M2 82 C30 78 70 80 118 76" stroke="url(#kgfGalho)" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <path d="M10 81 C30 78 60 79 100 77" stroke="#D8B88A" stroke-width="1.2" fill="none" opacity=".7"/>
  <path d="M96 77 C100 68 108 64 116 64 C112 70 106 76 98 78Z M90 79 C92 86 98 92 106 92 C102 86 98 82 92 79Z" fill="url(#kgfFolha)" stroke="#1E5A22" stroke-width="1"/>
  <path d="M38 62 C24 72 14 84 8 96 C16 96 26 88 34 76Z" fill="url(#kgfCauda)" stroke="#0A0A1A" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M8 96 C14 96 20 92 23 88 L16 84Z" fill="#FFF2C8" stroke="#9A8A5A" stroke-width=".9"/>
  <path d="M34 60 C30 44 44 32 62 34 C78 36 84 50 78 64 C72 76 56 80 44 76 C36 72 34 66 34 60Z" fill="url(#kgfBarr)" stroke="#8A7A4A" stroke-width="1.6"/>
  <path d="M34 60 C30 46 40 34 56 34 C48 42 44 54 46 70 C40 70 36 66 34 60Z" fill="url(#kgfAsa)" stroke="#1E1A6A" stroke-width="1.6"/>
  <path d="M37 56 C40 48 46 42 52 39 M38 63 C41 55 46 49 51 46" stroke="#C8C4FF" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M54 36 C68 33 83 40 83 58 C76 60 66 56 60 50 C55 46 53 41 54 36Z" fill="#16161E"/><path d="M66 42 C72 44 76 48 78 54" stroke="#4A4A60" stroke-width="1.2" fill="none" opacity=".8"/>
  <path d="M52 76 l-3 6 M58 77 l1 6" stroke="#2A2A30" stroke-width="2.4" stroke-linecap="round"/><path d="M45 82 l4 -1 l3 1 M55 83 l4 -1 l3 1" stroke="#2A2A30" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <circle cx="68" cy="28" r="17" fill="url(#kgfCab)" stroke="#0A0A14" stroke-width="1.8"/>
  <path d="M54 20 C49 14 52 7 58 9 C57 4 64 1 67 6 C69 1 76 2 76 8 C79 6 82 10 80 14" fill="#22222E" stroke="#0A0A14" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M57 12 q4 -3 8 -2 M66 8 q4 -1 7 1" stroke="#5A5A78" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M53 36 C50 28 51 20 56 16 C54 24 54 30 56 40Z" fill="#C8E2FF" stroke="#4A6AB0" stroke-width=".8"/>
  <ellipse cx="73.4" cy="19.6" rx="6.4" ry="2.6" fill="#5AC4FF" stroke="#1E5AA8" stroke-width=".8"/><path d="M70 19 h6" stroke="#C8F0FF" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="72.4" cy="35.6" rx="4.6" ry="2.2" fill="#3A8AF0" stroke="#1E4A9A" stroke-width=".8"/>
  <circle cx="73.4" cy="27.4" r="5.4" fill="#FFE24A" stroke="#8A6A08" stroke-width="1"/><circle cx="74.2" cy="27.6" r="3" fill="#0A0A10"/><circle cx="75.4" cy="26.2" r="1.2" fill="#fff"/><circle cx="73.4" cy="28.8" r=".5" fill="#fff"/>
  <path d="M83 26 L98 30 L83 34Z" fill="#18181E" stroke="#0A0A10" stroke-width="1.2" stroke-linejoin="round"/><path d="M85 28 l9 2" stroke="#6A6A78" stroke-width=".8"/>
  <path d="M58 18 C62 14 68 13 73 14" stroke="#6A6A88" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="78" cy="38.6" rx="3" ry="1.5" fill="#FF8AB0" opacity=".55"/>
</symbol>''')

# ---------- piapara ----------
S.append(f'''<symbol id="f-piapara" viewBox="0 0 130 90">
  <defs>{lg('kgpCorpo', '#8E9454', '#F4F2E0')}{lg('kgpFin', '#FFD45A', '#E08A2A', 1, 0)}{lg('kgpAgua', '#9ADCEC', '#3E9AC0')}{lg('kgpChao', '#C8A06A', '#8A6A3A')}{lg('kgpAlga', '#7CCB7A', '#2E7A4A')}</defs>
  <rect x="2" y="6" width="126" height="80" rx="16" fill="url(#kgpAgua)" opacity=".35"/>
  <path d="M4 86 C20 76 50 78 66 80 C88 76 112 78 126 86Z" fill="url(#kgpChao)" stroke="#5E4426" stroke-width="1.3"/>
  <g fill="#B8946A" stroke="#6E5236" stroke-width=".7"><ellipse cx="22" cy="83" rx="5" ry="2.4"/><ellipse cx="104" cy="82" rx="6" ry="2.8"/></g>
  <path d="M112 84 C108 70 114 60 110 48 M118 84 C120 74 116 66 120 56" stroke="#1E5A36" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M112 84 C108 70 114 60 110 48 M118 84 C120 74 116 66 120 56" stroke="url(#kgpAlga)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M96 42 L118 26 C114 36 114 48 118 58Z" fill="url(#kgpFin)" stroke="#8A5A10" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M100 42 L114 32 M100 42 L114 52" stroke="#FFF0B0" stroke-width="1" opacity=".7"/>
  <path d="M60 26 L70 12 L80 24Z M64 58 L70 68 L78 57Z M36 56 L40 66 L48 58Z" fill="url(#kgpFin)" stroke="#8A5A10" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M12 42 C20 26 50 20 76 24 C88 26 96 34 98 42 C96 50 88 58 76 60 C50 64 20 58 12 42Z" fill="url(#kgpCorpo)" stroke="#4A4A26" stroke-width="2"/>
  <g fill="#2A2A1E" opacity=".78"><ellipse cx="46" cy="42" rx="5.4" ry="4.8"/><ellipse cx="64" cy="41" rx="5.4" ry="4.8"/><ellipse cx="82" cy="42" rx="4.4" ry="4.2"/></g>
  <path d="M22 34 C40 26 64 26 86 32" stroke="#FFFFF4" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M30 48 C46 52 66 52 86 48" stroke="#C8C49A" stroke-width="1" fill="none" opacity=".7"/>
  <path d="M30 30 C28 36 28 46 30 52" stroke="#6E6E3E" stroke-width="1.2" fill="none"/>
  <circle cx="22" cy="38" r="5.4" fill="#fff" stroke="#3A3A1E" stroke-width="1"/><circle cx="21.4" cy="38.4" r="3.2" fill="#12121A"/><circle cx="20.2" cy="37" r="1.3" fill="#fff"/><circle cx="22.4" cy="39.8" r=".5" fill="#fff"/>
  <path d="M12 43 C14 46 17 46 19 44" stroke="#4A4A26" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="26" cy="47" rx="3.4" ry="1.7" fill="#FF9A8A" opacity=".5"/>
  <circle cx="8" cy="24" r="2.4" fill="none" stroke="#E6F6FF" stroke-width="1.2"/><circle cx="14" cy="14" r="1.6" fill="none" stroke="#E6F6FF" stroke-width="1"/>
</symbol>''')

# ---------- ingá ----------
def _vagem(x, y, a, L, aberta=False):
    s = (f'<g transform="translate({x} {y}) rotate({a})"><path d="M0 0 C-6 {L * .3:.1f} -4 {L * .7:.1f} 2 {L:.1f} C5 {L + 5:.1f} 10 {L + 4:.1f} 10 {L - 2:.1f} C8 {L * .65:.1f} 8 {L * .3:.1f} 6 0Z" fill="url(#kgiVag)" stroke="#4E6A1A" stroke-width="1.3"/>'
         f'<path d="M3 4 C2 {L * .4:.1f} 3 {L * .7:.1f} 6 {L - 3:.1f}" stroke="#F0F8B0" stroke-width="1.3" fill="none" opacity=".8"/>'
         + ''.join(f'<path d="M0 {L * t:.1f} q4 1 8 0" stroke="#6E8A2A" stroke-width=".8" fill="none"/>' for t in (.2, .38, .56, .74, .9)) + '</g>')
    return s
S.append(f'''<symbol id="f-inga" viewBox="0 0 110 110">
  <defs>{lg('kgiVag', '#D8EC7A', '#7A9A2E', 1, 1)}{lg('kgiFolha', '#7CCB5A', '#2E7A32', 1, 1)}{lg('kgiGalho', '#A89A84', '#5E5444')}{rg('kgiPolpa', '#FFFFFF', '#F4F2E8', '#D8D4C4', .4, .35)}</defs>
  <ellipse cx="56" cy="105" rx="38" ry="3.4" fill="#0A1440" opacity=".16"/>
  <g transform="translate(0 6)"><path d="M2 14 C30 12 60 16 106 10" stroke="#3E3428" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M2 14 C30 12 60 16 106 10" stroke="url(#kgiGalho)" stroke-width="4.2" fill="none" stroke-linecap="round"/>
  {''.join(f'<path d="M{x} {y} C{x + 8} {y - 10} {x + 22} {y - 10} {x + 26} {y - 2} C{x + 18} {y + 4} {x + 8} {y + 4} {x} {y}Z" fill="url(#kgiFolha)" stroke="#1E5A22" stroke-width="1" transform="rotate({a} {x} {y})"/><path d="M{x + 2} {y} L{x + 24} {y - 3}" stroke="#B8E890" stroke-width=".8" transform="rotate({a} {x} {y})"/>' for x, y, a in [(6, 14, -30), (20, 13, -50), (70, 14, -40), (84, 12, -20), (88, 11, 20), (8, 15, 30), (60, 15, 160)])}
  {_vagem(30, 15, 8, 58)}{_vagem(46, 16, -4, 70)}{_vagem(62, 15, -14, 52)}
  <g transform="translate(76 70) rotate(-24)">
    <path d="M-12 0 C-14 -8 14 -10 16 0 C14 10 -14 8 -12 0Z" fill="url(#kgiVag)" stroke="#4E6A1A" stroke-width="1.2"/>
    <path d="M-10 0 C-10 -5 12 -6 14 0 C12 5 -10 5 -10 0Z" fill="url(#kgiPolpa)" stroke="#C8C4B0" stroke-width=".8"/>
    <g fill="#3A2A1A">{''.join(f'<ellipse cx="{x}" cy="0" rx="2.4" ry="1.6"/>' for x in (-6, 0, 6, 11))}</g>
    <path d="M-8 -2.6 q8 -2 18 -1" stroke="#fff" stroke-width="1.2" fill="none"/>
  </g></g>
</symbol>''')

# ---------- cesto kaingang ----------
trama = ''.join(f'<path d="M{24 + i * 6} 40 L{20 + i * 6} 92" stroke="#8A5A22" stroke-width=".9" opacity=".55"/>' for i in range(14))
fios = ''.join(f'<path d="M{22 - j * .4:.1f} {44 + j * 6} C40 {47 + j * 6} 80 {47 + j * 6} {98 + j * .4:.1f} {44 + j * 6}" stroke="#FFF0C8" stroke-width="1" fill="none" opacity=".45" stroke-dasharray="3 3"/>' for j in range(8))
S.append(f'''<symbol id="f-cestokaingang" viewBox="0 0 120 100">
  <defs>{lg('kgcP', '#F6DA9A', '#B8843E', 1, 0)}{lg('kgcB', '#A8482A', '#6A2A14')}{lg('kgcE', '#3A3A2A', '#1E1E14')}{lg('kgcChao', '#D8C08A', '#A8885A')}<clipPath id="kgcClip"><path d="M22 40 C18 60 24 82 30 92 H90 C96 82 102 60 98 40Z"/></clipPath></defs>
  <ellipse cx="60" cy="95" rx="44" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M10 96 C24 88 96 88 110 96Z" fill="url(#kgcChao)" stroke="#7A5A30" stroke-width="1.2"/>
  <path d="M22 40 C18 60 24 82 30 92 H90 C96 82 102 60 98 40Z" fill="url(#kgcP)" stroke="#6A4418" stroke-width="2"/>
  <g clip-path="url(#kgcClip)">{trama}{fios}</g>
  <path d="M21 52 C40 56 80 56 99 52 L98.4 60 C80 64 40 64 21.6 60Z" fill="url(#kgcB)" stroke="#4A1E0A" stroke-width="1"/>
  <path d="M24 70 C40 73 80 73 96 70 L95 76 C80 79 40 79 25 76Z" fill="url(#kgcE)" opacity=".85"/>
  <g fill="#F6DA9A" opacity=".85">{''.join(f'<path d="M{28 + i * 9} 56 l3 -2.4 l3 2.4 l-3 2.4Z"/>' for i in range(8))}</g>
  <ellipse cx="60" cy="40" rx="38" ry="8" fill="#9A6A2A" stroke="#6A4418" stroke-width="1.8"/>
  <ellipse cx="60" cy="40" rx="33" ry="5.4" fill="#4A2E12"/>
  <path d="M24 40 C26 14 94 14 96 40" stroke="#6A4418" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M24 40 C26 14 94 14 96 40" stroke="#E8C080" stroke-width="2.8" fill="none" stroke-dasharray="4 2" stroke-linecap="round"/>
  <path d="M28 46 C26 60 30 76 34 86" stroke="#FFF6D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
  <g transform="translate(46 36)"><path d="M0 0 C-2 -6 0 -12 4 -14" stroke="#3E6A22" stroke-width="1.6" fill="none"/><path d="M2 -8 c-6 -2 -8 -6 -8 -9 c4 0 7 3 8 9Z M3 -11 c5 -2 8 -5 8 -8 c-4 0 -7 3 -8 8Z" fill="#7CC84A" stroke="#2E6A22" stroke-width=".8"/></g>
  <g fill="#C8281E" stroke="#5A0E08" stroke-width=".5"><circle cx="70" cy="36" r="2.4"/><circle cx="75" cy="37" r="2.4"/><circle cx="72" cy="33" r="2.4"/></g><g fill="#2A1A10"><circle cx="66" cy="35" r="1.8"/><circle cx="79" cy="35" r="1.8"/></g>
</symbol>''')

# ---------- capa: o morro, a voçoroca que sarou e o rio vivo ----------
cap_fil = ''.join(f'<path d="M{x} {y} c-2 -1 -3 -3 -3 -5 c2 0 3 2 3 5Z M{x} {y} c2 -1 3 -3 3 -5 c-2 0 -3 2 -3 5Z" fill="#5EAA3A"/>' for yy in (56, 64) for x, y in [(xx, yy + (xx - 85) ** 2 * .0012) for xx in range(46, 128, 6)] if abs(x - 86) > 6)
cap_arv = ''.join(f'<g><path d="M{x} 78 V{78 - h * .5}" stroke="#4A3020" stroke-width="1.4"/><path d="{copa(x, 78 - h * .7, h * .36, h * .28, 8, .3)}" fill="{c}" stroke="#1E4A2A" stroke-width=".7"/></g>' for x, h, c in [(40, 26, '#2E7A5A'), (58, 22, '#D05AAE'), (114, 24, '#4E9A44'), (134, 28, '#2E7A5A')])
S.append(f'''<symbol id="capa-kaingang" viewBox="0 0 170 110">
  <defs>{ceu('cpKgC', '#6FBCEC', '#FFF0D8')}{ceu('cpKgM', '#EDB878', '#C77840')}{ceu('cpKgR', '#7CC6D4', '#1E6A86')}{ceu('cpKgF', '#8AA84A', '#4A5E26')}{ceu('cpKgL', '#A8C6CC', '#8EB49C')}</defs>
  <rect width="170" height="110" fill="url(#cpKgC)"/>
  <circle cx="146" cy="16" r="9" fill="#FFE27A" opacity=".4"/><circle cx="146" cy="16" r="5.6" fill="#FFC83D" stroke="#F0A81E" stroke-width=".8"/>
  <use href="#nuvem" x="20" y="6" width="36" height="18" style="color:#fff" opacity=".9"/>
  <path d="M0 40 C30 34 60 36 90 36 C120 32 150 34 170 36 V50 H0Z" fill="url(#cpKgL)"/>
  <g opacity=".8"><rect x="126" y="30" width="6" height="8" fill="#C4D0D8"/><rect x="134" y="27" width="5" height="11" fill="#B4C0CA"/><rect x="141" y="31" width="7" height="7" fill="#C4D0D8"/><path d="M152 38 V24 l2 -3 l2 3 V38Z" fill="#D4DCE4"/></g>
  <path d="M0 46 C30 40 60 41 90 43 C120 40 150 42 170 44 V82 H0Z" fill="url(#cpKgM)" stroke="#8A4A22" stroke-width=".6"/>
  <g><rect x="48" y="38" width="10" height="5" fill="#F2E2C8"/><path d="M47 38.4 L53 34.6 L59 38.4Z" fill="#C8553A"/><rect x="62" y="37" width="16" height="6" fill="#FFF0D8"/><path d="M61 37.4 L64 34 H76 L79 37.4Z" fill="#C8553A"/><path d="M62 41.6 h16" stroke="#3FA864" stroke-width="1"/><path d="{copa(40, 37, 5, 4, 7, .3)}" fill="#2E7A5A"/><path d="{copa(84, 38, 4, 3.4, 7, .3)}" fill="#2E7A5A"/></g>
  <path d="M104 44 V36 M104 40 l-3 -3 M104 39 l3 -3" stroke="#4A3428" stroke-width="1"/><path d="{copa(104, 34, 7, 4.4, 8, .3)}" fill="#FFD02A" stroke="#B07A08" stroke-width=".6"/>
  <path d="M86 45 C83 56 80 68 76 80 H98 C93 68 90 56 88 45Z" fill="#B8602E" stroke="#6A2E12" stroke-width=".7"/><path d="M86.4 47 C84.6 56 82.6 68 79.6 80 H94.4 C91 68 89 56 87.6 47Z" fill="#6EB84A" stroke="#2E6A2A" stroke-width=".6"/>
  <path d="M84 60 h6 M83 70 h8" stroke="#E8E07A" stroke-width="1.4"/>
  {cap_fil}
  {cap_arv}
  <path d="M0 80 C40 78 100 82 170 78 V110 H0Z" fill="url(#cpKgR)"/>
  <path d="M8 86 q4 -2 8 0 M60 90 q4 -2 8 0 M120 86 q4 -2 8 0 M140 96 q4 -2 8 0" stroke="#E6F6FF" stroke-width=".9" fill="none"/>
  <g fill="#F2C23A">{''.join(f'<path d="M{x} {y} l-3 -1.6 v3.2Z"/>' for x, y in [(100, 94), (108, 97), (104, 100), (112, 93)])}</g><g fill="#E6EEF0" stroke="#4A5A6A" stroke-width=".3">{''.join(f'<ellipse cx="{x + 3.4}" cy="{y}" rx="3.4" ry="1.4"/>' for x, y in [(100, 94), (108, 97), (104, 100), (112, 93)])}</g>
  <path d="M0 92 C20 92 44 98 62 110 H0Z" fill="url(#cpKgF)"/>
  <svg x="2" y="56" width="40" height="34" viewBox="0 0 120 100"><use class="sem" href="#f-gralhapicaca"/></svg>
  <svg x="40" y="84" width="22" height="20" viewBox="0 0 120 100"><use class="sem" href="#f-cestokaingang"/></svg>
  <svg x="124" y="88" width="30" height="21" viewBox="0 0 130 90"><use class="sem" href="#f-piapara"/></svg>
</symbol>''')
