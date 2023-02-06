import { elements, ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import {
    endSlotTemplate,
    FASTHorizontalScroll,
    StartEndOptions,
    startSlotTemplate,
    StaticallyComposableHTML,
    staticallyCompose,
    tagFor,
    TemplateElementDependency,
} from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { FlipperDefinition } from "../index.js";

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

export type HorizontalScrollOptions = StartEndOptions<FASTHorizontalScroll> & {
    nextFlipper?: StaticallyComposableHTML<FASTHorizontalScroll>;
    previousFlipper?: StaticallyComposableHTML<FASTHorizontalScroll>;
    flipper: TemplateElementDependency;
};

/**
 * Default Horizontal Scroll template, {@link @microsoft/fast-foundation#horizontalScrollTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTHorizontalScroll> =
    (ds: DesignSystem) => {
        const options: HorizontalScrollOptions = {
            flipper: FlipperDefinition(ds),
        };

        const flipperTag = html.partial(tagFor(options.flipper));
        return html<FASTHorizontalScroll>`
            <template @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}">
                ${startSlotTemplate(options)}
                <div class="scroll-area" part="scroll-area">
                    <div class="scroll-view" part="scroll-view" @scroll="${(x) => x.scrolled()}" ${ref("scrollContainer")}>
                        <div class="content" part="content" ${ref("content")}>
                            <slot
                                ${slotted({
                                    property: "scrollItems",
                                    filter: elements(),
                                })}
                            ></slot>
                        </div>
                    </div>
                    ${when((x) => x.view !== "mobile",
                        html<FASTHorizontalScroll>`
                            <div class="scroll scroll-previous" part="scroll-previous" ${ref("previousFlipperContainer")}>
                                <slot name="previous-flipper">
                                    ${staticallyCompose(
                                        options.previousFlipper ??
                                            html<FASTHorizontalScroll>`
                                                <${flipperTag}
                                                    part="previous-flipper"
                                                    @click="${(x) => x.scrollToPrevious()}"
                                                    direction="previous"
                                                    aria-hidden="${(x) => x.flippersHiddenFromAT}"
                                                ></${flipperTag}>
                                            `
                                    )}
                                </slot>
                            </div>
                            <div class="scroll scroll-next" part="scroll-next" ${ref("nextFlipperContainer")}>
                                <slot name="next-flipper">
                                    ${staticallyCompose(
                                        options.nextFlipper ??
                                            html<FASTHorizontalScroll>`
                                                <${flipperTag}
                                                    part="next-flipper"
                                                    @click="${(x) => x.scrollToNext()}"
                                                    aria-hidden="${(x) => x.flippersHiddenFromAT}"
                                                ></${flipperTag}>
                                            `
                                    )}
                                </slot>
                            </div>
                        `
                    )}
                </div>
                ${endSlotTemplate(options)}
            </template>
        `;
    };
