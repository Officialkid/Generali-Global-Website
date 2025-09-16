// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    body.style.overflow = '';
});

// Close menu when clicking on links
document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Role Rotation Animation
    const roles = document.querySelectorAll('.role');
    let currentRoleIndex = 0;

    function showNextRole() {
        roles[currentRoleIndex].classList.remove('active');
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        roles[currentRoleIndex].classList.add('active');
    }

    // Start role rotation after all animations complete
    setTimeout(() => {
        roles[0].classList.add('active');
        setInterval(showNextRole, 3000);
    }, 3500);

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

    // Services Carousel Functionality
    const carousel = document.getElementById('services-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentPosition = 0;
    const isMobile = window.innerWidth <= 992;

    if (carousel && prevBtn && nextBtn && !isMobile) {
        const cardWidth = document.querySelector('.service-card').offsetWidth + 30;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        nextBtn.addEventListener('click', () => {
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
    }

    // Highlight current nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    function highlightNavLink() {
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
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    function checkReveal() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Initial check
});

// Toggle Event Descriptions
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

// Make contact items clickable
document.querySelectorAll('.contact-item, .footer-contact-item').forEach(item => {
    item.addEventListener('click', function () {
        const link = this.querySelector('a');
        if (link) {
            window.open(link.href, '_blank');
        }
    });
});

// Remove pulse animation after first interaction
const whatsappBtn = document.querySelector('.whatsapp-btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
        this.classList.remove('pulse');
    });
}
        