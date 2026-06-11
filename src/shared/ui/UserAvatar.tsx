import Image from "next/image";
import Profile from "@/shared/asset/svg/Profile";

interface UserAvatarProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  sizes?: string;
}

export function UserAvatar({
  imageUrl,
  alt = "프로필 사진",
  className,
  sizes = "72px",
}: UserAvatarProps) {
  return (
    <div
      className={`bg-sub-3 relative shrink-0 overflow-hidden rounded-full [&_svg]:size-full ${className ?? ""}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <Profile />
      )}
    </div>
  );
}
