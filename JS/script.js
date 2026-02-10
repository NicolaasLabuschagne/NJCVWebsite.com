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

    // 5. Initialize Binary Rain
    startRain();

    // 6. Initialize Noise Backgrounds
    document.querySelectorAll('.noise').forEach(section => {
        attachNoiseBackground(`#${section.id}`);
    });
});

/* ==========================================================================
   Theme System
   ========================================================================== */
const THEMES = {
    "navy-orange": "#FF6B35",
    "default": "#A8E600"
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
   p5.js Noise Background (Reusable)
   ========================================================================== */
function attachNoiseBackground(selector) {
    const container = document.querySelector(selector);

    if (!container) return;

    const sketch = (p) => {
        let symbolsArr = ['+', '-', '•', '/'];
        let points = [];
        let spacing = 60;

        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent(container); // attach canvas to the container
            canvas.style('position', 'absolute');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            p.textAlign(p.CENTER, p.CENTER);
            initGrid();
        };

        const initGrid = () => {
            points = [];
            for (let x = 0; x < p.width; x += spacing) {
                for (let y = 0; y < p.height; y += spacing) {
                    points.push({
                        x: x + spacing / 2,
                        y: y + spacing / 2,
                        s: p.random(symbolsArr),
                        angle: p.random(p.TWO_PI)
                    });
                }
            }
        };

        p.draw = () => {
            const { C1, C2 } = getThemeColors(); // your theme function
            p.clear();

            points.forEach(pt => {
                let d = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
                let maxDist = 200;
                let influence = p.map(p.min(d, maxDist), 0, maxDist, 20, 0);
                let angle = p.atan2(pt.y - p.mouseY, pt.x - p.mouseX);

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
        };

        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
            initGrid();
        };
    };

    new p5(sketch);
}

/*================================================================*/
//                    Timeline Horizontal Scroll
/*================================================================*/

const timelineWrapper = document.querySelector('.timeline-wrapper');
const timeline = document.querySelector('.timeline');

timelineWrapper.addEventListener('wheel', (e) => {
  e.preventDefault(); // stop default vertical scroll

  const maxScroll = timeline.scrollWidth - window.innerWidth;

  // Scroll horizontally until the end
  if (
    (e.deltaY > 0 && timeline.scrollLeft < maxScroll) ||
    (e.deltaY < 0 && timeline.scrollLeft > 0)
  ) {
    timeline.scrollLeft += e.deltaY;
  } else {
    // Resume normal vertical scroll once horizontal is finished
    window.scrollBy(0, e.deltaY);
  }
}, { passive: false });