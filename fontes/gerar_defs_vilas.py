# Vilas sobre a água: 4 cartões-postais (170x110) e os 4 materiais da base (100x50)
# executado dentro de gerar_defs2.py, depois do gerar_defs5.py (usa lg, rg, ondas, copa, tex, capim, R, S)
random.seed(97)

def vl_lg(i, *cores, x2=0, y2=1):
    n = len(cores) - 1
    return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">' + ''.join(f'<stop offset="{k / n:.2f}" stop-color="{c}"/>' for k, c in enumerate(cores)) + '</linearGradient>'

def vl_cartao(sid, pre, defs, corpo):
    S.append(f'''<symbol id="{sid}" viewBox="0 0 170 110">
  <defs>{defs}<radialGradient id="{pre}Vh" cx=".5" cy=".46" r=".78"><stop offset=".66" stop-color="#0A1A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A3A" stop-opacity=".26"/></radialGradient><clipPath id="{pre}Cl"><rect width="170" height="110"/></clipPath></defs>
  <g clip-path="url(#{pre}Cl)">{corpo}<rect width="170" height="110" fill="url(#{pre}Vh)"/></g>
  <rect x="1.2" y="1.2" width="167.6" height="107.6" rx="2" fill="none" stroke="#fff" stroke-width="2.4"/>
</symbol>''')

def vl_gente(x, y, s, pele, roupa, cabelo='#2E1A0E', chapeu=None, aceno=False, saia=None):
    """pessoinha de frente; (x, y) = pés"""
    tinta = '#2A1A10'
    corpo = (f'<path d="M{x - 5 * s:.1f} {y - 1 * s:.1f} L{x - 4 * s:.1f} {y - 13 * s:.1f} C{x - 4 * s:.1f} {y - 17 * s:.1f} {x + 4 * s:.1f} {y - 17 * s:.1f} {x + 4 * s:.1f} {y - 13 * s:.1f} L{x + 5 * s:.1f} {y - 1 * s:.1f}Z" fill="{roupa}" stroke="{tinta}" stroke-width="{.8 * s:.2f}" stroke-linejoin="round"/>')
    if saia:
        corpo += f'<path d="M{x - 4.4 * s:.1f} {y - 8 * s:.1f} L{x - 7 * s:.1f} {y:.1f} H{x + 7 * s:.1f} L{x + 4.4 * s:.1f} {y - 8 * s:.1f}Z" fill="{saia}" stroke="{tinta}" stroke-width="{.8 * s:.2f}" stroke-linejoin="round"/><path d="M{x - 6 * s:.1f} {y - 2.4 * s:.1f} H{x + 6 * s:.1f}" stroke="#FFE27A" stroke-width="{1.1 * s:.2f}"/>'
    braco = (f'<path d="M{x + 3.6 * s:.1f} {y - 13 * s:.1f} l{4 * s:.1f} {-7 * s:.1f}" stroke="{pele}" stroke-width="{2.2 * s:.2f}" stroke-linecap="round"/>' if aceno else
             f'<path d="M{x + 3.8 * s:.1f} {y - 13 * s:.1f} l{1.4 * s:.1f} {6 * s:.1f}" stroke="{pele}" stroke-width="{2 * s:.2f}" stroke-linecap="round"/>')
    braco += f'<path d="M{x - 3.8 * s:.1f} {y - 13 * s:.1f} l{-1.4 * s:.1f} {6 * s:.1f}" stroke="{pele}" stroke-width="{2 * s:.2f}" stroke-linecap="round"/>'
    cab = (f'<circle cx="{x}" cy="{y - 21 * s:.1f}" r="{4.6 * s:.2f}" fill="{pele}" stroke="{tinta}" stroke-width="{.8 * s:.2f}"/>'
           f'<path d="M{x - 4.6 * s:.1f} {y - 21.6 * s:.1f} C{x - 4.4 * s:.1f} {y - 27.4 * s:.1f} {x + 4.4 * s:.1f} {y - 27.4 * s:.1f} {x + 4.6 * s:.1f} {y - 21.6 * s:.1f} C{x + 2 * s:.1f} {y - 23.6 * s:.1f} {x - 2 * s:.1f} {y - 23.6 * s:.1f} {x - 4.6 * s:.1f} {y - 21.6 * s:.1f}Z" fill="{cabelo}"/>'
           f'<circle cx="{x - 1.6 * s:.1f}" cy="{y - 20.6 * s:.1f}" r="{.6 * s:.2f}" fill="{tinta}"/><circle cx="{x + 1.6 * s:.1f}" cy="{y - 20.6 * s:.1f}" r="{.6 * s:.2f}" fill="{tinta}"/>'
           f'<path d="M{x - 1.4 * s:.1f} {y - 18.6 * s:.1f} q{1.4 * s:.1f} {1 * s:.1f} {2.8 * s:.1f} 0" stroke="{tinta}" stroke-width="{.5 * s:.2f}" fill="none"/>')
    if chapeu == 'coco':
        cab += f'<path d="M{x - 6 * s:.1f} {y - 24.4 * s:.1f} H{x + 6 * s:.1f} M{x - 3.4 * s:.1f} {y - 24.4 * s:.1f} C{x - 3.4 * s:.1f} {y - 30 * s:.1f} {x + 3.4 * s:.1f} {y - 30 * s:.1f} {x + 3.4 * s:.1f} {y - 24.4 * s:.1f}" fill="#3A2A22" stroke="#3A2A22" stroke-width="{1.4 * s:.2f}" stroke-linecap="round"/>'
    elif chapeu == 'palha':
        cab += f'<path d="M{x - 9 * s:.1f} {y - 23.4 * s:.1f} C{x - 4 * s:.1f} {y - 25 * s:.1f} {x + 4 * s:.1f} {y - 25 * s:.1f} {x + 9 * s:.1f} {y - 23.4 * s:.1f} C{x + 5 * s:.1f} {y - 32 * s:.1f} {x - 5 * s:.1f} {y - 32 * s:.1f} {x - 9 * s:.1f} {y - 23.4 * s:.1f}Z" fill="#F2D27A" stroke="#8A6A1E" stroke-width="{.7 * s:.2f}"/>'
    elif chapeu == 'bone':
        cab += f'<path d="M{x - 4.6 * s:.1f} {y - 23 * s:.1f} C{x - 4.4 * s:.1f} {y - 28 * s:.1f} {x + 4.4 * s:.1f} {y - 28 * s:.1f} {x + 4.6 * s:.1f} {y - 23 * s:.1f}Z M{x + 3 * s:.1f} {y - 23.6 * s:.1f} h{4.4 * s:.1f}" fill="#E5392C" stroke="#E5392C" stroke-width="{1.2 * s:.2f}" stroke-linecap="round"/>'
    return braco + corpo + cab

def vl_canoa(x, y, w, cor='#7A4422', esc='#3E1E0C'):
    return (f'<path d="M{x - w / 2:.1f} {y - 3:.1f} C{x - w / 3:.1f} {y + 3:.1f} {x + w / 3:.1f} {y + 3:.1f} {x + w / 2:.1f} {y - 3:.1f} C{x + w / 4:.1f} {y - 1:.1f} {x - w / 4:.1f} {y - 1:.1f} {x - w / 2:.1f} {y - 3:.1f}Z" fill="{cor}" stroke="{esc}" stroke-width="1" stroke-linejoin="round"/>'
            f'<path d="M{x - w / 2.6:.1f} {y - 1.4:.1f} C{x - w / 6:.1f} {y:.1f} {x + w / 6:.1f} {y:.1f} {x + w / 2.6:.1f} {y - 1.4:.1f}" stroke="#C88A52" stroke-width=".8" fill="none"/>')

def vl_junco(x, y, h, inc, cor='#6E9A3A', ponta=True):
    s = f'<path d="M{x:.1f} {y:.1f} q{inc * .3:.1f} {-h * .5:.1f} {inc:.1f} {-h:.1f}" stroke="#3E5E1E" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M{x:.1f} {y:.1f} q{inc * .3:.1f} {-h * .5:.1f} {inc:.1f} {-h:.1f}" stroke="{cor}" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
    if ponta:
        s += f'<ellipse cx="{x + inc * .95:.1f}" cy="{y - h * .88:.1f}" rx="1.3" ry="2.6" fill="#8A5A26" transform="rotate({inc * 2:.0f} {x + inc * .95:.1f} {y - h * .88:.1f})"/>'
    return s

def vl_ondas(x0, x1, y, cor, w=.9, op=.7, passo=10):
    n = int((x1 - x0) / passo)
    return f'<path d="M{x0} {y} ' + ' '.join(f'q{passo / 4:.1f} -1.6 {passo / 2:.1f} 0 t{passo / 2:.1f} 0' for _ in range(n)) + f'" stroke="{cor}" stroke-width="{w}" fill="none" opacity="{op}" stroke-linecap="round"/>'

def vl_nuvem(x, y, s, cor='#fff', sombra='#C8D8EE'):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-16 4 C-20 4 -20 -3 -14 -3 C-14 -10 -4 -12 0 -6 C3 -12 13 -11 13 -3 C19 -4 20 4 15 4Z" fill="{sombra}"/>'
            f'<path d="M-16 2 C-20 2 -20 -5 -14 -5 C-14 -12 -4 -14 0 -8 C3 -14 13 -13 13 -5 C19 -6 20 2 15 2Z" fill="{cor}"/></g>')

def vl_ave(x, y, s=1, cor='#2E3A5A'):
    return f'<path d="M{x - 4 * s:.1f} {y:.1f} q{2 * s:.1f} {-2.4 * s:.1f} {4 * s:.1f} 0 q{2 * s:.1f} {-2.4 * s:.1f} {4 * s:.1f} 0" stroke="{cor}" stroke-width="{.9 * s:.2f}" fill="none" stroke-linecap="round"/>'

# =========================================================
# 1. Ilhas de totora, Lago Titicaca
# =========================================================
def ur_cabana(x, y, w, h, porta='#E5392C'):
    """cabana de totora com teto em arco; (x, y) = chão"""
    linhas = ''.join(f'<path d="M{x - w / 2 + k * w / 8:.1f} {y - 1:.1f} V{y - h + 1:.1f}" stroke="#A8862E" stroke-width=".6"/>' for k in range(1, 8))
    teto = f'M{x - w / 2 - 2:.1f} {y - h:.1f} C{x - w / 2:.1f} {y - h - w * .55:.1f} {x + w / 2:.1f} {y - h - w * .55:.1f} {x + w / 2 + 2:.1f} {y - h:.1f}Z'
    palha = ''.join(f'<path d="M{x - w / 2 + k * w / 7:.1f} {y - h - 1:.1f} Q{x:.1f} {y - h - w * .5:.1f} {x:.1f} {y - h - w * .42:.1f}" stroke="#B8932E" stroke-width=".55" fill="none" opacity=".8"/>' for k in range(1, 7))
    return (f'<rect x="{x - w / 2:.1f}" y="{y - h:.1f}" width="{w}" height="{h}" fill="url(#vpUrPal)" stroke="#7A5A14" stroke-width="1"/>{linhas}'
            f'<path d="{teto}" fill="url(#vpUrTeto)" stroke="#7A5A14" stroke-width="1.1" stroke-linejoin="round"/>{palha}'
            f'<path d="M{x - w / 2 + 2:.1f} {y - h - 2:.1f} C{x - w / 4:.1f} {y - h - w * .36:.1f} {x:.1f} {y - h - w * .42:.1f} {x + 2:.1f} {y - h - w * .42:.1f}" stroke="#FFF2B0" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"/>'
            f'<path d="M{x - 3:.1f} {y:.1f} V{y - h * .62:.1f} H{x + 3:.1f} V{y:.1f}Z" fill="{porta}" stroke="#5A1A10" stroke-width=".7"/><path d="M{x - 3:.1f} {y - h * .42:.1f} H{x + 3:.1f}" stroke="#FFD447" stroke-width=".8"/>')

def ur_balsa(x, y, s):
    """barco de totora com proa de cabeça de puma"""
    return (f'<g transform="translate({x} {y}) scale({s})">'
            f'<path d="M-24 -2 C-20 6 18 6 22 -2 C18 -6 -18 -6 -24 -2Z" fill="url(#vpUrPal)" stroke="#6E4E10" stroke-width="1.1"/>'
            f'<path d="M-20 0 C-8 3 8 3 18 0 M-21 -3 C-8 0 8 0 19 -3" stroke="#A8862E" stroke-width=".7" fill="none"/>'
            f'<path d="M-12 -4 v8 M0 -4 v8 M12 -4 v8" stroke="#6E4E10" stroke-width="1"/>'
            f'<path d="M20 -2 C26 -6 28 -12 26 -18 C30 -20 33 -17 31 -13 C30 -9 27 -5 22 -1Z" fill="url(#vpUrTeto)" stroke="#6E4E10" stroke-width="1" stroke-linejoin="round"/>'
            f'<path d="M26 -18 l-1 -3 l3 1.6 Z" fill="#C8A040" stroke="#6E4E10" stroke-width=".6"/><circle cx="29" cy="-15.6" r=".8" fill="#2A1A10"/>'
            f'<path d="M-22 -2 C-28 -6 -30 -11 -28 -14 C-25 -12 -24 -8 -20 -4Z" fill="url(#vpUrTeto)" stroke="#6E4E10" stroke-width="1" stroke-linejoin="round"/>'
            f'</g>')

ur_serra = 'M-2 60 L8 50 L16 53 L26 40 L32 44 L40 36 L48 46 L58 42 L68 50 L80 44 L90 33 L98 41 L108 38 L118 47 L130 42 L142 34 L152 44 L162 40 L172 46 V62 H-2Z'
ur_neve = ('M26 40 L32 44 L29 45 L26 43 L23 46 L21 44Z M40 36 L45 41 L42 42 L40 40 L37 43 L35 41Z M90 33 L96 39 L93 40 L90 38 L87 41 L85 39Z '
           'M108 38 L113 42 L110 43 L108 41 L105 43Z M142 34 L148 40 L145 41 L142 39 L139 42 L137 40Z')
ur_tufos = ''.join(vl_junco(x, y, R(10, 18), R(-3, 3)) for x, y in [(2, 64), (5, 66), (8, 63), (11, 65), (14, 64), (152, 66), (156, 64), (160, 67), (164, 64), (167, 66)])
ur_tufos_f = ''.join(vl_junco(x, 112, R(26, 40), R(-6, 6), '#7FA845') for x in [2, 6, 10, 15, 158, 162, 166, 169])
vl_cartao('f-uros', 'vpUr',
  vl_lg('vpUrCeu', '#2A72DA', '#7CC2F6', '#DDF1FF') + vl_lg('vpUrLago', '#3A8CE0', '#1C5CBA', '#0E3A88') + vl_lg('vpUrPal', '#F6DC80', '#D2A848') +
  vl_lg('vpUrTeto', '#FFE89A', '#D8AE4E') + vl_lg('vpUrIlha', '#F2D274', '#C99A3E', '#8A6422') + vl_lg('vpUrSerra', '#9AA8D8', '#C8D0EE') + vl_lg('vpUrSerra2', '#7A9AB2', '#9FB6C2') +
  rg('vpUrSol', '#FFFBE0', '#FFE27A', '#F4B42A'),
  f'''<rect width="170" height="64" fill="url(#vpUrCeu)"/>
  <circle cx="140" cy="18" r="16" fill="#FFF2B0" opacity=".35"/><circle cx="140" cy="18" r="8.5" fill="url(#vpUrSol)" stroke="#E8A21E" stroke-width="1"/>
  {vl_nuvem(36, 16, .9)}{vl_nuvem(100, 24, .6)}
  {vl_ave(70, 18, 1.1)}{vl_ave(80, 23, .8)}
  <path d="{ur_serra}" fill="url(#vpUrSerra)" stroke="#7480B8" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M26 40 L32 44 L36 60 H30Z M40 36 L48 46 L50 60 H44Z M90 33 L98 41 L102 60 H95Z M108 38 L118 47 L120 60 H113Z M142 34 L152 44 L156 60 H149Z" fill="#6E78B0" opacity=".35"/>
  <path d="{ur_neve}" fill="#fff" stroke="#8C9CC8" stroke-width=".6" stroke-linejoin="round"/>
  <path d="M-2 62 C20 54 40 58 60 55 C80 52 100 57 120 54 C140 51 160 56 172 54 V64 H-2Z" fill="url(#vpUrSerra2)" stroke="#56709A" stroke-width=".8"/>
  <rect y="62" width="170" height="48" fill="url(#vpUrLago)"/>
  <path d="M0 62.6 H170" stroke="#BFE6FF" stroke-width="1" opacity=".8"/>
  <path d="M134 64 h12 M131 68 h18 M136 72 h8" stroke="#FFE89A" stroke-width="1.2" opacity=".75" stroke-linecap="round"/>
  {ur_tufos}
  <ellipse cx="146" cy="66" rx="18" ry="3.4" fill="url(#vpUrIlha)" stroke="#7A5A14" stroke-width=".8"/>{ur_cabana(140, 65, 7, 4)}{ur_cabana(151, 65, 6, 3.6, '#2E7BF6')}
  <ellipse cx="66" cy="86" rx="62" ry="10" fill="#0B2E6A" opacity=".35"/>
  <path d="M6 80 C8 72 124 70 128 80 C130 88 6 90 6 80Z" fill="#8A6422" stroke="#5A3E10" stroke-width="1.1"/>
  <path d="M8 78 C10 70 122 68 126 77 C124 84 10 85 8 78Z" fill="url(#vpUrIlha)" stroke="#6E4E10" stroke-width="1.1"/>
  {tex(66, 77, 54, 5, 34, '#B8902E', .6)}
  <path d="M14 76 C40 71 96 70 120 74" stroke="#FFF2B0" stroke-width="1.2" fill="none" opacity=".75" stroke-linecap="round"/>
  {ur_cabana(28, 77, 18, 11, '#E5392C')}{ur_cabana(98, 76, 16, 10, '#2E9A5A')}
  <g transform="translate(62 76)"><path d="M-2 0 V-26 M2 0 V-26 M-2 -6 H2 M-2 -13 H2 M-2 -20 H2" stroke="#8A6422" stroke-width="1.1"/><path d="M-7 -26 H7 L4 -32 H-4Z" fill="url(#vpUrTeto)" stroke="#6E4E10" stroke-width=".9" stroke-linejoin="round"/><path d="M0 -32 V-38" stroke="#5A3E10" stroke-width=".8"/><path d="M0 -38 l7 2 l-7 2Z" fill="#E5392C"/><path d="M0 -36 l7 0" stroke="#FFD447" stroke-width=".6"/></g>
  {vl_gente(46, 78, .62, '#B8784A', '#2E7BF6', saia='#FF4E8A', chapeu='coco')}
  {vl_gente(78, 77, .55, '#C08452', '#FFD447', aceno=True)}
  {vl_gente(116, 76, .58, '#A86A3E', '#E5392C', saia='#8A3EE0', chapeu='coco')}
  <path d="M63 47 Q78 56 92 60" stroke="#5A3E10" stroke-width=".5" fill="none"/>{''.join(f'<path d="M{x:.1f} {y:.1f} l2.6 .8 l-1.6 2.6Z" fill="{c}"/>' for (x, y), c in zip([(66, 49.6), (71, 52.4), (76, 54.8), (81, 56.9), (86, 58.6)], ['#FF4E8A', '#FFD447', '#2E7BF6', '#3EBF6A', '#FF8A2E']))}
  <g opacity=".85">{ur_balsa(130, 92, .9)}</g>
  {vl_gente(128, 90, .5, '#A86A3E', '#3EBF6A', chapeu='coco')}
  <path d="M133 82 L142 98" stroke="#5A3E10" stroke-width="1"/>
  <ellipse cx="133" cy="96" rx="22" ry="2" fill="#0B2E6A" opacity=".3"/>
  {vl_ondas(10, 60, 96, '#BFE6FF', .9, .7)}{vl_ondas(70, 110, 104, '#BFE6FF', .9, .6)}{vl_ondas(150, 170, 88, '#BFE6FF', .9, .6)}
  {ur_tufos_f}''')

# =========================================================
# 2. Ganvié, Lago Nokoué (Benin)
# =========================================================
def gv_casa(x, base, w, h, parede, teto, palha=False, faixa=None):
    """palafita: (x, base) = assoalho"""
    estacas = ''.join(f'<path d="M{x + d:.1f} {base:.1f} V{base + 20:.1f}" stroke="#4E2E14" stroke-width="2"/><path d="M{x + d - .4:.1f} {base:.1f} V{base + 20:.1f}" stroke="#9A6A3A" stroke-width=".7"/>' for d in (-w * .42, -w * .14, w * .14, w * .42))
    tabuas = ''.join(f'<path d="M{x - w / 2 + k * w / 6:.1f} {base:.1f} V{base - h:.1f}" stroke="#00000022" stroke-width=".7"/>' for k in range(1, 6))
    if palha:
        tt = f'<path d="M{x - w * .66:.1f} {base - h + 1:.1f} L{x:.1f} {base - h - w * .46:.1f} L{x + w * .66:.1f} {base - h + 1:.1f}Z" fill="url(#vpGvPalha)" stroke="#6E4E14" stroke-width="1" stroke-linejoin="round"/>' + ''.join(f'<path d="M{x - w * .55 + k * w * .11:.1f} {base - h:.1f} L{x - w * .1 + k * w * .02:.1f} {base - h - w * .36:.1f}" stroke="#9A7A2E" stroke-width=".55"/>' for k in range(11))
    else:
        tt = (f'<path d="M{x - w * .64:.1f} {base - h + 1:.1f} L{x - w * .4:.1f} {base - h - w * .34:.1f} H{x + w * .4:.1f} L{x + w * .64:.1f} {base - h + 1:.1f}Z" fill="{teto}" stroke="#3E3A3A" stroke-width="1" stroke-linejoin="round"/>' +
              ''.join(f'<path d="M{x - w * .56 + k * w * .1:.1f} {base - h:.1f} L{x - w * .36 + k * w * .072:.1f} {base - h - w * .32:.1f}" stroke="#FFFFFF55" stroke-width=".7"/>' for k in range(12)))
    fx = f'<rect x="{x - w / 2:.1f}" y="{base - h * .45:.1f}" width="{w}" height="{h * .14:.1f}" fill="{faixa}"/>' if faixa else ''
    return (estacas + f'<rect x="{x - w / 2 - 3:.1f}" y="{base - 1:.1f}" width="{w + 6}" height="3" fill="#8A5A2A" stroke="#4E2E14" stroke-width=".7"/>' +
            f'<rect x="{x - w / 2:.1f}" y="{base - h:.1f}" width="{w}" height="{h}" fill="{parede}" stroke="#3E2A1A" stroke-width="1"/>{fx}{tabuas}' +
            f'<rect x="{x - w * .3:.1f}" y="{base - h * .7:.1f}" width="{w * .2:.1f}" height="{h * .32:.1f}" fill="#2E1E14"/><path d="M{x + w * .08:.1f} {base:.1f} V{base - h * .7:.1f} H{x + w * .26:.1f} V{base:.1f}" fill="#4E2E14"/>' + tt)

gv_palmas = ''.join(f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 C1 -6 -1 -12 1 -18" stroke="#4E7A6A" stroke-width="1.3" fill="none"/><path d="M1 -18 c-5 -2 -9 0 -11 3 M1 -18 c5 -2 9 0 11 3 M1 -18 c-3 -4 -7 -5 -10 -4 M1 -18 c3 -4 7 -5 10 -4 M1 -18 c0 -4 1 -6 2 -7" stroke="#4E7A6A" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>' for x, y, s in [(10, 56, .9), (22, 57, .7), (64, 55, 1), (74, 56, .75), (118, 56, .85), (156, 55, 1), (166, 56, .7)])
gv_acadja = ''.join(f'<path d="M{x + R(-1, 1):.1f} {y:.1f} l{R(-3, 3):.1f} {-R(8, 15):.1f}" stroke="#5A3A1E" stroke-width=".9" stroke-linecap="round"/>' for x, y in [(xx, 96 + R(-1.5, 1.5)) for xx in range(4, 40, 3)])
vl_cartao('f-ganvie', 'vpGv',
  vl_lg('vpGvCeu', '#FF9E52', '#FFCE84', '#FFF0CC') + vl_lg('vpGvLago', '#86B8AE', '#4E8A8E', '#24566A') + vl_lg('vpGvPalha', '#E8C46A', '#B88A3A') +
  vl_lg('vpGvZinco', '#D8DEE8', '#9AA2B2') + vl_lg('vpGvAzul', '#5EB0F2', '#2E78C8') + vl_lg('vpGvAmar', '#FFD86A', '#E8A43A') + vl_lg('vpGvRosa', '#FF9AB0', '#D85A7A') +
  rg('vpGvSol', '#FFFBE0', '#FFD25A', '#FF9A3A'),
  f'''<rect width="170" height="60" fill="url(#vpGvCeu)"/>
  <circle cx="122" cy="40" r="26" fill="#FFE8A8" opacity=".35"/><circle cx="122" cy="40" r="14" fill="url(#vpGvSol)"/>
  {vl_nuvem(40, 20, .9, '#FFF2DC', '#F2C08A')}{vl_nuvem(150, 14, .6, '#FFF2DC', '#F2C08A')}
  {vl_ave(84, 22, 1, '#6E3A2A')}{vl_ave(92, 27, .7, '#6E3A2A')}
  <path d="M-2 58 C30 54 60 57 90 55 C120 53 150 57 172 55 V60 H-2Z" fill="#6E9A8A" opacity=".85"/>
  {gv_palmas}
  <rect y="58" width="170" height="52" fill="url(#vpGvLago)"/>
  <path d="M110 60 h24 M104 64 h36 M112 68 h20 M116 72 h12" stroke="#FFE08A" stroke-width="1.3" opacity=".8" stroke-linecap="round"/>
  {gv_casa(150, 60, 18, 11, 'url(#vpGvAmar)', 'url(#vpGvZinco)')}
  {gv_casa(16, 62, 22, 13, '#C8844A', '', True)}
  {gv_casa(44, 64, 24, 14, 'url(#vpGvAzul)', '#B85A3A', faixa='#FFD447')}
  {gv_casa(98, 63, 26, 15, 'url(#vpGvRosa)', 'url(#vpGvZinco)')}
  {gv_casa(126, 64, 18, 12, '#D8B47A', '', True)}
  <path d="M60 62 H84" stroke="#6E4422" stroke-width="2"/><path d="M62 62 V82 M72 62 V82 M82 62 V82" stroke="#4E2E14" stroke-width="1.2"/>
  {vl_gente(71, 61, .45, '#5E3418', '#22A565', aceno=True)}
    {gv_acadja}
  {vl_ondas(0, 170, 86, '#D8F0E8', .8, .55, 12)}{vl_ondas(6, 170, 102, '#D8F0E8', .8, .45, 14)}
  <ellipse cx="96" cy="99" rx="34" ry="2.4" fill="#123A4A" opacity=".35"/>
  {vl_canoa(96, 96, 64, '#6E3A1A')}
  <path d="M74 92 C76 86 84 84 90 86 L92 92Z" fill="#E8B04A" stroke="#7A4A10" stroke-width=".8"/><circle cx="80" cy="88" r="2.6" fill="#FFD447" stroke="#B8860E" stroke-width=".6"/><circle cx="85" cy="87" r="2.6" fill="#3EBF6A" stroke="#1E7A3A" stroke-width=".6"/><circle cx="87" cy="90" r="2.2" fill="#FF8A2E" stroke="#B8500E" stroke-width=".6"/>
  <path d="M100 84 c-1 -4 2 -6 4 -4 c2 -2 5 0 4 4 c2 3 -1 7 -4 7 c-3 0 -6 -4 -4 -7Z" fill="#E8B04A" stroke="#7A4A10" stroke-width=".7"/><path d="M104 80 l-2 -4 M104 80 l2 -4 M104 80 v-5" stroke="#3E8A3A" stroke-width="1"/>
  {vl_gente(112, 94, .7, '#5E3418', '#E5392C', saia='#2E7BF6', chapeu='palha')}
  <path d="M118 80 L126 104" stroke="#4E2E14" stroke-width="1.3" stroke-linecap="round"/><path d="M124 100 l4 6 l2 -2Z" fill="#4E2E14"/>
  <ellipse cx="34" cy="83" rx="18" ry="1.6" fill="#123A4A" opacity=".3"/>{vl_canoa(34, 81, 34)}
  {vl_gente(30, 80, .48, '#4E2A14', '#FFD447')}<path d="M33.4 68 C40 64 46 66 49 70" stroke="#E8E2D2" stroke-width=".6" fill="none"/><path d="M49 70 L42 80 C48 83 56 83 62 80Z" fill="#fff" opacity=".22" stroke="#F2EEE2" stroke-width=".7" stroke-linejoin="round"/><path d="M49 70 L46 80.8 M49 70 L52 82.4 M49 70 L57 81.8 M44.4 76 C48 77.6 54 77.6 58.6 76" stroke="#F2EEE2" stroke-width=".45" fill="none"/><g fill="#5E6678">{''.join(f'<circle cx="{x}" cy="{y}" r=".8"/>' for x, y in [(42, 80), (47, 81.6), (52, 82.4), (57, 81.8), (62, 80)])}</g>''')

# =========================================================
# 3. Ko Panyi, Baía de Phang Nga (Tailândia)
# =========================================================
kp_rocha = 'M86 74 C84 60 88 46 94 34 C98 26 96 16 104 10 C112 4 124 6 130 12 C136 18 134 26 140 32 C148 40 150 54 148 66 C150 70 152 74 154 76Z'
kp_mato = ''.join(f'<path d="{copa(x, y, rx, ry, 7, .35)}" fill="{c}" stroke="#1E5A2A" stroke-width=".6"/>' for x, y, rx, ry, c in [(112, 9, 10, 4, '#3E9A4A'), (124, 8, 8, 4, '#5EB04A'), (102, 16, 6, 3, '#2E8A4A'), (136, 24, 6, 3.4, '#4EA83A'), (96, 32, 5, 3, '#3E9A4A'), (142, 40, 5, 3, '#5EB04A'), (92, 50, 4, 2.6, '#2E8A4A'), (146, 54, 4, 2.6, '#3E9A4A')])
kp_estrias = ''.join(f'<path d="M{x} {y} q{R(-2, 2):.1f} {h / 2:.1f} {R(-1, 1):.1f} {h}" stroke="{c}" stroke-width="{w}" fill="none" opacity=".55" stroke-linecap="round"/>' for x, y, h, c, w in [(100, 20, 22, '#C8783A', 1.6), (108, 16, 30, '#6E5A5A', 1), (118, 14, 26, '#E89A4A', 1.8), (126, 18, 34, '#5E4A4A', 1), (134, 30, 26, '#C8783A', 1.4), (96, 40, 20, '#5E4A4A', 1), (140, 44, 20, '#E89A4A', 1.4)])
def kp_casa(x, base, w, h, parede, teto):
    return (''.join(f'<path d="M{x + d:.1f} {base:.1f} V{base + 9:.1f}" stroke="#4E2E14" stroke-width="1.2"/>' for d in (-w * .38, w * .38)) +
            f'<rect x="{x - w / 2:.1f}" y="{base - h:.1f}" width="{w}" height="{h}" fill="{parede}" stroke="#3E2A1A" stroke-width=".7"/>'
            f'<rect x="{x - w * .22:.1f}" y="{base - h * .7:.1f}" width="{w * .2:.1f}" height="{h * .32:.1f}" fill="#3E5A7A"/>'
            f'<path d="M{x - w * .64:.1f} {base - h + .5:.1f} L{x:.1f} {base - h - w * .38:.1f} L{x + w * .64:.1f} {base - h + .5:.1f}Z" fill="{teto}" stroke="#3E2A1A" stroke-width=".7" stroke-linejoin="round"/>')
kp_vila = ''.join(kp_casa(x, b, w, h, p, t) for x, b, w, h, p, t in [(92, 72, 10, 6, '#F2E2C2', '#E5503C'), (104, 71, 9, 6, '#BFE6FF', '#2E7BF6'), (128, 72, 10, 6, '#FFF0C8', '#3EA85A'), (140, 72, 9, 5, '#F2D2A0', '#E5503C'), (151, 73, 10, 6, '#E8F2FF', '#FF8A2E'), (162, 73, 9, 5, '#FFE2E8', '#8A5AE0')])
kp_campo = 'M14 84 L82 80 L92 98 L8 104Z'
kp_rede = ''.join(f'<path d="M{x0:.1f} {y0:.1f} V{y0 - 6:.1f}" stroke="#3E2A1A" stroke-width=".6"/>' for x0, y0 in [(14, 84), (36, 82.7), (58, 81.4), (82, 80), (8, 104), (36, 102), (64, 100), (92, 98)])
vl_cartao('f-kopanyi', 'vpKp',
  vl_lg('vpKpCeu', '#3EB4EE', '#9EDCF8', '#E6F8FF') + vl_lg('vpKpMar', '#5EE0D2', '#22A6B2', '#0E6A8A') + vl_lg('vpKpRocha', '#C8BAA8', '#9A8A82', '#6E6066', x2=1, y2=.4) +
  vl_lg('vpKpGrama', '#7ED65A', '#3E9A3A') + vl_lg('vpKpMad', '#C8894A', '#8A5428') + rg('vpKpOuro', '#FFF6C0', '#FFD447', '#C8920E') + vl_lg('vpKpBarco', '#3E9AE0', '#1E5AA8'),
  f'''<rect width="170" height="76" fill="url(#vpKpCeu)"/>
  {vl_nuvem(30, 18, 1)}{vl_nuvem(70, 10, .6)}{vl_nuvem(162, 30, .7)}
  {vl_ave(54, 26, 1)}{vl_ave(62, 30, .7)}
  <path d="M8 74 C8 64 12 54 18 50 C24 46 30 50 32 58 C34 64 36 70 40 74Z" fill="#8AB8B8" opacity=".8"/><path d="{copa(22, 50, 7, 3, 6, .3)}" fill="#7AAE9A" opacity=".9"/>
  <path d="M46 74 C48 68 52 64 56 66 C60 68 60 72 62 74Z" fill="#9AC4C4" opacity=".7"/>
  <path d="{kp_rocha}" fill="url(#vpKpRocha)" stroke="#4E4248" stroke-width="1.1" stroke-linejoin="round"/>
  {kp_estrias}
  <path d="M104 14 C100 22 98 32 94 40" stroke="#F2E6D6" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M130 12 C134 22 140 30 146 40 C150 50 150 60 148 70 C140 66 136 50 132 40 C128 30 128 20 130 12Z" fill="#4E4248" opacity=".22"/>
  {kp_mato}
  <rect y="74" width="170" height="36" fill="url(#vpKpMar)"/>
  <path d="M84 75 H170" stroke="#8A5A2A" stroke-width="1.6"/><path d="M84 75 H170" stroke="#C8894A" stroke-width=".6"/>
  {kp_vila}
  <g transform="translate(116 72)"><rect x="-6" y="-8" width="12" height="8" fill="#F2F2EA" stroke="#3E2A1A" stroke-width=".7"/><path d="M-5 -8 C-5 -16 5 -16 5 -8Z" fill="url(#vpKpOuro)" stroke="#8A6A0E" stroke-width=".7"/><path d="M0 -15 V-19" stroke="#8A6A0E" stroke-width=".8"/><circle cx="0" cy="-19.6" r=".9" fill="#FFD447"/><path d="M-2 -6 h4 v6 h-4Z" fill="#3E7A5A"/><path d="M8 0 V-14 M7 -14 h2" stroke="#F2F2EA" stroke-width="2"/><path d="M8 -14 C7 -17 9 -17 8 -18" stroke="url(#vpKpOuro)" stroke-width="1.6" fill="none"/></g>
  {vl_ondas(84, 170, 80, '#E6FFFA', .8, .7, 10)}
  <path d="M14 84 L82 80 L92 98 L8 104Z" fill="#000" opacity=".25" transform="translate(1.6 2.6)"/>
  <path d="M10 86 L82 82 L92 100 L6 106Z" fill="url(#vpKpMad)" stroke="#4E2A10" stroke-width="1"/>
  <path d="{kp_campo}" fill="url(#vpKpGrama)" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"/>
  <g stroke="#ffffff" stroke-width=".9" opacity=".18">{''.join(f'<path d="M{14 + k * 9.5 - k * .8:.1f} {84 - k * .5:.1f} L{8 + k * 10.6:.1f} {104 - k * .75:.1f}"/>' for k in range(1, 8))}</g>
  <g stroke="#fff" stroke-width="1" fill="none"><path d="M48 82 L50 101"/><ellipse cx="49" cy="91.5" rx="6.4" ry="3"/><path d="M11 90.5 L19 90 L18 96 L9.6 96.6 M86 87.5 L80 88 L82 94 L89 93.4"/></g>
  <g stroke="#fff" stroke-width="1.1" fill="none"><path d="M9.6 90 V86.6 L12 86.4 L12 90 M88 87 V84 L85.6 84.2 L86 87"/></g>
  {kp_rede}<path d="M14 78 L36 76.7 L58 75.4 L82 74 M8 98 L36 96 L64 94 L92 92" stroke="#3E2A1A" stroke-width=".35" fill="none" opacity=".7"/>
  {vl_gente(30, 98, .5, '#C08452', '#E5392C', aceno=True)}{vl_gente(56, 92, .46, '#A86A3E', '#2E7BF6')}{vl_gente(68, 97, .5, '#8A5A30', '#E5392C')}{vl_gente(38, 89, .42, '#B8784A', '#2E7BF6')}
  <circle cx="45" cy="96" r="1.9" fill="#fff" stroke="#12235A" stroke-width=".6"/><path d="M44 95.4 l1 .6 l1 -.6" stroke="#12235A" stroke-width=".5" fill="none"/>
  {vl_ondas(0, 170, 108, '#E6FFFA', .8, .6, 12)}
  <g transform="translate(130 98)"><ellipse cx="0" cy="3" rx="26" ry="2" fill="#0B4A5A" opacity=".35"/>
    <path d="M-22 -2 C-10 4 12 4 22 -2 C28 -6 30 -12 30 -16 C24 -10 18 -6 10 -5 H-20Z" fill="url(#vpKpBarco)" stroke="#0E2E6E" stroke-width="1" stroke-linejoin="round"/>
    <path d="M-20 -3 H12 C18 -4 24 -8 28 -12" stroke="#FFD447" stroke-width="1.2" fill="none"/>
    <path d="M28 -14 c2 2 3 6 2 9 M30 -15 c3 2 5 5 5 9" stroke="#FF4E8A" stroke-width="1" fill="none"/><path d="M29 -15 c4 1 6 3 7 6" stroke="#FFD447" stroke-width="1" fill="none"/>
    <path d="M-22 -4 L-36 6" stroke="#4E566A" stroke-width="1.4"/><rect x="-26" y="-9" width="6" height="5" fill="#5E6678" stroke="#2E3448" stroke-width=".6"/>
    {vl_gente(-14, -4, .48, '#B8784A', '#FFD447', chapeu='palha')}</g>''')

# =========================================================
# 4. Barco-escola, rios da Amazônia
# =========================================================
be_copas = ''.join(f'<path d="{copa(x, y, rx, ry, 8, .32)}" fill="{c}" stroke="{e}" stroke-width=".7"/>' for x, y, rx, ry, c, e in [
    (8, 46, 14, 10, '#2E8A4A', '#1A5A2A'), (30, 42, 14, 12, '#4EA83A', '#2E6A22'), (52, 46, 12, 9, '#1E7A5A', '#0E4A3A'), (74, 40, 14, 12, '#6EB84A', '#3E7A2A'),
    (98, 46, 13, 9, '#2E8A4A', '#1A5A2A'), (120, 42, 12, 10, '#8AC24A', '#4E7A22'), (142, 46, 14, 10, '#3E9A5A', '#1E5A3A'), (164, 42, 12, 11, '#2E7A4A', '#1A4A2A')])
be_copas2 = ''.join(f'<path d="{copa(x, y, rx, ry, 8, .3)}" fill="{c}" stroke="{e}" stroke-width=".8"/>' for x, y, rx, ry, c, e in [
    (18, 54, 14, 8, '#3E9A3A', '#1E5A22'), (44, 55, 12, 7, '#5EB04A', '#2E6A22'), (86, 54, 14, 8, '#2E8A5A', '#1A5A3A'), (112, 55, 12, 7, '#7AB83E', '#3E7A22'), (154, 54, 16, 8, '#4EA83A', '#2E6A22')])
be_acai = ''.join(f'<g transform="translate({x} {y})"><path d="M0 0 C1 -8 -1 -16 1 -24" stroke="#6E5A3A" stroke-width="1" fill="none"/><path d="M1 -24 c-4 -1 -7 2 -8 5 M1 -24 c4 -1 7 2 8 5 M1 -24 c-2 -4 -5 -5 -7 -5 M1 -24 c2 -4 5 -5 7 -5" stroke="#3E8A3A" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="0" cy="-21" r="1.4" fill="#5A2A6A"/></g>' for x, y in [(64, 52), (70, 54), (134, 52)])
be_samauma = '<g transform="translate(96 38)"><path d="M-3 18 C-2 6 -2 -4 0 -14 M3 18 C2 6 2 -4 0 -14 M0 -10 C-8 -14 -14 -14 -20 -16 M0 -12 C8 -16 14 -16 20 -18" stroke="#9A8A72" stroke-width="2" fill="none" stroke-linecap="round"/>' + f'<path d="{copa(-14, -20, 14, 6, 8, .3)} {copa(14, -22, 14, 6, 8, .3)} {copa(0, -24, 12, 6, 8, .3)}" fill="#5EA83A" stroke="#2E6A22" stroke-width=".8"/></g>'
be_rostos = ''.join(f'<rect x="{x}" y="72" width="10" height="9" rx="2" fill="#BFE6FF" stroke="#12235A" stroke-width=".8"/><circle cx="{x + 5}" cy="78" r="2.6" fill="{p}"/><path d="M{x + 2.4} 76.6 C{x + 2.4} 74 {x + 7.6} 74 {x + 7.6} 76.6Z" fill="{c}"/><circle cx="{x + 4.2}" cy="78" r=".4" fill="#12121A"/><circle cx="{x + 5.8}" cy="78" r=".4" fill="#12121A"/>' for x, p, c in [(62, '#8A5430', '#1E1410'), (76, '#C98A5A', '#5A3A1E'), (90, '#5E3418', '#1E1410'), (104, '#B87A50', '#2E1A0E'), (118, '#C98A5A', '#1E1410')])
vl_cartao('f-barcoescola', 'vpBe',
  vl_lg('vpBeCeu', '#4EAEEE', '#A8DCFA', '#EAF8FF') + vl_lg('vpBeRio', '#D8B47A', '#B88E52', '#8A6638') + vl_lg('vpBeCasco', '#FFFFFF', '#D8E2EE') + vl_lg('vpBeTeto', '#3E8AE8', '#1E5AB8') +
  vl_lg('vpBeAmar', '#FFE07A', '#F2B02E') + vl_lg('vpBeBoto', '#FFD2E4', '#E86AA6') + vl_lg('vpBeMad', '#C8894A', '#8A5428'),
  f'''<rect width="170" height="60" fill="url(#vpBeCeu)"/>
  <g transform="translate(46 18)"><path d="M-22 6 C-26 6 -26 -2 -20 -2 C-22 -10 -10 -14 -6 -8 C-4 -16 10 -16 10 -8 C16 -12 24 -6 20 0 C26 0 26 6 20 6Z" fill="#fff"/><path d="M-22 6 H20" stroke="#C8D8EE" stroke-width="2"/></g>
  {vl_nuvem(128, 14, .9)}{vl_nuvem(156, 28, .6)}
  {vl_ave(102, 20, 1)}{vl_ave(110, 24, .7)}
  {be_samauma}
  {be_copas}{be_acai}{be_copas2}
  <rect y="58" width="170" height="52" fill="url(#vpBeRio)"/>
  <path d="M0 58.6 H170" stroke="#F2DDB0" stroke-width="1" opacity=".8"/>
  <g stroke="#F6E6C2" stroke-width="1" opacity=".55" stroke-linecap="round"><path d="M8 66 h14 M120 64 h20 M150 70 h12 M30 104 h20"/></g>
  <g transform="translate(0 0)">
    {''.join(f'<path d="M{x} 58 V76" stroke="#4E2E14" stroke-width="1.4"/>' for x in (6, 16, 26))}
    <rect x="2" y="44" width="28" height="14" fill="url(#vpBeMad)" stroke="#4E2A10" stroke-width="1"/>
    {''.join(f'<path d="M{2 + k * 4} 44 V58" stroke="#6E3E18" stroke-width=".5"/>' for k in range(1, 7))}
    <rect x="8" y="48" width="6" height="5" fill="#BFE6FF" stroke="#4E2A10" stroke-width=".6"/><rect x="18" y="47" width="6" height="11" fill="#5A3418"/>
    <path d="M-2 45 L16 34 L34 45Z" fill="#C8963A" stroke="#6E4E14" stroke-width="1" stroke-linejoin="round"/>{''.join(f'<path d="M{1 + k * 3} 44.6 L{12 + k * .9:.1f} 37" stroke="#8A6A1E" stroke-width=".5"/>' for k in range(10))}
    <path d="M30 57 H52" stroke="#6E3E18" stroke-width="2.2"/><path d="M36 57 V72 M46 57 V72" stroke="#4E2E14" stroke-width="1.2"/>
    {vl_gente(44, 56, .5, '#8A5430', '#FFFFFF', aceno=True)}<rect x="40.6" y="47.4" width="2.6" height="4.4" rx=".8" fill="#E5392C"/>
    {vl_gente(36, 56, .44, '#C98A5A', '#FFD447')}
  </g>
  <path d="M40 92 C30 90 18 92 8 96 M44 96 C34 98 24 102 16 108" stroke="#FFF6DE" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/>
  <ellipse cx="96" cy="94" rx="58" ry="4" fill="#5A3E1E" opacity=".35"/>
  <path d="M46 84 H150 C148 92 138 96 124 96 H62 C52 96 46 92 46 84Z" fill="url(#vpBeCasco)" stroke="#12235A" stroke-width="1.2"/>
  <path d="M48 88 H148" stroke="#2E7BF6" stroke-width="2.6"/><path d="M50 91 H144" stroke="#FFD447" stroke-width="1.4"/>
  <rect x="56" y="68" width="82" height="16" fill="url(#vpBeAmar)" stroke="#12235A" stroke-width="1.1"/>
  {be_rostos}
  <path d="M52 68 H142" stroke="url(#vpBeTeto)" stroke-width="4" stroke-linecap="round"/><path d="M60 64 H134 L142 68 H52Z" fill="url(#vpBeTeto)" stroke="#0E2E6E" stroke-width="1" stroke-linejoin="round"/>
  <rect x="76" y="58" width="40" height="7" rx="1.4" fill="#fff" stroke="#12235A" stroke-width=".8"/>
  <text x="96" y="63.6" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="6" fill="#1E5AB8" letter-spacing=".3">ESCOLA</text>
  <path d="M130 64 V50" stroke="#5E3A14" stroke-width="1"/><path d="M130 50 l10 3 l-10 3Z" fill="#22A565" stroke="#12235A" stroke-width=".6"/><path d="M131 53 h6" stroke="#FFD447" stroke-width="1"/>
  <circle cx="142" cy="76" r="2.4" fill="#E5392C" stroke="#fff" stroke-width="1.2"/>
  <path d="M150 86 c6 -1 10 2 14 0 M148 92 c6 1 10 4 16 3" stroke="#FFF6DE" stroke-width="1.1" fill="none" opacity=".75" stroke-linecap="round"/>
  <g transform="translate(146 103) rotate(-18)"><path d="M-14 0 C-12 -8 -2 -12 8 -10 C12 -9 16 -7 18 -5 C14 -4 12 -2 10 0Z" fill="url(#vpBeBoto)" stroke="#8E2E5E" stroke-width="1" stroke-linejoin="round"/><path d="M-2 -10 C0 -14 3 -15 5 -14 C3 -12 2 -10 2 -9Z" fill="#E86AA6" stroke="#8E2E5E" stroke-width=".7"/><circle cx="10" cy="-7" r="1" fill="#12121A"/><circle cx="10.3" cy="-7.3" r=".35" fill="#fff"/><path d="M-6 -7 C0 -10 6 -10 10 -9" stroke="#FFF0F6" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>
  <g fill="#F6E6C2" opacity=".85"><circle cx="138" cy="104" r="1.2"/><circle cx="164" cy="98" r="1"/><circle cx="168" cy="104" r=".8"/></g>
  {vl_ondas(0, 40, 102, '#F6E6C2', .8, .6, 10)}''')

# =========================================================
# Materiais (botões embaixo da cena)
# =========================================================
S.append(f'''<symbol id="m-pedra" viewBox="0 0 100 50">
  <defs>{rg('vmPedra', '#D8DEEA', '#9AA2B6', '#646C80')}</defs>
  <ellipse cx="50" cy="45" rx="44" ry="3.4" fill="#0A1440" opacity=".16"/>
  {''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="url(#vmPedra)" stroke="#3E465A" stroke-width="1.8"/><path d="M{x - rx * .55:.1f} {y - ry * .3:.1f} q{rx * .35:.1f} {-ry * .55:.1f} {rx * .85:.1f} {-ry * .45:.1f}" stroke="#F2F6FC" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>' for x, y, rx, ry in [(24, 34, 18, 11), (76, 34, 18, 11), (50, 36, 17, 10), (37, 20, 14, 9), (63, 21, 13, 8.5)])}
  <path d="M52 34 l3 4 l-1 4 M26 32 l-3 5" stroke="#4E566A" stroke-width="1" fill="none"/>
</symbol>''')
S.append(f'''<symbol id="m-tijolo" viewBox="0 0 100 50">
  <defs>{vl_lg('vmTij', '#F6966A', '#C8502A')}</defs>
  <ellipse cx="50" cy="45" rx="44" ry="3.4" fill="#0A1440" opacity=".16"/>
  <rect x="6" y="12" width="88" height="31" rx="2" fill="#E8D2B0" stroke="#7A3A1E" stroke-width="1.6"/>
  {''.join(f'<rect x="{x}" y="{y}" width="{w}" height="9" rx="1.4" fill="url(#vmTij)" stroke="#8E3A1C" stroke-width="1.1"/><path d="M{x + 2.4} {y + 2.4} h{w - 8}" stroke="#FFC2A0" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>' for x, y, w in [(7.5, 33, 27), (36, 33, 27), (64.5, 33, 28), (7.5, 23, 13), (22, 23, 27), (50.5, 23, 27), (79, 23, 13.5), (7.5, 13, 27), (36, 13, 27), (64.5, 13, 28)])}
</symbol>''')
S.append(f'''<symbol id="m-totora" viewBox="0 0 100 50">
  <defs>{vl_lg('vmTot', '#FFE89A', '#E2B84E', '#9A7424')}</defs>
  <ellipse cx="50" cy="45" rx="44" ry="3.4" fill="#0A1440" opacity=".16"/>
  {''.join(f'<path d="M{6 + k * 2} {y} C{20} {y - 7} {80} {y - 7} {94 - k * 2} {y} C80 {y + 7} 20 {y + 7} {6 + k * 2} {y}Z" fill="url(#vmTot)" stroke="#6E4E10" stroke-width="1.5"/><path d="M14 {y - 1.5} C34 {y - 4} 66 {y - 4} 86 {y - 1.5}" stroke="#FFF6C4" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/><path d="M14 {y + 2} C34 {y + 4} 66 {y + 4} 86 {y + 2}" stroke="#A8862E" stroke-width=".9" fill="none"/>' for k, y in [(1, 34), (0, 22)])}
  {''.join(f'<path d="M{x} 15 C{x - 2} 24 {x - 2} 32 {x} 41" stroke="#4E3208" stroke-width="3.4" fill="none"/><path d="M{x} 15 C{x - 2} 24 {x - 2} 32 {x} 41" stroke="#C89A4A" stroke-width="1.2" fill="none"/>' for x in (28, 50, 72))}
  {''.join(vl_junco(x, 16, h, i, '#7FA845', False) for x, h, i in [(84, 12, 4), (88, 10, 6), (14, 11, -5)])}
</symbol>''')
S.append(f'''<symbol id="m-barril" viewBox="0 0 100 50">
  <defs>{vl_lg('vmTamA', '#8ACCFF', '#3E8AF0', '#1A4AA8')}{vl_lg('vmTamL', '#FFC88A', '#FF8A2E', '#C2520E')}</defs>
  <ellipse cx="50" cy="45" rx="44" ry="3.4" fill="#0A1440" opacity=".16"/>
  {''.join(f'<rect x="{x}" y="{y}" width="44" height="22" rx="9" fill="url(#{g})" stroke="{e}" stroke-width="1.6"/><path d="M{x + 12} {y + 1} V{y + 21} M{x + 32} {y + 1} V{y + 21}" stroke="{h}" stroke-width="2.6"/><path d="M{x + 6} {y + 6} H{x + 38}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/><rect x="{x + 19}" y="{y - 2.6}" width="6" height="3.4" rx="1" fill="#E9EEF6" stroke="#3E465A" stroke-width=".9"/>' for x, y, g, e, h in [(4, 21, 'vmTamA', '#0E2E6E', '#1A4A9E'), (52, 21, 'vmTamL', '#7A3A0A', '#B8560E'), (28, 6, 'vmTamA', '#0E2E6E', '#1A4A9E')])}
</symbol>''')
