# Prompt untuk Claude Code: hero section (HTML)

Salin semua teks di bawah garis ini, lalu tempel ke Claude Code di `D:\taxi-sintang`.

---

Baca dulu `CLAUDE.md`, `PRD.md` (terutama §3 dan §4), `docs/plans/2026-10-30-landing-page.md` bagian **S1 — Hero**, dan `docs/dreamina-asset-brief.md`. Selalu jawab saya dalam bahasa Indonesia.

**Latar belakang:** kita membuat website rental mobil di Sintang, Kalimantan Barat. Website ini tidak boleh terlihat generik atau seperti buatan AI. Identitasnya diambil dari Sintang sendiri: pertemuan Sungai Kapuas dan Melawi, Bukit Kelam, kabut pagi di atas sungai berwarna teh, rambu jalan hijau, dan tenun ikat. Rencana lengkapnya memakai 3D, tapi **sekarang kita mulai dengan HTML biasa dan fokus hanya pada hero section.**

## Tugas

### Langkah 1 — Siapkan aset hero dengan Dreamina

1. Pelajari CLI Dreamina dengan perintah bantuannya (mis. `dreamina --help`). Ceritakan ke saya perintah apa saja yang tersedia untuk membuat video dan gambar.
2. Usulkan rencana generate untuk dua aset ini, sesuai prompt di `docs/dreamina-asset-brief.md`:
   - `hero-kabut-kapuas-16x9.mp4` (desktop)
   - `hero-kabut-kapuas-9x16.mp4` (HP)
3. **Tunggu persetujuan saya** sebelum generate, karena ini memakai kredit.
4. Setelah generate, tunjukkan hasilnya. Simpan yang saya pilih di `assets-src/dreamina/` dan yang ditolak di `assets-src/dreamina/_ditolak/`.
5. Buat poster dari frame terbaik masing-masing video (`poster-hero-16x9` dan `poster-hero-9x16`) dalam format WebP, maksimal 120 KB. Kompres video ke 720p tanpa audio, maksimal 1,2 MB, dan simpan di `prototype/media/`. Pakai `ffmpeg` jika tersedia. Jika tidak ada, beri tahu saya cara memasangnya di Windows.

Jika aset belum siap, lanjutkan Langkah 2 memakai latar warna Kelam `#23292C` sebagai pengganti sementara. Jangan memakai gambar stok atau gradien.

### Langkah 2 — Buat hero section di HTML

File: `prototype/index.html`, `prototype/style.css`, `prototype/hero.js`. Tanpa framework dan tanpa build tool, cukup dibuka langsung di browser.

**Isi hero:**
- Header tipis: nama usaha `[ISI: nama usaha]` di kiri. Di kanan, tombol WhatsApp (`[ISI: nomor WA]`, sementara pakai `#`).
- Video latar kabut Kapuas memenuhi layar (`100svh`), `autoplay muted loop playsinline`, dengan poster. Pakai `<source media="(orientation: portrait)">` untuk versi 9:16.
- Lapisan tipis warna Kelam di atas video supaya teks terbaca (kontras minimal 4.5:1). Lapisan ini warna rata, bukan gradien dekoratif.
- Judul: **Mau ke mana dari Sintang?** dalam Overpass 800, sekitar 88px di desktop dan 52–56px di HP, rata kiri.
- Kolom tujuan dengan label yang terlihat ("Tujuan"), placeholder "Pontianak, Putussibau, Nanga Pinoh…", dan saran dari daftar: Pontianak, Putussibau, Nanga Pinoh, Sekadau, Bandara Tebelian. Pakai `<datalist>` dulu.
- Tombol: **Hitung perjalanan** (latar Rambu `#0F5B3A`, teks putih, tanpa panah).
- Satu kalimat di bawahnya: "Jemput di Bandara Tebelian juga bisa."

**Perilaku:**
- Menekan tombol atau Enter menyimpan tujuan ke URL (`?ke=pontianak`) dan menggulir ke `<section id="rute">` kosong di bawah hero yang bertuliskan "Penyusun rute menyusul".
- Tujuan yang tidak ada di daftar tetap diterima.
- `prefers-reduced-motion`: video tidak diputar, hanya poster.
- Mode hemat data (`navigator.connection.saveData`) atau koneksi 2G/3G: video tidak dimuat, hanya poster.
- Fokus keyboard terlihat jelas dengan garis 3px warna Lampu `#F2B33D`.
- Gerak otomatis hanya satu: judul dan form muncul sekali saat halaman dimuat (maks. 600 ms). Selain itu tidak ada animasi.

**Gaya:**
- Font Overpass (600, 800) dan Source Serif 4 (400) dari Google Fonts.
- Token warna sebagai CSS custom properties di `:root`, persis seperti di `CLAUDE.md`.
- Margin samping 16px di HP, tanpa scroll horizontal di lebar 360px.
- Patuhi semua larangan di `CLAUDE.md` dan PRD §3.3.

### Langkah 3 — Periksa dan tunjukkan

1. Buka `prototype/index.html` di browser, lalu periksa di lebar 360px, 768px, dan 1440px. Jika bisa, ambil screenshot.
2. Laporkan ke saya: apa yang sudah jadi, apa yang masih memakai pengganti sementara, dan ukuran file video/poster.
3. Kritik sendiri hasilnya terhadap aturan anti-slop: apakah hero ini bisa ditukar dengan website rental lain tanpa terasa bedanya? Jika ya, usulkan perbaikan sebelum saya minta.
4. Commit dengan pesan berbahasa Indonesia. Jangan lanjut ke section lain sebelum saya setujui.
