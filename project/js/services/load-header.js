import openBurgerMenu from "./burger-menu";
async function loadHeader() {
    const res = await fetch('../../../index.html');
    let html = await res.text();
    
    html = html.replaceAll('index.html', '../../../index.html');
    html = html.replaceAll('js/pages', '../../../js/pages');
    html = html.replaceAll('"img/logo', '"../../../img/logo')

    const temp = document.createElement('div');
    
    temp.innerHTML = html;
    const header = temp.querySelector('#top-bar');

    document.querySelector('body').insertAdjacentHTML('afterbegin', header.outerHTML);
    openBurgerMenu();
}

export default loadHeader;