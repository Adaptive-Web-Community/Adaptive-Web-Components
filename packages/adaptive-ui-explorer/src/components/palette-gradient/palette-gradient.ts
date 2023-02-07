import { Palette, Swatch } from "@adaptive-web/adaptive-ui";
import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { paletteGradientStyles as styles } from "./palette-gradient.styles.js";
import { paletteGradientTemplate as template } from "./palette-gradient.template.js";

@customElement({
    name: "app-palette-gradient",
    template,
    styles,
})
export class PaletteGradient extends FASTElement {
    public closestSource?: Swatch;

    @observable
    public palette?: Palette;
    protected paletteChanged() {
        this.closestSource = this.palette?.get(this.palette?.closestIndexOf(this.palette?.source));
    }
}
