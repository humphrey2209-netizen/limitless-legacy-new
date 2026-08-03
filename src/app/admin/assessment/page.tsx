"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  Filter,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  User,
} from "lucide-react";

import { api } from "@/trpc/react";

export default function AdminAssessmentPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "setup">("submissions");
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");

  const utils = api.useUtils();
  const { data: submissions, isLoading, isRefetching } = api.assessment.getAll.useQuery();

  const deleteMutation = api.assessment.delete.useMutation({
    onSuccess: async () => {
      await utils.assessment.getAll.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assessment submission?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const stepsConfig = [
    {
      step: 1,
      title: "Child context",
      type: "Radio Selection",
      fields: "Age range, Grade level",
    },
    {
      step: 2,
      title: "Support areas",
      type: "Multiple Checkbox",
      fields: "Reading, Focus, Social, Emotional, Learning Differences",
    },
    {
      step: 3,
      title: "Grouped challenge selection",
      type: "Multiple Checkbox",
      fields: "Reading challenges, Attention, Communication, Routines",
    },
    {
      step: 4,
      title: "Learning preferences",
      type: "Multiple Checkbox",
      fields: "Visual, Hands-on, Movement, Listening, Games",
    },
    {
      step: 5,
      title: "Goals",
      type: "Multiple Checkbox",
      fields: "Stronger reader, Focus & independence, Social skills",
    },
  ];

  const filteredSubmissions = submissions?.filter((sub) => {
    const matchesSearch =
      !searchTerm ||
      (sub.childAge?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (sub.childGrade?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      sub.supportAreas?.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesAge =
      ageFilter === "all" || sub.childAge === ageFilter;

    return matchesSearch && matchesAge;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-[var(--navy)]">
            <ClipboardList className="h-7 w-7 text-[var(--teal)]" /> Parent Assessment Management
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            View submitted parent assessments and configure assessment step questions.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-xl bg-white p-1 border border-[rgba(18,58,90,0.12)] shadow-sm">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "submissions"
                ? "bg-[var(--navy)] text-white shadow-xs"
                : "text-[rgba(23,50,74,0.7)] hover:text-[var(--navy)]"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Submissions ({submissions?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "setup"
                ? "bg-[var(--navy)] text-white shadow-xs"
                : "text-[rgba(23,50,74,0.7)] hover:text-[var(--navy)]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Questions Setup
          </button>
        </div>
      </div>

      {activeTab === "submissions" ? (
        <div className="flex flex-col gap-6">
          {/* Filters & Refresh Toolbar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
                <input
                  type="text"
                  placeholder="Search age, grade, support area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/60 py-2 pl-9 pr-3 text-xs font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[rgba(18,58,90,0.5)]" />
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-white px-3 py-2 text-xs font-bold text-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--teal)]"
                >
                  <option value="all">All Ages</option>
                  <option value="3–5 years">3–5 years</option>
                  <option value="6–8 years">6–8 years</option>
                  <option value="9–12 years">9–12 years</option>
                  <option value="13+ years">13+ years</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => void utils.assessment.getAll.invalidate()}
              disabled={isRefetching}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-3 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Submissions List */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 w-full animate-pulse rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm"
                />
              ))}
            </div>
          )}

          {!isLoading && (!filteredSubmissions || filteredSubmissions.length === 0) && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[rgba(18,58,90,0.2)] bg-white py-16 text-center">
              <ClipboardList className="h-10 w-10 text-[rgba(18,58,90,0.25)]" />
              <div>
                <p className="font-extrabold text-[var(--navy)] text-base">No assessment submissions found</p>
                <p className="text-xs text-[rgba(23,50,74,0.6)]">
                  {searchTerm || ageFilter !== "all"
                    ? "Try adjusting your search filters."
                    : "Submissions completed by parents will appear here automatically."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && filteredSubmissions && filteredSubmissions.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredSubmissions.map((sub) => {
                const supportAreas = sub.supportAreas ?? [];
                const challenges = sub.challenges ?? [];
                const goals = sub.goals ?? [];
                const dateFormatted = new Date(sub.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[rgba(18,58,90,0.08)] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(79,175,168,0.15)] text-[var(--navy)] font-black">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[var(--navy)] text-base">
                              {sub.user?.name ?? "Guest Visitor"}
                            </span>
                            {sub.user ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                Registered User
                              </span>
                            ) : (
                              <span className="rounded-full bg-[rgba(18,58,90,0.08)] px-2 py-0.5 text-[10px] font-bold text-[rgba(23,50,74,0.6)]">
                                Guest
                              </span>
                            )}
                          </div>
                          {sub.user?.email && (
                            <p className="text-xs font-medium text-[var(--teal)]">
                              {sub.user.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-[rgba(23,50,74,0.6)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[var(--teal)]" />
                          {dateFormatted}
                        </span>
                        <button
                          onClick={() => void handleDelete(sub.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition"
                          title="Delete submission"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-[#FAF7F0] p-3 text-xs">
                        <span className="font-bold text-[var(--navy)] uppercase tracking-wider text-[10px]">
                          Child Profile
                        </span>
                        <div className="mt-1 font-semibold text-[var(--navy)]">
                          Age: <span className="text-[var(--teal)] font-bold">{sub.childAge ?? "N/A"}</span>
                        </div>
                        <div className="font-semibold text-[var(--navy)]">
                          Grade: <span className="text-[var(--teal)] font-bold">{sub.childGrade ?? "N/A"}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#FAF7F0] p-3 text-xs sm:col-span-2">
                        <span className="font-bold text-[var(--navy)] uppercase tracking-wider text-[10px]">
                          Selected Support Areas ({supportAreas.length})
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {supportAreas.map((area) => (
                            <span
                              key={area}
                              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[var(--navy)] border border-[rgba(18,58,90,0.1)] shadow-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 text-[var(--teal)]" />
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {(challenges.length > 0 || goals.length > 0) && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                        {challenges.length > 0 && (
                          <div>
                            <span className="font-bold text-[rgba(23,50,74,0.7)] text-[11px]">
                              Identified Challenges:
                            </span>
                            <p className="mt-0.5 text-[rgba(23,50,74,0.9)] font-medium">
                              {challenges.join(" · ")}
                            </p>
                          </div>
                        )}
                        {goals.length > 0 && (
                          <div>
                            <span className="font-bold text-[rgba(23,50,74,0.7)] text-[11px]">
                              Parent Goals:
                            </span>
                            <p className="mt-0.5 text-[rgba(23,50,74,0.9)] font-medium">
                              {goals.join(" · ")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[var(--navy)]">Assessment Step Configuration</h2>
            <button className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2 font-extrabold text-[var(--navy)] text-xs shadow-sm transition hover:bg-[#c99c33]">
              <Plus className="h-3.5 w-3.5" /> Add Step Question
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {stepsConfig.map((s) => (
              <div
                key={s.step}
                className="flex items-center justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(213,168,61,0.2)] text-[var(--navy)] font-black text-sm">
                    #{s.step}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-extrabold text-[var(--navy)]">
                      {s.title}
                    </h2>
                    <span className="text-xs font-medium text-[rgba(23,50,74,0.7)]">
                      Type: {s.type} · Options: {s.fields}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-4 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white">
                  <Settings2 className="h-3.5 w-3.5" /> Configure Step
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
