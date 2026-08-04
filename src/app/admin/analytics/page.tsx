"use client";

import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Users,
} from "lucide-react";

import { api } from "@/trpc/react";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = api.stats.getAnalytics.useQuery();

  const ageGroups = [
    "3–5 years",
    "6–8 years",
    "9–12 years",
    "13+ years",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-[var(--navy)]">
          <BarChart3 className="h-7 w-7 text-[var(--teal)]" /> Analytics &amp; Reports
        </h1>
        <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
          Real-time metrics for parent assessment trends, resource library usage, and organization member roles.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Parent Assessments
            </span>
            <ClipboardList className="h-4 w-4 text-[var(--navy)]" />
          </div>
          {isLoading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
          ) : (
            <p className="mt-3 text-3xl font-black text-[var(--navy)]">
              {analytics?.totalAssessments.toLocaleString() ?? 0}
            </p>
          )}
          <span className="mt-1 block text-xs font-medium text-[rgba(23,50,74,0.7)]">
            Total submissions recorded
          </span>
        </div>

        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Registered Users
            </span>
            <Users className="h-4 w-4 text-[var(--navy)]" />
          </div>
          {isLoading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
          ) : (
            <p className="mt-3 text-3xl font-black text-[var(--navy)]">
              {analytics?.totalUsers.toLocaleString() ?? 0}
            </p>
          )}
          <span className="mt-1 block text-xs font-medium text-[rgba(23,50,74,0.7)]">
            Registered parent accounts
          </span>
        </div>

        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--teal)]">
              Resource Library
            </span>
            <FolderKanban className="h-4 w-4 text-[var(--navy)]" />
          </div>
          {isLoading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
          ) : (
            <p className="mt-3 text-3xl font-black text-[var(--navy)]">
              {analytics?.totalResourcesCount ?? 0}
            </p>
          )}
          <span className="mt-1 block text-xs font-medium text-[rgba(23,50,74,0.7)]">
            {analytics?.totalDownloads ?? 0} total downloads
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Assessment Submissions by Age Group */}
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[var(--navy)] mb-1 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--teal)]" />
            Child Age Distribution
          </h2>
          <p className="text-xs text-[rgba(23,50,74,0.7)] mb-4">
            Submissions categorized by child age group.
          </p>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-[#FAF7F0]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ageGroups.map((age) => {
                const countVal = analytics?.ageCounts[age] ?? 0;
                const total = analytics?.totalAssessments ?? 1;
                const percentage = total > 0 ? Math.round((countVal / total) * 100) : 0;

                return (
                  <div key={age} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--navy)]">
                      <span>{age}</span>
                      <span>
                        {countVal} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF7F0]">
                      <div
                        className="h-full rounded-full bg-[var(--teal)] transition-all duration-500"
                        style={{ width: `${Math.max(percentage, countVal > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Requested Support Areas */}
        <div className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[var(--navy)] mb-1 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--gold)]" />
            Support Area Demand
          </h2>
          <p className="text-xs text-[rgba(23,50,74,0.7)] mb-4">
            Most selected learning support areas from parent assessments.
          </p>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-[#FAF7F0]" />
              ))}
            </div>
          ) : !analytics?.supportAreaCounts || Object.keys(analytics.supportAreaCounts).length === 0 ? (
            <p className="text-xs text-[rgba(23,50,74,0.6)] py-6 text-center italic">
              No assessment support area data collected yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(analytics.supportAreaCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([area, countVal]) => (
                  <div
                    key={area}
                    className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 text-xs"
                  >
                    <span className="font-bold text-[var(--navy)]">{area}</span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 font-black text-[var(--navy)] border border-[rgba(18,58,90,0.1)]">
                      {countVal} selections
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
