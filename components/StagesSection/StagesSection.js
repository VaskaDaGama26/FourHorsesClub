export function init(element) {
  if (DEBUG) {
    console.log("MembersSection init started", element);
  }

  const slider = element.querySelector(".section-stages__slider--mobile");
  const cards = slider?.querySelectorAll(".section-stages__card--mobile");
  const dotsContainer = element.querySelector(".section-stages__dots");
  const btnPrev = element.querySelector(".section-stages__arrow--prev");
  const btnNext = element.querySelector(".section-stages__arrow--next");

  if (
    !slider ||
    !cards ||
    cards.length === 0 ||
    !dotsContainer ||
    !btnPrev ||
    !btnNext
  )
    return;

  const totalSlides = cards.length;
  let currentSlide = 0;

  function getCardOffset(i) {
    const card = cards[i];
    const cardRect = card.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();
    return cardRect.left - sliderRect.left + slider.scrollLeft;
  }

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    dot.classList.add("section-stages__dot");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Слайд ${i + 1}`);
    dotsContainer.appendChild(dot);
    dot.addEventListener("click", () => {
      slider.scrollTo({
        left: getCardOffset(i),
        behavior: "smooth",
      });
    });
  }

  const dots = dotsContainer.querySelectorAll(".section-stages__dot");

  const updateDots = (index) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  const updateArrows = () => {
    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1;

    btnPrev.classList.toggle("disabled", currentSlide === 0);
    btnNext.classList.toggle("disabled", currentSlide === totalSlides - 1);
  };

  const updateCurrentSlide = () => {
    const scrollLeft = slider.scrollLeft;
    let closestIndex = 0;
    let minDistance = Math.abs(scrollLeft - getCardOffset(0));

    cards.forEach((_, index) => {
      const distance = Math.abs(scrollLeft - getCardOffset(index));
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    currentSlide = closestIndex;
    updateDots(currentSlide);
    updateArrows();
  };

  btnPrev.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      slider.scrollTo({
        left: getCardOffset(currentSlide),
        behavior: "smooth",
      });
    }
  });

  btnNext.addEventListener("click", () => {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      slider.scrollTo({
        left: getCardOffset(currentSlide),
        behavior: "smooth",
      });
    }
  });

  slider.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateCurrentSlide);
  });

  window.addEventListener("resize", () => {
    slider.scrollTo({
      left: getCardOffset(currentSlide),
    });
  });

  updateArrows();
}
