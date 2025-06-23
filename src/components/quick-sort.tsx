import { quickSort } from "@/lib/quick-sort";

export default function QuickSortVisualization({ arr }: { arr: number[] }) {
  return <div>Sorted result: {quickSort(arr).toString()}</div>;
}
