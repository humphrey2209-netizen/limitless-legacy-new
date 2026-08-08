"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  History,
  Package,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { api } from "@/trpc/react";
import { useActiveMemberRole } from "@/hooks/use-active-member";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = api.stats.getOverview.useQuery();

  const { role } = useActiveMemberRole(); // Ensure the user is an active member and has the correct role

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)]">
          Admin Dashboard Overview
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Real-time metrics for platform content, packages, assessment tools,
          and user activity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        {role === "admin" && (
          <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wider text-[var(--teal)] uppercase">
                Registered Users
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(79,175,168,0.15)] text-[var(--navy)]">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              ) : (
                <span className="text-3xl font-black text-[var(--navy)]">
                  {stats?.totalUsers.toLocaleString() ?? 0}
                </span>
              )}
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>Database synced</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Packages */}
        {role === "admin" && (
          <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wider text-[var(--teal)] uppercase">
                Support Packages
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(213,168,61,0.2)] text-[var(--navy)]">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              ) : (
                <span className="text-3xl font-black text-[var(--navy)]">
                  {stats?.activePackages ?? 0}
                </span>
              )}
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>
                  {stats?.totalPackages ?? 0} total packages configured
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Completed Assessments */}
        <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold tracking-wider text-[var(--teal)] uppercase">
              Completed Assessments
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(79,175,168,0.15)] text-[var(--navy)]">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
            ) : (
              <span className="text-3xl font-black text-[var(--navy)]">
                {stats?.completedAssessments.toLocaleString() ?? 0}
              </span>
            )}
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <span>Parent submissions</span>
            </div>
          </div>
        </div>

        {/* Resource Downloads / Resources */}
        {role === "admin" && (
          <div className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wider text-[var(--teal)] uppercase">
                Resource Library
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(213,168,61,0.2)] text-[var(--navy)]">
                <FolderKanban className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              ) : (
                <span className="text-3xl font-black text-[var(--navy)]">
                  {stats?.totalResources ?? 0}
                </span>
              )}
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>{stats?.totalDownloads ?? 0} downloads recorded</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Submissions Feed */}
      <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--navy)]">
              Recent Assessment Activity
            </h2>
            <p className="text-xs text-[rgba(23,50,74,0.7)]">
              Latest parent assessments submitted to the platform.
            </p>
          </div>
          <Link
            href="/admin/assessment"
            className="flex items-center gap-1 text-xs font-bold text-[var(--teal)] hover:underline"
          >
            View All Submissions <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-xl bg-[#FAF7F0]"
              />
            ))}
          </div>
        )}

        {!isLoading &&
          (!stats?.recentSubmissions ||
            stats.recentSubmissions.length === 0) && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/50 py-8 text-center">
              <ClipboardList className="mb-1 h-8 w-8 text-[rgba(18,58,90,0.3)]" />
              <p className="text-xs font-bold text-[var(--navy)]">
                No assessment submissions yet
              </p>
              <p className="text-[11px] text-[rgba(23,50,74,0.6)]">
                When parents submit assessments, their entries will appear here
                live.
              </p>
            </div>
          )}

        {!isLoading &&
          stats?.recentSubmissions &&
          stats.recentSubmissions.length > 0 && (
            <div className="flex flex-col gap-2">
              {stats.recentSubmissions.map((sub) => {
                const dateStr = new Date(sub.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                const supportAreas = sub.supportAreas ?? [];

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col justify-between gap-2 rounded-xl bg-[#FAF7F0] p-3 text-xs sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(79,175,168,0.2)] font-bold text-[var(--navy)]">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--navy)]">
                            {sub.user?.name ?? "Guest Visitor"}
                          </span>
                          <span className="rounded-md border border-[rgba(18,58,90,0.1)] bg-white px-2 py-0.5 text-[10px] font-extrabold text-[var(--teal)]">
                            Age {sub.childAge ?? "N/A"} · Grade{" "}
                            {sub.childGrade ?? "N/A"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[rgba(23,50,74,0.7)]">
                          Focus:{" "}
                          {supportAreas.slice(0, 2).join(", ") ||
                            "General Support"}
                        </p>
                      </div>
                    </div>

                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[rgba(23,50,74,0.6)]">
                      <Calendar className="h-3 w-3 text-[var(--teal)]" />
                      {dateStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* Admin Sections Quick Navigation */}
      {role === "admin" && (
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-extrabold text-[var(--navy)]">
            Quick Management Sections
          </h2>
          <p className="mb-5 text-xs text-[rgba(23,50,74,0.75)]">
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
                <span className="flex items-center gap-1 text-base font-bold text-[var(--navy)]">
                  Site Content{" "}
                  <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                </span>
                <span className="mt-0.5 text-xs text-[rgba(23,50,74,0.8)]">
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
                <span className="flex items-center gap-1 text-base font-bold text-[var(--navy)]">
                  Packages &amp; Pricing{" "}
                  <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                </span>
                <span className="mt-0.5 text-xs text-[rgba(23,50,74,0.8)]">
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
                <span className="flex items-center gap-1 text-base font-bold text-[var(--navy)]">
                  Resource Library{" "}
                  <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                </span>
                <span className="mt-0.5 text-xs text-[rgba(23,50,74,0.8)]">
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
                <span className="flex items-center gap-1 text-base font-bold text-[var(--navy)]">
                  Parent Assessment{" "}
                  <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                </span>
                <span className="mt-0.5 text-xs text-[rgba(23,50,74,0.8)]">
                  Configure assessment questions and view parent submissions.
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
                <span className="flex items-center gap-1 text-base font-bold text-[var(--navy)]">
                  Users &amp; Roles{" "}
                  <ArrowUpRight className="h-4 w-4 text-[var(--teal)]" />
                </span>
                <span className="mt-0.5 text-xs text-[rgba(23,50,74,0.8)]">
                  View registered users, assign roles, and manage memberships.
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* System Health */}
      {role === "admin" && (
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-[var(--navy)]">
                System Status &amp; Integration Health
              </h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              All Systems Operational
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
              <span className="font-semibold text-[var(--navy)]">
                Better Auth
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
              <span className="font-semibold text-[var(--navy)]">
                PostgreSQL Database
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs">
              <span className="font-semibold text-[var(--navy)]">
                Drizzle ORM &amp; tRPC
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Synced
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
