export interface PartitionData {
  arr: number[];
  pivotIndex?: number; // for user input later
  comparingIndeces?: [number, number];
}

export interface SortStepNode {
  type: "PARTITION" | "BASE_CASE";
  partitionData: PartitionData;
  originalRange?: [number, number];
  left?: SortStepNode | null;
  right?: SortStepNode | null;
}

export interface AnimatedStep {
  arr: number[];
  comparingIndex?: number;
  pivotIndex?: number;
  moveDirection?: "left" | "right" | null; // null for no move
  leftPartition?: number[];
  rightPartition?: number[];
}

export interface AnimatedTreeNode {
  steps: AnimatedStep[];
  left?: AnimatedTreeNode | null;
  right?: AnimatedTreeNode | null;
  originalRange?: [number, number];
}

export function quickSortAnimated(arr: number[]): AnimatedStep[] {
  const steps: AnimatedStep[] = [];

  function recursiveQuickSort(currentArr: number[], depth = 0): number[] {
    if (currentArr.length <= 1) return currentArr;

    const pivotIndex = currentArr.length - 1;
    const pivot = currentArr[pivotIndex];
    const left: number[] = [];
    const right: number[] = [];

    if (pivot === undefined) throw new Error("Pivot is undefined"); // thanks typescript

    for (let i = 0; i < currentArr.length - 1; i++) {
      const element = currentArr[i];
      if (element === undefined) throw new Error("Element is undefined"); // thanks typescript

      const moveDirection = element < pivot ? "left" : "right";
      steps.push({
        arr: [...currentArr],
        comparingIndex: i,
        pivotIndex,
        moveDirection,
        leftPartition: [...left],
        rightPartition: [...right],
      });
      if (element < pivot) left.push(element);
      else right.push(element);
    }

    // Final partition state
    steps.push({
      arr: [...left, pivot, ...right],
      pivotIndex: left.length,
      comparingIndex: undefined,
      moveDirection: null,
      leftPartition: [...left],
      rightPartition: [...right],
    });

    recursiveQuickSort(left, depth + 1);
    recursiveQuickSort(right, depth + 1);

    return [...left, pivot, ...right];
  }

  recursiveQuickSort(arr);
  return steps;
}

export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.filter((n): n is number => n !== undefined);

  const pivot = arr[arr.length - 1];
  if (pivot === undefined) throw new Error("Pivot is undefined"); // thanks typescript

  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const element = arr[i];
    if (element !== undefined) {
      if (element < pivot) left.push(element);
      else right.push(element);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

export function quickSortAnimatedTree(
  arr: number[],
  initialIndex = 0,
  originalEndIndex = arr.length - 1
): AnimatedTreeNode {
  const steps: AnimatedStep[] = [];

  if (arr.length <= 1) {
    steps.push({
      arr: [...arr],
      comparingIndex: arr.length === 1 ? 0 : undefined,
      pivotIndex: arr.length === 1 ? 0 : undefined,
      moveDirection: null,
      leftPartition: [],
      rightPartition: [],
    });
    return { steps, left: null, right: null, originalRange: [initialIndex, originalEndIndex] };
  }

  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const element = arr[i];
    if (element === undefined) throw new Error("Element is undefined");
    if (pivot === undefined) throw new Error("Pivot is undefined");

    const moveDirection = element < pivot ? "left" : "right";
    steps.push({
      arr: [...arr], // Keep original array order
      comparingIndex: i,
      pivotIndex,
      moveDirection,
      leftPartition: [...left],
      rightPartition: [...right],
    });
    if (element < pivot) left.push(element);
    else right.push(element);
  }

  // Final partition state - show where elements would go but keep original order
  steps.push({
    arr: [...arr], // Keep original array order
    pivotIndex,
    comparingIndex: undefined,
    moveDirection: null,
    leftPartition: [...left],
    rightPartition: [...right],
  });

  const leftChildEndIndex = initialIndex + left.length - 1;
  const rightChildStartIndex = initialIndex + left.length + 1;

  return {
    steps,
    left: left.length
      ? quickSortAnimatedTree(left, initialIndex, leftChildEndIndex)
      : null,
    right: right.length
      ? quickSortAnimatedTree(right, rightChildStartIndex, originalEndIndex)
      : null,
    originalRange: [initialIndex, originalEndIndex],
  };
}
