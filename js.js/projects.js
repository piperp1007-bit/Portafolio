const proyectos = [
  {
    titulo: "LUXE MODE",
    subtitulo: "Tienda de Ropa Online",
    desc: "E-commerce completo con catálogo y WhatsApp.",
    tags: ["E-commerce", "WhatsApp"],
    stack: ["HTML", "CSS", "JS"],
    imagen: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    link: "#"
  },
  {
    titulo: "Mascotas Cotas",
    subtitulo: "Veterinaria",
    desc: "Página web para veterinaria con sistema de pedidos.",
    tags: ["Landing Page"],
    stack: ["HTML", "CSS", "PHP"],
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    link: "#"
  }
];

function renderizarProyectos() {
  const container = document.getElementById('projects-container');
  if(!container) return;
  
  container.innerHTML = proyectos.map(p => `
    <div class="proj-card fade-up">
      <div class="proj-img">
        <img src="${p.imagen}" alt="${p.titulo}">
        <div class="proj-overlay"></div>
      </div>
      <div class="proj-body">
        <div class="proj-tags">${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>
        <div class="proj-name">${p.titulo}</div>
        <p class="proj-desc">${p.desc}</p>
        <div class="proj-footer">
          <div class="proj-stack">${p.stack.map(s => `<span class="stack-item">${s}</span>`).join('')}</div>
          <a href="${p.link}" class="proj-link">Ver proyecto</a>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderizarProyectos);