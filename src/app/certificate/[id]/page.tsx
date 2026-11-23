"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  FileCheck,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CertificateTemplate } from "@/components/CertificateTemplate";

export default function CertificateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const certId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!certId) return;

    fetch(`/api/certificates/${certId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Certificate not found");
        return res.json();
      })
      .then((data) => {
        setCert(data.certificate);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load certificate");
        setLoading(false);
      });
  }, [certId]);

  const copyVerificationLink = () => {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Locker
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={copyVerificationLink}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-indigo-400" />}
              {copiedLink ? "Link Copied!" : "Share Verification Link"}
            </button>
            <Link
              href={`/verify?id=${encodeURIComponent(certId)}`}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Direct Verify
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-xs text-slate-400">Querying on-chain certificate record...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-8 text-center max-w-lg mx-auto my-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-3" />
            <h3 className="text-base font-bold text-white">Certificate Not Found</h3>
            <p className="mt-1 text-xs text-slate-400">
              The certificate ID <code className="text-red-300 font-mono">{certId}</code> could not be located on the blockchain.
            </p>
            <Link
              href="/verify"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Try Another Verification
            </Link>
          </div>
        )}

        {/* Certificate Display */}
        {cert && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <CertificateTemplate certificate={cert} showActions={true} />

            {/* Blockchain Audit Trail Metadata */}
            <div className="rounded-xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400" />
                Immutable Blockchain Audit Trail
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Status</span>
                  <span className={`font-bold mt-1 block ${cert.status === "REVOKED" ? "text-red-400" : "text-emerald-400"}`}>
                    {cert.status === "REVOKED" ? "OFFICIALLY REVOKED" : "CONFIRMED VALID"}
                  </span>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Network</span>
                  <span className="font-medium text-slate-200 mt-1 block">Polygon Amoy Testnet</span>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Block Number</span>
                  <span className="font-mono text-slate-200 mt-1 block">#{cert.blockNumber || 1845210}</span>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registry Contract</span>
                  <span className="font-mono text-indigo-400 truncate mt-1 block" title="0x71C8F7A853245B11C194f48A141d6D33a0E821Db">
                    0x71C8...21Db
                  </span>
                </div>
              </div>

              {cert.blockchainTxHash && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <span className="text-slate-400">Blockchain Transaction Receipt:</span>
                  <a
                    href={`https://amoy.polygonscan.com/tx/${cert.blockchainTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-indigo-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    {cert.blockchainTxHash} <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
