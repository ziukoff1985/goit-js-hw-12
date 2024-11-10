'use strict';

// Імпортуємо бібліотеку iziToast та стилі для відображення повідомлень.
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Імпортуємо бібліотеку SimpleLightbox та стилі для відображення зображень у збільшеному вигляді при кліку.
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Імпортуємо функції:
// fetchImages з файлу pixabay-api.js (виконує запит до API Pixabay і повертає зображення)
// createMarkup з файлу render-functions.js (динамічно генерує HTML-розмітку для галереї зображень)
import { fetchImages } from './js/pixabay-api';
import { createMarkup } from './js/render-functions';

let lightbox; // Змінна для створення екземпляру класу SimpleLightbox та для оновлення lightbox після завантаження зображень
let currentQuery = ''; // Змінна для збереження поточного запиту користувача
let currentPage = 1; // Змінна для початкового значення номеру сторінки
let totalHits = 0; // Загальна кількість зображень, що відповідають запиту

// Отримуємо доступи до елементів HTML:
const gallery = document.querySelector('.gallery'); // Галерея
const form = document.querySelector('.form'); // Форма
const input = document.querySelector('.input'); // Текстове поле вводу
const loader = document.querySelector('.loader'); // Лоадер (кнопка Search)
const loaderExtra = document.querySelector('.loader-extra'); // Лоадер (кнопка Load more)
const loadMoreButton = document.querySelector('.load-more'); // Кнопка "Load more"

// Ховаємо кнопку перед початком завантаження нових зображень
loadMoreButton.style.display = 'none';

// Слухачі події для форми та кнопки "Load more"
form.addEventListener('submit', handleSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

// Функція для обробки події Submit на формі
async function handleSubmit(event) {
  event.preventDefault(); // Скасовуємо дефолтну поведінку форми (перезавантаження)

  // Очищення вмісту галереї перед новим сабмітом (видаляємо всі наявні елементи списку <ul class="gallery"></ul>)
  gallery.innerHTML = '';

  // Оновлюємо значення змінних (оголошені на початку файлу перед імпортом):
  // currentQuery - записуємо текст з поля вводу форми
  currentQuery = input.value.trim();

  currentPage = 1; // Скидаємо значення сторінки на першау для нового пошуку

  // Перевірка на порожній запит (якщо поле вводу пусте: false -> в true) і показ помилки з бібліотекою iziToast
  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query...',
      position: 'topRight',
    });
    return; // Завершуємо функцію, якщо запит порожній
  }

  // Відображаємо лоадер (кнопка Search) на сторінці
  loader.style.display = 'block';
  loadMoreButton.style.display = 'none'; // Ховаємо кнопку "Load more" перед завантаженням

  // Конструкція try...catch для відловлювання можливих помилок
  try {
    // Змінна response приймає значення виконання функції fetchImages (з файла pixabay.api.js)
    const response = await fetchImages(currentQuery, currentPage);

    // Оновлюємо значення змінної totalHits (response.totalHits - властивість об'єкта response з загальною кіль-тю зображень у відповіді сервера)
    totalHits = response.totalHits; // Оновлюємо загальну кількість зображень

    // Ховаємо лоадер (кнопка Search) на сторінці
    loader.style.display = 'none';

    // Перевірка на наявність результатів:
    // Перевіряємо, чи масив зображень response.hits порожній. Якшо масив порожній (зображень за запитом не знайдено) - очищюємо наповнення галереї (видаляємо елементи списку <ul class="gallery"></ul>) і виводимо повідомлення за допомогою iziToast.info() з текстом про відсутність результатів.
    if (response.hits.length === 0) {
      gallery.innerHTML = '';
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 5000,
      });
      form.reset(); // Очищаємо форму
      return; // Припиняємо подальше виконання функції
    }

    gallery.innerHTML = ''; // Очищаємо галерею перед відображенням нових зображень

    // Викликаємо функцію createMarkup(). Генеруємо HTML розмітку для зображень та додаємо її до галереї (імпорт з ./js/render-functions) - приймає масив зображень response.hits
    createMarkup(response.hits);

    // Створюємо новий екземпляр SimpleLightbox з ініціалізацією на елементи посилань у ".gallery a" (перегляд зображень у збільшеному вигляді)
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionDelay: 250,
    });

    // Перевірка на кінець колекції:
    // Змінна totalPages - результат ділення (загальної кіль-ті зображень на кіль-ть зображень на сторінці) округлений вверх
    const totalPages = Math.ceil(totalHits / 15); // 15 - кількість зображень на сторінці
    if (currentPage >= totalPages) {
      // Якщо сторінка остання, ховаємо кнопку
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      loadMoreButton.style.display = 'block'; // Інакше показуємо кнопку "Load more"
    }
  } catch (error) {
    // Якщо сталася помилка, ховаємо лоадер і виводимо повідомлення через iziToast
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
    console.error('Error fetching images:', error);
  }
}

// Функція для обробки події "click" на кнопці "Load More"
async function loadMoreImages() {
  // Перехід до наступної сторінки (перша сторінка вже відображена при сабміті)
  currentPage += 1;

  // Відображаємо лоадер для кнопки "Load more"
  loaderExtra.style.display = 'block';
  loadMoreButton.style.display = 'none'; // Ховаємо кнопку "Load more"

  // Конструкція try...catch для відловлювання можливих помилок при запиті
  try {
    // Отримуємо нові зображення з API
    // Змінна response приймає значення виконання функції fetchImages (з файла pixabay.api.js)
    const response = await fetchImages(currentQuery, currentPage);

    // Ховаємо лоадер (кнопка Search) на сторінці
    loaderExtra.style.display = 'none';

    // Перевірка на наявність результатів:
    // Перевіряємо, чи масив зображень response.hits порожній. Якшо масив порожній (зображень за запитом не знайдено) - очищюємо наповнення галереї (видаляємо елементи списку <ul class="gallery"></ul>) і виводимо повідомлення за допомогою iziToast.info() з текстом про відсутність результатів.
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

    // Викликаємо функцію createMarkup() для створення динамічної розмітки(імпорт з ./js/render-functions) наступної сторінки з зображеннями ( приймає масив зображень response.hits)
    createMarkup(response.hits); // Додаємо нову розмітку для додаткових зображень
    scrollPage(); // Плавно прокручуємо сторінку вниз на 2 висоти зображення

    // Перевірка на кінець колекції:
    // Змінна totalPages - результат ділення (загальної кіль-ті зображень на кіль-ть зображень на сторінці) округлений вверх
    const totalPages = Math.ceil(totalHits / 15); // Загальна кількість сторінок
    // Порівнюємо номер поточної сторінки до кіль-ті всіх сторінок
    if (currentPage >= totalPages) {
      // Якщо поточна сторінка остання - ховаємо кнопку
      loadMoreButton.style.display = 'none';
      iziToast.info({
        // Виводимо повідомлення
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      // В іншому випадку - показуємо кнопку "Load more"
      loadMoreButton.style.display = 'block';
    }

    // Оновлюємо lightboxдля нових зображень, якщо він існує (це потрібно щоб очичтити кеш бібліотеки і в модалці відображались вже завантажені зображення)
    if (lightbox) {
      lightbox.refresh();
    }
  } catch (error) {
    // // Якщо сталася помилка, ховаємо лоадер і показуємо кнопку для повторного запиту
    loader.style.display = 'none';
    loadMoreButton.style.display = 'block';
    iziToast.error({
      // Виводимо повідомлення
      title: 'Error',
      message: 'Failed to fetch more images. Please try again later.',
      position: 'topRight',
    });
    console.error('Error fetching more images:', error);
  }
}

// Функція для реалізація плавного скролу
function scrollPage() {
  // Знаходимо перший елемент галереї
  const galleryItem = gallery.querySelector('.gallery-item');

  // Перевіряємо наявність елемента, щоб уникнути помилки
  // Якщо елементів немає, виходимо з функції
  if (!galleryItem) return;

  // Змінна для отримання висоти картки
  const cardHeight = galleryItem.getBoundingClientRect().height;

  // Прокручуємо на дві висоти картки
  window.scrollBy({
    left: 0,
    top: cardHeight * 2, // Прокручуємо на висоту двох карток
    behavior: 'smooth', // Плавний скрол
  });
}
