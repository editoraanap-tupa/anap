# figurinhas e capa dos Poços de degraus (Índia) — executado dentro de gerar_defs2.py, depois do gerar_defs5
random.seed(97)

def _f(v): return f'{v:.1f}'

# ---------- poço de degraus em corte (usado na figurinha e na capa) ----------
def _poco(cx, yf, W0, dW, D0, dD, hD, dz, n, kd, zag, pre, solo=True, agua=None, larg_solo=None, fundo_solo=None):
    """Desenha meio poço de degraus (pirâmide invertida) cortado na frente.
    P(x,d,z): x lateral, d profundidade (0 = corte da frente, 1 = fundo), z = níveis para baixo."""
    def P(x, d, z):
        sc = 1 - kd * d
        return (cx + x * sc, yf - hD * d + z * dz * sc)
    def poly(pts, **a):
        s = 'M' + ' L'.join(f'{_f(x)} {_f(y)}' for x, y in pts) + 'Z'
        at = ' '.join(f'{k.replace("_", "-")}="{v}"' for k, v in a.items())
        return f'<path d="{s}" {at}/>'
    W = [W0 - k * dW for k in range(n)]
    D = [D0 - k * dD for k in range(n)]
    o = ''
    for k in range(n):
        # parede do fundo (degrau k)
        a, b = P(-W[k], D[k], k), P(W[k], D[k], k + 1)
        o += poly([P(-W[k], D[k], k), P(W[k], D[k], k), P(W[k], D[k], k + 1), P(-W[k], D[k], k + 1)], fill=f'url(#{pre}Ri)', stroke='#7A4A2A', stroke_width='.5')
        # escadinhas em triângulo (padrão em zigue-zague)
        u = zag * 2
        m = int(2 * W[k] / u)
        off = -m * u / 2 + (u / 2 if k % 2 else 0)
        for j in range(m - (1 if k % 2 else 0)):
            x0 = off + j * u
            ap = P(x0 + u / 2, D[k], k + .08); e = P(x0 + .6, D[k], k + 1); dd = P(x0 + u - .6, D[k], k + 1); mid = P(x0 + u / 2, D[k], k + 1)
            o += poly([ap, mid, e], fill='#FBE0B0')
            o += poly([ap, dd, mid], fill='#9A5E36')
            st = ''
            for q in (.33, .55, .77):
                l, r = P(x0 + u / 2 - u / 2 * q, D[k], k + .08 + .92 * q), P(x0 + u / 2 + u / 2 * q, D[k], k + .08 + .92 * q)
                st += f'M{_f(l[0])} {_f(l[1])} L{_f(r[0])} {_f(r[1])} '
            o += f'<path d="{st}" stroke="#6E3A1A" stroke-width=".4" opacity=".85"/><path d="M{_f(e[0])} {_f(e[1])} L{_f(ap[0])} {_f(ap[1])} L{_f(dd[0])} {_f(dd[1])}" stroke="#5E3018" stroke-width=".45" fill="none"/>'
        # paredes laterais
        for sx, cor in ((-1, f'url(#{pre}Sl)'), (1, f'url(#{pre}Sr)')):
            o += poly([P(sx * W[k], 0, k), P(sx * W[k], D[k], k), P(sx * W[k], D[k], k + 1), P(sx * W[k], 0, k + 1)], fill=cor, stroke='#6E4224', stroke_width='.5')
            a0, a1 = (D[k] - .12, .1) if k % 2 == 0 else (.1, D[k] - .12)
            fl = [P(sx * W[k], a0, k), P(sx * W[k], a1, k + 1)]
            o += f'<path d="M{_f(fl[0][0])} {_f(fl[0][1])} L{_f(fl[1][0])} {_f(fl[1][1])}" stroke="#F6DAB0" stroke-width="{_f(dz * .22)}" stroke-dasharray="{_f(dz * .09)} {_f(dz * .07)}"/>'
        # piso do patamar seguinte
        if k < n - 1:
            o += poly([P(-W[k], 0, k + 1), P(-W[k], D[k], k + 1), P(W[k], D[k], k + 1), P(W[k], 0, k + 1), P(W[k + 1], 0, k + 1), P(W[k + 1], D[k + 1], k + 1), P(-W[k + 1], D[k + 1], k + 1), P(-W[k + 1], 0, k + 1)], fill='#F6DDB0', stroke='#9A6A40', stroke_width='.4')
    # fundo
    o += poly([P(-W[-1], 0, n), P(-W[-1], D[-1], n), P(W[-1], D[-1], n), P(W[-1], 0, n)], fill='#6E9A8A')
    if agua is not None:
        k = min(n - 1, int(agua))
        sup = [P(-W[k], 0, agua), P(-W[k], D[k], agua), P(W[k], D[k], agua), P(W[k], 0, agua)]
        sec = [P(-W[k], 0, agua)]
        for j in range(k, n):
            sec += [P(-W[j], 0, max(agua, j)), P(-W[j], 0, j + 1)]
            if j < n - 1: sec.append(P(-W[j + 1], 0, j + 1))
        dirx = [(2 * cx - x, y) for x, y in sec[::-1]]
        o += poly(sec + dirx, fill=f'url(#{pre}Ag)', opacity='.62')
        o += poly(sup, fill=f'url(#{pre}As)', opacity='.62')
        cy0 = (sup[0][1] + sup[1][1]) / 2
        o += ''.join(f'<path d="M{_f(sup[1][0] + 2 + i * 0)} {_f(sup[1][1] + (sup[0][1] - sup[1][1]) * (q + .5) / 3)} ' + ' '.join(f'q{_f(dz * .4)} {_f(-dz * .15 * (1 if (j + q) % 2 else -1))} {_f(dz * .8)} 0' for j in range(int((sup[2][0] - sup[1][0]) / (dz * .8)) - 1)) + '" stroke="#FFFFFF" stroke-width=".5" fill="none" opacity=".55"/>' for i, q in enumerate(range(3)))
        a, b = P(-W[k] * .6, D[k] * .5, agua), P(W[k] * .2, D[k] * .5, agua)
        o += f'<path d="M{_f(a[0])} {_f(a[1])} H{_f(b[0])}" stroke="#E6FFFF" stroke-width=".8" opacity=".9" stroke-linecap="round"/>'
    if solo:
        x0 = cx - (larg_solo or W0 + 40); x1 = 2 * cx - x0; yb = fundo_solo or (yf + n * dz + 10)
        prof = [P(-W[0], 0, 0)]
        for j in range(n):
            prof += [P(-W[j], 0, j + 1)]
            if j < n - 1: prof.append(P(-W[j + 1], 0, j + 1))
        dirp = [(2 * cx - x, y) for x, y in prof[::-1]]
        pts = [(x0, yf)] + prof + dirp + [(x1, yf), (x1, yb), (x0, yb)]
        cid = f'{pre}SoloC'
        o += f'<clipPath id="{cid}">{poly(pts)}</clipPath>'
        H = yb - yf
        o += f'<g clip-path="url(#{cid})"><rect x="{x0}" y="{yf}" width="{x1 - x0}" height="{H}" fill="#C98E52"/>'
        o += f'<rect x="{x0}" y="{_f(yf + H * .16)}" width="{x1 - x0}" height="{_f(H * .3)}" fill="#E2B47C"/>'
        o += f'<rect x="{x0}" y="{_f(yf + H * .46)}" width="{x1 - x0}" height="{_f(H * .26)}" fill="#C0705A"/>'
        o += f'<rect x="{x0}" y="{_f(yf + H * .72)}" width="{x1 - x0}" height="{_f(H * .3)}" fill="#A88A70"/>'
        o += ''.join(f'<ellipse cx="{_f(R(x0, x1))}" cy="{_f(yf + H * R(.76, .98))}" rx="{_f(R(1.2, 2.4))}" ry="{_f(R(.7, 1.3))}" fill="#C8B29A" opacity=".8"/>' for _ in range(int((x1 - x0) / 10)))
        o += f'<rect x="{x0}" y="{_f(yf + H * .8)}" width="{x1 - x0}" height="{_f(H * .22)}" fill="url(#{pre}Len)"/>'
        o += f'<path d="M{x0} {_f(yf + H * .8)} ' + ' '.join('q3 -1.2 6 0' for _ in range(int((x1 - x0) / 6) + 1)) + '" stroke="#E6F6FF" stroke-width="1" fill="none"/>'
        o += f'<path d="M{x0} {_f(yf + H * .55)} H{x1} M{x0} {_f(yf + H * .64)} H{x1}" stroke="#9A4E3E" stroke-width=".4" opacity=".7"/>'
        o += ''.join(f'<circle cx="{_f(R(x0, x1))}" cy="{_f(yf + H * R(.2, .44))}" r=".5" fill="#C8975E" opacity=".6"/>' for _ in range(int((x1 - x0) / 9)))
        o += f'<rect x="{x0}" y="{yf}" width="{x1 - x0}" height="{_f(H * .05)}" fill="#7A9A3A" opacity=".55"/></g>'
        o += poly(pts, fill='none', stroke='#5E3418', stroke_width='.9', stroke_linejoin='round')
    return o

def _defs_poco(pre):
    return (lg(f'{pre}Ri', '#E8BC86', '#C48A55') + lg(f'{pre}Sl', '#B98050', '#9A6438', 1, 0) + lg(f'{pre}Sr', '#F2CC96', '#DCA66C', 1, 0)
            + lg(f'{pre}Ag', '#3AAAC8', '#0E4A70') + lg(f'{pre}As', '#46B8CC', '#A8F0EE')
            + f'<linearGradient id="{pre}Len" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CCBF6" stop-opacity=".75"/><stop offset="1" stop-color="#1E4EA8" stop-opacity=".8"/></linearGradient>')

# ---------- pavão-indiano (Neel), dançando de leque aberto ----------
def _ocelo(x, y, ang, s):
    a = math.degrees(ang) + 90
    return (f'<g transform="translate({_f(x)} {_f(y)}) rotate({_f(a)}) scale({s})">'
            '<ellipse rx="5" ry="6.6" fill="#D8A63A" stroke="#8A6418" stroke-width=".5"/>'
            '<ellipse cy=".6" rx="3.9" ry="5.2" fill="#3FAE6A"/>'
            '<ellipse cy="1" rx="2.9" ry="3.8" fill="#2A9CDB"/>'
            '<ellipse cy="1.4" rx="1.7" ry="2.3" fill="#1A2470"/>'
            '<circle cx="-.6" cy=".4" r=".6" fill="#fff" opacity=".85"/></g>')

def _leque(cx, cy, rx, ry, n, a0, a1):
    tips = []
    for i in range(n):
        t = a0 + (a1 - a0) * i / (n - 1)
        tips.append((cx + math.cos(t) * rx, cy + math.sin(t) * ry, t))
    s = f'M{_f(cx)} {_f(cy)} L{_f(tips[0][0])} {_f(tips[0][1])}'
    for i in range(1, n):
        x0, y0, t0 = tips[i - 1]; x1, y1, t1 = tips[i]; tm = (t0 + t1) / 2
        s += f' Q{_f(cx + math.cos(tm) * rx * 1.1)} {_f(cy + math.sin(tm) * ry * 1.1)} {_f(x1)} {_f(y1)}'
    s += 'Z'
    raios = ''.join(f'M{_f(cx)} {_f(cy)} L{_f(x)} {_f(y)} ' for x, y, _ in tips)
    finos = ''.join(f'M{_f(cx)} {_f(cy)} L{_f(cx + math.cos(t) * rx * .97)} {_f(cy + math.sin(t) * ry * .97)} ' for t in [a0 + (a1 - a0) * (i + .5) / (n - 1) for i in range(n - 1)])
    oc = ''.join(_ocelo(x - math.cos(t) * rx * .09, y - math.sin(t) * ry * .09, t, 1) for x, y, t in tips)
    oc2 = ''.join(_ocelo(cx + math.cos(t) * rx * .64, cy + math.sin(t) * ry * .64, t, .78) for t in [a0 + (a1 - a0) * (i + .5) / (n - 1) for i in range(n - 1)])
    oc3 = ''.join(_ocelo(cx + math.cos(t) * rx * .38, cy + math.sin(t) * ry * .38, t, .55) for t in [a0 + (a1 - a0) * i / (n - 1) for i in range(1, n - 1, 2)])
    return s, raios, finos, oc + oc2 + oc3

pv_s, pv_r, pv_f, pv_o = _leque(65, 80, 60, 64, 13, math.radians(-172), math.radians(-8))
S.append(f'''<symbol id="f-pavao" viewBox="0 0 130 120">
  <defs>{rg('baLeque', '#2A6A3A', '#3E9C4E', '#8CC84A', .5, .9)}{rg('baAzul', '#6AC8FF', '#1E6AD8', '#12358A', .4, .3)}{lg('baAsa', '#F2E2B8', '#C8A87A')}{lg('baRem', '#E08A3E', '#A4521E')}</defs>
  <ellipse cx="65" cy="115" rx="36" ry="3.6" fill="#2A1A0A" opacity=".2"/>
  <path d="{pv_s}" fill="url(#baLeque)" stroke="#1E5A2E" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="{pv_f}" stroke="#C8E07A" stroke-width=".5" opacity=".55"/>
  <path d="{pv_r}" stroke="#1E5A2E" stroke-width=".8" opacity=".6"/>
  {pv_o}
  
  <g stroke="#7A6A5A" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M60 100 L58 112 M70 100 L72 112"/><path d="M58 112 l-5 2 M58 112 l1 3 M72 112 l5 2 M72 112 l-1 3"/></g>
  <path d="M42 96 C38 86 44 78 54 78 L56 100 C50 102 44 101 42 96Z" fill="url(#baAsa)" stroke="#6E5230" stroke-width="1.2"/>
  <path d="M90 96 C94 86 88 78 78 78 L76 100 C82 102 88 101 90 96Z" fill="url(#baAsa)" stroke="#6E5230" stroke-width="1.2"/>
  <path d="M44 88 l8 -2 M44 93 l8 -1.6 M88 88 l-8 -2 M88 93 l-8 -1.6" stroke="#4E3A22" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M42 96 C44 101 50 102 56 100 L55 96Z M90 96 C88 101 82 102 76 100 L77 96Z" fill="url(#baRem)"/>
  <path d="M53 100 C45 88 49 74 58 64 C61 57 60 48 61 40 L71 40 C72 48 71 57 74 64 C83 74 87 88 79 100 C71 107 61 107 53 100Z" fill="url(#baAzul)" stroke="#0E2A6A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M61 46 C60 58 58 72 58 88" stroke="#9AE0FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  <g stroke="#1E5A6A" stroke-width="1" stroke-linecap="round">{''.join(f'<path d="M66 24 L{_f(66 + math.cos(a) * 14)} {_f(24 + math.sin(a) * 14)}"/>' for a in [math.radians(v) for v in (-130, -110, -90, -70, -50)])}</g>
  <g fill="#2AB4C8" stroke="#16507A" stroke-width=".6">{''.join(f'<ellipse cx="{_f(66 + math.cos(a) * 15)}" cy="{_f(24 + math.sin(a) * 15)}" rx="2" ry="2.8" transform="rotate({_f(math.degrees(a) + 90)} {_f(66 + math.cos(a) * 15)} {_f(24 + math.sin(a) * 15)})"/>' for a in [math.radians(v) for v in (-130, -110, -90, -70, -50)])}</g>
  <circle cx="66" cy="32" r="11" fill="url(#baAzul)" stroke="#0E2A6A" stroke-width="1.6"/>
  <path d="M66 26 C70 23 76 25 77 29 C73 28 69 28 66 30Z" fill="#fff"/>
  <path d="M67 38 C71 39 75 38 77 35 C75 40 70 42 66 40Z" fill="#fff" opacity=".95"/>
  <path d="M76 31 L84 33 L76 35Z" fill="#E8D4A8" stroke="#8A6A3A" stroke-width=".8" stroke-linejoin="round"/>
  <ellipse cx="70" cy="32" rx="3.4" ry="3.8" fill="#1A1420"/><circle cx="71.3" cy="30.6" r="1.4" fill="#fff"/><circle cx="69.2" cy="33.8" r=".6" fill="#fff"/>
  <ellipse cx="63" cy="37" rx="3" ry="1.8" fill="#FF8AB8" opacity=".45"/>
  <path d="M59 28 q3 -6 9 -6" stroke="#BFEAFF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>''')

# ---------- langur-cinzento (sentado, cauda comprida) ----------
S.append(f'''<symbol id="f-langur" viewBox="0 0 110 130">
  <defs>{rg('baLgr', '#F6F2EA', '#CFC9BD', '#8E887C', .42, .28)}{lg('baLgC', '#D8D2C6', '#9A9488')}</defs>
  <ellipse cx="54" cy="124" rx="38" ry="4" fill="#2A1A0A" opacity=".2"/>
  <path d="M70 112 C92 118 106 102 102 78 C99 60 106 44 98 30 C94 24 88 26 90 32" stroke="#5E5A52" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M70 112 C92 118 106 102 102 78 C99 60 106 44 98 30 C94 24 88 26 90 32" stroke="url(#baLgC)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M98 34 C102 46 98 60 100 74" stroke="#F6F2EA" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M30 112 C22 92 26 70 38 60 C46 52 64 52 72 60 C84 72 86 94 80 112Z" fill="url(#baLgr)" stroke="#5E5A52" stroke-width="1.8" stroke-linejoin="round"/>
  <ellipse cx="55" cy="84" rx="13" ry="18" fill="#F2EEE4" opacity=".9"/>
  <ellipse cx="36" cy="102" rx="13" ry="10" fill="url(#baLgr)" stroke="#5E5A52" stroke-width="1.6"/><ellipse cx="74" cy="102" rx="13" ry="10" fill="url(#baLgr)" stroke="#5E5A52" stroke-width="1.6"/>
  <path d="M24 114 C24 108 34 106 40 110 C42 114 36 117 28 117Z M86 114 C86 108 76 106 70 110 C68 114 74 117 82 117Z" fill="#26201E" stroke="#12100E" stroke-width=".8"/>
  <path d="M40 64 C32 76 34 90 44 100 M70 64 C78 76 76 90 66 100" stroke="#5E5A52" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M40 64 C32 76 34 90 44 100 M70 64 C78 76 76 90 66 100" stroke="#D2CCC0" stroke-width="6.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="102" rx="5.4" ry="3.8" fill="#26201E"/><ellipse cx="64" cy="102" rx="5.4" ry="3.8" fill="#26201E"/>
  <path d="M55 12 C40 12 30 22 31 38 C32 52 42 60 55 60 C68 60 78 52 79 38 C80 22 70 12 55 12Z" fill="#F4F0E6" stroke="#5E5A52" stroke-width="1.6"/>
  <path d="M34 26 l-4 -3 l5 0 M38 18 l-2 -5 l5 3 M47 13 l0 -5 l4 4 M63 13 l0 -5 l-4 4 M72 18 l2 -5 l-5 3 M76 26 l4 -3 l-5 0" stroke="#A8A296" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="33" cy="40" r="5" fill="#26201E"/><circle cx="77" cy="40" r="5" fill="#26201E"/><circle cx="33.6" cy="40" r="2" fill="#4E4642"/><circle cx="76.4" cy="40" r="2" fill="#4E4642"/>
  <path d="M40 34 C40 24 70 24 70 34 C71 48 64 56 55 56 C46 56 39 48 40 34Z" fill="#221C1C"/>
  <path d="M38 28 C46 20 64 20 72 28" stroke="#FFFDF6" stroke-width="4.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="48" cy="36" rx="4.6" ry="4.4" fill="#3A3230"/><ellipse cx="62" cy="36" rx="4.6" ry="4.4" fill="#3A3230"/>
  <circle cx="48" cy="36.4" r="3.4" fill="#E8A83A"/><circle cx="62" cy="36.4" r="3.4" fill="#E8A83A"/>
  <circle cx="48.4" cy="36.8" r="2" fill="#12100E"/><circle cx="61.6" cy="36.8" r="2" fill="#12100E"/><circle cx="49.4" cy="35.4" r=".9" fill="#fff"/><circle cx="62.6" cy="35.4" r=".9" fill="#fff"/>
  <path d="M52.4 44 q2.6 1.6 5.2 0" stroke="#6E625E" stroke-width="1" fill="none" stroke-linecap="round"/><circle cx="53.4" cy="43" r=".7" fill="#4E4642"/><circle cx="56.6" cy="43" r=".7" fill="#4E4642"/>
  <path d="M49 49 q6 4 12 0" stroke="#8A7E78" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M40 18 q8 -6 18 -5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M34 66 C38 60 44 58 48 58" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
</symbol>''')

# ---------- poço de degraus (figurinha) ----------
pv = _poco(60, 48, 42, 8.4, 1, .15, 22, 9, 4, .22, 5.4, 'baF', agua=2.6, larg_solo=56, fundo_solo=94)
S.append(f'''<symbol id="f-baoli" viewBox="0 0 120 100">
  <defs>{_defs_poco('baF')}{lg('baFT', '#F6D8A0', '#E2B070')}{lg('baFP', '#F2C48E', '#D29A62')}</defs>
  <ellipse cx="60" cy="95" rx="54" ry="4" fill="#2A1A0A" opacity=".18"/>
  <path d="M4 48 L22 24 H98 L116 48Z" fill="url(#baFT)" stroke="#8A5A2A" stroke-width="1" stroke-linejoin="round"/>
  <g transform="translate(60 27)"><path d="M-26 0 V-14 H26 V0Z" fill="url(#baFP)" stroke="#7A4A2A" stroke-width=".9"/>
    <g fill="#7A3E22">{''.join(f'<path d="M{x - 3.4} 0 V-6 C{x - 3.4} -10 {x + 3.4} -10 {x + 3.4} -6 V0Z"/>' for x in (-18, -9, 0, 9, 18))}</g>
    <path d="M-28 -14 H28 V-17 H-28Z" fill="#E8B07A" stroke="#7A4A2A" stroke-width=".8"/>
    <g fill="#E8B07A" stroke="#7A4A2A" stroke-width=".6">{''.join(f'<rect x="{x - 2}" y="-20.4" width="4" height="3.4"/>' for x in range(-24, 27, 8))}</g>
    <path d="M-24 -12 H24" stroke="#FFF0D0" stroke-width=".8" opacity=".8"/></g>
  {pv}
  <path d="M6 48 h108" stroke="#FFF0D0" stroke-width=".8" opacity=".7"/>
  {capim(6, 18, 46, 6, '#7A8A2E', (2, 4), .8)}{capim(102, 114, 46, 6, '#7A8A2E', (2, 4), .8)}
</symbol>''')

# ---------- cântaro de barro ----------
gotas = ''.join(f'<path d="M{x} {y - 2.4} q1.8 2.4 0 3.6 q-1.8 -1.2 0 -3.6Z" fill="#DDF4FF" stroke="#7AB8D8" stroke-width=".5" opacity=".95"/>' for x, y in [(30, 60), (36, 74), (70, 56), (64, 82), (44, 88), (74, 70)])
tri = ''.join(f'<path d="M{x} 46 l3 -5 l3 5Z" fill="#FFF3DC" opacity=".95"/>' for x in range(23, 76, 7))
S.append(f'''<symbol id="f-cantaro" viewBox="0 0 100 110">
  <defs>{rg('baBarro', '#F2A870', '#C9622E', '#7E3416', .35, .3)}{lg('baBoca', '#B85A2A', '#7A3416')}{lg('baPano', '#FF5A6E', '#C81E4A')}</defs>
  <ellipse cx="50" cy="104" rx="34" ry="4" fill="#2A1A0A" opacity=".2"/>
  <path d="M24 96 C24 90 76 90 76 96 C76 104 24 104 24 96Z" fill="url(#baPano)" stroke="#7A0E2A" stroke-width="1.2"/>
  <path d="M28 96 q4 3 8 0 q4 3 8 0 q4 3 8 0 q4 3 8 0 q4 3 8 0" stroke="#FFD447" stroke-width="1.6" fill="none"/>
  <g fill="#FFF6E0" stroke="#B8A080" stroke-width=".5">{''.join(f'<ellipse cx="{x}" cy="{y}" rx="1.6" ry="1.1"/>' for x, y in [(28, 101), (40, 103), (52, 103.4), (64, 102.6), (73, 100)])}</g>
  <path d="M30 34 C14 44 12 72 22 86 C30 96 70 96 78 86 C88 72 86 44 70 34Z" fill="url(#baBarro)" stroke="#6E2A10" stroke-width="2"/>
  <path d="M34 22 H66 L64 34 C58 36 42 36 36 34Z" fill="#C9622E" stroke="#6E2A10" stroke-width="1.6" stroke-linejoin="round"/>
  <ellipse cx="50" cy="21" rx="19" ry="5.4" fill="#D97A40" stroke="#6E2A10" stroke-width="1.6"/>
  <ellipse cx="50" cy="21" rx="13" ry="3.2" fill="url(#baBoca)"/>
  <ellipse cx="50" cy="21.8" rx="9" ry="1.6" fill="#3FA8D8" opacity=".85"/><path d="M45 21.6 h5" stroke="#E6FFFF" stroke-width=".7"/>
  <path d="M22 50 C36 44 64 44 78 50" stroke="#2A1408" stroke-width="2.2" fill="none"/>
  {tri}
  <path d="M20 58 C36 52 64 52 80 58" stroke="#2A1408" stroke-width="1.2" fill="none"/>
  <g fill="#FFF3DC">{''.join(f'<circle cx="{x}" cy="{64 + (1 if i % 2 else 0)}" r="1.4"/>' for i, x in enumerate(range(26, 76, 6)))}</g>
  <path d="M24 72 C38 68 62 68 76 72" stroke="#2A1408" stroke-width="1" fill="none" opacity=".7"/>
  <path d="M28 44 C22 56 22 70 28 80" stroke="#FFD2A8" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M38 24 h8" stroke="#FFE0C0" stroke-width="1.4" stroke-linecap="round"/>
  {gotas}
</symbol>''')

# ---------- capa ----------
pc = _poco(85, 76, 46, 7.6, 1, .13, 18, 4.4, 5, .22, 3.4, 'baC', agua=1.6, larg_solo=86, fundo_solo=112)
casas = ''
for x, y, w, h, c, e in [(6, 64, 16, 12, '#5E7FD0', '#2E4A8A'), (18, 66, 14, 10, '#E8A08A', '#9A4E3E'), (28, 62, 12, 14, '#6E92DC', '#2E4A8A')]:
    casas += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" stroke="{e}" stroke-width=".6"/><rect x="{x - .6}" y="{y - 1.4}" width="{w + 1.2}" height="1.6" fill="#F6E6C8" stroke="{e}" stroke-width=".4"/><path d="M{x + 3} {y + h} v-4 a2 2 0 0 1 4 0 v4Z" fill="#3A2A4A"/><rect x="{x + w - 6}" y="{y + 3}" width="3" height="3" fill="#FFE8A8" stroke="{e}" stroke-width=".3"/>'
S.append(f'''<symbol id="capa-baoli" viewBox="0 0 170 110">
  <defs>{ceu('cpBaC', '#5E7EA8', '#F4D8B0')}{lg('cpBaT', '#ECC58C', '#D9A15C')}{_defs_poco('baC')}{lg('cpBaN', '#6E7A96', '#3E4A66')}{lg('cpBaP', '#F2C48E', '#D29A62')}</defs>
  <rect width="170" height="110" fill="url(#cpBaC)"/>
  <path d="M0 52 C10 50 30 50 44 52 V58 H0Z" fill="#3E8AC8"/><path d="M2 54 q3 -1 6 0 q3 1 6 0 M20 55 q3 -1 6 0" stroke="#BFE6FF" stroke-width=".6" fill="none"/>
  <path d="M30 56 C50 44 66 48 80 46 C96 42 110 46 124 42 C140 40 156 44 170 42 V60 H30Z" fill="#B08AA0" opacity=".7"/>
  <g>{''.join(f'<path d="M{x} {y} l-3 9" stroke="#5E9AE8" stroke-width="1" stroke-linecap="round" opacity=".8"/>' for x, y in [(20, 30), (28, 34), (36, 30), (44, 34), (52, 30), (60, 34), (24, 40), (40, 40), (56, 40), (68, 32)])}</g>
  <path d="{copa(42, 20, 30, 11, 11, .3)}" fill="url(#cpBaN)" stroke="#2A3248" stroke-width=".8"/>
  <path d="{copa(36, 16, 18, 8, 9, .3)}" fill="#8A96B2"/><path d="{copa(56, 18, 14, 7, 8, .3)}" fill="#7A86A2"/>
  <path d="M26 12 q6 -4 12 -2" stroke="#D8E2F2" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="140" cy="18" r="12" fill="#FFE8A8" opacity=".35"/><circle cx="140" cy="18" r="7" fill="#FFD447" stroke="#E0A01E" stroke-width=".8"/>
  <path d="M120 30 A26 26 0 0 1 166 30" stroke="#FF8A8A" stroke-width="1.2" fill="none" opacity=".55"/><path d="M122 31 A24 24 0 0 1 164 31" stroke="#FFD447" stroke-width="1.2" fill="none" opacity=".55"/><path d="M124 32 A22 22 0 0 1 162 32" stroke="#7AD0FF" stroke-width="1.2" fill="none" opacity=".55"/>
  <path d="M0 76 L0 58 C40 56 120 56 170 58 V76Z" fill="url(#cpBaT)"/>
  {casas}
  <g transform="translate(85 58)"><path d="M-22 0 V-9 H22 V0Z" fill="url(#cpBaP)" stroke="#7A4A2A" stroke-width=".6"/><g fill="#7A3E22">{''.join(f'<path d="M{x - 2.4} 0 V-4 C{x - 2.4} -7 {x + 2.4} -7 {x + 2.4} -4 V0Z"/>' for x in (-15, -7.5, 0, 7.5, 15))}</g><path d="M-24 -9 H24 V-11 H-24Z" fill="#E8B07A" stroke="#7A4A2A" stroke-width=".5"/></g>
  {pc}
  <svg x="136" y="46" width="34" height="32" viewBox="0 0 130 120"><use class="sem" href="#f-pavao"/></svg>
  {pessoa(44, 74, '#9A6440', '#D93A7A', .5)}<circle cx="44" cy="59.4" r="2" fill="url(#baBarro)" stroke="#6E2A10" stroke-width=".5"/>
  {pessoa(128, 74, '#B07A50', '#2E8A6E', .48, True)}
  <g fill="#3E8A3A">{''.join(f'<path d="{copa(x, y, 6, 4, 7, .3)}" stroke="#2E6A22" stroke-width=".6"/>' for x, y in [(118, 62), (128, 66)])}</g>
  <path d="M118 66 v8 M128 70 v6" stroke="#6E4A2A" stroke-width="1.2"/>
  {capim(0, 40, 76, 16, '#8A8A2E', (2, 5), .8)}{capim(130, 170, 76, 16, '#8A8A2E', (2, 5), .8)}
</symbol>''')
