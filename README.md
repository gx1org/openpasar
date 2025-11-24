# OpenPasar - Marketplace and Official Store Platform

<img width="294" height="284" alt="OpenPasar" src="https://github.com/user-attachments/assets/4b8501a0-9af5-4b5d-a039-a1b0ac18f4be" />

OpenPasar merupakan project **marketplace / official store** berbasis **open source**  
yang dioptimalkan agar dapat **di-hosting secara gratis di Vercel**.

Project ini adalah **monorepo** yang terdiri dari 2 aplikasi:

- **apps/api** – Backend (Hono)
- **apps/frontend** – Frontend (Nuxt)

---

## 🚀 Persiapan

Sebelum mulai, siapkan:

1. **Database [Neon.tech](http://console.neon.tech/)**
   
   Buat project, klik Connect, lalu copy **connection string**-nya, simpan untuk nanti. (contoh: `postgresql://neondb_owner:npg_....`).

2. **Akun GitHub**

   Fork repository ini, dengan mengeklik tombol "Fork" di kanan atas. **Hal ini wajib**. Karena jika tidak, maka Vercel tidak akan mendeteksi repository ini.

---

## 🚀 Deploy ke Vercel

### Buat Akun

1. Pertama, buat akun di https://vercel.com/signup
2. Pilih paket hobby, klik Continue
3. Pilih Continue with Github
4. Saat muncul popup, klik Continue

### ▶️ Hubungkan Vercel dan Github

Setelah terdaftar dan berhasil masuk ke dashboard:

1. Klik New > Projects
2. Di bagian bawah Import Git Repository, klik Install untuk menginstal vercel ke Github
3. Saat muncul popup, klik Install

### ▶️ Deployment

Setelah berhasil terhubung, Anda akan melihat daftar repository yang dapat di import.

Karena OpenPasar terdiri dari **dua aplikasi** sehingga proses deploy dilakukan **dua kali**:

#### 1. Deploy API

Klik tombol Import di sebelah repository openpasar untuk memulai deployment. Pertama, project api yang akan di-deploy.

1. Klik Environment Variable untuk menambahkan 2 ENV berikut:

- `DATABASE_URL` → isi connection string dari Neon.tech  
- `JWT_SECRET` → isi dengan string acak minimal 32 karakter

2. Klik Deploy lalu tunggu sampai selesai.
3. Di bagian paling bawah, ada tombol Deploy untuk frontend. Tapi jangan klik dulu.
4. Klik screenshot untuk mengunjungi api lalu salin url-nya. Kita butuh urlnya untuk deploy frontend.

#### 2. Deploy Frontend

Setelah deploy api selesai, waktunya deploy frontend.

1. Klik tombol deploy di paling bawah
2. Pada bagian Environment Variable, masukan 1 ENV berikut:

- `API_URL` → isi dengan url api yang sudah kita salin tadi.

3. Klik Deploy lalu tunggu sampai selesai.
4. Klik screenshot untuk mengunjungi website. Jika semuanya benar, Anda akan melihat form Konfigurasi.

---

## 📘 Next Step

Setelah berhasil deploy API dan Frontend, lanjutkan dengan panduan berikut:

1. **[Panduan Konfigurasi](./configure.md)**  
   Penjelasan untuk mengisi form Konfigurasi saat pertama kali membuka website.

2. **[Panduan Development](./development-guides.md)**  
   Cara menjalankan project di local development.

---

## 🤝 Live Demo

Mode Marketplace: https://geksapedia.com

Mode Official Store: https://sepatuku-store.vercel.app

---

## 📄 Lisensi

Project ini berbasis **MIT License**, dengan syarat tambahan:

> Repository ini berisi credit link: **"powered by OpenPasar"** yang mengarah ke repository ini.  
> Penghapusan credit tidak diperbolehkan.

Jika tetap ingin memiliki website tanpa menampilkan credit, atau membutuhkan bantuan untuk menginstal?

Silakan hubungi kami:

- https://wa.me/+6289602727642

---

Selamat membangun marketplace/official store Anda dengan OpenPasar! 🎉
