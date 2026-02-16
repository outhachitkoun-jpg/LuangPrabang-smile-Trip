document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly to trigger before fully in view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Staggered animations for grids
    const staggerContainers = document.querySelectorAll('.stagger-grid');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.classList.add('reveal');
            child.style.transitionDelay = `${index * 0.1}s`; // 100ms delay per item
            observer.observe(child);
        });
    });

    // Parallax Effect for Hero Text (Subtle)
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroText.style.opacity = 1 - (scrolled / 700);
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav li');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            hamburger.classList.toggle('active'); // Animate hamburger
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                hamburger.classList.remove('active');
            });
        });
    }
});
