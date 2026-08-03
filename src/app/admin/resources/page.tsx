"use client";

import { useState } from "react";
import { Download, FolderKanban, Plus, Pencil, ExternalLink, FileText } from "lucide-react";

import { api } from "@/trpc/react";
import { ResourceDialog } from "./_components/resource-dialog";

export default function AdminResourcesPage() {
  const { data: resourcesList, isLoading } = api.resources.getAll.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<
    | {
        id: string;
        slug: string;
        title: string;
        category: string;
        description: string;
        fileUrl: string;
        coverImageUrl?: string | null;
        isFeatured: boolean;
        displayOrder: number;
      }
    | undefined
  >(undefined);

  function openAddDialog() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(resource: NonNullable<typeof resourcesList>[number]) {
    setEditTarget({
      id: resource.id,
      slug: resource.slug,
      title: resource.title,
      category: resource.category,
      description: resource.description,
      fileUrl: resource.fileUrl,
      coverImageUrl: resource.coverImageUrl,
      isFeatured: resource.isFeatured,
      displayOrder: resource.displayOrder,
    });
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-[var(--navy)]">
            <FolderKanban className="h-7 w-7 text-[var(--teal)]" />
            Resource Library
          </h1>
          <p className="text-sm font-medium text-[rgba(23,50,74,0.8)]">
            Manage downloadable toolkits, guides, and educational materials.
          </p>
        </div>
        <button
          onClick={openAddDialog}
          className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 animate-pulse rounded-full bg-[rgba(18,58,90,0.08)]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              </div>
              <div className="h-5 w-3/4 animate-pulse rounded bg-[rgba(18,58,90,0.08)]" />
              <div className="h-8 w-full animate-pulse rounded bg-[rgba(18,58,90,0.06)]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!resourcesList || resourcesList.length === 0) && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[rgba(18,58,90,0.2)] bg-white py-16 text-center">
          <FolderKanban className="h-12 w-12 text-[rgba(18,58,90,0.2)]" />
          <div>
            <p className="font-bold text-[var(--navy)]">No resources yet</p>
            <p className="text-sm text-[rgba(23,50,74,0.6)]">
              Click &ldquo;Add Resource&rdquo; to upload your first guide or toolkit.
            </p>
          </div>
          <button
            onClick={openAddDialog}
            className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-[var(--navy)] shadow-sm transition hover:bg-[#c99c33]"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </button>
        </div>
      )}

      {/* Resource cards */}
      {!isLoading && resourcesList && resourcesList.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {resourcesList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[rgba(18,58,90,0.1)] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[rgba(79,175,168,0.15)] px-3 py-1 text-xs font-bold text-[var(--navy)]">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[rgba(23,50,74,0.7)]">
                    <Download className="h-3.5 w-3.5" /> {item.downloadCount}{" "}
                    downloads
                  </span>
                </div>
                <h2 className="mt-3 text-base font-extrabold text-[var(--navy)]">
                  {item.title}
                </h2>
                {item.isFeatured && (
                  <span className="mt-1 inline-block rounded-full bg-[rgba(212,169,66,0.15)] px-2 py-0.5 text-[10px] font-bold text-[var(--gold)]">
                    ★ Featured
                  </span>
                )}
                <p className="mt-2 text-xs leading-relaxed text-[rgba(23,50,74,0.8)]">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[rgba(18,58,90,0.08)] pt-3">
                <button
                  onClick={() => openEditDialog(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0] px-4 py-1.5 text-xs font-bold text-[var(--navy)] transition hover:bg-white"
                >
                  <Pencil className="h-3 w-3" />
                  Edit Resource
                </button>

                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[var(--teal)] hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Download File
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Drawer */}
      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resourceData={editTarget}
      />
    </div>
  );
}
