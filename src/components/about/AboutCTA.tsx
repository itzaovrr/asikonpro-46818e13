import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <section className="aurora-bg relative overflow-hidden">
      <div className="container-editorial py-20 sm:py-28 lg:py-36 text-center">
        <p className="eyebrow-bar mb-4 justify-center inline-flex">Start today</p>
        <h2 className="display-1 max-w-3xl mx-auto">
          Your future self{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            starts today.
          </span>
        </h2>
        <p className="body-lg mt-5 text-muted-foreground max-w-xl mx-auto">
          One small lesson. One calm streak. That's how everything changes.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/learn">
              Begin your journey <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
