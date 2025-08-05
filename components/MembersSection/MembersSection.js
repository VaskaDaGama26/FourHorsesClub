export function init(element) {
  if (DEBUG) {
    console.log("MembersSection init started", element);
  }

  const carousel = element.querySelector(".section-members__carousel");
  const cards = element.querySelectorAll(".section-members__card");
  const prevBtn = element.querySelector(".section-members__btn--prev");
  const nextBtn = element.querySelector(".section-members__btn--next");
  const current = element.querySelector(".current");
  const total = element.querySelector(".total");

  const totalCards = cards.length;
  total.textContent = totalCards;

  let index = 0;
  let cardsPerView = 1;
  const gap = 20;
  let autoScrollInterval;

  function getCardsPerView() {
    if (window.innerWidth >= 1260) return 3;
    return 1;
  }

  function scrollToIndex(i) {
    const cardWidth = cards[0].offsetWidth;
    if (!cardWidth) return;
    const scrollAmount = i * (cardWidth + gap);

    carousel.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });

    index = i;
    updateControls();
  }

  function updateControls() {
    const lastVisibleCard = Math.min(index + cardsPerView, totalCards);
    current.textContent = lastVisibleCard;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = lastVisibleCard >= totalCards;
  }

  function updateView() {
    cardsPerView = getCardsPerView();

    if (index + cardsPerView > totalCards) {
      index = Math.max(0, totalCards - cardsPerView);
    }

    scrollToIndex(index);
  }

  function onScroll() {
    const cardWidth = cards[0].offsetWidth + gap;
    if (!cardWidth) return;

    const scrollLeft = carousel.scrollLeft;
    index = Math.round(scrollLeft / cardWidth);

    if (index < 0) index = 0;
    if (index > totalCards - cardsPerView) index = totalCards - cardsPerView;

    updateControls();
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (index + cardsPerView < totalCards) {
        scrollToIndex(index + cardsPerView);
      } else {
        scrollToIndex(0);
      }
    }, 4000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);

  window.addEventListener("resize", () => {
    cardsPerView = getCardsPerView();
    updateView();
  });

  nextBtn.addEventListener("click", () => {
    stopAutoScroll();
    if (index + cardsPerView < totalCards) {
      scrollToIndex(index + cardsPerView);
    }
  });

  prevBtn.addEventListener("click", () => {
    stopAutoScroll();
    if (index - cardsPerView >= 0) {
      scrollToIndex(index - cardsPerView);
    } else {
      scrollToIndex(0);
    }
  });

  window.addEventListener("load", () => {
    updateView();
    startAutoScroll();
  });

  carousel.addEventListener("scroll", onScroll);
}
