/* eslint-disable max-len */
import { kebabCase } from "change-case";
import {
    Interactivity,
    InteractivityDefinition,
    SerializableAnatomy,
    SerializableStringCondition,
    SerializableStyleRule,
} from "@adaptive-web/adaptive-ui";
import { AdditionalDataKeys, type AppliedDesignTokens, type AppliedTreatments, type PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";

// What walking the nodes of a component collects.
type Collected = Pick<SerializableAnatomy, "parts" | "styleRules">;

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

function makeClassName(value: string) {
    return `.${kebabCase(value)}`;
}

function stringCondition(name: string, values: Array<string>): SerializableStringCondition {
    return Object.fromEntries(values.map(value => [value, makeClassName(name + " " + value)])); // Add space so that there is a kebab between name and value
}

function addPart(collected: Collected, name: string): void {
    collected.parts[name] = makeClassName(name);
}

/**
 * The anatomy of a component, from the data of its node and the nodes in it, as the Adaptive UI CLI reads it.
 *
 * @param node - A component set, a component, or an instance of one.
 * @returns The anatomy of the component.
 */
export function anatomyOf(node: PluginUINodeData): SerializableAnatomy {
    if (!node) {
        throw new Error("Parameter `node` must be provided");
    }
    if (!(node.type === "COMPONENT_SET" || node.type === "COMPONENT" || node.type === "INSTANCE")) {
        throw new Error("Parameter `node` must have `type` = 'COMPONENT_SET', 'COMPONENT', or 'INSTANCE'");
    }
    const componentName = node.additionalData[AdditionalDataKeys.codeGenName];
    if (!componentName) {
        throw new Error("Parameter `node` must provide `additionalData` value for `codeGenName`");
    }

    const conditions: SerializableAnatomy["conditions"] = {};
    let interactivity: InteractivityDefinition | undefined;
    const collected: Collected = { parts: {}, styleRules: [] };

    if (node.type === "COMPONENT_SET") {
        if (node.children.length === 1) {
            // Unlikely case
            walkNode(node.children[0], componentName, undefined, collected);
        } else {
            // Parse the component names into property and value sets
            const properties = new Map<string, Array<string>>();

            node.children.forEach((child) => {
                const propValues = child.name.split(",");
                propValues.forEach((propValue) => {
                    const [prop, value] = propValue.trim().split("=");
                    const values = properties.get(prop) || [];
                    if (values.indexOf(value) === -1) {
                        values.push(value);
                        properties.set(prop, values);
                    }
                });
            });

            // TODO look for other interactivity models
            if (properties.has("Disabled")) {
                interactivity = Interactivity.disabledClass;
            }

            // Convert properties into anatomy conditions
            // TODO: Validate known properties like "State" and "Disabled". Ignore for now.
            const stringConditions = new Map<string, Array<string>>();
            const booleanConditions: Array<string> = [];
            properties.forEach((values, property) => {
                if (property !== "State" && property !== "Disabled") {
                    if (values.length === 2 &&
                        values.filter((value) => value.toLowerCase() === "true" || value.toLowerCase() === "false").length === 2) {
                        // boolean property, add once
                        conditions[property] = makeClassName(property);
                        booleanConditions.push(property);
                    } else {
                        // string property, add all
                        conditions[property] = stringCondition(property, values);
                        stringConditions.set(property, values);
                    }
                }
            });

            // Handler for a single Component within a Set
            const nodeHandler = (name: string, property: string, value: string | boolean): void => {
                const found = node.children.find(node => node.name.toLowerCase() === name.toLowerCase());
                if (!found) {
                    console.warn(`Expected component ${name}, property ${property}, not found`);
                } else {
                    // console.log("Handling node", {nodeName: name, condition: [property, value]});
                    walkNode(found, componentName, { [property]: value }, collected);
                }
            };

            // The first child is the default (no conditions)
            const defaultName = node.children[0].name;

            // Process the component node for each condition
            // Note that the current model treats conditions as additive, so condition A and condition B will be
            // separate selectors which might both apply (in sequence)

            // Handle string conditions first so each value is accounted for and forms the base for further variants
            stringConditions.forEach((values, property) => {
                // The first value is in the defaultName:
                const replaceProperty = `${property}=${values[0]}`;
                values.forEach(value => {
                    const name = defaultName.replace(replaceProperty, `${property}=${value}`);
                    nodeHandler(name, property, value);
                });
            });

            // If there were no string conditions, process the first component as the default "baseline"
            if (stringConditions.size === 0) {
                walkNode(node.children[0], componentName, undefined, collected);
            }

            // Handle boolean condition "true" values
            booleanConditions.forEach(property => {
                // Assume false is the default condition, find the `true` component
                const name = defaultName.replace(`${property}=false`, `${property}=true`);
                nodeHandler(name, property, true);
            });
        }
    } else {
        walkNode(node, componentName, undefined, collected);
    }

    return {
        name: componentName,
        context: makeClassName(componentName),
        conditions,
        parts: collected.parts,
        interactivity,
        styleRules: collected.styleRules,
    };
}

function isContextNode(node: PluginUINodeData, componentName: string): boolean {
    // Remove non-ascii characters (we tried a convention of decorating template node names)
    const nodeName = node.name.replace(/[^\x20-\x7F]/g, "").trim();
    return node.type === "COMPONENT" || componentName.toLowerCase().indexOf(nodeName.toLowerCase()) !== -1;
}

function walkNode(node: PluginUINodeData, componentName: string, condition: Record<string, string | boolean> | undefined, collected: Collected): void {
    if (node.name.toLowerCase() === "focus indicator") {
        // Ignore for now
        return;
    }

    const isContext = isContextNode(node, componentName);

    if (node.type === "INSTANCE" && !(node.config.inline === true || isContext)) {
        // TODO: This is too simplified, but it addresses many nested component issues for now.
        return;
    }

    if (!node.name.endsWith(ignoreLayerName)) {
        // TODO, not only frames, but what?
        if (node.type === "FRAME" && !isContext) {
            addPart(collected, node.name);
        }

        const appliedTreatments: AppliedTreatments = [
            ...(node.refAppliedTreatments ?? []),
            ...node.appliedTreatments,
        ];

        const appliedDesignTokens: AppliedDesignTokens = {
            ...node.refAppliedDesignTokens,
            ...node.appliedDesignTokens,
        };
        const properties = Object.entries(appliedDesignTokens).map(([target, token]) => [target, token.tokenID]);

        if (appliedTreatments.length > 0 || properties.length > 0) {
            const styleRule: SerializableStyleRule = {
                contextCondition: condition,
                part: isContext ? undefined : node.name,
                treatments: appliedTreatments.length > 0 ? Array.from(new Set(appliedTreatments)) : undefined,
                properties: properties.length > 0 ? Object.fromEntries(properties) : undefined,
            };

            if (!isContext) {
                addPart(collected, node.name);
            }

            collected.styleRules.push(styleRule);
        }
    }

    if (node.type === "SLOT") {
        // We'll take treatments and properties from the slot node, but not the children.
        return;
    }

    node.children.forEach((child) => {
        walkNode(child, componentName, condition, collected);
    });
}
