// Setup file for unit tests - must run before any other imports
// This file sets window.ENV for config module to read

interface DummyEnv {
  NODE_ENV: string;
  FRONTEND_SERVER_PORT: string;
  FRONTEND_SENTRY_DSN: string;
  REVOLUT_PAY_PUBLIC_KEY: string;
  REVOLUT_PAY_MODE: string;
  R2_BASE_URL: string;
  ASTROLOGY_API_SERVER_DC_PORT: string;
  ASTROLOGY_API_SERVER_DC_DNS: string;
  ASTROLOGY_API_SERVER_K8S_PORT: string;
  ASTROLOGY_API_SERVER_K8S_DNS: string;
  BOOKING_API_SERVER_DC_PORT: string;
  BOOKING_API_SERVER_DC_DNS: string;
  BOOKING_API_SERVER_K8S_PORT: string;
  BOOKING_API_SERVER_K8S_DNS: string;
  PAYMENT_API_SERVER_DC_PORT: string;
  PAYMENT_API_SERVER_DC_DNS: string;
  PAYMENT_API_SERVER_K8S_PORT: string;
  PAYMENT_API_SERVER_K8S_DNS: string;
  FRONTEND_SERVER_DC_PORT: string;
  FRONTEND_SERVER_DC_DNS: string;
  FRONTEND_SERVER_K8S_PORT: string;
  FRONTEND_SERVER_K8S_DNS: string;
  ASTROLOGY_API_URL: string;
  PAYMENT_API_URL: string;
  BOOKING_API_URL: string;
}

const DUMMY_ENV: DummyEnv = {
  NODE_ENV: "development",
  FRONTEND_SERVER_PORT: "80",
  FRONTEND_SENTRY_DSN: "https://abc123@o0.ingest.sentry.io/0",
  REVOLUT_PAY_PUBLIC_KEY: "pk_test_dummy",
  REVOLUT_PAY_MODE: "sandbox",
  R2_BASE_URL: "https://r2.test.local",
  ASTROLOGY_API_SERVER_DC_PORT: "3031",
  ASTROLOGY_API_SERVER_DC_DNS: "dc.test.local",
  ASTROLOGY_API_SERVER_K8S_PORT: "3131",
  ASTROLOGY_API_SERVER_K8S_DNS: "k8s.test.local",
  BOOKING_API_SERVER_DC_PORT: "3033",
  BOOKING_API_SERVER_DC_DNS: "dc.test.local",
  BOOKING_API_SERVER_K8S_PORT: "3133",
  BOOKING_API_SERVER_K8S_DNS: "k8s.test.local",
  PAYMENT_API_SERVER_DC_PORT: "3032",
  PAYMENT_API_SERVER_DC_DNS: "dc.test.local",
  PAYMENT_API_SERVER_K8S_PORT: "3132",
  PAYMENT_API_SERVER_K8S_DNS: "k8s.test.local",
  FRONTEND_SERVER_DC_PORT: "8080",
  FRONTEND_SERVER_DC_DNS: "dc.test.local",
  FRONTEND_SERVER_K8S_PORT: "8180",
  FRONTEND_SERVER_K8S_DNS: "k8s.test.local",
  ASTROLOGY_API_URL: "https://dc.test.local:3031",
  PAYMENT_API_URL: "https://dc.test.local:3032",
  BOOKING_API_URL: "https://dc.test.local:3033",
};

// Set window.ENV in the global scope for Node.js environment
const globalWindow = globalThis as { window?: { ENV: DummyEnv } };
globalWindow.window = { ENV: DUMMY_ENV };

// Export for use in tests
export { DUMMY_ENV };