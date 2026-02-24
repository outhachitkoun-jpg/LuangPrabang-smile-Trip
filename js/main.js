document.addEventListener('DOMContentLoaded', function () {
    // Initialize specific tour if needed (optional)
    // Initialize Hero Slider
    const heroSlides = document.querySelectorAll('.hero-bg-img');
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 5000); // Change every 5 seconds
    }

    // Initialize all sliders
    const sliders = document.querySelectorAll('.tour-slider');
    sliders.forEach(slider => {
        const id = slider.getAttribute('id').replace('slider-', '');

        // Initialize indices
        if (!slideIndices[id]) slideIndices[id] = 1;

        // Show first slide
        showSlides(1, id);

        // Start auto-slide
        startAutoSlide(id);

        // Add pause on hover
        slider.addEventListener('mouseenter', () => {
            stopAutoSlide(id);
        });

        // Resume on mouse leave
        slider.addEventListener('mouseleave', () => {
            startAutoSlide(id);
        });
    });

    // Initialize thumbnails hover effect
    const thumbnails = document.querySelectorAll('.tour-thumbnails a');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('mouseenter', () => {
            const tourId = thumb.getAttribute('data-lightbox');
            if (!tourId) return;

            // Find all thumbnails for this specific tour to determine index
            const tourGroup = document.querySelectorAll(`.tour-thumbnails a[data-lightbox="${tourId}"]`);
            let newIndex = 1;

            tourGroup.forEach((t, i) => {
                if (t === thumb) newIndex = i + 1;
            });

            stopAutoSlide(tourId);
            currentSlide(newIndex, tourId);
        });

        thumb.addEventListener('mouseleave', () => {
            const tourId = thumb.getAttribute('data-lightbox');
            if (tourId) startAutoSlide(tourId);
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });


    revealElements.forEach(el => revealObserver.observe(el));

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.querySelector('.nav-overlay');

    if (mobileMenuBtn && mainNav) {
        const toggleMenu = () => {
            const isOpen = mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', toggleMenu);
        }

        // Close menu when a link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's a mobile view and menu is active
                if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Review Stars Interaction
    const starBtns = document.querySelectorAll('.star-btn');
    let selectedRating = 5;

    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.getAttribute('data-rating'));
            starBtns.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        // Set default 5 stars
        if (btn.getAttribute('data-rating') === "5") btn.click();
    });

    // Review Form Submission
    const reviewForm = document.getElementById('guest-review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const tour = document.getElementById('review-tour-select').value;
            const msg = document.getElementById('review-message').value;
            
            // Create New Review Card
            const grid = document.getElementById('reviews-grid');
            const card = document.createElement('div');
            card.className = 'review-card reveal active';
            card.style.borderLeft = '4px solid var(--secondary)';

            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const today = new Date();
            const month = today.toLocaleString('default', { month: 'long' });
            const year = today.getFullYear();

            card.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar" style="background: var(--gradient-sunset);">${initials}</div>
                    <div class="review-meta">
                        <h4>${name}</h4>
                        <span class="review-tour">📍 ${tour}</span>
                    </div>
                </div>
                <div class="review-stars">${'★'.repeat(selectedRating)}${'☆'.repeat(5-selectedRating)}</div>
                <p class="review-text">"${msg}"</p>
                <span class="review-date">🗓️ ${month} ${year}</span>
            `;

            grid.prepend(card);
            
            // Feedback
            document.getElementById('review-success').style.display = 'block';
            reviewForm.reset();
            starBtns.forEach(s => s.classList.remove('active'));
            selectedRating = 0;
            
            // Scroll to the new review
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Header Scroll Effect
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }
});

// Object to store slide indices and intervals for each tour
const slideIndices = {};
const slideIntervals = {};
const AUTO_SLIDE_DELAY = 6000; // 6 seconds

function startAutoSlide(tourId) {
    // Clear existing interval just in case
    stopAutoSlide(tourId);

    slideIntervals[tourId] = setInterval(() => {
        moveSlide(1, tourId);
    }, AUTO_SLIDE_DELAY);
}

function stopAutoSlide(tourId) {
    if (slideIntervals[tourId]) {
        clearInterval(slideIntervals[tourId]);
        delete slideIntervals[tourId];
    }
}

function moveSlide(n, tourId) {
    if (!slideIndices[tourId]) slideIndices[tourId] = 1;
    showSlides(slideIndices[tourId] += n, tourId);
}

function currentSlide(n, tourId) {
    showSlides(slideIndices[tourId] = n, tourId);
}

function showSlides(n, tourId) {
    let i;
    const sliderContainer = document.getElementById('slider-' + tourId);
    if (!sliderContainer) return;

    const slides = sliderContainer.getElementsByClassName("slider-img");

    if (!slideIndices[tourId]) slideIndices[tourId] = 1;

    if (n > slides.length) { slideIndices[tourId] = 1 }
    if (n < 1) { slideIndices[tourId] = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }

    slides[slideIndices[tourId] - 1].style.display = "block";
    slides[slideIndices[tourId] - 1].classList.add("active");
}

function openGallery(tourId) {
    const galleryLink = document.querySelector('[data-lightbox="' + tourId + '"]');
    if (galleryLink) {
        galleryLink.click();
    }
}
