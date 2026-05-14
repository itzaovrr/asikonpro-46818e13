import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { ShieldAlert, Loader2, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/asikonasik" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6 py-12">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-destructive/20 to-primary/10 blur-2xl rounded-3xl" />
          <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 text-center space-y-5 shadow-2xl">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 grid place-items-center ring-1 ring-destructive/30">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Error 403
              </div>
              <h1 className="text-2xl font-bold">Admins only</h1>
              <p className="text-sm text-muted-foreground">
                The <span className="font-semibold text-foreground">asikonasik</span> control
                panel is restricted to verified administrators. If you believe this is a
                mistake, contact the platform owner.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button asChild variant="default" className="flex-1">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to app
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/auth?redirect=/asikonasik">
                  <LogIn className="h-4 w-4 mr-2" />
                  Switch account
                </Link>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Signed in as <span className="text-foreground">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
