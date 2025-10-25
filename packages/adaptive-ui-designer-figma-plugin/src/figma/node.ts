import { type Color as CuloriColor, modeLrgb, type Rgb, useMode, wcagLuminance } from "culori/fn";
import { Color, Gradient, Shadow, StyleProperty } from "@adaptive-web/adaptive-ui";
import { AppliedStyleValues, Controller, focusIndicatorNodeName, PluginNode, State, StatesState, STYLE_REMOVE } from "@adaptive-web/adaptive-ui-designer-core";
import { canHaveChildren, canHaveIndividualStrokes, colorToRgb, colorToRgba, isContainerNode, isInstanceNode, isLineNode, isRectangleNode, isShapeNode, isTextNode, isVectorNode, SOLID_BLACK, SOLID_TRANSPARENT, variantBooleanHelper } from "./utility.js";
import { gradientToGradientPaint } from "./gradient.js";
import { PluginDataResolver } from "./plugin-data-resolver.js";

// For luminance
useMode(modeLrgb);

const stateVariant = "State";
const disabledVariant = "Disabled";

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    public name: string;
    public fillColor: CuloriColor | null = null;
    public states?: StatesState;
    private _node: BaseNode;
    private _refNode: FigmaPluginNode | null = null;
    private _state?: State;
    public supportsCodeGen: boolean = false;
    public codeGenName: string | undefined;

    private static NodeCache: Map<string, FigmaPluginNode> = new Map();

    static {
        PluginNode.pluginDataAccessor = new PluginDataResolver();
    }

    private constructor(node: BaseNode) {
        super();

        Controller.nodeCount++;

        this._node = node;
        this.id = node.id;
        this.type = node.type;
        this.name = node.name;

        // console.log("  new FigmaPluginNode", this.debugInfo, "node", node);
    }

    private async init() {
        // Find the reference node if this node is part of an instance or composition.
        let refNode: BaseNode | null = null;
        if (this.id.startsWith("I")) {
            // Check this first to handle nested components, we want the overrides on the reference instance before the main component.
            // Child nodes of an instance have an ID like `I##:##;##:##;##:##`
            // where each `##:##` points to the containing instance, and the last always points to the main node.
            const ids = this.id.split(";");
            // Updated to support more complex nested instances of instances
            while (ids.length >= 2 && !refNode) {
                ids.shift();
                // First look with the I
                const refId = "I" + ids.join(";");
                // console.log("    looking for ref (I)", refId);
                refNode = await figma.getNodeByIdAsync(refId);
                if (!refNode) {
                    // Then look without the I
                    const refId = ids.join(";");
                    // console.log("    looking for ref (no I)", refId);
                    refNode = await figma.getNodeByIdAsync(refId);
                }
            }
        } else if (isInstanceNode(this._node)) {
            // console.log("    getting main component");
            refNode = await this._node.getMainComponentAsync();
        }

        if (refNode) {
            // console.log("    getting refNode");
            this._refNode = await FigmaPluginNode.get(refNode, false);
            // console.log("      refNode for", this.debugInfo, " is ", this._refNode.debugInfo);

            this._componentDesignTokens = this._refNode.localDesignTokens;
            this._componentAppliedStyleModules = this._refNode.appliedStyleModules;
            this._componentAppliedDesignTokens = this._refNode.appliedDesignTokens;
        }

        this._localDesignTokens = await PluginNode.pluginDataAccessor.getLocalDesignTokens(this);
        this._appliedStyleModules = await PluginNode.pluginDataAccessor.getAppliedStyleModules(this);
        this._appliedDesignTokens = await PluginNode.pluginDataAccessor.getAppliedDesignTokens(this);

        // Check for and/or remove legacy FAST plugin data.
        // const fastKeys = this._node.getSharedPluginDataKeys("fast");
        // if (fastKeys.length > 0) {
        //     console.log("Found FAST keys", this.type, this._node.name, fastKeys);
        //     fastKeys.forEach((fastKey) => {
        //         // this._node.setSharedPluginData("fast", fastKey, "");
        //         console.log("  deleting data", fastKey);
        //         // console.log("  ", fastKey, this._node.getSharedPluginData("fast", fastKey));
        //     });
        // }

        this.fillColor = this.getFillColor();

        this.states = this._node.type === "COMPONENT_SET" ?
            this._node.componentPropertyDefinitions[stateVariant] === undefined ?
                StatesState.available :
                StatesState.configured :
            StatesState.notAvailable;

        this.supportsCodeGen = this._node.type === "COMPONENT_SET" ||
            this._node.type === "COMPONENT" ||
            this._node.type === "INSTANCE";

        if (this.supportsCodeGen) {
            switch (this._node.type) {
                case "INSTANCE":
                    this.codeGenName = this._refNode?.name;
                    break;
                case "COMPONENT": {
                    const parent = await this.getParent();
                    if (parent && parent.type === "COMPONENT_SET") {
                        this.codeGenName = parent.name;
                    } else {
                        this.codeGenName = this.name;
                    }
                    break;
                }
                case "COMPONENT_SET":
                    this.codeGenName = this.name;
                    break;
            }
        }

        if (this._node.type === "COMPONENT") {
            const disabled: string | null = this._node.variantProperties ? this._node.variantProperties[disabledVariant]?.toLowerCase() : null;
            const state: State | undefined = this._node.variantProperties ? this._node.variantProperties[stateVariant] as State : undefined;
            this._state = disabled === "true" ? "Disabled" : state;
        } else if (this._node.type === "INSTANCE") {
            const disabled: string | null = (this._node.componentProperties[disabledVariant]?.value as string)?.toLowerCase();
            const state: State = this._node.componentProperties[stateVariant]?.value as State;
            this._state = disabled === "true" ? "Disabled" : state;
        }
    }

    public static async get(node: BaseNode, deep: boolean): Promise<FigmaPluginNode> {
        if (FigmaPluginNode.NodeCache.has(node.id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return FigmaPluginNode.NodeCache.get(node.id)!;
        } else {
            const pluginNode = new FigmaPluginNode(node);
            await pluginNode.init();
            FigmaPluginNode.NodeCache.set(node.id, pluginNode);
            if (deep) {
                // Load the children for initial processing - added to support focusIndicator promotion
                await pluginNode.getChildren();
            }
            return pluginNode;
        }
    }

    public static clearCache(): void {
        FigmaPluginNode.NodeCache.clear();
    }

    /**
     * Gets the Figma node associated with this plugin node.
     * @returns The Figma node
     */
    public getFigmaNode(): BaseNode {
        return this._node;
    }

    /**
     * Gets the reference Node for this node, if it is part of an instance or composition.
     * @returns The reference Node
     */
    public getRefNode(): FigmaPluginNode | null {
        return this._refNode;
    }

    public async getState(): Promise<string | null> {
        if (this._state) {
            return this._state;
        }
        const parent = await this.getParent();
        if (parent) {
            return parent.getState();
        }
        return null;
    }

    /**
     * Special handling for focus indicator node, which logically belongs to its Figma parent's _parent_.
     */
    public focusIndicatorNode: FigmaPluginNode | null = null;

    public getCanHaveChildren(): Promise<boolean> {
        return Promise.resolve(canHaveChildren(this._node));
    }

    private _childrenLoaded: boolean = false;
    private _children: FigmaPluginNode[] = [];

    /**
     * Get all logical children of this node.
     */
    public async getChildren(): Promise<FigmaPluginNode[]> {
        if (canHaveChildren(this._node) && !this._childrenLoaded) {
            // console.log("    get children", this.debugInfo);
            for (const child of this._node.children) {
                const childNode = await FigmaPluginNode.get(child, true);
                // Promote the focus indicator node to the parent's parent (`this` is the parent here)
                if (childNode.name === focusIndicatorNodeName && childNode._node.type === "INSTANCE") {
                    // console.log("      Found focus indicator node", childNode.debugInfo);
                    const parent = await this.getParent();
                    if (parent) {
                        // console.log("        Promoting to parent", this.parent.debugInfo);
                        parent.focusIndicatorNode = childNode;
                        childNode.focusIndicatorParentNode = parent;
                        // Force load the children since this node is outside of the typical parent/children relationship
                        await childNode.getChildren();
                    }
                } else {
                    this._children.push(childNode);
                }
            }

            this._childrenLoaded = true;
        }

        // If this node has a promoted focus indicator, return that first followed by actual children
        if (this.focusIndicatorNode !== null) {
            // console.log("      Prepending focus indicator to children", this.debugInfo);
            return [this.focusIndicatorNode, ...this._children];
        } else {
            return this._children;
        }
    }

    public getSupports(): Promise<Array<StyleProperty>> {
        return Promise.resolve(Object.keys(StyleProperty).filter((key: string) => {
            switch (key) {
                case StyleProperty.backgroundFill:
                    return [
                        isContainerNode,
                        isShapeNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.borderFillTop:
                case StyleProperty.borderFillRight:
                case StyleProperty.borderFillBottom:
                case StyleProperty.borderFillLeft:
                case StyleProperty.borderStyleTop:
                case StyleProperty.borderStyleRight:
                case StyleProperty.borderStyleBottom:
                case StyleProperty.borderStyleLeft:
                case StyleProperty.borderThicknessTop:
                case StyleProperty.borderThicknessRight:
                case StyleProperty.borderThicknessBottom:
                case StyleProperty.borderThicknessLeft:
                    return [
                        isContainerNode,
                        isShapeNode,
                        isLineNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.paddingTop:
                case StyleProperty.paddingRight:
                case StyleProperty.paddingBottom:
                case StyleProperty.paddingLeft:
                case StyleProperty.gap:
                    return [
                        isContainerNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.cornerRadiusTopLeft:
                case StyleProperty.cornerRadiusTopRight:
                case StyleProperty.cornerRadiusBottomRight:
                case StyleProperty.cornerRadiusBottomLeft:
                    return [
                        isContainerNode,
                        isRectangleNode,
                        // isShapeNode, // Shapes support a single corner radius, other support individual.
                        // We're not really expecting star nodes here.
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.foregroundFill:
                    return [
                        isContainerNode, // Applies to children (for style module support)
                        isShapeNode,
                        isLineNode,
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.fontFamily:
                case StyleProperty.fontSize:
                case StyleProperty.fontStyle:
                case StyleProperty.fontWeight:
                case StyleProperty.lineHeight:
                    return [
                        isContainerNode, // Applies to children (for style module support)
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.shadow:
                    return [
                        isContainerNode,
                        isShapeNode,
                        isLineNode,
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                default:
                    return false;
            }
        }) as Array<StyleProperty>);
    }

    /**
     * Get the Figma style representation of the font weight.
     *
     * Style names with spaces may also match without the space or with hyphen instead.
     * See {@link expandStyles}.
     *
     * @param value - A font weight numeric value
     * @returns An array of potential font style names
     */
    private fontWeightToFigmaStyle(value: number) {
        switch (value) {
            case 100:
                return ["Thin", "Hairline"];
            case 200:
                return this.expandStyles(["Extra Light", "Ultra Light"]);
            case 300:
                return ["Light"];
            case 400:
                return ["Regular", "Normal", "Book"];
            case 500:
                return ["Medium"];
            case 600:
                return this.expandStyles(["Semi Bold", "Demi Bold"]);
            case 700:
                return ["Bold"];
            case 800:
                return this.expandStyles(["Extra Bold", "Ultra Bold"]);
            case 900:
                return ["Black", "Heavy"];
            case 950:
                return this.expandStyles(["Extra Black", "Ultra Black"]);
            default:
                return ["Regular"];
        }
    }

    /**
     * Expand the Figma style names into possible variations.
     * See {@link fontWeightToFigmaStyle}.
     *
     * @param styles - An array of font style names
     * @returns An expanded array of font style names
     */
    private expandStyles(styles: string[]): string[] {
        return styles.reduce<string[]>((prev: string[], cur: string) => {
            const curArray = [cur]; // "Ultra Light"
            if (cur.indexOf(" ") > -1) {
                curArray.push(cur.replace(/ /g, "-")); // "Ultra-Light"
                curArray.push(cur.charAt(0).toUpperCase() + cur.replace(/ /g, "").substring(1)); // "Ultralight"
            }
            return prev.concat(curArray);
        }, []);
    }

    /**
     * Find the correct font that loads in Figma from possible variations of style names.
     *
     * @param family - The font family name
     * @param styles - An array of font style possibilities
     * @param italic - Added to the style for italic
     * @param index - Index into the `styles` parameter
     * @returns A successful font name or undefined
     */
    private async tryFont(family: string, styles: string[], italic: boolean, index: number): Promise<FontName | undefined> {
        const style = (styles[index] === "Regular" && italic) ? "Italic" : styles[index] + (italic ? " Italic" : "");
        const fontName = { family, style };
        try {
            await figma.loadFontAsync(fontName);
            return fontName;
        } catch (e) {
            if (index < styles.length - 1) {
                return this.tryFont(family, styles, italic, index + 1);
            } else {
                return undefined;
            }
        }
    }

    protected async handleFontFamily(node: FigmaPluginNode, values: AppliedStyleValues, inherited: boolean) {
        const fontFamily = values.get(StyleProperty.fontFamily)?.value;
        // We'll only set the font if the family is provided.
        if (fontFamily) {
            if (isTextNode(node._node)) {
                const fontStyle = values?.get(StyleProperty.fontStyle)?.value; // For "italic"
                const fontWeight: number = this.safeNumber(values?.get(StyleProperty.fontWeight)?.value, 400);
                const families = fontFamily.split(",");
                let family = families[0].replace(/['"]/g, ""); // Fallback is intended for the browser, in Figma just do the first
                if (family === STYLE_REMOVE) {
                    family = "Inter";
                }
                const styles = this.fontWeightToFigmaStyle(fontWeight);
                // Append 'Regular' in case no other styles load
                if (!styles.includes("Regular")) {
                    styles.push("Regular");
                }
                const italic = fontStyle?.toLowerCase() === "italic";
                this.tryFont(family, styles, italic, 0).then((fontName) => {
                    if (fontName) {
                        (node._node as TextNode).fontName = fontName;
                    }
                });
            } else if (isContainerNode(node._node) && !inherited) {
                // Only support one layer of children for font family inheritance.
                // This may cause problems with the `Text` component, but it breaks other styles by setting too deeply.
                for (const child of await node.getChildren()) {
                    await this.handleFontFamily(child, values, true);
                }
            }
        }
    }

    /**
     * Cleans up stroke values based on what we're about to apply.
     * 
     * @remarks
     * Figma has a default invisible stroke width of `1`. If you add a stroke in the UI
     * it sets the weight to `1` and adds a default color.
     * If you change the weight, then remove the strokes (nothing visible) it maintains
     * the old stroke weight, but when you add again it resets to `1`.
     *
     * @param values - The entire list of values to be applied
     */
    private handleStroke(values: AppliedStyleValues) {
        const applyingFill = values.has(StyleProperty.borderFillTop)
            || values.has(StyleProperty.borderFillRight)
            || values.has(StyleProperty.borderFillBottom)
            || values.has(StyleProperty.borderFillLeft);
        const applyingThickness = values.has(StyleProperty.borderThicknessTop)
            || values.has(StyleProperty.borderThicknessRight)
            || values.has(StyleProperty.borderThicknessBottom)
            || values.has(StyleProperty.borderThicknessLeft);

        if (applyingFill && applyingThickness) {
            // We only need to reset "individual" strokes here since we'll set a common stroke later anyway.
            if (canHaveIndividualStrokes(this._node)) {
                (this._node as IndividualStrokesMixin).strokeTopWeight = 0;
                (this._node as IndividualStrokesMixin).strokeRightWeight = 0;
                (this._node as IndividualStrokesMixin).strokeBottomWeight = 0;
                (this._node as IndividualStrokesMixin).strokeLeftWeight = 0;
            }
        }
    }

    protected safeNumber(value: string, defaultValue: number = 0) {
        return value === STYLE_REMOVE ? defaultValue : Number.parseFloat(value);
    }

    public async paint(values: AppliedStyleValues): Promise<void> {
        // Fonts are complicated in Figma, so pull them out of the normal loop.
        this.handleFontFamily(this, values, false);

        this.handleStroke(values);

        // Paint all applied design tokens on the node
        for (const [target, styleValue] of values) {
            // console.log("applied design token eval", target, applied);
            await this.paintOne(target, styleValue.value, false);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async paintOne(target: StyleProperty, value: any, inherited: boolean): Promise<void> {
        if (isContainerNode(this._node) && (
            target === StyleProperty.foregroundFill ||
            target === StyleProperty.fontSize ||
            target === StyleProperty.lineHeight))
        {
            for (const child of await this.getChildren()) {
                await (child).paintOne(target, value, true);
            }
        } else {
            switch (target) {
                case StyleProperty.borderFillTop:
                case StyleProperty.borderFillRight:
                case StyleProperty.borderFillBottom:
                case StyleProperty.borderFillLeft:
                case StyleProperty.backgroundFill:
                case StyleProperty.foregroundFill:
                    // I'd like to describe this better, but for now don't pass `foregroundFill`
                    // to children other than text and vector nodes (for icon support)
                    if ((await this.getSupports()).includes(target) &&
                        (inherited ? isTextNode(this._node) || isVectorNode(this._node) : true)) {
                        this.paintColor(target, value);
                    }
                    break;
                case StyleProperty.borderStyleTop:
                case StyleProperty.borderStyleRight:
                case StyleProperty.borderStyleBottom:
                case StyleProperty.borderStyleLeft:
                    // Ignore for now, "solid" only
                    break;
                case StyleProperty.borderThicknessTop:
                case StyleProperty.borderThicknessRight:
                case StyleProperty.borderThicknessBottom:
                case StyleProperty.borderThicknessLeft:
                    this.setBoxSizing();
                    this.paintStrokeWidth(target, value);
                    break;
                case StyleProperty.cornerRadiusTopLeft:
                case StyleProperty.cornerRadiusTopRight:
                case StyleProperty.cornerRadiusBottomRight:
                case StyleProperty.cornerRadiusBottomLeft:
                    this.paintCornerRadius(target, value);
                    break;
                case StyleProperty.fontFamily:
                case StyleProperty.fontStyle:
                case StyleProperty.fontWeight:
                    // Ignore, handled in handleFontFamily.
                    break;
                case StyleProperty.fontVariationSettings:
                    // TODO
                    break;
                case StyleProperty.fontSize:
                    if (isTextNode(this._node)) {
                        const textNode = this._node as TextNode;
                        figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                            textNode.fontSize = this.safeNumber(value, 12);
                        });
                    }
                    break;
                case StyleProperty.lineHeight:
                    if (isTextNode(this._node)) {
                        const textNode = this._node as TextNode;
                        figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                            const numValue = this.safeNumber(value);
                            if (numValue > 0) {
                                textNode.lineHeight = {
                                    value: Number.parseFloat(value),
                                    unit: "PIXELS",
                                };
                            } else {
                                textNode.lineHeight = {
                                    unit: "AUTO",
                                };
                            }
                        });
                    }
                    break;
                case StyleProperty.paddingTop:
                    if (isContainerNode(this._node)) {
                        this.setBoxSizing();
                        (this._node as BaseFrameMixin).paddingTop = this.safeNumber(value); // Removes unit, so assumes px
                    }
                    break;
                case StyleProperty.paddingRight:
                    if (isContainerNode(this._node)) {
                        this.setBoxSizing();
                        (this._node as BaseFrameMixin).paddingRight = this.safeNumber(value); // Removes unit, so assumes px
                    }
                    break;
                case StyleProperty.paddingBottom:
                    if (isContainerNode(this._node)) {
                        this.setBoxSizing();
                        (this._node as BaseFrameMixin).paddingBottom = this.safeNumber(value); // Removes unit, so assumes px
                    }
                    break;
                case StyleProperty.paddingLeft:
                    if (isContainerNode(this._node)) {
                        this.setBoxSizing();
                        (this._node as BaseFrameMixin).paddingLeft = this.safeNumber(value); // Removes unit, so assumes px
                    }
                    break;
                case StyleProperty.gap:
                    if (isContainerNode(this._node)) {
                        (this._node as BaseFrameMixin).itemSpacing = this.safeNumber(value); // Removes unit, so assumes px
                    }
                    break;
                case StyleProperty.shadow:
                    {
                        const shadows: Shadow[] = Array.isArray(value) ? value : [value];
                        const figmaShadows = shadows.map(shadow => {
                            return {
                                type: 'DROP_SHADOW',
                                color: colorToRgba(shadow.color.color as Rgb),
                                offset: {
                                    x: shadow.xOffset,
                                    y: shadow.yOffset
                                },
                                radius: shadow.blurRadius,
                                spread: shadow.spread,
                                visible: true,
                                blendMode: "NORMAL",
                            } as DropShadowEffect
                        });
                        (this._node as BlendMixin).effects = figmaShadows;
                    }
                    break;
                default:
                    throw new Error(`Applied design token could not be painted for ${target}: ${JSON.stringify(value)}`);
            }
        }
    }

    /**
     * The logical parent for the focus indicator node when promoted.
     */
    public focusIndicatorParentNode: FigmaPluginNode | null = null;

    public async getParent(): Promise<FigmaPluginNode | null> {
        if (this.focusIndicatorParentNode !== null) {
            return this.focusIndicatorParentNode;
        }

        const parent = this._node.parent;

        if (parent === null) {
            return null;
        }

        // console.log("    get parent", this.debugInfo);
        return await FigmaPluginNode.get(parent, false);
    }

    private getFillColor(): CuloriColor | null {
        // console.log("FigmaPluginNode.getFillColor", this.debugInfo);
        if ((this._node as GeometryMixin).fills) {
            const fills = (this._node as GeometryMixin).fills;

            if (Array.isArray(fills)) {
                const paints: SolidPaint[] = fills.filter(
                    (fill: Paint) => fill.type === "SOLID" && fill.visible
                );

                // TODO: how do we process multiple paints?
                if (paints.length === 1) {
                    const rgb = paints[0].color;
                    const color: Rgb = { mode: "rgb", r: rgb.r, g: rgb.g, b: rgb.b, alpha: paints[0].opacity };
                    // console.log("FigmaPluginNode.getFillColor", this.debugInfo, formatHex8(color));
                    return color;
                }
            }
        }

        return null;
    }

    public async getEffectiveFillColor(): Promise<CuloriColor | null> {
        if (this.fillColor) {
            return this.fillColor;
        }
        const parent = await this.getParent();
        if (parent) {
            return parent.fillColor;
        }
        return null;
    }

    private darkTarget: number = (-0.1 + Math.sqrt(0.21)) / 2;

    public async handleManualDarkMode(): Promise<boolean> {
        if (isInstanceNode(this._node)) {
            if (this._node.variantProperties) {
                const currentDarkMode = this._node.variantProperties["Dark mode"];
                if (currentDarkMode) {
                    const parent = await this.getParent()
                    if (parent) {
                        const color = await parent.getEffectiveFillColor();
                        if (color) {
                            const containerIsDark = wcagLuminance(color) <= this.darkTarget;
                            // eslint-disable-next-line max-len
                            // console.log("handleManualDarkMode", this._node.variantProperties['Dark mode'], "color", color.toStringHexRGB(), "dark", containerIsDark);
                            const value = variantBooleanHelper(currentDarkMode, containerIsDark);
                            if (value) {
                                this._node.setProperties({
                                    "Dark mode": value,
                                });
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    private setBoxSizing() {
        if (isContainerNode(this._node) && this._node.layoutMode !== "NONE") {
            (this._node as BaseFrameMixin).strokesIncludedInLayout = true;
        }
    }

    private paintColor(target: StyleProperty, value: unknown): void {
        let paint: Paint | null = null;

        if (value !== STYLE_REMOVE) {
            if (value && typeof value === "object") {
                if (Object.keys(value).includes("color")) {
                    const color = value as Color;
                    const solidPaint: SolidPaint = {
                        type: "SOLID",
                        visible: true,
                        opacity: color.color.alpha,
                        blendMode: "NORMAL",
                        color: colorToRgb(color.color as Rgb),
                    };
                    paint = solidPaint;
                } else if (Object.keys(value).includes("stops")) {
                    const gradient = value as Gradient;
                    paint = gradientToGradientPaint(gradient);
                }
            } else if (value && typeof value === "string" && value === "transparent") {
                paint = SOLID_TRANSPARENT;
            } else {
                throw `unexpected value at paintColor: ${typeof value}, ${value}, ${target}`;
            }
        }

        const paintValue = paint ? [paint] : [];
        switch (target) {
            case StyleProperty.backgroundFill:
                (this._node as MinimalFillsMixin).fills = paintValue;
                break;
            case StyleProperty.foregroundFill:
                (this._node as MinimalFillsMixin).fills = paint ? [paint] : [SOLID_BLACK];
                break;
            case StyleProperty.borderFillTop:
            case StyleProperty.borderFillRight:
            case StyleProperty.borderFillBottom:
            case StyleProperty.borderFillLeft:
                // TODO: Figma only supports one border color, though it can be hacked using inner shadow.
                (this._node as MinimalStrokesMixin).strokes = paintValue;
                break;
        }
    }

    private paintStrokeWidth(target: StyleProperty, value: string): void {
        try {
            const numValue = this.safeNumber(value);
            if (canHaveIndividualStrokes(this._node)) {
                switch (target) {
                    case StyleProperty.borderThicknessTop:
                        (this._node as IndividualStrokesMixin).strokeTopWeight = numValue;
                        break;
                    case StyleProperty.borderThicknessRight:
                        (this._node as IndividualStrokesMixin).strokeRightWeight = numValue;
                        break;
                    case StyleProperty.borderThicknessBottom:
                        (this._node as IndividualStrokesMixin).strokeBottomWeight = numValue;
                        break;
                    case StyleProperty.borderThicknessLeft:
                        (this._node as IndividualStrokesMixin).strokeLeftWeight = numValue;
                        break;
                }
            } else {
                (this._node as MinimalStrokesMixin).strokeWeight = this.safeNumber(value);
            }

            if ((this._node as MinimalStrokesMixin).strokes.length === 0) {
                (this._node as MinimalStrokesMixin).strokes = [SOLID_TRANSPARENT];
            }
        } catch (error) {
            console.error("paintStrokeWidth", { target, value, error, ...this.debugInfo });
        }
    }

    private paintCornerRadius(target: StyleProperty, value: string): void {
        const numValue = this.safeNumber(value);
        if (isContainerNode(this._node) || isRectangleNode(this._node)) {
            switch (target) {
                case StyleProperty.cornerRadiusTopLeft:
                    (this._node as RectangleCornerMixin).topLeftRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusTopRight:
                    (this._node as RectangleCornerMixin).topRightRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusBottomRight:
                    (this._node as RectangleCornerMixin).bottomRightRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusBottomLeft:
                    (this._node as RectangleCornerMixin).bottomLeftRadius = numValue;
                    break;
            }
        } else {
            (this._node as CornerMixin).cornerRadius = numValue;
        }
    }

    public createStates() {
        if (this._node.type === "COMPONENT_SET" && this.states === StatesState.available) {
            this._node.addComponentProperty(stateVariant, "VARIANT", "Rest");
            this._node.addComponentProperty(disabledVariant, "VARIANT", "false");

            // Lots of numbers to track laying components out in a grid
            let paddingTop = 16;
            let paddingRight = 16;
            let paddingBottom = 16;
            let paddingLeft = 16;
            let spacing = 16;

            // Turn off auto layout
            if (this._node.layoutMode !== "NONE") {
                paddingTop = this._node.paddingTop;
                paddingRight = this._node.paddingRight;
                paddingBottom = this._node.paddingBottom;
                paddingLeft = this._node.paddingLeft;
                spacing = this._node.itemSpacing;
                this._node.layoutMode = "NONE";
            }

            let x = paddingLeft;
            let y = paddingTop;
            let maxWidth = 0;

            // Initial layout
            this._node.children.forEach((componentNode) => {
                componentNode.x = x;
                componentNode.y = y;
                maxWidth = Math.max(maxWidth, componentNode.width);
                y += componentNode.height + spacing;
            });

            y = paddingTop;

            // Create states
            let hoverComponent: ComponentNode;

            this._node.children.forEach(async (restComponent, setIndex, setChildren) => {
                x = paddingLeft + maxWidth + spacing;
                const states: State[] = ["Hover", "Active", "Focus", "Disabled"];
                states.forEach(async (state, stateIndex) => {
                    const stateComponent = restComponent.clone() as ComponentNode;

                    // Keep the layer order consistent with the layout
                    if (setIndex < setChildren.length - 1) {
                        (this._node as ComponentSetNode).insertChild((setIndex * (states.length + 1)) + stateIndex + 1, stateComponent);
                    } else {
                        (this._node as ComponentSetNode).appendChild(stateComponent);
                    }

                    // Confusing "API" from Figma here, just rename the layer to adjust variant values:
                    if (state === "Disabled") {
                        stateComponent.name = stateComponent.name.replace("Disabled=false", "Disabled=true");
                    } else {
                        stateComponent.name = stateComponent.name.replace("Rest", state);
                    }

                    stateComponent.x = x;
                    stateComponent.y = y;

                    if (state === "Hover") {
                        // Save it for later
                        hoverComponent = stateComponent;
                    } else if (state === "Active") {
                        await (hoverComponent as ComponentNode).setReactionsAsync([{
                            trigger: {
                                type: "ON_PRESS",
                            },
                            actions: [{
                                type: "NODE",
                                navigation: "CHANGE_TO",
                                destinationId: stateComponent.id,
                                transition: null,
                                preserveScrollPosition: true,
                            }]
                        }]);
                    }

                    x += maxWidth + spacing;
                });

                await (restComponent as ComponentNode).setReactionsAsync([{
                    trigger: {
                        type: "ON_HOVER",
                    },
                    actions: [{
                        type: "NODE",
                        navigation: "CHANGE_TO",
                        destinationId: hoverComponent.id,
                        transition: null,
                        preserveScrollPosition: true,
                    }]
                }]);

                y += restComponent.height + spacing;
            });

            this._node.resize(x - spacing + paddingRight, y - spacing + paddingBottom);
        }
    }
}
