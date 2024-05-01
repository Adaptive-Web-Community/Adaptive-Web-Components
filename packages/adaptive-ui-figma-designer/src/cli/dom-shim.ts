/**
 * One of AUI's dependencies access DOM globals,
 * this ensures those globals are available prior to
 * importing from AUI.
 */
class Document {
    createElement() {
      return new HTMLElement();
    }
  }
  class HTMLElement {}
  class Window {
    matchMedia() {}
  }
  class MutationObserver {}
  Reflect.set(global, "document", new Document());
  Reflect.set(global, "HTMLElement", HTMLElement);
  Reflect.set(global, "window", new Window());
  Reflect.set(global, "MutationObserver", MutationObserver);