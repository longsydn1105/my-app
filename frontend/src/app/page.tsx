"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  // const [isChecking, setIsChecking] = useState(true)
  // useEffect((), [router])
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Chào mừng Đại ca về làng!
      </Typography>

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </Box>
  );
}
