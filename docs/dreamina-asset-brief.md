# Brief Aset Dreamina — Website Rental Mobil Sintang

Dreamina terpasang di laptop pemilik. Pembangunan website berjalan di tempat lain, jadi brief ini adalah serah-terimanya: jalankan tiap prompt di Dreamina, pilih hasil terbaik, simpan dengan **nama file persis seperti tabel**, lalu taruh di folder `assets-src/dreamina/` repo ini (file mentah, tidak dipublikasikan). Skrip `npm run assets` (Task 7 di rencana) mengompresnya ke `public/media/`.

## Aturan umum

- **AI hanya untuk alam, cuaca, cahaya, dan tekstur.** Jangan generate mobil, sopir, pelanggan, logo, atau teks. Mobil dan orang memakai foto asli, karena mobil hasil AI hampir selalu cacat (roda, pelat, pantulan) dan langsung terlihat palsu.
- Prompt ditulis dalam bahasa Inggris karena hasilnya biasanya lebih stabil. Tempelkan bagian **Gaya bersama** di akhir setiap prompt.
- Video: model Seedance terbaru yang tersedia di akun Anda, 1080p, tanpa audio, gerak kamera lambat. Gambar: model gambar Dreamina terbaru, resolusi tertinggi.
- Generate minimal 4 variasi per aset. Tolak hasil yang punya: teks/huruf palsu, bangunan bergaya bukan Kalimantan (pagoda, kuil Bali, gedung kaca), warna jenuh seperti HDR, air biru jernih (Kapuas berwarna teh), atau gerak yang "melar".
- Cek lisensi paket Dreamina untuk pemakaian komersial sebelum rilis, lalu catat di `docs/credits.md`.

**Gaya bersama** (tempel di akhir prompt):
```
Documentary realism, shot on a full-frame cinema camera, natural overcast light, soft haze, muted greens and tea-brown river water, gentle film grain, no text, no logos, no people, no vehicles, no watermark.
```

## Video (Seedance)

| File | Rasio · durasi | Dipakai di | Prompt |
|---|---|---|---|
| `hero-kabut-kapuas-16x9.mp4` | 16:9 · 8 dtk, harus bisa di-loop | Hero desktop, di belakang diorama | `Slow aerial drift at dawn above a wide tea-brown tropical river in West Borneo, thick low mist hugging the water, dense rainforest and scattered wooden stilt houses along the banks, a solitary steep forested granite monolith rising in the far distance through the fog. Camera glides forward very slowly, steady, no cuts.` |
| `hero-kabut-kapuas-9x16.mp4` | 9:16 · 8 dtk, loop | Hero HP | Prompt yang sama, tambahkan: `Vertical framing, river curving from bottom to top of frame.` |
| `pertemuan-sungai.mp4` | 16:9 · 6 dtk | Transisi ke penyusun rute | `High aerial top-down view of two large brown tropical rivers merging into one, slightly different water tones meeting at the confluence, a small riverside town with metal roofs on the point between them, light morning haze. Very slow clockwise rotation.` |
| `jalan-laterit-hujan.mp4` | 16:9 · 6 dtk | Cerita jalan (ruas laterit) | `Low camera at road level on an empty red laterite dirt road through oil palm plantation and secondary forest in Borneo, light tropical rain, puddles reflecting grey sky, camera slowly pushes forward along the road.` |
| `trans-kalimantan-senja.mp4` | 16:9 · 6 dtk | Cerita jalan (Sintang–Pontianak) | `Empty two-lane asphalt highway winding through rolling hills of rainforest and palm plantations in West Kalimantan at golden hour, cumulus clouds, power line poles along the road, camera on a slow crane rising up.` |
| `malam-kota-sungai.mp4` | 16:9 · 6 dtk | Penutup (mode malam) | `Blue hour over a small river town in Borneo, warm lights from riverside wooden houses and a long bridge reflecting on dark brown water, faint mist, camera static with subtle parallax.` |

## Gambar

| File | Rasio | Dipakai di | Prompt |
|---|---|---|---|
| `poster-hero-16x9.png` | 16:9 | Poster fallback desktop & Open Graph | Ambil frame terbaik dari `hero-kabut-kapuas-16x9.mp4` (Dreamina: ekspor frame atau upscale frame). Jangan generate terpisah, supaya poster sama persis dengan video |
| `poster-hero-9x16.png` | 9:16 | Poster fallback HP | Frame dari video 9:16 |
| `langit-pagi-hdri.png` | 2:1 | Langit/environment map diorama 3D | `Equirectangular 360 panorama sky, overcast tropical morning, soft diffuse light, thin mist on the horizon, no ground objects, seamless.` |
| `tekstur-air-kapuas.png` | 1:1 | Material air di 3D | `Seamless tileable texture, top-down view of murky tea-brown river water surface with subtle ripples, flat even lighting, no reflections of objects.` |
| `tekstur-hutan-atas.png` | 1:1 | Warna permukaan diorama | `Seamless tileable texture, top-down aerial view of dense tropical rainforest canopy, varied deep greens, flat lighting, no roads, no rivers.` |
| `tekstur-laterit.png` | 1:1 | Ruas jalan tanah di 3D | `Seamless tileable texture, top-down view of compacted red-orange laterite soil road with tire ruts and small stones, flat lighting.` |
| `pola-tenun.png` | 4:1 | Garis pembatas & kain loader | `Flat vector-like geometric ikat weaving pattern inspired by Dayak textiles of Sintang, natural madder red, dark brown and off-white threads, horizontal band, symmetric, seamless horizontally.` **Catatan:** setelah ada pola, minta penenun atau tokoh adat lokal memeriksa bahwa motif tidak meniru motif sakral. Lebih baik lagi kalau memakai foto kain tenun asli yang dibeli dari pengrajin Sintang |

## Yang TIDAK dibuat dengan Dreamina

| Aset | Sumber |
|---|---|
| Foto mobil | Difoto sendiri di lokasi nyata (depan pool, tepi Kapuas, jalan laterit), pagi atau sore, ponsel bagus cukup |
| Foto sopir | Difoto sendiri, dengan izin |
| Model 3D mobil | Model low-poly generik (Sketchfab CC-BY / CC0 atau Blender), tanpa logo |
| Diorama 3D | Data elevasi SRTM/Copernicus + garis sungai OpenStreetMap, diolah di Blender |

## Checklist serah-terima

- [ ] 6 video + 7 gambar ada di `assets-src/dreamina/` dengan nama persis
- [ ] Video loop hero tidak "meloncat" di titik sambung (cek dengan putar berulang)
- [ ] Tidak ada teks palsu, kendaraan, atau orang di frame mana pun
- [ ] Lisensi tercatat di `docs/credits.md`
