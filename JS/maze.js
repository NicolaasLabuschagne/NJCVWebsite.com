window.onload = function() {
    const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Maze-like pattern
    const cellSize = 40; // adjust for density
    ctx.strokeStyle = "rgb(39, 39, 39)"; // maze line color
    ctx.lineWidth = 10;

    for (let x = 1; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
            ctx.beginPath();
            if (Math.random() > 0.6) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y + cellSize);
            } else {
                ctx.moveTo(x + cellSize, y);
                ctx.lineTo(x, y + cellSize);
            }
            ctx.stroke();
        }
    }
};