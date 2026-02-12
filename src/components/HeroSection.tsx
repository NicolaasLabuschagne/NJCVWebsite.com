"use client";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-mono text-orange mb-4 tracking-[0.2em] uppercase text-sm">Full Stack Developer & Systems Architect</h2>
          <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tighter">
            RIGOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-electricBlue">
              & EXPRESSION
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-80 mb-12">
            Building digital systems that balance technical precision with creative fluidity.
            Focused on scalability, impact, and &quot;messy professional&quot; aesthetics.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a href="#work" className="w-full md:w-auto px-8 py-4 bg-foreground text-background font-bold text-lg brutal-border flex items-center justify-center gap-2">
              VIEW_DATABASE [01]
            </a>
            <a href="#contact" className="w-full md:w-auto px-8 py-4 border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-all">
              INITIATE_CONTACT
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full opacity-20">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-foreground/30 aspect-square"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
