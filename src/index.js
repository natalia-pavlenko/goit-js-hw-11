import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { GetPhoto } from './pixabayApi';

const searchForm = document.querySelector('#search-form');
const divGallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });
let searchQuery = null;
let page = null;

// const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });
// const perPage = 40;
// let page = 1;
// let observer = null;
// const options = {
//   root: null,
//   rootMargin: '600px',
//   threshold: 1.0,
// };

searchForm.addEventListener('submit', onFormSubmit);
function onFormSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.target.elements.searchQuery.value.trim();
  page = 1;

  divGallery.innerHTML = '';
  loadBtn.classList.add('visually-hidden');

  //       if (page === totalHits) {
  //           console.log(page);
  //           Notify.info( `We're sorry, but you've reached the end of search results.`
  //       }
  //       changeFormOpacity();
  //       page += 1;
  //     })

  //   .catch(error => {
  //     if (!data.totalHits) {
  //       Notify.failure(
  //            'Sorry, there are no images matching your search query. Please try again.'
  //          );
  //          divGallery.innerHTML = '';
  //          return;
  //        }
  //        observer.unobserve(guard);
  //   })
  //   .then

  //   () => simpleligthbox.refresh()
  //   ();

  GetPhoto(searchQuery, page)
    .then(response => {
      if (response.data.hits.length < 1) {
        throw new Error();
      }
      addMoreImages(response.data.hits);
      if (page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      if (response.data.totalHits > 40) {
        loadBtn.classList.remove('visually-hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

loadBtn.addEventListener('click', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  page += 1;

  GetPhoto(searchQuery, page)
    .then(response => {
      addMoreImages(response.data.hits);
      simpleligthbox.refresh();
      smoothImagesScroll();
      if (page === Math.ceil(response.data.totalHits / 40)) {
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        loadBtn.classList.add('visually-hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function createMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><div class="thumb"><a class="gallery-item" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </div>`
    )
    .join('');
}

function addMoreImages(array) {
  divGallery.insertAdjacentHTML('beforeend', createMarkup(array));
}

function smoothImagesScroll() {
  const { height: cardHeight } =
    divGallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
