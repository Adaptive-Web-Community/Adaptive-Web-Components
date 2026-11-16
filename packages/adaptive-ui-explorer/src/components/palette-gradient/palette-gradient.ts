import { closestSwatchIndex, type Color, type Palette, swatchAt } from "@adaptive-web/adaptive-ui";
import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { paletteGradientStyles as styles } from "./palette-gradient.styles.js";
import { paletteGradientTemplate as template } from "./palette-gradient.template.js";

@customElement({
    name: "app-palette-gradient",
    template,
    styles,
})
export class PaletteGradient extends FASTElement {
    public closestSource?: Color;

    @observable
    public palette?: Palette;
    protected paletteChanged() {
        this.closestSource = this.palette ? swatchAt(this.palette, closestSwatchIndex(this.palette, this.palette.source)) : undefined;
    }
}
