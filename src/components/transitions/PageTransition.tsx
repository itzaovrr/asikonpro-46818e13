import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [location.pathname, children]);

  return (
    // NOTE: Do NOT use `transform` / `translate-*` here. A transformed ancestor
    // becomes the containing block for `position: fixed` descendants (the
    // desktop sidebar), which would make them scroll with the page.
    <div
      className={cn(
        "transition-opacity duration-300 ease-out",
        isAnimating ? "opacity-0" : "opacity-100"
      )}
    >
      {displayChildren}
    </div>
  );
}
