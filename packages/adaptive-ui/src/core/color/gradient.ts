import type { DesignToken } from "design-token-library";
import { Color, formatColor } from "./color.js";

/**
 * Represents the position of a single {@link GradientStop}.
 *
 * @public
 */
export type GradientStopPosition = {
    /**
     * The value of the gradient stop position.
     */
    value: number;

    /**
     * The unit of the gradient stop position.
     *
     * @remarks
     * Percentage values are represented as a decimal value between 0 and 1.
     * "deg" is valid for conic gradient stops only.
     */
    unit: "%" | "px" | "deg";
};

/**
 * Represents a single {@link Color} stop on a {@link Gradient}.
 *
 * @public
 */
export type GradientStop = {
    /**
     * The {@link Color} at this gradient stop.
     */
    color: Color;

    /**
     * The position of the start of the gradient stop.
     */
    position: GradientStopPosition;

    /**
     * The position of the end of the gradient stop.
     */
    endPosition?: GradientStopPosition;
};

/**
 * Supported gradient types.
 *
 * @public
 */
export type GradientType = "conic" | "linear" | "radial";

/**
 * The properties shared by all gradients.
 *
 * @public
 */
export interface GradientBase {
    /**
     * The type of gradient.
     */
    readonly type: GradientType;

    /**
     * The stops on the gradient.
     */
    readonly stops: ReadonlyArray<GradientStop>;
}

/**
 * Represents a conic gradient.
 *
 * @public
 */
export interface ConicGradient extends GradientBase {
    readonly type: "conic";

    /**
     * The angle of the gradient in degrees.
     */
    readonly angle: number;
}

/**
 * Represents a linear gradient.
 *
 * @public
 */
export interface LinearGradient extends GradientBase {
    readonly type: "linear";

    /**
     * The angle of the gradient in degrees.
     */
    readonly angle: number;
}

/**
 * Represents a radial gradient.
 *
 * @public
 */
export interface RadialGradient extends GradientBase {
    readonly type: "radial";
}

/**
 * Represents a gradient.
 *
 * @remarks
 * This extends what a {@link https://www.designtokens.org/tr/2025.10/format/#gradient | DTCG gradient} has, which is
 * the color of each stop and its position, with the type of the gradient, its angle, and the unit and end of the
 * position of a stop. The functions that work with a gradient also work with a {@link DtcgGradient}.
 *
 * @public
 */
export type Gradient = ConicGradient | LinearGradient | RadialGradient;

/**
 * A {@link https://www.designtokens.org/tr/2025.10/format/#gradient | DTCG gradient}, which is a list of the stops with
 * a color and a position from 0 to 1, and has nothing about what kind of gradient it is.
 *
 * @public
 */
export type DtcgGradient = DesignToken.Values.Gradient;

/**
 * Checks if a gradient is a {@link DtcgGradient}, which is a list.
 *
 * @param gradient - The gradient to check
 * @returns True if the gradient is a DTCG gradient, false if it is a {@link Gradient}
 *
 * @public
 */
export function isDtcgGradient(gradient: Gradient | DtcgGradient): gradient is DtcgGradient {
    return Array.isArray(gradient);
}

function assertStops(stops: ReadonlyArray<GradientStop>, units: ReadonlyArray<GradientStopPosition["unit"]>) {
    if (stops.length < 2) {
        throw new Error("A Gradient must have at least two stops");
    }

    const isInvalid = (position?: GradientStopPosition) => position !== undefined && !units.includes(position.unit);
    if (stops.some(stop => isInvalid(stop.position) || isInvalid(stop.endPosition))) {
        throw new Error(`All stop positions must have a unit of ${units.map(unit => `'${unit}'`).join(" or ")}`);
    }
}

function frozenStops(stops: ReadonlyArray<GradientStop>): ReadonlyArray<GradientStop> {
    return Object.freeze([...stops]);
}

/**
 * Creates a conic gradient.
 *
 * @param stops - The stops, which must all have a unit of "deg"
 * @param angle - The angle of the gradient in degrees
 * @returns A new gradient
 *
 * @public
 */
export function conicGradient(stops: ReadonlyArray<GradientStop>, angle: number = 0): ConicGradient {
    assertStops(stops, ["deg"]);
    return Object.freeze({ type: "conic", stops: frozenStops(stops), angle });
}

/**
 * Creates a linear gradient.
 *
 * @param stops - The stops, which must all have a unit of "%" or "px"
 * @param angle - The angle of the gradient in degrees
 * @returns A new gradient
 *
 * @public
 */
export function linearGradient(stops: ReadonlyArray<GradientStop>, angle: number = 0): LinearGradient {
    assertStops(stops, ["%", "px"]);
    return Object.freeze({ type: "linear", stops: frozenStops(stops), angle });
}

/**
 * Creates a radial gradient.
 *
 * @param stops - The stops, which must all have a unit of "%" or "px"
 * @returns A new gradient
 *
 * @public
 */
export function radialGradient(stops: ReadonlyArray<GradientStop>): RadialGradient {
    assertStops(stops, ["%", "px"]);
    return Object.freeze({ type: "radial", stops: frozenStops(stops) });
}

/**
 * Creates a {@link Gradient} from a {@link DtcgGradient}.
 *
 * @remarks
 * A DTCG gradient doesn't say which kind it is. It is a linear gradient from the top to the bottom, which is what CSS
 * does without an angle, and the positions are percentages.
 *
 * @param gradient - The DTCG gradient
 * @param angle - The angle of the gradient in degrees, which is 180 for from the top to the bottom
 * @returns A new gradient
 *
 * @public
 */
export function fromDtcgGradient(gradient: DtcgGradient, angle: number = 180): LinearGradient {
    return linearGradient(
        gradient.map(stop => ({ color: stop.color, position: { value: stop.position, unit: "%" as const } })),
        angle
    );
}

/**
 * Gets a gradient that is a {@link Gradient}, from a gradient that may be a {@link DtcgGradient}.
 *
 * @param gradient - A gradient of either kind
 * @returns The gradient, or a linear gradient for a DTCG gradient
 *
 * @public
 */
export function toGradient(gradient: Gradient | DtcgGradient): Gradient {
    return isDtcgGradient(gradient) ? fromDtcgGradient(gradient) : gradient;
}

function formatPosition(position: GradientStopPosition): string {
    return position.unit === "%" ? (position.value * 100).toFixed(0) + "%" : position.value + position.unit;
}

function formatStops(stops: ReadonlyArray<GradientStop>): string {
    return stops
        .map(stop =>
            `${formatColor(stop.color)} ${formatPosition(stop.position)} ${stop.endPosition ? formatPosition(stop.endPosition) : ""}`.trim()
        )
        .join(", ");
}

/**
 * Gets a gradient as a string for use in CSS.
 *
 * @param gradient - The gradient, of either kind
 * @returns The gradient value in a valid CSS string format
 *
 * @public
 */
export function formatGradient(value: Gradient | DtcgGradient): string {
    const gradient = toGradient(value);
    switch (gradient.type) {
        case "conic":
            return `conic-gradient(from ${gradient.angle}deg, ${formatStops(gradient.stops)})`;
        case "linear":
            return `linear-gradient(${gradient.angle}deg, ${formatStops(gradient.stops)})`;
        case "radial":
            return `radial-gradient(${formatStops(gradient.stops)})`;
    }
}
