"use client";
import React, { useEffect, useRef } from "react";
import p5 from "p5";

const InteractiveBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const symbols = ["+", "-", "•", "/", "×"];
      let grid: { x: number; y: number; symbol: string; color: string }[] = [];
      const spacing = 50;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        p.textFont("monospace");
        p.textSize(12);
        initGrid();
      };

      const initGrid = () => {
        grid = [];
        for (let x = 0; x < p.width + spacing; x += spacing) {
          for (let y = 0; y < p.height + spacing; y += spacing) {
            grid.push({
              x,
              y,
              symbol: p.random(symbols),
              color: p.random() > 0.9 ? "#FF6B35" : "#ffffff22"
            });
          }
        }
      };

      p.draw = () => {
        p.clear(0, 0, 0, 0);
        grid.forEach((item) => {
          const d = p.dist(p.mouseX, p.mouseY, item.x, item.y);

          p.push();
          p.translate(item.x, item.y);
          if (d < 150) {
            const angle = p.map(d, 0, 150, p.PI, 0);
            p.rotate(angle + p.frameCount * 0.02);
            p.fill("#FF6B35");
          } else {
            p.fill(255, 255, 255, 20);
          }
          p.textAlign(p.CENTER, p.CENTER);
          p.text(item.symbol, 0, 0);
          p.pop();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initGrid();
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default InteractiveBackground;
