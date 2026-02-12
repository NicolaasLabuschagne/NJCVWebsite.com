"use client";
import React, { useState } from "react";
import { Send, Linkedin, Github, Mail } from "lucide-react";

const ContactSection = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog("VALIDATING_INPUT...");
    setTimeout(() => addLog("ENCRYPTING_MESSAGE..."), 500);
    setTimeout(() => addLog("TRANSMISSION_SUCCESSFUL."), 1000);
    setTimeout(() => addLog("ESTABLISHING_WAIT_STATE..."), 1500);
  };

  return (
    <section id="contact" className="py-24 bg-charcoal/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase">
              GET_IN<span className="text-orange">_TOUCH</span>
            </h2>
            <p className="text-xl opacity-80 mb-12 max-w-md font-medium">
              Available for freelance collaborations and full-time systems architecture roles.
              Let&apos;s build something that refuses to be boring.
            </p>

            <div className="space-y-6">
              <a href="mailto:NJ.Labuschagne@outlook.com" className="flex items-center gap-4 group">
                <div className="p-3 border-2 border-foreground group-hover:bg-orange group-hover:text-background transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="font-mono text-lg group-hover:text-orange transition-colors">NJ.Labuschagne@outlook.com</span>
              </a>

              <div className="flex gap-4">
                <a href="https://github.com/NicolaasLabuschagne" target="_blank" rel="noopener noreferrer" className="p-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-all">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/nicolaas-labuschagne-919739286" target="_blank" rel="noopener noreferrer" className="p-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-all">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="mt-16 p-4 border-2 border-foreground/20 font-mono text-[10px] space-y-1">
              {logs.length === 0 && <p className="opacity-40">SYSTEM_IDLE: Awaiting user input...</p>}
              {logs.map((log, i) => (
                <p key={i} className={log.includes("SUCCESSFUL") ? "text-limeGreen" : "opacity-80"}>
                  {log}
                </p>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="terminal-window p-8 shadow-brutal-lg space-y-6">
             <div className="space-y-2">
                <label className="font-mono text-xs uppercase opacity-60">Identity_</label>
                <input
                  type="text"
                  required
                  placeholder="NAME / ALIAS"
                  className="w-full bg-transparent border-b-2 border-foreground/30 p-2 focus:border-orange outline-none font-mono transition-colors"
                />
             </div>
             <div className="space-y-2">
                <label className="font-mono text-xs uppercase opacity-60">Coordinates_</label>
                <input
                  type="email"
                  required
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-transparent border-b-2 border-foreground/30 p-2 focus:border-orange outline-none font-mono transition-colors"
                />
             </div>
             <div className="space-y-2">
                <label className="font-mono text-xs uppercase opacity-60">Transmission_</label>
                <textarea
                  required
                  rows={4}
                  placeholder="WHAT'S ON YOUR MIND?"
                  className="w-full bg-transparent border-2 border-foreground/30 p-4 focus:border-orange outline-none font-mono transition-colors resize-none"
                />
             </div>
             <button
               type="submit"
               className="w-full py-4 bg-orange text-background font-black text-xl brutal-border flex items-center justify-center gap-2 group"
             >
               TRANSMIT_DATA
               <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
