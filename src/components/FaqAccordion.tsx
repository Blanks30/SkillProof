"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How much does it cost to issue certificates on Ethereum?",
    a: "SkillProof smart contracts utilize optimized batch state commitments. On Ethereum Layer 2 rollups (such as Arbitrum or Base) or testnets like Sepolia, issuing a certificate batch costs less than $0.005 per credential. Students and employers never pay gas fees to verify.",
  },
  {
    q: "Is sensitive student personal data stored publicly on the blockchain?",
    a: "No. SkillProof respects strict privacy guidelines (GDPR & FERPA). Only irreversible cryptographic hashes (SHA-256) and verifiable digital signatures are committed to the public ledger. Sensitive academic records remain encrypted within decentralized storage nodes.",
  },
  {
    q: "Can an academic institution revoke a fraudulent or erroneous credential?",
    a: "Yes. Only the authorized multi-signature wallet of the original issuing authority retains administrative permission to execute a revokeCertificate(bytes32 certHash) smart contract transaction. Revoked credentials immediately return an invalid status across the network.",
  },
  {
    q: "How do employers integrate SkillProof into their ATS?",
    a: "We provide a lightweight REST API and an open-source TypeScript SDK. Recruiters can plug our zero-knowledge verification endpoint directly into Greenhouse, Lever, or custom job application intake portals without managing Web3 wallets.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="w-full bg-[#0d0e0f] border-t border-[#1b1c1c] py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Technical Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#121314] border border-[#232525] rounded-2xl overflow-hidden transition-colors hover:border-[#383a3b]">
              <button
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm sm:text-base font-normal text-white">{f.q}</span>
                <svg
                  className={`w-5 h-5 text-[#717476] flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-xs sm:text-sm text-[#8e9192] leading-relaxed font-light">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
