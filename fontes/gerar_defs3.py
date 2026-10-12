# figurinhas e capas da Mata Atlântica e do Pampa (executado dentro de gerar_defs2.py)
random.seed(23)
def juba(cx, cy, rx, ry, n):
    s = ''
    for i in range(n):
        a0 = i / n * 2 * math.pi; a1 = (i + 1) / n * 2 * math.pi; am = (a0 + a1) / 2; k = R(1.18, 1.32)
        x0 = cx + math.cos(a0) * rx; y0 = cy + math.sin(a0) * ry; x1 = cx + math.cos(a1) * rx; y1 = cy + math.sin(a1) * ry
        xm = cx + math.cos(am) * rx * k; ym = cy + math.sin(am) * ry * k
        s += (f'M{x0:.1f} {y0:.1f}' if i == 0 else '') + f' Q{xm:.1f} {ym:.1f} {x1:.1f} {y1:.1f}'
    return s + 'Z'

# mico-leão-dourado
S.append(f'''<symbol id="f-mico" viewBox="0 0 120 130">
  <defs><linearGradient id="miOuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC24A"/><stop offset="1" stop-color="#E8781A"/></linearGradient>
  <radialGradient id="miJuba" cx=".5" cy=".42" r=".6"><stop offset=".55" stop-color="#FFB338"/><stop offset="1" stop-color="#E06A12"/></radialGradient></defs>
  <ellipse cx="58" cy="126" rx="36" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M78 104 C100 108 110 92 106 74 C102 58 112 46 104 34" stroke="#8A3E0A" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M78 104 C100 108 110 92 106 74 C102 58 112 46 104 34" stroke="url(#miOuro)" stroke-width="7.4" fill="none" stroke-linecap="round"/>
  <path d="M104 34 C100 30 104 26 108 28" stroke="#8A3E0A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M34 92 C30 70 42 62 58 62 C76 62 86 72 82 94 C80 112 70 120 58 120 C44 120 36 110 34 92Z" fill="url(#miOuro)" stroke="#8A3E0A" stroke-width="1.8"/>
  <path d="M42 84 q4 -3 8 -1 M64 80 q4 -3 8 -1 M48 98 q4 -3 8 -1 M66 96 q4 -3 8 -1" stroke="#C85A12" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M36 108 C30 116 34 124 44 124 L52 124 C54 118 48 112 42 108Z" fill="url(#miOuro)" stroke="#8A3E0A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 108 C86 116 82 124 72 124 L64 124 C62 118 68 112 74 108Z" fill="url(#miOuro)" stroke="#8A3E0A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M40 76 C36 86 44 96 52 98" stroke="#8A3E0A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M40 76 C36 86 44 96 52 98" stroke="#F5A030" stroke-width="5.6" fill="none" stroke-linecap="round"/>
  <path d="M78 76 C82 86 74 96 66 98" stroke="#8A3E0A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M78 76 C82 86 74 96 66 98" stroke="#F5A030" stroke-width="5.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="59" cy="99" rx="11" ry="6" fill="#B8462A" stroke="#6E1E10" stroke-width="1.4"/><path d="M53 97 q6 -3 12 0" stroke="#E87A52" stroke-width="1.4" fill="none"/>
  <path d="M51 99 l-2 3 M55 100 l-1 3 M67 99 l2 3 M63 100 l1 3" stroke="#3E2020" stroke-width="2" stroke-linecap="round"/>
  <path d="{juba(59, 44, 30, 29, 15)}" fill="url(#miJuba)" stroke="#8A3E0A" stroke-width="1.8" stroke-linejoin="round"/>
  {tex(59, 44, 24, 22, 16, '#D9661A', 1.3)}
  <path d="M38 30 C44 20 58 16 70 20" stroke="#FFE08A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M46 44 C46 34 52 30 59 30 C66 30 72 34 72 44 C72 56 66 64 59 64 C52 64 46 56 46 44Z" fill="#5E3A40" stroke="#2E1A1E" stroke-width="1.6"/>
  <path d="M52 52 C54 58 64 58 66 52 C64 62 54 62 52 52Z" fill="#7A4E54"/>
  <ellipse cx="53.5" cy="44" rx="4.4" ry="4.8" fill="#FFF6E0" stroke="#2E1A1E" stroke-width="1"/><ellipse cx="64.5" cy="44" rx="4.4" ry="4.8" fill="#FFF6E0" stroke="#2E1A1E" stroke-width="1"/>
  <circle cx="54.3" cy="44.6" r="2.6" fill="#3E1E10"/><circle cx="63.7" cy="44.6" r="2.6" fill="#3E1E10"/><circle cx="55.2" cy="43.6" r=".9" fill="#fff"/><circle cx="64.6" cy="43.6" r=".9" fill="#fff"/>
  <path d="M56.5 52 q2.5 2 5 0" stroke="#1E0E10" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M55 57 q4 3 8 0" stroke="#E8A0A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
</symbol>''')

# bromélia com água no copinho
folhas = ''
for ang, comp, cor in [(-150, 40, '#2E8A44'), (-30, 40, '#2E8A44'), (-165, 34, '#3EA052'), (-15, 34, '#3EA052'), (-125, 38, '#4CB060'), (-55, 38, '#4CB060'), (-105, 30, '#5CC06A'), (-75, 30, '#5CC06A')]:
    a = math.radians(ang); x1 = 50 + math.cos(a) * comp * 1.25; y1 = 74 + math.sin(a) * comp
    nx = -math.sin(a) * 7; ny = math.cos(a) * 7
    folhas += f'<path d="M{50 + nx:.1f} {74 + ny * .4:.1f} Q{50 + math.cos(a) * comp * .7 + nx:.1f} {74 + math.sin(a) * comp * .6 + ny:.1f} {x1:.1f} {y1:.1f} Q{50 + math.cos(a) * comp * .6 - nx:.1f} {74 + math.sin(a) * comp * .7 - ny:.1f} {50 - nx:.1f} {74 - ny * .4:.1f}Z" fill="{cor}" stroke="#1E5E2E" stroke-width="1.5" stroke-linejoin="round"/>'
    folhas += f'<path d="M{50:.1f} {74:.1f} Q{50 + math.cos(a) * comp * .6:.1f} {74 + math.sin(a) * comp * .6:.1f} {x1:.1f} {y1:.1f}" stroke="#8FD48A" stroke-width="1" fill="none" opacity=".7"/>'
    folhas += f'<path d="M{50 + math.cos(a) * comp * 1.05:.1f} {74 + math.sin(a) * comp * .85:.1f} L{x1:.1f} {y1:.1f}" stroke="#D9472E" stroke-width="3" stroke-linecap="round"/>'
S.append(f'''<symbol id="f-bromelia" viewBox="0 0 100 100">
  <ellipse cx="50" cy="97" rx="40" ry="2.6" fill="#0A1440" opacity=".18"/>
  <path d="M4 84 C30 78 70 78 96 82 C99 86 99 92 96 94 C70 90 30 90 4 96 C1 92 1 88 4 84Z" fill="#8A6A4A" stroke="#3E2A18" stroke-width="1.6"/><path d="M10 88 h10 M60 86 h12 M80 90 h8" stroke="#5E4428" stroke-width="1.2" stroke-linecap="round"/><path d="M12 84 C20 80 30 80 36 82 C30 84 20 86 12 84Z M64 81 C72 79 82 80 88 82 C80 84 70 84 64 81Z" fill="#6CB858" stroke="#2E6A22" stroke-width="1"/>
  {folhas}
  <ellipse cx="50" cy="62" rx="15" ry="6" fill="#2E8A44" stroke="#1E5E2E" stroke-width="1.5"/>
  <ellipse cx="50" cy="62" rx="12" ry="4.2" fill="#5AC0F0" stroke="#1B6EB0" stroke-width="1.2"/><path d="M43 61 q4 -2 8 0" stroke="#E6F6FF" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M50 60 C49 48 50 36 50 24" stroke="#2E7A3A" stroke-width="3" fill="none"/>
  <g stroke="#8E1E14" stroke-width="1.3" stroke-linejoin="round">
    <path d="M50 26 C44 22 44 14 50 10 C56 14 56 22 50 26Z" fill="#F0503A"/><path d="M50 36 C42 33 40 26 46 22 C50 26 52 30 50 36Z" fill="#E5392C"/><path d="M50 36 C58 33 60 26 54 22 C50 26 48 30 50 36Z" fill="#E5392C"/>
    <path d="M50 46 C42 44 39 37 44 33 C48 37 51 41 50 46Z" fill="#D92E22"/><path d="M50 46 C58 44 61 37 56 33 C52 37 49 41 50 46Z" fill="#D92E22"/>
  </g>
  <g fill="#FFE27A" stroke="#B07A08" stroke-width=".8"><circle cx="50" cy="9" r="2.2"/><circle cx="44" cy="21" r="1.8"/><circle cx="56" cy="21" r="1.8"/></g>
  <path d="M47 14 q2 -3 4 -2" stroke="#FFB0A0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# perereca-de-bromélia
S.append('''<symbol id="f-perereca" viewBox="0 0 100 80">
  <defs><linearGradient id="peVerde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BE04A"/><stop offset="1" stop-color="#4FAE2A"/></linearGradient></defs>
  <ellipse cx="50" cy="76" rx="34" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M24 60 C14 58 10 66 16 72 M76 60 C86 58 90 66 84 72" stroke="#2E6E1A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M24 60 C14 58 10 66 16 72 M76 60 C86 58 90 66 84 72" stroke="#7CCB3A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g fill="#FFC83D" stroke="#2E6E1A" stroke-width="1.2"><circle cx="13" cy="73" r="3.4"/><circle cx="19" cy="75" r="3"/><circle cx="87" cy="73" r="3.4"/><circle cx="81" cy="75" r="3"/></g>
  <path d="M22 54 C20 36 34 26 50 26 C66 26 80 36 78 54 C76 68 64 74 50 74 C36 74 24 68 22 54Z" fill="url(#peVerde)" stroke="#2E6E1A" stroke-width="1.8"/>
  <path d="M34 62 C40 70 60 70 66 62 C62 72 38 72 34 62Z" fill="#E9F7A8" stroke="#2E6E1A" stroke-width="1"/>
  <path d="M30 40 C36 32 48 30 58 31" stroke="#D8F7A0" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <g fill="#3E8A1E"><circle cx="40" cy="46" r="2"/><circle cx="60" cy="44" r="2.4"/><circle cx="52" cy="52" r="1.6"/></g>
  <circle cx="34" cy="28" r="11" fill="url(#peVerde)" stroke="#2E6E1A" stroke-width="1.8"/><circle cx="66" cy="28" r="11" fill="url(#peVerde)" stroke="#2E6E1A" stroke-width="1.8"/>
  <circle cx="34" cy="27" r="7.4" fill="#FFB020" stroke="#7A4A08" stroke-width="1"/><circle cx="66" cy="27" r="7.4" fill="#FFB020" stroke="#7A4A08" stroke-width="1"/>
  <ellipse cx="34" cy="27" rx="2.4" ry="5.6" fill="#12121A"/><ellipse cx="66" cy="27" rx="2.4" ry="5.6" fill="#12121A"/><circle cx="36" cy="24" r="1.6" fill="#fff"/><circle cx="68" cy="24" r="1.6" fill="#fff"/>
  <path d="M38 56 q12 7 24 0" stroke="#2E6E1A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M30 64 C30 70 34 74 38 74 M70 64 C70 70 66 74 62 74" stroke="#2E6E1A" stroke-width="1.6" fill="none"/>
  <g fill="#FFC83D" stroke="#2E6E1A" stroke-width="1"><circle cx="36" cy="75" r="2.6"/><circle cx="64" cy="75" r="2.6"/></g>
</symbol>''')

# tucano-de-bico-verde
S.append('''<symbol id="f-tucano" viewBox="0 0 120 100">
  <ellipse cx="54" cy="96" rx="34" ry="3" fill="#0A1440" opacity=".18"/>
  <path d="M6 82 C30 78 60 80 104 74" stroke="#5E3E22" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M6 82 C30 78 60 80 104 74" stroke="#8A6040" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M84 76 q6 -8 14 -8 q-2 6 -8 10Z" fill="#4CB060" stroke="#1E5E2E" stroke-width="1.2"/>
  <path d="M24 64 C14 72 10 84 12 94 C20 88 26 80 30 72Z" fill="#1E1E28" stroke="#0A0A12" stroke-width="1.2"/>
  <path d="M24 46 C24 30 36 24 46 26 C58 28 62 40 60 56 C58 72 48 80 38 78 C28 76 24 62 24 46Z" fill="#1E1E28" stroke="#0A0A12" stroke-width="1.6"/>
  <path d="M42 36 C50 36 56 42 56 52 C56 58 52 62 46 62 C42 56 40 46 42 36Z" fill="#FFD447" stroke="#B07A08" stroke-width="1.2"/>
  <path d="M46 62 C52 62 56 64 56 70 C52 74 46 74 42 72 C42 68 44 64 46 62Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.2"/>
  <path d="M30 40 C32 34 38 30 44 30" stroke="#55556A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M34 80 l-2 6 M42 80 l2 6" stroke="#4E6A9A" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="44" cy="30" r="5.4" fill="#E5392C" stroke="#7A1410" stroke-width="1"/><circle cx="44.4" cy="30" r="2.6" fill="#12121A"/><circle cx="45.4" cy="29" r=".9" fill="#fff"/>
  <path d="M50 24 C70 18 92 18 108 26 C112 28 112 32 106 34 C88 40 66 40 52 38 C48 34 48 28 50 24Z" fill="#B8E07A" stroke="#3E6A22" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M52 38 C66 42 88 40 106 34" stroke="#3E6A22" stroke-width="1.2" fill="none"/>
  <path d="M54 24 C70 21 88 21 100 25" stroke="#E6F7C0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M52 24 C51 30 51 34 52 38" stroke="#1E1E28" stroke-width="3" fill="none"/>
  <path d="M100 28 C106 28 110 30 108 32" stroke="#E5392C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# joão-de-barro na casinha de barro
S.append(f'''<symbol id="f-joao" viewBox="0 0 120 110">
  <defs><linearGradient id="jbBarro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9935A"/><stop offset="1" stop-color="#A8622E"/></linearGradient>
  <linearGradient id="jbPena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A52"/><stop offset="1" stop-color="#9A5E2E"/></linearGradient></defs>
  <ellipse cx="60" cy="106" rx="44" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M8 74 H112" stroke="#5E3E22" stroke-width="8" stroke-linecap="round"/><path d="M8 72 H112" stroke="#8A6040" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M52 76 v28" stroke="#5E3E22" stroke-width="7" stroke-linecap="round"/>
  <path d="M14 72 C12 44 30 24 54 24 C80 24 96 44 94 72Z" fill="url(#jbBarro)" stroke="#5E2E14" stroke-width="2" stroke-linejoin="round"/>
  {tex(54, 50, 34, 18, 18, '#B8703A', 1.3)}
  <path d="M24 46 C30 34 42 28 56 28" stroke="#F0B886" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M60 72 C58 58 62 50 70 48 C78 48 82 56 80 72Z" fill="#3E1E0C" stroke="#5E2E14" stroke-width="1.6"/>
  <g transform="translate(26 50)">
    <path d="M-6 14 C-14 18 -20 24 -22 30 C-14 28 -8 24 -2 20Z" fill="#8A5428" stroke="#4E2E14" stroke-width="1.2"/>
    <ellipse cx="4" cy="12" rx="13" ry="10" fill="url(#jbPena)" stroke="#4E2E14" stroke-width="1.6"/>
    <path d="M6 6 C12 10 14 16 10 20 C6 18 4 12 6 6Z" fill="#F2DCC0" stroke="#4E2E14" stroke-width="1"/>
    <path d="M-6 10 C-2 6 4 6 8 8" stroke="#7A4A22" stroke-width="1.2" fill="none"/>
    <circle cx="10" cy="-1" r="8" fill="url(#jbPena)" stroke="#4E2E14" stroke-width="1.6"/>
    <path d="M10 6 C14 6 17 3 17 0" fill="#F2DCC0"/>
    <circle cx="12.4" cy="-2.4" r="2.2" fill="#12121A"/><circle cx="13" cy="-3" r=".8" fill="#fff"/>
    <path d="M7 -4 C9 -6 14 -6 16 -4" stroke="#F2DCC0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M17 -2 L26 0 L17 2Z" fill="#5E4A36" stroke="#2E1E10" stroke-width="1" stroke-linejoin="round"/>
    <path d="M0 22 l-1 6 M6 22 l1 6" stroke="#6E5A4A" stroke-width="1.8" stroke-linecap="round"/>
  </g>
</symbol>''')

# ema
S.append('''<symbol id="f-ema" viewBox="0 0 100 130">
  <defs><linearGradient id="emPena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9B2A6"/><stop offset="1" stop-color="#857C70"/></linearGradient></defs>
  <ellipse cx="48" cy="126" rx="30" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M40 82 L34 106 L38 124 M56 82 L62 104 L58 124" stroke="#6E6450" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 124 h12 M52 124 h12" stroke="#6E6450" stroke-width="3" stroke-linecap="round"/>
  <path d="M14 66 C10 50 26 40 46 40 C66 40 82 50 82 64 C82 80 66 90 46 90 C30 90 18 82 14 66Z" fill="url(#emPena)" stroke="#4E463A" stroke-width="1.8"/>
  <path d="M14 66 C8 70 6 76 10 82 C14 78 18 76 20 76 C18 84 22 88 28 88 C28 82 30 80 32 80" fill="#9A9184" stroke="#4E463A" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M22 58 q6 -4 12 -2 M40 52 q6 -4 12 -2 M58 56 q6 -4 12 -2 M28 72 q6 -3 12 -1 M50 70 q6 -3 12 -1 M66 72 q5 -3 10 -1" stroke="#6E665A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M24 52 C34 44 50 42 62 44" stroke="#DCD6CA" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M70 48 C72 34 70 22 72 12" stroke="#4E463A" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M70 48 C72 34 70 22 72 12" stroke="#B9B2A6" stroke-width="7.4" fill="none" stroke-linecap="round"/>
  <path d="M68 40 C70 36 74 36 76 40" stroke="#2E2A24" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="74" cy="10" rx="8" ry="6.4" fill="#B9B2A6" stroke="#4E463A" stroke-width="1.6"/>
  <path d="M80 9 C86 9 90 11 90 12 C86 14 82 14 80 13Z" fill="#8A7E66" stroke="#4E463A" stroke-width="1.2" stroke-linejoin="round"/>
  <circle cx="76" cy="8" r="2.2" fill="#12121A"/><circle cx="76.6" cy="7.4" r=".7" fill="#fff"/>
  <path d="M68 6 C70 3 74 3 76 4" stroke="#2E2A24" stroke-width="1.8" fill="none" stroke-linecap="round"/>
</symbol>''')

# quero-quero
S.append('''<symbol id="f-queroquero" viewBox="0 0 100 100">
  <ellipse cx="48" cy="96" rx="26" ry="3" fill="#0A1440" opacity=".18"/>
  <path d="M42 70 L40 94 M54 70 L56 94" stroke="#E07A8A" stroke-width="3" stroke-linecap="round"/>
  <path d="M34 94 h10 M52 94 h10" stroke="#E07A8A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M20 50 C12 52 6 58 4 66 C12 64 18 62 24 58Z" fill="#1E1E28"/>
  <path d="M20 50 C22 38 36 32 52 34 C66 36 76 44 74 56 C72 68 60 74 46 74 C32 74 20 66 20 50Z" fill="#FFFFFF" stroke="#4E5B7A" stroke-width="1.8"/>
  <path d="M22 46 C30 36 48 34 62 40 C56 48 44 54 28 56Z" fill="#9C8A6E" stroke="#4E463A" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M30 50 C38 48 46 46 54 42" stroke="#5E7A5A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 52 C40 50 46 48 52 46" stroke="#7A5A8A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M56 40 C64 38 72 44 74 52 C68 54 60 50 56 40Z" fill="#1E1E28"/>
  <circle cx="64" cy="26" r="11" fill="#A8A8B4" stroke="#4E5B7A" stroke-width="1.8"/>
  <path d="M56 30 C60 36 68 38 74 34 C72 40 66 42 60 40 C56 38 54 34 56 30Z" fill="#1E1E28"/>
  <path d="M60 16 C56 10 50 8 44 10 C50 12 54 14 56 18" fill="#1E1E28" stroke="#1E1E28" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M58 18 C62 16 68 16 72 20" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="67" cy="24" r="3.2" fill="#E5392C" stroke="#7A1410" stroke-width=".8"/><circle cx="67.4" cy="24" r="1.4" fill="#12121A"/><circle cx="68" cy="23.4" r=".5" fill="#fff"/>
  <path d="M74 25 L86 27 L74 29Z" fill="#E07A8A" stroke="#7A2A3A" stroke-width="1" stroke-linejoin="round"/><path d="M80 26.4 L86 27" stroke="#1E1E28" stroke-width="1.6"/>
</symbol>''')

# corticeira-do-banhado
flores = ''
for _ in range(16):
    x = R(22, 98); y = R(18, 52); a = R(-40, 40)
    flores += f'<g transform="translate({x:.1f} {y:.1f}) rotate({a:.0f})"><path d="M0 0 C-3 -4 -3 -9 0 -12 C3 -9 3 -4 0 0Z" fill="#E5262A" stroke="#8E0E14" stroke-width="1"/><path d="M0 0 C-5 -2 -8 -6 -8 -9 M0 0 C5 -2 8 -6 8 -9" stroke="#C81E24" stroke-width="2" fill="none" stroke-linecap="round"/></g>'
S.append(f'''<symbol id="f-corticeira" viewBox="0 0 120 120">
  <ellipse cx="60" cy="116" rx="40" ry="3.5" fill="#0A1440" opacity=".18"/>
  <path d="M60 116 C58 96 64 82 58 66 C54 56 44 52 34 46 M60 82 C70 72 80 64 92 60 M58 66 C60 54 66 44 72 36" stroke="#4E321C" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M60 116 C58 96 64 82 58 66 C54 56 44 52 34 46 M60 82 C70 72 80 64 92 60 M58 66 C60 54 66 44 72 36" stroke="#9A7A5A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M56 108 h6 M58 98 h5 M60 88 h4" stroke="#4E321C" stroke-width="1.4" stroke-linecap="round"/>
  <path d="{copa(36, 40, 20, 12, 9)}" fill="#5CA84A" stroke="#2E6A22" stroke-width="1.8"/><path d="{copa(88, 52, 20, 12, 9)}" fill="#5CA84A" stroke="#2E6A22" stroke-width="1.8"/><path d="{copa(66, 28, 24, 14, 10)}" fill="#6CB858" stroke="#2E6A22" stroke-width="1.8"/>
  {flores}
  <path d="M50 18 q8 -6 18 -4" stroke="#D6F0A8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</symbol>''')

# capas
S.append(f'''<symbol id="capa-mata" viewBox="0 0 170 110">
  <defs>{ceu('cpMaC','#9FD8F5','#E8F7EE')}{ceu('cpMaS','#2E8A4C','#16603A')}{ceu('cpMaR','#7CD3F0','#2E8FC8')}</defs>
  <rect width="170" height="110" fill="url(#cpMaC)"/>
  <path d="M0 52 C20 28 40 20 60 30 C80 14 104 10 126 24 C142 16 160 22 170 30 V110 H0Z" fill="#4E9E6A" stroke="#3E8A58" stroke-width="1"/>
  <path d="M0 40 C30 36 60 40 90 34 C120 30 150 36 170 32" stroke="#fff" stroke-width="7" opacity=".55" fill="none" stroke-linecap="round"/>
  <path d="M0 60 C24 44 46 40 70 50 C92 38 118 36 140 48 C152 42 162 44 170 48 V110 H0Z" fill="url(#cpMaS)"/>
  {''.join(f'<path d="{copa(x, y, r, r * .7, 8)}" fill="{c}" stroke="#165E34" stroke-width="1"/>' for x, y, r, c in [(14,58,14,'#2E9E57'),(40,52,16,'#3AAE62'),(70,56,15,'#2E9E57'),(100,48,16,'#3AAE62'),(132,52,15,'#2E9E57'),(158,54,13,'#3AAE62'),(26,74,14,'#249050'),(118,74,15,'#249050')])}
  <path d="M84 42 C86 58 82 72 86 92" stroke="#E9F6FF" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M84 42 C86 58 82 72 86 92" stroke="#7FCDEB" stroke-width="2.4" fill="none" stroke-dasharray="4 4" stroke-linecap="round"/>
  <path d="M0 100 C40 90 70 96 86 92 C110 88 140 96 170 92 V110 H0Z" fill="url(#cpMaR)"/>
  <path d="M20 100 q6 -2 12 0 M120 98 q6 -2 12 0" stroke="#E6F6FF" stroke-width="1.2" fill="none"/>
  <svg x="22" y="44" width="42" height="40" viewBox="0 0 100 100"><use class="sem" href="#f-bromelia"/></svg>
  <svg x="114" y="22" width="34" height="38" viewBox="0 0 120 130"><use class="sem" href="#f-mico"/></svg>
</symbol>''')
S.append(f'''<symbol id="capa-pampa" viewBox="0 0 170 110">
  <defs>{ceu('cpPaC','#8ED0F7','#F0F9FF')}{ceu('cpPaG','#9BD46A','#5FA83A')}</defs>
  <rect width="170" height="110" fill="url(#cpPaC)"/>
  <path d="M118 20 q8 -6 16 0 q6 -3 10 1 q4 4 -1 5 h-26 q-4 -2 1 -6Z" fill="#fff"/>
  <path d="M0 58 C30 44 60 48 90 56 C120 46 150 44 170 52 V110 H0Z" fill="#8CC85E" stroke="#6EA84A" stroke-width="1"/>
  <path d="M0 70 C40 60 80 66 110 72 C140 64 160 64 170 68 V110 H0Z" fill="url(#cpPaG)"/>
  {capim(0, 170, 76, 46, '#4E8A2E', (3, 7), .9)}{capim(0, 170, 100, 40, '#3E7A22', (4, 8), 1)}
  <ellipse cx="44" cy="92" rx="30" ry="7" fill="#6EC0E8" stroke="#2E7FB0" stroke-width="1.2"/><path d="M28 91 q6 -2 12 0" stroke="#E6F6FF" stroke-width="1.2" fill="none"/>
  <path d="M18 90 v-8 M22 89 v-10 M66 90 v-9 M70 91 v-7" stroke="#3E7A22" stroke-width="1.6" stroke-linecap="round"/>
  <g transform="translate(128 74)"><path d="M0 0 L-6 -34 M0 0 L6 -34 M-4 -18 H4 M-5 -26 H5" stroke="#6E6A7A" stroke-width="1.8" fill="none"/>
    {''.join(f'<path d="M0 -36 L{math.cos(math.radians(a)) * 14:.1f} {-36 + math.sin(math.radians(a)) * 14:.1f}" stroke="#E9EEF6" stroke-width="3.2" stroke-linecap="round"/>' for a in range(0, 360, 45))}
    <circle cx="0" cy="-36" r="2.6" fill="#E5392C"/><path d="M0 -36 L-12 -38 L-12 -32Z" fill="#FFC83D" stroke="#8A6A08" stroke-width=".8"/></g>
  <rect x="140" y="70" width="18" height="7" rx="2" fill="#8A8A96" stroke="#4E4E5A" stroke-width="1"/><rect x="141" y="70.5" width="16" height="3" fill="#7FCDEB"/>
  <svg x="84" y="46" width="30" height="40" viewBox="0 0 100 130"><use class="sem" href="#f-ema"/></svg>
  <svg x="6" y="44" width="40" height="38" viewBox="0 0 120 110"><use class="sem" href="#f-joao"/></svg>
</symbol>''')
