document.addEventListener("DOMContentLoaded", () => {
  function updateNavView() {
    const headerInner = document.querySelector(".header__inner");
    if (window.scrollY > 20) {
      console.log("active");
      headerInner.classList.add("active");
    } else {
      console.log("inactive");
      headerInner.classList.remove("active");
    }
  }

  window.addEventListener("scroll", updateNavView);
  updateNavView();

  // ************************************* about secton

  const paragraph = document.querySelector(".about-section p");

  // Split lines into spans
  const lines = paragraph.innerHTML
    .split(/<br\s*\/?>/i)
    .map((line) => `<span>${line.trim()}</span>`)
    .join("");
  paragraph.innerHTML = lines;

  const spans = paragraph.querySelectorAll("span");

  const startColor = "#85b5b0";
  const endColor = "#314d4e";

  function lerpColor(color1, color2, t) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;
    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function updateTextColors() {
    const viewHeight = window.innerHeight;
    const centerY = viewHeight / 2;

    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const lineCenter = rect.top + rect.height / 2;

      // Smooth transition near the center (50px buffer)
      const buffer = 50;
      const distance = lineCenter - centerY;

      if (distance <= -buffer) {
        // Line has passed above center — keep dark
        span.style.color = endColor;
        span.dataset.active = "true";
      } else if (distance >= buffer) {
        // Line is below center — keep light
        span.style.color = startColor;
        span.dataset.active = "false";
      } else {
        // Within buffer range around center — smooth transition
        const t = 1 - Math.abs(distance / buffer);
        const color = lerpColor(startColor, endColor, t);
        span.style.color = color;
      }
    });
  }

  window.addEventListener("scroll", updateTextColors);
  window.addEventListener("resize", updateTextColors);
  updateTextColors();

  //   product section

  const slider = document.getElementById("slider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;
  let cardsPerView = 3;

  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 768) {
      cardsPerView = 2;
    } else if (width <= 991) {
      cardsPerView = 3;
    } else {
      cardsPerView = 3;
    }
  }

  function updateSlider() {
    const cards = document.querySelectorAll(".bottle-card");
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;
    const width = window.innerWidth;

    // Detect tablet/mobile (<1024px)
    const isMobileOrTab = width < 1024;

    // Placement logic
    if (isMobileOrTab) {
      if (width < 500) {
        const totalCards = cards.length;
        const wrapperWidth = slider.parentElement.offsetWidth;
        const totalSliderWidth = totalCards * (cardWidth + gap) - gap; // exclude last gap
        const maxTranslate = Math.max(0, totalSliderWidth - wrapperWidth);

        // Calculate how far to slide
        let translateX = currentIndex * (cardWidth + gap);

        // Clamp the value so you never scroll too far
        translateX = Math.min(Math.max(0, translateX), maxTranslate);

        // Apply final transform with a smooth transition
        slider.style.transform = `translateX(-${translateX}px)`;
        slider.style.transition = "transform 0.4s ease";
      } else
        slider.style.transform = `translateX(calc(-${
          currentIndex * (cardWidth + gap)
        }px + 20px))`;

      cards.forEach((card, i) => {
        card.classList.remove("active", "next");
        card.style.zIndex = "0";
        if (i === currentIndex) {
          card.classList.add("active");
          card.style.opacity = "1";
          card.style.transform = "translateY(0)"; // No lift for active
        } else {
          card.style.opacity = "0.5";
          card.style.transform = "translateY(-15%)"; // Lift all non-active
        }
      });
    } else {
      // Desktop: center active, lift next
      const centerOffset = Math.max(
        0,
        currentIndex * (cardWidth + gap) - (slider.offsetWidth - cardWidth) / 2
      );
      slider.style.transform = `translateX(-${centerOffset}px)`;
      cards.forEach((card, i) => {
        card.classList.remove("active", "next");
        card.style.opacity = "0.5";
        card.style.transform = "translateY(0)";
        card.style.zIndex = "0";
        if (i === currentIndex) {
          card.classList.add("active");
          card.style.opacity = "1";
          card.style.transform = "translateY(-23%)";
          card.style.zIndex = "2";
        } else if (i === currentIndex + 1 && currentIndex < cards.length - 1) {
          card.classList.add("next");
          card.style.opacity = "0.5";
          card.style.transform = "translateY(-15%)";
          card.style.zIndex = "1";
        }
      });
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - 1;
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    const cards = document.querySelectorAll(".bottle-card");
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener("resize", () => {
    updateCardsPerView();
    currentIndex = 0;
    updateSlider();
  });

  updateCardsPerView();
  updateSlider();

  //   Image hover animation
  const animatedImages = document.querySelectorAll(".hover-image-animation");

  animatedImages.forEach((img) => {
    const imageSet = JSON.parse(img.dataset.imageSets.replace(/'/g, '"'));
    let currentIndex = 0;
    let intervalId = null;

    const startAnimation = () => {
      if (intervalId) return; // prevent multiple intervals
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % imageSet.length;
        img.src = `assets/images/product/${imageSet[currentIndex]}`;
      }, 300); // change speed here (milliseconds)
    };

    const stopAnimation = () => {
      clearInterval(intervalId);
      intervalId = null;
      currentIndex = 0;
      img.src = `assets/images/product/${imageSet[0]}`; // reset to first image
    };

    img.closest(".bottle-card").addEventListener("mouseenter", startAnimation);
    img.closest(".bottle-card").addEventListener("mouseleave", stopAnimation);
  });
});
