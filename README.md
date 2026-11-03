# Agar Events, Trichy - Luxury MERN website

A complete, editable React / Express / MongoDB codebase based on the supplied black, champagne-gold and ivory website concept. The other website screenshot was used only as a typography reference. No unrelated event business content or unverified Instagram account information was added.

## 1. See the design immediately - no installation

**Double-click `START-HERE.html`.** It contains the actual React public interface, CSS and reference images. Internal navigation uses hash routes in this standalone preview.

Alternatively, with Node installed:

```sh
npm run preview:offline
```

Open `http://127.0.0.1:4173`.

The standalone preview has working navigation, service galleries, category filters, photo lightboxes, responsive menus and WhatsApp message previews. It does NOT pretend to save enquiries, submit reviews or provide a fake admin session. It does not connect to MongoDB.

Poppins is loaded from Google Fonts when an internet connection is available. Without it, the configured system fallback is used. No font binaries are included.

## 2. Run the full MERN application

### Requirements

- Node.js 22.12 or newer in the Node 22 line (Node 22 is specified in `.nvmrc`).
- npm, supplied with Node.
- MongoDB running locally, a configured MongoDB connection, or Docker for the included local Mongo container.
- Internet access for the first npm installation.

Open a terminal inside this extracted project folder:

```sh
npm install
npm run setup
```

`setup` creates `server/.env` and `client/.env` without overwriting existing files. It generates a random signing secret and a unique initial admin password, and prints the local admin credentials. Save those credentials in a password manager. There is no shared default password.

Start MongoDB. With Docker installed:

```sh
docker compose up -d mongo
```

Without Docker, start your local MongoDB service. For a remote MongoDB database, edit `MONGO_URI` in `server/.env`. Protect database credentials and do not commit `.env`.

Then run:

```sh
npm run seed
npm run dev
```

| Surface | Local address |
| --- | --- |
| Customer website | `http://127.0.0.1:5173` |
| Admin studio | `http://127.0.0.1:5173/admin` |
| API health | `http://127.0.0.1:5000/api/health` |

Use the same hostname throughout the session. The development API allows both `127.0.0.1` and `localhost`, but browser cookies are host-specific.

The seed is idempotent. It creates the first admin, six service categories, settings and clearly labelled reference-design albums. It does not overwrite existing edits or reset an existing admin password. It does NOT create fake customer reviews, contact details or numerical business claims.

## 3. Activate the real business details

In **Admin -> Website Settings**, enter the owner's verified WhatsApp number including country code, phone, email, Instagram profile and address. The default WhatsApp number, phone, email and Instagram are intentionally blank because they were not verified.

In **Admin -> Services**, confirm the six categories with the owner, edit descriptions and change cover images. Services can be hidden instead of deleted. A service with linked events, enquiries or reviews cannot be deleted accidentally.

In **Admin -> Event Albums**, add each real event, select its related service, upload photos and provide descriptions. Uncheck "Reference artwork" only for genuine client-owned work with permission to publish. Use "Featured first" to prioritise homepage albums. The homepage shows up to five albums; the gallery shows up to 200 published albums.

Hide all reference albums in Settings or remove them after real photographs are available. The supplied photos are crops from the approved generated concept, not verified Agar Events client photographs. Their source resolution is limited; replace them with full-resolution originals before launch for the sharpest large-screen result.

## 4. Customer pages and flows

- `/`: hero, About, gallery filters, six services, reasons to choose the business, testimonials and contact footer.
- `/about`: brand introduction and planning process.
- `/services`: all available services.
- `/services/:slug`: only albums linked to that service, its description and an enquiry CTA.
- `/gallery`: service-category filtering.
- `/events/:id`: one event album with keyboard-accessible photo viewer.
- `/contact?service=weddings`: preselected service enquiry form.
- `/reviews`: approved customer reviews and moderated submission form.
- `/privacy`: draft website data-use notice to confirm with the owner before launch.
- `/admin`: protected admin studio.

### WhatsApp enquiries

1. The customer enters name, phone, service, date, location, guest count, optional budget and requirements.
2. The Express API validates and saves the enquiry to MongoDB.
3. The server builds the WhatsApp message from the saved details and current configured business number.
4. The frontend opens WhatsApp if a popup is permitted. A visible "Open WhatsApp & Send" link is also provided as a reliable fallback.
5. **The customer still has to press Send in WhatsApp.** The site does not automatically send messages, verify delivery or confirm a booking.

When WhatsApp is not configured, the enquiry is still saved, the team sees it in Admin, and the customer is explicitly told that WhatsApp is not configured. No example number is used as a real destination.

### Customer reviews

New reviews always enter `pending`. Only `approved` reviews appear publicly. Admin can approve, reject, unpublish or delete reviews. The sample review cards exist only in the explicit design preview; they are not seeded into the live database.

## 5. Admin features

Overview; service creation, editing and visibility; event albums; multi-photo file upload; alternative HTTPS image URLs; review moderation; enquiry status tracking and deletion; website settings; password change and sign-out.

Authentication uses an HTTP-only cookie, an 8-hour signed session, server-side admin lookup, revocable session version and CSRF token. Password change and sign-out invalidate existing sessions. Protected writes check the CSRF token and request origin. Session tokens are not kept in localStorage or sessionStorage.

Image uploads are limited to 8 MB, checked by an actual image decoder, resized without enlarging, converted to WebP and stored under random filenames. SVG and executable file uploads are not accepted. Uploaded images need a persistent disk volume on the server.

Removing a photograph from an album or deleting an album does not automatically erase the underlying uploaded file, because images can be reused. Permanently remove unreferenced files from the upload volume when handling media-removal requests. Customer enquiry records can be deleted from Admin.

## 6. Build and run as one Node application

```sh
npm run build
npm start
```

Express serves `client/dist` and `/api` from port 5000. In a local built-app test, update `CLIENT_ORIGIN` in `server/.env` to include `http://127.0.0.1:5000` and restart the API so forms and sign-in are accepted.

For a local all-in-Docker test:

```sh
npm run setup
docker compose --profile full up --build -d
docker compose --profile full exec app npm run seed
```

Open `http://127.0.0.1:5000`. This compose file is intentionally local-only, with ports bound to the loopback interface. It is not a public production deployment configuration.

Before public deployment, use HTTPS, set `NODE_ENV=production`, set `CLIENT_ORIGIN` to the exact HTTPS website origin, provide a strong secret, secure MongoDB, configure proxy trust correctly, persist and back up uploads and database data, and review the privacy notice with the owner. Same-origin frontend/API hosting is the default architecture; cross-site hosting needs a deliberate cookie/CORS design.

The built `preview/` folder and `START-HERE.html` are read-only snapshots, not your production build. Source edits should be developed through Vite and compiled with `npm run build`.

## 7. Tests and verification boundary

```sh
npm test
npm run check
npm run build
```

`npm test` runs dependency-free Node tests for validation, URL safety, dates, consent, service relationships and complete WhatsApp message encoding. `npm run check` parses the JavaScript files; Vite validates the actual JSX/build dependency graph after dependencies are installed.

During creation, 57 validation tests and JavaScript syntax checks passed. The actual React UI was also transpiled and exercised in Chromium with the bundled React 18.2 runtime. Browser checks covered desktop/mobile layouts, public routes, service filtering, photo navigation, message preview and honest preview-mode submission behaviour.

The creation environment could not download npm packages or run MongoDB. Therefore a fresh npm/Vite build, live Express/MongoDB integration, deployment, real uploads through the API and real WhatsApp delivery were NOT verified there. Local Chromium navigation was also restricted, so browser QA used the self-contained application document rather than a live localhost page. Poppins delivery was unavailable in that offline QA run; its system fallback was rendered.

Run the full setup and live integration checks in `docs/LAUNCH-CHECKLIST.md` before sharing the website with customers. No production-readiness certification or pixel-perfect-font claim is implied.

## Project structure

```text
client/src/            React public pages, admin screens, components and styles
client/public/media/   Reference photographs from the approved design
server/src/            Express routes, MongoDB models, authentication and seed
server/uploads/        Uploaded files; ignored by Git
shared/                Default copy, pure validators and WhatsApp helper
scripts/               Setup, development and no-install preview commands
tests/                 Automated validation and message tests
preview/               Precompiled read-only design preview
START-HERE.html        Self-contained design preview; double-click to open
docs/                  API contract, content notes and launch checklist
```
