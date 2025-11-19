# OpenPasar - Marketplace and Official Store Platform

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

Klik tombol berikut untuk meng-clone dan deploy project:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gx1org/openpasar)

> **Catatan:**  
> 1. Deploy **apps/api** terlebih dahulu → pilih `root-directory=apps/api`  
> 2. Setelah API berhasil di-deploy, lanjutkan dengan **apps/frontend** → `root-directory=apps/frontend`  
> 3. Ikuti konfigurasi ENV Variable berikut

---

## ⚙️ Konfigurasi Environment

### 📌 A. Environment untuk **API**

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
```
- `DATABASE_URL` → ambil dari Neon.tech  
- `JWT_SECRET` → isi dengan string acak minimal 32 karakter

---

### 📌 B. Environment untuk **Frontend**

```
API_URL=...
```
- `API_URL` → isi dengan URL hasil deploy dari API

---

## 🤝 Kontribusi

Kontribusi sangat dipersilakan!

- Buat **GitHub Issue** jika menemukan bug atau ingin mengusulkan fitur.  
- Kirim **Pull Request (PR)** jika ingin berkontribusi langsung.

---

## 📄 Lisensi

Project ini berbasis **MIT License**, dengan syarat tambahan:

> Wajib menampilkan teks: **"powered by OpenPasar"**  
> Beserta credit link ke repository ini.  
> Penghapusan credit tidak diperbolehkan.

---

Selamat membangun marketplace/official store Anda dengan OpenPasar! 🎉
