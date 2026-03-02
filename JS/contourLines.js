const sketch = (p) => {
    let symbols = ['+', '-', '•', '/', '×'];
    let grid = [];
    let spacing = 60;

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        let parent = document.getElementById('p5-background');
        if (parent) canvas.parent(parent);

        recreateGrid();
    };

    function recreateGrid() {
        grid = [];
        for (let x = 0; x < p.width + spacing; x += spacing) {
            for (let y = 0; y < p.height + spacing; y += spacing) {
                grid.push({
                    x: x,
                    y: y,
                    symbol: p.random(symbols),
                    angle: p.random(p.TWO_PI),
                    offset: p.random(100)
                });
            }
        }
    }

    p.draw = () => {
        p.clear();
        p.noFill();

        let colors = getThemeColors();
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        grid.forEach(point => {
            let d = p.dist(p.mouseX, p.mouseY, point.x, point.y);
            let alpha = p.map(d, 0, 600, 150, 30);

            p.push();
            p.translate(point.x, point.y);

            // Subtle floating motion
            let floatY = p.sin(p.frameCount * 0.02 + point.offset) * 5;
            p.translate(0, floatY);

            // Rotation based on mouse distance
            let rot = point.angle + (200 / (d + 50));
            p.rotate(rot);

            p.stroke(isDark ? 255 : 0, alpha);
            p.strokeWeight(1);

            // Draw the architectural symbol
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(14);
            p.text(point.symbol, 0, 0);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        recreateGrid();
    };
};

new p5(sketch);
