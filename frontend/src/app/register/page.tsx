"use client";

import { RegisterRequest } from "@/gen/auth/v1/auth_pb";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/auth.service";
import { PlainMessage } from "@bufbuild/protobuf";

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

  // Hàm xử  lý khi bấm nút đăng ký
  const onSubmit = async (data: PlainMessage<RegisterRequest>) => {
    setMessage(null);

    const { data: res, error } = await authService.register(data);
    if (error) {
      setMessage({
        type: "error",
        text: error,
      });
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
        {message && <Alert severity={message.type} sx={{ width: "100%", mb: 2 }}></Alert>}

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
            slotProps={{ htmlInput: { "data-last-active-input": undefined } as any }}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Mat Khau"
            type="password"
            {...register("password", {
              required: "Vui long nhap mat khau",
              minLength: { value: 6, message: "Pass ngắn quá, ít nhất 6 ký tự" },
            })}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Xac nhan mat khau"
            type="password"
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
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
            Dang ky ngay
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
