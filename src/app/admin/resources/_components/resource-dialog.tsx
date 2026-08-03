"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ResourceForm, type ResourceFormValues } from "./resource-form";

// ─── Responsive Hook ────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceData?: {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    fileUrl: string;
    coverImageUrl?: string | null;
    isFeatured: boolean;
    displayOrder: number;
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function ResourceDialog({
  open,
  onOpenChange,
  resourceData,
}: ResourceDialogProps) {
  const isDesktop = useIsDesktop();
  const isEditing = !!resourceData;

  const title = isEditing ? "Edit Resource" : "Add New Resource";
  const description = isEditing
    ? "Update downloadable resource details and files."
    : "Fill in the details and upload downloadable content.";

  const formDefaults: Partial<ResourceFormValues> | undefined = resourceData
    ? {
        slug: resourceData.slug,
        title: resourceData.title,
        category: resourceData.category,
        description: resourceData.description,
        fileUrl: resourceData.fileUrl,
        coverImageUrl: resourceData.coverImageUrl ?? "",
        isFeatured: resourceData.isFeatured,
        displayOrder: resourceData.displayOrder,
      }
    : undefined;

  const handleSuccess = () => onOpenChange(false);
  const handleCancel = () => onOpenChange(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ResourceForm
            defaultValues={formDefaults}
            resourceId={resourceData?.id}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-4"
        showCloseButton
      >
        <SheetHeader className="px-0 pb-4">
          <SheetTitle className="text-base font-extrabold text-[var(--navy)]">
            {title}
          </SheetTitle>
          <SheetDescription className="text-xs text-[rgba(23,50,74,0.7)]">
            {description}
          </SheetDescription>
        </SheetHeader>
        <ResourceForm
          defaultValues={formDefaults}
          resourceId={resourceData?.id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
}
