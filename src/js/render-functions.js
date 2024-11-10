'use strict';

// Оголошуємо змінну для доступу до контейнера галереї на сторінці
const gallery = document.querySelector('.gallery');

/// Функція 'createMarkup' приймає масив об'єктів із зображеннями і створює динамічну HTML розмітку для галереї. Імпортується і використовується в файлі main.js
export function createMarkup(arrImages) {
  // Використовуємо метод .map() для створення HTML рядків для кожного зображення
  const markup = arrImages
    .map(image => {
      // Формуємо HTML для кожного зображення
      return `<li class="gallery-item">
	  <a class="gallery-link" href="${image.largeImageURL}">
		<img 
			class="gallery-image" 
			src="${image.webformatURL}" 
			alt="${image.tags}" loading="lazy" 
			/>
        <div class="gallery-info">
        <p class="gallery-likes"><span>Likes:</span> ${image.likes}</p>
        <p class="gallery-views"><span>Views:</span> ${image.views}</p>
        <p class="gallery-comments"><span>Comments:</span> ${image.comments}</p>
        <p class="gallery-downloads"><span>Downloads:</span> ${image.downloads}</p>
      </div>    
	  </a>
    </li>
    `;
    })
    .join(''); // Перетворюємо масив рядків на одну строку HTML

  // Додаємо створену розмітку в кінець контейнера галереї на сторінці
  gallery.insertAdjacentHTML('beforeend', markup);
}
