"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useCanopyData";
import { useHydrated } from "@/hooks/useHydrated";

export function useRequireProfile() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useProfile();

  useEffect(() => {
    if (!hydrated || profile) return;
    router.replace("/onboarding");
  }, [hydrated, profile, router]);

  return { hydrated, profile };
}
