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

    const context = canvas.getContext("2d");
    if (!context) return;

    // Call the draw function passed as a prop
    draw(context);

    // Optional: Clean up function if needed (e.g., for event listeners)
    return () => {
      // Any cleanup logic here
    };
  }, [draw, width, height]); // Re-run effect if draw function or dimensions change

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
