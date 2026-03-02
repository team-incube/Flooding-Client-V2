import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";

export default function Header() {
  return (
    <div className="flex items-end justify-between">
      <div className="flex items-end gap-3">
        <span className="text-size-title-2 font-bold text-main-text leading-none">
          홈
        </span>

        <div className="flex items-end gap-2 bg-background-surface rounded-lg px-5 py-2">
          <span className="text-size-title-2 font-bold text-main-text leading-none">
            14:02:37
          </span>
          <span className="text-size-text-3 text-sub-1 leading-none">
            26.02.22
          </span>
        </div>
      </div>

      <DarkModeToggle />
    </div>
  );
}
