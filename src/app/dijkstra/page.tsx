"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
import Chart from "@/components/chart";
import { House } from "lucide-react";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";

// CONSTANTS
const BOX_SIZE = 30; // node rectangle square
const PADDING = 30;
const MAX_WEIGHT = 3;
const NUM_NODES = 5;
const MAX_DISTANCE = MAX_WEIGHT * (NUM_NODES - 1);

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
    const newTree = generateTree(
      NUM_NODES,
      MAX_WEIGHT,
      w - 2 * PADDING,
      h - 3 * PADDING,
    );
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
      const drawableH = canvasHeight - 3 * PADDING;
      const scale = Math.min(drawableW / innerW, drawableH / innerH);
      const offsetX = PADDING + (drawableW - innerW * scale) / 2;
      const offsetY = PADDING + (drawableH - innerH * scale) / 2;
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      context.save();

      // draw nodes
      tree.forEach((node) => {
        // black object shape
        if (node.id === currentStep.currentNode) {
          context.fillStyle = "green";
        } else if (currentStep.visited[node.id]) {
          context.fillStyle = "grey";
        } else {
          context.fillStyle = "black";
        }

        // Draw circle for origin node, square for others
        if (node.id === 0) {
          const centerX = node.x + BOX_SIZE / 2;
          const centerY = node.y + BOX_SIZE / 2;
          const radius = BOX_SIZE / 2;

          context.beginPath();
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          context.fill();

          context.stroke();
        } else {
          context.fillRect(node.x, node.y, BOX_SIZE, BOX_SIZE);
        }

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
      context.globalCompositeOperation = "destination-over"; // draw behind nodes
      tree.forEach((node) => {
        node.neighbors.forEach((edge) => {
          // conditionally draw the active edge
          if (
            edge.node1.id === currentStep.activeEdge?.node1.id &&
            edge.node2.id === currentStep.activeEdge?.node2.id
          ) {
            context.strokeStyle = "#c41f1f";
            context.lineWidth = 2.5;
            context.setLineDash([]); // solid line
          } else {
            context.lineWidth = 1;
            context.strokeStyle = "#6495ED";
            context.setLineDash([4, 6]); // dotted line
          }
          context.save();

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
          context.globalCompositeOperation = "source-over"; // draw weight on top of edge line
          context.font = "bold 18px sans-serif";
          context.textAlign = "center";
          context.textBaseline = "top";
          context.fillStyle = "#6495ED";
          context.fillText(
            edge.weight.toString(),
            (edge.node1.x + edge.node2.x) / 2,
            (edge.node1.y + edge.node2.y) / 2,
          );

          context.restore();
        });
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
    actionText =
      "Let's get started 🚀 Set origin distance to 0, and all others to infinity.";
  } else if (frameIdx === steps.length - 1) {
    actionText = "We now know all shortest distances to the origin!";
  } else {
    const curId = currentStep.currentNode;
    // did we just finalize a node?
    if (!previous.visited[curId] && currentStep.visited[curId]) {
      actionText = `Finalized Node ${curId} with distance ${currentStep.distances[curId]}.`;
    } else {
      // find which distance changed
      const changed = currentStep.distances.findIndex(
        (d, i) => d !== previous.distances[i],
      );
      if (changed !== -1) {
        actionText = `It's shorter 🎉 Let's relax the edge → distance to Node ${changed} is ${currentStep.distances[changed]} (was ${previous.distances[changed]}).`;
      } else {
        actionText = "Checking if distance is shorter...";
      }
    }
  }

  return (
    <div className="mx-2 my-20">
      <div className="grid grid-cols-[1fr_auto] grid-rows-1 gap-4">
        {canvasWidth && canvasHeight && (
          <Canvas width={canvasWidth} height={canvasHeight} draw={treeDraw} />
        )}
        <Card className="bg-secondary-background mr-12 w-100 justify-around p-4">
          <CardTitle className="text-center text-lg font-black">
            Dijkstra&apos;s Algorithm
          </CardTitle>
          <CardDescription className="flex flex-col gap-1">
            <div className="text-md font-black">
              Step {frameIdx + 1} / {steps.length}
            </div>
            <p className="mb-2 h-14 overflow-y-auto font-medium text-pretty whitespace-pre-line">
              {actionText}
            </p>
          </CardDescription>
          <Card className="w-full max-w-sm p-4">
            <CardTitle>Distances</CardTitle>
            <CardDescription>
              <Chart
                distances={currentStep.distances}
                maxDistance={MAX_DISTANCE}
              />
            </CardDescription>
          </Card>
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
