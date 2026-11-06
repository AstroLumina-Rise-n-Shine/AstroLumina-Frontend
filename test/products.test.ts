import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  productCatalog,
  getProduct,
  getAvailableProducts,
  getProductKeys,
} from "../src/data/products.js";

describe("productCatalog", () => {
  it("contains exactly 6 products", () => {
    assert.equal(Object.keys(productCatalog).length, 6);
  });

  it("has expected product keys", () => {
    const expected = [
      "soarele-stralucirea-ta",
      "ghid-saturn-in-berbec",
      "astrograma-natala-si-karmica",
      "astrograma-relationala",
      "astrograma-previzionala",
      "eveniment-constelatii",
    ];
    assert.deepEqual(Object.keys(productCatalog).sort(), expected.sort());
  });
});

describe("getProduct", () => {
  it("returns the free product config", () => {
    const product = getProduct("soarele-stralucirea-ta");
    assert.ok(product);
    if (product) {
      assert.equal(product.name, "Soarele Stralucirea Ta");
      assert.equal(product.amount, 0);
      assert.equal(product.currency, "EUR");
      assert.ok(product.description.length > 0);
    }
  });

  it("returns the paid Saturn guide config", () => {
    const product = getProduct("ghid-saturn-in-berbec");
    assert.ok(product);
    if (product) {
      assert.equal(product.name, "Ghidul lui Saturn în Berbec");
      assert.equal(product.amount, 1500);
      assert.equal(product.currency, "EUR");
      assert.ok(product.description.length > 0);
    }
  });

  it("returns astrology consultation products with amount 7500", () => {
    for (const key of [
      "astrograma-natala-si-karmica",
      "astrograma-relationala",
      "astrograma-previzionala",
    ]) {
      const product = getProduct(key);
      assert.ok(product, `missing product ${key}`);
      if (product) {
        assert.equal(product.amount, 7500);
        assert.equal(product.currency, "EUR");
        assert.ok(product.name.length > 0);
        assert.ok(product.description.length > 0);
      }
    }
  });

  it("returns the event product with amount 7000", () => {
    const product = getProduct("eveniment-constelatii");
    assert.ok(product);
    if (product) {
      assert.equal(product.name, "Eveniment Constelații");
      assert.equal(product.amount, 7000);
      assert.equal(product.currency, "EUR");
    }
  });

  it("returns undefined for an unknown product key", () => {
    assert.equal(getProduct("no-such-product"), undefined);
    assert.equal(getProduct(""), undefined);
    assert.equal(getProduct("123"), undefined);
  });
});

describe("getAvailableProducts and getProductKeys", () => {
  it("returns all product keys as an array", () => {
    const keys = getAvailableProducts();
    assert.ok(Array.isArray(keys));
    assert.equal(keys.length, 6);
    for (const key of keys) {
      assert.ok(getProduct(key), `key ${key} not resolvable`);
    }
  });

  it("getProductKeys matches getAvailableProducts", () => {
    assert.deepEqual(getProductKeys(), getAvailableProducts());
  });
});

describe("product invariants", () => {
  it("every product has a valid 3-letter uppercase currency", () => {
    for (const product of Object.values(productCatalog)) {
      assert.match(product.currency, /^[A-Z]{3}$/);
    }
  });

  it("every product uses EUR", () => {
    for (const product of Object.values(productCatalog)) {
      assert.equal(product.currency, "EUR");
    }
  });

  it("every product has amount >= 0", () => {
    for (const product of Object.values(productCatalog)) {
      assert.ok(Number.isInteger(product.amount));
      assert.ok(product.amount >= 0);
    }
  });

  it("only the free product has amount 0", () => {
    const free = getProduct("soarele-stralucirea-ta");
    assert.ok(free && free.amount === 0);
    for (const [key, product] of Object.entries(productCatalog)) {
      if (key === "soarele-stralucirea-ta") continue;
      assert.ok(product.amount > 0, `${key} should be paid`);
    }
  });

  it("every product has non-empty name and description", () => {
    for (const [key, product] of Object.entries(productCatalog)) {
      assert.ok(product.name.length > 0, `${key} missing name`);
      assert.ok(product.description.length > 0, `${key} missing description`);
    }
  });
});
