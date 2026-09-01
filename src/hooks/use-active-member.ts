import { authClient } from "@/server/better-auth/client";
import { useState, useEffect } from "react";

type Role = "admin" | "member";

export function useActiveMemberRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRole() {
      setLoading(true);
      const result = await authClient.organization.getActiveMemberRole();

      if (cancelled) return;

      if (result.error) {
        setError(result.error.message ?? "Failed to load role");
        setRole(null);
      } else {
        setRole((result.data as Role) || null);
        setError(null);
      }
      setLoading(false);
    }

    void fetchRole();

    return () => {
      cancelled = true;
    };
  }, []);

  return { role, error, loading };
}
