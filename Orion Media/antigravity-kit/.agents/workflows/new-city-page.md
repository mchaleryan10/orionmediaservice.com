---
description: Build a city-specific real estate landing page
---

# New City Landing Page

Creates a local SEO landing page at `/real-estate/<city>-ny.html`.

Ask me which city if I have not said. Priority order: Saratoga Springs, Albany, Troy,
Clifton Park, Schenectady.

## Build it from an existing page

Start from `/real-estate-photography.html` — it already has the correct `Service` +
`FAQPage` + `BreadcrumbList` schema, the pricing blocks, and the package-aware contact
links. Do not start from scratch.

Remember every asset path needs a `../` prefix from inside `/real-estate/`.

## Required substance

This must not be the same page with the city name swapped in — thin doorway pages get
filtered by Google and can hurt the whole domain. Each page needs at least 700 words of
genuinely city-specific content:

- Named neighborhoods and areas within that city
- Local market context (typical price points, what kind of housing stock)
- Named landmarks or districts a listing photo might feature
- Travel/coverage note specific to that city from Cohoes
- 3-5 FAQs written for that city's agents
- At least 4 portfolio images from actual shoots in or near that city, with alt text
  naming the location. If we have no real work there, say so and ask me — do not
  imply we shot somewhere we did not.

## Technical checklist

- `<title>` <= 60 chars, format: `Real Estate Photography <City> NY | Orion Media`
- Meta description <= 155 chars, mentions the city
- Canonical: `https://orionmediaservice.com/real-estate/<city>-ny.html`
- `Service` schema with `areaServed` set to that city
- `BreadcrumbList`: Home > Real Estate Photography > <City>
- `FAQPage` schema matching the visible FAQs
- Add to `sitemap.xml` with priority 0.8, `changefreq` monthly
- Link to it from `/areas-served.html` and `/real-estate-photography.html`
- Follow all standards in `.agents/rules/03-standards.md`

## Done when

- Page returns 200 and is in the sitemap
- Rich Results Test passes for Service, FAQPage, and BreadcrumbList
- Renders correctly at 390px, 1000px, and 1440px in both themes
- Content is genuinely specific to the city, not templated filler
