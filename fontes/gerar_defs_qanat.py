# figurinhas e capa dos Qanats do Irã (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(97)

# ---------- guepardo-asiático (Yuzi), sentado ----------
_pintas_g = ''.join(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r:.1f}" ry="{r * .85:.1f}" fill="#2A1A10"/>' for x, y, r in [
    (30, 84, 2.2), (37, 92, 2), (29, 100, 2.3), (40, 104, 1.8), (34, 112, 1.7), (44, 80, 1.9), (24, 92, 1.7), (46, 94, 1.5),
    (36, 74, 1.7), (50, 72, 1.6), (26, 108, 1.6), (47, 110, 1.4), (42, 86, 1.4)])
_pintas_p = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="#2A1A10"/>' for x, y, r in [
    (58, 88, 1.3), (59, 96, 1.2), (57, 104, 1.1), (70, 90, 1.3), (71, 98, 1.2), (70, 106, 1.1)])
_pintas_c = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="#3A2414"/>' for x, y, r in [
    (56, 30, 1.1), (61, 27, 1), (67, 27, 1), (72, 30, 1.1), (64, 31, .9), (48, 40, .9), (80, 40, .9), (52, 34, .8), (76, 34, .8)])
_aneis = '<path d="M80 126.4 C86 126 92 124.6 96 123 C100 121 104 116 104 108" stroke="#2A1A10" stroke-width="6.6" fill="none" stroke-dasharray="3.4 4.2"/>' 
S.append(f'''<symbol id="f-guepardo" viewBox="0 0 110 130">
  <defs>{rg('qagPelo', '#FFECB8', '#F4C772', '#D99A44', .42, .3)}{lg('qagPerna', '#F8D898', '#D9A050')}{lg('qagBarriga', '#FFFBEE', '#F4E2BE')}{rg('qagOlho', '#FFE38A', '#E8A02A', '#9A5A0E', .45, .4)}</defs>
  <ellipse cx="56" cy="126" rx="40" ry="3.6" fill="#2A1A0A" opacity=".2"/>
  <path d="M30 120 C46 128 76 128 92 124 C100 122 106 116 104 108" stroke="#8A5A22" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M30 120 C46 128 76 128 92 124 C100 122 106 116 104 108" stroke="url(#qagPerna)" stroke-width="6.4" fill="none" stroke-linecap="round"/>
  {_aneis}<path d="M104.6 110 l-.6 -4" stroke="#FFFBEE" stroke-width="5" stroke-linecap="round"/>
  <path d="M24 118 C16 104 18 84 30 72 C38 64 50 60 60 62 C70 64 76 74 76 88 C76 102 74 114 70 120 C56 124 36 124 24 118Z" fill="url(#qagPelo)" stroke="#8A5A22" stroke-width="2"/>
  <path d="M22 108 C18 94 26 84 36 84 C46 84 52 94 50 106 C48 116 40 122 32 121 C26 120 23 116 22 108Z" fill="url(#qagPelo)" stroke="#9A6A2E" stroke-width="1.4"/>
  {_pintas_g}
  <path d="M28 76 C34 68 44 64 54 64" stroke="#FFF4D2" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>
  <g stroke-linecap="round"><path d="M58 80 V119 M70 80 V119" stroke="#8A5A22" stroke-width="10.4"/><path d="M58 80 V119 M70 80 V119" stroke="url(#qagPerna)" stroke-width="7.6"/></g>
  {_pintas_p}
  <path d="M54 64 C53 72 56 80 64 84 C71 80 74 72 73 64 C68 61 59 61 54 64Z" fill="url(#qagBarriga)"/>
  <path d="M58 68 q2 3 1 6 M64 70 q1.6 3 0 7 M69 68 q-1.6 3 -1 6" stroke="#E8CFA0" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M53 121 C53 116 63 116 63 121Z M65 121 C65 116 75 116 75 121Z" fill="#FFF2D6" stroke="#8A5A22" stroke-width="1.3"/>
  <path d="M56 120 v-2 M59 120 v-2 M68 120 v-2 M71 120 v-2" stroke="#9A6A2E" stroke-width=".9"/>
  <path d="M42 26 C38 14 46 8 52 14 C54 18 54 22 52 26Z M86 26 C90 14 82 8 76 14 C74 18 74 22 76 26Z" fill="#3A2414" stroke="#2A1A10" stroke-width="1.4"/>
  <path d="M45 24 C43 17 47 14 50 17 M83 24 C85 17 81 14 78 17" stroke="#F4C772" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M40 40 C40 24 52 16 64 16 C76 16 88 24 88 40 C88 54 78 64 64 64 C50 64 40 54 40 40Z" fill="url(#qagPelo)" stroke="#8A5A22" stroke-width="2"/>
  {_pintas_c}
  <path d="M46 26 C52 20 60 18 66 18" stroke="#FFF6DC" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M52 50 C52 42 58 40 64 40 C70 40 76 42 76 50 C76 58 70 62 64 62 C58 62 52 58 52 50Z" fill="url(#qagBarriga)"/>
  <path d="M57 39 C55 46 54 52 57 58 M71 39 C73 46 74 52 71 58" stroke="#2A1A10" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="55" cy="37" rx="5.2" ry="5.6" fill="url(#qagOlho)" stroke="#3A2414" stroke-width="1.2"/><ellipse cx="73" cy="37" rx="5.2" ry="5.6" fill="url(#qagOlho)" stroke="#3A2414" stroke-width="1.2"/>
  <ellipse cx="55.6" cy="37.6" rx="2.8" ry="3.4" fill="#1A1008"/><ellipse cx="73.6" cy="37.6" rx="2.8" ry="3.4" fill="#1A1008"/>
  <circle cx="57" cy="35.6" r="1.5" fill="#fff"/><circle cx="75" cy="35.6" r="1.5" fill="#fff"/><circle cx="54.4" cy="39.6" r=".6" fill="#fff" opacity=".8"/><circle cx="72.4" cy="39.6" r=".6" fill="#fff" opacity=".8"/>
  <path d="M50 31.6 q5 -2.6 10 -.6 M68 31 q5 -2 10 .6" stroke="#5A3A1A" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M60.4 47 C60.4 45 67.6 45 67.6 47 C67.6 49 65.4 50.6 64 50.6 C62.6 50.6 60.4 49 60.4 47Z" fill="#3A2414"/><path d="M62 46.2 q1.6 -.8 3 0" stroke="#A8806A" stroke-width=".8" fill="none"/>
  <path d="M64 50.6 v2.4 M64 53 q-3 3 -6 1 M64 53 q3 3 6 1" stroke="#3A2414" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M50 52 l-10 -1 M50 55 l-9 2 M78 52 l10 -1 M78 55 l9 2" stroke="#9A7A5A" stroke-width=".7"/>
  <ellipse cx="49" cy="47" rx="3.6" ry="2.2" fill="#FF9A7A" opacity=".45"/><ellipse cx="79" cy="47" rx="3.6" ry="2.2" fill="#FF9A7A" opacity=".45"/>
</symbol>''')

# ---------- onagro-persa (asno-selvagem), de lado ----------
S.append(f'''<symbol id="f-onagro" viewBox="0 0 130 120">
  <defs>{lg('qaoPelo', '#F4D6A6', '#D6A46A')}{lg('qaoBranco', '#FFFFFA', '#E6DFD0')}{lg('qaoPerna', '#FFFDF6', '#DCD2C0', 1, 0)}{lg('qaoLonge', '#E6DCCB', '#BFB29E', 1, 0)}{rg('qaoOlho', '#5A3A22', '#2A1A0E', '#120A04', .4, .35)}</defs>
  <ellipse cx="64" cy="114" rx="48" ry="3.6" fill="#2A1A0A" opacity=".2"/>
  <path d="M25 56 C16 60 13 72 15 84" stroke="#7A5232" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M25 56 C16 60 13 72 15 84" stroke="#C8966A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M15 82 C11 88 12 96 15 98 C18 96 19 88 16 82Z" fill="#3A2414"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M36 76 C34 86 33 94 34 109 M88 74 C91 84 92 94 90 109" stroke="#8A7E6A" stroke-width="8"/><path d="M36 76 C34 86 33 94 34 109 M88 74 C91 84 92 94 90 109" stroke="url(#qaoLonge)" stroke-width="5.6"/></g>
  <path d="M30 108 h8 v4.4 h-8Z M86 108 h8 v4.4 h-8Z" fill="#3A2A1E"/>
  <path d="M24 60 C22 48 32 42 46 42 L72 42 C78 41 82 36 86 28 C90 21 95 17 100 17 L106 34 C102 44 99 54 97 66 C95 80 86 86 74 86 L42 86 C30 86 24 74 24 60Z" fill="url(#qaoPelo)" stroke="#7A5232" stroke-width="2" stroke-linejoin="round"/>
  <path d="M27 72 C36 82 72 84 95 72 C93 82 86 87 74 87 L42 87 C34 87 29 82 27 72Z" fill="url(#qaoBranco)"/>
  <path d="M28 70 C40 76 70 77 94 68" stroke="#B88656" stroke-width="1" fill="none" opacity=".5"/>
  <path d="M80 40 C66 43 42 42 28 50" stroke="#5A3A22" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M78 43.4 C64 46 42 45 30 52.6" stroke="#FFF4DC" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M34 50 C46 46 62 46 74 46" stroke="#FFF0D0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M46 78 C45 88 44 96 45 109 M78 78 C80 88 81 96 80 109" stroke="#8A7E6A" stroke-width="8.4"/><path d="M46 78 C45 88 44 96 45 109 M78 78 C80 88 81 96 80 109" stroke="url(#qaoPerna)" stroke-width="6"/></g>
  <path d="M44.6 92 q2 -1 3 0 M80 92 q2 -1 3 0" stroke="#B8AC96" stroke-width="1" fill="none"/>
  <path d="M41 108 h8.6 v4.6 h-8.6Z M76 108 h8.6 v4.6 h-8.6Z" fill="#3A2A1E"/>
  <path d="M80 38 C85 29 91 21 99 15" stroke="#3A2414" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M80 38 C85 29 91 21 99 15" stroke="#6E4A2E" stroke-width="5" fill="none" stroke-dasharray="1.6 1.4"/>
  <path d="M95 14 C92 7 92 2 94 -1 C98 2 99 8 98 15Z" fill="url(#qaoPelo)" stroke="#7A5232" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M101 15 C102 8 105 3 109 1 C110 6 107 12 104 17Z" fill="url(#qaoPelo)" stroke="#7A5232" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M94 2 C94 0 94 -1 94 -1 M108.4 3 L109 1" stroke="#3A2414" stroke-width="3" stroke-linecap="round"/>
  <path d="M95.6 13 C95 9 95 6 95.6 4 M103.4 14 C104 10 105.6 7 107 5" stroke="#F4B8A0" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M94 22 C96 13 108 11 113 19 C117 25 121 32 124 38 C126 44 121 49 115 48.6 C108 48 102 44 98 38 C95 33 93 27 94 22Z" fill="url(#qaoPelo)" stroke="#7A5232" stroke-width="1.8"/>
  <path d="M110 36 C114 33 121 34 123.6 39 C125 45 120 48.6 115 48.4 C110 47.6 108 44 108 40 C108 38 109 37 110 36Z" fill="url(#qaoBranco)" stroke="#A89A84" stroke-width="1"/>
  <ellipse cx="119.6" cy="40" rx="1.6" ry="1.1" fill="#3A2414"/><path d="M113 45.4 q4 1.8 8 -.4" stroke="#6E4A2A" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <ellipse cx="104" cy="26" rx="3.8" ry="4.2" fill="url(#qaoOlho)"/><circle cx="105.4" cy="24.4" r="1.4" fill="#fff"/><circle cx="103.2" cy="28" r=".55" fill="#fff"/>
  <path d="M100.4 21 q3.4 -1.8 7 0" stroke="#3A2414" stroke-width="1" fill="none" stroke-linecap="round"/>
  <ellipse cx="108" cy="34" rx="3.4" ry="1.9" fill="#FF9A8A" opacity=".5"/>
  <path d="M97 20 C100 15 106 14 110 17" stroke="#FFF6E0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>
</symbol>''')

# ---------- romã ----------
_graos = ''
for i in range(26):
    a = R(0, 6.28); r = math.sqrt(R(0, 1)) * 15
    x = 74 + math.cos(a) * r; y = 62 + math.sin(a) * r * .9
    _graos += f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="2.6" ry="3.2" transform="rotate({R(-40, 40):.0f} {x:.1f} {y:.1f})" fill="url(#qarGrao)" stroke="#7A0A1E" stroke-width=".7"/><circle cx="{x - .8:.1f}" cy="{y - 1.2:.1f}" r=".7" fill="#fff" opacity=".8"/>'
S.append(f'''<symbol id="f-roma" viewBox="0 0 110 100">
  <defs>{rg('qarCasca', '#FF8A7A', '#D8283A', '#8A0E22', .35, .3)}{rg('qarGrao', '#FF8AA0', '#E0203E', '#9A0A26', .35, .3)}{lg('qarFolha', '#8ED05A', '#2E7A2A')}{lg('qarPolpa', '#FFF0D8', '#F2D2A8')}{lg('qarFlor', '#FF9A4A', '#E8401E')}</defs>
  <ellipse cx="55" cy="94" rx="42" ry="4" fill="#2A1A0A" opacity=".2"/>
  <path d="M30 12 C20 10 12 16 10 24 C20 26 28 20 30 12Z" fill="url(#qarFolha)" stroke="#1E5A1E" stroke-width="1.3"/><path d="M30 12 C22 16 16 20 11 24" stroke="#C8F0A0" stroke-width=".9" fill="none"/>
  <path d="M30 12 C36 4 46 2 52 6 C46 12 38 14 30 12Z" fill="url(#qarFolha)" stroke="#1E5A1E" stroke-width="1.3"/><path d="M30 12 C38 9 44 7 51 6" stroke="#C8F0A0" stroke-width=".9" fill="none"/>
  <path d="M30 12 C30 16 32 20 34 24" stroke="#6E4A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g transform="translate(88 18)"><path d="M0 8 L-6 -4 L-2 -2 L0 -8 L2 -2 L6 -4Z" fill="url(#qarFlor)" stroke="#9A2A0E" stroke-width="1"/><path d="M-4 8 C-6 2 -2 -2 0 -2 C2 -2 6 2 4 8Z" fill="#E8401E" stroke="#9A2A0E" stroke-width="1"/><path d="M0 8 V14" stroke="#4E7A2A" stroke-width="1.6"/><path d="M-1 0 q1 -2 2 0" stroke="#FFD08A" stroke-width="1" fill="none"/></g>
  <path d="M10 60 C10 40 22 28 38 28 C54 28 66 40 66 60 C66 78 54 90 38 90 C22 90 10 78 10 60Z" fill="url(#qarCasca)" stroke="#6E0A1A" stroke-width="2"/>
  <path d="M32 30 L30 20 L34 24 L38 18 L42 24 L46 20 L44 30Z" fill="#C82A3A" stroke="#6E0A1A" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M18 48 C22 38 30 34 38 34" stroke="#FFC0B8" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".75"/>
  <circle cx="20" cy="56" r="1.6" fill="#FFE0D8" opacity=".8"/>
  <path d="M50 84 C46 72 50 58 60 50 C66 44 78 42 88 46 C98 52 102 64 98 76 C94 88 82 94 70 92 C60 92 52 90 50 84Z" fill="url(#qarCasca)" stroke="#6E0A1A" stroke-width="2"/>
  <path d="M55 78 C54 66 62 54 74 52 C86 50 94 58 94 68 C94 80 84 88 74 88 C64 88 56 86 55 78Z" fill="url(#qarPolpa)" stroke="#C89A6A" stroke-width="1.2"/>
  <path d="M74 52 L74 88 M56 70 L94 68" stroke="#E8C898" stroke-width="1.6"/>
  {_graos}
  <path d="M58 60 C62 54 68 52 74 52" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>
  <g fill="url(#qarGrao)" stroke="#7A0A1E" stroke-width=".7"><ellipse cx="46" cy="90" rx="2.6" ry="3.2"/><ellipse cx="40" cy="92" rx="2.4" ry="3"/><ellipse cx="102" cy="88" rx="2.4" ry="3" transform="rotate(30 102 88)"/></g>
</symbol>''')

# ---------- yakhchal (casa do gelo), com corte mostrando o gelo ----------
_degraus = ''.join(f'<path d="M{30 + k * 4.2:.1f} {78 - k * 7.6:.1f} Q{65} {74 - k * 7.6 - 3:.1f} {100 - k * 4.2:.1f} {78 - k * 7.6:.1f}" stroke="#B88A5C" stroke-width="1.1" fill="none" opacity=".7"/>' for k in range(1, 8))
S.append(f'''<symbol id="f-yakhchal" viewBox="0 0 130 110">
  <defs>{lg('qayCupula', '#F2CC94', '#C8935A', 1, 0)}{lg('qayMuro', '#E8C08A', '#B98656')}{lg('qayChao', '#E8C690', '#C9A06A')}{lg('qayCorte', '#8A5A36', '#5E3A20')}{lg('qayGelo', '#FFFFFF', '#8ED2F2')}{lg('qayCeu', '#2A3A7A', '#5A6AB0')}</defs>
  <ellipse cx="66" cy="104" rx="58" ry="4" fill="#2A1A0A" opacity=".2"/>
  <path d="M4 52 H24 V88 H4Z" fill="url(#qayMuro)" stroke="#7A4E2A" stroke-width="1.6"/><path d="M4 52 l4 -3 h12 l4 3" fill="#F2D4A2" stroke="#7A4E2A" stroke-width="1.2"/>
  <path d="M6 60 h16 M6 68 h16 M6 76 h16 M10 52 v8 M18 60 v8 M10 68 v8 M18 76 v8" stroke="#B88A5C" stroke-width=".8" opacity=".7"/>
  <path d="M2 102 C10 92 30 88 66 88 C102 88 122 92 128 102Z" fill="url(#qayChao)" stroke="#9A6E3E" stroke-width="1.4"/>
  <path d="M30 88 C30 60 48 14 65 6 C82 14 100 60 100 88Z" fill="url(#qayCupula)" stroke="#7A4E2A" stroke-width="2" stroke-linejoin="round"/>
  {_degraus}
  <path d="M60 10 C52 22 42 50 38 80" stroke="#FFE8C2" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M65 6 C70 8 74 12 76 16 C72 20 64 20 60 16 C60 12 62 8 65 6Z" fill="#9A6A3E" stroke="#7A4E2A" stroke-width="1.2"/>
  <path d="M42 88 V70 C42 62 58 58 66 58 C74 58 88 62 88 70 V88Z" fill="#3A2414" stroke="#5E3A20" stroke-width="1.4"/>
  <path d="M46 88 V72 C46 66 58 63 66 63 C74 63 84 66 84 72 V88Z" fill="url(#qayCorte)"/>
  <g stroke="#4E8AB8" stroke-width="1">
    <rect x="49" y="79" width="11" height="8" rx="1.4" fill="url(#qayGelo)"/><rect x="61" y="79" width="11" height="8" rx="1.4" fill="url(#qayGelo)"/><rect x="73" y="79" width="9" height="8" rx="1.4" fill="url(#qayGelo)"/>
    <rect x="54" y="71" width="11" height="8" rx="1.4" fill="url(#qayGelo)"/><rect x="66" y="71" width="11" height="8" rx="1.4" fill="url(#qayGelo)"/>
  </g>
  <path d="M51 80 l3 0 M63 80 l3 0 M56 72 l3 0 M68 72 l3 0" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M100 96 C104 92 120 92 124 96 C120 100 104 100 100 96Z" fill="url(#qayGelo)" stroke="#4E8AB8" stroke-width="1"/><path d="M104 95 h8" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
  <g transform="translate(108 30)"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="#8ED2F2" stroke-width="2" stroke-linecap="round"/><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="#fff" stroke-width=".9" stroke-linecap="round"/></g>
  <g transform="translate(20 22) scale(.7)"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="#8ED2F2" stroke-width="2" stroke-linecap="round"/><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="#fff" stroke-width=".9" stroke-linecap="round"/></g>
</symbol>''')

# ---------- capa: montanha, fila de poços, túnel cortado e jardim na vila ----------
def _yS(x): return 52 + 22 * (1 - math.cos(min(1, max(0, (x - 30) / 90)) * math.pi)) / 2 * 1.0
_poc = ''
for x in [44, 60, 76, 92, 106]:
    yS = _yS(x); yT = 82 + (x - 44) * .05
    _poc += f'<path d="M{x - .8:.1f} {yS + 1:.1f} H{x + .8:.1f} V{yT - 2:.1f} H{x - .8:.1f}Z" fill="#5A3420" opacity=".45"/><path d="M{x - 5:.1f} {yS + .6:.1f} q2.4 -3 3.8 -.8 M{x + 1.2:.1f} {yS - .2:.1f} q1.6 -2.2 3.8 .8" stroke="#7A4A2A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M{x - 5:.1f} {yS + .6:.1f} q2.4 -3 3.8 -.8 M{x + 1.2:.1f} {yS - .2:.1f} q1.6 -2.2 3.8 .8" stroke="#F2C890" stroke-width=".8" fill="none" stroke-linecap="round"/>'
_surf = ' '.join(f'L{x} {_yS(x):.1f}' for x in range(0, 171, 5))
_surfR = ' '.join(f'L{x} {_yS(x) + 6:.1f}' for x in range(170, -1, -5))
S.append(f'''<symbol id="capa-qanat" viewBox="0 0 170 110">
  <defs>{ceu('cpQaC', '#3E8EDC', '#FFE2BC')}{lg('cpQaM', '#D29A70', '#8A5240')}{lg('cpQaS', '#E2AE72', '#9A6236')}{lg('cpQaA', '#8ED4F2', '#3A86C2')}{lg('cpQaP', '#F6DCA8', '#E2B87C')}{lg('cpQaV', '#8ED46A', '#3E8A3A')}{lg('cpQaT', '#40C6D6', '#1E7AA0')}{lg('cpQaB', '#F2CC94', '#C8935A', 1, 0)}</defs>
  <rect width="170" height="110" fill="url(#cpQaC)"/>
  <circle cx="148" cy="16" r="13" fill="#FFE8A8" opacity=".4"/><circle cx="148" cy="16" r="7.4" fill="#FFD447" stroke="#F0A81E" stroke-width=".9"/>
  <use href="#nuvem" x="96" y="8" width="32" height="15" style="color:#fff" opacity=".9"/>
  <path d="M50 54 L74 38 L92 46 L114 34 L140 46 L170 40 V70 H50Z" fill="#CDB8D0" opacity=".85"/><path d="M110 37 L114 34 L119 37Z M70 41 L74 38 L78 41Z" fill="#fff"/>
  <path d="M-4 60 L16 30 L30 12 L40 20 L50 16 L68 38 L84 56Z" fill="url(#cpQaM)" stroke="#5E3A2E" stroke-width="1" stroke-linejoin="round"/>
  <path d="M50 16 L68 38 L84 56 H48 C48 42 50 28 50 16Z" fill="#4E2E2A" opacity=".3"/>
  <path d="M20 26 L30 12 L40 20 L50 16 L56 24 C50 24 48 28 44 26 C40 30 36 26 32 28 C28 24 24 28 20 26Z" fill="#fff" stroke="#A8C2DC" stroke-width=".7"/>
  <path d="M60 54 L170 56 V74 H60Z" fill="url(#cpQaP)"/>
  <g fill="none" stroke="#B88A56" stroke-width="1"><ellipse cx="128" cy="60" rx="2.4" ry=".9"/><ellipse cx="138" cy="61" rx="2.4" ry=".9"/><ellipse cx="148" cy="62" rx="2.4" ry=".9"/></g>
  <g><path d="M120 58 V44 h3 v-6 h4 v6 h5 v14Z" fill="#D8AA70" stroke="#7A4E2A" stroke-width=".7"/><path d="M124 39 v4 M125.6 39 v4" stroke="#5E3A20" stroke-width=".6"/></g>
  <path d="M88 58 C88 48 94 40 97 38 C100 40 106 48 106 58Z" fill="url(#cpQaB)" stroke="#7A4E2A" stroke-width=".8"/><path d="M95 41 C93 46 91 52 91 57" stroke="#FFE8C2" stroke-width="1" fill="none"/>
  <path d="M0 {_yS(0):.1f} {_surf} V110 H0Z" fill="url(#cpQaS)"/>
  <path d="M0 64 C20 64 34 70 46 80 C50 84 52 90 52 110 H0Z" fill="url(#cpQaA)" opacity=".75"/>
  <g fill="#E6F8FF" opacity=".8"><circle cx="10" cy="74" r=".9"/><circle cx="24" cy="82" r=".9"/><circle cx="14" cy="92" r=".9"/><circle cx="34" cy="88" r=".9"/><circle cx="40" cy="100" r=".9"/><circle cx="20" cy="102" r=".9"/></g>
  <path d="M0 {_yS(0):.1f} {_surf}" stroke="#FFF0CC" stroke-width="1.6" fill="none"/>
  <path d="M0 84 C40 86 80 94 120 100 C140 102 160 102 170 102 M60 70 C90 76 120 84 170 86" stroke="#8A5A30" stroke-width=".7" fill="none" opacity=".5"/>
  <path d="M38 82 L122 86" stroke="#3A2414" stroke-width="4.6" stroke-linecap="round"/><path d="M38 83.4 L122 87.2" stroke="#3EA6F0" stroke-width="2" stroke-linecap="round"/>
  <path d="M46 83.8 h6 M66 84.8 h6 M88 85.8 h6 M108 86.6 h6" stroke="#E6F8FF" stroke-width=".9" stroke-linecap="round"/>
  <path d="M36 50 H38.6 V84 H36Z" fill="#6A3E22" opacity=".75"/>
  {_poc}
  <path d="M122 87 C125 84 126 78 126 74.4" stroke="#3EA6F0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M132 74 h26 v5 h-26Z" fill="url(#cpQaT)" stroke="#1E5A7A" stroke-width=".8"/><path d="M131 73.6 h28" stroke="#2EB4C8" stroke-width="1.6"/><path d="M134 75.6 h8 M146 76 h6" stroke="#E6FFFF" stroke-width=".8"/>
  <path d="M145 73 v-8" stroke="#BFF0FF" stroke-width="1.2" stroke-linecap="round"/><path d="M142 67 q3 -4 6 0" stroke="#BFF0FF" stroke-width="1" fill="none"/>
  <path d="M129 74 C127 66 127 56 130.4 46 C134 56 134 66 132 74Z" fill="#2E6A4A" stroke="#1E4A34" stroke-width=".7"/><path d="M130 52 C129 60 129 66 130 72" stroke="#6EAA7A" stroke-width=".7" fill="none"/>
  <path d="{copa(164, 62, 8, 7, 8, .3)}" fill="url(#cpQaV)" stroke="#2E5A22" stroke-width=".8"/><path d="M164 74 v-8" stroke="#6E4A2A" stroke-width="1.6"/><circle cx="160.6" cy="62" r="1.7" fill="#E0283E" stroke="#7A0A1E" stroke-width=".4"/><circle cx="167" cy="64" r="1.5" fill="#E0283E" stroke="#7A0A1E" stroke-width=".4"/>
  <path d="M136 74 q2 -4 4 0 M150 74 q2 -4 4 0" fill="#E8508A" stroke="#2E7A2A" stroke-width=".6"/>
  <svg x="2" y="34" width="24" height="28" viewBox="0 0 110 130"><use class="sem" href="#f-guepardo"/></svg>
  {capim(30, 60, 52, 8, '#9A8A3A', (2, 4), .8)}
</symbol>''')
