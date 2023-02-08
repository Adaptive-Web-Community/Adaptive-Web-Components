import { FASTElement, ViewTemplate } from "@microsoft/fast-element";
import type {
    AnnotatedStoryFn,
    Args,
    ArgsStoryFn,
    ComponentAnnotations,
    StoryAnnotations,
    StoryContext,
    WebRenderer,
} from "@storybook/types";

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 *
 * @param template - The ViewTemplate to render
 * @returns - a function to bind a Storybook story
 */
export function renderComponent<TArgs = Args>(
    template: ViewTemplate
): (args: TArgs, context: StoryContext) => Element | DocumentFragment | null {
    return function (args, { updateArgs }) {
        const storyFragment = new DocumentFragment();
        template.render({ ...args, updateArgs }, storyFragment);
        if (storyFragment.childElementCount === 1) {
            return storyFragment.firstElementChild;
        }
        return storyFragment;
    };
}

/**
 * 
 */
export type StoryFnFASTReturnType = string | Node;

/**
 *
 */
export interface FASTRenderer extends WebRenderer {
    component: string | HTMLElement | ArgsStoryFn<FASTRenderer>;
    storyResult: StoryFnFASTReturnType;
}

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<FASTRenderer, Omit<TArgs, keyof FASTElement>>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export declare type StoryObj<TArgs = Args> = StoryAnnotations<FASTRenderer, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export declare type StoryFn<TArgs = Args> = AnnotatedStoryFn<FASTRenderer, TArgs>;

/**
 * @deprecated Use `StoryFn` instead.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export declare type Story<TArgs = Args> = StoryFn<StoryArgs<TArgs>>;

/**
 * Combined Storybook story args.
 */
export type StoryArgs<TArgs = Args> = Partial<Omit<TArgs, keyof FASTElement>> & Args;
