import { DateDuration } from '../../common/util.js'

export const mutateDateWithDuration = (
  dateNumber: number,
  duration: DateDuration,
  operator: 'sum' | 'subtract'
) => {
  const { amount, unit } = duration

  const date = new Date(dateNumber)
  let targetYear = date.getUTCFullYear()
  let targetMonthIndex = date.getUTCMonth()
  const day = date.getUTCDate()
  let targetDay = day

  if (unit === 'd') {
    const targetDate = new Date(targetYear, targetMonthIndex, targetDay)
    targetDate.setDate(
      operator === 'sum'
        ? targetDate.getDate() + amount
        : targetDate.getDate() - amount
    )
    targetYear = targetDate.getFullYear()
    targetMonthIndex = targetDate.getMonth()
    targetDay = targetDate.getDate()
  } else if (unit === 'm' || unit === 'y') {
    if (unit === 'm') {
      targetMonthIndex =
        operator === 'sum'
          ? targetMonthIndex + amount
          : targetMonthIndex - amount
    } else if (unit === 'y') {
      targetYear =
        operator === 'sum' ? targetYear + amount : targetYear - amount
    }

    const lastDayOfTargetMonth = new Date(
      targetYear,
      targetMonthIndex + 1,
      0
    ).getDate()

    targetDay = Math.min(day, lastDayOfTargetMonth)
  }

  return new Date(Date.UTC(targetYear, targetMonthIndex, targetDay)).getTime()
}
