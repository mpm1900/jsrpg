export const reduce = <TList, TRestult>(
  list: TList[],
  reducer: (result: TRestult, current: TList, index?: number) => TRestult,
  initialValue: TRestult,
): TRestult => {
  return list.reduce(reducer as any, initialValue as TRestult) as TRestult
}
