"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#pipeline" },
  { label: "Public Verify", href: "/verify" },
  { label: "Role Portal", href: "/#roles" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b0c0d]/80 backdrop-blur-xl border-b border-[#232525]/60">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#232525] to-[#343535] p-px flex items-center justify-center shadow-inner">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke="#ec6a06" strokeWidth="1.5" fill="rgba(236,106,6,0.15)" />
              <circle cx="12" cy="12" r="3" fill="#ec6a06" />
            </svg>
          </div>
          <span className="font-medium text-lg tracking-tight text-white">SkillProof</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#141515]/90 border border-[#232525] shadow-inner">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="px-4 py-1.5 text-xs font-medium text-[#888989] hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/verify" className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#232525] bg-[#141515] text-xs font-medium text-[#c4c7c8] hover:text-white hover:border-[#383a3b] transition-all">
            Verify Certificate
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white text-black text-xs font-medium tracking-tight shadow-[0_0_24px_rgba(255,255,255,0.12)] hover:bg-[#eaeaea] hover:scale-[1.01] active:scale-[0.99] transition-all">
            Launch Console
          </Link>
          {/* Mobile toggle */}
          <button className="lg:hidden text-white p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#0b0c0d]/95 border-t border-[#232525] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-[#c4c7c8] hover:text-white transition-colors py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/verify" onClick={() => setOpen(false)} className="text-sm text-[#ec6a06] hover:text-orange-400 transition-colors py-1">
            Verify Certificate →
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
