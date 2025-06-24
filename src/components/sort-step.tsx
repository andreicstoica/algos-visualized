import { Badge } from "./ui/badge";
import { type PartitionData } from "@/lib/quick-sort";

export default function SortStep({ step }: { step: PartitionData }) {
  const { arr, pivotIndex, comparingIndeces } = step;

  const getBg = (index: number): string => {
    let classes = "";

    if (pivotIndex !== undefined && pivotIndex === index) {
      classes += "bg-yellow-400 text-black"; // yellow for pivot
    }
    // compare indeces one day lol
    else if (comparingIndeces) {
      const [idx1, idx2] = comparingIndeces;
      if (index === idx1 || index === idx2) {
        classes += "bg-red-400 text-black"; // red for comparing
      }
    } else {
      classes += "bg-cyan-500";
    }

    return classes;
  };

  return (
    <div className="flex flex-row items-center gap-1">
      {arr.map((element: number, index: number) => (
        <Badge key={`${element}-${index}`} className={getBg(index)}>
          {element}
        </Badge>
      ))}
    </div>
  );
}
