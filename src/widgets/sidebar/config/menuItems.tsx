import Grid from "@/shared/asset/svg/Grid";
import Bed from "@/shared/asset/svg/Bed";
import School from "@/shared/asset/svg/School";
import Club from "@/shared/asset/svg/Club";
import Student from "@/shared/asset/svg/Student";
import { ROUTES } from "@/shared/config/routes";
import type { ReactNode } from "react";

const ICONS: Record<string, (active: boolean) => ReactNode> = {
  "/": (active) => <Grid size={32} isActive={active} />,
  "/dormitory": (active) => <Bed size={32} isActive={active} />,
  "/school": (active) => <School size={32} isActive={active} />,
  "/club": (active) => <Club size={32} isActive={active} />,
  "/students": (active) => <Student size={32} isActive={active} />,
};

export const MENU_ITEMS = ROUTES.map(({ href, label }) => ({
  title: label,
  href,
  icon: ICONS[href],
}));
