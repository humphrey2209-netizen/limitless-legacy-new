"use client";

import { useEffect, useState } from "react";
import { FileText, Save, Undo } from "lucide-react";

const STORAGE_KEY = "limitlessLegacyAdminContentV1";

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
};

export default function AdminContentPage() {
  const [content, setContent] = useState(defaultContent);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw) as Partial<typeof defaultContent>;
        setContent({ ...defaultContent, ...saved });
      }
    } catch {
      setContent(defaultContent);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      const existing = savedRaw
        ? (JSON.parse(savedRaw) as Record<string, string>)
        : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, ...content })
      );
      setSaveStatus("Site content saved successfully.");
    } catch {
      setSaveStatus("Failed to save content.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-[0.5rem]">
            <FileText className="h-7 w-7 text-[var(--teal)]" /> Site Content Editor
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage main headlines, hero lead texts, about summary, and brand copy.
          </p>
        </div>
      </div>

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

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]"
          >
            <Save className="h-4 w-4" /> Save Content
          </button>
          <button
            type="button"
            onClick={() => setContent(defaultContent)}
            className="flex items-center gap-2 rounded-full border border-[rgba(18,58,90,0.2)] bg-white px-5 py-2.5 font-bold text-[var(--navy)] transition hover:bg-[rgba(18,58,90,0.05)]"
          >
            <Undo className="h-4 w-4" /> Reset Defaults
          </button>
        </div>

        {saveStatus && (
          <p className="text-sm font-bold text-emerald-700">{saveStatus}</p>
        )}
      </form>
    </div>
  );
}
