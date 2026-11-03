# Vercel frontend and Render API

Deploy from the repository root to Vercel. Leave **Root Directory** empty, use build command `npm run build`, and set **Output Directory** to `client/dist`. The root `vercel.json` proxies browser `/api` and `/uploads` requests to Render and serves the React app for direct routes such as `/admin` and `/gallery`.

Set `VITE_DEMO_MODE=false` and `VITE_API_URL=/api` in Vercel environment variables, then redeploy. Do not use the absolute Render API URL in the Vercel build: the same-origin proxy keeps admin cookies reliable and avoids browser CORS failures.

Deploy the existing API to Render with start command `npm run start`. Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN=https://agar-events.vercel.app`, and `TRUST_PROXY=1`. Render supplies `PORT`; do not set a fixed production port.

Render local uploads are ephemeral; use persistent object storage or a paid persistent disk before relying on uploaded files in production.
