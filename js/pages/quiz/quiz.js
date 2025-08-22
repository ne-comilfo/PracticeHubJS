import loadHeader from "../../services/load-header";

loadHeader();

const rightAnswers = {
    1: 'Красный',
    2: ['Яблоки', 'Бананы'],
    3: 'Зенит'
};

function createEmptyResults() {
    return {
        1: { answer: '', right: true },
        2: { answer: '', right: true },
        3: { answer: '', right: true }
    };
}

let userResults = createEmptyResults();
let currentIndex = 0;

const btn = document.querySelector('.next');
const slides = document.querySelectorAll('.carousel-inner__item');

function deactivateSlides() {
    slides.forEach(slide => slide.classList.remove('active'));
}

function activateSlide(index) {
    slides[index].classList.add('active');
}

function collectAnswer(slide) {
    const num = +slide.getAttribute('data-number');
    if (!num) return;

    const inputs = slide.querySelectorAll('input');
    if (inputs.length === 0) return;

    const firstInput = inputs[0];

    if (firstInput.type === 'text') {
        userResults[num].answer = firstInput.value.trim();
        userResults[num].right = userResults[num].answer === rightAnswers[num];
    } else if (firstInput.type === 'radio') {
        const checked = slide.querySelector('input[type="radio"]:checked');
        userResults[num].answer = checked ? checked.value : '';
        userResults[num].right = checked && checked.value === rightAnswers[num];
    } else if (firstInput.type === 'checkbox') {
        const checked = slide.querySelectorAll('input[type="checkbox"]:checked');
        const values = Array.from(checked).map(cb => cb.value);
        userResults[num].answer = values;
        const correct = rightAnswers[num].length === values.length &&
            rightAnswers[num].every(v => values.includes(v));
        userResults[num].right = correct;
    }
}

function updateResultsSlide() {
    const totalQuestions = Object.keys(userResults).length;
    let numRight = 0;
    const wrongIds = [];

    for (let key in userResults) {
        if (userResults[key].right) {
            numRight++;
        } else {
            wrongIds.push(key);
        }
    }

    const resultSlide = slides[currentIndex];
    resultSlide.innerHTML = `
        <p>Правильных ответов: ${numRight}</p>
        <p>Всего вопросов: ${totalQuestions}</p>
    `;

    if (numRight === totalQuestions) {
        btn.style.display = 'none';
    } else {
        btn.textContent = 'К ошибкам';
    }

    return wrongIds;
}

btn.addEventListener('click', () => {
    const curSlide = slides[currentIndex];
    collectAnswer(curSlide);

    deactivateSlides();
    currentIndex++;

    if (currentIndex === slides.length - 3) {
        btn.textContent = 'Завершить';
    }

    if (currentIndex === slides.length - 2) {
        const wrongIds = updateResultsSlide();
    }

    if (currentIndex === slides.length - 1) {
        const wrongIds = Object.keys(userResults).filter(k => !userResults[k].right);
        slides[currentIndex].textContent = '';
        slides[currentIndex].innerHTML = `<p>Ошибки в вопросах: ${wrongIds.join(', ')}</p>`;
        btn.textContent = 'Заново';
    }

    if (currentIndex === slides.length) {
        currentIndex = 0;
        userResults = createEmptyResults();
        btn.textContent = 'Далее';
        btn.style.display = 'inline-block';
    }

    activateSlide(currentIndex);
});