import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingWizard } from "@/features/onboarding/OnboardingWizard";
import { copy } from "@/copy/copy";

export default function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/onboarding");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{copy.brand.name}</p>
        <h1 className="text-2xl font-bold mt-1">{copy.onboarding.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{copy.onboarding.subtitle}</p>
      </header>
      <OnboardingWizard />
    </div>
  );
}
