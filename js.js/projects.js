/**
 * Renderizado Dinámico de Proyectos
 * Versión de ejecución garantizada
 */
const proyectos = [
  {
    titulo: "LUXE MODE",
    subtitulo: "Tienda de Ropa Online",
    desc: "E-commerce completo con catálogo dinámico y pedidos por WhatsApp.",
    tags: ["E-commerce", "JavaScript"],
    imagen: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    link: "#"
  },
  {
    titulo: "Mascotas Cotas",
    subtitulo: "Clínica Veterinaria",
    desc: "Sitio web profesional con gestión de servicios y citas.",
    tags: ["Landing Page", "PHP"],
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    link: "#"
  }
];

function inicializarRenderizado() {
    const grid = document.getElementById('projects-container');
    
    // Si el contenedor aún no existe en el DOM, reintentamos en 100ms
    if (!grid) {
        setTimeout(inicializarRenderizado, 100);
        return;
    }

    console.log("¡Contenedor encontrado! Renderizando proyectos...");

    grid.innerHTML = proyectos.map(p => `
        <div class="proj-card fade-up visible" style="opacity: 1; transform: translateY(0);">
            <div class="proj-img">
                <img src="${p.imagen}" alt="${p.titulo}" style="width:100%; display:block;">
                <div class="proj-overlay"></div>
            </div>
            <div class="proj-body" style="padding: 25px;">
                <div class="proj-tags" style="margin-bottom: 15px; display: flex; gap: 8px;">
                    ${p.tags.map(t => `<span class="proj-tag" style="border: 1px solid var(--blue); color: var(--blue); padding: 2px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase;">${t}</span>`).join('')}
                </div>
                <h3 style="font-family: var(--font-h); color: var(--white); font-size: 20px; margin-bottom: 10px;">${p.titulo}</h3>
                <p style="color: var(--grey-2); font-size: 13px; line-height: 1.6; margin-bottom: 20px;">${p.desc}</p>
                <div class="proj-footer">
                    <button onclick="window.open('${p.link}', '_blank')" class="proj-link" style="background: none; border: none; color: var(--blue); cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px;">
                        Ver proyecto 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Arrancamos el proceso
inicializarRenderizado();