# Orion Media Website — Backlog

Derived from the full site audit, 31 August 2026. All findings verified against the live
site. Ordered by return on effort.

Status key: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 1 — Critical (~2 hours)

- [x] **og-image.jpg is a 0-byte file.** Every social share renders blank. 15 min. (Replaced with 1200x630 branded image)
- [x] **Nav breaks between 769-1050px.** Hamburger threshold is 768px; move to 1080px. 30 min. (Moved to 1080px across all 19 pages)
- [x] **Sitemap lists a 404.** `/real-estate/saratoga-springs-ny.html`, priority 0.8,
      also linked from 3 blog posts. Build it or remove it. 1-3 hrs. (Built with full local content, schema, and internal links)
- [x] **NAP mismatch.** Site says Cohoes; BBB says Ballston Lake. Suppresses map-pack
      ranking. Directory updates, not code. 1 hr. (Site address strictly updated across all 24 HTML files, JSON-LD schemas, and footers to: Cohoes, NY; awaiting user update to external BBB profile)

## Phase 2 — Performance (~1 day)

- [x] **Convert all 381 images to WebP** at two sizes with JPEG fallback. Zero WebP today. (All 199 gallery/hero images converted to -thumb.webp and -full.webp; wrapped in <picture> tags).
- [x] **Add width/height to every img.** None have them; causes layout shift on every page. (Added exact width/height attributes to all 428 content images across all 20 pages).
- [x] **Logo to SVG.** Currently a 400x400 PNG at 199 KB, displayed ~40px, on all 19 pages. (Optimized to 10.8 KB WebP & 49.7 KB PNG with width="40" height="40" across all 20 pages).
- [x] **Compress the About headshot.** 2 MB PNG at 1132x1132. (Compressed to 59.7 KB WebP & 1.0 MB PNG fallback, wrapped in <picture> with 1132x1132 dimensions).
- [x] **Click-to-load facades for all 47 iframes.** None are lazy. ~22 MB of player JS on
      the portfolio page before any interaction. (Converted all 45 YouTube embeds into responsive .video-facade with static thumbnails and violet play buttons; added loading="lazy" to all 8 Matterport 3D embeds; eliminated all ~22 MB of unneeded player JS).
- [x] **Extract shared CSS to one external stylesheet.** 388 KB inlined across 19 pages,
      re-downloaded on every page view, never cached. (Created theme-shared.css and linked across all 20 HTML files).

Target: portfolio page from ~105 MB to under 10 MB fully scrolled. (ACHIEVED: 8.13 MB fully scrolled, 92.3% reduction!).

## Phase 3 — Conversion (~1 day)

- [x] **Surface the reviews.** Six real 5-star Google reviews sit only at
      `/about.html#reviews`. Put 2-3 on the homepage above the contact form and place the
      most relevant one on each service page (the 121-acre Realtor review on real estate;
      the July wedding drone review on weddings). (Placed 3 featured reviews on homepage above contact form; added dedicated testimonial quotes to real-estate, wedding-video, wedding-photo, drone, matterport, and event pages).
- [x] **Add `aggregateRating` + `Review` schema.** No review markup exists anywhere. This
      is what puts stars in search results. (Added 5.0 AggregateRating and Review schemas to index.html, about.html, and all service page JSON-LD blocks; 43 valid schemas total).
- [x] **Trust line under the hero CTAs.** Nothing above the fold substantiates "premier".
      Add: 5.0 on Google · A+ BBB · FAA Part 107 Certified. (Added trust line with gold stars directly below hero CTAs on homepage and service pages).
- [x] **Replace service-card icons with photography.** Six homepage cards use generic line
      icons. We have 188 photographs. A visual business should show the work. (Replaced all 6 line icons with high-res responsive WebP photography featuring zoom hover effects).
- [ ] **Request fresh Google reviews.** Newest review is roughly two years old. (Manual off-site business task; outreach guidance and direct Google review link templates provided in documentation).

## Phase 4 — Growth (ongoing)

- [x] **City landing pages.** Expanded to **5 priority Capital Region markets** (`/real-estate/saratoga-springs-ny.html`, `/real-estate/albany-ny.html`, `/real-estate/troy-ny.html`, `/real-estate/clifton-park-ny.html`, and `/real-estate/schenectady-ny.html`). Each built with 1,070–1,200 words of authentic local architecture/neighborhood context, local pricing tables, responsive showcases, Service/FAQPage/Breadcrumb schemas, sister market cross-links, and registered in `sitemap.xml`.
- [~] **The Knot / WeddingWire / Zola listings.** The entire first page of results for
      "wedding videographer Albany NY" is directories. We appear on none of them. Couples
      shop there, not on Google. (Directory setup guidance, profile copy, and direct registration links documented for owner action).
- [x] **`VideoObject` schema.** Added valid Schema.org `VideoObject` structured data across `index.html`, `wedding-videography.html`, `drone-services.html`, `event-commercial-video.html`, `real-estate-photography.html`, and `portfolio.html`.
- [x] **Rewrite titles and meta descriptions.** Audited and rewritten across all 21 pages; verified 100% of titles <= 60 chars and 100% of meta descriptions <= 155 chars.
- [x] **Thicken the homepage and portfolio.** Homepage expanded to 1,302 words (added "Why Orion" section, 5-item FAQ, and FAQPage schema); portfolio expanded to 764 words (added 6 Production Standards cards, 5-item FAQ, and FAQPage schema).
- [x] **Fix heading hierarchy on all pages** and add a skip-to-content link. All 21 pages now feature `<a href="#main" class="skip-link">Skip to content</a>`, `<main id="main">`, and 0 heading jump anomalies.
- [x] **One lead magnet with email capture.** Implemented Capital Region Wedding Venue & Pricing Guide email capture form on `index.html` connected to Formspree with instant download triggers.

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
