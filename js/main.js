document.addEventListener('DOMContentLoaded', () => {

    // ========== 🕵️ HEADER SCROLL LOGIC ==========
    const header = document.querySelector('.site-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('site-header--glass');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('site-header--glass');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ========== 📱 MOBILE MENU ==========
    const menuToggle = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    const toggleMenu = () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    };

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    // ========== 🌍 LANGUAGE PICKER ==========
    const langDropdown = document.querySelector('.lang-dropdown');
    if (langDropdown) {
        langDropdown.addEventListener('click', (e) => {
            // Only toggle if we're not clicking a specific language button
            if (!e.target.closest('.lang-btn')) {
                langDropdown.classList.toggle('active');
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (langDropdown && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });

    // ========== 🌊 SCROLL REVEAL (Intersection Observer) ==========
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== 🌍 LANGUAGE PICKER ==========
    // Logic moved to i18n.js for centralized management and to fix dropdown behavior

    // ========== ⚓ SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
