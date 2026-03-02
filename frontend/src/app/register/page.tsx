"use client";

import { RegisterRequest } from "@/gen/auth/v1/auth_pb";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/auth.service";
import { PlainMessage } from "@bufbuild/protobuf";
import { Circle, Visibility, VisibilityOff } from "@mui/icons-material";

export default function RegisterPage() {
  const router = useRouter();
  // Khoi tao react hook form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử  lý khi bấm nút đăng ký
  const onSubmit = async (data: PlainMessage<RegisterRequest>) => {
    setLoading(true);
    setMessage(null);

    const { data: res, error } = await authService.register(data);
    if (error) {
      setMessage({
        type: "error",
        text: error,
      });
      setLoading(false);
      return;
    }

    setMessage({
      type: "success",
      text: "Đăng ký thành công! Đang chuyển sang trang đăng nhập...",
    });

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#d22c19" }}>
          Tạo tài khoản
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
            label="Họ và tên"
            {...register("name", { required: "Khong dc de trong ten" })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Vui long nhap email",
              pattern: { value: /^\S+@\S+$/i, message: "email sai dinh dang" },
            })}
            slotProps={{
              htmlInput: { "data-last-active-input": undefined } as React.InputHTMLAttributes<HTMLInputElement>,
            }}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Mat Khau"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Vui long nhap mat khau",
              minLength: { value: 6, message: "Pass ngắn quá, ít nhất 6 ký tự" },
            })}
            error={!!errors.password}
            helperText={errors.password?.message as string}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                "data-last-active-input": undefined,
              } as React.InputHTMLAttributes<HTMLInputElement>,
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Xac nhan mat khau"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Vui long nhap xac nhan mat khau",
              validate: (value: string) => {
                if (value !== getValues("password")) {
                  return "Hai mat khau khong khop!";
                }
                return true;
              },
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                "data-last-active-input": undefined,
              } as React.InputHTMLAttributes<HTMLInputElement>,
            }}
          />

          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Đã có tài khoản?{" "}
              <Link href="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                Đăng nhập luôn
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
