export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const wait = async (fn: (...args: any) => any, ...args: any[]) => {
  await timeout(3000)
  return fn(...args)
}
