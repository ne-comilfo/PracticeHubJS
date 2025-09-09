function openBurgerMenu() {
    const burgerBtn = document.querySelector('.burger');
    const menu = document.querySelector('.menu');

    let menuOpen = false;

    burgerBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        const firstSpan = document.querySelector('.burger span:nth-child(1)');
        const secondSpan = document.querySelector('.burger span:nth-child(2)');
        const thirdSpan = document.querySelector('.burger span:nth-child(3)');

        firstSpan.classList.toggle('first');
        secondSpan.classList.toggle('second');
        thirdSpan.classList.toggle('third');

        if (!menuOpen) {
            menu.style.right = '-200px';
            burgerBtn.style.right = '0';
        } else {
            menu.style.right = '0';
            burgerBtn.style.right = '200px';
        }

    })
}

export default openBurgerMenu;