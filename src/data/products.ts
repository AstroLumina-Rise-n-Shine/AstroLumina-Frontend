export interface ProductConfig {
  name: string;
  amount: number;        // in minor currency units (cents)
  currency: string;      // ISO 4217 currency code (e.g., "EUR")
  description: string;
}

export const productCatalog: Record<string, ProductConfig> = {
  "soarele-stralucirea-ta": {
    name: "Soarele Stralucirea Ta",
    amount: 0,           // Free
    currency: "EUR",
    description: "Soarele Stralucirea Ta - Ghid personalizat PDF gratuit",
  },
  "ghid-saturn-in-berbec": {
    name: "Ghidul lui Saturn în Berbec",
    amount: 1500,        // €15.00
    currency: "EUR",
    description: "Ghid complet Saturn în Berbec - PDF digital",
  },
  "astrograma-natala-si-karmica": {
    name: "Astrograma Natală și Karmică",
    amount: 7500,        // €75.00
    currency: "EUR",
    description: "Consultație astrologică live 90 min - Hartă natală și karmică",
  },
  "astrograma-relationala": {
    name: "Astrograma Relațională",
    amount: 7500,        // €75.00
    currency: "EUR",
    description: "Consultație astrologică live 90 min - Sinastrie pentru 2 persoane",
  },
  "astrograma-previzionala": {
    name: "Astrograma Previzională",
    amount: 7500,        // €75.00
    currency: "EUR",
    description: "Consultație astrologică live 90 min - Previzii și tranzite",
  },
  "eveniment-constelatii": {
    name: "Eveniment Constelații",
    amount: 7000,        // €70.00 per ticket
    currency: "EUR",
    description: "Workshop astrologic în persoană - Bilet individual",
  },
};

export function getProduct(productKey: string): ProductConfig | undefined {
  return productCatalog[productKey];
}

export function getAvailableProducts(): string[] {
  return Object.keys(productCatalog);
}

export function getProductKeys(): string[] {
  return Object.keys(productCatalog);
}