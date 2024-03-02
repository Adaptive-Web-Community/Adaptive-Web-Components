import { getAllDeclarationsOfKind, getInheritanceTree } from "@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js";

export function fastElementPlugin() {
    return {
        name: "FAST-ELEMENT",
        packageLinkPhase({ customElementsManifest, context }) {
            // Handle classes with indirect HTMLElement ancestor
            // I think this is an edge case that's not accounted for in CES analyzer, either fixed with the
            // plugin linked near the bottom or with a PR to the analyzer.
            customElementsManifest?.modules?.forEach(_module => {
                _module?.declarations?.forEach(declaration => {
                    if (declaration?.kind === "class") {
                        if (declaration?.superclass?.name?.startsWith("FAST")) {
                            declaration.customElement = true;
                            // _module.path will be like "src/components/accordion/accordion.ts"
                            const baseName = _module.path.split("/")[2];
                            declaration.tagName = "adaptive-" + baseName;

                            // Hack: fast-foundation CEM doesn't include inherited attributes for form-controlled elements
                            // I will fi this there soon and then this can be removed.
                            const formAssociatedElements = ["FASTButton", "FASTCombobox", "FASTNumberField", "FASTPicker", "FASTSearch", "FASTSelect", "FASTSlider", "FASTTextArea", "FASTTextField"];
                            const isFormAssociated = formAssociatedElements.includes(declaration?.superclass?.name);
                            const checkableFormAssociatedElements = ["FASTCheckbox", "FASTRadio", "FASTSwitch"];
                            const isCheckableFormAssociated = checkableFormAssociatedElements.includes(declaration?.superclass?.name);
                            if (isFormAssociated || isCheckableFormAssociated) {
                                if (declaration.attributes === undefined) {
                                    declaration.attributes = [];
                                }

                                declaration.attributes.push({
                                    name: "name",
                                    type: {
                                        text: "string"
                                    },
                                    description: "The name of the element. This element's value will be surfaced during form submission under the provided name.",
                                    fieldName: "name",
                                    inheritedFrom: {
                                        name: declaration?.superclass?.name,
                                    }
                                });

                                declaration.attributes.push({
                                    name: "value",
                                    type: {
                                        text: "string"
                                    },
                                    description: "The initial value of the form. This value sets the `value` property only when the `value` property has not been explicitly set.",
                                    fieldName: "value",
                                    inheritedFrom: {
                                        name: declaration?.superclass?.name,
                                    }
                                });

                                declaration.attributes.push({
                                    name: "disabled",
                                    type: {
                                        text: "boolean"
                                    },
                                    description: "Sets the element's disabled state. A disabled element will not be included during form submission.",
                                    fieldName: "disabled",
                                    inheritedFrom: {
                                        name: declaration?.superclass?.name,
                                    }
                                });

                                declaration.attributes.push({
                                    name: "required",
                                    type: {
                                        text: "boolean"
                                    },
                                    description: "Require the field to be completed prior to form submission.",
                                    fieldName: "required",
                                    inheritedFrom: {
                                        name: declaration?.superclass?.name,
                                    }
                                });

                                if (isCheckableFormAssociated) {
                                    declaration.attributes.push({
                                        name: "checked",
                                        type: {
                                            text: "boolean"
                                        },
                                        description: "Provides the default checkedness of the input element.",
                                        fieldName: "checked",
                                        inheritedFrom: {
                                            name: declaration?.superclass?.name,
                                        }
                                    });
                                }
                            }
                            // End fast-foundation hack
                        }
                    }
                });
            });

            // TODO: Look to replace this with https://github.com/break-stuff/cem-tools/blob/main/packages/cem-inheritance/README.md
            // Handle slots and parts inheritance
            // Copied and modified from packages/analyzer/src/features/post-processing/apply-inheritance.js
            const allManifests = [customElementsManifest, ...(context.thirdPartyCEMs || [])];
            const classLikes = [];

            allManifests.forEach((manifest) => {
                const classes = getAllDeclarationsOfKind(manifest, "class");
                const mixins = getAllDeclarationsOfKind(manifest, "mixin");
                classLikes.push(...[...classes, ...mixins]);
            });

            classLikes.forEach((customElement) => {
                const inheritanceChain = getInheritanceTree(allManifests, customElement.name);

                inheritanceChain?.forEach(klass => {
                    // ignore the current class itself
                    if (klass?.name === customElement.name) {
                        return;
                    }

                    ["cssProperties", "cssParts", "slots"].forEach(type => {
                        klass?.[type]?.forEach(currItem => {
                            const newItem = { ...currItem };

                            /**
                              * If an attr or member is already present in the base class, but we encounter it here,
                              * it means that the base has overridden that method from the super class
                              * So we either add the data to the overridden method, or we add it to the array as a new item
                              */
                            const existing = customElement?.[type]?.find(item => newItem.name === item.name);

                            if (existing) {
                                customElement[type] = customElement?.[type]?.map(item => item.name === existing.name
                                    ? {
                                        ...newItem,
                                        ...existing,
                                        ...{
                                            ...(newItem.type ? { type: newItem.type } : {}),
                                            ...(newItem.privacy ? { privacy: newItem.privacy } : {})
                                        }
                                    }
                                    : item);
                            } else {
                                customElement[type] = [...(customElement[type] || []), newItem];
                            }
                        });
                    });
                });
            });
        }
    }
}

export function fast() {
    return void 0;
}
