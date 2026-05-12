import { instance } from "@/shared/api/instance";
import type { UploadClubRepresentativeImageResponse } from "../model/club";

export const uploadClubRepresentativeImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await instance.post<{
    data: UploadClubRepresentativeImageResponse;
  }>("/clubs/representative-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
};
