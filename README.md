# DicodingCapstone

## 💰 MONEASY — Financial Planning Application by CC25-SF006

**MONEASY** adalah aplikasi perencanaan keuangan pintar untuk membantu pengguna mengelola keuangan pribadi dengan mudah. Fitur-fitur seperti prediksi kesehatan finansial, tabungan tujuan, dan manajemen transaksi memungkinkan pengguna untuk mengambil kendali atas keuangan mereka.

---

### ✨ Fitur

- **Smart Budgeting** — Menghasilkan anggaran otomatis berdasarkan kebiasaan pengeluaran.
- **Financial Health Check** — Analisis dan visualisasi kondisi keuangan pengguna.
- **Goal Savings** — Menetapkan, melacak, dan mengelola tujuan tabungan.
- **Transaction Management** — Mencatat, mengategorikan, dan memantau pemasukan & pengeluaran.

---

### 🛠️ Teknologi yang Digunakan

**Frontend:**
- React
- Tailwind CSS

**Backend:**
- Go (Golang)
- Gin Web Framework
- GORM
- MySQL

**Machine Learning:**
- TensorFlow (Python)
- SciKit(Python)

**Algorithm:**
- Random Forest

---

### 🚀 Cara Menjalankan Proyek

#### 1. Clone Repository

```bash
git clone https://github.com/LazyPota/DicodingCapstone.git
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Akses frontend di: [http://localhost:5173](http://localhost:5173)

#### 3. Backend Setup

Pastikan MySQL aktif.

Buat file `.env` di direktori `/backend` dengan isi seperti berikut:

```ini
DB_USER=your_user
DB_PASS=your_password
DB_NAME=moneasy_db
DB_PORT=3306
```

Jalankan perintah berikut:

```bash
cd backend
go mod tidy
go run main.go
```

Backend berjalan di: [http://localhost:8080](http://localhost:8080)

#### 4. Machine Learning Setup

```bash
cd ml
pip install -r requirements.txt
python model.py
```

---

## 📘 Tentang Proyek

Proyek ini dikembangkan oleh Tim Capstone sebagai bagian dari program **Dicoding x DBS Foundation**. Aplikasi ini menunjukkan integrasi full-stack dan machine learning untuk manajemen keuangan pribadi.

## Our Team

1. 
