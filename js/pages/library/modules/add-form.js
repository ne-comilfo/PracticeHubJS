let index = +localStorage.getItem('index') || 0;

function addForm(data, filmsField, renderFilms) {
    index++;
    data.index = index;

    localStorage.setItem('index', index);
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films.push(data);
    localStorage.setItem('films', JSON.stringify(films));
    renderFilms(data, filmsField);
}

function changeFilmProgress(id, newProgress) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films.forEach(film => {
        if (film.index == id) film.progress = newProgress;
    });
    localStorage.setItem('films', JSON.stringify(films));
}

function uploadFilms(filmsField, renderFilms) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films.forEach(film => renderFilms(film, filmsField));
}

export { addForm, uploadFilms, changeFilmProgress };