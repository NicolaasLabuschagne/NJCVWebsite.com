let field = [];
let rez = 12;
let cols, rows;
let increment = 0.02;
let zoff = 0;
let xShift = 0;
let yShift = 0;

const C1 = [70, 200, 255];   // teal
const C2 = [180, 100, 255];  // purple

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = 1 + Math.floor(width / rez);
  rows = 1 + Math.floor(height / rez);
  field = Array.from({ length: cols }, () => Array(rows).fill(0));
  strokeWeight(2);
  noFill();
}

function draw() {
  background(0);

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