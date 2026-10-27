import { useState } from "react";
import RevolutEmbeddedCheckout from "@/components/RevolutEmbeddedCheckout";
import { getProduct } from "@/data/products";

interface PaymentStepProps {
  onComplete: (orderToken: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onComplete }) => {
  const [paymentError, setPaymentError] = useState("");
  const product = getProduct("ghid-saturn-in-berbec")!;

  const handleError = (err: Error) => {
    setPaymentError(err.message || "Plata a eșuat. Te rugăm să încerci din nou.");
  };

  return (
    <div id="checkout">
      <div className="p-4 mb-6 border rounded-xl bg-white/5 border-white/10">
        <div className="pb-4 mb-6 border-b border-white/10">
          <p className="text-sm text-cosmic-200">
            <span className="font-semibold">Produs:</span> {product.name}
          </p>
          <p className="mt-2 text-xs text-cosmic-300">
            Preț: €{(product.amount / 100).toFixed(2)}
          </p>
        </div>
        {paymentError && (
          <div className="mb-4 p-3 text-sm text-red-300 border rounded-xl bg-red-500/10 border-red-500/20">
            {paymentError}
          </div>
        )}
        <RevolutEmbeddedCheckout
          amount={product.amount}
          currency={product.currency}
          orderMetadata={{ product: "ghid-saturn-in-berbec" }}
          onSuccess={onComplete}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default PaymentStep;