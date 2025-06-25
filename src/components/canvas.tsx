// components/Canvas.jsx
import React, { useRef, useEffect } from "react";

type CanvasProps = {
  width: number;
  height: number;
  draw: (context: CanvasRenderingContext2D) => void;
};

const Canvas = ({ width, height, draw }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1; // dpr for high res canvas B)
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    context.scale(dpr, dpr);

    // call the draw function passed as a prop
    draw(context);
  }, [draw, width, height]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default Canvas;
