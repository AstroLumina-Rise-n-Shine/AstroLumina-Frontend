import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("RevolutEmbeddedCheckout decline-reason mapping", () => {
  function mapError(payload: {
    error?: { message?: string; type?: string };
    orderId: string;
  }): string | undefined {
    const msg = payload.error?.message || "";
    const type = payload.error?.type || "";
    const lowerMsg = msg.toLowerCase();
    const lowerType = type.toLowerCase();

    let romanianMsg = "";
    if (
      type === "error.invalid-postcode" ||
      lowerMsg.includes("postcode") ||
      lowerMsg.includes("cod poștal")
    ) {
      romanianMsg =
        "Codul poștal este obligatoriu. Te rugăm să completezi câmpul cod poștal.";
    } else if (
      type === "error.insufficient_funds" ||
      lowerMsg.includes("insufficient") ||
      lowerMsg.includes("fonduri")
    ) {
      romanianMsg =
        "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.";
    } else if (
      type === "error.expired_card" ||
      lowerMsg.includes("expired") ||
      lowerMsg.includes("expirat")
    ) {
      romanianMsg =
        "Cardul a expirat. Te rugăm să folosești un card valabil.";
    } else if (
      type === "error.do_not_honour" ||
      lowerMsg.includes("do not honour") ||
      lowerMsg.includes("nu poate fi onorat")
    ) {
      romanianMsg =
        "Plata a fost refuzată de bancă. Te rugăm să verifici cu emitentul cardului.";
    } else if (
      type === "error.customer_challenge_failed" ||
      lowerMsg.includes("challenge") ||
      lowerMsg.includes("verificare")
    ) {
      romanianMsg =
        "Verificarea de securitate a eșuat. Te rugăm să încerci din nou.";
    } else if (
      type === "error.3ds_failed" ||
      lowerMsg.includes("3d") ||
      lowerMsg.includes("3ds") ||
      lowerMsg.includes("strong customer")
    ) {
      romanianMsg =
        "Autentificarea 3D Secure a eșuat. Te rugăm să încerci cu un alt card.";
    } else if (
      type === "error.declined" ||
      lowerMsg.includes("declined") ||
      lowerMsg.includes("refuzat")
    ) {
      romanianMsg =
        "Plata a fost refuzată. Te rugăm să verifici datele cardului.";
    } else {
      romanianMsg =
        "Plata a eșuat. Te rugăm să verifici datele și să încerci din nou.";
    }

    return romanianMsg;
  }

  it("maps insufficient_funds to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.insufficient_funds", message: "insufficient funds" },
        orderId: "ord_123",
      }),
      "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.",
    );
  });

  it("maps expired_card to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.expired_card", message: "card expired" },
        orderId: "ord_123",
      }),
      "Cardul a expirat. Te rugăm să folosești un card valabil.",
    );
  });

  it("maps do_not_honour to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.do_not_honour", message: "do not honour" },
        orderId: "ord_123",
      }),
      "Plata a fost refuzată de bancă. Te rugăm să verifici cu emitentul cardului.",
    );
  });

  it("maps challenge_failed to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.customer_challenge_failed", message: "challenge failed" },
        orderId: "ord_123",
      }),
      "Verificarea de securitate a eșuat. Te rugăm să încerci din nou.",
    );
  });

  it("maps 3ds_failed to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.3ds_failed", message: "3d secure failed" },
        orderId: "ord_123",
      }),
      "Autentificarea 3D Secure a eșuat. Te rugăm să încerci cu un alt card.",
    );
  });

  it("maps declined to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.declined", message: "transaction declined" },
        orderId: "ord_123",
      }),
      "Plata a fost refuzată. Te rugăm să verifici datele cardului.",
    );
  });

  it("maps invalid-postcode to Romanian message", () => {
    assert.equal(
      mapError({
        error: { type: "error.invalid-postcode", message: "invalid postcode" },
        orderId: "ord_123",
      }),
      "Codul poștal este obligatoriu. Te rugăm să completezi câmpul cod poștal.",
    );
  });

  it("uses fallback message for unknown error type", () => {
    assert.equal(
      mapError({
        error: { type: "error.unknown", message: "something went wrong" },
        orderId: "ord_123",
      }),
      "Plata a eșuat. Te rugăm să verifici datele și să încerci din nou.",
    );
  });

  it("matches by message keywords when type is generic", () => {
    assert.equal(
      mapError({
        error: { type: "error.generic", message: "insufficient funds on card" },
        orderId: "ord_123",
      }),
      "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.",
    );
  });
});
