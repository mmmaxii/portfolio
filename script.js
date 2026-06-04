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

// --- Lógica de Galería Paramétrica ---
let currentAlpha = '0.01';

function setAlpha(btnElement, alphaValue) {
    // Actualizar botones de alpha
    const btns = document.querySelectorAll('.alpha-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Actualizar estado
    currentAlpha = alphaValue;

    // Refrescar galería
    updateParametricGallery();
}

function updateParametricGallery() {
    const scenario = document.getElementById('scenario-select').value;
    const imgElement = document.getElementById('parametric-main-img');
    const titleElement = document.getElementById('parametric-title');
    const descElement = document.getElementById('parametric-desc');

    let imageSrc = "";
    let scenarioText = "";
    let descText = "";

    // Construir la ruta de la imagen real y actualizar textos
    switch(scenario) {
        case 'base':
            imageSrc = `img/practica/gifs/base/run_r5.0_m0.01_a${currentAlpha}.gif`;
            scenarioText = "Baseline";
            descText = `Evolución de la densidad de polvo a 10 Myr bajo el régimen de viscosidad de Shakura-Sunyaev (α = ${currentAlpha}). Sin interacción planetaria fuerte (M_gap = 0.01).`;
            break;
        case 'gap':
            imageSrc = `img/practica/gifs/run_r15.0_m3.0_a${currentAlpha}.gif`;
            scenarioText = "Gap 15 AU";
            descText = `Planeta de 3 M_jup en 15 AU esculpiendo un gap profundo. La eficiencia de atrapamiento depende fuertemente de la viscosidad (α = ${currentAlpha}).`;
            break;
        case 'sinusoidal':
            imageSrc = `img/practica/gifs/sinusoidal/MuchosGaps_A0.7.gif`;
            scenarioText = "Estructura Sinusoidal";
            descText = `Perturbaciones sinusoidales en el disco generando múltiples trampas de polvo locales. (Ejemplo con A=0.7).`;
            break;
    }

    imgElement.src = imageSrc;

    // Formatear alpha para display
    let displayAlpha = currentAlpha;
    if (currentAlpha === '0.01') displayAlpha = '10⁻²';
    if (currentAlpha === '0.001') displayAlpha = '10⁻³';
    if (currentAlpha === '0.0001') displayAlpha = '10⁻⁴';

    titleElement.textContent = `Escenario: ${scenarioText} | α = ${displayAlpha}`;
    descElement.textContent = descText;
}