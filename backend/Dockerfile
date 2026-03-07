# --- Stage 1: Builder ---
# Gunakan image Node.js untuk membangun aplikasi
FROM node:18-alpine AS builder

WORKDIR /app

# Salin file package dan install dependensi
COPY package*.json ./
RUN npm install

# Salin kode sumber
COPY . .

# --- Stage 2: Production ---
# Gunakan image Node.js yang lebih kecil untuk production
FROM node:18-alpine

# Set environment ke production
ENV NODE_ENV=production

WORKDIR /app

# Salin dependensi production dari builder stage
COPY --from=builder /app/node_modules ./node_modules
# Salin kode sumber dari builder stage
COPY --from=builder /app ./

# Ekspos port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD [ "npm", "start" ]
