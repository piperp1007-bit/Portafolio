// ── CURSOR ────────────────────────────────────────────────────────
const dot=document.getElementById('curDot'),ring=document.getElementById('curRing');
document.addEventListener('mousemove',e=>{
  dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
  ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';
});
if('ontouchstart' in window){dot.style.display='none';ring.style.display='none';document.body.style.cursor='auto';}

// ── NAV SCROLL ────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',scrollY>60);
});

// ── FADE IN ON SCROLL ─────────────────────────────────────────────
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

// ── SKILL BARS ────────────────────────────────────────────────────
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(bar=>{bar.style.width=bar.dataset.pct+'%';});
      barObs.unobserve(e.target);
    }
  });
},{threshold:.2});
document.querySelectorAll('#skills').forEach(el=>barObs.observe(el));

// ── WHATSAPP ──────────────────────────────────────────────────────
const WA='573134246522';
function openWA(msg){window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');}
function sendContact(){
  const nombre=document.getElementById('c-nombre').value.trim();
  const tel=document.getElementById('c-tel').value.trim();
  const tipo=document.getElementById('c-tipo').value;
  const msg=document.getElementById('c-msg').value.trim();
  if(!nombre||!msg){alert('Por favor completa tu nombre y el mensaje.');return;}
  const wa=`Hola Esteban! Te escribo desde tu portafolio.\n\n*Nombre:* ${nombre}\n*Tel:* ${tel||'No indicó'}\n*Servicio:* ${tipo||'No especificó'}\n\n*Mensaje:*\n${msg}`;
  openWA(wa);
}
