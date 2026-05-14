require('dotenv').config(); // Carga la caja fuerte (.env)
const bcrypt = require('bcrypt'); // Librería de encriptación
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// =========================================
// SERVIDOR BACKEND PRINCIPAL - COGNOS SAS
// =========================================

const express = require('express');
const cors = require('cors');

// Importamos nuestra conexión a la base de datos PostgreSQL
const pool = require('./db'); 

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// =========================================
// RUTAS DE LA API (Endpoints)
// =========================================

// Ruta de estado
app.get('/api/status', (req, res) => {
    res.json({ estado: 'Exitoso', mensaje: 'Servidor funcionando' });
});

// Ruta para INICIAR SESIÓN (VALIDACIÓN ENCRIPTADA)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscamos al usuario por su correo
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length > 0) {
            const usuarioDb = result.rows[0];

            // 2. Comparamos la contraseña plana con la encriptada en la DB
            const contraseñaValida = await bcrypt.compare(password, usuarioDb.password);

            if (contraseñaValida) {
                res.json({ exito: true, mensaje: 'Autenticación exitosa', usuarioNombre: usuarioDb.nombre });
            } else {
                res.status(401).json({ exito: false, mensaje: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ exito: false, mensaje: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
    }
});

// Ruta para recibir y guardar un formulario PQRS
app.post('/api/pqrs', async (req, res) => {
    // 1. Extraemos todos los datos que envía el frontend
    const { relacion, tipo, nombre, cargo, email, comentarios, calificacion } = req.body;

    console.log(`Nuevo PQRS recibido de: ${nombre} (${tipo})`);

    try {
        // 2. Preparamos la consulta SQL
        const query = `
            INSERT INTO pqrs_solicitudes 
            (relacion, tipo_solicitud, nombre, cargo, email, comentarios, calificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id
        `;
        const values = [relacion, tipo, nombre, cargo, email, comentarios, calificacion];
        
        // 3. Ejecutamos la inserción en PostgreSQL
        const resultado = await pool.query(query, values);

        // 4. Respondemos con éxito y el ID del radicado
        res.json({ 
            exito: true, 
            mensaje: 'Solicitud radicada con éxito. Número de radicado: ' + resultado.rows[0].id 
        });

    } catch (error) {
        console.error('Error al guardar PQRS:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al guardar la solicitud.' });
    }
});
// Ruta para LEER todos los PQRS y mostrarlos en el Dashboard
app.get('/api/pqrs', async (req, res) => {
    try {
        // Buscamos todas las solicitudes, ordenadas de la más reciente a la más antigua
        const query = 'SELECT * FROM pqrs_solicitudes ORDER BY fecha_creacion DESC';
        const resultado = await pool.query(query);

        // Enviamos los datos al frontend
        res.json({ exito: true, datos: resultado.rows });
    } catch (error) {
        console.error('Error al consultar PQRS:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener los datos.' });
    }
});
// Ruta para LEER todos los pedidos y mostrarlos en el Dashboard
app.get('/api/pedidos', async (req, res) => {
    try {
        // Buscamos todas las ventas ordenadas de la más reciente a la más antigua
        const query = 'SELECT * FROM pedidos ORDER BY fecha_creacion DESC';
        const resultado = await pool.query(query);

        res.json({ exito: true, datos: resultado.rows });
    } catch (error) {
        console.error('Error al consultar ventas:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener las ventas.' });
    }
});
// Ruta para GUARDAR un nuevo pedido desde el carrito
app.post('/api/pedidos', async (req, res) => {
    // 1. Recibimos los datos del cliente y el arreglo de productos
    const { cliente_nombre, telefono, total, productos } = req.body;

    console.log(`Nuevo pedido recibido de: ${cliente_nombre} por $${total}`);

    try {
        // 2. Guardamos el pedido principal y obtenemos su ID generado
        const queryPedido = `
            INSERT INTO pedidos (cliente_nombre, telefono, total) 
            VALUES ($1, $2, $3) RETURNING id
        `;
        const resultPedido = await pool.query(queryPedido, [cliente_nombre, telefono, total]);
        const nuevoPedidoId = resultPedido.rows[0].id;

        // 3. Recorremos el arreglo de productos y los guardamos uno por uno en el detalle
        for (let producto of productos) {
            const queryDetalle = `
                INSERT INTO detalle_pedidos (pedido_id, producto_nombre, precio) 
                VALUES ($1, $2, $3)
            `;
            await pool.query(queryDetalle, [nuevoPedidoId, producto.name, producto.price]);
        }

        // 4. Respondemos con éxito
        res.json({ 
            exito: true, 
            mensaje: 'Pedido guardado en la base de datos con éxito.',
            pedido_id: nuevoPedidoId
        });

    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al procesar la compra.' });
    }
});
// Ruta para LEER los usuarios registrados en el sistema
app.get('/api/usuarios', async (req, res) => {
    try {
        // Seleccionamos todo EXCEPTO la contraseña por seguridad
        const query = 'SELECT id, nombre, email, fecha_creacion FROM usuarios ORDER BY id ASC';
        const resultado = await pool.query(query);

        res.json({ exito: true, datos: resultado.rows });
    } catch (error) {
        console.error('Error al consultar usuarios:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener los usuarios.' });
    }
});
// Ruta para CREAR un nuevo usuario (CON ENCRIPTACIÓN)
app.post('/api/usuarios', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        // 1. Encriptamos la contraseña (le damos 10 vueltas de seguridad)
        const saltos = 10;
        const passwordEncriptada = await bcrypt.hash(password, saltos);

        // 2. Guardamos la contraseña encriptada en PostgreSQL
        const query = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [nombre, email, passwordEncriptada]);
        
        res.json({ exito: true, mensaje: 'Usuario creado y asegurado correctamente', id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'El correo ya existe o hubo un error.' });
    }
});
// =========================================
// BASE DE DATOS DE ARTÍCULOS (Simulada en memoria)
// =========================================
const baseDeDatosArticulos = {
    "1": {
        titulo: "La Ciberseguridad con Inteligencia Artificial en 2025",
        texto: `En 2025, los ataques cibernéticos son más sofisticados, veloces y personalizados que nunca. Desde fraudes por correo hasta ataques a infraestructuras críticas, los delincuentes usan IA para romper defensas en segundos. Ante este panorama, la ciberseguridad tradicional ya no basta.

Por eso, la inteligencia artificial se convierte en la aliada número uno para proteger a las empresas.

¿Qué es la ciberseguridad con IA?
Es el uso de algoritmos inteligentes que:
- Detectan patrones inusuales de comportamiento en la red.
- Aprenden de intentos anteriores de ataque para anticiparse.
- Responden automáticamente a amenazas sin intervención humana.

Tendencias destacadas en 2025:
✅ Detección de amenazas en tiempo real: IA analiza millones de eventos por segundo y detecta anomalías.
✅ Autenticación biométrica inteligente: Las empresas ahora combinan reconocimiento facial y de voz.
✅ Respuesta automatizada a incidentes (SOAR): Ejecuta protocolos de seguridad automáticamente en caso de brechas.
✅ Zero Trust potenciado por IA: Algoritmos que analizan cada acceso a sistemas.
✅ Ciberinteligencia predictiva: Predecir vectores de ataque antes de que ocurran.

¿Y para las pymes en Colombia?
Hoy, soluciones como Kaspersky o Fortinet ofrecen paquetes accesibles con IA integrada que monitorean redes, detectan ransomware y protegen bases de datos. En un entorno donde cada segundo cuenta, tener herramientas inteligentes hace la diferencia.

¿Y tú, ya proteges tu empresa con tecnología de última generación?
No dejes tu seguridad en manos de un antivirus básico. En COGNOS S.A.S. te ayudamos a implementar soluciones inteligentes, escalables y pensadas para tu tamaño y sector.

📩 Contáctanos hoy y evaluamos juntos el nivel de riesgo de tu infraestructura.
Whatsapp: https://wa.link/5kgey1`
    },
   "2": {
        titulo: "Yoga Solar PC Concept: ¿El futuro de los portátiles sostenibles?",
        texto: `En un mundo donde la tecnología avanza a pasos agigantados, es fácil sorprendernos con innovaciones impresionantes. Pero cuando una marca como Lenovo combina inteligencia artificial, diseño innovador y energía renovable en un solo dispositivo, no solo estamos hablando de evolución, sino de una auténtica revolución.

☀️ Un portátil que se carga con el sol
Durante el MWC 2025, Lenovo presentó el Yoga Solar PC Concept, un portátil ultradelgado que incorpora paneles solares de alta eficiencia en su carcasa. ¿El resultado? Con solo 20 minutos de exposición al sol, este dispositivo obtiene suficiente energía para una hora de reproducción de video.
Esto es más que un truco tecnológico. Se trata de una apuesta real por la sostenibilidad y la autonomía energética, lo que podría cambiar por completo la forma en que usamos nuestros dispositivos, especialmente en entornos donde el acceso a la electricidad es limitado.

⚡ ¿Cómo funciona?
El Yoga Solar PC Concept está equipado con un sistema de paneles solares con una tasa de conversión superior al 24%, lo que significa que es capaz de captar y transformar la energía del sol en electricidad con una eficiencia mucho mayor que los paneles convencionales. Además, Lenovo ha trabajado para integrar esta tecnología sin comprometer el diseño: sigue siendo ligero, elegante y funcional, como cualquier otro dispositivo de la serie Yoga.

🔋 Un paso hacia la independencia energética
Imagínate viajar a un lugar remoto, trabajar en un parque o simplemente olvidarte del cargador sin preocuparte por la batería. Aunque este es solo un concepto, su potencial es enorme:
✔️ Sostenibilidad: Reduce la dependencia de la red eléctrica y disminuye la huella de carbono.
✔️ Versatilidad: Ideal para viajeros, fotógrafos, investigadores y profesionales en movimiento.
✔️ Innovación real: No es solo una idea futurista, sino una tecnología en la que ya se está invirtiendo.

🚀 ¿Cuándo estará disponible?
Si bien el Yoga Solar PC Concept es un prototipo, su presentación en el MWC 2025 sugiere que Lenovo está explorando seriamente la viabilidad de esta tecnología. Aún no hay fechas de lanzamiento ni especificaciones finales, pero lo que sí está claro es que la tendencia hacia dispositivos más sostenibles está en marcha.

El futuro de los portátiles es brillante… literalmente. El Yoga Solar PC Concept nos da un vistazo a un futuro donde nuestros dispositivos serán más autónomos, eficientes y respetuosos con el medio ambiente.

¿Te imaginas un mundo donde nunca más tengas que buscar un enchufe? El futuro es ahora.

Más info: https://news.lenovo.com/pressroom/press-releases/expanding-boundaries-ai-powered-creativity-productivity-and-innovation/`
    }
};

// =========================================
// 1. RUTA PARA EL AGENTE IA (RESÚMENES)
// =========================================
app.post('/api/resumir-blog', async (req, res) => {
    const { articuloId } = req.body;
    const articuloObj = baseDeDatosArticulos[articuloId];

    if (!articuloObj) return res.status(404).json({ exito: false, resumen: "Artículo no encontrado." });

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "Eres el Agente Analítico de Cognos. Lee el texto y devuelve un resumen muy conciso (máximo 3 líneas). Usa un tono tecnológico." 
        });
        const result = await model.generateContent(`Resume este artículo técnico:\n\n${articuloObj.texto}`);
        res.json({ exito: true, resumen: result.response.text() });
    } catch (error) {
        res.status(500).json({ exito: false, resumen: "Error al generar el resumen con IA." });
    }
});

// =========================================
// 2. RUTA PARA LEER EL ARTÍCULO COMPLETO (HUMANOS)
// =========================================
app.post('/api/leer-articulo', (req, res) => {
    const { articuloId } = req.body;
    const articuloObj = baseDeDatosArticulos[articuloId];

    if (articuloObj) {
        res.json({ exito: true, articulo: articuloObj });
    } else {
        res.status(404).json({ exito: false, mensaje: "Artículo no encontrado." });
    }
});
// =========================================
// ARRANQUE DEL SERVIDOR
// =========================================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor backend ejecutándose en el puerto ${PORT}`);
    console.log(`=========================================`);
});