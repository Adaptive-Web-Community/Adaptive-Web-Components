import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { type Color, modeRgb, parse, type Rgb, useMode, wcagLuminance } from "culori/fn";
import { Controller, STYLE_REMOVE } from "../core/controller.js";
import { AppliedDesignTokens, AppliedStyleModules, AppliedStyleValues, DesignTokenValues, PluginNodeData } from "../core/model.js";
import { PluginNode, State, StatesState } from "../core/node.js";
import { variantBooleanHelper } from "./utility.js";

const rgb = useMode(modeRgb);

const stateVariant = "State";
const disabledVariant = "Disabled";

const SOLID_BLACK: SolidPaint = {
    type: "SOLID",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    color: {
        r: 0,
        g: 0,
        b: 0,
    },
};

function isNodeType<T extends BaseNode>(type: NodeType): (node: BaseNode) => node is T {
    return (node: BaseNode): node is T => node.type === type;
}

const isDocumentNode = isNodeType<DocumentNode>("DOCUMENT");
const isPageNode = isNodeType<PageNode>("PAGE");
const isFrameNode = isNodeType<FrameNode>("FRAME");
const isGroupNode = isNodeType<GroupNode>("GROUP");
const isComponentNode = isNodeType<ComponentNode>("COMPONENT");
const isComponentSetNode = isNodeType<ComponentNode>("COMPONENT_SET");
const isInstanceNode = isNodeType<InstanceNode>("INSTANCE");
const isBooleanOperationNode = isNodeType<BooleanOperationNode>("BOOLEAN_OPERATION");
const isVectorNode = isNodeType<VectorNode>("VECTOR");
const isStarNode = isNodeType<StarNode>("STAR");
const isLineNode = isNodeType<LineNode>("LINE");
const isEllipseNode = isNodeType<EllipseNode>("ELLIPSE");
const isPolygonNode = isNodeType<PolygonNode>("POLYGON");
const isRectangleNode = isNodeType<RectangleNode>("RECTANGLE");
const isTextNode = isNodeType<TextNode>("TEXT");

function isContainerNode(node: BaseNode): node is
    FrameNode |
    ComponentNode |
    InstanceNode {
    return [
        isFrameNode,
        isComponentNode,
        isInstanceNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

function isShapeNode(node: BaseNode): node is
    RectangleNode |
    EllipseNode |
    PolygonNode |
    StarNode |
    BooleanOperationNode |
    VectorNode {
    return [
        isRectangleNode,
        isEllipseNode,
        isPolygonNode,
        isStarNode,
        isBooleanOperationNode,
        isVectorNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

function canHaveChildren(node: BaseNode): node is
    | DocumentNode
    | PageNode
    | FrameNode
    | GroupNode
    | BooleanOperationNode
    | InstanceNode
    | ComponentNode
    | ComponentSetNode {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
        isInstanceNode,
        isComponentNode,
        isComponentSetNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

const FIGMA_SHARED_DATA_NAMESPACE: string = "adaptive_ui";

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    public name: string;
    public fillColor: Color | null;
    public states: StatesState;
    private _node: BaseNode;
    private _state: State | null = null;

    private static NodeCache: Map<string, FigmaPluginNode> = new Map();

    private constructor(node: BaseNode) {
        super();

        Controller.nodeCount++;

        this._node = node;
        this.id = node.id;
        this.type = node.type;
        this.name = node.name;

        // console.log("  new FigmaPluginNode", this.debugInfo, "node", node);

        /*
        This data model and token processing is to handle an unfortunate consequence of the Figma component model.

        An instance component will inherit plugin data from the main component by default. For instance:

        Main component (set plugin data "A=1") --> Instance (get plugin data "A=1")

        This is mostly beneficial as when it comes to applying design tokens, we want to apply whatever was defined on main.

        However, once you override the value at an instance level, you no longer directly get the value from main:

        Instance (set plugin data "A=2") --> Instance (set plugin data "A=2")

        In our normal workflow we're reevaluating the applied tokens, so the instance may have the same overall structure
        but with different values. This would also normally be fine as we're going to evaluate for current values anyway.

        The problem is that once we've updated the values on the instance don't directly get any _changes_ made on the main.

        Main component (set plugin data "A=1, B=2") --> Instance (get plugin data "A=2")

        Notice we don't have the addition of "B=2".

        The solution is to *store* the fully evaluated tokens on the instance node, but to *read* back both the main and instance
        values, and to deduplicate them.

        In the example above, we'd read "A=2" from the instance, "A=1, B=2" from the main, then assemble the full list, keeping
        any overrides from the instance: "A=2, B=2".

        In the case of the "design tokens" the key will be the name of the token, like "corner-radius".
        In the case of the "applied design tokens" the key will be the style target, like "backgroundFill".
        */

        // Find the "main" reference node if this node is part of an instance.
        let mainComponentNode: BaseNode | null = null;
        if (isInstanceNode(this._node)) {
            mainComponentNode = (this._node as InstanceNode).mainComponent;
        } else if (this.id.startsWith("I")) {
            // Child nodes of an instance have an ID like `I##:##;##:##;##:##`
            // where each `##:##` points to the containing instance, and the last always points to the main node.
            const ids = this.id.split(";");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mainComponentNode = figma.getNodeById(ids.pop()!);
        }

        const deserializedDesignTokens = this.deserializeLocalDesignTokens();
        const parsedAppliedStyleModules = this.deserializeAppliedStyleModules();
        let filteredAppliedStyleModules = parsedAppliedStyleModules;
        const deserializedAppliedDesignTokens = this.deserializeAppliedDesignTokens();

        // Reconcile plugin data with the main component.
        if (mainComponentNode) {
            // console.log("    get main");
            const mainFigmaNode = FigmaPluginNode.get(mainComponentNode);
            // console.log("      is instance node", this.debugInfo, mainFigmaNode);

            this._componentDesignTokens = mainFigmaNode.localDesignTokens;
            this._componentAppliedStyleModules = mainFigmaNode.appliedStyleModules;
            this._componentAppliedDesignTokens = mainFigmaNode.appliedDesignTokens;

            mainFigmaNode.localDesignTokens.forEach((value, tokenId) => {
                // If the token values are the same between the nodes, remove it from the local.
                if (deserializedDesignTokens.get(tokenId)?.value === value.value) {
                    // console.log("    removing design token", this.debugInfo, tokenId);
                    deserializedDesignTokens.delete(tokenId);
                }
            });

            filteredAppliedStyleModules = parsedAppliedStyleModules
                .filter((parsedName) => mainFigmaNode.appliedStyleModules.indexOf(parsedName) === -1) as AppliedStyleModules;

            mainFigmaNode.appliedDesignTokens.forEach((applied, target) => {
                // If the target and token are the same between the nodes, remove it from the local.
                if (deserializedAppliedDesignTokens.get(target)?.tokenID === applied.tokenID) {
                    // console.log("    removing applied design token", this.debugInfo, target, applied.tokenID);
                    deserializedAppliedDesignTokens.delete(target);
                }
            });

            if (deserializedDesignTokens.size) {
                // console.log("    reconciled design tokens", this.debugInfo, deserializedDesignTokens.serialize());
            }

            if (deserializedAppliedDesignTokens.size) {
                // console.log("    reconciled applied design tokens", this.debugInfo, deserializedAppliedDesignTokens.serialize());
            }
        }

        this._localDesignTokens = deserializedDesignTokens;
        this._appliedStyleModules = filteredAppliedStyleModules;
        this._appliedDesignTokens = deserializedAppliedDesignTokens;

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

        // if (this._appliedDesignTokens.size) {
        //     console.log("    final applied design tokens", this._appliedDesignTokens.serialize());
        // }

        this.fillColor = this.getFillColor();

        this.states = this._node.type === "COMPONENT_SET" ?
            this._node.componentPropertyDefinitions[stateVariant] === undefined ?
                StatesState.available :
                StatesState.configured :
            StatesState.notAvailable;

        if (this._node.type === "COMPONENT") {
            const disabled: string | null = this._node.variantProperties ? this._node.variantProperties[disabledVariant] : null;
            const state: State | null = this._node.variantProperties ? this._node.variantProperties[stateVariant] as State : null;
            this._state = disabled === "true" ? "Disabled" : state;
        } else if (this._node.type === "INSTANCE") {
            const disabled: string | null = this._node.componentProperties[disabledVariant]?.value as string;
            const state: State = this._node.componentProperties[stateVariant]?.value as State;
            this._state = disabled === "true" ? "Disabled" : state;
        }
    }

    public static get(node: BaseNode): FigmaPluginNode {
        if (FigmaPluginNode.NodeCache.has(node.id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return FigmaPluginNode.NodeCache.get(node.id)!;
        } else {
            const pluginNode = new FigmaPluginNode(node);
            FigmaPluginNode.NodeCache.set(node.id, pluginNode);
            return pluginNode;
        }
    }

    public static clearCache(): void {
        FigmaPluginNode.NodeCache.clear();
    }

    private deserializeLocalDesignTokens(): DesignTokenValues {
        const json = this.getPluginData("designTokens");
        const value = new DesignTokenValues();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeLocalDesignTokens", this.debugInfo, value);
        }
        return value;
    }

    private deserializeAppliedStyleModules(): AppliedStyleModules {
        const json = this.getPluginData("appliedStyleModules");
        const value = new AppliedStyleModules();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeAppliedStyleModules", this.debugInfo, value);
        }
        return value;
    }

    private deserializeAppliedDesignTokens(): AppliedDesignTokens {
        const json = this.getPluginData("appliedDesignTokens");
        const value = new AppliedDesignTokens();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeAppliedDesignTokens", this.debugInfo, value);
        }
        return value;
    }

    public get state(): string | null {
        if (this._state) {
            return this._state;
        }
        if (this.parent) {
            return this.parent.state;
        }
        return null;
    }

    public get canHaveChildren(): boolean {
        return canHaveChildren(this._node);
    }

    public get children(): PluginNode[] {
        if (canHaveChildren(this._node)) {
            const children: FigmaPluginNode[] = [];

            // console.log("    get children");
            for (const child of this._node.children) {
                children.push(FigmaPluginNode.get(child));
            }

            return children;
        } else {
            return [];
        }
    }

    public get supports(): Array<StyleProperty> {
        return Object.keys(StyleProperty).filter((key: string) => {
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
                default:
                    return false;
            }
        }) as Array<StyleProperty>;
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
            const curArray = [cur]; // "Extra Light"
            if (cur.indexOf(" ") > -1) {
                curArray.push(cur.replace(/ /g, "-")); // "Extra-Light"
                curArray.push(cur.charAt(0).toUpperCase() + cur.replace(/ /g, "").substring(1)); // "Extralight"
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

    protected handleFontFamily(node: FigmaPluginNode, values: AppliedStyleValues) {
        const fontFamily = values?.get(StyleProperty.fontFamily)?.value;
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
            } else if (isContainerNode(node._node)) {
                node.children.forEach((child) => {
                    const figmaNode = (child as FigmaPluginNode);
                    this.handleFontFamily(figmaNode, values);
                });
            }
        }
    }

    protected safeNumber(value: string, defaultValue: number = 0) {
        return value === STYLE_REMOVE ? defaultValue : Number.parseFloat(value);
    }

    public paint(values: AppliedStyleValues): void {
        // Fonts are complicated in Figma, so pull them out of the normal loop.
        this.handleFontFamily(this, values);

        // Paint all applied design tokens on the node
        values?.forEach((styleValue, target) => {
            // console.log("applied design token eval", target, applied);
            this.paintOne(target, styleValue.value);
        });
    }

    public paintOne(target: StyleProperty, value: string): void {
        if (isContainerNode(this._node) && (
            target === StyleProperty.foregroundFill ||
            target === StyleProperty.fontSize ||
            target === StyleProperty.lineHeight))
        {
            this.children.forEach((child) => {
                (child as FigmaPluginNode).paintOne(target, value);
            });
        } else {
            switch (target) {
                case StyleProperty.borderFillTop:
                case StyleProperty.borderFillRight:
                case StyleProperty.borderFillBottom:
                case StyleProperty.borderFillLeft:
                case StyleProperty.backgroundFill:
                case StyleProperty.foregroundFill:
                    this.paintColor(target, value);
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
                    this.paintStrokeWidth(value);
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
                default:
                    throw new Error(`Applied design token could not be painted for ${target}: ${JSON.stringify(value)}`);
            }
        }
    }

    public get parent(): FigmaPluginNode | null {
        const parent = this._node.parent;

        if (parent === null) {
            return null;
        }

        // console.log("    get parent");
        return FigmaPluginNode.get(parent);
    }

    private getFillColor(): Color | null {
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

    private darkTarget: number = (-0.1 + Math.sqrt(0.21)) / 2;

    public handleManualDarkMode(): boolean {
        if (isInstanceNode(this._node)) {
            if (this._node.variantProperties) {
                const currentDarkMode = this._node.variantProperties["Dark mode"];
                if (currentDarkMode) {
                    const color = this.parent?.fillColor;
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

        return false;
    }

    protected getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined {
        let value: string | undefined = this._node.getSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key as string);
        if (value === "") {
            value = undefined;
        }
        // console.log("    getPluginData", this.debugInfo, key, value);
        return value;
    }

    protected setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void {
        // console.log("    setPluginData", this.debugInfo, key, value);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, value);
    }

    protected deletePluginData<K extends keyof PluginNodeData>(key: K): void {
        // console.log("    deletePluginData", this.debugInfo, key);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, "");
    }

    private setBoxSizing() {
        if (isContainerNode(this._node) && this._node.layoutMode !== "NONE") {
            (this._node as BaseFrameMixin).strokesIncludedInLayout = true;
        }
    }

    private paintColor(target: StyleProperty, value: string): void {
        let paint: Paint | null = null;

        if (value !== STYLE_REMOVE) {
            if (value.startsWith("linear-gradient")) {
                const linearMatch = /linear-gradient\((?<params>.+)\)/;
                const matches = value.match(linearMatch);
                if (matches && matches.groups) {
                    const array = matches.groups.params.split(",").map(p => p.trim());

                    let degrees: number = 90;
                    if (array[0].endsWith("deg")) {
                        const angle = array.shift()?.replace("deg", "") || "90";
                        degrees = Number.parseFloat(angle);
                    }
                    const radians: number = degrees * (Math.PI / 180);

                    const paramMatch = /(?<color>#[\w\d]+)( (?<pos>.+))?/;
                    const stops = array.map((p, index, array) => {
                        const paramMatches = p.match(paramMatch);
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const color = rgb(parse(paramMatches?.groups?.color || "FF00FF")!);
                        let position: number = 0;
                        if (paramMatches?.groups && paramMatches?.groups?.pos) {
                            if (paramMatches.groups.pos.endsWith("%")) {
                                position = Number.parseFloat(paramMatches.groups.pos) / 100;
                            } else if (paramMatches.groups.pos.startsWith("calc(100% - ")) {
                                const px = Number.parseFloat(
                                    paramMatches.groups.pos
                                        .replace("calc(100% - ", "")
                                        .replace("px)", "")
                                );
                                const size = degrees === 90 || degrees === 270
                                    ? (this._node as LayoutMixin).height
                                    : (this._node as LayoutMixin).width;
                                position = (size - px) / size;
                            }
                        } else if (index === array.length - 1) {
                            position = 1;
                        }
                        const stop: ColorStop = {
                            position,
                            color: {
                                r: color.r,
                                g: color.g,
                                b: color.b,
                                a: color.alpha || 1,
                            },
                        };
                        return stop;
                    });

                    const gradientPaint: GradientPaint = {
                        type: "GRADIENT_LINEAR",
                        gradientStops: stops,
                        gradientTransform: [
                            [Math.cos(radians), Math.sin(radians), 0],
                            [Math.sin(radians) * -1, Math.cos(radians), 1],
                        ],
                    };
                    paint = gradientPaint;
                }
            } else {
                // Assume it's solid
                const color = parse(value);
                if (!color) {
                    throw new Error(
                        `The value "${value}" could not be parsed`
                    );
                }

                const rgbColor = rgb(color);
                const solidPaint: SolidPaint = {
                    type: "SOLID",
                    visible: true,
                    opacity: rgbColor.alpha,
                    blendMode: "NORMAL",
                    color: {
                        r: rgbColor.r,
                        g: rgbColor.g,
                        b: rgbColor.b,
                    },
                };
                paint = solidPaint;
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
                // TODO: Figma only supports one border color, though it can be hacked using inner shadow.
                (this._node as MinimalStrokesMixin).strokes = paintValue;
                break;
        }
    }

    private paintStrokeWidth(value: string): void {
        (this._node as MinimalStrokesMixin).strokeWeight = this.safeNumber(value);
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

            this._node.children.forEach((restComponent, setIndex, setChildren) => {
                x = paddingLeft + maxWidth + spacing;
                const states: State[] = ["Hover", "Active", "Focus", "Disabled"];
                states.forEach((state, stateIndex) => {
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
                        (hoverComponent as ComponentNode).reactions = [{
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
                        }];
                    }

                    x += maxWidth + spacing;
                });

                (restComponent as ComponentNode).reactions = [{
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
                }];

                y += restComponent.height + spacing;    
            });

            this._node.resize(x - spacing + paddingRight, y - spacing + paddingBottom);
        }
    }
}
