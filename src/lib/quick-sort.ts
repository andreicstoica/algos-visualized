export interface SortStepInterface {
  arr: number[];
  pivotIndex?: number; // for user input later
  comparingIndeces?: [number, number];
}

// helper function to save 'steps' in quick-sort algo
function createSortStep(
  arr: number[],
  pivotIndex?: number,
  comparingIndeces?: [number, number],
): SortStepInterface {
  return {
    arr: [...arr], // copy the array
    pivotIndex,
    comparingIndeces,
  };
}

export function quickSortAnimated(initialArr: number[]): SortStepInterface[] {
  const steps: SortStepInterface[] = [];
  const arr = [...initialArr]; // copy passed array

  steps.push(createSortStep(arr)); // adding initial state

  const recursiveQuickSort = (currentArr: number[]): number[] => {
    // return if arr is just one element -> sorted!
    if (currentArr.length <= 1) {
      return currentArr.filter((n): n is number => n !== undefined);
    }

    // otherwise, let's pivot around val at index (end of array for now)
    const pivotVal = currentArr[currentArr.length - 1];
    const pivotIndex = currentArr.length - 1; // last index is pivot

    steps.push(createSortStep(currentArr, pivotIndex)); // adding step

    if (pivotVal === undefined)
      throw new Error("Pivot undefined but should be (recursiveQuickSort)");

    const left: number[] = [];
    const right: number[] = [];

    // iterate over the array, skipping the last element
    // (will be added after in between left/right arrs)
    for (let i = 0; i < currentArr.length - 1; i++) {
      const element = currentArr[i];
      if (element !== undefined) {
        if (element < pivotVal) left.push(element);
        else right.push(element);
      }
    }

    // split array container
    const splitArrays = [...left, pivotVal, ...right];
    steps.push(createSortStep(splitArrays, pivotIndex));

    const sortedLeft = recursiveQuickSort(left);
    const sortedRight = recursiveQuickSort(right);

    return [...sortedLeft, pivotVal, ...sortedRight];
  };

  recursiveQuickSort(arr);
  return steps;

  // const finalSortedArr = quickSort(arr); // using og non-step one for final result
  // if (
  //   steps.length === 0 ||
  //   steps.at(-1)!.arr.join(",") !== finalSortedArr.join(",")
  // ) {
  //   steps.push(createSortStep(finalSortedArr));
  // }
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
