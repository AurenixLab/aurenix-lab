// Background animations (default disabled to preserve original look)
(function(){
  const canvas = document.getElementById('aurenixCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, raf, t = 0, DPR = Math.max(1, window.devicePixelRatio||1);
  function resize(){ w=innerWidth; h=innerHeight; canvas.width=w*DPR; canvas.height=h*DPR; canvas.style.width=w+'px'; canvas.style.height=h+'px'; ctx.setTransform(DPR,0,0,DPR,0,0); }
  addEventListener('resize', resize); resize();

  const mode = localStorage.getItem('aurenix.bg')||'off';
  const anim = localStorage.getItem('aurenix.anim')!=='false';
  if(mode==='off' || !anim) return; // nothing if off

  const dots = Array.from({length: 100},()=>({x:Math.random()*w,y:Math.random()*h,vx:Math.random()-0.5,vy:Math.random()-0.5,r:Math.random()*2+0.5}));

  function gradient(){
    t += 0.002;
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(0,0,0,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    for(let i=0;i<4;i++){ const x=(Math.sin(t*0.7+i)*0.5+0.5)*w, y=(Math.cos(t*0.9+i)*0.5+0.5)*h, r=200+i*60;
      const lg = ctx.createRadialGradient(x,y,0,x,y,r);
      lg.addColorStop(0,'rgba(255,255,255,0.06)'); lg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
  }
  function particles(){
    ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,0.7)';
    for(const p of dots){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
    ctx.strokeStyle='rgba(255,255,255,0.08)';
    for(let i=0;i<dots.length;i++){ for(let j=i+1;j<dots.length;j++){ const a=dots[i],b=dots[j];
      const dx=a.x-b.x, dy=a.y-b.y, d=dx*dx+dy*dy; if(d<100*100){ ctx.globalAlpha=1-d/(100*100); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
    ctx.globalAlpha=1;
  }
  function waves(){
    t += 0.015; ctx.clearRect(0,0,w,h);
    const lines=4;
    for(let i=0;i<lines;i++){ ctx.beginPath(); ctx.lineWidth=1.2; ctx.strokeStyle='rgba(255,255,255,0.35)';
      const amp=14+i*5, freq=0.004+i*0.0008;
      for(let x=0;x<=w;x+=4){ const y=h*0.32+i*26+Math.sin(x*freq+t*(1+i*0.12))*amp; if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }
      ctx.stroke(); }
  }
  function frame(){ const m=localStorage.getItem('aurenix.bg')||'off';
    if(m==='gradient') gradient(); else if(m==='particles') particles(); else if(m==='waves') waves(); else { cancelAnimationFrame(raf); return; }
    raf=requestAnimationFrame(frame);
  }
  frame();
})();