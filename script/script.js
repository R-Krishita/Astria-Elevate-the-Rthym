function scrollLeft() {
    const container = document.querySelector('.scroll-content');
    container.scrollBy({
        top: 0,
        left: -100, // Adjust the value for scroll distance
        behavior: 'smooth'
    });
}

function scrollRight() {
    const container = document.querySelector('.scroll-content');
    container.scrollBy({
        top: 0,
        left: 100, // Adjust the value for scroll distance
        behavior: 'smooth'
    });
}