# Ahmed Parts — Mobile Repair, Karachi

A responsive, buildless website for Ahmed Parts. Built with semantic HTML, CSS and browser JavaScript. No package installation or build step is required.

## Run

Serve the `dist` directory with any static web server. For example, run `python3 -m http.server 8080 --directory dist` and open http://localhost:8080.

## Features

- Responsive blue, navy and white design using the supplied brand artwork.
- Custom CSS 3D-style phone with pointer tilt and an illustrative before/after screen comparison.
- Service symptom cards open an accessible repair guide with four detailed tabs, keyboard navigation and an animated illustrative component assembly.
- A phone brand selector with example model suggestions. Any exact model can be typed; the suggestions are not a claim of parts availability.
- An interactive, browser-only visit checklist that can carry the checked items into a WhatsApp enquiry.
- A browser-only enquiry builder, editable message review, and WhatsApp handoff. The visitor sends the message themselves. No enquiry database or automated appointment confirmation.
- Click-to-call, Google listing link, and Maps address search.
- A dated Google review summary links to the verified Maps place page.
- The entire location illustration is a native directions link, including the background, marker, market label and arrow. A separate copy-address button provides live feedback.
- Page reading progress, active navigation, staggered section reveals, entrance animations and component transitions, all respecting reduced-motion preferences.
- Accessible native dialogs, keyboard navigation, reduced-motion support, mobile navigation and a mobile action bar.
- FAQ and privacy information reflecting the actual enquiry flow.

## Content

The supplied post is the source for the logo, phone number and shop address. Business hours, prices, affiliations, warranties and repair turnaround have not been invented. The matching Google Maps listing was checked on 4 November 2026 and showed 5.0 from 216 reviews. The website labels that figure as a dated snapshot and links to the current listing. The shop locator is explicitly schematic, and the repair photo and phone transformation are illustrative.

Phone: +92 311 3433389

Address: Sareena Mobile Market, Gate No. 12, Shop A-238, Karachi, Pakistan.

## Edit

`dist/index.html` contains the content, `dist/styles.css` and `dist/enhancements.css` the visual design, and `dist/app.js` plus `dist/enhancements.js` the interactions. Assets are in `dist/assets`. The original uploaded logo is displayed using a CSS crop of the supplied artwork, preserving its pixels. The CSS phone and repair illustrations are original code-native visuals.

## Social accounts

`dist/site-config.js` accepts confirmed Facebook, Instagram, TikTok, YouTube and LinkedIn profile URLs. Configured profiles appear in the header and footer. No Facebook or Instagram profile could be verified from the supplied post or public search, so none has been invented. WhatsApp and the supplied Google business link remain available in the footer.

## Hosting on another domain

Upload the contents of `dist` to any static host. Update the canonical URL and Open Graph URL in `dist/index.html` to your domain. No package install, build step, database or API key is required.
