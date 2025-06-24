import type { AnimatedTreeNode } from "@/lib/quick-sort";
import SortStep from "./sort-step";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

function RenderAnimatedNode({
  node,
  depth = 0,
  maxDepth = 10,
  onAllDone,
}: {
  node: AnimatedTreeNode;
  depth?: number;
  maxDepth?: number;
  onAllDone?: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    const currentStep = node.steps[stepIndex];
    const hasAnimation =
      currentStep?.comparingIndex !== undefined && currentStep?.moveDirection;

    setAnimationComplete(!hasAnimation);

    if (stepIndex < node.steps.length - 1) {
      const timeout = setTimeout(() => setStepIndex(stepIndex + 1), 500);
      return () => clearTimeout(timeout);
    }
  }, [stepIndex, node.steps]);

  const isDone = stepIndex === node.steps.length - 1 && animationComplete;

  useEffect(() => {
    if (isDone && !node.left && !node.right) {
      onAllDone?.();
    }
  }, [isDone, node.left, node.right, onAllDone]);

  return (
    <Card className="m-2 p-2">
      <div className="flex flex-col items-center">
        {/* Current node */}
        <div className="mb-4">
          <SortStep
            step={node.steps[stepIndex]}
            originalRange={node.originalRange}
            onMoveComplete={() => setAnimationComplete(true)}
          />
        </div>

        {/* Children - only show when animation is done */}
        {isDone && depth < maxDepth && (node.left ?? node.right) && (
          <div
            className="relative flex items-start justify-center"
            style={{ minWidth: "600px" }}
          >
            {/* Left child */}
            {node.left && (
              <div className="flex flex-1 justify-center">
                <RenderAnimatedNode
                  node={node.left}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onAllDone={onAllDone}
                />
              </div>
            )}

            {/* Right child */}
            {node.right && (
              <div className="flex flex-1 justify-center">
                <RenderAnimatedNode
                  node={node.right}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onAllDone={onAllDone}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

interface QuickSortVisualizationProps {
  tree: AnimatedTreeNode;
}

export default function QuickSortVisualization({
  tree,
  maxDepth = 0,
  onAnimationComplete,
}: QuickSortVisualizationProps & {
  maxDepth?: number;
  onAnimationComplete?: () => void;
}) {
  if (!tree) {
    return <div>Fill the form with a list!</div>;
  }
  return (
    <div className="relative flex w-full flex-col items-center">
      <RenderAnimatedNode
        node={tree}
        depth={0}
        maxDepth={maxDepth}
        onAllDone={onAnimationComplete}
      />
    </div>
  );
}
