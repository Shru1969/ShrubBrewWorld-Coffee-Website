document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    const enterBtn = document.getElementById('enter-site');
    const body = document.body;

    if (splash) {
        body.classList.add('no-scroll');

        enterBtn.addEventListener('click', () => {
            splash.classList.add('splash-hidden');
            body.classList.remove('no-scroll');
        });
    }

    // Reveal elements on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.menu-item, .menu-category h3, .gallery-grid img, .content > *');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Animate hamburger spans
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Lightbox Popup with Scrollable Gallery (Gallery Section Only)
    const galleryImages = document.querySelectorAll('.gallery-grid img');

    // Create Modal Element with Navigation Arrows (Classic Slider)
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <div class="modal-wrapper">
                <button class="gallery-nav prev">&lsaquo;</button>
                <img class="modal-content" id="modal-img" src="" alt="Gallery Image">
                <button class="gallery-nav next">&rsaquo;</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector('#modal-img');
    const closeBtn = modal.querySelector('.close-modal');
    const prevBtn = modal.querySelector('.gallery-nav.prev');
    const nextBtn = modal.querySelector('.gallery-nav.next');

    let currentGallery = [];
    let currentIndex = 0;

    function updateModal() {
        if (!modalImg) return;
        modalImg.src = currentGallery[currentIndex];

        // Hide arrows if only one image
        if (currentGallery.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
        }
    }

    // Apply to Gallery Grid
    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const mainImg = img.src;
                const extraImages = img.getAttribute('data-gallery') ? img.getAttribute('data-gallery').split(',') : [];
                currentGallery = [mainImg, ...extraImages].filter(src => src.trim() !== '');
                currentIndex = 0;

                modal.style.display = 'flex';
                updateModal();
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Simple Popup for Menu Items (Single Image)
    const menuImages = document.querySelectorAll('.menu-item img');
    if (menuImages.length > 0) {
        menuImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentGallery = [img.src];
                currentIndex = 0;
                modal.style.display = 'flex';
                updateModal();
                document.body.style.overflow = 'hidden';
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                updateModal();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentIndex = (currentIndex + 1) % currentGallery.length;
                updateModal();
            }
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.className === 'modal-wrapper') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Support Mouse Wheel scroll for gallery
    modal.addEventListener('wheel', (e) => {
        if (currentGallery.length <= 1) return;
        e.preventDefault();
        if (e.deltaY > 0) {
            currentIndex = (currentIndex + 1) % currentGallery.length;
        } else {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        }
        updateModal();
    }, { passive: false });

    // Smooth scroll for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.includes('#')) {
                const parts = targetId.split('#');
                const page = parts[0];
                const section = parts[1];

                // If on same page
                if (window.location.pathname.endsWith(page) || (page === '' && !window.location.pathname.includes('.html'))) {
                    e.preventDefault();
                    const targetElement = document.getElementById(section);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            }
        });
    });

    // Reservation Form Handling
    const resForm = document.querySelector('.reservation-form');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = resForm.querySelector('input[placeholder="Your Name"]').value;
            alert(`Thank you, ${name}! Your reservation has been successfully booked. We look forward to seeing you.`);
            resForm.reset();
        });
    }


});
