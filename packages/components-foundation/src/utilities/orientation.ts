import type { ValuesOf } from "./typings.js";

/**
 * The direction in which an element is laid out.
 *
 * @public
 */
export const Orientation = {
    horizontal: "horizontal",
    vertical: "vertical",
} as const;

/**
 * The direction in which an element is laid out.
 *
 * @public
 */
export type Orientation = ValuesOf<typeof Orientation>;
