export type Predicate<T> = (value: T) => boolean
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
