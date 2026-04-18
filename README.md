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
# ⚙️ CI Pipeline Stages

Pipeline CD berjalan otomatis setiap push ke branch dev

Workflow CD:

---
🧠 Data Persistence (IMPORTANT)

Database menggunakan Docker Volume:
```bash
volumes:
  postgres_data:
```
Data tidak hilang walaupun container dihapus
Aman saat CI/CD redeploy

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
# Docker Compose EC2


---
# 🔮 Future Improvements

Pipeline ini dapat dikembangkan lebih lanjut dengan menambahkan:
- Continuous Deployment (CD)
- Automated deployment ke server
- Kubernetes orchestration
- Helm chart
- GitOps workflow
- Monitoring dan observability
- Automated rollback
---
