import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const router = useRouter();

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    sessionStorage.removeItem("access_token");
    router.push("/signin");
  };

  return { handleSignout };
};
