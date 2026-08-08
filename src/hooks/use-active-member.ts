import { authClient } from "@/server/better-auth/client";
import { useState, useEffect } from "react";

// 1. Fixed missing '<' after Awaited
type ActiveMemberRoleResult = Awaited<
  ReturnType<typeof authClient.organization.getActiveMemberRole>
>;

// 2. Removed ["role"] because `data` IS the role string
type Role = NonNullable<ActiveMemberRoleResult["data"]>;
type RoleError = ActiveMemberRoleResult["error"];

export function useActiveMemberRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<RoleError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRole() {
      setLoading(true);
      const { data, error } =
        await authClient.organization.getActiveMemberRole();

      if (cancelled) return;

      if (error) {
        setError(error);
        setRole(null);
      } else {
        // 3. Use `data` directly instead of `data.role`
        setRole(data || null);
        setError(null);
      }
      setLoading(false);
    }

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, []);

  return { role, error, loading };
}
