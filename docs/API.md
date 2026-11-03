# API contract

Base: `/api`. JSON requests use `Content-Type: application/json`. Mutation requests must include an allowed browser `Origin`. Responses containing errors use `{ "error": "Readable message" }` and appropriate HTTP status codes. No personal enquiry data is exposed by public endpoints.

## Public

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | MongoDB readiness |
| GET | `/site` | Public settings, active services, visible albums and approved reviews |
| GET | `/events/:id` | Published album belonging to an active service |
| GET | `/faqs` | Active FAQs, ordered by display order then ID |
| POST | `/enquiries` | Validate/save enquiry and return message + optional WhatsApp URL |
| POST | `/reviews` | Validate/save a pending review |

Enquiry body fields: `name`, `phone`, `service` (MongoDB service ID), `eventDate` (YYYY-MM-DD or empty), `location`, `guests` (integer), `budget`, `message`, `consent: true`, `website: ""` (honeypot).

Review body fields: `name`, optional `service`, `rating` (integer 1-5), `comment`, `consent: true`, `website: ""`.

Client-supplied publication status, enquiry status, administrator role and database operator fields are ignored by the public validation layer.

## Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Email/password; sets HTTP-only session cookie; returns admin email and CSRF token |
| GET | `/auth/session` | Read current session and CSRF token |
| POST | `/auth/logout` | Revoke sessions and clear cookie |
| POST | `/auth/password` | Current/new password; revoke sessions after change |

Authenticated writes include `X-CSRF-Token`. Requests use credentials and same-origin hosting by default. Login has its own stricter rate limit.

## Admin

All routes below require a valid session. All writes require CSRF validation.

| Methods | Route | Purpose |
| --- | --- | --- |
| GET | `/admin/overview` | Counts and recent enquiries |
| GET, POST | `/admin/services` | Paged list / create |
| PUT, DELETE | `/admin/services/:id` | Edit / delete unreferenced service |
| GET, POST | `/admin/events` | Paged list / create album |
| PUT, DELETE | `/admin/events/:id` | Edit / delete album record |
| GET | `/admin/reviews` | Paged review moderation list |
| PATCH, DELETE | `/admin/reviews/:id` | Set status / delete |
| GET | `/admin/enquiries` | Paged private enquiry list |
| PATCH, DELETE | `/admin/enquiries/:id` | Set status / delete personal data record |
| GET, PUT | `/admin/settings` | Read / replace public website settings |
| GET, POST | `/admin/faqs` | Paged FAQ list in display order / create |
| PUT, DELETE | `/admin/faqs/:id` | Edit question, answer, visibility and order / delete |
| POST | `/admin/uploads` | Multipart `image` file; return local WebP URL |

List query: `page=1&limit=50` (maximum 100). Response: `{items,total,page,pages}`.

Review status: `pending`, `approved`, `rejected`. Enquiry status: `new`, `contacted`, `confirmed`, `closed`. "Confirmed" is a manual admin classification, not automatic confirmation from WhatsApp or a payment system.

FAQ body: `question` (5–240 characters), `answer` (5–4000 characters), `active` (boolean, default true), `sortOrder` (integer 0–9999, default 0). Lower order numbers appear first; equal orders use ID order. Public `/faqs` returns an array of `{_id,question,answer,sortOrder}` and `/site` includes the same array as `faqs`. Disabled FAQs are excluded from both responses. FAQ text is rendered as text, not interpreted as HTML. No FAQPage structured data is added.

Run `npm run seed:faqs` once when upgrading an existing database. Fresh `npm run seed` setups also include the six initial FAQs. Seeding preserves existing edits and visibility; explicitly rerunning it will recreate deleted initial entries.

## Storage model

`Admin`, `Service`, `Event`, `Review`, `Enquiry`, `Settings`, `FAQ`. Events and enquiries reference a service by ObjectId. Reviews may optionally reference a service. Public albums for hidden services are excluded. Gallery reference albums can be excluded globally from public responses.

Dates, phone format, image URLs, text lengths, array sizes, ratings and consent are validated server-side. Unknown fields are not passed through to MongoDB writes.
