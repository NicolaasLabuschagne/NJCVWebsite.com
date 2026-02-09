document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for reveal animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('revealed');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-reveal, .timeline-item').forEach(el => observer.observe(el));

    // 2. Sticky header & Scroll Progress
    const header = document.querySelector('.header');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";
    });

    // 3. Smooth scroll
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            }
        });
    });

    // 4. Initialize Themes & Palette Switcher
    initThemeSystem();

    // 5. Initialize Interactive Backgrounds
    document.querySelectorAll('.interactive-bg').forEach(container => {
        const mode = container.getAttribute('data-bg-mode') || 'symbols';
        new InteractiveBackground(container, mode);
    });

    // 6. Interactive Touches (Magnetic & Tilt)
    initInteractiveTouches();
});

/* ==========================================================================
   Theme System
   ========================================================================== */
const THEMES = {
    "navy-orange": "#FF6B35",
    "charcoal-blue": "#007BFF",
    "forest-lime": "#A8E600"
};

function initThemeSystem() {
    const keys = Object.keys(THEMES);
    const saved = localStorage.getItem('theme');

    let initialTheme = keys[Math.floor(Math.random() * keys.length)];
    if (saved && keys.includes(saved)) {
        initialTheme = saved;
    }

    setTheme(initialTheme);

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

        if (e.key === 'ArrowLeft') cycleTheme(-1);
        else if (e.key === 'ArrowRight') cycleTheme(1);
    });
}

function setTheme(theme) {
    if (!THEMES[theme]) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    renderPaletteButtons(theme);
}

function cycleTheme(offset) {
    const keys = Object.keys(THEMES);
    const current = document.documentElement.getAttribute('data-theme');
    let idx = keys.indexOf(current);
    if (idx === -1) idx = 0;
    const nextIdx = (idx + offset + keys.length) % keys.length;
    setTheme(keys[nextIdx]);
}

function renderPaletteButtons(activeTheme) {
    const switcher = document.querySelector('.palette-switcher');
    if (!switcher) return;

    switcher.innerHTML = '';

    const q = document.createElement('div');
    q.className = 'palette-question';
    q.textContent = "Switch Palette:";
    switcher.appendChild(q);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'palette-buttons';
    switcher.appendChild(buttonsContainer);

    Object.keys(THEMES).forEach(name => {
        if (name === activeTheme) return;
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.style.background = THEMES[name];
        btn.onclick = () => setTheme(name);
        btn.title = name.replace('-', ' ');
        buttonsContainer.appendChild(btn);
    });
}

function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    const c1 = styles.getPropertyValue('--primary-color-rgb').trim() || "23, 217, 0";
    const c2 = styles.getPropertyValue('--accent-color-rgb').trim() || "224, 0, 224";
    const parse = str => str.split(',').map(v => parseInt(v, 10));
    return { C1: parse(c1), C2: parse(c2) };
}

/* ==========================================================================
   Interactive Background (p5.js Class)
   ========================================================================== */
class InteractiveBackground {
    constructor(container, mode = 'symbols') {
        this.container = container;
        this.mode = mode;
        this.symbolsArr = ['+', '-', '•', '/'];
        this.points = []; // For symbols mode
        this.streams = []; // For rain mode
        this.spacing = 60;
        this.instance = new p5(this.sketch.bind(this));
    }

    sketch(p) {
        p.setup = () => {
            const canvas = p.createCanvas(this.container.offsetWidth, this.container.offsetHeight);
            canvas.parent(this.container);
            canvas.style('position', 'absolute');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            canvas.style('pointer-events', 'none');

            p.textAlign(p.CENTER, p.CENTER);
            this.initEffect(p);
        };

        p.draw = () => {
            const { C1, C2 } = getThemeColors();
            p.clear();

            if (this.mode === 'symbols') {
                this.drawSymbols(p, C1, C2);
            } else if (this.mode === 'rain') {
                this.drawRain(p, C1, C2);
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(this.container.offsetWidth, this.container.offsetHeight);
            this.initEffect(p);
        };
    }

    initEffect(p) {
        if (this.mode === 'symbols') {
            this.initGrid(p);
        } else if (this.mode === 'rain') {
            this.initRain(p);
        }
    }

    /* Symbols Mode */
    initGrid(p) {
        this.points = [];
        for (let x = 0; x < p.width; x += this.spacing) {
            for (let y = 0; y < p.height; y += this.spacing) {
                this.points.push({
                    x: x + this.spacing / 2,
                    y: y + this.spacing / 2,
                    s: p.random(this.symbolsArr),
                    angle: p.random(p.TWO_PI)
                });
            }
        }
    }

    drawSymbols(p, C1, C2) {
        // Adjust mouse coordinates relative to container
        const rect = this.container.getBoundingClientRect();
        const mX = p.mouseX;
        const mY = p.mouseY;

        this.points.forEach(pt => {
            let d = p.dist(mX, mY, pt.x, pt.y);
            let maxDist = 200;
            let influence = p.map(p.min(d, maxDist), 0, maxDist, 20, 0);
            let angle = p.atan2(pt.y - mY, pt.x - mX);

            p.push();
            p.translate(pt.x + p.cos(angle) * influence, pt.y + p.sin(angle) * influence);
            p.rotate(pt.angle + (d < maxDist ? p.map(d, 0, maxDist, p.PI/4, 0) : 0));

            if (d < 150) {
                p.fill(C2[0], C2[1], C2[2], 180);
                p.textSize(20);
            } else {
                p.fill(C1[0], C1[1], C1[2], 60);
                p.textSize(14);
            }

            p.text(pt.s, 0, 0);
            p.pop();

            pt.angle += 0.005;
        });
    }

    /* Rain Mode */
    initRain(p) {
        this.streams = [];
        let x = 0;
        for (let i = 0; i <= p.width / 20; i++) {
            let stream = new Stream(p, x, p.random(-1000, 0));
            this.streams.push(stream);
            x += 20;
        }
    }

    drawRain(p, C1, C2) {
        p.textSize(16);
        this.streams.forEach(stream => {
            stream.render(p, C1, C2);
        });
    }
}

class Stream {
    constructor(p, x, y) {
        this.x = x;
        this.y = y;
        this.symbols = [];
        this.totalSymbols = p.round(p.random(5, 30));
        this.speed = p.random(2, 5);

        for (let i = 0; i < this.totalSymbols; i++) {
            this.symbols.push({
                value: p.round(p.random(0, 1)) === 1 ? "1" : "0",
                first: (i === 0 && p.random(1) > 0.5)
            });
        }
    }

    render(p, C1, C2) {
        this.symbols.forEach((symbol, index) => {
            if (symbol.first) {
                p.fill(C2[0], C2[1], C2[2], 200);
            } else {
                p.fill(C1[0], C1[1], C1[2], p.map(index, 0, this.totalSymbols, 255, 50));
            }
            p.text(symbol.value, this.x, this.y + (index * 20));
        });
        this.y += this.speed;
        if (this.y > p.height) {
            this.y = p.random(-500, 0);
        }
    }
}

/* ==========================================================================
   Interactive Touches (Magnetic & Tilt)
   ========================================================================== */
function initInteractiveTouches() {
    // 1. Magnetic Buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // 2. Card Tilt
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `translateY(0) rotateX(0) rotateY(0) scale(1)`;
        });
    });
}
