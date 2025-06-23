export interface PartitionData {
  arr: number[];
  pivotIndex?: number; // for user input later
  comparingIndeces?: [number, number];
}

export interface MultiPartitionStep {
  leftPartition?: PartitionData;
  rightPartition?: PartitionData;
  singlePartition?: PartitionData;
  originalRange?: [number, number];
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

export function quickSortAnimated(arr: number[]): MultiPartitionStep[] {
  const steps: MultiPartitionStep[] = [];
  //const arr = [...initialArr]; // copy passed array

  //steps.push({ singlePartition: createPartition(arr) }); // add initial step

  const recursiveQuickSort = (
    currentArr: number[],
    initialPivotIndex = 0,
  ): number[] => {
    // base case: arr is just one element -> sorted!
    if (currentArr.length <= 1) {
      return currentArr.filter((n): n is number => n !== undefined);
    }

    // otherwise, let's pivot around val at index (end of array for now)
    const currentPivotVal = currentArr[currentArr.length - 1];
    //const currentPivotIndex = currentArr.length - 1; // last index is pivot

    // doing this later now
    // const partitionStep = createPartition(currentArr, currentPivotIndex);
    // steps.push({ singlePartition: partitionStep }); // adding step before split

    if (currentPivotVal === undefined)
      throw new Error("Pivot undefined but should be (recursiveQuickSort)"); // thanks typescript

    const left: number[] = [];
    const right: number[] = [];

    // Partition Logic //
    // iterate over the array, skipping the last element
    // (will be added after in between left/right arrs)
    for (let i = 0; i < currentArr.length - 1; i++) {
      const element = currentArr[i];
      if (element !== undefined) {
        if (element < currentPivotVal) left.push(element);
        else right.push(element);
      }
    }

    // split arrays (aka multi partition step to display!)
    //const splitArrays = [...left, currentPivotVal, ...right];
    //const postPartitionStep = createPartition(splitArrays, currentPivotIndex);

    const multiStep: MultiPartitionStep = {
      leftPartition: createPartition(left),
      rightPartition: createPartition(right),
      originalRange: [
        initialPivotIndex,
        initialPivotIndex + currentArr.length - 1,
      ],
    };
    steps.push(multiStep); // branching step added to steps

    const sortedLeft = recursiveQuickSort(left, initialPivotIndex);
    const sortedRight = recursiveQuickSort(
      right,
      initialPivotIndex + left.length + 1,
    );

    return [...sortedLeft, currentPivotVal, ...sortedRight];
  };

  // add initial state as single partition step
  steps.push({ singlePartition: createPartition(arr) });

  // start recursion
  recursiveQuickSort(arr, 0);

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
