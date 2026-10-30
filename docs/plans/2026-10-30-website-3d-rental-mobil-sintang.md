# Website 3D Rental Mobil Sintang — Rencana Pembuatan

> **Untuk agen/pengembang:** kerjakan task satu per satu, berurutan. Setiap langkah memakai checkbox (`- [ ]`). Commit di akhir setiap task.

**Tujuan:** situs satu halaman + halaman per rute. Pengunjung menyusun rute di diorama 3D wilayah Sintang, melihat perkiraan biaya dan mobil yang cocok, lalu mengirim pesanan ke WhatsApp.

**Arsitektur:** Astro 5 menghasilkan HTML statis. Dua pulau React: `RoutePlanner` (form + pelat rambu, selalu dimuat) dan `Diorama` (R3F, dimuat malas hanya jika perangkat mampu). Keduanya berbagi state lewat satu store kecil (`nanostores`). Semua data bisnis ada di JSON yang divalidasi dengan Zod saat build.

**Tech stack:** Astro 5, React 18, TypeScript, @react-three/fiber 8, @react-three/drei 9, three, GSAP + ScrollTrigger, Lenis, nanostores, Zod, Vitest, Playwright, @gltf-transform/cli, sharp, ffmpeg.

**Spesifikasi:** `PRD.md` (dibaca bersama dokumen ini). Aset: `docs/dreamina-asset-brief.md`.

## Batasan global

- Token warna & huruf persis seperti PRD §3.2: Kabut `#DDE4E1`, Kelam `#23292C`, Rambu `#0F5B3A`, Teh Kapuas `#8A5A2B`, Engkudu `#9C2F24`, Lampu `#F2B33D`. Overpass (judul/angka) + Source Serif 4 (badan).
- Aturan anti-slop PRD §3.3 berlaku untuk setiap task. Daftar frasa terlarang dicek otomatis (Task 10).
- Anggaran performa PRD §7: JS+CSS kritis ≤ 350 KB gzip, diorama ≤ 2 MB, per mobil ≤ 1,5 MB, video hero ≤ 1,2 MB.
- 3D tidak pernah wajib: setiap informasi juga tersedia di DOM.
- Copy berbahasa Indonesia, huruf kapital hanya di awal kalimat, tanpa label huruf kapital semua.
- Harga yang `null` tampil "Harga dikonfirmasi lewat WhatsApp". Tidak pernah Rp 0.

## Fokus review

Lima risiko yang tidak sepenuhnya dicakup tes otomatis:
1. **HP Android murah:** 3D terdeteksi "mampu" tapi FPS < 20. Uji di perangkat nyata, dan pastikan pemantau FPS (Task 6) menurunkan kualitas atau mematikan 3D.
2. **Pesan WhatsApp terpotong/berantakan** di iOS karena encoding karakter (é, emoji, baris baru).
3. **Zona waktu:** tanggal dihitung dengan WIB (`Asia/Pontianak`), bukan zona waktu browser pendatang.
4. **Scroll + kamera melompat** saat pengguna mengubah rute di tengah halaman (state rute vs. posisi scroll).
5. **Copy terasa generik** meskipun lolos daftar frasa terlarang. Butuh pembaca manusia.

## Struktur file

```
astro.config.mjs
package.json
src/
  styles/tokens.css          token warna, huruf, skala, spasi
  styles/base.css            reset, tipografi dasar, fokus
  data/schema.ts             skema Zod untuk semua JSON
  data/routes.json           rute (polyline, km, durasi, ruas, harga)
  data/fleet.json            armada
  data/pricing-rules.json    overtime, biaya luar kota
  data/site.json             nama usaha, WA, alamat, jam
  data/faq.json
  lib/fare.ts                estimateFare() fungsi murni
  lib/whatsapp.ts            buildWhatsAppUrl() fungsi murni
  lib/recommend.ts           recommendVehicles() fungsi murni
  lib/capability.ts          canRender3D() deteksi perangkat
  lib/store.ts               nanostores: $trip, $prefs
  components/RoutePlanner.tsx
  components/RouteSign.tsx   pelat rambu hijau
  components/RouteMapSvg.tsx fallback peta SVG
  components/FleetList.astro
  components/KmPost.tsx      penanda progres patok km
  components/TenunRule.astro pembatas pola tenun
  three/Diorama.tsx          root kanvas (lazy)
  three/Terrain.tsx          GLB diorama + material
  three/RouteRibbon.tsx      pita rute bercahaya
  three/Vehicle.tsx          model mobil
  three/CameraRig.tsx        kamera: intro, scroll, fokus rute
  pages/index.astro
  pages/rute/[slug].astro
scripts/
  build-assets.mjs           kompres video/gambar Dreamina & GLB
  check-placeholders.mjs     gagal jika ada "[ISI"
  check-copy.mjs             gagal jika ada frasa terlarang
tests/
  unit/*.test.ts
  e2e/*.spec.ts
assets-src/                  aset mentah (tidak dipublikasikan)
public/media/                aset hasil kompres
```

---

## Task 1 — Kerangka proyek, token desain, dan halaman kosong yang benar

**File:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `.gitignore`

- [ ] `npm create astro@latest . -- --template minimal --typescript strict`, tambahkan `@astrojs/react`, `@astrojs/sitemap`.
- [ ] Muat font dari Google Fonts: Overpass (600, 800) dan Source Serif 4 (400, 400 italic, 600), `display=swap`, preload Overpass 800.
- [ ] `tokens.css`: definisikan `--kabut`, `--kelam`, `--rambu`, `--teh`, `--engkudu`, `--lampu`. Skala huruf `--t-14 … --t-88`. Mode gelap menukar latar ke Kelam dan teks ke Kabut.
- [ ] `base.css`: `:focus-visible { outline: 3px solid var(--lampu); outline-offset: 3px }`, `body` font Source Serif 4 18px/1.6, `max-width: 68ch` untuk paragraf.
- [ ] `index.astro` berisi landmark kosong per section PRD §4 (`<section id="rute">`, dll.) dengan judul sementara.
- [ ] Verifikasi: `npm run build` sukses. Buka di 375px dan 1440px, tidak ada scroll horizontal.
- [ ] Commit: `chore: kerangka Astro dan token desain`

## Task 2 — Skema & data bisnis + cek placeholder

**File:** `src/data/schema.ts`, `src/data/*.json`, `scripts/check-placeholders.mjs`, `tests/unit/schema.test.ts`

Antarmuka (`schema.ts`):
```ts
type Surface = 'aspal' | 'laterit' | 'rusak';
type Terrain = 'aspal' | 'laterit' | 'offroad-ringan';
Route   = { slug; name; from: 'sintang'|'tebelian'; km: number; hours: [number, number];
            segments: { surface: Surface; fromKm: number; toKm: number }[];
            polyline: [lon, lat][]; notes: string[]; price: Record<vehicleId, number|null> }
Vehicle = { id; name; seats; luggage; transmission: 'MT'|'AT'; terrain: Terrain[];
            daily: { selfDrive: number|null; withDriver: number|null };
            glb?: string; photo: string }
```
- [ ] Tulis tes dulu: JSON contoh valid lolos; `km` negatif, segmen yang melebihi `km`, dan `vehicleId` harga yang tidak ada di armada → gagal.
- [ ] Implementasi skema, jalankan tes hingga lulus.
- [ ] Isi `routes.json` dengan 4 rute (Pontianak, Putussibau, Nanga Pinoh, Sekadau) + jemput Bandara Tebelian. km/durasi dari Google Maps, ditandai `"verified": false`. Semua harga `null` dan semua data usaha di `site.json` diisi `"[ISI: …]"`.
- [ ] `check-placeholders.mjs`: cari `[ISI` di `src/` dan `dist/`, keluar dengan kode 1 + daftar lokasinya. Pasang sebagai `prebuild` hanya untuk `npm run build:release`, supaya dev tetap jalan.
- [ ] Commit: `feat: skema data rute dan armada`

## Task 3 — Logika murni: biaya, rekomendasi, WhatsApp

**File:** `src/lib/fare.ts`, `src/lib/recommend.ts`, `src/lib/whatsapp.ts`, `tests/unit/{fare,recommend,whatsapp}.test.ts`

Antarmuka:
```ts
estimateFare(route: Route|null, vehicle: Vehicle, opts: { days: number; withDriver: boolean },
             rules: PricingRules): { min: number; max: number; includes: string[] } | null
recommendVehicles(route: Route, pax: number, fleet: Vehicle[]): Vehicle[]  // urut paling cocok
buildWhatsAppUrl(phone: string, trip: Trip, fare: Fare|null): string
```
- [ ] Tes `estimateFare`: harga rute ada → dipakai. Harga rute `null` tapi harian ada → harian × hari. Keduanya `null` → `null`. Hari < 1 → error.
- [ ] Tes `recommendVehicles`: rute dengan segmen `laterit` tidak mengembalikan mobil yang hanya `aspal`. `pax` melebihi kapasitas semua mobil → array kosong.
- [ ] Tes `buildWhatsAppUrl`: nomor `0812…` dinormalisasi ke `62812…`. Baris baru ter-encode `%0A`. Biaya `null` menulis "Harga dikonfirmasi". Tanggal ditulis dalam WIB (`Asia/Pontianak`), contoh "Sabtu, 14 November 2026, 04.00 WIB". Panjang ≤ 1.500 karakter.
- [ ] Implementasi hingga semua tes lulus. Format rupiah dengan `Intl.NumberFormat('id-ID')`.
- [ ] Commit: `feat: kalkulator biaya, rekomendasi mobil, pesan WhatsApp`

## Task 4 — Penyusun rute + pelat rambu + peta SVG (tanpa 3D)

**File:** `src/lib/store.ts`, `src/components/RoutePlanner.tsx`, `RouteSign.tsx`, `RouteMapSvg.tsx`, `tests/e2e/planner.spec.ts`

Situs harus sudah bisa dipakai penuh di akhir task ini, tanpa 3D.
- [ ] `store.ts`: `$trip = { pickup, routeSlug, date, pax, withDriver, vehicleId }`, disinkronkan ke query string (`?ke=pontianak&pax=5`) supaya tautan bisa dibagikan.
- [ ] `RoutePlanner`: elemen form asli (`<select>`, `<input type="date" min=hari-ini-WIB>`, stepper penumpang, toggle sopir) dengan label yang terlihat.
- [ ] `RouteSign`: pelat hijau Rambu, nama kota Overpass 800, km dan jam, baris ruas (laterit ditandai Engkudu + ikon + teks, bukan warna saja), mobil rekomendasi, rentang biaya, tombol "Kirim pesanan via WhatsApp". Muncul dengan satu transisi 200 ms karena merespons aksi pengguna.
- [ ] `RouteMapSvg`: proyeksikan polyline yang sama ke SVG. Sungai Kapuas & Melawi dari GeoJSON OSM yang disederhanakan.
- [ ] E2E: pilih Pontianak, 5 penumpang → pelat menampilkan "Pontianak", km, dan tautan `wa.me` berisi "Pontianak". Tanggal kemarin tidak bisa dipilih. Navigasi penuh dengan Tab/Enter.
- [ ] Commit: `feat: penyusun rute dan pelat rambu`

## Task 5 — Isi section non-3D

**File:** `src/components/FleetList.astro`, `TenunRule.astro`, `KmPost.tsx`, `src/pages/index.astro`, `src/data/faq.json`

- [ ] Armada: daftar dengan foto asli (placeholder abu bertuliskan "Foto [model] menyusul" sampai ada), data dari JSON, label medan sebagai teks ("Kuat di jalan tanah").
- [ ] Cerita jalan: 4 rute, tiap rute 2–4 catatan dari `routes.json.notes`, ditulis dari wawancara sopir. Draf awal ditandai `[ISI: konfirmasi sopir]`.
- [ ] Sopir, Cara pesan (3 langkah bernomor: konten berurutan), FAQ (`<details>`), Penutup (alamat, embed Google Maps yang dimuat saat diklik, jam, WA).
- [ ] `KmPost`: patok tetap di tepi kiri desktop, angka km naik sesuai progres scroll (0 → km rute terpilih). Di HP disembunyikan.
- [ ] `TenunRule`: pembatas 8px dari `pola-tenun` (SVG/PNG), hanya di antara kelompok section besar (maks. 3 kali).
- [ ] Review copy terhadap PRD §3.3 sebelum commit.
- [ ] Commit: `feat: section armada, cerita jalan, sopir, cara pesan, FAQ, kontak`

## Task 6 — Deteksi kemampuan & pemuatan malas 3D

**File:** `src/lib/capability.ts`, `src/three/Diorama.tsx` (kerangka), `tests/unit/capability.test.ts`, `tests/e2e/fallback.spec.ts`

```ts
canRender3D(env: { webgl2: boolean; saveData: boolean; effectiveType?: string;
                   reducedMotion: boolean; deviceMemory?: number; userOptOut: boolean }): boolean
```
- [ ] Tes: `false` jika salah satu: tanpa WebGL2, saveData, `2g`/`3g`/`slow-2g`, reduced motion, `deviceMemory < 3`, opt-out. Selain itu `true`.
- [ ] Implementasi. Muat `Diorama` dengan `client:visible` + `import()` dinamis hanya jika `true`, dan hanya setelah `requestIdleCallback`.
- [ ] Pemantau FPS di dalam kanvas: rata-rata < 24 selama 3 dtk → DPR turun ke 1. Masih < 20 → lepas kanvas, tampilkan fallback, simpan `3d=off`.
- [ ] Tombol "Matikan 3D" / "Nyalakan 3D", disimpan di `localStorage` (dengan try/catch).
- [ ] E2E: Chromium dengan `--disable-webgl` → tidak ada `<canvas>`, peta SVG tampil, alur WA tetap jalan.
- [ ] Commit: `feat: deteksi kemampuan dan fallback 3D`

## Task 7 — Pipeline aset (Dreamina, diorama, mobil)

**File:** `scripts/build-assets.mjs`, `docs/credits.md`, `assets-src/README.md`

- [ ] Video: `ffmpeg -i in.mp4 -an -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -movflags +faststart out.mp4` + versi WebM/AV1. Gagal jika > 1,2 MB.
- [ ] Gambar: sharp → AVIF + WebP, lebar 640/1280/1920. Poster hero ≤ 120 KB.
- [ ] Diorama: DEM SRTM/Copernicus area ±80 km sekitar Sintang → Blender (displace + decimate) → ekspor GLB. Sungai dari OSM sebagai mesh terpisah. Tandai Bukit Kelam sebagai node bernama `kelam`.
- [ ] Semua GLB: `gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`. Gagal jika melebihi anggaran.
- [ ] Sementara aset Dreamina belum ada, skrip memakai placeholder warna solid dan mencetak daftar file yang kurang dari brief.
- [ ] Commit: `chore: pipeline kompres aset`

## Task 8 — Adegan 3D: diorama, pita rute, mobil, kamera

**File:** `src/three/{Diorama,Terrain,RouteRibbon,Vehicle,CameraRig}.tsx`

- [ ] `Terrain`: `useGLTF` diorama, material hutan dari `tekstur-hutan-atas`, air dari `tekstur-air-kapuas` dengan riak shader sederhana, environment dari `langit-pagi-hdri`, kabut `THREE.Fog` warna Kabut.
- [ ] `RouteRibbon`: `TubeGeometry` dari polyline rute terpilih (diproyeksikan ke koordinat diorama), digambar progresif (`drawRange`) saat rute berubah. Segmen laterit berwarna Engkudu, aspal berwarna Lampu redup.
- [ ] `Vehicle`: model dari armada terpilih, berdiri di titik awal rute, dimuat saat dipilih (Suspense + `useProgress` → teks "Memuat mobil 40%").
- [ ] `CameraRig`: (a) intro sekali jalan 2,4 dtk dari awan ke pertemuan sungai, dilewati jika reduced motion. (b) ScrollTrigger scrub per section. (c) saat rute berubah, kamera di-tween ke bounding box rute. Aturan konflik: perubahan rute membatalkan tween scroll yang sedang berjalan, lalu scroll berikutnya melanjutkan dari posisi baru tanpa lompatan.
- [ ] Kanvas punya `aria-hidden="true"`. Deskripsi rute sudah ada di pelat rambu.
- [ ] Verifikasi manual: 60 fps di laptop, ≥ 30 fps di HP Android menengah (catat model HP di PR).
- [ ] Commit: `feat: diorama 3D, pita rute, kamera scroll`

## Task 9 — Hero: video Dreamina → diorama

**File:** `src/components/Hero.astro`, `src/pages/index.astro`

- [ ] `<video autoplay muted loop playsinline poster>` dengan sumber 16:9/9:16 lewat `<source media>`. Tanpa 3D: video + poster saja. Saat reduced motion: poster saja.
- [ ] Dengan 3D: video memudar ke kanvas diorama saat intro kamera selesai (satu-satunya momen gerak otomatis).
- [ ] Judul "Mau ke mana dari Sintang?" (Overpass 800, `--t-88` desktop / `--t-56` HP) + input tujuan yang menulis ke `$trip` dan menggulir ke penyusun rute.
- [ ] LCP harus poster atau judul, bukan video. Cek di Lighthouse.
- [ ] Commit: `feat: hero video kabut Kapuas`

## Task 10 — Halaman rute, SEO, analitik, cek copy

**File:** `src/pages/rute/[slug].astro`, `scripts/check-copy.mjs`, `src/layouts/Base.astro`

- [ ] `getStaticPaths` dari `routes.json`. Judul halaman "Sewa mobil Sintang–Pontianak: jarak, waktu tempuh, dan biaya". Penyusun rute terisi.
- [ ] JSON-LD `LocalBusiness` (dari `site.json`) + `Service` per rute. Open Graph memakai poster hero. Sitemap.
- [ ] Analitik tanpa cookie: event `route_built`, `vehicle_selected`, `wa_clicked`, `3d_disabled`.
- [ ] `check-copy.mjs`: daftar frasa terlarang PRD §3.3 (tidak peka huruf besar/kecil), dijalankan pada `dist/**/*.html`, gagal jika ada temuan.
- [ ] Commit: `feat: halaman rute, SEO lokal, analitik, cek copy`

## Task 11 — QA, aksesibilitas, review anti-slop, deploy

**File:** `tests/e2e/a11y.spec.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`

- [ ] `@axe-core/playwright` di beranda & satu halaman rute: 0 pelanggaran serius.
- [ ] Lighthouse CI profil HP: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95. Anggaran ukuran dari Batasan global.
- [ ] CI: `npm test`, `npm run build`, `check-copy`, Playwright, Lighthouse.
- [ ] Review Web Interface Guidelines (skill `web-design-guidelines`) pada semua komponen.
- [ ] Review anti-slop: bandingkan screenshot tiap section dengan 5 template motionsite.ai dan 3 situs rental mobil lain. Section yang bisa ditukar tanpa terasa bedanya → desain ulang.
- [ ] Deploy preview ke Vercel (skill `deploy-to-vercel`). Rilis produksi hanya setelah `build:release` (cek `[ISI`) lulus dan PRD §11 tercentang.
- [ ] Commit: `chore: QA, CI, dan deploy`

---

## Urutan & ketergantungan

```
1 → 2 → 3 → 4 → 5 ─────────────┐
            └→ 6 → 7 → 8 → 9 ──┴→ 10 → 11
```
Task 4–5 (situs berfungsi tanpa 3D) bisa dirilis lebih dulu sebagai versi awal sambil menunggu aset Dreamina dan diorama.

## Skill yang dipakai

| Skill | Dipakai untuk |
|---|---|
| `3d-web-experience` | Pemilihan R3F, pipeline GLB, scroll-driven 3D, anti-pattern (3D demi 3D, desktop-only, tanpa loading) |
| `frontend-design` | Token, arah visual, aturan anti-slop, copy |
| `prd-writer` | Struktur PRD, user stories, MoSCoW, risiko |
| `writing-plans` | Struktur rencana ini |
| `web-design-guidelines` | Audit UI Task 11 |
| `webapp-testing` | Tes Playwright Task 4, 6, 11 |
| `deploy-to-vercel` | Task 11 |

Skill lain di arsip (`claude-skills.zip`, 1.088 skill) sebagian besar berupa otomasi SaaS yang tidak relevan dengan proyek ini, termasuk `dreamstudio-automation` (Stability AI, bukan Dreamina), sehingga tidak dipakai.
