import { Badge } from "./ui/badge";
import { type SortStepInterface } from "@/lib/quick-sort";

export default function SortStep({ step }: { step: SortStepInterface }) {
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

  return arr.map((element: number, index: number) => (
    <Badge key={index} className={getBg(index)}>
      {element}
    </Badge>
  ));
}
