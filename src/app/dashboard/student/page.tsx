"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Download, ExternalLink, Share2, CheckCircle, XCircle, Shield } from "lucide-react";

const certs = [
  {
    id: "SKP-2024-98421", course: "Full-Stack Web3 & Solidity Architecture", institution: "MetaCode Institute of Blockchain & AI",
    type: "Course Completion", date: "Aug 15, 2024", status: "VALID", block: "1,845,210",
    hash: "0x89fa9b...ef29", ipfs: "bafybeig...di",
  },
  {
    id: "SKP-2024-41920", course: "Zero-Knowledge Cryptography & zk-SNARKs", institution: "Stanford Decentralized Technology Center",
    type: "Skill Badge", date: "Oct 2, 2024", status: "VALID", block: "1,845,295",
    hash: "0x3a4b9c...a2b", ipfs: "bafybeihi...2j",
  },
];

export default function StudentDashboard() {
  return (
    <div className="bg-[#0b0c0d] text-[#e3e2e2] min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Student Credential Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Alex Thorne</h1>
            <p className="text-[#8e9192] text-sm mt-1 font-mono">0x3C44CdDdB6...93BC • 2 credentials on-chain</p>
          </div>
          <Link href="/verify" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#eaeaea] transition-all">
            <Shield className="w-4 h-4" /> Verify My Certificate
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Credentials", value: "2", accent: false },
            { label: "On-Chain Verified", value: "2", accent: true },
            { label: "IPFS Pinned", value: "2", accent: false },
            { label: "ERC-5192 Soulbound", value: "Yes", accent: false },
          ].map(s => (
            <div key={s.label} className="bg-[#121314]/90 border border-[#232525] rounded-2xl p-5">
              <span className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1">{s.label}</span>
              <span className={`text-2xl font-medium ${s.accent ? "text-emerald-400" : "text-white"}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Certificates Grid */}
        <h2 className="text-lg font-medium text-white mb-5 tracking-tight">My Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(c => (
            <div key={c.id} className="group bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-6 hover:border-[#ec6a06]/35 hover:shadow-[0_16px_40px_-12px_rgba(236,106,6,0.14)] transition-all duration-300">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[#8e9192] px-2.5 py-1 rounded-full bg-[#18191a] border border-[#262829]">{c.type}</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  <CheckCircle className="w-3 h-3" /> {c.status}
                </span>
              </div>
              <h3 className="text-base font-medium text-white mb-1 tracking-tight">{c.course}</h3>
              <p className="text-xs text-[#8e9192] mb-4">{c.institution}</p>
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div><span className="text-[#6b6e70] font-mono uppercase text-[9px] block">Issue Date</span><span className="text-[#c4c7c8]">{c.date}</span></div>
                <div><span className="text-[#6b6e70] font-mono uppercase text-[9px] block">Block</span><span className="text-[#c4c7c8] font-mono">#{c.block}</span></div>
                <div><span className="text-[#6b6e70] font-mono uppercase text-[9px] block">Cert ID</span><span className="text-[#c4c7c8] font-mono">{c.id}</span></div>
                <div><span className="text-[#6b6e70] font-mono uppercase text-[9px] block">IPFS CID</span><span className="text-[#c4c7c8] font-mono truncate block">{c.ipfs}</span></div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-[#1e2021]">
                <Link href={`/verify?id=${c.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] text-[11px] hover:border-white/30 hover:text-white transition-all">
                  <ExternalLink className="w-3 h-3" /> Verify
                </Link>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] text-[11px] hover:border-white/30 hover:text-white transition-all">
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] text-[11px] hover:border-white/30 hover:text-white transition-all">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
