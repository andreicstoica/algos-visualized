import type { MultiPartitionStep } from "@/lib/quick-sort";
import SortStep from "./sort-step";

interface QuickSortVisualizationProps {
  steps: MultiPartitionStep[];
  currentStepIndex: number;
}

export default function QuickSortVisualization({
  steps,
  currentStepIndex,
}: QuickSortVisualizationProps) {
  const currentLayer = steps[currentStepIndex];

  if (!currentLayer) {
    return <div>No vis data?</div>;
  }

  const { singlePartition, leftPartition, rightPartition, originalRange } =
    currentLayer;

  const rowStyle = "flex w-40 flex-col items-center gap-2";
  return (
    <div className="flex w-full flex-row flex-wrap items-start justify-center gap-4 p-4">
      {singlePartition && (
        <div className={rowStyle}>
          <h4>Current Array State</h4>
          <SortStep step={singlePartition} />
        </div>
      )}

      {leftPartition && (
        <div className={rowStyle}>
          <h4>Left</h4>
          <SortStep step={leftPartition} />
        </div>
      )}

      {rightPartition && (
        <div className={rowStyle}>
          <h4>Right</h4>
          <SortStep step={rightPartition} />
        </div>
      )}

      {originalRange && (
        <div className="mt-2 ml-4 text-sm text-gray-600">
          Original Range: [{originalRange[0]}, {originalRange[1]}]
        </div>
      )}
    </div>
  );
}
