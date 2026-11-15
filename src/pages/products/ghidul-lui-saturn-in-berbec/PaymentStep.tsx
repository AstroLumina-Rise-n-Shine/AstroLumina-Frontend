import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RevolutEmbeddedCheckout from "@/components/RevolutEmbeddedCheckout";
import { getProduct } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PaymentStepProps {
  onComplete: (orderToken: string) => void;
}

const paymentSchema = z.object({
  email: z.string().email("Te rugăm să introduci un email valid."),
});

type PaymentForm = z.infer<typeof paymentSchema>;

const PaymentStep: React.FC<PaymentStepProps> = ({ onComplete }) => {
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const product = getProduct("ghid-saturn-in-berbec")!;

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = (data: PaymentForm) => {
    setPaymentError("");
    setCustomerEmail(data.email);
  };

  const handleError = (err: Error) => {
    setPaymentError(err.message || "Plata a eșuat. Te rugăm să încerci din nou.");
    // Return to the email step so the customer can retry with another address.
    setCustomerEmail(null);
  };

  return (
    <div id="checkout">
      <div className="p-6 mb-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="pb-4 mb-6 border-b border-white/10">
          <CardTitle className="text-lg font-semibold text-white">
            Produs: {product.name}
          </CardTitle>
          <p className="mt-2 text-xs text-cosmic-300">
            Preț: €{(product.amount / 100).toFixed(2)}
          </p>
        </CardHeader>

        <CardContent>
          {customerEmail === null ? (
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-2">
                <label
                  htmlFor="checkout-email"
                  className="block text-sm font-medium text-cosmic-300"
                >
                  Email pentru confirmare și livrare
                </label>
                <Input
                  id="checkout-email"
                  {...form.register("email")}
                  type="email"
                  placeholder="email@exemplu.ro"
                  className="w-full"
                  aria-invalid={form.formState.errors.email ? "true" : "false"}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {paymentError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
                >
                  {paymentError}
                </div>
              )}

              <Button type="submit" variant="luxury" size="lg" className="w-full">
                Continuă către plată
              </Button>
            </form>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-cosmic-300">
                <span>
                  Plătești ca{" "}
                  <strong className="font-semibold text-white">
                    {customerEmail}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentError("");
                    setCustomerEmail(null);
                  }}
                  className="underline cursor-pointer hover:text-white"
                >
                  Schimbă emailul
                </button>
              </div>

              <RevolutEmbeddedCheckout
                amount={product.amount}
                currency={product.currency}
                customerEmail={customerEmail}
                orderMetadata={{ product: "ghid-saturn-in-berbec" }}
                onSuccess={onComplete}
                onError={handleError}
              />
            </>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default PaymentStep;
