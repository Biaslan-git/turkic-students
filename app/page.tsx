import { Header } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { CycleSection } from "@/components/sections/cycle-section";
import { AudienceSection } from "@/components/sections/audience-section";
import { PrinciplesSection } from "@/components/sections/principles-section";
import { ObjectionsSection } from "@/components/sections/objections-section";
import { FestivalSection } from "@/components/festival/festival-section";
import { WaitlistSection } from "@/components/sections/waitlist-section";
import { Footer } from "@/components/sections/footer";
import { getSiteContent } from "@/lib/content/site-content";
import { listActiveUniversities } from "@/lib/universities";

// Текст секций хранится в БД и редактируется из /admin/content — DATABASE_URL недоступна
// на этапе сборки Docker-образа (см. Dockerfile), поэтому страница не может быть
// статически отрендерена во время `next build`.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [c, universities] = await Promise.all([getSiteContent(), listActiveUniversities()]);

  return (
    <div className="flex flex-1 flex-col">
      <Header ctaLabel={c.cta_label} />
      <main className="flex flex-1 flex-col">
        <HeroSection
          ctaLabel={c.cta_label}
          badge={c.hero_badge}
          titleMain={c.hero_title_main}
          titleAccent={c.hero_title_accent}
          subtitle={c.hero_subtitle}
        />
        <ProblemSection
          badge={c.problem_badge}
          title={c.problem_title}
          text={c.problem_text}
          sources={[
            c.problem_source_1,
            c.problem_source_2,
            c.problem_source_3,
            c.problem_source_4,
            c.problem_source_5,
          ]}
          closingBefore={c.problem_closing_before}
          closingEmphasis={c.problem_closing_emphasis}
          closingAfter={c.problem_closing_after}
        />
        <SolutionSection
          badge={c.solution_badge}
          title={c.solution_title}
          text={c.solution_text}
          benefits={[
            { title: c.solution_benefit_1_title, text: c.solution_benefit_1_text },
            { title: c.solution_benefit_2_title, text: c.solution_benefit_2_text },
            { title: c.solution_benefit_3_title, text: c.solution_benefit_3_text },
          ]}
        />
        <CycleSection
          badge={c.cycle_badge}
          title={c.cycle_title}
          text={c.cycle_text}
          note={c.cycle_note}
          steps={[
            { title: c.cycle_step_1_title, text: c.cycle_step_1_text },
            { title: c.cycle_step_2_title, text: c.cycle_step_2_text },
            { title: c.cycle_step_3_title, text: c.cycle_step_3_text },
            { title: c.cycle_step_4_title, text: c.cycle_step_4_text },
            { title: c.cycle_step_5_title, text: c.cycle_step_5_text },
            { title: c.cycle_step_6_title, text: c.cycle_step_6_text },
          ]}
        />
        <AudienceSection
          badge={c.audience_badge}
          title={c.audience_title}
          intro={c.audience_intro}
          segments={[c.audience_segment_1, c.audience_segment_2, c.audience_segment_3]}
          outro={c.audience_outro}
        />
        <PrinciplesSection
          badge={c.principles_badge}
          title={c.principles_title}
          text={c.principles_text}
          countries={[
            c.principles_country_1,
            c.principles_country_2,
            c.principles_country_3,
            c.principles_country_4,
            c.principles_country_5,
            c.principles_country_6,
          ]}
          principles={[
            { title: c.principles_item_1_title, text: c.principles_item_1_text },
            { title: c.principles_item_2_title, text: c.principles_item_2_text },
            { title: c.principles_item_3_title, text: c.principles_item_3_text },
            { title: c.principles_item_4_title, text: c.principles_item_4_text },
            { title: c.principles_item_5_title, text: c.principles_item_5_text },
            { title: c.principles_item_6_title, text: c.principles_item_6_text },
          ]}
        />
        <ObjectionsSection
          title={c.objections_title}
          items={[
            { question: c.objections_item_1_question, answer: c.objections_item_1_answer },
            { question: c.objections_item_2_question, answer: c.objections_item_2_answer },
            { question: c.objections_item_3_question, answer: c.objections_item_3_answer },
            { question: c.objections_item_4_question, answer: c.objections_item_4_answer },
          ]}
        />
        <FestivalSection
          badge={c.tvoi_golos_badge}
          title={c.tvoi_golos_title}
          subtitle={c.tvoi_golos_subtitle}
          text={c.tvoi_golos_text}
          alumniNote={c.tvoi_golos_alumni_note}
        />
        <WaitlistSection title={c.waitlist_title} text={c.waitlist_text} universities={universities} />
      </main>
      <Footer ctaLabel={c.cta_label} text={c.footer_text} />
    </div>
  );
}
