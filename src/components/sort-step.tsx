import { Badge } from "./ui/badge";
import { type AnimatedStep } from "@/lib/quick-sort";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function SortStep({
  step,
  onMoveComplete,
  originalRange,
}: {
  step?: AnimatedStep;
  onMoveComplete?: () => void;
  originalRange?: [number, number];
}) {
  if (!step) return null;
  const {
    arr,
    comparingIndex,
    pivotIndex,
    moveDirection,
    leftPartition = [],
    rightPartition = [],
  } = step;

  // For animation: which element is currently moving
  const isMoving = comparingIndex !== undefined && moveDirection;

  return (
    <div className="flex flex-col items-center">
      {/* original row before partitioning */}
      <Card className="bg-secondary-background mb-2 p-2">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex flex-row items-center gap-1">
            {arr.map((element, index) => {
              // If this is the moving element, hide it from the main row while animating
              if (isMoving && index === comparingIndex)
                return <div key={index} />;

              // contextual className for bg color
              let className = "bg-cyan-500";
              if (index === pivotIndex) className = "bg-yellow-400";
              else if (index === comparingIndex) className = "bg-red-400";
              return (
                <Badge key={index} className={className}>
                  {element}
                </Badge>
              );
            })}
          </div>
          {originalRange && arr[0] !== undefined && (
            <div className="text-xs text-gray-600">
              Range: [{originalRange[0]}, {originalRange[1]}]
            </div>
          )}
        </div>
      </Card>

      {/* animated moving element */}
      <AnimatePresence>
        {isMoving && comparingIndex !== undefined && (
          <motion.div
            key={`moving-${comparingIndex}`}
            initial={{ y: 30, x: 0, opacity: 0.75 }}
            animate={{
              // 1. Down, 2. Out, 3. Down again
              y: [20, 70, 95],
              x: [
                0,
                0,
                moveDirection === "left"
                  ? -40 * (leftPartition.length + 1)
                  : 40 * (rightPartition.length + 1),
              ],
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.75,
              times: [0, 1],
              ease: "easeInOut",
            }}
            onAnimationComplete={onMoveComplete}
            className="absolute"
            style={{ zIndex: 10 }}
          >
            <Badge className="bg-red-400">{arr[comparingIndex]}</Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* partitions */}
      {(leftPartition.length > 0 || rightPartition.length > 0) && ( // making sure to not render empty partitions
        <div className="flex flex-row gap-10">
          {/* left partition */}
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xs">Left</div>
            <div className="flex flex-row gap-1">
              {leftPartition.map((element, i) => (
                <Badge key={i} className="bg-cyan-500">
                  {element}
                </Badge>
              ))}
            </div>
          </div>
          {/* right partition */}
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xs">Right</div>
            <div className="flex flex-row gap-1">
              {rightPartition.map((element, i) => (
                <Badge key={i} className="bg-cyan-500">
                  {element}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
