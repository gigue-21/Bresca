// GSAP.js

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si GSAP i ScrollTrigger estan carregats
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP o ScrollTrigger no estan carregats. Verifica les llibreries al <body>.');
        return;
    }

    // Seleccionar el contenidor i les imatges
    const grid = document.querySelector('.image-grid');
    const images = document.querySelectorAll('.parallax-image');

    // Comprovar si les imatges estan presents
    if (images.length === 0) {
        console.error('No s\'han trobat imatges amb la classe .parallax-image');
        return;
    }

    // Crear una línia de temps per a l'animació seqüencial
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#nosaltres',
            start: 'top top',
            end: '+=400%', // Augmentat per acomodar la major durada de les imatges
            pin: true,
            scrub: 0.5, // Més sensible al scroll
            markers: false,
            anticipatePin: 1,
            toggleActions: "play none none reverse"
        }
    });

    // Configurar l'estat inicial de totes les imatges
    gsap.set('.image_cont', { opacity: 0 });

    // Configuració de la durada
    const duration = 7; // Durada total per imatge

    // Posició inicial de totes les imatges
    images.forEach((image, index) => {
        const container = image.parentElement;
        gsap.set(container, { 
            opacity: index === 0 ? 1 : 0,
            zIndex: images.length - index // Assegurar que les imatges es solapin correctament
        });
    });

    // Crear les animacions
    images.forEach((image, index) => {
        const container = image.parentElement;
        const nextIndex = (index + 1) % images.length;
        const nextContainer = images[nextIndex]?.parentElement;

        if (index < images.length - 1) {
            // Animació de transició entre imatges
            tl.to(container, {
                opacity: 0,
                duration: duration/2,
                ease: "power1.inOut"
            })
            .to(nextContainer, {
                opacity: 1,
                duration: duration/2,
                ease: "power1.inOut"
            }, "-=" + duration/2); // Començar mentre l'anterior encara està visible

            // Efecte parallax
            tl.fromTo(image, 
                { y: 0 },
                { 
                    y: -30,
                    duration: duration,
                    ease: "none"
                }, 
                "-=" + duration
            );
        }
    });
});