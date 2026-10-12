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
