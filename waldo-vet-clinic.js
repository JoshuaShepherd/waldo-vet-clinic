/**
 * Waldo Dog Mama - Interactive JavaScript
 * Handles navigation, form submissions, and sophisticated interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION FUNCTIONALITY =====
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('nav__menu--active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navMenu.classList.contains('nav__menu--active')) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--active')) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== CONTACT FORM FUNCTIONALITY =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateContactForm(formObject)) {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Scheduling...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showNotification('Appointment request submitted successfully! We\'ll contact you within 24 hours.', 'success');
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    }

    // ===== FORM VALIDATION =====
    function validateContactForm(data) {
        const errors = [];
        
        // Required field validation
        const requiredFields = ['name', 'email', 'phone', 'pet-name', 'service'];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`${getFieldLabel(field)} is required`);
            }
        });
        
        // Email validation
        if (data.email && !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Phone validation
        if (data.phone && !isValidPhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            'name': 'Your Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'pet-name': 'Pet\'s Name',
            'service': 'Service Needed'
        };
        return labels[fieldName] || fieldName;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" x2="6" y1="6" y2="18"></line>
                        <line x1="6" x2="18" y1="6" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification__close');
        closeButton.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .team-member, .resource-card, .value');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ===== EMERGENCY CONTACT QUICK ACCESS =====
    // Add click-to-call functionality for emergency numbers
    const emergencyNumbers = document.querySelectorAll('.emergency-number, .emergency-banner .emergency-number');
    emergencyNumbers.forEach(number => {
        number.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.textContent.replace(/[^\d]/g, '');
            if (confirm('Call emergency line: (816) 555-0123?')) {
                window.location.href = `tel:+18165550123`;
            }
        });
    });

    // ===== SERVICE CARDS INTERACTIVE EFFECTS =====
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== TEAM MEMBER CARDS INTERACTIVE EFFECTS =====
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const image = member.querySelector('.team-member__photo');
        const overlay = member.querySelector('.team-member__overlay');
        
        member.addEventListener('mouseenter', function() {
            if (image) image.style.transform = 'scale(1.1)';
            if (overlay) overlay.style.opacity = '1';
        });
        
        member.addEventListener('mouseleave', function() {
            if (image) image.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
        });
    });

    // ===== SCROLL TO TOP FUNCTIONALITY =====
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    `;
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('scroll-to-top--show');
        } else {
            scrollToTopButton.classList.remove('scroll-to-top--show');
        }
    });
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.service-card, .team-member, .resource-card');
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Could send error reports to analytics service
    });

    // ===== INITIALIZATION COMPLETE =====
    console.log('Waldo Area Veterinary Clinic - JavaScript initialized successfully');
});

// ===== CSS FOR NOTIFICATIONS AND SCROLL TO TOP =====
const additionalStyles = `
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid #4CAF50;
    }
    
    .notification--show {
        transform: translateX(0);
    }
    
    .notification--error {
        border-left-color: #f44336;
    }
    
    .notification--success {
        border-left-color: #4CAF50;
    }
    
    .notification__content {
        padding: 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }
    
    .notification__message {
        flex: 1;
        color: #333;
        line-height: 1.4;
    }
    
    .notification__close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #666;
        transition: color 0.2s ease;
    }
    
    .notification__close:hover {
        color: #333;
    }
    
    /* Scroll to Top Button */
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2E7D32;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .scroll-to-top--show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .scroll-to-top:hover {
        background: #1B5E20;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    /* Mobile Navigation Styles */
    @media (max-width: 768px) {
        .nav__menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e0e0e0;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
        }
        
        .nav__menu--active {
            transform: translateY(0);
        }
        
        .nav__menu {
            flex-direction: column;
            padding: 20px;
            gap: 16px;
        }
        
        .nav__toggle--active {
            transform: rotate(90deg);
        }
    }
    
    /* Animation Classes */
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Navbar Scrolled State */
    .nav--scrolled {
        background-color: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
`;

    // ===== MOBILE-SPECIFIC ENHANCEMENTS =====
    
    // Touch-friendly interactions
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Optimize for mobile viewport
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Smooth scroll for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
});

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
