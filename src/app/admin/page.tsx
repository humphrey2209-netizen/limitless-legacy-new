import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  History,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)]">
          Admin Dashboard Overview
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Manage your platform content, packages, assessment tools, and user activity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Active Users
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(79,175,168,0.15)] text-[var(--navy)]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[var(--navy)]">1,248</span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14% from last month</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Support Packages
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(213,168,61,0.2)] text-[var(--navy)]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[var(--navy)]">326</span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+8% active subscriptions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Completed Assessments
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(79,175,168,0.15)] text-[var(--navy)]">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[var(--navy)]">4,892</span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+24% completions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Resource Downloads
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(213,168,61,0.2)] text-[var(--navy)]">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[var(--navy)]">8,104</span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+19% resource grabs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sections Quick Navigation */}
      <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-[var(--navy)] mb-1">
          Quick Management Sections
        </h2>
        <p className="text-xs text-[rgba(23,50,74,0.75)] mb-5">
          Select any section below or use the sidebar menu to make edits.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/admin/content"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(79,175,168,0.2)] text-[var(--navy)]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Site Content <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                Update homepage headlines, about copy, and footer text.
              </span>
            </div>
          </Link>

          <Link
            href="/admin/packages"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(213,168,61,0.25)] text-[var(--navy)]">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Packages & Pricing <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                Manage Starter, Premium, and Monthly Support plans.
              </span>
            </div>
          </Link>

          <Link
            href="/admin/resources"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(79,175,168,0.2)] text-[var(--navy)]">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Resource Library <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                Manage downloadable e-books, toolkits, and guides.
              </span>
            </div>
          </Link>

          <Link
            href="/admin/assessment"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(213,168,61,0.25)] text-[var(--navy)]">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Parent Assessment <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                Configure assessment questions and recommendation logic.
              </span>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(79,175,168,0.2)] text-[var(--navy)]">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Users & Accounts <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                View registered users, roles, and session activity.
              </span>
            </div>
          </Link>

          <Link
            href="/legacy-admin"
            className="flex items-start gap-4 rounded-xl border border-[rgba(18,58,90,0.08)] bg-[#FAF7F0] p-4 transition hover:border-[var(--teal)] hover:bg-white hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(213,168,61,0.25)] text-[var(--navy)]">
              <History className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--navy)] text-base flex items-center gap-1">
                Legacy Admin <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
              </span>
              <span className="text-xs text-[rgba(23,50,74,0.8)] mt-0.5">
                Access the single-page legacy content editor.
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* System Health */}
      <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-[var(--navy)]">
              System Status & Integration Health
            </h3>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            All Systems Operational
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
            <span className="font-semibold text-[var(--navy)]">Better Auth</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
            <span className="font-semibold text-[var(--navy)]">Vercel Postgres</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connected
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
            <span className="font-semibold text-[var(--navy)]">Drizzle ORM</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
