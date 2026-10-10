import chai from "chai";
import { DesignTokenRegistry, DesignTokenType } from "./adaptive-design-tokens.js";
import { Color } from "./color/color.js";
import { Paint } from "./color/paint.js";
import { PaletteRGB } from "./color/palette-rgb.js";
import { Palette } from "./color/palette.js";
import { ColorRecipeParams, ColorRecipePaletteParams, InteractivePaintSet } from "./color/recipe.js";
import { StyleProperty } from "./modules/types.js";
import {
    createForegroundSet,
    createForegroundSetBySet,
    createTokenColorRecipe,
    createTokenColorRecipeBySet,
    createTokenColorRecipeForPalette,
    createTokenColorRecipeValue,
    createTokenColorRecipeWithPalette,
    createTokenColorSet,
    createTokenDelta,
    createTokenMinContrast,
} from "./token-helpers-color.js";
import { createNonCss, createTokenNonCss } from "./token-helpers.js";
import { InteractiveState } from "./types.js";

const { expect } = chai;

const red = Color.fromRgb(1, 0, 0);
const green = Color.fromRgb(0, 1, 0);
const blue = Color.fromRgb(0, 0, 1);

const resolve: any = (token: any) => token.default;
const states = Object.values(InteractiveState);

describe("token-helpers-color", () => {
    describe("createTokenDelta", () => {
        it("should name the token by state and set the default value", () => {
            const token = createTokenDelta("color-test.delta", InteractiveState.hover, 3);

            expect(token.name).to.equal("color-test.delta.hoverDelta");
            expect(token.type).to.equal("number");
            expect(token.default).to.equal(3);
        });

        it("should support a custom state string", () => {
            expect(createTokenDelta("color-test.delta", "pressed", 1).name).to.equal("color-test.delta.pressedDelta");
        });

        it("should default to the value of another token", () => {
            const other = createTokenNonCss<number>("color-test.delta-other", DesignTokenType.number).withDefault(7);
            const token = createTokenDelta("color-test.delta-alias", InteractiveState.rest, other);

            expect(token.default).to.equal(7);
        });
    });

    describe("createTokenMinContrast", () => {
        it("should name the token and set the default value", () => {
            const token = createTokenMinContrast("color-test.contrast", 4.5);

            expect(token.name).to.equal("color-test.contrast.minContrast");
            expect(token.type).to.equal("number");
            expect(token.default).to.equal(4.5);
        });
    });

    describe("recipe tokens", () => {
        const evaluate = () => red;

        it("createTokenColorRecipe should create a recipe token", () => {
            const token = createTokenColorRecipe("color-test.recipe", StyleProperty.backgroundFill, evaluate);

            expect(token.name).to.equal("color-test.recipe.recipe");
            expect(token.type).to.equal("recipe");
            expect(token.intendedFor).to.deep.equal([StyleProperty.backgroundFill]);
            expect(token.default!.evaluate).to.equal(evaluate);
        });

        it("createTokenColorRecipeBySet should create a recipe token", () => {
            const bySet = () => red;
            const token = createTokenColorRecipeBySet("color-test.recipe-by-set", StyleProperty.foregroundFill, bySet);

            expect(token.name).to.equal("color-test.recipe-by-set.recipe");
            expect(token.type).to.equal("recipe");
            expect(token.intendedFor).to.deep.equal([StyleProperty.foregroundFill]);
            expect(token.default!.evaluate).to.equal(bySet);
        });

        it("createTokenColorRecipeForPalette should create a recipe token", () => {
            const forPalette = () => red;
            const token = createTokenColorRecipeForPalette("color-test.recipe-for-palette", [StyleProperty.borderFillTop], forPalette);

            expect(token.name).to.equal("color-test.recipe-for-palette.recipe");
            expect(token.type).to.equal("recipe");
            expect(token.intendedFor).to.deep.equal([StyleProperty.borderFillTop]);
            expect(token.default!.evaluate).to.equal(forPalette);
        });
    });

    describe("createTokenColorRecipeWithPalette", () => {
        it("should name the token from the palette and recipe names", () => {
            const paletteToken = createNonCss<Palette>("color-test.accent.palette");
            const recipeToken = createTokenColorRecipeForPalette<Color>(
                "color.shared.fill.rest",
                StyleProperty.backgroundFill,
                () => red
            );
            const token = createTokenColorRecipeWithPalette(recipeToken, paletteToken);

            expect(token.name).to.equal("color-test.accent.fill.rest.recipe");
            expect(token.type).to.equal("recipe");
            expect(token.intendedFor).to.deep.equal([StyleProperty.backgroundFill]);
        });

        it("should evaluate the recipe with the palette", () => {
            const palette = PaletteRGB.from("#808080");
            const paletteToken = createNonCss<Palette>("color-test.neutral.palette").withDefault(palette);
            let received: ColorRecipePaletteParams | undefined;
            const recipeToken = createTokenColorRecipeForPalette<Color>(
                "color.shared.test-eval",
                StyleProperty.backgroundFill,
                (_resolve, params) => {
                    received = params;
                    return green;
                }
            );
            const token = createTokenColorRecipeWithPalette(recipeToken, paletteToken);

            const result = token.default!.evaluate(resolve, { reference: blue });

            expect(result).to.equal(green);
            expect(received!.palette).to.equal(palette);
            expect(received!.reference).to.equal(blue);
        });

        it("should resolve the palette when no params are provided", () => {
            const palette = PaletteRGB.from("#808080");
            const paletteToken = createNonCss<Palette>("color-test.neutral2.palette").withDefault(palette);
            let received: ColorRecipePaletteParams | undefined;
            const recipeToken = createTokenColorRecipeForPalette<Color>(
                "color.shared.test-no-params",
                StyleProperty.backgroundFill,
                (_resolve, params) => {
                    received = params;
                    return green;
                }
            );
            const token = createTokenColorRecipeWithPalette(recipeToken, paletteToken);

            token.default!.evaluate(resolve);

            expect(received!.palette).to.equal(palette);
            expect(received!.reference).to.be.undefined;
        });

        it("should allow params to override the palette", () => {
            const palette = PaletteRGB.from("#808080");
            const other = PaletteRGB.from("#0078D4");
            const paletteToken = createNonCss<Palette>("color-test.neutral3.palette").withDefault(palette);
            let received: ColorRecipePaletteParams | undefined;
            const recipeToken = createTokenColorRecipeForPalette<Color>(
                "color.shared.test-override",
                StyleProperty.backgroundFill,
                (_resolve, params) => {
                    received = params;
                    return green;
                }
            );
            const token = createTokenColorRecipeWithPalette(recipeToken, paletteToken);

            token.default!.evaluate(resolve, { reference: null, palette: other } as ColorRecipePaletteParams);

            expect(received!.palette).to.equal(other);
        });
    });

    describe("createTokenColorSet", () => {
        const setFor = (name: string, evaluate: (resolve: any) => InteractivePaintSet) => {
            const recipe = createTokenColorRecipe(name, StyleProperty.backgroundFill, evaluate as any);
            return { recipe, group: createTokenColorSet(recipe as any) };
        };
        const paintSet: InteractivePaintSet = { rest: red, hover: green, active: blue, focus: red, disabled: green };

        it("should create a group named from the recipe", () => {
            const { group } = setFor("color-test.set.a", () => paintSet);

            expect(group.name).to.equal("color-test.set.a");
            expect(group.type).to.equal("color");
            expect(group.intendedFor).to.deep.equal([StyleProperty.backgroundFill]);
        });

        it("should create a css token for each state", () => {
            const { group } = setFor("color-test.set.b", () => paintSet);

            states.forEach(s => {
                expect(group[s].name, s).to.equal(`color-test.set.b.${s}`);
                expect(group[s].type, s).to.equal("paint");
                expect(group[s].intendedFor, s).to.deep.equal([StyleProperty.backgroundFill]);
            });
        });

        it("should evaluate the recipe for each state's value", () => {
            const { group } = setFor("color-test.set.c", () => paintSet);

            expect(group.rest.default).to.equal(red);
            expect(group.hover.default).to.equal(green);
            expect(group.active.default).to.equal(blue);
            expect(group.focus.default).to.equal(red);
            expect(group.disabled.default).to.equal(green);
        });

        it("should create a value token with the recipe value", () => {
            const { group } = setFor("color-test.set.d", () => paintSet);

            expect(group.rest.default).to.equal(paintSet.rest);
            expect(DesignTokenRegistry.Shared.has("color-test.set.d.value")).to.be.true;
            expect((DesignTokenRegistry.Shared.get("color-test.set.d.value") as any).type).to.equal("color");
        });

        it("should register the group", () => {
            const { group } = setFor("color-test.set.e", () => paintSet);

            expect(DesignTokenRegistry.Groups.get("color-test.set.e")).to.equal(group);
        });

        it("should evaluate the recipe once for the set", () => {
            let count = 0;
            setFor("color-test.set.f", () => {
                count++;
                return paintSet;
            });

            expect(count).to.equal(1);
        });
    });

    describe("createTokenColorRecipeValue", () => {
        it("should create a paint token with the evaluated recipe value", () => {
            const recipe = createTokenColorRecipe<Paint>("color-test.value.a", StyleProperty.foregroundFill, () => red);
            const token = createTokenColorRecipeValue(recipe);

            expect(token.name).to.equal("color-test.value.a.value");
            expect(token.type).to.equal("paint");
            expect(token.intendedFor).to.deep.equal([StyleProperty.foregroundFill]);
            expect(token.default).to.equal(red);
        });
    });

    describe("foreground sets", () => {
        const createBackground = (name: string) => {
            const recipe = createTokenColorRecipe(name, StyleProperty.backgroundFill, () => ({
                rest: red,
                hover: green,
                active: blue,
                focus: Color.fromRgb(1, 1, 0),
                disabled: Color.fromRgb(0.5, 0.5, 0.5),
            }));
            return createTokenColorSet(recipe as any);
        };

        describe("createForegroundSet", () => {
            it("should name the set from the foreground recipe and background group", () => {
                const background = createBackground("color.test-fg.bg");
                const recipe = createTokenColorRecipe<any>("color-test.fg.a", StyleProperty.foregroundFill, () => ({
                    rest: Color.fromRgb(0.1, 0.1, 0.1),
                    hover: Color.fromRgb(0.2, 0.2, 0.2),
                    active: Color.fromRgb(0.3, 0.3, 0.3),
                    focus: Color.fromRgb(0.4, 0.4, 0.4),
                    disabled: Color.fromRgb(0.5, 0.5, 0.5),
                }));
                const group = createForegroundSet(recipe as any, background);

                expect(group.name).to.equal("color-test.fg.a.on.test-fg.bg");
                expect(group.type).to.equal("color");
                expect(group.intendedFor).to.deep.equal([StyleProperty.foregroundFill]);
                expect(DesignTokenRegistry.Groups.get(group.name)).to.equal(group);
                states.forEach(s => expect(group[s].name).to.equal(`${group.name}.${s}`));
            });

            it("should evaluate the recipe against the background of each state", () => {
                const background = createBackground("color.test-fg2.bg");
                const references: Array<Paint | null | undefined> = [];
                const recipe = createTokenColorRecipe<any>(
                    "color-test.fg.b",
                    StyleProperty.foregroundFill,
                    (_resolve: any, params?: ColorRecipeParams) => {
                        references.push(params?.reference);
                        return {
                            rest: Color.fromRgb(0.1, 0.1, 0.1),
                            hover: Color.fromRgb(0.2, 0.2, 0.2),
                            active: Color.fromRgb(0.3, 0.3, 0.3),
                            focus: Color.fromRgb(0.4, 0.4, 0.4),
                            disabled: Color.fromRgb(0.5, 0.5, 0.5),
                        };
                    }
                );
                createForegroundSet(recipe as any, background);

                // Each state evaluates the recipe with that state's background.
                expect(references.map(r => r!.toString())).to.have.members([
                    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#808080",
                ]);
            });

            it("should use the foreground rest value for interactive states and disabled for disabled", () => {
                const background = createBackground("color.test-fg3.bg");
                const fg = {
                    rest: Color.fromRgb(0.1, 0.1, 0.1),
                    hover: Color.fromRgb(0.2, 0.2, 0.2),
                    active: Color.fromRgb(0.3, 0.3, 0.3),
                    focus: Color.fromRgb(0.4, 0.4, 0.4),
                    disabled: Color.fromRgb(0.5, 0.5, 0.5),
                };
                const recipe = createTokenColorRecipe<any>("color-test.fg.c", StyleProperty.foregroundFill, () => fg);
                const group = createForegroundSet(recipe as any, background);

                expect(group.rest.default).to.equal(fg.rest);
                expect(group.hover.default).to.equal(fg.rest);
                expect(group.active.default).to.equal(fg.rest);
                expect(group.focus.default).to.equal(fg.rest);
                expect(group.disabled.default).to.equal(fg.disabled);
            });
        });

        describe("createForegroundSetBySet", () => {
            it("should name the set from the foreground recipe and background group", () => {
                const background = createBackground("color.test-fgset.bg");
                const recipe = createTokenColorRecipeBySet<any>("color-test.fgset.a", StyleProperty.foregroundFill, (_r, set) => set);
                const group = createForegroundSetBySet(recipe as any, background);

                expect(group.name).to.equal("color-test.fgset.a.on.test-fgset.bg");
                expect(group.type).to.equal("color");
                expect(group.intendedFor).to.deep.equal([StyleProperty.foregroundFill]);
                expect(DesignTokenRegistry.Groups.get(group.name)).to.equal(group);
                states.forEach(s => expect(group[s].name).to.equal(`${group.name}.${s}`));
            });

            it("should evaluate the recipe with the whole background set", () => {
                const background = createBackground("color.test-fgset2.bg");
                let received: InteractivePaintSet | undefined;
                const recipe = createTokenColorRecipeBySet<any>("color-test.fgset.b", StyleProperty.foregroundFill, (_r, set) => {
                    received = set;
                    return {
                        rest: Color.fromRgb(0.1, 0.1, 0.1),
                        hover: Color.fromRgb(0.2, 0.2, 0.2),
                        active: Color.fromRgb(0.3, 0.3, 0.3),
                        focus: Color.fromRgb(0.4, 0.4, 0.4),
                        disabled: Color.fromRgb(0.5, 0.5, 0.5),
                    };
                });
                const group = createForegroundSetBySet(recipe as any, background);

                expect(received!.rest).to.equal(red);
                expect(received!.hover).to.equal(green);
                expect(received!.active).to.equal(blue);
                expect((group.rest.default as Color).toString()).to.equal("#1a1a1a");
                expect((group.hover.default as Color).toString()).to.equal("#333333");
                expect((group.active.default as Color).toString()).to.equal("#4d4d4d");
                expect((group.focus.default as Color).toString()).to.equal("#666666");
                expect((group.disabled.default as Color).toString()).to.equal("#808080");
            });
        });
    });
});
