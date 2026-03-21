
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    // More "Adventure/Scrapbook" style symbols
    const symbolChars = ['★', '•', '✎', '➤', '❖'];
    const gridSize = 50;

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
    }

    p.draw = () => {
        // Skip rendering if professional theme is active to save resources
        if (document.body.classList.contains('theme-professional')) {
            p.clear();
            return;
        }

        p.clear();

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colorValue = isDark ? 200 : 80;

        const primaryRGB = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color-rgb') || '190, 242, 100';
        const primaryColor = primaryRGB.split(',').map(c => parseInt(c.trim()));

        symbols.forEach(s => {
            let dx = p.mouseX - s.x;
            let dy = p.mouseY - s.y;
            let dist = p.sqrt(dx*dx + dy*dy);
            let offset = p.map(p.min(dist, 250), 0, 250, 15, 0);

            if (dist < 200) {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2], p.map(p.min(dist, 200), 0, 200, 150, 2));
            } else {
                p.fill(colorValue, colorValue, colorValue, p.map(p.min(dist, 400), 0, 400, 30, 2));
            }
            p.textSize(s.size);
            p.push();
            p.translate(s.x, s.y);
            p.rotate(s.angle + dist * 0.002);
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

/* ===========================
   Performance-Optimized Portfolio Engine
   =========================== */
document.documentElement.classList.add('js-enabled');

const PortfolioEngine = {
    init() {
        this.initObservers();
        this.initThemeSystem();
        this.initScrollInteractions();
        this.initMap();
        this.initSkillAnimations();
        VibeEngine.init();
    },

    initObservers() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.classList.contains('scribble-underline') ||
                        entry.target.classList.contains('hand-drawn-circle')) {
                        entry.target.classList.add('animate-scribble');
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.animate-reveal, .highlight, .scribble-underline, .hand-drawn-circle')
                .forEach(el => revealObserver.observe(el));
    },

    initThemeSystem() {
        const themeToggle = document.getElementById('theme-toggle');
        const updateThemeIcon = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const iconSpan = themeToggle.querySelector('.material-symbols-outlined');
            if (iconSpan) iconSpan.textContent = isDark ? 'dark_mode' : 'light_mode';
        };

        const savedMode = localStorage.getItem('theme') || 'dark';
        if (savedMode === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    },

    initScrollInteractions() {
        const progressBar = document.getElementById('scroll-progress-bar');
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            // Progress Bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            // Sticky Header refinement
            if (header) {
                header.style.transform = window.scrollY > 50 ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%) translateY(0)';
            }
        }, { passive: true });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    },

    initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const map = L.map('map', { scrollWheelZoom: false }).setView([-25.864, 28.188], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const bikeIcon = L.divIcon({
            html: '<div style="font-size: 24px; filter: drop-shadow(2px 2px 0px var(--primary-color));">🚲</div>',
            className: 'custom-bike-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const locations = [
            { coords: [-25.864, 28.188], title: "Centurion", desc: "Systems Architect" },
            { coords: [-26.204, 28.047], title: "Johannesburg", desc: "Lead Developer" },
            { coords: [-25.747, 28.229], title: "Pretoria", desc: "Senior Engineer" }
        ];

        locations.forEach(loc => {
            L.marker(loc.coords, { icon: bikeIcon }).addTo(map).bindPopup(`<b>${loc.title}</b><br>${loc.desc}`);
        });
    },

    initSkillAnimations() {
        const skillTags = document.querySelectorAll('.tags span');
        const colors = ['var(--success-color)', 'var(--accent-color)', 'var(--purple-color)', 'var(--primary-color)'];

        if (skillTags.length) {
            setInterval(() => {
                const tag = skillTags[Math.floor(Math.random() * skillTags.length)];
                tag.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                tag.style.transform = 'translate(4px, 4px)';
                setTimeout(() => {
                    tag.style.backgroundColor = '';
                    tag.style.transform = '';
                }, 1000);
            }, 3000);
        }
    }
};

/* ===========================
   Vibe Engine: UI Personality Transitions
   =========================== */
const VibeEngine = {
    themes: ['theme-creative', 'theme-fun', 'theme-professional'],
    icons: ['🎨', '🐾', '💼'],
    currentIndex: 0,

    init() {
        const pet = document.getElementById('interactive-pet');
        const saved = localStorage.getItem('pet-theme');
        if (saved && this.themes.includes(saved)) this.currentIndex = this.themes.indexOf(saved);

        this.applyTheme();
        if (pet) pet.addEventListener('click', () => this.cycle());
    },

    applyTheme() {
        this.themes.forEach(t => document.body.classList.remove(t));
        const current = this.themes[this.currentIndex];
        document.body.classList.add(current);
        localStorage.setItem('pet-theme', current);

        const pet = document.getElementById('interactive-pet');
        if (pet) pet.textContent = this.icons[this.currentIndex];

        window.dispatchEvent(new CustomEvent('themeChanged', { detail: current }));
    },

    cycle() {
        this.currentIndex = (this.currentIndex + 1) % this.themes.length;
        this.applyTheme();
    }
};

document.addEventListener('DOMContentLoaded', () => PortfolioEngine.init());
