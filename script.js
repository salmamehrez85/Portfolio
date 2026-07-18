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
});
