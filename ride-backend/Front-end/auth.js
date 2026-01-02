// ============================================
// RideFair Authentication Page - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. PARTICLE BACKGROUND ANIMATION
    // ============================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const heroSection = document.querySelector('.auth-hero');

    // Set canvas size
    function resizeCanvas() {
        if (canvas && heroSection) {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.2 + 0.1;
            this.color = '#C1F11D';
            this.waveOffset = Math.random() * Math.PI * 2;
        }

        update() {
            // Add wave motion
            this.waveOffset += 0.02;
            this.x += this.speedX + Math.sin(this.waveOffset) * 0.2;
            this.y += this.speedY + Math.cos(this.waveOffset) * 0.2;

            // Boundary check
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Keep in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Create particles
    const particles = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(193, 241, 29, 0.05)');
        gradient.addColorStop(1, 'rgba(193, 241, 29, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ============================================
    // 2. FORM TOGGLE SYSTEM
    // ============================================
    const formsWrapper = document.getElementById('formsWrapper');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const successMessage = document.getElementById('successMessage');
    const mobileToggle = document.getElementById('mobileToggle');
    const toggleLinks = document.querySelectorAll('.toggle-link');

    let currentForm = 'login';

    // Function to switch forms
    function switchForm(formName) {
        // Hide all forms
        [loginForm, signupForm].forEach(form => {
            form.classList.remove('active');
        });

        // Show selected form
        let formToShow;
        switch (formName) {
            case 'login':
                formToShow = loginForm;
                currentForm = 'login';
                mobileToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to Sign Up</span>';
                break;
            case 'signup':
                formToShow = signupForm;
                currentForm = 'signup';
                mobileToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to Login</span>';
                break;
        }

        // Add animation
        formsWrapper.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            formToShow.classList.add('active');
            formsWrapper.style.transform = 'translateX(0)';
        }, 50);

        // Update mobile toggle text
        updateMobileToggle();
    }

    // Add click event to toggle links
    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const formName = link.getAttribute('data-form');
            switchForm(formName);
        });
    });

    // Mobile toggle functionality
    mobileToggle.addEventListener('click', () => {
        if (currentForm === 'login') {
            switchForm('signup');
        } else if (currentForm === 'signup') {
            switchForm('login');
        }
    });

    // Update mobile toggle text
    function updateMobileToggle() {
        if (currentForm === 'login') {
            mobileToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to Sign Up</span>';
        } else if (currentForm === 'signup') {
            mobileToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to Login</span>';
        }
    }

    // ============================================
    // 3. PASSWORD TOGGLE VISIBILITY
    // ============================================
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ============================================
    // 4. PASSWORD STRENGTH CHECKER
    // ============================================
    const passwordInput = document.getElementById('signupPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    const confirmPassword = document.getElementById('signupConfirm');
    const passwordMatch = document.getElementById('passwordMatch');

    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }

    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        let feedback = '';

        // Check password criteria
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update strength bar
        strengthBar.className = 'strength-progress';
        if (strength === 0) {
            feedback = 'Enter a password';
        } else if (strength <= 2) {
            strengthBar.classList.add('weak');
            feedback = 'Weak password';
        } else if (strength === 3) {
            strengthBar.classList.add('medium');
            feedback = 'Medium strength';
        } else {
            strengthBar.classList.add('strong');
            feedback = 'Strong password';
        }

        strengthText.textContent = feedback;
    }

    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirm = confirmPassword.value;

        if (confirm.length === 0) {
            passwordMatch.classList.remove('visible');
        } else if (password === confirm) {
            passwordMatch.classList.add('visible');
        } else {
            passwordMatch.classList.remove('visible');
        }
    }

    // ============================================
    // 5. FORM VALIDATION
    // ============================================
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    const forgotFormElement = document.getElementById('forgotFormElement');

    // Login form validation
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateLoginForm()) {
                handleLogin();
            }
        });
    }

    // Signup form validation
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateSignupForm()) {
                handleSignup();
            }
        });
    }

    // Validation functions
    function validateLoginForm() {
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        clearErrors();

        // Email validation
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    function validateSignupForm() {
        const firstName = document.getElementById('signupFirstName');
        const lastName = document.getElementById('signupLastName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirm = document.getElementById('signupConfirm');
        const terms = document.getElementById('termsAgreement');
        let isValid = true;

        clearErrors();

        // First name validation
        if (firstName.value.trim().length < 2) {
            showError(firstName, 'Please enter your first name');
            isValid = false;
        }

        // Last name validation
        if (lastName.value.trim().length < 2) {
            showError(lastName, 'Please enter your last name');
            isValid = false;
        }

        // Email validation
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        // Confirm password
        if (password.value !== confirm.value) {
            showError(confirm, 'Passwords do not match');
            isValid = false;
        }

        // Terms agreement
        if (!terms.checked) {
            const termsLabel = terms.closest('.checkbox-label');
            termsLabel.style.color = '#EF4444';
            isValid = false;
        }

        return isValid;
    }

    function validateForgotForm() {
        const email = document.getElementById('forgotEmail');
        let isValid = true;

        clearErrors();

        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    // Helper validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    }

    // Error handling functions
    function showError(input, message) {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.add('error');
        
        let errorElement = wrapper.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            wrapper.parentNode.insertBefore(errorElement, wrapper.nextSibling);
        } else {
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }
    }

    function clearErrors() {
        // Remove error classes
        document.querySelectorAll('.input-wrapper.error').forEach(wrapper => {
            wrapper.classList.remove('error');
        });

        // Remove error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });

        // Reset terms label color
        const termsLabel = document.querySelector('#termsAgreement')?.closest('.checkbox-label');
        if (termsLabel) {
            termsLabel.style.color = '';
        }
    }

    // ============================================
    // 6. SUCCESS MESSAGE
    // ============================================
    function showSuccessMessage() {
        successMessage.classList.add('active');
        
        // Reset progress bar animation
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.animation = 'none';
        setTimeout(() => {
            progressBar.style.animation = 'loading 3s ease-in-out forwards';
        }, 10);
        
        // Simulate redirect after 3 seconds
        setTimeout(() => {
            // Redirect to booking page
            window.location.href = 'book.html';
        }, 3000);
    }

    // ============================================
    // 7. REAL LOGIN API CALL
    // ============================================
    async function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Show loading state
        const submitBtn = loginFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token and user info
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('userData', JSON.stringify(data.data.user));
                
                // Redirect to booking page immediately
                window.location.href = 'book.html';
            } else {
                // Show error message
                showError(document.getElementById('loginEmail'), data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(document.getElementById('loginEmail'), 'Connection error. Please check if the server is running.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // ============================================
    // 8. REAL SIGNUP API CALL
    // ============================================
    async function handleSignup() {
        const firstName = document.getElementById('signupFirstName').value;
        const lastName = document.getElementById('signupLastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Show loading state
        const submitBtn = signupFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const signupData = {
                firstName,
                lastName,
                email,
                password
            };
            
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token and user info
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('userData', JSON.stringify(data.data.user));
                
                // Redirect to booking page immediately
                window.location.href = 'book.html';
            } else {
                // Show error message
                showError(document.getElementById('signupEmail'), data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showError(document.getElementById('signupEmail'), 'Connection error. Please check if the server is running.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    // ============================================
    // 9. SOCIAL LOGIN BUTTONS (REMOVED)
    // ============================================

    // ============================================
    // 9. SOCIAL LOGIN BUTTONS
    // ============================================
    const socialButtons = document.querySelectorAll('.btn-social');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.classList.contains('btn-google') ? 'Google' : 'Apple';
            
            // Show loading state
            const originalText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
            button.disabled = true;
            
            // Simulate social login
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                
                alert(`This would connect with ${service} in a real application`);
            }, 1500);
        });
    });

    // ============================================
    // 10. FLOATING ICON ANIMATIONS
    // ============================================
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random delay
        icon.style.animationDelay = `${index * 1}s`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
            icon.style.opacity = '1';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
            icon.style.opacity = '0.5';
        });
    });

    // ============================================
    // 11. INPUT FOCUS ANIMATIONS
    // ============================================
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const wrapper = input.closest('.input-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'translateY(-2px)';
                wrapper.style.boxShadow = '0 10px 30px rgba(193, 241, 29, 0.1)';
            }
        });
        
        input.addEventListener('blur', () => {
            const wrapper = input.closest('.input-wrapper');
            if (wrapper) {
                wrapper.style.transform = '';
                wrapper.style.boxShadow = '';
            }
        });
    });

    // ============================================
    // 12. AUTO-FOCUS FIRST INPUT
    // ============================================
    function focusFirstInput() {
        const activeForm = document.querySelector('.form-container.active');
        if (activeForm) {
            const firstInput = activeForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    // Focus on form switch
    toggleLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(focusFirstInput, 300);
        });
    });

    // Initial focus
    setTimeout(focusFirstInput, 500);

    // ============================================
    // 13. AUTHENTICATION UTILITIES
    // ============================================
    
    // Check if user is logged in
    function isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return token && userData;
    }
    
    // Get current user data
    function getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'auth.html';
    }
    
    // Make these functions globally available
    window.isLoggedIn = isLoggedIn;
    window.getCurrentUser = getCurrentUser;
    window.logout = logout;

    console.log('✨ RideFair Authentication page loaded successfully!');
});