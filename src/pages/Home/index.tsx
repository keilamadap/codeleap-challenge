import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import type { Post } from "../../types/Post";
import CreatePostCard from "../../components/CreatePostCard/CreatePostCard";
import PostCard from "../../components/PostCard/PostCard";
import Header from "../../components/Header/Header";
import EditModal from "../../components/EditModal/EditModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { useDeletePost } from "../../services/useDeletePost";
import { useNavigate } from "react-router-dom";
import { useInfinitePosts } from "../../services/useInfinityPosts";
import { CircularProgress } from "@mui/material";

import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();
  const CURRENT_USERNAME = localStorage.getItem("username");

  const { mutate: deletePost } = useDeletePost();

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePosts();

  const posts = data?.pages.flatMap((page) => page.results) ?? [];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletePostId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletePostId) return;

    deletePost(deletePostId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeletePostId(null);
      },
    });
  };

  const queryClient = useQueryClient();

  const handleLike = (id: number) => {
    const username = CURRENT_USERNAME!;
    const likesStorage: Record<string, Record<number, boolean>> = JSON.parse(
      localStorage.getItem("likes") || "{}"
    );

    if (!likesStorage[username]) {
      likesStorage[username] = {};
    }

    const alreadyLiked = likesStorage[username][id];

    likesStorage[username][id] = !alreadyLiked;

    localStorage.setItem("likes", JSON.stringify(likesStorage));

    queryClient.setQueryData<{
      pages: { results: Post[] }[];
      pageParams: unknown[];
    }>(["posts"], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          results: page.results.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likes: (post.likes ?? 0) + (!post.likedByMe ? 1 : -1),
                  likedByMe: !post.likedByMe,
                }
              : post
          ),
        })),
      };
    });
  };

  useEffect(() => {
    if (!CURRENT_USERNAME) {
      navigate("/");
    }
  }, [navigate, CURRENT_USERNAME]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "40px" }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#DDDDDD" }}>
      <Container
        maxWidth="md"
        sx={{
          padding: 0,
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Header />

        <Box sx={{ padding: "24px" }}>
          <CreatePostCard currentUsername={CURRENT_USERNAME!} />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              onLike={handleLike}
              post={post}
              currentUsername={CURRENT_USERNAME!}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}

          <div ref={loaderRef} style={{ height: 1 }} />

          {isFetchingNextPage && (
            <Typography sx={{ textAlign: "center", padding: "16px" }}>
              <CircularProgress size={28} />
            </Typography>
          )}
        </Box>
      </Container>

      <EditModal
        open={editModalOpen}
        post={editingPost}
        onClose={() => {
          setEditModalOpen(false);
          setEditingPost(null);
        }}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Home;
