"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PackageFormValues {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceInDollars: string; // user-facing, stored as cents (blank = no price)
  billingCycle: "one_time" | "monthly" | "yearly" | "";
  features: string[];
  purchaseUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

interface PackageFormProps {
  defaultValues?: Partial<PackageFormValues>;
  packageId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// ─── Field error helper ─────────────────────────────────────────────────────

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;
  const isTouched = field.state.meta.isTouched;
  if (!isTouched || !errors.length) return null;
  return (
    <p className="mt-1 text-xs text-red-500">
      {errors.map((e: unknown) => (typeof e === "string" ? e : (e as { message?: string })?.message ?? "")).join(", ")}
    </p>
  );
}

// ─── Label ──────────────────────────────────────────────────────────────────

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1 block text-xs font-bold text-[var(--navy)]">
      {children}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

// ─── Slugify helper ─────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Main form ──────────────────────────────────────────────────────────────

export function PackageForm({
  defaultValues,
  packageId,
  onSuccess,
  onCancel,
}: PackageFormProps) {
  const utils = api.useUtils();
  const isEditing = !!packageId;

  const createMutation = api.packages.create.useMutation({
    onSuccess: async () => {
      await utils.packages.getAll.invalidate();
      onSuccess();
    },
  });

  const updateMutation = api.packages.update.useMutation({
    onSuccess: async () => {
      await utils.packages.getAll.invalidate();
      onSuccess();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const serverError =
    createMutation.error?.message ?? updateMutation.error?.message;

  const form = useForm({
    defaultValues: {
      slug: defaultValues?.slug ?? "",
      name: defaultValues?.name ?? "",
      tagline: defaultValues?.tagline ?? "",
      description: defaultValues?.description ?? "",
      priceInDollars: defaultValues?.priceInDollars ?? "",
      billingCycle: (defaultValues?.billingCycle ?? ""),
      features: defaultValues?.features?.length
        ? defaultValues.features
        : [""],
      purchaseUrl: defaultValues?.purchaseUrl ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
      displayOrder: defaultValues?.displayOrder ?? 0,
    },
    onSubmit: async ({ value }) => {
      const parsedPrice = value.priceInDollars.trim() !== ""
        ? Math.round(parseFloat(value.priceInDollars) * 100)
        : null;
      const cleanFeatures = value.features.filter((f) => f.trim() !== "");

      const payload = {
        slug: value.slug,
        name: value.name,
        tagline: value.tagline,
        description: value.description || undefined,
        price: parsedPrice,
        billingCycle: value.billingCycle !== "" ? value.billingCycle : null,
        features: cleanFeatures,
        purchaseUrl: value.purchaseUrl || undefined,
        isFeatured: value.isFeatured,
        isActive: value.isActive,
        displayOrder: value.displayOrder,
      };

      if (isEditing && packageId) {
        await updateMutation.mutateAsync({ id: packageId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* Name + Slug row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="name"
          validators={{
            onBlur: ({ value }) =>
              !value.trim() ? "Name is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <Label required>Package Name</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur();
                  // Auto-generate slug if empty
                  const slugField = form.getFieldValue("slug");
                  if (!slugField) {
                    form.setFieldValue("slug", slugify(field.state.value));
                  }
                }}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Starter Package"
                className="border-[rgba(18,58,90,0.2)] focus-visible:ring-[var(--teal)]"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field
          name="slug"
          validators={{
            onBlur: ({ value }) => {
              if (!value.trim()) return "Slug is required";
              if (!/^[a-z0-9-]+$/.test(value))
                return "Slug can only contain lowercase letters, numbers, and dashes";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <Label required>Slug</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(slugify(e.target.value))
                }
                placeholder="e.g. starter-package"
                className="border-[rgba(18,58,90,0.2)] font-mono text-xs focus-visible:ring-[var(--teal)]"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Tagline */}
      <form.Field name="tagline">
        {(field) => (
          <div>
            <Label>Tagline</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Short marketing hook (optional)"
              className="border-[rgba(18,58,90,0.2)] focus-visible:ring-[var(--teal)]"
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div>
            <Label>Description</Label>
            <textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Full description (optional)"
              rows={3}
              className="w-full rounded-xl border border-[rgba(18,58,90,0.2)] bg-white px-3 py-2 text-sm text-[var(--navy)] placeholder:text-[rgba(23,50,74,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-1"
            />
          </div>
        )}
      </form.Field>

      {/* Price + Billing cycle */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="priceInDollars">
          {(field) => (
            <div>
              <Label>Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[rgba(23,50,74,0.5)]">
                  $
                </span>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="49.00 (leave blank if free or TBD)"
                  className="border-[rgba(18,58,90,0.2)] pl-7 focus-visible:ring-[var(--teal)]"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="billingCycle">
          {(field) => (
            <div>
              <Label>Billing Cycle</Label>
              <select
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value as "one_time" | "monthly" | "yearly" | "",
                  )
                }
                className="h-9 w-full rounded-xl border border-[rgba(18,58,90,0.2)] bg-white px-3 text-sm text-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              >
                <option value="">— No billing cycle —</option>
                <option value="one_time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </form.Field>
      </div>

      {/* Features */}
      <form.Field name="features" mode="array">
        {(field) => (
          <div>
            <Label required>Features</Label>
            <div className="flex flex-col gap-2">
              {field.state.value.map((_, i) => (
                <form.Field key={i} name={`features[${i}]`}>
                  {(subField) => (
                    <div className="flex items-center gap-2">
                      <Input
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) =>
                          subField.handleChange(e.target.value)
                        }
                        placeholder={`Feature ${i + 1}`}
                        className="border-[rgba(18,58,90,0.2)] focus-visible:ring-[var(--teal)]"
                      />
                      <button
                        type="button"
                        onClick={() => field.removeValue(i)}
                        disabled={field.state.value.length <= 1}
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(18,58,90,0.15)] text-[rgba(23,50,74,0.5)] transition hover:border-red-300 hover:bg-red-50 hover:text-red-500",
                          field.state.value.length <= 1 &&
                            "cursor-not-allowed opacity-30",
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </form.Field>
              ))}
              <button
                type="button"
                onClick={() => field.pushValue("")}
                className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-[rgba(18,58,90,0.3)] px-3 py-1.5 text-xs font-bold text-[rgba(23,50,74,0.7)] transition hover:border-[var(--teal)] hover:text-[var(--teal)]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add feature
              </button>
            </div>
          </div>
        )}
      </form.Field>

      {/* Purchase URL */}
      <form.Field
        name="purchaseUrl"
        validators={{
          onBlur: ({ value }) => {
            if (!value) return undefined;
            try {
              new URL(value);
              return undefined;
            } catch {
              return "Must be a valid URL (e.g. https://...)";
            }
          },
        }}
      >
        {(field) => (
          <div>
            <Label>Purchase URL</Label>
            <Input
              id={field.name}
              type="url"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
              className="border-[rgba(18,58,90,0.2)] focus-visible:ring-[var(--teal)]"
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* Toggles row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <form.Field name="isFeatured">
          {(field) => (
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(18,58,90,0.15)] px-3 py-2.5 transition hover:bg-[rgba(79,175,168,0.06)]">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4 accent-[var(--teal)]"
              />
              <span className="text-xs font-bold text-[var(--navy)]">
                Featured
              </span>
            </label>
          )}
        </form.Field>

        <form.Field name="isActive">
          {(field) => (
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(18,58,90,0.15)] px-3 py-2.5 transition hover:bg-[rgba(79,175,168,0.06)]">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4 accent-[var(--teal)]"
              />
              <span className="text-xs font-bold text-[var(--navy)]">
                Active
              </span>
            </label>
          )}
        </form.Field>

        <form.Field
          name="displayOrder"
          validators={{
            onChange: ({ value }) =>
              isNaN(value) ? "Must be a number" : undefined,
          }}
        >
          {(field) => (
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value, 10) || 0)
                }
                className="border-[rgba(18,58,90,0.2)] focus-visible:ring-[var(--teal)]"
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Server error */}
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-[rgba(18,58,90,0.08)] pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
          className="text-[rgba(23,50,74,0.7)]"
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isPending || !!isSubmitting}
              className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending || isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Save Changes" : "Create Package"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
