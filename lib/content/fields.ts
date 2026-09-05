/** Single source of truth for which text fields are editable from the admin panel. */
export type ContentField = {
  key: string;
  section: string;
  label: string;
  multiline?: boolean;
  /** Leading/trailing spaces are meaningful — this field is concatenated with a sibling field or an accent span. */
  preserveWhitespace?: boolean;
};

export const CONTENT_FIELDS: ContentField[] = [
  { key: "cta_label", section: "Общее", label: "Текст кнопки регистрации (шапка, главный экран, футер)" },

  { key: "hero_badge", section: "Главный экран", label: "Бейдж над заголовком" },
  {
    key: "hero_title_main",
    section: "Главный экран",
    label: "Заголовок, обычная часть",
    multiline: true,
    preserveWhitespace: true,
  },
  {
    key: "hero_title_accent",
    section: "Главный экран",
    label: "Заголовок, выделенная часть (оранжевым)",
  },
  { key: "hero_subtitle", section: "Главный экран", label: "Подзаголовок", multiline: true },

  { key: "problem_badge", section: "Трудность", label: "Бейдж над заголовком" },
  { key: "problem_title", section: "Трудность", label: "Заголовок" },
  { key: "problem_text", section: "Трудность", label: "Текст", multiline: true },
  { key: "problem_source_1", section: "Трудность", label: "Пример источника 1" },
  { key: "problem_source_2", section: "Трудность", label: "Пример источника 2" },
  { key: "problem_source_3", section: "Трудность", label: "Пример источника 3" },
  { key: "problem_source_4", section: "Трудность", label: "Пример источника 4" },
  { key: "problem_source_5", section: "Трудность", label: "Пример источника 5" },
  {
    key: "problem_closing_before",
    section: "Трудность",
    label: "Заключительная фраза: начало",
    preserveWhitespace: true,
  },
  {
    key: "problem_closing_emphasis",
    section: "Трудность",
    label: "Заключительная фраза: выделенное слово",
  },
  {
    key: "problem_closing_after",
    section: "Трудность",
    label: "Заключительная фраза: конец",
    multiline: true,
    preserveWhitespace: true,
  },

  { key: "solution_badge", section: "Решение", label: "Бейдж над заголовком" },
  { key: "solution_title", section: "Решение", label: "Заголовок" },
  { key: "solution_text", section: "Решение", label: "Текст", multiline: true },
  { key: "solution_benefit_1_title", section: "Решение", label: "Преимущество 1: название" },
  { key: "solution_benefit_1_text", section: "Решение", label: "Преимущество 1: описание", multiline: true },
  { key: "solution_benefit_2_title", section: "Решение", label: "Преимущество 2: название" },
  { key: "solution_benefit_2_text", section: "Решение", label: "Преимущество 2: описание", multiline: true },
  { key: "solution_benefit_3_title", section: "Решение", label: "Преимущество 3: название" },
  { key: "solution_benefit_3_text", section: "Решение", label: "Преимущество 3: описание", multiline: true },

  { key: "cycle_badge", section: "Круглый год", label: "Бейдж над заголовком" },
  { key: "cycle_title", section: "Круглый год", label: "Заголовок" },
  { key: "cycle_text", section: "Круглый год", label: "Текст", multiline: true },
  { key: "cycle_step_1_title", section: "Круглый год", label: "Шаг 1: название" },
  { key: "cycle_step_1_text", section: "Круглый год", label: "Шаг 1: описание", multiline: true },
  { key: "cycle_step_2_title", section: "Круглый год", label: "Шаг 2: название" },
  { key: "cycle_step_2_text", section: "Круглый год", label: "Шаг 2: описание", multiline: true },
  { key: "cycle_step_3_title", section: "Круглый год", label: "Шаг 3: название" },
  { key: "cycle_step_3_text", section: "Круглый год", label: "Шаг 3: описание", multiline: true },
  { key: "cycle_step_4_title", section: "Круглый год", label: "Шаг 4: название" },
  { key: "cycle_step_4_text", section: "Круглый год", label: "Шаг 4: описание", multiline: true },
  { key: "cycle_step_5_title", section: "Круглый год", label: "Шаг 5: название" },
  { key: "cycle_step_5_text", section: "Круглый год", label: "Шаг 5: описание", multiline: true },
  { key: "cycle_step_6_title", section: "Круглый год", label: "Шаг 6: название" },
  { key: "cycle_step_6_text", section: "Круглый год", label: "Шаг 6: описание", multiline: true },

  { key: "audience_badge", section: "Для кого", label: "Бейдж над заголовком" },
  { key: "audience_title", section: "Для кого", label: "Заголовок" },
  { key: "audience_intro", section: "Для кого", label: "Фраза перед списком" },
  { key: "audience_segment_1", section: "Для кого", label: "Пункт списка 1", multiline: true },
  { key: "audience_segment_2", section: "Для кого", label: "Пункт списка 2", multiline: true },
  { key: "audience_segment_3", section: "Для кого", label: "Пункт списка 3", multiline: true },
  { key: "audience_outro", section: "Для кого", label: "Фраза после списка", multiline: true },

  { key: "principles_badge", section: "Принципы", label: "Бейдж над заголовком" },
  { key: "principles_title", section: "Принципы", label: "Заголовок" },
  { key: "principles_text", section: "Принципы", label: "Текст", multiline: true },
  { key: "principles_country_1", section: "Принципы", label: "Страна 1" },
  { key: "principles_country_2", section: "Принципы", label: "Страна 2" },
  { key: "principles_country_3", section: "Принципы", label: "Страна 3" },
  { key: "principles_country_4", section: "Принципы", label: "Страна 4" },
  { key: "principles_country_5", section: "Принципы", label: "Страна 5" },
  { key: "principles_country_6", section: "Принципы", label: "Страна 6" },
  { key: "principles_item_1_title", section: "Принципы", label: "Принцип 1: название" },
  { key: "principles_item_1_text", section: "Принципы", label: "Принцип 1: описание", multiline: true },
  { key: "principles_item_2_title", section: "Принципы", label: "Принцип 2: название" },
  { key: "principles_item_2_text", section: "Принципы", label: "Принцип 2: описание", multiline: true },
  { key: "principles_item_3_title", section: "Принципы", label: "Принцип 3: название" },
  { key: "principles_item_3_text", section: "Принципы", label: "Принцип 3: описание", multiline: true },
  { key: "principles_item_4_title", section: "Принципы", label: "Принцип 4: название" },
  { key: "principles_item_4_text", section: "Принципы", label: "Принцип 4: описание", multiline: true },
  { key: "principles_item_5_title", section: "Принципы", label: "Принцип 5: название" },
  { key: "principles_item_5_text", section: "Принципы", label: "Принцип 5: описание", multiline: true },
  { key: "principles_item_6_title", section: "Принципы", label: "Принцип 6: название" },
  { key: "principles_item_6_text", section: "Принципы", label: "Принцип 6: описание", multiline: true },

  { key: "objections_title", section: "Если сомневаешься", label: "Заголовок" },
  { key: "objections_item_1_question", section: "Если сомневаешься", label: "Вопрос 1" },
  { key: "objections_item_1_answer", section: "Если сомневаешься", label: "Ответ 1", multiline: true },
  { key: "objections_item_2_question", section: "Если сомневаешься", label: "Вопрос 2" },
  { key: "objections_item_2_answer", section: "Если сомневаешься", label: "Ответ 2", multiline: true },
  { key: "objections_item_3_question", section: "Если сомневаешься", label: "Вопрос 3" },
  { key: "objections_item_3_answer", section: "Если сомневаешься", label: "Ответ 3", multiline: true },
  { key: "objections_item_4_question", section: "Если сомневаешься", label: "Вопрос 4" },
  { key: "objections_item_4_answer", section: "Если сомневаешься", label: "Ответ 4", multiline: true },

  { key: "waitlist_title", section: "Форма регистрации", label: "Заголовок" },
  { key: "waitlist_text", section: "Форма регистрации", label: "Текст", multiline: true },

  { key: "footer_text", section: "Футер", label: "Текст", multiline: true },

  { key: "tvoi_golos_badge", section: "Твой голос", label: "Бейдж над заголовком" },
  { key: "tvoi_golos_title", section: "Твой голос", label: "Заголовок" },
  { key: "tvoi_golos_subtitle", section: "Твой голос", label: "Подзаголовок" },
  { key: "tvoi_golos_text", section: "Твой голос", label: "Текст", multiline: true },
  { key: "tvoi_golos_alumni_note", section: "Твой голос", label: "Абзац про выпускников", multiline: true },
];
