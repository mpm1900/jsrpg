export const getKeys = <T extends string>(
  obj: Partial<Record<T, any>>,
): T[] => {
  return Object.keys(obj) as T[]
}
