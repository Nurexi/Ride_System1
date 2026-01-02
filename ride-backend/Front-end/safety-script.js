// ============================================
// Safety Page JavaScript Functionality
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚗 RideFair Safety page loaded successfully!");

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // ============================================
  // SAFETY PHONE UI INTERACTIVITY
  // ============================================
  const safetyPhoneBtn = document.querySelector(".safety-phone-btn");
  if (safetyPhoneBtn) {
    safetyPhoneBtn.addEventListener("click", () => {
      // Create a temporary confirmation message
      const originalText = safetyPhoneBtn.textContent;
      safetyPhoneBtn.textContent = "Trip Shared!";
      safetyPhoneBtn.style.background =
        "linear-gradient(135deg, #4CAF50, #45a049)";

      // Reset after 2 seconds
      setTimeout(() => {
        safetyPhoneBtn.textContent = originalText;
        safetyPhoneBtn.style.background =
          "linear-gradient(135deg, var(--neon-green), #a8d600)";
      }, 2000);

      // Optional: Show a subtle notification
      showNotification("Trip status shared with your emergency contacts");
    });
  }

  // ============================================
  // SAFETY FEATURE CARDS HOVER EFFECTS
  // ============================================
  const safetyFeatureCards = document.querySelectorAll(".safety-feature-card");

  safetyFeatureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // ============================================
  // EMERGENCY BUTTON PULSE EFFECT
  // ============================================
  const emergencyBtn = document.querySelector(".emergency-btn");
  if (emergencyBtn) {
    // Add a subtle pulse animation
    emergencyBtn.style.animation = "neon-pulse 3s infinite";

    emergencyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("Connecting you to our safety support team...");

      // Simulate a brief delay before redirect
      setTimeout(() => {
        window.location.href = "contact.html";
      }, 1500);
    });
  }

  // ============================================
  // SAFETY TIPS INTERACTIVITY
  // ============================================
  const safetyTips = document.querySelectorAll(".safety-tip");

  safetyTips.forEach((tip) => {
    tip.addEventListener("click", function () {
      const tipTitle = this.querySelector("h3").textContent;
      const tipDesc = this.querySelector("p").textContent;

      // Create a more detailed view (could be expanded to a modal)
      showNotification(
        `Safety Tip: ${tipTitle} - ${tipDesc.substring(0, 60)}...`
      );
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
  // HELPER FUNCTION: SHOW NOTIFICATION
  // ============================================
  function showNotification(message) {
    // Check if notification already exists
    let notification = document.querySelector(".notification");

    if (!notification) {
      // Create notification element
      notification = document.createElement("div");
      notification.className = "notification";
      notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, var(--neon-green), #a8d600);
                color: #000;
                padding: 15px 20px;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                font-weight: 600;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
      document.body.appendChild(notification);
    }

    // Set message and show
    notification.textContent = message;
    notification.style.transform = "translateX(0)";

    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(120%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#" && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    });
  });
});
