import openBurgerMenu from './services/burger-menu'

openBurgerMenu();

const currentPage = document.querySelector('.number-page'),
    totalPages = document.querySelector('.total-page');

const sliderWrapper = document.querySelector('.carousel-wrapper'),
    slider = document.querySelector('.carousel'),
    sliderInner = document.querySelector('.carousel-inner'),
    leftArrow = document.querySelector('.fa-solid.fa-arrow-left'),
    rightArrow = document.querySelector('.fa-solid.fa-arrow-right');

let imgs = [];

async function loadCarouselItem() {
    const res = await fetch('./home-page-info.json'); 
    const cards = await res.json();
    cards.forEach(item => {
        const carousel = document.createElement('div');
        carousel.classList.add("carousel-item");
        carousel.innerHTML = `
            <img src="${item.src}" alt="${item.alt}">
            <div class="carousel-item__description">
                ${item.description}
            </div>
        `
        sliderInner.append(carousel);
    })
    imgs = Array.from(document.querySelectorAll('.carousel-item img'));

    initCarousel();
}

loadCarouselItem();

function initCarousel() {
    totalPages.textContent = imgs.length;
    

    sliderWrapper.style.width = '550px';
    imgs.forEach(item => {
        item.style.width = '550px';
    })

    slider.style.position = 'relative';

    const dots = document.createElement('ol');
    dots.classList.add('carousel-indicators');
    sliderWrapper.append(dots);

    const dotsByHand = [];

    for (let i = 0; i < imgs.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot')
        dots.append(dot);
        dotsByHand.push(dot);
        if (i === 0) dot.style.opacity = 1;
    }



    const width = window.getComputedStyle(sliderWrapper).width;
    let offset = 0;
    let index = 1;

    let activeDotIndex = 0;

    function slideImg(index) {
        sliderInner.style.transform = `translateX(-${offset}px)`;
        currentPage.textContent = index;
        dotsByHand[activeDotIndex].style.opacity = 0.3;
        activeDotIndex = index - 1;
        dotsByHand[index - 1].style.opacity = 1;
    }

    dotsByHand.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const target = e.target;
            index = parseInt(target.getAttribute('data-slide-to'));
            offset = (index - 1) * parseInt(width);
            slideImg(index);
        })
    })

    rightArrow.addEventListener('click', (e) => {
        if (offset === parseInt(width) * (imgs.length - 1)) {
            offset = 0;
        } else {
            offset += parseInt(width);
        }
        index = Math.abs(offset) / parseInt(width) + 1;
        slideImg(index);
    })

    leftArrow.addEventListener('click', (e) => {
        if (offset === 0) {
            offset = parseInt(width) * (imgs.length - 1);
        } else {
            offset -= parseInt(width);
        }
        index = Math.abs(offset) / parseInt(width) + 1;
        slideImg(index);
    })
}

