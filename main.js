// Mock Data (Моковые данные)
const mockOffers = [
  {
    service: "Уроки по React",
    provider: "Антон П.",
    rating: 4.9,
    img: "https://placehold.co/100x100/4f46e5/ffffff?text=AP",
  },
  {
    service: "Дизайн логотипов",
    provider: "Мария С.",
    rating: 5.0,
    img: "https://placehold.co/100x100/10b981/ffffff?text=MS",
  },
  {
    service: "Курс по Figma",
    provider: "Иван Т.",
    rating: 4.7,
    img: "https://placehold.co/100x100/f59e0b/ffffff?text=IT",
  },
  {
    service: "Копирайтинг (IT)",
    provider: "Елена В.",
    rating: 4.8,
    img: "https://placehold.co/100x100/ef4444/ffffff?text=EV",
  },
  {
    service: "3D Моделирование",
    provider: "Сергей К.",
    rating: 4.9,
    img: "https://placehold.co/100x100/0ea5e9/ffffff?text=SK",
  },
  {
    service: "Консультации по БД",
    provider: "Дмитрий М.",
    rating: 4.6,
    img: "https://placehold.co/100x100/ec4899/ffffff?text=ДМ",
  },
];

const mockUsers = [
  {
    name: "Анна К.",
    img: "https://placehold.co/64x64/f59e0b/ffffff?text=АК",
  },
  {
    name: "Павел И.",
    img: "https://placehold.co/64x64/10b981/ffffff?text=ПИ",
  },
  {
    name: "Дарья Р.",
    img: "https://placehold.co/64x64/3b82f6/ffffff?text=ДР",
  },
  {
    name: "Михаил Л.",
    img: "https://placehold.co/64x64/ef4444/ffffff?text=МЛ",
  },
  {
    name: "Ольга Н.",
    img: "https://placehold.co/64x64/0ea5e9/ffffff?text=ОН",
  },
  {
    name: "Владимир Г.",
    img: "https://placehold.co/64x64/4f46e5/ffffff?text=ВГ",
  },
  {
    name: "Наталья З.",
    img: "https://placehold.co/64x64/a855f7/ffffff?text=НЗ",
  },
  {
    name: "Тимур Б.",
    img: "https://placehold.co/64x64/be185d/ffffff?text=ТБ",
  },
];
// Дублируем пользователей для эффекта бесконечного скролла
const infiniteUsers = [...mockUsers, ...mockUsers];

// Константы для логики бесконечной карусели
const CLONE_COUNT = 2; // Количество клонированных карточек на каждой стороне

// --- 1. Логика Генерации Контента ---

// Генерация HTML для одной карточки
function createCardHtml(offer, index, isClone = false) {
  const cloneClass = isClone ? "is-clone" : "";
  return `
                <div class="offer-card bg-white p-6 rounded-2xl border-2 border-transparent shadow-lg min-h-[250px] flex flex-col justify-between ${cloneClass}" 
                     data-index="${index}" data-real-index="${
    offer.realIndex !== undefined ? offer.realIndex : index
  }">
                    <div>
                        <span class="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                            ${
                              offer.rating >= 5.0
                                ? "Топ Рейтинг"
                                : "Лучший Выбор"
                            }
                        </span>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">${
                          offer.service
                        }</h3>
                    </div>
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div class="flex items-center space-x-3">
                            <img src="${offer.img}" alt="${
    offer.provider
  }" class="w-8 h-8 rounded-full object-cover">
                            <span class="text-sm font-medium text-gray-600">${
                              offer.provider
                            }</span>
                        </div>
                        <div class="flex items-center text-yellow-500 font-bold text-lg">
                            ${
                              offer.rating
                            } <i data-lucide="star" class="w-4 h-4 ml-1 fill-yellow-500"></i>
                        </div>
                    </div>
                </div>
            `;
}

// Генерация карточек предложений (теперь с клонированием)
function generateOfferCards() {
  const container = document.getElementById("offer-carousel-content");

  const realCards = mockOffers;
  const N = realCards.length;

  // 1. Клонируем последние CLONE_COUNT карточек и вставляем их в начало
  const prependClones = realCards
    .slice(-CLONE_COUNT)
    .map((offer) => ({ ...offer, realIndex: realCards.indexOf(offer) }));

  // 2. Клонируем первые CLONE_COUNT карточек и вставляем их в конец
  const appendClones = realCards
    .slice(0, CLONE_COUNT)
    .map((offer) => ({ ...offer, realIndex: realCards.indexOf(offer) }));

  // Собираем полный массив для DOM: [Клоны конца] + [Настоящие] + [Клоны начала]
  const fullList = [...prependClones, ...realCards, ...appendClones];

  let htmlContent = "";
  fullList.forEach((offer, index) => {
    const isClone = index < CLONE_COUNT || index >= N + CLONE_COUNT;
    htmlContent += createCardHtml(offer, index, isClone);
  });

  container.innerHTML = htmlContent;

  // Пересоздание иконок для нового контента
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Генерация карточек пользователей
function generateUserCards() {
  const rowTop = document.getElementById("user-row-top");
  const rowBottom = document.getElementById("user-row-bottom");

  const userContentHtml = infiniteUsers
    .map(
      (user) => `
                <div class="flex items-center bg-white p-2 sm:p-3 mx-2 rounded-lg shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-105 flex-shrink-0 cursor-pointer border border-gray-100">
                    <img src="${user.img}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover mr-3 border-2 border-indigo-200">
                    <span class="text-sm font-medium text-gray-700 whitespace-nowrap pr-2">${user.name}</span>
                </div>
            `
    )
    .join("");

  rowTop.innerHTML = userContentHtml + userContentHtml;
  rowBottom.innerHTML = userContentHtml + userContentHtml;
}

// --- 2. Логика Мануальной Карусели Предложений (Бесконечный цикл) ---
function initManualOffersCarousel() {
  const wrapper = document.getElementById("offer-carousel-wrapper");
  const content = document.getElementById("offer-carousel-content");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const dotsContainer = document.getElementById("indicator-dots-container");
  const cards = content.querySelectorAll(".offer-card");

  if (cards.length === 0) return;

  // Константы, основанные на CSS/Tailwind
  const CARD_WIDTH = 360;
  const GAP_WIDTH = 16; // space-x-4
  const TOTAL_STEP = CARD_WIDTH + GAP_WIDTH;

  const N_REAL = mockOffers.length; // 6

  // Начальный индекс — первая "настоящая" карточка после клонов
  let currentIndex = CLONE_COUNT;
  let isTransitioning = false;

  // Длительность CSS перехода (должна совпадать с transition в CSS)
  const TRANSITION_DURATION_MS = 500;

  /**
   * Генерирует индикаторные точки.
   */
  function generateDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < N_REAL; i++) {
      const dot = document.createElement("div");
      dot.classList.add("indicator-dot", "transform");
      dot.dataset.dotIndex = i; // 0 to N_REAL-1
      dot.addEventListener("click", () => {
        // При клике на точку, переходим к соответствующей реальной карточке: dot index + CLONE_COUNT
        goToIndex(i + CLONE_COUNT);
      });
      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Вычисляет смещение (transformX) для центрирования карточки по индексу.
   */
  function calculateTransformX(index) {
    // Ширина видимого контейнера (wrapper, который имеет overflow: hidden)
    const wrapperWidth = wrapper.clientWidth;

    // 1. Смещение, чтобы центрировать ПЕРВУЮ карточку (index 0)
    const initialOffset = wrapperWidth / 2 - CARD_WIDTH / 2;

    // 2. Смещение, основанное на шагах (index * (ширина + отступ))
    const stepShift = index * TOTAL_STEP;

    // Итоговое значение: (Начальное смещение) - (Сдвиг по шагам)
    return initialOffset - stepShift;
  }

  /**
   * Обновляет UI (трансформацию, активный класс карточки и активную точку).
   * @param {number} index - Целевой индекс в полном массиве DOM.
   * @param {boolean} animated - Использовать ли CSS-переход.
   */
  function goToIndex(index, animated = true) {
    if (isTransitioning && animated) return;
    isTransitioning = animated;

    currentIndex = index;

    // 1. Управление анимацией и Transform
    content.style.transition = animated
      ? `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
      : "none";

    const transformX = calculateTransformX(currentIndex);
    content.style.transform = `translateX(${transformX}px)`;

    // 2. Обновляем активный класс КАРТОЧКИ
    cards.forEach((card) => card.classList.remove("is-active"));
    cards[currentIndex].classList.add("is-active");

    // 3. Обновляем активный класс ТОЧКИ
    const dots = dotsContainer.querySelectorAll(".indicator-dot");

    // Вычисляем реальный индекс, который должен быть подсвечен (0 до N_REAL-1)
    let realIndex = currentIndex - CLONE_COUNT;

    // Обрабатываем клоны в начале (индексы 0, 1)
    if (realIndex < 0) {
      realIndex += N_REAL;
    }
    // Обрабатываем клоны в конце
    else if (realIndex >= N_REAL) {
      realIndex -= N_REAL;
    }

    dots.forEach((dot, dotIndex) => {
      dot.classList.remove("is-active-dot");
      if (dotIndex === realIndex) {
        dot.classList.add("is-active-dot");
      }
    });

    // 4. Логика Снап-бэка (бесшовного перехода)
    if (animated) {
      setTimeout(() => {
        let newIndex = currentIndex;
        let needsReset = false;

        // Если дошли до клона в конце
        if (currentIndex >= N_REAL + CLONE_COUNT) {
          // Возврат к началу реальных
          newIndex = CLONE_COUNT + (currentIndex - (N_REAL + CLONE_COUNT));
          needsReset = true;
        }
        // Если дошли до клона в начале
        else if (currentIndex < CLONE_COUNT) {
          // Переход к соответствующему концу реальных
          newIndex = N_REAL + currentIndex;
          needsReset = true;
        }

        if (needsReset) {
          // Сброс без анимации
          goToIndex(newIndex, false);
        }
        isTransitioning = false;
      }, TRANSITION_DURATION_MS);
    } else {
      isTransitioning = false;
    }
  }

  /**
   * Переход к следующей карточке.
   */
  function nextCard() {
    goToIndex(currentIndex + 1);
  }

  /**
   * Переход к предыдущей карточке.
   */
  function prevCard() {
    goToIndex(currentIndex - 1);
  }

  // --- Логика Автопрокрутки и Паузы ---

  let autoScrollInterval = null;
  const SCROLL_DURATION = 4000;

  function startAutoScroll() {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(nextCard, SCROLL_DURATION);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }

  // --- Добавление обработчиков событий ---

  prevButton.addEventListener("click", () => {
    stopAutoScroll();
    prevCard();
    setTimeout(startAutoScroll, SCROLL_DURATION);
  });
  nextButton.addEventListener("click", () => {
    stopAutoScroll();
    nextCard();
    setTimeout(startAutoScroll, SCROLL_DURATION);
  });

  // Обработчики для паузы при наведении
  wrapper.addEventListener("mouseenter", stopAutoScroll);
  wrapper.addEventListener("mouseleave", startAutoScroll);

  // 4. Инициализация (показываем первую "реальную" карточку по центру)
  generateDots(); // Сначала генерируем точки
  goToIndex(currentIndex, false); // Установка начального положения без анимации
  startAutoScroll();

  // Пересчитываем центровку при изменении размера окна (для адаптивности)
  window.addEventListener("resize", () => {
    // Пересчитываем текущее положение при ресайзе (без анимации)
    goToIndex(currentIndex, false);
  });
}

// --- 3. Инициализация при Загрузке Страницы ---
window.onload = function () {
  // Инициализация иконок Lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  generateOfferCards();
  generateUserCards();
  initManualOffersCarousel();

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};
