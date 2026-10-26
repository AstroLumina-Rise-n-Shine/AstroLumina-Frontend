import RevolutEmbeddedCheckout from "@/components/RevolutEmbeddedCheckout";
import { getProduct } from "@/data/products";

interface PaymentStepProps {
  onComplete: (orderToken: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onComplete }) => {
  const product = getProduct("ghid-saturn-in-berbec")!;

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
        <RevolutEmbeddedCheckout
          amount={product.amount}
          currency={product.currency}
          orderMetadata={{ product: "ghid-saturn-in-berbec" }}
          onSuccess={onComplete}
        />
      </div>
    </div>
  );
};

export default PaymentStep;