"use client";

import Link from "next/link";
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, QrCode, FileText } from "lucide-react";

interface CertificateCardProps {
  certificate: {
    id: string;
    certId: string;
    certHash: string;
    recipientName: string;
    courseOrSkill: string;
    projectTitle?: string | null;
    institutionName: string;
    issueDate: string | Date;
    status: "VALID" | "REVOKED";
    blockchainTxHash?: string | null;
    qrCodeData?: string | null;
  };
  onRevokeClick?: (certId: string) => void;
  showRevokeAction?: boolean;
}

export function CertificateCard({ certificate, onRevokeClick, showRevokeAction = false }: CertificateCardProps) {
  const isRevoked = certificate.status === "REVOKED";
  const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={`relative flex flex-col justify-between rounded-xl border ${isRevoked ? "border-red-900/40 bg-red-950/10" : "border-slate-800/80 bg-slate-900/40"} p-5 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-indigo-400">
            {certificate.certId}
          </span>
          {isRevoked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-red-400">
              <AlertTriangle className="h-3 w-3" /> Revoked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold text-white group-hover:text-indigo-300">
          {certificate.courseOrSkill}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{certificate.institutionName}</p>

        {certificate.projectTitle && (
          <p className="mt-2 text-xs text-slate-300 italic">
            Project: "{certificate.projectTitle}"
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <span>Recipient: <strong className="text-slate-200">{certificate.recipientName}</strong></span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
        <Link
          href={`/certificate/${certificate.certId}`}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <FileText className="h-3.5 w-3.5" /> View Certificate
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/verify?id=${certificate.certId}`}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Verify
          </Link>

          {showRevokeAction && !isRevoked && onRevokeClick && (
            <button
              onClick={() => onRevokeClick(certificate.certId)}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/20"
            >
              Revoke
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
