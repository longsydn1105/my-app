"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const [isChecking, setIsChecking] = useState(true)
  // useEffect((), [router])
  const handleLogout = () => {
    setLoading(true)
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Chào mừng Đại ca về làng!
      </Typography>

      <Button variant="outlined" color="error" disabled={loading} onClick={handleLogout}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
      </Button>
    </Box>
  );
}
