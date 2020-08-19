export const getKeys = <T extends string>(obj: Record<T, any>): T[] => {
  return Object.keys(obj) as T[]
}
