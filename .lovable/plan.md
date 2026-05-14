# Equalize Product Card Sizes

Cards in `ProductCarousel` already share the same width (flex-basis per breakpoint), but their **heights vary** because content is optional:
- Some products have a brand line, some don't
- Titles wrap to 1 or 2 lines
- Price row sometimes wraps (original price + "Save X%")

This makes adjacent cards look mismatched.

## Changes

**1. `src/components/carousels/ProductCarousel.tsx`**
- Add `items-stretch` to the flex track and `h-full` to each slide wrapper so every card stretches to the tallest sibling.

**2. `src/components/shop/ProductCard.tsx`**
- Make the `<article>` `h-full flex flex-col` so it fills the slide.
- Make the content `<div>` `flex-1 flex flex-col` with the price row pushed to the bottom (`mt-auto`).
- Reserve a fixed height for the brand line (render an empty placeholder when missing) so cards with/without brand align.
- Force the title to always reserve 2 lines (`min-h` matching 2 lines of its text size) so 1-line titles don't shrink the card.

Result: every card in a carousel renders at identical width **and** height, with price aligned to the bottom edge across the row.

## Out of scope
- No changes to data, copy, or `featured`/`default` variants' semantics — only visual sizing for the `compact` variant used in carousels (and harmless for others).
