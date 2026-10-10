import chai from "chai";
import { AttributeConfiguration } from "@microsoft/fast-element";
import { applyMixins } from "./apply-mixins.js";

const { expect } = chai;

describe("applyMixins", () => {
    it("should copy methods from the base prototype", () => {
        class Base {
            greet() { return "hello"; }
        }
        class Derived {}

        applyMixins(Derived, Base);

        expect((new Derived() as any).greet()).to.equal("hello");
    });

    it("should copy getters and setters as accessors", () => {
        class Base {
            private _value = 1;
            get value() { return this._value; }
            set value(v: number) { this._value = v; }
        }
        class Derived {}

        applyMixins(Derived, Base);

        const descriptor = Object.getOwnPropertyDescriptor(Derived.prototype, "value")!;
        expect(descriptor.get).to.be.a("function");
        expect(descriptor.set).to.be.a("function");

        const instance = new Derived() as any;
        instance._value = 5;
        expect(instance.value).to.equal(5);
        instance.value = 7;
        expect(instance._value).to.equal(7);
    });

    it("should not copy the constructor", () => {
        class Base {
            constructor() { /* base */ }
        }
        class Derived {}

        applyMixins(Derived, Base);

        expect(Derived.prototype.constructor).to.equal(Derived);
    });

    it("should apply multiple bases in order, with later bases overriding earlier", () => {
        class A {
            name() { return "a"; }
            onlyA() { return "onlyA"; }
        }
        class B {
            name() { return "b"; }
            onlyB() { return "onlyB"; }
        }
        class Derived {}

        applyMixins(Derived, A, B);

        const instance = new Derived() as any;
        expect(instance.name()).to.equal("b");
        expect(instance.onlyA()).to.equal("onlyA");
        expect(instance.onlyB()).to.equal("onlyB");
    });

    it("should override a method defined on the derived prototype", () => {
        class Base {
            value() { return "base"; }
        }
        class Derived {
            value() { return "derived"; }
        }

        applyMixins(Derived, Base);

        expect((new Derived() as any).value()).to.equal("base");
    });

    it("should not copy inherited prototype members", () => {
        class Grandparent {
            inherited() { return "inherited"; }
        }
        class Base extends Grandparent {
            own() { return "own"; }
        }
        class Derived {}

        applyMixins(Derived, Base);

        expect((Derived.prototype as any).own).to.be.a("function");
        expect((Derived.prototype as any).inherited).to.be.undefined;
    });

    it("should not copy static members", () => {
        class Base {
            static create() { return new Base(); }
        }
        class Derived {}

        applyMixins(Derived, Base);

        expect((Derived as any).create).to.be.undefined;
    });

    it("should append base attribute configurations to the derived class", () => {
        class Base {}
        class Derived {}
        const baseAttribute = { property: "baseProp" } as any;
        AttributeConfiguration.locate(Base).push(baseAttribute);

        const derivedAttributes = AttributeConfiguration.locate(Derived);
        const existing = derivedAttributes.length;

        applyMixins(Derived, Base);

        expect(AttributeConfiguration.locate(Derived)).to.have.length(existing + 1);
        expect(AttributeConfiguration.locate(Derived)).to.include(baseAttribute);
    });

    it("should leave the base attribute configurations unchanged", () => {
        class Base {}
        class Derived {}
        const baseAttribute = { property: "baseProp" } as any;
        AttributeConfiguration.locate(Base).push(baseAttribute);

        applyMixins(Derived, Base);

        expect(AttributeConfiguration.locate(Base)).to.deep.equal([baseAttribute]);
    });
});
