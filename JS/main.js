document.addEventListener('DOMContentLoaded', function() {
    // Maze background
    const canvas = document.getElementById("mazeCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        // Resize canvas to full window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Animated maze-like pattern
        const cellSize = 40; // adjust for density
        ctx.strokeStyle = "rgb(39, 39, 39)"; // maze line color
        ctx.lineWidth = 10;

        const lines = [];
        for (let x = 1; x < canvas.width; x += cellSize) {
            for (let y = 0; y < canvas.height; y += cellSize) {
                let x1, y1, x2, y2;
                if (Math.random() > 0.6) {
                    x1 = x;
                    y1 = y;
                    x2 = x + cellSize;
                    y2 = y + cellSize;
                } else {
                    x1 = x + cellSize;
                    y1 = y;
                    x2 = x;
                    y2 = y + cellSize;
                }
                lines.push({ x1, y1, x2, y2 });
            }
        }

        let lineIndex = 0;
        function drawMaze() {
            if (lineIndex < lines.length) {
                const line = lines[lineIndex];
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
                lineIndex++;
                requestAnimationFrame(drawMaze);
            }
        }
        drawMaze();
    }

    // Animate sections on scroll with direction detection
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    const animatedSections = document.querySelectorAll('.about, .projects, .contact');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove old animation classes
                entry.target.classList.remove('slide-in-right', 'slide-in-left', 'fade-in-up');

                if (entry.target.classList.contains('about') || entry.target.classList.contains('contact')) {
                    if (scrollDirection === 'down') {
                        entry.target.classList.add('slide-in-right');
                    } else {
                        entry.target.classList.add('slide-in-left');
                    }
                } else {
                    entry.target.classList.add('fade-in-up');
                }
                entry.target.classList.add('visible');
            } else {
                // Reset animation when out of view
                entry.target.classList.remove('visible', 'slide-in-right', 'slide-in-left', 'fade-in-up');
            }
        });
    }, {
        threshold: 0.2
    });

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // Back to top button
    const backToTopButton = document.createElement('a');
    backToTopButton.href = '#home';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.classList.add('back-to-top');
    document.body.appendChild(backToTopButton);

    // Consolidated scroll listener
    window.addEventListener('scroll', () => {
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }

        // Update scroll direction
        if (window.scrollY > lastScrollY) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        lastScrollY = window.scrollY;
    });
});
