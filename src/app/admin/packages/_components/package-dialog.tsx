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
import { PackageForm, type PackageFormValues } from "./package-form";

// ─── Responsive hook ────────────────────────────────────────────────────────

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

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass undefined for "Add New", or the package data for "Edit" */
  packageData?: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description?: string | null;
    price: number; // cents
    billingCycle: string;
    features: string[];
    purchaseUrl?: string | null;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
  };
}

// ─── Main component ─────────────────────────────────────────────────────────

export function PackageDialog({
  open,
  onOpenChange,
  packageData,
}: PackageDialogProps) {
  const isDesktop = useIsDesktop();
  const isEditing = !!packageData;

  const title = isEditing ? "Edit Package" : "Add New Package";
  const description = isEditing
    ? "Update the details for this package."
    : "Fill in the details to create a new package.";

  // Convert DB cents → dollar string for the form
  const formDefaults: Partial<PackageFormValues> | undefined = packageData
    ? {
        slug: packageData.slug,
        name: packageData.name,
        tagline: packageData.tagline,
        description: packageData.description ?? "",
        priceInDollars: (packageData.price / 100).toFixed(2),
        billingCycle: packageData.billingCycle as
          | "one_time"
          | "monthly"
          | "yearly",
        features: packageData.features,
        purchaseUrl: packageData.purchaseUrl ?? "",
        isFeatured: packageData.isFeatured,
        isActive: packageData.isActive,
        displayOrder: packageData.displayOrder,
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
          <PackageForm
            defaultValues={formDefaults}
            packageId={packageData?.id}
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
        <PackageForm
          defaultValues={formDefaults}
          packageId={packageData?.id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
}
