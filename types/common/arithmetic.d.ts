/**
 * Decimal-aware arithmetic operations.
 * Preserves the expected number of decimal places for floating-point arithmetic.
 */
export declare const operateWithExpectedDecimals: (operation: "sum" | "subtract" | "multiply") => (first: number, second: number) => number;
