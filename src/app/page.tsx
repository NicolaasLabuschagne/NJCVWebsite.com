"use client";
import dynamic from "next/dynamic";
import TerminalHeader from "@/components/TerminalHeader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectGrid from "@/components/ProjectGrid";
import ContactSection from "@/components/ContactSection";

const InteractiveBackground = dynamic(
  () => import("@/components/InteractiveBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <InteractiveBackground />
      <TerminalHeader />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectGrid />
      <ContactSection />

      <footer className="py-12 border-t-2 border-foreground/10 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-xl font-bold tracking-tighter">
            NICOLAAS.exe
          </div>
          <div className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em]">
            © 2026 NICOLAAS LABUSCHAGNE // SYSTEM_END
          </div>
          <div className="font-mono text-xs">
            BUILT_WITH: <span className="text-orange">NEXT.JS + TAILWIND</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
