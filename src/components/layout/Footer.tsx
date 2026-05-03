"use client"

import Link from "next/link"
import { HeartPulse, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/50 dark:bg-slate-950 text-foreground dark:text-white py-20 border-t border-border relative overflow-hidden transition-colors duration-500">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-border pb-12 mb-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-xl sm:text-2xl text-primary">
              <div className="bg-primary text-white p-1 rounded-lg">
                <HeartPulse size={18} />
              </div>
              <span className="tracking-tighter">One Tap AI <span className="text-foreground dark:text-white text-lg sm:text-xl font-black">Diagnose</span></span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium max-w-xs">
              Pioneering the future of digital health with advanced clinical triage and a seamless provider ecosystem.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground">Platform</h4>
            <ul className="space-y-2 text-[11px] text-muted-foreground font-bold">
              <li className="hover:text-primary cursor-pointer transition-colors">AI Triage</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Doctor Search</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Bookings</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground">Developer</h4>
            <div className="space-y-1">
              <p className="text-[12px] font-black text-foreground">Manohar Dhumal</p>
              <p className="text-[10px] text-muted-foreground font-medium italic">Fullstack Developer</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/manohar12-max" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-black hover:text-white transition-all shadow-sm group"
                title="GitHub"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 fill-current" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/manohar-dhumal/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-[#0077b5] hover:text-white transition-all shadow-sm"
                title="LinkedIn"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 fill-current" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a 
                href="mailto:manohar@example.com" 
                className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>© 2026 One Tap AI Diagnose • Excellence in HealthTech</span>
          <div className="flex gap-8">
             <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
