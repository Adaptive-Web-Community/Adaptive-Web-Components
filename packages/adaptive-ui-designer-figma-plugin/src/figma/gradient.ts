import { Gradient, GradientStop, GradientType, LinearGradient } from "@adaptive-web/adaptive-ui";
import { Rgb } from "culori/fn";
import { compose, rotate, scale, translate } from "transformation-matrix";
import { colorToRgba } from "./utility.js";

// Big thanks here to Michael Yagudaev, https://github.com/yagudaev/css-gradient-to-figma

export function gradientToGradientPaint(gradient: Gradient, width = 1, height = 1): GradientPaint {
    const gradientLength = calculateLength(gradient, width, height);
    const [sx, sy] = calculateScale(gradient);
    const rotationAngle = calculateRotationAngle(gradient);
    const [tx, ty] = calculateTranslationToCenter(gradient);
    const gradientTransform = compose(
        translate(0, 0.5),
        scale(sx, sy),
        rotate(rotationAngle),
        translate(tx, ty)
    );

    let previousPosition: number | undefined = undefined;
    const gradientPaint: GradientPaint = {
        type: convertType(gradient.type),
        gradientStops: gradient.stops.map((stop, index) => {
            const position = getPosition(stop, index, gradient.stops.length, gradientLength, previousPosition);
            previousPosition = position;
            return {
                position,
                color: colorToRgba(stop.color.color as Rgb),
            };
        }),
        gradientTransform: [
            [gradientTransform.a, gradientTransform.c, gradientTransform.e],
            [gradientTransform.b, gradientTransform.d, gradientTransform.f],
        ],
    };

    return gradientPaint;
}

function getPosition(
    stop: GradientStop,
    index: number,
    total: number,
    gradientLength: number,
    previousPosition = 0
): number {
    if (total <= 1) return 0;
    // browsers will enforce increasing positions (red 50%, blue 0px) becomes (red 50%, blue 50%)
    const normalize = (v: number) => Math.max(previousPosition, Math.min(1, v));
    if (stop.position) {
        if (stop.position.value <= 0) {
            // TODO: add support for negative color stops, figma doesn't support it, instead we will
            // have to scale the transform to fit the negative color stops
            return normalize(0);
        }
        switch (stop.position.unit) {
            case "%":
                return normalize(stop.position.value);
            case "px":
                return normalize(stop.position.value / gradientLength);
            default:
                console.warn("Unsupported stop position unit: ", stop.position.unit);
        }
    }
    return normalize(index / (total - 1));
}

function convertType(
    type: GradientType
): "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" {
    switch (type) {
        case "conic":
            return "GRADIENT_ANGULAR";
        case "linear":
            return "GRADIENT_LINEAR";
        case "radial":
            return "GRADIENT_RADIAL";
        default:
            throw "unsupported gradient type";
    }
}

function calculateRotationAngle(gradient: Gradient): number {
    // CSS has a top-down default, figma has a right-left default when no angle is specified
    // CSS has a default unspecified angle of 180deg, figma has a default unspecified angle of 0deg
    const initialRotation = -Math.PI / 2.0; // math rotation with css 180deg default
    let additionalRotation = 0.0;

    // linear gradients
    if (gradient.type === "linear") {
        // css angle is clockwise from the y-axis, figma angles are counter-clockwise from the x-axis
        additionalRotation = (convertCssAngle((gradient as LinearGradient).angle) + 90) % 360;
        return degreesToRadians(additionalRotation);
    } else if (gradient.type === "radial") {
        // if size is 'furthers-corner' which is the default, then the rotation is 45 to reach corner
        // any corner will do, but we will use the bottom right corner
        // since the parser is not smart enough to know that, we just assume that for now
        additionalRotation = 45;
    }

    return initialRotation + degreesToRadians(additionalRotation);
}

type FigmaAngle = number; // 0-360, CCW from x-axis
type CssAngle = number; // 0-360, CW from y-axis

function convertCssAngle(angle: CssAngle): FigmaAngle {
    // positive angles only
    angle = angle < 0 ? 360 + angle : angle;
    // convert to CCW angle use by figma
    angle = 360 - angle;
    return angle % 360;
}

function calculateLength(gradient: Gradient, width: number, height: number): number {
    if (gradient.type === "linear") {
        // from w3c: abs(W * sin(A)) + abs(H * cos(A))
        // https://w3c.github.io/csswg-drafts/css-images-3/#linears
        const rads = degreesToRadians(convertCssAngle((gradient as LinearGradient).angle));
        return Math.abs(width * Math.sin(rads)) + Math.abs(height * Math.cos(rads));
    } else if (gradient.type === "radial") {
        // if size is 'furthers-corner' which is the default, then the scale is sqrt(2)
        // since the parser is not smart enough to know that, we just assume that for now
        return Math.sqrt(2);
    }
    throw "unsupported gradient type";
}

function calculateScale(gradient: Gradient): [number, number] {
    if (gradient.type === "linear") {
        // from w3c: abs(W * sin(A)) + abs(H * cos(A))
        // https://w3c.github.io/csswg-drafts/css-images-3/#linears
        // W and H are unit vectors, so we can just use 1
        const angleRad = degreesToRadians(convertCssAngle((gradient as LinearGradient).angle));
        const scale =
            Math.abs(Math.sin(angleRad)) +
            Math.abs(Math.cos(angleRad));

        return [1.0 / scale, 1.0 / scale];
    } else if (gradient.type === "radial") {
        // if size is 'furthers-corner' which is the default, then the scale is sqrt(2)
        // since the parser is not smart enough to know that, we just assume that for now
        const scale = 1 / Math.sqrt(2);
        return [scale, scale];
    }

    return [1.0, 1.0];
}

function calculateTranslationToCenter(gradient: Gradient): [number, number] {
    if (gradient.type === "linear") {
        const angle = convertCssAngle((gradient as LinearGradient).angle);
        if (angle === 0) {
            return [-0.5, -1];
        } else if (angle === 90) {
            return [-1, -0.5];
        } else if (angle === 180) {
            return [-0.5, 0];
        } else if (angle === 270) {
            return [0, -0.5];
        } else if (angle > 0 && angle < 90) {
            return [-1, -1];
        } else if (angle > 90 && angle < 180) {
            return [-1, 0];
        } else if (angle > 180 && angle < 270) {
            return [0, 0];
        } else if (angle > 270 && angle < 360) {
            return [0, -1];
        }
    } else if (gradient.type === "radial") {
        return [0, 0];
    }

    return [0, 0];
}

function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}
