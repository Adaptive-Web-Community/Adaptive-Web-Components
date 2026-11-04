import { configuredValueOf, DesignToken, isRef, Library, pathOf } from "design-token-library";
import type { ExpressionToken } from "./token-types.js";

type Dimension = DesignToken.Values.Readonly.Dimension;

/**
 * The math that an {@link Expression} does.
 *
 * @public
 */
export type MathFunction = "add" | "subtract" | "multiply" | "divide" | "pow" | "round" | "min" | "max";

/**
 * A calculation of numbers and dimensions, which may be the values of other tokens.
 *
 * @remarks
 * An expression is plain data, so it can be the value of a token (why: `docs/decisions/0004-derived-values-are-expressions.md`). Where
 * one is made, an operand may be a ref of the library to another token ({@link ConfiguredOperand}), which the library keeps as the token's
 * configured value, and tracks as a dependency. An expression has two uses: it is written to CSS as a `calc()` of the custom
 * properties of the tokens it refers to, so changing one of them changes the result in the browser, and {@link evaluate} gets the
 * value of it for something that needs the number.
 *
 * @public
 */
export interface Expression {
    readonly fn: MathFunction;
    readonly args: readonly Operand[];
}

/**
 * What an {@link Expression} is made of, and the value of a token of the `expression` type: a number, a dimension, or an expression.
 *
 * @remarks
 * This is the value as it is read from a token, with the values of the tokens it refers to in place of the refs. See {@link ConfiguredOperand}
 * for it as it is given, with refs.
 *
 * @public
 */
export type Operand = number | Dimension | Expression;

/**
 * An {@link Expression} as it is given, in which an operand may be a ref of the library.
 *
 * @public
 */
export interface ConfiguredExpression {
    readonly fn: MathFunction;
    readonly args: readonly ConfiguredOperand[];
}

/**
 * An {@link Operand} as it is given: any operand of an expression may be a ref of the library, made by `ref()` or `refs()`, to a token
 * whose value is an operand, and the library keeps it as a ref and not as the value of the token.
 *
 * @public
 */
export type ConfiguredOperand = number | Dimension | Library.Ref<Operand, any> | ConfiguredExpression;

/**
 * The value of an {@link Operand}.
 *
 * @public
 */
export type Evaluated = number | Dimension;

const expression =
    (fn: MathFunction) =>
    // The refs of the operands may be of libraries of different shapes, so they aren't checked against one here: a path that isn't a token is
    // found when the value of the token is read.
    (...args: ConfiguredOperand[]): ConfiguredExpression => ({ fn, args });

/** The sum of the operands. @public */
export const add = expression("add");
/** The first operand less the others. @public */
export const subtract = expression("subtract");
/** The product of the operands. @public */
export const multiply = expression("multiply");
/** The first operand divided by the others. @public */
export const divide = expression("divide");
/** The first operand to the power of the second, which are both numbers. @public */
export const pow = expression("pow");
/** The first operand rounded to the nearest multiple of the second, where halfway rounds up. @public */
export const round = expression("round");
/** The smallest of the operands. @public */
export const min = expression("min");
/** The largest of the operands. @public */
export const max = expression("max");

const isExpression = (operand: ConfiguredOperand): operand is ConfiguredExpression => typeof operand === "object" && "fn" in operand;

/**
 * Tests whether the configured value of a token is an operand that an expression can use, which is not a value that a recipe computes.
 *
 * @internal
 */
export const isConfiguredOperand = (value: unknown): value is ConfiguredOperand =>
    typeof value === "number" || isRef(value) || (typeof value === "object" && value !== null && ("unit" in value || "fn" in value));

// The configured value of the token at a path of a library, which has the refs in it as they were given.
function valueAt(library: Library.Library<any>, path: string): ConfiguredOperand {
    let node: unknown = library.tokens;
    for (const key of path.split(".")) {
        node = typeof node === "object" && node !== null ? Reflect.get(node, key) : undefined;
    }
    if (typeof node !== "object" || node === null || !("$value" in node)) {
        throw new Error(`There is no token named ${path}`);
    }
    // The value as the library resolves it, which throws for tokens that refer to each other, and is the one to check the type of.
    const resolved = node.$value;
    if (!isConfiguredOperand(resolved)) {
        throw new Error(`The token ${path} is not a number, a dimension, or an expression`);
    }
    // The path is a string, so the token is found by name and not by its type.
    const configured = configuredValueOf(node as Library.Token<ExpressionToken, any>);
    return isConfiguredOperand(configured) ? configured : resolved;
}

// The values are written to CSS, so they are rounded to avoid noise like 19.360000000000003
const precision = 10000;
const clean = (value: number) => Math.round(value * precision) / precision;

const infix: Partial<Record<MathFunction, string>> = { add: "+", subtract: "-", multiply: "*", divide: "/" };

/**
 * Gets the CSS for an operand, with the custom properties of the tokens it references.
 *
 * @param value - The operand, or the value of a token that is one
 * @param property - Gets the name of the custom property of a token from the name of the token, with the leading `--`
 * @returns A `calc()` for an expression of the basic operators, a math function for another, and a value otherwise
 *
 * @public
 */
export function formatExpression(value: ConfiguredOperand, property: (token: string) => string): string {
    const format = (operand: ConfiguredOperand, parent?: ConfiguredExpression): string => {
        if (typeof operand === "number") {
            return String(operand);
        }
        if (isRef(operand)) {
            return `var(${property(pathOf(operand).join("."))})`;
        }
        if (isExpression(operand)) {
            const operator = infix[operand.fn];
            if (operator) {
                const sum = operand.args.map(arg => format(arg, operand)).join(` ${operator} `);
                // An expression in an expression of operators needs the parentheses to keep its order.
                return parent && infix[parent.fn] ? `(${sum})` : parent ? sum : `calc(${sum})`;
            }
            return `${operand.fn}(${operand.args.map(arg => format(arg, operand)).join(", ")})`;
        }
        return `${operand.value}${operand.unit}`;
    };
    return format(value);
}

const isDimension = (value: Evaluated): value is Dimension => typeof value === "object";

function unit(a: Dimension, b: Dimension, fn: string): Dimension["unit"] {
    if (a.unit !== b.unit) {
        throw new Error(`Can't ${fn} ${a.unit} and ${b.unit}`);
    }
    return a.unit;
}

function fold(fn: MathFunction, values: Evaluated[], op: (a: number, b: number) => number): Evaluated {
    return values.reduce((a, b) => {
        const left = isDimension(a);
        const right = isDimension(b);
        if (!left && !right) {
            return op(a as number, b as number);
        }
        if (left && right) {
            if (fn === "divide") {
                unit(a as Dimension, b as Dimension, fn);
                return op((a as Dimension).value, (b as Dimension).value);
            }
            if (fn === "multiply") {
                throw new Error("Can't multiply two dimensions");
            }
            return { value: op((a as Dimension).value, (b as Dimension).value), unit: unit(a as Dimension, b as Dimension, fn) };
        }
        if (fn === "add" || fn === "subtract") {
            throw new Error(`Can't ${fn} a number and a dimension`);
        }
        if (fn === "divide" && right) {
            throw new Error("Can't divide a number by a dimension");
        }
        const dimension = (left ? a : b) as Dimension;
        const number = (left ? b : a) as number;
        return { value: left ? op(dimension.value, number) : op(number, dimension.value), unit: dimension.unit };
    });
}

/**
 * Gets the value of an operand, which is a number or a dimension.
 *
 * @remarks
 * Numbers and dimensions follow the rules of CSS: a dimension can be added to a dimension of the same unit,
 * multiplied or divided by a number, and divided by a dimension of the same unit for a number.
 *
 * @param value - The operand, or the value of a token that is one
 * @param library - The library of the tokens that the operand refers to
 * @returns A number or a dimension
 *
 * @public
 */
export function evaluate(value: ConfiguredOperand, library: Library.Library<any>): Evaluated {
    // The library doesn't allow tokens that refer to each other, so a chain of refs ends.
    const run = (operand: ConfiguredOperand): Evaluated => {
        if (isRef(operand)) {
            return run(valueAt(library, pathOf(operand).join(".")));
        }
        if (typeof operand === "number" || "unit" in operand) {
            return operand;
        }
        const values = operand.args.map(run);
        switch (operand.fn) {
            case "add":
                return fold("add", values, (a, b) => a + b);
            case "subtract":
                return fold("subtract", values, (a, b) => a - b);
            case "multiply":
                return fold("multiply", values, (a, b) => a * b);
            case "divide":
                return fold("divide", values, (a, b) => a / b);
            case "pow":
                if (values.some(isDimension)) {
                    throw new Error("Can't use a dimension for pow");
                }
                return Math.pow(values[0] as number, values[1] as number);
            case "round":
                return fold("round", values, (a, b) => Math.round(a / b) * b);
            case "min":
                return fold("min", values, Math.min);
            case "max":
                return fold("max", values, Math.max);
        }
    };
    // Only the result is rounded, like the browser does with the numbers in a calculation until it has the value.
    const result = run(value);
    return isDimension(result) ? { value: clean(result.value), unit: result.unit } : clean(result);
}
