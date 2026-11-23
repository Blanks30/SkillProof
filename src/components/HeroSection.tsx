import Link from "next/link";
import dynamic from "next/dynamic";

const ThreeDScene = dynamic(() => import("./ThreeDScene"), { ssr: false, loading: () => <div className="w-full min-h-[460px] bg-[#101213]/70 rounded-3xl animate-pulse" /> });

export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden border-b border-[#1b1c1c]">
      {/* Glow blobs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[840px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[260px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />

      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-7 flex flex-col items-start gap-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141515] border border-[#232525] text-white shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06] animate-pulse" />
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#c4c7c8]">
                Built for Academic Hackathons • Sepolia Live
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.12] text-white tracking-[-0.035em] font-light">
              Your Skills. Your Achievements.{" "}
              <span className="font-medium text-white underline decoration-[#ec6a06]/50 decoration-2 underline-offset-8">
                Verified.
              </span>
            </h1>

            <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#8e9192] max-w-xl font-normal">
              Securely issue, manage, and verify tamper-proof skill certificates and project credentials using lightweight Ethereum smart contracts and decentralized IPFS storage.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/#quick-verify" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:bg-[#eaeaea] hover:scale-[1.01] active:scale-[0.99] transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                Verify a Certificate
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141515] border border-[#232525] text-white text-sm font-medium hover:border-[#3a3c3e] hover:bg-[#1a1b1c] transition-all">
                <svg className="w-4 h-4 text-[#8e9192]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                Explore Demo Student Portal
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-[11px] text-[#717476]">
              {[
                { label: "ECDSA secp256k1", dot: "bg-neutral-600" },
                { label: "SHA-256 IPFS CID", dot: "bg-neutral-600" },
                { label: "< 400ms Verification", dot: "bg-emerald-500/80" },
              ].map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Scene */}
          <div className="lg:col-span-5 relative" style={{ perspective: "1200px" }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,112,32,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none rounded-3xl" />
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative w-full rounded-3xl border border-white/10 border-t-white/20 bg-[#101213]/70 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] p-2 overflow-hidden">
              {/* Telemetry badges */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161819]/85 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-300 font-medium tracking-wide">Sepolia Consensus: 18ms</span>
              </div>
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161819]/85 backdrop-blur-md border border-white/10">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 17l-6.18 3.02L7 13.14 2 8.27l6.91-1.01z"/></svg>
                <span className="font-mono text-[10px] text-zinc-300 font-medium tracking-wide">ZK-Proof Enabled: 0x9f...a1</span>
              </div>
              <div className="absolute top-28 right-5 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121314]/90 backdrop-blur-md border border-[#ec6a06]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06]" />
                <span className="font-mono text-[9px] text-[#ffb690] uppercase tracking-wider font-semibold">IPFS Pin Active</span>
              </div>

              <ThreeDScene />

              {/* Bottom badge */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between px-4 py-2 rounded-2xl bg-[#141617]/85 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
                  <span className="font-mono text-[11px] text-white font-medium">Tamper-Proof Soulbound ERC-5192</span>
                </div>
                <span className="font-mono text-[10px] text-[#8e9192] uppercase tracking-wider hidden sm:inline">Stanford Web3 Lab #8921</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
