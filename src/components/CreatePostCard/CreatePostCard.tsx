import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useCreatePost } from "../../services/useCreatePost";

interface CreatePostCardProps {
  currentUsername: string;
}

const CreatePostCard = ({ currentUsername }: CreatePostCardProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: createPost, isPending } = useCreatePost();

  const isDisabled = !title.trim() || !content.trim() || isPending;

  const handleCreate = () => {
    if (isDisabled) return;

    createPost(
      {
        username: currentUsername,
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
        },
      }
    );
  };

  return (
    <Card
      sx={{
        border: "1px solid #999999",
        borderRadius: "16px",
        boxShadow: "none",
        marginBottom: "24px",
      }}
    >
      <CardContent sx={{ padding: "24px" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            marginBottom: "24px",
            color: "#000000",
          }}
        >
          What's on your mind?
        </Typography>

        <Typography sx={{ marginBottom: "8px" }}>Title</Typography>
        <TextField
          fullWidth
          value={title}
          placeholder="Hello world"
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            marginBottom: "24px",
            "& .MuiInputBase-root": {
              height: "32px",
              borderRadius: "8px",
            },
          }}
        />

        <Typography sx={{ marginBottom: "8px" }}>Content</Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          value={content}
          placeholder="Content here"
          onChange={(e) => setContent(e.target.value)}
          sx={{
            marginBottom: "24px",
            "& .MuiInputBase-root": {
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              height: "74px !important",
              boxSizing: "border-box",
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isDisabled}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              padding: "7px 30px",
              borderRadius: "8px",
              height: "32px",
              width: "120px",
            }}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
