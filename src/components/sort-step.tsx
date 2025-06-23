import { Badge } from "./ui/badge";
import { type PartitionData } from "@/lib/quick-sort";

export default function SortStep({ step }: { step: PartitionData }) {
  const { arr, pivotIndex, comparingIndeces } = step;

  const getBg = (index: number): string => {
    let classes = "";

    if (pivotIndex && pivotIndex === index) {
      classes += "bg-yellow-300";
    }

    if (comparingIndeces) {
      const [idx1, idx2] = comparingIndeces;
      if (index === idx1 || index === idx2) {
        classes += "bg-red-400";
      }
    }

    return classes;
  };

  return (
    <div className="flex flex-row items-center gap-1">
      {arr.map((element: number, index: number) => (
        <Badge key={index} className={getBg(index)}>
          {element}
        </Badge>
      ))}
    </div>
  );
}
