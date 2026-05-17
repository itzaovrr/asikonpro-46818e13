import { useState } from "react";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Mentor } from "@/hooks/useMentors";

const schema = z.object({
  parent_name: z.string().trim().min(2, "Name too short").max(80),
  parent_contact: z.string().trim().min(5, "Add a phone or email").max(120),
  child_name: z.string().trim().min(2).max(80),
  child_age: z.number().int().min(4, "Min age 4").max(20, "Max age 20"),
  child_grade: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(80),
  goal: z.string().trim().max(200).optional().or(z.literal("")),
  preferred_language: z.enum(["bangla", "english", "both"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mentor?: Mentor | null;
}

export function MentorWaitlistSheet({ open, onOpenChange, mentor }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    parent_name: "",
    parent_contact: "",
    child_name: "",
    child_age: "10",
    child_grade: "",
    subject: mentor?.subjects?.[0] ?? "",
    goal: "",
    preferred_language: "both" as "bangla" | "english" | "both",
    notes: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      child_age: Number(form.child_age),
    });
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await (supabase as any).from("mentor_waitlist").insert({
      user_id: user?.id ?? null,
      mentor_id: mentor?.id ?? null,
      ...parsed.data,
      child_grade: parsed.data.child_grade || null,
      goal: parsed.data.goal || null,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "You're on the waitlist 🎉",
      description: "We'll contact you as soon as a slot opens.",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>
            {mentor ? `Reserve a slot with ${mentor.name}` : "Join the mentorship waitlist"}
          </SheetTitle>
          <SheetDescription>
            1-on-1 personal teacher for your child. Coming soon — we'll reach out as we onboard tutors.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 pb-8">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="parent_name">Your name (parent / guardian)</Label>
              <Input id="parent_name" value={form.parent_name} onChange={(e) => update("parent_name", e.target.value)} maxLength={80} required />
            </div>
            <div>
              <Label htmlFor="parent_contact">Phone or email</Label>
              <Input id="parent_contact" value={form.parent_contact} onChange={(e) => update("parent_contact", e.target.value)} maxLength={120} placeholder="01XXXXXXXXX or you@email.com" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="child_name">Child's name</Label>
              <Input id="child_name" value={form.child_name} onChange={(e) => update("child_name", e.target.value)} maxLength={80} required />
            </div>
            <div>
              <Label htmlFor="child_age">Child's age</Label>
              <Input id="child_age" type="number" min={4} max={20} value={form.child_age} onChange={(e) => update("child_age", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="child_grade">Class / grade</Label>
              <Input id="child_grade" value={form.child_grade} onChange={(e) => update("child_grade", e.target.value)} placeholder="e.g. Class 7" maxLength={40} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Math, English…" maxLength={80} required />
            </div>
          </div>

          <div>
            <Label htmlFor="preferred_language">Preferred language</Label>
            <Select value={form.preferred_language} onValueChange={(v) => update("preferred_language", v)}>
              <SelectTrigger id="preferred_language"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bangla">Bangla</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="goal">Goal (optional)</Label>
            <Input id="goal" value={form.goal} onChange={(e) => update("goal", e.target.value)} placeholder="Improve grades, board prep, build confidence…" maxLength={200} />
          </div>

          <div>
            <Label htmlFor="notes">Anything else? (optional)</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} maxLength={500} rows={3} />
          </div>

          <Button type="submit" variant="premium" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Join the waitlist"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
