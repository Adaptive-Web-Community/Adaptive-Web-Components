// What the HTML standard and browsers have and TypeScript's DOM types (5.9) don't yet. Remove each declaration when TypeScript has it.
// It is a module of global declarations only, which no exported type uses, so it isn't part of the published types.

declare global {
    /** The options of `showPopover()`: the element that shows the popover, which becomes its implicit anchor. */
    interface ShowPopoverOptions {
        source?: HTMLElement;
    }

    /** The options of `togglePopover()`. */
    interface TogglePopoverOptions extends ShowPopoverOptions {
        force?: boolean;
    }

    interface HTMLElement {
        showPopover(options?: ShowPopoverOptions): void;
        togglePopover(options?: boolean | TogglePopoverOptions): boolean;
    }

    /** The options of a `CommandEvent`. */
    interface CommandEventInit extends EventInit {
        command?: string;
        source?: Element | null;
    }

    /** The event that an invoker (`commandfor`) fires at its target. */
    interface CommandEvent extends Event {
        readonly command: string;
        readonly source: Element | null;
    }

    // eslint-disable-next-line no-var
    var CommandEvent: {
        prototype: CommandEvent;
        new (type: string, eventInitDict?: CommandEventInit): CommandEvent;
    };

    interface HTMLElementEventMap {
        command: CommandEvent;
    }
}

export {};
