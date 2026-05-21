import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="relative min-h-screen w-full bg-background flex items-center justify-center px-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full blur-[140px] bg-primary/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-[140px] bg-accent/20"
        />
        <div className="relative z-10 w-full max-w-md text-center space-y-5 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold tracking-tight text-gradient"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground">
              Apu hit a snag rendering this page. Reload to try again, or head back home.
            </p>
            {import.meta.env.DEV && this.state.error?.message && (
              <pre className="text-[11px] text-left text-destructive/80 bg-destructive/5 border border-destructive/20 rounded-lg p-3 mt-3 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={this.handleReload} className="gradient-primary text-primary-foreground">
              Reload
            </Button>
            <Button variant="secondary" onClick={this.handleHome}>
              Go home
            </Button>
          </div>
        </div>
      </main>
    );
  }
}
