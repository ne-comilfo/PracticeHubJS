import loadHeader from "../../services/load-header";

loadHeader();

const pageContent = document.querySelector('.content');

const topics = JSON.parse(localStorage.getItem('topics')) || {};
for (let topic in topics) {
    document.querySelector(`[data-topic=${topic}] .current`).innerHTML = `<b>${topics[topic]} из 20</b>`
}

let prevContent = '';
let quizData = [];
let index = -1;
let correctAnswers = 0;
let topic = '';

async function getData(topic) {
    const response = await fetch(`http://localhost:3000/${topic}`);
    if (!response.ok) throw new Error('Ошибка получения данных, повторите попытку позже');
    return await response.json();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function rememberAnsw(correctAnswers) {
    const obj = JSON.parse(localStorage.getItem('topics')) || {};
    obj[topic] = correctAnswers;
    localStorage.setItem('topics', JSON.stringify(obj));
}

function renderStartScreen() {
    pageContent.textContent = '';
    pageContent.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;';

    const questionCard = document.createElement('div');
    questionCard.classList.add('question-card');
    questionCard.innerHTML = `
        <h2>Готовы проверить свои знания?</h2>
        <p>Вам будут предложены различные слова на русском языке, ваша задача написать правильный перевод на английский. <b>Будьте внимательны</b>, нажатие на кнопку "Посмотреть перевод" расценивается как <b>неправильный</b> ответ!</p>
        <div class='buttons'>               
            <button type='button' class='next-btn'>Далее</button>
        </div>
    `;
    pageContent.append(questionCard);
    pageContent.insertAdjacentHTML('beforeend', `<button type='button' class='back-btn'>В главное меню</button>`);
}

function renderQuestion(dflt = null) {
    if (index === 20) {
        renderResults();
        return;
    }

    let textContentNext = index === 19 ? 'Сохранить ответы' : 'Далее';

    const questionCard = document.querySelector('.question-card'),
        input = `<input type='text' placeholder='Напишите перевод' class='input-card'/>`,
        str = `<p class='translate'>${dflt}</p>`;
    questionCard.innerHTML = `
        <h2>${(index + 1) + '. ' + capitalize(quizData[index].translation)}</h2>
        ${dflt == null ? input : str}
        <div class='buttons'>
            <button type='button' class='submit-btn'>Подтвердить</button>
            <button type='button' class='translate-btn'>Посмотреть перевод</button>          
            <button type='button' class='next-btn' hidden>${textContentNext}</button>
        </div>
    `;
}

function renderResults() {
    const questionCard = document.querySelector('.question-card');
    questionCard.innerHTML = `
        <h2>Ваши результаты</h2>
        <div class='user-answers'><b>${correctAnswers} из 20</b></div>
        <span></span>
    `;
    rememberAnsw(correctAnswers);
}

function handleNext() {
    index++;
    renderQuestion();
}

function handleTranslate() {
    renderQuestion(capitalize(quizData[index].word));
    const questionCard = document.querySelector('.question-card');
    const nextBtn = questionCard.querySelector('.next-btn');
    const submitBtn = questionCard.querySelector('.submit-btn');
    const translateBtn = questionCard.querySelector('.translate-btn');

    nextBtn.hidden = false;
    submitBtn.hidden = true;
    translateBtn.hidden = true;
}

function handleSubmit() {
    const questionCard = document.querySelector('.question-card');
    const input = questionCard.querySelector('.input-card');
    const userAnswer = input.value.trim().toLowerCase();

    if (userAnswer === quizData[index].word) {
        renderQuestion('Верно');
        correctAnswers++;
        const nextBtn = questionCard.querySelector('.next-btn');
        const submitBtn = questionCard.querySelector('.submit-btn');
        const translateBtn = questionCard.querySelector('.translate-btn');
        submitBtn.hidden = true;
        nextBtn.hidden = false;
        translateBtn.hidden = true;
    } else {
        renderQuestion('Неверно');
        const nextBtn = questionCard.querySelector('.next-btn');
        const submitBtn = questionCard.querySelector('.submit-btn');
        const translateBtn = questionCard.querySelector('.translate-btn');
        submitBtn.hidden = true;
        translateBtn.hidden = false;
    }
}

function goBack() {
    pageContent.removeAttribute('style');
    pageContent.innerHTML = prevContent;

    if (index === 20) {
        document.querySelector(`[data-topic=${topic}] .current`).innerHTML = `<b>${correctAnswers} из 20</b>`;
    }

    quizData = [];
    index = -1;
    correctAnswers = 0;
}

pageContent.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.closest('.section-card')?.classList.contains('section-card')) {
        topic = target.closest('.section-card').getAttribute('data-topic');
        prevContent = pageContent.innerHTML;
        quizData = await getData(topic);
        index = -1;
        correctAnswers = 0;
        renderStartScreen();
    }

    if (target.classList.contains('next-btn')) {
        handleNext();
    }

    if (target.classList.contains('translate-btn')) {
        handleTranslate();
    }

    if (target.classList.contains('submit-btn')) {
        handleSubmit();
    }

    if (target.classList.contains('back-btn')) {
        goBack();
    }
});

