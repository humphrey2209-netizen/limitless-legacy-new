import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { auth } from "@/server/better-auth";
import { headers } from "next/headers";

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (activeMember.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[rgba(18,58,90,0.2)] bg-white px-6 py-20 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[var(--navy)]">
            Admin access required
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[rgba(23,50,74,0.7)]">
            You do not have permission to access this resource. Contact an
            administrator if you believe this is a mistake.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-xl bg-[var(--navy)] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
