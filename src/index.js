import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function resetMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onSearch() {
  resetMarkup();
  const value = input.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(countries => markupCountries(countries))
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function createCountryListMarkup({ name, flags }) {
  return `<li class="country-item"><img src="${flags.svg}" alt="прапор ${name.official}" width="20"><h2 class="country-name">${name.common}</h2></li>`;
}

function createCountryInfoMarkup({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return `<div class="country-title">
  <img src="${flags.svg}" alt="Прапор ${name.official}" width="30"/>
     <h2>${name.common}</h2></div>
     <p><b>Capital: </b> ${capital}</p>
     <p><b>Popualtion: </b> ${population}</p>
     <p><b>Languages: </b> ${Object.values(languages).join(', ')}</p>`;
}

function markupCountries(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length === 1) {
    const markup = countries.map(country => createCountryInfoMarkup(country));
    countryInfo.innerHTML = markup;
  } else {
    const markup = countries.map(country => createCountryListMarkup(country));
    countryList.innerHTML = markup.join('');
  }
}
