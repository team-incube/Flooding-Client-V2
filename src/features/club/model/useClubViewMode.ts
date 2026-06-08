import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ClubViewMode = "form" | "list";

interface UseClubViewModeParams {
  canViewForm: boolean;
}

interface UseClubViewModeResult {
  viewMode: ClubViewMode;
  setViewMode: (mode: ClubViewMode) => void;
}

function isClubViewMode(value: string | null): value is ClubViewMode {
  return value === "form" || value === "list";
}

export function useClubViewMode({
  canViewForm,
}: UseClubViewModeParams): UseClubViewModeResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawView = searchParams.get("view");
  const viewMode: ClubViewMode = isClubViewMode(rawView) ? rawView : "list";

  const setViewMode = (mode: ClubViewMode) => {
    router.replace(mode === "list" ? pathname : `${pathname}?view=${mode}`);
  };

  useEffect(() => {
    if (viewMode === "form" && !canViewForm) {
      router.replace(pathname);
    }
  }, [viewMode, canViewForm, router, pathname]);

  return { viewMode, setViewMode };
}
