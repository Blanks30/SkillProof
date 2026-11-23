import Link from "next/link";
import { ShieldCheck, Award, Lock, Cpu, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-4">
            <Award className="h-4 w-4 text-indigo-400" />
            Empowering Verifiable Human Achievement
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About SkillProof
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            SkillProof was born out of a critical problem in the digital economy: traditional paper and PDF certificates are trivially forgeable, difficult to verify, and burdened by manual institutional bureaucracy.
          </p>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8">
            <h3 className="text-lg font-bold text-red-400 mb-3">The Traditional Challenge</h3>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              Over 50% of resumes contain exaggerated credentials, and forged diplomas cost corporations and academic institutions billions in fraud and time-consuming manual registrar checks. Static PDFs can be easily altered with simple image editing tools.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-8">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">The SkillProof Solution</h3>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              By registering immutable cryptographic SHA-256 fingerprints on Ethereum-compatible Polygon smart contracts, SkillProof transforms any skill badge or capstone diploma into a tamper-evident credential verifiable in milliseconds.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 sm:p-10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Our Core Architectural Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Privacy by Design</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No personal contact details or private IDs are stored openly on public ledgers. Only cryptographic hashes are recorded.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white">EVM Composability</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built with Solidity 0.8.20 and OpenZeppelin security primitives on Polygon Amoy for fast block times and low transaction fees.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Trustless Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Public verifiers require no platform subscriptions, login accounts, or centralized gatekeepers to confirm validity.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            Verify a Certificate Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
