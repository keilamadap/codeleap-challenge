import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "../types/Post";

type PostsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
};

export function useInfinitePosts() {
  return useInfiniteQuery<PostsResponse>({
    queryKey: ["posts"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const limit = 3;
      const response = await api.get(`/?limit=${limit}&offset=${pageParam}`);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.results.length) return undefined;
      return pages.length * 3;
    },
  });
}
