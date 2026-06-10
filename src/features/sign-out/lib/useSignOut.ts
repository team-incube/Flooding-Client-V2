import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/shared/config/routes";

export const useSignOut = () => {
  const router = useRouter();

  const handleSignout = async () => {
    await fetch(AUTH_ROUTES.signout, { method: "POST" });
    sessionStorage.removeItem("access_token");
    router.push("/signin");
  };

  return { handleSignout };
};
