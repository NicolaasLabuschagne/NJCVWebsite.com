
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    let eyes = [];
    // Swamp Attack style symbols
    const symbolChars = ['🌿', '🍄', '🦟', '🦴', '🐊', '💀', '🍃', '🕸️'];
    const gridSize = 60;

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
                    x: x + p.random(-10, 10),
                    y: y + p.random(-10, 10),
                    char: p.random(symbolChars),
                    angle: p.random(p.TWO_PI),
                    size: p.random(10, 18)
                });
            }
        }

        eyes = [];
        for (let i = 0; i < 20; i++) {
            eyes.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 6),
                blinkTimer: p.random(100, 300),
                isBlinking: false
            });
        }
    }

    p.draw = () => {
        p.clear();

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            // Blinking Eyes in the dark
            eyes.forEach(e => {
                e.blinkTimer--;
                if (e.blinkTimer <= 0) {
                    if (e.isBlinking) {
                        e.blinkTimer = p.random(100, 300);
                        e.isBlinking = false;
                    } else {
                        e.blinkTimer = p.random(5, 15);
                        e.isBlinking = true;
                    }
                }

                if (!e.isBlinking) {
                    p.fill(255, 255, 0, 150); // Yellow glow eyes
                    p.ellipse(e.x, e.y, e.size, e.size / 2);
                    p.ellipse(e.x + e.size * 1.5, e.y, e.size, e.size / 2);
                }
            });
        }

        // Swampy faded look
        const opacityBase = isDark ? 60 : 20;
        const fillColor = isDark ? [43, 61, 43] : [0, 0, 0]; // Murky green in dark, black in light

        symbols.forEach(s => {
            let dx = p.mouseX - s.x;
            let dy = p.mouseY - s.y;
            let dist = p.sqrt(dx*dx + dy*dy);

            // Interaction: symbols move slightly away from mouse
            let force = p.map(p.min(dist, 200), 0, 200, 20, 0);
            let angle = p.atan2(dy, dx);
            let offsetX = p.cos(angle) * -force;
            let offsetY = p.sin(angle) * -force;

            p.fill(fillColor[0], fillColor[1], fillColor[2], p.map(p.min(dist, 500), 0, 500, opacityBase * 2, opacityBase));
            p.textSize(s.size);
            p.push();
            p.translate(s.x + offsetX, s.y + offsetY);
            p.rotate(s.angle + (p.frameCount * 0.01)); // Constant slow rotation
            p.text(s.char, 0, 0);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initSymbols();
    };
};

new p5(sketch);

/* ===========================
   Intersection Observer for Reveals
   =========================== */
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    /* ===========================
       Theme Toggle
       =========================== */
    /* ===========================
       Scroll Progress
       =========================== */
    const progressBar = document.getElementById('scroll-progress-bar');

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    const updateThemeIcon = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fa fa-compass'; // Compass for dark mode adventure
        } else {
            icon.className = 'fa fa-bicycle';
        }
    };

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    });

    /* ===========================
       Scroll Progress & Smooth Scroll
       =========================== */
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    document.querySelectorAll('.nav-links a, .footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* ===========================
       Random Skill Tag Press
       =========================== */
    const skillTags = document.querySelectorAll('.tags span');
    const stickerColors = ['var(--success-color)', 'var(--danger-color)', 'var(--info-color)', 'var(--primary-color)', 'var(--secondary-color)'];
    if (skillTags.length > 0) {
        setInterval(() => {
            const randomTag = skillTags[Math.floor(Math.random() * skillTags.length)];
            const randomColor = stickerColors[Math.floor(Math.random() * stickerColors.length)];

            randomTag.style.transform = 'translate(4px, 4px)';
            randomTag.style.boxShadow = '0px 0px 0px 0px var(--border-color)';
            randomTag.style.backgroundColor = randomColor;

            setTimeout(() => {
                randomTag.style.transform = '';
                randomTag.style.boxShadow = '';
                randomTag.style.backgroundColor = '';
            }, 500);
        }, 3000);
    }

    /* ===========================
       Highlight Animation Observer
       =========================== */
    const highlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.highlight').forEach(h => highlightObserver.observe(h));

    /* ===========================
       Interactive Map
       =========================== */
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([-25.864, 28.188], 10); // Centered on Centurion

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const bikeIcon = L.divIcon({
            html: '<div style="font-size: 24px; filter: drop-shadow(2px 2px 0px black);">🚲</div>',
            className: 'custom-bike-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const locations = [
            { coords: [-25.864, 28.188], title: "Centurion", desc: "Systems Architect @ Estate Recoveries" },
            { coords: [-26.204, 28.047], title: "Johannesburg", desc: "Lead Developer @ Creative Minds" },
            { coords: [-25.747, 28.229], title: "Pretoria", desc: "Junior Software Engineer @ Tech Innovations" }
        ];

        locations.forEach(loc => {
            L.marker(loc.coords, { icon: bikeIcon })
                .addTo(map)
                .bindPopup(`<b>${loc.title}</b><br>${loc.desc}`);
        });

        // Handle theme changes for map
        const updateMapTheme = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            // Leaflet doesn't have a native "dark mode", we use CSS filters in style.css
        };
        updateMapTheme();
        themeToggle.addEventListener('click', updateMapTheme);
    }

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach((el, index) => {
        // Add staggering delay if it's part of a group
        if (el.classList.contains('stagger')) {
            const parent = el.closest('.stagger-parent');
            if (parent) {
                const items = Array.from(parent.querySelectorAll('.stagger'));
                const itemIndex = items.indexOf(el);
                el.style.transitionDelay = `${itemIndex * 0.1}s`;
            }
        }
        observer.observe(el);
    });

    /* ===========================
       Sticky Header
       =========================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.top = '10px';
        } else {
            header.style.top = '20px';
        }
    });

    /* ===========================
       Smooth Scrolling for Nav Links
       =========================== */
    // Handled by StPageFlip link overrides above
});
