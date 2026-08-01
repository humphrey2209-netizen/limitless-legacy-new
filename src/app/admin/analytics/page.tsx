import { BarChart3, Eye, TrendingUp, Users } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-[var(--teal)]" /> Analytics & Reports
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Track assessment completion rates, popular packages, and visitor traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[var(--teal)] uppercase tracking-wider">
              Total Page Views
            </span>
            <Eye className="h-4 w-4 text-[var(--navy)]" />
          </div>
          <p className="mt-3 text-2xl font-black text-[var(--navy)]">24,910</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +18% this month
          </span>
        </div>

        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[var(--teal)] uppercase tracking-wider">
              Assessment Conversion
            </span>
            <BarChart3 className="h-4 w-4 text-[var(--navy)]" />
          </div>
          <p className="mt-3 text-2xl font-black text-[var(--navy)]">42.8%</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +5.2% conversion rate
          </span>
        </div>

        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[var(--teal)] uppercase tracking-wider">
              Popular Resource
            </span>
            <Users className="h-4 w-4 text-[var(--navy)]" />
          </div>
          <p className="mt-3 text-lg font-extrabold text-[var(--navy)] truncate">
            E-book: Inattentive & Hyperactive
          </p>
          <span className="text-xs text-[rgba(23,50,74,0.7)] font-medium mt-1 block">
            2,450 downloads
          </span>
        </div>
      </div>
    </div>
  );
}
