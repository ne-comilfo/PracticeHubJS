import loadHeader from "../../services/load-header";
import renderFilms from "./modules/films-list";
import { addForm, uploadFilms, changeFilmProgress } from "./modules/add-form";
import filterSearch from "./modules/search-filter-form";

loadHeader();

const form = document.getElementById('add-form');
const filmsField = document.querySelector('.library-films');

uploadFilms(filmsField, renderFilms);

filterSearch(filmsField, renderFilms);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    addForm(data, filmsField, renderFilms);
    form.reset();
});

filmsField.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash')) {
        const card = e.target.closest('.film-card');
        const id = +card.getAttribute('data-id');
        let films = JSON.parse(localStorage.getItem('films')) || [];

        const filmIndex = films.findIndex(film => +film.index === id);
        console.log(id)
        if (filmIndex !== -1) {
            films.splice(filmIndex, 1);
            localStorage.setItem('films', JSON.stringify(films));
        }

        filmsField.innerHTML = `
        <li class="film-card-header">
            <h3 class="film-title">Название</h3>
            <h3 class="film-year">Год</h3>
            <h3 class="film-rating-goida">Оценка</h3>
            <h3 class="film-status">Статус</h3>
            <h3 class="film-genre">Жанр</h3>
        </li>`;
        films.forEach((film, i) => {
            renderFilms({ ...film}, filmsField);
        });
    }
});



document.addEventListener('change', (e) => {
    if (e.target.classList.contains('film-status')) {
        const card = e.target.closest('.film-card');
        const id = card.getAttribute('data-id');
        const newStatus = e.target.value;
        changeFilmProgress(id, newStatus);
    }
});
