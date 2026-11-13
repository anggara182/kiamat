# kiamat: seri "THE LAST DAYS"

Repo ini proyek tersendiri milik adrian (13 Nov 2026). **Aturan repo storiesafterdark tidak berlaku di sini**, termasuk STOP PRODUKSI, slot render PC, dan jatah pilar. Kerja dan render dilakukan di repo ini (sesi cloud).

## Isi
- Seri animasi pendek tentang perjalanan menuju akhir dunia menurut eskatologi Islam (kerangka Sunni). Fondasi, peta sumber, kronologi, story bible: `cerita/`.
- Gaya visual (diambil dari horrorluar, hanya visual): `VISUAL-STYLE.md`, `AGENT_BRIEF.md`, kit `template/`, aset `library/`.
- Episode: `episodes/epNN/` (project Remotion per episode).

## Keputusan yang sudah diambil (adrian, 13 Nov 2026)
- Narator pengamat di luar cerita, narasi deskriptif (bukan "aku", bukan pola kontras).
- VO bahasa Inggris, fast-paced narrative storytelling. Durasi 60–80 detik per episode.
- Narasi menyebut "God", bukan "Allah"; isi tetap bersumber Qur'an dan hadis sahih. Kutipan langsung memakai terjemahan baku kata per kata (Qur'an: mis. Abdel Haleem).
- Setiap episode ditutup cliffhanger ke episode berikutnya; episode terakhir tiap fase ke fase berikutnya.
- Visual: manusia adalah inti (hampir setiap shot ada manusia dengan aksi spesifik). Karakter animasi on twos, kamera dan background on ones. 24 fps. Mode terang dan malam.
- Isa AS dan malaikat tidak digambarkan; wajah Mahdi tidak ditampilkan. Tidak ada peristiwa, negara, tokoh, logo, atau merek nyata.
- Setiap chapter memakai tokoh baru (seri komprehensif, bukan satu keluarga), walau prosesnya lebih lama.
- Hook tidak memakai HP. Shot HP seminimal mungkin mulai Chapter 2; cerita disampaikan lewat manusia dan tempat.
- Pola audio standar: ambience per lokasi, SFX dikunci ke kata sinkron, musik orisinal, drop sinematik (thump di frame 0, boom di titik balik, braam di momen kanonik, detak jantung di cliffhanger, dentuman di kartu judul). VO minimal 6 dB di atas latar di setiap kata (pita ucapan).
- Kartu judul di akhir: judul chapter + "CHAPTER N · THE LAST DAYS".

## Aturan sumber
Setiap episode mencantumkan rujukan dan klasifikasi KANONIK / INTERPRETASI / FIKSI (`cerita/00-FONDASI.md` §7). Jangan mengarang hadis, ayat, ucapan nabi, atau kepastian tentang waktu Kiamat. Rujukan baru diverifikasi dulu; sebelum tayang sebaiknya ditinjau orang yang paham hadis.

## VO (ai33)
Kunci `AI33_API_KEY` dipakai bersama proyek lain, jadi tetap sopan: sebelum submit cek antrean (`GET /v3/tasks?page=1&limit=20`), tunggu kalau ≥4 task belum selesai; backoff saat 429; polling ≥3 dtk. Satu task TTS untuk seluruh narasi episode (dengan transkrip per kata, untuk timing). Jangan generate SFX lewat ai33; pakai SFX yang sudah ada. Skrip: `episodes/ep01/scripts/vo.py`, mix: `scripts/mix.py`.

## Alur episode
`episode.json` (shot list) → set per subagent sesuai `AGENT_BRIEF.md` → `preview.mjs` per set → VO (`vo.py`) → retime dari transkrip → `mix.py` → `bake.mjs` + `contact.mjs` (QC) → render Remotion → `finish.sh` (grain + mux) → QC frame hasil render.
