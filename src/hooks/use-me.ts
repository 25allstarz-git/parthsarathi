import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMe } from "@/lib/account.functions";

export function useMe(options?: { enabled?: boolean }) {
  const fetchMe = useServerFn(getMe);
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe(),
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}
