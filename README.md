# OpenPasar - Marketplace and Official Store Platform

<img width="294" height="284" alt="Screenshot 2025-11-04 134338" src="https://github.com/user-attachments/assets/4b8501a0-9af5-4b5d-a039-a1b0ac18f4be" />

OpenPasar merupakan project **marketplace / official store** berbasis **open source**  
yang dioptimalkan agar dapat **di-hosting secara gratis di Vercel**.

Project ini adalah **monorepo** yang terdiri dari 2 aplikasi:

- **apps/api** – Backend (Hono)
- **apps/frontend** – Frontend (Nuxt)

---

## 🚀 Persiapan

Sebelum mulai, siapkan:

1. **Database [Neon.tech](http://console.neon.tech/)**
   
   Buat database PostgreSQL lalu copy **connection string**.

3. **Akun GitHub**

4. **Akun Vercel**
   
   Untuk deploy API dan Frontend.

---

## 🚀 Deploy ke Vercel

OpenPasar terdiri dari **dua aplikasi** sehingga proses deploy dilakukan **dua kali**:

### ▶️ Deploy API

Klik tombol berikut untuk deploy API:

[![Deploy API to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gx1org/openpasar&root-directory=apps/api&repository-name=openpasar-api&env=DATABASE_URL,JWT_SECRET)

Ada 2 ENV variable yang harus diisi:

- `DATABASE_URL` → ambil dari Neon.tech  
- `JWT_SECRET` → isi dengan string acak minimal 32 karakter

Selesaikan proses deployment. Lalu klik tombol "Continue to Dashboard" (di paling bawah).

Di halaman tersebut ada nama domain yang diberikan oleh vercel. (contohnya: `openpasar-api.vercel.app`).

### ▶️ Deploy Frontend

Klik tombol berikut untuk deploy Frontend:

[![Deploy API to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gx1org/openpasar&root-directory=apps/frontend&repository-name=openpasar-fe&env=API_URL)

Ada 1 ENV variable yang harus diisi:

- `API_URL` → ambil domain API (awali dengan https://). Sehingga dalam contoh sekarang menjadi `https://openpasar-api.vercel.app`.

Selesaikan proses deployment. Lalu klik tombol "Continue to Dashboard" (di paling bawah).

Klik domainnya untuk mengunjungi website OpenPasar Anda.

---

## 📘 Next Step

Setelah berhasil deploy API dan Frontend, lanjutkan dengan panduan berikut:

1. **[Panduan Konfigurasi](./configure.md)**  
   Penjelasan untuk mengisi form Konfigurasi saat pertama kali membuka website.

2. **[Panduan Development](./development-guides.md)**  
   Cara menjalankan project di local development.

3. **[Panduan Vercel](./vercel-guides.md)**  
   Tutorial menggunakan Vercel, seperti memasang custom domain, dll.

---

## 🤝 Kontribusi

Kontribusi sangat dipersilakan!

- Buat **GitHub Issue** jika menemukan bug atau ingin mengusulkan fitur.  
- Kirim **Pull Request (PR)** jika ingin berkontribusi langsung.

---

## 📄 Lisensi

Project ini berbasis **MIT License**, dengan syarat tambahan:

> Repository ini berisi credit link: **"powered by OpenPasar"** yang mengarah ke repository ini.  
> Penghapusan credit tidak diperbolehkan.

---

Selamat membangun marketplace/official store Anda dengan OpenPasar! 🎉
