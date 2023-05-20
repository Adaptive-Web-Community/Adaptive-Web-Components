import { FASTElement, html, ViewTemplate } from "@microsoft/fast-element";
import type { AnnotatedStoryFn, Args, ComponentAnnotations, StoryAnnotations, StoryContext } from "@storybook/csf";

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
export type FASTFramework = {
    component: typeof FASTElement;
    storyResult: FASTElement | Element | DocumentFragment;
};

/**
 * Metadata to configure the stories for a component.
 */
export type Meta<TArgs = Args> = ComponentAnnotations<FASTFramework, Omit<TArgs, keyof FASTElement>>;

/**
 * Story function that represents a CSFv3 component example.
 */
export declare type StoryObj<TArgs = Args> = StoryAnnotations<FASTFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 */
export declare type StoryFn<TArgs = Args> = AnnotatedStoryFn<FASTFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * NOTE that in Storybook 7.0, this type will be renamed to `StoryFn` and replaced by the current `StoryObj` type.
 */
export declare type Story<TArgs = Args> = StoryFn<StoryArgs<TArgs>>;

/**
 * Combined Storybook story args.
 */
export type StoryArgs<TArgs = Args> = Partial<Omit<TArgs, keyof FASTElement>> & Args;

export function maybeStartSlotIcon(args: StoryArgs) {
    return args.startSlotIcon ?
        html`
            <svg slot="start" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.26 4.6a5.21 5.21 0 0 1 9.03 5.22l-.2.34a.5.5 0 0 1-.67.19l-3.47-2-1.93 3.38c1.34.4 2.5 1.33 3.31 2.52h-.09c-.34 0-.66.11-.92.31A4.9 4.9 0 0 0 9.5 12.5a4.9 4.9 0 0 0-3.82 2.06 1.5 1.5 0 0 0-1.01-.3 5.94 5.94 0 0 1 5.31-2.74l2.1-3.68-3.83-2.2a.5.5 0 0 1-.18-.7l.2-.33Zm.92.42 1.7.98.02-.02a8.08 8.08 0 0 1 3.27-2.74 4.22 4.22 0 0 0-4.99 1.78ZM14 7.8c.47-.82.7-1.46.77-2.09a5.8 5.8 0 0 0-.06-1.62 6.96 6.96 0 0 0-2.95 2.41L14 7.8Zm.87.5 1.61.93a4.22 4.22 0 0 0-.74-5.02c.07.56.09 1.1.02 1.63-.1.79-.38 1.56-.89 2.46Zm-9.63 7.3a.5.5 0 0 0-.96.03c-.17.7-.5 1.08-.86 1.3-.38.23-.87.32-1.42.32a.5.5 0 0 0 0 1c.64 0 1.33-.1 1.94-.47.34-.2.64-.5.88-.87a2.96 2.96 0 0 0 4.68-.01 2.96 2.96 0 0 0 4.74-.06c.64.9 1.7 1.41 2.76 1.41a.5.5 0 1 0 0-1c-.98 0-1.96-.64-2.29-1.65a.5.5 0 0 0-.95 0 1.98 1.98 0 0 1-3.79.07.5.5 0 0 0-.94 0 1.98 1.98 0 0 1-3.8-.08Z"/>
            </svg>
        ` :
        null;
}

export function maybeEndSlotIcon(args: StoryArgs) {
    return args.endSlotIcon ?
        html`
            <svg slot="end" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.74 4.6a5.22 5.22 0 1 0-9.03 5.22l.2.34a.5.5 0 0 0 .67.19l3.47-2 1.93 3.38a6.25 6.25 0 0 0-3.31 2.52h.09c.34 0 .66.11.92.31a4.9 4.9 0 0 1 3.82-2.06 4.9 4.9 0 0 1 3.82 2.06 1.5 1.5 0 0 1 1.01-.3 5.94 5.94 0 0 0-5.31-2.74l-2.1-3.68 3.83-2.2a.5.5 0 0 0 .18-.7l-.2-.33.01-.01Zm-.92.42L9.12 6l-.02-.02a8.08 8.08 0 0 0-3.27-2.74 4.22 4.22 0 0 1 4.99 1.78ZM6 7.8a5.34 5.34 0 0 1-.77-2.09 5.8 5.8 0 0 1 .06-1.62A6.96 6.96 0 0 1 8.24 6.5L6 7.8Zm-.87.5-1.61.93a4.22 4.22 0 0 1 .74-5.02c-.07.56-.09 1.1-.02 1.63.1.79.38 1.56.89 2.46Zm9.63 7.3a.5.5 0 0 1 .96.03c.17.7.5 1.08.86 1.3.38.23.87.32 1.42.32a.5.5 0 0 1 0 1c-.64 0-1.33-.1-1.94-.47a2.7 2.7 0 0 1-.88-.87 2.96 2.96 0 0 1-4.68-.01 2.96 2.96 0 0 1-4.74-.06c-.64.9-1.7 1.41-2.76 1.41a.5.5 0 0 1 0-1c.98 0 1.96-.64 2.29-1.65a.5.5 0 0 1 .95 0 1.98 1.98 0 0 0 3.79.07.5.5 0 0 1 .94 0 1.98 1.98 0 0 0 3.8-.08l-.01.01Z"/>
            </svg>
        ` :
        null;
}
