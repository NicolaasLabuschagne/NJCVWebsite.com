
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    const symbolChars = ['+', '-', '•', '/', '×'];
    const gridSize = 40;

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
                    x: x,
                    y: y,
                    char: p.random(symbolChars),
                    angle: p.random(p.TWO_PI),
                    size: p.random(8, 14)
                });
            }
        }
    }

    p.draw = () => {
        p.clear();

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colorValue = isDark ? 255 : 0;

        symbols.forEach(s => {
            let dx = p.mouseX - s.x;
            let dy = p.mouseY - s.y;
            let dist = p.sqrt(dx*dx + dy*dy);
            let offset = p.map(p.min(dist, 200), 0, 200, 20, 0);

            p.fill(colorValue, colorValue, colorValue, p.map(p.min(dist, 300), 0, 300, 40, 5));
            p.textSize(s.size);
            p.push();
            p.translate(s.x, s.y);
            p.rotate(s.angle + dist * 0.005);
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
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    const updateThemeIcon = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fa fa-moon-o'; // Bike with headlight vibe or just moon
        } else {
            icon.className = 'fa fa-sun-o';
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
       Journey Book Effect (StPageFlip)
       =========================== */
    const bookElement = document.getElementById('my-book');
    const pages = document.querySelectorAll('.page');

    if (bookElement && typeof St !== 'undefined') {
        const pageFlip = new St.PageFlip(bookElement, {
            width: 550,
            height: 700,
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false,
            flippingTime: 1000,
            usePortrait: false,
            startPage: 0
        });

        pageFlip.loadFromHTML(pages);
        window.pageFlip = pageFlip;

        // Sync scroll with page flips
        let lastScrollTime = 0;
        window.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastScrollTime < 1200) return;

            if (e.deltaY > 30) {
                pageFlip.flipNext();
                lastScrollTime = now;
            } else if (e.deltaY < -30) {
                pageFlip.flipPrev();
                lastScrollTime = now;
            }
        }, { passive: true });
    }

    /* ===========================
       Random Skill Tag Press
       =========================== */
    const skillTags = document.querySelectorAll('.tags span');
    const stickerColors = ['var(--lime-color)', 'var(--red-color)', 'var(--blue-color)', 'var(--yellow-color)', 'var(--purple-color)'];
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
