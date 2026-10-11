# Örnek: Rota – "Herkes Rota'yı duyana kadar: Gün 1"

Frame-Sliced Design'ın ilk kez uygulandığı video. Yöntemin kendisi bu videoyu yaparken ortaya çıktı; bu yüzden burada hem son hâli hem de **hangi denemenin hangi kurala dönüştüğü** var.

- Format: [talking-head](../../formats/talking-head/README.md)
- Süre: 43,6 sn (41,8 sn konuşma + 1,8 sn outro)
- Çıktı: 1080×1920, 30 fps, H.264
- Ham malzeme: aynı oturumda çekilmiş iki take (A: 2:28, B: 2:03), 4K 60 fps, dikey
- Render: [tools/render](../../tools/render/README.md), zaman çizelgesi: [timeline.json](timeline.json)

Ham çekimler ve ekran görüntüleri bu repoda yok; marka paketinde (Rota tarafında) durur.

---

## 1. Ön yapım

### Mesaj
"Rota istediğin kadar soru çözdürür, seni tanır, gece bile koçun olur ve her hafta sana özel plan hazırlar."

### Kâğıt kurgu
İki take farklı metinlerle çekilmişti. A take'i bir problemle açılıyordu (ne çalışacağını bilememek), B take'i ise özellikleri anlatıyordu. B daha akıcı olduğu için omurga oldu, A'dan sadece açılış alındı.

| # | Kaynak | Giriş | Çıkış | Metin |
|---|---|---|---|---|
| 1 | A | 0.00 | 6.20 | YKS'ye çalışan herkes bu uygulamayı duyana kadar video çekiyorum. Gün 1. |
| 2 | B | 7.10 | 9.12 | Ben İrem. Bu da Rota. |
| 3 | B | 11.42 | 16.46 | Bu uygulamada istediğin kadar TYT ya da AYT sorusu çözebiliyorsun. |
| 4 | B | 17.68 | 18.73 | Hiçbir sınır yok. |
| 5 | B | 20.79 | 23.97 | Sen sorularını çözdükçe Rota seni tanıyor. |
| 6 | B | 25.50 | 29.95 | Nerede iyisin, nerede takılıyorsun, nerede gelişme noktaların var. |
| 7 | B | 31.87 | 33.55 | Bir de içinde koçun var. |
| 8 | B | 34.06 | 40.41 | Gece 2'de de olsa yazabiliyorsun. Bir soruyu yapamadın mı diyelim, koçuna hemen soruyorsun. |
| 9 | B | 46.16 | 51.26 | Üstelik her pazartesi sana özel bir haftalık çalışma planı hazırlıyor. |
| 10 | B | 108.07 | 110.87 | Açıp o hafta ne yapacağına bakabiliyorsun. |
| 11 | B | 116.88 | 120.95 | Şimdilik sadece App Store'da ama bu ay sonuna kadar Android'e de gelecek. |

**Atılanlar ve nedenleri**
| Ne | Neden |
|---|---|
| A take'inin problem anlatımı ve WhatsApp grubu çağrısı | Takılmalar çoktu, B ile farklı bir hikâyeye gidiyordu |
| "Sana 7/24 cevap veriyor" | "Gece 2'de de olsa" ile aynı fikir (tekrar). 7/24 ekranda vurgu olarak kaldı |
| Uzun haftalık plan cümlesi ("…götürecek noktaları bilerek yapıyor") | Anlamı dağılıyordu ve "seni tanıyor" fikrini tekrar ediyordu; aynı take'teki kısa cümle seçildi |
| "Rota'yla ilgili gelişmeleri kaçırmamak için bizi takip et" | Sesli takip çağrısı zorlama duruyordu; yerine sessiz outro geldi |
| Çekim arası konuşmalar, yarım kalan cümleler | — |

### Görsel plan (son hâli)
| Zaman | Cümle | Görüntü | Teknik / blok | Ses |
|---|---|---|---|---|
| 0:00 | "…video çekiyorum. Gün 1." | sen + kinetik etiketler, "GÜN 1" mührü | hook: kinetic-labels, emphasis: stamp | pop, müzik boşluğu + çan |
| 0:06 | — | çapraz şeritler (take birleşimi) | transition: stripe-wipe | swoosh |
| 0:07 | "Bu da Rota." | ana sayfa, parmağın gösterdiği sağ üstte | screen-moment | tık |
| 0:09 | "istediğin kadar … sorusu" | dokunuş → soru ekranı, büyüyor | screen-moment (grow) | tık |
| 0:13 | "Hiçbir sınır yok." | SINIRSIZ SORU | emphasis: big-kinetic | müzik boşluğu + pop |
| 0:14 | "Rota seni tanıyor." | sen | — | — |
| 0:17 | "Nerede iyisin…" | ✓ ✕ ↗ kartları | emphasis: stacked-chips | üç hafif tık |
| 0:22 | "koçun var… gece 2'de" | koç ekranı büyüyor + 7/24 etiketi | screen-moment, emphasis: sticker | tık, pop |
| 0:30 | "Üstelik her pazartesi" | daire geçişi, PAZARTESİ yaprağı | transition: iris, emphasis: page-flip | swoosh, kâğıt |
| 0:31 | "…planı hazırlıyor / açıp bakabiliyorsun" | çok dersli takvim büyüyor | screen-moment (grow) | tık |
| 0:38 | "App Store'da…" | uygulama kartı (üstte) | badge | pop |
| 0:41,8 | — | "Gün 2'de görüşürüz" | outro | swoosh + çan |
| tümü | — | köşede "GÜN 1" | seri etiketi | — |

### Yoğunluk eğrisi
```
  5 | ●                    ●               ●
  4 | ●                    ●     ●         ●      ●
  3 | ●       ●            ●     ●   ●     ●      ●     ●
  2 | ●   ●   ●   ●   ●    ●  ●  ●   ●  ●  ●  ●   ●  ●  ●
    |_hook__tanıtım_soru__SINIRSIZ_kartlar_7/24_PAZARTESİ__kapanış_outro
```

---

## 2. Çekim
Tek oturum, sabit ışık, yaka mikrofonu. Metin önceden yazılmamıştı; bu yüzden iki take farklı içerikte çıktı. Ders: [workflow/shoot.md](../../workflow/shoot.md) "kısa metinle çek" kuralı buradan.

## 3. Post
Uygulanan adımlar [workflow/post.md](../../workflow/post.md) sırasıyla:
1. Ses kurgusu ve temizlik: hafif gürültü azaltma, sıkıştırma, −16 LUFS
2. Görüntü kesimi: sesle kare kare
3. Renk eşitleme: en büyük fark 0:14–0:17 parçasındaydı (diğerlerinden koyu)
4. Ekranlar, yazılar, hareket, geçişler: zaman çizelgesinden render
5. Müzik (özgün, sentezlenmiş) ve efektler
6. Outro

---

## 4. Neler denendi, neler kurala dönüştü

Bu video 10 sürümde bitti. Her geri dönüş yönteme bir kural olarak girdi:

| Sürüm | Denenen | Geri bildirim | Kural |
|---|---|---|---|
| v1 | Ekranlar tam ekran, görüntüyü kapatıyor, aşağı kayıyor | "Çok fazla ekran" | Ekranlar görüntünün üstünde belirip kaybolur; [screen-moment](../../blocks/screen-moment/README.md) |
| v2 | Küçük telefon kartı, sağ alt | Okunmuyor; TikTok butonlarının altında | Okunacak ekran büyür; sağ şerit güvenli alan dışı |
| v3 | Tek tip vurgular, sarı + mavi | "Farklı tiplerde dikkat çeksin"; sarı sevilmedi | Her vurgu farklı tip; marka rengi dışı renk yok |
| v4 | Telefonun içine zoom | Okunmuyor | Telefonun içine değil, telefonun kendisine zoom |
| v5 | Sesli "bizi takip et" + buton animasyonu | "Kötü gözüküyor" | Sesli takip çağrısı yok; sessiz outro |
| v6–v7 | Klasördeki enerjik müzik, yüksek | Başka müzik, daha kısık | Müzik konuşma altında ~−36 LUFS; telifli müzik yok |
| v8 | — | Yönetmen gözüyle kontrol | Telefonda sesli/sessiz kontrol adımı |
| v9 | Ekran solda | Parmak sağ üstü gösteriyordu | Ekran kişinin jestinin gösterdiği yerde belirir |
| v10 | Etiket arka planlı | Arka plansız, biraz büyük | Seri etiketi: arka plansız marka renginde yazı |

Açık konu: koç ekranı ve çok dersli takvim, gerçek ekranlardan türetilmiş tasarımlardı. Kural gerçek ekran kullanmaktır; sonraki videolarda uygulamadan çekilmiş ekranlar kullanılacak.

---

## 5. Yayın
- Başlık: "Herkes Rota'yı duyana kadar: Gün 1"
- TikTok: link yok, WhatsApp grubu için yorumlara "katılmak istiyorum" çağrısı
- YouTube Shorts: açıklamada site linki

## 6. Sonuçlar
_Yayından ~48 saat sonra: ilk 3 sn'de kalma, ortalama izlenme, tamamlanma, yorum/kayıt. Serinin log.md'sine de işlenir._
