import { cssDirective } from "@microsoft/fast-element";
import { PaintBase } from "./paint.js";
import { Color } from "./color.js";

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
    color: Color,

    /**
     * The position of the start of the gradient stop.
     */
    position: GradientStopPosition,

    /**
     * The position of the end of the gradient stop.
     */
    endPosition?: GradientStopPosition,
};

/**
 * Supported gradient types.
 *
 * @public
 */
export type GradientType = "conic" | "linear" | "radial";

/**
 * Represents a gradient.
 *
 * @public
 */
export abstract class Gradient extends PaintBase {
    /**
     * The type of gradient.
     */
    public abstract readonly type: GradientType;

    /**
     * The stops on the gradient.
     */
    public readonly stops: GradientStop[];

    /**
     * Creates a new Gradient.
     */
    constructor(stops: GradientStop[]) {
        if (stops.length < 2) {
            throw new Error("A Gradient must have at least two stops");
        }

        // TODO, assumes the stops are equivalent luminance
        super(stops[0].color.relativeLuminance);

        this.stops = stops;
    }

    protected get stopsListCSS() {
        function getPosition(position: GradientStopPosition): string {
            if (position.unit === "%") {
                return (position.value * 100).toFixed(0) + "%";
            } else {
                return position.value + position.unit;
            }
        }

        return this.stops.map(stop => 
            `${stop.color.toString()} ${getPosition(stop.position)} ${stop.endPosition ? getPosition(stop.endPosition) : ""}`.trim()
        ).join(", ");
    }

    /**
     * Gets this gradient value as a string.
     *
     * @returns The gradient value in string format
     */
    public abstract toString(): string;

    /**
     * Gets this gradient value as a string for use in css.
     *
     * @returns The gradient value in a valid css string format
     */
    public createCSS = this.toString;
}

/**
 * Represents a conic gradient.
 *
 * @public
 */
@cssDirective()
export class ConicGradient extends Gradient {
    public readonly type: GradientType = "conic";

    /**
     * The angle of the gradient in degrees.
     */
    public readonly angle: number;

    /**
     *
     */
    constructor(stops: GradientStop[], angle: number = 0) {
        const invalidStops = stops.filter(stop => stop.position.unit !== "deg" || (stop.endPosition && stop.endPosition?.unit !== "deg"));
        if (invalidStops.length > 0) {
            throw new Error("All stop positions must have a unit of 'deg'");
        }

        super(stops);
        this.angle = angle;
    }

    public toString(): string {
        return `conic-gradient(from ${this.angle}deg, ${this.stopsListCSS})`;
    }
}

/**
 * Represents a linear gradient.
 *
 * @public
 */
@cssDirective()
export class LinearGradient extends Gradient {
    public readonly type: GradientType = "linear";

    /**
     * The angle of the gradient in degrees.
     */
    public readonly angle: number;

    /**
     *
     */
    constructor(stops: GradientStop[], angle: number = 0) {
        const invalidStops = stops.filter(stop => 
            (stop.position.unit !== "%" && stop.position.unit !== "px") ||
            (stop.endPosition && stop.endPosition?.unit !== "%" && stop.endPosition?.unit !== "px"));
        if (invalidStops.length > 0) {
            throw new Error("All stop positions must have a unit of '%' or 'px'");
        }

        super(stops);
        this.angle = angle;
    }

    /**
     * Gets this gradient value as a string.
     *
     * @returns The gradient value in string format
     */
    public toString(): string {
        return `linear-gradient(${this.angle}deg, ${this.stopsListCSS})`;
    }
}

/**
 * Represents a radial gradient.
 *
 * @public
 */
@cssDirective()
export class RadialGradient extends Gradient {
    public readonly type: GradientType = "radial";

    /**
     *
     */
    constructor(stops: GradientStop[]) {
        const invalidStops = stops.filter(stop => 
            (stop.position.unit !== "%" && stop.position.unit !== "px") ||
            (stop.endPosition && stop.endPosition?.unit !== "%" && stop.endPosition?.unit !== "px"));
        if (invalidStops.length > 0) {
            throw new Error("All stop positions must have a unit of '%' or 'px'");
        }

        super(stops);
    }

    /**
     * Gets this gradient value as a string.
     *
     * @returns The gradient value in string format
     */
    public toString(): string {
        return `radial-gradient(${this.stopsListCSS})`;
    }
}
