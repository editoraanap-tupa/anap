(function(){
'use strict';
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
let semente = 7;
const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
const R = (a, b) => a + rnd() * (b - a);
const sorte = (a, b) => a + Math.random() * (b - a);

/* ================= progresso (só neste aparelho) ================= */
let estado = { carimbos:{}, figs:{} };
try { estado = Object.assign(estado, JSON.parse(localStorage.getItem('ecolegal-viagem-v1')) || {}); } catch(e) {}
const salvar = () => { try { localStorage.setItem('ecolegal-viagem-v1', JSON.stringify(estado)); } catch(e) {} };

/* ================= som e voz ================= */
let somOn = true, ac = null;
function audio(){ try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch(e) { ac = null; } return ac; }
function tom(f, t0, dur, tipo, vol, f2){
  const c = audio(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
  o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
}
function ruido(dur, filtro, freq, vol, t0){
  const c = audio(); if (!c) return;
  const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + (t0 || 0);
  s.buffer = b; f.type = filtro; f.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.3, dur/4)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + dur);
}
const SOM = {
  pop:   () => tom(520, 0, .12, 'sine', .14, 900),
  ok:    () => { tom(660, 0, .14); tom(880, .1, .2); },
  clique:() => tom(1400, 0, .05, 'square', .04),
  vapor: () => ruido(.6, 'highpass', 2500, .05),
  planta:() => { tom(520, 0, .12); tom(660, .09, .12); tom(880, .18, .2); },
  chuva: () => ruido(2.4, 'lowpass', 1600, .12),
  splash:() => { ruido(.35, 'bandpass', 900, .2); tom(240, 0, .25, 'sine', .12, 90); },
  glub:  () => { tom(320, 0, .14, 'sine', .14, 140); tom(280, .18, .14, 'sine', .12, 120); tom(240, .36, .18, 'sine', .1, 100); },
  fig:   () => { tom(1175, 0, .12, 'triangle', .1); tom(1480, .08, .12, 'triangle', .1); tom(1760, .16, .25, 'triangle', .1); },
  vitoria:() => [523,659,784,1046,784,1046].forEach((f,i) => tom(f, i*.11, .22, 'triangle', .13)),
  carimbo:() => { tom(110, 0, .2, 'sine', .3, 50); ruido(.15, 'lowpass', 600, .25); }
};
const toca = n => { if (somOn && SOM[n]) try { SOM[n](); } catch(e) {} };
/* voz: uma fila só. Cada fala espera a anterior terminar; o texto do balão aparece junto com a voz.
   modo 'fila'     falas do jogo: entram na fila; instruções nunca são descartadas, comentários velhos dão lugar ao mais novo
   modo 'intercala' figurinha ou botão ouvir: pausa a fala atual, fala isto e depois retoma a frase interrompida
   modo 'depois'   fecho da parada: limpa o que estava esperando e fala assim que a frase atual acabar
   modo 'troca'    corta tudo e fala já */
let vozGen = 0, vozAtual = null, vozFila = [], vozTimer = 0;
const vozOk = () => somOn && 'speechSynthesis' in window;
const INSTRUCAO = /\b(toque|toca|arraste|arrasta|leve|monte|coloque|gire|ajude|plante|fa[çc]a|gira|junte|escolha|siga|abra|solte|puxe|encha)\b/i;
function calar(){ const ult = vozFila[vozFila.length - 1]; vozGen++; vozFila = []; vozAtual = null; clearTimeout(vozTimer); try { speechSynthesis.cancel(); } catch(e) {} if (ult && ult.aoComecar) ult.aoComecar(); }
function vozPartes(txt){ return txt.replace(/[^\p{L}\p{N}\s.,!?:;()'-]/gu, '').match(/[^.!?]+[.!?]*/gu) || []; }
function vozSegue(){
  clearTimeout(vozTimer);
  if (vozAtual && vozAtual.k >= vozAtual.partes.length) vozAtual = null;
  if (!vozAtual) { vozAtual = vozFila.shift() || null; if (!vozAtual) return; if (vozAtual.k === 0 && vozAtual.aoComecar) vozAtual.aoComecar(); }
  const item = vozAtual, k = item.k, gen = vozGen, frase = (item.partes[k] || '').trim();
  if (!frase) { item.k++; return vozSegue(); }
  let feito = false;
  const fim = () => { if (feito || gen !== vozGen || vozAtual !== item) return; feito = true; item.k = k + 1; setTimeout(() => { if (gen === vozGen) vozSegue(); }, 140); };
  try {
    const u = new SpeechSynthesisUtterance(frase), v = speechSynthesis.getVoices().find(v => /pt[-_]BR/i.test(v.lang));
    u.lang = 'pt-BR'; u.rate = .98; u.pitch = 1.2; if (v) u.voice = v;
    u.onend = u.onerror = fim;
    speechSynthesis.speak(u);
  } catch(e) {}
  vozTimer = setTimeout(fim, 2500 + frase.length * 95);   /* segurança: alguns navegadores não avisam o fim */
}
function falar(txt, modo, aoComecar){
  modo = modo || 'troca';
  if (!vozOk()) { aoComecar && aoComecar(); return; }
  const item = { txt, partes:vozPartes(txt), k:0, aoComecar, instrucao:INSTRUCAO.test(txt) };
  const ocioso = !vozAtual && !vozFila.length;
  if (modo === 'troca') { calar(); vozFila = [item]; setTimeout(vozSegue, 60); return; }
  if (modo === 'intercala') {
    if (vozAtual && vozAtual.txt === txt) return;
    const parado = vozAtual; vozGen++; clearTimeout(vozTimer); try { speechSynthesis.cancel(); } catch(e) {}
    vozAtual = null; vozFila = [item].concat(parado ? [{ ...parado, aoComecar:null }] : [], vozFila);
    setTimeout(vozSegue, 60); return;
  }
  if (modo === 'depois') vozFila = [];
  if (vozAtual && vozAtual.txt === txt || vozFila.some(f => f.txt === txt)) return;
  if (modo === 'fila' && !item.instrucao) vozFila = vozFila.filter(f => f.instrucao);
  if (modo === 'fila' && vozFila.length >= 3) vozFila.splice(0, vozFila.length - 2);
  vozFila.push(item);
  if (ocioso) vozSegue();
}
function bolha(el, txt, quem, auto){
  const mostra = () => {
    el.innerHTML = '';
    if ('speechSynthesis' in window) {
      const b = document.createElement('button'); b.className = 'ouvir'; b.setAttribute('aria-label', 'Ouvir');
      b.innerHTML = '<svg style="color:var(--azul)"><use href="#i-ouvir"/></svg>'; b.onclick = () => falar(txt, 'intercala'); el.appendChild(b);
    }
    if (quem) { const q = document.createElement('span'); q.className = 'quem'; q.textContent = quem; el.appendChild(q); }
    el.appendChild(document.createTextNode(txt));
    el.animate([{ opacity:.4 }, { opacity:1 }], { duration:250 });
  };
  if (auto) falar(txt, 'fila', mostra); else mostra();
}
$('#b-som').onclick = e => {
  somOn = !somOn; const b = e.currentTarget;
  b.setAttribute('aria-pressed', somOn); b.setAttribute('aria-label', somOn ? 'Som e voz ligados' : 'Som e voz desligados');
  b.querySelector('use').setAttribute('href', somOn ? '#i-som' : '#i-mudo');
  if (!somOn) calar(); else toca('pop');
};

/* ================= desenhos pequenos das paradas fechadas ================= */
const MINI = {
  pantanal:'<rect width="120" height="90" fill="#FFD9B8"/><rect y="50" width="120" height="40" fill="#5DB7C9"/><g fill="#2F8A47"><circle cx="20" cy="50" r="12"/><circle cx="34" cy="46" r="10"/><circle cx="96" cy="48" r="12"/></g><path d="M64 36 v18 M70 36 v18" stroke="#12235A" stroke-width="2"/><ellipse cx="67" cy="32" rx="12" ry="8" fill="#fff"/><path d="M76 30 q6 -14 0 -20" stroke="#12235A" stroke-width="4" fill="none"/><path d="M75 22 l3 2" stroke="#E5392C" stroke-width="5"/><path d="M76 10 l14 4" stroke="#12235A" stroke-width="3"/>',
  cerrado:'<rect width="120" height="90" fill="#FFE9B8"/><rect y="56" width="120" height="34" fill="#D9B44A"/><rect y="74" width="120" height="16" fill="#4D97FF"/><path d="M40 60 C38 40 46 30 40 20" stroke="#6E4426" stroke-width="5" fill="none"/><g stroke="#3E9A55" stroke-width="4" stroke-linecap="round"><path d="M40 20 l-16 -6 M40 20 l-14 8 M40 20 l16 -6 M40 20 l14 8 M40 20 l0 -14"/></g><ellipse cx="86" cy="38" rx="20" ry="14" fill="#F2C230"/><path d="M86 60 V48" stroke="#6E4426" stroke-width="5"/>',
  mata:'<rect width="120" height="90" fill="#CFF1FF"/><path d="M0 70 L30 20 L60 60 L90 14 L120 60 V90 H0Z" fill="#1F8A4C"/><rect x="56" y="30" width="10" height="44" fill="#BFE6FF"/><ellipse cx="61" cy="76" rx="20" ry="6" fill="#7CCBFF"/><g fill="#2AA65C"><circle cx="20" cy="62" r="10"/><circle cx="100" cy="60" r="12"/></g>',
  pampa:'<rect width="120" height="90" fill="#D4F2FF"/><path d="M0 50 Q40 36 80 48 T120 44 V90 H0Z" fill="#7CCB5A"/><g fill="#9BE0F0"><path d="M10 64 H60 L56 72 H6Z"/><path d="M66 70 H118 L114 78 H62Z"/></g><path d="M96 46 V24" stroke="#5A6787" stroke-width="2"/><g fill="#fff" stroke="#5A6787"><path d="M96 24 l-10 -6 2 -3Z"/><path d="M96 24 l10 6 -2 3Z"/></g>',
  oceano:'<rect width="120" height="90" fill="#1F7FD6"/><rect width="120" height="22" fill="#BFE6FF"/><path d="M0 22 Q15 16 30 22 T60 22 T90 22 T120 22 V30 H0Z" fill="#3FA9F5"/><ellipse cx="60" cy="58" rx="26" ry="10" fill="#0E3F7A"/><path d="M84 58 l14 -10 v20Z" fill="#0E3F7A"/><g fill="#FFC83D"><ellipse cx="24" cy="74" rx="8" ry="4"/></g><path d="M0 88 Q20 80 40 88 T80 88 T120 88 V90 H0Z" fill="#E8C27A"/>',
  antartida:'<rect width="120" height="90" fill="#DDF1FF"/><rect y="56" width="120" height="34" fill="#4D97FF"/><path d="M18 58 L36 22 L58 30 L72 58Z" fill="#fff"/><path d="M24 58 L40 74 L66 70 L72 58Z" fill="#BFE6FF"/><ellipse cx="92" cy="46" rx="9" ry="13" fill="#12235A"/><ellipse cx="92" cy="48" rx="6" ry="10" fill="#fff"/><path d="M90 36 l4 0 l-2 3Z" fill="#FFC83D"/>',
  andes:'<rect width="120" height="90" fill="#CFE8FF"/><path d="M0 70 L34 18 L56 50 L80 10 L120 66 V90 H0Z" fill="#7C8AA8"/><path d="M26 30 L34 18 L42 30 L36 28Z M72 22 L80 10 L90 24 L82 22Z" fill="#fff"/><path d="M60 90 C62 76 70 70 66 58" stroke="#4D97FF" stroke-width="5" fill="none"/>',
  deserto:'<rect width="120" height="90" fill="#FFE3A8"/><circle cx="92" cy="22" r="12" fill="#FFC83D"/><path d="M0 60 Q30 40 60 58 T120 52 V90 H0Z" fill="#E8B068"/><path d="M0 74 Q40 60 80 72 T120 70 V90 H0Z" fill="#D9963F"/><path d="M30 56 V40" stroke="#6E4426" stroke-width="3"/><ellipse cx="30" cy="38" rx="16" ry="5" fill="#5FA83A"/>',
  lagos:'<rect width="120" height="90" fill="#CFEAFF"/><path d="M0 46 Q30 38 60 44 T120 40 V90 H0Z" fill="#6DBE6A"/><g fill="#2F6FD0" stroke="#1D4FA0" stroke-width="1.5"><path d="M10 56 Q24 48 40 54 Q46 62 34 66 Q18 68 10 56Z"/><path d="M48 50 Q64 44 80 52 Q86 60 72 64 Q56 64 48 50Z"/><path d="M86 60 Q100 54 112 60 Q112 70 98 72 Q86 70 86 60Z"/></g><g fill="#1F7E46"><path d="M6 44 l5 -14 l5 14Z"/><path d="M100 40 l5 -16 l5 16Z"/><path d="M110 42 l4 -12 l4 12Z"/></g><path d="M20 58 q6 -2 12 0 M60 54 q6 -2 12 0" stroke="#BFE3FF" stroke-width="1.5" fill="none"/>',
  diques:'<rect width="120" height="90" fill="#D7EEFF"/><rect y="40" width="120" height="22" fill="#3F8FE0"/><path d="M0 62 L120 62 L120 68 L0 68Z" fill="#8FBF5A"/><rect y="68" width="120" height="22" fill="#7CCB5A"/><path d="M0 60 H120" stroke="#5A7A3A" stroke-width="3"/><g transform="translate(78 30)"><path d="M-5 38 L-3 6 L3 6 L5 38Z" fill="#C9744A" stroke="#7A3E22" stroke-width="1.2"/><g stroke="#7A3E22" stroke-width="1" fill="#FFF3D6"><path d="M0 8 L-4 -16 L2 -16Z"/><path d="M0 8 L24 4 L24 10Z"/><path d="M0 8 L4 32 L-2 32Z"/><path d="M0 8 L-24 12 L-24 6Z"/></g><circle cy="8" r="2.5" fill="#7A3E22"/></g><g fill="#FF6B5A"><rect x="18" y="74" width="5" height="12"/><rect x="26" y="74" width="5" height="12"/></g><g fill="#FFC83D"><rect x="34" y="74" width="5" height="12"/></g>',
  casa:'<rect width="120" height="90" fill="#D4F2FF"/><rect y="70" width="120" height="20" fill="#7CCB5A"/><rect x="34" y="40" width="52" height="34" fill="#FFF0BD"/><path d="M28 42 L60 18 L92 42Z" fill="#FF6B5A"/><rect x="70" y="20" width="12" height="10" fill="#2E7BF6"/><rect x="52" y="54" width="14" height="20" fill="#8A5630"/>'
};
const mini = (k, cor) => `<svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;background:${cor}">${MINI[k]}</svg>`;
const figSvg = (sym, vb) => `<svg viewBox="${vb || '0 0 160 110'}" aria-hidden="true"><use href="#${sym}"/></svg>`;

/* ================= as paradas ================= */
const PARADAS = [
  { id:'amazonia', nome:'Amazônia', lugar:'Brasil · Floresta', cor:'#1F8A4C', fundo:'#BDEBC9', lon:-62, lat:-4, aberta:true,
    thumb:['f-arara','0 0 100 130'], capa:'capa-amazonia', amigo:{ nome:'Rosinha, a boto-cor-de-rosa', svg:figSvg('f-boto','0 0 150 100') },
    figs:[
      { id:'boto', nome:'Boto-cor-de-rosa', sym:'f-boto', vb:'0 0 150 100', fato:'O boto-cor-de-rosa é o maior golfinho de rio do mundo. Ele vive nos rios da Amazônia.' },
      { id:'arara', nome:'Arara-vermelha', sym:'f-arara', vb:'0 0 100 130', fato:'A arara-vermelha come frutos e espalha as sementes pela floresta. Assim nascem novas árvores.' },
      { id:'vitoria', nome:'Vitória-régia', sym:'f-vitoria', vb:'0 0 150 80', fato:'A folha da vitória-régia pode passar de 2 metros de largura e flutua na água.' },
      { id:'ribeirinha', nome:'Família ribeirinha', sym:'f-ribeirinha', vb:'0 0 160 130', fato:'Famílias ribeirinhas moram na beira dos rios. O rio é a rua: vão de barco para a escola, para pescar e para visitar os vizinhos.' }
    ],
    fato:'Uma árvore grande da Amazônia solta cerca de mil litros de água por dia no ar. Esse vapor forma rios voadores, que levam chuva para muito longe.' },
  { id:'caatinga', nome:'Caatinga', lugar:'Brasil · Sertão', cor:'#C97D3E', fundo:'#FFE2B8', lon:-40, lat:-8, aberta:true,
    thumb:['f-mandacaru','0 0 100 150'], capa:'capa-caatinga', amigo:{ nome:'Lia, do sertão', svg:'<svg viewBox="10 4 100 100" aria-hidden="true"><use href="#lia" width="120" height="170"/></svg>' },
    figs:[
      { id:'mandacaru', nome:'Mandacaru', sym:'f-mandacaru', vb:'0 0 100 150', fato:'O mandacaru é um cacto que guarda água dentro do caule. Quando ele floresce, o povo do sertão diz que a chuva vem aí.' },
      { id:'asabranca', nome:'Asa-branca', sym:'f-asabranca', vb:'0 0 120 80', fato:'A asa-branca é uma pomba do sertão. Ela vai embora na seca e volta quando a chuva chega.' },
      { id:'tatu', nome:'Tatu-bola', sym:'f-tatu', vb:'0 0 120 80', fato:'O tatu-bola só existe no Brasil. Quando sente perigo, ele se enrola e vira uma bola.' },
      { id:'umbu', nome:'Umbuzeiro', sym:'f-umbu', vb:'0 0 150 130', fato:'O umbuzeiro guarda água em batatas nas raízes. Ele dá o umbu, uma fruta azedinha e gostosa.' }
    ],
    fato:'Uma cisterna de placas guarda até 16 mil litros de água da chuva. A família usa essa água para beber e cozinhar nos 6 a 8 meses de seca.' },
  { id:'vilas', nome:'Vilas sobre a água', lugar:'Pelo mundo', cor:'#1B56C4', fundo:'#CDEBFF', lon:104, lat:13, aberta:true,
    thumb:['f-uros','0 0 170 110'], capa:'f-uros', amigo:{ nome:'Pingo', svg:'<svg viewBox="-16 -8 152 170" aria-hidden="true" style="width:86%;height:86%"><use href="#pc"/></svg>' },
    figs:[
      { id:'uros', nome:'Ilhas de totora', lugar:'Lago Titicaca · Peru e Bolívia', sym:'f-uros', vb:'0 0 170 110', fato:'O povo Uro constrói ilhas que flutuam com a totora, uma planta do lago. Como a totora apodrece embaixo, eles põem camadas novas por cima o tempo todo.' },
      { id:'ganvie', nome:'Ganvié', lugar:'Lago Nokoué · Benin', sym:'f-ganvie', vb:'0 0 170 110', fato:'Ganvié é uma cidade sobre um lago na África, com mais de 20 mil moradores. As casas ficam sobre estacas e todo mundo anda de canoa.' },
      { id:'kopanyi', nome:'Ko Panyi', lugar:'Baía de Phang Nga · Tailândia', sym:'f-kopanyi', vb:'0 0 170 110', fato:'Nesta vila de pescadores construída sobre o mar, as crianças jogam futebol num campo de madeira em cima da água. Na maré alta, o campo fica alagado!' },
      { id:'barcoescola', nome:'Barco-escola', lugar:'Rios da Amazônia · Brasil', sym:'f-barcoescola', vb:'0 0 170 110', fato:'Na Amazônia, muitas crianças ribeirinhas vão para a escola de barco. O rio é o caminho de todo dia.' }
    ],
    fato:'Pelo mundo, milhões de pessoas vivem sobre a água: em casas sobre estacas, em barcos ou em ilhas que flutuam. Cada povo encontrou um jeito de viver com a água.' },
  { id:'pantanal', nome:'Pantanal', lugar:'Brasil · Cheia e seca', cor:'#2E9BD6', fundo:'#FFE6C2', lon:-57, lat:-18, aberta:true,
    thumb:['f-tuiuiu','0 0 100 130'], capa:'capa-pantanal', amigo:{ nome:'Capi, a capivara', svg:figSvg('f-capivara','0 0 140 100') },
    figs:[
      { id:'tuiuiu', nome:'Tuiuiú', sym:'f-tuiuiu', vb:'0 0 100 130', fato:'O tuiuiú é a ave símbolo do Pantanal. Ele faz ninhos enormes no alto das árvores e pesca nas lagoas.' },
      { id:'jacare', nome:'Jacaré-do-pantanal', sym:'f-jacare', vb:'0 0 150 80', fato:'O jacaré-do-pantanal passa horas quietinho na água, só com os olhos e o focinho de fora.' },
      { id:'onca', nome:'Onça-pintada', sym:'f-onca', vb:'0 0 140 100', fato:'A onça-pintada é o maior felino das Américas e nada muito bem. Cada onça tem pintas diferentes.' },
      { id:'capivara', nome:'Capivara', sym:'f-capivara', vb:'0 0 140 100', fato:'A capivara é o maior roedor do mundo. Ela adora água e consegue ficar alguns minutos mergulhada.' }
    ],
    fato:'O Pantanal é uma das maiores áreas alagadas do planeta. Na cheia, a água cobre os campos. Na seca, ela fica nos rios e nas lagoas.' },
  { id:'cerrado', nome:'Cerrado', lugar:'Brasil · Berço das águas', cor:'#B8862E', fundo:'#F3E3B0', lon:-48, lat:-14, aberta:true,
    thumb:['f-lobo','0 0 120 130'], capa:'capa-cerrado', amigo:{ nome:'Guará, o lobo-guará', svg:'<svg viewBox="-4 -2 70 70" aria-hidden="true"><use href="#f-lobo" width="120" height="130"/></svg>' },
    figs:[
      { id:'lobo', nome:'Lobo-guará', sym:'f-lobo', vb:'0 0 120 130', fato:'O lobo-guará tem pernas longas para enxergar por cima do capim. Ele come frutas e espalha sementes.' },
      { id:'tamandua', nome:'Tamanduá-bandeira', sym:'f-tamandua', vb:'0 0 150 100', fato:'O tamanduá-bandeira come milhares de formigas e cupins por dia com sua língua comprida.' },
      { id:'pequi', nome:'Pequi', sym:'f-pequi', vb:'0 0 100 100', fato:'O pequi é um fruto do Cerrado muito usado na comida. Por dentro tem espinhos, então se come com cuidado!' },
      { id:'buriti', nome:'Buriti', sym:'f-buriti', vb:'0 0 100 150', fato:'O buriti é uma palmeira que cresce nas veredas, lugares encharcados onde nascem muitos rios.' }
    ],
    fato:'O Cerrado é o berço das águas do Brasil. As raízes fundas ajudam a chuva a entrar no chão, e dali nascem rios de quase todas as grandes bacias do país.' },
  { id:'mata', nome:'Mata Atlântica', lugar:'Brasil · Nascentes', cor:'#12753F', fundo:'#CDEFD6', lon:-44, lat:-22, aberta:true,
    thumb:['f-mico','0 0 120 130'], capa:'capa-mata', amigo:{ nome:'Mica, a mico-leão-dourado', svg:figSvg('f-mico','0 0 120 130') },
    figs:[
      { id:'mico', nome:'Mico-leão-dourado', sym:'f-mico', vb:'0 0 120 130', fato:'O mico-leão-dourado só existe na Mata Atlântica. Ele vive em família e anda pelas copas das árvores.' },
      { id:'bromelia', nome:'Bromélia', sym:'f-bromelia', vb:'0 0 100 100', fato:'A bromélia guarda água entre as folhas. Esse copinho vira casa de pererecas, insetos e até girinos.' },
      { id:'perereca', nome:'Perereca-de-bromélia', sym:'f-perereca', vb:'0 0 100 80', fato:'Algumas pererecas passam a vida inteira dentro das bromélias, onde sempre tem um pouco de água.' },
      { id:'tucano', nome:'Tucano-de-bico-verde', sym:'f-tucano', vb:'0 0 120 100', fato:'O tucano-de-bico-verde come frutos e espalha as sementes, ajudando a floresta a crescer.' }
    ],
    fato:'A Mata Atlântica segura a umidade que vem do mar e protege as nascentes. A maioria dos brasileiros mora na região dela e bebe água que nasce nas suas matas.' },
  { id:'pampa', nome:'Pampa', lugar:'Brasil · Água escondida', cor:'#5FA83A', fundo:'#E2F4C8', lon:-54, lat:-31, aberta:true,
    thumb:['f-joao','0 0 120 110'], capa:'capa-pampa', amigo:{ nome:'Barrinho, o joão-de-barro', svg:figSvg('f-joao','0 0 120 110') },
    figs:[
      { id:'joao', nome:'João-de-barro', sym:'f-joao', vb:'0 0 120 110', fato:'O joão-de-barro constrói sua casa com barro e palha. A casa parece um forninho e tem até uma parede lá dentro.' },
      { id:'ema', nome:'Ema', sym:'f-ema', vb:'0 0 100 130', fato:'A ema é a maior ave do Brasil. Ela não voa, mas corre muito rápido pelos campos.' },
      { id:'queroquero', nome:'Quero-quero', sym:'f-queroquero', vb:'0 0 100 100', fato:'O quero-quero grita alto para avisar quando alguém chega perto do ninho. Ele é o guarda do campo!' },
      { id:'corticeira', nome:'Corticeira-do-banhado', sym:'f-corticeira', vb:'0 0 120 120', fato:'A corticeira cresce na beira dos banhados e tem flores vermelhas que os beija-flores adoram.' }
    ],
    fato:'O Pampa é um bioma de campos e banhados. Debaixo dele fica parte do Aquífero Guarani, uma das maiores reservas de água doce escondida debaixo da terra.' },
  { id:'oceano', nome:'Oceano', lugar:'Planeta azul', cor:'#1546A8', fundo:'#D6ECFF', lon:-25, lat:-15, aberta:true,
    thumb:['f-tartaruga','0 0 150 110'], capa:'capa-oceano', amigo:{ nome:'Tata, a tartaruga-marinha', svg:figSvg('f-tartaruga','0 0 150 110') },
    figs:[
      { id:'tartaruga', nome:'Tartaruga-marinha', sym:'f-tartaruga', vb:'0 0 150 110', fato:'A tartaruga-marinha nada milhares de quilômetros e volta para a praia onde nasceu para botar seus ovos.' },
      { id:'jubarte', nome:'Baleia-jubarte', sym:'f-jubarte', vb:'0 0 170 100', fato:'A baleia-jubarte canta! Todo inverno ela vem para o mar quentinho do Brasil para ter seus filhotes.' },
      { id:'coral', nome:'Coral', sym:'f-coral', vb:'0 0 100 100', fato:'O coral parece planta, mas é um bicho. Muitos corais juntos formam o recife, a casa de muitos peixes.' },
      { id:'budiao', nome:'Budião-azul', sym:'f-budiao', vb:'0 0 120 80', fato:'O budião-azul raspa as algas dos corais com o bico. Assim ele ajuda a manter o recife limpo.' }
    ],
    fato:'Os oceanos guardam quase toda a água do planeta: de cada 100 copos de água, uns 97 são de água salgada. O sol transforma um pouco dela em chuva doce.' },
  { id:'antartida', nome:'Antártica', lugar:'Água congelada', cor:'#3E8AD6', fundo:'#E2F2FF', lon:10, lat:-74, aberta:true,
    thumb:['f-pinguim','0 0 90 130'], capa:'capa-antartida', amigo:{ nome:'Neve, a pinguim', svg:figSvg('f-pinguim','0 0 90 130') },
    figs:[
      { id:'pinguim', nome:'Pinguim-de-adélia', sym:'f-pinguim', vb:'0 0 90 130', fato:'O pinguim-de-adélia não voa, mas nada muito bem. Debaixo da água ele usa as asas como remos.' },
      { id:'foca', nome:'Foca-de-weddell', sym:'f-foca', vb:'0 0 150 90', fato:'A foca-de-weddell vive bem no sul do planeta. Ela abre buracos no gelo com os dentes para respirar.' },
      { id:'krill', nome:'Krill', sym:'f-krill', vb:'0 0 120 70', fato:'O krill é um bichinho parecido com camarão. É pequeno, mas é a comida de pinguins, focas e baleias.' },
      { id:'baleiaazul', nome:'Baleia-azul', sym:'f-baleiaazul', vb:'0 0 170 80', fato:'A baleia-azul é o maior animal que já existiu na Terra, e ela se alimenta de bichinhos minúsculos: o krill.' }
    ],
    fato:'A Antártica é o lugar mais frio do planeta. A maior parte da água doce da Terra está congelada, e quase todo esse gelo fica lá.' },
  { id:'andes', nome:'Andes e Himalaia', lugar:'Montanhas · Geleiras', cor:'#7C8AA8', fundo:'#E4ECF8', lon:86, lat:29, aberta:true,
    thumb:['f-lhama','0 0 120 130'], capa:'capa-andes', amigo:{ nome:'Quilla, a lhama', svg:figSvg('f-lhama','0 0 120 130') },
    figs:[
      { id:'lhama', nome:'Lhama', sym:'f-lhama', vb:'0 0 120 130', fato:'A lhama vive no alto dos Andes. O pelo grosso a protege do frio, e ela cantarola um \'hmmm\' para conversar com as outras.' },
      { id:'condor', nome:'Condor-dos-andes', sym:'f-condor', vb:'0 0 170 100', fato:'O condor-dos-andes é uma das maiores aves que voam. Ele plana horas no vento quase sem bater as asas.' },
      { id:'iaque', nome:'Iaque', sym:'f-iaque', vb:'0 0 150 110', fato:'O iaque vive nas montanhas do Himalaia. Tem pelo longo até quase o chão e grunhe em vez de mugir.' },
      { id:'leopardo', nome:'Leopardo-das-neves', sym:'f-leopardo', vb:'0 0 150 110', fato:'O leopardo-das-neves vive nas montanhas geladas da Ásia. Ele usa a cauda peluda como cachecol para se aquecer.' }
    ],
    fato:'As geleiras das montanhas são caixas-d\'água naturais: guardam a neve do inverno como gelo e soltam a água devagar, enchendo rios e lagos no tempo seco.' },
  { id:'deserto', nome:'Desertos', lugar:'Bichos que guardam água', cor:'#D9963F', fundo:'#FFF0D6', lon:12, lat:23, aberta:true,
    thumb:['f-feneco','0 0 120 120'], capa:'capa-deserto', amigo:{ nome:'Feco, o feneco', svg:figSvg('f-feneco','0 0 120 120') },
    figs:[
      { id:'feneco', nome:'Feneco', sym:'f-feneco', vb:'0 0 120 120', fato:'O feneco é a menor raposa do mundo e tem as maiores orelhas para o seu tamanho. As orelhas soltam o calor e escutam bichinhos debaixo da areia.' },
      { id:'besouro', nome:'Besouro-da-neblina', sym:'f-besouro', vb:'0 0 120 90', fato:'No deserto do Namibe, este besouro sobe no alto da duna de manhãzinha. A neblina vira gotinhas nas costas dele, e as gotas escorrem até a boca.' },
      { id:'dromedario', nome:'Dromedário', sym:'f-dromedario', vb:'0 0 140 130', fato:'O dromedário pode beber mais de cem litros de água de uma vez. A corcova dele guarda gordura, não água.' },
      { id:'saguaro', nome:'Cacto-saguaro', sym:'f-saguaro', vb:'0 0 100 130', fato:'O saguaro é um cacto gigante do deserto de Sonora. Depois da chuva, as dobras dele se abrem como uma sanfona para guardar água.' }
    ],
    fato:'Nos desertos chove muito pouco. Plantas e bichos têm truques para pegar e guardar cada gota: beber a neblina, encher o corpo de água ou achar a água escondida debaixo da areia.' },
  { id:'lagos', nome:'Grandes Lagos', lugar:'América do Norte · Lagos gigantes', cor:'#2F6FD0', fundo:'#D8ECFF', lon:-84, lat:45, aberta:true,
    thumb:['f-castor','0 0 120 100'], capa:'capa-lagos', amigo:{ nome:'Tico, o castor', svg:figSvg('f-castor','0 0 120 100') },
    figs:[
      { id:'castor', nome:'Castor', sym:'f-castor', vb:'0 0 120 100', fato:'O castor corta galhos com os dentes, que nunca param de crescer. Com eles e com lama, constrói represas e a sua casa no meio da lagoa.' },
      { id:'mobelha', nome:'Mobelha-grande', sym:'f-mobelha', vb:'0 0 130 90', fato:'A mobelha-grande mergulha fundo para pegar peixes. O canto dela parece um uivo e ecoa longe nos lagos.' },
      { id:'alce', nome:'Alce', sym:'f-alce', vb:'0 0 120 120', fato:'O alce é o maior bicho da família dos veados. Ele adora as plantas dos brejos e nada muito bem.' },
      { id:'truta', nome:'Truta-de-riacho', sym:'f-truta', vb:'0 0 130 70', fato:'A truta-de-riacho só vive em água fria e limpa. Ela gosta das lagoas que os castores fazem.' }
    ],
    fato:'Os Grandes Lagos são cinco lagos gigantes na América do Norte. Juntos, guardam mais ou menos um quinto da água doce dos lagos e rios do planeta.' },
  { id:'diques', nome:'Terra dos diques', lugar:'Europa · Morar abaixo do mar', cor:'#E07A3A', fundo:'#FDEBDC', lon:5, lat:52, aberta:true,
    thumb:['f-cegonha','0 0 100 130'], capa:'capa-diques', amigo:{ nome:'Pim, a cegonha', svg:figSvg('f-cegonha','0 0 100 130') },
    figs:[
      { id:'cegonha', nome:'Cegonha-branca', sym:'f-cegonha', vb:'0 0 100 130', fato:'A cegonha-branca faz ninhos enormes em telhados e postes. No fim do verão, ela voa até a África e depois volta.' },
      { id:'moinho', nome:'Moinho de polder', sym:'f-moinho', vb:'0 0 100 130', fato:'Os moinhos de polder usavam a força do vento para tirar a água dos campos e jogar nos canais.' },
      { id:'tulipa', nome:'Tulipa', sym:'f-tulipa', vb:'0 0 100 120', fato:'A tulipa nasce de um bulbo enterrado no chão. Na primavera, os campos ficam cheios de fileiras coloridas.' },
      { id:'focacomum', nome:'Foca-comum', sym:'f-focacomum', vb:'0 0 150 90', fato:'A foca-comum descansa nos bancos de areia do Mar de Wadden quando a maré baixa, e nada para pescar quando a maré sobe.' }
    ],
    fato:'Uma parte grande da Holanda fica abaixo do nível do mar. Diques seguram o mar, bombas tiram a água dos campos e praças e telhados verdes guardam a chuva.' },
  { id:'casa', nome:'De volta para casa', lugar:'Onde você mora', cor:'#FF6B5A', fundo:'#FFE6DC', lon:-47, lat:-23, aberta:true, semPino:true,
    thumb:['pingo','-8 -6 136 166'], capa:'capa-casa', amigo:{ nome:'Pingo', svg:'<svg viewBox="-8 -6 136 166" aria-hidden="true"><use href="#pingo"/></svg>' },
    figs:[
      { id:'sabia', nome:'Sabiá-laranjeira', sym:'f-sabia', vb:'0 0 120 100', fato:'O sabiá-laranjeira é a ave símbolo do Brasil. Ele canta bem cedinho, e o seu canto anuncia a primavera.' },
      { id:'bemtevi', nome:'Bem-te-vi', sym:'f-bemtevi', vb:'0 0 120 100', fato:'O bem-te-vi parece falar o próprio nome: bem-te-vi! Ele vive nas cidades e come insetos, frutinhas e até peixinhos.' },
      { id:'joaninha', nome:'Joaninha', sym:'f-joaninha', vb:'0 0 120 100', fato:'A joaninha é amiga da horta: ela come os pulgões que estragam as plantas. Assim a horta não precisa de veneno.' },
      { id:'horta', nome:'Horta de casa', sym:'f-horta', vb:'0 0 140 100', fato:'Uma horta pode caber no quintal ou num vaso. Regar com a água da chuva guardada na cisterna economiza a água tratada da torneira.' }
    ],
    fato:'Cada pessoa precisa de uns 110 litros de água por dia para beber, cozinhar e se lavar. Fechar a torneira, consertar vazamentos, guardar a chuva e cuidar dos córregos faz cada gota render.' },
];
const abertas = PARADAS.filter(p => p.aberta);
const totalFigs = abertas.reduce((s,p) => s + p.figs.length, 0);
function contar(){
  $('#n-carimbos').textContent = Object.keys(estado.carimbos).length;
  $('#n-figs').textContent = Object.keys(estado.figs).length;
  $('#n-figs-tot').textContent = totalFigs;
  $('#n-paradas').textContent = PARADAS.length;
  $('#n-abertas').textContent = `${abertas.length} abertas, ${PARADAS.length - abertas.length} chegando`;
}

/* ================= navegação ================= */
let limpar = null;
function ir(id){
  if (limpar) { try { limpar(); } catch(e) {} limpar = null; }
  calar();
  document.querySelectorAll('.tela').forEach(t => t.hidden = t.id !== id);
  globoAtivo = id === 't-planeta';
  if (globoAtivo) { montarTrilha(); if (!girando) { girando = true; requestAnimationFrame(girar); } }
  window.scrollTo(0, 0);
}
document.querySelectorAll('[data-ir]').forEach(b => b.onclick = () => ir(b.dataset.ir));
$('#b-logo').onclick = () => ir('t-planeta');
$('#b-volta-planeta').onclick = () => ir('t-planeta');
$('#b-educ').onclick = () => ir('t-educ');
$('#b-pass').onclick = () => abrirLivro('pass');
$('#b-album').onclick = () => abrirLivro('album');
$('#b-comecar').onclick = () => { const p = abertas.find(p => !estado.carimbos[p.id]) || abertas[0]; viajar(p); };

/* ================= globo 3D (projeção ortográfica em canvas) ================= */
const RAD = Math.PI / 180;
const CONT = {
  sul:[[-77,8],[-72,12],[-67,11],[-61,10.5],[-59,8],[-55,6],[-51,4],[-50,1],[-48,-1],[-44,-2.5],[-40,-3],[-35,-5.5],[-35,-9],[-37,-12],[-39,-14],[-39,-18],[-40.5,-21],[-42,-23],[-45,-23.8],[-48,-26],[-48.6,-28],[-50,-30],[-52,-32],[-53.5,-34],[-55,-35],[-58,-34.5],[-58,-38],[-62,-39],[-65,-42],[-66,-46],[-68,-50],[-69,-52],[-71,-53],[-74,-50],[-75,-46],[-73.5,-42],[-73.5,-37],[-71.6,-33],[-71.5,-28],[-70.5,-23],[-70.2,-18.5],[-72,-17],[-76,-14],[-77,-12],[-78,-9],[-80,-6],[-81,-4.5],[-80,-2],[-80.5,0],[-78.5,2],[-77.5,4],[-77,6]],
  central:[[-77,8],[-80,9],[-83,9],[-86,12],[-88,14],[-91,15],[-94,16],[-97,16],[-105,20],[-97,20],[-91,19],[-87,21],[-88,17],[-84,15],[-83,11]],
  norte:[[-97,20],[-97,26],[-90,30],[-84,30],[-81,25],[-80,31],[-76,35],[-75,38],[-70,42],[-67,45],[-60,46],[-55,51],[-60,55],[-65,60],[-78,62],[-80,66],[-95,72],[-120,72],[-140,70],[-160,71],[-165,65],[-160,60],[-150,60],[-135,58],[-124,48],[-124,40],[-117,33],[-112,30],[-109,24],[-105,20]],
  groen:[[-55,60],[-45,60],[-20,70],[-20,80],[-60,82],[-70,77],[-55,70]],
  eurasia:[[-10,36],[-9,43],[-2,44],[-5,48],[5,52],[10,55],[5,58],[10,63],[20,70],[30,70],[45,68],[60,70],[80,73],[100,77],[130,72],[160,70],[180,67],[180,62],[160,60],[155,55],[140,50],[140,40],[130,35],[122,30],[120,22],[110,20],[105,10],[103,2],[100,8],[98,15],[92,22],[88,22],[80,15],[77,8],[72,20],[66,25],[57,25],[52,28],[48,30],[55,22],[58,18],[52,15],[43,13],[35,28],[33,31],[28,36],[26,40],[23,36],[20,40],[15,38],[12,44],[8,44],[3,42],[-5,36]],
  africa:[[-17,21],[-17,15],[-12,8],[-8,5],[5,5],[9,4],[10,0],[12,-5],[13,-13],[12,-18],[15,-27],[18,-34],[25,-34],[32,-28],[35,-23],[40,-15],[40,-10],[40,-3],[43,0],[51,11],[43,12],[38,18],[33,28],[32,31],[20,32],[10,33],[10,37],[0,36],[-5,36],[-10,30],[-15,27]],
  madag:[[44,-25],[47,-25],[50,-15],[48,-12],[44,-17]],
  austr:[[114,-22],[114,-34],[120,-34],[130,-32],[138,-35],[146,-39],[150,-37],[153,-28],[153,-25],[145,-15],[142,-11],[140,-18],[136,-12],[130,-12],[126,-14],[122,-18]],
  uk:[[-5,50],[1,51],[-2,56],[-5,58],[-6,55]],
  japao:[[130,31],[136,34],[141,38],[142,44],[140,41],[136,36]],
  indon:[[95,5],[106,-6],[116,-8],[120,-9],[110,-3],[104,0]],
  borneo:[[109,2],[117,7],[119,1],[116,-4],[110,-2]],
  nz:[[167,-46],[174,-41],[178,-38],[172,-35],[171,-42]],
  antart:(() => { const a = []; for (let l = -180; l <= 180; l += 10) a.push([l, -68 + 3*Math.sin(l*RAD*3)]); for (let l = 180; l >= -180; l -= 30) a.push([l, -89]); return a; })()
};
/* contornos reais dos continentes: Natural Earth 1:110m (domínio público) */
const TERRAS = [[[-59.6,-80.0],[-59.9,-80.5],[-60.2,-81.0],[-62.3,-80.9],[-64.5,-80.9],[-65.7,-80.6],[-65.7,-80.5],[-66.3,-80.3],[-64.0,-80.3],[-61.9,-80.4],[-61.1,-80.0],[-60.6,-79.6],[-59.6,-80.0]],[[-159.2,-79.5],[-161.1,-79.6],[-162.4,-79.3],[-163.0,-78.9],[-163.1,-78.9],[-163.7,-78.6],[-163.1,-78.2],[-161.2,-78.4],[-160.2,-78.7],[-159.5,-79.0],[-159.2,-79.5]],[[-45.2,-78.0],[-43.9,-78.5],[-43.5,-79.1],[-43.4,-79.5],[-43.3,-80.0],[-44.9,-80.3],[-46.5,-80.6],[-48.4,-80.8],[-50.5,-81.0],[-52.9,-81.0],[-54.2,-80.6],[-54.0,-80.2],[-51.9,-79.9],[-51.0,-79.6],[-50.4,-79.2],[-49.9,-78.8],[-49.3,-78.5],[-48.7,-78.0],[-48.2,-78.0],[-46.7,-77.8],[-45.2,-78.0]],[[-121.2,-73.5],[-119.9,-73.7],[-118.7,-73.5],[-119.3,-73.8],[-120.2,-74.1],[-121.6,-74.0],[-122.6,-73.7],[-122.4,-73.3],[-121.2,-73.5]],[[-99.0,-71.9],[-97.9,-72.1],[-96.8,-72.0],[-96.2,-72.5],[-97.0,-72.4],[-98.2,-72.5],[-99.4,-72.4],[-100.8,-72.5],[-101.8,-72.3],[-102.3,-71.9],[-101.7,-71.7],[-100.4,-71.9],[-99.0,-71.9]],[[-68.5,-71.0],[-68.3,-71.4],[-68.5,-71.8],[-68.8,-72.2],[-70.0,-72.3],[-71.1,-72.5],[-72.4,-72.5],[-71.9,-72.1],[-73.1,-72.2],[-74.2,-72.4],[-75.0,-72.1],[-75.0,-71.7],[-73.9,-71.3],[-73.2,-71.2],[-72.1,-71.2],[-71.8,-70.7],[-71.7,-70.3],[-71.7,-69.5],[-71.2,-69.0],[-70.3,-68.9],[-69.7,-69.3],[-69.5,-69.6],[-69.1,-70.1],[-68.7,-70.5],[-68.5,-71.0]],[[-180.0,-84.7],[-179.9,-84.7],[-179.1,-84.1],[-177.3,-84.5],[-177.1,-84.4],[-176.9,-84.3],[-176.5,-84.2],[-176.2,-84.1],[-176.1,-84.1],[-175.9,-84.1],[-175.8,-84.1],[-174.4,-84.5],[-173.1,-84.1],[-172.9,-84.1],[-170.0,-83.9],[-169.0,-84.1],[-168.5,-84.2],[-167.0,-84.6],[-164.2,-84.8],[-161.9,-85.1],[-158.1,-85.4],[-155.2,-85.1],[-150.9,-85.3],[-148.5,-85.6],[-145.9,-85.3],[-143.1,-85.0],[-142.9,-84.6],[-146.8,-84.5],[-150.1,-84.3],[-150.9,-83.9],[-153.6,-83.7],[-153.4,-83.2],[-153.0,-82.8],[-152.7,-82.5],[-152.9,-82.0],[-154.5,-81.8],[-155.3,-81.4],[-156.8,-81.1],[-154.4,-81.2],[-152.1,-81.0],[-150.6,-81.3],[-148.9,-81.0],[-147.2,-80.7],[-146.4,-80.3],[-146.8,-79.9],[-148.1,-79.7],[-149.5,-79.4],[-151.6,-79.3],[-153.4,-79.2],[-155.3,-79.1],[-156.0,-78.7],[-157.3,-78.4],[-158.1,-78.0],[-158.4,-76.9],[-157.9,-77.0],[-157.0,-77.3],[-155.3,-77.2],[-153.7,-77.1],[-152.9,-77.5],[-151.3,-77.4],[-150.0,-77.2],[-148.7,-76.9],[-147.6,-76.6],[-146.1,-76.5],[-146.1,-76.1],[-146.5,-75.7],[-146.2,-75.4],[-144.9,-75.2],[-144.3,-75.5],[-142.8,-75.3],[-141.6,-75.1],[-140.2,-75.1],[-138.9,-75.0],[-137.5,-74.7],[-136.4,-74.5],[-135.2,-74.3],[-134.4,-74.4],[-133.7,-74.4],[-132.3,-74.3],[-130.9,-74.5],[-129.6,-74.5],[-128.2,-74.3],[-126.9,-74.4],[-125.4,-74.5],[-124.0,-74.5],[-122.6,-74.5],[-121.1,-74.5],[-119.7,-74.5],[-118.7,-74.2],[-117.5,-74.0],[-116.2,-74.2],[-115.0,-74.1],[-113.9,-73.7],[-113.3,-74.0],[-112.9,-74.4],[-112.3,-74.7],[-111.3,-74.4],[-110.1,-74.8],[-108.7,-74.9],[-107.6,-75.2],[-106.1,-75.1],[-104.9,-74.9],[-103.4,-75.0],[-102.0,-75.1],[-100.6,-75.3],[-100.1,-74.9],[-100.8,-74.5],[-101.3,-74.2],[-102.5,-74.1],[-103.1,-73.7],[-103.3,-73.4],[-103.7,-72.6],[-102.9,-72.8],[-101.6,-72.8],[-100.3,-72.8],[-99.1,-72.9],[-98.1,-73.2],[-97.7,-73.6],[-96.3,-73.6],[-95.0,-73.5],[-93.7,-73.3],[-92.4,-73.2],[-91.4,-73.4],[-90.1,-73.3],[-89.2,-72.6],[-88.4,-73.0],[-87.3,-73.2],[-86.0,-73.1],[-85.2,-73.5],[-83.9,-73.5],[-82.7,-73.6],[-81.5,-73.9],[-80.7,-73.5],[-80.3,-73.1],[-79.3,-73.5],[-77.9,-73.4],[-76.9,-73.6],[-76.2,-74.0],[-74.9,-73.9],[-73.9,-73.7],[-72.8,-73.4],[-71.6,-73.3],[-70.2,-73.1],[-68.9,-73.0],[-68.0,-72.8],[-67.4,-72.5],[-67.1,-72.0],[-67.3,-71.6],[-67.6,-71.2],[-67.9,-70.9],[-68.2,-70.5],[-68.5,-70.1],[-68.5,-69.7],[-68.4,-69.3],[-68.0,-69.0],[-67.6,-68.5],[-67.4,-68.2],[-67.6,-67.7],[-67.7,-67.3],[-67.3,-66.9],[-66.7,-66.6],[-66.1,-66.2],[-65.4,-65.9],[-64.6,-65.6],[-64.2,-65.2],[-63.6,-64.9],[-63.0,-64.6],[-62.0,-64.6],[-61.4,-64.3],[-60.7,-64.1],[-59.9,-64.0],[-59.2,-63.7],[-58.6,-63.4],[-57.8,-63.3],[-57.2,-63.5],[-57.6,-63.9],[-58.6,-64.2],[-59.0,-64.4],[-59.8,-64.2],[-60.6,-64.3],[-61.3,-64.5],[-62.0,-64.8],[-62.5,-65.1],[-62.6,-65.5],[-62.6,-65.9],[-62.1,-66.2],[-62.8,-66.4],[-63.7,-66.5],[-64.3,-66.8],[-64.9,-67.1],[-65.5,-67.6],[-65.7,-68.0],[-65.3,-68.4],[-64.8,-68.7],[-64.0,-68.9],[-63.2,-69.2],[-62.8,-69.6],[-62.6,-70.0],[-62.3,-70.4],[-61.8,-70.7],[-61.5,-71.1],[-61.4,-72.0],[-61.1,-72.4],[-61.0,-72.8],[-60.7,-73.2],[-60.8,-73.7],[-61.4,-74.1],[-62.0,-74.4],[-63.3,-74.6],[-63.7,-74.9],[-64.4,-75.3],[-65.9,-75.6],[-67.2,-75.8],[-68.4,-76.0],[-69.8,-76.2],[-70.6,-76.6],[-72.2,-76.7],[-74.0,-76.6],[-75.6,-76.7],[-77.2,-76.7],[-76.9,-77.1],[-75.4,-77.3],[-74.3,-77.6],[-73.7,-77.9],[-74.8,-78.2],[-76.5,-78.1],[-77.9,-78.4],[-78.0,-78.8],[-78.0,-79.2],[-76.8,-79.5],[-76.6,-79.9],[-75.4,-80.3],[-73.2,-80.4],[-71.4,-80.7],[-70.0,-81.0],[-68.2,-81.3],[-65.7,-81.5],[-63.3,-81.7],[-61.6,-82.0],[-59.7,-82.4],[-58.7,-82.8],[-58.2,-83.2],[-57.0,-82.9],[-55.4,-82.6],[-53.6,-82.3],[-51.5,-82.0],[-49.8,-81.7],[-47.3,-81.7],[-44.8,-81.8],[-42.8,-82.1],[-42.2,-81.7],[-40.8,-81.4],[-38.2,-81.3],[-36.3,-81.1],[-34.4,-80.9],[-32.3,-80.8],[-30.1,-80.6],[-28.6,-80.3],[-29.3,-80.0],[-29.7,-79.6],[-29.7,-79.3],[-31.6,-79.3],[-33.7,-79.5],[-35.6,-79.5],[-35.9,-79.1],[-35.8,-78.3],[-35.3,-78.1],[-33.9,-77.9],[-32.2,-77.7],[-31.0,-77.4],[-29.8,-77.1],[-28.9,-76.7],[-27.5,-76.5],[-26.2,-76.4],[-25.5,-76.3],[-23.9,-76.2],[-22.5,-76.1],[-21.2,-75.9],[-20.0,-75.7],[-18.9,-75.4],[-17.5,-75.1],[-16.6,-74.8],[-15.7,-74.5],[-15.4,-74.1],[-16.5,-73.9],[-16.1,-73.5],[-15.4,-73.1],[-14.4,-73.0],[-13.3,-72.7],[-12.3,-72.4],[-11.5,-72.0],[-11.0,-71.5],[-10.3,-71.3],[-9.1,-71.3],[-8.6,-71.7],[-7.4,-71.7],[-7.4,-71.3],[-6.9,-70.9],[-5.8,-71.0],[-5.5,-71.4],[-4.3,-71.5],[-3.0,-71.3],[-1.8,-71.2],[-0.7,-71.2],[-0.2,-71.6],[0.9,-71.3],[1.9,-71.1],[3.0,-71.0],[4.1,-70.9],[5.2,-70.6],[6.3,-70.5],[7.1,-70.2],[7.7,-69.9],[8.5,-70.1],[9.5,-70.0],[10.3,-70.5],[10.8,-70.8],[12.0,-70.6],[12.4,-70.2],[13.4,-70.0],[14.7,-70.0],[15.1,-70.4],[15.9,-70.0],[17.0,-69.9],[18.2,-69.9],[19.3,-69.9],[20.4,-70.0],[21.5,-70.1],[21.9,-70.4],[22.6,-70.7],[23.7,-70.5],[24.8,-70.5],[26.0,-70.5],[27.1,-70.5],[28.1,-70.3],[29.2,-70.2],[30.0,-69.9],[31.0,-69.8],[32.0,-69.7],[32.8,-69.4],[33.3,-68.8],[33.9,-68.5],[34.9,-68.7],[35.3,-69.0],[36.2,-69.2],[37.2,-69.2],[37.9,-69.5],[38.6,-69.8],[39.7,-69.5],[40.0,-69.1],[40.9,-68.9],[42.0,-68.6],[42.9,-68.5],[44.1,-68.3],[44.9,-68.1],[45.7,-67.8],[46.5,-67.6],[47.4,-67.7],[48.3,-67.4],[49.0,-67.1],[49.9,-67.1],[50.8,-66.9],[50.9,-66.5],[51.8,-66.2],[52.6,-66.1],[53.6,-65.9],[54.5,-65.8],[55.4,-65.9],[56.4,-66.0],[57.2,-66.2],[57.3,-66.7],[58.1,-67.0],[58.7,-67.3],[59.9,-67.4],[60.6,-67.7],[61.4,-68.0],[62.4,-68.0],[63.2,-67.8],[64.1,-67.4],[65.0,-67.6],[66.0,-67.7],[66.9,-67.9],[67.9,-67.9],[68.9,-67.9],[69.7,-69.0],[69.7,-69.2],[69.6,-69.7],[68.6,-69.9],[67.8,-70.3],[67.9,-70.7],[69.1,-70.7],[68.9,-71.1],[68.4,-71.4],[67.9,-71.9],[68.7,-72.2],[69.9,-72.3],[71.0,-72.1],[71.6,-71.7],[71.9,-71.3],[72.5,-71.0],[73.1,-70.7],[73.3,-70.4],[73.9,-69.9],[74.5,-69.8],[75.6,-69.7],[76.6,-69.6],[77.6,-69.5],[78.1,-69.1],[78.4,-68.7],[79.1,-68.3],[80.1,-68.1],[80.9,-67.9],[81.5,-67.5],[82.1,-67.4],[82.8,-67.2],[83.8,-67.3],[84.7,-67.2],[85.7,-67.1],[86.8,-67.1],[87.5,-66.9],[88.0,-66.2],[88.4,-66.5],[88.8,-67.0],[89.7,-67.1],[90.6,-67.2],[91.6,-67.1],[92.6,-67.2],[93.5,-67.2],[94.2,-67.1],[95.0,-67.2],[95.8,-67.4],[96.7,-67.2],[97.8,-67.2],[98.7,-67.1],[99.7,-67.2],[100.4,-66.9],[100.9,-66.6],[101.6,-66.3],[102.8,-65.6],[103.5,-65.7],[104.2,-66.0],[104.9,-66.3],[106.2,-66.9],[107.2,-67.0],[108.1,-67.0],[109.2,-66.8],[110.2,-66.7],[111.1,-66.4],[111.7,-66.1],[112.9,-66.1],[113.6,-65.9],[114.4,-66.1],[114.9,-66.4],[115.6,-66.7],[116.7,-66.7],[117.4,-66.9],[118.6,-67.2],[119.8,-67.3],[120.9,-67.2],[121.7,-66.9],[122.3,-66.6],[123.2,-66.5],[124.1,-66.6],[125.2,-66.7],[126.1,-66.6],[127.0,-66.6],[127.9,-66.7],[128.8,-66.8],[129.7,-66.6],[130.8,-66.4],[131.8,-66.4],[132.9,-66.4],[133.9,-66.3],[134.8,-66.2],[135.0,-65.7],[135.1,-65.3],[135.7,-65.6],[135.9,-66.0],[136.2,-66.4],[136.6,-66.8],[137.5,-67.0],[138.6,-66.9],[139.9,-66.9],[140.8,-66.8],[142.1,-66.8],[143.1,-66.8],[144.4,-66.8],[145.5,-66.9],[146.2,-67.2],[146.0,-67.6],[146.6,-67.9],[147.7,-68.1],[148.8,-68.4],[150.1,-68.6],[151.5,-68.7],[152.5,-68.9],[153.6,-68.9],[154.3,-68.6],[155.2,-68.8],[155.9,-69.1],[156.8,-69.4],[158.0,-69.5],[159.2,-69.6],[159.7,-70.0],[160.8,-70.2],[161.6,-70.6],[162.7,-70.7],[163.8,-70.7],[164.9,-70.8],[166.1,-70.8],[167.3,-70.8],[168.4,-71.0],[169.5,-71.2],[170.5,-71.4],[171.2,-71.7],[171.1,-72.1],[170.6,-72.4],[170.1,-72.9],[169.8,-73.2],[169.3,-73.7],[168.0,-73.8],[167.4,-74.2],[166.1,-74.4],[165.6,-74.8],[165.0,-75.1],[164.2,-75.5],[163.8,-75.9],[163.6,-76.2],[163.5,-76.7],[163.5,-77.1],[164.1,-77.5],[164.3,-77.8],[164.7,-78.2],[166.6,-78.3],[167.0,-78.8],[165.2,-78.9],[163.7,-79.1],[161.8,-79.2],[160.9,-79.7],[160.7,-80.2],[160.3,-80.6],[159.8,-80.9],[161.1,-81.3],[161.6,-81.7],[162.5,-82.1],[163.7,-82.4],[165.1,-82.7],[166.6,-83.0],[168.9,-83.3],[169.4,-83.8],[172.3,-84.0],[172.5,-84.1],[173.2,-84.4],[176.0,-84.2],[178.3,-84.5],[-180.0,-84.7]],[[-67.8,-53.8],[-66.5,-54.5],[-65.1,-54.7],[-65.5,-55.2],[-66.5,-55.2],[-67.0,-54.9],[-67.3,-55.3],[-68.1,-55.6],[-69.2,-55.5],[-70.0,-55.2],[-71.0,-55.1],[-72.3,-54.5],[-73.3,-54.0],[-74.7,-52.8],[-73.8,-53.0],[-72.4,-53.7],[-71.1,-54.1],[-70.6,-53.6],[-70.3,-52.9],[-69.3,-52.5],[-68.6,-52.6],[-68.3,-53.1],[-67.8,-53.8]],[[-58.5,-51.1],[-57.7,-51.5],[-58.0,-51.9],[-59.4,-52.2],[-59.8,-51.8],[-60.7,-52.3],[-61.2,-51.8],[-60.0,-51.3],[-59.2,-51.5],[-58.5,-51.1]],[[145.4,-40.8],[146.4,-41.1],[146.9,-41.0],[147.7,-40.8],[148.3,-40.9],[148.4,-42.1],[148.0,-42.4],[147.9,-43.2],[147.6,-42.9],[146.9,-43.6],[146.7,-43.6],[146.0,-43.5],[145.4,-42.7],[145.3,-42.0],[144.7,-41.2],[144.7,-40.7],[145.4,-40.8]],[[173.0,-40.9],[173.2,-41.3],[174.0,-40.9],[174.2,-41.3],[174.2,-41.8],[173.9,-42.2],[173.2,-43.0],[172.7,-43.4],[173.1,-43.9],[172.3,-43.9],[171.5,-44.2],[171.2,-44.9],[170.6,-45.9],[169.8,-46.4],[169.3,-46.6],[168.4,-46.6],[167.8,-46.3],[166.7,-46.2],[166.5,-45.9],[167.0,-45.1],[168.3,-44.1],[168.9,-43.9],[169.7,-43.6],[170.5,-43.0],[171.1,-42.5],[171.6,-41.8],[172.0,-41.5],[172.1,-41.0],[172.8,-40.5],[173.0,-40.9]],[[174.6,-36.2],[175.3,-37.2],[175.4,-36.5],[175.8,-36.8],[176.0,-37.6],[176.8,-37.9],[177.4,-38.0],[178.0,-37.6],[178.5,-37.7],[178.3,-38.6],[178.0,-39.2],[177.2,-39.1],[176.9,-39.4],[177.0,-39.9],[176.9,-40.1],[176.5,-40.6],[176.0,-41.3],[175.2,-41.7],[175.1,-41.4],[174.7,-41.3],[175.2,-40.5],[174.9,-39.9],[173.8,-39.5],[173.9,-39.1],[174.6,-38.8],[174.7,-38.0],[174.7,-37.4],[174.3,-36.7],[174.3,-36.5],[173.8,-36.1],[173.1,-35.2],[172.6,-34.5],[173.0,-34.5],[173.6,-35.0],[174.3,-35.3],[174.6,-36.2]],[[167.1,-22.2],[166.7,-22.4],[166.2,-22.1],[165.5,-21.7],[164.8,-21.1],[164.2,-20.4],[164.0,-20.1],[164.5,-20.1],[165.0,-20.5],[165.5,-20.8],[165.8,-21.1],[166.6,-21.7],[167.1,-22.2]],[[-180.0,-16.6],[179.4,-16.8],[178.7,-17.0],[178.6,-16.6],[179.1,-16.4],[179.4,-16.4],[-180.0,-16.1],[-179.8,-16.0],[-179.9,-16.5],[-180.0,-16.6]],[[50.1,-13.6],[50.2,-14.8],[50.5,-15.2],[50.4,-15.7],[50.2,-16.0],[49.9,-15.4],[49.7,-15.7],[49.9,-16.5],[49.8,-16.9],[49.5,-17.1],[49.4,-18.0],[49.0,-19.1],[48.5,-20.5],[47.9,-22.4],[47.5,-23.8],[47.1,-24.9],[46.3,-25.2],[45.4,-25.6],[44.8,-25.3],[44.0,-25.0],[43.8,-24.5],[43.7,-23.6],[43.3,-22.8],[43.3,-22.1],[43.4,-21.3],[43.9,-21.2],[43.9,-20.8],[44.4,-20.1],[44.5,-19.4],[44.2,-19.0],[44.0,-18.3],[44.0,-17.4],[44.3,-16.9],[44.4,-16.2],[44.9,-16.2],[45.5,-16.0],[45.9,-15.8],[46.3,-15.8],[46.9,-15.2],[47.7,-14.6],[48.0,-14.1],[47.9,-13.7],[48.3,-13.8],[48.8,-13.1],[48.9,-12.5],[49.2,-12.0],[49.5,-12.5],[49.8,-12.9],[50.1,-13.6]],[[143.6,-13.8],[143.9,-14.5],[144.6,-14.2],[144.9,-14.6],[145.4,-15.0],[145.3,-15.4],[145.5,-16.3],[145.6,-16.8],[145.9,-16.9],[146.2,-17.8],[146.1,-18.3],[146.4,-19.0],[147.5,-19.5],[148.2,-20.0],[148.8,-20.4],[148.7,-20.6],[149.3,-21.3],[149.7,-22.3],[150.1,-22.1],[150.5,-22.6],[150.7,-22.4],[150.9,-23.5],[151.6,-24.1],[152.1,-24.5],[152.9,-25.3],[153.1,-26.1],[153.2,-26.6],[153.1,-27.3],[153.6,-28.1],[153.5,-29.0],[153.3,-29.5],[153.1,-30.4],[153.1,-30.9],[152.9,-31.6],[152.4,-32.6],[151.7,-33.0],[151.3,-33.8],[151.0,-34.3],[150.7,-35.2],[150.3,-35.7],[150.1,-36.4],[149.9,-37.1],[150.0,-37.4],[149.4,-37.8],[148.3,-37.8],[147.4,-38.2],[146.9,-38.6],[146.3,-39.0],[145.5,-38.6],[144.9,-38.4],[145.0,-37.9],[144.5,-38.1],[143.6,-38.8],[142.7,-38.5],[142.2,-38.4],[141.6,-38.3],[140.6,-38.0],[140.0,-37.4],[139.8,-36.6],[139.6,-36.1],[139.1,-35.7],[138.1,-35.6],[138.4,-35.1],[138.2,-34.4],[137.7,-35.1],[136.8,-35.3],[137.4,-34.7],[137.5,-34.1],[137.9,-33.6],[137.8,-32.9],[137.0,-33.8],[136.4,-34.1],[136.0,-34.9],[135.2,-34.5],[135.2,-33.9],[134.6,-33.2],[134.1,-32.8],[134.3,-32.6],[133.0,-32.0],[132.3,-32.0],[131.3,-31.5],[129.5,-31.6],[128.2,-31.9],[127.1,-32.3],[126.1,-32.2],[125.1,-32.7],[124.2,-33.0],[124.0,-33.5],[123.7,-33.9],[122.8,-33.9],[122.2,-34.0],[121.3,-33.8],[120.6,-33.9],[119.9,-34.0],[119.3,-34.5],[119.0,-34.5],[118.5,-34.7],[118.0,-35.1],[117.3,-35.0],[116.6,-35.0],[115.6,-34.4],[115.0,-34.2],[115.0,-33.6],[115.5,-33.5],[115.7,-33.3],[115.7,-32.9],[115.8,-32.2],[115.7,-31.6],[115.2,-30.6],[115.0,-30.0],[115.0,-29.5],[114.6,-28.8],[114.6,-28.5],[114.2,-28.1],[114.0,-27.3],[113.5,-26.5],[113.3,-26.1],[113.8,-26.5],[113.4,-25.6],[113.9,-25.9],[114.2,-26.3],[114.2,-25.8],[113.7,-25.0],[113.6,-24.7],[113.4,-24.4],[113.5,-23.8],[113.7,-23.6],[113.8,-23.1],[113.7,-22.5],[114.1,-21.8],[114.2,-22.5],[114.6,-21.8],[115.5,-21.5],[115.9,-21.1],[116.7,-20.7],[117.2,-20.6],[117.4,-20.7],[118.2,-20.4],[118.8,-20.3],[119.0,-20.0],[119.3,-20.0],[119.8,-20.0],[120.9,-19.7],[121.4,-19.2],[121.7,-18.7],[122.2,-18.2],[122.3,-17.8],[122.3,-17.3],[123.0,-16.4],[123.4,-17.3],[123.9,-17.1],[123.5,-16.6],[123.8,-16.1],[124.3,-16.3],[124.4,-15.6],[124.9,-15.1],[125.2,-14.7],[125.7,-14.5],[125.7,-14.2],[126.1,-14.3],[126.1,-14.1],[126.6,-14.0],[127.1,-13.8],[127.8,-14.3],[128.4,-14.9],[129.0,-14.9],[129.6,-15.0],[129.4,-14.4],[129.9,-13.6],[130.3,-13.4],[130.2,-13.1],[130.6,-12.5],[131.2,-12.2],[131.7,-12.3],[132.6,-12.1],[132.6,-11.6],[131.8,-11.3],[132.4,-11.1],[133.0,-11.4],[133.6,-11.8],[134.4,-12.0],[134.7,-11.9],[135.3,-12.2],[135.9,-12.0],[136.3,-12.0],[136.5,-11.9],[137.0,-12.4],[136.7,-12.9],[136.3,-13.3],[136.0,-13.3],[136.1,-13.7],[135.8,-14.2],[135.4,-14.7],[135.5,-15.0],[136.3,-15.6],[137.1,-15.9],[137.6,-16.2],[138.3,-16.8],[138.6,-16.8],[139.1,-17.1],[139.3,-17.4],[140.2,-17.7],[140.9,-17.4],[141.1,-16.8],[141.3,-16.4],[141.4,-15.8],[141.7,-15.0],[141.6,-14.6],[141.6,-14.3],[141.5,-13.7],[141.7,-12.9],[141.8,-12.7],[141.7,-12.4],[141.9,-11.9],[142.1,-11.3],[142.1,-11.0],[142.5,-10.7],[142.8,-11.2],[142.9,-11.8],[143.1,-11.9],[143.2,-12.3],[143.5,-12.8],[143.6,-13.4],[143.6,-13.8]],[[124.4,-10.1],[123.6,-10.4],[123.5,-10.2],[123.6,-9.9],[124.0,-9.3],[125.0,-8.9],[125.1,-8.7],[125.9,-8.4],[126.6,-8.4],[127.0,-8.3],[127.3,-8.4],[127.0,-8.7],[125.9,-9.1],[125.1,-9.4],[124.4,-10.1]],[[108.6,-6.8],[110.5,-6.9],[110.8,-6.5],[112.6,-6.9],[113.0,-7.6],[114.5,-7.8],[115.7,-8.4],[114.6,-8.8],[113.5,-8.3],[112.6,-8.4],[111.5,-8.3],[110.6,-8.1],[109.4,-7.7],[108.7,-7.6],[108.3,-7.8],[106.5,-7.4],[106.3,-6.9],[105.4,-6.9],[106.1,-5.9],[107.3,-6.0],[108.1,-6.3],[108.5,-6.4],[108.6,-6.8]],[[152.0,-5.5],[151.5,-5.6],[151.3,-5.8],[150.8,-6.1],[150.2,-6.3],[149.7,-6.3],[148.9,-6.0],[148.3,-5.7],[148.4,-5.4],[149.3,-5.6],[149.8,-5.5],[150.0,-5.0],[150.1,-5.0],[150.2,-5.5],[150.8,-5.5],[151.1,-5.1],[151.6,-4.8],[151.5,-4.2],[152.1,-4.1],[152.3,-4.3],[152.3,-4.9],[152.0,-5.5]],[[134.1,-1.2],[134.4,-2.8],[135.5,-3.4],[136.3,-2.3],[137.4,-1.7],[138.3,-1.7],[139.2,-2.1],[139.9,-2.4],[141.0,-2.6],[142.7,-3.3],[144.6,-3.9],[145.3,-4.4],[145.8,-4.9],[146.0,-5.5],[147.6,-6.1],[147.9,-6.6],[147.0,-6.7],[147.2,-7.4],[148.1,-8.0],[148.7,-9.1],[149.3,-9.1],[149.3,-9.5],[150.0,-9.7],[149.7,-9.9],[150.8,-10.3],[150.7,-10.6],[150.0,-10.7],[149.8,-10.4],[148.9,-10.3],[147.9,-10.1],[147.1,-9.5],[146.6,-8.9],[146.0,-8.1],[144.7,-7.6],[143.9,-7.9],[143.3,-8.2],[143.4,-9.0],[142.6,-9.3],[142.1,-9.2],[141.0,-9.1],[140.1,-8.3],[139.1,-8.1],[138.9,-8.4],[137.6,-8.4],[138.0,-7.6],[138.7,-7.3],[138.4,-6.2],[137.9,-5.4],[136.0,-4.5],[135.2,-4.5],[133.7,-3.5],[133.4,-4.0],[133.0,-4.1],[132.8,-3.7],[132.8,-3.3],[132.0,-2.8],[133.1,-2.5],[133.8,-2.5],[133.7,-2.2],[132.2,-2.2],[131.8,-1.6],[130.9,-1.4],[130.5,-0.9],[131.9,-0.7],[132.4,-0.4],[134.0,-0.8],[134.1,-1.2]],[[125.2,1.4],[124.4,0.4],[123.7,0.2],[122.7,0.4],[121.1,0.4],[120.2,0.2],[120.0,-0.5],[120.9,-1.4],[121.5,-1.0],[123.3,-0.6],[123.3,-1.1],[122.8,-0.9],[122.4,-1.5],[121.5,-1.9],[122.5,-3.2],[122.3,-3.5],[123.2,-4.7],[123.2,-5.3],[122.6,-5.6],[122.2,-5.3],[122.7,-4.5],[121.7,-4.9],[121.5,-4.6],[121.6,-4.2],[120.9,-3.6],[121.0,-2.6],[120.3,-2.9],[120.4,-4.1],[120.4,-5.5],[119.8,-5.7],[119.4,-5.4],[119.7,-4.5],[119.5,-3.5],[119.1,-3.5],[118.8,-2.8],[119.2,-2.1],[119.3,-1.4],[119.8,0.2],[120.0,0.6],[120.9,1.3],[121.7,1.0],[122.9,0.9],[124.1,0.9],[125.1,1.6],[125.2,1.4]],[[128.7,1.1],[128.6,0.3],[128.1,0.4],[128.0,-0.3],[128.4,-0.8],[128.1,-0.9],[127.7,-0.3],[127.4,1.0],[127.6,1.8],[127.9,2.2],[128.0,1.6],[128.6,1.5],[128.7,1.1]],[[105.8,-5.9],[104.7,-5.9],[103.9,-5.0],[102.6,-4.2],[102.2,-3.6],[101.4,-2.8],[100.9,-2.1],[100.1,-0.7],[99.3,0.2],[99.0,1.0],[98.6,1.8],[97.7,2.5],[97.2,3.3],[96.4,3.9],[95.4,5.0],[95.3,5.5],[95.9,5.4],[97.5,5.2],[98.4,4.3],[99.1,3.6],[99.7,3.2],[100.6,2.1],[101.7,2.1],[102.5,1.4],[103.1,0.6],[103.8,0.1],[103.4,-0.7],[104.0,-1.1],[104.4,-1.1],[104.5,-1.8],[104.9,-2.3],[105.6,-2.4],[106.1,-3.1],[105.9,-4.3],[105.8,-5.9]],[[117.9,1.8],[119.0,0.9],[117.8,0.8],[117.5,0.1],[117.5,-0.8],[116.6,-1.5],[116.5,-2.5],[116.1,-4.0],[116.0,-3.7],[114.9,-4.1],[114.5,-3.5],[113.8,-3.4],[113.3,-3.1],[112.1,-3.5],[111.7,-3.0],[111.0,-3.0],[110.2,-2.9],[110.1,-1.6],[109.6,-1.3],[109.1,-0.5],[109.0,0.4],[109.1,1.3],[109.7,2.0],[110.4,1.7],[111.2,1.9],[111.4,2.7],[111.8,2.9],[113.0,3.1],[113.7,3.9],[114.2,4.5],[114.6,4.9],[115.5,5.4],[116.2,6.1],[116.7,6.9],[117.1,6.9],[117.6,6.4],[117.7,6.0],[118.3,5.7],[119.2,5.4],[119.1,5.0],[118.4,5.0],[118.6,4.5],[117.9,4.1],[117.3,3.2],[118.0,2.3],[117.9,1.8]],[[126.4,8.4],[126.5,7.8],[126.5,7.2],[126.2,6.3],[125.8,7.3],[125.4,6.8],[125.7,6.0],[125.4,5.6],[124.2,6.2],[123.9,6.9],[124.2,7.4],[123.6,7.8],[123.3,7.4],[122.8,7.5],[122.1,6.9],[121.9,7.2],[122.3,8.0],[122.9,8.3],[123.5,8.7],[123.8,8.2],[124.6,8.5],[124.8,9.0],[125.5,9.0],[125.4,9.8],[126.2,9.3],[126.3,8.8],[126.4,8.4]],[[81.2,6.2],[80.3,6.0],[79.9,6.8],[79.7,8.2],[80.1,9.8],[80.8,9.3],[81.3,8.6],[81.8,7.5],[81.6,6.5],[81.2,6.2]],[[124.0,10.3],[123.6,9.9],[123.3,9.3],[123.0,9.0],[122.4,9.7],[122.6,10.0],[122.8,10.3],[122.9,10.9],[123.5,10.9],[123.3,10.3],[124.1,11.2],[124.0,10.3]],[[125.5,12.2],[125.8,11.0],[125.0,11.3],[125.0,11.0],[125.3,10.4],[124.8,10.1],[124.8,10.8],[124.5,10.9],[124.3,11.5],[124.9,11.4],[124.9,11.8],[124.3,12.6],[125.2,12.5],[125.5,12.2]],[[121.3,18.5],[121.9,18.2],[122.2,18.5],[122.3,18.2],[122.2,17.8],[122.5,17.1],[122.3,16.3],[121.7,15.9],[121.5,15.1],[121.7,14.3],[122.3,14.2],[122.7,14.3],[124.0,13.8],[123.9,13.2],[124.2,13.0],[124.1,12.5],[123.3,13.0],[122.9,13.6],[122.7,13.2],[122.0,13.8],[121.1,13.6],[120.6,13.9],[120.7,14.3],[121.0,14.5],[120.7,14.8],[120.6,14.4],[120.1,15.0],[119.9,15.4],[119.9,16.4],[120.3,16.0],[120.4,17.6],[120.7,18.5],[121.3,18.5]],[[-72.6,19.9],[-71.7,19.7],[-71.6,19.9],[-70.8,19.9],[-70.2,19.6],[-70.0,19.6],[-69.8,19.3],[-69.2,19.3],[-69.3,19.0],[-68.8,19.0],[-68.3,18.6],[-68.7,18.2],[-69.2,18.4],[-69.6,18.4],[-70.0,18.4],[-70.1,18.2],[-70.5,18.2],[-70.7,18.4],[-71.0,18.3],[-71.4,17.6],[-71.7,17.8],[-71.7,18.0],[-72.4,18.2],[-72.8,18.1],[-73.5,18.2],[-73.9,18.0],[-74.5,18.3],[-74.4,18.7],[-73.4,18.5],[-72.7,18.4],[-72.3,18.7],[-72.8,19.1],[-72.8,19.5],[-73.4,19.6],[-73.2,19.9],[-72.6,19.9]],[[110.3,18.7],[109.5,18.2],[108.7,18.5],[108.6,19.4],[109.1,19.8],[110.2,20.1],[110.8,20.1],[111.0,19.7],[110.6,19.3],[110.3,18.7]],[[-79.7,22.8],[-79.3,22.4],[-78.3,22.5],[-78.0,22.3],[-77.1,21.7],[-76.5,21.2],[-76.2,21.2],[-75.6,21.0],[-75.7,20.7],[-74.9,20.7],[-74.2,20.3],[-74.3,20.1],[-75.0,19.9],[-75.6,19.9],[-76.3,20.0],[-77.8,19.9],[-77.1,20.4],[-77.5,20.7],[-78.1,20.7],[-78.5,21.0],[-78.7,21.6],[-79.3,21.6],[-80.2,21.8],[-80.5,22.0],[-81.8,22.2],[-82.2,22.4],[-81.8,22.6],[-82.8,22.7],[-83.5,22.2],[-83.9,22.2],[-84.1,21.9],[-84.5,21.8],[-85.0,21.9],[-84.4,22.2],[-84.2,22.6],[-83.8,22.8],[-83.3,23.0],[-82.5,23.1],[-82.3,23.2],[-81.4,23.1],[-80.6,23.1],[-79.7,22.8]],[[121.2,22.8],[120.7,22.0],[120.2,22.8],[120.1,23.6],[120.7,24.5],[121.5,25.3],[122.0,25.0],[121.8,24.4],[121.2,22.8]],[[134.6,34.1],[134.8,33.8],[134.2,33.2],[133.8,33.5],[133.3,33.3],[133.0,32.7],[132.4,33.0],[132.4,33.5],[132.9,34.1],[133.5,33.9],[133.9,34.4],[134.6,34.1]],[[15.5,38.2],[15.2,37.4],[15.3,37.1],[15.1,36.6],[14.3,37.0],[13.8,37.1],[12.4,37.6],[12.6,38.1],[13.7,38.0],[14.8,38.1],[15.5,38.2]],[[9.2,41.2],[9.8,40.5],[9.7,39.2],[9.2,39.2],[8.8,38.9],[8.4,39.2],[8.4,40.4],[8.2,41.0],[8.7,40.9],[9.2,41.2]],[[141.0,37.1],[140.6,36.3],[140.8,35.8],[140.3,35.1],[139.0,34.7],[137.2,34.6],[135.8,33.5],[135.1,33.8],[135.1,34.6],[133.3,34.4],[132.2,33.9],[131.0,33.9],[132.0,33.1],[131.3,31.5],[130.7,31.0],[130.2,31.4],[130.4,32.3],[129.8,32.6],[129.4,33.3],[130.4,33.6],[130.9,34.2],[131.9,34.8],[132.6,35.4],[134.6,35.7],[135.7,35.5],[136.7,37.3],[137.4,36.8],[138.9,37.8],[139.4,38.2],[140.1,39.4],[139.9,40.6],[140.3,41.2],[141.4,41.4],[141.9,40.0],[141.9,39.2],[141.0,38.2],[141.0,37.1]],[[143.9,44.2],[144.6,44.0],[145.3,44.4],[145.5,43.3],[144.1,43.0],[143.2,42.0],[141.6,42.7],[141.1,41.6],[140.0,41.6],[139.8,42.6],[140.3,43.3],[141.4,43.4],[141.7,44.8],[142.0,45.6],[143.1,44.5],[143.9,44.2]],[[-123.5,48.5],[-124.0,48.4],[-125.7,48.8],[-126.0,49.2],[-126.8,49.5],[-127.0,49.8],[-128.1,50.0],[-128.4,50.5],[-128.4,50.8],[-127.3,50.6],[-126.7,50.4],[-125.8,50.3],[-125.4,49.9],[-124.9,49.5],[-123.9,49.1],[-123.5,48.5]],[[-56.1,50.7],[-56.8,49.8],[-56.1,50.1],[-55.5,49.9],[-55.8,49.6],[-54.9,49.3],[-54.5,49.6],[-53.5,49.2],[-53.8,48.5],[-53.1,48.7],[-53.0,48.2],[-52.6,47.5],[-53.1,46.7],[-53.5,46.6],[-54.2,46.8],[-54.0,47.6],[-54.2,47.8],[-55.4,46.9],[-56.0,46.9],[-55.3,47.4],[-56.3,47.6],[-57.3,47.6],[-59.3,47.6],[-59.4,47.9],[-58.8,48.3],[-59.2,48.5],[-58.4,49.1],[-57.4,50.7],[-56.7,51.3],[-55.9,51.6],[-55.4,51.6],[-55.6,51.3],[-56.1,50.7]],[[-132.7,54.0],[-131.7,54.1],[-132.1,53.0],[-131.2,52.2],[-131.6,52.2],[-132.2,52.6],[-132.6,53.1],[-133.1,53.4],[-133.2,53.9],[-133.2,54.2],[-132.7,54.0]],[[143.6,50.7],[144.7,49.0],[143.2,49.3],[142.6,47.9],[143.5,46.8],[143.5,46.1],[142.7,46.7],[142.1,46.0],[141.9,46.8],[142.0,47.8],[141.9,48.9],[142.1,49.6],[142.2,51.0],[141.6,51.9],[141.7,53.3],[142.6,53.8],[142.2,54.2],[142.7,54.4],[142.9,53.7],[143.3,52.7],[143.2,51.8],[143.6,50.7]],[[-6.8,52.3],[-8.6,51.7],[-10.0,51.8],[-9.2,52.9],[-9.7,53.9],[-8.3,54.7],[-7.6,55.1],[-6.7,55.2],[-5.7,54.6],[-6.2,53.9],[-6.0,53.2],[-6.8,52.3]],[[-153.0,57.1],[-154.0,56.7],[-154.5,57.0],[-154.7,57.5],[-153.8,57.8],[-153.2,58.0],[-152.6,57.9],[-152.1,57.6],[-153.0,57.1]],[[-3.0,58.6],[-4.1,57.6],[-3.1,57.7],[-2.0,57.7],[-2.2,56.9],[-3.1,56.0],[-2.1,55.9],[-1.1,54.6],[-0.4,54.5],[0.2,53.3],[0.5,52.9],[1.7,52.7],[1.6,52.1],[1.0,51.8],[1.4,51.3],[0.5,50.8],[-0.8,50.8],[-2.5,50.5],[-3.0,50.7],[-3.6,50.2],[-4.5,50.3],[-5.2,50.0],[-5.8,50.2],[-4.3,51.2],[-3.4,51.4],[-5.0,51.6],[-5.3,52.0],[-4.2,52.3],[-4.8,52.8],[-4.6,53.5],[-3.1,53.4],[-2.9,54.0],[-3.6,54.6],[-4.8,54.8],[-5.1,55.1],[-4.7,55.5],[-5.0,55.8],[-5.6,55.3],[-5.6,56.3],[-6.2,56.8],[-5.8,57.8],[-5.0,58.6],[-4.2,58.6],[-3.0,58.6]],[[-85.2,65.7],[-85.0,65.2],[-84.5,65.4],[-83.9,65.1],[-82.8,64.8],[-81.6,64.5],[-81.6,64.0],[-80.8,64.1],[-80.1,63.7],[-81.0,63.4],[-82.5,63.7],[-83.1,64.1],[-84.1,63.6],[-85.5,63.1],[-85.9,63.6],[-87.2,63.5],[-86.4,64.0],[-86.2,64.8],[-85.9,65.7],[-85.2,65.7]],[[-14.5,66.5],[-14.7,65.8],[-13.6,65.1],[-14.9,64.4],[-17.8,63.7],[-18.7,63.5],[-20.0,63.6],[-22.8,64.0],[-21.8,64.4],[-24.0,64.9],[-22.2,65.1],[-22.2,65.4],[-24.3,65.6],[-23.7,66.3],[-22.1,66.4],[-20.6,65.7],[-19.1,66.3],[-17.8,66.0],[-16.2,66.5],[-14.5,66.5]],[[-75.9,67.1],[-77.0,67.1],[-77.2,67.6],[-76.8,68.1],[-75.9,68.3],[-75.1,68.0],[-75.1,67.6],[-75.2,67.4],[-75.9,67.1]],[[-180.0,69.0],[-177.5,68.2],[-174.9,67.2],[-175.0,66.6],[-174.3,66.3],[-174.6,67.1],[-171.9,66.9],[-169.9,66.0],[-170.9,65.5],[-172.5,65.4],[-172.6,64.5],[-173.0,64.3],[-173.9,64.3],[-174.7,64.6],[-176.0,64.9],[-176.2,65.4],[-177.2,65.5],[-178.4,65.4],[-178.9,65.7],[-178.7,66.1],[-179.9,65.9],[-179.4,65.4],[-180.0,65.0],[180.0,65.0],[178.7,64.5],[177.4,64.6],[178.3,64.1],[178.9,63.3],[179.4,63.0],[179.5,62.6],[179.2,62.3],[177.4,62.5],[174.6,61.8],[173.7,61.7],[172.1,60.9],[170.7,60.3],[170.3,59.9],[168.9,60.6],[166.3,59.8],[165.8,60.2],[164.9,59.7],[163.5,59.9],[163.2,59.2],[162.0,58.2],[162.1,57.8],[163.2,57.6],[163.1,56.2],[162.1,56.1],[161.7,55.3],[162.1,54.9],[160.4,54.3],[160.0,53.2],[158.5,53.0],[158.2,51.9],[156.8,51.0],[156.4,51.7],[156.0,53.2],[155.4,55.4],[155.9,56.8],[156.8,57.4],[156.8,57.8],[158.4,58.1],[160.1,59.3],[161.9,60.3],[163.7,61.1],[164.5,62.6],[163.3,62.5],[162.7,61.6],[160.1,60.5],[159.3,61.8],[156.7,61.4],[154.2,59.8],[155.0,59.1],[152.8,58.9],[151.3,58.8],[151.3,59.5],[149.8,59.7],[148.5,59.2],[145.5,59.3],[142.2,59.0],[139.0,57.1],[135.1,54.7],[136.7,54.6],[137.2,54.0],[138.2,53.8],[138.8,54.3],[139.9,54.2],[141.3,53.1],[141.4,52.2],[140.6,51.2],[140.5,50.0],[140.1,48.4],[138.6,47.0],[138.2,46.3],[136.9,45.1],[135.5,44.0],[134.9,43.4],[133.5,42.8],[132.9,42.8],[132.3,43.3],[130.9,42.6],[130.8,42.2],[130.4,42.3],[130.0,41.9],[129.7,41.6],[129.7,40.9],[129.2,40.7],[129.0,40.5],[128.6,40.2],[128.0,40.0],[127.5,39.8],[127.5,39.3],[127.4,39.2],[127.8,39.1],[128.4,38.6],[129.2,37.4],[129.5,36.8],[129.5,35.6],[129.1,35.1],[128.2,34.9],[127.4,34.5],[126.5,34.4],[126.4,34.9],[126.6,35.7],[126.1,36.7],[126.9,36.9],[126.2,37.7],[125.7,37.9],[125.6,37.8],[125.3,37.7],[125.2,37.9],[125.0,37.9],[124.7,38.1],[125.0,38.5],[125.2,38.7],[125.1,38.8],[125.4,39.4],[125.3,39.6],[124.7,39.7],[124.3,39.9],[122.9,39.6],[122.1,39.2],[121.1,38.9],[121.6,39.4],[121.4,39.8],[122.2,40.4],[121.6,40.9],[120.8,40.6],[119.6,39.9],[119.0,39.3],[118.0,39.2],[117.5,38.7],[118.1,38.1],[118.9,37.9],[118.9,37.4],[119.7,37.2],[120.8,37.9],[121.7,37.5],[122.4,37.5],[122.5,36.9],[121.1,36.7],[120.6,36.1],[119.7,35.6],[119.2,34.9],[120.2,34.4],[120.6,33.4],[121.2,32.5],[121.9,31.7],[121.9,30.9],[121.3,30.7],[121.5,30.1],[122.1,29.8],[121.9,29.0],[121.7,28.2],[121.1,28.1],[120.4,27.1],[119.6,25.7],[118.7,24.5],[117.3,23.6],[115.9,22.8],[114.8,22.7],[114.2,22.2],[113.8,22.5],[113.2,22.1],[111.8,21.6],[110.8,21.4],[110.4,20.3],[109.9,20.3],[109.6,21.0],[109.9,21.4],[108.5,21.7],[108.0,21.6],[106.7,20.7],[105.9,19.8],[105.7,19.1],[106.4,18.0],[107.4,16.7],[108.3,16.1],[108.9,15.3],[109.3,13.4],[109.2,11.7],[108.4,11.0],[107.2,10.4],[106.4,9.5],[105.2,8.6],[104.8,9.2],[105.1,9.9],[104.3,10.5],[103.5,10.6],[103.1,11.2],[102.6,12.2],[101.7,12.6],[100.8,12.6],[101.0,13.4],[100.1,13.4],[100.0,12.3],[99.5,10.8],[99.2,10.0],[99.2,9.2],[99.9,9.2],[100.3,8.3],[100.5,7.4],[101.0,6.9],[101.6,6.7],[102.1,6.2],[102.4,6.1],[103.0,5.5],[103.4,4.9],[103.4,4.2],[103.3,3.7],[103.4,3.4],[103.5,2.8],[103.9,2.5],[104.2,1.6],[104.2,1.3],[103.5,1.2],[102.6,2.0],[101.4,2.8],[101.3,3.3],[100.7,3.9],[100.6,4.8],[100.2,5.3],[100.3,6.0],[100.1,6.5],[99.7,6.8],[99.5,7.3],[99.0,7.9],[98.5,8.4],[98.3,7.8],[98.1,8.3],[98.3,9.0],[98.6,9.9],[98.5,10.7],[98.8,11.4],[98.4,12.0],[98.5,13.1],[98.1,13.6],[97.8,14.8],[97.6,16.1],[97.2,16.9],[96.5,16.4],[95.4,15.7],[94.8,15.8],[94.2,16.0],[94.5,17.3],[94.3,18.2],[93.5,19.4],[93.7,19.7],[93.1,19.9],[92.4,20.7],[92.1,21.2],[92.0,21.7],[91.8,22.2],[91.4,22.8],[90.5,22.8],[90.6,22.4],[90.3,21.8],[89.8,22.0],[89.7,21.9],[89.4,22.0],[89.0,22.1],[88.9,21.7],[88.2,21.7],[87.0,21.5],[87.0,20.7],[86.5,20.2],[85.1,19.5],[83.9,18.3],[83.2,17.7],[82.2,17.0],[82.2,16.6],[81.7,16.3],[80.8,16.0],[80.3,15.9],[80.0,15.1],[80.2,13.8],[80.3,13.0],[79.9,12.1],[79.9,10.4],[79.3,10.3],[78.9,9.5],[79.2,9.2],[78.3,8.9],[77.9,8.3],[77.5,8.0],[76.6,8.9],[76.1,10.3],[75.7,11.3],[75.4,11.8],[74.9,12.7],[74.6,14.0],[74.4,14.6],[73.5,16.0],[73.1,17.9],[72.8,19.2],[72.8,20.4],[72.6,21.4],[71.2,20.8],[70.5,20.9],[69.2,22.1],[69.6,22.5],[69.3,22.8],[68.2,23.7],[67.4,23.9],[67.1,24.7],[66.4,25.4],[64.5,25.2],[62.9,25.2],[61.5,25.1],[59.6,25.4],[58.5,25.6],[57.4,25.7],[57.0,27.0],[56.5,27.1],[55.7,27.0],[54.7,26.5],[53.5,26.8],[52.5,27.6],[51.5,27.9],[50.9,28.8],[50.1,30.1],[49.6,30.0],[48.9,30.3],[48.6,29.9],[48.0,30.0],[48.2,29.5],[48.1,29.3],[48.4,28.6],[48.8,27.7],[49.3,27.5],[49.5,27.1],[50.2,26.7],[50.2,26.3],[50.1,25.9],[50.2,25.6],[50.5,25.3],[50.7,25.0],[50.8,24.8],[50.7,25.5],[51.0,26.0],[51.3,26.1],[51.6,25.8],[51.6,25.2],[51.4,24.6],[51.6,24.2],[51.8,24.3],[51.8,24.0],[52.6,24.2],[53.4,24.2],[54.0,24.1],[54.7,24.8],[55.4,25.4],[56.1,26.1],[56.4,26.4],[56.5,26.3],[56.4,25.9],[56.3,25.7],[56.4,24.9],[56.8,24.2],[57.4,23.9],[58.1,23.7],[58.7,23.6],[59.2,23.0],[59.4,22.7],[59.8,22.5],[59.8,22.3],[59.4,21.7],[59.3,21.4],[58.9,21.1],[58.5,20.4],[58.0,20.5],[57.8,20.2],[57.7,19.7],[57.8,19.1],[57.7,18.9],[57.2,18.9],[56.6,18.6],[56.5,18.1],[56.3,17.9],[55.7,17.9],[55.3,17.6],[55.3,17.2],[54.8,16.9],[54.2,17.0],[53.6,16.7],[53.1,16.7],[52.4,16.4],[52.2,15.9],[52.2,15.6],[51.2,15.2],[49.6,14.7],[48.7,14.0],[48.2,13.9],[47.9,14.0],[47.4,13.6],[46.7,13.4],[45.9,13.3],[45.6,13.3],[45.4,13.0],[45.1,13.0],[45.0,12.7],[44.5,12.7],[44.2,12.6],[43.5,12.6],[43.2,13.2],[43.3,13.8],[43.1,14.1],[42.9,14.8],[42.6,15.2],[42.8,15.3],[42.7,15.7],[42.8,15.9],[42.8,16.3],[42.7,16.8],[42.3,17.1],[42.3,17.5],[41.8,17.8],[41.2,18.7],[40.9,19.5],[40.2,20.2],[39.8,20.3],[39.1,21.3],[39.0,22.0],[39.1,22.6],[38.5,23.7],[38.0,24.1],[37.5,24.3],[37.2,24.9],[37.2,25.1],[36.9,25.6],[36.6,25.8],[36.3,26.6],[35.6,27.4],[35.1,28.1],[34.6,28.1],[34.8,28.6],[34.8,29.0],[35.0,29.4],[34.9,29.5],[34.6,29.1],[34.4,28.3],[34.2,27.8],[33.9,27.6],[33.6,28.0],[33.1,28.4],[32.4,29.9],[32.3,29.8],[32.7,28.7],[33.3,27.7],[34.1,26.1],[34.5,25.6],[34.8,25.0],[35.7,23.9],[35.5,23.8],[35.5,23.1],[36.7,22.2],[36.9,22.0],[37.2,21.0],[37.0,20.8],[37.1,19.8],[37.5,18.6],[37.9,18.4],[38.4,18.0],[39.0,16.8],[39.3,15.9],[39.8,15.4],[41.2,14.5],[41.7,13.9],[42.3,13.3],[42.6,13.0],[43.1,12.7],[43.3,12.4],[43.3,12.0],[42.7,11.7],[43.1,11.5],[43.5,11.3],[43.7,10.9],[44.1,10.4],[44.6,10.4],[45.6,10.7],[46.6,10.8],[47.5,11.1],[48.0,11.2],[48.4,11.4],[48.9,11.4],[49.3,11.4],[49.7,11.6],[50.3,11.7],[50.7,12.0],[51.1,12.0],[51.1,11.7],[51.0,11.2],[51.0,10.6],[50.8,10.3],[50.6,9.2],[50.1,8.1],[49.5,6.8],[48.6,5.3],[47.7,4.2],[46.6,2.9],[45.6,2.0],[44.1,1.1],[43.1,0.3],[42.0,-0.9],[41.8,-1.4],[41.6,-1.7],[40.9,-2.1],[40.6,-2.5],[40.3,-2.6],[40.1,-3.3],[39.8,-3.7],[39.6,-4.3],[39.2,-4.7],[38.7,-5.9],[38.8,-6.5],[39.4,-6.8],[39.5,-7.1],[39.2,-7.7],[39.3,-8.0],[39.2,-8.5],[39.5,-9.1],[40.0,-10.1],[40.3,-10.3],[40.5,-10.8],[40.4,-11.8],[40.6,-12.6],[40.6,-14.2],[40.8,-14.7],[40.5,-15.4],[40.1,-16.1],[39.5,-16.7],[38.5,-17.1],[37.4,-17.6],[36.3,-18.7],[35.9,-18.8],[35.2,-19.6],[34.8,-19.8],[34.7,-20.5],[35.2,-21.3],[35.4,-21.8],[35.4,-22.1],[35.6,-22.1],[35.5,-23.1],[35.4,-23.5],[35.6,-23.7],[35.5,-24.1],[35.0,-24.5],[34.2,-24.8],[33.0,-25.4],[32.6,-25.7],[32.7,-26.1],[32.9,-26.2],[32.8,-26.7],[32.6,-27.5],[32.5,-28.3],[32.2,-28.8],[31.5,-29.3],[31.3,-29.4],[30.9,-29.9],[30.6,-30.4],[30.1,-31.1],[28.9,-32.2],[28.2,-32.8],[27.5,-33.2],[26.4,-33.6],[25.9,-33.7],[25.8,-33.9],[25.2,-33.8],[24.7,-34.0],[23.6,-33.8],[23.0,-33.9],[22.6,-33.9],[21.5,-34.3],[20.7,-34.4],[20.1,-34.8],[19.6,-34.8],[19.2,-34.5],[18.9,-34.4],[18.4,-34.0],[18.4,-34.1],[18.2,-33.9],[18.3,-33.3],[17.9,-32.6],[18.2,-32.4],[18.2,-31.7],[17.6,-30.7],[17.1,-29.9],[17.1,-29.9],[16.3,-28.6],[15.6,-27.8],[15.2,-27.1],[15.0,-26.1],[14.7,-25.4],[14.4,-23.9],[14.4,-22.7],[14.3,-22.1],[13.9,-21.7],[13.4,-20.9],[12.8,-19.7],[12.6,-19.0],[11.8,-18.1],[11.7,-17.3],[11.6,-16.7],[11.8,-15.8],[12.1,-14.9],[12.2,-14.4],[12.5,-13.5],[12.7,-13.1],[13.3,-12.5],[13.6,-12.0],[13.7,-11.3],[13.7,-10.7],[13.4,-10.4],[13.1,-9.8],[12.9,-9.2],[12.9,-9.0],[13.2,-8.6],[12.9,-7.6],[12.7,-6.9],[12.2,-6.3],[12.3,-6.1],[12.2,-5.8],[11.9,-5.0],[11.1,-4.0],[10.1,-3.0],[9.4,-2.1],[8.8,-1.1],[8.8,-0.8],[9.0,-0.5],[9.3,0.3],[9.5,1.0],[9.3,1.2],[9.6,2.3],[9.8,3.1],[9.4,3.7],[8.9,3.9],[8.7,4.4],[8.5,4.5],[8.5,4.8],[7.5,4.4],[7.1,4.5],[6.7,4.2],[5.9,4.3],[5.4,4.9],[5.0,5.6],[4.3,6.3],[3.6,6.3],[2.7,6.3],[1.9,6.1],[1.1,5.9],[-0.5,5.3],[-1.1,5.0],[-2.0,4.7],[-2.9,5.0],[-3.3,5.0],[-4.0,5.2],[-4.6,5.2],[-5.8,5.0],[-6.5,4.7],[-7.5,4.3],[-7.7,4.4],[-8.0,4.4],[-9.0,4.8],[-9.9,5.6],[-10.8,6.1],[-11.4,6.8],[-11.7,6.9],[-12.4,7.3],[-12.9,7.8],[-13.1,8.2],[-13.2,8.9],[-13.7,9.5],[-14.1,9.9],[-14.3,10.0],[-14.6,10.2],[-14.7,10.7],[-14.8,10.9],[-15.1,11.0],[-15.7,11.5],[-16.1,11.5],[-16.3,11.8],[-16.3,12.0],[-16.6,12.2],[-16.7,12.4],[-16.8,13.2],[-16.7,13.6],[-17.1,14.4],[-17.6,14.7],[-17.2,14.9],[-16.7,15.6],[-16.5,16.1],[-16.6,16.7],[-16.3,17.2],[-16.1,18.1],[-16.3,19.1],[-16.4,19.6],[-16.3,20.1],[-16.5,20.6],[-17.1,21.0],[-17.0,21.4],[-17.0,21.9],[-16.6,22.2],[-16.3,22.7],[-16.3,23.0],[-16.0,23.7],[-15.4,24.4],[-15.1,24.5],[-14.8,25.1],[-14.8,25.6],[-14.4,26.3],[-13.8,26.6],[-13.1,27.6],[-12.6,28.0],[-11.7,28.1],[-10.9,28.8],[-10.4,29.1],[-9.6,29.9],[-9.8,31.2],[-9.4,32.0],[-9.3,32.6],[-8.7,33.2],[-7.7,33.7],[-6.9,34.1],[-6.2,35.1],[-5.9,35.8],[-5.2,35.8],[-4.6,35.3],[-3.6,35.4],[-2.6,35.2],[-2.2,35.2],[-1.2,35.7],[-0.1,35.9],[0.5,36.3],[1.5,36.6],[3.2,36.8],[4.8,36.9],[5.3,36.7],[6.3,37.1],[7.3,37.1],[7.7,36.9],[8.4,36.9],[9.5,37.4],[10.2,37.2],[10.2,36.7],[11.0,37.1],[11.1,36.9],[10.6,36.4],[10.6,35.9],[10.9,35.7],[10.8,34.8],[10.2,34.3],[10.3,33.8],[10.9,33.8],[11.1,33.3],[11.5,33.1],[12.7,32.8],[13.1,32.9],[13.9,32.7],[15.2,32.3],[15.7,31.4],[16.6,31.2],[18.0,30.8],[19.1,30.3],[19.6,30.5],[20.1,31.0],[19.8,31.8],[20.1,32.2],[20.9,32.7],[21.5,32.8],[22.9,32.6],[23.2,32.2],[23.6,32.2],[23.9,32.0],[24.9,31.9],[25.2,31.6],[26.5,31.6],[27.5,31.3],[28.4,31.0],[28.9,30.9],[29.7,31.2],[30.1,31.5],[31.0,31.6],[31.7,31.4],[32.0,30.9],[32.2,31.3],[33.0,31.0],[33.8,31.0],[34.3,31.2],[34.6,31.5],[34.5,31.6],[34.8,32.1],[35.0,32.8],[35.1,33.1],[35.1,33.1],[35.5,33.9],[36.0,34.6],[36.0,34.6],[35.9,35.4],[36.1,35.8],[35.8,36.3],[36.2,36.7],[35.6,36.6],[34.7,36.8],[34.0,36.2],[32.5,36.1],[31.7,36.6],[30.6,36.7],[30.4,36.3],[29.7,36.1],[28.7,36.7],[27.6,36.7],[27.0,37.7],[26.3,38.2],[26.8,39.0],[26.2,39.5],[27.3,40.4],[28.8,40.5],[29.2,41.2],[31.1,41.1],[32.3,41.7],[33.5,42.0],[35.2,42.0],[36.9,41.3],[38.3,40.9],[39.5,41.1],[40.4,41.0],[41.6,41.5],[41.7,42.0],[41.5,42.6],[40.9,43.0],[40.3,43.1],[40.0,43.4],[38.7,44.3],[37.5,44.7],[36.7,45.2],[37.4,45.4],[38.2,46.2],[37.7,46.6],[39.1,47.0],[39.1,47.3],[38.2,47.1],[37.4,47.0],[36.8,46.7],[35.8,46.6],[35.0,46.3],[35.0,45.7],[35.5,45.4],[36.5,45.5],[36.3,45.1],[35.2,44.9],[33.9,44.4],[33.3,44.6],[33.5,45.0],[32.5,45.3],[32.6,45.5],[33.6,45.9],[33.3,46.1],[31.7,46.3],[31.7,46.7],[30.7,46.6],[30.4,46.0],[29.6,45.3],[29.6,45.0],[29.1,44.8],[28.8,44.9],[28.6,43.7],[28.0,43.3],[27.7,42.6],[28.0,42.0],[28.1,41.6],[29.0,41.3],[28.8,41.1],[27.6,41.0],[27.2,40.7],[26.4,40.2],[26.0,40.6],[26.1,40.8],[25.4,40.9],[24.9,40.9],[23.7,40.7],[24.4,40.1],[23.9,40.0],[23.3,40.0],[22.8,40.5],[22.6,40.3],[22.9,39.7],[23.4,39.2],[23.0,39.0],[23.5,38.5],[24.0,38.2],[24.0,37.7],[23.1,37.9],[23.4,37.4],[22.8,37.3],[23.2,36.4],[22.5,36.4],[21.7,36.8],[21.3,37.6],[21.1,38.3],[20.7,38.8],[20.2,39.3],[20.2,39.6],[20.0,39.7],[20.0,39.9],[19.4,40.3],[19.3,40.7],[19.4,41.4],[19.5,41.7],[19.4,41.9],[19.2,42.0],[18.9,42.3],[18.4,42.5],[17.5,42.8],[16.9,43.2],[16.0,43.5],[15.2,44.2],[15.4,44.3],[14.9,44.7],[14.9,45.1],[14.3,45.2],[14.0,44.8],[13.7,45.1],[13.7,45.5],[13.7,45.5],[13.9,45.6],[13.1,45.7],[12.3,45.4],[12.4,44.9],[12.3,44.6],[12.6,44.1],[13.5,43.6],[14.0,42.8],[15.1,42.0],[15.9,42.0],[16.2,41.7],[15.9,41.5],[16.8,41.2],[17.5,40.9],[18.4,40.4],[18.5,40.2],[18.3,39.8],[17.7,40.3],[16.9,40.4],[16.5,39.8],[17.2,39.4],[17.1,38.9],[16.6,38.8],[16.1,38.0],[15.7,37.9],[15.7,38.2],[15.9,38.8],[16.1,39.0],[15.7,39.5],[15.4,40.0],[15.0,40.2],[14.7,40.6],[14.1,40.8],[13.6,41.2],[12.9,41.3],[12.1,41.7],[11.2,42.4],[10.5,42.9],[10.2,43.9],[9.7,44.0],[8.9,44.4],[8.4,44.2],[7.8,43.8],[7.4,43.7],[6.5,43.1],[4.6,43.4],[3.1,43.1],[3.0,42.5],[3.0,41.9],[2.1,41.2],[0.8,41.0],[0.7,40.7],[0.1,40.1],[-0.3,39.3],[0.1,38.7],[-0.5,38.3],[-0.7,37.6],[-1.4,37.4],[-2.1,36.7],[-3.4,36.7],[-4.4,36.7],[-5.0,36.3],[-5.4,35.9],[-5.9,36.0],[-6.2,36.4],[-6.5,36.9],[-7.5,37.1],[-7.9,36.8],[-8.4,37.0],[-8.9,36.9],[-8.7,37.7],[-8.8,38.3],[-9.3,38.4],[-9.5,38.7],[-9.4,39.4],[-9.0,39.8],[-9.0,40.2],[-8.8,40.8],[-8.8,41.2],[-9.0,41.5],[-9.0,41.9],[-9.0,42.6],[-9.4,43.0],[-8.0,43.7],[-6.8,43.6],[-5.4,43.6],[-4.3,43.4],[-3.5,43.5],[-1.9,43.4],[-1.4,44.0],[-1.2,46.0],[-2.2,47.1],[-3.0,47.6],[-4.5,48.0],[-4.6,48.7],[-3.3,48.9],[-1.6,48.6],[-1.9,49.8],[-1.0,49.3],[1.3,50.1],[1.6,50.9],[2.5,51.1],[3.3,51.3],[3.8,51.6],[4.7,53.1],[6.1,53.5],[6.9,53.5],[7.1,53.7],[7.9,53.7],[8.1,53.5],[8.8,54.0],[8.6,54.4],[8.5,55.0],[8.1,55.5],[8.1,56.5],[8.3,56.8],[8.5,57.1],[9.4,57.2],[9.8,57.4],[10.6,57.7],[10.5,57.2],[10.3,56.9],[10.4,56.6],[10.9,56.5],[10.7,56.1],[10.4,56.2],[9.6,55.5],[9.9,55.0],[9.9,54.6],[10.9,54.4],[10.9,54.0],[12.0,54.2],[12.5,54.5],[13.6,54.1],[14.1,53.8],[14.8,54.1],[16.4,54.5],[17.6,54.9],[18.6,54.7],[18.7,54.4],[19.7,54.4],[19.9,54.9],[21.3,55.2],[21.1,56.0],[21.1,56.8],[21.6,57.4],[22.5,57.8],[23.3,57.0],[24.1,57.0],[24.3,57.8],[24.4,58.4],[24.1,58.3],[23.4,58.6],[23.3,59.2],[24.6,59.5],[25.9,59.6],[26.9,59.4],[28.0,59.5],[29.1,60.0],[28.1,60.5],[26.3,60.4],[24.5,60.1],[22.9,59.8],[22.3,60.4],[21.3,60.7],[21.5,61.7],[21.1,62.6],[21.5,63.2],[22.4,63.8],[24.7,64.9],[25.4,65.1],[25.3,65.5],[23.9,66.0],[22.2,65.7],[21.2,65.0],[21.4,64.4],[19.8,63.6],[17.8,62.7],[17.1,61.3],[17.8,60.6],[18.8,60.1],[17.9,59.0],[16.8,58.7],[16.4,57.0],[15.9,56.1],[14.7,56.2],[14.1,55.4],[12.9,55.4],[12.6,56.3],[11.8,57.4],[11.0,58.9],[10.4,59.5],[8.4,58.3],[7.1,58.1],[5.7,58.6],[5.3,59.7],[5.0,62.0],[5.9,62.6],[8.6,63.5],[10.5,64.5],[12.4,65.9],[14.8,67.8],[16.4,68.6],[19.2,69.8],[21.4,70.3],[23.0,70.2],[24.5,71.0],[26.4,71.0],[28.2,71.2],[31.3,70.5],[30.0,70.2],[31.1,69.6],[32.1,69.9],[33.8,69.3],[36.5,69.1],[40.3,67.9],[41.1,67.5],[41.1,66.8],[40.0,66.3],[38.4,66.0],[33.9,66.8],[33.2,66.6],[34.8,65.9],[34.9,64.4],[36.2,64.1],[37.0,63.9],[37.1,64.3],[36.5,64.8],[37.2,65.1],[39.6,64.5],[40.4,64.8],[39.8,65.5],[42.1,66.5],[43.0,66.4],[44.0,66.1],[44.5,66.8],[43.7,67.4],[44.2,68.0],[43.5,68.6],[46.3,68.2],[46.8,67.7],[45.6,67.6],[45.6,67.0],[46.3,66.7],[47.9,66.9],[48.1,67.5],[50.2,68.0],[53.7,68.9],[54.5,68.8],[53.5,68.2],[54.7,68.1],[55.4,68.4],[57.3,68.5],[58.8,68.9],[59.9,68.3],[61.1,68.9],[60.0,69.5],[60.6,69.9],[63.5,69.5],[64.9,69.2],[68.5,68.1],[69.2,68.6],[68.2,69.1],[68.1,69.4],[66.9,69.5],[67.3,69.9],[66.7,70.7],[66.7,71.0],[68.5,71.9],[69.2,72.8],[69.9,73.0],[72.6,72.8],[72.8,72.2],[71.8,71.4],[72.5,71.1],[72.8,70.4],[72.6,69.0],[73.7,68.4],[73.2,67.7],[71.3,66.3],[72.4,66.2],[72.8,66.5],[73.9,66.8],[74.2,67.3],[75.1,67.8],[74.5,68.3],[74.9,69.0],[73.8,69.1],[73.6,69.6],[74.4,70.6],[73.1,71.4],[74.9,72.1],[74.7,72.8],[75.2,72.9],[75.7,72.3],[75.3,71.3],[76.4,71.2],[75.9,71.9],[77.6,72.3],[79.7,72.3],[81.5,71.7],[80.6,72.6],[80.5,73.6],[82.3,73.9],[84.7,73.8],[86.8,73.9],[86.0,74.5],[87.2,75.1],[88.3,75.1],[90.3,75.6],[92.9,75.8],[93.2,76.0],[95.9,76.1],[96.7,75.9],[98.9,76.4],[100.8,76.4],[101.0,76.9],[102.0,77.3],[104.4,77.7],[106.1,77.4],[104.7,77.1],[107.0,77.0],[107.2,76.5],[108.2,76.7],[111.1,76.7],[113.3,76.2],[114.1,75.8],[113.9,75.3],[112.8,75.0],[110.2,74.5],[109.4,74.2],[110.6,74.0],[112.1,73.8],[113.0,74.0],[113.5,73.3],[114.0,73.6],[115.6,73.8],[118.8,73.6],[119.0,73.1],[123.2,73.0],[123.3,73.7],[125.4,73.6],[127.0,73.6],[128.6,73.0],[129.1,72.4],[128.5,72.0],[129.7,71.2],[131.3,70.8],[132.3,71.8],[133.9,71.4],[135.6,71.7],[137.5,71.3],[138.2,71.6],[139.9,71.5],[139.1,72.4],[140.5,72.8],[149.5,72.2],[150.4,71.6],[153.0,70.8],[157.0,71.0],[159.0,70.9],[159.8,70.5],[159.7,69.7],[160.9,69.4],[162.3,69.6],[164.1,69.7],[165.9,69.5],[167.8,69.6],[169.6,68.7],[170.8,69.0],[170.0,69.7],[170.5,70.1],[173.6,69.8],[175.7,69.9],[178.6,69.4],[-180.0,69.0]],[[-95.6,69.1],[-96.3,68.8],[-97.6,69.1],[-98.4,69.0],[-99.8,69.4],[-98.9,69.7],[-98.2,70.1],[-97.2,69.9],[-96.6,69.7],[-96.3,69.5],[-95.6,69.1]],[[-180.0,71.5],[180.0,70.8],[178.9,70.8],[178.7,71.1],[-180.0,71.5]],[[-90.5,69.5],[-90.5,68.5],[-89.2,69.3],[-88.0,68.6],[-88.3,67.9],[-87.3,67.2],[-86.3,67.9],[-85.6,68.8],[-85.5,69.9],[-84.1,69.8],[-82.6,69.7],[-81.3,69.2],[-81.2,68.7],[-82.0,68.1],[-81.3,67.6],[-81.4,67.1],[-83.3,66.4],[-84.7,66.3],[-85.8,66.6],[-86.1,66.1],[-87.0,65.2],[-87.3,64.8],[-88.5,64.1],[-89.9,64.0],[-90.7,63.6],[-90.8,63.0],[-91.9,62.8],[-93.2,62.0],[-94.2,60.9],[-94.6,60.1],[-94.7,58.9],[-93.2,58.8],[-92.8,57.8],[-92.3,57.1],[-90.9,57.3],[-89.0,56.9],[-88.0,56.5],[-87.3,56.0],[-86.1,55.7],[-85.0,55.3],[-83.4,55.2],[-82.3,55.1],[-82.4,54.3],[-82.1,53.3],[-81.4,52.2],[-79.9,51.2],[-79.1,51.5],[-78.6,52.6],[-79.1,54.1],[-79.8,54.7],[-78.2,55.1],[-77.1,55.8],[-76.5,56.5],[-76.6,57.2],[-77.3,58.1],[-78.5,58.8],[-77.3,59.9],[-77.8,60.8],[-78.1,62.3],[-77.4,62.6],[-75.7,62.3],[-74.7,62.2],[-73.8,62.4],[-72.9,62.1],[-71.7,61.5],[-71.4,61.1],[-69.6,61.1],[-69.6,60.2],[-69.3,59.0],[-68.4,58.8],[-67.7,58.2],[-66.2,58.8],[-65.2,59.9],[-64.6,60.3],[-63.8,59.4],[-62.5,58.2],[-61.4,57.0],[-61.8,56.3],[-60.5,55.8],[-59.6,55.2],[-58.0,54.9],[-57.3,54.6],[-56.9,53.8],[-56.2,53.6],[-55.8,53.3],[-55.7,52.1],[-56.4,51.8],[-57.1,51.4],[-58.8,51.1],[-60.0,50.2],[-61.7,50.1],[-63.9,50.3],[-65.4,50.3],[-66.4,50.2],[-67.2,49.5],[-68.5,49.1],[-70.0,47.7],[-71.1,46.8],[-70.3,47.0],[-68.7,48.3],[-66.6,49.1],[-65.1,49.2],[-64.2,48.7],[-65.1,48.1],[-64.8,47.0],[-64.5,46.2],[-63.2,45.7],[-61.5,45.9],[-60.5,47.0],[-60.5,46.3],[-59.8,45.9],[-61.0,45.3],[-63.3,44.7],[-64.2,44.3],[-65.4,43.5],[-66.1,43.6],[-66.2,44.5],[-64.4,45.3],[-66.0,45.3],[-67.1,45.1],[-67.0,44.8],[-68.0,44.3],[-69.1,44.0],[-70.1,43.7],[-70.7,43.0],[-70.8,42.9],[-70.8,42.3],[-70.5,41.8],[-70.1,41.8],[-70.2,42.1],[-69.9,41.9],[-70.0,41.6],[-70.6,41.5],[-71.1,41.5],[-71.9,41.3],[-72.3,41.3],[-72.9,41.2],[-73.7,40.9],[-72.2,41.1],[-71.9,40.9],[-73.3,40.6],[-74.0,40.6],[-74.0,40.8],[-74.3,40.5],[-74.0,40.4],[-74.2,39.7],[-74.9,38.9],[-75.0,39.2],[-75.2,39.2],[-75.5,39.5],[-75.3,39.0],[-75.1,38.8],[-75.1,38.4],[-75.4,38.0],[-75.9,37.2],[-76.0,37.3],[-75.7,37.9],[-76.2,38.3],[-76.4,39.1],[-76.5,38.7],[-76.3,38.1],[-77.0,38.2],[-76.3,37.9],[-76.3,37.0],[-76.0,36.9],[-75.9,36.6],[-75.7,35.6],[-76.4,34.8],[-77.4,34.5],[-78.1,33.9],[-78.6,33.9],[-79.1,33.5],[-79.2,33.2],[-80.3,32.5],[-80.9,32.0],[-81.3,31.4],[-81.5,30.7],[-81.3,30.0],[-81.0,29.2],[-80.5,28.5],[-80.5,28.0],[-80.1,26.9],[-80.1,26.2],[-80.1,25.8],[-80.4,25.2],[-80.7,25.1],[-81.2,25.2],[-81.3,25.6],[-81.7,25.9],[-82.2,26.7],[-82.7,27.5],[-82.9,27.9],[-82.7,28.6],[-82.9,29.1],[-83.7,29.9],[-84.1,30.1],[-85.1,29.6],[-85.3,29.7],[-85.8,30.2],[-86.4,30.4],[-87.5,30.3],[-88.4,30.4],[-89.2,30.3],[-89.6,30.2],[-89.4,29.9],[-89.4,29.5],[-89.2,29.3],[-89.4,29.2],[-89.8,29.3],[-90.2,29.1],[-90.9,29.1],[-91.6,29.7],[-92.5,29.6],[-93.2,29.8],[-93.8,29.7],[-94.7,29.5],[-95.6,28.7],[-96.6,28.3],[-97.1,27.8],[-97.4,27.4],[-97.4,26.7],[-97.3,26.2],[-97.1,25.9],[-97.1,25.9],[-97.1,25.9],[-97.5,25.0],[-97.7,24.3],[-97.8,22.9],[-97.9,22.4],[-97.7,21.9],[-97.4,21.4],[-97.2,20.6],[-96.5,19.9],[-96.3,19.3],[-95.9,18.8],[-94.8,18.6],[-94.4,18.1],[-93.5,18.4],[-92.8,18.5],[-92.0,18.7],[-91.4,18.9],[-90.8,19.3],[-90.5,19.9],[-90.5,20.7],[-90.3,21.0],[-89.6,21.3],[-88.5,21.5],[-87.7,21.5],[-87.1,21.5],[-86.8,21.3],[-86.8,20.8],[-87.4,20.3],[-87.6,19.6],[-87.4,19.5],[-87.6,19.0],[-87.8,18.3],[-88.1,18.5],[-88.3,18.5],[-88.3,18.4],[-88.1,18.3],[-88.1,18.1],[-88.3,17.6],[-88.2,17.5],[-88.3,17.1],[-88.2,17.0],[-88.4,16.5],[-88.6,16.3],[-88.7,16.2],[-88.9,15.9],[-88.6,15.7],[-88.5,15.9],[-88.2,15.7],[-88.1,15.7],[-87.9,15.9],[-87.6,15.9],[-87.5,15.8],[-87.4,15.8],[-86.9,15.8],[-86.4,15.8],[-86.1,15.9],[-86.0,16.0],[-85.7,16.0],[-85.4,15.9],[-85.2,15.9],[-85.0,16.0],[-84.5,15.9],[-84.4,15.8],[-84.1,15.6],[-83.8,15.4],[-83.4,15.3],[-83.1,15.0],[-83.2,14.9],[-83.3,14.7],[-83.2,14.3],[-83.4,14.0],[-83.5,13.6],[-83.6,13.1],[-83.5,12.9],[-83.5,12.4],[-83.6,12.3],[-83.7,11.9],[-83.7,11.6],[-83.9,11.4],[-83.8,11.1],[-83.7,10.9],[-83.4,10.4],[-83.0,10.0],[-82.5,9.6],[-82.2,9.2],[-82.2,9.0],[-81.8,9.0],[-81.7,9.0],[-81.4,8.8],[-80.9,8.9],[-80.5,9.1],[-79.9,9.3],[-79.6,9.6],[-79.0,9.6],[-79.1,9.5],[-78.5,9.4],[-78.1,9.2],[-77.7,8.9],[-77.4,8.7],[-76.8,8.6],[-76.1,9.3],[-75.7,9.4],[-75.7,9.8],[-75.5,10.6],[-74.9,11.1],[-74.3,11.1],[-74.2,11.3],[-73.4,11.2],[-72.6,11.7],[-72.2,12.0],[-71.8,12.4],[-71.4,12.4],[-71.1,12.1],[-71.3,11.8],[-71.4,11.5],[-71.9,11.4],[-71.6,11.0],[-71.6,10.4],[-72.1,9.9],[-71.7,9.1],[-71.3,9.1],[-71.0,9.9],[-71.4,10.2],[-71.4,11.0],[-70.2,11.4],[-70.3,11.8],[-69.9,12.2],[-69.6,11.5],[-68.9,11.4],[-68.2,10.9],[-68.2,10.6],[-67.3,10.5],[-66.2,10.6],[-65.7,10.2],[-64.9,10.1],[-64.3,10.4],[-64.3,10.6],[-63.1,10.7],[-61.9,10.7],[-62.7,10.4],[-62.4,9.9],[-61.6,9.9],[-60.8,9.4],[-60.7,8.6],[-60.2,8.6],[-59.8,8.4],[-59.1,8.0],[-58.5,7.3],[-58.5,6.8],[-58.1,6.8],[-57.5,6.3],[-57.1,6.0],[-55.9,5.8],[-55.8,6.0],[-55.0,6.0],[-54.0,5.8],[-53.6,5.6],[-52.9,5.4],[-51.8,4.6],[-51.7,4.2],[-51.3,4.2],[-51.1,3.6],[-50.5,1.9],[-50.0,1.7],[-49.9,1.0],[-50.7,0.2],[-50.4,-0.1],[-48.6,-0.2],[-48.6,-1.2],[-47.8,-0.6],[-46.6,-0.9],[-44.9,-1.6],[-44.4,-2.1],[-44.6,-2.7],[-43.4,-2.4],[-41.5,-2.9],[-40.0,-2.9],[-38.5,-3.7],[-37.2,-4.8],[-36.5,-5.1],[-35.6,-5.1],[-35.2,-5.5],[-34.9,-6.7],[-34.7,-7.3],[-35.1,-9.0],[-35.6,-9.6],[-37.0,-11.0],[-37.7,-12.2],[-38.4,-13.0],[-38.7,-13.1],[-39.0,-13.8],[-38.9,-15.7],[-39.2,-17.2],[-39.3,-17.9],[-39.6,-18.3],[-39.8,-19.6],[-40.8,-20.9],[-40.9,-21.9],[-41.8,-22.4],[-42.0,-23.0],[-43.1,-23.0],[-44.6,-23.4],[-45.4,-23.8],[-46.5,-24.1],[-47.6,-24.9],[-48.5,-25.9],[-48.6,-26.6],[-48.5,-27.2],[-48.7,-28.2],[-48.9,-28.7],[-49.6,-29.2],[-50.7,-31.0],[-51.6,-31.8],[-52.3,-32.2],[-52.7,-33.2],[-53.4,-33.8],[-53.8,-34.4],[-54.9,-35.0],[-55.7,-34.8],[-56.2,-34.9],[-57.1,-34.4],[-57.8,-34.5],[-58.4,-33.9],[-58.5,-34.4],[-57.2,-35.3],[-57.4,-36.0],[-56.7,-36.4],[-56.8,-36.9],[-57.7,-38.2],[-59.2,-38.7],[-61.2,-38.9],[-62.3,-38.8],[-62.1,-39.4],[-62.3,-40.2],[-62.1,-40.7],[-62.7,-41.0],[-63.8,-41.2],[-64.7,-40.8],[-65.1,-41.1],[-65.0,-42.1],[-64.3,-42.4],[-63.8,-42.0],[-63.5,-42.6],[-64.4,-42.9],[-65.2,-43.5],[-65.3,-44.5],[-65.6,-45.0],[-66.5,-45.0],[-67.3,-45.6],[-67.6,-46.3],[-66.6,-47.0],[-65.6,-47.2],[-66.0,-48.1],[-67.2,-48.7],[-67.8,-49.9],[-68.7,-50.3],[-69.1,-50.7],[-68.8,-51.8],[-68.2,-52.4],[-68.6,-52.3],[-69.5,-52.3],[-69.9,-52.5],[-70.8,-52.9],[-71.0,-53.8],[-71.4,-53.9],[-72.6,-53.5],[-73.7,-52.8],[-74.9,-52.3],[-75.3,-51.6],[-75.0,-51.0],[-75.5,-50.4],[-75.6,-48.7],[-75.2,-47.7],[-74.1,-46.9],[-75.6,-46.6],[-74.7,-45.8],[-74.4,-44.1],[-73.2,-44.5],[-72.7,-42.4],[-73.4,-42.1],[-73.7,-43.4],[-74.3,-43.2],[-74.0,-41.8],[-73.7,-39.9],[-73.2,-39.3],[-73.5,-38.3],[-73.6,-37.2],[-73.2,-37.1],[-72.6,-35.5],[-71.9,-33.9],[-71.4,-32.4],[-71.7,-30.9],[-71.4,-30.1],[-71.5,-28.9],[-70.9,-27.6],[-70.7,-25.7],[-70.4,-23.6],[-70.1,-21.4],[-70.2,-19.8],[-70.4,-18.3],[-71.4,-17.8],[-71.5,-17.4],[-73.4,-16.4],[-75.2,-15.3],[-76.0,-14.6],[-76.4,-13.8],[-76.3,-13.5],[-77.1,-12.2],[-78.1,-10.4],[-79.0,-8.4],[-79.4,-7.9],[-79.8,-7.2],[-80.5,-6.5],[-81.3,-6.1],[-80.9,-5.7],[-81.4,-4.7],[-81.1,-4.0],[-80.3,-3.4],[-79.8,-2.7],[-80.0,-2.2],[-80.4,-2.7],[-81.0,-2.2],[-80.8,-2.0],[-80.9,-1.1],[-80.6,-0.9],[-80.4,-0.3],[-80.0,0.4],[-80.1,0.8],[-79.5,1.0],[-78.9,1.4],[-79.0,1.7],[-78.6,1.8],[-78.7,2.3],[-78.4,2.6],[-77.9,2.7],[-77.5,3.3],[-77.1,3.8],[-77.5,4.1],[-77.3,4.7],[-77.5,5.6],[-77.3,5.8],[-77.5,6.7],[-77.9,7.2],[-78.2,7.5],[-78.4,8.1],[-78.2,8.3],[-78.4,8.4],[-78.6,8.7],[-79.1,9.0],[-79.6,8.9],[-79.8,8.6],[-80.2,8.3],[-80.4,8.3],[-80.5,8.1],[-80.0,7.5],[-80.3,7.4],[-80.4,7.3],[-80.9,7.2],[-81.1,7.8],[-81.2,7.6],[-81.5,7.7],[-81.7,8.1],[-82.1,8.2],[-82.4,8.3],[-82.8,8.3],[-82.8,8.1],[-83.0,8.2],[-83.5,8.4],[-83.7,8.7],[-83.6,8.8],[-83.6,9.1],[-83.9,9.3],[-84.3,9.5],[-84.6,9.6],[-84.7,9.9],[-85.0,10.1],[-84.9,9.8],[-85.1,9.6],[-85.3,9.8],[-85.7,9.9],[-85.8,10.1],[-85.8,10.4],[-85.7,10.8],[-85.9,10.9],[-85.7,11.1],[-86.1,11.4],[-86.5,11.8],[-86.7,12.1],[-87.2,12.5],[-87.7,12.9],[-87.6,13.1],[-87.4,12.9],[-87.3,13.0],[-87.5,13.3],[-87.8,13.4],[-87.9,13.1],[-88.5,13.2],[-88.8,13.3],[-89.3,13.5],[-89.8,13.5],[-90.1,13.7],[-90.6,13.9],[-91.2,13.9],[-91.7,14.1],[-92.2,14.5],[-93.4,15.6],[-93.9,15.9],[-94.7,16.2],[-95.3,16.1],[-96.1,15.8],[-96.6,15.7],[-97.3,15.9],[-98.0,16.1],[-98.9,16.6],[-99.7,16.7],[-100.8,17.2],[-101.7,17.6],[-101.9,17.9],[-102.5,18.0],[-103.5,18.3],[-103.9,18.7],[-105.0,19.3],[-105.5,19.9],[-105.7,20.4],[-105.4,20.5],[-105.5,20.8],[-105.3,21.1],[-105.3,21.4],[-105.6,21.9],[-105.7,22.3],[-106.0,22.8],[-106.9,23.8],[-107.9,24.5],[-108.4,25.2],[-109.3,25.6],[-109.4,25.8],[-109.3,26.4],[-109.8,26.7],[-110.4,27.2],[-110.6,27.9],[-111.2,27.9],[-111.8,28.5],[-112.2,29.0],[-112.3,29.3],[-112.8,30.0],[-113.2,30.8],[-113.1,31.2],[-113.9,31.6],[-114.2,31.5],[-114.8,31.8],[-114.9,31.4],[-114.8,30.9],[-114.7,30.2],[-114.3,29.8],[-113.6,29.1],[-113.4,28.8],[-113.3,28.8],[-113.1,28.4],[-113.0,28.4],[-112.8,27.8],[-112.5,27.5],[-112.2,27.2],[-111.6,26.7],[-111.3,25.7],[-111.0,25.3],[-110.7,24.8],[-110.7,24.3],[-110.2,24.3],[-109.8,23.8],[-109.4,23.4],[-109.4,23.2],[-109.9,22.8],[-110.0,22.8],[-110.3,23.4],[-111.0,24.0],[-111.7,24.5],[-112.2,24.7],[-112.2,25.5],[-112.3,26.0],[-112.8,26.3],[-113.5,26.8],[-113.6,26.6],[-113.8,26.9],[-114.5,27.1],[-115.1,27.7],[-115.0,27.8],[-114.6,27.7],[-114.2,28.1],[-114.2,28.6],[-114.9,29.3],[-115.5,29.6],[-115.9,30.2],[-116.3,30.8],[-116.7,31.6],[-117.1,32.5],[-117.3,33.0],[-117.9,33.6],[-118.4,33.7],[-118.5,34.0],[-119.1,34.1],[-119.4,34.3],[-120.4,34.4],[-120.6,34.6],[-120.7,35.2],[-121.7,36.2],[-122.5,37.6],[-122.5,37.8],[-123.0,38.1],[-123.7,39.0],[-123.9,39.8],[-124.4,40.3],[-124.2,41.1],[-124.2,42.0],[-124.5,42.8],[-124.1,43.7],[-123.9,45.5],[-124.1,46.9],[-124.4,47.7],[-124.7,48.2],[-124.6,48.4],[-123.1,48.0],[-122.6,47.1],[-122.3,47.4],[-122.5,48.2],[-122.8,49.0],[-123.0,49.0],[-124.9,50.0],[-125.6,50.4],[-127.4,50.8],[-128.0,51.7],[-127.8,52.3],[-129.1,52.8],[-129.3,53.6],[-130.5,54.3],[-130.5,54.8],[-131.1,55.2],[-132.0,55.5],[-132.2,56.4],[-133.5,57.2],[-134.1,58.1],[-135.0,58.2],[-136.6,58.2],[-137.8,58.5],[-139.9,59.5],[-140.8,59.7],[-142.6,60.1],[-144.0,60.0],[-145.9,60.5],[-147.1,60.9],[-148.2,60.7],[-148.0,60.0],[-148.6,59.9],[-149.7,59.7],[-150.6,59.4],[-151.7,59.2],[-151.9,59.7],[-151.4,60.7],[-150.3,61.0],[-150.6,61.3],[-151.9,60.7],[-152.6,60.1],[-154.0,59.4],[-153.3,58.9],[-154.2,58.1],[-155.3,57.7],[-156.3,57.4],[-156.6,57.0],[-158.1,56.5],[-158.4,56.0],[-159.6,55.6],[-160.3,55.6],[-161.2,55.4],[-162.2,55.0],[-163.1,54.7],[-164.8,54.4],[-164.9,54.6],[-163.8,55.0],[-162.9,55.3],[-161.8,55.9],[-160.6,56.0],[-160.1,56.4],[-158.7,57.0],[-158.5,57.2],[-157.7,57.6],[-157.6,58.3],[-157.0,58.9],[-158.2,58.6],[-158.5,58.8],[-159.1,58.4],[-159.7,58.9],[-160.0,58.6],[-160.4,59.1],[-161.4,58.7],[-162.0,58.7],[-162.1,59.3],[-161.9,59.6],[-162.5,60.0],[-163.8,59.8],[-164.7,60.3],[-165.3,60.5],[-165.4,61.1],[-166.1,61.5],[-165.7,62.1],[-164.9,62.6],[-164.6,63.1],[-163.8,63.2],[-163.1,63.1],[-162.3,63.5],[-161.5,63.5],[-160.8,63.8],[-161.0,64.2],[-161.5,64.4],[-160.8,64.8],[-161.4,64.8],[-162.5,64.6],[-162.8,64.3],[-163.5,64.6],[-165.0,64.4],[-166.4,64.7],[-166.8,65.1],[-168.1,65.7],[-166.7,66.1],[-164.5,66.6],[-163.7,66.6],[-163.8,66.1],[-161.7,66.1],[-162.5,66.7],[-163.7,67.1],[-164.4,67.6],[-165.4,68.0],[-166.8,68.4],[-166.2,68.9],[-164.4,68.9],[-163.2,69.4],[-162.9,69.9],[-161.9,70.3],[-160.9,70.4],[-159.0,70.9],[-158.1,70.8],[-156.6,71.4],[-155.1,71.1],[-154.3,70.7],[-153.9,70.9],[-152.2,70.8],[-152.3,70.6],[-150.7,70.4],[-149.7,70.5],[-147.6,70.2],[-145.7,70.1],[-144.9,70.0],[-143.6,70.2],[-142.1,69.9],[-141.0,69.7],[-139.1,69.5],[-137.5,69.0],[-136.5,68.9],[-135.6,69.3],[-134.4,69.6],[-132.9,69.5],[-131.4,69.9],[-129.8,70.2],[-129.1,69.8],[-128.4,70.0],[-128.1,70.5],[-127.4,70.4],[-125.8,69.5],[-124.4,70.2],[-124.3,69.4],[-123.1,69.6],[-122.7,69.9],[-121.5,69.8],[-119.9,69.4],[-117.6,69.0],[-116.2,68.8],[-115.2,68.9],[-113.9,68.4],[-115.3,67.9],[-113.5,67.7],[-110.8,67.8],[-109.9,68.0],[-108.9,67.4],[-107.8,67.9],[-108.8,68.3],[-108.2,68.7],[-107.0,68.7],[-106.1,68.8],[-105.3,68.6],[-104.3,68.0],[-103.2,68.1],[-101.5,67.6],[-99.9,67.8],[-98.4,67.8],[-98.6,68.4],[-97.7,68.6],[-96.1,68.2],[-96.1,67.3],[-95.5,68.1],[-94.7,68.1],[-94.2,69.1],[-95.3,69.7],[-96.5,70.1],[-96.4,71.2],[-95.2,71.9],[-93.9,71.8],[-92.9,71.3],[-91.5,70.2],[-92.4,69.7],[-90.5,69.5]],[[-114.2,73.1],[-114.7,72.7],[-112.4,73.0],[-111.1,72.5],[-109.9,73.0],[-109.0,72.6],[-108.2,71.7],[-107.7,72.1],[-108.4,73.1],[-107.5,73.2],[-106.5,73.1],[-105.4,72.7],[-104.8,71.7],[-104.5,71.0],[-102.8,70.5],[-101.0,70.0],[-101.1,69.6],[-102.7,69.5],[-102.1,69.1],[-102.4,68.8],[-104.2,68.9],[-106.0,69.2],[-107.1,69.1],[-109.0,68.8],[-112.0,68.6],[-113.3,68.5],[-113.9,69.0],[-115.2,69.3],[-116.1,69.2],[-117.3,70.0],[-116.7,70.1],[-115.1,70.2],[-113.7,70.2],[-112.4,70.4],[-114.3,70.6],[-116.5,70.5],[-117.9,70.5],[-118.4,70.9],[-116.1,71.3],[-117.7,71.3],[-119.4,71.6],[-118.6,72.3],[-117.9,72.7],[-115.2,73.3],[-114.2,73.1]],[[-76.3,73.1],[-76.3,72.8],[-77.3,72.9],[-78.4,72.9],[-79.5,72.7],[-79.8,72.8],[-80.9,73.3],[-80.8,73.7],[-80.4,73.8],[-78.1,73.7],[-76.3,73.1]],[[-86.6,73.2],[-85.8,72.5],[-84.9,73.3],[-82.3,73.8],[-80.6,72.7],[-80.8,72.1],[-78.8,72.4],[-77.8,72.8],[-75.6,72.2],[-74.2,71.8],[-74.1,71.3],[-72.2,71.6],[-71.2,70.9],[-68.8,70.5],[-67.9,70.1],[-67.0,69.2],[-68.8,68.7],[-66.5,68.1],[-64.9,67.8],[-63.4,66.9],[-61.9,66.9],[-62.2,66.2],[-63.9,65.0],[-65.1,65.4],[-66.7,66.4],[-68.0,66.3],[-68.1,65.7],[-67.1,65.1],[-65.7,64.6],[-65.3,64.4],[-64.7,63.4],[-65.0,62.7],[-66.3,62.9],[-68.8,63.7],[-67.4,62.9],[-66.3,62.3],[-66.2,61.9],[-68.9,62.3],[-71.0,62.9],[-72.2,63.4],[-71.9,63.7],[-73.4,64.2],[-74.8,64.7],[-74.8,64.4],[-77.7,64.2],[-78.6,64.6],[-77.9,65.3],[-76.0,65.3],[-74.0,65.5],[-74.3,65.8],[-73.9,66.3],[-72.7,67.3],[-72.9,67.7],[-73.3,68.1],[-74.8,68.6],[-76.9,68.9],[-76.2,69.1],[-77.3,69.8],[-78.2,69.8],[-79.0,70.2],[-79.5,69.9],[-81.3,69.7],[-84.9,70.0],[-87.1,70.3],[-88.7,70.4],[-89.5,70.8],[-88.5,71.2],[-89.9,71.2],[-90.2,72.2],[-89.4,73.1],[-88.4,73.5],[-85.8,73.8],[-86.6,73.2]],[[-100.4,73.8],[-99.2,73.6],[-97.4,73.8],[-97.1,73.5],[-98.1,73.0],[-96.5,72.6],[-96.7,71.7],[-98.4,71.3],[-99.3,71.4],[-100.0,71.7],[-102.5,72.5],[-102.5,72.8],[-100.4,72.7],[-101.5,73.4],[-100.4,73.8]],[[143.6,73.2],[142.1,73.2],[140.0,73.3],[139.9,73.4],[140.8,73.8],[142.1,73.9],[143.5,73.5],[143.6,73.2]],[[-93.2,72.8],[-94.3,72.0],[-95.4,72.1],[-96.0,72.9],[-96.0,73.4],[-95.5,73.9],[-94.5,74.1],[-92.4,74.1],[-90.5,73.9],[-92.0,73.0],[-93.2,72.8]],[[-120.5,71.4],[-123.1,70.9],[-123.6,71.3],[-125.9,71.9],[-125.6,72.2],[-124.8,73.0],[-123.9,73.7],[-124.9,74.3],[-121.5,74.4],[-120.1,74.2],[-117.6,74.2],[-116.6,73.9],[-115.5,73.5],[-116.8,73.2],[-119.2,72.5],[-120.5,71.8],[-120.5,71.4]],[[150.7,75.1],[149.6,74.7],[148.0,74.8],[146.1,75.2],[146.4,75.5],[148.2,75.3],[150.7,75.1]],[[-93.6,75.0],[-94.2,74.6],[-95.6,74.7],[-96.8,74.9],[-96.3,75.4],[-94.9,75.6],[-94.0,75.3],[-93.6,75.0]],[[145.1,75.6],[144.3,74.8],[140.6,74.8],[139.0,74.6],[137.0,75.3],[137.5,75.9],[138.8,76.1],[141.5,76.1],[145.1,75.6]],[[-98.5,76.7],[-97.7,76.3],[-97.7,75.7],[-98.2,75.0],[-99.8,74.9],[-100.9,75.1],[-100.9,75.6],[-102.5,75.6],[-102.6,76.3],[-101.5,76.3],[-100.0,76.6],[-98.6,76.6],[-98.5,76.7]],[[-108.2,76.2],[-107.8,75.8],[-106.9,76.0],[-105.9,76.0],[-105.7,75.5],[-106.3,75.0],[-109.7,74.9],[-112.2,74.4],[-113.7,74.4],[-113.9,74.7],[-111.8,75.2],[-116.3,75.0],[-117.7,75.2],[-116.3,76.2],[-115.4,76.5],[-112.6,76.1],[-110.8,75.5],[-109.1,75.5],[-110.5,76.4],[-109.6,76.8],[-108.6,76.7],[-108.2,76.2]],[[57.5,70.7],[56.9,70.6],[53.7,70.8],[53.4,71.2],[51.6,71.5],[51.5,72.0],[52.5,72.2],[52.4,72.8],[54.4,73.6],[53.5,73.8],[55.9,74.6],[55.6,75.1],[57.9,75.6],[61.2,76.3],[64.5,76.4],[66.2,76.8],[68.2,76.9],[68.9,76.5],[68.2,76.2],[64.6,75.7],[61.6,75.3],[58.5,74.3],[57.0,73.3],[55.4,72.4],[55.6,71.5],[57.5,70.7]],[[-94.7,77.1],[-93.6,76.8],[-91.6,76.8],[-90.7,76.5],[-91.0,76.1],[-89.8,75.8],[-89.2,75.6],[-87.8,75.6],[-86.4,75.5],[-84.8,75.7],[-82.8,75.8],[-81.1,75.7],[-80.1,75.3],[-79.8,74.9],[-80.5,74.7],[-81.9,74.4],[-83.2,74.6],[-86.1,74.4],[-88.1,74.4],[-89.8,74.5],[-92.4,74.8],[-92.8,75.4],[-92.9,75.9],[-93.9,76.3],[-96.0,76.4],[-97.1,76.8],[-96.7,77.2],[-94.7,77.1]],[[-116.2,77.6],[-116.3,76.9],[-117.1,76.5],[-118.0,76.5],[-119.9,76.1],[-121.5,75.9],[-122.9,76.1],[-121.2,76.9],[-119.1,77.5],[-117.6,77.5],[-116.2,77.6]],[[-110.2,77.7],[-112.1,77.4],[-113.5,77.7],[-112.7,78.1],[-111.3,78.2],[-109.9,78.0],[-110.2,77.7]],[[24.7,77.9],[22.5,77.4],[20.7,77.7],[21.4,77.9],[20.8,78.3],[22.9,78.5],[23.3,78.1],[24.7,77.9]],[[-95.8,78.1],[-97.3,77.8],[-98.1,78.1],[-98.6,78.5],[-98.6,78.9],[-97.3,78.8],[-96.8,78.8],[-95.6,78.4],[-95.8,78.1]],[[-100.1,78.3],[-99.7,77.9],[-101.3,78.0],[-102.9,78.3],[-105.2,78.4],[-104.2,78.7],[-105.4,78.9],[-105.5,79.3],[-103.5,79.2],[-100.8,78.8],[-100.1,78.3]],[[105.1,78.3],[99.4,77.9],[101.3,79.2],[102.1,79.3],[102.8,79.3],[105.4,78.7],[105.1,78.3]],[[18.3,79.7],[21.5,79.0],[19.0,78.6],[18.5,77.8],[17.6,77.6],[17.1,76.8],[15.9,76.8],[13.8,77.4],[14.7,77.7],[13.2,78.0],[11.2,78.9],[10.4,79.7],[13.2,80.0],[13.7,79.7],[15.1,79.7],[15.5,80.0],[17.0,80.1],[18.3,79.7]],[[25.4,80.4],[27.4,80.1],[25.9,79.5],[23.0,79.4],[20.1,79.6],[19.9,79.8],[18.5,79.9],[17.4,80.3],[20.5,80.6],[21.9,80.4],[22.9,80.7],[25.4,80.4]],[[51.1,80.5],[49.8,80.4],[48.9,80.3],[48.8,80.2],[47.6,80.0],[46.5,80.2],[47.1,80.6],[44.8,80.6],[46.8,80.8],[48.3,80.8],[48.5,80.5],[49.1,80.8],[50.0,80.9],[51.5,80.7],[51.1,80.5]],[[99.9,78.9],[97.8,78.8],[95.0,79.0],[93.3,79.4],[92.5,80.1],[91.2,80.3],[93.8,81.0],[95.9,81.3],[97.9,80.7],[100.2,79.8],[99.9,78.9]],[[-87.0,79.7],[-85.8,79.3],[-87.2,79.0],[-89.0,78.3],[-90.8,78.2],[-92.9,78.3],[-94.0,78.8],[-93.9,79.1],[-93.1,79.4],[-95.0,79.4],[-96.1,79.7],[-96.7,80.2],[-96.0,80.6],[-95.3,80.9],[-94.3,81.0],[-94.7,81.2],[-92.4,81.3],[-91.1,80.7],[-89.4,80.5],[-87.8,80.3],[-87.0,79.7]],[[-68.5,83.1],[-65.8,83.0],[-63.7,82.9],[-61.9,82.6],[-61.9,82.4],[-64.3,81.9],[-66.8,81.7],[-67.7,81.5],[-65.5,81.5],[-67.8,80.9],[-69.5,80.6],[-71.2,79.8],[-73.2,79.6],[-73.9,79.4],[-76.9,79.3],[-75.5,79.2],[-76.2,79.0],[-75.4,78.5],[-76.3,78.2],[-77.9,77.9],[-78.4,77.5],[-79.8,77.2],[-79.6,77.0],[-77.9,77.0],[-77.9,76.8],[-80.6,76.2],[-83.2,76.5],[-86.1,76.3],[-87.6,76.4],[-89.5,76.5],[-89.6,77.0],[-87.8,77.2],[-88.3,77.9],[-87.6,78.0],[-85.0,77.5],[-86.3,78.2],[-88.0,78.4],[-87.2,78.8],[-85.4,79.0],[-85.1,79.3],[-86.5,79.7],[-86.9,80.3],[-84.2,80.2],[-83.4,80.1],[-81.8,80.5],[-84.1,80.6],[-87.6,80.5],[-89.4,80.9],[-90.2,81.3],[-91.4,81.6],[-91.6,81.9],[-90.1,82.1],[-88.9,82.1],[-87.0,82.3],[-85.5,82.7],[-84.3,82.6],[-83.2,82.3],[-82.4,82.9],[-81.1,83.0],[-79.3,83.1],[-76.3,83.2],[-75.7,83.1],[-72.8,83.2],[-70.7,83.2],[-68.5,83.1]],[[-27.1,83.5],[-20.8,82.7],[-22.7,82.3],[-26.5,82.3],[-31.9,82.2],[-31.4,82.0],[-27.9,82.1],[-24.8,81.8],[-22.9,82.1],[-22.1,81.7],[-23.2,81.2],[-20.6,81.5],[-15.8,81.9],[-12.8,81.7],[-12.2,81.3],[-16.3,80.6],[-16.8,80.3],[-20.0,80.2],[-17.7,80.1],[-18.9,79.4],[-19.7,78.8],[-19.7,77.6],[-18.5,77.0],[-20.0,76.9],[-21.7,76.6],[-19.8,76.1],[-19.6,75.2],[-20.7,75.2],[-19.4,74.3],[-21.6,74.2],[-20.4,73.8],[-20.8,73.5],[-22.2,73.3],[-23.6,73.3],[-22.3,72.6],[-22.3,72.2],[-24.3,72.6],[-24.8,72.3],[-23.4,72.1],[-22.1,71.5],[-21.8,70.7],[-23.5,70.5],[-24.3,70.9],[-25.5,71.4],[-25.2,70.8],[-26.4,70.2],[-23.7,70.2],[-22.3,70.1],[-25.0,69.3],[-27.7,68.5],[-30.7,68.1],[-31.8,68.1],[-32.8,67.7],[-34.2,66.7],[-36.4,66.0],[-37.0,65.9],[-38.4,65.7],[-39.8,65.5],[-40.7,64.8],[-40.7,64.1],[-41.2,63.5],[-42.8,62.7],[-42.4,61.9],[-42.9,61.1],[-43.4,60.1],[-44.8,60.0],[-46.3,60.9],[-48.3,60.9],[-49.2,61.4],[-49.9,62.4],[-51.6,63.6],[-52.1,64.3],[-52.3,65.2],[-53.7,66.1],[-53.3,66.8],[-54.0,67.2],[-53.0,68.4],[-51.5,68.7],[-51.1,69.1],[-50.9,69.9],[-52.0,69.6],[-52.6,69.4],[-53.5,69.3],[-54.7,69.6],[-54.8,70.3],[-54.4,70.8],[-53.4,70.8],[-51.4,70.6],[-53.1,71.2],[-54.0,71.5],[-55.0,71.4],[-55.8,71.7],[-54.7,72.6],[-55.3,73.0],[-56.1,73.7],[-57.3,74.7],[-58.6,75.1],[-58.6,75.5],[-61.3,76.1],[-63.4,76.2],[-66.1,76.1],[-68.5,76.1],[-69.7,76.4],[-71.4,77.0],[-68.8,77.3],[-66.8,77.4],[-71.0,77.6],[-73.3,78.0],[-73.2,78.4],[-69.4,78.9],[-65.7,79.4],[-65.3,79.8],[-68.0,80.1],[-67.1,80.5],[-63.7,81.2],[-62.2,81.3],[-62.6,81.8],[-60.3,82.0],[-57.2,82.2],[-54.1,82.2],[-53.0,81.9],[-50.4,82.4],[-48.0,82.1],[-46.6,82.0],[-44.5,81.7],[-46.9,82.2],[-46.8,82.6],[-43.4,83.2],[-39.9,83.2],[-38.6,83.5],[-35.1,83.6],[-27.1,83.5]]];
/* manchas de paisagem, recortadas pelo contorno da terra */
const BIOMAS = [
  { c:'#E8C27A', p:[[-17,14],[-17,30],[-5,36],[10,37],[33,32],[36,28],[38,18],[32,14],[15,13],[0,14]] },
  { c:'#E8C27A', p:[[35,30],[48,31],[60,26],[57,18],[52,14],[43,12],[38,18]] },
  { c:'#EBCB8A', p:[[52,38],[66,42],[75,44],[90,46],[105,46],[115,42],[110,38],[96,38],[80,36],[62,32],[54,34]] },
  { c:'#E8C27A', p:[[115,-20],[126,-18],[136,-18],[142,-24],[140,-30],[132,-32],[122,-31],[115,-27]] },
  { c:'#E3BE80', p:[[-71,-17],[-69,-17],[-69,-28],[-71,-30]] },
  { c:'#E3BE80', p:[[-118,30],[-108,30],[-104,36],[-110,40],[-118,38]] },
  { c:'#E3BE80', p:[[12,-18],[20,-18],[24,-24],[20,-30],[14,-27]] },
  { c:'#C9D06A', p:[[-17,10],[0,10],[20,10],[38,8],[38,14],[20,14],[0,14],[-17,14]] },
  { c:'#C9D06A', p:[[-58,-12],[-46,-6],[-41,-10],[-42,-17],[-48,-21],[-56,-19]] },
  { c:'#2E9E57', p:[[-79,-2],[-74,4],[-66,5],[-58,4],[-52,2],[-49,-2],[-47,-6],[-52,-10],[-60,-12],[-68,-11],[-74,-8],[-78,-5]] },
  { c:'#2E9E57', p:[[-48,-14],[-39,-12],[-40,-22],[-48,-28],[-50,-24]] },
  { c:'#2E9E57', p:[[9,4],[16,5],[28,4],[30,-2],[26,-6],[16,-6],[11,-2]] },
  { c:'#2E9E57', p:[[95,22],[105,22],[120,10],[125,-2],[118,-8],[104,-6],[96,4]] },
  { c:'#2E9E57', p:[[-170,62],[-60,62],[-55,52],[-80,46],[-125,50],[-150,58]] },
  { c:'#2E9E57', p:[[20,62],[60,62],[100,62],[140,62],[140,54],[100,52],[60,54],[25,56]] },
  { c:'#8FD1A0', p:[[-180,66],[-90,66],[0,68],[90,68],[180,66],[180,85],[-180,85]] },
  { c:'#F4FAFF', p:[[-180,72],[-90,74],[0,76],[90,76],[180,72],[180,86],[-180,86]] },
  { c:'#F4FAFF', p:[[-56,60],[-42,60],[-20,70],[-18,82],[-60,83],[-72,77],[-58,70]] },
  { c:'#F4FAFF', p:[[-180,-60],[0,-60],[180,-60],[180,-90],[-180,-90]] }
];
/* serras, florestas e rios desenhados como pequenos ícones sobre o globo */
const SERRAS = [[-70,-30],[-69,-22],[-72,-40],[-76,-10],[-78,-2],[-108,40],[-114,46],[-120,54],[84,30],[90,29],[78,33],[96,30],[8,46],[44,40],[37,-3],[38,8],[70,38],[100,36]];
const ARVORES = [[-68,-4],[-62,-2],[-56,-5],[-64,-8],[-72,-3],[-58,-9],[18,0],[24,-2],[14,2],[22,3],[104,2],[113,0],[110,-4],[-45,-20],[-120,58],[-90,52],[40,58],[80,58],[110,58]];
const RIOS = [
  [[-73,-4],[-67,-3],[-60,-3],[-55,-2.5],[-50,-1]],
  [[-60,-15],[-57,-21],[-58,-27],[-59,-33]],
  [[32,0],[31,8],[32,16],[31,24],[31,31]],
  [[-95,47],[-91,40],[-90,34],[-90,29]],
  [[26,-8],[22,0],[17,2],[13,-5]],
  [[96,33],[104,29],[112,30],[121,31]]
];
function densificar(pts){
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i+1) % pts.length];
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0]-a[0]), Math.abs(b[1]-a[1])) / 3));
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0]-a[0])*k/n, a[1] + (b[1]-a[1])*k/n]);
  }
  return out;
}
const BIOMAS_D = BIOMAS.map(m => ({ c:m.c, p:densificar(m.p) }));
semente = 31;
const NUV_GLOBO = Array.from({length:20}, () => ({ lon:R(-180,180), lat:R(-55,60), r:R(5,10), e:R(1.5,2.3) }));
const ONDAS = Array.from({length:70}, () => ({ lon:R(-180,180), lat:R(-60,65) }));

const G = { lon0:-55, lat0:12, vel:0.012, arr:null, alvos:[], cv:null, ctx:null, tam:0, dpr:1, t:0 };
function projetar(lon, lat){
  const l = (lon - G.lon0) * RAD, p = lat * RAD, p0 = G.lat0 * RAD;
  const cosc = Math.sin(p0)*Math.sin(p) + Math.cos(p0)*Math.cos(p)*Math.cos(l);
  const x = Math.cos(p)*Math.sin(l), y = Math.cos(p0)*Math.sin(p) - Math.sin(p0)*Math.cos(p)*Math.cos(l);
  return [x, -y, cosc];
}
function caminhoGlobo(ctx, pts, Rr, cx, cy){
  let vis = 0; const pr = pts.map(p => { const q = projetar(p[0], p[1]); if (q[2] > 0) vis++; return q; });
  if (!vis) return false;
  ctx.beginPath();
  pr.forEach((q, i) => {
    let x = q[0], y = q[1];
    if (q[2] <= 0) { const m = Math.hypot(x, y) || 1; x /= m; y /= m; }
    i ? ctx.lineTo(cx + x*Rr, cy + y*Rr) : ctx.moveTo(cx + x*Rr, cy + y*Rr);
  });
  ctx.closePath();
  return true;
}
function montarGlobo(){
  const cv = $('#globo'); G.cv = cv; G.ctx = cv.getContext('2d');
  const ajusta = () => { const r = cv.getBoundingClientRect(); G.dpr = Math.min(2, window.devicePixelRatio || 1); G.tam = r.width; cv.width = r.width * G.dpr; cv.height = r.width * G.dpr; };
  ajusta(); new ResizeObserver(ajusta).observe(cv);
  cv.addEventListener('pointerdown', e => { audio(); G.arr = { x:e.clientX, y:e.clientY, lon:G.lon0, lat:G.lat0, moveu:0 }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    if (!G.arr) { const a = alvoEm(e); cv.style.cursor = a ? 'pointer' : 'grab'; return; }
    const k = 180 / G.tam, dx = e.clientX - G.arr.x, dy = e.clientY - G.arr.y;
    G.arr.moveu = Math.max(G.arr.moveu, Math.hypot(dx, dy));
    G.lon0 = G.arr.lon - dx * k; G.lat0 = Math.max(-40, Math.min(50, G.arr.lat + dy * k));
  });
  cv.addEventListener('pointerup', e => {
    if (G.arr && G.arr.moveu < 8) { const a = alvoEm(e); if (a) viajar(a); }
    G.arr = null;
  });
  cv.addEventListener('pointercancel', () => G.arr = null);
}
function alvoEm(e){
  const r = G.cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  let melhor = null, d0 = 26;
  G.alvos.forEach(a => { const d = Math.hypot(a.x - x, a.y - y); if (d < d0) { d0 = d; melhor = a.p; } });
  return melhor;
}
/* recorta o contorno no horizonte do globo e segue a borda pelo caminho mais curto */
function anelGlobo(path, pts, Rr, cx, cy){
  const n = pts.length, pr = pts.map(p => projetar(p[0], p[1]));
  let ini = pr.findIndex(q => q[2] > 0); if (ini < 0) return false;
  const borda = (a, b, qa, qb) => { const t = qa[2] / (qa[2] - qb[2]); const q = projetar(a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t); const m = Math.hypot(q[0], q[1]) || 1; return Math.atan2(q[1]/m, q[0]/m); };
  let saida = null;
  path.moveTo(cx + pr[ini][0]*Rr, cy + pr[ini][1]*Rr);
  for (let k = 1; k <= n; k++) {
    const ia = (ini + k - 1) % n, ib = (ini + k) % n, qa = pr[ia], qb = pr[ib];
    if (qa[2] > 0 && qb[2] > 0) path.lineTo(cx + qb[0]*Rr, cy + qb[1]*Rr);
    else if (qa[2] > 0) { saida = borda(pts[ia], pts[ib], qa, qb); path.lineTo(cx + Math.cos(saida)*Rr, cy + Math.sin(saida)*Rr); }
    else if (qb[2] > 0) { const ent = borda(pts[ia], pts[ib], qa, qb); let dl = ent - saida; while (dl > Math.PI) dl -= 2*Math.PI; while (dl < -Math.PI) dl += 2*Math.PI; path.arc(cx, cy, Rr, saida, saida + dl, dl < 0); path.lineTo(cx + qb[0]*Rr, cy + qb[1]*Rr); }
  }
  path.closePath(); return true;
}
function desenharGlobo(){
  const ctx = G.ctx, S = G.tam, d = G.dpr; if (!S) return;
  ctx.setTransform(d,0,0,d,0,0); ctx.clearRect(0,0,S,S);
  const cx = S/2, cy = S/2, Rr = S*0.40, u = Rr / 150;
  /* atmosfera */
  let g = ctx.createRadialGradient(cx, cy, Rr*0.92, cx, cy, Rr*1.24);
  g.addColorStop(0, 'rgba(170,228,255,.85)'); g.addColorStop(.4, 'rgba(150,215,255,.35)'); g.addColorStop(1, 'rgba(160,220,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rr*1.24, 0, 7); ctx.fill();
  /* oceano com profundidade */
  g = ctx.createRadialGradient(cx - Rr*.38, cy - Rr*.42, Rr*.05, cx, cy, Rr);
  g.addColorStop(0, '#7FDBFF'); g.addColorStop(.35, '#3BA3EE'); g.addColorStop(.75, '#1F6FD0'); g.addColorStop(1, '#123C96');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.clip();
  /* paralelos e meridianos bem leves */
  ctx.strokeStyle = 'rgba(255,255,255,.09)'; ctx.lineWidth = 1;
  for (let lat = -60; lat <= 60; lat += 30) { const pts = []; for (let l = -180; l <= 180; l += 6) pts.push([l, lat]); if (caminhoGlobo(ctx, pts, Rr, cx, cy)) ctx.stroke(); }
  /* marolas no mar */
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.2*u; ctx.lineCap = 'round';
  ONDAS.forEach(o => { const q = projetar(o.lon, o.lat); if (q[2] <= .25) return; const x = cx + q[0]*Rr, y = cy + q[1]*Rr, w = 4*u*q[2]; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w/2, y - w*.5, x, y); ctx.quadraticCurveTo(x + w/2, y - w*.5, x + w, y); ctx.stroke(); });
  /* terra: um caminho só, para sombra, plataforma rasa, contorno e recorte */
  const terra = new Path2D(); TERRAS.forEach(t => anelGlobo(terra, t, Rr, cx, cy));
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(150,235,255,.55)'; ctx.lineWidth = 9*u; ctx.stroke(terra);
  ctx.strokeStyle = 'rgba(200,245,255,.6)'; ctx.lineWidth = 4*u; ctx.stroke(terra);
  ctx.save(); ctx.translate(1.6*u, 2.6*u); ctx.fillStyle = 'rgba(10,50,110,.45)'; ctx.fill(terra); ctx.restore();
  g = ctx.createLinearGradient(cx, cy - Rr, cx, cy + Rr); g.addColorStop(0, '#6ACF6E'); g.addColorStop(.5, '#4CBF64'); g.addColorStop(1, '#5CC86A');
  ctx.fillStyle = g; ctx.fill(terra);
  ctx.save(); ctx.clip(terra);
  ctx.filter = `blur(${(2.2*u).toFixed(1)}px)`;
  BIOMAS_D.forEach(m => { const p = new Path2D(); if (anelGlobo(p, m.p, Rr, cx, cy)) { ctx.fillStyle = m.c; ctx.fill(p); } });
  ctx.filter = 'none';
  /* rios */
  ctx.strokeStyle = '#3D9BFF'; ctx.lineWidth = 1.8*u; ctx.lineCap = 'round';
  RIOS.forEach(r => { let ok = true; ctx.beginPath(); r.forEach((p, i) => { const q = projetar(p[0], p[1]); if (q[2] <= .05) ok = false; const x = cx + q[0]*Rr, y = cy + q[1]*Rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); if (ok) ctx.stroke(); });
  /* florestas: copinhas */
  ARVORES.forEach(([lon, lat]) => { const q = projetar(lon, lat); if (q[2] <= .2) return; const x = cx + q[0]*Rr, y = cy + q[1]*Rr, r = 3.4*u*Math.sqrt(q[2]);
    ctx.fillStyle = '#1C7A42'; ctx.beginPath(); ctx.arc(x - r*.7, y + r*.2, r*.8, 0, 7); ctx.arc(x + r*.7, y + r*.2, r*.8, 0, 7); ctx.arc(x, y - r*.4, r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(190,255,190,.5)'; ctx.beginPath(); ctx.arc(x - r*.3, y - r*.7, r*.35, 0, 7); ctx.fill(); });
  /* serras com neve no pico */
  SERRAS.forEach(([lon, lat]) => { const q = projetar(lon, lat); if (q[2] <= .2) return; const x = cx + q[0]*Rr, y = cy + q[1]*Rr, h = 7*u*Math.sqrt(q[2]), w = h*.8;
    ctx.fillStyle = '#9C7650'; ctx.beginPath(); ctx.moveTo(x - w, y + h*.35); ctx.lineTo(x, y - h*.65); ctx.lineTo(x + w, y + h*.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7A5A3A'; ctx.beginPath(); ctx.moveTo(x, y - h*.65); ctx.lineTo(x + w, y + h*.35); ctx.lineTo(x + w*.2, y + h*.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x - w*.32, y - h*.24); ctx.lineTo(x, y - h*.65); ctx.lineTo(x + w*.32, y - h*.24); ctx.lineTo(x + w*.1, y - h*.32); ctx.lineTo(x - w*.08, y - h*.2); ctx.closePath(); ctx.fill(); });
  ctx.restore();
  ctx.strokeStyle = '#1F6E3C'; ctx.lineWidth = 1.5*u; ctx.stroke(terra);
  /* nuvens fofinhas com sombra */
  NUV_GLOBO.forEach(n => {
    const q = projetar(n.lon + G.t*0.004, n.lat); if (q[2] <= 0.05) return;
    const x = cx + q[0]*Rr, y = cy + q[1]*Rr, a = Math.min(1, q[2]*2), r = n.r*u*Math.pow(q[2], .35), sx = n.e;
    const bolinhas = (dx, dy) => { ctx.beginPath(); ctx.ellipse(x + dx - r*sx*.45, y + dy + r*.15, r*.75*sx*.6, r*.7, 0, 0, 7); ctx.ellipse(x + dx + r*sx*.45, y + dy + r*.2, r*.7*sx*.6, r*.65, 0, 0, 7); ctx.ellipse(x + dx, y + dy - r*.15, r*sx*.55, r*.9, 0, 0, 7); ctx.fill(); };
    ctx.globalAlpha = .28*a; ctx.fillStyle = '#0A2E70'; bolinhas(2.5*u, 4*u);
    ctx.globalAlpha = .92*a; ctx.fillStyle = '#FFFFFF'; bolinhas(0, 0);
  });
  ctx.globalAlpha = 1;
  /* luz e sombra da esfera */
  g = ctx.createRadialGradient(cx - Rr*.32, cy - Rr*.38, Rr*.05, cx, cy, Rr*1.02);
  g.addColorStop(0, 'rgba(255,255,255,.30)'); g.addColorStop(.35, 'rgba(255,255,255,.04)'); g.addColorStop(.7, 'rgba(10,25,90,.06)'); g.addColorStop(.9, 'rgba(10,25,90,.28)'); g.addColorStop(1, 'rgba(10,25,90,.55)');
  ctx.fillStyle = g; ctx.fillRect(cx-Rr, cy-Rr, Rr*2, Rr*2);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(cx - Rr*.42, cy - Rr*.5, Rr*.16, Rr*.08, -.6, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.stroke();
  G.alvos = [];
  const pulso = (Math.sin(G.t/260) + 1) / 2;
  PARADAS.filter(p => !p.semPino).forEach(p => {
    const q = projetar(p.lon, p.lat); if (q[2] <= 0.12) return;
    const x = cx + q[0]*Rr, y = cy + q[1]*Rr, a = Math.min(1, (q[2]-0.12)*4);
    ctx.globalAlpha = a;
    if (p.aberta) {
      ctx.fillStyle = 'rgba(255,200,61,' + (0.5*(1-pulso)) + ')'; ctx.beginPath(); ctx.arc(x, y, 10 + 13*pulso, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(10,20,64,.3)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 8, 3.4, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#12235A'; ctx.beginPath(); ctx.arc(x, y - 13, 12.5, 0, 7); ctx.moveTo(x - 7.5, y - 5.5); ctx.lineTo(x, y + 2); ctx.lineTo(x + 7.5, y - 5.5); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - 13, 11, 0, 7); ctx.moveTo(x - 6.2, y - 6); ctx.lineTo(x, y + .2); ctx.lineTo(x + 6.2, y - 6); ctx.fill();
      ctx.fillStyle = p.cor; ctx.beginPath(); ctx.arc(x, y - 13, 7.6, 0, 7); ctx.fill();
      ctx.fillStyle = estado.carimbos[p.id] ? '#FFC83D' : 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(x - 2, y - 15, estado.carimbos[p.id] ? 3 : 2.3, 0, 7); ctx.fill();
      G.alvos.push({ x, y: y - 10, p });
    } else {
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.strokeStyle = 'rgba(18,35,90,.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 4.2, 0, 7); ctx.fill(); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

let globoAtivo = true, girando = true, ultT = 0;
function girar(t){
  if (!globoAtivo) { ultT = 0; girando = false; return; }
  const dt = ultT ? Math.min(50, t - ultT) : 16; ultT = t; G.t += dt;
  if (!G.arr) G.lon0 -= G.vel * dt;
  desenharGlobo();
  requestAnimationFrame(girar);
}


function montarTrilha(){
  contar();
  $('#trilha').innerHTML = PARADAS.map(p => {
    const feito = estado.carimbos[p.id];
    const thumb = p.aberta ? (p.capa ? `<div class="thumb capa"><svg viewBox="0 0 170 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use class="sem" href="#${p.capa}"/></svg></div>` : `<div class="thumb" style="background:${p.fundo}">${figSvg(p.thumb[0], p.thumb[1])}</div>`) : `<div class="thumb">${mini(p.mini, '#ddd')}</div>`;
    const selo = p.aberta ? (feito ? '<span class="selo feito">Carimbado</span>' : '') : '<span class="selo">Em breve</span>';
    return p.aberta
      ? `<button class="parada" data-id="${p.id}">${thumb}${selo}<h3>${p.nome}</h3><span class="lugar">${p.lugar}</span></button>`
      : `<div class="parada fechada" aria-disabled="true">${thumb}${selo}<h3>${p.nome}</h3><span class="lugar">${p.lugar}</span></div>`;
  }).join('');
  document.querySelectorAll('.parada[data-id]').forEach(b => b.onclick = () => viajar(PARADAS.find(p => p.id === b.dataset.id)));
}

/* ================= viagem até a parada ================= */
function viajar(p){
  audio(); toca('pop');
  const v = document.createElement('div'); v.className = 'viagem';
  v.innerHTML = `<div class="viagem-ceu"><svg class="v-nuvem n1" viewBox="0 0 130 64"><use href="#nuvem" style="color:#fff"/></svg><svg class="v-nuvem n2" viewBox="0 0 130 64"><use href="#nuvem" style="color:#fff"/></svg><svg class="v-pingo" viewBox="-8 -6 136 166"><use href="#pingo"/></svg><p>Chovendo em <b>${p.nome}</b>...</p></div>`;
  document.body.appendChild(v);
  setTimeout(() => abrirParada(p), 650);
  setTimeout(() => v.classList.add('sai'), 1300);
  setTimeout(() => v.remove(), 1800);
}

/* ================= tela da parada ================= */
function abrirParada(p){
  ir('t-parada');
  $('#p-nome').textContent = p.nome; $('#p-lugar').textContent = p.lugar;
  $('#p-avatar').innerHTML = p.amigo.svg;
  const palco = $('#palco'); palco.innerHTML = ''; $('#p-acoes').innerHTML = '';
  let encerrada = false;
  const api = {
    diz: (txt, ops) => { if (!encerrada) bolha($('#p-fala'), txt, p.amigo.nome, true); },
    botoes: lista => { const a = $('#p-acoes'); a.innerHTML = ''; lista.forEach(b => { const e = document.createElement('button'); e.className = 'btn ' + (b.cls || ''); e.textContent = b.txt; e.onclick = b.fn; a.appendChild(e); }); },
    figurinha: id => ganharFig(p, id),
    fim: () => { if (encerrada) return; encerrada = true; concluir(p); },
    hud: html => { let h = palco.querySelector('.hud'); if (!h) { h = document.createElement('div'); h.className = 'hud'; palco.appendChild(h); } h.innerHTML = html; }
  };
  palco.onclick = e => { const f = e.target.closest('[data-fig]'); if (f) api.figurinha(f.dataset.fig); };
  limpar = JOGOS[p.id](palco, api, p);
}

/* figurinhas */
let toastT = null;
function ganharFig(p, id){
  const f = p.figs.find(f => f.id === id); if (!f) return;
  const nova = !estado.figs[id];
  estado.figs[id] = true; salvar(); contar();
  toca(nova ? 'fig' : 'pop');
  const t = $('#toast');
  t.innerHTML = `<div class="fig">${figSvg(f.sym, f.vb)}</div><div><b>${nova ? 'Figurinha nova! ' : ''}${f.nome}</b><p>${f.fato}</p></div>`;
  t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  falar(f.nome + '. ' + f.fato, 'intercala');
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 6500);
}
$('#toast').onclick = () => $('#toast').hidden = true;

/* carimbo */
function carimboSVG(p, comData){
  let roseta = ''; for (let k = 0; k <= 48; k++) { const a = k / 48 * Math.PI * 2, r = k % 2 ? 55 : 58.5; roseta += (k ? ' L' : 'M') + (60 + Math.cos(a) * r).toFixed(1) + ' ' + (60 + Math.sin(a) * r).toFixed(1); }
  const nome = p.nome.toUpperCase(), fs = nome.length <= 9 ? 12.5 : nome.length <= 13 ? 11.5 : 10.5;
  const sym = p.aberta ? `<clipPath id="cc-${p.id}"><circle cx="60" cy="60" r="36"/></clipPath><g clip-path="url(#cc-${p.id})"><use href="#${p.thumb[0]}" x="36" y="35" width="48" height="50"/></g>` : `<text x="60" y="74" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="38" fill="currentColor">?</text>`;
  const data = comData || 'a carimbar';
  return `<svg viewBox="0 0 120 120" style="color:${p.cor}" aria-hidden="true"><g transform="rotate(-8 60 60)">
    <path d="${roseta}Z" fill="currentColor"/><circle cx="60" cy="60" r="53" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 3" opacity=".7"/>
    <circle cx="60" cy="60" r="38" fill="${p.fundo || '#F4F7FB'}" stroke="#fff" stroke-width="3"/>
    <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
    <path id="arco-${p.id}" d="M19.2 79 A45 45 0 1 1 100.8 79" fill="none"/><path id="arcob-${p.id}" d="M16.7 85 A50 50 0 0 0 103.3 85" fill="none"/>
    <text font-family="Baloo 2, sans-serif" font-weight="800" font-size="${fs}" letter-spacing=".8" fill="#fff"><textPath href="#arco-${p.id}" startOffset="50%" text-anchor="middle">${nome}</textPath></text>
    <text font-family="Andika, sans-serif" font-weight="700" font-size="8.4" letter-spacing=".5" fill="#fff"><textPath href="#arcob-${p.id}" startOffset="50%" text-anchor="middle">${data}</textPath></text>
    ${sym}</g></svg>`;
}
function concluir(p){
  const primeira = !estado.carimbos[p.id];
  estado.carimbos[p.id] = new Date().toLocaleDateString('pt-BR'); salvar(); contar();
  toca('vitoria'); setTimeout(() => toca('carimbo'), 500); confete();
  const prox = abertas.find(q => !estado.carimbos[q.id]);
  modal(`<h2>${primeira ? 'Carimbo novo!' : 'Parada concluída!'}</h2>
    <div class="carimbo">${carimboSVG(p, estado.carimbos[p.id])}</div>
    <p class="nota">${p.fato}</p>
    <div class="acoes"><button class="btn claro peq" id="m-pass">Ver passaporte</button>${prox ? `<button class="btn azul peq" id="m-prox">Ir para ${prox.nome}</button>` : `<button class="btn azul peq" id="m-planeta">Voltar ao planeta</button>`}</div>`);
  falar(p.fato, 'depois');
  $('#m-pass').onclick = () => { fecharModal(); abrirLivro('pass'); };
  if (prox) $('#m-prox').onclick = () => { fecharModal(); viajar(prox); };
  else $('#m-planeta').onclick = () => { fecharModal(); ir('t-planeta'); };
}
function modal(html){ $('#modal-c').innerHTML = html; $('#modal').hidden = false; }
function fecharModal(){ $('#modal').hidden = true; calar(); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') fecharModal(); });

function confete(){
  const c = document.createElement('canvas'); c.className = 'confete'; document.body.appendChild(c);
  const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  const x = c.getContext('2d'); x.scale(dpr, dpr);
  const cores = ['#FFC83D','#FF6B5A','#2E7BF6','#22A565','#7CCBFF','#fff'];
  const ps = Array.from({length:110}, () => ({ x:innerWidth/2 + sorte(-60,60), y:innerHeight*0.45, vx:sorte(-7,7), vy:sorte(-15,-5), r:sorte(4,8), c:cores[Math.floor(Math.random()*cores.length)], a:sorte(0,6), gota:Math.random()<.4 }));
  let t0 = performance.now();
  (function quadro(t){
    x.clearRect(0,0,innerWidth,innerHeight);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += .1;
      x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle = p.c;
      if (p.gota) { x.beginPath(); x.moveTo(0,-p.r*1.4); x.quadraticCurveTo(p.r,0,0,p.r); x.quadraticCurveTo(-p.r,0,0,-p.r*1.4); x.fill(); } else x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);
      x.restore(); });
    if (t - t0 < 2600) requestAnimationFrame(quadro); else c.remove();
  })(t0);
}

/* ================= passaporte e álbum ================= */
function abrirLivro(aba){
  ir('t-livro');
  const mostra = qual => {
    $('#aba-pass').setAttribute('aria-selected', qual === 'pass'); $('#aba-album').setAttribute('aria-selected', qual === 'album');
    if (qual === 'pass') {
      $('#livro').innerHTML = `<h2 style="font-size:1.8rem;margin-bottom:6px">Passaporte do Pingo</h2><p style="color:var(--tinta2);margin-bottom:16px">Cada parada concluída ganha um carimbo.</p>
        <div class="carimbos">${PARADAS.map(p => `<div class="slot-carimbo ${estado.carimbos[p.id] ? '' : 'vazio'}">${carimboSVG(p, estado.carimbos[p.id])}<span>${p.nome}</span></div>`).join('')}</div>`;
    } else {
      $('#livro').innerHTML = `<h2 style="font-size:1.8rem;margin-bottom:6px">Álbum de figurinhas</h2><p style="color:var(--tinta2);margin-bottom:16px">Toque nos bichos, plantas e lugares escondidos nas paradas para ganhar figurinhas.</p>
        <div class="album">${abertas.map(p => `<div><h3>${p.nome}</h3><div class="figs">${p.figs.map(f => estado.figs[f.id]
          ? `<button class="fig-slot" data-p="${p.id}" data-f="${f.id}">${figSvg(f.sym, f.vb)}<span>${f.nome}</span></button>`
          : `<div class="fig-slot falta">${figSvg(f.sym, f.vb)}<span>?</span></div>`).join('')}</div></div>`).join('')}</div>`;
      document.querySelectorAll('.fig-slot[data-f]').forEach(b => b.onclick = () => { const f = PARADAS.find(p => p.id === b.dataset.p).figs.find(f => f.id === b.dataset.f); falar(f.nome + '. ' + f.fato); });
    }
  };
  $('#aba-pass').onclick = () => mostra('pass'); $('#aba-album').onclick = () => mostra('album');
  mostra(aba);
}

/* ================= ferramentas de cena ================= */
function criarCena(palco, svg){
  palco.insertAdjacentHTML('beforeend', svg);
  const s = palco.querySelector('svg');
  const cv = document.createElement('canvas'); palco.appendChild(cv);
  const ctx = cv.getContext('2d');
  let esc = 1;
  const ajusta = () => { const r = palco.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; esc = cv.width / 800; };
  ajusta();
  const ro = new ResizeObserver(ajusta); ro.observe(palco);
  const pts = []; let raf = 0, vivo = true, extra = null;
  const ponto = e => { const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(s.getScreenCTM().inverse()); };
  function quadro(){
    if (!vivo) return;
    ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cv.width,cv.height); ctx.setTransform(esc,0,0,esc,0,0);
    if (extra) extra(ctx);
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]; p.t += 1;
      if (p.tipo === 'vapor') {
        const k = Math.min(1, p.t / p.dur), e = k*k*(3-2*k);
        p.x = p.x0 + (p.x1 - p.x0) * e + Math.sin(p.t/7 + p.f) * 8 * (1-k);
        p.y = p.y0 + (p.y1 - p.y0) * e;
        ctx.globalAlpha = 0.75 * (1 - k*0.6); ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.6 + k*0.8), 0, 7); ctx.fill();
        if (k >= 1) { pts.splice(i,1); p.chega && p.chega(); }
      } else if (p.tipo === 'chuva') {
        p.y += p.vy; p.x += p.vx;
        ctx.globalAlpha = .8; ctx.strokeStyle = p.cor || '#2E7BF6'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx*2, p.y - 12); ctx.stroke();
        if (p.y > p.chao) { pts.splice(i,1); if (Math.random() < .5) pts.push({ tipo:'respingo', x:p.x, y:p.chao, t:0, cor:p.cor }); }
      } else if (p.tipo === 'respingo') {
        ctx.globalAlpha = 1 - p.t/14; ctx.strokeStyle = p.cor || '#2E7BF6'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 2 + p.t*.8, 1 + p.t*.25, 0, 0, 7); ctx.stroke();
        if (p.t > 14) pts.splice(i,1);
      } else if (p.tipo === 'bolha') {
        p.y -= p.vy; p.x += Math.sin(p.t/6 + p.f) * .6;
        ctx.globalAlpha = .8; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.stroke();
        if (p.y < p.topo || p.t > 120) pts.splice(i,1);
      } else if (p.tipo === 'floco') {
        p.y += p.vy; p.x += Math.sin(p.t/18 + p.f) * .7;
        ctx.globalAlpha = .95; ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#A8C8E6'; ctx.lineWidth = .7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r || 2.4, 0, 7); ctx.fill(); ctx.stroke();
        if (p.y > p.chao) pts.splice(i,1);
      } else if (p.tipo === 'petala') {
        p.y += p.vy; p.x += Math.sin(p.t/14 + p.f) * 1.2;
        ctx.globalAlpha = 1; ctx.fillStyle = p.cor; ctx.strokeStyle = p.borda || '#9E2E6A'; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 4.5, 2.6, Math.sin(p.t/10 + p.f), 0, 7); ctx.fill(); ctx.stroke();
        if (p.y > p.chao) pts.splice(i,1);
      } else if (p.tipo === 'infiltra') {
        const k = Math.min(1, p.t / p.dur), e = k*k*(3-2*k);
        p.x = p.x0 + (p.x1 - p.x0) * e + Math.sin(p.t/6 + p.f) * 3; p.y = p.y0 + (p.y1 - p.y0) * e;
        ctx.globalAlpha = .9; ctx.fillStyle = '#2E7BF6'; ctx.strokeStyle = '#E9F6FF'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - 6); ctx.quadraticCurveTo(p.x + 4.5, p.y, p.x, p.y + 4); ctx.quadraticCurveTo(p.x - 4.5, p.y, p.x, p.y - 6); ctx.fill(); ctx.stroke();
        if (k >= 1) { pts.splice(i,1); p.chega && p.chega(); }
      } else if (p.tipo === 'semente') {
        p.vy = Math.min(7, p.vy + .25); p.y += p.vy; p.x += Math.sin(p.t/5) * .8;
        ctx.globalAlpha = 1; ctx.fillStyle = '#7A4A22'; ctx.strokeStyle = '#3E230E'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 4.5, 6.5, Math.sin(p.t/6)*.6, 0, 7); ctx.fill(); ctx.stroke();
        if (p.y >= p.alvoY) { pts.splice(i,1); for (let j = 0; j < 6; j++) pts.push({ tipo:'respingo', x:p.x + sorte(-4,4), y:p.alvoY, t:j, cor:'#8B5A2B' }); p.chega && p.chega(); }
      } else if (p.tipo === 'brilho') {
        const k = p.t / 30; ctx.globalAlpha = 1 - k; ctx.fillStyle = p.cor || '#FFC83D';
        ctx.beginPath(); for (let j = 0; j < 4; j++) { const a = j * Math.PI/2; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.cos(a)*14*k + Math.cos(a+.3)*3, p.y + Math.sin(a)*14*k + Math.sin(a+.3)*3); ctx.lineTo(p.x + Math.cos(a)*14*k*1.3, p.y + Math.sin(a)*14*k*1.3); } ctx.fill();
        if (p.t > 30) pts.splice(i,1);
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(quadro);
  }
  raf = requestAnimationFrame(quadro);
  return {
    svg: s, ponto, pts,
    add: p => pts.push(Object.assign({ t:0 }, p)),
    chover: (x0, x1, y0, chao, n, cor) => { for (let i = 0; i < n; i++) setTimeout(() => vivo && pts.push({ tipo:'chuva', t:0, x:sorte(x0,x1), y:y0 + sorte(-10,10), vx:-.6, vy:sorte(9,13), chao:chao + sorte(-8,8), cor }), i * (2200/n)); },
    brilhos: (x, y, n, cor) => { for (let i = 0; i < n; i++) pts.push({ tipo:'brilho', t:-i*3, x:x + sorte(-30,30), y:y + sorte(-20,20), cor }); },
    desenho: fn => extra = fn,
    parar: () => { vivo = false; cancelAnimationFrame(raf); ro.disconnect(); }
  };
}
const el = (s, sel) => s.querySelector(sel);
const brilhoHotspot = (x, y) => `<g pointer-events="none" class="brilho"><path d="M${x} ${y-9} L${x+2.5} ${y-2.5} L${x+9} ${y} L${x+2.5} ${y+2.5} L${x} ${y+9} L${x-2.5} ${y+2.5} L${x-9} ${y} L${x-2.5} ${y-2.5}Z" fill="#fff"/></g>`;

/* ================= JOGO 1: Amazônia, rios voadores ================= */
/* ================= JOGO 1: Amazônia, a fábrica de chuva ================= */
function silhueta(x0, x1, base, amp, passo, sem){
  semente = sem; let d = `M${x0} 520 L${x0} ${base}`, x = x0;
  while (x < x1) { const w = passo * R(.6, 1.4), h = amp * R(.45, 1.25); d += ` Q${(x + w/2).toFixed(1)} ${(base - h*2).toFixed(1)} ${(x + w).toFixed(1)} ${(base + R(-3,3)).toFixed(1)}`; x += w; }
  return d + ` L${x1} 520Z`;
}
function copa(cx, cy, rx, ry, n, amp){
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n * Math.PI * 2, x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (!i) { d = `M${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
    const tm = (i - .5) / n * Math.PI * 2, k = 1 + (amp || .28) * R(.7, 1.2);
    d += ` Q${(cx + Math.cos(tm) * rx * k).toFixed(1)} ${(cy + Math.sin(tm) * ry * k).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + 'Z';
}
function textura(cx, cy, rx, ry, n, cor, larg){
  let d = '';
  for (let i = 0; i < n; i++) { const t = R(0, 6.28), r = Math.sqrt(R(0, 1)), x = cx + Math.cos(t) * rx * r, y = cy + Math.sin(t) * ry * r, w = R(3, 5.5); d += `M${(x - w).toFixed(1)} ${y.toFixed(1)} q${w.toFixed(1)} ${(-w * .9).toFixed(1)} ${(w * 2).toFixed(1)} 0 `; }
  return `<path d="${d}" stroke="${cor}" stroke-width="${larg || 1.5}" fill="none" stroke-linecap="round"/>`;
}
semente = 41;
const DEFS_AMZ = `
  <linearGradient id="aCeuDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB4F5"/><stop offset=".55" stop-color="#A9DDFB"/><stop offset="1" stop-color="#FFF1CF"/></linearGradient>
  <linearGradient id="aCeuAlva" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27346E"/><stop offset=".5" stop-color="#9A5C8C"/><stop offset=".85" stop-color="#F59A6B"/><stop offset="1" stop-color="#FFD39A"/></linearGradient>
  <radialGradient id="aSolBrilho"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE27A" stop-opacity=".5"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
  <radialGradient id="aSolDisco" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".6" stop-color="#FFD84D"/><stop offset="1" stop-color="#FFB52E"/></radialGradient>
  <linearGradient id="aRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8E2EC"/><stop offset=".4" stop-color="#6FB6CF"/><stop offset="1" stop-color="#3C88A8"/></linearGradient>
  <linearGradient id="aMargem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E8A4E"/><stop offset=".5" stop-color="#2A6E3E"/><stop offset="1" stop-color="#1A4E2E"/></linearGradient>
  <linearGradient id="aNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="aTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8977F"/><stop offset=".45" stop-color="#E6DAC7"/><stop offset="1" stop-color="#9A8870"/></linearGradient>
  <radialGradient id="aVinheta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#0A1A2E" stop-opacity="0"/><stop offset="1" stop-color="#0A1A2E" stop-opacity=".35"/></radialGradient>
  <linearGradient id="aRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>
  <filter id="aDesfoca" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="aSombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="aGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
  <symbol id="sumauma" viewBox="0 0 160 200">
    <ellipse cx="80" cy="196" rx="54" ry="6" fill="#0D3B22" opacity=".3"/>
    <path d="M30 200 C50 197 64 186 71 160 L74 200Z M130 200 C110 197 96 186 89 160 L86 200Z" fill="#C2B196" stroke="#6E5B45" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M50 200 C63 194 70 180 72 150 C73 128 74 110 76 92 L84 92 C86 110 87 128 88 150 C90 180 97 194 110 200Z" fill="url(#aTronco)" stroke="#6E5B45" stroke-width="2" stroke-linejoin="round"/>
    <path d="M79 100 V146 M83 108 q1.5 22 0 44 M66 192 q6 -10 6 -26 M94 192 q-6 -10 -6 -26 M76 160 q-1 12 -4 22" stroke="#8C7A62" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <g fill="none" stroke-linecap="round"><path d="M80 104 Q60 90 40 84 M80 104 Q100 88 122 82 M80 98 Q79 80 82 62" stroke="#6E5B45" stroke-width="6"/><path d="M80 104 Q60 90 40 84 M80 104 Q100 88 122 82 M80 98 Q79 80 82 62" stroke="#BFAE94" stroke-width="2.4"/></g>
    <path d="M104 88 C106 104 102 120 106 136" stroke="#3E7A3A" stroke-width="1.6" fill="none"/><g fill="#4FA35A">${[96,108,120,132].map((y,i) => `<ellipse cx="${i%2 ? 108 : 102}" cy="${y}" rx="3.2" ry="2" transform="rotate(${i%2 ? 30 : -30} ${i%2 ? 108 : 102} ${y})"/>`).join('')}</g>
    <g fill="#175A35" stroke="#0C3F23" stroke-width="2" stroke-linejoin="round"><path d="${copa(40,84,32,15,9)}"/><path d="${copa(122,82,32,15,9)}"/><path d="${copa(80,90,46,14,12)}"/></g>
    ${textura(80,88,50,10,14,'#0F4A2A')}
    <g fill="#23824C" stroke="#145C33" stroke-width="2" stroke-linejoin="round"><path d="${copa(50,66,32,18,10)}"/><path d="${copa(110,64,32,18,10)}"/><path d="${copa(80,60,40,20,12)}"/></g>
    ${textura(80,64,52,14,22,'#176B3D')}
    <g fill="#39A764" stroke="#1E7B45" stroke-width="1.8" stroke-linejoin="round"><path d="${copa(62,46,25,14,9)}"/><path d="${copa(100,44,25,14,9)}"/><path d="${copa(80,36,29,15,10)}"/></g>
    ${textura(80,42,34,10,14,'#2A8C50',1.3)}
    <g stroke="#B6F2C4" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"><path d="M64 28 q10 -7 22 -3"/><path d="M92 34 q7 -4 14 -1"/><path d="M36 56 q6 -4 12 -2"/><path d="M98 56 q7 -4 14 -1"/></g>
    <ellipse cx="80" cy="97" rx="50" ry="5" fill="#0A3A20" opacity=".35"/>
  </symbol>
  <symbol id="clareira" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="56" ry="10" fill="#8E5E34" stroke="#5E3A1C" stroke-width="1.6"/><ellipse cx="80" cy="191" rx="48" ry="6" fill="#A8743F"/>
    <path d="M52 192 L54 172 L70 172 L72 192Z M92 192 L94 178 L106 178 L108 192Z" fill="#7A4A2A" stroke="#4E2E18" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="62" cy="172" rx="8" ry="3" fill="#E2AE76" stroke="#4E2E18" stroke-width="1.4"/><ellipse cx="100" cy="178" rx="6" ry="2.4" fill="#E2AE76" stroke="#4E2E18" stroke-width="1.4"/>
    <ellipse cx="62" cy="172" rx="4" ry="1.4" fill="none" stroke="#B9834E" stroke-width="1"/><ellipse cx="100" cy="178" rx="3" ry="1.1" fill="none" stroke="#B9834E" stroke-width="1"/>
    <path d="M57 180 v8 M66 182 v8 M97 184 v6" stroke="#5E361C" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M30 194 q3 -9 6 0 M124 194 q3 -10 6 0 M80 196 q2 -6 4 0" stroke="#4E7A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="broto" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="56" ry="10" fill="#8E5E34" stroke="#5E3A1C" stroke-width="1.6"/><ellipse cx="80" cy="191" rx="48" ry="6" fill="#A8743F"/>
    <path d="M80 192 C80 182 81 176 80 166" stroke="#2F7A34" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 192 C80 182 81 176 80 166" stroke="#5FBF5A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M80 176 C68 176 60 168 58 158 C72 156 79 165 80 176Z" fill="#5FD483" stroke="#2B8A4A" stroke-width="1.6" stroke-linejoin="round"/><path d="M80 176 C72 172 66 166 61 160" stroke="#2B8A4A" stroke-width="1.2" fill="none"/>
    <path d="M80 170 C90 168 99 160 102 149 C88 149 81 158 80 170Z" fill="#43C06C" stroke="#237A40" stroke-width="1.6" stroke-linejoin="round"/><path d="M80 170 C88 164 95 157 99 152" stroke="#237A40" stroke-width="1.2" fill="none"/>
  </symbol>
  <symbol id="arvoreta" viewBox="0 0 160 200">
    <ellipse cx="80" cy="194" rx="50" ry="8" fill="#5E7A2A" opacity=".45"/>
    <path d="M76 196 C77 176 77 158 78 138 L83 138 C84 158 84 176 85 196Z" fill="url(#aTronco)" stroke="#6E5B45" stroke-width="1.6"/>
    <path d="M80 160 Q70 152 64 146 M81 154 Q92 146 96 140" stroke="#6E5B45" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#23824C" stroke="#145C33" stroke-width="1.8" stroke-linejoin="round"><path d="${copa(64,142,20,12,8)}"/><path d="${copa(96,140,20,12,8)}"/></g>
    <path d="${copa(80,126,24,14,9)}" fill="#39A764" stroke="#1E7B45" stroke-width="1.8" stroke-linejoin="round"/>
    ${textura(80,134,30,12,10,'#1D7A44',1.3)}
    <path d="M70 118 q8 -6 18 -2" stroke="#B6F2C4" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  </symbol>
  <symbol id="arara-voa" viewBox="0 0 130 80">
    <path d="M46 44 C30 50 14 58 0 62 C10 52 26 44 42 38Z" fill="#E23A2E" stroke="#7A1410" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M44 42 C30 46 16 52 4 56" stroke="#2E7BF6" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M2 61 L12 56" stroke="#2E7BF6" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 40 C46 30 60 28 74 32 C82 36 84 46 76 50 C64 54 50 52 40 40Z" fill="#E5392C" stroke="#7A1410" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M50 46 q8 3 18 1" stroke="#B3221A" stroke-width="1.4" fill="none"/>
    <g class="asa"><path d="M54 36 C46 16 54 2 72 0 C80 8 76 22 68 38Z" fill="#2E7BF6" stroke="#123E8E" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M56 34 C52 20 58 10 68 6 C70 16 68 26 64 36Z" fill="#FFC83D" stroke="#B07A00" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M58 34 C57 26 59 20 63 16 C64 24 63 30 62 35Z" fill="#E5392C"/>
      <path d="M62 4 L58 12 M70 3 L66 12 M76 8 L70 15" stroke="#123E8E" stroke-width="1.2" stroke-linecap="round"/></g>
    <circle cx="86" cy="34" r="12" fill="#E5392C" stroke="#7A1410" stroke-width="1.6"/>
    <path d="M86 28 C94 26 98 32 96 40 C92 42 88 40 86 36Z" fill="#fff" stroke="#C9C1B4" stroke-width="1"/><path d="M89 34 h5 M90 37 h4" stroke="#B9B0A2" stroke-width=".8"/>
    <circle cx="90" cy="32" r="2.6" fill="#12235A"/><circle cx="90.8" cy="31.2" r=".9" fill="#fff"/>
    <path d="M96 27 C108 26 112 36 106 44 C104 40 100 37 96 37Z" fill="#F1E9DA" stroke="#4E4336" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M96 38 C100 40 102 42 100 45 C97 44 95 42 95 40Z" fill="#2B2B33"/>
  </symbol>
  <symbol id="nuvem-rosto" viewBox="-4 -4 138 78">
    <use href="#nuvem" x="-2.5" y="-2" width="135" height="68" style="color:#8DB8E2"/>
    <use href="#nuvem" width="130" height="64" style="color:#fff"/>
    <path d="M12 52 C30 60 100 60 120 52 L120 60 Q66 66 12 60Z" fill="#DCEBFA"/>
    <ellipse cx="66" cy="18" rx="16" ry="5" fill="#fff" opacity=".9"/><path d="M58 14 q8 -6 18 -3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="pisca"><circle cx="54" cy="38" r="4.4" fill="#12235A"/><circle cx="76" cy="38" r="4.4" fill="#12235A"/><circle cx="55.6" cy="36.4" r="1.5" fill="#fff"/><circle cx="77.6" cy="36.4" r="1.5" fill="#fff"/></g>
    <path d="M60 46 Q65 51 70 46" stroke="#12235A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="46" cy="45" r="4" fill="#FF9DB5" opacity=".75"/><circle cx="84" cy="45" r="4" fill="#FF9DB5" opacity=".75"/>
  </symbol>
  <symbol id="folha-costela" viewBox="0 0 200 200">
    <path d="M10 196 C20 120 70 50 160 20 C190 70 170 150 90 190 C60 200 30 200 10 196Z" fill="#14593A"/>
    <path d="M14 194 C50 140 100 80 156 26" stroke="#2C8A57" stroke-width="5" fill="none"/>
    <g stroke="#2C8A57" stroke-width="3" fill="none"><path d="M40 160 C60 158 90 150 120 130 M60 128 C80 126 110 116 140 96 M84 96 C100 90 126 76 150 60 M36 150 C34 130 40 110 50 96 M64 116 C62 98 70 80 80 68"/></g>
    <g fill="#0F4A30"><ellipse cx="120" cy="150" rx="10" ry="16" transform="rotate(-40 120 150)"/><ellipse cx="150" cy="104" rx="8" ry="14" transform="rotate(-40 150 104)"/></g>
  </symbol>
  <symbol id="folha-palma" viewBox="0 0 220 200">
    <g stroke="#17603D" stroke-width="5" stroke-linecap="round" fill="none"><path d="M210 200 C170 150 120 110 40 90"/></g>
    <g fill="#1D6E45">${Array.from({length:11}, (_, i) => { const t = i/10, x = 210 - 170*t, y = 200 - 110*t + 20*t*t; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q-${(20 + 10*t).toFixed(0)} ${(30 - 4*i).toFixed(0)} -${(46 - 16*t).toFixed(0)} ${(46 - 3*i).toFixed(0)} q${(30 - 10*t).toFixed(0)} -${(10).toFixed(0)} ${(46 - 16*t).toFixed(0)} -${(46 - 3*i).toFixed(0)}Z"/><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-${(10 + 6*t).toFixed(0)} -${(34 - 2*i).toFixed(0)} -${(40 - 12*t).toFixed(0)} -${(44 - 2*i).toFixed(0)} q${(18).toFixed(0)} ${(20).toFixed(0)} ${(40 - 12*t).toFixed(0)} ${(44 - 2*i).toFixed(0)}Z"/>`; }).join('')}</g>
  </symbol>`;

function jogoAmazonia(palco, api){
  let c = null, fase = 'alvorecer', vivo = true;
  const timers = [];
  const depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const SLOTS = [62, 168, 274, 380, 486, 592].map((x, i) => ({ x, y: 156, est: [1,3,4].includes(i) ? 'clareira' : 'sumauma', ocup:false }));

  /* ---------- cena 1: a floresta ---------- */
  function cenaFloresta(){
    semente = 3;
    let raios = ''; for (let i = 0; i < 7; i++) { const a = -70 + i*24; raios += `<path d="M0 0 L${(Math.cos(a*RAD)*700).toFixed(0)} ${(Math.sin(a*RAD)*700 + 300).toFixed(0)} L${(Math.cos((a+7)*RAD)*700).toFixed(0)} ${(Math.sin((a+7)*RAD)*700 + 300).toFixed(0)}Z" fill="url(#aRaio)"/>`; }
    const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Floresta amazônica ao amanhecer, com rio, árvores e clareiras">
      <defs>${DEFS_AMZ}</defs>
      <rect width="800" height="500" fill="url(#aCeuDia)"/>
      <rect id="a-alva" width="800" height="500" fill="url(#aCeuAlva)" style="transition:opacity .3s"/>
      <g id="a-raios" opacity="0" style="transition:opacity 1s"><g class="gira-lento">${raios}</g></g>
      <g id="a-sol" class="toque"><circle r="120" fill="url(#aSolBrilho)"/><circle r="36" fill="url(#aSolDisco)"/><circle r="60" fill="transparent"/></g>
      <g class="deriva"><use href="#nuvem" x="470" y="40" width="130" height="62" style="color:#fff" opacity=".75"/><use href="#nuvem" x="660" y="96" width="90" height="44" style="color:#fff" opacity=".6"/></g>
      <path d="${silhueta(-10, 820, 236, 12, 30, 4)}" fill="#86BDA9" stroke="#A9D6C3" stroke-width="2"/>
      <rect x="0" y="214" width="800" height="60" fill="url(#aNevoa)" filter="url(#aDesfoca)" class="deriva-nevoa"/>
      <path d="${silhueta(-10, 820, 262, 16, 38, 5)}" fill="#5CA580" stroke="#7FC09C" stroke-width="2"/>${textura(400, 280, 420, 14, 40, "#4E9672", 1.4)}
      <g fill="#4B9670" stroke="#3E8662" stroke-width="1.6">${[120, 430, 700].map(x => `<rect x="${x-3}" y="196" width="6" height="70"/><path d="${copa(x,194,34,11,9)}"/><path d="${copa(x,183,22,8,7)}" fill="#58A47D"/>`).join('')}</g>
      <path d="${silhueta(-10, 820, 290, 20, 44, 6)}" fill="#3FA06A" transform="translate(0 -5)"/>
      <path d="${silhueta(-10, 820, 290, 20, 44, 6)}" fill="#2B7F50"/>${textura(400, 312, 420, 22, 70, "#22693F", 1.6)}${textura(400, 300, 420, 10, 40, "#46A56E", 1.4)}
      <g id="a-arvores"></g>
      <g id="a-casa" class="toque" data-fig="ribeirinha"><svg x="652" y="248" width="120" height="98" viewBox="0 0 160 130"><use href="#f-ribeirinha"/></svg>${brilhoHotspot(758,256)}</g>
      <path d="M0 336 C140 326 260 344 400 336 S660 324 800 334 V470 H0Z" fill="url(#aRio)"/><path d="M0 336 C140 326 260 344 400 336 S660 324 800 334" stroke="#2E6E54" stroke-width="3" fill="none"/><path d="M0 341 C140 331 260 349 400 341 S660 329 800 339" stroke="#D8F1F5" stroke-width="2" fill="none" opacity=".7"/>
      <g id="a-reflexo" opacity="0" style="transition:opacity 1s"><g stroke="#FFF6C8" stroke-width="4" stroke-linecap="round" opacity=".8"><path d="M118 352 h44 M108 366 h64 M122 380 h36 M130 394 h20"/></g></g>
      <g stroke="#fff" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round" fill="none" class="brilha-agua"><path d="M260 356 q12 -4 24 0 M420 372 q14 -5 28 0 M560 352 q12 -4 24 0 M330 396 q14 -5 28 0 M640 390 q12 -4 24 0"/></g>
      <g class="toque" data-fig="vitoria"><svg x="430" y="378" width="96" height="50" viewBox="0 0 150 80"><use href="#f-vitoria"/></svg><svg x="512" y="398" width="60" height="32" viewBox="0 0 150 80"><use href="#f-vitoria"/></svg>${brilhoHotspot(510,386)}</g>
      <g class="toque" data-fig="boto"><rect x="250" y="340" width="120" height="76" fill="transparent"/><g class="pula"><svg x="262" y="346" width="92" height="61" viewBox="0 0 150 100"><use href="#f-boto"/></svg></g></g>
      <g stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round" fill="none"><path d="M60 426 q14 -4 28 0 M200 432 q12 -4 24 0 M610 428 q14 -4 28 0 M720 420 q10 -3 20 0"/></g>
      <path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446 V500 H0Z" fill="url(#aMargem)"/>
      <path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446" stroke="#8A6A44" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 448 C90 438 170 454 260 446 C360 438 430 458 520 450 C620 442 700 454 800 446" stroke="#C8E8E0" stroke-width="2" fill="none" transform="translate(0 -5)" opacity=".7"/>
      <g>${[[150, 452, 9], [330, 446, 7], [470, 458, 8], [690, 452, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#8A8A7A" stroke="#4E4E44" stroke-width="1.4"/><path d="M${x - r * .5} ${y - r * .25} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#D8D8C8" stroke-width="1.2" fill="none"/>`).join('')}</g>
      ${[[40, 486, '#3E9A4E'], [210, 490, '#5AAE3A'], [390, 494, '#2E8A5A'], [570, 488, '#6AB84A'], [770, 492, '#3E9A4E']].map(([x, y, cor]) => `<path d="${copa(x, y - 14, 36, 22, 10, .3)}" fill="${cor}" stroke="#1E5A2E" stroke-width="2"/><path d="${copa(x - 8, y - 26, 20, 12, 7, .3)}" fill="#8AD06A" stroke="#2E7A2E" stroke-width="1.4" opacity=".9"/>${textura(x, y - 12, 30, 12, 6, "#1E5A2E", 1.2)}<path d="M${x - 20} ${y - 30} q10 -7 22 -4" stroke="#E0FFC0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
      <g stroke-linecap="round" fill="none">${Array.from({length:34}, (_, i) => { const x = 10 + i*24 + R(-6,6), y = 452 + R(0,10), cor = ['#4EAE5E', '#7CC24E', '#3C9A5E', '#9AD06A'][i % 4]; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${R(-4,4).toFixed(0)} -${R(8,14).toFixed(0)} ${R(-8,8).toFixed(0)} -${R(14,24).toFixed(0)}" stroke="${cor}" stroke-width="2.6"/>`; }).join('')}</g>
      ${[[270, 448], [300, 454], [640, 446]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-30" stroke="#3E7A2A" stroke-width="2.4"/>${[0, 1, 2].map(k => `<path d="M0 ${-10 - k * 8} l${k % 2 ? 10 : -10} -4 l${k % 2 ? -2 : 2} 7Z" fill="${k === 2 ? '#FFD25A' : '#E5392C'}" stroke="#8A1E14" stroke-width="1"/>`).join('')}<path d="M0 -6 C-14 -10 -20 -22 -18 -34 C-8 -26 -2 -16 0 -6Z" fill="#4E9E3A" stroke="#1E5A1E" stroke-width="1.2"/></g>`).join('')}
      <g class="balanca"><use href="#folha-costela" x="-70" y="350" width="230" height="230"/></g>
      <g class="balanca" style="animation-delay:-1.4s"><use href="#folha-palma" x="610" y="330" width="250" height="230"/></g>
      <g id="a-nuvens"></g>
      <g id="a-arara-voo"></g>
      <g id="a-mao" pointer-events="none"><g class="mao-dica"><circle r="16" fill="#fff" opacity=".85"/><path d="M-4 8 V-8 a4 4 0 0 1 8 0 V2 l6 1 a4 4 0 0 1 3 5 l-3 9 h-14Z" fill="#FFC83D" stroke="#12235A" stroke-width="2" stroke-linejoin="round" transform="translate(0 -2) scale(.9)"/></g></g>
      <rect width="800" height="500" fill="url(#aVinheta)" pointer-events="none"/>
      <rect width="800" height="500" filter="url(#aGrao)" pointer-events="none"/>
    </svg>`;
    c = criarCena(palco, svg);
    const s = c.svg;
    const sol = el(s, '#a-sol'), alva = el(s, '#a-alva');
    let sy = 300; const SX = 150;
    const posSol = y => { sy = Math.max(84, Math.min(320, y)); sol.setAttribute('transform', `translate(${SX} ${sy})`); const k = (320 - sy) / (320 - 84); alva.style.opacity = 1 - k; el(s, '#a-raios').style.opacity = k > .85 ? 1 : 0; el(s, '#a-reflexo').style.opacity = k; el(s, '#a-raios').setAttribute('transform', `translate(${SX} ${sy - 300})`); };
    posSol(250);
    el(s, '#a-mao').setAttribute('transform', `translate(${SX + 46} 200)`);
    let arrSol = null;
    s.addEventListener('pointerdown', e => { if (fase !== 'alvorecer') return; arrSol = { y: c.ponto(e).y, sy, moveu: 0 }; s.setPointerCapture(e.pointerId); });
    s.addEventListener('pointermove', e => { if (arrSol) { const dy = c.ponto(e).y - arrSol.y; arrSol.moveu = Math.max(arrSol.moveu, Math.abs(dy)); posSol(arrSol.sy + dy); if (sy < 140) nascer(); } });
    s.addEventListener('pointerup', () => { if (arrSol && fase === 'alvorecer') { const m = arrSol.moveu; arrSol = null; if (sy < 220 || m < 8) nascer(); else posSol(250); } });
    function nascer(){
      if (fase !== 'alvorecer') return; fase = 'floresta'; arrSol = null;
      el(s, '#a-mao').remove(); toca('vitoria');
      const y0 = sy, t0 = performance.now();
      (function sobe(t){ const k = Math.min(1, (t - t0)/900); posSol(y0 + (84 - y0) * (1 - (1-k)*(1-k))); if (k < 1 && vivo) requestAnimationFrame(sobe); })(t0);
      api.diz('Bom dia, floresta! Com o calor do Sol, as árvores soltam vapor de água pelas folhas. Toque nas árvores para ajudar. Nas clareiras, toque para a arara plantar uma semente!');
      autoVapor();
    }
    /* árvores */
    const gArv = el(s, '#a-arvores');
    function desenhaArvores(anima){
      gArv.innerHTML = SLOTS.map((sl, i) => `<g class="toque slot" data-slot="${i}" transform="translate(${sl.x - 80} ${sl.y})"><g class="${anima === i ? 'cresce' : 'balanca'}" style="animation-delay:${-i*.7}s"><use href="#${sl.est}" width="160" height="200"/></g>${sl.est === 'clareira' && fase !== 'alvorecer' ? brilhoHotspot(80, 150) : ''}<rect x="10" y="20" width="140" height="180" fill="transparent"/></g>`).join('');
    }
    desenhaArvores();
    gArv.addEventListener('click', e => {
      const g = e.target.closest('.slot'); if (!g || fase === 'alvorecer') return;
      const i = +g.dataset.slot, sl = SLOTS[i];
      if (sl.est === 'sumauma') {
        toca('vapor'); const ag = g.firstElementChild; ag.classList.remove('balanca'); ag.classList.add('chacoalha'); depois(520, () => { ag.classList.remove('chacoalha'); ag.classList.add('balanca'); });
        for (let k = 0; k < 6; k++) vapor(sl, k * 60);
      } else if (sl.est === 'clareira' && !sl.ocup) { sl.ocup = true; araraPlanta(i); }
    });
    function vapor(sl, atraso){
      depois(atraso || 0, () => c.add({ tipo:'vapor', x0: sl.x + sorte(-40, 40), y0: sl.y + 40 + sorte(-10, 10), x1: sl.x + sorte(-90, 90), y1: sorte(70, 150), r: sorte(7, 12), dur: sorte(70, 100), f: sorte(0, 6), chega: chegouVapor }));
    }
    let carga = 0;
    function chegouVapor(){ if (fase !== 'floresta') return; carga++; if (carga % 5 === 0) novaNuvenzinha(); }
    function autoVapor(){
      if (!vivo || fase !== 'floresta') return;
      const vivas = SLOTS.filter(sl => sl.est === 'sumauma');
      if (vivas.length) vapor(vivas[Math.floor(Math.random()*vivas.length)]);
      depois(Math.max(260, 1300 - vivas.length * 150), autoVapor);
    }
    /* arara planta semente */
    function araraPlanta(i){
      const sl = SLOTS[i], g = el(s, '#a-arara-voo');
      toca('pop');
      const voo = document.createElementNS(NS, 'g'); voo.innerHTML = '<use href="#arara-voa" x="-65" y="-40" width="130" height="80"/>'; g.appendChild(voo);
      const x0 = -80, x1 = 880, ty = 150, t0 = performance.now(), dur = 2200; let soltou = false;
      (function voa(t){
        if (!vivo) return;
        const k = Math.min(1, (t - t0)/dur), x = x0 + (x1 - x0)*k, y = ty - 60*Math.sin(k*Math.PI) + 10*Math.sin(t/120);
        voo.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.8)`);
        if (!soltou && x >= sl.x) { soltou = true; c.add({ tipo:'semente', x, y: y + 10, alvoY: sl.y + 186, vy: 1, chega: () => crescer(i) }); toca('clique'); }
        if (k < 1) requestAnimationFrame(voa); else voo.remove();
      })(t0);
    }
    function crescer(i){
      const sl = SLOTS[i];
      sl.est = 'broto'; desenhaArvores(i); toca('planta'); c.brilhos(sl.x, sl.y + 170, 6, '#9CF0B0');
      depois(1300, () => { sl.est = 'arvoreta'; desenhaArvores(i); toca('pop'); });
      depois(2600, () => { sl.est = 'sumauma'; sl.ocup = false; desenhaArvores(i); toca('ok'); c.brilhos(sl.x, sl.y + 60, 8, '#FFE27A');
        if (SLOTS.every(q => q.est === 'sumauma')) api.diz('A floresta está inteira de novo! Mais árvores, mais vapor, mais nuvens.'); });
    }
    /* nuvenzinhas */
    const gN = el(s, '#a-nuvens'), NUVS = [];
    const META = 5;
    function novaNuvenzinha(){
      if (NUVS.length >= META || fase !== 'floresta') return;
      let x, y, ok, tent = 0;
      do { x = sorte(130, 690); y = sorte(56, 150); ok = NUVS.every(n => Math.hypot(n.x - x, n.y - y) > 110); tent++; } while (!ok && tent < 30);
      const n = { x, y, tam: 1, el: document.createElementNS(NS, 'g') };
      n.el.setAttribute('class', 'toque nuvenzinha'); n.el.innerHTML = '<g class="nz-esc cresce"><use href="#nuvem-rosto" x="-65" y="-35" width="130" height="70"/></g>';
      gN.appendChild(n.el); NUVS.push(n); posN(n); toca('pop');
      api.hud(`<span class="chip">Nuvenzinhas ${NUVS.length}/${META}</span>`);
      if (NUVS.length === 1) api.diz('Olha! O vapor subiu e virou uma nuvenzinha. Continue até juntar cinco!');
      if (NUVS.length >= META) { fase = 'juntar'; api.diz('Que monte de nuvenzinhas! Agora arraste uma até a outra para juntar todas numa nuvem bem grande.'); api.hud('<span class="chip">Junte as nuvens</span>'); }
    }
    const escN = t => 0.62 + 0.2 * t;
    function posN(n){ n.el.setAttribute('transform', `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) scale(${escN(n.tam).toFixed(2)})`); }
    let arrN = null;
    gN.addEventListener('pointerdown', e => {
      if (fase !== 'juntar') return;
      const g = e.target.closest('.nuvenzinha'); if (!g) return;
      const n = NUVS.find(n => n.el === g); const p = c.ponto(e);
      arrN = { n, dx: n.x - p.x, dy: n.y - p.y }; s.setPointerCapture(e.pointerId); gN.appendChild(g);
    });
    s.addEventListener('pointermove', e => { if (!arrN) return; const p = c.ponto(e); arrN.n.x = Math.max(60, Math.min(740, p.x + arrN.dx)); arrN.n.y = Math.max(40, Math.min(220, p.y + arrN.dy)); posN(arrN.n); });
    s.addEventListener('pointerup', () => {
      if (!arrN) return; const a = arrN.n; arrN = null;
      const b = NUVS.filter(n => n !== a).sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y))[0];
      if (b && Math.hypot(b.x - a.x, b.y - a.y) < 50 + 30 * (escN(a.tam) + escN(b.tam))) {
        b.tam += a.tam; a.el.remove(); NUVS.splice(NUVS.indexOf(a), 1);
        b.x = (a.x + b.x) / 2; b.y = (a.y + b.y) / 2; posN(b);
        const e2 = b.el.querySelector('.nz-esc'); e2.classList.remove('cresce'); void e2.getBBox(); e2.classList.add('cresce');
        toca('splash'); c.brilhos(b.x, b.y, 6, '#fff');
        if (NUVS.length === 1) grandona(b);
      }
    });
    function grandona(n){
      fase = 'pronta'; toca('vitoria');
      n.x = 400; n.y = 110; n.el.style.transition = 'transform 1s ease-in-out'; posN(n);
      api.hud('<span class="chip">Rio voador pronto!</span>');
      api.diz('Uau! Nasceu um rio voador: uma nuvem enorme cheia de água que vai viajar pelo céu. Vamos com ela!');
      let foi = false; const seguir = () => { if (foi || !vivo) return; foi = true; api.botoes([]); paraMapa(); };
      api.botoes([{ txt:'Seguir o rio voador', cls:'azul', fn:seguir }]);
      n.el.classList.add('toque'); n.el.style.cursor = 'pointer'; n.el.addEventListener('click', seguir);
      depois(1200, () => { const h = document.createElementNS('http://www.w3.org/2000/svg', 'g'); h.innerHTML = brilhoHotspot(80, -30); n.el.querySelector('.nz-esc') ? n.el.querySelector('.nz-esc').appendChild(h) : n.el.appendChild(h); });
      depois(9000, seguir);
    }
    api.hud('');
    api.diz('Oi, eu sou a Rosinha, uma boto-cor-de-rosa! Ainda está escuro na floresta. Arraste o Sol para cima para o dia começar.');
  }

  /* ---------- cena 2: o mapa dos rios voadores ---------- */
  const MX = lon => (lon + 83) * 16, MY = lat => (9 - lat) * 11.6;
  const mp = pts => 'M' + pts.map(p => `${MX(p[0]).toFixed(1)} ${MY(p[1]).toFixed(1)}`).join(' L') + 'Z';
  const ml = pts => 'M' + pts.map(p => `${MX(p[0]).toFixed(1)} ${MY(p[1]).toFixed(1)}`).join(' L');
  const ANDES = [[-77,7],[-76,4],[-77.5,1],[-78.5,-2],[-77,-6],[-75,-10],[-72,-14],[-69.5,-17],[-68.5,-20],[-68.5,-24],[-69.5,-28],[-70,-32],[-70,-36]];
  function andesX(y){
    for (let i = 0; i < ANDES.length - 1; i++) { const y0 = MY(ANDES[i][1]), y1 = MY(ANDES[i+1][1]); if (y >= y0 && y <= y1) { const k = (y - y0)/(y1 - y0); return MX(ANDES[i][0]) + (MX(ANDES[i+1][0]) - MX(ANDES[i][0]))*k; } }
    return y < MY(ANDES[0][1]) ? MX(ANDES[0][0]) : MX(ANDES[ANDES.length-1][0]);
  }
  function paraMapa(){
    const veu = document.createElement('div'); veu.className = 'veu'; palco.appendChild(veu);
    depois(450, () => { c.parar(); palco.querySelectorAll('svg,canvas').forEach(e => e.remove()); cenaMapa(); veu.classList.add('sai'); depois(500, () => veu.remove()); });
  }
  function cenaMapa(){
    fase = 'mapa';
    semente = 9;
    let arvorinhas = ''; for (let i = 0; i < 160; i++) { const lon = R(-77, -47), lat = R(-12, 4); arvorinhas += `<circle cx="${MX(lon).toFixed(0)}" cy="${MY(lat).toFixed(0)}" r="${R(4,7).toFixed(1)}" fill="${rnd() < .5 ? '#1F7E46' : '#2C9455'}"/>`; }
    let montes = ''; ANDES.forEach((p, i) => { if (i === ANDES.length - 1) return; const q = ANDES[i+1]; for (let k = 0; k < 3; k++) { const t = k/3, x = MX(p[0] + (q[0]-p[0])*t), y = MY(p[1] + (q[1]-p[1])*t), h = R(18, 30), w = R(14, 20); montes += `<path d="M${(x-w).toFixed(0)} ${(y+8).toFixed(0)} L${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w).toFixed(0)} ${(y+8).toFixed(0)}Z" fill="#9A7A5C"/><path d="M${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w).toFixed(0)} ${(y+8).toFixed(0)} L${(x+w*.2).toFixed(0)} ${(y+8).toFixed(0)}Z" fill="#7C5E44"/><path d="M${(x-w*.35).toFixed(0)} ${(y-h*.6).toFixed(0)} L${x.toFixed(0)} ${(y-h).toFixed(0)} L${(x+w*.35).toFixed(0)} ${(y-h*.6).toFixed(0)} L${x.toFixed(0)} ${(y-h*.5).toFixed(0)}Z" fill="#fff"/>`; } });
    const ROTA = [[-36,1],[-50,-1],[-63,-3],[-72,-7],[-70,-15],[-62,-19],[-54,-22],[-46,-24.5]];
    const ALVOS = [
      { id:'campo', nome:'Plantações', lon:-55, lat:-13, fala:'Choveu nas plantações! A comida que a gente come precisa de muita água para crescer.' },
      { id:'usina', nome:'Usina e represa', lon:-52, lat:-19.5, fala:'A represa encheu! Com a água, a usina hidrelétrica faz energia e as luzes das cidades acendem.' },
      { id:'cidade', nome:'Cidade', lon:-46, lat:-23, fala:'A represa da cidade encheu! Agora tem água tratada na torneira das casas.' }
    ];
    const icone = a => ({
      campo:`<circle r="34" fill="#FFF3D6" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><rect x="-34" y="-34" width="68" height="68" fill="#D9B46C" class="m-seco"/><g class="m-verde" opacity="0" style="transition:opacity 1s"><rect x="-34" y="-34" width="68" height="68" fill="#7CCB5A"/>${[-20,-6,8,22].map(x => `<path d="M${x} 24 V-6 M${x-6} 6 q6 -10 6 -14 q0 4 6 14" stroke="#2E8B3A" stroke-width="3" fill="none"/>`).join('')}</g><path d="M-34 10 H34 M-34 22 H34" stroke="#B48E4A" stroke-width="2" class="m-seco"/></g>`,
      usina:`<circle r="34" fill="#E9F1FF" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><rect x="-34" y="4" width="68" height="40" fill="#3D8BFF" class="m-agua" style="transition:transform 1.2s" transform="translate(0 16)"/><path d="M-12 -30 H12 L18 34 H-18Z" fill="#B6BFD4"/><path d="M-12 -30 H12 L14 -10 H-14Z" fill="#9AA6C2"/><path d="M4 -24 L-4 -8 H2 L-3 6 L8 -12 H2 L7 -24Z" fill="#FFC83D" class="m-raio" opacity=".25"/></g>`,
      cidade:`<circle r="34" fill="#E9F1FF" stroke="#fff" stroke-width="4"/><g clip-path="url(#mClip)"><g fill="#7C8AA8"><rect x="-26" y="-14" width="14" height="44"/><rect x="-10" y="-26" width="16" height="56"/><rect x="8" y="-8" width="16" height="38"/></g><g fill="#5A6787" class="m-janelas">${[[-23,-8],[-23,2],[-6,-20],[-6,-10],[-6,0],[0,-20],[0,-10],[11,-2],[17,-2],[11,8]].map(p => `<rect x="${p[0]}" y="${p[1]}" width="4" height="5"/>`).join('')}</g><rect x="-34" y="26" width="68" height="10" fill="#2E8B3A"/></g>`
    })[a.id];
    const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Mapa da América do Sul com a Amazônia, a Cordilheira dos Andes, plantações, usina e cidade">
      <defs>
        <linearGradient id="mMar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BB8F0"/><stop offset="1" stop-color="#2369C4"/></linearGradient>
        <linearGradient id="mTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD07A"/><stop offset="1" stop-color="#6DB866"/></linearGradient>
        ${DEFS_AMZ}
        <clipPath id="mTerraClip"><path d="${mp(CONT.sul)}"/></clipPath>
        <clipPath id="mClip"><circle r="31"/></clipPath>
        <filter id="mSombra" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#0A2A5A" flood-opacity=".35"/></filter>
        <filter id="mGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
        <marker id="mSeta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#fff"/></marker>
      </defs>
      <rect width="800" height="500" fill="url(#mMar)"/>
      <g stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none" stroke-linecap="round">${Array.from({length:26}, () => { const x = R(0,800), y = R(0,500); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -5 16 0 t16 0"/>`; }).join('')}</g>
      <path d="${mp(CONT.sul)}" fill="#1E5FA8" transform="translate(4 8)" opacity=".5"/>
      <path d="${mp(CONT.sul)}" fill="url(#mTerra)" stroke="#E9F7D8" stroke-width="3" filter="url(#mSombra)"/>
      <g clip-path="url(#mTerraClip)">
        <path d="${mp([[-56,-11],[-48,-9],[-44,-8],[-41,-15],[-45,-20],[-50,-21],[-55,-17],[-58,-14]])}" fill="#C9C870"/>
        <path d="${mp([[-45,-3],[-38,-5],[-36,-10],[-41,-15],[-44,-10]])}" fill="#E2C58A"/>
        <ellipse cx="${MX(-57)}" cy="${MY(-18.5)}" rx="26" ry="30" fill="#6FC3B8"/>
        <path d="${mp([[-35,-6],[-39,-14],[-40,-21],[-45,-24],[-49,-27],[-52,-26],[-48,-22],[-43,-19],[-41,-12],[-37,-7]])}" fill="#3FA864"/>
        <path d="${mp([[-77,-2],[-72,2],[-66,3],[-60,4],[-54,2],[-50,0],[-48,-3],[-46,-5],[-48,-9],[-52,-10],[-56,-11],[-60,-12],[-64,-12],[-69,-11],[-73,-8],[-76,-5]])}" fill="#2A9156"/>
        ${arvorinhas}
        <path d="${ml([[-73,-4],[-66,-3.2],[-60,-3.2],[-55,-2.4],[-52,-1.6],[-49.5,-0.6]])}" stroke="#4DA9E8" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="${ml([[-47.5,-19],[-50,-21],[-52,-23],[-54,-25.5],[-56.5,-29],[-58.5,-33.5]])}" stroke="#4DA9E8" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${montes}
      </g>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff" stroke="#12235A" stroke-opacity=".35" stroke-width="3" paint-order="stroke">
        <text x="${MX(-66)}" y="${MY(-6.5)}" font-size="18">Amazônia</text>
        <text x="${MX(-82)}" y="${MY(-23)}" font-size="13" transform="rotate(-62 ${MX(-82)} ${MY(-23)})">Cordilheira dos Andes</text>
        <text x="785" y="${MY(-30)}" font-size="16" text-anchor="end">Oceano Atlântico</text>
      </g>
      <path id="m-rota" d="${ml(ROTA)}" stroke="#fff" stroke-opacity=".35" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${ml(ROTA)}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="10 14" class="vento" marker-end="url(#mSeta)"/>
      <g id="m-alvos">${ALVOS.map(a => `<g class="toque m-alvo" data-a="${a.id}" transform="translate(${MX(a.lon).toFixed(0)} ${MY(a.lat).toFixed(0)})" filter="url(#mSombra)">${icone(a)}<g transform="translate(0 50)"><rect x="-64" y="-12" width="128" height="24" rx="12" fill="#fff"/><text text-anchor="middle" y="5" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#12235A">${a.nome}</text></g><g class="m-ok" opacity="0" style="transition:opacity .4s"><circle cx="26" cy="-26" r="13" fill="#22A565" stroke="#fff" stroke-width="3"/><path d="M20 -26 l4 4 l8 -8" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g>
      <g id="m-nuvem" class="toque" style="cursor:grab"><g class="nz-esc"><use href="#nuvem-rosto" x="-80" y="-43" width="160" height="86"/></g><svg x="-12" y="-74" width="30" height="36" viewBox="-8 -6 136 166"><use href="#pingo"/></svg><g id="m-gotas"></g></g>
      <rect width="800" height="500" filter="url(#mGrao)" pointer-events="none"/>
    </svg>`;
    c = criarCena(palco, svg);
    const s = c.svg, nuvem = el(s, '#m-nuvem');
    let nx = MX(-62), ny = MY(-3), carga = 3, batida = false, chovendo = false;
    const feitos = {};
    const posM = () => { nuvem.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)}) scale(${(0.7 + carga*0.1).toFixed(2)})`); };
    const gotas = () => { el(s, '#m-gotas').innerHTML = Array.from({length:carga}, (_, i) => `<use href="#gota" x="${-24 + i*18}" y="34" width="12" height="16" style="color:#2E7BF6"/>`).join(''); };
    posM(); gotas();
    api.hud('<span class="chip">Leve a chuva: 0/3</span>');
    api.diz('O vento empurra o rio voador para o oeste, até a Cordilheira dos Andes. As montanhas são uma parede gigante! Arraste a nuvem e leve a chuva até as plantações, a usina e a cidade.');
    function mover(x, y){
      const lim = andesX(y) + 34;
      if (x < lim) { x = lim; if (!batida) { batida = true; toca('glub'); nuvem.classList.remove('treme-svg'); void nuvem.getBBox(); nuvem.classList.add('treme-svg'); api.diz('Opa! Os Andes são altos demais para a nuvem passar. Por isso o rio voador desvia para o sul, em direção ao centro do Brasil.'); depois(4000, () => batida = false); } }
      nx = Math.max(40, Math.min(770, x)); ny = Math.max(30, Math.min(470, y)); posM(); verAlvos();
    }
    function verAlvos(){
      if (chovendo) return;
      ALVOS.forEach(a => { if (!feitos[a.id] && Math.hypot(MX(a.lon) - nx, MY(a.lat) - (ny + 40)) < 46) chover(a); });
    }
    function chover(a){
      chovendo = true; arr = null; toca('chuva');
      c.chover(nx - 50, nx + 50, ny + 30, MY(a.lat) + 20, 70, '#BFE6FF');
      const g = el(s, `.m-alvo[data-a="${a.id}"]`);
      depois(1300, () => {
        feitos[a.id] = true; carga--; gotas(); posM(); toca('ok');
        g.querySelector('.m-ok').style.opacity = 1; c.brilhos(MX(a.lon), MY(a.lat), 8, '#FFE27A');
        if (a.id === 'campo') { g.querySelector('.m-verde').style.opacity = 1; }
        if (a.id === 'usina') { g.querySelector('.m-agua').setAttribute('transform', 'translate(0 -10)'); g.querySelector('.m-raio').setAttribute('opacity', 1); s.querySelectorAll('.m-janelas rect').forEach(r => r.setAttribute('fill', '#FFD84D')); }
        if (a.id === 'cidade') { g.querySelector('circle').setAttribute('fill', '#D4F2FF'); }
        api.diz(a.fala);
        const n = Object.keys(feitos).length;
        api.hud(`<span class="chip">Leve a chuva: ${n}/3</span>`);
        chovendo = false;
        if (n === 3) { fase = 'fim'; depois(2600, () => { api.diz('Tudo isso começou com as árvores da floresta. Cuidar da Amazônia é cuidar da chuva do Brasil inteiro!'); depois(2200, api.fim); }); }
      });
    }
    let arr = null;
    nuvem.addEventListener('pointerdown', e => { if (chovendo || fase !== 'mapa') return; const p = c.ponto(e); arr = { dx: nx - p.x, dy: ny - p.y }; s.setPointerCapture(e.pointerId); nuvem.style.cursor = 'grabbing'; });
    s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); mover(p.x + arr.dx, p.y + arr.dy); });
    s.addEventListener('pointerup', () => { arr = null; nuvem.style.cursor = 'grab'; });
    el(s, '#m-alvos').addEventListener('click', e => {
      const g = e.target.closest('.m-alvo'); if (!g || chovendo || arr || fase !== 'mapa') return;
      const a = ALVOS.find(a => a.id === g.dataset.a); if (feitos[a.id]) return;
      const x0 = nx, y0 = ny, x1 = MX(a.lon), y1 = MY(a.lat) - 40, t0 = performance.now();
      (function vai(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/1100), e2 = k*k*(3-2*k); mover(x0 + (x1-x0)*e2, y0 + (y1-y0)*e2); if (k < 1 && !chovendo) requestAnimationFrame(vai); })(t0);
    });
  }

  cenaFloresta();
  return () => { vivo = false; timers.forEach(clearTimeout); if (c) c.parar(); };
}


/* ================= JOGO 2: Caatinga, canos até a cisterna ================= */
function jogoCaatinga(palco, api){
  semente = 5;
  let rachaduras = '';
  for (let i = 0; i < 14; i++) { const x = R(20, 780), y = R(310, 490); rachaduras += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${R(-14,14).toFixed(0)} ${R(4,10).toFixed(0)} l${R(-10,10).toFixed(0)} ${R(4,10).toFixed(0)}" stroke="#B98A52" stroke-width="2" fill="none" stroke-linecap="round"/>`; }
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Sertão com casa, cacto mandacaru, umbuzeiro e uma cisterna">
    <defs>
      <linearGradient id="caaCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC98A"/><stop offset="1" stop-color="#FFF2D8"/></linearGradient>
      <linearGradient id="caaChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBC18A"/><stop offset="1" stop-color="#D9A867"/></linearGradient>
      <linearGradient id="caaAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CCBFF"/><stop offset="1" stop-color="#2E7BF6"/></linearGradient>
      <clipPath id="caaTelhado"><path d="M34 226 L136 170 L238 226Z"/></clipPath>
      <clipPath id="caaClip"><rect x="684" y="338" width="92" height="124" rx="6"/></clipPath>
    </defs>
    <rect width="800" height="500" fill="url(#caaCeu)"/>
    <circle cx="560" cy="80" r="70" fill="#FFE27A" opacity=".35"/><circle cx="560" cy="80" r="44" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M536 64 q10 -12 26 -12" stroke="#FFF1B8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g class="toque voando" data-fig="asabranca"><svg x="0" y="56" width="70" height="46" viewBox="0 0 120 80"><use href="#f-asabranca"/></svg></g>
    <path d="M0 250 L60 214 L110 236 L180 196 L260 240 L340 222 L420 248 L500 210 L580 236 L660 204 L740 232 L800 220 V300 H0Z" fill="#E8B98A" stroke="#D29E6C" stroke-width="2" stroke-linejoin="round"/>
    <path d="M180 196 L200 214 L188 216 L206 238 M500 210 L516 226 L506 228 L520 244 M660 204 L678 222 L668 224" stroke="#D6A577" stroke-width="2" fill="none"/>
    <path d="M0 290 Q120 250 240 276 T520 262 T800 270 V300 H0Z" fill="#D9B07A" stroke="#C49460" stroke-width="2"/>
    <rect y="288" width="800" height="212" fill="url(#caaChao)"/>${rachaduras}
    <g fill="#C99A63" stroke="#8E6638" stroke-width="1.4">${Array.from({length:16}, () => { const x = R(20,780), y = R(320,495); return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${R(4,9).toFixed(1)}" ry="${R(2.5,4.5).toFixed(1)}"/>`; }).join('')}</g>
    <g stroke="#9AA05A" stroke-width="2" fill="none" stroke-linecap="round">${Array.from({length:18}, () => { const x = R(20,780), y = R(300,495); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-3 -8 M${x.toFixed(0)} ${y.toFixed(0)} l0 -10 M${x.toFixed(0)} ${y.toFixed(0)} l4 -7"/>`; }).join('')}</g>
    <g stroke="#9C8A78" stroke-width="3" fill="none" stroke-linecap="round"><path d="M300 292 l-6 -40 M300 268 l-18 -14 M297 262 l16 -18 M290 282 l-14 -6"/><path d="M760 292 l4 -36 M762 270 l14 -12 M763 262 l-14 -14"/></g>
    <g class="toque" data-fig="mandacaru"><svg x="396" y="140" width="96" height="150" viewBox="0 0 100 150"><use href="#f-mandacaru"/></svg>${brilhoHotspot(470,170)}</g>
    <g class="toque" data-fig="umbu" id="caa-umbu"><svg x="512" y="168" width="150" height="124" viewBox="0 0 150 130"><use href="#f-umbu"/></svg>${brilhoHotspot(620,186)}</g>
    <g id="caa-casa">
      <ellipse cx="136" cy="332" rx="112" ry="8" fill="#A87A44" opacity=".45"/>
      <rect x="44" y="222" width="184" height="108" fill="#F6E4CC" stroke="#7A4A2A" stroke-width="2.5"/><rect x="44" y="300" width="184" height="30" fill="#E7C9A2" stroke="#7A4A2A" stroke-width="2.5"/>
      <rect x="44" y="222" width="184" height="12" fill="#D9BC98" opacity=".7"/>
      <g stroke="#E2CBAA" stroke-width="1.5" fill="none"><path d="M54 248 h22 M62 256 h14 M200 296 h18 M206 288 h12 M128 240 h14"/></g>
      <rect x="84" y="262" width="34" height="68" rx="3" fill="#2E7BF6" stroke="#123E8E" stroke-width="2.5"/><rect x="89" y="268" width="24" height="24" rx="2" fill="none" stroke="#1B56C4" stroke-width="2"/><rect x="89" y="298" width="24" height="26" rx="2" fill="none" stroke="#1B56C4" stroke-width="2"/><circle cx="111" cy="296" r="2.6" fill="#FFC83D" stroke="#B07A00" stroke-width="1"/>
      <rect x="146" y="248" width="52" height="42" rx="4" fill="#C98A5A" stroke="#7A4A2A" stroke-width="2.5"/>
      <rect x="150" y="252" width="44" height="34" rx="3" fill="#22A565" stroke="#12753F" stroke-width="2"/><path d="M172 252 v34 M150 269 h44" stroke="#12753F" stroke-width="2.5"/><path d="M155 256 l8 0" stroke="#7FE0A6" stroke-width="2" stroke-linecap="round"/>
      <path d="M30 228 L136 168 L242 228Z" fill="#D2633F"/>
      <g stroke="#B04A2A" stroke-width="2" fill="none" clip-path="url(#caaTelhado)">${[0,1,2,3].map(i => { const y = 178 + i*13, w = (y - 168) * 106/60; return `<path d="M${(136 - w).toFixed(0)} ${y} q6 5 12 0 ${Array.from({length:Math.floor(w/6)}, () => 't12 0').join(' ')}"/>`; }).join('')}</g>
      <path d="M30 228 L136 168 L242 228" stroke="#7A2E18" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M44 232 H228" stroke="#7A4A2A" stroke-width="3" opacity=".35"/>
      <path d="M150 232 H246" stroke="#4E5B7A" stroke-width="14" stroke-linecap="round"/><path d="M150 232 H246" stroke="#93A2C2" stroke-width="9" stroke-linecap="round"/><path d="M152 230 H244" stroke="#D3DCEE" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    </g>
    <path d="M244 234 V326 H300" stroke="#4E5B7A" stroke-width="22" fill="none" stroke-linejoin="round"/><path d="M244 234 V326 H300" stroke="#93A2C2" stroke-width="16" fill="none" stroke-linejoin="round"/>
    <path id="caa-desce" d="M244 234 V326 H300" stroke="#3D8BFF" stroke-width="8" fill="none" stroke-linejoin="round" stroke-dasharray="200" stroke-dashoffset="200" style="transition:stroke-dashoffset .6s linear"/>
    <g class="toque" data-fig="tatu"><g class="espia"><svg x="148" y="438" width="74" height="50" viewBox="0 0 120 80"><use href="#f-tatu"/></svg></g><path d="${copa(160,472,44,24,10,.22)}" fill="#8EA05A" stroke="#5B6B30" stroke-width="2.2" stroke-linejoin="round"/><path d="${copa(140,462,24,16,8,.22)}" fill="#A1B56A" stroke="#5B6B30" stroke-width="2" stroke-linejoin="round"/><path d="M130 454 q6 -5 14 -3" stroke="#D2E29A" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
    <g id="caa-grade"></g>
    <path id="caa-saida-borda" stroke="#4E5B7A" stroke-width="22" fill="none"/><path id="caa-saida-cano" stroke="#93A2C2" stroke-width="16" fill="none"/>
    <path id="caa-saida" stroke="#3D8BFF" stroke-width="8" fill="none" stroke-dasharray="200" stroke-dashoffset="200" style="transition:stroke-dashoffset .5s linear"/>
    <g id="caa-cisterna">
      <ellipse cx="730" cy="466" rx="54" ry="12" fill="#B98A52" opacity=".5"/>
      <rect x="678" y="330" width="104" height="136" rx="10" fill="#F4F1EA" stroke="#5A6787" stroke-width="3"/><path d="M690 340 V456" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <rect x="684" y="338" width="92" height="124" rx="6" fill="#E3DED2"/>
      <g clip-path="url(#caaClip)"><rect id="caa-nivel" x="684" y="462" width="92" height="124" fill="url(#caaAgua)" style="transition:transform 1.2s ease-out"/><path d="M684 462 q12 -5 23 0 t23 0 t23 0 t23 0" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" id="caa-onda" style="transition:transform 1.2s ease-out"/></g>
      <ellipse cx="730" cy="330" rx="54" ry="10" fill="#E9E4D8" stroke="#5A6787" stroke-width="3"/><ellipse cx="730" cy="327" rx="18" ry="4" fill="#C9C2B4" stroke="#5A6787" stroke-width="2"/><path d="M684 398 H776 M684 430 H776" stroke="#D9D3C5" stroke-width="2"/>
      <text x="730" y="356" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#7C8AA8">CISTERNA</text>
    </g>
    <g id="caa-nuvem" style="transition:opacity 1s"><use href="#nuvem" x="36" y="22" width="228" height="114" style="color:#7D88A6"/><use href="#nuvem" x="40" y="26" width="220" height="108" style="color:#AEB8CF"/><use href="#nuvem" x="116" y="57" width="148" height="74" style="color:#8C97B3"/><use href="#nuvem" x="120" y="60" width="140" height="68" style="color:#C4CCDD"/><path d="M110 48 q14 -10 30 -4 M190 76 q10 -7 22 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/></g>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const T = 68, GX = 300, GY = 292;
  const NIVEIS = [[3,2],[4,3],[5,3]];
  let nivel = 0, grade = [], ocupado = false, chuvaOn = true, cheio = 0;
  const rot = m => ((m << 1) | (m >> 3)) & 15;
  const rotN = (m, n) => { for (let i = 0; i < n; i++) m = rot(m); return m; };
  const BASE = { reto: 8|2, curva: 8|4 };
  const OPOSTO = { 1:4, 2:8, 4:1, 8:2 }, DX = { 1:0, 2:1, 4:0, 8:-1 }, DY = { 1:-1, 2:0, 4:1, 8:0 };
  const conex = t => rotN(BASE[t.tipo], t.r % 4);
  function gerar(C, Rr){
    const cam = [{ c:0, r:0 }];
    let cc = 0, rr = 0;
    while (cc < C-1 || rr < Rr-1) { if (cc === C-1) rr++; else if (rr === Rr-1) cc++; else if (Math.random() < .5) cc++; else rr++; cam.push({ c:cc, r:rr }); }
    grade = [];
    for (let r = 0; r < Rr; r++) for (let c2 = 0; c2 < C; c2++) grade.push({ col:c2, lin:r, tipo: Math.random() < .5 ? 'reto' : 'curva', r: Math.floor(Math.random()*4) });
    const cel = (c2, r) => grade[r*C + c2];
    cam.forEach((p, i) => {
      const ent = i === 0 ? 8 : dirDe(cam[i-1], p, true), sai = i === cam.length-1 ? 2 : dirDe(p, cam[i+1], false);
      const m = ent | sai, t = cel(p.c, p.r);
      t.tipo = (m === 10 || m === 5) ? 'reto' : 'curva';
      let k = 0; while (rotN(BASE[t.tipo], k) !== m) k++;
      t.certo = k; t.r = (k + 1 + Math.floor(Math.random()*3)) % 4; t.noCaminho = true;
    });
  }
  function dirDe(a, b, entrada){
    const d = b.c > a.c ? 2 : b.c < a.c ? 8 : b.r > a.r ? 4 : 1;
    return entrada ? OPOSTO[d] : d;
  }
  function percorrer(C, Rr){
    let c2 = 0, r = 0, ent = 8; const rota = [];
    for (let passo = 0; passo < 60; passo++) {
      const t = grade[r*C + c2], m = conex(t);
      if (!(m & ent)) return null;
      const sai = m & ~ent; rota.push(t);
      if (c2 === C-1 && r === Rr-1 && sai === 2) return rota;
      const nc = c2 + DX[sai], nr = r + DY[sai];
      if (nc < 0 || nr < 0 || nc >= C || nr >= Rr) return null;
      c2 = nc; r = nr; ent = OPOSTO[sai];
    }
    return null;
  }
  const PECA = { reto:'M0 34 H68', curva:'M0 34 H14 Q34 34 34 54 V68' };
  function desenhar(){
    const [C, Rr] = NIVEIS[nivel];
    el(s, '#caa-grade').innerHTML = grade.map((t, i) => `
      <g class="cano" data-i="${i}" transform="translate(${GX + t.col*T} ${GY + t.lin*T})">
        <rect x="2" y="2" width="${T-4}" height="${T-4}" rx="12" fill="#C99A5E"/><rect x="5" y="5" width="${T-10}" height="${T-10}" rx="10" fill="#B9884F"/>
        <g class="gira" style="transform-origin:34px 34px;transform:rotate(${t.r*90}deg)" data-ang="${t.r*90}">
          <path d="${PECA[t.tipo]}" stroke="#4E5B7A" stroke-width="24" fill="none"/>
          <path d="${PECA[t.tipo]}" stroke="#93A2C2" stroke-width="18" fill="none"/>
          <path d="${PECA[t.tipo]}" stroke="#D3DCEE" stroke-width="4" fill="none" transform="translate(0 -5)" opacity=".8"/>
          <path class="agua-cano" d="${PECA[t.tipo]}" stroke="#3D8BFF" stroke-width="10" fill="none"/>
        </g>
      </g>`).join('');
    const ex = GX + C*T, ey = GY + (Rr-1)*T + 34;
    const d = `M${ex} ${ey} H690`;
    el(s, '#caa-saida-cano').setAttribute('d', d); el(s, '#caa-saida-borda').setAttribute('d', d); el(s, '#caa-saida').setAttribute('d', d);
    el(s, '#caa-saida').style.transition = 'none'; el(s, '#caa-saida').style.strokeDashoffset = 200;
    el(s, '#caa-desce').style.transition = 'none'; el(s, '#caa-desce').style.strokeDashoffset = 200;
    api.hud(`<span class="chip">Fase ${nivel+1}/3</span><span class="chip">Cisterna ${Math.round(cheio/3*100)}%</span>`);
  }
  function novoNivel(){
    const [C, Rr] = NIVEIS[nivel];
    do { gerar(C, Rr); } while (percorrer(C, Rr));
    desenhar(); ocupado = false;
  }
  el(s, '#caa-grade').addEventListener('click', e => {
    const g = e.target.closest('.cano'); if (!g || ocupado) return;
    const t = grade[+g.dataset.i]; t.r = (t.r + 1) % 4; toca('clique');
    const gi = g.querySelector('.gira'), ang = +gi.dataset.ang + 90; gi.dataset.ang = ang; gi.style.transform = `rotate(${ang}deg)`;
    const [C, Rr] = NIVEIS[nivel], rota = percorrer(C, Rr);
    if (rota) { ocupado = true; setTimeout(() => encher(rota), 300); }
  });
  function encher(rota){
    toca('ok');
    const desce = el(s, '#caa-desce'); desce.style.transition = 'stroke-dashoffset .5s linear'; desce.style.strokeDashoffset = 0;
    rota.forEach((t, i) => {
      const g = el(s, `.cano[data-i="${grade.indexOf(t)}"] .agua-cano`);
      g.style.transitionDelay = (0.45 + i*0.22) + 's'; g.classList.add('corre');
    });
    const fimT = 450 + rota.length*220 + 300;
    setTimeout(() => { const sd = el(s, '#caa-saida'); sd.style.transition = 'stroke-dashoffset .4s linear'; sd.style.strokeDashoffset = 0; }, fimT - 200);
    setTimeout(() => {
      cheio++; toca('splash');
      const h = 124 * cheio / 3;
      el(s, '#caa-nivel').style.transform = `translateY(${-h}px)`; el(s, '#caa-onda').style.transform = `translateY(${-h}px)`;
      c.brilhos(730, 400, 6, '#7CCBFF');
      api.hud(`<span class="chip">Fase ${nivel+1}/3</span><span class="chip">Cisterna ${Math.round(cheio/3*100)}%</span>`);
      if (cheio >= 3) {
        chuvaOn = false; el(s, '#caa-nuvem').style.opacity = .25;
        api.diz('A cisterna está cheia! Agora minha família tem água para beber e cozinhar durante a seca. Obrigada!');
        setTimeout(api.fim, 1800);
      } else {
        api.diz(cheio === 1 ? 'Muito bem! A água chegou na cisterna. Ainda está chovendo, vamos encher mais!' : 'Falta pouco! Mais uma ligação e a cisterna fica cheia.');
        setTimeout(() => { nivel++; novoNivel(); }, 1600);
      }
    }, fimT + 300);
  }
  const timer = setInterval(() => { if (chuvaOn) c.chover(50, 250, 120, 214, 10, '#5E9BFF'); }, 700);
  api.diz('Oi! Eu sou a Lia e moro no sertão, na Caatinga. Aqui chove pouco, então cada chuva é uma festa! Toque nos canos para girar e levar a água do telhado até a cisterna.');
  novoNivel();
  return () => { clearInterval(timer); c.parar(); };
}

/* ================= JOGO 3: Vilas sobre a água ================= */
function jogoVilas(palco, api, p){
  semente = 33;
  let vivo = true, fase = 'base', testando = false, boiando = false, vistos = {};
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const CX = 470, AG0 = 330, SOBE = 60, PEND = 270, FUNDO = 468, TOPO = 163, GANCHO = 104;
  /* ---------- montanhas ---------- */
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const SERRA1 = [[-10, 240], [40, 214], [70, 222], [110, 186], [150, 148], [176, 168], [204, 160], [236, 192], [276, 206], [318, 178], [350, 150], [376, 120], [400, 146], [426, 140], [456, 176], [500, 200], [548, 172], [590, 138], [622, 112], [650, 136], [676, 128], [716, 170], [760, 188], [810, 160]];
  const SERRA2 = [[-10, 276], [36, 258], [72, 266], [120, 236], [168, 262], [214, 248], [262, 274], [312, 246], [360, 268], [414, 240], [466, 266], [520, 250], [566, 272], [616, 244], [664, 264], [716, 236], [764, 258], [810, 248]];
  const serra = (pts, base) => `M-10 ${base} ` + pts.map(([x, y]) => `L${x} ${y}`).join(' ') + ` L810 ${base}Z`;
  const facetas = (pts, base, cor, op) => pts.slice(1, -1).map((pk, i) => { const v = pts[i + 2]; if (pk[1] > pts[i][1] || pk[1] > v[1]) return ''; return `<path d="M${pk[0]} ${pk[1]} L${v[0]} ${v[1]} L${(v[0] - 8).toFixed(0)} ${base} L${(pk[0] + 10).toFixed(0)} ${base}Z" fill="${cor}" opacity="${op}"/>`; }).join('');
  const neve = (pts, f) => pts.slice(1, -1).map((pk, i) => {
    const a = pts[i], b = pts[i + 2]; if (pk[1] > 160 || pk[1] > a[1] || pk[1] > b[1]) return '';
    const L = lerp(pk, a, f), Rr = lerp(pk, b, f); let zig = '';
    for (let k = 1; k < 6; k++) { const q = lerp(Rr, L, k / 6); zig += ` L${q[0].toFixed(1)} ${(q[1] + (k % 2 ? 9 : -2) + R(-2, 2)).toFixed(1)}`; }
    const m = lerp(Rr, L, .5);
    return `<path d="M${pk[0]} ${pk[1]} L${Rr[0].toFixed(1)} ${Rr[1].toFixed(1)}${zig} L${L[0].toFixed(1)} ${L[1].toFixed(1)}Z" fill="url(#viNeve)" stroke="#8C9CC8" stroke-width="1.4" stroke-linejoin="round"/><path d="M${pk[0]} ${pk[1]} L${Rr[0].toFixed(1)} ${Rr[1].toFixed(1)} L${(m[0] + 4).toFixed(1)} ${(m[1] + 6).toFixed(1)}Z" fill="#C3D0EE" opacity=".9"/><path d="M${pk[0] - 2} ${pk[1] + 4} L${(L[0] + 6).toFixed(1)} ${(L[1] - 2).toFixed(1)}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  /* ---------- plantas ---------- */
  const totora = (x0, x1, base, n, h0, h1, frente) => Array.from({ length:n }, (_, i) => {
    const x = x0 + (x1 - x0) * (i + R(-.3, .3)) / n, h = R(h0, h1), dx = R(-14, 14), topo = base - h, cor = ['#6E9A3A', '#7FA845', '#5E8A32', '#8AB04E'][i % 4];
    return `<g class="balanca" style="animation-duration:${R(3.5, 6).toFixed(1)}s;animation-delay:${R(-5, 0).toFixed(1)}s"><path d="M${x.toFixed(1)} ${base} Q${(x + dx * .3).toFixed(1)} ${(base - h * .5).toFixed(1)} ${(x + dx).toFixed(1)} ${topo.toFixed(1)}" stroke="#3E5E1E" stroke-width="${frente ? 5.4 : 4}" fill="none" stroke-linecap="round"/><path d="M${x.toFixed(1)} ${base} Q${(x + dx * .3).toFixed(1)} ${(base - h * .5).toFixed(1)} ${(x + dx).toFixed(1)} ${topo.toFixed(1)}" stroke="${cor}" stroke-width="${frente ? 3 : 2.2}" fill="none" stroke-linecap="round"/>${i % 2 ? `<path d="M${(x + dx * .96).toFixed(1)} ${(topo + 10).toFixed(1)} q-6 -2 -5 -9 q5 1 5 9 q3 -6 9 -6 q-2 6 -9 6Z" fill="#9A6A2E" stroke="#5A3A14" stroke-width="1"/>` : ''}</g>`;
  }).join('');
  const arvore = (x, y, s, c1, c2, esc, tronco) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 0 C-3 -16 -6 -30 -2 -44 M2 0 C3 -16 5 -28 2 -44 M0 -30 C6 -36 12 -40 16 -48 M-1 -24 C-8 -30 -12 -36 -16 -42" stroke="${tronco}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${copa(0, -58, 34, 24, 9, .3)}" fill="${c2}" stroke="${esc}" stroke-width="2"/><path d="${copa(-6, -64, 24, 16, 8, .28)}" fill="${c1}"/><path d="M-22 -66 q10 -12 24 -10" stroke="#fff" stroke-width="2.4" fill="none" opacity=".35" stroke-linecap="round"/></g>`;
  const pato = (x, y, s, filhote) => filhote
    ? `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 C-14 -10 -6 -14 2 -12 C10 -10 12 -4 10 0 C4 3 -6 3 -12 0Z" fill="url(#viPatinho)" stroke="#A8780E" stroke-width="1.6"/><path d="M-12 -2 l-4 -4 l2 6Z" fill="#F2C43A" stroke="#A8780E" stroke-width="1.2"/><circle cx="6" cy="-15" r="6.4" fill="url(#viPatinho)" stroke="#A8780E" stroke-width="1.6"/><path d="M11 -15 q5 0 7 2 q-3 2 -7 1Z" fill="#FF8A2E" stroke="#B8500E" stroke-width="1"/><circle cx="8" cy="-16.6" r="1.6" fill="#12121A"/><circle cx="8.5" cy="-17.2" r=".55" fill="#fff"/><path d="M-6 -6 q5 -3 10 0" stroke="#FFF6C4" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`
    : `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 -4 C-30 -16 -18 -22 -4 -20 C8 -18 18 -12 18 -2 C10 4 -14 4 -26 -4Z" fill="url(#viPato)" stroke="#6E4A22" stroke-width="1.8" stroke-linejoin="round"/><path d="M-26 -4 L-34 -12 L-28 -2Z" fill="#B88A52" stroke="#6E4A22" stroke-width="1.4" stroke-linejoin="round"/><path d="M-14 -12 C-6 -18 6 -16 10 -8 C2 -6 -8 -6 -14 -12Z" fill="#A87A44" stroke="#6E4A22" stroke-width="1.2"/><path d="M-8 -12 h14" stroke="#2E6ABE" stroke-width="2.4" stroke-linecap="round"/><path d="M10 -14 C8 -24 10 -32 18 -34 C26 -35 30 -28 28 -22 C26 -18 20 -16 16 -12Z" fill="url(#viPatoC)" stroke="#1E4A2E" stroke-width="1.6"/><path d="M27 -27 q8 0 11 3 q-4 3 -11 2Z" fill="#FFB02E" stroke="#B86A0E" stroke-width="1.2"/><circle cx="23" cy="-28" r="2" fill="#12121A"/><circle cx="23.7" cy="-28.7" r=".7" fill="#fff"/><path d="M12 -17 h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M-18 -14 q10 -6 22 -4" stroke="#F2DDB8" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"/></g>`;
  const peixe = (x, y, s, c0, c1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 C-8 -9 8 -9 14 0 C8 8 -8 8 -14 0Z" fill="${c0}" stroke="${c1}" stroke-width="1.6"/><path d="M-13 0 L-22 -7 L-20 0 L-22 7Z" fill="${c0}" stroke="${c1}" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 -6 q4 -6 8 -2" fill="${c0}" stroke="${c1}" stroke-width="1.2"/><circle cx="7" cy="-1.4" r="2" fill="#fff"/><circle cx="7.4" cy="-1.4" r="1.1" fill="#12121A"/><path d="M-6 -3 q6 -3 12 -1" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  /* ---------- casa flutuante (origem = linha d'água no meio da base) ---------- */
  const telhas = Array.from({ length:5 }, (_, k) => { const y = -144 + k * 9.6, hw = 56 + (y + 150) / 50 * 34; let d = `M${(-hw).toFixed(1)} ${y.toFixed(1)}`; const n = Math.round(hw * 2 / 12); for (let i = 0; i < n; i++) d += ` q${(hw / n).toFixed(2)} 6 ${(hw * 2 / n).toFixed(2)} 0`; return d; }).join(' ');
  const grade = lado => [0, 1, 2].map(i => `<path d="M${lado * (118 - i * 18)} -26 V-50" stroke="#5A3414" stroke-width="4" stroke-linecap="round"/><path d="M${lado * (118 - i * 18)} -26 V-50" stroke="#C9894A" stroke-width="1.8" stroke-linecap="round"/>`).join('') + `<path d="M${lado * 120} -48 H${lado * 80} M${lado * 120} -38 H${lado * 80}" stroke="#5A3414" stroke-width="3.6" stroke-linecap="round"/><path d="M${lado * 120} -48.6 H${lado * 80}" stroke="#E0A868" stroke-width="1.4" stroke-linecap="round"/>`;
  const janela = x => `<rect x="${x - 3}" y="-87" width="38" height="31" rx="4" fill="#FFF6DA" stroke="#5A3414" stroke-width="2"/><rect x="${x + 1}" y="-83" width="30" height="23" rx="2" fill="url(#viVidro)" stroke="#1E4A7A" stroke-width="1.6"/><path d="M${x + 16} -83 V-60 M${x + 1} -71.5 H${x + 31}" stroke="#FFF6DA" stroke-width="2.6"/><path d="M${x + 4} -80 l6 0 M${x + 4} -76 l3 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M${x + 1} -83 C${x + 8} -78 ${x + 8} -68 ${x + 3} -60 H${x + 1}Z M${x + 31} -83 C${x + 24} -78 ${x + 24} -68 ${x + 29} -60 H${x + 31}Z" fill="#FF8AA8" stroke="#B83A62" stroke-width="1"/><rect x="${x - 4}" y="-56" width="40" height="7" rx="2" fill="#B8642E" stroke="#5A3414" stroke-width="1.6"/>${[4, 12, 20, 28].map((d, i) => `<circle cx="${x + d}" cy="-58" r="3.4" fill="${['#FF5E7E', '#FFD447', '#FF8A3D', '#C86AFF'][i]}" stroke="#7A2A3A" stroke-width=".9"/><circle cx="${x + d}" cy="-58" r="1.1" fill="#FFF6C4"/>`).join('')}<path d="M${x - 2} -56 q4 -6 8 -3 M${x + 32} -56 q-4 -6 -8 -3" stroke="#3E8A3A" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const CASA = `
    <ellipse cx="0" cy="-19" rx="124" ry="5" fill="#0B2A4A" opacity=".18"/>
    ${grade(-1)}${grade(1)}
    <rect x="-74" y="-104" width="148" height="80" fill="url(#viParede)" stroke="#1E5A5E" stroke-width="2.4"/>
    <g stroke="#1E6A6E" stroke-width="1.3" opacity=".55">${[-91, -78, -65, -52, -39].map(y => `<path d="M-74 ${y} H74"/>`).join('')}</g>
    <g stroke="#B8F0EA" stroke-width="1.2" opacity=".5">${[-90, -77, -64, -51, -38].map(y => `<path d="M-72 ${y} H-30"/>`).join('')}</g>
    <rect x="-74" y="-104" width="148" height="10" fill="#0B3A3E" opacity=".28"/>
    ${janela(-62)}${janela(30)}
    <path d="M-15 -24 V-66 C-15 -74 15 -74 15 -66 V-24Z" fill="url(#viPorta)" stroke="#8A4A10" stroke-width="2.2"/>
    <path d="M-10 -28 V-62 M10 -28 V-62" stroke="#C97A1E" stroke-width="1.4" opacity=".8"/><circle cx="9" cy="-44" r="2.4" fill="#5A3414"/><path d="M-11 -64 q8 -6 18 -2" stroke="#FFF2B0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-94 -98 L-56 -150 H56 L94 -98Z" fill="url(#viTelha)" stroke="#7A2A10" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="${telhas}" stroke="#A8401A" stroke-width="1.6" fill="none" opacity=".85"/>
    <path d="M-80 -104 L-52 -142" stroke="#FFC8A0" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
    <rect x="-62" y="-156" width="124" height="9" rx="4.5" fill="#C24A1E" stroke="#7A2A10" stroke-width="2.2"/><path d="M-56 -153.4 H40" stroke="#FFB08A" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M-96 -97 H96" stroke="#7A2A10" stroke-width="4" stroke-linecap="round"/>
    <rect x="30" y="-172" width="14" height="22" fill="#8A93A8" stroke="#3E465A" stroke-width="2"/><rect x="27" y="-176" width="20" height="6" rx="2" fill="#5E6678" stroke="#3E465A" stroke-width="1.8"/>
    <circle cx="0" cy="-160" r="5" fill="none" stroke="#5E6678" stroke-width="3"/><circle cx="0" cy="-160" r="5" fill="none" stroke="#C9D2E2" stroke-width="1.2"/>
    <g transform="translate(-100 -26)"><path d="M-8 0 C-10 -10 -6 -18 0 -18 C6 -18 10 -10 8 0Z" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.6"/><path d="M8 -2 C16 -2 18 -10 14 -14" stroke="#F29A3E" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="0" cy="-22" r="7" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.6"/><path d="M-6 -26 l-1 -7 l5 4 M6 -26 l1 -7 l-5 4" fill="#F29A3E" stroke="#8A4A10" stroke-width="1.4" stroke-linejoin="round"/><path d="M-3.6 -23 q1.2 -1.6 2.4 0 M1.2 -23 q1.2 -1.6 2.4 0" stroke="#3A1E0C" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="0" cy="-20" r=".9" fill="#B8406E"/><path d="M-4 -12 q4 -2 8 0" stroke="#FFD2A0" stroke-width="1.6" fill="none"/></g>
    <g transform="translate(100 -26)"><path d="M-8 0 L-10 -14 H10 L8 0Z" fill="#D8743E" stroke="#7A3A14" stroke-width="1.6"/><path d="M-11 -14 H11" stroke="#7A3A14" stroke-width="2.4" stroke-linecap="round"/><path d="${copa(0, -24, 13, 10, 7, .3)}" fill="#4FB050" stroke="#2E6A2A" stroke-width="1.6"/><circle cx="-4" cy="-28" r="2.6" fill="#FFD447" stroke="#B8860E" stroke-width=".8"/><circle cx="5" cy="-22" r="2.6" fill="#FF6E8E" stroke="#B83A5A" stroke-width=".8"/></g>
    <path d="M-124 -26 H124 V-17 H-124Z" fill="url(#viDeck)" stroke="#4E2A10" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M-122 -23.6 H122" stroke="#E8B47A" stroke-width="1.4" opacity=".8"/>
    <g stroke="#6E3E18" stroke-width="1.2">${Array.from({ length:15 }, (_, i) => `<path d="M${-112 + i * 16} -25 V-18"/>`).join('')}</g>`;
  const BASES = {
    vazia:`<g id="vi-ph"><rect x="-120" y="-18" width="240" height="34" rx="12" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-width="3" stroke-dasharray="10 7"/><g id="vi-seta"><path d="M-6 -4 h12 v8 h7 l-13 12 l-13 -12 h7Z" fill="#fff" stroke="#1B56C4" stroke-width="1.8" stroke-linejoin="round"/></g></g>`,
    totora:`<path d="M-128 -4 C-134 -14 -124 -20 -112 -19 H112 C124 -20 134 -14 128 -4 C134 6 126 17 110 17 H-110 C-126 17 -134 6 -128 -4Z" fill="url(#viTot)" stroke="#5E4210" stroke-width="2.4"/>
      <g stroke="#8A6A1E" stroke-width="1.3" fill="none" opacity=".75">${[-11, -5, 1, 7, 12].map((y, i) => `<path d="M${-124 + i % 2 * 4} ${y} C-60 ${y + 2} 60 ${y - 2} ${124 - i % 2 * 4} ${y}"/>`).join('')}</g>
      ${[-90, -34, 22, 78].map(x => `<path d="M${x} -19 C${x - 3} -6 ${x - 3} 6 ${x} 17" stroke="#4E3208" stroke-width="5" fill="none"/><path d="M${x} -19 C${x - 3} -6 ${x - 3} 6 ${x} 17" stroke="#B88A3A" stroke-width="1.8" fill="none"/>`).join('')}
      <path d="M-126 -20 C-110 -30 110 -30 126 -20 C112 -14 -112 -14 -126 -20Z" fill="url(#viTotN)" stroke="#8A6A1E" stroke-width="1.8"/>
      <g stroke="#B8962E" stroke-width="1" opacity=".8">${Array.from({ length:18 }, (_, i) => `<path d="M${-112 + i * 13} -24 l7 4"/>`).join('')}</g>
      <path d="M-127 -10 C-137 -14 -142 -26 -136 -36 C-133 -30 -130 -25 -122 -20Z M127 -10 C137 -14 142 -26 136 -36 C133 -30 130 -25 122 -20Z" fill="url(#viTotN)" stroke="#5E4210" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-110 -12 H96" stroke="#FFF2B8" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`,
    barril:[-120, 4].map((x, i) => `<rect x="${x}" y="-17" width="116" height="34" rx="13" fill="url(#viTam${i})" stroke="${i ? '#7A3A0A' : '#0E2E6E'}" stroke-width="2.4"/>
      <path d="M${x + 30} -16 V16 M${x + 86} -16 V16" stroke="${i ? '#B8560E' : '#1A4A9E'}" stroke-width="4"/><path d="M${x + 32} -15 V15 M${x + 88} -15 V15" stroke="#fff" stroke-width="1.2" opacity=".45"/>
      <rect x="${x + 52}" y="-21" width="12" height="6" rx="1.5" fill="#E9EEF6" stroke="#3E465A" stroke-width="1.4"/>
      <path d="M${x + 12} -9 H${x + 104}" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
      <path d="M${x + 6} -10 C${x + 2} -4 ${x + 2} 4 ${x + 6} 10" stroke="${i ? '#7A3A0A' : '#0E2E6E'}" stroke-width="1.6" fill="none" opacity=".6"/>`).join('') +
      [-104, -16, 20, 104].map(x => `<path d="M${x} -20 V16" stroke="#7A5A2E" stroke-width="3"/><path d="M${x} -20 V16" stroke="#E2C48A" stroke-width="1.2" stroke-dasharray="3 2"/>`).join(''),
    pedra:[[-56, -10, 30, 13], [52, -10, 32, 13], [-92, 2, 34, 16], [-34, 4, 32, 15], [26, 3, 34, 16], [88, 2, 34, 16]].map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#viPedra)" stroke="#3E465A" stroke-width="2.2"/><path d="M${x - rx * .6} ${y - ry * .3} q${rx * .4} ${-ry * .6} ${rx * .9} ${-ry * .5}" stroke="#E9EEF6" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M${x + rx * .1} ${y + ry * .1} l${rx * .2} ${ry * .4} l${-rx * .1} ${ry * .3}" stroke="#4E566A" stroke-width="1.2" fill="none" opacity="${i % 2 ? .8 : 0}"/>`).join(''),
    tijolo:`<rect x="-122" y="-19" width="244" height="36" rx="3" fill="#E8D2B0" stroke="#7A3A1E" stroke-width="2.2"/>` + [0, 1, 2].map(r => Array.from({ length:8 }, (_, i) => { const x = -122 + i * 32 - (r % 2) * 16, w = 30; const x0 = Math.max(-121, x), x1 = Math.min(121, x + w); return x1 - x0 < 6 ? '' : `<rect x="${x0 + 1}" y="${-18 + r * 11.6}" width="${x1 - x0 - 2}" height="10" rx="1.6" fill="url(#viTij)" stroke="#8E3A1C" stroke-width="1.2"/><path d="M${x0 + 4} ${-15.6 + r * 11.6} h${Math.max(2, x1 - x0 - 14)}" stroke="#FFB08A" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>`; }).join('')).join('')
  };
  /* ---------- casa da margem (adobe e palha) ---------- */
  const palha = Array.from({ length:26 }, (_, i) => { const x = -66 + i * 5.3; return `M${x.toFixed(1)} ${(-60 - (1 - Math.abs(x) / 70) * 44 + 4).toFixed(1)} L${(x * 1.06).toFixed(1)} -58`; }).join(' ');
  const adobe = Array.from({ length:5 }, (_, r) => `M-54 ${-16 - r * 10} H54 ` + Array.from({ length:6 }, (_, i) => `M${-48 + i * 20 + (r % 2) * 10} ${-16 - r * 10} v10`).join(' ')).join(' ');
  const MARGEM = `<g id="vi-margem" class="toque" transform="translate(96 306)">
      <ellipse cx="0" cy="2" rx="74" ry="6" fill="#2E4A1A" opacity=".28"/>
      <rect x="-54" y="-66" width="108" height="60" fill="url(#viAdobe)" stroke="#7A4A22" stroke-width="2.2"/>
      <path d="${adobe}" stroke="#A86E3E" stroke-width="1.2" fill="none" opacity=".55"/>
      <rect x="-54" y="-66" width="108" height="8" fill="#5A2E10" opacity=".22"/>
      <path d="M-62 -6 H62 V2 H-62Z" fill="#9AA0B0" stroke="#4E566A" stroke-width="1.8"/><path d="M-50 -6 v8 M-30 -6 v8 M-6 -6 v8 M18 -6 v8 M40 -6 v8" stroke="#4E566A" stroke-width="1.2"/>
      <path d="M-12 -6 V-36 C-12 -46 12 -46 12 -36 V-6Z" fill="url(#viPortaAzul)" stroke="#12356E" stroke-width="2"/><path d="M-4 -40 V-8 M4 -40 V-8" stroke="#123E8E" stroke-width="1.2" opacity=".7"/><circle cx="7" cy="-22" r="1.8" fill="#FFD447"/>
      ${[-40, 26].map(x => `<rect x="${x}" y="-50" width="16" height="16" fill="#FFE9A8" stroke="#5A3414" stroke-width="1.8"/><path d="M${x + 8} -50 v16 M${x} -42 h16" stroke="#5A3414" stroke-width="1.4"/><path d="M${x} -50 l-7 2 v12 l7 2Z M${x + 16} -50 l7 2 v12 l-7 2Z" fill="#2E7BF6" stroke="#12356E" stroke-width="1.4" stroke-linejoin="round"/>`).join('')}
      <path d="M-72 -56 C-50 -80 -24 -104 0 -108 C24 -104 50 -80 72 -56 C40 -62 -40 -62 -72 -56Z" fill="url(#viPalha)" stroke="#7A5418" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="${palha}" stroke="#A8802E" stroke-width="1.2" opacity=".8"/>
      <path d="M-72 -56 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l4 -5 l5 6 l2 -6" fill="#D8AE52" stroke="#7A5418" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-40 -84 C-24 -98 -8 -104 6 -104" stroke="#FFF0B0" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <g transform="translate(36 -6)"><path d="M-7 0 C-10 -8 -8 -14 0 -14 C8 -14 10 -8 7 0Z" fill="#C8642E" stroke="#6E2E10" stroke-width="1.4"/><path d="M-6 -10 h12" stroke="#FFD447" stroke-width="1.6"/><path d="M0 -14 C-4 -22 -10 -24 -12 -22 M0 -14 C2 -24 8 -26 10 -22" stroke="#3E8A3A" stroke-width="2" fill="none"/><circle cx="-12" cy="-22" r="2.4" fill="#FF6E8E"/><circle cx="10" cy="-23" r="2.4" fill="#FFD447"/></g>
      <rect x="-76" y="-112" width="152" height="118" fill="transparent"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Lago entre montanhas nevadas, com uma casa de adobe na margem, um píer com guindaste e uma casa esperando a base para boiar">
    <defs>
      <linearGradient id="viCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA8EE"/><stop offset=".55" stop-color="#A8DBFA"/><stop offset="1" stop-color="#F4F2E2"/></linearGradient>
      <radialGradient id="viSolG" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".6" stop-color="#FFD447"/><stop offset="1" stop-color="#F4A21E"/></radialGradient>
      <linearGradient id="viNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2EAF8"/></linearGradient>
      <linearGradient id="viSerra1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA6D8"/><stop offset="1" stop-color="#C6CDEA"/></linearGradient>
      <linearGradient id="viSerra2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E96B8"/><stop offset="1" stop-color="#A9BCCB"/></linearGradient>
      <linearGradient id="viMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C86A"/><stop offset="1" stop-color="#6E9A48"/></linearGradient>
      <linearGradient id="viNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2E2" stop-opacity="0"/><stop offset="1" stop-color="#F4F2E2" stop-opacity=".75"/></linearGradient>
      <linearGradient id="viLago" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AD2F2"/><stop offset=".25" stop-color="#3FA0DE"/><stop offset="1" stop-color="#1E5AA6"/></linearGradient>
      <linearGradient id="viFrente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5CC2F0" stop-opacity=".3"/><stop offset=".3" stop-color="#2E88D6" stop-opacity=".42"/><stop offset="1" stop-color="#103E86" stop-opacity=".62"/></linearGradient>
      <linearGradient id="viRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="viFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2C88A"/><stop offset="1" stop-color="#A8864E"/></linearGradient>
      <linearGradient id="viTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A060"/><stop offset="1" stop-color="#B8763E"/></linearGradient>
      <linearGradient id="viGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED45E"/><stop offset="1" stop-color="#5EA23A"/></linearGradient>
      <linearGradient id="viAdobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2C894"/><stop offset="1" stop-color="#D49A62"/></linearGradient>
      <linearGradient id="viPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DA7A"/><stop offset="1" stop-color="#C8963A"/></linearGradient>
      <linearGradient id="viPortaAzul" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5EA8FF"/><stop offset="1" stop-color="#1E5AC4"/></linearGradient>
      <linearGradient id="viParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EE0D2"/><stop offset="1" stop-color="#2EA6A2"/></linearGradient>
      <linearGradient id="viTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A5A"/><stop offset="1" stop-color="#D2501E"/></linearGradient>
      <linearGradient id="viDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8975A"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="viPorta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F2A81E"/></linearGradient>
      <linearGradient id="viVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8F2FF"/><stop offset="1" stop-color="#6EB8F0"/></linearGradient>
      <linearGradient id="viTot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C25A"/><stop offset=".6" stop-color="#B88A2E"/><stop offset="1" stop-color="#7A5A1E"/></linearGradient>
      <linearGradient id="viTotN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#E8C25A"/></linearGradient>
      <linearGradient id="viTam0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC0FF"/><stop offset=".35" stop-color="#3E8AF0"/><stop offset="1" stop-color="#1A4AA8"/></linearGradient>
      <linearGradient id="viTam1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC27A"/><stop offset=".35" stop-color="#FF8A2E"/><stop offset="1" stop-color="#C2520E"/></linearGradient>
      <radialGradient id="viPedra" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#C6CCDA"/><stop offset=".6" stop-color="#8A93A8"/><stop offset="1" stop-color="#5E6678"/></radialGradient>
      <linearGradient id="viTij" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F08A5A"/><stop offset="1" stop-color="#C2502A"/></linearGradient>
      <linearGradient id="viMadeira" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E0A260"/><stop offset="1" stop-color="#A8682E"/></linearGradient>
      <linearGradient id="viPato" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8CFA2"/><stop offset="1" stop-color="#B8884E"/></linearGradient>
      <linearGradient id="viPatoC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4EC27A"/><stop offset="1" stop-color="#1E7A4A"/></linearGradient>
      <linearGradient id="viPatinho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#F6C83A"/></linearGradient>
      <radialGradient id="viRaG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#B8C27A"/><stop offset="1" stop-color="#6E7A3A"/></radialGradient>
      <linearGradient id="viNuvemE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A96B2"/><stop offset="1" stop-color="#5E6A88"/></linearGradient>
      <radialGradient id="viVinheta" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#06204A" stop-opacity="0"/><stop offset="1" stop-color="#06204A" stop-opacity=".32"/></radialGradient>
      <filter id="viGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
      <clipPath id="viAguaClip"><rect x="0" y="${AG0 - SOBE - 4}" width="800" height="300"/></clipPath>
    </defs>
    <rect width="800" height="500" fill="url(#viCeu)"/>
    <g id="vi-arco" opacity="0" style="transition:opacity 2.4s" fill="none" stroke-width="11">${['#FF5E5E', '#FFA03E', '#FFE04A', '#5ED46A', '#4EA8FF', '#9A6AFF'].map((c, i) => `<path d="M${60 + i * 11} 330 A${250 - i * 11} ${230 - i * 11} 0 0 1 ${560 - i * 11} 330" stroke="${c}" opacity=".55"/>`).join('')}</g>
    <g id="vi-sol" class="toque" style="transform-origin:96px 76px"><circle cx="96" cy="76" r="62" fill="#FFF2B0" opacity=".3"/><circle cx="96" cy="76" r="46" fill="#FFE27A" opacity=".35"/><circle cx="96" cy="76" r="31" fill="url(#viSolG)" stroke="#E8961E" stroke-width="2.6"/><path d="M80 64 q9 -10 22 -9" stroke="#FFFBE0" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="574" y="104" width="86" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="160" y="132" width="64" height="30" style="color:#fff" opacity=".7"/></g>
    <path d="${serra(SERRA1, 330)}" fill="url(#viSerra1)" stroke="#7480B8" stroke-width="2" stroke-linejoin="round"/>
    ${facetas(SERRA1, 330, '#6E78B0', .35)}
    ${neve(SERRA1, .36)}
    <rect y="200" width="800" height="130" fill="url(#viNevoa)"/>
    <path d="${serra(SERRA2, 330)}" fill="url(#viSerra2)" stroke="#56709A" stroke-width="2" stroke-linejoin="round"/>
    ${facetas(SERRA2, 330, '#4E6890', .32)}
    <g stroke="#C8D8E6" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round">${SERRA2.slice(1, -1).filter((pk, i) => pk[1] < SERRA2[i][1] && pk[1] < SERRA2[i + 2][1]).map(([x, y]) => `<path d="M${x - 3} ${y + 4} L${x - 22} ${y + 26}"/>`).join('')}</g>
    <path d="M-10 336 V300 C40 288 90 290 140 297 C190 304 236 292 292 295 C350 298 384 286 444 290 C504 294 546 300 604 292 C664 284 722 296 810 289 V336Z" fill="url(#viMorro)" stroke="#4E7A30" stroke-width="2"/>
    <g fill="none" stroke-linecap="round">${[[300, 304, 420], [330, 314, 400], [470, 300, 590], [500, 311, 580]].map(([x0, y, x1], i) => `<path d="M${x0} ${y} C${(x0 + x1) / 2} ${y - 5} ${(x0 + x1) / 2} ${y - 5} ${x1} ${y}" stroke="${i % 2 ? '#D8C26A' : '#8AB04E'}" stroke-width="5"/><path d="M${x0} ${y + 2.6} C${(x0 + x1) / 2} ${y - 2.4} ${(x0 + x1) / 2} ${y - 2.4} ${x1} ${y + 2.6}" stroke="#5E8A38" stroke-width="1.2" opacity=".7"/>`).join('')}</g>
    <g>${[[330, 300, '#3E8A5A', '#2A6A44'], [356, 296, '#5EA04A', '#3E7A2A'], [610, 296, '#2E7A6A', '#1E5A4A'], [640, 292, '#7AAE3E', '#4E7A22']].map(([x, y, c, e]) => `<path d="${copa(x, y - 8, 11, 9, 7, .3)}" fill="${c}" stroke="${e}" stroke-width="1.4"/><path d="M${x} ${y} v6" stroke="#6E4A22" stroke-width="2.4"/>`).join('')}</g>
    <g class="deriva" style="animation-duration:20s"><g style="animation:flutua 1.4s ease-in-out infinite alternate" stroke="#2E3A5A" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M520 126 q6 -6 12 0 q6 -6 12 0"/><path d="M552 142 q5 -5 10 0 q5 -5 10 0"/><path d="M500 150 q4 -4 8 0 q4 -4 8 0"/></g></g>
    <g id="vi-nuvem" class="toque" style="transition:opacity .5s" opacity=".6">
      <g id="vi-nuvem-esc" opacity="0" style="transition:opacity 1s"><use href="#nuvem" x="196" y="2" width="244" height="118" style="color:#5E6A88"/></g>
      <use href="#nuvem" x="206" y="10" width="226" height="108" style="color:#B8C6DE"/><use href="#nuvem" x="212" y="12" width="214" height="100" style="color:#fff"/>
      <g id="vi-nuvem-cinza" opacity="0" style="transition:opacity 1s"><use href="#nuvem" x="212" y="12" width="214" height="100" style="color:#A2AEC8"/></g>
      <path d="M262 52 q16 -12 36 -6" stroke="#fff" stroke-width="4.6" fill="none" stroke-linecap="round" opacity=".9"/>
      <g id="vi-nuvem-dica" style="display:none">${brilhoHotspot(410, 34)}${brilhoHotspot(236, 92)}</g>
      <rect x="200" y="6" width="236" height="110" fill="transparent"/></g>
    <g id="vi-guindaste">
      <path d="M764 262 L770 30 M784 262 L778 30" stroke="#4E2A10" stroke-width="7" stroke-linecap="round"/><path d="M764 262 L770 30 M784 262 L778 30" stroke="url(#viMadeira)" stroke-width="4" stroke-linecap="round"/>
      <path d="${Array.from({ length:6 }, (_, i) => { const y = 250 - i * 36; return `M765 ${y} L783 ${y - 32} M783 ${y} L765 ${y - 32}`; }).join(' ')}" stroke="#7A4A1E" stroke-width="2.2"/>
      <path d="M774 22 L452 52 M774 22 L798 52" stroke="#4E566A" stroke-width="1.6"/>
      <path d="M446 50 H800 M450 64 H800" stroke="#4E2A10" stroke-width="7" stroke-linecap="round"/><path d="M446 50 H800 M450 64 H800" stroke="#E0A260" stroke-width="3.6" stroke-linecap="round"/>
      <path d="${Array.from({ length:17 }, (_, i) => `M${454 + i * 20} 64 L${464 + i * 20} 50`).join(' ')}" stroke="#7A4A1E" stroke-width="2.2"/>
      <path d="M774 120 L700 64" stroke="#4E2A10" stroke-width="6" stroke-linecap="round"/><path d="M774 120 L700 64" stroke="#C9894A" stroke-width="3" stroke-linecap="round"/>
      <rect x="780" y="66" width="20" height="30" rx="3" fill="#8A93A8" stroke="#3E465A" stroke-width="2"/><path d="M780 76 h20 M780 86 h20" stroke="#3E465A" stroke-width="1.2"/>
      <path d="M774 22 V8" stroke="#4E2A10" stroke-width="3"/><path d="M775 8 l18 5 l-18 5Z" fill="#FF6E3E" stroke="#8A2E10" stroke-width="1.4" stroke-linejoin="round"/>
      <rect x="456" y="64" width="28" height="12" rx="3" fill="#FFC83D" stroke="#7A4A0E" stroke-width="2"/><circle cx="470" cy="78" r="6" fill="#C9D2E2" stroke="#3E465A" stroke-width="2"/><circle cx="470" cy="78" r="1.8" fill="#3E465A"/>
    </g>
    <g id="vi-lago"><rect x="0" y="${AG0}" width="800" height="300" fill="url(#viLago)"/>
      <ellipse id="vi-sombra" cx="${CX}" cy="${AG0 + 24}" rx="128" ry="11" fill="#0B2E6A" opacity="0" style="transition:opacity .8s"/>
      <g opacity=".5">${[[380, 60], [520, 44], [660, 70]].map(([x, w]) => `<path d="M${x} ${AG0} L${x + w} ${AG0} L${x + w * 1.8} 490 L${x - w * .5} 490Z" fill="url(#viRaio)"/>`).join('')}</g></g>
    <g id="vi-fundo">
      <path d="M200 500 C260 478 330 470 420 474 C520 478 600 466 700 470 C750 472 780 468 810 466 V510 H200Z" fill="url(#viFundo)" stroke="#8A6A3A" stroke-width="2"/>
      <g fill="#8A93A8" stroke="#4E566A" stroke-width="1.4">${[[372, 480, 9, 5], [452, 482, 6, 4], [606, 476, 10, 6], [690, 478, 7, 4], [520, 486, 5, 3]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      ${[[400, 480, 50], [430, 478, 38], [584, 474, 46], [648, 474, 58], [720, 472, 40]].map(([x, y, h], i) => `<g class="balanca" style="animation-duration:${4 + i % 3}s;animation-delay:${-i}s"><path d="M${x} ${y} C${x - 8} ${y - h * .4} ${x + 8} ${y - h * .7} ${x - 2} ${y - h}" stroke="#2E6A3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x - 8} ${y - h * .4} ${x + 8} ${y - h * .7} ${x - 2} ${y - h}" stroke="#4EA85A" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[.3, .55, .8].map((k, j) => `<path d="M${x + (j % 2 ? 2 : -2)} ${(y - h * k).toFixed(0)} q${j % 2 ? 9 : -9} -3 ${j % 2 ? 12 : -12} -9" stroke="#4EA85A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</g>`).join('')}
      <g id="vi-peixes" class="toque"><g id="vi-peixes-vira"><g id="vi-peixes-in">${peixe(0, 0, 1, '#FFB347', '#A8620E')}${peixe(-34, 12, .8, '#FFC86A', '#A8620E')}${peixe(-22, -14, .7, '#FF9A5A', '#A8420E')}<rect x="-60" y="-26" width="86" height="50" fill="transparent"/></g></g></g>
      <g id="vi-ra" class="toque" transform="translate(560 476)"><g id="vi-ra-in" style="transform-origin:0 0"><ellipse cx="0" cy="2" rx="26" ry="5" fill="#5A4A2A" opacity=".3"/><path d="M-24 0 C-30 -4 -32 -10 -26 -12 M24 0 C30 -4 32 -10 26 -12" stroke="#5E6A2E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-22 0 C-26 -16 -12 -22 0 -22 C12 -22 26 -16 22 0 C14 4 -14 4 -22 0Z" fill="url(#viRaG)" stroke="#3E4A1E" stroke-width="1.8"/><path d="M-18 -4 q4 3 8 0 q4 3 8 0 q4 3 8 0 q4 3 8 0" stroke="#4E5A22" stroke-width="1.2" fill="none"/><path d="M-12 -18 q12 -6 24 0" stroke="#D8E09A" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/><circle cx="-8" cy="-20" r="5" fill="#C8D27A" stroke="#3E4A1E" stroke-width="1.4"/><circle cx="8" cy="-20" r="5" fill="#C8D27A" stroke="#3E4A1E" stroke-width="1.4"/><circle cx="-8" cy="-20" r="2.4" fill="#12121A"/><circle cx="8" cy="-20" r="2.4" fill="#12121A"/><circle cx="-7.2" cy="-20.8" r=".9" fill="#fff"/><circle cx="8.8" cy="-20.8" r=".9" fill="#fff"/><path d="M-6 -10 q6 3 12 0" stroke="#3E4A1E" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><rect x="-34" y="-30" width="68" height="40" fill="transparent"/></g>
    </g>
    <g id="vi-terra">
      <path d="M-10 302 C60 298 150 298 196 304 C228 308 244 320 256 342 C272 374 294 426 320 476 C326 488 330 496 334 510 H-10Z" fill="url(#viTerra)" stroke="#6E4220" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M246 326 C262 352 284 410 306 456 C314 474 322 492 330 510 H300 C292 488 282 466 270 444 C254 412 240 380 222 352Z" fill="#E2C48A" opacity=".75"/>
      <path d="M-10 350 C80 344 180 352 268 356 M-10 410 C90 404 200 412 296 420" stroke="#A8743E" stroke-width="3" fill="none" opacity=".55"/>
      <g fill="#9AA0B0" stroke="#5E6678" stroke-width="1.4">${[[40, 380, 10, 6], [150, 440, 12, 7], [230, 392, 8, 5], [90, 470, 9, 5], [210, 470, 11, 6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <path d="M-10 302 C60 298 150 298 196 304 C222 307 236 314 246 326 C200 318 120 316 -10 318Z" fill="url(#viGrama)" stroke="#3E7A2A" stroke-width="2"/>
      <path d="M10 304 C60 300 120 300 180 305" stroke="#D8F2A0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      ${capimJS(0, 240, 304, 26)}
      ${arvore(196, 304, 1.05, '#4E9A6A', '#2E7A54', '#1E5A3A', '#B8502E')}
      ${MARGEM}
      <g>${[[20, 300, '#FF6E8E'], [32, 304, '#FFD447'], [168, 302, '#C86AFF'], [180, 306, '#FF6E8E'], [228, 312, '#FFD447']].map(([x, y, c]) => `<path d="M${x} ${y + 6} v-8" stroke="#3E7A2A" stroke-width="1.6"/><circle cx="${x}" cy="${y - 3}" r="3.4" fill="${c}" stroke="#7A2A3A" stroke-width=".8"/><circle cx="${x}" cy="${y - 3}" r="1.1" fill="#FFF6C4"/>`).join('')}</g>
    </g>
    <g id="vi-pier">
      ${[652, 700, 748, 794].map(x => `<rect x="${x - 6}" y="262" width="12" height="${470 - 262 + (x > 700 ? 0 : 4)}" fill="url(#viMadeira)" stroke="#4E2A10" stroke-width="2"/>`).join('')}
      <path d="M652 300 L700 350 M700 300 L652 350 M700 300 L748 350 M748 300 L700 350 M748 300 L794 350 M794 300 L748 350" stroke="#7A4A1E" stroke-width="3" opacity=".9"/>
      <path d="M640 256 H800 V266 H640Z" fill="url(#viDeck)" stroke="#4E2A10" stroke-width="2.2"/><path d="M642 258.6 H800" stroke="#F2C48A" stroke-width="1.4"/>
      <g stroke="#6E3E18" stroke-width="1.2">${Array.from({ length:10 }, (_, i) => `<path d="M${650 + i * 16} 257 v8"/>`).join('')}</g>
      <g transform="translate(744 248)"><circle r="11" fill="#C9894A" stroke="#4E2A10" stroke-width="2"/><path d="M-11 0 H11 M0 -11 V11" stroke="#4E2A10" stroke-width="2"/><circle r="3" fill="#FFC83D" stroke="#4E2A10" stroke-width="1.2"/><path d="M8 -8 l8 -8" stroke="#4E2A10" stroke-width="3" stroke-linecap="round"/></g>
      <g id="vi-regua" class="toque"><rect x="626" y="246" width="20" height="214" rx="3" fill="#FFFDF4" stroke="#3E465A" stroke-width="2"/>
        ${Array.from({ length:21 }, (_, i) => `<path d="M626 ${256 + i * 10} h${i % 3 ? 6 : 12}" stroke="${256 + i * 10 < 300 ? '#E5392C' : 256 + i * 10 < 330 ? '#E8961E' : '#1E5AC4'}" stroke-width="${i % 3 ? 1.4 : 2.4}"/>`).join('')}
        <rect x="620" y="240" width="32" height="226" fill="transparent"/></g>
      <g id="vi-garca" class="toque" transform="translate(704 258)"><g id="vi-garca-in">
        <path d="M-4 0 L-2 -24 M6 0 L4 -24" stroke="#2E2E3A" stroke-width="2.4" stroke-linecap="round"/><path d="M-9 0 h9 M2 0 h9" stroke="#2E2E3A" stroke-width="2" stroke-linecap="round"/>
        <path d="M-20 -34 C-18 -46 4 -48 14 -38 C18 -32 12 -24 0 -22 C-10 -22 -20 -26 -26 -22 C-26 -28 -22 -32 -20 -34Z" fill="#FFFFFF" stroke="#5E6A88" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M-14 -36 C-6 -42 4 -40 10 -36" stroke="#D8E0F0" stroke-width="2" fill="none"/>
        <g id="vi-garca-pesc"><path d="M10 -38 C18 -48 8 -58 14 -68 C18 -74 26 -74 28 -68" stroke="#5E6A88" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M10 -38 C18 -48 8 -58 14 -68 C18 -74 26 -74 28 -68" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M28 -70 l18 3 l-18 2Z" fill="#FFC83D" stroke="#B8860E" stroke-width="1.2" stroke-linejoin="round"/><circle cx="24" cy="-70" r="1.8" fill="#12121A"/><circle cx="24.5" cy="-70.6" r=".6" fill="#fff"/></g>
        <rect x="-30" y="-80" width="80" height="82" fill="transparent"/></g></g>
    </g>
    ${totora(222, 262, 420, 7, 120, 160, false)}
    <g id="vi-casa" style="transition:opacity .45s"><g id="vi-base-in">${BASES.vazia}</g>${CASA}</g>
    <path id="vi-corda" d="M${CX} 84 V${PEND - TOPO}" stroke="#7A5A2E" stroke-width="2.6"/>
    <g id="vi-gancho" transform="translate(${CX} ${PEND - TOPO})"><path d="M0 -8 V-2 C0 2 -6 2 -6 -2" stroke="#4E566A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M0 -8 V-2 C0 2 -6 2 -6 -2" stroke="#C9D2E2" stroke-width="1.4" fill="none" stroke-linecap="round"/><rect x="-5" y="-16" width="10" height="9" rx="2" fill="#FFC83D" stroke="#7A4A0E" stroke-width="1.6"/></g>
    <g id="vi-frente" pointer-events="none"><rect x="0" y="${AG0}" width="800" height="300" fill="url(#viFrente)"/>
      <rect x="0" y="${AG0}" width="800" height="6" fill="#fff" opacity=".22"/>
      <path d="M0 ${AG0} ${Array.from({ length:40 }, () => 'q10 -3.4 20 0').join(' ')}" stroke="#F2FBFF" stroke-width="2.6" fill="none"/>
      <path d="M0 ${AG0 + 7} ${Array.from({ length:27 }, () => 'q15 3 30 0').join(' ')}" stroke="#BFE8FF" stroke-width="1.4" fill="none" opacity=".6"/>
      <g fill="#fff">${Array.from({ length:12 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .41 % 2.4).toFixed(2)}s" x="${(280 + (i * 61) % 500).toFixed(0)}" y="${(AG0 + 12 + (i * 9) % 30).toFixed(0)}" width="${10 + i % 3 * 6}" height="2.4" rx="1.2" opacity=".7"/>`).join('')}</g></g>
    <g id="vi-sup">
      <g id="vi-espuma" transform="translate(${CX} ${AG0})" opacity="0" style="transition:opacity .6s"><g id="vi-espuma-in"><path d="M-130 2 ${Array.from({ length:13 }, () => 'q10 5 20 0').join(' ')}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/><g fill="#fff">${[-136, -126, 128, 140].map((x, i) => `<circle cx="${x}" cy="${-4 + i % 2 * 2}" r="${2 + i % 2}"/>`).join('')}</g></g></g>
      <g id="vi-patos" class="toque"><g id="vi-patos-in">${pato(298, AG0, .8, false)}${pato(268, AG0, .7, true)}${pato(253, AG0, .6, true)}<rect x="240" y="${AG0 - 40}" width="100" height="48" fill="transparent"/></g></g>
    </g>
    <g pointer-events="none">${totora(-6, 70, 512, 9, 120, 190, true)}${totora(756, 810, 512, 6, 110, 170, true)}</g>
    <rect id="vi-escuro" width="800" height="500" fill="#0E1E44" opacity="0" style="transition:opacity 1.2s" pointer-events="none"/>
    <rect width="800" height="500" fill="url(#viVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#viGrao)" pointer-events="none"/>
  </svg>`;
  function capimJS(x0, x1, y, n){ let d = ''; for (let i = 0; i < n; i++) { const x = R(x0, x1), h = R(5, 10); d += `M${x.toFixed(1)} ${y + R(0, 10)} q${R(-2, 2).toFixed(1)} ${(-h / 2).toFixed(1)} ${R(-3, 3).toFixed(1)} ${(-h).toFixed(1)} `; } return `<path d="${d}" stroke="#3E7A2A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }
  const c = criarCena(palco, svg), s = c.svg;
  const casa = el(s, '#vi-casa'), baseIn = el(s, '#vi-base-in'), corda = el(s, '#vi-corda'), gancho = el(s, '#vi-gancho');
  const lago = el(s, '#vi-lago'), frente = el(s, '#vi-frente'), sup = el(s, '#vi-sup'), espuma = el(s, '#vi-espuma');
  el(s, '#vi-espuma-in').animate([{ transform:'translateX(-3px)' }, { transform:'translateX(3px)' }], { duration:1400, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  const seta = () => { const a = el(s, '#vi-seta'); if (a) a.animate([{ transform:'translateY(-3px)' }, { transform:'translateY(4px)' }], { duration:700, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }); };
  seta();
  /* ---------- estado e animação contínua ---------- */
  let agua = AG0, aguaDesenhada = -1;
  const H = { y:PEND, modo:'pend', s0:0, rot:0, preso:true, gy:PEND - TOPO };
  const lento = k => k * k * (3 - 2 * k);
  function tween(ms, fn, fim){ const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  const ondas = [];
  let proxOnda = 0;
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (agua !== aguaDesenhada) { aguaDesenhada = agua; const tr = `translate(0 ${(agua - AG0).toFixed(2)})`; lago.setAttribute('transform', tr); frente.setAttribute('transform', tr); sup.setAttribute('transform', tr); }
    let y = H.y, rot = 0, pivo = false;
    if (H.modo === 'pend') { rot = Math.sin(t * 1.3) * 1.6; pivo = true; }
    else if (H.modo === 'desce') { rot = Math.sin(t * 1.3) * .8; pivo = true; }
    else if (H.modo === 'boia') { const u = t - H.s0, am = Math.exp(-2.2 * u); y = agua + 9 * am * Math.cos(u * 6) + (1 - am) * 2.4 * Math.sin(t * 1.7); rot = (1 - am) * 1.3 * Math.sin(t * 1.15); H.y = y; }
    else { rot = H.rot; }
    casa.setAttribute('transform', pivo ? `translate(${CX} ${(y - TOPO).toFixed(2)}) rotate(${rot.toFixed(2)}) translate(0 ${TOPO})` : `translate(${CX} ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`);
    if (H.preso) H.gy = y - TOPO;
    gancho.setAttribute('transform', `translate(${CX} ${H.gy.toFixed(2)})`); corda.setAttribute('d', `M${CX} 84 V${(H.gy - 14).toFixed(2)}`);
    if (H.modo === 'boia' && t > proxOnda) { proxOnda = t + 1.3; ondas.push({ t0:t }); }
    for (let i = ondas.length - 1; i >= 0; i--) {
      const k = (t - ondas[i].t0) / 2.4; if (k >= 1) { ondas.splice(i, 1); continue; }
      ctx.globalAlpha = .55 * (1 - k); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(CX, agua + 3, 132 + k * 70, 4 + k * 8, 0, 0, Math.PI); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  const respingos = (x0, x1, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'respingo', x:sorte(x0, x1), y:agua + sorte(-2, 4), t:i % 5, cor:'#FFFFFF' }); };
  const bolhas = (x, y, n, sp) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-sp, sp), y:y + sorte(-6, 6), vy:sorte(1, 2.4), r:sorte(2.5, 6.5), topo:agua + 2, f:sorte(0, 6) }); };
  /* ---------- materiais ---------- */
  const MAT = [
    { id:'pedra', nome:'Pedras', sym:'m-pedra', boia:false, fala:'Afundou! Glub, glub. A pedra é pesada demais para boiar. Escolha outra base.' },
    { id:'tijolo', nome:'Tijolos', sym:'m-tijolo', boia:false, fala:'Afundou também! O tijolo é ótimo em terra firme, mas na água vai direto para o fundo.' },
    { id:'totora', nome:'Totora', sym:'m-totora', boia:true, fala:'Boiou! A totora é uma planta com ar por dentro, como um canudinho. O povo Uro faz ilhas inteiras com ela.' },
    { id:'barril', nome:'Tambores', sym:'m-barril', boia:true, fala:'Boiou! Tambores fechados ficam cheios de ar. No Camboja, muitas casas flutuam assim e sobem junto com a água.' }
  ];
  const mats = document.createElement('div'); mats.className = 'materiais';
  mats.innerHTML = MAT.map(m => `<button class="material" data-m="${m.id}"><svg viewBox="0 0 100 50" aria-hidden="true"><use href="#${m.sym}"/></svg>${m.nome}</button>`).join('');
  $('#p-acoes').appendChild(mats);
  const poeBase = id => { baseIn.innerHTML = `<g class="cresce">${BASES[id]}</g>`; };
  mats.addEventListener('click', e => {
    const b = e.target.closest('.material'); if (!b || testando || fase === 'subindo' || fase === 'postais') return;
    const m = MAT.find(m => m.id === b.dataset.m); testando = true; toca('pop'); poeBase(m.id);
    c.brilhos(CX, H.y, 5, '#FFE27A');
    if (boiando) {
      if (m.boia) { depois(700, () => { b.classList.add('testado-ok'); api.diz(m.fala); testando = false; }); }
      else { boiando = false; espuma.style.opacity = 0; el(s, '#vi-sombra').style.opacity = 0; depois(400, () => afundar(m, b)); }
      return;
    }
    depois(550, () => {
      H.modo = 'desce'; const y0 = H.y;
      tween(1150, k => { H.y = y0 + (agua - y0) * lento(k); }, () => {
        toca('splash'); respingos(CX - 130, CX + 130, 22); c.brilhos(CX, agua - 10, 6, '#FFFFFF');
        if (m.boia) {
          H.modo = 'boia'; H.s0 = performance.now() / 1000; boiando = true; espuma.style.opacity = 1; el(s, '#vi-sombra').style.opacity = .28; soltaGancho();
          depois(1000, () => {
            b.classList.add('testado-ok'); testando = false; api.diz(m.fala);
            if (fase === 'base') { fase = 'chuva'; depois(5200, () => { if (fase === 'chuva' && boiando) chamaChuva(); }); }
          });
        } else afundar(m, b);
      });
    });
  });
  function soltaGancho(){ H.preso = false; const g0 = H.gy; tween(900, k => { H.gy = g0 + (GANCHO - g0) * lento(k); }); }
  function afundar(m, b){
    H.modo = 'afunda'; if (H.preso) soltaGancho();
    const y0 = H.y, r0 = H.rot || 0, alvoR = m.id === 'pedra' ? 6 : -5; toca('glub');
    const bol = setInterval(() => { if (!vivo || H.modo !== 'afunda') return clearInterval(bol); bolhas(CX, H.y, 3, 110); }, 160);
    tween(2600, k => { H.y = y0 + (FUNDO - y0) * k * k; H.rot = r0 + (alvoR - r0) * k; }, () => {
      clearInterval(bol); H.modo = 'fundo'; el(s, '#vi-sombra').style.opacity = 0; toca('glub'); bolhas(CX, FUNDO - 10, 14, 120);
      b.classList.add('testado-nao'); api.diz(m.fala);
      depois(1900, () => {
        casa.style.opacity = 0;
        depois(500, () => {
          baseIn.innerHTML = BASES.vazia; seta(); H.modo = 'pend'; H.y = PEND; H.rot = 0; H.preso = true;
          casa.style.opacity = 1; toca('pop'); c.brilhos(CX, PEND - 80, 8, '#FFE27A'); testando = false;
        });
      });
    });
  }
  /* ---------- chuva ---------- */
  function chamaChuva(){ el(s, '#vi-nuvem').setAttribute('opacity', 1); el(s, '#vi-nuvem-dica').style.display = ''; api.diz('Agora toque na nuvem para chover. O que será que acontece com a casa quando a água sobe?'); }
  el(s, '#vi-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase === 'base') { toca('clique'); api.diz('Esta nuvem está carregada de água! Primeiro, escolha uma base para a casa.'); return; }
    if (fase !== 'chuva' || testando) return;
    if (!boiando) { toca('clique'); api.diz('Primeiro escolha uma base que boia!'); return; }
    fase = 'subindo'; toca('chuva'); el(s, '#vi-nuvem').setAttribute('opacity', 1); el(s, '#vi-nuvem-dica').style.display = 'none';
    el(s, '#vi-nuvem-cinza').setAttribute('opacity', 1); el(s, '#vi-nuvem-esc').setAttribute('opacity', 1); el(s, '#vi-escuro').setAttribute('opacity', .16);
    [0, 1000, 2000].forEach(ms => depois(ms, () => c.chover(214, 430, 100, agua, 60, '#3D8BFF')));
    depois(900, () => tween(2800, k => { agua = AG0 - SOBE * lento(k); }));
    depois(2600, () => { respingos(40, 150, 14); toca('splash'); });
    depois(3800, () => {
      el(s, '#vi-nuvem-cinza').setAttribute('opacity', 0); el(s, '#vi-nuvem-esc').setAttribute('opacity', 0); el(s, '#vi-escuro').setAttribute('opacity', 0);
      el(s, '#vi-nuvem').setAttribute('opacity', .6); el(s, '#vi-arco').setAttribute('opacity', 1); toca('vitoria'); c.brilhos(CX, agua - 120, 8, '#FFE27A');
      api.diz('A água subiu e a casa que boia subiu junto! A casa da margem ficou com o pé molhado. Toque nos cartões-postais para conhecer vilas de verdade.');
      fase = 'postais'; mostrarPostais();
    });
  });
  /* ---------- extras ---------- */
  el(s, '#vi-sol').addEventListener('click', () => {
    toca('ok'); el(s, '#vi-sol').animate([{ transform:'scale(1)' }, { transform:'scale(1.12)' }, { transform:'scale(1)' }], { duration:700 });
    for (let i = 0; i < 14; i++) c.add({ tipo:'vapor', x0:sorte(300, 760), y0:agua - 2, x1:320 + sorte(-60, 60), y1:70 + sorte(-14, 14), dur:sorte(80, 120), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
    api.diz('O sol esquenta o lago. Um pouquinho da água vira vapor, sobe e ajuda a formar as nuvens.');
  });
  let patoK = 0;
  el(s, '#vi-patos').addEventListener('click', () => {
    patoK++; tom(520, 0, .1, 'sawtooth', .08, 380); tom(500, .16, .1, 'sawtooth', .08, 360);
    el(s, '#vi-patos-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px)' }, { transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:700 });
    respingos(246, 326, 6);
    api.diz(patoK % 2 ? 'Quá, quá! As penas do pato têm um óleo que não deixa a água entrar. Por isso ele boia sequinho.' : 'Os patinhos seguem a mamãe em fila pela água.');
  });
  const pin = el(s, '#vi-peixes');
  const nado = pin.animate([{ transform:'translate(330px, 392px)' }, { transform:'translate(450px, 410px)' }, { transform:'translate(600px, 396px)' }], { duration:16000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  el(s, '#vi-peixes-in').animate([{ transform:'translateY(-3px)' }, { transform:'translateY(3px)' }], { duration:1200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  let virado = false;
  const vira = setInterval(() => { if (!vivo) return; const vai = (nado.currentTime || 0) % 32000 < 16000; if (vai === virado) { virado = !vai; el(s, '#vi-peixes-vira').setAttribute('transform', virado ? 'scale(-1 1)' : ''); } }, 200);
  timers.push(vira);
  pin.addEventListener('click', () => {
    toca('glub'); nado.playbackRate = 4; depois(900, () => { nado.playbackRate = 1; });
    const m = new DOMMatrix(getComputedStyle(pin).transform); bolhas(m.e || 450, (m.f || 400) - 6, 8, 20);
    api.diz('Os peixinhos adoram a sombra embaixo da casa que boia. Ali é um ótimo esconderijo!');
  });
  el(s, '#vi-ra').addEventListener('click', () => {
    toca('glub'); el(s, '#vi-ra-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.18, .9)' }, { transform:'scale(1)' }], { duration:600 }); bolhas(560, 456, 6, 10);
    api.diz('É a rã-gigante do Lago Titicaca! Ela quase nunca sobe para respirar: tira o ar da água pela pele toda enrugada.');
  });
  el(s, '#vi-garca').addEventListener('click', () => {
    toca('clique'); el(s, '#vi-garca-pesc').animate([{ transform:'translate(0,0)' }, { transform:'translate(8px,10px)' }, { transform:'translate(0,0)' }], { duration:700 });
    api.diz('A garça fica paradinha no píer, esperando um peixe passar.');
  });
  el(s, '#vi-regua').addEventListener('click', () => {
    toca('clique'); c.brilhos(636, agua, 4, '#FFE27A');
    api.diz(agua < AG0 ? 'Veja na régua: a água do lago subiu bastante com a chuva!' : 'Esta régua mostra a altura da água do lago. Fique de olho nela quando chover!');
  });
  el(s, '#vi-margem').addEventListener('click', () => {
    toca('clique');
    api.diz(agua < AG0 ? 'A casa da margem está presa no chão, então não sobe. A água entrou pela porta!' : 'Esta casa de adobe fica em terra firme, presa no chão.');
  });
  /* ---------- cartões-postais ---------- */
  function mostrarPostais(){
    const box = document.createElement('div'); box.className = 'postais'; box.style.marginTop = '6px';
    box.innerHTML = p.figs.map(f => `<button class="postal" data-f="${f.id}"><div class="img">${figSvg(f.sym, f.vb)}</div><b>${f.nome}</b><span>${f.lugar}</span></button>`).join('');
    $('#p-acoes').appendChild(box);
    box.addEventListener('click', e => {
      const b = e.target.closest('.postal'); if (!b) return;
      const f = p.figs.find(f => f.id === b.dataset.f);
      modal(`<div class="postal-grande">${figSvg(f.sym, f.vb)}</div><h2>${f.nome}</h2><p style="font-weight:700;color:var(--tinta2)">${f.lugar}</p><p>${f.fato}</p><button class="btn azul peq" id="m-ok">Guardar no álbum</button>`);
      falar(f.nome + '. ' + f.fato);
      $('#m-ok').onclick = () => {
        fecharModal(); b.classList.add('visto'); vistos[f.id] = true;
        estado.figs[f.id] = true; salvar(); contar(); toca('fig');
        if (Object.keys(vistos).length === p.figs.length) depois(500, api.fim);
      };
    });
  }
  api.diz('Vamos construir uma casa que boia? Escolha uma base embaixo da cena e veja se ela boia ou afunda!');
  return () => { vivo = false; timers.forEach(t => { clearTimeout(t); clearInterval(t); }); c.parar(); };
}
/* ================= JOGO 4: Pantanal, cheia e seca ================= */
function jogoPantanal(palco, api){
  semente = 61;
  let vivo = true, fase = 'seca0', agua = 440, nPeixes = 0, nComida = 0, voando = false, capiAlto = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const NS = 'http://www.w3.org/2000/svg';
  const LAGOAS = [{ x:330, y:392, rx:62, ry:14 }, { x:530, y:404, rx:66, ry:15 }, { x:700, y:388, rx:52, ry:12 }];
  const tufo = (x, y, h, cor) => `<path d="M${x} ${y} q-3 -${(h*.5).toFixed(0)} -7 -${h.toFixed(0)} M${x} ${y} q0 -${(h*.6).toFixed(0)} 1 -${(h*1.15).toFixed(0)} M${x} ${y} q3 -${(h*.5).toFixed(0)} 8 -${(h*.95).toFixed(0)} M${x} ${y} q-1 -${(h*.4).toFixed(0)} -3 -${(h*.7).toFixed(0)}" stroke="${cor}"/>`;
  const capim = (n, y0, y1, h0, h1, cor) => Array.from({length:n}, () => tufo(R(6, 794).toFixed(0), R(y0, y1).toFixed(0), R(h0, h1), cor)).join('');
  const caranda = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="balanca" style="animation-delay:${d}s"><path d="M0 0 C-2 -30 2 -60 0 -88" stroke="#5E4A36" stroke-width="6" fill="none"/><path d="M0 0 C-2 -30 2 -60 0 -88" stroke="#A8957A" stroke-width="2.2" fill="none"/><path d="M-2 -20 h4 M-2 -40 h4 M-2 -60 h4" stroke="#5E4A36" stroke-width="1.4"/>${[-175,-150,-122,-95,-68,-40,-12,-200].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r)*34, ey = -88 + Math.sin(r)*24; return `<path d="M0 -88 Q${(Math.cos(r)*16).toFixed(1)} ${(-88 + Math.sin(r)*16 - 8).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#1E6B3A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 -88 Q${(Math.cos(r)*16).toFixed(1)} ${(-88 + Math.sin(r)*16 - 8).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#4FB46A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }).join('')}<circle cx="0" cy="-88" r="5" fill="#1E5E32"/></g></g>`;
  const aguape = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" class="pn-aguape"><ellipse cx="-8" cy="2" rx="9" ry="4" fill="#3FA864" stroke="#1E6B3A" stroke-width="1.4"/><ellipse cx="8" cy="3" rx="9" ry="4" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.4"/><ellipse cx="0" cy="-1" rx="8" ry="4" fill="#5FD483" stroke="#1E6B3A" stroke-width="1.4"/><g fill="#B57BFF" stroke="#6A3EAE" stroke-width="1"><circle cx="-3" cy="-9" r="3.4"/><circle cx="3" cy="-10" r="3.4"/><circle cx="0" cy="-14" r="3.4"/></g><circle cx="0" cy="-10" r="1.6" fill="#FFC83D"/></g>`;
  const peixe = cor => `<g class="pn-nada"><path d="M-14 0 C-8 -9 8 -9 15 0 C8 9 -8 9 -14 0Z" fill="${cor}" stroke="#7A3E10" stroke-width="1.4"/><path d="M-13 0 L-23 -8 L-21 8Z" fill="${cor}" stroke="#7A3E10" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 -7 C2 -12 6 -12 8 -7" fill="${cor}" stroke="#7A3E10" stroke-width="1.2"/><circle cx="8" cy="-1.5" r="2" fill="#12235A"/><circle cx="8.6" cy="-2.1" r=".7" fill="#fff"/><path d="M-3 -6 q4 6 0 12" stroke="#7A3E10" stroke-width="1" fill="none"/><path d="M-8 -3 q8 -4 16 0" stroke="#FFF1B8" stroke-width="1.4" fill="none" opacity=".7"/></g>`;
  const capi = (x, y, s, id) => `<g class="pn-capi" id="${id}" transform="translate(${x} ${y})"><g transform="scale(${s})"><svg x="-48" y="-68" width="96" height="68" viewBox="0 0 140 100"><use href="#f-capivara"/></svg></g></g>`;
  const ipe = `<g id="pn-ipe" class="toque"><path d="M470 300 C472 270 466 250 474 222 L484 222 C490 250 484 272 488 300Z" fill="#7A5A3E" stroke="#3E2A18" stroke-width="2"/><path d="M478 236 C464 222 452 218 440 214 M480 232 C494 218 506 214 520 212 M479 228 C478 214 480 206 484 196" stroke="#3E2A18" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <g class="balanca" style="animation-delay:-2s"><path d="${copa(444, 208, 34, 18, 11)}" fill="#E66AA8" stroke="#9E2E6A" stroke-width="2"/><path d="${copa(518, 204, 34, 18, 11)}" fill="#E66AA8" stroke="#9E2E6A" stroke-width="2"/><path d="${copa(482, 186, 40, 22, 12)}" fill="#F28DC0" stroke="#9E2E6A" stroke-width="2"/>
    <g fill="#FFC6E2">${Array.from({length:22}, () => `<circle cx="${R(420, 548).toFixed(0)}" cy="${R(172, 222).toFixed(0)}" r="${R(2, 3.4).toFixed(1)}"/>`).join('')}</g><path d="M462 172 q12 -8 26 -4" stroke="#FFE0F0" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <rect x="410" y="160" width="150" height="140" fill="transparent"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Pantanal com rio, lagoas, ipê-rosa, ninho de tuiuiú, capivaras, jacaré e onça">
    <defs>
      <linearGradient id="pnCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC6F4"/><stop offset=".55" stop-color="#CFE9F5"/><stop offset=".8" stop-color="#FFE3B8"/><stop offset="1" stop-color="#FFC98A"/></linearGradient>
      <linearGradient id="pnCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C3D66E"/><stop offset=".5" stop-color="#A3C25A"/><stop offset="1" stop-color="#85A848"/></linearGradient>
      <linearGradient id="pnAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FCDEB" stop-opacity=".82"/><stop offset="1" stop-color="#2F7FC0" stop-opacity=".95"/></linearGradient>
      <linearGradient id="pnRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CC0E8"/><stop offset="1" stop-color="#2A6EB0"/></linearGradient>
      <radialGradient id="pnVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#0A1A2E" stop-opacity="0"/><stop offset="1" stop-color="#0A1A2E" stop-opacity=".3"/></radialGradient>
      <filter id="pnGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#pnCeu)"/>
    <g id="pn-sol" class="toque"><circle cx="600" cy="86" r="66" fill="#FFE27A" opacity=".28"/><circle cx="600" cy="86" r="40" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M577 72 q10 -12 26 -12" stroke="#FFF1B8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="600" cy="86" r="66" fill="transparent"/></g>
    <g id="pn-nuvem" class="toque"><g class="deriva" style="animation-duration:9s"><use href="#nuvem" x="676" y="34" width="122" height="62" style="color:#6F7A98"/><use href="#nuvem" x="680" y="38" width="114" height="56" style="color:#B9C2D6"/><use href="#nuvem" x="700" y="56" width="84" height="40" style="color:#CCD3E3"/><path d="M712 66 q10 -7 22 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M712 102 l-4 10 M736 104 l-4 10 M760 102 l-4 10" stroke="#5AAEDD" stroke-width="3" stroke-linecap="round"/></g><rect x="670" y="26" width="130" height="92" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="230" y="44" width="130" height="62" style="color:#fff" opacity=".85"/><use href="#nuvem" x="40" y="80" width="80" height="38" style="color:#fff" opacity=".6"/></g>
    <g id="pn-aves" class="toque"><g id="pn-aves-in">${[[0,0],[26,10],[52,20],[-24,12],[-46,24]].map(([x, y], i) => `<use href="#garca" x="${330 + x}" y="${120 + y}" width="40" height="20" style="animation-delay:${-i*.1}s"/>`).join('')}</g><rect x="270" y="110" width="140" height="50" fill="transparent"/></g>
    <path d="${copa(130, 266, 170, 18, 26, .5)}" fill="#A6CBB0" stroke="#8DB89A" stroke-width="2"/>
    <path d="${copa(650, 262, 200, 20, 28, .5)}" fill="#A6CBB0" stroke="#8DB89A" stroke-width="2"/>
    <path d="${copa(150, 278, 190, 20, 26, .45)}" fill="#6FA97A" stroke="#4F8E5E" stroke-width="2"/>
    <path d="${copa(660, 276, 190, 22, 26, .45)}" fill="#6FA97A" stroke="#4F8E5E" stroke-width="2"/>
    ${textura(400, 278, 400, 12, 40, '#5A9466', 1.4)}
    ${caranda(250, 300, .8, -.4)}${caranda(286, 302, .66, -1.2)}${caranda(380, 300, .74, -2)}${caranda(600, 298, .82, -.8)}${caranda(632, 302, .6, -1.6)}
    <g class="toque" data-fig="onca" id="pn-onca"><svg x="690" y="222" width="96" height="68" viewBox="0 0 140 100"><use href="#f-onca"/></svg>${brilhoHotspot(772, 228)}</g>
    ${ipe}
    <path d="M0 290 Q200 280 400 292 T800 286 V500 H0Z" fill="url(#pnCampo)" stroke="#7A9A3E" stroke-width="2"/>
    <path d="M0 304 C40 282 140 278 210 296 C240 304 250 316 250 330 L0 330Z" fill="#B3CC64" stroke="#7A9A3E" stroke-width="2"/>
    ${textura(400, 350, 400, 46, 70, '#86A848', 1.4)}
    <g>${Array.from({length:30}, () => { const x = R(10, 790), y = R(300, 430), c = ['#FFE27A','#fff','#FFB3D9'][Math.floor(rnd()*3)]; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.2" fill="${c}" stroke="#7A9A3E" stroke-width=".8"/>`; }).join('')}</g>
    <g id="pn-lagoas">${LAGOAS.map((l, i) => `<g class="toque pn-lagoa" data-l="${i}"><ellipse cx="${l.x}" cy="${l.y + 2}" rx="${l.rx + 10}" ry="${l.ry + 6}" fill="#8A6A3A" stroke="#5E4422" stroke-width="2"/><ellipse cx="${l.x}" cy="${l.y}" rx="${l.rx}" ry="${l.ry}" fill="#5AAEDD" stroke="#2F7FC0" stroke-width="2"/><path d="M${l.x - l.rx*.5} ${l.y - 3} q8 -3 16 0 M${l.x + l.rx*.2} ${l.y + 4} q6 -2 12 0" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${l.x + l.rx*.55}" cy="${l.y + 2}" rx="8" ry="3" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.2"/><g stroke="#3E7A2A" stroke-width="2.2" fill="none" stroke-linecap="round">${tufo((l.x - l.rx - 4).toFixed(0), l.y + 4, 22, '#3E7A2A')}${tufo((l.x + l.rx + 2).toFixed(0), l.y + 2, 18, '#3E7A2A')}</g></g>`).join('')}</g>
    <path d="M0 448 C120 430 220 470 360 452 S620 430 800 452 V500 H0Z" fill="url(#pnRio)" stroke="#2A6E9E" stroke-width="2.5"/>
    <g stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75" class="brilha-agua"><path d="M60 468 q10 -4 20 0 M300 478 q12 -4 24 0 M520 462 q10 -4 20 0 M700 476 q12 -4 24 0"/></g>
    <g id="pn-arvore"><path d="M70 300 C74 260 72 230 78 200 L90 200 C94 230 92 260 96 300Z" fill="#8A6A4E" stroke="#4E3A26" stroke-width="2"/><path d="M80 216 V292 M86 226 q1 30 0 60" stroke="#6E5440" stroke-width="1.4" fill="none"/><path d="M84 214 C70 200 58 196 46 194 M84 210 C100 196 112 192 126 190" stroke="#4E3A26" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="balanca" style="animation-delay:-1s"><path d="${copa(50, 186, 42, 19, 11)}" fill="#2F7E46" stroke="#1E5E32" stroke-width="2"/><path d="${copa(122, 180, 44, 19, 11)}" fill="#3F8E52" stroke="#1E5E32" stroke-width="2"/>${textura(86, 182, 70, 12, 14, '#24683A', 1.4)}<path d="M30 174 q10 -6 22 -3 M108 168 q10 -6 22 -3" stroke="#A8E0B4" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
      <path d="M58 192 C70 186 110 186 124 192 C120 202 64 202 58 192Z" fill="#B88A50" stroke="#6E4A22" stroke-width="2"/><path d="M62 192 l8 -5 M74 190 l6 -6 M96 190 l-4 -6 M110 191 l-6 -6 M118 192 l6 -4 M66 197 l8 3 M100 198 l8 -2" stroke="#6E4A22" stroke-width="1.6"/>
      <g id="pn-filhotes" class="toque"><g transform="translate(80 180)"><circle r="8" fill="#F4F1EA" stroke="#4E5B7A" stroke-width="1.6"/><path class="pn-bico" d="M4 -2 L16 -6 L4 2Z" fill="#2B2B33"/><circle cx="2" cy="-2" r="1.4" fill="#12121A"/></g><g transform="translate(102 182)"><circle r="7" fill="#F4F1EA" stroke="#4E5B7A" stroke-width="1.6"/><path class="pn-bico" d="M4 -2 L14 -5 L4 2Z" fill="#2B2B33"/><circle cx="2" cy="-2" r="1.3" fill="#12121A"/></g><rect x="66" y="168" width="50" height="24" fill="transparent"/></g>
    </g>
    <g id="pn-tuiuiu" class="toque" data-fig="tuiuiu" transform="translate(116 118)"><g id="pn-tui-pouso"><svg x="0" y="0" width="56" height="74" viewBox="0 0 100 130"><use href="#f-tuiuiu"/></svg></g><g id="pn-tui-voo" style="display:none"><svg x="-30" y="10" width="120" height="60" viewBox="0 0 160 80"><use href="#tuiuiu-voa"/></svg></g></g>
    <rect id="pn-agua" x="0" y="440" width="800" height="80" fill="url(#pnAgua)"/>
    <path id="pn-onda" d="M-40 440 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" opacity=".8"/>
    <g stroke-width="2.4" fill="none" stroke-linecap="round">${capim(40, 300, 440, 10, 20, '#5E8A2E')}${capim(20, 320, 440, 14, 26, '#4E7A26')}</g>
    <g id="pn-aguapes">${aguape(150, 462, 1)}${aguape(420, 470, .9)}${aguape(760, 466, 1.1)}</g>
    <g class="toque" data-fig="jacare" id="pn-jacare"><g id="pn-jac-in"><svg x="552" y="440" width="140" height="38" viewBox="0 6 150 40.7" preserveAspectRatio="xMidYMax slice"><use class="sem" href="#f-jacare"/></svg><path d="M552 477 q20 -5 40 0 t40 0 t40 0 t20 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/></g>${brilhoHotspot(654, 444)}</g>
    <g id="pn-capis">${capi(160, 360, .9, 'pn-capi1')}${capi(212, 372, .55, 'pn-capi2')}${capi(244, 368, .5, 'pn-capi3')}</g>
    <g id="pn-peixes"></g>
    <g pointer-events="none"><g stroke-width="4" fill="none" stroke-linecap="round" class="balanca">${[[10,500,70],[24,500,90],[40,500,64],[760,500,80],[778,500,96],[792,500,70]].map(([x, y, h]) => `<path d="M${x} ${y} q-6 -${h/2} -${10 + (x % 7)} -${h}" stroke="#2E6B22"/><path d="M${x + 6} ${y} q4 -${h/2} ${8 + (x % 5)} -${h*.9}" stroke="#3E8A2E"/>`).join('')}</g></g>
    <rect width="800" height="500" fill="url(#pnVinheta)" pointer-events="none"/>
    <rect width="800" height="500" filter="url(#pnGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const aguaEl = el(s, '#pn-agua'), onda = el(s, '#pn-onda'), gp = el(s, '#pn-peixes');
  const posAgua = y => { agua = y; aguaEl.setAttribute('y', y.toFixed(1)); aguaEl.setAttribute('height', (520 - y).toFixed(1)); };
  function moverAgua(y1, ms, fim){ const y0 = agua, t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); posAgua(y0 + (y1 - y0) * e); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); }
  const PEIXES = [], CORES = ['#F2A33A', '#F7C531', '#E8743A', '#F2A33A', '#F7C531'];
  const posP = f => f.el.setAttribute('transform', `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${f.dir} 1)`);
  /* laço da vida: ondas, aguapés, jacaré e peixes nadando sozinhos */
  (function vida(t){
    if (!vivo) return;
    onda.setAttribute('transform', `translate(${((t/40) % 40).toFixed(1)} ${(agua - 440).toFixed(1)})`);
    const boia = Math.max(0, 440 - agua);
    el(s, '#pn-aguapes').setAttribute('transform', `translate(0 ${(-boia + Math.sin(t/700)*2).toFixed(1)})`);
    el(s, '#pn-jac-in').setAttribute('transform', `translate(0 ${(Math.sin(t/900)*2).toFixed(1)})`);
    PEIXES.forEach(f => { if (!f.vaga || f.comido) return; f.ang += .02 + f.v * .01; const nx = f.cx + Math.cos(f.ang) * f.r, ny = f.cy + Math.sin(f.ang * 1.7) * 6; f.dir = nx >= f.x ? 1 : -1; f.x = nx; f.y = ny; posP(f); });
    requestAnimationFrame(vida);
  })(performance.now());
  function soltarPeixes(){
    gp.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'toque pn-peixe'); g.innerHTML = peixe(CORES[i]) + '<circle r="26" fill="transparent"/>';
      const f = { el:g, x: 90 + i * 150 + R(-20, 20), y: 470 + R(-6, 6), livre:true, dir:1, vaga:true, ang:R(0, 6), r:R(14, 24), v:R(0, 1) }; f.cx = f.x; f.cy = f.y; PEIXES.push(f); gp.appendChild(g); posP(f);
      g.addEventListener('click', ev => { ev.stopPropagation(); levarPeixe(f); });
    }
  }
  function nadar(f, x1, y1, ms, fim){ f.vaga = false; const x0 = f.x, y0 = f.y, t0 = performance.now(); f.dir = x1 >= x0 ? 1 : -1; (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); f.x = x0 + (x1-x0)*e; f.y = y0 + (y1-y0)*e + Math.sin(k*Math.PI*3)*4; posP(f); if (k < 1) requestAnimationFrame(q); else { f.cx = f.x; f.cy = f.y; f.ang = 0; f.r = R(10, 20); f.x = f.cx + f.r; f.vaga = true; fim && fim(); } })(t0); }
  function levarPeixe(f){
    if (fase !== 'peixes' || !f.livre) return; f.livre = false; toca('splash');
    nadar(f, R(270, 760), R(336, 410), 1400, () => { for (let i = 0; i < 6; i++) c.add({ tipo:'bolha', x:f.x + sorte(-8,8), y:f.y, vy:sorte(.8,1.6), r:sorte(2,4), topo:agua, f:sorte(0,6) }); toca('glub'); c.brilhos(f.x, f.y, 4, '#FFE27A'); });
    nPeixes++; api.hud(`<span class="chip">Peixes no campo alagado: ${nPeixes}/5</span>`);
    if (nPeixes === 1) api.diz('Isso! Na cheia, os peixes saem do rio e entram no campo alagado. Lá tem comida e lugar seguro para os filhotes.');
    if (nPeixes === 5) { fase = 'esperaSeca'; depois(1600, () => { api.diz('Todos os peixes acharam comida! Meses depois a chuva para. Toque no Sol para a seca chegar.'); pisca('#pn-sol'); }); }
  }
  function pisca(sel){ s.querySelectorAll('.pn-dica').forEach(e => e.remove()); const g = el(s, sel); const bb = g.getBBox(); g.insertAdjacentHTML('beforeend', `<circle class="pn-dica pino-pulso" cx="${(bb.x + bb.width/2).toFixed(0)}" cy="${(bb.y + bb.height/2).toFixed(0)}" r="${(Math.min(70, Math.max(bb.width, bb.height)/2)).toFixed(0)}" fill="none" stroke="#fff" stroke-width="4" pointer-events="none"/>`); }
  /* capivaras: andam e buscam o lugar alto na cheia */
  const CAPIS = [{ id:'pn-capi1', x:160, y:360 }, { id:'pn-capi2', x:212, y:372 }, { id:'pn-capi3', x:244, y:368 }];
  function andarCapis(alvos, ms){ CAPIS.forEach((cp, i) => { const g = el(s, '#' + cp.id), x0 = cp.x, y0 = cp.y, [x1, y1] = alvos[i], t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); cp.x = x0 + (x1-x0)*e; cp.y = y0 + (y1-y0)*e - Math.abs(Math.sin(k*Math.PI*8))*3; g.setAttribute('transform', `translate(${cp.x.toFixed(1)} ${cp.y.toFixed(1)}) scale(${x1 < x0 ? -1 : 1} 1)`); if (k < 1) requestAnimationFrame(q); else g.setAttribute('transform', `translate(${x1} ${y1})`); })(t0); }); }
  el(s, '#pn-capis').addEventListener('click', e => {
    e.stopPropagation(); api.figurinha('capivara'); toca('pop');
    if (fase === 'seca0' || fase === 'tuiuiu' || fase === 'fim') { const dx = R(-60, 60); andarCapis(CAPIS.map(cp => [Math.max(120, Math.min(420, cp.x + dx)), cp.y]), 1400); }
  });
  /* interações livres */
  el(s, '#pn-ipe').addEventListener('click', e => { e.stopPropagation(); toca('planta'); for (let i = 0; i < 26; i++) c.add({ tipo:'petala', x:sorte(424, 546), y:sorte(170, 220), vy:sorte(.6, 1.3), f:sorte(0, 6), chao:sorte(300, 430), cor: Math.random() < .5 ? '#F28DC0' : '#FFC6E2' }); api.diz('É a piúva, um ipê-rosa! Quando ela floresce, o Pantanal fica todo enfeitado.'); });
  el(s, '#pn-aves').addEventListener('click', e => { e.stopPropagation(); const g = el(s, '#pn-aves-in'); if (g.dataset.voando) return; g.dataset.voando = 1; toca('pop'); g.animate([{ transform:'translate(0,0)' }, { transform:'translate(520px,-90px)' }, { transform:'translate(520px,-90px)', opacity:0 }, { transform:'translate(-420px,0)', opacity:0 }, { transform:'translate(0,0)', opacity:1 }], { duration:5200, easing:'ease-in-out' }).onfinish = () => delete g.dataset.voando; api.diz('Um bando de garças! Elas também pescam nas águas do Pantanal.'); });
  el(s, '#pn-jacare').addEventListener('click', () => { const g = el(s, '#pn-jac-in'); g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:500 }); toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:sorte(580, 670), y:agua + 30, t:i }); });
  el(s, '#pn-onca').addEventListener('click', () => { el(s, '#pn-onca').animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:450 }); });
  el(s, '#pn-filhotes').addEventListener('click', e => { e.stopPropagation(); piar(); });
  function piar(){ toca('clique'); s.querySelectorAll('.pn-bico').forEach(b => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = '0% 50%'; b.animate([{ transform:'rotate(0)' }, { transform:'rotate(-25deg)' }, { transform:'rotate(0)' }], { duration:300, iterations:3 }); }); }
  /* cheia */
  el(s, '#pn-nuvem').addEventListener('click', () => {
    if (fase !== 'seca0') return; fase = 'enchendo'; s.querySelectorAll('.pn-dica').forEach(e => e.remove());
    toca('chuva'); c.chover(20, 780, 90, 440, 180, '#5AAEDD'); depois(2400, () => c.chover(20, 780, 90, 400, 120, '#5AAEDD'));
    api.diz('Começou a época das chuvas! A água dos rios sobe e cobre os campos. Olha as capivaras correndo para o lugar mais alto!');
    andarCapis([[150, 300], [198, 306], [240, 304]], 2200); capiAlto = true;
    depois(900, () => moverAgua(322, 3600, () => { fase = 'peixes'; soltarPeixes(); api.hud('<span class="chip">Peixes no campo alagado: 0/5</span>'); api.diz('Olha os peixes no rio! Toque em cada peixe para ele nadar até o campo alagado.'); }));
  });
  /* seca */
  el(s, '#pn-sol').addEventListener('click', () => {
    if (fase !== 'esperaSeca') return; fase = 'secando'; s.querySelectorAll('.pn-dica').forEach(e => e.remove()); toca('ok');
    api.diz('Chegou a seca. A água baixa devagar e fica só no rio e nas lagoas.');
    PEIXES.forEach((f, i) => { const l = LAGOAS[i % 3]; nadar(f, l.x + R(-l.rx*.5, l.rx*.5), l.y, 3200, () => { f.r = R(8, l.rx*.4); f.cy = l.y; }); });
    moverAgua(440, 3600, () => {
      andarCapis([[160, 360], [212, 372], [244, 368]], 2000);
      fase = 'tuiuiu'; api.hud('<span class="chip">Comida no ninho: 0/3</span>');
      api.diz('Os peixes ficaram nas lagoas. Os filhotes de tuiuiú estão com fome! Toque numa lagoa para o tuiuiú ir pescar.'); piar();
    });
  });
  const usadas = {};
  el(s, '#pn-lagoas').addEventListener('click', e => {
    const g = e.target.closest('.pn-lagoa'); if (!g || fase !== 'tuiuiu' || voando) return;
    const i = +g.dataset.l; if (usadas[i]) { api.diz('Já pescamos nesta lagoa. Escolha outra!'); return; }
    usadas[i] = true; voando = true; e.stopPropagation(); pescar(LAGOAS[i]);
  });
  function pescar(l){
    const tui = el(s, '#pn-tuiuiu'), pouso = el(s, '#pn-tui-pouso'), voo = el(s, '#pn-tui-voo');
    const x0 = 116, y0 = 118, x1 = l.x - 28, y1 = l.y - 66; toca('pop');
    const voar = (xa, ya, xb, yb, ms, fim) => { pouso.style.display = 'none'; voo.style.display = ''; const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0)/ms), e = k*k*(3-2*k); const x = xa + (xb-xa)*e, y = ya + (yb-ya)*e - Math.sin(k*Math.PI)*80; tui.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${xb < xa ? ' translate(56 0) scale(-1 1)' : ''}`); if (k < 1) requestAnimationFrame(q); else { pouso.style.display = ''; voo.style.display = 'none'; tui.setAttribute('transform', `translate(${xb} ${yb})`); fim && fim(); } })(t0); };
    voar(x0, y0, x1, y1, 1500, () => {
      toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:l.x + sorte(-10,10), y:l.y, t:i });
      const f = PEIXES.find(f => !f.comido && Math.hypot(f.x - l.x, f.y - l.y) < l.rx + 30); if (f) { f.comido = true; f.el.style.transition = 'opacity .4s'; f.el.style.opacity = 0; }
      depois(600, () => voar(x1, y1, x0, y0, 1500, () => {
        voando = false; nComida++; toca('ok'); c.brilhos(92, 176, 8, '#FFE27A'); piar();
        api.hud(`<span class="chip">Comida no ninho: ${nComida}/3</span>`);
        if (nComida < 3) api.diz(nComida === 1 ? 'Os filhotes comeram! O tuiuiú é a ave símbolo do Pantanal. Toque em outra lagoa.' : 'Mais uma! Falta só uma lagoa.');
        else { fase = 'fim'; api.diz('Os filhotes estão de barriga cheia! No Pantanal, a cheia e a seca se revezam todo ano, e a vida acompanha o ritmo da água.'); depois(3600, api.fim); }
      }));
    });
  }
  api.hud('<span class="chip">Época da seca</span>');
  api.diz('Oi, eu sou a Capi, uma capivara do Pantanal! Aqui a água tem ritmo: tem a época da cheia e a época da seca. Toque na nuvem de chuva para a cheia começar. Você também pode tocar nos bichos e nas árvores!');
  pisca('#pn-nuvem');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 5: Cerrado, berço das águas ================= */
function jogoCerrado(palco, api){
  semente = 71;
  let vivo = true, fase = 'plantar', plantadas = 0, cheio = 0, nuvemX = 160, arrN = null, nRios = 0, nFlores = 0;
  const META = 70, SUP = 222, AQ0 = 478, AQ1 = 402;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const ARV = [{ x:80, ok:true, ipe:true }, { x:170 }, { x:260 }, { x:350 }, { x:440 }, { x:520, ok:true }];
  const PI = Math.PI, f1 = n => n.toFixed(1), f0 = n => n.toFixed(0), umDe = a => a[Math.floor(R(0, a.length - .001))];

  /* ---------- geometria: curvas lisas, galhos afinando ---------- */
  const liso = (P, ini = 'M') => { let d = `${ini}${f1(P[0][0])} ${f1(P[0][1])}`; for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`; } return d; };
  const NRM = (P, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; return [-dy / m, dx / m]; };
  const larg = (w0, w1, i, n) => w0 + (w1 - w0) * i / Math.max(1, n - 1);
  const tubo = (P, w0, w1) => { const A = [], B = []; P.forEach((p, i) => { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, P.length) / 2; A.push([p[0] + nx * w, p[1] + ny * w]); B.push([p[0] - nx * w, p[1] - ny * w]); }); return liso(A) + ' ' + liso(B.reverse(), 'L') + 'Z'; };
  const paralela = (P, w0, w1, k, jit) => P.map((p, i) => { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, P.length) / 2 * (k + R(-jit, jit)); return [p[0] + nx * w, p[1] + ny * w]; });
  const ramo = (x, y, ang, len, n, torce) => { const P = [[x, y]]; let a = ang; for (let k = 0; k < n; k++) { a += (k % 2 ? -torce : torce) + R(-.14, .14); x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; P.push([x, y]); } return P; };
  const ponta = P => P[P.length - 1];
  /* madeira com casca grossa (cortiça): fissuras ao longo do galho, placas e brilho do lado da luz */
  const lenho = (partes, casca, ink, risco, luz) => partes.map(([P, w0, w1]) => {
    let fis = ''; const n = P.length;
    [-.42, .05, .5].forEach(k => { if (w0 < 7 && k !== .05) return; fis += `<path d="${liso(paralela(P, w0, w1, k, .16))}" stroke="${risco}" stroke-width="${w0 > 10 ? 1.5 : 1.1}" fill="none" stroke-dasharray="${f0(R(5, 9))} ${f0(R(2, 4))} ${f0(R(3, 7))} ${f0(R(2, 3))}" stroke-linecap="round"/>`; });
    if (w0 > 9) for (let i = 1; i < n - 1; i++) { const [nx, ny] = NRM(P, i), w = larg(w0, w1, i, n) / 2, k = R(0, 1) < .5 ? -.42 : .05, p = P[i]; fis += `<path d="M${f1(p[0] + nx * w * k)} ${f1(p[1] + ny * w * k + 2)} l${f1(nx * w * .46)} ${f1(ny * w * .46 - 1.5)}" stroke="${risco}" stroke-width="1.1" stroke-linecap="round"/>`; }
    return `<path d="${tubo(P, w0, w1)}" fill="url(#${casca})" stroke="${ink}" stroke-width="1.7" stroke-linejoin="round"/>${fis}<path d="${liso(paralela(P, w0, w1, -.66, 0).slice(0, Math.max(2, n - 1)))}" stroke="${luz}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".75"/>`; }).join('');
  /* copa em lóbulos: sombra, corpo com degradê, folhas de couro na borda e brilho */
  const copaF = (L, k) => {
    const somb = L.map(([cx, cy, rx, ry]) => `<path d="${copa(cx + 3, cy + 5, rx, ry, 10, .22)}"/>`).join('');
    const corpo = L.map(([cx, cy, rx, ry]) => `<path d="${copa(cx, cy, rx, ry, Math.round(7 + rx / 4), .3)}" fill="url(#${k.g})" stroke="${k.ink}" stroke-width="1.8" stroke-linejoin="round"/>`).join('');
    let fol = '';
    L.forEach(([cx, cy, rx, ry]) => { const m = Math.round(rx / (k.dens || 3.2)); for (let j = 0; j < m; j++) { const t = R(-PI * .98, PI * .2), r = R(.8, 1); fol += k.folha(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r, t * 180 / PI); } for (let j = 0; j < m * .5; j++) { const t = R(-PI, PI), r = R(.2, .62); fol += k.folha(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r, t * 180 / PI); } });
    const luz = L.map(([cx, cy, rx, ry]) => `M${f1(cx - rx * .62)} ${f1(cy - ry * .15)} q${f1(rx * .2)} ${f1(-ry * .62)} ${f1(rx * .68)} ${f1(-ry * .68)}`).join(' ');
    return `<g fill="${k.sombra}" opacity=".5">${somb}</g>${corpo}${fol}<path d="${luz}" stroke="${k.luz}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>${k.extra ? k.extra(L) : ''}`;
  };
  /* folhas e flores de cada espécie */
  const folhaOv = (len, wid, fills, ink, nerv) => (x, y, a) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-28, 28))})"><path d="M0 0 Q${f1(len * .5)} ${f1(-wid)} ${len} 0 Q${f1(len * .5)} ${wid} 0 0Z" fill="${umDe(fills)}" stroke="${ink}" stroke-width=".9" stroke-linejoin="round"/><path d="M1 0 H${f1(len - 1.6)}" stroke="${nerv}" stroke-width=".6"/></g>`;
  const folhaPinada = (fills, ink) => (x, y, a) => { const cor = umDe(fills); let d = ''; for (let j = 0; j < 4; j++) d += `<circle cx="${f1(2.5 + j * 2.6)}" cy="-1.9" r="1.45"/><circle cx="${f1(2.5 + j * 2.6)}" cy="1.9" r="1.45"/>`; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-30, 30))})"><path d="M0 0 H13" stroke="${ink}" stroke-width=".7"/><g fill="${cor}" stroke="${ink}" stroke-width=".55">${d}<circle cx="13.2" cy="0" r="1.5"/></g></g>`; };
  const folhaTrio = (fills, ink, nerv) => { const f = folhaOv(8.5, 3.6, fills, ink, nerv); return (x, y, a) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(a + R(-20, 20))})"><path d="M0 0 H3" stroke="${ink}" stroke-width=".8"/>${f(3, 0, -32)}${f(3, 0, 0)}${f(3, 0, 32)}</g>`; };
  const espalha = (L, n, fn, alto) => { let o = ''; for (let j = 0; j < n; j++) { const [cx, cy, rx, ry] = umDe(L), t = alto ? R(-PI * .95, -PI * .05) : R(-PI, PI), r = R(.35, .95); o += fn(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r); } return o; };
  const florIpe = (x, y) => { const r = R(1.6, 2.3), c = umDe(['#FFE45A', '#FFD233', '#FFC21E']); return `<g fill="${c}" stroke="#B07A08" stroke-width=".55">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(x + Math.cos(a * PI / 180 + 0.3) * r * 1.1)}" cy="${f1(y + Math.sin(a * PI / 180 + 0.3) * r * 1.1)}" r="${f1(r)}"/>`).join('')}<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .55)}" fill="#E58A12" stroke="none"/></g>`; };
  const florPT = (x, y) => `<g stroke="#A86A06" stroke-width=".5">${[[0, 0], [2.6, -2.2], [-2.4, -2.4], [.2, -4.6]].map(([dx, dy]) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y + dy)}" rx="2" ry="1.6" fill="#FFCF3A"/>`).join('')}<circle cx="${f1(x)}" cy="${f1(y - 2.2)}" r=".9" fill="#E0661E" stroke="none"/></g>`;
  const florCg = (x, y) => `<g><g fill="#FFFFFF" stroke="#9AA8A0" stroke-width=".45">${[0, 90, 180, 270].map(a => `<circle cx="${f1(x + Math.cos(a * PI / 180 + .5) * 1.7)}" cy="${f1(y + Math.sin(a * PI / 180 + .5) * 1.7)}" r="1.5"/>`).join('')}</g><circle cx="${f1(x)}" cy="${f1(y)}" r=".8" fill="#F2C230"/></g>`;
  const frutoCg = (x, y) => `<g><path d="M${f1(x)} ${f1(y - 6)} v3" stroke="#3E5A2A" stroke-width=".8"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="#F2D24A" stroke="#9A7A10" stroke-width=".8"/><circle cx="${f1(x - 1)}" cy="${f1(y - 1)}" r=".9" fill="#FFF6C0"/></g>`;
  const florPq = (x, y) => `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="url(#ceFlorPq)" stroke="#C8B47A" stroke-width=".5"/>${[0, 1, 2, 3, 4, 5].map(k => { const a = k * PI / 3 + .3; return `<path d="M${f1(x + Math.cos(a) * 2.6)} ${f1(y + Math.sin(a) * 2.6)} l${f1(Math.cos(a) * 1.8)} ${f1(Math.sin(a) * 1.8)}" stroke="#E8D9A0" stroke-width=".6"/>`; }).join('')}</g>`;
  const frutoPq = (x, y) => `<g><path d="M${f1(x)} ${f1(y - 7)} q1 3 0 4" stroke="#3E5A22" stroke-width="1" fill="none"/><circle cx="${f1(x)}" cy="${f1(y)}" r="4.4" fill="url(#ceFrutoPq)" stroke="#2E4A18" stroke-width="1"/><ellipse cx="${f1(x - 1.4)}" cy="${f1(y - 1.6)}" rx="1.3" ry=".9" fill="#E6F5B0"/></g>`;
  const sombraArv = (x, rx) => `<ellipse cx="${x}" cy="${SUP + 2}" rx="${rx}" ry="4.2" fill="#2E1A0A" opacity=".28"/>`;
  const balanca = (i, conteudo) => `<g class="balanca" style="animation-delay:${(-i * .7).toFixed(1)}s">${conteudo}</g>`;

  /* ---------- as cinco espécies (cada muda é uma árvore diferente) ---------- */
  const ESPECIE = {
    /* barbatimão: copa em andares, folhinhas compostas verde-amareladas */
    1: x => { const T = ramo(x, SUP + 3, -PI / 2 + .12, 52, 4, .14), a = ramo(...T[3], -PI / 2 - .95, 34, 3, .18), b = ramo(...T[4], -PI / 2 + .75, 30, 3, .18), c = ramo(...ponta(T), -PI / 2 - .1, 20, 2, .1);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
      const L = [[ax - 2, ay + 2, 24, 10], [bx + 2, by + 1, 24, 10], [cx - 4, cy - 2, 28, 12], [cx + 6, cy - 15, 17, 8]];
      return sombraArv(x, 30) + lenho([[T, 12, 6.5], [a, 6, 2.2], [b, 5.6, 2.2], [c, 5, 2.4]], 'ceCaR', '#3A1E0E', '#3A1E0E', '#D69A6A') + balanca(1, copaF(L, { g:'ceCoBa', ink:'#4E6420', sombra:'#3E5216', luz:'#F6FCC8', dens:2.8, folha:folhaOv(7.5, 4.6, ['#C8DA66', '#B4CC50', '#D8E67E'], '#4E6420', '#7E9A2E') })); },
    /* lixeira: tronco bem torto, copa rala cinza-esverdeada, folhas grandes e ásperas */
    2: x => { const T = ramo(x, SUP + 3, -PI / 2 - .16, 56, 5, .3), a = ramo(...T[3], -PI / 2 + .95, 32, 3, .32), b = ramo(...ponta(T), -PI / 2 - .75, 28, 3, .3), c = ramo(...ponta(T), -PI / 2 + .2, 16, 2, .2), d = ramo(...T[2], -PI / 2 - 1.25, 16, 2, .2);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c), [dx, dy] = ponta(d);
      const L = [[ax + 2, ay - 2, 18, 11], [bx - 2, by - 3, 19, 11], [cx + 2, cy - 7, 17, 10], [dx - 4, dy - 2, 11, 7]];
      return sombraArv(x, 28) + lenho([[T, 14, 6.5], [a, 6.4, 2.2], [b, 6, 2.2], [c, 4.6, 2], [d, 4, 1.8]], 'ceCaC', '#3A2E20', '#4A3C2A', '#E8DCC4') + balanca(2, copaF(L, { g:'ceCoLx', ink:'#3F5238', sombra:'#34452E', luz:'#EEF4E2', dens:2.6, folha:folhaOv(11, 6, ['#A9BC92', '#B8C9A2', '#9CB086'], '#4E6448', '#6E8462') })); },
    /* pau-terra: tronco em S com cortiça funda, copa oliva com cachos de flor amarela */
    3: x => { const T = ramo(x, SUP + 3, -PI / 2 + .32, 52, 5, .38), a = ramo(...ponta(T), -PI / 2 - .9, 28, 3, .34), b = ramo(...ponta(T), -PI / 2 + .62, 26, 3, .3), c = ramo(...T[2], -PI / 2 - 1.2, 18, 2, .2);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c), [tx, ty] = ponta(T);
      const L = [[cx - 2, cy - 3, 14, 9], [ax - 2, ay - 1, 23, 13], [bx + 3, by, 22, 13], [tx, ty - 18, 25, 14]];
      return sombraArv(x, 28) + lenho([[T, 15, 7.5], [a, 6.4, 2.2], [b, 6, 2.2], [c, 4.4, 1.8]], 'ceCaE', '#2E1A0C', '#2E1A0C', '#C8945E') + balanca(3, copaF(L, { g:'ceCoPt', ink:'#45501A', sombra:'#3A4416', luz:'#F0F2B8', dens:2.8, folha:folhaOv(10, 3.6, ['#A8B04C', '#B9BE5E', '#9AA442'], '#4E5A1E', '#76802E'), extra:L2 => espalha(L2, 12, florPT, true) })); },
    /* cagaiteira: copa redonda e densa verde-azulada, florzinhas brancas e frutinhas amarelas */
    4: x => { const T = ramo(x, SUP + 3, -PI / 2 - .06, 44, 3, .12), a = ramo(...ponta(T), -PI / 2 - .6, 22, 2, .16), b = ramo(...ponta(T), -PI / 2 + .55, 22, 2, .16);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [tx, ty] = ponta(T);
      const L = [[ax - 6, ay + 4, 21, 14], [bx + 6, by + 5, 21, 14], [tx, ty - 22, 26, 16], [tx - 4, ty - 38, 15, 9]];
      return sombraArv(x, 30) + lenho([[T, 12, 7.5], [a, 6, 2.6], [b, 6, 2.6]], 'ceCaE', '#2E1A0C', '#2E1A0C', '#C8945E') + balanca(4, copaF(L, { g:'ceCoCg', ink:'#1C463A', sombra:'#163A30', luz:'#D4F2E2', dens:2.4, folha:folhaOv(7, 3.2, ['#4E9E7E', '#5FB08E', '#3E8A6C'], '#1C463A', '#2E6A54'), extra:L2 => espalha(L2, 14, florCg, false) + espalha(L2, 4, frutoCg, false) })); },
    /* pequizeiro: copa larga verde viva, folhas em trio, flores de pompom e pequis */
    5: x => { const T = ramo(x, SUP + 3, -PI / 2 - .08, 44, 4, .16), a = ramo(...T[3], -PI / 2 - .95, 34, 3, .2), b = ramo(...T[3], -PI / 2 + .9, 34, 3, .2), c = ramo(...ponta(T), -PI / 2 - .05, 20, 2, .12);
      const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
      const L = [[ax - 2, ay + 1, 25, 12], [bx + 2, by + 1, 25, 12], [cx, cy - 8, 30, 14], [cx - 18, cy - 4, 18, 10]];
      return sombraArv(x, 34) + lenho([[T, 14, 8], [a, 7, 2.6], [b, 7, 2.6], [c, 6, 2.6]], 'ceCaR', '#3A1E0E', '#3A1E0E', '#D69A6A') + balanca(5, copaF(L, { g:'ceCoPq', ink:'#2E5418', sombra:'#26461A', luz:'#ECFAC4', dens:3.6, folha:folhaTrio(['#7EB848', '#8CC656', '#6EA83E'], '#2E5418', '#4E8A2E'), extra:L2 => espalha(L2, 9, florPq, true) + frutoPq(ax - 8, ay + 12) + frutoPq(cx - 20, cy + 6) })); }
  };
  const ESPV = [0, 1, 2, 3, 4, 5];
  const arvore = (x, cresce, i) => { semente = x * 3; return `<g class="${cresce ? 'cresce' : ''}">${ESPECIE[ESPV[i] || 1](x)}</g>`; };
  /* ipê-amarelo florido, sem folhas */
  const ipe = x => { semente = 404; const T = ramo(x, SUP + 3, -PI / 2 + .05, 50, 5, .2), a = ramo(...T[3], -PI / 2 - 1.0, 34, 3, .24), b = ramo(...T[3], -PI / 2 + .92, 34, 3, .24), c = ramo(...ponta(T), -PI / 2 - .2, 22, 2, .15), d = ramo(...a[2], -PI / 2 - .2, 14, 2, .2), e = ramo(...b[2], -PI / 2 + .1, 14, 2, .2);
    const [ax, ay] = ponta(a), [bx, by] = ponta(b), [cx, cy] = ponta(c);
    const L = [[ax - 2, ay - 4, 22, 14], [bx + 2, by - 4, 22, 14], [x - 14, cy + 4, 18, 11], [x + 16, cy + 4, 18, 11], [cx, cy - 8, 26, 15]];
    const chao = Array.from({length:18}, () => `<ellipse cx="${f0(R(x - 46, x + 46))}" cy="${f1(SUP + R(-1, 3))}" rx="2.4" ry="1.3" fill="${umDe(['#FFD233', '#FFE45A', '#F5B921'])}" stroke="#B07A08" stroke-width=".5"/>`).join('');
    return `<g id="ce-ipe" class="toque">${sombraArv(x, 40)}${chao}${lenho([[T, 14, 6.5], [a, 6.4, 2], [b, 6.4, 2], [c, 5, 2], [d, 3, 1.4], [e, 3, 1.4]], 'ceCaI', '#2A2018', '#2E241A', '#B8A890')}
      <g class="balanca" style="animation-delay:-1.4s">${copaF(L, { g:'ceCoIpe', ink:'#A86A06', sombra:'#8A5404', luz:'#FFF8D0', dens:3.4, folha:(px, py) => florIpe(px, py), extra:L2 => espalha(L2, 8, florIpe, true) })}</g>
      <rect x="${x - 56}" y="${SUP - 106}" width="112" height="56" fill="transparent"/></g>`; };

  /* ---------- capim dourado, flores do campo e cupinzeiros ---------- */
  const tufoD = (x, y, h, cores, n) => { let d = ''; for (let k = 0; k < n; k++) { const a = -PI / 2 + (k - (n - 1) / 2) * .2 + R(-.1, .1), hh = h * R(.6, 1.1), ex = x + Math.cos(a) * hh, ey = y + Math.sin(a) * hh; d += `<path d="M${f1(x + R(-2, 2))} ${y} Q${f1(x + Math.cos(a) * hh * .35)} ${f1(y - hh * .6)} ${f1(ex)} ${f1(ey)}" stroke="${cores[k % cores.length]}"/>`; } return d; };
  const OURO = ['#D9B54A', '#C29A2E', '#E8CC6A', '#A88A2E', '#CDB25A', '#9E8E3E'];
  semente = 72;
  const capim = Array.from({length:64}, () => { const x = R(4, 556), h = R(11, 21), cores = [umDe(OURO), umDe(OURO), umDe(OURO)]; const esp = R(0, 1) < .45 ? `<ellipse cx="${f1(x + R(-3, 3))}" cy="${f1(SUP + 1 - h * R(.95, 1.1))}" rx="1.6" ry="3.6" fill="#EBD488" stroke="#9A7A22" stroke-width=".7"/>` : ''; return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s">${tufoD(x, SUP + 2, h, cores, Math.round(R(5, 8)))}${esp}</g>`; }).join('');
  const capimFrente = Array.from({length:52}, () => tufoD(R(0, 560), SUP + 4, R(6, 11), [umDe(OURO), '#8A7A2A', umDe(OURO)], Math.round(R(4, 6)))).join('');
  const dourado = Array.from({length:9}, () => { const x = R(150, 545), n = Math.round(R(3, 5)); let o = ''; for (let k = 0; k < n; k++) { const ex = x + (k - n / 2) * R(2, 4), ey = SUP - R(22, 32); o += `<path d="M${f1(x)} ${SUP + 1} Q${f1((x + ex) / 2)} ${f1(ey + 14)} ${f1(ex)} ${f1(ey)}" stroke="#B8902A" stroke-width=".9" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="2" fill="url(#ceOuro)" stroke="#9A6E0A" stroke-width=".6"/>`; } return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s">${o}</g>`; }).join('');
  const chuveirinho = Array.from({length:7}, () => { const x = R(100, 548), h = R(24, 34); return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s"><path d="M${f1(x)} ${SUP + 1} q${f1(R(-3, 3))} ${f1(-h * .5)} 0 ${f1(-h)}" stroke="#7A8A3A" stroke-width="1" fill="none"/><circle cx="${f1(x)}" cy="${f1(SUP + 1 - h)}" r="4.4" fill="url(#ceChuv)" stroke="#A89E7A" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<circle cx="${f1(x + Math.cos(k * .785) * 4.6)}" cy="${f1(SUP + 1 - h + Math.sin(k * .785) * 4.6)}" r=".8" fill="#fff"/>`).join('')}</g>`; }).join('');
  const florzinhas = Array.from({length:12}, () => { const x = R(110, 550), h = R(6, 12), cor = umDe(['#C98AE8', '#FF8AB8', '#FFFFFF', '#FFB347']); return `<path d="M${f1(x)} ${SUP + 2} v${f1(-h)}" stroke="#5E7A2A" stroke-width=".9"/><g fill="${cor}" stroke="#6E4A6E" stroke-width=".4">${[0, 1, 2, 3, 4].map(k => `<circle cx="${f1(x + Math.cos(k * 1.256) * 1.9)}" cy="${f1(SUP + 2 - h + Math.sin(k * 1.256) * 1.9)}" r="1.5"/>`).join('')}</g><circle cx="${f1(x)}" cy="${f1(SUP + 2 - h)}" r=".8" fill="#FFC21E"/>`; }).join('');
  const cupinzinho = (x, h, w) => `<g><ellipse cx="${x + w * .4}" cy="${SUP + 2}" rx="${w * 1.2}" ry="3" fill="#2E1A0A" opacity=".25"/><path d="M${x - w} ${SUP + 3} C${x - w} ${SUP - h * .5} ${x - w * .5} ${SUP - h} ${x} ${SUP - h} C${x + w * .5} ${SUP - h} ${x + w * .9} ${SUP - h * .5} ${x + w} ${SUP + 3}Z" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="1.5"/><path d="M${x - w * .5} ${SUP - h * .55} q${w * .4} -3 ${w * .8} 0 M${x - w * .6} ${SUP - h * .25} q${w * .5} -3 ${w} 0" stroke="#8E5228" stroke-width="1" fill="none"/><path d="M${x - w * .55} ${SUP - h * .45} q1 ${-h * .3} ${w * .4} ${-h * .45}" stroke="#F2C08E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;

  /* ---------- solo em camadas ---------- */
  const SOLOD = `M0 ${SUP} H560 C600 ${SUP} 620 260 660 290 C700 320 740 336 800 340`;
  const BZ = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]; };
  const SUPT = [[0, SUP], [560, SUP]]; for (let t = .05; t < 1.01; t += .05) SUPT.push(BZ([560, SUP], [600, SUP], [620, 260], [660, 290], t)); for (let t = .05; t < 1.01; t += .05) SUPT.push(BZ([660, 290], [700, 320], [740, 336], [800, 340], t));
  const supY = x => { x = Math.max(0, Math.min(800, x)); for (let i = 1; i < SUPT.length; i++) if (SUPT[i][0] >= x) { const a = SUPT[i - 1], b = SUPT[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) || 1); } return 340; };
  const linhaH = (fr, amp, sem) => { semente = sem; const P = []; for (let x = -10; x <= 810; x += 20) { const y0 = supY(x); P.push([x, y0 + (393 - y0) * fr + Math.sin(x / 47 + sem) * amp + R(-amp, amp) * .5]); } return P; };
  const HA = linhaH(.17, 2.2, 3), HC = linhaH(.6, 3.4, 5), HB = linhaH(.86, 2, 7);
  const camada = (P, desce) => liso(P) + (desce ? ' L810 500 L-10 500Z' : '');
  const regiaoA = SOLOD + ` L810 340 L810 ${f1(ponta(HA)[1])}` + liso([...HA].reverse(), ' L') + 'Z';
  const regiaoB2 = liso(HB) + ' L810 500 L-10 500Z';
  semente = 73;
  const emSolo = (fr0, fr1, xa = 4, xb = 796) => { const x = R(xa, xb), y0 = supY(x); return [x, y0 + (393 - y0) * R(fr0, fr1)]; };
  const raizinhas = Array.from({length:120}, () => { const x = R(2, 556); let d = `M${f1(x)} ${SUP + 2}`, y = SUP + 2, xx = x; const h = R(6, 20); while (y < SUP + h) { y += R(3, 5); xx += R(-2.2, 2.2); d += ` L${f1(xx)} ${f1(y)}`; } return d; }).join(' ');
  const humus = Array.from({length:70}, () => { const [x, y] = emSolo(.03, .16); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(.8, 2.4))}" ry="${f1(R(.6, 1.4))}" fill="${umDe(['#1E0E06', '#3A2010', '#8A5A30', '#2A1A10'])}"/>`; }).join('');
  const listras = Array.from({length:16}, () => { const [x, y] = emSolo(.22, .56); const w = R(30, 90); return `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(R(-3, 3))} ${f1(w)} 0" stroke="${umDe(['#E08A54', '#D8784A', '#9A4220'])}" stroke-width="${f1(R(1, 2.2))}" fill="none" opacity=".5" stroke-linecap="round"/>`; }).join('');
  const nodulos = Array.from({length:60}, () => { const [x, y] = emSolo(.2, .58); const r = R(.9, 2.2); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${umDe(['#6E2A12', '#7E3418', '#E8A070'])}" opacity=".75"/>`; }).join('');
  const manchas = Array.from({length:22}, () => { const [x, y] = emSolo(.64, .95); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(8, 20))}" ry="${f1(R(3, 6))}" fill="${umDe(['#F0C27A', '#E8B068', '#C8743E'])}" opacity=".45"/>`; }).join('');
  const seixo = (x, y, r) => { const g = umDe(['ceSx1', 'ceSx1', 'ceSx2', 'ceSx3']), rot = R(-30, 30); return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f0(rot)})"><ellipse cx="1" cy="${f1(r * .3)}" rx="${f1(r)}" ry="${f1(r * .62)}" fill="#3A1E0C" opacity=".35"/><ellipse rx="${f1(r)}" ry="${f1(r * .64)}" fill="url(#${g})" stroke="#4E2A14" stroke-width="1"/><path d="M${f1(-r * .5)} ${f1(-r * .2)} q${f1(r * .35)} ${f1(-r * .32)} ${f1(r * .75)} ${f1(-r * .1)}" stroke="#FFF2DE" stroke-width=".9" fill="none" opacity=".8" stroke-linecap="round"/></g>`; };
  const pedras = Array.from({length:30}, () => { const [x, y] = emSolo(.64, .97, 8, 792); return seixo(x, y, R(3.5, 8.5)); }).join('') + Array.from({length:12}, () => { const [x, y] = emSolo(.22, .55); return seixo(x, y, R(2.5, 4.5)); }).join('');
  const linhaSeixos = HC.filter((_, k) => k % 1 === 0).map(([x, y]) => seixo(x + R(-6, 6), y + R(-2, 2), R(2.4, 4.4)) + seixo(x + 10 + R(-4, 4), y + R(-2, 3), R(2, 3.6))).join('');
  const serrapilheira = Array.from({length:70}, () => { const x = R(2, 558); return `<ellipse cx="${f1(x)}" cy="${f1(SUP + R(.5, 3))}" rx="${f1(R(1.8, 3.4))}" ry="${f1(R(.8, 1.4))}" transform="rotate(${f0(R(-30, 30))} ${f1(x)} ${SUP + 2})" fill="${umDe(['#B8763A', '#8A5428', '#D89A4A', '#6E4A22', '#A8862E'])}" stroke="#4E2E14" stroke-width=".4"/>`; }).join('');
  /* bichos do solo: galerias de cupim, formigueiro, larva */
  const cupins = (pts) => pts.map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="2.2" ry="1.3" fill="#F6EAD0" stroke="#8A6A4A" stroke-width=".4"/><circle cx="2.3" cy="0" r="1" fill="#C88A3A"/></g>`).join('');
  const formiga = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="-2.6" cy="0" rx="1.8" ry="1.3" fill="#3A1408"/><circle cx="0" cy="0" r="1" fill="#3A1408"/><circle cx="2" cy="0" r="1.2" fill="#3A1408"/><path d="M-1 -1.8 L1 1.8 M1 -1.8 L-1 1.8 M3 -1 l1.4 -1.4" stroke="#3A1408" stroke-width=".45"/></g>`;
  const vidaSolo = `<g>
      <path d="M22 ${SUP + 2} C18 236 28 246 22 258 C16 270 32 282 28 296 M22 258 C34 260 44 258 52 266 M28 296 C40 298 52 296 60 306 M52 266 C60 276 70 278 76 286" stroke="#7A3E1C" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M22 ${SUP + 2} C18 236 28 246 22 258 C16 270 32 282 28 296 M22 258 C34 260 44 258 52 266 M28 296 C40 298 52 296 60 306 M52 266 C60 276 70 278 76 286" stroke="#2A1206" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${[[22, 258, 8, 5], [52, 266, 7, 4.5], [28, 296, 8, 5], [60, 306, 7, 4.5], [76, 286, 6, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + 1.5}" ry="${ry + 1.5}" fill="#7A3E1C"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ceCamara)"/>`).join('')}
      ${cupins([[20, 259], [25, 256], [52, 267], [30, 297], [26, 294], [60, 307]])}
      <path d="M604 ${f1(supY(604) + 1)} C600 250 612 262 606 274 C600 286 614 296 610 310 M606 274 C618 276 626 272 632 280 M610 310 C620 312 628 308 636 316" stroke="#7A3E1C" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M604 ${f1(supY(604) + 1)} C600 250 612 262 606 274 C600 286 614 296 610 310 M606 274 C618 276 626 272 632 280 M610 310 C620 312 628 308 636 316" stroke="#2A1206" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${[[606, 274, 7, 4], [632, 280, 7, 4.2], [610, 310, 8, 4.5], [636, 316, 6, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + 1.4}" ry="${ry + 1.4}" fill="#7A3E1C"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ceCamara)"/>`).join('')}
      ${formiga(606, 274, 10)}${formiga(632, 281, -20)}${formiga(611, 310, 0)}${formiga(603, 290, 70)}
      <g fill="#F6EEDC" stroke="#B8A47A" stroke-width=".5">${[[634, 316], [638, 317], [636, 314]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1.1"/>`).join('')}</g>
      <g transform="translate(306 252) scale(1.15)"><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#A8987A" stroke-width="8.6" fill="none" stroke-linecap="round"/><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#FFF4E0" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="M-8 -3 C-9 -11 5 -13 8 -6 C10 0 6 6 -1 6" stroke="#CDB894" stroke-width="6.6" fill="none" stroke-dasharray=".8 2.6"/><path d="M-5 -1 l-2 3 M-3 -3 l-1 3.4 M-1 -4 l0 3.4" stroke="#8A5A2A" stroke-width=".8" stroke-linecap="round"/><circle cx="-8" cy="-3" r="3.4" fill="#E0882E" stroke="#8A4A12" stroke-width=".8"/><circle cx="-9" cy="-4" r=".8" fill="#3A1A08"/></g>
      <g fill="#5A3A1C" stroke="#2E1A0A" stroke-width=".5">${Array.from({length:10}, () => { const [x, y] = emSolo(.04, .14, 20, 550); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2" ry="1.2" transform="rotate(${f0(R(-40, 40))} ${f1(x)} ${f1(y)})"/>`; }).join('')}</g>
    </g>`;

  /* ---------- bichos ---------- */
  const arara = (x, y, d) => `<g transform="translate(${x} ${y})">
      <path d="M-8 1 C-20 6 -32 11 -46 16 C-44 12 -40 8 -36 6 C-28 2 -18 -2 -8 -4Z" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.2" stroke-linejoin="round"/><path d="M-10 0 C-22 6 -32 10 -42 14" stroke="#5FA8F0" stroke-width="1" fill="none"/><path d="M-9 2 C-18 7 -26 10 -34 12 C-28 8 -18 4 -9 1Z" fill="#F7B21E" stroke="#12235A" stroke-width=".8"/>
      <ellipse cx="0" cy="0" rx="13.5" ry="7.2" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.4"/>
      <path d="M-9 2.5 C-3 9 8 8.6 12.6 2 C6 4 -2 5 -9 2.5Z" fill="url(#ceArAm)" stroke="#12235A" stroke-width="1"/>
      <circle cx="13" cy="-3" r="6.6" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.4"/><path d="M10 -9 C13 -10.4 16 -10 18 -8" stroke="#6CC04A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="15.4" cy="-1.6" rx="3.8" ry="3.2" fill="#F6F6F2" stroke="#12235A" stroke-width=".6"/><path d="M13.2 -.2 q1.6 .6 3.2 0 M13.4 1.2 q1.4 .5 2.8 0" stroke="#12235A" stroke-width=".5" fill="none"/><circle cx="15" cy="-3" r="1.4" fill="#12235A"/><circle cx="15.4" cy="-3.4" r=".5" fill="#fff"/>
      <path d="M18 -5 C24 -6 26 0 21.6 4 C21.4 1 20.4 -.4 18.4 -.6Z" fill="#1E1E28" stroke="#0A0A12" stroke-width=".8"/><path d="M19 -4 q2.6 -.4 4 1.6" stroke="#6E6E80" stroke-width=".7" fill="none"/>
      <g class="asa" style="animation-delay:${d}s"><path d="M-7 -2 C-4 -16 6 -22 14 -20 C10 -15 7 -9 5 -2Z" fill="url(#ceArAz)" stroke="#12235A" stroke-width="1.3" stroke-linejoin="round"/><path d="M-2 -10 C2 -16 8 -19 12 -19 M-4 -6 C0 -12 6 -15 10 -15" stroke="#12235A" stroke-width=".7" fill="none" opacity=".7"/><path d="M-6 -3 C-3 -10 2 -13 6 -13" stroke="#8CC8FF" stroke-width="1.2" fill="none" stroke-linecap="round"/></g></g>`;
  const seriema = `<g id="ce-seriema" class="toque" transform="translate(22 166)"><g id="ce-seri-in">
      <ellipse cx="0" cy="1" rx="13" ry="2.4" fill="#2E1A0A" opacity=".3"/>
      <path d="M-3 -22 L-5 0 M3 -22 L5 0" stroke="#8E2A16" stroke-width="3.6" stroke-linecap="round"/><path d="M-3 -22 L-5 0 M3 -22 L5 0" stroke="#E04A2E" stroke-width="2.2" stroke-linecap="round"/><path d="M-9 0 h7 M2 0 h7" stroke="#B83A22" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-11 -32 C-22 -31 -30 -25 -36 -15 C-34 -13 -31 -13 -29 -15 C-24 -21 -17 -24 -10 -25Z" fill="url(#ceSeriCauda)" stroke="#3E2E1E" stroke-width="1.3" stroke-linejoin="round"/><path d="M-22 -28 l3 4 M-27 -23 l3 4" stroke="#2E2014" stroke-width="2" stroke-linecap="round"/><path d="M-36 -15 l3 2" stroke="#F4ECDC" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="-2" cy="-30" rx="13.5" ry="9.4" fill="url(#ceSeriCorpo)" stroke="#3E2E1E" stroke-width="1.6"/>
      <path d="M-12 -33 C-6 -36 2 -36 6 -33 C2 -28 -6 -26 -12 -28Z" fill="#8E7454" stroke="#3E2E1E" stroke-width="1"/><path d="M-10 -31 q3 2 6 1 M-6 -29 q3 2 6 1 M-2 -32 q2 2 5 1" stroke="#5E4A34" stroke-width=".8" fill="none"/>
      <path d="M2 -24 q3 -2 6 -1 M-2 -22 q3 -1 5 0" stroke="#F4ECDC" stroke-width="1" fill="none" opacity=".8"/>
      <g id="ce-seri-cab"><path d="M6 -34 C9 -40 9 -46 11 -52" stroke="#3E2E1E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M6 -34 C9 -40 9 -46 11 -52" stroke="#E2CEAA" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M7 -37 l2 -1 M8 -42 l2 -1 M9 -47 l2 -1" stroke="#A88A64" stroke-width=".8"/>
        <circle cx="12" cy="-53" r="5.8" fill="url(#ceSeriCab)" stroke="#3E2E1E" stroke-width="1.4"/>
        <path d="M14 -58 C11 -64 7 -67 2 -68 M14.6 -58 C14 -65 11 -69 7 -72 M15.2 -58 C16 -65 15 -69 12 -73" stroke="#3E2E1E" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M14 -58 C11 -64 7 -67 2 -68 M14.6 -58 C14 -65 11 -69 7 -72 M15.2 -58 C16 -65 15 -69 12 -73" stroke="#8E7454" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <circle cx="13.8" cy="-54" r="3" fill="#7AB4F0" stroke="#2E4A8A" stroke-width=".6"/><circle cx="13.8" cy="-54" r="2" fill="#FFF6D8"/><circle cx="14.2" cy="-54" r="1.1" fill="#12235A"/><circle cx="14.6" cy="-54.5" r=".45" fill="#fff"/>
        <path id="ce-seri-bico" d="M16 -55.5 C20 -55.6 23.6 -54 25 -51.6 C22 -51.4 19 -50.6 16 -50.4Z" fill="#E0553A" stroke="#8E2A16" stroke-width="1" stroke-linejoin="round"/><path d="M17 -54.4 q3 0 5.6 1.6" stroke="#FF9A7A" stroke-width=".7" fill="none"/></g></g><rect x="-38" y="-76" width="66" height="80" fill="transparent"/></g>`;
  const borboleta = (id, cor, cor2) => `<g id="${id}" class="toque ce-borb"><g class="ce-asas"><path d="M0 0 C-10 -13 -17 -5 -13 1 C-15 8 -6 10 0 2Z" fill="${cor}" stroke="#12235A" stroke-width="1.1"/><path d="M0 0 C10 -13 17 -5 13 1 C15 8 6 10 0 2Z" fill="${cor}" stroke="#12235A" stroke-width="1.1"/><path d="M-1 -1 C-8 -10 -14 -6 -12.4 -1 M1 -1 C8 -10 14 -6 12.4 -1" stroke="${cor2}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="-9" cy="-4" r="1.8" fill="#fff" stroke="#12235A" stroke-width=".5"/><circle cx="9" cy="-4" r="1.8" fill="#fff" stroke="#12235A" stroke-width=".5"/><circle cx="-7" cy="4" r="1.1" fill="${cor2}"/><circle cx="7" cy="4" r="1.1" fill="${cor2}"/></g><path d="M0 -4 V5" stroke="#12235A" stroke-width="2" stroke-linecap="round"/><path d="M0 -4 q-2 -4 -4 -5 M0 -4 q2 -4 4 -5" stroke="#12235A" stroke-width=".7" fill="none"/><rect x="-16" y="-14" width="32" height="26" fill="transparent"/></g>`;
  const NASC = [{ x:618, y:262, yf:288, nome:'São Francisco', fala:'Nasceu o Rio São Francisco! Ele atravessa o sertão e leva água para milhões de pessoas.' }, { x:676, y:303, yf:314, nome:'Paraná', fala:'Nasceu o Rio Paraná! Suas águas movem usinas que fazem energia para muitas cidades.' }, { x:736, y:329, yf:338, nome:'Tocantins', fala:'Nasceu o Rio Tocantins! Ele corre para o norte e vai encontrar a Amazônia.' }];

  /* ---------- fundo: serras, chapada, campo distante ---------- */
  semente = 74;
  const MESA = 'M428 236 L436 196 L441 170 L445 148 L451 134 L470 127 L560 125 L640 123 L702 122 L716 128 L724 150 L732 178 L740 206 L760 222 L800 232 V272 H428Z';
  const faixas = [[136, 10, '#F6C690'], [156, 7, '#C8764A'], [176, 13, '#ECAA72'], [198, 7, '#B8653C'], [214, 11, '#D99560']].map(([y, h, cor]) => { let top = `M420 ${y}`, bot = ''; for (let x = 440; x <= 820; x += 40) top += ` Q${x - 20} ${f1(y + R(-2.5, 2.5))} ${x} ${f1(y + R(-1.5, 1.5))}`; bot = ` L820 ${y + h} L420 ${y + h}Z`; return `<path d="${top}${bot}" fill="${cor}" opacity=".75"/><path d="${top}" stroke="#FFE2BC" stroke-width="1.3" fill="none" opacity=".55"/><path d="M420 ${y + h} H820" stroke="#8A4426" stroke-width="1.2" opacity=".45"/>`; }).join('');
  const juntas = Array.from({length:16}, () => { const x = R(458, 712), y0 = R(124, 150), y1 = y0 + R(30, 90); let d = `M${f1(x)} ${f1(y0)}`, xx = x; for (let y = y0 + 10; y < y1; y += 10) { xx += R(-1.6, 1.6); d += ` L${f1(xx)} ${f1(y)}`; } return `<path d="${d}" stroke="#8A4428" stroke-width="1.5" fill="none" opacity=".6"/><path d="${d}" transform="translate(1.6 0)" stroke="#FFD2A4" stroke-width="1" fill="none" opacity=".45"/>`; }).join('');
  const arbusto = (x, y, r) => `<path d="${copa(x, y, r, r * .72, 7, .3)}" fill="url(#ceArb)" stroke="#3E6A22" stroke-width="1"/><path d="M${f1(x - r * .5)} ${f1(y - r * .25)} q${f1(r * .3)} ${f1(-r * .4)} ${f1(r * .7)} ${f1(-r * .3)}" stroke="#D6F0A8" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  const topoMesa = Array.from({length:30}, (_, k) => 452 + k * 9).filter(x => x < 626 || x > 650).map(x => { const r = R(3.5, 7); return arbusto(x + R(-3, 3), (x < 470 ? 131 : x > 704 ? 124 : 125) - r * .35, r); }).join('') + [[536, 116], [668, 114]].map(([x, y]) => `<path d="M${x} 124 q-1 -5 1 -9 M${x} 118 q3 -2 5 -5" stroke="#4E321C" stroke-width="1.6" fill="none"/>${arbusto(x - 2, y - 2, 6)}${arbusto(x + 6, y - 4, 5)}`).join('');
  const ressaltos = [[470, 152], [520, 172], [586, 150], [700, 170], [552, 196], [680, 196]].map(([x, y]) => arbusto(x, y, R(3, 4.5))).join('');
  const longe = Array.from({length:22}, () => { const x = R(6, 436), y = R(200, 208), r = R(4, 8); return `<path d="M${f1(x)} ${f1(y + r)} v5" stroke="#6E7A62" stroke-width="1.2"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .62)}" fill="${umDe(['#8EA884', '#9AB08A', '#86A07E', '#A4B48C'])}"/><ellipse cx="${f1(x - r * .25)}" cy="${f1(y - r * .25)}" rx="${f1(r * .5)}" ry="${f1(r * .28)}" fill="#C4D4AE" opacity=".6"/>`; }).join('');
  const pocas = [[600, 246, 13], [700, 282, 12], [778, 292, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * .3)}" fill="url(#cePoca)" stroke="#2E7A5A" stroke-width="1"/><path d="M${x - r * .5} ${y - 1} h${f1(r * .5)}" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`).join('');

  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Corte do Cerrado com chapada, ipê-amarelo, cupinzeiro com seriema, raízes profundas, água guardada debaixo da terra e nascentes na vereda">
    <defs>
      <linearGradient id="ceCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA6EE"/><stop offset=".45" stop-color="#A6D8F6"/><stop offset=".75" stop-color="#E4F2F2"/><stop offset="1" stop-color="#FFE2B0"/></linearGradient>
      <radialGradient id="ceSolBrilho"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset=".35" stop-color="#FFE27A" stop-opacity=".4"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
      <radialGradient id="ceSolDisco" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".6" stop-color="#FFD84D"/><stop offset="1" stop-color="#FFB52E"/></radialGradient>
      <linearGradient id="ceMesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B07A"/><stop offset=".5" stop-color="#DC8C58"/><stop offset="1" stop-color="#B0603A"/></linearGradient>
      <linearGradient id="ceNeblina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8F2F6" stop-opacity="0"/><stop offset=".6" stop-color="#E8F2F6" stop-opacity=".12"/><stop offset="1" stop-color="#F4EEDC" stop-opacity=".55"/></linearGradient>
      <linearGradient id="ceQueda" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8DDF4"/><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#8CCDEE"/></linearGradient>
      <radialGradient id="ceNevoa"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="ceArb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C4E08C"/><stop offset=".55" stop-color="#7EA84C"/><stop offset="1" stop-color="#4E7A2E"/></radialGradient>
      <linearGradient id="ceCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCD498"/><stop offset="1" stop-color="#C8B666"/></linearGradient>
      <linearGradient id="ceVereda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6DC74"/><stop offset=".6" stop-color="#6CB250"/><stop offset="1" stop-color="#3E8A3E"/></linearGradient>
      <radialGradient id="cePoca" cx=".4" cy=".35"><stop offset="0" stop-color="#C8F0FF"/><stop offset="1" stop-color="#3E9ACC"/></radialGradient>
      <linearGradient id="ceSoloB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8643A"/><stop offset=".6" stop-color="#B0542C"/><stop offset="1" stop-color="#8E4220"/></linearGradient>
      <linearGradient id="ceSoloA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2614"/><stop offset=".7" stop-color="#6E3A1E"/><stop offset="1" stop-color="#8E4A26"/></linearGradient>
      <linearGradient id="ceSoloC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2854A"/><stop offset=".6" stop-color="#DC9A5C"/><stop offset="1" stop-color="#C88A56"/></linearGradient>
      <linearGradient id="ceSoloD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C89A68"/><stop offset="1" stop-color="#A8804E"/></linearGradient>
      <radialGradient id="ceSx1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4E6"/><stop offset=".6" stop-color="#E2CDB4"/><stop offset="1" stop-color="#A8907A"/></radialGradient>
      <radialGradient id="ceSx2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C87A56"/><stop offset=".6" stop-color="#8E3E22"/><stop offset="1" stop-color="#5A2210"/></radialGradient>
      <radialGradient id="ceSx3" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#DCDAD4"/><stop offset=".6" stop-color="#9A968E"/><stop offset="1" stop-color="#666258"/></radialGradient>
      <radialGradient id="ceCamara" cx=".5" cy=".4"><stop offset="0" stop-color="#7A4220"/><stop offset="1" stop-color="#4A2410"/></radialGradient>
      <linearGradient id="ceAq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6E4FF"/><stop offset=".3" stop-color="#4AA8F0"/><stop offset="1" stop-color="#1A58BC"/></linearGradient>
      <radialGradient id="ceGr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF2D8"/><stop offset=".55" stop-color="#DDB884"/><stop offset="1" stop-color="#9A7444"/></radialGradient>
      <radialGradient id="ceGr2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F4F0EA"/><stop offset=".55" stop-color="#BEB4A6"/><stop offset="1" stop-color="#7E7466"/></radialGradient>
      <pattern id="ceGraos" width="28" height="20" patternUnits="userSpaceOnUse"><ellipse cx="6.5" cy="6" rx="5.4" ry="4.4" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><ellipse cx="19" cy="4.6" rx="4.2" ry="3.4" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".9"/><ellipse cx="13" cy="14.6" rx="4.8" ry="3.9" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><ellipse cx="24.6" cy="14.4" rx="3.3" ry="3" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/><circle cx="3" cy="16.4" r="2.2" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".7"/></pattern>
      <pattern id="ceGraos2" width="61" height="43" patternUnits="userSpaceOnUse"><ellipse cx="14" cy="10" rx="8" ry="6" fill="url(#ceGr2)" stroke="#5E5446" stroke-width="1"/><ellipse cx="44" cy="30" rx="9" ry="6.6" fill="url(#ceGr)" stroke="#7A5630" stroke-width="1"/><ellipse cx="50" cy="8" rx="5.4" ry="4.2" fill="url(#ceGr2)" stroke="#5E5446" stroke-width=".9"/><ellipse cx="20" cy="34" rx="4.6" ry="3.6" fill="url(#ceGr)" stroke="#7A5630" stroke-width=".9"/></pattern>
      <clipPath id="ceAqClip"><path d="M0 396 Q200 386 400 398 T800 392 V500 H0Z"/></clipPath>
      <clipPath id="ceSoloClip"><path d="${SOLOD} V500 H0Z"/></clipPath>
      <clipPath id="ceMesaClip"><path d="${MESA}"/></clipPath>
      <linearGradient id="ceRaiz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2610"/><stop offset=".4" stop-color="#8E5A32"/><stop offset="1" stop-color="#3E200C"/></linearGradient>
      <linearGradient id="ceCaR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A3A20"/><stop offset=".4" stop-color="#B07448"/><stop offset="1" stop-color="#5A2E16"/></linearGradient>
      <linearGradient id="ceCaC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A6C58"/><stop offset=".4" stop-color="#C6B698"/><stop offset="1" stop-color="#5E5240"/></linearGradient>
      <linearGradient id="ceCaE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A2E1A"/><stop offset=".4" stop-color="#946A48"/><stop offset="1" stop-color="#3A2212"/></linearGradient>
      <linearGradient id="ceCaI" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E4236"/><stop offset=".4" stop-color="#8E8070"/><stop offset="1" stop-color="#3A3028"/></linearGradient>
      <radialGradient id="ceCoIpe" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4B0"/><stop offset=".45" stop-color="#FFD43A"/><stop offset=".85" stop-color="#F0A818"/><stop offset="1" stop-color="#C87C0A"/></radialGradient>
      <radialGradient id="ceCoBa" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#EEF5A6"/><stop offset=".5" stop-color="#B6CC52"/><stop offset="1" stop-color="#7A962C"/></radialGradient>
      <radialGradient id="ceCoLx" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#E2EAD0"/><stop offset=".5" stop-color="#A3B68E"/><stop offset="1" stop-color="#6A805E"/></radialGradient>
      <radialGradient id="ceCoPt" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#DADC8E"/><stop offset=".5" stop-color="#9CA646"/><stop offset="1" stop-color="#626E28"/></radialGradient>
      <radialGradient id="ceCoCg" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#A8DCC2"/><stop offset=".5" stop-color="#4E9C7E"/><stop offset="1" stop-color="#245E4C"/></radialGradient>
      <radialGradient id="ceCoPq" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#CCEE90"/><stop offset=".5" stop-color="#7CB646"/><stop offset="1" stop-color="#44782A"/></radialGradient>
      <radialGradient id="ceFlorPq" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFDF0"/><stop offset="1" stop-color="#F2E2A8"/></radialGradient>
      <radialGradient id="ceFrutoPq" cx=".35" cy=".3"><stop offset="0" stop-color="#B8DC6A"/><stop offset=".6" stop-color="#6A9A2E"/><stop offset="1" stop-color="#3E6A1A"/></radialGradient>
      <radialGradient id="ceOuro" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF2A8"/><stop offset=".6" stop-color="#F2C230"/><stop offset="1" stop-color="#B8820E"/></radialGradient>
      <radialGradient id="ceChuv" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F4F0E2"/><stop offset="1" stop-color="#D8D0B4"/></radialGradient>
      <linearGradient id="ceCupim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8A86C"/><stop offset=".5" stop-color="#C2743E"/><stop offset="1" stop-color="#8A4824"/></linearGradient>
      <radialGradient id="ceMonte" cx=".45" cy=".2" r=".9"><stop offset="0" stop-color="#D89A60"/><stop offset=".7" stop-color="#A86434"/><stop offset="1" stop-color="#7A4220"/></radialGradient>
      <radialGradient id="ceToca" cx=".5" cy=".4"><stop offset="0" stop-color="#1A0A04"/><stop offset=".8" stop-color="#3A1C0C"/><stop offset="1" stop-color="#5A2E14"/></radialGradient>
      <linearGradient id="ceTatuCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8AE90"/><stop offset=".55" stop-color="#8E7460"/><stop offset="1" stop-color="#5E4A3A"/></linearGradient>
      <linearGradient id="ceArAz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA8F6"/><stop offset=".6" stop-color="#2A78DA"/><stop offset="1" stop-color="#1A4EA8"/></linearGradient>
      <linearGradient id="ceArAm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE06A"/><stop offset="1" stop-color="#F59A1E"/></linearGradient>
      <radialGradient id="ceSeriCorpo" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#EADCC2"/><stop offset=".6" stop-color="#BCA07A"/><stop offset="1" stop-color="#7E6446"/></radialGradient>
      <linearGradient id="ceSeriCauda" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8060"/><stop offset="1" stop-color="#5E4A34"/></linearGradient>
      <radialGradient id="ceSeriCab" cx=".4" cy=".35"><stop offset="0" stop-color="#F4E8D2"/><stop offset="1" stop-color="#C6AE88"/></radialGradient>
      <radialGradient id="ceVinheta" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#2E1A0A" stop-opacity="0"/><stop offset="1" stop-color="#2E1A0A" stop-opacity=".34"/></radialGradient>
      <filter id="ceGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#ceCeu)"/>
    <circle cx="380" cy="54" r="120" fill="url(#ceSolBrilho)"/>
    <g id="ce-sol" class="toque"><g class="gira-lento" style="transform-box:fill-box;transform-origin:center"><path d="${Array.from({length:12}, (_, k) => { const a = k * Math.PI / 6; return `M${(380 + Math.cos(a) * 40).toFixed(1)} ${(54 + Math.sin(a) * 40).toFixed(1)} L${(380 + Math.cos(a) * 54).toFixed(1)} ${(54 + Math.sin(a) * 54).toFixed(1)}`; }).join(' ')}" stroke="#FFD24A" stroke-width="5" stroke-linecap="round"/></g><circle cx="380" cy="54" r="32" fill="url(#ceSolDisco)" stroke="#F0A81E" stroke-width="3"/><path d="M362 44 q8 -10 22 -10" stroke="#FFF8D6" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="380" cy="54" r="58" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="560" y="30" width="110" height="52" style="color:#fff" opacity=".85"/><use href="#nuvem" x="40" y="22" width="80" height="38" style="color:#fff" opacity=".65"/><use href="#nuvem" x="250" y="118" width="70" height="30" style="color:#fff" opacity=".45"/></g>
    <g id="ce-araras" class="toque"><g id="ce-araras-in">${arara(0, 0, 0)}${arara(46, 14, -.16)}</g></g>
    <path d="M0 184 L60 160 L140 168 L200 150 L270 166 L340 148 L420 160 L500 150 L600 166 L800 170 V260 H0Z" fill="#CFC6E2" opacity=".7"/>
    <path d="M0 196 L40 176 L170 172 L196 186 L300 182 L330 168 L470 164 L500 180 L800 190 V260 H0Z" fill="#AEA8CC" opacity=".75"/>
    <g>
      <path d="${MESA}" fill="url(#ceMesa)"/>
      <g clip-path="url(#ceMesaClip)">
        ${faixas}${juntas}
        <path d="M420 120 H820 V138 C700 134 560 136 420 140Z" fill="#8A3E1E" opacity=".28"/>
        <path d="M428 236 L436 196 L441 170 L445 148 L451 134 L470 127 L478 140 L470 180 L462 236Z" fill="#FFE2BC" opacity=".3"/>
        <path d="M694 122 L716 128 L724 150 L732 178 L740 206 L760 222 L800 232 V272 H704 L708 220 L702 170 L698 140Z" fill="#6A2414" opacity=".32"/>
        <path d="M424 222 C500 214 560 230 640 218 C700 212 760 226 820 230 V280 H424Z" fill="#D9A07A" opacity=".55"/>
        ${Array.from({length:18}, () => `<ellipse cx="${f1(R(432, 790))}" cy="${f1(R(224, 240))}" rx="${f1(R(2, 5))}" ry="${f1(R(1.4, 3))}" fill="${umDe(['#B8653C', '#E8B88E', '#9A4E2C'])}" stroke="#7A3A1E" stroke-width=".6"/>`).join('')}
        <rect x="420" y="110" width="400" height="170" fill="url(#ceNeblina)"/>
      </g>
      <path d="${MESA}" fill="none" stroke="#8A4A26" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M445 148 L451 134 L470 127 L560 125 L640 123 L702 122 L716 128" stroke="#6E9E44" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${topoMesa}
    </g>
    <g id="ce-cachoeira" class="toque">
      <path d="M622 124 C620 160 618 190 620 216 L654 216 C652 190 650 160 650 124Z" fill="#6A2E16" opacity=".35"/>
      <path d="M636 124 C628 121 618 121 600 122" stroke="#7FC8EC" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M628 124 C631 150 626 182 628 214 L646 214 C643 182 647 150 643 124Z" fill="url(#ceQueda)" stroke="#9ED6F2" stroke-width="1"/>
      <path class="ce-flui" d="M632 126 C634 150 630 180 632 212" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-dasharray="10 8" stroke-linecap="round"/>
      <path class="ce-flui" d="M637 126 C639 150 635 182 637 212" stroke="#7FCDEB" stroke-width="2.6" fill="none" stroke-dasharray="8 10" stroke-linecap="round"/>
      <path class="ce-flui" d="M641 126 C642 152 640 182 642 212" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-dasharray="6 12" stroke-linecap="round"/>
      <path d="M640 220 C644 230 638 238 646 248" stroke="#6FC0EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="637" cy="218" rx="19" ry="5" fill="url(#cePoca)" stroke="#3E8ABE" stroke-width="1"/>
      <g fill="#fff"><ellipse cx="630" cy="215" rx="6" ry="2.6"/><ellipse cx="643" cy="215.5" rx="5" ry="2.2"/><circle cx="623" cy="212" r="1.6"/><circle cx="651" cy="211" r="1.4"/><circle cx="637" cy="210" r="1.8"/></g>
      <g opacity=".85"><g style="animation:flutua 2.4s ease-in-out infinite alternate"><circle cx="626" cy="206" r="12" fill="url(#ceNevoa)"/><circle cx="648" cy="204" r="11" fill="url(#ceNevoa)"/></g><g style="animation:flutua 3.1s ease-in-out -1s infinite alternate"><circle cx="637" cy="198" r="14" fill="url(#ceNevoa)" opacity=".7"/><circle cx="614" cy="214" r="8" fill="url(#ceNevoa)"/><circle cx="660" cy="214" r="8" fill="url(#ceNevoa)"/></g></g>
      <rect x="614" y="118" width="46" height="104" fill="transparent"/></g>
    <path d="M0 206 Q120 198 240 204 T480 200 L560 202 V228 H0Z" fill="url(#ceCampo)"/>
    <g opacity=".85">${longe}</g>
    <path d="M0 206 Q120 198 240 204 T480 200 L560 202 V228 H0Z" fill="#F4EEDC" opacity=".18"/>
    <path d="M560 230 C640 236 700 262 800 270 V350 H560Z" fill="url(#ceVereda)" stroke="#4E8A3A" stroke-width="2"/>
    <path d="M560 232 C640 238 700 264 800 272" stroke="#D2F0A8" stroke-width="2" fill="none" opacity=".7"/>
    ${pocas}
    <g>${[[588, 168, .56, 0], [652, 184, .5, -1.2], [770, 194, .54, -2.3]].map(([x, y, sc, d]) => `<g class="balanca" style="animation-delay:${d}s"><svg x="${x - 50 * sc}" y="${y}" width="${100 * sc}" height="${150 * sc}" viewBox="0 0 100 150"><use class="sem" href="#f-buriti"/></svg></g>`).join('')}</g>
    <g stroke-width="1.8" fill="none" stroke-linecap="round">${[592, 612, 628, 648, 664, 690, 712, 730, 752, 774, 792].map(x => tufoD(x, +f1(supY(x) - 4 - (x > 640 ? 6 : 2) - (x - 560) * .1), R(10, 16), ['#3E7A2A', '#5E9A3A', '#2E6A22'], 5)).join('')}</g>
    <path d="${SOLOD} V500 H0Z" fill="url(#ceSoloB)"/>
    <g clip-path="url(#ceSoloClip)">
      <path d="${camada(HC, true)}" fill="url(#ceSoloC)"/>
      <path d="${regiaoB2}" fill="url(#ceSoloD)" opacity=".7"/>
      ${listras}${nodulos}${manchas}
      <path d="${liso(HC)}" stroke="#7A3418" stroke-width="2" fill="none" opacity=".5"/>
      ${linhaSeixos}${pedras}
      <path d="${regiaoA}" fill="url(#ceSoloA)"/>
      <path d="${liso(HA)}" stroke="#3A1A0A" stroke-width="1.6" fill="none" opacity=".5"/>
      ${humus}
      <path d="${raizinhas}" stroke="#2A140A" stroke-width=".8" fill="none" opacity=".55"/>
      <path d="${SOLOD} L800 352 C740 346 700 332 656 302 C616 272 596 240 560 240 H0Z" fill="#1E1E1A" opacity=".22"/>
      ${vidaSolo}
    </g>
    <path d="${SOLOD}" stroke="#4A2A14" stroke-width="2.4" fill="none"/>
    <path d="M0 ${SUP + 1} H560" stroke="#E8C870" stroke-width="2" opacity=".7"/>
    ${serrapilheira}
    <g stroke-width="1.6" fill="none" stroke-linecap="round" pointer-events="none">${capim}${dourado}${chuveirinho}</g>
    <g pointer-events="none">${florzinhas}${cupinzinho(214, 20, 9)}${cupinzinho(396, 26, 10)}${cupinzinho(578, 16, 8)}</g>
    <g clip-path="url(#ceAqClip)"><rect x="0" y="380" width="800" height="120" fill="#7A5A3A"/><rect id="ce-aq" x="0" y="${AQ0}" width="800" height="130" fill="url(#ceAq)"/><rect x="0" y="380" width="800" height="120" fill="url(#ceGraos)" opacity=".9"/><rect x="7" y="383" width="800" height="120" fill="url(#ceGraos2)" opacity=".85"/>
      <g id="ce-aq-onda"><path d="M0 ${AQ0} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#F0FAFF" stroke-width="2.8" fill="none"/><path d="M0 ${AQ0 + 2} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5AB8F6" stroke-width="2" fill="none" opacity=".7"/><path d="M10 ${AQ0 + 16} q30 -6 60 0 t60 0 M200 ${AQ0 + 22} q30 -6 60 0 t60 0 M420 ${AQ0 + 14} q30 -6 60 0 t60 0 M630 ${AQ0 + 20} q30 -6 60 0 t60 0 M110 ${AQ0 + 40} q30 -6 60 0 M330 ${AQ0 + 44} q30 -6 60 0 M540 ${AQ0 + 38} q30 -6 60 0" stroke="#D8F4FF" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/><g fill="#E8F8FF" opacity=".8">${[60, 180, 300, 470, 590, 720].map(x => `<circle cx="${x}" cy="${AQ0 + 10 + (x % 7) * 3}" r="1.8"/><circle cx="${x + 8}" cy="${AQ0 + 24 + (x % 5) * 2}" r="1.2"/>`).join('')}</g></g></g>
    <path d="M0 396 Q200 386 400 398 T800 392" stroke="#4A2A14" stroke-width="3.2" fill="none"/><path d="M0 399 Q200 389 400 401 T800 395" stroke="#F2D4A8" stroke-width="1.4" fill="none" opacity=".45"/>
    <rect id="ce-aq-toque" class="toque" x="0" y="398" width="800" height="102" fill="transparent"/>
    <text x="16" y="488" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="#fff" stroke="#12235A" stroke-opacity=".55" stroke-width="3.4" paint-order="stroke">Água guardada debaixo da terra</text>
    <g id="ce-raizes" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="ce-toca" class="toque"><path d="M668 294 C674 320 684 338 694 352" stroke="#8A4A26" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M668 294 C674 320 684 338 694 352" stroke="#2A1408" stroke-width="12.5" fill="none" stroke-linecap="round"/><path d="M664 296 C670 318 678 334 688 348" stroke="#5A2E14" stroke-width="2" fill="none" opacity=".8"/><path d="M660 294 q8 -6 16 0" stroke="#C8855A" stroke-width="2" fill="none" stroke-linecap="round"/><g transform="translate(244 62)"><ellipse cx="456" cy="305" rx="43" ry="22.5" fill="#8A4A26"/><ellipse cx="456" cy="304" rx="40" ry="20" fill="url(#ceToca)"/><path d="M420 296 C430 284 482 284 492 296" stroke="#B8764A" stroke-width="1.8" fill="none" opacity=".7"/><path d="M420 318 q10 4 20 2 q12 3 24 0 q14 3 26 -2" stroke="#C8A050" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M426 320 l5 -3 M446 321 l4 -3 M470 321 l5 -3 M484 318 l3 -3" stroke="#E0BC66" stroke-width="1.2" stroke-linecap="round"/>
      <g id="ce-tatu"><path d="M406 311 C412 314 418 314 424 312" stroke="#5E4A3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M406 311 C412 314 418 314 424 312" stroke="#A88A70" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="2.4 1.4"/>
        <path d="M422 318 C420 298 438 286 458 288 C478 289 490 302 488 318Z" fill="url(#ceTatuCasco)" stroke="#3A2A1E" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M440 291 C436 301 436 311 438 318 M450 289 C448 300 448 310 449 318 M460 289 C460 300 461 310 462 318 M470 292 C472 302 472 310 472 318" stroke="#4E3A2A" stroke-width="1.5" fill="none"/>
        <path d="M442 291 C438 301 438 311 440 317 M452 289 C450 300 450 310 451 317 M462 289 C462 300 463 310 464 317 M472 292 C474 302 474 310 474 317" stroke="#E2CCAE" stroke-width=".8" fill="none" opacity=".8"/>
        <g fill="#E2CCAE" opacity=".7">${[[428, 304], [432, 298], [430, 311], [480, 302], [482, 310], [477, 296]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g>
        <path d="M424 315 C440 319 470 319 487 315" stroke="#E8D4B4" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M486 313 C492 306 500 302 507 302 C507 307 500 313 489 318Z" fill="#C9A884" stroke="#3A2A1E" stroke-width="1.4" stroke-linejoin="round"/><circle cx="507" cy="303" r="1.4" fill="#5E3A2A"/>
        <path d="M490 304 c-1 -5 2 -8 5 -7 c1 3 -1 6 -5 7Z" fill="#B89474" stroke="#3A2A1E" stroke-width="1.1"/>
        <path d="M494 308 q2.2 1.8 4.4 0" stroke="#12235A" stroke-width="1.4" fill="none" stroke-linecap="round"/><ellipse cx="499" cy="311" rx="2" ry="1.1" fill="#F2A08A" opacity=".7"/>
        <path d="M480 318 l2 3 M483 318 l2.6 2.6 M486 317 l3 2" stroke="#3A2A1E" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M444 293 q8 -4 18 -3" stroke="#F2E2C8" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/></g>
      <g id="ce-zzz" font-family="Baloo 2, sans-serif" font-weight="800" fill="#FFF1D6" stroke="#5A2E14" stroke-width="1.6" paint-order="stroke"><text x="496" y="288" font-size="11">z</text><text x="504" y="278" font-size="14">z</text></g><rect x="410" y="270" width="96" height="58" fill="transparent"/></g></g>
    <g id="ce-minhoca" class="toque"><path id="ce-minh0" d="" stroke="#9A3A56" stroke-width="8" fill="none" stroke-linecap="round"/><path id="ce-minh" d="" stroke="#F09AAA" stroke-width="6" fill="none" stroke-linecap="round"/><path id="ce-minh2" d="" stroke="#B24A62" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="1 5"/><rect x="186" y="256" width="70" height="30" fill="transparent"/></g>
    <g id="ce-arvores"></g>
    <g id="ce-buracos"></g>
    <g stroke-width="1.5" fill="none" stroke-linecap="round" pointer-events="none">${capimFrente}</g>
    <g id="ce-flores"></g>
    <g id="ce-cupim" class="toque"><ellipse cx="30" cy="${SUP + 2}" rx="30" ry="4" fill="#2E1A0A" opacity=".3"/>
      <path d="M-2 ${SUP + 3} C0 212 2 200 4 190 C5 182 8 176 9 170 C10 164 13 160 17 161 C20 156 26 157 28 162 C32 168 34 178 37 188 C39 196 43 204 45 211 C46 216 48 ${SUP} 50 ${SUP + 3}Z" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="2" stroke-linejoin="round"/>
      <path d="M34 196 C40 188 46 190 47 198 C48 206 47 214 46 ${SUP}" fill="url(#ceCupim)" stroke="#5E3418" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M6 200 q6 -4 12 0 M22 186 q5 -3 10 1 M12 212 q8 -3 16 0 M10 178 q4 -2 8 0 M28 206 q6 -3 12 0" stroke="#8E5228" stroke-width="1.4" fill="none"/>
      ${[[18, 182, 2.8, 2.1], [34, 202, 3, 2.3], [10, 206, 2.6, 1.9], [26, 214, 2.2, 1.6], [42, 206, 2, 1.6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx + .9}" ry="${ry + .9}" fill="#E8A878"/><ellipse cx="${x}" cy="${y - .4}" rx="${rx}" ry="${ry}" fill="#2E1408"/>`).join('')}
      <g fill="#A86030">${[[8, 192], [14, 196], [30, 192], [24, 200], [16, 218], [36, 214], [20, 172], [4, 214]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g>
      <path d="M7 186 C8 176 11 168 15 164" stroke="#F6CC9C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M44 ${SUP} q-2 -10 -8 -14 M44 ${SUP} q0 -10 3 -16 M44 ${SUP} q3 -7 8 -10" stroke="#B8962E" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
    ${seriema}
    <path id="ce-lingua" d="M54 ${SUP - 18} Q44 ${SUP - 14} 36 ${SUP - 19}" stroke="#E0557A" stroke-width="2.6" fill="none" stroke-linecap="round" style="opacity:0"/>
    <g class="toque" data-fig="tamandua" id="ce-tamandua"><ellipse cx="94" cy="${SUP + 2}" rx="34" ry="4" fill="#2E1A0A" opacity=".28"/><svg x="50" y="${SUP - 52}" width="84" height="56" viewBox="0 0 150 100"><use href="#f-tamandua"/></svg>${brilhoHotspot(100, SUP - 48)}</g>
    <g class="toque" data-fig="lobo" id="ce-lobo" transform="translate(514 0)"><ellipse cx="0" cy="${SUP + 1}" rx="22" ry="3.4" fill="#2E1A0A" opacity=".28"/><g id="ce-lobo-in"><svg x="-30" y="${SUP - 66}" width="60" height="66" viewBox="0 0 120 130"><use href="#f-lobo"/></svg></g>${brilhoHotspot(0, SUP - 62)}</g>
    <g class="toque" data-fig="pequi" id="ce-pequi"><g id="ce-pequi-in"><path d="M540 ${SUP - 62} v8" stroke="#3E6A22" stroke-width="2"/><svg x="528" y="${SUP - 56}" width="26" height="26" viewBox="0 0 100 100"><use href="#f-pequi"/></svg></g></g>
    <g class="toque" data-fig="buriti"><svg x="708" y="196" width="60" height="90" viewBox="0 0 100 150"><use href="#f-buriti"/></svg>${brilhoHotspot(744, 206)}</g>
    <g id="ce-rios"></g>
    <g id="ce-nasc"></g>
    ${borboleta('ce-borb1', '#FF9A3D', '#C2410C')}${borboleta('ce-borb2', '#B57BFF', '#6D28D9')}
    <g id="ce-nuvem" class="toque" style="cursor:grab;opacity:0;transition:opacity .6s"><use href="#nuvem" x="-80" y="-40" width="160" height="82" style="color:#6F7A98"/><use href="#nuvem" x="-76" y="-37" width="152" height="76" style="color:#C3CBDD"/><use href="#nuvem" x="-50" y="-12" width="100" height="46" style="color:#D3DAE8"/><path d="M-34 -14 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="ce-olhos-n" fill="#12235A"><circle cx="-14" cy="6" r="3"/><circle cx="12" cy="6" r="3"/><path d="M-6 14 q6 5 12 0" stroke="#12235A" stroke-width="2.2" fill="none" stroke-linecap="round"/></g><rect x="-84" y="-46" width="168" height="94" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#ceVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#ceGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const gR = el(s, '#ce-raizes'), gA = el(s, '#ce-arvores'), gB = el(s, '#ce-buracos'), nuvem = el(s, '#ce-nuvem'), aq = el(s, '#ce-aq'), aqOnda = el(s, '#ce-aq-onda');
  /* raízes orgânicas: afinam até a ponta, têm radicelas e um fio de água que desce na chuva */
  const raizesDe = (x, sem) => { semente = sem; const out = []; for (let k = 0; k < 7; k++) { const curta = k >= 5, lado = k === 0 ? 0 : (k % 2 ? -1 : 1), alvo = k === 0 ? 394 : curta ? R(246, 272) : R(290, 384); let xx = x + lado * R(1, 4), yy = SUP + 4; const P = [[xx, yy]]; while (yy < alvo) { yy = Math.min(alvo, yy + R(14, 24)); xx += lado * (curta ? R(10, 18) : R(4, 12)) + R(-5, 5); P.push([xx, yy]); } if (P.length < 3) P.splice(1, 0, [(P[0][0] + P[1][0]) / 2 + R(-2, 2), (P[0][1] + P[1][1]) / 2]); out.push({ P, w: k === 0 ? 10 : curta ? R(3.4, 4.6) : R(5, 7.5) }); } return out; };
  function desenhaRaizes(a, anima){
    const rs = raizesDe(a.x, a.x); let finas = '', corpo = '', luz = '', agua = '';
    rs.forEach(({ P, w }) => {
      const n = P.length;
      for (let i = 1; i < n; i++) { const p = P[i], q = P[i - 1], dx = p[0] - q[0], dy = p[1] - q[1], base = Math.atan2(dy, dx); [-1, 1].forEach(sg => { if (R(0, 1) < .35) return; const ang = base + sg * R(.7, 1.25), L = R(7, 17) * (1 - i / n * .4), t = R(.2, .8), sx = q[0] + dx * t, sy = q[1] + dy * t, ex = sx + Math.cos(ang) * L, ey = sy + Math.sin(ang) * L + L * .25; finas += `M${f1(sx)} ${f1(sy)} Q${f1(sx + Math.cos(ang) * L * .6)} ${f1(sy + Math.sin(ang) * L * .6)} ${f1(ex)} ${f1(ey)} M${f1(ex)} ${f1(ey)} l${f1(R(-3, 3))} ${f1(R(2, 4))} `; }); }
      const [tx, ty] = ponta(P); finas += `M${f1(tx)} ${f1(ty)} l-3 4 M${f1(tx)} ${f1(ty)} l3 4 M${f1(tx)} ${f1(ty)} l0 5 `;
      corpo += `<path d="${tubo(P, w, .9)}" fill="url(#ceRaiz)" stroke="#2A1406" stroke-width="1.1"/>`;
      luz += `<path d="${liso(paralela(P, w, .9, -.42, 0).slice(0, Math.max(2, n - 1)))}" stroke="#D29A68" stroke-width="1.1" fill="none" opacity=".75"/>`;
      agua += `<path class="ce-rag" d="${liso(P)}" stroke="#9EE0FF" stroke-width="${f1(Math.max(1.3, w * .22))}" fill="none" stroke-dasharray="2.4 14" style="opacity:0;transition:opacity 1s"/>`;
    });
    const id = 'ceRm' + a.x;
    const mascara = anima ? `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="${SUP - 10}" width="800" height="300">${rs.map(r => `<path d="${liso(r.P)}" pathLength="100" stroke="#fff" stroke-width="46" fill="none" stroke-linecap="butt" style="stroke-dasharray:100 120;stroke-dashoffset:100;transition:stroke-dashoffset 2.2s ease-out"/>`).join('')}</mask>` : '';
    gR.insertAdjacentHTML('beforeend', `<g>${mascara}<g${anima ? ` mask="url(#${id})"` : ''}><path d="${finas}" stroke="#4A2812" stroke-width=".9" fill="none" opacity=".9"/>${corpo}${luz}${agua}</g></g>`);
    if (fase === 'chuva') gR.querySelectorAll('.ce-rag').forEach(molhaRaiz);
    if (anima) requestAnimationFrame(() => requestAnimationFrame(() => s.querySelectorAll(`#${id} path`).forEach(p => p.style.strokeDashoffset = '0')));
  }
  function molhaRaiz(p){ if (p.dataset.ok) return; p.dataset.ok = 1; p.style.opacity = .75; p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:900, iterations:Infinity }); }
  ARV.forEach((a, i) => {
    if (a.ipe) { gA.insertAdjacentHTML('beforeend', ipe(a.x)); desenhaRaizes(a, false); }
    else if (a.ok) { gA.insertAdjacentHTML('beforeend', arvore(a.x, false, i)); desenhaRaizes(a, false); }
    else gB.insertAdjacentHTML('beforeend', `<g class="toque ce-buraco" data-i="${i}"><path d="M${a.x-34} ${SUP+3} Q${a.x-20} ${SUP-8} ${a.x} ${SUP-9} Q${a.x+20} ${SUP-8} ${a.x+34} ${SUP+3} Z" fill="url(#ceMonte)" stroke="#5E3218" stroke-width="2" stroke-linejoin="round"/><ellipse cx="${a.x}" cy="${SUP-5}" rx="13" ry="3.6" fill="#3A1A08" stroke="#5E3218" stroke-width="1.2"/><path d="M${a.x-22} ${SUP-3} q6 -4 12 -4" stroke="#E8B07A" stroke-width="1.6" fill="none" stroke-linecap="round"/><g fill="#8A5028" stroke="#4E2A12" stroke-width=".6"><circle cx="${a.x-24}" cy="${SUP}" r="1.8"/><circle cx="${a.x+18}" cy="${SUP-2}" r="2.2"/><circle cx="${a.x+26}" cy="${SUP+1}" r="1.5"/><circle cx="${a.x-12}" cy="${SUP+1}" r="1.4"/></g><g style="animation:flutua .9s ease-in-out ${-i * .3}s infinite alternate"><ellipse cx="${a.x}" cy="${SUP-22}" rx="6" ry="7.6" fill="url(#ceMonte)" stroke="#4E321C" stroke-width="1.6"/><path d="M${a.x} ${SUP-29} c4 -6 10 -6 12 -4 c-4 0 -8 2 -12 4" fill="#7EC850" stroke="#3E6A22" stroke-width="1.2"/><path d="M${a.x} ${SUP-29} c-3 -4 -8 -5 -10 -3 c3 0 6 1 10 3" fill="#9ADA62" stroke="#3E6A22" stroke-width="1.1"/><path d="M${a.x-2.4} ${SUP-25} q-1 4 1 7" stroke="#F0C08A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>${brilhoHotspot(a.x + 14, SUP - 30)}<rect x="${a.x-40}" y="${SUP-44}" width="80" height="54" fill="transparent"/></g>`);
  });
  gB.addEventListener('click', e => {
    const g = e.target.closest('.ce-buraco'); if (!g || fase !== 'plantar') return; e.stopPropagation();
    const i = +g.dataset.i, a = ARV[i]; g.remove(); a.ok = true; plantadas++; toca('planta');
    for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:a.x + sorte(-14, 14), y:SUP, t:k, cor:'#B5723A' });
    gA.insertAdjacentHTML('beforeend', arvore(a.x, true, i)); desenhaRaizes(a, true); c.brilhos(a.x, SUP - 40, 10, '#D6F0A8');
    api.hud(`<span class="chip">Mudas plantadas: ${plantadas}/4</span>`);
    if (plantadas === 1) api.diz('Viu as raízes? No Cerrado elas vão muito fundo, por isso dizem que é uma floresta de cabeça para baixo.');
    if (plantadas === 3) api.diz('Falta uma! As raízes do Cerrado chegam bem pertinho da água lá embaixo.');
    if (plantadas === 4) { soltaLobo(); depois(1800, comecaChuva); }
  });
  /* lobo-guará: espera quieto e depois passeia pelo campo */
  const lobo = el(s, '#ce-lobo'), loboIn = el(s, '#ce-lobo-in');
  let loboX = 514, loboDir = -1, loboAnda = false, loboPausa = 0;
  function soltaLobo(){ loboAnda = true; }
  lobo.addEventListener('click', () => { loboPausa = performance.now() + 1800; toca('fig'); });
  /* borboletas, minhoca, lobo e tamanduá: laço da vida */
  const borbs = [{ e:el(s, '#ce-borb1'), cx:250, cy:150, ax:90, ay:30, v:.00042, f:0, fugiu:0 }, { e:el(s, '#ce-borb2'), cx:470, cy:176, ax:70, ay:24, v:.00055, f:2, fugiu:0 }];
  borbs.forEach(b => b.e.addEventListener('click', ev => { ev.stopPropagation(); b.fugiu = performance.now(); toca('pop'); c.brilhos(b.x, b.y, 5, '#FFE27A'); }));
  const minh0 = el(s, '#ce-minh0'), minh = el(s, '#ce-minh'), minh2 = el(s, '#ce-minh2'); let minhEsc = 0;
  const araras = el(s, '#ce-araras-in'); let araraT0 = performance.now() - 6000;
  (function vida(t){
    if (!vivo) return;
    borbs.forEach(b => { const k = t * b.v + b.f, fuga = b.fugiu ? Math.min(1, (t - b.fugiu) / 1400) : 0; b.x = b.cx + Math.sin(k * 2.1) * b.ax + fuga * 300; b.y = b.cy + Math.sin(k * 3.3) * b.ay - fuga * 160; if (fuga >= 1) { b.fugiu = 0; } const asa = .35 + Math.abs(Math.sin(t / 70 + b.f)) * .65; b.e.setAttribute('transform', `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`); b.e.firstElementChild.setAttribute('transform', `scale(${asa.toFixed(2)} 1)`); });
    const esc = minhEsc > t ? 1 - Math.min(1, (minhEsc - t) / 300) * 0 : 0, sumido = minhEsc > t;
    let d = '', d2 = ''; for (let i = 0; i <= 10; i++) { const x = 196 + i * 5, y = 270 + Math.sin(t / 260 + i * .8) * 4 * (sumido ? .2 : 1); d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } minh0.setAttribute('d', d); minh.setAttribute('d', d); minh2.setAttribute('d', d); minh0.style.opacity = minh.style.opacity = minh2.style.opacity = sumido ? .25 : 1;
    if (loboAnda && t > loboPausa) { loboX += loboDir * .55; if (loboX < 150) loboDir = 1; if (loboX > 500) loboDir = -1; }
    lobo.setAttribute('transform', `translate(${loboX.toFixed(1)} ${loboAnda && t > loboPausa ? (Math.abs(Math.sin(t / 140)) * -2.2).toFixed(1) : 0})`);
    loboIn.setAttribute('transform', loboDir > 0 ? 'scale(-1 1)' : '');
    const ka = ((t - araraT0) % 16000) / 9000; araras.setAttribute('transform', ka <= 1 ? `translate(${(-90 + ka * 1000).toFixed(1)} ${(96 - Math.sin(ka * Math.PI) * 50).toFixed(1)})` : 'translate(-200 0)');
    requestAnimationFrame(vida);
  })(performance.now());
  el(s, '#ce-minhoca').addEventListener('click', e => { e.stopPropagation(); minhEsc = performance.now() + 1600; toca('clique'); api.diz('A minhoca cava túneis e deixa a terra fofinha. Assim a água da chuva entra no chão com facilidade.'); });
  el(s, '#ce-toca').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ce-tatu').animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px) rotate(-3deg)' }, { transform:'translateY(0)' }, { transform:'translateY(-4px) rotate(2deg)' }, { transform:'translateY(0)' }], { duration:700 }); el(s, '#ce-zzz').animate([{ opacity:1 }, { opacity:0, transform:'translateY(-12px)' }, { opacity:1 }], { duration:1400 }); api.diz('Um tatu-canastra na toca! Ele cava buracos fundos, e por esses caminhos a água da chuva também entra na terra.'); });
  el(s, '#ce-cupim').addEventListener('click', e => { e.stopPropagation(); lingua(); api.diz('É um cupinzeiro! O tamanduá-bandeira come cupins com a língua comprida, e a seriema gosta de cantar lá de cima.'); });
  el(s, '#ce-tamandua').addEventListener('click', () => lingua());
  function lingua(){ const l = el(s, '#ce-lingua'); l.animate([{ opacity:1, strokeDasharray:'0 30' }, { opacity:1, strokeDasharray:'30 0', offset:.4 }, { opacity:1, strokeDasharray:'30 0', offset:.6 }, { opacity:1, strokeDasharray:'0 30' }], { duration:900 }); toca('clique'); depois(380, () => c.brilhos(36, SUP - 20, 4, '#FFE27A')); }
  el(s, '#ce-seriema').addEventListener('click', e => { e.stopPropagation(); [990, 940, 880, 820, 760].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'triangle', .09, f * .8), i * 140)); const cab = el(s, '#ce-seri-cab'); cab.style.transformBox = 'fill-box'; cab.style.transformOrigin = '20% 100%'; cab.animate([{ transform:'rotate(0)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(0)' }], { duration:900 }); api.diz('A seriema canta alto, lá de cima do cupinzeiro! Dá para ouvir o canto dela de bem longe.'); });
  el(s, '#ce-ipe').addEventListener('click', e => { e.stopPropagation(); toca('planta'); for (let i = 0; i < 26; i++) c.add({ tipo:'petala', x:sorte(30, 130), y:sorte(SUP - 100, SUP - 60), vy:sorte(.6, 1.3), f:sorte(0, 6), chao:sorte(SUP - 4, SUP + 6), cor: Math.random() < .5 ? '#FFC83D' : '#FFE27A', borda:'#B07A08' }); api.diz('É o ipê-amarelo! Ele perde as folhas e fica todo florido no fim da seca.'); });
  el(s, '#ce-araras').addEventListener('click', e => { e.stopPropagation(); [1200, 900, 1250].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'sawtooth', .05, f * .7), i * 120)); c.brilhos(200, 90, 6, '#FFE27A'); api.diz('Araras-canindé, azuis e amarelas! Elas fazem ninho nos buritis da vereda.'); });
  el(s, '#ce-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(380, 54, 10, '#FFE27A'); api.diz('O sol do Cerrado é forte. A seca dura meses, por isso as plantas buscam água bem fundo com as raízes.'); });
  el(s, '#ce-cachoeira').addEventListener('click', e => { e.stopPropagation(); toca('splash'); for (let i = 0; i < 8; i++) c.add({ tipo:'respingo', x:636 + sorte(-8, 8), y:214, t:i }); api.diz('Uma cachoeira na chapada! A água que sai das pedras do Cerrado forma cachoeiras lindas.'); });
  el(s, '#ce-aq-toque').addEventListener('click', e => { if (fase === 'chuva') return; e.stopPropagation(); const p = c.ponto(e); for (let i = 0; i < 5; i++) c.add({ tipo:'bolha', x:p.x + sorte(-10, 10), y:p.y, t:i }); toca('glub'); api.diz(cheio >= META ? 'Agora tem muita água guardada entre os grãos de areia e pedra. Os cientistas chamam isso de aquífero.' : 'Aqui embaixo a água fica guardada entre grãos de areia e pedra, como numa esponja.'); });
  el(s, '#ce-pequi').addEventListener('click', () => { const g = el(s, '#ce-pequi-in'); if (g.dataset.caiu) return; g.dataset.caiu = 1; g.animate([{ transform:'translateY(0)' }, { transform:'translateY(48px)', offset:.45, easing:'ease-out' }, { transform:'translateY(38px)', offset:.6, easing:'ease-in' }, { transform:'translateY(48px)', offset:.75 }, { transform:'translateY(48px)', offset:.92, opacity:1 }, { transform:'translateY(48px)', opacity:0 }], { duration:2600 }); depois(2600, () => { delete g.dataset.caiu; }); });
  /* chuva arrastável que faz brotar flores */
  function comecaChuva(){
    fase = 'chuva'; nuvem.style.opacity = 1; posN(); toca('chuva'); gR.querySelectorAll('.ce-rag').forEach(molhaRaiz);
    api.hud(`<span class="chip">Água guardada: 0%</span>`);
    api.diz('Chegou a chuva! Arraste a nuvem por cima das árvores. As raízes ajudam a água a entrar no chão e encher a água guardada lá embaixo.');
    chovendo();
  }
  const posN = () => nuvem.setAttribute('transform', `translate(${nuvemX.toFixed(1)} 72)`);
  let dirN = 1;
  function chovendo(){
    if (!vivo || fase !== 'chuva') return;
    if (!arrN) { nuvemX += dirN * 1.4; if (nuvemX > 560 || nuvemX < 70) dirN *= -1; posN(); }
    const x = nuvemX + sorte(-60, 60);
    c.add({ tipo:'chuva', x, y:104, vx:-.4, vy:sorte(9,12), chao:SUP, cor:'#3D8BFF' });
    const perto = ARV.find(a => a.ok && Math.abs(a.x - x) < 56);
    if (perto && Math.random() < .55) depois(380, () => c.add({ tipo:'infiltra', x0:x, y0:SUP + 6, x1:perto.x + sorte(-30, 30), y1:AQ1 + 4 + sorte(0, 20), dur:sorte(70, 100), f:sorte(0, 6), chega:encher }));
    depois(70, chovendo);
  }
  const FLOR = ['#B57BFF', '#FFFFFF', '#FF8AB8', '#FFD447'];
  function brota(x){
    const cor = FLOR[nFlores++ % 4], h = sorte(11, 17), y = SUP + 2 - h, tinta = ['#5E3A9E', '#8A8A9A', '#B03A6E', '#B07A08'][(nFlores - 1) % 4];
    el(s, '#ce-flores').insertAdjacentHTML('beforeend', `<g class="cresce"><path d="M${x.toFixed(0)} ${SUP + 2} q-2 -${(h/2).toFixed(0)} 0 -${h.toFixed(0)}" stroke="#4E7A2A" stroke-width="1.8" fill="none"/><path d="M${x.toFixed(1)} ${(SUP - h * .35).toFixed(1)} q-6 -1 -7 -5 q5 0 7 5Z M${x.toFixed(1)} ${(SUP - h * .55).toFixed(1)} q6 -1 7 -5 q-5 0 -7 5Z" fill="#7EB848" stroke="#3E6A22" stroke-width=".7"/><g fill="${cor}" stroke="${tinta}" stroke-width=".8">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${(x + Math.cos(a * Math.PI / 180) * 3.4).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * 3.4).toFixed(1)}" rx="2.9" ry="2.1" transform="rotate(${a} ${(x + Math.cos(a * Math.PI / 180) * 3.4).toFixed(1)} ${(y + Math.sin(a * Math.PI / 180) * 3.4).toFixed(1)})"/>`).join('')}</g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#FFB020" stroke="#B0700A" stroke-width=".6"/><circle cx="${(x - .6).toFixed(1)}" cy="${(y - .6).toFixed(1)}" r=".6" fill="#FFF2B0"/></g>`);
  }
  function encher(){
    if (fase !== 'chuva') return; cheio++;
    const y = AQ0 + (AQ1 - AQ0) * Math.min(1, cheio / META); aq.setAttribute('y', y.toFixed(1)); aqOnda.setAttribute('transform', `translate(0 ${(y - AQ0).toFixed(1)})`);
    const pc = Math.min(100, Math.round(cheio / META * 100)); api.hud(`<span class="chip">Água guardada: ${pc}%</span>`);
    if (cheio % 6 === 0) brota(sorte(110, 545));
    if (cheio === 18) api.diz('Olha, a chuva fez brotar flores no Cerrado!');
    if (cheio === Math.round(META / 2)) api.diz('A água está descendo pelas raízes e enchendo os espaços entre os grãos. Continue!');
    if (cheio >= META) { fase = 'nascentes'; nuvem.style.opacity = 0; toca('vitoria'); mostraNascentes(); }
  }
  nuvem.addEventListener('pointerdown', e => { if (fase !== 'chuva') return; arrN = { dx: nuvemX - c.ponto(e).x }; s.setPointerCapture(e.pointerId); nuvem.style.cursor = 'grabbing'; });
  s.addEventListener('pointermove', e => { if (!arrN) return; nuvemX = Math.max(60, Math.min(600, c.ponto(e).x + arrN.dx)); posN(); });
  s.addEventListener('pointerup', () => { arrN = null; nuvem.style.cursor = 'grab'; });
  function mostraNascentes(){
    api.hud('<span class="chip">Nascentes: 0/3</span>');
    api.diz('A água debaixo da terra encheu! Agora ela sai devagar nas nascentes, lá na vereda. Toque em cada nascente.');
    el(s, '#ce-nasc').innerHTML = NASC.map((n, i) => `<g class="toque ce-n" data-n="${i}"><circle cx="${n.x}" cy="${n.y}" r="16" fill="#9FD8FF" stroke="#1B56C4" stroke-width="2.5"/><circle cx="${n.x}" cy="${n.y}" r="16" fill="none" stroke="#fff" stroke-width="3" class="pino-pulso"/><use href="#gota" x="${n.x - 6}" y="${n.y - 9}" width="12" height="16" style="color:#1B56C4"/><circle cx="${n.x}" cy="${n.y}" r="28" fill="transparent"/></g>`).join('');
  }
  el(s, '#ce-nasc').addEventListener('click', e => {
    const g = e.target.closest('.ce-n'); if (!g || fase !== 'nascentes' || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; const n = NASC[+g.dataset.n]; toca('splash'); nRios++;
    const d = `M${n.x} ${n.y} C${n.x + 30} ${n.y + 4} ${(n.x + 820) / 2} ${n.yf - 8} 820 ${n.yf}`;
    el(s, '#ce-rios').insertAdjacentHTML('beforeend', `<path d="${d}" stroke="#1B56C4" stroke-width="12" fill="none" stroke-linecap="round" class="ce-rio"/><path d="${d}" stroke="#5AAEFF" stroke-width="7" fill="none" stroke-linecap="round" class="ce-rio"/><path d="${d}" stroke="#DFF3FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 14" class="ce-corre" opacity="0"/><text x="${n.x - 22}" y="${n.y + 6}" text-anchor="end" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="#12235A" stroke-opacity=".6" stroke-width="3.4" paint-order="stroke" opacity="0" style="transition:opacity .6s .8s" class="ce-rotulo">${n.nome}</text>`);
    s.querySelectorAll('.ce-rio').forEach(p => { if (p.dataset.ok) return; p.dataset.ok = 1; const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = 'stroke-dashoffset 1.6s ease-out'; requestAnimationFrame(() => requestAnimationFrame(() => p.style.strokeDashoffset = 0)); });
    s.querySelectorAll('.ce-corre').forEach(p => { if (p.dataset.ok) return; p.dataset.ok = 1; depois(1500, () => { p.setAttribute('opacity', .9); p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-40 }], { duration:700, iterations:Infinity }); }); });
    s.querySelectorAll('.ce-rotulo').forEach(t => t.setAttribute('opacity', 1));
    c.brilhos(n.x, n.y, 8, '#BFE6FF'); for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:n.x + sorte(-8, 8), y:n.y, t:i }); api.diz(n.fala);
    api.hud(`<span class="chip">Nascentes: ${nRios}/3</span>`);
    if (nRios === 3) { fase = 'fim'; depois(3200, () => { api.diz('O Cerrado é o berço das águas: nele nascem rios que levam água para quase todo o Brasil. Cuidar do Cerrado é cuidar dessas nascentes!'); depois(3400, api.fim); }); }
  });
  s.querySelectorAll('.ce-flui').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-36 }], { duration:800, iterations:Infinity }));
  api.hud('<span class="chip">Mudas plantadas: 0/4</span>');
  api.diz('Oi, eu sou o Guará, um lobo-guará do Cerrado! Aqui tem pedaços de chão sem plantas. Toque em cada sementinha para plantar uma muda. Você também pode tocar nos bichos, nas flores e até debaixo da terra!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 6: Mata Atlântica, a floresta que faz água ================= */
function jogoMata(palco, api){
  semente = 81;
  let vivo = true, fase = 'neblina', nBrom = 0, nPlant = 0, nPulos = 0, arrN = null, nevX = 690, nevY = 120, pulando = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const NS = 'http://www.w3.org/2000/svg';
  const CRISTA = [[0,186],[60,150],[120,124],[220,98],[320,126],[440,196],[560,262],[660,318],[740,356],[800,368]];
  const crista = x => { for (let i = 1; i < CRISTA.length; i++) { const [x0, y0] = CRISTA[i-1], [x1, y1] = CRISTA[i]; if (x <= x1) { const k = (x - x0) / (x1 - x0), e = k*k*(3-2*k); return y0 + (y1 - y0) * e; } } return 368; };
  let serra = 'M0 500 V186'; for (let x = 0; x <= 800; x += 10) serra += ` L${x} ${crista(x).toFixed(1)}`; serra += ' V500Z';
  const FLORES = ['maFRoxa', 'maFRoxa', 'maFRosa', 'maFAmar', 'maFBranca'];
  const VERDES = ['maV1', 'maV2', 'maV3', 'maV4', 'maV5', 'maV6', 'maV7'];
  const TINTA = { maV1:'#0B4A2A', maV2:'#3E6A12', maV3:'#3A4E12', maV4:'#0E5048', maV5:'#145E24', maV6:'#06321A', maV7:'#40664A' };
  const FUNDO = ['maV7', 'maV4', 'maV2', 'maV3', 'maV5'], FRENTE = ['maV1', 'maV6', 'maV5', 'maV2', 'maV4', 'maV3'];
  let ultVerde = '';
  const escolheVerde = y => { const lista = y < 4 ? FUNDO : y < 9 ? VERDES : FRENTE; let g; do { g = lista[Math.floor(R(0, lista.length))]; } while (g === ultVerde); ultVerde = g; return g; };
  /* copas da floresta em camadas, cada uma com luz e sombra próprias */
  let floresta = '';
  for (let y = 0; y < 15; y++) for (let x = -10; x < 820; x += R(28, 38)) {
    const yy = crista(Math.max(0, Math.min(800, x))) + 8 + y * 24 + R(-6, 6); if (yy > 492) continue;
    const r = R(16, 24) + y * .7, flor = y > 0 && y < 12 && R(0, 1) < .1, gr = flor ? FLORES[Math.floor(R(0, FLORES.length))] : escolheVerde(y), tinta = flor ? '#6E3E7A' : TINTA[gr];
    floresta += `<path d="${copa(x + 3, yy + 5, r, r * .72, 8)}" fill="#0B3A20" opacity=".45"/><path d="${copa(x, yy, r, r * .72, 8)}" fill="url(#${gr})" stroke="${tinta}" stroke-width="1.5"/>` + (y < 4 ? `<path d="${copa(x, yy, r, r * .72, 8)}" fill="#E8F6F2" opacity="${(.2 - y * .05).toFixed(2)}"/>` : '');
    if (flor) floresta += `<g fill="${gr === 'maFAmar' ? '#FFF6B8' : '#FFFFFF'}" opacity=".85">${Array.from({length:9}, () => `<circle cx="${(x + R(-r * .65, r * .65)).toFixed(1)}" cy="${(yy + R(-r * .5, r * .35)).toFixed(1)}" r="${R(1.2, 2.2).toFixed(1)}"/>`).join('')}</g>`;
    else floresta += textura(x, yy + 2, r * .6, r * .4, 3, tinta, 1.2);
    if (R(0, 1) < .45) floresta += `<path d="M${(x - r * .55).toFixed(0)} ${(yy - r * .28).toFixed(0)} q${(r * .3).toFixed(0)} -${(r * .26).toFixed(0)} ${(r * .62).toFixed(0)} -${(r * .1).toFixed(0)}" stroke="${flor ? '#FFF0FF' : '#B8F0A8'}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>`;
  }
  /* samambaiaçu: a samambaia que vira árvore */
  const samamb = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-2 -20 2 -40 0 -58" stroke="#3E2A18" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-2 -10 h4 M-2 -22 h4 M-2 -34 h4 M-2 -46 h4" stroke="#6E5038" stroke-width="2"/>${[-175,-150,-125,-95,-60,-30,-5].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r) * 40, ey = -58 + Math.sin(r) * 22 + 16, cx = Math.cos(r) * 22, cy = -58 + Math.sin(r) * 26; return `<path d="M0 -58 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#2E7A3A" stroke-width="2" fill="none"/><path d="M0 -58 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#5CC06A" stroke-width="13" fill="none" stroke-dasharray="2 2" stroke-linecap="round"/>`; }).join('')}</g>`;
  /* helicônias e folhas grandes na frente da cena */
  const heliconia = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${s * (f || 1)} ${s})"><path d="M0 0 C-30 -40 -40 -80 -30 -120 C-10 -90 0 -50 0 0Z" fill="url(#maFolha)" stroke="#0F5530" stroke-width="2"/><path d="M0 0 C-14 -40 -22 -80 -30 -118" stroke="#A8E89A" stroke-width="1.6" fill="none"/><path d="M6 0 C30 -30 50 -70 44 -110 C26 -80 10 -40 6 0Z" fill="url(#maFolha)" stroke="#0F5530" stroke-width="2"/><path d="M6 0 C22 -36 34 -70 44 -108" stroke="#A8E89A" stroke-width="1.6" fill="none"/><path d="M2 0 V-70" stroke="#2E6A2A" stroke-width="3"/>${[0, 1, 2, 3].map(k => `<path d="M2 ${-70 + k * 12} l${k % 2 ? -16 : 16} -6 l${k % 2 ? 14 : -14} 10Z" fill="${k % 2 ? '#FF5A3A' : '#E5392C'}" stroke="#8E1E14" stroke-width="1.2" stroke-linejoin="round"/><path d="M${k % 2 ? -12 : 16} ${-74 + k * 12} l${k % 2 ? -2 : 2} -2" stroke="#FFD447" stroke-width="2.4" stroke-linecap="round"/>`).join('')}</g>`;
  const embauba = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-2 -30 2 -50 0 -70" stroke="#B9B2A6" stroke-width="4" fill="none"/><path d="M0 -20 h3 M0 -40 h3" stroke="#8A8478" stroke-width="1.4"/>${[-160,-120,-80,-40,-10,-100,-60].map(a => { const r = a * Math.PI / 180; return `<path d="M0 -70 L${(Math.cos(r)*22).toFixed(1)} ${(-70 + Math.sin(r)*16).toFixed(1)}" stroke="#7A8A7A" stroke-width="1.4"/><ellipse cx="${(Math.cos(r)*22).toFixed(1)}" cy="${(-70 + Math.sin(r)*16).toFixed(1)}" rx="7" ry="4.4" transform="rotate(${a + 90} ${(Math.cos(r)*22).toFixed(1)} ${(-70 + Math.sin(r)*16).toFixed(1)})" fill="#C9DCC8" stroke="#6E8A72" stroke-width="1.2"/>`; }).join('')}</g>`;
  const jussara = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="balanca" style="animation-delay:${d}s"><path d="M0 0 C-1 -30 1 -60 0 -84" stroke="#5E4A36" stroke-width="3.4" fill="none"/>${[-170,-140,-110,-70,-40,-10].map(a => { const r = a * Math.PI / 180, ex = Math.cos(r)*30, ey = -84 + Math.sin(r)*20 + 12; return `<path d="M0 -84 Q${(ex*.5).toFixed(1)} ${(-84 + Math.sin(r)*24).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#2E7A3A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 -84 Q${(ex*.5).toFixed(1)} ${(-84 + Math.sin(r)*24).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#5CC06A" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="2 3" opacity=".9"/>`; }).join('')}<path d="M-2 -60 h4" stroke="#7A3E5A" stroke-width="5" stroke-linecap="round"/></g></g>`;
  const BROM = [{ x:132, y:176 }, { x:214, y:146 }, { x:300, y:168 }];
  const NASC = { x:334, y:214 };
  const RIO = `M${NASC.x} ${NASC.y} C348 246 300 270 318 302 C336 332 392 344 432 360 C474 376 520 392 568 408 C612 422 650 436 700 448 C730 454 760 458 800 460`;
  const GAP = [{ x:368, y:300 }, { x:410, y:392 }, { x:522, y:356 }, { x:546, y:440 }, { x:650, y:404 }];
  const MICO0 = { x:258, y:258 }, FAMILIA = { x:742, y:376 };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Serra coberta pela Mata Atlântica, com neblina vinda do mar, bromélias, uma nascente, um rio até a praia e micos-leões-dourados">
    <defs>
      <linearGradient id="maCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC6F2"/><stop offset=".6" stop-color="#D6EEF7"/><stop offset="1" stop-color="#F6F1DC"/></linearGradient>
      <linearGradient id="maMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5CC4E8"/><stop offset="1" stop-color="#1F78B8"/></linearGradient>
      <linearGradient id="maLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC4A6"/><stop offset="1" stop-color="#6EA88A"/></linearGradient>
      <radialGradient id="maNevoa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="maVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#0A2A1A" stop-opacity="0"/><stop offset="1" stop-color="#0A2A1A" stop-opacity=".3"/></radialGradient>
      <radialGradient id="maV1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5FCB84"/><stop offset=".6" stop-color="#1E8A4E"/><stop offset="1" stop-color="#0E5A32"/></radialGradient><radialGradient id="maV2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#D2F07A"/><stop offset=".6" stop-color="#8CCB3E"/><stop offset="1" stop-color="#4E8A1E"/></radialGradient><radialGradient id="maV3" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C9CC6A"/><stop offset=".6" stop-color="#8A9E38"/><stop offset="1" stop-color="#55701E"/></radialGradient><radialGradient id="maV4" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7ED8BE"/><stop offset=".6" stop-color="#2EA08A"/><stop offset="1" stop-color="#14685A"/></radialGradient><radialGradient id="maV5" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8AE27A"/><stop offset=".6" stop-color="#3EAE4A"/><stop offset="1" stop-color="#1E7A30"/></radialGradient><radialGradient id="maV6" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4AA866"/><stop offset=".6" stop-color="#1E6A3A"/><stop offset="1" stop-color="#0A4426"/></radialGradient><radialGradient id="maV7" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#D8ECC4"/><stop offset=".6" stop-color="#9CC28C"/><stop offset="1" stop-color="#638E64"/></radialGradient><radialGradient id="maFRoxa" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#E2C2FF"/><stop offset=".6" stop-color="#A86AE8"/><stop offset="1" stop-color="#6E3EB0"/></radialGradient><radialGradient id="maFRosa" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFD6EA"/><stop offset=".6" stop-color="#F28DC0"/><stop offset="1" stop-color="#C2508A"/></radialGradient><radialGradient id="maFAmar" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF2A0"/><stop offset=".6" stop-color="#FFC83D"/><stop offset="1" stop-color="#D08A10"/></radialGradient><radialGradient id="maFBranca" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E6F0E6"/><stop offset="1" stop-color="#A8C8B0"/></radialGradient><linearGradient id="maFolha" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5CC46E"/><stop offset="1" stop-color="#1E7A42"/></linearGradient><linearGradient id="maPedra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9C6D4"/><stop offset=".55" stop-color="#A29EB0"/><stop offset="1" stop-color="#7A7690"/></linearGradient><linearGradient id="maLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8DCD2"/><stop offset="1" stop-color="#9CC8BA"/></linearGradient><linearGradient id="maSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7A42"/><stop offset="1" stop-color="#0E4A28"/></linearGradient><radialGradient id="maNeb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="maGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#maCeu)"/>
    <g id="ma-sol" class="toque"><circle cx="560" cy="70" r="46" fill="#FFE27A" opacity=".3"/><circle cx="560" cy="70" r="28" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M545 60 q8 -9 20 -9" stroke="#FFF1B8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="560" cy="70" r="46" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="380" y="30" width="110" height="52" style="color:#fff" opacity=".9"/></g>
    <path d="M240 260 C320 180 420 140 520 160 C600 130 700 140 800 170 V400 H240Z" fill="url(#maLonge2)" stroke="#8CB8AA" stroke-width="2"/>
    <ellipse cx="560" cy="200" rx="200" ry="16" fill="url(#maNeb)"/>
    <path d="M300 300 C380 200 460 180 540 204 C600 172 680 180 800 226 V400 H300Z" fill="url(#maLonge)" stroke="#5E9A7A" stroke-width="2"/>
    <g fill="#5E9A7A" opacity=".55">${Array.from({length:26}, () => { const x = R(330, 800), y = R(220, 300); return `<path d="${copa(x, y, R(8, 13), R(5, 8), 6)}"/>`; }).join('')}</g>
    <path d="M330 260 C400 240 470 236 560 248" stroke="#fff" stroke-width="14" opacity=".45" fill="none" stroke-linecap="round"/>
    <g id="ma-pedra" class="toque"><path d="M596 270 C600 212 630 176 664 174 C700 174 724 212 728 270Z" fill="url(#maPedra)" stroke="#5E5A6E" stroke-width="2.4"/><path d="M628 196 C622 224 624 250 628 268 M650 180 C646 214 646 244 650 268 M676 178 C680 210 682 240 680 268 M702 192 C708 220 710 248 708 268" stroke="#8A8698" stroke-width="1.8" fill="none" opacity=".8"/><path d="M612 222 C620 196 640 180 664 178" stroke="#F0EEF6" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/><path d="${copa(664, 176, 20, 7, 8)}" fill="#5E9A6A" stroke="#3E7A4A" stroke-width="1.4"/><path d="${copa(612, 250, 12, 7, 6)}" fill="#6EAA7A" stroke="#3E7A4A" stroke-width="1.2"/><path d="${copa(712, 238, 10, 6, 6)}" fill="#6EAA7A" stroke="#3E7A4A" stroke-width="1.2"/><rect x="596" y="170" width="132" height="100" fill="transparent"/></g>
    <ellipse cx="520" cy="262" rx="160" ry="14" fill="url(#maNeb)" class="deriva"/>
    <path d="${serra}" fill="url(#maSerra)" stroke="#0E4A28" stroke-width="2.5"/>
    <g>${floresta}</g>
    <g>${BROM.map((b, i) => `<g><path d="M${b.x} ${b.y + 26} C${b.x - 3} ${b.y + 10} ${b.x + 4} ${b.y} ${b.x} ${b.y - 30}" stroke="#3E2A18" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${b.x} ${b.y + 26} C${b.x - 3} ${b.y + 10} ${b.x + 4} ${b.y} ${b.x} ${b.y - 30}" stroke="#7A5A3E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${b.x} ${b.y - 20} C${b.x - 14} ${b.y - 34} ${b.x - 26} ${b.y - 38} ${b.x - 34} ${b.y - 50} M${b.x} ${b.y - 24} C${b.x + 12} ${b.y - 36} ${b.x + 24} ${b.y - 40} ${b.x + 32} ${b.y - 52}" stroke="#3E2A18" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${copa(b.x - 30, b.y - 58, 28, 17, 10)}" fill="url(#maV2)" stroke="#0F5530" stroke-width="1.8"/><path d="${copa(b.x + 30, b.y - 60, 28, 17, 10)}" fill="url(#maV1)" stroke="#0F5530" stroke-width="1.8"/><path d="${copa(b.x, b.y - 76, 32, 19, 11)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.8"/>${textura(b.x, b.y - 66, 44, 16, 10, '#0F5530', 1.3)}<path d="M${b.x - 22} ${b.y - 88} q12 -8 26 -5" stroke="#B8F0A8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${b.x + 22} ${b.y - 46} C${b.x + 26} ${b.y - 20} ${b.x + 20} ${b.y + 4} ${b.x + 24} ${b.y + 30}" stroke="#4E7A2A" stroke-width="2" fill="none"/><path d="M${b.x - 26} ${b.y - 44} C${b.x - 30} ${b.y - 24} ${b.x - 24} ${b.y - 4} ${b.x - 28} ${b.y + 16}" stroke="#4E7A2A" stroke-width="2" fill="none"/><path d="${copa(b.x - 12, b.y + 30, 20, 12, 8)}" fill="url(#maV2)" stroke="#0F5530" stroke-width="1.6"/><path d="${copa(b.x + 14, b.y + 32, 18, 11, 8)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.6"/></g>`).join('')}</g>
    <g>${embauba(70, 168, .9)}${embauba(380, 196, .8)}${embauba(500, 252, .7)}</g>
    <g>${jussara(170, 150, .7, 0)}${jussara(260, 130, .75, -1.3)}${jussara(460, 236, .62, -2.2)}${jussara(30, 214, .7, -.6)}</g>
    <g>${samamb(40, 330, .9)}${samamb(240, 420, 1)}${samamb(150, 470, 1.1)}</g>
    <path d="M610 500 C640 470 660 452 700 446 C740 440 770 438 800 436 V500Z" fill="#F2DDA0" stroke="#C9A860" stroke-width="2"/>
    <path id="ma-mar" class="toque" d="M650 500 C680 480 700 466 740 460 C770 456 790 456 800 456 V500Z" fill="url(#maMar)" stroke="#1B5E9A" stroke-width="2"/>
    <path class="ma-onda" d="M672 486 q10 -4 20 0 t20 0 M716 470 q10 -4 20 0 t20 0 t20 0" stroke="#E6F6FF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g id="ma-gaps"></g>
    <g id="ma-rio" style="opacity:0;transition:opacity .8s"><path d="${RIO}" stroke="#5E3A1C" stroke-width="15" fill="none" stroke-linecap="round" class="ma-rio-b"/><path id="ma-agua" d="${RIO}" stroke="#A8763E" stroke-width="10" fill="none" stroke-linecap="round"/><path id="ma-corre" d="${RIO}" stroke="#E6D2B0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="8 16"/></g>
    <g id="ma-nasc" class="toque"><circle cx="${NASC.x}" cy="${NASC.y}" r="13" fill="#7A5A3E" stroke="#3E2A18" stroke-width="2"/><circle id="ma-nasc-agua" cx="${NASC.x}" cy="${NASC.y}" r="8" fill="#7FCDEB" opacity=".25"/><circle cx="${NASC.x}" cy="${NASC.y}" r="26" fill="transparent"/></g>
    <g id="ma-peixes" style="opacity:0;transition:opacity 1s"></g>
    <g id="ma-arvores"></g>
    <g id="ma-broms">${BROM.map((b, i) => `<g class="toque ma-brom" data-fig="bromelia" data-b="${i}"><path d="M${b.x - 26} ${b.y + 8} C${b.x - 10} ${b.y + 2} ${b.x + 10} ${b.y + 2} ${b.x + 26} ${b.y + 8}" stroke="#3E2A18" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${b.x - 24} ${b.y + 6} C${b.x - 10} ${b.y + 1} ${b.x + 10} ${b.y + 1} ${b.x + 24} ${b.y + 6}" stroke="#8A6A4A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${b.x - 22} ${b.y + 9} q6 6 12 2 M${b.x + 8} ${b.y + 8} q6 5 12 1" stroke="#6CB858" stroke-width="3" fill="none" stroke-linecap="round"/><svg x="${b.x - 24}" y="${b.y - 38}" width="48" height="48" viewBox="0 0 100 100"><use href="#f-bromelia"/></svg><ellipse class="ma-seca" cx="${b.x}" cy="${(b.y - 8.3).toFixed(1)}" rx="6.2" ry="2.3" fill="#6E8A4A"/><g class="ma-pere" style="opacity:0;transition:opacity .5s, transform .5s;transform:translateY(6px)"><svg x="${b.x - 9}" y="${b.y - 22}" width="18" height="15" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg></g><rect x="${b.x - 30}" y="${b.y - 40}" width="60" height="54" fill="transparent"/></g>`).join('')}</g>
    <g class="toque" data-fig="tucano" id="ma-tucano"><g id="ma-tuc-in"><svg x="88" y="96" width="62" height="52" viewBox="0 0 120 100"><use href="#f-tucano"/></svg></g>${brilhoHotspot(140, 104)}</g>
    <g pointer-events="none">${heliconia(20, 505, .9)}${heliconia(92, 512, .7, -1)}${heliconia(300, 512, .62)}</g>
    <g id="ma-familia"><svg x="${FAMILIA.x - 34}" y="${FAMILIA.y - 30}" width="30" height="32" viewBox="0 0 120 130"><use href="#f-mico"/></svg><svg x="${FAMILIA.x - 6}" y="${FAMILIA.y - 22}" width="22" height="24" viewBox="0 0 120 130"><use href="#f-mico"/></svg><path d="M${FAMILIA.x - 8} ${FAMILIA.y + 22} C${FAMILIA.x - 10} ${FAMILIA.y + 40} ${FAMILIA.x - 4} ${FAMILIA.y + 54} ${FAMILIA.x - 8} ${FAMILIA.y + 70}" stroke="#3E2A18" stroke-width="8" fill="none"/><path d="${copa(FAMILIA.x - 8, FAMILIA.y + 14, 36, 15, 10)}" fill="url(#maV3)" stroke="#0F5530" stroke-width="1.8"/><path d="M${FAMILIA.x - 34} ${FAMILIA.y + 6} q12 -6 24 -4" stroke="#B8F0A8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
    <g id="ma-coracoes"></g>
    <g class="toque" data-fig="mico" id="ma-mico" transform="translate(${MICO0.x} ${MICO0.y})"><g id="ma-mico-in"><svg x="-18" y="-38" width="36" height="39" viewBox="0 0 120 130"><use href="#f-mico"/></svg></g></g>
    <g id="ma-alvo" style="display:none"><circle r="20" fill="#FFE27A" opacity=".35"/><circle r="20" fill="none" stroke="#fff" stroke-width="3" class="pino-pulso"/><circle r="30" fill="transparent" class="toque"/></g>
    <g id="ma-nevoa" class="toque" style="cursor:grab"><ellipse cx="0" cy="0" rx="98" ry="40" fill="url(#maNevoa)"/><ellipse cx="-40" cy="-10" rx="50" ry="26" fill="url(#maNevoa)"/><ellipse cx="38" cy="-14" rx="56" ry="28" fill="url(#maNevoa)"/><g fill="#5A6787" opacity=".75"><circle cx="-14" cy="0" r="3.2"/><circle cx="14" cy="0" r="3.2"/><path d="M-6 9 q6 5 12 0" stroke="#5A6787" stroke-width="2.2" fill="none" stroke-linecap="round"/></g><rect x="-100" y="-44" width="200" height="88" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#maVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#maGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const nev = el(s, '#ma-nevoa'), agua = el(s, '#ma-agua'), corre = el(s, '#ma-corre');
  const posN = () => nev.setAttribute('transform', `translate(${nevX.toFixed(1)} ${nevY.toFixed(1)})`); posN();
  corre.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-48 }], { duration:900, iterations:Infinity });
  s.querySelectorAll('.ma-onda').forEach(o => o.animate([{ transform:'translateX(0)' }, { transform:'translateX(-12px)' }], { duration:2200, iterations:Infinity, direction:'alternate', easing:'ease-in-out' }));
  /* 1. neblina: a mata "pega" a água das nuvens */
  const cheio = BROM.map(() => 0);
  nev.addEventListener('pointerdown', e => { if (fase !== 'neblina') return; const p = c.ponto(e); arrN = { dx: nevX - p.x, dy: nevY - p.y }; s.setPointerCapture(e.pointerId); nev.style.cursor = 'grabbing'; e.stopPropagation(); });
  s.addEventListener('pointermove', e => { if (!arrN) return; const p = c.ponto(e); nevX = Math.max(80, Math.min(740, p.x + arrN.dx)); nevY = Math.max(70, Math.min(260, p.y + arrN.dy)); posN(); });
  s.addEventListener('pointerup', () => { arrN = null; nev.style.cursor = 'grab'; });
  let ultT = performance.now(), dirN = -1;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    if (fase === 'neblina') {
      if (!arrN) { nevX += dirN * .35; if (nevX < 120 || nevX > 700) dirN *= -1; nevY += (150 - nevY) * .01; posN(); }
      if (Math.random() < .5) c.add({ tipo:'chuva', x:nevX + sorte(-70, 70), y:nevY + 20, vx:0, vy:sorte(2.5, 4), chao:Math.min(480, crista(nevX) + 40), cor:'#BFE6FF' });
      BROM.forEach((b, i) => {
        if (cheio[i] >= 1) return;
        if (Math.abs(nevX - b.x) < 90 && nevY < b.y && b.y - nevY < 150) {
          cheio[i] = Math.min(1, cheio[i] + dt / 2600);
          const g = s.querySelectorAll('.ma-brom')[i]; g.querySelector('.ma-seca').style.opacity = 1 - cheio[i];
          if (Math.random() < .08) c.add({ tipo:'brilho', x:b.x + sorte(-8, 8), y:b.y - 10, t:0, cor:'#BFE6FF' });
          if (cheio[i] >= 1) bromCheia(i, g);
        }
      });
    }
    requestAnimationFrame(vida);
  })(ultT);
  function bromCheia(i, g){
    nBrom++; toca('glub'); c.brilhos(BROM[i].x, BROM[i].y - 10, 8, '#BFE6FF');
    const p = g.querySelector('.ma-pere'); p.style.opacity = 1; p.style.transform = 'translateY(0)';
    api.hud(`<span class="chip">Bromélias com água: ${nBrom}/3</span>`);
    if (nBrom === 1) api.diz('A bromélia guardou água no copinho das folhas! Olha quem apareceu: uma perereca que vive ali dentro.');
    if (nBrom === 2) api.diz('Mais uma! As folhas da mata seguram a água da neblina, gotinha por gotinha.');
    if (nBrom === 3) { fase = 'nascente'; nev.style.transition = 'opacity 1s'; nev.style.opacity = 0; nev.style.pointerEvents = 'none'; depois(900, abreNascente); }
  }
  function abreNascente(){
    toca('splash'); el(s, '#ma-nasc-agua').setAttribute('opacity', 1); el(s, '#ma-rio').style.opacity = 1;
    const L = agua.getTotalLength(); s.querySelectorAll('#ma-rio path').forEach(p => { if (p.id === 'ma-corre') return; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = 'stroke-dashoffset 2.4s ease-out'; requestAnimationFrame(() => requestAnimationFrame(() => p.style.strokeDashoffset = 0)); });
    for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:NASC.x + sorte(-6, 6), y:NASC.y, t:i });
    depois(2600, () => {
      fase = 'ciliar';
      el(s, '#ma-gaps').innerHTML = GAP.map((g, i) => `<g class="toque ma-gap" data-g="${i}"><path d="${copa(g.x, g.y, 30, 15, 9, .18)}" fill="#B5723A" stroke="#6E3E1A" stroke-width="2"/><path d="M${g.x - 14} ${g.y - 4} l6 4 l-3 5 M${g.x + 8} ${g.y - 6} l5 5 M${g.x - 2} ${g.y + 4} l3 5" stroke="#6E3E1A" stroke-width="1.6" fill="none"/><ellipse cx="${g.x + 12}" cy="${g.y + 2}" rx="5" ry="2.6" fill="#8A5A30"/><g style="animation:flutua .9s ease-in-out ${-i * .2}s infinite alternate"><ellipse cx="${g.x}" cy="${g.y - 16}" rx="5.4" ry="7" fill="#8A5A30" stroke="#4E321C" stroke-width="1.4"/><path d="M${g.x} ${g.y - 22} c4 -6 10 -6 12 -4 c-4 0 -8 2 -12 4" fill="#7EC850" stroke="#3E6A22" stroke-width="1.2"/></g>${brilhoHotspot(g.x + 14, g.y - 22)}<rect x="${g.x - 34}" y="${g.y - 34}" width="68" height="52" fill="transparent"/></g>`).join('');
      api.hud('<span class="chip">Mata na beira do rio: 0/5</span>');
      api.diz('A água nasceu, mas está barrenta! Sem árvores na beira, a terra escorrega para dentro do rio. Toque nos pedaços pelados para plantar a mata ciliar.');
    });
  }
  /* 2. mata ciliar: plantar deixa o rio limpo */
  const mistura = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - k) + parseInt(b.substr(i + 1, 2), 16) * k).toString(16).padStart(2, '0')).join('');
  el(s, '#ma-gaps').addEventListener('click', e => {
    const g = e.target.closest('.ma-gap'); if (!g || fase !== 'ciliar') return; e.stopPropagation();
    const p = GAP[+g.dataset.g]; g.remove(); nPlant++; toca('planta');
    el(s, '#ma-arvores').insertAdjacentHTML('beforeend', `<g class="cresce"><path d="M${p.x} ${p.y + 6} C${p.x - 2} ${p.y - 6} ${p.x + 3} ${p.y - 14} ${p.x} ${p.y - 22}" stroke="#5E4428" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${copa(p.x - 10, p.y - 30, 20, 14, 9)}" fill="url(#maV2)" stroke="#145A30" stroke-width="1.8"/><path d="${copa(p.x + 12, p.y - 26, 18, 12, 8)}" fill="url(#maV4)" stroke="#145A30" stroke-width="1.8"/><path d="${copa(p.x, p.y - 42, 18, 12, 8)}" fill="url(#maV3)" stroke="#145A30" stroke-width="1.8"/><path d="M${p.x - 18} ${p.y - 46} q8 -5 16 -3" stroke="#B8F0A8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`);
    c.brilhos(p.x, p.y - 30, 10, '#D6F0A8');
    const k = nPlant / 5; agua.setAttribute('stroke', mistura('#A8763E', '#3D9BFF', k)); corre.setAttribute('stroke', mistura('#E6D2B0', '#E6F6FF', k));
    api.hud(`<span class="chip">Mata na beira do rio: ${nPlant}/5</span>`);
    if (nPlant === 2) api.diz('Viu? O rio já está ficando mais limpo. As raízes seguram a terra no lugar.');
    if (nPlant === 5) { toca('vitoria'); el(s, '#ma-peixes').style.opacity = 1; depois(1600, comecaCorredor); }
  });
  el(s, '#ma-peixes').innerHTML = [[470, 372], [600, 420], [400, 352]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g style="animation:flutua ${1 + i * .2}s ease-in-out infinite alternate"><path d="M-8 0 C-4 -5 4 -5 8 0 C4 5 -4 5 -8 0Z M-7 0 L-12 -4 L-12 4Z" fill="#FFB347" stroke="#8A4A10" stroke-width="1"/><circle cx="4" cy="-1" r="1" fill="#12235A"/></g></g>`).join('');
  /* 3. corredor: o mico atravessa pelas copas novas até a família */
  const mico = el(s, '#ma-mico'), alvo = el(s, '#ma-alvo');
  let micoX = MICO0.x, micoY = MICO0.y;
  const ROTA = [...GAP.map(g => ({ x:g.x, y:g.y - 50 })), { x:FAMILIA.x - 34, y:FAMILIA.y }];
  function mostraAlvo(){ const r = ROTA[nPulos]; alvo.style.display = ''; alvo.setAttribute('transform', `translate(${r.x} ${r.y - 14})`); }
  function comecaCorredor(){
    fase = 'corredor'; api.hud('<span class="chip">Pulos do mico: 0/6</span>');
    api.diz('A mata ciliar virou um caminho de árvores! Agora o mico-leão-dourado pode visitar a família. Toque no círculo brilhante para ele pular.');
    mostraAlvo();
  }
  alvo.addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'corredor' || pulando) return; pulando = true; alvo.style.display = 'none';
    const r = ROTA[nPulos], x0 = micoX, y0 = micoY, t0 = performance.now(), dur = 700; toca('pop');
    el(s, '#ma-mico-in').setAttribute('transform', r.x < x0 ? 'scale(-1 1)' : '');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / dur), e = k*k*(3-2*k); micoX = x0 + (r.x - x0) * e; micoY = y0 + (r.y - y0) * e - Math.sin(k * Math.PI) * 46; mico.setAttribute('transform', `translate(${micoX.toFixed(1)} ${micoY.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else pousou(); })(t0);
  });
  function pousou(){
    pulando = false; nPulos++; c.brilhos(micoX, micoY - 10, 5, '#FFE27A');
    api.hud(`<span class="chip">Pulos do mico: ${nPulos}/6</span>`);
    if (nPulos === 3) api.diz('Isso! Sem árvores, o mico teria que descer no chão, onde é perigoso.');
    if (nPulos < 6) { mostraAlvo(); return; }
    fase = 'fim'; toca('vitoria');
    el(s, '#ma-coracoes').innerHTML = [0, 1, 2].map(i => `<path d="M${FAMILIA.x - 20 + i * 14} ${FAMILIA.y - 40} c-4 -6 -12 -2 -8 4 l8 8 l8 -8 c4 -6 -4 -10 -8 -4Z" fill="#FF6B8A" stroke="#9E2E4A" stroke-width="1.2" style="animation:flutua .8s ease-in-out ${-i * .25}s infinite alternate"/>`).join('');
    api.diz('A família está junta de novo! A Mata Atlântica protege as nascentes que levam água para a maioria das cidades do Brasil. Mata em pé, água limpa na torneira!');
    depois(5200, api.fim);
  }
  /* toques extras */
  el(s, '#ma-tucano').addEventListener('click', () => { el(s, '#ma-tuc-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:500 }); toca('pop'); });
  el(s, '#ma-pedra').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Na Serra do Mar tem morros de pedra bem lisinha. A água da chuva escorre por eles e desce para os rios.'); });
  el(s, '#ma-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(560, 70, 8, '#FFE27A'); api.diz('O sol aquece o mar, o vapor sobe e vira neblina. O vento leva essa neblina para a serra.'); });
  el(s, '#ma-mar').addEventListener('click', e => { e.stopPropagation(); toca('splash'); const p = c.ponto(e); for (let i = 0; i < 6; i++) c.add({ tipo:'respingo', x:p.x + sorte(-8, 8), y:p.y, t:i }); api.diz('O mar fica pertinho da Mata Atlântica. Daqui sai a umidade que vira neblina e chuva na serra.'); });
  el(s, '#ma-nasc').addEventListener('click', e => { e.stopPropagation(); if (fase === 'neblina') { api.diz('Aqui é uma nascente, mas está quase seca. Leve a neblina até as bromélias e as árvores!'); toca('clique'); } else { toca('glub'); for (let i = 0; i < 4; i++) c.add({ tipo:'bolha', x:NASC.x + sorte(-5, 5), y:NASC.y, t:i }); } });
  api.hud('<span class="chip">Bromélias com água: 0/3</span>');
  api.diz('Oi, eu sou a Mica, uma mico-leão-dourado da Mata Atlântica! A neblina chegou do mar. Arraste a neblina até as bromélias para elas guardarem água.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 7: Pampa, a água escondida ================= */
function jogoPampa(palco, api){
  semente = 91;
  let vivo = true, fase = 'vento', vel = 0, ang = 0, bomba = 0, etapa = 0, voando = false, chuvas = 0, chovendo = false, aquif = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const SUP = 372, CX = 650, CY = 214, META = 100;
  const LAMA = { x:292, y:364 }, POSTE = { x:420, y:316 }, POUSO = { x:360, y:312 };
  const tufo = (x, y, h, cor) => `<path d="M${x} ${y} q-3 -${(h*.5).toFixed(0)} -7 -${h.toFixed(0)} M${x} ${y} q0 -${(h*.6).toFixed(0)} 1 -${(h*1.15).toFixed(0)} M${x} ${y} q3 -${(h*.5).toFixed(0)} 8 -${(h*.95).toFixed(0)}" stroke="${cor}"/>`;
  const capim = (n, x0, x1, y0, y1, h0, h1, cor) => Array.from({length:n}, () => tufo(R(x0, x1).toFixed(0), R(y0, y1).toFixed(0), R(h0, h1), cor)).join('');
  const flores = Array.from({length:40}, () => { const x = R(330, 790), y = R(340, 370), cor = ['#FFD447', '#FFFFFF', '#B57BFF', '#FF8AB8'][Math.floor(R(0, 4))]; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.2" fill="${cor}" stroke="#5E6A3A" stroke-width=".6"/>`; }).join('');
  const ave = `<g class="pa-ave"><path d="M-6 6 C-14 10 -20 14 -22 20 C-14 18 -8 14 -2 10Z" fill="#8A5428" stroke="#4E2E14" stroke-width="1.2"/><ellipse cx="2" cy="4" rx="12" ry="9" fill="#B97A44" stroke="#4E2E14" stroke-width="1.5"/><path d="M4 -1 C10 3 12 9 8 12 C4 10 2 5 4 -1Z" fill="#F2DCC0" stroke="#4E2E14" stroke-width="1"/><circle cx="9" cy="-7" r="7.2" fill="#B97A44" stroke="#4E2E14" stroke-width="1.5"/><circle cx="11.2" cy="-8.2" r="2" fill="#12121A"/><circle cx="11.7" cy="-8.8" r=".7" fill="#fff"/><path d="M6 -10 C8 -12 12 -12 14 -10" stroke="#F2DCC0" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M15 -8 L23 -6 L15 -4Z" fill="#5E4A36" stroke="#2E1E10" stroke-width="1" stroke-linejoin="round"/><circle class="pa-bola" cx="24" cy="-5" r="3.6" fill="#8A5A30" stroke="#4E321C" stroke-width="1" style="opacity:0"/><g class="pa-asa" style="display:none"><g class="asa"><path d="M-6 0 C-2 -14 10 -18 14 -14 C8 -10 4 -4 2 0Z" fill="#9A5E2E" stroke="#4E2E14" stroke-width="1.2" stroke-linejoin="round"/></g></g><path class="pa-pes" d="M0 13 l-1 6 M6 13 l1 6" stroke="#6E5A4A" stroke-width="1.8" stroke-linecap="round"/></g>`;
  const ninho = `<defs><clipPath id="paNinhoClip"><rect id="pa-ninho-clip" x="${POSTE.x - 40}" y="${POSTE.y + 4}" width="80" height="0"/></clipPath></defs><g clip-path="url(#paNinhoClip)"><path d="M${POSTE.x - 30} ${POSTE.y + 2} C${POSTE.x - 32} ${POSTE.y - 26} ${POSTE.x - 14} ${POSTE.y - 42} ${POSTE.x + 2} ${POSTE.y - 42} C${POSTE.x + 20} ${POSTE.y - 42} ${POSTE.x + 34} ${POSTE.y - 26} ${POSTE.x + 32} ${POSTE.y + 2}Z" fill="#C88450" stroke="#5E2E14" stroke-width="2" stroke-linejoin="round"/>${textura(POSTE.x, POSTE.y - 18, 24, 14, 12, '#A8622E', 1.2)}<path d="M${POSTE.x - 20} ${POSTE.y - 20} C${POSTE.x - 16} ${POSTE.y - 32} ${POSTE.x - 6} ${POSTE.y - 38} ${POSTE.x + 4} ${POSTE.y - 38}" stroke="#F0B886" stroke-width="2.4" fill="none" stroke-linecap="round"/><path id="pa-porta" d="M${POSTE.x + 6} ${POSTE.y + 2} C${POSTE.x + 4} ${POSTE.y - 10} ${POSTE.x + 8} ${POSTE.y - 18} ${POSTE.x + 14} ${POSTE.y - 18} C${POSTE.x + 20} ${POSTE.y - 18} ${POSTE.x + 22} ${POSTE.y - 10} ${POSTE.x + 22} ${POSTE.y + 2}Z" fill="#3E1E0C" stroke="#5E2E14" stroke-width="1.4" style="opacity:0;transition:opacity .6s"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Pampa com coxilhas, banhado, corticeira, joão-de-barro, cata-vento, bebedouro e o Aquífero Guarani debaixo da terra">
    <defs>
      <linearGradient id="paCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CBDF2"/><stop offset=".7" stop-color="#D2EEFA"/><stop offset="1" stop-color="#FFF2D2"/></linearGradient>
      <linearGradient id="paCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9DA6E"/><stop offset="1" stop-color="#76B848"/></linearGradient>
      <linearGradient id="paSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4A2A"/><stop offset="1" stop-color="#5E3A1E"/></linearGradient>
      <linearGradient id="paAq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD0FF"/><stop offset="1" stop-color="#2E6FD6"/></linearGradient>
      <pattern id="paGraos" width="20" height="14" patternUnits="userSpaceOnUse"><circle cx="5" cy="4" r="3.6" fill="#E9B98A" stroke="#A8744E" stroke-width=".9"/><circle cx="15" cy="5" r="3" fill="#DDA878" stroke="#A8744E" stroke-width=".9"/><circle cx="10" cy="11" r="3.3" fill="#F0C496" stroke="#A8744E" stroke-width=".9"/><circle cx="4" cy="3" r="1" fill="#FFF0D8"/></pattern>
      <clipPath id="paAqClip"><rect x="0" y="442" width="800" height="58"/></clipPath>
      <radialGradient id="paVinheta" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#1A2A0A" stop-opacity="0"/><stop offset="1" stop-color="#1A2A0A" stop-opacity=".28"/></radialGradient>
      <linearGradient id="paC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6EEC0"/><stop offset="1" stop-color="#BEE0A0"/></linearGradient>
      <linearGradient id="paC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2E49A"/><stop offset="1" stop-color="#A2D27A"/></linearGradient>
      <linearGradient id="paC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ADDA80"/><stop offset="1" stop-color="#88C25E"/></linearGradient>
      <linearGradient id="paRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E7A86"/><stop offset="1" stop-color="#5A5662"/></linearGradient>
      <linearGradient id="paBan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD8F2"/><stop offset="1" stop-color="#3E9AD0"/></linearGradient>
      <linearGradient id="paNuvChuva" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D0E0"/><stop offset="1" stop-color="#7A84A2"/></linearGradient>
      <filter id="paGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#paCeu)"/>
    <g id="pa-sol" class="toque"><circle cx="120" cy="74" r="46" fill="#FFE27A" opacity=".3"/><circle cx="120" cy="74" r="28" fill="#FFC83D" stroke="#F0A81E" stroke-width="3"/><path d="M104 64 q8 -9 20 -9" stroke="#FFF1B8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="120" cy="74" r="46" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="440" y="40" width="100" height="48" style="color:#fff" opacity=".9"/><use href="#nuvem" x="230" y="20" width="70" height="34" style="color:#fff" opacity=".7"/></g>
    <g id="pa-chuva" class="toque" style="opacity:0;transition:opacity .8s;pointer-events:none">${[[150, 40], [320, 30], [500, 44]].map(([x, y]) => `<g class="pa-nuv" data-x="${x}"><use href="#nuvem" x="${x - 66}" y="${y}" width="132" height="66" style="color:#5A6787"/><use href="#nuvem" x="${x - 62}" y="${y + 3}" width="124" height="60" style="color:#AEB7CC"/><use href="#nuvem" x="${x - 44}" y="${y + 26}" width="88" height="40" style="color:#8A94AE"/><path d="M${x - 30} ${y + 24} q10 -7 22 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="${x - 70}" y="${y}" width="140" height="70" fill="transparent"/></g>`).join('')}</g>
    <path d="M0 214 C100 200 200 196 300 206 C400 194 520 192 620 204 C700 196 760 198 800 202 V320 H0Z" fill="url(#paC1)" stroke="#B4D49A" stroke-width="1.6"/>
    <path d="M0 236 C80 218 160 214 240 226 C340 208 440 210 520 224 C620 206 720 210 800 222 V320 H0Z" fill="url(#paC2)" stroke="#94C070" stroke-width="2"/>
    <path d="M40 228 C100 218 160 216 220 226 M360 214 C420 208 470 210 510 220 M620 210 C680 206 730 208 780 216" stroke="#E6F6C8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M0 268 C100 246 200 246 300 262 C400 244 520 246 620 260 C700 248 760 250 800 256 V340 H0Z" fill="url(#paC3)" stroke="#76B04E" stroke-width="2"/><path d="M60 258 C120 248 180 248 240 256 M420 250 C480 244 540 246 600 254" stroke="#D6F0B0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <g fill="#5E9A3E">${[60, 90, 470, 500, 760].map((x, i) => `<path d="${copa(x, 254 - (i % 2) * 4, 12, 8, 7)}" stroke="#3E7A22" stroke-width="1.2"/><path d="M${x} 260 v10" stroke="#5E4428" stroke-width="2.4"/>`).join('')}</g>
    <g stroke="#B9E08E" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8">${Array.from({length:30}, () => { const x = R(0, 800), y = R(230, 300); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q2 -4 3 -7 M${(x + 4).toFixed(0)} ${y.toFixed(0)} q1 -3 1 -6"/>`; }).join('')}</g>
    <g id="pa-umbu" class="toque"><path d="M520 300 C516 284 508 276 500 268 M520 300 C524 284 534 274 546 268 M520 300 C520 286 522 276 520 262" stroke="#4E321C" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M506 302 C512 290 528 290 534 302Z" fill="#6E4A2A" stroke="#4E321C" stroke-width="2"/><path d="${copa(490, 258, 30, 16, 10)}" fill="#3E8A3A" stroke="#245A22" stroke-width="2"/><path d="${copa(552, 256, 30, 16, 10)}" fill="#3E8A3A" stroke="#245A22" stroke-width="2"/><path d="${copa(520, 244, 40, 20, 12)}" fill="#4E9E44" stroke="#245A22" stroke-width="2"/>${textura(520, 252, 52, 16, 12, '#2E6A2A', 1.4)}<path d="M492 236 q12 -8 26 -5" stroke="#B8E89A" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="470" y="222" width="104" height="80" fill="transparent"/></g>
    <path d="M0 316 C120 300 260 302 400 312 C540 300 680 300 800 308 V${SUP + 8} H0Z" fill="url(#paCampo)" stroke="#5E9A3E" stroke-width="2"/>
    <g stroke-width="2" fill="none" stroke-linecap="round">${capim(70, 0, 800, 318, 370, 8, 14, '#4E8A2E')}</g>
    <g>${Array.from({length:22}, () => { const x = R(330, 790), y = R(330, 368), h = R(16, 24); return `<g class="balanca" style="animation-delay:${R(-3, 0).toFixed(1)}s"><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-2 -${(h / 2).toFixed(0)} 2 -${h.toFixed(0)}" stroke="#7A9A3E" stroke-width="1.4" fill="none"/><path d="M${(x + 2).toFixed(0)} ${(y - h).toFixed(0)} q6 4 4 12 M${(x + 2).toFixed(0)} ${(y - h).toFixed(0)} q-6 4 -4 12" stroke="#E8E0B8" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`; }).join('')}</g>
    <g>${Array.from({length:10}, () => { const x = R(340, 780), y = R(336, 366); return `<g><path d="M${x.toFixed(0)} ${y.toFixed(0)} q-4 -8 -8 -10 M${x.toFixed(0)} ${y.toFixed(0)} q0 -9 2 -12 M${x.toFixed(0)} ${y.toFixed(0)} q4 -8 8 -9" stroke="#6E8A4A" stroke-width="1.4" fill="none"/>${[[-8, -11], [2, -13], [8, -10], [-3, -9]].map(([dx, dy]) => `<circle cx="${(x + dx).toFixed(0)}" cy="${(y + dy).toFixed(0)}" r="2.6" fill="#FFD447" stroke="#B07A08" stroke-width=".8"/>`).join('')}</g>`; }).join('')}</g>
    <g>${flores}</g>
    <rect x="0" y="${SUP}" width="800" height="${500 - SUP}" fill="url(#paSolo)"/>
    <path d="M0 ${SUP} H800" stroke="#3E7A22" stroke-width="5"/>
    <g stroke="#C9A07A" stroke-width="1.2" fill="none" opacity=".7">${Array.from({length:40}, () => { const x = R(0, 800); return `<path d="M${x.toFixed(0)} ${SUP + 2} q${R(-4, 4).toFixed(0)} 8 ${R(-3, 3).toFixed(0)} ${R(12, 22).toFixed(0)}"/>`; }).join('')}</g>
    <path d="M0 404 Q200 396 400 406 T800 402 V442 H0Z" fill="url(#paRocha)" stroke="#4E4A52" stroke-width="2"/><g fill="#8A8692" opacity=".55">${Array.from({length:16}, (_, i) => `<path d="M${i * 52 + 6} 410 h30 l4 6 h-30Z"/>`).join('')}</g>
    <g>${Array.from({length:26}, () => { const x = R(10, 790), y = R(382, 400), r = R(2.5, 6); return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(1)}" ry="${(r * .6).toFixed(1)}" fill="#8E5A34" stroke="#4E2E14" stroke-width="1"/>`; }).join('')}</g>
    <g stroke="#55515A" stroke-width="1.6" fill="none">${Array.from({length:12}, (_, i) => `<path d="M${i * 70 + R(0, 20)} 406 l${R(-8, 8).toFixed(0)} 36"/>`).join('')}</g>
    <text x="784" y="432" text-anchor="end" font-family="Baloo 2, sans-serif" font-weight="700" font-size="12" fill="#E8E4EE" opacity=".9">rocha</text>
    <path d="M40 412 l10 14 M120 418 l-8 12 M260 410 l12 16 M420 416 l-6 14 M560 410 l10 14 M720 414 l-8 14" stroke="#4E4A52" stroke-width="1.6"/>
    <g clip-path="url(#paAqClip)"><rect x="0" y="442" width="800" height="58" fill="#8A5A3A"/><rect id="pa-aq" x="0" y="470" width="800" height="60" fill="url(#paAq)"/><rect x="0" y="442" width="800" height="58" fill="url(#paGraos)" opacity=".85"/></g>
    <path d="M0 442 H800" stroke="#4E4A52" stroke-width="2.4"/>
    <rect id="pa-aq-toque" class="toque" x="0" y="442" width="800" height="58" fill="transparent"/>
    <text x="16" y="490" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#fff" stroke="#12235A" stroke-opacity=".55" stroke-width="3.4" paint-order="stroke">Aquífero Guarani: água escondida debaixo da terra</text>
    <path d="M${CX} ${SUP} V468" stroke="#3E3A42" stroke-width="7"/><path d="M${CX} ${SUP} V468" stroke="#9A96A2" stroke-width="3"/>
    <g id="pa-gotas"></g>
    <g id="pa-banhado" class="toque"><ellipse cx="150" cy="${SUP - 8}" rx="116" ry="17" fill="#5E8A3E" opacity=".55"/><ellipse id="pa-ban" cx="150" cy="${SUP - 10}" rx="104" ry="13" fill="url(#paBan)" stroke="#2E7FB0" stroke-width="2"/><path d="M80 ${SUP - 6} h40 M150 ${SUP - 4} h30" stroke="#2E7FB0" stroke-width="1.2" opacity=".6"/><path id="pa-ban-brilho" d="M90 ${SUP - 13} q10 -3 20 0 M170 ${SUP - 8} q8 -3 16 0" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g stroke-width="2.4" fill="none" stroke-linecap="round">${[34, 46, 56, 70, 82, 226, 238, 250, 262, 272].map(x => tufo(x, SUP - 6, R(18, 30), '#3E7A2A')).join('')}</g>
      <g fill="#7A4A2A">${[44, 58, 72, 236, 248, 266].map(x => `<ellipse cx="${x + 2}" cy="${(SUP - 26 - R(0, 6)).toFixed(0)}" rx="2.6" ry="6"/>`).join('')}</g>
      ${[[118, SUP - 12], [178, SUP - 9]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="-6" cy="1" rx="7" ry="3" fill="#3FA864" stroke="#1E6B3A" stroke-width="1.2"/><ellipse cx="5" cy="2" rx="7" ry="3" fill="#4FBF6A" stroke="#1E6B3A" stroke-width="1.2"/><circle cx="0" cy="-5" r="3" fill="#B57BFF" stroke="#6A3EAE" stroke-width="1"/></g>`).join('')}
      <g id="pa-garca" transform="translate(140 ${SUP - 14})"><path d="M-2 0 V-16 M3 0 V-16" stroke="#3E3A2A" stroke-width="1.6"/><path d="M-10 -24 C-10 -32 4 -34 10 -28 C14 -22 8 -16 -2 -16 C-8 -16 -12 -20 -10 -24Z" fill="#fff" stroke="#5A6787" stroke-width="1.4"/><path d="M8 -28 C10 -36 6 -42 10 -48" stroke="#5A6787" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 -28 C10 -36 6 -42 10 -48" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="11" cy="-49" r="3.6" fill="#fff" stroke="#5A6787" stroke-width="1.2"/><path d="M14 -50 L24 -48 L14 -47Z" fill="#FFC83D" stroke="#8A6A08" stroke-width=".8"/><circle cx="12" cy="-50" r=".9" fill="#12235A"/><ellipse cx="0" cy="2" rx="10" ry="2" fill="#E6F6FF" opacity=".6"/></g>
      <g id="pa-sapos" style="opacity:0;transition:opacity .8s">${[[92, SUP - 14], [206, SUP - 12]].map(([x, y]) => `<svg x="${x - 9}" y="${y - 12}" width="18" height="15" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg>`).join('')}</g>
      <rect x="40" y="${SUP - 40}" width="220" height="44" fill="transparent"/></g>
    <g id="pa-lama" class="toque"><ellipse cx="${LAMA.x}" cy="${LAMA.y}" rx="26" ry="8" fill="#7A4A2A" stroke="#4E2E14" stroke-width="2"/><ellipse cx="${LAMA.x - 6}" cy="${LAMA.y - 2}" rx="8" ry="2.6" fill="#9A6A3E"/><circle cx="${LAMA.x + 10}" cy="${LAMA.y - 1}" r="2" fill="#5E3A1E"/><g id="pa-lama-hint" style="display:none">${brilhoHotspot(LAMA.x + 14, LAMA.y - 14)}</g><rect x="${LAMA.x - 32}" y="${LAMA.y - 22}" width="64" height="34" fill="transparent"/></g>
    <g class="toque" data-fig="corticeira" id="pa-cort"><svg x="250" y="236" width="104" height="104" viewBox="0 0 120 120"><use href="#f-corticeira"/></svg>${brilhoHotspot(334, 252)}</g>
    <path d="M354 334 H560 M354 348 H560" stroke="#8A8478" stroke-width="1.4"/>
    <g>${[360, 420, 480, 540].map(x => `<rect x="${x - 5}" y="${x === POSTE.x ? POSTE.y : 322}" width="10" height="${SUP - (x === POSTE.x ? POSTE.y : 322)}" rx="2" fill="#8A6A4A" stroke="#4E3A28" stroke-width="1.6"/><path d="M${x - 2} ${(x === POSTE.x ? POSTE.y : 322) + 8} v20 M${x + 2} ${(x === POSTE.x ? POSTE.y : 322) + 20} v16" stroke="#B89878" stroke-width="1.4"/><ellipse cx="${x}" cy="${SUP}" rx="9" ry="2.6" fill="#3E2A18" opacity=".35"/>`).join('')}</g>
    <g id="pa-ninho">${ninho}</g>
    <g id="pa-joao" class="toque" data-fig="joao" transform="translate(${POUSO.x} ${POUSO.y - 10})"><g id="pa-joao-in">${ave}</g><rect x="-24" y="-18" width="50" height="40" fill="transparent"/></g>
    <g id="pa-quero" class="toque" data-fig="queroquero"><g id="pa-quero-in"><svg x="500" y="${SUP - 46}" width="46" height="46" viewBox="0 0 100 100"><use href="#f-queroquero"/></svg></g>${brilhoHotspot(536, SUP - 42)}</g>
    <g id="pa-ema" class="toque" data-fig="ema" transform="translate(600 314) scale(.75)"><g id="pa-ema-in"><svg x="-22" y="-58" width="44" height="58" viewBox="0 0 100 130"><use href="#f-ema"/></svg></g></g>
    <g id="pa-bebe"><path d="M${CX + 6} 344 H${CX + 44} V350" stroke="#3E3A42" stroke-width="5" fill="none"/><path d="M${CX + 6} 344 H${CX + 44} V350" stroke="#9A96A2" stroke-width="2" fill="none"/><path d="M${CX + 36} ${SUP - 22} H${CX + 112} L${CX + 106} ${SUP} H${CX + 42}Z" fill="#9AA0AE" stroke="#4E4E5A" stroke-width="2"/><clipPath id="paBebeClip"><path d="M${CX + 39} ${SUP - 19} H${CX + 109} L${CX + 104} ${SUP - 2} H${CX + 44}Z"/></clipPath><g clip-path="url(#paBebeClip)"><rect id="pa-bebe-agua" x="${CX + 36}" y="${SUP}" width="80" height="22" fill="#5AAEFF"/></g><path d="M${CX + 40} ${SUP - 22} H${CX + 108}" stroke="#C9CED8" stroke-width="2"/></g>
    <g id="pa-cata" class="toque" style="cursor:grab">
      <path d="M${CX - 24} ${SUP} L${CX - 4} ${CY + 10} M${CX + 24} ${SUP} L${CX + 4} ${CY + 10} M${CX - 20} 330 H${CX + 20} M${CX - 15} 290 H${CX + 15} M${CX - 11} 252 H${CX + 11} M${CX - 20} 330 L${CX + 15} 290 M${CX + 20} 330 L${CX - 15} 290 M${CX - 15} 290 L${CX + 11} 252 M${CX + 15} 290 L${CX - 11} 252" stroke="#4E4E5A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M${CX - 24} ${SUP} L${CX - 4} ${CY + 10} M${CX + 24} ${SUP} L${CX + 4} ${CY + 10}" stroke="#A8ACB8" stroke-width="1.6" fill="none"/>
      <path d="M${CX + 6} ${CY} H${CX + 52} L${CX + 66} ${CY - 16} L${CX + 66} ${CY + 14} L${CX + 52} ${CY + 4}Z" fill="#FFC83D" stroke="#8A6A08" stroke-width="2" stroke-linejoin="round"/>
      <g id="pa-pas">${Array.from({length:12}, (_, k) => { const a = k * 30; return `<g transform="rotate(${a} ${CX} ${CY})"><path d="M${CX} ${CY} L${CX + 4} ${CY - 54} L${CX + 14} ${CY - 54} L${CX + 6} ${CY - 6}Z" fill="${k % 2 ? '#E9EEF6' : '#FFFFFF'}" stroke="#5A6787" stroke-width="1.6" stroke-linejoin="round"/></g>`; }).join('')}</g>
      <circle cx="${CX}" cy="${CY}" r="8" fill="#E5392C" stroke="#7A1410" stroke-width="2"/><circle cx="${CX - 2}" cy="${CY - 2}" r="2.4" fill="#FFB0A0"/>
      <rect x="${CX - 70}" y="${CY - 70}" width="140" height="${SUP - CY + 70}" fill="transparent"/></g>
    <g id="pa-mao" style="display:none"><path d="M${CX - 66} ${CY - 50} q40 -40 80 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8" opacity=".9"/><path d="M${CX + 14} ${CY - 50} l-12 -2 l8 -10Z" fill="#fff"/></g>
    <rect width="800" height="500" fill="url(#paVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#paGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const pas = el(s, '#pa-pas'), cata = el(s, '#pa-cata'), bebeAgua = el(s, '#pa-bebe-agua'), gotas = el(s, '#pa-gotas');
  el(s, '#pa-mao').style.display = ''; el(s, '#pa-mao').animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  /* 1. vento: girar o cata-vento puxa água do aquífero para o bebedouro */
  let arr = null;
  const empurra = v => { if (fase !== 'vento') return; vel = Math.min(14, vel + v); el(s, '#pa-mao').style.display = 'none'; };
  cata.addEventListener('pointerdown', e => { arr = c.ponto(e); s.setPointerCapture(e.pointerId); empurra(2.5); toca('clique'); });
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); empurra(Math.hypot(p.x - arr.x, p.y - arr.y) * .05); arr = p; });
  s.addEventListener('pointerup', () => arr = null);
  const GOTAS = Array.from({length:8}, (_, i) => ({ y:470 - i * 13, e:null }));
  GOTAS.forEach(g => { g.e = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); g.e.setAttribute('cx', CX); g.e.setAttribute('r', 3.2); g.e.setAttribute('fill', '#7FD0FF'); g.e.setAttribute('stroke', '#1B56C4'); g.e.setAttribute('stroke-width', 1); g.e.style.opacity = 0; gotas.appendChild(g.e); });
  let ultT = performance.now(), emaAnda = null;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    const base = fase === 'vento' ? 0 : .8;
    vel += (base - vel) * .012; ang = (ang + vel * dt * .06) % 360;
    pas.setAttribute('transform', `rotate(${ang.toFixed(1)} ${CX} ${CY})`);
    const fluxo = fase === 'vento' ? Math.max(0, vel - .6) : 0;
    GOTAS.forEach(g => { g.y -= fluxo * dt * .02; if (g.y < SUP - 30) g.y += 98; g.e.setAttribute('cy', g.y.toFixed(1)); g.e.style.opacity = fluxo > .3 ? 1 : 0; });
    if (fase === 'vento' && fluxo > 0) {
      bomba = Math.min(META, bomba + fluxo * dt * .0045);
      bebeAgua.setAttribute('y', (SUP - bomba / META * 18).toFixed(1));
      if (Math.random() < fluxo * .02) c.add({ tipo:'respingo', x:CX + 44, y:SUP - 18, t:0 });
      api.hud(`<span class="chip">Água no bebedouro: ${Math.round(bomba)}%</span>`);
      if (bomba >= META) bebedouroCheio();
    }
    if (emaAnda) { const k = Math.min(1, (t - emaAnda.t0) / emaAnda.ms); const x = emaAnda.x0 + (emaAnda.x1 - emaAnda.x0) * k, y = emaAnda.y0 + (emaAnda.y1 - emaAnda.y0) * k + Math.abs(Math.sin(k * 30)) * -2; el(s, '#pa-ema').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(.75 + .25 * k).toFixed(2)})`); if (k >= 1) { emaAnda = null; } }
    requestAnimationFrame(vida);
  })(ultT);
  let meio = false;
  function bebedouroCheio(){
    fase = 'bebem'; toca('vitoria'); c.brilhos(CX + 74, SUP - 14, 10, '#BFE6FF');
    api.diz('O bebedouro encheu! Essa água estava escondida bem fundo, no Aquífero Guarani. Olha a ema chegando para beber!');
    emaAnda = { x0:600, y0:314, x1:CX + 92, y1:SUP - 6, t0:performance.now(), ms:3600 };
    depois(4200, () => { el(s, '#pa-ema-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(18deg)' }, { transform:'rotate(0)' }], { duration:900, iterations:2 }); toca('glub'); });
    depois(6400, comecaBarro);
  }
  /* 2. barro: o joão-de-barro constrói a casa com a lama do banhado */
  function comecaBarro(){
    fase = 'barro'; el(s, '#pa-lama-hint').style.display = '';
    api.hud('<span class="chip">Casa do joão-de-barro: 0/5</span>');
    api.diz('Agora ajude o Barrinho a fazer a casa dele! Toque na lama do banhado para ele buscar barro. Barro é terra com água.');
  }
  const joao = el(s, '#pa-joao'), joaoIn = el(s, '#pa-joao-in');
  let jx = POUSO.x, jy = POUSO.y - 10;
  function voar(x1, y1, ms, fim){
    const x0 = jx, y0 = jy, t0 = performance.now();
    joaoIn.querySelector('.pa-asa').style.display = ''; joaoIn.querySelector('.pa-pes').style.display = 'none';
    joaoIn.setAttribute('transform', x1 < x0 ? 'scale(-1 1)' : '');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); jx = x0 + (x1 - x0) * e; jy = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50; joao.setAttribute('transform', `translate(${jx.toFixed(1)} ${jy.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else { joaoIn.querySelector('.pa-asa').style.display = 'none'; joaoIn.querySelector('.pa-pes').style.display = ''; fim && fim(); } })(t0);
  }
  el(s, '#pa-lama').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'barro') { toca('glub'); api.diz('É lama do banhado: terra misturada com água.'); return; }
    if (voando) return; voando = true; el(s, '#pa-lama-hint').style.display = 'none';
    voar(LAMA.x + 8, LAMA.y - 18, 900, () => {
      toca('glub'); for (let i = 0; i < 5; i++) c.add({ tipo:'respingo', x:LAMA.x + sorte(-8, 8), y:LAMA.y, t:i, cor:'#7A4A2A' });
      joaoIn.querySelector('.pa-bola').style.opacity = 1;
      depois(300, () => voar(POSTE.x - 14, POSTE.y - 24 - etapa * 4, 1000, () => {
        joaoIn.querySelector('.pa-bola').style.opacity = 0; etapa++; toca('planta');
        const h = [0, 14, 24, 34, 42, 48][etapa]; el(s, '#pa-ninho-clip').setAttribute('y', POSTE.y + 4 - h); el(s, '#pa-ninho-clip').setAttribute('height', h);
        c.brilhos(POSTE.x, POSTE.y - h / 2, 5, '#F0B886');
        api.hud(`<span class="chip">Casa do joão-de-barro: ${etapa}/5</span>`);
        if (etapa === 2) api.diz('Bolinha por bolinha! Ele mistura o barro com palha para a casa ficar forte.');
        if (etapa < 5) { depois(300, () => voar(POUSO.x, POUSO.y - 10, 700, () => { voando = false; el(s, '#pa-lama-hint').style.display = ''; })); }
        else { el(s, '#pa-porta').style.opacity = 1; toca('vitoria'); api.diz('A casa ficou pronta, com portinha e tudo! Sem a água do banhado, não teria barro.'); depois(500, () => voar(POUSO.x, POUSO.y - 10, 900, () => { voando = false; })); depois(3800, comecaChuva); }
      }));
    });
  });
  /* 3. chuva: o banhado guarda a água como esponja e ela desce até o aquífero */
  function comecaChuva(){
    fase = 'chuva'; const ch = el(s, '#pa-chuva'); ch.style.opacity = 1; ch.style.pointerEvents = '';
    api.hud('<span class="chip">Chuvas: 0/3</span>');
    api.diz('Chegaram nuvens de chuva! Toque nas nuvens para chover no Pampa e veja para onde vai a água.');
  }
  el(s, '#pa-chuva').addEventListener('click', e => {
    const g = e.target.closest('.pa-nuv'); if (!g || fase !== 'chuva' || chovendo || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; chovendo = true; chuvas++; toca('chuva'); const x = +g.dataset.x;
    let n = 0; (function cai(){ if (!vivo) return; for (let k = 0; k < 3; k++) c.add({ tipo:'chuva', x:x + sorte(-60, 60), y:100, vx:-.3, vy:sorte(9, 12), chao:SUP - 4, cor:'#3D8BFF' }); if (n % 4 === 0) c.add({ tipo:'infiltra', x0:sorte(60, 760), y0:SUP + 4, x1:sorte(40, 760), y1:sorte(452, 470), dur:sorte(80, 110), f:sorte(0, 6), chega:() => { aquif = Math.min(1, aquif + .012); el(s, '#pa-aq').setAttribute('y', (470 - aquif * 26).toFixed(1)); } }); if (++n < 60) depois(45, cai); })();
    const ban = el(s, '#pa-ban'), rx0 = +ban.getAttribute('rx'), ry0 = +ban.getAttribute('ry');
    ban.animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }], { duration:2400, fill:'forwards' });
    ban.setAttribute('rx', (rx0 + 8).toFixed(0)); ban.setAttribute('ry', (ry0 + 2).toFixed(0));
    depois(2800, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) { el(s, '#pa-sapos').style.opacity = 1; api.diz('O banhado guardou a água como uma esponja, e os sapinhos apareceram! O campo não ficou alagado.'); }
      if (chuvas === 2) api.diz('Parte da água desce devagar pela terra e vai encher o Aquífero Guarani lá embaixo.');
      if (chuvas === 3) { fase = 'fim'; toca('vitoria'); el(s, '#pa-chuva').style.opacity = 0; api.diz('Debaixo do Pampa fica parte do Aquífero Guarani, uma das maiores reservas de água doce escondida debaixo da terra do mundo. Os banhados ajudam a guardar essa água!'); depois(5600, api.fim); }
    });
  });
  /* toques extras */
  el(s, '#pa-quero').addEventListener('click', () => { [1500, 1300, 1500, 1300].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .09, 'square', .04, f * .85), i * 150)); el(s, '#pa-quero-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:400, iterations:2 }); });
  el(s, '#pa-umbu').addEventListener('click', e => { e.stopPropagation(); toca('pop'); c.brilhos(520, 246, 6, '#B8E89A'); api.diz('É um umbu, a árvore grandona do Pampa. A sombra dele é o lugar preferido dos bichos no calor.'); });
  el(s, '#pa-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(120, 74, 8, '#FFE27A'); api.diz('No Pampa o inverno é frio e o verão é quente. O campo fica verdinho com a chuva.'); });
  el(s, '#pa-banhado').addEventListener('click', e => { if (fase === 'chuva') return; e.stopPropagation(); toca('glub'); const p = c.ponto(e); for (let i = 0; i < 4; i++) c.add({ tipo:'bolha', x:p.x + sorte(-8, 8), y:p.y, t:i }); api.diz('Isto é um banhado, um campo encharcado cheio de plantas e bichos. Ele guarda água como uma esponja.'); });
  el(s, '#pa-aq-toque').addEventListener('click', e => { e.stopPropagation(); toca('glub'); const p = c.ponto(e); for (let i = 0; i < 5; i++) c.add({ tipo:'bolha', x:p.x + sorte(-10, 10), y:p.y, t:i }); api.diz('O Aquífero Guarani fica debaixo de quatro países: Brasil, Argentina, Paraguai e Uruguai. A água fica guardada entre os grãos de areia e pedra.'); });
  api.hud('<span class="chip">Água no bebedouro: 0%</span>');
  api.diz('Oi, eu sou o Barrinho, um joão-de-barro do Pampa! Os bichos estão com sede. Arraste o dedo no cata-vento para ele girar e puxar água lá de baixo da terra.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 8: Oceano, o grande reservatório ================= */
function jogoOceano(palco, api){
  semente = 57;
  let vivo = true, fase = 'lixo', coletados = 0, corais = 0, sois = 0, nuvemK = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const MAR = 150, CESTO = { x:362, y:122 };
  const VAGAS = [{ x:140, y:440 }, { x:262, y:432 }, { x:384, y:442 }, { x:506, y:434 }];
  const CORES = [['#FF7A5A', '#B83A20'], ['#FF9AC8', '#B8406E'], ['#FFB347', '#B8700E'], ['#B57BFF', '#6A3EAE']];
  const LIXO = [
    { id:'sacola', x:470, y:222, nome:'sacola' }, { id:'garrafa', x:548, y:170, nome:'garrafa' }, { id:'canudo', x:84, y:300, nome:'canudo' },
    { id:'lata', x:704, y:470, nome:'lata' }, { id:'rede', x:300, y:388, nome:'rede' }
  ];
  const ramo = (x, y, cor, esc, s) => { const d = `M${x} ${y} C${x} ${y - 20 * s} ${x - 10 * s} ${y - 30 * s} ${x - 14 * s} ${y - 48 * s} M${x} ${y - 14 * s} C${x + 8 * s} ${y - 26 * s} ${x + 14 * s} ${y - 34 * s} ${x + 16 * s} ${y - 52 * s} M${x - 6 * s} ${y - 28 * s} C${x - 2 * s} ${y - 38 * s} ${x} ${y - 46 * s} ${x + 2 * s} ${y - 58 * s}`; return `<path d="${d}" stroke="${esc}" stroke-width="${(9 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${(5.6 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><g fill="#FFF2E0" opacity=".85">${[[-14, -48], [16, -52], [2, -58]].map(([dx, dy]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(1.6 * s).toFixed(1)}"/>`).join('')}</g>`; };
  const cerebro = (x, y, r, cor, esc) => `<path d="M${x - r} ${y} C${x - r} ${y - r * 1.15} ${x + r} ${y - r * 1.15} ${x + r} ${y}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8"/><path d="M${x - r * .7} ${y - r * .2} q${r * .15} -${r * .4} ${r * .3} 0 t${r * .3} 0 t${r * .3} 0 t${r * .3} 0 M${x - r * .5} ${y - r * .55} q${r * .15} -${r * .3} ${r * .3} 0 t${r * .3} 0 t${r * .3} 0" stroke="${esc}" stroke-width="1.4" fill="none" opacity=".8"/><path d="M${x - r * .6} ${y - r * .7} q${r * .4} -${r * .3} ${r * .9} -${r * .2}" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>`;
  const leque = (x, y, h, cor, esc) => `<path d="M${x} ${y} C${x - h * .7} ${y - h * .3} ${x - h * .8} ${y - h} ${x - h * .2} ${y - h * 1.1} C${x + h * .2} ${y - h * 1.2} ${x + h * .8} ${y - h} ${x + h * .6} ${y - h * .3}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8" opacity=".95"/><g stroke="${esc}" stroke-width="1" opacity=".6" fill="none">${[-.5, -.25, 0, .25, .5].map(k => `<path d="M${x} ${y} Q${x + k * h * .9} ${y - h * .6} ${x + k * h * 1.1} ${y - h * 1.02}"/>`).join('')}<path d="M${x - h * .55} ${y - h * .6} Q${x} ${y - h * .72} ${x + h * .6} ${y - h * .55} M${x - h * .4} ${y - h * .3} Q${x} ${y - h * .4} ${x + h * .45} ${y - h * .28}"/></g>`;
  const anemona = (x, y, cor, esc) => `<g>${Array.from({ length:9 }, (_, i) => { const a = -Math.PI * .9 + i * Math.PI * .8 / 8 * 1.0; const ex = x + Math.cos(a) * 18, ey = y + Math.sin(a) * 20; return `<path d="M${x} ${y} Q${(x + ex) / 2 + 3} ${(y + ey) / 2 - 4} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${esc}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${(x + ex) / 2 + 3} ${(y + ey) / 2 - 4} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${cor}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`; }).join('')}<ellipse cx="${x}" cy="${y + 2}" rx="12" ry="6" fill="${esc}"/></g>`;
  const peixinho = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 0 C-4 -6 6 -6 10 0 C6 6 -4 6 -10 0Z M-10 0 L-16 -5 L-15 0 L-16 5Z" fill="${cor}" stroke="#0E3A6A" stroke-width="1"/><circle cx="5" cy="-1" r="1.3" fill="#0E1A2A"/></g>`;
  const kelp = (x, h, cor) => `<g class="balanca" style="animation-duration:${R(4, 6).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s"><path d="M${x} 500 C${x - 12} ${500 - h * .3} ${x + 12} ${500 - h * .6} ${x - 4} ${500 - h}" stroke="#2E6A2A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x} 500 C${x - 12} ${500 - h * .3} ${x + 12} ${500 - h * .6} ${x - 4} ${500 - h}" stroke="#5AA040" stroke-width="3" fill="none" stroke-linecap="round"/>${Array.from({ length:Math.floor(h / 26) }, (_, i) => { const yy = 500 - 20 - i * 26, lado = i % 2 ? 1 : -1; return `<path d="M${x} ${yy} q${lado * 16} -6 ${lado * 22} -18 q${-lado * 10} 4 ${-lado * 22} 12Z" fill="#6EB84E" stroke="#2E6A2A" stroke-width="1.2"/>`; }).join('')}</g>`;
  const gorgonia = (x, y, h, cor, esc) => { let d = ''; const galho = (x0, y0, a, L, n) => { const x1 = x0 + Math.sin(a) * L, y1 = y0 - Math.cos(a) * L; d += `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${(x0 + Math.sin(a) * L * .5 + 3).toFixed(1)} ${(y0 - Math.cos(a) * L * .5).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} `; if (n > 0) { galho(x1, y1, a - .38, L * .72, n - 1); galho(x1, y1, a + .34, L * .7, n - 1); } }; [-.7, -.25, .2, .62].forEach(a => galho(x, y, a, h * .34, 3)); return `<path d="${d}" stroke="${esc}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; };
  const esponja = (x, y, cor, esc) => [[-12, 30, 9], [2, 40, 10], [16, 26, 8]].map(([dx, h, r]) => `<path d="M${x + dx - r} ${y} V${y - h + 4} C${x + dx - r} ${y - h - 2} ${x + dx + r} ${y - h - 2} ${x + dx + r} ${y - h + 4} V${y}Z" fill="${cor}" stroke="${esc}" stroke-width="1.8"/><ellipse cx="${x + dx}" cy="${y - h + 3}" rx="${r - 3}" ry="3" fill="${esc}"/><path d="M${x + dx - r + 3} ${y - h + 10} V${y - 4}" stroke="#fff" stroke-width="2" opacity=".4" stroke-linecap="round"/>`).join('');
  const gaivota = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-8 -10 -20 -12 -30 -6 C-20 -6 -10 -2 0 4 C10 -2 20 -6 30 -6 C20 -12 8 -10 0 0Z" fill="#F4F6FA" stroke="#5A6787" stroke-width="1.4" stroke-linejoin="round"/><path d="M-30 -6 l6 1 M30 -6 l-6 1" stroke="#3E4A6A" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="4" ry="6" fill="#fff" stroke="#5A6787" stroke-width="1.2"/><path d="M0 -3 l3 -1 l-3 -1Z" fill="#FFC83D"/></g>`;
  const desenhoLixo = {
    sacola:'<path d="M-18 -6 C-20 10 -14 22 0 24 C14 22 20 10 18 -6Z" fill="#F4F8FF" fill-opacity=".82" stroke="#8A9AB8" stroke-width="1.6"/><path d="M-12 -6 C-14 -18 -4 -20 -4 -8 M12 -6 C14 -18 4 -20 4 -8" stroke="#8A9AB8" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-10 4 q4 8 0 14 M6 2 q-3 10 2 16" stroke="#C9D4E6" stroke-width="1.4" fill="none"/>',
    garrafa:'<g transform="rotate(-24)"><path d="M-8 -20 h16 v6 C12 -10 14 -6 14 2 V22 C14 26 10 28 0 28 C-10 28 -14 26 -14 22 V2 C-14 -6 -12 -10 -8 -14Z" fill="#A8E6D8" fill-opacity=".8" stroke="#3E8A7A" stroke-width="1.8"/><rect x="-6" y="-28" width="12" height="9" rx="2" fill="#2E7FD6" stroke="#12458A" stroke-width="1.4"/><rect x="-14" y="4" width="28" height="10" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.2"/><path d="M-8 -6 V20" stroke="#E6FFF8" stroke-width="2.4" stroke-linecap="round" opacity=".8"/></g>',
    canudo:'<g transform="rotate(32)"><rect x="-4" y="-26" width="8" height="52" rx="3" fill="#fff" stroke="#B83A3A" stroke-width="1.4"/><path d="M-4 -18 l8 -6 M-4 -6 l8 -6 M-4 6 l8 -6 M-4 18 l8 -6" stroke="#E5392C" stroke-width="3"/><path d="M-4 -26 q4 -6 10 -4" stroke="#B83A3A" stroke-width="1.4" fill="none"/></g>',
    lata:'<g transform="rotate(-12)"><rect x="-22" y="-12" width="44" height="24" rx="5" fill="#C9CED8" stroke="#5A6070" stroke-width="1.8"/><rect x="-8" y="-12" width="16" height="24" fill="#E5392C"/><ellipse cx="22" cy="0" rx="4" ry="12" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.4"/><path d="M-18 -7 H16" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/></g>',
    rede:'<path d="M-30 -14 C-10 -22 14 -20 32 -10 C30 6 18 18 -2 20 C-20 18 -32 6 -30 -14Z" fill="#3E8A5A" fill-opacity=".18" stroke="#2E6A4A" stroke-width="1.6"/><g stroke="#3E9A6A" stroke-width="1.4" fill="none">' + [-22, -12, -2, 8, 18, 26].map(x => `<path d="M${x} -18 Q${x + 4} 0 ${x - 2} 18"/>`).join('') + [-12, -4, 4, 12].map(y => `<path d="M-30 ${y} Q0 ${y + 6} 32 ${y - 2}"/>`).join('') + '</g><circle cx="-24" cy="-14" r="4" fill="#FFC83D" stroke="#8A6A08" stroke-width="1.2"/><path d="M30 -10 q10 4 14 14" stroke="#2E6A4A" stroke-width="1.6" fill="none"/>'
  };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Oceano com tartaruga-marinha, baleia-jubarte, recife de coral, barco recolhendo lixo e uma ilha com rio">
    <defs>
      <linearGradient id="ocVela" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset=".6" stop-color="#F6EBD2"/><stop offset="1" stop-color="#E2D2B0"/></linearGradient>
      <linearGradient id="ocVela2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B0"/><stop offset="1" stop-color="#F2C46A"/></linearGradient>
      <linearGradient id="ocCesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AD05A"/><stop offset="1" stop-color="#3E9A32"/></linearGradient>
      <radialGradient id="ocPele" cx=".4" cy=".35"><stop offset="0" stop-color="#E2A878"/><stop offset="1" stop-color="#B07448"/></radialGradient>
      <linearGradient id="ocCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DB6F2"/><stop offset=".8" stop-color="#C8EAFB"/><stop offset="1" stop-color="#F2FAFF"/></linearGradient>
      <linearGradient id="ocMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CC0F2"/><stop offset=".35" stop-color="#2386D6"/><stop offset=".75" stop-color="#14549E"/><stop offset="1" stop-color="#0B2E6A"/></linearGradient>
      <linearGradient id="ocRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="ocAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2DDA0"/><stop offset="1" stop-color="#C9A86A"/></linearGradient>
      <linearGradient id="ocPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A88AB4"/><stop offset="1" stop-color="#5E4A72"/></linearGradient>
      <linearGradient id="ocIlha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CD06A"/><stop offset="1" stop-color="#4E9A3A"/></linearGradient>
      <linearGradient id="ocCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5603C"/><stop offset="1" stop-color="#A8341C"/></linearGradient>
      <radialGradient id="ocSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <linearGradient id="ocNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>
      <linearGradient id="ocPele" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB08A"/><stop offset="1" stop-color="#E5603C"/></linearGradient>
      <radialGradient id="ocVivaG" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#FFE6F4" stop-opacity=".95"/><stop offset="1" stop-color="#E88AC8" stop-opacity=".7"/></radialGradient>
      <clipPath id="ocSubClip"><rect x="0" y="${MAR - 6}" width="800" height="400"/></clipPath>
      <radialGradient id="ocVinheta" cx=".5" cy=".42" r=".78"><stop offset=".6" stop-color="#04163A" stop-opacity="0"/><stop offset="1" stop-color="#04163A" stop-opacity=".34"/></radialGradient>
      <pattern id="ocCaus" width="80" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 C10 5 20 25 30 12 C40 2 50 22 60 14 C68 8 74 18 80 15 M10 28 C18 22 26 30 34 26 M46 4 C54 0 62 8 70 4" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/></pattern>
      <filter id="ocGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${MAR}" fill="url(#ocCeu)"/>
    <g id="oc-sol" class="toque" style="transform-origin:90px 62px"><circle cx="90" cy="62" r="54" fill="#FFE27A" opacity=".28"/><circle cx="90" cy="62" r="40" fill="#FFE27A" opacity=".3"/><circle cx="90" cy="62" r="28" fill="url(#ocSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M76 52 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><g id="oc-sol-hint" style="display:none">${brilhoHotspot(118, 40)}</g><circle cx="90" cy="62" r="52" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="200" y="22" width="90" height="42" style="color:#fff" opacity=".9"/><use href="#nuvem" x="470" y="40" width="64" height="30" style="color:#fff" opacity=".75"/></g>
    <rect y="${MAR - 34}" width="800" height="34" fill="url(#ocNevoa)"/>
    <g id="oc-gaivotas" class="toque"><g class="deriva" style="animation-duration:18s"><g style="animation:flutua 2.6s ease-in-out infinite alternate">${gaivota(520, 70, .9)}${gaivota(566, 92, .7)}</g><rect x="480" y="50" width="120" height="60" fill="transparent"/></g></g>
    <g id="oc-ilha">
      <path d="M584 ${MAR} C600 128 630 110 668 104 C700 98 724 92 750 96 C772 98 790 94 800 92 V${MAR}Z" fill="url(#ocIlha)" stroke="#3E7A2A" stroke-width="2"/>
      <path d="M640 112 C670 102 700 98 740 98" stroke="#C8F0A0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M584 ${MAR} C600 138 620 132 650 134 C680 136 700 140 720 ${MAR}Z" fill="#F2DDA0" stroke="#C9A86A" stroke-width="1.6"/>
      <path id="oc-rio" d="M742 100 C728 110 712 114 698 124 C684 134 672 138 652 ${MAR - 1}" stroke="#9CCBEB" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path id="oc-rio-fluxo" d="M742 100 C728 110 712 114 698 124 C684 134 672 138 652 ${MAR - 1}" stroke="#E6F6FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 12" style="opacity:0"/>
      <g transform="translate(770 98)"><path d="M0 0 C-2 -16 2 -30 -4 -46" stroke="#8A6A3E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-4 -46 c-10 -6 -22 -4 -28 4 c10 -2 18 0 28 -4Z M-4 -46 c4 -12 16 -16 26 -12 c-10 2 -18 6 -26 12Z M-4 -46 c-14 -12 -6 -24 2 -26 c-2 8 -2 16 -2 26Z M-4 -46 c10 -2 22 6 24 14 c-8 -6 -16 -10 -24 -14Z" fill="#4EA83A" stroke="#2E6A22" stroke-width="1.4" stroke-linejoin="round"/><circle cx="-2" cy="-42" r="3" fill="#8A5A2A"/><circle cx="-7" cy="-41" r="3" fill="#8A5A2A"/></g>
      <g transform="translate(706 104) scale(.75)"><path d="M0 0 C-2 -16 2 -30 -4 -46" stroke="#8A6A3E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-4 -46 c-10 -6 -22 -4 -28 4 c10 -2 18 0 28 -4Z M-4 -46 c4 -12 16 -16 26 -12 c-10 2 -18 6 -26 12Z M-4 -46 c-14 -12 -6 -24 2 -26 c-2 8 -2 16 -2 26Z M-4 -46 c10 -2 22 6 24 14 c-8 -6 -16 -10 -24 -14Z" fill="#4EA83A" stroke="#2E6A22" stroke-width="1.4" stroke-linejoin="round"/><circle cx="-2" cy="-42" r="3" fill="#8A5A2A"/><circle cx="-7" cy="-41" r="3" fill="#8A5A2A"/></g>
      <g fill="#8A8698" stroke="#4E4A5A" stroke-width="1.6"><path d="M712 150 C714 138 730 136 736 150Z"/><path d="M728 150 C732 142 744 142 746 150Z"/><path d="M590 150 C594 140 606 140 610 150Z"/></g><path d="M584 149 C620 140 680 142 720 149" stroke="#fff" stroke-width="2.4" fill="none" stroke-dasharray="10 6" opacity=".9"/><g><circle cx="652" cy="110" r="3" fill="#FF8AB8"/><circle cx="668" cy="104" r="3" fill="#FFD447"/><circle cx="684" cy="102" r="3" fill="#FF8AB8"/><circle cx="700" cy="100" r="3" fill="#FFFFFF"/></g>
      <g fill="#3E8A3A">${[[660, 112], [690, 106], [720, 102]].map(([x, y]) => `<path d="${copa(x, y, 12, 8, 7)}" stroke="#2E6A22" stroke-width="1.2"/>`).join('')}</g>
    </g>
    <g id="oc-nuvem" style="opacity:0;transition:opacity 1s, transform 4s ease-in-out"><g id="oc-nuvem-in" style="transform-origin:330px 60px;transform:scale(.5);transition:transform 1s"><use href="#nuvem" x="252" y="22" width="156" height="78" style="color:#8A97B4"/><use href="#nuvem" x="258" y="24" width="146" height="72" style="color:#DDE4F0"/><use href="#nuvem" x="282" y="50" width="100" height="44" style="color:#B6C0D6"/><path d="M290 50 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
    <rect y="${MAR}" width="800" height="${500 - MAR}" fill="url(#ocMar)"/>
    <rect y="${MAR}" width="800" height="70" fill="url(#ocCaus)" opacity=".35"/>
    <g fill="#fff">${Array.from({ length:14 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .37 % 2.4).toFixed(2)}s" x="${(30 + (i * 53) % 150).toFixed(0)}" y="${(MAR + 4 + (i * 7) % 22).toFixed(0)}" width="${(10 + i % 3 * 6)}" height="2.4" rx="1.2"/>`).join('')}</g>
    <g id="oc-raios">${[[120, 70], [300, 50], [470, 80], [640, 60]].map(([x, w]) => `<path d="M${x} ${MAR} L${x + w} ${MAR} L${x + w * 2.2} 470 L${x - w * .6} 470Z" fill="url(#ocRaio)" opacity=".55"/>`).join('')}</g>
    <g opacity=".35" fill="#0B3A7A">${Array.from({ length:7 }, (_, i) => `<path d="${copa(60 + i * 120, 432, 70, 28, 9, .25)}"/>`).join('')}</g>
    <rect id="oc-agua" x="0" y="${MAR + 2}" width="800" height="${500 - MAR - 2}" fill="transparent"/>
    <g id="oc-vivas">${[[300, 262, 1], [520, 300, .8]].map(([x, y, k], i) => `<g class="oc-viva toque" data-i="${i}" transform="translate(${x} ${y}) scale(${k})"><g class="oc-viva-in"><g style="animation:flutua ${(3.4 + i).toFixed(1)}s ease-in-out infinite alternate"><path d="M-10 6 C-12 20 -6 30 -10 42 M-3 8 C-1 22 -5 34 -1 46 M4 8 C6 20 2 32 6 44 M11 6 C13 18 9 28 12 38" stroke="#E88AC8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/><path d="M-6 8 C-8 16 -2 22 -4 30 M6 8 C8 16 2 22 4 30" stroke="#FFB8E0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M-18 8 C-20 -12 -8 -20 0 -20 C8 -20 20 -12 18 8 C12 4 6 10 0 6 C-6 10 -12 4 -18 8Z" fill="url(#ocVivaG)" stroke="#B8508E" stroke-width="1.6"/><path d="M-10 -8 q4 -6 10 -6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="-5" cy="-3" r="1.6" fill="#8E2E6A"/><circle cx="5" cy="-3" r="1.6" fill="#8E2E6A"/></g></g><rect x="-24" y="-24" width="48" height="72" fill="transparent"/></g>`).join('')}</g>
    <g id="oc-jubarte" class="toque" data-fig="jubarte" clip-path="url(#ocSubClip)"><g id="oc-jub-pos"><g style="animation:flutua 7s ease-in-out infinite alternate"><svg x="560" y="248" width="214" height="126" viewBox="0 0 170 100"><use href="#f-jubarte"/></svg></g></g>${brilhoHotspot(740, 268)}</g>
    <path d="M0 458 C120 444 240 452 360 450 C480 444 600 456 800 444 V500 H0Z" fill="url(#ocAreia)" stroke="#B8965A" stroke-width="2"/>
    <path d="M0 458 C120 444 240 452 360 450 C480 444 600 456 800 444 V500 H0Z" fill="url(#ocCaus)" opacity=".28" id="oc-caus-areia"/>
    <g stroke="#D9BC78" stroke-width="1.6" fill="none" opacity=".8">${Array.from({ length:14 }, () => { const x = R(0, 780), y = R(466, 494); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -4 16 0 t16 0"/>`; }).join('')}</g>
    <g>${[[560, 486], [96, 488], [640, 478]].map(([x, y]) => `<path d="M${x} ${y - 9} L${x + 2.6} ${y - 3} L${x + 9} ${y - 3} L${x + 4} ${y + 1.5} L${x + 6} ${y + 8} L${x} ${y + 4} L${x - 6} ${y + 8} L${x - 4} ${y + 1.5} L${x - 9} ${y - 3} L${x - 2.6} ${y - 3}Z" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}<path d="M440 484 c0 -10 16 -10 16 0Z" fill="#FFE0C8" stroke="#B88A6A" stroke-width="1.2"/><path d="M444 484 l4 -7 l4 7" stroke="#B88A6A" stroke-width="1" fill="none"/></g>
    <g id="oc-recife">
      ${[60, 200, 322, 446, 566].map((x, i) => `<path d="${copa(x, 452 + (i % 2) * 4, 62, 22, 10, .22)}" fill="url(#ocPedra)" stroke="#3E2E52" stroke-width="2"/>`).join('')}
      <g fill="#C9A8D6" opacity=".55">${Array.from({ length:22 }, () => `<circle cx="${R(10, 620).toFixed(0)}" cy="${R(440, 462).toFixed(0)}" r="${R(1.5, 3).toFixed(1)}"/>`).join('')}</g>
      ${cerebro(322, 452, 22, '#9AD07A', '#3E7A2A')}${gorgonia(616, 452, 70, '#C08AFF', '#5E2E9A')}${esponja(540, 454, '#FFB347', '#A8620E')}${anemona(572, 452, '#FF9AC8', '#B8406E')}${anemona(26, 450, '#FFB347', '#B8700E')}
      ${ramo(206, 448, '#FF7A5A', '#B83A20', .7)}${ramo(456, 452, '#FFB347', '#B8700E', .6)}
    </g>
    <g id="oc-polvo" class="toque"><g id="oc-polvo-in" style="transition:transform .6s cubic-bezier(.3,1.5,.5,1)"><g class="oc-pele" style="transition:fill 1s,stroke 1s" fill="url(#ocPele)" stroke="#8E2E14" stroke-width="1.8"><path d="M424 448 C418 438 420 430 426 432 C428 438 430 444 434 448Z M462 448 C470 440 472 432 466 432 C462 438 458 444 454 448Z M436 450 C430 458 422 460 418 456 C424 454 430 450 432 446Z M450 450 C456 458 464 460 468 456 C462 454 456 450 454 446Z"/><path d="M426 446 C424 426 432 412 444 412 C456 412 464 426 462 446Z"/></g><circle cx="438" cy="432" r="4.4" fill="#fff" stroke="#3E1E0C" stroke-width="1"/><circle cx="452" cy="432" r="4.4" fill="#fff" stroke="#3E1E0C" stroke-width="1"/><circle cx="439" cy="433" r="2.2" fill="#12121A"/><circle cx="453" cy="433" r="2.2" fill="#12121A"/><path d="M432 420 q6 -5 12 -4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/><g class="oc-pele" style="transition:fill 1s" fill="#C84A2A" opacity=".5"><circle cx="436" cy="422" r="2"/><circle cx="452" cy="420" r="2.4"/><circle cx="444" cy="440" r="1.8"/></g></g><path d="${copa(444, 458, 34, 12, 9, .2)}" fill="url(#ocPedra)" stroke="#3E2E52" stroke-width="2"/><rect x="410" y="406" width="70" height="56" fill="transparent"/></g>
    <g id="oc-caranguejo" class="toque"><g id="oc-car-pos" transform="translate(640 482)"><g id="oc-car-in"><path d="M-12 2 l-8 6 M-10 4 l-6 8 M12 2 l8 6 M10 4 l6 8" stroke="#A8341C" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="14" ry="9" fill="#F0703C" stroke="#8E2E14" stroke-width="1.8"/><path d="M-12 -4 C-20 -10 -24 -16 -18 -20 C-14 -16 -12 -14 -10 -8 M12 -4 C20 -10 24 -16 18 -20 C14 -16 12 -14 10 -8" fill="#F0703C" stroke="#8E2E14" stroke-width="1.8"/><path d="M-4 -8 v-6 M4 -8 v-6" stroke="#8E2E14" stroke-width="1.6"/><circle cx="-4" cy="-15" r="2.4" fill="#fff" stroke="#12121A"/><circle cx="4" cy="-15" r="2.4" fill="#fff" stroke="#12121A"/><circle cx="-4" cy="-15" r="1" fill="#12121A"/><circle cx="4" cy="-15" r="1" fill="#12121A"/><path d="M-6 -2 q6 -4 12 0" stroke="#FFC0A0" stroke-width="2" fill="none" opacity=".7"/></g><rect x="-26" y="-26" width="52" height="40" fill="transparent"/></g></g>
    <g>${[690, 712, 736, 600, 520].map((x, i) => `<g class="balanca" style="animation-delay:${(-i * .7).toFixed(1)}s"><path d="M${x} 490 q-4 -14 -2 -26 M${x + 5} 490 q2 -16 6 -28 M${x + 10} 490 q4 -10 10 -18" stroke="#3E8A3A" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join('')}</g>
    <g class="toque" data-fig="coral"><svg x="18" y="362" width="96" height="96" viewBox="0 0 100 100"><use href="#f-coral"/></svg>${brilhoHotspot(96, 380)}</g>
    ${VAGAS.map((v, i) => `<g class="oc-vaga toque" data-i="${i}"><g class="oc-branco">${ramo(v.x, v.y, '#F2EFE8', '#B8B2A6', .62)}${cerebro(v.x + 20, v.y + 2, 10, '#F2EFE8', '#B8B2A6')}<g class="oc-hint" style="display:none">${brilhoHotspot(v.x + 16, v.y - 44)}</g></g><g class="oc-novo" style="transform-origin:${v.x}px ${v.y}px;transform:scale(0);transition:transform 1s cubic-bezier(.3,1.5,.5,1)">${ramo(v.x, v.y, CORES[i][0], CORES[i][1], .9)}${ramo(v.x - 18, v.y + 2, CORES[(i + 1) % 4][0], CORES[(i + 1) % 4][1], .55)}${cerebro(v.x + 22, v.y + 2, 12, CORES[(i + 2) % 4][0], CORES[(i + 2) % 4][1])}</g><rect x="${v.x - 34}" y="${v.y - 64}" width="70" height="72" fill="transparent"/></g>`).join('')}
    <g id="oc-peixes">${[[380, 318, 1], [300, 352, .8], [520, 360, .9], [190, 366, .7]].map(([x, y, s], i) => `<g class="oc-peixe" style="opacity:0;transition:opacity 1.2s"><g style="animation:flutua ${(3 + i * .6).toFixed(1)}s ease-in-out infinite alternate"><svg x="${x}" y="${y}" width="${(60 * s).toFixed(0)}" height="${(40 * s).toFixed(0)}" viewBox="0 0 120 80"${i === 0 ? ' class="toque" data-fig="budiao"' : ''}><use href="#f-budiao"/></svg></g></g>`).join('')}
      <g class="oc-peixe" style="opacity:0;transition:opacity 1.2s">${[[430, 400, '#FFD447'], [446, 392, '#FFD447'], [440, 408, '#FFD447'], [250, 404, '#FF8AB8'], [262, 396, '#FF8AB8']].map(([x, y, c]) => peixinho(x, y, .9, c)).join('')}</g></g>
    <g id="oc-tata" class="toque" data-fig="tartaruga" style="cursor:grab"><g id="oc-tata-pos"><g id="oc-tata-vira"><g style="animation:flutua 4s ease-in-out infinite alternate"><svg x="130" y="196" width="124" height="91" viewBox="0 0 150 110"><use href="#f-tartaruga"/></svg></g></g></g></g>
    <g id="oc-barco"><g style="animation:flutua 3.2s ease-in-out infinite alternate">
      <ellipse cx="380" cy="${MAR + 6}" rx="96" ry="7" fill="#0E4A8A" opacity=".35"/>
      <path d="M402 ${MAR - 22} V56" stroke="#5A3418" stroke-width="5" stroke-linecap="round"/><path d="M402 ${MAR - 22} V56" stroke="#A8743E" stroke-width="2" stroke-linecap="round"/>
      <path d="M402 60 L306 ${MAR - 30}" stroke="#8A7A6A" stroke-width="1.2"/><path d="M402 60 L462 ${MAR - 34}" stroke="#8A7A6A" stroke-width="1.2"/>
      <path d="M398 64 C378 84 356 104 316 ${MAR - 32} L396 ${MAR - 32}Z" fill="url(#ocVela2)" stroke="#9A8A6A" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M406 62 C432 78 448 100 454 ${MAR - 34} L406 ${MAR - 34}Z" fill="url(#ocVela)" stroke="#9A8A6A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M408 84 C424 92 436 104 442 116 M408 100 C420 106 430 114 436 ${MAR - 36}" stroke="#E2D6BC" stroke-width="1.4" fill="none"/>
      <path d="M408 64 C426 74 438 86 446 100" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M402 56 l20 7 l-20 7Z" fill="#3FA864" stroke="#1E6A3A" stroke-width="1.2" stroke-linejoin="round"/><path d="M406 60 q5 2 9 3" stroke="#B8F0C8" stroke-width="1.2" fill="none"/>
      <path d="M294 ${MAR - 30} C330 ${MAR - 22} 420 ${MAR - 22} 466 ${MAR - 34} C460 ${MAR - 6} 442 ${MAR + 10} 414 ${MAR + 10} H336 C312 ${MAR + 10} 298 ${MAR - 6} 294 ${MAR - 30}Z" fill="url(#ocCasco)" stroke="#5E1A0E" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M300 ${MAR - 14} C340 ${MAR - 8} 420 ${MAR - 8} 460 ${MAR - 18}" stroke="#FFF4E4" stroke-width="5" fill="none"/><path d="M300 ${MAR - 14} C340 ${MAR - 8} 420 ${MAR - 8} 460 ${MAR - 18}" stroke="#2E7BF6" stroke-width="1.6" fill="none" transform="translate(0 4)"/>
      <path d="M304 ${MAR - 2} C340 ${MAR + 4} 420 ${MAR + 4} 454 ${MAR - 4}" stroke="#8A2A18" stroke-width="1.2" fill="none" opacity=".6"/>
      <path d="M314 ${MAR + 6} C340 ${MAR + 10} 420 ${MAR + 10} 446 ${MAR + 2} C440 ${MAR + 8} 430 ${MAR + 10} 414 ${MAR + 10} H336 C326 ${MAR + 10} 318 ${MAR + 9} 314 ${MAR + 6}Z" fill="#2E3A5A" opacity=".85"/>
      <path d="M292 ${MAR - 31} C330 ${MAR - 23} 420 ${MAR - 23} 468 ${MAR - 35}" stroke="#7A4A22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M294 ${MAR - 32} C330 ${MAR - 24} 420 ${MAR - 24} 466 ${MAR - 36}" stroke="#D8A060" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M306 ${MAR - 24} C312 ${MAR - 20} 318 ${MAR - 18} 326 ${MAR - 17}" stroke="#FFB8A8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="440" cy="${MAR - 4}" r="4.6" fill="#BFE8FF" stroke="#5E1A0E" stroke-width="2"/><circle cx="439" cy="${MAR - 5.4}" r="1.4" fill="#fff"/>
      <g fill="none" stroke="#fff" stroke-linecap="round" opacity=".85"><path d="M286 ${MAR + 2} q8 -4 16 0 q8 4 16 0" stroke-width="2.4"/><path d="M450 ${MAR + 4} q8 -4 16 0 q6 3 12 0" stroke-width="2"/><path d="M336 ${MAR + 14} h70" stroke-width="1.6" opacity=".5"/></g>
      <g id="oc-crianca" class="toque">
        <path d="M424 ${MAR - 24} v-12 M433 ${MAR - 24} v-12" stroke="#1E2E5A" stroke-width="5.4" stroke-linecap="round"/><path d="M419 ${MAR - 23} h9 M429 ${MAR - 23} h9" stroke="#F4F4F4" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M418 ${MAR - 34} C418 ${MAR - 40} 439 ${MAR - 40} 439 ${MAR - 34} V${MAR - 30} H418Z" fill="#2E4A8A" stroke="#12235A" stroke-width="1.4"/>
        <path id="oc-braco" d="M437 ${MAR - 47} C443 ${MAR - 50} 447 ${MAR - 55} 449 ${MAR - 61}" stroke="#A86A3E" stroke-width="5" fill="none" stroke-linecap="round" style="transform-origin:437px ${MAR - 47}px"/><circle cx="449.5" cy="${MAR - 62}" r="3.2" fill="#C98A5A" stroke="#6E3E1A" stroke-width="1"/>
        <path d="M416 ${MAR - 50} C416 ${MAR - 56} 441 ${MAR - 56} 441 ${MAR - 50} L440 ${MAR - 34} H417Z" fill="#FF7A2E" stroke="#A8400E" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M424 ${MAR - 54} V${MAR - 36} M433 ${MAR - 54} V${MAR - 36}" stroke="#FFD25A" stroke-width="2.2"/><path d="M417 ${MAR - 42} H440" stroke="#12235A" stroke-width="1.6"/><path d="M420 ${MAR - 50} q4 -3 8 -2" stroke="#FFC2A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M418 ${MAR - 49} C412 ${MAR - 46} 410 ${MAR - 42} 410 ${MAR - 38}" stroke="#A86A3E" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="428" cy="${MAR - 63}" r="10" fill="url(#ocPele)" stroke="#6E3E1A" stroke-width="1.6"/>
        <path d="M418 ${MAR - 64} C418 ${MAR - 76} 438 ${MAR - 76} 438 ${MAR - 64}Z" fill="#2E7BF6" stroke="#12458A" stroke-width="1.6" stroke-linejoin="round"/><path d="M436 ${MAR - 65} h10 c1 0 1 2 0 2.4 h-10Z" fill="#1E5AC4" stroke="#12458A" stroke-width="1.2"/><path d="M422 ${MAR - 70} q4 -4 9 -3" stroke="#8AC0FF" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M418.4 ${MAR - 63} q-2 4 0 7 M420 ${MAR - 63.6} q-1 3 0 5" stroke="#3A1E0C" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="432" cy="${MAR - 62}" rx="1.6" ry="2" fill="#12121A"/><circle cx="432.5" cy="${MAR - 62.8}" r=".6" fill="#fff"/><ellipse cx="434.6" cy="${MAR - 58.4}" rx="2.2" ry="1.3" fill="#FF8A7A" opacity=".55"/>
        <path d="M428 ${MAR - 57.6} q3 2.4 6 0" stroke="#6E3E1A" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <rect x="406" y="${MAR - 80}" width="48" height="60" fill="transparent"/></g>
      <g transform="translate(318 ${MAR - 14})"><circle r="9" fill="none" stroke="#fff" stroke-width="5.4"/><circle r="9" fill="none" stroke="#E5392C" stroke-width="5.4" stroke-dasharray="7 7.1"/><circle r="11.6" fill="none" stroke="#8A2A18" stroke-width=".8" opacity=".6"/><path d="M-6 -6 q3 -3 7 -3" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/></g>
      <g id="oc-cesto"><path d="M336 ${MAR - 48} H392 L387 ${MAR - 22} H341Z" fill="url(#ocCesto)" stroke="#1E5A1A" stroke-width="2.2" stroke-linejoin="round"/><path d="M339 ${MAR - 40} H389 M340 ${MAR - 31} H388" stroke="#1E5A1A" stroke-width="1.2" opacity=".6"/><g stroke="#1E5A1A" stroke-width="1.1" opacity=".55">${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${343 + k * 7} ${MAR - 48} L${345 + k * 6.4} ${MAR - 22}"/>`).join('')}</g><path d="M334 ${MAR - 49} H394" stroke="#2E7A22" stroke-width="4" stroke-linecap="round"/><path d="M338 ${MAR - 50} H390" stroke="#9AE07A" stroke-width="1.4" stroke-linecap="round"/><path d="M356 ${MAR - 34} l4 -5 l4 5 M372 ${MAR - 39} l5 2 l-2 5 M366 ${MAR - 28} l-6 0 l2 -4" stroke="#E8FFD8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g id="oc-cesto-dentro">${['#F4F8FF', '#A8E6D8', '#E5392C', '#C9CED8', '#3E9A6A'].map((c, i) => `<circle cx="${342 + i * 10}" cy="${MAR - 48}" r="6" fill="${c}" stroke="#4E5A6A" stroke-width="1" style="opacity:0;transition:opacity .4s"/>`).join('')}</g></g>
    </g></g>
    <path d="M0 ${MAR} ${Array.from({ length:40 }, (_, i) => `q10 -4 20 0`).join(' ')}" stroke="#E6F6FF" stroke-width="2.6" fill="none"/>
    <path d="M0 ${MAR + 6} ${Array.from({ length:27 }, () => `q15 4 30 0`).join(' ')}" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".6"/>
    <g id="oc-lixos">${LIXO.map((l, i) => `<g class="oc-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab"><g style="animation:flutua ${(2.6 + i * .4).toFixed(1)}s ease-in-out infinite alternate">${desenhoLixo[l.id]}</g><circle r="34" fill="transparent"/></g>`).join('')}</g>
    <g id="oc-mao"><path d="M530 164 C480 100 420 92 384 104" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M380 104 l12 -8 l2 12Z" fill="#fff"/></g>
    <g id="oc-vapor"></g>
    ${kelp(760, 170, '#5AA040')}${kelp(784, 120, '#5AA040')}${kelp(14, 140, '#5AA040')}
    <rect width="800" height="500" fill="url(#ocVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#ocGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#oc-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  s.querySelectorAll('#oc-raios path').forEach((r, i) => r.animate([{ opacity:.3 }, { opacity:.7 }, { opacity:.3 }], { duration:4000 + i * 900, iterations:Infinity }));
  const bolhas = (x, y, n, topo) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.8, 1.8), r:sorte(2, 5), topo:topo || MAR + 4, f:sorte(0, 6) }); };
  /* 1. lixo: arrastar o lixo para o cesto do barco */
  const lix = [...s.querySelectorAll('.oc-lixo')], pos = LIXO.map(l => ({ x:l.x, y:l.y, foi:false }));
  const poe = i => lix[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  lix.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'lixo' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(60, Math.min(480, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; lix[i].style.cursor = 'grab';
    if (!moveu || Math.hypot(pos[i].x - CESTO.x, pos[i].y - CESTO.y) < 95) coletar(i); else voltar(i);
  });
  function anima(i, x1, y1, ms, esc, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 40;
      lix[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${(1 + (esc - 1) * e).toFixed(2)})`);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function voltar(i){ const l = LIXO[i]; anima(i, l.x, l.y, 700, 1); toca('glub'); api.diz('Leve até o cestinho verde do barco!'); }
  function coletar(i){
    pos[i].foi = true; if (pos[i].y > MAR) bolhas(pos[i].x, pos[i].y, 5);
    anima(i, CESTO.x, CESTO.y - 6, 900, .3, () => {
      lix[i].style.display = 'none'; coletados++; toca('pop'); c.brilhos(CESTO.x, CESTO.y - 20, 6, '#FFE27A');
      el(s, '#oc-cesto-dentro').children[coletados - 1].style.opacity = 1;
      api.hud(`<span class="chip">Lixo no barco: ${coletados}/5</span>`);
      const falas = { sacola:'Sacola no mar parece água-viva, e a tartaruga pode engolir por engano!', garrafa:'Uma garrafa de plástico demora centenas de anos para sumir do mar.', canudo:'Canudo de plástico machuca os bichos do mar. Melhor usar copo!', lata:'A lata pode ser reciclada e virar outra lata.', rede:'Uma rede de pesca perdida. Os bichos ficam presos nela. Ainda bem que você tirou!' };
      if (coletados < 5) api.diz(falas[LIXO[i].id]);
      else { toca('vitoria'); api.diz('Mar limpinho! Quase todo o lixo do mar vem da terra, levado pela chuva e pelos rios.'); depois(4800, comecaCorais); }
    });
  }
  /* 2. corais: plantar mudas onde o recife ficou branco */
  function comecaCorais(){
    fase = 'corais'; s.querySelectorAll('.oc-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Corais: 0/4</span>');
    api.diz('Este pedaço do recife ficou branquinho, sem cor. Toque nele para plantar mudas de coral!');
  }
  s.querySelectorAll('.oc-vaga').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'corais') { toca('clique'); api.diz('Este coral ficou branquinho. Quando a água do mar esquenta demais, o coral perde a cor e fica fraco.'); return; }
    if (g.dataset.feito) return; g.dataset.feito = 1;
    const v = VAGAS[+g.dataset.i]; corais++;
    el(g, '.oc-branco').style.transition = 'opacity .8s'; el(g, '.oc-branco').style.opacity = 0;
    el(g, '.oc-novo').style.transform = 'scale(1)'; toca('planta'); bolhas(v.x, v.y - 20, 6); c.brilhos(v.x, v.y - 30, 6, '#FFE27A');
    depois(700, () => { s.querySelectorAll('.oc-peixe')[corais - 1].style.opacity = 1; if (corais === 4) s.querySelectorAll('.oc-peixe')[4].style.opacity = 1; });
    api.hud(`<span class="chip">Corais: ${corais}/4</span>`);
    if (corais === 1) api.diz('O coral parece planta, mas é um bicho! E olha: um peixe veio morar aqui.');
    if (corais === 2) api.diz('O recife é a casa e o berçário de muitos peixes.');
    if (corais === 4) { toca('vitoria'); api.diz('O recife ficou colorido e cheio de vida de novo!'); depois(4200, comecaSol); }
  }));
  /* 3. sol: a água do mar evapora, o sal fica e cai chuva doce */
  function comecaSol(){
    fase = 'sol'; el(s, '#oc-sol-hint').style.display = ''; el(s, '#oc-nuvem').style.opacity = .35;
    api.hud('<span class="chip">Sol: 0/3</span>');
    api.diz('A água do mar é salgada, não dá para beber. Mas o sol tem um truque! Toque no sol três vezes.');
  }
  const salpica = () => { for (let i = 0; i < 10; i++) c.add({ tipo:'brilho', t:-i * 2, x:sorte(160, 560), y:MAR + sorte(-2, 6), cor:'#FFFFFF' }); };
  el(s, '#oc-sol').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'sol') { toca('ok'); c.brilhos(90, 62, 6, '#FFE27A'); api.diz('O sol esquenta o mar o dia todo. Quase toda a água do planeta está nos oceanos.'); return; }
    if (ocupado || sois >= 3) return; ocupado = true; sois++; toca('vapor'); el(s, '#oc-sol').animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration:600 });
    for (let i = 0; i < 18; i++) c.add({ tipo:'vapor', x0:sorte(170, 560), y0:MAR - 2, x1:330 + sorte(-50, 50), y1:66 + sorte(-12, 12), dur:sorte(70, 110), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 });
    salpica(); depois(400, salpica);
    depois(1800, () => {
      nuvemK = sois; el(s, '#oc-nuvem').style.opacity = .35 + .22 * sois; el(s, '#oc-nuvem-in').style.transform = `scale(${(.5 + sois * .17).toFixed(2)})`;
      api.hud(`<span class="chip">Sol: ${sois}/3</span>`); ocupado = false;
      if (sois === 1) api.diz('A água subiu como vapor, mas o sal ficou no mar! Viu os brilhinhos? É o sal.');
      if (sois === 2) api.diz('O vapor vai se juntando lá no alto e forma uma nuvem.');
      if (sois === 3) choveNaIlha();
    });
  });
  function choveNaIlha(){
    fase = 'chuva'; el(s, '#oc-sol-hint').style.display = 'none';
    api.diz('A nuvem está cheia! O vento leva ela para a ilha.');
    el(s, '#oc-nuvem').style.transform = 'translate(392px, -6px)';
    depois(4200, () => {
      toca('chuva'); c.chover(660, 790, 96, 112, 70, '#3D8BFF');
      const rio = el(s, '#oc-rio'); rio.style.transition = 'stroke-width 2s, stroke 2s'; rio.setAttribute('stroke', '#3D8BFF'); rio.setAttribute('stroke-width', '7');
      const fl = el(s, '#oc-rio-fluxo'); fl.style.opacity = 1; fl.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-36 }], { duration:900, iterations:Infinity });
      api.diz('Chuva de água doce! Ela enche o rio da ilha, e o rio volta para o mar. A água vive dando essa volta.');
      depois(5200, () => { fase = 'fim'; toca('vitoria'); api.diz('Quase toda a água do planeta está nos oceanos, e ela é salgada. O sol transforma um pouquinho dela em chuva doce. Por isso cuidar do mar é cuidar da nossa água!'); depois(6400, api.fim); });
    });
  }
  /* toques extras */
  /* Tata nada até onde a criança arrastar */
  const tata = { x:0, y:0, ax:0, ay:0, vira:1 }; let pegaTata = null;
  el(s, '#oc-tata').addEventListener('pointerdown', e => { if (arr) return; e.stopPropagation(); const p = c.ponto(e); pegaTata = { x0:p.x, y0:p.y, dx:p.x - tata.ax, dy:p.y - tata.ay, moveu:false }; s.setPointerCapture(e.pointerId); });
  s.addEventListener('pointermove', e => { if (!pegaTata) return; const p = c.ponto(e); if (Math.hypot(p.x - pegaTata.x0, p.y - pegaTata.y0) > 8) pegaTata.moveu = true; tata.ax = Math.max(-120, Math.min(470, p.x - pegaTata.dx)); tata.ay = Math.max(-30, Math.min(170, p.y - pegaTata.dy)); });
  s.addEventListener('pointerup', () => { if (!pegaTata) return; const m = pegaTata.moveu; pegaTata = null;
    if (m) { bolhas(192 + tata.ax, 230 + tata.ay, 4); return; }
    toca('glub'); bolhas(250 + tata.x, 220 + tata.y, 5); api.diz(fase === 'lixo' ? 'Sou a Tata! Me ajuda a tirar o lixo do mar? Arraste até o barco.' : 'As tartarugas-marinhas nadam milhares de quilômetros e voltam para a praia onde nasceram.'); });
  /* cardume: os peixinhos seguem o dedo na água */
  const cardume = Array.from({ length:16 }, (_, i) => ({ x:660 + sorte(-60, 60), y:222 + sorte(-24, 24), vx:sorte(-1, 1), vy:0, f:sorte(0, 6), cor:i % 5 === 0 ? '#FFD447' : '#8FD8FF' }));
  let alvo = null, soltou = 0, primeiroCardume = true;
  el(s, '#oc-agua').addEventListener('pointerdown', e => { const p = c.ponto(e); alvo = { x:p.x, y:p.y, segura:true }; s.setPointerCapture(e.pointerId);
    if (p.y < MAR + 30) { toca('splash'); for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:MAR + 2, t:i * 3, cor:'#E6F6FF' }); } else { toca('glub'); bolhas(p.x, p.y, 2); }
    if (primeiroCardume) { primeiroCardume = false; api.diz('Os peixinhos nadam juntos, em cardume. Eles vão atrás do seu dedo!'); } });
  s.addEventListener('pointermove', e => { if (alvo && alvo.segura) { const p = c.ponto(e); alvo.x = p.x; alvo.y = p.y; } });
  s.addEventListener('pointerup', () => { if (alvo && alvo.segura) { alvo.segura = false; soltou = performance.now(); } });
  c.desenho(ctx => {
    const t = performance.now() / 1000;
    if (alvo && !alvo.segura && performance.now() - soltou > 2600) alvo = null;
    const ax = alvo ? alvo.x : 650 + Math.cos(t * .35) * 110, ay = alvo ? Math.max(MAR + 16, alvo.y) : 222 + Math.sin(t * .6) * 26;
    cardume.forEach((p, i) => {
      const ox = Math.cos(i * 2.4) * (14 + i % 4 * 7), oy = Math.sin(i * 2.4) * (8 + i % 4 * 4);
      p.vx += (ax + ox - p.x) * .003 + Math.sin(t * 3 + p.f) * .04; p.vy += (ay + oy - p.y) * .003;
      const sp = Math.hypot(p.vx, p.vy), max = alvo ? 3.4 : 1.3; if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.vx *= .975; p.vy *= .975; p.x += p.vx; p.y = Math.max(MAR + 12, Math.min(440, p.y + p.vy));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx || .01)); ctx.globalAlpha = .95;
      ctx.fillStyle = p.cor; ctx.strokeStyle = '#1B4E9A'; ctx.lineWidth = 1;
      const ab = Math.sin(t * 14 + p.f) * 2;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-12, -4 + ab); ctx.lineTo(-12, 4 + ab); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 3.6, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0E1A2A'; ctx.beginPath(); ctx.arc(4.6, -.6, 1.1, 0, 7); ctx.fill(); ctx.restore();
    });
    tata.x += (tata.ax - tata.x) * .05; tata.y += (tata.ay - tata.y) * .05;
    const vx = tata.ax - tata.x; if (Math.abs(vx) > 2) tata.vira = vx < 0 ? -1 : 1;
    el(s, '#oc-tata-pos').setAttribute('transform', `translate(${tata.x.toFixed(1)} ${tata.y.toFixed(1)})`);
    el(s, '#oc-tata-vira').setAttribute('transform', tata.vira < 0 ? 'translate(384 0) scale(-1 1)' : '');
  });
  /* jubarte sobe, solta o borrifo e canta */
  let jubOcupada = false;
  el(s, '#oc-jubarte').addEventListener('click', () => {
    [[220, 330], [330, 260], [180, 300], [260, 420]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .7, 'sine', .07, f2), i * 520));
    if (jubOcupada) return; jubOcupada = true;
    const jp = el(s, '#oc-jub-pos'), sobe = jp.animate([{ transform:'translate(0,0)' }, { transform:'translate(0,-136px)' }], { duration:1300, easing:'ease-out', fill:'forwards' });
    sobe.onfinish = () => { if (!vivo) return; toca('splash'); for (let i = 0; i < 22; i++) c.add({ tipo:'vapor', x0:724 + sorte(-4, 4), y0:MAR - 4, x1:724 + sorte(-26, 26), y1:MAR - sorte(50, 80), dur:sorte(30, 50), f:sorte(0, 6), r:sorte(2, 4.5), x:0, y:0 }); for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:700 + i * 16, y:MAR + 2, t:i * 2, cor:'#E6F6FF' });
      api.diz('A baleia precisa subir para respirar ar! Esse jato é o ar saindo do nariz dela, que fica no alto da cabeça.');
      depois(1800, () => { const desce = jp.animate([{ transform:'translate(0,-136px)' }, { transform:'translate(0,0)' }], { duration:1600, easing:'ease-in-out', fill:'forwards' }); desce.onfinish = () => { jubOcupada = false; }; }); };
  });
  /* polvo, caranguejo, águas-vivas, gaivotas e a criança do barco */
  let polvoOcupado = false;
  el(s, '#oc-polvo').addEventListener('click', e => { e.stopPropagation(); if (polvoOcupado) return; polvoOcupado = true; const pin = el(s, '#oc-polvo-in'), peles = s.querySelectorAll('.oc-pele');
    pin.style.transform = 'translateY(-14px)'; toca('pop');
    depois(500, () => { peles.forEach(p => { p.setAttribute('fill', '#8A6E9A'); p.setAttribute('stroke', '#4E3A62'); }); api.diz('O polvo mudou de cor para ficar igual à pedra! Ele se esconde assim.'); });
    depois(3200, () => { peles[0].setAttribute('fill', 'url(#ocPele)'); peles[0].setAttribute('stroke', '#8E2E14'); peles[1].setAttribute('fill', '#C84A2A'); pin.style.transform = ''; polvoOcupado = false; }); });
  let carX = 640, carOcupado = false;
  el(s, '#oc-caranguejo').addEventListener('click', e => { e.stopPropagation(); if (carOcupado) return; carOcupado = true; toca('clique');
    const x0 = carX, x1 = carX > 600 ? sorte(470, 540) : sorte(640, 700), t0 = performance.now(), cin = el(s, '#oc-car-in');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1400); carX = x0 + (x1 - x0) * k; el(s, '#oc-car-pos').setAttribute('transform', `translate(${carX.toFixed(1)} ${(482 - Math.abs(Math.sin(k * 18)) * 2).toFixed(1)})`); cin.setAttribute('transform', `rotate(${(Math.sin(k * 30) * 4).toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else carOcupado = false; })(t0);
    api.diz('O caranguejo anda de lado!'); });
  s.querySelectorAll('.oc-viva').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); toca('glub'); const vin = el(g, '.oc-viva-in');
    vin.animate([{ transform:'translateY(0) scale(1,1)' }, { transform:'translateY(-6px) scale(1.15,.8)' }, { transform:'translateY(-26px) scale(.9,1.12)' }, { transform:'translateY(-30px) scale(1.12,.86)' }, { transform:'translateY(-48px) scale(1,1)' }, { transform:'translateY(0) scale(1,1)' }], { duration:2600, easing:'ease-in-out' });
    api.diz('Uma água-viva! A tartaruga come água-viva, e por isso pode confundir com uma sacola de plástico.'); }));
  el(s, '#oc-gaivotas').addEventListener('click', e => { e.stopPropagation(); [1300, 1600, 1250].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .16, 'triangle', .05, f * .7), i * 180)); });
  el(s, '#oc-crianca').addEventListener('click', e => { e.stopPropagation(); el(s, '#oc-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-30deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 }); toca('pop'); api.diz(fase === 'lixo' ? 'Me passa o lixo que eu guardo no cesto!' : 'Obrigada pela ajuda! Lá na terra o lixo vai para a reciclagem.'); });
  const caus = el(s, '#oc-caus-areia'); caus.animate([{ opacity:.12 }, { opacity:.34 }, { opacity:.12 }], { duration:3800, iterations:Infinity });
  el(s, '#oc-barco').addEventListener('click', e => { if (fase === 'lixo') return; e.stopPropagation(); toca('pop'); api.diz('O lixo vai para a reciclagem na terra.'); });
  el(s, '#oc-ilha').addEventListener('click', e => { if (fase === 'chuva' || fase === 'fim') return; e.stopPropagation(); toca('clique'); api.diz('É uma ilha. O riozinho dela está fraquinho, esperando chuva.'); });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1400) { ultB = t; bolhas(sorte(40, 620), 450, 1); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Lixo no barco: 0/5</span>');
  api.diz('Oi, eu sou a Tata, uma tartaruga-marinha! O mar está com lixo. Arraste cada lixo até o cestinho verde do barco.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 9: Antártica, a água congelada ================= */
function jogoAntartida(palco, api){
  semente = 73;
  let vivo = true, fase = 'gelo', postos = 0, krill = 0, neves = 0, ocupado = false;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const HOR = 200, FRENTE = 330, GT = 196, LY = 310;
  const VAGAS = [252, 336, 420, 504].map(x => ({ x, y:LY, placa:-1 }));
  const NINHO = { x:592, y:LY - 4 }, INICIO = { x:192, y:LY - 2 };
  const PLACAS = [{ x:298, y:238 }, { x:430, y:226 }, { x:548, y:254 }, { x:372, y:270 }];
  const CARDUME = [{ x:252, y:414 }, { x:396, y:452 }, { x:530, y:406 }];
  const borda = (rx, ry, sem) => { semente = sem; return Array.from({ length:14 }, (_, i) => { const a = i / 14 * Math.PI * 2, j = R(.86, 1.06); return `${(Math.cos(a) * rx * j).toFixed(1)},${(Math.sin(a) * ry * j).toFixed(1)}`; }).join(' '); };
  const placa = (rx, ry, sem) => { const b = borda(rx, ry, sem); return `<ellipse cx="0" cy="${ry * .9}" rx="${rx * 1.05}" ry="${ry * .7}" fill="#1E5A9A" opacity=".35"/><g transform="translate(0 8)"><polygon points="${b}" fill="#7FB8E0" stroke="#4E86B8" stroke-width="1.6"/></g><polygon points="${b}" fill="#F6FBFF" stroke="#9ABCD8" stroke-width="1.8" stroke-linejoin="round"/><path d="M${-rx * .55} ${-ry * .25} q${rx * .3} ${-ry * .4} ${rx * .7} ${-ry * .3}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${rx * .2} ${ry * .2} q${rx * .2} ${ry * .2} ${rx * .4} 0" stroke="#CFE6F5" stroke-width="2" fill="none" stroke-linecap="round"/>`; };
  const filhote = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-12" rx="11" ry="13" fill="#9AA4B4" stroke="#4E5A6E" stroke-width="1.6"/><path d="M-8 -16 q-4 -2 -6 2 M8 -16 q4 -2 6 2" stroke="#B8C0CC" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="0" cy="-26" r="8" fill="#2E3446" stroke="#12141E" stroke-width="1.4"/><circle cx="-3" cy="-27" r="1.6" fill="#fff"/><circle cx="3" cy="-27" r="1.6" fill="#fff"/><path d="M-2 -23 l2 3 l2 -3Z" fill="#E86A3A"/><path d="M-6 0 h4 M2 0 h4" stroke="#E86A3A" stroke-width="2" stroke-linecap="round"/></g>`;
  const camada = (y0, h, k) => { const y1 = y0 - h; return `<path d="M0 ${y0 + 2} C50 ${y0 - 8} 120 ${y0 - 4} 178 ${y0 + 6} L176 ${y1 + 6} C120 ${y1 - 4} 50 ${y1 - 8} 0 ${y1}Z" fill="${k % 2 ? '#F4FAFF' : '#FFFFFF'}" stroke="#B8D4EA" stroke-width="1.4"/><g fill="none" stroke="#9CC8EA" stroke-width="1">${Array.from({ length:6 }, () => `<circle cx="${R(10, 168).toFixed(0)}" cy="${(y0 - h / 2 - 4 + R(-3, 3)).toFixed(0)}" r="${R(1.2, 2.4).toFixed(1)}"/>`).join('')}</g>`; };
  semente = 73;
  const camadasGeleira = Array.from({ length:9 }, (_, k) => { const y = GT + 14 + k * 14; return `<path d="M0 ${y} C40 ${y - 4} 90 ${y + 3} 140 ${y - 1} C170 ${y - 3} 200 ${y + 2} 230 ${y}" stroke="#fff" stroke-width="1.4" fill="none" opacity="${(.55 - k * .04).toFixed(2)}"/><g fill="none" stroke="#fff" stroke-width=".9" opacity=".6">${Array.from({ length:4 }, () => `<circle cx="${R(8, 200).toFixed(0)}" cy="${(y + R(3, 10)).toFixed(0)}" r="${R(1, 2).toFixed(1)}"/>`).join('')}</g>`; }).join('');
  const pico = (px, py, w, base, k) => `<path d="M${px - w} ${base} L${px - w * .45} ${py + (base - py) * .45} L${px} ${py} L${px + w * .1} ${base}Z" fill="url(#anLuz${k})"/><path d="M${px} ${py} L${px + w * .55} ${py + (base - py) * .5} L${px + w} ${base} L${px + w * .1} ${base}Z" fill="url(#anSom${k})"/><path d="M${px} ${py} L${px + w * .1} ${base}" stroke="#fff" stroke-width="1.2" opacity=".7"/><path d="M${px - w * .2} ${py + (base - py) * .3} l${w * .1} ${(base - py) * .2} M${px + w * .3} ${py + (base - py) * .35} l${-w * .06} ${(base - py) * .3}" stroke="#9CC0E2" stroke-width="1.4" fill="none" opacity=".8"/>`;
  const seracs = Array.from({ length:7 }, (_, k) => { const x = 120 + k * 13, h = R(30, 70); return `<path d="M${x} ${GT + 8 + k * 8} l6 -6 l7 4 V${GT + 8 + k * 8 + h} H${x}Z" fill="${k % 2 ? '#CBE8F8' : '#E9F6FD'}" stroke="#8CC4EA" stroke-width="1"/>`; }).join('');
  const estrela = (x, y, c) => `<path d="M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y - 2} L${x + 3} ${y + 1} L${x + 5} ${y + 6} L${x} ${y + 3} L${x - 5} ${y + 6} L${x - 3} ${y + 1} L${x - 7} ${y - 2} L${x - 2} ${y - 2}Z" fill="${c}" stroke="#7A1E10" stroke-width="1"/>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Antártica com geleira, placas de gelo, pinguins, foca, iceberg, krill e baleia-azul">
    <defs>
      <linearGradient id="anCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC8F0"/><stop offset=".7" stop-color="#D8EEFB"/><stop offset="1" stop-color="#FFF4E6"/></linearGradient>
      <linearGradient id="anPlano" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AB4DE"/><stop offset="1" stop-color="#2E6EB0"/></linearGradient>
      <linearGradient id="anFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A78BE"/><stop offset=".6" stop-color="#16488A"/><stop offset="1" stop-color="#0A2656"/></linearGradient>
      <linearGradient id="anMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C6DFF2"/></linearGradient>
      <linearGradient id="anLuz0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2EEF8"/></linearGradient><linearGradient id="anSom0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C6DCEE"/><stop offset="1" stop-color="#AFCBE4"/></linearGradient>
      <linearGradient id="anLuz1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6E8F6"/></linearGradient><linearGradient id="anSom1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8C8E6"/><stop offset="1" stop-color="#7EA8D2"/></linearGradient>
      <linearGradient id="anFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6FBFF"/><stop offset=".35" stop-color="#BFE2F7"/><stop offset="1" stop-color="#3E94D2"/></linearGradient>
      <linearGradient id="anSub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0F2" stop-opacity=".75"/><stop offset="1" stop-color="#3E8AC8" stop-opacity=".2"/></linearGradient>
      <linearGradient id="anChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E4E7A"/><stop offset="1" stop-color="#16284A"/></linearGradient>
      <linearGradient id="anHalo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD6B8" stop-opacity="0"/><stop offset="1" stop-color="#FFD6B8" stop-opacity=".55"/></linearGradient>
      <linearGradient id="anSombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8C8E6"/><stop offset="1" stop-color="#7EA8D2"/></linearGradient>
      <linearGradient id="anBerg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#DDF0FB"/><stop offset="1" stop-color="#A8D4F0"/></linearGradient>
      <linearGradient id="anBergBaixo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FDcF6"/><stop offset="1" stop-color="#3E8AC8"/></linearGradient>
      <radialGradient id="anSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#FFE7A0"/><stop offset="1" stop-color="#FFD070"/></radialGradient>
      <radialGradient id="anVinheta" cx=".5" cy=".42" r=".78"><stop offset=".6" stop-color="#0A2050" stop-opacity="0"/><stop offset="1" stop-color="#0A2050" stop-opacity=".3"/></radialGradient>
      <clipPath id="anGelClip"><path d="M0 ${GT} C50 ${GT - 10} 120 ${GT - 6} 178 ${GT + 4} L186 250 L198 296 L210 322 L0 334Z"/></clipPath>
      <filter id="anGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="${HOR + 4}" fill="url(#anCeu)"/>
    <g id="an-sol" class="toque"><circle cx="520" cy="96" r="60" fill="#FFE7A0" opacity=".25"/><circle cx="520" cy="96" r="24" fill="url(#anSolG)"/><circle cx="520" cy="96" r="50" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="300" y="34" width="92" height="40" style="color:#fff" opacity=".85"/><use href="#nuvem" x="640" y="22" width="70" height="32" style="color:#fff" opacity=".7"/></g>
    <g class="voando" style="animation-duration:16s"><path d="M0 60 q7 -7 14 0 q7 -7 14 0" stroke="#3E4A6A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M30 76 q5 -5 10 0 q5 -5 10 0" stroke="#3E4A6A" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <rect y="${HOR - 70}" width="800" height="74" fill="url(#anHalo)"/>
    <g opacity=".75">${[[250, 128, 70], [340, 112, 80], [450, 132, 70], [600, 120, 90], [720, 110, 90]].map(([x, y, w]) => pico(x, y, w, HOR + 2, 0)).join('')}</g>
    <g>${[[220, 150, 60], [300, 138, 70], [400, 158, 60], [560, 146, 70], [660, 140, 80], [770, 154, 60]].map(([x, y, w]) => pico(x, y, w, HOR + 2, 1)).join('')}</g>
    <path d="M140 ${HOR + 2} C300 ${HOR - 6} 500 ${HOR - 4} 800 ${HOR - 2} V${HOR + 3} H140Z" fill="#F4FAFF"/>
    <path d="M0 ${HOR} H800 V${FRENTE} H0Z" fill="url(#anPlano)"/>
    <g stroke="#CFE6F5" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round">${Array.from({ length:20 }, () => { const x = R(200, 780), y = R(HOR + 8, FRENTE - 6); const w = 10 + (y - HOR) * .2; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} h${w.toFixed(0)}"/>`; }).join('')}</g>
    <g fill="#FFF6DC">${Array.from({ length:16 }, (_, i) => `<rect class="brilho" style="animation-delay:${(i * .41 % 2.4).toFixed(2)}s" x="${(520 - (6 + i * 2.4) + (i * 37) % (12 + i * 4)).toFixed(0)}" y="${(HOR + 6 + i * 7).toFixed(0)}" width="${(8 + i % 3 * 5)}" height="2" rx="1"/>`).join('')}</g>
    <g fill="#fff" opacity=".9">${[[620, 214, 14], [700, 222, 10], [250, 210, 9]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.6}" ry="${r * .35}"/>`).join('')}</g>
    <g id="an-vagas">${VAGAS.map(v => `<ellipse class="an-vaga" cx="${v.x}" cy="${v.y + 2}" rx="38" ry="11" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-width="2.4" stroke-dasharray="7 6"/>`).join('')}</g>
    <g id="an-geleira" class="toque">
      <path d="M0 ${FRENTE} L214 ${FRENTE} C210 360 196 392 160 410 C110 424 50 418 0 410Z" fill="url(#anSub)" stroke="#BFE6FF" stroke-width="1.4" opacity=".9"/>
      <g clip-path="url(#anGelClip)"><rect x="0" y="${GT - 12}" width="230" height="160" fill="url(#anFace)"/>${camadasGeleira}<g fill="#7EC0EA" opacity=".45">${[40, 78, 112, 146, 172].map((x, k) => `<path d="M${x} ${GT + 14} C${x + 4} ${GT + 50} ${x - 3} ${GT + 90} ${x + 2} ${FRENTE}" stroke="#4E9AD6" stroke-width="${3 + k % 2 * 2}" fill="none"/>`).join('')}</g><path d="M150 ${GT + 30} L156 280 M128 ${GT + 40} L132 250 M176 ${GT + 40} L182 300 M100 ${GT + 60} L104 300" stroke="#5EA8DC" stroke-width="2" opacity=".5"/><path d="M178 ${GT + 4} L186 250 L198 296 L210 322" stroke="#3E8AC8" stroke-width="12" opacity=".18" fill="none"/></g>
      <path d="M-4 ${GT + 2} C40 ${GT - 14} 120 ${GT - 12} 182 ${GT + 2} C176 ${GT + 10} 150 ${GT + 8} 130 ${GT + 12} C100 ${GT + 6} 60 ${GT + 12} 30 ${GT + 8} C14 ${GT + 10} 4 ${GT + 8} -4 ${GT + 8}Z" fill="#fff" stroke="#BCD8EE" stroke-width="1.4"/>
      <g fill="#E6F6FF" stroke="#9CC8EA" stroke-width=".8">${[30, 60, 92, 130, 160].map(x => `<path d="M${x} ${GT + 9} l3 ${(9 + x % 7).toFixed(0)} l3 ${-(9 + x % 7).toFixed(0)}Z"/>`).join('')}</g>
      <path d="M0 ${GT} C50 ${GT - 10} 120 ${GT - 6} 178 ${GT + 4} L186 250 L198 296 L210 322" stroke="#7EA8D2" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
      <g id="an-camadas">${[0, 1, 2].map(k => `<g class="an-camada" style="opacity:0;transition:opacity 1s, transform 1s;transform:translateY(-14px)">${camada(GT - k * 12, 12, k)}</g>`).join('')}</g>
      <text x="16" y="284" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#2E5A8A" stroke="#fff" stroke-width="3" paint-order="stroke">geleira</text>
    </g>
    <g transform="translate(118 ${LY + 6})">${placa(96, 14, 5)}</g>
    <g id="an-foca" class="toque" data-fig="foca"><svg x="52" y="${LY - 30}" width="96" height="58" viewBox="0 0 150 90"><use href="#f-foca"/></svg>${brilhoHotspot(132, LY - 26)}</g>
    <g id="an-ninho" transform="translate(${NINHO.x} ${LY + 4})">${placa(60, 17, 9)}</g>
    <g id="an-filhotes">${[[552, LY], [574, LY + 3]].map(([x, y], i) => `<g class="an-filhote"><g style="animation:flutua ${(1.6 + i * .3).toFixed(1)}s ease-in-out infinite alternate">${filhote(x, y, 1)}</g></g>`).join('')}</g>
    <g id="an-adulto" class="toque" data-fig="pinguim"><svg x="618" y="${LY - 56}" width="38" height="56" viewBox="0 0 90 130"><use href="#f-pinguim"/></svg>${brilhoHotspot(650, LY - 50)}</g>
    <g id="an-berg" class="toque"><path d="M660 ${FRENTE} L668 254 L690 214 L712 178 L736 196 L760 168 L786 204 L800 214 V${FRENTE}Z" fill="url(#anBerg)" stroke="#8CB8DE" stroke-width="2" stroke-linejoin="round"/><path d="M712 178 L720 ${FRENTE} M760 168 L752 ${FRENTE}" stroke="#B8D8F0" stroke-width="2"/><path d="M690 214 L700 300 L668 ${FRENTE}Z" fill="#B8DCF4" opacity=".6"/><path d="M736 196 L748 260 L760 168Z M760 168 L770 290 L800 214Z" fill="#9ACDF0" opacity=".55"/><path d="M712 178 L736 196 L760 168 L786 204 C770 196 756 190 744 200 C730 192 720 186 712 178Z" fill="#fff"/><path d="M728 230 l6 30 l-4 26" stroke="#5EAEE0" stroke-width="2.4" fill="none" opacity=".6"/><path d="M662 ${FRENTE - 2} C700 ${FRENTE - 8} 760 ${FRENTE - 6} 800 ${FRENTE - 4}" stroke="#fff" stroke-width="3" stroke-dasharray="8 5" fill="none"/><path d="M684 230 q14 -30 26 -44" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="an-berg-hint" style="display:none">${brilhoHotspot(730, 200)}</g></g>
    <rect y="${FRENTE}" width="800" height="${500 - FRENTE}" fill="url(#anFundo)"/>
    <g opacity=".35">${[[90, 50], [300, 60], [520, 40]].map(([x, w]) => `<path d="M${x} ${FRENTE} L${x + w} ${FRENTE} L${x + w * 2} 500 L${x - w * .6} 500Z" fill="#fff" opacity=".18"/>`).join('')}</g>
    <path d="M0 482 C80 474 160 480 240 476 C330 472 420 482 520 476 C580 472 620 478 650 480 V500 H0Z" fill="url(#anChao)"/>
    <g fill="#3E5E8A">${[[40, 482, 14], [180, 478, 10], [300, 478, 16], [470, 480, 12], [600, 478, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .5}"/>`).join('')}</g>
    ${estrela(110, 486, '#E5603C')}${estrela(380, 484, '#FF8A5A')}${estrela(560, 482, '#E5603C')}
    <g>${[[230, 478], [250, 480], [440, 478]].map(([x, y]) => `<path d="M${x - 6} ${y} C${x - 7} ${y - 14} ${x - 3} ${y - 22} ${x} ${y - 24} C${x + 3} ${y - 22} ${x + 7} ${y - 14} ${x + 6} ${y}Z" fill="#F2E6B8" stroke="#A8925A" stroke-width="1.2"/><ellipse cx="${x}" cy="${y - 22}" rx="3" ry="1.4" fill="#A8925A"/>`).join('')}</g>
    <g opacity=".85">${[[120, 370, 1], [146, 382, .8], [600, 360, .9]].map(([x, y, k], i) => `<g style="animation:flutua ${(3 + i * .7).toFixed(1)}s ease-in-out infinite alternate"><g transform="translate(${x} ${y}) scale(${k})"><path d="M-14 0 C-8 -6 6 -6 14 0 C6 6 -8 6 -14 0Z M-14 0 l-7 -5 v10Z" fill="#E6F6FF" fill-opacity=".7" stroke="#8CC4EA" stroke-width="1"/><circle cx="8" cy="-1" r="1.6" fill="#1E3460"/></g></g>`).join('')}</g>
    <g id="an-berg-baixo" class="toque" style="opacity:.14;transition:opacity 1.6s"><path d="M660 ${FRENTE} L640 372 L652 420 L636 466 L676 494 L760 498 L800 480 V${FRENTE}Z" fill="url(#anBergBaixo)" stroke="#E6F6FF" stroke-width="2.2" stroke-linejoin="round"/><path d="M662 344 l-10 30 M690 420 l20 40 M740 360 l10 50" stroke="#E6F6FF" stroke-width="1.6" opacity=".7"/></g>
    <g id="an-cardumes">${CARDUME.map((k, i) => { semente = 30 + i; return `<g class="an-krill toque" data-i="${i}" data-fig="krill" style="transform-origin:${k.x}px ${k.y}px;transition:transform 1s, opacity 1s"><g style="animation:flutua ${(2.4 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${Array.from({ length:16 }, () => { const x = k.x + R(-40, 40), y = k.y + R(-18, 18), a = R(-30, 30); return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)})"><path d="M-5 0 C-3 -3 3 -3 6 0 C3 2 -3 2 -5 0Z M-5 0 l-3 -2 l0 4Z" fill="#FF8A5A" stroke="#B84A20" stroke-width=".6"/></g>`; }).join('')}</g><g class="an-hint" style="display:none">${brilhoHotspot(k.x + 30, k.y - 20)}</g><ellipse cx="${k.x}" cy="${k.y}" rx="52" ry="30" fill="transparent"/></g>`; }).join('')}</g>
    <g id="an-baleia" class="toque" data-fig="baleiaazul" style="display:none"><g id="an-baleia-pos"><g style="animation:flutua 6s ease-in-out infinite alternate"><svg x="0" y="0" width="250" height="118" viewBox="0 0 170 80" style="overflow:visible"><g transform="translate(170 0) scale(-1 1)"><use href="#f-baleiaazul"/></g></svg></g></g></g>
    <path d="M0 ${FRENTE} ${Array.from({ length:40 }, () => 'q10 -3 20 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.4" fill="none"/>
    <g id="an-placas">${PLACAS.map((p, i) => `<g class="an-placa toque" data-i="${i}" transform="translate(${p.x} ${p.y})" style="cursor:grab"><g style="animation:flutua ${(2.8 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${placa(38, 11, 20 + i)}</g><ellipse cx="0" cy="2" rx="46" ry="20" fill="transparent"/></g>`).join('')}</g>
    <g id="an-neve" class="toque" data-fig="pinguim" transform="translate(${INICIO.x} ${INICIO.y})"><g id="an-neve-in"><svg x="-18" y="-52" width="36" height="52" viewBox="0 0 90 130"><use href="#f-pinguim"/></svg><path d="M-10 -40 q10 -6 20 0" stroke="#FFC83D" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
    <g id="an-mao"><path d="M316 252 C300 278 270 296 256 300" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M252 302 l6 -12 l8 9Z" fill="#fff"/></g>
    <g id="an-nuvem" class="toque" style="opacity:0;pointer-events:none;transition:opacity 1s"><use href="#nuvem" x="20" y="40" width="170" height="80" style="color:#8A97B4"/><use href="#nuvem" x="26" y="42" width="160" height="74" style="color:#E8EEF6"/><use href="#nuvem" x="50" y="70" width="110" height="44" style="color:#C2CCDE"/><path d="M58 70 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g id="an-nuvem-hint">${brilhoHotspot(170, 56)}</g><rect x="20" y="40" width="170" height="80" fill="transparent"/></g>
    <rect width="800" height="500" fill="url(#anVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#anGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#an-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.8, 1.8), r:sorte(2, 4.5), topo:FRENTE + 4, f:sorte(0, 6) }); };
  /* 1. gelo: montar o caminho de placas de gelo até os filhotes */
  const pl = [...s.querySelectorAll('.an-placa')], pos = PLACAS.map(p => ({ x:p.x, y:p.y, vaga:-1 }));
  const poe = i => pl[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  pl.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'gelo' || pos[i].vaga >= 0 || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(230, Math.min(560, p.x - arr.dx)); pos[arr.i].y = Math.max(HOR + 18, Math.min(LY, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; pl[i].style.cursor = 'grab';
    const livres = VAGAS.map((v, k) => k).filter(k => VAGAS[k].placa < 0);
    let melhor = -1, dmin = moveu ? 72 : 1e9;
    livres.forEach(k => { const d = Math.hypot(pos[i].x - VAGAS[k].x, pos[i].y - VAGAS[k].y); if (d < dmin) { dmin = d; melhor = k; } });
    if (melhor >= 0) encaixa(i, melhor); else { toca('glub'); api.diz('Coloque a placa de gelo em cima de um tracejado.'); }
  });
  function desliza(i, x1, y1, ms, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e; poe(i); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function encaixa(i, k){
    VAGAS[k].placa = i; pos[i].vaga = k; pl[i].style.cursor = 'default';
    desliza(i, VAGAS[k].x, VAGAS[k].y, 500, () => {
      postos++; toca('pop'); c.add({ tipo:'respingo', x:VAGAS[k].x, y:VAGAS[k].y + 10, t:0, cor:'#E6F6FF' }); c.brilhos(VAGAS[k].x, VAGAS[k].y - 6, 4, '#FFFFFF');
      s.querySelectorAll('.an-vaga')[k].style.display = 'none';
      api.hud(`<span class="chip">Caminho de gelo: ${postos}/4</span>`);
      if (postos === 2) api.diz('Isso! O gelo flutua na água do mar.');
      if (postos === 4) atravessa();
    });
  }
  const neve = el(s, '#an-neve'), neveIn = el(s, '#an-neve-in');
  let nx = INICIO.x, ny = INICIO.y;
  function pula(x1, y1, ms, alto, fim){
    const x0 = nx, y0 = ny, t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); nx = x0 + (x1 - x0) * e; ny = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * alto; neve.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0);
  }
  function atravessa(){
    fase = 'pulando'; api.diz('O caminho ficou pronto! Lá vou eu!');
    const rota = [...VAGAS.map(v => ({ x:v.x, y:v.y - 4 })), { x:NINHO.x + 6, y:NINHO.y }];
    let k = 0;
    (function prox(){ if (k >= rota.length) return chegou(); const p = rota[k++]; pula(p.x, p.y, 520, 26, () => { toca('clique'); depois(120, prox); }); })();
  }
  function chegou(){
    toca('vitoria'); c.brilhos(NINHO.x, NINHO.y - 30, 10, '#FFE27A');
    s.querySelectorAll('.an-filhote').forEach((f, i) => f.animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }], { duration:400, iterations:3, delay:i * 150 }));
    api.diz('Cheguei nos meus filhotes! Eles estão com fome.');
    depois(3600, comecaIceberg);
  }
  /* 2. iceberg e krill */
  function comecaIceberg(){
    fase = 'iceberg'; el(s, '#an-berg-hint').style.display = '';
    api.hud('<span class="chip">Descubra o iceberg</span>');
    api.diz('Viu aquele iceberg? Toque nele para descobrir um segredo.');
  }
  const revela = () => {
    if (fase !== 'iceberg') return; fase = 'revelado'; el(s, '#an-berg-hint').style.display = 'none';
    el(s, '#an-berg-baixo').style.opacity = 1; toca('glub'); bolhas(720, 420, 8); c.brilhos(720, 400, 8, '#E6F6FF');
    api.diz('Uau! A maior parte do iceberg fica escondida debaixo da água. E ele é de água doce, que se soltou de uma geleira.');
    depois(5600, comecaKrill);
  };
  el(s, '#an-berg').addEventListener('click', e => { e.stopPropagation(); if (fase === 'iceberg') return revela(); toca('clique'); api.diz('É um iceberg, um pedaço de geleira que flutua no mar.'); });
  el(s, '#an-berg-baixo').addEventListener('click', e => { e.stopPropagation(); if (fase === 'iceberg') revela(); });
  function comecaKrill(){
    fase = 'krill'; s.querySelectorAll('.an-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Comida para os filhotes: 0/3</span>');
    api.diz('Esses pontinhos laranja são krill, bichinhos do mar. Toque neles para eu mergulhar e pegar comida!');
  }
  function nada(x1, y1, ms, fim){
    const x0 = nx, y0 = ny, t0 = performance.now(), ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI + 90;
    neveIn.setAttribute('transform', `translate(0 -26) rotate(${ang.toFixed(0)}) translate(0 26)`);
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); nx = x0 + (x1 - x0) * e; ny = y0 + (y1 - y0) * e; neve.setAttribute('transform', `translate(${nx.toFixed(1)} ${ny.toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0);
  }
  s.querySelectorAll('.an-krill').forEach(g => g.addEventListener('click', e => {
    if (fase !== 'krill' || ocupado || g.dataset.feito) { if (fase !== 'krill') { toca('glub'); api.diz('É krill! Pequenininho, mas é a comida mais importante daqui.'); } return; }
    g.dataset.feito = 1; ocupado = true; el(g, '.an-hint').style.display = 'none';
    const k = CARDUME[+g.dataset.i]; toca('splash');
    pula(NINHO.x - 30, FRENTE + 6, 500, 30, () => {
      c.add({ tipo:'respingo', x:nx, y:FRENTE, t:0, cor:'#E6F6FF' }); bolhas(nx, FRENTE + 20, 4);
      nada(k.x, k.y, 900, () => {
        toca('glub'); bolhas(k.x, k.y, 6); g.style.transform = 'scale(.45)'; g.style.opacity = .55;
        nada(NINHO.x - 30, FRENTE + 6, 900, () => {
          neveIn.removeAttribute('transform');
          pula(NINHO.x + 6, NINHO.y, 500, 30, () => {
            krill++; ocupado = false; toca('pop'); c.brilhos(NINHO.x - 20, NINHO.y - 30, 5, '#FF8A5A');
            api.hud(`<span class="chip">Comida para os filhotes: ${krill}/3</span>`);
            if (krill === 1) api.diz('Hum! Pinguins, focas e baleias comem krill.');
            if (krill === 3) baleia();
          });
        });
      });
    });
  }));
  function baleia(){
    fase = 'baleia'; const b = el(s, '#an-baleia'), bp = el(s, '#an-baleia-pos'); b.style.display = '';
    api.diz('Os filhotes estão de barriga cheia! Olha quem chegou para comer krill também: a baleia-azul, o maior animal do mundo!');
    [[110, 90], [90, 70]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, 1.1, 'sine', .08, f2), i * 900));
    const t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 6500), e = 1 - Math.pow(1 - k, 3); bp.setAttribute('transform', `translate(${(820 - 640 * e).toFixed(1)} 368)`); if (k < 1) requestAnimationFrame(q); })(t0);
    depois(6800, comecaNeve);
  }
  /* 3. neve: a neve se acumula e vira o gelo da geleira */
  function comecaNeve(){
    fase = 'neve'; const n = el(s, '#an-nuvem'); n.style.opacity = 1; n.style.pointerEvents = '';
    api.hud('<span class="chip">Neve na geleira: 0/3</span>');
    api.diz('Chegou uma nuvem de neve! Toque nela para nevar em cima da geleira.');
  }
  el(s, '#an-nuvem').addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'neve' || ocupado || neves >= 3) return;
    ocupado = true; const k = neves; toca('chuva'); el(s, '#an-nuvem-hint').style.display = 'none';
    for (let i = 0; i < 46; i++) c.add({ tipo:'floco', t:0, x:sorte(20, 180), y:sorte(90, 110) - i * 4, vy:sorte(.8, 1.4), f:sorte(0, 6), r:sorte(2, 3.6), chao:GT - k * 12 + sorte(-6, 4) });
    depois(2600, () => {
      const cam = s.querySelectorAll('.an-camada')[k]; cam.style.opacity = 1; cam.style.transform = 'translateY(0)';
      neves++; ocupado = false; toca('planta'); c.brilhos(90, GT - k * 12 - 6, 6, '#FFFFFF');
      api.hud(`<span class="chip">Neve na geleira: ${neves}/3</span>`);
      if (neves === 1) api.diz('Aqui quase não derrete. A neve de um ano fica em cima da neve do outro.');
      if (neves === 2) api.diz('As camadas de baixo vão ficando apertadas e viram gelo, com bolhinhas de ar presas dentro.');
      if (neves === 3) { fase = 'fim'; toca('vitoria'); el(s, '#an-nuvem').style.opacity = 0; api.diz('A maior parte da água doce do planeta está congelada, e quase todo esse gelo fica aqui na Antártica. Esse gelo levou milhares de anos para se formar!'); depois(6400, api.fim); }
    });
  });
  /* toques extras */
  el(s, '#an-foca').addEventListener('click', () => { toca('glub'); api.diz('A foca-de-weddell abre buracos no gelo com os dentes para respirar.'); });
  el(s, '#an-adulto').addEventListener('click', () => { [880, 700, 880].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .14, 'sawtooth', .03, f * .8), i * 170)); });
  el(s, '#an-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(520, 96, 6, '#FFE7A0'); api.diz('Na Antártica o sol fica baixinho. No verão quase não escurece, e no inverno quase não aparece!'); });
  el(s, '#an-geleira').addEventListener('click', e => { if (fase === 'neve') return; e.stopPropagation(); toca('clique'); api.diz('Uma geleira é um rio de gelo bem lento. Ela foi feita de neve, camada por camada.'); });
  neve.addEventListener('click', () => { if (fase === 'gelo') api.diz('Monte o caminho de gelo para eu chegar nos meus filhotes!'); });
  let ultN = 0;
  (function vida(t){ if (!vivo) return; if (t - ultN > 260) { ultN = t; c.add({ tipo:'floco', x:sorte(0, 800), y:-6, vy:sorte(.5, 1), f:sorte(0, 6), r:sorte(1.4, 3), chao:sorte(220, 480) }); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Caminho de gelo: 0/4</span>');
  api.diz('Oi, eu sou a Neve, uma pinguim! Meus filhotes estão do outro lado. Arraste as placas de gelo para os tracejados e monte um caminho.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 10: Andes e Himalaia, as caixas-d'água das montanhas ================= */
function jogoAndes(palco, api){
  semente = 83;
  let vivo = true, fase = 'neve', neves = 0, ocupado = false, derr = 0, marco = 0, abertos = 0;
  let geloY = 182, geloAlvo = 182;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const LAGO = { x:470, y:318 }, SOL0 = { x:70, y:104 }, SOL1 = { x:730, y:104 };
  const solXY = u => ({ x:SOL0.x + (SOL1.x - SOL0.x) * u, y:SOL0.y - 300 * u * (1 - u) });
  const NUVENS = [{ x:296, y:34, a:236, b:362, chao:[70, 130] }, { x:438, y:58, a:390, b:486, chao:[96, 150] }, { x:690, y:52, a:620, b:770, chao:[110, 170] }];
  const LINHAS = [{ y:336, x0:596 }, { y:378, x0:564 }, { y:420, x0:532 }];
  const PORTAS = [{ x:578, y:344 }, { x:552, y:384 }, { x:524, y:426 }, { x:470, y:462 }];
  /* terraços curvos: cada um tem borda de trás, borda da frente e pé do muro (curvas de Bézier que seguem o morro) */
  const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const TX = L => [L.x0, L.x0 + 90, 700, 800], TB = L => [L.y, L.y + 27, L.y + 13, L.y - 12], TF = L => [L.y + 20, L.y + 47, L.y + 31, L.y + 8], TW = L => [L.y + 36, L.y + 63, L.y + 47, L.y + 24];
  const curva = (xs, ys, dx) => `C${xs[1] + (dx || 0)} ${ys[1]} ${xs[2]} ${ys[2]} ${xs[3]} ${ys[3]}`;
  const RAMOS = [...LINHAS.map((L, i) => { const P = PORTAS[i]; return `M${P.x} ${P.y} Q${P.x + 10} ${L.y + 5} ${L.x0 + 8} ${L.y + 4} C${L.x0 + 90} ${L.y + 32} 700 ${L.y + 18} 798 ${L.y - 7}`; }), 'M470 462 Q450 466 426 472'];
  const CANAL = 'M552 322 Q576 328 578 344 Q580 364 552 384 Q528 402 524 426 Q518 452 470 462';
  const f1 = n => n.toFixed(1);
  /* linha central da língua de gelo: desce do circo (alto, à esquerda) em S suave rumo ao lago; afina até a frente */
  const GX = yy => { const s = (yy - 150) / 140; return 340 + 56 * s + 9 * Math.sin(6.283 * s); }, GW = yy => 26 - 13 * (yy - 150) / 140;
  const GD = yy => (GX(yy + 1) - GX(yy - 1)) / 2;
  const faixa = (y0, y1, a0, a1, b0, b1, ond) => { const E = [], D = []; for (let yy = y0; yy <= y1; yy += 6) { const k = (yy - y0) / (y1 - y0), w = GW(yy); E.push(`${f1(GX(yy) - w * a0 - a1 + ond * Math.sin(yy * .37))} ${yy}`); D.push(`${f1(GX(yy) + w * b0 + b1 + ond * Math.sin(yy * .29 + 2))} ${yy}`); } return `M${E.join(' L')} L${D.reverse().join(' L')}Z`; };
  const ichu = (x, y, h, c1, c2) => { let d = ''; for (let i = 0; i < 11; i++) { const a = -1.15 + i * .23, L = h * R(.7, 1.1); d += `M${(x + (i - 5) * 1.2).toFixed(1)} ${y} Q${(x + Math.sin(a) * L * .4).toFixed(1)} ${(y - L * .6).toFixed(1)} ${(x + Math.sin(a) * L).toFixed(1)} ${(y - Math.cos(a) * L).toFixed(1)} `; } return `<g class="balanca" style="animation-duration:${R(3.5, 5.5).toFixed(1)}s;animation-delay:${R(-4, 0).toFixed(1)}s;transform-origin:${x}px ${y}px"><ellipse cx="${x}" cy="${y}" rx="${(h * .32).toFixed(1)}" ry="${(h * .07).toFixed(1)}" fill="#3A3A12" opacity=".25"/><path d="${d}" stroke="${c2}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c1}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${x - 2} ${y - h * .2} q2 ${f1(-h * .35)} 6 ${f1(-h * .6)}" stroke="#FFF6CC" stroke-width="1" fill="none" opacity=".7" stroke-linecap="round"/></g>`; };
  const tufo = (x, y, s, c1, c2) => `<path d="M${x - 3 * s} ${y} q-1 ${f1(-5 * s)} -3 ${f1(-7 * s)} M${x} ${y} q0 ${f1(-6 * s)} 1 ${f1(-9 * s)} M${x + 3 * s} ${y} q1 ${f1(-4 * s)} 4 ${f1(-6 * s)}" stroke="${c2}" stroke-width="${f1(2 * s)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q0 ${f1(-6 * s)} 1 ${f1(-9 * s)} M${x + 3 * s} ${y} q1 ${f1(-4 * s)} 4 ${f1(-6 * s)}" stroke="${c1}" stroke-width="${f1(.9 * s)}" fill="none" stroke-linecap="round"/>`;
  const pedra = (x, y, rx, ry, id) => `<path d="M${x - rx} ${y} C${x - rx} ${y - ry * .9} ${x - rx * .4} ${y - ry * 1.15} ${x + rx * .1} ${y - ry} C${x + rx * .7} ${y - ry * 1.05} ${x + rx} ${y - ry * .5} ${x + rx} ${y}Z" fill="url(#${id || 'adPedra'})" stroke="#4A3E44" stroke-width="1.8"/><path d="M${x + rx * .15} ${y - ry * .95} C${x + rx * .6} ${y - ry * .8} ${x + rx * .85} ${y - ry * .4} ${x + rx * .9} ${y}" stroke="#4E4250" stroke-width="2" fill="none" opacity=".35"/><path d="M${x - rx * .7} ${y - ry * .6} q${rx * .3} ${-ry * .4} ${rx * .7} ${-ry * .38}" stroke="#E6DCD6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="${f1(x - rx * .2)}" cy="${f1(y - ry * .45)}" r="${f1(Math.max(1, rx * .12))}" fill="#E8A83A" opacity=".75"/><circle cx="${f1(x + rx * .35)}" cy="${f1(y - ry * .3)}" r="${f1(Math.max(.8, rx * .08))}" fill="#C8D66A" opacity=".7"/>`;
  const flor = (x, y, r, cor, esc, miolo) => `<g>${[0, 1, 2, 3, 4].map(k => { const a = k * 1.2566 - 1.57; return `<ellipse cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" rx="${(r * .78).toFixed(1)}" ry="${(r * .55).toFixed(1)}" transform="rotate(${(a * 57.3 + 90).toFixed(0)} ${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)})" fill="${cor}" stroke="${esc}" stroke-width=".8"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${(r * .5).toFixed(1)}" fill="${miolo || '#FFD447'}" stroke="#B07A08" stroke-width=".6"/></g>`;
  const lupino = (x, y, h) => `<path d="M${x} ${y} V${y - h}" stroke="#3E6A3A" stroke-width="1.6"/>${Array.from({ length:6 }, (_, i) => `<ellipse cx="${x + (i % 2 ? 2.4 : -2.4)}" cy="${(y - h + 3 + i * h / 9).toFixed(1)}" rx="${(2 + i * .35).toFixed(1)}" ry="1.8" fill="${i < 2 ? '#C8A8F0' : '#8E5AD0'}" stroke="#4E2A8A" stroke-width=".6"/>`).join('')}<path d="M${x - 8} ${y} q4 -6 8 -2 q4 -4 8 2" fill="#5E9A4A" stroke="#2E5A2A" stroke-width=".8"/>`;
  /* almofada de yareta: planta-almofada verde-viva do altiplano */
  const yareta = (x, y, r) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="${f1(r * 1.1)}" ry="${f1(r * .3)}" fill="#3A3A14" opacity=".25"/><path d="${copa(x, y - r * .45, r, r * .55, 10, .18)}" fill="url(#adYareta)" stroke="#2E5A1E" stroke-width="1.3"/><g fill="#C8F07A" opacity=".75">${Array.from({ length:Math.round(r * .9) }, () => `<circle cx="${f1(x + R(-r * .75, r * .75))}" cy="${f1(y - r * .45 + R(-r * .35, r * .25))}" r="${f1(R(.7, 1.3))}"/>`).join('')}</g><path d="M${f1(x - r * .6)} ${f1(y - r * .75)} q${f1(r * .4)} ${f1(-r * .3)} ${f1(r * .9)} ${f1(-r * .2)}" stroke="#E6FFB0" stroke-width="1.4" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  /* puya: roseta espinhosa com espiga alta */
  const puya = (x, y, h) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="18" ry="4" fill="#3A3A14" opacity=".3"/>${Array.from({ length:13 }, (_, i) => { const a = -1.45 + i * .242, L = R(14, 20); return `<path d="M${x} ${y - 4} Q${f1(x + Math.sin(a) * L * .5)} ${f1(y - 6 - Math.cos(a) * L * .5)} ${f1(x + Math.sin(a) * L)} ${f1(y - 3 - Math.cos(a) * L * .75)}" stroke="#4A6A5A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y - 4} Q${f1(x + Math.sin(a) * L * .5)} ${f1(y - 6 - Math.cos(a) * L * .5)} ${f1(x + Math.sin(a) * L)} ${f1(y - 3 - Math.cos(a) * L * .75)}" stroke="#9EC2A8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`; }).join('')}<path d="M${x - 5} ${y - 12} C${x - 7} ${y - h * .5} ${x - 5} ${y - h * .9} ${x} ${y - h} C${x + 5} ${y - h * .9} ${x + 7} ${y - h * .5} ${x + 5} ${y - 12}Z" fill="url(#adPuya)" stroke="#5E6A3A" stroke-width="1.3"/><g fill="#F6F0C8" stroke="#A8A060" stroke-width=".5">${Array.from({ length:16 }, (_, k) => `<circle cx="${f1(x + (k % 2 ? 2.4 : -2.4))}" cy="${f1(y - 16 - k * (h - 22) / 16)}" r="1.5"/>`).join('')}</g><path d="M${x - 3} ${y - 16} C${x - 4} ${y - h * .5} ${x - 3} ${y - h * .85} ${x} ${y - h + 4}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5"/></g>`;
  /* casa de adobe com fachada, lateral em perspectiva, empena e telhado de palha (ichu) ou de telha */
  const casa = (x, y, w, h, telha, tesc, palha) => {
    const L = x - w / 2, D = x + w / 2, d = w * .32, dy = d * .45, rh = w * .36, topo = y - h - dy / 2 - rh;
    const A = [L - 5, y - h + 3], B = [D + 3, y - h + 3], C = [D + d / 2 + 1, topo], E = [L - 5 + d / 2, topo];
    const tij = Array.from({ length:Math.floor(h / 5) }, (_, k) => { const yy = y - 6 - k * 5; let s = `M${L + 1} ${yy}H${D - 1}`; for (let xx = L + (k % 2 ? 4 : 8); xx < D - 2; xx += 9) s += `M${f1(xx)} ${yy}v-5`; return s; }).join('');
    const tlinhas = palha ? Array.from({ length:Math.floor(w / 3.2) }, (_, k) => { const t = k / Math.floor(w / 3.2), xa = A[0] + (B[0] - A[0]) * t, xb = E[0] + (C[0] - E[0]) * t; return `M${f1(xa + R(-1, 1))} ${f1(A[1] + R(0, 2))}L${f1(xb)} ${topo + 1}`; }).join('')
      : Array.from({ length:4 }, (_, k) => { const t = (k + 1) / 5, ya = A[1] + (topo - A[1]) * t, xa = A[0] + (E[0] - A[0]) * t, xb = B[0] + (C[0] - B[0]) * t; let s = `M${f1(xa)} ${f1(ya)}`; for (let xx = xa; xx < xb - 4; xx += 5) s += ` q2.5 3 5 0`; return s; }).join('');
    const franja = palha ? `<path d="M${A[0]} ${A[1]} ${Array.from({ length:Math.floor((B[0] - A[0]) / 3) }, (_, k) => `L${f1(A[0] + k * 3 + 1.5)} ${f1(A[1] + 2 + (k % 2) * 2.2)}`).join(' ')} L${B[0]} ${B[1]}Z" fill="${telha}" stroke="${tesc}" stroke-width="1"/>` : '';
    return `<g><ellipse cx="${f1(x + d * .4)}" cy="${y + 1}" rx="${f1(w * .72)}" ry="5" fill="#3A2E1E" opacity=".28"/>
      <path d="M${D} ${y} L${f1(D + d)} ${f1(y - dy)} V${f1(y - dy - h)} L${D} ${y - h}Z" fill="url(#adAdobeLado)" stroke="#6E4428" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M${D} ${y - h} L${f1(D + d / 2)} ${f1(topo)} L${f1(D + d)} ${f1(y - dy - h)}Z" fill="url(#adAdobeLado)" stroke="#6E4428" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M${D + 2} ${y - 4} L${f1(D + d - 2)} ${f1(y - dy - 4)}" stroke="#8E7E76" stroke-width="3"/>
      <path d="M${L} ${y} V${y - h} H${D} V${y}Z" fill="url(#adAdobe)" stroke="#7A4E2E" stroke-width="1.6"/>
      <path d="${tij}" stroke="#B88A5C" stroke-width=".8" opacity=".45" fill="none"/>
      <path d="M${L + 4} ${y - h + 10} q4 -3 9 -1 q3 4 -1 7 q-6 2 -8 -6Z" fill="#F8E2BE" opacity=".7"/>
      <path d="M${L} ${y - 5} H${D} V${y}H${L}Z" fill="url(#adPedra)" stroke="#5E5258" stroke-width="1"/><path d="M${L + 6} ${y - 5}v5M${L + 15} ${y - 5}v5M${L + 25} ${y - 5}v5M${L + 34} ${y - 5}v5" stroke="#5E5258" stroke-width=".7"/>
      <rect x="${L}" y="${y - h}" width="${w}" height="6" fill="#4A2A12" opacity=".28"/>
      <rect x="${f1(x - w * .2 - 7)}" y="${y - 22}" width="17" height="3.4" rx="1" fill="url(#adMadeira)" stroke="#4E2A10" stroke-width=".9"/>
      <rect x="${f1(x - w * .2 - 5)}" y="${y - 18.6}" width="13" height="14" fill="#5E3414" stroke="#3A1E0A" stroke-width="1"/><path d="M${f1(x - w * .2 - 1)} ${y - 18}v13M${f1(x - w * .2 + 3)} ${y - 18}v13" stroke="#8A5228" stroke-width="1"/><circle cx="${f1(x - w * .2 + 5)}" cy="${y - 11}" r="1" fill="#FFC83D"/>
      <rect x="${f1(x + w * .22 - 5)}" y="${y - h + 9}" width="10" height="9" fill="#2E4A6E" stroke="#4E2A10" stroke-width="1.6"/><path d="M${f1(x + w * .22 - 3)} ${y - h + 12} l4 -2" stroke="#BFE6FF" stroke-width="1.2" opacity=".8"/><rect x="${f1(x + w * .22 - 9)}" y="${y - h + 9}" width="4" height="9" fill="#3E8AD6" stroke="#1E4A8A" stroke-width=".8"/><rect x="${f1(x + w * .22 + 5)}" y="${y - h + 9}" width="4" height="9" fill="#3E8AD6" stroke="#1E4A8A" stroke-width=".8"/>
      <rect x="${f1(x + w * .22 - 7)}" y="${y - h + 18}" width="14" height="3" fill="#8A5228" stroke="#4E2A10" stroke-width=".7"/>${flor(x + w * .22 - 3, y - h + 17, 1.8, '#FF5A6A', '#9A1A2A')}${flor(x + w * .22 + 3, y - h + 17, 1.6, '#FFD447', '#9A7A0E')}
      <path d="M${f1(x - w * .2 + 12)} ${y} c-1 -5 1 -7 4 -7 c3 0 5 2 4 7Z" fill="#C8642E" stroke="#6E2A10" stroke-width=".9"/>
      <path d="M${f1(C[0])} ${f1(C[1])} L${f1(D + d + 3)} ${f1(y - dy - h + 3)}" stroke="${tesc}" stroke-width="4" stroke-linecap="round"/><path d="M${f1(C[0])} ${f1(C[1])} L${f1(D + d + 3)} ${f1(y - dy - h + 3)}" stroke="${telha}" stroke-width="2" stroke-linecap="round"/>
      <path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${f1(C[0])} ${f1(C[1])} L${f1(E[0])} ${f1(E[1])}Z" fill="${palha ? 'url(#adPalha)' : telha}" stroke="${tesc}" stroke-width="1.6" stroke-linejoin="round"/>
      ${palha ? '' : `<path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${f1(C[0])} ${f1(C[1])} L${f1(E[0])} ${f1(E[1])}Z" fill="url(#adTelhaLuz)"/>`}
      <path d="${tlinhas}" stroke="${tesc}" stroke-width="${palha ? .8 : 1}" fill="none" opacity="${palha ? .6 : .55}"/>${franja}
      <path d="M${f1(E[0] - 1)} ${f1(topo)} L${f1(C[0] + 1)} ${f1(topo)}" stroke="${tesc}" stroke-width="${palha ? 4 : 3.4}" stroke-linecap="round"/><path d="M${f1(E[0] + 2)} ${f1(topo - .6)} L${f1(C[0] - 2)} ${f1(topo - .6)}" stroke="#fff" stroke-width="1" opacity=".35" stroke-linecap="round"/>
      <path d="M${f1(A[0] + 6)} ${f1(A[1] - 4)} L${f1(E[0] + 6)} ${f1(topo + 3)}" stroke="#fff" stroke-width="1.6" opacity=".3" stroke-linecap="round"/></g>`;
  };
  const quinoa = (x, y, cor, esc, s) => `<g><path d="M${x} ${y} V${y - 22 * s}" stroke="#5E7A2A" stroke-width="${2 * s}"/><path d="M${x} ${y - 6 * s} q-7 -2 -9 -8 q6 0 9 5 M${x} ${y - 10 * s} q7 -2 9 -8 q-6 0 -9 5" fill="#7AA03A" stroke="#4E6A1E" stroke-width=".7"/>${[[0, -38, 2.8], [-3, -33, 3.2], [3, -32, 3.2], [-4, -27, 3.3], [4, -26, 3.2], [0, -29, 3], [-2, -22, 2.8], [2, -21, 2.6]].map(([dx, dy, r]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(r * s).toFixed(1)}" fill="${cor}" stroke="${esc}" stroke-width=".8"/>`).join('')}<path d="M${x - 3 * s} ${y - 34 * s} q1 -3 3 -4" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  const batata = (x, y, s) => `<g><path d="${copa(x, y - 9 * s, 13 * s, 9 * s, 8, .35)}" fill="url(#adBatata)" stroke="#1E5A2A" stroke-width="1.2"/><path d="M${x - 8 * s} ${y - 12 * s} q4 -4 9 -4" stroke="#B8E8A0" stroke-width="1.4" fill="none" opacity=".7"/>${flor(x - 4 * s, y - 16 * s, 2.2 * s, '#E8D4FF', '#7A4AB8')}${flor(x + 6 * s, y - 12 * s, 2 * s, '#FFFFFF', '#8A7AA8')}</g>`;
  const arroz = (x, y, s) => `<g stroke-linecap="round" fill="none"><path d="M${x} ${y} q-4 -8 -8 -14 M${x} ${y} q-1 -10 -2 -18 M${x} ${y} q2 -10 5 -17 M${x} ${y} q5 -6 10 -11" stroke="#3E8A2A" stroke-width="${2.6 * s}"/><path d="M${x} ${y} q-4 -8 -8 -14 M${x} ${y} q-1 -10 -2 -18 M${x} ${y} q2 -10 5 -17 M${x} ${y} q5 -6 10 -11" stroke="#A8E64A" stroke-width="${1.4 * s}"/></g>`;
  const queuna = (x, y, s) => `<g><path d="M${x} ${y} C${x - 4} ${y - 30 * s} ${x + 6} ${y - 50 * s} ${x - 2} ${y - 76 * s} M${x - 1} ${y - 40 * s} C${x - 12 * s} ${y - 50 * s} ${x - 20 * s} ${y - 58 * s} ${x - 26 * s} ${y - 70 * s} M${x + 2} ${y - 50 * s} C${x + 12 * s} ${y - 58 * s} ${x + 18 * s} ${y - 66 * s} ${x + 22 * s} ${y - 80 * s}" stroke="#6E2E1A" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x - 4} ${y - 30 * s} ${x + 6} ${y - 50 * s} ${x - 2} ${y - 76 * s} M${x - 1} ${y - 40 * s} C${x - 12 * s} ${y - 50 * s} ${x - 20 * s} ${y - 58 * s} ${x - 26 * s} ${y - 70 * s} M${x + 2} ${y - 50 * s} C${x + 12 * s} ${y - 58 * s} ${x + 18 * s} ${y - 66 * s} ${x + 22 * s} ${y - 80 * s}" stroke="url(#adCasca)" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 1} ${y - 10 * s} l3 -4 M${x + 1} ${y - 26 * s} l-3 -3 M${x - 2} ${y - 60 * s} l3 -4" stroke="#F2B08A" stroke-width="1.4" stroke-linecap="round"/>${[[-26, -78, 22, 15], [22, -88, 22, 15], [-2, -90, 26, 17], [-10, -70, 16, 10], [12, -70, 16, 10]].map(([dx, dy, rx, ry]) => `<path d="${copa(x + dx * s, y + dy * s, rx * s, ry * s, 9, .3)}" fill="url(#adQueuna)" stroke="#24463A" stroke-width="1.4"/>`).join('')}<g fill="#B8DCC0" opacity=".55">${[[-30, -82], [-20, -76], [18, -92], [28, -86], [-6, -96], [4, -92]].map(([dx, dy]) => `<circle cx="${(x + dx * s).toFixed(1)}" cy="${(y + dy * s).toFixed(1)}" r="${(2 * s).toFixed(1)}"/>`).join('')}</g></g>`;
  const porta = (p, i) => `<g class="ad-porta toque" data-i="${i}"><ellipse cx="${p.x}" cy="${p.y + 7}" rx="16" ry="3" fill="#2E2418" opacity=".3"/><path d="M${p.x - 14} ${p.y + 6} v-16 q0 -4 4 -4 h3 v20Z M${p.x + 14} ${p.y + 6} v-16 q0 -4 -4 -4 h-3 v20Z" fill="url(#adPedra)" stroke="#3A3036" stroke-width="1.4"/><path d="M${p.x - 12} ${p.y - 9} h3 M${p.x + 9} ${p.y - 9} h3" stroke="#EDE4E0" stroke-width="1.2" opacity=".7"/><g class="ad-tabua" style="transition:transform .8s cubic-bezier(.3,1.4,.5,1)"><rect x="${p.x - 8}" y="${p.y - 10}" width="16" height="15" rx="2" fill="url(#adMadeira)" stroke="#4E2A10" stroke-width="1.4"/><path d="M${p.x - 8} ${p.y - 5} h16 M${p.x - 8} ${p.y} h16" stroke="#6E3E1A" stroke-width="1"/><circle cx="${p.x}" cy="${p.y - 13}" r="2.6" fill="#8A5A2A" stroke="#4E2A10" stroke-width="1"/></g><g class="ad-dica" style="display:none">${brilhoHotspot(p.x + 12, p.y - 22)}</g><rect x="${p.x - 22}" y="${p.y - 30}" width="44" height="42" fill="transparent"/></g>`;
  /* pedras encaixadas do muro de arrimo (estilo inca) ao longo da curva */
  const muro = (L, i) => { const xs = TX(L), xs2 = xs.map((v, k) => k ? v : v - 4), yf = TF(L); let s = '';
    for (let r = 0; r < 2; r++) { let t = r ? R(.01, .03) : 0;
      while (t < 1) { const dt = R(11, 17) / (800 - L.x0), tb = Math.min(1, t + dt), xa = bz(...xs2, t) + 1, xb = bz(...xs2, tb) - .6, ya = bz(...yf, t) + 1.4 + r * 7.6, yb = bz(...yf, tb) + 1.4 + r * 7.6, h = 6.6;
        const cor = ['#C2B09E', '#AE9A88', '#CDBDAA', '#A08B7A', '#B8A694', '#C9B29A'][Math.floor(R(0, 5.99))];
        s += `<path d="M${f1(xa + 1.6)} ${f1(ya)} L${f1(xb - 1.6)} ${f1(yb)} Q${f1(xb)} ${f1(yb)} ${f1(xb)} ${f1(yb + 1.8)} L${f1(xb)} ${f1(yb + h - 1.6)} Q${f1(xb)} ${f1(yb + h)} ${f1(xb - 1.8)} ${f1(yb + h)} L${f1(xa + 1.8)} ${f1(ya + h)} Q${f1(xa)} ${f1(ya + h)} ${f1(xa)} ${f1(ya + h - 1.6)} L${f1(xa)} ${f1(ya + 1.8)} Q${f1(xa)} ${f1(ya)} ${f1(xa + 1.6)} ${f1(ya)}Z" fill="${cor}"/><path d="M${f1(xa + 1.6)} ${f1(ya + 1)} L${f1(xb - 1.6)} ${f1(yb + 1)}" stroke="#F2E8DC" stroke-width="1" opacity=".75"/>`;
        t = tb; } }
    return `<g stroke="none">${s}</g>`; };
  const campo = (L, i) => { const { y, x0 } = L, xs = TX(L), xf = xs.map((v, k) => k ? v : v - 4), xw = xs.map((v, k) => k ? v : v - 6), yb = TB(L), yf = TF(L), yw = TW(L);
    const campoD = `M${x0} ${y} ${curva(xs, yb)} V${yf[3]} C700 ${yf[2]} ${xf[1]} ${yf[1]} ${xf[0]} ${yf[0]}Z`;
    const n = Math.floor((790 - x0) / 23);
    return `<g class="ad-terraco" data-i="${i}">
    <path class="ad-campo" d="${campoD}" fill="url(#adTerraSeca)" stroke="#8A6A3E" stroke-width="1.4" style="transition:fill 1.6s"/>
    <path class="ad-umido" d="${campoD}" fill="url(#${i === 2 ? 'adEspelho' : 'adTerraMolhada'})" style="opacity:0;transition:opacity 1.6s"/>
    <g stroke="#8E6A42" stroke-width="1.2" opacity=".5" fill="none">${[.35, .6, .85].map(k => `<path d="M${x0 + 4} ${f1(yb[0] + (yf[0] - yb[0]) * k)} C${xs[1]} ${f1(yb[1] + (yf[1] - yb[1]) * k)} 700 ${f1(yb[2] + (yf[2] - yb[2]) * k)} 800 ${f1(yb[3] + (yf[3] - yb[3]) * k)}"/>`).join('')}</g>
    <g stroke="#F2DCB0" stroke-width=".9" opacity=".55" fill="none">${[.47, .72].map(k => `<path d="M${x0 + 8} ${f1(yb[0] + (yf[0] - yb[0]) * k)} C${xs[1]} ${f1(yb[1] + (yf[1] - yb[1]) * k)} 700 ${f1(yb[2] + (yf[2] - yb[2]) * k)} 800 ${f1(yb[3] + (yf[3] - yb[3]) * k)}"/>`).join('')}</g>
    <g>${Array.from({ length:n * 2 }, (_, k) => { const t = (k * 11.5 + 12) / (800 - x0), xx = bz(...xs, t), yy = bz(...yb, t) + (bz(...yf, t) - bz(...yb, t)) * .72; return `<path d="M${f1(xx)} ${f1(yy)} q-2 -3 -3 -4 M${f1(xx)} ${f1(yy)} q1 -3 3 -4" stroke="#9A8A3A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`; }).join('')}</g>
    <path d="M${xf[0]} ${yf[0]} ${curva(xf, yf)} V${yw[3]} C700 ${yw[2]} ${xw[1]} ${yw[1]} ${xw[0]} ${yw[0]}Z" fill="url(#adMuro)" stroke="#3E322C" stroke-width="1.6" stroke-linejoin="round"/>
    ${muro(L, i)}
    <path d="M${xw[0]} ${yw[0]} ${curva(xw, yw)}" stroke="#2E261E" stroke-width="2.2" fill="none" opacity=".35"/>
    <path d="M${xf[0] + 2} ${yf[0] - .6} ${curva(xf, yf.map(v => v - .6))}" stroke="#7A9A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${xf[0] + 2} ${yf[0] - 1} ${curva(xf, yf.map(v => v - 1))}" stroke="#C8E07A" stroke-width="1" fill="none" opacity=".7"/>
    <g class="ad-plantas">${Array.from({ length:n }, (_, k) => { const t = (k * 23 + 18) / (800 - x0), xx = bz(...xs, t) + R(-3, 3), yy = bz(...yb, t) + (bz(...yf, t) - bz(...yb, t)) * .74; const cores = [['#D8342E', '#8A1A14'], ['#F28A2A', '#A04A0E'], ['#F2C230', '#9A7A0E'], ['#9A3A8E', '#5A1A52'], ['#E85A6A', '#8E2A34']]; const cc = cores[(k + i) % 5];
      const p = i === 0 ? quinoa(xx, yy, cc[0], cc[1], R(.85, 1.05)) : i === 1 ? batata(xx, yy, R(.9, 1.1)) : arroz(xx, yy, R(.9, 1.1));
      return `<g class="ad-planta" style="transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1) ${(k * .06).toFixed(2)}s">${p}</g>`; }).join('')}</g></g>`; };
  /* contornos das montanhas */
  const MONTE = 'M-10 340 L30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L262 86 L280 72 L300 62 L314 74 L326 84 L336 96 L352 108 L370 116 L386 106 L400 100 L414 94 L430 92 L446 106 L470 132 L494 152 L520 182 L548 206 L580 240 L612 280 L650 330 L700 350 H-10Z';
  const HIM = 'M470 330 L512 262 L540 214 L566 178 L588 146 L600 124 L612 136 L626 150 L640 142 L652 136 L670 116 L688 100 L700 92 L716 108 L730 124 L742 136 L756 128 L770 122 L786 130 L800 140 V330Z';
  const LAGOD = `M392 318 C394 306 428 299 468 300 C510 299 548 304 558 315 C566 326 540 338 500 340 C468 343 428 342 406 336 C392 331 389 325 392 318Z`;
  const fissuras = (n, x0, x1, y0, y1, cor, op) => `<g stroke="${cor}" stroke-width="1.3" fill="none" opacity="${op}" stroke-linecap="round">${Array.from({ length:n }, () => { const x = R(x0, x1), y = R(y0, y1); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${R(6, 16).toFixed(0)} ${R(-3, 4).toFixed(0)} l${R(4, 12).toFixed(0)} ${R(2, 7).toFixed(0)}"/>`; }).join('')}</g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Montanhas com geleira, lago azul-turquesa, terraços de plantação, vila, a lhama Quilla, condor, iaque e leopardo-das-neves">
    <defs>
      <linearGradient id="adCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E6CC6"/><stop offset=".35" stop-color="#6FA6E4"/><stop offset=".62" stop-color="#B4D2F0"/><stop offset=".82" stop-color="#E8E8F0"/><stop offset="1" stop-color="#F8E4CC"/></linearGradient>
      <linearGradient id="adLonge2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6CEEA"/><stop offset="1" stop-color="#E2E4F0"/></linearGradient>
      <linearGradient id="adLonge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6B0D6"/><stop offset="1" stop-color="#D2D6EA"/></linearGradient>
      <linearGradient id="adHimLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8C0E2"/><stop offset=".6" stop-color="#97A2CC"/><stop offset="1" stop-color="#8A94BE"/></linearGradient>
      <linearGradient id="adHimSombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A74A2"/><stop offset="1" stop-color="#555E8C"/></linearGradient>
      <linearGradient id="adRochaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0C6B2"/><stop offset=".5" stop-color="#C2A294"/><stop offset="1" stop-color="#A28688"/></linearGradient>
      <linearGradient id="adRochaLuz2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2BCB4"/><stop offset=".6" stop-color="#B09694"/><stop offset="1" stop-color="#94808A"/></linearGradient>
      <linearGradient id="adMonte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0908C"/><stop offset=".6" stop-color="#957680"/><stop offset="1" stop-color="#806878"/></linearGradient>
      <linearGradient id="adRochaSombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A6078"/><stop offset=".6" stop-color="#5E4A66"/><stop offset="1" stop-color="#4E4060"/></linearGradient>
      <linearGradient id="adVale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8090"/><stop offset="1" stop-color="#A49A98"/></linearGradient>
      <linearGradient id="adGelo" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="0" y2="300"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#F2FAFF"/><stop offset=".55" stop-color="#CFE8F8"/><stop offset=".72" stop-color="#A6D2EE"/><stop offset=".88" stop-color="#9ABCD2"/><stop offset="1" stop-color="#8CA2B4"/></linearGradient>
      <linearGradient id="adGeloSombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6EA8DC" stop-opacity="0"/><stop offset="1" stop-color="#4E8CCC" stop-opacity=".7"/></linearGradient>
      <linearGradient id="adNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6E8F6"/></linearGradient>
      <linearGradient id="adPuna" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4C47C"/><stop offset=".45" stop-color="#B6AE5C"/><stop offset="1" stop-color="#7E8C40"/></linearGradient>
      <linearGradient id="adPunaVerde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8D86A"/><stop offset="1" stop-color="#5E9A3E"/></linearGradient>
      <linearGradient id="adColina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A89A6A"/><stop offset="1" stop-color="#8E8A56"/></linearGradient>
      <linearGradient id="adFrente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA448"/><stop offset=".5" stop-color="#76843A"/><stop offset="1" stop-color="#4E5E26"/></linearGradient>
      <linearGradient id="adEncosta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A2B05A"/><stop offset=".5" stop-color="#7E9A44"/><stop offset="1" stop-color="#5E7E36"/></linearGradient>
      <linearGradient id="adMorenaL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E7080"/><stop offset="1" stop-color="#9A8E8C"/></linearGradient>
      <linearGradient id="adMoraina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A69CA0"/><stop offset="1" stop-color="#B8AC94"/></linearGradient>
      <linearGradient id="adRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CEB4AE"/><stop offset=".6" stop-color="#9E8290"/><stop offset="1" stop-color="#836A7C"/></linearGradient>
      <linearGradient id="adPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BEB0B2"/><stop offset="1" stop-color="#6E6066"/></linearGradient>
      <linearGradient id="adMuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E4E44"/><stop offset="1" stop-color="#3E322C"/></linearGradient>
      <linearGradient id="adTerraSeca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6C690"/><stop offset="1" stop-color="#C49A62"/></linearGradient>
      <linearGradient id="adTerraMolhada" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5E3A"/><stop offset="1" stop-color="#6A4428"/></linearGradient>
      <linearGradient id="adEspelho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2ECF8"/><stop offset=".5" stop-color="#8ED0EC"/><stop offset="1" stop-color="#5EAED6"/></linearGradient>
      <linearGradient id="adMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A4E"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="adAdobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C496"/><stop offset=".5" stop-color="#DAAE7E"/><stop offset="1" stop-color="#C49468"/></linearGradient>
      <linearGradient id="adAdobeLado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B88660"/><stop offset="1" stop-color="#9A6A48"/></linearGradient>
      <linearGradient id="adPalha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A04E"/><stop offset=".5" stop-color="#E6C470"/><stop offset="1" stop-color="#B8903E"/></linearGradient>
      <linearGradient id="adTelhaLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
      <linearGradient id="adCasca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E2744A"/><stop offset="1" stop-color="#A8401E"/></linearGradient>
      <linearGradient id="adPuya" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8C890"/><stop offset=".5" stop-color="#A8B070"/><stop offset="1" stop-color="#7A8A4E"/></linearGradient>
      <radialGradient id="adYareta" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#A8E05A"/><stop offset=".6" stop-color="#5EA83A"/><stop offset="1" stop-color="#3A7A2A"/></radialGradient>
      <radialGradient id="adQueuna" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#8EBC9A"/><stop offset=".6" stop-color="#4E8468"/><stop offset="1" stop-color="#2E5A48"/></radialGradient>
      <radialGradient id="adBatata" cx=".4" cy=".3" r=".7"><stop offset="0" stop-color="#6EC05A"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient>
      <radialGradient id="adLago" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#1E9AB2"/><stop offset=".45" stop-color="#2EBAC8"/><stop offset=".85" stop-color="#6ADCD8"/><stop offset="1" stop-color="#A8F0E4"/></radialGradient>
      <radialGradient id="adLagoSeco" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#6E5E4C"/><stop offset=".7" stop-color="#8A7A62"/><stop offset="1" stop-color="#A6967A"/></radialGradient>
      <radialGradient id="adSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".55" stop-color="#FFCE45"/><stop offset="1" stop-color="#F29A1E"/></radialGradient>
      <linearGradient id="adNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F2F8" stop-opacity="0"/><stop offset=".7" stop-color="#F2F2F8" stop-opacity=".5"/><stop offset="1" stop-color="#F6F0E8" stop-opacity=".7"/></linearGradient>
      <linearGradient id="adNevoaBaixa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2F4" stop-opacity="0"/><stop offset="1" stop-color="#F4F2F0" stop-opacity=".42"/></linearGradient>
      <radialGradient id="adVinheta" cx=".5" cy=".42" r=".78"><stop offset=".58" stop-color="#1A1430" stop-opacity="0"/><stop offset="1" stop-color="#1A1430" stop-opacity=".36"/></radialGradient>
      <clipPath id="adLagoClip"><path d="${LAGOD}"/></clipPath>
      <filter id="adGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#adCeu)"/>
    <path d="M60 70 q120 -14 220 -4 M480 40 q100 -10 190 2 M520 76 q60 -6 120 0" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
    <g class="deriva"><use href="#nuvem" x="560" y="16" width="80" height="38" style="color:#fff" opacity=".8"/><use href="#nuvem" x="40" y="40" width="64" height="30" style="color:#fff" opacity=".7"/></g>
    <!-- cordilheiras distantes, apagadas pela atmosfera -->
    <path d="M0 214 L40 196 L80 170 L104 182 L140 160 L176 186 L220 178 L262 150 L300 172 L346 164 L392 140 L430 162 L476 150 L520 128 L560 152 L604 140 L650 118 L690 146 L740 132 L800 150 V330 H0Z" fill="url(#adLonge2)"/>
    <path d="M70 176 L80 170 L92 178 L84 182Z M130 166 L140 160 L152 170 L142 172Z M252 156 L262 150 L274 160 L262 162Z M382 146 L392 140 L404 150 L392 152Z M508 136 L520 128 L534 140 L520 142Z M640 124 L650 118 L664 128 L650 132Z" fill="#fff" opacity=".7"/>
    <path d="M0 236 L40 206 L70 218 L120 180 L160 200 L210 176 L260 196 L320 170 L380 190 L430 166 L500 188 L560 172 L620 194 L680 178 L740 196 L800 184 V330 H0Z" fill="url(#adLonge)"/>
    <path d="M40 206 L70 218 L56 260 Z M120 180 L160 200 L140 250Z M210 176 L260 196 L232 250Z M320 170 L380 190 L350 250Z M430 166 L500 188 L462 250Z M560 172 L620 194 L590 250Z M680 178 L740 196 L712 250Z" fill="#7E88B4" opacity=".28"/>
    <path d="M110 188 L120 180 L132 188 L124 192Z M200 182 L210 176 L220 184 L212 186Z M310 176 L320 170 L332 178 L322 180Z M420 172 L430 166 L442 174 L432 176Z M670 184 L680 178 L692 186 L682 188Z" fill="#fff" opacity=".9"/>
    <rect y="150" width="800" height="180" fill="url(#adNevoa)"/>
    <g id="ad-him">
      <path d="${HIM}" fill="url(#adHimLuz)" stroke="#5E6890" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M600 124 L612 136 L626 150 L640 142 L652 136 L640 200 L626 262 L616 330 L560 330 L580 250 L594 180Z M700 92 L716 108 L730 124 L742 136 L756 128 L770 122 L772 200 L780 330 L716 330 L712 250 L706 170Z" fill="url(#adHimSombra)" opacity=".85"/>
      <path d="M770 122 L786 130 L800 140 V330 H780 L772 200Z" fill="#6A74A2" opacity=".5"/>
      <path d="M600 124 L594 180 L580 250 M700 92 L706 170 L712 250 M652 136 L640 200" stroke="#DCE2F6" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>
      ${fissuras(10, 560, 790, 190, 300, '#4E5884', .4)}
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path transform="translate(0 18)" d="M582 150 L600 124 L626 150 L652 136 L670 120 L700 92 L730 124 L742 136 L770 122 L800 140 V160 C786 154 776 160 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C700 152 690 150 682 140 C672 160 660 156 652 150 C640 166 630 162 622 158 C610 170 600 164 592 162Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
      <path d="M582 150 L600 124 L626 150 L652 136 L670 120 L700 92 L730 124 L742 136 L770 122 L800 140 V160 C786 154 776 160 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C700 152 690 150 682 140 C672 160 660 156 652 150 C640 166 630 162 622 158 C610 170 600 164 592 162Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M600 124 L626 150 L652 136 C646 150 640 158 632 160 C624 162 616 162 608 166 C604 150 602 136 600 124Z M700 92 L730 124 L742 136 L770 122 C770 140 768 150 764 150 C754 162 744 158 734 150 C724 160 716 156 708 140 C704 120 702 106 700 92Z" fill="#9CB4DC" opacity=".55"/>
      <path d="M700 98 L694 130 L688 142 M600 130 L596 150 M770 128 L772 146" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85" fill="none"/>
      <rect x="470" y="200" width="330" height="130" fill="url(#adNevoaBaixa)"/>
    </g>
    <g id="ad-monte">
      <path d="${MONTE}" fill="url(#adMonte)" stroke="#4E3A50" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-10 340 L30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L214 150 L184 214 L150 280 L120 340Z" fill="url(#adRochaLuz)"/>
      <path d="M300 62 L314 74 L326 84 L336 96 L352 108 L346 160 L340 230 L334 300 L330 340 L204 340 L224 250 L248 178 L272 118Z" fill="url(#adRochaSombra)"/>
      <path d="${faixa(118, 336, 1, 22, 1, 22, 2.2)}" fill="url(#adVale)" stroke="#4A3A52" stroke-width="1.6" stroke-opacity=".35" stroke-linejoin="round"/>
      <path d="M386 106 L400 100 L414 94 L430 92 L444 150 L458 220 L472 290 L480 340 L420 340 L416 300 L412 200 L404 128Z" fill="url(#adRochaLuz2)"/>
      <path d="M430 92 L446 106 L470 132 L498 200 L530 270 L560 345 L480 340 L472 290 L458 220 L444 150Z" fill="url(#adRochaSombra)"/>
      <path d="M470 132 L494 152 L520 182 L548 206 L580 240 L612 280 L650 330 L700 350 L560 345 L530 270 L498 200Z" fill="#7A6276" opacity=".9"/>
      <path d="M240 100 L214 150 L184 214 L150 280 M300 62 L272 118 L248 178 L224 250 M430 92 L444 150 L458 220 L472 290 M470 132 L498 200 L530 270" stroke="#F6E6DA" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 294 L58 270 L84 238 L110 214 L142 188 L160 176 L180 150 L204 132 L222 122 L240 100 L262 86 L280 72 L300 62" stroke="#FFF2E8" stroke-width="1.6" fill="none" opacity=".55" stroke-linejoin="round"/>
      <path d="M110 214 C114 236 108 258 102 284 M160 176 C164 204 156 232 148 256 M204 132 C206 158 198 184 190 204 M58 270 C62 290 58 306 52 324 M84 238 C86 258 82 276 76 296" stroke="#8A6670" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M262 108 C256 140 246 176 236 210 M288 100 C282 140 274 190 262 240 M318 96 C314 140 306 200 296 270" stroke="#3E2E4A" stroke-width="2" fill="none" opacity=".35" stroke-linecap="round"/>
      <path d="M452 140 C470 180 484 220 496 270 M486 170 C506 210 520 250 534 300" stroke="#3A2A48" stroke-width="2" fill="none" opacity=".3" stroke-linecap="round"/>
      ${fissuras(8, 40, 200, 230, 320, '#7A5A64', .45)}${fissuras(8, 230, 330, 160, 320, '#3E2E48', .4)}${fissuras(6, 420, 470, 150, 320, '#7A6274', .45)}${fissuras(8, 490, 640, 220, 330, '#3E2E48', .35)}
      <path d="M252 92 L262 86 L280 72 L300 62 L314 74 L326 84 L336 96 C330 100 326 96 320 102 C314 98 310 108 304 104 C300 114 294 104 288 112 C284 104 276 112 272 104 L266 118 C262 108 258 104 252 102Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/>
      <path d="M300 62 L314 74 L326 84 L336 96 C330 100 326 96 320 102 C314 98 310 108 304 104 C300 110 296 104 292 108Z" fill="#A8BEE0" opacity=".7"/>
      <path d="M228 116 L240 100 L252 110 C246 118 240 118 236 130 C232 122 230 118 224 120Z M174 156 L180 150 L192 158 C186 164 182 168 180 176 C176 168 172 162 168 162Z M414 94 L430 92 L446 106 L470 132 C462 136 458 132 454 140 C448 132 444 140 440 132 C436 126 432 132 428 124 C422 120 418 112 410 110Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/>
      <path d="M430 92 L446 106 L470 132 C462 136 458 132 454 140 C448 132 444 140 440 132Z" fill="#A8BEE0" opacity=".7"/>
      <path d="M180 156 L174 172 L178 180 L170 198 M240 106 L232 130 L236 138 L228 160 M282 80 L272 108 M110 220 L104 236" stroke="#fff" stroke-width="1.8" fill="none" opacity=".8" stroke-linecap="round"/>
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path d="M206 130 C220 120 232 106 240 100 L262 86 L280 72 L290 70 C286 90 280 108 270 120 C262 114 258 126 250 122 C244 132 236 126 230 138 C222 132 216 142 208 140Z M470 132 L494 152 C488 158 484 154 478 162 C474 154 468 158 462 150 C464 142 466 136 470 132Z M140 190 L160 176 L180 150 C182 166 176 180 168 186 C162 184 156 194 148 194Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
      <g class="ad-neve" style="opacity:0;transition:opacity 1.6s"><path d="M84 238 L110 214 L142 188 C140 206 132 220 122 226 C116 222 110 234 102 234 C96 240 90 236 84 244Z M494 152 L520 182 L548 206 C540 212 534 206 528 214 C520 206 512 212 506 200 C500 192 496 180 488 172Z M30 294 L58 270 C56 282 50 290 44 294 C40 292 36 298 30 298Z M204 132 L222 122 C222 136 216 150 208 154 C202 150 198 158 192 156 C194 146 198 138 204 132Z" fill="url(#adNeve)" stroke="#A8C2DC" stroke-width="1"/></g>
    </g>
    <g id="ad-leopardo" class="toque" data-fig="leopardo"><g id="ad-leo-in" style="transition:transform .7s cubic-bezier(.3,1.5,.5,1)"><svg x="170" y="180" width="96" height="70" viewBox="0 0 150 110"><use href="#f-leopardo"/></svg></g>
      <path d="M140 256 C146 244 148 236 152 230 L166 220 L180 224 L196 212 L214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256Z" fill="url(#adRocha)"/><path d="M214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256 H226 L222 236Z" fill="#4E3A52" opacity=".35"/><path d="M140 256 C146 244 148 236 152 230 L166 220 L180 224 L196 212 L214 216 L230 208 L248 216 L262 228 C268 238 274 248 282 256" fill="none" stroke="#3E2E3E" stroke-width="1.8" stroke-linejoin="round"/><path d="M156 230 L166 222 L180 226 M198 214 L214 218 L228 211" stroke="#F2DED6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/><path d="M180 226 L186 248 M214 218 L210 246 M244 222 L250 248" stroke="#3E2E3E" stroke-width="1.2" opacity=".5"/><path d="M146 250 q50 -6 130 2" stroke="#3E2E3E" stroke-width="3" opacity=".18" fill="none"/>${brilhoHotspot(240, 194)}<rect x="150" y="180" width="124" height="66" fill="transparent"/></g>
    <!-- planície de cascalho (fluvioglacial) e morena frontal -->
    <path d="M346 266 C340 284 320 298 294 310 L476 306 C454 294 434 282 420 266 C402 274 364 274 346 266Z" fill="url(#adMoraina)" stroke="#6E6066" stroke-width="1.4" stroke-linejoin="round"/>
    <g fill="#8E8488">${Array.from({ length:34 }, () => { const yy = R(258, 306), w = (yy - 250) * 2.6; return `<ellipse cx="${(380 + R(-w / 2, w / 2)).toFixed(0)}" cy="${yy.toFixed(0)}" rx="${R(1.6, 4.4).toFixed(1)}" ry="${R(1.2, 2.6).toFixed(1)}" stroke="#5E5258" stroke-width=".6"/>`; }).join('')}</g>
    <path d="M330 302 C346 288 366 292 380 296 C396 290 416 290 432 302 C418 308 400 304 380 306 C362 304 344 310 330 302Z" fill="#8E8284" stroke="#5E5258" stroke-width="1.2"/>
    <g fill="#B8AEAC" stroke="#5E5258" stroke-width=".7">${Array.from({ length:12 }, (_, k) => `<ellipse cx="${(336 + k * 8 + R(-2, 2)).toFixed(0)}" cy="${(300 - Math.sin(k / 11 * 3.14) * 6 + R(-1, 1)).toFixed(1)}" rx="${R(2.4, 4).toFixed(1)}" ry="${R(1.6, 2.4).toFixed(1)}"/>`).join('')}</g>
    <!-- morenas laterais: cristas de cascalho que a geleira empurrou para os lados -->
    <path d="${faixa(146, 294, 1, 17, -1, 3, 1.4)}" fill="url(#adMorenaL)" stroke="#3E3244" stroke-width="1.3" stroke-opacity=".5"/>
    <path d="${faixa(146, 294, -1, 3, 1, 17, 1.4)}" fill="url(#adMorenaL)" stroke="#3E3244" stroke-width="1.3" stroke-opacity=".5"/>
    <path d="M${Array.from({ length:25 }, (_, k) => { const yy = 150 + k * 6; return `${f1(GX(yy) - GW(yy) - 8)} ${yy}`; }).join(' L')} M${Array.from({ length:25 }, (_, k) => { const yy = 150 + k * 6; return `${f1(GX(yy) + GW(yy) + 8)} ${yy}`; }).join(' L')}" stroke="#DCD0CE" stroke-width="1.5" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"/>
    <g stroke="#4E4450" stroke-width=".5">${Array.from({ length:50 }, (_, k) => { const lado = k % 2 ? 1 : -1, yy = R(152, 292), xx = GX(yy) + lado * (GW(yy) + R(2, 14)); return `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="${f1(R(1.4, 3))}" ry="${f1(R(1, 2))}" fill="${['#8A7E84', '#B8ACAA', '#6E6268', '#A09294'][k % 4]}"/>`; }).join('')}</g>
    <g id="ad-riachos" style="opacity:0;transition:opacity 1.2s">
      <path d="M380 262 C384 276 394 284 406 290 C420 296 430 302 438 312 M394 282 C390 292 398 300 412 306 C420 310 426 312 432 316" stroke="#2A6E9E" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
      <path d="M394 282 C390 292 398 300 412 306 C420 310 426 312 432 316" stroke="#5EC6EE" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path id="ad-riacho1" d="M372 254 C378 270 394 282 406 290 C420 296 430 302 438 312" stroke="#4AB8F0" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path id="ad-riacho2" d="M474 160 C482 190 494 214 496 238 C498 262 504 286 506 306" stroke="#4AB8F0" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path class="ad-fluxo" d="M372 254 C378 270 394 282 406 290 C420 296 430 302 438 312 M474 160 C482 190 494 214 496 238 C498 262 504 286 506 306" stroke="#E6F8FF" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-dasharray="3 14" opacity=".8"/>
      <g fill="#fff" opacity=".85"><circle cx="483" cy="192" r="1.6"/><circle cx="496" cy="240" r="1.8"/><circle cx="500" cy="276" r="1.4"/><ellipse cx="507" cy="306" rx="5" ry="1.8"/></g>
    </g>
    <g id="ad-gelo"><path id="ad-gelo-corpo" fill="url(#adGelo)" stroke="#8AB4DA" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M404 104 C410 112 408 124 400 136 C394 146 386 156 376 170 L364 164 C374 152 382 140 388 128 C393 118 398 108 404 104Z" fill="url(#adGelo)" stroke="#8AB4DA" stroke-width="1.4"/><path d="M400 112 l-5 4 M394 126 l-5 3 M386 140 l-5 3" stroke="#6EA6D8" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M300 70 C312 80 326 92 338 102 C350 110 360 116 368 118 C354 120 336 112 322 100 C312 90 304 80 300 70Z" fill="#fff" opacity=".9"/>
      <path id="ad-gelo-sombra" fill="url(#adGeloSombra)"/>
      <path d="M296 100 C312 112 334 122 356 126" stroke="#3E7AB4" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M297 103 C313 115 335 125 356 129" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path id="ad-gelo-fenda" fill="#4A86C0" stroke="#2E6CA8" stroke-width=".5" stroke-linejoin="round" opacity=".85"/>
      <path id="ad-gelo-moraina" stroke="#7A6C70" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
      <path id="ad-gelo-frente" fill="#7E8E9C" stroke="#4E5E70" stroke-width="1"/><path id="ad-gelo-sujo" fill="#5E5458" opacity=".75"/>
      <path id="ad-gelo-boca" fill="#1A3E6A"/>
      <path id="ad-gelo-luz" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M361 124 L367 116 L372 117 L377 111 L384 119 L381 130 L377 140 L372 155 L368 144 L364 134Z" fill="#7A6280" stroke="#4A3A52" stroke-width="1.2" stroke-linejoin="round"/><path d="M364 124 L368 118 L372 119 L377 113" stroke="#E2D2D0" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M377 113 L384 119 L381 130 L377 140 L372 155 L374 138 L378 124Z" fill="#4A3A52" opacity=".45"/><path d="M366 120 C370 116 376 113 382 117 C376 118 372 120 366 122Z" fill="#fff"/>
      <path d="M314 86 l5 5 l-1 6 M330 98 l4 3 M292 92 l4 6" stroke="#6E5A74" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>
      <g id="ad-gelo-hint" style="display:none">${brilhoHotspot(378, 120)}</g></g>
    <rect x="0" y="250" width="800" height="70" fill="url(#adNevoaBaixa)" opacity=".7" pointer-events="none"/>
    <path d="M-10 330 C30 306 80 292 130 294 C180 296 220 300 262 308 L262 340 H-10Z" fill="url(#adColina)" stroke="#6E6A3A" stroke-width="1.4"/>
    <path d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272 V500 H0Z" fill="url(#adPuna)"/>
    <path id="ad-verde" d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272 V500 H0Z" fill="url(#adPunaVerde)" style="opacity:0;transition:opacity 1.5s"/>
    <path d="M0 322 C140 300 260 306 360 304 C460 300 560 284 800 272" stroke="#F6EAB0" stroke-width="3" fill="none" opacity=".65"/>
    <path d="M0 360 C120 344 240 350 330 346 M0 410 C100 396 200 400 260 406" stroke="#8E8A3E" stroke-width="10" fill="none" opacity=".15" stroke-linecap="round"/>
    <g>${Array.from({ length:70 }, () => { const x = R(0, 520), y = R(318, 440), s = .55 + (y - 318) / 110; return tufo(x, y, s, '#F2E2A0', '#A0943E'); }).join('')}</g>
    <g>${Array.from({ length:7 }, () => { const x = R(30, 300), y = R(318, 340); return ichu(x, y, R(10, 14), '#EEDC90', '#9A8A3A'); }).join('')}</g>
    <g>${[[120, 360, 16], [170, 330, 11], [560, 300, 10], [44, 384, 13], [300, 318, 9], [610, 292, 8]].map(([x, y, r]) => yareta(x, y, r)).join('')}</g>
    ${puya(160, 324, 66)}
    ${pedra(276, 330, 9, 6)}${pedra(36, 344, 7, 5)}${pedra(220, 410, 8, 5)}
    <g id="ad-lago" class="toque">
      <path d="M380 320 C382 302 426 292 468 293 C516 292 560 298 570 314 C576 330 546 346 500 348 C462 351 420 350 398 342 C382 336 378 328 380 320Z" fill="#A69A72" stroke="#6E6040" stroke-width="2"/>
      <path d="${LAGOD}" fill="url(#adLagoSeco)" stroke="#5E5040" stroke-width="1.2"/>
      <path d="M430 320 l10 4 l8 -3 M470 326 l6 -5 l10 2 M500 318 l8 5 M452 314 l6 -4" stroke="#4E4232" stroke-width="1" fill="none" opacity=".5"/>
      <g id="ad-agua" style="transform-origin:${LAGO.x}px ${LAGO.y + 3}px;transform:scale(.22);transition:transform 1.2s"><g clip-path="url(#adLagoClip)">
        <path d="${LAGOD}" fill="url(#adLago)"/>
        <path d="M400 300 L428 318 L446 306 L468 324 L500 300Z" fill="#E6FAFF" opacity=".28"/>
        <path d="M430 300 L452 314 L468 324 L486 300Z" fill="#fff" opacity=".25"/>
        <path d="M504 300 L528 316 L556 300Z" fill="#BCD8F0" opacity=".25"/>
        <path d="M392 318 C394 306 428 299 468 300 C510 299 548 304 558 315" stroke="#C8FFF6" stroke-width="5" fill="none" opacity=".55"/>
        <path d="M${LAGO.x - 54} ${LAGO.y + 2} h30 M${LAGO.x + 10} ${LAGO.y + 8} h36 M${LAGO.x - 20} ${LAGO.y + 14} h24 M${LAGO.x + 50} ${LAGO.y - 4} h18" stroke="#E6FFFF" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      </g><path d="${LAGOD}" fill="none" stroke="#16607A" stroke-width="1.6"/></g>
      <path d="M548 312 v-16 M552 314 v-20 M556 312 v-14 M400 330 v-14 M404 332 v-18" stroke="#5E7A2E" stroke-width="2" stroke-linecap="round"/><path d="M552 294 v-4 M404 314 v-4" stroke="#8A5A2A" stroke-width="3" stroke-linecap="round"/>
      ${[[-88, 0, 10, 7], [-70, 16, 8, 6], [92, 6, 12, 8], [60, 22, 9, 6], [-20, 24, 7, 5], [24, 26, 6, 4]].map(([dx, dy, rx, ry]) => pedra(LAGO.x + dx, LAGO.y + dy + 4, rx, ry)).join('')}
    </g>
    <path d="M552 322 L560 326" stroke="#7A6E62" stroke-width="9" stroke-linecap="round"/>
    <path d="M520 500 L506 456 C540 420 560 380 590 330 C640 316 720 300 800 296 V500Z" fill="url(#adEncosta)"/>
    <path d="M506 456 C540 420 560 380 590 330 C640 316 720 300 800 296" stroke="#D2E08A" stroke-width="2.4" fill="none" opacity=".6"/>
    <g>${Array.from({ length:26 }, () => { const x = R(600, 790), y = R(300, 318); return tufo(x, y, .7, '#E6F0A0', '#5E7A2E'); }).join('')}</g>
    ${LINHAS.map(campo).join('')}
    <g id="ad-canal"><path d="${CANAL}" stroke="#3E3430" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${CANAL}" stroke="#B8A894" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="7 2"/><path d="${CANAL}" stroke="#6E5A48" stroke-width="5.4" fill="none" stroke-linecap="round"/><path id="ad-canal-agua" d="${CANAL}" stroke="#3E9AE6" stroke-width="4.4" fill="none" stroke-linecap="round" style="opacity:0"/><path class="ad-fluxo2" d="${CANAL}" stroke="#D8F2FF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="5 10" style="opacity:0"/></g>
    <g id="ad-ramos">${RAMOS.map((d, i) => `<g class="ad-ramo" data-i="${i}"><path d="${d}" stroke="#3E3430" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#B8A894" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-dasharray="6 1.6"/><path d="${d}" stroke="#6E5A48" stroke-width="3.6" fill="none" stroke-linecap="round"/><path class="ad-ramo-agua" d="${d}" stroke="#3E9AE6" stroke-width="3.4" fill="none" stroke-linecap="round" style="opacity:0"/><path class="ad-ramo-fluxo" d="${d}" stroke="#D8F2FF" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="5 10" style="opacity:0"/></g>`).join('')}</g>
    <g id="ad-iaque" class="toque" data-fig="iaque"><ellipse cx="248" cy="360" rx="46" ry="6" fill="#3A3414" opacity=".25"/><g id="ad-iaque-in" style="transform-origin:250px 362px"><svg x="190" y="282" width="112" height="82" viewBox="0 0 150 110"><use href="#f-iaque"/></svg></g>${brilhoHotspot(296, 296)}</g>
    <g id="ad-vizcacha" class="toque"><g id="ad-viz-in" style="transition:transform .5s cubic-bezier(.3,1.6,.5,1);transform:translateY(12px)">
      <path d="M368 360 C380 352 386 340 380 332 C376 342 370 350 362 354Z" fill="#8A7A6A" stroke="#4E4038" stroke-width="1.2"/>
      <ellipse cx="352" cy="352" rx="14" ry="11" fill="#C2B4A2" stroke="#5E5044" stroke-width="1.6"/>
      <path d="M340 334 C336 322 338 314 342 314 C346 318 346 326 344 334Z M348 332 C348 320 352 314 356 316 C358 322 354 328 352 334Z" fill="#C2B4A2" stroke="#5E5044" stroke-width="1.3"/><path d="M341 330 c-1 -6 0 -10 1.4 -11 M350 330 c1 -6 3 -9 4.4 -10" stroke="#E8B4A8" stroke-width="1.4" fill="none"/>
      <circle cx="344" cy="342" r="10" fill="#D2C6B4" stroke="#5E5044" stroke-width="1.6"/><circle cx="340" cy="340" r="2.4" fill="#1A1210"/><circle cx="340.8" cy="339.2" r=".8" fill="#fff"/><ellipse cx="335" cy="345" rx="2" ry="1.4" fill="#5E4038"/><path d="M336 348 l-8 1 M336 346 l-8 -2" stroke="#5E5044" stroke-width=".6"/></g>
      ${pedra(352, 366, 30, 16)}${pedra(380, 370, 16, 10)}<rect x="320" y="318" width="80" height="54" fill="transparent"/></g>
    <g id="ad-vila">
      <path d="M222 470 C240 446 300 424 360 430 C410 436 440 456 446 480 C420 496 300 498 240 490Z" fill="#B49A6A" opacity=".55"/>
      <path d="M232 474 C260 452 310 436 360 440" stroke="#8E7A4E" stroke-width="1" fill="none" opacity=".5" stroke-dasharray="3 4"/>
      ${casa(256, 452, 50, 30, '#C8502E', '#7A2A14')}${casa(318, 438, 44, 26, '#D8A44A', '#8A6418', true)}${casa(340, 478, 46, 28, '#B8482A', '#6E2210')}
      <g><path d="M222 466 C226 462 236 462 240 466 C246 462 254 464 256 468 L256 474 H222Z" fill="url(#adPedra)" stroke="#4A3E44" stroke-width="1.2"/><path d="M226 468 h8 M240 470 h10" stroke="#4A3E44" stroke-width=".8"/></g>
      <g id="ad-pila"><ellipse cx="404" cy="490" rx="30" ry="6" fill="#2E2418" opacity=".25"/><ellipse cx="404" cy="478" rx="26" ry="9" fill="#5E524C"/><path d="M378 478 V490 C390 498 418 498 430 490 V478" fill="url(#adPedra)" stroke="#3A3036" stroke-width="1.6"/><ellipse cx="404" cy="478" rx="26" ry="9" fill="none" stroke="#3A3036" stroke-width="1.6"/><path d="M380 476 C390 470 416 470 428 476" stroke="#E6DCD8" stroke-width="1.2" fill="none" opacity=".7"/><ellipse id="ad-pila-agua" cx="404" cy="479" rx="21" ry="6" fill="#3EAEE6" style="opacity:0;transition:opacity 1.2s"/><path d="M386 484 v8 M398 486 v9 M412 486 v9 M424 484 v7" stroke="#4A3E3A" stroke-width="1" opacity=".6"/>
        <path id="ad-bica" d="M428 472 Q418 470 414 478" stroke="#7FD0FF" stroke-width="3" fill="none" stroke-linecap="round" style="opacity:0"/></g>
      <g id="ad-crianca" class="toque"><path d="M376 498 v-12 M382 498 v-12" stroke="#2E3A6A" stroke-width="4.4" stroke-linecap="round"/><path d="M371 488 C371 472 387 472 387 488Z" fill="#E5392C" stroke="#7A1A14" stroke-width="1.4"/><path d="M372 482 h14 M372 478 h14" stroke="#FFC83D" stroke-width="1.4"/><path id="ad-braco" d="M386 478 l9 -9" stroke="#A8724A" stroke-width="3.6" stroke-linecap="round" style="transform-origin:386px 478px"/><circle cx="379" cy="466" r="7.4" fill="#B8804E" stroke="#5E3414" stroke-width="1.4"/><path d="M371 464 C371 454 387 454 387 464 L389 466 H369Z" fill="#3E8AD6" stroke="#1E4A8A" stroke-width="1.2"/><path d="M379 455 v-3" stroke="#FFC83D" stroke-width="2.4" stroke-linecap="round"/><circle cx="381.6" cy="466.6" r="1.2" fill="#1A1210"/><path d="M379 470 q2.4 1.6 4 0" stroke="#5E3414" stroke-width="1" fill="none"/><rect x="364" y="448" width="34" height="52" fill="transparent"/></g>
    </g>
    ${PORTAS.map(porta).join('')}
    <path d="M0 448 C70 432 150 440 210 458 C260 472 300 486 330 500 H0Z" fill="url(#adFrente)" stroke="#4E5622" stroke-width="2"/>
    <path d="M0 450 C70 434 150 442 210 460" stroke="#D2DC7A" stroke-width="2" fill="none" opacity=".6"/>
    <g>${Array.from({ length:34 }, () => { const x = R(0, 300), y = R(452, 500); if (y < 440 + x * .1) return ''; return tufo(x, y, R(1.2, 1.7), '#D8E880', '#3E5A1E'); }).join('')}</g>
    ${yareta(96, 484, 12)}${pedra(300, 496, 12, 7)}
    <g id="ad-quilla" class="toque" data-fig="lhama"><ellipse cx="82" cy="468" rx="44" ry="6" fill="#2E3410" opacity=".3"/><g id="ad-quilla-in" style="transform-origin:84px 472px"><svg x="18" y="332" width="128" height="139" viewBox="0 0 120 130"><use href="#f-lhama"/></svg></g>${brilhoHotspot(136, 350)}</g>
    <g id="ad-flores" class="toque">${flor(176, 478, 4.6, '#FF8A2A', '#A8400E')}${flor(194, 486, 4, '#FFD447', '#A07A08', '#E5392C')}${flor(214, 476, 4.2, '#FF5A8A', '#A02A50')}${flor(232, 488, 3.4, '#FFFFFF', '#8A7AA8')}${lupino(160, 494, 30)}${lupino(232, 494, 24)}${lupino(246, 496, 20)}<rect x="150" y="458" width="94" height="40" fill="transparent"/></g>
    ${ichu(10, 500, 44, '#F2DC8A', '#9A8A3A')}${ichu(40, 500, 34, '#E8CE6E', '#8A7A2E')}${ichu(150, 500, 30, '#F2DC8A', '#9A8A3A')}${ichu(280, 500, 26, '#E8CE6E', '#8A7A2E')}${ichu(486, 500, 30, '#F2DC8A', '#9A8A3A')}
    ${queuna(770, 500, 1.15)}${ichu(720, 500, 36, '#E8CE6E', '#8A7A2E')}${ichu(796, 500, 30, '#F2DC8A', '#9A8A3A')}
    <g id="ad-condor" class="toque" data-fig="condor"><g class="deriva" style="animation-duration:22s"><g id="ad-condor-voo"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><svg x="548" y="196" width="116" height="68" viewBox="0 0 170 100"><use href="#f-condor"/></svg></g></g></g>${brilhoHotspot(652, 204)}</g>
    <g id="ad-inverno" pointer-events="none" style="transition:opacity 1.2s"><rect width="800" height="500" fill="#B4C6E8" opacity=".3"/></g>
    <g id="ad-nuvens">${NUVENS.map((n, i) => `<g class="ad-nuvem toque" data-i="${i}" style="transition:opacity 1.2s"><g style="animation:flutua ${(3 + i * .5).toFixed(1)}s ease-in-out infinite alternate"><use href="#nuvem" x="${n.x - 72}" y="${n.y - 30}" width="144" height="70" style="color:#7E8AA6"/><use href="#nuvem" x="${n.x - 68}" y="${n.y - 30}" width="136" height="64" style="color:#E8EEF6"/><use href="#nuvem" x="${n.x - 46}" y="${n.y - 4}" width="92" height="38" style="color:#BAC4D8"/><path d="M${n.x - 50} ${n.y - 6} q12 -9 28 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g class="ad-dica">${brilhoHotspot(n.x + 46, n.y - 14)}</g></g><rect x="${n.x - 74}" y="${n.y - 34}" width="148" height="76" fill="transparent"/></g>`).join('')}</g>
    <g id="ad-sol-trilha" style="display:none"><path d="M${SOL0.x} ${SOL0.y} Q400 ${SOL0.y - 150} ${SOL1.x} ${SOL1.y}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 10" opacity=".9"/><path d="M${SOL1.x - 4} ${SOL1.y + 2} l12 -2 l-6 -11Z" fill="#fff"/></g>
    <g id="ad-sol" class="toque" style="display:none;cursor:grab"><g id="ad-sol-pos"><circle r="50" fill="#FFE27A" opacity=".22"/><circle r="38" fill="#FFE27A" opacity=".3"/><circle r="26" fill="url(#adSolG)" stroke="#E8901A" stroke-width="2.4"/><path d="M-14 -10 q8 -9 20 -9" stroke="#FFF8D2" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-8" cy="2" r="2.2" fill="#8A4A0E"/><circle cx="8" cy="2" r="2.2" fill="#8A4A0E"/><path d="M-6 9 q6 5 12 0" stroke="#8A4A0E" stroke-width="2" fill="none" stroke-linecap="round"/><g id="ad-sol-hint">${brilhoHotspot(22, -22)}</g><circle r="48" fill="transparent"/></g></g>
    <rect width="800" height="500" fill="url(#adVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#adGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  /* geleira desenhada pela posição da ponta (y): circo de neve no alto, língua de gelo entre morenas, fendas e frente com caverna de gelo */
  const corpo = el(s, '#ad-gelo-corpo'), fenda = el(s, '#ad-gelo-fenda'), frente = el(s, '#ad-gelo-frente'), luz = el(s, '#ad-gelo-luz'), sombra = el(s, '#ad-gelo-sombra'), boca = el(s, '#ad-gelo-boca'), medial = el(s, '#ad-gelo-moraina');
  const sujo = el(s, '#ad-gelo-sujo');
  function desenhaGelo(y){
    const f = n => n.toFixed(1), fim = Math.max(158, y - 8), E = [], D = [];
    for (let yy = 150; yy < fim; yy += 5) { E.push([GX(yy) - GW(yy) + 1.4 * Math.sin(yy * .21), yy]); D.push([GX(yy) + GW(yy) + 1.4 * Math.sin(yy * .17 + 1), yy]); }
    E.push([GX(fim) - GW(fim), fim]); D.push([GX(fim) + GW(fim), fim]);
    const P = a => a.map(p => `${f(p[0])} ${f(p[1])}`).join(' L'), cx = GX(y), w = GW(y);
    corpo.setAttribute('d', `M${P(E.slice().reverse())} C306 144 302 140 300 132 C296 128 298 122 294 116 C290 110 292 104 288 98 C286 90 290 84 292 78 L300 64 C312 74 326 88 338 98 C352 108 362 114 372 114 C380 112 386 108 392 104 C392 112 388 116 384 122 C380 126 382 132 376 136 C372 140 370 146 ${f(D[0][0])} 150 L${P(D)} Q${f(cx + 2)} ${f(y + 10)} ${f(E[E.length - 1][0])} ${f(E[E.length - 1][1])}Z`);
    sombra.setAttribute('d', `M${f(GX(150) + GW(150) * .25)} 150 L${P(D)} Q${f(cx + w * .6)} ${f(y + 4)} ${f(cx + w * .3)} ${f(y + 2)} L${P(D.slice().reverse().map(p => [GX(p[1]) + GW(p[1]) * .25, p[1]]))}Z`);
    let d = '';
    for (let yy = 162, k = 0; yy < y - 14; yy += 13, k++) { const m = GX(yy), g = GD(yy), a1 = GW(yy) - 4 - (k % 2) * 5, a2 = GW(yy) - 4 - ((k + 1) % 2) * 6;
      d += `M${f(m - a1)} ${f(yy + a1 * g)} Q${f(m + 6 * g)} ${f(yy + 6)} ${f(m + a2)} ${f(yy - a2 * g)} Q${f(m + 3.5 * g)} ${f(yy + 3.6)} ${f(m - a1)} ${f(yy + a1 * g)}Z `; }
    d += 'M314 116 Q324 124 336 126 Q324 122 314 116Z M306 130 Q318 138 330 140 Q318 136 306 130Z';
    fenda.setAttribute('d', d);
    frente.setAttribute('d', `M${f(cx - w + 1)} ${f(y - 12)} Q${f(cx + 2)} ${f(y + 10)} ${f(cx + w - 1)} ${f(y - 12)} Q${f(cx + 1)} ${f(y - 1)} ${f(cx - w + 1)} ${f(y - 12)}Z`);
    sujo.setAttribute('d', [[-8, -6, 1.6], [-3, -3, 1.2], [5, -5, 1.5], [9, -9, 1], [-11, -11, 1.1], [1, -12, 1], [12, -12, 1.2], [-6, -15, .9]].map(([dx, dy, r]) => `M${f(cx + dx - r)} ${f(y + dy)} a${r} ${r} 0 1 0 ${f(2 * r)} 0 a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`).join(' ') + ` M${f(cx - w + 3)} ${f(y - 16)} Q${f(cx)} ${f(y - 9)} ${f(cx + w - 3)} ${f(y - 17)} Q${f(cx)} ${f(y - 12)} ${f(cx - w + 3)} ${f(y - 16)}Z`);
    boca.setAttribute('d', y > 192 ? `M${f(cx - 5)} ${f(y + 1)} Q${f(cx - 5)} ${f(y - 7)} ${f(cx + 1)} ${f(y - 7.5)} Q${f(cx + 7)} ${f(y - 7)} ${f(cx + 7)} ${f(y + 1)} Q${f(cx + 1)} ${f(y + 2.4)} ${f(cx - 5)} ${f(y + 1)}Z` : '');
    const ml = []; for (let yy = 156; yy < y - 4; yy += 6) ml.push([GX(yy) + 4, yy]);
    medial.setAttribute('d', ml.length > 1 ? `M${P(ml)}` : '');
    const lz = []; for (let yy = 156; yy < y - 14; yy += 6) lz.push([GX(yy) - GW(yy) + 4, yy]);
    luz.setAttribute('d', `M292 86 C294 104 300 122 312 136` + (lz.length > 1 ? ` M${P(lz)}` : ''));
  }
  desenhaGelo(geloY);
  const fluxos = [...s.querySelectorAll('.ad-fluxo, .ad-fluxo2')];
  fluxos.forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-30 }], { duration:900, iterations:Infinity }));
  /* 1. neve: tocar nas nuvens para nevar nos picos */
  const nuvens = [...s.querySelectorAll('.ad-nuvem')], camadas = [...s.querySelectorAll('.ad-neve')];
  nuvens.forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'neve' || g.dataset.feito || ocupado) return; g.dataset.feito = 1; ocupado = true;
    const n = NUVENS[+g.dataset.i]; el(g, '.ad-dica').style.display = 'none'; toca('chuva');
    g.animate([{ transform:'translateY(0)' }, { transform:'translateY(4px)' }, { transform:'translateY(0)' }], { duration:500, iterations:3 });
    for (let i = 0; i < 60; i++) c.add({ tipo:'floco', x:sorte(n.a, n.b), y:n.y + sorte(0, 16) - i * 3, vy:sorte(.9, 1.5), f:sorte(0, 6), r:sorte(2, 3.8), chao:sorte(...n.chao) });
    depois(1500, () => {
      neves++; camadas[neves - 1] && (camadas[neves - 1].style.opacity = 1); geloAlvo = 182 + neves * 33;
      c.brilhos(372, 140 + neves * 24, 6, '#FFFFFF'); toca('ok');
      api.hud(`<span class="chip">Neve: ${neves}/3</span>`);
      depois(1300, () => { g.style.opacity = 0; g.style.pointerEvents = 'none'; ocupado = false; });
      if (neves === 1) api.diz('A neve se acumula no alto, camada sobre camada.');
      if (neves === 2) api.diz('A neve fica tão apertada que vira gelo. A geleira está crescendo!');
      if (neves === 3) { toca('vitoria'); api.diz('Que geleira grande! Ela é a caixa-d\'água da montanha: guarda a água do inverno em forma de gelo.'); depois(5600, comecaVerao); }
    });
  }));
  /* 2. verão: arrastar o sol pelo céu, a geleira derrete devagar e enche o lago */
  const solG = el(s, '#ad-sol'), solPos = el(s, '#ad-sol-pos'), trilha = el(s, '#ad-sol-trilha');
  const poeSol = u => { const p = solXY(u); solPos.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); };
  let solU = 0;
  function comecaVerao(){
    fase = 'sol'; solG.style.display = ''; trilha.style.display = ''; poeSol(0);
    trilha.animate([{ opacity:.25 }, { opacity:1 }, { opacity:.25 }], { duration:1600, iterations:Infinity });
    api.hud('<span class="chip">Degelo: 0/4</span>');
    api.diz('Chegou o verão! Arraste o sol pelo céu, de um lado ao outro.');
  }
  function derrete(u){
    if (u <= derr) return; derr = Math.min(1, u);
    el(s, '#ad-inverno').style.opacity = (1 - derr).toFixed(2);
    geloAlvo = 281 - 30 * derr;
    el(s, '#ad-riachos').style.opacity = derr > .04 ? 1 : 0;
    el(s, '#ad-riacho1').setAttribute('stroke-width', (1.5 + derr * 4).toFixed(1)); el(s, '#ad-riacho2').setAttribute('stroke-width', (1 + derr * 3).toFixed(1));
    el(s, '#ad-agua').style.transform = `scale(${(.22 + .78 * derr).toFixed(2)})`;
    el(s, '#ad-verde').style.opacity = (derr * .55).toFixed(2);
    if (Math.random() < .5) c.add({ tipo:'infiltra', x0:GX(geloY) + sorte(-10, 10), y0:geloY - 4, x1:440 + sorte(-6, 6), y1:LAGO.y - 4, dur:sorte(40, 70), f:sorte(0, 6) });
    const m = Math.floor(derr * 4 + .001);
    if (m > marco) {
      marco = m; toca('splash'); api.hud(`<span class="chip">Degelo: ${marco}/4</span>`);
      for (let i = 0; i < 4; i++) c.add({ tipo:'respingo', x:LAGO.x + sorte(-50, 50), y:LAGO.y + sorte(-4, 8), t:i * 2, cor:'#E6FFFF' });
      if (marco === 1) api.diz('O sol derrete a ponta da geleira bem devagarinho.');
      if (marco === 2) api.diz('A água do degelo desce a montanha em riachos.');
      if (marco === 3) api.diz('O lago está enchendo! A água de geleira fica azul-turquesa.');
      if (marco === 4) { fase = 'regar'; toca('vitoria'); trilha.style.display = 'none'; el(s, '#ad-sol-hint').style.display = 'none'; solG.style.cursor = '';
        api.diz('Mesmo sem chuva, a geleira solta água o verão inteiro, bem na época seca!'); depois(5200, comecaCanais); }
    }
  }
  let pegaSol = null, animSol = false;
  solG.addEventListener('pointerdown', e => { if (fase !== 'sol' || animSol) return; e.stopPropagation(); const p = c.ponto(e); pegaSol = { x0:p.x, y0:p.y, moveu:false }; s.setPointerCapture(e.pointerId); solG.style.cursor = 'grabbing'; toca('clique'); });
  s.addEventListener('pointermove', e => { if (!pegaSol) return; const p = c.ponto(e); if (Math.hypot(p.x - pegaSol.x0, p.y - pegaSol.y0) > 8) pegaSol.moveu = true; if (!pegaSol.moveu) return;
    const u = Math.max(solU, Math.min(1, (p.x - SOL0.x) / (SOL1.x - SOL0.x))); solU = u; poeSol(u); derrete(u); });
  s.addEventListener('pointerup', () => { if (!pegaSol) return; const m = pegaSol.moveu; pegaSol = null; solG.style.cursor = fase === 'sol' ? 'grab' : '';
    if (!m && fase === 'sol') { const u0 = solU, u1 = Math.min(1, Math.floor(solU * 4 + .001) / 4 + .25), t0 = performance.now(); animSol = true; toca('vapor');
      (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 1200); solU = u0 + (u1 - u0) * k; poeSol(solU); derrete(solU); if (k < 1) requestAnimationFrame(q); else animSol = false; })(t0); } });
  /* 3. canais: abrir as comportas de pedra para regar os terraços e levar água à vila */
  function comecaCanais(){
    fase = 'canais';
    const ag = el(s, '#ad-canal-agua'), L = ag.getTotalLength(); ag.style.opacity = 1; ag.style.strokeDasharray = L; ag.style.strokeDashoffset = L;
    ag.animate([{ strokeDashoffset:L }, { strokeDashoffset:0 }], { duration:1800, fill:'forwards', easing:'ease-out' });
    depois(1800, () => { el(s, '.ad-fluxo2').style.opacity = .9; s.querySelectorAll('.ad-porta .ad-dica').forEach(h => h.style.display = ''); });
    toca('splash'); api.hud('<span class="chip">Canais: 0/4</span>');
    api.diz('A água precisa chegar às plantações e à vila. Toque nas comportas de pedra para abrir os canais!');
  }
  const FALAS = ['Quinoa! Ela cresce bem no frio, lá no alto da montanha.', 'Batata! Nos Andes existem milhares de tipos de batata.', 'Arroz em degraus! Os terraços seguram a água e a terra no morro.', 'A água chegou na vila! As pessoas usam para beber, cozinhar e lavar.'];
  s.querySelectorAll('.ad-porta').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); const i = +g.dataset.i;
    if (fase !== 'canais') { toca('clique'); api.diz('É uma comporta de pedra. Ela abre e fecha o caminho da água nos canais.'); return; }
    if (g.dataset.feito) return; g.dataset.feito = 1; abertos++;
    el(g, '.ad-tabua').style.transform = 'translateY(-13px)'; el(g, '.ad-dica').style.display = 'none'; toca('clique');
    const ramo = s.querySelectorAll('.ad-ramo')[i], ag = el(ramo, '.ad-ramo-agua'), L = ag.getTotalLength();
    ag.style.opacity = 1; ag.style.strokeDasharray = L; ag.animate([{ strokeDashoffset:L }, { strokeDashoffset:0 }], { duration:i === 3 ? 700 : 1600, fill:'forwards', easing:'ease-out' });
    depois(i === 3 ? 700 : 1600, () => { const fl = el(ramo, '.ad-ramo-fluxo'); fl.style.opacity = .9; fl.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-30 }], { duration:900, iterations:Infinity }); });
    depois(900, () => toca('splash'));
    if (i < 3) {
      const t = s.querySelectorAll('.ad-terraco')[i];
      depois(1200, () => { el(t, '.ad-umido').style.opacity = 1; });
      depois(1900, () => { t.querySelectorAll('.ad-planta').forEach(p => p.style.transform = 'scale(1)'); toca('planta'); c.brilhos(700, LINHAS[i].y - 6, 8, '#FFE27A'); });
    } else {
      depois(700, () => { el(s, '#ad-bica').style.opacity = 1; el(s, '#ad-pila-agua').style.opacity = 1; for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:412 + sorte(-6, 6), y:478, t:k * 3, cor:'#E6F6FF' }); });
      depois(1500, () => { el(s, '#ad-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-35deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:3 }); c.brilhos(404, 466, 6, '#BFF4FF'); });
    }
    api.hud(`<span class="chip">Canais: ${abertos}/4</span>`);
    if (abertos < 4) api.diz(FALAS[i]);
    else { depois(2200, () => { fase = 'fim'; toca('vitoria'); api.diz('As geleiras guardam água no inverno e soltam devagar no tempo seco. Mas o planeta está esquentando e elas estão encolhendo. Por isso precisamos cuidar delas!'); depois(6800, api.fim); }); api.diz(FALAS[i]); }
  }));
  /* toques extras */
  el(s, '#ad-quilla').addEventListener('click', () => {
    [196, 220, 208, 186].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .32, 'triangle', .05, f * 1.06), i * 260));
    el(s, '#ad-quilla-in').animate([{ transform:'translateY(0) rotate(0)' }, { transform:'translateY(-8px) rotate(-2deg)' }, { transform:'translateY(0) rotate(0)' }, { transform:'translateY(-4px) rotate(1deg)' }, { transform:'translateY(0)' }], { duration:900 });
    api.diz(fase === 'neve' ? 'Hmmm! Lhamas cantarolam assim para conversar. Toque nas nuvens para nevar!' : fase === 'sol' ? 'Hmmm! Arraste o sol pelo céu para chegar o verão.' : 'Hmmm! Meu pelo grosso me esquenta no frio da montanha.');
  });
  let condorOcupado = false;
  el(s, '#ad-condor').addEventListener('click', () => { toca('pop'); if (condorOcupado) return; condorOcupado = true;
    const v = el(s, '#ad-condor-voo').animate([{ transform:'translate(0,0)' }, { transform:'translate(-120px,-70px)' }, { transform:'translate(-220px,-20px)' }, { transform:'translate(-100px,30px)' }, { transform:'translate(0,0)' }], { duration:5200, easing:'ease-in-out' });
    v.onfinish = () => { condorOcupado = false; };
    api.diz('O condor-dos-andes quase não bate as asas: ele plana no ar quente que sobe a montanha.'); });
  el(s, '#ad-iaque').addEventListener('click', () => { [92, 84].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .4, 'sawtooth', .04, f * .8), i * 380));
    el(s, '#ad-iaque-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-3deg)' }, { transform:'rotate(2deg)' }, { transform:'rotate(0)' }], { duration:700 });
    api.diz('Um iaque do Himalaia! Ele grunhe em vez de mugir, e o pelo comprido aguenta muito frio.'); });
  let leoOcupado = false;
  el(s, '#ad-leopardo').addEventListener('click', () => { if (leoOcupado) return; leoOcupado = true; toca('pop'); el(s, '#ad-leo-in').style.transform = 'translateY(-18px)';
    api.diz('Um leopardo-das-neves! Ele enrola a cauda peluda no corpo como um cachecol.');
    depois(2600, () => { el(s, '#ad-leo-in').style.transform = ''; leoOcupado = false; }); });
  let vizOcupada = false;
  el(s, '#ad-vizcacha').addEventListener('click', e => { e.stopPropagation(); if (vizOcupada) return; vizOcupada = true; toca('pop'); el(s, '#ad-viz-in').style.transform = 'translateY(-6px)';
    api.diz('Uma viscacha! Parece coelho, mas é parente da chinchila.'); depois(2200, () => { el(s, '#ad-viz-in').style.transform = 'translateY(12px)'; vizOcupada = false; }); });
  el(s, '#ad-flores').addEventListener('click', e => { e.stopPropagation(); toca('planta');
    for (let i = 0; i < 10; i++) c.add({ tipo:'petala', x:200 + sorte(-44, 44), y:440 - i * 5, vy:sorte(.5, 1), f:sorte(0, 6), chao:500, cor:['#FF8A2A', '#FFD447', '#FF5A8A', '#B57BFF'][i % 4], borda:'#7A3A1E' });
    api.diz('Lá no alto as plantas são baixinhas, para fugir do vento gelado.'); });
  el(s, '#ad-lago').addEventListener('click', e => { e.stopPropagation(); const p = c.ponto(e); toca(derr > .3 ? 'splash' : 'clique');
    if (derr > .3) { for (let i = 0; i < 3; i++) c.add({ tipo:'respingo', x:p.x, y:p.y, t:i * 3, cor:'#E6FFFF' }); api.diz('A água do lago é geladinha, porque vem da geleira!'); }
    else api.diz('O lago está quase seco. Ele espera a água da geleira.'); });
  el(s, '#ad-crianca').addEventListener('click', e => { e.stopPropagation(); toca('pop'); el(s, '#ad-braco').animate([{ transform:'rotate(0)' }, { transform:'rotate(-35deg)' }, { transform:'rotate(10deg)' }, { transform:'rotate(0)' }], { duration:700, iterations:2 });
    api.diz(abertos >= 4 ? 'Obrigada! Agora tem água na vila!' : 'Oi! A água da nossa vila vem lá da geleira.'); });
  el(s, '#ad-gelo').addEventListener('click', e => { e.stopPropagation(); toca('clique'); c.brilhos(372, geloY - 60, 4, '#FFFFFF'); api.diz('Uma geleira é um rio de gelo. Ela escorrega montanha abaixo bem devagar.'); });
  /* vida: neve caindo no inverno e a geleira se ajustando */
  let ultN = 0;
  (function vida(t){ if (!vivo) return;
    if (Math.abs(geloAlvo - geloY) > .2) { geloY += (geloAlvo - geloY) * .04; desenhaGelo(geloY); }
    if (fase === 'neve' && t - ultN > 300) { ultN = t; c.add({ tipo:'floco', x:sorte(0, 800), y:-6, vy:sorte(.5, 1), f:sorte(0, 6), r:sorte(1.2, 2.6), chao:sorte(200, 480) }); }
    requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Neve: 0/3</span>');
  api.diz('Oi, eu sou a Quilla, uma lhama! Aqui no alto faz muito frio. Toque nas nuvens para nevar nas montanhas.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 11: Desertos, bichos que guardam água ================= */
function jogoDeserto(palco, api){
  semente = 23;
  let vivo = true, fase = 'neblina', gotas = 0, chuvas = 0, achou = 0, goles = 0, ocupado = false, falaFeco = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const tw = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k, k*k*(3-2*k)); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const lgd = (id, st, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 === undefined ? 1 : y2}">${st.map((c, i) => `<stop offset="${(i / (st.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const BES = [{ x:200, y:472 }, { x:292, y:482 }, { x:378, y:474 }];
  const VAGA = [{ x:402, y:268 }, { x:470, y:220 }, { x:580, y:208 }];
  const SUPB = 450, SUPC = 396;
  const COVA = [{ x:268, y:404 }, { x:440, y:410 }, { x:600, y:404 }];
  const FECO = [{ x:740, y:484 }, { x:78, y:470 }, { x:74, y:400 }];
  const SOL = [{ x:660, y:236, s:1.25 }, { x:712, y:78, s:.9 }, { x:176, y:128, s:1.1 }];
  /* ---------- desenhos ---------- */
  const besouro = (i, x, y) => `<g class="de-bes toque" data-i="${i}" data-fig="besouro" transform="translate(${x} ${y}) scale(1.2)" style="cursor:grab"><g class="de-bes-pose">
      <ellipse cx="2" cy="1" rx="25" ry="3.2" fill="#2A1020" opacity=".3"/>
      <g class="de-pernas" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#2E2440" stroke-width="1.7"><path d="M-6 -10 L-13 -18 L-19 -1 L-21 0"/><path d="M4 -9 L9 -17 L7 0 L9 .6"/><path d="M15 -10 L27 -19 L30 0 L33 .4"/></g>
        <g stroke="#0C0812" stroke-width="2.7"><path d="M-8 -9 L-18 -15 L-25 -.5 L-29 .6"/><path d="M1 -8 L-2 -14 L-7 .2 L-10 .8"/><path d="M11 -8 L22 -16 L33 0 L37 .6"/></g>
        <g stroke="#8E84B4" stroke-width=".8" opacity=".85"><path d="M-9 -10.2 L-17 -15"/><path d="M12 -9.4 L21 -15.8"/><path d="M-19 -13.6 L-24 -2"/><path d="M23 -14.6 L31 -2"/></g>
        <g fill="#0C0812"><circle cx="-18" cy="-15" r="1.6"/><circle cx="-2" cy="-14" r="1.4"/><circle cx="22" cy="-16" r="1.6"/></g>
      </g>
      <path d="M-22 -14 q-5 -6 -11 -7 M-21 -13 q-7 -2 -12 2" stroke="#120E18" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <g fill="#120E18"><circle cx="-33" cy="-21" r="1.3"/><circle cx="-31" cy="-21.3" r="1"/><circle cx="-33" cy="-11" r="1.3"/><circle cx="-31" cy="-11.4" r="1"/></g>
      <path d="M-6 -12 C-7 -22 2 -30 11 -30 C21 -30 27 -22 26 -15 C25 -9 18 -6 9 -6 C1 -6 -5 -8 -6 -12Z" fill="url(#deBes)" stroke="#06040A" stroke-width="1.5"/>
      <path d="M-3 -9 C4 -6.6 16 -6.6 24 -11" stroke="#7E72B0" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/>
      <path d="M-4 -17 C3 -27 17 -28 25 -17" stroke="#06040A" stroke-width=".9" fill="none" opacity=".7"/>
      <g fill="#C8BEEA" opacity=".42">${[[2, -21], [7, -24], [13, -25], [19, -22], [5, -15], [11, -17], [17, -15], [22, -14], [0, -12], [8, -10], [15, -10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".85"/>`).join('')}</g>
      <path d="M1 -24 C5 -28.4 12 -29 18 -27" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>
      <circle cx="3.4" cy="-21.6" r="1.3" fill="#FFFFFF" opacity=".85"/>
      <path d="M-14 -9 C-16 -15 -12 -20 -6 -20 C-2 -19 0 -15 -1 -10 C-3 -7 -10 -6 -14 -9Z" fill="url(#deBesCab)" stroke="#06040A" stroke-width="1.4"/>
      <path d="M-11 -16 C-9 -18.4 -6 -18.8 -4 -18" stroke="#B4AADC" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="-19.5" cy="-11" rx="6" ry="5.4" fill="url(#deBesCab)" stroke="#06040A" stroke-width="1.4"/>
      <path d="M-24.6 -8.4 l-2.6 1.4 M-24 -6.8 l-1.6 2" stroke="#06040A" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="-21.4" cy="-12.6" r="2.7" fill="#F4F0FF" stroke="#06040A" stroke-width=".7"/><circle cx="-22" cy="-12.4" r="1.7" fill="#120E18"/><circle cx="-22.6" cy="-13.2" r=".7" fill="#fff"/><circle cx="-21.3" cy="-11.6" r=".35" fill="#fff" opacity=".8"/>
      <path d="M-17 -15.4 C-16 -16.4 -14.6 -16.6 -13.6 -16" stroke="#9A90C4" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/>
      <g class="de-gotas">${[[12, -27], [4, -25.6], [20, -21], [-2, -17.6]].map(([gx, gy]) => `<g transform="translate(${gx} ${gy})"><g class="de-g" style="transform:scale(0)"><path d="M0 -4.2 C1.6 -2.2 3.2 -.6 3.2 1 A3.2 3.2 0 0 1 -3.2 1 C-3.2 -.6 -1.6 -2.2 0 -4.2Z" fill="url(#deGotaG)" stroke="#2E7BC4" stroke-width=".9"/><ellipse cx="-1.1" cy="-.2" rx=".8" ry="1.3" fill="#fff"/><circle cx="1.3" cy="2" r=".5" fill="#fff" opacity=".7"/></g></g>`).join('')}</g>
    </g><rect x="-36" y="-36" width="76" height="42" fill="transparent"/>${i === 1 ? brilhoHotspot(14, -38) : ''}</g>`;
  const feco = `<g id="de-feco-pula">
      <ellipse cx="6" cy="2" rx="44" ry="6.4" fill="#3A1A14" opacity=".26"/>
      <path d="M14 -6 C42 -2 60 -18 54 -42 C50 -56 36 -54 38 -42 C42 -28 32 -18 12 -18Z" fill="url(#deFcCauda)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 -10 C36 -10 48 -20 48 -34" stroke="#FFE8C4" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M54 -42 C50 -56 36 -54 38 -42 L40 -45 L42 -42 L44 -46 L47 -42 L50 -46 L52 -41Z" fill="#4A2A18" stroke="#2A140A" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M-22 -2 C-27 -24 -18 -46 0 -48 C18 -46 27 -24 22 -2Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2"/>
      <path d="M12 -40 C20 -32 23 -18 21 -4 C16 -10 14 -24 12 -40Z" fill="#B97A40" opacity=".35"/>
      <path d="M-10 -4 C-13 -20 -9 -32 -5 -37 L-3 -33 L-1 -38 L1 -33 L3 -38 L5 -33 L7 -36 C11 -28 13 -18 10 -4Z" fill="#FFF6E8"/>
      <path d="M-6 -24 q2 3 0 6 M4 -26 q-2 3 0 6 M-1 -16 q2 3 0 6" stroke="#EAD2B0" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <path d="M-12 -4 V-18 M10 -4 V-18" stroke="#D9A066" stroke-width="7" stroke-linecap="round"/>
      <path d="M-14 -16 V-6 M8 -16 V-6" stroke="#F4CE98" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="-12" cy="-2" rx="7.4" ry="4.2" fill="#FFF4E2" stroke="#8A5626" stroke-width="1.4"/><ellipse cx="10" cy="-2" rx="7.4" ry="4.2" fill="#FFF4E2" stroke="#8A5626" stroke-width="1.4"/>
      <path d="M-14.6 -.4 v-2.4 M-11.4 0 v-2.6 M7.4 -.4 v-2.4 M10.6 0 v-2.6" stroke="#B88A5A" stroke-width="1" stroke-linecap="round"/>
      <g class="de-orelha" style="transform-box:fill-box;transform-origin:80% 95%"><path d="M-10 -64 C-26 -80 -38 -104 -34 -120 C-20 -112 -6 -94 -1 -74Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/><path d="M-11 -70 C-22 -84 -30 -100 -30 -112 C-20 -103 -10 -90 -6 -76Z" fill="url(#deFcOrelha)"/><path d="M-12 -72 l-5 -2 M-14 -76 l-5 -1 M-16 -80 l-5 0 M-9 -74 l-1 -5" stroke="#FFF8EC" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><path d="M-30 -112 C-32 -104 -32 -96 -28 -88" stroke="#C88A5A" stroke-width="1.2" fill="none" opacity=".6"/></g>
      <g class="de-orelha" style="transform-box:fill-box;transform-origin:20% 95%"><path d="M10 -64 C26 -80 38 -104 34 -120 C20 -112 6 -94 1 -74Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2" stroke-linejoin="round"/><path d="M11 -70 C22 -84 30 -100 30 -112 C20 -103 10 -90 6 -76Z" fill="url(#deFcOrelha)"/><path d="M12 -72 l5 -2 M14 -76 l5 -1 M16 -80 l5 0 M9 -74 l1 -5" stroke="#FFF8EC" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><path d="M30 -112 C32 -104 32 -96 28 -88" stroke="#C88A5A" stroke-width="1.2" fill="none" opacity=".6"/></g>
      <path d="M-22 -62 C-24 -78 -10 -84 0 -84 C10 -84 24 -78 22 -62 C20 -50 9 -44 0 -44 C-9 -44 -20 -50 -22 -62Z" fill="url(#deFcPelo)" stroke="#8A5626" stroke-width="2"/>
      <path d="M-21 -60 L-27 -57 L-22 -55 L-26 -51 L-19 -51 C-20 -54 -21 -57 -21 -60Z M21 -60 L27 -57 L22 -55 L26 -51 L19 -51 C20 -54 21 -57 21 -60Z" fill="#FFF4E2" stroke="#C99A66" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M-16 -74 C-10 -80 -2 -81 6 -79" stroke="#FFEACB" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M-4 -82 l1 4 M1 -83 l0 4 M5 -82 l-1 4" stroke="#C88A50" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      <path d="M-10 -55 C-8 -62 8 -62 10 -55 C8 -46 -8 -46 -10 -55Z" fill="#FFF6E8"/>
      <ellipse cx="-14" cy="-56" rx="4" ry="2.4" fill="#FF8E8E" opacity=".5"/><ellipse cx="14" cy="-56" rx="4" ry="2.4" fill="#FF8E8E" opacity=".5"/>
      <g class="de-olhos"><ellipse cx="-8.5" cy="-65" rx="4.6" ry="5.6" fill="#1E120C"/><ellipse cx="8.5" cy="-65" rx="4.6" ry="5.6" fill="#1E120C"/><ellipse cx="-8.5" cy="-63.6" rx="3" ry="3.4" fill="#4A2C1A"/><ellipse cx="8.5" cy="-63.6" rx="3" ry="3.4" fill="#4A2C1A"/><circle cx="-7" cy="-67" r="1.8" fill="#fff"/><circle cx="10" cy="-67" r="1.8" fill="#fff"/><circle cx="-9.8" cy="-62.8" r=".8" fill="#fff" opacity=".85"/><circle cx="7.2" cy="-62.8" r=".8" fill="#fff" opacity=".85"/></g>
      <path d="M-13 -69.6 C-11 -71.4 -7 -71.6 -5 -70 M13 -69.6 C11 -71.4 7 -71.6 5 -70" stroke="#8A5626" stroke-width="1" fill="none" stroke-linecap="round" opacity=".6"/>
      <ellipse cx="0" cy="-56" rx="3.6" ry="2.5" fill="#1E120C"/><ellipse cx="-1" cy="-56.9" rx="1.2" ry=".7" fill="#fff" opacity=".85"/>
      <path d="M0 -53.6 v2 M0 -51.6 q-3 2.4 -5 .4 M0 -51.6 q3 2.4 5 .4" stroke="#5A3420" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <g stroke="#7A5638" stroke-width=".7" stroke-linecap="round" opacity=".6"><path d="M-6 -54 L-20 -57 M-6 -53 L-19 -51.6 M6 -54 L20 -57 M6 -53 L19 -51.6"/></g>
      <g fill="#8A5626" opacity=".55"><circle cx="-5" cy="-53.4" r=".5"/><circle cx="-6.6" cy="-54.6" r=".5"/><circle cx="5" cy="-53.4" r=".5"/><circle cx="6.6" cy="-54.6" r=".5"/></g>
    </g>`;
  const fronda = (x, y, a, L, cor, esc, luz) => {
    const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L * .5 + L * .42 * Math.abs(Math.cos(a)), mx = (x + ex) / 2, my = (y + ey) / 2 - L * .3;
    const B = t => [(1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * ex, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * ey];
    const D = t => { const dx = 2 * (1 - t) * (mx - x) + 2 * t * (ex - mx), dy = 2 * (1 - t) * (my - y) + 2 * t * (ey - my), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    const N = 13, A = [], Bs = [], f = v => v.toFixed(1);
    for (let k = 1; k < N; k++) {
      const t = k / N, [px, py] = B(t), [tx, ty] = D(t), nx = -ty, ny = tx, w = L * .2 * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), .7) + 1.5, cai = w * .5;
      A.push(`L${f(px + nx * w * .3)} ${f(py + ny * w * .3)} L${f(px + nx * w + tx * w * .8)} ${f(py + ny * w + ty * w * .8 + cai)}`);
      Bs.unshift(`L${f(px - nx * w + tx * w * .8)} ${f(py - ny * w + ty * w * .8 + cai)} L${f(px - nx * w * .3)} ${f(py - ny * w * .3)}`);
    }
    const d = `M${x} ${y} ${A.join(' ')} L${f(ex)} ${f(ey)} ${Bs.join(' ')}Z`;
    const rib = `M${x} ${y} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
    return `<path d="${d}" fill="${cor}" stroke="${esc}" stroke-width="1.3" stroke-linejoin="round"/><path d="${rib}" stroke="${esc}" stroke-width="2.2" fill="none" stroke-linecap="round"/>${luz ? `<path d="${rib}" stroke="${luz}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8" transform="translate(0 -1.4)"/>` : ''}`;
  };
  const palmeira = (x, y, h, inc, cor, esc, luz) => {
    const tx = x + inc, ty = y - h;
    let anel = '';
    for (let k = .08; k < .95; k += .07) { const px = x + inc * k * k, py = y - h * k; anel += `M${(px - 6).toFixed(1)} ${(py + 2).toFixed(1)} L${px.toFixed(1)} ${(py - 3).toFixed(1)} L${(px + 6).toFixed(1)} ${(py + 2).toFixed(1)} `; }
    const tronco = `M${x} ${y} Q${x} ${y - h * .5} ${tx} ${ty}`;
    const seca = [[2.25, 46], [.95, 44]].map(([a, L]) => fronda(tx, ty + 2, a, L * h / 150, '#C9964E', '#7A5222')).join('');
    const fr = [[-2.95, 64], [3.3, 44], [-.2, 66], [-2.45, 66], [-.65, 64], [-1.95, 58], [-1.25, 56]].map(([a, L], i) => fronda(tx, ty, a, L * h / 150, i % 2 ? cor : luz, esc, i % 2 ? luz : '#E8FFB0')).join('');
    const tamaras = [[-8, 12], [-4, 16], [0, 13], [4, 17], [8, 12], [-6, 20], [2, 21], [6, 22]].map(([dx, dy]) => `<ellipse cx="${(tx + dx).toFixed(1)}" cy="${(ty + dy).toFixed(1)}" rx="3" ry="3.8" fill="url(#deTamara)" stroke="#8A3E10" stroke-width=".9"/>`).join('');
    return `<g><ellipse cx="${x}" cy="${y + 2}" rx="28" ry="5" fill="#7A4A1A" opacity=".22"/>${seca}<path d="${tronco}" stroke="#5A3418" stroke-width="17" fill="none" stroke-linecap="round"/><path d="${tronco}" stroke="url(#deTronco)" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${anel}" stroke="#6E4220" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M${tx - 2} ${ty + 4} q-6 8 -6 14 M${tx + 2} ${ty + 4} q6 8 6 14" stroke="#E0A040" stroke-width="1.6" fill="none"/>${tamaras}${fr}<circle cx="${tx}" cy="${ty}" r="5" fill="${esc}"/></g>`;
  };
  const perna = (h, tras, fill, perto, p) => {
    const d = tras
      ? `M${h - 12} -86 C${h - 13} -66 ${h - 8} -54 ${h - 6} -44 C${h - 5} -36 ${h - 5} -30 ${h - 4.5} -24 C${h - 4} -18 ${h - 4} -12 ${h - 4.5} -8 C${h - 10} -6 ${h - 14} -3 ${h - 14} 0 H${h + 7} C${h + 7} -3 ${h + 5} -6 ${h + 3} -8 C${h + 3} -14 ${h + 3} -20 ${h + 4.5} -25 C${h + 7.5} -29 ${h + 8} -36 ${h + 6} -42 C${h + 12} -54 ${h + 15} -70 ${h + 13} -88Z`
      : `M${h - 10} -82 C${h - 11} -64 ${h - 6.5} -52 ${h - 5} -41 C${h - 7} -37 ${h - 7} -31 ${h - 5} -27 C${h - 4} -20 ${h - 4} -13 ${h - 4.5} -8 C${h - 10} -6 ${h - 14} -3 ${h - 14} 0 H${h + 7} C${h + 7} -3 ${h + 5} -6 ${h + 3} -8 C${h + 2.5} -13 ${h + 2.5} -20 ${h + 3.5} -27 C${h + 5.5} -31 ${h + 5.5} -37 ${h + 3.5} -41 C${h + 5} -52 ${h + 10} -64 ${h + 10} -82Z`;
    const ky = tras ? -28 : -34, kx = tras ? h + 3 : h - 1;
    return `<g class="de-dr-perna" data-p="${p}" data-x="${h}"><path d="${d}" fill="${fill}" stroke="#6E3E16" stroke-width="1.8" stroke-linejoin="round"/>
      <ellipse cx="${kx}" cy="${ky}" rx="5.4" ry="3.6" fill="${perto ? '#D9A464' : '#B07A40'}" opacity=".9"/><path d="M${kx - 4} ${ky - 1.6} q4 -2.6 8 0" stroke="#6E3E16" stroke-width="1" fill="none" opacity=".55"/>
      ${perto ? `<path d="M${h - 6} -74 C${h - 7} -60 ${h - 3} -50 ${h - 2} -42 M${h - 2} -24 V-12" stroke="#FFE4B4" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>` : ''}
      <path d="M${h - 13} -.6 C${h - 12} -4.6 ${h + 6} -4.6 ${h + 6.4} -.6Z" fill="${perto ? '#8A5A34' : '#6E4426'}" stroke="#4A2A12" stroke-width="1.2"/><path d="M${h - 3.4} -1 v-3.4" stroke="#4A2A12" stroke-width="1.1" stroke-linecap="round"/></g>`;
  };
  const dromedario = `<ellipse cx="8" cy="2" rx="80" ry="7.5" fill="#6A3A14" opacity=".26"/><ellipse cx="8" cy="1" rx="54" ry="4" fill="#4A2408" opacity=".18"/>
      <g id="de-dr-pernas-l">${perna(-20, false, 'url(#deDrPernaF)', false, 1)}${perna(52, true, 'url(#deDrPernaF)', false, 0)}</g>
      <g id="de-dr-pernas-p">${perna(-36, false, 'url(#deDrPerna)', true, 3)}${perna(38, true, 'url(#deDrPerna)', true, 2)}</g>
      <path d="M68 -94 C76 -82 77 -68 73 -56" stroke="#6E3E16" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M68 -94 C76 -82 77 -68 73 -56" stroke="#C99050" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M70 -60 C66 -54 67 -44 72 -40 C73 -45 76 -42 78 -40 C80 -46 79 -54 76 -60Z" fill="#5A3416" stroke="#3A1E0C" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-50 -84 C-54 -100 -44 -110 -28 -110 C-20 -134 -2 -150 16 -150 C36 -150 50 -132 54 -112 C66 -108 74 -96 72 -82 C70 -66 60 -58 46 -58 C28 -56 -4 -54 -26 -57 C-42 -60 -48 -70 -50 -84Z" fill="url(#deDrCorpo)" stroke="#6E3E16" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M-44 -66 C-24 -60 10 -60 40 -62 C54 -63 64 -70 68 -76 C66 -64 58 -58 46 -58 C28 -56 -4 -54 -26 -57 C-36 -59 -42 -62 -44 -66Z" fill="#A86A30" opacity=".5"/>
      <path d="M40 -120 C50 -112 54 -100 50 -88 C58 -96 60 -110 54 -118Z" fill="#B87A3C" opacity=".3"/>
      <path d="M52 -106 C36 -102 26 -86 28 -62 M-22 -102 C-34 -96 -42 -82 -44 -64" stroke="#9A622A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>
      <path d="M48 -100 C38 -96 32 -86 32 -74" stroke="#FFE4B4" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>
      <path d="M-12 -128 C-4 -142 10 -147 22 -145" stroke="#FFEACA" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M-44 -96 C-38 -104 -30 -107 -22 -106" stroke="#FFE2B0" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M3 -146.6 C3 -153 8 -157 12 -153 C13 -160 21 -161 22 -154 C25 -158 31 -156 29 -149 C30 -147 29 -146 28 -146 C20 -149 10 -149 3 -146.6Z" fill="#C88A48" stroke="#6E3E16" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M8 -151 q2 -3 4 -2 M16 -154 q3 -3 5 -1 M24 -151 q2 -2 4 0" stroke="#F4CC8C" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <g stroke="#B07838" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".6"><path d="M-30 -82 q4 4 10 4 M10 -78 q6 3 12 2 M34 -86 q5 2 10 0 M-6 -120 q4 -2 8 -1 M24 -128 q4 1 7 4"/></g>
      <g id="de-dr-pesc">
        <path d="M-36 -100 C-46 -98 -56 -96 -64 -104 C-72 -112 -73 -150 -70 -178 L-93 -160 C-101 -140 -101 -108 -93 -90 C-85 -72 -64 -62 -46 -64 C-40 -66 -34 -72 -32 -80Z" fill="url(#deDrPesc)" stroke="#6E3E16" stroke-width="2.3" stroke-linejoin="round"/>
        <path d="M-60 -98 C-66 -104 -68 -130 -66 -160" stroke="#FFE2B0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
        <path d="M-88 -92 C-80 -78 -64 -70 -50 -70" stroke="#A86A30" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
        <path d="M-95 -148 C-104 -134 -106 -112 -98 -94 C-96 -90 -92 -90 -91 -93 C-97 -110 -97 -130 -95 -148Z" fill="#B87A3C"/>
        <g fill="none" stroke-linecap="round">${[-144, -137, -130, -123, -116, -109, -102, -95].map((y, k) => { const x = -100.6 - Math.sin((y + 150) / 60 * Math.PI) * 2.6; return `<path d="M${(x + 3).toFixed(1)} ${y} q-5 2 -${(6 + (k % 3)).toFixed(0)} ${(7 + (k % 2) * 2).toFixed(0)}" stroke="#8A5424" stroke-width="2.2"/><path d="M${(x + 3).toFixed(1)} ${y} q-5 2 -${(6 + (k % 3)).toFixed(0)} ${(7 + (k % 2) * 2).toFixed(0)}" stroke="#D49A58" stroke-width="1.1"/>`; }).join('')}</g>
        <path d="M-70 -184 C-76 -191 -90 -192 -98 -186 C-104 -181 -110 -175 -113 -168 C-115 -162 -113 -157 -107 -156 C-100 -155 -91 -158 -84 -160 C-76 -162 -66 -168 -66 -177 C-66 -180 -68 -182 -70 -184Z" fill="url(#deDrCab)" stroke="#6E3E16" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M-113 -165 C-117 -160 -116 -154 -110 -153 C-107 -152.6 -105 -154 -104.6 -156 C-104 -153 -101 -152 -98 -153.4 C-96 -154.6 -97 -157.6 -99 -158.4 C-104 -160 -109 -161 -113 -165Z" fill="#D6A066" stroke="#6E3E16" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M-104.6 -156 L-105 -159.6" stroke="#6E3E16" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M-108 -152 C-105 -150 -100 -150 -97 -152" stroke="#8A5226" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M-110.4 -169.4 C-108.6 -170.6 -107 -170.2 -106.2 -168.4" stroke="#3A1E0C" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="-74" cy="-188" rx="4.6" ry="3.8" transform="rotate(-20 -74 -188)" fill="url(#deDrPesc)" stroke="#6E3E16" stroke-width="1.5"/><ellipse cx="-73.6" cy="-188.2" rx="2.2" ry="1.6" transform="rotate(-20 -74 -188)" fill="#C9826A"/>
        <ellipse cx="-88" cy="-176" rx="5.2" ry="4.4" fill="#FFFDF6" stroke="#6E3E16" stroke-width="1"/><circle cx="-89.2" cy="-175" r="3.3" fill="#2A160A"/><circle cx="-90.3" cy="-176" r="1.2" fill="#fff"/><circle cx="-88" cy="-173.6" r=".55" fill="#fff" opacity=".8"/>
        <path d="M-93.6 -177.2 C-91 -181.4 -85 -181.4 -82.4 -177 C-86 -178.2 -90 -178.2 -93.6 -177.2Z" fill="#DDA466" stroke="#6E3E16" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M-93.4 -177.6 q-3 -1.6 -4.6 -4.4 M-91 -179.4 q-2 -2.6 -2.4 -5.4 M-88 -180.2 q-.6 -3 0 -5.6 M-85 -179.6 q1 -2.8 2.6 -4.6" stroke="#3A1E0C" stroke-width="1.15" fill="none" stroke-linecap="round"/>
        <path d="M-96 -184 C-90 -187 -82 -186.6 -77 -183" stroke="#FFEFCC" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
        <ellipse cx="-99" cy="-165" rx="5" ry="2.8" fill="#FF9A8A" opacity=".42"/>
        <path d="M-72 -190 q1 -4 4 -5 q0 3 -2 5" fill="#8A5424" stroke="#6E3E16" stroke-width=".9"/>
      </g>
      <path d="M-40 -104 C-55 -104 -66 -93 -66 -78 C-66 -63 -55 -53 -40 -53 C-28 -53 -21 -63 -21 -78 C-21 -93 -28 -104 -40 -104Z" fill="#DEA664"/>
      <path d="M-63 -64 C-58 -56 -50 -53 -40 -53 C-34 -53 -29 -55 -26 -58" stroke="#6E3E16" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M-58 -94 C-62 -86 -62 -76 -58 -68" stroke="#A86A30" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".35"/>`;
  const pica = `<g id="de-pica-in"><ellipse cx="3" cy="14" rx="7" ry="2" fill="#1E2A10" opacity=".2"/>
      <path d="M5 12 L12 30 L8 29 L6 32 L2 16Z" fill="#2E2E36" stroke="#16161C" stroke-width="1"/><path d="M6 18 l3 -1 M7 22 l3 -1 M8 26 l3 -1" stroke="#F2F2F2" stroke-width="1"/>
      <path d="M-5 -6 C-8 2 -5 13 3 17 C9 19 13 13 12 4 C11 -4 6 -9 -1 -10Z" fill="url(#dePica)" stroke="#5A4A3A" stroke-width="1.3"/>
      <path d="M1 -7 C8 -6 13 2 12 11 C11 15 8 16 5 13 C3 6 2 -1 1 -7Z" fill="#26262E" stroke="#121218" stroke-width="1"/>
      <path d="M3 -3 l7 1 M3.6 1 l8 1 M4 5 l8 1 M4.4 9 l7 1 M5 12.6 l5 .6" stroke="#F6F6F6" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M-4 0 C-4 6 -2 11 2 14" stroke="#FFF4DA" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="-3.4" cy="-11" r="6.6" fill="url(#dePica)" stroke="#5A4A3A" stroke-width="1.3"/>
      <path d="M-6.4 -16.6 C-4.6 -18.6 -1 -18.6 .6 -16.6 C-1 -15 -4.6 -15 -6.4 -16.6Z" fill="#E5392C" stroke="#9A1E14" stroke-width=".7"/>
      <circle cx="-6.2" cy="-11.6" r="2" fill="#12121A"/><circle cx="-6.8" cy="-12.3" r=".75" fill="#fff"/>
      <path d="M-9.4 -11 L-18 -9 L-9.6 -7.2Z" fill="#45454E" stroke="#1E1E24" stroke-width=".8" stroke-linejoin="round"/><path d="M-10 -9.6 L-16 -9" stroke="#8A8A94" stroke-width=".6"/>
      <path d="M-5 -8 C-3 -6.6 -1 -6.6 1 -7.4" stroke="#C9B48E" stroke-width="1" fill="none" opacity=".8"/>
      <path d="M-3 8 l-6 1.4 M-3 8 l-5 3.4 M-1 11 l-6 1.4 M-1 11 l-5 3.6" stroke="#4A4A52" stroke-width="1.2" stroke-linecap="round"/>
    </g>`;
  const jerboa = `<g id="de-jer-in"><ellipse cx="2" cy="1" rx="14" ry="2.6" fill="#7A4A1A" opacity=".25"/><path d="M8 -6 C20 -4 30 -10 38 -18" stroke="#C9965A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M36 -16 c2 -4 6 -6 9 -4 c-1 4 -5 6 -9 4Z" fill="#2E1E14"/><path d="M38 -18 c3 -2 6 -1 7 1" stroke="#FFF4E2" stroke-width="1.6" fill="none"/>
      <path d="M2 -2 L8 0 L14 0" stroke="#A8743E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="2" cy="-10" rx="10" ry="9" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.4"/><path d="M-4 -4 C-2 -8 6 -8 8 -4 C6 -1 -2 -1 -4 -4Z" fill="#FFF4E2"/>
      <path d="M-8 -22 C-12 -32 -10 -40 -6 -42 C-2 -38 -2 -30 -4 -22Z" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.2"/><path d="M-7 -25 C-9 -32 -8 -37 -6 -39 C-4 -35 -4 -30 -5 -25Z" fill="#FFB0A8"/>
      <path d="M-2 -22 C0 -32 4 -38 8 -38 C10 -32 6 -26 2 -21Z" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.2"/><path d="M0 -24 C2 -31 5 -35 7 -35 C8 -31 5 -27 2 -23Z" fill="#FFB0A8"/>
      <circle cx="-6" cy="-17" r="7.4" fill="url(#deJer)" stroke="#8A5A2A" stroke-width="1.4"/><circle cx="-9" cy="-18" r="2.6" fill="#1E120C"/><circle cx="-9.8" cy="-19" r=".9" fill="#fff"/><circle cx="-13.2" cy="-14.8" r="1.1" fill="#8A3E3E"/>
      <path d="M-6 -6 l-3 4" stroke="#A8743E" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const ganga = (x, y, f) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><ellipse cx="0" cy="3" rx="10" ry="2" fill="#7A4A1A" opacity=".25"/><path d="M8 -4 L18 -2 L8 0Z" fill="#8A6A44" stroke="#4E3A22" stroke-width=".8"/><ellipse cx="0" cy="-5" rx="11" ry="7" fill="url(#deGanga)" stroke="#5A4028" stroke-width="1.2"/><path d="M-6 -8 q4 3 8 0 q4 3 8 0" stroke="#FFF4D8" stroke-width="1.1" fill="none"/><path d="M-6 -2 C0 0 6 0 10 -2" stroke="#3A2A1A" stroke-width="1.6" fill="none"/><circle cx="-9" cy="-11" r="5" fill="#D9B07A" stroke="#5A4028" stroke-width="1.2"/><circle cx="-10.6" cy="-11.6" r="1.4" fill="#12121A"/><circle cx="-11" cy="-12" r=".5" fill="#fff"/><path d="M-13.6 -10.6 L-17 -9.6 L-13.6 -8.6Z" fill="#6E5A44"/><path d="M-2 2 v3 M2 2 v3" stroke="#6E5A44" stroke-width="1.2"/></g>`;
  /* areia de primeiro plano */
  const ondinhas = (x0, x1, y0, y1, n, cor, w) => Array.from({ length:n }, () => { const x = R(x0, x1), y = R(y0, y1), l = R(18, 46); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${(l / 4).toFixed(0)} -3 ${(l / 2).toFixed(0)} 0 t${(l / 2).toFixed(0)} 0" stroke="${cor}" stroke-width="${w || 1.4}" fill="none" stroke-linecap="round"/>`; }).join('');
  const raiz = 'M400 456 C370 460 330 462 290 466 C250 468 200 468 150 472 M290 466 C276 474 262 478 240 482 M400 456 C430 460 470 462 512 466 C556 470 600 470 650 474 M512 466 C528 474 546 478 566 482 M400 456 C396 466 392 474 386 484 M200 468 C186 472 172 476 160 482 M600 470 C616 476 630 478 646 482';
  const sagCostelas = (() => {
    let sulco = '', luz = '', are = '', esp = '';
    for (let k = -5; k <= 5; k++) {
      const th = k * Math.PI / 12, x = 400 + 25 * Math.sin(th), xm = 400 + 25 * Math.sin(th + Math.PI / 24), y0 = 180 + Math.abs(k) * 2.4;
      sulco += `M400 178 C${(400 + (x - 400) * .5).toFixed(1)} 179 ${x.toFixed(1)} ${y0 + 4} ${x.toFixed(1)} ${y0 + 20} V${SUPB - 3} `;
      if (k < 5 && th + Math.PI / 24 < 1.2) {
        if (k < 1) luz += `M${xm.toFixed(1)} ${y0 + 18} V${SUPB - 6} `;
        for (let y = y0 + 22 + (k & 1) * 7; y < SUPB - 8; y += 15) { are += `<circle cx="${xm.toFixed(1)}" cy="${y}" r="1.25"/>`; esp += `M${xm.toFixed(1)} ${y} l-3 -2.6 M${xm.toFixed(1)} ${y} l3 -2.6 M${xm.toFixed(1)} ${y} l0 3.6 M${xm.toFixed(1)} ${y} l-2.4 2.2 `; }
      }
    }
    const braco = (cx, y0, y1, xt, yt, lado) => {
      let s = '', l = '', a = '', e = '';
      [-11, -5.5, 0, 5.5, 11].forEach((o, j) => {
        const x = cx + o, yb = yt - o * lado * .9;
        s += `M${x} ${y0 + Math.abs(o) * .5} V${y1} Q${x} ${yb} ${xt} ${yb} `;
        if (j < 4) { const xm = x + 2.75; if (j < 2) l += `M${xm} ${y0 + 6} V${y1 - 2} `; for (let y = y0 + 12 + (j & 1) * 6; y < y1; y += 14) { a += `<circle cx="${xm}" cy="${y}" r="1.1"/>`; e += `M${xm} ${y} l-2.6 -2.2 M${xm} ${y} l2.6 -2.2 M${xm} ${y} l0 3 `; } }
      });
      return [s, l, a, e];
    };
    const bE = braco(333, 244, 312, 377, 338, 1), bD = braco(467, 206, 274, 423, 300, -1);
    return { sulco:sulco + bE[0] + bD[0], luz:luz + bE[1] + bD[1], are:are + bE[2] + bD[2], esp:esp + bE[3] + bD[3] };
  })();
  const florSag = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4.4" rx="3" ry="4.4" transform="rotate(${a})" fill="url(#deFlorSag)" stroke="#B8B090" stroke-width=".7"/>`).join('')}<circle r="2.6" fill="#F6C83A" stroke="#C08A1A" stroke-width=".7"/><circle cx="-.7" cy="-.8" r=".8" fill="#FFF4B0"/></g>`;
  const saguaro = `<g id="de-sag-in" style="transform-box:fill-box;transform-origin:50% 100%;transition:transform 1.8s cubic-bezier(.3,1.4,.5,1)">
      <path d="M377 352 C348 354 316 346 316 316 V250 C316 236 350 236 350 250 V310 C350 322 362 326 377 324Z" fill="url(#deSagB)" stroke="#22381A" stroke-width="2.3" stroke-linejoin="round"/>
      <path d="M423 314 C452 316 484 308 484 278 V212 C484 198 450 198 450 212 V272 C450 284 438 288 423 286Z" fill="url(#deSagB)" stroke="#22381A" stroke-width="2.3" stroke-linejoin="round"/>
      <rect x="374" y="176" width="52" height="${SUPB - 174}" rx="26" fill="url(#deSagA)" stroke="#22381A" stroke-width="2.4"/>
      <rect x="374" y="176" width="52" height="${SUPB - 174}" rx="26" fill="url(#deSagVol)"/>
      <path d="M377 352 C348 354 316 346 316 316 V250 C316 236 350 236 350 250 V310 C350 322 362 326 377 324Z M423 314 C452 316 484 308 484 278 V212 C484 198 450 198 450 212 V272 C450 284 438 288 423 286Z" fill="url(#deSagVol)"/>
      <path d="${sagCostelas.sulco}" stroke="#23401A" stroke-width="1.6" opacity=".55" fill="none" stroke-linecap="round"/>
      <path d="${sagCostelas.luz}" stroke="#E4F6B4" stroke-width="1.1" opacity=".45" fill="none" stroke-linecap="round"/>
      <path d="${sagCostelas.esp}" stroke="#E8DCB0" stroke-width=".65" opacity=".5" fill="none" stroke-linecap="round"/>
      <g fill="#F8F2D8" stroke="#8A8060" stroke-width=".4">${sagCostelas.are}</g>
      <path d="M382 200 C383 188 391 180 400 179" stroke="#EEFAC0" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M319 262 C319 250 323 244 330 243 M453 222 C453 210 457 204 464 203" stroke="#EEFAC0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      ${florSag(392, 182, .9)}${florSag(406, 177, 1)}${florSag(399, 171, .8)}${florSag(330, 241, .8)}${florSag(470, 203, .85)}
      <ellipse id="de-sag-furo" cx="410" cy="262" rx="0" ry="0" fill="#1E140C" stroke="#4E3418" stroke-width="1.6"/>
    </g>`;
  /* ---------- parte A: geometria da duna esculpida ---------- */
  const f1 = v => (+v).toFixed(1);
  const cub = (p0, p1, p2, p3, n) => Array.from({ length:n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]; });
  const samp = (a, t) => { const x = Math.max(0, Math.min(1, t)) * (a.length - 1), i = Math.min(a.length - 2, Math.floor(x)), k = x - i; return [a[i][0] + (a[i + 1][0] - a[i][0]) * k, a[i][1] + (a[i + 1][1] - a[i][1]) * k]; };
  const linha = pts => 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
  const PICO = [525, 196];
  const silL = cub(PICO, [490, 210], [440, 236], [400, 270], 24).concat(cub([400, 270], [290, 350], [120, 440], [-10, 470], 40).slice(1));
  const silR = cub(PICO, [545, 200], [590, 212], [650, 240], 24).concat(cub([650, 240], [710, 268], [760, 290], [820, 300], 30).slice(1));
  const arete = cub(PICO, [515, 262], [452, 340], [442, 510], 50);
  const D_SIL_L = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196', D_SIL_R = 'M525 196 C545 200 590 212 650 240 C710 268 760 290 820 300';
  const D_DUNA = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196 C545 200 590 212 650 240 C710 268 760 290 820 300 V510 H-10Z';
  const D_SOMBRA = 'M-10 470 C120 440 290 350 400 270 C440 236 490 210 525 196 C515 262 452 340 442 510 H-10Z';
  const D_LUZ = 'M525 196 C545 200 590 212 650 240 C710 268 760 290 820 300 V510 H442 C452 340 515 262 525 196Z';
  const D_ARETE = 'M525 196 C515 262 452 340 442 510';
  const coons = (T, B, L, Rr) => (u, k) => { const t = T(u), b = B(u), l = L(k), r = Rr(k), t0 = T(0), t1 = T(1), b0 = B(0), b1 = B(1); return [0, 1].map(j => (1 - k) * t[j] + k * b[j] + (1 - u) * l[j] + u * r[j] - ((1 - u) * (1 - k) * t0[j] + u * (1 - k) * t1[j] + (1 - u) * k * b0[j] + u * k * b1[j])); };
  const faceLuz = coons(u => samp(silR, u), u => [442 + 378 * u, 510], k => samp(arete, k), k => [820, 300 + 210 * k]);
  const faceSom = coons(u => samp(silL, u), u => [442 - 452 * u, 510], k => samp(arete, k), k => [-10, 470 + 40 * k]);
  const ondasDuna = (F, n, k0, k1, a0, a1, fr) => { const out = []; for (let i = 0; i < n; i++) { const k = k0 + (k1 - k0) * Math.pow((i + R(.25, .75)) / n, 1.3), ph = R(0, 6.3), ph2 = R(0, 6.3), fq = fr * R(.8, 1.25), amp = a0 + (a1 - a0) * k; let u = R(0, .05); while (u < 1) { const len = R(.2, .5), seg = []; for (let v = u; v <= Math.min(1, u + len) + 1e-6; v += .01) { const p = F(v, k + .014 * Math.sin(v * 5 + ph2)); seg.push([p[0], p[1] + amp * Math.sin(v * fq + ph)]); } if (seg.length > 2) out.push({ d:linha(seg), k }); u += len + R(.03, .1); } } return out; };
  const desenhaOndas = (lst, esc, luz, w0, w1, o0, o1) => `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${lst.map(o => `<path d="${o.d}" stroke="${esc}" stroke-width="${f1(w0 + (w1 - w0) * o.k)}" opacity="${(o0 + (o1 - o0) * o.k).toFixed(2)}"/><path d="${o.d}" transform="translate(0 ${f1(-1 - o.k * 1.2)})" stroke="${luz}" stroke-width="${f1(.6 + o.k * .9)}" opacity="${(.35 + o.k * .3).toFixed(2)}"/>`).join('')}</g>`;
  const avalanches = () => [.07, .15, .24, .33, .44, .55, .66].map(u0 => { const km = R(.22, .5), w = R(.012, .02), L = [], Rt = []; for (let s = 0; s <= 16; s++) { const k = km * s / 16, e = Math.pow(Math.sin(Math.PI * Math.min(.999, s / 16 * .92 + .04)), .6) * w; L.push(faceSom(u0 - e, k)); Rt.unshift(faceSom(u0 + e, k)); } return `<path d="${linha(L.concat(Rt))}Z" fill="#D29AC0" opacity=".12"/>`; }).join('');
  const trilhaBes = (pts, cor) => pts.map((p, i) => { if (!i) return ''; const q = pts[i - 1], dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, s = i % 2 ? 1 : -1, o = 2.4 * (.6 + p[1] / 700); return `<path d="M${f1(p[0] + nx * o * s - dx / l)} ${f1(p[1] + ny * o * s - dy / l)} l${f1(dx / l * 1.8)} ${f1(dy / l * 1.8)}"/>`; }).join('');
  const pegada = (x, y, s, r) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${s} ${f1(s * .62)})"><path d="M-2.6 3.6 C-3.4 1 -1.6 -.2 0 -.2 C1.6 -.2 3.4 1 2.6 3.6 C1.4 4.6 -1.4 4.6 -2.6 3.6Z"/><ellipse cx="-3.2" cy="-1.8" rx="1.1" ry="1.4"/><ellipse cx="-1.1" cy="-3.4" rx="1.1" ry="1.4"/><ellipse cx="1.1" cy="-3.4" rx="1.1" ry="1.4"/><ellipse cx="3.2" cy="-1.8" rx="1.1" ry="1.4"/></g>`;
  const duna = (x, y, w, h, luz, som, cr) => { const px = x, py = y - h, L = x - w * .55, Rr = x + w * .5;
    const esq = `C${f1(L + w * .28)} ${f1(y - h * .18)} ${f1(px - w * .16)} ${f1(py + h * .1)} ${px} ${py}`, dir = `C${f1(px + w * .12)} ${f1(py + h * .12)} ${f1(Rr - w * .22)} ${f1(y - h * .12)} ${f1(Rr)} ${y}`, ar = `C${f1(px - w * .01)} ${f1(py + h * .42)} ${f1(px - w * .09)} ${f1(y - h * .3)} ${f1(px - w * .12)} ${y}`;
    return `<path d="M${f1(L)} ${y} ${esq} ${dir}Z" fill="${luz}"/><path d="M${f1(L)} ${y} ${esq} ${ar}Z" fill="${som}"/><path d="M${px} ${py} ${dir}" stroke="${cr}" stroke-width="1.5" fill="none" opacity=".75"/><path d="M${px} ${py} ${ar}" stroke="${cr}" stroke-width="1" fill="none" opacity=".55"/>`; };
  const costa = cub([-10, 334], [70, 330], [160, 322], [230, 316], 24).concat(cub([230, 316], [280, 311], [320, 306], [360, 302], 16).slice(1));
  const offCosta = (dy, a, f) => linha(costa.map((p, i) => [p[0], p[1] + dy * (.55 + .45 * (p[1] - 300) / 34) + Math.sin(i * f) * a]));
  const nevoaBanco = (pts, cor) => pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + r * .3}" rx="${f1(r * 1.45)}" ry="${f1(r * .62)}" fill="${cor}"/>`).join('');
  const BANCO = [[-40, 268, 30], [-8, 258, 32], [26, 262, 28], [58, 252, 32], [92, 260, 28], [124, 254, 30], [158, 262, 27], [190, 258, 26], [220, 266, 24], [250, 270, 20], [276, 276, 16], [300, 282, 12], [322, 288, 9]];
  const estrato = (x, y, w, h) => `<path d="M${x} ${y} C${x + w * .2} ${y - h} ${x + w * .7} ${y - h * 1.2} ${x + w} ${y - h * .2} C${x + w * .8} ${y + h * .5} ${x + w * .2} ${y + h * .6} ${x} ${y}Z" fill="url(#deEstrato)"/><path d="M${x + w * .12} ${y + h * .28} C${x + w * .4} ${y + h * .5} ${x + w * .75} ${y + h * .42} ${x + w * .92} ${y + h * .05}" stroke="#FFE4C4" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
  /* ---------- parte A: plantas e bichos do chão ---------- */
  const fita = (p0, p1, p2, p3, w0, w1, t0, t1, ond) => { const n = 18, A = [], B = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n, u = 1 - t; const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]; const dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]), dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]), l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2 * (1 + (ond || 0) * Math.sin(t * 17 + w0)); A.push([x - dy / l * w, y + dx / l * w]); B.unshift([x + dy / l * w, y - dx / l * w]); } return linha(A.concat(B)) + 'Z'; };
  const FOLHAS_WEL = [[[-6, -8], [-20, -24], [-46, -26], [-72, -16], 9, 13, 'E'], [[6, -8], [22, -24], [48, -26], [74, -14], 9, 13, 'D'], [[-6, -5], [-26, -9], [-54, -7], [-90, 0], 11, 16, 'E'], [[6, -5], [28, -10], [56, -8], [92, -1], 11, 16, 'D'], [[-4, -2], [-20, 5], [-46, 9], [-76, 15], 12, 15, 'E'], [[4, -2], [22, 5], [48, 10], [78, 14], 12, 15, 'D']];
  const welwitschia = FOLHAS_WEL.map(([a, b, c2, d, w0, w1, lado]) => { const pts = cub(a, b, c2, d, 14), fim = pts[14], pre = pts[13], dx = fim[0] - pre[0], dy = fim[1] - pre[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l; return `<path d="${fita(a, b, c2, d, w0, w1, 0, 1, .12)}" fill="url(#deWel${lado})" stroke="#3A4A1E" stroke-width="1.2" stroke-linejoin="round"/>${[-.3, -.1, .1, .3].map(o => `<path d="${linha(pts.slice(1, 14).map((q, j) => [q[0], q[1] + o * (w0 + (w1 - w0) * j / 14)]))}" stroke="${o < 0 ? '#E2F2A8' : '#3A4A1E'}" stroke-width=".7" fill="none" opacity="${o < 0 ? .5 : .32}"/>`).join('')}<g stroke="#A88A56" stroke-width="1.6" stroke-linecap="round" fill="none">${[-.35, 0, .35].map((o, k) => `<path d="M${f1(fim[0] - uy * w1 * o)} ${f1(fim[1] + ux * w1 * o)} q${f1(ux * 5 + k)} ${f1(uy * 5 + 1)} ${f1(ux * (7 + k * 2))} ${f1(uy * 7 + 2 - k)}"/>`).join('')}</g>`; }).join('');
  /* ---------- parte B: Sonora ---------- */
  const mesa = (x0, x1, top) => { const b = 300, h = b - top, yc = top + h * .55;
    const fx = y => (y - top) / (yc - top) * 6;
    let est = ''; [.18, .34, .52, .7, .86].forEach((q, j) => { const y = top + 4 + (yc - top - 4) * q, d = fx(y); est += `<path d="M${f1(x0 - d + 12)} ${f1(y)} H${f1(x1 + d)}" stroke="${j % 2 ? '#F2B49A' : '#A65450'}" stroke-width="${j % 2 ? 2.4 : 1.6}" opacity="${j % 2 ? .5 : .45}"/>`; });
    let sulcos = ''; for (let k = 0; k < 6; k++) { const x = x0 + 18 + (x1 - x0 - 30) * k / 5; sulcos += `M${f1(x)} ${top + 6} l${f1(R(-2, 2))} ${f1(h * .5 - 6)} `; }
    return `<path d="M${x0 - 6} ${f1(yc)} L${x1 + 6} ${f1(yc)} C${x1 + 20} ${f1(top + h * .72)} ${x1 + 44} ${b - 6} ${x1 + 66} ${b} L${x0 - 64} ${b} C${x0 - 40} ${b - 6} ${x0 - 20} ${f1(top + h * .72)} ${x0 - 6} ${f1(yc)}Z" fill="url(#deTalus)"/>
      <path d="M${x0 - 6} ${f1(yc)} C${x0 - 20} ${f1(top + h * .72)} ${x0 - 40} ${b - 6} ${x0 - 64} ${b} L${x0 - 20} ${b} C${x0 - 10} ${b - 10} ${x0} ${f1(top + h * .74)} ${x0 + 12} ${f1(yc)}Z" fill="#B87470" opacity=".45"/>
      <path d="M${x0} ${top + 4} L${x0 + 4} ${top} L${x1 - 4} ${top} L${x1} ${top + 4} L${x1 + 6} ${f1(yc)} L${x0 - 6} ${f1(yc)}Z" fill="url(#deMesa)"/>
      ${est}<path d="${sulcos}" stroke="#A85A52" stroke-width="1.2" opacity=".35" fill="none"/>
      <path d="M${x0} ${top + 4} L${x0 + 12} ${top + 4} L${x0 + 12} ${f1(yc)} L${x0 - 6} ${f1(yc)}Z" fill="url(#deMesaS)" opacity=".85"/>
      <path d="M${x0 - 2} ${top + 5} L${x0 + 4} ${top} L${x1 - 4} ${top} L${x1 + 2} ${top + 5}Z" fill="#F6C8B2" stroke="#C47E70" stroke-width="1"/>
      <path d="M${x0 + 8} ${top + .6} H${x1 - 6}" stroke="#FFE6D8" stroke-width="1.4" opacity=".8"/>`; };
  const sagLonge = (x, y, s, cor, luz) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 0 V-58 a4 4 0 0 1 8 0 V0Z M-4 -26 h-8 a4 4 0 0 1 -4 -4 V-42 a3.6 3.6 0 0 1 7.2 0 V-33 h4.8Z M4 -32 h8 V-48 a3.6 3.6 0 0 1 7.2 0 V-32 a4 4 0 0 1 -4 4 H4Z" fill="${cor}"/><path d="M-1.6 -4 V-56" stroke="${luz}" stroke-width="1.6" opacity=".7"/></g>`;
  const nuvemChuva = x => { const C = [[x - 52, 66, 22], [x - 24, 50, 30], [x + 12, 44, 34], [x + 46, 58, 26], [x + 66, 70, 16], [x - 70, 76, 14]];
    return `${C.map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r + 2.4}" fill="#4A5474"/>`).join('')}<ellipse cx="${x - 2}" cy="78" rx="78" ry="16" fill="#4A5474"/>${C.map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="url(#deNuvC)"/>`).join('')}<ellipse cx="${x - 2}" cy="78" rx="75.6" ry="13.6" fill="#7C88A6"/><path d="M${x - 70} 82 C${x - 40} 92 ${x + 40} 92 ${x + 72} 80" stroke="#5E6A8A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>${C.slice(0, 4).map(([a, b, r]) => `<path d="M${f1(a - r * .6)} ${f1(b - r * .45)} q${f1(r * .5)} ${f1(-r * .45)} ${f1(r * 1.1)} ${f1(-r * .1)}" stroke="#F4F6FC" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}`; };
  /* ---------- cena ---------- */
  semente = 23;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Desertos do mundo: dunas do Namibe com neblina, o cacto saguaro no deserto de Sonora e um oásis no Saara">
    <defs>
      ${lgd('deCeu0', ['#33407E', '#8A62A0', '#E88E8C', '#FFC69A', '#FFE4C0'])}
      ${lgd('deCeu1', ['#2D82D8', '#6DBBEF', '#BFE4F6', '#FFF0D2'])}
      ${lgd('deCeu2', ['#4E70C2', '#B8A4CC', '#F6BE86', '#FFE0A6'])}
      <radialGradient id="deSolG"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".9"/><stop offset=".4" stop-color="#FFD98A" stop-opacity=".45"/><stop offset="1" stop-color="#FFC870" stop-opacity="0"/></radialGradient>
      <radialGradient id="deSolD" cx=".4" cy=".35"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".6" stop-color="#FFD860"/><stop offset="1" stop-color="#FFA830"/></radialGradient>
      ${lgd('deMar', ['#D8CCE6', '#AEB0DA', '#7A8CC6', '#5E74B6'])}
      ${lgd('deDuLonge', ['#E9A898', '#D88E86'])}
      ${lgd('deDuMeio', ['#F0A274', '#D9805C'])}
      ${lgd('dePlanA', ['#E89A6C', '#C9704E'])}
      <linearGradient id="deDuLuz" gradientUnits="userSpaceOnUse" x1="520" y1="200" x2="760" y2="510"><stop offset="0" stop-color="#FFCB8E"/><stop offset=".28" stop-color="#FAAA66"/><stop offset=".62" stop-color="#EE8C4E"/><stop offset="1" stop-color="#D2683A"/></linearGradient>
      <linearGradient id="deDuSombra" gradientUnits="userSpaceOnUse" x1="500" y1="210" x2="140" y2="510"><stop offset="0" stop-color="#BC7A92"/><stop offset=".25" stop-color="#9C6890"/><stop offset=".6" stop-color="#7C5486"/><stop offset="1" stop-color="#5A3C70"/></linearGradient>
      <radialGradient id="deBes" cx=".32" cy=".22" r=".85"><stop offset="0" stop-color="#9A94C2"/><stop offset=".3" stop-color="#433A5C"/><stop offset=".7" stop-color="#1C1628"/><stop offset="1" stop-color="#0A0610"/></radialGradient>
      ${lgd('deFcPelo', ['#FBE2B6', '#EDBE80', '#D9A060'])}
      ${lgd('deFcOrelha', ['#FFD0C4', '#F49A9A'])}
      ${lgd('deMesa', ['#EE9E7E', '#D67A60', '#C2664E'])}
      ${lgd('deMesaL', ['#E8B0A0', '#D49488'])}
      ${lgd('dePlanB', ['#EDC796', '#DDAA70', '#C98E58'])}
      ${lgd('deSoloB', ['#A8683E', '#7E4A2C', '#5E361E'])}
      <linearGradient id="deSagA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E5A2A"/><stop offset=".3" stop-color="#A8B060"/><stop offset=".6" stop-color="#8A9A4A"/><stop offset="1" stop-color="#4A5626"/></linearGradient>
      <linearGradient id="deSagB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E5A2A"/><stop offset=".35" stop-color="#A2AC5C"/><stop offset="1" stop-color="#56622C"/></linearGradient>
      ${lgd('deFigo', ['#9AD0B0', '#5E9A88'])}
      ${lgd('deBarril', ['#C9C85A', '#8A9A3A'], 1, 0)}
      ${lgd('deDuC1', ['#F4CDA6', '#EAB894'])}
      ${lgd('deDuC2', ['#FAD08C', '#EBAE64'])}
      ${lgd('deAreia', ['#F8D696', '#EDBA70'])}
      ${lgd('deCorte', ['#E6AE68', '#D0924E', '#B47838'])}
      ${lgd('deLencol', ['#8AD6FF', '#3E8AE0', '#2560C0'])}
      ${lgd('deAgua', ['#9ADFFF', '#3E9AE8'])}
      <linearGradient id="deMiragem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DDF2FF" stop-opacity="0"/><stop offset=".3" stop-color="#DDF2FF" stop-opacity=".85"/><stop offset=".7" stop-color="#C6E8FF" stop-opacity=".85"/><stop offset="1" stop-color="#DDF2FF" stop-opacity="0"/></linearGradient>
      <linearGradient id="deTronco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A2E"/><stop offset=".45" stop-color="#C99050"/><stop offset="1" stop-color="#7A4A22"/></linearGradient>
      <radialGradient id="deTamara" cx=".35" cy=".3"><stop offset="0" stop-color="#FFC27A"/><stop offset="1" stop-color="#D2621E"/></radialGradient>
      <linearGradient id="dePoco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E2E14"/><stop offset=".5" stop-color="#8A5A2E"/><stop offset="1" stop-color="#4E2E14"/></linearGradient>
      ${lgd('deDrPelo', ['#F0C080', '#D9A060', '#C08440'])}
      <radialGradient id="deDrCorpo" cx=".45" cy=".25" r=".8"><stop offset="0" stop-color="#F8D49A"/><stop offset=".55" stop-color="#E2AA66"/><stop offset="1" stop-color="#C2843E"/></radialGradient>
      <radialGradient id="deDrCab" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#F8D8A0"/><stop offset="1" stop-color="#D49A56"/></radialGradient>
      ${lgd('deDrPerna', ['#E4AE6A', '#D29A56', '#C08440'], 1, 0)}
      ${lgd('deDrPernaF', ['#C08A4C', '#A87438'], 1, 0)}
      ${lgd('deDrPesc', ['#E8B46E', '#D29A56'], 1, 0)}
      ${lgd('deJer', ['#F6D29C', '#DDA866'])}
      ${lgd('deGanga', ['#E2BE88', '#B88A56'])}
      ${lgd('deWel', ['#9CC462', '#6A9A40', '#44702C'])}
      <pattern id="deGraos" width="18" height="12" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="#F2D49A" stroke="#B88A50" stroke-width=".7" opacity=".7"/><circle cx="13" cy="5" r="2.2" fill="#E8C084" stroke="#B88A50" stroke-width=".7" opacity=".7"/><circle cx="9" cy="10" r="2.4" fill="#F6DCA6" stroke="#B88A50" stroke-width=".7" opacity=".7"/></pattern>
      <clipPath id="deClip"><rect x="0" y="0" width="800" height="500"/></clipPath>
      <filter id="deBlur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="deBlur2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <radialGradient id="deVinheta" cx=".5" cy=".45" r=".78"><stop offset=".55" stop-color="#2E1420" stop-opacity="0"/><stop offset="1" stop-color="#2E1420" stop-opacity=".4"/></radialGradient>
      <filter id="deGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .075 0"/></filter>
      <radialGradient id="deBesCab" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6E6698"/><stop offset=".5" stop-color="#2A2238"/><stop offset="1" stop-color="#0E0A14"/></radialGradient>
      <radialGradient id="deGotaG" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#D2F0FF"/><stop offset="1" stop-color="#6CBCF0"/></radialGradient>
      <radialGradient id="deHorizA"><stop offset="0" stop-color="#FFD8B0" stop-opacity=".75"/><stop offset=".6" stop-color="#FFC8A8" stop-opacity=".3"/><stop offset="1" stop-color="#FFC0A0" stop-opacity="0"/></radialGradient>
      ${lgd('deEstrato', ['#D898B4', '#F2B8B6', '#FFDCC0'])}
      ${lgd('deL1', ['#F8CDB8', '#F0BAA8'])}${lgd('deL1S', ['#D2AECA', '#C4A0BE'])}
      ${lgd('deL2', ['#F8B890', '#F0A27E'])}${lgd('deL2S', ['#B988A6', '#A47898'])}
      <linearGradient id="deHazeA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6CDBC" stop-opacity="0"/><stop offset=".6" stop-color="#F6CDBC" stop-opacity=".35"/><stop offset="1" stop-color="#F8D6C6" stop-opacity=".85"/></linearGradient>
      <linearGradient id="deHazeA2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C8B4" stop-opacity="0"/><stop offset="1" stop-color="#F8D0BE" stop-opacity=".55"/></linearGradient>
      <linearGradient id="deNevoa" gradientUnits="userSpaceOnUse" x1="0" y1="226" x2="0" y2="300"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#F8EEF2"/><stop offset="1" stop-color="#D6CCE4"/></linearGradient>
      <radialGradient id="deWisp"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".6" stop-color="#F6F0F8" stop-opacity=".6"/><stop offset="1" stop-color="#F0EAF6" stop-opacity="0"/></radialGradient>
      ${lgd('dePraia', ['#EAB49C', '#E4A084', '#D9906E'])}
      ${lgd('deCosta', ['#F6B890', '#EC9E74'])}${lgd('deCostaS', ['#B08AA6', '#946E8E'])}
      <radialGradient id="deDuSol" gradientUnits="userSpaceOnUse" cx="640" cy="236" r="320"><stop offset="0" stop-color="#FFE8C0" stop-opacity=".42"/><stop offset=".5" stop-color="#FFD8A8" stop-opacity=".14"/><stop offset="1" stop-color="#FFE0B0" stop-opacity="0"/></radialGradient>
      <linearGradient id="deDuReflexo" gradientUnits="userSpaceOnUse" x1="0" y1="360" x2="0" y2="510"><stop offset="0" stop-color="#E88A78" stop-opacity="0"/><stop offset="1" stop-color="#E88A78" stop-opacity=".4"/></linearGradient>
      <pattern id="deGraoAreia" width="46" height="46" patternUnits="userSpaceOnUse">${Array.from({ length:70 }, (_, k) => `<circle cx="${f1(R(0, 46))}" cy="${f1(R(0, 46))}" r="${f1(R(.35, .85))}" fill="${k % 3 ? '#FFF0DA' : '#5A2A3A'}" opacity="${k % 3 ? .3 : .22}"/>`).join('')}</pattern>
      <clipPath id="deClipLuz"><path d="${D_LUZ}"/></clipPath><clipPath id="deClipSom"><path d="${D_SOMBRA}"/></clipPath>
      ${lgd('deWelSeca', ['#E2C08A', '#B08850'])}
      <linearGradient id="deWelE" gradientUnits="userSpaceOnUse" x1="-8" y1="0" x2="-92" y2="0"><stop offset="0" stop-color="#86BA52"/><stop offset=".4" stop-color="#5E903A"/><stop offset=".72" stop-color="#8A9248"/><stop offset="1" stop-color="#C6A66E"/></linearGradient>
      <linearGradient id="deWelD" gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="92" y2="0"><stop offset="0" stop-color="#86BA52"/><stop offset=".4" stop-color="#5E903A"/><stop offset=".72" stop-color="#8A9248"/><stop offset="1" stop-color="#C6A66E"/></linearGradient>
      <radialGradient id="deCone" cx=".35" cy=".3"><stop offset="0" stop-color="#FFB49A"/><stop offset="1" stop-color="#C83E2A"/></radialGradient>
      <radialGradient id="deCrown" cx=".4" cy=".3"><stop offset="0" stop-color="#A87A50"/><stop offset="1" stop-color="#5A3418"/></radialGradient>
      ${lgd('deGeco', ['#FFE6DA', '#F6BFAE', '#E2A090'])}
      ${lgd('deFcCauda', ['#F8DCB0', '#E8B678', '#CC8E50'])}
      ${lgd('deMontB', ['#9EA8D2', '#B8BCDA', '#D2D2E4'])}
      ${lgd('deMesaS', ['#B0605E', '#8E4A52'])}
      ${lgd('deTalus', ['#E8A890', '#E2B494', '#E8C4A0'])}
      <linearGradient id="deHazeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF2FA" stop-opacity="0"/><stop offset="1" stop-color="#F6EADA" stop-opacity=".55"/></linearGradient>
      <linearGradient id="deHazeB2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAEEDC" stop-opacity=".7"/><stop offset="1" stop-color="#FAEEDC" stop-opacity="0"/></linearGradient>
      <linearGradient id="deSagVol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".3" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".7" stop-color="#102008" stop-opacity="0"/><stop offset="1" stop-color="#102008" stop-opacity=".3"/></linearGradient>
      <radialGradient id="deFlorSag" cx=".5" cy=".8"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="#F0EAD0"/></radialGradient>
      <radialGradient id="deFigoR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#B8E6C6"/><stop offset=".6" stop-color="#78B09A"/><stop offset="1" stop-color="#4E887A"/></radialGradient>
      <radialGradient id="deTuna" cx=".35" cy=".3"><stop offset="0" stop-color="#FF7AAA"/><stop offset="1" stop-color="#B41E5A"/></radialGradient>
      <radialGradient id="deBarrilR" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E2E486"/><stop offset=".55" stop-color="#A8B246"/><stop offset="1" stop-color="#6E7E2A"/></radialGradient>
      <radialGradient id="deRocha" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E2C6AE"/><stop offset=".6" stop-color="#B08C76"/><stop offset="1" stop-color="#7E5E4A"/></radialGradient>
      ${lgd('deNuvC', ['#E6EAF4', '#B4BCD2', '#8A94B0'])}
      ${lgd('dePica', ['#EEDCB8', '#C8A87C'])}
    </defs>
    <rect id="de-ceu0" width="800" height="500" fill="url(#deCeu0)" style="transition:opacity 3s"/>
    <rect id="de-ceu1" width="800" height="500" fill="url(#deCeu1)" style="opacity:0;transition:opacity 3s"/>
    <rect id="de-ceu2" width="800" height="500" fill="url(#deCeu2)" style="opacity:0;transition:opacity 3s"/>
    <g id="de-estrelas" style="transition:opacity 3s">${Array.from({ length:26 }, () => `<circle cx="${R(10, 790).toFixed(0)}" cy="${R(8, 120).toFixed(0)}" r="${R(.6, 1.6).toFixed(1)}" fill="#FFF6E0" opacity="${R(.4, .9).toFixed(2)}"/>`).join('')}</g>
    <g id="de-sol" class="toque" style="transform:translate(${SOL[0].x}px,${SOL[0].y}px) scale(${SOL[0].s});transition:transform 3s ease-in-out"><circle r="80" fill="url(#deSolG)"/><circle r="30" fill="url(#deSolD)" stroke="#F0A030" stroke-width="2.4"/><path d="M-16 -12 q8 -9 20 -9" stroke="#FFF8DA" stroke-width="4" fill="none" stroke-linecap="round"/><circle r="44" fill="transparent"/></g>
    <g id="de-mundo" style="transition:transform 3.2s cubic-bezier(.6,0,.3,1)">
    <!-- ===== A: Namibe, amanhecer ===== -->
    <g id="de-pA" clip-path="url(#deClip)">
      <ellipse cx="560" cy="262" rx="460" ry="96" fill="url(#deHorizA)"/>
      <g class="deriva" opacity=".9">${estrato(230, 92, 190, 12)}${estrato(330, 74, 120, 8)}${estrato(470, 126, 150, 9)}${estrato(80, 150, 130, 7)}</g>
      <rect x="-10" y="286" width="380" height="50" fill="url(#deMar)"/>
      <path d="M-10 286.6 H370" stroke="#F4E6F2" stroke-width="1.6" opacity=".9"/>
      <g stroke-linecap="round" fill="none">${Array.from({ length:22 }, () => { const y = R(290, 326), x = R(-10, 330), l = R(6, 22) * (y - 280) / 30; return `<path d="M${f1(x)} ${f1(y)} h${f1(l)}" stroke="${R(0, 1) < .55 ? '#F6C8D4' : '#E6EAFF'}" stroke-width="${f1(.8 + (y - 288) / 30)}" opacity=".7"/>`; }).join('')}${Array.from({ length:14 }, () => { const y = R(296, 326), x = R(-10, 320), l = R(8, 18) * (y - 280) / 30; return `<path d="M${f1(x)} ${f1(y)} q${f1(l / 2)} -2.4 ${f1(l)} 0" stroke="#4A5E9E" stroke-width="1.2" opacity=".45"/>`; }).join('')}</g>
      ${[[300, 36, 180], [380, 52, 200], [470, 44, 190], [570, 60, 220], [690, 48, 200], [800, 56, 200]].map(([x, h, w]) => duna(x, 302, w, h, 'url(#deL1)', 'url(#deL1S)', '#FFE6D6')).join('')}
      <rect x="150" y="236" width="680" height="70" fill="url(#deHazeA)"/>
      ${[[380, 44, 190], [500, 64, 230], [650, 56, 240], [790, 66, 220]].map(([x, h, w]) => duna(x, 320, w, h, 'url(#deL2)', 'url(#deL2S)', '#FFDCC0')).join('')}
      <rect x="250" y="262" width="580" height="62" fill="url(#deHazeA2)"/>
      <g id="de-banco" filter="url(#deBlur2)" pointer-events="none"><path d="M-50 300 V266 H340 L346 300Z" fill="url(#deNevoa)"/>${nevoaBanco(BANCO, 'url(#deNevoa)')}<g transform="translate(3 -4)" opacity=".75">${nevoaBanco(BANCO.map(([x, y, r]) => [x, y, r * .7]), '#FFF4EE')}</g><g opacity=".5">${nevoaBanco([[300, 290, 22], [340, 292, 26], [380, 296, 22], [416, 300, 16]], '#F6EEF4')}</g></g>
      <path d="M-10 334 C70 330 160 322 230 316 C280 311 320 306 360 302 L440 300 V500 H-10Z" fill="url(#dePraia)"/>
      <path d="${offCosta(3.4, 0, 1)}" stroke="#B992A8" stroke-width="6" fill="none" opacity=".55"/>
      <path d="${offCosta(1.2, 0, 1)}" stroke="#F2D8E0" stroke-width="1.4" fill="none" opacity=".7"/>
      <g fill="none" stroke-linecap="round"><path d="${offCosta(-1, 1, 1.7)}" stroke="#FFFFFF" stroke-width="2.6" opacity=".95"/><path d="${offCosta(-3.8, 1.4, 2.3)}" stroke="#FFFFFF" stroke-width="1.6" stroke-dasharray="9 4" opacity=".8"/><path d="${offCosta(-9, 1, 1.3)}" stroke="#46589A" stroke-width="1.8" stroke-dasharray="30 16" opacity=".35" transform="translate(0 1.6)"/><path d="${offCosta(-9, 1, 1.3)}" stroke="#FFFFFF" stroke-width="1.8" stroke-dasharray="30 16" opacity=".75"/><path d="${offCosta(-17, .8, 1.1)}" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="16 30" stroke-dashoffset="12" opacity=".55"/></g>
      ${[[10, 160, 18], [120, 180, 26], [236, 170, 20], [340, 160, 22]].map(([x, w, h]) => duna(x, 366, w, h, 'url(#deL1)', 'url(#deL1S)', '#FFE8DA')).join('')}
      <rect x="-10" y="336" width="440" height="34" fill="url(#deHazeA2)"/>
      ${[[-20, 200, 34], [110, 220, 44], [250, 200, 36], [370, 180, 30]].map(([x, w, h]) => duna(x, 398, w, h, 'url(#deL2)', 'url(#deL2S)', '#FFDEC4')).join('')}
      <rect x="-10" y="356" width="440" height="46" fill="url(#deHazeA2)" opacity=".7"/>
      ${duna(-30, 444, 200, 44, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}${duna(80, 440, 250, 70, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}${duna(220, 436, 200, 54, 'url(#deCosta)', 'url(#deCostaS)', '#FFE2C8')}
      <g stroke-linecap="round" fill="none">${[[14, 400], [40, 410], [128, 384], [168, 396], [250, 384], [290, 372], [196, 410], [96, 420]].map(([x, y]) => `<g stroke="#7A8A4A" stroke-width="1.5"><path d="M${x} ${y} q-3 -7 -7 -9 M${x} ${y} q-1 -9 -2 -12 M${x} ${y} q2 -9 4 -11 M${x} ${y} q4 -6 8 -7"/></g><path d="M${x - 1} ${y - 1} q0 -6 -1 -9" stroke="#C8D48A" stroke-width=".9"/>`).join('')}</g>
      <g class="deriva-nevoa" filter="url(#deBlur2)" opacity=".8" pointer-events="none">${[[30, 322, 80, 9], [140, 316, 90, 8], [250, 308, 80, 7], [330, 300, 70, 8], [400, 296, 50, 7], [80, 352, 60, 6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#deWisp)"/>`).join('')}</g>
      <path class="de-areia toque" d="${D_DUNA}" fill="url(#deDuLuz)"/>
      <path d="${D_LUZ}" fill="url(#deDuSol)" pointer-events="none"/>
      <g clip-path="url(#deClipLuz)" pointer-events="none">${desenhaOndas(ondasDuna(faceLuz, 17, .04, .97, 1, 3.4, 15), '#B85A32', '#FFE8C4', .9, 2.4, .26, .42)}</g>
      <path class="de-areia toque" d="${D_SOMBRA}" fill="url(#deDuSombra)"/>
      <path d="${D_SOMBRA}" fill="url(#deDuReflexo)" pointer-events="none"/>
      <g clip-path="url(#deClipSom)" pointer-events="none">${avalanches()}${desenhaOndas(ondasDuna(faceSom, 16, .04, .97, 1, 3.2, 14), '#3A2252', '#D29CC0', .8, 2.2, .24, .4)}<path d="${D_ARETE}" stroke="#40244E" stroke-width="12" fill="none" opacity=".22" filter="url(#deBlur2)"/></g>
      <path d="${D_DUNA}" fill="url(#deGraoAreia)" pointer-events="none"/>
      <g fill="none" stroke="#B05C34" stroke-width="1.1" stroke-linecap="round" opacity=".5" pointer-events="none">${trilhaBes(cub([548, 214], [600, 280], [560, 360], [640, 460], 46), '')}</g>
      <path d="M548 214 C600 280 560 360 640 460" stroke="#C26A3C" stroke-width=".7" fill="none" opacity=".3" pointer-events="none"/>
      <g fill="#9A4826" opacity=".5" pointer-events="none">${[[672, 330, .75, 28], [684, 342, .8, 22], [690, 358, .85, 30], [704, 372, .9, 24], [710, 390, .95, 32], [726, 404, 1, 26], [732, 424, 1.05, 32], [750, 438, 1.1, 26]].map(([x, y, s, r]) => pegada(x, y, s * 1.9, r)).join('')}</g>
      <path d="M716 470 C690 462 676 452 662 436" stroke="#B4603A" stroke-width="1.2" fill="none" stroke-dasharray="1 4" stroke-linecap="round" opacity=".5" pointer-events="none"/>
      <g pointer-events="none" fill="none" stroke-linecap="round"><path d="${D_ARETE}" stroke="#52305E" stroke-width="1.3" opacity=".7" transform="translate(-1.2 0)"/><path d="${D_ARETE}" stroke="#FFE6C2" stroke-width="2.2" opacity=".95" transform="translate(1 0)"/><path d="${D_SIL_L}" stroke="#FFD4AE" stroke-width="2.2" opacity=".9"/><path d="${D_SIL_R}" stroke="#FFF2D6" stroke-width="2.8"/><path d="M528 197 C548 201 590 212 640 236" stroke="#FFFFFF" stroke-width="1.2" opacity=".7"/></g>
      <g id="de-poeira" pointer-events="none" filter="url(#deBlur2)" opacity=".5"><path d="M524 196 C560 186 600 184 640 190 C600 190 560 194 524 198Z" fill="#FFE4C0"/><path d="M500 206 C540 200 580 202 610 208 C580 206 540 206 500 208Z" fill="#FFE8CA"/></g>
      <g id="de-neblina" filter="url(#deBlur)" opacity=".9" pointer-events="none"><g id="de-neb-mov"><g class="deriva-nevoa">${[[40, 268, 120, 26], [160, 258, 110, 24], [270, 274, 90, 18], [-30, 250, 100, 32], [110, 240, 90, 20], [210, 288, 120, 14], [70, 294, 130, 12], [230, 236, 70, 16], [320, 290, 70, 12]].map(([x, y, rx, ry], k) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${k % 2 ? '#FFF6F4' : '#F4F0FA'}" opacity=".78"/>`).join('')}</g></g></g>
      <g id="de-vagas">${VAGA.map((v, i) => `<g class="de-vaga" data-i="${i}" pointer-events="none"><ellipse cx="${v.x}" cy="${v.y + 1}" rx="18" ry="5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4" opacity=".9"/>${brilhoHotspot(v.x, v.y - 18)}</g>`).join('')}</g>
      <g id="de-wel" class="toque" transform="translate(84 482)"><ellipse cx="0" cy="4" rx="82" ry="10" fill="#2A1430" opacity=".3"/><g transform="scale(.86 1)">${welwitschia}</g><ellipse cx="0" cy="-3" rx="15" ry="7.5" fill="url(#deCrown)" stroke="#3A2210" stroke-width="1.6"/><ellipse cx="0" cy="-6" rx="12" ry="4.2" fill="#B08058" stroke="#5E3A1E" stroke-width="1.2"/><path d="M-8 -6 q8 -3 16 0 M-5 -4.6 q5 -2 10 0" stroke="#6E4628" stroke-width=".9" fill="none"/>${[[-7, -9, -14], [-2, -12, -4], [4, -12, 6], [9, -9, 16]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 2 V-2" stroke="#6E4628" stroke-width="1.2"/><ellipse cx="0" cy="-5" rx="2.8" ry="4.2" fill="url(#deCone)" stroke="#7A1E14" stroke-width=".8"/><path d="M-2 -6 l4 2 M-2 -3.6 l4 -2 M-2 -8 l4 -1.4" stroke="#7A1E14" stroke-width=".6" opacity=".7"/><circle cx="-1" cy="-6.6" r=".7" fill="#FFD6C8"/></g>`).join('')}<rect x="-94" y="-30" width="188" height="44" fill="transparent"/></g>
      <g id="de-gecko" class="toque" transform="translate(614 476)"><ellipse cx="4" cy="2" rx="34" ry="3.4" fill="#6A2A1A" opacity=".25"/>
        <path d="M12 -6 C24 -9 34 -12 46 -7 C49 -5.6 48 -4 45 -4.4 C34 -7 24 -2 12 -1.6Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.2" stroke-linejoin="round"/>
        <g stroke="#E2A090" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M-6 -4 l-6 4"/><path d="M2 -3 l3 5"/><path d="M10 -4 l-3 5"/><path d="M14 -4 l6 4"/></g>
        <g fill="#FFC8BC" stroke="#B86A5E" stroke-width=".7" opacity=".95">${[[-13, 1, -20], [5, 3, 10], [-8, 3, -6], [21, 1, 24]].map(([x, y, a]) => `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 -1 L-4 2 Q0 3.6 4 2Z"/>`).join('')}</g>
        <path d="M-10 -9 C-2 -13 10 -12 16 -8 C18 -5 16 -2 10 -1 C0 0 -8 -1 -12 -4Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.3"/>
        <path d="M-4 -10 C2 -11.6 8 -11.2 13 -9" stroke="#FFF0EA" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>
        <g fill="#D88878" opacity=".55"><ellipse cx="-2" cy="-7" rx="1.6" ry="1"/><ellipse cx="4" cy="-7.4" rx="1.6" ry="1"/><ellipse cx="10" cy="-6.6" rx="1.4" ry=".9"/><ellipse cx="22" cy="-7.6" rx="1.4" ry=".8"/><ellipse cx="30" cy="-8.4" rx="1.2" ry=".7"/></g>
        <path d="M-10 -11 C-16 -16 -26 -15 -30 -9.6 C-31.4 -6.6 -28 -3.6 -22 -3.4 C-17 -3.2 -12 -4.4 -9 -6.6Z" fill="url(#deGeco)" stroke="#B8685A" stroke-width="1.3"/>
        <circle cx="-19" cy="-11" r="4.8" fill="#FFE6DE" stroke="#B8685A" stroke-width="1"/><circle cx="-19.4" cy="-11" r="3.4" fill="#3A2218"/><circle cx="-19.4" cy="-11" r="2" fill="#120A08"/><circle cx="-20.6" cy="-12.3" r="1.1" fill="#fff"/><circle cx="-18.2" cy="-9.8" r=".5" fill="#fff" opacity=".8"/>
        <path d="M-29 -6.4 q4 2 9 .4" stroke="#B8685A" stroke-width="1" fill="none" stroke-linecap="round"/><circle cx="-28" cy="-9.4" r=".5" fill="#8A4A3E"/>
        <path id="de-lingua" d="M-28 -6 C-31 -9 -29 -16 -23 -16" stroke="#FF6E8A" stroke-width="2.4" fill="none" stroke-linecap="round" style="opacity:0"/>
        <g id="de-gota-olho"><path d="M-17 -18.6 C-16 -17.4 -15 -16.6 -15 -15.6 A2 2 0 0 1 -19 -15.6 C-19 -16.6 -18 -17.4 -17 -18.6Z" fill="url(#deGotaG)" stroke="#2E7BC4" stroke-width=".7"/><circle cx="-17.6" cy="-15.8" r=".5" fill="#fff"/></g>
        <rect x="-32" y="-22" width="80" height="30" fill="transparent"/></g>
      <g id="de-bess">${BES.map((b, i) => besouro(i, b.x, b.y)).join('')}</g>
      <g id="de-mao" pointer-events="none"><path d="M226 448 C280 400 330 340 392 286" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="7 9" opacity=".9"/><path d="M398 280 l-14 2 l6 -12Z" fill="#fff"/></g>
    </g>
    <!-- ===== B: Sonora, meio-dia ===== -->
    <g id="de-pB" transform="translate(800 0)"><g clip-path="url(#deClip)">
      <path d="M-20 300 V268 C10 262 30 252 60 254 C90 256 100 240 130 238 C160 236 176 250 200 248 C236 244 250 232 290 236 C320 239 340 252 380 250 C420 248 440 236 480 240 C520 244 540 230 580 232 C620 234 640 248 680 246 C720 244 750 236 790 242 L820 246 V300Z" fill="url(#deMontB)"/>
      <path d="M60 254 C90 256 100 240 130 238 M290 236 C320 239 340 252 380 250 M580 232 C620 234 640 248 680 246" stroke="#DCE0F0" stroke-width="1.6" fill="none" opacity=".7"/>
      ${mesa(44, 164, 236)}${mesa(262, 320, 266)}${mesa(620, 704, 228)}
      <rect x="-20" y="220" width="840" height="86" fill="url(#deHazeB)"/>
      <path d="M-20 300 C100 292 250 296 400 294 C550 292 700 296 820 294 V500 H-20Z" fill="url(#dePlanB)"/>
      <rect x="-20" y="292" width="840" height="34" fill="url(#deHazeB2)"/>
      <g>${Array.from({ length:22 }, () => `<ellipse cx="${f1(R(-10, 810))}" cy="${f1(R(310, 446))}" rx="${f1(R(20, 70))}" ry="${f1(R(3, 8))}" fill="${R(0, 1) < .5 ? '#F8DCB0' : '#C9925E'}" opacity="${f1(R(.15, .3))}"/>`).join('')}</g>
      ${[[90, 312, .5], [250, 306, .4], [560, 308, .45], [700, 314, .55], [150, 304, .3], [470, 302, .32]].map(([x, y, s]) => sagLonge(x, y, s, '#8EA27E', '#C8D6A8')).join('')}
      <g>${Array.from({ length:26 }, () => { const x = R(0, 800), y = R(316, 440), r = R(5, 12) * (y / 400), j = Math.floor(R(0, 4)); const cb = ['#5E7234', '#6E7A36', '#4E6A44', '#6A8050'][j], ct = ['#9AAE52', '#B2B45E', '#86A272', '#A6BA7E'][j]; return `<ellipse cx="${f1(x + r * .3)}" cy="${f1(y + 1)}" rx="${f1(r * 1.5)}" ry="${f1(r * .3)}" fill="#7A4A2A" opacity=".25"/><path d="${copa(x, y - r * .5, r * 1.4, r * .8, 7, .3)}" fill="${cb}" stroke="#3A4620" stroke-width="1.1"/><path d="${copa(x + r * .2, y - r * .75, r * .95, r * .5, 6, .28)}" fill="${ct}"/><circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .9)}" r="${f1(r * .12 + .5)}" fill="#FFE27A"/>`; }).join('')}</g>
      <g>${Array.from({ length:14 }, () => { const x = R(0, 800), y = R(330, 446), r = R(4, 10); return `<ellipse cx="${f1(x + r * .3)}" cy="${f1(y + r * .5)}" rx="${f1(r * 1.1)}" ry="${f1(r * .28)}" fill="#5A341E" opacity=".25"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .6)}" fill="url(#deRocha)" stroke="#6E4A34" stroke-width="1.1"/><path d="M${f1(x - r * .5)} ${f1(y - r * .3)} q${f1(r * .4)} -${f1(r * .3)} ${f1(r * .8)} 0" stroke="#F4DCC4" stroke-width="1.1" fill="none"/>`; }).join('')}</g>
      <g transform="translate(196 446)"><ellipse cx="2" cy="2" rx="34" ry="4.4" fill="#5A341E" opacity=".28"/><path d="M0 0 C-4 -14 -2 -26 4 -34" stroke="#4E7A5A" stroke-width="6" fill="none" stroke-linecap="round"/>${[[0, -18, 18, 22, -14], [-14, -40, 16, 20, -30], [14, -46, 15, 19, 26], [2, -64, 13, 17, 6]].map(([x, y, rx, ry, a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#deFigoR)" stroke="#2A5444" stroke-width="1.8"/><path d="M${x - rx * .55} ${y - ry * .35} C${x - rx * .4} ${y - ry * .8} ${x} ${y - ry * .95} ${x + rx * .3} ${y - ry * .85}" stroke="#E2FFE8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></g><g stroke="#FFF6D8" stroke-width=".6" stroke-linecap="round">${[[-6, -6], [5, -4], [-2, 6], [6, 7], [0, -12], [-9, 3], [9, -10]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="1" fill="#F6E8B0" stroke="#8A7A40"/><path d="M${x + dx} ${y + dy} l-2.4 -2 M${x + dx} ${y + dy} l2.4 -2 M${x + dx} ${y + dy} l0 2.8"/>`).join('')}</g>`).join('')}<g stroke="#7E1A40" stroke-width="1">${[[-24, -56], [24, -64], [8, -82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="4.8" fill="url(#deTuna)"/><circle cx="${x - 1.2}" cy="${y - 1.8}" r="1" fill="#FFC8DC" stroke="none"/>`).join('')}</g><g transform="translate(-6 -80)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.6" rx="2.6" ry="3.8" transform="rotate(${a})" fill="#FFE04A" stroke="#C8901A" stroke-width=".6"/>`).join('')}<circle r="1.8" fill="#E8862A"/></g></g>
      <g transform="translate(640 446)"><ellipse cx="2" cy="2" rx="30" ry="4.4" fill="#5A341E" opacity=".28"/><path d="M-22 0 C-26 -30 -14 -46 0 -46 C14 -46 26 -30 22 0Z" fill="url(#deBarrilR)" stroke="#3E4A16" stroke-width="2"/><path d="M-15 0 C-19 -26 -9 -42 0 -44 M-7 0 C-9 -28 -4 -42 0 -44 M7 0 C9 -28 4 -42 0 -44 M15 0 C19 -26 9 -42 0 -44" stroke="#4E5A1C" stroke-width="1.3" fill="none" opacity=".75"/><path d="M-17 -6 C-20 -24 -12 -38 -4 -42" stroke="#F0F2A0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/><g stroke="#B04A2A" stroke-width=".9" fill="none" stroke-linecap="round">${[[-18, -10], [-17, -22], [-12, -33], [-11, -6], [-9, -20], [-5, -34], [0, -8], [0, -22], [0, -36], [11, -6], [9, -20], [5, -34], [18, -10], [17, -22], [12, -33]].map(([x, y]) => `<path d="M${x} ${y} l-3 -3 M${x} ${y} l3 -3 M${x} ${y} q0 -5 2 -6"/>`).join('')}</g><g>${[-9, -3, 3, 9].map((dx, k) => `<g transform="translate(${dx} ${-46 + Math.abs(dx) * .3})">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-3" rx="1.8" ry="3.2" transform="rotate(${a})" fill="${k % 2 ? '#FFB43A' : '#FF8A2A'}" stroke="#B0501A" stroke-width=".5"/>`).join('')}<circle r="1.4" fill="#FFE27A"/></g>`).join('')}</g></g>
      <g transform="translate(730 440)" stroke-linecap="round" fill="none"><ellipse cx="0" cy="2" rx="22" ry="3.4" fill="#5A341E" opacity=".25"/>${[[-24, -120], [-12, -140], [0, -150], [12, -134], [26, -116], [-34, -96]].map(([dx, dy]) => { const pts = cub([0, 0], [dx * .2, dy * .4], [dx * .6, dy * .7], [dx, dy], 10); return `<path d="M0 0 Q${dx * .3} ${dy * .5} ${dx} ${dy}" stroke="#3E2E20" stroke-width="4.4"/><path d="M0 0 Q${dx * .3} ${dy * .5} ${dx} ${dy}" stroke="#7A6248" stroke-width="2.6"/><path d="${pts.slice(1, -1).map((p, i) => `M${f1(p[0])} ${f1(p[1])} l${i % 2 ? 3 : -3} -1.4`).join(' ')}" stroke="#3E2E20" stroke-width="1"/>${pts.slice(2, -2).map((p, i) => `<ellipse cx="${f1(p[0] + (i % 2 ? 3 : -3))}" cy="${f1(p[1] - 2)}" rx="1.4" ry="2.6" transform="rotate(${i % 2 ? 30 : -30} ${f1(p[0] + (i % 2 ? 3 : -3))} ${f1(p[1] - 2)})" fill="#7AB04A" stroke="none"/>`).join('')}<path d="M${dx} ${dy} l${dx > 0 ? 2 : -2} -12" stroke="#B42A1A" stroke-width="5.4"/><path d="M${dx} ${dy} l${dx > 0 ? 2 : -2} -12" stroke="#FF5A3A" stroke-width="3.2"/><circle cx="${dx + (dx > 0 ? 2.4 : -2.4)}" cy="${dy - 13}" r="1.6" fill="#FFB43A" stroke="none"/>`; }).join('')}</g>
      <g id="de-esc" class="toque" transform="translate(284 438)"><ellipse cx="0" cy="8" rx="36" ry="5" fill="#5A341E" opacity=".28"/><g id="de-esc-in"><path d="M8 -2 C18 -6 22 -16 16 -24 C12 -28 6 -26 8 -20" stroke="#5A2E14" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M8 -2 C18 -6 22 -16 16 -24 C12 -28 6 -26 8 -20" stroke="#D9903E" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M12 -4 l1 -2 M17 -9 l2 -1 M19 -16 l2 0 M16 -22 l1 1" stroke="#7A3E14" stroke-width="1" stroke-linecap="round"/><path d="M8 -20 l-4 3" stroke="#3A1E0C" stroke-width="2" stroke-linecap="round"/><path d="M-8 2 l-6 4 M-2 2 l-3 5 M4 2 l2 5 M10 2 l5 4" stroke="#8A4A1E" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="12" ry="4.6" fill="#E09A4C" stroke="#5A2E14" stroke-width="1.4"/><path d="M-6 -3 v6 M0 -4 v8 M6 -3 v6" stroke="#A8601E" stroke-width=".8"/><path d="M-8 -2 C-2 -4 4 -4 9 -2" stroke="#FFD8A0" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-12 -1 C-18 -4 -22 -2 -24 -6 M-12 1 C-18 4 -22 2 -24 6" stroke="#5A2E14" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-26 -8 l4 1 l-1 3Z M-26 8 l4 -1 l-1 -3Z" fill="#D9903E" stroke="#5A2E14" stroke-width="1"/><circle cx="-9" cy="-2" r="1.6" fill="#fff"/><circle cx="-9.4" cy="-2" r=".9" fill="#12121A"/></g><path d="M-8 6 C-6 -10 16 -16 34 -6 C40 -2 40 6 34 8Z" fill="url(#deRocha)" stroke="#5E4434" stroke-width="1.8"/><path d="M0 -4 C8 -10 20 -10 28 -6" stroke="#F0DCC8" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14 -2 l4 6 l-2 4" stroke="#6E5444" stroke-width="1" fill="none" opacity=".6"/><rect x="-30" y="-24" width="72" height="34" fill="transparent"/></g>
      <rect x="-20" y="${SUPB}" width="840" height="${500 - SUPB}" fill="url(#deSoloB)"/>
      <path d="M-20 ${SUPB + 20} C200 ${SUPB + 16} 500 ${SUPB + 24} 820 ${SUPB + 18}" stroke="#B87A4C" stroke-width="3" fill="none" opacity=".35"/><path d="M-20 ${SUPB + 36} C240 ${SUPB + 40} 520 ${SUPB + 32} 820 ${SUPB + 38}" stroke="#3E2214" stroke-width="2" fill="none" opacity=".3"/>
      <path d="M-20 ${SUPB} C200 ${SUPB - 3} 600 ${SUPB + 3} 820 ${SUPB}" stroke="#E8B884" stroke-width="4" fill="none"/>
      <g>${Array.from({ length:30 }, () => { const x = R(0, 800), y = R(SUPB + 10, 496), rx = R(2, 5), ry = R(1.4, 3); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#B07A52" stroke="#5A341E" stroke-width=".6" opacity=".8"/><path d="M${f1(x - rx * .5)} ${f1(y - ry * .3)} h${f1(rx * .8)}" stroke="#E8C49A" stroke-width=".7" opacity=".8"/>`; }).join('')}</g>
      <path d="${raiz}" stroke="#4A2A14" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${raiz}" stroke="#C99A6A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="${raiz}" stroke="#F0CFA0" stroke-width=".8" fill="none" stroke-linecap="round" transform="translate(0 -.8)" opacity=".7"/>
      <path id="de-raiz-agua" d="${raiz}" stroke="#5AC8FF" stroke-width="3" fill="none" stroke-linecap="round" style="opacity:0;transition:opacity 1.4s"/>
      <ellipse cx="404" cy="${SUPB + 2}" rx="66" ry="6" fill="#3A1E0C" opacity=".32"/>
      <g id="de-sag" class="toque" data-fig="saguaro">${saguaro}${brilhoHotspot(470, 186)}</g>
      <path d="M352 ${SUPB + 1} C372 ${SUPB - 7} 428 ${SUPB - 7} 450 ${SUPB + 1}Z" fill="#B88458" stroke="#6E4428" stroke-width="1.2" pointer-events="none"/><path d="M366 ${SUPB - 3} C384 ${SUPB - 7} 416 ${SUPB - 7} 434 ${SUPB - 3}" stroke="#E8C08A" stroke-width="1.4" fill="none" pointer-events="none"/>
      <g id="de-pica" transform="translate(860 120)" style="opacity:0"><g id="de-pica-vira" transform="scale(-1 1)">${pica}</g></g>
      <g id="de-nuvs" style="opacity:0;transition:opacity 1s;pointer-events:none">${[180, 380, 580].map((x, i) => `<g class="de-nuv toque" data-i="${i}" data-x="${x}"><g style="animation:flutua ${(2.6 + i * .5).toFixed(1)}s ease-in-out infinite alternate">${nuvemChuva(x)}${brilhoHotspot(x + 40, 40)}</g><rect x="${x - 80}" y="20" width="160" height="84" fill="transparent"/></g>`).join('')}</g>
    </g></g>
    ${(semente = 478519057, '')}
    <!-- ===== C: Saara, oásis ===== -->
    <g id="de-pC" transform="translate(1600 0)"><g clip-path="url(#deClip)">
      <g class="deriva" opacity=".85"><use href="#nuvem" x="380" y="70" width="110" height="52" style="color:#FFE6C8"/><use href="#nuvem" x="600" y="40" width="80" height="38" style="color:#FCD8C0"/></g>
      <g stroke="#6A4A6A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"><path d="M520 150 q6 -6 12 0 q6 -6 12 0"/><path d="M556 168 q5 -5 10 0 q5 -5 10 0"/></g>
      <path d="M-20 320 C60 280 140 262 230 290 C300 256 380 246 470 276 C560 250 660 254 820 286 V340 H-20Z" fill="url(#deDuC1)" opacity=".9"/><g fill="none" stroke="#9A6A5A" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" opacity=".7"><path transform="translate(540 266) scale(0.8)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path transform="translate(566 264) scale(0.75)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path transform="translate(590 262) scale(0.7)" d="M-14 0 V-9 C-16 -12 -16 -14 -12 -15 C-8 -22 4 -22 8 -15 C11 -14 12 -11 11 -8 V0 M-12 -12 C-16 -14 -18 -20 -20 -24 L-24 -24 L-23 -21 L-20 -21"/><path d="M520 266 l0 -10 M522 256 a3 3 0 1 0 0.1 0" /></g>
      <path d="M230 290 C260 276 290 266 320 262 M470 276 C510 262 540 256 570 254" stroke="#FFF0DC" stroke-width="2" fill="none" opacity=".8"/>
      <g id="de-mira" class="toque"><rect x="60" y="322" width="680" height="16" fill="url(#deMiragem)"/><g opacity=".35" transform="translate(0 668) scale(1 -1)"><path d="M230 344 C260 336 290 334 320 334 L380 344Z M470 344 C510 336 540 334 570 334 L620 344Z" fill="#E8B894"/></g><rect x="60" y="316" width="680" height="26" fill="transparent"/></g>
      <path d="M-20 350 C120 322 260 328 380 340 C520 320 660 324 820 336 V400 H-20Z" fill="url(#deDuC2)" stroke="#D99A50" stroke-width="1.6"/>
      <path d="M20 344 C120 326 220 328 300 334 M500 330 C580 322 660 324 760 332" stroke="#FFF0C8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M-20 372 C30 350 80 340 130 352 C160 344 190 346 220 360 L220 400 H-20Z" fill="#F2BE76"/><path d="M130 352 C116 364 106 380 100 398 L220 398 L220 360 C190 346 160 344 130 352Z" fill="#DE9E58" opacity=".8"/><path d="M-20 372 C30 350 80 340 130 352 C160 344 190 346 220 360" stroke="#FFF2D2" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M600 366 C650 346 700 338 760 344 C790 346 810 350 830 356 L830 400 H600Z" fill="#F2BE76"/><path d="M760 344 C744 358 734 378 730 398 L830 398 V356 C810 350 790 346 760 344Z" fill="#DE9E58" opacity=".8"/><path d="M600 366 C650 346 700 338 760 344 C790 346 810 350 830 356" stroke="#FFF2D2" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path class="de-areia toque" d="M-20 ${SUPC - 10} C120 ${SUPC - 18} 300 ${SUPC - 4} 420 ${SUPC - 8} C560 ${SUPC - 14} 700 ${SUPC - 6} 820 ${SUPC - 12} V430 H-20Z" fill="url(#deAreia)"/>
      <g fill="none" opacity=".6" pointer-events="none">${ondinhas(0, 780, SUPC - 6, 424, 16, '#D9A058', 1.4)}</g>
      <g pointer-events="none">${[[120, 412, 9], [520, 420, 7], [710, 414, 11], [360, 424, 5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#C08A5A" stroke="#7A4E2A" stroke-width="1.2"/><path d="M${x - r * .5} ${y - r * .2} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#F2D2A8" stroke-width="1.2" fill="none"/>`).join('')}<g stroke="#A8864A" stroke-width="1.6" fill="none" stroke-linecap="round">${[[40, 420], [330, 414], [560, 426], [770, 422]].map(([x, y]) => `<path d="M${x} ${y} q-3 -7 -7 -10 M${x} ${y} q0 -9 2 -13 M${x} ${y} q4 -7 8 -9"/>`).join('')}</g></g>
      <rect x="-20" y="430" width="840" height="70" fill="url(#deCorte)"/>
      <rect x="-20" y="430" width="840" height="70" fill="url(#deGraos)"/>
      <path d="M-20 452 C200 448 600 456 820 450" stroke="#B47838" stroke-width="1.4" fill="none" opacity=".7"/>
      <rect x="-20" y="470" width="840" height="30" fill="url(#deLencol)"/><rect x="-20" y="470" width="840" height="30" fill="url(#deGraos)" opacity=".6"/>
      <path id="de-lencol-brilho" d="M-20 471 H820" stroke="#DFF6FF" stroke-width="2.4"/>
      <path d="M-20 430 C200 428 600 432 820 428" stroke="#FFE6B0" stroke-width="3" fill="none"/>
      <g id="de-palmas">${COVA.map((v, i) => `<g class="de-palma" style="display:none"><g class="cresce">${palmeira(v.x + [-48, -56, -60][i], v.y - 6, [150, 128, 140][i], [14, -18, -14][i], ['#4E9A3A', '#6AAE3A', '#2E8A5A'][i], ['#245A1E', '#3A6A1A', '#1A5A3A'][i], ['#7CC24E', '#A2CC4E', '#5AB08A'][i])}</g></g>`).join('')}</g>
      <g id="de-capim" style="opacity:0;transition:opacity 1.6s">${COVA.map((v, i) => { const lado = i % 2 ? 1 : -1; return `
        <g transform="translate(${v.x + 66 * lado} ${v.y + 2})"><path d="${copa(0, -9, 17, 10, 8, .32)}" fill="${['#5E9E3A', '#7AA83A', '#4E8E4A'][i]}" stroke="#2E5A1E" stroke-width="1.6"/><path d="M-8 -12 q6 -4 12 -2" stroke="#C8EE9A" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="-6" cy="-10" r="1.8" fill="#FF8A5A"/><circle cx="5" cy="-14" r="1.8" fill="#FFD25A"/></g>
        <g stroke-linecap="round">${[-56, -48, 48, 56].map((dx, k) => { const x = v.x + dx, y = v.y + (k % 2 ? 1 : 3), h = 26 + (k % 2) * 8; return `<path d="M${x} ${y} q${dx > 0 ? 2 : -2} ${-h / 2} ${dx > 0 ? 4 : -4} ${-h}" stroke="#4E8A2A" stroke-width="2.2" fill="none"/><rect x="${x + (dx > 0 ? 2 : -6)}" y="${y - h - 1}" width="4" height="10" rx="2" fill="#8A5224" stroke="#4E2E12" stroke-width="1"/><path d="M${x} ${y} q${dx > 0 ? -6 : 6} -10 ${dx > 0 ? -10 : 10} -14" stroke="#6AAE3A" stroke-width="1.8" fill="none"/>`; }).join('')}</g>
        <g>${[[-62, 4, 7], [-24, 13, 5], [28, 13, 6], [62, 3, 5]].map(([dx, dy, r]) => `<ellipse cx="${v.x + dx}" cy="${v.y + dy}" rx="${r}" ry="${r * .6}" fill="#C8A47A" stroke="#7A5A3A" stroke-width="1.2"/><path d="M${v.x + dx - r * .5} ${v.y + dy - r * .2} q${r * .4} -${r * .3} ${r * .8} 0" stroke="#F4E2C4" stroke-width="1" fill="none"/>`).join('')}</g>`; }).join('')}${COVA.map(v => Array.from({ length:5 }, (_, k) => { const x = v.x - 50 + k * 25 + R(-6, 6), y = v.y + R(-4, 8); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q-3 -8 -7 -12 M${x.toFixed(0)} ${y.toFixed(0)} q0 -10 2 -15 M${x.toFixed(0)} ${y.toFixed(0)} q4 -8 8 -11" stroke="#5E9A2E" stroke-width="2" fill="none" stroke-linecap="round"/>`; }).join('')).join('')}</g>
      <g id="de-covas">${COVA.map((v, i) => `<g class="de-cova toque" data-i="${i}">
        <rect class="de-poco" x="${v.x - 9}" y="${v.y + 2}" width="18" height="0" fill="url(#dePoco)" stroke="#4E2E12" stroke-width="1.6" rx="3"/>
        <rect class="de-poco-agua" x="${v.x - 5}" y="472" width="10" height="0" rx="3" fill="url(#deAgua)" opacity=".85"/>
        <ellipse class="de-buraco" cx="${v.x}" cy="${v.y}" rx="0" ry="0" fill="#8A5428" stroke="#5E3416" stroke-width="1.6"/>
        <ellipse class="de-lago" cx="${v.x}" cy="${v.y}" rx="0" ry="0" fill="url(#deAgua)" stroke="#2E7BC4" stroke-width="2"/>
        <g class="de-lago-brilho" style="opacity:0"><ellipse cx="${v.x + 4}" cy="${v.y + 2}" rx="38" ry="7.5" fill="#2E86D8" opacity=".45"/><ellipse cx="${v.x - 10}" cy="${v.y - 4}" rx="22" ry="2.6" fill="#D6F4FF" opacity=".55"/><path d="M${v.x - 20} ${v.y - 2} q10 -4 20 0 M${v.x + 6} ${v.y + 3} q8 -3 14 0" stroke="#EAF8FF" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${v.x - 44} ${v.y + 1} C${v.x - 30} ${v.y + 15} ${v.x + 30} ${v.y + 15} ${v.x + 44} ${v.y + 1}" stroke="#E8C48A" stroke-width="3" fill="none" stroke-linecap="round"/></g>
        <g class="de-marca"><ellipse cx="${v.x}" cy="${v.y}" rx="26" ry="7" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="5 5"/><path d="M${v.x - 4} ${v.y - 1} l8 2 M${v.x + 6} ${v.y - 3} l-6 5" stroke="#B87A3A" stroke-width="1.6" stroke-linecap="round"/>${brilhoHotspot(v.x + 18, v.y - 16)}</g>
        <rect x="${v.x - 40}" y="${v.y - 30}" width="80" height="${500 - v.y + 30}" fill="transparent"/></g>`).join('')}</g>
      <g id="de-gangas" style="opacity:0;transition:opacity 1s" class="toque">${ganga(COVA[0].x - 44, COVA[0].y + 4, 1)}${ganga(COVA[0].x + 40, COVA[0].y + 10, -1)}<rect x="${COVA[0].x - 62}" y="${COVA[0].y - 20}" width="120" height="36" fill="transparent"/></g>
      <g id="de-jer" class="toque" transform="translate(176 ${SUPC + 4})"><g id="de-jer-pos">${jerboa}</g><rect x="-22" y="-46" width="70" height="52" fill="transparent"/></g>
      <g id="de-drome" class="toque" data-fig="dromedario" transform="translate(728 ${SUPC - 4})"><g id="de-dr-in"><g transform="scale(.94)">${dromedario}</g></g><rect x="-118" y="-198" width="198" height="202" fill="transparent"/>${brilhoHotspot(34, -152)}</g>
    </g></g>
    </g>
    <g id="de-feco" class="toque" data-fig="feneco" style="transform:translate(${FECO[0].x}px,${FECO[0].y}px);transition:transform 3.2s ease-in-out"><g transform="scale(.8)">${feco}</g><rect x="-40" y="-100" width="80" height="104" fill="transparent"/>${brilhoHotspot(-26, -84)}</g>
    <rect width="800" height="500" fill="url(#deVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#deGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mundo = el(s, '#de-mundo');
  /* ---------- vida de fundo ---------- */
  const graos = [];
  const sopra = (x, y, n, cor) => { for (let i = 0; i < n; i++) graos.push({ x:x + sorte(-30, 30), y:y + sorte(-6, 6), vx:sorte(1.6, 4.2), vy:sorte(-1.2, .2), v:0, cor:cor || '#F2C48A', r:sorte(.9, 2) }); };
  c.desenho(ctx => {
    for (let i = graos.length - 1; i >= 0; i--) {
      const g = graos[i]; g.v++; g.x += g.vx; g.y += g.vy; g.vy += .03;
      ctx.globalAlpha = Math.max(0, 1 - g.v / 70); ctx.fillStyle = g.cor; ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 7); ctx.fill();
      if (g.v > 70) graos.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  });
  const orelhas = [...s.querySelectorAll('.de-orelha')];
  const mexeOrelha = (forte) => orelhas.forEach((o, i) => o.animate([{ transform:'rotate(0)' }, { transform:`rotate(${(i ? 1 : -1) * (forte ? 14 : 7)}deg)` }, { transform:'rotate(0)' }, { transform:`rotate(${(i ? 1 : -1) * (forte ? 10 : 4)}deg)` }, { transform:'rotate(0)' }], { duration:forte ? 700 : 520, delay:i * 60 }));
  (function orelhaIdle(){ if (!vivo) return; mexeOrelha(false); depois(sorte(2600, 4600), orelhaIdle); })();
  const piscar = () => { const o = el(s, '.de-olhos'); o.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(.1)' }, { transform:'scaleY(1)' }], { duration:220 }); };
  el(s, '.de-olhos').style.transformBox = 'fill-box'; el(s, '.de-olhos').style.transformOrigin = '50% 50%';
  (function pisca(){ if (!vivo) return; piscar(); depois(sorte(2800, 5200), pisca); })();
  const mao = el(s, '#de-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const vagasG = [...s.querySelectorAll('.de-vaga')];
  const vaiPara = k => {
    mundo.style.transform = `translateX(${-800 * k}px)`;
    [0, 1, 2].forEach(j => el(s, '#de-ceu' + j).style.opacity = j === k ? 1 : 0);
    el(s, '#de-estrelas').style.opacity = k === 0 ? 1 : 0;
    el(s, '#de-sol').style.transform = `translate(${SOL[k].x}px,${SOL[k].y}px) scale(${SOL[k].s})`;
    el(s, '#de-feco').style.transform = `translate(${FECO[k].x}px,${FECO[k].y}px)`;
    el(s, '#de-feco-pula').animate([{ transform:'translateY(0)' }, { transform:'translateY(-14px)' }, { transform:'translateY(0)' }], { duration:400, iterations:8 });
    toca('vapor');
  };
  /* ---------- 1. neblina: levar o besouro ao alto da duna ---------- */
  const bes = [...s.querySelectorAll('.de-bes')], pos = BES.map(b => ({ x:b.x, y:b.y, foi:false })), livre = VAGA.map(() => true);
  const poe = i => bes[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(1.2)`);
  let arr = null;
  bes.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'neblina' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(150, Math.min(490, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; bes[i].style.cursor = 'grab';
    let alvo = -1, dmin = 1e9;
    VAGA.forEach((v, j) => { if (!livre[j]) return; const d = Math.hypot(pos[i].x - v.x, pos[i].y - v.y); if (d < dmin) { dmin = d; alvo = j; } });
    if (!moveu) alvo = livre.indexOf(true);
    if (alvo >= 0 && (!moveu || dmin < 90 || pos[i].y < 300)) sobe(i, alvo); else volta(i);
  });
  function anda(i, x1, y1, ms, fim){
    const x0 = pos[i].x, y0 = pos[i].y, pernas = el(bes[i], '.de-pernas');
    tw(ms, (k, e) => { pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.abs(Math.sin(k * 26)) * 1.6; poe(i); pernas.setAttribute('transform', `translate(${(Math.sin(k * 40) * 1.4).toFixed(2)} 0)`); }, () => { pernas.removeAttribute('transform'); fim && fim(); });
  }
  function volta(i){ ocupado = true; anda(i, BES[i].x, BES[i].y, 700, () => ocupado = false); toca('glub'); api.diz('Arraste o besouro até o alto da duna, onde a neblina chega!'); }
  function sobe(i, j){
    pos[i].foi = true; livre[j] = false; ocupado = true; const v = VAGA[j];
    vagasG[j].style.display = 'none';
    const dist = Math.hypot(v.x - pos[i].x, v.y - pos[i].y);
    anda(i, v.x, v.y, Math.max(500, dist * 6), () => {
      const pose = el(bes[i], '.de-bes-pose');
      pose.animate([{ transform:'rotate(0)' }, { transform:'rotate(-28deg)' }], { duration:600, fill:'forwards', easing:'ease-out' });
      pose.style.transformBox = 'view-box'; pose.style.transformOrigin = '0px -6px';
      toca('clique');
      depois(600, () => neblina(i, v));
    });
  }
  function neblina(i, v){
    const mov = el(s, '#de-neb-mov');
    mov.animate([{ transform:'translateX(0)', opacity:1 }, { transform:`translateX(${v.x - 170}px) translateY(${v.y - 262}px)`, opacity:1, offset:.55 }, { transform:`translateX(${v.x - 120}px) translateY(${v.y - 262}px)`, opacity:.5, offset:.8 }, { transform:'translateX(0)', opacity:1 }], { duration:5200, easing:'ease-in-out' });
    toca('vapor');
    for (let k = 0; k < 26; k++) depois(k * 40, () => c.add({ tipo:'vapor', x0:sorte(0, 260), y0:sorte(250, 296), x1:v.x + sorte(-14, 14), y1:v.y - 22 + sorte(-6, 6), dur:sorte(80, 120), f:sorte(0, 6), r:sorte(3, 6), x:0, y:0 }));
    const gs = [...bes[i].querySelectorAll('.de-g')];
    gs.forEach((g, k) => depois(1500 + k * 350, () => { g.animate([{ transform:'scale(0)' }, { transform:'scale(1.15)' }, { transform:'scale(1)' }], { duration:500, fill:'forwards' }); tom(900 + k * 120, 0, .08, 'sine', .04, 1300 + k * 120); }));
    depois(3300, () => {
      gs.forEach((g, k) => { const par = g.parentNode.getAttribute('transform').match(/-?[\d.]+/g).map(Number); const dx = -24 - par[0], dy = -9 - par[1];
        g.animate([{ transform:'translate(0,0) scale(1)', opacity:1 }, { transform:`translate(${dx * .6}px,${dy * .6 + 2}px) scale(1)`, opacity:1, offset:.6 }, { transform:`translate(${dx}px,${dy}px) scale(.3)`, opacity:0 }], { duration:900, delay:k * 140, fill:'forwards', easing:'ease-in' }); });
    });
    depois(4500, () => {
      toca('glub'); c.brilhos(v.x - 18, v.y - 8, 6, '#BFE8FF'); gotas++;
      api.hud(`<span class="chip">Besouros com água: ${gotas}/3</span>`);
      ocupado = false;
      if (gotas === 1) api.diz('Ele abaixa a cabeça e levanta as costas. A neblina vira gotinhas, e as gotas escorrem até a boca!');
      if (gotas === 2) api.diz('Aqui no deserto do Namibe quase não chove, mas a neblina vem do mar quase toda manhã.');
      if (gotas === 3) { toca('vitoria'); fase = 'viagem'; api.diz('Os besouros beberam a neblina! Agora vamos para outro deserto, do outro lado do mundo.'); depois(5200, comecaChuva); }
    });
  }
  /* ---------- 2. chuva: o saguaro enche de água ---------- */
  function comecaChuva(){
    vaiPara(1);
    depois(3400, () => {
      fase = 'chuva'; const n = el(s, '#de-nuvs'); n.style.opacity = 1; n.style.pointerEvents = '';
      api.hud('<span class="chip">Chuvas: 0/3</span>');
      api.diz('Este é o saguaro, um cacto gigante. Toque nas nuvens para chover nele!');
    });
  }
  const sagIn = el(s, '#de-sag-in'), stA = [...s.querySelectorAll('#deSagA stop')], stB = [...s.querySelectorAll('#deSagB stop')];
  const VERDE = [['#4E5A2A', '#A8B060', '#8A9A4A', '#4A5626'], ['#3E6A2A', '#9AC45A', '#76A848', '#2E5A22'], ['#2E6E32', '#8ED062', '#5CAE4C', '#215A26'], ['#2A7A3A', '#9ADE70', '#4EB050', '#1A5A2A']];
  const VERDE_B = [['#4E5A2A', '#A2AC5C', '#56622C'], ['#3E6A2A', '#94C058', '#3E6A26'], ['#2E6E32', '#86CC60', '#2E6E2E'], ['#2A7A3A', '#90D86C', '#226A2E']];
  stA.concat(stB).forEach(st => st.style.transition = 'stop-color 1.6s');
  let chovendo = false;
  s.querySelectorAll('.de-nuv').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'chuva' || chovendo || g.dataset.feito) return;
    g.dataset.feito = 1; chovendo = true; chuvas++; const x = +g.dataset.x;
    toca('chuva'); c.chover(x - 66, x + 66, 100, SUPB, 70, '#3D8BFF');
    depois(1200, () => { for (let k = 0; k < 14; k++) depois(k * 50, () => c.add({ tipo:'infiltra', x0:x + sorte(-60, 60), y0:SUPB + 2, x1:sorte(180, 620), y1:sorte(460, 476), dur:sorte(60, 90), f:sorte(0, 6) })); });
    depois(2000, () => {
      el(s, '#de-raiz-agua').style.opacity = (.35 + chuvas * .2).toFixed(2);
      sagIn.style.transform = `scaleX(${(1 + chuvas * .09).toFixed(2)})`;
      stA.forEach((st, k) => st.style.stopColor = VERDE[chuvas][k]); stB.forEach((st, k) => st.style.stopColor = VERDE_B[chuvas][k]);
      toca('planta'); c.brilhos(400, 300, 6, '#C9F2A0');
      g.style.transition = 'opacity 1s'; g.style.opacity = .25;
    });
    depois(3000, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) api.diz('As raízes do saguaro são curtinhas e bem espalhadas. Elas bebem a chuva rapidinho!');
      if (chuvas === 2) api.diz('Olha as dobras do cacto se abrindo como uma sanfona. Ele está guardando água lá dentro!');
      if (chuvas === 3) { fase = 'pica'; toca('vitoria'); api.diz('O saguaro ficou gordinho de água! Um saguaro grande guarda centenas de litros para os meses sem chuva.'); depois(3600, picaPau); }
    });
  }));
  function picaPau(){
    el(s, '#de-nuvs').style.opacity = 0;
    const p = el(s, '#de-pica'), vira = el(s, '#de-pica-vira'); p.style.opacity = 1; vira.setAttribute('transform', '');
    tw(1800, (k, e) => p.setAttribute('transform', `translate(${(860 - (860 - 426) * e).toFixed(1)} ${(120 + (262 - 120) * e - Math.sin(k * Math.PI) * 30 + Math.sin(k * 30) * 3).toFixed(1)})`), () => {
      let n = 0; (function bica(){ if (!vivo) return; el(s, '#de-pica-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(-4px)' }, { transform:'translateX(0)' }], { duration:140 }); tom(1400, 0, .04, 'square', .03); if (++n < 8) depois(170, bica); else { const f = el(s, '#de-sag-furo'); f.setAttribute('rx', 6.5); f.setAttribute('ry', 8.5); toca('pop'); api.diz('Um pica-pau fez um buraquinho no saguaro para morar. Lá dentro é fresquinho e úmido!'); depois(5600, comecaOasis); } })();
    });
  }
  /* ---------- 3. oásis: cavar até a água escondida ---------- */
  function comecaOasis(){
    fase = 'viagem'; vaiPara(2);
    depois(3400, () => {
      fase = 'cavar'; api.hud('<span class="chip">Água encontrada: 0/3</span>');
      api.diz('No Saara a areia esconde um segredo. Toque na areia marcada para cavar até achar água!');
    });
  }
  const covas = [...s.querySelectorAll('.de-cova')], prof = [0, 0, 0];
  covas.forEach((g, i) => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'cavar' || prof[i] >= 3) { if (fase !== 'cavar' && prof[i] < 3) { toca('clique'); sopra(COVA[i].x, COVA[i].y - 4, 8); } return; }
    prof[i]++; const v = COVA[i];
    el(g, '.de-marca').style.display = 'none';
    toca('clique'); tom(180, 0, .12, 'triangle', .05, 90);
    for (let k = 0; k < 7; k++) c.add({ tipo:'respingo', x:v.x + sorte(-16, 16), y:v.y + sorte(-3, 3), t:k, cor:'#B87A3A' });
    sopra(v.x, v.y - 6, 10, '#E8B46E');
    const b = el(g, '.de-buraco'); b.setAttribute('rx', 10 + prof[i] * 5); b.setAttribute('ry', 3 + prof[i] * 1.6);
    const poco = el(g, '.de-poco'), fundo = [0, 448, 462, 472][prof[i]];
    poco.setAttribute('y', 430); poco.setAttribute('height', fundo - 430);
    if (prof[i] < 3) { if (achou === 0 && prof[i] === 1) api.diz('Mais fundo! A água está bem lá embaixo.'); return; }
    achou++;
    const ag = el(g, '.de-poco-agua');
    tw(1400, (k, e2) => { ag.setAttribute('y', (472 - 42 * e2).toFixed(1)); ag.setAttribute('height', (42 * e2).toFixed(1)); });
    toca('glub'); c.brilhos(v.x, 472, 6, '#BFE8FF');
    depois(1100, () => {
      const lago = el(g, '.de-lago');
      tw(1300, (k, e2) => { lago.setAttribute('rx', (58 * e2).toFixed(1)); lago.setAttribute('ry', (14 * e2).toFixed(1)); });
      el(g, '.de-lago-brilho').style.transition = 'opacity 1s'; el(g, '.de-lago-brilho').style.opacity = 1;
      toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:v.x + sorte(-20, 20), y:v.y, t:k * 2, cor:'#E6F6FF' });
    });
    depois(2300, () => { s.querySelectorAll('.de-palma')[i].style.display = ''; toca('planta'); c.brilhos(v.x + [-48, -56, -60][i], v.y - 120, 6, '#B8F08A'); });
    api.hud(`<span class="chip">Água encontrada: ${achou}/3</span>`);
    if (achou === 1) depois(1500, () => api.diz('Achou! Debaixo da areia tem água guardada. Onde ela chega perto da superfície, nasce um oásis.'));
    if (achou === 2) depois(1500, () => api.diz('Com água, a tamareira cresce. As tâmaras são docinhas!'));
    if (achou === 3) { fase = 'chegam'; depois(2600, chegamBichos); }
  }));
  function chegamBichos(){
    toca('vitoria'); el(s, '#de-capim').style.opacity = 1; el(s, '#de-gangas').style.opacity = 1;
    api.diz('Virou um oásis! Os bichos do deserto vêm beber.');
    depois(2600, () => { fase = 'beber'; api.hud('<span class="chip">Dromedário bebeu: 0 litros</span>'); api.diz('Toque no dromedário para ele beber bastante água!'); });
  }
  let drX = 728, drOcupado = false;
  const drPesc = el(s, '#de-dr-pesc'), pernas = [...s.querySelectorAll('.de-dr-perna')];
  const PIV = [-40, -74];
  const pescoco = a => drPesc.setAttribute('transform', `rotate(${a.toFixed(1)} ${PIV[0]} ${PIV[1]})`);
  const LITROS = [0, 40, 80, 110];
  el(s, '#de-drome').addEventListener('click', e => {
    if (drOcupado) return;
    if (fase !== 'beber') { drOcupado = true; tw(900, k => pescoco(Math.sin(k * Math.PI) * 14), () => drOcupado = false); toca('pop'); if (fase === 'cavar' || fase === 'viagem') api.diz('O dromedário está com sede. Primeiro, vamos achar água!'); return; }
    drOcupado = true;
    const bebe = () => {
      tw(800, (k, e2) => pescoco(-108 * e2), () => {
        goles++; let n = 0; (function gole(){ if (!vivo) return; toca('glub'); c.add({ tipo:'respingo', x:COVA[2].x + sorte(-6, 6), y:COVA[2].y, t:0, cor:'#E6F6FF' }); if (++n < 3) depois(330, gole); })();
        depois(1100, () => {
          api.hud(`<span class="chip">Dromedário bebeu: ${LITROS[goles]} litros</span>`);
          tw(700, (k, e2) => pescoco(-108 * (1 - e2)), () => {
            drOcupado = false;
            if (goles === 1) api.diz('Glub, glub! O dromedário consegue beber mais de cem litros de uma vez só!');
            if (goles === 2) api.diz('E a corcova não guarda água: guarda gordura, uma reserva de energia para a viagem.');
            if (goles === 3) { fase = 'fim'; drOcupado = true; toca('vitoria'); c.brilhos(400, 300, 12, '#FFE27A'); api.diz('Nos desertos chove muito pouco, e a vida guarda cada gota: na neblina, dentro do cacto e debaixo da areia. A gente também pode guardar cada gota!'); depois(6600, api.fim); }
          });
        });
      });
    };
    if (drX > 712) { const x0 = drX; tw(1400, (k, e2) => { drX = x0 + (708 - x0) * e2; el(s, '#de-drome').setAttribute('transform', `translate(${drX.toFixed(1)} ${SUPC - 4})`); pernas.forEach(p => { const lado = +p.dataset.p % 2 ? 1 : -1; p.setAttribute('transform', `rotate(${(Math.sin(k * 16) * 8 * lado).toFixed(1)} ${p.dataset.x} -62)`); }); }, () => { pernas.forEach(p => p.removeAttribute('transform')); bebe(); }); }
    else bebe();
  });
  /* ---------- toques extras ---------- */
  const FALAS_FECO = ['Minhas orelhas enormes soltam o calor do corpo. Assim eu fico fresquinho no deserto!', 'Eu quase não bebo água: pego quase toda a água de que preciso da comida.', 'De dia eu fico na toca, longe do sol. Saio à noite, quando está fresquinho.'];
  el(s, '#de-feco').addEventListener('click', () => { mexeOrelha(true); toca('pop'); [880, 1180].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'triangle', .05, f * 1.2), i * 120)); api.diz(FALAS_FECO[falaFeco++ % 3]); });
  let lambeu = false;
  el(s, '#de-gecko').addEventListener('click', e => { e.stopPropagation(); if (lambeu) return; lambeu = true; const l = el(s, '#de-lingua'), g = el(s, '#de-gota-olho');
    l.animate([{ opacity:0 }, { opacity:1, offset:.2 }, { opacity:1, offset:.7 }, { opacity:0 }], { duration:900 }); toca('pop');
    depois(450, () => { g.style.transition = 'opacity .3s'; g.style.opacity = 0; });
    depois(3200, () => { g.style.opacity = 1; lambeu = false; });
    api.diz('Este lagartinho do Namibe lambe as gotinhas de neblina que ficam nos próprios olhos!'); });
  el(s, '#de-wel').addEventListener('click', e => { e.stopPropagation(); toca('planta'); c.brilhos(84, 470, 5, '#B8E08A'); api.diz('Esta planta só existe no deserto do Namibe. Ela tem só duas folhas compridas e pode viver mais de mil anos!'); });
  let escOcup = false;
  el(s, '#de-esc').addEventListener('click', e => { e.stopPropagation(); if (escOcup) return; escOcup = true; const ein = el(s, '#de-esc-in');
    ein.animate([{ transform:'translateX(0)' }, { transform:'translateX(-30px)', offset:.3 }, { transform:'translateX(18px)', offset:.55 }, { transform:'translateX(18px)', offset:.85 }, { transform:'translateX(0)' }], { duration:3200, easing:'ease-in-out' }); toca('clique');
    depois(3200, () => escOcup = false);
    api.diz('O escorpião passa o dia escondido debaixo das pedras, longe do sol quente.'); });
  let jerOcup = false;
  el(s, '#de-jer').addEventListener('click', e => { e.stopPropagation(); if (jerOcup) return; jerOcup = true; const j = el(s, '#de-jer-pos');
    tw(1500, k => { const salto = Math.abs(Math.sin(k * Math.PI * 3)) * 26, dx = Math.sin(k * Math.PI) * 40; j.setAttribute('transform', `translate(${dx.toFixed(1)} ${(-salto).toFixed(1)})`); }, () => { j.removeAttribute('transform'); jerOcup = false; });
    [0, 500, 1000].forEach(t => setTimeout(() => somOn && tom(700, 0, .08, 'sine', .05, 1100), t));
    api.diz('O jerboa pula como um canguruzinho! Ele quase não bebe: tira a água das sementes e plantas que come.'); });
  el(s, '#de-mira').addEventListener('click', e => { e.stopPropagation(); toca('ok'); api.diz('Parece um lago lá longe, mas é uma miragem: o ar bem quente entorta a luz do céu.'); });
  el(s, '#de-mira').animate([{ opacity:.55 }, { opacity:1 }, { opacity:.45 }, { opacity:.9 }, { opacity:.55 }], { duration:3200, iterations:Infinity });
  el(s, '#de-gangas').addEventListener('click', e => { e.stopPropagation(); [1500, 1700].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sine', .05, f * .8), i * 160)); api.diz('Este passarinho molha as penas da barriga para levar água aos filhotes no ninho!'); });
  el(s, '#de-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); api.diz(fase === 'neblina' ? 'Está amanhecendo. De madrugada o deserto fica bem frio!' : 'No deserto o sol é forte de dia, e quase não tem nuvens para fazer sombra.'); });
  s.querySelectorAll('.de-areia').forEach(a => a.addEventListener('click', e => { const p = c.ponto(e); sopra(p.x, p.y, 18); tom(300, 0, .3, 'sawtooth', .015, 120); }));
  el(s, '#de-sag').addEventListener('click', () => { if (fase === 'chuva') return; toca('pop'); api.diz('Os espinhos do cacto são folhas bem fininhas. Assim ele perde pouca água, e os espinhos ainda fazem sombra!'); });
  api.hud('<span class="chip">Besouros com água: 0/3</span>');
  api.diz('Oi, eu sou o Feco, um feneco! No deserto quase não chove. Arraste o besouro até o alto da duna para pegar a neblina!');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 11: Grandes Lagos, lagos gigantes ================= */
function jogoLagos(palco, api){
  semente = 83;
  let vivo = true, fase = 'represa', galhos = 0, neves = 0, peixes = 0, sois = 0, ocupado = false, nivel = 362;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const LAGO = 360, HZ = 292, DAM = { x:312, y:318 };
  const NIVEIS = [362, 346, 330, 313, 295, 278];
  const chao = x => x < 150 ? 318 : Math.min(362, 318 + (x - 150) * 44 / 150);
  const GALHOS = [{ x:96, y:246, r:-8 }, { x:200, y:328, r:10 }, { x:262, y:346, r:-4 }, { x:372, y:356, r:12 }, { x:476, y:318, r:-6 }];
  const tween = (ms, fn, fim) => { const t0 = performance.now(); (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); fn(k * k * (3 - 2 * k), k); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  /* ---------- desenhos ---------- */
  const P = v => (+v).toFixed(1), PI = Math.PI;
  /* galhos recursivos (árvores, raízes) */
  const segsDe = (x, y, len, a, w, n, alvo, puxa) => {
    const out = [];
    const go = (x0, y0, len, a, w, n) => {
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len, k = R(-.16, .16) * len;
      const mx = (x0 + x1) / 2 - Math.sin(a) * k, my = (y0 + y1) / 2 + Math.cos(a) * k;
      out.push({ d:`M${P(x0)} ${P(y0)} Q${P(mx)} ${P(my)} ${P(x1)} ${P(y1)}`, w, a, x0, y0, mx, my, x1, y1 });
      if (n <= 0) return;
      const nf = n >= 3 ? 2 : (R(0, 1) < .5 ? 3 : 2);
      for (let i = 0; i < nf; i++) {
        let na = a + (nf === 2 ? (i ? 1 : -1) * R(.26, .52) : (i - 1) * R(.36, .56));
        na += (alvo - na) * puxa;
        go(x1, y1, len * R(.62, .78), na, Math.max(.6, w * .64), n - 1);
      }
    };
    go(x, y, len, a, w, n); return out;
  };
  const pinta = (segs, cor, tinta, borda) => {
    const b = {}; segs.forEach(sg => { const k = (Math.round(sg.w * 2) / 2).toFixed(1); (b[k] = b[k] || []).push(sg.d); });
    let o = '', f = '';
    Object.keys(b).sort((p, q) => q - p).forEach(k => { const d = b[k].join(' '); if (borda) o += `<path d="${d}" stroke="${tinta}" stroke-width="${(+k + Math.min(borda, +k * .8 + .4)).toFixed(1)}"/>`; f += `<path d="${d}" stroke="${cor}" stroke-width="${k}"/>`; });
    return { o:`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${o}</g>`, f:`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${f}</g>` };
  };
  const neveDe = segs => {
    const b = {}; segs.forEach(sg => { if (sg.w < .9 || Math.abs(Math.cos(sg.a)) < .3) return; const wn = Math.min(3.6, Math.max(1.5, sg.w * .62)), k = (Math.round(wn * 2) / 2).toFixed(1), o = sg.w * .42 + .5; (b[k] = b[k] || []).push(`M${P(sg.x0 + (sg.x1 - sg.x0) * .12)} ${P(sg.y0 + (sg.y1 - sg.y0) * .12 - o)} Q${P(sg.mx)} ${P(sg.my - o)} ${P(sg.x1 - (sg.x1 - sg.x0) * .12)} ${P(sg.y1 - (sg.y1 - sg.y0) * .12 - o)}`); });
    let sh = '', wh = ''; Object.keys(b).forEach(k => { const d = b[k].join(' '); sh += `<path d="${d}" stroke="#A9C2E0" stroke-width="${(+k + 1.3).toFixed(1)}" transform="translate(0 .9)"/>`; wh += `<path d="${d}" stroke="#FFFFFF" stroke-width="${k}"/>`; });
    return `<g fill="none" stroke-linecap="round">${sh}${wh}</g>`;
  };
  const arvore = (x, y, h, o) => {
    const top = y - h * o.ht, wt = o.wb * .5;
    let segs = [];
    o.limbs.forEach(([a, f]) => { segs = segs.concat(segsDe(x + Math.cos(a) * wt * .4, top + 4, h * f, a, wt * 1.7, o.nv, -PI / 2, o.puxa ?? .12)); });
    const p = pinta(segs, o.pal[1], o.pal[0], 2.2);
    const corpo = `<path d="M${P(x - o.wb)} ${y + 2} C${P(x - o.wb * .45)} ${y - 3} ${P(x - wt)} ${P(y - h * o.ht * .45)} ${P(x - wt)} ${P(top)} L${P(x + wt)} ${P(top)} C${P(x + wt)} ${P(y - h * o.ht * .45)} ${P(x + o.wb * .45)} ${y - 3} ${P(x + o.wb)} ${y + 2}Z" fill="url(#${o.grad})" stroke="${o.pal[0]}" stroke-width="1.8" stroke-linejoin="round"/>`;
    let luz = ''; segs.forEach(sg => { if (sg.w < 2.4) return; luz += `M${P(sg.x0 - sg.w * .22)} ${P(sg.y0)} Q${P(sg.mx - sg.w * .22)} ${P(sg.my)} ${P(sg.x1 - sg.w * .2)} ${P(sg.y1)} `; });
    const brilho = luz ? `<path d="${luz}" stroke="${o.pal[2]}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/>` : '';
    return { arv:p.o + corpo + p.f + brilho, segs, top };
  };
  /* copa em camadas: [tinta, sombra, base, luz, brilho] */
  const copaRica = (x, y, rx, ry, p, gid) => {
    let o = `<path d="${copa(x, y + ry * .05, rx, ry * .95, 14, .26)}" fill="${p[1]}" stroke="${p[0]}" stroke-width="2.2" stroke-linejoin="round"/>`;
    [[0, .4, .4], [-.5, .26, .44], [.48, .28, .44], [-.56, -.1, .4], [.54, -.08, .4], [0, -.04, .5], [-.24, -.42, .44], [.26, -.4, .42]].forEach(([dx, dy, k]) => { o += `<path d="${copa(x + dx * rx, y + dy * ry, rx * k, ry * k, 8, .32)}" fill="url(#${gid})" stroke="${p[1]}" stroke-width="1" stroke-opacity=".75"/>`; });
    [[-.32, -.56, .2], [-.62, -.24, .13], [.06, -.7, .14], [.36, -.52, .11], [-.1, -.18, .12]].forEach(([dx, dy, k]) => { o += `<path d="${copa(x + dx * rx, y + dy * ry, rx * k, ry * k * .8, 6, .3)}" fill="${p[4]}" opacity=".5"/>`; });
    let d1 = '', d2 = '';
    for (let i = 0; i < 18; i++) { const t = R(0, 6.28), r = Math.sqrt(R(.05, 1)), px = x + Math.cos(t) * rx * .84 * r, py = y + Math.sin(t) * ry * .84 * r, s = R(1.3, 2.4); const d = `M${P(px)} ${P(py - s)} l${P(s * .8)} ${P(s)} l${P(-s * .8)} ${P(s)} l${P(-s * .8)} ${P(-s)}Z`; if (py < y - ry * .1) d1 += d; else d2 += d; }
    o += `<path d="${d1}" fill="${p[4]}" opacity=".85"/><path d="${d2}" fill="${p[1]}" opacity=".8"/>`;
    o += `<path d="M${P(x - rx * .78)} ${P(y - ry * .3)} Q${P(x - rx * .55)} ${P(y - ry * .95)} ${P(x + rx * .05)} ${P(y - ry * .98)}" stroke="${p[4]}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>`;
    return o;
  };
  const copaBetula = (x, y, p, gid) => {
    const C = [[-14, 8, 12], [14, 6, 12], [-8, -12, 12], [10, -14, 11], [0, -28, 10], [0, 0, 13], [-20, -6, 8], [20, -4, 8]];
    let o = C.map(([dx, dy, r]) => `<path d="${copa(x + dx, y + dy + 2, r + 2, r * .9 + 2, 7, .3)}" fill="${p[1]}" stroke="${p[0]}" stroke-width="1.8"/>`).join('');
    o += C.map(([dx, dy, r]) => `<path d="${copa(x + dx, y + dy, r, r * .88, 7, .3)}" fill="url(#${gid})"/>`).join('');
    let d = ''; for (let i = 0; i < 16; i++) { const px = x + R(-24, 24), py = y + R(-34, 16), s = R(1.1, 2); d += `M${P(px)} ${P(py - s)} l${P(s * .8)} ${P(s)} l${P(-s * .8)} ${P(s)} l${P(-s * .8)} ${P(-s)}Z`; }
    o += `<path d="${d}" fill="${p[4]}" opacity=".85"/>`;
    o += `<g stroke="${p[2]}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8">${[[-22, 10], [24, 8], [-4, 14]].map(([dx, dy]) => `<path d="M${x + dx} ${y + dy} q-1 8 1 14"/>`).join('')}</g><g fill="${p[3]}">${[[-22, 10], [24, 8], [-4, 14]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy + 9}" r="1.6"/><circle cx="${x + dx + 1}" cy="${y + dy + 14}" r="1.4"/>`).join('')}</g>`;
    return o;
  };
  const pinheiro = (x, y, h, pal, gid) => {
    let arv = `<ellipse cx="${x}" cy="${y + 1}" rx="${P(h * .26)}" ry="3" fill="#1E140A" opacity=".25"/><path d="M${x - 3.6} ${y + 2} L${x - 2} ${P(y - h * .3)} H${x + 2} L${x + 3.6} ${y + 2}Z" fill="#6A4428" stroke="#2E1C10" stroke-width="1.4"/>`, n = '';
    const T = 5;
    for (let k = 0; k < T; k++) {
      const w = h * (.4 - k * .066), yy = y - h * .12 - k * h * .155, top = yy - h * (.3 - k * .02), tips = k > 2 ? 4 : 5;
      let d = `M${x} ${P(top)} C${P(x - w * .22)} ${P(top + (yy - top) * .45)} ${P(x - w * .66)} ${P(yy - 5)} ${P(x - w)} ${P(yy + 2)}`, tipsN = '';
      for (let j = 1; j <= tips; j++) { const tx = x - w + j * 2 * w / tips, nx = tx - w / tips, ty = yy + (j === tips ? 2 : R(-.5, 2.5)); d += ` Q${P(nx)} ${P(yy - R(3, 5.5))} ${P(tx)} ${P(ty)}`; tipsN += `<ellipse cx="${P(tx - w / tips * .5)}" cy="${P(yy - 2.6)}" rx="${P(w / tips * .42)}" ry="1.8"/>`; }
      d += ` C${P(x + w * .66)} ${P(yy - 5)} ${P(x + w * .22)} ${P(top + (yy - top) * .45)} ${x} ${P(top)}Z`;
      if (k) arv += `<path d="${d}" fill="${pal[0]}" opacity=".35" transform="translate(0 4)"/>`;
      arv += `<path d="${d}" fill="url(#${gid})" stroke="${pal[0]}" stroke-width="1.5" stroke-linejoin="round"/>`;
      arv += `<path d="M${P(x - 1)} ${P(top + 3)} C${P(x - w * .24)} ${P(top + (yy - top) * .48)} ${P(x - w * .6)} ${P(yy - 6)} ${P(x - w * .9)} ${P(yy - 1)}" stroke="${pal[3]}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75"/>`;
      let ag = ''; for (let j = 0; j < 5; j++) { const ax = x - w * R(.15, .8), ay = yy - R(3, (yy - top) * .5); ag += `M${P(ax)} ${P(ay)} l-3 3 M${P(ax + 2)} ${P(ay)} l2 3 `; }
      arv += `<path d="${ag}" stroke="${pal[3]}" stroke-width="1" opacity=".55" fill="none" stroke-linecap="round"/>`;
      const sx = w * .6, ys = top + (yy - top) * .62;
      n += `<path d="M${x} ${P(top - 1.5)} C${P(x - w * .2)} ${P(top + (yy - top) * .3)} ${P(x - w * .42)} ${P(ys - 5)} ${P(x - sx)} ${P(ys)} Q${P(x - sx * .7)} ${P(ys + 4)} ${P(x - sx * .45)} ${P(ys + 1)} Q${P(x - sx * .25)} ${P(ys + 5)} ${x} ${P(ys + 1)} Q${P(x + sx * .3)} ${P(ys + 4.5)} ${P(x + sx * .5)} ${P(ys + .5)} Q${P(x + sx * .75)} ${P(ys + 3.5)} ${P(x + sx)} ${P(ys)} C${P(x + w * .42)} ${P(ys - 5)} ${P(x + w * .2)} ${P(top + (yy - top) * .3)} ${x} ${P(top - 1.5)}Z" fill="url(#lgNeve)" stroke="#AFC8E6" stroke-width="1"/><g fill="#fff" stroke="#B8D0EA" stroke-width=".6">${tipsN}</g>`;
    }
    return { arv, neve:n };
  };
  const tufo = (x, y, s, c1, c2) => `<path d="M${P(x - 3 * s)} ${y} q${P(-2 * s)} ${P(-5 * s)} ${P(-4 * s)} ${P(-8 * s)} M${P(x - 1 * s)} ${y} q${P(-1 * s)} ${P(-7 * s)} ${P(1 * s)} ${P(-11 * s)} M${P(x + 1 * s)} ${y} q${P(2 * s)} ${P(-6 * s)} ${P(5 * s)} ${P(-9 * s)}" stroke="${c1}" stroke-width="${P(1.8 * s)}" fill="none" stroke-linecap="round"/><path d="M${P(x)} ${y} q${P(.5 * s)} ${P(-5 * s)} ${P(-1.5 * s)} ${P(-9 * s)} M${P(x + 2.4 * s)} ${y} q${P(1 * s)} ${P(-4 * s)} ${P(3.5 * s)} ${P(-6 * s)}" stroke="${c2}" stroke-width="${P(1.3 * s)}" fill="none" stroke-linecap="round"/>`;
  const graveto = (x1, y1, x2, y2, w, cor, tinta, ponta) => {
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / PI, L = `M${P(x1)} ${P(y1)} L${P(x2)} ${P(y2)}`;
    return `<path d="${L}" stroke="${tinta}" stroke-width="${P(w + 2.4)}" stroke-linecap="round"/><path d="${L}" stroke="${cor}" stroke-width="${P(w)}" stroke-linecap="round"/><path d="M${P(x1 + (x2 - x1) * .12)} ${P(y1 + (y2 - y1) * .12 - w * .24)} L${P(x2 - (x2 - x1) * .18)} ${P(y2 - (y2 - y1) * .18 - w * .24)}" stroke="#F0D2A0" stroke-width="${P(Math.max(.7, w * .22))}" stroke-linecap="round" opacity=".6"/>` + (ponta && w > 2.6 ? `<g transform="translate(${P(x2)} ${P(y2)}) rotate(${P(ang)})"><ellipse rx="${P(w * .3)}" ry="${P(w * .52)}" fill="#E8C896" stroke="${tinta}" stroke-width=".9"/><ellipse rx="${P(w * .14)}" ry="${P(w * .26)}" fill="none" stroke="#B8905A" stroke-width=".6"/></g>` : '');
  };
  const FOLHA = 'M0 0 L-1.5 -6 L-9 -4 L-8 -8 L-15 -12 L-11 -13 L-13 -19 L-7 -17 L-6 -21 L-2 -17 L0 -27 L2 -17 L6 -21 L7 -17 L13 -19 L11 -13 L15 -12 L8 -8 L9 -4 L1.5 -6Z';
  const FOLHA_E = 'M0 -27 L-2 -17 L-6 -21 L-7 -17 L-13 -19 L-11 -13 L-15 -12 L-8 -8 L-9 -4 L-1.5 -6 L0 0Z';
  const folha = (x, y, a, s, c, e) => `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(a)}) scale(${s})"><path d="${FOLHA}" fill="${c}" stroke="${e}" stroke-width="${P(1.3 / s)}" stroke-linejoin="round"/><path d="${FOLHA_E}" fill="#fff" opacity=".2"/><path d="M0 -1 V-21 M0 -8 L-10 -14 M0 -8 L10 -14 M0 -4 L-7 -5 M0 -4 L7 -5" stroke="${e}" stroke-width="${P(.9 / s)}" fill="none" opacity=".55"/></g>`;
  const pato = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="2" cy="1.5" rx="20" ry="3.4" fill="#1E4E8A" opacity=".28"/><path d="M-12 3 C-4 7 8 7 14 3" stroke="#5A4A3A" stroke-width="3" fill="none" opacity=".18" stroke-linecap="round"/><path d="M14 -9 c4 -4 7 -2 4 1.6" stroke="#22222A" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-14 -4 C-14 -14 4 -16 14 -10 C18 -6 18 -2 14 0 H-10 C-14 0 -15 -2 -14 -4Z" fill="url(#lgPatoC)" stroke="#4A3A2A" stroke-width="1.4"/><path d="M-14 -4 C-15 -9 -12 -12 -8 -12 C-6 -8 -7 -3 -10 0 C-13 0 -14 -2 -14 -4Z" fill="#8E4A28" opacity=".9"/><path d="M-4 -9 C2 -14 12 -13 16 -8 C10 -5 2 -5 -4 -9Z" fill="#B8A898" stroke="#4A3A2A" stroke-width="1"/><path d="M3 -8.6 L11 -9.2 L12.4 -7.2 L4 -6.8Z" fill="#3E66C8" stroke="#fff" stroke-width=".7"/><path d="M14 -10 C18 -6 22 -8 22 -12 C18 -12 16 -12 14 -10Z" fill="#2A2A30"/><path d="M-12 -6 C-14 -14 -14 -20 -10 -24" stroke="#3A2A1A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-12 -6 C-14 -14 -14 -20 -10 -24" stroke="#1E7A4A" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M-14.8 -10 h5.4" stroke="#fff" stroke-width="1.8"/><circle cx="-11" cy="-24" r="5" fill="url(#lgPatoV)" stroke="#0E3A22" stroke-width="1.2"/><path d="M-14 -26 q2 -2.6 5 -2" stroke="#9AF0C0" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="-12.6" cy="-25" r="1.3" fill="#12121A"/><circle cx="-13" cy="-25.4" r=".5" fill="#fff"/><path d="M-15 -23 L-22 -22 L-15 -20Z" fill="#F2C43A" stroke="#8A6A08" stroke-width=".9" stroke-linejoin="round"/></g>`;
  const perca = `<path d="M-30 0 L-42 -9 L-39 0 L-42 9Z" fill="#E8A040" stroke="#6A4A10" stroke-width="1.4" stroke-linejoin="round" opacity=".92"/><path d="M-12 -9 L-8 -18 L-4 -10 L0 -18 L4 -10 L8 -17 L10 -9Z" fill="#B8A040" stroke="#5A4A10" stroke-width="1.2" stroke-linejoin="round" opacity=".9"/><path d="M-30 0 C-24 -12 -2 -14 16 -10 C26 -8 32 -4 34 0 C32 6 24 10 14 11 C-4 13 -24 10 -30 0Z" fill="url(#lgPercaG)" stroke="#4E5214" stroke-width="1.8"/><g stroke="#3E4A14" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M-20 -6 v10 M-11 -9 v14 M-2 -10 v16 M7 -10 v15 M15 -8 v12"/></g><path d="M-2 10 L2 18 L6 10Z M12 9 L14 15 L18 9Z" fill="#F06A2A" stroke="#8A2A0E" stroke-width="1"/><path d="M10 -2 C14 2 14 6 10 8" stroke="#E07A2A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M20 -8 C17 -3 17 3 20 8" stroke="#4E5214" stroke-width="1.2" fill="none" opacity=".6"/><circle cx="24" cy="-3" r="3.6" fill="#FFF6C8" stroke="#4E5214" stroke-width="1"/><circle cx="24.8" cy="-2.8" r="2" fill="#12121A"/><circle cx="25.6" cy="-3.8" r=".7" fill="#fff"/><path d="M30 3 q3 1 4 -1" stroke="#4E5214" stroke-width="1.2" fill="none"/><path d="M-18 -7 C-6 -12 6 -12 16 -9" stroke="#F8F4C0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>`;
  const esturjao = `<path d="M-56 0 C-62 -10 -70 -18 -76 -20 C-72 -12 -70 -4 -72 4 C-68 2 -62 2 -56 4Z" fill="#6E7078" stroke="#33353C" stroke-width="1.6" stroke-linejoin="round"/><path d="M-58 2 C-44 -10 0 -14 30 -10 C44 -8 56 -6 64 -2 C60 4 48 8 30 9 C0 12 -40 10 -58 2Z" fill="url(#lgEstG)" stroke="#33353C" stroke-width="2"/><path d="M-50 4 C-20 10 20 10 50 4" fill="none" stroke="#E2E4EA" stroke-width="3" stroke-linecap="round" opacity=".7"/><g fill="#D0D2D8" stroke="#4A4C54" stroke-width=".9">${[-44, -32, -20, -8, 4, 16, 28].map(x => `<path d="M${x} -9 l4 -4 l4 4Z"/>`).join('')}${[-40, -26, -12, 2, 16, 30].map(x => `<path d="M${x} -1 l3 -3 l3 3 l-3 3Z"/>`).join('')}</g><path d="M-6 -11 L2 -20 L10 -12Z" fill="#6E7078" stroke="#33353C" stroke-width="1.2"/><path d="M-10 9 L-4 16 L2 9Z M20 8 L26 14 L30 7Z" fill="#7A7C84" stroke="#33353C" stroke-width="1.2"/><path d="M48 4 l-2 7 M52 3 l0 7 M56 2 l2 6" stroke="#5A5C64" stroke-width="1.2" stroke-linecap="round"/><circle cx="46" cy="-4" r="3" fill="#FFF6E0" stroke="#33353C" stroke-width="1"/><circle cx="46.6" cy="-3.8" r="1.7" fill="#12121A"/><circle cx="47.2" cy="-4.6" r=".6" fill="#fff"/><path d="M-40 -6 C-20 -12 10 -13 34 -10" stroke="#D2D6E0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const galhoDes = i => {
    const [cor, tinta] = [['#B07A44', '#4A2810'], ['#9A6234', '#3E220C'], ['#C08A50', '#4E3014'], ['#A86E3C', '#44260E'], ['#B88450', '#4A2E12']][i];
    const fol = [['#E8502E', '#7A2010'], ['#F29A2E', '#8A4A0E'], ['#F2C83A', '#8A6A0E'], ['#D23A2A', '#6A1410'], ['#E87A2A', '#7A3A10']][i];
    return `<path d="M-27 -2.6 C-10 -4.6 8 -5 24 -3.2 L24.6 .2 C8 .6 -10 3.4 -27 5Z" fill="${cor}" stroke="${tinta}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-22 -1.6 C-8 -3 6 -3.4 20 -2.4" stroke="#F0D2A0" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/><path d="M-16 2.2 l5 -.4 M-2 1 l6 -.4 M10 .2 l5 -.2" stroke="${tinta}" stroke-width=".9" opacity=".6"/><ellipse cx="-27" cy="1.2" rx="2.2" ry="3.9" fill="#E8C896" stroke="${tinta}" stroke-width="1.1"/><path d="M-27 -.6 v3.4" stroke="#B8905A" stroke-width=".7"/><path d="M-6 -3.4 Q-10 -9 -15 -13 M8 -3.8 Q12 -9 17 -13 M18 -3 Q22 -6 27 -8" stroke="${tinta}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-6 -3.4 Q-10 -9 -15 -13 M8 -3.8 Q12 -9 17 -13 M18 -3 Q22 -6 27 -8" stroke="${cor}" stroke-width="1.8" fill="none" stroke-linecap="round"/>${folha(-15, -12, -30, .5, fol[0], fol[1])}${folha(17, -12, 25, .46, fol[0], fol[1])}${folha(27, -8, 70, .38, ['#F2C83A', '#E8502E', '#D23A2A', '#F29A2E', '#F2B83A'][i], fol[1])}`;
  };
  /* represa do castor: monte bagunçado de galhos, lama e folhas */
  const CORG = [['#B07A44', '#4A2810'], ['#8E5A30', '#3A200C'], ['#C49058', '#50321A'], ['#6E4A2E', '#2E1C0E'], ['#A8784A', '#46280E'], ['#7A5A3A', '#33200E']];
  const camada = (k) => {
    const x = 316 - k * 3, y = 354 - k * 17.6, w = 44 - k * 5;
    const vara = (atras) => { const cx = x + R(-w, w) * .86, cy = y + R(-3, 9), a = R(-42, 42) * PI / 180 + (R(0, 1) < .18 ? PI / 2 * (R(0, 1) < .5 ? .7 : -.7) : 0), L = R(.45, .85) * w + 10, wd = R(2.2, atras ? 5 : 7), c = CORG[Math.floor(R(0, 6))]; const dx = Math.cos(a) * L / 2, dy = Math.sin(a) * L / 2; return graveto(cx - dx, cy - dy, cx + dx, cy + dy, wd, c[0], c[1], R(0, 1) < .6); };
    let o = '';
    for (let i = 0; i < 3; i++) o += vara(true);
    o += `<path d="M${P(x - w - 5)} ${P(y + 13)} Q${P(x - w - 6)} ${P(y + 2)} ${P(x - w + 1)} ${P(y - 7)} Q${P(x)} ${P(y - 13)} ${P(x + w - 1)} ${P(y - 7)} Q${P(x + w + 7)} ${P(y + 2)} ${P(x + w + 4)} ${P(y + 13)} Q${P(x)} ${P(y + 18)} ${P(x - w - 5)} ${P(y + 13)}Z" fill="url(#lgLama)"/>`;
    o += `<g fill="#3A2414" opacity=".35">${Array.from({ length:5 }, () => `<ellipse cx="${P(x + R(-w, w) * .8)}" cy="${P(y + R(-6, 6))}" rx="${P(R(3, 7))}" ry="${P(R(1.6, 3))}"/>`).join('')}</g>`;
    const nv = 12 - Math.floor(k / 2);
    for (let i = 0; i < nv; i++) o += vara(false);
    o += `<g fill="#5A3A20" stroke="#2E1C0E" stroke-width=".8">${Array.from({ length:4 }, () => { const mx = x + R(-w, w) * .7, my = y + R(-8, 4); return `<path d="M${P(mx - 5)} ${P(my + 2)} q2 -5 5 -4 q4 -1 5 4 q-5 2 -10 0Z"/>`; }).join('')}</g>`;
    o += `<g fill="#C8A070" opacity=".6">${Array.from({ length:3 }, () => `<ellipse cx="${P(x + R(-w, w) * .7)}" cy="${P(y + R(-8, 2))}" rx="1.8" ry=".8"/>`).join('')}</g>`;
    o += Array.from({ length:2 }, (_, j) => { const c = [['#E8502E', '#7A2010'], ['#F2C83A', '#8A6A0E'], ['#F29A2E', '#8A4A0E'], ['#D23A2A', '#6A1410']][(k + j) % 4]; return folha(x + R(-w, w) * .8, y + R(-8, 2), R(-80, 80), .32, c[0], c[1]); }).join('');
    if (k < 3) o += `<g class="lg-filete" style="transition:opacity 1.4s"><path d="M${P(x + w * .5)} ${P(y - 3)} C${P(x + w * .62)} ${P(y)} ${P(x + w * .7)} ${P(y + 3)} ${P(x + w * .76)} ${P(y + 9)}" stroke="#7EC4EC" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"/><path d="M${P(x + w * .5)} ${P(y - 3)} C${P(x + w * .62)} ${P(y)} ${P(x + w * .7)} ${P(y + 3)} ${P(x + w * .76)} ${P(y + 9)}" stroke="#F2FAFF" stroke-width=".7" fill="none" stroke-linecap="round"/><ellipse cx="${P(x + w * .77)}" cy="${P(y + 11)}" rx="1" ry="1.5" fill="#CFEFFF" stroke="#4A9AD8" stroke-width=".4"/></g>`;
    return `<g class="lg-dique" data-k="${k}" style="display:none"><g class="cresce">${o}</g></g>`;
  };
  /* ---------- árvores perto (atrás da lagoa) ---------- */
  const ARV = [
    { t:'b', x:30, y:250, rx:44, ry:38, h:96, o:['#5A0E08', '#8E1A10', '#CC3420', '#F2643C', '#FFB48C'], v:['#1E4A1E', '#2E6A2A', '#4E9A3A', '#7CC456', '#C8F09A'] },
    { t:'bt', x:78, y:252, h:84, o:['#6A4A08', '#A0700E', '#E2AE26', '#F6D454', '#FFF2B0'], v:['#3A5A14', '#5A8A22', '#86B83A', '#B4DA5A', '#EAFAB0'] },
    { t:'p', x:122, y:252, h:96, pal:0 },
    { t:'b', x:194, y:246, rx:40, ry:34, h:90, o:['#5E2A06', '#9A4208', '#E2741C', '#F7A040', '#FFD9A0'], v:['#1A4A38', '#2A6A52', '#44946E', '#72BE8E', '#C4EED0'] },
    { t:'b', x:262, y:248, rx:32, ry:28, h:74, o:['#6A4A08', '#A86A0C', '#EBA82A', '#F8CC50', '#FFF0B4'], v:['#245024', '#3A7A3A', '#62B04A', '#94D86A', '#DDF8B0'] },
    { t:'p', x:300, y:250, h:84, pal:1 },
    { t:'b', x:350, y:252, rx:28, ry:24, h:62, o:['#3E0A14', '#6E1426', '#B02A3A', '#D8505A', '#FFA0A4'], v:['#2E5A1A', '#46802A', '#6EAE3E', '#9AD460', '#D8F6A8'] }
  ];
  const PINPAL = [['#0E2E26', '#1A4A3C', '#2E6A56', '#5EA486'], ['#122C38', '#1E4A56', '#2E6A72', '#62A2A4']];
  const gradRad = (id, p) => `<radialGradient id="${id}" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="${p[3]}"/><stop offset=".5" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[1]}"/></radialGradient>`;
  let gradArv = PINPAL.map((p, i) => `<linearGradient id="lgPin${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p[3]}"/><stop offset=".42" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>`).join('');
  let troncos = '', outono = '', prima = '', neveArv = '', pinhos = '', sombrasArv = '';
  ARV.forEach((a, i) => {
    if (a.t === 'p') { const p = pinheiro(a.x, a.y, a.h, PINPAL[a.pal], `lgPin${a.pal}`); pinhos += p.arv; neveArv += p.neve; return; }
    gradArv += gradRad(`lgCo${i}`, a.o) + gradRad(`lgCv${i}`, a.v);
    sombrasArv += `<ellipse cx="${a.x + 4}" cy="${a.y + 1}" rx="${a.t === 'bt' ? 14 : a.rx * .55}" ry="3.4" fill="#2A1A0A" opacity=".22"/>`;
    if (a.t === 'bt') {
      const t = arvore(a.x, a.y, a.h, { wb:4.4, ht:.66, nv:3, puxa:.06, grad:'lgBet', pal:['#2E2A2A', '#5E5450', '#9A908A'], limbs:[[-PI / 2 - .55, .2], [-PI / 2 + .5, .2], [-PI / 2 - .04, .22]] });
      const tt = t.top;
      troncos += t.arv + `<g stroke="#2A2628" stroke-linecap="round">${[[.12, 3], [.24, 2], [.33, 3.4], [.45, 2.2], [.55, 3], [.64, 2]].map(([f, L], j) => `<path d="M${P(a.x - (j % 2 ? 0 : 2.4))} ${P(a.y - (a.y - tt) * f / .66)} h${L}" stroke-width="${j % 3 ? 1.2 : 1.8}"/>`).join('')}</g><path d="M${a.x - 2.4} ${P(tt + 10)} l2.4 2.6 l2.4 -2.6" stroke="#1E1A1C" stroke-width="1.6" fill="none"/><path d="M${a.x - 1.2} ${a.y - 4} V${P(tt + 4)}" stroke="#fff" stroke-width="1.2" opacity=".7"/>`;
      neveArv += neveDe(t.segs);
      outono += copaBetula(a.x, a.y - a.h * .9, a.o, `lgCo${i}`);
      prima += copaBetula(a.x, a.y - a.h * .9, a.v, `lgCv${i}`);
      return;
    }
    const t = arvore(a.x, a.y, a.h, { wb:a.h * .07, ht:.42, nv:4, grad:'lgCasca', pal:['#2E1C10', '#6A4630', '#A07A58'], limbs:[[-PI / 2 - .62, .27], [-PI / 2 + .58, .27], [-PI / 2 + .02, .24]] });
    troncos += t.arv;
    neveArv += neveDe(t.segs) + `<ellipse cx="${a.x}" cy="${P(t.top + 2)}" rx="${P(a.h * .05)}" ry="1.8" fill="#fff"/>`;
    outono += `<g class="lg-bordo toque" data-x="${a.x}" data-y="${a.y - a.h}">${copaRica(a.x, a.y - a.h, a.rx, a.ry, a.o, `lgCo${i}`)}</g>`;
    prima += copaRica(a.x, a.y - a.h, a.rx, a.ry, a.v, `lgCv${i}`);
  });
  /* folhas caídas no chão (outono) */
  const folhasChao = Array.from({ length:22 }, () => { const x = R(4, 330), y = R(244, 254) + (x > 300 ? 4 : 0); const c = [['#E8502E', '#7A2010'], ['#F2C83A', '#8A6A0E'], ['#F29A2E', '#8A4A0E'], ['#C8321E', '#5A0E08']][Math.floor(R(0, 4))]; return folha(x, y, R(-90, 90), R(.16, .24), c[0], c[1]); }).join('');
  /* árvores do meio, mais apagadas */
  let meioO = '', meioP = '', meioPin = '', meioG = '';
  const MEIO = [[40, 210], [92, 204], [160, 208], [236, 214], [310, 222], [380, 236]];
  const MO = [['#E8A27A', '#C8805E', '#F8CDAE'], ['#E6C27A', '#C4A05E', '#F8E2AA'], ['#E89A6A', '#C4784E', '#F8C8A0'], ['#E8BA72', '#C49654', '#F8DEA6'], ['#DC8E80', '#B86A60', '#F4BCB0'], ['#E6C27A', '#C4A05E', '#F8E2AA']];
  const MV = [['#A8D88A', '#84B66C', '#D4F2B8'], ['#B8E09A', '#92BE78', '#E0F6C2'], ['#98CC7A', '#76AA5C', '#C8EAA8']];
  MEIO.forEach(([x, y], i) => {
    const sg = segsDe(x, y + 34, 14, -PI / 2, 2.6, 3, -PI / 2, .08);
    meioG += pinta(sg, '#9C94A6', '#9C94A6', 0).f;
    const cr = (c) => `<path d="${copa(x, y, 26, 18, 9, .3)}" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.2"/><path d="${copa(x + 4, y + 7, 19, 8, 7, .3)}" fill="${c[1]}" opacity=".55"/><path d="${copa(x - 7, y - 6, 14, 8, 7, .3)}" fill="${c[2]}" opacity=".8"/>`;
    meioO += cr(MO[i]); meioP += cr(MV[i % 3]);
  });
  [[66, 214, 40], [128, 212, 44], [200, 218, 40], [272, 222, 42], [346, 232, 40], [404, 246, 34]].forEach(([x, y, h]) => { for (let k = 0; k < 3; k++) { const w = h * (.3 - k * .07), yb = y - k * h * .26, yt = yb - h * .42; meioPin += `<path d="M${x} ${P(yt)} L${P(x - w)} ${P(yb)} H${P(x + w)}Z" fill="#6E9A98" stroke="#5A8684" stroke-width=".8" stroke-linejoin="round"/><path d="M${x} ${P(yt)} L${P(x + w)} ${P(yb)} H${x}Z" fill="#5A8684" opacity=".6"/>`; } });
  /* floresta distante na outra margem */
  const floresta = (x0, x1, yb, hmin, hmax, cor, cor2, pula) => { let o = '', x = x0; while (x < x1) { const h = R(hmin, hmax), w = h * .32; if (!pula || !pula(x)) o += `<path d="M${P(x)} ${P(yb(x) - h)} L${P(x - w)} ${P(yb(x) + 2)} H${P(x + w)}Z" fill="${cor}"/><path d="M${P(x)} ${P(yb(x) - h)} L${P(x + w)} ${P(yb(x) + 2)} H${P(x)}Z" fill="${cor2}"/>`; x += R(5, 11); } return o; };
  const pinMeio = floresta(470, 800, x => 262 - Math.sin(x / 60) * 4, 7, 13, '#93A8C8', '#8AA0C2');
  const pinLonge = floresta(360, 800, x => 282 - Math.sin(x / 47) * 3, 9, 20, '#6C88AC', '#5E7AA0', x => x > 684 && x < 788);
  const pinMorro = floresta(0, 420, x => (x < 200 ? 176 - Math.sin(x / 200 * PI) * 16 : 176 + (x - 200) * .13 - Math.sin((x - 200) / 220 * PI) * 10) + 6, 6, 12, '#A8B6D2', '#9EADCB');
  const neveChao = `<path d="M-4 255 C10 246 24 248 36 247 C48 244 60 248 72 246 C86 245 98 247 108 254 C104 257 96 255 88 256 C60 257 30 257 -4 258Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M366 364 C372 358 380 358 388 357 C396 356 404 357 410 362 C396 366 380 366 366 366Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M6 252 C30 250 60 251 90 250" stroke="#C8DAEE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  const pedra = (x, y, r, g) => `<ellipse cx="${P(x + r * .15)}" cy="${P(y + r * .55)}" rx="${P(r * 1.05)}" ry="${P(r * .3)}" fill="#1E120A" opacity=".35"/><path d="${copa(x, y, r, r * .7, 7, .12)}" fill="url(#${g})" stroke="#2A1E18" stroke-width="1.3"/><path d="M${P(x - r * .55)} ${P(y - r * .25)} q${P(r * .35)} ${P(-r * .35)} ${P(r * .8)} ${P(-r * .2)}" stroke="#F2EADC" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  /* superfície da margem de terra (para capim e raízes) */
  const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const supY = x => x < 100 ? 252 : x < 150 ? 252 + (x - 100) * 66 / 50 : x < 300 ? 318 + (x - 150) * 44 / 150 : 362;
  const dentro = (x, y, m) => y > supY(x) + m && (y < 360 || x < 406 + (y - 360) * .457 - m) && x > m * .5;
  let capim = '';
  for (let x = 2; x < 106; x += R(5, 9)) capim += tufo(x, 253, R(.7, 1.1), '#6A8A2E', '#9AB84A');
  for (let t = 0; t < .3; t += .07) capim += tufo(bz(100, 116, 126, 150, t), bz(252, 256, 304, 318, t) + 1, .7, '#6A8A2E', '#9AB84A');
  for (let x = 336; x < 404; x += R(6, 10)) capim += tufo(x, 362, R(.6, .9), '#5E8A2E', '#8AB84A');
  let raizes = '';
  [[22, 254, 1], [36, 254, .8], [74, 254, .7], [86, 254, .6]].forEach(([x, y, s]) => { const sg = segsDe(x, y, 26 * s, PI / 2 + R(-.3, .3), 4.2 * s, 4, PI / 2, .1); const p = pinta(sg, '#6A4428', '#2A180C', 1.6); raizes += p.o + p.f; });
  let raizinhas = ''; for (let x = 4; x < 104; x += 3) raizinhas += `M${x} 255 q${P(R(-2, 2))} ${P(R(4, 7))} ${P(R(-3, 3))} ${P(R(7, 13))} `;
  for (let x = 330; x < 404; x += 3) raizinhas += `M${x} 364 q${P(R(-2, 2))} ${P(R(3, 6))} ${P(R(-3, 3))} ${P(R(6, 11))} `;
  let pedras = '', n = 0, tent = 0;
  while (n < 16 && tent < 400) { tent++; const x = R(6, 440), y = R(300, 442), r = R(4.5, 11); if (!dentro(x, y, r + 6)) continue; if (Math.hypot((x - 72) / 44, (y - 346) / 26) < 1 || (x < 70 && y < 340 && Math.abs((x - 18) - (y - 252) * .5) < 16) || Math.hypot((x - 250) / 34, (y - 370) / 20) < 1 || (x > 140 && x < 300 && y < supY(x) + 26)) continue; pedras += pedra(x, y, r, ['lgPedraC', 'lgPedraQ'][n % 2]); n++; }
  let pedrinhas = ''; for (let i = 0; i < 70; i++) { const x = R(0, 470), y = R(414, 452); if (!dentro(x, y, 2)) continue; const r = R(1, 2.8); pedrinhas += `<circle cx="${P(x)}" cy="${P(y)}" r="${P(r)}" fill="${['#8A8496', '#9A8A78', '#6E6878', '#B0A08A'][i % 4]}" stroke="#3A2E24" stroke-width=".6"/>`; }
  let manchas = ''; for (let i = 0; i < 22; i++) { const x = R(0, 460), y = R(300, 410); if (!dentro(x, y, 4)) continue; manchas += `<ellipse cx="${P(x)}" cy="${P(y)}" rx="${P(R(6, 16))}" ry="${P(R(2, 5))}" fill="${i % 3 ? '#A07448' : '#4A2E18'}" opacity="${i % 3 ? .3 : .35}"/>`; }
  /* rocha-mãe em estratos */
  let rocha = ''; const CR = ['#857F92', '#6E6880', '#958FA2', '#625C72', '#7A748A'];
  for (let j = 0; j < 5; j++) { const y0 = 450 + j * 11; let d = `M-4 ${P(y0 + R(-2, 2))}`; for (let x = 40; x <= 520; x += 40) d += ` Q${P(x - 20)} ${P(y0 + R(-3, 3) + x * .012)} ${x} ${P(y0 + R(-2, 2) + x * .015)}`; rocha += `<path d="${d} V510 H-4Z" fill="${CR[j]}" stroke="#3E384A" stroke-width="1.2"/><path d="${d}" stroke="#B4AEC0" stroke-width="1.3" fill="none" opacity=".55" transform="translate(0 1.6)"/>`; let jt = ''; for (let q = 0; q < 6; q++) { const jx = R(0, 470); jt += `M${P(jx)} ${P(y0 + 3 + jx * .013)} l${P(R(-2, 2))} ${P(R(6, 10))} `; } rocha += `<path d="${jt}" stroke="#3E384A" stroke-width="1.3" fill="none" opacity=".75"/>`; }
  rocha += Array.from({ length:9 }, () => { const x = R(10, 460), y = 449 + x * .012; return `<path d="M${P(x - 6)} ${P(y + 2)} l3 -5 l7 -1 l3 5 l-4 3Z" fill="#9A94A8" stroke="#3E384A" stroke-width="1"/>`; }).join('');
  /* lago grande: ondinhas */
  const ondas = Array.from({ length:26 }, (_, i) => { const x = R(400, 790), y = R(298, 356), s = (y - 286) / 70; return `<path d="M${P(x)} ${P(y)} q${P(4 + s * 8)} ${P(-1.6 - s)} ${P(9 + s * 16)} 0" stroke="${i % 3 ? '#E6F6FF' : '#2C78C0'}" stroke-width="${P(.9 + s * 1.2)}" opacity="${i % 3 ? .8 : .45}"/>`; }).join('');
  /* reflexo das árvores na lagoa do castor */
  const reflexo = (cores) => { let o = ''; [[122, 0], [194, 1], [262, 2], [300, 3]].forEach(([x, ci]) => { for (let r = 0; r < 6; r++) { const w = (ci === 0 || ci === 3 ? 10 - r * 1.4 : 30 - r * 4) * R(.8, 1.1), y = 276 + r * 3.2, dx = R(-4, 4); o += `<path d="M${P(x - w / 2 + dx)} ${P(y)} h${P(w)}" stroke="${cores[ci]}" stroke-width="2.2" stroke-linecap="round"/>`; } }); return o; };
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Grandes Lagos com castor construindo represa, lagoa com brejo, alce, mobelha, farol e o lago visto por dentro com peixes">
    <defs>
      <linearGradient id="lgCeuO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A9EE2"/><stop offset=".45" stop-color="#9ED0F2"/><stop offset=".72" stop-color="#D6ECF8"/><stop offset="1" stop-color="#FFE0B8"/></linearGradient>
      <linearGradient id="lgCeuI" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C92BE"/><stop offset=".4" stop-color="#AEBCDA"/><stop offset=".68" stop-color="#D8DCEC"/><stop offset=".86" stop-color="#EEE2EA"/><stop offset="1" stop-color="#F8EEE8"/></linearGradient>
      <linearGradient id="lgCeuP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#48AEF2"/><stop offset=".7" stop-color="#BDE6FB"/><stop offset="1" stop-color="#EEFAF0"/></linearGradient>
      <radialGradient id="lgHalo" cx="612" cy="74" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF4D0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4D0" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F6FC" stop-opacity="0"/><stop offset="1" stop-color="#F2F6FC" stop-opacity=".7"/></linearGradient>
      <linearGradient id="lgSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8E2F4"/><stop offset=".14" stop-color="#8EC6EC"/><stop offset=".55" stop-color="#4C9EDC"/><stop offset="1" stop-color="#2A72C0"/></linearGradient>
      <linearGradient id="lgRefMorro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E7AA0" stop-opacity=".55"/><stop offset="1" stop-color="#5E7AA0" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA6DE"/><stop offset=".3" stop-color="#2A7CC4"/><stop offset=".7" stop-color="#14498E"/><stop offset="1" stop-color="#0A2C62"/></linearGradient>
      <linearGradient id="lgLagoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC6E6"/><stop offset=".12" stop-color="#4E9ED0"/><stop offset=".5" stop-color="#2E78AE"/><stop offset="1" stop-color="#1A4E80"/></linearGradient>
      <linearGradient id="lgBrilhoAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset=".3" stop-color="#7A5232"/><stop offset=".62" stop-color="#8A6440"/><stop offset="1" stop-color="#6E5038"/></linearGradient>
      <linearGradient id="lgMargem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2B65E"/><stop offset=".3" stop-color="#A2A44C"/><stop offset=".75" stop-color="#7E8A3C"/><stop offset="1" stop-color="#6A6A34"/></linearGradient>
      <linearGradient id="lgMargemP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD466"/><stop offset=".3" stop-color="#72B44C"/><stop offset="1" stop-color="#4E8A3A"/></linearGradient>
      <linearGradient id="lgNeveM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF4FB"/><stop offset="1" stop-color="#CADCF0"/></linearGradient>
      <linearGradient id="lgNeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F2F7FD"/><stop offset="1" stop-color="#C6DAF0"/></linearGradient>
      <linearGradient id="lgMorroF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6CEE6"/><stop offset="1" stop-color="#D8DEEE"/></linearGradient>
      <linearGradient id="lgMorroL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0BEDA"/><stop offset="1" stop-color="#C8D4E6"/></linearGradient>
      <linearGradient id="lgMorroM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9EB0D0"/><stop offset="1" stop-color="#B4C4DE"/></linearGradient>
      <linearGradient id="lgMorroP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E98BE"/><stop offset="1" stop-color="#94AACA"/></linearGradient>
      <linearGradient id="lgRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F8FF" stop-opacity=".45"/><stop offset="1" stop-color="#E6F8FF" stop-opacity="0"/></linearGradient>
      <linearGradient id="lgGelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".22" stop-color="#E6F6FF"/><stop offset=".7" stop-color="#B6DCF4"/><stop offset="1" stop-color="#86C0EA"/></linearGradient>
      <linearGradient id="lgGeloSup" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F8FD"/><stop offset=".35" stop-color="#DCEBF7"/><stop offset="1" stop-color="#A6CDEB"/></linearGradient>
      <radialGradient id="lgGeloClaro" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5E9ACB" stop-opacity=".55"/><stop offset=".7" stop-color="#7EB2DA" stop-opacity=".35"/><stop offset="1" stop-color="#9CC6E6" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgFarol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8CEDC"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset="1" stop-color="#AEB6C8"/></linearGradient>
      <linearGradient id="lgFaixa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B82A20"/><stop offset=".35" stop-color="#F0503E"/><stop offset="1" stop-color="#A0221A"/></linearGradient>
      <linearGradient id="lgRocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A96A8"/><stop offset="1" stop-color="#5E5A6E"/></linearGradient>
      <radialGradient id="lgLuz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></radialGradient>
      <linearGradient id="lgFacho" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>
      <radialGradient id="lgSolG" cx=".4" cy=".38" r=".6"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A01E"/></radialGradient>
      <radialGradient id="lgToca" cx=".5" cy=".4" r=".65"><stop offset="0" stop-color="#4A3020"/><stop offset=".6" stop-color="#2A1A0E"/><stop offset="1" stop-color="#140C06"/></radialGradient>
      <radialGradient id="lgDomo" cx=".38" cy=".25" r=".85"><stop offset="0" stop-color="#A87A4A"/><stop offset=".55" stop-color="#6E4626"/><stop offset="1" stop-color="#3A2212"/></radialGradient>
      <linearGradient id="lgLama" x1="0" y1="270" x2="0" y2="372" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7A5636"/><stop offset=".5" stop-color="#5E4028"/><stop offset="1" stop-color="#46301C"/></linearGradient>
      <linearGradient id="lgCasca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6444"/><stop offset=".35" stop-color="#A07A58"/><stop offset=".7" stop-color="#6A4630"/><stop offset="1" stop-color="#4A2E1C"/></linearGradient>
      <linearGradient id="lgBet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D4D0C8"/><stop offset=".35" stop-color="#FFFFFC"/><stop offset=".75" stop-color="#E4E0D8"/><stop offset="1" stop-color="#A8A49C"/></linearGradient>
      <radialGradient id="lgPedraC" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#C4BECC"/><stop offset=".55" stop-color="#8E889A"/><stop offset="1" stop-color="#5A5468"/></radialGradient>
      <radialGradient id="lgPedraQ" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#D2B898"/><stop offset=".55" stop-color="#9A8068"/><stop offset="1" stop-color="#5E4A3A"/></radialGradient>
      <radialGradient id="lgPedraA" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#9AB0C8"/><stop offset=".55" stop-color="#5E7090"/><stop offset="1" stop-color="#2E3E5E"/></radialGradient>
      <linearGradient id="lgAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8B07A"/><stop offset="1" stop-color="#7A6A4A"/></linearGradient>
      <linearGradient id="lgAlga" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7AC86A"/><stop offset=".5" stop-color="#3E8A4A"/><stop offset="1" stop-color="#1E5A36"/></linearGradient>
      <linearGradient id="lgTaboa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6234"/><stop offset=".4" stop-color="#7A4A22"/><stop offset="1" stop-color="#4A2A12"/></linearGradient>
      <linearGradient id="lgPercaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8A836"/><stop offset=".45" stop-color="#D6D058"/><stop offset=".8" stop-color="#F2EAA0"/><stop offset="1" stop-color="#F8F0C0"/></linearGradient>
      <linearGradient id="lgEstG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A6C76"/><stop offset=".55" stop-color="#9A9CA6"/><stop offset="1" stop-color="#D4D6DE"/></linearGradient>
      <linearGradient id="lgPatoC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8A898"/><stop offset="1" stop-color="#7A6A5A"/></linearGradient>
      <radialGradient id="lgPatoV" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#4ECB8A"/><stop offset=".6" stop-color="#1E7A4A"/><stop offset="1" stop-color="#0E4A2A"/></radialGradient>
      <radialGradient id="lgNinfeia" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#8ADA6A"/><stop offset="1" stop-color="#3A8A3A"/></radialGradient>
      ${gradArv}
      <pattern id="lgGraos" width="34" height="30" patternUnits="userSpaceOnUse"><g fill="#2A180C" opacity=".5"><circle cx="3" cy="4" r=".9"/><circle cx="17" cy="9" r=".7"/><circle cx="27" cy="3" r="1"/><circle cx="9" cy="19" r=".8"/><circle cx="24" cy="22" r=".9"/><circle cx="31" cy="15" r=".6"/></g><g fill="#D8B486" opacity=".45"><circle cx="12" cy="3" r=".7"/><circle cx="22" cy="14" r=".8"/><circle cx="4" cy="26" r=".7"/><circle cx="15" cy="27" r=".6"/><circle cx="30" cy="27" r=".7"/></g></pattern>
      <clipPath id="lgBaciaClip"><path d="M100 252 C116 256 126 304 150 318 L300 362 L312 362 L312 200 L90 200Z"/></clipPath>
      <clipPath id="lgSoloClip"><path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 360 C424 392 452 440 470 500 H0Z"/></clipPath>
      <clipPath id="lgFundoClip"><rect x="340" y="${LAGO}" width="460" height="140"/></clipPath>
      <clipPath id="lgDomoClip"><path d="M118 282 C116 264 130 238 160 228 C190 238 206 290 204 336 L150 318 C136 308 126 296 118 282Z"/></clipPath>
      <clipPath id="lgSubmerso"><rect x="100" y="279" width="120" height="80"/></clipPath>
      <radialGradient id="lgVinheta" cx=".5" cy=".45" r=".78"><stop offset=".58" stop-color="#0A1A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A3A" stop-opacity=".36"/></radialGradient>
      <filter id="lgGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#lgCeuO)"/>
    <rect width="800" height="500" fill="url(#lgHalo)"/>
    <rect id="lg-ceu-i" width="800" height="500" fill="url(#lgCeuI)" style="opacity:0;transition:opacity 2s"/>
    <rect id="lg-ceu-p" width="800" height="500" fill="url(#lgCeuP)" style="opacity:0;transition:opacity 2s"/>
    <g id="lg-sol" class="toque" style="transition:opacity 1.6s"><g id="lg-sol-in" style="transform-origin:612px 74px;transition:transform 1s"><circle cx="612" cy="74" r="56" fill="#FFE27A" opacity=".18"/><circle cx="612" cy="74" r="40" fill="#FFE27A" opacity=".28"/><circle cx="612" cy="74" r="27" fill="url(#lgSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M598 64 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="624" cy="84" r="3" fill="#FFF6C8" opacity=".6"/></g><g id="lg-sol-hint" style="display:none">${brilhoHotspot(640, 50)}</g><circle cx="612" cy="74" r="50" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="150" y="34" width="90" height="42" style="color:#fff" opacity=".85"/><use href="#nuvem" x="690" y="120" width="70" height="32" style="color:#fff" opacity=".75"/></g>
    <g id="lg-nuvem" class="toque"><g id="lg-nuvem-in" style="transform-origin:420px 80px;transition:transform .5s"><g id="lg-nuvem-clara" style="transition:opacity 1.2s"><use href="#nuvem" x="352" y="44" width="130" height="62" style="color:#fff" opacity=".95"/></g><g id="lg-nuvem-neve" style="opacity:0;transition:opacity 1.2s"><use href="#nuvem" x="340" y="34" width="164" height="80" style="color:#7A88A8"/><use href="#nuvem" x="346" y="37" width="154" height="72" style="color:#C9D2E4"/><use href="#nuvem" x="372" y="62" width="104" height="46" style="color:#A4B0C8"/><path d="M370 64 q12 -8 26 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#fff" stroke="#A8C0DE" stroke-width=".8">${[[384, 120], [414, 128], [446, 118], [470, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g></g></g><g id="lg-nuvem-hint" style="display:none">${brilhoHotspot(486, 52)}</g><rect x="340" y="34" width="166" height="100" fill="transparent"/></g>
    <path d="M0 160 C40 140 90 128 150 140 C200 120 260 128 320 150 C370 164 410 186 440 210 V300 H0Z" fill="url(#lgMorroF)"/>
    <path d="M300 292 L300 238 C340 226 372 212 410 220 C450 200 480 194 520 208 C560 188 600 192 640 212 C680 202 720 204 760 216 C780 212 792 214 800 212 V292Z" fill="url(#lgMorroF)"/>
    <path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204 V300 H0Z" fill="url(#lgMorroL)"/>
    <path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244 V292Z" fill="url(#lgMorroM)"/>
    <g id="lg-neve-longe" style="opacity:0;transition:opacity 2s"><path d="M0 160 C40 140 90 128 150 140 C200 120 260 128 320 150 C370 164 410 186 440 210 V230 H0Z" fill="#EEF0FA" opacity=".9"/><path d="M300 292 L300 238 C340 226 372 212 410 220 C450 200 480 194 520 208 C560 188 600 192 640 212 C680 202 720 204 760 216 C780 212 792 214 800 212 V292Z" fill="#E8ECF8" opacity=".92"/><path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204 V300 H0Z" fill="#F2F5FB" opacity=".9"/><path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244 V292Z" fill="#F6F8FC" opacity=".9"/><path d="M0 190 C60 160 140 158 200 176 C260 160 330 170 420 204" stroke="#C8D2E6" stroke-width="1.4" fill="none"/><path d="M330 292 C380 262 430 254 480 262 C540 246 600 250 650 258 C700 248 760 252 800 244" stroke="#C4CEE4" stroke-width="1.4" fill="none"/></g>
    <g opacity=".85">${pinMorro}</g>
    ${pinMeio}
    <rect x="300" y="236" width="500" height="56" fill="url(#lgNevoa)"/>
    <path d="M330 292 C400 278 460 272 520 280 C580 270 640 274 690 282 C730 276 770 272 800 272 V292Z" fill="url(#lgMorroP)"/>
    ${pinLonge}
    <g id="lg-farol" class="toque"><path d="M682 293 C688 284 698 278 712 276 C722 270 736 268 748 272 C760 268 776 274 786 282 C792 286 796 290 798 293Z" fill="url(#lgRocha)" stroke="#4E4A5C" stroke-width="1.4"/><path d="M698 284 C706 279 716 278 724 280 M742 276 C752 273 764 275 772 280" stroke="#B8B4C6" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M712 284 l6 -4 l8 2 M760 286 l6 -5 l8 3" stroke="#4E4A5C" stroke-width="1" fill="none" opacity=".7"/><g transform="translate(712 270)"><path d="M-7 4 V-4 H7 V4Z" fill="#F2E8D8" stroke="#4E4A5C" stroke-width="1"/><path d="M-9 -3 L0 -9 L9 -3Z" fill="#B83A2E" stroke="#6A1A12" stroke-width=".9" stroke-linejoin="round"/><rect x="-4" y="-1.5" width="3" height="3" fill="#FFE27A" stroke="#4E4A5C" stroke-width=".5"/></g><path d="M682 293 q5 -3 10 0 t10 0 t10 0 M770 293 q5 -3 10 0 t10 0 t10 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/><circle cx="744" cy="206" r="18" fill="url(#lgLuz)"/><g transform="translate(744 276)"><path d="M-9 0 L-6.4 -56 H6.4 L9 0Z" fill="url(#lgFarol)" stroke="#4E5470" stroke-width="1.6"/>${[[-8.4, -14, -20], [-7.6, -30, -36], [-6.9, -44, -50]].map(([w, y1, y2]) => `<path d="M${w} ${y1} Q0 ${y1 + 2.4} ${-w} ${y1} L${-w - .4} ${y2} Q0 ${y2 + 2.4} ${w + .4} ${y2}Z" fill="url(#lgFaixa)"/>`).join('')}<path d="M-4 -6 V-52" stroke="#fff" stroke-width="1.4" opacity=".6"/><rect x="-10" y="-58.5" width="20" height="3" rx="1" fill="#2E3448"/><path d="M-9 -58.5 V-62 M-5 -58.5 V-62 M0 -58.5 V-62 M5 -58.5 V-62 M9 -58.5 V-62 M-9.5 -62 H9.5" stroke="#2E3448" stroke-width=".9"/><rect x="-6" y="-69" width="12" height="10" rx="1" fill="#FFE27A" stroke="#2E3448" stroke-width="1.4"/><path d="M-2 -69 V-59 M2 -69 V-59" stroke="#C89A2A" stroke-width=".7"/><path d="M-8 -69 Q0 -79 8 -69Z" fill="#E5392C" stroke="#7A1A10" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-77" r="1.6" fill="#2E3448"/><path d="M-3 -72 q2 -3 4 -3" stroke="#FFB0A0" stroke-width="1" fill="none"/><path d="M-2.4 0 V-7 a2.4 2.4 0 0 1 4.8 0 V0Z" fill="#2E3448"/><rect x="-1.4" y="-26" width="2.8" height="4" rx="1" fill="#2E3448"/><rect x="-1.2" y="-41" width="2.4" height="3.6" rx="1" fill="#2E3448"/></g><path id="lg-facho" d="M744 -63 L652 -82 L652 -42Z" transform="translate(0 276)" fill="url(#lgFacho)" style="opacity:.35"/><rect x="684" y="196" width="110" height="96" fill="transparent"/></g>
    <path d="M330 292 H800 V${LAGO} H380Z" fill="url(#lgSup)"/>
    <path d="M330 292 H800 V304 H339Z" fill="url(#lgRefMorro)"/>
    <g opacity=".22" fill="#3E5A80">${Array.from({ length:30 }, () => { const x = R(380, 680), h = R(5, 10); return `<path d="M${P(x)} ${P(294 + h)} L${P(x - h * .3)} 293 H${P(x + h * .3)}Z"/>`; }).join('')}</g>
    <g id="lg-reflexo"><g opacity=".55">${[[294, 7, '#fff'], [298, 6, '#E5392C'], [303, 5, '#fff'], [308, 5, '#E5392C'], [313, 4, '#fff'], [318, 3, '#FFE27A']].map(([y, w, c], i) => `<path d="M${744 - w + (i % 2) * 2} ${y} h${w * 2}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g><g stroke="#FFF4C8" stroke-linecap="round" opacity=".75">${Array.from({ length:12 }, (_, i) => { const y = 296 + i * 5.2, w = 6 + i * 2.6 + R(-3, 3); return `<path d="M${P(612 - w / 2 + R(-6, 6))} ${P(y)} h${P(w)}" stroke-width="${P(1.2 + i * .12)}"/>`; }).join('')}</g></g>
    <g fill="none" stroke-linecap="round">${ondas}</g>
    <rect id="lg-sup" class="toque" x="380" y="292" width="420" height="${LAGO - 292}" fill="transparent"/>
    <g id="lg-sup-gelo" style="opacity:0;transition:opacity 1.6s;pointer-events:none"><path d="M330 292 H800 V${LAGO} H380Z" fill="url(#lgGeloSup)"/>
      ${[[470, 322, 60, 9], [620, 340, 80, 11], [720, 306, 46, 6], [540, 302, 40, 5], [420, 348, 44, 8]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#lgGeloClaro)"/><g fill="#fff" stroke="#8DB6DA" stroke-width=".5" opacity=".9">${Array.from({ length:7 }, () => { const bx = x + R(-rx, rx) * .7, by = y + R(-ry, ry) * .5; return `<ellipse cx="${P(bx)}" cy="${P(by)}" rx="${P(R(1, 2.4))}" ry="${P(R(.6, 1.2))}"/><ellipse cx="${P(bx + R(-1, 1))}" cy="${P(by - 2.4)}" rx="${P(R(.6, 1.4))}" ry=".6"/>`; }).join('')}</g>`).join('')}
      <g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M392 334 l26 -7 l18 9 l24 -5 l14 4 M540 306 l16 10 l32 -3 l12 6 M600 352 l26 -10 l30 6 l24 -12 l20 4 M690 300 l18 9 l22 -2 M452 356 l38 -5 l12 3 M760 330 l20 -6 M640 318 l-12 -6 M520 345 l10 -10" stroke="#fff" stroke-width="2.4" transform="translate(0 1)"/><path d="M392 334 l26 -7 l18 9 l24 -5 l14 4 M540 306 l16 10 l32 -3 l12 6 M600 352 l26 -10 l30 6 l24 -12 l20 4 M690 300 l18 9 l22 -2 M452 356 l38 -5 l12 3 M760 330 l20 -6 M640 318 l-12 -6 M520 345 l10 -10" stroke="#6E9CC8" stroke-width="1.1"/></g>
      <g><path d="M330 292 C380 290 430 296 480 293 C540 290 600 296 660 293 C720 290 770 295 800 293 V299 C760 301 720 297 660 300 C600 302 540 297 480 300 C430 302 380 298 334 298Z" fill="#fff"/><path d="M334 298 C380 298 430 302 480 300 C540 297 600 302 660 300 C720 297 760 301 800 299" stroke="#B0CAE6" stroke-width="1.2" fill="none"/>${[[450, 333, 46], [664, 324, 40], [560, 352, 54], [760, 350, 30]].map(([x, y, w]) => `<path d="M${x - w} ${y + 2} C${x - w * .5} ${y - 4} ${x + w * .4} ${y - 4} ${x + w} ${y + 2} C${x + w * .4} ${y} ${x - w * .4} ${y} ${x - w} ${y + 2}Z" fill="#fff"/><path d="M${x - w} ${y + 2} C${x - w * .4} ${y + .2} ${x + w * .4} ${y + .2} ${x + w} ${y + 2}" stroke="#A9C6E6" stroke-width="1.2" fill="none"/>`).join('')}</g>
      <g fill="#fff">${[[500, 318], [612, 330], [700, 342], [760, 312], [430, 306]].map(([x, y]) => `<path d="M${x} ${y - 4} l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1Z"/>`).join('')}</g></g>
    <g id="lg-placas" style="opacity:0;transition:opacity 1.6s;pointer-events:none">${[[420, 310, 34], [500, 330, 44], [610, 304, 38], [690, 336, 50], [770, 312, 30]].map(([x, y, w], i) => { const d = `M${x - w} ${y} L${x - w * .6} ${y - 7} L${x + w * .7} ${y - 6} L${x + w} ${y + 1} L${x + w * .5} ${y + 7} L${x - w * .7} ${y + 6}Z`; return `<g style="animation:flutua ${(2.6 + i * .5).toFixed(1)}s ease-in-out infinite alternate"><ellipse cx="${x}" cy="${y + 8}" rx="${w * 1.05}" ry="3" fill="#2A6AA6" opacity=".3"/><path d="${d}" fill="#8EC0E6" stroke="#5E94C4" stroke-width="1.2" transform="translate(0 3.5)"/><path d="${d}" fill="url(#lgGeloSup)" stroke="#8AB8DC" stroke-width="1.4" stroke-linejoin="round"/><path d="M${x - w * .5} ${y - 3} h${w * .7}" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M${x - w * .2} ${y + 3} l${w * .3} -4" stroke="#A8CCE8" stroke-width="1" fill="none"/></g>`; }).join('')}</g>
    <g id="lg-mobelha" class="toque" data-fig="mobelha"><g id="lg-mob-pos"><g style="animation:flutua 3.4s ease-in-out infinite alternate"><svg x="530" y="300" width="78" height="54" viewBox="0 0 130 90"><use href="#f-mobelha"/></svg></g>${brilhoHotspot(600, 300)}</g></g>
    <rect x="340" y="${LAGO}" width="460" height="140" fill="url(#lgFundo)"/>
    <g clip-path="url(#lgFundoClip)">
      <g stroke="#CFF0FF" stroke-width="1.2" fill="none" opacity=".22">${Array.from({ length:9 }, (_, i) => `<path d="M${380 + i * 48} ${LAGO + 6 + (i % 3) * 4} q12 -6 24 0 t24 2 M${396 + i * 48} ${LAGO + 16 + (i % 2) * 5} q10 4 20 -2"/>`).join('')}</g>
      <g id="lg-raios">${[[430, 34], [520, 52], [610, 30], [690, 56], [770, 28]].map(([x, w]) => `<path d="M${x} ${LAGO} L${x + w} ${LAGO} L${x + w * 1.6 + 40} 490 L${x + 10} 490Z" fill="url(#lgRaio)" opacity=".5"/>`).join('')}</g>
      <g fill="#123E7A" opacity=".55">${[500, 620, 760].map(x => `<path d="${copa(x, 486, 60, 22, 9, .25)}"/>`).join('')}${[530, 600, 700, 780].map((x, i) => `<path d="M${x} 486 C${x - 6} 460 ${x + 6} 440 ${x + 2} ${420 + i * 6} C${x + 8} 444 ${x + 4} 462 ${x + 5} 486Z"/>`).join('')}</g>
      <path d="M400 482 C500 470 600 476 700 468 C740 466 780 470 800 468 V500 H400Z" fill="url(#lgAreia)" stroke="#8A6A3A" stroke-width="1.6"/>
      <g stroke="#E2CC96" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".55">${[[540, 484], [600, 488], [660, 482], [720, 480], [770, 486], [500, 490]].map(([x, y]) => `<path d="M${x - 14} ${y} q7 -3 14 0 t14 0"/>`).join('')}</g>
      <g transform="translate(560 476) rotate(-4)"><rect x="-34" y="-6" width="68" height="12" rx="6" fill="#5A4030" stroke="#2A1A10" stroke-width="1.4"/><ellipse cx="34" cy="0" rx="3.4" ry="6" fill="#8A6A4A" stroke="#2A1A10" stroke-width="1"/><path d="M-28 -2 H24 M-20 2 H14" stroke="#7A5A40" stroke-width="1.2"/><path d="M-30 -6 C-20 -9 0 -9 20 -7" stroke="#4E8A3A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>
      <g>${[[520, 484, 13], [598, 478, 8], [700, 474, 16], [760, 476, 10], [636, 482, 7], [470, 488, 9]].map(([x, y, r]) => `<ellipse cx="${x + 2}" cy="${y + r * .5}" rx="${r * 1.1}" ry="${r * .25}" fill="#0A1A3A" opacity=".35"/><path d="${copa(x, y, r, r * .62, 7, .12)}" fill="url(#lgPedraA)" stroke="#1E2A44" stroke-width="1.4"/><path d="M${x - r * .7} ${y - r * .4} q${r * .6} ${-r * .35} ${r * 1.3} ${-r * .1}" stroke="#5E9A5A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M${x - r * .5} ${y - r * .2} q${r * .4} -${r * .25} ${r * .8} 0" stroke="#D8E6F2" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}</g>
      <g>${[480, 590, 668, 742, 792].map((x, i) => { const h = 62 + (i % 3) * 14, l = (i % 2 ? 1 : -1) * 10; return `<g class="balanca" style="animation-duration:${(4 + i * .6).toFixed(1)}s;animation-delay:${(-i).toFixed(1)}s"><path d="M${x - 3} 484 C${x - 3 - l * .2} ${484 - h * .4} ${x + l * .6 - 2} ${484 - h * .75} ${x + l} ${484 - h} C${x + l * .6 + 2} ${484 - h * .7} ${x + 3 - l * .2} ${484 - h * .35} ${x + 3} 484Z" fill="url(#lgAlga)" stroke="#1E4A2A" stroke-width="1"/><path d="M${x + 6} 484 C${x + 4} ${484 - h * .3} ${x + 14} ${484 - h * .5} ${x + 12} ${484 - h * .7} C${x + 16} ${484 - h * .45} ${x + 9} ${484 - h * .3} ${x + 10} 484Z" fill="url(#lgAlga)" stroke="#1E4A2A" stroke-width="1"/><path d="M${x} 482 C${x - l * .1} ${484 - h * .4} ${x + l * .5} ${484 - h * .74} ${x + l * .9} ${486 - h}" stroke="#A8E68A" stroke-width=".8" fill="none" opacity=".6"/></g>`; }).join('')}</g>
      <g fill="#E6F6FF" opacity=".35">${Array.from({ length:20 }, () => `<circle cx="${P(R(420, 800))}" cy="${P(R(372, 470))}" r="${P(R(.6, 1.4))}"/>`).join('')}</g>
      <rect id="lg-fundo-toque" x="420" y="${LAGO + 2}" width="380" height="136" fill="transparent"/>
      <g id="lg-peixes">
        <g class="lg-peixe toque" data-p="truta" data-fig="truta"><g class="deriva" style="animation-duration:19s"><g style="animation:flutua 2.8s ease-in-out infinite alternate"><g class="lg-pin"><svg x="560" y="384" width="90" height="48" viewBox="0 0 130 70"><use href="#f-truta"/></svg></g></g></g><g class="lg-phint">${brilhoHotspot(640, 388)}</g></g>
        <g class="lg-peixe toque" data-p="perca"><g class="deriva" style="animation-duration:23s;animation-delay:-8s"><g style="animation:flutua 2.2s ease-in-out infinite alternate"><g class="lg-pin"><g transform="translate(528 430) scale(.9)">${perca}</g><g transform="translate(494 448) scale(.6)">${perca}</g></g></g></g><g class="lg-phint" style="display:none">${brilhoHotspot(556, 414)}</g><rect x="466" y="408" width="104" height="52" fill="transparent"/></g>
        <g class="lg-peixe toque" data-p="esturjao"><g class="deriva" style="animation-duration:30s;animation-direction:alternate-reverse"><g style="animation:flutua 4s ease-in-out infinite alternate"><g class="lg-pin"><g transform="translate(690 452) scale(-1 1) scale(.95)">${esturjao}</g></g></g></g><g class="lg-phint" style="display:none">${brilhoHotspot(760, 440)}</g><rect x="610" y="430" width="160" height="40" fill="transparent"/></g>
      </g>
      <g id="lg-laje" style="transform-origin:0 357px;transform:scaleY(0);transition:transform 1.6s ease-out"><path d="M340 357 H800 V378 ${Array.from({ length:23 }, (_, i) => `q-10 ${i % 2 ? 3.4 : -1.6} -20 ${i % 3 ? .4 : -.4}`).join(' ')}Z" fill="url(#lgGelo)" fill-opacity=".94" stroke="#6AA6D6" stroke-width="1.6"/><g stroke="#fff" stroke-width=".9" opacity=".35">${Array.from({ length:40 }, (_, i) => { const x = 344 + i * 11.4 + R(-3, 3); return `<path d="M${P(x)} 362 v${P(R(8, 14))}"/>`; }).join('')}</g><g fill="#fff" stroke="#7EB2DA" stroke-width=".5">${Array.from({ length:16 }, (_, i) => { const x = 360 + i * 28 + R(-6, 6); return [0, 1, 2, 3].map(j => `<ellipse cx="${P(x + R(-.8, .8))}" cy="${P(374 - j * 3.2)}" rx="${P(1.6 - j * .25)}" ry="${P(1.1 - j * .15)}"/>`).join(''); }).join('')}</g><path d="M420 364 l14 6 l10 -3 M600 362 l10 8 l14 -2 l8 6 M720 366 l12 -4 l10 7" stroke="#fff" stroke-width="1.4" fill="none" opacity=".85"/><path d="M340 361 H800" stroke="#fff" stroke-width="3"/><text x="486" y="374" text-anchor="start" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#123E78" stroke="#fff" stroke-width="3.4" stroke-linejoin="round" paint-order="stroke">gelo</text><text x="486" y="400" text-anchor="start" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#fff" stroke="#0A2E62" stroke-width="3.6" stroke-linejoin="round" paint-order="stroke">água</text></g>
    </g>
    <path d="M380 ${LAGO} ${Array.from({ length:21 }, () => 'q10 -3 20 0').join(' ')}" stroke="#E6F6FF" stroke-width="2.4" fill="none"/>
    <path d="M380 ${LAGO + 3} H800" stroke="#0E3A72" stroke-width="2" opacity=".18"/>
    <g opacity=".78"><g opacity=".8">${meioG}</g><g id="lg-meio-o" style="transition:opacity 2s">${meioO}</g><g id="lg-meio-p" style="opacity:0;transition:opacity 2s">${meioP}</g>${meioPin}</g>
    <path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgMargem)"/>
    <path id="lg-margem-p" d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgMargemP)" style="opacity:0;transition:opacity 2s"/>
    <path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292" stroke="#DCE08A" stroke-width="2" fill="none" opacity=".6"/>
    <g opacity=".85">${Array.from({ length:26 }, () => { const x = R(130, 360), y = R(256, 300); return x > 340 && y < 270 ? '' : tufo(x, y, R(.5, .8), '#6E7A2E', '#A4AE4A'); }).join('')}</g>
    <g id="lg-neve-margem" style="opacity:0;transition:opacity 2s"><path d="M0 246 C100 240 220 242 330 250 C350 256 364 274 374 292 L380 362 L0 362Z" fill="url(#lgNeveM)"/><g stroke="#C4D6EC" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"><path d="M140 262 C170 258 200 260 226 264 M250 270 C280 266 310 270 336 276 M160 286 C190 282 220 286 250 290"/></g><g fill="#fff">${[[180, 258], [300, 266], [220, 284]].map(([x, y]) => `<path d="M${x} ${y - 3} l.8 2.2 l2.2 .8 l-2.2 .8 l-.8 2.2 l-.8 -2.2 l-2.2 -.8 l2.2 -.8Z"/>`).join('')}</g></g>
    ${sombrasArv}
    <g id="lg-troncos">${troncos}</g>
    <g id="lg-pinhos">${pinhos}</g>
    <g id="lg-outono" style="transition:opacity 2s">${folhasChao}${outono}</g>
    <g id="lg-prima" style="opacity:0;transition:opacity 2s;pointer-events:none">${prima}</g>
    <g id="lg-neve-arv" style="opacity:0;transition:opacity 2s;pointer-events:none">${neveArv}</g>
    <path d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#2E6EA8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".35"/>
    <path id="lg-riacho-chao" d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#4A9AD8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path id="lg-riacho-flux" d="M126 302 C136 312 146 318 160 321 L300 360 C326 364 356 362 392 361" stroke="#DFF4FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="6 10"/>
    <g id="lg-alce" class="toque" data-fig="alce"><g id="lg-alce-pos" transform="translate(0 0)"><ellipse cx="46" cy="251" rx="32" ry="4" fill="#2A1A0A" opacity=".28"/><g id="lg-alce-in" style="transform-origin:48px 250px;transition:transform .8s"><g transform="translate(94 0) scale(-1 1)"><svg x="4" y="166" width="86" height="86" viewBox="0 0 120 120"><use href="#f-alce"/></svg></g></g></g>${brilhoHotspot(24, 178)}</g>
    <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO} C424 392 452 440 470 500 H0Z" fill="url(#lgSolo)"/>
    <g clip-path="url(#lgSoloClip)">
      <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO}" stroke="#3A2414" stroke-width="40" fill="none" opacity=".75"/>
      <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO}" stroke="#24160A" stroke-width="16" fill="none" opacity=".6"/>
      <path d="M150 326 L300 370 C330 374 370 370 400 372" stroke="#2A2620" stroke-width="18" fill="none" opacity=".4"/>
      ${manchas}
      <path d="M0 410 C60 402 120 416 200 406 C280 398 360 414 480 404 V500 H0Z" fill="#8E6E4C"/>
      <path d="M0 410 C60 402 120 416 200 406 C280 398 360 414 480 404" stroke="#5A3E26" stroke-width="2" fill="none" opacity=".6"/>
      ${pedrinhas}
      <rect width="480" height="500" y="250" fill="url(#lgGraos)"/>
      ${rocha}
      ${raizes}
      <path d="${raizinhas}" stroke="#2E1C0E" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>
      ${pedras}
    </g>
    <path d="M0 252 H100 C116 256 126 304 150 318 L300 362 C326 366 356 362 380 362 C392 362 400 360 406 ${LAGO} C424 392 452 440 470 500" stroke="#2A180C" stroke-width="2" fill="none"/>
    <path d="M0 252 H100 C116 256 122 270 128 282" stroke="#7A9A3A" stroke-width="5" fill="none" stroke-linecap="round" id="lg-grama"/>
    <path d="M332 363 C356 362 392 362 406 ${LAGO}" stroke="#6E8E36" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M132 290 C140 306 146 316 160 321 L300 362" stroke="#4A4A2A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    ${capim}
    <g>${[[176, 330, 4], [214, 340, 3.2], [262, 352, 3.6], [196, 336, 2.4]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#8A8496" stroke="#2E2420" stroke-width=".9"/>`).join('')}${folha(232, 345, 60, .22, '#C8642A', '#6A2A10')}${folha(160, 324, -50, .2, '#D8A02A', '#6A4A08')}</g>
    <g id="lg-tamia" class="toque"><path d="M18 252 C24 290 40 316 60 336" stroke="#9A7048" stroke-width="15" fill="none" stroke-linecap="round" opacity=".7"/><path d="M18 252 C24 290 40 316 60 336" stroke="#1E120A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M8 254 C10 246 26 246 30 254Z" fill="#7A5432" stroke="#3A2414" stroke-width="1.2"/><path d="M41 346 C42 330 58 324 74 324 C92 324 104 334 103 348 C102 358 90 363 72 363 C54 363 40 358 41 346Z" fill="#A07A50" opacity=".7"/><ellipse cx="72" cy="346" rx="30" ry="15" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.6"/><path d="M46 356 C58 361 86 361 98 355 C92 352 82 354 72 353 C62 353 52 352 46 356Z" fill="#C8A060"/><path d="M48 356 C60 360 84 360 96 356 M52 354 c6 -2 10 0 16 -1 M74 352 c6 1 12 -1 18 1" stroke="#E8C880" stroke-width="1.2" fill="none" stroke-linecap="round"/><g fill="#B8743A" stroke="#5A3414" stroke-width=".8">${[[88, 352], [92, 348], [84, 349], [95, 352]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.6"/><path d="M${x - 2} ${y - 2} q2 -1.6 4 0" stroke="#E8B070" stroke-width=".8" fill="none"/>`).join('')}</g><g id="lg-tamia-in" transform="translate(64 352)"><path d="M-12 -2 C-20 -8 -22 -16 -16 -20 C-14 -12 -10 -8 -6 -6Z" fill="#9A5E2E" stroke="#4A2810" stroke-width="1.2"/><ellipse cx="0" cy="-6" rx="11" ry="8" fill="#C07A40" stroke="#4A2810" stroke-width="1.4"/><path d="M-8 -11 C-2 -14 4 -14 8 -11 M-8 -7 C-2 -10 4 -10 8 -7" stroke="#2A1A0E" stroke-width="1.6" fill="none"/><path d="M-7 -9 C-2 -12 4 -12 7 -9" stroke="#F2E0C0" stroke-width="1.2" fill="none"/><ellipse cx="2" cy="-2" rx="6" ry="3" fill="#F2DCB8" opacity=".7"/><circle cx="9" cy="-12" r="6" fill="#C88446" stroke="#4A2810" stroke-width="1.4"/><circle cx="7" cy="-18" r="2.2" fill="#9A5E2E" stroke="#4A2810" stroke-width="1"/><path id="lg-tamia-dorme" d="M9 -13 q2 1.6 4 0" stroke="#12121A" stroke-width="1.4" fill="none" stroke-linecap="round" style="opacity:0"/><g id="lg-tamia-olho"><circle cx="11" cy="-13" r="2" fill="#12121A"/><circle cx="11.7" cy="-13.7" r=".7" fill="#fff"/></g><circle cx="15" cy="-11" r="1.4" fill="#2A1A0E"/><path d="M12 -15 l6 -2" stroke="#F2E0C0" stroke-width="1.2" stroke-linecap="round"/></g><text id="lg-tamia-z" x="80" y="336" font-family="Baloo 2, sans-serif" font-weight="800" font-size="12" fill="#FFF0C8" stroke="#2A1A0E" stroke-width="2.6" paint-order="stroke" style="opacity:0;transition:opacity 1s">z z</text><rect x="38" y="326" width="66" height="38" fill="transparent"/></g>
    <g id="lg-sapo-dorme" style="opacity:0;transition:opacity 1.4s"><path d="M226 371 C226 361 238 357 250 357 C264 357 275 362 275 371 C275 380 263 383 250 383 C236 383 226 379 226 371Z" fill="#9A7A52" opacity=".75"/><path d="M229 371 C229 363 239 360 250 360 C262 360 272 364 272 371 C272 378 262 380 250 380 C238 380 229 377 229 371Z" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.2"/><svg x="233" y="356" width="34" height="26" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg><text x="272" y="360" font-family="Baloo 2, sans-serif" font-weight="800" font-size="12" fill="#EEF4FF" stroke="#1E2A44" stroke-width="2.6" paint-order="stroke">z z</text></g>
    <g id="lg-tico" class="toque" data-fig="castor" transform="translate(240 344)"><g id="lg-tico-in"><svg x="-36" y="-60" width="72" height="60" viewBox="0 0 120 100"><use href="#f-castor"/></svg></g>${brilhoHotspot(24, -58)}</g>
    <g clip-path="url(#lgBaciaClip)"><g id="lg-agua" style="transform:translateY(90px);transition:transform 1.4s ease-in-out">
      <rect x="100" y="272" width="214" height="110" fill="url(#lgLagoa)" opacity=".88"/>
      <g opacity=".5">${[[150, 18], [210, 24], [270, 14]].map(([x, w]) => `<path d="M${x} 273 L${x + w} 273 L${x + w * 1.4 - 30} 382 L${x - 34} 382Z" fill="url(#lgRaio)"/>`).join('')}</g>
      <g id="lg-refl-o" style="transition:opacity 1.6s" opacity=".5">${reflexo(['#2E6A56', '#E2741C', '#EBA82A', '#2E6A72'])}</g>
      <g id="lg-refl-p" style="opacity:0;transition:opacity 1.6s"><g opacity=".5">${reflexo(['#2E6A56', '#44946E', '#62B04A', '#2E6A72'])}</g></g>
      <rect x="100" y="272" width="214" height="7" fill="url(#lgBrilhoAgua)"/>
      <path d="M100 272 H350" stroke="#E6F6FF" stroke-width="2.4"/><path d="M130 281 h40 M210 285 h30 M264 280 h24 M160 290 h18" stroke="#DFF2FF" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
      <g fill="#E6F6FF" opacity=".35">${Array.from({ length:10 }, () => `<circle cx="${P(R(110, 306))}" cy="${P(R(290, 370))}" r="${P(R(.6, 1.3))}"/>`).join('')}</g>
      <g id="lg-brejo" style="opacity:0;transition:opacity 1.4s">${[[210, 272, 9], [282, 273, 10], [298, 272, 7]].map(([x, y, r]) => `<path d="M${x} ${y} L${x + r} ${y - r * .1} A${r} ${r * .34} 0 1 1 ${x + r * .7} ${y + r * .26}Z" fill="url(#lgNinfeia)" stroke="#2A6A2A" stroke-width="1.2"/><path d="M${x} ${y} l${-r * .7} -1 M${x} ${y} l${-r * .3} 2.4 M${x} ${y} l${r * .3} 2.2" stroke="#2A6A2A" stroke-width=".6" opacity=".7"/><path d="M${x - r * .7} ${y - r * .18} q${r * .5} -2 ${r} -1" stroke="#C8F0A0" stroke-width="1" fill="none" stroke-linecap="round"/>`).join('')}<g transform="translate(298 269)"><path d="M0 0 C-4 -3 -4 -8 0 -10 C4 -8 4 -3 0 0Z" fill="#FFF6FA" stroke="#C2508A" stroke-width=".9"/><path d="M-5 0 C-6 -4 -3 -6 0 -4 C3 -6 6 -4 5 0Z" fill="#FFD2E4" stroke="#C2508A" stroke-width=".9"/><circle cx="0" cy="-2" r="1.6" fill="#FFD447"/></g></g>
      <g id="lg-sapos" class="toque" style="opacity:0;transition:opacity 1s">${[[210, 271], [282, 271]].map(([x, y], i) => `<g class="lg-sapo" data-i="${i}"><svg x="${x - 11}" y="${y - 16}" width="22" height="18" viewBox="0 0 100 80"><use class="sem" href="#f-perereca"/></svg></g>`).join('')}<rect x="198" y="252" width="100" height="22" fill="transparent"/></g>
      <g id="lg-patos" class="toque" style="opacity:0;transition:opacity 1.2s"><g id="lg-patos-in" style="transition:transform 2.4s ease-out;transform:translate(-120px,-150px)"><g style="animation:flutua 3s ease-in-out infinite alternate"><g stroke="#E6F6FF" stroke-width="1" fill="none" opacity=".7"><ellipse cx="258" cy="273" rx="26" ry="3"/><ellipse cx="236" cy="275" rx="17" ry="2.2"/></g>${pato(256, 272, 1.1)}${pato(234, 274, .78)}</g></g><rect x="216" y="236" width="64" height="40" fill="transparent"/></g>
      <g id="lg-gelo-lagoa" style="opacity:0;transition:opacity 1.6s"><path d="M100 266 H314 V281 ${Array.from({ length:11 }, (_, i) => `q-10 ${i % 2 ? 2.4 : -1} -19.5 0`).join(' ')}Z" fill="url(#lgGelo)" fill-opacity=".95" stroke="#6AA6D6" stroke-width="1.2"/><ellipse cx="160" cy="274" rx="26" ry="3.6" fill="url(#lgGeloClaro)"/><ellipse cx="260" cy="275" rx="22" ry="3" fill="url(#lgGeloClaro)"/><g fill="#fff" stroke="#7EB2DA" stroke-width=".4">${[[150, 276], [158, 274], [168, 277], [252, 276], [262, 274], [270, 277], [200, 277], [120, 275]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry=".9"/>`).join('')}</g><path d="M130 272 l20 3 l14 -3 M220 271 l26 4 l8 -2" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M130 272 l20 3 l14 -3 M220 271 l26 4 l8 -2" stroke="#7AA8D2" stroke-width=".8" fill="none" transform="translate(0 1)"/><path d="M98 266 C120 262 140 264 160 263 C190 261 220 265 250 263 C280 262 300 264 316 266Z" fill="#fff" stroke="#BCD2EA" stroke-width=".8"/></g>
    </g></g>
    <g id="lg-casa" style="display:none"><g class="cresce">
      <path d="M118 282 C116 264 130 238 160 228 C190 238 206 290 204 336 L150 318 C136 308 126 296 118 282Z" fill="url(#lgDomo)" stroke="#2E1A0C" stroke-width="2.4"/>
      <g clip-path="url(#lgDomoClip)">
        <g fill="#4A2E18" opacity=".6">${Array.from({ length:10 }, () => `<ellipse cx="${P(R(126, 200))}" cy="${P(R(240, 330))}" rx="${P(R(6, 12))}" ry="${P(R(3, 6))}"/>`).join('')}</g>
        ${(() => { let sg = ''; for (let i = 0; i < 70; i++) { const x = R(118, 206), y = R(228, 338); const a = Math.atan2(y - 336, x - 162) + PI / 2 + R(-.5, .5), L = R(12, 26), w = R(1.6, 4), c = CORG[Math.floor(R(0, 6))]; sg += graveto(x - Math.cos(a) * L / 2, y - Math.sin(a) * L / 2, x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, w, c[0], c[1], R(0, 1) < .3); } return sg; })()}
        <g fill="#5A3A20" stroke="#2E1C0E" stroke-width=".7">${Array.from({ length:9 }, () => { const x = R(126, 200), y = R(250, 332); return `<path d="M${P(x - 6)} ${P(y + 2)} q2 -5 6 -4 q5 -1 6 4 q-6 2 -12 0Z"/>`; }).join('')}</g>
        <path d="M150 230 l-6 -6 M160 228 l2 -9 M170 231 l6 -6" stroke="#4A2810" stroke-width="2" stroke-linecap="round"/>
        <rect x="100" y="279" width="120" height="70" fill="#2A6EA6" opacity=".22"/>
        <path d="M110 279 H220" stroke="#E6F6FF" stroke-width="2"/>
      </g>
      <path d="M118 290 l-8 -4 M122 268 l-9 -2 M204 300 l9 -3 M200 276 l8 -5 M136 244 l-6 -6 M186 246 l6 -6" stroke="#5A3418" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M137 260 C136 248 146 240 160 240 C174 240 185 248 184 260 C184 265 174 266 160 266 C146 266 137 265 137 260Z" fill="#A07A50" opacity=".8"/>
      <path d="M140 260 C140 250 148 243 160 243 C172 243 181 250 181 260 C181 263 172 264 160 264 C148 264 140 263 140 260Z" fill="url(#lgToca)" stroke="#2A1A0E" stroke-width="1.4"/>
      <path d="M142 261 C150 264 172 264 179 261 M146 259 c4 -1.6 8 0 12 -1 M162 259 c5 1 9 -1 13 .6" stroke="#E2BE7A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M174 262 C182 280 188 304 194 330" stroke="#5A3A20" stroke-width="15" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M174 262 C182 280 188 304 194 330" stroke="#1E120A" stroke-width="11" fill="none" stroke-linecap="round"/>
      <g clip-path="url(#lgSubmerso)"><path d="M174 262 C182 280 188 304 194 330" stroke="#24384E" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#CFEFFF" opacity=".8"><circle cx="186" cy="300" r="1.4"/><circle cx="184" cy="292" r="1"/><circle cx="190" cy="314" r="1.2"/></g></g>
      <path d="M176 279 h10" stroke="#E6F6FF" stroke-width="1.6"/>
      <g id="lg-tico-casa" class="toque" data-fig="castor" style="display:none"><svg x="142" y="235" width="34" height="28" viewBox="0 0 120 100"><use href="#f-castor"/></svg><text x="176" y="244" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#FFF0C8" stroke="#2A1A0E" stroke-width="2.4" paint-order="stroke">z</text></g>
      <g id="lg-neve-casa" style="opacity:0;transition:opacity 1.6s"><path d="M123 262 C122 250 132 234 146 229 C152 224 168 223 176 229 C190 236 198 250 198 262 C196 266 192 263 191 259 C188 266 185 262 184 256 C178 246 170 240 160 240 C150 240 141 246 136 256 C135 262 131 266 129 260 C127 266 123 266 123 262Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1"/><path d="M134 248 C142 238 152 234 160 234 C170 234 180 238 186 248" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/><path d="M137 256 C143 246 151 242 160 242 C169 242 177 246 183 256" stroke="#B8CEE8" stroke-width="1.2" fill="none"/><g fill="#E6F4FF" stroke="#9EC2E2" stroke-width=".6">${[[129, 262, 5], [191, 260, 6], [184, 257, 4]].map(([x, y, h]) => `<path d="M${x - 1.4} ${y} L${x} ${y + h} L${x + 1.4} ${y}Z"/>`).join('')}</g></g>
    </g></g>
    <g id="lg-estoque" style="opacity:0;transition:opacity 1.4s">${[[236, 334, -10, 0], [250, 330, 8, 1], [244, 340, 14, 2], [262, 344, -4, 4]].map(([x, y, r, ci]) => { const a = r * PI / 180, c = CORG[ci]; return graveto(x - Math.cos(a) * 16, y - Math.sin(a) * 16, x + Math.cos(a) * 16, y + Math.sin(a) * 16, 4.4, c[0], c[1], true) + `<path d="M${P(x + 6)} ${P(y - 2)} l5 -8" stroke="${c[1]}" stroke-width="1.6" stroke-linecap="round"/><path d="M${P(x + 11)} ${P(y - 10)} c3 -3 7 -1 5 2 c-2 1 -4 0 -5 -2Z" fill="#6A9A3A" stroke="#2E5A1A" stroke-width=".6"/>`; }).join('')}<path d="M226 348 C240 344 258 348 272 350" stroke="#3A2414" stroke-width="3" fill="none" opacity=".6"/></g>
    <g id="lg-dique">${[0, 1, 2, 3, 4].map(camada).join('')}</g>
    <g id="lg-taboas" style="display:none"><g class="cresce">${[[112, 268, 40], [104, 264, 30], [214, 274, 30], [292, 274, 40], [284, 276, 30]].map(([x, y, h], i) => `<g class="balanca" style="animation-delay:${(-i * .6).toFixed(1)}s"><path d="M${x - 1} ${y} C${x - 10} ${y - h * .3} ${x - 12} ${y - h * .6} ${x - 9} ${y - h * .85} C${x - 8} ${y - h * .55} ${x - 5} ${y - h * .3} ${x + 1} ${y}Z" fill="#5E8A2E" stroke="#2E4A14" stroke-width=".8"/><path d="M${x} ${y} C${x + 8} ${y - h * .3} ${x + 10} ${y - h * .5} ${x + 9} ${y - h * .75} C${x + 6} ${y - h * .5} ${x + 3} ${y - h * .3} ${x + 1.4} ${y}Z" fill="#7AAA3E" stroke="#2E4A14" stroke-width=".8"/><path d="M${x} ${y} q-2 -${h / 2} 1 -${h}" stroke="#2E4A14" stroke-width="3.2" fill="none"/><path d="M${x} ${y} q-2 -${h / 2} 1 -${h}" stroke="#6A9A3A" stroke-width="1.8" fill="none"/><rect x="${x - 3}" y="${y - h * .8}" width="6" height="${h * .28}" rx="3" fill="url(#lgTaboa)" stroke="#2E1A0A" stroke-width="1"/><path d="M${x - 1.4} ${y - h * .76} v${h * .2}" stroke="#B8844A" stroke-width="1" stroke-linecap="round" opacity=".8"/></g>`).join('')}</g></g>
    <g id="lg-neve-chao" style="opacity:0;transition:opacity 2s;pointer-events:none">${neveChao}<path d="M278 282 C282 272 292 270 300 271 C308 268 318 270 324 274 C330 276 332 282 330 284 C324 280 316 279 304 280 C294 280 286 281 278 282Z" fill="url(#lgNeve)" stroke="#AFC6E2" stroke-width="1" id="lg-neve-dique" style="opacity:0"/></g>
    <g id="lg-flores" style="opacity:0;transition:opacity 2s;pointer-events:none">${[[14, 250], [40, 251], [92, 250], [336, 362], [362, 362], [64, 249]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 v-8" stroke="#3E7A2A" stroke-width="1.4"/><path d="M0 -3 q-4 -1 -5 -4 q3 0 5 3" fill="#5EA03A"/><path d="M0 -8 l-4 -4 l4 -1 l4 1Z M0 -8 l-3 3 M0 -8 l3 3" fill="#FFFFFF" stroke="#B8A8C8" stroke-width=".8"/><circle cx="0" cy="-10" r="1.4" fill="#FFD447"/></g>`).join('')}</g>
    <g id="lg-degelo" style="opacity:0;transition:opacity 1.4s;pointer-events:none"><path class="lg-fio" d="M30 196 C40 212 50 226 70 236 C90 244 100 250 114 266" stroke="#4A9AF2" stroke-width="3.4" fill="none" stroke-linecap="round"/><path class="lg-fio" d="M520 254 C524 266 532 276 536 292" stroke="#4A9AF2" stroke-width="3" fill="none" stroke-linecap="round"/><path class="lg-fio" d="M664 254 C660 266 668 280 662 292" stroke="#4A9AF2" stroke-width="3" fill="none" stroke-linecap="round"/><g class="lg-fluxo" stroke="#E6F6FF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="5 9"><path d="M30 196 C40 212 50 226 70 236 C90 244 100 250 114 266"/><path d="M520 254 C524 266 532 276 536 292"/><path d="M664 254 C660 266 668 280 662 292"/></g></g>
    <g id="lg-galhos">${GALHOS.map((g, i) => `<g class="lg-galho toque" data-i="${i}" transform="translate(${g.x} ${g.y})" style="cursor:grab"><g transform="rotate(${g.r})"><ellipse cx="0" cy="6" rx="26" ry="3" fill="#1E120A" opacity=".2"/>${galhoDes(i)}</g><circle r="32" fill="transparent"/></g>`).join('')}</g>
    <g id="lg-alvo" style="opacity:.0"><ellipse cx="${DAM.x}" cy="${DAM.y + 18}" rx="40" ry="16" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 7"/></g>
    <g id="lg-mao" pointer-events="none"><path d="M206 312 C226 262 270 258 300 296" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M304 300 l-14 -2 l7 -10Z" fill="#fff"/></g>
    <g id="lg-ramo" class="toque"><path d="M-20 30 C40 36 90 52 140 42 C170 36 190 44 210 58" stroke="#2E1C10" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-20 30 C40 36 90 52 140 42 C170 36 190 44 210 58" stroke="#6E4A30" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-20 27 C40 33 90 49 140 39 C160 35 176 37 190 44" stroke="#A07A58" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M10 36 l8 1 M48 41 l9 2 M100 47 l8 -1 M160 42 l7 2" stroke="#2E1C10" stroke-width="1.2" stroke-linecap="round" opacity=".6"/><path d="M70 44 C80 60 84 70 82 80 M150 42 C160 30 170 24 182 22 M112 46 C116 52 116 56 112 60" stroke="#2E1C10" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M70 44 C80 60 84 70 82 80 M150 42 C160 30 170 24 182 22 M112 46 C116 52 116 56 112 60" stroke="#6E4A30" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g id="lg-ramo-o" style="transition:opacity 2s">${[[30, 46, '#E2452A', '#7A1A0A'], [58, 58, '#F08A2A', '#8A400A'], [84, 84, '#D2302A', '#6A100A'], [112, 60, '#F2B83A', '#8A600A'], [182, 22, '#E8602A', '#7E2A0E'], [208, 64, '#F2C83A', '#8A6A0A'], [140, 58, '#E2452A', '#7A1A0A']].map(([x, y, c, e], i) => folha(x, y, (i * 47) % 360, 1, c, e)).join('')}</g>
      <g id="lg-ramo-p" style="opacity:0;transition:opacity 2s">${[[30, 46], [58, 58], [84, 84], [112, 60], [182, 22], [208, 64], [140, 58]].map(([x, y], i) => folha(x, y, (i * 47) % 360, .8, i % 2 ? '#7CC85A' : '#9AD86A', '#2E6A22')).join('')}</g>
      <path id="lg-ramo-n" d="M-20 24 C40 30 90 46 140 36 C170 30 190 38 210 52" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" style="opacity:0;transition:opacity 2s"/></g>
    <g pointer-events="none">${[[790, 500, 70, -8], [772, 500, 50, 10], [356, 500, 40, -6]].map(([x, y, h, l], i) => `<g class="balanca" style="animation-delay:${(-i * .8).toFixed(1)}s"><path d="M${x - 4} ${y} C${x - 4 - l * .2} ${y - h * .4} ${x + l * .6 - 2} ${y - h * .75} ${x + l} ${y - h} C${x + l * .6 + 2} ${y - h * .7} ${x + 4 - l * .2} ${y - h * .35} ${x + 4} ${y}Z" fill="#2E6A3A" stroke="#123A1E" stroke-width="1.2"/><path d="M${x} ${y} C${x - l * .1} ${y - h * .4} ${x + l * .5} ${y - h * .74} ${x + l * .9} ${y - h + 2}" stroke="#7AC86A" stroke-width="1" fill="none" opacity=".7"/></g>`).join('')}</g>
    <rect width="800" height="500" fill="url(#lgVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#lgGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mao = el(s, '#lg-mao'); mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  el(s, '#lg-riacho-flux').animate([{ strokeDashoffset:0 }, { strokeDashoffset:-32 }], { duration:1100, iterations:Infinity });
  s.querySelectorAll('#lg-raios path').forEach((r, i) => r.animate([{ opacity:.25 }, { opacity:.6 }, { opacity:.25 }], { duration:4200 + i * 900, iterations:Infinity }));
  const bolhas = (x, y, n) => { for (let i = 0; i < n; i++) c.add({ tipo:'bolha', x:x + sorte(-10, 10), y:y + sorte(-4, 4), vy:sorte(.6, 1.4), r:sorte(2, 4.5), topo:(fase === 'inverno' || fase === 'peixes') ? 382 : LAGO + 2, f:sorte(0, 6) }); };
  const show = (sel, v) => { el(s, sel).style.opacity = v; };
  /* ---------- Tico ---------- */
  const tico = el(s, '#lg-tico'); let ticoX = 240, ticoY = 344;
  const poeTico = () => tico.setAttribute('transform', `translate(${ticoX.toFixed(1)} ${ticoY.toFixed(1)})`);
  const ticoNada = () => { const alvo = Math.min(chao(ticoX), nivel + 26); const y0 = ticoY; tween(1400, e => { ticoY = y0 + (alvo - y0) * e; poeTico(); }); };
  const ticoVai = (x1, y1, ms, fim) => { const x0 = ticoX, y0 = ticoY; tween(ms, e => { ticoX = x0 + (x1 - x0) * e; ticoY = y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 24; poeTico(); }, fim); };
  const roer = () => el(s, '#lg-tico-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:600 });
  /* ---------- 1. represa: arrastar os galhos até o dique ---------- */
  const gs = [...s.querySelectorAll('.lg-galho')], pos = GALHOS.map(g => ({ x:g.x, y:g.y, foi:false, base:g.y }));
  const poe = i => gs[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})`);
  let arr = null;
  gs.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (fase !== 'represa' || pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; mao.style.display = 'none'; el(s, '#lg-alvo').style.opacity = .8; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(40, Math.min(480, p.y - arr.dy)); poe(arr.i);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; gs[i].style.cursor = 'grab'; el(s, '#lg-alvo').style.opacity = 0;
    if (!moveu || Math.hypot(pos[i].x - DAM.x, pos[i].y - DAM.y) < 95) colocar(i); else voltar(i);
  });
  function anima(i, x1, y1, ms, esc, fim){
    const x0 = pos[i].x, y0 = pos[i].y; ocupado = true;
    tween(ms, (e, k) => { pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 50; gs[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${(1 + (esc - 1) * e).toFixed(2)})`); }, () => { ocupado = false; fim && fim(); });
  }
  function voltar(i){ const g = GALHOS[i]; anima(i, g.x, Math.min(g.y, nivel - 3), 700, 1); toca('glub'); api.diz('Leve o galho até a represa, no fim da lagoa!'); }
  function colocar(i){
    pos[i].foi = true;
    const yAlvo = 354 - galhos * 17.6;
    anima(i, 316 - galhos * 3, yAlvo, 900, .7, () => {
      gs[i].style.display = 'none';
      const cam = s.querySelector(`.lg-dique[data-k="${galhos}"]`); cam.style.display = '';
      galhos++; toca('planta'); roer(); c.brilhos(DAM.x, yAlvo - 6, 6, '#FFE27A');
      for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:DAM.x - 40 + sorte(-10, 10), y:NIVEIS[galhos], t:k * 2, cor:'#BFE6FF' });
      nivel = NIVEIS[galhos]; el(s, '#lg-agua').style.transform = `translateY(${nivel - 272}px)`; toca('splash');
      depois(500, ticoNada);
      api.hud(`<span class="chip">Galhos na represa: ${galhos}/5</span>`);
      const falas = ['Isso! A represa segura a água, e ela começa a subir.', 'Eu prendo os galhos com lama. Meus dentes cortam madeira!', 'Olha a lagoa crescendo atrás da represa!', 'Só falta um galho!'];
      if (galhos < 5) api.diz(falas[galhos - 1]); else represaPronta();
    });
  }
  /* galhos no fundo da lagoa boiam quando a água sobe */
  (function boia(){ if (!vivo) return; pos.forEach((p, i) => { if (p.foi || (arr && arr.i === i) || ocupado) return; const by = GALHOS[i].x > 140 && GALHOS[i].x < 300 ? Math.min(GALHOS[i].y, nivel - 2) : GALHOS[i].y; if (Math.abs(p.y - by) > .3) { p.y += (by - p.y) * .05; poe(i); } }); requestAnimationFrame(boia); })();
  function represaPronta(){
    fase = 'brejo'; toca('vitoria'); el(s, '#lg-riacho-flux').style.opacity = .35;
    api.diz('Pronto! A represa fez uma lagoa. Agora eu construo a minha casa!');
    depois(1400, () => { el(s, '#lg-casa').style.display = ''; toca('planta'); c.brilhos(160, 262, 8, '#FFE27A'); ticoVai(304, 280, 1200); });
    depois(3200, () => { el(s, '#lg-taboas').style.display = ''; show('#lg-brejo', 1); show('#lg-sapos', 1); toca('pop'); });
    depois(4200, () => { show('#lg-patos', 1); el(s, '#lg-patos-in').style.transform = 'translate(0,0)'; [520, 470].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'sawtooth', .04, f * .7), i * 220)); });
    depois(4600, () => { api.diz('Virou um brejo cheio de vida: sapos, patos e até o alce veio beber! O brejo guarda a água como uma esponja e deixa a água mais limpa.'); alceBebe(); });
    depois(10500, comecaInverno);
  }
  let alceX = 0, alceOcupado = false;
  function alceBebe(){
    if (alceOcupado) return; alceOcupado = true; const x0 = alceX, x1 = fase === 'represa' ? alceX : 34;
    tween(1600, e => { alceX = x0 + (x1 - x0) * e; el(s, '#lg-alce-pos').setAttribute('transform', `translate(${alceX.toFixed(1)} ${(Math.abs(Math.sin(e * 12)) * -1.5).toFixed(1)})`); }, () => {
      const a = el(s, '#lg-alce-in'); a.style.transform = 'rotate(12deg)';
      depois(600, () => { toca('glub'); for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:118 + sorte(-6, 6), y:Math.min(nivel, 300), t:k * 3, cor:'#BFE6FF' }); });
      depois(2000, () => { a.style.transform = ''; alceOcupado = false; });
    });
  }
  /* ---------- 2. inverno: tocar na nuvem de neve ---------- */
  function comecaInverno(){
    fase = 'inverno'; show('#lg-nuvem-clara', 0); show('#lg-nuvem-neve', 1); el(s, '#lg-nuvem-hint').style.display = ''; el(s, '#lg-sol').style.opacity = .45;
    api.hud('<span class="chip">Inverno: 0/3</span>');
    api.diz('O inverno está chegando! Toque na nuvem de neve.');
  }
  const neva = () => { for (let i = 0; i < 70; i++) depois(i * 30, () => c.add({ tipo:'floco', x:sorte(0, 800), y:sorte(100, 130), vy:sorte(1.2, 2.4), f:sorte(0, 6), r:sorte(1.6, 3.4), chao:sorte(250, 480) })); };
  el(s, '#lg-nuvem').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'inverno') { toca('pop'); api.diz(fase === 'represa' || fase === 'brejo' ? 'É outono. Logo vai esfriar, e por isso eu preciso terminar a represa.' : 'Essa nuvem trouxe muita neve.'); return; }
    if (ocupado) return; ocupado = true; neves++; toca('vapor'); neva();
    el(s, '#lg-nuvem-in').animate([{ transform:'scale(1)' }, { transform:'scale(1.08)' }, { transform:'scale(1)' }], { duration:500 });
    api.hud(`<span class="chip">Inverno: ${neves}/3</span>`);
    if (neves === 1) depois(900, () => {
      show('#lg-ceu-i', 1); show('#lg-outono', 0); el(s, '#lg-outono').style.pointerEvents = 'none'; show('#lg-meio-o', 0); show('#lg-neve-chao', 1); show('#lg-neve-margem', .85); show('#lg-neve-arv', 1); show('#lg-neve-longe', 1); show('#lg-ramo-o', 0); show('#lg-ramo-n', 1); show('#lg-refl-o', 0); s.querySelectorAll('.lg-filete').forEach(f => f.style.opacity = 0);
      show('#lg-patos', 0); show('#lg-sapos', 0); show('#lg-brejo', .5); vooMobelha(false); show('#lg-tamia-z', 1); show('#lg-tamia-dorme', 1); show('#lg-tamia-olho', 0);
      api.diz('Neve! As árvores perderam as folhas, e a mobelha e os patos voaram para lugares mais quentes.');
      depois(1400, () => ocupado = false);
    });
    if (neves === 2) depois(900, () => {
      show('#lg-sup-gelo', .6); el(s, '#lg-laje').style.transform = 'scaleY(.45)'; show('#lg-gelo-lagoa', 1); el(s, '#lg-neve-dique').style.opacity = 1; show('#lg-neve-casa', 1); toca('clique');
      el(s, '#lg-riacho-flux').style.opacity = 0; el(s, '#lg-riacho-chao').setAttribute('stroke', '#A8D4F2');
      api.diz('Brrr! A água do lago começa a congelar por cima.');
      depois(1400, () => ocupado = false);
    });
    if (neves === 3) depois(900, () => {
      show('#lg-sup-gelo', 1); el(s, '#lg-laje').style.transform = 'scaleY(1)'; toca('ok'); c.brilhos(600, 368, 8, '#FFFFFF');
      tico.style.display = 'none'; el(s, '#lg-tico-casa').style.display = ''; show('#lg-estoque', 1); show('#lg-sapo-dorme', 1);
      el(s, '#lg-nuvem-hint').style.display = 'none';
      api.diz('O gelo flutua! Ele fica por cima, como um cobertor, e a água lá embaixo não congela.');
      depois(5200, comecaPeixes);
    });
  });
  function comecaPeixes(){
    fase = 'peixes'; ocupado = false; s.querySelectorAll('.lg-phint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Peixes: 0/3</span>');
    api.diz('Os peixes continuam nadando debaixo do gelo! Toque nos peixes.');
  }
  const FALA_PEIXE = { truta:'A truta gosta de água bem fria e limpinha.', perca:'As percas nadam em grupo, mesmo no inverno.', esturjao:'O esturjão vive no fundo do lago. Ele é de uma família de peixes do tempo dos dinossauros!' };
  s.querySelectorAll('.lg-peixe').forEach(g => g.addEventListener('click', () => {
    const p = g.dataset.p, r = g.getBoundingClientRect(), sv = s.getBoundingClientRect(), x = (r.left + r.width / 2 - sv.left) / sv.width * 800, y = (r.top + r.height / 2 - sv.top) / sv.height * 500;
    toca('glub'); bolhas(x, y, 5);
    el(g, '.lg-pin').animate([{ transform:'translateX(0)' }, { transform:'translateX(-6px)' }, { transform:'translateX(6px)' }, { transform:'translateX(0)' }], { duration:500 });
    if (fase !== 'peixes' || g.dataset.feito) { api.diz(FALA_PEIXE[p]); return; }
    g.dataset.feito = 1; el(g, '.lg-phint').style.display = 'none'; peixes++;
    api.hud(`<span class="chip">Peixes: ${peixes}/3</span>`); c.brilhos(x, y, 5, '#BFE6FF');
    api.diz(FALA_PEIXE[p]);
    if (peixes === 3) { toca('vitoria'); depois(3800, () => { api.diz('Eu também passo o inverno quentinho na minha casa, comendo os galhos que guardei debaixo da água.'); }); depois(8200, comecaPrimavera); }
  }));
  /* ---------- 3. primavera: tocar no sol ---------- */
  function comecaPrimavera(){
    fase = 'primavera'; el(s, '#lg-sol').style.opacity = 1; el(s, '#lg-sol-hint').style.display = '';
    api.hud('<span class="chip">Sol da primavera: 0/3</span>');
    api.diz('Agora toque no sol para a primavera chegar!');
  }
  el(s, '#lg-sol').addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'primavera') { toca('ok'); c.brilhos(612, 74, 6, '#FFE27A'); api.diz(fase === 'inverno' || fase === 'peixes' ? 'No inverno o sol fica baixinho e esquenta pouco.' : 'O sol de outono já está mais fraquinho.'); return; }
    if (ocupado || sois >= 3) return; ocupado = true; sois++; toca('vapor');
    el(s, '#lg-sol-in').style.transform = `scale(${(1 + sois * .12).toFixed(2)})`;
    for (let i = 0; i < 14; i++) c.add({ tipo:'vapor', x0:sorte(380, 780), y0:300 + sorte(0, 40), x1:612 + sorte(-60, 60), y1:130 + sorte(-10, 20), dur:sorte(70, 110), f:sorte(0, 6), r:sorte(2.4, 4.6), x:0, y:0 });
    api.hud(`<span class="chip">Sol da primavera: ${sois}/3</span>`);
    if (sois === 1) depois(900, () => {
      show('#lg-nuvem-clara', 1); show('#lg-nuvem-neve', 0);
      show('#lg-ceu-i', 0); show('#lg-ceu-p', 1); show('#lg-neve-chao', 0); show('#lg-neve-margem', 0); show('#lg-neve-arv', 0); show('#lg-neve-longe', 0); show('#lg-ramo-n', 0); show('#lg-neve-casa', 0);
      show('#lg-sup-gelo', 0); el(s, '#lg-laje').style.transform = 'scaleY(0)'; show('#lg-placas', 1); show('#lg-gelo-lagoa', 0); s.querySelectorAll('.lg-filete').forEach(f => f.style.opacity = '');
      show('#lg-degelo', 1); s.querySelectorAll('#lg-degelo .lg-fluxo path').forEach(p => p.animate([{ strokeDashoffset:0 }, { strokeDashoffset:-28 }], { duration:900, iterations:Infinity }));
      el(s, '#lg-riacho-chao').setAttribute('stroke', '#4A9AD8'); el(s, '#lg-riacho-flux').style.opacity = .6;
      for (let k = 0; k < 6; k++) c.add({ tipo:'respingo', x:sorte(400, 780), y:sorte(300, 350), t:k, cor:'#E6F6FF' });
      api.diz('O gelo e a neve estão derretendo! A água da neve desce em riachos até o lago.');
      depois(1400, () => ocupado = false);
    });
    if (sois === 2) depois(900, () => {
      show('#lg-placas', 0); show('#lg-prima', 1); show('#lg-meio-p', 1); show('#lg-margem-p', 1); show('#lg-ramo-p', 1); show('#lg-flores', 1); show('#lg-refl-p', 1);
      show('#lg-sapo-dorme', 0); show('#lg-sapos', 1); show('#lg-tamia-z', 0); show('#lg-tamia-dorme', 0); show('#lg-tamia-olho', 1); show('#lg-brejo', 1); show('#lg-estoque', 0); show('#lg-patos', 1);
      el(s, '#lg-tico-casa').style.display = 'none'; tico.style.display = ''; toca('planta'); c.brilhos(304, 250, 6, '#B8E88A');
      api.diz('O lago e a lagoa ficaram cheios com a água da neve. Tudo ficou verde!');
      depois(1400, () => ocupado = false);
    });
    if (sois === 3) depois(900, () => {
      el(s, '#lg-sol-hint').style.display = 'none'; show('#lg-degelo', .5);
      vooMobelha(true);
      api.diz('Olha quem voltou: a mobelha! Escute o canto dela.');
      depois(3600, () => { cantoMobelha(); });
      depois(6800, () => { fase = 'fim'; toca('vitoria'); api.diz('Os Grandes Lagos guardam muita água doce: mais ou menos um quinto de toda a água doce dos lagos e rios do planeta! E os brejos, como a lagoa do castor, seguram e limpam a água.'); depois(6400, api.fim); });
    });
  });
  /* ---------- mobelha ---------- */
  const mobPos = el(s, '#lg-mob-pos');
  function vooMobelha(volta){
    const a = volta ? { x:320, y:-260 } : { x:0, y:0 }, b = volta ? { x:0, y:0 } : { x:300, y:-280 };
    if (volta) mobPos.style.opacity = 1;
    tween(2600, e => { const x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e; mobPos.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); }, () => { if (!volta) mobPos.style.opacity = 0; else { toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:560 + k * 10, y:340, t:k * 2, cor:'#E6F6FF' }); } });
  }
  function cantoMobelha(){ [[420, 640], [640, 560], [560, 760], [760, 520]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .55, 'sine', .07, f2), i * 480)); }
  el(s, '#lg-mobelha').addEventListener('click', () => { cantoMobelha(); for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:570 + k * 8, y:342, t:k * 3, cor:'#E6F6FF' }); api.diz('É a mobelha! O canto dela parece um uivo e se ouve longe no lago. Ela mergulha fundo para pegar peixes.'); });
  /* ---------- toques extras ---------- */
  el(s, '#lg-farol').addEventListener('click', e => { e.stopPropagation(); toca('clique'); [196, 196].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .5, 'triangle', .06, f * .95), i * 650)); el(s, '#lg-facho').animate([{ opacity:.35 }, { opacity:1 }, { opacity:.2 }, { opacity:1 }, { opacity:.35 }], { duration:1800 }); api.diz('Um farol! Os Grandes Lagos são tão grandes que têm ondas e navios, como o mar. Mas a água deles é doce.'); });
  s.querySelectorAll('.lg-bordo').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); const x = +g.dataset.x, y = +g.dataset.y; toca('pop'); for (let i = 0; i < 10; i++) depois(i * 90, () => c.add({ tipo:'petala', x:x + sorte(-30, 30), y:y + sorte(-10, 20), vy:sorte(1, 1.8), f:sorte(0, 6), chao:sorte(250, 340), cor:['#E2452A', '#F08A2A', '#F2C83A'][i % 3], borda:'#7A2A10' })); api.diz('Folhas de bordo! No outono elas ficam vermelhas, laranjas e amarelas antes de cair.'); }));
  el(s, '#lg-ramo').addEventListener('click', e => { e.stopPropagation(); toca('pop'); if (fase === 'inverno' || fase === 'peixes') { for (let i = 0; i < 8; i++) c.add({ tipo:'floco', x:sorte(0, 200), y:sorte(40, 70), vy:sorte(1.4, 2.2), f:sorte(0, 6), r:2.4, chao:sorte(200, 330) }); return; } for (let i = 0; i < 6; i++) c.add({ tipo:'petala', x:sorte(20, 200), y:sorte(40, 80), vy:sorte(1, 1.8), f:sorte(0, 6), chao:sorte(230, 330), cor:fase === 'primavera' || fase === 'fim' ? '#8ACB5A' : ['#E2452A', '#F08A2A', '#F2C83A'][i % 3], borda:fase === 'primavera' || fase === 'fim' ? '#2E6A22' : '#7A2A10' }); });
  el(s, '#lg-alce').addEventListener('click', () => { [110, 90].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .6, 'sawtooth', .05, f * .8), i * 500)); if (fase === 'represa') { el(s, '#lg-alce-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(-6deg)' }, { transform:'rotate(0)' }], { duration:700 }); api.diz('O alce é o maior bicho da família dos veados. Ele adora comer plantas de brejo!'); return; } alceBebe(); api.diz('O alce adora plantas de brejo e sabe nadar muito bem!'); });
  el(s, '#lg-patos').addEventListener('click', e => { e.stopPropagation(); [560, 520, 560].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .1, 'sawtooth', .04, f * .7), i * 170)); el(s, '#lg-patos-in').animate([{ transform:'translate(0,0)' }, { transform:'translate(0,-6px)' }, { transform:'translate(0,0)' }], { duration:500 }); });
  s.querySelectorAll('.lg-sapo').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); [300, 240].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .12, 'square', .04, f * .6), i * 160)); g.animate([{ transform:'translateY(0)' }, { transform:'translateY(-14px)' }, { transform:'translateY(0)' }], { duration:500, easing:'ease-out' }); api.diz('Croac! Os sapos colocam os ovos na água parada da lagoa.'); }));
  el(s, '#lg-tamia').addEventListener('click', e => { e.stopPropagation(); [1800, 2000, 1800].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .06, 'square', .03, f), i * 110)); const frio = fase === 'inverno' || fase === 'peixes'; if (!frio) el(s, '#lg-tamia-in').animate([{ transform:'translate(64px,352px)' }, { transform:'translate(64px,346px)' }, { transform:'translate(64px,352px)' }], { duration:400, iterations:2 }); api.diz(frio ? 'A tâmia dorme na toca no inverno e guarda sementes para comer quando acordar.' : 'É uma tâmia! Ela guarda sementes na toca, debaixo da terra.'); });
  el(s, '#lg-sapo-dorme').addEventListener('click', e => { e.stopPropagation(); toca('pop'); api.diz('Psiu! O sapo passa o inverno dormindo na lama do fundo da lagoa.'); });
  tico.addEventListener('click', () => { roer(); toca('pop'); if (fase === 'represa') api.diz('Eu sou o Tico! Arraste os galhos até a represa.'); else api.diz('Castores constroem represas, e a água parada vira um brejo cheio de vida.'); });
  el(s, '#lg-tico-casa').addEventListener('click', () => api.diz('Psiu, estou na minha casa! A entrada fica debaixo da água, para ninguém entrar.'));
  /* peixe pula quando toca na água do lago */
  let pulando = false;
  el(s, '#lg-sup').addEventListener('click', e => {
    const p = c.ponto(e);
    if (fase === 'inverno' || fase === 'peixes') { toca('clique'); c.brilhos(p.x, p.y, 3, '#FFFFFF'); api.diz('O gelo está duro! Os peixes estão lá embaixo, na água.'); return; }
    if (pulando) return; pulando = true; toca('splash');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = `<svg x="-22" y="-12" width="44" height="24" viewBox="0 0 130 70"><use href="#f-truta"/></svg>`; el(s, '#lg-galhos').before(g);
    const x0 = p.x - 30, x1 = p.x + 30, yb = Math.max(p.y, 310);
    for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:x0, y:yb, t:k * 2, cor:'#E6F6FF' });
    tween(1000, (e2, k) => { const x = x0 + (x1 - x0) * k, y = yb - Math.sin(k * Math.PI) * 60, a = -50 + k * 100; g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})`); }, () => { g.remove(); toca('splash'); for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:x1, y:yb, t:k * 2, cor:'#E6F6FF' }); pulando = false; });
  });
  el(s, '#lg-fundo-toque').addEventListener('click', e => { const p = c.ponto(e); toca('glub'); bolhas(p.x, p.y, 4); });
  /* cardume de peixinhos no lago (canvas) */
  const cardume = Array.from({ length:12 }, (_, i) => ({ x:620 + sorte(-60, 60), y:420 + sorte(-20, 20), vx:sorte(-1, 1), vy:0, f:sorte(0, 6) }));
  c.desenho(ctx => {
    const t = performance.now() / 1000, frio = fase === 'inverno' || fase === 'peixes';
    const ax = 600 + Math.cos(t * (frio ? .18 : .32)) * 150, ay = 420 + Math.sin(t * .5) * 22;
    cardume.forEach((p, i) => {
      const ox = Math.cos(i * 2.4) * (12 + i % 4 * 6), oy = Math.sin(i * 2.4) * (6 + i % 4 * 3);
      p.vx += (ax + ox - p.x) * .003 + Math.sin(t * 3 + p.f) * .03; p.vy += (ay + oy - p.y) * .003;
      const sp = Math.hypot(p.vx, p.vy), max = frio ? .7 : 1.3; if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.vx *= .975; p.vy *= .975; p.x = Math.max(430, Math.min(790, p.x + p.vx)); p.y = Math.max(386, Math.min(462, p.y + p.vy));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx || .01)); ctx.globalAlpha = .9;
      ctx.fillStyle = i % 4 === 0 ? '#E6EEF8' : '#B8CCE0'; ctx.strokeStyle = '#2A4A7A'; ctx.lineWidth = 1;
      const ab = Math.sin(t * 12 + p.f) * 1.6;
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, -3 + ab); ctx.lineTo(-10, 3 + ab); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 6.5, 2.8, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0E1A2A'; ctx.beginPath(); ctx.arc(3.6, -.5, .9, 0, 7); ctx.fill(); ctx.restore();
    });
  });
  let ultB = 0;
  (function vida(t){ if (!vivo) return; if (t - ultB > 1600) { ultB = t; bolhas(sorte(500, 780), 470, 1); } requestAnimationFrame(vida); })(0);
  api.hud('<span class="chip">Galhos na represa: 0/5</span>');
  api.diz('Oi, eu sou o Tico, um castor dos Grandes Lagos! Vou fazer uma represa no riacho. Arraste os galhos até a represa.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 15: De volta para casa, guardiões da água ================= */
function jogoCasa(palco, api){
  semente = 77;
  let vivo = true, fase = 'vaz', consertos = 0, chuvas = 0, chovendo = false, regados = 0, lixos = 0, arvores = 0, ocupado = false, litros = 1287, nivel = 0;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const aberto = { pia:true, banho:true, vaso:true, mang:true };
  const ALVO = { x:348, y:238 }, CANO0 = { x:436, y:352, r:14 }, REG0 = { x:482, y:438 };
  const CANT = [{ x:486, y:388 }, { x:540, y:388 }, { x:594, y:388 }];
  const COVAS = [{ x:674, y:300 }, { x:640, y:402 }, { x:778, y:296 }, { x:788, y:372 }];
  const LIX = [{ x:30, cor:'#E5392C', esc:'#8E1E10', nome:'plástico', cor2:'vermelha' }, { x:66, cor:'#FFC83D', esc:'#A8780A', nome:'metal', cor2:'amarela' }, { x:102, cor:'#2E7BF6', esc:'#12458A', nome:'papel', cor2:'azul' }, { x:138, cor:'#9A6234', esc:'#5A3418', nome:'orgânico', cor2:'marrom' }];
  const LIXO = [{ id:'garrafa', x:236, y:470, b:0 }, { id:'lata', x:404, y:478, b:1 }, { id:'papel', x:530, y:468, b:2 }, { id:'banana', x:178, y:486, b:3 }];
  const roofY = x => x < 10 || x > 352 ? 404 : x <= 180 ? 176 - (x - 10) * 86 / 170 : 90 + (x - 180) * 86 / 170;
  /* desenhos */
  const tufo = (x, y, h, cor) => `<path d="M${x} ${y} q-3 -${(h * .5).toFixed(0)} -6 -${h.toFixed(0)} M${x} ${y} q0 -${(h * .6).toFixed(0)} 1 -${(h * 1.1).toFixed(0)} M${x} ${y} q3 -${(h * .5).toFixed(0)} 7 -${(h * .9).toFixed(0)}" stroke="${cor}"/>`;
  const capim = (n, x0, x1, y0, y1, h0, h1, cor) => Array.from({ length:n }, () => tufo(R(x0, x1).toFixed(0), R(y0, y1).toFixed(0), R(h0, h1), cor)).join('');
  const telhas = (ax, ay, bx, by, linhas, n) => { let d = ''; for (let k = 0; k < linhas; k++) { const o = 4 + k * 4.2, nx = (by - ay), ny = -(bx - ax), L = Math.hypot(nx, ny), sx = nx / L * o * (bx < ax ? -1 : 1), sy = Math.abs(ny / L * o); const x0 = ax + sx, y0 = ay + sy, x1 = bx + sx, y1 = by + sy; d += `M${x0.toFixed(1)} ${y0.toFixed(1)}`; for (let i = 1; i <= n; i++) { const px = x0 + (x1 - x0) * i / n, py = y0 + (y1 - y0) * i / n, mx = x0 + (x1 - x0) * (i - .5) / n, my = y0 + (y1 - y0) * (i - .5) / n + 4.4; d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`; } d += ' '; } return d; };
  /* córrego sinuoso: espinha [x, y, meia-largura] (perspectiva: estreito ao fundo, largo na frente) */
  const f1 = v => v.toFixed(1);
  let sd = 9; const rr = (a, b) => { sd = (sd * 16807) % 2147483647; return a + (b - a) * (sd / 2147483647); };
  const RIO = [[712, 230, 4.5], [725, 252, 8.5], [715, 276, 12.5], [707, 300, 16], [714, 326, 21], [735, 352, 25], [735, 380, 29], [716, 404, 34], [708, 428, 38]];
  const foraRio = (x, y, m) => { const n = RIO.length - 1; let i = 0; while (i < n - 1 && RIO[i + 1][1] < y) i++; const a = RIO[i], b = RIO[i + 1], u = Math.max(0, Math.min(1, (y - a[1]) / (b[1] - a[1]))); return Math.abs(x - (a[0] + (b[0] - a[0]) * u)) > a[2] + (b[2] - a[2]) * u + m; };
  const capimFora = (n, x0, x1, y0, y1, h0, h1, cor) => { let o = '', k = 0; while (k < n) { const x = rr(x0, x1), y = rr(y0, y1); if (foraRio(x, y, 10)) { o += tufo(x.toFixed(0), y.toFixed(0), rr(h0, h1), cor); k++; } } return o; };
  const curva = pts => { let d = ''; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`; } return d; };
  const margemPts = (lado, k, ext) => RIO.map(([x, y, w], i) => [x + lado * (w * k + ext * Math.min(1, w / 14)) + Math.sin(i * 2.3 + lado * 1.7) * w * .1, y]);
  const forma = (k, ext) => { const L = margemPts(-1, k, ext), D = margemPts(1, k, ext).reverse(); return `M${f1(L[0][0])} ${f1(L[0][1] - ext * .3)}${curva(L)} L${f1(D[0][0])} ${f1(D[0][1])}${curva(D)}Z`; };
  const linha = (lado, k, ext) => { const P = margemPts(lado, k, ext); return `M${f1(P[0][0])} ${f1(P[0][1])}${curva(P)}`; };
  const naMargem = (lado, t, ext) => { const n = RIO.length - 1, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i, a = RIO[i], b = RIO[i + 1]; const w = a[2] + (b[2] - a[2]) * u; return [a[0] + (b[0] - a[0]) * u + lado * (w + ext * Math.min(1, w / 14)), a[1] + (b[1] - a[1]) * u, w]; };
  const pedra = (x, y, rx, ry, c1) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${c1 || 'url(#csPedra)'}" stroke="#4E4A44" stroke-width="${f1(Math.max(.7, rx * .14))}"/><path d="M${f1(x - rx * .5)} ${f1(y - ry * .35)} q${f1(rx * .4)} ${f1(-ry * .5)} ${f1(rx * .8)} ${f1(-ry * .2)}" stroke="#F4F0E6" stroke-width="${f1(Math.max(.6, rx * .16))}" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const lamina = (dx, h, w, cor, tinta) => `<path d="M${f1(-w)} 0 Q${f1(dx * .25 - w * .6)} ${f1(-h * .55)} ${f1(dx)} ${f1(-h)} Q${f1(dx * .25 + w * .6)} ${f1(-h * .5)} ${f1(w)} 0Z" fill="${cor}" stroke="${tinta}" stroke-width=".9" stroke-linejoin="round"/>`;
  const taboa = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${lamina(-16, 30, 2.4, '#5E9A3A', '#2E5A1A')}${lamina(14, 26, 2.2, '#4E8A2E', '#2E5A1A')}<path d="M-1 0 Q-2 -24 -2 -44 M3 0 Q4 -20 6 -36" stroke="#3E6A22" stroke-width="1.8" fill="none"/><rect x="-4.6" y="-46" width="5.4" height="13" rx="2.7" fill="#8A5428" stroke="#3E2410" stroke-width="1"/><rect x="3.4" y="-38" width="5" height="11" rx="2.5" fill="#7A4A22" stroke="#3E2410" stroke-width="1"/><path d="M-3 -43 v7 M5 -35 v6" stroke="#C88A50" stroke-width="1" stroke-linecap="round"/>${lamina(-4, 40, 2.4, '#7CC24A', '#2E5A1A')}${lamina(8, 22, 2, '#8ED25A', '#3E7A2A')}</g>`;
  const samambaia = (x, y, s, v) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s * (v || 1)} ${s})">${[[-24, -14], [-10, -26], [6, -28], [20, -16]].map(([ex, ey], j) => { const pts = Array.from({ length:6 }, (_, q) => { const t = (q + 1) / 7, px = ex * t, py = ey * t - Math.sin(t * Math.PI) * 6; return `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(4.2 - t * 2.4)}" ry="1.8" fill="${j % 2 ? '#4EA850' : '#3E9448'}" stroke="#1E5A2A" stroke-width=".6" transform="rotate(${f1(Math.atan2(ey, ex) * 57.3 + 90)} ${f1(px)} ${f1(py)})"/>`; }).join(''); return `<path d="M0 0 Q${f1(ex * .4)} ${f1(ey * .7 - 6)} ${ex} ${ey}" stroke="#2E6A2A" stroke-width="1.4" fill="none"/>${pts}`; }).join('')}</g>`;
  const florzinha = (x, y, r, cor, tinta, miolo) => `<g transform="translate(${f1(x)} ${f1(y)})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${f1(-r * .7)}" rx="${f1(r * .45)}" ry="${f1(r * .7)}" fill="${cor}" stroke="${tinta}" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="${f1(r * .38)}" fill="${miolo || '#FFC83D'}" stroke="${tinta}" stroke-width=".5"/></g>`;
  const casinha = (x, y, w, h, par, tel, and, k) => { const tinta = '#8A7A68', hw = w / 2; let jan = ''; for (let a = 0; a < and; a++) for (let j = 0; j < Math.max(1, Math.round(w / 9)); j++) { const nx = Math.max(1, Math.round(w / 9)), jx = x - hw + (j + .5) * w / nx - 2; jan += `<rect x="${f1(jx)}" y="${f1(y - h + 3 + a * (h / and))}" width="4" height="${f1(Math.min(4.6, h / and - 3))}" fill="#8EB4D2" stroke="${tinta}" stroke-width=".4"/>`; }
    return `<g opacity="${k}"><rect x="${f1(x - hw)}" y="${f1(y - h)}" width="${w}" height="${h}" fill="${par}" stroke="${tinta}" stroke-width=".8"/><rect x="${f1(x - hw)}" y="${f1(y - h)}" width="${f1(w * .3)}" height="${h}" fill="#5A4A3A" opacity=".1"/>${jan}<path d="M${f1(x - hw - 2.5)} ${f1(y - h)} L${f1(x)} ${f1(y - h - w * .36)} L${f1(x + hw + 2.5)} ${f1(y - h)}Z" fill="${tel}" stroke="#7A2E14" stroke-width=".8" stroke-linejoin="round"/><path d="M${f1(x - hw * .5)} ${f1(y - h - w * .19)} H${f1(x + hw * .5)}" stroke="#fff" stroke-width=".5" opacity=".35"/></g>`; };
  const arvore = (x, y, r, c1, c2) => `<path d="M${x} ${y} V${f1(y - r)}" stroke="#6E5A44" stroke-width="1.6"/><path d="${copa(x, y - r * 1.3, r, r * .8, 8)}" fill="${c1}" stroke="${c2}" stroke-width=".9"/><path d="M${f1(x - r * .5)} ${f1(y - r * 1.6)} q${f1(r * .4)} ${f1(-r * .3)} ${f1(r * .8)} 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".35"/>`;
  const sabia = `<path d="M-8 -6 L-24 5 L-19 8 L-3 -1Z" fill="#7A6246" stroke="#3E2E1A" stroke-width="1.1" stroke-linejoin="round"/><path d="M-12 -8 C-12 -19 -4 -25 4 -25 C12 -25 17 -17 16 -9 C15 -2 8 2 0 2 C-6 2 -11 -2 -12 -8Z" fill="#8E7658" stroke="#3E2E1A" stroke-width="1.3"/><path d="M2 -15 C10 -17 16 -11 16 -7 C15 -1 8 2 2 1 C-1 -4 -1 -10 2 -15Z" fill="#EE8C3E" stroke="#8A3E14" stroke-width="1"/><path d="M-10 -9 C-9 -16 -2 -19 5 -17 C3 -12 -2 -8 -10 -6Z" fill="#6E5A3E" stroke="#3E2E1A" stroke-width=".8"/><circle cx="10" cy="-26" r="7.6" fill="#9A8264" stroke="#3E2E1A" stroke-width="1.3"/><path d="M12 -21 C15 -20 17 -17 16 -14 C14 -15 12 -17 11 -19Z" fill="#F4E8D2"/><path d="M16.5 -28.5 L25 -26 L16.5 -23.5Z" fill="#E8C24A" stroke="#8A6A10" stroke-width=".9" stroke-linejoin="round"/><circle cx="13" cy="-27.4" r="2.4" fill="#2A1A0E" stroke="#E8B84A" stroke-width="1"/><circle cx="13.8" cy="-28.2" r=".8" fill="#fff"/><path d="M-2 2 l-1 4 M3 2 l1 4" stroke="#6E6A66" stroke-width="1.5" stroke-linecap="round"/>`;
  const bemtevi = `<path d="M-8 -6 L-22 6 L-17 8 L-3 -1Z" fill="#7A5A3A" stroke="#3E2A16" stroke-width="1.1" stroke-linejoin="round"/><path d="M-12 -8 C-12 -19 -4 -25 4 -25 C12 -25 17 -17 16 -9 C15 -2 8 2 0 2 C-6 2 -11 -2 -12 -8Z" fill="#9A744A" stroke="#3E2A16" stroke-width="1.3"/><path d="M1 -16 C10 -18 16 -11 16 -7 C15 -1 8 2 1 1 C-2 -4 -2 -11 1 -16Z" fill="#FFD43A" stroke="#A8740A" stroke-width="1"/><path d="M-10 -9 C-9 -16 -2 -19 5 -17 C3 -12 -2 -8 -10 -6Z" fill="#8A6038" stroke="#3E2A16" stroke-width=".8"/><circle cx="10" cy="-26" r="7.6" fill="#24201E" stroke="#000" stroke-width="1.1"/><path d="M3 -28 C6 -32 14 -34 19 -29 C14 -30 9 -29 4 -26Z" fill="#fff"/><path d="M7 -33 q3 -2 6 0" stroke="#FFD43A" stroke-width="1.6" stroke-linecap="round"/><path d="M10 -21 C13 -19 16 -19 17 -21 C17 -17 14 -16 11 -18Z" fill="#fff"/><path d="M17 -28 L26 -26 L17 -23.4Z" fill="#1E1A18" stroke="#000" stroke-width=".8" stroke-linejoin="round"/><circle cx="13.6" cy="-25.6" r="2.4" fill="#fff"/><circle cx="14" cy="-25.4" r="1.5" fill="#12121A"/><circle cx="14.5" cy="-26" r=".5" fill="#fff"/><path d="M-2 2 l-1 4 M3 2 l1 4" stroke="#3E3836" stroke-width="1.5" stroke-linecap="round"/>`;
  const nota = (x, y, cor) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-10 L7 -12 V-2" stroke="${cor}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="-2" cy="0" rx="2.8" ry="2" fill="${cor}"/><ellipse cx="5" cy="-2" rx="2.8" ry="2" fill="${cor}"/></g>`;
  const pecaCano = `<rect x="-7" y="-46" width="14" height="92" rx="2" fill="url(#csCano)" stroke="#4E5A6E" stroke-width="1.8"/><rect x="-9" y="-46" width="18" height="7" rx="2" fill="url(#csCano)" stroke="#4E5A6E" stroke-width="1.6"/><rect x="-9" y="39" width="18" height="7" rx="2" fill="url(#csCano)" stroke="#4E5A6E" stroke-width="1.6"/><path d="M-3 -36 V36" stroke="#F2F6FA" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`;
  const muda = `<path d="M0 0 V-12" stroke="#4E8A2E" stroke-width="2.2" stroke-linecap="round"/><path d="M0 -8 C-7 -10 -9 -15 -8 -18 C-2 -17 0 -13 0 -8Z M0 -11 C6 -13 9 -18 8 -21 C2 -20 0 -16 0 -11Z" fill="#7CCB5A" stroke="#2E6A22" stroke-width="1"/>`;
  const alface = (x, y, r) => `<path d="${copa(x, y, r, r * .62, 9, .3)}" fill="#5EB84A" stroke="#2E6A22" stroke-width="1.3"/><path d="${copa(x, y - r * .18, r * .72, r * .46, 8, .3)}" fill="#8ED866" stroke="#3E7A2A" stroke-width="1"/><path d="${copa(x, y - r * .32, r * .4, r * .28, 7, .3)}" fill="#C2F08A" stroke="#4E8A2A" stroke-width=".8"/>`;
  const cenoura = (x, y) => `<path d="M${x} ${y} q-6 -10 -4 -18 M${x} ${y} q0 -12 3 -21 M${x} ${y} q6 -8 9 -16" stroke="#3E9A3A" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-6 -10 -4 -18 M${x} ${y} q6 -8 9 -16" stroke="#8ED866" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M${x - 5} ${y - 1} C${x - 5} ${y + 5} ${x + 5} ${y + 5} ${x + 5} ${y - 1}Z" fill="#FF8A2A" stroke="#A8480E" stroke-width="1.1"/>`;
  const tomateiro = (x, y) => `<path d="M${x + 10} ${y} V${y - 56}" stroke="#8A6A3E" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y} C${x - 2} ${y - 20} ${x + 10} ${y - 34} ${x + 6} ${y - 52} M${x} ${y - 16} C${x - 12} ${y - 22} ${x - 16} ${y - 32} ${x - 12} ${y - 40} M${x + 4} ${y - 30} C${x + 16} ${y - 34} ${x + 20} ${y - 42} ${x + 18} ${y - 50}" stroke="#3E8A2A" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#4EA83A" stroke="#2E6A22" stroke-width="1">${[[x - 12, y - 40], [x + 18, y - 48], [x + 6, y - 52], [x - 6, y - 24], [x + 14, y - 30]].map(([a, b]) => `<path d="M${a} ${b} c-7 -2 -11 2 -11 6 c7 1 10 -2 11 -6Z"/>`).join('')}</g>${[[x - 10, y - 30, 5], [x + 2, y - 38, 5.4], [x + 18, y - 38, 4.6], [x - 2, y - 14, 5]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#E5392C" stroke="#8E1E10" stroke-width="1.1"/><circle cx="${(a - r * .35).toFixed(1)}" cy="${(b - r * .35).toFixed(1)}" r="${(r * .3).toFixed(1)}" fill="#FFB0A0"/><path d="M${a - 2} ${b - r + .5} l2 -2 l2 2" stroke="#2E7A2A" stroke-width="1.2" fill="none"/>`).join('')}`;
  const ARV = [
    `<path d="M0 0 C-2 -14 2 -26 0 -40 M0 -24 C6 -30 12 -34 16 -42 M0 -28 C-6 -34 -12 -36 -16 -42" stroke="#4E3420" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M0 0 C-2 -14 2 -26 0 -40" stroke="#8A6A4A" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="${copa(-14, -50, 18, 13, 9)}" fill="#2E8A42" stroke="#1A5A2A" stroke-width="1.6"/><path d="${copa(14, -52, 18, 13, 9)}" fill="#2E8A42" stroke="#1A5A2A" stroke-width="1.6"/><path d="${copa(0, -62, 22, 15, 10)}" fill="#46A852" stroke="#1A5A2A" stroke-width="1.6"/>${textura(0, -56, 26, 12, 9, '#1E6A32', 1.3)}<path d="M-12 -68 q10 -7 22 -4" stroke="#B8EAA0" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    `<path d="M0 0 C1 -20 -2 -40 2 -64" stroke="#8A8270" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M0 0 C1 -20 -2 -40 2 -64" stroke="#E8E2D0" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-1 -16 h4 M0 -32 h4 M0 -48 h4" stroke="#8A8270" stroke-width="1.2"/>${[[-16, -66, -20], [16, -68, 20], [0, -80, 0], [-12, -52, -40], [14, -54, 40]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})">${[-56, -28, 0, 28, 56].map(b => `<path d="M0 0 L${(Math.sin(b * Math.PI / 180) * 14).toFixed(1)} ${(-Math.cos(b * Math.PI / 180) * 14).toFixed(1)}" stroke="#4E7A5E" stroke-width="7.4" stroke-linecap="round"/><path d="M0 0 L${(Math.sin(b * Math.PI / 180) * 14).toFixed(1)} ${(-Math.cos(b * Math.PI / 180) * 14).toFixed(1)}" stroke="#A8D2B4" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`).join('')}<path d="M2 -64 L-16 -66 M2 -64 L16 -68 M2 -64 L0 -80" stroke="#8A8270" stroke-width="1.6"/>`,
    `<path d="M0 0 C-2 -16 3 -28 0 -42 M0 -26 C8 -32 12 -38 16 -46 M0 -30 C-8 -34 -12 -40 -14 -48" stroke="#3E2A1A" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="M0 0 C-2 -16 3 -28 0 -42" stroke="#7A5A3A" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="${copa(-12, -54, 17, 12, 9, .35)}" fill="#F2B312" stroke="#A8740A" stroke-width="1.5"/><path d="${copa(13, -55, 17, 12, 9, .35)}" fill="#F2B312" stroke="#A8740A" stroke-width="1.5"/><path d="${copa(0, -64, 20, 13, 10, .35)}" fill="#FFD447" stroke="#A8740A" stroke-width="1.5"/><g fill="#FFF0A0">${Array.from({ length:10 }, () => `<circle cx="${R(-26, 26).toFixed(0)}" cy="${R(-72, -48).toFixed(0)}" r="1.8"/>`).join('')}</g><path d="M-10 -70 q8 -6 18 -4" stroke="#FFF6C8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    `<path d="M0 0 C2 -24 -2 -48 1 -70" stroke="#6E6252" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M0 0 C2 -24 -2 -48 1 -70" stroke="#A89A84" stroke-width="4" fill="none" stroke-linecap="round"/><g stroke="#6E6252" stroke-width="1">${[-10, -20, -30, -40, -50, -60].map(y => `<path d="M-2.4 ${y} h5"/>`).join('')}</g>${[[-34, 6], [-22, -8], [-6, -16], [12, -14], [28, -4], [34, 10], [-30, 16]].map(([x, y]) => `<path d="M1 -70 Q${(x * .5).toFixed(0)} ${-90 + y * .4} ${x} ${-70 + y + 10}" stroke="#2E6A22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M1 -70 Q${(x * .5).toFixed(0)} ${-90 + y * .4} ${x} ${-70 + y + 10}" stroke="#6EC24A" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="3 1.4"/>`).join('')}<g fill="#FF9A2A" stroke="#A8540E" stroke-width=".7">${[[-3, -64], [2, -62], [-1, -60], [4, -66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>`
  ];
  const desenhoLixo = {
    garrafa:'<g transform="rotate(-70)"><path d="M-7 -18 h14 v5 C11 -9 13 -5 13 2 V18 C13 22 9 23 0 23 C-9 23 -13 22 -13 18 V2 C-13 -5 -11 -9 -7 -13Z" fill="#B8EEE0" fill-opacity=".85" stroke="#3E8A7A" stroke-width="1.7"/><rect x="-5.4" y="-25" width="10.8" height="8" rx="2" fill="#2E7BF6" stroke="#12458A" stroke-width="1.3"/><rect x="-13" y="2" width="26" height="9" fill="#FF8A5A" stroke="#B84A20" stroke-width="1.1"/><path d="M-7 -5 V17" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/></g>',
    lata:'<g transform="rotate(-14)"><rect x="-17" y="-10" width="34" height="20" rx="4" fill="#C9CED8" stroke="#5A6070" stroke-width="1.7"/><rect x="-6" y="-10" width="12" height="20" fill="#22A565"/><ellipse cx="17" cy="0" rx="3.6" ry="10" fill="#E9EEF6" stroke="#5A6070" stroke-width="1.3"/><path d="M-13 -6 H12" stroke="#fff" stroke-width="2" opacity=".75" stroke-linecap="round"/><path d="M-6 3 l4 -3 l3 3" stroke="#0E6A3A" stroke-width="1" fill="none"/></g>',
    papel:'<path d="M-15 -9 L-4 -14 L8 -12 L16 -4 L14 8 L4 14 L-10 12 L-16 3Z" fill="#F2EFE6" stroke="#8A8478" stroke-width="1.6" stroke-linejoin="round"/><path d="M-10 -5 L6 -8 M-11 0 L10 -2 M-9 5 L8 4 M-4 -12 L-1 10 M6 -11 L4 11" stroke="#A8A294" stroke-width="1" fill="none"/><path d="M-12 -2 L-4 -4 L-6 4Z" fill="#C9C4B8"/>',
    banana:'<g transform="rotate(10)"><path d="M-2 -4 C-12 -6 -20 0 -22 8 C-14 4 -8 2 -2 2Z" fill="#FFD43A" stroke="#A8740A" stroke-width="1.4" stroke-linejoin="round"/><path d="M2 -4 C12 -8 20 -4 22 4 C14 2 8 0 2 2Z" fill="#F2C21E" stroke="#A8740A" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 2 C-6 8 -4 14 0 16 C4 12 4 6 2 2Z" fill="#FFE27A" stroke="#A8740A" stroke-width="1.3"/><path d="M-4 -6 h8 v4 h-8Z" fill="#8A6A2A" stroke="#4E3A14" stroke-width="1"/><circle cx="-20" cy="7" r="1.6" fill="#5E3A14"/><circle cx="21" cy="3" r="1.6" fill="#5E3A14"/><path d="M-14 0 l2 1 M12 -3 l2 1" stroke="#8A6A2A" stroke-width="1"/></g>'
  };
  const icone = ['<path d="M-4 -26 h8 v3 C6 -21 7 -19 7 -15 V-7 C7 -6 5 -5 0 -5 C-5 -5 -7 -6 -7 -7 V-15 C-7 -19 -6 -21 -4 -23Z" fill="#fff"/>', '<rect x="-6" y="-24" width="12" height="17" rx="2" fill="#fff"/><path d="M-6 -20 h12 M-6 -11 h12" stroke="#FFC83D" stroke-width="1.2"/>', '<path d="M-7 -24 h10 l4 4 v15 h-14Z" fill="#fff"/><path d="M-4 -18 h8 M-4 -14 h8 M-4 -10 h6" stroke="#2E7BF6" stroke-width="1.2"/>', '<path d="M0 -6 C-8 -6 -8 -18 -3 -20 C-1 -21 1 -21 3 -20 C8 -18 8 -6 0 -6Z" fill="#fff"/><path d="M0 -20 c0 -3 2 -5 4 -5" stroke="#fff" stroke-width="1.6" fill="none"/>'];
  const crianca = (x, pele, camisa, capacete, roda) => `<g transform="translate(${x} 0)"><circle cx="-15" cy="-10" r="9.5" fill="none" stroke="#2E3440" stroke-width="2.6"/><circle cx="15" cy="-10" r="9.5" fill="none" stroke="#2E3440" stroke-width="2.6"/><g class="cs-raio"><path d="M-15 -19 V-1 M-24 -10 H-6 M15 -19 V-1 M6 -10 H24" stroke="#9AA6B8" stroke-width=".9"/></g><path d="M-15 -10 L-4 -26 L10 -26 L15 -10 M-4 -26 L1 -10 L10 -26 M-15 -10 H1" stroke="${roda}" stroke-width="2.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M10 -26 L8 -32 M5 -32 h7" stroke="#2E3440" stroke-width="2.2" stroke-linecap="round"/><path d="M-7 -28 h7" stroke="#2E3440" stroke-width="3" stroke-linecap="round"/><path d="M-4 -28 L0 -14 L2 -10" stroke="#3E4A7A" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-5 -29 C-6 -38 -2 -44 3 -44 C7 -42 7 -36 6 -30Z" fill="${camisa}" stroke="#12235A" stroke-width="1.1"/><path d="M4 -40 L10 -32" stroke="${pele}" stroke-width="3.4" stroke-linecap="round"/><circle cx="4" cy="-50" r="6" fill="${pele}" stroke="#12235A" stroke-width="1"/><path d="M-3 -51 C-3 -59 11 -59 11 -51Z" fill="${capacete}" stroke="#12235A" stroke-width="1"/><circle cx="7" cy="-49.5" r="1" fill="#12121A"/><path d="M6 -46 q2 1 3 -1" stroke="#6E3E1A" stroke-width=".9" fill="none"/></g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Uma casa de cidade do interior por dentro, com cisterna, horta, muro com gato, ipê-roxo, rua com bueiro e um córrego">
    <defs>
      <linearGradient id="csCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58B2F0"/><stop offset=".62" stop-color="#B8E2FA"/><stop offset="1" stop-color="#FFEFD2"/></linearGradient>
      <radialGradient id="csSolG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".55" stop-color="#FFC83D"/><stop offset="1" stop-color="#F0A81E"/></radialGradient>
      <linearGradient id="csMorro1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8DCD2"/><stop offset="1" stop-color="#B2D0BE"/></linearGradient>
      <linearGradient id="csMorro2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4D89A"/><stop offset="1" stop-color="#94C47A"/></linearGradient>
      <linearGradient id="csTelha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F28650"/><stop offset="1" stop-color="#C24A1E"/></linearGradient>
      <linearGradient id="csParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEAC0"/><stop offset="1" stop-color="#F2CF8E"/></linearGradient>
      <linearGradient id="csSotao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4A2E"/><stop offset="1" stop-color="#9A6E48"/></linearGradient>
      <linearGradient id="csBanho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8F8FA"/><stop offset="1" stop-color="#C6E8EE"/></linearGradient>
      <linearGradient id="csCoz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E2"/><stop offset="1" stop-color="#FCE0B4"/></linearGradient>
      <pattern id="csAzulejo" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#BFE6F2"/><rect x=".8" y=".8" width="12.4" height="12.4" rx="1.4" fill="#E2F6FA"/><path d="M3 4 q2 -2 4 0" stroke="#fff" stroke-width="1.2" fill="none"/></pattern>
      <pattern id="csLadrilho" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#E5603C"/><rect width="8" height="8" fill="#F2EDE2"/><rect x="8" y="8" width="8" height="8" fill="#F2EDE2"/></pattern>
      <linearGradient id="csJanela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC6F2"/><stop offset="1" stop-color="#DDF2FC"/></linearGradient>
      <linearGradient id="csGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED86C"/><stop offset="1" stop-color="#64AC40"/></linearGradient>
      <linearGradient id="csBarranco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B6DC84"/><stop offset="1" stop-color="#7CB858"/></linearGradient>
      <linearGradient id="csMuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6F2E4"/><stop offset=".7" stop-color="#E4DCC6"/><stop offset="1" stop-color="#CFC4A8"/></linearGradient><pattern id="csTijolo" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#B8583A"/><rect x=".6" y=".6" width="14.8" height="3" rx=".6" fill="#D2704A"/><rect x="-7.4" y="4.6" width="14.8" height="3" rx=".6" fill="#C8643E"/><rect x="8.6" y="4.6" width="14.8" height="3" rx=".6" fill="#DA7A52"/></pattern><linearGradient id="csCapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2865A"/><stop offset="1" stop-color="#B8401C"/></linearGradient><pattern id="csSolo" width="22" height="12" patternUnits="userSpaceOnUse"><rect width="22" height="12" fill="#5E3A1E"/><circle cx="4" cy="3" r="1.6" fill="#7A4E2A"/><circle cx="14" cy="7" r="2" fill="#4A2C14"/><circle cx="18" cy="2" r="1" fill="#8A5E36"/><circle cx="8" cy="9" r="1.2" fill="#8A5E36"/><path d="M10 3 l3 1" stroke="#C8A060" stroke-width=".8"/></pattern>
      <linearGradient id="csCalcada" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#5A5248" stop-opacity=".18"/></linearGradient><pattern id="csPiso" width="24" height="11" patternUnits="userSpaceOnUse"><rect width="24" height="11" fill="#B8B0A2"/><rect x=".7" y=".7" width="10.6" height="9.6" rx="1.2" fill="#E2DCD0"/><rect x="12.7" y=".7" width="10.6" height="9.6" rx="1.2" fill="#D6CFC2"/><path d="M2 2.4 h7 M14 2.4 h7" stroke="#F4F0E8" stroke-width=".9"/></pattern><linearGradient id="csGuia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9C4BA"/><stop offset="1" stop-color="#8E897E"/></linearGradient><linearGradient id="csSarjetaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A968E"/><stop offset=".3" stop-color="#BDB9B0"/><stop offset="1" stop-color="#A8A49B"/></linearGradient>
      <linearGradient id="csRua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E5360"/><stop offset=".25" stop-color="#626875"/><stop offset="1" stop-color="#4A4F5C"/></linearGradient><pattern id="csAsfalto" width="40" height="30" patternUnits="userSpaceOnUse"><circle cx="24.9" cy="22.3" r="1.0" fill="#7A808C"/><circle cx="33.6" cy="23.3" r="0.6" fill="#7A808C"/><circle cx="36.0" cy="3.4" r="0.7" fill="#3A3E48"/><circle cx="15.2" cy="3.1" r="0.6" fill="#3A3E48"/><circle cx="16.3" cy="5.5" r="1.0" fill="#2E323A"/><circle cx="6.4" cy="23.9" r="0.5" fill="#2E323A"/><circle cx="5.1" cy="0.1" r="1.0" fill="#3A3E48"/><circle cx="30.9" cy="28.8" r="0.5" fill="#3A3E48"/><circle cx="11.6" cy="28.8" r="0.8" fill="#3A3E48"/><circle cx="7.3" cy="29.1" r="0.5" fill="#2E323A"/><circle cx="12.0" cy="10.8" r="0.5" fill="#3A3E48"/><circle cx="10.6" cy="10.0" r="1.0" fill="#7A808C"/><circle cx="23.8" cy="21.2" r="0.4" fill="#8E94A0"/><circle cx="32.7" cy="14.4" r="0.6" fill="#2E323A"/><circle cx="18.9" cy="5.3" r="0.6" fill="#7A808C"/><circle cx="38.0" cy="10.7" r="0.7" fill="#2E323A"/><circle cx="14.6" cy="17.4" r="0.4" fill="#7A808C"/><circle cx="28.3" cy="18.7" r="1.1" fill="#7A808C"/><circle cx="30.2" cy="27.9" r="1.1" fill="#8E94A0"/><circle cx="20.5" cy="26.8" r="0.6" fill="#2E323A"/><circle cx="4.3" cy="22.5" r="1.0" fill="#8E94A0"/><circle cx="1.5" cy="28.4" r="0.5" fill="#8E94A0"/><circle cx="20.5" cy="10.9" r="0.5" fill="#8E94A0"/><circle cx="37.0" cy="16.4" r="0.6" fill="#8E94A0"/><circle cx="12.2" cy="24.0" r="0.8" fill="#8E94A0"/><circle cx="39.9" cy="4.8" r="0.4" fill="#2E323A"/><circle cx="1.3" cy="22.2" r="0.6" fill="#8E94A0"/><circle cx="18.2" cy="12.7" r="0.4" fill="#7A808C"/><circle cx="32.1" cy="10.0" r="0.5" fill="#3A3E48"/><circle cx="25.2" cy="23.6" r="0.5" fill="#2E323A"/><circle cx="14.9" cy="1.8" r="0.7" fill="#3A3E48"/><circle cx="18.1" cy="30.0" r="1.0" fill="#2E323A"/><circle cx="38.4" cy="20.7" r="0.6" fill="#8E94A0"/><circle cx="11.6" cy="12.1" r="0.5" fill="#2E323A"/></pattern>
      <linearGradient id="csCano" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A96AA"/><stop offset=".4" stop-color="#DDE4EE"/><stop offset="1" stop-color="#7A869A"/></linearGradient>
      <linearGradient id="csCis" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0E4A9E"/><stop offset=".18" stop-color="#3C9CF2"/><stop offset=".3" stop-color="#7CC8FF"/><stop offset=".45" stop-color="#3A92EE"/><stop offset=".8" stop-color="#1A62C2"/><stop offset="1" stop-color="#0C3A80"/></linearGradient>
      <linearGradient id="csAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ED8FF"/><stop offset="1" stop-color="#2E7BF6"/></linearGradient>
      <linearGradient id="csRio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2ECFA"/><stop offset=".3" stop-color="#6CC2EC"/><stop offset=".75" stop-color="#2F8AD6"/><stop offset="1" stop-color="#2070BE"/></linearGradient><filter id="csBorra" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="3"/></filter><radialGradient id="csPedra" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#E2DCD0"/><stop offset=".55" stop-color="#ABA494"/><stop offset="1" stop-color="#76705F"/></radialGradient><radialGradient id="csPedra2" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#D8D6C8"/><stop offset=".55" stop-color="#9AA08E"/><stop offset="1" stop-color="#5E6A56"/></radialGradient><linearGradient id="csBeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2B080"/><stop offset="1" stop-color="#8A7448"/></linearGradient><linearGradient id="csErosao" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6234"/><stop offset=".5" stop-color="#C08A50"/><stop offset="1" stop-color="#9A6234"/></linearGradient><linearGradient id="csSerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8C8E2"/><stop offset="1" stop-color="#D6E2EE"/></linearGradient><radialGradient id="csTampa" cx=".4" cy=".2" r=".9"><stop offset="0" stop-color="#7CC6FF"/><stop offset=".5" stop-color="#2E86E6"/><stop offset="1" stop-color="#124E9E"/></radialGradient><linearGradient id="csConcreto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2DED4"/><stop offset="1" stop-color="#A8A296"/></linearGradient><linearGradient id="csTeto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A1A" stop-opacity=".22"/><stop offset="1" stop-color="#5A3A1A" stop-opacity="0"/></linearGradient><pattern id="csPapel" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M9 3 l2 3 l-2 3 l-2 -3Z" fill="#F2B87A" opacity=".45"/><circle cx="0" cy="12" r="1.2" fill="#E8A06A" opacity=".4"/><circle cx="18" cy="12" r="1.2" fill="#E8A06A" opacity=".4"/></pattern><linearGradient id="csMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE48A"/><stop offset=".5" stop-color="#D8A030"/><stop offset="1" stop-color="#8A5A10"/></linearGradient>
      <linearGradient id="csLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2B07A"/><stop offset=".45" stop-color="#A88050"/><stop offset="1" stop-color="#7E5A30"/></linearGradient>
      <linearGradient id="csMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C88A50"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
      <linearGradient id="csTerra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4E2E"/><stop offset="1" stop-color="#4E2E18"/></linearGradient>
      <linearGradient id="csReg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1FA36A"/><stop offset=".4" stop-color="#5AD69A"/><stop offset="1" stop-color="#128A54"/></linearGradient>
      <linearGradient id="csVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#E6F6FF" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".7"/></linearGradient>
      <radialGradient id="csIpe" cx=".42" cy=".36" r=".7"><stop offset="0" stop-color="#E8C8FA"/><stop offset=".55" stop-color="#C084E6"/><stop offset="1" stop-color="#8A48BE"/></radialGradient>
      <linearGradient id="csLouca" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D8E2EE"/><stop offset=".4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C2CEDC"/></linearGradient>
      <linearGradient id="csBarro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8542A"/><stop offset=".4" stop-color="#E08A5A"/><stop offset="1" stop-color="#94461E"/></linearGradient>
      <linearGradient id="csNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#FFF6E6" stop-opacity=".7"/></linearGradient>
      <clipPath id="csCisClip"><rect x="381" y="318" width="20" height="78" rx="4"/></clipPath>
      <radialGradient id="csVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#2A1A0A" stop-opacity="0"/><stop offset="1" stop-color="#2A1A0A" stop-opacity=".34"/></radialGradient>
      <filter id="csGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .065 0"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#csCeu)"/>
    <g id="cs-sol" class="toque"><circle cx="560" cy="58" r="52" fill="#FFE27A" opacity=".25"/><circle cx="560" cy="58" r="38" fill="#FFE27A" opacity=".3"/><circle cx="560" cy="58" r="25" fill="url(#csSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M546 48 q8 -9 20 -9" stroke="#FFF6C8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="560" cy="58" r="48" fill="transparent"/></g>
    <g class="deriva"><use href="#nuvem" x="380" y="30" width="96" height="46" style="color:#fff" opacity=".92"/><use href="#nuvem" x="660" y="70" width="70" height="34" style="color:#fff" opacity=".75"/></g>
    <path d="M0 176 C60 160 110 168 170 150 C230 134 280 160 340 150 C400 140 440 158 500 150 C560 140 620 160 680 146 C720 136 770 150 800 144 V230 H0Z" fill="url(#csSerra)" stroke="#A8B8D2" stroke-width="1.2"/><path d="M170 150 C200 142 220 146 240 152 M500 150 C520 146 540 147 560 152 M680 146 C700 140 720 141 740 146" stroke="#EEF4FA" stroke-width="2" fill="none" opacity=".8"/><rect x="0" y="150" width="800" height="70" fill="url(#csNevoa)" opacity=".7"/>
    <path d="M0 200 C60 190 120 196 180 186 C240 180 290 196 330 222 C380 196 430 204 480 194 C540 184 600 198 650 190 C710 182 760 194 800 188 V260 H330Z" fill="url(#csMorro1)" stroke="#A2C2B0" stroke-width="1.4"/>
    <g fill="#A6C8B4">${[[360, 214], [520, 196], [742, 190]].map(([x, y]) => `<path d="${copa(x, y, 16, 8, 8)}"/>`).join('')}</g>
    <g transform="translate(408 210)" fill="#E2DCEE" stroke="#ABA2C2" stroke-width="1.1"><path d="M-14 22 V-2 L0 -12 L14 -2 V22Z"/><path d="M-6 -6 V-34 L0 -46 L6 -34 V-6Z"/><path d="M0 -46 V-54 M-3 -51 h6" stroke-width="1.4"/><path d="M-3 -30 C-3 -34 3 -34 3 -30 V-24 H-3Z" fill="#B8B0D0"/><path d="M-4 22 V12 C-4 7 4 7 4 12 V22Z" fill="#B8B0D0"/></g>
    <g transform="translate(762 196)" fill="#DCE4EE" stroke="#A2AEC2" stroke-width="1.1"><path d="M-8 30 L-4 -4 M8 30 L4 -4 M-6 14 H6 M-7 22 H7" fill="none"/><path d="M-14 -4 H14 V-20 C14 -26 -14 -26 -14 -20Z"/><path d="M-14 -12 H14" opacity=".6"/></g>
    <g>${[[372, 214, 14, 8, '#F4ECE0', '#D8846A', 1], [392, 212, 10, 7, '#E6EEF4', '#C8705A', 1], [440, 206, 12, 14, '#ECE6F2', '#B8705A', 2], [458, 206, 10, 8, '#F8EEDA', '#D8846A', 1], [530, 200, 18, 20, '#E8EEF2', '#A8806A', 3], [552, 200, 10, 8, '#F4ECE0', '#C8705A', 1], [606, 202, 12, 9, '#F6E8E0', '#D8846A', 1], [622, 200, 14, 22, '#E2E8EE', '#9A8A7A', 4], [690, 202, 12, 8, '#F4ECE0', '#C8705A', 1], [736, 200, 10, 7, '#E6EEF4', '#D8846A', 1], [784, 200, 14, 9, '#F8EEDA', '#C8705A', 1]].map(([x, y, w, h, p, t, a]) => casinha(x, y, w, h, p, t, a, .62)).join('')}${[[384, 214, 5, '#9CBCA4', '#7E9E88'], [470, 206, 6, '#A8C4A0', '#86A482'], [586, 202, 5, '#94B6AC', '#78988E'], [714, 204, 6, '#B2C49A', '#90A47A'], [762, 202, 5, '#9CBCA4', '#7E9E88']].map(([x, y, r, a, b]) => arvore(x, y, r, a, b)).join('')}</g>
    <path d="M0 214 C80 206 160 214 240 206 C290 202 310 226 330 234 C390 222 450 228 520 220 C600 212 680 222 800 214 V280 H330Z" fill="url(#csMorro2)" stroke="#86B46A" stroke-width="1.6"/>
    <g stroke="#A6D07E" stroke-width="1.4" opacity=".7">${Array.from({ length:22 }, (_, i) => `<path d="M${640 + i * 7} ${226 - i * .1} l-8 30"/>`).join('')}</g>
    <g>${[[352, 240, 20, 12, '#F6EADA', '#D2633F', 1], [378, 242, 16, 10, '#E2F0F6', '#B8501E', 1], [398, 240, 14, 18, '#FFF0C8', '#C24A1E', 2], [466, 234, 18, 12, '#F0E6FA', '#D2633F', 1], [492, 236, 22, 20, '#FFE6D6', '#A8401E', 2], [520, 232, 16, 11, '#E6F4E2', '#C24A1E', 1], [640, 232, 22, 13, '#FFF0D0', '#B8501E', 1], [666, 234, 16, 20, '#E8F2F8', '#C24A1E', 2], [756, 230, 18, 12, '#FCE6EE', '#D2633F', 1], [782, 232, 16, 18, '#FFF0C8', '#B8501E', 2]].map(([x, y, w, h, p, t, a]) => casinha(x, y, w, h, p, t, a, .92)).join('')}${[[364, 242, 7, '#5E9E5A', '#3E7A3E'], [430, 238, 8, '#8AB84E', '#5E8A2E'], [454, 236, 6, '#4E8E7A', '#2E6A5A'], [624, 234, 7, '#A8B84A', '#7A8A2A'], [684, 236, 8, '#5E9E6A', '#3E7A4A'], [740, 232, 7, '#7EA04E', '#5A7A2E']].map(([x, y, r, a, b]) => arvore(x, y, r, a, b)).join('')}</g>
    <rect x="330" y="236" width="470" height="30" fill="url(#csNevoa)"/>
    <path d="M0 140 Q224 156 448 124 M448 124 Q624 146 800 130 M0 148 Q224 164 448 132 M448 132 Q624 154 800 138" stroke="#2E3440" stroke-width="1.6" fill="none"/>
    <g id="cs-ipe" class="toque">
      <path d="M560 306 C556 280 562 256 556 230 M558 262 C574 250 594 240 612 230 M560 248 C546 236 530 228 512 222 M556 238 C560 222 572 210 586 202" stroke="#4E3424" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M560 306 C556 280 562 256 556 230 M558 262 C574 250 594 240 612 230 M560 248 C546 236 530 228 512 222" stroke="#8A6A4A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M606 232 C620 230 632 232 642 236" stroke="#4E3424" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="${copa(512, 206, 34, 22, 10, .32)}" fill="#9A58C8" stroke="#5E2A8A" stroke-width="2"/><path d="${copa(604, 208, 34, 22, 10, .32)}" fill="#9A58C8" stroke="#5E2A8A" stroke-width="2"/>
      <path d="${copa(558, 184, 50, 32, 12, .3)}" fill="url(#csIpe)" stroke="#5E2A8A" stroke-width="2"/><path d="${copa(530, 168, 24, 14, 9, .3)}" fill="#D2A2F0" stroke="#7E3EA8" stroke-width="1.4"/><path d="${copa(586, 166, 22, 13, 9, .3)}" fill="#D8AEF4" stroke="#7E3EA8" stroke-width="1.4"/>
      ${textura(558, 196, 70, 24, 22, '#6E2E9E', 1.3)}
      <g fill="#F4E6FC">${Array.from({ length:26 }, () => `<circle cx="${R(486, 634).toFixed(0)}" cy="${R(160, 226).toFixed(0)}" r="${R(1.4, 2.4).toFixed(1)}"/>`).join('')}</g>
      <path d="M520 156 q16 -10 34 -8" stroke="#F4E6FC" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
      <rect x="476" y="140" width="170" height="100" fill="transparent"/></g>
    <g id="cs-sabia" class="toque" data-fig="sabia"><g transform="translate(624 232) scale(-1 1)"><g id="cs-sabia-in">${sabia}</g></g><g id="cs-sabia-notas" style="opacity:0">${nota(596, 196, '#E86A2A')}${nota(584, 184, '#C9622A')}</g>${brilhoHotspot(640, 206)}<rect x="596" y="196" width="44" height="40" fill="transparent"/></g>
    <g fill="#7EA87E" stroke="#5E8A62" stroke-width="1.2">${[[700, 238, 14], [718, 232, 12], [736, 238, 13], [684, 242, 10]].map(([x, y, r]) => `<path d="${copa(x, y, r, r * .7, 8)}"/>`).join('')}</g>
    <path id="cs-margem" d="M612 344 L612 300 C640 268 674 248 696 238 L730 238 C760 240 788 246 800 248 V440 H612Z" fill="url(#csBarranco)" stroke="#6EA84A" stroke-width="1.6"/>
    <path d="M614 298 C640 268 674 250 696 240 L730 240 C760 242 788 248 800 250" stroke="#E2F6B8" stroke-width="2.2" fill="none" opacity=".75"/>
    <g opacity=".5">${textura(700, 330, 90, 80, 40, '#5E9A3A', 1.4)}</g>
    <g stroke-width="2" fill="none" stroke-linecap="round" pointer-events="none">${capim(18, 616, 798, 262, 340, 6, 11, '#5E9A3E')}</g>
    <path d="${forma(1, 9)}" fill="url(#csBeira)" stroke="#6E5A34" stroke-width="1.3"/>
    <path d="${forma(1, 4)}" fill="#7A6640"/>
    <g>${[.08, .2, .34, .48, .6, .74, .9].map((t, q) => { const [x, y, w] = naMargem(-1, t, 6), [x2, y2] = naMargem(1, t + .04, 6); return pedra(x, y + 1, 2 + w * .16, 1.2 + w * .08, q % 2 ? 'url(#csPedra2)' : '') + pedra(x2, y2 + 1, 1.8 + w * .15, 1.1 + w * .08, q % 2 ? '' : 'url(#csPedra2)'); }).join('')}</g>
    <g id="cs-erosao" style="transition:opacity 1.6s"><path d="${forma(1, 17)}" fill="url(#csErosao)" stroke="#6E4220" stroke-width="1.6" stroke-linejoin="round"/><path d="${linha(-1, 1, 15)} M${f1(margemPts(1, 1, 15)[0][0])} ${f1(margemPts(1, 1, 15)[0][1])}${curva(margemPts(1, 1, 15))}" stroke="#E2B47A" stroke-width="1.6" fill="none" stroke-dasharray="7 4 3 5" opacity=".8"/>${Array.from({ length:16 }, (_, q) => { const lado = q % 2 ? 1 : -1, [x, y, w] = naMargem(lado, .06 + Math.floor(q / 2) * .118, 16), L = 4 + w * .3; return `<path d="M${f1(x)} ${f1(y)} q${f1(-lado * L * .3)} ${f1(L * .3)} ${f1(-lado * L)} ${f1(L * .5)}" stroke="#6E4220" stroke-width="${f1(1 + w * .04)}" fill="none" stroke-linecap="round"/>`; }).join('')}${[.18, .44, .7, .86].map((t, q) => { const lado = q % 2 ? 1 : -1, [x, y, w] = naMargem(lado, t, 2); return `<path d="M${f1(x - 4 - w * .2)} ${f1(y + 2)} q${f1(w * .2 + 4)} ${f1(-5 - w * .1)} ${f1(w * .4 + 8)} 0Z" fill="#8A5A2E" stroke="#5A3418" stroke-width="1"/>`; }).join('')}<g fill="#9A9488" stroke="#5E5A52" stroke-width="1">${[[688, 290], [672, 354], [680, 404], [744, 300], [770, 356], [778, 410]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="2.6"/>`).join('')}</g><g stroke="#5A3418" stroke-width="1.2" fill="none" stroke-linecap="round"><path d="M676 330 q-4 6 -2 12 M676 336 q4 4 3 9 M770 330 q4 6 2 12 M762 396 q-3 6 0 10"/></g></g>
    <path id="cs-rio" d="${forma(1, 0)}" fill="url(#csRio)" stroke="#1E5E9E" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="${forma(.42, 0)}" fill="#1A5EA8" opacity=".38" filter="url(#csBorra)"/>
    <g fill="none" stroke-linecap="round"><path d="${linha(1, .72, 0)}" stroke="#F2FBFF" stroke-width="2.2" stroke-dasharray="20 12 6 14" opacity=".65"/><path d="${linha(-1, .66, 0)}" stroke="#DDF4FF" stroke-width="1.4" stroke-dasharray="10 16 4 10" opacity=".55"/><path d="${linha(-1, .92, 0)}" stroke="#0E4A8A" stroke-width="1.4" opacity=".35"/></g>
    <g id="cs-peixes" style="opacity:0;transition:opacity 1.4s">${[[712, 336, 1], [726, 388, .9], [702, 414, 1.1]].map(([x, y, k], i) => `<g style="animation:flutua ${(2.4 + i * .5).toFixed(1)}s ease-in-out infinite alternate"><g transform="translate(${x} ${y}) scale(${k})"><path d="M-9 0 C-4 -5 5 -5 9 0 C5 5 -4 5 -9 0Z M-9 0 L-15 -4 L-14 0 L-15 4Z" fill="#DCE6F0" stroke="#4E5A7A" stroke-width="1"/><path d="M-15 -4 L-14 0 L-15 4 L-11 0Z" fill="#FFD447"/><path d="M-4 -1 H6" stroke="#8A96B8" stroke-width="1"/><circle cx="5" cy="-1" r="1.2" fill="#12121A"/></g></g>`).join('')}</g>
    <g id="cs-lama" style="transition:opacity 1.6s"><path d="${forma(1, .5)}" fill="url(#csLama)" stroke="#5E4220" stroke-width="1.8" stroke-linejoin="round"/><path d="${forma(.45, 0)}" fill="#6A4824" opacity=".35" filter="url(#csBorra)"/><g fill="none" stroke-linecap="round">${RIO.slice(1, -1).map(([x, y, w], q) => `<path d="M${f1(x - w * .6)} ${f1(y + 4)} q${f1(w * .3)} ${f1(-3 - w * .08)} ${f1(w * .6)} 0 t${f1(w * .5)} 0" stroke="#E0C08A" stroke-width="${f1(1 + w * .05)}" opacity=".7"/><path d="M${f1(x - w * .2)} ${f1(y + 12)} q${f1(w * .25)} ${f1(2 + w * .06)} ${f1(w * .5)} 0" stroke="#5E3E1A" stroke-width="${f1(.8 + w * .04)}" opacity=".5"/>`).join('')}</g><g fill="#F2E6C8" stroke="#A88A5A" stroke-width=".6" opacity=".85">${[[716, 290, 2.4], [722, 342, 3], [741, 368, 3.4], [722, 398, 3.6], [700, 420, 3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * .5)}"/><ellipse cx="${f1(x + r * 1.5)}" cy="${f1(y + 1)}" rx="${f1(r * .6)}" ry="${f1(r * .3)}"/>`).join('')}</g></g>
    <g id="cs-lixo-rio" style="transition:opacity 1.4s"><g transform="translate(711 318) rotate(62)"><ellipse cx="0" cy="3" rx="11" ry="4" fill="#3E2A10" opacity=".25"/><path d="M-5 -12 h10 v4 C8 -6 9 -3 9 2 V12 C9 14 6 15 0 15 C-6 15 -9 14 -9 12 V2 C-9 -3 -8 -6 -5 -8Z" fill="#B8EEE0" fill-opacity=".9" stroke="#3E8A7A" stroke-width="1.3"/><rect x="-9" y="1" width="18" height="6" fill="#FF8A5A" stroke="#B84A20" stroke-width=".9"/><rect x="-4" y="-17" width="8" height="6" rx="1.4" fill="#2E7BF6" stroke="#12458A" stroke-width=".9"/><path d="M-5 -4 V11" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></g><path d="M732 374 C740 366 754 368 758 376 C752 384 738 384 732 374Z" fill="#F4F8FF" fill-opacity=".85" stroke="#8A9AB8" stroke-width="1.3"/><path d="M740 372 q6 -2 12 2" stroke="#fff" stroke-width="1.2" fill="none"/></g>
    <g id="cs-rio-fluxo"><g id="cs-ondas" stroke="#F2FAFF" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7">${RIO.slice(1).flatMap(([x, y, w], q) => [[-.45, -4], [.35, 3]].map(([o, dy]) => { const L = 2.5 + w * .22; return `<path d="M${f1(x + o * w - L)} ${f1(y + dy)} q${f1(L / 2)} ${f1(-L * .35)} ${f1(L)} 0 t${f1(L)} 0" stroke-width="${f1(1 + w * .03)}"/>`; })).join('')}</g></g>
    <g>${[.15, .3, .5, .62, .8, .95].map((t, q) => { const lado = q % 2 ? 1 : -1, [x, y, w] = naMargem(lado, t, -1); return pedra(x, y + 2, 2.4 + w * .2, 1.4 + w * .1, q % 3 ? '' : 'url(#csPedra2)') + `<path d="M${f1(x - 3 - w * .2)} ${f1(y + 3 + w * .08)} q${f1(3 + w * .2)} 2 ${f1(6 + w * .4)} 0" stroke="#E6F6FF" stroke-width="1.2" fill="none" opacity=".7"/>`; }).join('')}</g>
    <g>${taboa(683, 318, .62)}${taboa(762, 334, .7)}${taboa(752, 300, .5)}${taboa(676, 388, .82)}${samambaia(658, 330, .7)}${samambaia(788, 322, .7, -1)}${samambaia(626, 380, .8)}</g>
    <g id="cs-ciliar" style="opacity:0;transition:opacity 1.8s">${taboa(770, 400, .9)}${taboa(694, 286, .5)}${samambaia(670, 424, .9)}${samambaia(762, 268, .5, -1)}${samambaia(694, 262, .45)}${[[742, 392, 7], [690, 420, 6], [732, 340, 4.6]].map(([x, y, r]) => `<g><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * .4)}" fill="#4EA83A" stroke="#1E5A1A" stroke-width=".9"/><path d="M${x} ${y} l${f1(r * .9)} ${f1(-r * .15)}" stroke="#1E5A1A" stroke-width=".8"/>${r > 5 ? florzinha(x - 1, y - 2.6, 3.4, '#FFF4FA', '#C26A9A', '#FFD447') : ''}</g>`).join('')}${[[660, 296], [648, 352], [790, 300], [776, 352], [652, 412], [796, 396], [708, 252], [738, 262]].map(([x, y], q) => florzinha(x, y, 2.6, ['#FFD447', '#FFFFFF', '#FF8AB8', '#B88AF0'][q % 4], ['#A8740A', '#8A8A9A', '#B8406E', '#6A3EA8'][q % 4])).join('')}<g stroke="#3E8A2E" stroke-width="1.8" fill="none" stroke-linecap="round" pointer-events="none">${capimFora(18, 630, 798, 270, 420, 6, 12, '#3E8A2E')}</g></g>
    <g id="cs-covas">${COVAS.map((p, i) => `<g class="cs-cova toque" data-i="${i}"><ellipse cx="${p.x}" cy="${p.y + 1}" rx="14" ry="5.4" fill="#8A5E36" stroke="#4E2E14" stroke-width="1.2"/><ellipse cx="${p.x}" cy="${p.y}" rx="9.6" ry="3.4" fill="#3E2410"/><path d="M${p.x - 13} ${p.y} q3 -3 6 -1 M${p.x + 6} ${p.y - 2} q4 -1 7 1" stroke="#B88A5A" stroke-width="1.4" fill="none" stroke-linecap="round"/><g class="cs-cova-hint" style="display:none">${brilhoHotspot(p.x + 10, p.y - 14)}</g><g transform="translate(${p.x} ${p.y})"><g class="cs-arv" style="transform:scale(0);transition:transform 1.4s cubic-bezier(.3,1.5,.5,1)">${ARV[i]}</g></g><rect x="${p.x - 22}" y="${p.y - 24}" width="44" height="34" fill="transparent"/></g>`).join('')}</g>
    <g id="cs-garca" style="opacity:0;transition:opacity 1s"><g transform="translate(728 404)"><path d="M-2 0 V-14 M3 0 V-14" stroke="#3E3A2A" stroke-width="1.5"/><path d="M-10 -22 C-10 -30 4 -32 10 -26 C14 -20 8 -14 -2 -14 C-8 -14 -12 -18 -10 -22Z" fill="#fff" stroke="#5A6787" stroke-width="1.4"/><path d="M8 -26 C10 -34 6 -40 10 -46" stroke="#5A6787" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 -26 C10 -34 6 -40 10 -46" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="11" cy="-47" r="3.6" fill="#fff" stroke="#5A6787" stroke-width="1.2"/><path d="M14 -48 L24 -46 L14 -45Z" fill="#FFC83D" stroke="#8A6A08" stroke-width=".8"/><circle cx="12" cy="-48" r=".9" fill="#12235A"/><ellipse cx="0" cy="1" rx="10" ry="2" fill="#E6F6FF" opacity=".7"/></g></g>
    <path d="M352 342 V306 H612 V342Z" fill="url(#csMuro)" stroke="#9A8A6A" stroke-width="1.8"/>
    <g opacity=".14" fill="#7A6A4A">${[372, 398, 520, 548, 596].map((x, q) => `<path d="M${x} 307 c-2 6 2 10 0 ${14 + q * 3} c-1 3 3 4 4 0 c1 -6 -2 -10 0 -${14 + q * 3}Z"/>`).join('')}</g>
    <path d="M582 312 c8 -3 18 -1 24 2 c2 6 0 12 -4 15 c-8 1 -16 -1 -20 -4 c-3 -4 -2 -9 0 -13Z" fill="url(#csTijolo)" stroke="#8A6A4A" stroke-width="1.2"/><path d="M434 316 c6 -2 14 -1 18 1 c1 5 -1 9 -4 11 c-6 0 -11 -1 -14 -3 c-2 -3 -1 -6 0 -9Z" fill="url(#csTijolo)" stroke="#8A6A4A" stroke-width="1.2"/>
    <path d="M352 331 H612 V342 H352Z" fill="#BDB39C" stroke="#8A7E66" stroke-width="1.2"/><g stroke="#8A7E66" stroke-width=".9">${Array.from({ length:13 }, (_, q) => `<path d="M${360 + q * 20 + (q % 2) * 6} 331 v11"/>`).join('')}</g><path d="M353 333 H611" stroke="#E2DAC4" stroke-width="1.2"/>
    <path d="M346 299 H618 V307 H346Z" fill="url(#csCapa)" stroke="#7A2E14" stroke-width="1.6" stroke-linejoin="round"/><path d="M348 307 ${Array.from({ length:27 }, (_, q) => `q5 4 10 0`).join(' ')}" stroke="#7A2E14" stroke-width="1.2" fill="#C8542A"/><path d="M348 301.6 H616" stroke="#FFC2A0" stroke-width="1.4" opacity=".8"/>
    <path d="M384 316 l5 7 l-2 6 M560 312 l-3 9" stroke="#A8987A" stroke-width="1" fill="none"/>
    <g>
      <path d="M452 300 C456 316 450 326 456 336 M478 304 C482 318 476 330 480 338 M512 302 C508 316 514 326 510 334 M548 302 C552 314 546 324 552 332" stroke="#5A3A1E" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${[[466, 304, 18, 9, '#2E7A32'], [500, 300, 20, 10, '#3E8A36'], [536, 304, 18, 9, '#2E7A32'], [562, 302, 12, 7, '#3E8A36'], [458, 320, 9, 7, '#3E8A36'], [484, 324, 8, 8, '#2E7A32'], [514, 320, 9, 8, '#3E8A36'], [548, 318, 8, 7, '#2E7A32']].map(([x, y, rx, ry, c]) => `<path d="${copa(x, y, rx, ry, 9, .3)}" fill="${c}" stroke="#16461A" stroke-width="1.2"/>`).join('')}
      ${textura(510, 308, 56, 12, 16, '#1E5A22', 1.1)}
      <g>${[[456, 296], [470, 300], [486, 294], [498, 302], [510, 294], [524, 300], [540, 296], [554, 302], [566, 298], [462, 314], [480, 318], [508, 314], [530, 312], [546, 316], [456, 330], [482, 334], [512, 328], [550, 326], [494, 308], [570, 306]].map(([x, y], q) => `<g transform="translate(${x} ${y}) rotate(${q * 37}) scale(${(.58 + (q % 4) * .07).toFixed(2)})">${[0, 120, 240].map(a => `<path d="M0 0 C-3 -2 -3 -6 0 -7.4 C3 -6 3 -2 0 0Z" fill="${['#E8489A', '#FF74B8', '#D2307E', '#FF9AD0'][q % 4]}" stroke="#8E1456" stroke-width=".9" transform="rotate(${a})"/>`).join('')}<circle r="1.3" fill="#FFF6C8"/></g><g transform="translate(${x + 5} ${y + 3}) rotate(${q * 53 + 20}) scale(.45)">${[0, 120, 240].map(a => `<path d="M0 0 C-3 -2 -3 -6 0 -7.4 C3 -6 3 -2 0 0Z" fill="#FF74B8" stroke="#8E1456" stroke-width="1" transform="rotate(${a})"/>`).join('')}</g>`).join('')}</g>
      <path d="M476 292 q10 -5 22 -3 M522 294 q8 -4 18 -2" stroke="#9ADC7A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
    </g>
    <g id="cs-joaninha" class="toque" data-fig="joaninha"><g id="cs-joa-in"><g transform="translate(490 318) rotate(-20)"><ellipse cx="0" cy="0" rx="6.4" ry="5.6" fill="#E5392C" stroke="#6E0E08" stroke-width="1.1"/><path d="M0 -5.4 V5.4" stroke="#4A0A06" stroke-width=".9"/><circle cx="-3" cy="-1.6" r="1.3" fill="#1A1416"/><circle cx="3" cy="1.4" r="1.3" fill="#1A1416"/><circle cx="-2.4" cy="2.6" r="1" fill="#1A1416"/><circle cx="2.6" cy="-2.6" r="1" fill="#1A1416"/><path d="M5 -4 C8 -6 9 -2 7 0Z" fill="#1A1416"/><circle cx="7.2" cy="-3" r=".9" fill="#fff"/><path d="M-3 -4 q1 -1.4 3 -1.6" stroke="#FFC2B2" stroke-width="1" fill="none"/></g></g>${brilhoHotspot(504, 306)}<rect x="474" y="302" width="34" height="32" fill="transparent"/></g>
    <g id="cs-gato" class="toque"><g transform="translate(424 300)">
      <g id="cs-gato-rabo"><path d="M10 -2 C18 6 18 22 12 30 C10 34 14 38 18 36" stroke="#8E4E1A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M10 -2 C18 6 18 22 12 30 C10 34 14 38 18 36" stroke="#F2A050" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-dasharray="4 3"/></g>
      <path d="M-14 0 C-16 -16 -8 -26 0 -26 C8 -26 16 -16 14 0Z" fill="#F2A050" stroke="#8E4E1A" stroke-width="1.6"/><path d="M-8 -16 q4 2 0 6 M6 -18 q-3 3 0 6" stroke="#C8742A" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M-4 0 C-4 -10 4 -10 4 0Z" fill="#FFE8CC"/>
      <g id="cs-gato-cab"><path d="M-11 -34 L-10 -46 L-3 -38Z M11 -34 L10 -46 L3 -38Z" fill="#F2A050" stroke="#8E4E1A" stroke-width="1.4" stroke-linejoin="round"/><path d="M-9 -36 L-9 -43 L-5 -38Z M9 -36 L9 -43 L5 -38Z" fill="#FF9AB0"/><ellipse cx="0" cy="-30" rx="12" ry="10" fill="#F2A050" stroke="#8E4E1A" stroke-width="1.6"/><path d="M-3 -39 v4 M0 -40 v4 M3 -39 v4" stroke="#C8742A" stroke-width="1.3"/><g class="pisca"><ellipse cx="-4.6" cy="-31" rx="2.2" ry="2.6" fill="#3E8A2A"/><ellipse cx="4.6" cy="-31" rx="2.2" ry="2.6" fill="#3E8A2A"/><ellipse cx="-4.6" cy="-31" rx=".9" ry="2" fill="#12121A"/><ellipse cx="4.6" cy="-31" rx=".9" ry="2" fill="#12121A"/></g><path d="M-1.4 -27 h2.8 l-1.4 1.6Z" fill="#E86A8A"/><path d="M0 -25.4 q-2 2 -4 1 M0 -25.4 q2 2 4 1" stroke="#8E4E1A" stroke-width=".9" fill="none"/><path d="M-6 -26 l-9 -1 M-6 -24.6 l-9 2 M6 -26 l9 -1 M6 -24.6 l9 2" stroke="#fff" stroke-width=".7"/></g>
      <rect x="-18" y="-48" width="40" height="86" fill="transparent"/></g></g>
    <path d="M0 340 H612 V340 L640 360 L612 440 H0Z" fill="url(#csGrama)"/>
    <path d="M336 342 H612" stroke="#5E9A3E" stroke-width="3"/>
    <g stroke-width="2" fill="none" stroke-linecap="round" pointer-events="none">${capim(40, 340, 640, 346, 420, 6, 11, '#4E8A2E')}${capim(20, 0, 260, 388, 420, 6, 10, '#4E8A2E')}</g>
    <g>${Array.from({ length:12 }, () => { const x = R(440, 630), y = R(350, 372); return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="2.6" ry="1.6" fill="#C58AE8" stroke="#7E3EA8" stroke-width=".5" transform="rotate(${R(0, 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }).join('')}</g>
    <g opacity=".35">${textura(200, 410, 150, 22, 26, '#3E7A26', 1.2)}${textura(520, 420, 90, 14, 14, '#3E7A26', 1.2)}</g>
    <path d="M430 357 C426 348 436 341 452 342 C500 338 560 339 598 341 C612 342 618 350 613 358 C580 362 470 362 430 357Z" fill="url(#csSolo)" stroke="#3E2410" stroke-width="1.2"/>
    <g>${Array.from({ length:13 }, (_, q) => { const x = 440 + q * 13.4, c = ['#3E8A36', '#4EA83A', '#2E7A32'][q % 3]; return `<path d="${copa(x, 350 + (q % 2) * 2, 9, 5.4, 8, .3)}" fill="${c}" stroke="#16461A" stroke-width="1"/>`; }).join('')}</g>
    <g>${Array.from({ length:17 }, (_, q) => pedra(434 + q * 10.6, 359 + Math.sin(q * 1.7) * .8, 4.6, 2.4, q % 2 ? 'url(#csPedra2)' : '')).join('')}</g>
    <g>${[438, 448, 506, 520, 596, 606].map((x, q) => `<path d="M${x} 348 q-2 -8 0 -14 M${x} 348 q3 -7 5 -11" stroke="#3E7A2A" stroke-width="1.4" fill="none"/>${[0, 1, 2, 3].map(k => `<ellipse cx="${f1(x + .5 + k * .3)}" cy="${f1(336 - k * 3.4)}" rx="1.6" ry="2" fill="${q % 2 ? '#E5392C' : '#9A6AE8'}" stroke="${q % 2 ? '#8E1E10' : '#5A2EA8'}" stroke-width=".5"/>`).join('')}`).join('')}${[[460, 344, '#FF9A2A', '#A8540E', '#C8420E'], [474, 346, '#FFFFFF', '#8A8A9A', '#FFC83D'], [492, 343, '#FFC83D', '#A8740A', '#C8540E'], [534, 345, '#FF9A2A', '#A8540E', '#C8420E'], [548, 343, '#FFFFFF', '#8A8A9A', '#FFC83D'], [566, 346, '#FFC83D', '#A8740A', '#C8540E'], [582, 344, '#FF9A2A', '#A8540E', '#C8420E']].map(([x, y, c, t, m]) => `<path d="M${x} ${y + 8} V${y}" stroke="#3E7A2A" stroke-width="1.4"/><path d="M${x} ${y + 6} c-4 -1 -6 -4 -5 -6 c3 0 5 2 5 6Z" fill="#4EA83A" stroke="#2E6A22" stroke-width=".6"/>${florzinha(x, y, 4, c, t, m)}`).join('')}</g>
    <g id="cs-horta">${CANT.map((b, i) => `<g class="cs-cant toque" data-i="${i}"><path d="M${b.x - 26} 390 C${b.x - 20} 384 ${b.x + 20} 384 ${b.x + 26} 390Z" fill="url(#csTerra)" stroke="#3E2010" stroke-width="1.2"/><path d="M${b.x - 25} 390 C${b.x - 19} 385 ${b.x + 19} 385 ${b.x + 25} 390Z" fill="url(#csSolo)" opacity=".75"/><path d="M${b.x - 18} 387 q4 -1.6 8 0 M${b.x + 6} 386.6 q4 -1.6 8 0" stroke="#A87A4A" stroke-width="1" fill="none" stroke-linecap="round"/><g class="cs-mudas">${[-14, 0, 14].map(d => `<g transform="translate(${b.x + d} 389) scale(.8)">${muda}</g>`).join('')}</g><g class="cs-cresceu" style="transform:translate(${b.x}px,389px) scale(0);transition:transform 1.2s cubic-bezier(.3,1.5,.5,1)"><g transform="translate(${-b.x} -389)">${i === 0 ? alface(b.x - 13, 386, 11) + alface(b.x + 11, 387, 10) : i === 1 ? cenoura(b.x - 12, 390) + cenoura(b.x, 389) + cenoura(b.x + 12, 390) : tomateiro(b.x - 6, 390)}</g></g><rect x="${b.x - 27}" y="390" width="54" height="22" rx="2" fill="url(#csMadeira)" stroke="#5A3418" stroke-width="1.6"/><path d="M${b.x - 27} 397 H${b.x + 27} M${b.x - 27} 404 H${b.x + 27}" stroke="#6E4020" stroke-width=".9" opacity=".55"/><path d="M${b.x - 24} 392.5 H${b.x + 24}" stroke="#F0C08A" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><path d="M${b.x - 20} 400 q6 1.4 12 0 M${b.x + 4} 407 q7 1.4 14 0" stroke="#5A3418" stroke-width=".8" fill="none" opacity=".6"/><rect x="${b.x - 29}" y="388" width="6" height="25" rx="1.4" fill="#8A5428" stroke="#4E2A10" stroke-width="1.2"/><rect x="${b.x + 23}" y="388" width="6" height="25" rx="1.4" fill="#8A5428" stroke="#4E2A10" stroke-width="1.2"/><circle cx="${b.x - 26}" cy="394" r=".9" fill="#3E3A36"/><circle cx="${b.x + 26}" cy="394" r=".9" fill="#3E3A36"/><circle cx="${b.x - 26}" cy="406" r=".9" fill="#3E3A36"/><circle cx="${b.x + 26}" cy="406" r=".9" fill="#3E3A36"/><path d="M${b.x - 26} 414 H${b.x + 26}" stroke="#2A3A1A" stroke-width="2.4" opacity=".25" stroke-linecap="round"/><g class="cs-cant-hint" style="display:none">${brilhoHotspot(b.x + 18, 372)}</g><rect x="${b.x - 28}" y="330" width="56" height="84" fill="transparent"/></g>`).join('')}</g>
    <g id="cs-placa" class="toque" data-fig="horta"><path d="M468 390 V364" stroke="#6E4020" stroke-width="3" stroke-linecap="round"/><rect x="452" y="352" width="34" height="14" rx="2" fill="#E8B878" stroke="#6E4020" stroke-width="1.4"/><text x="469" y="362.5" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="9" fill="#5A3418">HORTA</text>${brilhoHotspot(486, 352)}<rect x="448" y="346" width="42" height="46" fill="transparent"/></g>
    <g id="cs-cisterna" class="toque">
      <ellipse cx="393" cy="410" rx="42" ry="6" fill="#2A3A1A" opacity=".35"/>
      <path d="M352 404 L356 397 H430 L434 404Z" fill="url(#csConcreto)" stroke="#6E6A60" stroke-width="1.4" stroke-linejoin="round"/><rect x="352" y="404" width="82" height="6" rx="1" fill="#A8A296" stroke="#6E6A60" stroke-width="1.4"/><path d="M372 406 v3 M398 406 v3 M420 406 v3" stroke="#7A766C" stroke-width=".8"/>
      <path d="M360 310 V390 C360 401 424 401 424 390 V310Z" fill="url(#csCis)" stroke="#0A3270" stroke-width="2"/>
      ${[326, 344, 362, 380].map(y => `<path d="M360.5 ${y} C362 ${y + 7} 422 ${y + 7} 423.5 ${y}" stroke="#08306A" stroke-width="3.4" fill="none" opacity=".5"/><path d="M361 ${y - 2.4} C363 ${y + 4.4} 421 ${y + 4.4} 423 ${y - 2.4}" stroke="#A8DCFF" stroke-width="1.3" fill="none" opacity=".6"/>`).join('')}
      <path d="M360 390 C360 401 424 401 424 390" stroke="#062A5E" stroke-width="2.4" fill="none" opacity=".5"/>
      <path d="M367 318 V388" stroke="#E6F6FF" stroke-width="3.4" stroke-linecap="round" opacity=".55"/><path d="M372 320 V384" stroke="#E6F6FF" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
      <rect x="376.5" y="313.5" width="29" height="87" rx="7" fill="#C9D6E6" stroke="#0A3270" stroke-width="1.6"/>
      <rect x="379" y="316" width="24" height="82" rx="5" fill="#0E2E5E" stroke="#0A2A58" stroke-width="1.2"/>
      <g clip-path="url(#csCisClip)"><rect id="cs-cis-agua" x="379" y="398" width="24" height="90" fill="url(#csAgua)"/><path id="cs-cis-onda" d="M379 398 q6 -2 12 0 t12 0" stroke="#E6F6FF" stroke-width="1.6" fill="none"/></g>
      <path d="M383 322 V392" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".3"/>
      <g stroke="#0A2A58" stroke-width="1.2">${[332, 348, 364, 380].map((y, q) => `<path d="M403 ${y} h-${q % 2 ? 4 : 7}"/>`).join('')}</g>
      <path d="M418 371 c-2 2.6 -2.6 4 -2.6 5 a2.6 2.6 0 0 0 5.2 0 c0 -1 -.6 -2.4 -2.6 -5Z" fill="#E6F6FF" stroke="#0A3270" stroke-width=".7" opacity=".9"/>
      <ellipse cx="392" cy="310" rx="33" ry="7.4" fill="#0E4A9E" stroke="#0A3270" stroke-width="2"/>
      <path d="M360 309 C362 296 422 296 424 309 C418 314 366 314 360 309Z" fill="url(#csTampa)" stroke="#0A3270" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M368 303 q22 -9 46 -1" stroke="#CDEBFF" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
      <rect x="397" y="294" width="14" height="6" rx="1.6" fill="#2E86E6" stroke="#0A3270" stroke-width="1.4"/><ellipse cx="404" cy="294" rx="7" ry="2" fill="#5AB4FF" stroke="#0A3270" stroke-width="1.2"/><path d="M400 296 v3 M403 296 v3 M406 296 v3 M409 296 v3" stroke="#0A3270" stroke-width=".8"/>
      <path d="M368 302 H384 L382 296 H370Z" fill="#B8C2D0" stroke="#4E5A6E" stroke-width="1.2" stroke-linejoin="round"/><path d="M371 298 h10" stroke="#4E5A6E" stroke-width=".8" stroke-dasharray="1.4 1"/>
      <g transform="translate(420 388)"><path d="M-1 0 H5 C8 0 8 2 8 5" stroke="#6A4208" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M-1 0 H5 C8 0 8 2 8 5" stroke="url(#csMetal)" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M4 -2 V-6" stroke="#6A4208" stroke-width="2"/><ellipse cx="4" cy="-7" rx="4.2" ry="1.6" fill="#E5392C" stroke="#8E1E10" stroke-width="1"/><circle cx="1.4" cy="-.6" r=".8" fill="#FFF6C8"/></g>
      <rect x="352" y="290" width="84" height="122" fill="transparent"/></g>
    <path d="M330 166 H358 L356 178 H332Z" fill="url(#csCano)" stroke="#4E5A6E" stroke-width="1.6" stroke-linejoin="round"/><path d="M334 169 H354" stroke="#F2F6FA" stroke-width="1.4"/>
    <rect x="341" y="176" width="14" height="16" fill="url(#csCano)" stroke="#4E5A6E" stroke-width="1.6"/>
    <path d="M348 284 V292 C348 298 352 300 360 300 H376" stroke="#4E5A6E" stroke-width="15.6" fill="none" stroke-linejoin="round"/><path d="M348 284 V292 C348 298 352 300 360 300 H376" stroke="#C9D2DE" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M345 286 V292" stroke="#F2F6FA" stroke-width="2" stroke-linecap="round"/>
    <rect id="cs-fantasma" x="341" y="192" width="14" height="92" rx="2" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="2.4" stroke-dasharray="6 5" style="display:none"/>
    <g id="cs-fluxo" style="opacity:0;transition:opacity .6s"><path d="M282 140 L330 168 M300 150 L340 172" stroke="#BFE6FF" stroke-width="2.4" stroke-dasharray="6 8" fill="none" stroke-linecap="round"/><path d="M336 172 H348 V292 C348 298 352 300 360 300 H376" stroke="#7FD0FF" stroke-width="5" fill="none" stroke-dasharray="7 7" stroke-linecap="round"/></g>
    <g id="cs-cano" class="toque" style="cursor:grab"><g id="cs-cano-pos" transform="translate(${CANO0.x} ${CANO0.y}) rotate(${CANO0.r})">${pecaCano}<rect x="-24" y="-54" width="48" height="108" fill="transparent"/></g><g id="cs-cano-hint" style="display:none">${brilhoHotspot(CANO0.x + 16, CANO0.y - 40)}</g></g>
    <g transform="translate(14 384)"><path d="M0 0 C-2 -60 2 -120 -2 -170" stroke="#5E7A3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 0 C-2 -60 2 -120 -2 -170" stroke="#8AA858" stroke-width="7" fill="none" stroke-linecap="round"/>${[[-50, -210, -60], [30, -232, 20], [-40, -150, -30], [40, -190, 40], [0, -240, 0]].map(([x, y, a]) => `<path d="M-2 -170 Q${(x * .6).toFixed(0)} ${y + 6} ${x} ${y + 30} Q${(x * .4).toFixed(0)} ${y + 50} -2 -166Z" fill="#5EB84A" stroke="#2E6A22" stroke-width="1.6"/><path d="M-2 -170 Q${(x * .55).toFixed(0)} ${y + 18} ${x} ${y + 30}" stroke="#C8F0A0" stroke-width="1.4" fill="none"/>`).join('')}</g>
    <g id="cs-casa">
      <path d="M2 180 L180 82 L358 180 L340 182 L180 98 L20 182Z" fill="#7A2A10"/>
      <path d="M32 174 L180 106 L328 174Z" fill="url(#csSotao)"/>
      <path d="M180 108 V174 M106 140 V174 M254 140 V174 M70 158 V174 M290 158 V174" stroke="#4E2E18" stroke-width="3"/><path d="M60 172 L180 112 L300 172" stroke="#5E3A22" stroke-width="2.4" fill="none"/>
      <g id="cs-caixa" class="toque"><path d="M146 170 V146 C146 140 216 140 216 146 V170Z" fill="url(#csCis)" stroke="#0E3A7A" stroke-width="1.8"/><ellipse cx="181" cy="145" rx="35" ry="5" fill="#2E86E6" stroke="#0E3A7A" stroke-width="1.6"/><path d="M152 152 V166" stroke="#9FD8FF" stroke-width="2.4" stroke-linecap="round" opacity=".7"/><text x="181" y="163" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="8.5" fill="#E6F6FF" opacity=".9">caixa d'água</text><rect x="140" y="136" width="82" height="38" fill="transparent"/></g>
      <path d="M0 182 L180 80 L360 182" stroke="#8E2E10" stroke-width="3" fill="none" stroke-linejoin="round"/>
      <path d="M8 178 L180 84 L352 178 L332 180 L180 100 L28 180Z" fill="url(#csTelha)" stroke="#8E2E10" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="${telhas(178, 88, 14, 178, 3, 18)}${telhas(182, 88, 346, 178, 3, 18)}" stroke="#A8401E" stroke-width="1.2" fill="none"/><path d="${telhas(178, 86.6, 14, 176.6, 3, 18)}${telhas(182, 86.6, 346, 176.6, 3, 18)}" stroke="#FFC0A0" stroke-width=".9" fill="none" opacity=".5"/><g fill="#7A2A10" opacity=".35">${Array.from({ length:16 }, (_, q) => { const t = (q % 8 + .5) / 8, lado = q < 8 ? -1 : 1, x = 180 + lado * t * 150, y = 92 + t * 80; return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1"/>`; }).join("")}</g>
      <path d="M40 166 L180 92 L320 166" stroke="#FFB08A" stroke-width="2" fill="none" opacity=".6"/><path d="M168 90 L180 82 L192 90" stroke="#7A2A10" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M168 90 L180 82 L192 90" stroke="#E5703C" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M172 86 L180 81" stroke="#FFC0A0" stroke-width="1.4" stroke-linecap="round"/>
      <rect x="24" y="174" width="312" height="8" fill="#D8CDBC" stroke="#8A7A62" stroke-width="1.2"/>
      <rect x="32" y="182" width="136" height="190" fill="url(#csBanho)"/><rect x="32" y="282" width="136" height="90" fill="url(#csAzulejo)"/><path d="M32 282 H168" stroke="#5AAED2" stroke-width="2.4"/>
      <rect x="176" y="182" width="152" height="190" fill="url(#csCoz)"/><rect x="176" y="182" width="152" height="122" fill="url(#csPapel)"/><rect x="32" y="182" width="296" height="18" fill="url(#csTeto)"/><path d="M176 354 H328" stroke="#C8A070" stroke-width="2.4"/><path d="M32 371 H168" stroke="#5AAED2" stroke-width="2"/><rect x="176" y="356" width="152" height="16" fill="url(#csLadrilho)" opacity=".9"/>
      <path d="M36 196 H140 M140 196 V300 M140 196 H172 V230 M198 196 H186" stroke="#9AA6B8" stroke-width="3" fill="none" opacity=".7"/>
      <rect x="110" y="200" width="40" height="34" rx="3" fill="#D8EEF8" stroke="#6E8AA8" stroke-width="2"/><path d="M130 200 V234 M110 217 H150" stroke="#6E8AA8" stroke-width="1.4"/><path d="M114 205 l8 8 M136 204 l10 10" stroke="#fff" stroke-width="1.6" opacity=".8"/>
      <path d="M112 252 H156" stroke="#8A96AA" stroke-width="3" stroke-linecap="round"/><path d="M118 252 V284 C118 288 134 288 134 284 V252Z" fill="#FF8AB8" stroke="#B8406E" stroke-width="1.4"/><path d="M118 264 H134 M118 268 H134" stroke="#fff" stroke-width="1.6"/>
      <g id="cs-banho" class="cs-vaz toque" data-k="banho">
        <path d="M36 200 H58 V206" stroke="#7A869A" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M50 206 H70 L66 212 H54Z" fill="#C9D2DE" stroke="#4E5A6E" stroke-width="1.4" stroke-linejoin="round"/>
        <g id="cs-banho-cri" style="transition:opacity 1s"><path d="M54 292 C44 284 42 270 48 258 M78 292 C88 284 90 270 84 258" stroke="#7A4A2A" stroke-width="9.6" stroke-linecap="round" fill="none"/><path d="M54 292 C44 284 42 270 48 258 M78 292 C88 284 90 270 84 258" stroke="#C98A5A" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M50 362 C48 318 52 288 66 284 C80 288 84 318 82 362Z" fill="#C98A5A" stroke="#7A4A2A" stroke-width="1.4"/><circle cx="66" cy="266" r="13" fill="#C98A5A" stroke="#7A4A2A" stroke-width="1.4"/><g fill="#fff" stroke="#A8C8DA" stroke-width="1">${[[56, 255, 6], [76, 255, 6], [61, 248, 5.4], [71, 247, 5.6], [66, 251, 6], [48, 257, 4.4], [84, 257, 4.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M59 266 q3 -3 6 0 M67 266 q3 -3 6 0" stroke="#3E2A1A" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="66" cy="273" rx="2.6" ry="3.2" fill="#7A2A1A"/><ellipse cx="57" cy="271" rx="2.6" ry="1.6" fill="#FF8A7A" opacity=".6"/><ellipse cx="75" cy="271" rx="2.6" ry="1.6" fill="#FF8A7A" opacity=".6"/></g>
        <g id="cs-banho-agua" stroke="#7FC8FF" stroke-width="2" stroke-dasharray="10 8" fill="none" stroke-linecap="round" opacity=".9"><path d="M54 214 L48 368"/><path d="M58 214 L56 368"/><path d="M62 214 L64 368"/><path d="M66 214 L72 368"/><path d="M60 214 L80 368"/></g>
        <rect x="36" y="290" width="62" height="82" rx="3" fill="url(#csVidro)" stroke="#8ABCD2" stroke-width="2"/><path d="M36 214 V290" stroke="#8ABCD2" stroke-width="2"/><path d="M44 300 L58 314 M44 316 L52 324 M84 340 L94 350" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/>
        <g id="cs-notas" style="transition:opacity .8s">${nota(92, 236, '#E5398A')}${nota(104, 222, '#2E7BF6')}</g>
        <g transform="translate(106 270)"><circle r="5" fill="#C9D2DE" stroke="#4E5A6E" stroke-width="1.4"/><g id="cs-registro"><path d="M0 0 L0 -8 M-4 -8 h8" stroke="#4E5A6E" stroke-width="2.4" stroke-linecap="round"/></g></g>
        <g class="cs-hint">${brilhoHotspot(92, 206)}</g><rect x="34" y="196" width="80" height="176" fill="transparent"/></g>
      <g id="cs-vaso" class="cs-vaz toque" data-k="vaso">
        <path d="M118 302 H158 V330 H118Z" fill="url(#csLouca)" stroke="#6E7E94" stroke-width="1.6"/><path d="M118 302 H158 V306 H118Z" fill="#E6EEF6" stroke="#6E7E94" stroke-width="1.2"/><rect x="146" y="308" width="8" height="4" rx="1.4" fill="#C9D2DE" stroke="#6E7E94" stroke-width="1"/>
        <path d="M114 336 C114 362 162 362 162 336Z" fill="url(#csLouca)" stroke="#6E7E94" stroke-width="1.6"/><path d="M128 356 H148 L146 372 H130Z" fill="url(#csLouca)" stroke="#6E7E94" stroke-width="1.6"/>
        <ellipse cx="138" cy="336" rx="25" ry="6" fill="#F4F8FC" stroke="#6E7E94" stroke-width="1.6"/><ellipse cx="138" cy="337" rx="16" ry="3.4" fill="#7FC8FF" stroke="#4E8ABE" stroke-width="1"/>
        <g id="cs-vaso-agua"><path d="M124 333 C126 334 128 336 130 337" stroke="#2E7BF6" stroke-width="2" fill="none" stroke-dasharray="3 3" stroke-linecap="round"/><ellipse class="cs-ond" cx="134" cy="337" rx="4" ry="1.2" fill="none" stroke="#fff" stroke-width="1.2"/></g>
        <g class="cs-hint">${brilhoHotspot(162, 322)}</g><rect x="110" y="298" width="56" height="74" fill="transparent"/></g>
      <rect x="168" y="182" width="8" height="190" fill="#D8CDBC" stroke="#8A7A62" stroke-width="1"/>
      <rect x="206" y="196" width="80" height="58" rx="3" fill="url(#csJanela)" stroke="#fff" stroke-width="4"/><path d="M246 196 V254 M206 225 H286" stroke="#fff" stroke-width="3"/><path d="M216 246 C230 234 244 238 254 230 C266 222 276 226 286 220 V254 H206Z" fill="#9ED86C" opacity=".8"/><rect x="206" y="196" width="80" height="58" rx="3" fill="none" stroke="#B8A890" stroke-width="1.2"/>
      <path d="M200 192 C204 220 202 240 212 260 L200 260Z M292 192 C288 220 290 240 280 260 L292 260Z" fill="#FFC83D" stroke="#B8860E" stroke-width="1.2"/><path d="M198 192 H294" stroke="#8A6A3E" stroke-width="3" stroke-linecap="round"/>
      <path d="M200 256 H292 V262 H200Z" fill="#F2EDE2" stroke="#B8A890" stroke-width="1"/><path d="M262 256 C262 248 274 248 274 256Z" fill="#C85A2A" stroke="#7A2E10" stroke-width="1"/><path d="M268 249 c-4 -8 -2 -12 0 -14 c2 2 4 6 0 14 M268 249 c4 -6 8 -8 10 -6 c-2 4 -6 6 -10 6" fill="#4EA83A" stroke="#2E6A22" stroke-width=".8"/>
      <g><path d="M184 200 V230 M190 200 V222 M196 200 V236" stroke="#8A96AA" stroke-width="1.4"/><path d="M180 200 H200" stroke="#6E4A2A" stroke-width="3" stroke-linecap="round"/><ellipse cx="184" cy="234" rx="4.4" ry="5" fill="#C9D2DE" stroke="#4E5A6E" stroke-width="1.2"/><path d="M188 222 h6 v6 h-6Z" fill="#E5603C" stroke="#8E2E14" stroke-width="1"/><circle cx="196" cy="240" r="4.6" fill="#FFC83D" stroke="#B8860E" stroke-width="1.2"/></g>
      <rect x="182" y="312" width="142" height="60" fill="#F2E2C2" stroke="#A88A5A" stroke-width="1.6"/><path d="M228 316 V368 M276 316 V368" stroke="#A88A5A" stroke-width="1.4"/><rect x="186" y="318" width="38" height="48" rx="2" fill="#E8D2A8" stroke="#A88A5A" stroke-width="1"/><rect x="232" y="318" width="40" height="48" rx="2" fill="#E8D2A8" stroke="#A88A5A" stroke-width="1"/><rect x="280" y="318" width="40" height="48" rx="2" fill="#E8D2A8" stroke="#A88A5A" stroke-width="1"/><path d="M218 340 v8 M238 340 v8 M286 340 v8" stroke="#6E5A3A" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="178" y="304" width="150" height="9" rx="2" fill="#4E5A6E" stroke="#2E3440" stroke-width="1.2"/><path d="M182 306 H324" stroke="#8A96AA" stroke-width="1.2"/>
      <g id="cs-filtro" class="toque"><path d="M292 304 C290 292 292 286 296 284 H318 C322 286 324 292 322 304Z" fill="url(#csBarro)" stroke="#6E2E10" stroke-width="1.4"/><path d="M294 284 C292 274 294 266 300 264 H314 C320 266 322 274 320 284Z" fill="url(#csBarro)" stroke="#6E2E10" stroke-width="1.4"/><ellipse cx="307" cy="264" rx="8" ry="2.4" fill="#C86A3A" stroke="#6E2E10" stroke-width="1"/><path d="M296 296 h-4 v4" stroke="#B8C2D0" stroke-width="2" fill="none"/><path d="M298 270 V280 M298 288 V300" stroke="#F2B08A" stroke-width="1.6" opacity=".7" stroke-linecap="round"/><rect x="288" y="260" width="38" height="46" fill="transparent"/></g>
      <g id="cs-pia" class="cs-vaz toque" data-k="pia">
        <path d="M228 304 C228 294 270 294 270 304Z" fill="#E86A5A" stroke="#8E2E14" stroke-width="1.4"/><ellipse cx="249" cy="298" rx="14" ry="2.2" fill="#C8E8FA" stroke="#8E2E14" stroke-width=".8"/>
        <path d="M262 304 V280 C262 270 248 270 248 278 V283" stroke="#4E5A6E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M262 304 V280 C262 270 248 270 248 278 V283" stroke="#D8E0EA" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M262 290 h7" stroke="#4E5A6E" stroke-width="3.6" stroke-linecap="round"/>
        <g class="cs-hint">${brilhoHotspot(270, 276)}</g><rect x="226" y="262" width="52" height="46" fill="transparent"/></g>
      <path d="M24 174 H32 V384 H24Z M328 174 H336 V384 H328Z" fill="#C8744A" stroke="#7A3E22" stroke-width="1.2"/><g stroke="#A85A34" stroke-width="1" opacity=".8">${Array.from({ length:12 }, (_, i) => `<path d="M24 ${190 + i * 16} h8 M328 ${190 + i * 16} h8"/>`).join('')}</g>
      <path d="M18 372 H342 V388 H18Z" fill="#B8B2A6" stroke="#6E685E" stroke-width="1.6"/><path d="M20 375 H340" stroke="#E2DED6" stroke-width="1.4"/><g stroke="#8A8478" stroke-width="1">${Array.from({ length:13 }, (_, q) => `<path d="M${30 + q * 25} 376 v5 M${42 + q * 25} 381 v7"/>`).join("")}<path d="M18 381 H342"/></g><path d="M18 388 H342" stroke="#2A3A1A" stroke-width="3" opacity=".2"/>
    </g>
    <g id="cs-mang" class="cs-vaz toque" data-k="mang">
      <g transform="translate(344 346)"><path d="M-8 0 H6" stroke="#B8862A" stroke-width="5" stroke-linecap="round"/><path d="M4 -3 V-10 M0 -10 h8" stroke="#8A6008" stroke-width="2.6" stroke-linecap="round" id="cs-mang-reg"/></g>
      <path d="M350 348 C356 362 344 380 352 396 C360 412 380 408 388 420 L392 428" stroke="#1E7A3A" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="M350 348 C356 362 344 380 352 396 C360 412 380 408 388 420 L392 428" stroke="#3EC46A" stroke-width="3.8" fill="none" stroke-linecap="round"/><path d="M392 428 L382 434" stroke="#E5603C" stroke-width="6.4" stroke-linecap="round"/>
      <g id="cs-jato"><path d="M380 436 C368 440 358 446 348 454 M381 436 C372 444 366 450 360 458 M379 435 C366 436 354 442 342 450" stroke="#9FD8FF" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="5 5"/><ellipse id="cs-poca" cx="334" cy="458" rx="22" ry="4" fill="#7FC8FF" opacity=".75"/></g>
      <g class="cs-hint">${brilhoHotspot(360, 334)}</g><rect x="334" y="330" width="62" height="110" fill="transparent"/></g>
    <g id="cs-pingo" class="toque"><g id="cs-pingo-in"><svg x="260" y="90" width="48" height="60" viewBox="-8 -6 136 166"><use href="#pingo"/></svg></g></g>
    <g id="cs-hidro" class="toque"><rect x="262" y="388" width="60" height="32" rx="3" fill="#CFC9BE" stroke="#8A8478" stroke-width="1.6"/><rect x="268" y="392" width="48" height="25" rx="2" fill="#3E3A36"/><path d="M268 406 H276 M308 406 H316" stroke="#B8862A" stroke-width="4"/><circle cx="292" cy="404" r="12" fill="#F4F6FA" stroke="#2E7BF6" stroke-width="2.6"/><rect x="284" y="396" width="16" height="5.4" rx="1" fill="#2E3440"/><text id="cs-hidro-num" x="292" y="400.6" text-anchor="middle" font-family="monospace" font-weight="700" font-size="5" fill="#fff">01287</text><g id="cs-rotor"><path d="M292 404 l0 -4 M292 404 l3.5 2 M292 404 l-3.5 2 M292 404 l3.5 -2 M292 404 l-3.5 -2 M292 404 l0 4" stroke="#E5392C" stroke-width="1.6" stroke-linecap="round" transform="translate(0 4)"/></g><rect x="258" y="384" width="68" height="40" fill="transparent"/></g>
    <g id="cs-cao" class="toque"><g transform="translate(196 414)">
      <ellipse cx="4" cy="6" rx="34" ry="4" fill="#2A3A1A" opacity=".25"/>
      <g id="cs-cao-rabo"><path d="M-26 -2 C-34 -8 -36 -16 -32 -22" stroke="#8E5A2A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-26 -2 C-34 -8 -36 -16 -32 -22" stroke="#D89A5A" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
      <path d="M-28 4 C-30 -12 -14 -18 4 -16 C18 -15 24 -8 22 4Z" fill="#D89A5A" stroke="#8E5A2A" stroke-width="1.6"/><path d="M-14 -12 C-6 -15 6 -15 12 -12" stroke="#F2C08A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 4 C-4 -4 4 -6 10 -2" stroke="#F4E2C8" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M8 4 h14 M-26 4 h12" stroke="#8E5A2A" stroke-width="5" stroke-linecap="round"/><path d="M8 4 h14 M-26 4 h12" stroke="#E8B07A" stroke-width="3" stroke-linecap="round"/>
      <g id="cs-cao-cab"><path d="M14 -18 C14 -30 34 -32 38 -22 C42 -14 36 -6 26 -6 C18 -6 14 -10 14 -18Z" fill="#D89A5A" stroke="#8E5A2A" stroke-width="1.6"/><path d="M34 -18 C40 -18 44 -14 42 -10 C38 -8 34 -10 32 -14Z" fill="#F4E2C8" stroke="#8E5A2A" stroke-width="1.2"/><ellipse cx="42" cy="-13" rx="2.6" ry="2" fill="#2A1A10"/><path d="M16 -24 C10 -30 8 -20 12 -12 C16 -14 18 -20 16 -24Z" fill="#8E5A2A" stroke="#5E3A1A" stroke-width="1"/><circle cx="30" cy="-20" r="2.6" fill="#1A1410"/><circle cx="30.8" cy="-20.8" r=".9" fill="#fff"/><path id="cs-cao-lingua" d="M38 -9 q1 5 -2 6" stroke="#FF7A8A" stroke-width="2.6" fill="none" stroke-linecap="round" style="opacity:0"/></g>
      <rect x="-40" y="-36" width="86" height="46" fill="transparent"/></g></g>
    <g transform="translate(250 418)"><path d="M-12 -6 H12 L9 2 H-9Z" fill="#E5392C" stroke="#8E1E10" stroke-width="1.4"/><ellipse cx="0" cy="-6" rx="12" ry="2.6" fill="#7FC8FF" stroke="#8E1E10" stroke-width="1.2"/><path d="M-6 -6 q4 -1 6 0" stroke="#fff" stroke-width="1" fill="none"/></g>
    <path d="M612 418 H800 V424 H612Z" fill="#3E4A5A" opacity=".45"/>
    <rect x="0" y="422" width="800" height="22" fill="url(#csPiso)"/><rect x="0" y="422" width="800" height="22" fill="url(#csCalcada)"/>
    <path d="M0 422.5 H800" stroke="#8A8478" stroke-width="1.6"/><path d="M120 430 l6 2 l4 -1 M520 436 l5 -2 l6 1" stroke="#8E877A" stroke-width=".8" fill="none"/>
    <g fill="#5E9A3E">${[64, 230, 420, 560].map(x => `<path d="M${x} 433 l-2 -4 l2 1 l1 -4 l1 4 l2 -2 l-1 5Z"/>`).join('')}</g>
    <rect x="0" y="443" width="800" height="4" fill="#ECE8DE" stroke="#8A8478" stroke-width="1"/>
    <rect x="0" y="447" width="800" height="7" fill="url(#csGuia)"/><path d="M0 454 H800" stroke="#5E5A52" stroke-width="1.2"/>
    <g stroke="#8A867C" stroke-width="1">${Array.from({ length:17 }, (_, q) => `<path d="M${q * 50 + 18} 443 v11"/>`).join('')}</g>
    <rect x="0" y="454" width="800" height="9" fill="url(#csSarjetaG)"/><g stroke="#86827A" stroke-width=".9">${Array.from({ length:27 }, (_, q) => `<path d="M${q * 30 + 4} 454 v9"/>`).join('')}</g><path d="M0 455.4 H800" stroke="#5E5A52" stroke-width="1.6" opacity=".45"/>
    <rect x="0" y="463" width="800" height="37" fill="url(#csRua)"/><rect x="0" y="463" width="800" height="37" fill="url(#csAsfalto)" opacity=".85"/>
    <path d="M0 463 H800" stroke="#3A3E48" stroke-width="1.6"/><rect x="0" y="463" width="800" height="5" fill="#2A2E36" opacity=".25"/>
    <path d="M556 470 h42 l4 10 h-40 Z" fill="#3E424C" stroke="#30343C" stroke-width="1" opacity=".85"/>
    <g stroke="#30343C" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".9"><path d="M140 470 l8 4 l4 -1 l6 5 M150 474 l-2 5 M690 492 l10 -3 l6 2 l7 -4 M712 487 l2 -4"/></g>
    <g fill="#F2C43A" opacity=".88">${Array.from({ length:9 }, (_, q) => `<path d="M${q * 96 + 20} 481.6 h44 c1.4 0 2 .8 2 1.8 s-.6 1.8 -2 1.8 h-44 c-1.4 0 -2 -.8 -2 -1.8 s.6 -1.8 2 -1.8Z"/>`).join('')}</g>
    <g fill="#2A2E36" opacity=".55">${[[98, 482], [290, 483], [482, 482]].map(([x, y]) => `<rect x="${x}" y="${y}" width="${R(3, 9).toFixed(0)}" height="2" rx="1"/>`).join('')}</g>
    <g id="cs-bueiro" class="toque"><path d="M282 447 H334 V454 H282Z" fill="#1A1C22" stroke="#0E1014" stroke-width="1"/><path d="M280 443.4 H336 V447 H280Z" fill="#8A867C" stroke="#5E5A52" stroke-width="1"/><path d="M284 449 H332" stroke="#3E424C" stroke-width="1"/>
      <rect x="284" y="454.6" width="48" height="10" rx="1.4" fill="#5E626C" stroke="#2A2C32" stroke-width="1.4"/><rect x="287" y="456.4" width="42" height="6.4" fill="#16181E"/><path d="M291 456.4 V462.8 M296 456.4 V462.8 M301 456.4 V462.8 M306 456.4 V462.8 M311 456.4 V462.8 M316 456.4 V462.8 M321 456.4 V462.8 M326 456.4 V462.8" stroke="#8A909C" stroke-width="2"/><path d="M286 455.6 H330" stroke="#B8BEC8" stroke-width=".8"/>
      <g id="cs-entupe" style="transition:opacity 1s"><path d="M282 459 C290 450 306 452 314 454 C322 452 334 454 336 462 C324 468 294 468 282 459Z" fill="#7A5A3A" stroke="#4E3420" stroke-width="1.2"/><path d="M290 455 c4 -6 10 -6 12 -2 c-4 2 -8 3 -12 2Z M318 453 c4 -5 10 -4 11 0 c-4 2 -8 2 -11 0Z" fill="#B8862A" stroke="#6E4A14" stroke-width=".8"/><path d="M300 459 l10 -3 l2 4 l-9 3Z" fill="#F2EFE6" stroke="#8A8478" stroke-width=".8"/><path d="M322 460 l6 -2 l1 3Z" fill="#E5392C" stroke="#8E1E10" stroke-width=".6"/><ellipse cx="309" cy="468" rx="30" ry="3" fill="#7FA8C8" opacity=".55"/></g>
      <rect x="276" y="440" width="64" height="30" fill="transparent"/></g>
    <g id="cs-sarjeta" style="opacity:0;transition:opacity .8s" stroke="#7FC8FF" stroke-width="3" fill="none" stroke-dasharray="8 8" stroke-linecap="round"><path d="M640 458.6 H334"/><path d="M0 458.6 H284"/></g>
    <g>${Array.from({ length:7 }, (_, i) => { const x = 620 + i * 30; return `<rect x="${x - 3}" y="404" width="6" height="40" fill="#E2DED6" stroke="#8A8478" stroke-width="1.2"/>`; }).join('')}<rect x="612" y="404" width="188" height="7" rx="2" fill="#F2EFE8" stroke="#8A8478" stroke-width="1.4"/><rect x="612" y="424" width="188" height="5" rx="2" fill="#E2DED6" stroke="#8A8478" stroke-width="1.2"/></g>
    ${LIX.map((b, i) => `<g class="cs-lixeira" data-i="${i}"><ellipse cx="${b.x}" cy="441" rx="17" ry="3" fill="#3E3A36" opacity=".3"/><path d="M${b.x - 15} 404 H${b.x + 15} L${b.x + 13} 440 H${b.x - 13}Z" fill="${b.cor}" stroke="${b.esc}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${b.x - 10} 408 V436" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".35"/><g transform="translate(${b.x} 440)">${icone[i]}</g><g class="cs-tampa" style="transform-box:fill-box;transform-origin:0% 100%;transition:transform .35s"><path d="M${b.x - 17} 398 H${b.x + 17} V404 H${b.x - 17}Z" fill="${b.cor}" stroke="${b.esc}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${b.x - 5} 398 V395 H${b.x + 5} V398" stroke="${b.esc}" stroke-width="1.8" fill="none"/></g></g>`).join('')}
    <g id="cs-lixos">${LIXO.map((l, i) => `<g class="cs-lixo toque" data-i="${i}" transform="translate(${l.x} ${l.y})" style="cursor:grab"><ellipse cx="1" cy="${[9, 9, 11, 9][i]}" rx="${[17, 17, 16, 18][i]}" ry="3.6" fill="#14161C" opacity=".38"/>${desenhoLixo[l.id]}<g class="cs-lixo-hint" style="display:none">${brilhoHotspot(14, -14)}</g><circle r="24" fill="transparent"/></g>`).join('')}</g>
    <g id="cs-regador" class="toque" style="cursor:grab"><g id="cs-reg-pos" transform="translate(${REG0.x} ${REG0.y})"><g id="cs-reg-in"><path d="M12 -16 L28 -30" stroke="#0E6A3E" stroke-width="5" stroke-linecap="round"/><path d="M12 -16 L28 -30" stroke="#3EC48A" stroke-width="2.6" stroke-linecap="round"/><path d="M25 -35 l8 -3 l3 8 l-8 3Z" fill="#3EC48A" stroke="#0E6A3E" stroke-width="1.2"/><path d="M-12 -24 H12 L10 0 H-10Z" fill="url(#csReg)" stroke="#0E6A3E" stroke-width="1.8" stroke-linejoin="round"/><path d="M-12 -18 C-24 -22 -24 -4 -11 -6" stroke="#0E6A3E" stroke-width="3" fill="none"/><path d="M-6 -20 V-4" stroke="#C8F8E0" stroke-width="2" stroke-linecap="round" opacity=".8"/><ellipse id="cs-reg-agua" cx="0" cy="-24" rx="11" ry="2.4" fill="#7FC8FF" stroke="#0E6A3E" stroke-width="1" style="opacity:0"/></g><rect x="-26" y="-40" width="64" height="44" fill="transparent"/></g><g id="cs-reg-hint" style="display:none">${brilhoHotspot(REG0.x + 20, REG0.y - 44)}</g></g>
    <rect x="445" y="112" width="7" height="322" fill="#8A847A" stroke="#4E4A44" stroke-width="1.4"/><path d="M447 116 V430" stroke="#C9C4BA" stroke-width="1.6"/><path d="M430 124 H466" stroke="#5E5A54" stroke-width="5" stroke-linecap="round"/><circle cx="436" cy="120" r="2.4" fill="#E8E4DC" stroke="#5E5A54"/><circle cx="460" cy="120" r="2.4" fill="#E8E4DC" stroke="#5E5A54"/><ellipse cx="448" cy="434" rx="10" ry="2.4" fill="#3E3A36" opacity=".3"/>
    <g id="cs-bemtevi" class="toque" data-fig="bemtevi"><g transform="translate(388 136)"><g id="cs-btv-in">${bemtevi}</g></g>${brilhoHotspot(404, 100)}<rect x="368" y="100" width="44" height="40" fill="transparent"/></g>
    <g id="cs-bikes" class="toque"><g id="cs-bikes-pos" transform="translate(84 496)">${crianca(0, '#8A5430', '#FF6B5A', '#FFC83D', '#2E7BF6')}${crianca(-58, '#F2C6A0', '#22A565', '#B57BFF', '#E5392C')}<rect x="-90" y="-62" width="116" height="64" fill="transparent"/></g></g>
    <g id="cs-nuvem" class="toque" style="opacity:0;pointer-events:none;transition:opacity 1s"><g style="animation:flutua 3s ease-in-out infinite alternate"><use href="#nuvem" x="150" y="-6" width="196" height="96" style="color:#5A6787"/><use href="#nuvem" x="156" y="-4" width="184" height="88" style="color:#AEB7CC"/><use href="#nuvem" x="186" y="30" width="130" height="56" style="color:#8A94AE"/><path d="M196 34 q14 -9 30 -4" stroke="#E2E7F1" stroke-width="3.4" fill="none" stroke-linecap="round"/><g id="cs-nuvem-hint">${brilhoHotspot(330, 20)}</g><rect x="150" y="-6" width="196" height="96" fill="transparent"/></g></g>
    <g id="cs-nuvem2" style="opacity:0;transition:opacity 1.2s;pointer-events:none"><use href="#nuvem" x="440" y="10" width="220" height="100" style="color:#6A7797"/><use href="#nuvem" x="448" y="12" width="206" height="92" style="color:#B8C0D4"/><use href="#nuvem" x="600" y="40" width="160" height="70" style="color:#8A94AE"/></g>
    <rect width="800" height="500" fill="url(#csVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#csGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const anima = (e, kf, o) => e.animate(kf, o);
  /* animações de fundo */
  const flui = e => e && anima(e, [{ strokeDashoffset:0 }, { strokeDashoffset:-36 }], { duration:700, iterations:Infinity });
  s.querySelectorAll('#cs-banho-agua path, #cs-jato path, #cs-fluxo path, #cs-sarjeta path, #cs-vaso-agua path').forEach(flui);
  anima(el(s, '#cs-ondas'), [{ transform:'translate(0,-3px)', opacity:.35 }, { transform:'translate(0,4px)', opacity:.8 }], { duration:1800, iterations:Infinity, direction:'alternate', easing:'ease-in-out' });
  anima(el(s, '#cs-vaso-agua .cs-ond'), [{ rx:2, opacity:1 }, { rx:10, opacity:0 }], { duration:1100, iterations:Infinity });
  anima(el(s, '#cs-poca'), [{ rx:18 }, { rx:26 }, { rx:18 }], { duration:1600, iterations:Infinity });
  anima(el(s, '#cs-notas'), [{ transform:'translate(0,0)' }, { transform:'translate(4px,-8px)' }, { transform:'translate(0,0)' }], { duration:1400, iterations:Infinity });
  anima(el(s, '#cs-cis-onda'), [{ transform:'translateX(-4px)' }, { transform:'translateX(4px)' }], { duration:1200, iterations:Infinity, direction:'alternate' });
  const hints = on => s.querySelectorAll('.cs-hint').forEach(h => { const g = h.closest('.cs-vaz'); h.style.display = on && g && aberto[g.dataset.k] ? '' : 'none'; });
  /* gotas que pingam (desenhadas no canvas) */
  const gotas = [];
  c.desenho(ctx => {
    for (let i = gotas.length - 1; i >= 0; i--) {
      const g = gotas[i]; g.vy += .18; g.y += g.vy;
      ctx.globalAlpha = .95; ctx.fillStyle = g.cor || '#5AB8FF'; ctx.strokeStyle = '#1E6ED6'; ctx.lineWidth = 1;
      const r = g.r || 2.6; ctx.beginPath(); ctx.moveTo(g.x, g.y - r * 2.2); ctx.quadraticCurveTo(g.x + r * 1.3, g.y, g.x, g.y + r); ctx.quadraticCurveTo(g.x - r * 1.3, g.y, g.x, g.y - r * 2.2); ctx.fill(); ctx.stroke();
      if (g.y >= g.chao) { gotas.splice(i, 1); c.add({ tipo:'respingo', x:g.x, y:g.chao, t:0, cor:'#2E7BF6' }); }
    }
    ctx.globalAlpha = 1;
  });
  const pinga = () => { if (!aberto.pia) return; gotas.push({ x:248, y:286, vy:0, chao:298 }); if (somOn && fase === 'vaz') tom(1900, 0, .05, 'sine', .025, 1300); depois(950, pinga); };
  depois(600, pinga);
  /* relógio de água: gira enquanto há desperdício */
  let ang = 0, ult = performance.now(), ultPetala = 0, ultVapor = 0;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ult); ult = t;
    const abertos = Object.values(aberto).filter(Boolean).length;
    ang = (ang + (abertos * .9 + (aberto.mang ? 1.4 : 0)) * dt * .4) % 360;
    el(s, '#cs-rotor').setAttribute('transform', `rotate(${ang.toFixed(1)} 292 408)`);
    if (abertos) { litros += dt * .0016 * (abertos + (aberto.mang ? 3 : 0)); el(s, '#cs-hidro-num').textContent = String(Math.floor(litros)).padStart(5, '0'); }
    if (aberto.banho && t - ultVapor > 260) { ultVapor = t; c.add({ tipo:'vapor', x0:sorte(46, 90), y0:sorte(230, 300), x1:sorte(40, 100), y1:sorte(196, 214), dur:sorte(60, 90), f:sorte(0, 6), r:sorte(3, 5), x:0, y:0 }); }
    if (t - ultPetala > 2600) { ultPetala = t; c.add({ tipo:'petala', x:sorte(490, 630), y:sorte(200, 230), vy:sorte(.5, .9), f:sorte(0, 6), chao:sorte(330, 420), cor:'#C58AE8', borda:'#7E3EA8' }); }
    requestAnimationFrame(vida);
  })(ult);
  /* arrastar (cano, regador e lixo) */
  let arr = null;
  const arrastavel = (g, o) => g.addEventListener('pointerdown', e => {
    if (arr || ocupado || !o.pode()) return; e.stopPropagation();
    const p = c.ponto(e); arr = { o, dx:p.x - o.x, dy:p.y - o.y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; toca('clique'); o.pega && o.pega();
  });
  s.addEventListener('pointermove', e => { if (!arr) return; const p = c.ponto(e); if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true; arr.o.x = Math.max(20, Math.min(780, p.x - arr.dx)); arr.o.y = Math.max(60, Math.min(490, p.y - arr.dy)); arr.o.poe(); });
  s.addEventListener('pointerup', e => { if (!arr) return; const a = arr; arr = null; const p = c.ponto(e); a.o.solta(a.moveu, p); });
  function voa(o, x1, y1, ms, fim, arco){
    const x0 = o.x, y0 = o.y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); o.x = x0 + (x1 - x0) * e; o.y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * (arco || 0); o.k = k; o.poe(); if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  /* 1. vazamentos */
  const FALA_VAZ = {
    pia:'Torneira pingando gasta uns 46 litros por dia, quase cinco baldes! Se não parar, peça para um adulto trocar a borrachinha.',
    banho:'Banho rapidinho, de uns 5 minutos, já deixa você limpinho. Feche o chuveiro enquanto se ensaboa!',
    vaso:'A descarga vazando perde água o dia inteiro, sem ninguém ver. Viu um fiozinho de água no vaso? Avise um adulto!',
    mang:'Lavar a calçada com mangueira gasta muita água. A vassoura faz o serviço, e o balde ajuda!'
  };
  s.querySelectorAll('.cs-vaz').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); const k = g.dataset.k;
    if (fase !== 'vaz' || !aberto[k]) { toca('clique'); if (k === 'banho') api.diz('Banho bom é banho rapidinho!'); else if (k === 'mang') api.diz('A mangueira fica guardada. Para a calçada, vassoura!'); else api.diz('Tudo fechadinho por aqui.'); return; }
    aberto[k] = false; consertos++; toca('ok'); hints(true);
    if (k === 'banho') { el(s, '#cs-banho-agua').style.display = 'none'; el(s, '#cs-notas').style.opacity = 0; el(s, '#cs-banho-cri').style.opacity = 0; anima(el(s, '#cs-registro'), [{ transform:'rotate(0)' }, { transform:'rotate(90deg)' }], { duration:400, fill:'forwards' }); c.brilhos(66, 280, 6, '#BFE6FF'); }
    if (k === 'vaso') { el(s, '#cs-vaso-agua').style.display = 'none'; c.brilhos(138, 330, 5, '#BFE6FF'); }
    if (k === 'pia') { c.brilhos(250, 284, 5, '#BFE6FF'); }
    if (k === 'mang') { el(s, '#cs-jato').style.display = 'none'; anima(el(s, '#cs-mang-reg'), [{ transform:'rotate(0)' }, { transform:'rotate(90deg)' }], { duration:400, fill:'forwards' }); c.brilhos(360, 440, 6, '#BFE6FF'); }
    api.hud(`<span class="chip">Vazamentos consertados: ${consertos}/4</span>`);
    if (consertos < 4) api.diz(FALA_VAZ[k]);
    else { toca('vitoria'); hints(false); api.diz(FALA_VAZ[k]); api.diz('Nenhum vazamento! Olha o hidrômetro, o relógio da água: ele parou de girar.'); depois(6000, comecaCano); }
  }));
  /* 2. cisterna e horta */
  const canoG = el(s, '#cs-cano'), canoPos = el(s, '#cs-cano-pos');
  const cano = { x:CANO0.x, y:CANO0.y, r:CANO0.r, poe(){ canoPos.setAttribute('transform', `translate(${this.x.toFixed(1)} ${this.y.toFixed(1)}) rotate(${this.r.toFixed(1)})`); },
    pode:() => fase === 'cano', pega(){ this.r = 0; this.poe(); el(s, '#cs-cano-hint').style.display = 'none'; },
    solta(moveu){ if (!moveu || Math.hypot(this.x - ALVO.x, this.y - ALVO.y) < 80) encaixa(); else { voa(this, CANO0.x, CANO0.y, 600, () => { this.r = CANO0.r; this.poe(); el(s, '#cs-cano-hint').style.display = ''; }); toca('clique'); api.diz('Leve o cano até a linha pontilhada, embaixo da calha.'); } } };
  arrastavel(canoG, cano);
  function comecaCano(){
    fase = 'cano'; el(s, '#cs-fantasma').style.display = ''; el(s, '#cs-cano-hint').style.display = '';
    anima(el(s, '#cs-fantasma'), [{ opacity:.4 }, { opacity:1 }, { opacity:.4 }], { duration:1400, iterations:Infinity });
    api.hud('<span class="chip">Calha ligada: 0/1</span>');
    api.diz('Agora vamos guardar a água da chuva! Arraste o cano para ligar a calha do telhado até a cisterna azul.');
  }
  function encaixa(){
    fase = 'encaixando'; el(s, '#cs-cano-hint').style.display = 'none';
    voa(cano, ALVO.x, ALVO.y, 700, () => { cano.r = 0; cano.poe(); canoG.style.cursor = ''; el(s, '#cs-fantasma').style.display = 'none'; toca('planta'); c.brilhos(ALVO.x, ALVO.y, 8, '#FFE27A');
      fase = 'chuva'; const n = el(s, '#cs-nuvem'); n.style.opacity = 1; n.style.pointerEvents = '';
      api.hud('<span class="chip">Chuvas: 0/3</span>');
      api.diz('Encaixou! A calha está ligada à cisterna. Toque na nuvem para chover no telhado.'); });
  }
  el(s, '#cs-nuvem').addEventListener('click', e => {
    e.stopPropagation(); if (fase !== 'chuva' || chovendo) return;
    chovendo = true; chuvas++; toca('chuva'); el(s, '#cs-nuvem-hint').style.display = 'none';
    let n = 0; (function cai(){ if (!vivo) return; for (let k = 0; k < 5; k++) { const x = sorte(140, 430); c.add({ tipo:'chuva', x, y:76, vx:-.3, vy:sorte(9, 12), chao:x > 360 && x < 422 ? 302 : roofY(x), cor:'#3D8BFF' }); } if (++n < 56) depois(45, cai); })();
    el(s, '#cs-fluxo').style.opacity = 1;
    const n0 = nivel, n1 = chuvas / 3, t0 = performance.now();
    depois(700, () => (function sobe(t){ if (!vivo) return; const k = Math.min(1, (t - t0 - 700) / 2400); nivel = n0 + (n1 - n0) * Math.max(0, k); poeNivel(); if (k < 1) requestAnimationFrame(sobe); })(performance.now()));
    depois(3400, () => {
      chovendo = false; el(s, '#cs-fluxo').style.opacity = 0; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) api.diz('A chuva escorre pelo telhado, entra na calha e desce pelo cano até a cisterna.');
      if (chuvas === 2) api.diz('A cisterna guarda a água da chuva para regar e limpar o quintal. Para beber, só água tratada!');
      if (chuvas === 3) cisternaCheia();
      else el(s, '#cs-nuvem-hint').style.display = '';
    });
  });
  function poeNivel(){ const y = 398 - nivel * 78; el(s, '#cs-cis-agua').setAttribute('y', y.toFixed(1)); el(s, '#cs-cis-onda').setAttribute('d', `M379 ${y.toFixed(1)} q6 -2 12 0 t12 0`); }
  const regPos = el(s, '#cs-reg-pos'), regIn = el(s, '#cs-reg-in');
  const regador = { x:REG0.x, y:REG0.y, poe(){ regPos.setAttribute('transform', `translate(${this.x.toFixed(1)} ${this.y.toFixed(1)})`); },
    pode:() => fase === 'rega', pega(){ el(s, '#cs-reg-hint').style.display = 'none'; },
    solta(moveu, p){ const livres = CANT.map((b, i) => i).filter(i => !s.querySelectorAll('.cs-cant')[i].dataset.feito);
      let alvo = livres.find(i => Math.abs(this.x - CANT[i].x) < 34 && Math.abs(this.y - CANT[i].y) < 50);
      if (alvo === undefined && !moveu) alvo = livres[0];
      if (alvo === undefined) { voa(this, REG0.x, REG0.y, 600, () => el(s, '#cs-reg-hint').style.display = ''); api.diz('Leve o regador até um canteiro da horta.'); return; }
      rega(alvo); } };
  arrastavel(el(s, '#cs-regador'), regador);
  function cisternaCheia(){
    fase = 'enchendo'; toca('vitoria'); const n = el(s, '#cs-nuvem'); n.style.opacity = 0; n.style.pointerEvents = 'none';
    c.brilhos(391, 320, 8, '#BFE6FF');
    for (let i = 0; i < 18; i++) depois(i * 60, () => gotas.push({ x:428 + sorte(-1, 1), y:394, vy:.5, chao:418, r:2 }));
    depois(1300, () => { el(s, '#cs-reg-agua').style.opacity = 1; fase = 'rega'; el(s, '#cs-reg-hint').style.display = ''; s.querySelectorAll('.cs-cant-hint').forEach(h => h.style.display = '');
      api.hud('<span class="chip">Horta regada: 0/3</span>');
      api.diz('Cisterna cheia! Enchi o regador com água da chuva. Arraste o regador até cada canteiro da horta.'); });
  }
  s.querySelectorAll('.cs-cant').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation(); const i = +g.dataset.i;
    if (fase !== 'rega' || ocupado || g.dataset.feito) { toca('clique'); if (fase === 'vaz' || fase === 'cano' || fase === 'chuva') api.diz('As mudinhas da horta estão com sede. Já já elas vão beber água da chuva!'); return; }
    rega(i);
  }));
  function rega(i){
    const b = CANT[i], g = s.querySelectorAll('.cs-cant')[i]; g.dataset.feito = 1; el(g, '.cs-cant-hint').style.display = 'none'; el(s, '#cs-reg-hint').style.display = 'none';
    voa(regador, b.x - 26, b.y - 22, 650, () => {
      ocupado = true; anima(regIn, [{ transform:'rotate(0)' }, { transform:'rotate(28deg)' }], { duration:350, fill:'forwards' }); toca('splash');
      let n = 0; (function chove(){ if (!vivo) return; for (let k = 0; k < 2; k++) gotas.push({ x:regador.x + 30 + sorte(-6, 6), y:regador.y - 24, vy:sorte(.5, 1.5), chao:390, r:1.8 }); if (++n < 22) depois(55, chove); })();
      depois(1300, () => {
        anima(regIn, [{ transform:'rotate(28deg)' }, { transform:'rotate(0)' }], { duration:300, fill:'forwards' });
        el(g, '.cs-mudas').style.transition = 'opacity .6s'; el(g, '.cs-mudas').style.opacity = 0; el(g, '.cs-cresceu').style.transform = `translate(${b.x}px,389px) scale(${[1.4, 1.4, 1.12][i]})`;
        toca('planta'); c.brilhos(b.x, 370, 6, '#FFE27A'); regados++; nivel = Math.max(.2, nivel - .22); poeNivel();
        api.hud(`<span class="chip">Horta regada: ${regados}/3</span>`);
        ocupado = false;
        if (regados === 1) api.diz('A alface bebeu água da chuva e cresceu!');
        if (regados === 2) api.diz('As cenouras crescem escondidas debaixo da terra.');
        if (regados < 3) voa(regador, REG0.x, REG0.y, 700, () => el(s, '#cs-reg-hint').style.display = '', 30);
        else { voa(regador, REG0.x, REG0.y, 700, null, 30); toca('vitoria'); api.diz('Tomates vermelhinhos! A horta toda foi regada com água da chuva, sem gastar a água tratada da torneira.'); depois(6400, comecaLixo); }
      });
    }, 40);
  }
  /* 3. bairro: lixo nas lixeiras e mata ciliar no córrego */
  const lixG = [...s.querySelectorAll('.cs-lixo')], lixeiras = [...s.querySelectorAll('.cs-lixeira')];
  const FALA_LIXO = { garrafa:'Plástico na lixeira vermelha. Ele pode virar uma garrafa nova!', lata:'Metal na lixeira amarela. A lata volta a ser lata!', papel:'Papel na lixeira azul. Ele vira papel de novo!', banana:'Casca de fruta na lixeira marrom. Ela pode virar adubo para a horta!' };
  const NOME = { garrafa:'A garrafa é de plástico', lata:'A lata é de metal', papel:'O jornal é de papel', banana:'A casca de banana é orgânica' };
  LIXO.forEach((l, i) => {
    const o = { x:l.x, y:l.y, foi:false, k:0, poe(){ lixG[i].setAttribute('transform', `translate(${this.x.toFixed(1)} ${this.y.toFixed(1)})${this.enc ? ` scale(${(1 - .65 * this.k).toFixed(2)})` : ''}`); },
      pode:() => fase === 'lixo' && !o.foi, pega(){ lixG[i].querySelector('.cs-lixo-hint').style.display = 'none'; },
      solta(moveu){ const b = LIX.findIndex(b => Math.abs(this.x - b.x) < 22 && this.y > 370 && this.y < 452);
        if (b === l.b || (!moveu && b < 0)) return guarda(i, o);
        if (b >= 0) { api.diz(`Essa lixeira é de ${LIX[b].nome}. ${NOME[l.id]}: lixeira ${LIX[l.b].cor2}!`); toca('clique'); }
        else api.diz(`Leve até a lixeira ${LIX[l.b].cor2}, na calçada.`);
        voa(o, l.x, l.y, 600, () => lixG[i].style.cursor = 'grab', 20); } };
    arrastavel(lixG[i], o);
  });
  function guarda(i, o){
    const l = LIXO[i], b = LIX[l.b], tampa = el(lixeiras[l.b], '.cs-tampa'); o.foi = true; o.enc = true;
    tampa.style.transform = 'rotate(-70deg)';
    voa(o, b.x, 398, 700, () => {
      lixG[i].style.display = 'none'; tampa.style.transform = ''; toca('pop'); c.brilhos(b.x, 396, 5, '#FFE27A'); lixos++;
      api.hud(`<span class="chip">Lixo no lugar certo: ${lixos}/4</span>`);
      if (lixos < 4) api.diz(FALA_LIXO[l.id]);
      else { el(s, '#cs-entupe').style.opacity = 0; el(s, '#cs-lixo-rio').style.opacity = 0; toca('vitoria'); api.diz(FALA_LIXO[l.id]); api.diz('Bueiro livre! A chuva desce por ele sem alagar a rua, e o lixo não vai mais parar no córrego.'); depois(6200, comecaMata); }
    }, 50);
  }
  function comecaLixo(){
    fase = 'lixo'; s.querySelectorAll('.cs-lixo-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Lixo no lugar certo: 0/4</span>');
    api.diz('Agora vamos cuidar do bairro! O lixo da rua entope o bueiro. Arraste cada lixo para a lixeira da cor certa.');
  }
  function comecaMata(){
    fase = 'mata'; s.querySelectorAll('.cs-cova-hint').forEach(h => h.style.display = '');
    api.hud('<span class="chip">Árvores no córrego: 0/4</span>');
    api.diz('O córrego está barrento porque a beira dele ficou sem árvores. Plante uma muda em cada covinha da beira do córrego!');
  }
  s.querySelectorAll('.cs-cova').forEach(g => g.addEventListener('click', e => {
    e.stopPropagation();
    if (fase !== 'mata' || g.dataset.feito) { if (!g.dataset.feito) { toca('clique'); api.diz('Sem árvores, a chuva leva a terra da beira para dentro do córrego.'); } return; }
    g.dataset.feito = 1; arvores++; el(g, '.cs-cova-hint').style.display = 'none';
    const p = COVAS[+g.dataset.i]; c.add({ tipo:'semente', x:p.x, y:p.y - 60, vy:0, alvoY:p.y, chega:() => { el(g, '.cs-arv').style.transform = 'scale(1)'; toca('planta'); c.brilhos(p.x, p.y - 40, 6, '#B8EAA0'); } });
    el(s, '#cs-lama').style.opacity = (1 - arvores / 4).toFixed(2); el(s, '#cs-erosao').style.opacity = (1 - arvores / 4).toFixed(2); el(s, '#cs-ciliar').style.opacity = (arvores / 4).toFixed(2);
    api.hud(`<span class="chip">Árvores no córrego: ${arvores}/4</span>`);
    if (arvores === 1) api.diz('Isso é mata ciliar: as árvores na beira do rio. As raízes seguram a terra no lugar.');
    if (arvores === 2) api.diz('Sem terra caindo na água, o córrego vai ficando limpinho.');
    if (arvores === 3) { el(s, '#cs-peixes').style.opacity = 1; api.diz('Olha os lambaris! Os peixinhos voltaram.'); }
    if (arvores === 4) { fase = 'fim'; depois(1400, final); }
  }));
  function final(){
    toca('vitoria'); el(s, '#cs-garca').style.opacity = 1; api.diz('Que córrego bonito! A garça chegou para pescar.');
    depois(3200, () => {
      el(s, '#cs-nuvem2').style.opacity = 1; toca('chuva');
      depois(800, () => { c.chover(420, 800, 70, 452, 90, '#3D8BFF'); el(s, '#cs-sarjeta').style.opacity = 1; });
      depois(4200, () => { el(s, '#cs-nuvem2').style.opacity = 0; el(s, '#cs-sarjeta').style.opacity = 0; c.brilhos(700, 330, 10, '#BFE6FF');
        api.diz('Nossa volta ao mundo termina aqui, onde você mora. A água que viaja pelo planeta é a mesma que chega na sua casa. Cada gota conta, e agora você é guardiã ou guardião da água!');
        depois(9000, api.fim); });
    });
  }
  /* toques extras */
  el(s, '#cs-sabia').addEventListener('click', () => {
    [[1320, 1180], [1560, 1400], [1180, 1320], [1480, 1250], [1700, 1500]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .18, 'sine', .07, f2), i * 210));
    const ns = el(s, '#cs-sabia-notas'); ns.style.opacity = 1; anima(ns, [{ transform:'translate(0,0)', opacity:1 }, { transform:'translate(-6px,-18px)', opacity:0 }], { duration:1400 }); depois(1400, () => ns.style.opacity = 0);
    anima(el(s, '#cs-sabia-in'), [{ transform:'translateY(0)' }, { transform:'translateY(-3px)' }, { transform:'translateY(0)' }], { duration:260, iterations:4 });
  });
  el(s, '#cs-bemtevi').addEventListener('click', () => {
    [[1700, 0, .12], [2300, 170, .1], [1500, 320, .28]].forEach(([f, d, du]) => setTimeout(() => somOn && tom(f, 0, du, 'triangle', .06, f * .85), d));
    anima(el(s, '#cs-btv-in'), [{ transform:'rotate(0)' }, { transform:'rotate(-10deg)' }, { transform:'rotate(4deg)' }, { transform:'rotate(0)' }], { duration:600 });
  });
  el(s, '#cs-joaninha').addEventListener('click', () => { toca('pop'); anima(el(s, '#cs-joa-in'), [{ transform:'translate(0,0)' }, { transform:'translate(-14px,4px)' }, { transform:'translate(0,0)' }], { duration:1600 }); });
  el(s, '#cs-placa').addEventListener('click', () => toca('clique'));
  el(s, '#cs-gato').addEventListener('click', e => { e.stopPropagation(); if (somOn) { tom(720, 0, .45, 'sawtooth', .025, 520); tom(980, 0, .4, 'sine', .04, 640); }
    const r = el(s, '#cs-gato-rabo'); r.style.transformBox = 'fill-box'; r.style.transformOrigin = '0% 0%';
    anima(r, [{ transform:'rotate(0)' }, { transform:'rotate(-24deg)' }, { transform:'rotate(14deg)' }, { transform:'rotate(0)' }], { duration:1100 });
    const cab = el(s, '#cs-gato-cab'); cab.style.transformBox = 'fill-box'; cab.style.transformOrigin = '50% 100%'; anima(cab, [{ transform:'rotate(0)' }, { transform:'rotate(-12deg)' }, { transform:'rotate(0)' }], { duration:900 });
    api.diz('Miau! O gato adora tomar sol em cima do muro.'); });
  let caoOc = false;
  el(s, '#cs-cao').addEventListener('click', e => { e.stopPropagation(); if (caoOc) return; caoOc = true;
    const cab = el(s, '#cs-cao-cab'); anima(cab, [{ transform:'translate(0,0) rotate(0)' }, { transform:'translate(8px,10px) rotate(14deg)' }, { transform:'translate(8px,10px) rotate(14deg)' }, { transform:'translate(0,0) rotate(0)' }], { duration:2400 });
    el(s, '#cs-cao-lingua').style.opacity = 1; depois(2200, () => { el(s, '#cs-cao-lingua').style.opacity = 0; caoOc = false; });
    [400, 800, 1200, 1600].forEach(d => setTimeout(() => somOn && tom(380, 0, .08, 'sine', .08, 220), d));
    const r = el(s, '#cs-cao-rabo'); r.style.transformBox = 'fill-box'; r.style.transformOrigin = '100% 100%'; anima(r, [{ transform:'rotate(0)' }, { transform:'rotate(20deg)' }, { transform:'rotate(-10deg)' }], { duration:300, iterations:6, direction:'alternate' });
    api.diz('O Totó está com sede. Os bichos também precisam de água limpa e fresquinha todo dia!'); });
  let bikeOc = false;
  el(s, '#cs-bikes').addEventListener('click', e => { e.stopPropagation(); if (bikeOc) return; bikeOc = true;
    [0, 220].forEach(d => setTimeout(() => { if (somOn) { tom(2600, 0, .25, 'sine', .05); tom(3200, 0, .2, 'sine', .03); } }, d));
    const p = el(s, '#cs-bikes-pos'); s.querySelectorAll('.cs-raio').forEach(r => { r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'center'; });
    const a = anima(p, [{ transform:'translate(0,0)' }, { transform:'translate(880px,0)', offset:.5 }, { transform:'translate(-140px,0)', offset:.5001 }, { transform:'translate(0,0)' }], { duration:7000, easing:'linear' });
    a.onfinish = () => { bikeOc = false; };
    api.diz('Trim-trim! A turma do bairro vai passear de bicicleta.'); });
  el(s, '#cs-ipe').addEventListener('click', e => { e.stopPropagation(); toca('pop'); for (let i = 0; i < 16; i++) c.add({ tipo:'petala', t:-i * 3, x:sorte(490, 630), y:sorte(170, 230), vy:sorte(.7, 1.3), f:sorte(0, 6), chao:sorte(340, 420), cor:i % 3 ? '#C58AE8' : '#E2C2F8', borda:'#7E3EA8' });
    api.diz('Um ipê-roxo! No fim do inverno ele perde as folhas e fica todo florido.'); });
  el(s, '#cs-caixa').addEventListener('click', e => { e.stopPropagation(); toca('glub'); c.brilhos(181, 152, 4, '#BFE6FF'); api.diz('Esta é a caixa d\'água da casa. A água tratada vem pela rua, passa pelo hidrômetro e fica guardada aqui em cima.'); });
  el(s, '#cs-hidro').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz('O hidrômetro é o relógio da água: ele mede quanta água a casa usa. Com vazamento, ele gira sem parar!'); });
  el(s, '#cs-filtro').addEventListener('click', e => { e.stopPropagation(); toca('glub'); api.diz('O filtro de barro deixa a água de beber limpinha e fresquinha.'); });
  el(s, '#cs-cisterna').addEventListener('click', e => { e.stopPropagation(); if (fase === 'cano') return; toca('glub'); api.diz(nivel > .5 ? 'A cisterna está cheia de água da chuva!' : 'Esta é a cisterna. Ela guarda a água da chuva que cai no telhado.'); });
  el(s, '#cs-bueiro').addEventListener('click', e => { e.stopPropagation(); toca('clique'); api.diz(lixos < 4 ? 'O bueiro leva a água da chuva para o córrego. Com lixo, ele entope e a rua alaga.' : 'Bueiro limpinho: a água da chuva passa e vai para o córrego.'); });
  el(s, '#cs-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(560, 58, 8, '#FFE27A'); api.diz('O sol esquenta o bairro e a água das poças vira vapor. Ela sobe e um dia volta como chuva.'); });
  el(s, '#cs-pingo').addEventListener('click', e => { e.stopPropagation(); toca('pop');
    anima(el(s, '#cs-pingo-in'), [{ transform:'translateY(0)' }, { transform:'translateY(-22px)' }, { transform:'translateY(0)' }, { transform:'translateY(-8px)' }, { transform:'translateY(0)' }], { duration:900, easing:'ease-out' });
    api.diz(fase === 'chuva' || fase === 'rega' ? 'Eu adoro chuva! Daqui de cima eu vejo toda a água indo para a cisterna.' : 'Que bom estar em casa! Daqui do telhado eu vejo o bairro todo.'); });
  hints(true);
  api.hud('<span class="chip">Vazamentos consertados: 0/4</span>');
  api.diz('Oi! Voltei para casa, a sua casa! Mas tem água escapando por aqui. Toque em cada vazamento para consertar.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}
/* ================= JOGO 10: Terra dos diques, morar abaixo do mar ================= */
function jogoDiques(palco, api){
  semente = 113;
  const SUP = 384, CR = 280, NB = 302, NOTCH = [166, 204, 242], CAN = 370, HX = 525, HY = 262, HOR = 300;
  const MAR0 = 368, MAR_ESPERA = 310, MAR_ALTO = 296, AREIA = 360, PLZ = 468, RUA = 392;
  /* face do dique voltada para o mar: do pé (56,452) até o ombro (138,288) */
  const faceX = y => 56 + (452 - y) / 164 * 82;
  const baseY = x => 456 - (x - 56) * .2162;
  let vivo = true, fase = 'mare', marY = MAR0, alvoMar = MAR_ESPERA, postos = 0, ocupado = false, vel = 0, ang = 0, seco = 0, filasAbertas = 0, chuvas = 0, chovendo = false, praca = PLZ;
  const timers = [], depois = (ms, fn) => { const t = setTimeout(() => vivo && fn(), ms); timers.push(t); return t; };
  const BLOCOS = [
    { tipo:'argila', x:417, y:350 },
    { tipo:'pedra', x:440, y:350 },
    { tipo:'grama', x:463, y:350 }
  ];
  const FILAS = [
    { y:311, k:.5, cores:['#E5392C', '#FFC83D', '#FF8AB8', '#B57BFF'] },
    { y:320, k:.6, cores:['#FFC83D', '#FF8A3A', '#E5392C', '#FFFFFF'] },
    { y:331, k:.72, cores:['#FF8AB8', '#B57BFF', '#FFC83D', '#E5392C'] },
    { y:343, k:.86, cores:['#FF8A3A', '#E5392C', '#FF8AB8', '#FFC83D'] },
    { y:357, k:1, cores:['#B57BFF', '#FFFFFF', '#FF8A3A', '#FF8AB8'] },
    { y:373, k:1.16, cores:['#E5392C', '#FF8AB8', '#FFC83D', '#B57BFF'] }
  ];
  const escuro = c => ({ '#E5392C':'#7A1410', '#FFC83D':'#A86A08', '#FF8AB8':'#9A2E5E', '#B57BFF':'#5A2E9A', '#FF8A3A':'#A8441A', '#FFFFFF':'#8A8AA0' }[c] || '#333');
  const F = n => n.toFixed(1);
  /* desenhos */
  const bloco = tipo => ({
    argila:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArg)" stroke="#4E3424" stroke-width="1.6"/><rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArgP)"/><path d="M-9 -4 q5 -3 10 0 t8 0 M-8 5 q5 -3 10 0 t7 0" stroke="#C9A486" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/><path d="M-10 -9 h12" stroke="#E2C2A2" stroke-width="2" stroke-linecap="round" opacity=".8"/>',
    pedra:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="#6E6E7E" stroke="#34343E" stroke-width="1.6"/><path d="M-12 -11 h11 v10 h-11Z M1 -11 h11 v7 h-11Z M-12 1 h7 v10 h-7Z M-3 1 h15 v10 h-15Z M1 -2 h11" fill="url(#dqPedra)" stroke="#34343E" stroke-width="1.1" stroke-linejoin="round"/><path d="M-10 -9 h7 M3 -9 h6" stroke="#E2E2EC" stroke-width="1.6" stroke-linecap="round"/>',
    grama:'<rect x="-13" y="-12" width="26" height="24" rx="3" fill="url(#dqArg)" stroke="#4E3424" stroke-width="1.6"/><path d="M-13 -4 V-9 Q-13 -12 -10 -12 H10 Q13 -12 13 -9 V-4Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.4"/><path d="M-10 -11 l-1 -5 M-6 -11 l1 -6 M-2 -11 l-1 -5 M2 -11 l1 -6 M6 -11 l-1 -5 M10 -11 l1 -5" stroke="#3E8A2A" stroke-width="1.6" stroke-linecap="round"/><path d="M-8 3 l2 4 M4 1 l-1 4 M-1 6 l3 2" stroke="#8A6A4E" stroke-width="1.2" stroke-linecap="round"/>'
  })[tipo];
  const ovelha = (x, y, s, vira) => `<g transform="translate(${x} ${y}) scale(${vira ? -s : s} ${s})"><ellipse cx="2" cy="12.5" rx="15" ry="2.6" fill="#1E3A12" opacity=".25"/><path d="M-8 4 v8 M-3 5 v7 M4 5 v7 M8 4 v8" stroke="#3A3A40" stroke-width="2.4" stroke-linecap="round"/><path d="${copa(0, -1, 13, 8, 9, .3)}" fill="#F8F6EE" stroke="#A8A496" stroke-width="1.4"/><path d="M-6 -6 q4 -3 9 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="-4" rx="5.4" ry="4.4" fill="#3A3A40" stroke="#1A1A20" stroke-width="1"/><path d="M11 -8 l-4 -2" stroke="#3A3A40" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="-5" r="1.1" fill="#fff"/></g>`;
  const pato = (x, y, s, filhote) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="1" rx="10" ry="2" fill="#E6F6FF" opacity=".55"/><path d="M-9 -2 C-10 -8 -4 -9 2 -8 C6 -8 9 -6 8 -2 C6 1 -6 1 -9 -2Z" fill="${filhote ? '#FFD447' : '#A88A6A'}" stroke="${filhote ? '#A87A08' : '#4E3A24'}" stroke-width="1.2"/><path d="M-4 -5 q4 -2 8 0" stroke="${filhote ? '#FFF3B0' : '#E6D6C0'}" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="6" cy="-11" r="4.4" fill="${filhote ? '#FFD447' : '#2E7A4A'}" stroke="${filhote ? '#A87A08' : '#1E4A2E'}" stroke-width="1.1"/><path d="M10 -11 l5 1 l-5 1.6Z" fill="#FF9A3A" stroke="#A8541A" stroke-width=".7"/><circle cx="7.4" cy="-12" r="1" fill="#12121A"/><circle cx="7.8" cy="-12.4" r=".4" fill="#fff"/>${filhote ? '' : '<path d="M2 -8 h6" stroke="#fff" stroke-width="1.2"/>'}</g>`;
  const bici = (x, y, cor) => `<g transform="translate(${x} ${y})"><circle cx="-9" cy="-6" r="6" fill="none" stroke="#2A2A34" stroke-width="1.8"/><circle cx="9" cy="-6" r="6" fill="none" stroke="#2A2A34" stroke-width="1.8"/><path d="M-9 -6 L-3 -14 H7 L9 -6 M-3 -14 L1 -6 L7 -14 M-4 -17 h4 M7 -14 l1 -5 h3" stroke="${cor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 -19 h5 v4 h-5Z" fill="#C9A06A" stroke="#6E4A2A" stroke-width=".8"/><circle cx="1" cy="-6" r="1.4" fill="#2A2A34"/></g>`;
  const crianca = (x, y, pele, roupa, cabelo, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-3 0 v-8 M3 0 v-8" stroke="#2E3A6A" stroke-width="3" stroke-linecap="round"/><path d="M-6 -8 C-6 -18 6 -18 6 -8Z" fill="${roupa}" stroke="#12235A" stroke-width="1"/><path d="M-6 -14 l-4 -5 M6 -14 l4 -5" stroke="${pele}" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="-22" r="5" fill="${pele}" stroke="#4E2E14" stroke-width="1"/><path d="M-5 -23 C-5 -29 5 -29 5 -23 C3 -26 -3 -26 -5 -23Z" fill="${cabelo}"/><circle cx="-1.8" cy="-22" r=".8" fill="#12121A"/><circle cx="1.8" cy="-22" r=".8" fill="#12121A"/><path d="M-1.6 -19.6 q1.6 1.4 3.2 0" stroke="#7A2A10" stroke-width=".9" fill="none"/></g>`;
  /* janela com moldura branca, verga, peitoril e reflexo; arco opcional */
  const janela = (x, y, w, h, moldura, arco) => `<path d="M${x - 1.6} ${y + h + 1} h${w + 3.2} v2.2 h-${w + 3.2}Z" fill="${moldura}" stroke="#3E2A1E" stroke-width=".6"/>${arco ? `<path d="M${x - 1.5} ${y + 1} a${w / 2 + 1.5} ${w / 2 + 1.5} 0 0 1 ${w + 3} 0" fill="none" stroke="${arco}" stroke-width="2.6"/>` : `<path d="M${x - 1.6} ${y - 3} h${w + 3.2} v2.4 h-${w + 3.2}Z" fill="${moldura}" stroke="#3E2A1E" stroke-width=".6"/>`}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#dqVidro)" stroke="${moldura}" stroke-width="1.8"/><path d="M${x} ${y + h * .45} H${x + w} M${x + w / 2} ${y} V${y + h}" stroke="${moldura}" stroke-width="1.1"/><path d="M${x + 1.6} ${y + 4} l3 -2.2 M${x + w / 2 + 1.6} ${y + h * .45 + 4} l2.4 -1.8" stroke="#fff" stroke-width="1" opacity=".85" stroke-linecap="round"/>`;
  const floreira = (x, y, w, cores) => `<rect x="${x}" y="${y}" width="${w}" height="3.4" rx="1" fill="#7A4A2A" stroke="#3E2414" stroke-width=".7"/><g stroke="#2E6A22" stroke-width=".6">${Array.from({ length:Math.round(w / 3.2) }, (_, i) => `<circle cx="${F(x + 1.6 + i * 3.2)}" cy="${F(y - .6 - (i % 2) * 1.2)}" r="1.5" fill="${cores[i % cores.length]}"/>`).join('')}</g>`;
  const ancoras = pts => `<g stroke="#2A2220" stroke-width="1.1" fill="none" stroke-linecap="round">${pts.map(([x, y]) => `<path d="M${x - 2.4} ${y - 1.4} q2.4 2.8 4.8 0 M${x} ${y - 2} v4"/>`).join('')}</g>`;
  /* fileiras de tulipas: faixa de cor (vista de longe) + flores na frente */
  const filaSvg = (f, i) => { let hastes = '', copos = ''; const passo = 11 * f.k;
    for (let x = 252 + (i % 2) * passo / 2; x < 800; x += passo) { const h = 6.5 * f.k, r = 3.3 * f.k;
      hastes += `M${x.toFixed(1)} ${f.y} v${(-h).toFixed(1)} `;
      copos += `M${(x - r).toFixed(1)} ${(f.y - h).toFixed(1)} q0 ${(-r * 1.8).toFixed(1)} ${(r * .6).toFixed(1)} ${(-r * 1.6).toFixed(1)} l${(r * .4).toFixed(1)} ${(r * .7).toFixed(1)} l${(r * .4).toFixed(1)} ${(-r * .7).toFixed(1)} q${(r * .6).toFixed(1)} ${(r * .2).toFixed(1)} ${(r * .6).toFixed(1)} ${(r * 1.6).toFixed(1)}Z `; }
    const fy = f.y - 6.5 * f.k;
    return `<g class="dq-fila toque" data-i="${i}" data-c="0"><g class="dq-fila-in" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1)"><path d="M250 ${F(f.y + 1.6 * f.k)} V${F(f.y - 3 * f.k)} H800 V${F(f.y + 1.6 * f.k)}Z" fill="#3E8A2A"/><path d="M250 ${F(f.y - 3 * f.k)} H800" stroke="#7CC25A" stroke-width="${F(1.4 * f.k)}" opacity=".8"/><path class="dq-faixa" d="M250 ${F(fy + .6 * f.k)} V${F(fy - 4.6 * f.k)} H800 V${F(fy + .6 * f.k)}Z" fill="${f.cores[0]}" opacity=".78"/><path d="${hastes}" stroke="#2E7A22" stroke-width="${(1.3 * f.k).toFixed(1)}" fill="none"/><path class="dq-copos" d="${copos}" fill="${f.cores[0]}" stroke="${escuro(f.cores[0])}" stroke-width="${(.7 * f.k).toFixed(2)}" stroke-linejoin="round"/></g><rect x="250" y="${(f.y - 10 * f.k).toFixed(1)}" width="550" height="${(10 * f.k).toFixed(1)}" fill="transparent"/></g>`; };
  /* pás do moinho: varão de madeira, grade branca e vela de lona */
  const L = 78;
  const pas = [0, 90, 180, 270].map(a => `<g transform="rotate(${a} ${HX} ${HY})"><path d="M${HX} ${HY} L${HX} ${HY - L}" stroke="#3E1A0E" stroke-width="5.4" stroke-linecap="round"/><path d="M${HX} ${HY} L${HX} ${HY - L}" stroke="url(#dqVarao)" stroke-width="3" stroke-linecap="round"/><path d="M${HX + 2.4} ${HY - 14} V${HY - L + 2} H${HX + 17} V${HY - 14}Z" fill="#5E2A1A" opacity=".18"/><path d="M${HX + 2.4} ${HY - 15} V${HY - L + 3} Q${HX + 10} ${HY - L + 6} ${HX + 16} ${HY - L + 3} V${HY - 15} Q${HX + 10} ${HY - 18} ${HX + 2.4} ${HY - 15}Z" fill="url(#dqVela)" stroke="#8E3A22" stroke-width="1.3"/><path d="M${HX + 8} ${HY - 18} V${HY - L + 6} M${HX + 12.5} ${HY - 17} V${HY - L + 5}" stroke="#D6C6A8" stroke-width=".9" opacity=".8"/><g stroke="#FBF6EA" stroke-width="1.3">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => `<path d="M${HX + 1} ${HY - 16 - k * 7.4} H${HX + 17.5}"/>`).join('')}</g><path d="M${HX + 17.5} ${HY - 13} V${HY - L + 1}" stroke="#FBF6EA" stroke-width="2"/><path d="M${HX + 17.5} ${HY - 13} V${HY - L + 1}" stroke="#7A3A22" stroke-width=".7" opacity=".6"/><path d="M${HX - 2} ${HY - 16} L${HX - 2} ${HY - L + 4} L${HX - 6.5} ${HY - L + 4} L${HX - 6.5} ${HY - 16}Z" fill="#F2E8D6" stroke="#8E3A22" stroke-width="1"/></g>`).join('');
  /* pedras da proteção do dique, uma a uma */
  const pedras = (() => { const ux = .4472, uy = -.8944, nx = .8944, ny = .4472; let o = '', s0 = 1, k = 0;
    while (s0 < 150) { const w = R(10, 13.5), d = R(10.5, 13), cx = 56 + ux * (s0 + w / 2) + nx * (d / 2 + .6), cy = 452 + uy * (s0 + w / 2) + ny * (d / 2 + .6);
      const p = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [cx + ux * a * w / 2 + nx * b * d / 2 + R(-1, 1), cy + uy * a * w / 2 + ny * b * d / 2 + R(-1, 1)]);
      o += `<path d="M${p.map(q => F(q[0]) + ' ' + F(q[1])).join(' L')}Z" fill="url(#dqPd${k % 3})" stroke="#2E2E38" stroke-width="1.2" stroke-linejoin="round"/><path d="M${F(p[0][0] + ux * 1.6)} ${F(p[0][1] + uy * 1.6 + 1)} L${F(p[1][0] - ux * 1.6)} ${F(p[1][1] - uy * 1.6 + 1)}" stroke="#EEF0F8" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>`;
      s0 += w + R(.6, 1.6); k++; }
    let g = ''; for (let i = 0; i < 46; i++) { const s1 = R(4, 148), dd = R(14.5, 19); g += `<circle cx="${F(56 + ux * s1 + nx * dd)}" cy="${F(452 + uy * s1 + ny * dd)}" r="${F(R(.9, 1.9))}"/>`; }
    return `<g fill="#8A8A96" stroke="#4E4E5A" stroke-width=".5">${g}</g>${o}`; })();
  /* chão em corte */
  const linha = (x0, x1, yf, amp, passo) => { passo = passo || 30; let d = `M${x0} ${F(yf(x0))}`, i = 0;
    for (let x = x0; x < x1; x += passo, i++) { const xm = x + passo / 2, xe = Math.min(x1, x + passo); d += ` Q${F(xm)} ${F(yf(xm) + (i % 2 ? amp : -amp))} ${F(xe)} ${F(yf(xe))}`; }
    return d; };
  const camada = (yf, amp, fill, esc) => `<path d="${linha(0, 800, yf, amp)} V500 H0Z" fill="${fill}" stroke="${esc}" stroke-width="1.4"/>`;
  const topoTurfa = x => x < 352 ? Math.min(470, baseY(x) - 3) : SUP + 3, topoArgila = x => 446 + Math.max(0, 300 - x) * .06, topoAreia = x => 477 + Math.max(0, 300 - x) * .03;
  const DQ_TOPO = `M56 452 L138 288 Q141 281 148 280 H153 V${NB} H179 V${CR} H191 V${NB} H217 V${CR} H229 V${NB} H255 V${CR} H262 Q269 281 273 288 L328 370 Q334 380 352 388`;
  const DIQUE = `${DQ_TOPO} L352 392 L56 456Z`;
  const NUCLEO = `M86 449.5 L150 324 Q156 317 165 317 H236 Q245 317 250 324 L300 403.2Z`;
  const GRAMA = `M${F(faceX(318))} 318 L138 288 Q141 281 148 280 H153 M179 ${CR} H191 M217 ${CR} H229 M255 ${CR} H262 Q269 281 273 288 L328 370 Q334 380 352 388`;
  const PRACA = `M606 ${RUA} V410 H624 V428 H642 V446 H660 V${PLZ} H740 V446 H758 V428 H776 V410 H794 V${RUA}Z`;
  /* casinhas ao longe (névoa) */
  const longe = `<g opacity=".9">
      ${[[262, '#A9C9C0'], [300, '#B7CFB0'], [338, '#A6C3CC'], [372, '#B4CCA6'], [560, '#A9C6C8'], [592, '#B9CDB0']].map(([x, cor], i) => `<path d="${copa(x, HOR - 7 - (i % 2) * 2, 15, 9, 9, .25)}" fill="${cor}"/>`).join('')}
      ${[284, 352, 578].map(x => `<path d="M${x} ${HOR} V${HOR - 26}" stroke="#9AB0A8" stroke-width="1.6"/><path d="${copa(x, HOR - 28, 3.6, 9, 7, .2)}" fill="#A2BDB4"/>`).join('')}
      <g fill="#B9C9D0" stroke="#93A8B4" stroke-width=".8"><path d="M416 ${HOR} V${HOR - 12} L424 ${HOR - 18} L432 ${HOR - 12} V${HOR}Z"/><path d="M432 ${HOR} V${HOR - 9} H452 V${HOR}Z" fill="#C9B9B0"/><path d="M430 ${HOR - 9} L442 ${HOR - 15} L454 ${HOR - 9}Z" fill="#C49A90"/><path d="M466 ${HOR} V${HOR - 26} L470 ${HOR - 40} L474 ${HOR - 26} V${HOR}Z"/><path d="M460 ${HOR} V${HOR - 12} H480 V${HOR}Z"/></g>
      <g stroke="#E8EEF2" stroke-width="1.6" stroke-linecap="round" opacity=".95">${[[318, 34], [346, 28]].map(([x, h]) => `<path d="M${x} ${HOR} V${HOR - h}"/><g class="dq-turb" style="transform-box:view-box;transform-origin:${x}px ${HOR - h}px"><path d="M${x} ${HOR - h} l0 -12 M${x} ${HOR - h} l10.4 6 M${x} ${HOR - h} l-10.4 6" stroke-width="1.4"/></g>`).join('')}</g>
      <g stroke="#9AB4BC" fill="#B4C8CE" stroke-width=".9"><g transform="translate(405 ${HOR})"><path d="M-3 0 L-2 -15 H2 L3 0Z"/><path d="M0 -15 l-9 -9 M0 -15 l9 -9 M0 -15 l-9 9 M0 -15 l9 9" stroke-width="1.6" fill="none"/></g><g transform="translate(628 ${HOR - 1})"><path d="M-3 0 L-2 -14 H2 L3 0Z"/><path d="M0 -14 l-8 -8 M0 -14 l8 -8 M0 -14 l-8 8 M0 -14 l8 8" stroke-width="1.5" fill="none"/></g></g>
    </g>`;
  const svg = `<svg viewBox="0 0 800 500" role="img" aria-label="Terra dos diques: o mar mais alto que os campos, um dique com buracos, moinho, campo de tulipas, cidade com praça d'água, cegonha, foca, ovelha e patos">
    <defs>
      <linearGradient id="dqCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E9EE0"/><stop offset=".42" stop-color="#93CBF2"/><stop offset=".62" stop-color="#D6ECF8"/><stop offset=".75" stop-color="#FFF2DA"/><stop offset="1" stop-color="#FFE9C4"/></linearGradient>
      <radialGradient id="dqSolHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".9"/><stop offset=".4" stop-color="#FFE27A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
      <linearGradient id="dqNevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F8FA" stop-opacity="0"/><stop offset=".7" stop-color="#EEF6F4" stop-opacity=".55"/><stop offset="1" stop-color="#EEF6F2" stop-opacity=".75"/></linearGradient>
      <linearGradient id="dqMar" gradientUnits="userSpaceOnUse" x1="0" y1="290" x2="0" y2="456"><stop offset="0" stop-color="#4FC2E6"/><stop offset=".22" stop-color="#2690C8"/><stop offset=".6" stop-color="#14609E"/><stop offset="1" stop-color="#0B3768"/></linearGradient>
      <linearGradient id="dqOnda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6EAFA"/><stop offset="1" stop-color="#4FB8E0" stop-opacity="0"/></linearGradient>
      <linearGradient id="dqRaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6FAFF" stop-opacity=".3"/><stop offset="1" stop-color="#E6FAFF" stop-opacity="0"/></linearGradient>
      <linearGradient id="dqFundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2C88E"/><stop offset="1" stop-color="#B0905E"/></linearGradient>
      <linearGradient id="dqBanco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAEABC"/><stop offset=".18" stop-color="#E8CE90"/><stop offset=".5" stop-color="#C9A86C"/><stop offset="1" stop-color="#9C7E50"/></linearGradient>
      <linearGradient id="dqDique" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9765A"/><stop offset=".5" stop-color="#8E5E44"/><stop offset="1" stop-color="#6A4230"/></linearGradient>
      <linearGradient id="dqNucleo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E0A8"/><stop offset=".55" stop-color="#E6C584"/><stop offset="1" stop-color="#C9A262"/></linearGradient>
      <pattern id="dqAreia" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#E2C48A"/><circle cx="4" cy="3" r="1.3" fill="#C9A066"/><circle cx="12" cy="8" r="1.1" fill="#C9A066"/><circle cx="9" cy="2" r=".8" fill="#F6E2B8"/><circle cx="2" cy="9" r=".9" fill="#F6E2B8"/></pattern>
      <pattern id="dqAreiaP" width="18" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="3" r="1.1" fill="#B88E52" opacity=".55"/><circle cx="12" cy="9" r=".9" fill="#B88E52" opacity=".5"/><circle cx="9" cy="2" r=".8" fill="#FFF6DA" opacity=".8"/><circle cx="2" cy="10" r=".7" fill="#FFF6DA" opacity=".7"/><circle cx="15" cy="4" r=".6" fill="#8E6A3A" opacity=".5"/></pattern>
      <pattern id="dqArgP" width="34" height="16" patternUnits="userSpaceOnUse"><path d="M2 5 q6 -3 12 0 t12 0 M10 13 q5 -2.4 10 0 t9 0" stroke="#5E3A26" stroke-width=".9" fill="none" opacity=".35"/><path d="M4 9 q4 -2 8 0" stroke="#D9AA88" stroke-width=".9" fill="none" opacity=".45"/><ellipse cx="27" cy="7" rx="1.6" ry="1.1" fill="#C9B6A6" opacity=".7"/><ellipse cx="17" cy="2" rx="1" ry=".7" fill="#4E2E1E" opacity=".4"/></pattern>
      <linearGradient id="dqGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6E27A"/><stop offset="1" stop-color="#4E9A3A"/></linearGradient>
      <linearGradient id="dqArg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8927A"/><stop offset="1" stop-color="#7E5E46"/></linearGradient>
      <linearGradient id="dqPedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4B4C4"/><stop offset="1" stop-color="#76768A"/></linearGradient>
      <linearGradient id="dqPd0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8AABA"/><stop offset="1" stop-color="#5E6072"/></linearGradient>
      <linearGradient id="dqPd1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A968E"/><stop offset="1" stop-color="#5A564E"/></linearGradient>
      <linearGradient id="dqPd2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E98A8"/><stop offset="1" stop-color="#4A5262"/></linearGradient>
      <linearGradient id="dqCampo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6E2AA"/><stop offset=".35" stop-color="#9CCD78"/><stop offset="1" stop-color="#5EA43E"/></linearGradient>
      <linearGradient id="dqLama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B0AE88"/><stop offset=".4" stop-color="#8E8458"/><stop offset="1" stop-color="#5E4E30"/></linearGradient>
      <radialGradient id="dqPoca" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#F0FAFF"/><stop offset=".55" stop-color="#A8D6F0"/><stop offset="1" stop-color="#6A9EC2"/></radialGradient>
      <linearGradient id="dqCanal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AC8E2"/><stop offset=".45" stop-color="#3E8EB0"/><stop offset="1" stop-color="#1E5470"/></linearGradient>
      <linearGradient id="dqTurfa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A4630"/><stop offset=".6" stop-color="#4E3220"/><stop offset="1" stop-color="#3E2618"/></linearGradient>
      <pattern id="dqTurfaP" width="44" height="26" patternUnits="userSpaceOnUse"><path d="M3 4 q5 3 3 8 M20 2 q-3 5 1 9 q2 3 -1 6 M34 8 q4 3 2 9 M12 17 q4 2 6 7" stroke="#9A7656" stroke-width=".9" fill="none" opacity=".55"/><path d="M26 20 h7 M6 22 h5 M38 3 h4" stroke="#2E1A10" stroke-width="1.4" stroke-linecap="round" opacity=".45"/><circle cx="30" cy="14" r="1" fill="#C9A884" opacity=".4"/></pattern>
      <linearGradient id="dqArgSolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8C86"/><stop offset="1" stop-color="#6A6862"/></linearGradient>
      <pattern id="dqSeixos" width="40" height="22" patternUnits="userSpaceOnUse"><ellipse cx="8" cy="6" rx="3" ry="1.8" fill="#B4B0A6" stroke="#5A5650" stroke-width=".6"/><ellipse cx="28" cy="15" rx="2.2" ry="1.4" fill="#A8A296" stroke="#5A5650" stroke-width=".6"/><path d="M16 12 q5 -2 10 0 M32 4 q3 -1.4 6 0" stroke="#A6A49C" stroke-width=".8" fill="none"/></pattern>
      <linearGradient id="dqPalha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5E5A40"/><stop offset=".3" stop-color="#8E8A62"/><stop offset=".5" stop-color="#ACA87C"/><stop offset=".72" stop-color="#86825C"/><stop offset="1" stop-color="#4E4A34"/></linearGradient>
      <linearGradient id="dqMuro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A8274"/><stop offset=".45" stop-color="#C6BCA6"/><stop offset="1" stop-color="#7A7264"/></linearGradient>
      <linearGradient id="dqVarao" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B86A3E"/><stop offset="1" stop-color="#7A3A1E"/></linearGradient>
      <linearGradient id="dqTijolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2704E"/><stop offset="1" stop-color="#8E3A26"/></linearGradient>
      <linearGradient id="dqTijolo2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94523E"/><stop offset="1" stop-color="#5A2C20"/></linearGradient>
      <pattern id="dqTijP" width="12" height="6" patternUnits="userSpaceOnUse"><path d="M0 .3 H12 M0 3.3 H12 M3 .3 V3.3 M9 3.3 V6.3" stroke="#3E1A10" stroke-width=".6" opacity=".35" fill="none"/><path d="M0 1 H12" stroke="#FFD2B8" stroke-width=".5" opacity=".18"/></pattern>
      <linearGradient id="dqOcre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6CE84"/><stop offset="1" stop-color="#C8904A"/></linearGradient>
      <linearGradient id="dqCinza" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A9A92"/><stop offset="1" stop-color="#46605E"/></linearGradient>
      <linearGradient id="dqMadeira" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2E8F2"/><stop offset="1" stop-color="#94B8CE"/></linearGradient>
      <linearGradient id="dqVela" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFBF2"/><stop offset=".6" stop-color="#F2E6D0"/><stop offset="1" stop-color="#D8C6A6"/></linearGradient>
      <linearGradient id="dqCapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5AAE78"/><stop offset="1" stop-color="#1E5A3A"/></linearGradient>
      <linearGradient id="dqVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDF4FF"/><stop offset=".5" stop-color="#8CBCE0"/><stop offset="1" stop-color="#3E6A9A"/></linearGradient>
      <linearGradient id="dqConcreto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8CCB8"/><stop offset="1" stop-color="#A69680"/></linearGradient>
      <pattern id="dqAzulejo" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#9A8C78"/><rect x=".5" y=".5" width="11" height="7" rx="1" fill="#D6C8B0"/><rect x="1.4" y="1.2" width="9" height="2" rx="1" fill="#E8DCC6" opacity=".8"/></pattern>
      <pattern id="dqMosaico" width="16" height="6" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#FF8A5A"/><rect x="4" width="4" height="3" fill="#FFD447"/><rect x="8" width="4" height="3" fill="#5AB8E6"/><rect x="12" width="4" height="3" fill="#7CCB5A"/><rect y="3" width="4" height="3" fill="#5AB8E6"/><rect x="4" y="3" width="4" height="3" fill="#FF8AB8"/><rect x="8" y="3" width="4" height="3" fill="#FFD447"/><rect x="12" y="3" width="4" height="3" fill="#FF8A5A"/><path d="M0 0 H16 M0 3 H16 M4 0 V6 M8 0 V6 M12 0 V6" stroke="#fff" stroke-width=".5"/></pattern>
      <pattern id="dqPavim" width="10" height="7" patternUnits="userSpaceOnUse"><rect width="10" height="7" fill="#B49A86"/><rect x=".5" y=".5" width="9" height="2.6" rx=".8" fill="#C9AE98"/><rect x="-4.5" y="3.9" width="9" height="2.6" rx=".8" fill="#C2A28C"/><rect x="5.5" y="3.9" width="9" height="2.6" rx=".8" fill="#CDB49E"/></pattern>
      <linearGradient id="dqAguaP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD0F2" stop-opacity=".95"/><stop offset="1" stop-color="#2E7BC6" stop-opacity=".95"/></linearGradient>
      <linearGradient id="dqCasco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E6A9A"/><stop offset="1" stop-color="#1E3A62"/></linearGradient>
      <linearGradient id="dqTeto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6DE74"/><stop offset="1" stop-color="#5E9A3E"/></linearGradient>
      <linearGradient id="dqRua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B4A2"/><stop offset="1" stop-color="#9A8270"/></linearGradient>
      <linearGradient id="dqFocaAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CBDE5" stop-opacity=".97"/><stop offset=".7" stop-color="#3AAADC" stop-opacity=".93"/><stop offset="1" stop-color="#2E9ED4" stop-opacity=".2"/></linearGradient>
      <radialGradient id="dqSolG" cx=".4" cy=".38" r=".6"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".55" stop-color="#FFD24D"/><stop offset="1" stop-color="#F5A81E"/></radialGradient>
      <clipPath id="dqMarClip"><path d="M0 0 H160 V280 L144 288 L62 452 V472 H0Z"/></clipPath>
      <linearGradient id="dqArcoF" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="320"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="dqArcoM" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="500"><rect width="800" height="500" fill="url(#dqArcoF)"/></mask>
      <clipPath id="dqPracaClip"><path d="${PRACA}"/></clipPath>
      <clipPath id="dqCampoClip"><rect x="250" y="${HOR}" width="550" height="${SUP - HOR + 2}"/></clipPath>
      <clipPath id="dqDiqueClip"><path d="${DIQUE}"/></clipPath>
      <radialGradient id="dqVinheta" cx=".5" cy=".45" r=".78"><stop offset=".6" stop-color="#0A1A3A" stop-opacity="0"/><stop offset="1" stop-color="#0A1A3A" stop-opacity=".32"/></radialGradient>
      <filter id="dqGrao"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .055 0"/></filter>
      <filter id="dqSombra" x="-10%" y="-10%" width="130%" height="130%"><feGaussianBlur stdDeviation="2.2"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#dqCeu)"/>
    <circle cx="70" cy="60" r="110" fill="url(#dqSolHalo)"/>
    <g id="dq-sol" class="toque"><circle cx="70" cy="60" r="50" fill="#FFE27A" opacity=".22"/><circle cx="70" cy="60" r="36" fill="#FFE27A" opacity=".3"/><circle cx="70" cy="60" r="25" fill="url(#dqSolG)" stroke="#F0A81E" stroke-width="2.4"/><path d="M57 51 q8 -8 18 -8" stroke="#FFF6C8" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="70" cy="60" r="48" fill="transparent"/></g>
    <g opacity=".55"><use href="#nuvem" x="230" y="196" width="150" height="30" style="color:#fff"/><use href="#nuvem" x="560" y="214" width="130" height="24" style="color:#FFF6EA"/></g>
    <g class="deriva"><use href="#nuvem" x="180" y="34" width="120" height="58" style="color:#fff" opacity=".95"/><use href="#nuvem" x="196" y="52" width="80" height="34" style="color:#E6F0FA"/><use href="#nuvem" x="390" y="70" width="86" height="40" style="color:#fff" opacity=".85"/></g>
    <g id="dq-arco" mask="url(#dqArcoM)" style="opacity:0;transition:opacity 2.4s;pointer-events:none">${['#FF6B5A', '#FFB347', '#FFE27A', '#7CCB5A', '#5AAEFF', '#9A7BFF'].map((cor, i) => `<path d="M${330 + i * 7} 330 A${250 - i * 7} ${210 - i * 7} 0 0 1 ${830 - i * 7} 330" stroke="${cor}" stroke-width="7.4" fill="none" opacity=".55"/>`).join('')}</g>
    <g class="deriva" style="animation-duration:30s"><use href="#nuvem" x="640" y="120" width="96" height="44" style="color:#fff" opacity=".7"/><use href="#nuvem" x="20" y="150" width="70" height="32" style="color:#fff" opacity=".75"/></g>
    <g class="deriva" style="animation-duration:34s"><use href="#nuvem" x="520" y="22" width="70" height="32" style="color:#fff" opacity=".8"/></g>
    <g class="deriva" style="animation-duration:20s"><g style="animation:flutua 2.4s ease-in-out infinite alternate">${[[330, 140, 1], [352, 152, .75], [300, 160, .6]].map(([x, y, k]) => `<path d="M${x} ${y} q${-8 * k} ${-7 * k} ${-16 * k} ${-2 * k} M${x} ${y} q${8 * k} ${-7 * k} ${16 * k} ${-2 * k}" stroke="#3E4A6A" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g></g>
    <!-- longe: árvores, igreja, moinhos e cata-ventos na névoa -->
    ${longe}
    <rect x="240" y="${HOR - 46}" width="560" height="48" fill="url(#dqNevoa)"/>
    <!-- o pôlder -->
    <path d="M250 ${HOR} C380 ${HOR - 2} 560 ${HOR + 1} 800 ${HOR - 1} V${SUP + 2} H250Z" fill="url(#dqCampo)"/>
    <g stroke="#4E8A36" stroke-width="1" opacity=".55">${FILAS.map(f => `<path d="M250 ${f.y + 1.5} H800"/>`).join('')}</g>
    <g>${[[324.5, 1.3], [348.5, 2]].map(([y, w]) => `<path d="M250 ${y} H800" stroke="#2E6A8E" stroke-width="${w + 1}"/><path d="M250 ${y} H800" stroke="#8ED4F0" stroke-width="${w}"/><path d="M250 ${y - w * .25} H800" stroke="#fff" stroke-width=".6" stroke-dasharray="14 22" opacity=".8"/>`).join('')}</g>
    <g id="dq-filas" clip-path="url(#dqCampoClip)">${FILAS.map(filaSvg).join('')}</g>
    <g id="dq-lama" clip-path="url(#dqCampoClip)" style="pointer-events:none"><path d="M250 ${HOR} C380 ${HOR - 2} 560 ${HOR + 1} 800 ${HOR - 1} V${SUP + 2} H250Z" fill="url(#dqLama)" opacity=".95"/>
      <g stroke="#3E2E1A" stroke-width="1.1" opacity=".5">${FILAS.map(f => `<path d="M250 ${f.y} H800"/>`).join('')}</g>
      <g stroke="#C6E0EC" stroke-width="1.2" opacity=".6">${[324.5, 348.5].map(y => `<path d="M250 ${y} H800"/>`).join('')}</g>
      ${[[300, 316, 16, 2.2], [372, 330, 20, 3], [440, 346, 26, 4.4], [560, 322, 18, 2.6], [620, 352, 30, 5], [690, 334, 22, 3.4], [760, 356, 26, 4.4], [480, 372, 22, 4.4], [600, 376, 28, 5], [720, 374, 16, 3.4], [350, 362, 22, 3.8], [520, 308, 14, 1.8]].map(([x, y, rx, ry]) => `<g class="dq-poca" style="transform-box:fill-box;transform-origin:50% 50%;transition:transform .6s"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dqPoca)" stroke="#4E6E8E" stroke-width="1"/><path d="M${x - rx * .5} ${y - ry * .3} h${rx * .5}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/></g>`).join('')}
      <g stroke="#6E8A3E" stroke-width="1.1">${Array.from({ length:40 }, () => { const x = R(254, 798), y = R(HOR + 6, 382); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-1 -4 M${x.toFixed(0)} ${y.toFixed(0)} l2 -4"/>`; }).join('')}</g></g>
    <path d="M250 ${HOR + 1} C380 ${HOR - 1} 560 ${HOR + 2} 800 ${HOR}" stroke="#EEF6E6" stroke-width="2" fill="none" opacity=".55"/>
    <!-- banco de areia e mar -->
    <path d="M-12 458 C-6 420 4 ${AREIA + 3} 28 ${AREIA} C50 ${AREIA - 3} 72 ${AREIA} 90 ${AREIA + 8} C104 ${AREIA + 22} 110 430 118 458Z" fill="url(#dqBanco)" stroke="#A8864E" stroke-width="1.8"/>
    <path d="M12 ${AREIA + 6} C24 ${AREIA + 1} 44 ${AREIA - 2} 70 ${AREIA + 2}" stroke="#FFF6DA" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M8 ${AREIA + 22} q8 -3 16 0 t16 0 t16 0 M14 ${AREIA + 36} q8 -3 16 0 t16 0 t16 0" stroke="#A8864E" stroke-width="1.1" fill="none" opacity=".55"/>
    <g fill="#FFE0C8" stroke="#B88A6A" stroke-width="1">${[[20, AREIA + 12], [62, AREIA + 8], [40, AREIA + 44]].map(([x, y]) => `<path d="M${x} ${y} c0 -6 9 -6 9 0Z"/><path d="M${x + 4.5} ${y - 4} v4" stroke-width=".6"/>`).join('')}</g>
    <g clip-path="url(#dqMarClip)"><rect id="dq-mar" x="0" y="${MAR0}" width="180" height="300" fill="url(#dqMar)" opacity=".9"/>
      <g id="dq-ondas" transform="translate(0 ${MAR0})">
        <path d="M0 2 L22 2 L40 150 L6 150Z M54 2 L70 2 L104 150 L74 150Z M108 2 L118 2 L146 150 L128 150Z" fill="url(#dqRaio)"/>
        <g id="dq-ondas-in2"><path d="M-40 3 ${Array.from({ length:12 }, () => 'q8 -4 16 0 q8 3 16 0').join(' ')} V14 H-40Z" fill="url(#dqOnda)" opacity=".55"/></g>
        <g id="dq-ondas-in"><path d="M-40 0 ${Array.from({ length:12 }, () => 'q10 -5 20 0').join(' ')} V8 H-40Z" fill="#8ADCF4" opacity=".85"/><path d="M-40 0 ${Array.from({ length:12 }, () => 'q10 -5 20 0').join(' ')}" stroke="#F2FBFF" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#fff" opacity=".9">${[6, 30, 52, 78, 104, 128].map((x, i) => `<ellipse cx="${x}" cy="${-2 + (i % 2)}" rx="3.4" ry="1.4"/>`).join('')}</g></g>
        <path d="M10 16 q8 2 16 0 M60 26 q8 2 16 0 M110 14 q8 2 16 0 M34 40 q8 2 16 0 M80 54 q8 2 16 0" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".6"/>
      </g>
      <g opacity=".75"><g style="animation:flutua 2.8s ease-in-out infinite alternate">${[[24, 414, 1], [44, 424, .8], [16, 432, .7]].map(([x, y, k]) => `<path d="M${x} ${y} c${4 * k} ${-4 * k} ${10 * k} ${-4 * k} ${13 * k} 0 c${-3 * k} ${4 * k} ${-9 * k} ${4 * k} ${-13 * k} 0Z M${x} ${y} l${-4 * k} ${-3 * k} v${6 * k}Z" fill="#0E3A66" stroke="#0A2A4E" stroke-width=".6"/><circle cx="${x + 10 * k}" cy="${y - .8 * k}" r="${.8 * k}" fill="#BFE6FF"/>`).join('')}</g></g>
    </g>
    <ellipse cx="46" cy="${AREIA + 2}" rx="32" ry="2.6" fill="#6E5430" opacity=".28"/>
    <g id="dq-foca" class="toque" data-fig="focacomum"><g id="dq-foca-pos"><g id="dq-foca-in"><svg x="4" y="${AREIA - 46}" width="84" height="50" viewBox="0 0 150 90"><use href="#f-focacomum"/></svg><g id="dq-foca-onda" style="opacity:0;transition:opacity .4s"><path d="M0 ${AREIA - 12} q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V${AREIA + 6} H0Z" fill="url(#dqFocaAgua)"/><path d="M0 ${AREIA - 12} q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#F2FBFF" stroke-width="2.4" fill="none" stroke-linecap="round"/></g></g></g>${brilhoHotspot(84, AREIA - 42)}</g>
    <!-- chão em corte: turfa, argila e areia -->
    <path d="${linha(0, 800, topoTurfa, 1.4)} V500 H0Z" fill="url(#dqTurfa)" stroke="#2E1A10" stroke-width="1.4"/>
    <path d="${linha(0, 800, topoTurfa, 1.4)} V500 H0Z" fill="url(#dqTurfaP)"/>
    <g stroke="#B08A62" stroke-width="1.1" fill="none" opacity=".5">${Array.from({ length:30 }, () => { const x = R(360, 796), y = R(392, 436); return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${R(-6, 6).toFixed(0)} 5 ${R(-4, 4).toFixed(0)} ${R(8, 14).toFixed(0)}"/>`; }).join('')}</g>
    <path d="M0 450 Q16 446 32 450 T64 452 L66 462 Q34 470 0 472Z" fill="url(#dqFundo)" stroke="#A8864E" stroke-width="1.2"/>
    ${camada(topoArgila, 3, 'url(#dqArgSolo)', '#4E4C46')}<path d="${linha(0, 800, topoArgila, 3)} V500 H0Z" fill="url(#dqSeixos)"/>
    ${camada(topoAreia, 2.4, 'url(#dqNucleo)', '#A8885A')}<path d="${linha(0, 800, topoAreia, 2.4)} V500 H0Z" fill="url(#dqAreiaP)"/>
    <text x="566" y="430" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#F0DCC2" stroke="#2E1A10" stroke-opacity=".6" stroke-width="2.6" paint-order="stroke">turfa</text>
    <!-- algas na frente (mar) -->
    <g class="balanca" style="animation-duration:4.6s">${[[10, 474, 58, '#2E7A5A', '#6EC08A'], [22, 474, 44, '#3E6A2A', '#8EBA4E'], [34, 474, 50, '#2E7A5A', '#6EC08A']].map(([x, y, h, a, b]) => `<path d="M${x} ${y} q-6 -${h / 3} 1 -${h * .6} q6 -${h / 5} -1 -${h * .4}" stroke="${a}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-6 -${h / 3} 1 -${h * .6} q6 -${h / 5} -1 -${h * .4}" stroke="${b}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <!-- o dique: corpo de argila, núcleo de areia, pedras e grama -->
    <path d="${DIQUE}" fill="url(#dqDique)" stroke="#3E2418" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="${DIQUE}" fill="url(#dqArgP)"/>
    <g clip-path="url(#dqDiqueClip)">
      <path d="${NUCLEO}" fill="#4E2E1E" opacity=".25" transform="translate(0 -3)" filter="url(#dqSombra)"/>
      <path d="${NUCLEO}" fill="url(#dqNucleo)" stroke="#A8804A" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="${NUCLEO}" fill="url(#dqAreiaP)"/>
      <path d="M156 322 Q160 320 166 320 H234" stroke="#FFF6DA" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M56 456 L352 392" stroke="#2E1A10" stroke-width="5" opacity=".25"/>
    </g>
    ${pedras}
    <g>${[[50, 452, 9, 6], [64, 455, 7, 5], [40, 456, 6, 4.4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dqPd0)" stroke="#2E2E38" stroke-width="1.2"/><path d="M${x - rx * .5} ${y - ry * .5} q${rx * .4} ${-ry * .4} ${rx * .8} 0" stroke="#EEF0F8" stroke-width="1.2" fill="none" opacity=".7"/>`).join('')}</g>
    <text x="196" y="378" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#8A6230" stroke="#FFF2CC" stroke-width="2.6" paint-order="stroke" opacity=".95">areia</text>
    <text x="290" y="358" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#FFF0DE" stroke="#4E2E1E" stroke-opacity=".65" stroke-width="2.6" paint-order="stroke">argila</text>
    <path d="${GRAMA}" stroke="#2E6A22" stroke-width="9.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${GRAMA}" stroke="url(#dqGrama)" stroke-width="6.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M${F(faceX(312))} 312 L136 290 M266 285 L276 296 M290 322 L322 368" stroke="#D2F6A8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>
    <g stroke="#3E8A2A" stroke-width="1.5" fill="none" stroke-linecap="round">${[[124, 314], [130, 302], [146, 278], [184, 278], [188, 278], [222, 278], [226, 278], [258, 278], [272, 290], [284, 306], [298, 328], [312, 348], [326, 368], [342, 384]].map(([x, y]) => `<path d="M${x} ${y} l-2 -5 M${x} ${y} l2 -6 M${x} ${y} l.4 -4"/>`).join('')}</g>
    <g>${[[278, 296], [292, 318], [306, 340], [318, 360], [128, 306]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" stroke="#C9C2A0" stroke-width=".6"/><circle cx="${x}" cy="${y}" r=".8" fill="#FFD447"/>`).join('')}</g>
    <g id="dq-vagas">${NOTCH.map((x, i) => `<g class="dq-vaga" data-i="${i}"><rect x="${x - 13}" y="${CR}" width="26" height="${NB - CR}" fill="#3E2416" opacity=".45"/><path d="M${x - 13} ${CR + 4} h26" stroke="#2E1A10" stroke-width="3" opacity=".3"/><path d="M${x - 13} ${CR} V${NB} H${x + 13} V${CR}" stroke="#3E2416" stroke-width="1.6" fill="none" stroke-dasharray="3 3"/><g class="dq-vaga-hint">${brilhoHotspot(x, CR - 10)}</g></g>`).join('')}</g>
    <g id="dq-espuma" transform="translate(${F(faceX(MAR0))} ${MAR0})" pointer-events="none"><g id="dq-espuma-in"><path d="M-34 1 q5 -6 11 -2 q5 -6 11 -1 q5 -5 9 0 q3 -3 5 2 q-18 4 -36 1Z" fill="#fff" opacity=".9"/><circle cx="-1" cy="-8" r="2.2" fill="#fff" opacity=".85"/><circle cx="3" cy="-14" r="1.5" fill="#fff" opacity=".7"/><circle cx="-6" cy="-12" r="1.3" fill="#fff" opacity=".7"/></g></g>
    <g id="dq-ovelhas" class="toque"><g id="dq-ovelha-in">${ovelha(305, 327, .7, false)}${ovelha(286, 301, .5, false)}</g><rect x="270" y="286" width="54" height="52" fill="transparent"/></g>
    <g id="dq-nivel" style="opacity:0;transition:opacity 1.2s;pointer-events:none"><path d="M130 ${MAR_ALTO} H600" stroke="#12235A" stroke-width="3.6" stroke-dasharray="10 7" opacity=".3"/><path d="M130 ${MAR_ALTO} H600" stroke="#fff" stroke-width="2" stroke-dasharray="10 7"/>
      <text x="300" y="${MAR_ALTO - 8}" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="#12235A" stroke-opacity=".6" stroke-width="3.4" paint-order="stroke">nível do mar</text>
      <path d="M362 ${MAR_ALTO + 6} V${SUP - 6}" stroke="#12235A" stroke-width="4.6" opacity=".3"/><path d="M362 ${MAR_ALTO + 6} V${SUP - 6}" stroke="#fff" stroke-width="2.6"/><path d="M355 ${MAR_ALTO + 14} L362 ${MAR_ALTO + 4} L369 ${MAR_ALTO + 14} M355 ${SUP - 14} L362 ${SUP - 4} L369 ${SUP - 14}" stroke="#fff" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    </g>
    <!-- canal com margens -->
    <path d="M376 ${SUP + 8} C378 400 390 422 412 424 H452 C474 422 484 400 486 ${SUP + 8}Z" fill="#3E2416" opacity=".55"/>
    <path d="M383 ${CAN} H478 C476 402 466 416 446 416 H410 C394 416 386 404 383 ${CAN}Z" fill="url(#dqCanal)" stroke="#1E4E6A" stroke-width="1.8"/>
    <path d="M392 ${CAN + 12} q6 2 12 0 M436 ${CAN + 22} q6 2 12 0 M410 ${CAN + 34} q6 2 12 0" stroke="#BFE6FF" stroke-width="1.4" fill="none" opacity=".7"/>
    <path d="M383 ${CAN} H478" stroke="#E6F6FF" stroke-width="2.2"/>
    <path d="M334 ${SUP + 4} C348 382 362 364 377 363 C385 363 388 367 389 ${CAN + 3} C388 378 387 ${SUP} 386 ${SUP + 6}Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.6"/>
    <path d="M362 374 q6 -9 15 -10" stroke="#D2F6A8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <g id="dq-fluxo-canal" style="opacity:0;transition:opacity .6s"><path d="M470 ${CAN + 8} H388" stroke="#E6F6FF" stroke-width="2" stroke-dasharray="6 10" fill="none"/></g>
    <!-- montinho do moinho e valeta -->
    <path d="M466 ${SUP + 3} C468 374 476 364 490 362 H556 C560 366 562 374 563 ${SUP + 1}Z" fill="url(#dqGrama)" stroke="#2E6A22" stroke-width="1.8"/>
    <path d="M472 372 q6 -8 16 -9" stroke="#D2F6A8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M556 ${SUP} H600" stroke="#3E8A2A" stroke-width="3"/>
    <path d="M562 ${SUP} C564 400 566 410 575 410 C584 410 586 400 588 ${SUP}Z" fill="#5E4430" stroke="#3E2414" stroke-width="1.4"/>
    <path d="M564 398 C566 406 568 409 575 409 C582 409 584 406 586 398Z" fill="url(#dqCanal)" stroke="#1E4E6A" stroke-width="1"/>
    <g stroke="#3E7A2A" stroke-width="1.8" fill="none" stroke-linecap="round">${[560, 564, 586, 590].map(x => `<path d="M${x} ${SUP} q-1 -10 ${x < 575 ? -3 : 3} -16"/>`).join('')}</g>
    <g fill="#7A4A2A">${[[557, SUP - 18], [593, SUP - 17]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="4.4"/>`).join('')}</g>
    <g id="dq-patinho" class="toque"><g id="dq-patinho-in">${pato(575, 398, .6, true)}</g><rect x="562" y="384" width="26" height="18" fill="transparent"/></g>
    <g id="dq-rosca-g"><path d="M575 404 L474 360" stroke="#4E3A2A" stroke-width="12" stroke-linecap="round"/><path d="M575 404 L474 360" stroke="#C9A06A" stroke-width="8" stroke-linecap="round" opacity=".6"/><path id="dq-rosca-agua" d="M575 404 L474 360" stroke="#5AAEFF" stroke-width="6" stroke-linecap="round" style="opacity:0"/><path id="dq-rosca" d="M575 404 L474 360" stroke="#6E4A2A" stroke-width="9" stroke-dasharray="2.4 6" fill="none"/><path d="M474 360 q-5 -2 -9 4" stroke="#4E3A2A" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <!-- o moinho: base de pedra, corpo de palha, varanda e capota -->
    <g id="dq-moinho" class="toque" data-fig="moinho">
      <ellipse cx="525" cy="${SUP - 1}" rx="40" ry="4" fill="#1E3A12" opacity=".3"/>
      <path d="M493 ${SUP} L497 344 H553 L557 ${SUP}Z" fill="url(#dqMuro)" stroke="#3E3A30" stroke-width="2" stroke-linejoin="round"/>
      <g stroke="#4E4A40" stroke-width=".9">${[350, 358, 366, 374].map((y, i) => { let o = '', x = 495 + (i % 2) * 4; while (x < 553) { const w = R(7, 11), cor = ['#B8AE98', '#A69C86', '#CEC4AE', '#9A9480'][Math.floor(R(0, 4))]; o += `<rect x="${F(x)}" y="${y - 3.6}" width="${F(Math.min(w, 555 - x) - 1)}" height="6.6" rx="2.4" fill="${cor}"/>`; x += w; } return o; }).join('')}</g>
      <path d="M496 346 H554" stroke="#E6DCC6" stroke-width="1.4" opacity=".7"/>
      <path d="M516 ${SUP} V368 C516 359 534 359 534 368 V${SUP}Z" fill="#2E5A3A" stroke="#12351E" stroke-width="1.4"/><path d="M513 ${SUP} V368 C513 355 537 355 537 368 V${SUP}" stroke="#E6DCC6" stroke-width="2.4" fill="none" opacity=".85"/><path d="M525 362 V${SUP}" stroke="#12351E" stroke-width="1"/><circle cx="530" cy="374" r="1.2" fill="#FFD447"/>
      <path d="M500 344 L512 278 H538 L550 344Z" fill="url(#dqPalha)" stroke="#2E2A1E" stroke-width="2" stroke-linejoin="round"/>
      <g stroke-width="1" stroke-linecap="round">${Array.from({ length:30 }, (_, i) => { const t = (i + .5) / 30, x0 = 512 + t * 26, x1 = 500.5 + t * 49; return `<path d="M${F(x0)} 281 Q${F((x0 + x1) / 2 + R(-1.4, 1.4))} 312 ${F(x1)} 342" stroke="${i % 3 ? '#3E3A26' : '#D6D2A6'}" opacity="${i % 3 ? .35 : .5}" fill="none"/>`; }).join('')}</g>
      <path d="M509 296 L541 296 M506 316 L544 316" stroke="#3E3A26" stroke-width="1.4" opacity=".4"/>
      <path d="M520 278 L515 344 M530 278 L535 344" stroke="#2E2A1E" stroke-width="1" opacity=".45"/>
      <path d="M512 286 C510 306 508 326 505 342" stroke="#D6D2A6" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M517 300 h-3 v14 h3 M533 300 h3 v14 h-3" fill="#2E6A4A" stroke="#12351E" stroke-width=".8"/>
      <rect x="518" y="299" width="14" height="16" rx="2" fill="url(#dqVidro)" stroke="#F6F0E2" stroke-width="1.8"/><path d="M525 299 V315 M518 307 H532" stroke="#F6F0E2" stroke-width="1.2"/><path d="M520 303 l3 -2" stroke="#fff" stroke-width="1" opacity=".8"/>
      <path d="M484 344 H566" stroke="#3E2414" stroke-width="5" stroke-linecap="round"/><path d="M484 343 H566" stroke="#A8784A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M486 344 V332 M494 344 V332 M556 344 V332 M564 344 V332 M486 333 H500 M550 333 H564" stroke="#5E3A1E" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M488 346 L496 358 M562 346 L554 358" stroke="#5E3A1E" stroke-width="2" stroke-linecap="round"/>
      <path d="M507 280 C506 262 544 262 543 280Z" fill="url(#dqCapa)" stroke="#12351E" stroke-width="2" stroke-linejoin="round"/>
      <path d="M512 272 q10 -7 22 -5" stroke="#B6EEC6" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M509 278 H541" stroke="#12351E" stroke-width="1" opacity=".5"/>
      <path d="M538 276 L572 340" stroke="#3E2414" stroke-width="3.6" stroke-linecap="round"/><path d="M538 276 L572 340" stroke="#9A6A3E" stroke-width="1.6" stroke-linecap="round"/><path d="M552 302 L541 300" stroke="#5E3A1E" stroke-width="2" stroke-linecap="round"/>
      <g transform="translate(573 342)"><circle r="6" fill="none" stroke="#3E2414" stroke-width="2"/><path d="M-6 0 H6 M0 -6 V6 M-4.2 -4.2 L4.2 4.2 M-4.2 4.2 L4.2 -4.2" stroke="#7A4A2A" stroke-width="1.2"/></g>
      <g id="dq-moinho-hint">${brilhoHotspot(544, 326)}</g>
    </g>
    <g id="dq-pas-g" class="toque" style="cursor:grab"><g id="dq-pas">${pas}</g><path d="M${HX - 9} ${HY - 3} H${HX + 9} V${HY + 3} H${HX - 9}Z M${HX - 3} ${HY - 9} H${HX + 3} V${HY + 9} H${HX - 3}Z" fill="#5E3A1E"/><circle cx="${HX}" cy="${HY}" r="7" fill="#4E2E14" stroke="#2E1A0A" stroke-width="2"/><circle cx="${HX - 2}" cy="${HY - 2}" r="2.4" fill="#C9A07A"/><circle cx="${HX}" cy="${HY}" r="82" fill="transparent"/></g>
    <g id="dq-mao" style="display:none" pointer-events="none"><path d="M${HX - 64} ${HY - 50} q60 -56 124 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/><path d="M${HX + 62} ${HY - 50} l-14 -2 l8 -10Z" fill="#fff"/></g>
    <g id="dq-pato" class="toque"><g id="dq-pato-in">${pato(392, CAN, 1, false)}</g><rect x="378" y="${CAN - 20}" width="26" height="26" fill="transparent"/></g>
    <g id="dq-barco" class="toque"><g id="dq-barco-pos"><g style="animation:flutua 3s ease-in-out infinite alternate">
      <path d="M404 ${CAN - 8} H478 C474 ${CAN + 4} 468 ${CAN + 8} 458 ${CAN + 8} H418 C410 ${CAN + 8} 404 ${CAN + 2} 404 ${CAN - 8}Z" fill="url(#dqCasco)" stroke="#0E1E3A" stroke-width="2" stroke-linejoin="round"/>
      <path d="M406 ${CAN - 4} H476" stroke="#FFC83D" stroke-width="2.4"/><path d="M412 ${CAN - 9} H472" stroke="#8ABAE6" stroke-width="1.6" opacity=".7"/>
      <path d="M474 ${CAN - 8} V${CAN - 34}" stroke="#5E3A1E" stroke-width="2.4"/><path d="M474 ${CAN - 34} l11 4 l-11 4Z" fill="#FF8A3A" stroke="#A8441A" stroke-width=".8"/>
    </g></g><rect x="400" y="${CAN - 38}" width="84" height="48" fill="transparent"/></g>
    <!-- cidade: telhados ao longe -->
    <g fill="#B4C6D0" stroke="#98AEBC" stroke-width=".9" opacity=".9"><path d="M598 330 V306 L606 298 L614 306 V296 H624 V330Z"/><path d="M611 330 V282 H621 V330Z" fill="#A8BCC8"/><path d="M611 282 L616 262 L621 282Z" fill="#9AB0BE"/><path d="M609 283 H623" stroke-width="1.4"/><circle cx="616" cy="292" r="2.4" fill="#E6EEF2"/></g>
    <path d="M596 ${SUP - 6} H800 V${RUA} H596Z" fill="url(#dqPavim)" stroke="#6E5E52" stroke-width="1.4"/>
    <path d="M596 ${SUP - 6} H800 V${RUA} H596Z" fill="url(#dqRua)" opacity=".35"/>
    <path d="M596 ${SUP - 6} H800" stroke="#EADCCE" stroke-width="1.8"/><path d="M596 ${RUA - 1} H800" stroke="#6E5E52" stroke-width="1.6" opacity=".5"/>
    <g id="dq-casas">
      <g id="dq-casa1"><path d="M600 ${SUP - 6} V334 H640 V${SUP - 6}Z" fill="url(#dqMadeira)" stroke="#3E5A6E" stroke-width="1.8"/>
        <g stroke="#7A9AB0" stroke-width=".9" opacity=".8">${[339, 344, 349, 354, 359, 364, 369, 374].map(y => `<path d="M601 ${y} H639"/>`).join('')}</g>
        <path d="M601.5 335 V${SUP - 6} M638.5 335 V${SUP - 6}" stroke="#FFFFFF" stroke-width="2"/>
        <rect x="604" y="340" width="22" height="15" rx="1.6" fill="url(#dqVidro)" stroke="#FFFFFF" stroke-width="2"/><path d="M615 340 V355" stroke="#fff" stroke-width="1.4"/><path d="M606 343 l5 -2" stroke="#fff" stroke-width="1.6" opacity=".8"/>
        ${floreira(603, 356, 24, ['#E5392C', '#FF8AB8', '#FFFFFF'])}
        <path d="M629 ${SUP - 6} V358 H637 V${SUP - 6}Z" fill="#E5703A" stroke="#7A3010" stroke-width="1.4"/><rect x="631" y="361" width="4" height="5" rx="1" fill="url(#dqVidro)"/><circle cx="635.5" cy="370" r=".9" fill="#FFD447"/>
        <path d="M596 334 H644 V330 H596Z" fill="#6E4A2A" stroke="#3E2414" stroke-width="1.2"/>
        <path d="M597 330 ${Array.from({ length:9 }, (_, i) => `q2.6 -${5 + (i % 3)} 5.2 0`).join(' ')} V330Z" fill="url(#dqTeto)" stroke="#2E6A22" stroke-width="1.4"/>
        <path id="dq-teto-molhado" d="M597 330 ${Array.from({ length:9 }, (_, i) => `q2.6 -${5 + (i % 3)} 5.2 0`).join(' ')} V330Z" fill="#1E7A3A" opacity="0" style="transition:opacity 1.2s"/>
        <g>${[[602, 325, '#FF8AB8'], [610, 323, '#FFD447'], [619, 325, '#FFFFFF'], [628, 323, '#FF8AB8'], [637, 325, '#FFD447'], [606, 327, '#B57BFF'], [624, 327, '#FFFFFF']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="${c}" stroke="#6E5A3A" stroke-width=".5"/>`).join('')}</g>
      </g>
      <g id="dq-casa2"><path d="M640 ${SUP - 6} V304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304 V${SUP - 6}Z" fill="url(#dqTijolo)" stroke="#5E2414" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M640 ${SUP - 6} V304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304 V${SUP - 6}Z" fill="url(#dqTijP)"/>
        <path d="M640 304 C640 296 646 294 648 286 C650 278 654 272 661 268 C668 272 672 278 674 286 C676 294 682 296 682 304" stroke="#FFF6E6" stroke-width="2.8" fill="none"/>
        <path d="M640 304 q-3 -4 1 -7 M682 304 q3 -4 -1 -7" stroke="#FFF6E6" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M641 328.5 H681" stroke="#FFF6E6" stroke-width="1.6" opacity=".8"/>
        ${janela(646, 308, 11, 15, '#FFF6E6', '#F2B49A')}${janela(665, 308, 11, 15, '#FFF6E6', '#F2B49A')}${janela(646, 333, 11, 15, '#FFF6E6')}${janela(665, 333, 11, 15, '#FFF6E6')}
        ${floreira(645, 348, 13, ['#FFD447', '#E5392C'])}${floreira(664, 348, 13, ['#FF8AB8', '#FFFFFF'])}
        <rect x="657" y="280" width="8" height="10" rx="4" fill="url(#dqVidro)" stroke="#FFF6E6" stroke-width="1.4"/>
        <path d="M661 271 v-6 h9" stroke="#3E2414" stroke-width="2.2" fill="none"/><path d="M669 265 v4" stroke="#2A2220" stroke-width="1"/>
        ${ancoras([[651, 302], [671, 302]])}
        <path d="M652 ${SUP - 6} h18 v-2.4 h-18Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <path d="M654 ${SUP - 8} V362 C654 355 668 355 668 362 V${SUP - 8}Z" fill="#2E5A3A" stroke="#12351E" stroke-width="1.4"/><path d="M655.5 361 C656 357 666 357 666.5 361Z" fill="#FFF3D6"/><path d="M661 362 V${SUP - 8}" stroke="#12351E" stroke-width=".9"/>
        <path d="M643 304 V${SUP - 6}" stroke="#7A8090" stroke-width="2.6"/><path d="M643 304 V${SUP - 6}" stroke="#B8BCC8" stroke-width="1"/>
        <path id="dq-cano1" d="M643 304 V${SUP - 6}" stroke="#5AAEFF" stroke-width="2.4" stroke-dasharray="5 7" style="opacity:0"/>
      </g>
      <g id="dq-casa3"><path d="M682 ${SUP - 6} V296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728 V${SUP - 6}Z" fill="url(#dqTijolo2)" stroke="#3E1A10" stroke-width="1.8"/>
        <path d="M682 ${SUP - 6} V296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728 V${SUP - 6}Z" fill="url(#dqTijP)"/>
        <path d="M682 296 H688 V286 H694 V276 H700 V266 H710 V276 H716 V286 H722 V296 H728" stroke="#E6D2B8" stroke-width="2.4" fill="none"/>
        <g fill="#F2E6D2" stroke="#6E5A4A" stroke-width=".6">${[[681, 294.5, 8], [687, 284.5, 8], [693, 274.5, 8], [699, 264.5, 12], [710, 274.5, 7], [716, 284.5, 7], [722, 294.5, 7]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="2.6" rx=".6"/>`).join('')}</g>
        ${janela(688, 302, 11, 15, '#E6D2B8', '#B8705A')}${janela(706, 302, 11, 15, '#E6D2B8', '#B8705A')}${janela(688, 326, 11, 15, '#E6D2B8')}${janela(706, 326, 11, 15, '#E6D2B8')}
        <rect x="701" y="278" width="8" height="10" fill="url(#dqVidro)" stroke="#E6D2B8" stroke-width="1.4"/>
        ${ancoras([[692, 296], [714, 296]])}
        <path d="M697 ${SUP - 6} V356 H713 V${SUP - 6}Z" fill="#B0302A" stroke="#3E1010" stroke-width="1.4"/><path d="M697 356 C697 349 713 349 713 356" fill="#FFF3D6" stroke="#3E1010" stroke-width="1"/><path d="M705 350 v6 M700 352 l3 4 M710 352 l-3 4" stroke="#3E1010" stroke-width=".6"/><path d="M699 361 h12 v13 h-12Z" fill="none" stroke="#7A1E1A" stroke-width=".8"/><path d="M695 ${SUP - 6} h20 v-2.4 h-20Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <g class="toque" data-fig="tulipa" id="dq-vaso"><path d="M684 362 h13 l-2 6 h-9Z" fill="#C9674A" stroke="#5E2414" stroke-width="1"/><svg x="682" y="344" width="17" height="20" viewBox="0 0 100 120"><use href="#f-tulipa"/></svg>${brilhoHotspot(690, 344)}</g>
      </g>
      <g id="dq-casa4"><path d="M728 ${SUP - 6} V300 H734 C734 292 740 290 742 284 H758 C760 290 766 292 766 300 H770 V${SUP - 6}Z" fill="url(#dqOcre)" stroke="#7A4A1A" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M728 300 H734 C734 292 740 290 742 284 H758 C760 290 766 292 766 300 H770" stroke="#FFF6E6" stroke-width="2.6" fill="none"/>
        <path d="M741 283 H759 L757 279 H743Z" fill="#FFF6E6" stroke="#7A4A1A" stroke-width=".8"/><path d="M736 298 q2 -6 6 -6 M764 298 q-2 -6 -6 -6" stroke="#FFF6E6" stroke-width="1.6" fill="none"/>
        <path d="M729 324.5 H769" stroke="#FFF6E6" stroke-width="1.4" opacity=".8"/>
        ${janela(734, 306, 11, 15, '#FFF6E6')}${janela(753, 306, 11, 15, '#FFF6E6')}${janela(734, 330, 11, 15, '#FFF6E6')}${janela(753, 330, 11, 15, '#FFF6E6')}
        ${floreira(733, 322, 13, ['#E5392C', '#FFFFFF'])}${floreira(752, 322, 13, ['#B57BFF', '#FF8AB8'])}
        <circle cx="750" cy="292" r="4" fill="url(#dqVidro)" stroke="#FFF6E6" stroke-width="1.4"/>
        <path d="M741 ${SUP - 6} h18 v-2.4 h-18Z" fill="#D8CCB8" stroke="#5E564C" stroke-width=".7"/>
        <path d="M743 ${SUP - 8} V358 H757 V${SUP - 8}Z" fill="#2E4E8A" stroke="#12235A" stroke-width="1.4"/><path d="M745 360 h10 v6 h-10Z M745 368 h10 v6 h-10Z" fill="none" stroke="#5A7AB8" stroke-width=".8"/><circle cx="754.5" cy="367" r=".9" fill="#FFD447"/>
        <path d="M730 300 V${SUP - 6}" stroke="#7A8090" stroke-width="2.6"/><path d="M730 300 V${SUP - 6}" stroke="#B8BCC8" stroke-width="1"/>
        <path id="dq-cano2" d="M730 300 V${SUP - 6}" stroke="#5AAEFF" stroke-width="2.4" stroke-dasharray="5 7" style="opacity:0"/>
      </g>
      <g id="dq-casa5"><path d="M770 ${SUP - 6} V302 L790 280 L810 302 V${SUP - 6}Z" fill="url(#dqCinza)" stroke="#24363A" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M770 302 L790 280 L810 302" stroke="#E6EEEA" stroke-width="2.6" fill="none"/><path d="M786 284 L790 276 L794 284" fill="#E6EEEA" stroke="#24363A" stroke-width=".8"/>
        ${janela(776, 308, 10, 14, '#E6EEEA')}${janela(776, 332, 10, 14, '#E6EEEA')}${janela(792, 308, 10, 14, '#E6EEEA')}
        <rect x="787" y="290" width="6" height="7" rx="3" fill="url(#dqVidro)" stroke="#E6EEEA" stroke-width="1.2"/>
        <path d="M790 ${SUP - 6} V356 H802 V${SUP - 6}Z" fill="#E5A23C" stroke="#7A4A10" stroke-width="1.4"/><path d="M790 356 h12" stroke="#FFF6E6" stroke-width="1.6"/>
      </g>
    </g>
    <g id="dq-ninho"><path d="M686 266 C688 258 722 258 724 266 C722 272 688 272 686 266Z" fill="#9A6A3A" stroke="#4E2E14" stroke-width="1.6"/>${textura(705, 265, 16, 3, 10, '#5E3A1E', 1.2)}<path d="M688 262 l-6 -4 M720 262 l6 -5 M694 260 l-3 -6 M716 260 l2 -6" stroke="#6E4A2A" stroke-width="1.6" stroke-linecap="round"/></g>
    <g id="dq-pim" class="toque" data-fig="cegonha"><g id="dq-pim-in" style="transform-origin:705px 262px">
      <path d="M710 242 C720 244 726 252 724 260 C718 256 714 252 710 250Z" fill="#1E1E28" stroke="#0A0A10" stroke-width="1.2"/>
      <path d="M690 250 C690 238 702 234 712 236 C722 238 726 248 722 256 C718 264 698 266 692 260 C690 258 690 254 690 250Z" fill="#FFFFFF" stroke="#5A6787" stroke-width="1.6"/>
      <path d="M702 248 C710 244 720 246 724 254 C720 260 712 262 704 260 C700 256 700 252 702 248Z" fill="#26262E" stroke="#0A0A10" stroke-width="1.2"/>
      <path d="M706 252 q6 -2 12 1" stroke="#6A6A7A" stroke-width="1.1" fill="none"/>
      <path d="M696 242 C694 232 698 224 694 216" stroke="#5A6787" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M696 242 C694 232 698 224 694 216" stroke="#fff" stroke-width="5.6" fill="none" stroke-linecap="round"/>
      <circle cx="694" cy="212" r="7.4" fill="#fff" stroke="#5A6787" stroke-width="1.6"/>
      <g id="dq-bico-cima"><path d="M688 210 C680 210 672 214 666 218 C674 217 682 215 689 214Z" fill="#F0602A" stroke="#8A2A10" stroke-width="1.1" stroke-linejoin="round"/></g>
      <g id="dq-bico-baixo" style="transform-origin:689px 214px"><path d="M689 214 C682 216 674 218 666 218.5 C674 220 682 219 689 217Z" fill="#D8401E" stroke="#8A2A10" stroke-width="1" stroke-linejoin="round"/></g>
      <circle cx="692" cy="210" r="2.6" fill="#12121A"/><circle cx="691.2" cy="209.2" r=".9" fill="#fff"/>
      <ellipse cx="695" cy="216" rx="2.4" ry="1.3" fill="#FF9AB0" opacity=".6"/>
      <path d="M690 206 q4 -3 8 -1" stroke="#E2E8F2" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>${brilhoHotspot(722, 232)}<rect x="664" y="200" width="62" height="66" fill="transparent"/></g>
    <g id="dq-bicis" class="toque">${bici(676, RUA - 1, '#2E7BF6')}${bici(784, RUA - 1, '#E5392C')}<rect x="662" y="372" width="30" height="20" fill="transparent"/><rect x="770" y="372" width="30" height="20" fill="transparent"/></g>
    <g id="dq-ciclista" style="opacity:0;pointer-events:none"><g id="dq-ciclista-pos">${bici(0, CR - 2, '#FFC83D')}<g transform="translate(0 ${CR - 16})"><path d="M-2 0 L3 -6 M-2 0 l4 6 l3 0" stroke="#2E3A6A" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M-6 -2 C-6 -14 4 -16 6 -6Z" fill="#FF8A3A" stroke="#7A3A10" stroke-width="1"/><path d="M4 -12 l6 3" stroke="#C98A5A" stroke-width="2" stroke-linecap="round"/><circle cx="2" cy="-18" r="4.4" fill="#C98A5A" stroke="#6E3E1A" stroke-width="1"/><path d="M-2 -20 C-2 -25 6 -25 6 -20Z" fill="#2E7BF6"/></g></g></g>
    <!-- praça d'água: degraus com azulejos e chão de mosaico -->
    <path d="M601 ${RUA} V414 H619 V432 H637 V450 H655 V${PLZ + 4} H745 V450 H763 V432 H781 V414 H799 V${RUA}Z" fill="#8E8270" stroke="#4E463C" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="${PRACA}" fill="url(#dqAzulejo)" stroke="#5E564C" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M606 ${RUA} H794 V${RUA + 8} H606Z" fill="#3E3428" opacity=".16"/>
    <path d="M607 ${RUA + 11} H793 M625 ${RUA + 29} H775 M643 ${RUA + 47} H757 M661 ${RUA + 64} H739" stroke="#4FAEE0" stroke-width="3" stroke-dasharray="6 1.4" opacity=".8"/>
    <g fill="url(#dqConcreto)" stroke="#6E6252" stroke-width="1">${[[606, 410], [624, 428], [642, 446], [740, 446], [758, 428], [776, 410]].map(([x, y]) => `<rect x="${x}" y="${y}" width="18" height="4"/>`).join('')}</g>
    <path d="M606 410 H624 M624 428 H642 M642 446 H660 M740 446 H758 M758 428 H776 M776 410 H794" stroke="#FFFFFF" stroke-width="1.8" opacity=".9"/>
    <rect x="660" y="${PLZ - 7}" width="80" height="7" fill="url(#dqMosaico)" stroke="#6E6252" stroke-width=".8"/>
    <path d="M660 ${PLZ - 7} H740" stroke="#fff" stroke-width="1.2" opacity=".7"/>
    <g stroke="#4E463C" stroke-width=".8"><rect x="693" y="${PLZ - 5}" width="14" height="3.4" rx=".6" fill="#5E5650"/><path d="M696 ${PLZ - 5} v3.4 M700 ${PLZ - 5} v3.4 M704 ${PLZ - 5} v3.4"/></g>
    <g fill="#3FA864" stroke="#1E5A2E" stroke-width="1"><rect x="644" y="439" width="14" height="4.4" rx="1.5"/><rect x="742" y="439" width="14" height="4.4" rx="1.5"/><path d="M646 443.4 v2.6 M656 443.4 v2.6 M744 443.4 v2.6 M754 443.4 v2.6" stroke="#2E3A2E" stroke-width="1.4"/></g>
    <g>${[[615, 410], [785, 410]].map(([x, y]) => `<path d="M${x - 5} ${y} h10 l-1.4 -7 h-7.2Z" fill="#C9674A" stroke="#5E2414" stroke-width=".9"/><path d="${copa(x, y - 13, 7, 7, 8, .3)}" fill="#5EAE4A" stroke="#2E6A22" stroke-width="1"/><path d="M${x - 3} ${y - 16} q3 -3 6 -1" stroke="#B6EE8E" stroke-width="1.4" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g clip-path="url(#dqPracaClip)"><rect id="dq-praca-agua" x="600" y="${PLZ}" width="200" height="80" fill="url(#dqAguaP)"/><path id="dq-praca-brilho" d="M660 ${PLZ} h24 M700 ${PLZ} h16 M630 ${PLZ} h8" stroke="#E6F6FF" stroke-width="2" stroke-linecap="round" style="opacity:0"/></g>
    <g id="dq-escoa" style="opacity:0;transition:opacity .5s;pointer-events:none"><path d="M643 ${SUP - 4} Q630 ${SUP} 622 ${RUA + 6}" stroke="#5AAEFF" stroke-width="3" stroke-dasharray="5 6" fill="none" stroke-linecap="round"/><path d="M730 ${SUP - 4} Q744 ${SUP} 748 ${RUA + 10}" stroke="#5AAEFF" stroke-width="3" stroke-dasharray="5 6" fill="none" stroke-linecap="round"/><path d="M617 ${RUA + 2} l5 6 l3 -7 M744 ${RUA + 6} l4 6 l4 -6" stroke="#2E7BF6" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <g id="dq-criancas" style="opacity:0;transition:opacity 1s">${crianca(680, PLZ - 6, '#C98A5A', '#FF6B5A', '#2E1E14', 1.3)}${crianca(722, PLZ - 6, '#F2C8A0', '#3FA864', '#C98A2A', 1.3)}${crianca(633, 428, '#8A5A3A', '#B57BFF', '#12121A', 1.1)}${crianca(767, 428, '#E8B48A', '#FFC83D', '#7A3A1A', 1.1)}<g id="dq-bola"><circle cx="701" cy="${PLZ - 16}" r="5.4" fill="#FFC83D" stroke="#A86A08" stroke-width="1.3"/><path d="M696.4 ${PLZ - 17} q4.6 -3.4 9.2 0" stroke="#fff" stroke-width="1.3" fill="none"/></g></g>
    <text x="700" y="490" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#fff" stroke="#3E2414" stroke-opacity=".75" stroke-width="3" paint-order="stroke">praça d'água</text>
    <g id="dq-chuva" style="opacity:0;transition:opacity .9s;pointer-events:none">${[[622, 30], [704, 54], [778, 24]].map(([x, y]) => `<g class="dq-nuv toque" data-x="${x}"><use href="#nuvem" x="${x - 54}" y="${y}" width="108" height="54" style="color:#5A6787"/><use href="#nuvem" x="${x - 50}" y="${y + 3}" width="100" height="48" style="color:#AEB7CC"/><use href="#nuvem" x="${x - 34}" y="${y + 20}" width="68" height="30" style="color:#8A94AE"/><path d="M${x - 24} ${y + 18} q9 -6 19 -3" stroke="#E2E7F1" stroke-width="3" fill="none" stroke-linecap="round"/><g class="dq-nuv-hint">${brilhoHotspot(x + 28, y + 12)}</g><rect x="${x - 40}" y="${y + 4}" width="80" height="50" fill="transparent"/></g>`).join('')}</g>
    <g id="dq-blocos">${BLOCOS.map((b, i) => `<g class="dq-bloco toque" data-i="${i}" transform="translate(${b.x} ${b.y}) scale(.82)" style="cursor:grab">${bloco(b.tipo)}<circle r="20" fill="transparent"/></g>`).join('')}</g>
    <g id="dq-bloco-hint">${brilhoHotspot(428, 332)}</g>
    <g id="dq-seta" pointer-events="none"><path d="M414 332 C398 290 320 254 226 262" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="6 9"/><path d="M222 262 l13 -8 l1 13Z" fill="#fff"/></g>
    <g class="balanca" style="animation-duration:5.2s">${[[372, SUP + 4, 26], [380, SUP + 4, 20], [470, SUP + 4, 22]].map(([x, y, h]) => `<path d="M${x} ${y} q-3 -${h / 2} 1 -${h}" stroke="#2E6A3A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q-3 -${h / 2} 1 -${h}" stroke="#7CC25A" stroke-width="1.2" fill="none" stroke-linecap="round"/>`).join('')}<g fill="#7A4A2A">${[[373, SUP - 22], [471, SUP - 18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="4.6"/>`).join('')}</g></g>
    <rect width="800" height="500" fill="url(#dqVinheta)" pointer-events="none"/><rect width="800" height="500" filter="url(#dqGrao)" pointer-events="none"/>
  </svg>`;
  const c = criarCena(palco, svg), s = c.svg;
  const mar = el(s, '#dq-mar'), ondas = el(s, '#dq-ondas'), focaPos = el(s, '#dq-foca-pos');
  el(s, '#dq-ondas-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(20px)' }], { duration:1400, iterations:Infinity });
  el(s, '#dq-ondas-in2').animate([{ transform:'translateX(0)' }, { transform:'translateX(-32px)' }], { duration:2600, iterations:Infinity });
  el(s, '#dq-espuma-in').animate([{ transform:'scale(.85)', opacity:.6 }, { transform:'scale(1.1)', opacity:1 }, { transform:'scale(.85)', opacity:.6 }], { duration:1800, iterations:Infinity });
  s.querySelectorAll('.dq-turb').forEach((t, i) => t.animate([{ transform:'rotate(0deg)' }, { transform:'rotate(360deg)' }], { duration:5200 + i * 900, iterations:Infinity }));
  const espuma = el(s, '#dq-espuma');
  const seta = el(s, '#dq-seta'); seta.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
  const poeMar = y => { marY = y; mar.setAttribute('y', y.toFixed(1)); espuma.setAttribute('transform', `translate(${faceX(y).toFixed(1)} ${y.toFixed(1)})`); ondas.setAttribute('transform', `translate(0 ${y.toFixed(1)})`); const off = Math.min(0, y - AREIA + 12); focaPos.setAttribute('transform', `translate(0 ${off.toFixed(1)})`); el(s, '#dq-foca-onda').style.opacity = off < 0 ? 1 : 0; };
  /* 1. maré: tapar os buracos do dique */
  const blocos = [...s.querySelectorAll('.dq-bloco')], pos = BLOCOS.map(b => ({ x:b.x, y:b.y, foi:false }));
  const vagaLivre = NOTCH.map(() => true);
  const poe = (i, k) => blocos[i].setAttribute('transform', `translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)}) scale(${k || .82})`);
  let arr = null;
  blocos.forEach((g, i) => g.addEventListener('pointerdown', e => {
    if (pos[i].foi || ocupado) return; e.stopPropagation();
    const p = c.ponto(e); arr = { i, dx:p.x - pos[i].x, dy:p.y - pos[i].y, x0:p.x, y0:p.y, moveu:false };
    s.setPointerCapture(e.pointerId); g.style.cursor = 'grabbing'; seta.style.display = 'none'; el(s, '#dq-bloco-hint').style.display = 'none'; toca('clique');
  }));
  s.addEventListener('pointermove', e => {
    if (!arr) return; const p = c.ponto(e);
    if (Math.hypot(p.x - arr.x0, p.y - arr.y0) > 8) arr.moveu = true;
    pos[arr.i].x = Math.max(20, Math.min(780, p.x - arr.dx)); pos[arr.i].y = Math.max(40, Math.min(480, p.y - arr.dy)); poe(arr.i, 1);
  });
  s.addEventListener('pointerup', () => {
    if (!arr) return; const { i, moveu } = arr; arr = null; blocos[i].style.cursor = 'grab';
    let v = -1, melhor = 70;
    NOTCH.forEach((x, k) => { const d = Math.hypot(pos[i].x - x, pos[i].y - (CR + 11)); if (vagaLivre[k] && d < melhor) { melhor = d; v = k; } });
    if (v < 0 && !moveu) v = vagaLivre.indexOf(true);
    if (v >= 0) encaixa(i, v); else volta(i);
  });
  function anima(i, x1, y1, ms, k0, k1, fim){
    const x0 = pos[i].x, y0 = pos[i].y, t0 = performance.now(); ocupado = true;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms), e = k*k*(3-2*k); pos[i].x = x0 + (x1 - x0) * e; pos[i].y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 30; poe(i, k0 + (k1 - k0) * e);
      if (k < 1) requestAnimationFrame(q); else { ocupado = false; fim && fim(); } })(t0);
  }
  function volta(i){ const b = BLOCOS[i]; anima(i, b.x, b.y, 600, 1, .82); toca('glub'); api.diz('Leve o bloco até um buraco lá em cima do dique!'); }
  function encaixa(i, v){
    pos[i].foi = true; vagaLivre[v] = false;
    anima(i, NOTCH[v], CR + 11, 700, 1, 1, () => {
      postos++; toca('planta'); c.brilhos(NOTCH[v], CR + 4, 6, '#FFE27A');
      for (let k = 0; k < 4; k++) c.add({ tipo:'respingo', x:NOTCH[v] + sorte(-10, 10), y:CR + 1, t:k * 2, cor:'#8A6A4E' });
      el(s.querySelectorAll('.dq-vaga')[v], '.dq-vaga-hint').style.display = 'none';
      api.hud(`<span class="chip">Buracos tapados: ${postos}/3</span>`);
      const falas = { argila:'Argila é um barro bem grudento. A água quase não passa por ela!', pedra:'As pedras protegem o dique da força das ondas.', grama:'A grama segura a terra com as raízes, e o dique fica firme.' };
      if (postos < 3) api.diz(falas[BLOCOS[i].tipo]);
      else mareAlta();
    });
  }
  function mareAlta(){
    fase = 'alta'; alvoMar = MAR_ALTO; toca('splash');
    api.diz('O dique segurou a maré! Olha a linha: o mar ficou mais alto que os campos e as casas.');
    depois(2600, () => { el(s, '#dq-nivel').style.opacity = 1; toca('vitoria'); });
    depois(7200, () => api.diz('Por isso o dique é tão importante. Uma parte grande deste país fica abaixo do nível do mar.'));
    depois(13000, comecaMoinho);
  }
  /* 2. moinho: bombear a água do campo encharcado para o canal */
  const pasG = el(s, '#dq-pas'), rosca = el(s, '#dq-rosca'), roscaAgua = el(s, '#dq-rosca-agua'), mao = el(s, '#dq-mao');
  function comecaMoinho(){
    fase = 'moinho'; el(s, '#dq-nivel').style.opacity = .4;
    mao.style.display = ''; mao.animate([{ opacity:.2 }, { opacity:1 }, { opacity:.2 }], { duration:1600, iterations:Infinity });
    api.hud('<span class="chip">Campo seco: 0%</span>');
    api.diz('Choveu muito e o campo ficou encharcado! Gire as pás do moinho com o dedo para tirar a água do campo.');
  }
  let giro = null;
  const empurra = v => { if (fase !== 'moinho') return; vel = Math.min(14, vel + v); mao.style.display = 'none'; };
  el(s, '#dq-pas-g').addEventListener('pointerdown', e => { if (arr) return; e.stopPropagation(); giro = c.ponto(e); s.setPointerCapture(e.pointerId); toca('clique'); if (fase === 'moinho') empurra(2.6); else vel = Math.min(5, vel + 1.5); });
  s.addEventListener('pointermove', e => { if (!giro) return; const p = c.ponto(e); empurra(Math.hypot(p.x - giro.x, p.y - giro.y) * .05); giro = p; });
  s.addEventListener('pointerup', () => giro = null);
  const pocas = [...s.querySelectorAll('.dq-poca')], lama = el(s, '#dq-lama'), filas = [...s.querySelectorAll('.dq-fila')];
  let falouMeio = false, falouCanal = false, dash = 0;
  function poeSeco(){
    lama.style.opacity = (1 - seco / 100).toFixed(2);
    pocas.forEach((p, i) => p.style.transform = `scale(${Math.max(0, 1 - seco / (55 + i * 5)).toFixed(2)})`);
    const abrir = Math.floor(seco / 16);
    while (filasAbertas < Math.min(FILAS.length, abrir)) { const f = filas[filasAbertas]; el(f, '.dq-fila-in').style.transform = 'scaleY(1)'; toca('planta'); c.brilhos(420 + filasAbertas * 50, FILAS[filasAbertas].y - 4, 4, '#FFE27A'); filasAbertas++; }
    api.hud(`<span class="chip">Campo seco: ${Math.round(seco)}%</span>`);
    if (!falouMeio && seco > 30) { falouMeio = true; api.diz('O moinho usa a força do vento para levantar a água do campo até o canal.'); }
    if (!falouCanal && seco > 62) { falouCanal = true; api.diz('O canal fica mais alto que o campo. Ele leva a água embora, até o mar.'); }
  }
  function campoSeco(){
    fase = 'florido'; toca('vitoria'); el(s, '#dq-fluxo-canal').style.opacity = 0;
    api.diz('O campo secou e as tulipas floresceram! Terra baixa assim, protegida por diques e secada com bombas, se chama pôlder.');
    depois(7600, comecaChuva);
  }
  let ultT = performance.now(), ultR = 0;
  (function vida(t){
    if (!vivo) return;
    const dt = Math.min(50, t - ultT); ultT = t;
    /* maré */
    if (Math.abs(alvoMar - marY) > .1) poeMar(marY + Math.sign(alvoMar - marY) * Math.min(Math.abs(alvoMar - marY), dt * (fase === 'alta' ? .01 : .016)));
    if (fase === 'mare' && Math.abs(alvoMar - marY) < 1 && t - ultR > 650) {
      ultR = t; const livres = NOTCH.filter((_, k) => vagaLivre[k]);
      if (livres.length) { const x = livres[Math.floor(Math.random() * livres.length)]; for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:x - 8 + sorte(-4, 4), y:NB + 1, t:k * 2, cor:'#E6F6FF' }); c.add({ tipo:'bolha', x:x - 6, y:NB + 4, vy:.5, r:2, topo:NB - 6, f:0 }); }
    }
    /* moinho */
    const base = fase === 'moinho' ? 0 : .6;
    vel += (base - vel) * .012; ang = (ang + vel * dt * .06) % 360;
    pasG.setAttribute('transform', `rotate(${ang.toFixed(1)} ${HX} ${HY})`);
    dash = (dash + vel * dt * .02) % 1000; rosca.setAttribute('stroke-dashoffset', dash.toFixed(1));
    const fluxo = fase === 'moinho' ? Math.max(0, vel - .6) : 0;
    roscaAgua.style.opacity = fluxo > .3 ? .9 : 0;
    if (fase === 'moinho' && fluxo > 0) {
      seco = Math.min(100, seco + fluxo * dt * .0011);
      if (Math.random() < fluxo * .05) c.add({ tipo:'chuva', x:466 + sorte(-2, 2), y:362, vx:-1.2, vy:1.4, chao:CAN - 1, cor:'#5AAEFF' });
      const fc = el(s, '#dq-fluxo-canal'); fc.style.opacity = 1; fc.firstChild.setAttribute('stroke-dashoffset', (dash * 1.4).toFixed(1));
      poeSeco();
      if (seco >= 100) campoSeco();
    }
    requestAnimationFrame(vida);
  })(ultT);
  /* 3. chuva: a cidade guarda a água na praça d'água e no telhado verde */
  function comecaChuva(){
    fase = 'chuva'; const ch = el(s, '#dq-chuva'); ch.style.opacity = 1; ch.style.pointerEvents = '';
    api.hud('<span class="chip">Chuvas: 0/3</span>');
    api.diz('Lá vem chuva forte! Toque nas nuvens para chover na cidade. Para onde será que a água vai?');
  }
  const chaoX = x => x < 598 ? SUP : x < 642 ? 324 : x < 682 ? 300 + Math.abs(x - 661) * .8 : x < 728 ? 280 + Math.abs(x - 705) * .9 : x < 770 ? 292 : 300;
  const nivelPraca = (alvo, ms, fim) => { const y0 = praca, t0 = performance.now(), ag = el(s, '#dq-praca-agua'), br = el(s, '#dq-praca-brilho'); br.style.opacity = 1;
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / ms); praca = y0 + (alvo - y0) * k; ag.setAttribute('y', praca.toFixed(1)); br.setAttribute('transform', `translate(0 ${(praca - PLZ).toFixed(1)})`); if (k < 1) requestAnimationFrame(q); else fim && fim(); })(t0); };
  const escoa = el(s, '#dq-escoa'), canos = [el(s, '#dq-cano1'), el(s, '#dq-cano2')];
  const fluir = ms => { escoa.style.opacity = 1; canos.forEach(p => p.style.opacity = 1);
    const a = [...escoa.querySelectorAll('path[stroke-dasharray]'), ...canos].map(p => p.animate([{ strokeDashoffset:24 }, { strokeDashoffset:0 }], { duration:500, iterations:Infinity }));
    depois(ms, () => { escoa.style.opacity = 0; canos.forEach(p => p.style.opacity = 0); a.forEach(x => x.cancel()); }); };
  el(s, '#dq-chuva').addEventListener('click', e => {
    const g = e.target.closest('.dq-nuv'); if (!g || fase !== 'chuva' || chovendo || g.dataset.feito) return; e.stopPropagation();
    g.dataset.feito = 1; el(g, '.dq-nuv-hint').style.display = 'none'; chovendo = true; chuvas++; toca('chuva'); const x = +g.dataset.x;
    let n = 0; (function cai(){ if (!vivo) return; for (let k = 0; k < 3; k++) { const px = x + sorte(-46, 46); c.add({ tipo:'chuva', x:px, y:sorte(78, 96), vx:-.3, vy:sorte(9, 12), chao:chaoX(px) - 2, cor:'#3D8BFF' }); }
      if (n % 5 === 0) c.add({ tipo:'infiltra', x0:sorte(602, 636), y0:322, x1:sorte(604, 634), y1:332, dur:sorte(30, 40), f:sorte(0, 6) });
      if (++n < 50) depois(45, cai); })();
    depois(1100, () => fluir(2600));
    depois(1300, () => { nivelPraca([456, 437, 418][chuvas - 1], 2200); el(s, '#dq-teto-molhado').setAttribute('opacity', (.22 * chuvas).toFixed(2)); });
    depois(3400, () => {
      chovendo = false; api.hud(`<span class="chip">Chuvas: ${chuvas}/3</span>`);
      if (chuvas === 1) api.diz('A chuva escorre dos telhados e da rua... e vai para a praça d\'água! A praça guarda a água por um tempo.');
      if (chuvas === 2) api.diz('O telhado verde tem plantinhas que seguram a água da chuva, como uma esponja.');
      if (chuvas === 3) passaChuva();
    });
  });
  function passaChuva(){
    fase = 'seca'; el(s, '#dq-chuva').style.opacity = 0; el(s, '#dq-arco').style.opacity = 1; el(s, '#dq-chuva').style.pointerEvents = 'none'; toca('vitoria');
    api.diz('Choveu muito, mas a rua e as casas ficaram sequinhas! A água ficou guardada na praça.');
    depois(4200, () => {
      for (let k = 0; k < 14; k++) depois(k * 260, () => c.add({ tipo:'infiltra', x0:sorte(650, 750), y0:PLZ + 2, x1:sorte(630, 770), y1:sorte(476, 494), dur:sorte(80, 110), f:sorte(0, 6) }));
      nivelPraca(PLZ + 2, 5200, () => { el(s, '#dq-praca-brilho').style.opacity = 0; brincam(); });
      api.diz('Depois da chuva, a água vai saindo devagarinho para dentro do chão e para o canal.');
    });
  }
  function brincam(){
    el(s, '#dq-criancas').style.opacity = 1; toca('pop');
    el(s, '#dq-bola').animate([{ transform:'translate(-14px,0)' }, { transform:'translate(0,-16px)' }, { transform:'translate(14px,0)' }, { transform:'translate(0,-16px)' }, { transform:'translate(-14px,0)' }], { duration:1600, iterations:Infinity });
    api.diz('A praça secou e virou lugar de brincar de novo!');
    depois(4200, () => { fase = 'fim'; toca('vitoria'); api.diz('Quando a gente não consegue segurar a água, dá para planejar para onde ela vai. Diques, moinhos, telhados verdes e praças d\'água ajudam a viver junto com a água!'); depois(6400, api.fim); });
  }
  /* toques extras */
  let focaOcupada = false;
  el(s, '#dq-foca').addEventListener('click', () => { [300, 240, 300].forEach((f, i) => setTimeout(() => somOn && tom(f, 0, .22, 'sawtooth', .04, f * .7), i * 240));
    if (focaOcupada) return; focaOcupada = true; const fi = el(s, '#dq-foca-in');
    const a = fi.animate([{ transform:'translateY(0)' }, { transform:'translateY(-10px)' }, { transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:900 });
    a.onfinish = () => { focaOcupada = false; };
    for (let k = 0; k < 3; k++) c.add({ tipo:'respingo', x:40 + k * 16, y:Math.min(marY, AREIA) + 1, t:k * 2, cor:'#E6F6FF' });
    api.diz(marY > AREIA ? 'Uma foca-comum descansando no banco de areia! No Mar de Wadden, quando a maré baixa, os bancos de areia aparecem.' : 'A maré subiu e cobriu o banco de areia. A foca nada muito bem!'); });
  el(s, '#dq-ovelhas').addEventListener('click', e => { e.stopPropagation(); [[420, 340], [400, 320]].forEach(([f, f2], i) => setTimeout(() => somOn && tom(f, 0, .45, 'triangle', .07, f2), i * 420));
    el(s, '#dq-ovelha-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-5px)' }, { transform:'translateY(0)' }], { duration:350, iterations:2 });
    api.diz('Méé! As ovelhas comem a grama do dique. A grama fica baixinha e fechada, e o dique fica mais forte.'); });
  el(s, '#dq-pato').addEventListener('click', e => { e.stopPropagation(); [0, 180].forEach(d => setTimeout(() => somOn && tom(560, 0, .12, 'square', .05, 360), d)); el(s, '#dq-pato-in').animate([{ transform:'translateX(0)' }, { transform:'translateX(-5px)' }, { transform:'translateX(0)' }], { duration:900 }); c.add({ tipo:'respingo', x:392, y:CAN + 1, t:0, cor:'#E6F6FF' }); api.diz('Quac! Os patos adoram os canais.'); });
  el(s, '#dq-patinho').addEventListener('click', e => { e.stopPropagation(); [0, 140, 280].forEach(d => setTimeout(() => somOn && tom(1200, 0, .08, 'triangle', .05, 900), d)); el(s, '#dq-patinho-in').animate([{ transform:'translateY(0)' }, { transform:'translateY(-4px)' }, { transform:'translateY(0)' }], { duration:300, iterations:2 }); api.diz('Um patinho na valeta! As valetas recolhem a água do campo e levam até o moinho.'); });
  let barcoOcupado = false;
  el(s, '#dq-barco').addEventListener('click', e => { if (fase === 'mare' || barcoOcupado) return; e.stopPropagation(); barcoOcupado = true; somOn && tom(180, 0, .5, 'sawtooth', .05, 170);
    const t0 = performance.now(), bp = el(s, '#dq-barco-pos');
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 2400); bp.setAttribute('transform', `translate(${(-Math.sin(k * Math.PI) * 14).toFixed(1)} 0)`); if (k < 1) requestAnimationFrame(q); else barcoOcupado = false; })(t0);
    api.diz('Os canais são como ruas de água. Os barcos levam coisas de um lugar para outro.'); });
  let pedalando = false;
  el(s, '#dq-bicis').addEventListener('click', e => { e.stopPropagation(); [0, 160].forEach(d => setTimeout(() => somOn && tom(2200, 0, .18, 'sine', .06, 2100), d));
    if (fase === 'mare') { api.diz('Trim, trim! Quando o dique ficar pronto, dá para pedalar lá em cima.'); return; }
    if (pedalando) return; pedalando = true; const cg = el(s, '#dq-ciclista'), cp = el(s, '#dq-ciclista-pos'); cg.style.opacity = 1; const t0 = performance.now();
    (function q(t){ if (!vivo) return; const k = Math.min(1, (t - t0) / 3400); cp.setAttribute('transform', `translate(${(142 + k * 126).toFixed(1)} ${(-Math.abs(Math.sin(k * 40)) * .8).toFixed(1)})`); cg.style.opacity = Math.min(1, k * 10, (1 - k) * 10).toFixed(2); if (k < 1) requestAnimationFrame(q); else { cg.style.opacity = 0; pedalando = false; } })(t0);
    api.diz('Trim, trim! Aqui o chão é bem plano, e muita gente vai de bicicleta para todo lado. Até em cima do dique!'); });
  el(s, '#dq-filas').addEventListener('click', e => { const f = e.target.closest('.dq-fila'); if (!f) return;
    if (fase === 'mare' || fase === 'alta' || (fase === 'moinho' && +f.dataset.i >= filasAbertas)) { toca('glub'); api.diz('O campo está encharcado. As tulipas não crescem com as raízes debaixo da água.'); return; }
    const i = +f.dataset.i, k = (+f.dataset.c + 1) % 4; f.dataset.c = k; const cor = FILAS[i].cores[k], cp = el(f, '.dq-copos'); cp.setAttribute('fill', cor); cp.setAttribute('stroke', escuro(cor)); el(f, '.dq-faixa').setAttribute('fill', cor);
    toca('pop'); const p = c.ponto(e); for (let j = 0; j < 6; j++) c.add({ tipo:'petala', x:p.x + sorte(-14, 14), y:p.y - 6, vy:sorte(.4, .9), f:sorte(0, 6), chao:p.y + sorte(2, 8), cor, borda:escuro(cor) });
    if (!s.dataset.tulipas) { s.dataset.tulipas = 1; api.diz('As tulipas florescem na primavera, em fileiras de muitas cores!'); } });
  el(s, '#dq-pim').addEventListener('click', () => { [0, 70, 140, 210, 280, 350, 420].forEach(d => setTimeout(() => somOn && tom(900, 0, .04, 'square', .05, 500), d));
    el(s, '#dq-bico-baixo').animate([{ transform:'rotate(0)' }, { transform:'rotate(-16deg)' }, { transform:'rotate(0)' }], { duration:140, iterations:4 });
    el(s, '#dq-pim-in').animate([{ transform:'rotate(0)' }, { transform:'rotate(5deg)' }, { transform:'rotate(0)' }], { duration:600 });
    api.diz('Clac-clac-clac! As cegonhas conversam batendo o bico. Elas fazem ninhos grandes em lugares altos, como telhados.'); });
  el(s, '#dq-moinho').addEventListener('click', () => { if (fase === 'moinho') return; toca('ok'); api.diz('Os moinhos antigos usavam o vento para bombear a água. Hoje, bombas elétricas fazem quase todo esse trabalho.'); });
  el(s, '#dq-sol').addEventListener('click', e => { e.stopPropagation(); toca('ok'); c.brilhos(70, 60, 8, '#FFE27A'); api.diz('Aqui chove em todas as estações do ano. Por isso é preciso cuidar bem da água!'); });
  api.hud('<span class="chip">Buracos tapados: 0/3</span>');
  api.diz('Oi, eu sou o Pim, uma cegonha! Aqui muita terra fica mais baixa que o mar.');
  api.diz('A maré está subindo! Arraste os blocos do barco para tapar os buracos do dique.');
  return () => { vivo = false; timers.forEach(clearTimeout); c.parar(); };
}


const JOGOS = { amazonia:jogoAmazonia, caatinga:jogoCaatinga, vilas:jogoVilas, pantanal:jogoPantanal, cerrado:jogoCerrado, mata:jogoMata, pampa:jogoPampa, oceano:jogoOceano, antartida:jogoAntartida, andes:jogoAndes, deserto:jogoDeserto, lagos:jogoLagos, casa:jogoCasa, diques:jogoDiques };

/* ================= início ================= */
bolha($('#fala-inicio'), 'Oi! Eu sou o Pingo, uma gota de chuva. A água viaja pelo planeta inteiro, e eu vou junto! Gire o planeta e toque num ponto amarelo para viajar comigo.', 'Pingo', false);
montarGlobo(); montarTrilha(); requestAnimationFrame(girar);
})();
