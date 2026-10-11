# Frame-Sliced Design

Dikey sosyal medya videoları (TikTok, Reels, Shorts) için katmanlı bir kurgu yöntemi.

Frame-Sliced Design üç geleneği birleştirir:
- **Feature-Sliced Design:** katmanlar, tek yönlü bağımlılık, her parçanın bir vitrini (README) olması
- **Atomic Design ve Design Tokens:** parçaların küçükten büyüğe birleşmesi; renk, yazı tipi, süre gibi değerlerin tek yerde durması
- **Kurgu ve yönetmenlik literatürü:** Walter Murch'ün karar önceliği, Bruce Block'un kontrast/uyum ilkesi, TV'deki format bible

## Katmanlar

Yukarıdan aşağıya. Bir katman sadece altındaki katmanları kullanabilir.

| Katman | FSD karşılığı | Ne var |
|---|---|---|
| `rules/` + `workflow/` | app | Her videoda geçerli kurallar ve üretim akışı |
| `formats/` | pages | Video türleri ve format bible'ları |
| `blocks/` | widgets | Hazır bloklar: hook, outro, ekran anı |
| `techniques/` | features | Tek tek kurgu teknikleri |
| `brands/` | entities | Markaya ait nesneler: tokenlar, ekranlar, seriler |
| `foundation/` | shared | Hiçbir şeyi bilmeyen temel değerler ve sesler |

Ek parçalar: `start/` (buradan başla), `glossary.md` (ortak dil), `learning/` (yayın sonrası öğrenme).

## Üç kural
1. **Bağımlılık sadece aşağı doğru.** `techniques/emphasis` renklerini `foundation/`'dan ya da markanın tokenlarından alır, ama hangi formatta kullanıldığını bilmez.
2. **Aynı katmandaki dilimler birbirini bilmez.** `captions` ile `transitions` bağımsızdır; biri değişince öteki etkilenmez.
3. **Her dilimin vitrini README'sidir.** Ne olduğu, ne zaman kullanıldığı, nasıl kullanıldığı ve bir örnek.

## Dil
Klasör ve dosya adları İngilizce, içerik Türkçe. Sektör terimleri (hook, punch-in, safe zone) İngilizce kalır; açıklamaları `glossary.md`'de.

Yeniysen [start/README.md](start/README.md) ile başla. Yöntemin nereden geldiğini ve neden böyle kurulduğunu merak ediyorsan: [lineage.md](lineage.md).
