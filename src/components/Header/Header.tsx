import { Typography, Box, Button } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#7695EC",
        height: "75px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 64px 0 36px",
        marginLeft: "-1.5rem",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: "22px",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        CodeLeap Network
      </Typography>

      <Button
        onClick={() => {
          localStorage.removeItem("username");
          window.location.href = "/";
        }}
        sx={{
          color: "#FFF",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;
