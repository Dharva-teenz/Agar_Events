# Content and artwork provenance

The visual source is the user-supplied `agar_events_luxury_homepage.png` concept. The separate Meesaya Murukku mobile screenshot was a font-style reference only. No website or Instagram account was used to supply factual business details for this version.

Photograph regions were cropped from the concept into the WebP files under `client/public/media`. The full concept was NOT embedded as a website screenshot: headings, buttons, navigation, filters, service cards, forms and admin controls are real React/CSS elements.

Image names and roles:

- `hero.webp`: the gold floral wedding setting on the right side of the concept hero.
- `about.webp`: the lit floral walkway used behind the floating planning badge.
- `wedding`, `engagement`, `birthday`, `corporate`, `family`, `theme`: service-card photography.
- `couple`, `engagement-detail`, `birthday-detail`, `corporate-detail`, `theme-detail`: gallery reference crops.

These source crops are lower-resolution concept artwork, not verified client photography. Scaling a crop does not create new source detail. For public launch, use the owner's high-resolution event photographs with publication permission. The admin supports replacement directly.

Typography: Poppins from Google Fonts, with Aptos/Arial/system fallback. No font binaries are packaged. The exact original competitor font was not independently verified; Poppins is the agreed implementation family from this conversation.

Color tokens: midnight green-black `#07100c`, champagne gold `#e9c688`, ivory `#fbf9f4`, bronze `#9b632b`, pale section background `#f7f4ed`.

Intentional content differences from the generated concept:

- No fabricated "500+", "8+ years" or "100% satisfaction" business claims. The same four-part hero row uses qualitative copy and the user-provided city, Trichy.
- No invented phone number, email or Instagram handle. These are blank and editable in Admin.
- Example testimonials are explicitly marked and visible only in design mode. The live database has no seeded customer testimonials.
- Without a real story video URL, the hero offers "Explore Our Work" rather than an inactive play button. Adding a video link switches it to "Watch Our Story".
- The side-by-side concept board is implemented as one continuous responsive website: Hero -> About -> Gallery -> Services -> Why Choose -> Reviews -> Contact footer.
- The requested service-detail pages, booking form, review form and admin pages extend the same approved color and component system.

Before launch, confirm service scope and all public wording with the business owner. Do not describe the generated reference albums as completed client projects.
