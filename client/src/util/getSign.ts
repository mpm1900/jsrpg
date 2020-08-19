import { notZero } from './notZero'

export const getSign = (value: number): string =>
  notZero(value, value > 0 ? '+' : '-')
