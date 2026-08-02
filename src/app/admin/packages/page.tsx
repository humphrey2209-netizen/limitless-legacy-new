"use client";

import { useState } from "react";
import { Check, Package, Plus, Pencil, Loader2 } from "lucide-react";

import { api } from "@/trpc/react";
import { PackageDialog } from "./_components/package-dialog";

// ─── Billing cycle label ─────────────────────────────────────────────────────

function billingLabel(cycle: string) {
  if (cycle === "monthly") return "/ month";
  if (cycle === "yearly") return "/ year";
  return "one-time";
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const { data: packages, isLoading } = api.packages.getAll.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<
    | {
        id: string;
        name: string;
        slug: string;
        tagline: string;
        description?: string | null;
        price: number;
        billingCycle: string;
        features: string[];
        purchaseUrl?: string | null;
        isFeatured: boolean;
        isActive: boolean;
        displayOrder: number;
      }
    | undefined
  >(undefined);

  function openAddDialog() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(pkg: NonNullable<typeof packages>[number]) {
    setEditTarget({
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      tagline: pkg.tagline,
      description: pkg.description,
      price: pkg.price,
      billingCycle: pkg.billingCycle,
      features: pkg.features as string[],
      purchaseUrl: pkg.purchaseUrl,
      isFeatured: pkg.isFeatured,
      isActive: pkg.isActive,
      displayOrder: pkg.displayOrder,
    });
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-[var(--navy)]">
            <Package className="h-7 w-7 text-[var(--teal)]" />
            Packages &amp; Pricing
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage learning packages, features, pricing, and purchase links.
          </p>
        </div>
        <button
          onClick={openAddDialog}
          className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]"
        >
          <Plus className="h-4 w-4" />
          Add New Package
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse rounded-full bg-[rgba(18,58,90,0.08)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              </div>
              <div className="h-6 w-3/4 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              <div className="h-12 w-full animate-pulse rounded bg-[rgba(18,58,90,0.06)]" />
              <div className="mt-2 flex flex-col gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 w-5/6 animate-pulse rounded bg-[rgba(18,58,90,0.06)]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!packages || packages.length === 0) && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[rgba(18,58,90,0.2)] bg-white py-16 text-center">
          <Package className="h-12 w-12 text-[rgba(18,58,90,0.2)]" />
          <div>
            <p className="font-bold text-[var(--navy)]">No packages yet</p>
            <p className="text-sm text-[rgba(23,50,74,0.6)]">
              Click &ldquo;Add New Package&rdquo; to get started.
            </p>
          </div>
          <button
            onClick={openAddDialog}
            className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]"
          >
            <Plus className="h-4 w-4" />
            Add New Package
          </button>
        </div>
      )}

      {/* Package cards */}
      {!isLoading && packages && packages.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      pkg.isActive
                        ? "bg-[rgba(79,175,168,0.15)] text-[var(--navy)]"
                        : "bg-[rgba(18,58,90,0.08)] text-[rgba(23,50,74,0.5)]"
                    }`}
                  >
                    {pkg.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm font-extrabold text-[var(--navy)]">
                    ${(pkg.price / 100).toFixed(2)}{" "}
                    <span className="text-xs font-semibold text-[rgba(23,50,74,0.6)]">
                      {billingLabel(pkg.billingCycle)}
                    </span>
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-extrabold text-[var(--navy)]">
                  {pkg.name}
                </h2>
                {pkg.isFeatured && (
                  <span className="mt-1 inline-block rounded-full bg-[rgba(212,169,66,0.15)] px-2 py-0.5 text-[10px] font-bold text-[var(--gold)]">
                    ★ Featured
                  </span>
                )}
                {pkg.tagline && (
                  <p className="mt-2 text-xs italic text-[rgba(23,50,74,0.7)]">
                    {pkg.tagline}
                  </p>
                )}
                {pkg.description && (
                  <p className="mt-1 text-xs leading-relaxed text-[rgba(23,50,74,0.8)]">
                    {pkg.description}
                  </p>
                )}

                <ul className="mt-4 flex flex-col gap-2">
                  {(pkg.features as string[]).map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-[var(--teal)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-[rgba(18,58,90,0.08)] pt-4">
                <button
                  onClick={() => openEditDialog(pkg)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white"
                >
                  <Pencil className="h-3 w-3" />
                  Edit Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive Dialog / Bottom Sheet */}
      <PackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        packageData={editTarget}
      />
    </div>
  );
}
