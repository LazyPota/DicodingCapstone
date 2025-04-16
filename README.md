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
- XGBoost

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

1. Go to backend directory
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   go mod tidy
   ```

3. Create MySQL database:
   ```sql
   CREATE DATABASE my_golang_app;
   ```

4. Create user and grant privileges:
   ```sql
   CREATE USER 'golang_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON my_golang_app.* TO 'golang_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Create `.env` file in the root folder with the following content:
   ```
   DB_DSN="username:password@tcp(localhost:3306)/urdbname?charset=utf8mb4&parseTime=True&loc=Asia%2FJakarta"
   JWT_SECRET_KEY="URSECREATKEYYASH"
   EMAIL_SENDER=your_email
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
   
   Replace `username`, `password`, and `urdbname` with values that match your database configuration.

#### 4. Machine Learning Setup
1. Go to ml-service directory
   ```
   cd backend/ml-service
   ```

2. Make virtual environment:
   ```
   python -m venv env
   ```
   
3. Using virtual environment:
   ```
   venv\Scripts\Activate.ps1
   ```

4. Install depedencies:
   ```
   pip install -r requirements.txt
   ```

5. Running the application:
   ```
   uvicorn main:app --host 127.0.0.1 --port 8001 --reload
   ```

## Running the Application

Run the application with the command:
```
go run main.go
```
   
## 📘 Tentang Proyek

Proyek ini dikembangkan oleh Tim Capstone sebagai bagian dari program **Dicoding x DBS Foundation**. Aplikasi ini menunjukkan integrasi full-stack dan machine learning untuk manajemen keuangan pribadi.

## Our Team

1. FS058D5X0081 -- Reva Rahayu
2. FS051D5Y0093 -- Habibunayka Miftah Al Rizqi
3. FS101D5Y0404 -- Fahmi Nur Yudisyah
4. FS058D5X0431 -- Trisha Aditra Perwitasari
5. MS176D5Y0601 -- Muhammad Rafli Putra Persada
6. MS176D5Y0602 -- Nurian Alyasa
