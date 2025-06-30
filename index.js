// DOM Elements & Variables
const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);
const hamburger = $('mobile-menu-btn');
const navMenu = $('nav-menu');
const navLinks = $$('.nav-link');
const header = document.querySelector('.header');
const contactForm = $('contact-form');
let currentTestimonial = 0;
const testimonials = $$('.testimonial');
const totalTestimonials = testimonials.length;

// Utility Functions
const throttle = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: '10000',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white', padding: '15px 20px', borderRadius: '6px',
        fontFamily: 'inherit', transform: 'translateX(100%)', transition: 'transform 0.3s'
    });
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Mobile Menu
hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu on link click or outside click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

document.addEventListener('click', e => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    }
});

// Header Scroll Effect
const updateHeader = () => {
    if (window.scrollY > 100) {
        Object.assign(header.style, {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
        });
    } else {
        Object.assign(header.style, {
            background: 'white',
            backdropFilter: 'none'
        });
    }
};

// Active Navigation
const updateActiveNav = () => {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(l => l.classList.remove('active'));
            link?.classList.add('active');
        }
    });
};

// Smooth Scrolling
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial Slider
const showTestimonial = index => {
    testimonials.forEach(t => t.classList.remove('active'));
    testimonials[index]?.classList.add('active');
};

window.changeTestimonial = direction => {
    currentTestimonial = (currentTestimonial + direction + totalTestimonials) % totalTestimonials;
    showTestimonial(currentTestimonial);
};

// Auto-play testimonials
if (totalTestimonials > 0) {
    setInterval(() => window.changeTestimonial(1), 5000);
}

// Contact Form
contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showNotification('Thank you! Your message has been sent successfully.');
    contactForm.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Scroll Animations
const animateElements = () => {
    const elements = $$('.feature, .service, .portfolio-item');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            Object.assign(el.style, {
                opacity: '1',
                transform: 'translateY(0)'
            });
        }
    });
};

// Initialize animations
$$('.feature, .service, .portfolio-item').forEach(el => {
    Object.assign(el.style, {
        opacity: '0',
        transform: 'translateY(30px)',
        transition: 'all 0.6s ease'
    });
});

// Event Listeners
window.addEventListener('scroll', throttle(() => {
    updateHeader();
    updateActiveNav();
    animateElements();
}, 100));

// Keyboard Navigation
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    }
    
    if (e.key === 'ArrowLeft' && document.activeElement?.closest('.testimonials-slider')) {
        e.preventDefault();
        window.changeTestimonial(-1);
    }
    
    if (e.key === 'ArrowRight' && document.activeElement?.closest('.testimonials-slider')) {
        e.preventDefault();
        window.changeTestimonial(1);
    }
});

// Button Click Tracking
$$('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Button clicked:', btn.textContent.trim());
    });
});

// Page Visibility API
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause auto-play when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume when visible
        console.log('Page visible - resuming animations');
    }
});

// Image Error Handling
$$('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
    });
});

// Focus Management for Mobile Menu
const trapFocus = element => {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
};

// Apply focus trapping to mobile menu
const menuObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.target.classList.contains('active')) {
            trapFocus(navMenu);
            navMenu.querySelector('.nav-link')?.focus();
        }
    });
});

navMenu && menuObserver.observe(navMenu, { attributes: true, attributeFilter: ['class'] });

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize first testimonial
    showTestimonial(0);
    
    // Add loading animation to hero elements
    $$('.hero-content, .hero-image').forEach((el, index) => {
        setTimeout(() => {
            Object.assign(el.style, {
                opacity: '1',
                transform: 'translateY(0)',
                transition: 'all 0.6s ease'
            });
        }, index * 200);
    });
    
    // Preload critical images
    const criticalImages = [
        'https://via.placeholder.com/500x400/4F46E5/ffffff?text=Dashboard'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Run initial animations
    animateElements();
    
    console.log('🚀 Simple Landing Page Loaded Successfully!');
});

// Utility functions for external use
window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.trackEvent = (eventName, properties = {}) => {
    console.log('Event tracked:', eventName, properties);
};

// Track form submissions
contactForm?.addEventListener('submit', () => {
    window.trackEvent('form_submit', { form_type: 'contact' });
});

// Service Worker registration (optional PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}