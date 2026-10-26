import { useEffect, useRef, useCallback } from "react";
import { REVOLUT_PAY_PUBLIC_KEY, PAYMENT_API_URL } from "@/config";

interface RevolutPayButtonProps {
  amount: number;       // in minor currency units (cents)
  currency: string;     // e.g. "EUR", "RON"
  orderMetadata?: Record<string, string>;
  createOrderUrl?: string; // defaults to `${PAYMENT_API_URL}/create-order`
  onSuccess: (orderToken: string) => void;
  onError?: (err: Error) => void;
  className?: string;
}

interface RevolutPayInstance {
  mount: (target: HTMLElement, options: { currency: string; totalAmount: number; createOrder: () => Promise<{ publicId: string }> }) => Promise<void>;
  unmount: () => void;
  on: (event: string, callback: (event: RevolutPayEvent) => void) => void;
}

interface RevolutPayEvent {
  status: "success" | "failed" | "cancelled";
  order?: { publicId: string };
}

/**
 * Revolut Pay button component.
 * Uses the Revolut Checkout SDK to mount a Revolut Pay button.
 * The createOrder callback calls the backend to create an order via the Merchant API.
 */
const RevolutPayButton: React.FC<RevolutPayButtonProps> = ({
  amount,
  currency,
  orderMetadata = {},
  createOrderUrl = `${PAYMENT_API_URL}/create-order`,
  onSuccess,
  onError,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revolutPayRef = useRef<RevolutPayInstance | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

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

    const initRevolutPay = async () => {
      try {
        // Dynamic import to keep checkout chunk out of the main bundle
        const RevolutCheckout = (await import("@revolut/checkout")).default;
        const { revolutPay } = await RevolutCheckout.payments({
          publicToken: REVOLUT_PAY_PUBLIC_KEY,
          mode: "prod",
        });

        if (!mounted || !containerRef.current) return;

        revolutPayRef.current = revolutPay;

        await revolutPay.mount(containerRef.current, {
          currency,
          totalAmount: amount,
          createOrder,
        });

        revolutPay.on("payment", (event: RevolutPayEvent) => {
          if (event.status === "success") {
            onSuccessRef.current(event.order?.publicId || "");
          } else if (event.status === "failed" || event.status === "cancelled") {
            onErrorRef.current?.(new Error(`Payment ${event.status}`));
          }
        });
      } catch (err) {
        if (mounted) {
          onErrorRef.current?.(err as Error);
        }
      }
    };

    initRevolutPay();

    return () => {
      mounted = false;
      if (revolutPayRef.current) {
        try {
          revolutPayRef.current.unmount();
        } catch {
          // ignore cleanup errors
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency, createOrderUrl, JSON.stringify(orderMetadata)]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        margin: "1rem 0",
        maxWidth: "480px",
      }}
    />
  );
};

export default RevolutPayButton;