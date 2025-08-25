import loadHeader from "../../services/load-header";
import addForm from "./modules/add-form";

loadHeader();

let index = +localStorage.getItem('index') || 0;

const form = document.getElementById('add-form'),
    filmsField = document.querySelector('.library-films');

uploadFilms();

function changeFilmProgress(id, newProgress) {
    const films = JSON.parse(localStorage.getItem('films'));
    films.forEach(film => {
        if (film.index == id) {
            film.progress = newProgress;
        }
    })
    localStorage.setItem('films', JSON.stringify(films));
}

function saveFilms({ title, mark, year, genre, progress, index }) {
    let films = JSON.parse(localStorage.getItem('films')) || [];
    films.push({
        title: title,
        mark: mark,
        year: year,
        genre: genre,
        progress: progress,
        index: index
    });
    localStorage.setItem('films', JSON.stringify(films));
}

function uploadFilms() {
    let films = JSON.parse(localStorage.getItem('films')) || [];
    films.forEach(film => {
        addForm(film, filmsField);
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    index++;
    localStorage.setItem('index', index);
    data['index'] = index;
    saveFilms(data);
    addForm(data, filmsField,);

    form.reset();
})

document.addEventListener('change', (e) => {
    const target = e.target;
    if (target.classList.contains('film-status')) {
        const card = target.closest('.film-card');
        const id = card.getAttribute('data-id');
        const newStatus = target.value
        changeFilmProgress(id, newStatus);
    }
})