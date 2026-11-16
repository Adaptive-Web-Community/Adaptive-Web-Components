import { html, repeat } from "@microsoft/fast-element";
import { type Color, formatColor, isDark } from "@adaptive-web/adaptive-ui";
import { PaletteGradient } from "./palette-gradient.js";

function getClass(color: Color, source?: Color, closestSource?: Color) {
    const value = formatColor(color);
    return source && value === formatColor(source)
        ? "source"
        : closestSource && value === formatColor(closestSource)
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
                style="background: ${(x) => formatColor(x)}; color: ${(x) => getColor(x)}"
                title="${(x, c) => c.index.toString().concat(": ", formatColor(x).toUpperCase())}"
            ></a>
        `,
        { positioning: true }
    )}
`;
