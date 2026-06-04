import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatDateParam } from "@/shared/lib/date";
import { todayKst } from "@/shared/lib/kst";

/**
 * 기상음악 신청/취소 이벤트를 SSE로 구독해, 오늘 날짜의 음악 목록을 모든 접속자 화면에 실시간 반영한다.
 * 서버는 신청자 본인 포함 전 접속자에게 브로드캐스트하므로, 이벤트 수신 시 오늘 키를 무효화해 활성 쿼리만 재요청한다.
 * 과거 날짜를 보는 사용자는 해당 쿼리가 비활성이라 자동으로 갱신되지 않는다.
 */
export function useWakeUpMusicSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) return;

    const searchParams = new URLSearchParams();
    searchParams.set("accessToken", accessToken);

    const invalidateToday = () => {
      // 자정 롤오버에 대응하기 위해 이벤트 수신 시점에 오늘 날짜를 계산한다.
      const today = formatDateParam(todayKst());
      queryClient.invalidateQueries({
        queryKey: ["dormitory", "music", today],
      });
    };

    const eventSource = new EventSource(
      `/api/dormitory/music/subscribe?${searchParams.toString()}`,
    );

    eventSource.addEventListener("init", invalidateToday);
    eventSource.addEventListener("music-applied", invalidateToday);
    eventSource.addEventListener("music-cancelled", invalidateToday);

    return () => {
      eventSource.removeEventListener("init", invalidateToday);
      eventSource.removeEventListener("music-applied", invalidateToday);
      eventSource.removeEventListener("music-cancelled", invalidateToday);
      eventSource.close();
    };
  }, [queryClient]);
}
