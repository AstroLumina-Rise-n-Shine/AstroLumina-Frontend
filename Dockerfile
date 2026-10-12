# =============================================================================
# AstroLumina Frontend - Dockerfile with Nginx
# =============================================================================

FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

# libtiff (pulled in by libgd) ships the base image with a HIGH CVE: upgrade
# just the affected base packages to their fixed releases. Removal is
# impossible (libgd/nginx link them), and a full `apk upgrade` would make
# builds non-deterministic.
RUN apk add --no-cache --upgrade tiff expat pcre2

RUN mkdir -p \
  /var/cache/nginx/client_temp \
  /var/cache/nginx/proxy_temp \
  /var/cache/nginx/fastcgi_temp \
  /var/cache/nginx/uwsgi_temp \
  /var/cache/nginx/scgi_temp

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-security-headers.conf /etc/nginx/security-headers.conf
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