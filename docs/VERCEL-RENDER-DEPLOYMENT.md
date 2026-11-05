# Vercel frontend and Render API

Deploy from the repository root to Vercel. Leave **Root Directory** empty, use build command `npm run build`, and set **Output Directory** to `client/dist`. The root `vercel.json` proxies browser `/api` and `/uploads` requests to Render and serves the React app for direct routes such as `/admin` and `/gallery`.

If the Vercel project must keep **Root Directory** set to `client`, Vercel reads `client/vercel.json` instead. Keep the framework as **Vite**, use build command `npm run build`, and set **Output Directory** to `dist` (relative to `client`). The client-level rewrite file preserves the Render `/api` and legacy `/uploads` proxies and adds the SPA fallback for direct routes.

Set `VITE_DEMO_MODE=false` and `VITE_API_URL=/api` in Vercel environment variables, then redeploy. Do not use the absolute Render API URL in the Vercel build: the same-origin proxy keeps admin cookies reliable and avoids browser CORS failures.

Deploy the existing API to Render with start command `npm run start`. Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN=https://agar-events.vercel.app`, and `TRUST_PROXY=1`. Render supplies `PORT`; do not set a fixed production port.

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` only in Render. With those variables set, new admin image uploads are persisted in Cloudinary and their HTTPS URLs are stored in MongoDB. Legacy `/uploads/...` references remain unchanged; reupload any that are already missing. Render local uploads are only a development fallback.

After adding the Cloudinary variables to a machine that still has a `server/uploads` folder, first review `npm run migrate:media -- --dry-run` from `server`, then run `npm run migrate:media -- --apply`. The migration only changes records for files it can actually read. It reports missing legacy files and leaves those database references untouched, so an administrator can replace them using the existing image uploader. It never deletes local or Cloudinary files.
