import pathlib
d=pathlib.Path(__file__).parent
import re
d2=(d/'defs2.html').read_text()
redefinidos=set(re.findall(r'<symbol id="([^"]+)"', d2))
d1=re.sub(r'<symbol id="([^"]+)".*?</symbol>\n?', lambda m: '' if m.group(1) in redefinidos else m.group(0), (d/'defs.html').read_text(), flags=re.S)
html=('<title>Amigos da Natureza</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 '<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Andika:wght@400;700&display=swap" rel="stylesheet">\n'
 '<style>\n'+(d/'estilo.css').read_text()+'</style>\n'+d1+d2+(d/'corpo.html').read_text()+'<script>\n'+(d/'app.js').read_text()+'\n'+(d/'educ.js').read_text()+'</script>\n')
(d/'index.html').write_text(html); print(len(html))
