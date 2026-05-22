import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/db";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { ExternalLink, ShieldCheck, ScrollText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Setting { key: string; value: any }

const TOGGLES = [
  { key: "maintenance_mode", label: "Maintenance mode", desc: "Show a maintenance banner across the app." },
  { key: "cod_enabled", label: "Cash on delivery", desc: "Allow COD as a checkout payment method." },
  { key: "trust_strip_visible", label: "Trust strip", desc: "Show the COD / Made-in-BD trust strip." },
];

export default function AdminSettings() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { roles, isSuperAdmin } = useIsAdmin();
  const [coinGrant, setCoinGrant] = useState("100");
  const [adminEmail, setAdminEmail] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("key, value");
      return (data ?? []) as Setting[];
    },
  });

  useEffect(() => {
    const cg = settings?.find((s) => s.key === "default_coin_grant");
    if (cg) setCoinGrant(String(cg.value));
  }, [settings]);

  const getValue = (key: string, fallback: any = false) =>
    settings?.find((s) => s.key === key)?.value ?? fallback;

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app-settings"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addAdmin = useMutation({
    mutationFn: async (email: string) => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", email.split("@")[0])
        .limit(1);
      if (error) throw error;
      if (!profiles?.length) throw new Error("User not found by username. Ask them to sign up first.");
      const { error: insErr } = await supabase
        .from("user_roles")
        .insert({ user_id: profiles[0].id, role: "admin" as any });
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      toast.success("Admin added");
      setAdminEmail("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <SectionHeader eyebrow="Configuration" title="Settings" subtitle="Platform-wide controls." />

      <Reveal>
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Your access</h3>
          </div>
          <div className="text-sm text-muted-foreground">Signed in as <span className="font-mono text-foreground">{user?.email}</span></div>
          <div className="text-sm">Roles: {roles.join(", ") || "—"}</div>
          {isSuperAdmin && <div className="text-xs text-primary">Super Admin — full platform privileges.</div>}
        </div>
      </Reveal>

      <Reveal>
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold">Platform toggles</h3>
          <div className="space-y-3">
            {TOGGLES.map((t) => (
              <div key={t.key} className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-0">
                <div>
                  <div className="font-medium text-sm">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
                <Switch
                  checked={!!getValue(t.key, false)}
                  onCheckedChange={(v) => updateSetting.mutate({ key: t.key, value: v })}
                />
              </div>
            ))}
            <div className="flex items-end gap-2 pt-1">
              <div className="flex-1 space-y-1.5">
                <Label>Default coin grant on signup</Label>
                <Input type="number" value={coinGrant} onChange={(e) => setCoinGrant(e.target.value)} className="bg-background/60" />
              </div>
              <Button onClick={() => updateSetting.mutate({ key: "default_coin_grant", value: Number(coinGrant) })}>Save</Button>
            </div>
          </div>
        </div>
      </Reveal>

      {isSuperAdmin && (
        <Reveal>
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold">Add admin by username</h3>
            <p className="text-xs text-muted-foreground">User must already have an account. Use their @username (e.g. <span className="font-mono">asikon.edu</span>).</p>
            <div className="flex gap-2">
              <Input placeholder="username" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="bg-background/60" />
              <Button variant="premium" onClick={() => adminEmail && addAdmin.mutate(adminEmail)} disabled={addAdmin.isPending}>
                Promote to admin
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="glass rounded-2xl p-5 space-y-2">
          <h3 className="font-semibold">External dashboards</h3>
          <ul className="text-sm space-y-1">
            <li>
              <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"
                href="https://supabase.com/dashboard/project/tdbqeecjvitorxamzlok/auth/users">
                Auth users <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"
                href="https://supabase.com/dashboard/project/tdbqeecjvitorxamzlok/sql/new">
                SQL editor <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"
                href="https://supabase.com/dashboard/project/tdbqeecjvitorxamzlok/storage/buckets">
                Storage buckets <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
