import { describe, it } from "node:test";
import assert from "node:assert/strict";
import Country from "country-state-city/lib/country.js";
import StateModule from "country-state-city/lib/state.js";
import CityModule from "country-state-city/lib/city.js";

describe("Country helper", () => {
  it("returns Romania for RO code", () => {
    const country = Country.getCountryByCode("RO");
    assert.ok(country);
    assert.equal(country.name, "Romania");
    assert.equal(country.isoCode, "RO");
  });

  it("returns undefined for unknown code", () => {
    assert.equal(Country.getCountryByCode("XX"), undefined);
    assert.equal(Country.getCountryByCode(""), undefined);
  });
});

describe("State helper", () => {
  it("getStatesOfCountry returns Romanian counties", () => {
    const states = StateModule.getStatesOfCountry("RO");
    assert.ok(Array.isArray(states));
    assert.ok(states.length > 0);
    // Every state should have a code, name, and countryCode
    for (const state of states) {
      assert.ok(typeof state.isoCode === "string" && state.isoCode.length > 0);
      assert.ok(typeof state.name === "string" && state.name.length > 0);
      assert.equal(state.countryCode, "RO");
    }
  });

  it("getStateByCodeAndCountry works with a real state code", () => {
    const states = StateModule.getStatesOfCountry("RO");
    assert.ok(states.length > 0);
    const first = states[0];
    const found = StateModule.getStateByCodeAndCountry(first.isoCode, "RO");
    assert.ok(found);
    assert.equal(found.isoCode, first.isoCode);
    assert.equal(found.name, first.name);
  });

  it("getStateByCodeAndCountry returns undefined for invalid", () => {
    assert.equal(StateModule.getStateByCodeAndCountry("XX", "RO"), undefined);
    assert.equal(StateModule.getStateByCodeAndCountry("B", "XX"), undefined);
  });
});

describe("City helper", () => {
  it("getCitiesOfState returns cities for a real state", () => {
    const states = StateModule.getStatesOfCountry("RO");
    assert.ok(states.length > 0);
    const cities = CityModule.getCitiesOfState("RO", states[0].isoCode);
    assert.ok(Array.isArray(cities));
    assert.ok(cities.length > 0);
    for (const city of cities) {
      assert.ok(typeof city.name === "string" && city.name.length > 0);
      assert.equal(city.countryCode, "RO");
      assert.equal(city.stateCode, states[0].isoCode);
    }
  });

  it("getCitiesOfState returns empty array for unknown state", () => {
    const cities = CityModule.getCitiesOfState("RO", "XX");
    assert.ok(Array.isArray(cities));
    assert.equal(cities.length, 0);
  });
});
