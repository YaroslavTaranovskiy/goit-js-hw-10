import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from "./fetchCountries";


const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    let searchValue = event.target.value.trim();
    if (!searchValue) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    }
    fetchCountries(event.target.value.trim()).then(r => {
        if (r.length === 1) {
            renderMarkUp(r);
        }
        if (r.length > 2 && r.length <= 10) {
            renderCountriesList(r);
        }
        if (r.length > 10) {
            return Notify.info('Too many matches found. Please enter a more specific name.');
        }
      
    }).catch(error => {
        Notify.failure('Oops, there is no country with that name');
        });
  
      
}

function renderMarkUp(r) {
const markUp = r.map(({ name, flags, capital, population, languages }) => {
    return `<img src=${flags.svg} alt="flag" width="60"></img>
        <h2 class="country-info__name">${name.official}</h2>
        <p class="country-info__desc">Capital:<span class="country-info__value">${capital}</span></p>
        <p class="country-info__desc">Population:<span class="country-info__value">${population}</span></p> 
        <p class="country-info__desc">Languages:<span class="country-info__value">${Object.values(languages)}</span></p>`;
    }).join('');
    countryInfo.innerHTML = markUp;
    countryList.innerHTML = '';
}

function renderCountriesList(r) {
const renderList = r.map(({ name, flags }) => {
    return `<img src=${flags.svg} alt="flag" width="60"></img>
        <h2 class="country-info__name">${name.official}</h2>`;
    }).join('');
    countryList.innerHTML = renderList;
    countryInfo.innerHTML = '';
}

