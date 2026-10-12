# gera educ.js: janelas da BNCC, coluna de ODS com os ícones oficiais e referências
import json, pathlib, base64
d = pathlib.Path(__file__).parent
bncc = json.loads((d/'bncc.json').read_text())
ods = json.loads((d/'ods.json').read_text()); ods.pop('_meta', None)
PARADA_ODS = {
 'Amazônia': [(13, ['13.3']), (15, ['15.1', '15.2']), (6, ['6.6'])],
 'Caatinga': [(6, ['6.1', '6.4']), (13, ['13.1'])],
 'Vilas sobre a água': [(11, ['11.5']), (13, ['13.1']), (6, ['6.b'])],
 'Pantanal': [(6, ['6.6']), (15, ['15.1', '15.5'])],
 'Cerrado': [(6, ['6.6']), (15, ['15.1'])],
 'Mata Atlântica': [(15, ['15.1', '15.2']), (6, ['6.6'])],
 'Pampa': [(6, ['6.4', '6.6']), (2, ['2.4']), (15, ['15.1'])],
 'Oceano': [(14, ['14.1', '14.2']), (12, ['12.5']), (6, ['6.3'])],
 'Antártica': [(13, ['13.2', '13.3']), (14, ['14.2'])],
 'Andes e Himalaia': [(13, ['13.1']), (6, ['6.4', '6.5']), (2, ['2.4'])],
 'Desertos': [(15, ['15.3']), (6, ['6.4']), (13, ['13.1'])],
 'Grandes Lagos': [(6, ['6.6']), (15, ['15.1', '15.5'])],
 'Rio Nilo': [(6, ['6.4', '6.5']), (2, ['2.4']), (11, ['11.4'])],
 'Qanats': [(6, ['6.4']), (11, ['11.4']), (13, ['13.1'])],
 'Poços de degraus': [(6, ['6.4', '6.6']), (13, ['13.1']), (11, ['11.4'])],
 'Dujiangyan': [(6, ['6.5']), (11, ['11.4', '11.5']), (2, ['2.4'])],
 'Terraços de Bali': [(6, ['6.4', '6.b']), (2, ['2.4']), (15, ['15.1'])],
 'Terra dos Inuit': [(13, ['13.1', '13.3']), (14, ['14.2']), (11, ['11.4'])],
 'Chinampas': [(2, ['2.4']), (15, ['15.5']), (6, ['6.6']), (11, ['11.4'])],
 'Lagos do pirarucu': [(14, ['14.2']), (15, ['15.5']), (6, ['6.6']), (2, ['2.4'])],
 'Sementes do Xingu': [(15, ['15.1', '15.2']), (6, ['6.6']), (13, ['13.3'])],
 'Kalunga': [(6, ['6.6', '6.b']), (15, ['15.1']), (11, ['11.4'])],
 'Velho Chico': [(6, ['6.4', '6.6']), (15, ['15.1']), (11, ['11.4'])],
 'Marisqueiras do mangue': [(14, ['14.1', '14.2']), (15, ['15.1']), (12, ['12.5'])],
 'Caiçaras': [(14, ['14.2']), (11, ['11.4']), (13, ['13.1'])],
 'Kaingang': [(15, ['15.1', '15.3']), (6, ['6.6']), (11, ['11.4'])],
 'De volta para casa': [(6, ['6.4']), (11, ['11.6']), (12, ['12.5']), (4, ['4.7'])],
 'Terra dos diques': [(13, ['13.1']), (11, ['11.5']), (6, ['6.5'])],
}
usados = sorted({n for v in PARADA_ODS.values() for n, _ in v})
icones = {n: 'data:image/svg+xml;base64,' + base64.b64encode((d/'ods'/f'ods-{n:02d}.svg').read_bytes()).decode() for n in usados}
B = {k: {c: v[c] for c in ('texto', 'componente', 'ano', 'unidade', 'objeto', 'pagina')} for k, v in bncc.items()}
O = {n: {'nome': ods[str(n)]['nome'], 'objetivo': ods[str(n)]['objetivo'], 'cor': ods[str(n)]['cor'], 'metas': ods[str(n)].get('metas', {})} for n in usados}
REFS = [
 'BRASIL. Ministério da Educação. <b>Base Nacional Comum Curricular</b>. Brasília: MEC, 2018. Disponível em: <a href="http://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf" target="_blank" rel="noopener">basenacionalcomum.mec.gov.br</a>. Acesso em: 12 out. 2026.',
 'BRASIL. Ministério da Educação. <b>Temas contemporâneos transversais na BNCC</b>: contexto histórico e pressupostos pedagógicos. Brasília: MEC, 2019. Disponível em: <a href="http://basenacionalcomum.mec.gov.br/images/implementacao/contextualizacao_temas_contemporaneos.pdf" target="_blank" rel="noopener">basenacionalcomum.mec.gov.br</a>. Acesso em: 12 out. 2026.',
 'NAÇÕES UNIDAS. <b>Transformando nosso mundo</b>: a Agenda 2030 para o Desenvolvimento Sustentável. Brasília: Nações Unidas no Brasil, 2015. Disponível em: <a href="https://brasil.un.org/pt-br/91863-agenda-2030-para-o-desenvolvimento-sustent%C3%A1vel" target="_blank" rel="noopener">brasil.un.org</a>. Acesso em: 12 out. 2026.',
 'NAÇÕES UNIDAS NO BRASIL. <b>Objetivos de Desenvolvimento Sustentável</b>. Brasília: ONU Brasil, [2026]. Disponível em: <a href="https://brasil.un.org/pt-br/sdgs" target="_blank" rel="noopener">brasil.un.org/pt-br/sdgs</a>. Acesso em: 12 out. 2026.',
 'UNITED NATIONS. <b>Guidelines for the use of the SDG logo including the colour wheel and 17 icons</b>. New York: United Nations, Sept. 2023. Disponível em: <a href="https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf" target="_blank" rel="noopener">un.org</a>. Acesso em: 12 out. 2026.',
]
js = f'''/* ================= Para educadores: BNCC, ODS e referências ================= */
(function(){{
  const BNCC = {json.dumps(B, ensure_ascii=False)};
  const ODS = {json.dumps(O, ensure_ascii=False)};
  const ICONE = {json.dumps(icones)};
  const PARADA_ODS = {json.dumps(PARADA_ODS, ensure_ascii=False)};
  const REFS = {json.dumps(REFS, ensure_ascii=False)};
  const box = document.querySelector('#t-educ .educ-box'); if (!box) return;
  const fechar = '<div class="acoes" style="margin-top:14px"><button class="btn azul educ-fechar">Fechar</button></div>';
  const mc = document.getElementById('modal-c'), mw = document.getElementById('modal');
  const abre = html => {{ mc.innerHTML = html; mw.hidden = false; const f = mc.querySelector('.educ-fechar'); f.onclick = () => {{ mw.hidden = true; }}; f.focus(); }};
  const linhas = [...box.querySelectorAll('tbody tr')];
  const th = box.querySelector('thead tr'); const thO = document.createElement('th'); thO.textContent = 'ODS'; th.insertBefore(thO, th.children[3]);
  linhas.forEach(tr => {{
    const nome = tr.children[0].textContent.trim(), lista = PARADA_ODS[nome] || [];
    const td = document.createElement('td'); td.className = 'ods-cel';
    td.innerHTML = lista.map(([n, metas]) => `<button class="ods-ic" data-n="${{n}}" data-metas="${{metas.join(',')}}" data-parada="${{nome}}" title="ODS ${{n}}: ${{ODS[n].nome}}"><img src="${{ICONE[n]}}" alt="ODS ${{n}}: ${{ODS[n].nome}}" width="64" height="64"></button>`).join('');
    tr.insertBefore(td, tr.children[3]);
    tr.querySelectorAll('.bncc').forEach(sp => {{ const b = document.createElement('button'); b.className = 'bncc'; b.textContent = sp.textContent; b.title = 'Ver o texto da BNCC'; sp.replaceWith(b); }});
  }});
  box.addEventListener('click', e => {{
    const b = e.target.closest('button.bncc');
    if (b) {{
      const h = BNCC[b.textContent.trim()]; if (!h) return;
      abre(`<div class="janela-educ"><span class="bncc grande">${{b.textContent.trim()}}</span>
        <p class="meta-educ">${{h.componente}} · ${{h.ano}}</p>
        <p><b>Unidade temática:</b> ${{h.unidade}}<br><b>Objeto de conhecimento:</b> ${{h.objeto}}</p>
        <blockquote>${{h.texto}}</blockquote>
        <p class="fonte-educ">Fonte: BRASIL. Ministério da Educação. Base Nacional Comum Curricular. Brasília: MEC, 2018, ${{h.pagina.replace(/ \\(.*\\)/, '')}}.</p>${{fechar}}</div>`);
      return;
    }}
    const o = e.target.closest('.ods-ic');
    if (o) {{
      const n = o.dataset.n, d = ODS[n], metas = o.dataset.metas.split(',').filter(Boolean);
      abre(`<div class="janela-educ"><div class="ods-topo"><img src="${{ICONE[n]}}" alt="ODS ${{n}}: ${{d.nome}}" width="110" height="110"><div><p class="meta-educ">Objetivo de Desenvolvimento Sustentável ${{n}}</p><h3 style="color:${{d.cor}}">${{d.nome}}</h3><p>${{d.objetivo}}.</p></div></div>
        <p><b>Metas ligadas à parada ${{o.dataset.parada}}:</b></p>
        <ul class="metas-educ">${{metas.map(m => `<li><b>${{m}}</b> ${{d.metas[m]}}.</li>`).join('')}}</ul>
        <p class="fonte-educ">Fonte: Nações Unidas no Brasil, Objetivos de Desenvolvimento Sustentável (brasil.un.org/pt-br/sdgs).</p>${{fechar}}</div>`);
    }}
  }});
  const nota = box.querySelector('.nota-educ');
  if (nota) nota.innerHTML = 'Competências gerais 2 (pensamento científico), 7 (argumentação com base em fatos) e 10 (agir de forma responsável e sustentável). <b>Toque no código de uma habilidade</b> para ler o texto oficial da BNCC e <b>toque no ícone de um ODS</b> para ver o objetivo e as metas da Agenda 2030 ligadas àquela parada.';
  const ref = document.createElement('div'); ref.className = 'refs-educ';
  ref.innerHTML = `<h3>Referências</h3><ol>${{REFS.map(r => `<li>${{r}}</li>`).join('')}}</ol><p class="nota-educ">Os ícones dos ODS são das Nações Unidas e foram usados com fins informativos, conforme as diretrizes da ONU, sem alteração. Seu uso não significa endosso da ONU às atividades da ANAP.</p>`;
  (nota || box.lastElementChild).after(ref);
}})();
'''
(d/'educ.js').write_text(js); print('educ.js', len(js))
