import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { copy } from "@/copy/copy";
import { useTracks } from "@/hooks/useTracks";
import { useUpsertLearnerProfile, useLearnerProfile } from "@/hooks/useLearnerProfile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["goal", "level", "interests", "style", "track"] as const;
type StepKey = typeof STEPS[number];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { data: profile } = useLearnerProfile();
  const { data: tracks = [] } = useTracks();
  const upsert = useUpsertLearnerProfile();

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string>(profile?.goal ?? "");
  const [level, setLevel] = useState<string>(profile?.level ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [style, setStyle] = useState<string>(profile?.learning_style ?? "");
  const [trackId, setTrackId] = useState<string>(profile?.active_track_id ?? "");

  const key: StepKey = STEPS[step];
  const total = STEPS.length;
  const pct = ((step + 1) / total) * 100;

  const canNext = () => {
    if (key === "goal") return !!goal;
    if (key === "level") return !!level;
    if (key === "interests") return interests.length > 0;
    if (key === "style") return !!style;
    if (key === "track") return !!trackId;
    return false;
  };

  const handleNext = async () => {
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    try {
      await upsert.mutateAsync({
        goal, level, interests, learning_style: style,
        active_track_id: trackId,
        onboarded_at: new Date().toISOString(),
      });
      toast.success("You're set. Let's begin.");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save your setup");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 lg:py-10">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
          Step {step + 1} of {total}
        </p>
        <Progress value={pct} className="h-1.5" />
      </div>

      <div className="rounded-3xl glass border border-border/60 p-5 lg:p-7 min-h-[360px] flex flex-col">
        {step === 0 && (
          <Step
            title={copy.onboarding.steps.goal.title}
            subtitle={copy.onboarding.steps.goal.subtitle}
            options={copy.onboarding.steps.goal.options}
            value={goal}
            onChange={setGoal}
          />
        )}
        {step === 1 && (
          <Step
            title={copy.onboarding.steps.level.title}
            subtitle={copy.onboarding.steps.level.subtitle}
            options={copy.onboarding.steps.level.options}
            value={level}
            onChange={setLevel}
          />
        )}
        {step === 2 && (
          <Step
            title={copy.onboarding.steps.interests.title}
            subtitle={copy.onboarding.steps.interests.subtitle}
            options={copy.onboarding.steps.interests.options}
            multi
            value={interests}
            onChange={setInterests as any}
          />
        )}
        {step === 3 && (
          <Step
            title={copy.onboarding.steps.style.title}
            subtitle={copy.onboarding.steps.style.subtitle}
            options={copy.onboarding.steps.style.options}
            value={style}
            onChange={setStyle}
          />
        )}
        {step === 4 && (
          <div className="flex-1">
            <h2 className="text-xl font-bold">{copy.onboarding.steps.track.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{copy.onboarding.steps.track.subtitle}</p>
            <div className="grid gap-2">
              {tracks.map((t) => {
                const active = trackId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrackId(t.id)}
                    className={cn(
                      "text-left p-3.5 rounded-2xl border transition-all pressable",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/40 hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 grid place-items-center mt-0.5 shrink-0",
                        active ? "border-primary bg-primary" : "border-border",
                      )}>
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{t.name}</p>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            variant="premium"
            onClick={handleNext}
            disabled={!canNext() || upsert.isPending}
          >
            {step === total - 1 ? copy.onboarding.finish : "Next"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Option { value: string; label: string }

function Step({
  title, subtitle, options, value, onChange, multi,
}: {
  title: string;
  subtitle: string;
  options: readonly Option[];
  value: string | string[];
  onChange: (v: any) => void;
  multi?: boolean;
}) {
  const isSelected = (v: string) =>
    multi ? (value as string[]).includes(v) : value === v;

  const toggle = (v: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <div className="grid gap-2">
        {options.map((o) => {
          const active = isSelected(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={cn(
                "text-left px-4 py-3 rounded-2xl border transition-all pressable text-sm",
                active
                  ? "border-primary bg-primary/10 font-medium"
                  : "border-border/60 bg-card/40 hover:border-primary/40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{o.label}</span>
                {active && <Check className="h-4 w-4 text-primary shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
