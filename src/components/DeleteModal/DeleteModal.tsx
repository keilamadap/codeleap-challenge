import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ open, onClose, onConfirm }: DeleteModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "24px",
          width: isMobile ? "90vw" : "660px",
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
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Are you sure you want to delete this item?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ padding: 0, marginTop: "32px", justifyContent: "flex-end" }}
      >
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              height: "32px",
              fontSize: "16px",
              padding: "7px 32px",
              borderColor: "#999999",
              color: "#000000",
              "&:hover": {
                borderColor: "#777777",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#FF5151",
              borderRadius: "8px",
              textTransform: "none",
              height: "32px",
              fontWeight: 700,
              fontSize: "16px",
              padding: "7px 32px",
              "&:hover": {
                backgroundColor: "#e04545",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
