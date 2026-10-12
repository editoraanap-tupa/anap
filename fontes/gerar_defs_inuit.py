# figurinhas e capa da Terra dos Inuit (executado dentro de gerar_defs2.py, depois do gerar_defs5.py)
random.seed(64)

# raposa-do-ártico (Floco), pelo branco de inverno
tufos = ''.join(f'<path d="M{x:.1f} {y:.1f} q2 -3 4 -1" stroke="#AEB8D6" stroke-width="1" fill="none" opacity=".7" stroke-linecap="round"/>' for x, y in [(44, 70), (52, 82), (66, 74), (72, 86), (58, 64), (48, 90)])
S.append(f'''<symbol id="f-raposaartica" viewBox="0 0 120 110">
  <defs>{rg('inRaCorpo', '#FFFFFF', '#EEF2FB', '#C4CCE6', .4, .3)}{rg('inRaCab', '#FFFFFF', '#F2F5FC', '#CDD4EC', .42, .32)}{lg('inRaCauda', '#FFFFFF', '#CAD2EA', 1, 1)}</defs>
  <ellipse cx="62" cy="104" rx="46" ry="4" fill="#0A1440" opacity=".18"/>
  <path d="M76 96 C98 100 118 88 116 66 C115 52 106 44 96 44 C104 54 106 70 94 78 C86 84 78 88 76 96Z" fill="url(#inRaCauda)" stroke="#7A86A8" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M100 50 C106 56 110 64 108 74" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M110 78 q-4 2 -8 1 M104 88 q-4 1 -7 -1" stroke="#AEB8D6" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M36 98 C28 82 32 60 48 52 C62 46 80 54 84 70 C88 84 84 96 76 100Z" fill="url(#inRaCorpo)" stroke="#7A86A8" stroke-width="2" stroke-linejoin="round"/>
  {tufos}
  <path d="M42 74 C40 64 44 58 50 56" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M45 78 C46 87 45 93 43 98 C42 102 54 102 54 98 C53 92 53 86 54 78Z M59 78 C59 86 60 92 59 98 C58 102 70 102 69 98 C68 92 67 86 67 78Z" fill="#F6F8FE" stroke="#7A86A8" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M46.5 99.5 v-2.4 M50.5 99.5 v-2.4 M62 99.5 v-2.4 M66 99.5 v-2.4" stroke="#9AA4C4" stroke-width=".9" stroke-linecap="round"/>
  <path d="M40 60 C41 72 46 82 50 84 L53 81 L56 86 L59 81 L62 84 C67 80 71 72 72 62 C66 64 62 60 58 62 C54 58 48 62 40 60Z" fill="#fff" stroke="#AEB8D6" stroke-width="1" stroke-linejoin="round"/>
  <path d="M32 27 C29 19 31 12 36 9 C42 10 46 15 47 22Z" fill="#F4F6FC" stroke="#7A86A8" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M35 23 C34 18 35 15 38 13 C41 15 43 18 43 21Z" fill="#F6C2CE"/>
  <path d="M60 21 C63 14 68 10 73 10 C76 15 75 22 72 27Z" fill="#F4F6FC" stroke="#7A86A8" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M63 20 C66 16 69 14 71 14 C72 18 71 21 69 24Z" fill="#F6C2CE"/>
  <path d="M28 42 L22 46 L29 47 L24 52 L31 51 C30 48 29 45 28 42Z M78 42 L84 46 L77 47 L82 52 L75 51 C76 48 77 45 78 42Z" fill="#F4F6FC" stroke="#7A86A8" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M28 40 C26 24 38 14 53 14 C68 14 80 24 78 40 C76 53 66 60 53 60 C40 60 30 53 28 40Z" fill="url(#inRaCab)" stroke="#7A86A8" stroke-width="2"/>
  <path d="M36 24 C42 18 50 16 58 17" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="54" cy="48" rx="11" ry="7.4" fill="#fff" stroke="#C4CCE6" stroke-width="1"/>
  <ellipse cx="54" cy="43.6" rx="3.8" ry="2.8" fill="#2A2E3E"/><ellipse cx="53" cy="42.6" rx="1.3" ry=".8" fill="#fff" opacity=".8"/>
  <path d="M54 46.4 V49 M54 49 q-3 3 -6 1 M54 49 q3 3 6 1" stroke="#2A2E3E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="43" cy="35" rx="3.8" ry="4.6" fill="#1C2030"/><circle cx="44.4" cy="33.2" r="1.6" fill="#fff"/><circle cx="42.2" cy="36.8" r=".7" fill="#fff" opacity=".8"/>
  <ellipse cx="65" cy="35" rx="3.8" ry="4.6" fill="#1C2030"/><circle cx="66.4" cy="33.2" r="1.6" fill="#fff"/><circle cx="64.2" cy="36.8" r=".7" fill="#fff" opacity=".8"/>
  <path d="M39 29 q4 -2 7 0 M62 29 q4 -2 7 0" stroke="#9AA4C4" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <ellipse cx="38" cy="45" rx="4" ry="2.4" fill="#FF9AAE" opacity=".45"/><ellipse cx="70" cy="45" rx="4" ry="2.4" fill="#FF9AAE" opacity=".45"/>
</symbol>''')

# narval
manchas = ''.join(f'<ellipse cx="{R(30, 100):.1f}" cy="{R(36, 52):.1f}" rx="{R(1.6, 3.4):.1f}" ry="{R(1, 2):.1f}" fill="#3E4C66" opacity=".55"/>' for _ in range(22))
espiral = ''.join(f'<path d="M{114 + k * 3.6:.1f} {46 - k * 3.2:.1f} l2.6 2.2" stroke="#B8A27A" stroke-width="1" stroke-linecap="round"/>' for k in range(9))
S.append(f'''<symbol id="f-narval" viewBox="0 0 150 90">
  <defs>{lg('inNaCorpo', '#8C9CB8', '#E8EEF6')}{lg('inNaAgua', '#6EB8F0', '#1E5AA8')}{lg('inNaDente', '#FFF8E8', '#D8C49A', 1, 0)}
  <clipPath id="inNaClip"><path d="M20 50 C30 34 60 28 86 32 C102 34 114 42 116 52 C114 62 100 68 84 68 C58 70 32 62 20 54Z"/></clipPath></defs>
  <ellipse cx="72" cy="78" rx="68" ry="10" fill="url(#inNaAgua)" stroke="#164A8A" stroke-width="1.4"/>
  {ondas(10, 136, 76, '#E6F6FF', 1.2, .8)}
  <path d="M112 47 L148 12 C149 11 150 12 149 13 L116 53Z" fill="url(#inNaDente)" stroke="#8A7650" stroke-width="1.3" stroke-linejoin="round"/>
  {espiral}
  <path d="M22 50 C14 44 8 36 2 36 C5 44 7 49 11 53 C7 57 5 62 2 70 C9 70 15 62 22 56Z" fill="#6E7E9A" stroke="#2E3A52" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M20 50 C30 34 60 28 86 32 C102 34 114 42 116 52 C114 62 100 68 84 68 C58 70 32 62 20 54Z" fill="url(#inNaCorpo)" stroke="#2E3A52" stroke-width="2"/>
  <g clip-path="url(#inNaClip)">{manchas}<path d="M22 58 C50 70 90 72 118 56 V80 H20Z" fill="#F4F7FC" opacity=".9"/></g>
  <path d="M34 40 C50 32 72 30 92 34" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M82 62 C84 70 78 76 70 76 C72 70 74 66 78 60Z" fill="#7A8AA6" stroke="#2E3A52" stroke-width="1.4"/>
  <circle cx="101" cy="46" r="3.6" fill="#16182A"/><circle cx="102.2" cy="44.6" r="1.4" fill="#fff"/><circle cx="100" cy="47.4" r=".6" fill="#fff" opacity=".8"/>
  <path d="M104 55 q5 2 9 -1" stroke="#2E3A52" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="98" cy="54" rx="3.4" ry="1.8" fill="#FF9AAE" opacity=".45"/>
  <path d="M12 78 C40 70 100 70 136 78" stroke="#BFE6FF" stroke-width="2.4" fill="none" opacity=".9"/>
</symbol>''')

# urso-polar
S.append(f'''<symbol id="f-ursopolar" viewBox="0 0 140 100">
  <defs>{rg('inUrCorpo', '#FFFFFF', '#F6F1E2', '#D4CAAE', .4, .3)}{rg('inUrCab', '#FFFFFF', '#F8F4E8', '#DCD2B8', .4, .3)}{lg('inUrPerna', '#F2ECDA', '#C8BC9C')}</defs>
  <ellipse cx="72" cy="94" rx="58" ry="4.4" fill="#0A1440" opacity=".18"/>
  <g stroke="#8A7E62" stroke-width="1.6" stroke-linejoin="round">
    <path d="M94 66 C94 78 92 84 93 90 C95 94 105 94 107 90 C108 82 108 74 106 64Z M50 66 C48 78 48 84 49 90 C51 94 61 94 63 90 C64 82 64 74 62 66Z" fill="url(#inUrPerna)" opacity=".85"/>
    <path d="M34 52 C34 34 54 24 80 26 C104 28 124 36 128 54 C130 68 124 78 112 82 C96 86 64 86 48 80 C38 76 34 64 34 52Z" fill="url(#inUrCorpo)"/>
    <path d="M104 66 C104 78 102 86 103 91 C104 96 118 96 119 91 C120 84 120 76 116 64Z M40 66 C38 78 38 86 39 91 C40 96 54 96 55 91 C56 84 56 76 54 66Z" fill="url(#inUrPerna)"/>
  </g>
  <path d="M44 94 v-3 M47.5 94.4 v-3 M51 94 v-3 M108 94 v-3 M111.5 94.4 v-3 M115 94 v-3" stroke="#8A7E62" stroke-width="1" stroke-linecap="round"/>
  <path d="M60 48 C66 58 66 66 62 72 M96 46 C104 54 106 62 104 70" stroke="#D8CEB2" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M56 32 C74 26 98 28 114 36" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M126 50 C132 50 134 56 130 60" stroke="#8A7E62" stroke-width="1.6" fill="#F6F1E2"/>
  <circle cx="22" cy="31" r="5.4" fill="#F4EEDC" stroke="#8A7E62" stroke-width="1.5"/><circle cx="22" cy="31" r="2.4" fill="#C8B49A"/>
  <circle cx="40" cy="30" r="5.4" fill="#F4EEDC" stroke="#8A7E62" stroke-width="1.5"/><circle cx="40" cy="30" r="2.4" fill="#C8B49A"/>
  <path d="M10 52 C8 38 18 30 31 30 C44 30 52 38 52 50 C52 62 42 68 30 68 C20 68 12 62 10 52Z" fill="url(#inUrCab)" stroke="#8A7E62" stroke-width="1.8"/>
  <ellipse cx="16" cy="54" rx="10" ry="8" fill="#FFFDF6" stroke="#B8AA88" stroke-width="1.1"/>
  <ellipse cx="11" cy="50.6" rx="4" ry="3" fill="#1E1E26"/><ellipse cx="10" cy="49.6" rx="1.4" ry=".8" fill="#fff" opacity=".8"/>
  <path d="M12 54 V57 q3 3 7 1" stroke="#1E1E26" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="27" cy="44" r="3.6" fill="#1A1A22"/><circle cx="28.2" cy="42.6" r="1.4" fill="#fff"/><circle cx="26.2" cy="45.2" r=".6" fill="#fff" opacity=".8"/>
  <circle cx="40" cy="44" r="3.4" fill="#1A1A22"/><circle cx="41.2" cy="42.6" r="1.3" fill="#fff"/>
  <ellipse cx="34" cy="54" rx="3.6" ry="2" fill="#FF9AAE" opacity=".4"/>
  <path d="M18 36 C24 32 32 32 38 34" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
</symbol>''')

# coruja-das-neves
pintinhas = ''.join(f'<path d="M{x:.1f} {y:.1f} q2 -1.6 4 0" stroke="#2E3242" stroke-width="1.4" fill="none" stroke-linecap="round"/>' for x, y in [(28, 72), (36, 80), (30, 88), (62, 70), (68, 80), (64, 88), (42, 92), (54, 94), (48, 84)])
S.append(f'''<symbol id="f-corujaneves" viewBox="0 0 100 120">
  <defs>{rg('inCoCorpo', '#FFFFFF', '#F4F6FC', '#CCD2E6', .45, .3)}{lg('inCoPedra', '#A4A8BC', '#5E6276')}{rg('inCoOlho', '#FFF2A0', '#FFD43A', '#E8A010', .4, .35)}</defs>
  <ellipse cx="50" cy="115" rx="38" ry="3.6" fill="#0A1440" opacity=".18"/>
  <path d="M14 114 C12 102 22 94 36 94 H66 C80 94 90 102 86 114Z" fill="url(#inCoPedra)" stroke="#3A3E52" stroke-width="1.6"/>
  <path d="M18 102 C30 94 60 92 80 100 C70 96 40 96 18 102Z" fill="#fff"/><path d="M22 106 C34 100 52 100 66 102" stroke="#C4C8D8" stroke-width="1.4" fill="none"/>
  <path d="M50 18 C72 18 84 36 84 60 C84 84 70 100 50 100 C30 100 16 84 16 60 C16 36 28 18 50 18Z" fill="url(#inCoCorpo)" stroke="#7A84A6" stroke-width="2"/>
  <path d="M18 58 C12 70 14 86 24 96 C26 84 26 70 22 58Z M82 58 C88 70 86 86 76 96 C74 84 74 70 78 58Z" fill="#F2F4FA" stroke="#7A84A6" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M20 74 q2 -1 4 0 M20 82 q2 -1 4 0 M76 74 q2 -1 4 0 M76 82 q2 -1 4 0" stroke="#2E3242" stroke-width="1.2" fill="none"/>
  {pintinhas}
  <path d="M28 32 C34 24 42 21 50 21" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M24 46 C24 34 36 30 50 36 C64 30 76 34 76 46 C76 56 64 60 50 56 C36 60 24 56 24 46Z" fill="#FFFFFF" stroke="#C4CCE2" stroke-width="1.2"/>
  <circle cx="37" cy="45" r="8.4" fill="url(#inCoOlho)" stroke="#8A6008" stroke-width="1.2"/><circle cx="37.6" cy="45.6" r="4.6" fill="#16141C"/><circle cx="39.4" cy="43.4" r="1.9" fill="#fff"/><circle cx="35.6" cy="47.6" r=".8" fill="#fff" opacity=".8"/>
  <circle cx="63" cy="45" r="8.4" fill="url(#inCoOlho)" stroke="#8A6008" stroke-width="1.2"/><circle cx="62.4" cy="45.6" r="4.6" fill="#16141C"/><circle cx="64.2" cy="43.4" r="1.9" fill="#fff"/><circle cx="60.4" cy="47.6" r=".8" fill="#fff" opacity=".8"/>
  <path d="M46 52 L50 60 L54 52 C52 50 48 50 46 52Z" fill="#2E3242"/>
  <ellipse cx="28" cy="56" rx="4" ry="2.2" fill="#FF9AAE" opacity=".4"/><ellipse cx="72" cy="56" rx="4" ry="2.2" fill="#FF9AAE" opacity=".4"/>
  <path d="M34 98 C32 104 38 106 42 102 M58 102 C62 106 68 104 66 98" fill="#FFFFFF" stroke="#7A84A6" stroke-width="1.5"/>
  <path d="M36 104 l-1 2.6 M40 104 l0 2.6 M60 104 l0 2.6 M64 104 l1 2.6" stroke="#2E3242" stroke-width="1.2" stroke-linecap="round"/>
</symbol>''')

# capa: noite ártica com aurora boreal, iglu, iceberg, cidade e raposa
estrelas = ''.join(f'<circle cx="{R(4, 166):.1f}" cy="{R(3, 40):.1f}" r="{R(.4, .9):.1f}" fill="#fff" opacity="{R(.5, 1):.2f}"/>' for _ in range(28))
def faixa(b0, amp, f, h0):
    xs = [i * 5 for i in range(35)]
    base = [b0 + amp * math.sin(x * .045 + f) + 2.5 * math.sin(x * .13) for x in xs]
    alto = [h0 + 7 * math.sin(x * .07 + f * 2) for x in xs]
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in zip(xs, base)) + ' L' + ' L'.join(f'{x + 4:.1f} {y - h:.1f}' for x, y, h in reversed(list(zip(xs, base, alto)))) + 'Z'
    raios = ''.join(f'<path d="M{x:.1f} {y:.1f} L{x + 4:.1f} {y - h:.1f}" stroke="#C8FFE6" stroke-width="1.2" opacity=".35"/>' for x, y, h in list(zip(xs, base, alto))[::2])
    return f'<path d="{d}" fill="url(#inCpAur)" opacity=".75"/>' + raios
cortinas = faixa(40, 6, 0, 26) + faixa(48, 5, 2.2, 20)
blocos_cp = ''.join(f'<path d="M{a:.1f} {y:.1f} H{b:.1f}" stroke="#93AED0" stroke-width=".7"/>' for a, b, y in [(102, 140, 82), (104, 138, 75), (108, 134, 68), (114, 128, 62)])
casas_cp = ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" stroke="#1E2440" stroke-width=".6"/><path d="M{x - 1} {y} L{x + w / 2} {y - 4} L{x + w + 1} {y}Z" fill="#F4F6FC"/><rect x="{x + 2}" y="{y + 2}" width="3" height="2.4" fill="#FFE07A"/><path d="M{x + 2} {y + h} v2 M{x + w - 2} {y + h} v2" stroke="#2A2E40" stroke-width=".8"/>' for x, y, w, h, c in [(6, 50, 14, 8, '#D84A3E'), (22, 52, 12, 7, '#3E7AD0'), (36, 49, 14, 9, '#E8B83A'), (52, 53, 11, 6, '#3EA87A')])
S.append(f'''<symbol id="capa-inuit" viewBox="0 0 170 110">
  <defs>{lg('inCpC', '#0E1A44', '#5A5E9E')}{lg('inCpMar', '#C6D2EC', '#F0F4FC')}{lg('inCpBerg', '#E6F8FF', '#4EA8D8', 1, 1)}{lg('inCpIglu', '#FFFFFF', '#B8CCE6')}
  <linearGradient id="inCpAur" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5CFFB0" stop-opacity="0"/><stop offset=".25" stop-color="#5CFFB0"/><stop offset=".7" stop-color="#7AE8FF"/><stop offset="1" stop-color="#C87AFF" stop-opacity="0"/></linearGradient>
  <radialGradient id="inCpLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC870" stop-opacity=".9"/><stop offset="1" stop-color="#FFB050" stop-opacity="0"/></radialGradient></defs>
  <rect width="170" height="110" fill="url(#inCpC)"/>
  {estrelas}{cortinas}
  <path d="M0 58 L18 50 L34 54 L52 44 L76 50 L96 42 L120 50 L140 46 L170 52 V64 H0Z" fill="#4A4E86"/>
  <path d="M52 44 L62 48 L58 50 L50 47Z M96 42 L106 46 L100 48 L94 45Z" fill="#C8CCEA"/>
  <rect y="62" width="170" height="48" fill="url(#inCpMar)"/>
  <path d="M0 64 C20 56 50 56 64 64Z" fill="#E6ECF8" stroke="#9AA8CC" stroke-width=".6"/>
  {casas_cp}
  <path d="M134 64 L138 50 L144 44 L148 34 L156 30 L160 40 L164 48 L168 64Z" fill="url(#inCpBerg)" stroke="#2E7EB8" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M156 30 L160 40 L164 48 L168 64 H158 L160 50Z" fill="#3E9ACE" opacity=".6"/>
  <path d="M10 76 h20 M40 84 h26 M70 72 h14 M20 96 h30" stroke="#B4C4E2" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="120" cy="86" rx="34" ry="5" fill="#8CA4CC" opacity=".6"/>
  <circle cx="110" cy="80" r="26" fill="url(#inCpLuz)"/>
  <path d="M98 86 A23 26 0 0 1 144 86Z" fill="url(#inCpIglu)" stroke="#7C9CC4" stroke-width="1"/>
  {blocos_cp}
  <path d="M110 86 V60 M122 86 V61 M116 75 V68 M128 82 V75 M104 82 V75" stroke="#93AED0" stroke-width=".6"/>
  <path d="M96 90 V82 A10 9 0 0 1 116 82 V90Z" fill="url(#inCpIglu)" stroke="#7C9CC4" stroke-width="1"/>
  <path d="M101 90 V84 A5 5 0 0 1 111 84 V90Z" fill="#FFC870" stroke="#C8701E" stroke-width=".7"/>
  <path d="M102 68 C106 62 112 60 118 60" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <g transform="translate(84 84)"><g fill="#6E7286" stroke="#2A2E40" stroke-width=".6"><rect x="-5" y="-6" width="3" height="6"/><rect x="2" y="-6" width="3" height="6"/><rect x="-7" y="-9" width="14" height="3"/><rect x="-3" y="-14" width="6" height="5"/><rect x="-5" y="-16" width="10" height="2"/></g></g>
  <path d="M0 98 C24 90 52 92 72 100 L76 110 H0Z" fill="#FFFFFF" stroke="#B4C8E4" stroke-width=".8"/>
  <svg x="20" y="66" width="44" height="40" viewBox="0 0 120 110"><use class="sem" href="#f-raposaartica"/></svg>
</symbol>''')
