# junta as paradas novas (scratchpad/novos/<id>/) no eco3
import pathlib, re, shutil, sys
d = pathlib.Path(__file__).parent
novos = d.parent / 'novos'
ids = sys.argv[1:]
app = (d / 'app.v2.js.bak').read_text()
gd = (d / 'gerar_defs2.py').read_text()
corpo = (d / 'corpo.html').read_text()
for i in ids:
    n = novos / i
    shutil.copy(n / f'{i}.js', d / f'{i}.js')
    shutil.copy(n / f'gerar_defs_{i}.py', d / f'gerar_defs_{i}.py')
    entrada = (n / 'parada.js.txt').read_text().rstrip()
    if not entrada.endswith(','): entrada += ','
    m = re.search(r"^  \{ id:'" + i + r"',[^\n]*mini:'" + i + r"'[^\n]*\n", app, re.M)
    assert m, i
    app = app[:m.start()] + entrada + '\n' + app[m.end():]
    k, v = (n / 'jogos.txt').read_text().strip().split(':')
    if f'{k}:{v}' not in app:
        app = app.replace(' };\n', f', {k}:{v} }};\n', 1) if False else re.sub(r'(const JOGOS = \{[^}]*?)\s*\};', lambda mm: mm.group(1) + f', {k}:{v} }};', app, count=1)
    linha = f"exec((d / 'gerar_defs_{i}.py').read_text())"
    if linha not in gd:
        gd = gd.replace("exec((d / 'gerar_defs5.py').read_text())", "exec((d / 'gerar_defs5.py').read_text())\n" + linha, 1)
    linha_b = (n / 'bncc.html').read_text().rstrip('\n')
    if linha_b.strip()[:40] not in corpo:
        corpo = corpo.replace('        </tbody>', linha_b + '\n        </tbody>', 1)
(d / 'app.v2.js.bak').write_text(app); (d / 'gerar_defs2.py').write_text(gd); (d / 'corpo.html').write_text(corpo)
print('ok', ids)
