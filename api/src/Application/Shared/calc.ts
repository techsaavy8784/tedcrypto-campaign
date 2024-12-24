import BigNumber from 'bignumber.js'

export const isGreaterThanZero = (val: number | string | undefined): boolean => {
  return new BigNumber(val ?? 0).gt(0)
}

export const toNumber = (val: string, decimals: number = 6): number => {
  return new BigNumber(val).decimalPlaces(decimals).toNumber()
}

export const sum = (...args: string[]): string => {
  return args
    .reduce((prev, cur) => prev.plus(cur), new BigNumber(0))
    .toString()
}

export const shiftDigits = (
  num: string | number | undefined | null,
  places: number,
  decimalPlaces?: number
): string => {
  return new BigNumber(num ?? 0)
    .shiftedBy(places)
    .decimalPlaces(decimalPlaces ?? 6)
    .toString()
}
