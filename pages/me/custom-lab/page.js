// Custom Lab — plain JS, own canvas, plus library blocks.
(function () {
  const cv = document.getElementById('orbit'), ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
  const cols = ['255,43,214', '155,107,255', '46,242,224', '159,216,255', '168,255,208'];
  let dir = 1, boost = 0, last = performance.now(), frames = 0, acc = 0;
  const rings = Array.from({ length: 5 }, (_, i) => ({ r: 50 + i * 36, n: 3 + i * 2, s: (.0006 + i * .00025) * (i % 2 ? -1 : 1), c: cols[i] }));

  function draw(t) {
    requestAnimationFrame(draw);
    const dt = t - last; last = t; frames++; acc += dt; if (acc > 500) { document.getElementById('fps').textContent = Math.round(frames * 1000 / acc) + ' fps'; frames = 0; acc = 0; }
    boost *= .96; ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(cx, cy, 6 + boost * 6, 0, 6.283); ctx.fill();
    rings.forEach(g => {
      ctx.strokeStyle = `rgba(${g.c},.28)`; ctx.lineWidth = 1; ctx.setLineDash([3, 7]); ctx.beginPath(); ctx.arc(cx, cy, g.r, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < g.n; i++) {
        const a = t * g.s * dir * (1 + boost * 4) + i * 6.283 / g.n, x = cx + Math.cos(a) * g.r, y = cy + Math.sin(a) * g.r;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 14 + boost * 10); grd.addColorStop(0, `rgba(${g.c},1)`); grd.addColorStop(1, `rgba(${g.c},0)`);
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 14 + boost * 10, 0, 6.283); ctx.fill();
      }
    });
  }
  requestAnimationFrame(draw);
  const pulse = () => { boost = 1; VS.fx.toast('Pulse!', 'zap'); };
  document.getElementById('burst').onclick = pulse;
  document.getElementById('flip').onclick = () => { dir *= -1; };
  document.addEventListener('lab:pulse', pulse);   // fired by the wheel's "Pulse" wedge

  VS.on('page:ready', () => VS.blocks.render([
    { type: 'callout', tone: 'info', title: 'Same library, your markup', text: 'This block was rendered with `VS.blocks.render([...], element)`.' },
    { type: 'stats', items: [{ label: 'Rings', value: 5 }, { label: 'Orbs', value: 3 + 5 + 7 + 9 + 11 }] }
  ], document.getElementById('mount'), { base: location.href }));
})();
