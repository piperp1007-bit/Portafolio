// ══ CONFIG ════════════════════════════════════════════
const WA = '573000000000'; // ← CAMBIAR POR EL NÚMERO REAL
function openWA(msg){ window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank'); }

// ══ NAV SCROLL ════════════════════════════════════════
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
});

// ══ MOBILE MENU ═══════════════════════════════════════
function toggleMenu(){
  document.getElementById('mobMenu').classList.toggle('open');
}

// ══ FADE IN OBSERVER ══════════════════════════════════
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
},{threshold:.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));

// ══ COUNTER ANIMATION ═════════════════════════════════
const counters = [{id:'s1',target:15,suffix:'+'},{id:'s2',target:200,suffix:'+'},{id:'s3',target:25,suffix:''},{id:'s4',target:98,suffix:'%'}];
let counted = false;
const statsObs = new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting && !counted){
    counted=true;
    counters.forEach(c=>{
      const el=document.getElementById(c.id);
      let n=0; const step=Math.ceil(c.target/60);
      const iv=setInterval(()=>{
        n=Math.min(n+step,c.target);
        el.textContent=n+c.suffix;
        if(n>=c.target) clearInterval(iv);
      },25);
    });
  }
},{threshold:.3});
statsObs.observe(document.querySelector('.stats-bar'));

// ══ GALLERY DATA ═══════════════════════════════════════
const GALLERY = [
  {src:'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',cat:'habitaciones',label:'Habitación privada doble'},
  {src:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',cat:'habitaciones',label:'Habitación individual'},
  {src:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80',cat:'comunes',label:'Sala de estar principal'},
  {src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',cat:'comunes',label:'Comedor'},
  {src:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',cat:'exterior',label:'Jardín y zona verde'},
  {src:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',cat:'medico',label:'Área de enfermería'},
  {src:'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',cat:'comunes',label:'Sala de actividades'},
  {src:'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=600&q=80',cat:'exterior',label:'Terraza y áreas al aire libre'},
];
let currentGallery = [...GALLERY];
let lbIndex = 0;

function renderGallery(list){
  const grid = document.getElementById('galeriaGrid');
  grid.innerHTML = list.map((g,i)=>`
    <div class="g-item" data-index="${i}" onclick="openLightbox(${i})">
      <img src="${g.src}" alt="${g.label}" loading="lazy"/>
      <div class="g-overlay"><div class="g-label">${g.label}</div></div>
    </div>`).join('');
}

function filterGallery(cat, btn){
  document.querySelectorAll('.g-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentGallery = cat==='all' ? GALLERY : GALLERY.filter(g=>g.cat===cat);
  renderGallery(currentGallery);
}

function openLightbox(i){
  lbIndex=i;
  document.getElementById('lbImg').src=currentGallery[i].src;
  document.getElementById('lbCaption').textContent=currentGallery[i].label;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
function navLightbox(dir){
  lbIndex=(lbIndex+dir+currentGallery.length)%currentGallery.length;
  document.getElementById('lbImg').src=currentGallery[lbIndex].src;
  document.getElementById('lbCaption').textContent=currentGallery[lbIndex].label;
}
document.getElementById('lightbox').addEventListener('click',e=>{
  if(e.target===document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight') navLightbox(1);
  if(e.key==='ArrowLeft') navLightbox(-1);
  if(e.key==='Escape') closeLightbox();
});
renderGallery(GALLERY);

// ══ FAQ DATA ═══════════════════════════════════════════
const FAQS = [
  {q:'¿Cuánto cuesta el servicio mensual?',a:'Los planes varían según el tipo de habitación (privada o compartida), el nivel de dependencia del residente y los servicios adicionales requeridos. Contáctenos para una cotización personalizada sin compromiso.'},
  {q:'¿Tienen médico permanente en el hogar?',a:'Sí, contamos con médico geriatra de planta de lunes a viernes y servicio de médico de urgencias disponible las 24 horas los 7 días de la semana.'},
  {q:'¿Puedo visitar a mi familiar cuando quiera?',a:'Las visitas están habilitadas todos los días de 9am a 12pm y de 3pm a 7pm. Para visitas especiales o en horarios diferentes, consultamos caso a caso con el equipo de salud.'},
  {q:'¿Qué pasa si el adulto mayor necesita hospitalización?',a:'Nuestro equipo médico coordina directamente con la EPS o medicina prepagada del residente, acompaña el traslado y mantiene informada a la familia en todo momento.'},
  {q:'¿Aceptan adultos mayores con Alzheimer o demencia?',a:'Sí, contamos con personal especializado en el cuidado de personas con demencia y Alzheimer, con protocolos específicos de seguridad y estimulación cognitiva adaptada.'},
  {q:'¿Qué documentos necesito para el ingreso?',a:'Documentos de identidad, historia clínica actualizada, valoración médica reciente, afiliación a salud (EPS o prepagada) y contrato de servicio firmado por el responsable legal.'},
  {q:'¿Ofrecen servicios de cuidado temporal?',a:'Sí, ofrecemos estancias temporales desde 1 semana para descanso de cuidadores, recuperación post-quirúrgica o períodos de vacaciones familiares.'},
  {q:'¿Cómo manejan las emergencias médicas?',a:'Tenemos protocolos de emergencia activos las 24 horas, personal entrenado en primeros auxilios y coordinación directa con clínicas y hospitales cercanos para traslados inmediatos.'},
];

document.getElementById('faqGrid').innerHTML = FAQS.map((f,i)=>`
  <div class="faq-item" id="faq-${i}">
    <div class="faq-q" onclick="toggleFaq(${i})">
      <div class="faq-q-text">${f.q}</div>
      <div class="faq-icon">+</div>
    </div>
    <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
  </div>`).join('');

function toggleFaq(i){
  const item = document.getElementById(`faq-${i}`);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el=>el.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

// ══ CONTACT FORM ══════════════════════════════════════
function sendForm(){
  const nombre=document.getElementById('f-nombre').value.trim();
  const tel=document.getElementById('f-tel').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const para=document.getElementById('f-para').value;
  const tipo=document.getElementById('f-tipo').value;
  const msg=document.getElementById('f-msg').value.trim();
  if(!nombre||!tel){alert('Por favor completa tu nombre y teléfono.');return;}
  const wa=`Hola! Me comunico desde la página web de Casa Hogar El Remanso.\n\n*Nombre:* ${nombre}\n*Teléfono:* ${tel}\n*Correo:* ${email||'No indicó'}\n*Para:* ${para||'No indicó'}\n*Tipo de consulta:* ${tipo||'Información general'}\n\n*Mensaje:*\n${msg||'Sin mensaje adicional'}`;
  openWA(wa);
}