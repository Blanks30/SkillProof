"use client";

import { Award, ShieldCheck, QrCode, ExternalLink, Calendar, CheckCircle2, AlertTriangle, Printer, Download } from "lucide-react";
import Image from "next/image";

interface CertificateTemplateProps {
  certificate: {
    certId: string;
    certHash: string;
    recipientName: string;
    courseOrSkill: string;
    projectTitle?: string | null;
    institutionName: string;
    issueDate: string | Date;
    certificateType?: string;
    description?: string | null;
    status: "VALID" | "REVOKED";
    blockchainTxHash?: string | null;
    blockNumber?: number | null;
    qrCodeData?: string | null;
    revocationReason?: string | null;
  };
  showActions?: boolean;
}

export function CertificateTemplate({ certificate, showActions = true }: CertificateTemplateProps) {
  const isRevoked = certificate.status === "REVOKED";
  const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons (hidden when printing) */}
      {showActions && (
        <div className="no-print flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            {isRevoked ? (
              <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                <AlertTriangle className="h-4 w-4" /> Certificate Officially Revoked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Cryptographically Verified On-Chain
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </button>
          </div>
        </div>
      )}

      {/* Certificate Frame */}
      <div className={`relative mx-auto max-w-4xl rounded-2xl border-4 ${isRevoked ? "border-red-900/60" : "border-indigo-900/40"} bg-gradient-to-b from-[#0b1020] via-[#080d19] to-[#0b1020] p-8 sm:p-12 shadow-2xl text-slate-100 overflow-hidden`}>
        {/* Watermark Pattern Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Ornate Inner Border */}
        <div className="relative rounded-xl border border-indigo-500/20 p-6 sm:p-10">
          {/* Revoked Banner Overlay */}
          {isRevoked && (
            <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-red-400">
                ⚠️ REVOKED CREDENTIAL
              </span>
              <p className="mt-1 text-xs text-red-300">
                Reason: {certificate.revocationReason || "Revoked by issuing authority"}
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white uppercase">{certificate.institutionName}</h3>
                <p className="text-xs text-indigo-400 font-medium">Official Blockchain Credential Registry</p>
              </div>
            </div>

            <div className="text-right">
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-indigo-300">
                ID: {certificate.certId}
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="my-8 text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Certificate of {certificate.certificateType || "Achievement"}
            </p>
            <p className="text-xs text-slate-400">This is proudly and verifiably conferred to</p>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif py-1 bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text">
              {certificate.recipientName}
            </h2>

            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              for successfully fulfilling all rigorous standards, requirements, and milestones in
            </p>

            <h4 className="text-lg sm:text-2xl font-bold text-indigo-300">
              {certificate.courseOrSkill}
            </h4>

            {certificate.projectTitle && (
              <p className="text-xs font-medium text-slate-300">
                Capstone Project: <span className="text-white italic">"{certificate.projectTitle}"</span>
              </p>
            )}

            {certificate.description && (
              <p className="text-xs text-slate-400 max-w-lg mx-auto italic">
                "{certificate.description}"
              </p>
            )}
          </div>

          {/* Certificate Footer: Signatures, QR Code & Hash Fingerprint */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              {/* Issuance Date & Authority */}
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[11px] font-medium uppercase text-slate-500">Conferred Date</p>
                <p className="text-xs font-semibold text-slate-200">{formattedDate}</p>
                <div className="mt-4 pt-2 border-t border-slate-800 w-36 mx-auto sm:mx-0">
                  <p className="text-[10px] text-slate-400 font-serif italic">Authorized Academic Registrar</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                {certificate.qrCodeData ? (
                  <div className="rounded-lg bg-white p-2 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={certificate.qrCodeData}
                      alt="Verification QR Code"
                      className="h-20 w-20"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                    <QrCode className="h-8 w-8 text-slate-500" />
                  </div>
                )}
                <span className="mt-1 text-[9px] uppercase tracking-wider text-slate-500">Scan to Verify</span>
              </div>

              {/* Blockchain Record Info */}
              <div className="space-y-1 text-center sm:text-right">
                <p className="text-[11px] font-medium uppercase text-slate-500">Polygon Blockchain Registry</p>
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <ShieldCheck className="h-3 w-3" /> Polygon Amoy
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-mono break-all">
                  Hash: {certificate.certHash ? `${certificate.certHash.slice(0, 10)}...${certificate.certHash.slice(-8)}` : "Verified"}
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Bar */}
            <div className="mt-6 rounded-lg bg-slate-900/80 border border-slate-800/80 p-2.5 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Cryptographic SHA-256 Digest:
              </span>
              <p className="font-mono text-[10px] text-indigo-300/90 break-all select-all">
                {certificate.certHash}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
