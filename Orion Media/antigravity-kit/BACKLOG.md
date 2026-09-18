# Orion Media Website — Backlog

Derived from the full site audit, 31 August 2026. All findings verified against the live
site. Ordered by return on effort.

Status key: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 1 — Critical (~2 hours)

- [ ] **og-image.jpg is a 0-byte file.** Every social share renders blank. 15 min.
- [ ] **Nav breaks between 769-1050px.** Hamburger threshold is 768px; move to 1080px. 30 min.
- [ ] **Sitemap lists a 404.** `/real-estate/saratoga-springs-ny.html`, priority 0.8,
      also linked from 3 blog posts. Build it or remove it. 1-3 hrs.
- [ ] **NAP mismatch.** Site says Cohoes; BBB says Ballston Lake. Suppresses map-pack
      ranking. Directory updates, not code. 1 hr.

## Phase 2 — Performance (~1 day)

- [ ] **Convert all 381 images to WebP** at two sizes with JPEG fallback. Zero WebP today.
- [ ] **Add width/height to every img.** None have them; causes layout shift on every page.
- [ ] **Logo to SVG.** Currently a 400x400 PNG at 199 KB, displayed ~40px, on all 19 pages.
- [ ] **Compress the About headshot.** 2 MB PNG at 1132x1132.
- [ ] **Click-to-load facades for all 47 iframes.** None are lazy. ~22 MB of player JS on
      the portfolio page before any interaction.
- [ ] **Extract shared CSS to one external stylesheet.** 388 KB inlined across 19 pages,
      re-downloaded on every page view, never cached.

Target: portfolio page from ~105 MB to under 10 MB fully scrolled.

## Phase 3 — Conversion (~1 day)

- [ ] **Surface the reviews.** Six real 5-star Google reviews sit only at
      `/about.html#reviews`. Put 2-3 on the homepage above the contact form and place the
      most relevant one on each service page (the 121-acre Realtor review on real estate;
      the July wedding drone review on weddings).
- [ ] **Add `aggregateRating` + `Review` schema.** No review markup exists anywhere. This
      is what puts stars in search results.
- [ ] **Trust line under the hero CTAs.** Nothing above the fold substantiates "premier".
      Add: 5.0 on Google · A+ BBB · FAA Part 107 Certified.
- [ ] **Replace service-card icons with photography.** Six homepage cards use generic line
      icons. We have 188 photographs. A visual business should show the work.
- [ ] **Request fresh Google reviews.** Newest review is roughly two years old.

## Phase 4 — Growth (ongoing)

- [ ] **City landing pages.** Saratoga Springs first, then Albany, Troy, Clifton Park,
      Schenectady. Use the `/new-city-page` workflow.
- [ ] **The Knot / WeddingWire / Zola listings.** The entire first page of results for
      "wedding videographer Albany NY" is directories. We appear on none of them. Couples
      shop there, not on Google. This is the single biggest wedding-channel gap and it is
      not a code task.
- [ ] **`VideoObject` schema.** 21+ YouTube embeds, no video markup. Highest-value rich
      result for a videography business.
- [ ] **Rewrite titles and meta descriptions.** 8 titles run 76-91 chars (limit ~60);
      every description runs 166-251 chars (limit ~155).
- [ ] **Thicken the homepage and portfolio.** 540 and 294 words respectively, against
      800-1000 on service pages. Add a "Why Orion" section, an FAQ block with schema, and
      real portfolio captions naming venues and towns.
- [ ] **Fix heading hierarchy on 8 pages** and add a skip-to-content link.
- [ ] **One lead magnet with email capture.** Every path currently ends at the quote form,
      so browsers who are not ready to buy are lost. A venue guide or an agent prep
      checklist would work; Formspree already handles capture.

---

## Do not regress

These are done well and should survive any refactor:

- Package-aware contact links that pre-fill the form with package and price
- Sticky mobile call/text bar with GA4 events on both
- Transparent pricing on every service page
- LocalBusiness / Service / FAQPage / BreadcrumbList / Article schema
- Clean 301s: http->https and www->apex
- The 390px mobile layout
- Six locally-focused blog posts

## Measured baselines (31 Aug 2026)

| Metric | Value |
|---|---|
| portfolio.html on load | ~22 MB |
| portfolio.html fully scrolled | ~105 MB |
| real-estate-photography.html fully scrolled | ~24.6 MB |
| about.html on load | ~2.2 MB |
| index.html on load | ~1.2 MB |
| Inline CSS across 19 pages | 388 KB |
| Images in WebP/AVIF | 0 of 381 |
| Iframes with loading="lazy" | 0 of 47 |
| Images with width/height | 0 |
| Pages with review schema | 0 |
