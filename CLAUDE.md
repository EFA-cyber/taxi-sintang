# CLAUDE.md — Proyek Website 3D Rental Mobil Sintang

## Bahasa

**Selalu gunakan bahasa Indonesia** di setiap percakapan dengan pemilik proyek: penjelasan, pertanyaan, ringkasan, dan pesan error yang diterjemahkan. Pakai bahasa Indonesia sehari-hari yang sopan dan jelas, hindari istilah teknis tanpa penjelasan. Nama file, kode, dan perintah terminal tetap apa adanya. Pesan commit juga berbahasa Indonesia.

## Lingkungan

- Laptop pemilik memakai **Windows + PowerShell**. Berikan perintah dalam sintaks PowerShell (`cd D:\taxi-sintang`, bukan `cd /d`).
- Folder proyek: `D:\taxi-sintang`.
- CLI Dreamina sudah terpasang di laptop ini dan dipakai untuk membuat video & gambar.

## Dokumen acuan (baca sebelum bekerja)

- `PRD.md`: kebutuhan produk, arah kreatif, token desain (§3.2), aturan anti-slop (§3.3).
- `docs/plans/2026-10-30-landing-page.md`: rincian landing page per section.
- `docs/plans/2026-10-30-website-3d-rental-mobil-sintang.md`: rencana induk.
- `docs/dreamina-asset-brief.md`: prompt, nama file, dan aturan aset Dreamina.

## Tahap saat ini: prototipe HTML

Rencana induk memakai Astro + React Three Fiber. **Untuk tahap ini, pemilik meminta HTML biasa dulu** (HTML + CSS + JavaScript tanpa build tool, tanpa framework), dimulai dari **hero section saja**. Kerjakan di folder `prototype/`. Jangan membuat section lain sebelum hero disetujui pemilik.

## Memakai CLI Dreamina

1. Sebelum pemakaian pertama, jalankan perintah bantuan CLI (mis. `dreamina --help`) untuk mempelajari perintah yang tersedia. Jika nama perintahnya tidak diketahui, tanyakan ke pemilik. Jangan menebak.
2. Jika CLI belum login, minta pemilik login sendiri. Jangan meminta atau menyimpan kata sandi atau token.
3. **Setiap pembuatan memakai kredit akun pemilik.** Sebelum menjalankan perintah generate, sebutkan aset yang akan dibuat, jumlah variasinya, dan tunggu persetujuan. Jangan mengulang generate otomatis saat hasilnya jelek; laporkan dulu.
4. Gunakan prompt **persis** dari `docs/dreamina-asset-brief.md`, termasuk bagian "Gaya bersama".
5. Simpan hasil mentah di `assets-src/dreamina/` dengan nama file persis seperti di brief. Variasi yang ditolak disimpan di `assets-src/dreamina/_ditolak/`.
6. **Jangan membuat mobil, sopir, orang, logo, atau teks dengan AI.** Dreamina hanya untuk alam, cuaca, cahaya, dan tekstur.
7. Periksa setiap hasil sebelum dipakai: tidak ada teks palsu, kendaraan, orang, air biru jernih, atau bangunan yang bukan khas Kalimantan.

## Aturan desain dan copy (ringkas dari PRD)

- Warna: Kabut `#DDE4E1`, Kelam `#23292C`, Rambu `#0F5B3A`, Teh Kapuas `#8A5A2B`, Engkudu `#9C2F24`, Lampu `#F2B33D` (Lampu hanya untuk fokus keyboard dan sorot lampu, bukan dekorasi).
- Huruf: Overpass (judul, angka), Source Serif 4 (paragraf).
- Dilarang: gradien dekoratif, blob/partikel, kartu identik berbayangan, label HURUF KAPITAL di atas judul, panah "→" di setiap tombol, animasi fade-slide di setiap elemen, foto stok, dan frasa klise ("perjalanan Anda prioritas kami", "solusi terbaik", "terpercaya dan profesional", "nikmati kemudahan", "jelajahi", "harga bersaing").
- Data usaha yang belum diketahui ditulis `[ISI: …]`. **Jangan mengarang** nama usaha, nomor WA, harga, atau testimoni.

## Cara kerja

- Kerjakan sedikit demi sedikit, lalu tunjukkan hasilnya ke pemilik (buka file HTML di browser atau ambil screenshot) sebelum lanjut.
- Commit setiap langkah yang selesai dengan pesan berbahasa Indonesia. Push hanya jika pemilik meminta.
