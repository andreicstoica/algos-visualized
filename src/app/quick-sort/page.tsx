import QuickSortVisualization from "@/components/quick-sort";

export default function QuickSortPage() {
  return (
    <div>
      <h1>Quick Sort Visualization</h1>
      <p>Visualize the quick sort algorithm step by step.</p>
      <QuickSortVisualization arr={[5, 2, 5, 1, 10, 22, 24, 12]} />
    </div>
  );
}
