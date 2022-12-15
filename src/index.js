import './css/styles.css';
import fetchImages from './fetchImages.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const DEBOUNCE_DELAY = 300;
// const inputRef = document.getElementById('search-box');
const imageListRef = document.querySelector('div.gallery');
const formRef = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const loadContainerRef = document.querySelector('div.button-container');

loadMoreBtn.hidden = true;
let page = 1;
let perPage = 40;
let totalPages = 1;
let gallery = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
});
let pagesLeft = 1;
const params = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: '',
  per_page: perPage,
};
async function invokeResponseSet(evt) {
  evt.preventDefault();
  imageListRef.innerHTML = '';
  page = 1;
  params.page = page;
  params.q = evt.currentTarget.elements.searchQuery.value.trim();
  if (params.q === '') {
    return;
  }
  await renderImages(params);
  createSimpleLightBox();
}
async function renderImages(params) {
  console.log(pagesLeft);
  try {
    const response = await fetchImages(params);
    if (pagesLeft === 0) {
      loadContainerRef.innerHTML = '';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (response.status !== 200) {
      loadMoreBtn.hidden = true;
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalPages = Math.ceil(response.data.totalHits / perPage);
    loadMoreBtn.hidden = false;
    await appendMarkup(response);
    return { data };
  } catch (error) {
    if (error.status === 404) {
      loadMoreBtn.hidden = true;
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      imageListRef.innerHTML = '';
      return;
    }
  }
}
async function appendMarkup(response) {
  imageListRef.insertAdjacentHTML('beforeend', await createMarkup(response));
  if (params.page === 1)
    return Notify.success(
      `Hoorray! We found ${response.data.totalHits} images`
    );
}
formRef.addEventListener('submit', invokeResponseSet);
loadMoreBtn.addEventListener('click', async () => {
  params.page += 1;
  pagesLeft = totalPages - params.page;
  await renderImages(params);
  gallery.refresh('show.simplelightbox');
});
async function createMarkup({ data }) {
  return await data.hits
    .map(
      image => `<div class='photo-card'><a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" height="200" /></a>
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
  </div>
`
    )
    .join('');
}

function createSimpleLightBox() {
  gallery = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
}
