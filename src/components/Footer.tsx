import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0b] border-t border-[#1b1c1c]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#18191a] border border-[#262829] flex items-center justify-center">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke="#ec6a06" strokeWidth="2" fill="rgba(236,106,6,0.2)" />
              <circle cx="12" cy="12" r="3" fill="#ec6a06" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white tracking-tight">SkillProof Protocol</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#717476]">
          <Link href="/verify" className="hover:text-white transition-colors">Smart Contract Registry</Link>
          <Link href="/#pipeline" className="hover:text-white transition-colors">Architecture</Link>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#141515] border border-[#232525] text-[#9ca3af]">
            v2.4.0-sepolia
          </span>
        </div>

        <div className="text-xs text-[#717476]">
          © 2025 SkillProof Inc. Cryptographic Credentials Engine.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
