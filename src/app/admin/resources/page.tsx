import { Download, FolderKanban, Plus } from "lucide-react";

export default function AdminResourcesPage() {
  const resourceItems = [
    {
      title: "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
      category: "E-Book",
      downloads: 2450,
      description: "Supportive ideas for families navigating attention and engagement concerns.",
    },
    {
      title: "Reading Confidence at Home",
      category: "Guide",
      downloads: 1890,
      description: "Practical ways to build stronger reading habits and confidence.",
    },
    {
      title: "Focus & Routine Toolkit",
      category: "Toolkit",
      downloads: 1420,
      description: "Simple tools for structure, task follow-through, and steadier routines.",
    },
    {
      title: "Social Stories & Communication Starters",
      category: "Toolkit",
      downloads: 980,
      description: "Helpful supports for social understanding, language, and everyday interactions.",
    },
    {
      title: "Calm Moments & Emotional Regulation Guide",
      category: "Guide",
      downloads: 1210,
      description: "Gentle strategies for big feelings, self-regulation, and recovery.",
    },
    {
      title: "Visual Supports & Structured Learning Guide",
      category: "Guide",
      downloads: 1150,
      description: "Clear visual tools and organization ideas for consistent learning support.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
            <FolderKanban className="h-7 w-7 text-[var(--teal)]" /> Resource Library
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage downloadable toolkits, guides, and educational materials.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]">
          <Plus className="h-4 w-4" /> Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resourceItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[rgba(79,175,168,0.15)] px-3 py-1 text-xs font-bold text-[var(--navy)]">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[rgba(23,50,74,0.7)]">
                  <Download className="h-3.5 w-3.5" /> {item.downloads} downloads
                </span>
              </div>
              <h2 className="mt-3 text-base font-extrabold text-[var(--navy)]">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-[rgba(23,50,74,0.8)]">
                {item.description}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[rgba(18,58,90,0.08)]">
              <button className="rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-4 py-1.5 text-xs font-bold text-[var(--navy)] transition hover:bg-white">
                Edit Resource
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
