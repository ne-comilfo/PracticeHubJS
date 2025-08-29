function renderFilms({ title, mark, year, genre, progress, index }, filmsField) {
    const progressData = ['В планах', 'Смотрю', 'Просмотрено'];
    const progressInput = [];
    progressData.forEach(item => {
        if (progress !== item) {
            progressInput.push(`<option value="${item}">${item}</option>`);
        } else {
            progressInput.push(`<option value="${item}" selected>${item}</option>`);
        }
    })
    const filmCard = `
        <li class="film-card" data-id='${index}'>
            <h3 class="film-title">${checkLength(capitalize(title))}</h3>
            <p class="film-year">${year}</p>
            <p class="film-rating">${mark}</p>
            <select name='film-card-select' class="film-status">
            ${progressInput.join('\n')}
            </select>
            <p class="film-genre">${genre}</p>
            <i class="fa-solid fa-trash"></i>
        </li>
    `;

    filmsField.insertAdjacentHTML('beforeend', filmCard);
}

function checkLength(string) {
    return string.length >= 11 ? string.slice(0, 10) + '...' : string;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default renderFilms;