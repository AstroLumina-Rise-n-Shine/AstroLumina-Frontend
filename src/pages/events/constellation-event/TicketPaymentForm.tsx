import { useState, useRef, useEffect } from "react";
import RevolutEmbeddedCheckout from "@/components/RevolutEmbeddedCheckout";
import { getProduct } from "@/data/products";
import { ConstellationEvent } from "@/data/events";

interface TicketPaymentFormProps {
  event: ConstellationEvent | undefined;
  ticketCount: number;
  onPaymentComplete: (paymentIntentId: string) => void;
  onBack: () => void;
}

const TicketPaymentForm: React.FC<TicketPaymentFormProps> = ({
  event,
  ticketCount,
  onPaymentComplete,
  onBack,
}) => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (hasNavigatedRef.current) return;
    if (paymentComplete) {
      hasNavigatedRef.current = true;
      onPaymentComplete(paymentIntentId);
    }
  }, [paymentComplete, paymentIntentId, onPaymentComplete]);

  const eventId = event?.id || "";

  // Get price per ticket from catalog (7000 cents = €70)
  const product = getProduct("eveniment-constelatii")!;
  const amount = product.amount * ticketCount;
  const currency = product.currency;

  const handleSuccess = (orderToken: string) => {
    setPaymentIntentId(orderToken);
    setPaymentComplete(true);
    onPaymentComplete(orderToken);
  };

  const handleError = (err: Error) => {
    setPaymentError(err.message || "Plata a eșuat. Te rugăm să încerci din nou.");
  };

  return (
    <div>
      <div className="p-4 mb-6 border rounded-xl bg-white/5 border-white/10">
        <div className="pb-4 mb-4 border-b border-white/10">
          <p className="text-sm text-cosmic-200">
            <span className="font-semibold">Plată pentru:</span> {ticketCount}{" "}
            bilet(e) x {event?.price || 70} €
          </p>
          <p className="mt-2 text-lg font-bold text-gold-400">
            Total: {(amount / 100).toFixed(2)} €
          </p>
        </div>

        {paymentError ? (
          <div className="py-8 text-center">
            <div className="mb-4 p-3 text-sm text-red-300 border rounded-xl bg-red-500/10 border-red-500/20">
              {paymentError}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 transition-colors border cursor-pointer rounded-xl bg-white/5 text-cosmic-200 hover:bg-white/10 border-white/10"
            >
              Reîncarcă pagina
            </button>
          </div>
        ) : paymentComplete ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-500/20">
              <span className="text-2xl text-emerald-400">✓</span>
            </div>
            <p className="font-medium text-emerald-300">
              Plata a fost realizată cu succes
            </p>
          </div>
        ) : (
          <RevolutEmbeddedCheckout
            amount={amount}
            currency={currency}
            orderMetadata={{
              sessionType: "eveniment-constelatii",
              ticketCount: String(ticketCount),
              eventId,
            }}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => { setPaymentError(""); onBack(); }}
        className="w-full px-6 py-3 font-semibold transition-colors border cursor-pointer rounded-xl bg-white/5 text-cosmic-200 hover:bg-white/10 border-white/10"
      >
        Înapoi
      </button>
    </div>
  );
};

export default TicketPaymentForm;