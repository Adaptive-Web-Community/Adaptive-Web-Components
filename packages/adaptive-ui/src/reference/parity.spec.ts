import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Updates } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { Color } from "../core/color/color.js";
import { DesignTokenRegistry, DesignTokenType } from "../core/adaptive-design-tokens.js";
import { densityAdjustmentUnits } from "../core/density/index.js";
import {
    accentBaseColor,
    colorContext,
    designUnit,
    strokeThickness,
    LayerBaseLuminance,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedPlus1,
    layerFillFixedRecipe,
    layerFillInteractiveRest,
    neutralBaseColor,
    neutralPalette,
} from "./index.js";

const { expect } = chai;

/**
 * Parity snapshots for the reference token set.
 *
 * Evaluates the tokens of the reference systems and compares them to a stored snapshot. Any change to an evaluated
 * value fails the test, so refactors of the reference tokens or core logic can be checked for regressions.
 *
 * - Color: the base, layer, palette, and recipe tokens for several base colors, light and dark layers, and layer nesting.
 * - Density: the padding and gap tokens for several density adjustments, design units, and stroke thicknesses.
 *
 * To accept intentional changes, regenerate the snapshot with `npm run unit-tests:update-snapshots`
 * (or set `UPDATE_SNAPSHOTS=1`).
 */

const snapshotPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../src/reference/parity.snapshot.json"
);

type Resolver = <T>(token: DesignToken<T>) => T;
type Snapshot = Record<string, any>;

const baseColors: Record<string, string | null> = {
    default: null,
    blue: "#336699",
    orange: "#F26C0D",
    green: "#2E7D32",
};

const layerModes: Record<string, number> = {
    light: LayerBaseLuminance.LightMode,
    dark: LayerBaseLuminance.DarkMode,
};

const rampIndexes = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

const layoutNodes = new WeakSet<Element>();

/**
 * Creates a stand-in for a `FASTElement` so design tokens can be set and resolved through a real element hierarchy,
 * including value inheritance and derived values re-evaluating in the context of each element.
 *
 * @remarks
 * jsdom doesn't support custom elements, so the minimum of the `FASTElement` controller is faked.
 */
function createElement(parent?: Element): Element {
    const element = document.createElement("div");
    (parent ?? document.body).appendChild(element);
    layoutNodes.add(element);
    (element as any).$fastController = {
        isConnected: false,
        addStyles: () => {},
        addBehavior: (behavior: any) => behavior.connectedCallback?.({ source: element }),
    };
    return element;
}

function createResolver(element: Element): Resolver {
    return <T>(token: DesignToken<T>): T => token.getValueFor(element as any);
}

function serialize(value: any): any {
    if (value === null || value === undefined || typeof value !== "object") {
        return value ?? null;
    }
    if (value instanceof Color) {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map(serialize);
    }
    if (Array.isArray((value as any).swatches)) {
        // Palette
        return (value as any).swatches.map(serialize);
    }
    const result: Record<string, any> = {};
    Object.keys(value).sort().forEach(key => {
        result[key] = serialize(value[key]);
    });
    return result;
}

function tokensOfType(type: string, filter: (name: string) => boolean = () => true): [string, DesignToken<any>][] {
    return [...DesignTokenRegistry.Shared.entries()]
        .filter(([name, token]) => (token as any).type === type && filter(name))
        .sort(([a], [b]) => a.localeCompare(b));
}

const isColorName = (name: string) => name.startsWith("color.");
const isBaseName = (name: string) => isColorName(name) && /\.base(Color)?$/.test(name);
const isLayerName = (name: string) => name.startsWith("color.layer.") && !name.endsWith(".recipe");
// The layer ramp recipe requires an index, it's snapshotted separately.
const isColorRecipeName = (name: string) => isColorName(name) && name !== layerFillFixedRecipe.name;

function snapshotBases(resolve: Resolver): Snapshot {
    const result: Snapshot = {};
    tokensOfType(DesignTokenType.color, isBaseName).forEach(([name, token]) => {
        result[name] = serialize(resolve(token));
    });
    return result;
}

function snapshotPalettes(resolve: Resolver): Snapshot {
    const result: Snapshot = {};
    tokensOfType(DesignTokenType.palette, isColorName).forEach(([name, token]) => {
        result[name] = serialize(resolve(token));
    });
    return result;
}

function snapshotLayers(resolve: Resolver): Snapshot {
    const result: Snapshot = {};
    tokensOfType(DesignTokenType.color, isLayerName).forEach(([name, token]) => {
        result[name] = serialize(resolve(token));
    });
    tokensOfType(DesignTokenType.paint, isLayerName).forEach(([name, token]) => {
        result[name] = serialize(resolve(token));
    });
    const ramp = resolve(layerFillFixedRecipe);
    rampIndexes.forEach(index => {
        result[`${layerFillFixedRecipe.name}[${index}]`] = serialize(ramp.evaluate(resolve as any, index));
    });
    return result;
}

// The recipes of a palette of the system (accent, and so on) have the palette they are configured with, which a palette that is given would replace.
// The others, the shared recipes and those of a set, are for any palette or reference, so they are given one.
const isPaletteRecipeName = (name: string) => /^color\.(neutral|accent|highlight|critical|warning|success|info)\./.test(name);

function snapshotRecipes(resolve: Resolver): Snapshot {
    const result: Snapshot = {};
    tokensOfType(DesignTokenType.recipe, isColorRecipeName).forEach(([name, token]) => {
        const params = isPaletteRecipeName(name) ? undefined : { palette: resolve(neutralPalette) };
        result[name] = serialize((resolve(token) as any).evaluate(resolve as any, params));
    });
    return result;
}

/**
 * Layer nesting, where each entry is the layer color to establish as the context (`colorContext`) for the content within.
 */
const nestingLevels: Record<string, (resolve: Resolver) => Color> = {
    "0-base": resolve => resolve(layerFillFixedBase),
    "1-fixed-plus1": resolve => resolve(layerFillFixedPlus1),
    "2-interactive": resolve => resolve(layerFillInteractiveRest) as Color,
};

const densityAdjustments = [-2, -1, 0, 1, 2];
const designUnits = ["4px", "8px"];
const strokeThicknesses = ["1px", "2px"];

// The density groups plus the global tokens they're derived from.
const isDensityName = (name: string) => name.startsWith("density.") || name === designUnit.name || name === strokeThickness.name;

function snapshotDensity(resolve: Resolver): Snapshot {
    const result: Snapshot = {};
    [DesignTokenType.dimension, DesignTokenType.number].forEach(type => {
        tokensOfType(type, isDensityName).forEach(([name, token]) => {
            result[name] = serialize(resolve(token));
        });
    });
    return result;
}

function buildDensitySnapshot(): Snapshot {
    const snapshot: Snapshot = {};

    designUnits.forEach(unit => {
        strokeThicknesses.forEach(stroke => {
            densityAdjustments.forEach(adjustment => {
                const root = createElement();
                designUnit.setValueFor(root as any, unit);
                strokeThickness.setValueFor(root as any, stroke);

                // The adjustment is applied to a descendant, the group tokens are derived in that context.
                const element = createElement(root);
                densityAdjustmentUnits.setValueFor(element as any, adjustment);

                snapshot[`unit=${unit}/stroke=${stroke}/adjustment=${adjustment}`] = snapshotDensity(createResolver(element));

                root.remove();
            });
        });
    });

    return snapshot;
}

function buildSnapshot(): Snapshot {
    const snapshot: Snapshot = { palettes: {}, scenarios: {}, density: buildDensitySnapshot() };

    Object.entries(baseColors).forEach(([baseName, hex]) => {
        Object.entries(layerModes).forEach(([modeName, luminance]) => {
            const root = createElement();
            if (hex) {
                neutralBaseColor.setValueFor(root as any, Color.parse(hex)!);
                accentBaseColor.setValueFor(root as any, Color.parse(hex)!);
            }
            layerFillBaseLuminance.setValueFor(root as any, luminance);

            if (modeName === "light") {
                const resolve = createResolver(root);
                snapshot.palettes[baseName] = {
                    bases: snapshotBases(resolve),
                    palettes: snapshotPalettes(resolve),
                };
            }

            // Each level is nested inside the previous, the layer is resolved in its parent's context.
            let parent = root;
            Object.entries(nestingLevels).forEach(([levelName, layer]) => {
                const context = layer(createResolver(parent));
                const element = createElement(parent);
                colorContext.setValueFor(element as any, context);

                const resolve = createResolver(element);
                snapshot.scenarios[`${baseName}/${modeName}/${levelName}`] = {
                    context: serialize(context),
                    layers: snapshotLayers(resolve),
                    recipes: snapshotRecipes(resolve),
                };

                parent = element;
            });

            root.remove();
        });
    });

    return snapshot;
}

describe("reference token parity", () => {
    let actual: Snapshot;

    before(() => {
        DesignToken.withStrategy({
            contains: (parent, child) => parent.contains(child),
            parent: (element: any) => {
                let current = element.parentElement;
                while (current && !layoutNodes.has(current)) {
                    current = current.parentElement;
                }
                return current as any;
            },
        });
        // jsdom doesn't provide `requestAnimationFrame`, so flush updates synchronously.
        Updates.setMode(false);
        actual = buildSnapshot();
    });

    after(() => {
        Updates.setMode(true);
    });

    it("should evaluate a non-trivial token set", () => {
        const scenario = actual.scenarios["default/light/0-base"];
        expect(Object.keys(scenario.recipes).length).to.be.greaterThan(50);
        expect(Object.keys(scenario.layers).length).to.be.greaterThan(10);
        expect(Object.keys(actual.palettes.default.palettes).length).to.be.greaterThan(5);
    });

    it("should differ between light and dark layers", () => {
        expect(actual.scenarios["default/light/0-base"].context).to.not.equal(actual.scenarios["default/dark/0-base"].context);
    });

    it("should evaluate the density tokens", () => {
        const scenario = actual.density["unit=4px/stroke=1px/adjustment=0"];
        expect(Object.keys(scenario).length).to.be.greaterThan(40);
        expect(scenario["density.control.horizontal.padding"]).to.equal("calc((3 * 4px) - 1px)");
    });

    it("should adjust the density tokens", () => {
        expect(actual.density["unit=4px/stroke=1px/adjustment=1"]["density.control.horizontal.padding"]).to.equal("calc((4 * 4px) - 1px)");
        expect(actual.density["unit=8px/stroke=2px/adjustment=-1"]["density.control.vertical.gap"]).to.equal("calc((1 + -1) * 8px)");
    });

    it("should match the stored snapshot", () => {
        const serialized = JSON.stringify(actual, null, 1) + "\n";

        if (process.env.UPDATE_SNAPSHOTS || process.argv.includes("--update-snapshots") || !fs.existsSync(snapshotPath)) {
            fs.writeFileSync(snapshotPath, serialized);
            return;
        }

        const expected = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
        const actualParsed = JSON.parse(serialized);

        // Compare per section so a failure points at the scenario that changed.
        expect(Object.keys(actualParsed.palettes), "palette sets").to.deep.equal(Object.keys(expected.palettes));
        Object.keys(expected.palettes).forEach(key => {
            expect(actualParsed.palettes[key], `palettes: ${key}`).to.deep.equal(expected.palettes[key]);
        });
        expect(Object.keys(actualParsed.density), "density scenarios").to.deep.equal(Object.keys(expected.density));
        Object.keys(expected.density).forEach(key => {
            expect(actualParsed.density[key], `density: ${key}`).to.deep.equal(expected.density[key]);
        });
        expect(Object.keys(actualParsed.scenarios), "scenarios").to.deep.equal(Object.keys(expected.scenarios));
        Object.keys(expected.scenarios).forEach(key => {
            expect(actualParsed.scenarios[key], `scenario: ${key}`).to.deep.equal(expected.scenarios[key]);
        });
    });
});
