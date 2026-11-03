FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm install
COPY client ./client
COPY shared ./shared
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm install --omit=dev
COPY server ./server
COPY shared ./shared
COPY --from=build /app/client/dist ./client/dist
RUN mkdir -p /app/server/uploads && chown -R node:node /app
USER node
EXPOSE 5000
CMD ["npm", "start"]
