
/* ===========================
   Intersection Observer for Reveals
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // We keep it active once revealed for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach(el => observer.observe(el));

    /* ===========================
       Scroll Progress Logic
       =========================== */
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    /* ===========================
       Theme Toggle Logic
       =========================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);

        if (newTheme === 'light') {
            icon.classList.replace('fa-moon-o', 'fa-sun-o');
        } else {
            icon.classList.replace('fa-sun-o', 'fa-moon-o');
        }
    });

    /* ===========================
       Mobile Navigation
       =========================== */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileIcon = mobileNavToggle.querySelector('i');

    mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileIcon.classList.toggle('fa-bars');
        mobileIcon.classList.toggle('fa-times');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileIcon.classList.add('fa-bars');
            mobileIcon.classList.remove('fa-times');
        });
    });

    /* ===========================
       Header Sticky Logic
       =========================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(11, 11, 11, 0.95)';
            header.style.height = '70px';
        } else {
            header.style.backgroundColor = 'rgba(11, 11, 11, 0.8)';
            header.style.height = '80px';
        }
    });

    /* ===========================
       Smooth Scrolling
       =========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    const symbolChars = ['+', '-', '•', '/', '×'];
    const gridSize = 40;

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        p.noStroke();
        p.textFont('Montserrat');

        initSymbols();
    };

    function initSymbols() {
        symbols = [];
        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                symbols.push({
                    x: x,
                    y: y,
                    char: p.random(symbolChars),
                    angle: p.random(p.TWO_PI),
                    size: p.random(8, 14)
                });
            }
        }
    }

    p.draw = () => {
        p.clear();

        const isLight = document.body.getAttribute('data-theme') === 'light';
        const symbolColor = isLight ? 0 : 255;

        symbols.forEach(s => {
            let dx = p.mouseX - s.x;
            let dy = p.mouseY - s.y;
            let dist = p.sqrt(dx*dx + dy*dy);
            let offset = p.map(p.min(dist, 200), 0, 200, 20, 0);

            p.fill(symbolColor, symbolColor, symbolColor, p.map(p.min(dist, 300), 0, 300, 40, 5));
            p.textSize(s.size);
            p.push();
            p.translate(s.x, s.y);
            p.rotate(s.angle + dist * 0.005);
            p.text(s.char, offset, offset);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initSymbols();
    };
};

new p5(sketch);
