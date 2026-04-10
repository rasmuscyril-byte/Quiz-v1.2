/* ==========================================================================
   AI over tid – Præsentation
   Navigation: pile-knapper, piletaster, snap-scroll, prikker
   ========================================================================== */

(function () {
  "use strict";

  const slidesContainer = document.getElementById("slides");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const prevBtn = document.getElementById("navPrev");
  const nextBtn = document.getElementById("navNext");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const currentSlideEl = document.getElementById("currentSlide");
  const totalSlidesEl = document.getElementById("totalSlides");
  const progressFill = document.getElementById("progressFill");

  let currentIndex = 0;
  let isScrolling = false;
  let scrollTimeout = null;

  totalSlidesEl.textContent = String(slides.length);

  /* ---------- Navigate to a specific slide ---------- */
  function goToSlide(index, smooth = true) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;

    isScrolling = true;
    slidesContainer.scrollTo({
      top: index * window.innerHeight,
      behavior: smooth ? "smooth" : "auto",
    });

    updateUI();

    // Release lock after scroll transition completes
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 900);
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  /* ---------- Update UI state (dots, counter, progress, active class) ---------- */
  function updateUI() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    currentSlideEl.textContent = String(currentIndex + 1);

    const progress = ((currentIndex + 1) / slides.length) * 100;
    progressFill.style.width = progress + "%";

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;
  }

  /* ---------- Click handlers ---------- */
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  if (startBtn) {
    startBtn.addEventListener("click", () => goToSlide(1));
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => goToSlide(0));
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.slide, 10);
      goToSlide(index);
    });
  });

  /* ---------- Keyboard navigation ---------- */
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ": // space bar
        e.preventDefault();
        nextSlide();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        prevSlide();
        break;
      case "Home":
        e.preventDefault();
        goToSlide(0);
        break;
      case "End":
        e.preventDefault();
        goToSlide(slides.length - 1);
        break;
    }
  });

  /* ---------- Track active slide on native scroll (snap) ---------- */
  let scrollRafPending = false;
  slidesContainer.addEventListener("scroll", () => {
    if (isScrolling || scrollRafPending) return;
    scrollRafPending = true;

    requestAnimationFrame(() => {
      const newIndex = Math.round(slidesContainer.scrollTop / window.innerHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
        currentIndex = newIndex;
        updateUI();
      }
      scrollRafPending = false;
    });
  });

  /* ---------- Debounce wheel for a nicer "slide deck" feel ---------- */
  let wheelLock = false;
  slidesContainer.addEventListener(
    "wheel",
    (e) => {
      if (wheelLock) return;
      // Only intercept when the delta is meaningful (trackpads: small deltas)
      if (Math.abs(e.deltaY) < 20) return;

      wheelLock = true;
      setTimeout(() => {
        wheelLock = false;
      }, 800);

      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      e.preventDefault();
    },
    { passive: false }
  );

  /* ---------- Touch swipe for mobile ---------- */
  let touchStartY = null;
  let touchStartX = null;

  slidesContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slidesContainer.addEventListener(
    "touchend",
    (e) => {
      if (touchStartY === null) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;

      // Only treat as slide-swipe if vertical motion dominates and is large
      if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
        if (dy < 0) nextSlide();
        else prevSlide();
      }
      touchStartY = null;
      touchStartX = null;
    },
    { passive: true }
  );

  /* ---------- Recalculate on resize ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-align to current slide (viewport height can change on mobile)
      slidesContainer.scrollTo({
        top: currentIndex * window.innerHeight,
        behavior: "auto",
      });
    }, 150);
  });

  /* ---------- Init ---------- */
  goToSlide(0, false);
  // Ensure first slide is marked active even before any scroll
  requestAnimationFrame(updateUI);
})();
