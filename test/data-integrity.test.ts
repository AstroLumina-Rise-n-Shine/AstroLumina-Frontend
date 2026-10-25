import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Country } from "../src/utils/location-data.js";
import { CONSTELLATION_EVENTS } from "../src/data/events.js";
import { COUNTRY_CODES, COUNTRY_NAMES_RO } from "../src/data/international.js";

describe("frontend data integrity", () => {
  it("event list has unique ids", () => {
    const ids = CONSTELLATION_EVENTS.map((event) => event.id);
    assert.ok(ids.length > 0);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("every event has a positive price and valid date", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(event.price > 0);
      assert.ok(event.date instanceof Date);
      assert.ok(Number.isFinite(event.date.getTime()));
    }
  });

  it("country name map has entries with RO and EN country match", () => {
    assert.ok(Object.keys(COUNTRY_NAMES_RO).length >= 10);
    const keys = Object.keys(COUNTRY_NAMES_RO);
    assert.ok(keys.includes("RO"));
  });

  it("COUNTRY_CODES entries reference known country names", () => {
    assert.ok(Array.isArray(COUNTRY_CODES) && COUNTRY_CODES.length > 0);
    for (const country of COUNTRY_CODES) {
      assert.ok(COUNTRY_NAMES_RO[country.isoCode], country.isoCode);
    }
  });

  it("Romanian counties from location data are available (regression)", () => {
    assert.ok(Country.getCountryByCode("RO"));
  });
});
