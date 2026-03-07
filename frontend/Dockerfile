# --- Stage 1: Builder ---
# Gunakan image alpine yang ringan untuk menyiapkan file statis
FROM alpine:latest AS builder

WORKDIR /app

# Salin semua file dari folder public
COPY public/ ./

# --- Stage 2: Production ---
# Gunakan image Nginx yang ringan
FROM nginx:alpine

# Salin file statis dari builder stage ke direktori Nginx
COPY --from=builder /app /usr/share/nginx/html

# Salin konfigurasi Nginx kustom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ekspos port 80
EXPOSE 80

# Nginx akan otomatis dijalankan
