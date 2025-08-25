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

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('film-status')) {
        const card = e.target.closest('.film-card');
        const id = card.getAttribute('data-id');
        const newStatus = e.target.value;
        changeFilmProgress(id, newStatus);
    }
});
