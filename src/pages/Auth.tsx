import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { z } from "zod";

// ---- Validation schemas ---------------------------------------------------
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const RESERVED_USERNAMES = ["admin", "moderator", "system", "support", "root", "administrator"];

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, underscores and hyphens only")
    .refine((v) => !RESERVED_USERNAMES.includes(v.toLowerCase()), "This username is reserved"),
  fullName: z
    .string()
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "Letters, spaces, hyphens and apostrophes only")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Too long"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AuthView = "login" | "register" | "forgot-password";

// ---- Reusable themed field ------------------------------------------------
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rightAction?: React.ReactNode;
  trailing?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  rightAction,
  trailing,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-end px-1">
        <label
          htmlFor={id}
          className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.18em]"
        >
          {label}
        </label>
        {rightAction}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            "w-full bg-black/60 border rounded-2xl px-5 py-4 text-sm text-foreground",
            "placeholder:text-foreground/20 outline-none transition-all",
            "focus:bg-black/80 focus:ring-2 focus:ring-primary/30",
            error
              ? "border-destructive/60 focus:border-destructive"
              : "border-white/5 focus:border-primary/50",
            trailing && "pr-12",
          )}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-3 flex items-center">{trailing}</div>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} className="text-xs text-destructive ml-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ---- Page -----------------------------------------------------------------
const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/");
  }, [user, authLoading, navigate]);

  const clearErrors = () => setErrors({});

  const collectErrors = (result: z.SafeParseReturnType<any, any>) => {
    if (result.success) return false;
    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
    });
    setErrors(fieldErrors);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collectErrors(loginSchema.safeParse({ email: loginEmail, password: loginPassword }))) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials"))
          throw new Error("Invalid email or password. Please try again.");
        if (error.message.includes("Email not confirmed"))
          throw new Error("Please verify your email before logging in.");
        throw error;
      }
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (
      collectErrors(
        registerSchema.safeParse({
          username: registerUsername,
          fullName: registerFullName,
          email: registerEmail,
          password: registerPassword,
        }),
      )
    )
      return;
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username: registerUsername, full_name: registerFullName },
        },
      });
      if (error) {
        if (error.message.includes("already registered"))
          throw new Error("This email is already registered. Please sign in instead.");
        throw error;
      }
      if (data.user && !data.session) {
        toast({
          title: "Account created",
          description: "Check your email to verify your account.",
        });
      } else if (data.session) {
        toast({ title: "Welcome!", description: "Your account is ready." });
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collectErrors(forgotPasswordSchema.safeParse({ email: forgotEmail }))) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast({ title: "Reset email sent", description: "Check your inbox for a reset link." });
    } catch (err: any) {
      toast({
        title: "Failed to send reset email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-background flex items-center justify-center overflow-hidden px-5 py-10">
      {/* Ambient liquid blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full blur-[140px] bg-primary/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] rounded-full blur-[140px] bg-primary/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Brand hero */}
        <header className="flex flex-col items-center mb-8 group">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-[0_0_40px_hsl(var(--primary)/0.35)] gradient-primary" />
            <div className="absolute inset-[3px] rounded-[14px] bg-background/85 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-gradient" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>A</span>
            </div>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight text-gradient"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            Asikon
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Learn AI with Asikon
          </p>
        </header>

        {/* Glass auth card */}
        <section
          className={cn(
            "w-full rounded-[36px] p-7 sm:p-8 relative",
            "bg-white/[0.03] border border-white/10 backdrop-blur-2xl",
            "shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.25),inset_0_1px_0_hsl(var(--glass-highlight)/0.06)]",
            "animate-fade-in",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/5"
          />

          {activeView === "forgot-password" ? (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => {
                  setActiveView("login");
                  setResetEmailSent(false);
                  clearErrors();
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </button>

              {resetEmailSent ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Check your email</h2>
                  <p className="text-muted-foreground text-sm">
                    We sent a reset link to <strong className="text-foreground">{forgotEmail}</strong>
                  </p>
                  <Button variant="outline" onClick={() => setResetEmailSent(false)}>
                    Send again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <Field
                    id="forgot-email"
                    label="Email"
                    type="email"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                    placeholder="you@example.com"
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                  <PrimaryCta loading={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </PrimaryCta>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Authentication"
                className="flex bg-black/40 p-1.5 rounded-2xl mb-7 border border-white/5"
              >
                {(["login", "register"] as const).map((v) => {
                  const active = activeView === v;
                  return (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setActiveView(v);
                        clearErrors();
                      }}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all focus-ring",
                        active
                          ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {v === "login" ? "Sign in" : "Create account"}
                    </button>
                  );
                })}
              </div>

              {activeView === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <Field
                    id="login-email"
                    label="Email"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@example.com"
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                  <Field
                    id="login-password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="••••••••••"
                    error={errors.password}
                    autoComplete="current-password"
                    required
                    rightAction={
                      <button
                        type="button"
                        onClick={() => {
                          setActiveView("forgot-password");
                          clearErrors();
                        }}
                        className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-[0.18em] focus-ring rounded-md"
                      >
                        Reset
                      </button>
                    }
                    trailing={
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-foreground/40 hover:text-foreground transition-colors focus-ring rounded-md p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  <PrimaryCta loading={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </PrimaryCta>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <Field
                    id="register-username"
                    label="Username"
                    value={registerUsername}
                    onChange={setRegisterUsername}
                    placeholder="your_handle"
                    error={errors.username}
                    autoComplete="username"
                    required
                  />
                  <Field
                    id="register-fullname"
                    label="Full name"
                    value={registerFullName}
                    onChange={setRegisterFullName}
                    placeholder="Your full name"
                    error={errors.fullName}
                    autoComplete="name"
                  />
                  <Field
                    id="register-email"
                    label="Email"
                    type="email"
                    value={registerEmail}
                    onChange={setRegisterEmail}
                    placeholder="you@example.com"
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                  <Field
                    id="register-password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={setRegisterPassword}
                    placeholder="At least 6 characters"
                    error={errors.password}
                    autoComplete="new-password"
                    required
                    trailing={
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-foreground/40 hover:text-foreground transition-colors focus-ring rounded-md p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  <PrimaryCta loading={loading}>
                    {loading ? "Creating account…" : "Create your account"}
                  </PrimaryCta>
                  <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                    By creating an account you agree to our{" "}
                    <span className="text-foreground/70 underline-offset-2 hover:underline cursor-pointer">
                      Terms
                    </span>{" "}
                    &{" "}
                    <span className="text-foreground/70 underline-offset-2 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </form>
              )}
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="w-1 h-1 rounded-full bg-primary/15" />
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Asikon — Master AI, ML & Python
          </p>
        </footer>
      </div>
    </main>
  );
};

function PrimaryCta({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span
        aria-hidden
        className="absolute -inset-1 rounded-2xl bg-primary/25 blur-lg group-hover:bg-primary/40 transition duration-500"
      />
      <span className="relative gradient-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm tracking-wide border border-white/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}

export default Auth;
