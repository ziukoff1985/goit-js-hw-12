'use strict';

// Імпортуємо бібліотеку Axios для виконання HTTP запитів
import axios from 'axios';

// Ключ API та базовий URL для API Pixabay
const API_KEY = '46843956-48321f6890b82a65cca7319ef';
const BASE_URL = 'https://pixabay.com/api/';

// Функція fetchImages (відправляє запит до API і обробляє відповідь)
export async function fetchImages(query, page = 1) {
  // Створюємо параметри для запиту
  const searchParams = new URLSearchParams({
    key: API_KEY, // Ключ API для автентифікації.
    q: query, // Запит на пошук, введений користувачем.
    image_type: 'photo', // Тип зображень (лише фото)
    orientation: 'horizontal', // Орієнтація зображень - горизонтальна.
    safesearch: true, // Увімкнено безпечний пошук.
    page: page, // Номер сторінки для пагінації.
    per_page: 15, // Кількість зображень на сторінку.
  });

  // Формуємо URL для запиту, додаючи параметри пошуку
  const url = `${BASE_URL}?${searchParams}`;

  try {
    // Відправляємо GET запит за допомогою axios
    const response = await axios.get(url);

    // Повертаємо дані з відповіді від API
    return response.data;
  } catch (error) {
    // Якщо сталася помилка, показуємо сповіщення користувачеві
    iziToast.error({
      title: 'Error', // Заголовок повідомлення.
      message: 'Failed to fetch images. Please try again later.', // Текст повідомлення для користувача.
      position: 'topRight', // Розташування повідомлення.
    });
    // Виводимо помилку в консоль для налагодження
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Перевикидаємо помилку, щоб основний код міг її обробити
  }
}
