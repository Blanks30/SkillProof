"use client";

import { useState } from "react";
import { Settings as SettingsIcon, ShieldCheck, Database, Cpu, Bell, Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SettingsPage() {
  const [network, setNetwork] = useState("polygonAmoy");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout activeRole="ISSUER">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure blockchain network connections, RPC parameters, and system alerts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl space-y-6 text-xs">
          {/* Blockchain Network */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              Target Blockchain Network
            </h3>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="polygonAmoy">Polygon Amoy Testnet (Chain ID 80002) - Recommended</option>
              <option value="localhost">Local Hardhat Node (http://127.0.0.1:8545)</option>
              <option value="sepolia">Ethereum Sepolia Testnet (Chain ID 11155111)</option>
            </select>
          </div>

          {/* RPC Endpoint */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Custom RPC Endpoint</label>
            <input
              type="text"
              defaultValue="https://rpc-amoy.polygon.technology"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {/* Smart Contract Registry Address */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Contract Registry Address</label>
            <input
              type="text"
              readOnly
              defaultValue="0x71C8F7A853245B11C194f48A141d6D33a0E821Db"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-2.5 text-xs text-slate-400 focus:outline-none font-mono"
            />
          </div>

          {/* Notification Alert Toggle */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div>
              <span className="font-semibold text-white block">Email Notifications for Issuance</span>
              <span className="text-slate-400 text-[11px]">Send automatic cryptographic receipt to students upon issuance</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              {saved ? "Settings Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
