import { html, repeat } from "@microsoft/fast-element";
import { Color, isDark } from "@adaptive-web/adaptive-ui";
import { PaletteGradient } from "./palette-gradient.js";

function getClass(color: Color, source?: Color, closestSource?: Color) {
    return color.toString() === source?.toString()
        ? "source"
        : color.toString() === closestSource?.toString()
        ? "source closest"
        : "";
}

function getColor(background: Color) {
    const darkMode = isDark(background);
    return darkMode ? "white" : "black";
}

export const paletteGradientTemplate = html<PaletteGradient>`
    ${repeat(
        (x) => x.palette?.swatches || [],
        html<Color, PaletteGradient>`
            <a
                class="${(x, c) => getClass(x, c.parent.palette?.source, c.parent.closestSource)}"
                style="background: ${(x) => x.toString()}; color: ${(x) => getColor(x)}"
                title="${(x, c) => c.index.toString().concat(": ", x.toString().toUpperCase())}"
            ></a>
        `,
        { positioning: true }
    )}
`;
