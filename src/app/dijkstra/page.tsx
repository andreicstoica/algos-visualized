"use client";

import { useState, useEffect, useRef } from "react";
import { generateTree, type Node } from "@/lib/dijkstra";
import Canvas from "@/components/canvas";

export default function DijkstraPage() {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [tree, setTree] = useState<Node[]>([]);
  const initialDims = useRef<{ w: number; h: number } | null>(null);

  useEffect(() => {
    // Only generate tree once, on mount
    const w = window.innerWidth - window.innerWidth * 0.1;
    const h = window.innerHeight - window.innerWidth * 0.1;
    setCanvasWidth(w);
    setCanvasHeight(h);
    setTree(generateTree(9, 5, w / 2, h / 2));
    initialDims.current = { w, h };

    // Optional: Add a resize listener to update dimensions if the window size changes
    const handleResize = () => {
      setCanvasWidth(window.innerWidth - window.innerWidth * 0.1);
      setCanvasHeight(window.innerHeight - window.innerWidth * 0.2);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const treeDraw = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (tree.length && initialDims.current) {
      const { w: initialW, h: initialH } = initialDims.current;
      const scaleX = canvasWidth / initialW;
      const scaleY = canvasHeight / initialH;
      const scale = Math.min(scaleX, scaleY);

      // Calculate offset to center the drawing
      const offsetX = (canvasWidth - initialW * scale) / 2;
      const offsetY = (canvasHeight - initialH * scale) / 2;

      context.save();
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);

      context.fillStyle = "red";
      tree.forEach((node) => {
        context.fillRect(node.x, node.y, 10, 10);
      });

      context.restore();
    }
  };

  return (
    <div className="flex-1">
      {canvasWidth && canvasHeight && (
        <Canvas width={canvasWidth} height={canvasHeight} draw={treeDraw} />
      )}
    </div>
  );
}
