"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RevolutEmbeddedCheckout from "@/components/RevolutEmbeddedCheckout";
import { getProduct } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentStepProps {
  onComplete: (orderToken: string) => void;
}

const paymentSchema = z.object({
  email: z.string().email("Te rugăm să introduci un email valid."),
});

const PaymentStep: React.FC<PaymentStepProps> = ({ onComplete }) => {
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const product = getProduct("ghid-saturn-in-berbec")!;

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { email: "" },
  });

  const handleError = (err: Error) => {
    setPaymentError(err.message || "Plata a eșuat. Te rugăm să încerci din nou.");
    setIsProcessing(false);
  };

  const handleSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setPaymentError("");
    setIsProcessing(true);

    try {
      // The form submission triggers the checkout flow
      // Email is collected here but checkout is handled by Revolut component
      // Email will be passed to Revolut checkout
    } catch (err) {
      handleError(err instanceof Error ? err : new Error("Eroare neașteptată"));
    }
  };

  const handleSuccess = (orderToken: string) => {
    onComplete(orderToken);
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                {...form.register("email")}
                placeholder="email@exemplu.ro"
                type="email"
                required
                className="w-full"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
                {paymentError}
              </div>
            )}

            <Button
              type="submit"
              variant="luxury"
              size="lg"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="0" />
                  </svg>
                  Procesez plata...
                </>
              ) : (
                "Plătește cu Revolut"
              )}
            </Button>
          </form>

          <RevolutEmbeddedCheckout
            amount={product.amount}
            currency={product.currency}
            orderMetadata={{ product: "ghid-saturn-in-berbec" }}
            onSuccess={handleSuccess}
            onError={handleError}
            className="mt-6"
          />
        </CardContent>
      </div>
    </div>
  );
};

export default PaymentStep;