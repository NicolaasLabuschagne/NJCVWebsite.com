document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for reveal animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));

    // 2. Sticky header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');
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

    // 5. Initialize Binary Rain
    startRain();
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

    // Pick random initial theme that isn't the saved one (for variety)
    let initialTheme = keys[Math.floor(Math.random() * keys.length)];
    if (saved && keys.includes(saved)) {
        // Just use saved or pick a different one? Let's stick with saved if exists, else random
        initialTheme = saved;
    }

    setTheme(initialTheme);

    // Keyboard shortcuts (Arrow Left/Right)
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

    switcher.innerHTML = ''; // Clear

    const q = document.createElement('div');
    q.className = 'palette-question';
    q.textContent = "Switch Palette:";
    switcher.appendChild(q);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'palette-buttons';
    switcher.appendChild(buttonsContainer);

    Object.keys(THEMES).forEach(name => {
        if (name === activeTheme) return; // Don't show current
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
   Binary Rain
   ========================================================================== */
function startRain() {
    const cloud = document.querySelector('.cloud');
    if (!cloud) return;

    setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.innerText = Math.random() > 0.5 ? '1' : '0';

        const size = Math.random();
        if (size < 0.3) drop.classList.add('small');
        else if (size > 0.8) drop.classList.add('large');

        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = (1 + Math.random() * 2) + 's';
        drop.style.setProperty('--horizontal-movement', (Math.random() * 40 - 20) + 'px');

        cloud.appendChild(drop);
        drop.onanimationend = () => drop.remove();
    }, window.innerWidth < 700 ? 150 : 80);
}

/* ==========================================================================
   p5.js Reactive Background
   ========================================================================== */
let symbols = ['+', '-', '•', '/'];
let grid = [];
let spacing = 60;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    textAlign(CENTER, CENTER);
    initGrid();
}

function initGrid() {
    grid = [];
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            grid.push({
                x: x + spacing / 2,
                y: y + spacing / 2,
                s: random(symbols),
                angle: random(TWO_PI)
            });
        }
    }
}

function draw() {
    const { C1, C2 } = getThemeColors();
    clear();

    grid.forEach(p => {
        let d = dist(mouseX, mouseY, p.x, p.y);
        let maxDist = 200;
        let influence = map(min(d, maxDist), 0, maxDist, 20, 0);
        let angle = atan2(p.y - mouseY, p.x - mouseX);

        push();
        translate(p.x + cos(angle) * influence, p.y + sin(angle) * influence);
        rotate(p.angle + (d < maxDist ? map(d, 0, maxDist, PI/4, 0) : 0));

        if (d < 150) {
            fill(C2[0], C2[1], C2[2], 180);
            textSize(20);
        } else {
            fill(C1[0], C1[1], C1[2], 60);
            textSize(14);
        }

        text(p.s, 0, 0);
        pop();

        p.angle += 0.005;
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initGrid();
}
