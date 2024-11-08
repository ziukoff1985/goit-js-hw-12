'use strict';

import axios from 'axios'; // Імпортуємо бібліотеку Axios

const API_KEY = '46843956-48321f6890b82a65cca7319ef';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const searchParams = new URLSearchParams({
    key: API_KEY, // Ключ API для автентифікації.
    q: query, // Запит на пошук, введений користувачем.
    image_type: 'photo', // Тип зображень ('photo').
    orientation: 'horizontal', // Орієнтація зображень - горизонтальна.
    safesearch: true, // Безпечний пошук.
    page: page,
    per_page: 15,
  });

  const url = `${BASE_URL}?${searchParams}`;

  try {
    // Виконуємо запит за допомогою axios.get
    const response = await axios.get(url);

    return response.data; // Повертаємо дані у випадку успіху
  } catch (error) {
    // Обробка помилок
    iziToast.error({
      title: 'Error', // Заголовок повідомлення.
      message: 'Failed to fetch images. Please try again later.', // Текст повідомлення для користувача.
      position: 'topRight', // Розташування повідомлення.
    });
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Рекомендується повторно кинути помилку, якщо є логіка для обробки її в іншій частині коду
  }
}
