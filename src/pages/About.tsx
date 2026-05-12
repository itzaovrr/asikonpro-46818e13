import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { MissionVision } from "@/components/about/MissionVision";
import { Reveal } from "@/components/transitions/Reveal";

const About = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Reveal as="section">
          <SectionHeader
            eyebrow="Why ASIKON"
            title="Built for every Bangladeshi learner"
            subtitle="Simple, smart, and accessible — by design."
          />
          <MissionVision />
        </Reveal>
      </div>
    </AppLayout>
  );
};

export default About;
