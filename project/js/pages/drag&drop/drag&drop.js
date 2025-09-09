import loadHeader from "../../services/load-header";

loadHeader();

let isOnProduct = false;
let dragItem = null;
let startCoord = [];

const queue = [];

function isEmpty() {
    if (queue.length === 0) {
        undoBtn.style.visibility = '';
    }
}

const undoBtn = document.querySelector('.btn-undo'),
    resetBtn = document.querySelector('.btn-reset');

function isInBasket(dragItem) {
    const basket = document.querySelector('.basket');
    const rectBasket = basket.getBoundingClientRect();
    const rectItem = dragItem.getBoundingClientRect();
    return rectItem.top > rectBasket.top && rectItem.bottom < rectBasket.bottom
        && rectItem.left > rectBasket.left && rectItem.right < rectBasket.right;
}

document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (target && target.hasAttribute('data-number')) {
        isOnProduct = true;
        dragItem = target;

        const style = window.getComputedStyle(dragItem);
        const matrix = new DOMMatrixReadOnly(style.transform);
        const offsetX = matrix.m41; 
        const offsetY = matrix.m42; 

        console.log(offsetX, e.clientX)

        startCoord = [e.clientX - offsetX, e.clientY - offsetY];
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isOnProduct) return;
    dragItem.style.transform = `translate(${e.clientX - startCoord[0]}px, ${e.clientY - startCoord[1]}px)`;
});

document.addEventListener('mouseup', (e) => {
    if (!isOnProduct) return;
    const isBasket = isInBasket(dragItem);
    if (!isBasket) {
        dragItem.removeAttribute('style');
    } else {
        undoBtn.style.visibility = 'visible';
        dragItem.style.cursor = '';
        queue.push(dragItem.getAttribute('data-number'));
    }
    isEmpty();
    isOnProduct = false;
})

undoBtn.addEventListener('click', () => {
    const lastProduct = queue[queue.length - 1];
    const productItem = document.querySelector(`[data-number="${lastProduct}"]`);
    productItem.removeAttribute('style');
    queue.pop();
    isEmpty();
});

resetBtn.addEventListener('click', () => {
    queue.forEach(item => {
        document.querySelector(`[data-number="${item}"]`).removeAttribute('style');
    });
    queue.splice(0, queue.length);
    isEmpty();
})