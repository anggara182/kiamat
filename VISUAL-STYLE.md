# Gaya visual kiamat

Gaya visual diambil dari repo `anggara182/horrorluar` (EP01–EP20, 13 Nov 2026). **Hanya gaya visual.** Cerita, topik, struktur shot, VO, tempo, dan pace kiamat ditentukan terpisah dan TIDAK mengikuti horrorluar (struktur 13 shot, CTA "Comment YES or NO", VO Inggris, tempo 1.05 tidak ikut). Repo horrorluar tidak diubah.

Contoh frame: `contoh-frame.jpg` (dari EP07, EP04, EP13, EP19).

## 1. Look
- **Vektor semi-realis yang distilisasi.** Siluet berlapis di depan cahaya gradien yang kaya, nuansa wayang / poster sinematik.
- **100% SVG kode di Remotion.** Tanpa 3D, tanpa gambar AI.
- **Gelap dan sunyi.** Latar hampir rata, biru-hitam keunguan. Ada satu sumber cahaya yang jelas (lampu jalan, jendela, lilin, sinar dari atas), dan hero diletakkan di area paling terang itu.
- **Hantu lebih banyak tersirat:** siluet, rambut, tangan, pantulan, mata, jejak. Seram, tidak gore.
- **Hard cut saja.** Tanpa light leak, transisi, glitch, chromatic aberration, flash, atau shake sebagai efek.

## 2. Anggaran detail (aturan kecepatan)
- **Satu HERO per shot** dibuat detail: siluet bersih, shading 2–3 tone, rim light, dan beberapa detail penanda (lipatan kain, simpul, jari, helai rambut, pantulan).
- **Sisanya LOW detail:** isian rata atau gradien 2–3 stop, siluet sederhana, maksimal ~6 shape per elemen background. Tanpa tekstur, tanpa properti mikro, tanpa rim light per elemen, tanpa noise.
- Satu set band background dipakai untuk semua shot di set itu lewat crop, zoom, dan parallax kamera.

## 3. Komposisi
- **Satu focal point:** hero di depan area paling terang (kontras nilai) dengan rim light; elemen lain lebih gelap dan kontrasnya lebih rendah.
- **Minimal 3 lapis kedalaman:** foreground siluet gelap (daun, tepi pintu, tiang), midground dengan hero, background terang (langit / sumber cahaya).
- Hero di sepertiga frame. Kepala dan kaki tidak terpotong tepi frame, kecuali extreme close-up yang disengaja.
- Hero tidak masuk zona caption. Batas zona caption menyesuaikan posisi subtitle akun baru; di horrorluar, hero di atas 72% tinggi frame dan caption mulai di 74%.
- **Silhouette test:** kalau hero diisi hitam polos tidak dikenali, perbaiki bentuknya dulu sebelum menambah detail.
- Shot-shot yang paling khas: extreme close-up benda kunci di depan latar gelap dua warna (simpul kain, sisir), sosok dari belakang di bawah kerucut cahaya, dan ruangan gelap dengan satu jendela atau bulan sebagai sumber cahaya.

## 4. Palet (pola, bukan angka tetap)
Setiap episode punya palet sendiri, tapi polanya selalu sama:
- Langit / latar: gradien gelap 2–3 stop, mis. `#0b0d18` → `#1a1f33`.
- Siluet: tiga nilai gelap, mis. near `#07080d`, mid `#12141d`, far `#20263a`.
- Satu cahaya utama yang hangat atau dingin (lampu `#e8f1ff`, natrium `#ffb347`, lilin), dengan pool cahaya di lantai.
- Rim light dingin, mis. `#a9c4e8`, kadang ditambah rim hangat dari sumber cahaya.
- Hero kain / kulit pucat: off-white dengan bayangan dingin, mis. `#e9e4d6` / `#9aa0b0`.
- **Satu warna aksen per episode** untuk kata kunci caption dan judul (mis. `#ffcc4d`, `#ff6b8a`, `#4fd1c5`).

## 5. Karakter
- Wajah tidak detail. Karakter lebih sering terlihat dari belakang, samping, atau sebagai siluet. Mulut hantu tidak pernah ditunjukkan.
- Proporsi: kepala dewasa ≈ 1/7 tinggi badan, anak (~7 tahun) ≈ 1/5.
- Dibangun dari primitif: kepala elips → leher → torso (bahu lebih lebar dari pinggang) → lengan dan kaki tapered dengan tekukan siku/lutut → tangan sederhana dengan 1–2 pemisah jari. Rambut: satu shape besar + 4–8 stroke helai + stroke rim.
- Aksi kompleks dikerjakan sebagai close-up tangan atau benda, bukan full-body.

## 6. Teks di layar
- **Caption:** Montserrat 800, putih, kecil (46 px di 1080 lebar), rata tengah, di bawah tengah frame, tanpa kotak. Kata kunci diberi warna aksen. Kata demi kata mengikuti timing VO akun baru.
- **Judul:** serif klasik (Cinzel / Marcellus / Cormorant) atau Oswald, dalam lebar aman 920 px. Aksara non-Latin pakai font Noto yang punya glyph-nya.
- Shot graphic (judul dan penutup) menggambar teksnya sendiri, tanpa caption global.

## 7. Aturan teknis
- Frame 1080x1920. World space 1296x2304 (ada ruang ekstra untuk gerak kamera).
- **Background statis di-bake ke PNG per depth band**, maksimal 3–4 band per set. Blur diterapkan sekali saat bake, bukan per frame.
- Elemen hidup digambar di `<Live>`. Kamera lewat `Cam` (zoom/dx/dy dengan parallax per band), `handheld` (goyang halus deterministik), dan `ramp` / `EIO`.
- Animasi selalu pakai progres relatif shot (`useShot().p`) dan `wordAt(...)` supaya sinkron ke VO apa pun. Jangan pakai frame absolut.
- **Dilarang:** filter per frame, `mix-blend-mode`, glow `box-shadow`. Glow dibuat dengan bentuk radial gradient.
- **Vignette global** (radial, gelap keunguan `rgba(8,4,16,.7)`), tidak digambar per shot.
- **Grain** ditambahkan sekali saat encode akhir (`finish.sh`): plate noise 540x960 yang di-upscale, refresh 15 fps, overlay 0.30, x264 `-tune grain`. Grain ini bagian dari look horrorluar. Kalau akun baru tidak mau encode ulang, lewati langkah ini dan terima look yang sedikit lebih bersih.
- fps horrorluar 30. Untuk akun baru boleh 24 atau 30, karena semua animasi relatif.

## 8. Alur kerja visual
1. Bagi episode jadi 2–3 set (mis. lokasi lebar, close-up, graphic). Satu set = satu file `src/sets/<set>.tsx` + `src/shots/<OWNER>.tsx`.
2. **Cek library dulu** sebelum menggambar dari nol. Ada 249 komponen SVG dari 20 episode (tangan, wajah, kain, rambut, properti, lokasi). Salin seluruh file sumbernya ke file baru `src/art/<set>_<nama>.tsx`, betulkan import relatif, lalu restyle lewat props dan palet.
3. Loop preview minimal 3 kali: `node scripts/preview.mjs <set> <ids>` (3 still per shot di 15/50/90%) → periksa strip (silhouette test, focal point, zona caption, artefak) → perbaiki.
4. Contact sheet seluruh episode (`node scripts/contact.mjs 0.6`), review, baru render penuh.

## 9. Isi repo
| Path | Isi |
|---|---|
| `template/` | Kit Remotion siap pakai: `src/comp/Camera.tsx` (kamera, band, Live), `Bands.tsx`, `Overlays.tsx` (vignette + caption), `Episode.tsx`, `data/ep.ts` (`wordAt`, `spanOf`). Berisi satu episode contoh dari set EP15 (village, inside, graphic) dengan caption placeholder. |
| `template/scripts/` | `bake.mjs`, `preview.mjs`, `contact.mjs` (alat cek visual), `finish.sh` + `grain.py` (grain encode, opsional) |
| `library/episodes/<ep>/` | Kode `art/`, `sets/`, `shots/`, dan `STYLE.md` (palet, karakter) EP02–EP20 |
| `library/LIBRARY.md`, `library/catalog.json` | Indeks 249 komponen per kategori (character, face, hand, prop, fx, environment, set) |
| `library/thumbs/` | Thumbnail per shot dan sprite per episode |
| `AGENT_BRIEF.md` | Brief untuk subagent yang menggambar satu set |

`Overlays.tsx` masih berisi `LightLeak` dan `Transitions` dari kit lama. Keduanya tidak dipakai di `Episode.tsx` dan tidak boleh dipakai (aturan hard cut).

**Tidak disalin dari horrorluar:** naskah (`episodes.py`, `episode.json` asli), skrip VO dan mix (`ai33.py`, `gen_audio*`, `build_audio*`), `FORMAT.md`, `AUDIO.md`, voice id, dan library SFX.

## 10. Catatan PC lokal
- Skrip kit memakai `python3`, dan `preview.mjs` / `remotion.config.ts` otomatis memakai `/opt/pw-browsers/chromium` kalau ada (cloud). Di PC lokal pakai `python`, biarkan Remotion mengunduh headless shell sendiri, dan set `TEMP`/`TMP`/cache npm ke `E:\tmp\`.
- Render tetap lewat `render_slot.py` (maksimal 2 render untuk seluruh PC). Preview still per set termasuk ringan.
- Selama STOP PRODUKSI masih berlaku: belum boleh render, VO, atau menjadwal. Menyiapkan template dan dokumen boleh.
