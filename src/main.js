'use strict';

import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay-api';
import { createMarkup } from './js/render-functions';

let lightbox;
let currentQuery = '';
let currentPage = 1;
let totalHits = 0; // Загальна кількість зображень, що відповідають запиту

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const loader = document.querySelector('.loader');
const loaderExtra = document.querySelector('.loader-extra');
const loadMoreButton = document.querySelector('.load-more'); // Кнопка "Load more"

// Ховаємо кнопку "Load more" на старті
loadMoreButton.style.display = 'none';

form.addEventListener('submit', handleSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

async function handleSubmit(event) {
  event.preventDefault();

  currentQuery = input.value.trim();
  currentPage = 1; // Скидаємо значення сторінки для нового пошуку

  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query...',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'block';
  loadMoreButton.style.display = 'none'; // Ховаємо кнопку перед завантаженням

  try {
    const response = await fetchImages(currentQuery, currentPage);

    totalHits = response.totalHits; // Оновлюємо загальну кількість зображень

    loader.style.display = 'none';

    if (response.hits.length === 0) {
      gallery.innerHTML = '';
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 5000,
      });
      form.reset();
      return;
    }

    gallery.innerHTML = ''; // Очищаємо галерею перед новим пошуком
    createMarkup(response.hits);
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionDelay: 250,
    });

    // Перевірка на кінець колекції
    const totalPages = Math.ceil(totalHits / 15); // Загальна кількість сторінок
    if (currentPage >= totalPages) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      loadMoreButton.style.display = 'block'; // Показуємо кнопку "Load more"
    }

    // Прокрутка сторінки після завантаження нових зображень
    // scrollPage();
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
    console.error('Error fetching images:', error);
  }
}

async function loadMoreImages() {
  currentPage += 1; // Збільшуємо номер сторінки для наступного завантаження

  loaderExtra.style.display = 'block';
  loadMoreButton.style.display = 'none';
  try {
    const response = await fetchImages(currentQuery, currentPage);

    loaderExtra.style.display = 'none';

    if (response.hits.length === 0) {
      loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо більше немає результатів
      iziToast.info({
        title: 'No More Results',
        message: 'No more images available.',
        position: 'topRight',
        timeout: 5000,
      });
      return;
    }

    createMarkup(response.hits);
    scrollPage();
    // Перевірка на кінець колекції
    const totalPages = Math.ceil(totalHits / 15); // Загальна кількість сторінок
    if (currentPage >= totalPages) {
      // Якщо поточна сторінка остання
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      loadMoreButton.style.display = 'block';
    }

    // Оновлюємо lightbox, якщо він існує
    if (lightbox) {
      lightbox.refresh();
    }

    // Прокрутка сторінки після завантаження нових зображень
  } catch (error) {
    loader.style.display = 'none';
    loadMoreButton.style.display = 'block'; // Показуємо кнопку, щоб користувач міг спробувати знову
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch more images. Please try again later.',
      position: 'topRight',
    });
    console.error('Error fetching more images:', error);
  }
}

function scrollPage() {
  const galleryItem = gallery.querySelector('.gallery-item:last-child');

  if (!galleryItem) return;

  const cardHeight = galleryItem.getBoundingClientRect().height; // Висота останньої картки

  console.log(cardHeight); // Перевіряємо висоту картки

  // Прокручуємо на дві висоти картки
  window.scrollBy({
    top: cardHeight * 2, // Прокрутка на дві висоти картки
    behavior: 'smooth', // Плавна прокрутка
  });
}
