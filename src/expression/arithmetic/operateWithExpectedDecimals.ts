const getNumDecimals = (num: number) => {
  const numberSplit = num.toString().split('.')
  return numberSplit.length == 2 ? numberSplit[1].length : 0
}

export const operateWithExpectedDecimals =
  (add = true) =>
  (first: number, second: number) => {
    const numDecimals1 = getNumDecimals(first)
    const numDecimals2 = getNumDecimals(second)

    const maxDecimals =
      numDecimals1 > numDecimals2 ? numDecimals1 : numDecimals2

    return add
      ? Number((first + second).toFixed(maxDecimals))
      : Number((first - second).toFixed(maxDecimals))
  }
