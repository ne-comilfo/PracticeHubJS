import loadHeader from "../../services/load-header";

loadHeader();

const alphabet = 'йцукенгшщзхъфывапролджэячсмитьбю'.toUpperCase(),
    hangman = {
        7: [document.querySelector('#base'), document.querySelector('#stool-seat'), document.querySelector('#stool-leg-left'), document.querySelector('#stool-leg-right')],
        6: [document.querySelector('#pole'), document.querySelector('#beam')],
        5: [document.querySelector('#rope')],
        4: [document.querySelector('#head')],
        3: [document.querySelector('#body')],
        2: [document.querySelector('#arm-left'), document.querySelector('#arm-right')],
        1: [document.querySelector('#leg-left'), document.querySelector('#leg-right')],
    };

const gameDisplay = document.querySelector('.game__display');

let choosenLetters = [],
    leftAttempt = 8;

let hiddenWord = '',
    letterIndexinWord = [];

const keyboard = document.querySelector('.game__keyboard'),
    message = document.querySelector('.game__message'),
    gameWord = document.querySelector('.game__word'),
    newGameBtn = document.querySelector('.button-reset');

function hiddenHangman() {
    for (const i in hangman) {
        hangman[i].forEach(part => part.style.opacity = '0');
    }
}

function checkLetterInWord(hiddenWord, letter) {
    hiddenWord.toUpperCase().split("").forEach((item, i) => {
        if (item === letter) letterIndexinWord.push(i);
    })
    return hiddenWord.toLowerCase().includes(letter.toLowerCase());
}

function addLetters() {
    keyboard.innerHTML = '';
    let row = document.createElement('div');
    row.classList.add('game__keyboard-row');

    alphabet.split('').forEach((letter, i) => {
        const el = document.createElement('div');
        el.classList.add('game__keyboard-letter', 'no-select');
        el.setAttribute('data-letter', letter);
        el.textContent = letter;
        row.append(el);
        if (i === 11 || i === 22 || i === 31) {
            keyboard.append(row);
            row = document.createElement('div');
            row.classList.add('game__keyboard-row');
        }
    })
}

addLetters();
hiddenHangman();

let canPress = true;
let currentLetter = null;
let inputSource = null;
let prevMessage = '';
let wasChoosen = false;

function showStartBtn() {
    gameDisplay.style.display = 'none';
    const content = document.querySelector('.content');
    content.insertAdjacentHTML('beforeend', '<button type="button" class="start-btn">Начать игру</button>');
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', (e) => {
        generateWord();
        startBtn.remove();
        gameDisplay.removeAttribute('style');
    })
}

showStartBtn();

function isWordComplete(inputsForLetters) {
    return [...inputsForLetters].every(item => item.textContent != '');
}

function generateWord() {
    const rand = Math.random();
    hiddenWord = rand < 0.5 ? 'Банан' : 'Сигмабой';
    const numLet = [];
    for (let i = 0; i < hiddenWord.length; i++) {
        numLet.push('<div class="game__word-letter"></div>');
    }
    gameWord.innerHTML = numLet.join('\n');
}

function updateMessage() {
    prevMessage = `Осталось попыток: ${leftAttempt}`;
    message.innerHTML = prevMessage;
}

function resetData() {
    canPress = true;
    currentLetter = null;
    inputSource = null;
    prevMessage = '';
    wasChoosen = false;
    choosenLetters = [];
    leftAttempt = 8;
    hiddenWord = '';
    letterIndexinWord = [];
    document.addEventListener('keydown', keydown);
    document.addEventListener('mousedown', mousedown);
    generateWord();
    addLetters();
    hiddenHangman();
    updateMessage();
}

function movementDown(inputLetter, source) {
    console.log('1', source, inputSource, inputLetter);
    if (/[А-Я]/.test(inputLetter)) {
        if (inputSource && inputSource !== source) return;
        if (source === 'keydown' && currentLetter && currentLetter !== inputLetter) return;
        canPress = false;
        currentLetter = inputLetter;
        inputSource = source;

        if (choosenLetters.includes(inputLetter)) {
            wasChoosen = true;
            message.innerHTML = '<b>Вы уже выбирали эту букву!</b>';
            setTimeout(() => {
                updateMessage();
            }, 1500)
            return;
        }

        choosenLetters.push(inputLetter);

        const letter = document.querySelector(`[data-letter=${inputLetter}]`);
        if (letter) {
            letter.classList.add('choose');
        }

        setTimeout(() => {
            canPress = true;
        }, 500);

    } else {
        message.innerHTML = '<b>Переключите раскладку!</b>';
        setTimeout(updateMessage, 1500);

        currentLetter = null;
        inputSource = null;
        return;
    }
}

function movementUp(outputLetter, source) {
    if (wasChoosen) {
        wasChoosen = false
        return;
    };
    console.log('2', outputLetter, currentLetter);
    if (outputLetter === currentLetter) {
        console.log('3', inputSource, source);
        if (inputSource && inputSource === source) {
            
            const letter = document.querySelector(`[data-letter=${outputLetter}]`);
            if (!letter) return;

            const isCorrect = checkLetterInWord(hiddenWord, outputLetter);
            letter.classList.remove('choose');
            letter.classList.add(isCorrect ? 'correct' : 'mistake');
            if (!isCorrect) {
                leftAttempt -= 1;
                updateMessage();
                if (leftAttempt === 0) {
                    message.innerHTML = 'Вы проиграли :(';
                    newGameBtn.hidden = !newGameBtn.hidden;
                    removeListener('keydown', keydown);
                    removeListener('mousedown', mousedown);
                    for (let i = 1; i < 4; i++) {
                        hangman[7][i].style.opacity = '0';
                    }
                } else {
                    hangman[leftAttempt].forEach(item => item.style.opacity = '1');
                }
            } else {
                const inputsForLetters = document.querySelectorAll('.game__word-letter');
                letterIndexinWord.forEach(index => {
                    inputsForLetters[index].textContent = outputLetter;
                })
                letterIndexinWord = [];
                const isComplete = isWordComplete(inputsForLetters);
                if (isComplete) {
                    message.innerHTML = 'Поздравляем, Вы выиграли!';
                    removeListener('keydown', keydown);
                    removeListener('mousedown', mousedown);
                    newGameBtn.hidden = !newGameBtn.hidden;
                }
            }

            currentLetter = null;
            inputSource = null;
        }
    } console.log('4', inputSource, currentLetter)
}

const keydown = (e) => {
    if (!canPress) return;
    if (inputSource != null) return;
    console.log(inputSource);
    const inputLetter = e.key.toUpperCase();
    if (!/[А-Я]/.test(inputLetter)) {
        message.innerHTML = '<b>Переключите раскладку!</b>';
        setTimeout(updateMessage, 1500);
        return;
    }

    if (outLet.has(inputLetter)) return;
    outLet.add(inputLetter);

    movementDown(inputLetter, 'keydown');
};

const mousedown = (e) => {
    if (inputSource != null) return;
    console.log(inputSource)
    const target = e.target;
    if (target && target.hasAttribute('data-letter')) {
        const inputLetter = target.getAttribute('data-letter');
        movementDown(inputLetter, 'mousedown');
    }
}

function removeListener(event, callback) {
    document.removeEventListener(event, callback);
}

const outLet = new Set();

document.addEventListener('keydown', keydown);

document.addEventListener('keyup', (e) => {
    if (inputSource !== 'keydown') return;
    const outputLetter = e.key.toUpperCase();
    outLet.delete(outputLetter);
    movementUp(outputLetter, 'keydown');
});

document.addEventListener('mousedown', mousedown);

document.addEventListener('mouseup', (e) => {
    const target = e.target;
    if (target && target.hasAttribute('data-letter')) {
        const outputLetter = target.getAttribute('data-letter');
        if (inputSource !== 'mousedown') return;
        movementUp(outputLetter, 'mousedown');
    } else {
        const data = document.querySelector(`[data-letter=${currentLetter}]`);
        if (data) data.classList.remove('choose');
        choosenLetters = choosenLetters.filter(el => el !== currentLetter);
        currentLetter = null;
    }
});

newGameBtn.addEventListener('click', () => {
    resetData();
    newGameBtn.hidden = !newGameBtn.hidden;
})

/* 

Написать получение библиотеки слов, желательно один раз и локал стораж запихнуть и оттуда брать

В идеале отрефакторить ибо тут дохуя строк уже

Пофиксить баг с последовательным нажатием / отжатием кнопки, заранее нажатой клавишей до старты игры 

*/