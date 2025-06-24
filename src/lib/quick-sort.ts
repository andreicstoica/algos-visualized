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

// helper function to save 'steps' in quick-sort algo
function createPartition(
  arr: number[],
  pivotIndex?: number,
  comparingIndeces?: [number, number],
): PartitionData {
  return {
    arr: [...arr], // copy the array
    pivotIndex,
    comparingIndeces,
  };
}

export function quickSortAnimated(arr: number[]): SortStepNode[] {
  const rootNodes: SortStepNode[] = []; // root nodes for top level steps

  const createLeafNode = (
    arr: number[],
    initialIndex: number,
    originalEndIndex: number,
  ): SortStepNode => {
    return {
      type: "BASE_CASE",
      partitionData: createPartition(arr, arr.length === 1 ? 0 : undefined),
      originalRange: [initialIndex, originalEndIndex], // range for leaf
      left: null,
      right: null,
    };
  };

  const recursiveQuickSort = (
    currentArr: number[],
    initialIndex: number,
    originalEndIndex: number,
  ): SortStepNode => {
    // base case: arr is zero or one element
    if (currentArr.length <= 1) {
      return createLeafNode(currentArr, initialIndex, originalEndIndex);
    }

    // otherwise, let's pivot around val at index (end of array for now)
    const pivotVal = currentArr[currentArr.length - 1];
    const currentPivotIndex = currentArr.length - 1; // last index is pivot

    if (pivotVal === undefined)
      throw new Error("Pivot undefined but should be (recursiveQuickSort)"); // thanks typescript

    const leftArr: number[] = [];
    const rightArr: number[] = [];

    /* Partition Logic */
    // iterate over the array, skipping the last element
    // (will be added after in between left/right arrs)
    for (let i = 0; i < currentArr.length - 1; i++) {
      const element = currentArr[i];
      if (element !== undefined) {
        if (element < pivotVal) leftArr.push(element);
        else rightArr.push(element);
      }
    }

    const currentNode: SortStepNode = {
      type: "PARTITION",
      partitionData: createPartition(currentArr, currentPivotIndex),
      originalRange: [initialIndex, originalEndIndex],
      left: null,
      right: null,
    };

    const leftChildEndIndex = initialIndex + leftArr.length - 1;
    currentNode.left = recursiveQuickSort(
      leftArr,
      initialIndex,
      leftChildEndIndex,
    );

    const rightChildStartIndex = initialIndex + leftArr.length + 1;
    currentNode.right = recursiveQuickSort(
      rightArr,
      rightChildStartIndex,
      originalEndIndex,
    );

    return currentNode;
  };

  // start with initial array in top node
  const rootNode = recursiveQuickSort(arr, 0, arr.length - 1);
  rootNodes.push(rootNode);

  return rootNodes;
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
