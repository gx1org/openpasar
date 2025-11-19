## Panduan Development

Untuk memulai project OpenPasar ini, Anda perlu memahami langkah-langkah berikut:

### 1. Fork Repositori

Buka browser Anda dan arahkan ke halaman repositori OpenPasar (https://github.com/gx1org/openpasar). Kemudian klik tombol "Fork" di pojok kanan halaman GitHub.

### 2. Install Dependencies

Setelah melakukan fork, buka terminal Anda lalu clone ke local developement:

```
# clone
git clone https://github.com/your-username/openpasar.git

# pindah ke folder
cd openpasar

# install dependencies
pnpm i
```

### 3. Jalankan project

Sebelum menjalankan project, lengkapi dulu env varibale yang dibutuhkan.

- `apps/api/.env`
```
DATABASE_URL=
JWT_SECRET=random-string-here
```

- `apps/frontend/.env`
```
API_URL=http://localhost:7100
```

Lalu jalankan projectnya dengan command berikut:
```
pnpm turbo dev
```

Akses URL api untuk mengecek koneksi database:
```
http://localhost:7100
```

Jika hasilnya ok, maka dapat melanjutkan akses URL frontend untuk memulai:
```
http://localhost:7101
```
