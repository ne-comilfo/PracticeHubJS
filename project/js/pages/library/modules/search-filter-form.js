function filterSearch(filmsField, renderFilms) {
    const filtersWindow = document.querySelector('.modal-content');
    const filterBtn = document.querySelector('#open-filters');
    const closeFilterBtn = document.querySelector('#close-filters');
    const filterForm = document.querySelector('#filters-form');
    const resetBtn = document.querySelector('#reset-filters');
    const inputSearch = document.querySelector('.library-search input');

    let filmsInput = JSON.parse(localStorage.getItem('films')) || [];
    let filmsFilters = [];

    const filmsHeader = `
        <li class="film-card-header">
            <h3 class="film-title">Название</h3>
            <h3 class="film-year">Год</h3>
            <h3 class="film-rating-goida">Оценка</h3>
            <h3 class="film-status">Статус</h3>
            <h3 class="film-genre">Жанр</h3>
        </li>`;

    filterBtn.addEventListener('click', () => filtersWindow.hidden = !filtersWindow.hidden);
    closeFilterBtn.addEventListener('click', () => filtersWindow.hidden = true);

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);

        // собираем массив для каждого name с несколькими значениями
        const filters = {};
        for (const [key, value] of formData.entries()) {
            if (filters[key]) {
                if (Array.isArray(filters[key])) {
                    filters[key].push(value);
                } else {
                    filters[key] = [filters[key], value];
                }
            } else {
                filters[key] = value;
            }
        }
        const films = JSON.parse(localStorage.getItem('films')) || [];

        filmsFilters = filterDataByFilter(films, filters);
        filmsField.innerHTML = filmsHeader;
        filmsFilters.forEach(film => renderFilms(film, filmsField));
    });

    resetBtn.addEventListener('click', () => {
        filterForm.reset();
        filmsFilters = [];

        const films = JSON.parse(localStorage.getItem('films')) || [];
        filmsField.innerHTML = filmsHeader;
        const searchValue = inputSearch.value.trim() === 0 ? films : filterDataByInput(films, inputSearch.value)
        searchValue.forEach(film => renderFilms(film, filmsField));
    });


    inputSearch.addEventListener('input', () => {
        const films = JSON.parse(localStorage.getItem('films')) || [];
        filmsField.innerHTML = filmsHeader;
        const baseList = filmsFilters.length > 0 ? filmsFilters : films;
        filmsInput = filterDataByInput(baseList, inputSearch.value);

        filmsInput.forEach(film => renderFilms(film, filmsField));
    });
}

function filterDataByFilter(films, filters) {
    for (let filter in filters) {
        if (filters[filter].length === 0) delete filters[filter];
    }

    for (let filter in filters) {
        switch (filter) {
            case 'status':
                if (!Array.isArray(filters[filter])) {
                    films = films.filter(film => film.progress === filters[filter]);
                } else {
                    films = films.filter(film => filters[filter].includes(film.progress));
                }

                break;
            case 'rating':
                if (!Array.isArray(filters[filter])) {
                    films = films.filter(film => film.mark === filters[filter]);
                } else {
                    films = films.filter(film => filters[filter].includes(film.mark));
                }
                break;
            case 'genre':
                if (!Array.isArray(filters[filter])) {
                    films = films.filter(film => film.genre === filters[filter]);
                } else {
                    films = films.filter(film => filters[filter].includes(film.genre));
                }
                break;
            case 'year-from':
                films = films.filter(film => film.year >= +filters[filter]);
                break;
            case 'year-to':
                films = films.filter(film => film.year <= +filters[filter]);
                break;
            default:
                console.log('Ты долбаеб');
        }
    }
    return films;
}

function filterDataByInput(films, inputData) {
    return films.filter(film => film.title.toLowerCase().includes(inputData.toLowerCase()));
}

export default filterSearch;
