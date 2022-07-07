import './sass/_example.scss';
import Notiflix, { Notify } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {GetPixabayApi} from './GetPixabay';



Notify.init({
  position: 'center-top',
  timeout: 2000,
  cssAnimationStyle: 'from-top',
  showOnlyTheLastOne: true,
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
});

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const loadMoreBtnRef = document.querySelector('.load-more');
const getPixabayApi = new GetPixabayApi();
loadMoreBtnRef.style.display = 'none';

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

function makeGalleryMarkup(searchedImages) {
  return searchedImages
    .map(
      ({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) => `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p></a>
    </div>
    </div>`).join('');
};

function renderGallery(searchedImages) {
  galleryRef.insertAdjacentHTML('beforeend', makeGalleryMarkup(searchedImages));
};

async function onFormSubmit(e) { 
  e.preventDefault();
  clearGalleryMarkup();
  getPixabayApi.resetPage();
  const reqest = e.target.elements.searchQuery.value.trim();
  if (!reqest) return Notify.info('Please input some to serch');
   

getPixabayApi.searchQueryReq = reqest
  try {
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    if (!totalHits)
      return Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderGallery(hits);
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  };
  loadMoreBtnRef.style.display = 'block';

  e.target.reset();
};

 
async function onLoadMoreBtnClick() {
  try {
    const { hits, totalHits } = await getPixabayApi.fetchImages();
    renderGallery(hits);

const total = document.querySelectorAll('.photo-card').length;
    if (total >= totalHits) {
        // loadMoreBtnRef.classList.add('visually-hidden');
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      loadMoreBtnRef.style.display = 'none';
    };

    lightbox.refresh();
    const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
  } catch (error) { console.log(error.message);}
 };


function clearGalleryMarkup() { 
  galleryRef.innerHTML = '';
};




