// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(appointmentForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!validateAppointmentForm(data)) {
                return;
            }
            
            // Show success message
            showSuccessMessage('Appointment request submitted successfully! We will contact you within 24 hours to confirm your appointment.');
            
            // Reset form
            appointmentForm.reset();
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!validateContactForm(data)) {
                return;
            }
            
            // Show success message
            showSuccessMessage('Message sent successfully! We will get back to you as soon as possible.');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// Form Validation Functions
function validateAppointmentForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'appointmentType', 'preferredDate', 'preferredTime'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showErrorMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            return false;
        }
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone format
    if (!isValidPhone(data.phone)) {
        showErrorMessage('Please enter a valid phone number.');
        return false;
    }
    
    // Validate date (must be in the future)
    const selectedDate = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showErrorMessage('Please select a future date for your appointment.');
        return false;
    }
    
    // Check consent checkbox
    if (!data.consent) {
        showErrorMessage('Please consent to us contacting you about your appointment request.');
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    const requiredFields = ['contactName', 'contactEmail', 'subject', 'contactMessage'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            const fieldName = field.replace('contact', '').replace(/([A-Z])/g, ' $1').toLowerCase();
            showErrorMessage(`Please fill in the ${fieldName} field.`);
            return false;
        }
    }
    
    // Validate email format
    if (!isValidEmail(data.contactEmail)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Validation Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

// Message Display Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <button class="message-close">&times;</button>
        </div>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        padding: 1rem 2rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        max-width: 500px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
        animation: slideDown 0.3s ease;
        ${type === 'success' ? 
            'background: rgba(76, 175, 80, 0.9); color: white;' : 
            'background: rgba(244, 67, 54, 0.9); color: white;'
        }
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Close button functionality
    const closeBtn = messageDiv.querySelector('.message-close');
    closeBtn.addEventListener('click', () => {
        messageDiv.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Smooth Scrolling for Internal Links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe glass cards for animations
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        observer.observe(card);
    });
});

// Video Background Controls
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video-background video');
    
    if (video) {
        // Ensure video plays
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
        });
        
        // Reduce video quality on mobile for better performance
        if (window.innerWidth < 768) {
            video.style.filter = 'blur(2px)';
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                video.style.filter = 'blur(2px)';
            } else {
                video.style.filter = 'none';
            }
        });
    }
});

// Form Field Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for appointment form
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formattedDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', formattedDate);
    }
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            this.value = value;
        });
    });
});

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to navigation
    const navToggle = document.querySelector('.hamburger');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Add skip link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 6px 6px;
        z-index: 100000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
});

// Performance Optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}
