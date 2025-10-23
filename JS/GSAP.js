// script.js

//JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('nav.navbar');
    const main = document.querySelector('main');
    const navbarHeight = navbar.offsetHeight; // Alçada de la barra de navegació
    const navbarOffsetTop = navbar.offsetTop; // Posició inicial de la barra respecte al document

    function handleScroll() {
        // Si la posició del scroll arriba o supera la posició inicial de la barra
        if (window.scrollY >= navbarOffsetTop) {
            navbar.classList.add('fixed'); // Aplica position: fixed
            main.style.marginTop = `${navbarHeight}px`; // Afegeix marge al main
        } else {
            navbar.classList.remove('fixed'); // Torna a sticky
            main.style.marginTop = '0'; // Elimina el marge
        }
    }

    // Escolta l'esdeveniment de scroll
    window.addEventListener('scroll', handleScroll);
});

//GSAP