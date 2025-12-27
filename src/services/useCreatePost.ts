import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

type CreatePostPayload = {
  username: string;
  title: string;
  content: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostPayload) => {
      const response = await api.post("/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
