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
    // only generate tree once, on mount
    const w = window.innerWidth - window.innerWidth * 0.1;
    const h = window.innerHeight - window.innerHeight * 0.1;
    setCanvasWidth(w);
    setCanvasHeight(h);
    setTree(generateTree(9, 5, w / 1.5, h / 1.5));
    initialDims.current = { w, h };

    // Optional: Add a resize listener to update dimensions if the window size changes
    const handleResize = () => {
      setCanvasWidth(window.innerWidth - window.innerWidth * 0.1);
      setCanvasHeight(window.innerHeight - window.innerWidth * 0.1);
    };

    window.addEventListener("resize", handleResize);

    // cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const treeDraw = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // dynamic sizing of the canvas
    if (tree.length && initialDims.current) {
      const { w: initialW, h: initialH } = initialDims.current;
      const scaleX = canvasWidth / initialW;
      const scaleY = canvasHeight / initialH;
      const scale = Math.min(scaleX, scaleY);

      // calculate offset to center the drawing within div
      const offsetX = (canvasWidth - initialW * scale) / 1.5;
      const offsetY = (canvasHeight - initialH * scale) / 1.5;

      context.save();
      // set context vals
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);

      // draw nodes
      tree.forEach((node) => {
        // black object shape
        context.fillStyle = "black";
        context.fillRect(node.x, node.y, 20, 20);
        // white text inside
        context.font = "16px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillStyle = "white";
        context.fillText(node.id.toString(), node.x + 20 / 2, node.y + 20 / 2);
      });

      // draw edge
      context.strokeStyle = "#6495ED";
      context.setLineDash([4, 6]); // dotted line
      context.globalCompositeOperation = "destination-over"; // draw behind nodes
      tree.forEach((node) => {
        node.neighbors.forEach((edge) => {
          context.beginPath();
          context.moveTo(edge.node1.x + 20 / 2, edge.node1.y + 20 / 2);
          context.lineTo(edge.node2.x + 20 / 2, edge.node2.y + 20 / 2);
          context.stroke();
        });
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
