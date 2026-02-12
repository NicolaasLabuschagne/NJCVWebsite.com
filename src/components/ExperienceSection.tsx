"use client";
import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    title: "Systems Architect & Developer",
    company: "Estate Recoveries",
    period: "2024 - PRESENT",
    description: "Refining systems that help teams move faster and smarter in debt recovery and property management.",
    tags: ["Systems Design", "Full Stack"]
  },
  {
    title: "Full Stack Developer",
    company: "Freelance",
    period: "2022 - 2024",
    description: "Developed custom tools for property management, mining, and small businesses with clean code and modular logic.",
    tags: ["React", "Node.js", "MySQL"]
  },
  {
    title: "Web Developer",
    company: "Independent Projects",
    period: "2020 - 2022",
    description: "Built interactive web experiences and automated workflows for diverse clients.",
    tags: ["JavaScript", "Automation"]
  }
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black mb-16 tracking-tighter uppercase">
          PROFESSIONAL<span className="text-orange">_JOURNEY</span>
        </h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative pl-8 border-l-2 border-background/20 hover:border-orange transition-colors"
            >
              <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-background border-2 border-foreground group-hover:bg-orange transition-colors"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">{exp.title}</h3>
                  <p className="font-mono text-orange text-sm font-bold">@ {exp.company}</p>
                </div>
                <div className="font-mono text-xs bg-background/10 px-3 py-1 border border-background text-background">
                  {exp.period}
                </div>
              </div>

              <p className="max-w-3xl opacity-80 mb-6 font-medium">
                {exp.description}
              </p>

              <div className="flex gap-2">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono border border-background/20 px-2 py-1 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
