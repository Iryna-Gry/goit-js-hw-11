import './css/styles.css';
import fetchImages from './fetchImages.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

// const inputRef = document.getElementById('search-box');
const imageListRef = document.querySelector('div.gallery');
const formRef = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
let request = '';
let page = 1;
let perPage = 40;
const params = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: '',
  per_page: perPage,
};
function invokeResponseSet(evt) {
  evt.preventDefault();
  imageListRef.innerHTML = '';
  page = 1;
  params.page = page;
  params.q = evt.currentTarget.elements.searchQuery.value.trim();
  if (params.q === '') {
    return;
  }
  console.log(params);
  renderImages(params);
}
function appendMarkup(imageData) {
  imageListRef.insertAdjacentHTML('beforeend', createMarkup(imageData));
}
function renderImages(params) {
  return fetchImages(params)
    .then(imageData => {
      appendMarkup(imageData);
      if (params.page === 1)
        return Notify.success(
          `Hoorray! We found ${imageData.totalHits} images`
        );
    })
    .catch(error => {
      if (error.status === 404) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        imageListRef.innerHTML = '';
        return;
      }
    });
}
formRef.addEventListener('submit', invokeResponseSet);
loadMoreBtn.addEventListener('click', () => {
  params.page += 1;
  renderImages(params);
});
function createMarkup(imageData) {
  console.log(imageData);
  return imageData.hits
    .map(
      image => `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" height="200" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}
