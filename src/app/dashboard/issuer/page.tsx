"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Plus, Search, CheckCircle, XCircle, FileText, Zap } from "lucide-react";
import { useState } from "react";

const issuedCerts = [
  { id: "SKP-2024-98421", recipient: "Alex Thorne", course: "Full-Stack Web3 & Solidity Architecture", date: "Aug 15, 2024", status: "VALID", tx: "0x89fa9b...ef29" },
  { id: "SKP-2024-41920", recipient: "Alex Thorne", course: "Zero-Knowledge Cryptography & zk-SNARKs", date: "Oct 2, 2024", status: "VALID", tx: "0x3a4b9c...a2b" },
  { id: "SKP-2024-11002", recipient: "Jonathan Drake", course: "Smart Contract Security Auditing", date: "Mar 10, 2024", status: "REVOKED", tx: "0x51c7b8...45" },
];

export default function IssuerDashboard() {
  const [search, setSearch] = useState("");
  const filtered = issuedCerts.filter(c =>
    c.recipient.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0b0c0d] text-[#e3e2e2] min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Issuer Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Dr. Marcus Vance</h1>
            <p className="text-[#8e9192] text-sm mt-1 font-mono">MetaCode Institute • Chief Certifier</p>
          </div>
          <Link href="/dashboard/issuer/issue" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#eaeaea] transition-all">
            <Plus className="w-4 h-4" /> Issue New Certificate
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Issued", value: "3" },
            { label: "Active", value: "2", green: true },
            { label: "Revoked", value: "1", red: true },
            { label: "Gas Used", value: "~427K" },
          ].map(s => (
            <div key={s.label} className="bg-[#121314]/90 border border-[#232525] rounded-2xl p-5">
              <span className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1">{s.label}</span>
              <span className={`text-2xl font-medium ${s.green ? "text-emerald-400" : s.red ? "text-[#ff7169]" : "text-white"}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* CSV Batch Mint Card */}
        <div className="bg-[#121314]/90 border border-[#ec6a06]/20 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#ec6a06]/10 border border-[#ec6a06]/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#ec6a06]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Batch CSV Minting Studio</h3>
              <p className="text-xs text-[#8e9192]">Upload a CSV to mint hundreds of certificates in a single smart contract transaction</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ec6a06]/40 bg-[#ec6a06]/10 text-[#ec6a06] text-xs font-medium hover:bg-[#ec6a06]/20 transition-all whitespace-nowrap">
            <FileText className="w-3.5 h-3.5" /> Upload CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#121314]/90 border border-[#232525] rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-[#232525] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-base font-medium text-white">Issued Certificates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#717476]" />
              <input
                className="pl-9 pr-4 py-2 bg-[#0a0a0b] border border-[#262829] rounded-full text-xs text-white placeholder-[#555] outline-none focus:border-white/40 w-56"
                placeholder="Search certificates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1e2021]">
                  {["Certificate ID", "Recipient", "Course", "Issued", "Status", "Tx Hash"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-[#1a1b1b] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-[#c4c7c8]">{c.id}</td>
                    <td className="px-5 py-4 text-white font-medium">{c.recipient}</td>
                    <td className="px-5 py-4 text-[#8e9192] max-w-[200px] truncate">{c.course}</td>
                    <td className="px-5 py-4 text-[#8e9192] font-mono">{c.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${c.status === "VALID" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#ff7169]/10 border-[#ff7169]/30 text-[#ff7169]"}`}>
                        {c.status === "VALID" ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#6b6e70]">{c.tx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
