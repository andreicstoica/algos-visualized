import type { SortStepNode } from "@/lib/quick-sort";
import SortStep from "./sort-step";

// Recursive node display helper
function RenderNode({
  node,
  depth,
}: {
  node: SortStepNode | null;
  depth: number;
}) {
  if (!node) {
    return null;
  }

  const { type, partitionData, left, right, originalRange } = node;

  const indentClass = depth > 0 ? `ml-${depth * 6}` : "";
  const hasChildren = left !== null || right !== null;

  return (
    <div className={`mb-8 flex w-full flex-col items-start ${indentClass}`}>
      <div className="flex w-full flex-col items-center gap-4">
        <SortStep step={partitionData} />
        {originalRange && (
          <div className="text-xs text-gray-600">
            Range: [{originalRange[0]}, {originalRange[1]}]
          </div>
        )}

        {/* display labels and og range */}
        {type === "PARTITION" && (
          <>
            <div className="flex w-24 flex-row text-xs text-gray-600">
              {left && <span className="mr-2">Left</span>}
              {right && <span>Right</span>}
            </div>
          </>
        )}
      </div>
      {/* recursively render children */}
      {hasChildren && ( // Only render children if this is a PARTITION node with children
        <div className="mt-4 flex w-full flex-row gap-4">
          {left && <RenderNode node={left} depth={depth + 1} />}
          {right && <RenderNode node={right} depth={depth + 1} />}
        </div>
      )}
    </div>
  );
}

interface QuickSortVisualizationProps {
  steps: SortStepNode[];
}

export default function QuickSortVisualization({
  steps,
}: QuickSortVisualizationProps) {
  const rootNode = steps.length > 0 ? steps[0] : null;

  if (!rootNode) {
    return <div>Fill in the list!</div>;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <RenderNode node={rootNode} depth={0} />
    </div>
  );
}
