
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    const symbolChars = ['★', '•', '✎', '➤', '❖'];
    const gridSize = 65;

    let easedMouseX = 0;
    let easedMouseY = 0;
    const easing = 0.08;

    let primaryColor = [190, 242, 100];
    let textColor = [0, 0, 0];

    function updateColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const style = getComputedStyle(document.body);

        const pRGB = style.getPropertyValue('--primary-color-rgb') || '190, 242, 100';
        primaryColor = pRGB.split(',').map(c => parseInt(c.trim()));

        const tRGB = style.getPropertyValue('--text-color-rgb') || (isDark ? '255,255,255' : '0,0,0');
        textColor = tRGB.split(',').map(c => parseInt(c.trim()));
    }

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        p.noStroke();
        p.textFont('Montserrat');

        updateColors();
        initSymbols();

        window.addEventListener('themeChanged', updateColors);
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
        if (document.body.classList.contains('theme-professional')) {
            p.clear();
            return;
        }

        p.clear();

        easedMouseX = p.lerp(easedMouseX, p.mouseX, easing);
        easedMouseY = p.lerp(easedMouseY, p.mouseY, easing);

        symbols.forEach(s => {
            const dx = easedMouseX - s.x;
            const dy = easedMouseY - s.y;
            const distSq = dx*dx + dy*dy;

            let dist = 250;
            let alpha;
            let color;
            let offset = 0;

            // Only calculate square root and complex logic if within 400px
            if (distSq < 160000) {
                dist = p.sqrt(distSq);

                if (dist < 250) {
                    offset = p.map(dist, 0, 250, 15, 0);
                }

                if (dist < 200) {
                    alpha = p.map(dist, 0, 200, 150, 2);
                    color = primaryColor;
                } else {
                    alpha = p.map(p.min(dist, 400), 0, 400, 30, 2);
                    color = textColor;
                }
            } else {
                alpha = 2;
                color = textColor;
            }

            p.fill(color[0], color[1], color[2], alpha);
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
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: mode }));
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

        // Initialize map with a global view
        const map = L.map('map', {
            scrollWheelZoom: false,
            zoomControl: true,
            attributionControl: false
        }).setView([15, 20], 2);

        const workHistory = ['AGO', 'AUS', 'BWA', 'ZAF'];
        let geojsonLayer;

        const getStyle = (feature) => {
            const isDark = document.documentElement.classList.contains('dark') ||
                           document.documentElement.getAttribute('data-theme') === 'dark';
            const isWorkRegion = workHistory.includes(feature.id);
            const bodyClass = document.body.className;
            const isProfessional = bodyClass.includes('theme-professional');
            const isFun = bodyClass.includes('theme-fun');

            if (isDark) {
                return {
                    fillColor: isWorkRegion ? 'var(--primary-color)' : 'transparent',
                    fillOpacity: isWorkRegion ? (isProfessional ? 0.2 : 0.4) : 0,
                    color: 'var(--primary-color)',
                    weight: isWorkRegion ? 3 : 1.2,
                    className: isProfessional ? '' : 'neon-map-outline',
                    dashArray: ''
                };
            } else {
                return {
                    fillColor: isWorkRegion ? '#bef264' : 'transparent',
                    fillOpacity: isWorkRegion ? (isProfessional ? 0.2 : 0.4) : 0,
                    color: isWorkRegion ? (isFun ? '#ff4a8d' : '#333333') : '#999999',
                    weight: isWorkRegion ? 2.5 : 1.2,
                    dashArray: isWorkRegion || isProfessional ? '' : '3, 6'
                };
            }
        };

        // Fetch and load world GeoJSON
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(response => response.json())
            .then(data => {
                geojsonLayer = L.geoJSON(data, {
                    style: getStyle,
                    onEachFeature: (feature, layer) => {
                        if (workHistory.includes(feature.id)) {
                            layer.bindPopup(`
                                <div class="font-headline font-bold uppercase text-primary-container">
                                    Project Territory: ${feature.properties.name}
                                </div>
                                <div class="font-mono text-xs mt-1 text-on-surface-variant">
                                    Strategic Industrial Integration
                                </div>
                            `);

                            layer.on('mouseover', function() {
                                this.setStyle({
                                    fillOpacity: 0.3,
                                    weight: 4
                                });
                            });

                            layer.on('mouseout', function() {
                                geojsonLayer.resetStyle(this);
                            });
                        }
                    }
                }).addTo(map);

                // Update style when theme changes
                window.addEventListener('themeChanged', () => {
                    if (geojsonLayer) geojsonLayer.setStyle(getStyle);
                });
            })
            .catch(err => console.error('Map loading failed:', err));
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
        this.initDigitalDebris();
    },

    initDigitalDebris() {
        const labSection = document.getElementById('the-lab');
        if (!labSection) return;

        const debrisChars = ['{ }', '[]', '</>', '01', '!', '??', '#', '/* */', '=>', '&&', '||'];
        const debrisCount = 12;

        for (let i = 0; i < debrisCount; i++) {
            const debris = document.createElement('div');
            debris.className = 'digital-debris debris-animate';
            debris.textContent = debrisChars[Math.floor(Math.random() * debrisChars.length)];

            // Random positioning
            const top = Math.random() * 80 + 10; // 10% to 90%
            const left = Math.random() * 80 + 10; // 10% to 90%
            const rot = (Math.random() - 0.5) * 60; // -30 to 30 deg

            debris.style.top = `${top}%`;
            debris.style.left = `${left}%`;
            debris.style.setProperty('--rot', `${rot}deg`);
            debris.style.setProperty('--delay', `${Math.random() * 5}s`);
            debris.style.transform = `rotate(${rot}deg)`;

            this.makeDraggable(debris);
            labSection.appendChild(debris);
        }
    },

    makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        el.onmousedown = dragMouseDown;
        el.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            el.classList.add('dragging');
            el.classList.remove('debris-animate');

            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos3 = e.clientX;
                pos4 = e.clientY;
            }

            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            let clientX, clientY;

            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            el.classList.remove('dragging');
            document.onmouseup = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.ontouchmove = null;
        }
    }
};

/* ===========================
   Vibe Engine: UI Personality Transitions
   =========================== */
const VibeEngine = {
    themes: ['theme-creative', 'theme-professional', 'theme-fun'],
    icons: [
        `<svg viewBox="0 0 84 95" width="128" height="145" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-32 h-32"><path d="M42 5 C28 15 22 30 22 50 V59 H62 V50 C62 30 56 15 42 5 Z"/><path d="M22 58.9 V71.9 C22 75.2 24.7 77.9 28 77.9 C31.3 77.9 34 75.2 34 71.9 V58.9 Z"/><path d="M36 58.9 V71.9 C36 75.2 38.7 77.9 42 77.9 C45.3 77.9 48 75.2 48 71.9 V58.9 Z"/><path d="M50.218 66.970884 V79.77829 C50.218 87.002 55.348 92.213 66.907 92.752 C78.466 92.213 83.948 86.884 83.948 78.66 C83.948 75.694 82.363 73.873 78.317 73.873 C74.272 73.873 72.761 75.93 72.568 78.626 C72.376 81.862 70.395 82.977 67.408 82.977 C64.539 82.977 61.97 81.609 61.97 78.778 V58.882 H50.218 Z"/><circle cx="30" cy="40" r="5" fill="#000"/><circle cx="54" cy="40" r="5" fill="#000"/></svg>`,
        `<svg viewBox="0 0 85 95" width="128" height="145" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-32 h-32"><path d="M49.400192 5 C35.400192 15 29.400192 30 29.400192 50 V59 H69.400192 V50 C69.400192 30 63.400192 15 49.400192 5 Z"/><path d="M29.41 58.889 V71.889 C29.41 75.189 32.11 77.889 35.41 77.889 C38.71 77.889 41.41 75.189 41.41 71.889 V58.889 Z"/><path d="M43.400192 58.9 V71.9 C43.400192 75.2 46.100193 77.9 49.400192 77.9 C52.700192 77.9 55.400192 75.2 55.400192 71.9 V58.9 Z"/><path d="M57.343 58.9 V71.9 C57.343 75.2 60.043 77.9 63.343 77.9 C66.643 77.9 69.343 75.2 69.343 71.9 V58.9 Z"/><circle cx="37.400188" cy="40" r="5" fill="#000"/><circle cx="61.400173" cy="40" r="5" fill="#000"/><rect x="29.237947" y="49.611198" width="40.279938" height="1.2441679" fill="#000"/><path d="M49.278653 50.208145 L47.378408 61.280031 L49.246036 63.768367 L51.087923 61.312307 Z" fill="#000"/></svg>`,
        `<svg viewBox="0 0 24 24" width="128" height="128" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-32 h-32"><path d="M13.941 1.263C9.985 3.789 8.294 7.579 8.294 12.632V14.895H19.588V12.632C19.588 7.579 17.894 3.789 13.941 1.263Z"/><path d="M16.217 14.872V18.159C16.217 18.999 16.985 19.588 17.915 19.588C18.845 19.588 19.588 18.999 19.588 18.159V14.872Z"/><path d="M12.257 14.872V18.159C12.257 18.999 13.017 19.588 13.941 19.588C14.865 19.588 15.642 18.999 15.642 18.159V14.872Z"/><path d="M11.616 16.918V20.149C11.616 21.976 9.893 23.548 6.623 23.699C3.64 23.548 1.606 22.205 1.606 20.149C1.606 19.817 2.159 18.803 3.259 18.816C4.189 18.828 4.762 19.36 4.938 19.926C5.038 20.744 5.788 21.218 6.707 21.197C7.528 21.179 8.294 20.579 8.294 19.863V14.882H11.616Z"/><circle cx="10.564" cy="10.105" r="1.263" fill="#000"/><circle cx="17.329" cy="10.105" r="1.263" fill="#000"/></svg>`
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
