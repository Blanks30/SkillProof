"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, Wallet, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: "STUDENT",
      label: "Alex Thorne (Student)",
      email: "student@skillproof.io",
      target: "/dashboard/student",
      badge: "Learner Locker",
    },
    {
      role: "ISSUER",
      label: "Dr. Marcus Vance (Issuer)",
      email: "issuer@skillproof.io",
      target: "/dashboard/issuer",
      badge: "MetaCode Institute",
    },
    {
      role: "ADMIN",
      label: "Elena Rostova (Admin)",
      email: "admin@skillproof.io",
      target: "/dashboard/admin",
      badge: "System Governance",
    },
  ];

  const handleDemoLogin = (acc: (typeof demoAccounts)[0]) => {
    const userObj = {
      name: acc.label.split(" (")[0],
      email: acc.email,
      role: acc.role,
    };
    localStorage.setItem("skillproof_user", JSON.stringify(userObj));
    router.push(acc.target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "student@skillproof.io" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("skillproof_user", JSON.stringify(data.user));
      if (data.user.role === "ADMIN") router.push("/dashboard/admin");
      else if (data.user.role === "ISSUER") router.push("/dashboard/issuer");
      else router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0b1020] p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30 mb-3">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to SkillProof</h1>
            <p className="mt-1 text-xs text-slate-400">
              Access your credential locker, issuance portal, or admin console
            </p>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              1-Click Instant Demo Access:
            </div>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleDemoLogin(acc)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:border-indigo-500/40 transition-colors"
                >
                  <span className="font-semibold">{acc.label}</span>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-[#0b1020] px-2 text-[11px] text-slate-500 uppercase">
              Or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 p-2 rounded-lg border border-red-500/30">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
