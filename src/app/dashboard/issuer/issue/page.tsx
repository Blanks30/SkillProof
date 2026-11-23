"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { Upload, Zap, CheckCircle, XCircle } from "lucide-react";

type Field = { label: string; name: string; type: string; placeholder: string };

const fields: Field[] = [
  { label: "Recipient Name", name: "name", type: "text", placeholder: "e.g. Alex Thorne" },
  { label: "Recipient Email", name: "email", type: "email", placeholder: "alex@example.com" },
  { label: "Institution / Organization", name: "institution", type: "text", placeholder: "Stanford Web3 Lab" },
  { label: "Course or Skill", name: "course", type: "text", placeholder: "Full-Stack Web3 & Solidity" },
  { label: "Project Title (optional)", name: "project", type: "text", placeholder: "DeFi Yield Aggregator Protocol" },
  { label: "Issue Date", name: "date", type: "date", placeholder: "" },
];

export default function IssuerIssuePage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-[#0b0c0d] text-[#e3e2e2] min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Certificate Minting Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Issue New Certificate</h1>
          <p className="text-[#8e9192] text-sm mt-2">Fill in the details below. A SHA-256 hash will be generated and recorded on Sepolia.</p>
        </div>

        {submitted ? (
          <div className="bg-[#0c1510] border border-emerald-800/50 rounded-3xl p-10 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Certificate Issued Successfully!</h2>
            <p className="text-[#8e9192] text-sm mb-6">The credential has been hashed and recorded on the Sepolia blockchain registry.</p>
            <div className="bg-[#0a0a0b] border border-[#232525] rounded-2xl p-4 text-left mb-6">
              <span className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1">Generated Certificate ID</span>
              <span className="font-mono text-sm text-emerald-400">SKP-2025-{Math.random().toString(36).slice(2, 7).toUpperCase()}</span>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSubmitted(false)} className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#eaeaea] transition-all">
                Issue Another
              </button>
              <Link href="/dashboard/issuer" className="px-5 py-2.5 rounded-full bg-[#18191a] border border-[#262829] text-white text-xs hover:border-white/30 transition-all">
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-8 space-y-5">
            {fields.map(f => (
              <div key={f.name}>
                <label className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  required={f.name !== "project"}
                  className="w-full h-11 px-4 bg-[#0a0a0b] border border-[#262829] rounded-xl text-sm text-white placeholder-[#555] outline-none focus:border-white focus:shadow-[0_0_0_1px_rgba(249,115,22,0.3)] transition-all"
                  value={form[f.name] || ""}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                />
              </div>
            ))}

            {/* Certificate Type */}
            <div>
              <label className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1.5">Certificate Type</label>
              <select className="w-full h-11 px-4 bg-[#0a0a0b] border border-[#262829] rounded-xl text-sm text-white outline-none focus:border-white transition-all"
                value={form.type || "Course Completion"}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {["Course Completion", "Skill Badge", "Project Capstone", "Degree"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="font-mono text-[10px] text-[#6b6e70] uppercase tracking-wider block mb-1.5">Certificate PDF (optional)</label>
              <div className="border border-dashed border-[#333] rounded-xl p-6 text-center hover:border-[#ec6a06]/40 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-[#555] mx-auto mb-2" />
                <p className="text-xs text-[#8e9192]">Drag & drop PDF or <span className="text-white underline">browse</span></p>
                <p className="text-[10px] text-[#555] mt-1 font-mono">Max 5MB • PDF only</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#eaeaea] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Minting on-chain...</>
              ) : (
                <><Zap className="w-4 h-4" /> Mint & Record on Blockchain</>
              )}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
