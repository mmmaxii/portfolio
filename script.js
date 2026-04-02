// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efecto de aparición (Fade-in on Scroll)
    const fadeElems = document.querySelectorAll('.fade-in');
    
    // Configuración del observador
    const appearOptions = {
        threshold: 0.15, // El elemento debe estar 15% visible
        rootMargin: "0px 0px -50px 0px" // Ejecutar un poco antes de que llegue
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Si no está visible, no hacer nada
            } else {
                entry.target.classList.add('appear'); // Añadir clase que activa la animación CSS
                appearOnScroll.unobserve(entry.target); // Dejar de observar una vez que apareció
            }
        });
    }, appearOptions);
    
    // Activar el observador para cada elemento con la clase .fade-in
    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });
    
    console.log("Portafolio 'Night Tech' cargado e interactivo.");
});