// Test setup - configure window.ENV before other imports
import "./setup-env.js";

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadCities, loadStates } from "@/utils/location-data.js";
import { Country } from "@/utils/location-data.js";

describe("Country helpers", () => {
  it("returns undefined for an unknown code", () => {
    assert.equal(Country.getCountryByCode("ZZ"), undefined);
  });

  it("lists a stable number of countries", () => {
    assert.ok(Country.getAllCountries().length >= 190);
  });
});

describe("loadStates resilience", () => {
  it("returns a usable object for an unknown country code", async () => {
    const states = await loadStates();
    const list = states.getStatesOfCountry("ZZ");
    assert.deepEqual(list, []);
  });

  it("returns undefined for unknown state by code", async () => {
    const states = await loadStates();
    assert.equal(states.getStateByCodeAndCountry("NOPE", "RO"), undefined);
  });
});

describe("loadCities resilience", () => {
  it("returns empty array for an unknown state", async () => {
    const cities = await loadCities();
    const list = cities.getCitiesOfState("RO", "NOPE");
    assert.deepEqual(list, []);
  });
});
