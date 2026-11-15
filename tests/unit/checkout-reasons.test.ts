// Test setup - configure window.ENV before other imports
import "./setup-env.js";

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { mapRevolutErrorToRomanian } from "@/utils/checkout-reasons.js";

describe("mapRevolutErrorToRomanian", () => {
  it("maps insufficient_funds to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.insufficient_funds", message: "insufficient funds" }),
      "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.",
    );
  });

  it("maps expired_card to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.expired_card", message: "card expired" }),
      "Cardul a expirat. Te rugăm să folosești un card valabil.",
    );
  });

  it("maps do_not_honour to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.do_not_honour", message: "do not honour" }),
      "Plata a fost refuzată de bancă. Te rugăm să verifici cu emitentul cardului.",
    );
  });

  it("maps challenge_failed to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.customer_challenge_failed", message: "challenge failed" }),
      "Verificarea de securitate a eșuat. Te rugăm să încerci din nou.",
    );
  });

  it("maps 3ds_failed to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.3ds_failed", message: "3d secure failed" }),
      "Autentificarea 3D Secure a eșuat. Te rugăm să încerci cu un alt card.",
    );
  });

  it("maps declined to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.declined", message: "transaction declined" }),
      "Plata a fost refuzată. Te rugăm să verifici datele cardului.",
    );
  });

  it("maps invalid-postcode to Romanian message", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.invalid-postcode", message: "invalid postcode" }),
      "Codul poștal este obligatoriu. Te rugăm să completezi câmpul cod poștal.",
    );
  });

  it("uses fallback message for unknown error type", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.unknown", message: "something went wrong" }),
      "Plata a eșuat. Te rugăm să verifici datele și să încerci din nou.",
    );
  });

  it("matches by message keywords when type is generic", () => {
    assert.equal(
      mapRevolutErrorToRomanian({ type: "error.generic", message: "insufficient funds on card" }),
      "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.",
    );
  });
});
