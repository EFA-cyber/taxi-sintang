# PRD — Website 3D Rental Mobil Sintang

| | |
|---|---|
| **Nama kerja produk** | Taxi Sintang (nama usaha final: **[ISI: nama usaha]**) |
| **Pemilik dokumen** | [ISI: nama pemilik] |
| **Status** | Draft v1, siap direview |
| **Terakhir diperbarui** | 30 Oktober 2026 |
| **Dokumen terkait** | `docs/plans/2026-10-30-website-3d-rental-mobil-sintang.md` (rencana pembuatan), `docs/dreamina-asset-brief.md` (brief produksi aset Dreamina) |

Penanda **[ISI: …]** berarti data bisnis yang harus diisi pemilik usaha. Jangan diganti dengan angka atau nama karangan. Website tidak boleh tayang selama penanda ini masih ada (lihat §11, cek pra-rilis).

---

## 1. Ringkasan

**Visi.** Website ini dibangun dari satu hal yang hanya dimiliki Sintang: kota di pertemuan Sungai Kapuas dan Sungai Melawi, dengan Bukit Kelam di cakrawala dan jalan Trans-Kalimantan yang panjang ke Pontianak, Putussibau, dan Nanga Pinoh. Pengunjung tidak melihat katalog mobil biasa. Mereka *menyusun rutenya sendiri* di peta 3D wilayah Sintang, lalu situs memberi tahu mobil yang cocok untuk jalan itu, perkiraan biaya, lalu menyerahkan pesanan ke WhatsApp dalam satu ketukan.

**Masalah yang diselesaikan.**
1. Calon penyewa di Sintang (dan pendatang yang mendarat di Bandara Tebelian) sekarang memesan lewat broadcast WhatsApp, status Facebook, atau dari mulut ke mulut. Harga, ketersediaan, dan jenis armada tidak jelas sampai mereka bertanya satu per satu.
2. Website rental mobil yang ada nyaris identik: banner mobil putih, tiga kartu "Keunggulan Kami", tabel harga, tombol WhatsApp. Tidak ada yang menjawab pertanyaan nyata penyewa di Kalimantan Barat: *jalannya seperti apa, berapa jam, mobil apa yang kuat, berapa total biayanya?*

**Tujuan bisnis** (target diisi pemilik setelah tahu angka saat ini):
- Menaikkan jumlah pesanan yang masuk lewat WhatsApp dari website: **[ISI: target per bulan]** dalam 3 bulan pertama setelah rilis.
- Mengurangi pertanyaan berulang ("harga ke Pontianak berapa?", "ada Innova?") karena jawabannya sudah ada di situs.
- Muncul di pencarian lokal: "rental mobil Sintang", "sewa mobil Sintang Pontianak", "travel Sintang".

**Kriteria sukses (diukur 90 hari setelah rilis):**
| Metrik | Target |
|---|---|
| Klik "Kirim pesanan via WhatsApp" ÷ sesi | ≥ 6% |
| Pengunjung yang menyusun minimal 1 rute | ≥ 35% sesi |
| LCP di HP Android kelas menengah, 4G | ≤ 2,5 dtk |
| Ukuran muatan awal (sebelum 3D dimuat) | ≤ 350 KB terkompresi |
| Peringkat Google untuk "rental mobil sintang" | Halaman 1 |

---

## 2. Pengguna

| Persona | Siapa | Yang dia butuhkan dari situs |
|---|---|---|
| **Pak Herman, PNS / kontraktor** | Warga Sintang yang rutin dinas ke Pontianak | Harga pasti Sintang–Pontianak, berangkat subuh, mobil nyaman untuk 8–9 jam perjalanan |
| **Rina, pendatang** | Auditor/konsultan yang mendarat di Bandara Tebelian | Jemputan bandara, sewa harian dengan sopir, tidak kenal medan |
| **Keluarga Pak Yohanes** | Keluarga di kecamatan pedalaman | Mobil kuat untuk jalan tanah/laterit menuju kampung, saat Natal/Lebaran/Gawai |
| **Tim proyek / perkebunan** | Perusahaan sawit, tambang, atau LSM | Sewa bulanan, double cabin, invoice |
| **Pemilik usaha (admin)** | Pengelola rental | Mengubah harga, armada, dan ketersediaan tanpa memanggil programmer |

---

## 3. Arah kreatif dan aturan anti-slop

### 3.1 Ide inti: "Peta yang bisa ditempuh"

Seluruh situs dibangun di sekitar **satu objek 3D**: diorama topografi wilayah Sintang. Isinya pertemuan Kapuas dan Melawi, massa Bukit Kelam, dan pita jalan ke kota tujuan. Kamera bergerak di atas diorama ini mengikuti scroll dan pilihan pengguna. Diorama inilah satu-satunya hal yang boleh "berani" (prinsip *spend your boldness in one place*). Bagian lain tenang dan disiplin.

Sumber bahasa visual diambil dari dunia nyata penyewa:
- **Rambu penunjuk arah jalan nasional** (pelat hijau, huruf putih, nama kota + km). Rute dan harga ditampilkan sebagai pelat rambu, bukan kartu SaaS.
- **Patok kilometer** di tepi jalan. Penanda progres scroll berbentuk patok yang angkanya bertambah.
- **Tenun ikat Sintang** (pewarna alami merah-cokelat, motif geometris). Dipakai hanya sebagai pola garis tipis pada pembatas dan kain penutup loader, bukan wallpaper.
- **Air Kapuas** yang berwarna teh dan **kabut pagi** di atas sungai. Ini warna dasar dan suasana video latar.

### 3.2 Token desain

**Warna** (diuji kontras AA untuk teks):
| Nama | Hex | Peran |
|---|---|---|
| Kabut | `#DDE4E1` | Latar terang (abu kehijauan dingin, sengaja bukan krem) |
| Kelam | `#23292C` | Teks utama, latar mode gelap (granit Bukit Kelam) |
| Rambu | `#0F5B3A` | Pelat rute, tombol utama (hijau rambu jalan) |
| Teh Kapuas | `#8A5A2B` | Air sungai di 3D, aksen sekunder |
| Engkudu | `#9C2F24` | Merah tenun, khusus peringatan kondisi jalan dan pola tenun |
| Lampu | `#F2B33D` | Sorot lampu mobil di 3D dan fokus keyboard. Tidak untuk dekorasi |

**Tipografi:**
- **Overpass** (turunan Highway Gothic, huruf rambu jalan) untuk judul, nama kota, angka jarak dan harga. Bobot 800 untuk pelat rambu, 600 untuk judul.
- **Source Serif 4** untuk paragraf cerita (rute, sopir, tanya-jawab). Teks badan 18px / 1,6.
- Skala: 14 / 18 / 24 / 36 / 56 / 88 px. Panjang baris maksimal 68 karakter.

**Tata letak:** rata kiri. Grid 12 kolom di desktop, 4 kolom di HP, margin samping 16px. Diorama 3D menempel (*sticky*) di setengah kanan layar desktop. Di HP diorama menjadi pita setinggi 55vh di atas konten.

```
DESKTOP                                   HP
┌───────────────┬──────────────────────┐  ┌────────────────────┐
│ Teks/rambu    │                      │  │  Diorama 3D 55vh   │
│ (scroll)      │   DIORAMA 3D         │  │  (sticky)          │
│               │   (sticky, kamera    │  ├────────────────────┤
│ [Pelat rute]  │    ikut scroll)      │  │ Pelat rute         │
│               │                      │  │ Teks               │
│ patok km ▮    │                      │  │ ...                │
└───────────────┴──────────────────────┘  └────────────────────┘
```

### 3.3 Aturan anti-slop (wajib, diperiksa saat review)

Visual, **dilarang**:
- Hero berisi foto mobil putih melayang + gradien + "angka besar dengan label kecil".
- Barisan kartu identik dengan radius dan bayangan abu yang sama ("Keunggulan Kami ×3").
- Label huruf kapital berjarak lebar di atas setiap judul, string meta dengan titik tengah ("A · B · C"), panah "→" otomatis di setiap tombol.
- Nomor 01/02/03 kecuali kontennya benar-benar berurutan (alur pemesanan boleh).
- Animasi fade-slide-up di setiap section. Hanya ada **satu** momen gerak orkestrasi: kamera turun dari kabut ke pertemuan sungai saat halaman dimuat. Selebihnya gerak hanya merespons aksi pengguna.
- Bentuk abstrak melayang, partikel, atau blob yang tidak mewakili apa pun di Sintang.
- Foto stok orang tersenyum memegang kunci mobil.

Copy, **dilarang** memakai frasa:
"Perjalanan Anda, prioritas kami", "solusi terbaik", "terpercaya dan profesional", "pengalaman tak terlupakan", "nikmati kemudahan", "kami hadir untuk Anda", "harga bersaing", "jelajahi", "tingkatkan", serta kata "premium" tanpa bukti.

Copy, **wajib**:
- Menyebut tempat, jarak, jam, dan kondisi jalan yang nyata.
- Tombol menyebut hasilnya: "Kirim pesanan via WhatsApp", "Hitung biaya ke Pontianak", bukan "Submit" atau "Selengkapnya".
- Kalimat aktif, huruf kapital hanya di awal kalimat, bahasa Indonesia sehari-hari yang sopan. Boleh ada sapaan lokal secukupnya, tanpa dibuat-buat.

Contoh nada:
> ~~Nikmati perjalanan nyaman bersama armada terbaik kami.~~
> Sintang ke Pontianak sekitar 8 jam lewat Sekadau dan Sanggau. Berangkat jam 4 subuh, Anda sampai sebelum kantor tutup.

### 3.4 Referensi motionsite.ai

motionsite.ai tidak bisa dibuka dari lingkungan kerja ini (domainnya diblokir jaringan sesi). Dari deskripsi publik, situs itu adalah pustaka *prompt* untuk hero beranimasi dan latar video sinematik yang ditempel ke asisten AI. Yang diambil dari pendekatan itu:
1. **Latar video sinematik yang di-generate AI** sebagai lapisan atmosfer, diproduksi dengan Dreamina (Seedance) dari prompt yang ditulis khusus untuk Sintang (`docs/dreamina-asset-brief.md`), bukan prompt template umum.
2. **Hero yang bergerak sebagai satu adegan** (video plate + objek 3D + tipografi), bukan gambar statis.

Yang **tidak** diambil: gradien beranimasi generik, blob, dan template hero yang sama untuk semua klien. Itu justru sumber kesan "website yang itu-itu saja". Sebelum rilis, bandingkan hasil akhir dengan 5 template di motionsite.ai. Kalau ada section yang bisa ditukar dengan template mana pun tanpa terasa bedanya, desain ulang section itu.

---

## 4. Struktur situs dan isi section

Satu halaman panjang (single page) + halaman terpisah per rute untuk SEO.

| # | Section | Isi | Peran 3D |
|---|---|---|---|
| 1 | **Pembuka: Kabut Kapuas** | Video Dreamina kabut subuh di atas Kapuas (loop 8 dtk) melebur ke diorama 3D. Judul: *"Mau ke mana dari Sintang?"* Satu kolom input tujuan langsung di hero | Kamera turun dari awan ke pertemuan Kapuas–Melawi (satu-satunya animasi otomatis) |
| 2 | **Penyusun rute** | Pilih titik jemput (Bandara Tebelian, kota Sintang, kecamatan) dan tujuan, tanggal, jumlah penumpang, dengan/tanpa sopir. Hasilnya pelat rambu hijau: kota, km, perkiraan jam, ruas jalan rusak/laterit, rekomendasi mobil, perkiraan biaya | Pita jalan menyala dari Sintang ke tujuan, kamera mengikuti rute |
| 3 | **Armada** | Tiap mobil dijelaskan dengan konteks: kapasitas, bagasi, ground clearance, "cocok untuk" (aspal antarkota / jalan tanah / keluarga besar). Model 3D bisa diputar | Model GLB low-poly berganti di atas diorama, berdiri di ruas jalan yang cocok |
| 4 | **Cerita jalan** | 3–4 rute utama (Pontianak, Putussibau, Nanga Pinoh, Sekadau) dengan catatan perjalanan singkat: titik istirahat, SPBU, jam rawan, musim hujan | Kamera terbang ke tiap rute saat cerita discroll; penanda patok km |
| 5 | **Sopir** | Foto asli sopir (bukan AI) + nama + rute yang dikuasai + bahasa (Indonesia, Dayak, Melayu Sintang) | Tidak ada; section tenang |
| 6 | **Cara pesan** | 3 langkah berurutan (boleh bernomor): susun rute → kirim WhatsApp → konfirmasi & DP | Tidak ada |
| 7 | **Tanya-jawab** | Syarat sewa lepas kunci, DP, BBM, tol/penyeberangan, overtime, batas wilayah | Tidak ada |
| 8 | **Penutup** | Alamat pool, peta Google, jam operasional, nomor WA, tombol kirim pesanan | Diorama zoom-out, lampu mobil menyala di malam hari |

Halaman per rute (`/rute/sintang-pontianak`, dst.) menampilkan isi section 4 untuk satu rute + penyusun rute yang sudah terisi. Halaman ini statis, bisa diindeks, dan punya schema `Service` + `LocalBusiness`.

---

## 5. User stories dan kriteria penerimaan

**US-1 Hitung perjalanan**
*Sebagai pendatang, saya ingin memilih tujuan dan langsung melihat jarak, durasi, dan perkiraan biaya, supaya tidak perlu tanya satu per satu.*
- Memilih tujuan memunculkan pelat rambu dalam < 300 ms (data lokal, tanpa server).
- Pelat menampilkan: nama kota, km, perkiraan jam, rekomendasi mobil, rentang biaya (min–maks), dan apa saja yang sudah termasuk (sopir, BBM, makan sopir).
- Jika pemilik belum mengisi harga untuk rute itu, pelat menampilkan "Harga dikonfirmasi lewat WhatsApp", bukan Rp 0.
- Rute tergambar di diorama 3D. Saat 3D mati (fallback), rute tergambar di peta SVG.

**US-2 Kirim pesanan**
*Sebagai penyewa, saya ingin pesanan saya terkirim ke WhatsApp dalam format rapi, supaya admin tidak perlu bertanya ulang.*
- Tombol "Kirim pesanan via WhatsApp" membuka `wa.me/[ISI: nomor]` dengan pesan berisi: jemput, tujuan, tanggal & jam, jumlah penumpang, mobil, dengan/tanpa sopir, perkiraan biaya.
- Tanggal yang sudah lewat tidak bisa dipilih. Jumlah penumpang melebihi kapasitas mobil memunculkan saran mobil lain.
- Tombol berfungsi di HP (aplikasi WA) dan desktop (WA Web).

**US-3 Pilih mobil sesuai medan**
*Sebagai keluarga yang pulang kampung lewat jalan tanah, saya ingin tahu mobil mana yang kuat.*
- Tiap mobil punya label medan dari data (`aspal`, `laterit`, `offroad-ringan`).
- Rute dengan ruas laterit hanya merekomendasikan mobil berlabel `laterit` atau `offroad-ringan`.

**US-4 Situs tetap cepat di HP biasa**
*Sebagai pengguna HP Android dengan kuota terbatas, saya ingin situs terbuka cepat.*
- Saat `navigator.connection.saveData` aktif, koneksi 2G/3G, `prefers-reduced-motion`, atau WebGL tidak tersedia: 3D tidak dimuat. Tampil poster statis + peta SVG, dan semua fungsi pemesanan tetap jalan.
- Ada tombol "Matikan 3D" yang diingat di browser.
- Model 3D dan video dimuat setelah halaman interaktif.

**US-5 Admin mengubah data**
*Sebagai pemilik usaha, saya ingin mengubah harga dan armada sendiri.*
- Semua data bisnis ada di `src/data/*.json` (rute, armada, kontak, FAQ). Mengubah angka lalu push ke GitHub otomatis memperbarui situs (deploy Vercel).
- Fase 2: panel admin sederhana (lihat §8).

**US-6 Aksesibel**
- Semua fungsi bisa dipakai dengan keyboard. Kanvas 3D punya deskripsi teks alternatif, dan informasi rute tidak pernah *hanya* ada di 3D.
- Kontras teks ≥ 4.5:1. Fokus keyboard terlihat (warna Lampu).

---

## 6. Kebutuhan fungsional

**F1. Data rute** (`routes.json`): id, nama kota, titik koordinat polyline, jarak km, durasi jam (min–maks), ruas (`aspal` | `laterit` | `rusak` beserta km mulai–selesai), catatan perjalanan, harga per mobil (boleh `null`).
Jarak dan durasi awal diambil dari Google Maps lalu **diverifikasi sopir**. Angka di dokumen ini hanya perkiraan untuk uji coba.

**F2. Data armada** (`fleet.json`): id, nama model, kapasitas, bagasi, transmisi, label medan, harga harian lepas kunci & dengan sopir (boleh `null`), file GLB, foto asli.

**F3. Kalkulator biaya** (fungsi murni, diuji unit):
`estimasi = harga_rute[mobil] ?? (harga_harian[mobil] × hari)` + biaya tambahan (overtime, luar kota) sesuai `pricing-rules.json`. Hasilnya selalu rentang dan mencantumkan apa yang termasuk.

**F4. Pembuat pesan WhatsApp** (fungsi murni, diuji unit): template pesan, URL-encoded, maksimal 1.500 karakter.

**F5. Adegan 3D:** diorama, pita rute, model mobil, kontrol kamera berbasis scroll dan state rute.

**F6. Fallback:** poster AVIF/WebP + peta SVG dari polyline yang sama.

**F7. SEO lokal:** halaman statis per rute, `LocalBusiness` JSON-LD dengan alamat **[ISI]**, sitemap, Open Graph memakai still frame dari Dreamina.

**F8. Analitik** (tanpa cookie, mis. Plausible / Umami / Vercel Analytics): event `route_built`, `vehicle_selected`, `wa_clicked`, `3d_disabled`.

---

## 7. Spesifikasi teknis

| Bagian | Pilihan | Alasan |
|---|---|---|
| Framework | **Astro 5** + pulau React (islands) | Halaman rute statis untuk SEO. JS hanya dikirim untuk penyusun rute dan 3D |
| 3D | **React Three Fiber + drei** (sesuai skill `3d-web-experience`: proyek React, adegan kompleks) | Kontrol kamera & scroll, `useGLTF`, `useProgress` |
| Scroll | GSAP ScrollTrigger + Lenis | Kamera di-*scrub* oleh scroll |
| Model | GLB, Draco + tekstur WebP via `gltf-transform` | Target < 100K poligon total, < 1,5 MB per mobil |
| Diorama | Heightmap DEM (SRTM/Copernicus 30 m) wilayah Sintang → mesh di Blender, dipangkas & disederhanakan | Bentuk Bukit Kelam dan alur sungai yang akurat, bukan karangan |
| Video & gambar atmosfer | **Dreamina** (Seedance untuk video, model gambar Dreamina untuk still/tekstur) dijalankan pemilik di laptop | Lihat `docs/dreamina-asset-brief.md` |
| Styling | CSS biasa dengan custom properties (token §3.2) | Tanpa kit UI, supaya tidak terlihat seperti template |
| Tes | Vitest (logika), Playwright (alur & fallback), Lighthouse CI | |
| Hosting | Vercel (gratis cukup), domain **[ISI]** | Skill `deploy-to-vercel` |

**Anggaran performa:**
| Muatan | Batas |
|---|---|
| HTML + CSS + JS kritis | 350 KB gzip |
| Poster hero | 120 KB (AVIF) |
| Video hero | 1,2 MB (H.264/H.265 720p, 8 dtk, tanpa audio) |
| Diorama GLB | 2 MB |
| Per mobil GLB | 1,5 MB, dimuat saat dibutuhkan |
| FPS 3D di HP menengah | ≥ 30, DPR dibatasi 1,5 |

---

## 8. Prioritas (MoSCoW)

**Must (rilis 1):** hero + diorama, penyusun rute + pelat rambu, kalkulator biaya, pesan WhatsApp, armada (minimal foto + data, 3D untuk 2 mobil), fallback non-3D, cara pesan, FAQ, kontak, halaman rute Pontianak, SEO dasar.

**Should:** 3D semua armada, cerita jalan 4 rute, section sopir, tombol matikan 3D, analitik, mode malam diorama.

**Could:** panel admin (Decap CMS di atas JSON di GitHub), status ketersediaan mobil per tanggal, bahasa Inggris, info cuaca rute.

**Won't (rilis ini):** pembayaran online, akun pengguna, aplikasi mobile, pelacakan GPS armada.

---

## 9. Risiko

| Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|
| HP kelas bawah tidak kuat 3D | Tinggi | Tinggi | Deteksi kemampuan + fallback penuh, 3D tidak pernah wajib |
| Aset Dreamina terlihat "AI" (artefak, mobil cacat) | Tinggi | Sedang | Mobil **tidak** dibuat dengan AI video. AI hanya untuk alam dan atmosfer. Foto mobil & sopir asli. Kurasi ketat (§brief) |
| Harga & jarak salah | Tinggi | Sedang | Data diverifikasi pemilik & sopir. Selalu tampil sebagai "perkiraan" |
| Pemilik tidak sempat mengisi data | Sedang | Sedang | Cek pra-rilis memblokir build jika masih ada `[ISI]` |
| Lisensi aset Dreamina | Sedang | Rendah | Pastikan paket Dreamina mengizinkan pemakaian komersial sebelum rilis |
| Model 3D mobil bermerek | Sedang | Sedang | Pakai model low-poly generik bergaya "MPV / SUV / double cabin" tanpa logo |

---

## 10. Pertanyaan terbuka (untuk pemilik)

1. Nama usaha, logo (jika ada), alamat pool, nomor WhatsApp, jam operasional.
2. Daftar armada nyata: model, tahun, jumlah unit, foto.
3. Harga: harian lepas kunci, harian dengan sopir, paket per rute, overtime, aturan BBM.
4. Rute yang paling sering dilayani dan wilayah yang tidak dilayani.
5. Syarat sewa lepas kunci (KTP, SIM, jaminan, DP).
6. Apakah sopir bersedia difoto dan ditampilkan namanya?
7. Domain yang diinginkan.

## 11. Cek pra-rilis

- [ ] Tidak ada penanda `[ISI` di `src/` maupun output build (dicek otomatis)
- [ ] Semua harga dan jarak sudah dikonfirmasi pemilik
- [ ] Lighthouse HP: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95
- [ ] Alur pesan WA dites di Android, iPhone, dan desktop
- [ ] Fallback dites dengan WebGL dimatikan dan mode hemat data
- [ ] Review anti-slop §3.3 lulus (dua orang)
- [ ] Lisensi aset Dreamina & model 3D tercatat di `docs/credits.md`
