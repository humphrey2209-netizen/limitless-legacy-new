import { Check, Package, Plus } from "lucide-react";

export default function AdminPackagesPage() {
  const packagesList = [
    {
      title: "Starter Package",
      price: "$49 / one-time",
      status: "Active",
      description:
        "Best for families who want a simple starting point with practical ideas and low-pressure next steps.",
      bullets: [
        "Supportive learning recommendations",
        "Simple home practice ideas",
        "Parent-friendly next steps",
      ],
    },
    {
      title: "Premium Package",
      price: "$129 / one-time",
      status: "Active",
      description:
        "Best for families who want more personalized direction and a stronger support framework.",
      bullets: [
        "Deeper learning guidance",
        "Custom activity suggestions",
        "Expanded parent support",
      ],
    },
    {
      title: "Monthly Support Package",
      price: "$29 / month",
      status: "Active",
      description:
        "Best for families who want ongoing support, routine check-ins, and continued encouragement.",
      bullets: [
        "Ongoing resource suggestions",
        "Fresh learning ideas each month",
        "Steady support and guidance",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--navy)] flex items-center gap-2">
            <Package className="h-7 w-7 text-[var(--teal)]" /> Packages & Pricing
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage learning packages, features, pricing, and purchase links.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]">
          <Plus className="h-4 w-4" /> Add New Package
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {packagesList.map((pkg) => (
          <div
            key={pkg.title}
            className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[rgba(79,175,168,0.15)] px-3 py-1 text-xs font-bold text-[var(--navy)]">
                  {pkg.status}
                </span>
                <span className="font-extrabold text-[var(--navy)] text-sm">
                  {pkg.price}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-[var(--navy)]">
                {pkg.title}
              </h2>
              <p className="mt-2 text-xs text-[rgba(23,50,74,0.8)] leading-relaxed">
                {pkg.description}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {pkg.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                    <Check className="h-3.5 w-3.5 text-[var(--teal)] shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex items-center gap-2 pt-4 border-t border-[rgba(18,58,90,0.08)]">
              <button className="flex-1 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white">
                Edit Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
