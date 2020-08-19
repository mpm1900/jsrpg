export type CompareResultT = -1 | 0 | 1
export type CompareResultFn<T = any> = (...args: [T, T, T]) => T
export const ZERO_COMPARE: CompareResultFn = (...args) => args[1]
export const ONE_COMPARE: CompareResultFn = (...args) => args[2]
export const BASE_ARGS: [string, string, string] = [
  'lightcoral',
  'inherit',
  'lightgreen',
]
export const compareResult = (result: CompareResultT): CompareResultFn => (
  ...args: any[]
) => {
  return args[result + 1]
}
export const toCompareResult = (n: number) => (n < 0 ? -1 : n > 0 ? 1 : 0)
export const getCompareFn = (valueA: number, valueB: number) => {
  return compareResult(toCompareResult(valueA - valueB))
}
