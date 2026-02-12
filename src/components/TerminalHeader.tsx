"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const TerminalHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4",
        scrolled && "bg-background/90 backdrop-blur-md border-b-2 border-foreground py-2"
      )}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
          <Terminal className="w-6 h-6 text-orange" />
          NICOLAAS.exe
        </Link>

        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <Link href="#about" className="hover:text-orange transition-colors">/ABOUT</Link>
          <Link href="#skills" className="hover:text-orange transition-colors">/SKILLS</Link>
          <Link href="#experience" className="hover:text-orange transition-colors">/LOGS</Link>
          <Link href="#work" className="hover:text-orange transition-colors">/WORK</Link>
          <Link
            href="#contact"
            className="bg-orange text-background px-4 py-1 brutal-border font-bold hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all"
          >
            HIRE_ME
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-limeGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-limeGreen"></span>
          </span>
          STATUS: ONLINE
        </div>
      </nav>
    </header>
  );
};

export default TerminalHeader;
