// Variable para almacenar los productos que el usuario elige
let carrito = [];
let total = 0;

// Número de teléfono de la veterinaria (incluir código de país, ejemplo Colombia +57)
const NUMERO_WHATSAPP = "573000000000"; 

// Función para mostrar/ocultar el panel del carrito
function toggleCarrito() {
    const panel = document.getElementById('panel-carrito');
    panel.classList.toggle('oculto');
}

// Función para agregar un producto al arreglo 'carrito'
function agregarAlCarrito(nombreProducto, precio) {
    carrito.push({ nombre: nombreProducto, precio: precio });
    total += precio;
    actualizarInterfazCarrito();
    alert(nombreProducto + " agregado al carrito."); // Pequeña notificación
}

// Función para actualizar lo que el usuario ve en la pantalla del carrito
function actualizarInterfazCarrito() {
    const lista = document.getElementById('lista-carrito');
    const contador = document.getElementById('contador-carrito');
    const textoTotal = document.getElementById('total-carrito');

    // Limpiamos la lista antes de volver a pintarla
    lista.innerHTML = '';

    // Recorremos el arreglo y creamos elementos de lista (li)
    carrito.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.nombre}</span> <span>$${item.precio}</span>`;
        lista.appendChild(li);
    });

    // Actualizamos los números
    contador.innerText = carrito.length;
    textoTotal.innerText = total.toLocaleString('es-CO'); // Formato de moneda
}

// Función clave: Crear el mensaje y redirigir a WhatsApp
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos primero.");
        return;
    }

    // Iniciamos el texto del mensaje
    let mensaje = "Hola Clínica Veterinaria, me gustaría hacer el siguiente pedido:\n\n";

    // Agregamos cada producto al texto
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre} - $${item.precio}\n`;
    });

    // Agregamos el total
    mensaje += `\n*Total a pagar: $${total.toLocaleString('es-CO')}*`;

    // Codificamos el texto para que las URLs lo entiendan (convierte espacios en %20, etc.)
    const textoCodificado = encodeURIComponent(mensaje);

    // Creamos la URL de la API de WhatsApp
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${textoCodificado}`;

    // Abrimos la URL en una nueva pestaña
    window.open(url, '_blank');
}