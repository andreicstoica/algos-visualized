import type { SortStepInterface } from "@/lib/quick-sort";
import SortStep from "./sort-step";

interface QuickSortVisualizationProps {
  steps: SortStepInterface[];
  currentStepIndex: number;
}

export default function QuickSortVisualization({
  steps,
  currentStepIndex,
}: QuickSortVisualizationProps) {
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return <div>No vis data?</div>;
  }

  return (
    <div className="flex flex-row gap-2">
      <SortStep step={currentStep} />
    </div>
  );
}
