// ══════════════════════════════════════════════════════════════════
// ── ANIMATED CANVAS BACKGROUND ────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

  // ── Sections with their own mood ─────────────────────────────────
  // mode: 0=network, 1=orbital, 2=matrix, 3=wave, 4=converge
  const SECTIONS = [
    {id:'inicio',   mode:0, label:'network'},
    {id:'about',    mode:1, label:'orbital'},
    {id:'servicios',mode:0, label:'network'},
    {id:'skills',   mode:2, label:'matrix'},
    {id:'proyectos',mode:3, label:'wave'},
    {id:'testi',    mode:3, label:'wave'},
    {id:'contact',  mode:4, label:'converge'},
  ];

  // ── Colors per mode ───────────────────────────────────────────────
  const PALETTES = [
    {p:'rgba(26,110,245,',  l:'rgba(0,200,224,'},   // 0 network  — blue/cyan
    {p:'rgba(139,92,246,',  l:'rgba(236,72,153,'},   // 1 orbital  — purple/pink
    {p:'rgba(0,200,100,',   l:'rgba(0,200,224,'},    // 2 matrix   — green/cyan
    {p:'rgba(245,158,11,',  l:'rgba(239,68,68,'},    // 3 wave     — amber/red
    {p:'rgba(26,110,245,',  l:'rgba(255,255,255,'},  // 4 converge — blue/white
  ];

  let W, H, particles=[], modeNow=0, modeTarget=0, modeBlend=0;
  let scrollRatio=0, mouseX=W/2||400, mouseY=H/2||300;
  let tick=0;

  // ── Resize ────────────────────────────────────────────────────────
  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
  }
  window.addEventListener('resize',()=>{resize();initParticles();});
  resize();

  // ── Mouse tracking (subtle influence) ─────────────────────────────
  document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});

  // ── Scroll → detect mode ──────────────────────────────────────────
  function detectMode(){
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    scrollRatio = docH > 0 ? sy/docH : 0;

    let best = 0;
    SECTIONS.forEach(s=>{
      const el = document.getElementById(s.id);
      if(!el) return;
      const top = el.getBoundingClientRect().top + sy;
      if(sy + H*0.4 >= top) best = s.mode;
    });
    if(best !== modeTarget){ modeTarget=best; modeBlend=0; }
  }
  window.addEventListener('scroll', detectMode, {passive:true});

  // ── Particle factory ──────────────────────────────────────────────
  function mkParticle(){
    const angle = Math.random()*Math.PI*2;
    const speed = .2 + Math.random()*.5;
    return {
      x:  Math.random()*W,
      y:  Math.random()*H,
      ox: 0, oy: 0,          // orbital center offset
      r:  .8+Math.random()*2,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      alpha: .3+Math.random()*.7,
      phase: Math.random()*Math.PI*2,
      freq:  .002+Math.random()*.004,
      orbitR: 40+Math.random()*120,
      orbitSpeed: (.002+Math.random()*.003)*(Math.random()<.5?1:-1),
      orbitAngle: Math.random()*Math.PI*2,
      matY: Math.random()*H,
      matSpeed: .5+Math.random()*2,
      waveOffset: Math.random()*W,
    };
  }

  function initParticles(){
    const N = Math.min(120, Math.floor(W*H/12000));
    particles=[];
    for(let i=0;i<N;i++) particles.push(mkParticle());
  }
  initParticles();

  // ── Easing ────────────────────────────────────────────────────────
  function lerp(a,b,t){return a+(b-a)*t;}
  function easeInOut(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}

  // ── Draw helpers ──────────────────────────────────────────────────
  function hexLine(x1,y1,x2,y2,alpha,pal){
    const d = Math.hypot(x2-x1,y2-y1);
    if(d>200) return;
    const a = alpha*(1-d/200);
    ctx.strokeStyle=`${pal.p}${a.toFixed(2)})`;
    ctx.lineWidth=.6;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }

  // ── MODE 0: Network / circuit ─────────────────────────────────────
  function drawNetwork(p, pal, blend){
    // gentle drift toward mouse (very subtle)
    const mx=(mouseX-p.x)*0.00004, my=(mouseY-p.y)*0.00004;
    p.vx+=mx; p.vy+=my;
    // dampen
    p.vx*=.998; p.vy*=.998;
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0;
    if(p.y<0)p.y=H; if(p.y>H)p.y=0;

    const a = (Math.sin(tick*p.freq+p.phase)*.3+.7)*p.alpha*blend;
    ctx.fillStyle=`${pal.p}${a.toFixed(2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }

  // ── MODE 1: Orbital ───────────────────────────────────────────────
  function drawOrbital(p, pal, blend){
    p.orbitAngle+=p.orbitSpeed;
    // center of orbit floats slowly
    const cx=W*.3+Math.sin(tick*.0008+p.phase)*W*.15;
    const cy=H*.5+Math.cos(tick*.0005+p.phase)*H*.1;
    p.x=cx+Math.cos(p.orbitAngle)*p.orbitR;
    p.y=cy+Math.sin(p.orbitAngle)*p.orbitR*(0.4+scrollRatio*.3);

    const a=(Math.sin(tick*p.freq+p.phase)*.4+.6)*p.alpha*blend;
    // trail
    ctx.strokeStyle=`${pal.l}${(a*.3).toFixed(2)})`;
    ctx.lineWidth=p.r*.8;
    ctx.beginPath();
    ctx.arc(cx,cy,p.orbitR,p.orbitAngle-p.orbitSpeed*12,p.orbitAngle);
    ctx.stroke();

    ctx.fillStyle=`${pal.p}${a.toFixed(2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r*1.2,0,Math.PI*2);ctx.fill();
  }

  // ── MODE 2: Matrix rain ───────────────────────────────────────────
  function drawMatrix(p, pal, blend){
    p.matY+=p.matSpeed;
    if(p.matY>H+10) p.matY=-10;
    p.x=p.waveOffset%(W+1);

    const a=(.2+Math.random()*.5)*p.alpha*blend;
    ctx.fillStyle=`${pal.p}${a.toFixed(2)})`;
    ctx.font=`${8+p.r*3}px monospace`;
    const chars=['0','1','<','>','/','_','{','}','#'];
    ctx.fillText(chars[Math.floor(Math.random()*chars.length)],p.x,p.matY);

    // also draw a fading tail
    const ta=(a*.3).toFixed(2);
    ctx.fillStyle=`${pal.l}${ta})`;
    ctx.fillText(chars[Math.floor(Math.random()*chars.length)],p.x,p.matY-14);
  }

  // ── MODE 3: Wave ──────────────────────────────────────────────────
  function drawWave(p, pal, blend){
    const freq = .008+scrollRatio*.006;
    p.x+=p.vx*.4;
    p.y=H*(.15+.7*((p.phase%(Math.PI*2))/(Math.PI*2)))+
        Math.sin(p.x*freq + tick*.015 + p.phase)*60*
        (1+scrollRatio);
    if(p.x>W+20) p.x=-20;
    if(p.x<-20)  p.x=W+20;

    const a=(Math.sin(tick*p.freq*2+p.phase)*.4+.6)*p.alpha*.8*blend;
    ctx.fillStyle=`${pal.p}${a.toFixed(2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();

    // glow
    ctx.fillStyle=`${pal.l}${(a*.4).toFixed(2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2);ctx.fill();
  }

  // ── MODE 4: Converge ─────────────────────────────────────────────
  function drawConverge(p, pal, blend){
    const cx=W*.5, cy=H*.5;
    const dx=cx-p.x, dy=cy-p.y;
    const dist=Math.hypot(dx,dy)||1;
    const pull=(.5+scrollRatio)*1.5;
    p.vx+=dx/dist*pull*.008;
    p.vy+=dy/dist*pull*.008;
    p.vx*=.97; p.vy*=.97;
    p.x+=p.vx; p.y+=p.vy;
    if(dist<6){p.x=Math.random()*W;p.y=Math.random()*H;p.vx=0;p.vy=0;}

    const a=(1-dist/(Math.hypot(W,H)*.5))*p.alpha*blend;
    ctx.fillStyle=`${pal.p}${Math.max(0,a).toFixed(2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();

    if(dist<180){
      ctx.strokeStyle=`${pal.l}${(Math.max(0,a)*.5).toFixed(2)})`;
      ctx.lineWidth=.5;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(cx,cy);ctx.stroke();
    }
  }

  // ── DRAW GRID OVERLAY (always, faint) ─────────────────────────────
  function drawGrid(){
    const step=60;
    const a=.025+Math.sin(tick*.003)*.01;
    ctx.strokeStyle=`rgba(26,110,245,${a})`;
    ctx.lineWidth=.5;
    // slight drift with scroll
    const off=(scrollRatio*step*2)%step;
    ctx.beginPath();
    for(let x=0;x<W+step;x+=step){ctx.moveTo(x,0);ctx.lineTo(x,H);}
    for(let y=-off;y<H+step;y+=step){ctx.moveTo(0,y);ctx.lineTo(W,y);}
    ctx.stroke();
  }

  // ── MAIN LOOP ─────────────────────────────────────────────────────
  function loop(){
    tick++;
    ctx.clearRect(0,0,W,H);

    // blend toward target mode
    if(modeNow!==modeTarget){
      modeBlend=Math.min(1,modeBlend+.025);
      if(modeBlend>=1){modeNow=modeTarget;modeBlend=0;}
    }

    drawGrid();

    const palNow = PALETTES[modeNow];
    const palTgt = PALETTES[modeTarget];
    const blendIn  = modeNow===modeTarget ? 1 : 1-modeBlend;
    const blendOut = modeBlend;

    particles.forEach((p,i)=>{
      // draw outgoing mode fading out
      if(modeNow!==modeTarget){
        drawMode(p, palNow, blendIn, modeNow);
        drawMode(p, palTgt, blendOut, modeTarget);
      } else {
        drawMode(p, palNow, 1, modeNow);
      }

      // network connections (only in modes 0 & 4)
      if(modeNow===0||modeNow===4){
        for(let j=i+1;j<particles.length;j+=3){
          hexLine(p.x,p.y,particles[j].x,particles[j].y,blendIn*.6,palNow);
        }
      }
    });

    // ── ambient glow blobs ─────────────────────────────────────────
    const gr1=ctx.createRadialGradient(
      W*.7+Math.sin(tick*.002)*W*.08,
      H*.2+Math.cos(tick*.0015)*H*.1,
      0,
      W*.7,H*.2,W*.45
    );
    gr1.addColorStop(0,`${palNow.p}0.09)`);
    gr1.addColorStop(1,'transparent');
    ctx.fillStyle=gr1;ctx.fillRect(0,0,W,H);

    const gr2=ctx.createRadialGradient(
      W*.15+Math.cos(tick*.0018)*W*.06,
      H*.75+Math.sin(tick*.0012)*H*.08,
      0,
      W*.15,H*.75,W*.35
    );
    gr2.addColorStop(0,`${palNow.l}0.06)`);
    gr2.addColorStop(1,'transparent');
    ctx.fillStyle=gr2;ctx.fillRect(0,0,W,H);

    requestAnimationFrame(loop);
  }

  function drawMode(p,pal,blend,mode){
    if(blend<=0) return;
    switch(mode){
      case 0: drawNetwork(p,pal,blend); break;
      case 1: drawOrbital(p,pal,blend); break;
      case 2: drawMatrix(p,pal,blend);  break;
      case 3: drawWave(p,pal,blend);    break;
      case 4: drawConverge(p,pal,blend);break;
    }
  }

  detectMode();
  loop();
})();