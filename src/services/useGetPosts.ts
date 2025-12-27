import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "../types/Post";

async function fetchPosts(): Promise<Post[]> {
  const response = await api.get("/");
  return response.data.results ?? response.data;
}

export function useGetPosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
}
