// ── DATOS DE PRODUCTOS ─────────────────────────────────────────────────────
const PRODUCTS = [
  {id:1,name:'Vestido Floral Bohemio',brand:'Mujer',cat:'mujer',price:89000,oldPrice:140000,badge:'-36%',sizes:['XS','S','M','L'],colors:['#c9a84c','#8b5e3c','#2d4a3e'],img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',desc:'Vestido fluido con estampado floral, ideal para el dia a dia o una tarde especial. Tela 100% viscosa.',new:false},
  {id:2,name:'Blazer Estructurado Negro',brand:'Mujer',cat:'mujer',price:195000,oldPrice:null,badge:'NEW',sizes:['XS','S','M','L','XL'],colors:['#1a1a1a','#8b7355'],img:'https://images.unsplash.com/photo-1594938298603-c8148c4b3b29?w=600&q=80',desc:'Blazer de corte estructurado en tela premium. Perfecto para el trabajo o una salida elegante.',new:true},
  {id:3,name:'Jeans Slim Desgastado',brand:'Hombre',cat:'hombre',price:125000,oldPrice:160000,badge:'-22%',sizes:['28','30','32','34','36'],colors:['#1e3a5f','#2d2d2d'],img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',desc:'Jeans de corte slim con acabado stone wash. Denim elastizado para mayor comodidad.',new:false},
  {id:4,name:'Camisa Lino Blanca',brand:'Hombre',cat:'hombre',price:78000,oldPrice:null,badge:'NEW',sizes:['S','M','L','XL'],colors:['#f5f0e8','#c9a84c'],img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',desc:'Camisa de lino natural, perfecta para el calor. Cuello cubano y botonadura dorada.',new:true},
  {id:5,name:'Vestido Midi Satinado',brand:'Mujer',cat:'mujer',price:165000,oldPrice:220000,badge:'-25%',sizes:['XS','S','M','L'],colors:['#8b5e3c','#c9a84c','#2d4a3e'],img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',desc:'Vestido midi en tela satinada con escote en V. Ideal para eventos especiales.',new:false},
  {id:6,name:'Conjunto Deportivo Nino',brand:'Ninos',cat:'ninos',price:65000,oldPrice:null,badge:'NEW',sizes:['4','6','8','10','12'],colors:['#2d4a3e','#1e3a5f','#8b1a1a'],img:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',desc:'Conjunto deportivo para ninos con tela transpirable. Perfecto para el colegio o el deporte.',new:true},
  {id:7,name:'Cardigan Tejido Beige',brand:'Mujer',cat:'mujer',price:110000,oldPrice:145000,badge:'-24%',sizes:['XS','S','M','L','XL'],colors:['#c9a084','#8b7355','#1a1a1a'],img:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',desc:'Cardigan de punto grueso en tono beige. Suave, abrigado y muy versatil.',new:false},
  {id:8,name:'Pantalon Cargo Verde',brand:'Hombre',cat:'hombre',price:140000,oldPrice:null,badge:'NEW',sizes:['28','30','32','34','36'],colors:['#2d4a3e','#4a3d2d','#1a1a1a'],img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',desc:'Pantalon cargo en twill de algodon. Multiples bolsillos y corte relajado.',new:true},
  {id:9,name:'Vestido Ninia Flores',brand:'Ninos',cat:'ninos',price:55000,oldPrice:72000,badge:'-24%',sizes:['4','6','8','10'],colors:['#c9a84c','#e8c9d4'],img:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80',desc:'Vestido con estampado de flores para ninas. Tela fresca y comoda para todo el dia.',new:false},
  {id:10,name:'Polo Slim Fit Azul',brand:'Hombre',cat:'hombre',price:68000,oldPrice:90000,badge:'-24%',sizes:['S','M','L','XL'],colors:['#1e3a5f','#8b1a1a','#1a1a1a'],img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',desc:'Polo de algodón pima en corte slim. Clasico y elegante para cualquier ocasion.',new:false},
  {id:11,name:'Falda Plisada Midi',brand:'Mujer',cat:'mujer',price:95000,oldPrice:null,badge:'NEW',sizes:['XS','S','M','L'],colors:['#c9a84c','#8b5e3c','#1a1a1a'],img:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80',desc:'Falda plisada en tela fluida. Elegante y comoda para el dia a dia.',new:true},
  {id:12,name:'Sudadera Hoodie Nino',brand:'Ninos',cat:'ninos',price:75000,oldPrice:95000,badge:'-21%',sizes:['4','6','8','10','12','14'],colors:['#2d4a3e','#1e3a5f','#c9a84c'],img:'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=600&q=80',desc:'Hoodie para nino con interior afelpado. Comodo, abrigado y con estilo.',new:false},
];





// ── ESTADO ─────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('lm_cart')||'[]');
let currentFilter = 'all';
let currentSort = 'default';
let couponApplied = null;
const COUPONS = {MODO40:{type:'percent',value:40},ENVIOGRATIS:{type:'shipping',value:0},LUXE10:{type:'percent',value:10}};
// WhatsApp number — CAMBIAR POR EL REAL DEL CLIENTE
const WA_NUMBER = '573001234567';

// ── RENDER PRODUCTOS ────────────────────────────────────────────────────────
function renderProducts(list){
  const grid = document.getElementById('productsGrid');
  if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gris-4)">No se encontraron productos.</div>';return;}
  grid.innerHTML = list.map(p=>`
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap" onclick="openProduct(${p.id})">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.badge?`<div class="product-badge ${p.new?'new':''}">${p.badge}</div>`:''}
        <div class="product-actions">
          <button class="prod-act-btn" onclick="event.stopPropagation();openProduct(${p.id})">Ver detalle</button>
          <button class="prod-act-btn main" onclick="event.stopPropagation();quickAdd(${p.id})">+ Carrito</button>
        </div>
      </div>
      <div class="product-info" onclick="openProduct(${p.id})">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <div class="product-price">
            ${p.oldPrice?`<span class="old">$${p.oldPrice.toLocaleString()}</span>`:''}
            $${p.price.toLocaleString()}
          </div>
          <div class="product-sizes">${p.sizes.slice(0,3).map(s=>`<div class="sz">${s}</div>`).join('')}</div>
        </div>
      </div>
    </div>`).join('');
}

function getFiltered(){
  let list = [...PRODUCTS];
  if(currentFilter!=='all') list=list.filter(p=>p.cat===currentFilter||(currentFilter==='oferta'&&p.oldPrice));
  const q=document.getElementById('searchInput').value.toLowerCase().trim();
  if(q) list=list.filter(p=>p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q));
  if(currentSort==='precio-asc') list.sort((a,b)=>a.price-b.price);
  else if(currentSort==='precio-desc') list.sort((a,b)=>b.price-a.price);
  else if(currentSort==='nuevo') list.sort((a,b)=>b.new-a.new);
  return list;
}

function filterCat(cat,btn){
  currentFilter=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderProducts(getFiltered());
  document.getElementById('productos').scrollIntoView({behavior:'smooth'});
}
function sortProducts(val){currentSort=val;renderProducts(getFiltered());}
function searchProducts(){renderProducts(getFiltered());}

// ── PRODUCT MODAL ───────────────────────────────────────────────────────────
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modal=document.getElementById('productModalContent');
  modal.innerHTML=`
    <div class="modal-imgs">
      <img src="${p.img}" alt="${p.name}"/>
      ${p.badge?`<div class="modal-badge">${p.badge}</div>`:''}
    </div>
    <div class="modal-body">
      <button class="modal-close" onclick="closeProductModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="modal-brand">${p.brand}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-price">
        ${p.oldPrice?`<span class="old">$${p.oldPrice.toLocaleString()}</span>`:''}
        $${p.price.toLocaleString()}
        ${p.oldPrice?`<span class="dcto">−${Math.round((1-p.price/p.oldPrice)*100)}% OFF</span>`:''}
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-label">Talla</div>
      <div class="modal-sizes" id="modalSizes">
        ${p.sizes.map((s,i)=>`<div class="modal-sz ${i===0?'selected':''}" onclick="selectSize(this,'${s}')">${s}</div>`).join('')}
      </div>
      <div class="modal-label">Color</div>
      <div class="modal-colors">
        ${p.colors.map((c,i)=>`<div class="color-dot ${i===0?'selected':''}" style="background:${c}" onclick="selectColor(this)"></div>`).join('')}
      </div>
      <button class="modal-add" onclick="addFromModal(${p.id})">Agregar al Carrito</button>
      <button class="modal-wa" onclick="buyOnWhatsApp(${p.id})">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        Pedir por WhatsApp
      </button>
    </div>`;
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeProductModal(e){
  if(e&&e.target!==document.getElementById('productModal')) return;
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow='';
}
function selectSize(el){document.querySelectorAll('.modal-sz').forEach(s=>s.classList.remove('selected'));el.classList.add('selected');}
function selectColor(el){document.querySelectorAll('.color-dot').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');}

function addFromModal(id){
  const sz=document.querySelector('.modal-sz.selected');
  addToCart(id,sz?sz.textContent:'Unica');
  closeProductModal();
}

function buyOnWhatsApp(id){
  const p=PRODUCTS.find(x=>x.id===id);
  const sz=document.querySelector('.modal-sz.selected');
  const size=sz?sz.textContent:'Unica';
  const msg=`Hola! Quiero comprar:\n\n*${p.name}*\nTalla: ${size}\nPrecio: $${p.price.toLocaleString()} COP\n\nPor favor confirmar disponibilidad.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

// ── CARRITO ─────────────────────────────────────────────────────────────────
function quickAdd(id){addToCart(id,'M');}

function addToCart(id,size){
  const p=PRODUCTS.find(x=>x.id===id);
  const key=`${id}-${size}`;
  const existing=cart.find(x=>x.key===key);
  if(existing){existing.qty++;}
  else{cart.push({key,id,name:p.name,price:p.price,img:p.img,size,qty:1});}
  saveCart();
  showToast(`"${p.name}" agregado al carrito`);
}

function removeFromCart(key){
  cart=cart.filter(x=>x.key!==key);
  saveCart();renderCart();
}

function changeQty(key,delta){
  const item=cart.find(x=>x.key===key);
  if(!item) return;
  item.qty=Math.max(1,item.qty+delta);
  saveCart();renderCart();
}

function saveCart(){
  localStorage.setItem('lm_cart',JSON.stringify(cart));
  document.getElementById('cartBadge').textContent=cart.reduce((a,b)=>a+b.qty,0);
}

function renderCart(){
  const el=document.getElementById('cartItems');
  const totals=document.getElementById('cartTotals');
  if(!cart.length){
    el.innerHTML=`<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      <p>Tu carrito esta vacio</p>
      <button class="btn-primary" onclick="toggleCart()" style="font-size:10px;padding:10px 24px">Ver productos</button>
    </div>`;
    totals.innerHTML='';return;
  }
  el.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Talla: ${item.size}</div>
        <div class="cart-item-price">$${(item.price*item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.key}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.key}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    </div>`).join('');
  const subtotal=cart.reduce((a,b)=>a+b.price*b.qty,0);
  let descuento=0;
  if(couponApplied&&couponApplied.type==='percent') descuento=Math.round(subtotal*couponApplied.value/100);
  const envio=subtotal>120000||couponApplied?.type==='shipping'?0:12000;
  const total=subtotal-descuento+envio;
  totals.innerHTML=`
    <div class="total-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
    ${descuento?`<div class="total-row descuento"><span>Descuento (${couponApplied.value}%)</span><span>−$${descuento.toLocaleString()}</span></div>`:''}
    <div class="total-row"><span>Envio</span><span>${envio===0?'<span style="color:var(--dorado)">GRATIS</span>':'$'+envio.toLocaleString()}</span></div>
    <div class="total-row main"><span>Total</span><span>$${total.toLocaleString()}</span></div>`;
}

function toggleCart(){
  const drawer=document.getElementById('cartDrawer');
  const overlay=document.getElementById('drawerOverlay');
  const isOpen=drawer.classList.contains('open');
  if(!isOpen) renderCart();
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow=isOpen?'':'hidden';
}

// ── CUPONES ─────────────────────────────────────────────────────────────────
function applyCoupon(){
  const code=document.getElementById('couponInput').value.toUpperCase().trim();
  if(COUPONS[code]){
    couponApplied=COUPONS[code];
    showToast(`Cupón "${code}" aplicado correctamente!`);
    renderCart();
  } else {
    showToast('Cupón no válido');
  }
}

// ── CHECKOUT ─────────────────────────────────────────────────────────────────
function openCheckout(){
  if(!cart.length){showToast('Tu carrito esta vacío');return;}
  const subtotal=cart.reduce((a,b)=>a+b.price*b.qty,0);
  let desc=0;
  if(couponApplied&&couponApplied.type==='percent') desc=Math.round(subtotal*couponApplied.value/100);
  const envio=subtotal>120000||couponApplied?.type==='shipping'?0:12000;
  const total=subtotal-desc+envio;
  const content=document.getElementById('checkoutContent');
  content.innerHTML=`
    <div class="checkout-header">
      <h2>Finalizar Compra</h2>
      <button class="drawer-close" onclick="closeCheckoutModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="checkout-body">
      <div class="form-section">
        <h3>Informacion personal</h3>
        <div class="form-row">
          <div class="form-group"><label>Nombre</label><input type="text" id="f-nombre" placeholder="Tu nombre"/></div>
          <div class="form-group"><label>Apellido</label><input type="text" id="f-apellido" placeholder="Tu apellido"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Telefono</label><input type="tel" id="f-tel" placeholder="+57 300 000 0000"/></div>
          <div class="form-group"><label>Email</label><input type="email" id="f-email" placeholder="correo@email.com"/></div>
        </div>
      </div>
      <div class="form-section">
        <h3>Direccion de envio</h3>
        <div class="form-row full">
          <div class="form-group"><label>Direccion completa</label><input type="text" id="f-dir" placeholder="Calle 00 # 00-00"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Ciudad</label><input type="text" id="f-ciudad" placeholder="Bogota"/></div>
          <div class="form-group"><label>Departamento</label>
            <select id="f-dep">
              <option>Cundinamarca</option><option>Antioquia</option><option>Valle del Cauca</option>
              <option>Atlantico</option><option>Santander</option><option>Otro</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-section">
        <h3>Metodo de pago</h3>
        <div class="pay-options">
          <div class="pay-option selected" onclick="selectPay(this)"><div class="pay-icon">💳</div><div class="pay-lbl">Tarjeta</div></div>
          <div class="pay-option" onclick="selectPay(this)"><div class="pay-icon">🏦</div><div class="pay-lbl">PSE</div></div>
          <div class="pay-option" onclick="selectPay(this)"><div class="pay-icon">📱</div><div class="pay-lbl">Nequi</div></div>
        </div>
        <p style="font-size:11px;color:var(--gris-4);margin-top:12px;text-align:center">Los pagos son procesados de forma segura por Wompi</p>
      </div>
      <div class="checkout-summary">
        <h3>Resumen del pedido</h3>
        <div class="summary-items">
          ${cart.map(i=>`<div class="s-item"><span>${i.name} x${i.qty}</span><span>$${(i.price*i.qty).toLocaleString()}</span></div>`).join('')}
          ${desc?`<div class="s-item" style="color:var(--dorado)"><span>Descuento</span><span>−$${desc.toLocaleString()}</span></div>`:''}
          <div class="s-item"><span>Envio</span><span>${envio===0?'GRATIS':'$'+envio.toLocaleString()}</span></div>
          <div class="s-item total"><span>Total</span><span>$${total.toLocaleString()}</span></div>
        </div>
      </div>
      <button class="confirm-btn" onclick="confirmOrder(${total})">Confirmar Pedido — $${total.toLocaleString()}</button>
    </div>`;
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow='hidden';
}

function selectPay(el){document.querySelectorAll('.pay-option').forEach(p=>p.classList.remove('selected'));el.classList.add('selected');}

function closeCheckoutModal(e){
  if(e&&e.target!==document.getElementById('checkoutModal')) return;
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow='';
}

function confirmOrder(total){
  const nombre=document.getElementById('f-nombre')?.value||'';
  const tel=document.getElementById('f-tel')?.value||'';
  const dir=document.getElementById('f-dir')?.value||'';
  const ciudad=document.getElementById('f-ciudad')?.value||'';
  if(!nombre||!tel||!dir){showToast('Por favor completa todos los campos');return;}
  const productos=cart.map(i=>`• ${i.name} (Talla: ${i.size}) x${i.qty} = $${(i.price*i.qty).toLocaleString()}`).join('\n');
  const msg=`*Nuevo Pedido - LUXE MODE*\n\n*Cliente:* ${nombre}\n*Telefono:* ${tel}\n*Direccion:* ${dir}, ${ciudad}\n\n*Productos:*\n${productos}\n\n*Total: $${total.toLocaleString()} COP*\n\nPor favor confirmar y enviar instrucciones de pago.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cart=[];saveCart();
  closeCheckoutModal();
  toggleCart();
  showToast('Pedido enviado! Pronto te contactamos.');
}

// ── NEWSLETTER ────────────────────────────────────────────────────────────
function subscribeNewsletter(){
  const inp=document.querySelector('.nl-form input');
  if(!inp.value.includes('@')){showToast('Ingresa un correo valido');return;}
  showToast('Suscripcion exitosa! Revisa tu correo.');
  inp.value='';
}

// ── TOAST ─────────────────────────────────────────────────────────────────
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

// ── COUNTDOWN ─────────────────────────────────────────────────────────────
(function countdown(){
  const end=new Date();end.setHours(end.getHours()+23,59,59,0);
  function tick(){
    const now=new Date();const diff=end-now;
    if(diff<=0){clearInterval(iv);return;}
    const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
    document.getElementById('cd-h').textContent=String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent=String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent=String(s).padStart(2,'0');
  }tick();
  const iv=setInterval(tick,1000);
})();

// ── INIT ───────────────────────────────────────────────────────────────────
document.getElementById('cartBadge').textContent=cart.reduce((a,b)=>a+b.qty,0);
renderProducts(PRODUCTS);
