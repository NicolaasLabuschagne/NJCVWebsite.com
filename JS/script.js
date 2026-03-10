
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
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach(el => observer.observe(el));

    /* ===========================
       Theme Toggle
       =========================== */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    const updateThemeIcon = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fa fa-compass';
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
       Book Navigation Logic
       =========================== */
    const pages = document.querySelectorAll('.page');
    const nextBtn = document.getElementById('next-page');
    const prevBtn = document.getElementById('prev-page');
    let currentPageIndex = 0;

    const updatePages = () => {
        pages.forEach((page, index) => {
            // Remove previous states
            page.classList.remove('active', 'flipped');

            if (index === currentPageIndex) {
                page.classList.add('active');
            } else if (index < currentPageIndex) {
                page.classList.add('flipped');
            }
        });

        // Disable buttons at ends
        prevBtn.disabled = (currentPageIndex === 0);
        nextBtn.disabled = (currentPageIndex === pages.length - 1);
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';

        // Re-initialize map if on the map page
        const mapPage = document.getElementById('page-map');
        if (mapPage && mapPage.classList.contains('active')) {
            setTimeout(() => {
                if (window.portfolioMap) {
                    window.portfolioMap.invalidateSize();
                }
            }, 800);
        }

        // Trigger animations for new page
        const activePageReveals = pages[currentPageIndex].querySelectorAll('.animate-reveal');
        activePageReveals.forEach(el => el.classList.add('active'));
    };

    nextBtn.addEventListener('click', () => {
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            updatePages();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updatePages();
        }
    });

    // Nav link clicks to jump to pages
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetPage = document.getElementById('page-' + targetId);
            if (targetPage) {
                e.preventDefault();
                const pageIndex = Array.from(pages).indexOf(targetPage);
                if (pageIndex !== -1) {
                    currentPageIndex = pageIndex;
                    updatePages();
                }
            }
        });
    });

    /* ===========================
       Interactive Map
       =========================== */
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([-25.864, 28.188], 10);
        window.portfolioMap = map;

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
    }

    /* ===========================
       Random Skill Tag Press
       =========================== */
    const skillTags = document.querySelectorAll('.tags span');
    const stickerColors = ['var(--success-color)', 'var(--error-color)', 'var(--info-color)', 'var(--primary-color)', 'var(--purple-color)'];
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

    // Initial state
    updatePages();
});

/* ===========================
   p5.js Architectural Sketch
   =========================== */
let sketch = (p) => {
    let symbols = ['+', '-', '•', '/', '×'];
    let spacing = 40;

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '1');
        canvas.style('pointer-events', 'none');
        canvas.style('opacity', '0.3');
        p.noFill();
    };

    p.draw = () => {
        p.clear();

        // Get theme colors
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        p.stroke(isDark ? 255 : 0);
        p.strokeWeight(1);

        for (let x = spacing / 2; x < p.width; x += spacing) {
            for (let y = spacing / 2; y < p.height; y += spacing) {
                // Subtle interaction with mouse
                let d = p.dist(p.mouseX, p.mouseY, x, y);
                if (d < 150) {
                    let angle = p.map(d, 0, 150, p.TWO_PI, 0);
                    p.push();
                    p.translate(x, y);
                    p.rotate(angle);
                    let symbol = symbols[Math.floor((x + y) / spacing) % symbols.length];
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(12);
                    p.text(symbol, 0, 0);
                    p.pop();
                } else {
                    p.point(x, y);
                }
            }
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

new p5(sketch);
