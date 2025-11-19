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
Pilihan tema website.

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

#### Atur Webhook di Pakasir

Agar pembayaran berfungsi dengan baik, Anda perlu mengatur webhook pada proyek Pakasir.

1. Setelah di halaman detail Proyek, klik tomnol Edit
2. Masukan url dengan format berikut: `https://domainmu.vercel.app/api/webhooks/pakasir`
3. Kemudian klik simpan

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

Jika Anda belum punya SMTP, Anda dapat membiarkan form SMTP terisi nilai default.

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

## Buat Cronjob

Cronjob adalah cara aplikasi melakukan tugas secara terjadwal. Misalnya tiap 5 menit, tiap 1 jam, tiap tengah malam, dll.

Aplikasi ini membutuhkan cronjob yang berjalan tiap 5 menit untuk mengecek transaksi yang tidak terbayar selama 24 jam, atau transaksi yang tidak kunjung di selesaikan oleh pembeli.

Caranya:

1. Buat akun di https://console.cron-job.org
2. Klik "Create Cronjob"
3. Masukan Judul "OpenPasar"
4. Masukan URL dengan format: `https://domainmu.vercel.app/api/automate?secret=cronjob-secret`.

   Contoh: `https://domainmu.vercel.app/api/automate?secret=jhsdg7qg3gig`

5. Pada Execution schedule, pilih Every 5 minutes
6. Klik Simpan

Selesai. Sekarang aplikasimu akan di-panggil oleh cronjob setiap 5 menit.

---

Selamat mengelola platform marketplace Anda! 🚀
