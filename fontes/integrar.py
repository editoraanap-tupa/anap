import pathlib
d=pathlib.Path(__file__).parent
a=(d/'app.v2.js.bak').read_text()
i=a.index('/* ================= globo ================= */'); j=a.index('function montarTrilha(){')
a=a[:i]+(d/'globo.js').read_text()+'\n\n'+a[j:]
i=a.index('/* ================= JOGO 1: Amazônia'); j=a.index('/* ================= JOGO 2: Caatinga')
a=a[:i]+'/* ================= JOGO 1: Amazônia, rios voadores ================= */\n'+(d/'amazonia.js').read_text()+'\n\n'+a[j:]
old="      } else if (p.tipo === 'brilho') {"
new="""      } else if (p.tipo === 'semente') {
        p.vy = Math.min(7, p.vy + .25); p.y += p.vy; p.x += Math.sin(p.t/5) * .8;
        ctx.globalAlpha = 1; ctx.fillStyle = '#7A4A22'; ctx.strokeStyle = '#3E230E'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 4.5, 6.5, Math.sin(p.t/6)*.6, 0, 7); ctx.fill(); ctx.stroke();
        if (p.y >= p.alvoY) { pts.splice(i,1); for (let j = 0; j < 6; j++) pts.push({ tipo:'respingo', x:p.x + sorte(-4,4), y:p.alvoY, t:j, cor:'#8B5A2B' }); p.chega && p.chega(); }
"""+old
a=a.replace(old,new,1)
k='const JOGOS = {'
a=a.replace(k,(d/'paradas2.js').read_text()+'\n\n'+k,1)
old2="      } else if (p.tipo === 'semente') {"
new2="""      } else if (p.tipo === 'floco') {
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
"""+old2
a=a.replace(old2,new2,1)
(d/'app.js').write_text(a)
