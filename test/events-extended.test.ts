import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CONSTELLATION_EVENTS } from "../src/data/events.js";

describe("CONSTELLATION_EVENTS", () => {
  it("is a non-empty array", () => {
    assert.ok(Array.isArray(CONSTELLATION_EVENTS));
    assert.ok(CONSTELLATION_EVENTS.length > 0);
  });

  it("all event IDs are unique", () => {
    const ids = CONSTELLATION_EVENTS.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("every event has a positive price in a sane range", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(Number.isInteger(event.price));
      assert.ok(event.price > 0);
      assert.ok(event.price <= 200);
    }
  });

  it("every event has a valid Date in the future", () => {
    const now = Date.now();
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(event.date instanceof Date);
      assert.ok(Number.isFinite(event.date.getTime()));
      assert.ok(event.date.getTime() > now, `event ${event.id} is not in the future`);
    }
  });

  it("every event has non-empty title, location and description", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(typeof event.title === "string" && event.title.length > 0);
      assert.ok(typeof event.location === "string" && event.location.length > 0);
      assert.ok(
        typeof event.description === "string" && event.description.length > 0,
      );
    }
  });

  it("every event has a non-empty details array", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(Array.isArray(event.details));
      assert.ok(event.details.length > 0);
      for (const detail of event.details) {
        assert.ok(typeof detail === "string" && detail.length > 0);
      }
    }
  });

  it("every event has a time range in HH:MM - HH:MM format", () => {
    const timeRe = /^\d{2}:\d{2} - \d{2}:\d{2}$/;
    for (const event of CONSTELLATION_EVENTS) {
      assert.match(event.time, timeRe);
    }
  });
});
