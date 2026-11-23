"use client";
import { useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Status = "valid" | "revoked" | "not_found" | "idle";

const mockDB: Record<string, { status: Status; recipient: string; institution: string; course: string; block: string; date: string }> = {
  "SKP-2024-98421": { status: "valid", recipient: "Alex Thorne", institution: "MetaCode Institute of Blockchain & AI", course: "Full-Stack Web3 & Solidity Architecture", block: "1,845,210", date: "2024-08-15" },
  "SKP-2024-41920": { status: "valid", recipient: "Alex Thorne", institution: "Stanford Decentralized Technology Center", course: "Zero-Knowledge Cryptography & zk-SNARKs", block: "1,845,295", date: "2024-10-02" },
  "SKP-2024-11002": { status: "revoked", recipient: "Jonathan Drake", institution: "MetaCode Institute of Blockchain & AI", course: "Smart Contract Security Auditing", block: "1,845,340", date: "2024-03-10" },
  "SKP-2025-CS-8921": { status: "valid", recipient: "Alexandre V. Mercer", institution: "Stanford Web3 Lab", course: "Cryptographic Systems Design", block: "6,841,294", date: "2025-01-15" },
  "SKP-2024-ETH-0042": { status: "revoked", recipient: "Demo User", institution: "Demo Institution", course: "Ethereum Development", block: "6,839,112", date: "2024-06-01" },
};

function VerifyContent() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof mockDB[string] | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleVerify() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 600));
    const certId = input.trim().toUpperCase();
    const found = mockDB[certId];
    if (found) {
      setResult(found);
      setStatus(found.status);
    } else {
      setStatus("not_found");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#0b0c0d] text-[#e3e2e2] min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141515] border border-[#232525] text-white mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#a0a3a5]">Public Verification Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-4">Verify a Certificate</h1>
          <p className="text-[#8e9192] text-base max-w-lg mx-auto leading-relaxed">
            Enter a Certificate ID to instantly verify its authenticity against the Sepolia blockchain registry.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute -top-16 right-0 w-48 h-48 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717476] w-4 h-4" />
              <input
                className="w-full h-12 pl-11 pr-4 bg-[#0a0a0b] border border-[#262829] rounded-full font-mono text-sm text-white placeholder-[#5a5d5f] outline-none focus:border-white focus:shadow-[0_0_0_1px_rgba(249,115,22,0.4)] transition-all"
                placeholder="Enter Certificate ID (e.g. SKP-2024-98421)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerify()}
              />
            </div>
            <button
              className="h-12 px-6 rounded-full bg-white text-black text-xs font-semibold shadow-md hover:bg-[#eaeaea] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleVerify}
              disabled={loading || !input.trim()}
            >
              {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Querying..." : "Query Chain"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#717476]">Try:</span>
            {Object.keys(mockDB).slice(0, 4).map(id => (
              <button key={id} onClick={() => { setInput(id); }} className="px-2.5 py-1 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] font-mono text-[10px] hover:border-white/30 transition-colors">
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Result Card */}
        {status !== "idle" && !loading && (
          <div className={`rounded-3xl border p-8 transition-all ${
            status === "valid" ? "bg-[#0c1510] border-emerald-800/50" :
            status === "revoked" ? "bg-[#1e1214] border-[#481c20]" :
            "bg-[#121314] border-[#232525]"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              {status === "valid" && <CheckCircle className="w-10 h-10 text-emerald-400 flex-shrink-0" />}
              {status === "revoked" && <XCircle className="w-10 h-10 text-[#ff7169] flex-shrink-0" />}
              {status === "not_found" && <AlertCircle className="w-10 h-10 text-amber-400 flex-shrink-0" />}
              <div>
                <p className={`text-lg font-medium ${status === "valid" ? "text-emerald-400" : status === "revoked" ? "text-[#ff7169]" : "text-amber-400"}`}>
                  {status === "valid" ? "✓ Verified — Valid On-Chain Record" : status === "revoked" ? "✗ Revoked — Credential Invalidated" : "⚠ Not Found — No Blockchain Record"}
                </p>
                <p className="text-xs text-[#8e9192] mt-0.5 font-mono">Certificate ID: {input.trim().toUpperCase()}</p>
              </div>
            </div>
            {result && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#232525]">
                {[
                  { label: "Recipient", value: result.recipient },
                  { label: "Institution", value: result.institution },
                  { label: "Course / Skill", value: result.course },
                  { label: "Issue Date", value: result.date },
                  { label: "Block Number", value: result.block + " (Sepolia)" },
                  { label: "Network Status", value: status === "valid" ? "ACTIVE" : "REVOKED", color: status === "valid" ? "text-emerald-400" : "text-[#ff7169]" },
                ].map(f => (
                  <div key={f.label}>
                    <span className="font-mono text-[10px] text-[#6b6e70] block uppercase tracking-wider">{f.label}</span>
                    <span className={`font-medium text-sm ${(f as { color?: string }).color || "text-[#c4c7c8]"}`}>{f.value}</span>
                  </div>
                ))}
              </div>
            )}
            {status === "not_found" && (
              <p className="text-sm text-[#8e9192]">No certificate with this ID was found on the Sepolia blockchain registry. Double-check the ID or contact the issuing institution.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="bg-[#0b0c0d] min-h-screen" />}>
      <VerifyContent />
    </Suspense>
  );
}
