import { instance } from "@/shared/api/instance";

interface UploadProfileImageResponse {
  profileImageUrl: string;
}

export const uploadProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await instance.post<{ data: UploadProfileImageResponse }>(
    "/users/me/profile-image",
    formData,
  );

  return data.data;
};
