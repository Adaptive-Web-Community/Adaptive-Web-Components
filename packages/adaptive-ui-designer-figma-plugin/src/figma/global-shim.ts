export const globalThis = {
    figma,
};

export class URL {}

// What the token library uses and the sandbox of the plugin may not have. A callback after the current one is a promise that resolves.
// A reference that is held isn't collected and a registry that doesn't call back doesn't release what it watches, which a sandbox
// that lasts as long as the plugin is open doesn't need, and it doesn't extend the libraries it makes.
export const queueMicrotask = (callback: () => void): void => {
    Promise.resolve().then(callback);
};

export class WeakRef<T extends object> {
    constructor(private readonly target: T) {}

    public deref(): T | undefined {
        return this.target;
    }
}

export class FinalizationRegistry {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_cleanup: (held: unknown) => void) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public register(_target: object, _held: unknown, _token?: object): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public unregister(_token: object): boolean {
        return false;
    }
}
