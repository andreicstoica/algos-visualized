"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { monotoneChain, generateGraph, type Point } from "@/lib/convex-hull";
import Canvas from "@/components/canvas";
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";

// CONSTANTS
const BOX_SIZE = 30; // node rectangle square
const PADDING = 30;
const NUM_NODES = 10;

export default function ConvexHullPage() {
  const router = useRouter();

  // canvas state management
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [graph, setGraph] = useState<Point[]>([]);
  const initialDims = useRef<{ w: number; h: number } | null>(null);

  // stepper state management
  //const [frameIdx, setFrameIdx] = useState(0);
  //const [steps, setSteps] = useState<DijkstraStep[]>([]);

  useEffect(() => {
    const w = window.innerWidth - window.innerWidth * 0.1;
    const h = window.innerHeight - window.innerHeight * 0.1;
    const innerW = w - 2 * PADDING - BOX_SIZE;
    const innerH = h - 2 * PADDING - BOX_SIZE;
    setCanvasWidth(w);
    setCanvasHeight(h);
    initialDims.current = { w: innerW, h: innerH };

    // Generate once into a local var
    const newGraph = generateGraph(NUM_NODES, w - 2 * PADDING, h - 3 * PADDING);
    setGraph(newGraph);

    // Derive steps from that same local tree
    //const newSteps = dijkstra(newTree);
    //setSteps(newSteps);

    setCanvasWidth(w);
    setCanvasHeight(h);

    //a resize listener to update dimensions if the window size changes
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
    context.clearRect(
      -PADDING,
      -PADDING,
      context.canvas.width + 2 * PADDING,
      context.canvas.height + 2 * PADDING,
    );

    // dynamic sizing of the canvas
    if (graph.length && initialDims.current) {
      const { w: innerW, h: innerH } = initialDims.current;
      const drawableW = canvasWidth - 2 * PADDING;
      const drawableH = canvasHeight - 3 * PADDING;
      const scale = Math.min(drawableW / innerW, drawableH / innerH);
      const offsetX = PADDING + (drawableW - innerW * scale) / 2;
      const offsetY = PADDING + (drawableH - innerH * scale) / 2;
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      context.save();

      // draw nodes
      graph.forEach((point) => {
        // black object shape
        context.fillStyle = "black";
        context.fillRect(point.x, point.y, BOX_SIZE, BOX_SIZE);

        // white text inside
        context.font = "bold 20px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";
        context.fillText(
          point.id.toString(),
          point.x + BOX_SIZE / 2,
          point.y + BOX_SIZE / 2,
        );
      });

      context.restore();
    }
  };
  /// END DRAW ///

  return (
    <div className="mx-2 my-20">
      <div className="grid grid-cols-[1fr_auto] grid-rows-1 gap-4">
        {canvasWidth && canvasHeight && (
          <Canvas width={canvasWidth} height={canvasHeight} draw={treeDraw} />
        )}
        <Card className="bg-secondary-background mr-12 w-100 justify-around p-4">
          <CardTitle className="text-center text-lg">
            <div>Convex Hull;</div>
            <div>Monotone Chain Algorithm</div>
          </CardTitle>
          <CardDescription className="flex flex-col gap-1">hi!</CardDescription>

          <CardAction className="flex h-full w-full flex-grow flex-col justify-between gap-2">
            <Button onClick={() => router.push("/")} className="w-full">
              <House />
              <ArrowUturnLeftIcon />
            </Button>
          </CardAction>
        </Card>
      </div>
    </div>
  );
}
