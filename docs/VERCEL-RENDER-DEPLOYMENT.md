# Vercel frontend and Render API

Deploy `client` to Vercel with build command `npm run build` and output directory `dist`.
Set `VITE_DEMO_MODE=false` and `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api` in Vercel environment variables, then redeploy.

Deploy the `server` workspace to Render with start command `npm run start`. Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app`, and `TRUST_PROXY=1`.

Do not set `VITE_API_URL=/api` for the Vercel build. Render local uploads are ephemeral; use persistent object storage before relying on uploaded files in production.
