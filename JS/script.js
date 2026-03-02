let pageFlip;

window.onload = () => {
    // 1. Initialize StPageFlip
    const bookElement = document.getElementById('book');
    if (bookElement && typeof St !== 'undefined') {
        pageFlip = new St.PageFlip(bookElement, {
            width: 550, // base page width
            height: 733, // base page height (A4 ratio)
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false,
            usePortrait: true,
            flippingTime: 1000,
            swipeDistance: 30,
            showPageCorners: false,
            disableFlipByClick: false
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Update progress bar on flip
        pageFlip.on('flip', (e) => {
            updateProgressBar(e.data);
        });
    }

    // 2. Navigation logic
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(link.getAttribute('data-page'));
            console.log("Nav click, target page:", pageNum);
            if (pageFlip && !isNaN(pageNum)) {
                console.log("Calling flip...");
                pageFlip.flip(pageNum);
            }
        });
    });

    // 3. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        updateThemeIcon(targetTheme);

        // Refresh maps
        refreshMapTiles();
        refreshGlobalMapTiles();
    });

    // 4. Initialize Maps
    initMaps();

    // 5. Skills Random Press Effect
    setInterval(randomSkillsPress, 3000);
};

function randomSkillsPress() {
    const cards = document.querySelectorAll('.work-page .card');
    if (cards.length === 0) return;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.style.transform = 'scale(0.95)';
    randomCard.style.boxShadow = 'inset 0 5px 10px rgba(0,0,0,0.2)';
    setTimeout(() => {
        randomCard.style.transform = '';
        randomCard.style.boxShadow = '';
    }, 200);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    if (theme === 'dark') {
        icon.className = 'fa fa-bicycle'; // Bike with headlight vibe
    } else {
        icon.className = 'fa fa-sun-o'; // Sun/Day vibe
    }
}

function updateProgressBar(pageIndex) {
    const totalPages = pageFlip.getPageCount();
    const progress = (pageIndex / (totalPages - 1)) * 100;
    const bar = document.querySelector('.progress-bar');
    const bike = document.querySelector('.bike-icon');

    if (bar) bar.style.width = `${progress}%`;
    if (bike) bike.style.left = `${progress}%`;
}

let map;
let tileLayer;

let globalMap;
let globalTileLayer;

function initMaps() {
    const journeyMapEl = document.getElementById('journey-map');
    if (journeyMapEl) {
        map = L.map('journey-map', {
            zoomControl: false,
            attributionControl: false
        }).setView([-25.86, 28.18], 11);

        refreshMapTiles();

        const locations = [
            { pos: [-25.7479, 28.2293], title: "Pretoria", desc: "Where the journey began." },
            { pos: [-25.8640, 28.1889], title: "Centurion", desc: "Core development & Systems Architecture." },
            { pos: [-26.2041, 28.0473], title: "Johannesburg", desc: "Innovation & Collaboration." }
        ];

        const customIcon = L.divIcon({
            html: '<i class="fa fa-map-marker" style="color: #b71c1c; font-size: 24px;"></i>',
            className: 'custom-div-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        locations.forEach(loc => {
            L.marker(loc.pos, { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${loc.title}</b><br>${loc.desc}`);
        });
    }

    const globalMapEl = document.getElementById('global-map');
    if (globalMapEl) {
        globalMap = L.map('global-map', {
            zoomControl: false,
            attributionControl: false
        }).setView([20, 0], 2);

        refreshGlobalMapTiles();

        const globalLocations = [
            { pos: [-25.7479, 28.2293], title: "South Africa", desc: "Home base." },
            { pos: [51.5074, -0.1278], title: "Remote Collaboration", desc: "Connecting with global partners." }
        ];

        const customIcon = L.divIcon({
            html: '<i class="fa fa-globe" style="color: #38bdf8; font-size: 24px;"></i>',
            className: 'custom-div-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        globalLocations.forEach(loc => {
            L.marker(loc.pos, { icon: customIcon })
                .addTo(globalMap)
                .bindPopup(`<b>${loc.title}</b>`);
        });
    }

    if (pageFlip) {
        pageFlip.on('flip', (e) => {
            if (e.data === 8 && map) { // Journey Map index
                setTimeout(() => map.invalidateSize(), 300);
            }
            if (e.data === 10 && globalMap) { // Global Map index
                setTimeout(() => globalMap.invalidateSize(), 300);
            }
        });
    }
}

function refreshMapTiles() {
    if (!map) return;
    if (tileLayer) map.removeLayer(tileLayer);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

    tileLayer = L.tileLayer(tileUrl).addTo(map);
}

function refreshGlobalMapTiles() {
    if (!globalMap) return;
    if (globalTileLayer) globalMap.removeLayer(globalTileLayer);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

    globalTileLayer = L.tileLayer(tileUrl).addTo(globalMap);
}

// Global function for p5.js color sync
function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        return {
            C1: [255, 82, 82], // Bright Red
            C2: [212, 175, 55]  // Gold
        };
    }
    return {
        C1: [93, 64, 55],  // Leather Brown
        C2: [183, 28, 28] // Adventure Red
    };
}
