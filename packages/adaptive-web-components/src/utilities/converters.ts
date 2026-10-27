import type { ValueConverter } from "@microsoft/fast-element";

/**
 * A converter of an attribute to a number that has a default, as the `max` of a native `<progress>` has: the default when the attribute is
 * absent or isn't a number.
 *
 * @remarks
 * For an attribute in the `fromView` mode, so the default isn't written to the element.
 *
 * @public
 */
export function numberConverter(defaultValue: number): ValueConverter {
    return {
        toView(value: number): string {
            return `${value}`;
        },
        fromView(value: unknown): number {
            const number = typeof value === "number" ? value : parseFloat(`${value}`);
            return value === null || value === undefined || Number.isNaN(number) ? defaultValue : number;
        },
    };
}
