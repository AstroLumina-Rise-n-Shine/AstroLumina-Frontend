// Test setup - configure window.ENV before other imports
import "./setup-env.js";

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_CODES } from "@/data/international.js";
import { CONSTELLATION_EVENTS } from "@/data/events.js";

describe("unified frontend coverage", () => {
  it("exports country code metadata and known events", () => {
    assert.ok(COUNTRY_CODES.length > 0);
    assert.ok(CONSTELLATION_EVENTS.length > 0);
  });

  it("all event titles are non-empty", () => {
    for (const event of CONSTELLATION_EVENTS) {
      assert.ok(event.title.length > 0);
    }
  });
});
