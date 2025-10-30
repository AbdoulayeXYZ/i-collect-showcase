// ========================================
// Navigation Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for glassmorphism effect
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Mobile Menu Toggle
// ========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ========================================
// Carousel Navigation
// ========================================
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const screenshotItems = document.querySelectorAll('.screenshot-item');

let currentIndex = 0;
const itemWidth = 340; // 300px width + 40px gap

if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < screenshotItems.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
}

function updateCarousel() {
    const scrollAmount = currentIndex * itemWidth;
    carouselTrack.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
    
    // Update button states
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    
    nextBtn.style.opacity = currentIndex === screenshotItems.length - 1 ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentIndex === screenshotItems.length - 1 ? 'none' : 'auto';
}

// Initialize carousel button states
if (prevBtn && nextBtn) {
    updateCarousel();
}

// Touch/Swipe support for carousel on mobile
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < screenshotItems.length - 1) {
            // Swipe left - next
            currentIndex++;
            updateCarousel();
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - prev
            currentIndex--;
            updateCarousel();
        }
    }
}

// ========================================
// Animate on Scroll (AOS) - Custom Implementation
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ========================================
// Counter Animation for Stats
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                // Only animate if it's a number
                if (!isNaN(text) && text !== '∞' && text !== '100%') {
                    const target = parseInt(text);
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========================================
// Parallax Effect for Hero Background
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ========================================
// Dynamic Gradient Animation
// ========================================
const gradientTexts = document.querySelectorAll('.gradient-text');

gradientTexts.forEach((text, index) => {
    text.style.animationDelay = `${index * 0.2}s`;
});

// ========================================
// Lazy Loading Images
// ========================================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========================================
// Cursor Effect (Optional - Premium Touch)
// ========================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #008080;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.3s ease;
    opacity: 0;
    mix-blend-mode: difference;
`;

// Only add custom cursor on desktop
if (window.innerWidth > 1024) {
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Scale cursor on hover over clickable elements
    const clickables = document.querySelectorAll('a, button, .feature-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#003366';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#008080';
        });
    });
}

// ========================================
// Page Load Animation
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// Scroll Progress Indicator (Optional)
// ========================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #008080 0%, #003366 100%);
    width: 0%;
    z-index: 10000;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// ========================================
// Performance Optimization
// ========================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScrollHandler = debounce(() => {
    // Add any additional scroll handlers here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// ========================================
// Console Easter Egg
// ========================================
console.log('%c👋 Salut développeur !', 'color: #008080; font-size: 20px; font-weight: bold;');
console.log('%ci-collect - Recensement collaboratif des arrêts de bus à Dakar', 'color: #003366; font-size: 14px;');
console.log('%cDéveloppé avec ❤️ par Art\'Beau-Rescence', 'color: #666; font-size: 12px;');
console.log('%cTu veux contribuer ? Rejoins-nous sur l\'App Store !', 'color: #008080; font-size: 12px;');

// ========================================
// Accessibility Enhancements
// ========================================
// Add skip to content link
const skipLink = document.createElement('a');
skipLink.href = '#features';
skipLink.textContent = 'Passer au contenu';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #008080;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10001;
    transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Announce page changes for screen readers
const announcer = document.createElement('div');
announcer.setAttribute('role', 'status');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.className = 'sr-only';
announcer.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
`;
document.body.appendChild(announcer);

// ========================================
// End of script.js
// ========================================
console.log('%c✅ Site vitrine i-collect chargé avec succès!', 'color: #008080; font-weight: bold;');
