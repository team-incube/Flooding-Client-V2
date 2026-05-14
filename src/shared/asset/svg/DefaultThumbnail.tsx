import Logo from "@/shared/asset/svg/Logo";

interface DefaultClubThumbnailProps {
  className?: string;
}

export default function DefaultClubThumbnail({
  className,
}: DefaultClubThumbnailProps) {
  return (
    <div
      className={`flex items-center justify-center [--color-p-1:#BBBBCC] ${className ?? ""}`}
    >
      <Logo width={132} height={36} />
    </div>
  );
}
