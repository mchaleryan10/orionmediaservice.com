# Standards to Enforce on Every Change

Check these before considering any task done.

## Performance budget

| Page type | Budget on load | Budget fully scrolled |
|---|---|---|
| Homepage | < 1.5 MB | < 2 MB |
| Service page | < 1.5 MB | < 4 MB |
| Portfolio | < 1.5 MB | < 10 MB |

As of the Aug 2026 audit the portfolio page was ~22 MB on load and ~105 MB fully
scrolled. Treat that as the number to beat.

Rules:
- Every `<img>` gets explicit `width` and `height` attributes (prevents layout shift).
- Every `<img>` below the fold gets `loading="lazy"`. The LCP image must NOT be lazy.
- Every `<iframe>` gets `loading="lazy"`, or better, a click-to-load facade.
- Serve WebP with a JPEG fallback via `<picture>`. Two sizes: ~600px thumbnail,
  ~1600px lightbox.
- No decorative image over 200 KB. No thumbnail over 60 KB.
- The logo should be SVG, not a 199 KB PNG.

## SEO requirements for every page

- `<title>` <= 60 characters, front-loaded with service + city.
- `<meta name="description">` <= 155 characters.
- Exactly one `<h1>`. Heading levels descend without skipping.
- `<link rel="canonical">` with the absolute URL.
- Open Graph + Twitter Card tags, including a real `og:image`
  (1200x630). **Note: `/images/og-image.jpg` was a 0-byte file as of Aug 2026.**
- JSON-LD appropriate to the page type:
  - Every page: `BreadcrumbList`
  - Homepage: `LocalBusiness` (+ `aggregateRating` once real review counts are wired)
  - Service pages: `Service` + `FAQPage`
  - Blog posts: `Article`
  - Any page with video embeds: `VideoObject` per video
- Add every new page to `sitemap.xml`. Never leave a URL in the sitemap that 404s.

## Accessibility

- Visible keyboard focus state on every interactive element.
- Every form control has a `<label>` or `aria-label`.
- Every meaningful image has descriptive `alt`; decorative images get `alt=""`.
- Respect `prefers-reduced-motion` for all animation.
- Add a skip-to-content link as the first focusable element.

## Definition of done

1. Page renders correctly at 390px, 768px, 1000px, and 1440px.
   **1000px is the known break point** — the nav overflowed there before the fix.
2. Both light and dark themes render correctly.
3. No console errors.
4. Internal links resolve (no 404s).
5. Structured data validates in Google's Rich Results Test.
