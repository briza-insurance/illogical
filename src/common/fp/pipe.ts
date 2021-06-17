/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Pipe {
  <T extends any[], S1, S2, S3, S4, S5>(
    fn1: (...args: T) => S1,
    fn2: (arg: S1) => S2,
    fn3: (arg: S2) => S3,
    fn4: (arg: S3) => S4,
    fn5: (arg: S4) => S5
  ): (...args: T) => S5
  <T extends any[], S1, S2, S3, S4>(
    fn1: (...args: T) => S1,
    fn2: (arg: S1) => S2,
    fn3: (arg: S2) => S3,
    fn4: (arg: S3) => S4
  ): (...args: T) => S4
  <T extends any[], S1, S2, S3>(
    fn1: (...args: T) => S1,
    fn2: (arg: S1) => S2,
    fn3: (arg: S2) => S3
  ): (...args: T) => S3
  <T extends any[], S1, S2>(fn1: (...args: T) => S1, fn2: (arg: S1) => S2): (
    ...args: T
  ) => S2
  <T extends any[], S1>(fn1: (...args: T) => S1): (...args: T) => S1
  (...fns: Array<(...args: any[]) => any>): (...args: any[]) => any
}

export const pipe: Pipe =
  (...fns: Array<(...args: any[]) => any>) =>
  (...args: any[]): any => {
    let result = fns[0](...args)
    for (const fn of fns.slice(1)) {
      result = fn(result)
    }
    return result
  }
