// Theme switching functionality
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle click handler
  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (theme === "light") {
      themeIcon.className = "bx bx-moon";
    } else {
      themeIcon.className = "bx bx-sun";
    }
  }
});

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");

  menuIcon.addEventListener("click", function () {
    navbar.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".navbar a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navbar.classList.remove("active");
    });
  });
});

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

// Active navigation highlighting
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Projects interactivity (video hover and video modal)
document.addEventListener("DOMContentLoaded", function () {
  // 1. Card Video Hover Playback
  const projectCards = document.querySelectorAll(".project-card");
  
  projectCards.forEach((card) => {
    const video = card.querySelector(".project-media video");
    if (!video) return;

    card.addEventListener("mouseenter", () => {
      // Play the video on hover. Catch errors to handle missing video files gracefully.
      video.play().catch((err) => {
        // Silently catch error since video path might be placeholder
        console.log("Hover video playback failed or not supported:", err);
      });
    });

    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // 2. Video Demo Modal
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const modalIframe = document.getElementById("modal-iframe");
  const closeBtn = document.querySelector(".close-modal");
  const watchDemoBtns = document.querySelectorAll(".watch-demo-btn");

  if (modal && modalVideo && modalIframe) {
    // Open Modal
    watchDemoBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid triggering any other click events
        let videoSrc = btn.getAttribute("data-video");
        if (videoSrc) {
          if (videoSrc.includes("drive.google.com")) {
            // Convert Google Drive view URL to embeddable preview URL
            videoSrc = videoSrc.replace("/view", "/preview").split("?")[0];
            
            modalVideo.style.display = "none";
            modalIframe.style.display = "block";
            modalIframe.setAttribute("src", videoSrc);
          } else {
            modalIframe.style.display = "none";
            modalIframe.setAttribute("src", "");
            modalVideo.style.display = "block";
            modalVideo.querySelector("source").setAttribute("src", videoSrc);
            modalVideo.load(); // Reload video with new source

            modalVideo.play().catch((err) => {
              console.log("Modal video playback failed:", err);
            });
          }
          
          modal.style.display = "flex";
          // Trigger reflow for CSS transitions
          void modal.offsetWidth; 
          modal.classList.add("show");
        }
      });
    });

    // Close Modal Function
    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        modalVideo.pause();
        modalVideo.querySelector("source").setAttribute("src", "");
        modalVideo.load();
        modalVideo.style.display = "none";
        modalIframe.setAttribute("src", "");
        modalIframe.style.display = "none";
      }, 300); // Wait for CSS opacity transition to complete
    };

    // Close on click close button
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Close on click outside modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  // 3. Image Showcase Slideshow Modal (for OSTR)
  const showcaseModal = document.getElementById("showcase-modal");
  const closeShowcase = document.querySelector(".close-showcase");
  const viewShowcaseBtns = document.querySelectorAll(".view-showcase-btn");
  const slides = document.querySelectorAll(".my-slide");
  const prevBtn = document.querySelector(".prev-slide");
  const nextBtn = document.querySelector(".next-slide");
  const slideIndicator = document.querySelector(".slide-indicator");

  if (showcaseModal && slides.length > 0) {
    let currentSlideIndex = 0;

    const showSlide = (index) => {
      // Loop boundaries
      if (index >= slides.length) currentSlideIndex = 0;
      else if (index < 0) currentSlideIndex = slides.length - 1;
      else currentSlideIndex = index;

      // Hide all, show active
      slides.forEach((slide) => slide.classList.remove("active"));
      slides[currentSlideIndex].classList.add("active");

      // Update indicator
      if (slideIndicator) {
        slideIndicator.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
      }
    };

    // Open Showcase Modal
    viewShowcaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showcaseModal.style.display = "flex";
        void showcaseModal.offsetWidth;
        showcaseModal.classList.add("show");
        showSlide(0); // Start from first slide
      });
    });

    // Close Showcase Modal
    const closeShowcaseModal = () => {
      showcaseModal.classList.remove("show");
      setTimeout(() => {
        showcaseModal.style.display = "none";
      }, 300);
    };

    if (closeShowcase) {
      closeShowcase.addEventListener("click", closeShowcaseModal);
    }

    showcaseModal.addEventListener("click", (e) => {
      if (e.target === showcaseModal) {
        closeShowcaseModal();
      }
    });

    // Previous / Next Slide click handlers
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(currentSlideIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(currentSlideIndex + 1);
      });
    }

    // Keyboard navigation (arrows + Esc)
    window.addEventListener("keydown", (e) => {
      if (showcaseModal.classList.contains("show")) {
        if (e.key === "ArrowLeft") {
          showSlide(currentSlideIndex - 1);
        } else if (e.key === "ArrowRight") {
          showSlide(currentSlideIndex + 1);
        } else if (e.key === "Escape") {
          closeShowcaseModal();
        }
      }
    });
  }

  // 4. Image Showcase Slideshow Modal (for Programa)
  const programaShowcaseModal = document.getElementById("programa-showcase-modal");
  const closeProgramaShowcase = document.querySelector(".close-programa-showcase");
  const viewProgramaShowcaseBtns = document.querySelectorAll(".view-programa-showcase-btn");
  const programaSlides = document.querySelectorAll(".programa-slide");
  const prevProgramaBtn = document.querySelector(".prev-programa-slide");
  const nextProgramaBtn = document.querySelector(".next-programa-slide");
  const programaSlideIndicator = document.querySelector(".programa-slide-indicator");

  if (programaShowcaseModal && programaSlides.length > 0) {
    let currentProgramaSlideIndex = 0;

    const showProgramaSlide = (index) => {
      // Loop boundaries
      if (index >= programaSlides.length) currentProgramaSlideIndex = 0;
      else if (index < 0) currentProgramaSlideIndex = programaSlides.length - 1;
      else currentProgramaSlideIndex = index;

      // Hide all, show active
      programaSlides.forEach((slide) => slide.classList.remove("active"));
      programaSlides[currentProgramaSlideIndex].classList.add("active");

      // Update indicator
      if (programaSlideIndicator) {
        programaSlideIndicator.textContent = `${currentProgramaSlideIndex + 1} / ${programaSlides.length}`;
      }
    };

    // Open Showcase Modal
    viewProgramaShowcaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        programaShowcaseModal.style.display = "flex";
        void programaShowcaseModal.offsetWidth;
        programaShowcaseModal.classList.add("show");
        showProgramaSlide(0); // Start from first slide
      });
    });

    // Close Showcase Modal
    const closeProgramaShowcaseModal = () => {
      programaShowcaseModal.classList.remove("show");
      setTimeout(() => {
        programaShowcaseModal.style.display = "none";
      }, 300);
    };

    if (closeProgramaShowcase) {
      closeProgramaShowcase.addEventListener("click", closeProgramaShowcaseModal);
    }

    programaShowcaseModal.addEventListener("click", (e) => {
      if (e.target === programaShowcaseModal) {
        closeProgramaShowcaseModal();
      }
    });

    // Previous / Next Slide click handlers
    if (prevProgramaBtn) {
      prevProgramaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showProgramaSlide(currentProgramaSlideIndex - 1);
      });
    }

    if (nextProgramaBtn) {
      nextProgramaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showProgramaSlide(currentProgramaSlideIndex + 1);
      });
    }

    // Keyboard navigation (arrows + Esc)
    window.addEventListener("keydown", (e) => {
      if (programaShowcaseModal.classList.contains("show")) {
        if (e.key === "ArrowLeft") {
          showProgramaSlide(currentProgramaSlideIndex - 1);
        } else if (e.key === "ArrowRight") {
          showProgramaSlide(currentProgramaSlideIndex + 1);
        } else if (e.key === "Escape") {
          closeProgramaShowcaseModal();
        }
      }
    });
  }

  // 5. Image Showcase Slideshow Modal (for CrossBorder)
  const crossborderShowcaseModal = document.getElementById("crossborder-showcase-modal");
  const closeCrossborderShowcase = document.querySelector(".close-crossborder-showcase");
  const viewCrossborderShowcaseBtns = document.querySelectorAll(".view-crossborder-showcase-btn");
  const crossborderSlides = document.querySelectorAll(".crossborder-slide");
  const prevCrossborderBtn = document.querySelector(".prev-crossborder-slide");
  const nextCrossborderBtn = document.querySelector(".next-crossborder-slide");
  const crossborderSlideIndicator = document.querySelector(".crossborder-slide-indicator");

  if (crossborderShowcaseModal && crossborderSlides.length > 0) {
    let currentCrossborderSlideIndex = 0;

    const showCrossborderSlide = (index) => {
      if (index >= crossborderSlides.length) currentCrossborderSlideIndex = 0;
      else if (index < 0) currentCrossborderSlideIndex = crossborderSlides.length - 1;
      else currentCrossborderSlideIndex = index;

      crossborderSlides.forEach((slide) => slide.classList.remove("active"));
      crossborderSlides[currentCrossborderSlideIndex].classList.add("active");

      if (crossborderSlideIndicator) {
        crossborderSlideIndicator.textContent = `${currentCrossborderSlideIndex + 1} / ${crossborderSlides.length}`;
      }
    };

    // Open Showcase Modal
    viewCrossborderShowcaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        crossborderShowcaseModal.style.display = "flex";
        void crossborderShowcaseModal.offsetWidth;
        crossborderShowcaseModal.classList.add("show");
        showCrossborderSlide(0);
      });
    });

    // Close Showcase Modal
    const closeCrossborderShowcaseModal = () => {
      crossborderShowcaseModal.classList.remove("show");
      setTimeout(() => {
        crossborderShowcaseModal.style.display = "none";
      }, 300);
    };

    if (closeCrossborderShowcase) {
      closeCrossborderShowcase.addEventListener("click", closeCrossborderShowcaseModal);
    }

    crossborderShowcaseModal.addEventListener("click", (e) => {
      if (e.target === crossborderShowcaseModal) {
        closeCrossborderShowcaseModal();
      }
    });

    // Previous / Next Slide click handlers
    if (prevCrossborderBtn) {
      prevCrossborderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showCrossborderSlide(currentCrossborderSlideIndex - 1);
      });
    }

    if (nextCrossborderBtn) {
      nextCrossborderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showCrossborderSlide(currentCrossborderSlideIndex + 1);
      });
    }

    // Keyboard navigation (arrows + Esc)
    window.addEventListener("keydown", (e) => {
      if (crossborderShowcaseModal.classList.contains("show")) {
        if (e.key === "ArrowLeft") {
          showCrossborderSlide(currentCrossborderSlideIndex - 1);
        } else if (e.key === "ArrowRight") {
          showCrossborderSlide(currentCrossborderSlideIndex + 1);
        } else if (e.key === "Escape") {
          closeCrossborderShowcaseModal();
        }
      }
    });
  }

  // 4. Project Card "Read More" toggles
  const showMoreBtns = document.querySelectorAll(".show-more-btn");
  showMoreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".project-info");
      const details = parent.querySelector(".project-details-more");
      
      if (details.classList.contains("expanded")) {
        details.classList.remove("expanded");
        btn.innerHTML = `Read More <i class="bx bx-chevron-down"></i>`;
      } else {
        details.classList.add("expanded");
        btn.innerHTML = `Read Less <i class="bx bx-chevron-up"></i>`;
      }
    });
  });
});

/* ============================================================
   ANIMATION ORCHESTRATION
   1. Hero stagger on load
   2. Intersection Observer scroll-reveals for every section
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ── 1. HERO STAGGER ──────────────────────────────────────────
  // Add .hero-animate to every direct child of home-content + the image
  // so animations.css picks them up immediately on page load.
  const heroChildren = document.querySelectorAll(
    ".home-content h1, .home-content .text-animation, .home-content > p, .home-content .btn-group"
  );
  heroChildren.forEach(el => el.classList.add("hero-animate"));

  const homeImg = document.querySelector(".home-img");
  if (homeImg) homeImg.classList.add("hero-animate");

  // ── 2. INTERSECTION OBSERVER FACTORY ────────────────────────
  /**
   * Creates an IntersectionObserver that adds .revealed to each target
   * when it enters the viewport, then stops watching it.
   * @param {string}  selector   - CSS selector for elements to observe
   * @param {number}  threshold  - 0–1, fraction of element visible before firing
   * @param {boolean} stagger    - if true, nth-child delay is set inline (100ms steps)
   * @param {string}  childClass - if set, .revealed is applied to this child instead
   */
  function createObserver(selector, threshold = 0.15, stagger = false, childClass = null) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = childClass
          ? entry.target.querySelector(childClass)
          : entry.target;

        if (target) {
          target.classList.add("revealed");
        }

        observer.unobserve(entry.target);
      });
    }, { threshold });

    elements.forEach((el, i) => {
      // Apply stagger delay inline so CSS transition picks it up
      if (stagger) {
        const delayTarget = childClass ? el.querySelector(childClass) : el;
        if (delayTarget) {
          delayTarget.style.transitionDelay = `${i * 0.10}s`;
        }
      }
      observer.observe(el);
    });
  }

  // ── 3. SECTION TITLE ACCENTS ──────────────────────────────────
  // Wrap every section title so the underline accent can be revealed
  document.querySelectorAll(
    ".projects h2, .experience h1, .skills h2, .education h1, .contact h1"
  ).forEach(el => {
    el.classList.add("title-accent");
  });

  createObserver(
    ".projects h2, .experience h1, .skills h2, .education h1, .contact h1",
    0.5, false, null
  );

  // ── 4. PROJECT CARDS — staggered grid ─────────────────────────
  createObserver(".project-card", 0.12, true);

  // ── 5. EXPERIENCE TIMELINE ITEMS ─────────────────────────────
  createObserver(".timeline-item.left",  0.20, false, ".content");
  createObserver(".timeline-item.right", 0.20, false, ".content");

  // ── 6. SKILL CATEGORY CARDS — staggered ───────────────────────
  createObserver(".skill-category", 0.15, true);

  // ── 7. EDUCATION & CONTACT CARDS ─────────────────────────────
  createObserver(".education-card",  0.20, false);
  createObserver(".contact-card",    0.15, true);

  // ── 8. GENERIC .reveal / .reveal-left / .reveal-right ─────────
  createObserver(".reveal",       0.15, false);
  createObserver(".reveal-left",  0.15, false);
  createObserver(".reveal-right", 0.15, false);

});
