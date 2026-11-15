import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";

import App from "@/App";
import "./styles/starry-theme.css";
import "./styles/astronomy-fonts.css";
import "flatpickr/dist/themes/material_blue.css";
import { LoadingProvider } from "@/contexts/LoadingContext";
import RouteFallback from "@/components/RouteFallback";
import { env, initSentry } from "@/config";

// Initialize Sentry - Error Tracking + Performance + Session Replay + Profiling
void initSentry(env.FRONTEND_SENTRY_DSN, env.NODE_ENV, env.SENTRY_RELEASE);

// Route-level code splitting: each page becomes a separate chunk,
// loaded on demand. Without this, all pages + country-state-city +
// revolut + jspdf ended up in a single ~10MB chunk.
const NotFound = lazy(() => import("@/pages/NotFound"));
const AboutMe = lazy(() => import("@/pages/AboutMe"));
const Contact = lazy(() => import("@/pages/Contact"));
const Services = lazy(() => import("@/pages/Services"));
const AstralCalculator = lazy(
  () => import("@/pages/services/AstralCalculator"),
);
const MoonPhaseCalculator = lazy(
  () => import("@/pages/services/MoonPhaseCalculator"),
);
const NatalNKarmicChartBooking = lazy(
  () => import("@/pages/bookings/NatalNKarmicChartBooking"),
);
const SynastryChartBooking = lazy(
  () => import("@/pages/bookings/SynastryChartBooking"),
);
const PredictiveChartBooking = lazy(
  () => import("@/pages/bookings/PredictiveChartBooking"),
);
const Products = lazy(() => import("@/pages/Products"));
const GhidulLuiSaturnInBerbec = lazy(
  () => import("@/pages/products/GhidulLuiSaturnInBerbec"),
);
const SoareleStralucireaTa = lazy(
  () => import("@/pages/products/SoareleStralucireaTa"),
);
const Events = lazy(() => import("@/pages/Events"));
const ConstellationEvent = lazy(
  () => import("@/pages/events/ConstellationEvent"),
);

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Sentry.ErrorBoundary
        fallback={(error, resetErrorBoundary) => (
          <div className="min-h-screen text-white bg-midnight-950 relative overflow-hidden">
            {/* Background stars and orbs - same as hero section */}
            <div className="absolute inset-0 stars">
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
            </div>

            <div className="cosmic-orb cosmic-orb-purple w-[600px] h-[600px] -top-40 -right-40 opacity-25 animate-pulse-soft"></div>
            <div
              className="cosmic-orb cosmic-orb-gold w-[400px] h-[400px] bottom-20 -left-40 opacity-20 animate-pulse-soft"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="cosmic-orb cosmic-orb-purple w-[200px] h-[200px] top-1/3 left-1/4 opacity-15 animate-pulse-soft"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none bg-linear-to-t to-transparent from-midnight-950 via-midnight-950/80"></div>

            {/* Error content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <h1 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r font-display md:text-4xl from-white via-cosmic-200 to-cosmic-300">
                  Ceva nu a funcționat corect
                </h1>
                <p className="max-w-xl mx-auto mb-8 text-lg leading-relaxed md:text-xl text-cosmic-100/60 font-display">
                  Ne pare rău, a apărut o eroare neașteptată. Echipa noastră tehnică a fost notificată.
                </p>
                <button
                  onClick={resetErrorBoundary}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white rounded-full bg-linear-to-r luxury-button group from-cosmic-600 via-cosmic-500 to-cosmic-600 hover:from-cosmic-500 hover:to-cosmic-500 shadow-luxury-purple"
                >
                  <span>Reîncarcă pagina</span>
                  <svg className="w-5 h-5 transition-transform duration-400 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      >
        <LoadingProvider>
          <Router>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/despre-mine" element={<AboutMe />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/servicii" element={<Services />} />
                {/* Calculators */}
                <Route
                  path="/servicii/calculatorul-astral"
                  element={<AstralCalculator />}
                />
                <Route
                  path="/servicii/calculatorul-fazei-lunare"
                  element={<MoonPhaseCalculator />}
                />
                {/* Astrograms */}
                <Route
                  path="/astrograma/lumina-natala-si-karmica"
                  element={<NatalNKarmicChartBooking />}
                />
                <Route
                  path="/astrograma/lumina-relationala"
                  element={<SynastryChartBooking />}
                />
                <Route
                  path="/astrograma/lumina-previzionala"
                  element={<PredictiveChartBooking />}
                />
                {/* Products */}
                <Route path="/produse" element={<Products />} />
                <Route
                  path="/produse/ghidul-lui-saturn-in-berbec"
                  element={<GhidulLuiSaturnInBerbec />}
                />
                <Route
                  path="/produse/soarele-stralucirea-ta"
                  element={<SoareleStralucireaTa />}
                />
                {/* Events */}
                <Route path="/evenimente" element={<Events />} />
                <Route
                  path="/evenimente/rezervare/:id"
                  element={<ConstellationEvent />}
                />
                {/*  */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </LoadingProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>,
  );
}
