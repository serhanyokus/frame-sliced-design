# Block: screen-moment

Uygulama ekranının, söylendiği anda görüntünün üstüne gelmesi.

## Davranış
1. Telefon kartı küçük gelir. Konum kişinin jestine göre seçilir (gösterilen köşe); jest yoksa sol taraf (sağ şeritte platform butonları var).
2. Okunması gereken ekransa ~0,5 sn sonra ortaya gelip büyür (ölçek ~1,4). Telefonun içine zoom yapılmaz; telefonun kendisi büyür.
3. Altyazı telefonun altına iner.
4. Cümle bitince kart kaybolur.

## Kurallar
- Sadece gerçek ürün ekranları. Eksik ekran uygulamadan çekilir; yeniden çizilen ekran gerçek ekran gibi sunulmaz.
- Ekrandaki kişisel detaylar konuşmayla tutarlı olmalı (ör. isim).
- Yüzün uzun süre kapanması ritmi düşürür; tek seferde ~6 sn'yi geçmemeye çalış.

## Kullandığı teknikler
motion (büyütme), sound-design (tık), captions (konum değişimi)
