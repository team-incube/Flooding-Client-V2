interface ApplyCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  total: number;
  timeText: string;
  buttonText: string;
  disabled?: boolean;
  femaleNotice?: boolean;
}

export default function ApplyCard({
  title,
  icon,
  current,
  total,
  timeText,
  buttonText,
  disabled = false,
  femaleNotice = false,
}: ApplyCardProps) {
  const percent = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full bg-background-surface rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-main-text">{icon}</div>
          <span className="text-size-title-2 font-bold text-main-text">
            {title}
          </span>
        </div>

        <button className="text-size-text-3 text-sub-1 hover:text-main-text transition">
          전체보기
        </button>
      </div>

      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-bold text-main-text">{current}</span>
        <span className="text-sub-1 text-sm mb-1">/ {total}</span>
      </div>

      <div className="w-full h-2 bg-background-muted rounded-full mb-3">
        <div
          className="h-2 bg-primary rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-size-text-3 text-sub-1 mb-2">{timeText}</p>

      {femaleNotice && (
        <p className="text-size-text-3 text-primary mb-4">
          ※ 여학생의 경우 여자 사감선생님께 별도로 신청해주세요.
        </p>
      )}

      <button
        disabled={disabled}
        className={`w-full rounded-xl py-3 text-sm font-semibold transition
          ${
            disabled
              ? "bg-background-muted text-sub-1 cursor-not-allowed"
              : "bg-primary text-white hover:opacity-90"
          }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
