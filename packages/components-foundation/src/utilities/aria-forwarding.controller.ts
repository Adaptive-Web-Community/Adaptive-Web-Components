// The ARIA attributes whose value is a list of ids, and the property of each that reflects the elements, which can reach out of a shadow root.
const elementLists = {
    "aria-controls": "ariaControlsElements",
    "aria-describedby": "ariaDescribedByElements",
    "aria-details": "ariaDetailsElements",
    "aria-errormessage": "ariaErrorMessageElements",
    "aria-flowto": "ariaFlowToElements",
    "aria-labelledby": "ariaLabelledByElements",
    "aria-owns": "ariaOwnsElements",
} as const;

function isElementList(name: string): name is keyof typeof elementLists {
    return name in elementLists;
}

/**
 * Forwards the ARIA attributes an author puts on a host element to the native element inside it that has the role, for a component that wraps
 * a native element (a link). An attribute whose value is ids (`aria-describedby`) is forwarded as the elements, which are found where the host
 * is, since ids don't reach into a shadow root.
 *
 * @remarks
 * The attributes aren't part of the component's contract, so the controller observes them itself, with a `MutationObserver`. An id whose
 * element is added after the attribute is set isn't found until the attribute changes again.
 *
 * @public
 */
export class AriaForwardingController {
    private observer: MutationObserver | null = null;

    constructor(private readonly host: Element) {}

    /**
     * Forwards the host's ARIA attributes to the target now, and as they change. For when the element is connected and has rendered.
     */
    public connect(target: Element): void {
        this.disconnect();

        for (const name of this.host.getAttributeNames()) {
            this.forward(name, target);
        }

        this.observer = new MutationObserver(records => {
            for (const record of records) {
                if (record.attributeName) {
                    this.forward(record.attributeName, target);
                }
            }
        });
        this.observer.observe(this.host, { attributes: true });
    }

    /**
     * Stops forwarding. For when the element is disconnected.
     */
    public disconnect(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    private forward(name: string, target: Element): void {
        if (!name.startsWith("aria-")) {
            return;
        }

        const value = this.host.getAttribute(name);

        if (isElementList(name)) {
            target[elementLists[name]] = value === null ? null : this.findElements(value);
        } else if (value === null) {
            target.removeAttribute(name);
        } else {
            target.setAttribute(name, value);
        }
    }

    private findElements(ids: string): Element[] {
        const root = this.host.getRootNode();
        if (!(root instanceof Document || root instanceof DocumentFragment)) {
            return [];
        }

        return ids
            .split(/\s+/)
            .filter(id => id !== "")
            .map(id => root.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);
    }
}
