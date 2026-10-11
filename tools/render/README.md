# tools/render

Frame-Sliced Design'ın render aracı. Bir `timeline.json` dosyasından dikey videoyu üretir. Tamamen JavaScript: görsel katman tarayıcıda (Playwright + Chromium) çizilir, ses Node.js'te miklenir, kodlama FFmpeg ile yapılır.

Doğrulama: [Rota Gün 1](../../examples/rota-day-1/README.md) bu araçla yeniden üretildi ve onaylanan son sürümle kare kare karşılaştırıldı (görsel fark yok, ses yüksekliği aynı: −16,1 LUFS).

## Kurulum

Gerekenler: Node.js 20+, FFmpeg, Chromium (Playwright'ın kendi tarayıcısı).

```
cd tools/render
npm install
npx playwright install chromium
```

Transkripsiyon için (isteğe bağlı): `npm install sherpa-onnx-node` ve [sherpa-onnx sürümlerinden](https://github.com/k2-fsa/sherpa-onnx/releases) bir Whisper modeli (ör. `sherpa-onnx-whisper-turbo`).

## Akış

```
1. transcribe   çekimleri metne dök (cümle zamanlarıyla)        → kâğıt kurgu için
2. cut          kâğıt kurgudan temiz ses + kesilmiş görüntü      → voice.m4a, base.mp4
3. timeline     timeline.json'u yaz (görsel plan → JSON)
4. stills       birkaç kareyi hızlıca kontrol et                 → onay
5. render       ses miksi + kareler + kodlama                    → final.mp4
```

## Komutlar

```
node fsd.mjs transcribe IMG_1123.MOV --model whisper-turbo/ --words --out phrases.json
node fsd.mjs cut edit.json --out-dir cut/
node fsd.mjs stills timeline.json --assets screens/ --brand brand.json --times 1 13.8 25 --out stills/
node fsd.mjs mix timeline.json --voice cut/voice.m4a --sfx-dir sfx/ --out mix.wav
node fsd.mjs render timeline.json --base cut/base.mp4 --voice cut/voice.m4a \
    --assets screens/ --sfx-dir sfx/ --brand brand.json --out final.mp4
```

- `--assets`: timeline'daki `assets` yollarının göreli olduğu klasör (marka paketinin ekranları).
- `--brand`: marka tokenları (`color.primary`, `color.ink`, `color.paper`, `color.error`, `color.muted`, `font.family`).
- `--sfx-dir`: efekt sesleri klasörü; dosya adları `audio.sfxFiles` ile eşlenir. `sparkle` ve `paper` sesleri yerleşiktir.
- `--music`: müzik dosyası; verilmezse `audio.music.source: "synth"` ile özgün fon müziği üretilir.

## edit.json (cut için)

```json
{
  "sources": { "A": "IMG_1122.MOV", "B": "IMG_1123.MOV" },
  "pieces": [
    { "src": "A", "in": 0.00, "out": 6.08 },
    { "src": "B", "in": 46.31, "out": 51.26, "hardOut": true }
  ]
}
```
`in`/`out` konuşmanın başladığı ve bittiği yerdir. Araç nefes için kısa bir giriş payı bırakır ve ses sönene kadar sonu uzatır. `hardOut: true` tam `out`'ta keser; istenmeyen bir kelimeden önce durmak için kullanılır. Çıktıdaki `pieces.json`, timeline'ın `segments` alanı için kesim noktalarını verir.

## timeline.json

Tam örnek: [examples/rota-day-1/timeline.json](../../examples/rota-day-1/timeline.json). Bütün zamanlar saniye cinsindendir.

| Alan | Ne | Katman |
|---|---|---|
| `canvas`, `duration`, `voiceEnd` | Ölçü, toplam süre, konuşmanın bittiği an | — |
| `assets` | Ad → dosya (ekranlar, ikon) | brands |
| `segments` | Kesim noktaları; renk eşitleme parça parça yapılır | techniques/color-match |
| `zoom` | Parça başına yakınlaşma anahtar kareleri, `anchorY` yüz hizası | techniques/motion |
| `grade` | Renk eşitleme gücü | techniques/color-match |
| `words` | Kelime zamanları | techniques/captions |
| `captions` | Parça başına kelime/karakter sınırı, `y`, ek `hide` aralıkları | techniques/captions |
| `hook` | `kinetic-labels`: satırlar, `at`, `style` (ink/paper/primary), `until` | blocks/hook |
| `screenMoments` | Telefon anları: `from`, `to`, `anchor` (left/top-right/top-left/right), `grow`, `screens`, `tap` | blocks/screen-moment |
| `emphasis` | `stamp`, `big-kinetic`, `stacked-chips`, `sticker`, `page-flip` | techniques/emphasis |
| `badge` | Uygulama/mağaza kartı | blocks |
| `seriesTag` | Köşedeki seri etiketi | brands/series |
| `transitions` | `stripe-wipe`, `iris` (`at` = kesim anı) | techniques/transitions |
| `outro` | Kapanış kartı: `lines`, `pill`, `footer`, `icon` | blocks/outro |
| `audio.music` | `source`, `gapsDb`, `underVoiceDb`, `dips`, `fadeIn`, `fadeOut` | techniques/sound-design |
| `audio.sfx` | `{ at, sound, db }` listesi | techniques/sound-design |

Büyük vurgular (big-kinetic, stacked-chips, page-flip) ve hook sırasında altyazı otomatik gizlenir. Telefon büyüdüğünde altyazı telefonun altına iner.

## Yeni bir öğe eklemek

Yeni bir vurgu tipi ya da geçiş `overlay/engine.js`'e ve stili `overlay/engine.html`'e eklenir. Aynı öğe ilgili teknik README'sinin tip tablosuna da yazılır. Kural: önce öner, onaylanınca ekle.

## Dosyalar

| Dosya | Ne |
|---|---|
| `fsd.mjs` | Komut satırı |
| `overlay/engine.html`, `overlay/engine.js` | Görsel katman motoru: timeline'ı okur, `setTime(t)` ile kareyi çizer |
| `lib/render.mjs` | Kare çizimi ve FFmpeg'e aktarım, renk eşitleme |
| `lib/mix.mjs` | Ses miksi: konuşma, müzik (ducking, boşluklar), efektler |
| `lib/sounds.mjs` | Yerleşik sesler: sparkle, paper, özgün fon müziği |
| `lib/cut.mjs` | Kâğıt kurgudan ses ve görüntü kesimi |
| `lib/transcribe.mjs` | Transkripsiyon (sherpa-onnx) |

`cut` ve `transcribe` Gün 1'de kullanılan Python adımlarından JavaScript'e taşındı; Gün 1'in render'ı bu araçla doğrulandı, bu iki komut ise ilk kez Gün 2'de çalışacak.
