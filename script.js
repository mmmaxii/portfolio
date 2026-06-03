// Espero a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efecto de aparición (Fade-in on Scroll)
    const fadeElems = document.querySelectorAll('.fade-in');
    
    // Configuración del observador
    const appearOptions = {
        threshold: 0.15, // El elemento debe estar 15% visible
        rootMargin: "0px 0px -50px 0px" // Ejecuto un poco antes de que llegue
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Si no está visible, no hago nada
            } else {
                entry.target.classList.add('appear'); // Añado clase que activa la animación CSS
                appearOnScroll.unobserve(entry.target); // Dejo de observar una vez que apareció
            }
        });
    }, appearOptions);
    
    // Activo el observador para cada elemento con la clase .fade-in
    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // 2. Inicializo Carrusel Swiper.js en las Tarjetas de Proyectos Regulares
    const swipers = new Swiper('.projectSwiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false, // Sigo rotando incluso tras tocar
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // Animaciones más suaves
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800
    });

    // 3. Inicializo Carrusel rápido para Agujero Negro
    const fastSwiper = new Swiper('.fastSwiper', {
        loop: true,
        autoplay: {
            delay: 1200, // Mucho más rápido (1.2 segundos entre imágenes)
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 300 // Transición más ágil
    });
    
    console.log("Portafolio Ámbar/Dorado cargado interactivo.");
});

// --- Lógica de Pestañas (Tabs) de la Práctica ---
function openTab(tabId) {
    // 1. Ocultar todos los contenidos de las pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // 2. Quitar la clase active de todos los botones
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Mostrar el contenido seleccionado y marcar su botón como activo
    document.getElementById(tabId).classList.add('active');
    
    // Encontrar el botón que disparó el evento para marcarlo
    const activeBtn = Array.from(tabBtns).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// --- Lógica de Galería Interactiva ---
function changeGalleryImage(imageSrc, title, description, clickedElement) {
    // 1. Cambiar imagen principal y texto
    document.getElementById('gallery-main-img').src = imageSrc;
    document.getElementById('gallery-main-title').textContent = title;
    document.getElementById('gallery-main-desc').textContent = description;

    // 2. Quitar clase active de todas las miniaturas
    const thumbs = document.querySelectorAll('.thumbnails-container .thumb');
    thumbs.forEach(thumb => {
        thumb.classList.remove('active-thumb');
    });

    // 3. Agregar clase active a la miniatura clickeada
    if (clickedElement) {
        clickedElement.classList.add('active-thumb');
    }
}