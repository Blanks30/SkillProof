import Link from "next/link";

const stakeholders = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 6V4a2 2 0 00-4 0v2" />
      </svg>
    ),
    title: "For Students & Builders",
    desc: "Own your career credentials forever. Share verifiable badges across resumes, LinkedIn, and GitHub profiles with instant one-click proof links.",
    features: ["Non-custodial cryptographic custody", "Portable proof for hackathon wins", "Permanent IPFS portfolio asset storage"],
    cta: "Access Student Dashboard", href: "/dashboard",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
    title: "For Academic Issuers",
    desc: "Eliminate registrar manual verifications. Issue thousands of certificates in batch transactions with automated smart contract signing.",
    features: ["CSV bulk minting in seconds", "Cryptographic revocation control", "100% brand forgery immunity"],
    cta: "Issuer Console Login", href: "/issuer",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    title: "For Talent Recruiters",
    desc: "Perform frictionless pre-interview candidate screening. Verify candidate coursework and project leadership claims with zero phone inquiries.",
    features: ["Instant sub-second verification", "Direct code repository cross-reference", "No third-party registrar paywalls"],
    cta: "Recruiter API Docs", href: "/verify",
  },
];

export default function StakeholderGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32" id="roles">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">User Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Tailored for Every Stakeholder</h2>
        <p className="text-sm sm:text-base text-[#8e9192] mt-3 font-normal leading-relaxed">
          Replacing opaque paper certificates and easily forged PDFs with decentralized trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stakeholders.map((s) => (
          <div key={s.title} className="group bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-8 flex flex-col justify-between relative hover:border-[#ec6a06]/35 hover:shadow-[0_24px_48px_-12px_rgba(236,106,6,0.14)] transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#18191a] border border-[#262829] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-xl font-medium text-white tracking-tight">{s.title}</h3>
              <p className="text-xs sm:text-sm text-[#8e9192] leading-relaxed">{s.desc}</p>
              <ul className="flex flex-col gap-2.5 pt-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-[#c4c7c8]">
                    <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[#1e2021]">
              <Link href={s.href} className="text-xs text-white font-medium hover:text-[#ec6a06] inline-flex items-center gap-1 transition-colors">
                {s.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
