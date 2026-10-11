# Frame-Sliced Design: Lineage

Bu doküman Frame-Sliced Design'ın nereden geldiğini anlatır: hangi yöntemden neyi aldık, neyi bilerek almadık ve dikey, sessiz izlenen, saniyelerle ölçülen dijital çağa nasıl uyarladık.

Kuralları ve teknikleri öğrenmek için diğer klasörler var. Bu doküman **neden böyle olduklarını** anlatır.

---

## 1. Neden böyle bir yönteme ihtiyaç var

Sinema kurgusunun yüz yıllık bir literatürü var. Yazılım ve tasarımın da parçaları düzenlemek için olgun yöntemleri var. Sosyal medya kurgusunun ise elinde dağınık ipuçları var: "ilk 3 saniye önemli", "altyazı koy", "hook at". Bunlar bir sistem değil, tecrübe listesi.

Dikey video, klasik kurgudan dört temel noktada ayrılır:

1. **Ekran dik ve küçük.** Kadraj, yazı boyutu ve okunurluk sinemadaki gibi düşünülemez.
2. **Ses çoğu zaman kapalı.** Hikâye sadece görüntü ve yazıyla da anlaşılmak zorunda.
3. **İzleyici her an kaydırabilir.** İlk saniye, sinemadaki ilk sahneden çok daha ağır bir yük taşır.
4. **Video bir arayüzün içinde oynar.** Butonlar, açıklama metni ve sekmeler karenin bir kısmını kapatır.

Buna iki üretim gerçeği eklenir: seriler her gün üretilir ve çoğu zaman tek kişi (ya da bir kişi ve bir yapay zekâ) üretir. Bu hızda her kararı sıfırdan vermek imkânsızdır; ama her videonun aynı görünmesi de kabul edilemez.

Frame-Sliced Design bu ikilemi çözmek için var: **sabit olan sistem, değişken olan video.**

---

## 2. Soy ağacı

| Kaynak | Alanı | Ne aldık | Sistemdeki yeri |
|---|---|---|---|
| Feature-Sliced Design | Frontend mimarisi | Katmanlar, tek yönlü bağımlılık, dilimlerin bağımsızlığı, her dilimin vitrini | Tüm yapı |
| Atomic Design | Tasarım sistemleri | Küçük parçalardan büyük bütün kurma dili | foundation → techniques → blocks → formats |
| Design Tokens | Tasarım sistemleri | Değerlerin tek yerde durması | `foundation/tokens.json`, marka tokenları |
| Walter Murch | Film kurgusu | Kararların öncelik sırası | `rules/decision-priority.md` |
| Bruce Block | Görsel hikâye anlatımı | Kontrast/uyum, yoğunluk eğrisi | Ön yapım, vurgu yerleşimi |
| Thompson & Bowen | Kurgu ve çekim grameri | Ortak terim dili | `glossary.md` |
| Eisenstein | Montaj teorisi | Kesimin bir amacı olması | Geçiş ve kesim kuralları |
| Steven Katz | Yönetmenlik | Çekimden önce planlama | Görsel plan |
| Bordwell & Thompson | Film analizi | Mizansen: kadraj içindeki her şeyin bilinçli yerleşimi | Yazı, yüz ve ekran yerleşimi |
| TV show / format bible | Televizyon | Sabit ve değişkenin yazılı tanımı | `formats/`, seri `bible.md` |
| Dogme 95 | Sinema hareketi | Kısıtların manifesto olarak yazılması | `rules/manifesto.md` |
| Christopher Alexander | Mimarlık | Pattern dili: problem → çözüm kalıpları | Hook, vurgu ve geçiş tip kütüphaneleri |
| Diátaxis | Teknik dokümantasyon | Öğretici / nasıl yapılır / başvuru / açıklama ayrımı | `start/`, README'ler, bu doküman |
| COPE (NPR) | İçerik modelleme | Bir kez üret, her kanala uyarla | Teslim ve yayın metinleri |
| Sosyal medya üretim notları | Platform pratiği | Tutma oranı, ilk saniyeler, ölçüm | `learning/`, hook bloğu |

---

## 3. Yazılım ve tasarımdan aldıklarımız

### Feature-Sliced Design (omurga)
**Aldık:** FSD bir frontend projesini katmanlara (app, pages, widgets, features, entities, shared) ve dilimlere ayırır. Üç kuralı vardır: bir katman sadece altındakileri kullanır, aynı katmandaki dilimler birbirini bilmez, her dilim dışarıya sadece vitrinini (public API) gösterir.

**Uyarladık:**
- Katmanların karşılıkları: app → kurallar ve akış, pages → formatlar, widgets → bloklar, features → teknikler, entities → markalar, shared → temel.
- Kodda "public API" olan şey burada README'dir. Bir tekniği kullanmak için içini bilmek gerekmez, README'sini okumak yeter.
- Bağımlılık kuralı yaratıcı bir özgürlük sağlar. Altyazı stili değiştiğinde hiçbir format bozulmaz; yeni bir vurgu tipi eklendiğinde hiçbir blok yeniden yazılmaz.

**Almadık:** FSD'nin yazılıma özel kısımlarını (segmentler, import kuralları, lint araçları) bire bir taşımadık. Kodla yazılan teknikler için ileride geri dönebilir.

### Atomic Design (parçaların dili)
**Aldık:** Brad Frost'un atom → molekül → organizma → şablon → sayfa dizisi. Tasarımcıların zaten bildiği bir dil.

**Uyarladık:** Renk ve ses atomdur; altyazı ve vurgu moleküldür; hook ve kapanış kartı organizmadır; talking-head bir şablondur; her gün yayınlanan video sayfadır. FSD yapıyı, Atomic Design ise o yapıyı anlatmanın dilini verir.

### Design Tokens (tek doğru değer)
**Aldık:** Renk, yazı tipi ve boşluk gibi değerlerin tek bir yerde tanımlanması; araçlar değişse de değerin aynı kalması.

**Uyarladık:** Videoda token sadece renk değildir. Süreler (bir kartın giriş süresi), ses seviyeleri (müziğin konuşma altındaki LUFS değeri), hareket ölçüleri (yakınlaşma oranı) ve güvenli alanlar da tokendır. Marka tokenları temel tokenların üstüne yazar.

### Diátaxis (öğretme)
**Aldık:** Dokümanları dört türe ayırmak: öğretici (ilk kez yapan için), nasıl yapılır (belirli bir iş için), başvuru (değerler ve kurallar), açıklama (neden).

**Uyarladık:** `start/first-video.md` öğreticidir. Teknik README'leri nasıl yapılırdır. Tokenlar ve güvenli alanlar başvurudur. Bu doküman açıklamadır. Yöntemi başkasına öğretirken bu dört tür birbirine karıştırılmaz.

---

## 4. Kurgu ve yönetmenlikten aldıklarımız

### Walter Murch – Rule of Six
**Aldık:** Murch bir kesimi altı kritere göre ve ağırlıklı bir sırayla değerlendirir: duygu, hikâye, ritim, göz takibi, iki boyutlu düzlem, üç boyutlu mekân. Çatışmada üstteki kazanır.

**Uyarladık:** Sıralamayı dikey video için yeniden kurduk: mesaj, duygu, ritim, **okunurluk**, marka, süs. Okunurluk Murch'te yoktur, çünkü sinemada sesi kapalı, telefonda ve bir arayüzün altında izleyen biri yoktur. Murch'ün göz takibi ve düzlem kriterleri bizde okunurluk ve güvenli alan kurallarına dönüştü.

### Bruce Block – Kontrast ve uyum
**Aldık:** Block görüntüyü yedi bileşene ayırır (mekân, çizgi, şekil, ton, renk, hareket, ritim) ve şunu söyler: kontrast yoğunluğu artırır, uyum düşürür. Bir film boyunca yoğunluk bilinçli bir eğri çizer.

**Uyarladık:** 45 saniyelik bir videonun da yoğunluk eğrisi vardır. Ön yapımda çizilir; vurgular zirvelere yerleşir. "Her vurgu farklı tipte olsun" kuralı doğrudan buradan gelir: aynı tip vurgunun tekrarı uyumdur, yoğunluğu düşürür. Seriler için bir adım daha ileri gittik: iki ardışık videoda aynı hook tipi kullanılmaz.

### Thompson & Bowen – Çekim ve kurgu grameri
**Aldık:** Çekim tiplerinin, kesimlerin ve geçişlerin ortak adları.

**Uyarladık:** Sözlüğe sosyal medyanın kendi terimlerini ekledik: hook, safe zone, pattern interrupt, ducking. Sektörde İngilizce kullanılan terimler İngilizce kaldı, açıklamaları Türkçe.

### Eisenstein – Montaj
**Aldık:** Kesimin bir işlevi olduğu fikri: ritim kurar, anlam üretir, iki görüntüden üçüncü bir fikir doğurur.

**Uyarladık:** "Her kesime efekt konmaz" kuralı. Geçiş sadece bir anlam taşıdığında kullanılır: bölüm değişiminde ya da iki farklı çekimin birleştiği yerde. Jump-cut'lar efektle değil kadraj değişimiyle maskelenir.

### Steven Katz – Çekimden önce plan
**Aldık:** Sahnenin çekimden önce kâğıtta kurulması.

**Uyarladık:** Storyboard yerine iki hafif araç: kâğıt kurgu (çekilmiş konuşmanın metin üzerinde kesilmesi) ve görsel plan tablosu (her cümlede ne görünecek). İkisi de render'dan önce onaylanır; render en pahalı adımdır.

### Bordwell & Thompson – Mizansen
**Aldık:** Kadraj içindeki her şeyin bilinçli olarak yerleştirildiği fikri.

**Uyarladık:** Dikey karede mizansen, yazının, yüzün ve uygulama ekranının nerede duracağıdır. Yazı yüzü kapatmaz. Ekran, kişinin jestinin gösterdiği yerde belirir. Platform arayüzünün kapattığı alanlar sahnenin bir parçası sayılır.

---

## 5. Televizyondan aldıklarımız: bible

### Show bible ve format bible
**Aldık:** Bir dizinin karakterlerini, tonunu ve kurallarını tanımlayan show bible; bir TV formatının başka ülkelerde aynı şekilde üretilebilmesi için sabit ve değişken parçalarını tanımlayan format bible.

**Uyarladık:**
- Her format (`formats/`) bir format bible'dır: segmentleri, sabitleri, değişkenleri ve kullandığı blokları tanımlar.
- Her seri kendi `bible.md`'sine sahiptir.
- Televizyonda bible ekipler arası aktarım içindir. Bizde bir de gün gün aktarım içindir: bugünkü video, dünkü videoyu yapan kişinin aklında kalanlara değil, yazılı bible'a dayanır.
- Bible'ın yanına bir şey ekledik: **kullanım günlüğü** (`log.md`). Televizyonda her bölümün ne kullandığı yapım ekibinin hafızasındadır; bizde yazılıdır, çünkü tekrar etmeme kuralı ona dayanır.

---

## 6. Kısıtlardan aldıklarımız: manifesto

### Dogme 95
**Aldık:** Lars von Trier ve Thomas Vinterberg'in on maddelik kural metni. Kısıtların yaratıcılığı beslediği, kuralların yazılı ve kısa olduğu bir manifesto.

**Uyarladık:** `rules/manifesto.md` bir "her zaman / asla" listesidir. Dogme'nin kuralları estetik bir duruştu; bizimkiler ise deneyimden çıktı. Her madde, bir videoda gerçekten yaşanmış bir sorunun kurala dönüşmüş hâlidir: altyazının yoğun ekranla üst üste binmesi, sesli "bizi takip et"in kötü durması, telifli müzik riski gibi.

**Almadık:** Dogme'nin efekt ve müzik yasağını. Sosyal medyada ses tasarımı ve müzik izleyiciyi tutmanın parçasıdır.

---

## 7. Mimarlıktan aldıklarımız: pattern dili

### Christopher Alexander – A Pattern Language
**Aldık:** Tekrar eden bir problemi ve çözümünü tarif eden, birbirine bağlanabilen kalıplar.

**Uyarladık:** Hook tipleri, vurgu tipleri ve geçiş tipleri birer pattern kütüphanesidir. Her tip, hangi problemi çözdüğü ve ilk nerede kullanıldığıyla kaydedilir. Kütüphane her videoyla büyür; "her videoda en az bir yeni şey" kuralı bunu garanti eder.

---

## 8. Dijital çağa özgü eklediklerimiz

Hiçbir klasik kaynakta bulunmayan, platform gerçeğinden doğan parçalar:

- **Okunurluk bir karar kriteridir.** Sessiz izleme, küçük ekran ve arayüz üstü katmanlar.
- **Güvenli alanlar sahnenin parçasıdır.** Sağ şerit, alt açıklama alanı, üst sekmeler.
- **İlk saniye görsel bir hook'tur.** Konuşmanın ilk cümlesi aynı anda ekranda görsel olarak da kurulur.
- **Ölçerek öğrenme döngüsü.** Her yayından sonra ilk 3 saniyede kalma, ortalama izlenme ve tamamlanma oranları kaydedilir. Kurallar zamanla görüşe değil veriye göre değişir. Sinema bir kez yayınlanır; sosyal medya her gün yeniden test edilir.
- **Bir kez üret, her yere uyarla (COPE).** Aynı video TikTok, Reels ve Shorts'a gider; aynı metinden her platformun açıklaması çıkar.
- **İnsan ve yapay zekâ birlikte üretir.** Yöntem, kurgunun bir kısmını bir yapay zekâ asistanının yapabileceği şekilde yazıldı: kararlar açık kurallara bağlı, değerler tokenlarda, onay noktaları belli. İki kural bu yüzden var: yeni bir öğe eklenmeden önce önerilir ve onaylanır; hiçbir şey final onayından önce kalıcı olarak kaydedilmez.

---

## 9. Temel ilkeler

Bütün bu kaynaklardan süzülen altı ilke:

1. **Sabit olan sistem, değişken olan video.** Marka ve seri tanınır kalır; her video kendi içeriğinden yeniden kurulur.
2. **Her kararın bir önceliği vardır.** Mesaj, duygu, ritim, okunurluk, marka, süs.
3. **Kâğıtta kur, sonra render et.** Pahalı adım en sona kalır.
4. **Kontrast yoğunluk yaratır.** Vurgular farklı tiptedir ve eğrinin zirvelerine yerleşir.
5. **Parçalar bağımsızdır, vitrinleri vardır.** Her teknik tek başına değiştirilebilir ve README'sinden öğrenilir.
6. **Her yayın bir deneydir.** Ölç, kaydet, kuralı güncelle.

---

## 10. Okuma listesi

Önerilen sıra: Murch → Block → birkaç gerçek show bible → Atomic Design → Diátaxis.

**Kurgu ve yönetmenlik**
- Walter Murch, *In the Blink of an Eye*
- Bruce Block, *The Visual Story*
- Roy Thompson & Christopher Bowen, *Grammar of the Shot* ve *Grammar of the Edit*
- Steven Katz, *Film Directing Shot by Shot*
- David Bordwell & Kristin Thompson, *Film Art*
- Sergei Eisenstein, *Film Form* (önce "Every Frame a Painting" video denemeleri)

**Televizyon**
- Pamela Douglas, *Writing the TV Drama Series*
- Yayınlanmış show bible örnekleri (ör. *Star Trek: The Next Generation* yazar bible'ı)
- FRAPA (Format Recognition and Protection Association) yayınları

**Kısıtlar**
- Dogme 95 manifestosu ve "Vow of Chastity"; örnek film: Thomas Vinterberg, *Festen* (1998)

**Tasarım ve yazılım**
- Brad Frost, *Atomic Design* (atomicdesign.bradfrost.com)
- Feature-Sliced Design dokümantasyonu (feature-sliced.design)
- Diátaxis (diataxis.fr)
- Christopher Alexander, *A Pattern Language*

**Platform pratiği**
- MrBeast ekibinin 2024'te sızan üretim dokümanı
