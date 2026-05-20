import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Optional low-quality placeholder data-URL or tiny image. */
  placeholder?: string;
  /** When true, image is eagerly loaded (use for above-the-fold hero only). */
  eager?: boolean;
}

const DEFAULT_LQIP =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="#1a0d10"/>` +
      `<stop offset="100%" stop-color="#2a0f13"/>` +
      `</linearGradient></defs>` +
      `<rect width="40" height="40" fill="url(#g)"/>` +
      `</svg>`,
  );

/**
 * Drop-in replacement for <img> with:
 * - lazy loading + async decoding
 * - blurred low-quality placeholder until the real image paints
 * - graceful fade-in transition
 *
 * Use this anywhere a content image is shown (products, posts, avatars).
 */
export function SmartImage({
  src,
  alt = "",
  className,
  placeholder = DEFAULT_LQIP,
  eager = false,
  onLoad,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  // React DOM expects lowercase `fetchpriority` as a DOM attribute.
  const priorityAttr = { fetchpriority: eager ? "high" : "low" } as Record<string, string>;

  return (
    <img
      {...rest}
      {...priorityAttr}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      style={{
        backgroundImage: loaded ? undefined : `url(${placeholder})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...(rest.style ?? {}),
      }}
      className={cn(
        "transition-[opacity,filter] duration-500 ease-out",
        loaded ? "opacity-100 blur-0" : "opacity-90 blur-[6px]",
        className,
      )}
    />
  );
}
