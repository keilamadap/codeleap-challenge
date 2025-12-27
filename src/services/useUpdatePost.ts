import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

type UpdatePostPayload = {
  id: number;
  title: string;
  content: string;
};

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: UpdatePostPayload) => {
      const response = await api.patch(`/${id}/`, { title, content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // refetch automático após edição 💥
    },
  });
}
