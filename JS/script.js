document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove class to re-trigger animations on scroll
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-reveal');
    animateElements.forEach(el => observer.observe(el));

    // Smooth scroll for nav links (though CSS scroll-behavior: smooth handles most of it)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for sticky header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Sticky header change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
});
window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback);
        }
    );
})();

const themes = {
  molten: "#FF6A00",
  acid: "#E000E0",
  red: "#FF0033",
  glitch: "#FF00FF",
  forestember: "#394515",
};
function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const c1 = styles.getPropertyValue('--primary-color-rgb').trim();
  const c2 = styles.getPropertyValue('--accent-color-rgb').trim();
  const bg = styles.getPropertyValue('--bg-color-rgb').trim();

  // convert "23, 217, 0" → [23,217,0]
  const parse = str => str.split(',').map(v => parseInt(v, 10));
  return {
    C1: c1 ? parse(c1) : [100, 116, 139],
    C2: c2 ? parse(c2) : [245, 158, 11],
    BG: bg ? parse(bg) : [15, 23, 42]
  };
}

function setTheme(theme) {
  if (!themes[theme]) return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  renderPaletteButtons(theme);
}

function renderPaletteButtons(activeTheme) {
  const switcher = document.querySelector('.palette-switcher');
  if (!switcher) return;

  if (!switcher.querySelector('.palette-question')) {
    const q = document.createElement('div');
    q.className = 'palette-question';
    q.setAttribute('role', 'note');
    q.textContent = "Don’t like the colour? Why not change it.";
    const btns = switcher.querySelector('.palette-buttons');
    if (btns) switcher.insertBefore(q, btns);
    else switcher.prepend(q);
  }

  let buttonsContainer = switcher.querySelector('.palette-buttons');
  if (!buttonsContainer) {
    buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'palette-buttons';
    buttonsContainer.setAttribute('role', 'group');
    buttonsContainer.setAttribute('aria-label', 'Colour options');
    switcher.appendChild(buttonsContainer);
  }

  buttonsContainer.innerHTML = '';

  const keys = Object.keys(themes);
  const startIndex = keys.indexOf(activeTheme);
  const visible = [];
  for (let i = 1; visible.length < 3 && i < keys.length + 1; i++) {
    const candidate = keys[(startIndex + i) % keys.length];
    if (candidate !== activeTheme) visible.push(candidate);
  }

  visible.forEach(name => {
    const color = themes[name];
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.dataset.theme = name;
    btn.style.background = color;
    btn.setAttribute('aria-label', name);
    btn.title = name.charAt(0).toUpperCase() + name.slice(1);
    buttonsContainer.appendChild(btn);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const keys = Object.keys(themes);
  const saved = localStorage.getItem('theme');

  // Helper: pick a random key different from `exclude` (tries up to N times)
  const pickRandomDifferent = (exclude) => {
    if (!exclude) return keys[Math.floor(Math.random() * keys.length)];
    if (keys.length === 1) return keys[0];
    let pick;
    const maxTries = 8;
    let tries = 0;
    do {
      pick = keys[Math.floor(Math.random() * keys.length)];
      tries++;
    } while (pick === exclude && tries < maxTries);
    // If still same after attempts (unlikely), pick next key in array
    if (pick === exclude) {
      const idx = keys.indexOf(exclude);
      pick = keys[(idx + 1) % keys.length];
    }
    return pick;
  };

  // If you want "random each visit but not the same as last", use this:
  const initialTheme = pickRandomDifferent(saved);
  setTheme(initialTheme);

  // Delegated click handler for palette buttons
  const switcher = document.querySelector('.palette-switcher');
  if (switcher && !switcher.__paletteHandlerAttached) {
    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.palette-btn');
      if (!btn) return;
      const theme = btn.getAttribute('data-theme');
      if (theme) setTheme(theme);
    });
    switcher.__paletteHandlerAttached = true;
  }
});

(function(){
  
  const CHAR_POOL = ['0', '1', '+', '-', '•', '/'];

  function randomChar(){
    return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
  }

  function spawnDrop(cloud){
    const e = document.createElement('div');
    e.classList.add('drop');

    const r = Math.random();
    if (r < 0.25) e.classList.add('small');
    else if (r < 0.7) e.classList.add('medium');
    else e.classList.add('large');

    e.innerText = randomChar();

    const cloudRect = cloud.getBoundingClientRect();
    const left = Math.floor(Math.random() * Math.max(1, cloudRect.width));
    e.style.left = left + 'px';

    const duration = 1.2 + Math.random() * 1.0;
    e.style.animationDuration = duration + 's';

    const horiz = (Math.random() > 0.5 ? 8 : -8) * (0.5 + Math.random());
    e.style.setProperty('--horizontal-movement', horiz + 'px');

    cloud.appendChild(e);
    e.addEventListener('animationend', () => {
      if (e.parentNode) e.parentNode.removeChild(e);
    }, { once: true });
  }

  function startRain(){
    const cloud = document.querySelector('.cloud');
    if (!cloud) return;

    const baseInterval = (window.innerWidth < 700) ? 90 : 40;

    let last = 0;
    setInterval(() => {
      if (Math.random() < 0.85) spawnDrop(cloud);
      else if (Math.random() < 0.25) spawnDrop(cloud);
    }, baseInterval);
  }

  // run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRain);
  } else {
    startRain();
  }
})();
const popup = document.getElementById('theme-popup');
if (popup) {
  setTimeout(() => {
    popup.classList.add('show');

    // Auto-hide after 11 seconds (total visible time = 14s)
    setTimeout(() => {
      popup.classList.remove('show');
    }, 11000);
  }, 3000); // Delay before showing
}

// Helper: return index of current theme, or 0 if not found
function getCurrentThemeIndex() {
  const keys = Object.keys(themes);
  const current = document.documentElement.getAttribute('data-theme');
  const idx = keys.indexOf(current);
  return idx >= 0 ? idx : 0;
}

// Cycle to previous or next theme by offset (-1 or +1)
function cycleTheme(offset) {
  const keys = Object.keys(themes);
  if (keys.length === 0) return;
  const currentIndex = getCurrentThemeIndex();
  const nextIndex = (currentIndex + offset + keys.length) % keys.length;
  const nextTheme = keys[nextIndex];
  setTheme(nextTheme);
}

// Keyboard handler
function onThemeKeydown(e) {
  // Ignore if any modifier keys are pressed
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

  // Ignore when typing in inputs, textareas, or contenteditable elements
  const tag = document.activeElement && document.activeElement.tagName;
  const isEditable = document.activeElement && (
    document.activeElement.isContentEditable ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT'
  );
  if (isEditable) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    cycleTheme(-1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    cycleTheme(1);
  }
}

// Attach once (safe guard)
if (!window.__themeKeyboardAttached) {
  window.addEventListener('keydown', onThemeKeydown);
  window.__themeKeyboardAttached = true;
}

let field = [];
let rez = 12;
let cols, rows;
let increment = 0.02;
let zoff = 0;
let xShift = 0;
let yShift = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = 1 + Math.floor(width / rez);
  rows = 1 + Math.floor(height / rez);
  field = Array.from({ length: cols }, () => Array(rows).fill(0));
  strokeWeight(2);
  noFill();
}

function draw() {
    const { C1: newC1, C2: newC2, BG: newBG } = getThemeColors();
    C1 = newC1;
    C2 = newC2;
    BG = newBG;

    background(BG[0], BG[1], BG[2]);

  // build drifting noise field
  let xoff = 0;
  for (let i = 0; i < cols; i++) {
    xoff += increment;
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      field[i][j] = noise(xoff + xShift, yoff + yShift, zoff);
      yoff += increment;
    }
  }

  // draw contour bands
  for (let h = 0.3; h <= 0.7; h += 0.05) {
    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        const f0 = field[i][j] - h;
        const f1 = field[i + 1][j] - h;
        const f2 = field[i + 1][j + 1] - h;
        const f3 = field[i][j + 1] - h;

        const x = i * rez;
        const y = j * rez;

        const a = createVector(x + (rez * f0) / (f0 - f1), y);
        const b = createVector(x + rez, y + (rez * f1) / (f1 - f2));
        const c = createVector(x + rez * (1 - f2 / (f2 - f3)), y + rez);
        const d = createVector(x, y + rez * (1 - f3 / (f3 - f0)));

        const state = getState(f0, f1, f2, f3);

        switch (state) {
          case 1:  drawInteractiveSegment(c, d); break;
          case 2:  drawInteractiveSegment(b, c); break;
          case 3:  drawInteractiveSegment(b, d); break;
          case 4:  drawInteractiveSegment(a, b); break;
          case 5:  drawInteractiveSegment(a, d); drawInteractiveSegment(b, c); break;
          case 6:  drawInteractiveSegment(a, c); break;
          case 7:  drawInteractiveSegment(a, d); break;
          case 8:  drawInteractiveSegment(a, d); break;
          case 9:  drawInteractiveSegment(a, c); break;
          case 10: drawInteractiveSegment(a, b); drawInteractiveSegment(c, d); break;
          case 11: drawInteractiveSegment(a, b); break;
          case 12: drawInteractiveSegment(b, d); break;
          case 13: drawInteractiveSegment(b, c); break;
          case 14: drawInteractiveSegment(c, d); break;
        }
      }
    }
  }

  // drift smoothly
  zoff += 0.001;
  xShift += 0.002;
  yShift += 0.001;
}

function getState(a, b, c, d) {
  return (a > 0 ? 8 : 0) + (b > 0 ? 4 : 0) + (c > 0 ? 2 : 0) + (d > 0 ? 1 : 0);
}

// Draw a curved segment, with mouse interaction
function drawInteractiveSegment(p1, p2) {
  // midpoint of the segment
  const mid = createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  const d = dist(mouseX, mouseY, mid.x, mid.y);

  let col = C1; // default teal
  let offsetStrength = 0;

  if (d < 100) { // within hover radius
    col = C2; // switch to purple
    offsetStrength = map(d, 0, 100, 15, 0); // repel stronger when closer
  }

  stroke(col[0], col[1], col[2]);

  // repel control points away from mouse
  const repel = createVector(mid.x - mouseX, mid.y - mouseY).setMag(offsetStrength);

  const tx = p2.x - p1.x;
  const ty = p2.y - p1.y;
  const len = Math.max(1, Math.hypot(tx, ty));
  const nx = tx / len;
  const ny = ty / len;

  const alpha = rez * 0.3;
  const cp1 = { x: p1.x + nx * alpha + repel.x, y: p1.y + ny * alpha + repel.y };
  const cp2 = { x: p2.x - nx * alpha + repel.x, y: p2.y - ny * alpha + repel.y };

  bezier(p1.x, p1.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = 1 + Math.floor(width / rez);
  rows = 1 + Math.floor(height / rez);
  field = Array.from({ length: cols }, () => Array(rows).fill(0));
}