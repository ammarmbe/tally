import { useQuery } from "@tanstack/react-query";
import queryKeys from "./query-keys";
import { User } from "next-auth";

export function useUser() {
  const { data } = useQuery({
    queryKey: queryKeys.user(),
    queryFn: async () => {
      const response = await fetch("/api/user");
      return response.json() as Promise<User | null>;
    }
  });

  return data;
}
