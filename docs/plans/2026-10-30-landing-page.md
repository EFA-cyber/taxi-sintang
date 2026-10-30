# Landing Page Rental Mobil Sintang — Rencana Pembuatan

> **Untuk agen/pengembang:** dokumen ini merinci halaman utama (`src/pages/index.astro`) dari rencana induk `docs/plans/2026-10-30-website-3d-rental-mobil-sintang.md`. Rencana induk mengatur fondasinya (Task 1–3: kerangka, data, logika biaya/WA). Dokumen ini mengatur **apa yang tampil, urutannya, isinya, dan cara membangunnya** per section. Kerjakan berurutan dan centang `- [ ]` setiap langkah.

**Tujuan:** satu halaman yang membawa pengunjung dari "Mau ke mana dari Sintang?" ke pesan WhatsApp terisi dalam ≤ 3 interaksi. Diorama 3D wilayah Sintang menjadi satu-satunya elemen yang mencolok.

**Spesifikasi:** `PRD.md` §3 (arah kreatif, token, anti-slop) dan §4 (struktur section). **Aset:** `docs/dreamina-asset-brief.md`.

---

## 1. Alur halaman

Pengunjung harus bisa memesan dari tiga titik tanpa perlu menggulir sampai bawah:

```
Hero (input tujuan) ──┐
                      ├──► Penyusun rute ──► Pelat rambu ──► Kirim via WhatsApp
Pelat di Cerita jalan ┘                         ▲
Tombol WA melayang (HP) ────────────────────────┘ (pesan umum jika rute belum dipilih)
```

Urutan section dan tugasnya. Setiap section hanya punya **satu** tugas:

| # | Section | Satu tugas | Tinggi kira-kira (desktop) |
|---|---|---|---|
| S1 | Hero: kabut Kapuas | Menanyakan tujuan | 100vh |
| S2 | Penyusun rute | Menjawab "berapa, berapa lama, mobil apa" | 100–130vh |
| S3 | Armada | Membantu memilih mobil sesuai medan | 1 layar per 2 mobil |
| S4 | Cerita jalan | Meyakinkan bahwa kami tahu jalannya | 4 × 80vh |
| S5 | Sopir | Menampilkan orang nyata | 60vh |
| S6 | Cara pesan | Menghilangkan ragu soal proses | 50vh |
| S7 | Tanya-jawab | Menjawab syarat & aturan | sesuai isi |
| S8 | Penutup | Memberi alamat dan tombol terakhir | 70vh |

---

## 2. Kerangka kamera diorama

Diorama menempel di kanan (desktop) atau di atas (HP). Setiap section memiliki satu posisi kamera. Scroll menggerakkan kamera di antara posisi itu (scrub), kecuali intro.

| Titik | Section | Kamera melihat | Keadaan adegan |
|---|---|---|---|
| K0 | Intro (otomatis, 2,4 dtk, sekali) | Dari atas awan turun ke pertemuan Kapuas–Melawi | Kabut tebal → tipis, video hero memudar |
| K1 | S1 Hero | Pertemuan sungai, Bukit Kelam di belakang | Kabut tipis bergerak pelan |
| K2 | S2 Penyusun rute | Membingkai seluruh rute terpilih (atau semua rute redup jika belum ada) | Pita rute menyala progresif |
| K3 | S3 Armada | Dekat ke titik awal rute, mobil terpilih berdiri di jalan | Model mobil berganti saat dipilih |
| K4a–d | S4 Cerita jalan | Terbang ke ruas khas tiap rute (laterit, tanjakan, jembatan) | Ruas laterit merah Engkudu berdenyut sekali |
| K5 | S5–S7 | Mundur perlahan, diorama diam | Tanpa gerak (section tenang) |
| K8 | S8 Penutup | Zoom-out penuh, langit malam | Lampu-lampu kota menyala, sorot lampu mobil warna Lampu |

Aturan: jika pengguna mengubah rute saat berada di S3–S4, kamera berpindah ke rute baru dalam 0,8 dtk. Scroll berikutnya dilanjutkan dari posisi itu, tanpa lompatan.

---

## 3. Rincian per section

### S1 — Hero: kabut Kapuas

```
DESKTOP                                         HP
┌──────────────────────────────────────────┐    ┌──────────────────────┐
│ [logo/nama usaha]          [WA] [3D ⏻]   │    │ [nama]      [WA]     │
│                                          │    │                      │
│  Mau ke mana                             │    │  video kabut 9:16    │
│  dari Sintang?        (video kabut 16:9  │    │                      │
│                        → diorama K1)     │    │  Mau ke mana         │
│  ┌──────────────────────┐ ┌────────────┐ │    │  dari Sintang?       │
│  │ Pontianak, Putussibau│ │ Hitung     │ │    │  ┌────────────────┐  │
│  └──────────────────────┘ └────────────┘ │    │  │ tujuan…        │  │
│  Jemput di Bandara Tebelian juga bisa.   │    │  └────────────────┘  │
└──────────────────────────────────────────┘    │  [Hitung perjalanan] │
                                                └──────────────────────┘
```
- **Copy:** judul "Mau ke mana dari Sintang?". Sub kalimat: "Jemput di Bandara Tebelian juga bisa." Tombol "Hitung perjalanan".
- **Input:** combobox dengan saran dari `routes.json` + kecamatan. Tujuan yang tidak dikenal tetap diterima dan diteruskan ke WA sebagai teks bebas.
- **Aset:** `hero-kabut-kapuas-16x9.mp4`, `hero-kabut-kapuas-9x16.mp4`, `poster-hero-*.avif`.
- **Navigasi:** bukan menu lengkap, hanya nama usaha, tombol WA, dan sakelar 3D. Tautan section ada di footer.
- **Selesai jika:** LCP = poster/judul ≤ 2,5 dtk di HP 4G. Enter di input → gulir ke S2 dengan tujuan terisi. Reduced motion → poster tanpa video.

### S2 — Penyusun rute

```
┌─────────────────────────┬────────────────────────────┐
│ Dari  [Kota Sintang  ▾] │                            │
│ Ke    [Pontianak     ▾] │      DIORAMA K2            │
│ Tgl   [14/11/2026] jam  │      pita rute menyala     │
│ Orang [−  5  +]         │                            │
│ Sopir (●) ya  ( ) tidak │                            │
│ ┌─────────────────────┐ │                            │
│ │▓ PONTIANAK   ~395 km│ │                            │
│ │  ±8–9 jam           │ │                            │
│ │  ruas tanah: tidak  │ │                            │
│ │  Cocok: [dari data] │ │                            │
│ │  Rp … – Rp …        │ │                            │
│ │ [Kirim pesanan via  │ │                            │
│ │  WhatsApp]          │ │                            │
│ └─────────────────────┘ │                            │
└─────────────────────────┴────────────────────────────┘
```
- **Pelat rambu:** latar Rambu `#0F5B3A`, sudut membulat 6px seperti pelat aluminium, garis tepi putih 2px di dalam. Nama kota Overpass 800, km dan jam Overpass 600. Ini satu-satunya komponen bergaya "rambu". Jangan dipakai ulang untuk hal lain supaya tetap bermakna.
- **Ruas laterit:** baris berwarna Engkudu + ikon + teks "± 40 km jalan tanah, licin saat hujan" (angka dari data).
- **Harga belum diisi:** "Harga dikonfirmasi lewat WhatsApp".
- **Kapasitas terlampaui:** "Untuk 9 orang, pakai dua mobil atau satu mobil besar. Tanyakan lewat WhatsApp." (nama mobil diambil dari data armada)
- **Fallback:** di tempat diorama tampil `RouteMapSvg` dengan rute yang sama.
- **Selesai jika:** semua kombinasi di E2E rencana induk Task 4 lulus. Pelat diumumkan ke pembaca layar (`aria-live="polite"`).

### S3 — Armada

- **Bentuk:** daftar vertikal, bukan grid kartu. Satu baris per mobil: foto asli (kiri), nama + kapasitas + bagasi + transmisi, lalu satu kalimat "cocok untuk" yang ditulis manusia. Contoh: "Enam orang dengan koper, aman di aspal antarkota."
- **Label medan:** teks biasa, bukan badge warna-warni.
- **Interaksi:** klik/fokus baris → `$trip.vehicleId` berubah → model 3D berganti di K3 → pelat S2 diperbarui. Tombol "Pakai mobil ini".
- **Aset:** foto mobil asli (`public/media/fleet/*.avif`) dan GLB generik.
- **Selesai jika:** memilih mobil yang tidak cocok untuk rute laterit menampilkan peringatan di baris itu, bukan memblokir.

### S4 — Cerita jalan

- **Bentuk:** empat blok, satu per rute. Kiri: judul rute (Overpass 600), 2–4 catatan dalam Source Serif 4, satu foto/video kecil. Kamera pindah ke K4a–d.
- **Contoh nada** (isi akhir dari wawancara sopir, draf bertanda `[ISI: konfirmasi sopir]`):
  > Sintang–Pontianak. Lewat Sekadau dan Sanggau. Kebanyakan sopir kami berangkat jam 4 subuh supaya lepas dari Sanggau sebelum truk sawit ramai. [ISI: konfirmasi sopir]
- **Video:** `trans-kalimantan-senja.mp4` (Pontianak), `jalan-laterit-hujan.mp4` (rute dengan ruas tanah). Diputar hanya saat terlihat (IntersectionObserver), dijeda saat keluar layar.
- **CTA kecil per blok:** "Hitung biaya ke Pontianak" → mengisi S2 dan menggulir ke atas.
- **Selesai jika:** tiap blok punya tautan ke halaman `/rute/[slug]`.

### S5 — Sopir

- Foto asli setengah badan, latar alami (pool, tepi Kapuas). Nama, lama menyetir, rute yang dikuasai, bahasa.
- Tanpa bintang rating dan tanpa testimoni karangan. Testimoni hanya ditambahkan jika ada pelanggan nyata yang mengizinkan.
- Diorama diam (K5).
- **Jika sopir belum bersedia difoto:** section disembunyikan lewat flag di `site.json`, bukan diisi foto AI.

### S6 — Cara pesan

- Tiga langkah bernomor (memang berurutan): 1. Susun rute di atas. 2. Kirim pesan WhatsApp yang sudah terisi. 3. Admin mengonfirmasi mobil dan DP `[ISI: aturan DP]`.
- Satu baris horizontal di desktop, vertikal di HP. Tanpa ikon dekoratif.

### S7 — Tanya-jawab

- `<details>` asli dari `faq.json`. Topik wajib: syarat lepas kunci, DP & pembatalan, BBM, tol/penyeberangan/parkir, overtime, makan & penginapan sopir, wilayah yang tidak dilayani.
- Jawaban pendek, menyebut angka dari data, tanpa "Silakan hubungi kami" sebagai jawaban.

### S8 — Penutup

- Kiri: alamat pool, jam operasional, nomor WA (tautan `tel:` dan `wa.me`), tombol "Buka di Google Maps" (embed dimuat hanya saat diklik).
- Kanan: diorama K8 versi malam. Fallback: `malam-kota-sungai` poster.
- Pembatas `TenunRule` di atas section ini (salah satu dari maksimal 3 pemakaian).
- Footer: tautan halaman rute, kredit aset (`docs/credits.md`), tahun.

### Elemen tetap

- **Patok km** (desktop, tepi kiri): angka naik dari 0 ke km rute terpilih seiring scroll. Jika rute belum dipilih, ia menghitung ke 395 (Pontianak, rute terpopuler, angka dari data).
- **Tombol WA melayang** (HP saja, setelah S1 lewat): membuka pesan berisi rute terpilih atau pesan umum. Disembunyikan saat pelat S2 terlihat supaya tidak dobel.
- **Sakelar 3D** di header: "3D nyala" / "3D mati", disimpan per browser.

---

## 4. Langkah pembuatan

Prasyarat: Task 1–3 rencana induk selesai (kerangka, token, data, `fare.ts`, `whatsapp.ts`, `recommend.ts`).

### Tahap A — Halaman berfungsi tanpa 3D (bisa rilis awal)

- [ ] **A1. Kerangka section.** `index.astro` berisi S1–S8 dengan `id` dan judul. `Base.astro` berisi header minimal + footer. Cek: 375px dan 1440px tanpa scroll horizontal.
- [ ] **A2. S1 tanpa video.** Judul, combobox tujuan, tombol, poster statis. Enter → isi `$trip` + gulir ke S2. Tes E2E `hero-to-planner.spec.ts`.
- [ ] **A3. S2 lengkap + peta SVG.** `RoutePlanner`, `RouteSign`, `RouteMapSvg`. Tes E2E dari rencana induk Task 4.
- [ ] **A4. S3 armada.** `FleetList` + sinkron ke `$trip.vehicleId` + peringatan medan. Tes unit untuk pesan peringatan dan E2E untuk pilih mobil → pelat berubah.
- [ ] **A5. S4–S8 konten.** Isi dari JSON. Section sopir tersembunyi lewat flag. FAQ `<details>`. Tes: `check-copy` lulus, semua tautan `/rute/*` ada.
- [ ] **A6. Elemen tetap.** Patok km, tombol WA melayang (logika sembunyi saat pelat terlihat), sakelar 3D (belum berefek). Tes E2E: tombol melayang tidak terlihat saat pelat terlihat.
- [ ] **A7. Pemeriksaan tahap A.** Lighthouse HP ≥ 90 Performance (tanpa 3D, harus mudah), axe 0 pelanggaran serius. Review anti-slop berpasangan atas screenshot. Commit + deploy preview.

### Tahap B — Atmosfer (perlu aset Dreamina)

- [ ] **B1. Video hero** 16:9/9:16 lewat `<source media>`, `preload="none"` di HP hemat data, poster tetap LCP.
- [ ] **B2. Video cerita jalan** diputar/dijeda dengan IntersectionObserver.
- [ ] **B3. Pola tenun** di `TenunRule` (maks. 3 pemakaian) dan kain penutup loader 3D.
- [ ] **B4. Pemeriksaan:** total transfer halaman awal tetap ≤ 350 KB sebelum video mulai, dan video hero ≤ 1,2 MB.

### Tahap C — Diorama 3D

- [ ] **C1. Kanvas menempel** (sticky) kanan/atas, dimuat malas via `canRender3D()`. Tanpa 3D, layout tidak bergeser (ruang yang sama berisi peta SVG/poster).
- [ ] **C2. Terrain + air + kabut + langit** (aset Task 7 rencana induk).
- [ ] **C3. Pita rute** terhubung ke `$trip.routeSlug`, digambar progresif.
- [ ] **C4. Mobil** terhubung ke `$trip.vehicleId`, dengan loader teks persentase.
- [ ] **C5. CameraRig** dengan tabel K0–K8 (§2). Simpan titik kamera di `src/three/keyframes.ts` sebagai data, bukan angka tersebar di komponen.
- [ ] **C6. Intro K0** + pudar video → kanvas. Dilewati pada reduced motion dan pada kunjungan kedua (sessionStorage).
- [ ] **C7. Mode malam K8.**
- [ ] **C8. Pemantau FPS** dan penurunan kualitas otomatis.
- [ ] **C9. Pemeriksaan tahap C:** 60 fps laptop, ≥ 30 fps HP Android menengah (catat modelnya). Lighthouse HP Performance ≥ 85. Uji konflik scroll vs. ganti rute (Fokus review #4 rencana induk).

### Tahap D — Penyelesaian

- [ ] **D1.** Open Graph (poster hero), JSON-LD `LocalBusiness`, judul & deskripsi halaman.
- [ ] **D2.** Event analitik `route_built`, `vehicle_selected`, `wa_clicked`, `3d_disabled`.
- [ ] **D3.** Review Web Interface Guidelines + review anti-slop final: bandingkan setiap section dengan 5 template motionsite.ai dan 3 situs rental lain. Section yang bisa ditukar tanpa terasa bedanya → desain ulang.
- [ ] **D4.** `build:release` (cek `[ISI`) lulus → rilis produksi.

---

## 5. Yang dibutuhkan dari pemilik, per tahap

| Tahap | Dibutuhkan |
|---|---|
| A | Nama usaha, nomor WA, alamat, jam, daftar armada + harga (atau setuju semua tampil "dikonfirmasi lewat WhatsApp"), jawaban FAQ |
| A5 | Wawancara singkat 1–2 sopir untuk Cerita jalan (bisa lewat voice note) |
| B | 6 video + 7 gambar Dreamina sesuai brief |
| B/S3/S5 | Foto mobil dan sopir asli |
| D | Domain |

Tahap A tidak menunggu aset apa pun. Tahap A bisa dikerjakan dan dirilis sebagai versi awal, sementara aset Dreamina dan foto disiapkan.
