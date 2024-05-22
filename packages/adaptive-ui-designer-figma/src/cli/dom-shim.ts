/**
 * FAST accesses DOM globals during evaluation, so they need
 * to exist to run the CLI
 */
class Document {
    createElement() {
      return new HTMLElement();
    }
    adoptedStylesheets = []
  }
  class HTMLElement {}
  class MutationObserver {}
  class Window {
    Document = Document;
    HTMLElement = HTMLElement;
    MutationObserver = MutationObserver;
    matchMedia = () => new this.MutationObserver;
    document: Document;
    constructor() {
        this.document = new Document;
    }
  }

export function installWindowOnGlobal() {
    if (globalThis.window === undefined) {
        const window = new Window;
        Object.assign(globalThis, window);
        globalThis.window = globalThis as any;
    }
}

installWindowOnGlobal();