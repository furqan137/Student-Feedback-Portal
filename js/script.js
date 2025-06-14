// Student Feedback Portal JavaScript

class FeedbackPortal {
  constructor() {
    this.feedbackData = this.loadFeedbackFromStorage()
    this.favoritesData = this.loadFavoritesFromStorage()
    this.filteredData = [...this.feedbackData]
    this.currentEditId = null
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.displayExistingFeedback()
    this.updateStats()
    this.updateFavoritesCount()
    this.initializeAnimations()
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.setupMobileMenu()

    // Form submission
    const form = document.getElementById("feedback-form")
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmission(e))
    }

    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleContactFormSubmission(e))
    }

    // Edit form submission
    const editForm = document.getElementById("edit-form")
    if (editForm) {
      editForm.addEventListener("submit", (e) => this.handleEditFormSubmission(e))
    }

    // Real-time validation
    this.setupFormValidation()

    // Search and filter functionality
    this.setupSearchAndFilter()

    // Modal functionality
    this.setupModals()

    // Favorites functionality
    this.setupFavorites()

    // FAQ functionality
    this.setupFAQ()

    // Smooth scrolling
    this.setupSmoothScrolling()

    // Character counting
    this.setupCharacterCounting()

    // Header scroll effect
    this.setupHeaderScrollEffect()
  }

  setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active")
        navMenu.classList.toggle("active")
      })

      // Close mobile menu when clicking on a link
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
        })
      })

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
        }
      })
    }
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  setupSearchAndFilter() {
    const searchInput = document.getElementById("search-feedback")
    const ratingFilter = document.getElementById("rating-filter")
    const sortSelect = document.getElementById("sort-feedback")
    const showFavoritesBtn = document.getElementById("show-favorites")

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterFeedback())
    }

    if (ratingFilter) {
      ratingFilter.addEventListener("change", () => this.filterFeedback())
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => this.filterFeedback())
    }

    if (showFavoritesBtn) {
      showFavoritesBtn.addEventListener("click", () => this.toggleFavoritesView())
    }
  }

  setupModals() {
    // Modal close functionality
    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal")
        this.closeModal(modal)
      })
    })

    // Close modal when clicking outside
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal)
        }
      })
    })

    // Escape key to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal.show").forEach((modal) => {
          this.closeModal(modal)
        })
      }
    })
  }

  setupFavorites() {
    const favoritesBtn = document.getElementById("favorites-btn")
    const footerFavorites = document.getElementById("footer-favorites")

    if (favoritesBtn) {
      favoritesBtn.addEventListener("click", () => this.showFavoritesModal())
    }

    if (footerFavorites) {
      footerFavorites.addEventListener("click", (e) => {
        e.preventDefault()
        this.showFavoritesModal()
      })
    }
  }

  setupFAQ() {
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", () => {
        const faqItem = question.parentElement
        const isActive = faqItem.classList.contains("active")

        // Close all FAQ items
        document.querySelectorAll(".faq-item").forEach((item) => {
          item.classList.remove("active")
        })

        // Open clicked item if it wasn't active
        if (!isActive) {
          faqItem.classList.add("active")
        }
      })
    })
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          const headerOffset = 100
          const elementPosition = target.offsetTop
          const offsetPosition = elementPosition - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }

  setupCharacterCounting() {
    const feedbackTextarea = document.getElementById("feedback")
    const charCount = document.getElementById("char-count")
    const messageTextarea = document.getElementById("message")
    const messageCharCount = document.getElementById("message-char-count")

    if (feedbackTextarea && charCount) {
      feedbackTextarea.addEventListener("input", () => {
        const count = feedbackTextarea.value.length
        charCount.textContent = count
        charCount.style.color = count > 450 ? "var(--error-color)" : "var(--text-light)"
      })
    }

    if (messageTextarea && messageCharCount) {
      messageTextarea.addEventListener("input", () => {
        const count = messageTextarea.value.length
        messageCharCount.textContent = count
        messageCharCount.style.color = count > 900 ? "var(--error-color)" : "var(--text-light)"
      })
    }
  }

  setupHeaderScrollEffect() {
    let lastScrollTop = 0
    const header = document.querySelector(".header")

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      if (scrollTop > 100) {
        header.style.background = "rgba(255, 255, 255, 0.98)"
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
      } else {
        header.style.background = "rgba(255, 255, 255, 0.95)"
        header.style.boxShadow = "none"
      }

      // Hide/show header on scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = "translateY(-100%)"
      } else {
        header.style.transform = "translateY(0)"
      }

      lastScrollTop = scrollTop
    })
  }

  initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running"
        }
      })
    }, observerOptions)

    document.querySelectorAll(".animate-fade-up, .animate-slide-up").forEach((el) => {
      el.style.animationPlayState = "paused"
      observer.observe(el)
    })

    // Counter animation
    this.animateCounters()
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString()
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toLocaleString()
        }
      }

      // Start animation when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter()
            observer.unobserve(entry.target)
          }
        })
      })

      observer.observe(counter)
    })
  }

  handleFormSubmission(e) {
    e.preventDefault()

    const formData = this.getFormData()
    const isValid = this.validateForm(formData)

    if (isValid) {
      this.submitFeedback(formData)
    }
  }

  handleContactFormSubmission(e) {
    e.preventDefault()

    const formData = this.getContactFormData()
    const isValid = this.validateContactForm(formData)

    if (isValid) {
      this.submitContactForm(formData)
    }
  }

  handleEditFormSubmission(e) {
    e.preventDefault()

    const formData = this.getEditFormData()
    const isValid = this.validateEditForm(formData)

    if (isValid) {
      this.updateFeedback(formData)
    }
  }

  getFormData() {
    return {
      fullName: document.getElementById("fullName").value.trim(),
      courseName: document.getElementById("courseName").value.trim(),
      instructorName: document.getElementById("instructorName").value.trim(),
      rating: document.getElementById("rating").value,
      feedback: document.getElementById("feedback").value.trim(),
      timestamp: new Date().toISOString(),
    }
  }

  getContactFormData() {
    return {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value.trim(),
      newsletter: document.getElementById("newsletter").checked,
      timestamp: new Date().toISOString(),
    }
  }

  getEditFormData() {
    return {
      id: document.getElementById("edit-id").value,
      fullName: document.getElementById("edit-fullName").value.trim(),
      courseName: document.getElementById("edit-courseName").value.trim(),
      instructorName: document.getElementById("edit-instructorName").value.trim(),
      rating: document.getElementById("edit-rating").value,
      feedback: document.getElementById("edit-feedback").value.trim(),
    }
  }

  validateForm(data) {
    let isValid = true
    const fields = [
      { key: "fullName", name: "Full Name" },
      { key: "courseName", name: "Course Name" },
      { key: "instructorName", name: "Instructor Name" },
      { key: "rating", name: "Rating" },
      { key: "feedback", name: "Feedback Comments" },
    ]

    this.clearAllErrors()

    fields.forEach((field) => {
      if (!data[field.key]) {
        this.showFieldError(field.key, `${field.name} is required`)
        isValid = false
      }
    })

    // Additional validation
    if (data.fullName && data.fullName.length < 2) {
      this.showFieldError("fullName", "Full Name must be at least 2 characters")
      isValid = false
    }

    if (data.feedback && data.feedback.length < 10) {
      this.showFieldError("feedback", "Feedback must be at least 10 characters")
      isValid = false
    }

    if (data.feedback && data.feedback.length > 500) {
      this.showFieldError("feedback", "Feedback must be less than 500 characters")
      isValid = false
    }

    return isValid
  }

  validateContactForm(data) {
    let isValid = true
    const requiredFields = [
      { key: "firstName", name: "First Name" },
      { key: "lastName", name: "Last Name" },
      { key: "email", name: "Email Address" },
      { key: "subject", name: "Subject" },
      { key: "message", name: "Message" },
    ]

    this.clearAllContactErrors()

    requiredFields.forEach((field) => {
      if (!data[field.key]) {
        this.showContactFieldError(field.key, `${field.name} is required`)
        isValid = false
      }
    })

    // Email validation
    if (data.email && !this.isValidEmail(data.email)) {
      this.showContactFieldError("email", "Please enter a valid email address")
      isValid = false
    }

    // Message length validation
    if (data.message && data.message.length < 10) {
      this.showContactFieldError("message", "Message must be at least 10 characters")
      isValid = false
    }

    if (data.message && data.message.length > 1000) {
      this.showContactFieldError("message", "Message must be less than 1000 characters")
      isValid = false
    }

    return isValid
  }

  validateEditForm(data) {
    let isValid = true
    const fields = [
      { key: "edit-fullName", name: "Full Name" },
      { key: "edit-courseName", name: "Course Name" },
      { key: "edit-instructorName", name: "Instructor Name" },
      { key: "edit-rating", name: "Rating" },
      { key: "edit-feedback", name: "Feedback Comments" },
    ]

    fields.forEach((field) => {
      const value = document.getElementById(field.key).value.trim()
      if (!value) {
        this.showFieldError(field.key, `${field.name} is required`)
        isValid = false
      }
    })

    return isValid
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validateField(input) {
    const value = input.value.trim()
    const fieldName = input.name || input.id

    if (!value) {
      this.showFieldError(fieldName, `${this.getFieldDisplayName(fieldName)} is required`)
      return false
    }

    if (fieldName === "fullName" && value.length < 2) {
      this.showFieldError(fieldName, "Full Name must be at least 2 characters")
      return false
    }

    if (fieldName === "feedback" && value.length < 10) {
      this.showFieldError(fieldName, "Feedback must be at least 10 characters")
      return false
    }

    if (fieldName === "email" && !this.isValidEmail(value)) {
      this.showFieldError(fieldName, "Please enter a valid email address")
      return false
    }

    this.clearFieldError(input)
    return true
  }

  getFieldDisplayName(fieldName) {
    const displayNames = {
      fullName: "Full Name",
      courseName: "Course Name",
      instructorName: "Instructor Name",
      rating: "Rating",
      feedback: "Feedback Comments",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
    }
    return displayNames[fieldName] || fieldName
  }

  showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`)
    const inputElement = document.getElementById(fieldName)

    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }

    if (inputElement) {
      inputElement.style.borderColor = "var(--error-color)"
    }
  }

  showContactFieldError(fieldName, message) {
    this.showFieldError(fieldName, message)
  }

  clearFieldError(input) {
    const fieldName = input.name || input.id
    const errorElement = document.getElementById(`${fieldName}-error`)

    if (errorElement) {
      errorElement.style.display = "none"
    }

    input.style.borderColor = "var(--border-color)"
  }

  clearAllErrors() {
    document.querySelectorAll(".error-message").forEach((error) => {
      error.style.display = "none"
    })

    document.querySelectorAll(".form-input, .form-select, .form-textarea").forEach((input) => {
      input.style.borderColor = "var(--border-color)"
    })
  }

  clearAllContactErrors() {
    this.clearAllErrors()
  }

  async submitFeedback(data) {
    const submitButton = document.querySelector(".submit-button")
    const buttonText = submitButton.querySelector(".button-text")
    const buttonLoader = submitButton.querySelector(".button-loader")

    // Show loading state
    submitButton.disabled = true
    buttonText.style.display = "none"
    buttonLoader.style.display = "flex"

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add feedback to storage
      const newFeedback = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }

      this.feedbackData.unshift(newFeedback)
      this.saveFeedbackToStorage()
      this.displayFeedback()
      this.updateStats()
      this.resetForm()
      this.showAlert("Thank you! Your feedback has been submitted successfully.", "success")

      // Scroll to feedback section
      setTimeout(() => {
        const feedbackSection = document.getElementById("view-feedback")
        if (feedbackSection) {
          feedbackSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 500)
    } catch (error) {
      this.showAlert("An error occurred while submitting your feedback. Please try again.", "error")
    } finally {
      // Reset button state
      submitButton.disabled = false
      buttonText.style.display = "inline"
      buttonLoader.style.display = "none"
    }
  }

  async submitContactForm(data) {
    const submitButton = document.querySelector("#contact-form .submit-button")
    const buttonText = submitButton.querySelector(".button-text")
    const buttonLoader = submitButton.querySelector(".button-loader")

    // Show loading state
    submitButton.disabled = true
    buttonText.style.display = "none"
    buttonLoader.style.display = "flex"

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      this.showContactAlert("Thank you for your message! We'll get back to you within 24 hours.", "success")
      this.resetContactForm()
    } catch (error) {
      this.showContactAlert("An error occurred while sending your message. Please try again.", "error")
    } finally {
      // Reset button state
      submitButton.disabled = false
      buttonText.style.display = "inline"
      buttonLoader.style.display = "none"
    }
  }

  updateFeedback(data) {
    const index = this.feedbackData.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      this.feedbackData[index] = {
        ...this.feedbackData[index],
        fullName: data.fullName,
        courseName: data.courseName,
        instructorName: data.instructorName,
        rating: data.rating,
        feedback: data.feedback,
        lastModified: new Date().toISOString(),
      }

      this.saveFeedbackToStorage()
      this.displayFeedback()
      this.updateStats()
      this.closeModal(document.getElementById("edit-modal"))
      this.showAlert("Feedback updated successfully!", "success")
    }
  }

  deleteFeedback(id) {
    if (confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      this.feedbackData = this.feedbackData.filter((item) => item.id !== id)
      this.favoritesData = this.favoritesData.filter((favId) => favId !== id)

      this.saveFeedbackToStorage()
      this.saveFavoritesToStorage()
      this.displayFeedback()
      this.updateStats()
      this.updateFavoritesCount()
      this.showAlert("Feedback deleted successfully.", "success")
    }
  }

  editFeedback(id) {
    const feedback = this.feedbackData.find((item) => item.id === id)
    if (feedback) {
      document.getElementById("edit-id").value = feedback.id
      document.getElementById("edit-fullName").value = feedback.fullName
      document.getElementById("edit-courseName").value = feedback.courseName
      document.getElementById("edit-instructorName").value = feedback.instructorName
      document.getElementById("edit-rating").value = feedback.rating
      document.getElementById("edit-feedback").value = feedback.feedback

      this.showModal(document.getElementById("edit-modal"))
    }
  }

  toggleFavorite(id) {
    const index = this.favoritesData.indexOf(id)
    if (index === -1) {
      this.favoritesData.push(id)
      this.showAlert("Added to favorites!", "success")
    } else {
      this.favoritesData.splice(index, 1)
      this.showAlert("Removed from favorites.", "success")
    }

    this.saveFavoritesToStorage()
    this.updateFavoritesCount()
    this.displayFeedback()
  }

  filterFeedback() {
    const searchTerm = document.getElementById("search-feedback")?.value.toLowerCase() || ""
    const ratingFilter = document.getElementById("rating-filter")?.value || ""
    const sortBy = document.getElementById("sort-feedback")?.value || "newest"

    let filtered = [...this.feedbackData]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.fullName.toLowerCase().includes(searchTerm) ||
          item.courseName.toLowerCase().includes(searchTerm) ||
          item.instructorName.toLowerCase().includes(searchTerm) ||
          item.feedback.toLowerCase().includes(searchTerm),
      )
    }

    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter((item) => item.rating === ratingFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        break
      case "rating-high":
        filtered.sort((a, b) => Number.parseInt(b.rating) - Number.parseInt(a.rating))
        break
      case "rating-low":
        filtered.sort((a, b) => Number.parseInt(a.rating) - Number.parseInt(b.rating))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    this.filteredData = filtered
    this.displayFeedback()
  }

  toggleFavoritesView() {
    const showFavoritesBtn = document.getElementById("show-favorites")
    const isShowingFavorites = showFavoritesBtn.classList.contains("active")

    if (isShowingFavorites) {
      showFavoritesBtn.classList.remove("active")
      showFavoritesBtn.innerHTML = '<span class="heart-icon">❤️</span> Show Favorites'
      this.filteredData = [...this.feedbackData]
    } else {
      showFavoritesBtn.classList.add("active")
      showFavoritesBtn.innerHTML = '<span class="heart-icon">💔</span> Show All'
      this.filteredData = this.feedbackData.filter((item) => this.favoritesData.includes(item.id))
    }

    this.displayFeedback()
  }

  resetForm() {
    const form = document.getElementById("feedback-form")
    if (form) {
      form.reset()
      this.clearAllErrors()

      // Reset character count
      const charCount = document.getElementById("char-count")
      if (charCount) {
        charCount.textContent = "0"
        charCount.style.color = "var(--text-light)"
      }
    }
  }

  resetContactForm() {
    const form = document.getElementById("contact-form")
    if (form) {
      form.reset()
      this.clearAllContactErrors()

      // Reset character count
      const messageCharCount = document.getElementById("message-char-count")
      if (messageCharCount) {
        messageCharCount.textContent = "0"
        messageCharCount.style.color = "var(--text-light)"
      }
    }
  }

  showAlert(message, type) {
    const alertContainer = document.getElementById("alert-container")
    if (!alertContainer) return

    // Remove existing alerts
    alertContainer.innerHTML = ""

    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`

    const icon = type === "success" ? "✅" : "❌"
    alert.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
    `

    alertContainer.appendChild(alert)

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.opacity = "0"
        alert.style.transform = "translateY(-10px)"
        setTimeout(() => {
          if (alert.parentNode) {
            alert.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  showContactAlert(message, type) {
    const alertContainer = document.getElementById("contact-alert-container")
    if (!alertContainer) return

    // Remove existing alerts
    alertContainer.innerHTML = ""

    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`

    const icon = type === "success" ? "✅" : "❌"
    alert.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
    `

    alertContainer.appendChild(alert)

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.opacity = "0"
        alert.style.transform = "translateY(-10px)"
        setTimeout(() => {
          if (alert.parentNode) {
            alert.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  displayExistingFeedback() {
    if (this.feedbackData.length > 0) {
      this.displayFeedback()
    }
  }

  displayFeedback() {
    const feedbackSection = document.getElementById("view-feedback")
    const feedbackList = document.getElementById("feedback-list")

    if (!feedbackSection || !feedbackList) return

    const dataToDisplay = this.filteredData.length > 0 ? this.filteredData : this.feedbackData

    if (dataToDisplay.length === 0) {
      feedbackSection.style.display = "block"
      feedbackList.innerHTML = `
        <div class="no-feedback animate-fade-up">
          <div class="no-feedback-icon">📝</div>
          <h3>No feedback found</h3>
          <p>Try adjusting your search or filters, or submit your first feedback!</p>
          <a href="#submit-feedback" class="cta-button-small">Submit Feedback</a>
        </div>
      `
      return
    }

    feedbackSection.style.display = "block"
    feedbackList.innerHTML = ""

    dataToDisplay.forEach((item, index) => {
      const feedbackCard = this.createFeedbackCard(item, index)
      feedbackList.appendChild(feedbackCard)
    })
  }

  createFeedbackCard(feedback, index) {
    const card = document.createElement("div")
    card.className = "feedback-card animate-slide-up"
    card.style.animationDelay = `${index * 0.1}s`

    const date = new Date(feedback.timestamp)
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const stars = "⭐".repeat(Number.parseInt(feedback.rating))
    const isFavorited = this.favoritesData.includes(feedback.id)
    const lastModified = feedback.lastModified
      ? ` (Last modified: ${new Date(feedback.lastModified).toLocaleDateString()})`
      : ""

    card.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-student">
          <div class="student-name">${this.escapeHtml(feedback.fullName)}</div>
          <div class="course-info">
            <strong>Course:</strong> ${this.escapeHtml(feedback.courseName)} | 
            <strong>Instructor:</strong> ${this.escapeHtml(feedback.instructorName)}
          </div>
        </div>
        <div class="rating-badge">
          <span>${stars}</span>
          <span>${feedback.rating}/5</span>
        </div>
      </div>
      <div class="feedback-text">
        "${this.escapeHtml(feedback.feedback)}"
      </div>
      <div class="feedback-actions">
        <button class="action-btn btn-edit" onclick="feedbackPortal.editFeedback('${feedback.id}')">
          <span>✏️</span>
          <span>Edit</span>
        </button>
        <button class="action-btn btn-delete" onclick="feedbackPortal.deleteFeedback('${feedback.id}')">
          <span>🗑️</span>
          <span>Delete</span>
        </button>
        <button class="action-btn btn-favorite ${isFavorited ? "favorited" : ""}" onclick="feedbackPortal.toggleFavorite('${feedback.id}')">
          <span>${isFavorited ? "💖" : "🤍"}</span>
          <span>${isFavorited ? "Favorited" : "Add to Favorites"}</span>
        </button>
      </div>
      <div class="feedback-timestamp">
        Submitted on ${formattedDate}${lastModified}
      </div>
    `

    return card
  }

  showModal(modal) {
    modal.classList.add("show")
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  closeModal(modal) {
    modal.classList.remove("show")
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  showFavoritesModal() {
    const modal = document.getElementById("favorites-modal")
    const favoritesList = document.getElementById("favorites-list")

    if (!modal || !favoritesList) return

    const favoriteFeedback = this.feedbackData.filter((item) => this.favoritesData.includes(item.id))

    favoritesList.innerHTML = ""

    if (favoriteFeedback.length === 0) {
      favoritesList.innerHTML = `
        <div class="no-feedback">
          <div class="no-feedback-icon">💔</div>
          <h3>No favorites yet</h3>
          <p>Add some feedback to your favorites to see them here!</p>
        </div>
      `
    } else {
      favoriteFeedback.forEach((item, index) => {
        const card = this.createFeedbackCard(item, index)
        favoritesList.appendChild(card)
      })
    }

    this.showModal(modal)
  }

  updateStats() {
    const totalFeedbackEl = document.getElementById("total-feedback")
    const avgRatingEl = document.getElementById("avg-rating")
    const favoriteCountEl = document.getElementById("favorite-count")

    if (totalFeedbackEl) {
      totalFeedbackEl.textContent = this.feedbackData.length
    }

    if (avgRatingEl && this.feedbackData.length > 0) {
      const avgRating =
        this.feedbackData.reduce((sum, item) => sum + Number.parseInt(item.rating), 0) / this.feedbackData.length
      avgRatingEl.textContent = avgRating.toFixed(1)
    }

    if (favoriteCountEl) {
      favoriteCountEl.textContent = this.favoritesData.length
    }
  }

  updateFavoritesCount() {
    const favoritesCount = document.querySelector(".favorites-count")
    if (favoritesCount) {
      favoritesCount.textContent = this.favoritesData.length
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  loadFeedbackFromStorage() {
    try {
      const stored = localStorage.getItem("studentFeedback")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading feedback from storage:", error)
      return []
    }
  }

  saveFeedbackToStorage() {
    try {
      localStorage.setItem("studentFeedback", JSON.stringify(this.feedbackData))
    } catch (error) {
      console.error("Error saving feedback to storage:", error)
    }
  }

  loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem("studentFeedbackFavorites")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading favorites from storage:", error)
      return []
    }
  }

  saveFavoritesToStorage() {
    try {
      localStorage.setItem("studentFeedbackFavorites", JSON.stringify(this.favoritesData))
    } catch (error) {
      console.error("Error saving favorites to storage:", error)
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.feedbackPortal = new FeedbackPortal()
})

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")

    if (hamburger && navMenu && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }

    // Close any open modals
    document.querySelectorAll(".modal.show").forEach((modal) => {
      window.feedbackPortal.closeModal(modal)
    })
  }
})

// Add live chat functionality
document.querySelectorAll(".chat-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    alert("Live chat feature coming soon! For now, please use our contact form or email us directly.")
  })
})

// Add service worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
