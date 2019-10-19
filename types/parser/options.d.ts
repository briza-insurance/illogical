/**
 * Parser module.
 * @module illogical/parser
 */
export declare type optionValue = ((operand: string) => string | boolean) | Map<symbol, string>;
export interface Options {
    /**
     * A function used to determine if the operand is a reference type,
     * otherwise evaluated as a static value.
     * @param {string} operand
     * @return {boolean}
     * * True = reference
     * * False = value
     */
    referencePredicate: (operand: string) => boolean;
    /**
     * A function used to transform the operand into the reference annotation
     * stripped form. I.e. remove any annotation used to detect the
     * reference type.
     * E.g. "$Reference" => "Reference"
     * @param {string} operand
     * @return {string}
     */
    referenceTransform: (operand: string) => string;
    /**
     * Mapping of the operators. The key is unique operator key, and the value
     * is the key used to represent the  given operator in the raw expression.
     */
    operatorMapping: Map<symbol, string>;
    [k: string]: optionValue;
}
/**
 * Default reference predicate.
 * The "$" symbol at the begging of the operand is used
 * to predicate the reference type.
 * E.g. "$State", "$Country"
 * @param {string} key
 * @return {boolean}
 */
export declare function defaultReferencePredicate(key: string): boolean;
/**
 * Default reference transform.
 * It removes the "$" symbol at the begging of the operand name.
 * @param {string} key
 * @return {string}
 */
export declare function defaultReferenceTransform(key: string): string;
export declare const defaultOperatorMapping: Map<symbol, string>;
/**
 * Default parser options
 */
export declare const defaultOptions: Options;
