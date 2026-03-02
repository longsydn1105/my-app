"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";
import { PlainMessage } from "@bufbuild/protobuf";
import { LoginRequest } from "@/gen/auth/v1/auth_pb";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [remeberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: PlainMessage<LoginRequest>) => {
    setLoading(true);
    setMessage(null);
    const { data: res, error } = await authService.login(data);

    if (error) {
      setMessage({ type: "error", text: error });
      setLoading(false);
      return;
    }

    Cookies.set("token", res!.token, { expires: 1, path: "/" });
    setMessage({ type: "success", text: "Đăng nhập thành công" });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}>
          Đăng nhập hệ thống
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ width: "100%", mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            {...register("email", { required: "Vui long nhap email" })}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Mat khau"
            type="password"
            {...register("password", { required: "Vui long nhap mat khau" })}
            error={!!errors.password}
            helperText={errors.password?.message as string}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={remeberMe}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember me"
            sx={{ color: "text.secondary" }}
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Chưa có tài khoản{" "}
              <Link href="/register" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                Đăng ký tại đây
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
