import Link from "next/link";
import { ShieldCheck, FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-6 border border-indigo-500/30">
        <FileQuestion className="h-8 w-8" />
      </div>

      <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
        Error 404
      </span>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        The requested resource or certificate page does not exist on the SkillProof registry.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
        >
          <Home className="h-4 w-4" /> Return to Home
        </Link>
        <Link
          href="/verify"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Verify a Certificate
        </Link>
      </div>
    </div>
  );
}
