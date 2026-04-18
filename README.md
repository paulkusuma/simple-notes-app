# 🚀 Simple Notes App — DevOps CI/CD Pipeline

![Build Status](https://img.shields.io/github/actions/workflow/status/USERNAME/simple-notes-app/ci-dev.yml?branch=dev)
![Docker](https://img.shields.io/badge/container-docker-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Repository ini berisi implementasi **CI/CD pipeline end-to-end untuk aplikasi containerized** menggunakan Docker dan GitHub Actions.

Fokus utama proyek ini adalah **praktik DevOps modern**, bukan pada kompleksitas aplikasinya.  
Pipeline memastikan bahwa setiap perubahan kode telah melalui proses:

- Build container image
- Unit test container
- Integration test antar service
- Security scanning
- Artifact publishing ke container registry

Pipeline ini dirancang sebagai **fondasi sebelum melanjutkan ke Continuous Deployment (CD) atau Kubernetes orchestration**.

---

# 🧰 Tech Stack

## Application
- Node.js
- Express.js
- HTML / CSS / JavaScript

## Containerization
- Docker
- Docker Compose

## CI/CD
- GitHub Actions

## Security Tools
- Trivy (Container Vulnerability Scanner)
- Gitleaks (Secret Leak Detection)
- npm audit (Dependency Vulnerability Scanner)

---

# 🏗️ CI/CD Architecture

```bash
Developer
│
│ git push
▼
GitHub Repository
│
▼
GitHub Actions CI Pipeline
│
├── Checkout Source Code
├── Build Docker Images
├── Unit Test (Container)
├── Integration Test (Docker Compose)
├── Security Scan
│ ├── Dependency Scan
│ ├── Secret Scan
│ └── Container Vulnerability Scan
│
▼
Push Docker Images
Docker Registry
│
▼
GitHub Actions (CD)
│
▼
SSH → AWS EC2
│
▼
docker-compose pull
docker-compose down
docker-compose up -d
│
▼
🚀 Application Running on AWS EC2
```

Pipeline memastikan bahwa **hanya image yang telah tervalidasi yang akan dipublish ke registry**.

---

# 📂 Project Structure

```bash
simple-notes-app
│
├── backend
│ ├── src
│ ├── package.json
│ └── Dockerfile
│
├── frontend
│ ├── index.html
│ ├── script.js
│ ├── style.css
│ └── Dockerfile
│
├── docker-compose.yml
│
└── .github
    └── workflows
        └── ci-dev.yml
        └── cd-dev.yml
```

Folder `.github/workflows` berisi konfigurasi **CI CD pipeline menggunakan GitHub Actions**.

---

# ⚙️ Prerequisites

Pastikan software berikut sudah terinstall sebelum menjalankan proyek:

- Node.js >= 18
- Docker
- Docker Compose
- Git
- AWS EC2 Instance

Cek versi:

```bash
node -v
docker -v
docker compose version
```

---

# 🛠️ Local Development Setup

Clone repository:
```bash
git clone https://github.com/USERNAME/simple-notes-app.git
cd simple-notes-app
```
Backend
```bash
cd backend
npm install
npm start
```
Server backend akan berjalan di:
```bash
http://localhost:3000
```

Frontend
```bash
cd frontend
```
Buka file:
index.html
atau jalankan server sederhana:
```bash
npx serve .
```
Frontend akan tersedia di:
http://localhost:8080

---
# 🐳 Running with Docker

Cara paling mudah menjalankan seluruh stack adalah menggunakan Docker Compose.

Build dan jalankan container:
```bash
docker compose up --build
```
Akses service:

    Frontend: http://localhost:8080

    Backend API: http://localhost:3000

Stop service:
```bash
docker compose down
```
---

🔗 API Structure
Base URL
```bash
http://localhost:3000/api
```
Endpoint Documentation
Method	Endpoint	Description
```bash
GET	/health	Backend health check
GET	/api/notes	Retrieve all notes
POST	/api/notes	Create new note
PUT	/api/notes/:id	Update note
DELETE	/api/notes/:id	Delete note
```
Example Request
Create note:
```bash
curl -X POST http://localhost:3000/api/notes \
-H "Content-Type: application/json" \
-d '{
  "title":"Belajar DevOps",
  "content":"Membuat CI/CD pipeline"
}'
```
Example response:
```bash
{
  "id": 1,
  "title": "Belajar DevOps",
  "content": "Membuat CI/CD pipeline"
}
```
---

# 🔑 Environment Variables

Aplikasi menggunakan konfigurasi environment untuk menjalankan service.

Contoh .env:
```bash
PORT=3000
NODE_ENV=development
DB_PATH=./notes.db
```
Dalam environment container, konfigurasi ini biasanya didefinisikan melalui:
- docker-compose.yml
- environment variables pada container
- CI/CD secret configuration

---

# ⚙️ CI Pipeline Stages

Pipeline dijalankan setiap ada push ke branch dev.

1️ Checkout Source Code
GitHub Actions mengambil source code terbaru dari repository.

2️⃣ Build Docker Images
Pipeline membangun container image untuk dua service:
- notes-backend
- notes-frontend
Contoh command:
```bash
docker build -t <docker-user>/notes-backend:<commit-sha> ./backend
docker build -t <docker-user>/notes-frontend:<commit-sha> ./frontend
```
Setiap image menggunakan Git commit SHA sebagai tag untuk memastikan versioning yang konsisten.

3️⃣ Unit Test (Container Level)
Container dijalankan secara individual untuk memastikan image dapat berjalan dengan benar.
Contoh:
```bash
docker run -d -p 3000:3000 notes-backend:<tag>
docker run -d -p 8080:80 notes-frontend:<tag>
```
Validasi dilakukan dengan:
- memastikan container dapat start
- memeriksa log container
- memastikan runtime environment valid

4️⃣ Integration Test (Full Stack)
Integration test dilakukan menggunakan Docker Compose.
Pipeline menjalankan seluruh stack: frontend, backend, database.
Contoh command:
```bash
docker compose up -d
```
Setelah service berjalan, pipeline menjalankan beberapa test endpoint.

Backend Health Check
```bash
docker exec notes-backend wget -qO- http://localhost:3000/health
```
Backend API Test
```bash
docker exec notes-backend wget -qO- http://localhost:3000/api/notes
```
Frontend Availability
```bash
curl -f http://localhost:8080
```
Jika salah satu test gagal, pipeline akan dihentikan.

---
# 🔐 Security Scanning

Pipeline menjalankan beberapa tahap security scanning.

## Dependency Vulnerability Scan
Dependency backend discan menggunakan:
```bash
npm audit
```
Pipeline akan gagal jika ditemukan vulnerability dengan severity tinggi.
## Secret Detection
Secret scanning dilakukan menggunakan Gitleaks.
Tool ini mendeteksi kemungkinan kebocoran: API keys, tokens, password, credentials.
## Container Vulnerability Scan
Image container discan menggunakan Trivy.

Contoh scanning command:
```bash
trivy image <image-name>
```

Scan akan memeriksa:
- OS package vulnerabilities
- language dependency vulnerabilities
- container layer vulnerabilities

Pipeline akan gagal jika ditemukan vulnerability dengan severity:
- CRITICAL
- HIGH

---

# 📦 Artifact Publishing

Jika semua tahap CI berhasil, pipeline akan mempublish Docker image ke registry.

Contoh:
```bash
docker push <docker-user>/notes-backend:<commit-sha>
docker push <docker-user>/notes-frontend:<commit-sha>
```

Image ini kemudian dapat digunakan untuk:
- staging deployment
- production deployment
- Kubernetes workloads

---
# ⚙️ CD Pipeline Stages

Pipeline Continuous Deployment (CD) bertanggung jawab untuk mendeploy aplikasi secara otomatis ke server cloud setelah pipeline CI berhasil.
Pada proyek ini, deployment dilakukan ke instance Amazon EC2 menggunakan SSH automation dari GitHub Actions.

Workflow CD:
```bash
GitHub Actions (CI Success)
│
▼
Trigger CD Workflow
│
▼
SSH ke EC2 Server
│
├── Login Docker Hub
├── Pull latest image
├── Stop container lama
├── Run container baru
│
▼
Application Live di EC2
```
Pipeline ini memastikan bahwa:
- Deployment hanya terjadi jika CI sukses
- Server selalu menggunakan image terbaru
- Deployment bersifat repeatable & otomatis

CD menggunakan event:
```bash
on:
  workflow_call:
```
Contoh pemanggilan dari CI:
```bash
jobs:
  deploy:
    needs: build
    uses: ./.github/workflows/cd-dev.yml
```

---

# 🧠 Data Persistence (IMPORTANT)

Database menggunakan Docker Volume:
```bash
volumes:
  postgres_data:
```
Data tidak hilang walaupun container dihapus
Aman saat CI/CD redeploy

---
# 🔐 GitHub Secrets (WAJIB)

Agar CD bisa berjalan, kamu harus set secrets di GitHub:
Secret Name	Deskripsi
EC2_HOST	Public IP EC2
EC2_USER	Biasanya ubuntu
EC2_SSH_KEY	Private key (tanpa .pem)
DOCKER_USER	Username Docker Hub
DOCKER_PASS	Password / Access Token

---

# 🖥️ Deployment Process (Step-by-Step)
CD akan menjalankan script berikut di server EC2:

```bash
cd ~/simple-notes-app
echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
docker-compose pull
docker-compose down
docker-compose up -d
```

Penjelasan:
1. Login Docker Hub
Agar server bisa pull image private/public terbaru
2. Pull Latest Image
docker-compose pull
Ambil image terbaru dari registry
3. Stop Container Lama
docker-compose down
Menghindari conflict & memastikan clean state
4. Start Container Baru
docker-compose up -d
Menjalankan versi terbaru aplikasi

---

# ☁️ Deployment ke AWS EC2

Setup EC2:
- Launch Ubuntu Instance
- Install Docker & Docker Compose
- Open port:
  22 (SSH)
  80 (HTTP)

Clone Project di EC2:
```bash
git clone https://github.com/USERNAME/simple-notes-app.git
cd simple-notes-app
```

Jalankan Aplikasi
```bash
docker-compose up -d
```
Akses:
```bash
http://<EC2-PUBLIC-IP>
```

---
# 🐳 Docker Compose di Server

⚠️ Penting:
Deployment menggunakan docker-compose yang ada di server EC2, bukan dari dalam image.
Artinya:
- Image hanya berisi aplikasi
- Orkestrasi tetap dikontrol oleh server

```bash
backend:
  image: <docker-user>/notes-backend:dev
frontend:
  image: <docker-user>/notes-frontend:dev
```

---
# 🔐 FILE .env DI EC2 (WAJIB ADA)
Di server EC2:
```bash
nano .env
```
Isi:
```bash
POSTGRES_DB=notesdb
POSTGRES_USER=notesuser
POSTGRES_PASSWORD=notespassword

DB_HOST=database
DB_PORT=5432
DB_NAME=notesdb
DB_USER=notesuser
DB_PASSWORD=notespassword
```

---
# 🧠 PENJELASAN PENTING
1. Compose dibaca dari EC2, bukan dari image
Yang dipakai saat deploy:
```bash
docker-compose up
```
2. Image ≠ Compose
Komponen	Fungsi
Docker image	isi aplikasi
docker-compose	cara menjalankan
3. Kenapa pakai ENV?
Supaya:
- tidak hardcode password
- bisa beda environment (dev/prod)
- aman untuk repo publik

---
# 🔮 Future Improvements

Pipeline ini dapat dikembangkan lebih lanjut dengan menambahkan:

- Multi-environment deployment (dev, staging, prod)
- Blue-Green Deployment
- Kubernetes (EKS)
- Load Balancer + HTTPS (Nginx + Certbot)
- Monitoring (Prometheus + Grafana)
- Auto rollback jika deployment gagal
---
