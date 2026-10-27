import { useEffect, useRef, useCallback } from "react";
import { REVOLUT_PAY_PUBLIC_KEY, REVOLUT_PAY_MODE, PAYMENT_API_URL } from "@/config";

interface RevolutEmbeddedCheckoutProps {
  amount: number;              // in minor currency units (cents)
  currency: string;            // e.g. "EUR", "RON"
  orderMetadata?: Record<string, string>;
  createOrderUrl?: string;     // defaults to `${PAYMENT_API_URL}/create-order`
  onSuccess: (orderToken: string) => void;
  onError?: (err: Error) => void;
  onCancel?: () => void;
  className?: string;
  locale?: string;
  customerEmail?: string;
}

interface CheckoutInstance {
  destroy: () => void;
}

interface RevolutCheckoutError {
  message?: string;
}

/**
 * Revolut Embedded Checkout component.
 * Uses the Revolut Checkout SDK EmbeddedCheckout to mount a full checkout form
 * with card fields, Google Pay, Apple Pay, Revolut Pay, and Pay by Bank.
 * Similar to Stripe's EmbeddedCheckout.
 */
const RevolutEmbeddedCheckout: React.FC<RevolutEmbeddedCheckoutProps> = ({
  amount,
  currency,
  orderMetadata = {},
  createOrderUrl = `${PAYMENT_API_URL}/create-order`,
  onSuccess,
  onError,
  onCancel,
  className,
  locale = "ro",
  customerEmail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<CheckoutInstance | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onCancelRef = useRef(onCancel);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onCancelRef.current = onCancel;
  }, [onSuccess, onError, onCancel]);

  const createOrder = useCallback(async () => {
    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
        metadata: orderMetadata,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }
    const data = await response.json();
    return { publicId: data.token };
  }, [createOrderUrl, amount, currency, orderMetadata]);

  useEffect(() => {
    let mounted = true;

    const initEmbeddedCheckout = async () => {
      try {
        // Dynamic import to keep checkout chunk out of the main bundle
        const { RevolutEmbeddedCheckoutLoader } = await import(
          "@revolut/checkout/esm/embeddedCheckoutLoader"
        );

        if (!mounted || !containerRef.current) return;

        const checkout = await RevolutEmbeddedCheckoutLoader({
          mode: REVOLUT_PAY_MODE,
          publicToken: REVOLUT_PAY_PUBLIC_KEY,
          locale,
          target: containerRef.current,
          createOrder,
          onSuccess: (payload: { orderId: string }) => {
            onSuccessRef.current(payload.orderId);
          },
          onError: (payload: { error: RevolutCheckoutError; orderId: string }) => {
            onErrorRef.current?.(new Error(payload.error?.message || "Payment failed"));
          },
          onCancel: () => {
            onCancelRef.current?.();
          },
          email: customerEmail,
        });

        checkoutRef.current = checkout;
      } catch (err) {
        if (mounted) {
          onErrorRef.current?.(err as Error);
        }
      }
    };

    initEmbeddedCheckout();

    return () => {
      mounted = false;
      if (checkoutRef.current) {
        try {
          checkoutRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency, createOrderUrl, JSON.stringify(orderMetadata), locale, customerEmail]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        margin: "1rem 0",
        minHeight: "300px", // Ensure space for the embedded checkout
      }}
    />
  );
};

export default RevolutEmbeddedCheckout;