# 🛠️ Panduan Konfigurasi OpenPasar

Setelah Anda berhasil mendepoloy OpenPasar (API dan Frontend), langkah berikutnya adalah melakukan **konfigurasi awal** agar website Anda berfungsi dengan baik.

Saat pertama kali membuka halaman admin, Anda akan melihat form konfigurasi seperti ini:

<img width="842" height="988" alt="image" src="https://github.com/user-attachments/assets/2214b360-6b1b-4b40-ad57-3ff303db2616" />


> Konfigurasi ini hanya perlu dilakukan **sekali di awal**, namun bisa diubah kapan saja melalui menu pengaturan admin.

---

## 📌 1. Admin

### **Email**
Masukkan email yang akan menjadi **email utama administrator**.  
Jika email yang Anda gunakan untuk login sama dengan email ini, maka **Anda adalah admin**. Selain itu Anda akan dianggap pengguna biasa.

### **No. WhatsApp**
Masukkan nomor WhatsApp yang akan ditampilkan kepada pengguna jika mereka membutuhkan bantuan.

---

## 📌 2. Platform

### **Mode**
Terdapat dua mode:

- **Marketplace** → Semua pengguna dapat membuat toko dan berjualan  
- **Official Store** → Hanya admin yang dapat membuat toko (mirip toko tunggal)

### **Seller Fee (%)**
Masukkan persentase fee yang dikenakan pada penjual.  
Contoh: `5` berarti platform mendapatkan 5% dari setiap transaksi selesai.

---

## 📌 3. Website

### **Nama**
Nama website Anda.

### **Deskripsi**
Deskripsi singkat tentang marketplace Anda.

### **Ikon**
URL gambar ikon/logo website.  
Anda dapat meng-upload gambar melalui tombol **Upload**.

### **Tema**
Nama tema tampilan frontend (default: `default`).  
Jika Anda membuat tema baru, nama tema dapat diisi di sini.

---

## 📌 4. Integrasi

Bagian ini sangat penting agar beberapa fitur berjalan dengan baik.

---

### 🔷 **Autz.org App ID**

Digunakan untuk sistem login berbasis OAuth milik **Autz.org**.

#### Cara mendapatkan App ID:

1. Kunjungi: https://autz.org  
2. Buat akun / login  
3. Masuk ke **Dashboard**  
4. Aktifkan **Mode Developer**  
5. Buat **1 aplikasi baru**  
6. Buka halaman detail aplikasi tersebut  
7. Salin **App ID**

Tempel App ID tersebut ke dalam form konfigurasi.

---

### 🔷 **Pakasir Slug & Pakasir API Key**

Digunakan untuk fitur pembayaran yang terintegrasi dengan **Pakasir**.

#### Cara mendapatkannya:

1. Login ke: https://app.pakasir.com  
2. Buka menu **Proyek**  
3. Klik **Buat Proyek Baru**  
4. Setelah dibuat, buka **Detail Proyek**  
5. Salin:
   - **Slug**
   - **API Key**

Masukkan keduanya ke dalam form konfigurasi.

> 🔎 *Slug* akan digunakan sebagai identitas proyek, dan *API Key* digunakan untuk memverifikasi pembayaran dari API Pakasir.

---

### 🔷 **Cronjob Secret**

Digunakan untuk mengamankan endpoint cron internal (misalnya pengecekan transaksi otomatis).

Cara mengisi:

- Masukkan **string acak minimal 10 karakter**  
  Contoh: `jhsdg7qg3gig`

- Jangan membagikan secret ini ke siapa pun.

---

## 📌 5. Email SMTP

OpenPasar menggunakan SMTP untuk mengirim email seperti:
 
- Notifikasi transaksi  
- Notifikasi penarikan saldo
- dll

Jika Anda belum punya SMTP, Anda bisa mengisi semuanya dengan tanda **-** terlebih dahulu.

Contoh:
```
Host: -
Port: -
User: -
Password: -
Email From: -
```

> Email tidak akan berfungsi dulu, tetapi sistem tetap berjalan.  
> Anda dapat memperbarui SMTP kapan saja.

Jika Anda ingin SMTP real, Anda bisa memakai:

- Gmail SMTP  
- Brevo (Sendinblue)  
- Atau SMTP server apa pun

---

## 📌 6. Konten

### **Info dan Tentang Website**
Teks pendek tentang website Anda. Biasanya berisi pengantar atau informasi untuk pengguna.

### **Peraturan Menjadi Penjual**
Berisi ketentuan atau syarat bagi pengguna yang ingin membuka toko.  
Bisa diisi sesuai kebijakan platform Anda.

---

## ✔️ Setelah Semua Terisi

Klik **Submit** untuk menyimpan konfigurasi.  
Website Anda sekarang sudah siap dipakai.

---

Selamat mengelola platform marketplace Anda! 🚀
