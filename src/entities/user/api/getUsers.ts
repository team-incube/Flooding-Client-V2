import { instance } from "@/shared/api/instance";
import type {
  SearchUsersPage,
  SearchUsersParams,
} from "@/entities/user/model/user";

export async function getUsers({
  name,
  studentNumber,
  page = 0,
  size = 500,
  sort = "studentNumber,asc",
}: SearchUsersParams = {}): Promise<SearchUsersPage> {
  const { data } = await instance.get<{ data: SearchUsersPage }>("/users", {
    params: {
      name: name || undefined,
      studentNumber: studentNumber || undefined,
      page,
      size,
      sort,
    },
  });

  return data.data;
}
