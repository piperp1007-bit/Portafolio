document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. LÓGICA DEL MENÚ MÓVIL Y ACORDEÓN
    ========================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenuWrapper = document.getElementById('nav-menu-wrapper');
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');

    if (menuToggle && navMenuWrapper) {
        // Abrir/Cerrar menú principal
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenuWrapper.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Lógica de Acordeón para submenús en móviles
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    e.preventDefault(); 
                    
                    // Cerrar otros submenús abiertos
                    dropdowns.forEach(other => {
                        if (other !== dropdown) other.classList.remove('open-mobile');
                    });

                    // Abrir/Cerrar el actual
                    dropdown.classList.toggle('open-mobile');
                }
            });
        });
    }

    /* =========================================
       2. ANIMACIONES AL SCROLLEAR (REVEAL)
    ========================================= */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    /* =========================================
       3. MOTORES DE SWIPER (CARRUSELES)
    ========================================= */
    if (typeof Swiper !== 'undefined') {
        // Carrusel Gigante (Hero)
        if (document.querySelector('.largeShowcaseSwiper')) {
            new Swiper(".largeShowcaseSwiper", {
                loop: true, speed: 1500,
                autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
                effect: "creative",
                creativeEffect: {
                    prev: { shadow: true, translate: ["-120%", 0, -500], rotate: [0, -30, 0], opacity: 0 },
                    next: { translate: ["120%", 0, -500], rotate: [0, 30, 0], opacity: 0 },
                },
                pagination: { el: ".pagination-showcase", clickable: true },
            });
        }

        // Carrusel Testimonios
        if (document.querySelector('.testimonialsSwiper')) {
            new Swiper(".testimonialsSwiper", {
                slidesPerView: 1, spaceBetween: 30, loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false },
                pagination: { el: ".swiper-pagination", clickable: true },
                breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
            });
        }
    }

    /* =========================================
       4. LÓGICA DEL AGENTE IA DE LECTURA (BLOG)
    ========================================= */
    const aiButtons = document.querySelectorAll('.btn-ai-summary');
    const aiModal = document.getElementById('ai-modal');
    const closeAiModal = document.getElementById('close-ai-modal');
    const terminalOutput = document.getElementById('ai-terminal-output');

    if (aiButtons.length > 0 && aiModal) {
        closeAiModal.addEventListener('click', () => {
            aiModal.classList.remove('active');
            terminalOutput.innerHTML = ''; 
        });

        aiButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const articleId = btn.getAttribute('data-article');
                aiModal.classList.add('active');
                terminalOutput.innerHTML = ''; 
                
                // Animación de la terminal
                setTimeout(() => addTerminalLine('> Inicializando modelo analítico...'), 500);
                setTimeout(() => addTerminalLine('> Escaneando dominios semánticos... [OK]'), 1500);
                setTimeout(() => addTerminalLine('> Consultando al núcleo de Inteligencia Artificial (Gemini)...'), 2500);

                try {
                    // LLAMADA REAL A NUESTRO SERVIDOR NODE.JS
                    const response = await fetch('http://localhost:3000/api/resumir-blog', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ articuloId: articleId })
                    });
                    
                    const data = await response.json();

                    setTimeout(() => {
                        const summaryHtml = `<div class="terminal-line terminal-summary" style="margin-top: 15px; color: #00e5ff;">
                                                <strong>> RESULTADO DEL ANÁLISIS:</strong><br><br>
                                                ${data.resumen}
                                             </div>`;
                        terminalOutput.insertAdjacentHTML('beforeend', summaryHtml);
                    }, 4000);

                } catch (error) {
                    setTimeout(() => addTerminalLine('> ERROR: Fallo de conexión con el núcleo IA.'), 4000);
                }
            });
        });

        function addTerminalLine(text) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = text;
            terminalOutput.appendChild(line);
        }
    }

    /* =========================================
       5. LÓGICA DEL CARRITO DE COMPRAS
    ========================================= */
    const cartHTML = `
        <div class="cart-overlay" id="cart-overlay"></div>
        <div class="cart-sidebar" id="cart-sidebar">
            <div class="cart-header">
                <h2>Tu Carrito</h2>
                <button class="close-cart" id="close-cart">✕</button>
            </div>
            <div class="cart-items" id="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span id="cart-total-price">$0 USD</span>
                </div>
                <button class="btn-checkout" id="btn-checkout">Proceder al Pago</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);

    let cart = JSON.parse(localStorage.getItem('cognos_cart')) || [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartButtons = document.querySelectorAll('.cart-btn'); 
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCounters = document.querySelectorAll('.cart-count'); 

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        renderCart(); 
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    }

    cartButtons.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    }));
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart); 

    function renderCart() {
        cartItemsContainer.innerHTML = ''; 
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:40px;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toLocaleString('en-US')} USD</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        cartTotalPrice.textContent = `$${total.toLocaleString('en-US')} USD`;
        cartCounters.forEach(counter => counter.textContent = cart.length);
        localStorage.setItem('cognos_cart', JSON.stringify(cart));
    }

    function addToCart(name, price) {
        cart.push({ name, price });
        renderCart(); 
        openCart();   
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1); 
        renderCart();
    }

    const addProductButtons = document.querySelectorAll('.product-info .btn-primary');
    addProductButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-info');
            const productName = productCard.querySelector('h3').innerText;
            const priceText = productCard.querySelector('.price').innerText;
            const priceNumber = parseInt(priceText.replace(/[^0-9]/g, ''));
            addToCart(productName, priceNumber);
        });
    });

    renderCart();

    // Finalizar Compra (Backend + WhatsApp)
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', async () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío. ¡Añade algunos productos primero!");
                return; 
            }

            const nombreCliente = prompt("Para registrar tu pedido, por favor ingresa tu nombre completo:");
            if (!nombreCliente) return; 

            const telefonoCliente = prompt("Ingresa tu número de teléfono (Ej: 3001234567):");
            if (!telefonoCliente) return;

            let total = 0;
            cart.forEach(item => total += item.price);

            const originalText = btnCheckout.textContent;
            btnCheckout.textContent = 'Procesando...';
            btnCheckout.disabled = true;

            try {
                const pedidoData = { cliente_nombre: nombreCliente, telefono: telefonoCliente, total: total, productos: cart };

                const response = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pedidoData)
                });

                const data = await response.json();

               if (response.ok) {
                    alert(`✅ ${data.mensaje} Tu número de orden es: #${data.pedido_id}`);
                    
                    const numeroVentas = "573000000000"; 
                    let mensajeWa = `Hola, soy ${nombreCliente}. Acabo de registrar el pedido #${data.pedido_id} en su página web:\n\n`;
                    cart.forEach(item => mensajeWa += `▪️ ${item.name} - $${item.price.toLocaleString('en-US')} USD\n`);
                    mensajeWa += `\n*Total:* $${total.toLocaleString('en-US')} USD\n\nPor favor, indíquenme los pasos a seguir.`;

                    cart = [];
                    renderCart();
                    closeCart();

                    window.location.href = `https://wa.me/${numeroVentas}?text=${encodeURIComponent(mensajeWa)}`;
                } else {
                    alert('❌ Hubo un error al procesar tu pedido: ' + data.mensaje);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('⚠️ No se pudo conectar con el servidor para guardar el pedido.');
            } finally {
                btnCheckout.textContent = originalText;
                btnCheckout.disabled = false;
            }
        });
    }

    /* =========================================
       6. LÓGICA DEL AGENTE VIRTUAL (CONEXIÓN BACKEND)
    ========================================= */
    const botTrigger = document.getElementById('ai-bot-trigger');
    const chatWindow = document.getElementById('bot-chat-window');
    const closeBotBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    if (botTrigger && chatWindow) {
        botTrigger.addEventListener('click', () => {
            chatWindow.classList.add('active');
            chatInput.focus(); 
        });

        if(closeBotBtn) closeBotBtn.addEventListener('click', () => chatWindow.classList.remove('active'));

        const sendMessage = async () => {
            const text = chatInput.value.trim();
            if (text === '') return; 

            appendMessage(text, 'user-message');
            chatInput.value = ''; 

            if (typingIndicator) typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight; 

            const response = await getBotResponse(text);

            if (typingIndicator) typingIndicator.style.display = 'none';
            appendMessage(response, 'bot-message');
        };

        if(sendBtn) sendBtn.addEventListener('click', sendMessage);
        if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

        function appendMessage(text, className) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${className}`;
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function getBotResponse(input) {
            try {
                const response = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mensaje: input })
                });
                const data = await response.json();
                if (response.ok) return data.respuesta;
                else return "Hubo un error de comunicación con mi núcleo central.";
            } catch (error) {
                console.error('Error del agente:', error);
                return 'Mis sistemas de red están experimentando latencia. Por favor, asegúrate de que el servidor Backend (Node.js) esté encendido.';
            }
        }
    }

    /* =========================================
       7. LÓGICA DEL INICIO DE SESIÓN
    ========================================= */
    const loginHTML = `
        <div class="login-overlay" id="login-overlay">
            <div class="login-modal">
                <button class="close-login" id="close-login">✕</button>
                <h2>Bienvenido a Cognos</h2>
                <p>Ingresa a tu panel de control corporativo</p>
                <form class="login-form" id="login-form">
                    <input type="email" id="login-email" class="cyber-input" placeholder="Correo electrónico corporativo" required>
                    <input type="password" id="login-password" class="cyber-input" placeholder="Contraseña" required>
                    <button type="submit" id="login-btn" class="btn-primary" style="width: 100%; border-radius: 10px;">Ingresar al Ecosistema</button>
                </form>
                <p style="margin-top: 20px; font-size: 0.85rem;">
                    <a href="#" style="color: var(--cognos-blue); text-decoration: none; font-weight: 600;">¿Olvidaste tu contraseña?</a>
                </p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loginHTML);

    const loginOverlay = document.getElementById('login-overlay');
    const closeLoginBtn = document.getElementById('close-login');
    const loginButtons = document.querySelectorAll('.btn-login');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');

    loginButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            loginOverlay.classList.add('active');
        });
    });

    if(closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginOverlay.classList.remove('active'));
    if(loginOverlay) loginOverlay.addEventListener('click', (e) => {
        if (e.target === loginOverlay) loginOverlay.classList.remove('active');
    });

    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const userData = { email: loginEmail.value, password: loginPassword.value };
            const originalBtnText = loginBtn.textContent;
            loginBtn.textContent = 'Autenticando...';
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const data = await response.json(); 

                if (response.ok) {
                    alert('¡' + data.mensaje + ' Hola, ' + data.usuarioNombre + '!');
                    // ---> NUEVO: Le damos la llave de acceso al navegador <---
                    localStorage.setItem('cognos_acceso_permitido', 'true');
                    loginForm.reset();
                    loginOverlay.classList.remove('active');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ ' + data.mensaje);
                }
            } catch (error) {
                console.error('Error de conexión con el servidor:', error);
                alert('⚠️ No se pudo conectar con el servidor backend. ¿Está encendido en la terminal?');
            } finally {
                loginBtn.textContent = originalBtnText;
                loginBtn.disabled = false;
                loginBtn.style.opacity = '1';
            }
        });
    }

    /* =========================================
       8. LÓGICA DEL FORMULARIO PQRS
    ========================================= */
    const formPqrs = document.getElementById('form-pqrs');

    if (formPqrs) {
        formPqrs.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const btnSubmit = document.getElementById('btn-submit-pqrs');
            const originalText = btnSubmit.textContent;

            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const calificacion = ratingInput ? parseInt(ratingInput.value) : null;

            const pqrsData = {
                relacion: document.getElementById('pqrs-relacion').value,
                tipo: document.getElementById('pqrs-tipo').value,
                nombre: document.getElementById('pqrs-nombre').value,
                cargo: document.getElementById('pqrs-cargo').value,
                email: document.getElementById('pqrs-email').value,
                comentarios: document.getElementById('pqrs-comentarios').value,
                calificacion: calificacion
            };

            btnSubmit.textContent = 'Enviando...';
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.7';

            try {
                const response = await fetch('http://localhost:3000/api/pqrs', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pqrsData)
                });
                const data = await response.json();

                if (response.ok) {
                    alert('✅ ' + data.mensaje);
                    formPqrs.reset(); 
                } else {
                    alert('❌ Error: ' + data.mensaje);
                }
            } catch (error) {
                console.error('Error al enviar PQRS:', error);
                alert('⚠️ No se pudo conectar con el servidor. Intenta más tarde.');
            } finally {
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
            }
        });
    }
    /* =========================================
       NUEVO: LÓGICA DE LECTURA COMPLETA (BLOG)
    ========================================= */
    // 1. Inyectamos el diseño del Modal de Lectura
    const readerModalHTML = `
        <div class="login-overlay" id="reader-modal-overlay">
            <div class="login-modal" style="max-width: 700px; text-align: left; padding: 40px;">
                <button class="close-login" id="close-reader-modal">✕</button>
                <h2 id="reader-modal-title" style="color: var(--cognos-blue); margin-bottom: 20px;">Cargando...</h2>
                <div id="reader-modal-content" style="line-height: 1.8; color: var(--text-light); font-size: 1.05rem;">
                    Por favor espera...
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', readerModalHTML);

    // 2. Capturamos los elementos
    const readerOverlay = document.getElementById('reader-modal-overlay');
    const closeReaderBtn = document.getElementById('close-reader-modal');
    const readerTitle = document.getElementById('reader-modal-title');
    const readerContent = document.getElementById('reader-modal-content');
    
    // 3. Buscamos todos los botones que digan "Leer completo"
    // NOTA: Asegúrate de que en tu HTML estos botones tengan la clase 'btn-read-more' y 'data-article="1"'
    const readMoreButtons = document.querySelectorAll('.btn-read-more');

    readMoreButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const articleId = btn.getAttribute('data-article');
            
            // Abrimos la ventana y ponemos texto de carga
            readerOverlay.classList.add('active');
            readerTitle.textContent = "Accediendo a la base de datos...";
            readerContent.textContent = "Descargando artículo...";

            try {
                // Pedimos el artículo a Node.js
                // Pedimos el artículo a Node.js (con la ruta completa)
                const response = await fetch('http://localhost:3000/api/leer-articulo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ articuloId: articleId })
                });
                
                const data = await response.json();

                if (data.exito) {
                    readerTitle.textContent = data.articulo.titulo;
                    readerContent.innerHTML = `<p>${data.articulo.texto}</p>`;
                } else {
                    readerTitle.textContent = "Error 404";
                    readerContent.textContent = "El artículo ha sido movido o eliminado.";
                }
            } catch (error) {
                readerTitle.textContent = "Error de Conexión";
                readerContent.textContent = "No se pudo conectar con el servidor.";
            }
        });
    });

    // 4. Lógica para cerrar la ventana
    if(closeReaderBtn) closeReaderBtn.addEventListener('click', () => readerOverlay.classList.remove('active'));
    if(readerOverlay) readerOverlay.addEventListener('click', (e) => {
        if (e.target === readerOverlay) readerOverlay.classList.remove('active');
    });
});