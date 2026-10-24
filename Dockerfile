# =============================================================================
# AstroLumina Frontend - Dockerfile with Nginx
# =============================================================================

FROM node:24.22.1-alpine3.24 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.30.6-alpine AS runner

# The base image ships packages with HIGH CVEs: upgrade just the affected
# base packages to their fixed releases. Removal is impossible
# (libgd/nginx link them), and a full `apk upgrade` would make builds
# non-deterministic.
#
# libx11: CVE-2026-88806 (heap overflow via malicious X server), fixed in
# 1.8.14-r0. brotli-libs: CVE-2026-111497, fixed in 1.2.1-r0.
RUN apk add --no-cache --upgrade tiff expat pcre2 libx11 brotli-libs

RUN mkdir -p \
  /var/cache/nginx/client_temp \
  /var/cache/nginx/proxy_temp \
  /var/cache/nginx/fastcgi_temp \
  /var/cache/nginx/uwsgi_temp \
  /var/cache/nginx/scgi_temp

COPY nginx.conf /etc/nginx/nginx.conf
# The CSP in this file contains the same __PLACEHOLDER__ tokens as index.html.
# It is copied to /var/cache/nginx (writable by the unprivileged nginx user,
# unlike /etc/nginx) so docker-entrypoint.sh can substitute the real origins
# at container start.
COPY nginx-security-headers.conf /var/cache/nginx/security-headers.conf
COPY docker-entrypoint.sh /docker-entrypoint-astrolumina.sh
RUN chmod +x /docker-entrypoint-astrolumina.sh \
  && rm -f /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx \
  /usr/share/nginx/html \
  /var/cache/nginx \
  /var/log/nginx
EXPOSE 8080

# Run as the unprivileged nginx user (fixes the missing-USER findings). The
# listen port moved to 8080 for the same reason: non-root cannot bind 80.
USER nginx

CMD ["/docker-entrypoint-astrolumina.sh"]