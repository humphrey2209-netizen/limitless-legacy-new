"use client";

import { usePathname } from "next/navigation";

import { api } from "@/trpc/react";

export function Footer() {
  const pathname = usePathname();
  const { data: contentData } = api.content.getAll.useQuery();

  const brandName = contentData?.map?.brandName ?? "Limitless Legacy";
  const footerDescription =
    contentData?.map?.footerDescription ??
    "Inclusive learning support for children, families, and educators.";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>{brandName}</h3>
          <p>{footerDescription}</p>
        </div>
        <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
