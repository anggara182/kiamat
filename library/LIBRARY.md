# Library visual (dari horrorluar EP01–EP20)

249 komponen SVG React (Remotion 4.0.542), world space 1296x2304 kecuali disebut lain. Hanya aset visual: naskah, VO, voice, dan SFX horrorluar sengaja tidak disalin.

## Cara pakai
- Cari aset per kategori di bawah atau di `catalog.json` (nama, props, file:line, episode, shot yang memakainya).
- Thumbnail shot di `thumbs/<ep>/sNN.jpg` menunjukkan komponen dalam konteks; `thumbs/sprites/<ep>.jpg` = semua shot satu episode.
- Untuk reuse: salin SELURUH file sumber dari `episodes/<ep>/art|sets|shots/` ke `src/art/<set>_<nama>.tsx` di project episode baru, betulkan import relatif (biasanya hanya `react` dan `../comp/Camera`), lalu restyle lewat props dan palet. Jangan import lintas project.
- File di `episodes/<ep>/shots/` memanggil `wordAt(...)` dengan pola kata dari naskah lama. Itu hanya contoh gerak kamera dan timing; ganti polanya sesuai VO baru.
- EP01 tidak punya kode (kit lama berbasis 3D), hanya thumbnail.

## Episode sumber
| ep | judul | negara | shot |
|---|---|---|---|
| ep01 | Kuntilanak | Indonesia | 17 |
| ep02 | Nyi Roro Kidul | Indonesia | 17 |
| ep03 | Wewe Gombel | Indonesia | 13 |
| ep04 | Pocong | Indonesia | 13 |
| ep05 | The Ghost Train | Indonesia | 13 |
| ep06 | Suster Ngesot | Indonesia | 13 |
| ep07 | Kuchisake-onna | Japan | 13 |
| ep08 | La Llorona | Mexico | 13 |
| ep09 | The Jangsan Tiger | Korea | 13 |
| ep10 | Bloody Mary | USA | 13 |
| ep11 | Tuyul | Indonesia | 13 |
| ep12 | Mae Nak | Thailand | 13 |
| ep13 | The Banshee | Ireland | 13 |
| ep14 | The Elevator Game | Korea | 13 |
| ep15 | Genderuwo | Indonesia (Java) | 13 |
| ep16 | Hanako-san | Japan | 13 |
| ep17 | El Silbón | Venezuela | 13 |
| ep18 | Aswang | Philippines | 13 |
| ep19 | Jelangkung | Indonesia | 13 |
| ep20 | The Kelpie | Scotland | 13 |

## Character (49)

| component | ep | file | props |
|---|---|---|---|
| Girl | ep02 | `episodes/ep02/art/Live.tsx:62` |  |
| WeweCrouch | ep03 | `episodes/ep03/art/bamboo_wewe.tsx:31` | x: number; y: number; s?: number; t: number; rim?: number |
| WeweTall | ep03 | `episodes/ep03/art/bamboo_wewe.tsx:90` | x: number; y: number; s?: number; t: number; rim?: number; fill?: string |
| WeweStand | ep03 | `episodes/ep03/art/bamboo_wewe.tsx:106` | x: number; y: number; s?: number; t: number; rim?: number; child?: boolean; glow?: number |
| WeweFigure | ep03 | `episodes/ep03/art/graphic_wewe.tsx:8` | x: number; y: number; s?: number; sway?: number |
| GrandmaWok | ep03 | `episodes/ep03/art/home_hero.tsx:6` | lamp: number; tap: number |
| SleepingBoy | ep03 | `episodes/ep03/art/home_hero.tsx:108` | breath: number |
| Kid | ep03 | `episodes/ep03/art/village_figs.tsx:4` | x: number; y: number; s: number; ph: number; dir?: 1 / -1; rim?: string |
| Dad | ep03 | `episodes/ep03/art/village_figs.tsx:22` | x: number; y: number; s: number; ph: number; strike: number; walk?: number; lowered?: boolean; rim?: string |
| MomRun | ep03 | `episodes/ep03/art/village_figs.tsx:57` | x: number; y: number; s: number; ph: number; rim?: string |
| MomHero | ep03 | `episodes/ep03/art/village_figs.tsx:77` | x: number; y: number; s: number; t: number; call: number |
| UncleBack | ep04 | `episodes/ep04/art/bike_art.tsx:71` | breath: number |
| PocongFigure | ep04 | `episodes/ep04/art/graphic_pocong.tsx:7` | id: string; x: number; y: number; s: number; mode?: 'lit' / 'dark'; tuft?: number; rot?: number |
| Pocong | ep04 | `episodes/ep04/art/road_figs.tsx:7` | x: number; y: number; s?: number; arm?: number; dark?: number; t?: number; rim?: number |
| Passenger | ep05 | `episodes/ep05/art/train_art.tsx:10` | x: number; y: number; s: number; tilt?: number; eye?: number |
| Narrator | ep05 | `episodes/ep05/art/train_art.tsx:32` | x: number; y: number; s: number; rim?: string; rimO?: number |
| NurseCap | ep06 | `episodes/ep06/art/graphic_props.tsx:4` | x: number; y: number; s?: number; rot?: number; lit?: number; dirty?: boolean |
| HairLock | ep06 | `episodes/ep06/art/graphic_props.tsx:75` | d: string; n?: number; spread?: number; rim?: number |
| GrandmaBed | ep06 | `episodes/ep06/art/ward_people.tsx:4` | x: number; y: number; s?: number; t?: number; light?: string; dark?: string; rim?: string |
| Narrator | ep06 | `episodes/ep06/art/ward_people.tsx:29` | x: number; y: number; s?: number; t?: number; sleep?: number; rim?: string; fill?: string |
| Woman | ep07 | `episodes/ep07/art/street_figs.tsx:13` | x: number; y: number; h: number; hairSway?: number |
| Girl | ep07 | `episodes/ep07/art/street_figs.tsx:73` | x: number; y: number; h: number; view: 'back' / 'front'; phase?: number; amp?: number |
| HairStrand | ep08 | `episodes/ep08/art/close_art.tsx:95` | t: number |
| Llorona | ep08 | `episodes/ep08/art/graphic_art.tsx:77` | sway: number |
| Llorona | ep08 | `episodes/ep08/art/river_figs.tsx:10` | x: number; y: number; s: number; turn?: number; stand?: number; cold?: boolean; id: string |
| Boy | ep08 | `episodes/ep08/art/river_figs.tsx:64` | x: number; y: number; s: number; phase: number; run?: number; aim?: number; rod?: boolean; beamLen?: number; i |
| WalkGirl | ep10 | `episodes/ep10/art/house_figs.tsx:8` | x: number; y: number; h: number; phase?: number; hair?: 'long' / 'pony' / 'bob'; rim?: number; side?: number |
| SitGirl | ep10 | `episodes/ep10/art/house_figs.tsx:44` | x: number; y: number; h: number; pj: string; pjD: string; hair: 'long' / 'pony' / 'bob'; tilt?: number; laugh? |
| Girl | ep10 | `episodes/ep10/art/mirror_art.tsx:84` | x: number; y: number; s?: number; view: 'back' / 'front'; hair?: 'long' / 'pony' / 'bob'; tone?: string; lit?: |
| Mary | ep10 | `episodes/ep10/art/mirror_art.tsx:120` |  |
| TuyulSil | ep11 | `episodes/ep11/art/graphic_tuyul.tsx:25` | x: number; y: number; s: number; lean?: number |
| Uncle | ep11 | `episodes/ep11/art/warung_art.tsx:4` | x: number; y: number; s?: number; turn?: number; rim?: string |
| Tuyul | ep11 | `episodes/ep11/art/warung_art.tsx:35` | x: number; y: number; s?: number; sq?: number; fill?: string; rim?: string |
| Woman | ep12 | `episodes/ep12/art/graphic_art.tsx:96` | x: number; y: number; s?: number; sway?: number; rim?: string |
| Man | ep12 | `episodes/ep12/art/house_art.tsx:182` | x: number; y: number; h: number; dir?: number; pose?: string; ph?: number; rim?: string |
| Wife | ep12 | `episodes/ep12/art/house_art.tsx:230` | x: number; y: number; h: number; dir?: number; baby?: boolean; sil?: boolean; kneel?: boolean; sway?: number |
| Grandpa | ep13 | `episodes/ep13/art/cottage_figs.tsx:22` | x: number; y: number; rim?: number; nod?: number; face?: 'left' / 'right'; smile?: number; breath?: number |
| Banshee | ep13 | `episodes/ep13/art/graphic_comb.tsx:41` | x: number; y: number; h: number; sway?: number; id: string |
| Woman | ep14 | `episodes/ep14/art/lift_figs.tsx:50` | x: number; y: number; s?: number; turn?: number |
| Narrator | ep14 | `episodes/ep14/art/lift_figs.tsx:75` | x: number; y: number; s?: number |
| NarratorFull | ep14 | `episodes/ep14/art/lift_figs.tsx:84` | x: number; y: number; s?: number |
| Man | ep15 | `episodes/ep15/art/village_figs.tsx:55` | x: number; y: number; s?: number; fill?: string; bike?: boolean; face?: boolean; bikeX?: number |
| Runner | ep15 | `episodes/ep15/art/village_figs.tsx:78` | x: number; y: number; s: number; ph: number; mother?: boolean; fill?: string |
| WalkGirl | ep16 | `episodes/ep16/art/school_girls.tsx:5` | x: number; y: number; h: number; phase?: number; hair?: 'long' / 'pony' / 'bob'; rim?: number; side?: number;  |
| Grandpa | ep17 | `episodes/ep17/art/ranch_figs.tsx:6` |  |
| Girl | ep17 | `episodes/ep17/art/ranch_figs.tsx:38` |  |
| Man | ep18 | `episodes/ep18/art/house_lib.tsx:182` | x: number; y: number; h: number; dir?: number; pose?: string; ph?: number; rim?: string |
| Wife | ep18 | `episodes/ep18/art/house_lib.tsx:230` | x: number; y: number; h: number; dir?: number; baby?: boolean; sil?: boolean; kneel?: boolean; sway?: number;  |
| Kid | ep20 | `episodes/ep20/art/loch_figs.tsx:64` | x: number; y: number; h: number; phase?: number; jumper: string; hair?: 'long' / 'short'; rim?: number; reach? |

## Face (13)

| component | ep | file | props |
|---|---|---|---|
| Eyes | ep03 | `episodes/ep03/art/bamboo_wewe.tsx:76` | x: number; y: number; s?: number; o: number; id: string; blink?: number |
| EarProfile | ep04 | `episodes/ep04/art/bike_art.tsx:168` | ex: number; ey: number |
| PocongFace | ep04 | `episodes/ep04/art/bike_art.tsx:214` |  |
| GrandmaHead | ep06 | `episodes/ep06/art/close_grandma.tsx:4` | bl: number; t: number |
| Mask | ep07 | `episodes/ep07/art/close_face.tsx:7` | tug?: number; id: string; loopSide?: 1 / -1 |
| Eyes | ep07 | `episodes/ep07/art/close_face.tsx:50` | id: string; glint?: number |
| FaceSkin | ep07 | `episodes/ep07/art/close_face.tsx:76` |  |
| MaskFront | ep07 | `episodes/ep07/art/graphic_art.tsx:4` | w?: number; loopDrop?: number; rim?: string; op?: number |
| WomanProfile | ep07 | `episodes/ep07/art/graphic_art.tsx:36` | h?: number; light?: number |
| DroppedMask | ep07 | `episodes/ep07/art/street_figs.tsx:149` | x: number; y: number; w: number |
| BowedHead | ep08 | `episodes/ep08/art/close_art.tsx:27` | t: number |
| BigEye | ep18 | `episodes/ep18/art/house_eye.tsx:4` | id: string; refl: number; look?: number; blink?: number; cold?: boolean; bare?: boolean |
| KelpieHead | ep20 | `episodes/ep20/art/graphic_horse.tsx:17` | x: number; y: number; s: number; t: number; sheen?: number; id: string; drops?: number |

## Hand (15)

| component | ep | file | props |
|---|---|---|---|
| Hand | ep02 | `episodes/ep02/sets/bedroom.tsx:206` | x: number; y: number; rot: number; side: 1 / -1; curl?: number; armLen?: number; s?: number |
| Fingertips | ep06 | `episodes/ep06/art/close_art.tsx:18` | curl?: number |
| OldHand | ep06 | `episodes/ep06/art/close_art.tsx:36` | grip: number |
| YoungHand | ep06 | `episodes/ep06/art/close_art.tsx:100` |  |
| Handprint | ep06 | `episodes/ep06/art/close_grandma.tsx:83` | op?: number |
| PaleHand | ep07 | `episodes/ep07/art/graphic_art.tsx:94` |  |
| PaleHand | ep08 | `episodes/ep08/art/close_art.tsx:4` | flip: boolean; spread: number |
| SmallHand | ep11 | `episodes/ep11/art/close_art.tsx:126` | ex: number; ey: number; fx: number; fy: number; poke?: number; wet?: number |
| LongArm | ep12 | `episodes/ep12/art/close_arm.tsx:62` | x: number; y0: number; y1: number; lean?: number; curl?: number; t?: number |
| PaleHand | ep12 | `episodes/ep12/art/house_art.tsx:278` | x: number; y: number; ext: number; s?: number |
| Hand | ep13 | `episodes/ep13/art/cottage_figs.tsx:98` | rise: number; press?: number |
| Hand | ep14 | `episodes/ep14/art/lift_figs.tsx:39` | x: number; y: number; press?: number |
| PaleHand | ep18 | `episodes/ep18/art/house_lib.tsx:278` | x: number; y: number; ext: number; s?: number |
| Fingers | ep19 | `episodes/ep19/art/close_props.tsx:100` | x: number; y: number; dir: 1 / -1; rot?: number; rim?: string |
| Hand | ep20 | `episodes/ep20/art/close_parts.tsx:4` | curl?: number; sleeve?: string; skin?: string; shade?: string; rim?: string; spread?: number; mitt?: boolean |

## Prop (74)

| component | ep | file | props |
|---|---|---|---|
| Sandals | ep03 | `episodes/ep03/art/home_hero.tsx:156` |  |
| FgFrame | ep03 | `episodes/ep03/art/village_figs.tsx:151` | w?: number; h?: number; left?: boolean; right?: boolean; c?: string; stalk?: 'l' / 'r' |
| Strap | ep04 | `episodes/ep04/art/bike_art.tsx:45` | ax: number; ay: number; bx: number; by: number; sag: number; w: number; id: string; folds?: number |
| KnotCU | ep04 | `episodes/ep04/art/bike_art.tsx:105` | cx: number; cy: number; tug: number |
| ClothEdge | ep04 | `episodes/ep04/art/bike_art.tsx:200` | x: number; y: number |
| ShroudKnot | ep04 | `episodes/ep04/art/graphic_knot.tsx:8` | sw: number |
| Motorbike | ep04 | `episodes/ep04/art/road_figs.tsx:51` | x: number; y: number; s?: number; flip?: boolean; rider?: boolean; passenger?: boolean; t?: number; lit?: numb |
| TrainFront | ep05 | `episodes/ep05/art/graphic_train.tsx:4` | x: number; y: number; s: number; glow: number |
| Bench | ep05 | `episodes/ep05/art/platform_geo.tsx:10` | x: number; y: number; s: number |
| Cap | ep05 | `episodes/ep05/art/platform_geo.tsx:24` | x: number; y: number; s: number; rim?: string; rimO?: number |
| Car | ep05 | `episodes/ep05/art/train_art.tsx:60` | x: number; y: number; len: number; h?: number; idp: string; faces?: boolean; door?: number |
| Tube | ep06 | `episodes/ep06/art/graphic_props.tsx:47` | x: number; y: number; w?: number; on?: number |
| Clipboard | ep06 | `episodes/ep06/art/graphic_props.tsx:58` | x: number; y: number; s?: number; rot?: number |
| Monitor | ep06 | `episodes/ep06/art/ward_people.tsx:54` | x: number; y: number; s?: number; t?: number; glow?: string |
| Clock | ep06 | `episodes/ep06/art/ward_people.tsx:68` | x: number; y: number; r?: number; h?: number; m?: number; face?: string |
| Tube | ep06 | `episodes/ep06/art/ward_people.tsx:83` | x: number; y: number; w?: number; o: number; id: string; c?: string |
| Fringe | ep07 | `episodes/ep07/art/close_face.tsx:85` | y?: number; sway?: number |
| GripBack | ep07 | `episodes/ep07/art/close_hands.tsx:14` | cx: number; cy: number; dir: 1 / -1; rot?: number |
| GripFront | ep07 | `episodes/ep07/art/close_hands.tsx:28` | cx: number; cy: number; dir: 1 / -1; sq: number; rot?: number; cuff?: string |
| Drop | ep08 | `episodes/ep08/art/close_art.tsx:138` | x: number; y: number; r: number; t: number; i: number |
| PaperBoat | ep08 | `episodes/ep08/art/graphic_art.tsx:114` | tone?: number |
| Marigold | ep08 | `episodes/ep08/art/graphic_art.tsx:127` | r?: number; rot?: number |
| FurTuft | ep09 | `episodes/ep09/art/graphic_art.tsx:36` | ax: number; ay: number; len: number; sway: number; n?: number; seed?: number; scale?: number |
| FurDefs | ep09 | `episodes/ep09/art/graphic_art.tsx:72` |  |
| PaleShape | ep09 | `episodes/ep09/art/mountain_tiger.tsx:5` | x: number; y: number; s: number; o?: number; eyes?: number; id: string; trunk?: string |
| CandleReflection | ep10 | `episodes/ep10/art/graphic_fog.tsx:60` | x: number; y: number; s?: number; t: number; id: string; body?: boolean |
| GlassSheen | ep10 | `episodes/ep10/art/mirror_art.tsx:48` | day?: boolean |
| GlassClip | ep10 | `episodes/ep10/art/mirror_art.tsx:54` | id: string |
| Candle | ep10 | `episodes/ep10/art/mirror_art.tsx:67` | x?: number; top?: number; flick?: number; t?: number; dim?: number; lit?: boolean |
| Tin | ep11 | `episodes/ep11/art/close_art.tsx:4` | cx: number; cy: number |
| Coin | ep11 | `episodes/ep11/art/close_art.tsx:49` | x: number; y: number; r?: number; tilt?: number |
| Crab | ep11 | `episodes/ep11/art/close_art.tsx:59` | x: number; y: number; s?: number; a?: number; ph?: number; claw?: number |
| Bowl | ep11 | `episodes/ep11/art/close_art.tsx:84` |  |
| Drop | ep11 | `episodes/ep11/art/close_art.tsx:161` | x: number; y: number; r?: number; o?: number |
| Coin | ep11 | `episodes/ep11/art/graphic_tuyul.tsx:8` | x: number; y: number; r: number; tilt?: number; rot?: number; id: string |
| Marble | ep11 | `episodes/ep11/art/graphic_tuyul.tsx:66` | x: number; y: number; r: number; spin: number |
| Crab | ep11 | `episodes/ep11/art/graphic_tuyul.tsx:87` | x: number; y: number; s: number; claw?: number |
| Bowl | ep11 | `episodes/ep11/art/warung_art.tsx:69` | x: number; y: number; s?: number; crab?: boolean; glint?: number; light?: string |
| Lime | ep12 | `episodes/ep12/art/close_arm.tsx:8` | id: string; x: number; y: number; r: number; rot?: number; light?: string; dark?: number |
| Planks | ep12 | `episodes/ep12/art/close_arm.tsx:33` | x0: number; n: number; pw: number; y0: number; h: number; wideAt?: number; wideW?: number; seed?: number |
| OilLamp | ep12 | `episodes/ep12/art/graphic_art.tsx:18` | x: number; y: number; s?: number; flick?: number; id: string |
| Garland | ep12 | `episodes/ep12/art/graphic_art.tsx:50` | x: number; y: number; s?: number |
| Lime | ep12 | `episodes/ep12/art/graphic_art.tsx:78` | x: number; y: number; s?: number; id: string |
| OilLamp | ep12 | `episodes/ep12/art/house_art.tsx:171` | x: number; y: number; s?: number; flick?: number |
| Boat | ep12 | `episodes/ep12/art/house_art.tsx:270` | x: number; y: number; w: number; rock?: number |
| Comb | ep13 | `episodes/ep13/art/cottage_figs.tsx:5` | x: number; y: number; s?: number; hair?: number |
| Comb | ep13 | `episodes/ep13/art/country_comb.tsx:4` | glint?: number |
| Comb | ep13 | `episodes/ep13/art/graphic_comb.tsx:4` | x: number; y: number; s?: number; rot?: number; hair?: number; id: string |
| LitBtn | ep14 | `episodes/ep14/art/lift_figs.tsx:10` | n: number; a: number |
| LiftDefs | ep14 | `episodes/ep14/art/lift_figs.tsx:21` |  |
| Readout | ep14 | `episodes/ep14/art/lift_figs.tsx:31` | x: number; y: number; text: string; up?: number; size?: number |
| Porch | ep15 | `episodes/ep15/art/village_figs.tsx:17` | on?: number; open?: number |
| Wet | ep15 | `episodes/ep15/art/village_figs.tsx:38` | on?: number; f: number |
| Defs | ep16 | `episodes/ep16/sets/stall.tsx:15` |  |
| StallFront | ep16 | `episodes/ep16/sets/stall.tsx:58` | x: number; open?: number; num?: string; door?: boolean |
| Silbon | ep17 | `episodes/ep17/art/graphic_silbon.tsx:5` | x: number; y: number; s: number; rim?: number; sack?: number; fill?: string; step?: number |
| Note | ep17 | `episodes/ep17/art/graphic_silbon.tsx:51` | x: number; y: number; s?: number; fill?: string; o?: number |
| Silbon | ep17 | `episodes/ep17/art/llanos_figs.tsx:5` | x: number; y: number; h: number; fill?: string; rim?: string; step?: number |
| Dog | ep17 | `episodes/ep17/art/ranch_figs.tsx:57` |  |
| Lantern | ep17 | `episodes/ep17/art/ranch_figs.tsx:78` | x: number; y: number; s: number; on?: number |
| OilLamp | ep18 | `episodes/ep18/art/house_lib.tsx:171` | x: number; y: number; s?: number; flick?: number |
| Boat | ep18 | `episodes/ep18/art/house_lib.tsx:270` | x: number; y: number; w: number; rock?: number |
| Pencil | ep19 | `episodes/ep19/art/close_props.tsx:66` | x: number; y: number; rot: number; s?: number; rim?: string |
| DollStick | ep19 | `episodes/ep19/art/close_props.tsx:79` | x: number; y: number; rot: number; t: number; rim?: string |
| Clock | ep19 | `episodes/ep19/art/close_props.tsx:109` | x: number; y: number; r: number; h: number; m: number; sec: number; light: number |
| Doll | ep19 | `episodes/ep19/art/graphic_doll.tsx:5` | x: number; y: number; s?: number; sway?: number; id: string; rim?: string; dark?: boolean |
| Candle | ep19 | `episodes/ep19/art/graphic_doll.tsx:69` | x: number; y: number; h?: number; t: number; id: string; s?: number |
| Teen | ep19 | `episodes/ep19/art/room_k_people.tsx:4` | x: number; y: number; s?: number; back?: boolean; hand: [number, number]; lean?: number; laugh?: number; light |
| Candle | ep19 | `episodes/ep19/art/room_k_people.tsx:64` | x: number; y: number; h?: number; lit?: number; t: number; seed?: number; id: string; glow?: number |
| Doll | ep19 | `episodes/ep19/art/room_k_people.tsx:104` | x: number; y: number; s?: number; rot?: number; light?: number |
| Paper | ep19 | `episodes/ep19/art/room_k_people.tsx:127` | x: number; y: number; light?: number; marks?: number |
| Key | ep20 | `episodes/ep20/art/close_parts.tsx:40` | rim?: string; glow?: number |
| Lock | ep20 | `episodes/ep20/art/close_parts.tsx:59` | len: number; sway: number; w?: number; weed?: boolean; rim?: string |
| Horse | ep20 | `episodes/ep20/art/loch_figs.tsx:6` | x: number; y: number; s: number; walk?: number; head?: number; flip?: boolean; rim?: number; drip?: number |

## Fx (21)

| component | ep | file | props |
|---|---|---|---|
| Footprint | ep08 | `episodes/ep08/art/close_art.tsx:70` | wet: number |
| Puddle | ep08 | `episodes/ep08/art/close_art.tsx:128` | x: number; y: number; s: number; t: number |
| Ripples | ep08 | `episodes/ep08/art/graphic_art.tsx:143` | q: number; n?: number; rx: number; ry: number; color?: string; op?: number |
| Snow | ep09 | `episodes/ep09/art/graphic_art.tsx:87` | t: number; w: number; h: number; n?: number; seed?: number; speed?: number; size?: number; op?: number |
| Snow | ep09 | `episodes/ep09/art/mountain_tiger.tsx:45` | t: number; n?: number; seed?: number; size?: number; color?: string; speed?: number |
| FogPatch | ep10 | `episodes/ep10/art/graphic_fog.tsx:44` | id: string; cx: number; cy: number; rx: number; ry: number; o?: number |
| FogText | ep10 | `episodes/ep10/art/graphic_fog.tsx:91` |  |
| Glow | ep10 | `episodes/ep10/art/mirror_art.tsx:59` | x: number; y: number; r: number; o?: number; id: string; c?: string |
| Smoke | ep10 | `episodes/ep10/art/mirror_art.tsx:136` | x: number; y: number; t: number; o?: number |
| Foot | ep11 | `episodes/ep11/art/close_art.tsx:169` | x: number; y: number; a: number; side: number; s?: number; sy?: number; o?: number |
| Glow | ep12 | `episodes/ep12/art/graphic_art.tsx:4` | id: string; cx: number; cy: number; rx: number; ry?: number; color: string; o?: number |
| LampGlow | ep12 | `episodes/ep12/art/house_art.tsx:164` | x: number; y: number; r: number; o?: number; id: string |
| Fire | ep13 | `episodes/ep13/art/cottage_figs.tsx:70` | t: number; o?: number |
| Rain | ep13 | `episodes/ep13/art/cottage_figs.tsx:85` | t: number |
| Rain | ep15 | `episodes/ep15/art/village_figs.tsx:6` | f: number; color?: string; o?: number |
| Footprint | ep17 | `episodes/ep17/art/llanos_figs.tsx:34` | x: number; y: number; s: number; rot?: number; fill?: string; o?: number |
| Glow | ep17 | `episodes/ep17/art/ranch_figs.tsx:89` | id: string; x: number; y: number; r: number; color?: string; a?: number |
| LampGlow | ep18 | `episodes/ep18/art/house_lib.tsx:164` | x: number; y: number; r: number; o?: number; id: string |
| Glow | ep19 | `episodes/ep19/art/graphic_doll.tsx:89` | x: number; y: number; r: number; o?: number; id: string; c?: string |
| Smoke | ep19 | `episodes/ep19/art/room_k_people.tsx:94` | x: number; y: number; a: number; k: number; seed?: number |
| WallShadow | ep19 | `episodes/ep19/art/room_k_people.tsx:139` | x: number; y: number; s?: number; o?: number; arm?: number |

## Environment (18)

| component | ep | file | props |
|---|---|---|---|
| Headland | ep02 | `episodes/ep02/art/Land.tsx:5` |  |
| Sea | ep02 | `episodes/ep02/art/Land.tsx:82` |  |
| Shore | ep02 | `episodes/ep02/art/Land.tsx:120` |  |
| Pandan | ep02 | `episodes/ep02/art/Land.tsx:155` |  |
| Surf | ep02 | `episodes/ep02/art/Live.tsx:5` | t: number |
| Twinkles | ep02 | `episodes/ep02/art/Live.tsx:34` | t: number |
| Gulls | ep02 | `episodes/ep02/art/Live.tsx:48` | t: number |
| Ribbon | ep02 | `episodes/ep02/art/Silk.tsx:17` |  |
| MegaMendung | ep02 | `episodes/ep02/art/Sky.tsx:25` | cx: number; cy: number; w: number; h: number; lobes?: number; seed?: number; tones: string[]; band?: number; o |
| RoadDefs | ep04 | `episodes/ep04/art/road_figs.tsx:167` |  |
| Tiles | ep06 | `episodes/ep06/art/close_art.tsx:4` | vx: number; y0: number; y1: number; stroke: string; op?: number; cols?: number |
| NightWorld | ep08 | `episodes/ep08/art/graphic_art.tsx:11` |  |
| Reeds | ep08 | `episodes/ep08/art/graphic_art.tsx:61` | x: number; y: number; h: number; flip?: boolean; fill?: string; sway?: number |
| Pine | ep09 | `episodes/ep09/art/graphic_art.tsx:20` | x: number; base: number; h: number; w: number; fill: string; snow?: string; seed?: number; tiers?: number |
| Outside | ep09 | `episodes/ep09/art/home_art.tsx:4` |  |
| Kitchen | ep09 | `episodes/ep09/art/home_art.tsx:37` |  |
| Pine | ep09 | `episodes/ep09/sets/mountain.tsx:8` | x: number; y: number; h: number; fill: string; snow?: string |
| SwayGrass | ep17 | `episodes/ep17/art/llanos_figs.tsx:42` | seed: number; n: number; x0: number; x1: number; y0: number; y1: number; hmin: number; hmax: number; t: number |

## Set (59)

| component | ep | file | props |
|---|---|---|---|
| Sky | ep02 | `episodes/ep02/art/Sky.tsx:41` |  |
| beach set | ep02 | `episodes/ep02/sets/beach.tsx:1` | bands: beach/far, beach/fg, beach/mid, beach/near, beach/soft |
| bedroom set | ep02 | `episodes/ep02/sets/bedroom.tsx:1` | bands: bedroom/insert, bedroom/room |
| corridor set | ep02 | `episodes/ep02/sets/corridor.tsx:1` | bands: corridor/end, corridor/fg, corridor/main |
| graphic set | ep02 | `episodes/ep02/sets/graphic.tsx:1` | bands: graphic/deep, graphic/end, graphic/weeds |
| shore set | ep02 | `episodes/ep02/sets/shore.tsx:1` | bands: shore/bed |
| bamboo set | ep03 | `episodes/ep03/sets/bamboo.tsx:1` | bands: bamboo/far, bamboo/fog, bamboo/mid, bamboo/near |
| graphic set | ep03 | `episodes/ep03/sets/graphic.tsx:1` | bands: graphic/far, graphic/near |
| home set | ep03 | `episodes/ep03/sets/home.tsx:1` | bands: home/bamboo, home/mist, home/porch, home/sky, home/yard |
| village set | ep03 | `episodes/ep03/sets/village.tsx:1` | bands: village/far, village/mid, village/sky, village/skyblue |
| BikeBg | ep04 | `episodes/ep04/art/bike_art.tsx:10` |  |
| KnotBand | ep04 | `episodes/ep04/art/graphic_pocong.tsx:79` | w: number; reveal: number; tight?: number |
| bike set | ep04 | `episodes/ep04/sets/bike.tsx:1` | bands: bike/bg |
| road set | ep04 | `episodes/ep04/sets/road.tsx:1` | bands: road/dawn, road/fg, road/mid, road/sky |
| platform set | ep05 | `episodes/ep05/sets/platform.tsx:1` | bands: platform/bg, platform/mid, platform/near |
| train set | ep05 | `episodes/ep05/sets/train.tsx:1` | bands: train/interior, train/plat, train/station, train/wall |
| close set | ep06 | `episodes/ep06/sets/close.tsx:1` | bands:  |
| graphic set | ep06 | `episodes/ep06/sets/graphic.tsx:1` | bands: graphic/wall |
| ward set | ep06 | `episodes/ep06/sets/ward.tsx:1` | bands: ward/corridor, ward/near, ward/room |
| close set | ep07 | `episodes/ep07/sets/close.tsx:1` | bands:  |
| street set | ep07 | `episodes/ep07/sets/street.tsx:1` | bands: street/bg, street/fg, street/gate |
| close set | ep08 | `episodes/ep08/sets/close.tsx:1` | bands:  |
| graphic set | ep08 | `episodes/ep08/sets/graphic.tsx:1` | bands: graphic/night |
| river set | ep08 | `episodes/ep08/sets/river.tsx:1` | bands: river/far, river/fg, river/sky, river/water |
| home set | ep09 | `episodes/ep09/sets/home.tsx:1` | bands: home/kitchen, home/outside |
| mountain set | ep09 | `episodes/ep09/sets/mountain.tsx:1` | bands: mountain/apt, mountain/near, mountain/sky, mountain/trail |
| MirrorBg | ep10 | `episodes/ep10/art/graphic_fog.tsx:10` | id: string; lx?: number; ly?: number; warm?: number |
| Room | ep10 | `episodes/ep10/art/mirror_art.tsx:9` | day?: boolean |
| GlassBg | ep10 | `episodes/ep10/art/mirror_art.tsx:34` | day?: boolean |
| house set | ep10 | `episodes/ep10/sets/house.tsx:1` | bands: house/bedfg, house/bedroom, house/hall, house/hallfg |
| mirror set | ep10 | `episodes/ep10/sets/mirror.tsx:1` | bands: mirror/day, mirror/mary, mirror/room |
| close set | ep11 | `episodes/ep11/sets/close.tsx:1` | bands: close/dawn, close/fg, close/floor, close/table |
| warung set | ep11 | `episodes/ep11/sets/warung.tsx:1` | bands: warung/ext, warung/fg, warung/int |
| PerspFloor | ep12 | `episodes/ep12/art/close_floor.tsx:12` | edges: number[]; top?: number |
| ExteriorBand | ep12 | `episodes/ep12/art/house_art.tsx:50` |  |
| ExtFgBand | ep12 | `episodes/ep12/art/house_art.tsx:124` |  |
| InteriorBand | ep12 | `episodes/ep12/art/house_art.tsx:133` |  |
| close set | ep12 | `episodes/ep12/sets/close.tsx:1` | bands:  |
| house set | ep12 | `episodes/ep12/sets/house.tsx:1` | bands: house/ext, house/fg, house/int |
| cottage set | ep13 | `episodes/ep13/sets/cottage.tsx:1` | bands: cottage/room, cottage/table |
| country set | ep13 | `episodes/ep13/sets/country.tsx:1` | bands: country/lane, country/sky |
| hall set | ep14 | `episodes/ep14/sets/hall.tsx:1` | bands: hall/corridor, hall/lobby, hall/stairs |
| lift set | ep14 | `episodes/ep14/sets/lift.tsx:1` | bands: lift/car, lift/panel |
| inside set | ep15 | `episodes/ep15/sets/inside.tsx:1` | bands: inside/room |
| village set | ep15 | `episodes/ep15/sets/village.tsx:1` | bands: village/bg, village/dawn |
| school set | ep16 | `episodes/ep16/sets/school.tsx:1` | bands: school/corridor, school/fg, school/night, school/nightfg |
| stall set | ep16 | `episodes/ep16/sets/stall.tsx:1` | bands: stall/door, stall/room, stall/room2 |
| llanos set | ep17 | `episodes/ep17/sets/llanos.tsx:1` | bands: llanos/dawn, llanos/far, llanos/fg, llanos/sky |
| ranch set | ep17 | `episodes/ep17/sets/ranch.tsx:1` | bands: ranch/city, ranch/porch, ranch/room |
| ExteriorBand | ep18 | `episodes/ep18/art/house_lib.tsx:50` |  |
| ExtFgBand | ep18 | `episodes/ep18/art/house_lib.tsx:124` |  |
| InteriorBand | ep18 | `episodes/ep18/art/house_lib.tsx:133` |  |
| barrio set | ep18 | `episodes/ep18/sets/barrio.tsx:1` | bands: barrio/dawn, barrio/fg, barrio/hut, barrio/sky |
| house set | ep18 | `episodes/ep18/sets/house.tsx:1` | bands: house/crib, house/fg, house/room |
| close set | ep19 | `episodes/ep19/sets/close.tsx:1` | bands: close/desk, close/floor, close/wall |
| room set | ep19 | `episodes/ep19/sets/room.tsx:1` | bands: room/fg, room/wall |
| close set | ep20 | `episodes/ep20/sets/close.tsx:1` | bands: close/bg, close/coat, close/hide, close/neck |
| graphic set | ep20 | `episodes/ep20/sets/graphic.tsx:1` | bands: graphic/sky |
| loch set | ep20 | `episodes/ep20/sets/loch.tsx:1` | bands: loch/garden, loch/shore, loch/sky, loch/water |
