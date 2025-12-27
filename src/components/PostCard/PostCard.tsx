import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import trash from "../../assets/icons/trash.svg";
import edit from "../../assets/icons/edit.svg";
import type { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
  onLike: (id: number) => void;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 minute ago";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

const PostCard = ({
  post,
  currentUsername,
  onDelete,
  onEdit,
  onLike,
}: PostCardProps) => {
  const likesStorage = JSON.parse(localStorage.getItem("likes") || "{}");

  const isLiked = !!likesStorage[currentUsername]?.[post.id];

  // Conta real total de likes por todos os usuários
  const allLikesCount = Object.values(likesStorage).reduce(
    (count: number, user: any) => (user[post.id] ? count + 1 : count),
    0
  );

  const isOwner = post.username === currentUsername;

  return (
    <Card
      sx={{
        border: "1px solid #999999",
        borderRadius: "16px",
        boxShadow: "none",
        marginBottom: "24px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#7695ec",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "22px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {post.title}
        </Typography>

        {isOwner && (
          <Box sx={{ display: "flex", gap: "8px" }}>
            <IconButton
              onClick={() => onDelete(post.id)}
              sx={{
                color: "#FFFFFF",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <img src={trash} alt="Trash Icon" />
            </IconButton>
            <IconButton
              onClick={() => onEdit(post)}
              sx={{
                color: "#FFFFFF",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <img src={edit} alt="Edit Icon" />
            </IconButton>
          </Box>
        )}
      </Box>

      <CardContent sx={{ padding: "24px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              color: "#777777",
              fontWeight: 700,
              fontSize: "18px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            @{post.username}
          </Typography>
          <Typography
            sx={{
              color: "#777777",
              fontSize: "18px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {formatTimeAgo(post.created_datetime)}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#000000",
            fontSize: "18px",
            lineHeight: 1.6,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {post.content}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          marginTop: "12px",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => onLike(post.id)}>
          <span
            style={{
              fontSize: isLiked ? "24px" : "20px",
              transition: "0.2s",
              color: isLiked ? "red" : "#888",
              transform: isLiked ? "scale(1.3)" : "scale(1)",
            }}
          >
            ❤️
          </span>
        </IconButton>

        <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
          {allLikesCount}
        </Typography>
      </Box>
    </Card>
  );
};

export default PostCard;
