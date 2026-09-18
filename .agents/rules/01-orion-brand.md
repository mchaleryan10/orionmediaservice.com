# Orion Media Service — Brand System

Apply this to every file you create or edit in this workspace. The site is dark-first;
never introduce a light-only color or a font outside this system.

## Colors (CSS custom properties — already defined in the site)

```css
:root {
  --deep-space:   #0C0E1A;  /* page background */
  --nebula:       #1A1D3A;  /* section background */
  --constellation:#2D3065;  /* cards, components */
  --shutter-accent:#7B6FCC; /* CTAs, links, highlights */
  --warm-highlight:#E8C97A; /* badges, stats, price callouts */
  --star-glow:    #C9B8FF;  /* hover glows, secondary accent */
  --starlight:    #FFFFFF;  /* primary text */
  --star-dim:     #B8BCE0;  /* secondary text */
}
```

Light-theme equivalents (the site has a working theme toggle stored in
`localStorage` under the key `orion-theme` — do not break it):
`#F5F5F8` bg, `#EAEAF0` section, `#D8D8E4` component, `#6B5FBF` accent,
`#B8860B` gold, `#1A1A2E` text, `#4A4A6A` dim.

## Typography

Two faces only, both from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

| Role | Font | Spec |
|---|---|---|
| Hero headline | Playfair Display | clamp(2.8rem, 5vw, 5rem), regular or italic |
| Section title | Playfair Display | clamp(2rem, 3vw, 3rem), regular |
| Card heading | Outfit | 1.3rem / 600 |
| Body | Outfit | 1rem / 400 |
| Section label | Outfit | 0.75rem / 500, UPPERCASE, 0.2em letter-spacing, accent color |
| Nav | Outfit | 0.85rem / 400, 0.1em letter-spacing |
| Button / CTA | Outfit | 0.85rem / 500, UPPERCASE, 0.08em letter-spacing |
| Price | Outfit | 2.5rem / 700 |

Fallbacks: `Georgia, serif` for Playfair; `system-ui, sans-serif` for Outfit.

## Component patterns

- **Primary CTA** — bg `#7B6FCC`, hover `#6A5DBB`, white text, padding `0.8rem 2rem`,
  radius `4px`, uppercase, weight 500, `translateY(-2px)` on hover.
- **Secondary CTA** — transparent, border `1px solid rgba(255,255,255,0.1)`, text `#B8BCE0`.
- **Card** — bg `rgba(255,255,255,0.04)`, border `1px solid rgba(255,255,255,0.1)`,
  radius `12px`, hover `translateY(-4px)` + `box-shadow: 0 8px 30px rgba(123,111,204,0.3)`.
- **Nav** — 80px tall, fixed, `rgba(12,14,26,0.92)` + `backdrop-filter: blur(20px)`,
  bottom border `1px solid rgba(255,255,255,0.08)`.
- **Layout** — max width `1300px` centered; section padding `7rem 2rem` desktop,
  `5rem 1.5rem` at <=768px; grid gap `1.5rem-2rem`.
- **Radius scale** — 4px buttons/tags, 8px dropdowns, 10px photos, 12px cards, 50% logo.
- **Transitions** — 0.2s fast, 0.3s standard, 0.4s overlays. Scroll reveals:
  opacity 0->1 + translateY 40px->0 over 0.8s `cubic-bezier(0.16,1,0.3,1)`.
  Always respect `prefers-reduced-motion`.

## Voice

Confident, cinematic, approachable, professional, local, specific.

- Lead with outcomes: "Listings that sell themselves." not "We offer real estate photography."
- Hero headlines italicize one key word for drama.
- Section labels are ALL CAPS with wide letter-spacing in the accent color.
- CTAs are action-first and specific: "Book Aerial Pro", never "Submit" or "Click Here".
- Use real stats, not vague claims: "68% faster", not "much faster".
- Name Capital Region towns: Albany, Saratoga Springs, Troy, Clifton Park, Schenectady, Cohoes.
- Footer tagline: "Professional videography and photography serving the Capital Region of New York."

## Business facts (use these exact values)

- Name: **Orion Media Service** (never "Orion Media Group" — different company)
- Tagline: The Orion Difference
- Site: https://orionmediaservice.com
- Email: Ryan@OrionMediaService.com
- Phone: (518) 222-9845 / `tel:+15182229845`
- Location: Cohoes, NY 12047 — Capital Region, New York
- Services: Wedding Videography, Wedding Photography, Real Estate Photography,
  Event & Commercial Video, Drone Aerial (FAA Part 107), 3D Matterport Tours
- Credentials: A+ BBB (accredited 2023), FAA Part 107 certified, fully insured
