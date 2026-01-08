import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import type { Post } from "../../types/Post";
import CreatePostCard from "../../components/CreatePostCard/CreatePostCard";
import PostCard from "../../components/PostCard/PostCard";
import Header from "../../components/Header/Header";
import EditModal from "../../components/EditModal/EditModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { useDeletePost } from "../../services/useDeletePost";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import { useInfinitePosts } from "../../services/useInfinityPosts";
import { useQueryClient } from "@tanstack/react-query";

type Filters = {
  text: string;
  author: string;
  onlyMine: boolean;
  onlyLiked: boolean;
  orderBy: "newest" | "oldest";
};

type InfinitePostsData = {
  pages: {
    results: Post[];
  }[];
  pageParams: unknown[];
};

const Home = () => {
  const navigate = useNavigate();
  const CURRENT_USERNAME = localStorage.getItem("username");
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useDeletePost();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePosts();

  const posts = data?.pages.flatMap((page) => page.results) ?? [];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const [filters, setFilters] = useState<Filters>({
    text: "",
    author: "",
    onlyMine: false,
    onlyLiked: false,
    orderBy: "newest",
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletePostId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletePostId) return;

    deletePost(deletePostId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeletePostId(null);
      },
    });
  };

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

    queryClient.setQueryData<InfinitePostsData>(["posts"], (oldData) => {
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

  const filteredPosts = posts.filter((post) => {
    if (
      filters.text &&
      !post.content.toLowerCase().includes(filters.text.toLowerCase())
    )
      return false;

    if (
      filters.author &&
      !post.username.toLowerCase().includes(filters.author.toLowerCase())
    )
      return false;

    if (filters.onlyMine && post.username !== CURRENT_USERNAME) return false;

    return true;
  });

  useEffect(() => {
    if (!CURRENT_USERNAME) {
      navigate("/");
    }
  }, [navigate, CURRENT_USERNAME]);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#DDDDDD" }}>
      <Container
        maxWidth="md"
        sx={{
          padding: 0,
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Header />

        <Box sx={{ padding: "24px" }}>
          <CreatePostCard currentUsername={CURRENT_USERNAME!} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search for blog content"
              sx={{
                "& .MuiInputBase-root": {
                  height: "32px",
                  borderRadius: "8px",
                },
              }}
              value={filters.text}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, text: e.target.value }))
              }
            />

            <TextField
              placeholder="Search for post author"
              sx={{
                "& .MuiInputBase-root": {
                  height: "32px",
                  borderRadius: "8px",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                },
              }}
              value={filters.author}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, author: e.target.value }))
              }
            />
          </Box>

          {filteredPosts.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "#777",
                marginTop: "32px",
              }}
            >
              No results.
            </Typography>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                onLike={handleLike}
                post={post}
                currentUsername={CURRENT_USERNAME!}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          )}

          <div ref={loaderRef} style={{ height: 1 }} />

          {isFetchingNextPage && (
            <Typography sx={{ textAlign: "center", py: 2 }}>
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
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Home;
