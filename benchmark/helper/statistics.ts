export function mean(array: number[]) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export function median(array: number[]): number {
  if (array.length === 0) return 0;
  if (array.length === 1) return array[0];
  if (array.length % 2 === 0) return (array[array.length / 2 - 1] + array[array.length / 2]) / 2;
  return array[Math.floor(array.length / 2)];
}
