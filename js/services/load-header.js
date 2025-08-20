import openBurgerMenu from "./burger-menu";
async function loadHeader() {
    const res = await fetch('../../../index.html');
    const html = await res.text();
    const temp = document.createElement('div');

    temp.innerHTML = html;
    const header = temp.querySelector('#top-bar');

    document.querySelector('body').insertAdjacentHTML('afterbegin', header.outerHTML);
    openBurgerMenu();
}

export default loadHeader;