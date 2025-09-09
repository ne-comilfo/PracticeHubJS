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

let leftAttempt = 8;

const choosenLetters = [];

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

function isWordComplete(inputsForLetters) {
    return [...inputsForLetters].every(item => item.textContent != '');
}

async function generateWord() {
    const index = Math.floor(Math.random() * 1613);
    const res = await fetch('../../../words.json');
    const data = await res.json();
    hiddenWord = data[index];
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
    choosenLetters.splice(0, choosenLetters.length);
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
    if (source === 'keydown') {
        document.removeEventListener('mousedown', mousedown);
        document.removeEventListener('mouseup', mouseup);
    } else {
        document.removeEventListener('keydown', keydown);
        document.removeEventListener('keyup', keyup);
    }
    canPress = false;

    setTimeout(() => {
        canPress = true;
    }, 300);

    if (/[А-Я]/.test(inputLetter)) {
        if (source === 'keydown' && currentLetter && currentLetter !== inputLetter) return;

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
        if (letter && !letter.classList.contains('choose') && !letter.classList.contains('correct') && !letter.classList.contains('mistake')) {
            letter.classList.add('choose');
        }



    } else if (/^[A-Z]$/.test(inputLetter.toLowerCase)) {
        message.innerHTML = '<b>Переключите раскладку!</b>';
        setTimeout(updateMessage, 1500);

        currentLetter = null;
        inputSource = null;
        return;
    } else {
        currentLetter = null;
        inputSource = null;
        outLet.clear();
        return;
    }
}

function movementUp(outputLetter, source) {

    outLet.delete(outputLetter);

    try {
        const letter = document.querySelector(`[data-letter=${outputLetter}]`);
        letter.classList.remove('choose');
    } catch (err) {

    }

    if (outputLetter === currentLetter) {
        if (wasChoosen) {
            wasChoosen = false
        } else {
            const letter = document.querySelector(`[data-letter=${outputLetter}]`);

            const isCorrect = checkLetterInWord(hiddenWord, outputLetter);
            letter.classList.remove('choose');
            letter.classList.add(isCorrect ? 'correct' : 'mistake');
            if (!isCorrect) {
                leftAttempt -= 1;
                updateMessage();
                if (leftAttempt === 0) {
                    message.innerHTML = 'Вы проиграли :(';
                    const inputsForLetters = document.querySelectorAll('.game__word-letter');
                    hiddenWord.toUpperCase().split("").forEach((item, i) => {
                        inputsForLetters[i].textContent = item;
                        inputsForLetters[i].classList.add('mistake');
                    })
                    newGameBtn.hidden = !newGameBtn.hidden;
                    removeListener('mousedown', mousedown);
                    removeListener('keydown', keydown);
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
                    removeListener('mousedown', mousedown);
                    removeListener('keydown', keydown);
                    newGameBtn.hidden = !newGameBtn.hidden;
                    hiddenWord.toUpperCase().split("").forEach((item, i) => {
                        inputsForLetters[i].classList.add('correct');
                    })
                }
            }
        }
    }

    currentLetter = null;
    inputSource = null;
    if (source === 'keydown') {
        document.addEventListener('mousedown', mousedown);
        document.addEventListener('mouseup', mouseup);
    } else {
        document.addEventListener('keydown', keydown);
        document.addEventListener('keyup', keyup);
    }

}

const keydown = (e) => {
    if (!canPress) return;
    const inputLetter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(inputLetter)) {
        message.innerHTML = '<b>Переключите раскладку!</b>';
        setTimeout(updateMessage, 1500);
        return;
    }

    if (outLet.size !== 0) return;
    outLet.add(inputLetter);
    movementDown(inputLetter, 'keydown');
};

const keyup = (e) => {
    const outputLetter = e.key.toUpperCase();
    if (!outLet.has(outputLetter)) return;
    outLet.delete(outputLetter);
    movementUp(outputLetter, 'keydown');
}

const mousedown = (e) => {
    const target = e.target;
    if (target && target.hasAttribute('data-letter')) {
        const inputLetter = target.getAttribute('data-letter');
        movementDown(inputLetter, 'mousedown');
    }
}

const mouseup = (e) => {
    const target = e.target;
    if (target && target.hasAttribute('data-letter')) {
        const outputLetter = target.getAttribute('data-letter');
        if (outputLetter !== currentLetter) {
            try {
                document.querySelector(`[data-letter=${currentLetter}]`).classList.remove('choose');
            } catch {

            }
            choosenLetters.splice(choosenLetters.indexOf(currentLetter), 1);
            currentLetter = null;
            inputSource = null;
            document.addEventListener('keydown', keydown);
            document.addEventListener('keyup', keyup);
        } else {
            movementUp(currentLetter, 'mousedown');
        }

    } else {
        const data = document.querySelector(`[data-letter=${currentLetter}]`);
        if (data) data.classList.remove('choose');
        choosenLetters.splice(choosenLetters.indexOf(currentLetter), 1);
        currentLetter = null;
        inputSource = null;
        document.addEventListener('keydown', keydown);
        document.addEventListener('keyup', keyup);
    }
}

function removeListener(event, callback) {
    document.removeEventListener(event, callback);
}

const outLet = new Set();

function forceReleaseKeyboard() {
    if (currentLetter && inputSource === 'keydown') {
        outLet.delete(currentLetter);
        movementUp(currentLetter, 'keydown');
    }
}

window.addEventListener('blur', forceReleaseKeyboard);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') forceReleaseKeyboard();
});

document.addEventListener('pointerdown', (e) => {
    if (currentLetter && inputSource === 'keydown') {
        movementUp(currentLetter, 'keydown');
        currentLetter = null;
        inputSource = null;
    }
}, true);


document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
document.addEventListener('mousedown', mousedown);
document.addEventListener('mouseup', mouseup);

function showStartBtn() {
    gameDisplay.style.display = 'none';
    removeListener('mousedown', mousedown);
    removeListener('mouseup', mouseup);
    removeListener('keydown', keydown);
    removeListener('keyup', keyup);
    const content = document.querySelector('.content');
    content.insertAdjacentHTML('beforeend', '<button type="button" class="start-btn">Начать игру</button>');
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', (e) => {
        generateWord();
        startBtn.remove();
        gameDisplay.removeAttribute('style');
        document.addEventListener('keydown', keydown);
        document.addEventListener('keyup', keyup);
        document.addEventListener('mousedown', mousedown);
        document.addEventListener('mouseup', mouseup);
    })
}

showStartBtn();

newGameBtn.addEventListener('click', () => {
    resetData();
    newGameBtn.hidden = !newGameBtn.hidden;
})