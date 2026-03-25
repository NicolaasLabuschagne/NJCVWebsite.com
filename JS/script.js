
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

        // Use primary color if it's visible enough, else gray
        const primaryRGB = getComputedStyle(document.body)
            .getPropertyValue('--primary-color-rgb') || '190, 242, 100';
        const primaryColor = primaryRGB.split(',').map(c => parseInt(c.trim()));

        const textColorRGB = getComputedStyle(document.body)
            .getPropertyValue('--text-color-rgb') || (isDark ? '255,255,255' : '0,0,0');
        const textColor = textColorRGB.split(',').map(c => parseInt(c.trim()));

        symbols.forEach(s => {
            let dx = p.mouseX - s.x;
            let dy = p.mouseY - s.y;
            let dist = p.sqrt(dx*dx + dy*dy);
            let offset = p.map(p.min(dist, 250), 0, 250, 15, 0);

            if (dist < 200) {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2], p.map(p.min(dist, 200), 0, 200, 150, 2));
            } else {
                p.fill(textColor[0], textColor[1], textColor[2], p.map(p.min(dist, 400), 0, 400, 30, 2));
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

        const applyTheme = (mode) => {
            if (mode === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
            updateThemeIcon();
        };

        const savedMode = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if (savedMode) {
            applyTheme(savedMode);
        } else {
            applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
        }

        themeToggle.addEventListener('click', () => {
            const isDark = !document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        systemPrefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
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
    icons: [
        `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10"><path d="M12 2C7.58 2 4 5.58 4 10V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V10C20 5.58 16.42 2 12 2ZM9 11C8.45 11 8 10.55 8 10C8 9.45 8.45 9 9 9C9.55 9 10 9.45 10 10C10 10.55 9.55 11 9 11ZM15 11C14.45 11 14 10.55 14 10C14 9.45 14.45 9 15 9C15.55 9 16 9.45 16 10C16 10.55 15.55 11 15 11Z"/></svg>`,
        `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10"><path d="M12 2C7.58 2 4 5.58 4 10V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V10C20 5.58 16.42 2 12 2ZM12 16C10.34 16 9 14.66 9 13H15C15 14.66 13.66 16 12 16ZM9 11C8.45 11 8 10.55 8 10C8 9.45 8.45 9 9 9C9.55 9 10 9.45 10 10C10 10.55 9.55 11 9 11ZM15 11C14.45 11 14 10.55 14 10C14 9.45 14.45 9 15 9C15.55 9 16 9.45 16 10C16 10.55 15.55 11 15 11Z"/></svg>`,
        `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10"><path d="M12 2C7.58 2 4 5.58 4 10V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V10C20 5.58 16.42 2 12 2ZM9 11C8.45 11 8 10.55 8 10C8 9.45 8.45 9 9 9C9.55 9 10 9.45 10 10C10 10.55 9.55 11 9 11ZM15 11C14.45 11 14 10.55 14 10C14 9.45 14.45 9 15 9C15.55 9 16 9.45 16 10C16 10.55 15.55 11 15 11Z"/><rect x="7" y="14" width="10" height="2" rx="1"/></svg>`
    ],
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
        if (pet) {
            pet.innerHTML = this.icons[this.currentIndex];
            pet.setAttribute('data-vibe', current);
        }

        window.dispatchEvent(new CustomEvent('themeChanged', { detail: current }));
    },

    cycle() {
        this.currentIndex = (this.currentIndex + 1) % this.themes.length;
        this.applyTheme();
    }
};

document.addEventListener('DOMContentLoaded', () => PortfolioEngine.init());
