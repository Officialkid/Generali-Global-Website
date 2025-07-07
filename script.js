// Mobile Menu
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Role Rotation Animation
const roles = document.querySelectorAll('.role');
let currentRoleIndex = 0;

function showNextRole() {
    roles[currentRoleIndex].classList.remove('active');
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    roles[currentRoleIndex].classList.add('active');
}

roles[0].classList.add('active');
setTimeout(() => {
    setInterval(showNextRole, 3000);
}, 2000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Highlight current nav link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced Firework Animation
function createFirework() {
    const firework = document.createElement('div');
    firework.classList.add('firework');

    const heroRect = document.querySelector('.hero').getBoundingClientRect();
    const x = Math.random() * (heroRect.width * 0.8) + heroRect.width * 0.1;
    const y = Math.random() * (heroRect.height * 0.6) + heroRect.height * 0.2;

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    firework.style.setProperty('--x', `${targetX}px`);
    firework.style.setProperty('--y', `${targetY}px`);

    const size = 4 + Math.random() * 8;
    firework.style.width = `${size}px`;
    firework.style.height = `${size}px`;

    const hue = 45 + Math.random() * 15;
    firework.style.background = `hsl(${hue}, 100%, 60%)`;

    document.querySelector('.hero').appendChild(firework);

    setTimeout(() => {
        firework.style.animation = 'firework 1.2s ease-out forwards';
    }, 10);

    setTimeout(() => {
        createParticles(x + targetX, y + targetY);
    }, 600);

    setTimeout(() => {
        firework.remove();
    }, 1500);
}

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 30 + Math.random() * 40;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--px', `${targetX}px`);
        particle.style.setProperty('--py', `${targetY}px`);

        document.querySelector('.hero').appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

// Fireworks
setTimeout(() => {
    for (let i = 0; i < 12; i++) {
        setTimeout(createFirework, i * 150);
    }
}, 1000);

setInterval(() => {
    if (Math.random() > 0.8) {
        createFirework();
    }
}, 800);

// Section Visibility Functions
const aboutContent = document.querySelector('.about-content');
const servicesCarousel = document.querySelector('.services-carousel');
const eventsGrid = document.querySelector('.events-grid');
const contactCard = document.querySelector('.contact-card');

function checkAboutVisibility() {
    const rect = aboutContent.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        aboutContent.classList.add('visible');
    }
}

function checkServicesVisibility() {
    const rect = servicesCarousel.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        servicesCarousel.classList.add('visible');
    }
}

function checkEventsVisibility() {
    const rect = eventsGrid.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        eventsGrid.classList.add('visible');
    }
}

function checkContactVisibility() {
    const rect = contactCard.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        contactCard.classList.add('visible');
    }
}

// Debounce function for scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Event listeners for visibility checks
document.addEventListener('DOMContentLoaded', () => {
    checkAboutVisibility();
    checkServicesVisibility();
    checkEventsVisibility();
    checkContactVisibility();
});

window.addEventListener('scroll', debounce(() => {
    checkAboutVisibility();
    checkServicesVisibility();
    checkEventsVisibility();
    checkContactVisibility();
}));

// Carousel functionality
const carousel = document.getElementById('services-carousel');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const cardWidth = 300;
let currentPosition = 0;

nextBtn.addEventListener('click', () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    currentPosition = Math.min(currentPosition + cardWidth, maxScroll);
    carousel.scrollTo({
        left: currentPosition,
        behavior: 'smooth'
    });
});

prevBtn.addEventListener('click', () => {
    currentPosition = Math.max(currentPosition - cardWidth, 0);
    carousel.scrollTo({
        left: currentPosition,
        behavior: 'smooth'
    });
});

// Toggle description visibility
function toggleDescription(shortId, fullId, button) {
    const shortDesc = document.getElementById(shortId);
    const fullDesc = document.getElementById(fullId);

    if (fullDesc.style.display === 'none') {
        shortDesc.style.display = 'none';
        fullDesc.style.display = 'block';
        button.innerHTML = 'Read less <i class="fas fa-arrow-up"></i>';
    } else {
        shortDesc.style.display = 'block';
        fullDesc.style.display = 'none';
        button.innerHTML = 'Read more <i class="fas fa-arrow-right"></i>';
    }
}

// Contact item click effects
document.querySelectorAll('.contact-item, .footer-contact-item').forEach(item => {
    item.addEventListener('click', function () {
        const link = this.querySelector('a');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

//Float Animation
// Add click tracking (optional)
document.querySelectorAll('.floating-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        // Here you could add analytics tracking
        console.log('Contact button clicked:', this.href);
    });
});

// Remove pulse animation after first interaction
const whatsappBtn = document.querySelector('.whatsapp-btn');
whatsappBtn.addEventListener('click', function () {
    this.classList.remove('pulse');
});