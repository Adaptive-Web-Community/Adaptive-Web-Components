import type { DesignToken } from "design-token-library";

type Dimension = DesignToken.Values.Dimension;

/**
 * A token, by its name, that an {@link Expression} uses the value of.
 *
 * @public
 */
export interface Reference {
    ref: string;
}

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
 * An expression is plain data, so it can be the value of a token (why: `docs/decisions/0004-derived-values-are-expressions.md`), and it has two uses: it is written to CSS as a
 * `calc()` of the custom properties of the tokens it references, so changing one of them changes the result in
 * the browser, and {@link evaluate} gets the value of it for something that needs the number.
 *
 * @public
 */
export interface Expression {
    fn: MathFunction;
    args: Operand[];
}

/**
 * What an {@link Expression} is made of: a number, a dimension, another token, or another expression.
 *
 * @public
 */
export type Operand = number | Dimension | Reference | Expression;

/**
 * An {@link Operand} as the value of a token.
 *
 * @remarks
 * The arguments of an expression are not typed, since the library checks the type of a custom value by going
 * through its shape and can't for a type that contains itself.
 *
 * @public
 */
export type OperandValue = number | Dimension | Reference | { fn: MathFunction; args: unknown[] };

/**
 * The value of an {@link Operand}.
 *
 * @public
 */
export type Evaluated = number | Dimension;

/**
 * Creates a reference to a token.
 *
 * @remarks
 * The token is one of a library, like the ones in the context of an alias, so a reference can't be to a name
 * that isn't a token. The reference is by the name of the token, which is how the data is serialized.
 *
 * @param token - The token
 * @returns A reference
 *
 * @public
 */
export function ref(token: DesignToken.Shape): Reference {
    const name = (token as { name?: unknown }).name;
    if (typeof name !== "string") {
        throw new Error("A reference is to a token of a library");
    }
    return { ref: name };
}

const expression =
    (fn: MathFunction) =>
    (...args: Operand[]): Expression => ({ fn, args });

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

const isReference = (operand: Operand): operand is Reference => typeof operand === "object" && "ref" in operand;
const isExpression = (operand: Operand): operand is Expression => typeof operand === "object" && "fn" in operand;

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
export function formatExpression(value: OperandValue, property: (token: string) => string): string {
    const format = (operand: Operand, parent?: Expression): string => {
        if (typeof operand === "number") {
            return String(operand);
        }
        if (isReference(operand)) {
            return `var(${property(operand.ref)})`;
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
    return format(value as Operand);
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
 * @param resolve - Gets the operand a token has, from its name
 * @returns A number or a dimension
 *
 * @public
 */
export function evaluate(value: OperandValue, resolve: (token: string) => OperandValue): Evaluated {
    const run = (operand: Operand, seen: string[]): Evaluated => {
        if (typeof operand === "number" || (typeof operand === "object" && "unit" in operand)) {
            return operand;
        }
        if (isReference(operand)) {
            if (seen.includes(operand.ref)) {
                throw new Error(`Circular reference: ${[...seen, operand.ref].join(" → ")}`);
            }
            return run(resolve(operand.ref) as Operand, [...seen, operand.ref]);
        }
        const values = operand.args.map(arg => run(arg, seen));
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
    const result = run(value as Operand, []);
    return isDimension(result) ? { value: clean(result.value), unit: result.unit } : clean(result);
}
