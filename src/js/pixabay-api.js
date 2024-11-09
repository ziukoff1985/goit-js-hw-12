'use strict';

import axios from 'axios'; // Імпортуємо бібліотеку Axios

const API_KEY = '46843956-48321f6890b82a65cca7319ef';
const BASE_URL = 'https://pixabay.com/api/';

// Функція fetchImage (приймає запит користувача і номер сторінки) відправляє запит і обробляє відповідь від API
export async function fetchImages(query, page = 1) {
  const searchParams = new URLSearchParams({
    key: API_KEY, // Ключ API для автентифікації.
    q: query, // Запит на пошук, введений користувачем.
    image_type: 'photo', // Тип зображень ('photo').
    orientation: 'horizontal', // Орієнтація зображень - горизонтальна.
    safesearch: true, // Увімкнено безпечний пошук.
    page: page, // Номер сторінки для пагінації.
    per_page: 15, // Кількість зображень на сторінку.
  });

  const url = `${BASE_URL}?${searchParams}`;

  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    // Відображаємо сповіщення про помилку користувачеві та виводимо помилку в консоль
    iziToast.error({
      title: 'Error', // Заголовок повідомлення.
      message: 'Failed to fetch images. Please try again later.', // Текст повідомлення для користувача.
      position: 'topRight', // Розташування повідомлення.
    });
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Перевикидаємо помилку для обробки в основному коді
  }
}
