document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-reveal').forEach(el => revealObserver.observe(el));

    // 2. Sticky header & Scroll Progress
    const header = document.querySelector('.header');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";
    }, 16));

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

    // 4. Initialize Color Cache
    updateColorCache();

    // 5. Initialize Binary Rain
    startRain();

    // 6. Initialize Noise Backgrounds
    document.querySelectorAll('.noise').forEach(section => {
        attachNoiseBackground(`#${section.id}`);
    });

    // 7. Initialize Contour Backgrounds
    document.querySelectorAll('.contour').forEach(section => {
        attachContourBackground(`#${section.id}`);
    });

    // 8. IntersectionObserver to pause/resume all p5 background canvases
    const bgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const canvas = entry.target.querySelector('canvas');
            if (!canvas) return;

            const p5Instance = canvas.__p5Instance;
            if (!p5Instance) return;

            if (entry.isIntersecting) {
                p5Instance.loop();
            } else {
                p5Instance.noLoop();
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.noise, .contour').forEach(section => bgObserver.observe(section));
});

/* ==========================================================================
   Color System
   ========================================================================== */
let cachedColors = null;

function updateColorCache() {
    const styles = getComputedStyle(document.documentElement);
    const c1 = styles.getPropertyValue('--primary-color-rgb').trim() || "168, 230, 0";
    const c2 = styles.getPropertyValue('--accent-color-rgb').trim() || "114, 191, 120";
    const bg = styles.getPropertyValue('--bg-color-rgb').trim() || "28, 61, 46";
    const parse = str => str.split(',').map(v => parseInt(v, 10));
    cachedColors = { C1: parse(c1), C2: parse(c2), BG: parse(bg) };
}

function getThemeColors() {
    if (!cachedColors) updateColorCache();
    return cachedColors;
}

/* ==========================================================================
   Binary Rain
   ========================================================================== */
function startRain() {
    const canvas = document.getElementById('rain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, maxDrops;
    const setCanvasSize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        maxDrops = w < 700 ? 40 : 80;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const drops = [];

    function createDrop() {
        return {
            x: Math.random() * w,
            y: -20,
            text: Math.random() > 0.5 ? '1' : '0',
            speed: 2 + Math.random() * 4,
            size: 10 + Math.random() * 10,
            opacity: 0.2 + Math.random() * 0.6,
            horizontal: (Math.random() * 2 - 1) * 0.3
        };
    }

    let isVisible = true;
    const observer = new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0.01 });
    observer.observe(canvas);

    function animate() {
        if (isVisible) {
            ctx.clearRect(0, 0, w, h);

            const colors = getThemeColors();
            const c = colors.C1;

            if (drops.length < maxDrops && Math.random() < 0.2) {
                drops.push(createDrop());
            }

            for (let i = drops.length - 1; i >= 0; i--) {
                const d = drops[i];
                ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${d.opacity})`;
                ctx.font = `${d.size}px monospace`;
                ctx.fillText(d.text, d.x, d.y);

                d.y += d.speed;
                d.x += d.horizontal;

                if (d.y > h + 20) {
                    drops.splice(i, 1);
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
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
            canvas.elt.__p5Instance = p;
            canvas.parent(container); // attach canvas to the container
            canvas.style('position', 'absolute');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            p.textAlign(p.CENTER, p.CENTER);
            initGrid();
            p.noLoop();
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

/* ==========================================================================
   p5.js Contour Background (GPU Optimized, Reusable for .contour sections)
   ========================================================================== */
function attachContourBackground(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const sketch = (p) => {
        let field = [];
        let rez = 25; // Optimized for performance
        let cols, rows;
        let increment = 0.04;
        let zoff = 0;
        let xShift = 0;
        let yShift = 0;
        let C1, C2, BG;

        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent(container);
            canvas.style('position', 'absolute');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            canvas.style('will-change', 'transform');
            canvas.style('transform', 'translateZ(0)');

            // Store reference so external observer can access it
            canvas.elt.__p5Instance = p;

            cols = 1 + Math.floor(p.width / rez);
            rows = 1 + Math.floor(p.height / rez);
            field = Array.from({ length: cols }, () => Array(rows).fill(0));

            p.strokeWeight(2);
            p.noFill();

            p.frameRate(30);
            p.noLoop();
        };

        p.draw = () => {
            const colors = getThemeColors();
            C1 = colors.C1;
            C2 = colors.C2;
            BG = colors.BG;

            p.background(BG[0], BG[1], BG[2]);

    // build drifting noise field
    let xoff = 0;
    for (let i = 0; i < cols; i++) {
        xoff += increment;
        let yoff = 0;
        for (let j = 0; j < rows; j++) {
            field[i][j] = p.noise(xoff + xShift, yoff + yShift, zoff);
            yoff += increment;
        }
    }

    // draw contour bands
    for (let h = 0.4; h <= 0.6; h += 0.1) {
        for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const f0 = field[i][j] - h;
                const f1 = field[i + 1][j] - h;
                const f2 = field[i + 1][j + 1] - h;
                const f3 = field[i][j + 1] - h;

                const x = i * rez;
                const y = j * rez;

                const a = p.createVector(x + (rez * f0) / (f0 - f1), y);
                const b = p.createVector(x + rez, y + (rez * f1) / (f1 - f2));
                const c = p.createVector(x + rez * (1 - f2 / (f2 - f3)), y + rez);
                const d = p.createVector(x, y + rez * (1 - f3 / (f3 - f0)));

                const state = getState(f0, f1, f2, f3);

                switch (state) {
                    case 1:  drawInteractiveSegment(p, p, c, d, C1, C2, rez); break;
                    case 2:  drawInteractiveSegment(p, p, b, c, C1, C2, rez); break;
                    case 3:  drawInteractiveSegment(p, p, b, d, C1, C2, rez); break;
                    case 4:  drawInteractiveSegment(p, p, a, b, C1, C2, rez); break;
                    case 5:  drawInteractiveSegment(p, p, a, d, C1, C2, rez); drawInteractiveSegment(p, p, b, c, C1, C2, rez); break;
                    case 6:  drawInteractiveSegment(p, p, a, c, C1, C2, rez); break;
                    case 7:  drawInteractiveSegment(p, p, a, d, C1, C2, rez); break;
                    case 8:  drawInteractiveSegment(p, p, a, d, C1, C2, rez); break;
                    case 9:  drawInteractiveSegment(p, p, a, c, C1, C2, rez); break;
                    case 10: drawInteractiveSegment(p, p, a, b, C1, C2, rez); drawInteractiveSegment(p, p, c, d, C1, C2, rez); break;
                    case 11: drawInteractiveSegment(p, p, a, b, C1, C2, rez); break;
                    case 12: drawInteractiveSegment(p, p, b, d, C1, C2, rez); break;
                    case 13: drawInteractiveSegment(p, p, b, c, C1, C2, rez); break;
                    case 14: drawInteractiveSegment(p, p, c, d, C1, C2, rez); break;
                }
            }
        }
    }

    // drift smoothly
    zoff += 0.001;
    xShift += 0.002;
    yShift += 0.001;
};

        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
            p.strokeWeight(2);
            p.noFill();
            cols = 1 + Math.floor(p.width / rez);
            rows = 1 + Math.floor(p.height / rez);
            field = Array.from({ length: cols }, () => Array(rows).fill(0));
        };

    };

    new p5(sketch);
}

// Helpers
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function getState(a, b, c, d) {
    return (a > 0 ? 8 : 0) + (b > 0 ? 4 : 0) + (c > 0 ? 2 : 0) + (d > 0 ? 1 : 0);
}

function drawInteractiveSegment(p, g, p1, p2, C1, C2, rez) {
    const mid = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    const d = p.dist(p.mouseX, p.mouseY, mid.x, mid.y);

    let col = C1;
    let offsetStrength = 0;

    if (d < 100) {
        col = C2;
        offsetStrength = p.map(d, 0, 100, 15, 0);
    }

    g.stroke(col[0], col[1], col[2]);

    const repel = p.createVector(mid.x - p.mouseX, mid.y - p.mouseY).setMag(offsetStrength);

    const tx = p2.x - p1.x;
    const ty = p2.y - p1.y;
    const len = Math.max(1, Math.hypot(tx, ty));
    const nx = tx / len;
    const ny = ty / len;

    const alpha = rez * 0.3;
    const cp1 = { x: p1.x + nx * alpha + repel.x, y: p1.y + ny * alpha + repel.y };
    const cp2 = { x: p2.x - nx * alpha + repel.x, y: p2.y - ny * alpha + repel.y };

    g.bezier(p1.x, p1.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
}

/*================================================================
                   Timeline Horizontal Scroll
================================================================*/

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