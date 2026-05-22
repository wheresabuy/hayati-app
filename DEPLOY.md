# Panduan Deploy Aplikasi Hayati Agen (Online 24/7)

Agar aplikasi ini bisa dipakai keluarga dari HP masing-masing di mana saja, kita harus memindahkannya dari komputer Abang ke Internet.

## 1. Persiapan Database Online (Supabase)
Karena SQLite cuma ada di komputer Abang, kita ganti ke PostgreSQL yang online.
1. Buat akun gratis di [Supabase.com](https://supabase.com).
2. Buat Project baru (misal: "Hayati-Agen").
3. Masuk ke **Settings > Database**, lalu salin **Connection String** (URI).
4. Di file `.env` proyek, ganti `DATABASE_URL` dengan link dari Supabase tersebut.

## 2. Ubah Setting Database (Prisma)
Agar aplikasi bisa baca database online, kita kembalikan settingan Prisma ke PostgreSQL.
1. Di `prisma/schema.prisma`, ganti `provider = "sqlite"` menjadi `provider = "postgresql"`.
2. Jalankan perintah ini di terminal:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   *Ini akan memindahkan semua data rahasia harga pelanggan ke database online.*

## 3. Upload ke Internet (Vercel)
Vercel adalah tempat hosting gratis yang paling cocok untuk Next.js.
1. Buat akun di [Vercel.com](https://vercel.com).
2. Install Vercel CLI di terminal: `npm install -g vercel`.
3. Jalankan perintah: `vercel`.
4. Ikuti instruksinya (pilih Yes untuk semuanya).
5. Masukkan **Environment Variable** `DATABASE_URL` (link Supabase tadi) di Dashboard Vercel.

## 4. Bagikan Link
Setelah proses di atas selesai, Vercel akan kasih link (misal: `hayati-agen.vercel.app`).
*   **Kirim link itu ke WhatsApp keluarga.**
*   Mereka bisa buka langsung dari browser HP, login (nanti kita bisa tambah fitur Password), dan mulai catat transaksi.

---

### 💡 Tips Biar Jadi Seperti Aplikasi Asli di HP:
Beri tahu keluarga untuk:
1. Buka link tersebut di Chrome (Android) atau Safari (iPhone).
2. Klik **Titik Tiga** (kanan atas) atau ikon **Share**.
3. Pilih **"Add to Home Screen"** (Tambah ke Layar Utama).
4. Aplikasi Hayati Agen akan muncul sebagai ikon di menu HP mereka, jadi nggak perlu ngetik link lagi!
