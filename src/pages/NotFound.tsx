import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Compass } from "lucide-react";
import asikonLogo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen w-full bg-background flex items-center justify-center px-6 overflow-hidden">
      <Helmet>
        <title>Page not found — Asikon</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] bg-primary/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] bg-accent/20"
      />

      <div className="relative z-10 w-full max-w-md text-center animate-fade-in">
        <div className="relative w-20 h-20 mx-auto mb-6 group">
          <div className="absolute inset-0 rounded-[24px] rotate-3 gradient-primary shadow-[0_0_50px_hsl(var(--primary)/0.5)] group-hover:rotate-6 transition-transform duration-500" />
          <div className="absolute inset-[3px] rounded-[21px] bg-background flex items-center justify-center p-3">
            <img src={asikonLogo} alt="Asikon" className="w-full h-full object-contain" />
          </div>
        </div>

        <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 backdrop-blur border border-border text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground mb-4">
          <Sparkles className="h-3 w-3 text-primary" />
          404 · Lost in space
        </p>

        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground mb-7 max-w-sm mx-auto leading-relaxed">
          This page wandered off. Let's get you back to learning — Apu is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild className="gradient-primary text-primary-foreground h-11 px-6">
            <Link to="/">
              <Home className="h-4 w-4 mr-1.5" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-11 px-6">
            <Link to="/learn">
              <Compass className="h-4 w-4 mr-1.5" />
              Ask Apu
            </Link>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground/70 mt-8 font-mono break-all">
          {location.pathname}
        </p>
      </div>
    </main>
  );
};

export default NotFound;
