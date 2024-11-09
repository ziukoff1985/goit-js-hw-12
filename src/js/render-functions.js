'use strict';

const gallery = document.querySelector('.gallery');

// Функція 'createMarkup' (приймає масив) створює динамічну розмітку зображень, на основі отриманих даних. Імпортується і використовується в файлі main.js
export function createMarkup(arrImages) {
  const markup = arrImages
    .map(image => {
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
    .join(''); // Перетворюємо масив рядків у єдину розмітку

  gallery.insertAdjacentHTML('beforeend', markup); // Додаємо розмітку до галереї
}
