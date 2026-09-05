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

  ('hero_badge', 'Под эгидой и при поддержке ТЮРКСОЙ'),
  ('hero_title_main', 'Фестивали и связи тюркского мира — '),
  ('hero_title_accent', 'в одном месте'),
  ('hero_subtitle', 'Фестивали и события тюркского мира разбросаны по десяткам сайтов и чатов — а нужные связи теряются вместе с ними. TÜRKSOY STUDENTS собирает всё в одном месте. Оставь имя и email — узнаешь о запуске одним из первых.'),

  ('problem_badge', 'Трудность'),
  ('problem_title', 'Пока ты искал — кто-то другой уже поехал'),
  ('problem_text', 'Обмен — на сайте вуза. Фестиваль — в Telegram-канале. Стажировка — в чате, который ты давно не открывал. Пока собираешь всё по кусочкам, дедлайн уже прошёл.'),
  ('problem_source_1', 'Сайты университетов'),
  ('problem_source_2', 'Программы обмена'),
  ('problem_source_3', 'Страницы отдельных фестивалей'),
  ('problem_source_4', 'Каналы со стажировками'),
  ('problem_source_5', 'Десятки чатов и групп'),
  ('problem_closing_before', 'И это только '),
  ('problem_closing_emphasis', 'твоя'),
  ('problem_closing_after', ' страна! Про остальные пять ты, скорее всего, даже не подозреваешь.'),

  ('solution_badge', 'Решение'),
  ('solution_title', 'Весь тюркский мир — на одной платформе'),
  ('solution_text', 'Информация остаётся у вузов, фестивалей и программ — мы просто собираем её в одном месте и превращаем в среду, где связи продолжаются и после фестиваля!'),
  ('solution_benefit_1_title', 'Единый каталог'),
  ('solution_benefit_1_text', 'Обмены, фестивали и стажировки — в одном месте, со ссылкой на источник.'),
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
  ('cycle_step_4_text', 'Совместная идея находит соавторов'),
  ('cycle_step_5_title', 'Новые проекты'),
  ('cycle_step_5_text', 'Идея превращается в инициативу с командой'),
  ('cycle_step_6_title', 'Новый фестиваль'),
  ('cycle_step_6_text', 'Сегодня — гость, через год — выступаешь сам'),
  ('cycle_note', 'Каждый фестиваль — начало следующего.'),

  ('audience_badge', 'Для кого'),
  ('audience_title', 'Ты на фестивале — значит, это для тебя'),
  ('audience_intro', 'Например, если ты:'),
  ('audience_segment_1', 'Уже был на фестивалях или обменах — и не хочешь, чтобы связи обрывались.'),
  ('audience_segment_2', 'Хочешь превращать случайные встречи в постоянные связи.'),
  ('audience_segment_3', 'Организуешь события или ведёшь проект — и ищешь партнёров в других странах.'),
  ('audience_outro', 'Позже подключатся вузы и организации. Но начинается всё с тебя.'),

  ('principles_badge', 'Принципы'),
  ('principles_title', 'Шесть стран, один тюркский мир'),
  ('principles_text', 'При поддержке Международной организации тюркской культуры (ТЮРКСОЙ) — общими усилиями шести стран, а не одной.'),
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
  ('principles_item_3_text', 'Не общие слова про сотрудничество, а конкретные программы и контакты.'),
  ('principles_item_4_title', 'Достоверность'),
  ('principles_item_4_text', 'Только проверенная информация — со ссылкой на источник.'),
  ('principles_item_5_title', 'Нейтральность'),
  ('principles_item_5_text', 'Пространство сотрудничества, а не политической конкуренции.'),
  ('principles_item_6_title', 'Международность'),
  ('principles_item_6_text', 'Общее пространство шести стран с первого дня, а не проект одной страны.'),

  ('objections_title', 'Коротко, если сомневаешься'),
  ('objections_item_1_question', 'Платформы ведь ещё нет — зачем регистрироваться сейчас?'),
  ('objections_item_1_answer', 'Чем раньше наберётся аудитория, тем быстрее платформа заработает — а ты узнаешь о запуске одним из первых.'),
  ('objections_item_2_question', 'Не станет ли это очередным порталом, который закроется через полгода?'),
  ('objections_item_2_answer', 'Платформа создаётся при поддержке ТЮРКСОЙ — сразу как система шести стран: Азербайджана, Казахстана, Кыргызстана, Туркменистана, Турции и Узбекистана.'),
  ('objections_item_3_question', 'Куда денутся мои данные?'),
  ('objections_item_3_answer', 'Имя и email нужны только для регистрации и уведомления о запуске — больше ни для чего.'),
  ('objections_item_4_question', 'У меня и так получается находить фестивали и стажировки — зачем мне это?'),
  ('objections_item_4_answer', 'После фестиваля или стажировки связи обычно обрываются. TÜRKSOY STUDENTS — про то, что происходит после.'),

  ('waitlist_title', 'Регистрация открыта'),
  ('waitlist_text', 'Оставь имя и email — и попадёшь в число первых, кто получит доступ.'),

  ('footer_text', 'Цифровая платформа, которая соединяет студентов тюркского мира: образование, фестивали и совместные проекты.'),

  ('tvoi_golos_badge', 'Международный студенческий театральный фестиваль в Туркестане'),
  ('tvoi_golos_title', 'ТВОЙ ГОЛОС — ТВОЙ ФЕСТИВАЛЬ'),
  ('tvoi_golos_subtitle', 'Выскажись. Предложи. Влияй.'),
  ('tvoi_golos_text', 'Фестиваль — это не только спектакли и участники. Мы хотим услышать студентов: что ты думаешь о фестивале, каким хотел бы видеть его в будущем и что стоит изменить. Твоя идея может стать частью следующего фестиваля.'),
  ('tvoi_golos_alumni_note', 'К инициативе может присоединиться не только нынешнее студенческое сообщество вашего университета, но и его выпускники — люди, для которых университет остаётся частью их личной истории.')
ON CONFLICT (key) DO NOTHING;

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
  ('Казахско-Турецкий университет им. Ахмет Яссауи', 'Казахстан'),
  ('Казахский национальный университет им. аль-Фараби', 'Казахстан'),
  ('Евразийский национальный университет им. Л.Н. Гумилева', 'Казахстан'),
  ('Бакинский государственный университет', 'Азербайджан'),
  ('Кыргызский национальный университет им. Ж. Баласагына', 'Кыргызстан'),
  ('Туркменский государственный университет им. Махтумкули', 'Туркменистан'),
  ('Анкарский университет', 'Турция'),
  ('Стамбульский университет', 'Турция'),
  ('Национальный университет Узбекистана', 'Узбекистан')
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

INSERT INTO festival_universities (name, country) VALUES
  ('Азербайджанский государственный университет культуры и искусств', 'Азербайджан'),
  ('Казахский национальный университет искусств им. К. Байсеитовой', 'Казахстан'),
  ('Казахская национальная академия искусств им. Т. Жургенова', 'Казахстан'),
  ('Ташкентский государственный институт искусств и культуры', 'Узбекистан'),
  ('Кыргызско-Турецкий университет «Манас»', 'Кыргызстан'),
  ('Кыргызский государственный университет искусств и культуры им. Б. Бейшеналиевой', 'Кыргызстан')
ON CONFLICT (lower(name), lower(country)) DO NOTHING;

-- Свободный ввод вуза, когда его нет в festival_universities (см. Select allowCustom
-- в waitlist-form.tsx) — university_id остаётся NULL, название хранится как есть,
-- админ видит его на /admin/universities и при желании заводит вуз в справочник.
ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS university_other_name TEXT;

CREATE TABLE IF NOT EXISTS guest_opinions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (
    category IN ('opinion', 'idea', 'proposal', 'viewpoint', 'missing', 'other')
  ),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
