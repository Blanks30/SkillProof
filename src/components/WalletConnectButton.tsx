"use client";

import { useState, useEffect } from "react";
import { Wallet, CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";

export function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if MetaMask or ethereum provider exists and has accounts
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    if (!(window as any).ethereum) {
      alert("MetaMask or Web3 wallet extension not detected. Using simulated on-chain ledger.");
      setWalletAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      return;
    }

    try {
      setConnecting(true);
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err: any) {
      console.warn("User rejected wallet connection:", err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  if (walletAddress) {
    const truncated = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-mono">{truncated}</span>
        <button
          onClick={disconnectWallet}
          title="Disconnect wallet"
          className="ml-1 text-slate-400 hover:text-white"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={connecting}
      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
    >
      <Wallet className="h-3.5 w-3.5 text-indigo-400" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
