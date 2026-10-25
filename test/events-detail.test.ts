import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CONSTELLATION_EVENTS } from "../src/data/events.js";

describe("constellation event details", () => {
  it("every event has details, location and time", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(event.details.length > 0);
      assert.ok(event.location.length > 0);
      assert.match(event.time, /\d{2}:\d{2}/);
    }
  });

  it("every detail string is non-empty", () => {
    for (const event of CONSTELLATION_EVENTS) {
      for (const detail of event.details) {
        assert.ok(detail.length > 0);
      }
    }
  });

  it("pre-scheduled events are dated in the future relative to 2026-01-01", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(event.date.getTime() > Date.parse("2026-01-01"));
    }
  });
});
