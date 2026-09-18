---
description: Fix the four critical defects found in the Aug 2026 site audit
---

# Fix Critical Bugs

Work through these in order. Each is a confirmed defect verified against the live site.
Commit after each one so they can be reverted independently.

## 1. Replace the 0-byte Open Graph image

`/images/og-image.jpg` returns HTTP 200 with content-length 0. Every page references it,
so every social share renders blank.

- Confirm: `curl -sI https://orionmediaservice.com/images/og-image.jpg | grep -i content-length`
- Ask me for a hero frame if one is not already in `/images/`.
- Produce a 1200x630 JPEG under 300 KB with the Orion logo and
  "Videography & Photography · Capital Region NY".
- Save to `/images/og-image.jpg`.
- Verify every page's `og:image` and `twitter:image` point at the absolute URL
  `https://orionmediaservice.com/images/og-image.jpg`.
- After deploy, re-scrape at developers.facebook.com/tools/debug to clear the cached blank.

## 2. Fix the navigation breakpoint

The hamburger only activates at `max-width: 768px`, so between 769px and ~1050px the full
desktop nav overflows: the logo wraps into the Services link and the phone number breaks
across three lines.

- In every page, find the `@media (max-width: 768px)` block containing
  `.nav-links { display: none; }` and `.nav-toggle { display: flex; }`.
- Change that breakpoint to `1080px`. There is a second `@media (max-width: 768px)` block
  for `.nav-has-dropdown` — change it to match.
- Verify at 769px, 900px, 1000px, and 1079px that the hamburger is showing and nothing wraps.
- Verify at 1081px the desktop nav fits on one line.

## 3. Resolve the Saratoga Springs 404

`/real-estate/saratoga-springs-ny.html` is in `sitemap.xml` at priority 0.8 and is linked
from three blog posts, but returns 404.

Preferred: **build the page** — see the `/new-city-page` workflow. Saratoga is the
highest-value market and "real estate photography Saratoga Springs" is a named target keyword.

Fallback if I say not to build it yet: remove the `<url>` block from `sitemap.xml` and
replace the three blog links with links to `/real-estate-photography.html`.

## 4. Align the business address

The site and its `LocalBusiness` schema say Cohoes, NY 12047. The BBB profile says
10 Colonial Ct, Ballston Lake, NY 12019.

This one is not a code fix — report it to me and I will update the directory listings.
Confirm the site itself uses Cohoes consistently in schema, footer, and contact page.

## Done when

- `curl -sI .../images/og-image.jpg` shows a non-zero content-length
- No wrapped or overlapping nav at any width from 320px to 1920px
- No URL in `sitemap.xml` returns anything but 200
- `grep -rn "Ballston" .` returns nothing
