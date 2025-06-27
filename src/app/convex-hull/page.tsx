"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  monotoneChain,
  describeStep,
  generateGraph,
  type MonotoneChainStep,
  type Point,
} from "@/lib/convex-hull";
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
import { frame } from "framer-motion";

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
  const [frameIdx, setFrameIdx] = useState(0);
  const [steps, setSteps] = useState<MonotoneChainStep[]>([]);

  useEffect(() => {
    const w = window.innerWidth - window.innerWidth * 0.1;
    const h = window.innerHeight - window.innerHeight * 0.1;
    const innerW = w - 2 * PADDING - BOX_SIZE;
    const innerH = h - 2 * PADDING - BOX_SIZE;
    setCanvasWidth(w);
    setCanvasHeight(h);
    initialDims.current = { w: innerW, h: innerH };

    // generate once into a local var
    const newGraph = generateGraph(NUM_NODES, w - 2 * PADDING, h - 3 * PADDING);
    setGraph(newGraph);

    // get steps for solution
    const newSteps = monotoneChain(newGraph);
    setSteps(newSteps);

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
        const step = steps[frameIdx];

        context.save();
        context.globalCompositeOperation = "destination-over"; // draw edges behind nodes

        // draw lower‐hull edges
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.beginPath();
        for (let i = 1; i < step!.lowerHull.length; i++) {
          const a = step!.lowerHull[i - 1];
          const b = step!.lowerHull[i];
          context.moveTo(a!.x + BOX_SIZE / 2, a!.y + BOX_SIZE / 2);
          context.lineTo(b!.x + BOX_SIZE / 2, b!.y + BOX_SIZE / 2);
        }
        context.stroke();

        // draw upper‐hull edges
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.beginPath();
        for (let i = 1; i < step!.upperHull.length; i++) {
          const a = step!.upperHull[i - 1];
          const b = step!.upperHull[i];
          context.moveTo(a!.x + BOX_SIZE / 2, a!.y + BOX_SIZE / 2);
          context.lineTo(b!.x + BOX_SIZE / 2, b!.y + BOX_SIZE / 2);
        }
        context.stroke();
        context.restore();

        // draw nodes
        const inLower = step!.lowerHull.some((p) => p.id === point.id);
        const inUpper = step!.upperHull.some((p) => p.id === point.id);
        // black default shape, grey if in stack, green if active
        if (step!.currentPoint && point.id === step!.currentPoint.id) {
          context.fillStyle = "green";
        } else if (inLower || inUpper) {
          context.fillStyle = "grey";
        } else {
          context.fillStyle = "black";
        }
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

  // handlers for next/back
  const nextFrame = () => {
    setFrameIdx((idx) => Math.min(idx + 1, steps.length - 1));
  };
  const prevFrame = () => {
    setFrameIdx((idx) => Math.max(idx - 1, 0));
  };

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
          <CardDescription className="flex flex-col gap-1">
            <div className="text-md font-black">
              Step {frameIdx + 1} / {steps.length}
            </div>
            <p className="mb-2 h-14 overflow-y-auto font-medium text-pretty whitespace-pre-line">
              {steps.length > 0
                ? describeStep(steps[frameIdx]!)
                : "No steps to display."}
            </p>
          </CardDescription>
          <CardAction className="flex h-full w-full flex-grow flex-col justify-between gap-2">
            <div className="flex w-full gap-2">
              {frameIdx === steps.length - 1 ? (
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-secondary-background text-secondary-foreground w-full flex-1"
                >
                  Restart
                </Button>
              ) : (
                <Button
                  onClick={prevFrame}
                  disabled={frameIdx === 0}
                  className="bg-secondary-background text-secondary-foreground w-full flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={nextFrame}
                disabled={frameIdx === steps.length - 1}
                className="w-full flex-1"
              >
                Next
              </Button>
            </div>
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
