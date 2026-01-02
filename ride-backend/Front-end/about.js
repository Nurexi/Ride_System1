document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // PARTICLE ANIMATION
  // ============================================
  const canvas = document.getElementById("particleCanvas")
  const ctx = canvas.getContext("2d")
  const pageHeader = document.querySelector(".page-header")

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = pageHeader.offsetHeight
    }
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2 + 1
      this.speedX = Math.random() * 0.5 - 0.25
      this.speedY = Math.random() * 0.5 - 0.25
      this.opacity = Math.random() * 0.5 + 0.3
      this.color = Math.random() > 0.5 ? "#C1F11D" : "#a8d600"
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1

      this.x = Math.max(0, Math.min(canvas.width, this.x))
      this.y = Math.max(0, Math.min(canvas.height, this.y))
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  const particles = []
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })

    requestAnimationFrame(animateParticles)
  }

  animateParticles()

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY

    if (scrollTop > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    lastScrollTop = scrollTop
  })

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const mobileMenu = document.getElementById("mobileMenu")
  const mobileMenuClose = document.getElementById("mobileMenuClose")

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    document.body.style.overflow = "auto"
  })

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  })

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  })

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  const statValues = document.querySelectorAll(".stat-value[data-count]")

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute("data-count"))
    let count = 0
    const increment = target / 100

    const timer = setInterval(() => {
      count += increment
      if (count >= target) {
        element.textContent = target + "+"
        clearInterval(timer)
      } else {
        element.textContent = Math.floor(count) + "+"
      }
    }, 20)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  statValues.forEach((stat) => {
    observer.observe(stat)
  })

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up")

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
        }
      })
    },
    { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
  )

  revealElements.forEach((element) => {
    revealObserver.observe(element)
  })

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      if (href !== "#") {
        e.preventDefault()

        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          mobileMenu.classList.remove("active")
          document.body.style.overflow = "auto"

          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // ============================================
  // SET CURRENT YEAR IN FOOTER
  // ============================================
  const currentYear = new Date().getFullYear()
  const yearElement = document.getElementById("currentYear")
  if (yearElement) {
    yearElement.textContent = currentYear
  }

  console.log("✨ About Us page loaded successfully with enhanced animations!")
})
