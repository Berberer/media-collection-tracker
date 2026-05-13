FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run ng build --configuration=production

FROM ghcr.io/muchobien/pocketbase:latest
RUN apk add --no-cache curl
EXPOSE 8090
COPY pb_migrations /pb_migrations
COPY --from=builder /app/dist/media-collection-tracker/browser /pb_public
