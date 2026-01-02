document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Close mobile menu when clicking links
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
    } else {
      header.style.boxShadow = "none";
    }
  });

  // ============================================
  // SUPPORT CATEGORY MODAL
  // ============================================
  const supportCategories = document.querySelectorAll(".support-category");
  const categoryModal = document.getElementById("categoryModal");
  const modalClose = document.getElementById("modalClose");
  const closeModalBtn = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");

  const categoryInfo = {
    account: {
      title: "Account Management",
      description:
        "Manage your RideFair account settings, security, and preferences. Reset passwords, update profile information, and configure privacy settings.",
    },
    payment: {
      title: "Payment & Billing",
      description:
        "Handle payment methods, view invoices, request refunds, and resolve billing issues. Secure payment processing with multiple options available.",
    },
    ride: {
      title: "Ride Management",
      description:
        "Book, modify, or cancel rides. Communicate with drivers, change routes, and manage ongoing trips. Real-time tracking and ETA updates.",
    },
    safety: {
      title: "Safety & Reporting",
      description:
        "Report safety concerns, access emergency assistance, and learn about safety features. All reports are confidential and handled with priority.",
    },
  };

  supportCategories.forEach((category) => {
    category.addEventListener("click", function () {
      const categoryType = this.getAttribute("data-category");
      const info = categoryInfo[categoryType];

      if (info) {
        modalTitle.textContent = info.title;
        modalDescription.textContent = info.description;
        categoryModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal functions
  const closeModal = () => {
    categoryModal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  modalClose.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("click", closeModal);

  categoryModal.addEventListener("click", (e) => {
    if (e.target === categoryModal) {
      closeModal();
    }
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqHeaders = document.querySelectorAll(".faq-header");

  faqHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains("active");

      // Close all other FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  // Chat widget removed; functionality replaced with email/call links.

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // ============================================
  // SMOOTH SCROLLING
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#" && href !== "index.html") {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ============================================
  // SET CURRENT YEAR IN FOOTER
  // ============================================
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  // ============================================
  // ENHANCED CONTACT CARDS
  // ============================================
  const contactCards = document.querySelectorAll(".channel-card");

  contactCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });

  // ============================================
  // THEME MANAGER INITIALIZATION
  // ============================================
  // Initialize theme manager if ThemeManager class is available from script.js
  if (typeof ThemeManager !== "undefined") {
    new ThemeManager();
  }

  // ============================================
  // INITIALIZATION LOG
  // ============================================
  console.log("✨ Professional Contact & Support page loaded successfully!");
});
