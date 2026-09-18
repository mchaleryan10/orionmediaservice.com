---
description: Convert all site images to WebP and eliminate render-blocking embeds
---

# Optimize Images and Embeds

This is the single largest performance win available. The portfolio page was ~105 MB
fully loaded at the time of the audit.

## 1. Audit current state

```bash
find images -type f \( -name "*.jpg" -o -name "*.png" \) -printf "%s\t%p\n" | sort -rn | head -30
```

Known offenders: `images/orion-logo.png` (400x400, 199 KB, loaded on all 19 pages),
`images/about/Ryan-mchale.png` (1132x1132, 2 MB), portfolio JPEGs averaging 266 KB at 2000px wide.

## 2. Generate optimized derivatives

For every image under `images/portfolio/`, produce:
- `<name>-thumb.webp` — 600px wide, quality 80
- `<name>-full.webp` — 1600px wide, quality 82
- Keep the original JPEG as the `<picture>` fallback.

Do not overwrite originals. Record the dimensions of each output — you need them for
`width`/`height` attributes.

## 3. Update the markup

Replace each `<img>` with:

```html
<picture>
  <source srcset="images/portfolio/x-thumb.webp" type="image/webp">
  <img src="images/portfolio/x.jpg" alt="DESCRIPTIVE ALT" width="600" height="400" loading="lazy" decoding="async">
</picture>
```

- The hero/LCP image must NOT have `loading="lazy"`.
- Every image needs real `width` and `height` — this removes the layout shift penalty.
- Write genuine alt text. Name the venue or town where you can; it is indexable.

## 4. Convert the logo to SVG

Trace or rebuild `orion-logo.png` as an inline SVG and replace it in the nav on all 19 pages.
Saves 199 KB per page load.

## 5. Replace iframes with click-to-load facades

All 47 iframes load eagerly. Each YouTube embed pulls ~900 KB of player JS before anyone
presses play — ~22 MB on the portfolio page alone.

For each YouTube embed, store the video ID and render:
- The YouTube thumbnail (`https://i.ytimg.com/vi/<ID>/maxresdefault.jpg`) as a static image
- An Orion-violet play button overlay, not the YouTube red one
- A click handler that swaps in the real iframe with `autoplay=1`

This also removes the "Watch on YouTube" branding that currently sends visitors off-site.
Matterport iframes just need `loading="lazy"`.

## Done when

- Portfolio page transfers under 10 MB fully scrolled, under 1.5 MB on load
- Every `<img>` has width, height, and correct lazy state
- No iframe loads before user interaction
- Every image still renders in both light and dark themes
