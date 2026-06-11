"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { uploadProfileImage } from "@/entities/user/api/uploadProfileImage";
import { userQueries } from "@/entities/user/api/userQueries";
import type { User } from "@/entities/user/model/user";

export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const meQuery = userQueries.me();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: ({ profileImageUrl }) => {
      queryClient.setQueryData<User>(meQuery.queryKey, (prev) =>
        prev ? { ...prev, profileImageUrl } : prev,
      );
      toast.success("프로필 사진이 등록되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (
        status === HttpStatusCode.BadRequest ||
        status === HttpStatusCode.UnsupportedMediaType
      ) {
        toast.error("지원하지 않는 이미지 파일입니다.");
        return;
      }
      if (status === HttpStatusCode.PayloadTooLarge) {
        toast.error("업로드 가능한 파일 크기를 초과했습니다.");
        return;
      }

      toast.error("프로필 사진 등록에 실패했습니다.");
    },
  });
}
