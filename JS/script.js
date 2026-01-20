document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after it's revealed
                // observer.unobserve(entry.target);
            } else {
                // Remove class if we want animations to re-trigger on scroll up
                // (Matches Lando Norris site feel where things often re-animate)
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-reveal');
    animateElements.forEach(el => observer.observe(el));

    // Smooth scroll for nav links (though CSS scroll-behavior: smooth handles most of it)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for sticky header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Sticky header change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.padding = '20px 0';
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
    });
});
