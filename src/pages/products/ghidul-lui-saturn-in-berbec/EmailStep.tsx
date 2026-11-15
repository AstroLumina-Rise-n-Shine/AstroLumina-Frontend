import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendGhidulSaturnEmail } from "@/utils/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Mail } from "lucide-react";

interface EmailStepProps {
  onBack?: () => void;
}

const emailSchema = z.object({
  email: z.string().email("Te rugăm să introduci o adresă de email validă."),
});

type EmailForm = z.infer<typeof emailSchema>;

const EmailStep: React.FC<EmailStepProps> = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const handleSend = async (data: EmailForm) => {
    setError("");
    setIsSendingEmail(true);

    try {
      const result = await sendGhidulSaturnEmail(data.email);
      if (result.success) {
        setEmailSent(true);
      } else {
        setError("A apărut o eroare. Te rugăm să încerci din nou.");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setError("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (emailSent) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="mb-4 text-2xl font-bold font-display text-white">
          Ghidul ajunge la tine în câteva minute!
        </h2>
        <p className="mb-8 text-cosmic-300">
          Verifică-ți inbox-ul (și spam-ul) - acolo vei găsi ghidul.
        </p>
        <Button
          onClick={() => navigate("/produse")}
          variant="outline"
          className="px-6 py-3"
        >
          Înapoi la produse
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSend)}
      className="space-y-6"
      noValidate
    >
      <div className="p-6 border rounded-xl bg-emerald-500/10 border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20">
            <Mail className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-emerald-300">
              Plata a fost realizată cu succes
            </p>
            <p className="text-sm text-cosmic-400">Acum descarcă-ți ghidul</p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="guide-email"
          className="block mb-2 text-sm text-cosmic-300 font-medium"
        >
          Email pentru trimitere ghid
        </label>
        <Input
          id="guide-email"
          {...form.register("email")}
          type="email"
          placeholder="email@exemplu.ro"
          className="w-full"
          aria-invalid={form.formState.errors.email ? "true" : "false"}
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="luxury"
        size="lg"
        className="w-full"
        disabled={isSendingEmail}
      >
        {isSendingEmail ? (
          <>
            <svg
              className="w-4 h-4 mr-2 animate-spin"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="22"
                strokeDashoffset="0"
              />
            </svg>
            Se trimite...
          </>
        ) : (
          "Trimite-mi ghidul"
        )}
      </Button>
    </form>
  );
};

export default EmailStep;
