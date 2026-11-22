# =============================================================================
# AstroLumina Frontend - Dockerfile with Nginx
# =============================================================================

FROM node:24.22.1-alpine3.24@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.30.7-alpine@sha256:caf4e1e032a20f9c3c5e28fc7f25ffd768ad8677b4975c54193075997b3a97e3 AS runner

# Release identifier baked per image; docker-entrypoint.sh writes it into
# env.js so Sentry events match the source maps uploaded by the CI release job.
ARG SENTRY_RELEASE=""
ENV SENTRY_RELEASE=${SENTRY_RELEASE}

# The base image ships packages with HIGH CVEs: upgrade just the affected
# base packages to their fixed releases. Removal is impossible
# (libgd/nginx link them), and a full `apk upgrade` would make builds
# non-deterministic.
#
# libx11:   CVE-2026-88806 (heap overflow via malicious X server)
# tiff:     CVE-2026-4775
# pcre2:    CVE-2026-103111
# expat:    CVE-2026-93990 (XML use-after-free)
# brotli:   CVE-2026-111497
# curl:     CVE-2026-92392 (HTTP/2 upload Use-After-Free)
# libxslt:  CVE-2026-125350, CVE-2026-87636, CVE-2026-9947 (XML use-after-free /
#           type confusion)
#
# Trivy's vuln DB knows of fixed releases newer than what `apk upgrade`
# currently pulls from the Alpine repo. If a CVE persists after the upgrade,
# it will surface in the docker-scan check and be addressed here.
RUN apk add --no-cache --upgrade tiff expat pcre2 libx11 brotli-libs curl libxslt


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