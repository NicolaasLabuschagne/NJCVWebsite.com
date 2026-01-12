document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    for (const link of navLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    }

    // Animate sections on scroll
    const sections = document.querySelectorAll('.about, .contact');
    const animateOnScroll = () => {
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                section.style.opacity = 1;
                section.style.transform = 'translateY(0)';
            }
        }
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
});
