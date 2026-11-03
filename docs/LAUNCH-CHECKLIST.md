# Live integration and launch checks

This checklist is for the user's actual Node/MongoDB environment. It is not a claim that these live checks were run during code creation.

## Local functional acceptance

1. Install dependencies, run setup, start MongoDB and seed. Confirm `/api/health` returns `{"ok":true}`.
2. Open the live website without `VITE_DEMO_MODE=true`. Confirm all six services and labelled reference albums load from MongoDB.
3. Sign in at `/admin` with the generated credentials. Try a wrong password. Refresh after successful sign-in. Sign out and confirm protected endpoints reject the old session.
4. Create a service, edit it, hide it and show it again. Verify its slug route and that public pages exclude hidden services.
5. Upload JPEG/PNG/WebP files, edit alt descriptions and publish an album. Confirm only the linked service page shows it. Reject SVG, non-image bytes and images over 8 MB.
6. Open an album, move through photos with buttons and arrow keys, and close with Escape. Check keyboard focus restoration.
7. Submit a real test enquiry with an agreed test phone number. Confirm one MongoDB record appears in Admin. Confirm all supplied fields occur in the WhatsApp draft. Press Send only when the owner is expecting the test.
8. Repeat with a popup blocker. Use the visible WhatsApp fallback link. Repeat with no configured WhatsApp number and confirm the enquiry is saved without inventing a destination.
9. Test past and invalid dates, missing consent, invalid IDs, blank required fields and oversized comments. The API must reject them.
10. Submit a review. Confirm it is NOT public before approval. Approve, reject, restore to pending and delete it. Confirm public visibility changes correctly.
11. Edit settings, hero image, subtitle, about text and footer tagline. Refresh the public site and confirm the changes.
12. Change the admin password. Confirm old sessions and the old password stop working. Sign in with the new password.
13. Test mobile navigation, tablet grids, full forms, long service names, real high-resolution images and several albums on Safari, Chrome and Firefox.

## Content and privacy

Confirm business identity, WhatsApp destination, email, Instagram and service scope with the owner. Replace all reference artwork; do not turn sample testimonials into genuine claims. Obtain image/publication consent. Finalize the privacy notice, retention policy and deletion workflow. Remove test enquiries and reviews before launch.

## Deployment

Use same-origin frontend/API hosting with HTTPS. Set production environment variables, exact allowed origin and proxy trust. Never expose MongoDB publicly without authentication/network controls. Preserve `server/uploads` on persistent storage. Back up both MongoDB and uploads. Test a restart and restore. Run the dependency audit and build after installation; commit the generated lockfile after reviewing resolved versions.

The included rate limit storage is per Node process. A multi-instance deployment needs shared rate-limit storage and coordinated session operations. For a busier public site, add anti-spam controls, monitoring and error reporting with redaction. Add MFA or a managed identity provider if required by the owner.

This project does not include payments, availability inventory, automatic WhatsApp Business messaging, SMS/email delivery, a password-reset email service, audit-trail UI, analytics or a hosting account. Do not imply that an enquiry is a paid or confirmed booking.
