CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  place_of_study TEXT,
  interest_area TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_idx
  ON waitlist_signups (lower(email));

ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Мультиязычность: каждый ключ контента может иметь версию на нескольких локалях.
-- Существующие строки остаются под locale='ru' (DEFAULT), ничего не теряется.
-- Composite PK пересоздаётся на каждый запуск — дешёвая операция, безопасна при повторных прогонах.
-- Должно идти раньше сидирующего INSERT ниже, у которого ON CONFLICT (key, locale).
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ru';
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_pkey;
ALTER TABLE site_content ADD PRIMARY KEY (key, locale);

-- Snapshot of the full site_content table taken right before each save (and before each
-- restore), so an accidental edit or a bad restore can always be undone from the admin panel.
CREATE TABLE IF NOT EXISTS site_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Drops keys from an earlier version of the field list that flattened text which used to
-- have an accent-colored span inside it (see hero_title_main/accent and problem_closing_*
-- below) — without this, the old rows would just sit unused in the table forever.
DELETE FROM site_content WHERE key IN ('hero_title', 'problem_closing');

-- Seeds the editable landing page copy with its current wording. Only runs once per key
-- (ON CONFLICT DO NOTHING) so it never overwrites edits made later from the admin panel.
INSERT INTO site_content (key, value) VALUES
  ('cta_label', 'Зарегистрироваться'),

  ('hero_title_main', 'Фестивали и связи тюркских стран — '),
  ('hero_title_accent', 'в одном месте'),
  ('hero_subtitle', 'Фестивали и события тюркского мира разбросаны по десяткам сайтов и чатов — а нужные связи теряются вместе с ними. TURKIC STUDENTS собирает всё в одном месте. Оставь имя и email — узнаешь о запуске одним из первых.'),

  ('problem_badge', 'Трудность'),
  ('problem_title', 'Информация есть, но ты не там ищешь'),
  ('problem_text', 'Новости вуза — на его сайте. Фестиваль — в чате, который ты давно не открывал. Контакты участников — в десятке разных мессенджеров. Пока собираешь всё по кусочкам, дедлайн уже прошёл.'),
  ('problem_source_1', 'Сайты университетов'),
  ('problem_source_2', 'Объявления вузов'),
  ('problem_source_3', 'Страницы отдельных фестивалей'),
  ('problem_source_4', 'Анонсы в соцсетях'),
  ('problem_source_5', 'Десятки чатов и групп'),
  ('problem_closing_before', 'И это только '),
  ('problem_closing_emphasis', 'твоя'),
  ('problem_closing_after', ' страна! Про остальные пять ты, скорее всего, даже не подозреваешь.'),

  ('solution_badge', 'Решение'),
  ('solution_title', 'Студенческое творчество на одной платформе'),
  ('solution_text', 'Информация остаётся у вузов и фестивалей — мы просто собираем её в одном месте и превращаем в среду, где связи продолжаются и после фестиваля!'),
  ('solution_benefit_1_title', 'Единый каталог'),
  ('solution_benefit_1_text', 'Фестивали, события и новости вузов — в одном месте, со ссылкой на источник.'),
  ('solution_benefit_2_title', 'Профиль под тебя'),
  ('solution_benefit_2_text', 'Укажи страну, вуз и интересы — увидишь только то, что подходит тебе.'),
  ('solution_benefit_3_title', 'Люди, а не только объявления'),
  ('solution_benefit_3_text', 'Находи единомышленников и собирай команду уже после мероприятия.'),

  ('cycle_badge', 'Круглый год'),
  ('cycle_title', 'Один фестиваль ведёт к следующему'),
  ('cycle_text', 'Без постоянной среды между фестивалями всё каждый раз начинается с нуля — мы это меняем.'),
  ('cycle_step_1_title', 'Фестиваль'),
  ('cycle_step_1_text', 'Встреча на реальном мероприятии'),
  ('cycle_step_2_title', 'Контакт'),
  ('cycle_step_2_text', 'Общение продолжается и после того, как ты уехал домой'),
  ('cycle_step_3_title', 'Сообщество'),
  ('cycle_step_3_text', 'Находишь единомышленников из других стран тюркского мира'),
  ('cycle_step_4_title', 'Сотрудничество'),
  ('cycle_step_4_text', 'Если идея креативна — она находит соавторов'),
  ('cycle_step_5_title', 'Новые проекты'),
  ('cycle_step_5_text', 'Идея превращается в инициативу с командой'),
  ('cycle_step_6_title', 'Новый фестиваль'),
  ('cycle_step_6_text', 'Сегодня ты участник, а через год автор интересного проекта'),
  ('cycle_note', 'Каждый фестиваль — начало следующего.'),

  ('audience_badge', 'Для кого'),
  ('audience_title', 'Ты на фестивале — значит, это для тебя'),
  ('audience_intro', 'Например, если ты:'),
  ('audience_segment_1', 'Уже был на фестивалях — и не хочешь, чтобы связи обрывались.'),
  ('audience_segment_2', 'Хочешь эти счастливые встречи превратить в постоянные связи'),
  ('audience_segment_3', 'Организуешь события или ведёшь проект — и ищешь партнёров в других странах.'),
  ('audience_outro', 'Позже подключатся вузы и организации. Но начинается всё с тебя.'),

  ('principles_badge', 'Принципы'),
  ('principles_title', 'Шесть стран, один тюркский мир'),
  ('principles_country_1', 'Азербайджан'),
  ('principles_country_2', 'Казахстан'),
  ('principles_country_3', 'Кыргызстан'),
  ('principles_country_4', 'Туркменистан'),
  ('principles_country_5', 'Турция'),
  ('principles_country_6', 'Узбекистан'),
  ('principles_item_1_title', 'Открытость'),
  ('principles_item_1_text', 'Доступна молодёжи всех стран тюркского мира — независимо от вуза и специальности.'),
  ('principles_item_2_title', 'Равноправие'),
  ('principles_item_2_text', 'Ни одна страна не является центральной.'),
  ('principles_item_3_title', 'Практическая польза'),
  ('principles_item_3_text', 'Не общие слова про сотрудничество, а конкретные события и контакты.'),
  ('principles_item_4_title', 'Достоверность'),
  ('principles_item_4_text', 'Только проверенная информация — со ссылкой на источник.'),
  ('principles_item_5_title', 'Солидарность'),
  ('principles_item_5_text', 'Мы вместе: студенты тюркского мира поддерживают друг друга и общие проекты.'),
  ('principles_item_6_title', 'Международность'),
  ('principles_item_6_text', 'Общее пространство шести стран с первого дня, а не проект одной страны.'),

  ('objections_title', 'Коротко, если сомневаешься'),
  ('objections_item_1_question', 'Платформы ведь ещё нет — зачем регистрироваться сейчас?'),
  ('objections_item_1_answer', 'Чем раньше наберётся аудитория, тем быстрее платформа заработает — а ты узнаешь о запуске одним из первых.'),
  ('objections_item_2_question', 'Не станет ли это очередным порталом, который закроется через полгода?'),
  ('objections_item_2_answer', 'Нет — мы будем развиваться: платформа растёт вместе с сообществом, к нам присоединяются вузы и студенты из разных стран.'),
  ('objections_item_3_question', 'Куда денутся мои данные?'),
  ('objections_item_3_answer', 'Имя и email нужны только для регистрации и уведомления о запуске — больше ни для чего.'),
  ('objections_item_4_question', 'У меня и так получается находить фестивали — зачем мне это?'),
  ('objections_item_4_answer', 'После фестиваля связи обычно обрываются. TURKIC STUDENTS — про то, что происходит после.'),
  ('waitlist_title', 'Регистрация открыта'),
  ('waitlist_text', 'Оставь имя и email — и попадёшь в число первых, кто получит доступ.'),

  ('footer_text', 'Цифровая платформа, которая соединяет студентов тюркского мира: образование, фестивали и совместные проекты.'),

  ('tvoi_golos_badge', 'Международный студенческий театральный фестиваль в Туркестане'),
  ('tvoi_golos_title', 'ТВОЙ ГОЛОС — ТВОЙ ФЕСТИВАЛЬ'),
  ('tvoi_golos_subtitle', 'Выскажись. Предложи. Влияй.'),
  ('tvoi_golos_text', 'Фестиваль — это не только спектакли и участники. Мы хотим услышать студентов: что ты думаешь о фестивале, каким хотел бы видеть его в будущем и что стоит изменить. Твоя идея может стать частью следующего фестиваля.'),
  ('tvoi_golos_alumni_note', 'К инициативе может присоединиться не только нынешнее студенческое сообщество вашего университета, но и его выпускники — люди, для которых университет остаётся частью их личной истории.')
ON CONFLICT (key, locale) DO NOTHING;

-- Машинный перевод контента лендинга на 6 языков проекта (az/kk/ky/tk/tr/uz).
-- ON CONFLICT (key, locale) DO NOTHING — как и у ru-блока выше, не перезаписывает то, что
-- позже отредактируют вручную (когда появится админ-UI для нерусских локалей).
INSERT INTO site_content (key, locale, value) VALUES
  ('cta_label', 'tr', 'Kayıt ol'),
  ('hero_title_main', 'tr', 'Türk ülkelerinin festivalleri ve bağlantıları — '),
  ('hero_title_accent', 'tr', 'tek bir yerde'),
  ('hero_subtitle', 'tr', 'Türk dünyasının festivalleri ve etkinlikleri onlarca site ve sohbete dağılmış durumda — ve gerekli bağlantılar onlarla birlikte kayboluyor. TURKIC STUDENTS her şeyi tek bir yerde topluyor. Adını ve e-postanı bırak — lansmanı ilk öğrenenlerden ol.'),
  ('problem_badge', 'tr', 'Zorluk'),
  ('problem_title', 'tr', 'Bilgi var, ama sen yanlış yerde arıyorsun'),
  ('problem_text', 'tr', 'Üniversite haberleri — kendi sitesinde. Festival — uzun zamandır açmadığın bir sohbette. Katılımcıların iletişim bilgileri — bir düzine farklı mesajlaşma uygulamasında. Her şeyi parça parça toplarken son tarih çoktan geçmiş oluyor.'),
  ('problem_source_1', 'tr', 'Üniversite siteleri'),
  ('problem_source_2', 'tr', 'Üniversite duyuruları'),
  ('problem_source_3', 'tr', 'Ayrı festival sayfaları'),
  ('problem_source_4', 'tr', 'Sosyal medya duyuruları'),
  ('problem_source_5', 'tr', 'Onlarca sohbet ve grup'),
  ('problem_closing_before', 'tr', 'Ve bu sadece '),
  ('problem_closing_emphasis', 'tr', 'senin'),
  ('problem_closing_after', 'tr', ' ülken! Diğer beş ülke hakkında muhtemelen haberin bile yok.'),
  ('solution_badge', 'tr', 'Çözüm'),
  ('solution_title', 'tr', 'Öğrenci yaratıcılığı tek bir platformda'),
  ('solution_text', 'tr', 'Bilgi üniversitelerde ve festivallerde kalıyor — biz onu sadece tek yerde topluyor ve bağlantıların festivalden sonra da sürdüğü bir ortama dönüştürüyoruz!'),
  ('solution_benefit_1_title', 'tr', 'Tek katalog'),
  ('solution_benefit_1_text', 'tr', 'Festivaller, etkinlikler ve üniversite haberleri — tek yerde, kaynak bağlantısıyla.'),
  ('solution_benefit_2_title', 'tr', 'Sana özel profil'),
  ('solution_benefit_2_text', 'tr', 'Ülkeni, üniversiteni ve ilgi alanlarını belirt — sadece sana uygun olanı göreceksin.'),
  ('solution_benefit_3_title', 'tr', 'Sadece ilanlar değil, insanlar'),
  ('solution_benefit_3_text', 'tr', 'Etkinlikten sonra bile aynı fikirdeki insanları bul ve ekibini kur.'),
  ('cycle_badge', 'tr', 'Yıl boyunca'),
  ('cycle_title', 'tr', 'Bir festival bir sonrakine götürür'),
  ('cycle_text', 'tr', 'Festivaller arasında sürekli bir ortam olmadan her şey her seferinde sıfırdan başlar — biz bunu değiştiriyoruz.'),
  ('cycle_step_1_title', 'tr', 'Festival'),
  ('cycle_step_1_text', 'tr', 'Gerçek bir etkinlikte tanışma'),
  ('cycle_step_2_title', 'tr', 'Bağlantı'),
  ('cycle_step_2_text', 'tr', 'İletişim eve döndükten sonra da devam ediyor'),
  ('cycle_step_3_title', 'tr', 'Topluluk'),
  ('cycle_step_3_text', 'tr', 'Türk dünyasının diğer ülkelerinden aynı fikirdeki insanları buluyorsun'),
  ('cycle_step_4_title', 'tr', 'İşbirliği'),
  ('cycle_step_4_text', 'tr', 'Fikir yaratıcıysa — ortak yazarlar bulur'),
  ('cycle_step_5_title', 'tr', 'Yeni projeler'),
  ('cycle_step_5_text', 'tr', 'Fikir bir ekiple girişime dönüşüyor'),
  ('cycle_step_6_title', 'tr', 'Yeni festival'),
  ('cycle_step_6_text', 'tr', 'Bugün katılımcısın, bir yıl sonra ilginç bir projenin yazarı'),
  ('cycle_note', 'tr', 'Her festival bir sonrakinin başlangıcıdır.'),
  ('audience_badge', 'tr', 'Kimler için'),
  ('audience_title', 'tr', 'Festivaldeysen — demek ki bu senin için'),
  ('audience_intro', 'tr', 'Örneğin, eğer sen:'),
  ('audience_segment_1', 'tr', 'Daha önce festivallere katıldın — ve bağlantıların kopmasını istemiyorsun.'),
  ('audience_segment_2', 'tr', 'Bu mutlu karşılaşmaları kalıcı bağlantılara dönüştürmek istiyorsun'),
  ('audience_segment_3', 'tr', 'Etkinlikler düzenliyorsun veya bir proje yürütüyorsun — ve diğer ülkelerde ortaklar arıyorsun.'),
  ('audience_outro', 'tr', 'Daha sonra üniversiteler ve kurumlar da katılacak. Ama her şey senden başlıyor.'),
  ('principles_badge', 'tr', 'İlkeler'),
  ('principles_title', 'tr', 'Altı ülke, tek bir Türk dünyası'),
  ('principles_country_1', 'tr', 'Azerbaycan'),
  ('principles_country_2', 'tr', 'Kazakistan'),
  ('principles_country_3', 'tr', 'Kırgızistan'),
  ('principles_country_4', 'tr', 'Türkmenistan'),
  ('principles_country_5', 'tr', 'Türkiye'),
  ('principles_country_6', 'tr', 'Özbekistan'),
  ('principles_item_1_title', 'tr', 'Açıklık'),
  ('principles_item_1_text', 'tr', 'Üniversite veya bölüm fark etmeksizin Türk dünyasının tüm ülkelerindeki gençlere açık.'),
  ('principles_item_2_title', 'tr', 'Eşitlik'),
  ('principles_item_2_text', 'tr', 'Hiçbir ülke merkezi konumda değil.'),
  ('principles_item_3_title', 'tr', 'Pratik fayda'),
  ('principles_item_3_text', 'tr', 'Genel işbirliği sözleri değil, somut etkinlikler ve iletişim bilgileri.'),
  ('principles_item_4_title', 'tr', 'Güvenilirlik'),
  ('principles_item_4_text', 'tr', 'Sadece doğrulanmış bilgi — kaynağına bağlantısıyla.'),
  ('principles_item_5_title', 'tr', 'Dayanışma'),
  ('principles_item_5_text', 'tr', 'Birlikteyiz: Türk dünyasının öğrencileri birbirini ve ortak projeleri destekler.'),
  ('principles_item_6_title', 'tr', 'Uluslararasılık'),
  ('principles_item_6_text', 'tr', 'İlk günden itibaren altı ülkenin ortak alanı, tek bir ülkenin projesi değil.'),
  ('objections_title', 'tr', 'Tereddüt ediyorsan, kısaca'),
  ('objections_item_1_question', 'tr', 'Platform henüz yok — neden şimdi kayıt olayım?'),
  ('objections_item_1_answer', 'tr', 'Kitle ne kadar erken toplanırsa, platform o kadar hızlı çalışmaya başlar — ve sen lansmanı ilk öğrenenlerden olursun.'),
  ('objections_item_2_question', 'tr', 'Bu, altı ay sonra kapanacak bir portal daha mı olacak?'),
  ('objections_item_2_answer', 'tr', 'Hayır — gelişmeye devam edeceğiz: platform topluluğuyla birlikte büyüyor, farklı ülkelerin üniversiteleri ve öğrencileri bize katılıyor.'),
  ('objections_item_3_question', 'tr', 'Verilerim nereye gidiyor?'),
  ('objections_item_3_answer', 'tr', 'İsim ve e-posta sadece kayıt ve lansman bildirimi için gerekli — başka hiçbir şey için değil.'),
  ('objections_item_4_question', 'tr', 'Festivalleri zaten bulabiliyorum — bu bana ne için?'),
  ('objections_item_4_answer', 'tr', 'Festivalden sonra bağlantılar genellikle kopar. TURKIC STUDENTS, sonrasında ne olduğuyla ilgili.'),
  ('waitlist_title', 'tr', 'Kayıt açık'),
  ('waitlist_text', 'tr', 'Adını ve e-postanı bırak — erişim kazananların ilklerinden ol.'),
  ('footer_text', 'tr', 'Türk dünyası öğrencilerini birbirine bağlayan dijital platform: eğitim, festivaller ve ortak projeler.'),
  ('tvoi_golos_badge', 'tr', 'Türkistan''da Uluslararası Öğrenci Tiyatro Festivali'),
  ('tvoi_golos_title', 'tr', 'SENİN SESİN — SENİN FESTİVALİN'),
  ('tvoi_golos_subtitle', 'tr', 'Sesini duyur. Öner. Etkile.'),
  ('tvoi_golos_text', 'tr', 'Festival sadece gösteriler ve katılımcılardan ibaret değil. Öğrencileri duymak istiyoruz: festival hakkında ne düşünüyorsun, gelecekte nasıl görmek istersin ve neyin değişmesi gerekiyor. Fikrin bir sonraki festivalin parçası olabilir.'),
  ('tvoi_golos_alumni_note', 'tr', 'Girişime yalnızca üniversitenizin mevcut öğrenci topluluğu değil, mezunları da katılabilir — üniversitenin kişisel tarihlerinin bir parçası olarak kaldığı insanlar.'),

  ('cta_label', 'az', 'Qeydiyyatdan keç'),
  ('hero_title_main', 'az', 'Türk ölkələrinin festivalları və əlaqələri — '),
  ('hero_title_accent', 'az', 'bir yerdə'),
  ('hero_subtitle', 'az', 'Türk dünyasının festivalları və tədbirləri onlarla sayt və çata səpələnib — və lazımi əlaqələr onlarla birlikdə itir. TURKIC STUDENTS hər şeyi bir yerdə toplayır. Adını və e-poçtunu burax — lansman haqqında ilk bilənlərdən ol.'),
  ('problem_badge', 'az', 'Çətinlik'),
  ('problem_title', 'az', 'Məlumat var, amma sən düz yerdə axtarmırsan'),
  ('problem_text', 'az', 'Universitet xəbərləri — onun saytında. Festival — çoxdan açmadığın çatda. İştirakçıların əlaqələri — onlarla müxtəlif mesencerdə. Hər şeyi hissə-hissə topladığın müddətdə son tarix artıq keçib.'),
  ('problem_source_1', 'az', 'Universitet saytları'),
  ('problem_source_2', 'az', 'Universitet elanları'),
  ('problem_source_3', 'az', 'Ayrı-ayrı festival səhifələri'),
  ('problem_source_4', 'az', 'Sosial şəbəkə elanları'),
  ('problem_source_5', 'az', 'Onlarla çat və qrup'),
  ('problem_closing_before', 'az', 'Bu, hələ yalnız '),
  ('problem_closing_emphasis', 'az', 'sənin'),
  ('problem_closing_after', 'az', ' ölkəndir! Qalan beşi haqqında çox güman ki, xəbərin belə yoxdur.'),
  ('solution_badge', 'az', 'Həll'),
  ('solution_title', 'az', 'Tələbə yaradıcılığı bir platformada'),
  ('solution_text', 'az', 'Məlumat universitetlərdə və festivallarda qalır — biz onu sadəcə bir yerə toplayır və festivaldan sonra da əlaqələrin davam etdiyi mühitə çeviririk!'),
  ('solution_benefit_1_title', 'az', 'Vahid kataloq'),
  ('solution_benefit_1_text', 'az', 'Festivallar, tədbirlər və universitet xəbərləri — bir yerdə, mənbəyə keçidlə.'),
  ('solution_benefit_2_title', 'az', 'Sənə uyğun profil'),
  ('solution_benefit_2_text', 'az', 'Ölkəni, universitetini və maraqlarını göstər — yalnız sənə uyğun olanı görəcəksən.'),
  ('solution_benefit_3_title', 'az', 'Təkcə elanlar deyil, insanlar'),
  ('solution_benefit_3_text', 'az', 'Tədbirdən sonra da eyni fikirdə olanları tap və komanda topla.'),
  ('cycle_badge', 'az', 'İl boyu'),
  ('cycle_title', 'az', 'Bir festival digərinə aparır'),
  ('cycle_text', 'az', 'Festivallar arasında daimi mühit olmadan hər şey hər dəfə sıfırdan başlayır — biz bunu dəyişirik.'),
  ('cycle_step_1_title', 'az', 'Festival'),
  ('cycle_step_1_text', 'az', 'Real tədbirdə tanışlıq'),
  ('cycle_step_2_title', 'az', 'Əlaqə'),
  ('cycle_step_2_text', 'az', 'Ünsiyyət evə qayıtdıqdan sonra da davam edir'),
  ('cycle_step_3_title', 'az', 'İcma'),
  ('cycle_step_3_text', 'az', 'Türk dünyasının digər ölkələrindən eyni fikirdə olanları tapırsan'),
  ('cycle_step_4_title', 'az', 'Əməkdaşlıq'),
  ('cycle_step_4_text', 'az', 'Fikir yaradıcıdırsa — həmmüəlliflər tapır'),
  ('cycle_step_5_title', 'az', 'Yeni layihələr'),
  ('cycle_step_5_text', 'az', 'Fikir komandalı təşəbbüsə çevrilir'),
  ('cycle_step_6_title', 'az', 'Yeni festival'),
  ('cycle_step_6_text', 'az', 'Bu gün iştirakçısan, bir il sonra maraqlı bir layihənin müəllifi'),
  ('cycle_note', 'az', 'Hər festival növbətinin başlanğıcıdır.'),
  ('audience_badge', 'az', 'Kimlər üçün'),
  ('audience_title', 'az', 'Festivaldasansa — deməli, bu sənin üçündür'),
  ('audience_intro', 'az', 'Məsələn, əgər sən:'),
  ('audience_segment_1', 'az', 'Artıq festivallarda olmusan — və əlaqələrin qırılmasını istəmirsən.'),
  ('audience_segment_2', 'az', 'Bu xoşbəxt görüşləri daimi əlaqələrə çevirmək istəyirsən'),
  ('audience_segment_3', 'az', 'Tədbirlər təşkil edirsən və ya layihə aparırsan — və digər ölkələrdə tərəfdaşlar axtarırsan.'),
  ('audience_outro', 'az', 'Sonra universitetlər və təşkilatlar da qoşulacaq. Amma hər şey səndən başlayır.'),
  ('principles_badge', 'az', 'Prinsiplər'),
  ('principles_title', 'az', 'Altı ölkə, bir türk dünyası'),
  ('principles_country_1', 'az', 'Azərbaycan'),
  ('principles_country_2', 'az', 'Qazaxıstan'),
  ('principles_country_3', 'az', 'Qırğızıstan'),
  ('principles_country_4', 'az', 'Türkmənistan'),
  ('principles_country_5', 'az', 'Türkiyə'),
  ('principles_country_6', 'az', 'Özbəkistan'),
  ('principles_item_1_title', 'az', 'Açıqlıq'),
  ('principles_item_1_text', 'az', 'Universitet və ixtisasından asılı olmayaraq türk dünyasının bütün ölkələrinin gəncliyi üçün əlçatandır.'),
  ('principles_item_2_title', 'az', 'Bərabərhüquqluluq'),
  ('principles_item_2_text', 'az', 'Heç bir ölkə mərkəzi deyil.'),
  ('principles_item_3_title', 'az', 'Praktik fayda'),
  ('principles_item_3_text', 'az', 'Əməkdaşlıq haqqında ümumi sözlər deyil, konkret tədbirlər və əlaqələr.'),
  ('principles_item_4_title', 'az', 'Etibarlılıq'),
  ('principles_item_4_text', 'az', 'Yalnız təsdiqlənmiş məlumat — mənbəyə keçidlə.'),
  ('principles_item_5_title', 'az', 'Həmrəylik'),
  ('principles_item_5_text', 'az', 'Birlikdəyik: türk dünyası tələbələri bir-birini və ortaq layihələri dəstəkləyir.'),
  ('principles_item_6_title', 'az', 'Beynəlxalqlıq'),
  ('principles_item_6_text', 'az', 'İlk gündən altı ölkənin ortaq məkanı, bir ölkənin layihəsi deyil.'),
  ('objections_title', 'az', 'Şübhələnirsənsə, qısaca'),
  ('objections_item_1_question', 'az', 'Platforma hələ yoxdur — niyə indi qeydiyyatdan keçim?'),
  ('objections_item_1_answer', 'az', 'Auditoriya nə qədər tez toplansa, platforma bir o qədər tez işə düşəcək — sən isə lansman haqqında ilk bilənlərdən olacaqsan.'),
  ('objections_item_2_question', 'az', 'Bu, altı aydan sonra bağlanacaq növbəti portal olmayacaqmı?'),
  ('objections_item_2_answer', 'az', 'Xeyr — inkişaf edəcəyik: platforma icma ilə birlikdə böyüyür, müxtəlif ölkələrin universitetləri və tələbələri bizə qoşulur.'),
  ('objections_item_3_question', 'az', 'Məlumatlarım hara gedəcək?'),
  ('objections_item_3_answer', 'az', 'Ad və e-poçt yalnız qeydiyyat və lansman bildirişi üçün lazımdır — başqa heç nə üçün deyil.'),
  ('objections_item_4_question', 'az', 'Festivalları özüm də tapa bilirəm — bu mənə nə üçün lazımdır?'),
  ('objections_item_4_answer', 'az', 'Festivaldan sonra əlaqələr adətən qırılır. TURKIC STUDENTS bundan sonra nə baş verdiyi haqqındadır.'),
  ('waitlist_title', 'az', 'Qeydiyyat açıqdır'),
  ('waitlist_text', 'az', 'Adını və e-poçtunu burax — girişi ilk əldə edənlərdən ol.'),
  ('footer_text', 'az', 'Türk dünyası tələbələrini birləşdirən rəqəmsal platforma: təhsil, festivallar və ortaq layihələr.'),
  ('tvoi_golos_badge', 'az', 'Türküstanda Beynəlxalq Tələbə Teatr Festivalı'),
  ('tvoi_golos_title', 'az', 'SƏNIN SƏSIN — SƏNIN FESTIVALIN'),
  ('tvoi_golos_subtitle', 'az', 'Fikrini bildir. Təklif et. Təsir et.'),
  ('tvoi_golos_text', 'az', 'Festival təkcə tamaşalar və iştirakçılar demək deyil. Tələbələri eşitmək istəyirik: festival haqqında nə düşünürsən, onu gələcəkdə necə görmək istərdin və nəyin dəyişməsi lazımdır. Sənin fikrin növbəti festivalın hissəsinə çevrilə bilər.'),
  ('tvoi_golos_alumni_note', 'az', 'Təşəbbüsə təkcə universitetinizin hazırkı tələbə icması deyil, onun məzunları da qoşula bilər — universitetin şəxsi tarixlərinin bir hissəsi olaraq qaldığı insanlar.'),

  ('cta_label', 'kk', 'Тіркелу'),
  ('hero_title_main', 'kk', 'Түркі елдерінің фестивальдері мен байланыстары — '),
  ('hero_title_accent', 'kk', 'бір жерде'),
  ('hero_subtitle', 'kk', 'Түркі әлемінің фестивальдері мен оқиғалары ондаған сайттар мен чаттарға шашылып жатыр — және қажетті байланыстар солармен бірге жоғалады. TURKIC STUDENTS бәрін бір жерге жинайды. Атыңды және email-іңді қалдыр — іске қосылу туралы бірінші болып білесің.'),
  ('problem_badge', 'kk', 'Қиындық'),
  ('problem_title', 'kk', 'Ақпарат бар, бірақ сен дұрыс жерден іздемей жүрсің'),
  ('problem_text', 'kk', 'Университет жаңалықтары — оның сайтында. Фестиваль — көптен ашпаған чатыңда. Қатысушылардың байланыстары — ондаған түрлі мессенджерде. Бәрін бөлшектеп жинағанша, мерзім өтіп кетеді.'),
  ('problem_source_1', 'kk', 'Университет сайттары'),
  ('problem_source_2', 'kk', 'Университет хабарландырулары'),
  ('problem_source_3', 'kk', 'Жеке фестивальдердің беттері'),
  ('problem_source_4', 'kk', 'Әлеуметтік желідегі анонстар'),
  ('problem_source_5', 'kk', 'Ондаған чаттар мен топтар'),
  ('problem_closing_before', 'kk', 'Ал бұл тек '),
  ('problem_closing_emphasis', 'kk', 'сенің'),
  ('problem_closing_after', 'kk', ' еліңе ғана қатысты! Қалған бесеуі туралы, сірә, тіпті хабарың да жоқ шығар.'),
  ('solution_badge', 'kk', 'Шешім'),
  ('solution_title', 'kk', 'Студенттік шығармашылық бір платформада'),
  ('solution_text', 'kk', 'Ақпарат университеттер мен фестивальдерде қалады — біз оны жай ғана бір жерге жинап, фестивальден кейін де байланыстар жалғасатын ортаға айналдырамыз!'),
  ('solution_benefit_1_title', 'kk', 'Бірыңғай каталог'),
  ('solution_benefit_1_text', 'kk', 'Фестивальдер, іс-шаралар және университет жаңалықтары — бір жерде, дереккөзге сілтемемен.'),
  ('solution_benefit_2_title', 'kk', 'Саған арналған профиль'),
  ('solution_benefit_2_text', 'kk', 'Елді, университетті және қызығушылықтарды көрсет — тек өзіңе сай келетінін көресің.'),
  ('solution_benefit_3_title', 'kk', 'Тек хабарландырулар емес, адамдар'),
  ('solution_benefit_3_text', 'kk', 'Іс-шарадан кейін де пікірлестеріңді тауып, команда жина.'),
  ('cycle_badge', 'kk', 'Жыл бойы'),
  ('cycle_title', 'kk', 'Бір фестиваль келесісіне жетелейді'),
  ('cycle_text', 'kk', 'Фестивальдер арасында тұрақты орта болмаса, әр жолы бәрі нөлден басталады — біз мұны өзгертеміз.'),
  ('cycle_step_1_title', 'kk', 'Фестиваль'),
  ('cycle_step_1_text', 'kk', 'Нақты іс-шарада танысу'),
  ('cycle_step_2_title', 'kk', 'Байланыс'),
  ('cycle_step_2_text', 'kk', 'Үйге қайтқаннан кейін де қарым-қатынас жалғасады'),
  ('cycle_step_3_title', 'kk', 'Қауымдастық'),
  ('cycle_step_3_text', 'kk', 'Түркі әлемінің басқа елдерінен пікірлестеріңді табасың'),
  ('cycle_step_4_title', 'kk', 'Ынтымақтастық'),
  ('cycle_step_4_text', 'kk', 'Идея креативті болса — серіктес табады'),
  ('cycle_step_5_title', 'kk', 'Жаңа жобалар'),
  ('cycle_step_5_text', 'kk', 'Идея командамен бастамаға айналады'),
  ('cycle_step_6_title', 'kk', 'Жаңа фестиваль'),
  ('cycle_step_6_text', 'kk', 'Бүгін — қатысушысың, ал бір жылдан кейін — қызықты жобаның авторы'),
  ('cycle_note', 'kk', 'Әр фестиваль — келесісінің басы.'),
  ('audience_badge', 'kk', 'Кімдерге арналған'),
  ('audience_title', 'kk', 'Фестивальдесің — демек, бұл сен үшін'),
  ('audience_intro', 'kk', 'Мысалы, егер сен:'),
  ('audience_segment_1', 'kk', 'Бұрын фестивальдерде болғансың — және байланыстардың үзілгенін қаламайсың.'),
  ('audience_segment_2', 'kk', 'Осы бақытты кездесулерді тұрақты байланысқа айналдырғың келеді'),
  ('audience_segment_3', 'kk', 'Іс-шаралар ұйымдастырасың немесе жоба жүргізесің — және басқа елдерден серіктес іздейсің.'),
  ('audience_outro', 'kk', 'Кейін университеттер мен ұйымдар да қосылады. Бірақ бәрі сенен басталады.'),
  ('principles_badge', 'kk', 'Принциптер'),
  ('principles_title', 'kk', 'Алты ел, бір түркі әлемі'),
  ('principles_country_1', 'kk', 'Әзербайжан'),
  ('principles_country_2', 'kk', 'Қазақстан'),
  ('principles_country_3', 'kk', 'Қырғызстан'),
  ('principles_country_4', 'kk', 'Түрікменстан'),
  ('principles_country_5', 'kk', 'Түркия'),
  ('principles_country_6', 'kk', 'Өзбекстан'),
  ('principles_item_1_title', 'kk', 'Ашықтық'),
  ('principles_item_1_text', 'kk', 'Университет пен мамандыққа қарамастан түркі әлемінің барлық елдерінің жастарына қолжетімді.'),
  ('principles_item_2_title', 'kk', 'Теңдік'),
  ('principles_item_2_text', 'kk', 'Бірде-бір ел орталық болып табылмайды.'),
  ('principles_item_3_title', 'kk', 'Практикалық пайда'),
  ('principles_item_3_text', 'kk', 'Ынтымақтастық туралы жалпы сөздер емес, нақты іс-шаралар мен байланыстар.'),
  ('principles_item_4_title', 'kk', 'Дұрыстық'),
  ('principles_item_4_text', 'kk', 'Тек тексерілген ақпарат — дереккөзге сілтемесімен.'),
  ('principles_item_5_title', 'kk', 'Ынтымақ'),
  ('principles_item_5_text', 'kk', 'Біз біргеміз: түркі әлемінің студенттері бір-бірін және ортақ жобаларды қолдайды.'),
  ('principles_item_6_title', 'kk', 'Халықаралық сипат'),
  ('principles_item_6_text', 'kk', 'Бірінші күннен бастап алты елдің ортақ кеңістігі, бір елдің жобасы емес.'),
  ('objections_title', 'kk', 'Күмәнданатын болсаң, қысқаша'),
  ('objections_item_1_question', 'kk', 'Платформа әлі жоқ қой — қазір неге тіркелейін?'),
  ('objections_item_1_answer', 'kk', 'Аудитория неғұрлым тез жиналса, платформа соғұрлым тез іске қосылады — ал сен іске қосылу туралы бірінші болып білесің.'),
  ('objections_item_2_question', 'kk', 'Бұл жарты жылдан кейін жабылатын тағы бір портал болмай ма?'),
  ('objections_item_2_answer', 'kk', 'Жоқ — біз дамимыз: платформа қауымдастықпен бірге өседі, әртүрлі елдердің университеттері мен студенттері бізге қосылып жатыр.'),
  ('objections_item_3_question', 'kk', 'Менің деректерім қайда кетеді?'),
  ('objections_item_3_answer', 'kk', 'Аты мен email тек тіркелу және іске қосылу туралы хабарландыру үшін ғана керек — басқа ешнәрсе үшін емес.'),
  ('objections_item_4_question', 'kk', 'Мен фестивальдерді өзім де таба аламын — бұл маған не үшін керек?'),
  ('objections_item_4_answer', 'kk', 'Фестивальден кейін байланыстар әдетте үзіледі. TURKIC STUDENTS — осыдан кейін не болатыны туралы.'),
  ('waitlist_title', 'kk', 'Тіркелу ашық'),
  ('waitlist_text', 'kk', 'Атыңды және email-іңді қалдыр — қолжетімділік алғандардың алғашқыларының қатарына кіресің.'),
  ('footer_text', 'kk', 'Түркі әлемінің студенттерін біріктіретін цифрлық платформа: білім, фестивальдер және бірлескен жобалар.'),
  ('tvoi_golos_badge', 'kk', 'Түркістандағы халықаралық студенттік театр фестивалі'),
  ('tvoi_golos_title', 'kk', 'СЕНІҢ ДАУЫСЫҢ — СЕНІҢ ФЕСТИВАЛІҢ'),
  ('tvoi_golos_subtitle', 'kk', 'Пікіріңді айт. Ұсын. Ықпал ет.'),
  ('tvoi_golos_text', 'kk', 'Фестиваль — бұл тек қойылымдар мен қатысушылар ғана емес. Біз студенттерді естіргіміз келеді: фестиваль туралы не ойлайсың, оны болашақта қалай көргің келеді және нені өзгерту керек. Сенің идеяң келесі фестивальдің бөлігіне айналуы мүмкін.'),
  ('tvoi_golos_alumni_note', 'kk', 'Бастамаға тек университетіңіздің қазіргі студенттік қауымдастығы ғана емес, оның түлектері де қосыла алады — университет олардың жеке тарихының бір бөлігі болып қала беретін адамдар.'),

  ('cta_label', 'ky', 'Каттоо'),
  ('hero_title_main', 'ky', 'Түрк өлкөлөрүнүн фестивалдары жана байланыштары — '),
  ('hero_title_accent', 'ky', 'бир жерде'),
  ('hero_subtitle', 'ky', 'Түрк дүйнөсүнүн фестивалдары жана окуялары ондогон сайттар менен чаттарга чачырап жатат — жана керектүү байланыштар алар менен кошо жоголот. TURKIC STUDENTS баарын бир жерге чогултат. Атыңды жана email''иңди калтыр — иштен баштоо тууралуу биринчилерден бол.'),
  ('problem_badge', 'ky', 'Кыйынчылык'),
  ('problem_title', 'ky', 'Маалымат бар, бирок сен туура жерден издебей жатасың'),
  ('problem_text', 'ky', 'Университеттин жаңылыктары — анын сайтында. Фестиваль — көптөн бери ачпаган чатта. Катышуучулардын байланыштары — ондогон ар кандай мессенджерде. Баарын бөлүп-бөлүп чогулткуча, мөөнөт өтүп кетет.'),
  ('problem_source_1', 'ky', 'Университеттердин сайттары'),
  ('problem_source_2', 'ky', 'Университет жарыялары'),
  ('problem_source_3', 'ky', 'Өзүнчө фестивалдардын беттери'),
  ('problem_source_4', 'ky', 'Социалдык тармактардагы анонстор'),
  ('problem_source_5', 'ky', 'Ондогон чаттар жана топтор'),
  ('problem_closing_before', 'ky', 'Жана бул болгону '),
  ('problem_closing_emphasis', 'ky', 'сенин'),
  ('problem_closing_after', 'ky', ' өлкөңдүн эле иши! Калган бешөө тууралуу, сыягы, кабарың да жок чыгар.'),
  ('solution_badge', 'ky', 'Чечим'),
  ('solution_title', 'ky', 'Студенттик чыгармачылык бир платформада'),
  ('solution_text', 'ky', 'Маалымат университеттерде жана фестивалдарда калат — биз аны жөн гана бир жерге чогултуп, фестивалдан кийин да байланыштар улана турган чөйрөгө айландырабыз!'),
  ('solution_benefit_1_title', 'ky', 'Бирдиктүү каталог'),
  ('solution_benefit_1_text', 'ky', 'Фестивалдар, иш-чаралар жана университет жаңылыктары — бир жерде, булакка шилтеме менен.'),
  ('solution_benefit_2_title', 'ky', 'Сага ылайыкталган профиль'),
  ('solution_benefit_2_text', 'ky', 'Өлкөңдү, университетиңди жана кызыкчылыктарыңды көрсөт — өзүңө ылайыктуусун гана көрөсүң.'),
  ('solution_benefit_3_title', 'ky', 'Жарнамалар гана эмес, адамдар'),
  ('solution_benefit_3_text', 'ky', 'Иш-чарадан кийин да пикирлештериңди тап жана команда чогулт.'),
  ('cycle_badge', 'ky', 'Жыл бою'),
  ('cycle_title', 'ky', 'Бир фестиваль кийинкисине алып барат'),
  ('cycle_text', 'ky', 'Фестивалдардын ортосунда туруктуу чөйрө болбосо, ар жолу баары нөлдөн башталат — биз муну өзгөртөбүз.'),
  ('cycle_step_1_title', 'ky', 'Фестиваль'),
  ('cycle_step_1_text', 'ky', 'Реалдуу иш-чарада таанышуу'),
  ('cycle_step_2_title', 'ky', 'Байланыш'),
  ('cycle_step_2_text', 'ky', 'Үйгө кайткандан кийин да мамиле уланат'),
  ('cycle_step_3_title', 'ky', 'Коомчулук'),
  ('cycle_step_3_text', 'ky', 'Түрк дүйнөсүнүн башка өлкөлөрүнөн пикирлештериңди табасың'),
  ('cycle_step_4_title', 'ky', 'Кызматташтык'),
  ('cycle_step_4_text', 'ky', 'Идея креативдүү болсо — өнөктөштөрдү табат'),
  ('cycle_step_5_title', 'ky', 'Жаңы долбоорлор'),
  ('cycle_step_5_text', 'ky', 'Идея команда менен демилгеге айланат'),
  ('cycle_step_6_title', 'ky', 'Жаңы фестиваль'),
  ('cycle_step_6_text', 'ky', 'Бүгүн — катышуучусуң, ал бир жылдан кийин — кызыктуу долбоордун автору'),
  ('cycle_note', 'ky', 'Ар бир фестиваль — кийинкисинин башталышы.'),
  ('audience_badge', 'ky', 'Кимдер үчүн'),
  ('audience_title', 'ky', 'Фестивалдасың — демек, бул сен үчүн'),
  ('audience_intro', 'ky', 'Мисалы, эгер сен:'),
  ('audience_segment_1', 'ky', 'Мурун фестивалдарда болгонсуң — жана байланыштардын үзүлүшүн каалабайсың.'),
  ('audience_segment_2', 'ky', 'Ушул бактылуу жолугушууларды туруктуу байланышка айландыргың келет'),
  ('audience_segment_3', 'ky', 'Иш-чараларды уюштурасың же долбоор жүргүзөсүң — жана башка өлкөлөрдөн өнөктөш издейсиң.'),
  ('audience_outro', 'ky', 'Кийинчерээк университеттер жана уюмдар да кошулат. Бирок баары сенден башталат.'),
  ('principles_badge', 'ky', 'Принциптер'),
  ('principles_title', 'ky', 'Алты өлкө, бир түрк дүйнөсү'),
  ('principles_country_1', 'ky', 'Азербайжан'),
  ('principles_country_2', 'ky', 'Казакстан'),
  ('principles_country_3', 'ky', 'Кыргызстан'),
  ('principles_country_4', 'ky', 'Түркменстан'),
  ('principles_country_5', 'ky', 'Түркия'),
  ('principles_country_6', 'ky', 'Өзбекстан'),
  ('principles_item_1_title', 'ky', 'Ачыктык'),
  ('principles_item_1_text', 'ky', 'Университет жана адистикке карабастан түрк дүйнөсүнүн бардык өлкөлөрүнүн жаштарына жеткиликтүү.'),
  ('principles_item_2_title', 'ky', 'Теңчилик'),
  ('principles_item_2_text', 'ky', 'Бир дагы өлкө борбордук эмес.'),
  ('principles_item_3_title', 'ky', 'Практикалык пайда'),
  ('principles_item_3_text', 'ky', 'Кызматташтык жөнүндө жалпы сөздөр эмес, так иш-чаралар жана байланыштар.'),
  ('principles_item_4_title', 'ky', 'Ишенимдүүлүк'),
  ('principles_item_4_text', 'ky', 'Текшерилген маалымат гана — булагына шилтемеси менен.'),
  ('principles_item_5_title', 'ky', 'Биримдик'),
  ('principles_item_5_text', 'ky', 'Биз чогубуз: түрк дүйнөсүнүн студенттери бири-бирин жана жалпы долбоорлорду колдойт.'),
  ('principles_item_6_title', 'ky', 'Эл аралыктык'),
  ('principles_item_6_text', 'ky', 'Биринчи күндөн баштап алты өлкөнүн жалпы мейкиндиги, бир өлкөнүн долбоору эмес.'),
  ('objections_title', 'ky', 'Шектенсең, кыскача'),
  ('objections_item_1_question', 'ky', 'Платформа али жок го — эмне үчүн азыр катталайын?'),
  ('objections_item_1_answer', 'ky', 'Аудитория канчалык тез топтолсо, платформа ошончолук тез иштей баштайт — ал эми сен иштен баштоо тууралуу биринчилерден болосуң.'),
  ('objections_item_2_question', 'ky', 'Бул жарым жылдан кийин жабылчу дагы бир портал болбойбу?'),
  ('objections_item_2_answer', 'ky', 'Жок — биз өнүгөбүз: платформа коомчулук менен бирге өсөт, ар кайсы өлкөнүн университеттери жана студенттери бизге кошулууда.'),
  ('objections_item_3_question', 'ky', 'Менин маалыматтарым кайда кетет?'),
  ('objections_item_3_answer', 'ky', 'Аты жана email катталуу жана иштен баштоо тууралуу билдирүү үчүн гана керек — башка эч нерсе үчүн эмес.'),
  ('objections_item_4_question', 'ky', 'Мен фестивалдарды өзүм деле таба алам — бул мага эмне үчүн керек?'),
  ('objections_item_4_answer', 'ky', 'Фестивалдан кийин байланыштар адатта үзүлөт. TURKIC STUDENTS — андан кийин эмне болору тууралуу.'),
  ('waitlist_title', 'ky', 'Каттоо ачык'),
  ('waitlist_text', 'ky', 'Атыңды жана email''иңди калтыр — мүмкүнчүлүк алгандардын биринчилеринин катарына кошуласың.'),
  ('footer_text', 'ky', 'Түрк дүйнөсүнүн студенттерин бириктирген санарип платформа: билим берүү, фестивалдар жана биргелешкен долбоорлор.'),
  ('tvoi_golos_badge', 'ky', 'Түркстандагы Эл аралык студенттик театр фестивалы'),
  ('tvoi_golos_title', 'ky', 'СЕНИН ҮНҮҢ — СЕНИН ФЕСТИВАЛЫҢ'),
  ('tvoi_golos_subtitle', 'ky', 'Пикириңди айт. Сун. Таасир эт.'),
  ('tvoi_golos_text', 'ky', 'Фестиваль — бул жөн гана тасмалар жана катышуучулар эмес. Биз студенттерди угууну каалайбыз: фестиваль тууралуу эмне ойлойсуң, аны келечекте кандай көргүң келет жана эмнени өзгөртүү керек. Сенин идеяң кийинки фестивалдын бир бөлүгүнө айлана алат.'),
  ('tvoi_golos_alumni_note', 'ky', 'Демилгеге сиздин университетиңиздин учурдагы студенттик коомчулугу гана эмес, анын бүтүрүүчүлөрү да кошула алат — университет алардын жеке тарыхынын бир бөлүгү бойдон кала берген адамдар.'),

  ('cta_label', 'tk', 'Bellige al'),
  ('hero_title_main', 'tk', 'Türki ýurtlaryň festiwallary we gatnaşyklary — '),
  ('hero_title_accent', 'tk', 'bir ýerde'),
  ('hero_subtitle', 'tk', 'Türki dünýäniň festiwallary we wakalary onlarça sahypa we çata pytrap gidipdir — we gerekli gatnaşyklar olar bilen ýitýär. TURKIC STUDENTS ählisini bir ýerde jemleýär. Adyňy we e-poçtaňy goý — işe girizilişi barada ilkinjileriň biri bolarsyň.'),
  ('problem_badge', 'tk', 'Kynçylyk'),
  ('problem_title', 'tk', 'Maglumat bar, ýöne sen dogry ýerden gözlemeýärsiň'),
  ('problem_text', 'tk', 'Uniwersitetiň habarlary — onuň saýtynda. Festiwal — köpden bäri açmadyk çatyňda. Gatnaşyjylaryň aragatnaşyklary — onlarça dürli messenjerde. Hemmesini bölek-bölek ýygnaýança, möhlet eýýäm geçip gidýär.'),
  ('problem_source_1', 'tk', 'Uniwersitet saýtlary'),
  ('problem_source_2', 'tk', 'Uniwersitet yglanlary'),
  ('problem_source_3', 'tk', 'Aýry-aýry festiwal sahypalary'),
  ('problem_source_4', 'tk', 'Sosial ulgamlardaky yglanlar'),
  ('problem_source_5', 'tk', 'Onlarça çat we topar'),
  ('problem_closing_before', 'tk', 'We bu diňe '),
  ('problem_closing_emphasis', 'tk', 'seniň'),
  ('problem_closing_after', 'tk', ' ýurduň! Galan bäşisi barada, ähtimal, habaryň hem ýok bolsa gerek.'),
  ('solution_badge', 'tk', 'Çözgüt'),
  ('solution_title', 'tk', 'Talyp döredijiligi bir platformada'),
  ('solution_text', 'tk', 'Maglumat uniwersitetlerde we festiwallarda galýar — biz ony diňe bir ýere ýygnaýarys we festiwaldan soň hem gatnaşyklar dowam edýän gurşawa öwürýäris!'),
  ('solution_benefit_1_title', 'tk', 'Ýeke-täk katalog'),
  ('solution_benefit_1_text', 'tk', 'Festiwallar, çäreler we uniwersitet habarlary — bir ýerde, çeşmä salgy bilen.'),
  ('solution_benefit_2_title', 'tk', 'Saňa görä profil'),
  ('solution_benefit_2_text', 'tk', 'Ýurduňy, uniwersitetiňi we gyzyklanmalaryňy görkez — diňe saňa gabat gelýänini görersiň.'),
  ('solution_benefit_3_title', 'tk', 'Diňe yglanlar däl, adamlar'),
  ('solution_benefit_3_text', 'tk', 'Çäreden soň hem pikirdeşleriňi tap we topar düz.'),
  ('cycle_badge', 'tk', 'Ýyl boýy'),
  ('cycle_title', 'tk', 'Bir festiwal beýlekisine eltýär'),
  ('cycle_text', 'tk', 'Festiwallaryň arasynda durnukly gurşaw bolmasa, hemme zat her gezek täzeden başlaýar — biz muny üýtgedýäris.'),
  ('cycle_step_1_title', 'tk', 'Festiwal'),
  ('cycle_step_1_text', 'tk', 'Hakyky çärede tanyşlyk'),
  ('cycle_step_2_title', 'tk', 'Aragatnaşyk'),
  ('cycle_step_2_text', 'tk', 'Öýe dolanaňdan soň hem gatnaşyk dowam edýär'),
  ('cycle_step_3_title', 'tk', 'Jemgyýet'),
  ('cycle_step_3_text', 'tk', 'Türki dünýäniň beýleki ýurtlaryndan pikirdeşleriňi tapýarsyň'),
  ('cycle_step_4_title', 'tk', 'Hyzmatdaşlyk'),
  ('cycle_step_4_text', 'tk', 'Pikir döredijilikli bolsa — hyzmatdaşlar tapýar'),
  ('cycle_step_5_title', 'tk', 'Täze taslamalar'),
  ('cycle_step_5_text', 'tk', 'Pikir topar bilen başlangyja öwrülýär'),
  ('cycle_step_6_title', 'tk', 'Täze festiwal'),
  ('cycle_step_6_text', 'tk', 'Şu gün gatnaşyjy, bir ýyldan gyzykly taslamanyň awtory'),
  ('cycle_note', 'tk', 'Her festiwal indikisiniň başlangyjy.'),
  ('audience_badge', 'tk', 'Kimler üçin'),
  ('audience_title', 'tk', 'Festiwaldasyň — diýmek, bu seniň üçin'),
  ('audience_intro', 'tk', 'Meselem, eger sen:'),
  ('audience_segment_1', 'tk', 'Festiwallarda bolupsyň — we gatnaşyklaryň üzülmegini islemeýärsiň.'),
  ('audience_segment_2', 'tk', 'Şu bagtly duşuşyklary durnukly gatnaşyklara öwürmek isleýärsiň'),
  ('audience_segment_3', 'tk', 'Çäreleri guraýarsyň ýa-da taslama alyp barýarsyň — we beýleki ýurtlarda hyzmatdaş gözleýärsiň.'),
  ('audience_outro', 'tk', 'Soňra uniwersitetler we guramalar hem goşular. Ýöne hemme zat senden başlanýar.'),
  ('principles_badge', 'tk', 'Ýörelgeler'),
  ('principles_title', 'tk', 'Alty ýurt, bir türki dünýä'),
  ('principles_country_1', 'tk', 'Azerbaýjan'),
  ('principles_country_2', 'tk', 'Gazagystan'),
  ('principles_country_3', 'tk', 'Gyrgyzystan'),
  ('principles_country_4', 'tk', 'Türkmenistan'),
  ('principles_country_5', 'tk', 'Türkiýe'),
  ('principles_country_6', 'tk', 'Özbegistan'),
  ('principles_item_1_title', 'tk', 'Açyklyk'),
  ('principles_item_1_text', 'tk', 'Uniwersitete we hünäre garamazdan türki dünýäniň ähli ýurtlarynyň ýaşlaryna elýeterli.'),
  ('principles_item_2_title', 'tk', 'Deňhukuklylyk'),
  ('principles_item_2_text', 'tk', 'Hiç bir ýurt merkezi däl.'),
  ('principles_item_3_title', 'tk', 'Amaly peýda'),
  ('principles_item_3_text', 'tk', 'Hyzmatdaşlyk barada umumy sözler däl, anyk çäreler we aragatnaşyklar.'),
  ('principles_item_4_title', 'tk', 'Ynamdarlyk'),
  ('principles_item_4_text', 'tk', 'Diňe tassyklanan maglumat — çeşmesine salgylanmasy bilen.'),
  ('principles_item_5_title', 'tk', 'Jebislik'),
  ('principles_item_5_text', 'tk', 'Biz bilelikde: türki dünýäniň talyplary biri-birini we umumy taslamalary goldaýar.'),
  ('principles_item_6_title', 'tk', 'Halkaralylyk'),
  ('principles_item_6_text', 'tk', 'Ilkinji günden alty ýurduň ortak giňişligi, bir ýurduň taslamasy däl.'),
  ('objections_title', 'tk', 'Şübhelenýän bolsaň, gysgaça'),
  ('objections_item_1_question', 'tk', 'Platforma heniz ýok ahyryn — näme üçin häzir bellige alaýyn?'),
  ('objections_item_1_answer', 'tk', 'Auditoriýa näçe tiz ýygnansa, platforma şonça-da tiz işläp başlar — sen bolsa işe girizilişi barada ilkinjileriň biri bolarsyň.'),
  ('objections_item_2_question', 'tk', 'Bu ýarym ýyldan soň ýapyljak ýene bir portal bolmazmy?'),
  ('objections_item_2_answer', 'tk', 'Ýok — biz ösýäris: platforma jemgyýet bilen bilelikde ulalýar, dürli ýurtlaryň uniwersitetleri we talyplary bize goşulýar.'),
  ('objections_item_3_question', 'tk', 'Maglumatlarym nirä gider?'),
  ('objections_item_3_answer', 'tk', 'Ady we e-poçta diňe bellige almak we işe girizilişi barada habar bermek üçin gerek — başga hiç zat üçin däl.'),
  ('objections_item_4_question', 'tk', 'Men festiwallary özüm hem tapyp bilýärin — bu maňa näme üçin gerek?'),
  ('objections_item_4_answer', 'tk', 'Festiwaldan soň gatnaşyklar adatça üzülýär. TURKIC STUDENTS — şondan soň näme bolýandygy barada.'),
  ('waitlist_title', 'tk', 'Bellige almak açyk'),
  ('waitlist_text', 'tk', 'Adyňy we e-poçtaňy goý — girişi gazananlaryň ilkinjileriniň hataryna gir.'),
  ('footer_text', 'tk', 'Türki dünýäniň talyplaryny birleşdirýän sanly platforma: bilim, festiwallar we bilelikdäki taslamalar.'),
  ('tvoi_golos_badge', 'tk', 'Türkistanda Halkara talyp teatr festiwaly'),
  ('tvoi_golos_title', 'tk', 'SENIŇ SESIŇ — SENIŇ FESTIWALYŇ'),
  ('tvoi_golos_subtitle', 'tk', 'Pikiriňi aýt. Teklip et. Täsir et.'),
  ('tvoi_golos_text', 'tk', 'Festiwal diňe tomaşalar we gatnaşyjylar däl. Biz talyplary eşitmek isleýäris: festiwal barada näme pikir edýärsiň, ony geljekde nähili görmek isleýärsiň we näme üýtgemeli. Seniň pikiriň indiki festiwalyň bölegine öwrülip biler.'),
  ('tvoi_golos_alumni_note', 'tk', 'Başlangyja diňe uniwersitetiňiziň häzirki talyp jemgyýeti däl, onuň uçurymlary hem goşulyp biler — uniwersitet olaryň şahsy taryhynyň bir bölegi bolup galýan adamlar.'),

  ('cta_label', 'uz', 'Roʻyxatdan oʻtish'),
  ('hero_title_main', 'uz', 'Turkiy mamlakatlarning festivallari va aloqalari — '),
  ('hero_title_accent', 'uz', 'bir joyda'),
  ('hero_subtitle', 'uz', 'Turkiy dunyoning festivallari va tadbirlari oʻnlab saytlar va chatlarga tarqalib ketgan — va kerakli aloqalar ular bilan birga yoʻqolib ketadi. TURKIC STUDENTS hammasini bir joyga toʻplaydi. Ismingiz va emailingizni qoldiring — ishga tushirilishi haqida birinchilardan boʻlib bilib olasiz.'),
  ('problem_badge', 'uz', 'Qiyinchilik'),
  ('problem_title', 'uz', 'Maʼlumot bor, lekin sen notoʻgʻri joydan qidiryapsan'),
  ('problem_text', 'uz', 'Universitet yangiliklari — uning saytida. Festival — koʻpdan beri ochmagan chatingda. Ishtirokchilarning aloqalari — oʻnlab turli messenjerlarda. Hammasini boʻlak-boʻlak yigʻayotganingda, muddat allaqachon oʻtib ketgan boʻladi.'),
  ('problem_source_1', 'uz', 'Universitet saytlari'),
  ('problem_source_2', 'uz', 'Universitet eʼlonlari'),
  ('problem_source_3', 'uz', 'Alohida festival sahifalari'),
  ('problem_source_4', 'uz', 'Ijtimoiy tarmoqlardagi eʼlonlar'),
  ('problem_source_5', 'uz', 'Oʻnlab chatlar va guruhlar'),
  ('problem_closing_before', 'uz', 'Va bu faqat '),
  ('problem_closing_emphasis', 'uz', 'sening'),
  ('problem_closing_after', 'uz', ' mamlakating! Qolgan beshtasi haqida, ehtimol, xabaring ham yoʻqdir.'),
  ('solution_badge', 'uz', 'Yechim'),
  ('solution_title', 'uz', 'Talabalar ijodi bitta platformada'),
  ('solution_text', 'uz', 'Maʼlumot universitetlarda va festivallarda qoladi — biz uni shunchaki bir joyga toʻplab, festivaldan keyin ham aloqalar davom etadigan muhitga aylantiramiz!'),
  ('solution_benefit_1_title', 'uz', 'Yagona katalog'),
  ('solution_benefit_1_text', 'uz', 'Festivallar, tadbirlar va universitet yangiliklari — bir joyda, manbaga havola bilan.'),
  ('solution_benefit_2_title', 'uz', 'Senga moslashgan profil'),
  ('solution_benefit_2_text', 'uz', 'Mamlakatingni, universitetingni va qiziqishlaringni koʻrsat — faqat senga mos kelganini koʻrasan.'),
  ('solution_benefit_3_title', 'uz', 'Nafaqat eʼlonlar, balki odamlar'),
  ('solution_benefit_3_text', 'uz', 'Tadbirdan keyin ham fikrdoshlaringni top va jamoa toʻpla.'),
  ('cycle_badge', 'uz', 'Yil davomida'),
  ('cycle_title', 'uz', 'Bir festival keyingisiga olib boradi'),
  ('cycle_text', 'uz', 'Festivallar orasida doimiy muhit boʻlmasa, har safar hammasi noldan boshlanadi — biz buni oʻzgartiramiz.'),
  ('cycle_step_1_title', 'uz', 'Festival'),
  ('cycle_step_1_text', 'uz', 'Haqiqiy tadbirda tanishuv'),
  ('cycle_step_2_title', 'uz', 'Aloqa'),
  ('cycle_step_2_text', 'uz', 'Uyga qaytganingdan keyin ham muloqot davom etadi'),
  ('cycle_step_3_title', 'uz', 'Jamoa'),
  ('cycle_step_3_text', 'uz', 'Turkiy dunyoning boshqa mamlakatlaridan fikrdoshlaringni topasan'),
  ('cycle_step_4_title', 'uz', 'Hamkorlik'),
  ('cycle_step_4_text', 'uz', 'Gʻoya ijodiy boʻlsa — hammualliflarni topadi'),
  ('cycle_step_5_title', 'uz', 'Yangi loyihalar'),
  ('cycle_step_5_text', 'uz', 'Gʻoya jamoa bilan tashabbusga aylanadi'),
  ('cycle_step_6_title', 'uz', 'Yangi festival'),
  ('cycle_step_6_text', 'uz', 'Bugun ishtirokchisan, bir yildan keyin qiziqarli loyihaning muallifisan'),
  ('cycle_note', 'uz', 'Har bir festival — keyingisining boshlanishi.'),
  ('audience_badge', 'uz', 'Kimlar uchun'),
  ('audience_title', 'uz', 'Festivaldasan — demak, bu sen uchun'),
  ('audience_intro', 'uz', 'Masalan, agar sen:'),
  ('audience_segment_1', 'uz', 'Festivallarda boʻlgansan — va aloqalar uzilib qolishini xohlamaysan.'),
  ('audience_segment_2', 'uz', 'Bu baxtli uchrashuvlarni doimiy aloqalarga aylantirmoqchisan'),
  ('audience_segment_3', 'uz', 'Tadbirlar tashkil qilasan yoki loyiha yuritasan — va boshqa mamlakatlarda hamkorlar qidirasan.'),
  ('audience_outro', 'uz', 'Keyinroq universitetlar va tashkilotlar ham qoʻshiladi. Ammo hammasi sendan boshlanadi.'),
  ('principles_badge', 'uz', 'Tamoyillar'),
  ('principles_title', 'uz', 'Olti mamlakat, bitta turkiy dunyo'),
  ('principles_country_1', 'uz', 'Ozarbayjon'),
  ('principles_country_2', 'uz', 'Qozogʻiston'),
  ('principles_country_3', 'uz', 'Qirgʻiziston'),
  ('principles_country_4', 'uz', 'Turkmaniston'),
  ('principles_country_5', 'uz', 'Turkiya'),
  ('principles_country_6', 'uz', 'Oʻzbekiston'),
  ('principles_item_1_title', 'uz', 'Ochiqlik'),
  ('principles_item_1_text', 'uz', 'Universitet va mutaxassislikdan qatʼi nazar turkiy dunyoning barcha mamlakatlari yoshlariga ochiq.'),
  ('principles_item_2_title', 'uz', 'Tenglik'),
  ('principles_item_2_text', 'uz', 'Hech bir mamlakat markaziy hisoblanmaydi.'),
  ('principles_item_3_title', 'uz', 'Amaliy foyda'),
  ('principles_item_3_text', 'uz', 'Hamkorlik haqida umumiy soʻzlar emas, aniq tadbirlar va aloqalar.'),
  ('principles_item_4_title', 'uz', 'Ishonchlilik'),
  ('principles_item_4_text', 'uz', 'Faqat tasdiqlangan maʼlumot — manbaga havolasi bilan.'),
  ('principles_item_5_title', 'uz', 'Hamjihatlik'),
  ('principles_item_5_text', 'uz', 'Biz birgamiz: turkiy dunyo talabalari bir-birini va umumiy loyihalarni qoʻllab-quvvatlaydi.'),
  ('principles_item_6_title', 'uz', 'Xalqaroylik'),
  ('principles_item_6_text', 'uz', 'Birinchi kundan olti mamlakatning umumiy maydoni, bitta mamlakat loyihasi emas.'),
  ('objections_title', 'uz', 'Agar shubhalansang, qisqacha'),
  ('objections_item_1_question', 'uz', 'Platforma hali yoʻq-ku — nega hozir roʻyxatdan oʻtay?'),
  ('objections_item_1_answer', 'uz', 'Auditoriya qanchalik tez toʻplansa, platforma shunchalik tez ishga tushadi — sen esa ishga tushirilishi haqida birinchilardan boʻlib bilasan.'),
  ('objections_item_2_question', 'uz', 'Bu olti oydan keyin yopiladigan yana bir portal boʻlmaydimi?'),
  ('objections_item_2_answer', 'uz', 'Yoʻq — biz rivojlanamiz: platforma hamjamiyat bilan birga oʻsadi, turli mamlakatlarning universitetlari va talabalari bizga qoʻshilmoqda.'),
  ('objections_item_3_question', 'uz', 'Mening maʼlumotlarim qayerga ketadi?'),
  ('objections_item_3_answer', 'uz', 'Ism va email faqat roʻyxatdan oʻtish va ishga tushirilishi haqida xabar berish uchun kerak — boshqa hech narsa uchun emas.'),
  ('objections_item_4_question', 'uz', 'Festivallarni oʻzim ham topa olaman — bu menga nima uchun kerak?'),
  ('objections_item_4_answer', 'uz', 'Festivaldan keyin aloqalar odatda uziladi. TURKIC STUDENTS — bundan keyin nima boʻlishi haqida.'),
  ('waitlist_title', 'uz', 'Roʻyxatdan oʻtish ochiq'),
  ('waitlist_text', 'uz', 'Ismingiz va emailingizni qoldiring — kirish huquqini olganlarning birinchilaridan boʻling.'),
  ('footer_text', 'uz', 'Turkiy dunyo talabalarini birlashtiruvchi raqamli platforma: taʼlim, festivallar va qoʻshma loyihalar.'),
  ('tvoi_golos_badge', 'uz', 'Turkistonda Xalqaro talabalar teatr festivali'),
  ('tvoi_golos_title', 'uz', 'SENING OVOZING — SENING FESTIVALING'),
  ('tvoi_golos_subtitle', 'uz', 'Fikringni ayt. Taklif qil. Taʼsir qil.'),
  ('tvoi_golos_text', 'uz', 'Festival faqat tomoshalar va ishtirokchilar emas. Biz talabalarni eshitishni xohlaymiz: festival haqida nima deb oʻylaysan, uni kelajakda qanday koʻrishni xohlaysan va nimani oʻzgartirish kerak. Sening gʻoyang keyingi festivalning bir qismiga aylanishi mumkin.'),
  ('tvoi_golos_alumni_note', 'uz', 'Tashabbusga nafaqat universitetingizning hozirgi talabalar jamoasi, balki uning bitiruvchilari ham qoʻshilishi mumkin — ular uchun universitet shaxsiy tarixlarining bir qismi boʻlib qolaveradi.')
ON CONFLICT (key, locale) DO NOTHING;

-- «ТВОЙ ГОЛОС — ТВОЙ ФЕСТИВАЛЬ»: единая регистрация — те же имя/email из waitlist_signups
-- дополняются ролью, вузом и (опционально) мнением о фестивале. Отдельной таблицы
-- регистраций больше нет: один человек = одна запись = одна цель "узнать о запуске".
DROP TABLE IF EXISTS festival_registrations;

CREATE TABLE IF NOT EXISTS festival_universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS festival_universities_name_country_idx
  ON festival_universities (lower(name), lower(country));

ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'alumnus'));
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS university_id UUID REFERENCES festival_universities(id);
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS opinion_category TEXT CHECK (
  opinion_category IN ('opinion', 'idea', 'proposal', 'viewpoint', 'missing', 'other')
);
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS opinion_text TEXT;

CREATE INDEX IF NOT EXISTS waitlist_signups_university_idx
  ON waitlist_signups (university_id);

-- Тестовый список вузов на старте — полный список клиент пришлёт позже, добавляется
-- через /admin/universities. ON CONFLICT DO NOTHING не трогает то, что уже добавил админ.
INSERT INTO festival_universities (name, country) VALUES
  ('Туркменский государственный университет им. Махтумкули', 'Туркменистан')
ON CONFLICT (lower(name), lower(country)) DO NOTHING;

-- Полный список вузов от клиента (первая партия) — переименование под точную формулировку
-- клиента (сид выше уже заведён под новым именем, этот UPDATE донастраивает БД, где
-- миграция накатывалась раньше и строка ещё под старым именем) + новые вузы фестиваля.
-- NOT EXISTS защищает от конфликта уникального индекса, если строка уже переименована.
UPDATE festival_universities
  SET name = 'Казахско-Турецкий университет им. Ахмет Яссауи'
  WHERE lower(name) = lower('Международный казахско-турецкий университет им. Х.А. Ясави')
    AND country = 'Казахстан'
    AND NOT EXISTS (
      SELECT 1 FROM festival_universities existing
      WHERE lower(existing.name) = lower('Казахско-Турецкий университет им. Ахмет Яссауи')
        AND existing.country = 'Казахстан'
    );

-- Клиент попросил заменить "Ташкентский" на "Узбекистанский" в названии вуза (сид ниже уже
-- заведён под новым именем, этот UPDATE донастраивает БД, где миграция накатывалась раньше
-- и строка ещё под старым именем). NOT EXISTS — как в рененйме выше.
UPDATE festival_universities
  SET name = 'Государственный институт искусств и культуры Узбекистана'
  WHERE lower(name) = lower('Ташкентский государственный институт искусств и культуры')
    AND country = 'Узбекистан'
    AND NOT EXISTS (
      SELECT 1 FROM festival_universities existing
      WHERE lower(existing.name) = lower('Государственный институт искусств и культуры Узбекистана')
        AND existing.country = 'Узбекистан'
    );

-- Заказчик попросил точное официальное название вуза: «Государственный институт искусств и культуры Узбекистана».
-- Переименование идёт до сидирующего INSERT ниже, иначе тот на каждом старте
-- заново заведёт строку под новым именем рядом со старой (NOT EXISTS — на случай,
-- если админ уже завёл вуз под новым именем).
UPDATE festival_universities
  SET name = 'Государственный институт искусств и культуры Узбекистана'
  WHERE lower(name) = lower('Узбекистанский государственный институт искусств и культуры')
    AND country = 'Узбекистан'
    AND NOT EXISTS (
      SELECT 1 FROM festival_universities existing
      WHERE lower(existing.name) = lower('Государственный институт искусств и культуры Узбекистана')
        AND existing.country = 'Узбекистан'
    );

INSERT INTO festival_universities (name, country) VALUES
  ('Азербайджанский государственный университет культуры и искусств', 'Азербайджан'),
  ('Казахский национальный университет искусств им. К. Байсеитовой', 'Казахстан'),
  ('Казахская национальная академия искусств им. Т. Жургенова', 'Казахстан'),
  ('Государственный институт искусств и культуры Узбекистана', 'Узбекистан'),
  ('Кыргызско-Турецкий университет «Манас»', 'Кыргызстан'),
  ('Кыргызский государственный университет искусств и культуры им. Б. Бейшеналиевой', 'Кыргызстан')
ON CONFLICT (lower(name), lower(country)) DO NOTHING;

-- Свободный ввод вуза, когда его нет в festival_universities (см. Select allowCustom
-- в waitlist-form.tsx) — university_id остаётся NULL, название хранится как есть,
-- админ видит его на /admin/universities и при желании заводит вуз в справочник.
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS university_other_name TEXT;

-- Клиент попросил убрать часть тестовых вузов (не по региону/ошибочные) — скрываем через
-- is_active, не удаляем, чтобы не сломать FK у уже сохранённых регистраций.
UPDATE festival_universities SET is_active = false
WHERE (lower(name), lower(country)) IN (
  (lower('Бакинский государственный университет'), lower('Азербайджан')),
  (lower('Евразийский национальный университет им. Л.Н. Гумилева'), lower('Казахстан')),
  (lower('Казахский национальный университет им. аль-Фараби'), lower('Казахстан')),
  (lower('Казахско-Турецкий университет им. Ахмет Яссауи'), lower('Казахстан')),
  (lower('Кыргызский национальный университет им. Ж. Баласагына'), lower('Кыргызстан')),
  (lower('Анкарский университет'), lower('Турция')),
  (lower('Стамбульский университет'), lower('Турция')),
  (lower('Национальный университет Узбекистана'), lower('Узбекистан'))
);

-- Правки лендинга по итогам разговора с заказчиком (вопрос «для чего мы это делаем»,
-- поддержка Кыргызстана, плашка о прошедшем фестивале в хиро). Сид выше не перезаписывает
-- существующие строки (ON CONFLICT DO NOTHING), а миграция гоняется на каждом старте —
-- поэтому перезапись разовая, через маркер, чтобы не затирать последующие правки из админки.
CREATE TABLE IF NOT EXISTS content_patches (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $patch$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_patches WHERE name = '2026-10-client-notes') THEN
    INSERT INTO site_content (key, locale, value) VALUES
    ('objections_item_1_question', 'ru', 'Для чего мы это делаем?'),
    ('objections_item_1_answer', 'ru', 'Сайт превратится в большую платформу для студентов тюркского мира. Следующий фестиваль пройдёт в Кыргызстане — и чтобы помочь ребятам, мы делимся своими идеями.'),
    ('tvoi_golos_subtitle', 'ru', 'Следующий фестиваль — в Кыргызстане. Давайте поддержим ребят!'),
    ('tvoi_golos_text', 'ru', 'Фестиваль — это не только спектакли и участники. Следующий фестиваль пройдёт в Кыргызстане, и чтобы помочь организаторам, мы собираем идеи студентов: что ты думаешь о фестивале, каким хотел бы видеть его в будущем и что стоит изменить. Поддержим кыргызских ребят — поделись своей идеей.'),
    ('hero_festival_title', 'ru', 'IV студенческий фестиваль в Туркестане'),
    ('hero_festival_dates', 'ru', 'Прошёл 5–9'),
    ('objections_item_1_question', 'az', 'Bunu nə üçün edirik?'),
    ('objections_item_1_answer', 'az', 'Sayt türk dünyası tələbələri üçün böyük platformaya çevriləcək. Növbəti festival Qırğızıstanda keçiriləcək — dostlarımıza kömək etmək üçün fikirlərimizi bölüşürük.'),
    ('tvoi_golos_subtitle', 'az', 'Növbəti festival Qırğızıstanda. Gəlin dostlarımızı dəstəkləyək!'),
    ('tvoi_golos_text', 'az', 'Festival təkcə tamaşalar və iştirakçılar demək deyil. Növbəti festival Qırğızıstanda keçiriləcək və təşkilatçılara kömək etmək üçün tələbələrin fikirlərini toplayırıq: festival haqqında nə düşünürsən, gələcəkdə onu necə görmək istərdin və nəyi dəyişmək lazımdır. Qırğız dostlarımızı dəstəkləyək — fikrini bölüş.'),
    ('hero_festival_title', 'az', 'Türküstanda IV tələbə festivalı'),
    ('hero_festival_dates', 'az', '5–9 tarixlərində keçirilib'),
    ('objections_item_1_question', 'kk', 'Біз мұны не үшін жасаймыз?'),
    ('objections_item_1_answer', 'kk', 'Сайт түркі әлемі студенттері үшін үлкен платформаға айналады. Келесі фестиваль Қырғызстанда өтеді — жігіттерге көмектесу үшін біз өз идеяларымызбен бөлісеміз.'),
    ('tvoi_golos_subtitle', 'kk', 'Келесі фестиваль — Қырғызстанда. Жігіттерді қолдайық!'),
    ('tvoi_golos_text', 'kk', 'Фестиваль — бұл тек қойылымдар мен қатысушылар ғана емес. Келесі фестиваль Қырғызстанда өтеді, ұйымдастырушыларға көмектесу үшін біз студенттердің идеяларын жинаймыз: фестиваль туралы не ойлайсың, оны болашақта қалай көргің келеді және нені өзгерту керек. Қырғыз жігіттерін қолдайық — өз идеяңмен бөліс.'),
    ('hero_festival_title', 'kk', 'Түркістандағы IV студенттік фестиваль'),
    ('hero_festival_dates', 'kk', '5–9 күндері өтті'),
    ('objections_item_1_question', 'ky', 'Муну эмне үчүн кылабыз?'),
    ('objections_item_1_answer', 'ky', 'Сайт түрк дүйнөсүнүн студенттери үчүн чоң платформага айланат. Кийинки фестиваль Кыргызстанда өтөт — балдарга жардам берүү үчүн өз идеяларыбыз менен бөлүшөбүз.'),
    ('tvoi_golos_subtitle', 'ky', 'Кийинки фестиваль — Кыргызстанда. Балдарды колдойлу!'),
    ('tvoi_golos_text', 'ky', 'Фестиваль — бул жөн гана спектаклдер жана катышуучулар эмес. Кийинки фестиваль Кыргызстанда өтөт, уюштуруучуларга жардам берүү үчүн студенттердин идеяларын чогултабыз: фестиваль тууралуу эмне ойлойсуң, келечекте аны кандай көргүң келет жана эмнени өзгөртүү керек. Кыргыз балдарын колдойлу — өз идеяң менен бөлүш.'),
    ('hero_festival_title', 'ky', 'Түркстандагы IV студенттик фестиваль'),
    ('hero_festival_dates', 'ky', '5–9 күндөрү өттү'),
    ('objections_item_1_question', 'tk', 'Muny näme üçin edýäris?'),
    ('objections_item_1_answer', 'tk', 'Sahypa türki dünýäsiniň talyplary üçin uly platforma öwrüler. Indiki festiwal Gyrgyzystanda geçiriler — ýigitlere kömek etmek üçin pikirlerimiz bilen paýlaşýarys.'),
    ('tvoi_golos_subtitle', 'tk', 'Indiki festiwal — Gyrgyzystanda. Ýigitleri goldalyň!'),
    ('tvoi_golos_text', 'tk', 'Festiwal diňe tomaşalar we gatnaşyjylar däl. Indiki festiwal Gyrgyzystanda geçiriler we guramaçylara kömek etmek üçin talyplaryň pikirlerini ýygnaýarys: festiwal barada näme pikir edýärsiň, ony geljekde nähili görmek isleýärsiň we näme üýtgetmeli. Gyrgyz ýigitlerini goldalyň — öz pikiriň bilen paýlaş.'),
    ('hero_festival_title', 'tk', 'Türkistanda IV talyp festiwaly'),
    ('hero_festival_dates', 'tk', '5–9 aralygynda geçirildi'),
    ('objections_item_1_question', 'tr', 'Bunu ne için yapıyoruz?'),
    ('objections_item_1_answer', 'tr', 'Bu site Türk dünyası öğrencileri için büyük bir platforma dönüşecek. Bir sonraki festival Kırgızistan’da yapılacak — arkadaşlara yardımcı olmak için fikirlerimizi paylaşıyoruz.'),
    ('tvoi_golos_subtitle', 'tr', 'Bir sonraki festival Kırgızistan’da. Arkadaşlarımızı destekleyelim!'),
    ('tvoi_golos_text', 'tr', 'Festival sadece gösteriler ve katılımcılardan ibaret değil. Bir sonraki festival Kırgızistan’da yapılacak ve organizatörlere yardımcı olmak için öğrencilerin fikirlerini topluyoruz: festival hakkında ne düşünüyorsun, gelecekte onu nasıl görmek istersin ve neyi değiştirmeli. Kırgız arkadaşlarımızı destekleyelim — fikrini paylaş.'),
    ('hero_festival_title', 'tr', 'Türkistan’da IV. Öğrenci Festivali'),
    ('hero_festival_dates', 'tr', '5–9 tarihlerinde gerçekleşti'),
    ('objections_item_1_question', 'uz', 'Buni nima uchun qilamiz?'),
    ('objections_item_1_answer', 'uz', 'Sayt turkiy dunyo talabalari uchun katta platformaga aylanadi. Keyingi festival Qirgʻizistonda oʻtadi — yigitlarga yordam berish uchun gʻoyalarimiz bilan boʻlishamiz.'),
    ('tvoi_golos_subtitle', 'uz', 'Keyingi festival — Qirgʻizistonda. Yigitlarni qoʻllab-quvvatlaylik!'),
    ('tvoi_golos_text', 'uz', 'Festival faqat tomoshalar va ishtirokchilar emas. Keyingi festival Qirgʻizistonda oʻtadi va tashkilotchilarga yordam berish uchun talabalarning gʻoyalarini yigʻamiz: festival haqida nima deb oʻylaysan, kelajakda uni qanday koʻrishni xohlaysan va nimani oʻzgartirish kerak. Qirgʻiz yigitlarini qoʻllab-quvvatlaylik — gʻoyangni ayt.'),
    ('hero_festival_title', 'uz', 'Turkistonda IV talabalar festivali'),
    ('hero_festival_dates', 'uz', '5–9 kunlari oʻtkazildi')
    ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
    INSERT INTO content_patches (name) VALUES ('2026-10-client-notes');
  END IF;
END
$patch$;

-- Заказчик уточнил даты фестиваля: ноябрь 2026. Меняем только если значение всё ещё равно
-- тексту первого патча, чтобы не затереть правку из админки.
DO $patch$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_patches WHERE name = '2026-10-festival-dates') THEN
    UPDATE site_content sc SET value = v.new_value
    FROM (VALUES
      ('ru', 'Прошёл 5–9', 'Прошёл 5–9 ноября 2026'),
      ('az', '5–9 tarixlərində keçirilib', '2026-cı il noyabrın 5–9-da keçirilib'),
      ('kk', '5–9 күндері өтті', '2026 жылғы 5–9 қарашада өтті'),
      ('ky', '5–9 күндөрү өттү', '2026-жылдын 5–9-ноябрында өттү'),
      ('tk', '5–9 aralygynda geçirildi', '2026-njy ýylyň 5–9-njy noýabrynda geçirildi'),
      ('tr', '5–9 tarihlerinde gerçekleşti', '5–9 Kasım 2026 tarihlerinde gerçekleşti'),
      ('uz', '5–9 kunlari oʻtkazildi', '2026-yil 5–9-noyabrda oʻtkazildi')
    ) AS v(locale, old_value, new_value)
    WHERE sc.key = 'hero_festival_dates' AND sc.locale = v.locale AND sc.value = v.old_value;
    INSERT INTO content_patches (name) VALUES ('2026-10-festival-dates');
  END IF;
END
$patch$;

-- Фестиваль пройдёт 5–9 ноября 2026 в Кыргызстане (а не в Туркестане): плашка в хиро и
-- бейдж секции фестиваля. Меняем только строки, которые всё ещё равны прежнему тексту,
-- чтобы не затереть правки из админки.
DO $patch$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_patches WHERE name = '2026-10-kyrgyzstan') THEN
    UPDATE site_content sc SET value = v.new_value
    FROM (VALUES
      ('hero_festival_title', 'ru', 'IV студенческий фестиваль в Туркестане', 'Международный студенческий фестиваль в Кыргызстане'),
      ('hero_festival_dates', 'ru', 'Прошёл 5–9 ноября 2026', 'Пройдёт 5–9 ноября 2026'),
      ('tvoi_golos_badge', 'ru', 'Международный студенческий театральный фестиваль в Туркестане', 'Международный студенческий театральный фестиваль в Кыргызстане'),
      ('hero_festival_title', 'az', 'Türküstanda IV tələbə festivalı', 'Qırğızıstanda Beynəlxalq Tələbə Festivalı'),
      ('hero_festival_dates', 'az', '2026-cı il noyabrın 5–9-da keçirilib', '2026-cı il noyabrın 5–9-da keçiriləcək'),
      ('tvoi_golos_badge', 'az', 'Türküstanda Beynəlxalq Tələbə Teatr Festivalı', 'Qırğızıstanda Beynəlxalq Tələbə Teatr Festivalı'),
      ('hero_festival_title', 'kk', 'Түркістандағы IV студенттік фестиваль', 'Қырғызстандағы халықаралық студенттік фестиваль'),
      ('hero_festival_dates', 'kk', '2026 жылғы 5–9 қарашада өтті', '2026 жылғы 5–9 қарашада өтеді'),
      ('tvoi_golos_badge', 'kk', 'Түркістандағы халықаралық студенттік театр фестивалі', 'Қырғызстандағы халықаралық студенттік театр фестивалі'),
      ('hero_festival_title', 'ky', 'Түркстандагы IV студенттик фестиваль', 'Кыргызстандагы эл аралык студенттик фестиваль'),
      ('hero_festival_dates', 'ky', '2026-жылдын 5–9-ноябрында өттү', '2026-жылдын 5–9-ноябрында өтөт'),
      ('tvoi_golos_badge', 'ky', 'Түркстандагы Эл аралык студенттик театр фестивалы', 'Кыргызстандагы Эл аралык студенттик театр фестивалы'),
      ('hero_festival_title', 'tk', 'Türkistanda IV talyp festiwaly', 'Gyrgyzystanda halkara talyp festiwaly'),
      ('hero_festival_dates', 'tk', '2026-njy ýylyň 5–9-njy noýabrynda geçirildi', '2026-njy ýylyň 5–9-njy noýabrynda geçiriler'),
      ('tvoi_golos_badge', 'tk', 'Türkistanda Halkara talyp teatr festiwaly', 'Gyrgyzystanda Halkara talyp teatr festiwaly'),
      ('hero_festival_title', 'tr', 'Türkistan’da IV. Öğrenci Festivali', 'Kırgızistan’da Uluslararası Öğrenci Festivali'),
      ('hero_festival_dates', 'tr', '5–9 Kasım 2026 tarihlerinde gerçekleşti', '5–9 Kasım 2026 tarihlerinde gerçekleşecek'),
      ('tvoi_golos_badge', 'tr', 'Türkistan''da Uluslararası Öğrenci Tiyatro Festivali', 'Kırgızistan’da Uluslararası Öğrenci Tiyatro Festivali'),
      ('hero_festival_title', 'uz', 'Turkistonda IV talabalar festivali', 'Qirgʻizistonda xalqaro talabalar festivali'),
      ('hero_festival_dates', 'uz', '2026-yil 5–9-noyabrda oʻtkazildi', '2026-yil 5–9-noyabrda oʻtkaziladi'),
      ('tvoi_golos_badge', 'uz', 'Turkistonda Xalqaro talabalar teatr festivali', 'Qirgʻizistonda Xalqaro talabalar teatr festivali')
    ) AS v(key, locale, old_value, new_value)
    WHERE sc.key = v.key AND sc.locale = v.locale AND sc.value = v.old_value;
    INSERT INTO content_patches (name) VALUES ('2026-10-kyrgyzstan');
  END IF;
END
$patch$;

-- Название проекта «TURKIC STUDENTS» вместо «TÜRKSOY STUDENTS» во всех сохранённых текстах и удаление
-- плашки с упоминанием организации из хиро. Разово (маркер), чтобы не затирать правки из админки.
DO $patch$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_patches WHERE name = '2026-10-turkic-students-name') THEN
    UPDATE site_content
      SET value = replace(replace(value, 'TÜRKSOY STUDENTS', 'TURKIC STUDENTS'), 'TÜRKSOY Students', 'Turkic Students')
      WHERE value LIKE '%TÜRKSOY STUDENTS%' OR value LIKE '%TÜRKSOY Students%';
    DELETE FROM site_content WHERE key = 'hero_badge';
    INSERT INTO content_patches (name) VALUES ('2026-10-turkic-students-name');
  END IF;
END
$patch$;

-- Третья волна правок текстов: без «стажировок» и «обменов», без упоминания ТЮРКСОЙ, «Солидарность» вместо «Нейтральности», новый ответ про развитие.
-- Меняем только строки, всё ещё равные прежнему тексту сида, — правки из админки не затираются.
DO $patch$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_patches WHERE name = '2026-10-wave3-texts') THEN
    UPDATE site_content sc SET value = v.new_value
    FROM (VALUES
      ('problem_text', 'ru', 'Обмен — на сайте вуза. Фестиваль — в Telegram-канале. Стажировка — в чате, который ты давно не открывал. Пока собираешь всё по кусочкам, дедлайн уже прошёл.', 'Новости вуза — на его сайте. Фестиваль — в чате, который ты давно не открывал. Контакты участников — в десятке разных мессенджеров. Пока собираешь всё по кусочкам, дедлайн уже прошёл.'),
      ('problem_text', 'tr', 'Değişim programı — üniversitenin sitesinde. Festival — Telegram kanalında. Staj — uzun zamandır açmadığın bir sohbette. Her şeyi parça parça toplarken son tarih çoktan geçmiş oluyor.', 'Üniversite haberleri — kendi sitesinde. Festival — uzun zamandır açmadığın bir sohbette. Katılımcıların iletişim bilgileri — bir düzine farklı mesajlaşma uygulamasında. Her şeyi parça parça toplarken son tarih çoktan geçmiş oluyor.'),
      ('problem_text', 'az', 'Mübadilə — universitetin saytında. Festival — Telegram kanalında. Təcrübə — uzun müddətdir açmadığın çatda. Hər şeyi hissə-hissə topladığın müddətdə son tarix artıq keçib.', 'Universitet xəbərləri — onun saytında. Festival — çoxdan açmadığın çatda. İştirakçıların əlaqələri — onlarla müxtəlif mesencerdə. Hər şeyi hissə-hissə topladığın müddətdə son tarix artıq keçib.'),
      ('problem_text', 'kk', 'Алмасу — университет сайтында. Фестиваль — Telegram-арнасында. Тағылымдама — сен көптен ашпаған чатта. Бәрін бөлшектеп жинап жатқанда, мерзім қазірдің өзінде өтіп кеткен.', 'Университет жаңалықтары — оның сайтында. Фестиваль — көптен ашпаған чатыңда. Қатысушылардың байланыстары — ондаған түрлі мессенджерде. Бәрін бөлшектеп жинағанша, мерзім өтіп кетеді.'),
      ('problem_text', 'ky', 'Алмашуу — университеттин сайтында. Фестиваль — Telegram-каналында. Стажировка — сен көптөн бери ачпаган чатта. Баарын бөлүп-бөлүп чогулткуча, мөөнөт өтүп кеткен.', 'Университеттин жаңылыктары — анын сайтында. Фестиваль — көптөн бери ачпаган чатта. Катышуучулардын байланыштары — ондогон ар кандай мессенджерде. Баарын бөлүп-бөлүп чогулткуча, мөөнөт өтүп кетет.'),
      ('problem_text', 'tk', 'Alyş-çalyş — uniwersitetiň saýtynda. Festiwal — Telegram-kanalynda. Amaliýat — köpden bäri açmadyk çatyňda. Ählisini bölek-bölek ýygnaýan wagtyň möhlet eýýäm geçip gidýär.', 'Uniwersitetiň habarlary — onuň saýtynda. Festiwal — köpden bäri açmadyk çatyňda. Gatnaşyjylaryň aragatnaşyklary — onlarça dürli messenjerde. Hemmesini bölek-bölek ýygnaýança, möhlet eýýäm geçip gidýär.'),
      ('problem_text', 'uz', 'Almashinuv — universitet saytida. Festival — Telegram kanalida. Amaliyot — koʻpdan beri ochmagan chatingda. Hammasini boʻlak-boʻlak yigʻayotganingda, muddat allaqachon oʻtib ketgan boʻladi.', 'Universitet yangiliklari — uning saytida. Festival — koʻpdan beri ochmagan chatingda. Ishtirokchilarning aloqalari — oʻnlab turli messenjerlarda. Hammasini boʻlak-boʻlak yigʻayotganingda, muddat allaqachon oʻtib ketgan boʻladi.'),
      ('problem_source_2', 'ru', 'Программы обмена', 'Объявления вузов'),
      ('problem_source_2', 'tr', 'Değişim programları', 'Üniversite duyuruları'),
      ('problem_source_2', 'az', 'Mübadilə proqramları', 'Universitet elanları'),
      ('problem_source_2', 'kk', 'Алмасу бағдарламалары', 'Университет хабарландырулары'),
      ('problem_source_2', 'ky', 'Алмашуу программалары', 'Университет жарыялары'),
      ('problem_source_2', 'tk', 'Alyş-çalyş programmalary', 'Uniwersitet yglanlary'),
      ('problem_source_2', 'uz', 'Almashinuv dasturlari', 'Universitet eʼlonlari'),
      ('problem_source_4', 'ru', 'Каналы со стажировками', 'Анонсы в соцсетях'),
      ('problem_source_4', 'tr', 'Staj kanalları', 'Sosyal medya duyuruları'),
      ('problem_source_4', 'az', 'Təcrübə kanalları', 'Sosial şəbəkə elanları'),
      ('problem_source_4', 'kk', 'Тағылымдамасы бар арналар', 'Әлеуметтік желідегі анонстар'),
      ('problem_source_4', 'ky', 'Стажировкасы бар каналдар', 'Социалдык тармактардагы анонстор'),
      ('problem_source_4', 'tk', 'Amaliýatly kanallar', 'Sosial ulgamlardaky yglanlar'),
      ('problem_source_4', 'uz', 'Amaliyotli kanallar', 'Ijtimoiy tarmoqlardagi eʼlonlar'),
      ('solution_text', 'ru', 'Информация остаётся у вузов, фестивалей и программ — мы просто собираем её в одном месте и превращаем в среду, где связи продолжаются и после фестиваля!', 'Информация остаётся у вузов и фестивалей — мы просто собираем её в одном месте и превращаем в среду, где связи продолжаются и после фестиваля!'),
      ('solution_text', 'tr', 'Bilgi üniversitelerde, festivallerde ve programlarda kalıyor — biz onu sadece tek bir yerde topluyor ve festivalden sonra da bağlantıların devam ettiği bir ortama dönüştürüyoruz!', 'Bilgi üniversitelerde ve festivallerde kalıyor — biz onu sadece tek yerde topluyor ve bağlantıların festivalden sonra da sürdüğü bir ortama dönüştürüyoruz!'),
      ('solution_text', 'az', 'Məlumat universitetlərdə, festivallarda və proqramlarda qalır — biz onu sadəcə bir yerə toplayır və festivaldan sonra da əlaqələrin davam etdiyi mühitə çeviririk!', 'Məlumat universitetlərdə və festivallarda qalır — biz onu sadəcə bir yerə toplayır və festivaldan sonra da əlaqələrin davam etdiyi mühitə çeviririk!'),
      ('solution_text', 'kk', 'Ақпарат университеттерде, фестивальдерде және бағдарламаларда қалады — біз оны жай ғана бір жерге жинап, фестивальден кейін де байланыстар жалғасатын ортаға айналдырамыз!', 'Ақпарат университеттер мен фестивальдерде қалады — біз оны жай ғана бір жерге жинап, фестивальден кейін де байланыстар жалғасатын ортаға айналдырамыз!'),
      ('solution_text', 'ky', 'Маалымат университеттерде, фестивалдарда жана программаларда калат — биз аны жөн эле бир жерге чогултуп, фестивалдан кийин да байланыштар уланган чөйрөгө айландырабыз!', 'Маалымат университеттерде жана фестивалдарда калат — биз аны жөн гана бир жерге чогултуп, фестивалдан кийин да байланыштар улана турган чөйрөгө айландырабыз!'),
      ('solution_text', 'tk', 'Maglumat uniwersitetlerde, festiwallarda we programmalarda galýar — biz ony diňe bir ýerde jemläp, festiwaldan soň hem gatnaşyklaryň dowam edýän gurşawyna öwürýäris!', 'Maglumat uniwersitetlerde we festiwallarda galýar — biz ony diňe bir ýere ýygnaýarys we festiwaldan soň hem gatnaşyklar dowam edýän gurşawa öwürýäris!'),
      ('solution_text', 'uz', 'Maʼlumot universitetlarda, festivallarda va dasturlarda qoladi — biz uni shunchaki bir joyga toʻplab, festivaldan keyin ham aloqalar davom etadigan muhitga aylantiramiz!', 'Maʼlumot universitetlarda va festivallarda qoladi — biz uni shunchaki bir joyga toʻplab, festivaldan keyin ham aloqalar davom etadigan muhitga aylantiramiz!'),
      ('solution_benefit_1_text', 'ru', 'Обмены, фестивали и стажировки — в одном месте, со ссылкой на источник.', 'Фестивали, события и новости вузов — в одном месте, со ссылкой на источник.'),
      ('solution_benefit_1_text', 'tr', 'Değişimler, festivaller ve stajlar — kaynağa bağlantısıyla birlikte tek bir yerde.', 'Festivaller, etkinlikler ve üniversite haberleri — tek yerde, kaynak bağlantısıyla.'),
      ('solution_benefit_1_text', 'az', 'Mübadilələr, festivallar və təcrübələr — mənbəyə keçidlə birlikdə bir yerdə.', 'Festivallar, tədbirlər və universitet xəbərləri — bir yerdə, mənbəyə keçidlə.'),
      ('solution_benefit_1_text', 'kk', 'Алмасулар, фестивальдер және тағылымдамалар — дереккөзге сілтемесімен бір жерде.', 'Фестивальдер, іс-шаралар және университет жаңалықтары — бір жерде, дереккөзге сілтемемен.'),
      ('solution_benefit_1_text', 'ky', 'Алмашуулар, фестивалдар жана стажировкалар — булагына шилтемеси менен бир жерде.', 'Фестивалдар, иш-чаралар жана университет жаңылыктары — бир жерде, булакка шилтеме менен.'),
      ('solution_benefit_1_text', 'tk', 'Alyş-çalyşlar, festiwallar we amaliýatlar — çeşmesine salgylanmasy bilen bir ýerde.', 'Festiwallar, çäreler we uniwersitet habarlary — bir ýerde, çeşmä salgy bilen.'),
      ('solution_benefit_1_text', 'uz', 'Almashinuvlar, festivallar va amaliyotlar — manbaga havolasi bilan bir joyda.', 'Festivallar, tadbirlar va universitet yangiliklari — bir joyda, manbaga havola bilan.'),
      ('audience_segment_1', 'ru', 'Уже был на фестивалях или обменах — и не хочешь, чтобы связи обрывались.', 'Уже был на фестивалях — и не хочешь, чтобы связи обрывались.'),
      ('audience_segment_1', 'tr', 'Daha önce festivallerde veya değişim programlarında bulundun — ve bağlantıların kopmasını istemiyorsun.', 'Daha önce festivallere katıldın — ve bağlantıların kopmasını istemiyorsun.'),
      ('audience_segment_1', 'az', 'Artıq festivallarda və ya mübadilələrdə olmusan — və əlaqələrin qırılmasını istəmirsən.', 'Artıq festivallarda olmusan — və əlaqələrin qırılmasını istəmirsən.'),
      ('audience_segment_1', 'kk', 'Фестивальдерде немесе алмасуларда болғансың — және байланыстардың үзілгенін қаламайсың.', 'Бұрын фестивальдерде болғансың — және байланыстардың үзілгенін қаламайсың.'),
      ('audience_segment_1', 'ky', 'Мурда фестивалдарда же алмашууларда болгонсуң — жана байланыштардын үзүлүшүн каалабайсың.', 'Мурун фестивалдарда болгонсуң — жана байланыштардын үзүлүшүн каалабайсың.'),
      ('audience_segment_1', 'tk', 'Eýýäm festiwallarda ýa-da alyş-çalyşlarda bolduň — we gatnaşyklaryň üzülmegini islemeýärsiň.', 'Festiwallarda bolupsyň — we gatnaşyklaryň üzülmegini islemeýärsiň.'),
      ('audience_segment_1', 'uz', 'Allaqachon festivallarda yoki almashinuvlarda boʻlgansan — va aloqalarning uzilishini xohlamaysan.', 'Festivallarda boʻlgansan — va aloqalar uzilib qolishini xohlamaysan.'),
      ('principles_item_3_text', 'ru', 'Не общие слова про сотрудничество, а конкретные программы и контакты.', 'Не общие слова про сотрудничество, а конкретные события и контакты.'),
      ('principles_item_3_text', 'tr', 'İşbirliği hakkında genel sözler değil, somut programlar ve bağlantılar.', 'Genel işbirliği sözleri değil, somut etkinlikler ve iletişim bilgileri.'),
      ('principles_item_3_text', 'az', 'Əməkdaşlıq haqqında ümumi sözlər deyil, konkret proqramlar və əlaqələr.', 'Əməkdaşlıq haqqında ümumi sözlər deyil, konkret tədbirlər və əlaqələr.'),
      ('principles_item_3_text', 'kk', 'Ынтымақтастық туралы жалпы сөздер емес, нақты бағдарламалар мен байланыстар.', 'Ынтымақтастық туралы жалпы сөздер емес, нақты іс-шаралар мен байланыстар.'),
      ('principles_item_3_text', 'ky', 'Кызматташтык тууралуу жалпы сөздөр эмес, конкреттүү программалар жана байланыштар.', 'Кызматташтык жөнүндө жалпы сөздөр эмес, так иш-чаралар жана байланыштар.'),
      ('principles_item_3_text', 'tk', 'Hyzmatdaşlyk barada umumy sözler däl, anyk programmalar we aragatnaşyklar.', 'Hyzmatdaşlyk barada umumy sözler däl, anyk çäreler we aragatnaşyklar.'),
      ('principles_item_3_text', 'uz', 'Hamkorlik haqida umumiy soʻzlar emas, aniq dasturlar va aloqalar.', 'Hamkorlik haqida umumiy soʻzlar emas, aniq tadbirlar va aloqalar.'),
      ('principles_item_5_title', 'ru', 'Нейтральность', 'Солидарность'),
      ('principles_item_5_title', 'tr', 'Tarafsızlık', 'Dayanışma'),
      ('principles_item_5_title', 'az', 'Neytrallıq', 'Həmrəylik'),
      ('principles_item_5_title', 'kk', 'Бейтараптылық', 'Ынтымақ'),
      ('principles_item_5_title', 'ky', 'Бейтараптык', 'Биримдик'),
      ('principles_item_5_title', 'tk', 'Bitaraplyk', 'Jebislik'),
      ('principles_item_5_title', 'uz', 'Betaraflik', 'Hamjihatlik'),
      ('principles_item_5_text', 'ru', 'Пространство сотрудничества, а не политической конкуренции.', 'Мы вместе: студенты тюркского мира поддерживают друг друга и общие проекты.'),
      ('principles_item_5_text', 'tr', 'Siyasi rekabetin değil, işbirliğinin alanı.', 'Birlikteyiz: Türk dünyasının öğrencileri birbirini ve ortak projeleri destekler.'),
      ('principles_item_5_text', 'az', 'Siyasi rəqabətin deyil, əməkdaşlığın məkanı.', 'Birlikdəyik: türk dünyası tələbələri bir-birini və ortaq layihələri dəstəkləyir.'),
      ('principles_item_5_text', 'kk', 'Саяси бәсекелестіктің емес, ынтымақтастықтың кеңістігі.', 'Біз біргеміз: түркі әлемінің студенттері бір-бірін және ортақ жобаларды қолдайды.'),
      ('principles_item_5_text', 'ky', 'Саясий атаандаштыктын эмес, кызматташтыктын мейкиндиги.', 'Биз чогубуз: түрк дүйнөсүнүн студенттери бири-бирин жана жалпы долбоорлорду колдойт.'),
      ('principles_item_5_text', 'tk', 'Syýasy bäsleşigiň däl, hyzmatdaşlygyň giňişligi.', 'Biz bilelikde: türki dünýäniň talyplary biri-birini we umumy taslamalary goldaýar.'),
      ('principles_item_5_text', 'uz', 'Siyosiy raqobatning emas, hamkorlikning maydoni.', 'Biz birgamiz: turkiy dunyo talabalari bir-birini va umumiy loyihalarni qoʻllab-quvvatlaydi.'),
      ('objections_item_2_answer', 'ru', 'Платформа создаётся при поддержке ТЮРКСОЙ — сразу, как система всех тюркских стран.', 'Нет — мы будем развиваться: платформа растёт вместе с сообществом, к нам присоединяются вузы и студенты из разных стран.'),
      ('objections_item_2_answer', 'tr', 'Platform TÜRKSOY desteğiyle oluşturuluyor — baştan itibaren tüm Türk ülkelerinin sistemi olarak.', 'Hayır — gelişmeye devam edeceğiz: platform topluluğuyla birlikte büyüyor, farklı ülkelerin üniversiteleri ve öğrencileri bize katılıyor.'),
      ('objections_item_2_answer', 'az', 'Platforma TÜRKSOY-un dəstəyi ilə yaradılır — dərhal bütün türk ölkələrinin sistemi kimi.', 'Xeyr — inkişaf edəcəyik: platforma icma ilə birlikdə böyüyür, müxtəlif ölkələrin universitetləri və tələbələri bizə qoşulur.'),
      ('objections_item_2_answer', 'kk', 'Платформа ТҮРКСОЙ қолдауымен жасалады — бірден барлық түркі елдерінің жүйесі ретінде.', 'Жоқ — біз дамимыз: платформа қауымдастықпен бірге өседі, әртүрлі елдердің университеттері мен студенттері бізге қосылып жатыр.'),
      ('objections_item_2_answer', 'ky', 'Платформа ТҮРКСОЙдун колдоосу менен түзүлүүдө — башынан эле бардык түрк өлкөлөрүнүн системасы катары.', 'Жок — биз өнүгөбүз: платформа коомчулук менен бирге өсөт, ар кайсы өлкөнүн университеттери жана студенттери бизге кошулууда.'),
      ('objections_item_2_answer', 'tk', 'Platforma TÜRKSOY-yň goldawy bilen döredilýär — başyndan ähli türki ýurtlaryň ulgamy hökmünde.', 'Ýok — biz ösýäris: platforma jemgyýet bilen bilelikde ulalýar, dürli ýurtlaryň uniwersitetleri we talyplary bize goşulýar.'),
      ('objections_item_2_answer', 'uz', 'Platforma TURKSOY qoʻllab-quvvatlashi bilan yaratilmoqda — boshidanoq barcha turkiy mamlakatlar tizimi sifatida.', 'Yoʻq — biz rivojlanamiz: platforma hamjamiyat bilan birga oʻsadi, turli mamlakatlarning universitetlari va talabalari bizga qoʻshilmoqda.'),
      ('objections_item_4_question', 'ru', 'У меня и так получается находить фестивали и стажировки — зачем мне это?', 'У меня и так получается находить фестивали — зачем мне это?'),
      ('objections_item_4_question', 'tr', 'Zaten festival ve staj bulabiliyorum — bu bana neden lazım?', 'Festivalleri zaten bulabiliyorum — bu bana ne için?'),
      ('objections_item_4_question', 'az', 'Mən artıq festival və təcrübə tapa bilirəm — bu mənə nəyə lazımdır?', 'Festivalları özüm də tapa bilirəm — bu mənə nə üçün lazımdır?'),
      ('objections_item_4_question', 'kk', 'Мен фестивальдер мен тағылымдамаларды өзім де таба аламын — бұл маған неге керек?', 'Мен фестивальдерді өзім де таба аламын — бұл маған не үшін керек?'),
      ('objections_item_4_question', 'ky', 'Мен фестивалдар менен стажировкаларды өзүм эле таба алам — бул мага эмне үчүн керек?', 'Мен фестивалдарды өзүм деле таба алам — бул мага эмне үчүн керек?'),
      ('objections_item_4_question', 'tk', 'Men eýýäm festiwal we amaliýat tapyp bilýärin — bu maňa näme üçin gerek?', 'Men festiwallary özüm hem tapyp bilýärin — bu maňa näme üçin gerek?'),
      ('objections_item_4_question', 'uz', 'Men allaqachon festival va amaliyotlarni topa olaman — bu menga nima uchun kerak?', 'Festivallarni oʻzim ham topa olaman — bu menga nima uchun kerak?'),
      ('objections_item_4_answer', 'ru', 'После фестиваля или стажировки связи обычно обрываются. TURKIC STUDENTS — про то, что происходит после.', 'После фестиваля связи обычно обрываются. TURKIC STUDENTS — про то, что происходит после.'),
      ('objections_item_4_answer', 'tr', 'Festival veya stajdan sonra bağlantılar genellikle kopar. TURKIC STUDENTS, sonrasında ne olduğuyla ilgili.', 'Festivalden sonra bağlantılar genellikle kopar. TURKIC STUDENTS, sonrasında ne olduğuyla ilgili.'),
      ('objections_item_4_answer', 'az', 'Festival və ya təcrübədən sonra əlaqələr adətən qırılır. TURKIC STUDENTS bundan sonra nə baş verdiyi ilə bağlıdır.', 'Festivaldan sonra əlaqələr adətən qırılır. TURKIC STUDENTS bundan sonra nə baş verdiyi haqqındadır.'),
      ('objections_item_4_answer', 'kk', 'Фестиваль немесе тағылымдамадан кейін байланыстар әдетте үзіледі. TURKIC STUDENTS — содан кейін не болатыны туралы.', 'Фестивальден кейін байланыстар әдетте үзіледі. TURKIC STUDENTS — осыдан кейін не болатыны туралы.'),
      ('objections_item_4_answer', 'ky', 'Фестивалдан же стажировкадан кийин байланыштар адатта үзүлөт. TURKIC STUDENTS — андан кийин эмне болору тууралуу.', 'Фестивалдан кийин байланыштар адатта үзүлөт. TURKIC STUDENTS — андан кийин эмне болору тууралуу.'),
      ('objections_item_4_answer', 'tk', 'Festiwaldan ýa-da amaliýatdan soň gatnaşyklar adatça üzülýär. TURKIC STUDENTS — şondan soň näme bolýany barada.', 'Festiwaldan soň gatnaşyklar adatça üzülýär. TURKIC STUDENTS — şondan soň näme bolýandygy barada.'),
      ('objections_item_4_answer', 'uz', 'Festival yoki amaliyotdan keyin aloqalar odatda uziladi. TURKIC STUDENTS — bundan keyin nima boʻlishi haqida.', 'Festivaldan keyin aloqalar odatda uziladi. TURKIC STUDENTS — bundan keyin nima boʻlishi haqida.')
    ) AS v(key, locale, old_value, new_value)
    WHERE sc.key = v.key AND sc.locale = v.locale AND sc.value = v.old_value;
    DELETE FROM site_content sc USING (VALUES
      ('principles_text', 'ru', 'При поддержке Международной организации тюркской культуры (ТЮРКСОЙ) — общими усилиями шести стран, а не одной.'),
      ('principles_text', 'tr', 'Uluslararası Türk Kültürü Teşkilatı (TÜRKSOY) desteğiyle — tek bir ülkenin değil, altı ülkenin ortak çabasıyla.'),
      ('principles_text', 'az', 'Beynəlxalq Türk Mədəniyyəti Təşkilatının (TÜRKSOY) dəstəyi ilə — bir deyil, altı ölkənin ortaq səyi ilə.'),
      ('principles_text', 'kk', 'Халықаралық түркі мәдениеті ұйымының (ТҮРКСОЙ) қолдауымен — бір емес, алты елдің бірлескен күш-жігерімен.'),
      ('principles_text', 'ky', 'Эл аралык түрк маданияты уюмунун (ТҮРКСОЙ) колдоосу менен — бир эмес, алты өлкөнүн биргелешкен күч-аракети менен.'),
      ('principles_text', 'tk', 'Halkara türki medeniýet guramasynyň (TÜRKSOY) goldawy bilen — bir däl, alty ýurduň bilelikdäki tagallasy bilen.'),
      ('principles_text', 'uz', 'Xalqaro turkiy madaniyat tashkiloti (TURKSOY) qoʻllab-quvvatlashi bilan — bitta emas, olti mamlakatning birgalikdagi saʼy-harakati bilan.')
    ) AS d(key, locale, old_value)
    WHERE sc.key = d.key AND sc.locale = d.locale AND sc.value = d.old_value;
    INSERT INTO content_patches (name) VALUES ('2026-10-wave3-texts');
  END IF;
END
$patch$;

CREATE TABLE IF NOT EXISTS guest_opinions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (
    category IN ('opinion', 'idea', 'proposal', 'viewpoint', 'missing', 'other')
  ),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- «Стена идей»: идеи и ответы без регистрации. Текст хранится в оригинале, переводы на
-- остальные языки (locale → текст) дописываются фоном (lib/translate.ts), пока их нет —
-- показываем оригинал. Скрытие вместо удаления — админ может вернуть сообщение.
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (
    category IN ('opinion', 'idea', 'proposal', 'viewpoint', 'missing', 'other')
  ),
  author_name TEXT,
  country TEXT NOT NULL,
  university_id UUID REFERENCES festival_universities(id),
  university_other_name TEXT,
  text TEXT NOT NULL,
  source_locale TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ideas_created_idx ON ideas (created_at DESC);

CREATE TABLE IF NOT EXISTS idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author_name TEXT,
  country TEXT NOT NULL,
  text TEXT NOT NULL,
  source_locale TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idea_comments_idea_idx ON idea_comments (idea_id, created_at);
