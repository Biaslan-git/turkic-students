import { Header } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { CycleSection } from "@/components/sections/cycle-section";
import { AudienceSection } from "@/components/sections/audience-section";
import { PrinciplesSection } from "@/components/sections/principles-section";
import { WaitlistSection } from "@/components/sections/waitlist-section";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <CycleSection />
        <AudienceSection />
        <PrinciplesSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
