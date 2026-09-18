# Site Architecture & Hard Constraints

## What this codebase is

A hand-written **static HTML site on GitHub Pages**. No framework, no build step,
no package.json, no bundler. 19 pages listed in `sitemap.xml`. Every page is a
complete standalone `.html` document.

Serving: GitHub Pages behind Fastly. `http -> https` and `www -> apex` both 301 correctly.
Custom domain `orionmediaservice.com` (CNAME file at repo root — do not delete it).

## Current structure

```
/index.html
/wedding-videography.html      /wedding-photography.html
/real-estate-photography.html  /drone-services.html
/matterport-tours.html         /event-commercial-video.html
/portfolio.html   /blog.html   /about.html
/areas-served.html             /contact.html
/404.html
/blog/*.html                   (6 posts)
/real-estate/*.html            (city landing pages — only one planned, NOT YET BUILT)
/images/...                    (portfolio/, about/, orion-logo.png)
/sitemap.xml  /robots.txt  /favicon.ico
```

## Hard rules — do not break these

1. **No build step.** Do not add npm, a bundler, a framework, or a static site
   generator unless explicitly asked. Every file must work opened directly from disk.
2. **Do not touch the theme toggle.** The inline script in each `<head>` reads
   `localStorage['orion-theme']` before first paint to prevent a flash. It must stay
   inline and stay first.
3. **Preserve the package-aware contact links.** Pricing buttons link to
   `contact.html?service=<slug>&pkg=<url-encoded sentence>` and the contact page
   pre-fills the form from those params. This is the site's best conversion feature.
   If you touch pricing or the contact form, verify these still populate.
4. **Preserve GA4 events.** Property `G-JR53KRE033`. Existing events:
   `generate_lead`, `phone_call`, `email_click`, `sms_click`. Keep them firing and
   keep their `event_category` / `event_label` values stable so historical data stays comparable.
5. **Preserve the Formspree endpoint.** Form posts to `https://formspree.io/f/xqedvayw`
   with a `_gotcha` honeypot field. Keep the honeypot.
6. **Preserve the sticky mobile call/text bar.** Fixed bottom bar with Call and Text
   buttons below 768px. High-value on mobile.
7. **Any change to shared chrome must be applied to all 19 pages.** Nav, footer, and
   the CSS system are currently duplicated per-page. There is no include mechanism.
   When you edit shared markup, edit every page or the site becomes inconsistent.
8. **Never invent testimonials, stats, client names, or credentials.** Every review on
   the site is a real Google review. Every stat must be defensible.

## Known technical debt (context, not permission to rewrite unasked)

- ~388 KB of CSS inlined across 19 pages; zero external stylesheets, so nothing caches.
- All images are JPEG/PNG at full resolution; no WebP/AVIF, no `width`/`height` attributes.
- 47 `<iframe>` elements site-wide, none with `loading="lazy"`.
- Heading levels skip (h1 -> h3, h2 -> h4) on 8 pages; no skip-to-content link anywhere.
