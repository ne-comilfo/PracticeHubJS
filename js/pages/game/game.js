import loadHeader from "../../services/load-header";

loadHeader();

const alphabet = 'йцукенгшщзхъфывапролджэячсмитьбю'.toUpperCase();

const keyboard = document.querySelector('.game__keyboard');

let row = document.createElement('div');
row.classList.add('game__keyboard-row');

alphabet.split('').forEach((letter, i) => {
    const el = document.createElement('div');
    el.classList.add('game__keyboard-letter');
    el.setAttribute('data-letter', letter);
    if (letter == 'Ы') el.classList.add('correct');
    if (letter == 'Е') el.classList.add('mistake');
    el.textContent = letter;
    row.append(el);
    if (i === 11 || i === 22 || i === 31) {
        keyboard.append(row);
        row = document.createElement('div');
        row.classList.add('game__keyboard-row');
    }
})