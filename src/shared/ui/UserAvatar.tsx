import Image from "next/image";
import Profile from "@/shared/asset/svg/Profile";

interface UserAvatarProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export function UserAvatar({
  imageUrl,
  alt = "프로필 사진",
  className,
}: UserAvatarProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full [&_svg]:size-full ${className ?? ""}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <Profile />
      )}
    </div>
  );
}
