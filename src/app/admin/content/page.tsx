"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileText, RefreshCw, Save, Undo } from "lucide-react";

import { api } from "@/trpc/react";

const defaultContent = {
  brandName: "Limitless Legacy",
  heroHeadline: "Personalized Learning Support Designed for Every Child",
  heroDescription:
    "Personalized learning plans, educational activities, and parent support tools created to help children build confidence, strengthen skills, and reach their potential.",
  aboutSummary:
    "Limitless Legacy creates accessible learning opportunities and practical tools for families and educators while honoring every learner’s unique path.",
  footerDescription:
    "Inclusive learning support for children, families, and educators.",
  contactEmail: "hello.limitlesslegacy@gmail.com",
  assessmentDisclaimer:
    "This assessment is designed to help families identify supportive learning resources that may benefit their child. It does not diagnose disabilities or replace professional assessments. Every child learns differently, and this tool helps connect families with appropriate support options.",
};

export default function AdminContentPage() {
  const [content, setContent] = useState(defaultContent);
  const [saveStatus, setSaveStatus] = useState({ message: "", isError: false });

  const utils = api.useUtils();
  const { data: contentData, isLoading } = api.content.getAll.useQuery();

  useEffect(() => {
    if (contentData?.map) {
      setContent({
        brandName: contentData.map.brandName ?? defaultContent.brandName,
        heroHeadline: contentData.map.heroHeadline ?? defaultContent.heroHeadline,
        heroDescription: contentData.map.heroDescription ?? defaultContent.heroDescription,
        aboutSummary: contentData.map.aboutSummary ?? defaultContent.aboutSummary,
        footerDescription: contentData.map.footerDescription ?? defaultContent.footerDescription,
        contactEmail: contentData.map.contactEmail ?? defaultContent.contactEmail,
        assessmentDisclaimer: contentData.map.assessmentDisclaimer ?? defaultContent.assessmentDisclaimer,
      });
    }
  }, [contentData]);

  const updateMutation = api.content.updateMany.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate();
      setSaveStatus({ message: "Site content saved to database!", isError: false });
    },
    onError: (err) => {
      setSaveStatus({ message: err.message || "Failed to save content.", isError: true });
    },
  });

  const resetMutation = api.content.resetDefaults.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate();
      setContent(defaultContent);
      setSaveStatus({ message: "Defaults restored in database!", isError: false });
    },
    onError: (err) => {
      setSaveStatus({ message: err.message || "Failed to reset defaults.", isError: true });
    },
  });

  const isSaving = updateMutation.isPending || resetMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ message: "", isError: false });
    updateMutation.mutate({ items: content });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all site content back to default values?")) {
      setSaveStatus({ message: "", isError: false });
      resetMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
            <FileText className="h-7 w-7 text-[var(--teal)]" /> Site Content Editor
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage main headlines, hero lead texts, about summary, and brand copy in the database.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void utils.content.getAll.invalidate()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-3 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-[#FAF7F0]" />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
              Brand Name
              <input
                type="text"
                value={content.brandName}
                onChange={(e) =>
                  setContent({ ...content, brandName: e.target.value })
                }
                className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
              Contact Email
              <input
                type="email"
                value={content.contactEmail}
                onChange={(e) =>
                  setContent({ ...content, contactEmail: e.target.value })
                }
                className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
            Hero Headline
            <textarea
              rows={2}
              value={content.heroHeadline}
              onChange={(e) =>
                setContent({ ...content, heroHeadline: e.target.value })
              }
              className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
            Hero Description
            <textarea
              rows={3}
              value={content.heroDescription}
              onChange={(e) =>
                setContent({ ...content, heroDescription: e.target.value })
              }
              className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
            About Summary
            <textarea
              rows={3}
              value={content.aboutSummary}
              onChange={(e) =>
                setContent({ ...content, aboutSummary: e.target.value })
              }
              className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
            Footer Description
            <textarea
              rows={2}
              value={content.footerDescription}
              onChange={(e) =>
                setContent({ ...content, footerDescription: e.target.value })
              }
              className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-bold text-[var(--navy)] text-sm">
            Assessment Disclaimer
            <textarea
              rows={3}
              value={content.assessmentDisclaimer}
              onChange={(e) =>
                setContent({ ...content, assessmentDisclaimer: e.target.value })
              }
              className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] p-3 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? "Saving..." : "Save Content"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full border border-[rgba(18,58,90,0.2)] bg-white px-5 py-2.5 font-bold text-[var(--navy)] transition hover:bg-[rgba(18,58,90,0.05)] disabled:opacity-50"
            >
              <Undo className="h-4 w-4" /> Reset Defaults
            </button>
          </div>

          {saveStatus.message && (
            <p
              className={`text-sm font-bold flex items-center gap-1.5 ${
                saveStatus.isError ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {!saveStatus.isError && <CheckCircle2 className="h-4 w-4" />}
              {saveStatus.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
