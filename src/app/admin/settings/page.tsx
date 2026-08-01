import { Key, Server, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
          <Settings className="h-7 w-7 text-[var(--teal)]" /> Settings & Integrations
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Manage system configurations, environment settings, and API authentication.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-[var(--navy)] flex items-center gap-2">
            <Server className="h-5 w-5 text-[var(--teal)]" /> Environment & Database Connection
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
            <div className="flex flex-col gap-1 rounded-xl bg-[#FAF7F0] p-3 border border-[rgba(18,58,90,0.08)]">
              <span className="font-bold text-[var(--navy)]">Database Provider</span>
              <span className="font-semibold text-[rgba(23,50,74,0.8)]">Vercel Postgres (Supabase Pooler)</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl bg-[#FAF7F0] p-3 border border-[rgba(18,58,90,0.08)]">
              <span className="font-bold text-[var(--navy)]">ORM & Driver</span>
              <span className="font-semibold text-[rgba(23,50,74,0.8)]">Drizzle ORM (vercel-postgres driver)</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-[var(--navy)] flex items-center gap-2">
            <Key className="h-5 w-5 text-[var(--gold)]" /> OAuth & Better Auth Providers
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
            <div className="flex flex-col gap-1 rounded-xl bg-[#FAF7F0] p-3 border border-[rgba(18,58,90,0.08)]">
              <span className="font-bold text-[var(--navy)]">GitHub OAuth</span>
              <span className="font-semibold text-emerald-700 font-bold">Configured & Active</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl bg-[#FAF7F0] p-3 border border-[rgba(18,58,90,0.08)]">
              <span className="font-bold text-[var(--navy)]">Better Auth Secret</span>
              <span className="font-semibold text-emerald-700 font-bold">Configured in .env</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
