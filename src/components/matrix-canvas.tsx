"use client";

import { useEffect, useRef } from "react";

type MatrixCanvasProps = {
  className?: string;
  opacity?: number; // 0..1
  speedMs?: number; // ex: 50
  color?: string; // ex: "#7c3aed"
};

export function MatrixCanvas({
  className,
  opacity = 0.2,
  speedMs = 50,
  color = "#7c3aed",
}: MatrixCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      const nextColumns = Math.floor(canvas.width / fontSize);
      if (nextColumns !== columns) {
        columns = nextColumns;
        drops = Array.from({ length: columns }, () => 1);
      }

      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = letters[Math.floor(Math.random() * letters.length)];
        const y = (drops[i] ?? 0) * fontSize;

        ctx.fillText(ch, i * fontSize, y);

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] = (drops[i] ?? 0) + 1;
      }
    };

    const id = window.setInterval(draw, speedMs);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, [speedMs, color]);

  return (
    <canvas
      ref={ref}
      className={
        className ?? "pointer-events-none absolute inset-0 z-0 h-full w-full"
      }
      style={{ opacity }}
    />
  );
}
