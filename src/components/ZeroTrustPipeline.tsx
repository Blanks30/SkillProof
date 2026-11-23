const steps = [
  {
    num: "01", tag: "Issuer Node", title: "Cryptographic Signing",
    desc: "University registrar or hackathon lead signs student achievement schema using an authorized ECDSA private key.",
    footerLabel: "Signature", footerValue: "secp256k1 (r, s, v verified)", footerClass: "text-[#c4c7c8]",
  },
  {
    num: "02", tag: "Storage Grid", title: "IPFS Decentralized Pin",
    desc: "Certificate graphic assets, metadata, and achievement logs are packaged into immutable Content Addressed Objects (CID).",
    footerLabel: "MultiHash", footerValue: "SHA-256 Pinata Clustered", footerClass: "text-[#c4c7c8]",
  },
  {
    num: "03", tag: "EVM Contract", title: "On-Chain State Commit",
    desc: "A gas-optimized smart contract on Sepolia logs the credential hash, issuer identifier, timestamp, and active status flag.",
    footerLabel: "Gas Optimization", footerValue: "~42,000 gas / mint", footerClass: "text-[#c4c7c8]",
  },
  {
    num: "04", tag: "Zero-Trust UI", title: "Instant Public Audit",
    desc: "Employers scan QR code or search Certificate ID to read directly from the blockchain node. No login or phone calls needed.",
    footerLabel: "Latency", footerValue: "< 400ms Read Time", footerClass: "text-emerald-400",
  },
];

export default function ZeroTrustPipeline() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32" id="pipeline">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Protocol Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Zero-Trust Verification Pipeline</h2>
        <p className="text-sm sm:text-base text-[#8e9192] mt-3 font-normal leading-relaxed">
          From academic institution minting to real-time employer screening, every credential transitions through four immutable, audit-ready states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div key={s.num} className="group bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-6 flex flex-col justify-between relative hover:border-[#ec6a06]/35 hover:shadow-[0_24px_48px_-12px_rgba(236,106,6,0.16)] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-8 h-8 rounded-full bg-white text-black text-xs font-semibold flex items-center justify-center group-hover:scale-110 transition-transform">
                  {s.num}
                </span>
                <span className="font-mono text-[10px] text-[#8e9192] px-2.5 py-1 rounded-full bg-[#18191a] border border-[#262829] group-hover:border-[#ec6a06]/40 transition-colors">
                  {s.tag}
                </span>
              </div>
              <h3 className="text-base font-medium text-white mb-2 tracking-tight">{s.title}</h3>
              <p className="text-xs text-[#8e9192] leading-relaxed">{s.desc}</p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-[#1e2021]">
              <span className="font-mono text-[10px] text-[#6b6e70] block uppercase tracking-wider">{s.footerLabel}</span>
              <span className={`font-mono text-[11px] font-medium ${s.footerClass}`}>{s.footerValue}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
