import '../css/styles.css';
import fetchImages from './fetchImages.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createMarkup from './create-markup';
import OnlyScroll from 'only-scrollbar';

// import InfiniteScroll from 'infinite-scroll';
const DEBOUNCE_DELAY = 300;
// const inputRef = document.getElementById('search-box');
const imageListRef = document.querySelector('div.gallery');
const formRef = document.getElementById('search-form');

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
new OnlyScroll(document.scrollingElement, {
  damping: 0.6,
});
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
  formRef.reset();
}
async function renderImages(params) {
  console.log(pagesLeft);
  if (pagesLeft === 0) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }
  try {
    const response = await fetchImages(params);
    if (response.status !== 200) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalPages = Math.ceil(response.data.totalHits / perPage);
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
window.addEventListener('scroll', async () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    params.page += 1;
    pagesLeft = totalPages - params.page + 1;
    await renderImages(params);
    gallery.refresh('show.simplelightbox');
  }
});
function createSimpleLightBox() {
  gallery = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
}
