# Uso do logotipo e dos ícones dos ODS: regras da ONU

Documento de referência: Nações Unidas, *Guidelines for the use of the SDG logo including the colour wheel and 17 icons* (versão de setembro de 2023).
PDF: https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf
Página de materiais de comunicação da ONU (onde a ONU distribui logotipo, roda e ícones): https://www.un.org/sustainabledevelopment/news/communications-material/

Lido em 12/10/2026. O resumo abaixo foi feito a partir de leitura automática do PDF. Antes de publicar o app, confira as regras no PDF original.

## O que vale para um app educativo gratuito e não comercial de uma ONG

1. **Quem pode usar.** Entidades fora do Sistema ONU (governos, organizações sem fins lucrativos, empresas) podem usar a versão 2 do logotipo dos ODS (a versão sem o emblema da ONU), a roda colorida e os 17 ícones, seguindo as diretrizes. A versão 1, com o emblema da ONU, é exclusiva de órgãos da ONU.
2. **Uso informativo não precisa de autorização.** O uso informativo é o uso principalmente ilustrativo, não comercial, sem objetivo de arrecadar recursos. As diretrizes dizem que esse uso "does not require prior permission from the United Nations nor the conclusion of a licensing agreement". Um app educativo gratuito, sem venda, sem anúncios e sem pedido de doação ligado aos ícones se encaixa nessa categoria.
3. **Precisa de autorização:**
   - o **uso para arrecadação** (*fundraising*), quando os ícones ajudam a captar recursos, inclusive doações. Exige autorização prévia da ONU e contrato de licença, pedidos pelo formulário on-line.
   - o **uso comercial**, por empresas com fins lucrativos ou em produtos e brindes. Também exige autorização prévia e licença.
   - Se o app tiver um botão de doação, venda ou patrocínio associado aos ícones, o caso deixa de ser só informativo. Nesse caso é preciso pedir autorização.
4. **Proibido modificar os ícones:**
   - Use cada ícone inteiro: número, título e pictograma.
   - Não altere as cores e não troque cores entre ícones.
   - Não troque a fonte, não estique nem distorça, não recorte.
   - Não coloque o ícone em formas que não sejam quadradas. Mantenha a proporção 1:1.
   - Não aplique relevo, chanfro ou sombra.
   - Não reorganize os elementos do ícone.
   - Não agrupe ícones de forma arbitrária. Eles podem aparecer em linha ou alinhados à esquerda.
   - A versão invertida (pictograma colorido sobre fundo branco) só pode ser usada sobre fundo branco.
5. **Sem endosso.** O uso não significa que a ONU endossa a entidade, seus produtos ou atividades. É proibido usar os ícones para autopromoção ou ganho financeiro sem permissão escrita. Se o logotipo dos ODS aparecer ao lado do logotipo da ONG, as diretrizes pedem a frase "[Nome da entidade] apoia os Objetivos de Desenvolvimento Sustentável" ("supports the Sustainable Development Goals").
6. **Prazo.** O uso é permitido até 31/12/2030, salvo aviso em contrário da ONU. Publicações sobre os ODS podem continuar circulando depois dessa data.
7. **Idiomas.** O PDF traz os ícones nas seis línguas oficiais da ONU, que não incluem o português. As diretrizes não dizem quem pode produzir traduções. A ONU não se responsabiliza por traduções do texto dos ícones para línguas que não são oficiais da ONU. A versão em português do Brasil é distribuída pela ONU Brasil (https://brasil.un.org/pt-br/sdgs).
8. **Apps.** As diretrizes não tratam de aplicativos em especial. O que conta é a finalidade do uso: informativo, de arrecadação ou comercial.

**Recomendação prática:** use os ícones sem alteração, em tamanho que deixe o texto legível. Não use ícones ligados a doações ou compras. Ponha no app uma nota como: "Os ícones dos ODS são das Nações Unidas e foram usados com fins informativos, conforme as diretrizes da ONU. Seu uso não significa endosso da ONU." Guarde o link das diretrizes nos créditos do app. As diretrizes pedem que o PDF fique disponível na mesma página on-line que oferece os ícones.

## Cores oficiais (tabela do PDF de 2023)

| ODS | HEX | ODS | HEX |
|---|---|---|---|
| 1 | #E5243B | 10 | #DD1367 |
| 2 | #DDA63A | 11 | #FD9D24 |
| 3 | #4C9F38 | 12 | #BF8B2E |
| 4 | #C5192D | 13 | #3F7E44 |
| 5 | #FF3A21 | 14 | #0A97D9 |
| 6 | #26BDE2 | 15 | #56C02B |
| 7 | #FCC30B | 16 | #00689D |
| 8 | #A21942 | 17 | #19486A |
| 9 | #FD6925 | | |

## Arquivos de ícones em `ods-icons/`

- **Origem:** os arquivos `ods-02, 04, 06, 11, 12, 13, 14, 15` (.svg) foram baixados sem alteração da pasta `Icones_Oficiais_ONU` do repositório público da Anatel (Agência Nacional de Telecomunicações), módulo SEI IA, commit `36d5a5945130187ad6eeaea723aa33dfae27d125` (25/08/2026):
  https://github.com/anatelgovbr/mod-sei-ia/tree/master/sei/web/modulos/ia/imagens/Icones_Oficiais_ONU
  Arquivo de exemplo: https://raw.githubusercontent.com/anatelgovbr/mod-sei-ia/master/sei/web/modulos/ia/imagens/Icones_Oficiais_ONU/SDG-6.svg
  Os hashes SHA-256 estão em `ods-icons/SHA256SUMS.txt`.
- **Os PNG** (512×512) foram gerados a partir dos SVG com cairosvg. Só o formato mudou: o desenho é o mesmo.
- **Conferência visual:** são ícones quadrados, com número e título em português do Brasil ("ÁGUA POTÁVEL E SANEAMENTO", "AÇÃO CONTRA A MUDANÇA GLOBAL DO CLIMA" etc.) e os pictogramas e o layout da ONU. As cores de fundo coincidem com a tabela oficial, exceto no ODS 2: o SVG usa `#dda83a` e a tabela da ONU, `#DDA63A`. A diferença é mínima e não se vê a olho nu.
- **Limite da verificação:** os arquivos **não** foram comparados byte a byte com o pacote distribuído pela ONU Brasil, porque o site da ONU Brasil não pôde ser baixado deste ambiente. A Anatel identifica a pasta como "Ícones Oficiais ONU", mas é uma redistribuição. **Recomendação:** antes de publicar, baixe os ícones em português diretamente da ONU Brasil (https://brasil.un.org/pt-br/sdgs) e substitua estes arquivos, ou compare os dois.
