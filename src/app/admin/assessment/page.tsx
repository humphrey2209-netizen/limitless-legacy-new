import { ClipboardList, Plus, Settings2 } from "lucide-react";

export default function AdminAssessmentPage() {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-[var(--teal)]" /> Parent Assessment Setup
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Configure step questions, disclaimer text, and recommendation rule mapping.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]">
          <Plus className="h-4 w-4" /> Add Step Question
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
  );
}
