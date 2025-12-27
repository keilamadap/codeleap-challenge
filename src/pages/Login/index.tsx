import { useState } from "react";
import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (!username) return;

    localStorage.setItem("username", username);

    navigate("/home");
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "#DDDDDD",
      }}
    >
      <Paper
        sx={{
          width: "500px",

          padding: "8px 24px 8px 24px",
          borderRadius: "16px",
          border: "1px solid #CCCCCC",
          backgroundColor: "#FFFFFF",
        }}
        elevation={0}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            marginBottom: "24px",
            marginTop: "5px",
          }}
        >
          Welcome to CodeLeap network!
        </Typography>

        <Typography sx={{ fontWeight: 500, marginBottom: "8px" }}>
          Please enter your username
        </Typography>

        <TextField
          fullWidth
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            marginBottom: "16px",
            "& .MuiInputBase-root": {
              height: "32px",
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              padding: "0 12px",
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disabled={!username}
            onClick={handleSubmit}
            sx={{
              width: "111px",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: !username ? "#DDD" : "#7695EC",
              color: username ? "#FFF" : "#555",
              height: "32px",
              alignSelf: "flex-end",
              "&:hover": {
                backgroundColor: username ? "#5D7BC4" : "#DDD",
              },
            }}
          >
            ENTER
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
