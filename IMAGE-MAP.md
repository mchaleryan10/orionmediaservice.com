# Orion Media Service — Image Map

This document maps every image placeholder on the site to a filename. 
To add your images: rename your photos to match these filenames and drop them in the correct folder.

Recommended image specs:
- **Hero images:** 1920x1080px, JPG, compressed to ~200-400KB
- **Gallery/portfolio photos:** 1200x800px (landscape) or 800x1200px (portrait), JPG, ~150-300KB
- **Logo:** PNG with transparent background, 200x200px minimum

---

## SITE-WIDE

| Filename | Used On | Notes |
|----------|---------|-------|
| `images/orion-logo.png` | All pages (nav + footer) | Transparent PNG, square, min 200x200px |

---

## HERO IMAGES (optional — currently CSS gradient backgrounds)

| Filename | Used On | Notes |
|----------|---------|-------|
| `images/heroes/homepage-hero.jpg` | index.html | Cinematic shot — your best work |
| `images/heroes/wedding-hero.jpg` | wedding-videography.html | Wedding ceremony or couple shot |
| `images/heroes/realestate-hero.jpg` | real-estate-photography.html | Stunning property exterior |
| `images/heroes/drone-hero.jpg` | drone-services.html | Aerial landscape or property |
| `images/heroes/event-hero.jpg` | event-commercial-video.html | Event crowd or behind-the-scenes |
| `images/heroes/matterport-hero.jpg` | matterport-tours.html | Interior with 3D tour feel |
| `images/heroes/portfolio-hero.jpg` | portfolio.html | Collage or best single shot |
| `images/heroes/about-hero.jpg` | about.html | You at work or with gear |

---

## ABOUT PAGE

| Filename | Used On | Notes |
|----------|---------|-------|
| `images/about/ryan-headshot.jpg` | about.html (bio section) | Professional headshot or working photo, portrait orientation (3:4 ratio) |

---

## REAL ESTATE PHOTOGRAPHY PAGE — Gallery (5 slots)

| Filename | Slot | Notes |
|----------|------|-------|
| `images/portfolio/real-estate/re-featured.jpg` | Featured (large) | Best RE photo — exterior or interior hero shot |
| `images/portfolio/real-estate/re-gallery-2.jpg` | Gallery slot 2 | Interior — kitchen or living room |
| `images/portfolio/real-estate/re-gallery-3.jpg` | Gallery slot 3 | Interior — different room |
| `images/portfolio/real-estate/re-gallery-4.jpg` | Gallery slot 4 | Exterior or aerial |
| `images/portfolio/real-estate/re-gallery-5.jpg` | Gallery slot 5 | Twilight or detail shot |

---

## WEDDING VIDEOGRAPHY PAGE — Gallery (5 slots)

| Filename | Slot | Notes |
|----------|------|-------|
| `images/portfolio/weddings/wedding-featured.jpg` | Featured (large) | Best wedding still — ceremony or couple |
| `images/portfolio/weddings/wedding-gallery-2.jpg` | Gallery slot 2 | Getting ready or details |
| `images/portfolio/weddings/wedding-gallery-3.jpg` | Gallery slot 3 | Ceremony moment |
| `images/portfolio/weddings/wedding-gallery-4.jpg` | Gallery slot 4 | Reception or dance |
| `images/portfolio/weddings/wedding-gallery-5.jpg` | Gallery slot 5 | Venue or portrait |

---

## DRONE PAGE — Gallery (5 slots)

| Filename | Slot | Notes |
|----------|------|-------|
| `images/portfolio/drone/drone-featured.jpg` | Featured (large) | Best aerial shot |
| `images/portfolio/drone/drone-gallery-2.jpg` | Gallery slot 2 | Real estate aerial |
| `images/portfolio/drone/drone-gallery-3.jpg` | Gallery slot 3 | Commercial property |
| `images/portfolio/drone/drone-gallery-4.jpg` | Gallery slot 4 | Event aerial |
| `images/portfolio/drone/drone-gallery-5.jpg` | Gallery slot 5 | Land/acreage aerial |

---

## EVENT & COMMERCIAL PAGE — Gallery (5 slots)

| Filename | Slot | Notes |
|----------|------|-------|
| `images/portfolio/events/event-featured.jpg` | Featured (large) | Best event or commercial still |
| `images/portfolio/events/event-gallery-2.jpg` | Gallery slot 2 | Corporate event |
| `images/portfolio/events/event-gallery-3.jpg` | Gallery slot 3 | Festival/community |
| `images/portfolio/events/event-gallery-4.jpg` | Gallery slot 4 | Brand/promo shot |
| `images/portfolio/events/event-gallery-5.jpg` | Gallery slot 5 | Sports highlight |

---

## PORTFOLIO PAGE — By Category

### Weddings (8 photo slots + 4 video slots)

| Filename | Label | Notes |
|----------|-------|-------|
| `images/portfolio/weddings/port-wedding-ceremony.jpg` | Ceremony | |
| `images/portfolio/weddings/port-wedding-firstlook.jpg` | First Look | |
| `images/portfolio/weddings/port-wedding-reception.jpg` | Reception | |
| `images/portfolio/weddings/port-wedding-details.jpg` | Details | |
| `images/portfolio/weddings/port-wedding-portraits.jpg` | Portraits | |
| `images/portfolio/weddings/port-wedding-dancefloor.jpg` | Dance Floor | |
| `images/portfolio/weddings/port-wedding-venue.jpg` | Venue | |
| `images/portfolio/weddings/port-wedding-gettingready.jpg` | Getting Ready | |

Video slots — replace placeholder with YouTube embed:
```html
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

### Real Estate (8 photo slots + 2 video slots)

| Filename | Label |
|----------|-------|
| `images/portfolio/real-estate/port-re-livingroom.jpg` | Living Room |
| `images/portfolio/real-estate/port-re-kitchen.jpg` | Kitchen |
| `images/portfolio/real-estate/port-re-exterior.jpg` | Exterior |
| `images/portfolio/real-estate/port-re-aerial.jpg` | Aerial |
| `images/portfolio/real-estate/port-re-bedroom.jpg` | Master Bedroom |
| `images/portfolio/real-estate/port-re-bathroom.jpg` | Bathroom |
| `images/portfolio/real-estate/port-re-backyard.jpg` | Backyard |
| `images/portfolio/real-estate/port-re-twilight.jpg` | Twilight |

### Events (4 photo slots + 4 video slots)

| Filename | Label |
|----------|-------|
| `images/portfolio/events/port-event-1.jpg` | Event Photo 1 |
| `images/portfolio/events/port-event-2.jpg` | Event Photo 2 |
| `images/portfolio/events/port-event-3.jpg` | Event Photo 3 |
| `images/portfolio/events/port-event-4.jpg` | Event Photo 4 |

### Drone (8 photo slots + 2 video slots)

| Filename | Label |
|----------|-------|
| `images/portfolio/drone/port-drone-residential.jpg` | Residential Aerial |
| `images/portfolio/drone/port-drone-commercial.jpg` | Commercial Property |
| `images/portfolio/drone/port-drone-farmland.jpg` | Farmland |
| `images/portfolio/drone/port-drone-downtown.jpg` | Downtown |
| `images/portfolio/drone/port-drone-lakefront.jpg` | Lakefront |
| `images/portfolio/drone/port-drone-event.jpg` | Event Aerial |
| `images/portfolio/drone/port-drone-neighborhood.jpg` | Neighborhood |
| `images/portfolio/drone/port-drone-construction.jpg` | Construction Site |

### Commercial (4 video slots only — no photo grid)

Video slots — replace with YouTube embeds.

### 3D Tours (3 Matterport cards)

Replace the `href="#"` links with your actual Matterport tour URLs.

### Artistic (12 photo slots)

| Filename | Label |
|----------|-------|
| `images/portfolio/artistic/art-landscape.jpg` | Landscape |
| `images/portfolio/artistic/art-goldenhour.jpg` | Golden Hour |
| `images/portfolio/artistic/art-abstract.jpg` | Abstract |
| `images/portfolio/artistic/art-portrait.jpg` | Portrait |
| `images/portfolio/artistic/art-nightsky.jpg` | Night Sky |
| `images/portfolio/artistic/art-texture.jpg` | Texture |
| `images/portfolio/artistic/art-street.jpg` | Street |
| `images/portfolio/artistic/art-nature.jpg` | Nature |
| `images/portfolio/artistic/art-lightshadow.jpg` | Light & Shadow |
| `images/portfolio/artistic/art-aerialart.jpg` | Aerial Art |
| `images/portfolio/artistic/art-reflection.jpg` | Reflection |
| `images/portfolio/artistic/art-minimalist.jpg` | Minimalist |

---

## HOW TO SWAP IN A REAL IMAGE

### For service page gallery placeholders:

Find this in the HTML:
```html
<div class="gallery-placeholder reveal">
  <svg>...</svg>
  <span>Label</span>
</div>
```

Replace with:
```html
<div class="gallery-placeholder reveal" style="padding:0">
  <img src="images/portfolio/real-estate/re-featured.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;border-radius:12px">
</div>
```

### For portfolio page photo grid items:

Find this:
```html
<div class="photo-grid-item" data-src="placeholder">
  <svg class="ph-icon">...</svg>
  <span class="ph-label">Label</span>
</div>
```

Replace with:
```html
<div class="photo-grid-item" data-src="images/portfolio/weddings/port-wedding-ceremony.jpg">
  <img src="images/portfolio/weddings/port-wedding-ceremony.jpg" alt="Wedding ceremony">
</div>
```

### For YouTube video embeds:

Find this:
```html
<div class="video-placeholder">
  <svg>...</svg>
  <span>Video — Placeholder</span>
</div>
```

Replace with:
```html
<div class="video-placeholder" style="padding:0">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:12px"></iframe>
</div>
```

### For the About page headshot:

Find the bio-photo div and replace with:
```html
<div class="bio-photo">
  <img src="images/about/ryan-headshot.jpg" alt="Ryan McHale - Orion Media Service">
</div>
```

### For Matterport tour links:

Find `href="#"` on each matterport-card and replace with your actual Matterport URL:
```html
<a href="https://my.matterport.com/show/?m=YOUR_TOUR_ID" class="mp-link" target="_blank">View 3D Tour →</a>
```

---

## IMAGE OPTIMIZATION TIPS

1. Use JPG for photos (not PNG) — much smaller file size
2. Compress images before uploading — use tinypng.com or squoosh.app
3. Target file sizes: heroes ~200-400KB, gallery ~100-250KB
4. Use descriptive alt text for SEO (e.g., "luxury kitchen real estate photo Albany NY")
5. Keep filenames lowercase with hyphens (no spaces or special characters)

