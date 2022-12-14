import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const inputRef = document.getElementById('image-box');
const imageListRef = document.querySelector('.image-list');
const searchBtnRef = document.querySelector('.search-box-button');

function invokeResponseSet(evt) {
  imageListRef.innerHTML = '';
  const name = evt.target.value.trim();
  if (name === '') {
    return;
  }
  fetchImages(name)
    .then(imageData => createMarkup(imageData))
    .catch(error => {
      if (error.status === 404) {
        Notify.failure('Oops, there is no country with that name');
        imageListRef.innerHTML = '';
        return;
      }
    });
}
inputRef.addEventListener('input', debounce(invokeResponseSet, DEBOUNCE_DELAY));
// function createMarkup(countryData) {
//   if (countryData.length > 10) {
//     Notify.info('Too many matches found. Please enter a more specific name.');
//     return;
//   } else if (countryData.length < 10 && countryData.length > 1) {
//     const markup = createSimpleMarkup(countryData);
//     countryListRef.insertAdjacentHTML('beforeend', markup);
//   } else {
//     countryInfoRef.innerHTML = createAdvancedMarkup(countryData);
//   }
// }
// function createSimpleMarkup(countryData) {
//   return countryData
//     .map(
//       country =>
//         `<li class='country-item'><img src='${country.flags.svg}' width=50/><h2 class='country-item-name--simple'>${country.name.official}</h2></li>`
//     )
//     .join('');
// }
// function createAdvancedMarkup(country) {
//   const countryForMarkup = country[0];
//   const languages = Object.values(countryForMarkup.languages);
//   return `<div class='image-container'><img src='${countryForMarkup.flags.svg}' width=50/>
//   <h2 class='country-item-name'>${countryForMarkup.name.official}</h2></div>
//   <p class='country-item-text'>Capital:<span class='country-item-valuetext'>${countryForMarkup.capital}</span></p>
//   <p class='country-item-text'>Population:<span class='country-item-valuetext'>${countryForMarkup.population}</span></p>
//   <p class='country-item-text'>Languages:<span class='country-item-valuetext'>${languages}</span></p>`;
// }
