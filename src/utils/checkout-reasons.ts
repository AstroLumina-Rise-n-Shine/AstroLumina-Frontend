export interface RevolutErrorLike {
  message?: string;
  type?: string;
}

/**
 * Maps a Revolut Pay decline reason to a user-facing Romanian message.
 *
 * Revolut reports most declines through both a stable `type` code and a
 * free-form `message`, so each branch matches either one.
 */
export function mapRevolutErrorToRomanian(error?: RevolutErrorLike): string {
  const message = error?.message || "";
  const type = error?.type || "";
  const lowerMessage = message.toLowerCase();

  if (
    type === "error.invalid-postcode" ||
    lowerMessage.includes("postcode") ||
    lowerMessage.includes("cod poștal")
  ) {
    return "Codul poștal este obligatoriu. Te rugăm să completezi câmpul cod poștal.";
  }
  if (
    type === "error.insufficient_funds" ||
    lowerMessage.includes("insufficient") ||
    lowerMessage.includes("fonduri")
  ) {
    return "Cardul nu are fonduri suficiente. Te rugăm să folosești un alt card.";
  }
  if (
    type === "error.expired_card" ||
    lowerMessage.includes("expired") ||
    lowerMessage.includes("expirat")
  ) {
    return "Cardul a expirat. Te rugăm să folosești un card valabil.";
  }
  if (
    type === "error.do_not_honour" ||
    lowerMessage.includes("do not honour") ||
    lowerMessage.includes("nu poate fi onorat")
  ) {
    return "Plata a fost refuzată de bancă. Te rugăm să verifici cu emitentul cardului.";
  }
  if (
    type === "error.customer_challenge_failed" ||
    lowerMessage.includes("challenge") ||
    lowerMessage.includes("verificare")
  ) {
    return "Verificarea de securitate a eșuat. Te rugăm să încerci din nou.";
  }
  if (
    type === "error.3ds_failed" ||
    lowerMessage.includes("3d") ||
    lowerMessage.includes("3ds") ||
    lowerMessage.includes("strong customer")
  ) {
    return "Autentificarea 3D Secure a eșuat. Te rugăm să încerci cu un alt card.";
  }
  if (
    type === "error.declined" ||
    lowerMessage.includes("declined") ||
    lowerMessage.includes("refuzat")
  ) {
    return "Plata a fost refuzată. Te rugăm să verifici datele cardului.";
  }
  return "Plata a eșuat. Te rugăm să verifici datele și să încerci din nou.";
}
