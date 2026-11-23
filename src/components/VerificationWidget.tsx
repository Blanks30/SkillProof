"use client";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

type VerifyState = "valid" | "revoked" | "idle";

export default function VerificationWidget() {
  const [input, setInput] = useState("SKP-2025-CS-8921");
  const [state, setState] = useState<VerifyState>("valid");

  function verify(id: string) {
    if (id.includes("0042") || id.toLowerCase().includes("revoked")) {
      setState("revoked");
    } else if (id.trim().length > 3) {
      setState("valid");
    } else {
      setState("idle");
    }
  }

  return (
    <section className="w-full bg-[#0d0e0f] border-y border-[#1b1c1c] py-20" id="quick-verify">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-[#121314]/90 backdrop-blur-md border border-[#232525] border-t-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 right-0 w-64 h-64 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18191a] border border-[#262829] text-xs mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#929699]">Live Sandbox Demo</span>
              </div>
              <h3 className="text-xl font-medium text-white">Instant Certificate Verification Widget</h3>
            </div>
            <span className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> RPC Synced
            </span>
          </div>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717476] w-4 h-4" />
              <input
                className="w-full h-12 pl-11 pr-4 bg-[#0a0a0b] border border-[#262829] rounded-full font-mono text-xs text-white placeholder-[#5a5d5f] outline-none focus:border-white transition-colors focus:shadow-[0_0_0_1px_rgba(249,115,22,0.4)]"
                placeholder="Enter Certificate ID (e.g. SKP-2025-CS-8921)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verify(input)}
              />
            </div>
            <button
              className="h-12 px-6 rounded-full bg-white text-black text-xs font-semibold tracking-tight shadow-md hover:bg-[#eaeaea] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              onClick={() => verify(input)}
            >
              Query Chain <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <span className="text-xs text-[#717476]">Test Presets:</span>
            <button
              className="px-3 py-1 rounded-full bg-[#18191a] border border-[#262829] text-[#c4c7c8] font-mono text-[11px] hover:border-[#383a3b] hover:text-white hover:scale-105 transition-all"
              onClick={() => { setInput("SKP-2025-CS-8921"); verify("SKP-2025-CS-8921"); }}
            >
              ✓ Valid (SKP-2025-CS-8921)
            </button>
            <button
              className="px-3 py-1 rounded-full bg-[#231517] border border-[#3e1b1f] text-[#ff9994] font-mono text-[11px] hover:border-[#5a242a] hover:scale-105 transition-all"
              onClick={() => { setInput("SKP-2024-ETH-0042"); verify("SKP-2024-ETH-0042"); }}
            >
              ✗ Revoked (SKP-2024-ETH-0042)
            </button>
          </div>

          {/* Result */}
          {state !== "idle" && (
            <div className={`mt-6 p-5 rounded-2xl border transition-all ${state === "valid" ? "bg-[#0a0a0b] border-[#232525]" : "bg-[#1e1214] border-[#481c20]"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${state === "valid" ? "bg-[#141516] border-[#232525] text-emerald-400" : "bg-[#1e1214] border-[#481c20] text-[#ff7169]"}`}>
                    {state === "valid"
                      ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10"/></svg>
                      : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                    }
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${state === "valid" ? "text-white" : "text-[#ff7169]"}`}>
                      {state === "valid" ? "Status: 200 OK — Valid On-Chain Record" : "Status: 410 REVOKED — Invalidation Logged On-Chain"}
                    </p>
                    <p className="text-xs text-[#8e9192]">
                      {state === "valid" ? "Recipient: Alexandre V. Mercer • Stanford Web3 Lab" : "Subject: Identity Revocation Executed by Issuer Private Key"}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1f2122]">
                  <span className="font-mono text-[10px] text-[#717476] block">
                    {state === "valid" ? "Block #6,841,294 (Sepolia)" : "Tx: 0x90fa3...10b4 (Revoked at Block #6,839,112)"}
                  </span>
                  <span className={`text-xs font-medium ${state === "valid" ? "text-emerald-400" : "text-[#ff7169]"}`}>
                    {state === "valid" ? "Authenticity 100% Guaranteed" : "Revocation Reason: Academic Dishonesty Report"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
