# figurinhas e capa dos Lagos do pirarucu (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(523)

def _pira_corpo(gc, gs, gr, gb, esc='#2E3226'):
    # pirarucu de lado, cabeça para a direita, centro em 0,0, ~180 de comprimento
    esc_s = ''
    for x in range(-60, 36, 9):
        for r, y in enumerate([-9, -2, 5]):
            lim = 8 if x < -40 else 13
            if abs(y + 1) > lim: continue
            cor = '#FF6A48' if x < -34 else '#E87A54' if x < -12 else '#B8866A' if x < 8 else '#8C8E74'
            op = .9 if x < -12 else .55
            esc_s += f'<path d="M{x + (r % 2) * 4.5:.1f} {y - 3.4} c3.2 1.2 3.6 5.6 0 7" stroke="{cor}" stroke-width="1.2" fill="none" opacity="{op}"/>'
    corpo = 'M76 -1 C72 -9 62 -14 47 -16 C26 -19 2 -18 -24 -15 C-44 -13 -58 -9 -68 -5 L-68 5 C-58 9 -44 13 -24 15 C2 18 30 17 48 13 C61 10 70 6 76 2Z'
    return (f'<path d="M-22 -14 C-30 -30 -52 -28 -64 -8 L-50 -10Z" fill="url(#{gb})" stroke="#5A1E14" stroke-width="1.3" stroke-linejoin="round"/>'
            f'<path d="M-22 14 C-30 30 -52 28 -64 8 L-50 10Z" fill="url(#{gb})" stroke="#5A1E14" stroke-width="1.3" stroke-linejoin="round"/>'
            f'<path d="M-30 -22 C-40 -24 -50 -20 -58 -10 M-30 22 C-40 24 -50 20 -58 10" stroke="#FFB08A" stroke-width="1" fill="none" opacity=".6"/>'
            f'<path d="M-66 -6 C-78 -20 -94 -22 -100 -11 C-103 -3 -103 3 -100 11 C-94 22 -78 20 -66 6Z" fill="url(#{gr})" stroke="#6A1A12" stroke-width="1.5" stroke-linejoin="round"/>'
            f'<path d="M-72 -8 C-84 -16 -94 -14 -98 -6 M-72 8 C-84 16 -94 14 -98 6 M-74 0 H-98" stroke="#8A2416" stroke-width="1" fill="none" opacity=".7"/>'
            f'<path d="M-80 -14 C-88 -16 -94 -14 -97 -9" stroke="#FFC0A0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>'
            f'<path d="{corpo}" fill="url(#{gc})" stroke="{esc}" stroke-width="1.7"/><path d="{corpo}" fill="url(#{gs})"/>{esc_s}'
            f'<path d="M60 -11 C34 -15 -6 -14 -52 -6" stroke="#E8F0D8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>'
            f'<path d="M44 12 C20 15 -10 14 -40 10" stroke="#F4ECCC" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".5"/>'
            f'<path d="M41 -15 C34 -6 34 6 40 13.4" stroke="{esc}" stroke-width="1.3" fill="none"/><path d="M43 -12 C38 -5 38 4 42 10" stroke="#C8D0B4" stroke-width=".9" fill="none" opacity=".55"/>'
            f'<g stroke="#3E4434" stroke-width=".8" fill="none" opacity=".55"><path d="M50 -12 q4 1.6 8 0 M54 -8 q3 1.4 6 0 M47 -6 q3 1.4 6 0"/></g>'
            f'<path d="M38 8 C30 14 22 18 15 16 C21 12 27 8 35 6Z" fill="url(#{gb})" stroke="#5A2A1A" stroke-width="1"/>'
            f'<path d="M76 -1 Q67 3.6 55 2" stroke="#2E1E14" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
            f'<ellipse cx="57" cy="-6.4" rx="5.4" ry="5.6" fill="#E8C24A" stroke="#3E3420" stroke-width="1"/><ellipse cx="57.6" cy="-6.2" rx="3.6" ry="3.9" fill="#14120E"/><circle cx="58.8" cy="-7.8" r="1.4" fill="#fff"/><circle cx="56.4" cy="-4.6" r=".6" fill="#fff"/>'
            f'<ellipse cx="62" cy="3" rx="4" ry="2" fill="#FF8A6A" opacity=".4"/>')

_pira_grads = lambda p: (f'<linearGradient id="{p}C" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D8462E"/><stop offset=".26" stop-color="#C05E44"/><stop offset=".5" stop-color="#8A7A60"/><stop offset=".75" stop-color="#6E765E"/><stop offset="1" stop-color="#5E6A56"/></linearGradient>'
                         f'<linearGradient id="{p}S" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2418" stop-opacity=".5"/><stop offset=".45" stop-color="#1E2418" stop-opacity="0"/><stop offset=".7" stop-color="#FFF8E0" stop-opacity=".1"/><stop offset="1" stop-color="#FFF8E0" stop-opacity=".45"/></linearGradient>'
                         f'<linearGradient id="{p}R" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#C8381E"/><stop offset=".6" stop-color="#E8502E"/><stop offset="1" stop-color="#FF8A4A"/></linearGradient>'
                         f'<linearGradient id="{p}B" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A83A24"/><stop offset="1" stop-color="#6A2618"/></linearGradient>')

# ---------- pirarucu ----------
S.append(f'''<symbol id="f-arapaima" viewBox="0 0 150 90">
  <defs>{_pira_grads('pifA')}{lg('pifAg', '#8ED0C0', '#3E8A7A')}{lg('pifAf', '#B8A070', '#6E5A3A')}</defs>
  <ellipse cx="75" cy="86" rx="64" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M6 86 C14 78 40 76 75 77 C110 76 136 78 144 86Z" fill="url(#pifAf)" stroke="#3E3220" stroke-width="1.3"/>
  <g fill="#C8B488" stroke="#6E5A3A" stroke-width=".7"><ellipse cx="22" cy="82" rx="5" ry="2.4"/><ellipse cx="124" cy="81" rx="6" ry="2.8"/><ellipse cx="110" cy="84" rx="3.2" ry="1.6"/></g>
  <path d="M132 82 C128 66 136 56 130 44 M138 82 C140 70 136 62 140 52" stroke="#1E5A36" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M132 82 C128 66 136 56 130 44 M138 82 C140 70 136 62 140 52" stroke="#7CCB7A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M4 20 C40 14 110 14 146 20" stroke="#BFE6F4" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M20 26 q6 -2 12 0 M60 24 q6 -2 12 0 M104 25 q6 -2 12 0" stroke="#9FD8EC" stroke-width="1.4" fill="none"/>
  <g transform="translate(80 50) scale(.72) rotate(-8)">{_pira_corpo('pifAC', 'pifAS', 'pifAR', 'pifAB')}</g>
  <g fill="none" stroke="#7FC8E8" stroke-width="1.2"><circle cx="134" cy="22" r="3"/><circle cx="140" cy="12" r="2"/><circle cx="130" cy="6" r="1.4"/></g>
</symbol>''')

# ---------- peixe-boi-da-amazônia (Nonô) ----------
S.append(f'''<symbol id="f-peixeboi" viewBox="0 0 150 100">
  <defs>{lg('pifPc', '#9A9EB0', '#5E6274')}{rg('pifPf', '#BCC0CE', '#8E92A4', '#6A6E80', .45, .35)}{lg('pifPn', '#7E8294', '#4E5262')}{rg('pifPm', '#FFF0F6', '#FFD2E2', '#F0B0C8', .5, .5)}{lg('pifPchao', '#8A7A5A', '#4E4230')}{lg('pifPcap', '#A8D45A', '#4E8A2E')}</defs>
  <ellipse cx="75" cy="95" rx="62" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M4 97 C12 88 40 86 75 87 C110 86 138 88 146 97Z" fill="url(#pifPchao)" stroke="#3A2E1E" stroke-width="1.3"/>
  <g stroke="#2E5A1E" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M92 90 C90 76 96 66 94 52 M100 90 C102 78 98 70 104 60 M84 90 C80 80 84 72 80 64"/></g>
  <g stroke="url(#pifPcap)" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M92 90 C90 76 96 66 94 52 M100 90 C102 78 98 70 104 60 M84 90 C80 80 84 72 80 64"/></g>
  <g transform="translate(80 54) scale(.84)">
    <path d="M-52 -2 C-68 -14 -86 -12 -90 0 C-86 12 -68 14 -52 4Z" fill="url(#pifPc)" stroke="#3A3A48" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M-60 -6 C-72 -10 -82 -8 -86 -2" stroke="#D8DCE8" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-54 -4 C-50 -24 -16 -32 14 -28 C38 -25 56 -16 60 -2 C62 12 46 22 18 24 C-14 26 -46 18 -54 -4Z" fill="url(#pifPc)" stroke="#3A3A48" stroke-width="1.8"/>
    <path d="M6 10 C14 6 24 8 26 16 C22 22 12 22 6 18Z" fill="url(#pifPm)" stroke="#B88A9A" stroke-width=".9"/>
    <path d="M-36 -18 C-14 -28 20 -28 44 -18" stroke="#EEF0F6" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".65"/>
    <g fill="#4E5262" opacity=".3"><circle cx="-20" cy="-8" r="1.2"/><circle cx="-6" cy="-14" r="1"/><circle cx="12" cy="-10" r="1.3"/><circle cx="-32" cy="2" r="1"/></g>
    <path d="M28 12 C24 22 18 32 10 34 C6 34 6 30 10 26 C16 20 20 14 24 10Z" fill="url(#pifPn)" stroke="#3A3A48" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M50 -14 C64 -16 76 -10 78 0 C80 10 72 16 60 16 C54 16 50 12 50 8Z" fill="url(#pifPf)" stroke="#3A3A48" stroke-width="1.6"/>
    <ellipse cx="72" cy="2" rx="7.6" ry="8.6" fill="url(#pifPf)" stroke="#3A3A48" stroke-width="1.4"/>
    <g fill="#3A3A48"><circle cx="70" cy="-3" r=".8"/><circle cx="74" cy="-1" r=".8"/><circle cx="72" cy="4" r=".8"/><circle cx="76" cy="3" r=".8"/><circle cx="68" cy="6" r=".8"/></g>
    <path d="M66 10 C70 14 76 13 78 8" stroke="#5A3A44" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="54.6" cy="-5" rx="3.6" ry="4" fill="#1A1420"/><circle cx="55.8" cy="-6.4" r="1.4" fill="#fff"/><circle cx="53.8" cy="-3.6" r=".55" fill="#fff"/>
    <path d="M50 -10.6 q4.6 -2.8 9.4 -.4" stroke="#3A3A48" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <ellipse cx="61" cy="6" rx="4.4" ry="2.4" fill="#FF8AA8" opacity=".55"/>
    <path d="M54 -12.6 C60 -15.6 68 -14.6 72 -10.6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  </g>
  <g fill="none" stroke="#7FC8E8" stroke-width="1.2"><circle cx="140" cy="26" r="2.6"/><circle cx="136" cy="16" r="1.8"/><circle cx="142" cy="8" r="1.2"/></g>
</symbol>''')

# ---------- ariranha ----------
S.append(f'''<symbol id="f-ariranha" viewBox="0 0 110 120">
  <defs>{lg('pifRc', '#9A6A40', '#5A361C')}{rg('pifRh', '#B07E54', '#8A5A34', '#6A4224', .42, .32)}{lg('pifRg', '#FFF6E6', '#E8D4B0')}{lg('pifRt', '#A8845E', '#5A3E24')}{lg('pifRa', '#8ED0C0', '#3E8A7A')}</defs>
  <ellipse cx="55" cy="114" rx="46" ry="4.4" fill="url(#pifRa)" stroke="#2A6A5A" stroke-width="1"/>
  {ondas(14, 98, 114, '#E6FFF6')}
  <rect x="12" y="96" width="86" height="16" rx="8" fill="url(#pifRt)" stroke="#2E1E10" stroke-width="1.4"/><ellipse cx="96" cy="104" rx="4" ry="8" fill="#D8B48A" stroke="#2E1E10" stroke-width="1.1"/><ellipse cx="96" cy="104" rx="2" ry="4" fill="none" stroke="#8A6440" stroke-width=".8"/>
  <path d="M20 100 H84" stroke="#C8A27A" stroke-width="1.4" opacity=".6"/>
  <path d="M40 100 C26 100 14 94 8 84 C18 88 28 90 42 92Z" fill="url(#pifRc)" stroke="#2A1608" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M38 100 C34 76 40 52 55 46 C70 52 76 76 72 100Z" fill="url(#pifRc)" stroke="#2A1608" stroke-width="1.7"/>
  <path d="M47 56 C42 66 46 78 54 76 C63 74 64 64 60 56 C57 60 51 60 47 56Z" fill="url(#pifRg)" stroke="#B8A080" stroke-width=".8"/>
  <path d="M42 96 C38 102 44 104 48 101 M68 96 C72 102 66 104 62 101" stroke="#2A1608" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <path d="M42 88 C40 80 42 74 44 70" stroke="#C8946A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
  <ellipse cx="55" cy="36" rx="17" ry="14" fill="url(#pifRh)" stroke="#2A1608" stroke-width="1.7"/>
  <circle cx="41" cy="26" r="4" fill="#6A4224" stroke="#2A1608" stroke-width="1.2"/><circle cx="69" cy="26" r="4" fill="#6A4224" stroke="#2A1608" stroke-width="1.2"/><circle cx="41" cy="26" r="1.8" fill="#3A2210"/><circle cx="69" cy="26" r="1.8" fill="#3A2210"/>
  <ellipse cx="55" cy="43" rx="9" ry="6.4" fill="#B08058" stroke="#2A1608" stroke-width="1"/><ellipse cx="55" cy="39.4" rx="3.6" ry="2.4" fill="#1A0E08"/><circle cx="54" cy="38.6" r=".8" fill="#fff" opacity=".7"/>
  <path d="M55 41.6 v2.4 M51 45 q4 3 8 0" stroke="#1A0E08" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <g stroke="#FFF4E6" stroke-width=".8" opacity=".85"><path d="M47 42 l-13 -2 M47 44 l-13 2 M63 42 l13 -2 M63 44 l13 2"/></g>
  <ellipse cx="47.4" cy="32" rx="3" ry="3.4" fill="#14100C"/><ellipse cx="62.6" cy="32" rx="3" ry="3.4" fill="#14100C"/><circle cx="48.4" cy="30.8" r="1.2" fill="#fff"/><circle cx="63.6" cy="30.8" r="1.2" fill="#fff"/>
  <ellipse cx="43" cy="40" rx="3" ry="1.6" fill="#FF8A8A" opacity=".45"/><ellipse cx="67" cy="40" rx="3" ry="1.6" fill="#FF8A8A" opacity=".45"/>
  <path d="M45 25 q10 -6 20 0" stroke="#D8AA80" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>
  <g fill="none" stroke="#7FC8E8" stroke-width="1.2"><circle cx="94" cy="80" r="2.4"/><circle cx="100" cy="70" r="1.6"/></g>
</symbol>''')

# ---------- uacari-branco ----------
S.append(f'''<symbol id="f-uacari" viewBox="0 0 110 120">
  <defs>{rg('pifUc', '#FFFFFF', '#F2EDE2', '#D8CDB8', .4, .32)}{rg('pifUr', '#FF7A66', '#E8483A', '#C02820', .4, .32)}{lg('pifUg', '#8A6A4E', '#4E3A2A')}{rg('pifUf', '#8ED06A', '#4E9A3A', '#2E6A2A', .4, .35)}</defs>
  <ellipse cx="55" cy="116" rx="40" ry="3.4" fill="#0A1440" opacity=".16"/>
  <path d="{copa(20, 22, 22, 16, 10, .3)}" fill="url(#pifUf)" stroke="#1E5A22" stroke-width="1.2"/><path d="{copa(94, 18, 20, 14, 10, .3)}" fill="url(#pifUf)" stroke="#1E5A22" stroke-width="1.2"/>
  <path d="M0 92 C30 86 70 86 110 80" stroke="#3A2A1C" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 92 C30 86 70 86 110 80" stroke="url(#pifUg)" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M6 89 C30 84 64 84 100 79" stroke="#B8987A" stroke-width="1.6" fill="none" opacity=".6"/>
  <path d="M84 82 C90 76 96 76 102 70" stroke="#3A2A1C" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M98 70 c4 -6 10 -4 10 2 c-5 2 -9 1 -10 -2Z" fill="#6EB84E" stroke="#2E6A1E" stroke-width=".8"/>
  <path d="M64 88 C70 98 68 108 62 114" stroke="#C8BCA4" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M64 88 C70 98 68 108 62 114" stroke="#FAF6EC" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <path d="{copa(55, 70, 20, 20, 14, .3)}" fill="url(#pifUc)" stroke="#A89A84" stroke-width="1.5"/>
  <g stroke="#DCD2C0" stroke-width="1.2" fill="none" opacity=".9"><path d="M42 62 q-4 6 -4 12 M68 62 q4 6 4 12 M48 78 q2 4 0 8 M62 78 q-2 4 0 8"/></g>
  <path d="M40 80 C36 88 40 92 46 90 M70 80 C74 88 70 92 64 90" stroke="#A89A84" stroke-width="6.4" stroke-linecap="round" fill="none"/><path d="M40 80 C36 88 40 92 46 90 M70 80 C74 88 70 92 64 90" stroke="#F6F2E8" stroke-width="4.2" stroke-linecap="round" fill="none"/>
  <path d="M46 90 l3 2 M64 90 l-3 2" stroke="#3A2A1C" stroke-width="1.6" stroke-linecap="round"/>
  <path d="{copa(55, 44, 18, 16, 12, .36)}" fill="url(#pifUc)" stroke="#A89A84" stroke-width="1.4"/>
  <ellipse cx="55" cy="45" rx="11.4" ry="12.6" fill="url(#pifUr)" stroke="#8A1E1A" stroke-width="1.4"/>
  <circle cx="43.6" cy="44" r="3.2" fill="#E8483A" stroke="#8A1E1A" stroke-width="1"/><circle cx="66.4" cy="44" r="3.2" fill="#E8483A" stroke="#8A1E1A" stroke-width="1"/>
  <ellipse cx="50.4" cy="43" rx="2.8" ry="3" fill="#F0A040" stroke="#7A3A10" stroke-width=".6"/><ellipse cx="59.6" cy="43" rx="2.8" ry="3" fill="#F0A040" stroke="#7A3A10" stroke-width=".6"/>
  <circle cx="50.6" cy="43.2" r="1.7" fill="#14100C"/><circle cx="59.8" cy="43.2" r="1.7" fill="#14100C"/><circle cx="51.3" cy="42.4" r=".7" fill="#fff"/><circle cx="60.5" cy="42.4" r=".7" fill="#fff"/>
  <path d="M53.4 49 h3.2" stroke="#8A1E1A" stroke-width="1.1" stroke-linecap="round"/><path d="M50.6 52.6 q4.4 3 8.8 0" stroke="#8A1E1A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M48 36 q7 -3.4 14 0" stroke="#FFB8A8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M44 30 q-2 -4 0 -7 M66 30 q2 -4 0 -7 M55 28 v-5" stroke="#E8E0D0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# ---------- capa: lago de várzea com casa flutuante, canoa e pirarucu boiando ----------
_cap_arv = ''.join(f'<path d="M{x} 54 V{50 - h}" stroke="#5A4A3A" stroke-width="1"/><path d="{copa(x, 48 - h, r, r * .7, 8, .3)}" fill="{c}" stroke="{e}" stroke-width=".6"/>' for x, h, r, c, e in
                   [(4, 2, 8, '#5E9A5A', '#3E7A44'), (16, 6, 9, '#7AA84A', '#4E7A2E'), (30, 3, 8, '#4E8A7A', '#2E6A5A'), (44, 8, 10, '#9AB070', '#6A8A4A'), (60, 2, 7, '#A8BCA0', '#7A9478'),
                    (74, 5, 9, '#6E8E3E', '#4A6A26'), (90, 3, 8, '#5A9A8A', '#3A7A6A'), (104, 7, 9, '#7AA84A', '#4E7A2E'), (118, 2, 8, '#5E9A5A', '#3E7A44'), (132, 6, 10, '#9AB070', '#6A8A4A'),
                    (148, 3, 8, '#4E8A7A', '#2E6A5A'), (162, 5, 9, '#6E8E3E', '#4A6A26')])
S.append(f'''<symbol id="capa-pirarucu" viewBox="0 0 170 110">
  <defs>{ceu('cpPiC', '#5EB2E8', '#FFE8C8')}{ceu('cpPiS', '#8EC0B0', '#4E8E80')}{ceu('cpPiA', '#5E9A86', '#1E4A44')}{ceu('cpPiP', '#4EC0B4', '#2E9A90')}{ceu('cpPiT', '#D8E2EE', '#9AAABE')}{ceu('cpPiV', '#3EA87A', '#1E6A4A')}{_pira_grads('cpPiF')}{ceu('cpPiM', '#A8925E', '#5A4A30')}</defs>
  <rect width="170" height="110" fill="url(#cpPiC)"/>
  <circle cx="24" cy="16" r="10" fill="#FFE27A" opacity=".35"/><circle cx="24" cy="16" r="6" fill="#FFC83D" stroke="#F0A81E" stroke-width=".8"/>
  <use href="#nuvem" x="96" y="6" width="38" height="18" style="color:#fff" opacity=".9"/>
  <path d="{copa(85, 46, 95, 8, 20, .4)}" fill="#A8C8B8" opacity=".85"/>
  {_cap_arv}
  <rect y="54" width="170" height="4" fill="#8A6A44"/>
  <rect y="56" width="170" height="16" fill="url(#cpPiS)"/>
  <path d="M0 58 H170" stroke="#3E6E4A" stroke-width="2" opacity=".35"/>
  <rect y="72" width="170" height="38" fill="url(#cpPiA)"/>
  <rect y="100" width="170" height="10" fill="url(#cpPiM)"/>
  <g transform="translate(92 86) scale(.36) rotate(-20)">{_pira_corpo('cpPiFC', 'cpPiFS', 'cpPiFR', 'cpPiFB')}</g>
  <g fill="none" stroke="#F4FFF8" stroke-width=".9"><ellipse cx="116" cy="72.6" rx="9" ry="2"/><ellipse cx="116" cy="72.6" rx="15" ry="3.2" opacity=".6"/></g>
  <g transform="translate(0 0)">
    <rect x="0" y="69" width="66" height="5" rx="2.5" fill="#7A5A3A" stroke="#2E1E10" stroke-width=".6"/>
    <rect x="2" y="65" width="62" height="4" fill="#A8784C" stroke="#3A2414" stroke-width=".5"/>
    <rect x="4" y="38" width="38" height="27" fill="url(#cpPiP)" stroke="#145A58" stroke-width=".8"/>
    <rect x="11" y="44" width="9" height="9" fill="#2A3A4A" stroke="#fff" stroke-width="1"/><path d="M8 44 v9 l3 -1 v-7Z M23 44 v9 l-3 -1 v-7Z" fill="#FFC83D"/>
    <rect x="28" y="48" width="8" height="17" fill="#C8763A" stroke="#6E3A14" stroke-width=".6"/>
    <path d="M0 39 L8 27 H38 L46 39Z" fill="url(#cpPiT)" stroke="#4A5A6E" stroke-width=".8"/>
    <path d="M20 35 L24 29 H34 L36 35Z" fill="#1E3A8A" stroke="#E6EEF6" stroke-width=".5"/>
    <path d="M40 42 L64 46 V65" stroke="#7A5232" stroke-width="1.2" fill="none"/><path d="M42 50 C48 58 58 58 62 50" fill="#E8406A" stroke="#8A2A4A" stroke-width=".5"/>
    <circle cx="52" cy="52" r="2.6" fill="#B8805A"/><path d="M50 51 a2.6 2.6 0 0 1 4.4 -1.6" fill="#E2E2EA"/>
  </g>
  <g transform="translate(118 70)">
    <path d="M-26 -6 C-22 -2 26 -2 34 -6 C34 0 30 3 24 3 H-18 C-22 3 -25 0 -26 -6Z" fill="url(#cpPiV)" stroke="#123A2A" stroke-width=".8"/>
    <path d="M-24 -4 C-14 -1 22 -1 33 -4" stroke="#F4F0E0" stroke-width="1.2" fill="none"/>
    <path d="M32 -10 L40 4" stroke="#4A4E58" stroke-width="1.2"/><rect x="28" y="-14" width="7" height="6" rx="1.4" fill="#4A4E58"/>
    <path d="M-6 -4 v-8 h8 v8Z" fill="#F2784A"/><circle cx="-2" cy="-15" r="3.4" fill="#A8704A" stroke="#4E2A14" stroke-width=".4"/><path d="M-5.4 -16 h7 C1.6 -19.6 -5.4 -19.6 -5.4 -16Z" fill="#2E8A8A"/><rect x="1" y="-11" width="4" height="5" fill="#FFFDF4" stroke="#7A5A3A" stroke-width=".4"/>
    <path d="M17 -4 v-11 h7 v11Z" fill="#2E9A5A"/><path d="M17 -14 h7 v6 h-7Z" fill="#FFA03A"/><circle cx="20.5" cy="-18" r="3.4" fill="#7A4A2E" stroke="#3A1E0E" stroke-width=".4"/><path d="M17 -19 h7 C24 -22.6 17 -22.6 17 -19Z" fill="#E03A22"/><path d="M17 -13 l-8 -6" stroke="#7A4A2E" stroke-width="1.6" stroke-linecap="round"/>
  </g>
  <path d="M138 0 V56 M158 0 V56" stroke="#6A4E36" stroke-width="5"/>
  <path d="{copa(150, 4, 30, 16, 10, .3)}" fill="#3E8A6A" stroke="#1E5A3A" stroke-width=".8"/>
  <svg x="146" y="14" width="18" height="20" viewBox="0 0 110 120"><use class="sem" href="#f-uacari"/></svg>
  <svg x="4" y="80" width="44" height="29" viewBox="0 0 150 100"><use class="sem" href="#f-peixeboi"/></svg>
  <g fill="none" stroke="#E6F6FF" stroke-width=".8"><circle cx="56" cy="86" r="1.6"/><circle cx="60" cy="80" r="1.1"/></g>
</symbol>''')
