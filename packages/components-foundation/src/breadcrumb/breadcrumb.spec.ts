import chai from "chai";
import { breadcrumbItemAria, type BreadcrumbItemElement } from "../breadcrumb-item/breadcrumb-item.js";
import { breadcrumbAria, setBreadcrumbItems } from "./breadcrumb.js";

const { expect } = chai;

class TestBreadcrumbItem extends HTMLElement implements BreadcrumbItemElement {
    public download: string | null = null;
    public href: string | null = null;
    public hreflang: string | null = null;
    public ping: string | null = null;
    public referrerPolicy: string | null = null;
    public rel: string | null = null;
    public target: string | null = null;
    public type: string | null = null;
    public current = false;
}
customElements.define("test-breadcrumb-item", TestBreadcrumbItem);

describe("setBreadcrumbItems", () => {
    it("should make the last item the current page", () => {
        const items = [new TestBreadcrumbItem(), new TestBreadcrumbItem(), new TestBreadcrumbItem()];

        setBreadcrumbItems(items);
        expect(items.map(item => item.current)).to.deep.equal([false, false, true]);

        setBreadcrumbItems(items.slice(0, 2));
        expect(items.map(item => item.current)).to.deep.equal([false, true, true]);
    });
});

describe("breadcrumbAria and breadcrumbItemAria", () => {
    it("should be a navigation landmark and list items", () => {
        expect(breadcrumbAria()).to.deep.equal({ role: "navigation" });
        expect(breadcrumbItemAria()).to.deep.equal({ role: "listitem" });
    });
});
