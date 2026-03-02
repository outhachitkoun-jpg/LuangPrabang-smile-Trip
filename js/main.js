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

    // ========== 💬 INJECT FLOATING WHATSAPP ==========
    const waButton = document.createElement('a');
    waButton.href = 'https://wa.me/8562098457614';
    waButton.className = 'whatsapp-float';
    waButton.target = '_blank';
    waButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(waButton);

    // ========== ❓ FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                    // Optional: Close others
                    faqItems.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                });
            }
        });
    }
});

// ========== 🛒 CHECKOUT LOGIC ==========
function bookProduct(name, price, date = '', guests = 1) {
    localStorage.setItem('selected_product_name', name);
    localStorage.setItem('selected_product_price', price);
    localStorage.setItem('selected_product_date', date);
    localStorage.setItem('selected_product_guests', guests);
    
    showToast('Ready to book!', `Added ${name} to your inquiry.`, 'success');
    
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1500);
}

// ========== 🔔 NOTIFICATION SYSTEM (TOASTS) ==========
function showToast(title, message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const icon = icons[type] || icons.info;

    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icon}"></i></div>
        <div class="toast-content">
            <strong class="toast-title">${title}</strong>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
        <div class="toast-progress" style="animation: progress-load ${duration}ms linear forwards"></div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismissToast = () => {
        toast.style.animation = 'toast-out 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    };

    closeBtn.onclick = dismissToast;

    setTimeout(dismissToast, duration);
}

