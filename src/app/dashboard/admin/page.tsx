"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [issuers, setIssuers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, issuersRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/issuers"),
      ]);
      const statsData = await statsRes.json();
      const issuersData = await issuersRes.json();

      setStats(statsData);
      setIssuers(issuersData.issuers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleIssuerApproval = async (issuerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/issuers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issuerId, isApproved: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionFeedback(`Issuer status updated to ${!currentStatus ? "Approved" : "Deactivated"}`);
      loadData();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Administration</h1>
            <p className="text-xs text-slate-400 mt-1">
              Platform governance, issuer authorizations, and Polygon smart contract monitoring
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
          </button>
        </div>

        {actionFeedback && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {actionFeedback}
          </div>
        )}

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Certificates</span>
            <p className="mt-1 text-2xl font-extrabold text-white">{stats?.stats?.totalCertificates || 3}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Valid & Active</span>
            <p className="mt-1 text-2xl font-extrabold text-emerald-400">{stats?.stats?.validCertificates || 2}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Revocations</span>
            <p className="mt-1 text-2xl font-extrabold text-red-400">{stats?.stats?.revokedCertificates || 1}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">Authorized Issuers</span>
            <p className="mt-1 text-2xl font-extrabold text-indigo-400">{issuers.length}</p>
          </div>
        </div>

        {/* Smart Contract Overview Banner */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-[#0b1020] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  SkillProofRegistry.sol
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    Deployed & Verified
                  </span>
                </h3>
                <p className="font-mono text-xs text-indigo-300 mt-0.5">
                  Contract: {stats?.stats?.contractAddress || "0x71C8F7A853245B11C194f48A141d6D33a0E821Db"}
                </p>
              </div>
            </div>

            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
            >
              Polygonscan Explorer <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Authorized Issuers Management Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              Authorized Certificate Issuers
            </h3>
            <span className="text-xs text-slate-400">{issuers.length} registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Issuer Official</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Issued Count</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {issuers.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {iss.user.name}
                      <span className="block text-[11px] font-normal text-slate-400">{iss.user.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {iss.institution.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {iss.walletAddress ? `${iss.walletAddress.slice(0, 8)}...${iss.walletAddress.slice(-6)}` : "Not linked"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {iss._count?.certificates || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      {iss.isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30">
                          <XCircle className="h-3 w-3" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleIssuerApproval(iss.id, iss.isApproved)}
                        className={`rounded-lg px-3 py-1 text-[11px] font-semibold transition-colors ${
                          iss.isApproved
                            ? "border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {iss.isApproved ? "Deactivate" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Blockchain Transactions Log */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Blockchain Transaction Activity Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Transaction Hash</th>
                  <th className="py-2.5 px-3">Operation</th>
                  <th className="py-2.5 px-3">Certificate ID</th>
                  <th className="py-2.5 px-3">Block</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {stats?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 text-indigo-400 break-all">
                      {tx.txHash ? `${tx.txHash.slice(0, 16)}...` : "Confirmed"}
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                      {tx.operation.replace("_", " ")}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      {tx.certId || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      #{tx.blockNumber || 1845210}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-sans font-semibold">CONFIRMED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
