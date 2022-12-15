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

loadMoreBtn.hidden = true;
let page = 1;
let perPage = 40;
let gallery;
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
  loadMoreBtn.hidden = false;
}
function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('div.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
async function renderImages(params) {
  try {
    const response = await fetchImages(params);
    if (response.status !== 200) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    await appendMarkup(response);
    return { data };
  } catch (error) {
    if (error.status === 404) {
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
loadMoreBtn.addEventListener('click', () => {
  params.page += 1;
  renderImages(params);
  slowScroll();
  gallery.refresh();
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
