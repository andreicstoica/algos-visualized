"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import {
  dijkstra,
  generateTree,
  type Node,
  type DijkstraStep,
} from "@/lib/dijkstra";
import Canvas from "@/components/canvas";
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// CONSTANTS
const BOX_SIZE = 30; // node rectangle square
const PADDING = 25;

export default function DijkstraPage() {
  const router = useRouter();

  // canvas state management
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [tree, setTree] = useState<Node[]>([]);
  const initialDims = useRef<{ w: number; h: number } | null>(null);

  // stepper state management
  const [frameIdx, setFrameIdx] = useState(0);
  const [steps, setSteps] = useState<DijkstraStep[]>([]);

  useEffect(() => {
    const w = window.innerWidth - window.innerWidth * 0.1;
    const h = window.innerHeight - window.innerHeight * 0.1;
    const innerW = w - 2 * PADDING - BOX_SIZE;
    const innerH = h - 2 * PADDING - BOX_SIZE;
    setCanvasWidth(w);
    setCanvasHeight(h);
    initialDims.current = { w: innerW, h: innerH };

    // Generate once into a local var
    const newTree = generateTree(9, 5, w - 2 * PADDING, h - 2 * PADDING);
    setTree(newTree);

    // Derive steps from that same local tree
    const newSteps = dijkstra(newTree);
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
    if (tree.length && initialDims.current) {
      const { w: innerW, h: innerH } = initialDims.current;
      const drawableW = canvasWidth - 2 * PADDING;
      const drawableH = canvasHeight - 2 * PADDING;
      const scale = Math.min(drawableW / innerW, drawableH / innerH);
      const offsetX = PADDING + (drawableW - innerW * scale) / 2;
      const offsetY = PADDING + (drawableH - innerH * scale) / 2;
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      context.save();

      // draw nodes
      tree.forEach((node) => {
        // black object shape
        context.fillStyle = "black";
        context.fillRect(node.x, node.y, BOX_SIZE, BOX_SIZE);
        // white text inside
        context.font = "bold 20px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";
        context.fillText(
          node.id.toString(),
          node.x + BOX_SIZE / 2,
          node.y + BOX_SIZE / 2,
        );
      });

      // draw edge
      context.strokeStyle = "#6495ED";
      context.setLineDash([4, 6]); // dotted line
      context.globalCompositeOperation = "destination-over"; // draw behind nodes
      tree.forEach((node) => {
        node.neighbors.forEach((edge) => {
          // dotted edges
          context.beginPath();
          context.moveTo(
            edge.node1.x + BOX_SIZE / 2,
            edge.node1.y + BOX_SIZE / 2,
          );
          context.lineTo(
            edge.node2.x + BOX_SIZE / 2,
            edge.node2.y + BOX_SIZE / 2,
          );
          context.stroke();
          // text for weight
          context.font = "bold 18px sans-serif";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "#6495ED";
          context.fillText(
            edge.weight.toString(),
            (edge.node1.x + edge.node2.x) / 2,
            (edge.node1.y + edge.node2.y) / 2,
          );
        });
      });

      context.restore();
    }
  };

  // END DRAW

  // handlers for next/back
  const nextFrame = () => {
    setFrameIdx((idx) => Math.min(idx + 1, steps.length - 1));
  };
  const prevFrame = () => {
    setFrameIdx((idx) => Math.max(idx - 1, 0));
  };

  // get current and next steps for card info
  const currentStep = steps[frameIdx] ?? {
    distances: [],
    visited: [],
    currentNode: -1,
  };
  const previous = steps[frameIdx - 1] ?? null;

  // make action description for card
  let actionText = "";
  if (!previous) {
    actionText = "Initialization: set origin distance to 0.";
  } else {
    const curId = currentStep.currentNode;
    // did we just finalize a node?
    if (!previous.visited[curId] && currentStep.visited[curId]) {
      actionText = `Finalized node ${curId} with distance ${
        currentStep.distances[curId]
      }.`;
    } else {
      // find which distance changed
      const changed = currentStep.distances.findIndex(
        (d, i) => d !== previous.distances[i],
      );
      if (changed !== -1) {
        actionText = `Relaxed edge → updated node ${changed} from ${
          previous.distances[changed]
        } to ${currentStep.distances[changed]}.`;
      }
    }
  }

  return (
    <div className="mx-4 my-20">
      <div className="grid grid-cols-[3fr_1.5fr] grid-rows-1">
        {canvasWidth && canvasHeight && (
          <Canvas width={canvasWidth} height={canvasHeight} draw={treeDraw} />
        )}
        <Card className="bg-secondary-background ml-auto w-full max-w-sm p-4">
          <CardTitle className="text-center text-lg font-black">
            Dijkstra&apos;s Algorithm
          </CardTitle>
          <Card className="w-full max-w-sm p-4">
            <CardTitle>
              Step {frameIdx + 1} / {steps.length}
            </CardTitle>
            <CardDescription>
              <p className="mb-2 font-medium">{actionText}</p>
              <div className="grid grid-cols-3 gap-2">
                {currentStep.distances.map((d, i) => (
                  <Badge
                    key={i}
                    variant={currentStep.visited[i] ? "default" : "neutral"}
                    className={clsx(
                      "w-full text-center",
                      currentStep.currentNode === i ? "border-green-200" : "",
                    )}
                  >
                    {d === Infinity ? "∞" : d}
                  </Badge>
                ))}
              </div>
            </CardDescription>
            <CardAction className="flex w-full gap-2">
              <Button
                onClick={prevFrame}
                disabled={frameIdx === 0}
                className="w-full flex-1"
              >
                Back
              </Button>
              <Button
                onClick={nextFrame}
                disabled={frameIdx === steps.length - 1}
                className="w-full flex-1"
              >
                Next
              </Button>
            </CardAction>
          </Card>
          <CardAction className="w-full">
            <Button onClick={() => router.push("/")} className="w-full flex-1">
              Home
            </Button>
          </CardAction>
        </Card>
      </div>
    </div>
  );
}
