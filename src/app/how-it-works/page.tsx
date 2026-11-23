import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Binary,
  Layers,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Authorized Institution Signs In",
      desc: "Accredited institutions, universities, or tech bootcamps connect their authorized Web3 wallet or corporate SSO to access the Issuer Workspace.",
      icon: Lock,
    },
    {
      step: "02",
      title: "Credential Generation & Hash Computation",
      desc: "The issuer enters student achievement metadata (recipient name, project title, course completion date). SkillProof canonicalizes the payload and calculates an immutable SHA-256 cryptographic digest.",
      icon: Binary,
    },
    {
      step: "03",
      title: "Smart Contract Registration (Polygon Amoy)",
      desc: "The certificate hash and unique ID (e.g. SKP-2024-XXXXX) are written to `SkillProofRegistry.sol` via an on-chain transaction. Once mined, it is permanently tamper-proof.",
      icon: Layers,
    },
    {
      step: "04",
      title: "QR Code & Digital Credential Conferred",
      desc: "The recipient receives a secure digital certificate equipped with a high-density QR code pointing directly to the verification endpoint.",
      icon: QrCode,
    },
    {
      step: "05",
      title: "Instant Public Verification",
      desc: "Employers or verifiers scan the QR code, search the Certificate ID, or upload the certificate document. The system compares the file's hash against the on-chain registry in seconds.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Cryptographic Integrity Pipeline
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
            How SkillProof Verification Works
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            A step-by-step breakdown of how cryptographic proofs eliminate certificate fraud on the blockchain.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/30 transition-colors shadow-lg">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl transition-all hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-400">STEP {s.step}</span>
                  </div>
                  <h3 className="mt-2 text-base sm:text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Comparison Card */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-[#090d18] p-8">
          <h3 className="text-lg font-bold text-white mb-4">On-Chain vs Off-Chain Data Segregation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4" /> On-Chain (Polygon Smart Contract)
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>• Certificate Unique ID (SKP-XXXX)</li>
                <li>• SHA-256 Cryptographic Hash (bytes32)</li>
                <li>• Authorized Issuer Wallet Address</li>
                <li>• Recipient Name & Course Title</li>
                <li>• Issuance Timestamp (uint256)</li>
                <li>• Revocation Flag & Timestamp</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" /> Off-Chain (Prisma Database & IPFS)
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>• High-resolution Certificate PDF & IPFS CID</li>
                <li>• Recipient Private Email (Optional)</li>
                <li>• Detailed Project Descriptions & Syllabi</li>
                <li>• QR Code PNG Image Blobs</li>
                <li>• Audit Trail Logs & Institution Profiles</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            Try Verifying a Sample Credential <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
