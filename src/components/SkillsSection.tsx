"use client";
import React from "react";
import { motion } from "framer-motion";

const skills = [
  { category: "LIBRARY", name: "REACT", color: "text-electricBlue" },
  { category: "FRAMEWORK", name: "NEXT.JS", color: "text-white" },
  { category: "STYLING", name: "TAILWIND", color: "text-limeGreen" },
  { category: "BACKEND", name: "NODE.JS", color: "text-orange" },
  { category: "DATABASE", name: "MYSQL / SUPABASE", color: "text-electricBlue" },
  { category: "VERSION", name: "GIT", color: "text-orange" },
  { category: "LANGUAGE", name: "TYPESCRIPT", color: "text-electricBlue" },
  { category: "ARCHITECTURE", name: "SYSTEMS DESIGN", color: "text-white" },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black mb-16 tracking-tighter uppercase">
          TECH<span className="text-orange">_STACK</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border-2 border-foreground hover:bg-foreground hover:text-background group transition-all cursor-default"
            >
              <p className="font-mono text-[10px] opacity-60 mb-2 group-hover:text-orange">
                &gt;_ {skill.category}
              </p>
              <h3 className={`font-black text-xl tracking-tighter ${skill.color} group-hover:text-inherit`}>
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4 font-mono text-sm opacity-60">
          <div className="h-[1px] flex-1 bg-foreground/20"></div>
          <span>TOTAL_NODES: {skills.length}</span>
          <span>MEMORY_USAGE: OPTIMIZED</span>
          <div className="h-[1px] flex-1 bg-foreground/20"></div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
