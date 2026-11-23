"use client";

import { useState, useEffect } from "react";
import { User, ShieldCheck, Mail, Wallet, Key, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ProfilePage() {
  const [user, setUser] = useState<any>({
    name: "Alex Thorne",
    email: "student@skillproof.io",
    role: "STUDENT",
    walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  });

  useEffect(() => {
    const stored = localStorage.getItem("skillproof_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  return (
    <DashboardLayout activeRole={user.role || "STUDENT"}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Profile & Identity</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account identity, role credentials, and linked Web3 wallet
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">
              {user.name ? user.name[0] : "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="inline-block mt-2 rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                Role: {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registered Email</span>
              <span className="font-semibold text-white mt-1 block">{user.email}</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Linked Wallet</span>
              <span className="font-mono text-indigo-300 mt-1 block break-all text-[11px]">
                {user.walletAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Network Affinity</span>
              <span className="text-emerald-400 font-semibold mt-1 block">Polygon Amoy Testnet (80002)</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Account State</span>
              <span className="text-slate-200 font-semibold mt-1 block flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Active & Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
