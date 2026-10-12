# figurinhas e capa das Sementes do Xingu (executado dentro de gerar_defs2.py, depois do gerar_defs5)
random.seed(211)

# ---------- anta (Tapi, filhote com listras de melancia) ----------
_xi_listras = ''
for _y, _x0, _x1 in [(34, 54, 104), (44, 46, 112), (54, 42, 114), (64, 46, 108), (73, 56, 98)]:
    _x = _x0
    while _x < _x1:
        _w = R(5, 11)
        if R(0, 1) < .72:
            _xi_listras += f'<path d="M{_x:.1f} {_y + R(-1, 1):.1f} q{_w / 2:.1f} -1.6 {_w:.1f} 0" stroke="#F6EAD8" stroke-width="2.4" stroke-linecap="round"/>'
        else:
            _xi_listras += f'<circle cx="{_x + _w / 2:.1f}" cy="{_y:.1f}" r="1.5" fill="#F6EAD8"/>'
        _x += _w + R(2, 4)
_xi_crina = ''.join(f'<path d="M{x:.1f} {y:.1f} l{R(-1, 1):.1f} -4.4" />' for x, y in [(40, 31), (43, 29.4), (46, 28.2), (49, 27.2), (52, 26.6), (55, 26.2)])
S.append(f'''<symbol id="f-anta" viewBox="0 0 130 100">
  <defs>{lg('xiaCorpo', '#86726A', '#3E302C')}{rg('xiaCab', '#9A867C', '#6E5A52', '#463832', .4, .32)}{lg('xiaChao', '#8ED06A', '#4E9A3A')}<clipPath id="xiaClip"><path d="M34 56 C32 38 50 26 74 26 C98 26 116 38 116 56 C116 72 104 80 84 80 C66 81 46 80 38 72 C35 68 34 62 34 56Z"/></clipPath></defs>
  <ellipse cx="66" cy="93" rx="56" ry="5" fill="#0A1440" opacity=".18"/>
  <path d="M6 95 C20 86 108 85 126 95Z" fill="url(#xiaChao)" stroke="#2E6A2A" stroke-width="1.2"/>
  {capim(10, 122, 93, 26, '#2E6A2A', (3, 7), 1.1)}
  <path d="M50 70 L49.4 87 C49.4 90 58 90 58 87 L57 70Z M100 68 L99.4 86 C99.4 89 108 89 108 86 L107 68Z" fill="#3A2C28" stroke="#1E1412" stroke-width="1.2"/>
  <path d="M114 48 C120 46 122 52 118 56" stroke="#3E302C" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M34 56 C32 38 50 26 74 26 C98 26 116 38 116 56 C116 72 104 80 84 80 C66 81 46 80 38 72 C35 68 34 62 34 56Z" fill="url(#xiaCorpo)" stroke="#241A16" stroke-width="2"/>
  <g clip-path="url(#xiaClip)" opacity=".8">{_xi_listras}</g>
  <path d="M56 32 C70 28 92 28 106 38" stroke="#C8B4A8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M40 70 L39.4 88 C39.4 91 48 91 48 88 L47 70Z M90 70 L89.4 88 C89.4 91 98 91 98 88 L97 70Z" fill="url(#xiaCorpo)" stroke="#241A16" stroke-width="1.4"/>
  <path d="M40.4 87.6 h7 M90.4 87.6 h7" stroke="#C8B8A8" stroke-width="1.4" stroke-linecap="round"/><path d="M42 89 v-2 M44.6 89 v-2 M92 89 v-2 M94.6 89 v-2" stroke="#241A16" stroke-width=".8"/>
  <path d="M38 31.6 C44 27.6 51 25.8 58 25.6" stroke="#241A16" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M39 30.6 C44 27.6 50 26.2 56 26" stroke="#7A665E" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M46 36 C42 27 28 25 21 29 C16 31 12 33 7 35 C3 36.6 1.6 41 2.6 45.6 C3.4 49.4 6.6 50.6 8.6 48.4 C10 47 11.6 47.4 13 49 C15 57 25 63.6 35 63.6 C44 63.6 49 57 49 49 C49 44 48 40 46 36Z" fill="url(#xiaCab)" stroke="#241A16" stroke-width="2" stroke-linejoin="round"/>
  <path d="M4.6 38.6 C3.6 41 3.8 43.4 4.8 45" stroke="#241A16" stroke-width="1" fill="none" opacity=".6"/><ellipse cx="4.4" cy="44.6" rx="1.2" ry="1" fill="#241A16"/>
  <path d="M8 36.6 q6 -3 12 -3.4" stroke="#E8D8CC" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M8 40 q2 .8 3.4 0 M8.6 43 q2 .8 3.4 0" stroke="#241A16" stroke-width=".8" fill="none" opacity=".5"/>
  <path d="M14.6 55 q5 3.6 10.4 1.4" stroke="#241A16" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="41" cy="27" r="6.6" fill="#5A4640" stroke="#F4EADC" stroke-width="2"/><circle cx="41" cy="27.6" r="3.4" fill="#C88A8A"/>
  <path d="M20 34 C26 30 34 30 40 33" stroke="#F0E2D6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
  <ellipse cx="27.4" cy="43" rx="3.8" ry="4.4" fill="#1A100E"/><circle cx="28.8" cy="41.4" r="1.6" fill="#fff"/><circle cx="26.4" cy="44.8" r=".7" fill="#fff"/>
  <path d="M23 37.4 q4 -2.4 8 -.4" stroke="#241A16" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="25" cy="52.4" rx="4" ry="2.2" fill="#FF8A9A" opacity=".5"/>
  <g fill="#F6EAD8" opacity=".75"><circle cx="36" cy="44" r="1.2"/><circle cx="38" cy="52" r="1.4"/><circle cx="33" cy="58" r="1"/></g>
</symbol>''')

# ---------- tracajá ----------
_xi_escudos = '<g stroke="#1E2414" stroke-width="1.2" fill="none" opacity=".75">' \
    '<path d="M60 26 L58 40 L74 46 L90 40 L88 26"/><path d="M58 40 L44 50 M74 46 L74 60 M90 40 L104 50"/><path d="M44 50 L60 58 L74 60 L90 58 L104 50"/><path d="M42 36 L58 40 M106 36 L90 40"/></g>'
S.append(f'''<symbol id="f-tracaja" viewBox="0 0 140 90">
  <defs>{lg('xitCasco', '#7A8A56', '#2E3620')}{rg('xitCab', '#6E7A5A', '#4A5638', '#2E3620', .4, .32)}{lg('xitAgua', '#7FD0F0', '#2E7BC6')}{lg('xitBorda', '#D8C88A', '#9A8A4E')}</defs>
  <ellipse cx="72" cy="80" rx="64" ry="8.6" fill="url(#xitAgua)" stroke="#1E5AA0" stroke-width="1.3"/>
  {ondas(14, 128, 80, '#E6F6FF', 1.3, .85)}
  <path d="M112 62 C122 62 130 68 128 74 C120 74 112 70 108 66Z" fill="url(#xitCab)" stroke="#1E2414" stroke-width="1.3"/>
  <path d="M30 62 C29 36 52 22 78 22 C104 22 124 36 126 60 C110 68 50 70 30 62Z" fill="url(#xitCasco)" stroke="#1E2414" stroke-width="2"/>
  {_xi_escudos}
  <path d="M30 62 C50 70 110 68 126 60 C124 66 118 70 110 72 C84 76 52 76 38 70 C33 68 30 66 30 62Z" fill="url(#xitBorda)" stroke="#1E2414" stroke-width="1.4"/>
  <path d="M44 66 v6 M56 68 v7 M70 69 v7 M84 69 v7 M98 68 v6 M110 66 v5" stroke="#6E6030" stroke-width="1" opacity=".7"/>
  <path d="M46 34 C58 26 76 24 92 26" stroke="#C8D8A0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
  <path d="M38 64 C34 70 28 74 22 76 C26 80 36 78 44 72Z" fill="url(#xitCab)" stroke="#1E2414" stroke-width="1.3"/><path d="M23 76 l-3 2 M26 77.6 l-2 2.4 M29 78 l-1 2.6" stroke="#1E2414" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M38 56 C32 52 26 50 22 50 L24 60 C28 61 34 62 38 62Z" fill="url(#xitCab)" stroke="#1E2414" stroke-width="1.4"/>
  <ellipse cx="17" cy="48" rx="14" ry="11" fill="url(#xitCab)" stroke="#1E2414" stroke-width="1.8"/>
  <g fill="#FFD23A" stroke="#A8800A" stroke-width=".5"><ellipse cx="18" cy="40" rx="4" ry="2.2"/><ellipse cx="26" cy="45" rx="2.4" ry="1.8"/><ellipse cx="9" cy="41.4" rx="2" ry="1.4"/><ellipse cx="23" cy="54" rx="3" ry="1.4"/><ellipse cx="30" cy="52" rx="1.6" ry="1.1"/></g>
  <ellipse cx="12" cy="46.6" rx="3.6" ry="4.2" fill="#14140E"/><circle cx="13.4" cy="45" r="1.4" fill="#fff"/><circle cx="11.2" cy="48.4" r=".6" fill="#fff"/>
  <path d="M5 53 q4.4 3.4 10 1.6" stroke="#14140E" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="18" cy="53" rx="3" ry="1.6" fill="#FF9AA8" opacity=".5"/>
  <path d="M8 38.6 q6 -3.4 13 -1.4" stroke="#C8D8A0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
</symbol>''')

# ---------- jatobá: vagem aberta e folhas em par ----------
def _xi_folha_par(x, y, a, k=1):
    f = '<path d="M0 0 C-2 -8 -12 -16 -20 -14 C-18 -6 -10 -1 0 0Z" fill="url(#xijFolha)" stroke="#1E5A2A" stroke-width="1"/><path d="M0 0 C2 -8 12 -16 20 -14 C18 -6 10 -1 0 0Z" fill="url(#xijFolha)" stroke="#1E5A2A" stroke-width="1"/><path d="M0 0 L-15 -12 M0 0 L15 -12" stroke="#A8E08A" stroke-width=".8"/>'
    return f'<g transform="translate({x} {y}) rotate({a}) scale({k})">{f}</g>'
_xi_farinha = ''.join(f'<circle cx="{R(22, 98):.1f}" cy="{R(55, 62):.1f}" r="{R(.6, 1.3):.1f}" fill="#FFF6C8" opacity=".9"/>' for _ in range(30))
S.append(f'''<symbol id="f-jatoba" viewBox="0 0 120 100">
  <defs>{lg('xijCasca', '#9A5A34', '#4A220E')}{lg('xijTampa', '#7A4220', '#3A1A08')}{rg('xijFarinha', '#FFF2B0', '#EAD488', '#C8AE60', .5, .4)}{rg('xijSem', '#C86A3A', '#8A3E1A', '#5A220A')}{lg('xijFolha', '#7ED05A', '#2E8A3A', 1, 1)}</defs>
  <ellipse cx="60" cy="90" rx="50" ry="5.4" fill="#0A1440" opacity=".18"/>
  <path d="M58 28 C70 22 82 20 98 16" stroke="#3E2A14" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M58 28 C70 22 82 20 98 16" stroke="#8A6A44" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  {_xi_folha_par(76, 22, -30, .9)}{_xi_folha_par(94, 18, 25, .8)}
  <path d="M14 54 C18 34 42 26 64 28 C88 30 104 38 107 52 C90 44 40 42 14 54Z" fill="url(#xijTampa)" stroke="#2A1206" stroke-width="1.6"/>
  <path d="M26 44 C40 34 62 32 84 36" stroke="#C8865A" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M12 58 C16 76 40 84 62 84 C86 84 104 76 108 58 C90 52 34 52 12 58Z" fill="url(#xijCasca)" stroke="#2A1206" stroke-width="1.8"/>
  <path d="M20 66 C30 76 50 80 66 80" stroke="#D8A07A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
  <ellipse cx="60" cy="58" rx="46" ry="7.6" fill="url(#xijFarinha)" stroke="#8A6A2A" stroke-width="1.1"/>
  {_xi_farinha}
  <g stroke="#3A1206" stroke-width="1.1"><ellipse cx="38" cy="57" rx="8.4" ry="5" fill="url(#xijSem)"/><ellipse cx="60" cy="58.6" rx="9" ry="5.2" fill="url(#xijSem)"/><ellipse cx="82" cy="57" rx="8.4" ry="5" fill="url(#xijSem)"/></g>
  <g fill="#FFE6C8" opacity=".85"><ellipse cx="35" cy="55.4" rx="3" ry="1.2"/><ellipse cx="57" cy="57" rx="3.2" ry="1.2"/><ellipse cx="79" cy="55.4" rx="3" ry="1.2"/></g>
  <path d="M30 60 q8 3 16 0 M52 62 q8 3 16 0 M74 60 q8 3 16 0" stroke="#EAD488" stroke-width="2" fill="none" opacity=".9"/>
</symbol>''')

# ---------- ipê-amarelo: galho florido ----------
def _xi_flor(x, y, a, k=1):
    lob = ''.join(f'<ellipse cx="{math.cos(t) * 6:.1f}" cy="{-13 + math.sin(t) * 3:.1f}" rx="4.6" ry="3.8" fill="url(#xiyPet)" stroke="#B87A08" stroke-width=".7"/>' for t in [3.6, 4.3, 5.0, 5.7, 6.4])
    return (f'<g transform="translate({x} {y}) rotate({a}) scale({k})">'
            f'<path d="M-2.4 0 C-3.4 -4 -5 -8 -6.4 -12 H6.4 C5 -8 3.4 -4 2.4 0Z" fill="url(#xiyTubo)" stroke="#B87A08" stroke-width=".8"/>{lob}'
            f'<ellipse cx="0" cy="-12.6" rx="4" ry="2" fill="#FFB02A"/><path d="M-1.6 -12 l-.6 -3 M0 -12 v-3.6 M1.6 -12 l.6 -3" stroke="#C8501A" stroke-width=".7"/>'
            f'<path d="M-4 -16 q2 -1.6 4 -1" stroke="#FFFBD0" stroke-width=".9" fill="none"/></g>')
S.append(f'''<symbol id="f-ipeamarelo" viewBox="0 0 110 120">
  <defs>{lg('xiyGalho', '#8A8070', '#4A4038', 1, 0)}{lg('xiyPet', '#FFF07A', '#FFC81E')}{lg('xiyTubo', '#FFE45A', '#E89A0A')}{lg('xiyVagem', '#B8A880', '#6E5E3A', 1, 0)}</defs>
  <ellipse cx="56" cy="114" rx="44" ry="4.6" fill="#0A1440" opacity=".16"/>
  <path d="M10 112 C22 96 34 80 48 66 C60 56 70 46 82 36" stroke="#2E2620" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M10 112 C22 96 34 80 48 66 C60 56 70 46 82 36" stroke="url(#xiyGalho)" stroke-width="5.6" fill="none" stroke-linecap="round"/>
  <path d="M48 66 C44 54 44 46 48 40 M66 50 C72 52 78 56 82 62" stroke="#2E2620" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M48 66 C44 54 44 46 48 40 M66 50 C72 52 78 56 82 62" stroke="#8A8070" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M14 104 C22 92 32 82 44 72" stroke="#C8C0B0" stroke-width="1.4" fill="none" opacity=".7"/>
  <path d="M32 84 C34 92 33 102 30 110 C29 112 27 112 27 110 C29 102 30 92 30 84Z" fill="url(#xiyVagem)" stroke="#4E3E1E" stroke-width="1.1"/>
  {''.join(_xi_flor(x, y, a, k) for x, y, a, k in [(48, 42, -20, 1), (40, 46, -60, .95), (56, 38, 20, 1), (49, 32, -5, 1.05), (82, 38, 10, 1), (76, 34, -40, .95), (90, 36, 45, .9), (83, 28, -10, 1.05), (84, 64, 70, .9), (80, 58, 30, .95)])}
  <g transform="translate(80 94) rotate(-14)"><path d="M-12 0 C-9 -4 -3 -3.4 0 -1.4 C3 -3.4 9 -4 12 0 C9 4 3 3.4 0 1.4 C-3 3.4 -9 4 -12 0Z" fill="#FFF6DC" fill-opacity=".9" stroke="#A8945A" stroke-width=".8"/><ellipse rx="3" ry="2.2" fill="#7A5A2A"/></g>
</symbol>''')

# ---------- capa ----------
_xi_casa = lambda x, y, w, h: (f'<path d="M{x - w / 2} {y} C{x - w / 2} {y - h * .62:.1f} {x - w * .3:.1f} {y - h} {x} {y - h} C{x + w * .3:.1f} {y - h} {x + w / 2} {y - h * .62:.1f} {x + w / 2} {y}Z" fill="#E2BE6E" stroke="#7A5420" stroke-width=".9"/>'
                               f'<path d="M{x - w * .36:.1f} {y - h * .4:.1f} q{w * .1:.1f} {-h * .4:.1f} {w * .34:.1f} {-h * .5:.1f}" stroke="#FFF2C8" stroke-width="1.2" fill="none" opacity=".7"/>'
                               f'<path d="M{x - w * .44:.1f} {y - h * .3:.1f} Q{x} {y - h * .2:.1f} {x + w * .44:.1f} {y - h * .3:.1f} M{x - w * .48:.1f} {y - h * .12:.1f} Q{x} {y - h * .02:.1f} {x + w * .48:.1f} {y - h * .12:.1f}" stroke="#A87A32" stroke-width=".8" fill="none"/>'
                               f'<path d="M{x - 3} {y} V{y - h * .36:.1f} Q{x} {y - h * .44:.1f} {x + 3} {y - h * .36:.1f} V{y}Z" fill="#3A220E"/>')
_xi_arv = lambda x, y, rx, ry, c0, c1, esc: f'<path d="M{x} {y} V{y - ry * 1.4:.1f}" stroke="#5A3A22" stroke-width="2.4"/><path d="{copa(x, y - ry * 2, rx, ry, 10, .3)}" fill="{c1}" stroke="{esc}" stroke-width="1"/><path d="{copa(x - rx * .2, y - ry * 2.2, rx * .7, ry * .7, 8, .3)}" fill="{c0}" opacity=".8"/>'
S.append(f'''<symbol id="capa-xingu" viewBox="0 0 170 110">
  <defs>{ceu('cpXiC', '#74C4F0', '#FFF0D6')}{ceu('cpXiR', '#7ECDE0', '#2E86B0')}{ceu('cpXiP', '#EEC88E', '#C8925A')}{ceu('cpXiM', '#7CB86A', '#3E7A44')}</defs>
  <rect width="170" height="110" fill="url(#cpXiC)"/>
  <circle cx="142" cy="18" r="10" fill="#FFE27A" opacity=".35"/><circle cx="142" cy="18" r="6.4" fill="#FFC83D" stroke="#F0A01E" stroke-width=".8"/>
  <use href="#nuvem" x="40" y="6" width="44" height="20" style="color:#fff" opacity=".9"/>
  <path d="{copa(30, 48, 40, 8, 12, .4)}" fill="#A6CCBA"/><path d="{copa(120, 46, 60, 9, 14, .4)}" fill="#A6CCBA"/>
  <path d="M0 52 C40 46 120 48 170 50 V60 H0Z" fill="url(#cpXiM)"/>
  {''.join(f'<path d="{copa(x, 52, 9, 5, 7, .4)}" fill="#4E8A54" stroke="#2E5A3A" stroke-width=".6"/>' for x in range(4, 170, 14))}
  <path d="M0 58 H170 V70 C120 66 60 72 0 68Z" fill="url(#cpXiR)"/><path d="M10 62 q4 -1.6 8 0 M70 64 q5 -1.6 10 0 M130 62 q4 -1.6 8 0" stroke="#E6F6FF" stroke-width=".9" fill="none"/>
  <path d="M0 68 C60 72 120 66 170 70 V110 H0Z" fill="url(#cpXiP)"/>
  <path d="M0 68 C60 72 120 66 170 70 V73 C120 69 60 75 0 71Z" fill="#FBF0D6"/>
  {_xi_casa(28, 72, 40, 24)}
  <g transform="translate(100 64)"><path d="M-16 0 C-10 3 12 3 18 -1 C14 4 10 5 6 5 H-10 C-14 5 -16 3 -16 0Z" fill="#7A4A2A" stroke="#3A1E0E" stroke-width=".7"/><circle cx="2" cy="-8" r="2.2" fill="#9C6844"/><path d="M0 -6 h4 v5 h-4Z" fill="#3EA86A"/><path d="M-2 -14 L6 4" stroke="#7A5232" stroke-width=".8"/></g>
  {_xi_arv(150, 80, 16, 11, '#FFF08A', '#FFC83D', '#A86A08')}{_xi_arv(128, 82, 14, 10, '#8ED07A', '#3E8A4A', '#1E5A2A')}{_xi_arv(162, 92, 10, 7, '#F6B8E0', '#C870B0', '#7A2E7A')}
  <path d="M96 110 C100 98 112 92 130 94 C150 92 166 98 170 104 V110Z" fill="#9A5A2E"/>
  {''.join(f'<g transform="translate({x} {y})"><path d="M0 0 v-5" stroke="#3E7A1E" stroke-width="1"/><path d="M0 -4 c-3 -3 -6 -1 -6 1 c2 1 4 0 6 -1Z M0 -4 c3 -3 6 -1 6 1 c-2 1 -4 0 -6 -1Z" fill="#8ED85A" stroke="#2E6A1A" stroke-width=".5"/></g>' for x, y in [(108, 102), (118, 99), (138, 100), (150, 104), (160, 102)])}
  <g transform="translate(124 104)"><path d="M-12 -8 C-12 0 -9 6 -7 7 C-3 8 3 8 7 7 C9 6 12 0 12 -8Z" fill="#D8A860" stroke="#6E4418" stroke-width=".9"/><path d="M-11 -2 H11 M-10 3 H10" stroke="#8A5A22" stroke-width=".7"/><ellipse cx="0" cy="-8" rx="12" ry="2.6" fill="#3A220E"/>
    {''.join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="{c}"/>' for x, y, c in [(-7, -9, '#7A3E1E'), (-3, -10, '#FFB02A'), (1, -9, '#FFFDF2'), (5, -10, '#A0683A'), (8, -9, '#FFB02A'), (-1, -11, '#7A3E1E')])}</g>
  <svg x="40" y="70" width="52" height="40" viewBox="0 0 130 100"><use class="sem" href="#f-anta"/></svg>
  <svg x="2" y="80" width="30" height="22" viewBox="0 0 140 90"><use class="sem" href="#f-tracaja"/></svg>
</symbol>''')
