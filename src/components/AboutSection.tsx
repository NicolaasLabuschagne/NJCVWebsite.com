"use client";
import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-charcoal/30">
      <div className="container mx-auto px-6">
        <div className="terminal-window max-w-4xl mx-auto shadow-brutal-lg">
          <div className="terminal-header">
            <span>SYSTEM_MESSAGE // ABOUT_ME</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-orange"></div>
              <div className="w-3 h-3 rounded-full bg-electricBlue"></div>
              <div className="w-3 h-3 rounded-full bg-limeGreen"></div>
            </div>
          </div>
          <div className="p-8 font-mono text-sm md:text-base space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-orange font-bold mr-2">&gt;</span>
              I&apos;m Nicolaas Labuschagne — a full-stack developer, systems architect, and creative problem-solver.
              I build software that works hard and looks good doing it.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-orange font-bold mr-2">&gt;</span>
              My work is rooted in clarity, scalability, and real-world impact. I think in grids, motion, and modular logic.
              I believe software should feel alive — not just functional.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-orange font-bold mr-2">&gt;</span>
              Whether I&apos;m crafting a helpdesk system, automating workflows, or designing cinematic backgrounds,
              I bring curiosity, persistence, and a hands-on mindset.
            </motion.p>

            <div className="pt-6">
              <a
                href="/CV/Nicolaas-Labuschagne-CV.pdf"
                download
                className="inline-block px-6 py-2 bg-foreground text-background font-bold brutal-border hover:bg-orange transition-all"
              >
                DOWNLOAD_CREDENTIALS.pdf
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
