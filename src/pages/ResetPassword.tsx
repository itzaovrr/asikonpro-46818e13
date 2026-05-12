import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";

const schema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Too long"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase puts the recovery tokens in the URL hash and emits a
  // PASSWORD_RECOVERY event when the recovery session is established.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setValidSession(true);
        setChecking(false);
      }
    });

    // Fallback: if we already have a session (user clicked the link)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValidSession(true);
      setChecking(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const r = schema.safeParse({ password, confirm });
    if (!r.success) {
      const f: Record<string, string> = {};
      r.error.errors.forEach((er) => {
        if (er.path[0]) f[er.path[0] as string] = er.message;
      });
      setErrors(f);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast({
        title: "Password updated",
        description: "You're all set — redirecting to your account…",
      });
      setTimeout(() => navigate("/", { replace: true }), 1600);
    } catch (err: any) {
      toast({
        title: "Couldn't update password",
        description: err.message || "The reset link may have expired. Please request a new one.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-background flex items-center justify-center overflow-hidden px-5 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full blur-[140px] bg-primary/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-[140px] bg-accent/20"
      />

      <div className="relative z-10 w-full max-w-[420px] animate-fade-in">
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl gradient-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)] flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1
            className="text-[1.75rem] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Set a new password
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 text-center">
            Choose a strong password to secure your Asikon account.
          </p>
        </div>

        {checking ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !validSession ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-xl gradient-primary text-primary-foreground"
            >
              Back to sign in
            </Button>
          </div>
        ) : done ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold">Password updated</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your dashboard…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              show={show}
              toggle={() => setShow((s) => !s)}
              error={errors.password}
              autoComplete="new-password"
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm password"
              value={confirm}
              onChange={setConfirm}
              show={show}
              toggle={() => setShow((s) => !s)}
              error={errors.confirm}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm",
                "shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 transition-all",
                "disabled:opacity-70 disabled:hover:translate-y-0",
              )}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? "Updating…" : "Update password"}
              {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

function PasswordInput({
  id,
  label,
  value,
  onChange,
  show,
  toggle,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
  error?: string;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const float = focused || value.length > 0;
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          required
          placeholder=" "
          aria-invalid={!!error}
          className={cn(
            "peer w-full rounded-xl bg-input/60 border px-4 pt-5 pb-2 pr-12 text-[15px] text-foreground",
            "outline-none transition-all duration-200",
            "focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]",
            error
              ? "border-destructive/60 focus:border-destructive"
              : "border-border focus:border-primary",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-200",
            float
              ? "top-1.5 text-[10.5px] font-semibold tracking-wider uppercase text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            error && float && "text-destructive",
          )}
        >
          {label}
        </label>
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={toggle}
          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground p-2 rounded-lg focus-ring"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-destructive ml-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}

export default ResetPassword;
