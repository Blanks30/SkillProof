import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ZeroTrustPipeline from "@/components/ZeroTrustPipeline";
import VerificationWidget from "@/components/VerificationWidget";
import StakeholderGrid from "@/components/StakeholderGrid";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";

const techStack = ["Next.js 14 App Router", "Solidity 0.8.24", "Ethers.js v6", "Pinata IPFS Node", "Tailwind CSS"];

export default function HomePage() {
  return (
    <div className="bg-[#0b0c0d] text-[#e3e2e2] min-h-screen">
      <Navbar />
      <main className="w-full pt-20 min-h-screen">
        {/* Hero */}
        <HeroSection />

        {/* Tech Stack Bar */}
        <section className="w-full bg-[#0d0e0f] border-b border-[#1b1c1c] py-5" id="features">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#8e9192]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8e9192]">Student Hackathon Stack Transparency</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {techStack.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-[#c4c7c8] font-mono text-[11px]">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Pipeline */}
        <ZeroTrustPipeline />

        {/* Live Verification Widget */}
        <VerificationWidget />

        {/* Stakeholder Grid */}
        <StakeholderGrid />

        {/* FAQ */}
        <FaqAccordion />

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="relative bg-gradient-to-b from-[#161718] to-[#101112] border border-[#262829] rounded-3xl p-10 lg:p-16 overflow-hidden shadow-2xl text-center flex flex-col items-center">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-600/20 blur-3xl pointer-events-none rounded-full" />
            <div className="relative flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18191a] border border-[#262829] text-white mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Hackathon Ready • Open Source</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight mt-4 max-w-2xl leading-tight">
                Ready to issue tamper-proof academic credentials?
              </h2>
              <p className="text-sm sm:text-base text-[#8e9192] max-w-lg mt-4 font-light leading-relaxed">
                Deploy your first university smart contract registry or test our developer playground on the Sepolia network in under 5 minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
                <Link href="/issuer" className="px-6 py-3 rounded-full bg-white text-black text-xs font-semibold tracking-tight shadow-lg hover:bg-[#eaeaea] hover:scale-105 active:scale-95 transition-all">
                  Deploy Smart Contract
                </Link>
                <Link href="/#quick-verify" className="px-6 py-3 rounded-full bg-[#18191a] border border-[#262829] text-white text-xs font-medium hover:border-[#383a3b] hover:bg-[#202224] hover:scale-105 transition-all">
                  Test Certificate Explorer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
