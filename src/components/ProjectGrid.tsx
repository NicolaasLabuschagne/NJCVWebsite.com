"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Code } from "lucide-react";

const projects = [
  {
    title: "Helpdesk System",
    description: "Modular ticketing, RBAC, audit logs, and escalation flows for property teams.",
    tags: ["Angular", "ABP", "C#"],
    gh: "https://github.com/NicolaasLabuschagne",
    link: "#"
  },
  {
    title: "Project Board",
    description: "Priority matrix, release planning, and developer handoff logic for agile squads.",
    tags: ["Supabase", "UX", "React"],
    gh: "https://github.com/NicolaasLabuschagne",
    link: "#"
  },
  {
    title: "Cinematic Backgrounds",
    description: "Interactive artistic gallery showcasing dynamic JavaScript backgrounds with particle systems.",
    tags: ["JavaScript", "Canvas", "p5.js"],
    gh: "https://github.com/NicolaasLabuschagne",
    link: "#"
  },
  {
    title: "Property Management Suite",
    description: "Custom-built tools for debt recovery, tenant tracking, and portfolio oversight.",
    tags: ["Razor Pages", "MySQL", "C#"],
    gh: "https://github.com/NicolaasLabuschagne",
    link: "#"
  }
];

const ProjectGrid = () => {
  return (
    <section id="work" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">
              SELECTED<span className="text-orange">_WORKS</span>
            </h2>
            <p className="max-w-xl opacity-60 font-mono text-sm">
              A curated database of systems, tools, and experiments designed for impact.
            </p>
          </div>
          <div className="bg-charcoal/30 p-4 border-2 border-foreground shadow-brutal flex flex-col gap-2">
             <div className="flex items-center gap-2 font-mono text-xs mb-2">
                <Github className="w-4 h-4" />
                <span>GITHUB_CONTRIBUTIONS</span>
             </div>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
               src="https://ghchart.rshah.org/FF6B35/NicolaasLabuschagne"
               alt="GitHub Contributions"
               className="h-16 w-auto"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group border-3 border-foreground bg-background p-8 hover:shadow-brutal transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-orange/10 border-2 border-orange/20 text-orange">
                  <Code className="w-6 h-6" />
                </div>
                <div className="flex gap-4">
                  <a href={project.gh} className="hover:text-orange transition-colors"><Github className="w-5 h-5" /></a>
                  <a href={project.link} className="hover:text-orange transition-colors"><ExternalLink className="w-5 h-5" /></a>
                </div>
              </div>

              <h3 className="text-3xl font-black mb-4 tracking-tighter group-hover:text-orange transition-colors">
                {project.title}
              </h3>

              <p className="opacity-70 mb-8 flex-1 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-foreground text-background font-mono text-[10px] font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://github.com/NicolaasLabuschagne"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm hover:text-orange transition-colors"
          >
            &gt; VIEW_ALL_REPOSITORIES_ON_GITHUB
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;
