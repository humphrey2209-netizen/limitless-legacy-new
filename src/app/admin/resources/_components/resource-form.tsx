"use client";

import { useForm } from "@tanstack/react-form";
import { FileUp, ImagePlus, Loader2, Upload, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/lib/supabase/client";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ResourceFormValues {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  coverImageUrl: string;
  isFeatured: boolean;
  displayOrder: number;
}

interface ResourceFormProps {
  defaultValues?: Partial<ResourceFormValues>;
  resourceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// ─── Categories ─────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  "E-Book",
  "Guide",
  "Toolkit",
  "Checklist",
  "Worksheet",
  "Template",
];

// ─── Field Error Helper ─────────────────────────────────────────────────────

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

// ─── Slugify Helper ─────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Main Form ──────────────────────────────────────────────────────────────

export function ResourceForm({
  defaultValues,
  resourceId,
  onSuccess,
  onCancel,
}: ResourceFormProps) {
  const utils = api.useUtils();
  const isEditing = !!resourceId;

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const signedUrlMutation = api.resources.getSignedUploadUrl.useMutation();

  const createMutation = api.resources.create.useMutation({
    onSuccess: async () => {
      await utils.resources.getAll.invalidate();
      onSuccess();
    },
  });

  const updateMutation = api.resources.update.useMutation({
    onSuccess: async () => {
      await utils.resources.getAll.invalidate();
      onSuccess();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const serverError =
    createMutation.error?.message ??
    updateMutation.error?.message ??
    uploadError;

  const form = useForm({
    defaultValues: {
      slug: defaultValues?.slug ?? "",
      title: defaultValues?.title ?? "",
      category: defaultValues?.category ?? "Guide",
      description: defaultValues?.description ?? "",
      fileUrl: defaultValues?.fileUrl ?? "",
      coverImageUrl: defaultValues?.coverImageUrl ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      displayOrder: defaultValues?.displayOrder ?? 0,
    },
    onSubmit: async ({ value }) => {
      if (!value.fileUrl) {
        setUploadError("Resource file is required");
        return;
      }

      const payload = {
        slug: value.slug,
        title: value.title,
        category: value.category,
        description: value.description,
        fileUrl: value.fileUrl,
        coverImageUrl: value.coverImageUrl || undefined,
        isFeatured: value.isFeatured,
        displayOrder: value.displayOrder,
      };

      if (isEditing && resourceId) {
        await updateMutation.mutateAsync({ id: resourceId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldSetter: (url: string) => void,
    setLoading: (loading: boolean) => void,
    prefix = "resources",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setLoading(true);
    try {
      // 1. Get signed upload URL & token from server (authenticated via Better Auth)
      const { token, path, publicUrl } =
        await signedUrlMutation.mutateAsync({
          filename: file.name,
          prefix,
        });

      // 2. Upload file directly to Supabase using the signed token
      const supabase = createSupabaseClient();
      const { error } = await supabase.storage
        .from("limitless-legacy")
        .uploadToSignedUrl(path, token, file);

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      fieldSetter(publicUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload file",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* Title + Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="title"
          validators={{
            onBlur: ({ value }) =>
              !value.trim() ? "Title is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <Label required>Resource Title</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur();
                  const currentSlug = form.getFieldValue("slug");
                  if (!currentSlug) {
                    form.setFieldValue("slug", slugify(field.state.value));
                  }
                }}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Reading Confidence Guide"
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
                onChange={(e) => field.handleChange(slugify(e.target.value))}
                placeholder="e.g. reading-confidence-guide"
                className="border-[rgba(18,58,90,0.2)] font-mono text-xs focus-visible:ring-[var(--teal)]"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Category */}
      <form.Field
        name="category"
        validators={{
          onBlur: ({ value }) =>
            !value.trim() ? "Category is required" : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label required>Category</Label>
            <div className="flex gap-2">
              <select
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-9 w-full rounded-xl border border-[rgba(18,58,90,0.2)] bg-white px-3 text-sm text-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field
        name="description"
        validators={{
          onBlur: ({ value }) =>
            !value.trim() ? "Description is required" : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label required>Description</Label>
            <textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Detailed description of what this resource offers..."
              rows={3}
              className="w-full rounded-xl border border-[rgba(18,58,90,0.2)] bg-white px-3 py-2 text-sm text-[var(--navy)] placeholder:text-[rgba(23,50,74,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-1"
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* Resource File Upload */}
      <form.Field
        name="fileUrl"
        validators={{
          onBlur: ({ value }) =>
            !value ? "A downloadable file is required" : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label required>Resource File (Supabase Storage)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(18,58,90,0.2)] bg-[#FAF7F0] px-4 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white">
                  {isUploadingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--teal)]" />
                  ) : (
                    <Upload className="h-4 w-4 text-[var(--teal)]" />
                  )}
                  {isUploadingFile ? "Uploading to Supabase..." : "Choose File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        (url) => field.handleChange(url),
                        setIsUploadingFile,
                        "resources",
                      )
                    }
                    disabled={isUploadingFile}
                  />
                </label>

                {field.state.value && (
                  <a
                    href={field.state.value}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--teal)] hover:underline"
                  >
                    <FileUp className="h-3.5 w-3.5" />
                    View File
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
              </div>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Or paste public URL directly..."
                className="border-[rgba(18,58,90,0.2)] font-mono text-xs focus-visible:ring-[var(--teal)]"
              />
              <FieldInfo field={field} />
            </div>
          </div>
        )}
      </form.Field>

      {/* Cover Image Upload */}
      <form.Field name="coverImageUrl">
        {(field) => (
          <div>
            <Label>Cover Image (Optional)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(18,58,90,0.2)] bg-[#FAF7F0] px-4 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-white">
                  {isUploadingCover ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--teal)]" />
                  ) : (
                    <ImagePlus className="h-4 w-4 text-[var(--teal)]" />
                  )}
                  {isUploadingCover ? "Uploading..." : "Choose Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        (url) => field.handleChange(url),
                        setIsUploadingCover,
                        "resources/covers",
                      )
                    }
                    disabled={isUploadingCover}
                  />
                </label>

                {field.state.value && (
                  <a
                    href={field.state.value}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--teal)] hover:underline"
                  >
                    View Cover Image
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
              </div>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Or paste cover image URL..."
                className="border-[rgba(18,58,90,0.2)] font-mono text-xs focus-visible:ring-[var(--teal)]"
              />
            </div>
          </div>
        )}
      </form.Field>

      {/* Toggles row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                Featured Resource
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
          disabled={isPending || isUploadingFile || isUploadingCover}
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
              disabled={
                !canSubmit ||
                isPending ||
                isUploadingFile ||
                isUploadingCover ||
                !!isSubmitting
              }
              className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending || isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Save Changes" : "Create Resource"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
