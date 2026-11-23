"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Award,
  PlusCircle,
  FileSearch,
  Users,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { WalletConnectButton } from "./WalletConnectButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: "ADMIN" | "ISSUER" | "STUDENT";
}

export function DashboardLayout({ children, activeRole }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({
    name: "Alex Thorne",
    email: "student@skillproof.io",
    role: activeRole,
  });

  useEffect(() => {
    const stored = localStorage.getItem("skillproof_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
      } catch (e) {}
    } else {
      // Map demo user matching active role
      if (activeRole === "ADMIN") {
        setCurrentUser({
          name: "Elena Rostova (Admin)",
          email: "admin@skillproof.io",
          role: "ADMIN",
        });
      } else if (activeRole === "ISSUER") {
        setCurrentUser({
          name: "Dr. Marcus Vance",
          email: "issuer@skillproof.io",
          role: "ISSUER",
          institutionName: "MetaCode Institute",
        });
      } else {
        setCurrentUser({
          name: "Alex Thorne",
          email: "student@skillproof.io",
          role: "STUDENT",
        });
      }
    }
  }, [activeRole]);

  const switchRole = (newRole: "ADMIN" | "ISSUER" | "STUDENT") => {
    let userData = {
      name: "Alex Thorne",
      email: "student@skillproof.io",
      role: newRole,
    };
    if (newRole === "ADMIN") {
      userData = {
        name: "Elena Rostova (Admin)",
        email: "admin@skillproof.io",
        role: "ADMIN",
      };
      localStorage.setItem("skillproof_user", JSON.stringify(userData));
      router.push("/dashboard/admin");
    } else if (newRole === "ISSUER") {
      userData = {
        name: "Dr. Marcus Vance",
        email: "issuer@skillproof.io",
        role: "ISSUER",
      };
      localStorage.setItem("skillproof_user", JSON.stringify(userData));
      router.push("/dashboard/issuer");
    } else {
      localStorage.setItem("skillproof_user", JSON.stringify(userData));
      router.push("/dashboard/student");
    }
    setCurrentUser(userData);
  };

  const navItems = [
    {
      label: "Overview",
      href: `/dashboard/${activeRole.toLowerCase()}`,
      icon: LayoutDashboard,
      roles: ["ADMIN", "ISSUER", "STUDENT"],
    },
    {
      label: "Issue Certificate",
      href: "/dashboard/issuer/issue",
      icon: PlusCircle,
      roles: ["ISSUER", "ADMIN"],
    },
    {
      label: "My Certificates",
      href: "/dashboard/student",
      icon: Award,
      roles: ["STUDENT"],
    },
    {
      label: "Issuers Management",
      href: "/dashboard/admin",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      label: "Public Verifier",
      href: "/verify",
      icon: FileSearch,
      roles: ["ADMIN", "ISSUER", "STUDENT"],
    },
    {
      label: "User Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["ADMIN", "ISSUER", "STUDENT"],
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["ADMIN", "ISSUER", "STUDENT"],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800/80 bg-[#0a0f1d] lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              Skill<span className="text-indigo-400">Proof</span>
            </Link>
          </div>
        </div>

        {/* Role Banner Switcher */}
        <div className="p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-400">Active Role</span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                {activeRole}
              </span>
            </div>
            <p className="mt-1 truncate text-xs font-semibold text-white">{currentUser.name}</p>
            <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>

            {/* Quick Demo Switchers */}
            <div className="mt-3 border-t border-slate-800 pt-2">
              <span className="text-[10px] text-slate-400 block mb-1">Switch Demo Perspective:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => switchRole("ADMIN")}
                  className={`rounded px-1.5 py-1 text-[10px] font-medium transition-colors ${
                    activeRole === "ADMIN" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => switchRole("ISSUER")}
                  className={`rounded px-1.5 py-1 text-[10px] font-medium transition-colors ${
                    activeRole === "ISSUER" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Issuer
                </button>
                <button
                  onClick={() => switchRole("STUDENT")}
                  className={`rounded px-1.5 py-1 text-[10px] font-medium transition-colors ${
                    activeRole === "STUDENT" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-2">
          {navItems
            .filter((item) => item.roles.includes(activeRole))
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Blockchain Node Status */}
        <div className="m-4 rounded-xl border border-slate-800/80 bg-[#070b14] p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Network</span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Polygon Amoy
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Contract Status</span>
            <span className="text-slate-300 font-mono">Synchronized</span>
          </div>
        </div>

        {/* Footer logout / back */}
        <div className="border-t border-slate-800 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0a0f1d]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-white">SkillProof</span>
            </Link>
            <h1 className="text-sm font-semibold capitalize text-slate-200 hidden sm:block">
              {activeRole.toLowerCase()} Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <WalletConnectButton />
            <Link
              href="/verify"
              className="hidden sm:flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
            >
              <FileSearch className="h-3.5 w-3.5" /> Verify
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
