# Katkı kuralları

## Commit mesajı

Başlık formatı:

```
<Tür>: <Kısa açıklama>
```

- Tür büyük harfle başlar ve iki noktayla biter: `Feat:`, `Fix:` gibi.
- Açıklama büyük harfle başlar, kısa ve İngilizcedir.
- Başlığın sonunda nokta yok.
- Başlık ne tür bir iş olduğunu tek bakışta söyler.

### Türler

| Tür | Ne zaman |
|---|---|
| `Feat` | Yeni bir şey: yeni teknik, blok, format, araç |
| `Fix` | Bir hatanın ya da yanlış bilginin düzeltilmesi |
| `Docs` | Sadece dokümantasyon değişikliği |
| `Refactor` | Davranışı değiştirmeden yapıyı düzenleme (taşıma, yeniden adlandırma) |
| `Style` | Biçim, yazım, düzen; anlam değişmez |
| `Chore` | Bakım işleri: `.gitignore`, ayarlar, bağımlılıklar |

### Örnekler

```
Feat: Add page-flip emphasis type
Fix: Correct safe zone values for Reels
Docs: Add lineage document
Refactor: Move screen-moment rules into blocks
Chore: Ignore render outputs
```

Yanlış örnekler:

```
feat: add page flip            ← tür küçük harf
Feat: Add page-flip emphasis.  ← sonda nokta var
Added new emphasis             ← tür yok
```

Gerekirse başlıktan sonra bir boş satır bırakılıp açıklama gövdesi yazılır.
