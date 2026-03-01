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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');

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

    // 5. Initialize Noise Backgrounds
    document.querySelectorAll('.noise').forEach(section => {
        attachNoiseBackground(`#${section.id}`);
    });

    // 7. Initialize Contour Backgrounds
    document.querySelectorAll('.contour').forEach(section => {
        attachContourBackground(`#${section.id}`);
    });

    // 8. IntersectionObserver to pause/resume contour canvases
    const contourObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const canvas = entry.target.querySelector('canvas');
            if (!canvas) return;

            const p5Instance = canvas.__p5Instance; // reference stored by p5
            if (!p5Instance) return;

            if (entry.isIntersecting) {
                p5Instance.loop();   // resume drawing
            } else {
                p5Instance.noLoop(); // pause drawing
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.contour').forEach(section => contourObserver.observe(section));
});


function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    const c1 = styles.getPropertyValue('--primary-color-rgb').trim() || "23, 217, 0";
    const c2 = styles.getPropertyValue('--accent-color-rgb').trim() || "224, 0, 224";
    const bg = styles.getPropertyValue('--bg-color-rgb').trim() || "0, 0, 0";
    const parse = str => str.split(',').map(v => parseInt(v, 10));
    return { C1: parse(c1), C2: parse(c2), BG: parse(bg) };
}

/* ==========================================================================
   p5.js Noise Background (Reusable)
   ========================================================================== */
function attachNoiseBackground(selector) {
    const container = document.querySelector(selector);

    if (!container) return;

    const sketch = (p) => {
        let symbolsArr = ['•', '•', '•', '+']; // More subtle symbols
        let points = [];
        let spacing = 100; // Increased spacing for a cleaner look

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
            let currentSpacing = spacing * 1.5; // Even more minimal grid
            for (let x = 0; x < p.width; x += currentSpacing) {
                for (let y = 0; y < p.height; y += currentSpacing) {
                    points.push({
                        x: x + currentSpacing / 2,
                        y: y + currentSpacing / 2,
                        s: p.random(symbolsArr),
                        angle: p.random(p.TWO_PI)
                    });
                }
            }
        };

        p.draw = () => {
            const { C1, C2 } = getThemeColors();
            p.clear();

            points.forEach(pt => {
                let d = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
                let maxDist = 150; // Reduced influence radius
                let influence = p.map(p.min(d, maxDist), 0, maxDist, 10, 0); // Reduced influence distance
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
        let rez = 15; // fine detail but balanced
        let cols, rows;
        let increment = 0.04;
        let zoff = 0;
        let xShift = 0;
        let yShift = 0;
        let C1, C2;
        let buffer;

        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
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

            buffer = p.createGraphics(container.offsetWidth, container.offsetHeight);
            buffer.strokeWeight(2);
            buffer.noFill();

            p.frameRate(30);
        };

        p.draw = () => {
    const { C1: newC1, C2: newC2, BG: newBG } = getThemeColors();
    C1 = newC1;
    C2 = newC2;
    BG = newBG;

    // Clear buffer with background color
    buffer.background(BG[0], BG[1], BG[2]);

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
                    case 1:  drawInteractiveSegment(p, buffer, c, d, C1, C2, rez); break;
                    case 2:  drawInteractiveSegment(p, buffer, b, c, C1, C2, rez); break;
                    case 3:  drawInteractiveSegment(p, buffer, b, d, C1, C2, rez); break;
                    case 4:  drawInteractiveSegment(p, buffer, a, b, C1, C2, rez); break;
                    case 5:  drawInteractiveSegment(p, buffer, a, d, C1, C2, rez); drawInteractiveSegment(p, buffer, b, c, C1, C2, rez); break;
                    case 6:  drawInteractiveSegment(p, buffer, a, c, C1, C2, rez); break;
                    case 7:  drawInteractiveSegment(p, buffer, a, d, C1, C2, rez); break;
                    case 8:  drawInteractiveSegment(p, buffer, a, d, C1, C2, rez); break;
                    case 9:  drawInteractiveSegment(p, buffer, a, c, C1, C2, rez); break;
                    case 10: drawInteractiveSegment(p, buffer, a, b, C1, C2, rez); drawInteractiveSegment(p, buffer, c, d, C1, C2, rez); break;
                    case 11: drawInteractiveSegment(p, buffer, a, b, C1, C2, rez); break;
                    case 12: drawInteractiveSegment(p, buffer, b, d, C1, C2, rez); break;
                    case 13: drawInteractiveSegment(p, buffer, b, c, C1, C2, rez); break;
                    case 14: drawInteractiveSegment(p, buffer, c, d, C1, C2, rez); break;
                }
            }
        }
    }

    // drift smoothly
    zoff += 0.001;
    xShift += 0.002;
    yShift += 0.001;

    // draw buffer to canvas
    p.image(buffer, -p.width / 2, -p.height / 2);
};

        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
            buffer = p.createGraphics(container.offsetWidth, container.offsetHeight);
            buffer.strokeWeight(2);
            buffer.noFill();
            cols = 1 + Math.floor(p.width / rez);
            rows = 1 + Math.floor(p.height / rez);
            field = Array.from({ length: cols }, () => Array(rows).fill(0));
        };

        // Pause when off-screen
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    p.loop();
                } else {
                    p.noLoop();
                }
            });
        });
        observer.observe(container);
    };

    new p5(sketch);
}

// Helpers
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
