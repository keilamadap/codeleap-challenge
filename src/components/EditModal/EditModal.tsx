import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Post } from "../../types/Post";
import { useUpdatePost } from "../../services/useUpdatePost";

interface EditModalProps {
  open: boolean;
  post: Post | null;
  onClose: () => void;
}

const EditModal = ({ open, post, onClose }: EditModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isDisabled = !title.trim() || !content.trim();
  const { mutate: updatePost, isPending } = useUpdatePost();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSave = () => {
    if (!post || isDisabled) return;

    updatePost(
      { id: post.id, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "24px",
          width: isMobile ? "90vw" : "680px",
          maxWidth: "95vw",
          border: "1px solid #999999",
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            color: "#000000",
            marginBottom: "24px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Edit item
        </Typography>

        <Typography
          sx={{
            fontSize: "16px",
            marginBottom: "8px",
            color: "#000000",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Title
        </Typography>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            marginBottom: "24px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#777777",
              },
              "&:hover fieldset": {
                borderColor: "#777777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#777777",
              },
            },
            "& .MuiInputBase-input": {
              padding: "8px 12px",
              fontSize: "14px",
            },
          }}
        />

        <Typography
          sx={{
            fontSize: "16px",
            marginBottom: "8px",
            color: "#000000",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Content
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#777777",
              },
              "&:hover fieldset": {
                borderColor: "#777777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#777777",
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "14px",
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{ padding: 0, marginTop: "24px", justifyContent: "flex-end" }}
      >
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "16px",
              padding: "7px 32px",
              height: "32px",
              borderColor: "#999999",
              color: "#000000",
              "&:hover": {
                borderColor: "#777777",
                backgroundColor: "transparent",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isDisabled || isPending}
            variant="contained"
            sx={{
              backgroundColor: "#47B960",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              height: "32px",
              fontSize: "16px",
              padding: "7px 32px",
              "&:hover": {
                backgroundColor: "#3da352",
              },
              "&.Mui-disabled": {
                backgroundColor: "#CCCCCC",
                color: "#FFFFFF",
              },
            }}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
