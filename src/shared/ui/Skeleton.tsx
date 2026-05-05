interface SkeletonProps {
  className?: string;
}

const baseStyles = "animate-pulse rounded bg-sub-4";

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`${baseStyles} ${className ?? ""}`} />;
}
