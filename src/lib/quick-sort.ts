export function quickSort(arr: (number | undefined)[]): number[] {
  if (arr.length <= 1) return arr.filter((n): n is number => n !== undefined);

  const pivot = arr[arr.length - 1];
  if (pivot === undefined) throw new Error("Pivot is undefined");

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
