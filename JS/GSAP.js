// GSAP.js

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    // Verificar GSAP i ScrollTrigger
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP o ScrollTrigger no estan carregats. Verifica les llibreries al <body>.');
        return;
    }

    // ANIMACIÓ PARALLAX IMATGES "NOSALTRES"
    const images = document.querySelectorAll('#nosaltres .parallax-image');
    const nosaltresSection = document.getElementById('nosaltres');

    if (images.length === 0) {
        console.error('No s\'han trobat imatges amb la classe .parallax-image');
    } else {
        // guardar la posició original de cada imatge per poder restaurar-la si cal
        const originalPlace = new Map();
        images.forEach(img => {
            originalPlace.set(img, { parent: img.parentElement, next: img.nextSibling });
        });

        function restoreImagesToOriginal() {
            images.forEach(img => {
                const info = originalPlace.get(img);
                if (info && info.parent) {
                    // si l'element ja no està al seu contenidor original, tornar-lo
                    if (!info.parent.contains(img)) {
                        if (info.next && info.next.parentNode === info.parent) {
                            info.parent.insertBefore(img, info.next);
                        } else {
                            info.parent.appendChild(img);
                        }
                    }
                    // netejar estils inline aplicats per la versió mòbil
                    img.style.display = '';
                    img.style.opacity = '';
                    img.style.position = '';
                    img.style.width = '';
                    img.style.height = '';
                    img.style.zIndex = '';
                    // restaurar el contenidor (si s'havia amagat)
                    info.parent.style.display = '';
                    // restaurar possibles propietats que hem tocat
                    info.parent.style.minHeight = '';
                    info.parent.style.padding = '';
                }
            });

            // restaurar columna d'imatges i forum si existeixen
            const imageColumn = document.querySelector('#nosaltres .row > .col-12.col-lg-6:last-child');
            if (imageColumn) {
                imageColumn.style.display = '';
                imageColumn.style.minHeight = '';
                imageColumn.style.padding = '';
            }
            const textColumn = document.querySelector('#nosaltres .row > .col-12.col-lg-6:first-child');
            if (textColumn) {
                textColumn.style.marginBottom = '';
            }
            const forum = document.getElementById('forum');
            if (forum) forum.style.paddingTop = '';
        }

        function setMobileNosaltres() {
            // Cerca case-insensitive de Nosaltres_4
            const targetImg = Array.from(images).find(img => img.src && img.src.toLowerCase().includes('nosaltres_4'));

            // Amagar tots els contenidors d'imatge per defecte
            images.forEach(img => {
                if (img.parentElement) {
                    img.parentElement.style.display = 'none';
                } else {
                    img.style.display = 'none';
                }
            });

            // Amagar la columna d'imatges (reduirà l'espai vertical)
            const imageColumn = document.querySelector('#nosaltres .row > .col-12.col-lg-6:last-child');
            if (imageColumn) {
                imageColumn.style.display = 'none';
                imageColumn.style.minHeight = '0';
                imageColumn.style.padding = '0';
            }

            if (targetImg) {
                // Assegurar que no hi hagi animacions pendents
                gsap.killTweensOf(targetImg);
                if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
                    ScrollTrigger.getAll().forEach(t => t.kill());
                }

                // Mostrar només la imatge objectiu
                const textColumn = document.querySelector('#nosaltres .row > .col-12.col-lg-6:first-child');
                if (textColumn) {
                    if (targetImg.parentElement && targetImg.parentElement !== textColumn) {
                        textColumn.appendChild(targetImg);
                    } else if (targetImg.parentElement !== textColumn) {
                        textColumn.appendChild(targetImg);
                    }

                    // Estils mòbil per eliminar espais sobrants
                    targetImg.style.display = 'block';
                    targetImg.style.opacity = '1';
                    targetImg.style.position = 'static';
                    targetImg.style.width = '100%';
                    targetImg.style.height = 'auto';
                    targetImg.style.zIndex = '1';
                    targetImg.style.marginBottom = '0';                // eliminar espai sota la imatge
                    textColumn.style.marginBottom = '0';               // eliminar marge inferior de la columna de text

                    // reduir padding inferior de la secció i padding superior del fòrum
                    nosaltresSection.style.paddingBottom = '0.5rem';
                    const forum = document.getElementById('forum');
                    if (forum) forum.style.paddingTop = '0.5rem';
                } else if (nosaltresSection) {
                    // fallback
                    nosaltresSection.appendChild(targetImg);
                    targetImg.style.display = 'block';
                    targetImg.style.opacity = '1';
                    targetImg.style.position = 'static';
                    targetImg.style.width = '100%';
                    targetImg.style.height = 'auto';
                    targetImg.style.zIndex = '1';
                }
            } else {
                console.warn('No s\'ha trobat l\'imatge "Nosaltres_4" (buscant case-insensitive).');
            }
        }

        // Si es carrega en desktop, mantenir l'animació existent; si no, aplicar comportament mòbil.
        if (window.innerWidth > 991) {
            // Restaurar la posició de les imatges abans de configurar l'animació desktop
            restoreImagesToOriginal();

            // Desktop: animació parallax amb GSAP
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#nosaltres',
                    start: 'top top',
                    end: '+=400%',
                    pin: true,
                    scrub: 0.5,
                    markers: false,
                    anticipatePin: 1,
                    toggleActions: "play none none reverse"
                }
            });

            gsap.set('.image_cont', { opacity: 0 });

            images.forEach((image, index) => {
                const container = image.parentElement;
                gsap.set(container, { 
                    opacity: index === 0 ? 1 : 0,
                    zIndex: images.length - index
                });
            });

            const duration = 7;
            images.forEach((image, index) => {
                const container = image.parentElement;
                const nextIndex = (index + 1) % images.length;
                const nextContainer = images[nextIndex]?.parentElement;

                if (index < images.length - 1) {
                    tl.to(container, {
                        opacity: 0,
                        duration: duration/2,
                        ease: "power1.inOut"
                    })
                    .to(nextContainer, {
                        opacity: 1,
                        duration: duration/2,
                        ease: "power1.inOut"
                    }, "-=" + duration/2);

                    tl.fromTo(image, 
                        { y: 0 },
                        { y: -30, duration: duration, ease: "none" }, 
                        "-=" + duration
                    );
                }
            });

            // Animació d'entrada suau per imatges individuals
            images.forEach(image => {
                gsap.from(image, {
                    scrollTrigger: {
                        trigger: image,
                        start: "top 80%",
                        end: "bottom 50%",
                        toggleActions: "play none none reverse",
                        markers: false
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        } else {
            // Mobile/tablet: només mostrar la imatge nosaltres_4, sense animacions
            setMobileNosaltres();
        }

        // Quan es canviï la mida creuant el llindar, re-carregar per re-inicialitzar correcte (simplifica el reset)
        let lastIsDesktop = window.innerWidth > 991;
        window.addEventListener('resize', () => {
            const nowIsDesktop = window.innerWidth > 991;
            if (nowIsDesktop !== lastIsDesktop) {
                lastIsDesktop = nowIsDesktop;
                // recarregar la pàgina per assegurar que GSAP i la disposició tornen a l'estat esperat
                location.reload();
            }
        });
    }

    // ANIMACIÓ D'ENTRADA TARGETES DEL FÒRUM
    gsap.from("#forum .carousel-item .card", {
        scrollTrigger: {
            trigger: "#forum",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // SIMULACIÓ ENVIAMENT FORMULARI FÒRUM
    const form = document.getElementById('forumForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (form.checkValidity()) {
                const name = document.getElementById('forumName').value.trim();
                const subject = document.getElementById('forumSubject').value.trim();
                alert(`Gràcies, ${name}! El teu comentari sobre "${subject}" s'ha publicat correctament.`);
                form.reset();
            } else {
                alert('Si us plau, omple tots els camps.');
            }
        });
    }

    // FÒRUM: Carrusel rotatiu amb eix central fix
    const wheel = document.querySelector('.forum-wheel');
    const cards = Array.from(document.querySelectorAll('.forum-card'));
    const totalCards = cards.length;
    let currentIndex = 0;
    const radius = 310;
    const rotationAngle = 120;

    function setupCarousel() {
        gsap.set(wheel, {
            position: 'relative',
            left: '50%',
            xPercent: -50
        });

        cards.forEach((card, index) => {
            gsap.set(card, {
                position: 'absolute',
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                transformOrigin: 'center center'
            });
        });

        updateCarousel(true);
    }

    function updateCarousel(immediate = false) {
        cards.forEach((card, index) => {
            const offset = (index - currentIndex + totalCards) % totalCards;
            let angle = offset * rotationAngle;
            let scale = 1;
            let opacity = 1;
            let zIndex = 1;

            if (offset === 0) {
                scale = 1.1;
                zIndex = 3;
                card.classList.add('active');
                card.classList.remove('left', 'right');
            } else if (offset === 1 || offset === -2) {
                scale = 0.85;
                opacity = 0.6;
                zIndex = 2;
                card.classList.add('right');
                card.classList.remove('active', 'left');
            } else if (offset === -1 || offset === 2) {
                scale = 0.85;
                opacity = 0.6;
                zIndex = 2;
                card.classList.add('left');
                card.classList.remove('active', 'right');
            } else {
                opacity = 0;
                zIndex = 1;
                card.classList.remove('active', 'left', 'right');
            }

            const radian = (angle * Math.PI) / 180;
            const x = Math.sin(radian) * radius;

            gsap.to(card, {
                x: x,
                yPercent: -50,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
                duration: immediate ? 0 : 0.6,
                ease: "power2.inOut"
            });
        });
    }

    function rotateLeft() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    let autoRotate = setInterval(rotateLeft, 4000);

    if (wheel) {
        wheel.addEventListener('mouseenter', () => clearInterval(autoRotate));
        wheel.addEventListener('mouseleave', () => {
            autoRotate = setInterval(rotateLeft, 4000);
        });
        setupCarousel(true);

        gsap.from(cards, {
            scrollTrigger: {
                trigger: '#forum',
                start: 'top 80%'
            },
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out'
        });
    }

    // ANIMACIÓ LLETRES CAPÇALERA
    const letters = document.querySelectorAll('.bresca-container .letter');
    if (letters.length > 0) {
        gsap.timeline({
            scrollTrigger: {
                trigger: ".capçalera",
                start: "top top",
                end: "+=400",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                markers: false
            }
        })
        .fromTo(letters, 
            { opacity: 0, y: 40 }, 
            { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: "power2.out" }
        );
    }

    // OCULTAR NAVBAR FORA DE LA CAPÇALERA
    const navbar = document.getElementById('main-navbar');
    const header = document.getElementById('inici');
    if (navbar && header) {
        document.addEventListener('scroll', function() {
            const headerBottom = header.getBoundingClientRect().bottom;
            navbar.style.display = headerBottom <= 0 ? 'none' : '';
        });
    }
});

document.querySelectorAll('[data-bs-toggle="modal"]').forEach(img => {
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      img.click();
    }
  });
});
