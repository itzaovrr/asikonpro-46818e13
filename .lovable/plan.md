## Use ASIKON logo as the AI tab icon in BottomNav

Replace the lucide `Sparkles` icon for the AI tab with the user's ASIKON SVG logo.

### Steps

1. Copy `user-uploads://asikon-2.svg` to `src/assets/icons/asikon-mark.svg` (kept as a raw asset — the SVG is 237 lines with complex paths/gradients, so inlining as JSX is impractical).
2. In `src/components/layout/BottomNav.tsx`:
   - Remove the `Sparkles` import from lucide-react.
   - Import the SVG as a URL: `import asikonMark from "@/assets/icons/asikon-mark.svg";`
   - Create a small `AsikonIcon` component matching the `IconComponent` signature that renders `<img src={asikonMark} … />` with the same `h-[24px] w-[24px]` sizing as the other icons. Use `aria-hidden`.
   - Since the logo is a full-color brand mark (not a stroke icon), use the same image for both `iconOutline` and `iconFill` for the AI tab, and apply an opacity shift on inactive (`opacity-60`) and full opacity on active to convey selection — keeps it consistent with the outline/fill pattern visually.
   - Tab id `"ai"` keeps its label and route (`/learn`); only the icon changes.

### Out of scope

- Other tab icons, header, sidebar, route map, AI page content.
- Recoloring the logo (preserves brand colors from the SVG).
