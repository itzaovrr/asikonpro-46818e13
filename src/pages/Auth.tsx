import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Loader2,
  Sparkles,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Github,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import asikonLogo from "@/assets/logo.png";
import { SEO } from "@/components/SEO";

// ---- Validation -----------------------------------------------------------
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

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AuthView = "login" | "register" | "forgot-password";

// ---- Floating-label themed input -----------------------------------------
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  trailing?: React.ReactNode;
  hint?: string;
}

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  required,
  trailing,
  hint,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const float = focused || filled;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          placeholder=" "
          className={cn(
            "peer w-full rounded-xl bg-input/60 dark:bg-input/40 border px-4 pt-5 pb-2 text-[15px] text-foreground",
            "outline-none transition-all duration-200",
            "focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]",
            error
              ? "border-destructive/60 focus:border-destructive"
              : "border-border focus:border-primary",
            trailing && "pr-12",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-200 origin-left",
            float
              ? "top-1.5 text-[10.5px] font-semibold tracking-wider uppercase text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            error && float && "text-destructive",
          )}
        >
          {label}
        </label>
        {trailing && (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-xs text-destructive ml-1 animate-fade-in">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[11px] text-muted-foreground ml-1">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

// ---- Password strength meter ---------------------------------------------
function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Strong", "Excellent"];
const STRENGTH_COLOR = [
  "bg-destructive/70",
  "bg-destructive/70",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-500",
];

// ---- Page -----------------------------------------------------------------
const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem("asikon:lastEmail") || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Smart redirect after login (preserve ?redirect=/path)
  const redirectTo = params.get("redirect") || "/";

  useEffect(() => {
    if (!authLoading && user) navigate(redirectTo, { replace: true });
  }, [user, authLoading, navigate, redirectTo]);

  const clearErrors = () => setErrors({});
  const collect = (r: z.SafeParseReturnType<any, any>) => {
    if (r.success) return false;
    const f: Record<string, string> = {};
    r.error.errors.forEach((e) => {
      if (e.path[0]) f[e.path[0] as string] = e.message;
    });
    setErrors(f);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collect(loginSchema.safeParse({ email: loginEmail, password: loginPassword }))) return;
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
          throw new Error("Please verify your email before signing in.");
        throw error;
      }
      if (rememberMe) localStorage.setItem("asikon:lastEmail", loginEmail);
      else localStorage.removeItem("asikon:lastEmail");
      toast({ title: "Welcome back!", description: "Continuing your learning journey…" });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      toast({
        title: "Sign in failed",
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
      collect(
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
          description: "Check your inbox to verify your email and unlock your learning hub.",
        });
        setActiveView("login");
        setLoginEmail(registerEmail);
      } else if (data.session) {
        toast({ title: "Welcome to Asikon!", description: "Your account is ready." });
        navigate(redirectTo, { replace: true });
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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collect(forgotSchema.safeParse({ email: forgotEmail }))) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast({ title: "Reset link sent", description: "Check your inbox." });
    } catch (err: any) {
      toast({
        title: "Couldn't send reset email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectTo}` },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({
        title: `${provider === "google" ? "Google" : "GitHub"} sign-in unavailable`,
        description:
          err.message ||
          "This provider isn't enabled yet. Use email & password or contact support.",
        variant: "destructive",
      });
      setOauthLoading(null);
    }
  };

  const pwScore = useMemo(() => passwordStrength(registerPassword), [registerPassword]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-background overflow-hidden">
      <SEO
        title="Sign in"
        description="Sign in or create your Asikon account to access AI tutoring, courses, and the learner community."
      />
      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] bg-primary/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] bg-accent/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.06) 0%, transparent 55%), radial-gradient(circle at 75% 85%, hsl(var(--accent) / 0.06) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">
        {/* ============== Brand pane (desktop only) ============== */}
        <aside className="hidden lg:flex relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-6 rounded-[36px] gradient-primary opacity-90"
          />
          <div
            aria-hidden
            className="absolute inset-6 rounded-[36px] bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-10"
          />

          <div className="relative z-10 flex items-center gap-3 text-primary-foreground">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5">
              <img src={asikonLogo} alt="Asikon" className="w-full h-full object-contain" />
            </div>
            <div>
              <p
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Asikon
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                Learn AI · Build Skills
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-8 text-primary-foreground">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium">
                <Flame className="h-3.5 w-3.5" />
                Trusted by 12,400+ learners
              </div>
              <h1
                className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your AI learning
                <br />
                journey starts here.
              </h1>
              <p className="text-base xl:text-lg text-primary-foreground/80 max-w-md leading-relaxed">
                Master ML, Python, and modern AI tools with expert-led courses,
                a 24/7 AI tutor, and a community building real projects.
              </p>
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { icon: GraduationCap, title: "Expert courses", sub: "200+ lessons" },
                { icon: Sparkles, title: "AI Tutor", sub: "Bangla + English" },
                { icon: BookOpen, title: "Prompt library", sub: "1,000+ prompts" },
                { icon: ShieldCheck, title: "Lifetime access", sub: "Yours forever" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 hover:bg-white/15 transition-all"
                >
                  <f.icon className="h-4 w-4 mb-2 opacity-90" />
                  <p className="text-sm font-semibold leading-tight">{f.title}</p>
                  <p className="text-[11px] text-primary-foreground/70">{f.sub}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center text-sm font-bold">
                  S
                </div>
                <div>
                  <p className="text-sm font-semibold">Sadia R.</p>
                  <p className="text-[11px] text-primary-foreground/70">
                    ML Engineer · Class of 2025
                  </p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/90 italic leading-relaxed">
                "The AI tutor answered my doubts at 2 a.m. before exams. Asikon
                doesn't just teach — it learns with you."
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-primary-foreground/70 text-xs">
            <p>© {new Date().getFullYear()} Asikon Technologies</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Bank-grade encryption</span>
            </div>
          </div>
        </aside>

        {/* ============== Form pane ============== */}
        <section
          className="relative flex flex-col px-5 sm:px-8 pt-[max(2rem,env(safe-area-inset-top))] lg:py-14 min-h-screen lg:items-center lg:justify-center"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="w-full max-w-[440px] mx-auto animate-fade-in flex-1 flex flex-col lg:block">
            {/* Mobile brand */}
            <div className="lg:hidden flex flex-col items-center mb-7">
              <div className="relative w-16 h-16 mb-3 group">
                <div className="absolute inset-0 rounded-[20px] rotate-3 gradient-primary shadow-[0_0_40px_hsl(var(--primary)/0.45)] group-hover:rotate-6 transition-transform duration-500" />
                <div className="absolute inset-[3px] rounded-[17px] bg-background flex items-center justify-center p-2">
                  <img src={asikonLogo} alt="Asikon" className="w-full h-full object-contain" />
                </div>
              </div>
              <h1
                className="text-2xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Asikon
              </h1>
            </div>

            {activeView === "forgot-password" ? (
              <ForgotPasswordView
                email={forgotEmail}
                setEmail={setForgotEmail}
                error={errors.email}
                loading={loading}
                sent={resetEmailSent}
                onSubmit={handleForgot}
                onBack={() => {
                  setActiveView("login");
                  setResetEmailSent(false);
                  clearErrors();
                }}
                onResend={() => setResetEmailSent(false)}
              />
            ) : (
              <>
                {/* Heading */}
                <div className="mb-7 text-center lg:text-left">
                  <h2
                    className="text-[1.75rem] lg:text-3xl font-bold tracking-tight leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeView === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1.5">
                    {activeView === "login"
                      ? "Continue your learning journey with Asikon."
                      : "Build skills with real projects, in minutes."}
                  </p>
                </div>

                {/* No tab switcher — single CTA at the bottom controls account creation */}

                {/* OAuth */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <OAuthButton
                    provider="google"
                    loading={oauthLoading === "google"}
                    onClick={() => handleOAuth("google")}
                  />
                  <OAuthButton
                    provider="github"
                    loading={oauthLoading === "github"}
                    onClick={() => handleOAuth("github")}
                  />
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                    or with email
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Forms */}
                <div key={activeView} className="animate-fade-in">
                  {activeView === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <FloatingField
                        id="login-email"
                        label="Email address"
                        type="email"
                        value={loginEmail}
                        onChange={setLoginEmail}
                        error={errors.email}
                        autoComplete="email"
                        required
                      />
                      <FloatingField
                        id="login-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={setLoginPassword}
                        error={errors.password}
                        autoComplete="current-password"
                        required
                        trailing={
                          <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg focus-ring"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                          <span className="relative">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="peer sr-only"
                            />
                            <span className="block w-4 h-4 rounded-md border border-border bg-background peer-checked:gradient-primary peer-checked:border-transparent transition-all" />
                            <CheckCircle2
                              className={cn(
                                "absolute inset-0 m-auto h-3 w-3 text-primary-foreground transition-opacity",
                                rememberMe ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </span>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                            Remember me
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveView("forgot-password");
                            setForgotEmail(loginEmail);
                            clearErrors();
                          }}
                          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-ring rounded-md"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <PrimaryCta loading={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                        {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                      </PrimaryCta>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FloatingField
                          id="register-username"
                          label="Username"
                          value={registerUsername}
                          onChange={setRegisterUsername}
                          error={errors.username}
                          autoComplete="username"
                          required
                        />
                        <FloatingField
                          id="register-fullname"
                          label="Full name"
                          value={registerFullName}
                          onChange={setRegisterFullName}
                          error={errors.fullName}
                          autoComplete="name"
                        />
                      </div>
                      <FloatingField
                        id="register-email"
                        label="Email address"
                        type="email"
                        value={registerEmail}
                        onChange={setRegisterEmail}
                        error={errors.email}
                        autoComplete="email"
                        required
                      />
                      <FloatingField
                        id="register-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={setRegisterPassword}
                        error={errors.password}
                        autoComplete="new-password"
                        required
                        trailing={
                          <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg focus-ring"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      {/* Strength meter */}
                      {registerPassword.length > 0 && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="flex gap-1.5">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors duration-300",
                                  i < pwScore ? STRENGTH_COLOR[pwScore] : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground ml-1">
                            Password strength:{" "}
                            <span className="font-semibold text-foreground">
                              {STRENGTH_LABEL[pwScore]}
                            </span>
                          </p>
                        </div>
                      )}

                      <PrimaryCta loading={loading}>
                        {loading ? "Creating account…" : "Create account"}
                        {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                      </PrimaryCta>

                      <p className="text-center text-[11px] text-muted-foreground leading-relaxed pt-1">
                        By creating an account you agree to our{" "}
                        <a className="text-foreground/80 underline underline-offset-2 hover:text-primary" href="#">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a className="text-foreground/80 underline underline-offset-2 hover:text-primary" href="#">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* Bottom-aligned switch & trust strip */}
            {activeView !== "forgot-password" && (
              <div className="mt-auto pt-10 lg:pt-12 space-y-4">
                <div className="relative">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-background text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                      {activeView === "login" ? "New here?" : "Already a member?"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView(activeView === "login" ? "register" : "login");
                    clearErrors();
                  }}
                  className={cn(
                    "w-full h-12 rounded-xl border border-border bg-card/60 backdrop-blur-sm",
                    "text-sm font-semibold text-foreground",
                    "hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 active:translate-y-0",
                    "transition-all duration-200 focus-ring",
                    "flex items-center justify-center gap-2",
                  )}
                >
                  {activeView === "login" ? "Create a free account" : "Sign in to your account"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured with bank-grade encryption
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

// ---- Sub-components -------------------------------------------------------
function PrimaryCta({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        "w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm",
        "shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)] hover:shadow-[0_14px_36px_-10px_hsl(var(--primary)/0.7)]",
        "hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        "disabled:opacity-70 disabled:hover:translate-y-0",
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {children}
    </Button>
  );
}

function OAuthButton({
  provider,
  loading,
  onClick,
}: {
  provider: "google" | "github";
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "h-11 rounded-xl border border-border bg-card hover:bg-secondary",
        "flex items-center justify-center gap-2 text-sm font-medium text-foreground",
        "transition-all hover:-translate-y-0.5 hover:border-primary/40 active:translate-y-0",
        "disabled:opacity-60 focus-ring",
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : provider === "google" ? (
        <GoogleIcon className="h-4 w-4" />
      ) : (
        <Github className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {provider === "google" ? "Google" : "GitHub"}
      </span>
      <span className="sm:hidden">{provider === "google" ? "Google" : "GitHub"}</span>
    </button>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.8 2.6 2.6 6.8 2.6 12s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.2 0-.6-.06-1.1-.16-1.6H12z"
      />
    </svg>
  );
}

function ForgotPasswordView({
  email,
  setEmail,
  error,
  loading,
  sent,
  onSubmit,
  onBack,
  onResend,
}: {
  email: string;
  setEmail: (v: string) => void;
  error?: string;
  loading: boolean;
  sent: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 focus-ring rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>

      {sent ? (
        <div className="text-center py-4 space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-primary-soft border border-primary/20 flex items-center justify-center mx-auto">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm">
              We sent a reset link to{" "}
              <strong className="text-foreground">{email}</strong>
            </p>
          </div>
          <Button variant="outline" onClick={onResend} className="rounded-xl">
            Send again
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Reset your password
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">
              Enter your email and we'll send you a secure reset link.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <FloatingField
              id="forgot-email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              error={error}
              autoComplete="email"
              required
            />
            <PrimaryCta loading={loading}>
              {loading ? "Sending…" : "Send reset link"}
              {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
            </PrimaryCta>
          </form>
        </>
      )}
    </div>
  );
}

export default Auth;
