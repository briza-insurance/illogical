export const rxMatches =
  (pattern: RegExp) =>
  (value: string): boolean =>
    !!value.match(pattern)
