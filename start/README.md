# Buradan başla

Frame-Sliced Design'ı 5 dakikada anlamak için:

1. **Kurallar sabittir, video değişkendir.** `rules/` her videoda geçerlidir; ama hiçbir video bir öncekine benzemek zorunda değildir. Sabit olan sadece markayı ve seriyi tanıtan kısımdır.
2. **Her karar bir önceliğe bağlıdır.** İki şey çatıştığında [karar önceliği](../rules/decision-priority.md) kazananı belirler.
3. **Video kurgudan önce kâğıtta kurulur.** Metin, kâğıt kurgu ve görsel plan onaylanmadan render yapılmaz.
4. **Parçalar kütüphaneden seçilir, her seferinde sıfırdan icat edilmez.** Teknikler ve bloklar içeriğe göre seçilir ve birleştirilir.
5. **Her yayından öğrenilir.** Metrikler `learning/`'e, kullanım `brands/<marka>/series/<seri>/log.md`'ye yazılır.

İlk videonu yapmak için: [first-video.md](first-video.md)
