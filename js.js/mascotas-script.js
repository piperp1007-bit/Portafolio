// ══ CONFIG ════════════════════════════════════════
const WA = '573000000000'; // ← CAMBIAR POR EL NÚMERO REAL
function openWA(msg){ window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank'); }

// ══ NAV ══════════════════════════════════════════
window.addEventListener('scroll',()=>{ document.getElementById('nav').classList.toggle('scrolled',scrollY>50); });
function toggleMenu(){ document.getElementById('mobMenu').classList.toggle('open'); }

// ══ FADE UP ═══════════════════════════════════════
const obs = new IntersectionObserver(e=>{ e.forEach(x=>{ if(x.isIntersecting){x.target.classList.add('vis');obs.unobserve(x.target);} }); },{threshold:.1});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

// ══ COUNTERS ══════════════════════════════════════
const ctrs=[{id:'s1',t:10,s:'+'},{id:'s2',t:2500,s:'+'},{id:'s3',t:600,s:'+'},{id:'s4',t:99,s:'%'}];
let counted=false;
new IntersectionObserver(e=>{ if(e[0].isIntersecting&&!counted){ counted=true; ctrs.forEach(c=>{ const el=document.getElementById(c.id); let n=0; const step=Math.ceil(c.t/55); const iv=setInterval(()=>{ n=Math.min(n+step,c.t); el.textContent=n+c.s; if(n>=c.t)clearInterval(iv); },22); }); } },{threshold:.3}).observe(document.querySelector('.stats-bar'));

// ══ PRODUCTS ══════════════════════════════════════
const PRODS=[
  {cat:'alimento',img:'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80',tag:'Alimentos',name:'Purina Pro Plan Adulto',desc:'Nutrición completa para perros adultos. 15kg.',price:'$89.000',badge:'',nuevo:false},
  {cat:'alimento',img:'https://images.unsplash.com/photo-1589924691995-400dc9efd119?w=400&q=80',tag:'Alimentos',name:'Royal Canin Gato Indoor',desc:'Alimento premium para gatos de interior. 4kg.',price:'$72.000',badge:'-15%',nuevo:false},
  {cat:'accesorio',img:'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&q=80',tag:'Accesorios',name:'Cama ortopédica mediana',desc:'Cama con espuma viscoelástica para perros.',price:'$65.000',badge:'',nuevo:true},
  {cat:'accesorio',img:'https://images.unsplash.com/photo-1601758066149-0faef0588f0a?w=400&q=80',tag:'Accesorios',name:'Correa retráctil 5m',desc:'Correa retráctil con freno para perros hasta 25kg.',price:'$38.000',badge:'',nuevo:false},
  {cat:'medicina',img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',tag:'Medicamentos',name:'Frontline Plus Pipeta',desc:'Antipulgas y garrapatas. 3 pipetas.',price:'$42.000',badge:'',nuevo:false},
  {cat:'medicina',img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',tag:'Medicamentos',name:'Milbemax Desparasitante',desc:'Desparasitante interno amplio espectro. x2 comp.',price:'$28.000',badge:'-10%',nuevo:false},
  {cat:'higiene',img:'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80',tag:'Higiene',name:'Shampoo medicado canino',desc:'Shampoo antipulgas con aloe vera. 500ml.',price:'$24.000',badge:'',nuevo:true},
  {cat:'higiene',img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',tag:'Higiene',name:'Kit de aseo dental',desc:'Cepillo + pasta dental sabor pollo para perros.',price:'$19.000',badge:'',nuevo:false},
];

function renderProds(list){
  document.getElementById('prodsGrid').innerHTML=list.map(p=>`
    <div class="prod-card">
      <div class="prod-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.badge?`<div class="prod-badge">${p.badge}</div>`:''}
        ${p.nuevo?`<div class="prod-badge nuevo">NUEVO</div>`:''}
      </div>
      <div class="prod-body">
        <div class="prod-tag">${p.tag}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-footer">
          <div class="prod-price">${p.price}</div>
          <button class="prod-wa" onclick="openWA('Hola! Quiero pedir:\\n*${p.name}*\\nPrecio: ${p.price}\\n\\n¿Está disponible?')" title="Pedir por WhatsApp">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </button>
        </div>
      </div>
    </div>`).join('');
}
function filterProds(cat,btn){
  document.querySelectorAll('.pcat').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProds(cat==='all'?PRODS:PRODS.filter(p=>p.cat===cat));
}
renderProds(PRODS);

// ══ GALLERY ═══════════════════════════════════════
const GALS=[
  {src:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',lbl:'Sala de consulta principal'},
  {src:'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600&q=80',lbl:'Área de cirugía'},
  {src:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',lbl:'Peluquería canina'},
  {src:'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',lbl:'Tienda de productos'},
  {src:'https://images.unsplash.com/photo-1568051243842-5e0ced9f0e11?w=600&q=80',lbl:'Área de hospitalización'},
  {src:'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80',lbl:'Sala de espera'},
  {src:'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&q=80',lbl:'Laboratorio clínico'},
];
let lbIdx=0;
document.getElementById('galGrid').innerHTML=GALS.map((g,i)=>`
  <div class="gal-item" onclick="openLb(${i})">
    <img src="${g.src}" alt="${g.lbl}" loading="lazy"/>
    <div class="gal-overlay"><div class="gal-lbl">${g.lbl}</div></div>
  </div>`).join('');
function openLb(i){ lbIdx=i; document.getElementById('lbImg').src=GALS[i].src; document.getElementById('lightbox').classList.add('open'); document.body.style.overflow='hidden'; }
function closeLb(){ document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
function navLb(d){ lbIdx=(lbIdx+d+GALS.length)%GALS.length; document.getElementById('lbImg').src=GALS[lbIdx].src; }
document.getElementById('lightbox').addEventListener('click',e=>{ if(e.target===document.getElementById('lightbox'))closeLb(); });
document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight')navLb(1); if(e.key==='ArrowLeft')navLb(-1); if(e.key==='Escape')closeLb(); });

// ══ FAQ ═══════════════════════════════════════════
const FAQS=[
  {q:'¿Atienden urgencias fuera del horario normal?',a:'Sí, tenemos servicio de urgencias las 24 horas, los 7 días de la semana. Para urgencias fuera del horario escríbenos al WhatsApp y te indicamos cómo proceder.'},
  {q:'¿Cómo puedo pedir productos por WhatsApp?',a:'Es muy fácil. Solo escríbenos al WhatsApp indicando el producto que necesitas, la cantidad y tu dirección. Coordinamos el pago y la entrega o puedes recoger en el local.'},
  {q:'¿Manejan todas las razas de perros y gatos?',a:'Sí, atendemos todas las razas de perros, gatos, y también conejos, hámsteres, aves y otros animales exóticos pequeños. Tenemos experiencia con una amplia variedad de especies.'},
  {q:'¿Necesito cita previa para la consulta?',a:'Recomendamos agendar cita previa para consultas de rutina. Sin embargo, para urgencias te atendemos de inmediato sin necesidad de cita. Puedes agendar fácilmente por WhatsApp.'},
  {q:'¿Qué incluye el servicio de peluquería?',a:'El servicio incluye baño con shampoo especializado, secado, cepillado, corte de pelo según la raza, limpieza de oídos, corte de uñas y perfumado. Tenemos precios según el tamaño del animal.'},
  {q:'¿Tienen plan de vacunación para cachorros?',a:'Sí, contamos con planes completos de vacunación para cachorros desde las 6 semanas de edad. Incluye el carnet de vacunas y el seguimiento hasta completar el esquema de adulto.'},
];
document.getElementById('faqGrid').innerHTML=FAQS.map((f,i)=>`
  <div class="faq-item" id="fq-${i}">
    <div class="faq-q" onclick="toggleFaq(${i})">
      <div class="faq-q-text">${f.q}</div>
      <div class="faq-toggle">+</div>
    </div>
    <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
  </div>`).join('');
function toggleFaq(i){ const el=document.getElementById(`fq-${i}`); const open=el.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(x=>x.classList.remove('open')); if(!open)el.classList.add('open'); }

// ══ FORM ══════════════════════════════════════════
function sendForm(){
  const n=document.getElementById('f-nombre').value.trim();
  const t=document.getElementById('f-tel').value.trim();
  const m=document.getElementById('f-mascota').value.trim();
  const tp=document.getElementById('f-tipo').value;
  const sv=document.getElementById('f-serv').value;
  const msg=document.getElementById('f-msg').value.trim();
  if(!n||!t){ alert('Por favor completa tu nombre y WhatsApp.'); return; }
  const wa=`Hola Mascotas Cotas! Te escribo desde la página web.\n\n*Nombre:* ${n}\n*WhatsApp:* ${t}\n*Mascota:* ${m||'No indicó'} ${tp}\n*Servicio:* ${sv||'Información general'}\n\n*Mensaje:* ${msg||'Sin mensaje adicional'}`;
  openWA(wa);
}