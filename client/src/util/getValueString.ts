import { notZero } from './notZero'

export const getValueString = (value: number): string =>
  notZero(value, `${Math.abs(value)}`)
